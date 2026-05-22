"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Suggestion {
  id: string;
  title?: string;
  username?: string;
  full_name?: string;
  price?: number;
  images?: string[];
}

const RECENT_KEY = "recent_searches_v1";

export function SearchAutocomplete({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initial);
  const [suggestions, setSuggestions] = useState<{
    products: Suggestion[];
    sellers: Suggestion[];
  }>({ products: [], sellers: [] });
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const abortRef = useRef<AbortController | null>(null);
  const cache = useRef(new Map<string, any>());
  const debouncedRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listboxIdRef = useRef<string>(`search-autocomplete-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const target = e.target as Node | null;
      if (target && !containerRef.current.contains(target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (debouncedRef.current) window.clearTimeout(debouncedRef.current);
    };
  }, []);

  useEffect(() => {
    if (!query) {
      setSuggestions({ products: [], sellers: [] });
      return;
    }

    const q = query.trim();
    if (!q) return;

    if (cache.current.has(q)) {
      setSuggestions(cache.current.get(q));
      return;
    }

    setLoading(true);
    if (debouncedRef.current) window.clearTimeout(debouncedRef.current);
    debouncedRef.current = window.setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();
      try {
        const res = await fetch(
          `/api/autocomplete?q=${encodeURIComponent(q)}`,
          { signal: abortRef.current.signal },
        );
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        cache.current.set(q, data);
        setSuggestions(data);
      } catch (err) {
        // ignore aborts
      } finally {
        setLoading(false);
      }
    }, 150);
  }, [query]);

  const saveRecent = (term: string) => {
    try {
      const next = [term, ...recent.filter((r) => r !== term)].slice(0, 8);
      setRecent(next);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleSubmit = (term?: string) => {
    const q = term ?? query;
    if (!q) return;
    saveRecent(q);
    setOpen(false);
    setActiveIndex(-1);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleClearRecent = (term: string) => {
    const next = recent.filter((r) => r !== term);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const items = useMemo(() => {
    const productItems = suggestions.products.map((p) => ({
      type: "product",
      id: p.id,
      label: p.title,
    }));
    const sellerItems = suggestions.sellers.map((s) => ({
      type: "seller",
      id: s.id,
      label: s.username || s.full_name,
    }));
    const recentItems = recent.map((r) => ({
      type: "recent",
      id: r,
      label: r,
    }));
    return [...recentItems, ...productItems, ...sellerItems];
  }, [suggestions, recent]);

  return (
    <div className="relative w-full">
      <div className="lg:hidden w-full relative group">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          aria-label="Search"
          className="w-full bg-zinc-100 border-none rounded-full py-3.5 pl-14 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:bg-zinc-200 transition-all"
          value={query}
          onChange={(e) => {
            return (
              <div className="relative w-full" ref={containerRef}>
                <div className="lg:hidden w-full relative group">
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
                    aria-label="Search"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={listboxIdRef.current}
                    aria-activedescendant={activeIndex >= 0 ? `${listboxIdRef.current}-item-${activeIndex}` : undefined}
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, items.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Escape") {
              setOpen(false);
              setActiveIndex(-1);
                        if (activeIndex >= 0 && items[activeIndex]) {
                          handleSubmit(items[activeIndex].label);
                        } else {
                          handleSubmit();
                        }
          }}
        />
                        setOpen(true);
                        setActiveIndex((i) => Math.min(i + 1, items.length - 1));

      {open && items.length > 0 && (
                        setActiveIndex((i) => Math.max(i - 1, 0));
          <ul className="max-h-64 overflow-auto">
            {items.map((it, idx) => {
              const label = it.label || "";
              const parts = query
                ? label.split(new RegExp(`(${escapeRegExp(query)})`, "gi"))
                : [label];

                {open && (
                  <div className="absolute z-40 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border overflow-hidden">
                    <div className="px-3 py-2 border-b flex items-center justify-between">
                      <div className="text-sm text-zinc-500">Suggestions</div>
                      <div className="text-xs text-zinc-400">
                        {loading ? <span className="animate-spin inline-block w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full" /> : null}
                      </div>
                    </div>
                    <ul id={listboxIdRef.current} role="listbox" className="max-h-64 overflow-auto">
                      {items.length === 0 && !loading ? (
                        <li className="px-4 py-3 text-sm text-zinc-500">
                          No suggestions — <button onMouseDown={(e) => { e.preventDefault(); router.push(`/search?q=${encodeURIComponent(query)}`); }} className="underline">see full results</button>
                        </li>
                      ) : null}

                      {items.map((it, idx) => {
                        const label = it.label || "";
                        const parts = query ? label.split(new RegExp(`(${escapeRegExp(query)})`, "gi")) : [label];
                        const isActive = activeIndex === idx;
                        return (
                          <li
                            id={`${listboxIdRef.current}-item-${idx}`}
                            key={`${it.type}-${it.id}-${idx}`}
                            role="option"
                            aria-selected={isActive}
                            className={`px-4 py-3 text-sm cursor-pointer hover:bg-zinc-50 flex justify-between items-center ${isActive ? "bg-zinc-50" : ""}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSubmit(it.label);
                            }}
                          >
                            <span className="truncate">
                              {parts.map((part, i) =>
                                part.toLowerCase() === (query || "").toLowerCase() ? (
                                  <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark>
                                ) : (
                                  <span key={i}>{part}</span>
                                ),
                              )}
                            </span>
                            {it.type === "recent" && (
                              <button
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  handleClearRecent(it.label);
                                }}
                                className="ml-2 text-zinc-400 hover:text-zinc-600"
                                aria-label={`Clear recent ${it.label}`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </li>
                        );
                      })}

                      <li className="px-4 py-2 border-t text-sm text-zinc-600">
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            router.push(`/search?q=${encodeURIComponent(query)}`);
                          }}
                          className="w-full text-left font-medium"
                        >
                          See all results
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
}
