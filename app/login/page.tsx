"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-zinc-100 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-zinc-900/5 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-zinc-900/5 blur-3xl rounded-full" />

        <div className="relative text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-50 text-zinc-900 rounded-full mb-6 border border-zinc-100 shadow-md">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-zinc-900">
            Start discovery smarter
          </h1>
          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest">
            Share your portfolio with one link.
          </p>
        </div>

        <div className="space-y-6 relative">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-900 rounded-2xl px-6 py-4 text-base font-medium hover:bg-zinc-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-zinc-400 font-black tracking-wider">
                or
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-zinc-900 text-white rounded-2xl px-6 py-4 text-base font-black uppercase tracking-widest text-xs hover:bg-zinc-800 shadow-xl shadow-zinc-200 transition-all flex items-center justify-center gap-2"
          >
            Explore as Guest
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-12 text-center relative border-t border-zinc-100 pt-8">
          <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-4">
            Connecting your neighborhood
          </p>
          <div className="flex justify-center -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <img
                key={i}
                src={`https://picsum.photos/seed/nearby-user${i}/100`}
                alt="Seller"
                className="w-10 h-10 rounded-full border-4 border-white grayscale hover:grayscale-0 transition-all cursor-pointer shadow-sm"
                referrerPolicy="no-referrer"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
