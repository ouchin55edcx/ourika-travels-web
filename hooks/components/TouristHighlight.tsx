"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin, ShieldCheck, Trees, Users } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const highlights = [
  {
    icon: MapPin,
    label: "Setti Fatma base",
    description: "Start directly in the valley instead of booking through a Marrakech middleman.",
  },
  {
    icon: ShieldCheck,
    label: "Certified local guides",
    description: "Small-group experiences led by people who know the mountain routes and villages.",
  },
  {
    icon: Trees,
    label: "Waterfalls and Berber villages",
    description: "Hikes, tea stops, scenic viewpoints, and real cultural contact in one day.",
  },
  {
    icon: Users,
    label: "Built for travelers",
    description: "Flexible bookings, direct WhatsApp contact, and support before you arrive.",
  },
];

export default function TouristHighlight() {
  const { elementRef, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={elementRef as any} className="w-full px-4 pb-0 sm:px-6 lg:px-8">
      <div
        className={`mx-auto grid w-full max-w-7xl overflow-hidden rounded-[2rem] border border-black/5 bg-[#f7faf9] shadow-[0_18px_50px_rgba(0,0,0,0.08)] transition-all duration-1000 lg:grid-cols-[1.05fr_0.95fr] ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        <div className="relative min-h-[280px] overflow-hidden sm:min-h-[360px] lg:min-h-[100%]">
          <Image
            src="/about.png"
            alt="Local guides and travelers in Ourika Valley, Morocco"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2e1a]/70 via-[#0a2e1a]/15 to-transparent" />
          <div className="absolute right-5 bottom-5 left-5 rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:p-5">
            <p className="text-[11px] font-black tracking-[0.2em] text-[#00ef9d] uppercase">
              Why travelers choose us
            </p>
            <p className="mt-2 text-lg font-black text-white sm:text-2xl">
              Real Ourika experiences, guided from the valley itself
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d6e7de] bg-white px-4 py-2 text-[11px] font-black tracking-[0.18em] text-[#0b3a2c] uppercase">
            Local advantage
          </div>

          <h2 className="mt-5 max-w-2xl text-3xl leading-[0.95] font-black tracking-tighter text-[#0a2e1a] sm:text-4xl xl:text-5xl">
            Better than a generic day trip listing
          </h2>

          <p className="mt-5 max-w-2xl text-[15px] leading-8 text-[#355646] sm:text-base">
            Ourika Travels is based in Setti Fatma, at the entrance to the valley. That means
            clearer logistics, stronger local knowledge, and a more authentic experience than
            booking a generic marketplace product with no local presence on the ground.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {highlights.map(({ icon: Icon, label, description }) => (
              <div
                key={label}
                className="rounded-[1.5rem] border border-[#dfe9e4] bg-white p-4 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b3a2c] text-[#00ef9d]">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-4 text-base font-black text-[#0a2e1a]">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5b6f64]">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/experiences"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#0b3a2c] px-7 py-4 text-sm font-black text-white transition-all hover:bg-[#081f12]"
            >
              Explore experiences
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#0b3a2c] px-7 py-4 text-sm font-black text-[#0b3a2c] transition-all hover:bg-[#edf7f1]"
            >
              Learn about Ourika Travels
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
