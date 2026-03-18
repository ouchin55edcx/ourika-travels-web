"use client";

import { SearchIcon, MapPin, Compass, Clock, Star, X, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchTreks, type TrekResult } from "@/hooks/useSearchTreks";
import SearchResultCard from "@/components/SearchResultCard";

export default function Hero() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { results, loading } = useSearchTreks(query);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Dark Backdrop - Fixed to cover exact full viewport */}
      {isFocused && (
        <div
          className="animate-in fade-in fixed inset-0 z-[var(--z-overlay)] bg-black/5 backdrop-blur-md duration-300"
          onClick={() => setIsFocused(false)}
        />
      )}

      <div
        className={`relative flex flex-col items-center justify-center px-6 pt-10 pb-8 transition-all duration-300 md:pt-20 md:pb-12 ${isFocused ? "z-[var(--z-modal-backdrop)]" : "z-20"} animate-fade-in-up`}
      >
        <h1
          className={`text-center text-4xl font-black tracking-tight text-[#0a2e1a] transition-all duration-300 md:pb-12 md:text-7xl ${isFocused ? "-translate-y-4 opacity-0" : "opacity-100"}`}
        >
          Discover the Magic of Ourika Valley
        </h1>

        <div className="mx-auto w-full max-w-4xl px-4" ref={searchRef}>
          <div className="relative">
            {/* Unified Search Component */}
            <div className="relative w-full">
              {!isFocused ? (
                /* Normal Pill State */
                <div
                  onClick={() => setIsFocused(true)}
                  className="flex h-14 cursor-pointer items-center rounded-full border border-gray-100 bg-white p-1 pl-5 shadow-xl transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] md:h-20 md:p-2 md:pl-8 md:shadow-2xl"
                >
                  <SearchIcon className="mr-2 h-5 w-5 shrink-0 text-gray-400 md:mr-5 md:h-7 md:w-7" />
                  <div className="flex-1 truncate text-[13px] font-medium text-gray-400 sm:text-base md:text-xl">
                    Search activities, guided tours, or local experiences...
                  </div>
                  <button className="h-full rounded-full bg-[#00ef9d] px-5 text-sm font-black text-black shadow-inner transition-all duration-300 hover:bg-[#00dd8e] active:scale-95 md:px-14 md:text-xl">
                    Search
                  </button>
                </div>
              ) : (
                /* Expanded Box State - "The Design" */
                <div className="fixed inset-0 z-[var(--z-modal)] flex flex-col overflow-hidden border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.08)] md:absolute md:-top-2 md:right-0 md:left-0 md:max-h-[85vh] md:min-h-[480px] md:rounded-xl md:border">
                  {/* Input Area */}
                  <div className="flex shrink-0 items-center bg-white px-6 py-5 md:py-3">
                    <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400 md:mr-4 md:h-5 md:w-5" />
                    <input
                      autoFocus
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search destinations..."
                      className="flex-1 border-none bg-transparent text-base font-medium outline-none placeholder:text-gray-400 focus:ring-0 md:text-[18px]"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFocused(false);
                      }}
                      className="ml-1 rounded-md p-2.5 transition-colors hover:bg-gray-50"
                    >
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Divider Line */}
                  <div className="h-[1px] w-full shrink-0 bg-gray-100" />

                  {/* Dropdown Content */}
                  <div className="custom-scrollbar flex-1 overflow-y-auto bg-white p-4 md:p-6">
                    {/* Sponsored Section */}
                    {!query && (
                      <div className="mb-6">
                        <div className="group flex cursor-pointer items-center gap-4 rounded-lg p-2.5 transition-all hover:bg-gray-50">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 md:h-16 md:w-16">
                            <Image
                              src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=200&auto=format&fit=crop"
                              alt="Sponsored"
                              fill
                              className="object-cover"
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
                      <h3 className="mb-2 px-3 text-[13px] font-semibold tracking-wider text-gray-400 uppercase">
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
                              onSelect={() => setIsFocused(false)}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
