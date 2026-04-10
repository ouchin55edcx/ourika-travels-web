"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function TouristHighlight() {
  const { elementRef, isVisible } = useScrollReveal(0.1);

  return (
    <section
      ref={elementRef as any}
      aria-label="About Ourika Travels — local guide association in Setti Fatma, Ourika Valley"
      className={`w-full px-4 py-16 transition-all duration-1000 sm:px-6 sm:py-20 lg:px-8 lg:py-24 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-[2rem] bg-[#0a2e1a]">
        <div>
          <div className="flex flex-col items-center justify-center p-10 text-center sm:p-14 lg:p-20">
            <h2 className="text-7xl leading-[1.1] font-black tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl">
              The only guides
              <br />
              <span className="text-[#00ef9d]">born in the valley</span>
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/70 sm:mt-8 sm:text-lg sm:leading-9">
              Ourika Travels is a local Berber guide association rooted in Setti Fatma — gateway to
              the seven waterfalls of the Atlas Mountains. We connect travelers directly with
              certified local guides who grew up in these valleys, speak the land&apos;s languages,
              and know trails no map has printed.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:gap-5">
              <Link
                href="/about"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#00ef9d] px-8 py-4 text-base font-black text-[#0a2e1a] transition-all hover:bg-[#00dd8e] active:scale-95 sm:px-10 sm:py-5 sm:text-lg"
              >
                About Ourika Travels
                <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/experiences"
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-4 text-base font-black text-white transition-all hover:bg-white/10 sm:px-10 sm:py-5 sm:text-lg"
              >
                Browse experiences
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom quote bar */}
        <div className="border-t border-white/10 px-8 py-6 sm:px-12 sm:py-8">
          <p className="text-center text-sm text-white/50 sm:text-base">
            <span className="font-black text-[#00ef9d]">Ourika Travels</span> · Setti Fatma, Ourika
            Valley, Morocco · Certified local Berber guides · 45 min from Marrakech
          </p>
        </div>
      </div>
    </section>
  );
}
