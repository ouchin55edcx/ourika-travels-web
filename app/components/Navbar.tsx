"use client";

import Link from "next/link";
import {
  Moon,
  Globe,
  Heart,
  ClipboardList,
  Menu,
  X,
  Search,
  SearchIcon,
  Compass,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";

const popularDestinations = [
  {
    id: 1,
    name: "Setti Fatma Waterfalls",
    location: "Upper Ourika Valley, Morocco",
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Berber Village Hike",
    location: "Oukaimeden Road, Morocco",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Bio-Aromatique Gardens",
    location: "Ourika Road, Marrakech",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Traditional Cooking Class",
    location: "Tnine Ourika, Morocco",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Zipline Adventure Park",
    location: "Terres d'Amanar, Morocco",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200&auto=format&fit=crop",
  },
];

type NavbarProps = {
  hidden?: boolean;
  sticky?: boolean;
};

export default function Navbar({ hidden = false, sticky = true }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery === "") return popularDestinations;

    const needle = trimmedQuery.toLowerCase();
    return popularDestinations.filter(
      (item) =>
        item.name.toLowerCase().includes(needle) ||
        item.location.toLowerCase().includes(needle),
    );
  }, [query]);

  useEffect(() => {
    if (hidden) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hidden]);

  useEffect(() => {
    if (hidden) return;
    const handleScroll = () => {
      const experiencesSection = document.getElementById("experiences-section");
      if (experiencesSection) {
        const rect = experiencesSection.getBoundingClientRect();
        // Show search bar when the Experiences section top reaches middle of viewport or above
        if (rect.top <= 100) {
          setShowSearchBar(true);
        } else {
          setShowSearchBar(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hidden]);

  if (hidden) return null;

  return (
    <>
      <nav
        className={`flex items-center justify-between px-6 py-2 bg-white border-b border-gray-100 md:px-16 transition-all duration-300 ${
          sticky ? "sticky top-0" : ""
        } ${isSearchFocused ? "z-[1002]" : "z-50"}`}
      >
        {/* Left Section: Logo + Search + Globe */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Logo Section */}
          <div className="flex items-center transition-all duration-500 ease-in-out">
            <Link
              href="/"
              className="text-[24px] md:text-[28px] font-black text-[#004f32] tracking-[-0.04em] whitespace-nowrap"
            >
              Ourika Travels
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div
            className={`hidden lg:flex px-4 transition-all duration-500 ease-out ${showSearchBar || isSearchFocused ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95 pointer-events-none"}`}
            ref={searchRef}
          >
            {!isSearchFocused ? (
              <div className="relative w-full min-w-[320px] max-w-[380px]">
                <div
                  onClick={() => setIsSearchFocused(true)}
                  className="flex items-center w-full bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-full py-1.5 px-2 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all cursor-pointer border-gray-200/60 group/search"
                >
                  <div className="flex-1 px-4 text-[14px] font-bold text-gray-800 truncate">
                    Start your search
                  </div>
                  <div className="bg-[#004f32] p-2 rounded-full text-white group-hover/search:scale-105 transition-transform duration-300">
                    <Search className="w-3.5 h-3.5 stroke-[4px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full min-w-[320px] max-w-[380px] h-10" />
            )}
          </div>

          {/* Utilities: Globe/Language (Moved between Search and Actions) */}
          <div className="hidden lg:flex items-center">
            <button className="flex items-center gap-2 text-[15px] font-bold text-[#004f32] hover:bg-gray-50 px-3 py-3 rounded-full transition-colors whitespace-nowrap">
              <Globe className="w-5.5 h-5.5 stroke-[2.5px]" />
              <span
                className={`${showSearchBar ? "hidden xl:inline" : "inline"}`}
              >
                MAD · EN
              </span>
            </button>
          </div>
        </div>

        {/* Desktop Actions Section - Hidden on smaller screens */}
        <div
          className={`hidden lg:flex items-center gap-2 transition-all duration-500`}
        >
          {/* Vertical Divider (Now on the right side) */}
          <div className="w-[1px] h-8 bg-gray-200 mx-2" />

          {/* Account Actions: Wishlist, Reservations, Become a Guide, Sign In */}
          <div className={`flex items-center gap-1`}>
            <button className="flex flex-col items-center justify-center gap-1.5 px-4 py-2 hover:bg-gray-50 rounded-2xl transition-all group min-w-[64px]">
              <Heart className="w-6 h-6 text-[#004f32] stroke-[2.5px] group-hover:fill-[#004f32] transition-all" />
              {!showSearchBar && (
                <span className="text-[11px] font-bold text-[#004f32]">
                  Wishlist
                </span>
              )}
            </button>

            <button className="flex flex-col items-center justify-center gap-1.5 px-4 py-2 hover:bg-gray-50 rounded-2xl transition-all group min-w-[64px]">
              <ClipboardList className="w-6 h-6 text-[#004f32] stroke-[2.5px] group-hover:scale-110 transition-transform" />
              {!showSearchBar && (
                <span className="text-[11px] font-bold text-[#004f32]">
                  Reservations
                </span>
              )}
            </button>

            <Link
              href="/register/guide"
              className="hidden xl:flex items-center gap-2 text-[15px] font-bold text-[#004f32] hover:bg-gray-50 px-4 py-3 rounded-full transition-colors whitespace-nowrap ml-2"
            >
              <span>Become a Guide</span>
            </Link>

            <button className="bg-[#004f32] text-white px-8 py-3.5 rounded-full font-black text-[15px] hover:bg-[#003d27] transition-all shadow-sm active:scale-95 ml-2 whitespace-nowrap">
              Sign In
            </button>
          </div>
        </div>

        {/* Mobile Actions/Toggle - Visible only on smaller screens */}
        <div
          className={`flex lg:hidden items-center gap-2 transition-all duration-300 ${showSearchBar ? "w-[100px] justify-end" : ""}`}
        >
          {showSearchBar && (
            <button
              onClick={() => setIsSearchFocused(true)}
              className="p-2 text-[#004f32] hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Open search"
            >
              <Search className="w-7 h-7 stroke-[2.5px]" />
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#004f32] hover:bg-gray-50 rounded-full transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed inset-0 bg-white z-40 lg:hidden transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full pt-24 px-6 gap-8">
            {/* Primary Links */}
            <div className="flex flex-col gap-6">
              <button className="flex items-center gap-4 text-2xl font-bold text-[#004f32]">
                <ClipboardList className="w-8 h-8 stroke-[2.5px]" />
                Reservations
              </button>
              <button className="flex items-center gap-4 text-2xl font-bold text-[#004f32]">
                <Heart className="w-8 h-8 stroke-[2.5px]" />
                Wishlist
              </button>
              <Link
                href="/register/guide"
                className="flex items-center gap-4 text-2xl font-bold text-[#004f32] mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Compass className="w-8 h-8 stroke-[2.5px]" />
                Become a Guide
              </Link>
            </div>

            <div className="w-full h-[1px] bg-gray-100" />

            {/* Secondary/Settings */}
            <div className="flex flex-col gap-6">
              <button className="flex items-center gap-4 text-xl font-medium text-[#004f32]">
                <Globe className="w-6 h-6 stroke-[2px]" />
                <span>Language: EN</span>
              </button>
              <button className="flex items-center gap-4 text-xl font-medium text-[#004f32]">
                <Moon className="w-6 h-6 stroke-[2px]" />
                <span>Dark Mode</span>
              </button>
            </div>

            {/* Sign In Button at bottom */}
            <div className="mt-auto pb-12">
              <button className="w-full bg-[#004f32] text-white py-5 rounded-full font-black text-xl shadow-lg active:scale-95 transition-all">
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Backdrop for mobile menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #e5e7eb;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #d1d5db;
          }
        `}</style>
      </nav>

      {/* Expanded Search Box - Moved Outside Nav for 100% Reliability on Mobile */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 md:fixed md:top-2 md:left-1/2 md:-translate-x-1/2 w-full md:w-[500px] bg-white md:rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.08)] md:border border-gray-200 overflow-hidden z-[1002] flex flex-col max-h-screen md:max-h-[85vh]"
          ref={searchRef}
        >
          {/* Input Area */}
          <div className="flex items-center px-5 py-5 md:py-3 shrink-0 bg-white">
            <SearchIcon className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where to?"
              className="flex-1 text-base md:text-[15px] outline-none placeholder:text-gray-400 font-medium bg-transparent border-none focus:ring-0"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchFocused(false);
              }}
              className="p-2 hover:bg-gray-50 rounded-md transition-colors ml-1"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Divider Line */}
          <div className="w-full h-[1px] bg-gray-100 shrink-0" />

          {/* Dropdown Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-4 custom-scrollbar bg-white">
            {/* Sponsored Section */}
            {!query && (
              <div className="mb-6">
                <div className="flex items-center gap-4 p-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-all group">
                  <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <Image
                      src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=200&auto=format&fit=crop"
                      alt="Sponsored"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-[#004f32] text-[15px] leading-tight mb-0.5">
                      Cultural wonder in Ourika
                    </h4>
                    <p className="text-gray-500 text-[13px] font-medium">
                      Sponsored Tourism
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="space-y-4">
              <h3 className="px-3 text-[13px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                {query ? "Search Results" : "Popular Destinations"}
              </h3>

              <div className="grid gap-0.5">
                {results.length > 0 ? (
                  results.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-all group border-b border-transparent hover:border-gray-100/50"
                    >
                      <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#004f32] text-[15px]">
                          {item.name}
                        </h4>
                        <p className="text-[13px] text-gray-500 font-medium truncate">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 md:py-8 text-center">
                    <SearchIcon className="w-10 h-10 md:w-8 md:h-8 text-gray-300 mx-auto mb-3 md:mb-2" />
                    <p className="text-gray-500 font-bold text-lg md:text-sm">
                      No results found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for search - Already outside nav */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[1001] animate-in fade-in duration-300 hidden lg:block"
          onClick={() => setIsSearchFocused(false)}
        />
      )}
    </>
  );
}
