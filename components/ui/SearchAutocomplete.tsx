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
  score?: number;
}

const RECENT_KEY = "recent_searches_v1";

export default function SearchAutocomplete({
  initial = "",
  className = "",
  inputClassName = "",
  placeholder = "Search",
}: {
  initial?: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initial);
  const [suggestions, setSuggestions] = useState<{
    products: Suggestion[];
    sellers: Suggestion[];
  }>({ products: [], sellers: [] });
  const [correction, setCorrection] = useState<string | null>(null);
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
  const listboxIdRef = useRef<string>(
    `search-autocomplete-${Math.random().toString(36).slice(2)}`,
  );
  const lastShortQueryTimeRef = useRef<number>(0);
  const [isFocused, setIsFocused] = useState(false);

  // Close on outside click
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
      setCorrection(null);
      return;
    }

    const q = query.trim();
    if (!q) return;

    // Throttle short single-letter queries to avoid spamming the server
    const now = Date.now();
    if (q.length === 1) {
      if (now - lastShortQueryTimeRef.current < 400) {
        setLoading(false);
        return;
      }
      lastShortQueryTimeRef.current = now;
    }

    if (cache.current.has(q)) {
      const cached = cache.current.get(q);
      setSuggestions({
        products: cached.products ?? [],
        sellers: cached.sellers ?? [],
      });
      setCorrection(cached.correction ?? null);
      return;
    }

    setLoading(true);
    if (debouncedRef.current) window.clearTimeout(debouncedRef.current);
    const debounceDelay = q.length <= 1 ? 75 : 150;
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
        setSuggestions({
          products: data.products ?? [],
          sellers: data.sellers ?? [],
        });
        setCorrection(data.correction ?? null);
      } catch (err) {
        // ignore aborts
      } finally {
        setLoading(false);
      }
    }, debounceDelay);
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
      label: p.title || "",
    }));
    const sellerItems = suggestions.sellers.map((s) => ({
      type: "seller",
      id: s.id,
      label: s.username || s.full_name || "",
    }));
    const recentItems = recent.map((r) => ({
      type: "recent",
      id: r,
      label: r,
    }));
    return [...recentItems, ...productItems, ...sellerItems];
  }, [suggestions, recent]);

  const startsWith = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q)
      return { products: [] as Suggestion[], sellers: [] as Suggestion[] };
    const p = suggestions.products.filter((pr) =>
      (pr.title || "").toLowerCase().startsWith(q),
    );
    const s = suggestions.sellers.filter((sr) =>
      (sr.username || sr.full_name || "").toLowerCase().startsWith(q),
    );
    return { products: p, sellers: s };
  }, [suggestions, query]);

  const otherItems = useMemo(() => {
    const startProductIds = new Set(startsWith.products.map((p) => p.id));
    const startSellerIds = new Set(startsWith.sellers.map((s) => s.id));
    return items.filter((it) => {
      if (it.type === "product" && startProductIds.has(it.id)) return false;
      if (it.type === "seller" && startSellerIds.has(it.id)) return false;
      return true;
    });
  }, [items, startsWith]);

  const startsWithItems = useMemo(() => {
    const p = startsWith.products.map((pr) => ({
      type: "product",
      id: pr.id,
      label: pr.title || "",
    }));
    const s = startsWith.sellers.map((sr) => ({
      type: "seller",
      id: sr.id,
      label: sr.username || sr.full_name || "",
    }));
    return [...p, ...s];
  }, [startsWith]);

  const visibleItems = useMemo(() => {
    return [...startsWithItems, ...otherItems];
  }, [startsWithItems, otherItems]);
  const startsWithCount = startsWithItems.length;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div className="w-full relative group">
        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <span
          className={`absolute left-14 top-1/2 -translate-y-1/2 text-sm text-zinc-400 pointer-events-none transition-opacity ${isFocused || query ? "opacity-0" : "opacity-60"}`}
        >
          {placeholder}
        </span>
        <input
          type="text"
          aria-label="Search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxIdRef.current}
          aria-activedescendant={
            activeIndex >= 0
              ? `${listboxIdRef.current}-item-${activeIndex}`
              : undefined
          }
          className={`w-full bg-zinc-100 border-none rounded-full py-3.5 pl-14 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:bg-zinc-200 transition-all ${inputClassName}`}
          value={query}
          onChange={(e) => {
            setQuery(e.currentTarget.value);
            setOpen(true);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (activeIndex >= 0 && visibleItems[activeIndex]) {
                handleSubmit(visibleItems[activeIndex].label);
              } else {
                handleSubmit();
              }
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActiveIndex((i) => Math.min(i + 1, visibleItems.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Escape") {
              setOpen(false);
              setActiveIndex(-1);
            }
          }}
        />
      </div>

      {open && visibleItems.length > 0 && (
        <div className="absolute z-40 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="px-3 py-2 border-b flex items-center justify-between">
            <div className="text-sm text-zinc-500">Suggestions</div>
            <div className="text-xs text-zinc-400">
              {loading ? (
                <span className="animate-spin inline-block w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full" />
              ) : null}
            </div>
          </div>

          {correction && correction.toLowerCase() !== query.toLowerCase() && (
            <div className="px-4 py-2 text-sm bg-zinc-50 border-b flex items-center justify-between">
              <div className="text-zinc-700">
                Did you mean{" "}
                <button
                  className="underline font-medium ml-1"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery(correction || "");
                    handleSubmit(correction || undefined);
                  }}
                >
                  {correction}
                </button>
                ?
              </div>
            </div>
          )}

          <ul
            id={listboxIdRef.current}
            role="listbox"
            className="max-h-64 overflow-auto"
          >
            {startsWithCount > 0 && (
              <li className="px-4 py-2 text-xs font-black text-zinc-500">
                Starts with
              </li>
            )}

            {startsWithItems.map((it, idx) => {
              const label = it.label || "";
              const parts = query
                ? label.split(new RegExp(`(${escapeRegExp(query)})`, "gi"))
                : [label];
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
                        <mark key={i} className="bg-yellow-200 px-0.5 rounded">
                          {part}
                        </mark>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                  </span>
                </li>
              );
            })}

            {otherItems.length === 0 && startsWithCount === 0 && !loading ? (
              <li className="px-4 py-3 text-sm text-zinc-500">
                No suggestions —{" "}
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="underline"
                >
                  see full results
                </button>
              </li>
            ) : null}

            {otherItems.map((it, oIdx) => {
              const idx = startsWithCount + oIdx;
              const label = it.label || "";
              const parts = query
                ? label.split(new RegExp(`(${escapeRegExp(query)})`, "gi"))
                : [label];
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
                        <mark key={i} className="bg-yellow-200 px-0.5 rounded">
                          {part}
                        </mark>
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
    </div>
  );
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
