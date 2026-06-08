"use client";

import React from "react";

interface TabBarProps {
  activeTab: "details" | "comments";
  onTabChange: (tab: "details" | "comments") => void;
  commentCount?: number;
}

export function TabBar({
  activeTab,
  onTabChange,
  commentCount = 0,
}: TabBarProps) {
  return (
    <div className="flex items-center gap-6 px-3 sm:px-6 pt-4 sm:pt-6 border-b border-zinc-100">
      <button
        onClick={() => onTabChange("details")}
        className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap ${
          activeTab === "details"
            ? "text-zinc-900 border-b-2 border-zinc-900"
            : "text-zinc-400 hover:text-zinc-600"
        }`}
      >
        Details
      </button>
      <button
        onClick={() => onTabChange("comments")}
        className={`pb-4 text-sm font-bold transition-colors whitespace-nowrap ${
          activeTab === "comments"
            ? "text-zinc-900 border-b-2 border-zinc-900"
            : "text-zinc-400 hover:text-zinc-600"
        }`}
      >
        Comments {commentCount > 0 && `(${commentCount})`}
      </button>
    </div>
  );
}
