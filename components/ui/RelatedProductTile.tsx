"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";

interface RelatedProductTileProps {
  product: Product;
  onClick: () => void;
}

/** Lightweight pin tile for modal masonry — no auth, seller fetch, or hover overlays. */
export function RelatedProductTile({ product, onClick }: RelatedProductTileProps) {
  const [imgError, setImgError] = useState(false);
  const src = product.images?.[0] || FALLBACK_IMAGE;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full mb-3 sm:mb-4 break-inside-avoid text-left rounded-2xl overflow-hidden bg-zinc-50 hover:brightness-95 transition-[filter] duration-200"
    >
      <img
        src={imgError ? FALLBACK_IMAGE : src}
        alt={product.title}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className="w-full h-auto object-cover block"
      />
      <div className="px-2.5 py-2.5">
        <p className="text-xs font-bold text-zinc-900 line-clamp-2 group-hover:underline">
          {product.title}
        </p>
        <p className="text-xs font-black text-zinc-900 mt-1">
          ₱{product.price?.toLocaleString()}
        </p>
      </div>
    </button>
  );
}
