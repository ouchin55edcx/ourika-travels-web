export default function Loading() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-6 px-3 py-6 sm:px-6 lg:px-8">
        <div className="h-16 animate-pulse rounded-2xl bg-gray-100" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse rounded-2xl bg-gray-100 p-2.5">
              <div className="aspect-[4/3] rounded-xl bg-gray-200" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
