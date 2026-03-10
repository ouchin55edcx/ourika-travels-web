import Link from "next/link";
import { ArrowRight, CircleAlert, Star } from "lucide-react";
import { ratingDots, reviewCards } from "./tourData";

export default function TourTravelersLove() {
  return (
    <section
      id="reviews-preview"
      className="max-w-[760px] border-t border-[#e5e7eb] py-8"
    >
      <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-black leading-tight text-[#111827] md:text-[28px]">
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

      <div className="grid gap-3 pt-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_48px]">
        {reviewCards.map((review) => (
          <article
            key={`${review.author}-${review.date}`}
            className="min-h-[154px] rounded-[8px] border border-[#d8d8d8] bg-white p-4"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[14px]">
              <div className="flex items-center gap-1">
                {ratingDots.map((_, index) => (
                  <Star
                    key={`${review.author}-${index}`}
                    className="h-3.5 w-3.5 fill-[#00aa6c] text-[#00aa6c]"
                  />
                ))}
              </div>
              <span className="font-bold text-[#1f1f1f]">{review.author}</span>
              <span className="text-[#6b7280]">· {review.date}</span>
            </div>
            <p className="text-[15px] leading-7 text-[#1f1f1f] sm:leading-8">
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
  );
}
