import type { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/config";
import { getCategorySlug } from "@/lib/category-slug";
import { createSupabasePublicClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createSupabasePublicClient();
  const now = new Date();

  const [{ data: treks }, { data: categories }] = await Promise.all([
    supabase.from("treks").select("slug, updated_at").eq("is_active", true).not("slug", "is", null),
    supabase.from("categories").select("*"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/experiences`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const trekRoutes: MetadataRoute.Sitemap = (treks ?? []).map((trek) => ({
    url: `${BASE_URL}/tour/${trek.slug}`,
    lastModified: trek.updated_at ? new Date(trek.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((category) => ({
    url: `${BASE_URL}/category/${getCategorySlug(category)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...trekRoutes, ...categoryRoutes];
}
