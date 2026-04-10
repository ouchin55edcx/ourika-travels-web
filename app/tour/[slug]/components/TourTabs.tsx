"use client";

import { useState, useEffect } from "react";
import { navigationItems } from "@/lib/data/tourData";

export default function TourTabs() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationItems.map((item) => ({
        id: item.id,
        element: document.getElementById(item.id),
      }));

      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element) {
          const offsetTop = section.element.offsetTop;
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mt-6 overflow-x-auto border-b border-[#e5e7eb] [-ms-overflow-style:none] [scrollbar-width:none]">
      <nav className="flex min-w-max items-center gap-5 text-[14px] font-semibold whitespace-nowrap text-[#133728] sm:gap-6 sm:text-[15px]">
        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`relative pb-3 transition-colors hover:text-[#0f3d24] ${
              activeSection === item.id ? "text-[#0f3d24]" : ""
            }`}
          >
            {item.label}
            {activeSection === item.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0f3d24]" />
            )}
          </a>
        ))}
      </nav>
    </div>
  );
}
