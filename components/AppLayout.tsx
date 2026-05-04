"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkOnboarding() {
      const publicPages = ["/login", "/onboarding", "/auth/callback"];
      if (publicPages.some((p) => pathname.startsWith(p))) {
        setChecking(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setChecking(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (profile && profile.onboarding_completed === false) {
        router.push("/onboarding");
        return;
      }

      setChecking(false);
    }

    checkOnboarding();
  }, [pathname, router, supabase]);

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex overflow-x-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-grow flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
