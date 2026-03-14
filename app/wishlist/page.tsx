import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import WishlistExplorer from "./components/WishlistExplorer";
import { BASE_URL, SITE_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: "My Wishlist — Saved Experiences",
  description:
    "View and manage your saved Ourika Valley experiences. Keep track of the hikes, cultural tours, and adventures you want to book.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/wishlist`,
    title: `My Wishlist | ${SITE_NAME}`,
    description: "Your saved Ourika Valley experiences, all in one place.",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} wishlist`,
      },
    ],
  },
  alternates: { canonical: `${BASE_URL}/wishlist` },
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(140deg,_#f9f6ef_0%,_#f1f5f1_45%,_#eef2f7_100%)] selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper sticky={false} />
      <main className="flex flex-col gap-2 pb-8">
        <WishlistExplorer />
      </main>
      <Footer />
    </div>
  );
}
