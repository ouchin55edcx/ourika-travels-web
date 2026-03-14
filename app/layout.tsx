import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { BASE_URL, SITE_NAME, TWITTER_HANDLE } from "@/lib/config";
import { AuthProvider } from "@/lib/context/AuthContext";
import { getCurrentUser } from "@/lib/auth";

/* ─── Single font — Outfit ─── */
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  display: "swap", // prevents invisible-text flash
});

/* ─── Site-wide default metadata ─── */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: `${SITE_NAME} | Authentic Local Experiences in Ourika Valley`,
    template: `%s | ${SITE_NAME}`,
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
    SITE_NAME,
  ],
  authors: [{ name: SITE_NAME, url: BASE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Authentic Local Experiences in Ourika Valley`,
    description:
      "Discover the hidden gems of Ourika Valley with certified local guides. Book unique hikes, cultural tours, and Moroccan adventures.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Ourika Valley — stunning Atlas Mountains landscape",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Authentic Local Experiences`,
    description:
      "Book unique hikes, cultural tours, and authentic Moroccan experiences in Ourika Valley.",
    images: [`${BASE_URL}/og-image.jpg`],
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
  },
  alternates: {
    canonical: BASE_URL,
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("preferredLanguage")?.value || "en";
  const lang = ["en", "fr"].includes(rawLang.toLowerCase()) ? rawLang.toLowerCase() : "en";
  // TODO: Implement full Next.js i18n routing (/fr/*, /en/*)
  // with hreflang alternates for production multilingual SEO.

  return (
    <html lang={lang}>
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
