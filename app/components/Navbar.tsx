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
import { popularDestinations } from "@/lib/data/destinations";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/lib/context/AuthContext";
import LoginModal from "./LoginModal";

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

  const results = useSearch(popularDestinations, query, ["name", "location"]);
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
        className={`flex items-center justify-between border-b border-gray-100 bg-white px-6 py-2 transition-all duration-300 md:px-16 ${sticky ? "sticky top-0" : ""
          } ${isSearchFocused ? "z-[var(--z-modal)]" : "z-50"}`}
      >
        {/* Left Section: Logo + Search + Globe */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Logo Section */}
          <div className="flex items-center transition-all duration-500 ease-in-out">
            <Link
              href="/"
              className="text-[24px] font-black tracking-[-0.04em] whitespace-nowrap text-[#004f32] md:text-[28px]"
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
                  <div className="rounded-full bg-[#004f32] p-2 text-white transition-transform duration-300 group-hover/search:scale-105">
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
        <div className={`hidden items-center gap-3 transition-all duration-500 lg:flex`}>
          {/* Language Selector */}
          <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-bold text-[#004f32] shadow-sm transition-colors hover:bg-gray-50">
            <Globe className="h-4 w-4 stroke-[2.5px]" />
            <span>MAD · EN</span>
          </button>

          {/* Divider */}
          <div className="h-8 w-[1px] bg-gray-200" />

          {/* Account Actions: Wishlist, Reservations, Become a Guide, Sign In */}
          <div className={`flex items-center gap-1`}>
            <Link
              href="/wishlist"
              className="group flex min-w-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-2 transition-all hover:bg-gray-50"
            >
              <Heart className="h-6 w-6 stroke-[2.5px] text-[#004f32] transition-all group-hover:fill-[#004f32]" />
              {!showSearchBar && (
                <span className="text-[11px] font-bold text-[#004f32]">Wishlist</span>
              )}
            </Link>

            <Link
              href="/reservation-historic"
              className="group flex min-w-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl px-4 py-2 transition-all hover:bg-gray-50"
            >
              <ClipboardList className="h-6 w-6 stroke-[2.5px] text-[#004f32] transition-transform group-hover:scale-110" />
              {!showSearchBar && (
                <span className="text-[11px] font-bold text-[#004f32]">Reservations</span>
              )}
            </Link>

            {!user || user.role !== "tourist" ? (
              <Link
                href="/register/guide"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 hidden items-center gap-2 rounded-full px-4 py-3 text-[15px] font-bold whitespace-nowrap text-[#004f32] transition-colors hover:bg-gray-50 xl:flex"
              >
                <span>Become a Guide</span>
              </Link>
            ) : null}

            {user ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#004f32] shadow-sm transition hover:bg-gray-50"
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
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#004f32] text-xs font-bold text-white">
                      {initials}
                    </span>
                  )}
                  <span className="hidden max-w-[120px] truncate text-[13px] font-bold text-[#004f32] xl:inline">
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
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="ml-2 rounded-full bg-[#004f32] px-8 py-3.5 text-[15px] font-black whitespace-nowrap text-white shadow-sm transition-all hover:bg-[#003d27] active:scale-95"
              >
                Sign In
              </button>
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
              className="rounded-full p-2 text-[#004f32] transition-colors hover:bg-gray-50"
              aria-label="Open search"
            >
              <Search className="h-7 w-7 stroke-[2.5px]" />
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="z-50 rounded-full p-2 text-[#004f32] transition-colors hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed inset-0 z-[var(--z-dropdown)] transform bg-white transition-transform duration-300 ease-in-out lg:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex h-full flex-col gap-8 px-6 pt-24">
            {/* Primary Links */}
            <div className="flex flex-col gap-6">
              <Link
                href="/reservation-historic"
                className="flex items-center gap-4 text-2xl font-bold text-[#004f32]"
                onClick={() => setIsMenuOpen(false)}
              >
                <ClipboardList className="h-8 w-8 stroke-[2.5px]" />
                Reservations
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-4 text-2xl font-bold text-[#004f32]"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-8 w-8 stroke-[2.5px]" />
                Wishlist
              </Link>
              {!user || user.role !== "tourist" ? (
                <Link
                  href="/register/guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center gap-4 text-2xl font-bold text-[#004f32]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Compass className="h-8 w-8 stroke-[2.5px]" />
                  Become a Guide
                </Link>
              ) : null}
            </div>

            <div className="h-[1px] w-full bg-gray-100" />

            {/* Secondary/Settings */}
            <div className="flex flex-col gap-6">
              <button className="flex items-center gap-4 text-xl font-medium text-[#004f32]">
                <Globe className="h-6 w-6 stroke-[2px]" />
                <span>Language: EN</span>
              </button>
              <button className="flex items-center gap-4 text-xl font-medium text-[#004f32]">
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
                    className="block rounded-full border border-[#004f32] px-6 py-4 text-center text-lg font-bold text-[#004f32]"
                  >
                    My Profile
                  </Link>
                  {user.role === "guide" && (
                    <Link
                      href="/dashboard/guide"
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-full border border-[#004f32] px-6 py-4 text-center text-lg font-bold text-[#004f32]"
                    >
                      Guide Dashboard
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-full border border-[#004f32] px-6 py-4 text-center text-lg font-bold text-[#004f32]"
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
                    className="w-full rounded-full bg-[#004f32] py-5 text-xl font-black text-white shadow-lg transition-all active:scale-95"
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
                  className="block w-full rounded-full bg-[#004f32] py-5 text-center text-xl font-black text-white shadow-lg transition-all active:scale-95"
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
            className="fixed inset-0 z-[var(--z-dropdown)] bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>

      {/* Expanded Search Box - Moved Outside Nav for 100% Reliability on Mobile */}
      {isSearchFocused && (
        <div
          className="fixed inset-0 z-[var(--z-modal)] flex max-h-screen w-full flex-col overflow-hidden border-gray-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.08)] md:fixed md:top-2 md:left-1/2 md:max-h-[85vh] md:w-[500px] md:-translate-x-1/2 md:rounded-xl md:border"
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
                    <h4 className="mb-0.5 text-[15px] leading-tight font-semibold text-[#004f32]">
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
                {query ? "Search Results" : "Popular Destinations"}
              </h3>

              <div className="grid gap-0.5">
                {results.length > 0 ? (
                  results.map((item) => (
                    <div
                      key={item.id}
                      className="group flex cursor-pointer items-center gap-4 rounded-lg border-b border-transparent px-3 py-2.5 transition-all hover:border-gray-100/50 hover:bg-gray-50"
                    >
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-100 md:h-12 md:w-12">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[15px] font-semibold text-[#004f32]">{item.name}</h4>
                        <p className="truncate text-[13px] font-medium text-gray-500">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center md:py-8">
                    <SearchIcon className="mx-auto mb-3 h-10 w-10 text-gray-300 md:mb-2 md:h-8 md:w-8" />
                    <p className="text-lg font-bold text-gray-500 md:text-sm">No results found</p>
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
          className="animate-in fade-in fixed inset-0 z-[1001] hidden bg-black/40 backdrop-blur-[2px] duration-300 lg:block"
          onClick={() => setIsSearchFocused(false)}
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
}
