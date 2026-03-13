"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useRef } from "react";
import { ratingDots, similarExperiences } from "@/lib/data/tourData";

export default function TourSimilarExperiences() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (direction: "left" | "right") => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const amount = Math.min(container.clientWidth * 0.9, 420);
    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-10">
      <div className="mb-1 flex items-center justify-between gap-4">
        <h3 className="text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
          Similar experiences
        </h3>
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123d2f] text-[#123d2f] transition hover:bg-[#f6f8f7]"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#123d2f] text-[#123d2f] transition hover:bg-[#f6f8f7]"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="hide-scrollbar flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-0 pt-1 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0"
      >
        {similarExperiences.map((experience) => (
          <article
            key={experience.title}
            className="group max-w-[256px] min-w-[256px] shrink-0 snap-start rounded-[18px] bg-white p-0 first:ml-4 last:mr-4 sm:max-w-[268px] sm:min-w-[268px] sm:first:ml-6 sm:last:mr-6 lg:mr-0 lg:ml-0 lg:max-w-none lg:min-w-0 lg:rounded-none lg:bg-transparent"
          >
            <div className="relative mb-3 overflow-hidden rounded-[16px]">
              <div className="relative aspect-[4/5] lg:aspect-[4/4]">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 268px, 25vw"
                />
              </div>
              <button className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#123d2f] shadow-sm">
                <Heart className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-3 rounded-[6px] bg-[#f2ef31] px-2 py-1 text-[11px] font-extrabold text-[#111827]">
                2025
              </div>
            </div>

            {experience.badge ? (
              <div
                className={`mb-2 inline-flex rounded-[4px] border px-2 py-0.5 text-[11px] font-semibold ${
                  experience.badge === "Special Offer"
                    ? "border-[#ef4a72] text-[#ef4a72]"
                    : "border-[#9ca3af] text-[#111827]"
                }`}
              >
                {experience.badge}
              </div>
            ) : null}

            <h4 className="text-[15px] leading-7 font-extrabold text-[#12311f] sm:text-[16px] lg:text-[17px]">
              {experience.title}
            </h4>

            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[13px] sm:text-sm">
              <span className="font-medium">{experience.rating}</span>
              <div className="flex items-center gap-1">
                {ratingDots.map((_, index) => (
                  <span
                    key={`${experience.title}-${index}`}
                    className="h-3 w-3 rounded-full bg-[#00aa6c]"
                  />
                ))}
              </div>
              <span className="text-[#6b7280]">({experience.reviews})</span>
            </div>

            <p className="mt-2 text-[14px] text-[#666] lg:text-[15px]">{experience.category}</p>

            <p className="mt-4 text-[15px] font-extrabold text-[#12311f] sm:text-[16px] lg:text-[17px]">
              from{" "}
              {experience.oldPrice ? (
                <span className="mr-1 text-[#666] line-through">{experience.oldPrice}</span>
              ) : null}
              <span className={experience.oldPrice ? "text-[#cc184e]" : ""}>
                {experience.price}
              </span>{" "}
              per adult
              {experience.highlight ? (
                <span className="font-medium text-[#12311f]"> {experience.highlight}</span>
              ) : null}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
