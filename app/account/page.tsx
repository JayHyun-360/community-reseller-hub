"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { LocationInput } from "@/components/ui/LocationInput";
import { Camera, Save, LogOut } from "lucide-react";

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [originalProfile, setOriginalProfile] = useState<any>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [message, setMessage] = useState("");

  const hasChanges =
    originalProfile &&
    JSON.stringify(profile) !== JSON.stringify(originalProfile);

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
      setLoading(false);
    }
    fetchData();
  }, [router, supabase]);

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
        whatsapp_num: profile.whatsapp_num,
        messenger_url: profile.messenger_url,
        avatar_url: profile.avatar_url,
        location: profile.location,
        latitude: profile.latitude,
        longitude: profile.longitude,
      })
      .eq("id", user.id);

    if (error) {
      setMessage("Error: " + error.message);
    } else {
      setMessage("Saved successfully!");
      setOriginalProfile({ ...profile });
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

      setProfile({ ...profile, avatar_url: data.publicUrl });
    } catch (err: any) {
      setMessage("Error uploading avatar: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 pb-24 min-h-screen">
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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-zinc-900">
            Account Settings
          </h1>
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
            <>
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
            </>
          )}

          {/* Save Button */}
          {hasChanges && (
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
    </div>
  );
}
