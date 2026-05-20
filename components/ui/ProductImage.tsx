"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  getProductImageUrl,
  isSupabaseStorageUrl,
  PRODUCT_IMAGE_FALLBACK,
} from "@/lib/product-image";

type ProductImageProps = {
  src: string | undefined;
  alt: string;
  width: number;
  /** Used with width to reserve space when not using fill */
  height?: number;
  fill?: boolean;
  sizes: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
  onImageError?: () => void;
};

export function ProductImage({
  src,
  alt,
  width,
  height,
  fill,
  sizes,
  className = "",
  priority = false,
  onClick,
  onImageError,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(() => getProductImageUrl(src, width));

  useEffect(() => {
    setImgSrc(getProductImageUrl(src, width));
  }, [src, width]);

  const handleError = () => {
    if (src?.trim() && imgSrc !== src) {
      setImgSrc(src);
      return;
    }
    setImgSrc(PRODUCT_IMAGE_FALLBACK);
    onImageError?.();
  };

  const unoptimized = isSupabaseStorageUrl(imgSrc);

  const shared = {
    alt,
    sizes,
    className,
    priority,
    unoptimized,
    referrerPolicy: "no-referrer" as const,
    onError: handleError,
    onClick,
  };

  if (fill) {
    return <Image src={imgSrc} fill {...shared} />;
  }

  return (
    <Image
      src={imgSrc}
      width={width}
      height={height ?? Math.round(width * 1.25)}
      {...shared}
    />
  );
}
