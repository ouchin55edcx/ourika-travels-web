"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  LogOut,
  LayoutDashboard,
  Ticket,
  Users,
  Mountain,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { useTransition } from "react";

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

const mobileTabs = [
  { label: "Overview", href: "/admin/dashboard/overview", icon: LayoutDashboard },
  { label: "Bookings", href: "/admin/dashboard/booking", icon: Ticket },
  { label: "Guides", href: "/admin/dashboard/guides", icon: Users },
  { label: "Treks", href: "/admin/dashboard/treks", icon: Mountain },
  { label: "Reviews", href: "/admin/dashboard/reviews", icon: Star },
  { label: "Settings", href: "/admin/dashboard/params", icon: Settings },
];

export default function AdminHeader() {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
    });
  };

  return (
    <>
      {/* TOP BAR - Always visible */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a2e1a]">
              <span className="text-sm font-black text-[#00ef9d]">OT</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs leading-none font-semibold text-gray-400">Ourika Travels</p>
              <p className="mt-0.5 text-sm leading-none font-black text-[#0a2e1a]">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Right: Settings + Admin name + Logout */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin/dashboard/params"
              className="cursor-pointer rounded-full border border-gray-200 p-2 transition-colors hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 text-gray-500" />
            </Link>
            <div className="flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-3 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0a2e1a]">
                <span className="text-[10px] font-black text-white">AD</span>
              </div>
              <span className="hidden max-w-[80px] truncate text-xs font-bold text-gray-700 sm:block">
                Admin
              </span>
            </div>
            <form action={handleSignOut}>
              <button
                type="submit"
                disabled={isPending}
                className="cursor-pointer rounded-full border border-red-100 bg-red-50 p-2 transition-colors hover:bg-red-100 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 text-red-500" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* DESKTOP HORIZONTAL NAV - visible only on lg+ */}
      <nav className="sticky top-[69px] z-40 hidden border-b border-gray-100 bg-white/95 px-4 backdrop-blur-sm sm:px-6 lg:flex lg:px-8">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`cursor-pointer border-b-2 px-4 py-3 text-sm font-bold whitespace-nowrap transition-colors hover:bg-gray-50 ${
                  isActive
                    ? "border-[#0a2e1a] text-[#0a2e1a]"
                    : "border-transparent text-gray-500 hover:text-[#0a2e1a]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* MOBILE BOTTOM TAB BAR - visible only below lg */}
      <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-100 bg-white lg:hidden">
        <div className="safe-pb grid h-16 grid-cols-6">
          {mobileTabs.map((tab) => {
            const active = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex cursor-pointer touch-manipulation flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-[#0a2e1a]" : "text-gray-400"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
                <span className="text-[9px] font-bold">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
