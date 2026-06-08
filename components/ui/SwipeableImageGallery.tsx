"use client";

import { ProductImage } from "./ProductImage";

interface SwipeableImageGalleryProps {
  images: string[];
  title: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
}

/**
 * Card-only image display component.
 * Only shows first image. Swiping is disabled on cards.
 * Swiping is enabled only inside ProductModal when viewing details.
 */
export function SwipeableImageGallery({
  images,
  title,
  width = 480,
  height = 600,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className = "",
}: SwipeableImageGalleryProps) {
  return (
    <ProductImage
      src={images[0]}
      alt={title}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
    />
  );
}
