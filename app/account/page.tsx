"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { LocationInput } from "@/components/ui/LocationInput";
import { ProductCard } from "@/components/ui/ProductCard";
import { MessagingPreferenceSheet } from "@/components/ui/MessagingPreferenceSheet";
import { Camera, Save, LogOut, Heart, Settings, Check } from "lucide-react";
import { Product } from "@/lib/types";
import { SELLER_CONTACTS_HASH } from "@/lib/seller-contacts";
import { useDebounce } from "@/lib/use-debounce";

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [originalProfile, setOriginalProfile] = useState<any>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [message, setMessage] = useState("");
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [showMessagingPreference, setShowMessagingPreference] = useState(false);

  // Debounce profile changes for auto-save
  const debouncedProfile = useDebounce(JSON.stringify(profile), 1500);

  const hasChanges =
    originalProfile &&
    JSON.stringify(profile) !== JSON.stringify(originalProfile);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === `#${SELLER_CONTACTS_HASH}`) {
      requestAnimationFrame(() => {
        document
          .getElementById(SELLER_CONTACTS_HASH)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [loading, isSeller]);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile(data);
        setOriginalProfile(data);
        setIsSeller(data.role === "seller");
      }

      const { data: favoritesData } = await supabase
        .from("favorites")
        .select("product_id, products(*)")
        .eq("user_id", user.id);

      if (favoritesData) {
        const favProducts = favoritesData
          .map((f: any) => f.products)
          .filter(Boolean)
          .map((p: any) => ({
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
          }));
        setFavorites(favProducts);
      }
      setFavoritesLoading(false);
      setLoading(false);
    }
    fetchData();
  }, [router, supabase]);

  // Auto-save effect
  useEffect(() => {
    const autoSave = async () => {
      if (!user || !profile || loading) return;

      // Don't auto-save if nothing has changed from original
      if (JSON.stringify(profile) === JSON.stringify(originalProfile)) {
        return;
      }

      setAutoSaveStatus("saving");

      const cleanInstagram = profile.instagram_handle
        ? profile.instagram_handle.trim().replace(/^@/, "")
        : null;
      const cleanTikTok = profile.tiktok_handle
        ? profile.tiktok_handle.trim().replace(/^@/, "")
        : null;
      const cleanWhatsApp = profile.whatsapp_num
        ? profile.whatsapp_num.trim()
        : null;
      const cleanMessenger = profile.messenger_url
        ? profile.messenger_url.trim()
        : null;

      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username?.trim(),
          full_name: profile.full_name?.trim(),
          bio: profile.bio,
          whatsapp_num: cleanWhatsApp,
          messenger_url: cleanMessenger,
          instagram_handle: cleanInstagram,
          tiktok_handle: cleanTikTok,
          avatar_url: profile.avatar_url,
          location: profile.location,
          latitude: profile.latitude,
          longitude: profile.longitude,
        })
        .eq("id", user.id);

      if (error) {
        setAutoSaveStatus("idle");
      } else {
        setAutoSaveStatus("saved");
        const updatedProfile = {
          ...profile,
          instagram_handle: cleanInstagram,
          tiktok_handle: cleanTikTok,
          whatsapp_num: cleanWhatsApp,
          messenger_url: cleanMessenger,
          username: profile.username?.trim(),
          full_name: profile.full_name?.trim(),
        };
        setOriginalProfile(updatedProfile);

        // Reset status after 2 seconds
        setTimeout(() => setAutoSaveStatus("idle"), 2000);
      }
    };

    autoSave();
  }, [debouncedProfile, user, loading]);

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    setMessage("");

    const cleanInstagram = profile.instagram_handle
      ? profile.instagram_handle.trim().replace(/^@/, "")
      : null;
    const cleanTikTok = profile.tiktok_handle
      ? profile.tiktok_handle.trim().replace(/^@/, "")
      : null;
    const cleanWhatsApp = profile.whatsapp_num
      ? profile.whatsapp_num.trim()
      : null;
    const cleanMessenger = profile.messenger_url
      ? profile.messenger_url.trim()
      : null;

    const updatedProfile = {
      ...profile,
      instagram_handle: cleanInstagram,
      tiktok_handle: cleanTikTok,
      whatsapp_num: cleanWhatsApp,
      messenger_url: cleanMessenger,
      username: profile.username?.trim(),
      full_name: profile.full_name?.trim(),
    };

    const { error } = await supabase
      .from("profiles")
      .update({
        username: updatedProfile.username,
        full_name: updatedProfile.full_name,
        bio: updatedProfile.bio,
        whatsapp_num: updatedProfile.whatsapp_num,
        messenger_url: updatedProfile.messenger_url,
        instagram_handle: cleanInstagram,
        tiktok_handle: cleanTikTok,
        avatar_url: updatedProfile.avatar_url,
        location: updatedProfile.location,
        latitude: updatedProfile.latitude,
        longitude: updatedProfile.longitude,
      })
      .eq("id", user.id);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Saved successfully!");
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleBecomeSeller = () => {
    router.push("/onboarding?upgrade=true");
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      // Save avatar URL to database immediately
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      const updatedProfile = { ...profile, avatar_url: avatarUrl };
      setProfile(updatedProfile);
      setOriginalProfile(updatedProfile);
      setMessage("Avatar updated successfully!");
    } catch (err: any) {
      setMessage("Error uploading avatar: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12 pb-24 min-h-screen">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-10 w-48 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-xl" />
            <div className="h-4 w-64 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
          </div>
          <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
                <div className="h-4 w-48 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-zinc-100">
              <div className="h-12 w-full bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
              <div className="h-12 w-full bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
              <div className="h-12 w-full bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
            </div>
          </div>
          <div className="h-12 w-full bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-zinc-900">
              Account Settings
            </h1>
            {autoSaveStatus === "saving" && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <div className="w-3 h-3 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            )}
            {autoSaveStatus === "saved" && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Check className="w-3 h-3" />
                <span>Saved</span>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-zinc-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {isSeller && (
          <div className="mb-8 p-6 bg-zinc-900 border border-zinc-900 rounded-[2rem]">
            <h2 className="text-lg font-black text-white mb-2">
              Seller Dashboard
            </h2>
            <p className="text-sm text-zinc-400 mb-4">
              Manage your products, view engagement, and track your shop.
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="bg-white text-zinc-900 hover:bg-zinc-100 rounded-full"
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {!isSeller && (
          <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem]">
            <h2 className="text-lg font-black text-indigo-600 mb-2">
              Become a Seller
            </h2>
            <p className="text-sm text-indigo-500 mb-4">
              Complete your profile below to start selling. Add your contact
              info so buyers can reach you!
            </p>
            <Button
              onClick={handleBecomeSeller}
              disabled={saving}
              className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-full"
            >
              {saving ? "Processing..." : "Activate Seller Account"}
            </Button>
          </div>
        )}

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={profile?.avatar_url || "https://picsum.photos/200"}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-zinc-100"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 p-2 bg-zinc-900 text-white rounded-full shadow-lg hover:bg-zinc-700 disabled:opacity-50"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900">
                {profile?.full_name}
              </p>
              <p className="text-xs text-zinc-400">@{profile?.username}</p>
              <p className="text-[10px] text-zinc-400 mt-1">
                Click camera to upload custom avatar
              </p>
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
              Username
            </label>
            <input
              type="text"
              value={profile?.username || ""}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-base focus:border-zinc-900 outline-none transition-all"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile?.full_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-base focus:border-zinc-900 outline-none transition-all"
            />
          </div>

          {isSeller && (
            <div
              id={SELLER_CONTACTS_HASH}
              className="space-y-6 scroll-mt-24 pt-2 border-t border-zinc-100"
            >
              <div>
                <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
                  Seller contact links
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Shown on your products and storefront for buyers to reach you.
                </p>
              </div>
              {/* Bio */}
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                  Bio
                </label>
                <textarea
                  value={profile?.bio || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  placeholder="Tell customers about yourself..."
                  rows={3}
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-base focus:border-zinc-900 outline-none transition-all resize-none"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={profile?.whatsapp_num || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, whatsapp_num: e.target.value })
                  }
                  placeholder="+639123456789"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-base focus:border-zinc-900 outline-none transition-all placeholder:text-zinc-300"
                />
                <p className="mt-2 text-[10px] text-zinc-400">
                  Use a business number if possible — this will be shared with
                  customers.
                </p>
              </div>

              {/* Messenger */}
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                  Messenger Link
                </label>
                <input
                  type="url"
                  value={profile?.messenger_url || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, messenger_url: e.target.value })
                  }
                  placeholder="https://m.me/yourusername"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-base focus:border-zinc-900 outline-none transition-all placeholder:text-zinc-300"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  value={profile?.instagram_handle || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, instagram_handle: e.target.value })
                  }
                  placeholder="username"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-base focus:border-zinc-900 outline-none transition-all placeholder:text-zinc-300"
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                  TikTok Handle
                </label>
                <input
                  type="text"
                  value={profile?.tiktok_handle || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, tiktok_handle: e.target.value })
                  }
                  placeholder="username"
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl px-6 py-4 text-base focus:border-zinc-900 outline-none transition-all placeholder:text-zinc-300"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                  Location
                </label>
                <LocationInput
                  value={profile?.location || ""}
                  onChange={(location, lat, lng) =>
                    setProfile({
                      ...profile,
                      location,
                      latitude: lat,
                      longitude: lng,
                    })
                  }
                  placeholder="Search your location..."
                />
              </div>
            </div>
          )}

          {/* Messaging Preference */}
          <div className="pt-8 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-zinc-500" />
                <h2 className="text-lg font-black text-zinc-900">
                  Messaging Settings
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMessagingPreference(true)}
                className="text-zinc-500"
              >
                Configure
              </Button>
            </div>
            <p className="text-sm text-zinc-600">
              Set your preferred messaging platform for contacting sellers.
            </p>
          </div>

          {/* Favorites Section */}
          <div className="pt-8 border-t border-zinc-100">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-xl font-black text-zinc-900">My Favorites</h2>
              <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-full">
                {favorites.length}
              </span>
            </div>

            {favoritesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] bg-zinc-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : favorites.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-4">
                {favorites.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
                <Heart className="w-8 h-8 text-zinc-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-zinc-400">
                  No favorites yet
                </p>
                <p className="text-xs text-zinc-300 mt-1">
                  Tap the heart on products you love
                </p>
              </div>
            )}
          </div>

          {/* Save Button - Hidden since we auto-save now */}
          {false && hasChanges && (
            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                fullWidth
                size="lg"
                className="bg-zinc-900 text-white rounded-full py-6 font-black uppercase tracking-widest text-xs hover:bg-zinc-800 shadow-xl shadow-zinc-200"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              {message && (
                <p
                  className={`text-center mt-4 text-sm font-bold ${message.includes("Error") ? "text-red-500" : "text-green-500"}`}
                >
                  {message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messaging Preference Sheet */}
      <MessagingPreferenceSheet
        isOpen={showMessagingPreference}
        onClose={() => setShowMessagingPreference(false)}
      />
    </div>
  );
}
