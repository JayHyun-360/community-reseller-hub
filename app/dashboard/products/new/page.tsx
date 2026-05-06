"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getImageForProduct } from "@/lib/mock-data";
import { Product, Category } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { LocationInput } from "@/components/ui/LocationInput";
import { Camera, ChevronDown, Upload, X, Loader2 } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    description: "",
    price: "",
    stockQty: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    availableFrom: "",
    isFeatured: false,
    images: [] as string[],
  });

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "seller") {
        router.push("/account");
        return;
      }

      setUser(user);

      const { data: cats } = await supabase.from("categories").select("*");
      if (cats) {
        setCategories(
          cats.map((c) => ({
            id: c.id,
            name: c.name,
            emoji: c.emoji,
            productCount: c.product_count,
          })),
        );
        if (cats.length > 0)
          setFormData((f) => ({ ...f, categoryId: cats[0].id }));
      }
    }
    init();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.categoryId) newErrors.category = "Category is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (asDraft: boolean) => {
    if (!validateForm()) return;
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("products").insert({
        seller_id: user.id,
        category_id: formData.categoryId,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        stock_qty: Number(formData.stockQty) || 0,
        location: formData.location || null,
        latitude: formData.latitude,
        longitude: formData.longitude,
        available_from: formData.availableFrom || null,
        status: asDraft ? "draft" : "available",
        is_featured: formData.isFeatured,
        images:
          formData.images.length > 0
            ? formData.images
            : getImageForProduct(formData.title, formData.description),
      });

      if (error) throw error;
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${Math.random()}.${file.name.split(".").pop()}`;
        const { data, error } = await supabase.storage
          .from("products")
          .upload(fileName, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("products").getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      }
      setFormData((f) => ({ ...f, images: [...f.images, ...uploadedUrls] }));
    } catch (err: any) {
      alert(err.message || "Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((f) => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }));
  };

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
    likeCount: 0,
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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-zinc-300 transition-all group p-12"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 text-zinc-400 animate-spin" />
              ) : (
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-zinc-400" />
                </div>
              )}
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-600">
                  Click to upload product images
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  Supports PNG, JPG (Max 5MB)
                </p>
              </div>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt={`Upload ${i + 1}`}
                      className="w-full h-24 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Product Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: "" });
                  }}
                  placeholder="e.g. Handmade Sanrio Keychain"
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all ${
                    errors.title ? "border-red-500" : "border-zinc-200"
                  }`}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={formData.categoryId}
                    onChange={(e) => {
                      setFormData({ ...formData, categoryId: e.target.value });
                      if (errors.category)
                        setErrors({ ...errors, category: "" });
                    }}
                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all appearance-none ${
                      errors.category ? "border-red-500" : "border-zinc-200"
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500">{errors.category}</p>
                )}
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
                  Price (₱) <span className="text-zinc-300">(optional)</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    setFormData({ ...formData, price: e.target.value });
                    if (errors.price) setErrors({ ...errors, price: "" });
                  }}
                  placeholder="0.00"
                  className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all"
                />
                <p className="text-[10px] text-zinc-400">
                  💡 For customers to be interested more, display your prices
                </p>
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                Location <span className="text-zinc-300">(optional)</span>
              </label>
              <LocationInput
                value={formData.location}
                onChange={(location, lat, lng) =>
                  setFormData({
                    ...formData,
                    location,
                    latitude: lat,
                    longitude: lng,
                  })
                }
                placeholder="Search product location..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                Available From{" "}
                <span className="text-zinc-300">
                  (optional - for pre-orders)
                </span>
              </label>
              <input
                type="date"
                value={formData.availableFrom}
                onChange={(e) =>
                  setFormData({ ...formData, availableFrom: e.target.value })
                }
                className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all"
              />
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
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save as Draft"}
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? "Publishing..." : "Publish Listing"}
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
