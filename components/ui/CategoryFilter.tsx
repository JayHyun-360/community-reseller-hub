"use client";

import { Category, CategoryFilterType } from "@/lib/types";

interface VirtualCategory {
  id: string;
  type: CategoryFilterType;
  name: string;
  emoji: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  onBrowseMore?: () => void;
  showVirtualCategories?: boolean;
  className?: string;
}

const VIRTUAL_CATEGORIES: VirtualCategory[] = [
  { id: "all", type: "all", name: "All Items", emoji: "✨" },
  { id: "suggested", type: "suggested", name: "For You", emoji: "💫" },
  { id: "trending", type: "trending", name: "Trending", emoji: "🔥" },
];

export function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  onBrowseMore,
  showVirtualCategories = true,
  className = "",
}: CategoryFilterProps) {
  const visibleCategories = categories.length > 0 ? categories.slice(0, 4) : [];
  const hasMoreCategories = categories.length > 4;
  const showAllFallback = categories.length === 0 && !showVirtualCategories;

  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar min-h-[44px] ${className}`}
    >
      {showVirtualCategories &&
        VIRTUAL_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-black text-[11px] uppercase tracking-wider ${
              selectedId === cat.id
                ? "bg-zinc-900 text-white shadow-lg"
                : "bg-white text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            <span>{cat.emoji}</span>
            <span className="whitespace-nowrap">{cat.name}</span>
          </button>
        ))}

      {visibleCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-black text-[11px] uppercase tracking-wider ${
            selectedId === cat.id
              ? "bg-zinc-900 text-white shadow-lg"
              : "bg-white text-zinc-500 hover:bg-zinc-100"
          }`}
        >
          <span>{cat.emoji}</span>
          <span className="whitespace-nowrap">{cat.name}</span>
        </button>
      ))}

      {showAllFallback && (
        <button
          onClick={() => onSelect("all")}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-black text-[11px] uppercase tracking-wider ${
            selectedId === "all"
              ? "bg-zinc-900 text-white shadow-lg"
              : "bg-white text-zinc-500 hover:bg-zinc-100"
          }`}
        >
          <span>✨</span>
          <span className="whitespace-nowrap">All Items</span>
        </button>
      )}

      {hasMoreCategories && (
        <button
          onClick={onBrowseMore}
          className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 font-black text-[11px] uppercase tracking-wider bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
        >
          <span>➕</span>
          <span className="whitespace-nowrap">Browse More</span>
        </button>
      )}
    </div>
  );
}
