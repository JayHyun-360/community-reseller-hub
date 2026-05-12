"use client";

import { useState, useMemo, useEffect } from "react";
import { Search as SearchIcon, X, Filter, Store } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ui/ProductCard";
import { ProductModal } from "@/components/ui/ProductModal";
import { SellerCard } from "@/components/ui/SellerCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { NotifyMeSheet } from "@/components/ui/NotifyMeSheet";
import {
  ProductCardSkeleton,
  SellerCardSkeleton,
} from "@/components/ui/Skeleton";
import { Product, Seller, Category } from "@/lib/types";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [tab, setTab] = useState<"products" | "sellers">("products");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [selectedCat, setSelectedCat] = useState("all");
  const [notifyProduct, setNotifyProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedProductIds, setLikedProductIds] = useState<Set<string>>(
    new Set(),
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        let profile = null;
        if (user) {
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
          profile = userProfile;
          setCurrentProfile(profile);
        }

        const [productsRes, profilesRes, categoriesRes, favoritesRes] =
          await Promise.all([
            supabase.from("products").select("*"),
            supabase.from("profiles").select("*"),
            supabase.from("categories").select("*"),
            user
              ? supabase
                  .from("favorites")
                  .select("product_id")
                  .eq("user_id", user.id)
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
              createdAt: p.created_at,
            })),
          );
        }

        if (profilesRes.data) {
          setSellers(
            profilesRes.data
              .filter((s) => s.role === "seller")
              .map((s) => ({
                id: s.id,
                username: s.username,
                fullName: s.full_name,
                avatarUrl: s.avatar_url,
                role: s.role,
                whatsappNum: s.whatsapp_num,
                messengerUrl: s.messenger_url,
              })),
          );
        }

        if (categoriesRes.data) {
          setCategories(
            categoriesRes.data.map((c) => ({
              id: c.id,
              name: c.name,
              emoji: c.emoji,
              productCount: c.product_count,
            })),
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase();

    if (tab === "products") {
      let items = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
      if (selectedCat !== "all") {
        items = items.filter((p) => p.categoryId === selectedCat);
      }
      return items;
    } else {
      return sellers.filter(
        (s) =>
          (s.fullName || s.username).toLowerCase().includes(q) ||
          s.username.toLowerCase().includes(q),
      );
    }
  }, [query, tab, selectedCat, products, sellers]);

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 pb-24 md:pb-12 pt-8">
      <div className="sticky top-20 bg-white pt-2 pb-6 z-40 space-y-8">
        {currentProfile?.role === "seller" && (
          <button
            onClick={() => router.push(`/${currentProfile.username}`)}
            className="flex items-center gap-3 w-full p-4 bg-zinc-900 text-white rounded-[2rem] hover:bg-zinc-800 transition-all shadow-lg"
          >
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Your Store
              </p>
              <p className="text-sm font-bold">View your seller profile</p>
            </div>
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex gap-8 border-b border-zinc-100">
            <button
              onClick={() => setTab("products")}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                tab === "products"
                  ? "text-indigo-600"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Products ({products.length})
              {tab === "products" && (
                <motion.div
                  layoutId="activeSearchTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"
                />
              )}
            </button>
            <button
              onClick={() => setTab("sellers")}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                tab === "sellers"
                  ? "text-indigo-600"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Sellers ({sellers.length})
              {tab === "sellers" && (
                <motion.div
                  layoutId="activeSearchTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"
                />
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              {results.length} results matching "{query || "everything"}"
            </span>
            <button className="p-2.5 bg-white border border-zinc-200 rounded-xl text-zinc-500 hover:text-indigo-600 transition-all shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {tab === "products" && (
          <div className="pt-2">
            <CategoryFilter
              categories={categories}
              selectedId={selectedCat}
              onSelect={setSelectedCat}
              showVirtualCategories={false}
            />
          </div>
        )}
      </div>

      <div className="mt-8 min-h-[40vh]">
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 lg:gap-6 space-y-3 md:space-y-4 lg:space-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div
            className={
              tab === "products"
                ? "columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 lg:gap-6 space-y-3 md:space-y-4 lg:space-y-6"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            }
          >
            {tab === "products"
              ? (results as Product[]).map((p) => (
                  <div key={p.id} onClick={() => setSelectedProduct(p)}>
                    <ProductCard
                      product={p}
                      onNotifyMe={setNotifyProduct}
                      isLiked={likedProductIds.has(p.id)}
                      onLikeChange={(productId, isLiked) => {
                        setLikedProductIds((prev) => {
                          const next = new Set(prev);
                          if (isLiked) {
                            next.add(productId);
                          } else {
                            next.delete(productId);
                          }
                          return next;
                        });
                      }}
                    />
                  </div>
                ))
              : (results as any[]).map((s) => (
                  <SellerCard key={s.id} seller={s} />
                ))}
          </div>
        ) : (
          <div className="py-40 text-center flex flex-col items-center gap-8">
            <div className="w-24 h-24 bg-white rounded-[2rem] border border-zinc-100 flex items-center justify-center text-5xl shadow-sm filter grayscale opacity-20">
              🔍
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
                No results found
              </h3>
              <p className="text-sm font-medium text-zinc-400 max-w-xs mx-auto leading-relaxed">
                We couldn&apos;t find anything matching your search. Try
                broadening your keywords.
              </p>
            </div>
            <button
              onClick={() => {
                setQuery("");
                setSelectedCat("all");
              }}
              className="px-8 py-3 bg-zinc-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <NotifyMeSheet
        product={notifyProduct}
        isOpen={!!notifyProduct}
        onClose={() => setNotifyProduct(null)}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onProductClick={setSelectedProduct}
      />
    </div>
  );
}
