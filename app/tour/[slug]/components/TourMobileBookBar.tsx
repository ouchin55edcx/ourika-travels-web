"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_URL, WHATSAPP_PHONE } from "@/lib/config";

type Props = { price: number; trekSlug: string; trekTitle: string };

export default function TourMobileBookBar({ price, trekSlug, trekTitle }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const whatsappPhone = WHATSAPP_PHONE.replace(/\D/g, "");
  const whatsappMessage = `Hi! I want to reserve "${trekTitle}". ${BASE_URL}/tour/${trekSlug}`;
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`
    : "";

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
      className={`fixed inset-x-0 bottom-0 z-[65] border-t border-[#d7d7d7] bg-white/95 p-3 backdrop-blur-sm transition-all duration-300 lg:hidden ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="flex flex-col gap-2">
        <Link
          href={`/reservation?trek=${trekSlug}`}
          className="block min-h-12 w-full rounded-full bg-[#F26B21] px-5 py-3 text-center text-[16px] font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
        >
          Desde €{price.toLocaleString("es-ES", { minimumFractionDigits: 2 })} · Comprobar disponibilidad
        </Link>
        {whatsappUrl ? (
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block min-h-12 w-full rounded-full border-2 border-[#12355B] px-5 py-3 text-center text-[15px] font-bold text-[#12355B]"
          >
            Reservar por WhatsApp
          </Link>
        ) : null}
      </div>
    </div>
  );
}
