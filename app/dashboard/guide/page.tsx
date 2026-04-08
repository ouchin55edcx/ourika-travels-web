import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Download,
  Languages,
  MapPin,
  QrCode,
  Trophy,
  Info,
  ClipboardList,
  CalendarCheck,
  Star,
} from "lucide-react";
import { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { getGuideBookings } from "@/app/actions/bookings";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import VerificationBanner from "./components/VerificationBanner";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getCurrentUser();
  const name = user?.full_name?.split(" ")[0] || "Guide";
  return {
    title: `${name}'s Dashboard | Ourika Travels`,
    description: "Manage your upcoming treks and traveler bookings.",
  };
}

export default async function GuideDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/dashboard/guide");
  }

  if (user.role !== "guide") {
    redirect("/profile");
  }

  const [assignedBookings, supabase] = await Promise.all([
    getGuideBookings(),
    createSupabaseServerClient(),
  ]);

  // Fetch guide's round-robin order and all active guides count
  const { data: guideData } = await supabase
    .from("users")
    .select("guide_order, guide_active, is_active")
    .eq("id", user.id)
    .single();

  const { count: totalActiveGuides } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "guide")
    .eq("is_active", true)
    .eq("guide_active", true);

  const today = new Date().toISOString().split("T")[0];
  const [
    { count: totalBookings },
    { count: upcomingBookings },
    { count: completedBookings },
    { data: ratingRows },
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }).eq("guide_id", user.id),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("guide_id", user.id)
      .in("status", ["pending", "confirmed"])
      .gte("trek_date", today),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("guide_id", user.id)
      .eq("status", "completed"),
    supabase
      .from("reviews")
      .select("rating, bookings(guide_id)")
      .eq("bookings.guide_id", user.id)
      .eq("status", "approved")
      .not("rating", "is", null),
  ]);

  const ratings = (ratingRows ?? [])
    .map((row: { rating?: number | null }) => row.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const averageRating =
    ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r, 0) / ratings.length).toFixed(1) : "—";

  const guideOrder = guideData?.guide_order;
  const isGuideActive = guideData?.guide_active ?? false;
  const isActive = guideData?.is_active ?? true;

  const displayName = user.full_name?.trim() || user.email;
  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "G";

  return (
    <div className="space-y-6 md:space-y-10">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-8 md:rounded-[2.5rem] md:p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:gap-3">
              <p className="text-sm font-semibold text-emerald-700">Guide dashboard</p>
              <h1 className="text-2xl font-black text-[#0b3a2c] sm:text-3xl">
                Welcome back, {displayName}
              </h1>
              <p className="max-w-xl text-sm font-medium text-gray-500">
                Your next adventures are queued up. Keep your profile fresh, stay on top of new
                bookings, and guide with confidence.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3 sm:rounded-3xl sm:p-4">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={displayName}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#004f32] text-lg font-bold text-white sm:h-16 sm:w-16 sm:text-xl">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-emerald-700">Guide status</p>
                <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#0b3a2c] shadow-sm">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  {isActive ? "Active" : "Inactive"}
                </div>
                <p className="mt-1.5 text-[10px] font-semibold text-gray-500 sm:text-xs">
                  Badge: {user.guide_badge_code || "Pending"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:mt-5 sm:flex-row sm:flex-wrap">
            <Link
              href="/dashboard/guide/profile"
              className="w-full justify-center rounded-full bg-[#0b3a2c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm sm:w-auto"
            >
              View full profile
            </Link>
            {user.can_add_treks && (
              <Link
                href="/dashboard/guide/treks/new"
                className="w-full justify-center rounded-full border-2 border-[#0b3a2c] bg-white px-5 py-2.5 text-sm font-semibold text-[#0b3a2c] shadow-sm transition-all hover:bg-[#0b3a2c] hover:text-white sm:w-auto"
              >
                + Create new trek
              </Link>
            )}
          </div>
        </div>

        {/* Round-Robin Order Card */}
        <div className="relative rounded-[2.5rem] border border-black/5 bg-gradient-to-br from-[#0b3a2c] to-[#0f3d24] p-8 text-white shadow-sm">
          <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-[#00ef9d]/10 blur-2xl" />
          <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-[#00ef9d]/10 blur-2xl" />

          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-200">Booking queue position</p>
                {guideOrder ? (
                  <>
                    <div className="mt-3 flex items-baseline gap-3">
                      <p className="text-5xl font-black text-white">#{guideOrder}</p>
                      <div className="rounded-full bg-[#00ef9d]/20 px-3 py-1 text-xs font-black text-[#00ef9d]">
                        of {totalActiveGuides || 1} guides
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                      <Info className="h-4 w-4 text-[#00ef9d]" />
                      <p className="text-xs font-medium text-emerald-100">
                        {isGuideActive
                          ? "You're in the active rotation. Bookings will be assigned in order."
                          : "You're paused. Reactivate to receive bookings."}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-lg font-bold text-emerald-100">Not in rotation yet</p>
                    <p className="mt-1 text-sm text-emerald-200">
                      The admin will assign you a position soon.
                    </p>
                  </>
                )}
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <Trophy className="h-6 w-6 text-[#00ef9d]" />
              </div>
            </div>

            {/* Progress bar showing position */}
            {guideOrder && totalActiveGuides && (
              <div className="mt-6">
                <div className="mb-2 flex justify-between text-xs font-semibold text-emerald-200">
                  <span>Your position</span>
                  <span>{Math.round((guideOrder / totalActiveGuides) * 100)}% through queue</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00ef9d] to-[#00ef9d]/60 transition-all duration-500"
                    style={{ width: `${(guideOrder / totalActiveGuides) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Verification Banner */}
      {user.verification_status === "unsubmitted" && <VerificationBanner status="unsubmitted" />}
      {user.verification_status === "pending" && <VerificationBanner status="pending" />}
      {user.verification_status === "verified" && (
        <VerificationBanner status="verified" verifiedAt={user.verified_at} />
      )}
      {user.verification_status === "rejected" && (
        <VerificationBanner status="rejected" note={user.verification_note} />
      )}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total bookings",
            value: totalBookings ?? 0,
            icon: ClipboardList,
          },
          {
            label: "Upcoming",
            value: upcomingBookings ?? 0,
            icon: CalendarCheck,
          },
          {
            label: "Completed",
            value: completedBookings ?? 0,
            icon: CheckCircle2,
          },
          {
            label: "Avg rating",
            value: averageRating,
            icon: Star,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm md:p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-500">{label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black text-[#0b3a2c]">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">Next up</p>
              <h2 className="text-2xl font-black text-[#0b3a2c]">Today & upcoming</h2>
            </div>
          </div>

          <div className="space-y-3">
            {assignedBookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center sm:p-8">
                <p className="font-bold text-gray-400">No bookings assigned yet</p>
                <p className="mt-1 text-sm text-gray-400">The admin will assign bookings to you.</p>
              </div>
            ) : (
              assignedBookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-[#f7f9f8] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                  <div>
                    <p className="line-clamp-1 text-sm font-semibold text-gray-800">
                      {booking.treks?.title ?? "Trek"}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-gray-500">
                      {booking.adults} guest{booking.adults > 1 ? "s" : ""}
                      {booking.children > 0 ? ` + ${booking.children} children` : ""}
                      &nbsp;·&nbsp;
                      {booking.booking_type === "private" ? "🔒 Private" : "👥 Group"}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2 sm:gap-3">
                      <span className="text-xs text-gray-500">{booking.tourist_name}</span>
                      <a
                        href={`https://wa.me/${booking.tourist_phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi ${booking.tourist_name}! I'm your Ourika Travels guide for "${booking.treks?.title}" on ${new Date(booking.trek_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${booking.trek_time}. See you at ${booking.treks?.start_location ?? "Setti Fatma"}! 🏔`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-black text-white transition-all hover:bg-[#20bd5a] sm:px-3"
                      >
                        <svg
                          className="h-2.5 w-2.5 sm:h-3 sm:w-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-gray-500 sm:gap-3">
                    <span className="text-[10px] sm:text-xs">
                      {new Date(booking.trek_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-[#0b3a2c] shadow-sm sm:px-3 sm:py-1 sm:text-xs">
                      {booking.trek_time}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold sm:px-3 sm:py-1 sm:text-xs ${
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
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr]">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm md:rounded-[2rem] md:p-6 lg:p-8">
          <p className="text-sm font-semibold text-gray-500">Profile snapshot</p>
          <h2 className="mt-2 text-xl font-black text-[#0b3a2c] sm:text-2xl">What travelers see</h2>
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-black/5 bg-[#f7f9f8] p-3 sm:mt-5 sm:gap-4 sm:rounded-3xl sm:p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b3a2c] text-base font-bold text-white sm:h-14 sm:w-14 sm:text-lg">
              {initials}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 sm:text-base">{displayName}</p>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                {user.location || "Ourika Valley, Morocco"}
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {user.bio || "Experienced local guide specializing in scenic treks and culture."}
              </p>
              {user.languages && user.languages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.languages.slice(0, 5).map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700"
                    >
                      <Languages className="h-3 w-3" />
                      {lang}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
