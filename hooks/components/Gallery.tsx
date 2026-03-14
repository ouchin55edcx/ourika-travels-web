"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Maximize2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const galleryImages = [
    {
        url: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200&auto=format&fit=crop",
        title: "Ourika Waterfalls",
        span: "md:col-span-2 md:row-span-2",
    },
    {
        url: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200&auto=format&fit=crop",
        title: "Berber Tea Ceremony",
        span: "md:col-span-2 md:row-span-1",
    },
    {
        url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200&auto=format&fit=crop",
        title: "Atlas Mountain Village",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        url: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=1200&auto=format&fit=crop",
        title: "Hot Air Balloon",
        span: "md:col-span-1 md:row-span-1",
    },
];


export default function Gallery() {
    const { elementRef, isVisible } = useScrollReveal(0.1);

    return (
        <section ref={elementRef as any} className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
            <div className={`reveal mb-16 flex flex-col items-center text-center ${isVisible ? "reveal-visible" : ""}`}>
                <p className="mb-4 text-xs font-black tracking-[0.2em] text-[#00ef9d] uppercase">
                    Visual Journey
                </p>
                <h2 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-[#004f32] md:text-6xl">
                    Moments from the Valley
                </h2>
                <p className="mx-auto max-w-2xl text-lg font-medium text-gray-500">
                    A glimpse into the breathtaking landscapes and authentic local life awaiting you in Ourika.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:grid-rows-2 md:h-[500px]">

                {galleryImages.map((image, index) => (
                    <div
                        key={index}
                        className={`reveal group relative overflow-hidden rounded-[2.5rem] shadow-lg transition-all duration-700 ${image.span} ${isVisible ? "reveal-visible" : ""}`}
                        style={{ transitionDelay: `${index * 100}ms` }}
                    >
                        <Image
                            src={image.url}
                            alt={image.title}
                            fill
                            className="object-cover saturate-[0.8] transition-all duration-1000 group-hover:scale-110 group-hover:saturate-100"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="absolute bottom-10 left-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <h3 className="text-xl font-black text-white">{image.title}</h3>
                            <div className="mt-2 flex items-center gap-2 text-xs font-bold text-[#00ef9d] uppercase tracking-widest">
                                <Maximize2 className="h-4 w-4" />
                                View Photo
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`reveal mt-20 flex flex-col items-center gap-6 text-center ${isVisible ? "reveal-visible" : ""}`}>
                <h3 className="text-3xl font-black text-[#004f32]">Ready to create your own memories?</h3>
                <Link
                    href="/experiences"
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#0b3a2c] px-12 py-5 text-lg font-black text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
                >
                    <span className="relative z-10">Find your experience</span>
                    <ChevronRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </Link>
            </div>
        </section>
    );
}
