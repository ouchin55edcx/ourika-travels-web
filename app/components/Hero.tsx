"use client";

import { SearchIcon, MapPin, Compass, Clock, Star, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const popularDestinations = [
    {
        id: 1,
        name: "Setti Fatma Waterfalls",
        location: "Upper Ourika Valley, Morocco",
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "Berber Village Hike",
        location: "Oukaimeden Road, Morocco",
        image: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Bio-Aromatique Gardens",
        location: "Ourika Road, Marrakech",
        image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "Traditional Cooking Class",
        location: "Tnine Ourika, Morocco",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 5,
        name: "Zipline Adventure Park",
        location: "Terres d'Amanar, Morocco",
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=200&auto=format&fit=crop"
    },
];

export default function Hero() {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [results, setResults] = useState(popularDestinations);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (query.trim() === "") {
            setResults(popularDestinations);
        } else {
            const filtered = popularDestinations.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.location.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        }
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Dark Backdrop - Fixed to cover exact full viewport */}
            {isFocused && (
                <div
                    className="fixed inset-0 bg-black/5 backdrop-blur-md z-[80] animate-in fade-in duration-300"
                    onClick={() => setIsFocused(false)}
                />
            )}

            <div className={`flex flex-col items-center justify-center pt-10 pb-8 px-6 md:pt-20 md:pb-12 relative transition-all duration-300 ${isFocused ? 'z-[90]' : 'z-20'}`}>
                <h1 className={`text-4xl md:text-6xl font-black text-[#004f32] tracking-tight mb-8 md:mb-12 text-center transition-all duration-300 ${isFocused ? 'opacity-0 -translate-y-4' : 'opacity-100'}`}>
                    Where to?
                </h1>

                <div className="w-full max-w-4xl mx-auto px-4" ref={searchRef}>
                    <div className="relative">
                        {/* Unified Search Component */}
                        <div className="w-full relative">
                            {!isFocused ? (
                                /* Normal Pill State */
                                <div
                                    onClick={() => setIsFocused(true)}
                                    className="flex items-center bg-white border border-gray-100 shadow-xl md:shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-300 rounded-full p-1.5 md:p-2 pl-6 md:pl-8 h-16 md:h-20 cursor-pointer"
                                >
                                    <SearchIcon className="w-5 h-5 md:w-7 md:h-7 text-gray-400 mr-3 md:mr-5 shrink-0" />
                                    <div className="flex-1 text-base md:text-xl text-gray-400 font-medium truncate">
                                        Places to go, things to do, hotels...
                                    </div>
                                    <button className="bg-[#00ef9d] hover:bg-[#00dd8e] text-black font-black h-full px-6 md:px-14 rounded-full transition-all duration-300 text-base md:text-xl shadow-inner active:scale-95">
                                        Search
                                    </button>
                                </div>
                            ) : (
                                /* Expanded Box State - "The Design" */
                                <div className="absolute -top-6 left-0 right-0 bg-white rounded-[1.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-gray-100 overflow-hidden z-[100]">
                                    {/* Input Area */}
                                    <div className="flex items-center px-6 py-5 md:py-8">
                                        <SearchIcon className="w-5 h-5 md:w-6 md:h-6 text-[#004f32] stroke-[2.5px] mr-4 shrink-0" />
                                        <input
                                            autoFocus
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Places to go, things to do, hotels..."
                                            className="flex-1 text-base md:text-xl outline-none placeholder:text-gray-400 font-medium bg-transparent"
                                        />
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setIsFocused(false); }}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors ml-2"
                                        >
                                            <X className="w-6 h-6 text-gray-400" />
                                        </button>
                                    </div>

                                    {/* Divider Line */}
                                    <div className="w-full h-[1.5px] bg-[#004f32]" />

                                    {/* Dropdown Content */}
                                    <div className="max-h-[70vh] overflow-y-auto p-4 md:p-6 custom-scrollbar bg-white">
                                        {/* Sponsored Section */}
                                        {!query && (
                                            <div className="mb-8">
                                                <div className="flex items-center gap-5 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all group">
                                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                                                        <Image
                                                            src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=200&auto=format&fit=crop"
                                                            alt="Sponsored"
                                                            fill
                                                            className="object-cover transition-transform group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-[#004f32] text-[17px] md:text-lg leading-tight mb-1">Find your cultural wonder in Ourika</h4>
                                                        <p className="text-gray-500 text-[14px] md:text-[15px] font-medium">Sponsored by Ourika Tourism</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Content Section */}
                                        <div className="space-y-5">
                                            <h3 className="px-3 text-[17px] md:text-[18px] font-black text-[#004f32] tracking-normal">
                                                {query ? "Search Results" : "Popular Destinations"}
                                            </h3>

                                            <div className="grid gap-2">
                                                {results.length > 0 ? (
                                                    results.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center gap-5 px-3 py-3 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all group"
                                                        >
                                                            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-[#004f32] text-[17px] md:text-[18px]">
                                                                    {item.name}
                                                                </h4>
                                                                <p className="text-[14px] md:text-[15px] text-gray-500 font-medium truncate mt-0.5">
                                                                    {item.location}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-16 text-center">
                                                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <SearchIcon className="w-10 h-10 text-gray-300" />
                                                        </div>
                                                        <p className="text-gray-500 font-bold text-lg">No results found for "{query}"</p>
                                                        <p className="text-gray-400">Try common places like "Setti Fatma" or "Hike"</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #e5e7eb;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #d1d5db;
                    }
                `}</style>
            </div>
        </>
    );
}
