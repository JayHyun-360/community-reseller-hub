"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { LatestProductsStrip } from "@/components/ui/LatestProductsStrip";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductModal } from "@/components/ui/ProductModalLazy";
import { ProductImage } from "@/components/ui/ProductImage";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { NotifyMeSheet } from "@/components/ui/NotifyMeSheet";
import { BrowseMoreSheet } from "@/components/ui/BrowseMoreSheet";
import {
  ProductCardSkeleton,
  TrendingCardSkeleton,
} from "@/components/ui/Skeleton";
import { applyLikeChange } from "@/lib/handle-like-change";
import { useProductModalStack } from "@/lib/use-product-modal-stack";
import { getViewerUserId } from "@/lib/viewer-session";
import { Product, Seller, Category } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Home page - NearByt
export default function HomePage() {
  const [selectedCat, setSelectedCat] = useState("all");
  const [showBrowseMore, setShowBrowseMore] = useState(false);
  const [suggestedCategoryIds, setSuggestedCategoryIds] = useState<string[]>(
    [],
  );
  const [notifyProduct, setNotifyProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedProductIds, setLikedProductIds] = useState<Set<string>>(
    new Set(),
  );
  const productModal = useProductModalStack();
  const [viewerUserId, setViewerUserId] = useState<string | null>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const handleLikeChange = (
    productId: string,
    isLiked: boolean,
    changed = true,
  ) => {
    applyLikeChange(
      productId,
      isLiked,
      changed,
      setLikedProductIds,
      setProducts,
      productModal.setCurrentProduct,
    );
  };

  useEffect(() => {
    async function fetchData() {
      const userId = await getViewerUserId(supabase);
      setViewerUserId(userId);

      const [productsRes, sellersRes, categoriesRes, favoritesRes] =
        await Promise.all([
          supabase
            .from("products")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase.from("profiles").select("*"),
          supabase.from("categories").select("*"),
          userId
            ? supabase
                .from("favorites")
                .select("product_id")
                .eq("user_id", userId)
            : Promise.resolve({ data: [] }),
        ]);

      if (favoritesRes.data) {
        setLikedProductIds(
          new Set(favoritesRes.data.map((f: any) => f.product_id)),
        );
      }

      if (productsRes.data) {
        setProducts(
          productsRes.data.map((p) => ({
            id: p.id,
            sellerId: p.seller_id,
            categoryId: p.category_id,
            title: p.title,
            description: p.description,
            price: p.price,
            images: p.images || [],
            stockQty: p.stock_qty,
            status: p.status,
            isFeatured: p.is_featured,
            likeCount: p.like_count || 0,
            viewCount: p.view_count,
            tags: p.tags || [],
            createdAt: p.created_at,
          })),
        );
      }

      if (sellersRes.data) {
        setSellers(
          sellersRes.data.map((s) => ({
            id: s.id,
            username: s.username,
            fullName: s.full_name,
            displayName: s.full_name || s.username,
            avatarUrl: s.avatar_url,
            role: s.role,
            whatsappNum: s.whatsapp_num,
            messengerUrl: s.messenger_url,
            instagramHandle: s.instagram_handle,
            tiktokHandle: s.tiktok_handle,
          })),
        );
      }

      if (categoriesRes.data) {
        const cats = categoriesRes.data.map((c) => ({
          id: c.id,
          name: c.name,
          emoji: c.emoji,
          productCount: c.product_count,
        }));
        setCategories(cats);
        if (cats.length >= 3) {
          setSuggestedCategoryIds([cats[0].id, cats[1].id, cats[2].id]);
        }
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const getFilteredProducts = () => {
    switch (selectedCat) {
      case "all":
        return products;
      case "suggested":
        if (suggestedCategoryIds.length > 0) {
          return products.filter((p) =>
            suggestedCategoryIds.includes(p.categoryId),
          );
        }
        return products.slice(0, 8);
      case "trending":
        return [...products]
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 12);
      default:
        return products.filter((p) => p.categoryId === selectedCat);
    }
  };

  const filteredProducts = getFilteredProducts();

  const sellersById = useMemo(
    () => new Map(sellers.map((s) => [s.id, s])),
    [sellers],
  );

  const scrollTrending = (direction: "left" | "right") => {
    if (trendingRef.current) {
      const scrollAmount = 300;
      trendingRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-24 md:pb-12 bg-white min-h-screen px-4 md:px-0">
      <section className="pt-12 px-0 md:px-6">
        <div className="max-w-2xl px-2">
          <h1 className="text-4xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[0.9]">
            Find your next favorite thing{" "}
            <span className="text-zinc-400">nearby.</span>
          </h1>
          <p className="mt-8 text-zinc-500 font-medium text-lg md:text-2xl max-w-lg leading-relaxed">
            NearByt connects you with local artisans and curators in a visual
            scroll of discovery.
          </p>
        </div>

        <div className="mt-16 relative">
          <button
            onClick={() => scrollTrending("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-900" />
          </button>
          <button
            onClick={() => scrollTrending("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-zinc-900" />
          </button>
          <div
            ref={trendingRef}
            className="overflow-x-auto pb-8 hide-scrollbar scroll-smooth px-4 md:px-8"
          >
            <div className="flex gap-8">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <TrendingCardSkeleton key={i} />
                  ))
                : products.slice(0, 6).map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => productModal.open(item)}
                      className="flex-shrink-0 w-44 md:w-64 group cursor-pointer"
                    >
                      <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100 mb-4 shadow-xl shadow-zinc-200/50 [@media(hover:hover)]:group-hover:scale-[1.02] [@media(hover:hover)]:transition-transform [@media(hover:hover)]:duration-500">
                        <ProductImage
                          src={item.images[0]}
                          alt={item.title}
                          fill
                          width={400}
                          sizes="256px"
                          className="object-cover"
                        />
                      </div>
                      <div className="px-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                          Trending
                        </p>
                        <h4 className="text-sm font-bold text-zinc-900 truncate leading-none">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 px-0 md:px-6">
        <LatestProductsStrip
          products={products}
          onProductClick={productModal.open}
        />
      </div>

      <section className="px-0 md:px-6 py-12">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                Today&apos;s Picks
              </h2>
              <p className="text-[11px] text-zinc-400 font-black uppercase tracking-[0.2em]">
                Curated from the neighborhood
              </p>
            </div>
            <div>
              <CategoryFilter
                categories={categories}
                selectedId={selectedCat}
                onSelect={setSelectedCat}
                onBrowseMore={() => setShowBrowseMore(true)}
              />
            </div>
          </div>

          <div
            key={selectedCat}
            className="min-h-[40vh] md:min-h-[50vh] columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-1.5 md:gap-3 lg:gap-4 [content-visibility:auto]"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="break-inside-avoid mb-1.5 md:mb-3 lg:mb-4"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              : filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => productModal.open(p)}
                    className="cursor-pointer break-inside-avoid mb-1.5 md:mb-3 lg:mb-4"
                  >
                    <ProductCard
                      product={p}
                      sellerData={sellersById.get(p.sellerId)}
                      onNotifyMe={setNotifyProduct}
                      isLiked={likedProductIds.has(p.id)}
                      onLikeChange={handleLikeChange}
                      viewerUserId={viewerUserId}
                    />
                  </div>
                ))}
          </div>

          {filteredProducts.length === 0 && !loading && (
            <div className="py-40 text-center flex flex-col items-center gap-6">
              <div className="text-6xl filter grayscale opacity-10">🏙️</div>
              <p className="text-zinc-300 font-black uppercase tracking-[0.3em] text-[10px]">
                No finds in this category today
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="px-8 py-20 border-t border-zinc-50 text-center">
        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
        </div>
        <p className="text-[12px] font-black text-zinc-900 uppercase tracking-[0.4em] mb-3">
          NearByt
        </p>
        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
          The neighborhood&apos;s visual catalog • Discover your local favorites
        </p>
      </footer>

      <NotifyMeSheet
        product={notifyProduct}
        isOpen={!!notifyProduct}
        onClose={() => setNotifyProduct(null)}
      />

      <ProductModal
        product={productModal.product}
        isLiked={
          productModal.product
            ? likedProductIds.has(productModal.product.id)
            : false
        }
        viewerUserId={viewerUserId}
        canGoBack={productModal.canGoBack}
        onBack={productModal.back}
        onClose={productModal.close}
        onProductClick={productModal.goToRelated}
        onLikeChange={handleLikeChange}
      />

      <BrowseMoreSheet
        categories={categories}
        isOpen={showBrowseMore}
        onClose={() => setShowBrowseMore(false)}
        onSelectCategory={(id) => setSelectedCat(id)}
      />
    </div>
  );
}
