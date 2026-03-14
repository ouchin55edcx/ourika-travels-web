"use client";

import { Star, Quote } from "lucide-react";
import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const reviews = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Adventure Enthusiast",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        rating: 5,
        text: "The Ourika Valley trek was life-changing. Our guide was incredibly knowledgeable and the local Berber lunch was the best meal I've had in Morocco!",
        date: "February 2025",
    },
    {
        id: 2,
        name: "Marc Dupont",
        role: "Nature Photographer",
        avatar: "https://i.pravatar.cc/150?u=marc",
        rating: 5,
        text: "As a photographer, the landscapes here are unmatched. The Setti Fatma waterfalls at sunrise are a dream. Perfectly organized trip!",
        date: "January 2025",
    },
    {
        id: 3,
        name: "Elena Rodriguez",
        role: "Solo Traveler",
        avatar: "https://i.pravatar.cc/150?u=elena",
        rating: 4,
        text: "I felt so safe and welcomed. The cultural immersion in the villages was authentic, not just a tourist trap. Highly recommend Ourika Travels!",
        date: "March 2025",
    },
];

export default function Reviews() {
    const { elementRef, isVisible } = useScrollReveal(0.1);

    return (
        <section ref={elementRef as any} className="mx-auto w-full max-w-7xl px-6 py-24 md:py-32">
            <div className={`reveal mb-16 text-center ${isVisible ? "reveal-visible" : ""}`}>
                <p className="mb-4 text-xs font-black tracking-[0.2em] text-[#00ef9d] uppercase">
                    Guest Testimonials
                </p>
                <h2 className="mb-6 text-4xl leading-[0.9] font-black tracking-tighter text-[#004f32] md:text-6xl">
                    What Our Travelers Say
                </h2>
                <p className="mx-auto max-w-2xl text-lg font-medium text-gray-500">
                    Real stories from people who explored the hidden gems of the Atlas Mountains with our local experts.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {reviews.map((review, index) => (
                    <div
                        key={review.id}
                        className={`reveal group relative rounded-[3rem] border border-black/5 bg-white p-10 shadow-xl transition-all duration-700 hover:shadow-2xl ${isVisible ? "reveal-visible" : ""}`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                    >
                        <div className="absolute top-10 right-10 text-gray-50 opacity-10 transition-opacity group-hover:opacity-20">
                            <Quote className="h-16 w-16 fill-current" />
                        </div>

                        <div className="mb-6 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                                />
                            ))}
                        </div>

                        <p className="mb-10 text-lg leading-relaxed font-medium italic text-gray-700">
                            "{review.text}"
                        </p>

                        <div className="flex items-center gap-4 border-t border-gray-50 pt-8">
                            <div className="relative h-12 w-12 overflow-hidden rounded-2xl">
                                <Image
                                    src={review.avatar}
                                    alt={review.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div>
                                <h4 className="font-black text-[#004f32]">{review.name}</h4>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{review.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
