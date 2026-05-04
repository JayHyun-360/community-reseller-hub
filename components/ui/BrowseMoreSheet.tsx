"use client";

// Trigger redeploy
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search } from "lucide-react";
import { Category } from "@/lib/types";

interface BrowseMoreSheetProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export function BrowseMoreSheet({
  categories,
  isOpen,
  onClose,
  onSelectCategory,
}: BrowseMoreSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (categoryId: string) => {
    onSelectCategory(categoryId);
    onClose();
  };

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
            className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-zinc-100 rounded-t-3xl z-[101] pb-12 shadow-2xl max-h-[80vh] flex flex-col"
          >
            <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mt-4 mb-2" />

            <div className="flex justify-between items-center px-6 py-4">
              <h2 className="text-xl font-black tracking-tight">
                Browse Categories
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 rounded-full"
              >
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="px-6 pb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search categories..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl pl-12 pr-4 py-3 text-sm focus:border-zinc-400 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {filteredCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelect(cat.id)}
                    className="flex items-center gap-3 p-4 bg-zinc-50 hover:bg-zinc-100 rounded-2xl transition-all text-left"
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-zinc-900 truncate">
                        {cat.name}
                      </div>
                      {cat.productCount !== undefined && (
                        <div className="text-xs text-zinc-400">
                          {cat.productCount} items
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {filteredCategories.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-zinc-400 font-medium">
                    No categories found
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
