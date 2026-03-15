'use client';

import { ChevronRight } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { Category } from '@/app/actions/categories';

// Helper — same as in category page
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default function MoreToExplore({
  categories = [],
  title = 'Explore by category',
}: {
  categories?: Category[];
  title?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const items = useMemo(() => categories.slice(0, 10), [categories]);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 8);
  };

  const scrollNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.max(280, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section className="w-full">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-[18px] leading-tight font-black text-[#111827]
          sm:text-[20px] md:text-[22px]">
          {title}
        </h2>
        <Link href="/experiences"
          className="shrink-0 text-sm font-bold text-[#004f32] hover:underline">
          See all
        </Link>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          onPointerEnter={updateScrollState}
          className="flex snap-x snap-mandatory gap-4
            overflow-x-auto pr-10 pb-2 [-webkit-overflow-scrolling:touch]
            [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map(cat => (
            <Link
              key={cat.id}
              href={`/category/${nameToSlug(cat.name)}`}
              className="group relative h-[220px] min-w-[240px] snap-start
                overflow-hidden rounded-2xl bg-[#111827]
                shadow-[0_2px_14px_rgba(0,0,0,0.10)] transition
                hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)]
                sm:h-[240px] sm:min-w-[260px]"
            >
              {/* Photo or fallback gradient */}
              {cat.photo ? (
                <img
                  src={cat.photo}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover
                    transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br
                  from-[#004f32] to-[#003a25]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t
                from-black/75 via-black/10 to-black/0" />

              <div className="absolute right-4 bottom-4 left-4">
                <p className="max-w-[15ch] text-left text-[20px] leading-[1.05]
                  font-black text-white sm:text-[22px]">
                  {cat.name}
                </p>
                {cat.description && (
                  <p className="mt-1 line-clamp-1 text-[12px] font-medium
                    text-white/70 opacity-0 transition-opacity duration-300
                    group-hover:opacity-100">
                    {cat.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Scroll right"
          className={`absolute top-1/2 right-2 hidden -translate-y-1/2
            items-center justify-center rounded-full border border-[#e5e7eb]
            bg-white/95 p-2.5 shadow-sm backdrop-blur-sm transition
            hover:bg-white md:flex
            ${canScrollRight ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <ChevronRight className="h-5 w-5 text-[#111827]" />
        </button>
      </div>
    </section>
  );
}

