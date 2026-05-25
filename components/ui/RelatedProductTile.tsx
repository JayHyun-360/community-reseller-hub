"use client";

import type { Product } from "@/lib/types";
import { ProductImage } from "./ProductImage";

interface RelatedProductTileProps {
  product: Product;
  onClick: () => void;
}

/** Lightweight pin tile for modal masonry — no auth, seller fetch, or hover overlays. */
export function RelatedProductTile({
  product,
  onClick,
}: RelatedProductTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full mb-3 sm:mb-4 break-inside-avoid text-left rounded-2xl overflow-hidden bg-zinc-50 [@media(hover:hover)]:hover:brightness-95 transition-[filter] duration-200"
    >
      <div className="relative w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-zinc-100 via-zinc-50 to-zinc-200/90">
        <ProductImage
          src={product.images?.[0]}
          alt={product.title}
          width={320}
          height={400}
          sizes="(max-width: 640px) 45vw, 200px"
          className="w-full h-auto object-cover"
        />
      </div>
      <div className="px-2.5 py-2.5">
        <p className="text-xs font-bold text-zinc-900 line-clamp-2 [@media(hover:hover)]:group-hover:underline">
          {product.title}
        </p>
        <p className="text-xs font-black text-zinc-900 mt-1">
          ₱{product.price?.toLocaleString()}
        </p>
      </div>
    </button>
  );
}
