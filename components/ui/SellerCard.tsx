"use client";

import { Seller } from "@/lib/types";
import { TrustBadge } from "./TrustBadge";
import { motion } from "motion/react";

interface SellerCardProps {
  seller: Seller;
  className?: string;
}

export function SellerCard({ seller, className = "" }: SellerCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white border border-zinc-200 rounded-[2rem] p-6 flex flex-col gap-4 hover:shadow-lg transition-all ${className}`}
    >
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={seller.avatarUrl}
            alt={seller.displayName}
            className={`w-14 h-14 rounded-2xl p-0.5 border-2 ${
              seller.trustTier === "elite"
                ? "border-amber-500"
                : seller.trustTier === "verified"
                ? "border-green-500"
                : seller.trustTier === "rising"
                ? "border-blue-500"
                : "border-zinc-200"
            }`}
          />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-zinc-900 text-sm tracking-tight">
            {seller.displayName}
          </h3>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">
            @{seller.username}
          </span>
          <div className="mt-2">
            <TrustBadge tier={seller.trustTier} />
          </div>
        </div>
      </div>

      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
        {seller.bio}
      </p>

      <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Trades
          </span>
          <span className="text-xs font-black text-zinc-900">
            {seller.tradesCount}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Since
          </span>
          <span className="text-xs font-black text-zinc-900">
            {new Date(seller.createdAt).getFullYear()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
