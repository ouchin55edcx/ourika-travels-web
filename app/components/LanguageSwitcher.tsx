"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const languages = [
  ["ES", "Español", "🇪🇸"],
  ["AR", "العربية", "🇲🇦"],
  ["FR", "Français", "🇫🇷"],
  ["EN", "English", "🇬🇧"],
] as const;

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return <div ref={ref} className="relative">
    <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu" className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black text-[#12355B] transition hover:bg-[#F26B21]/10">
      <Languages className="h-4 w-4" /><span>🇪🇸</span><span>ES</span><ChevronDown className="h-3.5 w-3.5" />
    </button>
    {open && <div role="menu" className="absolute right-0 top-11 z-[300] w-44 rounded-xl border border-[#12355B]/10 bg-white p-1.5 shadow-xl">
      {languages.map(([code, label, flag]) => <button type="button" role="menuitem" key={code} onClick={() => setOpen(false)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#12355B] hover:bg-[#F26B21]/10"><span>{flag}</span><span className="flex-1">{label}</span>{code === "ES" && <Check className="h-4 w-4 text-[#1E9E6A]" />}</button>)}
    </div>}
  </div>;
}
