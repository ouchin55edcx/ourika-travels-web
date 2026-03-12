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
            className={`h-[14px] w-[14px] ${isFull || isHalf
              ? "fill-[#00aa6c] text-[#00aa6c]"
              : "text-gray-200"
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
      className={`mx-auto w-full max-w-7xl px-6 py-16 md:py-24 xl:py-32 reveal ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <p className="text-[#00ef9d] font-black uppercase tracking-[0.2em] text-[10px] mb-3">Top Rated Ourika Activities</p>
          <h2 className="text-4xl md:text-5xl font-black leading-[0.9] text-[#004f32] tracking-tighter mb-4">
            Unmissable Moments in the Atlas Mountains
          </h2>
          <p className="text-gray-500 text-lg font-medium leading-relaxed">
            Hand-picked experiences designed to give you an authentic taste of Morocco.
          </p>
        </div>
        <div className="hidden lg:flex gap-3 mb-2">
          <button className="h-12 w-12 flex items-center justify-center border border-gray-100 rounded-full bg-white shadow-sm hover:shadow-md hover:border-[#00ef9d] transition-all text-[#004f32]">
            <ChevronLeft className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <button className="h-12 w-12 flex items-center justify-center border border-gray-100 rounded-full bg-white shadow-sm hover:shadow-md hover:border-[#00ef9d] transition-all text-[#004f32]">
            <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
          </button>
        </div>
      </div>

      <div className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-pl-6 pb-10 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16 lg:overflow-visible lg:px-0 lg:pb-0">
        {experiences.map((exp, index) => {
          const slug = exp.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
          return (
            <Link
              key={exp.id}
              href={`/tour/${slug}`}
              className={`block min-w-[280px] group transition-all duration-500 reveal ${isVisible ? 'reveal-visible' : ''}`}
              style={{ transitionDelay: `${(index % 4) * 100}ms` }}
            >
              <div className="h-full flex flex-col">
                <div className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden mb-4 shadow-lg">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 saturate-[0.8] group-hover:saturate-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <button className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-[#004f32] shadow-lg transition-transform hover:scale-110 active:scale-95 group/heart">
                    <Heart className="w-5 h-5 group-hover/heart:fill-red-500 group-hover/heart:text-red-500 transition-all" />
                  </button>
                </div>

                <div className="space-y-2 px-1 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[#1a1a1a] leading-tight line-clamp-2">
                    {exp.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#484848]">{exp.rating}</span>
                    <RatingStars rating={exp.rating} />
                    <span className="text-[14px] text-gray-500">
                      ({exp.reviews.toLocaleString()})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2 border-t border-gray-50">
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
          className="group inline-flex items-center gap-3 bg-[#004f32] text-white px-12 py-5 rounded-full font-black text-lg transition-all hover:scale-105 hover:bg-[#003a25] shadow-xl"
        >
          See all experiences
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
