"use client";

import Link from "next/link";
import { Seller, Product } from "@/lib/types";
import { motion } from "motion/react";
import { useMemo } from "react";

interface SellerCardProps {
  seller: Seller;
  className?: string;
  products?: Product[];
}

export function SellerCard({
  seller,
  className = "",
  products = [],
}: SellerCardProps) {
  const displayName = seller.fullName || seller.username;
  const avatarUrl = seller.avatarUrl || "https://picsum.photos/200";

  // Compute seller metrics
  const sellerMetrics = useMemo(() => {
    const sellerProducts = products.filter((p) => p.sellerId === seller.id);
    return {
      productCount: sellerProducts.length,
      thumbnails: sellerProducts
        .slice(0, 3)
        .map((p) => p.images?.[0])
        .filter(Boolean),
    };
  }, [seller.id, products]);

  const joinYear = seller.createdAt
    ? new Date(seller.createdAt).getFullYear()
    : null;
  const currentYear = new Date().getFullYear();
  const yearsActive = joinYear ? currentYear - joinYear : null;

  return (
    <Link href={`/${encodeURIComponent(seller.username)}`}>
      <motion.div
        whileHover={{ y: -2 }}
        className={`bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-pointer overflow-hidden max-h-[140px] flex ${className}`}
      >
        {/* Left Content */}
        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
          {/* Header: Avatar, Name, Username */}
          <div className="flex items-start gap-3 mb-2 min-w-0">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-12 h-12 rounded-xl border border-gray-100 flex-shrink-0 object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-zinc-900 text-sm tracking-tight truncate">
                {displayName}
              </h3>
              <span className="text-xs font-semibold text-zinc-500 truncate block">
                @{seller.username}
              </span>
            </div>
          </div>

          {/* Metadata Badge */}
          <div className="flex items-center gap-2">
            {sellerMetrics.productCount > 0 ? (
              <span className="inline-block bg-purple-50 text-purple-700 font-semibold px-2.5 py-1 rounded-md text-xs whitespace-nowrap">
                {sellerMetrics.productCount} Product
                {sellerMetrics.productCount !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="inline-block bg-gray-50 text-gray-600 font-semibold px-2.5 py-1 rounded-md text-xs whitespace-nowrap">
                Active Local Seller
              </span>
            )}
            {yearsActive !== null && yearsActive > 0 && (
              <span className="text-xs text-zinc-500 font-medium">
                {yearsActive} yr{yearsActive > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Right Content: Product Thumbnails */}
        {sellerMetrics.thumbnails.length > 0 && (
          <div className="flex-shrink-0 px-3 py-4 flex items-center gap-2 bg-gray-50/50 border-l border-gray-100">
            {sellerMetrics.thumbnails.map((imgUrl, idx) => (
              <div
                key={idx}
                className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0"
              >
                <img
                  src={imgUrl}
                  alt={`${displayName} product ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </Link>
  );
}
