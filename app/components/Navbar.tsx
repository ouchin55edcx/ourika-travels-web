"use client";

import Link from "next/link";
import { Moon, Globe, Heart, ClipboardList, Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSearchBar, setShowSearchBar] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const experiencesSection = document.getElementById("experiences-section");
            if (experiencesSection) {
                const rect = experiencesSection.getBoundingClientRect();
                // Show search bar when the Experiences section top reaches middle of viewport or above
                if (rect.top <= 100) {
                    setShowSearchBar(true);
                } else {
                    setShowSearchBar(false);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="flex items-center justify-between px-6 py-2 bg-white border-b border-gray-100 md:px-16 sticky top-0 z-50">
            {/* Logo Section */}
            <div className={`flex items-center transition-all duration-500 ease-in-out ${showSearchBar ? 'lg:w-[180px] opacity-100' : 'opacity-100'}`}>
                <Link href="/" className="text-[24px] md:text-[28px] font-black text-[#004f32] tracking-[-0.04em] whitespace-nowrap">
                    Ourika Travels
                </Link>
            </div>

            {/* Search Bar - Hidden by default, appears on scroll to Experiences section */}
            <div className={`hidden lg:flex flex-1 justify-center px-4 transition-all duration-500 ease-out ${showSearchBar ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95 pointer-events-none'}`}>
                <div className="flex items-center w-full max-w-[380px] bg-white border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-full py-1.5 px-2 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all cursor-pointer border-gray-200/60 group/search">
                    <div className="flex-1 px-4 text-[14px] font-bold text-gray-800 truncate">
                        Start your search
                    </div>
                    <div className="bg-[#004f32] p-2 rounded-full text-white group-hover/search:scale-105 transition-transform duration-300">
                        <Search className="w-3.5 h-3.5 stroke-[4px]" />
                    </div>
                </div>
            </div>

            {/* Desktop Actions Section - Hidden on smaller screens */}
            <div className={`hidden lg:flex items-center gap-2 transition-all duration-500 ${showSearchBar ? 'lg:w-[320px] justify-end' : ''}`}>
                {/* Utilities: Globe/Language, Dark Mode */}
                <div className="flex items-center gap-1">
                    <button className="flex items-center gap-2 text-[15px] font-bold text-[#004f32] hover:bg-gray-50 px-3 py-3 rounded-full transition-colors whitespace-nowrap">
                        <Globe className="w-5.5 h-5.5 stroke-[2.5px]" />
                        <span className={`${showSearchBar ? 'hidden xl:inline' : 'inline'}`}>MAD · EN</span>
                    </button>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-12 bg-gray-200" />

                {/* Account Actions: Wishlist, Reservations, Sign In */}
                <div className={`flex items-center gap-1 transition-all duration-500 ${showSearchBar ? 'pl-4' : 'pl-6'}`}>
                    <button className="flex flex-col items-center justify-center gap-1.5 px-4 py-2 hover:bg-gray-50 rounded-2xl transition-all group min-w-[64px]">
                        <Heart className="w-6 h-6 text-[#004f32] stroke-[2.5px] group-hover:fill-[#004f32] transition-all" />
                        {!showSearchBar && <span className="text-[11px] font-bold text-[#004f32]">Wishlist</span>}
                    </button>

                    <button className="flex flex-col items-center justify-center gap-1.5 px-4 py-2 hover:bg-gray-50 rounded-2xl transition-all group min-w-[64px]">
                        <ClipboardList className="w-6 h-6 text-[#004f32] stroke-[2.5px] group-hover:scale-110 transition-transform" />
                        {!showSearchBar && <span className="text-[11px] font-bold text-[#004f32]">Reservations</span>}
                    </button>

                    <button className="bg-[#004f32] text-white px-8 py-3.5 rounded-full font-black text-[15px] hover:bg-[#003d27] transition-all shadow-sm active:scale-95 ml-2 whitespace-nowrap">
                        Sign In
                    </button>
                </div>
            </div>

            {/* Mobile Actions/Toggle - Visible only on smaller screens */}
            <div className="flex lg:hidden items-center gap-4">
                <button className="p-2 text-[#004f32] hover:bg-gray-50 rounded-full transition-colors">
                    <Globe className="w-6 h-6 stroke-[2.5px]" />
                </button>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-[#004f32] hover:bg-gray-50 rounded-full transition-colors z-50"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed inset-0 bg-white z-40 lg:hidden transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full pt-24 px-6 gap-8">
                    {/* Primary Links */}
                    <div className="flex flex-col gap-6">
                        <button className="flex items-center gap-4 text-2xl font-bold text-[#004f32]">
                            <Heart className="w-8 h-8 stroke-[2.5px]" />
                            Wishlist
                        </button>
                        <button className="flex items-center gap-4 text-2xl font-bold text-[#004f32]">
                            <ClipboardList className="w-8 h-8 stroke-[2.5px]" />
                            Reservations
                        </button>
                    </div>

                    <div className="w-full h-[1px] bg-gray-100" />

                    {/* Secondary/Settings */}
                    <div className="flex flex-col gap-6">
                        <button className="flex items-center gap-4 text-xl font-medium text-[#004f32]">
                            <Globe className="w-6 h-6 stroke-[2px]" />
                            <span>Language: EN</span>
                        </button>
                        <button className="flex items-center gap-4 text-xl font-medium text-[#004f32]">
                            <Moon className="w-6 h-6 stroke-[2px]" />
                            <span>Dark Mode</span>
                        </button>
                    </div>

                    {/* Sign In Button at bottom */}
                    <div className="mt-auto pb-12">
                        <button className="w-full bg-[#004f32] text-white py-5 rounded-full font-black text-xl shadow-lg active:scale-95 transition-all">
                            Sign In
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile menu */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </nav>
    );
}

