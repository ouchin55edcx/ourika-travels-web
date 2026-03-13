"use client";

import { CalendarDays, ChevronDown, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import ExperienceCard from "./ExperienceCard";
import { experiencesData, filterGroups } from "@/lib/data/experiences";
import MoreToExplore from "./MoreToExplore";

type Filters = {
  awards: string;
  languages: string;
  timeOfDay: string;
  price: string;
};

const initialFilters: Filters = {
  awards: "All",
  languages: "All",
  timeOfDay: "All",
  price: "All",
};

const PAGE_SIZE = 8;

function matchesPrice(price: number, filter: string) {
  if (filter === "All") return true;
  if (filter === "Under $20") return price < 20;
  if (filter === "$20-$40") return price >= 20 && price <= 40;
  if (filter === "$40+") return price > 40;
  return true;
}

function FilterButton({
  label,
  value,
  isActive,
  onClick,
  icon,
}: {
  label: string;
  value?: string;
  isActive?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-medium transition sm:text-[13px] ${
        isActive
          ? "border-[#123d2f] bg-[#123d2f] text-white"
          : "border-[#8ba18d] bg-white text-[#12311f] hover:bg-[#f6f8f7]"
      }`}
    >
      {icon}
      <span>{label}</span>
      {value ? (
        <>
          <span className={isActive ? "text-white/80" : "text-[#6b7280]"}>·</span>
          <span>{value}</span>
        </>
      ) : null}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}

export default function ExperiencesExplorer() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filteredExperiences = useMemo(() => {
    return experiencesData.filter((experience) => {
      const awardMatch = filters.awards === "All" || experience.badges.includes(filters.awards);
      const languageMatch =
        filters.languages === "All" || experience.languages.includes(filters.languages);
      const timeMatch = filters.timeOfDay === "All" || experience.timeOfDay === filters.timeOfDay;
      const priceMatch = matchesPrice(experience.price, filters.price);

      return awardMatch && languageMatch && timeMatch && priceMatch;
    });
  }, [filters]);

  const visibleExperiences = filteredExperiences.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredExperiences.length;

  const cycleFilter = (key: keyof Filters, values: readonly string[]) => {
    setFilters((current) => {
      const currentIndex = values.indexOf(current[key]);
      const nextIndex = (currentIndex + 1) % values.length;
      return { ...current, [key]: values[nextIndex] };
    });
    setVisibleCount(PAGE_SIZE);
  };

  const filtersBar = (
    <div className="chip-scroll -mx-4 flex items-center gap-2 overflow-x-auto px-4 pt-1 pb-1 [-webkit-overflow-scrolling:touch] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <button
        type="button"
        className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-full border border-[#8ba18d] bg-white px-3 py-2 text-[12px] font-medium text-[#12311f] transition hover:bg-[#f6f8f7] sm:text-[13px]"
      >
        <CalendarDays className="h-3.5 w-3.5" />
        <span>Select dates</span>
      </button>
      <FilterButton
        label="Awards"
        value={filters.awards}
        isActive={filters.awards !== "All"}
        onClick={() => cycleFilter("awards", filterGroups.awards)}
      />
      <FilterButton
        label="Languages"
        value={filters.languages}
        isActive={filters.languages !== "All"}
        onClick={() => cycleFilter("languages", filterGroups.languages)}
      />
      <FilterButton
        label="Time of Day"
        value={filters.timeOfDay}
        isActive={filters.timeOfDay !== "All"}
        onClick={() => cycleFilter("timeOfDay", filterGroups.timeOfDay)}
      />
      <FilterButton
        label="Price"
        value={filters.price}
        isActive={filters.price !== "All"}
        onClick={() => cycleFilter("price", filterGroups.price)}
      />
      <button
        type="button"
        onClick={() => {
          setFilters(initialFilters);
          setVisibleCount(PAGE_SIZE);
        }}
        className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#8ba18d] bg-white px-3 py-2 text-[12px] font-medium text-[#12311f] transition hover:bg-[#f6f8f7] sm:text-[13px]"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        <span>All filters</span>
      </button>
    </div>
  );

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-1">
          <p className="text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
            Things to do in Marrakech-Safi
          </p>
          <p className="text-sm font-medium text-[#6b7280]">8,411 results</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="sticky top-0 z-40 -mx-4 border-y border-[#e5e7eb] bg-white/95 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 sm:py-3">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">{filtersBar}</div>
              <p className="hidden shrink-0 text-[12px] font-medium text-[#6b7280] sm:block">
                Sort: <span className="font-semibold text-[#12311f]">Featured</span>
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleExperiences.map((experience, index) => (
              <ExperienceCard key={experience.id} experience={experience} index={index + 1} />
            ))}
          </div>

          <div className="flex justify-center pt-2">
            {canShowMore ? (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="min-h-11 rounded-full bg-black px-8 py-3 text-[15px] font-bold text-white transition hover:bg-[#1f1f1f]"
              >
                Show more experiences
              </button>
            ) : (
              <p className="text-sm font-medium text-[#6b7280]">
                You&apos;ve reached the end of the list.
              </p>
            )}
          </div>

          <div className="pt-10">
            <div className="mb-8 h-px w-full bg-[#e5e7eb]" />
            <MoreToExplore />
          </div>
        </div>
      </section>

      <style jsx>{`
        .chip-scroll::-webkit-scrollbar {
          display: none;
        }
        .chip-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
