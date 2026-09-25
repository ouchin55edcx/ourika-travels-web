"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Clock3, Heart, Languages, MapPin, Star, Users } from "lucide-react";
import WishlistButton from "@/app/components/WishlistButton";
import type { TrekItem } from "./ExperiencesExplorer";

const facts = ["Grupo pequeño", "Español", "Sale de Marrakech"];

export default function ExperienceCard({ trek, index, isWishlisted = false }: { trek: TrekItem; index: number; isWishlisted?: boolean }) {
  const discount = trek.previous_price ? Math.round((1 - trek.price_per_adult / trek.previous_price) * 100) : null;
  const category = Array.isArray(trek.categories) ? trek.categories[0]?.name : trek.categories?.name;
  const trust = index % 3 === 0 ? ["Cancelación gratuita", "Confirmación inmediata"] : index % 3 === 1 ? ["Confirmación inmediata"] : [];
  return (
    <Link href={`/tour/${trek.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#12355B]/10 bg-white shadow-[0_8px_24px_rgba(18,53,91,0.09)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(18,53,91,0.18)]">
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden">
        <Image src={trek.cover_image} alt={`${trek.title} — Marruecos`} fill className="object-cover transition-transform duration-200 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        {trek.badge && <span className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-black text-white ${trek.badge === "Traveler favorite" ? "bg-[#1E9E6A]" : "bg-[#F26B21]"}`}>{trek.badge}</span>}
        <div className="absolute top-3 right-3" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} onMouseDown={(e) => e.stopPropagation()}><WishlistButton trekId={trek.id} initialState={isWishlisted} iconOnly /></div>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-bold text-white"><Clock3 className="size-3.5" />{trek.duration || `${2 + (index % 4)} días`}</span>
        {discount && <span className="absolute right-3 bottom-3 rounded-full bg-[#F26B21] px-2.5 py-1 text-[11px] font-black text-white">-{discount}%</span>}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0E8FA3]">{category || "Circuito"} · Marruecos</p>
        <h3 className="line-clamp-2 min-h-11 text-[17px] leading-5 font-black text-[#12355B]">{trek.title}</h3>
        <div className="flex items-center gap-1 text-[11px] text-[#6B7280]"><span className="inline-flex items-center gap-1"><Users className="size-3.5" />{facts[0]}</span><span>·</span><span className="inline-flex items-center gap-1"><Languages className="size-3.5" />{(trek.live_guide_languages ?? [facts[1]])[0]}</span><span>·</span><span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />Marrakech</span></div>
        <div className="flex items-center gap-1.5"><strong className="text-sm font-black text-[#111827]">{trek.rating.toFixed(1)}</strong><div className="flex text-[#F26B21]">{[0,1,2,3,4].map((i) => <Star key={i} className="size-3.5 fill-current" />)}</div><span className="text-xs text-[#6B7280]">({trek.review_count.toLocaleString()})</span></div>
        {trust.length > 0 && <div className="flex flex-wrap gap-1.5">{trust.map((tag) => <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#EAF8F1] px-2 py-1 text-[10px] font-bold text-[#1E9E6A]"><Check className="size-3" />{tag}</span>)}</div>}
        <div className="mt-auto border-t border-[#E5E7EB] pt-3"><div className="flex items-end justify-between gap-2"><div><p className="text-[11px] text-[#6B7280]">desde</p>{trek.previous_price && <p className="text-xs text-[#9CA3AF] line-through">€{trek.previous_price.toFixed(2)}</p>}<p className={`text-xl font-black ${discount ? "text-[#F26B21]" : "text-[#12355B]"}`}>€{trek.price_per_adult.toFixed(2)}</p></div><span className="pb-1 text-right text-[10px] text-[#6B7280]">{index % 4 === 0 ? "Solo 3 plazas" : "por persona"}</span></div></div>
      </div>
    </Link>
  );
}
