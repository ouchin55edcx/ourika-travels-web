import type { Metadata } from "next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ExperiencesExplorer from "./components/ExperiencesExplorer";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

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
    url: `${baseUrl}/experiences`,
    title: "Explore Experiences | Ourika Travels",
    description:
      "From mountain hikes to desert dinners — discover and book authentic Moroccan experiences in Ourika Valley.",
    images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: "Ourika Valley experiences" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Experiences | Ourika Travels",
    description: "Browse and book authentic Moroccan experiences in Ourika Valley.",
    images: [`${baseUrl}/og-image.jpg`],
  },
  alternates: { canonical: `${baseUrl}/experiences` },
};

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <Navbar sticky={false} />
      <main className="flex flex-col gap-2 pb-8">
        <ExperiencesExplorer />
      </main>
      <Footer />
    </div>
  );
}
