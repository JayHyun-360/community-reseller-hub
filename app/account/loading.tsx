export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 pb-24 min-h-screen">
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-10 w-48 bg-zinc-100 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-zinc-100 rounded animate-pulse" />
        </div>

        <div className="bg-white border border-zinc-200 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-zinc-100 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-32 bg-zinc-100 rounded animate-pulse" />
              <div className="h-4 w-48 bg-zinc-100 rounded animate-pulse" />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-zinc-100 rounded animate-pulse" />
              <div className="h-12 w-full bg-zinc-100 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-zinc-100 rounded animate-pulse" />
              <div className="h-12 w-full bg-zinc-100 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-zinc-100 rounded animate-pulse" />
              <div className="h-12 w-full bg-zinc-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>

        <div className="h-12 w-full bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
