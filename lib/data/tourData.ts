export const navigationItems = [
  { label: "Overview", id: "overview" },
  { label: "Details", id: "details" },
  { label: "Highlights", id: "highlights" },
  { label: "Itinerary", id: "itinerary" },
  { label: "Reviews", id: "reviews" },
] as const;

export function formatTitleFromSlug(slug?: string) {
  if (!slug) {
    return "";
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
