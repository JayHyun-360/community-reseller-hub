"use client";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden">
        <Skeleton className="w-full h-full rounded-[1.5rem]" />
      </div>
      <div className="space-y-2 px-1">
        <Skeleton className="h-3 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-1/3 rounded-full" />
      </div>
    </div>
  );
}

export function SellerCardSkeleton() {
  return (
    <div className="bg-white border border-zinc-200 rounded-[2rem] p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-3 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
      <div className="flex justify-between pt-4 border-t border-zinc-100">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function CategoryPillSkeleton() {
  return <Skeleton className="h-10 w-20 rounded-full" />;
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white border border-zinc-200 p-8 rounded-[2rem] space-y-4">
      <div className="flex justify-between">
        <Skeleton className="w-12 h-12 rounded-2xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-8 w-12 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function ProductRowSkeleton() {
  return (
    <div className="flex items-center gap-6 p-6 bg-white border border-zinc-100 rounded-2xl">
      <Skeleton className="w-16 h-16 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48 rounded-lg" />
        <Skeleton className="h-3 w-24 rounded-lg" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-12">
      <Skeleton className="w-32 h-32 rounded-[2rem]" />
      <div className="flex-1 space-y-4 pt-4">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-4 w-32 rounded-lg" />
        <Skeleton className="h-4 w-64 rounded-lg" />
      </div>
    </div>
  );
}

export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-3 w-24 rounded-full" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

export function TrendingCardSkeleton() {
  return (
    <div className="flex-shrink-0 w-44 md:w-64">
      <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-100 mb-4">
        <Skeleton className="w-full h-full rounded-[2rem]" />
      </div>
      <div className="px-2 space-y-2">
        <Skeleton className="h-2 w-12 rounded-full" />
        <Skeleton className="h-3 w-3/4 rounded-full" />
      </div>
    </div>
  );
}
