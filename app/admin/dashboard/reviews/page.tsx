import { getAllReviews } from "@/app/actions/reviews";
import { getAdminTrekOptions } from "@/app/actions/treks";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ReviewsManagement = dynamic(() => import("./ReviewsManagement"), {
  loading: () => (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="h-14 rounded-2xl bg-gray-100" />
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-16 rounded-2xl bg-gray-50" />
        ))}
      </div>
    </div>
  ),
});

export const metadata: Metadata = { title: "Reviews | Admin" };

export default async function AdminReviewsPage() {
  const [admin, supabase] = await Promise.all([getCurrentUser(), createSupabaseServerClient()]);
  if (!admin || admin.role !== "admin") redirect("/auth/login");

  const [reviews, treks, pendingResult, approvedResult, rejectedResult, approvedRatings] =
    await Promise.all([
      getAllReviews(0, 50),
      getAdminTrekOptions(),
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .not("body", "eq", ""),
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("status", "approved"),
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("status", "rejected"),
      supabase.from("reviews").select("rating").eq("status", "approved").not("body", "eq", ""),
    ]);

  const ratingValues = (approvedRatings.data ?? [])
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const avgRating =
    ratingValues.length > 0
      ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length
      : 0;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">Reviews</p>
        <h1 className="text-3xl font-black tracking-tight text-[#0b3a2c] sm:text-[2rem]">
          Review moderation
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">
          Approve traveler reviews, reject inappropriate content, and add manual reviews for
          completed treks.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Pending review",
            value: pendingResult.count ?? 0,
            color: "text-amber-700",
            bg: "bg-amber-50",
          },
          {
            label: "Approved",
            value: approvedResult.count ?? 0,
            color: "text-emerald-700",
            bg: "bg-emerald-50",
          },
          {
            label: "Rejected",
            value: rejectedResult.count ?? 0,
            color: "text-red-700",
            bg: "bg-red-50",
          },
          {
            label: "Avg rating",
            value: avgRating > 0 ? `${avgRating.toFixed(1)} ⭐` : "—",
            color: "text-[#0b3a2c]",
            bg: "bg-[#edf7f1]",
          },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-3xl ${stat.bg} flex flex-col gap-1 p-6`}>
            <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
              {stat.label}
            </p>
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <ReviewsManagement
        initialReviews={reviews}
        treks={treks.map((t) => ({ id: t.id, title: t.title, slug: t.slug }))}
        initialOffset={reviews.length}
      />
    </div>
  );
}
