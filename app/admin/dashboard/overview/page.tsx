import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import {
  CalendarCheck,
  Compass,
  Ticket,
  TrendingUp,
  UsersRound,
  Clock,
  Star,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview | Admin" };

export default async function AdminOverviewPage() {
  const [user, supabase] = await Promise.all([getCurrentUser(), createSupabaseServerClient()]);

  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  // Parallel fetches
  const [
    { count: totalTreks },
    { count: todayBookings },
    { count: pendingBookings },
    { count: pendingReviews },
    { count: totalGuides },
    { data: recentBookings },
    { data: revenueData },
    { count: pendingVerifications },
    { count: walkinToday },
  ] = await Promise.all([
    supabase.from("treks").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("trek_date", today),
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
      .neq("body", ""),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "guide")
      .eq("is_active", true),
    supabase
      .from("bookings")
      .select(
        "id, tourist_name, booking_ref, trek_date, status, payment_status, source, treks(title)",
      )
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("bookings")
      .select("total_price")
      .eq("payment_status", "paid")
      .gte("created_at", monthStart),
    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .eq("role", "guide")
      .eq("verification_status", "pending"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("source", "walkin")
      .eq("trek_date", today),
  ]);

  const monthRevenue = (revenueData ?? []).reduce((sum, b) => sum + (b.total_price ?? 0), 0);

  const stats = [
    {
      label: "Active treks",
      value: totalTreks ?? 0,
      sub: "Published",
      icon: Compass,
      href: "/admin/dashboard/treks",
    },
    {
      label: "Bookings today",
      value: todayBookings ?? 0,
      sub: `${walkinToday ?? 0} walk-ins`,
      icon: Ticket,
      href: "/admin/dashboard/booking",
    },
    {
      label: "Pending bookings",
      value: pendingBookings ?? 0,
      sub: "Need confirmation",
      icon: Clock,
      href: "/admin/dashboard/booking",
      alert: (pendingBookings ?? 0) > 0,
    },
    {
      label: "Revenue this month",
      value: `$${monthRevenue.toFixed(0)}`,
      sub: "Paid bookings only",
      icon: TrendingUp,
      href: "/admin/dashboard/booking",
    },
  ];

  const tasks = [
    pendingReviews && pendingReviews > 0
      ? {
          title: "Reviews to moderate",
          detail: `${pendingReviews} review${pendingReviews > 1 ? "s" : ""} waiting approval`,
          href: "/admin/dashboard/reviews",
          urgent: true,
        }
      : null,
    pendingVerifications && pendingVerifications > 0
      ? {
          title: "Guide verifications pending",
          detail: `${pendingVerifications} guide${pendingVerifications > 1 ? "s" : ""} waiting verification`,
          href: "/admin/dashboard/users",
          urgent: true,
        }
      : null,
    {
      title: "Total active guides",
      detail: `${totalGuides ?? 0} guides on platform`,
      href: "/admin/dashboard/users",
      urgent: false,
    },
  ].filter(Boolean) as { title: string; detail: string; href: string; urgent: boolean }[];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="flex flex-col gap-6 rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-sm sm:p-10">
        <div>
          <p className="text-sm font-semibold text-gray-500">Dashboard</p>
          <h1 className="text-3xl font-black text-[#0b3a2c] sm:text-4xl">
            Welcome back, {user?.full_name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="mt-2 max-w-2xl text-base font-medium text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard/treks/new"
            className="rounded-full bg-[#0b3a2c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0d4a38]"
          >
            + Create new trek
          </Link>
          <Link
            href="/admin/dashboard/announcements"
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            📢 Post announcement
          </Link>
          <Link
            href="/admin/dashboard/booking"
            className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            View all bookings
          </Link>
        </div>
      </section>

      {/* Real stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex items-start gap-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-[#0b3a2c] ${stat.alert ? "bg-amber-50" : "bg-[#0b3a2c]/10"}`}
            >
              <stat.icon className={`h-6 w-6 ${stat.alert ? "text-amber-600" : ""}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
              <p className="text-2xl font-black text-[#0b3a2c]">{stat.value}</p>
              <p
                className={`text-xs font-semibold ${stat.alert ? "text-amber-600" : "text-emerald-600"}`}
              >
                {stat.sub}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* Recent bookings + tasks */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Recent bookings — REAL DATA */}
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">Latest</p>
              <h2 className="text-2xl font-black text-[#0b3a2c]">Recent bookings</h2>
            </div>
            <Link
              href="/admin/dashboard/booking"
              className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {(recentBookings ?? []).map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-[#f7f9f8] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{booking.tourist_name}</p>
                  <p className="text-xs font-semibold text-gray-500">
                    {(booking.treks as any)?.title ?? "—"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">{booking.trek_date}</span>
                  {booking.source === "walkin" && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-black text-blue-700">
                      Walk-in
                    </span>
                  )}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                      booking.status === "confirmed"
                        ? "bg-emerald-50 text-emerald-700"
                        : booking.status === "completed"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      booking.payment_status === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {booking.payment_status}
                  </span>
                </div>
              </div>
            ))}
            {(recentBookings ?? []).length === 0 && (
              <p className="py-8 text-center text-sm text-gray-400">No bookings yet</p>
            )}
          </div>
        </div>

        {/* Priority tasks */}
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500">Action needed</p>
            <h2 className="text-2xl font-black text-[#0b3a2c]">Priority tasks</h2>
          </div>
          <div className="space-y-3">
            {tasks.map((task) => (
              <Link
                key={task.title}
                href={task.href}
                className={`block rounded-2xl border p-4 transition-all hover:shadow-sm ${
                  task.urgent ? "border-amber-100 bg-amber-50" : "border-black/5 bg-[#f7f9f8]"
                }`}
              >
                <p className="text-sm font-semibold text-gray-800">{task.title}</p>
                <p
                  className={`mt-0.5 text-xs font-semibold ${task.urgent ? "text-amber-600" : "text-gray-500"}`}
                >
                  {task.detail}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
