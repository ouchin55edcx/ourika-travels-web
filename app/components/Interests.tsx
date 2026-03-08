"use client";

import Image from "next/image";

const interests = [
    { title: "Outdoors", image: "/interests/outdoors.png" },
    { title: "Food", image: "/interests/food.png" },
    { title: "Culture", image: "/interests/culture.png" },
    { title: "Water", image: "/interests/water.png" },
];

export default function Interests() {
    return (
        <section className="w-full max-w-7xl mx-auto px-6 py-10 md:py-16">
            <div className="mb-8 md:mb-12 text-left">
                <h2 className="text-3xl md:text-4xl font-black text-black mb-2 md:mb-3">Find things to do by interest</h2>
                <p className="text-gray-600 text-base md:text-lg font-medium opacity-80">Whatever you're into, we've got it</p>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-5 pb-6 lg:pb-0 lg:grid lg:grid-cols-4 lg:gap-6 hide-scrollbar">
                {interests.map((interest) => (
                    <div
                        key={interest.title}
                        className="min-w-[85%] md:min-w-[45%] lg:min-w-0 snap-center group relative h-[400px] md:h-[450px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
                    >
                        <Image
                            src={interest.image}
                            alt={interest.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                        <div className="absolute bottom-8 left-8 right-8">
                            <h3 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
                                {interest.title}
                            </h3>
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
        </section>
    );
}
