export function getCategorySlug(category: { name: string; slug?: string | null }) {
  return category.slug || category.name.toLowerCase().trim().replace(/\s+/g, "-");
}
