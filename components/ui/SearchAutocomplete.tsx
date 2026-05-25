"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search as SearchIcon, X, Clock, Sparkles } from "lucide-react";
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
  placeholder = "Search local finds...",
  size = "md",
  showClearButton = false,
}: {
  initial?: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  showClearButton?: boolean;
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
        <SearchIcon
          className={`absolute top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors ${
            size === "lg"
              ? "left-6 w-5 h-5"
              : size === "md"
                ? "left-5 w-4 h-4"
                : "left-4 w-4 h-4"
          }`}
        />
        <span
          className={`absolute top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none transition-opacity ${
            size === "lg"
              ? "left-16 text-base"
              : size === "md"
                ? "left-14 text-sm"
                : "left-12 text-xs"
          } ${isFocused || query ? "opacity-0" : "opacity-60"}`}
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
          className={`w-full bg-zinc-100 border-none rounded-full text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:bg-zinc-200 transition-all font-semibold ${
            size === "lg"
              ? "py-4 pl-16 pr-6 text-base"
              : size === "md"
                ? "py-3.5 pl-14 pr-4 text-sm"
                : "py-3 pl-12 pr-4 text-sm"
          } ${inputClassName}`}
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

        {showClearButton && query.trim().length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setQuery("");
              setOpen(false);
              setActiveIndex(-1);
              router.push("/search");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 flex items-center justify-center text-zinc-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && visibleItems.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-[70vh] flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-zinc-50 to-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-zinc-600" />
              <span className="text-sm font-bold text-zinc-700">Discover</span>
            </div>
            <div className="text-xs text-zinc-400">
              {loading ? (
                <span className="animate-spin inline-block w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full" />
              ) : null}
            </div>
          </div>

          {/* Spelling Correction */}
          {correction && correction.toLowerCase() !== query.toLowerCase() && (
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
              <div className="text-sm text-blue-700">
                Did you mean{" "}
                <button
                  className="font-bold text-blue-900 ml-1 hover:underline"
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

          {/* Multi-column content */}
          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-3 gap-6 p-6">
              {/* Left Column - Recent Searches */}
              {recent.length > 0 && (
                <div className="col-span-1 border-r border-gray-100 pr-4">
                  <div className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-3">
                    Recent
                  </div>
                  <div className="space-y-1">
                    {recent.slice(0, 5).map((r) => (
                      <button
                        key={r}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSubmit(r);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 hover:bg-gray-50 rounded-xl transition-colors duration-200 group"
                      >
                        <Clock className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 flex-shrink-0" />
                        <span className="truncate">{r}</span>
                        <button
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleClearRecent(r);
                          }}
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Clear recent ${r}`}
                        >
                          <X className="w-3 h-3 text-zinc-400" />
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Right Columns - Live Suggestions */}
              <div className={recent.length > 0 ? "col-span-2" : "col-span-3"}>
                {/* Products Section */}
                {startsWithItems.filter((it) => it.type === "product").length >
                  0 && (
                  <div className="mb-6">
                    <div className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                      Products Match
                    </div>
                    <div className="space-y-1">
                      {startsWithItems
                        .filter((it) => it.type === "product")
                        .map((it, idx) => {
                          const label = it.label || "";
                          const parts = query
                            ? label.split(
                                new RegExp(`(${escapeRegExp(query)})`, "gi"),
                              )
                            : [label];
                          const isActive = activeIndex === idx;
                          return (
                            <button
                              key={`${it.type}-${it.id}-${idx}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSubmit(it.label);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl transition-colors duration-200 text-sm ${
                                isActive ? "bg-gray-100" : "hover:bg-gray-50"
                              }`}
                            >
                              <span className="truncate">
                                {parts.map((part, i) =>
                                  part.toLowerCase() ===
                                  (query || "").toLowerCase() ? (
                                    <span
                                      key={i}
                                      className="font-bold text-zinc-900"
                                    >
                                      {part}
                                    </span>
                                  ) : (
                                    <span key={i} className="text-gray-500">
                                      {part}
                                    </span>
                                  ),
                                )}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Sellers Section */}
                {startsWithItems.filter((it) => it.type === "seller").length >
                  0 && (
                  <div className="mb-6">
                    <div className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                      Sellers Match
                    </div>
                    <div className="space-y-1">
                      {startsWithItems
                        .filter((it) => it.type === "seller")
                        .map((it, idx) => {
                          const label = it.label || "";
                          const parts = query
                            ? label.split(
                                new RegExp(`(${escapeRegExp(query)})`, "gi"),
                              )
                            : [label];
                          const actualIdx = startsWithItems.findIndex(
                            (item) => item.id === it.id,
                          );
                          const isActive = activeIndex === actualIdx;
                          return (
                            <button
                              key={`${it.type}-${it.id}-${idx}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSubmit(it.label);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-xl transition-colors duration-200 text-sm ${
                                isActive ? "bg-gray-100" : "hover:bg-gray-50"
                              }`}
                            >
                              <span className="truncate">
                                {parts.map((part, i) =>
                                  part.toLowerCase() ===
                                  (query || "").toLowerCase() ? (
                                    <span
                                      key={i}
                                      className="font-bold text-zinc-900"
                                    >
                                      {part}
                                    </span>
                                  ) : (
                                    <span key={i} className="text-gray-500">
                                      {part}
                                    </span>
                                  ),
                                )}
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Other Items Section */}
                {otherItems.length > 0 && (
                  <div className="mb-6">
                    <div className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-2">
                      More Results
                    </div>
                    <div className="space-y-1">
                      {otherItems.slice(0, 8).map((it, oIdx) => {
                        const idx = startsWithCount + oIdx;
                        const label = it.label || "";
                        const parts = query
                          ? label.split(
                              new RegExp(`(${escapeRegExp(query)})`, "gi"),
                            )
                          : [label];
                        const isActive = activeIndex === idx;
                        return (
                          <button
                            key={`${it.type}-${it.id}-${idx}`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSubmit(it.label);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-colors duration-200 text-sm flex justify-between items-center group ${
                              isActive ? "bg-gray-100" : "hover:bg-gray-50"
                            }`}
                          >
                            <span className="truncate">
                              {parts.map((part, i) =>
                                part.toLowerCase() ===
                                (query || "").toLowerCase() ? (
                                  <span
                                    key={i}
                                    className="font-bold text-zinc-900"
                                  >
                                    {part}
                                  </span>
                                ) : (
                                  <span key={i} className="text-gray-500">
                                    {part}
                                  </span>
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
                                className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Clear recent ${it.label}`}
                              >
                                <X className="w-3 h-3 text-zinc-400" />
                              </button>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {otherItems.length === 0 &&
                startsWithCount === 0 &&
                !loading ? (
                  <div className="px-3 py-4 text-sm text-center text-gray-500">
                    No suggestions —{" "}
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        router.push(`/search?q=${encodeURIComponent(query)}`);
                      }}
                      className="text-zinc-700 font-bold hover:underline"
                    >
                      see full results
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }}
              className="w-full text-left text-sm font-bold text-zinc-900 hover:text-zinc-700 transition-colors"
            >
              See all results →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
