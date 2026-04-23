export default function Loading() {
  return (
    <div className="max-w-[1600px] mx-auto pb-24 md:pb-12 bg-white min-h-screen">
      <section className="pt-12 px-6">
        <div className="max-w-2xl px-2 space-y-8">
          <div className="h-16 w-96 bg-zinc-100 rounded-lg animate-pulse" />
          <div className="h-8 w-[500px] bg-zinc-100 rounded-lg animate-pulse" />
        </div>

        <div className="mt-16 flex gap-8 overflow-x-auto pb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex-shrink-0 w-44 md:w-64">
              <div className="aspect-[4/5] rounded-[2rem] bg-zinc-100 mb-4 animate-pulse" />
              <div className="px-2 space-y-2">
                <div className="h-3 w-12 bg-zinc-100 rounded animate-pulse" />
                <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="flex justify-between items-end mb-10 px-2">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-zinc-100 rounded animate-pulse" />
            <div className="h-3 w-56 bg-zinc-100 rounded animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 w-20 bg-zinc-100 rounded-full animate-pulse" />
            ))}
          </div>
        </div>

        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-8 px-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="mb-6">
              <div className="aspect-[3/4] rounded-[1.5rem] bg-zinc-100 mb-2 animate-pulse" />
              <div className="flex justify-between px-2">
                <div className="h-3 w-24 bg-zinc-100 rounded animate-pulse" />
                <div className="h-3 w-12 bg-zinc-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
