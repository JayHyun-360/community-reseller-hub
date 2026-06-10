"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/ui/BottomNav";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        className={`flex-grow flex flex-col min-w-0 lg:pl-72 ${
          isSidebarOpen
            ? "max-lg:overflow-hidden max-lg:pointer-events-none max-lg:touch-none"
            : ""
        }`}
        aria-hidden={isSidebarOpen ? true : undefined}
      >
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-grow">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
