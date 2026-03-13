"use client";

import Link from "next/link";
import { Heart, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

type TourStickyHeaderProps = {
  title: string;
  navigationItems: readonly string[];
};

export default function TourStickyHeader({ title, navigationItems }: TourStickyHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 220);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-[70] border-b border-[#d7d7d7] bg-white/95 backdrop-blur-sm transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[42px] items-center justify-between gap-4 border-b border-[#e5e7eb] sm:min-h-[46px]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#3b3b3b] sm:text-sm"
          >
            <span aria-hidden="true">‹</span>
            <span className="truncate">See all Things to Do in Marrakech-Safi</span>
          </Link>

          <div className="hidden items-center gap-4 lg:flex">
            <div className="flex items-center gap-3 text-sm text-[#1f1f1f]">
              <span className="max-w-[420px] truncate font-semibold text-[#12311f]">{title}</span>
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#00aa6c]" />
                <span className="font-semibold">4.6</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[#123d2f]">
              <button className="transition hover:opacity-70">
                <Heart className="h-4 w-4" />
              </button>
              <button className="transition hover:opacity-70">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex min-h-[44px] items-center justify-between gap-4 overflow-x-auto sm:min-h-[48px]">
          <nav className="flex min-w-max items-center gap-5 text-[14px] font-semibold whitespace-nowrap text-[#12311f] sm:gap-6 sm:text-[15px]">
            {navigationItems.map((item, index) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`py-3 ${
                  index === 1 ? "border-b-2 border-[#123d2f]" : "border-b-2 border-transparent"
                }`}
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-6 lg:flex">
            <p className="text-[15px] font-extrabold text-[#12311f]">from $17.60</p>
            <button className="rounded-full bg-[#00e05a] px-5 py-2.5 text-[15px] font-bold text-black">
              Check availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
