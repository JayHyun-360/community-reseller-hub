"use client";

import Link from "next/link";
import { Seller } from "@/lib/types";
import { motion } from "motion/react";

interface SellerCardProps {
  seller: Seller;
  className?: string;
}

export function SellerCard({ seller, className = "" }: SellerCardProps) {
  const displayName = seller.fullName || seller.username;
  const avatarUrl = seller.avatarUrl || "https://picsum.photos/200";

  return (
    <Link href={`/${seller.username}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className={`bg-white border border-zinc-200 rounded-[2rem] p-6 flex flex-col gap-4 hover:shadow-lg transition-all cursor-pointer ${className}`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-14 h-14 rounded-2xl border-2 border-zinc-200"
            />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-zinc-900 text-sm tracking-tight">
              {displayName}
            </h3>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">
              @{seller.username}
            </span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {seller.bio}
        </p>

        <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Joined
            </span>
            <span className="text-xs font-black text-zinc-900">
              {seller.createdAt
                ? new Date(seller.createdAt).getFullYear()
                : "-"}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
