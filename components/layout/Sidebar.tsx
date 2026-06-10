"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
  Bell,
  ArrowLeft,
} from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
}

export function Sidebar({ isOpen, onClose, unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);

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

  useEffect(() => {
    if (!isOpen || !showNotifications) return;
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) setNotifications(data);
    };

    fetchNotifications();

    // Subscribe to real-time notifications
    const channel = supabase
      .channel(`notifications:${userId}:sidebar`, {
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
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((n) => (n.id === payload.new.id ? payload.new : n)),
            );
          }
        },
      );

    channel.subscribe();
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [isOpen, showNotifications, userId]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "rating":
        return "⭐";
      case "comment":
        return "💬";
      case "review":
        return "⭐💬";
      case "like":
        return "❤️";
      default:
        return "📢";
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.is_read) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notif.id);

      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
      );
    }
    if (notif.product_id) {
      setShowNotifications(false);
      onClose();
      router.push(`/?product=${notif.product_id}`);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const notificationsView = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-100">
        <button
          onClick={() => setShowNotifications(false)}
          className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="font-black text-lg text-zinc-900">Notifications</h3>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-zinc-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`w-full text-left p-3 rounded-xl transition-colors hover:bg-zinc-50 active:bg-zinc-100 ${
                !notif.is_read ? "bg-zinc-50" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="text-xl flex-shrink-0 mt-1">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-zinc-900">
                    {notif.title}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                    {notif.message}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-2">
                    {formatTime(notif.created_at)}
                  </p>
                </div>
                {!notif.is_read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

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
      {showNotifications ? (
        notificationsView
      ) : (
        <>
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

            {/* Notifications Tab - Mobile Only */}
            <button
              onClick={() => setShowNotifications(true)}
              className="flex items-center gap-4 px-5 py-3.5 rounded-full transition-colors duration-200 font-bold w-full overflow-hidden text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 relative text-left sm:hidden"
            >
              <Bell className="w-5 h-5 flex-shrink-0" />
              <span className="text-[13px] tracking-wide truncate">
                Notifications
              </span>
              {unreadCount > 0 && (
                <div className="absolute right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>
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
        </>
      )}
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
