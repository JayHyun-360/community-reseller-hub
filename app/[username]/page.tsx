"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryFilter } from "@/components/ui/CategoryFilter";
import { BrowseMoreSheet } from "@/components/ui/BrowseMoreSheet";
import { Button } from "@/components/ui/Button";
import { Share2, MessageCircle, Phone as WhatsApp } from "lucide-react";
import { Product, Seller, Category } from "@/lib/types";

export default function StorefrontPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState("all");
  const [showBrowseMore, setShowBrowseMore] = useState(false);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      const [sellerRes, productsRes, categoriesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("username", username).single(),
        supabase.from("products").select("*"),
        supabase.from("categories").select("*"),
      ]);

      if (sellerRes.data) {
        setSeller({
          id: sellerRes.data.id,
          username: sellerRes.data.username,
          fullName: sellerRes.data.full_name,
          avatarUrl: sellerRes.data.avatar_url,
          bio: sellerRes.data.bio,
          role: sellerRes.data.role,
          whatsappNum: sellerRes.data.whatsapp_num,
          messengerUrl: sellerRes.data.messenger_url,
        });
      } else if (sellerRes.error?.code === "PGRST116") {
        setNotFound(true);
      }
      setLoading(false);

      if (productsRes.data) {
        setProducts(
          productsRes.data
            .filter((p) => p.seller_id === sellerRes.data?.id)
            .map((p) => ({
              id: p.id,
              sellerId: p.seller_id,
              categoryId: p.category_id,
              title: p.title,
              description: p.description,
              price: p.price,
              images: p.images || [],
              isFeatured: p.is_featured,
              likeCount: p.like_count || 0,
              createdAt: p.created_at,
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
    }
    fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-sm font-medium text-zinc-400">Loading store...</p>
        </div>
      </div>
    );
  }

  if (notFound || !seller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-black text-zinc-900">Store Not Found</h1>
          <p className="mt-2 text-zinc-500">
            This seller doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const getFilteredProducts = () => {
    if (selectedCat === "all") {
      return products;
    }
    return products.filter((p) => p.categoryId === selectedCat);
  };

  const filteredProducts = getFilteredProducts();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-12 min-h-screen bg-white">
      <div className="relative pt-12 px-4">
        <div className="bg-white rounded-[2rem] overflow-hidden border border-zinc-100 shadow-sm">
          <div className="h-40 md:h-56 w-full bg-zinc-900 flex items-center justify-center overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 flex flex-wrap gap-4 p-4 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-lg bg-white/20 border border-white/10"
                />
              ))}
            </div>
            <h2 className="text-6xl font-black text-white/10 tracking-tighter uppercase whitespace-nowrap select-none">
              {seller.fullName || seller.username}
            </h2>
          </div>

          <div className="px-6 -mt-16 md:-mt-20 flex flex-col items-center text-center pb-8">
            <div className="relative group">
              <img
                src={seller.avatarUrl || "https://picsum.photos/200"}
                alt={seller.fullName || seller.username}
                className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-8 border-white object-cover shadow-2xl transition-transform group-hover:scale-105"
              />
            </div>

            <div className="mt-6 space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-900">
                {seller.fullName || seller.username}
              </h1>
              <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest italic">
                @{seller.username}
              </p>
            </div>

            <p className="mt-8 text-base text-zinc-500 max-w-lg leading-relaxed font-medium">
              {seller.bio || "No bio yet."}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4 w-full max-w-md">
              <Button
                fullWidth
                size="lg"
                leftIcon={<MessageCircle className="w-5 h-5" />}
                className="bg-[#0084FF] text-white hover:bg-[#0084FF]/90 rounded-3xl"
                onClick={() => window.open(seller.messengerUrl, "_blank")}
              >
                Message on Messenger
              </Button>
              {seller.whatsappNum && (
                <Button
                  fullWidth
                  size="lg"
                  variant="outline"
                  leftIcon={<WhatsApp className="w-5 h-5 text-[#25D366]" />}
                  className="rounded-3xl border-zinc-200 text-zinc-600"
                  onClick={() =>
                    window.open(`https://wa.me/${seller.whatsappNum}`, "_blank")
                  }
                >
                  Chat on WhatsApp
                </Button>
              )}
            </div>

            <div className="mt-12 grid grid-cols-2 gap-1 w-full max-w-xl mx-auto rounded-3xl overflow-hidden border border-zinc-100 bg-zinc-50">
              <div className="bg-white p-6">
                <div className="text-2xl font-black text-zinc-900">
                  {products.length}
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                  Products
                </div>
              </div>
              <div className="bg-white p-6 border-l border-zinc-100">
                <div className="text-2xl font-black text-rose-500">
                  {products.reduce((sum, p) => sum + (p.likeCount || 0), 0)}
                </div>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                  Total Likes
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="absolute top-16 right-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white border border-white/20 transition-all shadow-xl"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-16 px-4">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-2xl font-black tracking-tighter text-zinc-900">
            Inventory
          </h2>
        </div>

        <div className="px-4 mb-8">
          <CategoryFilter
            categories={categories}
            selectedId={selectedCat}
            onSelect={setSelectedCat}
            onBrowseMore={() => setShowBrowseMore(true)}
            showVirtualCategories={false}
          />
        </div>

        <div className="columns-2 md:columns-3 gap-6 px-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} showSeller={false} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-24 bg-white border-2 border-dashed border-zinc-100 rounded-3xl text-center text-zinc-400 font-bold uppercase tracking-widest text-xs">
            No products found in this category...
          </div>
        )}
      </div>

      <BrowseMoreSheet
        categories={categories}
        isOpen={showBrowseMore}
        onClose={() => setShowBrowseMore(false)}
        onSelectCategory={(id) => setSelectedCat(id)}
      />
    </div>
  );
}
