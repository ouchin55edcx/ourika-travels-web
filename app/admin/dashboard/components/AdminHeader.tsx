"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUser, Settings, LogOut, Menu, X } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { useTransition, useState } from "react";
import { AuthUser } from "@/lib/auth";

const navItems = [
  { label: "Overview", href: "/admin/dashboard/overview" },
  { label: "Users", href: "/admin/dashboard/users" },
  { label: "Guides", href: "/admin/dashboard/guides" },
  { label: "Treks", href: "/admin/dashboard/treks" },
  { label: "Category", href: "/admin/dashboard/category" },
  { label: "Booking", href: "/admin/dashboard/booking" },
  { label: "Reviews", href: "/admin/dashboard/reviews" },
  { label: "Announcements", href: "/admin/dashboard/announcements" },
];

interface AdminHeaderProps {
  user: AuthUser;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  const userInitials =
    user.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="group flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b3a2c] font-black text-white transition-transform group-hover:scale-105">
              OT
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-400">Ourika Travels</p>
              <p className="text-lg font-black text-[#0b3a2c]">Admin Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin/dashboard/params"
            className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            href="/admin/dashboard/profile"
            className="flex items-center gap-2 rounded-full bg-[#0b3a2c] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003d27]"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
              {userInitials}
            </div>
            {user.full_name.split(" ")[0]}
          </Link>
          <button
            onClick={handleSignOut}
            disabled={isPending}
            className="flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-100 disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isPending ? "..." : "Log out"}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-full p-2 text-[#0b3a2c] transition-colors hover:bg-gray-50 md:hidden"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Main Nav Items (Scrollable on mobile) */}
      <nav className="border-t border-black/5">
        <div className="custom-scrollbar scrollbar-hide mx-auto flex w-full max-w-6xl items-center gap-2 overflow-x-auto px-6 py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-50 transform bg-white transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b3a2c] font-black text-white">
                {userInitials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400">Ourika Travels</p>
                <p className="text-lg font-black text-[#0b3a2c]">{user.full_name}</p>
              </div>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full p-2 text-[#0b3a2c] hover:bg-gray-50"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-4 rounded-2xl p-4 text-xl font-bold transition-all ${
                    isActive
                      ? "bg-[#0b3a2c] text-white shadow-lg"
                      : "text-[#0b3a2c] hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto space-y-3 pb-8">
            <Link
              href="/admin/dashboard/params"
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 text-lg font-bold text-gray-600"
            >
              <Settings className="h-6 w-6" />
              Settings
            </Link>
            <Link
              href="/admin/dashboard/profile"
              onClick={() => setIsMenuOpen(false)}
              className="flex w-full items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 text-lg font-bold text-gray-600"
            >
              <CircleUser className="h-6 w-6" />
              My Profile
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isPending}
              className="flex w-full items-center gap-4 rounded-2xl bg-red-50 p-4 text-lg font-bold text-red-600 transition-all active:scale-95 disabled:opacity-50"
            >
              <LogOut className="h-6 w-6" />
              {isPending ? "Signing out..." : "Log out"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
