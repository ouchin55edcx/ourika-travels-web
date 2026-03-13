export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-[#1f1f1f] selection:bg-[#34e0a1] selection:text-black">
      <div className="sticky top-0 z-40 h-14 animate-pulse bg-gray-100" />

      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-3 py-6 sm:px-6 lg:px-8">
        <div className="h-64 w-full animate-pulse rounded-2xl bg-gray-200" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-2xl bg-gray-100 p-6">
                <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </section>

          <aside className="w-full lg:w-80">
            <div className="h-96 w-full animate-pulse rounded-2xl bg-gray-100" />
          </aside>
        </div>
      </main>
    </div>
  );
}
