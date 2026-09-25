"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ExperienceCard from "@/app/experiences/components/ExperienceCard";
import type { TrekItem } from "@/app/experiences/components/ExperiencesExplorer";

type Props = { currentTrekId: string; initialSimilar?: Partial<TrekItem>[] };

export default function TourSimilarExperiences({ currentTrekId, initialSimilar = [] }: Props) {
  const [similar, setSimilar] = useState<Partial<TrekItem>[]>(initialSimilar);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (initialSimilar.length > 0) return;
    fetch(`/api/treks/similar?exclude=${currentTrekId}&limit=4`).then((res) => res.json()).then(setSimilar).catch(() => setSimilar([]));
  }, [currentTrekId, initialSimilar]);
  const scrollByAmount = (direction: "left" | "right") => scrollRef.current?.scrollBy({ left: direction === "right" ? 300 : -300, behavior: "smooth" });
  if (similar.length === 0) return null;
  return <section className="py-10"><div className="mb-4 flex items-center justify-between gap-4"><h3 className="text-2xl font-black text-[#12355B] md:text-[28px]">Similar experiences</h3><div className="flex gap-2 lg:hidden"><button type="button" onClick={() => scrollByAmount("left")} aria-label="Scroll left" className="flex size-10 items-center justify-center rounded-full border border-[#12355B]"><ChevronLeft className="size-5" /></button><button type="button" onClick={() => scrollByAmount("right")} aria-label="Scroll right" className="flex size-10 items-center justify-center rounded-full border border-[#12355B]"><ChevronRight className="size-5" /></button></div></div><div ref={scrollRef} className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] lg:grid lg:grid-cols-4 lg:overflow-visible">{similar.map((trek, index) => { const normalized = { id: trek.id || `similar-${index}`, slug: trek.slug || "", title: trek.title || "Experience in Morocco", cover_image: trek.cover_image || "", rating: trek.rating || 4.8, review_count: trek.review_count || 0, previous_price: trek.previous_price || null, price_per_adult: trek.price_per_adult || 0, badge: trek.badge || null, award: trek.award || null, duration: trek.duration || `${2 + (index % 4)} days`, time_of_day: trek.time_of_day || "Flexible", live_guide_languages: trek.live_guide_languages || ["Spanish"], is_active: trek.is_active ?? true, categories: trek.categories || { name: "Circuit" } } as TrekItem; return <div key={normalized.id} className="w-[78vw] shrink-0 snap-start sm:w-[268px] lg:w-auto"><ExperienceCard trek={normalized} index={index} /></div>; })}</div></section>;
}
