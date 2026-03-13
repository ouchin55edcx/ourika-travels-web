"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUser, Settings } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin/overview" },
  { label: "Users", href: "/admin/users" },
  { label: "Treks", href: "/admin/treks" },
  { label: "Category", href: "/admin/category" },
  { label: "Booking", href: "/admin/booking" },
];

export default function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b3a2c] font-black text-white">
            OT
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-400">Ourika Travels</p>
            <p className="text-lg font-black text-[#0b3a2c]">Admin Dashboard</p>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin/params"
            className="flex items-center gap-2 rounded-full border border-black/5 bg-white px-3 py-2 text-sm font-semibold text-gray-600 shadow-sm"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            href="/admin/profile"
            className="flex items-center gap-2 rounded-full bg-[#0b3a2c] px-3 py-2 text-sm font-semibold text-white shadow-sm"
          >
            <CircleUser className="h-4 w-4" />
            Admin
          </Link>
        </div>
      </div>

      <nav className="border-t border-black/5">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-2 px-6 py-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
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
  );
}
