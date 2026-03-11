"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const interests = [
  { title: "Outdoors", image: "/interests/outdoors.png" },
  { title: "Food", image: "/interests/food.png" },
  { title: "Culture", image: "/interests/culture.png" },
  { title: "Water", image: "/interests/water.png" },
];

export default function Interests() {
  const { elementRef, isVisible } = useScrollReveal(0.1);

  return (
    <section
      ref={elementRef as any}
      className={`w-full max-w-7xl mx-auto px-4 py-10 sm:px-6 md:py-16 reveal ${isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="mb-8 text-left md:mb-10">
        <h2 className="mb-1 text-2xl font-black leading-tight text-black md:text-[28px]">
          Find things to do by interest
        </h2>
        <p className="text-sm font-medium text-gray-600 opacity-80 md:text-[15px]">
          Whatever you&apos;re into, we&apos;ve got it
        </p>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 lg:pb-0 lg:grid lg:grid-cols-4 lg:gap-6 hide-scrollbar">
        {interests.map((interest, index) => {
          const slug = interest.title.toLowerCase();
          return (
            <Link
              key={interest.title}
              href={`/category/${slug}`}
              className={`min-w-[85%] md:min-w-[45%] lg:min-w-0 snap-center group relative h-[400px] md:h-[450px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 reveal ${isVisible ? 'reveal-visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Image
                src={interest.image}
                alt={interest.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                  {interest.title}
                </h3>
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
