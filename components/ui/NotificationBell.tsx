"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const mockNotifications = [
  {
    id: 1,
    title: "New order received",
    message: "Someone purchased your Vintage Camera",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    title: "Item restocked",
    message: "Your requested item is now available",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "New message",
    message: "John D. sent you a message",
    time: "3 hours ago",
    unread: false,
  },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-zinc-50 hover:bg-zinc-50 transition-colors cursor-pointer ${
                      notif.unread ? "bg-indigo-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900">{notif.title}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{notif.message}</p>
                        <p className="text-[10px] text-zinc-400 mt-1">{notif.time}</p>
                      </div>
                      {notif.unread && (
                        <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
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
