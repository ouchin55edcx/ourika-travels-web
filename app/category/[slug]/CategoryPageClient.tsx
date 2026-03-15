'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import ExperienceCard from '@/app/experiences/components/ExperienceCard';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import type { TrekItem } from '@/app/experiences/components/ExperiencesExplorer';
import type { Category } from '@/app/actions/categories';

type Props = {
  slug: string;
  category: Category;
  treks: TrekItem[];
};

type Filters = { price: string; duration: string; language: string; timeOfDay: string };

const initialFilters: Filters = { price: 'All', duration: 'All', language: 'All', timeOfDay: 'All' };

const filterOptions = {
  price:     ['All', 'Under $20', '$20–$50', '$50+'],
  duration:  ['All', 'Up to 3h', '3–6h', '6h+'],
  language:  ['All', 'English', 'French', 'Arabic'],
  timeOfDay: ['All', 'Morning', 'Afternoon', 'Evening', 'Flexible'],
};

function matchesPrice(price: number, f: string) {
  if (f === 'All') return true;
  if (f === 'Under $20') return price < 20;
  if (f === '$20–$50')   return price >= 20 && price <= 50;
  if (f === '$50+')      return price > 50;
  return true;
}

function matchesDuration(duration: string, f: string) {
  if (f === 'All') return true;
  const h = parseInt(duration) || 0;
  if (f === 'Up to 3h') return h <= 3;
  if (f === '3–6h')     return h > 3 && h <= 6;
  if (f === '6h+')      return h > 6;
  return true;
}

export default function CategoryPageClient({ slug, category, treks }: Props) {
  const { elementRef, isVisible } = useScrollReveal(0.05);
  const [filters,    setFilters]    = useState<Filters>(initialFilters);
  const [activeMenu, setActiveMenu] = useState<keyof Filters | null>(null);

  const filteredTreks = useMemo(() => {
    return treks.filter(trek => {
      if (!matchesPrice(trek.price_per_adult, filters.price)) return false;
      if (!matchesDuration(trek.duration, filters.duration)) return false;
      if (filters.language !== 'All' &&
          !trek.live_guide_languages?.includes(filters.language)) return false;
      if (filters.timeOfDay !== 'All' &&
          trek.time_of_day !== filters.timeOfDay) return false;
      return true;
    });
  }, [treks, filters]);

  const hasActiveFilters = Object.values(filters).some(v => v !== 'All');
  const clearFilters = () => { setFilters(initialFilters); setActiveMenu(null); };

  return (
    <div className="min-h-screen bg-white">

      {/* Category Hero Header */}
      <div className="relative border-b border-gray-100 bg-white pt-6">
        {category.photo && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={category.photo} alt={category.name}
              className="h-full w-full object-cover opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white" />
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-bold
            tracking-widest text-gray-400 uppercase">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span className="text-gray-200">/</span>
            <Link href="/experiences" className="hover:text-black transition-colors">
              Experiences
            </Link>
            <span className="text-gray-200">/</span>
            <span className="text-black">{category.name}</span>
          </nav>

          <div className="flex items-start gap-6">
            {category.photo && (
              <div className="hidden shrink-0 overflow-hidden rounded-2xl
                shadow-lg sm:block w-24 h-24">
                <img src={category.photo} alt={category.name}
                  className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="mb-2 text-3xl font-black leading-tight
                text-gray-900 md:text-5xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="max-w-2xl text-base font-medium text-gray-500">
                  {category.description}
                </p>
              )}
              <p className="mt-3 text-sm font-bold text-[#004f32]">
                {filteredTreks.length}{' '}
                {filteredTreks.length === 1 ? 'experience' : 'experiences'} available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-0 z-40 border-b border-gray-100
        bg-white/95 shadow-sm backdrop-blur-md">
        <div className="no-scrollbar mx-auto flex max-w-7xl items-center
          justify-between gap-4 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">

            {(Object.keys(filterOptions) as (keyof Filters)[]).map(key => (
              <div key={key} className="relative shrink-0">
                <button
                  onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2
                    text-sm font-bold transition-all
                    ${filters[key] !== 'All'
                      ? 'border-[#004f32] bg-[#f0f9f6] text-[#004f32]'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                >
                  {key === 'timeOfDay' ? 'Time' : key.charAt(0).toUpperCase() + key.slice(1)}
                  {filters[key] !== 'All' && (
                    <span className="text-xs">· {filters[key]}</span>
                  )}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform
                    ${activeMenu === key ? 'rotate-180' : ''}`} />
                </button>

                {activeMenu === key && (
                  <>
                    <div className="fixed inset-0 z-0"
                      onClick={() => setActiveMenu(null)} />
                    <div className="absolute top-full left-0 z-10 mt-2 w-52
                      rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl
                      animate-in fade-in zoom-in-95 duration-200">
                      {filterOptions[key].map(opt => (
                        <button key={opt}
                          onClick={() => {
                            setFilters(prev => ({ ...prev, [key]: opt }));
                            setActiveMenu(null);
                          }}
                          className={`w-full rounded-xl px-4 py-2.5 text-left
                            text-sm font-bold transition-colors
                            ${filters[key] === opt
                              ? 'bg-[#f0f9f6] text-[#004f32]'
                              : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}

            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="shrink-0 px-2 text-sm font-bold text-red-500
                  hover:underline">
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trek cards grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <section ref={elementRef as any}
          className={`reveal ${isVisible ? 'reveal-visible' : ''}`}>

          {filteredTreks.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10
              sm:grid-cols-2 lg:grid-cols-4">
              {filteredTreks.map((trek, index) => (
                <ExperienceCard key={trek.id} trek={trek} index={index + 1} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center
              py-24 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                No results found
              </h2>
              <p className="font-medium text-gray-500 mb-8">
                {treks.length === 0
                  ? 'No treks have been added to this category yet.'
                  : 'Try adjusting your filters.'}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters}
                  className="rounded-full bg-black px-8 py-3 font-bold
                    text-white hover:bg-gray-800 transition-colors">
                  Reset filters
                </button>
              )}
            </div>
          )}
        </section>

        {/* About this category box */}
        {category.description && (
          <div className="mt-20 rounded-[2.5rem] border border-[#d1ede1]
            bg-[#f0f9f6] p-8 md:p-12">
            <div className="flex flex-col items-start gap-6 md:flex-row">
              {category.photo && (
                <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden
                  shadow-md hidden md:block">
                  <img src={category.photo} alt={category.name}
                    className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  About {category.name}
                </h3>
                <p className="text-base font-medium text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

