export const PRODUCT_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";

export function isSupabaseStorageUrl(src: string): boolean {
  try {
    const url = new URL(src);
    return (
      url.hostname.endsWith(".supabase.co") &&
      url.pathname.includes("/storage/v1/")
    );
  } catch {
    return false;
  }
}

/** Resize hints for grid tiles, modal hero, and related thumbnails. */
export function getProductImageUrl(
  src: string | undefined,
  width: number,
): string {
  if (!src?.trim()) return PRODUCT_IMAGE_FALLBACK;

  try {
    const url = new URL(src);

    if (url.hostname.includes("images.unsplash.com")) {
      url.searchParams.set("w", String(width));
      url.searchParams.set("q", "75");
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      return url.toString();
    }

    // Use the original public object URL. Supabase /render/image requires Pro
    // image transforms; broken transform URLs cause Next image optimizer 502s.
    if (url.pathname.includes("/storage/v1/object/public/")) {
      return src;
    }
  } catch {
    return src;
  }

  return src;
}
