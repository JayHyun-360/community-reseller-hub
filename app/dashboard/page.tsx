"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import {
  TrendingUp,
  ShoppingBag,
  Eye,
  Heart,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { Product } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if user is a seller
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "seller") {
        router.push("/onboarding");
        return;
      }

      setUser(user);

      const { data: productsData } = await supabase
        .from("products")
        .select("*, categories(name, emoji)")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (productsData) {
        setProducts(
          productsData.map((p) => ({
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
        const likes = productsData.reduce(
          (sum, p) => sum + (p.like_count || 0),
          0,
        );
        setTotalViews(likes);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      alert("Failed to delete listing");
    } else {
      setProducts(products.filter((p) => p.id !== productId));
    }
  };

  const stats = [
    {
      label: "Total Listings",
      value: products.length,
      icon: ShoppingBag,
      color: "text-zinc-400",
    },
    {
      label: "Total Likes",
      value: totalViews,
      icon: Heart,
      color: "text-rose-500",
    },
  ];

  if (loading) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 pb-24 md:pb-12 pt-12 bg-white min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pl-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-zinc-900">
            Seller Dashboard
          </h1>
          <p className="text-zinc-500 font-medium">
            Track your listings and engagement metrics.
          </p>
        </div>
        <Button
          size="lg"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => router.push("/dashboard/products/new")}
          className="rounded-[1.5rem]"
        >
          Add New Product
        </Button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200 p-8 rounded-[2rem] shadow-sm space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div
                className={`p-3 rounded-2xl bg-zinc-50 border border-zinc-100 ${stat.color}`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <div className="text-4xl font-black tracking-tighter text-zinc-900">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-[0.2em] mt-1">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900">
              Your Listings
            </h2>
          </div>
          <div className="bg-white border border-zinc-200 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="divide-y divide-zinc-100">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-6 p-6 hover:bg-zinc-50 transition-colors"
                >
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-16 h-16 rounded-2xl object-cover border border-zinc-100 shadow-sm"
                  />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-base text-zinc-900 truncate">
                      {p.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold text-indigo-600">
                        ₱{p.price}
                      </span>
                      <span className="text-xs text-rose-500 flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {p.likeCount}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/dashboard/products/${p.id}`)}
                      className="p-2 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-xl hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 px-2">
            Engagement
          </h2>
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 flex flex-col items-center gap-6 text-center shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-bold text-zinc-900">
                Total Profile Views
              </h4>
              <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                Share your shop link to get more visibility!
              </p>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white shadow-xl">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">
              Top Products
            </p>
            <div className="space-y-4">
              {products.slice(0, 3).map((p, i) => (
                <div key={p.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate pr-4">
                    {p.title}
                  </span>
                  <span className="text-sm font-bold text-rose-400">
                    {p.likeCount} likes
                  </span>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-zinc-500 text-sm">No listings yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
