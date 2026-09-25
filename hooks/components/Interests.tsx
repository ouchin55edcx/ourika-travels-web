"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import type { Category } from "@/app/actions/categories";
import { getCategorySlug } from "@/lib/category-slug";

const interests = [
  { title: "Aire libre", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop", desc: "Escala las alturas del Alto Atlas", slug: "outdoors", count: 24 },
  { title: "Gastronomía", image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop", desc: "Auténticos viajes culinarios", slug: "food", count: 12 },
  { title: "Cultura", image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200&auto=format&fit=crop", desc: "Descubre tradiciones ancestrales", slug: "culture", count: 31 },
  { title: "Naturaleza", image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?q=80&w=1200&auto=format&fit=crop", desc: "Dunas silenciosas y noches estrelladas", slug: "nature", count: 18 },
];

interface InterestsProps { initialCategories?: Category[]; }

export default function Interests({ initialCategories = [] }: InterestsProps) {
  const { elementRef, isVisible } = useScrollReveal(0.1);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const displayedInterests = initialCategories.length > 0
    ? initialCategories.map((cat, index) => ({ title: cat.name, image: cat.photo || interests[index % interests.length].image, desc: cat.description || "Explora esta categoría", slug: getCategorySlug(cat), count: [24, 12, 31, 18][index % 4] }))
    : interests;

  return (
    <section id="interests-section" ref={elementRef as any} className={`relative mx-auto mt-10 w-full max-w-7xl bg-[#FAFAF7] px-6 py-20 before:absolute before:inset-x-0 before:top-0 before:h-10 before:-translate-y-full before:bg-gradient-to-b before:from-[#FAFAF7] before:to-[#FAFAF7] md:mt-12 md:py-24`}>
      <div className="mb-7"><h2 className="text-4xl leading-[0.9] font-black tracking-tighter text-[#12355B] md:text-5xl">Explora por interés</h2></div>
      <div className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [-webkit-overflow-scrolling:touch]">
        {displayedInterests.map((interest, index) => {
          const isFavorite = favorites[interest.slug];
          return <Link key={interest.title} href={`/category/${interest.slug}`} className={`group reveal relative h-[330px] min-w-[78%] flex-shrink-0 cursor-pointer snap-start overflow-hidden rounded-3xl border border-transparent shadow-lg transition-all duration-500 hover:border-white hover:shadow-xl sm:min-w-[54%] md:min-w-[42%] lg:h-[390px] lg:min-w-[calc(25%-12px)] ${isVisible ? "reveal-visible" : ""}`} style={{ transitionDelay: `${index * 120}ms` }}>
            <Image src={interest.image} alt={`${interest.title} — Marruecos`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" sizes="(max-width: 768px) 78vw, (max-width: 1200px) 42vw, 25vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12355B]/75 via-[#12355B]/10 to-transparent transition-colors duration-500 group-hover:from-[#12355B]/90" />
            <button type="button" aria-label={isFavorite ? `Quitar ${interest.title} de favoritos` : `Añadir ${interest.title} a favoritos`} aria-pressed={Boolean(isFavorite)} onClick={(event) => { event.preventDefault(); event.stopPropagation(); setFavorites((current) => ({ ...current, [interest.slug]: !current[interest.slug] })); }} className={`absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 ${isFavorite ? "animate-[favorite-pop_260ms_ease-out]" : ""}`}><Heart className={`h-5 w-5 transition-colors ${isFavorite ? "fill-[#F26B21] text-[#F26B21]" : "text-[#12355B]"}`} /></button>
            <div className="absolute right-0 bottom-0 left-0 p-5"><h3 className="mb-1 text-2xl leading-tight font-black text-white md:text-3xl">{interest.title}</h3><p className="text-sm font-medium text-white/85">{interest.desc}</p><p className="mt-1 text-xs font-bold text-white/75">{interest.count} experiencias</p></div>
          </Link>;
        })}
      </div>
      <style jsx>{` .hide-scrollbar::-webkit-scrollbar { display:none; } .hide-scrollbar { -ms-overflow-style:none; scrollbar-width:none; } @keyframes favorite-pop { 50% { transform: scale(1.2); } } `}</style>
    </section>
  );
}
