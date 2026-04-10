"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import type { Category } from "@/app/actions/categories";
import { getCategorySlug } from "@/lib/category-slug";

const interests = [
  {
    title: "Mountain Peaks",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    desc: "Scale the heights of the High Atlas",
    slug: "outdoors",
  },
  {
    title: "Berber Tables",
    image:
      "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop",
    desc: "Authentic culinary journeys",
    slug: "food",
  },
  {
    title: "Village Life",
    image:
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200&auto=format&fit=crop",
    desc: "Uncover ancient traditions",
    slug: "culture",
  },
  {
    title: "Desert Sands",
    image:
      "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?q=80&w=1200&auto=format&fit=crop",
    desc: "Silent dunes and starry nights",
    slug: "outdoors",
  },
];

interface InterestsProps {
  initialCategories?: Category[];
}

export default function Interests({ initialCategories = [] }: InterestsProps) {
  const { elementRef, isVisible } = useScrollReveal(0.1);

  // Map dynamic categories to the component's format
  const dynamicInterests = initialCategories.map((cat) => ({
    title: cat.name,
    image:
      cat.photo ||
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    desc: cat.description || "Explore this category",
    slug: getCategorySlug(cat),
  }));

  // Use dynamic categories if they exist, otherwise fallback to static ones
  const displayedInterests = dynamicInterests.length > 0 ? dynamicInterests : interests;

  return (
    <section ref={elementRef as any} className={`mx-auto mt-16 w-full max-w-7xl px-6`}>
      <div className="mb-12">
        <h2 className="text-4xl leading-[0.9] font-black tracking-tighter text-[#0a2e1a] md:text-5xl">
          Explore by Interest
        </h2>
      </div>
      <div className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8">
        {displayedInterests.map((interest, index) => {
          return (
            <Link
              key={interest.title}
              href={`/category/${interest.slug}`}
              className={`group reveal relative h-[400px] min-w-[85%] flex-shrink-0 cursor-pointer snap-center overflow-hidden rounded-3xl shadow-lg transition-all duration-700 sm:min-w-[60%] md:min-w-[45%] lg:h-[480px] lg:min-w-[calc(25%-18px)] ${isVisible ? "reveal-visible" : ""}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Image
                src={interest.image}
                alt={`${interest.title} experiences in Ourika Valley, Morocco`}
                fill
                className="object-cover saturate-[0.8] transition-transform duration-1000 group-hover:scale-110 group-hover:saturate-100"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              
              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:scale-110 active:scale-95">
                <Heart className="h-5 w-5 text-gray-600 transition-colors hover:text-red-500" />
              </button>

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="mb-1 text-2xl leading-tight font-black text-white md:text-3xl">
                  {interest.title}
                </h3>
                <p className="text-sm font-medium text-white/80">{interest.desc}</p>
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
    </section>
  );
}
