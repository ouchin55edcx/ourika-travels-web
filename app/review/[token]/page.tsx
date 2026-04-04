import Image from "next/image";
import Link from "next/link";
import { getReviewByToken } from "@/app/actions/reviews";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import Footer from "@/components/Footer";
import ReviewForm from "./ReviewForm";

type ReviewPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { token } = await params;
  const review = await getReviewByToken(token);

  if (!review) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarWrapper sticky={false} />
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-black text-[#0a2e1a]">Invalid review link</h1>
            <p className="mt-2 text-sm text-gray-500">
              This review link is not valid. Please check your email or contact support.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0b3a2c] px-6 py-3 text-sm font-black text-white"
            >
              Back to home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if ("expired" in review && review.expired) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarWrapper sticky={false} />
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-16">
          <div className="rounded-3xl border border-amber-100 bg-amber-50/60 p-8 text-center shadow-sm">
            <h1 className="text-2xl font-black text-[#0a2e1a]">Review link expired</h1>
            <p className="mt-2 text-sm text-amber-700">
              This review link has expired. Please request a new one from Ourika Travels.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0b3a2c] px-6 py-3 text-sm font-black text-white"
            >
              Back to home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const trek = review.treks;
  const booking = review.bookings;
  const alreadySubmitted = review.body && review.body.length > 0;
  const trekTitle = trek?.title ?? "your trek";

  return (
    <div className="min-h-screen bg-[#f7faf9]">
      <NavbarWrapper sticky={false} />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="grid gap-6 p-6 sm:grid-cols-[180px_1fr] sm:items-center sm:p-8">
            <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-32 sm:w-44">
              {trek?.cover_image ? (
                <Image
                  src={trek.cover_image}
                  alt={`${trekTitle} cover`}
                  fill
                  className="object-cover"
                  sizes="180px"
                />
              ) : null}
            </div>
            <div>
              <p className="text-xs font-black tracking-widest text-gray-400 uppercase">
                Share your experience
              </p>
              <h1 className="mt-2 text-2xl font-black text-[#0a2e1a] sm:text-3xl">
                {trekTitle}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                {booking?.booking_ref ? (
                  <span className="rounded-full bg-gray-50 px-3 py-1">
                    Ref: {booking.booking_ref}
                  </span>
                ) : null}
                {booking?.trek_date ? (
                  <span className="rounded-full bg-gray-50 px-3 py-1">
                    {new Date(booking.trek_date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                ) : null}
                {booking?.adults ? (
                  <span className="rounded-full bg-gray-50 px-3 py-1">
                    {booking.adults} traveler{booking.adults > 1 ? "s" : ""}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {alreadySubmitted ? (
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black text-[#0b3a2c]">Review already submitted</h2>
            <p className="mt-2 text-sm text-emerald-700">
              Thanks! Your review has already been received.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0b3a2c] px-6 py-3 text-sm font-black text-white"
            >
              Back to home
            </Link>
          </div>
        ) : (
          <ReviewForm
            token={token}
            initialRating={review.rating ?? 5}
            trekTitle={trekTitle}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
