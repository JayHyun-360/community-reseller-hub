"use client";

import { useRef } from "react";
import { Seller } from "@/lib/types";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface VerifiedSellersStripProps {
  sellers: Seller[];
}

export function VerifiedSellersStrip({ sellers }: VerifiedSellersStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 py-8 relative">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-sans">
          Top Neighborhood Resellers
        </h2>
        <span className="text-[10px] font-black text-zinc-900 border-b-2 border-zinc-900 cursor-pointer hover:opacity-70 transition-opacity">
          View Spotlight
        </span>
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 text-zinc-900" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-colors"
      >
        <ChevronRight className="w-4 h-4 text-zinc-900" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-8 pb-4 hide-scrollbar"
      >
        {sellers.map((seller) => (
          <motion.div
            key={seller.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-3 flex-shrink-0 cursor-pointer"
          >
            <div
              className={`relative w-20 h-20 rounded-full p-1 border-2 ${
                seller.trustTier === "elite"
                  ? "border-zinc-900"
                  : "border-zinc-100"
              }`}
            >
              <img
                src={seller.avatarUrl}
                alt={seller.displayName}
                className="w-full h-full rounded-full object-cover border-4 border-white"
                referrerPolicy="no-referrer"
              />
              {seller.trustTier === "elite" && (
                <div className="absolute -bottom-1 -right-1 bg-zinc-900 p-1.5 rounded-full border-2 border-white shadow-md">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-black text-zinc-900 text-center leading-tight max-w-[80px] line-clamp-1">
                {seller.displayName}
              </span>
              <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-0.5">
                @{seller.username}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
