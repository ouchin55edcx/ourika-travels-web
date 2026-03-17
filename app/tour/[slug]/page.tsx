import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { getTrekBySlug, getPublicTreks } from "@/app/actions/treks";
import { isWishlisted as checkWishlisted } from "@/app/actions/wishlist";
import { getTrekReviews } from "@/app/actions/reviews";
import { BASE_URL, SITE_NAME } from "@/lib/config";
import { navigationItems } from "@/lib/data/tourData";

// Build static params from real Supabase data
export async function generateStaticParams() {
  const treks = await getPublicTreks();
  const list = Array.isArray(treks) ? treks : [];
  return list
    .filter((t: { slug?: string }) => t.slug)
    .map((t: { slug: string }) => ({ slug: t.slug }));
}

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trek = await getTrekBySlug(slug);

  if (!trek) {
    return { title: "Trek not found | Ourika Travels" };
  }

  const description =
    trek.meta_description ||
    `Book "${trek.title}" with certified local guides in Ourika Valley, Morocco. Small groups, authentic encounters, unforgettable memories.`;

  return {
    title: trek.title,
    description,
    openGraph: {
      type: "website",
      url: `${BASE_URL}/tour/${slug}`,
      title: `${trek.title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: trek.cover_image || `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: trek.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${trek.title} | ${SITE_NAME}`,
      description,
      images: [trek.cover_image || `${BASE_URL}/og-image.jpg`],
    },
    alternates: { canonical: `${BASE_URL}/tour/${slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trek = await getTrekBySlug(slug);

  if (!trek) notFound();

  const [wishlisted, trekReviews] = await Promise.all([
    checkWishlisted(trek.id),
    getTrekReviews(trek.id),
  ]);

  // Build breakdown: Excellent/Good/Average/Poor/Terrible from real reviews
  const reviewBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = trekReviews.filter((r) => r.rating === stars).length;
    const pct = trekReviews.length > 0 ? Math.round((count / trekReviews.length) * 100) : 0;
    return {
      label: ["", "Terrible", "Poor", "Average", "Good", "Excellent"][stars],
      count,
      percentage: `${pct}%`,
    };
  });

  // Map to the shape TourReviews + TourTravelersLove expect
  const formattedReviews = trekReviews.map((r) => ({
    author: r.tourist_name,
    contributions: "Verified traveler",
    date: new Date(r.created_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    title: r.title ?? undefined,
    body: r.body,
    avatar: r.tourist_avatar ?? undefined,
    rating: r.rating,
    // sub-ratings
    rating_guide: r.rating_guide ?? undefined,
    rating_value: r.rating_value ?? undefined,
    rating_service: r.rating_service ?? undefined,
  }));

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f] selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper />
      <TourStickyHeader
        title={trek.title}
        navigationItems={navigationItems}
        rating={trek.rating}
        price={trek.price_per_adult}
      />
      <TourMobileBookBar price={trek.price_per_adult} />
      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-3 py-4 pb-24 sm:px-6 sm:py-6 sm:pb-24 lg:px-8 lg:pb-6">
        <TourHeader
          title={trek.title}
          rating={trek.rating}
          reviewCount={trek.review_count}
          trekId={trek.id}
          isWishlisted={wishlisted}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-7">
          <section className="min-w-0">
            <TourGallery
              coverImage={trek.cover_image}
              galleryImages={trek.gallery_images}
              totalPhotoCount={trek.total_photo_count}
              title={trek.title}
            />
            <TourTabs />
            <TourAbout about={trek.about} />
            <TourTravelersLove
              rating={trek.rating}
              reviewCount={trek.review_count}
              reviews={formattedReviews}
            />
            <TourFacts
              duration={trek.duration}
              maxGroupSize={trek.max_group_size}
              minAge={trek.min_age}
              maxAge={trek.max_age}
              startTime={trek.start_time}
              mobileTicket={trek.mobile_ticket}
              liveGuideLanguages={trek.live_guide_languages}
              audioGuideLanguages={trek.audio_guide_languages}
              writtenGuideLanguages={trek.written_guide_languages}
            />
            <TourHighlights
              highlights={trek.highlights}
              included={trek.included ?? []}
              not_included={trek.not_included ?? []}
              services={trek.services ?? []}
            />
          </section>

          <TourBookingCard
            trekSlug={trek.slug}
            price={trek.price_per_adult}
            previousPrice={trek.previous_price}
            freeCancellationHours={trek.free_cancellation_hours}
            reserveNowPayLater={trek.reserve_now_pay_later}
            avgBookingLeadDays={trek.avg_booking_lead_days}
          />
        </div>

        <TourItinerary
          startLocation={trek.start_location}
          pickupAvailable={trek.pickup_available}
          steps={trek.itinerary_steps}
        />
        <TourAvailabilityBar />
        <TourSimilarExperiences currentTrekId={trek.id} />
        <TourReviews
          rating={trek.rating}
          reviewCount={trek.review_count}
          reviewBreakdown={reviewBreakdown}
          popularMentions={trek.popular_mentions ?? []}
          reviews={formattedReviews}
        />
      </main>
      <Footer />
    </div>
  );
}
