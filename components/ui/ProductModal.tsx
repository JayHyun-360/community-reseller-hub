"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Seller } from "@/lib/types";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import {
  MessageCircle,
  Share2,
  MoreHorizontal,
  Heart,
  X,
  ExternalLink,
  Phone,
} from "lucide-react";
import { ProductCard } from "./ProductCard";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onProductClick?: (product: Product) => void;
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
  onProductClick,
}: ProductModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    setLikeCount(product?.likeCount || 0);
  }, [product?.likeCount]);

  useEffect(() => {
    if (!product) return;

    supabase
      .from("profiles")
      .select("*")
      .eq("id", product.sellerId)
      .single()
      .then(({ data }) => {
        if (data) {
          setSeller({
            id: data.id,
            username: data.username,
            fullName: data.full_name,
            avatarUrl: data.avatar_url,
            role: data.role,
            whatsappNum: data.whatsapp_num,
            messengerUrl: data.messenger_url,
          });
        }
      });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("product_id", product.id)
          .maybeSingle()
          .then(({ data, error }) => {
            if (!error) {
              setIsLiked(!!data);
            }
          });
      }
    });
  }, [product, supabase]);

  useEffect(() => {
    if (!product?.categoryId) return;

    supabase
      .from("products")
      .select("*")
      .eq("category_id", product.categoryId)
      .neq("id", product.id)
      .eq("status", "active")
      .limit(6)
      .then(({ data }) => {
        if (data) {
          setRelatedProducts(
            data.map((p) => ({
              id: p.id,
              sellerId: p.seller_id,
              categoryId: p.category_id,
              title: p.title,
              description: p.description || "",
              price: p.price,
              images: p.images || [],
              stockQty: p.stock_qty,
              status: p.status,
              isFeatured: p.is_featured || false,
              likeCount: p.like_count || 0,
              tags: p.tags,
              createdAt: p.created_at,
            })),
          );
        }
      });
  }, [product?.categoryId, supabase]);

  const handleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    if (isLiked) {
      await supabase
        .from("favorites")
        .delete()
        .match({ user_id: user.id, product_id: product!.id });
      setIsLiked(false);
      setLikeCount((c) => c - 1);
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: user.id, product_id: product!.id });
      setIsLiked(true);
      setLikeCount((c) => c + 1);
    }
  };

  const [showContactMenu, setShowContactMenu] = useState(false);

  const handleMessageSeller = (via: "messenger" | "whatsapp") => {
    if (!seller) return;
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
  const hasContact = hasMessenger || hasWhatsApp;
  const showDropdown = hasMessenger && hasWhatsApp;

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

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
  const images = product.images?.length > 0 ? product.images : [fallbackImage];
  const hasMultipleImages = images.length > 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-900" />
          </button>

          <div className="relative w-full md:w-1/2 bg-zinc-100 flex-shrink-0">
            <div className="aspect-[4/5] md:aspect-auto md:h-full md:min-h-[500px]">
              <img
                src={imgError ? fallbackImage : images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover cursor-zoom-in"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                onClick={() => setFullscreenImage(images[currentImageIndex])}
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

          <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto max-h-[50vh] md:max-h-none">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-black text-zinc-900">
                  {product.title}
                </h2>
                <span className="text-xl font-black text-zinc-900 whitespace-nowrap">
                  ₱{product.price?.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {seller && (
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
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-100 space-y-3">
              <div className="flex gap-3">
                <button
                  onClick={handleLike}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-black text-sm transition-colors shadow-lg ${
                    isLiked
                      ? "bg-rose-500 text-white hover:bg-rose-600"
                      : "bg-zinc-900 text-white hover:bg-zinc-800"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
                  {likeCount}
                </button>
                {hasContact ? (
                  showDropdown ? (
                    <div className="flex-1 relative">
                      <button
                        onClick={() => setShowContactMenu(!showContactMenu)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-full font-black text-sm text-zinc-900 transition-colors shadow-lg"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Message
                      </button>
                      {showContactMenu && (
                        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-50">
                          {hasMessenger && (
                            <button
                              onClick={() => handleMessageSeller("messenger")}
                              className="flex items-center justify-center gap-2 px-4 py-3 hover:bg-zinc-50 w-full text-left text-sm font-medium text-zinc-900"
                            >
                              <MessageCircle className="w-4 h-4 text-[#0084FF]" />
                              Messenger
                            </button>
                          )}
                          {hasWhatsApp && (
                            <button
                              onClick={() => handleMessageSeller("whatsapp")}
                              className="flex items-center justify-center gap-2 px-4 py-3 hover:bg-zinc-50 w-full text-left text-sm font-medium text-zinc-900"
                            >
                              <Phone className="w-4 h-4 text-[#25D366]" />
                              WhatsApp
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        handleMessageSeller(
                          hasMessenger ? "messenger" : "whatsapp",
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-full font-black text-sm text-zinc-900 transition-colors shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Message
                    </button>
                  )
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 rounded-full font-black text-sm text-zinc-400 cursor-not-allowed"
                  >
                    <MessageCircle className="w-5 h-5" />
                    No Contact
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-full font-black text-sm text-zinc-900 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-full font-black text-sm text-zinc-900 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                  More
                </button>
              </div>
            </div>

            {relatedProducts.length > 0 && (
              <div className="pt-6 mt-6 border-t border-zinc-100">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-4">
                  More like this
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                  {relatedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex-shrink-0 w-44 md:w-48 cursor-pointer"
                      onClick={() => {
                        onClose();
                        onProductClick?.(p);
                      }}
                    >
                      <ProductCard product={p} showSeller={false} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {fullscreenImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
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
