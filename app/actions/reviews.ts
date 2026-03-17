"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sendReviewRequestEmail } from "@/lib/email";
import { randomBytes } from "crypto";

export type ReviewRow = {
  id: string;
  booking_id: string | null;
  trek_id: string | null;
  tourist_id: string | null;
  tourist_name: string;
  tourist_email: string;
  tourist_avatar: string | null;
  rating: number;
  title: string | null;
  body: string;
  rating_guide: number | null;
  rating_value: number | null;
  rating_service: number | null;
  status: "pending" | "approved" | "rejected";
  admin_note: string | null;
  review_token: string | null;
  token_expires_at: string | null;
  language: string | null;
  helpful_count: number | null;
  created_at: string;
  updated_at: string;
};

function formatTrekDate(dateValue: any): string {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function sendReviewRequest(
  bookingId: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .select("*, treks(title, slug)")
    .eq("id", bookingId)
    .single();

  if (bookingError) return { error: bookingError.message };
  if (!booking) return { error: "Booking not found" };
  if (!booking.tourist_email) return { error: "No tourist email" };

  const { data: existing, error: existingError } = await supabase
    .from("reviews")
    .select("id")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (existingError) return { error: existingError.message };
  if (existing) return { error: "Review request already sent" };

  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const { error: insertError } = await supabase.from("reviews").insert({
    booking_id: bookingId,
    trek_id: booking.trek_id,
    tourist_name: booking.tourist_name,
    tourist_email: booking.tourist_email,
    rating: 5,
    body: "",
    status: "pending",
    review_token: token,
    token_expires_at: expires.toISOString(),
  });

  if (insertError) return { error: insertError.message };

  try {
    await sendReviewRequestEmail({
      to: booking.tourist_email,
      touristName: booking.tourist_name,
      trekTitle: booking.treks?.title ?? "your trek",
      reviewToken: token,
      bookingRef: booking.booking_ref,
      trekDate: formatTrekDate(booking.trek_date) || "your trek date",
    });
  } catch (err: any) {
    await supabase.from("reviews").delete().eq("review_token", token);
    return { error: `Email failed: ${err?.message ?? "Unknown error"}` };
  }

  revalidatePath("/admin/dashboard/booking");
  return { success: true };
}

export async function getReviewByToken(token: string): Promise<any | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, bookings(booking_ref, trek_date, adults), treks(title, slug, cover_image)")
    .eq("review_token", token)
    .single();

  if (error || !data) return null;
  if (data.token_expires_at && new Date(data.token_expires_at) < new Date()) {
    return { expired: true };
  }
  return data;
}

export async function submitReview(
  token: string,
  data: {
    rating: number;
    title?: string;
    body: string;
    rating_guide?: number;
    rating_value?: number;
    rating_service?: number;
  },
): Promise<{ success: true } | { error: string }> {
  const supabase = await createSupabaseServerClient();

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, status, token_expires_at, body")
    .eq("review_token", token)
    .single();

  if (reviewError) return { error: reviewError.message };
  if (!review) return { error: "Invalid review link" };
  if (review.token_expires_at && new Date(review.token_expires_at) < new Date()) {
    return { error: "This review link has expired" };
  }
  if (review.body && review.body.length > 0) {
    return { error: "You have already submitted a review" };
  }

  const { error } = await supabase
    .from("reviews")
    .update({
      rating: data.rating,
      title: data.title || null,
      body: data.body,
      rating_guide: data.rating_guide || null,
      rating_value: data.rating_value || null,
      rating_service: data.rating_service || null,
      status: "pending",
    })
    .eq("id", review.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getAllReviews(): Promise<any[]> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("*, treks(title, slug, cover_image), bookings(booking_ref, trek_date)")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function approveReview(
  reviewId: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  const { error } = await supabase
    .from("reviews")
    .update({ status: "approved", admin_note: null })
    .eq("id", reviewId);

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/reviews");
  revalidatePath("/experiences");
  return { success: true };
}

export async function rejectReview(
  reviewId: string,
  note?: string,
): Promise<{ success: true } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  const { error } = await supabase
    .from("reviews")
    .update({ status: "rejected", admin_note: note || null })
    .eq("id", reviewId);

  if (error) return { error: error.message };
  revalidatePath("/admin/dashboard/reviews");
  return { success: true };
}

export async function getTrekReviews(trekId: string): Promise<any[]> {
  if (!trekId) return [];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, tourist_name, tourist_avatar, rating, title, body, rating_guide, rating_value, rating_service, helpful_count, created_at",
    )
    .eq("trek_id", trekId)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function createManualReview(data: {
  trek_id: string;
  tourist_name: string;
  tourist_email: string;
  rating: number;
  title?: string;
  body: string;
  rating_guide?: number;
  rating_value?: number;
  rating_service?: number;
  status: "pending" | "approved";
}): Promise<{ success: true } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  if (!data.trek_id) return { error: "Trek is required" };
  if (!data.tourist_name) return { error: "Tourist name is required" };
  if (!data.tourist_email) return { error: "Tourist email is required" };
  if (!data.body) return { error: "Review text is required" };
  if (data.rating < 1 || data.rating > 5) return { error: "Rating must be between 1 and 5" };

  const { error } = await supabase.from("reviews").insert({
    trek_id: data.trek_id,
    tourist_name: data.tourist_name,
    tourist_email: data.tourist_email,
    tourist_id: null,
    booking_id: null,
    rating: data.rating,
    title: data.title || null,
    body: data.body,
    rating_guide: data.rating_guide || null,
    rating_value: data.rating_value || null,
    rating_service: data.rating_service || null,
    status: data.status,
    review_token: null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard/reviews");
  revalidatePath("/experiences");
  return { success: true };
}
