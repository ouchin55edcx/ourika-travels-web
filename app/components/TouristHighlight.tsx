"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function TouristHighlight() {
    const { elementRef, isVisible } = useScrollReveal(0.1);

    return (
        <section
            ref={elementRef as any}
            className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 xl:py-32"
        >
            <div className={`bg-[#004f32] rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                {/* Image Section */}
                <div className={`w-full lg:w-[45%] relative h-[400px] lg:h-auto overflow-hidden`}>
                    <Image
                        src="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200&auto=format&fit=crop"
                        alt="Happy tourist enjoying Ourika"
                        fill
                        className="object-cover saturate-[0.8]"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                </div>

                {/* Content Section */}
                <div className={`w-full lg:w-[55%] p-10 sm:p-16 lg:p-24 flex flex-col justify-center text-white`}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-full bg-[#00ef9d] flex items-center justify-center p-1.5 shadow-sm shrink-0">
                            <div className="w-full h-full rounded-full border-2 border-[#004f32] flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#004f32]"></div>
                            </div>
                        </div>
                        <span className="text-[12px] font-black tracking-[0.2em] uppercase opacity-90">Ourika Travels Insights</span>
                    </div>

                    <h2 className="text-5xl sm:text-7xl font-black mb-8 leading-[0.9] tracking-tighter">
                        Happy Guests,<br />
                        Unforgettable<br />
                        Stories
                    </h2>

                    <p className="text-lg sm:text-xl font-medium text-white/70 mb-12 max-w-sm leading-relaxed">
                        The travel experiences shaping the memories of our adventurers in Ourika.
                    </p>

                    <Link
                        href="/about"
                        className="group inline-flex items-center gap-3 bg-[#00ef9d] text-[#004f32] px-10 py-5 rounded-full font-black text-lg transition-all hover:scale-105 hover:bg-[#00dd8e] shadow-xl w-fit"
                    >
                        Read their stories
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
