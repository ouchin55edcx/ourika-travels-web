export const navigationItems = ["Overview", "Details", "Itinerary", "Operator", "Reviews"] as const;

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
