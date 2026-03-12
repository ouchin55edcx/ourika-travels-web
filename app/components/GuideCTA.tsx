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
            className="w-full max-w-7xl mx-auto px-6 py-16 md:py-24 xl:py-32"
        >
            <div className={`relative bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                <div className="flex flex-col lg:flex-row">
                    {/* Content Section */}
                    <div className="w-full lg:w-[55%] p-10 sm:p-16 lg:p-24 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#004f32]/5 text-[#004f32] text-[10px] font-black uppercase tracking-widest mb-10 border border-[#004f32]/10 w-fit">
                            <Compass className="w-3 h-3" />
                            Community for Locals
                        </div>

                        <h2 className="text-5xl sm:text-7xl font-black text-[#004f32] mb-10 leading-[0.9] tracking-tighter">
                            Do you know<br />
                            Ourika like <br />
                            no one else?
                        </h2>

                        <p className="text-lg sm:text-xl text-gray-500 mb-12 max-w-md font-medium leading-relaxed">
                            Join our community of local guides. Share your stories, host unique experiences, and earn by doing what you love.
                        </p>

                        <div className="flex flex-wrap gap-10 mb-12">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-[#004f32] font-black">
                                    <Star className="w-4 h-4 fill-[#00ef9d] text-[#00ef9d]" />
                                    <span className="text-lg tracking-tight">Top visibility</span>
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Get booked faster</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-[#004f32] font-black">
                                    <ShieldCheck className="w-4 h-4 text-[#00ef9d]" />
                                    <span className="text-lg tracking-tight">Secure payouts</span>
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Peace of mind</p>
                            </div>
                        </div>

                        <Link
                            href="/register/guide"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 bg-[#004f32] text-white px-12 py-5 rounded-full font-black text-lg transition-all hover:scale-105 hover:bg-[#003a25] shadow-xl w-fit"
                        >
                            Become a Guide
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Image Section */}
                    <div className="w-full lg:w-[45%] relative min-h-[400px] lg:min-h-0 bg-gray-100">
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
                        <div className="absolute top-10 right-10 bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-2xl border border-white/20 hidden sm:block">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#00ef9d] flex items-center justify-center text-[#004f32]">
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Guide of the month</p>
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
