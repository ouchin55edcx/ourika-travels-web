"use client";

import Link from "next/link";
import { Moon, Heart, ClipboardList, Menu, X, Search, SearchIcon, Compass } from "lucide-react";
import { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
// signOut is now from useAuth context instead of server action
import { type AuthUser } from "@/lib/auth";
import { useSearchTreks, type TrekResult } from "@/hooks/useSearchTreks";
import { useAuth } from "@/lib/context/AuthContext";
import LoginModal from "./LoginModal";
import SearchResultCard from "@/components/SearchResultCard";
import SearchDropdown from "@/components/SearchDropdown";

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

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  // Toggle body class for navbar blur when search dropdown is open
  useEffect(() => {
    if (isSearchFocused) {
      document.body.classList.add("search-dropdown-open");
    } else {
      document.body.classList.remove("search-dropdown-open");
    }
    return () => document.body.classList.remove("search-dropdown-open");
  }, [isSearchFocused]);

  if (hidden) return null;

  return (
    <>
      <nav
        className={`isolate flex items-center justify-between bg-white px-6 py-2 transition-all duration-300 md:px-16 ${
          sticky ? "sticky top-0" : ""
        } ${isSearchFocused ? "z-[150]" : "z-[100]"}`}
      >
        {/* Left Section: Logo + Search */}
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

          {/* Utilities */}
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
        <div className="flex items-center gap-2 transition-all duration-300 lg:hidden">
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
          className={`fixed top-0 left-0 z-[400] h-[100dvh] w-screen overflow-y-auto overscroll-contain bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="flex min-h-[100dvh] flex-col gap-8 bg-white px-6 pt-6">
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
            className="fixed inset-0 z-[390] bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </nav>
      {/* Mobile Search Dropdown - Uses same component as Hero */}
      {isSearchFocused && (
        <>
          {/* Backdrop */}
          <div
            className="animate-in fade-in fixed inset-0 z-[150] bg-black/30 backdrop-blur-[2px] duration-300 lg:hidden"
            onClick={() => setIsSearchFocused(false)}
          />
          {/* Full screen search dropdown for mobile */}
          <div className="fixed inset-0 z-[200] flex flex-col bg-white lg:hidden" ref={searchRef}>
            <SearchDropdown
              query={query}
              onChangeQuery={setQuery}
              results={results}
              loading={loading}
              onClose={() => setIsSearchFocused(false)}
              onSelect={() => setIsSearchFocused(false)}
              fullScreen
            />
          </div>
        </>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
