"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Props = { price: number };

export default function TourMobileBookBar({ price }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("overview");

      if (!aboutSection) {
        setIsVisible(false);
        return;
      }

      const aboutBottom = aboutSection.offsetTop + aboutSection.offsetHeight;
      setIsVisible(window.scrollY > aboutBottom - 120);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[65] border-t border-[#d7d7d7] bg-white/95 p-3 backdrop-blur-sm transition-all duration-300 lg:hidden ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
        }`}
    >
      <Link
        href="/reservation"
        className="block min-h-12 w-full rounded-full bg-[#00e05a] px-5 py-3 text-center text-[16px] font-bold text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
      >
        From ${price.toFixed(2)} · Check availability
      </Link>
    </div>
  );
}
