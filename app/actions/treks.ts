"use server";

import { createSupabaseServerClient, createSupabasePublicClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { uploadToCloudflare, deleteFromCloudflare } from "@/lib/cloudflare-images";
import { getCachedTrekOptions } from "@/lib/admin-cache";

// ━━━ TYPES TO EXPORT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type GalleryImage = { src: string; alt: string };

export type ItineraryStep = {
  id: number;
  title: string;
  duration: string;
  shortLabel?: string;
  image?: string;
  description?: string;
  buttonLabel?: string;
  coordinates?: { lng: number; lat: number };
};

export type ReviewBreakdown = { label: string; count: number; percentage: string };

export type Trek = {
  id: string;
  title: string;
  slug: string;
  creator_id?: string | null;
  category_id: string | null;
  category_name?: string; // Virtual field for display
  categories?: { name: string } | { name: string }[] | null;
  cover_image: string;
  gallery_images: GalleryImage[];
  total_photo_count: number;
  price_per_adult: number;
  previous_price: number | null;
  price_note: string | null;
  rating: number;
  review_count: number;
  review_breakdown: ReviewBreakdown[];
  popular_mentions: string[];
  about: string;
  highlights: string[];
  meta_description: string | null;
  duration: string;
  time_of_day: "Morning" | "Afternoon" | "Evening" | "Flexible";
  max_group_size: number;
  min_age: number;
  max_age: number;
  start_time: string | null;
  mobile_ticket: boolean;
  avg_booking_lead_days: number | null;
  live_guide_languages: string[];
  audio_guide_languages: string[];
  written_guide_languages: string[];
  start_location: string;
  pickup_available: boolean;
  itinerary_steps: ItineraryStep[];
  map_image_url: string | null;
  free_cancellation_hours: number;
  reserve_now_pay_later: boolean;
  badge: string | null;
  award: string | null;
  included: string[];
  not_included: string[];
  services: string[];
  reviews?: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TrekFormData = Omit<
  Trek,
  "id" | "slug" | "created_at" | "updated_at" | "category_name"
>;

function canManageTreks(
  user: Awaited<ReturnType<typeof getCurrentUser>> | null,
) {
  return !!user && (user.role === "admin" || (user.role === "guide" && user.can_add_treks));
}

// ━━━ PRIVATE HELPERS (not exported) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uniqueSlug(supabase: any, base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let counter = 1;
  while (true) {
    let q = supabase.from("treks").select("id").eq("slug", slug);
    if (excludeId) q = q.neq("id", excludeId);
    const { data } = await q.maybeSingle();
    if (!data) return slug;
    slug = `${base}-${++counter}`;
  }
}

// ━━━ SERVER ACTIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getTreks(): Promise<Trek[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("treks")
    .select(
      `
      id,
      title,
      slug,
      cover_image,
      price_per_adult,
      duration,
      is_active,
      categories (
        name
      )
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching treks:", error);
    return [];
  }

  return (data || []).map((item: any) => ({
    ...item,
    category_name: item.categories?.name,
  }));
}

export async function getAdminTrekOptions() {
  return getCachedTrekOptions();
}

export async function getTrekById(id: string): Promise<Trek | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("treks").select("*").eq("id", id).single();

  if (error || !data) return null;
  return data as Trek;
}

export async function getTrekBySlug(slug: string): Promise<Trek | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("treks")
    .select("*, categories(name)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;

  // Fetch approved reviews for this trek
  const { data: reviewsData } = await supabase
    .from("reviews")
    .select(
      "id, tourist_name, tourist_avatar, rating, title, body, rating_guide, rating_value, rating_service, created_at"
    )
    .eq("trek_id", data.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Transform reviews to match expected format
  const reviews = (reviewsData || []).map((review: any) => ({
    author: review.tourist_name || "Anonymous",
    contributions: "Verified traveler",
    date: review.created_at
      ? new Date(review.created_at).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "",
    title: review.title,
    body: review.body || "",
    avatar: review.tourist_avatar,
    rating: review.rating,
    rating_guide: review.rating_guide,
    rating_value: review.rating_value,
    rating_service: review.rating_service,
  }));

  // Calculate review breakdown
  const reviewCount = reviews.length;
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r: any) => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating as keyof typeof ratingCounts]++;
    }
  });

  const reviewBreakdown = [
    { label: "Excellent", count: ratingCounts[5], percentage: reviewCount > 0 ? `${Math.round((ratingCounts[5] / reviewCount) * 100)}%` : "0%" },
    { label: "Very good", count: ratingCounts[4], percentage: reviewCount > 0 ? `${Math.round((ratingCounts[4] / reviewCount) * 100)}%` : "0%" },
    { label: "Average", count: ratingCounts[3], percentage: reviewCount > 0 ? `${Math.round((ratingCounts[3] / reviewCount) * 100)}%` : "0%" },
    { label: "Poor", count: ratingCounts[2], percentage: reviewCount > 0 ? `${Math.round((ratingCounts[2] / reviewCount) * 100)}%` : "0%" },
    { label: "Terrible", count: ratingCounts[1], percentage: reviewCount > 0 ? `${Math.round((ratingCounts[1] / reviewCount) * 100)}%` : "0%" },
  ];

  // Calculate average rating
  const avgRating = reviewCount > 0
    ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviewCount
    : data.rating || 0;

  return {
    ...data,
    reviews,
    review_count: reviewCount || data.review_count || 0,
    rating: avgRating || data.rating || 0,
    review_breakdown: reviewBreakdown,
    popular_mentions: data.popular_mentions || [],
  } as Trek;
}

export async function getPublicTreks(): Promise<{ slug: string }[]> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase.from("treks").select("slug").eq("is_active", true);
  if (error) return [];
  return data || [];
}

export async function createTrek(
  data: TrekFormData,
): Promise<{ success: true; slug: string } | { error: string }> {
  const user = await getCurrentUser();
  if (!canManageTreks(user)) return { error: "Forbidden" };
  const currentUser = user!;

  const supabase = await createSupabaseServerClient();
  const slugBase = slugify(data.title);
  const slug = await uniqueSlug(supabase, slugBase);

  const { slug: _slug, cover_image_id, ...rest } = data as any;
  const { error } = await supabase
    .from("treks")
    .insert({ ...rest, slug, creator_id: currentUser.id });

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard/treks");
  revalidatePath("/experiences");
  revalidatePath("/");
  return { success: true, slug };
}

export async function updateTrek(
  id: string,
  data: Partial<TrekFormData>,
): Promise<{ success: true } | { error: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { error: "Forbidden" };

  const supabase = await createSupabaseServerClient();
  let slug;
  if (data.title) {
    slug = await uniqueSlug(supabase, slugify(data.title), id);
  }

  const { slug: _slug, id: _id, cover_image_id, ...rest } = data as any;
  const { error } = await supabase
    .from("treks")
    .update({ ...rest, ...(slug && { slug }) })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard/treks");
  revalidatePath("/experiences");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTrek(id: string): Promise<{ success: true } | { error: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { error: "Forbidden" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("treks").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard/treks");
  revalidatePath("/experiences");
  revalidatePath("/");
  return { success: true };
}

export async function toggleTrekStatus(
  id: string,
  isActive: boolean,
): Promise<{ success: true; message: string } | { error: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { error: "Forbidden" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("treks").update({ is_active: isActive }).eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard/treks");
  revalidatePath("/experiences");
  revalidatePath("/");
  return { success: true, message: `Trek ${isActive ? "published" : "saved as draft"}` };
}

export async function uploadTrekImage(
  formData: FormData,
): Promise<{ url: string; imageId: string } | { error: string }> {
  const user = await getCurrentUser();
  if (!canManageTreks(user)) return { error: "Forbidden" };
  const currentUser = user!;

  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string; // 'covers'|'gallery'|'itinerary'

  if (!file || file.size === 0) return { error: "No file provided" };
  if (file.size > 10 * 1024 * 1024) return { error: "File too large (max 10 MB)" };

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return { error: "Invalid file type. Use JPG, PNG or WebP." };
  }

  try {
    const result = await uploadToCloudflare(file, {
      folder, // stored as metadata tag
      uploadedBy: currentUser.id,
      trek: "pending", // updated after trek is saved
    });
    return result;
  } catch (err: any) {
    console.error("[Cloudflare Images] upload error:", err);
    return { error: err.message || "Upload failed. Please try again." };
  }
}

export async function deleteTrekImage(
  imageId: string,
): Promise<{ success: true } | { error: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return { error: "Forbidden" };
  try {
    await deleteFromCloudflare(imageId);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Delete failed" };
  }
}
