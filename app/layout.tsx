import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

/* ─── Single font — Outfit ─── */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",   // prevents invisible-text flash
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

/* ─── Site-wide default metadata ─── */
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Ourika Travels | Authentic Local Experiences in Ourika Valley",
    template: "%s | Ourika Travels",
  },
  description:
    "Discover the hidden gems of Ourika Valley with certified local guides. Book unique hikes, cultural tours, and authentic Moroccan experiences in the Atlas Mountains.",
  keywords: [
    "Ourika Valley",
    "Morocco tours",
    "local guides Morocco",
    "Atlas Mountains",
    "Setti-Fatma waterfalls",
    "Berber culture",
    "Marrakech day trips",
    "Ourika Travels",
  ],
  authors: [{ name: "Ourika Travels", url: baseUrl }],
  creator: "Ourika Travels",
  publisher: "Ourika Travels",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Ourika Travels",
    title: "Ourika Travels | Authentic Local Experiences in Ourika Valley",
    description:
      "Discover the hidden gems of Ourika Valley with certified local guides. Book unique hikes, cultural tours, and Moroccan adventures.",
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ourika Valley — stunning Atlas Mountains landscape",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ourika Travels | Authentic Local Experiences",
    description:
      "Book unique hikes, cultural tours, and authentic Moroccan experiences in Ourika Valley.",
    images: [`${baseUrl}/og-image.jpg`],
    creator: "@ourikatreks",
    site: "@ourikatreks",
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#004f32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-outfit antialiased`}>
        {children}
      </body>
    </html>
  );
}
