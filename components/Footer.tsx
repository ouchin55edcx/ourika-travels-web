import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, ChevronDown, Globe } from "lucide-react";

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
    <footer className="w-full border-t border-gray-200 bg-[#faf1ed]/30 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top Section: Links Grid */}
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h4 className="mb-1 text-[15px] font-black text-black">{section.title}</h4>
              {section.links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[13px] font-medium text-gray-600 transition-all hover:text-black hover:underline"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom Section: Branding & Utilities */}
        <div className="flex flex-col items-start justify-between gap-10 border-t border-gray-200 pt-10 lg:flex-row">
          <div className="flex max-w-2xl flex-col gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-xl font-black tracking-tighter text-[#004f32]">
                Ourika Travels
              </Link>
              <span className="mt-1 text-[11px] font-medium text-gray-500">
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
                  className="text-[12px] font-bold text-black underline-offset-4 hover:underline"
                >
                  {legal}
                </Link>
              ))}
            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
              This is the Moroccan version of our website addressed to speakers of Arabic and French
              in Morocco. If you are a resident of another country or region, please select the
              appropriate version of Ourika Travels for your country or region in the drop-down
              menu.{" "}
              <span className="cursor-pointer font-bold text-gray-500 underline">Read more</span>
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
              <Facebook className="h-5 w-5 cursor-pointer text-black transition-colors hover:text-[#004f32]" />
              <Twitter className="h-5 w-5 cursor-pointer text-black transition-colors hover:text-[#004f32]" />
              <Instagram className="h-5 w-5 cursor-pointer text-black transition-colors hover:text-[#004f32]" />
              <Youtube className="h-5 w-5 cursor-pointer text-black transition-colors hover:text-[#004f32]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
