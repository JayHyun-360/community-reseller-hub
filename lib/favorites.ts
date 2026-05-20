import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

export function isFavoriteConflict(error: PostgrestError | null): boolean {
  if (!error) return false;
  const status = (error as PostgrestError & { status?: number }).status;
  return (
    error.code === "23505" ||
    status === 409 ||
    error.message.toLowerCase().includes("duplicate")
  );
}

export type ToggleFavoriteResult =
  | { ok: true; isLiked: boolean; changed: boolean }
  | { ok: false; isLiked: boolean; error: PostgrestError };

export async function toggleFavorite(
  supabase: SupabaseClient,
  userId: string,
  productId: string,
  currentlyLiked: boolean,
): Promise<ToggleFavoriteResult> {
  if (currentlyLiked) {
    const { data, error } = await supabase
      .from("favorites")
      .delete()
      .match({ user_id: userId, product_id: productId })
      .select("id");

    if (error) {
      return { ok: false, isLiked: true, error };
    }

    if (data && data.length > 0) {
      return { ok: true, isLiked: false, changed: true };
    }

    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();

    if (existing) {
      return { ok: true, isLiked: true, changed: false };
    }

    return { ok: true, isLiked: false, changed: false };
  }

  const { error } = await supabase.from("favorites").insert({
    user_id: userId,
    product_id: productId,
  });

  if (!error) {
    return { ok: true, isLiked: true, changed: true };
  }

  if (isFavoriteConflict(error)) {
    return { ok: true, isLiked: true, changed: false };
  }

  return { ok: false, isLiked: false, error };
}

export async function fetchProductLikeCount(
  supabase: SupabaseClient,
  productId: string,
): Promise<number> {
  const { data } = await supabase
    .from("products")
    .select("like_count")
    .eq("id", productId)
    .single();
  return data?.like_count ?? 0;
}
