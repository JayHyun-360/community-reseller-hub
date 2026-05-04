import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      },
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Check if user has a profile with onboarding_completed
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, onboarding_completed")
        .eq("id", user.id)
        .single();

      // Redirect based on onboarding_completed
      if (profile?.onboarding_completed === false) {
        // New user - go to onboarding
        return NextResponse.redirect(`${origin}/onboarding`);
      } else if (profile?.role === "seller") {
        return NextResponse.redirect(`${origin}/dashboard`);
      } else {
        // Customer user - go to home
        return NextResponse.redirect(`${origin}/`);
      }
    }
  }

  // Fallback - go to onboarding
  return NextResponse.redirect(`${origin}/onboarding`);
}
