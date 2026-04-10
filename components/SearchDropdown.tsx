"use client";

import { SearchIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import SearchResultCard from "@/components/SearchResultCard";
import type { TrekResult } from "@/hooks/useSearchTreks";

interface SearchDropdownProps {
  query: string;
  onChangeQuery: (query: string) => void;
  results: TrekResult[];
  loading: boolean;
  onClose: () => void;
  onSelect: () => void;
}

export default function SearchDropdown({
  query,
  onChangeQuery,
  results,
  loading,
  onClose,
  onSelect,
}: SearchDropdownProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="absolute left-0 right-0 top-full z-[300] mt-3 flex max-h-96 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl md:top-full md:max-h-[75vh] md:min-h-[400px] md:rounded-2xl md:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)]">
      {/* Input Area */}
      <div className="flex shrink-0 items-center border-b border-gray-100 bg-white px-5 py-4">
        <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400 md:mr-4 md:h-5 md:w-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onChangeQuery(e.target.value)}
          placeholder="Trip, experience in Ourika, multi-day camping..."
          className="flex-1 border-none bg-transparent text-base font-medium text-black outline-none placeholder:text-gray-400 focus:ring-0 md:text-[18px]"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="ml-1 rounded-md p-2.5 transition-colors hover:bg-gray-50"
        >
          <X className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Dropdown Content */}
      <div className="custom-scrollbar flex-1 overflow-y-auto bg-white p-4 md:p-6">
        {/* Sponsored Section */}
        {!query && (
          <div className="mb-6">
            <p className="mb-3 px-2 text-[11px] font-black tracking-wider text-gray-400 uppercase">
              Featured
            </p>
            <div className="group flex cursor-pointer items-center gap-4 rounded-lg p-2.5 transition-all hover:bg-gray-50">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 md:h-16 md:w-16">
                <Image
                  src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=200&auto=format&fit=crop"
                  alt="Sponsored cultural experience in Ourika Valley, Morocco"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1">
                <h4 className="mb-1 text-[15px] leading-tight font-semibold text-[#004f32]">
                  Cultural wonder in Ourika
                </h4>
                <p className="text-[13px] font-medium text-gray-500">
                  Sponsored Tourism
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="space-y-4">
          <h3 className="mb-3 px-2 text-[11px] font-black tracking-wider text-gray-400 uppercase">
            {query ? `Results for "${query}"` : "Popular experiences"}
          </h3>

          <div className="grid gap-0.5">
            {loading ? (
              // Loading skeleton
              <div className="space-y-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-3 py-2.5">
                    <div className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-gray-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-gray-100" />
                      <div className="h-3 w-1/3 animate-pulse rounded-full bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              results.map((trek) => (
                <SearchResultCard
                  key={trek.id}
                  trek={trek}
                  onSelect={onSelect}
                />
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
                  <SearchIcon className="h-10 w-10 text-gray-300" />
                </div>
                <p className="text-lg font-bold text-gray-500">
                  No results for "{query}"
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Try "waterfall", "Berber" or "hike"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
