import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NavbarWrapper from "@/app/components/NavbarWrapper";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { BASE_URL, SITE_NAME } from "@/lib/config";
import { getCategorySlug } from "@/lib/category-slug";
import { createSupabasePublicClient, createSupabaseServerClient } from "@/lib/supabase/server";
import CategoryPageClient from "./CategoryPageClient";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const supabase = createSupabasePublicClient();
    const { data } = await supabase.from("categories").select("*");
    return (data ?? []).map((cat: { slug?: string | null; name: string }) => ({
      slug: getCategorySlug(cat),
    }));
  } catch (error) {
    console.error("Failed to generate static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase.from("categories").select("*");
  const category = (categories ?? []).find(
    (item: { slug?: string | null; name: string }) => getCategorySlug(item) === slug,
  );

  if (!category) return { title: "Category not found" };

  const title = `${category.name} in Ourika Valley — Book with Local Guides | Ourika Travels`;
  const description =
    category.description ||
    `Explore ${category.name} experiences in Ourika Valley, Morocco. Certified local guides, small groups, authentic adventures near Marrakech.`;

  return {
    title,
    description,
    keywords: [
      category.name,
      `${category.name} Ourika Valley`,
      `${category.name} Morocco`,
      `Ourika Valley ${category.name}`,
      "Ourika Valley tours",
      "Morocco guided tours",
    ],
    openGraph: {
      type: "website",
      url: `${BASE_URL}/category/${slug}`,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [
        {
          url: category.photo || `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${category.name} in Ourika Valley, Morocco`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [category.photo || `${BASE_URL}/og-image.jpg`],
    },
    alternates: { canonical: `${BASE_URL}/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: categories } = await supabase.from("categories").select("*");
  const category = (categories ?? []).find(
    (item: { slug?: string | null; name: string }) => getCategorySlug(item) === slug,
  );

  if (!category) notFound();
  const { data: treks } = await supabase
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
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  const breadcrumbItems = [
    { label: "Home", href: BASE_URL },
    { label: "Experiences", href: `${BASE_URL}/experiences` },
    { label: category.name, href: `${BASE_URL}/category/${getCategorySlug(category)}` },
  ];
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} in Ourika Valley`,
    description: `All ${category.name} experiences currently available in Ourika Valley, Morocco`,
    url: `${BASE_URL}/category/${getCategorySlug(category)}`,
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
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <CategoryPageClient slug={slug} category={category} treks={treks ?? []} />
      <Footer />
    </div>
  );
}
