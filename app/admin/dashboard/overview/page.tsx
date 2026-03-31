import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Clock, Compass, Ticket, TrendingUp } from "lucide-react";
import RevenueChart from "../components/RevenueChart";

export const metadata: Metadata = { title: "Overview | Admin" };

function StatsFallback() {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-black/5 bg-white p-4 shadow-sm lg:p-6"
        >
          <div className="mb-3 h-10 w-10 rounded-2xl bg-gray-100 lg:h-12 lg:w-12" />
          <div className="h-3 w-20 rounded-full bg-gray-100" />
          <div className="mt-3 h-8 w-16 rounded-full bg-gray-200" />
          <div className="mt-2 h-3 w-24 rounded-full bg-gray-100" />
        </div>
      ))}
    </section>
  );
}

function CardFallback() {
  return (
    <div className="animate-pulse rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-6 space-y-2">
        <div className="h-4 w-20 rounded-full bg-gray-100" />
        <div className="h-7 w-40 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-16 rounded-2xl bg-gray-50" />
        ))}
      </div>
    </div>
  );
}

async function OverviewStatsSection() {
  const supabase = await createSupabaseServerClient();
  const today = new Date().toISOString().split("T")[0];
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

  const [
    totalTreks,
    todayBookings,
    pendingBookings,
    walkinToday,
    revenueRows,
  ] = await Promise.all([
    supabase.from("treks").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("trek_date", today),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("source", "walkin")
      .eq("trek_date", today),
    supabase
      .from("bookings")
      .select("total_price")
      .eq("payment_status", "paid")
      .gte("created_at", monthStart),
  ]);

  const monthRevenue = (revenueRows.data ?? []).reduce((sum, row) => sum + (row.total_price ?? 0), 0);

  const stats = [
    {
      label: "Active treks",
      value: totalTreks.count ?? 0,
      sub: "Published",
      icon: Compass,
      href: "/admin/dashboard/treks",
    },
    {
      label: "Bookings today",
      value: todayBookings.count ?? 0,
      sub: `${walkinToday.count ?? 0} walk-ins`,
      icon: Ticket,
      href: "/admin/dashboard/booking",
    },
    {
      label: "Pending bookings",
      value: pendingBookings.count ?? 0,
      sub: "Need confirmation",
      icon: Clock,
      href: "/admin/dashboard/booking",
      alert: (pendingBookings.count ?? 0) > 0,
    },
    {
      label: "Revenue this month",
      value: `$${monthRevenue.toFixed(0)}`,
      sub: "Paid bookings only",
      icon: TrendingUp,
      href: "/admin/dashboard/booking",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <Link
          key={stat.label}
          href={stat.href}
          className="group flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm transition-all hover:shadow-md lg:p-6"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[#0b3a2c] lg:h-12 lg:w-12 ${stat.alert ? "bg-amber-50" : "bg-[#0b3a2c]/10"}`}
          >
            <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.alert ? "text-amber-600" : ""}`} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-semibold text-gray-500 lg:text-sm">{stat.label}</p>
            <p className="text-xl font-black text-[#0b3a2c] lg:text-2xl">{stat.value}</p>
            <p
              className={`truncate text-[10px] font-semibold lg:text-xs ${stat.alert ? "text-amber-600" : "text-emerald-600"}`}
            >
              {stat.sub}
            </p>
          </div>
        </Link>
      ))}
    </section>
  );
}

async function OverviewRevenueSection() {
  const supabase = await createSupabaseServerClient();
  const last7Days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date.toISOString().split("T")[0];
  });

  const { data } = await supabase
    .from("bookings")
    .select("trek_date, total_price")
    .eq("payment_status", "paid")
    .in("trek_date", last7Days)
    .order("trek_date", { ascending: true });

  const chartData = last7Days.map((date) => {
    const dayBookings = (data ?? []).filter((booking) => booking.trek_date === date);
    const dayRevenue = dayBookings.reduce((sum, booking) => sum + (booking.total_price ?? 0), 0);
    return {
      label: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      value: dayRevenue,
    };
  });

  return (
    <section className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">Analytics</p>
          <h2 className="text-xl font-black text-[#0b3a2c] sm:text-2xl">Revenue (Last 7 Days)</h2>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
          <TrendingUp className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-black text-emerald-700">
            ${chartData.reduce((sum, row) => sum + row.value, 0).toLocaleString()}
          </span>
        </div>
      </div>
      <RevenueChart data={chartData} height={220} />
    </section>
  );
}

async function OverviewRecentBookingsSection() {
  const supabase = await createSupabaseServerClient();
  const { data: recentBookings } = await supabase
    .from("bookings")
    .select("id, tourist_name, booking_ref, trek_date, status, payment_status, source, treks(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-4 flex items-center justify-between lg:mb-6">
        <div>
          <p className="text-sm font-semibold text-gray-500">Latest</p>
          <h2 className="text-xl font-black text-[#0b3a2c] sm:text-2xl">Recent bookings</h2>
        </div>
        <Link
          href="/admin/dashboard/booking"
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 sm:px-4 sm:py-2"
        >
          View all
        </Link>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {(recentBookings ?? []).map((booking) => (
          <div
            key={booking.id}
            className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-[#f7f9f8] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
          >
            <div>
              <p className="text-sm font-semibold text-gray-800">{booking.tourist_name}</p>
              <p className="text-xs font-semibold text-gray-500">
                {(booking.treks as { title?: string } | null)?.title ?? "—"}
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
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm sm:px-3 sm:py-1 sm:text-xs ${
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
  );
}

async function OverviewTasksSection() {
  const supabase = await createSupabaseServerClient();
  const [pendingReviews, pendingVerifications, totalGuides] = await Promise.all([
    supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending")
      .not("body", "eq", ""),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "guide")
      .eq("verification_status", "pending"),
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("role", "guide")
      .eq("is_active", true),
  ]);

  const tasks = [
    (pendingReviews.count ?? 0) > 0
      ? {
          title: "Reviews to moderate",
          detail: `${pendingReviews.count} review${(pendingReviews.count ?? 0) > 1 ? "s" : ""} waiting approval`,
          href: "/admin/dashboard/reviews",
          urgent: true,
        }
      : null,
    (pendingVerifications.count ?? 0) > 0
      ? {
          title: "Guide verifications pending",
          detail: `${pendingVerifications.count} guide${(pendingVerifications.count ?? 0) > 1 ? "s" : ""} waiting verification`,
          href: "/admin/dashboard/users",
          urgent: true,
        }
      : null,
    {
      title: "Total active guides",
      detail: `${totalGuides.count ?? 0} guides on platform`,
      href: "/admin/dashboard/users",
      urgent: false,
    },
  ].filter(Boolean) as { title: string; detail: string; href: string; urgent: boolean }[];

  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <div className="mb-4 lg:mb-6">
        <p className="text-sm font-semibold text-gray-500">Action needed</p>
        <h2 className="text-xl font-black text-[#0b3a2c] sm:text-2xl">Priority tasks</h2>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {tasks.map((task) => (
          <Link
            key={task.title}
            href={task.href}
            className={`block rounded-2xl border p-3 transition-all hover:shadow-sm sm:p-4 ${
              task.urgent ? "border-amber-100 bg-amber-50" : "border-black/5 bg-[#f7f9f8]"
            }`}
          >
            <p className="text-sm font-semibold text-gray-800">{task.title}</p>
            <p className={`mt-0.5 text-xs font-semibold ${task.urgent ? "text-amber-600" : "text-gray-500"}`}>
              {task.detail}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 rounded-[2.5rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div>
          <p className="text-sm font-semibold text-gray-500">Dashboard</p>
          <h1 className="text-2xl font-black text-[#0b3a2c] sm:text-[1.9rem] lg:text-[2.1rem]">
            Welcome back, {user.full_name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="mt-1 max-w-2xl text-sm font-medium text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/admin/dashboard/treks/new"
            className="rounded-full bg-[#0b3a2c] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0f3d24] sm:px-5 sm:py-2.5"
          >
            + Create new trek
          </Link>
          <Link
            href="/admin/dashboard/announcements"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:px-5 sm:py-2.5"
          >
            📢 Post announcement
          </Link>
          <Link
            href="/admin/dashboard/booking"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 sm:px-5 sm:py-2.5"
          >
            View all bookings
          </Link>
        </div>
      </section>

      <Suspense fallback={<StatsFallback />}>
        <OverviewStatsSection />
      </Suspense>

      <Suspense fallback={<CardFallback />}>
        <OverviewRevenueSection />
      </Suspense>

      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <Suspense fallback={<CardFallback />}>
          <OverviewRecentBookingsSection />
        </Suspense>
        <Suspense fallback={<CardFallback />}>
          <OverviewTasksSection />
        </Suspense>
      </section>
    </div>
  );
}
