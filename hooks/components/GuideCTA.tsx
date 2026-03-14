"use client";

import Image from "next/image";
import Link from "next/link";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Compass, ShieldCheck, Star } from "lucide-react";

export default function GuideCTA() {
  const { elementRef, isVisible } = useScrollReveal(0.1);

  return (
    <section
      ref={elementRef as any}
      className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24 xl:py-32"
    >
      <div
        className={`relative overflow-hidden rounded-[3rem] border border-gray-100 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
      >
        <div className="flex flex-col lg:flex-row">
          {/* Content Section */}
          <div className="flex w-full flex-col justify-center p-10 sm:p-16 lg:w-[55%] lg:p-24">
            <div className="mb-10 inline-flex w-fit items-center gap-2 rounded-full border border-[#004f32]/10 bg-[#004f32]/5 px-3 py-1.5 text-[10px] font-black tracking-widest text-[#004f32] uppercase">
              <Compass className="h-3 w-3" />
              Community for Locals
            </div>

            <h2 className="mb-10 text-5xl leading-[0.9] font-black tracking-tighter text-[#004f32] sm:text-7xl">
              Do you know
              <br />
              Ourika like <br />
              no one else?
            </h2>

            <p className="mb-12 max-w-md text-lg leading-relaxed font-medium text-gray-500 sm:text-xl">
              Join our community of local guides. Share your stories, host unique experiences, and
              earn by doing what you love.
            </p>

            <div className="mb-12 flex flex-wrap gap-10">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-black text-[#004f32]">
                  <Star className="h-4 w-4 fill-[#00ef9d] text-[#00ef9d]" />
                  <span className="text-lg tracking-tight">Top visibility</span>
                </div>
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Get booked faster
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-black text-[#004f32]">
                  <ShieldCheck className="h-4 w-4 text-[#00ef9d]" />
                  <span className="text-lg tracking-tight">Secure payouts</span>
                </div>
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Peace of mind
                </p>
              </div>
            </div>

            <Link
              href="/register/guide"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#004f32] px-12 py-5 text-lg font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-[#003a25]"
            >
              Become a Guide
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Image Section */}
          <div className="relative min-h-[400px] w-full bg-gray-100 lg:min-h-0 lg:w-[45%]">
            <Image
              src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop"
              alt="Local Ourika Guide"
              fill
              className="object-cover saturate-[0.8]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            {/* Overlay Gradient for Mobile */}
            <div className="absolute inset-0 bg-gradient-to-t from-white lg:hidden" />

            {/* Floating badge */}
            <div className="absolute top-10 right-10 hidden rounded-[2rem] border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:block">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00ef9d] text-[#004f32]">
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                    Guide of the month
                  </p>
                  <p className="text-lg font-black text-[#004f32]">Youssef B.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
