export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-4 w-40 animate-pulse rounded bg-gray-100" />
        <div className="mb-8 h-40 animate-pulse rounded-3xl bg-gray-100" />
        <div className="mb-8 h-16 animate-pulse rounded-2xl bg-gray-100" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-2xl bg-gray-100 p-3">
              <div className="aspect-[4/3] animate-pulse rounded-xl bg-gray-200" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
