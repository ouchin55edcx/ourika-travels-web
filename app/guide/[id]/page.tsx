import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { BASE_URL } from "@/lib/config";
import GuidePublicProfile from "./GuidePublicProfile";

interface GuidePublicPageProps {
  params: Promise<{ id: string }>;
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

export async function generateMetadata({ params }: GuidePublicPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: guide } = await supabase
    .from("users")
    .select(
      "full_name, bio, location, specialties, languages, years_experience, avatar_url, is_verified",
    )
    .eq("id", id)
    .eq("role", "guide")
    .eq("is_active", true)
    .single();

  if (!guide) {
    return {
      title: "Guide Not Found | Ourika Travels",
      description: "This guide profile is not available.",
    };
  }

  const name = guide.full_name || "Guide";
  const title = `${name} — Certified Local Guide in ${guide.location || "Ourika Valley"} | Ourika Travels`;
  const description =
    guide.bio ||
    `${name} is a certified local guide based in ${guide.location || "Ourika Valley, Morocco"}. Book an authentic Atlas Mountains experience with ${guide.specialties?.[0] || "expert guidance"}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/guide/${id}`,
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
  };
}

export default async function GuidePublicPage({ params }: GuidePublicPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  // Fetch guide profile
  const { data: guide, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .eq("role", "guide")
    .eq("is_active", true)
    .single();

  if (error || !guide) {
    notFound();
  }

  // Fetch guide's treks/experiences (from completed bookings)
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
    .eq("guide_id", id)
    .eq("status", "completed")
    .not("treks", "is", null);

  // Extract unique treks from bookings
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

  // Fetch approved reviews for this guide's bookings
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
    .eq("bookings.guide_id", id)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  // Transform reviews to include tourist info at top level
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

  // Calculate average rating
  const averageRating =
    guideReviews.length > 0
      ? (guideReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / guideReviews.length).toFixed(1)
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
