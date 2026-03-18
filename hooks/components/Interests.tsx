"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

import { Category } from "@/app/actions/categories";

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
    slug: cat.name.toLowerCase().replace(/\s+/g, "-"),
  }));

  // Use dynamic categories if they exist, otherwise fallback to static ones
  const displayedInterests = dynamicInterests.length > 0 ? dynamicInterests : interests;

  return (
    <section ref={elementRef as any} className={`mx-auto mt-16 w-full max-w-7xl px-6`}>
      <div className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-8">
        {displayedInterests.map((interest, index) => {
          return (
            <Link
              key={interest.title}
              href={`/category/${interest.slug}`}
              className={`group reveal relative h-[400px] min-w-[85%] flex-shrink-0 cursor-pointer snap-center overflow-hidden rounded-[3rem] shadow-2xl transition-all duration-700 sm:min-w-[60%] md:min-w-[45%] lg:h-[480px] lg:min-w-[calc(25%-18px)] ${isVisible ? "reveal-visible" : ""}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Image
                src={interest.image}
                alt={interest.title}
                fill
                className="object-cover saturate-[0.8] transition-transform duration-1000 group-hover:scale-110 group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004f32]/90 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="absolute right-10 bottom-10 left-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                <p className="mb-2 text-[10px] font-black tracking-widest text-[#00ef9d] uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore Category
                </p>
                <h3 className="mb-2 text-3xl leading-none font-black text-white md:text-4xl">
                  {interest.title}
                </h3>
                <p className="text-sm leading-tight font-medium text-white/70">{interest.desc}</p>
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
