"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const interests = [
  {
    title: "Mountain Peaks",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
    desc: "Scale the heights of the High Atlas",
    slug: "outdoors"
  },
  {
    title: "Berber Tables",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop",
    desc: "Authentic culinary journeys",
    slug: "food"
  },
  {
    title: "Village Life",
    image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200&auto=format&fit=crop",
    desc: "Uncover ancient traditions",
    slug: "culture"
  },
  {
    title: "Desert Sands",
    image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?q=80&w=1200&auto=format&fit=crop",
    desc: "Silent dunes and starry nights",
    slug: "outdoors"
  },
];

export default function Interests() {
  const { elementRef, isVisible } = useScrollReveal(0.1);

  return (
    <section
      ref={elementRef as any}
      className={`w-full max-w-7xl mx-auto px-6 mt-16`}
    >
      <div className={`mb-12 md:mb-16 reveal ${isVisible ? 'reveal-visible' : ''}`}>
        <p className="text-[#00ef9d] font-black uppercase tracking-[0.2em] text-xs mb-4">Explore by Interest</p>
        <h2 className="text-4xl md:text-4xl lg:text-6xl font-black leading-[0.9] text-[#004f32] tracking-tighter mb-6">
          Authentic Ourika Experiences Tailored for You
        </h2>
        <p className="text-lg font-medium text-gray-500 max-w-xl leading-relaxed">
          From the snow-capped High Atlas peaks to the heart of ancient Berber villages, immerse yourself in the natural beauty and rich culture of the Ourika Valley.
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 lg:pb-0 lg:grid lg:grid-cols-4 lg:gap-8 hide-scrollbar">
        {interests.map((interest, index) => {
          return (
            <Link
              key={interest.title}
              href={`/category/${interest.slug}`}
              className={`min-w-[85%] sm:min-w-[60%] md:min-w-[45%] lg:min-w-0 snap-center group relative h-[400px] lg:h-[480px] rounded-[3rem] overflow-hidden cursor-pointer shadow-2xl transition-all duration-700 reveal ${isVisible ? 'reveal-visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Image
                src={interest.image}
                alt={interest.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110 saturate-[0.8] group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#004f32]/90 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute bottom-10 left-10 right-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                <p className="text-[#00ef9d] text-[10px] font-black uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explore Category</p>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2 leading-none">
                  {interest.title}
                </h3>
                <p className="text-white/70 text-sm font-medium leading-tight">
                  {interest.desc}
                </p>
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
