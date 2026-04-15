"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useEffect, useRef, useState, useCallback } from "react";

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
  const [activeIndex, setActiveIndex] = useState(0);

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

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const cardWidth = container.firstElementChild?.clientWidth || 280;
    const gap = 16;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(Math.min(index, experiences.length - 1));
  }, [experiences.length]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.clientWidth || 280;
    const gap = 16;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth",
    });
  };

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
      className={`reveal mt-10 w-full md:mx-auto md:mt-16 md:max-w-7xl md:px-6 ${isVisible ? "reveal-visible" : ""}`}
    >
      <div className="mb-6 px-4 md:mb-12 md:flex md:flex-col md:md:flex-row md:md:items-end md:md:justify-between md:gap-6 md:px-0">
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

      {/* Mobile Carousel Navigation Arrows */}
      <div className="relative md:hidden">
        <button
          onClick={() => scrollByAmount("left")}
          className="absolute top-1/3 -left-1 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#004f32] shadow-lg backdrop-blur-sm transition-all active:scale-95"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5 stroke-[2.5px]" />
        </button>
        <button
          onClick={() => scrollByAmount("right")}
          className="absolute top-1/3 -right-1 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#004f32] shadow-lg backdrop-blur-sm transition-all active:scale-95"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5 stroke-[2.5px]" />
        </button>

        <div
          ref={scrollRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4"
        >
          {experiences.map((exp, index) => (
            <Link
              key={exp.id}
              href={`/tour/${exp.slug}`}
              className={`group reveal block w-[80vw] max-w-[320px] flex-shrink-0 snap-center transition-all duration-500 ${isVisible ? "reveal-visible" : ""}`}
              style={{ transitionDelay: `${(index % 4) * 100}ms` }}
            >
              <div className="flex h-full flex-col">
                <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
                  <Image
                    src={exp.cover_image}
                    alt={`${exp.title} — Ourika Valley, Morocco`}
                    fill
                    className="object-cover saturate-[0.85] transition-transform duration-700 group-hover:scale-105 group-hover:saturate-100"
                    sizes="80vw"
                  />
                  {exp.badge && (
                    <div className="absolute top-3 left-3 z-10 rounded-md bg-[#f2ef31] px-2 py-1 text-[11px] font-extrabold text-[#111827]">
                      {exp.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col space-y-1.5 px-1">
                  <h3 className="line-clamp-2 text-base leading-tight font-bold text-[#1a1a1a]">
                    {exp.title}
                  </h3>

                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#484848]">
                      {exp.rating.toFixed(1)}
                    </span>
                    <RatingStars rating={exp.rating} />
                    <span className="text-[13px] text-gray-500">
                      ({exp.review_count.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 pt-1">
                    <span className="text-xs font-bold text-gray-400">from</span>
                    {exp.previous_price && (
                      <span className="mr-1 text-xs text-gray-400 line-through">
                        ${exp.previous_price.toFixed(2)}
                      </span>
                    )}
                    <span
                      className={`text-xl font-black ${exp.previous_price ? "text-[#cc184e]" : "text-[#004f32]"}`}
                    >
                      ${exp.price_per_adult.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Carousel Dots Indicator */}
        <div className="mt-4 flex justify-center gap-2">
          {experiences.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-6 bg-[#0a2e1a]" : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-4 md:gap-x-8 md:gap-y-16">
        {experiences.map((exp, index) => (
          <Link
            key={exp.id}
            href={`/tour/${exp.slug}`}
            className={`group reveal block transition-all duration-500 ${isVisible ? "reveal-visible" : ""}`}
            style={{ transitionDelay: `${(index % 4) * 100}ms` }}
          >
            <div className="flex h-full flex-col">
              <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
                <Image
                  src={exp.cover_image}
                  alt={`${exp.title} — Ourika Valley, Morocco`}
                  fill
                  className="object-cover saturate-[0.8] transition-transform duration-1000 group-hover:scale-110 group-hover:saturate-100"
                  sizes="(max-width: 1200px) 50vw, 25vw"
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
                  <span className="text-sm font-bold text-[#484848]">{exp.rating.toFixed(1)}</span>
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
        ))}
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
      <div className="mt-8 mb-8 flex justify-center px-4 md:mt-16 md:mb-0 md:px-0">
        <Link
          href="/experiences"
          className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#0a2e1a] px-10 py-4 text-base font-black text-white shadow-lg transition-all hover:scale-105 hover:bg-[#0b3a2c] hover:shadow-xl sm:w-auto"
        >
          See all experiences
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
