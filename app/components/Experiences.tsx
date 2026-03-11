"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronRight, ChevronLeft } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const experiences = [
  {
    id: 1,
    title: "Day Trip To Ourika Valley from Marrakech",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 1086,
    price: 31,
  },
  {
    id: 2,
    title: "Setti Fatma Waterfalls Guided Hike",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 352,
    price: 16,
  },
  {
    id: 3,
    title: "Traditional Berber Cooking Class & Lunch",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
    rating: 4.8,
    reviews: 64,
    price: 45,
  },
  {
    id: 4,
    title: "Private Ourika Valley Tour with Luxury Car",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 23,
    price: 148,
  },
  {
    id: 5,
    title: "Quad Bike Adventure in Atlas Mountains",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    rating: 4.6,
    reviews: 120,
    price: 55,
  },
  {
    id: 6,
    title: "Sunrise Hot Air Balloon over Ourika",
    image:
      "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=800&auto=format&fit=crop",
    rating: 4.9,
    reviews: 89,
    price: 199,
  },
  {
    id: 7,
    title: "Botanical Garden Bio-Aromatique Visit",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=800&auto=format&fit=crop",
    rating: 4.7,
    reviews: 45,
    price: 12,
  },
  {
    id: 8,
    title: "Sunset Camel Ride in the Heart of Ourika",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
    rating: 4.5,
    reviews: 210,
    price: 25,
  },
];

const RatingBubbles = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`h-[13px] w-[13px] rounded-full border border-[#00aa6c] ${i < Math.floor(rating) ? "bg-[#00aa6c]" : "bg-white"
            } ${i === Math.floor(rating) && rating % 1 !== 0 ? "relative overflow-hidden" : ""}`}
        >
          {/* Partial fill logic for simple bubble representation */}
          {i === Math.floor(rating) && rating % 1 !== 0 && (
            <div
              className="absolute inset-0 bg-[#00aa6c]"
              style={{ width: `${(rating % 1) * 100}%` }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default function Experiences() {
  const { elementRef, isVisible } = useScrollReveal(0.05);

  return (
    <section
      id="experiences-section"
      ref={elementRef as any}
      className={`mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 md:py-16 reveal ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="mb-1 text-2xl font-black leading-tight text-black md:text-[28px]">
            Unforgettable travel experiences in Ourika
          </h2>
          <p className="text-gray-600 text-sm md:text-[15px] font-medium opacity-80">
            Can’t-miss picks for your next adventure
          </p>
        </div>
        <div className="hidden lg:flex gap-2 mb-1">
          <button className="p-2.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-4 pb-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10 lg:overflow-visible lg:px-0 lg:pb-0">
        {experiences.map((exp, index) => {
          const slug = exp.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          return (
            <Link
              key={exp.id}
              href={`/tour/${slug}`}
              className={`block min-w-[256px] max-w-[256px] shrink-0 snap-start sm:min-w-[268px] sm:max-w-[268px] lg:min-w-0 lg:max-w-none reveal ${isVisible ? 'reveal-visible' : ''}`}
              style={{ transitionDelay: `${(index % 4) * 100}ms` }}
            >
              <div className="group h-full cursor-pointer">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 268px, 25vw"
                  />
                  <button className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white text-black shadow-sm transition-colors group/heart">
                    <Heart className="w-5 h-5 group-hover/heart:fill-red-500 group-hover/heart:text-red-500 transition-all" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base md:text-[17px] font-bold text-[#2c2c2c] leading-snug group-hover:underline line-clamp-2">
                    {exp.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-bold text-[#2c2c2c]">
                      {exp.rating}
                    </span>
                    <RatingBubbles rating={exp.rating} />
                    <span className="text-xs md:text-sm text-gray-500 font-medium">
                      ({exp.reviews.toLocaleString()})
                    </span>
                  </div>

                  <p className="text-sm md:text-base font-bold text-black pt-1">
                    from ${exp.price} per adult
                  </p>
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
      <div className="mt-8 flex justify-center">
        <Link
          href="/experiences"
          className="w-full rounded-full bg-black px-8 py-4 text-center text-sm font-bold text-white transition-all hover:bg-[#1f1f1f] active:scale-95 md:w-auto lg:text-[15px]"
        >
          See all experiences
        </Link>
      </div>
    </section>
  );
}
