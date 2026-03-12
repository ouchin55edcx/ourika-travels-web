import type { Metadata } from "next";
import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import WishlistExplorer from "./components/WishlistExplorer";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

export const metadata: Metadata = {
  title: "My Wishlist — Saved Experiences",
  description:
    "View and manage your saved Ourika Valley experiences. Keep track of the hikes, cultural tours, and adventures you want to book.",
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    url: `${baseUrl}/wishlist`,
    title: "My Wishlist | Ourika Travels",
    description: "Your saved Ourika Valley experiences, all in one place.",
    images: [{ url: `${baseUrl}/og-image.jpg`, width: 1200, height: 630, alt: "Ourika Travels wishlist" }],
  },
  alternates: { canonical: `${baseUrl}/wishlist` },
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(140deg,_#f9f6ef_0%,_#f1f5f1_45%,_#eef2f7_100%)] selection:bg-[#34e0a1] selection:text-black">
      <Navbar sticky={false} />
      <main className="flex flex-col gap-2 pb-8">
        <WishlistExplorer />
      </main>
      <Footer />
    </div>
  );
}
