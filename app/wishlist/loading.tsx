export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-3xl bg-gray-100 p-4">
            <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
