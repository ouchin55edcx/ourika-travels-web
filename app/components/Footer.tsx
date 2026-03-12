"use client";

import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronDown,
  Globe,
} from "lucide-react";

const footerLinks = [
  {
    title: "About Ourika Travels",
    links: [
      { name: "About Us", href: "#" },
      { name: "Press", href: "#" },
      { name: "Resources and Policies", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Trust & Safety", href: "#" },
      { name: "Contact us", href: "#" },
      { name: "Accessibility Statement", href: "#" },
    ],
  },
  {
    title: "Explore",
    links: [
      { name: "Write a review", href: "#" },
      { name: "Add a Place", href: "#" },
      { name: "Join Ourika Club", href: "#" },
      { name: "Travelers' Choice", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Travel Stories", href: "#" },
    ],
  },
  {
    title: "Do Business With Us",
    links: [
      { name: "Become a Guide", href: "/register/guide" },
      { name: "Property Owners", href: "#" },
      { name: "Business Advantage", href: "#" },
      { name: "Sponsored Placements", href: "#" },
      { name: "Advertise with Us", href: "#" },
      { name: "Access our Content API", href: "#" },
    ],
  },
  {
    title: "Our Network",
    links: [
      { name: "Berber Village Tours", href: "#" },
      { name: "Atlas Mountains Guide", href: "#" },
      { name: "Local Handicrafts", href: "#" },
      { name: "Sustainable Travel", href: "#" },
      { name: "Eco-Tourism", href: "#" },
      { name: "Private Experiences", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-[#faf1ed]/30 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 mb-16">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h4 className="text-[15px] font-black text-black mb-1">
                {section.title}
              </h4>
              {section.links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[13px] font-medium text-gray-600 hover:text-black hover:underline transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Section: Branding & Utilities */}
        <div className="pt-10 border-t border-gray-200 flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="flex flex-col gap-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-xl font-black text-[#004f32] tracking-tighter"
              >
                Ourika Travels
              </Link>
              <span className="text-[11px] font-medium text-gray-500 mt-1">
                © 2026 Ourika Travels LLC All rights reserved.
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {[
                "Terms of Use",
                "Privacy and Cookies Statement",
                "Cookie consent",
                "How the site works",
                "Contact us",
                "Accessibility Statement",
              ].map((legal) => (
                <Link
                  key={legal}
                  href="#"
                  className="text-[12px] font-bold text-black hover:underline underline-offset-4"
                >
                  {legal}
                </Link>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
              This is the Moroccan version of our website addressed to speakers
              of Arabic and French in Morocco. If you are a resident of another
              country or region, please select the appropriate version of Ourika
              Travels for your country or region in the drop-down menu.{" "}
              <span className="underline font-bold text-gray-500 cursor-pointer">
                Read more
              </span>
            </p>
          </div>

          <div className="flex flex-col items-end gap-6 w-full lg:w-auto">
            <div className="flex gap-4">
              <button className="flex items-center gap-4 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-bold text-black hover:border-black transition-colors min-w-[120px] justify-between">
                <span>MAD</span>
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
              <button className="flex items-center gap-4 bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-bold text-black hover:border-black transition-colors min-w-[160px] justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Morocco</span>
                </div>
                <ChevronDown className="w-4 h-4 opacity-60" />
              </button>
            </div>

            <div className="flex gap-4 items-center">
              <Facebook className="w-5 h-5 text-black hover:text-[#004f32] cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-black hover:text-[#004f32] cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-black hover:text-[#004f32] cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-black hover:text-[#004f32] cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
