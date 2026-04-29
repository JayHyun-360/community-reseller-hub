export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 pb-24 pt-8">
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          <div className="w-32 h-32 rounded-[2rem] bg-zinc-100 animate-pulse" />
          <div className="flex-1 space-y-4 pt-4">
            <div className="h-8 w-48 bg-zinc-100 rounded animate-pulse" />
            <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse" />
            <div className="h-4 w-64 bg-zinc-100 rounded animate-pulse" />
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 bg-zinc-100 rounded-full animate-pulse" />
          ))}
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
    </div>
  );
}
