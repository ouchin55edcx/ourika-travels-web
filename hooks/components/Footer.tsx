import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, ChevronDown, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="ml-2 w-full border-t border-gray-200 bg-[#faf1ed]/30 pt-10 pb-6 md:mx-auto md:ml-0 md:max-w-7xl md:pt-16 md:pb-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Top Section: Links Grid */}
        <div className="mb-10 grid grid-cols-2 gap-6 md:mb-16 md:grid-cols-3 md:gap-8">
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
        <div className="flex flex-col items-start justify-between gap-8 border-t border-gray-200 pt-8 md:gap-10 md:pt-10 lg:flex-row">
          <div className="flex max-w-2xl flex-col gap-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-xl font-black tracking-tighter text-[#0a2e1a]">
                Ourika Travels
              </Link>
              <span className="mt-1 text-[10px] font-medium text-gray-500">
                © 2026 Ourika Travels LLC All rights reserved.
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link
                href="/about"
                className="text-[11px] font-bold text-black underline-offset-4 hover:underline"
              >
                Terms of Use
              </Link>
              <Link
                href="/about"
                className="text-[11px] font-bold text-black underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="mailto:contact@ourikatravels.com"
                className="text-[11px] font-bold text-black underline-offset-4 hover:underline"
              >
                Contact us
              </Link>
            </div>

            <p className="mt-1 text-[10px] leading-relaxed text-gray-500 md:text-[11px]">
              Ourika Travels is a local guide association based in Setti Fatma, Ourika Valley,
              Morocco. We connect travelers with certified local Berber guides for authentic Atlas
              Mountain experiences.
            </p>
          </div>

          <div className="flex w-full flex-col items-end gap-4 md:gap-6 lg:w-auto">
            <div className="flex gap-3">
              <button className="flex min-w-[100px] items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-black transition-colors hover:border-black md:min-w-[120px] md:px-4 md:py-2.5 md:text-sm">
                <span>MAD</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 md:h-4 md:w-4" />
              </button>
              <button className="flex min-w-[130px] items-center justify-between gap-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-black transition-colors hover:border-black md:min-w-[160px] md:px-4 md:py-2.5 md:text-sm">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Morocco</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 opacity-60 md:h-4 md:w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <Facebook className="h-4 w-4 cursor-pointer text-black transition-colors hover:text-[#0a2e1a] md:h-5 md:w-5" />
              <Twitter className="h-4 w-4 cursor-pointer text-black transition-colors hover:text-[#0a2e1a] md:h-5 md:w-5" />
              <Instagram className="h-4 w-4 cursor-pointer text-black transition-colors hover:text-[#0a2e1a] md:h-5 md:w-5" />
              <Youtube className="h-4 w-4 cursor-pointer text-black transition-colors hover:text-[#0a2e1a] md:h-5 md:w-5" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
