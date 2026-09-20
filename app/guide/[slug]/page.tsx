import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { experiencesData } from "@/lib/data/experiences";
import { BASE_URL } from "@/lib/config";
import { staticGuideSlugs } from "@/lib/data/home";
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

const staticGuide = {
  id: "guide-1", slug: "local-guides", full_name: "Youssef Amrani", location: "Ourika Valley", bio: "A local guide sharing the landscapes, villages, and traditions of the Atlas Mountains.", phone: null, avatar_url: null, badge_image_url: null, guide_badge_code: null, is_verified: true, is_active: true, years_experience: 8, languages: ["English", "French", "Arabic"], specialties: ["Mountain walks", "Berber culture"], certifications: ["Local mountain guide"],
};

function getActiveGuides() { return [staticGuide]; }

export function generateStaticParams() {
  return staticGuideSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GuidePublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guides = getActiveGuides();
  const normalizedSlug = normalizeGuideSlug(slug);
  const guide = guides.find((candidate: any) => getGuideSlug(candidate) === normalizedSlug);

  if (!guide) {
    return {
      title: "Guide Not Found | Nomadicashara",
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
  const guides = getActiveGuides();
  const normalizedSlug = normalizeGuideSlug(slug);
  const guide = guides.find((candidate: any) => getGuideSlug(candidate) === normalizedSlug);

  if (!guide) {
    notFound();
  }

  const canonicalSlug = getGuideSlug(guide);
  if (slug !== canonicalSlug) {
    permanentRedirect(`/guide/${canonicalSlug}`);
  }

  const guideTreks: Trek[] = experiencesData.slice(0, 4).map((item) => ({ id: String(item.id), title: item.title, slug: item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"), cover_image: item.image, duration: item.duration, price_per_person: item.price, description: item.title }));
  const guideReviews: Review[] = [];

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
