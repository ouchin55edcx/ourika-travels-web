import type { Metadata } from "next";
import Footer from "@/components/Footer";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import TourAbout from "./components/TourAbout";
import TourAvailabilityBar from "./components/TourAvailabilityBar";
import TourBookingCard from "./components/TourBookingCard";
import TourFacts from "./components/TourFacts";
import TourGallery from "./components/TourGallery";
import TourHeader from "./components/TourHeroHeader";
import TourHighlights from "./components/TourHighlights";
import TourItinerary from "./components/TourItinerary";
import TourMobileBookBar from "./components/TourMobileBookBar";
import TourReviews from "./components/TourReviews";
import TourSimilarExperiences from "./components/TourSimilarExperiences";
import TourStickyHeader from "./components/TourStickyHeader";
import TourTabs from "./components/TourTabs";
import TourTravelersLove from "./components/TourTravelersLove";
import { formatTitleFromSlug, navigationItems, tourData } from "@/lib/data/tourData";
import { experiencesData } from "@/lib/data/experiences";
import { BASE_URL, SITE_NAME } from "@/lib/config";

export const dynamicParams = true;

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateStaticParams() {
  return experiencesData.map((experience) => ({
    slug: slugify(experience.title),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fallbackTitle = formatTitleFromSlug(slug);
  const title = fallbackTitle || "Ourika Valley, Atlas Mountains Waterfalls & 3 Valleys";

  return {
    title,
    description: `Book the "${title}" experience with certified local guides in Ourika Valley, Morocco. Small groups, authentic encounters, and unforgettable memories.`,
    openGraph: {
      type: "website",
      url: `${BASE_URL}/tour/${slug}`,
      title: `${title} | ${SITE_NAME}`,
      description: `Join the "${title}" experience in Ourika Valley — guided by local experts.`,
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: `Book the "${title}" guided experience in Ourika Valley.`,
      images: [`${BASE_URL}/og-image.jpg`],
    },
    alternates: { canonical: `${BASE_URL}/tour/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug?: string }> }) {
  const { slug } = await params;
  const fallbackTitle = formatTitleFromSlug(slug);
  const title = fallbackTitle || "Ourika Valley, Atlas mountains Waterfalls & 3 Valleys";

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f] selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper />
      <TourStickyHeader title={title} navigationItems={navigationItems} />
      <TourMobileBookBar />
      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-3 py-4 pb-24 sm:px-6 sm:py-6 sm:pb-24 lg:px-8 lg:pb-6">
        <TourHeader title={title} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-7">
          <section className="min-w-0">
            <TourGallery />
            <TourTabs />
            <TourAbout />
            <TourTravelersLove />
            <TourFacts />
            <TourHighlights
              highlights={tourData.highlights}
              included={tourData.included}
              not_included={tourData.not_included}
              services={tourData.services}
            />
          </section>

          <TourBookingCard />
        </div>

        <TourItinerary />
        <TourAvailabilityBar />
        <TourSimilarExperiences />
        <TourReviews />
      </main>
      <Footer />
    </div>
  );
}
