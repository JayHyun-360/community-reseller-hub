"use client";

import { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  selectedId,
  onSelect,
  className = "",
}: CategoryFilterProps) {
  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar ${className}`}
    >
      {categories.map((cat) => (
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
    </div>
  );
}
