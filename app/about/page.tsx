import { Metadata } from "next";
import AboutContent from "./AboutContent";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

export async function generateMetadata(): Promise<Metadata> {
  const title =
    "About OurikaTravels - Your Trusted Local Guide to Ourika Valley Adventures";
  const description =
    "Learn about OurikaTravels, the leading platform connecting travelers with certified local guides in Morocco's stunning Ourika Valley. Discover authentic Berber culture, Setti-Fatma waterfalls, and Atlas Mountains adventures.";

  const aboutImage = `${baseUrl}/about.png`;
  const ogImage = `${baseUrl}/og-image.jpg`;

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
      url: `${baseUrl}/about`,
      siteName: "OurikaTravels",
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
          alt: "OurikaTravels - Your Trusted Guide to Ourika Valley Adventures",
          type: "image/jpeg",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [aboutImage, ogImage],
      creator: "@ourikatreks",
    },

    alternates: {
      canonical: `${baseUrl}/about`,
    },
  };
}

export default function AboutPage() {
  return <AboutContent />;
}
