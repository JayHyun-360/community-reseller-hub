export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 pb-24 min-h-screen">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-zinc-100 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-zinc-100 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-zinc-100 rounded-3xl p-6">
              <div className="h-4 w-20 bg-zinc-100 rounded animate-pulse mb-4" />
              <div className="h-8 w-12 bg-zinc-100 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-zinc-100 rounded animate-pulse" />
          <div className="h-10 w-32 bg-zinc-100 rounded-full animate-pulse" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white border border-zinc-100 rounded-2xl">
              <div className="w-16 h-16 bg-zinc-100 rounded-2xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-zinc-100 rounded animate-pulse" />
                <div className="h-3 w-32 bg-zinc-100 rounded animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-zinc-100 rounded-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
