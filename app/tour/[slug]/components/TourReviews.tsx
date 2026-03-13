"use client";

import Image from "next/image";
import { ChevronDown, CircleHelp, Ellipsis, Search, ThumbsUp } from "lucide-react";

const reviewBreakdown = [
  { label: "Excellent", count: 196, width: "78%" },
  { label: "Very good", count: 31, width: "16%" },
  { label: "Average", count: 10, width: "8%" },
  { label: "Poor", count: 7, width: "6%" },
  { label: "Terrible", count: 9, width: "7%" },
];

const popularMentions = [
  "fire show",
  "camel ride",
  "tagine",
  "course meal",
  "atlas mountains",
  "bread",
  "interesting trip",
  "moroccan history",
  "taking photos",
  "lots of fun",
  "fantastic experience",
  "excellent guide",
  "great trip",
  "mint tea",
  "mustapha",
  "argan",
  "oils",
];

const detailedReview = {
  author: "Bruno R",
  contributions: "4 contributions",
  title: "Amazing experiment",
  body: "A well-organized day with unforgettable mountain scenery, warm hospitality, and a guide who made every stop feel personal. The Ourika Valley views, breakfast stop, and village moments made this one of the strongest day trips from Marrakech.",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop",
};

export default function TourReviews() {
  return (
    <section id="reviews" className="border-t border-[#e5e7eb] py-10">
      <div className="mb-1 flex items-center gap-5 text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
        <button className="border-b-2 border-[#123d2f] pb-2 text-[#12311f]">Reviews</button>
        <button className="pb-2 text-[#12311f]">Q&amp;A</button>
      </div>

      <div className="grid gap-8 pt-1 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
        <div>
          <div className="mb-5 flex items-center gap-2 text-[#12311f]">
            <span className="text-[32px] leading-none font-extrabold sm:text-[36px]">4.6</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  className={`h-4 w-4 rounded-full border border-[#00aa6c] ${
                    index < 4 ? "bg-[#00aa6c]" : "bg-white"
                  }`}
                />
              ))}
            </div>
            <span className="text-[16px] text-[#4b5563]">(253)</span>
          </div>

          <div className="space-y-2.5">
            {reviewBreakdown.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[52px_minmax(0,1fr)_34px] items-center gap-3 text-[14px] text-[#12311f]"
              >
                <span>{item.label}</span>
                <div className="h-3 rounded-full bg-[#e6e6e6]">
                  <div className="h-3 rounded-full bg-[#00873e]" style={{ width: item.width }} />
                </div>
                <span className="text-right text-[#4b5563]">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="relative mb-6">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-[#5f6368]" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="h-12 w-full rounded-full border border-[#8ba18d] bg-white pr-5 pl-12 text-[15px] outline-none placeholder:text-[#5f6368] sm:h-14 sm:text-[16px]"
            />
          </div>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <button className="rounded-full border border-[#8ba18d] px-4 py-2 text-[14px] font-medium text-[#12311f] sm:text-[15px]">
              Filters
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#8ba18d] px-4 py-2 text-[14px] font-medium text-[#12311f] sm:text-[15px]">
              <span>English</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#8ba18d] px-4 py-2 text-[14px] font-medium text-[#12311f] sm:text-[15px]">
              <span>Most Insightful</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <CircleHelp className="h-4 w-4 text-[#4b5563]" />
          </div>

          <div className="border-b border-[#e5e7eb] pb-8">
            <h3 className="mb-4 text-[17px] font-extrabold text-[#12311f] sm:text-[18px]">
              Popular mentions
            </h3>
            <div className="flex flex-wrap gap-3">
              {popularMentions.map((mention) => (
                <button
                  key={mention}
                  className="rounded-full border border-[#8ba18d] px-4 py-2 text-[14px] text-[#12311f] sm:text-[15px]"
                >
                  {mention}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-b border-[#e5e7eb] py-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-[14px] text-[#5f6368]">
              <span>
                These reviews have been automatically translated from their original language.
              </span>
              <CircleHelp className="h-4 w-4" />
            </p>
            <button className="w-full rounded-full bg-[#003b1f] px-5 py-3 text-[15px] font-bold text-white sm:w-auto">
              Show original reviews
            </button>
          </div>

          <article className="py-8">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={detailedReview.avatar}
                    alt={detailedReview.author}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="text-[18px] font-extrabold text-[#12311f]">
                    {detailedReview.author}
                  </p>
                  <p className="text-[13px] text-[#6b7280]">{detailedReview.contributions}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[#12311f]">
                <button className="inline-flex items-center gap-1 text-[14px]">
                  <ThumbsUp className="h-4 w-4" />
                  <span>0</span>
                </button>
                <button>
                  <Ellipsis className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((index) => (
                <span key={index} className="h-4 w-4 rounded-full bg-[#00aa6c]" />
              ))}
            </div>

            <h4 className="mb-2 text-[22px] font-extrabold text-[#12311f] sm:text-[24px]">
              {detailedReview.title}
            </h4>
            <p className="max-w-[760px] text-[15px] leading-7 text-[#3f3f46] sm:text-[16px] sm:leading-8">
              {detailedReview.body}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
