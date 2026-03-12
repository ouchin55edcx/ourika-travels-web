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
            className="w-full pb-0"
        >
            <div className={`bg-[#004f32] overflow-hidden flex flex-col lg:flex-row shadow-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                {/* Image Section */}
                <div className={`w-full lg:w-[40%] relative h-[300px] lg:h-auto overflow-hidden`}>
                    <Image
                        src="https://images.unsplash.com/photo-1531058020387-3be344556be6?q=80&w=1200&auto=format&fit=crop"
                        alt="Happy tourist enjoying Ourika"
                        fill
                        className="object-cover saturate-[0.8]"
                        sizes="(max-width: 1024px) 100vw, 45vw"
                    />
                </div>

                {/* Content Section */}
                <div className={`w-full lg:w-[60%] p-8 sm:p-12 lg:p-16 xl:p-20 flex flex-col justify-center text-white`}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-[#00ef9d] flex items-center justify-center p-1.5 shadow-sm shrink-0">
                            <div className="w-full h-full rounded-full border-2 border-[#004f32] flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#004f32]"></div>
                            </div>
                        </div>
                        <span className="text-[12px] font-black tracking-[0.2em] uppercase opacity-90">Traveler Testimonials</span>
                    </div>

                    <h2 className="text-4xl sm:text-6xl font-black mb-6 leading-[1] tracking-tighter">
                        Real Guest Ourika Stories
                    </h2>

                    <p className="text-lg font-medium text-white/70 mb-10 max-w-md leading-relaxed">
                        See how the stunning landscapes and warm Berber hospitality of the Atlas Mountains leave a lasting impression.
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
