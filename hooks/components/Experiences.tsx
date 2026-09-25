"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Star, Heart, Clock3, Languages, MapPin, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRef } from "react";

type ExperienceItem = {
  id: string;
  slug: string;
  title: string;
  cover_image: string;
  badge?: string | null;
  rating: number;
  review_count: number;
  previous_price?: number | null;
  price_per_adult: number;
};

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
              isFull || isHalf ? "fill-[#F26B21] text-[#F26B21]" : "text-[#F6E7D0]"
            }`}
          />
        );
      })}
    </div>
  );
};

export default function Experiences({
  initialExperiences = [],
}: {
  initialExperiences?: ExperienceItem[];
}) {
  const { elementRef, isVisible } = useScrollReveal(0.05);
  const scrollRef = useRef<HTMLDivElement>(null);
  const experiences = initialExperiences;

  const scrollByAmount = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = Math.min(container.clientWidth * 0.9, 420);
    container.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="experiences-section"
      ref={elementRef as any}
      className={`reveal relative mx-auto w-full max-w-7xl bg-[#F6E7D0] px-6 py-20 md:py-24 xl:py-32 before:absolute before:inset-x-0 before:top-0 before:h-14 before:-translate-y-full before:bg-gradient-to-b before:from-transparent before:to-[#F6E7D0] ${isVisible ? "reveal-visible" : ""}`}
    >
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <h2 className="mb-4 text-4xl leading-[0.9] font-black tracking-tighter text-[#12355B] md:text-5xl">
            Experiencias más reservadas en Marruecos
          </h2>
        </div>
        <div className="mb-2 hidden gap-3 lg:flex">
          <button
            onClick={() => scrollByAmount("left")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white text-[#12355B] shadow-sm transition-all hover:border-[#00ef9d] hover:shadow-md"
          >
            <ChevronLeft className="h-5 w-5 stroke-[2.5px]" />
          </button>
          <button
            onClick={() => scrollByAmount("right")}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-100 bg-white text-[#12355B] shadow-sm transition-all hover:border-[#00ef9d] hover:shadow-md"
          >
            <ChevronRight className="h-5 w-5 stroke-[2.5px]" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="hide-scrollbar flex snap-x snap-mandatory scroll-pl-6 gap-4 overflow-x-auto pb-10 [-webkit-overflow-scrolling:touch] lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16 lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {experiences.map((exp, index) => {
          return (
            <Link key={exp.id} href={`/tour/${exp.slug}`} className={`group reveal block w-[82vw] shrink-0 snap-start transition-all duration-500 active:scale-[0.98] sm:w-[62vw] lg:w-auto lg:shrink lg:snap-none ${isVisible ? "reveal-visible" : ""}`} style={{ transitionDelay: `${(index % 4) * 100}ms` }}>
              <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(18,53,91,0.16)] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_16px_40px_rgba(18,53,91,0.22)]">
                <div className="relative aspect-square shrink-0 overflow-hidden bg-gray-100 sm:aspect-[4/3]"><Image src={exp.cover_image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop"} alt={`${exp.title} — Marruecos`} fill className="object-cover transition-transform duration-200 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />{exp.badge && <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-black text-white ${exp.badge === "Traveler favorite" ? "bg-[#1E9E6A]" : "bg-[#F26B21]"}`}>{exp.badge}</span>}<button type="button" aria-label="Añadir a favoritos" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"><Heart className="size-4 text-[#12355B]" /></button><span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-bold text-white"><Clock3 className="size-3.5" />{2 + (index % 4)} días</span>{index % 3 === 1 && <span className="absolute right-3 bottom-3 rounded-full bg-[#F26B21] px-2.5 py-1 text-[11px] font-black text-white">-15%</span>}</div>
                <div className="flex flex-1 flex-col gap-2.5 p-4"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0E8FA3]">CIRCUITO · DESIERTO</p><h3 className="line-clamp-2 min-h-11 text-[17px] leading-5 font-black text-[#12355B]">{exp.title}</h3><div className="flex items-center gap-1 text-[11px] text-[#6B7280]"><span className="inline-flex items-center gap-1"><Languages className="size-3.5" />Español</span><span>·</span><span className="inline-flex items-center gap-1"><Users className="size-3.5" />Grupo pequeño</span><span>·</span><span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />Marrakech</span></div><div className="flex items-center gap-1.5"><strong className="text-sm font-black text-[#111827]">{exp.rating.toFixed(1)}</strong><RatingStars rating={exp.rating} /><span className="text-xs text-[#6B7280]">({exp.review_count.toLocaleString()})</span></div>{index % 3 !== 2 && <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#EAF8F1] px-2 py-1 text-[10px] font-bold text-[#1E9E6A]">✓ {index % 3 === 0 ? "Cancelación gratuita" : "Confirmación inmediata"}</span>}<div className="mt-auto border-t border-[#E5E7EB] pt-3"><div className="flex items-end justify-between"><div><p className="text-[11px] text-[#6B7280]">desde</p>{index % 3 === 1 && <p className="text-xs text-[#9CA3AF] line-through">€{(exp.price_per_adult * 1.15).toFixed(2)}</p>}<p className={`text-xl font-black ${index % 3 === 1 ? "text-[#F26B21]" : "text-[#12355B]"}`}>€{exp.price_per_adult.toFixed(2)}</p></div><span className="pb-1 text-right text-[10px] text-[#6B7280]">{index % 4 === 0 ? "Solo 3 plazas" : "por persona"}</span></div></div></div>
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
          className="group inline-flex items-center gap-3 rounded-full bg-[#F26B21] px-12 py-5 text-lg font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-[#d95b18]"
        >
          Ver todas las experiencias
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
