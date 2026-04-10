"use client";

import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type ReviewCardProps = {
  review: {
    id: string;
    tourist_name: string;
    tourist_avatar: string | null;
    rating: number;
    body: string;
    treks?: { title: string } | null;
  };
  index: number;
  mobileScroll?: boolean;
};

export default function ReviewCard({ review, index, mobileScroll = false }: ReviewCardProps) {
  const { elementRef, isVisible } = useScrollReveal(0.1);
  const initials = review.tourist_name?.charAt(0).toUpperCase() || "U";

  return (
    <div
      ref={elementRef as any}
      className={`reveal group relative rounded-[2rem] border border-black/5 bg-white p-6 shadow-lg transition-all duration-700 hover:shadow-xl md:rounded-[3rem] md:p-10 ${mobileScroll ? "min-w-[85%] snap-center" : ""} ${isVisible ? "reveal-visible" : ""}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="absolute top-6 right-6 text-gray-50 opacity-10 transition-opacity group-hover:opacity-20 md:top-10 md:right-10">
        <Quote className="h-12 w-12 fill-current md:h-16 md:w-16" />
      </div>

      <div className="mb-4 flex items-center gap-1 md:mb-6">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 md:h-4 md:w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
          />
        ))}
      </div>

      <p className="mb-6 line-clamp-4 text-sm leading-relaxed font-medium text-gray-700 italic md:mb-10 md:text-lg">
        "{review.body}"
      </p>

      <div className="flex items-center gap-3 border-t border-gray-50 pt-5 md:gap-4 md:pt-8">
        <div className="relative h-10 w-10 overflow-hidden rounded-xl md:h-12 md:w-12 md:rounded-2xl">
          {review.tourist_avatar ? (
            <Image
              src={review.tourist_avatar}
              alt={`${review.tourist_name} traveler profile photo`}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0a2e1a] text-xs font-black text-white">
              {initials}
            </div>
          )}
        </div>
        <div>
          <h4 className="text-[14px] font-black text-[#0a2e1a]">{review.tourist_name}</h4>
          <p className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase">
            Verified Traveler
          </p>
          {review.treks?.title && (
            <p className="mt-0.5 text-[9px] text-gray-500">{review.treks.title}</p>
          )}
        </div>
      </div>
    </div>
  );
}
