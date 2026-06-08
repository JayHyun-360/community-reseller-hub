"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number | null; // null if no ratings
  count: number; // number of ratings
  onRate?: (rating: number) => void; // callback to rate (only if interactive)
  interactive?: boolean; // if true, shows interactive stars
  size?: "sm" | "md" | "lg"; // star size
}

export function RatingStars({
  rating,
  count,
  onRate,
  interactive = false,
  size = "md",
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating || rating || 0;

  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }[size];

  const textSizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={!interactive}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => interactive && onRate?.(star)}
            className={`${interactive ? "cursor-pointer" : "cursor-default"} transition-colors`}
          >
            <Star
              className={`${sizeClass} ${
                star <= displayRating
                  ? "fill-amber-400 text-amber-400"
                  : "text-zinc-300"
              } transition-colors`}
            />
          </button>
        ))}
      </div>

      {rating !== null && (
        <span className={`${textSizeClass} font-semibold text-zinc-700`}>
          {rating.toFixed(1)}
        </span>
      )}

      {count > 0 && (
        <span className={`${textSizeClass} text-zinc-400`}>
          · {count} {count === 1 ? "rating" : "ratings"}
        </span>
      )}

      {rating === null && count === 0 && (
        <span className={`${textSizeClass} text-zinc-400`}>
          {interactive ? "Rate this product" : "No ratings yet"}
        </span>
      )}
    </div>
  );
}
