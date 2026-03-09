import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import TourItinerary from "./TourItinerary";
import TourReviews from "./TourReviews";
import TourStickyHeader from "./TourStickyHeader";
import {
  ArrowRight,
  ChevronRight,
  CalendarDays,
  Camera,
  CircleAlert,
  Globe,
  Heart,
  Languages,
  MessageSquare,
  ShieldCheck,
  Smartphone,
  Star,
  Users,
  WalletCards,
  Clock3,
} from "lucide-react";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200&auto=format&fit=crop",
    alt: "Terraced village in Ourika Valley",
  },
  {
    src: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=900&auto=format&fit=crop",
    alt: "Travelers sitting near the river in the Atlas Mountains",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop",
    alt: "Colorful riverside seating in the valley",
  },
];

const navigationItems = [
  "Overview",
  "Details",
  "Itinerary",
  "Operator",
  "Reviews",
];

const bookingBenefits = [
  {
    icon: ShieldCheck,
    title: "Free cancellation",
    description:
      "Full refund if cancelled up to 24 hours before the experience starts (local time).",
  },
  {
    icon: WalletCards,
    title: "Reserve now & pay later",
    description: "Secure your spot while staying flexible.",
  },
  {
    icon: CalendarDays,
    title: "Book ahead",
    description: "This is booked 11 days in advance on average.",
  },
];

const aboutText =
  "Take a break from the bustling streets of Marrakech to spend the day visiting the beautiful landscapes of the Atlas Mountains. Hard to navigate alone, this small-group tour takes care of everything for you so you can explore stress-free. After hotel pickup, begin with breathtaking valley views, traditional Berber villages, riverside stops, and time to relax before heading back to the city.";

const ratingDots = Array.from({ length: 5 });

const reviewCards = [
  {
    author: "Nirdvall",
    date: "Feb 2026",
    text: "it was a very fun experience, suggest it",
  },
  {
    author: "najav",
    date: "Feb 2026",
    text: "We had the chance to meet Sarah (our guide) who shared her love of her country and region. A real pleasure that this meeting with very beautiful day in the different valleys. A very nice...",
  },
];

const experienceFacts = [
  { icon: Users, text: "Ages 1-99, max of 15 per group" },
  { icon: Clock3, text: "Duration: 7h" },
  { icon: CircleAlert, text: "Start time: Check availability" },
  { icon: Smartphone, text: "Mobile ticket" },
  {
    icon: Globe,
    text: "Live guide: Czech, Arabic, Chinese, Russian, Japanese, Slovak, English, French, Danish",
  },
  {
    icon: Languages,
    text: "Audio guide: Arabic, English, French, Spanish",
  },
  {
    icon: CircleAlert,
    text: "Written guide: Arabic, English, French",
  },
];

const similarExperiences = [
  {
    title: "Marrakech: 1 Day Tour-Best of the Atlas Mountains &Three Valleys",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    badge: "Best Seller",
    rating: "5.0",
    reviews: "1,571",
    category: "Private and Luxury",
    price: "$22.65",
    oldPrice: null,
    highlight: null,
  },
  {
    title: "Atlas Mountains & 5 Valleys Tour from Marrakech - All inclusive -",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    rating: "5.0",
    reviews: "2,937",
    category: "Private and Luxury",
    price: "$92.72",
    oldPrice: null,
    highlight: "(price varies by group size)",
  },
  {
    title: "Marrakech: Atlas Mountains, Imlil Valley & Waterfalls Tour",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format&fit=crop",
    badge: "Special Offer",
    rating: "4.9",
    reviews: "346",
    category: "Private and Luxury",
    price: "$19.35",
    oldPrice: "$20.53",
    highlight: null,
  },
  {
    title: "Atlas Mountains 4 Valleys, Waterfalls, Villages and Camel Ride",
    image:
      "https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200&auto=format&fit=crop",
    badge: null,
    rating: "4.9",
    reviews: "1,320",
    category: "Private and Luxury",
    price: "$17.60",
    oldPrice: null,
    highlight: null,
  },
];

function formatTitleFromSlug(slug?: string) {
  if (!slug) {
    return "";
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string }>;
}) {
  const { slug } = await params;
  const fallbackTitle = formatTitleFromSlug(slug);
  const title =
    fallbackTitle || "Ourika Valley, Atlas mountains Waterfalls & 3 Valleys";

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f] selection:bg-[#34e0a1] selection:text-black">
      <Navbar />
      <TourStickyHeader title={title} navigationItems={navigationItems} />
      <main className="mx-auto flex w-full max-w-[1180px] flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2d2d2d] underline decoration-[#7f7f7f] underline-offset-2"
          >
            <span aria-hidden="true">‹</span>
            <span>See all Things to Do in Marrakech-Safi</span>
          </Link>
        </div>

        <div className="mb-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[760px]">
            <h1 className="text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#0f172a] sm:text-[38px]">
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#1f1f1f]">
              <span className="font-extrabold text-[18px] leading-none">
                4.6
              </span>
              <div className="flex items-center gap-1">
                {ratingDots.map((_, index) => (
                  <span
                    key={index}
                    className={`h-3.5 w-3.5 rounded-full border border-[#00aa6c] ${
                      index < 4 ? "bg-[#00aa6c]" : "bg-white"
                    }`}
                  />
                ))}
              </div>
              <Link
                href="#reviews"
                className="font-medium text-[#245b4a] underline"
              >
                (253 reviews)
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start">
            <button className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-[#123d2f] transition hover:bg-[#f5f5f5]">
              <Heart className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-[#123d2f] px-4 py-2 text-sm font-semibold text-[#123d2f] transition hover:bg-[#f7faf9]">
              <MessageSquare className="h-4 w-4" />
              <span>Write a review</span>
            </button>
          </div>
        </div>

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="min-w-0">
            <div className="grid gap-2 rounded-[18px] md:grid-cols-[minmax(0,1fr)_210px]">
              <div className="relative min-h-[260px] overflow-hidden rounded-[18px] md:min-h-[438px]">
                <Image
                  src={galleryImages[0].src}
                  alt={galleryImages[0].alt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 70vw"
                />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
                <div className="relative min-h-[180px] overflow-hidden rounded-[18px] md:min-h-[215px]">
                  <Image
                    src={galleryImages[1].src}
                    alt={galleryImages[1].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>
                <div className="relative min-h-[180px] overflow-hidden rounded-[18px] md:min-h-[215px]">
                  <Image
                    src={galleryImages[2].src}
                    alt={galleryImages[2].alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <button className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-[#123d2f] px-3 py-2 text-sm font-bold text-white shadow-lg">
                    <Camera className="h-4 w-4" />
                    <span>563</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 border-b border-[#e5e7eb]">
              <nav className="flex flex-wrap gap-6 text-[15px] font-semibold text-[#133728]">
                {navigationItems.map((item, index) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className={`pb-3 ${
                      index === 0
                        ? "border-b-2 border-[#123d2f]"
                        : "border-b-2 border-transparent"
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>

            <section id="overview" className="max-w-[760px] py-8">
              <h2 className="mb-4 text-[24px] font-extrabold text-[#111827]">
                About
              </h2>
              <p className="text-[17px] leading-8 text-[#333]">
                {aboutText}{" "}
                <button className="font-bold text-[#123d2f] underline">
                  Read more
                </button>
              </p>
            </section>

            <section
              id="reviews"
              className="max-w-[760px] border-t border-[#e5e7eb] py-8"
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-[24px] font-extrabold text-[#111827]">
                    Why travelers love this
                  </h2>
                  <CircleAlert className="h-4 w-4 text-[#6b7280]" />
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1f1f1f]">
                  <span className="font-medium">4.6</span>
                  <div className="flex items-center gap-1">
                    {ratingDots.map((_, index) => (
                      <span
                        key={`review-dot-${index}`}
                        className={`h-3 w-3 rounded-full border border-[#00aa6c] ${
                          index < 4 ? "bg-[#00aa6c]" : "bg-white"
                        }`}
                      />
                    ))}
                  </div>
                  <Link
                    href="#reviews"
                    className="font-medium text-[#245b4a] underline"
                  >
                    (253 reviews)
                  </Link>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_48px]">
                {reviewCards.map((review) => (
                  <article
                    key={`${review.author}-${review.date}`}
                    className="min-h-[154px] rounded-[8px] border border-[#d8d8d8] bg-white p-4"
                  >
                    <div className="mb-4 flex items-center gap-2 text-[14px]">
                      <div className="flex items-center gap-1">
                        {ratingDots.map((_, index) => (
                          <Star
                            key={`${review.author}-${index}`}
                            className="h-3.5 w-3.5 fill-[#00aa6c] text-[#00aa6c]"
                          />
                        ))}
                      </div>
                      <span className="font-bold text-[#1f1f1f]">
                        {review.author}
                      </span>
                      <span className="text-[#6b7280]">· {review.date}</span>
                    </div>
                    <p className="text-[15px] leading-8 text-[#1f1f1f]">
                      {review.text}
                      {review.author === "najav" ? (
                        <button className="font-bold text-[#123d2f] underline">
                          Read more
                        </button>
                      ) : null}
                    </p>
                  </article>
                ))}

                <div className="hidden items-center justify-center md:flex">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#123d2f] text-[#123d2f]">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            <section className="max-w-[760px] border-t border-[#e5e7eb] py-6">
              <div className="space-y-3">
                {experienceFacts.map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-start gap-3 text-[15px] text-[#1f1f1f]"
                  >
                    <Icon className="mt-1 h-4 w-4 shrink-0 text-[#123d2f]" />
                    <p className="leading-7">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="max-w-[760px] border-t border-[#e5e7eb] py-6">
              <h3 className="mb-4 text-[24px] font-extrabold text-[#111827]">
                Highlights
              </h3>
              <ul className="list-disc pl-5 text-[15px] leading-7 text-[#1f1f1f]">
                <li>
                  <Link
                    href="#itinerary"
                    className="font-semibold text-[#123d2f] underline"
                  >
                    See itinerary
                  </Link>
                </li>
              </ul>
            </section>
          </section>

          <aside className="self-start lg:sticky lg:top-5">
            <div className="rounded-2xl border border-[#d9d9d9] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
              <div className="mb-1 flex items-baseline gap-1">
                <span className="text-[15px] font-semibold text-[#1f1f1f]">
                  From
                </span>
                <span className="text-[32px] font-extrabold tracking-[-0.03em] text-[#1f1f1f]">
                  $17.60
                </span>
                <span className="text-sm text-[#5f6368]">per adult</span>
              </div>
              <button className="mb-5 text-sm font-semibold text-[#333] underline underline-offset-2">
                Lowest price guarantee
              </button>

              <button className="mb-6 w-full rounded-full bg-[#00e05a] px-5 py-4 text-[17px] font-bold text-black transition hover:bg-[#00cb52]">
                Check availability
              </button>

              <div className="space-y-5">
                {bookingBenefits.map(
                  ({ icon: Icon, title: benefitTitle, description }) => (
                    <div key={benefitTitle} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1f32b] text-[#123d2f]">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-[14px] leading-6 text-[#444]">
                        <span className="font-semibold text-[#1f1f1f]">
                          {benefitTitle}
                        </span>
                        <span> • {description}</span>
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-[#f6f6f6] p-5">
              <p className="inline-block bg-[#dedede] px-1 text-[15px] font-semibold text-[#434343]">
                Have booking questions?
              </p>
              <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#123d2f] underline underline-offset-2">
                <MessageSquare className="h-4 w-4" />
                <span>Chat now</span>
              </button>
            </div>
          </aside>
        </div>

        <TourItinerary />

        <section className="border-t border-[#e5e7eb] pt-8">
          <div className="rounded-[8px] bg-[#004f24] px-5 py-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h3 className="text-[26px] font-extrabold tracking-[-0.03em]">
                Select date and travelers
              </h3>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-[#111827]">
                  <CalendarDays className="h-4 w-4" />
                  <span>Enter date</span>
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-[#111827]">
                  <Users className="h-4 w-4" />
                  <span>Select Travelers</span>
                </button>
                <button className="inline-flex items-center justify-center rounded-full bg-[#00e05a] px-6 py-3 text-[15px] font-bold text-black">
                  Check availability
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-[26px] font-extrabold tracking-[-0.03em] text-[#111827]">
              Similar experiences
            </h3>
            <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#123d2f] text-[#123d2f] lg:inline-flex">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {similarExperiences.map((experience) => (
              <article key={experience.title} className="group">
                <div className="relative mb-3 overflow-hidden rounded-[14px]">
                  <div className="relative aspect-[4/4]">
                    <Image
                      src={experience.image}
                      alt={experience.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    />
                  </div>
                  <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#123d2f] shadow-sm">
                    <Heart className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-3 rounded-[6px] bg-[#f2ef31] px-2 py-1 text-[11px] font-extrabold text-[#111827]">
                    2025
                  </div>
                </div>

                {experience.badge ? (
                  <div
                    className={`mb-2 inline-flex rounded-[4px] border px-2 py-0.5 text-[11px] font-semibold ${
                      experience.badge === "Special Offer"
                        ? "border-[#ef4a72] text-[#ef4a72]"
                        : "border-[#9ca3af] text-[#111827]"
                    }`}
                  >
                    {experience.badge}
                  </div>
                ) : null}

                <h4 className="text-[17px] font-extrabold leading-7 text-[#12311f]">
                  {experience.title}
                </h4>

                <div className="mt-1 flex items-center gap-1.5 text-sm">
                  <span className="font-medium">{experience.rating}</span>
                  <div className="flex items-center gap-1">
                    {ratingDots.map((_, index) => (
                      <span
                        key={`${experience.title}-${index}`}
                        className="h-3 w-3 rounded-full bg-[#00aa6c]"
                      />
                    ))}
                  </div>
                  <span className="text-[#6b7280]">({experience.reviews})</span>
                </div>

                <p className="mt-2 text-[15px] text-[#666]">
                  {experience.category}
                </p>

                <p className="mt-4 text-[17px] font-extrabold text-[#12311f]">
                  from{" "}
                  {experience.oldPrice ? (
                    <span className="mr-1 text-[#666] line-through">
                      {experience.oldPrice}
                    </span>
                  ) : null}
                  <span className={experience.oldPrice ? "text-[#cc184e]" : ""}>
                    {experience.price}
                  </span>{" "}
                  per adult
                  {experience.highlight ? (
                    <span className="font-medium text-[#12311f]">
                      {" "}
                      {experience.highlight}
                    </span>
                  ) : null}
                </p>
              </article>
            ))}
          </div>
        </section>
        <TourReviews />
      </main>
      <Footer />
    </div>
  );
}
