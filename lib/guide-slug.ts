type GuideLike = {
  id?: string | null;
  slug?: string | null;
  full_name?: string | null;
};

export function normalizeGuideSlug(value?: string | null) {
  if (!value) return "";

  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/-guide-ourika$/, "")
    .replace(/(?:-guide)+$/, "")
    .replace(/^-|-$/g, "");
}

export function slugifyGuideName(name?: string | null) {
  return normalizeGuideSlug(name) || "guide";
}

export function getGuideSlug(guide: GuideLike) {
  return normalizeGuideSlug(guide.slug) || slugifyGuideName(guide.full_name);
}

export function getGuidePublicPath(guide: GuideLike) {
  return `/guide/${getGuideSlug(guide)}`;
}
