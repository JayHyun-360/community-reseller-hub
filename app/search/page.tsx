"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import { Store } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ui/ProductCard";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";
import { ProductModal } from "@/components/ui/ProductModalLazy";
import { SellerCard } from "@/components/ui/SellerCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { NotifyMeSheet } from "@/components/ui/NotifyMeSheet";
import {
  ProductCardSkeleton,
  SellerCardSkeleton,
} from "@/components/ui/Skeleton";
import { applyLikeChange } from "@/lib/handle-like-change";
import { useProductModalStack } from "@/lib/use-product-modal-stack";
import { getViewerUserId } from "@/lib/viewer-session";
import { useDebounce } from "@/lib/use-debounce";
import { Product, Seller, Category } from "@/lib/types";

function mapProductRow(p: any): Product {
  return {
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
  };
}

function mapSellerRow(s: any): Seller {
  return {
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
  };
}

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
  const productModal = useProductModalStack();
  const supabase = createClient();
  const tabsBarRef = useRef<HTMLDivElement>(null);
  const productsTabRef = useRef<HTMLButtonElement>(null);
  const sellersTabRef = useRef<HTMLButtonElement>(null);
  const [tabUnderline, setTabUnderline] = useState({ left: 0, width: 0 });
  const [tabUnderlineReady, setTabUnderlineReady] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const measureTabUnderline = useCallback(() => {
    const active =
      tab === "products" ? productsTabRef.current : sellersTabRef.current;
    const bar = tabsBarRef.current;
    if (!active || !bar) return;
    setTabUnderline({
      left: active.offsetLeft,
      width: active.offsetWidth,
    });
  }, [tab]);

  useLayoutEffect(() => {
    measureTabUnderline();
    const frame = requestAnimationFrame(() => setTabUnderlineReady(true));
    return () => cancelAnimationFrame(frame);
  }, [measureTabUnderline, products.length, sellers.length]);

  useEffect(() => {
    window.addEventListener("resize", measureTabUnderline);
    return () => window.removeEventListener("resize", measureTabUnderline);
  }, [measureTabUnderline]);

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

  // Load user, categories and favorites once on mount
  useEffect(() => {
    async function loadStatic() {
      try {
        const userId = await getViewerUserId(supabase);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user ?? null;
        setCurrentUser(user);

        let profile = null;
        if (userId) {
          const { data: userProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
          profile = userProfile;
          setCurrentProfile(profile);
        }

        const [categoriesRes, favoritesRes] = await Promise.all([
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
        console.error("Error fetching static data:", error);
      }
    }
    loadStatic();
  }, []);

  const debouncedQuery = useDebounce(query, 300);

  // Keep `query` state in sync with the URL `q` param
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  // Server-side search: call RPCs when query, tab, or category changes
  useEffect(() => {
    let cancelled = false;

    async function runSearch() {
      setLoading(true);
      try {
        const q = debouncedQuery.trim();
        const catId =
          selectedCat !== "all" &&
          selectedCat !== "suggested" &&
          selectedCat !== "trending"
            ? selectedCat
            : undefined;

        if (tab === "products") {
          // Try the search_products RPC first, fallback to direct query
          const { data: rpcData, error: rpcError } = await supabase.rpc(
            "search_products",
            {
              q: q || "",
              cat_id: catId ?? null,
              result_limit: 50,
              result_offset: 0,
            },
          );

          if (!cancelled) {
            if (rpcError) {
              console.warn(
                "search_products RPC failed, falling back to direct query",
                rpcError,
              );
              let qb = supabase
                .from("products")
                .select("*")
                .neq("status", "draft")
                .order("created_at", { ascending: false })
                .limit(50);

              if (q) {
                qb = qb.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
              }
              if (catId) {
                qb = qb.eq("category_id", catId);
              }

              const { data } = await qb;
              if (!cancelled && data) {
                setProducts(data.map(mapProductRow));
              }
            } else {
              setProducts((rpcData || []).map(mapProductRow));
            }
          }
        }

        if (tab === "sellers") {
          const { data: rpcData, error: rpcError } = await supabase.rpc(
            "search_sellers",
            {
              q: q || "",
              result_limit: 50,
              result_offset: 0,
            },
          );

          if (!cancelled) {
            if (rpcError) {
              console.warn(
                "search_sellers RPC failed, falling back to direct query",
                rpcError,
              );
              let qb = supabase
                .from("profiles")
                .select("*")
                .eq("role", "seller")
                .order("created_at", { ascending: false })
                .limit(50);

              if (q) {
                qb = qb.or(`username.ilike.%${q}%,full_name.ilike.%${q}%`);
              }

              const { data } = await qb;
              if (!cancelled && data) {
                setSellers(data.map(mapSellerRow));
              }
            } else {
              setSellers((rpcData || []).map(mapSellerRow));
            }
          }
        }
      } catch (error) {
        console.error("Error running search:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    runSearch();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, tab, selectedCat]);

  const sellersById = useMemo(
    () => new Map(sellers.map((s) => [s.id, s])),
    [sellers],
  );

  const results = tab === "products" ? products : sellers;

  // Extract suggested tags from products
  useEffect(() => {
    if (tab === "products" && results.length > 0) {
      const tagFreq = new Map<string, number>();
      (results as Product[]).forEach((p) => {
        (p.tags || []).forEach((tag) => {
          tagFreq.set(tag, (tagFreq.get(tag) || 0) + 1);
        });
      });
      const topTags = Array.from(tagFreq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([tag]) => tag);
      setSuggestedTags(topTags);
    } else {
      setSuggestedTags([]);
    }
  }, [results, tab]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-20 md:pb-12 pt-4 md:pt-8">
      {/* Mobile Search Input */}
      <div className="lg:hidden mb-4">
        <SearchAutocomplete
          initial={query}
          placeholder="Search local finds..."
          size="lg"
          className="w-full"
        />
      </div>

      {/* Seller Profile Button */}
      {currentProfile?.role === "seller" && (
        <div className="mb-4 md:mb-6">
          <button
            onClick={() => router.push(`/${currentProfile.username}`)}
            className="flex items-center gap-3 w-full p-3 md:p-4 bg-zinc-900 text-white rounded-2xl md:rounded-[2rem] hover:bg-zinc-800 transition-all shadow-lg"
          >
            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Your Store
              </p>
              <p className="text-xs md:text-sm font-bold truncate">
                View your seller profile
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Navigation Tabs & Filters */}
      <div className="bg-white pt-4 pb-4 md:pb-6 space-y-4 md:space-y-6 -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0 sticky top-20 z-40 border-b border-zinc-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
          <div
            ref={tabsBarRef}
            className="relative flex gap-4 md:gap-8 border-b border-zinc-100"
          >
            <button
              ref={productsTabRef}
              type="button"
              onClick={() => setTab("products")}
              className={`pb-3 md:pb-4 text-xs font-black uppercase tracking-[0.15em] md:tracking-[0.2em] transition-colors duration-300 whitespace-nowrap ${
                tab === "products"
                  ? "text-indigo-600"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Products
            </button>
            <button
              ref={sellersTabRef}
              type="button"
              onClick={() => setTab("sellers")}
              className={`pb-3 md:pb-4 text-xs font-black uppercase tracking-[0.15em] md:tracking-[0.2em] transition-colors duration-300 whitespace-nowrap ${
                tab === "sellers"
                  ? "text-indigo-600"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Sellers
            </button>
            <div
              aria-hidden
              className={`absolute bottom-0 h-1 bg-indigo-600 rounded-t-full ${
                tabUnderlineReady
                  ? "transition-[left,width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none"
                  : ""
              }`}
              style={{
                left: tabUnderline.left,
                width: tabUnderline.width,
              }}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[9px] md:text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex-1 md:flex-none">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {tab === "products" && (
          <div className="space-y-4">
            <div>
              <CategoryFilter
                categories={categories}
                selectedId={selectedCat}
                onSelect={setSelectedCat}
                showVirtualCategories={true}
              />
            </div>

            {/* Guided Search Filter Chips */}
            {query && suggestedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest w-full md:w-auto">
                  Related:
                </span>
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      const newQuery = `${query} ${tag}`;
                      router.push(`/search?q=${encodeURIComponent(newQuery)}`);
                    }}
                    className="px-2.5 md:px-3 py-1 md:py-1.5 bg-zinc-100 hover:bg-indigo-100 text-zinc-700 hover:text-indigo-700 rounded-full text-[11px] md:text-xs font-semibold transition-all border border-zinc-200 hover:border-indigo-300 whitespace-nowrap"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 md:mt-8 min-h-[40vh]">
        {loading ? (
          <div
            key="loading"
            className={
              tab === "products"
                ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            }
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid">
                {tab === "products" ? (
                  <ProductCardSkeleton />
                ) : (
                  <SellerCardSkeleton />
                )}
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div
            key={`${tab}-${selectedCat}-${debouncedQuery}`}
            className={
              tab === "products"
                ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 space-y-2 sm:space-y-3 md:space-y-4 lg:space-y-6 [content-visibility:auto]"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
            }
          >
            {tab === "products"
              ? (results as Product[]).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => productModal.open(p)}
                    className="cursor-pointer break-inside-avoid"
                  >
                    <ProductCard
                      product={p}
                      sellerData={sellersById.get(p.sellerId)}
                      onNotifyMe={setNotifyProduct}
                      isLiked={likedProductIds.has(p.id)}
                      onLikeChange={handleLikeChange}
                      viewerUserId={currentUser?.id ?? null}
                    />
                  </div>
                ))
              : (results as Seller[]).map((s) => (
                  <div key={s.id}>
                    <SellerCard seller={s} />
                  </div>
                ))}
          </div>
        ) : (
          <div className="py-20 md:py-40 text-center flex flex-col items-center gap-6 md:gap-8">
            <div className="w-16 md:w-24 h-16 md:h-24 bg-white rounded-2xl md:rounded-[2rem] border border-zinc-100 flex items-center justify-center text-3xl md:text-5xl shadow-sm filter grayscale opacity-20">
              🔍
            </div>
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight">
                No results found
              </h3>
              <p className="text-xs md:text-sm font-medium text-zinc-400 max-w-xs mx-auto leading-relaxed">
                We couldn&apos;t find anything matching your search. Try
                broadening your keywords.
              </p>
            </div>
            <button
              onClick={() => {
                setQuery("");
                setSelectedCat("all");
                router.push("/search");
              }}
              className="px-6 md:px-8 py-2.5 md:py-3 bg-zinc-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
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
        product={productModal.product}
        isLiked={
          productModal.product
            ? likedProductIds.has(productModal.product.id)
            : false
        }
        viewerUserId={currentUser?.id ?? null}
        canGoBack={productModal.canGoBack}
        onBack={productModal.back}
        onClose={productModal.close}
        onProductClick={productModal.goToRelated}
        onLikeChange={handleLikeChange}
      />
    </div>
  );
}
/ /   b u i l d   b u m p  
 