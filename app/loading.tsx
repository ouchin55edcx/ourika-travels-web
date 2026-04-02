const contentSkeleton = "h-64 animate-pulse rounded-3xl bg-gray-100";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <main className="flex flex-col">
        <section className="px-6 pt-10 pb-8 md:pt-20 md:pb-12">
          <div className="mx-auto max-w-5xl space-y-6">
            <div className="mx-auto h-14 w-3/4 animate-pulse rounded-2xl bg-gray-100 md:h-20" />
            <div className="mx-auto h-14 max-w-4xl animate-pulse rounded-full bg-gray-100 md:h-20" />
          </div>
        </section>
        <div className="space-y-12 px-6 pb-12 md:space-y-16">
          <div className={contentSkeleton} />
          <div className={contentSkeleton} />
          <div className={contentSkeleton} />
          <div className={contentSkeleton} />
        </div>
      </main>
    </div>
  );
}
