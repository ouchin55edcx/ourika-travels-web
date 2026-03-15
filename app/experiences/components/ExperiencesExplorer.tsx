'use client';

import { useMemo, useState } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
import ExperienceCard from './ExperienceCard';
import MoreToExplore from './MoreToExplore';
import type { Category } from '@/app/actions/categories';

export type TrekItem = {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  rating: number;
  review_count: number;
  price_per_adult: number;
  previous_price: number | null;
  badge: string | null;
  award: string | null;
  duration: string;
  time_of_day: 'Morning' | 'Afternoon' | 'Evening' | 'Flexible';
  live_guide_languages: string[];
  is_active: boolean;
  categories: { name: string } | { name: string }[] | null;
};

type Filters = {
  category: string;
  language: string;
  timeOfDay: string;
  price: string;
};

const initialFilters: Filters = {
  category: 'All',
  language: 'All',
  timeOfDay: 'All',
  price: 'All',
};

const PAGE_SIZE = 8;

function matchesPrice(price: number, filter: string) {
  if (filter === 'All') return true;
  if (filter === 'Under $20') return price < 20;
  if (filter === '$20–$40')   return price >= 20 && price <= 40;
  if (filter === '$40+')      return price > 40;
  return true;
}

export default function ExperiencesExplorer({
  initialTreks,
  initialCategories = [],
}: {
  initialTreks: TrekItem[];
  initialCategories?: Category[];
}) {
  const [filters,      setFilters]      = useState<Filters>(initialFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [search,       setSearch]       = useState('');

  const allCategories = useMemo(() => {
    const names = initialTreks
      .map(t => {
        if (!t.categories) return null;
        if (Array.isArray(t.categories)) return t.categories[0]?.name;
        return t.categories.name;
      })
      .filter(Boolean) as string[];
    return ['All', ...Array.from(new Set(names))];
  }, [initialTreks]);

  const allLanguages = useMemo(() => {
    const langs = initialTreks.flatMap(t => t.live_guide_languages ?? []);
    return ['All', ...Array.from(new Set(langs))];
  }, [initialTreks]);

  const timeOptions  = ['All', 'Morning', 'Afternoon', 'Evening', 'Flexible'];
  const priceOptions = ['All', 'Under $20', '$20–$40', '$40+'];

  const filteredTreks = useMemo(() => {
    return initialTreks.filter(trek => {
      const categoryName = Array.isArray(trek.categories)
        ? trek.categories[0]?.name
        : trek.categories?.name;
      const categoryMatch =
        filters.category === 'All' || categoryName === filters.category;
      const languageMatch =
        filters.language === 'All' ||
        trek.live_guide_languages?.includes(filters.language);
      const timeMatch =
        filters.timeOfDay === 'All' || trek.time_of_day === filters.timeOfDay;
      const priceMatch = matchesPrice(trek.price_per_adult, filters.price);
      const searchMatch =
        search.trim() === '' ||
        trek.title.toLowerCase().includes(search.toLowerCase()) ||
        categoryName?.toLowerCase().includes(search.toLowerCase());

      return categoryMatch && languageMatch && timeMatch && priceMatch && searchMatch;
    });
  }, [initialTreks, filters, search]);

  const visibleTreks = filteredTreks.slice(0, visibleCount);
  const canShowMore  = visibleCount < filteredTreks.length;

  function setFilter(key: keyof Filters, value: string) {
    setFilters(prev => ({ ...prev, [key]: value }));
    setVisibleCount(PAGE_SIZE);
  }

  function resetFilters() {
    setFilters(initialFilters);
    setSearch('');
    setVisibleCount(PAGE_SIZE);
  }

  const hasActiveFilters =
    Object.values(filters).some(v => v !== 'All') || search.trim() !== '';

  return (
    <>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">
        <div className="space-y-1">
          <p className="text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
            Experiences in Ourika Valley
          </p>
          <p className="text-sm font-medium text-[#6b7280]">
            {filteredTreks.length} {filteredTreks.length === 1 ? 'result' : 'results'}
            {hasActiveFilters && ' · Filtered'}
          </p>
        </div>

        <div className="sticky top-0 z-40 -mx-4 border-y border-[#e5e7eb]
          bg-white/95 px-4 py-2 backdrop-blur-sm sm:-mx-6 sm:px-6 sm:py-3">
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="relative mb-2 sm:mb-0 sm:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search experiences..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
                  className="w-full rounded-full border border-gray-200 bg-white py-2
                    pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#004f32]/20"
                />
              </div>

              <div className="chip-scroll -mx-4 flex items-center gap-2 overflow-x-auto
                px-4 pt-1 pb-1 [-webkit-overflow-scrolling:touch]
                sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [scrollbar-width:none] [-ms-overflow-style:none]"
                style={{ scrollbarWidth: 'none' }}>

                <select
                  value={filters.category}
                  onChange={e => setFilter('category', e.target.value)}
                  className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center
                    gap-2 rounded-full border px-3 py-2 pr-8 text-[12px] font-medium
                    transition appearance-none sm:text-[13px] bg-no-repeat bg-right
                    ${filters.category !== 'All'
                      ? 'border-[#123d2f] bg-[#123d2f] text-white'
                      : 'border-[#8ba18d] bg-white text-[#12311f] hover:bg-[#f6f8f7]'
                    }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 10px center',
                  }}
                >
                  {allCategories.map(c => (
                    <option key={c} value={c}>{c === 'All' ? 'Category' : c}</option>
                  ))}
                </select>

                <select
                  value={filters.language}
                  onChange={e => setFilter('language', e.target.value)}
                  className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center
                    gap-2 rounded-full border px-3 py-2 pr-8 text-[12px] font-medium
                    transition appearance-none sm:text-[13px] bg-no-repeat bg-right
                    ${filters.language !== 'All'
                      ? 'border-[#123d2f] bg-[#123d2f] text-white'
                      : 'border-[#8ba18d] bg-white text-[#12311f] hover:bg-[#f6f8f7]'
                    }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 10px center',
                  }}
                >
                  {allLanguages.map(l => (
                    <option key={l} value={l}>{l === 'All' ? 'Language' : l}</option>
                  ))}
                </select>

                <select
                  value={filters.timeOfDay}
                  onChange={e => setFilter('timeOfDay', e.target.value)}
                  className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center
                    gap-2 rounded-full border px-3 py-2 pr-8 text-[12px] font-medium
                    transition appearance-none sm:text-[13px] bg-no-repeat bg-right
                    ${filters.timeOfDay !== 'All'
                      ? 'border-[#123d2f] bg-[#123d2f] text-white'
                      : 'border-[#8ba18d] bg-white text-[#12311f] hover:bg-[#f6f8f7]'
                    }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 10px center',
                  }}
                >
                  {timeOptions.map(t => (
                    <option key={t} value={t}>{t === 'All' ? 'Time of day' : t}</option>
                  ))}
                </select>

                <select
                  value={filters.price}
                  onChange={e => setFilter('price', e.target.value)}
                  className={`inline-flex min-h-9 shrink-0 cursor-pointer items-center
                    gap-2 rounded-full border px-3 py-2 pr-8 text-[12px] font-medium
                    transition appearance-none sm:text-[13px] bg-no-repeat bg-right
                    ${filters.price !== 'All'
                      ? 'border-[#123d2f] bg-[#123d2f] text-white'
                      : 'border-[#8ba18d] bg-white text-[#12311f] hover:bg-[#f6f8f7]'
                    }`}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 10px center',
                  }}
                >
                  {priceOptions.map(p => (
                    <option key={p} value={p}>{p === 'All' ? 'Price' : p}</option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex min-h-9 shrink-0 items-center gap-1.5
                      rounded-full border border-red-200 bg-red-50 px-3 py-2
                      text-[12px] font-medium text-red-600 transition
                      hover:bg-red-100 sm:text-[13px]"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2
                h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
                className="w-48 rounded-full border border-gray-200 bg-white py-2
                  pl-9 pr-4 text-sm focus:outline-none focus:w-64
                  focus:ring-2 focus:ring-[#004f32]/20 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        {visibleTreks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-5xl mb-4">🔍</span>
            <p className="text-xl font-black text-gray-300">No experiences found</p>
            <p className="text-sm text-gray-400 mt-2">
              Try adjusting your filters or search query.
            </p>
            <button onClick={resetFilters}
              className="mt-6 rounded-full bg-[#004f32] text-white px-6 py-2.5
                text-sm font-bold hover:bg-[#003a25] transition-all">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleTreks.map((trek, index) => (
              <ExperienceCard key={trek.id} trek={trek} index={index + 1} />
            ))}
          </div>
        )}

        <div className="flex justify-center pt-2">
          {canShowMore ? (
            <button
              onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
              className="min-h-11 rounded-full bg-black px-8 py-3 text-[15px]
                font-bold text-white transition hover:bg-[#1f1f1f]"
            >
              Show more experiences
            </button>
          ) : filteredTreks.length > 0 ? (
            <p className="text-sm font-medium text-[#6b7280]">
              You've reached the end · {filteredTreks.length} experiences total
            </p>
          ) : null}
        </div>

        <div className="pt-10">
          <div className="mb-8 h-px w-full bg-[#e5e7eb]" />
          <MoreToExplore categories={initialCategories} />
        </div>
      </section>
    </>
  );
}

