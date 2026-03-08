"use client";

import Link from "next/link";
import { Moon, Globe, Heart, ClipboardList, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="flex items-center justify-between px-6 py-1 bg-white border-b border-gray-100 md:px-16 sticky top-0 z-50">
            {/* Logo Section */}
            <div className="flex items-center">
                <Link href="/" className="text-[24px] md:text-[28px] font-black text-[#004f32] tracking-[-0.04em]">
                    Ourika Travels
                </Link>
            </div>

            {/* Desktop Actions Section - Hidden on smaller screens */}
            <div className="hidden lg:flex items-center gap-2">
                {/* Utilities: Globe/Language, Dark Mode */}
                <div className="flex items-center gap-1 pr-6">
                    <button className="flex items-center gap-2 text-[15px] font-bold text-[#004f32] hover:bg-gray-50 px-4 py-3 rounded-full transition-colors whitespace-nowrap">
                        <Globe className="w-5.5 h-5.5 stroke-[2.5px]" />
                        <span>MAD · EN</span>
                    </button>
                    <button className="p-3 text-[#004f32] hover:bg-gray-50 rounded-full transition-colors">
                        <Moon className="w-5.5 h-5.5 stroke-[2.5px]" />
                    </button>
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-12 bg-gray-200" />

                {/* Account Actions: Wishlist, Reservations, Sign In */}
                <div className="flex items-center gap-1 pl-6">
                    <button className="flex flex-col items-center gap-1.5 px-4 py-2 hover:bg-gray-50 rounded-2xl transition-all group">
                        <Heart className="w-6 h-6 text-[#004f32] stroke-[2.5px] group-hover:fill-[#004f32] transition-all" />
                        <span className="text-[11px] font-bold text-[#004f32]">Wishlist</span>
                    </button>

                    <button className="flex flex-col items-center gap-1.5 px-4 py-2 hover:bg-gray-50 rounded-2xl transition-all group">
                        <ClipboardList className="w-6 h-6 text-[#004f32] stroke-[2.5px] group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-[#004f32]">Reservations</span>
                    </button>

                    <button className="bg-[#004f32] text-white px-9 py-4 rounded-full font-black text-[15px] hover:bg-[#003d27] transition-all shadow-sm active:scale-95 ml-2">
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

