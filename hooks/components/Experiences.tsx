"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronRight, ChevronLeft, Star } from "lucide-react";
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

  return (
    <section
      id="experiences-section"
      ref={elementRef as any}
      className={`reveal mx-auto w-full max-w-7xl px-6 py-16 md:py-24 xl:py-32 ${isVisible ? "reveal-visible" : ""}`}
    >
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="mb-3 text-[10px] font-black tracking-[0.2em] text-[#00ef9d] uppercase">
            Top Rated Ourika Activities
          </p>
          <h2 className="mb-4 text-4xl leading-[0.9] font-black tracking-tighter text-[#004f32] md:text-5xl">
            Unmissable Moments in the Atlas Mountains
          </h2>
          <p className="text-lg leading-relaxed font-medium text-gray-500">
            Hand-picked experiences designed to give you an authentic taste of Morocco.
          </p>
        </div>
        <div className="mb-2 hidden gap-3 lg:flex">
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white text-[#004f32] shadow-sm transition-all hover:border-[#00ef9d] hover:shadow-md">
            <ChevronLeft className="h-5 w-5 stroke-[2.5px]" />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white text-[#004f32] shadow-sm transition-all hover:border-[#00ef9d] hover:shadow-md">
            <ChevronRight className="h-5 w-5 stroke-[2.5px]" />
          </button>
        </div>
      </div>

      <div className="hide-scrollbar flex snap-x snap-mandatory scroll-pl-6 gap-6 overflow-x-auto pb-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16 lg:overflow-visible lg:px-0 lg:pb-0">
        {experiences.map((exp, index) => {
          const slug = exp.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          return (
            <Link
              key={exp.id}
              href={`/tour/${slug}`}
              className={`group reveal block min-w-[280px] transition-all duration-500 ${isVisible ? "reveal-visible" : ""}`}
              style={{ transitionDelay: `${(index % 4) * 100}ms` }}
            >
              <div className="flex h-full flex-col">
                <div className="relative mb-4 aspect-square overflow-hidden rounded-3xl shadow-lg sm:aspect-[4/3]">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover saturate-[0.8] transition-transform duration-1000 group-hover:scale-110 group-hover:saturate-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <button className="group/heart absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#004f32] shadow-lg backdrop-blur-md transition-transform hover:scale-110 active:scale-95">
                    <Heart className="h-5 w-5 transition-all group-hover/heart:fill-red-500 group-hover/heart:text-red-500" />
                  </button>
                </div>

                <div className="flex flex-1 flex-col space-y-2 px-1">
                  <h3 className="line-clamp-2 text-lg leading-tight font-bold text-[#1a1a1a]">
                    {exp.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#484848]">{exp.rating}</span>
                    <RatingStars rating={exp.rating} />
                    <span className="text-[14px] text-gray-500">
                      ({exp.reviews.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 border-t border-gray-50 pt-2">
                    <span className="text-sm font-bold text-gray-400">from</span>
                    <span className="text-2xl font-black text-[#004f32]">${exp.price}</span>
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
