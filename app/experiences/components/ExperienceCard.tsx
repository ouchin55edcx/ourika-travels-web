"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Heart, Languages, MapPin } from "lucide-react";
import type { ExperienceItem } from "./experiencesData";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ExperienceCard({
  experience,
  index,
}: {
  experience: ExperienceItem;
  index: number;
}) {
  return (
    <Link
      href={`/tour/${slugify(experience.title)}`}
      className="group block rounded-[14px] border border-[#d8d8d8] bg-white p-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="relative mb-2 overflow-hidden rounded-[12px]">
        <div className="relative aspect-[4/3]">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <button className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#123d2f] shadow-sm">
          <Heart className="h-4 w-4" />
        </button>
        {experience.award ? (
          <div className="absolute bottom-2 left-2 rounded-[8px] bg-[#f2ef31] px-2 py-1 text-[10px] font-extrabold leading-none text-[#111827]">
            {experience.award}
          </div>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-extrabold text-[#4b5563]">{index}.</p>
        <h3 className="line-clamp-3 text-[15px] font-extrabold leading-6 text-[#12311f]">
          {experience.title}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
          <span className="font-bold text-[#12311f]">
            {experience.rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((starIndex) => (
              <span
                key={starIndex}
                className={`h-2.5 w-2.5 rounded-full ${
                  starIndex < Math.round(experience.rating)
                    ? "bg-[#00aa6c]"
                    : "border border-[#00aa6c] bg-white"
                }`}
              />
            ))}
          </div>
          <span className="text-[#6b7280]">
            ({experience.reviews.toLocaleString()})
          </span>
        </div>

        <p className="text-[12px] text-[#6b7280]">{experience.category}</p>

        <div className="space-y-1 text-[11px] text-[#5f6368]">
          <div className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-[#00aa6c]" />
            <span>{experience.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5 text-[#00aa6c]" />
            <span>{experience.languages.slice(0, 2).join(", ")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#00aa6c]" />
            <span>{experience.timeOfDay}</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 pt-1">
          <p className="text-[15px] font-extrabold text-[#12311f]">
            from{" "}
            {experience.previousPrice ? (
              <span className="mr-1 text-[#9ca3af] line-through">
                ${experience.previousPrice}
              </span>
            ) : null}
            ${experience.price}
          </p>
          <span className="inline-flex rounded-full bg-[#00e05a] px-3 py-1.5 text-[11px] font-bold text-black">
            Reserve
          </span>
        </div>
      </div>
    </Link>
  );
}
