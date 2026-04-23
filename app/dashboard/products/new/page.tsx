"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_CATEGORIES, getImageForProduct } from "@/lib/mock-data";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { Camera, ChevronDown, Upload } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "cat2",
    description: "",
    price: "",
    stockQty: "",
    isFeatured: false,
    images: [] as string[],
  });

  const previewProduct: Product = {
    id: "preview",
    sellerId: "s1",
    categoryId: formData.categoryId,
    title: formData.title || "Product Title",
    description: formData.description || "Product description...",
    price: Number(formData.price) || 0,
    images:
      formData.images.length > 0
        ? formData.images
        : getImageForProduct(
            formData.title || "Product",
            formData.description || "Product",
          ),
    stockQty: Number(formData.stockQty) || 0,
    status: "available",
    isFeatured: formData.isFeatured,
    viewCount: 0,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-24 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-zinc-900 mb-2">
              Add New Product
            </h1>
            <p className="text-zinc-500 font-medium">
              List a new item in your shop inventory.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-zinc-300 transition-all group p-12">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-zinc-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-600">
                  Click to upload product images
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Supports PNG, JPG (Max 5MB)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Product Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Handmade Sanrio Keychain"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all appearance-none"
                  >
                    {MOCK_CATEGORIES.slice(1).map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Tell buyers about your item..."
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Price (₱)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="0.00"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Initial Stock
                </label>
                <input
                  type="number"
                  value={formData.stockQty}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQty: e.target.value })
                  }
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="w-5 h-5 rounded-md border-zinc-200 bg-white text-zinc-900 focus:ring-zinc-900 transition-all"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium cursor-pointer"
              >
                Feature this product in your shop hero
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-zinc-100">
            <Button variant="outline" className="flex-1">
              Save as Draft
            </Button>
            <Button
              className="flex-1"
              onClick={() => router.push("/dashboard")}
            >
              Publish Listing
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Live Preview
              </h2>
              <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                Syncing...
              </span>
            </div>

            <div className="max-w-[300px] mx-auto">
              <ProductCard
                product={previewProduct}
                onNotifyMe={() => {}}
                showSeller={true}
              />
            </div>

            <div className="mt-12 bg-zinc-50 border border-zinc-100 rounded-3xl p-6 text-center space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Double-check your price and stock quantity. Buyers will see
                updates in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
