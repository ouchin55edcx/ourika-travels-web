import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { BASE_URL, SITE_NAME } from '@/lib/config';
import NavbarWrapper from '@/app/components/NavbarWrapper';
import Footer from '@/components/Footer';
import CategoryPageClient from './CategoryPageClient';

// Helper: convert category name to URL slug
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export const dynamicParams = true;

// Build static params from real categories in DB
export async function generateStaticParams() {
  try {
    // Use REST API directly to avoid cookies() context issue
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/categories?select=name`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
        },
      }
    );
    const data = await response.json();
    return (data ?? []).map((cat: { name: string }) => ({ slug: nameToSlug(cat.name) }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  // Find category whose name matches this slug
  const { data: categories } = await supabase.from('categories').select('*');
  const category = (categories ?? []).find(c => nameToSlug(c.name) === slug);

  if (!category) return { title: 'Category not found' };

  const title       = `${category.name} Experiences in Ourika Valley`;
  const description = category.description ||
    `Explore ${category.name} experiences in Ourika Valley with certified local guides.`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: `${BASE_URL}/category/${slug}`,
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [{ url: category.photo || `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
    alternates: { canonical: `${BASE_URL}/category/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  // Fetch all categories, find the one matching this slug
  const { data: allCategories } = await supabase.from('categories').select('*');
  const category = (allCategories ?? []).find(c => nameToSlug(c.name) === slug);

  if (!category) notFound();

  // Fetch all active treks for this category
  const { data: treks } = await supabase
    .from('treks')
    .select(`
      id, title, slug, cover_image,
      rating, review_count,
      price_per_adult, previous_price,
      badge, award, duration,
      time_of_day, live_guide_languages,
      is_active, categories(name)
    `)
    .eq('is_active', true)
    .eq('category_id', category.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper sticky={false} />
      <CategoryPageClient
        slug={slug}
        category={category}
        treks={treks ?? []}
      />
      <Footer />
    </div>
  );
}

