"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Product, Seller } from "@/lib/types";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import {
  getPreferredPlatform,
  setMessagingPreference,
} from "@/lib/messaging-preference";
import {
  MessageCircle,
  Share2,
  MoreHorizontal,
  Heart,
  Phone,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  onNotifyMe?: (product: Product) => void;
  onLikeChange?: (productId: string, isLiked: boolean) => void;
  showSeller?: boolean;
  sellerData?: Seller;
  isLiked?: boolean;
}

export function ProductCard({
  product,
  showSeller = true,
  sellerData,
  isLiked: initialLiked = false,
  onLikeChange,
}: ProductCardProps) {
  const [seller, setSeller] = useState<Seller | null>(sellerData || null);
  const [imgError, setImgError] = useState(false);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(product.likeCount || 0);
  const router = useRouter();
  const supabase = createClient();

  // Sync local state with prop
  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Check current state and toggle accordingly
    if (isLiked) {
      // Unlike - delete the favorite
      const { error } = await supabase
        .from("favorites")
        .delete()
        .match({ user_id: user.id, product_id: product.id });
      if (!error || error?.code === "PGRST116") {
        // PGRST116 = "could not find the row to delete"
        setIsLiked(false);
        setLikeCount((c) => c - 1);
        onLikeChange?.(product.id, false);
      }
    } else {
      // Like - insert a new favorite
      const { error } = await supabase
        .from("favorites")
        .insert({ user_id: user.id, product_id: product.id });
      if (!error || error?.code === "PGRST116") {
        // If already exists (409), just update UI
        setIsLiked(true);
        setLikeCount((c) => c + 1);
        onLikeChange?.(product.id, true);
      }
    }
  };

  useEffect(() => {
    if (sellerData) {
      setSeller(sellerData);
    } else if (product.sellerId) {
      supabase
        .from("profiles")
        .select("*")
        .eq("id", product.sellerId)
        .single()
        .then(({ data }) => {
          if (data) {
            setSeller({
              id: data.id,
              username: data.username,
              fullName: data.full_name,
              avatarUrl: data.avatar_url,
              role: data.role,
              whatsappNum: data.whatsapp_num,
              messengerUrl: data.messenger_url,
            });
          }
        });
    }
  }, [product.sellerId, sellerData]);

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";
  const [isHovered, setIsHovered] = useState(false);
  const [showContactMenu, setShowContactMenu] = useState(false);

  const handleMessageSeller = (
    e: React.MouseEvent,
    via: "messenger" | "whatsapp",
  ) => {
    e.stopPropagation();
    if (!seller) return;
    const message = encodeURIComponent(
      `Hi! Is ${product.title} at ₱${product.price} available?`,
    );
    let url = "";
    if (via === "messenger" && seller.messengerUrl) {
      url = `${seller.messengerUrl}?text=${message}`;
    } else if (via === "whatsapp" && seller.whatsappNum) {
      url = `https://wa.me/${seller.whatsappNum}?text=${message}`;
    }
    if (url) window.open(url, "_blank");
    setShowContactMenu(false);
  };

  const hasMessenger = seller?.messengerUrl;
  const hasWhatsApp = seller?.whatsappNum;
  const hasContact = hasMessenger || hasWhatsApp;
  const showDropdown = hasMessenger && hasWhatsApp;
  const preferredPlatform = getPreferredPlatform(!!hasMessenger, !!hasWhatsApp);

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="break-inside-avoid flex flex-col group cursor-zoom-in"
    >
      <div className="relative rounded-[1.5rem] overflow-hidden bg-zinc-50 group-hover:brightness-90 transition-all duration-300">
        <img
          src={imgError ? fallbackImage : product.images[0]}
          alt={product.title}
          className="w-full h-auto object-cover block transform group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
        />

        <div
          className={`absolute inset-0 bg-black/20 flex flex-col justify-between p-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex justify-between items-center">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-black text-sm transition-colors shadow-lg ${
                isLiked
                  ? "bg-rose-500 text-white hover:bg-rose-600"
                  : "bg-white/90 text-zinc-900 hover:bg-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
              {likeCount}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2 relative">
              {hasContact ? (
                showDropdown ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowContactMenu(!showContactMenu);
                      }}
                      className="p-2 bg-white/90 hover:bg-white rounded-full text-zinc-900 transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    {showContactMenu && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-zinc-100 overflow-hidden z-50">
                        {hasMessenger && (
                          <button
                            onClick={(e) => {
                              handleMessageSeller(e, "messenger");
                              setMessagingPreference("messenger");
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-50 w-full text-left text-sm font-medium text-zinc-900"
                          >
                            <MessageCircle className="w-4 h-4 text-[#0084FF]" />
                            Messenger
                            {preferredPlatform === "messenger" && (
                              <div className="ml-auto w-2 h-2 bg-zinc-900 rounded-full" />
                            )}
                          </button>
                        )}
                        {hasWhatsApp && (
                          <button
                            onClick={(e) => {
                              handleMessageSeller(e, "whatsapp");
                              setMessagingPreference("whatsapp");
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-50 w-full text-left text-sm font-medium text-zinc-900"
                          >
                            <Phone className="w-4 h-4 text-[#25D366]" />
                            WhatsApp
                            {preferredPlatform === "whatsapp" && (
                              <div className="ml-auto w-2 h-2 bg-zinc-900 rounded-full" />
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={(e) =>
                      handleMessageSeller(
                        e,
                        preferredPlatform ||
                          (hasMessenger ? "messenger" : "whatsapp"),
                      )
                    }
                    className="p-2 bg-white/90 hover:bg-white rounded-full text-zinc-900 transition-colors shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                )
              ) : (
                <span className="p-2 bg-white/50 rounded-full text-zinc-400 cursor-not-allowed">
                  <MessageCircle className="w-4 h-4" />
                </span>
              )}
              <button className="p-2 bg-white/90 hover:bg-white rounded-full text-zinc-900 transition-colors shadow-md">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            <button className="p-2 bg-white/90 hover:bg-white rounded-full text-zinc-900 transition-colors shadow-md">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-2 px-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xs font-bold text-zinc-900 line-clamp-1 group-hover:underline">
            {product.title}
          </h3>
          <span className="text-xs font-black text-zinc-900 leading-none">
            ₱{product.price}
          </span>
        </div>

        {showSeller && seller && (
          <div className="mt-1.5 flex items-center gap-2">
            <img
              src={seller.avatarUrl}
              alt={seller.displayName}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-600 transition-colors">
              {seller.displayName}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
