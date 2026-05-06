"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";

interface NotificationBellProps {
  userId: string;
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const fetchNotifications = () => {
    if (userId) {
      supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10)
        .then(({ data }) => {
          if (data) setNotifications(data);
        });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = async (notif: any) => {
    if (!notif.is_read) {
      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notif.id);
      fetchNotifications();
    }
    if (notif.product_id) {
      setIsOpen(false);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex p-3 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-full transition-all relative"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-3xl shadow-xl border border-zinc-100 z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-100">
                <h3 className="font-black text-zinc-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-white bg-zinc-900 px-2 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-zinc-400">
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-4 border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer ${
                        !notif.is_read ? "bg-indigo-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-zinc-900">
                            {notif.title}
                          </p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {notif.message}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-1">
                            {formatTime(notif.created_at)}
                          </p>
                        </div>
                        {!notif.is_read && (
                          <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 text-center border-t border-zinc-100">
                <button className="text-[11px] font-bold text-zinc-400 hover:text-zinc-900 transition-colors">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
