"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function TouristHighlight() {
  const { elementRef, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={elementRef as any} className="w-full pb-0">
      <div
        className={`flex flex-col overflow-hidden bg-[#004f32] shadow-2xl transition-all duration-1000 lg:flex-row ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
      >
        {/* Image Section */}
        <div className={`relative h-[300px] w-full overflow-hidden lg:h-auto lg:w-[40%]`}>
          <Image
            src="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200&auto=format&fit=crop"
            alt="Happy tourist enjoying Ourika"
            fill
            className="object-cover saturate-[0.8]"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>

        {/* Content Section */}
        <div
          className={`flex w-full flex-col justify-center p-8 text-white sm:p-12 lg:w-[60%] lg:p-16 xl:p-20`}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00ef9d] p-1.5 shadow-sm">
              <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-[#004f32]">
                <div className="h-1.5 w-1.5 rounded-full bg-[#004f32]"></div>
              </div>
            </div>
            <span className="text-[12px] font-black tracking-[0.2em] uppercase opacity-90">
              Traveler Testimonials
            </span>
          </div>

          <h2 className="mb-6 text-4xl leading-[1] font-black tracking-tighter sm:text-6xl">
            Real Guest Ourika Stories
          </h2>

          <p className="mb-10 max-w-md text-lg leading-relaxed font-medium text-white/70">
            See how the stunning landscapes and warm Berber hospitality of the Atlas Mountains leave
            a lasting impression.
          </p>

          <Link
            href="/about"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#00ef9d] px-10 py-5 text-lg font-black text-[#004f32] shadow-xl transition-all hover:scale-105 hover:bg-[#00dd8e]"
          >
            Read their stories
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
