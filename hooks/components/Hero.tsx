"use client";

import { SearchIcon, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSearchTreks } from "@/hooks/useSearchTreks";
import SearchDropdown from "@/components/SearchDropdown";

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

  // Toggle body class for navbar blur and prevent scroll on mobile
  useEffect(() => {
    if (isFocused) {
      document.body.classList.add("search-dropdown-open");
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("search-dropdown-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.classList.remove("search-dropdown-open");
      document.body.style.overflow = "";
    };
  }, [isFocused]);

  return (
    <>
      {/* Dark Backdrop - covers everything including navbar (desktop only) */}
      {isFocused && (
        <div
          className="animate-in fade-in fixed inset-0 z-[150] hidden bg-black/30 backdrop-blur-[2px] duration-300 md:block"
          onClick={() => setIsFocused(false)}
        />
      )}

      {/* Mobile Full Screen Search */}
      {isFocused && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-white md:hidden" ref={searchRef}>
          <SearchDropdown
            query={query}
            onChangeQuery={setQuery}
            results={results}
            loading={loading}
            onClose={() => setIsFocused(false)}
            onSelect={() => setIsFocused(false)}
            fullScreen
          />
        </div>
      )}

      <div
        className={`relative flex flex-col items-center justify-center px-0 pt-8 pb-5 transition-all duration-300 md:px-6 md:pt-10 md:pb-8 ${isFocused ? "z-[50] md:z-[200]" : "z-20"} animate-fade-in-up`}
      >
        <h1 className={`mb-8 text-center text-3xl font-black tracking-tight text-[#0a2e1a] transition-all duration-300 md:mb-12 md:text-7xl ${isFocused ? "opacity-0 md:opacity-100" : "opacity-100"}`}>
          Discover the Magic of Ourika Valley
        </h1>

        <div className="mt-8 w-full px-4 md:px-0">
          <div className="mx-auto w-full max-w-4xl">
            <div className="relative z-[200]">
              {/* Unified Search Component */}
              <div className="relative w-full">
                {!isFocused ? (
                  /* TripAdvisor-style Card State */
                  <button
                    type="button"
                    onClick={() => setIsFocused(true)}
                    className="flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 md:h-20 md:rounded-full md:border-gray-100 md:px-5 md:py-0 md:shadow-2xl"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <SearchIcon className="h-5 w-5 shrink-0 text-gray-400 md:h-7 md:w-7" />
                      <span className="truncate text-sm font-medium text-gray-400 md:text-xl">
                        Trip, experience in Ourika, multi-day camping...
                      </span>
                    </div>
                    <span className="inline-flex h-12 items-center justify-center rounded-full bg-[#00ef9d] px-5 text-sm font-black text-black transition-all duration-300 hover:bg-[#00dd8e] active:scale-95 md:h-14 md:px-8 md:text-xl">
                      Search
                    </span>
                  </button>
                ) : (
                  /* Desktop Dropdown - hidden on mobile since we use full screen */
                  <div className="hidden md:block" ref={searchRef}>
                    <SearchDropdown
                      query={query}
                      onChangeQuery={setQuery}
                      results={results}
                      loading={loading}
                      onClose={() => setIsFocused(false)}
                      onSelect={() => setIsFocused(false)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
