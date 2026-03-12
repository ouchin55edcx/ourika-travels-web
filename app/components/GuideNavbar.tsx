"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Compass, Menu, X, ArrowRight, UserPlus } from "lucide-react";

export default function GuideNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "How it works", href: "#how-it-works" },
        { name: "Benefits", href: "#benefits" },
        { name: "Global Community", href: "#community" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${isScrolled
                ? "py-3 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-md translate-y-0 opacity-100"
                : "py-3 bg-transparent -translate-y-full opacity-0 pointer-events-none"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center transition-all duration-500 ease-in-out">
                    <Link
                        href="/"
                        className="text-[24px] md:text-[28px] font-black text-[#004f32] tracking-[-0.04em] whitespace-nowrap"
                    >
                        Ourika Travels
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-black text-[#004f32] uppercase tracking-widest hover:text-[#00aa6c] transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:flex items-center gap-6">
                    <Link
                        href="/register/guide"
                        className="group flex items-center gap-3 bg-[#004f32] text-white px-8 py-3.5 rounded-full font-black text-sm transition-all hover:scale-105 hover:bg-[#003a25] shadow-xl"
                    >
                        Start Hosting
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-[#004f32] hover:bg-gray-100 rounded-xl transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 top-[72px] bg-white z-[90] md:hidden transform transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-8 flex flex-col gap-8 h-full">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-3xl font-black text-[#004f32] tracking-tighter"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="mt-auto pb-12">
                        <Link
                            href="/register/guide"
                            className="flex items-center justify-center gap-4 bg-[#004f32] text-white py-6 rounded-[2rem] font-black text-xl shadow-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <UserPlus className="w-6 h-6" />
                            Join Guide Community
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
