"use client";

import { useState, useEffect, useRef } from "react";
import { fetchProductLikeCount, toggleFavorite } from "@/lib/favorites";
import { useRouter, usePathname } from "next/navigation";
import { Product, Seller } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { getPreferredPlatform } from "@/lib/messaging-preference";
import { ChevronLeft, X } from "lucide-react";
import { RelatedProductTile } from "./RelatedProductTile";
import { Skeleton } from "./Skeleton";
import {
  OwnerProductActions,
  VisitorProductActions,
} from "./ProductModalActions";
import { TabBar } from "./TabBar";
import { CommentsTab } from "./CommentsTab";
import { isProductOwner, sellerHasContact } from "@/lib/seller-contacts";
import { getViewerUserId } from "@/lib/viewer-session";
import { mapProfileRowToSeller } from "@/lib/map-profile";
import {
  getCachedRelatedProducts,
  setCachedRelatedProducts,
} from "@/lib/modal-related-cache";
import { ProductImage } from "./ProductImage";
import { PRODUCT_IMAGE_FALLBACK } from "@/lib/product-image";
import type { SupabaseClient } from "@supabase/supabase-js";

const RELATED_SELECT =
  "id,seller_id,category_id,title,description,price,images,stock_qty,status,is_featured,like_count,created_at";

function mapRelatedRow(p: {
  id: string;
  seller_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  price: number;
  images: string[] | null;
  stock_qty: number | null;
  status: string;
  is_featured: boolean | null;
  like_count: number | null;
  created_at: string;
}): Product {
  return {
    id: p.id,
    sellerId: p.seller_id,
    categoryId: p.category_id ?? "",
    title: p.title,
    description: p.description || "",
    price: p.price,
    images: p.images || [],
    stockQty: p.stock_qty ?? undefined,
    status: p.status,
    isFeatured: p.is_featured || false,
    likeCount: p.like_count || 0,
    createdAt: p.created_at,
  };
}

async function fetchRelatedForProduct(
  supabase: SupabaseClient,
  product: Product,
  ownerView: boolean,
): Promise<Product[]> {
  const listable = () =>
    supabase
      .from("products")
      .select(RELATED_SELECT)
      .neq("id", product.id)
      .neq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(12);

  const run = async (scoped: ReturnType<typeof listable>) => {
    const { data, error } = await scoped;
    if (error) {
      console.error("[ProductModal] related products:", error.message);
      return [] as Product[];
    }
    return (data ?? []).map(mapRelatedRow);
  };

  if (ownerView) {
    return run(listable().eq("seller_id", product.sellerId));
  }
  if (product.categoryId) {
    const items = await run(listable().eq("category_id", product.categoryId));
    if (items.length > 0) return items;
  }
  return run(listable());
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  /** Previous product in the same modal (related-pin stack). */
  onBack?: () => void;
  canGoBack?: boolean;
  /** Push onto the modal stack — do not mount a second ProductModal. */
  onProductClick?: (product: Product) => void;
  onLikeChange?: (
    productId: string,
    isLiked: boolean,
    changed?: boolean,
  ) => void;
  isLiked?: boolean;
  viewerUserId?: string | null;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function ProductModal({
  product,
  onClose,
  onBack,
  canGoBack = false,
  onProductClick,
  onLikeChange,
  isLiked: initialLiked = false,
  viewerUserId: viewerUserIdProp,
}: ProductModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [viewerUserId, setViewerUserId] = useState<string | null | undefined>(
    viewerUserIdProp,
  );
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(0);
  const isTogglingRef = useRef(false);
  const [imgError, setImgError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedCategoryName, setRelatedCategoryName] = useState<string | null>(
    null,
  );
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "comments">("details");
  const overlayScrollRef = useRef<HTMLDivElement>(null);

  // Touch swipe tracking for smooth image navigation
  const touchStartXRef = useRef(0);
  const touchStartTimeRef = useRef(0);

  const resolvedViewerId =
    viewerUserId !== undefined ? viewerUserId : (viewerUserIdProp ?? null);

  useEffect(() => {
    setCurrentImageIndex(0);
    setImgError(false);
    setActiveTab("details");
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      if (canGoBack && onBack) onBack();
      else onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [product, canGoBack, onBack, onClose]);

  useEffect(() => {
    if (!product) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [product]);

  useEffect(() => {
    setLikeCount(product?.likeCount || 0);
  }, [product?.likeCount]);

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked, product?.id]);

  useEffect(() => {
    if (!product) {
      setRelatedProducts([]);
      setRelatedLoading(false);
      setRelatedCategoryName(null);
      return;
    }

    let cancelled = false;
    const cachedRelated = getCachedRelatedProducts(product.id);

    if (cachedRelated) {
      setRelatedProducts(cachedRelated);
      setRelatedLoading(false);
    } else {
      setRelatedProducts([]);
      setRelatedLoading(true);
    }

    (async () => {
      const userId =
        viewerUserIdProp !== undefined
          ? viewerUserIdProp
          : await getViewerUserId(supabase);

      if (cancelled) return;

      setViewerUserId(userId);
      const ownerView = isProductOwner(userId, product.sellerId);

      const categoryPromise = product.categoryId
        ? supabase
            .from("categories")
            .select("name")
            .eq("id", product.categoryId)
            .single()
        : Promise.resolve({ data: null as { name: string } | null });

      const favoritePromise =
        userId && !ownerView
          ? supabase
              .from("favorites")
              .select("id")
              .eq("user_id", userId)
              .eq("product_id", product.id)
              .maybeSingle()
          : Promise.resolve({ data: null, error: null });

      const relatedPromise = cachedRelated
        ? Promise.resolve(cachedRelated)
        : fetchRelatedForProduct(supabase, product, ownerView);

      const [productRes, sellerRes, categoryRes, favoriteRes, relatedItems] =
        await Promise.all([
          supabase
            .from("products")
            .select("like_count")
            .eq("id", product.id)
            .single(),
          supabase
            .from("profiles")
            .select(
              "id,username,full_name,avatar_url,role,whatsapp_num,messenger_url,instagram_handle,tiktok_handle",
            )
            .eq("id", product.sellerId)
            .single(),
          categoryPromise,
          favoritePromise,
          relatedPromise,
        ]);

      if (cancelled) return;

      if (productRes.data) {
        setLikeCount(productRes.data.like_count || 0);
      }

      if (sellerRes.data) {
        setSeller(mapProfileRowToSeller(sellerRes.data));
      }

      setRelatedCategoryName(categoryRes.data?.name ?? null);

      if (!userId || ownerView) {
        setIsLiked(false);
      } else if (!favoriteRes.error) {
        setIsLiked(!!favoriteRes.data);
      }

      if (!cachedRelated) {
        setRelatedProducts(relatedItems);
        setCachedRelatedProducts(product.id, relatedItems);
        setRelatedLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    product?.id,
    product?.categoryId,
    product?.sellerId,
    viewerUserIdProp,
    supabase,
  ]);

  const handleLike = async () => {
    if (!product || isTogglingRef.current) return;
    const userId = await getViewerUserId(supabase);
    if (!userId) {
      router.push("/login");
      return;
    }

    isTogglingRef.current = true;
    try {
      const result = await toggleFavorite(
        supabase,
        userId,
        product.id,
        isLiked,
      );

      if (!result.ok) {
        console.error("Error toggling favorite:", result.error);
        return;
      }

      setIsLiked(result.isLiked);
      if (result.changed) {
        setLikeCount((c) => (result.isLiked ? c + 1 : Math.max(0, c - 1)));
      } else {
        const count = await fetchProductLikeCount(supabase, product.id);
        setLikeCount(count);
      }
      onLikeChange?.(product.id, result.isLiked, result.changed);
    } finally {
      isTogglingRef.current = false;
    }
  };

  const [showContactMenu, setShowContactMenu] = useState(false);

  const handleMessageSeller = (
    via: "messenger" | "whatsapp" | "instagram" | "tiktok",
  ) => {
    if (!seller) return;

    if (via === "instagram" && seller.instagramHandle) {
      window.open(`https://instagram.com/${seller.instagramHandle}`, "_blank");
      setShowContactMenu(false);
      return;
    }
    if (via === "tiktok" && seller.tiktokHandle) {
      window.open(`https://tiktok.com/@${seller.tiktokHandle}`, "_blank");
      setShowContactMenu(false);
      return;
    }

    const message = encodeURIComponent(
      `Hi! Is ${product!.title} at ₱${product!.price} available?`,
    );
    let url = "";
    if (via === "messenger" && seller.messengerUrl) {
      url = `${seller.messengerUrl}?text=${message}`;
    } else if (via === "whatsapp" && seller.whatsappNum) {
      url = `https://wa.me/${seller.whatsappNum}?text=${message}`;
    }
    if (url) window.open(url, "_blank");
    setShowContactMenu(false);
  };

  const hasMessenger = seller?.messengerUrl;
  const hasWhatsApp = seller?.whatsappNum;
  const hasInstagram = seller?.instagramHandle;
  const hasTikTok = seller?.tiktokHandle;
  const hasContact = sellerHasContact(seller);
  const showDropdown =
    [hasMessenger, hasWhatsApp, hasInstagram, hasTikTok].filter(Boolean)
      .length > 1;
  const preferredPlatform = getPreferredPlatform(!!hasMessenger, !!hasWhatsApp);
  const isOwner = isProductOwner(resolvedViewerId, product?.sellerId);

  const relatedSectionTitle = isOwner
    ? "Your other listings"
    : product?.categoryId && relatedCategoryName
      ? `More in ${relatedCategoryName}`
      : "More like this";

  const relatedSectionHint = isOwner
    ? "Other products from your shop"
    : product?.categoryId
      ? "Same category as this listing"
      : "Recently listed near you";
  const onOwnStorefront =
    !!seller?.username && pathname === `/${seller.username}`;
  const showVisitSeller = !onOwnStorefront && !!seller?.username;

  const handleRelatedClick = (next: Product) => {
    if (product?.id === next.id) return;
    onProductClick?.(next);
    overlayScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHeaderNav = () => {
    if (canGoBack && onBack) onBack();
    else onClose();
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product!.title,
        text: `Check out ${product!.title} - ₱${product!.price}`,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!product) return null;

  const images =
    product.images?.length > 0 ? product.images : [PRODUCT_IMAGE_FALLBACK];
  const hasMultipleImages = images.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayScrollRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/60 sm:backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="min-h-full flex justify-center items-end sm:items-center px-2 sm:px-4 py-2 sm:py-8">
          <motion.div
            key={product.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden w-full max-w-lg sm:max-w-2xl lg:max-w-5xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleHeaderNav}
              className="absolute top-4 left-4 z-20 p-2 bg-white/95 hover:bg-white rounded-full shadow-lg transition-colors"
              aria-label={canGoBack ? "Back to previous listing" : "Close"}
            >
              {canGoBack ? (
                <ChevronLeft className="w-5 h-5 text-zinc-900" />
              ) : (
                <X className="w-5 h-5 text-zinc-900" />
              )}
            </button>

            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full lg:w-[52%] flex-shrink-0 overflow-hidden rounded-t-2xl sm:rounded-t-3xl lg:rounded-t-none lg:rounded-l-3xl bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200/90">
                <div
                  className="relative w-full h-[36vh] max-h-[300px] sm:h-[42vh] sm:max-h-[360px] lg:h-[65vh] lg:max-h-[65vh] lg:min-h-[360px] overflow-hidden rounded-[inherit]"
                  onTouchStart={(e) => {
                    touchStartXRef.current = e.touches[0].clientX;
                    touchStartTimeRef.current = Date.now();
                  }}
                  onTouchEnd={(e) => {
                    if (!product?.images || product.images.length <= 1) return;
                    const touchEndX = e.changedTouches[0].clientX;
                    const timeDiff = Date.now() - touchStartTimeRef.current;
                    const distance = touchStartXRef.current - touchEndX;
                    const isSwipe = Math.abs(distance) > 30 && timeDiff < 300;

                    if (isSwipe) {
                      if (distance > 0) {
                        // Swiped left → next image
                        setCurrentImageIndex((i) =>
                          i < product.images.length - 1 ? i + 1 : 0,
                        );
                      } else {
                        // Swiped right → previous image
                        setCurrentImageIndex((i) =>
                          i > 0 ? i - 1 : product.images.length - 1,
                        );
                      }
                    }
                  }}
                >
                  <ProductImage
                    src={
                      imgError
                        ? PRODUCT_IMAGE_FALLBACK
                        : images[currentImageIndex]
                    }
                    alt={product.title}
                    fill
                    width={800}
                    sizes="(max-width: 1024px) 100vw, 800px"
                    priority
                    className="object-cover cursor-zoom-in rounded-[inherit]"
                    onClick={() =>
                      setFullscreenImage(images[currentImageIndex])
                    }
                    onImageError={() => setImgError(true)}
                  />
                </div>

                {hasMultipleImages && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((i) =>
                          i > 0 ? i - 1 : images.length - 1,
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                      <span className="text-lg">‹</span>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((i) =>
                          i < images.length - 1 ? i + 1 : 0,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                    >
                      <span className="text-lg">›</span>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? "bg-white w-4"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="w-full lg:w-[48%] flex flex-col lg:max-h-[65vh] lg:overflow-y-auto">
                {/* Tab Bar */}
                <TabBar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  commentCount={product.commentCount || 0}
                />

                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="p-3 sm:p-6 flex flex-col space-y-3 sm:space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {isOwner && (
                          <span className="inline-block mb-2 text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
                            Your listing
                          </span>
                        )}
                        <h2 className="text-lg sm:text-xl font-black text-zinc-900 leading-snug">
                          {product.title}
                        </h2>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-zinc-900 whitespace-nowrap shrink-0">
                        ₱{product.price?.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {seller ? (
                        <>
                          <img
                            src={seller.avatarUrl}
                            alt={seller.displayName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-bold text-zinc-900">
                              {seller.displayName}
                            </p>
                            <p className="text-xs text-zinc-500">
                              @{seller.username}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-3.5 w-24 rounded-full" />
                            <Skeleton className="h-3 w-16 rounded-full" />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="text-xs text-zinc-400">
                      Posted {formatTimeAgo(product.createdAt)}
                    </div>

                    {product.description && (
                      <div className="pt-4 border-t border-zinc-100">
                        <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">
                          Description
                        </h3>
                        <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
                          {product.description}
                        </p>
                      </div>
                    )}

                    {product.stockQty !== undefined && (
                      <div className="pt-4 border-t border-zinc-100">
                        <p className="text-sm text-zinc-500">
                          {product.stockQty > 0
                            ? `${product.stockQty} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                    )}

                    <div className="pt-6 mt-6 border-t border-zinc-100 space-y-3">
                      {isOwner ? (
                        <OwnerProductActions
                          productId={product.id}
                          likeCount={likeCount}
                          hasContact={hasContact}
                          onShare={handleShare}
                          onVisitStorefront={() =>
                            seller?.username &&
                            router.push(`/${seller.username}`)
                          }
                          showVisitStorefront={showVisitSeller}
                        />
                      ) : (
                        <VisitorProductActions
                          seller={seller}
                          hasContact={hasContact}
                          showDropdown={showDropdown}
                          showContactMenu={showContactMenu}
                          setShowContactMenu={setShowContactMenu}
                          preferredPlatform={preferredPlatform}
                          onMessage={handleMessageSeller}
                          isLiked={isLiked}
                          likeCount={likeCount}
                          onLike={handleLike}
                          onShare={handleShare}
                          onVisitSeller={() =>
                            seller?.username &&
                            router.push(`/${seller.username}`)
                          }
                          showVisitSeller={showVisitSeller}
                          sellerLoading={!seller}
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Comments Tab */}
                {activeTab === "comments" && (
                  <div className="p-3 sm:p-6 space-y-4 overflow-y-auto">
                    <CommentsTab
                      product={product}
                      viewerUserId={resolvedViewerId}
                    />
                  </div>
                )}
              </div>
            </div>

            <section className="px-3 sm:px-6 pb-4 sm:pb-8 pt-3 sm:pt-4 border-t border-zinc-100 bg-white">
              <h3 className="text-sm font-black text-zinc-900 tracking-tight">
                {relatedSectionTitle}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 mb-3 sm:mb-4">
                {relatedSectionHint} · tap to open above
              </p>
              {relatedLoading ? (
                <div className="columns-2 sm:columns-3 gap-2 sm:gap-4">
                  {[0, 1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      className="w-full h-36 mb-3 sm:mb-4 break-inside-avoid rounded-2xl"
                    />
                  ))}
                </div>
              ) : relatedProducts.length > 0 ? (
                <div className="columns-2 sm:columns-3 gap-2 sm:gap-4 [column-fill:balance]">
                  {relatedProducts.map((p) => (
                    <RelatedProductTile
                      key={p.id}
                      product={p}
                      onClick={() => handleRelatedClick(p)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-400 py-2">
                  {isOwner
                    ? "List another product to show more here."
                    : "No similar listings yet — check back as sellers add more."}
                </p>
              )}
            </section>
          </motion.div>
        </div>

        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-md flex items-center justify-center"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 p-3 bg-zinc-900/10 hover:bg-zinc-900/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-zinc-900" />
            </button>
            <img
              src={fullscreenImage}
              alt={product?.title}
              className="max-w-full max-h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
