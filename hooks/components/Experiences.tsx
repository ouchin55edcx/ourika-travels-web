"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronRight, ChevronLeft, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useState, useRef } from "react";

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

export default function Experiences() {
  const { elementRef, isVisible } = useScrollReveal(0.05);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
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
  }, []);

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
              className={`group reveal block min-w-[280px] transition-all duration-500 ${isVisible ? "reveal-visible" : ""}`}
              style={{ transitionDelay: `${(index % 4) * 100}ms` }}
            >
              <div className="flex h-full flex-col">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl shadow-lg sm:aspect-[4/3]">
                  <Image
                    src={exp.cover_image}
                    alt={exp.title}
                    fill
                    className="object-cover saturate-[0.8] transition-transform duration-1000 group-hover:scale-110 group-hover:saturate-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {exp.badge && (
                    <div className="absolute top-4 left-4 z-10 rounded-[6px] bg-[#f2ef31] px-2 py-1 text-[11px] font-extrabold text-[#111827]">
                      {exp.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <button className="group/heart absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#004f32] shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-95">
                    <Heart className="h-5 w-5 transition-all group-hover/heart:fill-red-500 group-hover/heart:text-red-500" />
                  </button>
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
