"use client";

import Link from "next/link";
import { Moon, Menu, X, Search, SearchIcon, Compass, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useTransition } from "react";
import Image from "next/image";
// signOut is now from useAuth context instead of server action
import { type AuthUser } from "@/lib/auth";
import { useSearchTreks, type TrekResult } from "@/hooks/useSearchTreks";
import { useAuth } from "@/lib/context/AuthContext";
import LoginModal from "./LoginModal";
import SearchResultCard from "@/components/SearchResultCard";
import LanguageSwitcher from "./LanguageSwitcher";
import { TrustStrip } from "@/hooks/components/HomeAdditions";

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
  const [isScrolled, setIsScrolled] = useState(false);
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
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const openMenu = () => setIsMenuOpen(true);
    window.addEventListener("nomadica:open-menu", openMenu);
    return () => window.removeEventListener("nomadica:open-menu", openMenu);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  if (hidden) return null;

  return (
    <>
      <div className={`sticky top-0 z-[110] overflow-hidden bg-[#12355B] transition-[max-height,opacity] duration-300 ${isScrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"}`}>
        <TrustStrip />
      </div>
      <nav
        className={`isolate flex items-center justify-between bg-[#FAFAF7] h-14 px-4 py-1 backdrop-blur-md transition-all duration-300 md:h-auto md:px-16 md:py-2 ${
          sticky ? `sticky ${isScrolled ? "top-0" : "top-8"}` : ""
        } ${isSearchFocused ? "z-[150]" : "z-[100]"}`}
      >
        {/* Left Section: Logo + Search */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Logo Section */}
          <div className="flex items-center transition-all duration-500 ease-in-out">
            <Link
              href="/"
              className="text-[21px] font-black tracking-[-0.04em] whitespace-nowrap text-[#12355B] md:text-[28px]"
            >
              <span className="font-normal">nomadic</span><span className="font-bold"> sahara</span><span aria-hidden="true" className="ml-2 inline-block h-3 w-3 rounded-sm bg-[#F26B21]" />
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
                  className="group/search hidden w-full cursor-pointer items-center md:flex rounded-full border border-gray-100 border-gray-200/60 bg-white px-2 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex-1 truncate px-4 text-[14px] font-bold text-gray-800">
                    Comienza tu búsqueda
                  </div>
                  <div className="rounded-full bg-[#F26B21] p-2 text-[#12355B] transition-transform duration-300 group-hover/search:scale-105">
                    <Search className="h-3.5 w-3.5 stroke-[4px]" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-10 w-full max-w-[380px] min-w-[320px]" />
            )}
          </div>

          {/* Utilities */}
        </div>

        {/* Desktop Actions Section - Hidden on smaller screens */}
        <div className={`hidden items-center gap-2 transition-all duration-500 lg:flex`}>
          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-5 xl:flex">
              <div className="group relative">
                <button type="button" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-1.5 text-sm font-medium text-[#12355B] transition-colors hover:text-[#F26B21]">Destinos <ChevronDown className="h-4 w-4" /></button>
                <div className="invisible absolute right-0 top-8 z-50 grid w-64 translate-y-1 grid-cols-2 gap-1 rounded-2xl border border-[#12355B]/10 bg-white p-3 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {["Marrakech", "Fez", "Essaouira", "Agadir", "Chefchaouen", "Merzouga (Desierto)"].map((city) => <Link key={city} href={`/search?destination=${encodeURIComponent(city)}`} className="rounded-lg px-2 py-2 text-sm font-medium text-[#12355B] hover:bg-[#F26B21]/10 hover:text-[#F26B21]">{city}</Link>)}
                </div>
              </div>
              {[['Circuitos', '/experiences'], ['Ofertas', '/offers']].map(([label, href]) => <Link key={label} href={href} className="group relative text-sm font-medium text-[#12355B] transition-colors hover:text-[#F26B21]">{label}<span className="absolute -bottom-1 left-0 h-px w-0 bg-[#F26B21] transition-all group-hover:w-full" /></Link>)}
              <a href="#faq-section" className="group relative text-sm font-medium text-[#12355B] transition-colors hover:text-[#F26B21]">Ayuda<span className="absolute -bottom-1 left-0 h-px w-0 bg-[#F26B21] transition-all group-hover:w-full" /></a>
            </div>
          <div className="hidden md:block"><LanguageSwitcher /></div>
          {user ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#12355B] shadow-sm transition hover:bg-gray-50"
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
                  <span className="hidden max-w-[120px] truncate text-[13px] font-bold text-[#12355B] xl:inline">
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
                      Mi perfil
                    </Link>
                    <Link
                      href="/reservation-historic"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                    >
                      My Reservas
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                    >
                      My Favoritos
                    </Link>
                    {user.role === "guide" && (
                      <Link
                        href="/dashboard/guide"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                      >
                        Panel de guía
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50"
                      >
                        Panel de administración
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
                  className="ml-2 rounded-full bg-[#12355B] px-8 py-3.5 text-[15px] font-black whitespace-nowrap text-white shadow-sm transition-all hover:bg-[#0e2947] active:scale-95"
                >
                  Iniciar sesión
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
              className="rounded-full p-2 text-[#12355B] transition-colors hover:bg-gray-50"
              aria-label="Open search"
            >
              <Search className="h-7 w-7 stroke-[2.5px]" />
            </button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="z-50 rounded-full p-2 text-[#12355B] transition-colors hover:bg-gray-50"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6 md:h-8 md:w-8" />
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
                className="text-xl font-black tracking-tight text-[#12355B]"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-normal">nomadic</span><span className="font-bold"> sahara</span><span aria-hidden="true" className="ml-2 inline-block h-3 w-3 rounded-sm bg-[#F26B21]" />
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[#12355B] transition-colors hover:bg-gray-200"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0E8FA3]">Navegación</p>
              {[['Destinos', '/search'], ['Circuitos', '/experiences'], ['Ofertas', '/offers']].map(([label, href]) => <Link key={label} href={href} className="text-2xl font-bold text-[#12355B]" onClick={() => setIsMenuOpen(false)}>{label}</Link>)}
              <a href="#faq-section" className="text-2xl font-bold text-[#12355B]" onClick={() => setIsMenuOpen(false)}>Ayuda</a>
            </div>

            <div className="h-[1px] w-full bg-gray-100" />
            <div className="flex items-center justify-between rounded-2xl bg-[#FAFAF7] px-4 py-3"><span className="text-sm font-bold text-[#12355B]">Idioma</span><LanguageSwitcher /></div>

            {/* Secondary/Settings */}
            <div className="flex flex-col gap-6">
              <button className="flex items-center gap-4 text-xl font-medium text-[#12355B]">
                <Moon className="h-6 w-6 stroke-[2px]" />
                <span>Modo oscuro</span>
              </button>
            </div>

            {/* Account actions at bottom */}
            <div className="mt-auto pb-12">
              {user ? (
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-full border border-[#0a2e1a] px-6 py-4 text-center text-lg font-bold text-[#12355B]"
                  >
                    Mi perfil
                  </Link>
                  {user.role === "guide" && (
                    <Link
                      href="/dashboard/guide"
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-full border border-[#0a2e1a] px-6 py-4 text-center text-lg font-bold text-[#12355B]"
                    >
                      Panel de guía
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className="block rounded-full border border-[#0a2e1a] px-6 py-4 text-center text-lg font-bold text-[#12355B]"
                    >
                      Panel de administración
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
                  Iniciar sesión
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
                placeholder="¿Adónde quieres ir?"
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
                      <h4 className="mb-0.5 text-[15px] leading-tight font-semibold text-[#12355B]">
                        Maravilla cultural de Marruecos
                      </h4>
                      <p className="text-[13px] font-medium text-gray-500">Turismo recomendado</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Section */}
              <div className="space-y-4">
                <h3 className="mb-2 px-3 text-[13px] font-semibold tracking-wider text-gray-400 uppercase">
                  {query ? `Results for \"${query}\"` : "Experiencias populares"}
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
                        No hay resultados para \"{query}\"
                      </p>
                      <p className="mt-1 text-sm text-gray-400">
                        Prueba \"desierto\", \"cultura\" o \"excursión\"
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
