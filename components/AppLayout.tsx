"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/client";
import { getViewerUserId } from "@/lib/viewer-session";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function setupNotifications() {
      const userId = await getViewerUserId(supabase);
      if (!userId) return;

      // Fetch initial unread count
      const { data } = await supabase
        .from("notifications")
        .select("id", { count: "exact" })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (data) setUnreadCount(data.length);

      // Subscribe to notification changes
      const channel = supabase
        .channel(`notifications:unread:${userId}`, {
          config: { broadcast: { self: true } },
        })
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT" && !payload.new.is_read) {
              setUnreadCount((prev) => prev + 1);
            } else if (
              payload.eventType === "UPDATE" &&
              !payload.old.is_read &&
              payload.new.is_read
            ) {
              setUnreadCount((prev) => Math.max(0, prev - 1));
            }
          },
        );

      channel.subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    setupNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        unreadCount={unreadCount}
      />
      <div
        className={`flex-grow flex flex-col min-w-0 lg:pl-72 ${
          isSidebarOpen
            ? "max-lg:overflow-hidden max-lg:pointer-events-none max-lg:touch-none"
            : ""
        }`}
        aria-hidden={isSidebarOpen ? true : undefined}
      >
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          unreadCount={unreadCount}
        />
        <main className="flex-grow">{children}</main>
      </div>
    </div>
  );
}
