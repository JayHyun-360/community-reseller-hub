import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { invalidateViewerCache } from "@/lib/viewer-session";

let browserClient: SupabaseClient | undefined;
let authListenerAttached = false;

export function createClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    if (typeof window !== "undefined" && !authListenerAttached) {
      authListenerAttached = true;
      browserClient.auth.onAuthStateChange(() => {
        invalidateViewerCache();
      });
    }
  }

  return browserClient;
}
