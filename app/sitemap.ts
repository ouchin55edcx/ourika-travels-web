import type { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/config";
import { getCategorySlug } from "@/lib/category-slug";
import { getGuideSlug } from "@/lib/guide-slug";
import { staticCategories, staticTourSlugs, staticGuideSlugs } from "@/lib/data/home";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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

  const trekRoutes: MetadataRoute.Sitemap = staticTourSlugs.map((slug) => ({
    url: `${BASE_URL}/tour/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.9,
  }));
  const categoryRoutes: MetadataRoute.Sitemap = staticCategories.map((category) => ({
    url: `${BASE_URL}/category/${getCategorySlug(category)}`, lastModified: now, changeFrequency: "weekly", priority: 0.8,
  }));
  const guideRoutes: MetadataRoute.Sitemap = staticGuideSlugs.map((slug) => ({
    url: `${BASE_URL}/guide/${slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.7,
  }));

  return [...staticRoutes, ...trekRoutes, ...categoryRoutes, ...guideRoutes];
}
