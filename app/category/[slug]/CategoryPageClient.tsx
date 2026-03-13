"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ExperienceCard from "@/app/experiences/components/ExperienceCard";
import { experiencesData, ExperienceItem } from "@/lib/data/experiences";
import {
  Compass,
  Utensils,
  Landmark,
  Droplets,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const categories = {
  outdoors: {
    title: "Outdoors",
    fullName: "Outdoors & Adventure Activities",
    subtitle: "Explore the wild beauty of the Atlas Mountains and Ourika Valley.",
    icon: Compass,
    color: "text-emerald-700",
    check: (item: ExperienceItem) =>
      [
        "Adventure Tours",
        "Day Trips",
        "4WD Tours",
        "Air Tours",
        "Nature Walks",
        "Camel Rides",
      ].includes(item.category) ||
      item.title.toLowerCase().includes("hike") ||
      item.title.toLowerCase().includes("adventure"),
  },
  food: {
    title: "Food",
    fullName: "Food & Culinary Experiences",
    subtitle: "Taste the authentic flavors of Morocco with Berber cooking and local lunch.",
    icon: Utensils,
    color: "text-orange-700",
    check: (item: ExperienceItem) =>
      item.category === "Food Tours" ||
      item.title.toLowerCase().includes("lunch") ||
      item.title.toLowerCase().includes("cooking"),
  },
  culture: {
    title: "Culture",
    fullName: "Culture & Heritage Tours",
    subtitle: "Discover the hidden traditions and life in authentic Berber villages.",
    icon: Landmark,
    color: "text-amber-900",
    check: (item: ExperienceItem) =>
      item.category === "Bus Tours" ||
      item.category === "Private and Luxury" ||
      item.title.toLowerCase().includes("berber") ||
      item.title.toLowerCase().includes("village"),
  },
  water: {
    title: "Water",
    fullName: "Waterfalls & River Excursions",
    subtitle: "Refresh your soul at the famous Setti Fatma waterfalls and Ourika river.",
    icon: Droplets,
    color: "text-blue-700",
    check: (item: ExperienceItem) =>
      item.title.toLowerCase().includes("waterfall") || item.title.toLowerCase().includes("river"),
  },
} as const;

type CategoryFilters = {
  price: string;
  duration: string;
  language: string;
  timeOfDay: string;
};

const initialFilters: CategoryFilters = {
  price: "All",
  duration: "All",
  language: "All",
  timeOfDay: "All",
};

const filterOptions = {
  price: ["All", "Under $20", "$20-$50", "$50+"],
  duration: ["All", "Up to 3 hours", "3 to 6 hours", "6+ hours"],
  language: ["All", "English", "French", "Arabic"],
  timeOfDay: ["All", "Morning", "Afternoon", "Evening"],
};

export default function CategoryPageClient({ slug }: { slug: string }) {
  const category = categories[slug as keyof typeof categories];
  const { elementRef, isVisible } = useScrollReveal(0.05);

  const [activeFilters, setActiveFilters] = useState<CategoryFilters>(initialFilters);
  const [activeMenu, setActiveMenu] = useState<keyof CategoryFilters | null>(null);

  const filteredItems = useMemo(() => {
    if (!category) return [];
    return experiencesData.filter((item) => {
      // Category check
      if (!category.check(item)) return false;

      // Price filter
      if (activeFilters.price !== "All") {
        if (activeFilters.price === "Under $20" && item.price >= 20) return false;
        if (activeFilters.price === "$20-$50" && (item.price < 20 || item.price > 50)) return false;
        if (activeFilters.price === "$50+" && item.price <= 50) return false;
      }

      // Duration filter (simplified match)
      if (activeFilters.duration !== "All") {
        const hours = parseInt(item.duration);
        if (activeFilters.duration === "Up to 3 hours" && hours > 3) return false;
        if (activeFilters.duration === "3 to 6 hours" && (hours <= 3 || hours > 6)) return false;
        if (activeFilters.duration === "6+ hours" && hours <= 6) return false;
      }

      // Language filter
      if (activeFilters.language !== "All" && !item.languages.includes(activeFilters.language))
        return false;

      // Time of day filter
      if (activeFilters.timeOfDay !== "All" && item.timeOfDay !== activeFilters.timeOfDay)
        return false;

      return true;
    });
  }, [category, activeFilters]);

  if (!category) return null;

  const toggleFilter = (filterKey: keyof CategoryFilters, value: string) => {
    setActiveFilters((prev) => ({ ...prev, [filterKey]: value }));
    setActiveMenu(null);
  };

  const clearFilters = () => setActiveFilters(initialFilters);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#34e0a1] selection:text-black">
      <Navbar sticky={false} />

      {/* Header Info */}
      <div className="border-b border-gray-100 bg-white pt-6">
        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
            <Link href="/" className="transition-colors hover:text-black">
              Home
            </Link>
            <span className="text-gray-200">/</span>
            <span className="text-black">Marrakech-Safi</span>
            <span className="text-gray-200">/</span>
            <span className="text-black capitalize">{slug}</span>
          </nav>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="mb-2 text-3xl leading-tight font-black text-gray-900 md:text-5xl">
                {category.fullName}
              </h1>
              <p className="text-base font-medium text-gray-500">
                Showing {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "experience" : "experiences"} based on your interests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filter Bar - Sticky */}
      <div className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <button className="flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-bold transition-colors hover:bg-gray-50">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <div className="mx-2 hidden h-6 w-px bg-gray-200 md:block" />

            {/* Filter Buttons */}
            {(Object.keys(filterOptions) as Array<keyof CategoryFilters>).map((key) => (
              <div key={key} className="relative shrink-0">
                <button
                  onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                    activeFilters[key] !== "All"
                      ? "border-[#004f32] bg-[#f0f9f6] text-[#004f32]"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                  {activeFilters[key] !== "All" && (
                    <span className="text-xs">({activeFilters[key]})</span>
                  )}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      activeMenu === key ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {activeMenu === key && (
                  <>
                    <div className="fixed inset-0 z-0" onClick={() => setActiveMenu(null)} />
                    <div className="animate-in fade-in zoom-in-95 absolute top-full left-0 z-10 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl duration-200">
                      {filterOptions[key].map((option) => (
                        <button
                          key={option}
                          onClick={() => toggleFilter(key, option)}
                          className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-bold transition-colors ${
                            activeFilters[key] === option
                              ? "bg-[#f0f9f6] text-[#004f32]"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}

            {Object.values(activeFilters).some((v) => v !== "All") && (
              <button
                onClick={clearFilters}
                className="shrink-0 px-2 text-sm font-bold text-[#004f32] underline hover:no-underline"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="hidden items-center gap-4 text-sm font-bold text-gray-400 lg:flex">
            <span>Sort by:</span>
            <button className="flex items-center gap-1 text-black">
              Featured <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        {/* Results Grid */}
        <section ref={elementRef as any} className={`reveal ${isVisible ? "reveal-visible" : ""}`}>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {filteredItems.map((item, index) => (
                <ExperienceCard key={item.id} experience={item} index={index + 1} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                <SlidersHorizontal className="h-8 w-8 text-gray-300" />
              </div>
              <h2 className="mb-2 text-2xl font-black text-gray-900">No matching results</h2>
              <p className="mb-8 font-medium text-gray-500">
                Try adjusting your filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="rounded-full bg-black px-8 py-3 font-bold text-white transition-colors hover:bg-gray-800"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Info Box */}
        <div className="mt-20 rounded-[2.5rem] border border-[#d1ede1] bg-[#f0f9f6] p-8 md:p-12">
          <div className="flex flex-col items-start gap-8 md:flex-row">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#004f32]">
              <category.icon className="h-8 w-8 text-[#00ef9d]" />
            </div>
            <div>
              <h3 className="mb-3 text-2xl font-black text-[#004f32]">
                About {category.title} in Ourika
              </h3>
              <p className="max-w-4xl leading-[1.7] font-medium text-gray-700">
                {category.subtitle} Whether you're looking for an afternoon getaway or a full-day
                immersive journey, Ourika Travels offers the most authentic local perspectives. Our
                guides are experts in the region's history, culture, and hidden gems.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
