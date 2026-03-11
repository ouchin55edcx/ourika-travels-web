"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import ExperienceCard from "@/app/experiences/components/ExperienceCard";
import {
  experiencesData,
  ExperienceItem,
} from "@/app/experiences/components/experiencesData";
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
    subtitle:
      "Explore the wild beauty of the Atlas Mountains and Ourika Valley.",
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
    subtitle:
      "Taste the authentic flavors of Morocco with Berber cooking and local lunch.",
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
    subtitle:
      "Discover the hidden traditions and life in authentic Berber villages.",
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
    subtitle:
      "Refresh your soul at the famous Setti Fatma waterfalls and Ourika river.",
    icon: Droplets,
    color: "text-blue-700",
    check: (item: ExperienceItem) =>
      item.title.toLowerCase().includes("waterfall") ||
      item.title.toLowerCase().includes("river"),
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

  const [activeFilters, setActiveFilters] =
    useState<CategoryFilters>(initialFilters);
  const [activeMenu, setActiveMenu] = useState<keyof CategoryFilters | null>(
    null,
  );

  const filteredItems = useMemo(() => {
    if (!category) return [];
    return experiencesData.filter((item) => {
      // Category check
      if (!category.check(item)) return false;

      // Price filter
      if (activeFilters.price !== "All") {
        if (activeFilters.price === "Under $20" && item.price >= 20)
          return false;
        if (
          activeFilters.price === "$20-$50" &&
          (item.price < 20 || item.price > 50)
        )
          return false;
        if (activeFilters.price === "$50+" && item.price <= 50) return false;
      }

      // Duration filter (simplified match)
      if (activeFilters.duration !== "All") {
        const hours = parseInt(item.duration);
        if (activeFilters.duration === "Up to 3 hours" && hours > 3)
          return false;
        if (
          activeFilters.duration === "3 to 6 hours" &&
          (hours <= 3 || hours > 6)
        )
          return false;
        if (activeFilters.duration === "6+ hours" && hours <= 6) return false;
      }

      // Language filter
      if (
        activeFilters.language !== "All" &&
        !item.languages.includes(activeFilters.language)
      )
        return false;

      // Time of day filter
      if (
        activeFilters.timeOfDay !== "All" &&
        item.timeOfDay !== activeFilters.timeOfDay
      )
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
      <div className="bg-white pt-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <span className="text-gray-200">/</span>
            <span className="text-black">Marrakech-Safi</span>
            <span className="text-gray-200">/</span>
            <span className="text-black capitalize">{slug}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-2">
                {category.fullName}
              </h1>
              <p className="text-base text-gray-500 font-medium">
                Showing {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "experience" : "experiences"}{" "}
                based on your interests
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Filter Bar - Sticky */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-bold bg-white hover:bg-gray-50 transition-colors shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />

            {/* Filter Buttons */}
            {(Object.keys(filterOptions) as Array<keyof CategoryFilters>).map(
              (key) => (
                <div key={key} className="relative shrink-0">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === key ? null : key)
                    }
                    className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-bold transition-all ${
                      activeFilters[key] !== "All"
                        ? "border-[#004f32] bg-[#f0f9f6] text-[#004f32]"
                        : "border-gray-200 bg-white hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {activeFilters[key] !== "All" && (
                      <span className="text-xs">({activeFilters[key]})</span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        activeMenu === key ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === key && (
                    <>
                      <div
                        className="fixed inset-0 z-0"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                        {filterOptions[key].map((option) => (
                          <button
                            key={option}
                            onClick={() => toggleFilter(key, option)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                              activeFilters[key] === option
                                ? "bg-[#f0f9f6] text-[#004f32]"
                                : "hover:bg-gray-50 text-gray-700"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ),
            )}

            {Object.values(activeFilters).some((v) => v !== "All") && (
              <button
                onClick={clearFilters}
                className="text-sm font-bold text-[#004f32] underline hover:no-underline px-2 shrink-0"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-4 text-sm font-bold text-gray-400">
            <span>Sort by:</span>
            <button className="text-black flex items-center gap-1">
              Featured <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Results Grid */}
        <section
          ref={elementRef as any}
          className={`reveal ${isVisible ? "reveal-visible" : ""}`}
        >
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {filteredItems.map((item, index) => (
                <ExperienceCard
                  key={item.id}
                  experience={item}
                  index={index + 1}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <SlidersHorizontal className="w-8 h-8 text-gray-300" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                No matching results
              </h2>
              <p className="text-gray-500 font-medium mb-8">
                Try adjusting your filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
              >
                Reset filters
              </button>
            </div>
          )}
        </section>

        {/* Info Box */}
        <div className="mt-20 p-8 md:p-12 bg-[#f0f9f6] rounded-[2.5rem] border border-[#d1ede1]">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 rounded-2xl bg-[#004f32] flex items-center justify-center shrink-0">
              <category.icon className="w-8 h-8 text-[#00ef9d]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#004f32] mb-3">
                About {category.title} in Ourika
              </h3>
              <p className="text-gray-700 font-medium leading-[1.7] max-w-4xl">
                {category.subtitle} Whether you're looking for an afternoon
                getaway or a full-day immersive journey, Ourika Travels offers
                the most authentic local perspectives. Our guides are experts in
                the region's history, culture, and hidden gems.
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
