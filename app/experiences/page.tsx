import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import Breadcrumb from "@/components/Breadcrumb";
import ExperiencesExplorer from "./components/ExperiencesExplorer";
import { BASE_URL, SITE_NAME } from "@/lib/config";
import { getCategorySlug } from "@/lib/category-slug";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getWishlist } from "@/app/actions/wishlist";

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
    "day trips Ourika",
    "guided tours near Marrakech",
    "Ourika Valley activities 2025",
    "best treks Ourika Morocco",
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

export default async function ExperiencesPage() {
  const supabase = await createSupabaseServerClient();

  const [{ data: treks }, { data: categories }, wishlistItems] = await Promise.all([
    supabase
      .from("treks")
      .select(
        `
        id, title, slug, cover_image,
        rating, review_count,
        price_per_adult, previous_price,
        badge, award, duration,
        time_of_day, live_guide_languages,
        is_active, categories(name)
      `,
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false }),

    supabase.from("categories").select("*").order("created_at", { ascending: true }),

    getWishlist(),
  ]);

  const wishlistArray = Array.isArray(wishlistItems) ? wishlistItems : [];
  const wishlistedTrekIds = new Set(wishlistArray.map((w: { trek_id: string }) => w.trek_id));
  const breadcrumbItems = [
    { label: "Home", href: BASE_URL },
    { label: "Experiences", href: `${BASE_URL}/experiences` },
  ];
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ourika Valley Experiences",
    description: "All available guided experiences in Ourika Valley, Morocco",
    url: `${BASE_URL}/experiences`,
    itemListElement: (treks ?? []).map((trek, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/tour/${trek.slug}`,
      name: trek.title,
    })),
  };

  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper sticky={false} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <main className="flex flex-col gap-2 pb-8">
        <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <ExperiencesExplorer
          initialTreks={treks ?? []}
          initialCategories={(categories ?? []).map((category) => ({
            ...category,
            slug: getCategorySlug(category),
          }))}
          wishlistedTrekIds={Array.from(wishlistedTrekIds)}
        />
      </main>
      <Footer />
    </div>
  );
}
