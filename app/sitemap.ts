import type { MetadataRoute } from "next";

import { experiencesData } from "@/lib/data/experiences";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ourikatreks.com";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/experiences`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/category/outdoors`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/category/food`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/category/culture`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/category/water`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = experiencesData.map((experience) => {
    const slug = slugify(experience.title);
    return {
      url: `${BASE_URL}/tour/${slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    };
  });

  return [...staticRoutes, ...dynamicRoutes];
}
