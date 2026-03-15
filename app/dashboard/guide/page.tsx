import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Download,
  MapPin,
  MessageSquare,
  QrCode,
  ShieldCheck,
  Star,
  UsersRound,
} from "lucide-react";
import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import VerificationBanner from "./components/VerificationBanner";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getCurrentUser();
  const name = user?.full_name?.split(" ")[0] || "Guide";
  return {
    title: `${name}'s Dashboard | Ourika Travels`,
    description: "Manage your upcoming treks and traveler bookings.",
  };
}

const stats = [
  { label: "Upcoming treks", value: "6", detail: "Next 14 days", icon: CalendarDays },
  { label: "Bookings", value: "18", detail: "This week", icon: UsersRound },
  { label: "Average rating", value: "4.9", detail: "212 reviews", icon: Star },
  { label: "Response time", value: "12 min", detail: "Last 30 days", icon: MessageSquare },
];

const schedule = [
  {
    title: "Ourika Waterfalls",
    date: "Mar 16, 2026",
    time: "07:30 AM",
    group: "6 travelers",
    status: "Confirmed",
  },
  {
    title: "Berber Village Walk",
    date: "Mar 18, 2026",
    time: "09:00 AM",
    group: "Private",
    status: "Pending",
  },
  {
    title: "Atlas Sunrise Trek",
    date: "Mar 20, 2026",
    time: "05:30 AM",
    group: "8 travelers",
    status: "Confirmed",
  },
];

const focusItems = [
  {
    title: "Update availability",
    detail: "Open slots for April weekends",
  },
  {
    title: "Refresh your profile",
    detail: "Add new photos from the valley",
  },
  {
    title: "Check traveler messages",
    detail: "3 inquiries need a reply",
  },
];

export default async function GuideDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/dashboard/guide");
  }

  if (user.role !== "guide") {
    redirect("/profile");
  }

  const displayName = user.full_name?.trim() || user.email;
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "G";

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-emerald-700">Guide dashboard</p>
              <h1 className="text-3xl font-black text-[#0b3a2c] sm:text-4xl">
                Welcome back, {displayName}
              </h1>
              <p className="max-w-xl text-sm font-medium text-gray-500">
                Your next adventures are queued up. Keep your profile fresh, stay on top of new
                bookings, and guide with confidence.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#004f32] text-xl font-bold text-white">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-emerald-700">Guide status</p>
                <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0b3a2c] shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  {user.is_active ? "Active guide" : "Inactive guide"}
                </div>
                <p className="mt-2 text-xs font-semibold text-gray-500">
                  Badge: {user.guide_badge_code || "Pending verification"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard/guide/profile"
              className="rounded-full bg-[#0b3a2c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
            >
              View full profile
            </Link>
            <button className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700">
              Update availability
            </button>
            <button className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700">
              Send traveler update
            </button>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-black/5 bg-[#0b3a2c] p-8 text-white shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-emerald-200">App download</p>
              <h2 className="mt-2 text-2xl font-black">Take Ourika Travels on the trail</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Download className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-sm text-emerald-100">
            Access offline itineraries, traveler chat, and real-time check-ins from your phone.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="space-y-3">
              <button className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#0b3a2c] shadow-sm transition hover:shadow-md">
                <span>Download for iOS</span>
                <Download className="h-4 w-4" />
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl border border-white/30 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                <span>Download for Android</span>
                <Download className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
                <QrCode className="h-8 w-8" />
              </div>
              <p className="text-xs font-semibold text-emerald-100">Scan to install</p>
            </div>
          </div>
        </div>
      </section>

      {/* Verification Banner */}
      {user.verification_status === 'unsubmitted' && (
        <VerificationBanner status="unsubmitted" />
      )}
      {user.verification_status === 'pending' && (
        <VerificationBanner status="pending" />
      )}
      {user.verification_status === 'verified' && (
        <VerificationBanner status="verified" verifiedAt={user.verified_at} />
      )}
      {user.verification_status === 'rejected' && (
        <VerificationBanner status="rejected" note={user.verification_note} />
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-start gap-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b3a2c]/10 text-[#0b3a2c]">
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
              <p className="text-2xl font-black text-[#0b3a2c]">{stat.value}</p>
              <p className="text-xs font-semibold text-emerald-600">{stat.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">Next up</p>
              <h2 className="text-2xl font-black text-[#0b3a2c]">Today & upcoming</h2>
            </div>
            <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
              View calendar
            </button>
          </div>

          <div className="space-y-4">
            {schedule.map((item) => (
              <div
                key={`${item.title}-${item.date}`}
                className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-[#f7f9f8] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs font-semibold text-gray-500">{item.group}</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                  <span>{item.date}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0b3a2c] shadow-sm">
                    {item.time}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500">Focus</p>
            <h2 className="text-2xl font-black text-[#0b3a2c]">Priority tasks</h2>
          </div>

          <div className="space-y-4">
            {focusItems.map((task) => (
              <div key={task.title} className="rounded-2xl border border-black/5 bg-[#f7f9f8] p-4">
                <p className="text-sm font-semibold text-gray-800">{task.title}</p>
                <p className="text-xs font-semibold text-gray-500">{task.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-[#0b3a2c]">Safety check complete</p>
                <p className="text-xs font-semibold text-emerald-700">
                  Your documents are verified for this season.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-gray-500">Profile snapshot</p>
          <h2 className="mt-2 text-2xl font-black text-[#0b3a2c]">What travelers see</h2>
          <div className="mt-5 flex items-start gap-4 rounded-3xl border border-black/5 bg-[#f7f9f8] p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b3a2c] text-lg font-bold text-white">
              {initials}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{displayName}</p>
              <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-gray-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                Ourika Valley, Morocco
              </div>
              <p className="mt-2 text-xs font-semibold text-gray-500">
                {user.bio || "Experienced local guide specializing in scenic treks and culture."}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                4.9 rating • 212 reviews
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-gray-500">Contact & reach</p>
          <h2 className="mt-2 text-2xl font-black text-[#0b3a2c]">Stay close to travelers</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-[#f7f9f8] p-4">
              <p className="text-xs font-semibold text-gray-500">Email</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">{user.email}</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-[#f7f9f8] p-4">
              <p className="text-xs font-semibold text-gray-500">Phone</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {user.phone || "+212 000 000 000"}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <p className="text-xs font-semibold text-emerald-700">
              {user.email_verified ? "Email verified" : "Email not verified yet"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
