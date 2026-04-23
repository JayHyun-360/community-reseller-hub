export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-24 md:pb-12 pt-8">
      <div className="sticky top-20 bg-white pt-2 pb-6 z-40 space-y-8">
        <div className="relative">
          <div className="h-14 w-full bg-zinc-100 rounded-full animate-pulse" />
        </div>

        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-24 bg-zinc-100 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] rounded-[1.5rem] bg-zinc-100 animate-pulse" />
            <div className="h-3 w-3/4 bg-zinc-100 rounded animate-pulse" />
            <div className="h-3 w-1/4 bg-zinc-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
