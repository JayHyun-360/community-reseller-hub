export const PRODUCT_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";

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

    if (url.pathname.includes("/storage/v1/object/public/")) {
      url.pathname = url.pathname.replace(
        "/storage/v1/object/public/",
        "/storage/v1/render/image/public/",
      );
      url.searchParams.set("width", String(width));
      url.searchParams.set("quality", "75");
      return url.toString();
    }
  } catch {
    return src;
  }

  return src;
}
