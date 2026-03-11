"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Languages,
  MapPin,
  Star,
  Trash2,
} from "lucide-react";
import type { ExperienceItem } from "@/app/experiences/components/experiencesData";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function WishlistCard({
  experience,
  onRemove,
}: {
  experience: ExperienceItem;
  onRemove: (id: number) => void;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[20px] border border-[#e2e0d8] bg-white shadow-[0_10px_30px_rgba(17,24,39,0.08)] transition hover:-translate-y-0.5">
      <div className="flex flex-col items-stretch md:flex-row">
        <div className="relative w-full md:w-[280px] md:shrink-0">
          <div className="relative h-48 md:h-full">
            <Image
              src={experience.image}
              alt={experience.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 280px"
            />
          </div>
          {experience.award ? (
            <div className="absolute left-3 top-3 rounded-full bg-[#f2ef31] px-3 py-1 text-[11px] font-extrabold text-[#111827] shadow">
              Award {experience.award}
            </div>
          ) : null}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
            {experience.badges?.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#1f2937] shadow"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8b8f86]">
              <span>{experience.category}</span>
              <span className="h-1 w-1 rounded-full bg-[#c7cbbd]" />
              <span>{experience.timeOfDay}</span>
            </div>
            <h3 className="text-[20px] font-black leading-snug text-[#14231a] md:text-[22px]">
              {experience.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-[13px]">
              <div className="flex items-center gap-1 text-[#0f5132]">
                <Star className="h-4 w-4 fill-[#0f5132]" />
                <span className="font-semibold">
                  {experience.rating.toFixed(1)}
                </span>
                <span className="text-[#6b7280]">
                  ({experience.reviews.toLocaleString()})
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#6b7280]">
                <CalendarDays className="h-4 w-4 text-[#0f5132]" />
                <span>{experience.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6b7280]">
                <Languages className="h-4 w-4 text-[#0f5132]" />
                <span>{experience.languages.slice(0, 2).join(", ")}</span>
              </div>
              <div className="flex items-center gap-2 text-[#6b7280]">
                <MapPin className="h-4 w-4 text-[#0f5132]" />
                <span>{experience.timeOfDay}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-dashed border-[#e3e5db] pt-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#9aa091]">
                Total per person
              </p>
              <p className="text-[22px] font-black text-[#0f2a1a]">
                {experience.previousPrice ? (
                  <span className="mr-2 text-[14px] font-semibold text-[#9ca3af] line-through">
                    ${experience.previousPrice}
                  </span>
                ) : null}
                ${experience.price}
              </p>
              <div className="mt-1 flex items-center gap-2 text-[12px] text-[#5f6368]">
                <CheckCircle2 className="h-4 w-4 text-[#00aa6c]" />
                <span>Free cancellation up to 24 hours</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => onRemove(experience.id)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d4d8cb] px-4 py-2 text-[12px] font-semibold text-[#3f4a3c] transition hover:border-[#a9b3a2] hover:text-[#1f2937]"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
              <Link
                href="/reservation"
                className="inline-flex items-center justify-center rounded-full bg-[#00aa6c] px-5 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_24px_rgba(0,170,108,0.25)] transition hover:translate-y-[-1px] hover:bg-[#018856]"
              >
                Complete booking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
