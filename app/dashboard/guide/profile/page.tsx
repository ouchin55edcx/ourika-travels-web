import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Star,
  UsersRound,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const specialties = [
  "Ourika Valley waterfalls",
  "Berber village immersion",
  "Atlas sunrise hikes",
  "Family-friendly trails",
];

const languages = ["Arabic", "French", "English"];

const credentials = [
  "Certified mountain guide",
  "First-aid trained",
  "Local cultural ambassador",
];

const reviewHighlights = [
  {
    title: "Warm hospitality",
    detail:
      "Travelers praise the personal stories and thoughtful stops along the valley trails.",
  },
  {
    title: "Clear communication",
    detail: "Quick replies, detailed itineraries, and smooth coordination on-site.",
  },
  {
    title: "Safety focused",
    detail: "Consistent 5-star scores for safety briefings and group care.",
  },
];

export default async function GuideProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/dashboard/guide/profile");
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
      <section className="rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-sm sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={displayName}
                width={120}
                height={120}
                className="h-28 w-28 rounded-3xl object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-[#004f32] text-3xl font-bold text-white">
                {initials}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-emerald-700">Guide profile</p>
              <h1 className="mt-2 text-3xl font-black text-[#0b3a2c]">{displayName}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-500">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified guide
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  Ourika Valley, Morocco
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-emerald-600" />
                  8+ years experience
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/guide"
              className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700"
            >
              Back to dashboard
            </Link>
            <button className="rounded-full bg-[#0b3a2c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
              Edit profile
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-black/5 bg-[#f7f9f8] p-5">
            <p className="text-xs font-semibold text-gray-500">Average rating</p>
            <p className="mt-2 text-2xl font-black text-[#0b3a2c]">4.9</p>
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
              212 reviews
            </div>
          </div>
          <div className="rounded-3xl border border-black/5 bg-[#f7f9f8] p-5">
            <p className="text-xs font-semibold text-gray-500">Traveler groups</p>
            <p className="mt-2 text-2xl font-black text-[#0b3a2c]">1,180+</p>
            <p className="mt-2 text-xs font-semibold text-gray-500">Happy guests guided</p>
          </div>
          <div className="rounded-3xl border border-black/5 bg-[#f7f9f8] p-5">
            <p className="text-xs font-semibold text-gray-500">Response time</p>
            <p className="mt-2 text-2xl font-black text-[#0b3a2c]">12 min</p>
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              Fast replies
            </div>
          </div>
          <div className="rounded-3xl border border-black/5 bg-[#f7f9f8] p-5">
            <p className="text-xs font-semibold text-gray-500">Safety status</p>
            <p className="mt-2 text-2xl font-black text-[#0b3a2c]">Verified</p>
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Docs up to date
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-gray-500">About</p>
          <h2 className="mt-2 text-2xl font-black text-[#0b3a2c]">Guide story</h2>
          <p className="mt-4 text-sm font-medium text-gray-600">
            {user.bio ||
              "I grew up in the Ourika Valley and have guided travelers through its rivers, villages, and mountain trails for nearly a decade. I focus on safe pacing, cultural storytelling, and authentic interactions with local families."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-black/5 bg-[#f7f9f8] p-4">
              <p className="text-xs font-semibold text-gray-500">Guide badge</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {user.guide_badge_code || "Pending verification"}
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-[#f7f9f8] p-4">
              <p className="text-xs font-semibold text-gray-500">Member since</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">2021</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-gray-500">Expertise</p>
          <h2 className="mt-2 text-2xl font-black text-[#0b3a2c]">Specialties</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {specialties.map((item) => (
              <span
                key={item}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold text-gray-500">Languages</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {languages.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-black/5 bg-white px-3 py-1 text-xs font-semibold text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-gray-500">Credentials</p>
          <h2 className="mt-2 text-2xl font-black text-[#0b3a2c]">Certifications</h2>
          <div className="mt-5 space-y-3">
            {credentials.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[#f7f9f8] p-4"
              >
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-semibold text-gray-800">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-[#0b3a2c]">Verified for 2026 season</p>
                <p className="text-xs font-semibold text-emerald-700">
                  Documentation approved on file.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-gray-500">Traveler love</p>
          <h2 className="mt-2 text-2xl font-black text-[#0b3a2c]">Review highlights</h2>
          <div className="mt-5 space-y-4">
            {reviewHighlights.map((item) => (
              <div key={item.title} className="rounded-2xl border border-black/5 bg-[#f7f9f8] p-4">
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="mt-1 text-xs font-semibold text-gray-500">{item.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
            <UsersRound className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-[#0b3a2c]">Repeat travelers</p>
              <p className="text-xs font-semibold text-emerald-700">
                35% of guests book again within 12 months.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-gray-500">Contact</p>
        <h2 className="mt-2 text-2xl font-black text-[#0b3a2c]">Reach your guide</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
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
          <div className="rounded-2xl border border-black/5 bg-[#f7f9f8] p-4">
            <p className="text-xs font-semibold text-gray-500">Preferred channel</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">In-app chat</p>
          </div>
        </div>
      </section>
    </div>
  );
}
