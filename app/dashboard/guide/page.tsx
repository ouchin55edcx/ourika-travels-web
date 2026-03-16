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
import { getGuideBookings } from "@/app/actions/bookings";
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

  const assignedBookings = await getGuideBookings();

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
            {assignedBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <p className="font-bold text-gray-400">No bookings assigned yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  The admin will assign bookings to you.
                </p>
              </div>
            ) : (
              assignedBookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-[#f7f9f8] p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-1">
                      {booking.treks?.title ?? "Trek"}
                    </p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">
                      {booking.adults} guest{booking.adults > 1 ? "s" : ""}
                      {booking.children > 0
                        ? ` + ${booking.children} children`
                        : ""}
                      &nbsp;·&nbsp;
                      {booking.booking_type === "private"
                        ? "🔒 Private"
                        : "👥 Group"}
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {booking.tourist_name}
                      </span>
                      <a
                        href={`https://wa.me/${booking.tourist_phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi ${booking.tourist_name}! I'm your Ourika Travels guide for "${booking.treks?.title}" on ${new Date(booking.trek_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${booking.trek_time}. See you at ${booking.treks?.start_location ?? "Setti Fatma"}! 🏔`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-3 py-1 text-[10px] font-black text-white hover:bg-[#20bd5a] transition-all"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp tourist
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 shrink-0">
                    <span>
                      {new Date(booking.trek_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0b3a2c] shadow-sm">
                      {booking.trek_time}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            )}
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
