import type { Product } from "@/lib/types";

const relatedCache = new Map<string, Product[]>();

export function getCachedRelatedProducts(productId: string): Product[] | undefined {
  return relatedCache.get(productId);
}

export function setCachedRelatedProducts(productId: string, items: Product[]): void {
  relatedCache.set(productId, items);
}
