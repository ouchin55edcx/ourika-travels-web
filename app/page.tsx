import type { Metadata } from "next";
import { Suspense } from "react";

import NavbarWrapper from "@/app/components/NavbarWrapper";
import { getCategories } from "@/app/actions/categories";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Interests from "@/components/Interests";
import Experiences from "@/components/Experiences";
import Reviews from "@/components/Reviews";
import TouristHighlight from "@/components/TouristHighlight";
import { BASE_URL, SITE_NAME } from "@/lib/config";
import { createSupabasePublicClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Ourika Travels — Authentic Local Treks & Experiences in Ourika Valley, Morocco",
  description:
    "Book guided treks, Berber village tours, and waterfall hikes in Ourika Valley with certified local guides. Small groups, authentic experiences, unforgettable memories — from Setti Fatma.",
  keywords: [
    "Ourika Valley tours",
    "Setti Fatma waterfall hike",
    "Atlas Mountains guided tour",
    "Berber village trek Morocco",
    "Ourika Valley day trip from Marrakech",
    "local guide Ourika Valley",
    "things to do Ourika Valley",
    "Morocco trekking",
  ],
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "Ourika Travels — Authentic Local Treks in Ourika Valley",
    description:
      "Certified local guides. Small groups. Real Berber culture. Book your Ourika Valley experience today.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ourika Valley trekking experience",
      },
    ],
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ourika Travels — Authentic Ourika Valley Experiences",
    description:
      "Book with local certified guides. Atlas Mountains, Berber villages, Setti Fatma waterfalls.",
    images: [`${BASE_URL}/og-image.jpg`],
  },
  alternates: { canonical: BASE_URL },
};

const sectionFallback = (
  <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24 xl:py-32">
    <div className="h-64 animate-pulse rounded-3xl bg-gray-100" />
  </div>
);

async function HomeInterestsSection() {
  const categories = await getCategories();
  return <Interests initialCategories={categories} />;
}

async function HomeExperiencesSection() {
  const supabase = createSupabasePublicClient();
  const { data: experiences } = await supabase
    .from("treks")
    .select(
      "id, slug, title, cover_image, badge, rating, review_count, previous_price, price_per_adult",
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return <Experiences initialExperiences={experiences ?? []} />;
}

export default async function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ourika Travels",
    url: "https://ourikatravels.com",
    logo: "https://ourikatravels.com/og-image.jpg",
    description:
      "Local guide association in Setti Fatma, Ourika Valley, Morocco. Certified Berber guides for authentic Atlas Mountain experiences.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Setti Fatma",
      addressRegion: "Ourika Valley",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["English", "French", "Arabic", "Berber"],
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ourika Travels",
    url: "https://ourikatravels.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ourikatravels.com/experiences?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper />
      <main className="flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Hero />
        <div className="relative mt-2 space-y-0">
          <Suspense fallback={sectionFallback}>
            <HomeInterestsSection />
          </Suspense>
          <Suspense fallback={sectionFallback}>
            <HomeExperiencesSection />
          </Suspense>
          <Suspense fallback={sectionFallback}>
            <Reviews />
          </Suspense>
          <Suspense fallback={sectionFallback}>
            <Gallery />
          </Suspense>
          <TouristHighlight />
        </div>
      </main>
      <Footer />
    </div>
  );
}
