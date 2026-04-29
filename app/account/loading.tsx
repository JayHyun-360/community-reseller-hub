import { FormFieldSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pb-24 min-h-screen">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-xl" />
          <div className="h-4 w-64 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
        </div>

        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-6">
            <Skeleton className="w-20 h-20 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32 rounded-lg" />
              <Skeleton className="h-4 w-48 rounded-lg" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <FormFieldSkeleton />
          </div>
        </div>

        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    </div>
  );
}
