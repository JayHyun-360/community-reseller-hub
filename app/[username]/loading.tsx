import {
  ProductCardSkeleton,
  CategoryPillSkeleton,
  ProfileSkeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 pb-24 pt-8">
        <ProfileSkeleton />

        <div className="flex gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <CategoryPillSkeleton key={i} />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
