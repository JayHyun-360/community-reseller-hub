"use client";

import {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import { Search as SearchIcon, X, Filter, Store } from "lucide-react";
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
  const productModal = useProductModalStack();
  const supabase = createClient();
  const tabsBarRef = useRef<HTMLDivElement>(null);
  const productsTabRef = useRef<HTMLButtonElement>(null);
  const sellersTabRef = useRef<HTMLButtonElement>(null);
  const [tabUnderline, setTabUnderline] = useState({ left: 0, width: 0 });
  const [tabUnderlineReady, setTabUnderlineReady] = useState(false);

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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
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

        const [productsRes, profilesRes, categoriesRes, favoritesRes] =
          await Promise.all([
            supabase.from("products").select("*"),
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

  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedQuery = useDebounce(query, 300);

  // Keep `query` state in sync with the URL `q` param so navigation updates results
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [searchParams]);

  const normalizedProducts = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        titleLower: (p.title || "").toLowerCase(),
        descriptionLower: (p.description || "").toLowerCase(),
      })),
    [products],
  );

  const normalizedSellers = useMemo(
    () =>
      sellers.map((s) => ({
        ...s,
        fullNameLower: (s.fullName || "").toLowerCase(),
        usernameLower: (s.username || "").toLowerCase(),
      })),
    [sellers],
  );

  const sellersById = useMemo(
    () => new Map(sellers.map((s) => [s.id, s])),
    [sellers],
  );

  const results = useMemo(() => {
    const q = debouncedQuery.toLowerCase();

    if (tab === "products") {
      let items = normalizedProducts;

      if (q) {
        items = items.filter(
          (p) => p.titleLower.includes(q) || p.descriptionLower.includes(q),
        );
      }

      if (selectedCat !== "all") {
        items = items.filter((p) => p.categoryId === selectedCat);
      }

      return items;
    } else {
      let items = normalizedSellers;

      if (q) {
        items = items.filter(
          (s) => s.fullNameLower.includes(q) || s.usernameLower.includes(q),
        );
      }

      return items;
    }
  }, [debouncedQuery, tab, selectedCat, normalizedProducts, normalizedSellers]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24 md:pb-12 pt-8">
      {/* Non-sticky header elements */}
      <div className="space-y-6 mb-6">
        {/* Mobile Search Bar */}
        <SearchAutocomplete initial={query} />

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
      </div>

      {/* Navigation Tabs & Filters */}
      <div className="bg-white pt-4 pb-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div
            ref={tabsBarRef}
            className="relative flex gap-8 border-b border-zinc-100"
          >
            <button
              ref={productsTabRef}
              type="button"
              onClick={() => setTab("products")}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                tab === "products"
                  ? "text-indigo-600"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Products ({products.length})
            </button>
            <button
              ref={sellersTabRef}
              type="button"
              onClick={() => setTab("sellers")}
              className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
                tab === "sellers"
                  ? "text-indigo-600"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Sellers ({sellers.length})
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
              showVirtualCategories={true}
            />
          </div>
        )}
      </div>

      <div className="mt-8 min-h-[40vh]">
        {loading ? (
          <div
            key="loading"
            className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-4 lg:gap-6 space-y-2 md:space-y-4 lg:space-y-6"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="break-inside-avoid">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div
            key={`${tab}-${selectedCat}-${debouncedQuery}`}
            className={
              tab === "products"
                ? "columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2 md:gap-4 lg:gap-6 space-y-2 md:space-y-4 lg:space-y-6 [content-visibility:auto]"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            }
          >
            {tab === "products"
              ? (results as Product[]).map((p, index) => (
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
              : (results as any[]).map((s) => (
                  <div key={s.id}>
                    <SellerCard seller={s} />
                  </div>
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
