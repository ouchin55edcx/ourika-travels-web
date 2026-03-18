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
import { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
// signOut is now from useAuth context instead of server action
import { type AuthUser } from "@/lib/auth";
import { useSearchTreks, type TrekResult } from "@/hooks/useSearchTreks";
import { useAuth } from "@/lib/context/AuthContext";
import LoginModal from "./LoginModal";
import SearchResultCard from "@/components/SearchResultCard";

type NavbarProps = {
  hidden?: boolean;
  sticky?: boolean;
  user: AuthUser | null;
};

export default function Navbar({ hidden = false, sticky = true, user: serverUser }: NavbarProps) {
  const { user, signOut: contextSignOut } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [query, setQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSigningOut, startSignOut] = useTransition();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { results, loading } = useSearchTreks(query);
  const displayName = user?.full_name?.trim() || user?.email || "";
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "U";

  useEffect(() => {
    if (user && isLoginModalOpen) {
      setIsLoginModalOpen(false);
    }
    if (!user) {
      setIsUserMenuOpen(false);
    }
  }, [user, isLoginModalOpen]);

  useEffect(() => {
    if (hidden) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [hidden]);

  useEffect(() => {
    if (hidden) return;
    const experiencesSection = document.getElementById("experiences-section");
    if (!experiencesSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowSearchBar(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { rootMargin: "-100px 0px 0px 0px", threshold: 0 },
    );

    observer.observe(experiencesSection);
    return () => observer.disconnect();
  }, [hidden]);

  if (hidden) return null;

  return (
    <>
      <nav
        className={`flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-[#edf7f1]/80 via-white/95 to-[#edf7f1]/80 px-6 py-2 backdrop-blur-md transition-all duration-300 md:px-16 ${
          sticky ? "sticky top-0" : ""
        } ${isSearchFocused ? "z-[150]" : "z-[100]"}`}
      >
        {/* Left Section: Logo + Search + Globe */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Logo Section */}
          <div className="flex items-center transition-all duration-500 ease-in-out">
            <Link
              href="/"
              className="text-[24px] font-black tracking-[-0.04em] whitespace-nowrap text-[#0a2e1a] md:text-[28px]"
            >
              Ourika Travels
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div
            className={`hidden px-4 transition-all duration-500 ease-out lg:flex ${showSearchBar || isSearchFocused ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-4 scale-95 opacity-0"}`}
            ref={searchRef}
          >
            {!isSearchFocused ? (
              <div className="relative w-full max-w-[380px] min-w-[320px]">
                <div
                  onClick={() => setIsSearchFocused(true)}
                  className="group/search flex w-full cursor-pointer items-center rounded-full border border-gray-100 border-gray-200/60 bg-white px-2 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex-1 truncate px-4 text-[14px] font-bold text-gray-800">
                    Start your search
                  </div>
                  <div className="rounded-full bg-[#00ef9d] p-2 text-[#0a2e1a] transition-transform duration-300 group-hover/search:scale-105">
                    <Search className="h-3.5 w-3.5 stroke-[4px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-10 w-full max-w-[380px] min-w-[320px]" />
            )}
          </div>

          {/* Utilities: Globe/Language (moved to actions) */}
        </div>

        {/* Desktop Actions Section - Hidden on smaller screens */}
        <div className={`hidden items-center gap-2 transition-all duration-500 lg:flex`}>
          {/* Account Actions: Wishlist, Reservations, Sign In */}
          <div className={`flex items-center gap-1`}>
            <Link
              href="/wishlist"
              className="group flex min-w-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-2 transition-all hover:bg-gray-50"
            >
              <Heart className="h-6 w-6 stroke-[2.5px] text-[#0a2e1a] transition-all group-hover:fill-[#0a2e1a]" />
              {!showSearchBar && (
                <span className="text-[11px] font-bold text-[#0a2e1a]">Wishlist</span>
              )}
            </Link>

            <Link
              href="/reservation-historic"
              className="group flex min-w-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-2 transition-all hover:bg-gray-50"
            >
              <ClipboardList className="h-6 w-6 stroke-[2.5px] text-[#0a2e1a] transition-transform group-hover:scale-110" />
              {!showSearchBar && (
                <span className="text-[11px] font-bold text-[#0a2e1a]">Reservations</span>
              )}
            </Link>

            {user ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#0a2e1a] shadow-sm transition hover:bg-gray-50"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="menu"
                >
                  {user.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={displayName || "User avatar"}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a2e1a] text-xs font-bold text-white">
                      {initials}
                    </span>
                  )}
                  <span className="hidden max-w-[120px] truncate text-[13px] font-bold text-[#0a2e1a] xl:inline">
                    {displayName || "Account"}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/reservation-historic"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                    >
                      My Reservations
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                    >
                      My Wishlist
                    </Link>
                    {user.role === "guide" && (
                      <Link
                        href="/dashboard/guide"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                      >
                        Guide Dashboard
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="my-2 h-px bg-gray-100" />
                    <button
                      type="button"
                      onClick={() =>
                        startSignOut(async () => {
                          setIsUserMenuOpen(false);
                          await contextSignOut();
                        })
                      }
                      className="flex w-full items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                      disabled={isSigningOut}
                    >
                      {isSigningOut ? "Signing out..." : "Sign out"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Language / Currency — next to Sign In */}
                <button className="flex items-center gap-1.5 rounded-full border border-[#0a2e1a]/30 bg-[#edf7f1] px-5 py-3.5 text-[14px] font-bold text-[#0a2e1a] transition-colors hover:bg-[#0a2e1a] hover:text-white">
                  <Globe className="h-4 w-4 stroke-[2.5px]" />
                  <span>MAD · EN</span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200" />

                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="ml-2 rounded-full bg-[#0a2e1a] px-8 py-3.5 text-[15px] font-black whitespace-nowrap text-white shadow-sm transition-all hover:bg-[#0b3320] active:scale-95"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Actions/Toggle - Visible only on smaller screens */}
        <div
          className={`flex items-center gap-2 transition-all duration-300 lg:hidden ${showSearchBar ? "w-[100px] justify-end" : ""}`}
        >
          {showSearchBar && (
            <button
              onClick={() => setIsSearchFocused(true)}
              className="rounded-full p-2 text-[#0a2e1a] transition-colors hover:bg-gray-50"
              aria-label="Open search"
            >
              <Search className="h-7 w-7 stroke-[2.5px]" />
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="z-50 rounded-full p-2 text-[#0a2e1a] transition-colors hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            <Menu className="h-8 w-8" />
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed inset-0 z-[300] transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col gap-8 px-6 pt-6">
            {/* Close button inside drawer */}
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="text-xl font-black tracking-tight text-[#0a2e1a]"
                onClick={() => setIsMenuOpen(false)}
              >
                Ourika Travels
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#0a2e1a] transition-colors hover:bg-gray-200"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Primary Links */}
            <div className="flex flex-col gap-6">
              <Link
                href="/reservation-historic"
                className="flex items-center gap-4 text-2xl font-bold text-[#0a2e1a]"
                onClick={() => setIsMenuOpen(false)}
              >
                <ClipboardList className="h-8 w-8 stroke-[2.5px]" />
                Reservations
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-4 text-2xl font-bold text-[#0a2e1a]"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-8 w-8 stroke-[2.5px]" />
                Wishlist
              </Link>
            </div>

            <div className="h-[1px] w-full bg-gray-100" />

            {/* Secondary/Settings */}
            <div className="flex flex-col gap-6">
              <button className="flex items-center gap-4 text-xl font-medium text-[#0a2e1a]">
                <Globe className="h-6 w-6 stroke-[2px]" />
                <span>Language: EN</span>
              </button>
              <button className="flex items-center gap-4 text-xl font-medium text-[#0a2e1a]">
                <Moon className="h-6 w-6 stroke-[2px]" />
                <span>Dark Mode</span>
              </button>
            </div>

            {/* Account actions at bottom */}
            <div className="mt-auto pb-12">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-full border border-[#0a2e1a] px-6 py-4 text-center text-lg font-bold text-[#0a2e1a]"
                  >
                    My Profile
                  </Link>
                  {user.role === "guide" && (
                    <Link
                      href="/dashboard/guide"
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-full border border-[#0a2e1a] px-6 py-4 text-center text-lg font-bold text-[#0a2e1a]"
                    >
                      Guide Dashboard
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-full border border-[#0a2e1a] px-6 py-4 text-center text-lg font-bold text-[#0a2e1a]"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      startSignOut(async () => {
                        setIsMenuOpen(false);
                        await contextSignOut();
                      })
                    }
                    className="w-full rounded-full bg-[#0a2e1a] py-5 text-xl font-black text-white shadow-lg transition-all active:scale-95"
                    disabled={isSigningOut}
                  >
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                  className="block w-full rounded-full bg-[#0a2e1a] py-5 text-center text-xl font-black text-white shadow-lg transition-all active:scale-95"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Backdrop for mobile menu */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-[400] bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>
      {/* Expanded Search Box - Moved Outside Nav for 100% Reliability on Mobile */}
      {isSearchFocused && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[190] hidden bg-black/20 backdrop-blur-sm md:block"
            onClick={() => setIsSearchFocused(false)}
          />
          {/* Dropdown panel */}
          <div
            className="fixed inset-0 z-[200] flex max-h-screen w-full flex-col overflow-hidden bg-white shadow-2xl md:fixed md:top-16 md:left-1/2 md:max-h-[520px] md:w-[520px] md:-translate-x-1/2 md:rounded-2xl md:border md:border-gray-100"
            ref={searchRef}
          >
            {/* Input Area */}
            <div className="flex shrink-0 items-center bg-white px-5 py-5 md:py-3">
              <SearchIcon className="mr-3 h-5 w-5 shrink-0 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Where to?"
                className="flex-1 border-none bg-transparent text-base font-medium outline-none placeholder:text-gray-400 focus:ring-0 md:text-[15px]"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSearchFocused(false);
                }}
                className="ml-1 rounded-md p-2 transition-colors hover:bg-gray-50"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Divider Line */}
            <div className="h-[1px] w-full shrink-0 bg-gray-100" />

            {/* Dropdown Content */}
            <div className="custom-scrollbar flex-1 overflow-y-auto bg-white p-5 md:p-4">
              {/* Sponsored Section */}
              {!query && (
                <div className="mb-6">
                  <div className="group flex cursor-pointer items-center gap-4 rounded-lg p-2.5 transition-all hover:bg-gray-50">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gray-100 md:h-14 md:w-14">
                      <Image
                        src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=200&auto=format&fit=crop"
                        alt="Sponsored"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-0.5 text-[15px] leading-tight font-semibold text-[#0a2e1a]">
                        Cultural wonder in Ourika
                      </h4>
                      <p className="text-[13px] font-medium text-gray-500">Sponsored Tourism</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="space-y-4">
                <h3 className="mb-2 px-3 text-[13px] font-semibold tracking-wider text-gray-400 uppercase">
                  {query ? `Results for \"${query}\"` : "Popular experiences"}
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
                        onSelect={() => setIsSearchFocused(false)}
                      />
                    ))
                  ) : (
                    <div className="py-16 text-center md:py-8">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 md:h-16 md:w-16">
                        <SearchIcon className="h-10 w-10 text-gray-300 md:h-8 md:w-8" />
                      </div>
                      <p className="text-lg font-bold text-gray-500 md:text-sm">
                        No results for \"{query}\"
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Try \"waterfall\", \"Berber\" or \"hike\"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
