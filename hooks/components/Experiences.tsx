"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useRef, useState } from "react";

type ExperienceItem = {
  id: string;
  slug: string;
  title: string;
  cover_image: string;
  badge?: string | null;
  rating: number;
  review_count: number;
  previous_price?: number | null;
  price_per_adult: number;
};

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        const isFull = i < Math.floor(rating);
        const isHalf = i === Math.floor(rating) && rating % 1 >= 0.5;
        return (
          <Star
            key={i}
            className={`h-[14px] w-[14px] ${
              isFull || isHalf ? "fill-[#00aa6c] text-[#00aa6c]" : "text-gray-200"
            }`}
          />
        );
      })}
    </div>
  );
};

export default function Experiences({
  initialExperiences = [],
}: {
  initialExperiences?: ExperienceItem[];
}) {
  const { elementRef, isVisible } = useScrollReveal(0.05);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);

  useEffect(() => {
    if (initialExperiences.length > 0) return;

    async function load() {
      try {
        const res = await fetch("/api/treks/similar?limit=8");
        const data = await res.json();
        setExperiences(data);
      } catch (error) {
        console.error("Failed to load experiences:", error);
      }
    }
    load();
  }, [initialExperiences]);

  const scrollByAmount = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = Math.min(container.clientWidth * 0.9, 420);
    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="experiences-section"
      ref={elementRef as any}
      className={`reveal mt-10 ml-2 w-full md:mx-auto md:mt-16 md:max-w-7xl md:px-6 ${isVisible ? "reveal-visible" : ""}`}
    >
      <div className="mb-6 pr-4 md:mb-12 md:flex md:flex-col md:md:flex-row md:md:items-end md:md:justify-between md:gap-6 md:pr-0">
        <div className="max-w-xl md:max-w-none">
          <h2 className="mb-3 text-2xl leading-[0.9] font-black tracking-tighter text-[#0a2e1a] md:text-5xl">
            Unmissable Moments in the Atlas Mountains
          </h2>
        </div>
        <div className="mb-2 hidden gap-3 lg:flex">
          <button
            onClick={() => scrollByAmount("left")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white text-[#004f32] shadow-sm transition-all hover:border-[#00ef9d] hover:shadow-md"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5px]" />
          </button>
          <button
            onClick={() => scrollByAmount("right")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white text-[#004f32] shadow-sm transition-all hover:border-[#00ef9d] hover:shadow-md"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5px]" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="hide-scrollbar -mx-2 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-2 pb-8 md:mx-0 md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-16 md:overflow-visible md:px-0 md:pb-0"
      >
        {experiences.map((exp, index) => {
          return (
            <Link
              key={exp.id}
              href={`/tour/${exp.slug}`}
              className={`group reveal block min-w-[75%] snap-center transition-all duration-500 md:min-w-[280px] ${isVisible ? "reveal-visible" : ""}`}
              style={{ transitionDelay: `${(index % 4) * 100}ms` }}
            >
              <div className="flex h-full flex-col">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl shadow-md sm:aspect-[4/3] md:rounded-3xl md:shadow-lg">
                  <Image
                    src={exp.cover_image}
                    alt={`${exp.title} — Ourika Valley, Morocco`}
                    fill
                    className="object-cover saturate-[0.8] transition-transform duration-1000 group-hover:scale-110 group-hover:saturate-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {exp.badge && (
                    <div className="absolute top-4 left-4 z-10 rounded-[6px] bg-[#f2ef31] px-2 py-1 text-[11px] font-extrabold text-[#111827]">
                      {exp.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                <div className="flex flex-1 flex-col space-y-2 px-1">
                  <h3 className="line-clamp-2 text-lg leading-tight font-bold text-[#1a1a1a]">
                    {exp.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#484848]">
                      {exp.rating.toFixed(1)}
                    </span>
                    <RatingStars rating={exp.rating} />
                    <span className="text-[14px] text-gray-500">
                      ({exp.review_count.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 border-t border-gray-50 pt-2">
                    <span className="text-sm font-bold text-gray-400">from</span>
                    {exp.previous_price && (
                      <span className="mr-1 text-sm text-gray-400 line-through">
                        ${exp.previous_price.toFixed(2)}
                      </span>
                    )}
                    <span
                      className={`text-2xl font-black ${exp.previous_price ? "text-[#cc184e]" : "text-[#004f32]"}`}
                    >
                      ${exp.price_per_adult.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* View More Button */}
      <div className="mt-10 flex justify-center md:mt-16">
        <Link
          href="/experiences"
          className="group inline-flex items-center gap-3 rounded-full bg-[#0a2e1a] px-10 py-4 text-base font-black text-white shadow-lg transition-all hover:scale-105 hover:bg-[#0b3a2c] hover:shadow-xl"
        >
          See all experiences
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
