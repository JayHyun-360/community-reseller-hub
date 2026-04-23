"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, MessageCircle as Messenger, Phone as WhatsApp } from "lucide-react";
import { Product } from "@/lib/types";
import { Button } from "./Button";

interface NotifyMeSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NotifyMeSheet({
  product,
  isOpen,
  onClose,
}: NotifyMeSheetProps) {
  const [method, setMethod] = useState<"whatsapp" | "messenger">("whatsapp");
  const [info, setInfo] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 3000);
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ translateY: "100%" }}
            animate={{ translateY: "0%" }}
            exit={{ translateY: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-zinc-100 rounded-t-3xl z-[101] p-6 pb-12 shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold tracking-tight">
                Get notified when this restocks
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex gap-4 p-3 bg-zinc-50 rounded-xl border border-zinc-100 mb-8">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex flex-col justify-center">
                <span className="font-medium text-sm line-clamp-1">
                  {product.title}
                </span>
                <span className="text-green-600 font-mono text-sm">
                  ₱{product.price}
                </span>
              </div>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-mono text-zinc-400 uppercase mb-3 block">
                    Contact Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMethod("messenger")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                        method === "messenger"
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-zinc-200 text-zinc-400"
                      }`}
                    >
                      <span className="text-sm font-medium">Messenger</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod("whatsapp")}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
                        method === "whatsapp"
                          ? "border-green-500 bg-green-50 text-green-600"
                          : "border-zinc-200 text-zinc-400"
                      }`}
                    >
                      <span className="text-sm font-medium">WhatsApp</span>
                    </button>
                  </div>
                </div>

                <div>
                  <input
                    required
                    type="text"
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    placeholder={
                      method === "whatsapp"
                        ? "Your phone number..."
                        : "Your Messenger name..."
                    }
                    className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:border-green-500 outline-none transition-all"
                  />
                </div>

                <Button type="submit" fullWidth>
                  Notify me when back in stock
                </Button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="text-4xl">🎉</div>
                <h3 className="text-lg font-bold">You&apos;re on the list!</h3>
                <p className="text-sm text-zinc-400">
                  We&apos;ll alert you the moment this product is back in stock.
                </p>
                <div className="relative h-10 overflow-hidden">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                      animate={{
                        y: [-20, -100, -50],
                        x: [(i - 7) * 10, (i - 7) * 20],
                        opacity: 0,
                        scale: [1, 0],
                      }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="absolute left-1/2 w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: [
                          "#1DB97A",
                          "#7B6FE8",
                          "#E8A020",
                          "#3B8EE8",
                        ][i % 4],
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
