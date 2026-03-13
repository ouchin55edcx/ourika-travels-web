"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { useMemo, useRef, useState } from "react";

type ExploreItem = {
  title: string;
  image: string;
};

const defaultItems: ExploreItem[] = [
  {
    title: "Tours & Sightseeing",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Luxury & Special Occasions",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Outdoor Activities",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Shows, Concerts & Sports",
    image:
      "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Cultural & Theme Tours",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function MoreToExplore({
  title = "More to explore in Marrakech-Safi",
  items = defaultItems,
}: {
  title?: string;
  items?: ExploreItem[];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const normalizedItems = useMemo(() => items.slice(0, 10), [items]);

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const remaining = el.scrollWidth - el.clientWidth - el.scrollLeft;
    setCanScrollRight(remaining > 8);
  };

  const scrollNext = () => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: Math.max(280, el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <section className="w-full">
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-[18px] leading-tight font-black text-[#111827] sm:text-[20px] md:text-[22px]">
          {title}
        </h2>
      </div>

      <div className="relative">
        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          onPointerEnter={updateScrollState}
          className="explore-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pr-10 pb-2 [-webkit-overflow-scrolling:touch]"
        >
          {normalizedItems.map((item) => (
            <button
              key={item.title}
              type="button"
              className="group relative h-[220px] min-w-[240px] snap-start overflow-hidden rounded-2xl bg-[#111827] shadow-[0_2px_14px_rgba(0,0,0,0.10)] transition hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] sm:h-[240px] sm:min-w-[260px]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 260px, 280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/0" />
              <div className="absolute right-4 bottom-4 left-4">
                <p className="max-w-[15ch] text-left text-[20px] leading-[1.05] font-black text-white sm:text-[22px]">
                  {item.title}
                </p>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={scrollNext}
          aria-label="Scroll right"
          className={`absolute top-1/2 right-2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white/95 p-2.5 shadow-sm backdrop-blur-sm transition hover:bg-white md:flex ${
            canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ChevronRight className="h-5 w-5 text-[#111827]" />
        </button>
      </div>

      <style jsx>{`
        .explore-scroll::-webkit-scrollbar {
          display: none;
        }
        .explore-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
