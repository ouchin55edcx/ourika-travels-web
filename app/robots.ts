import type { MetadataRoute } from "next";

import { BASE_URL } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/guide/"],
      disallow: [
        "/reservation",
        "/reservation-historic",
        "/wishlist",
        "/ticket-generator",
        "/api/",
        "/admin/",
        "/dashboard/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
