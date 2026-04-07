import { getAllBookings } from "@/app/actions/bookings";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import QRCode from "qrcode";
import dynamic from "next/dynamic";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const BookingsManagement = dynamic(() => import("./BookingsManagement"), {
  loading: () => (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="flex gap-3">
          <div className="h-11 flex-1 rounded-2xl bg-gray-100" />
          <div className="h-11 w-36 rounded-2xl bg-gray-100" />
          <div className="h-11 w-36 rounded-2xl bg-gray-100" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-16 rounded-2xl bg-gray-50" />
        ))}
      </div>
    </div>
  ),
});

export const metadata: Metadata = { title: "Bookings | Admin Dashboard" };

export default async function AdminBookingPage() {
  const [admin, supabase] = await Promise.all([getCurrentUser(), createSupabaseServerClient()]);
  if (!admin || admin.role !== "admin") redirect("/auth/login");

  const qrUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://www.ourikatravels.com"}/quick-book`;
  const [bookings, totalResult, pendingResult, unpaidResult, revenueRows, qrDataUrl] =
    await Promise.all([
      getAllBookings(0, 50),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("payment_status", "unpaid")
        .neq("status", "cancelled"),
      supabase.from("bookings").select("total_price").eq("payment_status", "paid"),
      QRCode.toDataURL(qrUrl, {
        width: 200,
        margin: 2,
        color: { dark: "#0b3a2c", light: "#ffffff" },
      }),
    ]);

  const revenue = (revenueRows.data ?? []).reduce((sum, b) => sum + (b.total_price ?? 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">Bookings</p>
        <h1 className="text-3xl font-black tracking-tight text-[#0b3a2c] sm:text-[2rem]">
          Manage reservations
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">
          Confirm payments, adjust schedules, and keep travelers informed.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Total bookings",
            value: totalResult.count ?? 0,
            color: "text-[#0b3a2c]",
            bg: "bg-[#edf7f1]",
          },
          {
            label: "Pending",
            value: pendingResult.count ?? 0,
            color: "text-amber-700",
            bg: "bg-amber-50",
          },
          {
            label: "Awaiting payment",
            value: unpaidResult.count ?? 0,
            color: "text-red-700",
            bg: "bg-red-50",
          },
          {
            label: "Revenue (paid)",
            value: `$${revenue.toFixed(0)}`,
            color: "text-emerald-700",
            bg: "bg-emerald-50",
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

      {/* Walk-in QR */}
      <div className="flex items-center gap-6 rounded-3xl border border-[#d0ede0] bg-[#edf7f1] p-6">
        <img
          src={qrDataUrl}
          alt="Walk-in QR code"
          className="h-24 w-24 shrink-0 rounded-xl shadow-sm"
        />
        <div>
          <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase">
            Walk-in fast booking
          </p>
          <p className="text-lg font-black text-[#0b3a2c]">Bureau QR Code</p>
          <p className="mt-1 text-sm text-gray-500">
            Print this and place it at the bureau. Tourists scan → book in 60 seconds → guide
            auto-assigned immediately.
          </p>
          <a
            href="/quick-book"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-bold text-[#0b3a2c] hover:underline"
          >
            {qrUrl} ↗
          </a>
        </div>
      </div>

      <BookingsManagement initialBookings={bookings} initialOffset={bookings.length} />
    </div>
  );
}
