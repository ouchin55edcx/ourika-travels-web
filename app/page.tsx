import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import NavbarWrapper from "@/app/components/NavbarWrapper";
import { staticCategories, staticExperiences, staticAverageRating, staticReviewCount } from "@/lib/data/home";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Interests from "@/components/Interests";
import Experiences from "@/components/Experiences";
import { TrustStrip, SocialProof, FAQ, Newsletter, WhatsAppButton } from "@/hooks/components/HomeAdditions";
import { BASE_URL, SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Nomadica Sahara — Authentic Local Treks & Experiences in Ourika Valley, Morocco",
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
    title: "Nomadica Sahara — Authentic Local Treks in Ourika Valley",
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
    title: "Nomadica Sahara — Authentic Ourika Valley Experiences",
    description:
      "Book with local certified guides. Atlas Mountains, Berber villages, Setti Fatma waterfalls.",
    images: [`${BASE_URL}/og-image.jpg`],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      en: BASE_URL,
      fr: `${BASE_URL}/fr`,
      "x-default": BASE_URL,
    },
  },
};

const sectionFallback = (
  <div className="mx-auto w-full max-w-7xl px-6 py-16 md:py-24 xl:py-32">
    <div className="h-64 animate-pulse rounded-3xl bg-gray-100" />
  </div>
);

function HomeInterestsSection() {
  return <Interests initialCategories={staticCategories} />;
}

function HomeExperiencesSection() {
  return <Experiences initialExperiences={staticExperiences} />;
}

export default async function Home() {
  const averageRating = staticAverageRating;
  const approvedReviewCount = staticReviewCount;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "TouristInformationCenter"],
    "@id": `${BASE_URL}#business`,
    name: "Nomadica Sahara",
    description:
      "Local guide association in Setti Fatma offering certified Berber guides for Atlas Mountains treks, Ourika Valley hikes, and authentic Moroccan experiences.",
    url: BASE_URL,
    telephone: process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "",
    email: "hello@nomadicasahara.com",
    image: `${BASE_URL}/og-image.jpg`,
    logo: `${BASE_URL}/og-image.jpg`,
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "07:00",
      closes: "19:00",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Centre de Setti Fatma",
      addressLocality: "Setti Fatma",
      addressRegion: "Ourika Valley, Marrakech-Safi",
      postalCode: "40000",
      addressCountry: "MA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 31.2267,
      longitude: -7.67,
    },
    hasMap: "https://maps.google.com/?q=Setti+Fatma+Ourika+Valley+Morocco",
    sameAs: [
      "https://www.tripadvisor.com",
      "https://www.facebook.com/ourikatravels",
      "https://www.instagram.com/ourikatravels",
    ],
    ...(averageRating && approvedReviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: String(approvedReviewCount),
            bestRating: "5",
          },
        }
      : {}),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nomadica Sahara",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/experiences?q={search_term_string}`,
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
          <TrustStrip />
          <section className="mx-auto w-full max-w-7xl px-6 py-6 text-sm font-medium text-[#355646] sm:text-base">
          Based in <strong>Setti Fatma, Ourika Valley</strong>, we offer{" "}
          <Link href="/experiences" className="font-black text-[#0b3a2c] underline">
            guided treks and cultural experiences
          </Link>{" "}
          in the Atlas Mountains, around 45 minutes from Marrakech.
        </section>
        <div className="relative mt-2 space-y-0">
          <Suspense fallback={sectionFallback}>
            <HomeInterestsSection />
          </Suspense>
          <Suspense fallback={sectionFallback}>
            <HomeExperiencesSection />
          </Suspense>
          <SocialProof />
          <Suspense fallback={sectionFallback}>
            <Gallery />
          </Suspense>
          <FAQ />
          <Newsletter />
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
