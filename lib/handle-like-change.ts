import type { Product } from "@/lib/types";
import type { Dispatch, SetStateAction } from "react";

/** Updates liked IDs and like counts only when the favorite state actually changes in the DB. */
export function applyLikeChange(
  productId: string,
  isLiked: boolean,
  changed: boolean,
  setLikedProductIds: Dispatch<SetStateAction<Set<string>>>,
  setProducts: Dispatch<SetStateAction<Product[]>>,
  setSelectedProduct?: Dispatch<SetStateAction<Product | null>>,
) {
  setLikedProductIds((prev) => {
    const wasLiked = prev.has(productId);
    if (wasLiked === isLiked) return prev;
    const next = new Set(prev);
    if (isLiked) next.add(productId);
    else next.delete(productId);
    return next;
  });

  if (!changed) return;

  const adjustCount = (count: number) =>
    Math.max(0, count + (isLiked ? 1 : -1));

  setProducts((prev) =>
    prev.map((item) =>
      item.id === productId
        ? { ...item, likeCount: adjustCount(item.likeCount || 0) }
        : item,
    ),
  );

  setSelectedProduct?.((prev) => {
    if (!prev || prev.id !== productId) return prev;
    return {
      ...prev,
      likeCount: adjustCount(prev.likeCount || 0),
    };
  });
}
