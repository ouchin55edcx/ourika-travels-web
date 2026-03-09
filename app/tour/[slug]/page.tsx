import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import TourAbout from "./components/TourAbout";
import TourAvailabilityBar from "./components/TourAvailabilityBar";
import TourBookingCard from "./components/TourBookingCard";
import TourFacts from "./components/TourFacts";
import TourGallery from "./components/TourGallery";
import TourHeader from "./components/TourHeroHeader";
import TourHighlights from "./components/TourHighlights";
import TourItinerary from "./components/TourItinerary";
import TourReviews from "./components/TourReviews";
import TourSimilarExperiences from "./components/TourSimilarExperiences";
import TourStickyHeader from "./components/TourStickyHeader";
import TourTabs from "./components/TourTabs";
import TourTravelersLove from "./components/TourTravelersLove";
import { formatTitleFromSlug, navigationItems } from "./components/tourData";

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const { slug } = await params;
  const fallbackTitle = formatTitleFromSlug(slug);
  const title =
    fallbackTitle || "Ourika Valley, Atlas mountains Waterfalls & 3 Valleys";

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f] selection:bg-[#34e0a1] selection:text-black">
      <Navbar />
      <TourStickyHeader title={title} navigationItems={navigationItems} />
      <main className="mx-auto flex w-full max-w-[1180px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <TourHeader title={title} />

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="min-w-0">
            <TourGallery />
            <TourTabs />
            <TourAbout />
            <TourTravelersLove />
            <TourFacts />
            <TourHighlights />
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
