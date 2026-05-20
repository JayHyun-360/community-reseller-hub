"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getViewerUserId } from "@/lib/viewer-session";
import {
  Home,
  Search,
  LayoutDashboard,
  Github,
  Compass,
  X,
  Store,
  HelpCircle,
  Shield,
  FileText,
  Info,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isSeller, setIsSeller] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getViewerUserId(supabase).then((id) => {
      if (cancelled) return;
      setUserId(id);
      if (!id) {
        setIsSeller(false);
        return;
      }
      supabase
        .from("profiles")
        .select("role")
        .eq("id", id)
        .single()
        .then(({ data }) => {
          if (!cancelled) setIsSeller(data?.role === "seller");
        });
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const id = session?.user?.id ?? null;
      setUserId(id);
      if (!id) setIsSeller(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Compass, label: "Explore" },
    ...(userId
      ? [
          { href: "/account", icon: Store, label: "Account" },
          ...(isSeller
            ? [
                {
                  href: "/dashboard",
                  icon: LayoutDashboard,
                  label: "Shop Manager",
                },
              ]
            : []),
        ]
      : [{ href: "/login", icon: Store, label: "Become a Seller" }]),
  ];

  const secondaryNavItems = [
    { href: "/help", icon: HelpCircle, label: "Help Center" },
    { href: "/safety", icon: Shield, label: "Safety" },
    { href: "/sellers", icon: Store, label: "Seller Resources" },
    { href: "/about", icon: Info, label: "About Us" },
    { href: "/terms", icon: FileText, label: "Terms" },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white p-6 overscroll-contain">
      <div className="mb-10 flex items-center justify-between">
        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-2 group"
        >
          <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 shadow-lg">
            <Search className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-zinc-900">
            NearByt
          </span>
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-grow space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-full transition-colors duration-200 font-bold w-full overflow-hidden ${
                isActive
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[13px] tracking-wide truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="py-4 border-t border-zinc-100 shrink-0">
        <div className="px-5 mb-3">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Resources
          </span>
        </div>
        <nav className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-full transition-colors duration-200 font-bold w-full overflow-hidden ${
                  isActive
                    ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200"
                    : "text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-[11px] tracking-wide truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto shrink-0">
        <div className="flex items-center justify-between px-4 text-zinc-300">
          <span className="text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} NearByt
          </span>
          <Github className="w-4 h-4 cursor-pointer hover:text-zinc-900 transition-colors" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-72 h-screen fixed top-0 left-0 bg-white border-r border-zinc-100 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile drawer — fixed layers so backdrop always blocks page touches when open */}
      <div
        className={`fixed inset-0 z-[200] lg:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none invisible"
        }`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          tabIndex={isOpen ? 0 : -1}
          className={`fixed inset-0 w-full h-full bg-zinc-900/50 touch-none transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`fixed inset-y-0 left-0 z-[201] w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform motion-reduce:transition-none ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
}
