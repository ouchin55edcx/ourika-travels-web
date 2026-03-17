import { getAllReviews } from "@/app/actions/reviews";
import { getTreks } from "@/app/actions/treks";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ReviewsManagement from "./ReviewsManagement";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Reviews | Admin" };

export default async function AdminReviewsPage() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") redirect("/auth/login");

  const [reviews, treks] = await Promise.all([getAllReviews(), getTreks()]);

  const pending = reviews.filter((r) => r.status === "pending" && r.body?.length > 0).length;
  const approved = reviews.filter((r) => r.status === "approved").length;
  const rejected = reviews.filter((r) => r.status === "rejected").length;
  const avgRating = reviews
    .filter((r) => r.status === "approved" && r.rating)
    .reduce((sum, r, _, arr) => (arr.length ? sum + r.rating / arr.length : 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">Reviews</p>
        <h1 className="text-4xl font-black tracking-tight text-[#0b3a2c]">Review moderation</h1>
        <p className="mt-1 text-base font-medium text-gray-500">
          Approve traveler reviews, reject inappropriate content, and add manual reviews for
          completed treks.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Pending review", value: pending, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Approved", value: approved, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Rejected", value: rejected, color: "text-red-700", bg: "bg-red-50" },
          {
            label: "Avg rating",
            value: avgRating > 0 ? `${avgRating.toFixed(1)} ⭐` : "—",
            color: "text-[#0b3a2c]",
            bg: "bg-[#f0faf5]",
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
      />
    </div>
  );
}
