"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUser, Settings, LogOut, Trophy } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { useTransition, useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const navItems = [
  { label: "Overview", href: "/dashboard/guide" },
  { label: "Profile", href: "/dashboard/guide/profile" },
];

export default function GuideHeader() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [guideOrder, setGuideOrder] = useState<number | null>(null);
  const [guideActive, setGuideActive] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    async function fetchGuideOrder() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("guide_order, guide_active")
        .eq("id", user.id)
        .single();

      if (data) {
        setGuideOrder(data.guide_order);
        setGuideActive(data.guide_active ?? false);
      }
    }
    fetchGuideOrder();
  }, []);

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link href="/dashboard/guide" className="group flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0b3a2c] font-black text-white transition-transform group-hover:scale-105">
              OT
            </div>
            <div>
              <p className="text-xs leading-none font-semibold text-gray-400">Ourika Travels</p>
              <p className="mt-0.5 text-sm leading-none font-black text-[#0b3a2c]">
                Guide Dashboard
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="rounded-full border border-gray-200 p-2 transition-colors hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 text-gray-500" />
            </Link>
            <div className="relative">
              <Link
                href="/dashboard/guide/profile"
                className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0b3a2c]">
                  <CircleUser className="h-3.5 w-3.5 text-white" />
                </div>
              </Link>

              {/* Mobile tooltip */}
              {showTooltip && (
                <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 mt-2 w-56 duration-200">
                  <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-3 shadow-xl">
                    <div className="flex items-start gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00ef9d]/20">
                        <Trophy className="h-4 w-4 text-[#00ef9d]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-semibold text-gray-500">Queue position</p>
                        {guideOrder ? (
                          <>
                            <p className="mt-0.5 text-lg font-black text-[#0b3a2c]">
                              #{guideOrder}
                            </p>
                            <p className="mt-px text-[9px] font-medium text-emerald-600">
                              {guideActive ? "✓ Active" : "⏸ Paused"}
                            </p>
                          </>
                        ) : (
                          <p className="mt-0.5 text-xs font-bold text-gray-600">Not assigned</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Header - unchanged */}
      <header className="sticky top-0 z-50 hidden border-b border-black/5 bg-white/80 backdrop-blur-xl md:block">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/guide" className="group flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b3a2c] font-black text-white transition-transform group-hover:scale-105">
                OT
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400">Ourika Travels</p>
                <p className="text-lg font-black text-[#0b3a2c]">Guide Dashboard</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              Account
            </Link>
            <div className="relative">
              <Link
                href="/dashboard/guide/profile"
                className="flex items-center gap-2 rounded-full bg-[#0b3a2c] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#081f12]"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <CircleUser className="h-4 w-4" />
                Guide Profile
              </Link>

              {/* Tooltip showing round-robin order */}
              {showTooltip && (
                <div className="animate-in fade-in zoom-in-95 absolute top-full right-0 mt-2 w-64 duration-200">
                  <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00ef9d]/20">
                        <Trophy className="h-5 w-5 text-[#00ef9d]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-500">
                          Booking queue position
                        </p>
                        {guideOrder ? (
                          <>
                            <p className="mt-1 text-2xl font-black text-[#0b3a2c]">#{guideOrder}</p>
                            <p className="mt-0.5 text-xs font-medium text-emerald-600">
                              {guideActive ? "✓ Active in rotation" : "⏸ Paused"}
                            </p>
                          </>
                        ) : (
                          <p className="mt-1 text-sm font-bold text-gray-600">Not assigned yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              disabled={isPending}
              className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-100 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {isPending ? "..." : "Log out"}
            </button>
          </div>
        </div>

        {/* Desktop Nav Pills */}
        <nav className="border-t border-black/5">
          <div className="scrollbar-hide mx-auto flex w-full max-w-6xl items-center gap-2 overflow-x-auto px-6 py-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-[#0b3a2c] text-white shadow-sm"
                      : "bg-white text-gray-600 hover:bg-[#0b3a2c]/10 hover:text-[#0b3a2c]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid h-16 grid-cols-3">
          {[
            {
              label: "Overview",
              href: "/dashboard/guide",
              icon: (active: boolean) => (
                <svg
                  className={`h-6 w-6 ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              ),
            },
            {
              label: "Profile",
              href: "/dashboard/guide/profile",
              icon: (active: boolean) => (
                <svg
                  className={`h-6 w-6 ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              ),
            },
            {
              label: "Sign out",
              href: "#",
              icon: () => (
                <svg
                  className="h-6 w-6 stroke-[1.5px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              ),
              isSignOut: true,
            },
          ].map((tab, idx) => {
            const active = pathname === tab.href;
            if (tab.isSignOut) {
              return (
                <button
                  key="signout"
                  onClick={handleSignOut}
                  disabled={isPending}
                  className="flex flex-col items-center justify-center gap-1 text-red-400 disabled:opacity-50"
                >
                  {tab.icon()}
                  <span className="text-[10px] font-bold">{isPending ? "..." : "Sign out"}</span>
                </button>
              );
            }
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-[#0b3a2c]" : "text-gray-400"
                }`}
              >
                {tab.icon(active)}
                <span className={`text-[10px] font-bold ${active ? "font-black" : ""}`}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
