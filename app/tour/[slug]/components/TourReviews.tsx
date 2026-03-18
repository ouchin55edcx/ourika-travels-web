"use client";

import Image from "next/image";
import { ChevronDown, CircleHelp, Ellipsis, Search, ThumbsUp, Star } from "lucide-react";

type Props = {
  rating: number;
  reviewCount: number;
  reviewBreakdown: { label: string; count: number; percentage: string }[];
  popularMentions: string[];
  reviews: {
    author: string;
    contributions: string;
    date: string;
    title?: string;
    body: string;
    avatar?: string;
    rating?: number;
    rating_guide?: number;
    rating_value?: number;
    rating_service?: number;
  }[];
};

export default function TourReviews({
  rating,
  reviewCount,
  reviewBreakdown,
  popularMentions,
  reviews,
}: Props) {
  const hasReviews = reviews.length > 0;

  return (
    <section id="reviews" className="border-t border-[#e5e7eb] py-10">
      <div className="mb-1 flex items-center gap-5 text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
        <button className="border-b-2 border-[#0f3d24] pb-2 text-[#0a2e1a]">Reviews</button>
        <button className="pb-2 text-[#0a2e1a]">Q&amp;A</button>
      </div>

      <div className="grid gap-8 pt-1 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
        <div>
          <div className="mb-5 flex items-center gap-2 text-[#0a2e1a]">
            <span className="text-[32px] leading-none font-extrabold sm:text-[36px]">
              {rating.toFixed(1)}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`h-4 w-4 rounded-full border border-[#00aa6c] ${
                    index < Math.round(rating) ? "bg-[#00aa6c]" : "bg-white"
                  }`}
                />
              ))}
            </div>
            <span className="text-[16px] text-[#4b5563]">({reviewCount})</span>
          </div>

          <div className="space-y-2.5">
            {reviewBreakdown.length > 0 ? (
              reviewBreakdown.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[52px_minmax(0,1fr)_34px] items-center gap-3 text-[14px] text-[#0a2e1a]"
                >
                  <span>{item.label}</span>
                  <div className="h-3 rounded-full bg-[#e6e6e6]">
                    <div
                      className="h-3 rounded-full bg-[#00873e]"
                      style={{ width: item.percentage }}
                    />
                  </div>
                  <span className="text-right text-[#4b5563]">{item.count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#4b5563]">No reviews yet</p>
            )}
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
            <button className="rounded-full border border-[#8ba18d] px-4 py-2 text-[14px] font-medium text-[#0a2e1a] sm:text-[15px]">
              Filters
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#8ba18d] px-4 py-2 text-[14px] font-medium text-[#0a2e1a] sm:text-[15px]">
              <span>English</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#8ba18d] px-4 py-2 text-[14px] font-medium text-[#0a2e1a] sm:text-[15px]">
              <span>Most Insightful</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <CircleHelp className="h-4 w-4 text-[#4b5563]" />
          </div>

          {popularMentions.length > 0 && (
            <div className="border-b border-[#e5e7eb] pb-8">
              <h3 className="mb-4 text-[17px] font-extrabold text-[#0a2e1a] sm:text-[18px]">
                Popular mentions
              </h3>
              <div className="flex flex-wrap gap-3">
                {popularMentions.map((mention) => (
                  <button
                    key={mention}
                    className="rounded-full border border-[#8ba18d] px-4 py-2 text-[14px] text-[#0a2e1a] sm:text-[15px]"
                  >
                    {mention}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasReviews ? (
            <>
              <div className="flex flex-col gap-4 border-b border-[#e5e7eb] py-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[14px] text-[#5f6368]">
                  {reviews.length} verified review{reviews.length !== 1 ? "s" : ""} from real
                  travelers
                </p>
              </div>

              <div className="space-y-0">
                {reviews.map((review, index) => (
                  <article
                    key={`${review.author}-${index}`}
                    className="border-b border-[#e5e7eb] py-8 last:border-b-0"
                  >
                    {/* Author row */}
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-100">
                          {review.avatar ? (
                            <Image
                              src={review.avatar}
                              alt={review.author}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#0b3a2c] text-lg font-black text-[#00ef9d]">
                              {review.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[17px] font-extrabold text-[#0a2e1a]">
                            {review.author}
                          </p>
                          <p className="text-[13px] text-[#6b7280]">{review.contributions}</p>
                        </div>
                      </div>
                      <p className="shrink-0 text-[13px] text-[#6b7280] sm:text-right">
                        {review.date}
                      </p>
                    </div>

                    {/* Stars */}
                    {review.rating && (
                      <div className="mb-3 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              className={`h-4 w-4 rounded-full border border-[#00aa6c] ${s <= review.rating! ? "bg-[#00aa6c]" : "bg-white"}`}
                            />
                          ))}
                        </div>
                        <span className="text-[13px] font-bold text-[#00873e]">
                          {["", "Terrible", "Poor", "Average", "Good", "Excellent"][review.rating]}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    {review.title && (
                      <h4 className="mb-2 text-[20px] font-extrabold text-[#0a2e1a] sm:text-[22px]">
                        {review.title}
                      </h4>
                    )}

                    {/* Body */}
                    <p className="max-w-[760px] text-[15px] leading-7 text-[#3f3f46] sm:text-[16px] sm:leading-8">
                      {review.body}
                    </p>

                    {/* Sub-ratings */}
                    {(review.rating_guide || review.rating_value || review.rating_service) && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {[
                          { label: "Guide", val: review.rating_guide },
                          { label: "Value", val: review.rating_value },
                          { label: "Service", val: review.rating_service },
                        ]
                          .filter((x) => x.val)
                          .map((x) => (
                            <div
                              key={x.label}
                              className="flex items-center gap-1.5 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5"
                            >
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <span
                                    key={s}
                                    className={`h-2.5 w-2.5 rounded-full border border-[#00aa6c] ${s <= x.val! ? "bg-[#00aa6c]" : "bg-white"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-[12px] font-semibold text-[#6b7280]">
                                {x.label}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="border-t border-[#e5e7eb] py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                <Star className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-[18px] font-bold text-[#6b7280]">No reviews yet</p>
              <p className="mt-2 text-[14px] text-[#9ca3af]">
                Be the first to share your experience on this trek.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
