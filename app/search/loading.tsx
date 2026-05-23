import {
  ProductCardSkeleton,
  CategoryPillSkeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-24 md:pb-12 pt-8">
      <div className="sticky top-[80px] bg-white/95 backdrop-blur-md pt-3 pb-4 z-40 space-y-6 border-b border-zinc-100 shadow-sm">
        <div className="relative">
          <div className="h-14 w-full bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-full" />
        </div>

        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <CategoryPillSkeleton key={i} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
