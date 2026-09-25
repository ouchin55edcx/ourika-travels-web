import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nomadica Sahara",
    short_name: "Nomadica",
    description: "Experiencias auténticas por todo Marruecos.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#12355B",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
