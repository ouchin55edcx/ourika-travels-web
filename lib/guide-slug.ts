type GuideLike = {
  id?: string | null;
  slug?: string | null;
  full_name?: string | null;
};

export function slugifyGuideName(name?: string | null) {
  if (!name) return "guide-ourika";

  const base = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base || "guide"}-guide-ourika`;
}

export function getGuideSlug(guide: GuideLike) {
  return guide.slug || slugifyGuideName(guide.full_name);
}

export function getGuidePublicPath(guide: GuideLike) {
  return `/guide/${getGuideSlug(guide)}`;
}
