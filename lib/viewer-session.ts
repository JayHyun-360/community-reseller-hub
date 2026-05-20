import type { SupabaseClient } from "@supabase/supabase-js";

let cachedViewerId: string | null | undefined;
let inflight: Promise<string | null> | null = null;

/** Clears cached viewer id (e.g. on sign-out). */
export function invalidateViewerCache() {
  cachedViewerId = undefined;
  inflight = null;
}

/**
 * Returns the logged-in user's id with a single shared auth read.
 * Uses getSession (local) instead of many concurrent getUser calls that contend on the GoTrue lock.
 */
export async function getViewerUserId(
  supabase: SupabaseClient,
): Promise<string | null> {
  if (cachedViewerId !== undefined) {
    return cachedViewerId;
  }

  if (!inflight) {
    inflight = supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        cachedViewerId = session?.user?.id ?? null;
        return cachedViewerId;
      })
      .catch(() => {
        cachedViewerId = null;
        return null;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
}
