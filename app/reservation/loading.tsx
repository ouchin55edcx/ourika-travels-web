export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 animate-pulse border-b border-gray-100 bg-white" />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="space-y-4 rounded-3xl bg-white p-6">
          <div className="h-8 w-1/2 animate-pulse rounded bg-gray-200" />
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </section>
        <aside className="rounded-3xl bg-white p-6">
          <div className="h-32 animate-pulse rounded-2xl bg-gray-100" />
          <div className="mt-4 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          </div>
        </aside>
      </main>
    </div>
  );
}
