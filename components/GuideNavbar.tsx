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
      className={`fixed top-0 right-0 left-0 z-[100] transition-all duration-500 ease-in-out ${
        isScrolled
          ? "translate-y-0 border-b border-gray-100 bg-white/90 py-3 opacity-100 shadow-md backdrop-blur-xl"
          : "pointer-events-none -translate-y-full bg-transparent py-3 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo Section */}
        <div className="flex items-center transition-all duration-500 ease-in-out">
          <Link
            href="/"
            className="text-[24px] font-black tracking-[-0.04em] whitespace-nowrap text-[#004f32] md:text-[28px]"
          >
            Ourika Travels
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-black tracking-widest text-[#004f32] uppercase transition-colors hover:text-[#00aa6c]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/register/guide"
            className="group flex items-center gap-3 rounded-full bg-[#004f32] px-8 py-3.5 text-sm font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-[#003a25]"
          >
            Start Hosting
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="rounded-xl p-2 text-[#004f32] transition-colors hover:bg-gray-100 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 top-[72px] z-[90] transform bg-white transition-transform duration-500 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col gap-8 p-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-3xl font-black tracking-tighter text-[#004f32]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-auto pb-12">
            <Link
              href="/register/guide"
              className="flex items-center justify-center gap-4 rounded-[2rem] bg-[#004f32] py-6 text-xl font-black text-white shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <UserPlus className="h-6 w-6" />
              Join Guide Community
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
