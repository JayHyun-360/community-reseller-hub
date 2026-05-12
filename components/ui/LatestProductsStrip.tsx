"use client";

import { useRef, useState } from "react";
import { Product } from "@/lib/types";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LatestProductsStripProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function LatestProductsStrip({
  products,
  onProductClick,
}: LatestProductsStripProps) {
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
        className="flex gap-4 overflow-x-auto px-8 pb-4 hide-scrollbar"
      >
        {products.slice(0, 10).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onProductClick,
}: {
  product: Product;
  onProductClick?: (product: Product) => void;
}) {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const hasLongDesc = product.description && product.description.length > 60;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onProductClick?.(product)}
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
            {formatTimeAgo(product.createdAt)}
          </span>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs font-black text-zinc-900 line-clamp-1">
          {product.title}
        </p>
        <p className="text-[11px] font-bold text-zinc-500">
          ₱{product.price?.toLocaleString() || "0"}
        </p>
        {product.description && (
          <p className="text-[10px] text-zinc-400 leading-relaxed">
            {hasLongDesc && !showFullDesc
              ? product.description.slice(0, 60) + "..."
              : product.description}
            {hasLongDesc && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDesc(!showFullDesc);
                }}
                className="ml-1 text-zinc-600 underline hover:text-zinc-900"
              >
                {showFullDesc ? "read less" : "read more"}
              </button>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}
