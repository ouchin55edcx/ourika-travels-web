"use client";

import Image from "next/image";
import { Heart, ChevronRight, ChevronLeft } from "lucide-react";

const experiences = [
    {
        id: 1,
        title: "Day Trip To Ourika Valley from Marrakech",
        image: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=800&auto=format&fit=crop",
        rating: 4.7,
        reviews: 1086,
        price: 31,
    },
    {
        id: 2,
        title: "Setti Fatma Waterfalls Guided Hike",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
        rating: 4.8,
        reviews: 352,
        price: 16,
    },
    {
        id: 3,
        title: "Traditional Berber Cooking Class & Lunch",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop",
        rating: 4.8,
        reviews: 64,
        price: 45,
    },
    {
        id: 4,
        title: "Private Ourika Valley Tour with Luxury Car",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
        rating: 4.9,
        reviews: 23,
        price: 148,
    },
    {
        id: 5,
        title: "Quad Bike Adventure in Atlas Mountains",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
        rating: 4.6,
        reviews: 120,
        price: 55,
    },
    {
        id: 6,
        title: "Sunrise Hot Air Balloon over Ourika",
        image: "https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=800&auto=format&fit=crop",
        rating: 4.9,
        reviews: 89,
        price: 199,
    },
    {
        id: 7,
        title: "Botanical Garden Bio-Aromatique Visit",
        image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=800&auto=format&fit=crop",
        rating: 4.7,
        reviews: 45,
        price: 12,
    },
    {
        id: 8,
        title: "Sunset Camel Ride in the Heart of Ourika",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
        rating: 4.5,
        reviews: 210,
        price: 25,
    },
];

const RatingBubbles = ({ rating }: { rating: number }) => {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={`w-3.2 h-3.2 rounded-full border border-[#00aa6c] ${i < Math.floor(rating) ? "bg-[#00aa6c]" : "bg-white"
                        } ${i === Math.floor(rating) && rating % 1 !== 0 ? "relative overflow-hidden" : ""}`}
                >
                    {/* Partial fill logic for simple bubble representation */}
                    {i === Math.floor(rating) && rating % 1 !== 0 && (
                        <div className="absolute inset-0 bg-[#00aa6c]" style={{ width: `${(rating % 1) * 100}%` }} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default function Experiences() {
    return (
        <section id="experiences-section" className="w-full max-w-7xl mx-auto px-6 py-10 md:py-16">
            <div className="flex justify-between items-end mb-8 md:mb-10">
                <div className="max-w-xl">
                    <h2 className="text-2xl md:text-[28px] font-black text-black mb-1 md:mb-2 leading-tight">Unforgettable travel experiences in Ourika</h2>
                    <p className="text-gray-600 text-sm md:text-[15px] font-medium opacity-80">Can’t-miss picks for your next adventure</p>
                </div>
                <div className="hidden lg:flex gap-2 mb-1">
                    <button className="p-2.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 lg:pb-0 lg:grid lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10 hide-scrollbar">
                {experiences.map((exp) => (
                    <div key={exp.id} className="min-w-[85%] md:min-w-[45%] lg:min-w-0 snap-center group cursor-pointer">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                            <Image
                                src={exp.image}
                                alt={exp.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 85vw, (max-width: 1200px) 45vw, 25vw"
                            />
                            <button className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white text-black shadow-sm transition-colors group/heart">
                                <Heart className="w-5 h-5 group-hover/heart:fill-red-500 group-hover/heart:text-red-500 transition-all" />
                            </button>
                        </div>

                        <div className="space-y-1.5">
                            <h3 className="text-base md:text-[17px] font-bold text-[#2c2c2c] leading-snug group-hover:underline line-clamp-2">
                                {exp.title}
                            </h3>

                            <div className="flex items-center gap-1.5">
                                <span className="text-sm font-bold text-[#2c2c2c]">{exp.rating}</span>
                                <RatingBubbles rating={exp.rating} />
                                <span className="text-xs md:text-sm text-gray-500 font-medium">({exp.reviews.toLocaleString()})</span>
                            </div>

                            <p className="text-sm md:text-base font-bold text-black pt-1">
                                from ${exp.price} per adult
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            {/* View More Button for mobile */}
            <div className="mt-8 flex justify-center lg:hidden">
                <button className="w-full md:w-auto px-8 py-4 rounded-full border-[1.5px] border-black font-bold text-sm lg:text-[15px] hover:bg-gray-50 active:scale-95 transition-all">
                    Show all experiences
                </button>
            </div>
        </section>
    );
}
