import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { createSupabasePublicClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { BASE_URL } from "@/lib/config";
import { getGuideSlug, normalizeGuideSlug } from "@/lib/guide-slug";
import GuidePublicProfile from "./GuidePublicProfile";

interface GuidePublicPageProps {
  params: Promise<{ slug: string }>;
}

interface Trek {
  id: string;
  title: string | null;
  slug: string | null;
  cover_image: string | null;
  duration: string | null;
  price_per_person: number | null;
  description: string | null;
}

interface Review {
  id: string;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
  tourists: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

async function getActiveGuides(supabase: any) {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("role", "guide")
    .eq("is_active", true);
  return data ?? [];
}

export async function generateStaticParams() {
  const supabase = createSupabasePublicClient();
  const guides = await getActiveGuides(supabase);

  return guides
    .map((guide: any) => getGuideSlug(guide))
    .filter(Boolean)
    .map((slug: string) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const guides = await getActiveGuides(supabase);
  const normalizedSlug = normalizeGuideSlug(slug);
  const guide = guides.find((candidate: any) => getGuideSlug(candidate) === normalizedSlug);

  if (!guide) {
    return {
      title: "Guide Not Found | Ourika Travels",
      description: "This guide profile is not available.",
    };
  }

  const name = guide.full_name || "Guide";
  const title = `${name} — Certified Local Guide in ${guide.location || "Ourika Valley"}`;
  const description =
    guide.bio ||
    `${name} is a certified local guide based in ${guide.location || "Ourika Valley, Morocco"}. Book an authentic Atlas Mountains experience with ${guide.specialties?.[0] || "expert guidance"}.`;
  const canonicalUrl = `${BASE_URL}/guide/${getGuideSlug(guide)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "profile",
      images: guide.avatar_url
        ? [{ url: guide.avatar_url, width: 800, height: 800, alt: name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: guide.avatar_url ? [guide.avatar_url] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: canonicalUrl,
        fr: `${BASE_URL}/fr/guide/${getGuideSlug(guide)}`,
        "x-default": canonicalUrl,
      },
    },
  };
}

export default async function GuidePublicPage({ params }: GuidePublicPageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const guides = await getActiveGuides(supabase);
  const normalizedSlug = normalizeGuideSlug(slug);
  const guide = guides.find((candidate: any) => getGuideSlug(candidate) === normalizedSlug);

  if (!guide) {
    notFound();
  }

  const canonicalSlug = getGuideSlug(guide);
  if (slug !== canonicalSlug) {
    permanentRedirect(`/guide/${canonicalSlug}`);
  }

  const { data: bookingsData } = await supabase
    .from("bookings")
    .select(
      `
      id,
      treks (
        id,
        title,
        slug,
        cover_image,
        duration,
        price_per_person,
        description
      )
    `,
    )
    .eq("guide_id", guide.id)
    .eq("status", "completed")
    .not("treks", "is", null);

  const treksMap = new Map<string, Trek>();
  if (bookingsData) {
    bookingsData.forEach((booking: unknown) => {
      const b = booking as { treks: Trek[] | null };
      if (b.treks && Array.isArray(b.treks) && b.treks.length > 0) {
        const trek = b.treks[0];
        if (trek?.id) {
          treksMap.set(trek.id, trek);
        }
      }
    });
  }
  const guideTreks = Array.from(treksMap.values());

  const { data: reviewsData } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      comment,
      created_at,
      bookings (
        guide_id,
        tourists (
          id,
          full_name,
          avatar_url
        )
      )
    `,
    )
    .eq("bookings.guide_id", guide.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  const guideReviews: Review[] = (reviewsData || []).map((review: unknown) => {
    const r = review as {
      id: string;
      rating: number | null;
      comment: string | null;
      created_at: string | null;
      bookings: {
        tourists: Array<{
          id: string;
          full_name: string | null;
          avatar_url: string | null;
        }> | null;
      } | null;
    };
    return {
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      tourists: r.bookings?.tourists?.[0] || null,
    };
  });

  const averageRating =
    guideReviews.length > 0
      ? (
          guideReviews.reduce((acc, review) => acc + (review.rating || 0), 0) / guideReviews.length
        ).toFixed(1)
      : null;

  return (
    <GuidePublicProfile
      guide={guide}
      guideTreks={guideTreks}
      guideReviews={guideReviews}
      averageRating={averageRating}
      reviewCount={guideReviews.length}
    />
  );
}
