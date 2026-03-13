import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";
import { BASE_URL, SITE_NAME } from "@/lib/config";

const categorySlugs = ["outdoors", "food", "culture", "water"] as const;

const categoryMeta: Record<string, { title: string; description: string }> = {
  outdoors: {
    title: "Outdoor Adventures in Ourika Valley",
    description:
      "Explore trekking, hiking, and outdoor adventures in Ourika Valley's stunning Atlas Mountains landscape.",
  },
  food: {
    title: "Authentic Moroccan Food Experiences",
    description:
      "Taste the flavours of Morocco with cooking classes, Berber dinners, and local food tours in Ourika Valley.",
  },
  culture: {
    title: "Cultural Immersion Tours in Ourika Valley",
    description:
      "Dive into Berber traditions, local crafts, and cultural experiences guided by certified locals in Ourika.",
  },
  water: {
    title: "Water & Waterfall Experiences in Ourika Valley",
    description:
      "Discover the iconic Setti-Fatma waterfalls and refreshing water-based experiences in Ourika Valley, Morocco.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meta = categoryMeta[slug] ?? {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Experiences`,
    description: `Explore ${slug} experiences in Ourika Valley with certified local guides.`,
  };

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      type: "website",
      url: `${BASE_URL}/category/${slug}`,
      title: `${meta.title} | ${SITE_NAME}`,
      description: meta.description,
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    alternates: { canonical: `${BASE_URL}/category/${slug}` },
  };
}

export function generateStaticParams() {
  return categorySlugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!categorySlugs.includes(slug as (typeof categorySlugs)[number])) {
    notFound();
  }

  return <CategoryPageClient slug={slug} />;
}
