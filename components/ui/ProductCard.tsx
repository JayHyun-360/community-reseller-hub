"use client";

import { useState, useEffect } from "react";
import { Product, Seller } from "@/lib/types";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { MessageCircle, Share2, MoreHorizontal } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onNotifyMe?: (product: Product) => void;
  showSeller?: boolean;
  sellerData?: Seller;
}

export function ProductCard({
  product,
  showSeller = true,
  sellerData,
}: ProductCardProps) {
  const [seller, setSeller] = useState<Seller | null>(sellerData || null);
  const [imgError, setImgError] = useState(false);
  const supabase = createClient();

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

  const handleMessageSeller = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!seller) return;
    const message = encodeURIComponent(
      `Hi! Is ${product.title} at ₱${product.price} available?`,
    );
    const url = seller.messengerUrl
      ? `${seller.messengerUrl}?text=${message}`
      : `https://wa.me/${seller.whatsappNum}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="break-inside-avoid mb-6 flex flex-col group cursor-zoom-in"
    >
      <div className="relative rounded-[1.5rem] overflow-hidden bg-zinc-100 group-hover:brightness-90 transition-all duration-300">
        <img
          src={imgError ? fallbackImage : product.images[0]}
          alt={product.title}
          className="w-full h-auto block transform group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
        />

        <div
          className={`absolute inset-0 bg-black/20 flex flex-col justify-between p-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex justify-end">
            <button className="bg-red-600 text-white px-5 py-2.5 rounded-full font-black text-sm hover:bg-red-700 transition-colors shadow-lg">
              Save
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleMessageSeller}
                className="p-2 bg-white/90 hover:bg-white rounded-full text-zinc-900 transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
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
