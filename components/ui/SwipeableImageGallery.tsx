"use client";

import { useState, useRef, useEffect } from "react";
import { ProductImage } from "./ProductImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SwipeableImageGalleryProps {
  images: string[];
  title: string;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
}

export function SwipeableImageGallery({
  images,
  title,
  width = 480,
  height = 600,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  className = "",
}: SwipeableImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartXRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and on resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return;

    const touchEndX = e.changedTouches[0].clientX;
    const timeDiff = Date.now() - touchStartTimeRef.current;
    const distance = touchStartXRef.current - touchEndX;
    const isSwipe = Math.abs(distance) > 50 && timeDiff < 300;

    if (isSwipe) {
      if (distance > 0) {
        // Swiped left, go to next image
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        // Swiped right, go to previous image
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!isMobile) {
    // Desktop: show only first image
    return (
      <ProductImage
        src={images[0]}
        alt={title}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
      />
    );
  }

  // Mobile: show swipeable gallery
  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full bg-zinc-50 overflow-hidden"
    >
      <ProductImage
        src={images[currentIndex]}
        alt={`${title} - Image ${currentIndex + 1}`}
        width={width}
        height={height}
        sizes={sizes}
        className={className}
        priority={currentIndex === 0}
      />

      {/* Image counter badge */}
      <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-bold">
        {currentIndex + 1}/{images.length}
      </div>

      {/* Navigation arrows on mobile when multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-zinc-900 p-2 rounded-full transition-colors z-10 active:bg-white/60"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-zinc-900 p-2 rounded-full transition-colors z-10 active:bg-white/60"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
