"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ShieldCheck, Languages, Check, Mountain, Share2, Globe } from "lucide-react";

interface Guide {
  id: string;
  slug?: string | null;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  avatar_url: string | null;
  badge_image_url: string | null;
  guide_badge_code: string | null;
  is_verified: boolean;
  is_active: boolean;
  years_experience: number | null;
  languages: string[] | null;
  specialties: string[] | null;
  certifications: string[] | null;
}

interface Trek {
  id: string;
  title: string | null;
  slug: string | null;
  cover_image: string | null;
  duration: string | null;
  price_per_person: number | null;
  description: string | null;
}

interface Review {
  id: string;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
  tourists: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface GuidePublicProfileProps {
  guide: Guide;
  guideTreks: Trek[];
  guideReviews: Review[];
  averageRating: string | null;
  reviewCount: number;
}

export default function GuidePublicProfile({
  guide,
  guideTreks,
  guideReviews,
  averageRating,
  reviewCount,
}: GuidePublicProfileProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAllTreks, setShowAllTreks] = useState(false);

  const displayName = guide.full_name?.trim() || "Guide";
  const initials =
    displayName
      .split(" ")
      .filter((part) => Boolean(part))
      .slice(0, 2)
      .map((part) => part?.[0]?.toUpperCase())
      .join("") || "G";

  const displayedReviews = showAllReviews ? guideReviews : guideReviews.slice(0, 3);
  const displayedTreks = showAllTreks ? guideTreks : guideTreks.slice(0, 4);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName} - Ourika Travels Guide`,
          text: guide.bio?.slice(0, 100) || "Check out this amazing guide!",
          url: window.location.href,
        });
      } catch {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Profile link copied to clipboard!");
    }
  };

  const guidePhone = guide.phone || "";
  const whatsappMessage = `Hi ${displayName}! I found your profile on Ourika Travels and I'd like to book an experience with you.`;
  const whatsappUrl = guidePhone
    ? `https://wa.me/${guidePhone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`
    : "#";

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Hero Section */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-[#0a2e1a] via-[#0f3d24] to-[#061a0e] md:h-80">
        {/* Subtle decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #00ef9d 0%, transparent 50%), radial-gradient(circle at 80% 20%, #00ef9d 0%, transparent 40%)`,
          }}
        />

        {/* Location tag top left */}
        <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
          <MapPin className="h-4 w-4 text-[#00ef9d]" />
          <span className="text-sm font-semibold text-white">
            {guide.location || "Ourika Valley, Morocco"}
          </span>
        </div>

        {/* Share button top right */}
        <button
          onClick={handleShare}
          className="absolute top-6 right-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>

        {/* Stats row at bottom of hero */}
        <div className="absolute right-0 bottom-0 left-0 flex items-end justify-between px-6 pb-6">
          <div className="flex gap-6">
            {guide.years_experience && (
              <div>
                <p className="text-2xl font-black text-white">{guide.years_experience}+</p>
                <p className="text-xs font-semibold tracking-wider text-white/60 uppercase">
                  Years exp.
                </p>
              </div>
            )}
            {reviewCount > 0 && (
              <div>
                <p className="text-2xl font-black text-white">{reviewCount}</p>
                <p className="text-xs font-semibold tracking-wider text-white/60 uppercase">
                  Reviews
                </p>
              </div>
            )}
            {averageRating && (
              <div>
                <p className="flex items-center gap-1 text-2xl font-black text-white">
                  {averageRating}
                  <Star className="h-4 w-4 fill-[#00ef9d] text-[#00ef9d]" />
                </p>
                <p className="text-xs font-semibold tracking-wider text-white/60 uppercase">
                  Rating
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Identity Card - Overlaps Hero */}
      <div className="relative mx-auto max-w-3xl px-4">
        <div className="relative -mt-12 rounded-3xl border border-gray-100 bg-white px-6 pt-6 pb-8 shadow-xl">
          <div className="flex flex-col items-start gap-5 sm:flex-row">
            {/* Avatar — larger, with verification ring */}
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[#0a2e1a] ring-4 ring-[#00ef9d]/30">
                {guide.avatar_url ? (
                  <Image
                    src={guide.avatar_url}
                    alt={displayName}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-3xl font-black text-[#00ef9d]">{initials}</span>
                )}
              </div>
              {/* Verified badge on avatar */}
              {guide.is_verified && (
                <div className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#00ef9d] shadow-md">
                  <ShieldCheck className="h-4 w-4 text-[#0a2e1a]" />
                </div>
              )}
            </div>

            {/* Name + meta */}
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-black text-[#0a2e1a]">{displayName}</h1>
                {guide.is_verified && (
                  <span className="rounded-full bg-[#0a2e1a] px-3 py-1 text-xs font-black text-[#00ef9d]">
                    ✓ Verified Guide
                  </span>
                )}
              </div>

              {/* Bio preview */}
              {guide.bio && (
                <p className="line-clamp-3 text-sm leading-relaxed font-medium text-gray-500">
                  {guide.bio}
                </p>
              )}

              {/* Quick meta row */}
              <div className="mt-3 flex flex-wrap gap-4">
                {guide.location && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {guide.location}
                  </span>
                )}
                {guide.languages && guide.languages.length > 0 && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <Globe className="h-3.5 w-3.5" />
                    {guide.languages.join(" · ")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      {guide.specialties && guide.specialties.length > 0 && (
        <div className="mx-auto mt-8 max-w-3xl px-4">
          <h2 className="mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">
            Specialties
          </h2>
          <div className="flex flex-wrap gap-3">
            {guide.specialties.map((specialty) => (
              <span
                key={specialty}
                className="flex items-center gap-2 rounded-2xl border border-[#c6e8d5] bg-[#edf7f1] px-4 py-2.5 text-sm font-bold text-[#0a2e1a]"
              >
                <Mountain className="h-4 w-4 text-[#0a2e1a]/60" />
                {specialty}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages Section */}
      {guide.languages && guide.languages.length > 0 && (
        <div className="mx-auto mt-8 max-w-3xl px-4">
          <h2 className="mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">
            Languages Spoken
          </h2>
          <div className="flex flex-wrap gap-3">
            {guide.languages.map((lang) => (
              <span
                key={lang}
                className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm"
              >
                <Languages className="h-4 w-4 text-[#0a2e1a]" />
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {guide.certifications && guide.certifications.length > 0 && (
        <div className="mx-auto mt-8 max-w-3xl px-4">
          <h2 className="mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">
            Certifications
          </h2>
          <div className="space-y-3 rounded-3xl bg-[#0a2e1a] p-6">
            {guide.certifications.map((cert) => (
              <div key={cert} className="flex items-center gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00ef9d]">
                  <Check className="h-3.5 w-3.5 text-[#0a2e1a]" />
                </div>
                <span className="text-sm font-semibold text-white">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guide Badge Section */}
      {guide.badge_image_url && (
        <div className="mx-auto mt-8 max-w-3xl px-4">
          <h2 className="mb-4 text-xs font-black tracking-widest text-gray-400 uppercase">
            Official Guide Badge
          </h2>
          <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="h-20 w-20 overflow-hidden rounded-xl border-2 border-[#00ef9d] bg-white p-2">
              <Image
                src={guide.badge_image_url}
                alt="Guide badge"
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-[#00ef9d]">
                <ShieldCheck className="h-4 w-4" />
                Verified official guide
              </p>
              {guide.guide_badge_code && (
                <p className="mt-1 font-mono text-xs text-gray-500">
                  Code: {guide.guide_badge_code}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Treks/Experiences Section */}
      <div className="mx-auto mt-8 max-w-3xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-black tracking-widest text-gray-400 uppercase">
            Experiences by {displayName.split(" ")[0]}
          </h2>
          {guideTreks.length > 4 && (
            <button
              onClick={() => setShowAllTreks(!showAllTreks)}
              className="text-xs font-bold text-[#0a2e1a] hover:underline"
            >
              {showAllTreks ? "Show less" : "View all"}
            </button>
          )}
        </div>

        {guideTreks.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Mountain className="mx-auto mb-3 h-10 w-10 text-gray-200" />
            <p className="font-bold text-gray-400">Experiences coming soon</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {displayedTreks.map((trek, index) => (
              <Link
                key={trek.id || `trek-${index}`}
                href={`/tour/${trek.slug || "#"}`}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-40 w-full overflow-hidden">
                  {trek.cover_image ? (
                    <Image
                      src={trek.cover_image}
                      alt={trek.title || "Trek"}
                      width={400}
                      height={200}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0a2e1a] to-[#0f3d24]">
                      <Mountain className="h-12 w-12 text-white/20" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 font-black text-[#0a2e1a]">{trek.title}</p>
                  <div className="mt-2 flex items-center gap-3">
                    {trek.duration && (
                      <span className="text-xs font-semibold text-gray-500">{trek.duration}</span>
                    )}
                    {trek.price_per_person && (
                      <span className="text-xs font-black text-[#0a2e1a]">
                        from {trek.price_per_person.toFixed(0)} MAD
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Reviews Section */}
      {guideReviews.length > 0 && (
        <div className="mx-auto mt-8 max-w-3xl px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-black tracking-widest text-gray-400 uppercase">
              What travelers say
            </h2>
            {guideReviews.length > 3 && (
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-xs font-bold text-[#0a2e1a] hover:underline"
              >
                {showAllReviews ? "Show less" : "View all"}
              </button>
            )}
          </div>
          <div className="space-y-4">
            {displayedReviews.map((review, index) => {
              const tourist = review.tourists;
              const touristName = tourist?.full_name || "Anonymous";
              const rating = review.rating || 0;
              const reviewDate = review.created_at
                ? new Date(review.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "";

              return (
                <div
                  key={review.id || `review-${index}`}
                  className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0a2e1a] text-sm font-black text-white">
                        {touristName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{touristName}</p>
                        {reviewDate && <p className="text-xs text-gray-400">{reviewDate}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm leading-relaxed text-gray-600">{review.comment}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WhatsApp CTA at bottom */}
      <div className="mx-auto mt-10 mb-16 max-w-3xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a2e1a] to-[#0f3d24] p-8 text-center">
          {/* Decorative glow */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: "radial-gradient(circle at 50% 0%, #00ef9d, transparent 60%)",
            }}
          />

          <div className="relative">
            <p className="mb-2 text-xs font-black tracking-widest text-[#00ef9d] uppercase">
              Book directly
            </p>
            <h3 className="mb-2 text-2xl font-black text-white">Ready to explore Ourika Valley?</h3>
            <p className="mb-6 text-sm text-white/60">
              Book an unforgettable experience with {displayName.split(" ")[0]}
            </p>
            {guidePhone && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-base font-black text-white shadow-lg transition-all hover:scale-105 hover:bg-[#20bd5a] active:scale-95"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Book Now on WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-3xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Mountain className="h-6 w-6 text-[#0a2e1a]" />
              <span className="text-sm font-black text-[#0a2e1a]">Ourika Travels</span>
            </div>
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Ourika Travels. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/privacy"
                className="text-xs font-semibold text-gray-500 hover:text-[#0a2e1a]"
              >
                Privacy
              </a>
              <a href="/terms" className="text-xs font-semibold text-gray-500 hover:text-[#0a2e1a]">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
