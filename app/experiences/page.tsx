import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import ExperiencesExplorer from "./components/ExperiencesExplorer";
import { BASE_URL, SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "Explore Experiences — Hikes, Culture & Adventure in Ourika Valley",
  description:
    "Browse all available experiences in Ourika Valley. From Atlas Mountains hikes and Berber village visits to camel rides and Agafay desert dinners — book your next adventure.",
  keywords: [
    "Ourika Valley experiences",
    "Morocco adventure tours",
    "Atlas Mountains hike",
    "Berber village tour",
    "Agafay desert dinner",
    "camel ride Morocco",
    "Setti-Fatma waterfall hike",
  ],
  openGraph: {
    type: "website",
    url: `${BASE_URL}/experiences`,
    title: `Explore Experiences | ${SITE_NAME}`,
    description:
      "From mountain hikes to desert dinners — discover and book authentic Moroccan experiences in Ourika Valley.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ourika Valley experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Explore Experiences | ${SITE_NAME}`,
    description: "Browse and book authentic Moroccan experiences in Ourika Valley.",
    images: [`${BASE_URL}/og-image.jpg`],
  },
  alternates: { canonical: `${BASE_URL}/experiences` },
};

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper sticky={false} />
      <main className="flex flex-col gap-2 pb-8">
        <ExperiencesExplorer />
      </main>
      <Footer />
    </div>
  );
}
