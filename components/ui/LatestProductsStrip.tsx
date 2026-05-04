"use client";

import { useRef } from "react";
import { Product } from "@/lib/types";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LatestProductsStripProps {
  products: Product[];
}

export function LatestProductsStrip({ products }: LatestProductsStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 py-8 relative">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-sans">
          Just Dropped
        </h2>
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
        {products.slice(0, 10).map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col flex-shrink-0 w-64 cursor-pointer group"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100">
              <img
                src={product.images?.[0] || "https://picsum.photos/400/500"}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-[10px] font-black text-zinc-900 uppercase">
                  New
                </span>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-black text-zinc-900 line-clamp-1">
                {product.title}
              </p>
              <p className="text-[11px] font-bold text-zinc-500 mt-1">
                ${product.price?.toLocaleString() || "0"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
