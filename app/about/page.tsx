import { Metadata } from "next";
import AboutContent from "./AboutContent";
import { BASE_URL, SITE_NAME, TWITTER_HANDLE } from "@/lib/config";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const title = `About ${SITE_NAME} - Your Trusted Local Guide to Ourika Valley Adventures`;
  const description = `Learn about ${SITE_NAME}, the leading platform connecting travelers with certified local guides in Morocco's stunning Ourika Valley. Discover authentic Berber culture, Setti-Fatma waterfalls, and Atlas Mountains adventures.`;

  const aboutImage = `${BASE_URL}/about.png`;
  const ogImage = `${BASE_URL}/og-image.jpg`;

  return {
    title,
    description,
    keywords: [
      "Ourika Valley guides",
      "Morocco travel agency",
      "Ourika Valley tours",
      "local guides Morocco",
      "Berber culture tours",
      "Atlas Mountains guides",
      "Setti-Fatma waterfalls",
      "authentic Morocco travel",
      "Ourika Valley travel company",
    ],

    openGraph: {
      type: "website",
      locale: "en_US",
      url: `${BASE_URL}/about`,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: aboutImage,
          width: 1200,
          height: 630,
          alt: "Ourika Valley, Morocco - Local guide leading a hike in Ourika Valley",
          type: "image/png",
        },
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Your Trusted Guide to Ourika Valley Adventures`,
          type: "image/jpeg",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [aboutImage, ogImage],
      creator: TWITTER_HANDLE,
    },

    alternates: {
      canonical: `${BASE_URL}/about`,
      languages: {
        en: `${BASE_URL}/about`,
        fr: `${BASE_URL}/fr/about`,
        "x-default": `${BASE_URL}/about`,
      },
    },
  };
}

export default function AboutPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who are Ourika Travels guides?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ourika Travels works with certified local guides based in Setti Fatma and across Ourika Valley for hikes, cultural tours, and Atlas Mountains experiences.",
        },
      },
      {
        "@type": "Question",
        name: "What types of experiences do you offer in Ourika Valley?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer waterfall hikes, Berber village visits, cultural experiences, and guided outdoor adventures in and around Setti Fatma and the Atlas Mountains.",
        },
      },
      {
        "@type": "Question",
        name: "How do I book an experience with Ourika Travels?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Choose an experience online, reserve your place, and finalize payment at the Ourika Travels bureau in Setti Fatma before the activity starts.",
        },
      },
      {
        "@type": "Question",
        name: "How far is Ourika Valley from Marrakech?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ourika Valley is roughly 45 minutes to 1 hour from Marrakech by road, depending on traffic and your starting point.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AboutContent />
      <Footer />
    </div>
  );
}
