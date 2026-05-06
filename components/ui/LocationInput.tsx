"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";

interface LocationInputProps {
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  placeholder?: string;
}

interface PhotonResult {
  properties: {
    name: string;
    city?: string;
    state?: string;
    country?: string;
  };
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
}

export function LocationInput({
  value,
  onChange,
  placeholder = "Search location...",
}: LocationInputProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<PhotonResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocation = async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`
        );
        const data = await res.json();
        setResults(data.features || []);
      } catch (error) {
        console.error("Location search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchLocation, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (result: PhotonResult) => {
    const { name, city, state, country } = result.properties;
    const [lng, lat] = result.geometry.coordinates;

    // Build display name
    const parts = [name, city, state, country].filter(Boolean);
    const displayName = parts.join(", ");

    setQuery(displayName);
    setResults([]);
    setIsOpen(false);
    onChange(displayName, lat, lng);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            onChange(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-white border border-zinc-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-zinc-900 outline-none transition-all"
        />
      </div>

      {isOpen && (query.length >= 3) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-zinc-100 overflow-hidden z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm text-zinc-400 text-center">
              Searching...
            </div>
          ) : results.length > 0 ? (
            results.map((result, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0"
              >
                <p className="text-sm font-medium text-zinc-900">
                  {result.properties.name}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {[result.properties.city, result.properties.state, result.properties.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </button>
            ))
          ) : (
            <div className="p-4 text-sm text-zinc-400 text-center">
              No locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
