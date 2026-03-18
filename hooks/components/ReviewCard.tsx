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
};

export default function ReviewCard({ review, index }: ReviewCardProps) {
  const { elementRef, isVisible } = useScrollReveal(0.1);
  const initials = review.tourist_name?.charAt(0).toUpperCase() || "U";

  return (
    <div
      ref={elementRef as any}
      className={`reveal group relative rounded-[3rem] border border-black/5 bg-white p-10 shadow-xl transition-all duration-700 hover:shadow-2xl ${isVisible ? "reveal-visible" : ""}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="absolute top-10 right-10 text-gray-50 opacity-10 transition-opacity group-hover:opacity-20">
        <Quote className="h-16 w-16 fill-current" />
      </div>

      <div className="mb-6 flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
          />
        ))}
      </div>

      <p className="mb-10 text-lg leading-relaxed font-medium text-gray-700 italic">
        "{review.body}"
      </p>

      <div className="flex items-center gap-4 border-t border-gray-50 pt-8">
        <div className="relative h-12 w-12 overflow-hidden rounded-2xl">
          {review.tourist_avatar ? (
            <Image src={review.tourist_avatar} alt={review.tourist_name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#0a2e1a] font-black text-white">
              {initials}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-black text-[#0a2e1a]">{review.tourist_name}</h4>
          <p className="text-xs font-bold tracking-tighter text-gray-400 uppercase">
            Verified Traveler
          </p>
          {review.treks?.title && (
            <p className="text-[10px] text-gray-500 mt-0.5">{review.treks.title}</p>
          )}
        </div>
      </div>
    </div>
  );
}
