import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import Breadcrumb from "@/components/Breadcrumb";
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
import { getTrekReviews } from "@/app/actions/reviews";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import { BASE_URL, SITE_NAME } from "@/lib/config";

// Build static params from real Supabase data
export async function generateStaticParams() {
  const treks = await getPublicTreks();
  const list = Array.isArray(treks) ? treks : [];
  return list
    .filter((t: { slug?: string }) => t.slug)
    .map((t: { slug: string }) => ({ slug: t.slug }));
}

export const dynamicParams = true;

function buildTrekDescription(trek: Awaited<ReturnType<typeof getTrekBySlug>>) {
  const base = `${trek?.title} in Ourika Valley from $${trek?.price_per_adult} with ${trek?.duration}. Book with local guides in Setti Fatma for an authentic Atlas Mountains experience.`;
  if (base.length <= 160) return base;
  return `${base.slice(0, 157).trimEnd()}...`;
}

function formatReviews(trekReviews: Awaited<ReturnType<typeof getTrekReviews>>) {
  return trekReviews.map((r) => ({
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
    rating_guide: r.rating_guide ?? undefined,
    rating_value: r.rating_value ?? undefined,
    rating_service: r.rating_service ?? undefined,
  }));
}

async function TourTravelersLoveSection({
  trekId,
  rating,
  reviewCount,
}: {
  trekId: string;
  rating: number;
  reviewCount: number;
}) {
  const trekReviews = await getTrekReviews(trekId);
  return (
    <TourTravelersLove
      rating={rating}
      reviewCount={reviewCount}
      reviews={formatReviews(trekReviews)}
    />
  );
}

async function TourReviewsSection({ trekId, trek }: { trekId: string; trek: any }) {
  const trekReviews = await getTrekReviews(trekId);
  const reviewBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = trekReviews.filter((r) => r.rating === stars).length;
    const pct = trekReviews.length > 0 ? Math.round((count / trekReviews.length) * 100) : 0;
    return {
      label: ["", "Terrible", "Poor", "Average", "Good", "Excellent"][stars],
      count,
      percentage: `${pct}%`,
    };
  });

  return (
    <TourReviews
      rating={trek.rating}
      reviewCount={trek.review_count}
      reviewBreakdown={reviewBreakdown}
      popularMentions={trek.popular_mentions ?? []}
      reviews={formatReviews(trekReviews)}
    />
  );
}

async function TourSimilarExperiencesSection({ trekId }: { trekId: string }) {
  const supabase = createSupabasePublicClient();
  const { data: similar } = await supabase
    .from("treks")
    .select(
      "id, slug, title, cover_image, badge, rating, review_count, previous_price, price_per_adult, categories(name)",
    )
    .eq("is_active", true)
    .neq("id", trekId)
    .order("created_at", { ascending: false })
    .limit(4);

  return <TourSimilarExperiences currentTrekId={trekId} initialSimilar={similar ?? []} />;
}

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

  const categoryName = Array.isArray(trek.categories)
    ? trek.categories[0]?.name
    : trek.categories?.name;
  const description = trek.meta_description || buildTrekDescription(trek);

  return {
    title: `${trek.title} — Ourika Valley, Morocco`,
    description,
    keywords: [
      trek.title,
      "Ourika Valley",
      categoryName || "Ourika Valley tours",
      "Morocco tour",
      "local guide",
      "Setti Fatma",
      "Atlas Mountains",
      `${trek.title} booking`,
      `${trek.title} price`,
    ],
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
          alt: `${trek.title} — Ourika Valley, Morocco`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${trek.title} | ${SITE_NAME}`,
      description,
      images: [trek.cover_image || `${BASE_URL}/og-image.jpg`],
    },
    alternates: {
      canonical: `${BASE_URL}/tour/${slug}`,
      languages: {
        en: `${BASE_URL}/tour/${slug}`,
        fr: `${BASE_URL}/fr/tour/${slug}`,
        "x-default": `${BASE_URL}/tour/${slug}`,
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trek = await getTrekBySlug(slug);

  if (!trek) notFound();

  const safeGalleryImages = Array.isArray(trek.gallery_images)
    ? trek.gallery_images.filter((galleryImage: any) => galleryImage?.src)
    : [];
  const safeHighlights = Array.isArray(trek.highlights) ? trek.highlights : [];
  const safeIncluded = Array.isArray(trek.included) ? trek.included : [];
  const safeNotIncluded = Array.isArray(trek.not_included) ? trek.not_included : [];
  const safeServices = Array.isArray(trek.services) ? trek.services : [];
  const safeLiveGuideLanguages = Array.isArray(trek.live_guide_languages)
    ? trek.live_guide_languages
    : [];
  const safeAudioGuideLanguages = Array.isArray(trek.audio_guide_languages)
    ? trek.audio_guide_languages
    : [];
  const safeWrittenGuideLanguages = Array.isArray(trek.written_guide_languages)
    ? trek.written_guide_languages
    : [];
  const safeItinerarySteps = Array.isArray(trek.itinerary_steps) ? trek.itinerary_steps : [];
  const description = trek.meta_description || buildTrekDescription(trek);
  const trekReviews = await getTrekReviews(trek.id);

  const hasHighlights =
    safeHighlights.filter(Boolean).length > 0 ||
    safeIncluded.filter(Boolean).length > 0 ||
    safeNotIncluded.filter(Boolean).length > 0 ||
    safeServices.filter(Boolean).length > 0;
  const hasDetails =
    !!trek.duration ||
    !!trek.max_group_size ||
    !!trek.min_age ||
    !!trek.max_age ||
    !!trek.start_time ||
    !!trek.mobile_ticket ||
    safeLiveGuideLanguages.length > 0 ||
    safeAudioGuideLanguages.length > 0 ||
    safeWrittenGuideLanguages.length > 0;
  const navigationItems = [
    { label: "Overview", id: "overview" },
    ...(hasDetails ? [{ label: "Details", id: "details" }] : []),
    ...(hasHighlights ? [{ label: "Highlights", id: "highlights" }] : []),
    { label: "Itinerary", id: "itinerary" },
    { label: "Reviews", id: "reviews" },
  ];
  const breadcrumbItems = [
    { label: "Home", href: BASE_URL },
    { label: "Experiences", href: `${BASE_URL}/experiences` },
    { label: trek.title, href: `${BASE_URL}/tour/${trek.slug}` },
  ];
  const tourSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Product", "TouristAttraction"],
        "@id": `${BASE_URL}/tour/${trek.slug}#product`,
        name: trek.title,
        description: trek.about || description,
        url: `${BASE_URL}/tour/${trek.slug}`,
        image: [
          trek.cover_image,
          ...safeGalleryImages.slice(0, 3).map((galleryImage: any) => galleryImage.src),
        ].filter(Boolean),
        brand: {
          "@type": "Brand",
          name: "Ourika Travels",
        },
        offers: {
          "@type": "Offer",
          price: trek.price_per_adult,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${BASE_URL}/reservation?trek=${trek.slug}`,
          seller: {
            "@type": "Organization",
            name: "Ourika Travels",
            url: BASE_URL,
          },
        },
        ...(trek.review_count > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: trek.rating,
                reviewCount: trek.review_count,
                bestRating: 5,
                worstRating: 1,
              },
            }
          : {}),
        additionalProperty: [
          { "@type": "PropertyValue", name: "Duration", value: trek.duration },
          {
            "@type": "PropertyValue",
            name: "Group size",
            value: `Max ${trek.max_group_size} people`,
          },
            {
              "@type": "PropertyValue",
              name: "Language",
              value: safeLiveGuideLanguages.join(", ") || "English, French, Arabic",
            },
          {
            "@type": "PropertyValue",
            name: "Meeting point",
            value: trek.start_location || "Setti Fatma, Ourika Valley",
          },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Setti Fatma",
          addressRegion: "Ourika Valley",
          addressCountry: "MA",
        },
        provider: {
          "@type": "TouristInformationCenter",
          name: "Ourika Travels",
          url: BASE_URL,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Setti Fatma",
            addressRegion: "Ourika Valley, Marrakech-Safi",
            addressCountry: "MA",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Experiences",
            item: `${BASE_URL}/experiences`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: trek.title,
            item: `${BASE_URL}/tour/${trek.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is included in the ${trek.title}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text:
                safeIncluded.join(", ") ||
                "Professional local guide, transport, and authentic experience",
            },
          },
          {
            "@type": "Question",
            name: "How do I get to the meeting point?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `The meeting point is at ${trek.start_location || "Setti Fatma, Ourika Valley, Morocco"}. We recommend taking a taxi from Marrakech (approximately 1 hour).`,
            },
          },
          {
            "@type": "Question",
            name: "When do I pay?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You reserve your spot for free online. Payment is made in cash at the Ourika Travels bureau in Setti Fatma before the activity starts.",
            },
          },
          {
            "@type": "Question",
            name: `How long does ${trek.title} last?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: trek.duration
                ? `The experience lasts ${trek.duration}.`
                : "Duration varies — see the trek details page for the full schedule.",
            },
          },
          trek.free_cancellation_hours
            ? {
                "@type": "Question",
                name: "Can I cancel my booking?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `Yes, free cancellation up to ${trek.free_cancellation_hours} hours before the activity. Cancel anytime from your booking history.`,
                },
              }
            : null,
        ].filter(Boolean),
      },
      ...trekReviews
        .filter((review: any) => review?.rating && review?.body && review?.created_at)
        .slice(0, 5)
        .map((review: any) => ({
          "@type": "Review",
          "@id": `${BASE_URL}/tour/${trek.slug}#review-${review.id}`,
          itemReviewed: { "@id": `${BASE_URL}/tour/${trek.slug}#product` },
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.rating,
            bestRating: 5,
          },
          author: {
            "@type": "Person",
            name: review.tourist_name,
          },
          datePublished: review.created_at.split("T")[0],
          reviewBody: review.body,
        })),
    ],
  };

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f] selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper sticky={false} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
      />
      <TourStickyHeader
        title={trek.title}
        navigationItems={navigationItems}
        rating={trek.rating}
        price={trek.price_per_adult}
      />
      <TourMobileBookBar price={trek.price_per_adult} trekSlug={trek.slug} trekTitle={trek.title} />
      <main className="mx-auto flex w-full max-w-[1180px] flex-col gap-2 px-3 py-4 pb-24 sm:px-6 sm:py-6 sm:pb-24 lg:px-8 lg:pb-6">
        <Breadcrumb items={breadcrumbItems} className="mb-2 text-sm font-medium text-gray-500" />
        <TourHeader title={trek.title} rating={trek.rating} reviewCount={trek.review_count} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start lg:gap-7">
          <section className="min-w-0">
            <TourGallery
              coverImage={trek.cover_image}
              galleryImages={safeGalleryImages}
              totalPhotoCount={trek.total_photo_count}
              title={trek.title}
            />
            <TourTabs items={navigationItems} />
            <TourAbout about={trek.about} />
            <Suspense fallback={<div className="h-48 animate-pulse rounded-3xl bg-gray-100" />}>
              <TourTravelersLoveSection
                trekId={trek.id}
                rating={trek.rating}
                reviewCount={trek.review_count}
              />
            </Suspense>
            {hasDetails ? (
              <TourFacts
                duration={trek.duration}
                maxGroupSize={trek.max_group_size}
                minAge={trek.min_age}
                maxAge={trek.max_age}
                startTime={trek.start_time}
                mobileTicket={trek.mobile_ticket}
                liveGuideLanguages={safeLiveGuideLanguages}
                audioGuideLanguages={safeAudioGuideLanguages}
                writtenGuideLanguages={safeWrittenGuideLanguages}
              />
            ) : null}
            {hasHighlights ? (
              <TourHighlights
                highlights={safeHighlights}
                included={safeIncluded}
                not_included={safeNotIncluded}
                services={safeServices}
              />
            ) : null}
          </section>

          <TourBookingCard
            trekSlug={trek.slug}
            trekTitle={trek.title}
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
          steps={safeItinerarySteps}
        />
        <TourAvailabilityBar />
        <Suspense fallback={<div className="h-64 animate-pulse rounded-3xl bg-gray-100" />}>
          <TourSimilarExperiencesSection trekId={trek.id} />
        </Suspense>
        <section className="rounded-[2rem] border border-black/5 bg-[#f7faf9] p-6 text-[15px] leading-8 text-[#355646]">
          Explore all{" "}
          <a href="/experiences" className="font-black text-[#0b3a2c] underline">
            Ourika Valley experiences
          </a>{" "}
          or browse by category:{" "}
          <a href="/category/hiking" className="font-black text-[#0b3a2c] underline">
            Hiking
          </a>
          ,{" "}
          <a href="/category/culture" className="font-black text-[#0b3a2c] underline">
            Cultural tours
          </a>
          ,{" "}
          <a href="/category/food" className="font-black text-[#0b3a2c] underline">
            Food experiences
          </a>
          .
        </section>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-gray-100" />}>
          <TourReviewsSection trekId={trek.id} trek={trek} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
