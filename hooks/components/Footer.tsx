import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, ChevronDown, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-[#faf1ed]/30 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top Section: Links Grid */}
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-3">
          {/* About Column */}
          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-[15px] font-black text-black">About Ourika Travels</h4>
            <Link
              href="mailto:contact@ourikatravels.com"
              className="text-[13px] font-medium text-gray-600 transition-all hover:text-black hover:underline"
            >
              Contact us
            </Link>
          </div>

          {/* Explore Column */}
          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-[15px] font-black text-black">Explore</h4>
            <Link
              href="/experiences"
              className="text-[13px] font-medium text-gray-600 transition-all hover:text-black hover:underline"
            >
              Experiences
            </Link>
            <Link
              href="/wishlist"
              className="text-[13px] font-medium text-gray-600 transition-all hover:text-black hover:underline"
            >
              Wishlist
            </Link>
            <Link
              href="/reservation-historic"
              className="text-[13px] font-medium text-gray-600 transition-all hover:text-black hover:underline"
            >
              My Bookings
            </Link>
          </div>

          {/* Do Business With Us Column */}
          <div className="flex flex-col gap-3">
            <h4 className="mb-1 text-[15px] font-black text-black">Do Business With Us</h4>
            <Link
              href="/register/guide"
              className="text-[13px] font-medium text-gray-600 transition-all hover:text-black hover:underline"
            >
              Become a Guide
            </Link>
          </div>
        </div>

        {/* Bottom Section: Branding & Utilities */}
        <div className="flex flex-col items-start justify-between gap-10 border-t border-gray-200 pt-10 lg:flex-row">
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-xl font-black tracking-tighter text-[#0a2e1a]">
                Ourika Travels
              </Link>
              <span className="mt-1 text-[11px] font-medium text-gray-500">
                © 2026 Ourika Travels LLC All rights reserved.
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link
                href="/about"
                className="text-[12px] font-bold text-black underline-offset-4 hover:underline"
              >
                Terms of Use
              </Link>
              <Link
                href="/about"
                className="text-[12px] font-bold text-black underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="mailto:contact@ourikatravels.com"
                className="text-[12px] font-bold text-black underline-offset-4 hover:underline"
              >
                Contact us
              </Link>
            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-gray-500">
              Ourika Travels is a local guide association based in Setti Fatma, Ourika Valley,
              Morocco. We connect travelers with certified local Berber guides for authentic Atlas
              Mountain experiences.
            </p>
          </div>

          <div className="flex w-full flex-col items-end gap-6 lg:w-auto">
            <div className="flex gap-4">
              <button className="flex min-w-[120px] items-center justify-between gap-4 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-black transition-colors hover:border-black">
                <span>MAD</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>
              <button className="flex min-w-[160px] items-center justify-between gap-4 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-bold text-black transition-colors hover:border-black">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>Morocco</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <Facebook className="h-5 w-5 cursor-pointer text-black transition-colors hover:text-[#0a2e1a]" />
              <Twitter className="h-5 w-5 cursor-pointer text-black transition-colors hover:text-[#0a2e1a]" />
              <Instagram className="h-5 w-5 cursor-pointer text-black transition-colors hover:text-[#0a2e1a]" />
              <Youtube className="h-5 w-5 cursor-pointer text-black transition-colors hover:text-[#0a2e1a]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
