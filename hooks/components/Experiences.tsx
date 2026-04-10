"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Star, Heart } from "lucide-react";
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
      className={`reveal mx-auto w-full max-w-7xl px-6 py-16 md:py-24 xl:py-32 ${isVisible ? "reveal-visible" : ""}`}
    >
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="mb-4 text-4xl leading-[0.9] font-black tracking-tighter text-[#0a2e1a] md:text-5xl">
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
        className="hide-scrollbar flex snap-x snap-mandatory scroll-pl-6 gap-6 overflow-x-auto pb-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {experiences.map((exp, index) => {
          return (
            <Link
              key={exp.id}
              href={`/tour/${exp.slug}`}
              className={`group reveal block transition-all duration-500 ${isVisible ? "reveal-visible" : ""}`}
              style={{ transitionDelay: `${(index % 4) * 100}ms` }}
            >
              <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-lg">
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100 sm:aspect-[4/3]">
                  <Image
                    src={exp.cover_image}
                    alt={`${exp.title} — Ourika Valley, Morocco`}
                    fill
                    className="object-cover saturate-[0.8] transition-transform duration-1000 group-hover:scale-110 group-hover:saturate-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Heart Icon */}
                  <button className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-110 active:scale-95">
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  {/* Badge */}
                  {exp.badge && (
                    <div className="absolute top-3 left-3 z-10 rounded-md bg-[#f2ef31] px-2 py-1 text-[10px] font-extrabold text-[#111827]">
                      {exp.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col space-y-2 p-4">
                  <h3 className="line-clamp-2 text-sm font-bold leading-tight text-[#1a1a1a]">
                    {exp.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1a1a1a]">
                      {exp.rating.toFixed(1)}
                    </span>
                    <RatingStars rating={exp.rating} />
                    <span className="text-[11px] text-gray-500">
                      ({exp.review_count.toLocaleString()})
                    </span>
                  </div>

                  <div className="border-t border-gray-50 pt-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-gray-500">from</span>
                      {exp.previous_price && (
                        <span className="mr-1 text-xs text-gray-400 line-through">
                          ${exp.previous_price.toFixed(2)}
                        </span>
                      )}
                      <span className="font-black text-[#004f32]">
                        ${exp.price_per_adult.toFixed(2)}
                      </span>
                    </div>
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
      <div className="mt-16 flex justify-center">
        <Link
          href="/experiences"
          className="group inline-flex items-center gap-3 rounded-full bg-[#004f32] px-12 py-5 text-lg font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-[#003a25]"
        >
          See all experiences
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
