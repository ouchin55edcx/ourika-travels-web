"use client";

import Link from "next/link";
import { Heart, Home, Menu, Search, Tag } from "lucide-react";

const tabs = [
  { label: "Inicio", href: "/", icon: Home },
  { label: "Buscar", href: "/search", icon: Search },
  { label: "Ofertas", href: "/offers", icon: Tag },
  { label: "Favoritos", href: "/wishlist", icon: Heart },
] as const;

export default function MobileBottomNav() {
  const openMenu = () => window.dispatchEvent(new CustomEvent("nomadica:open-menu"));

  return (
    <nav aria-label="Navegación móvil" className="fixed inset-x-0 bottom-0 z-[120] flex h-[68px] items-start justify-around border-t border-[#12355B]/10 bg-white px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(18,53,91,0.1)] md:hidden">
      {tabs.map(({ label, href, icon: Icon }) => (
        <Link key={label} href={href} className="flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-bold text-[#6B7280] transition-transform active:scale-95 [&:first-child]:text-[#F26B21]">
          <Icon className="h-5 w-5" aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
      <button type="button" onClick={openMenu} className="flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-bold text-[#6B7280] transition-transform active:scale-95">
        <Menu className="h-5 w-5" aria-hidden="true" />
        <span>Menú</span>
      </button>
    </nav>
  );
}
