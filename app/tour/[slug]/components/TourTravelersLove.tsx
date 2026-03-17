import Link from "next/link";
import { ArrowRight, CircleAlert, Star } from "lucide-react";

type Review = { author: string; date: string; body: string; title?: string; rating?: number };
type Props = { rating: number; reviewCount: number; reviews: Review[] };

export default function TourTravelersLove({ rating, reviewCount, reviews }: Props) {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews-preview" className="max-w-[760px] border-t border-[#e5e7eb] py-8">
      <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
            Why travelers love this
          </h2>
          <CircleAlert className="h-4 w-4 text-[#6b7280]" />
        </div>
        <div className="flex items-center gap-2 text-sm text-[#1f1f1f]">
          <span className="font-medium">{rating.toFixed(1)}</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => (
              <span
                key={`review-dot-${index}`}
                className={`h-3 w-3 rounded-full border border-[#00aa6c] ${
                  index < Math.round(rating) ? "bg-[#00aa6c]" : "bg-white"
                }`}
              />
            ))}
          </div>
          <Link href="#reviews" className="font-medium text-[#245b4a] underline">
            ({reviewCount.toLocaleString()} reviews)
          </Link>
        </div>
      </div>

      <div className="grid gap-3 pt-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_48px]">
        {reviews.slice(0, 2).map((review) => (
          <article
            key={`${review.author}-${review.date}`}
            className="min-h-[154px] rounded-[8px] border border-[#d8d8d8] bg-white p-4"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[14px]">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={`${review.author}-${index}`}
                    className="h-3.5 w-3.5 fill-[#00aa6c] text-[#00aa6c]"
                  />
                ))}
              </div>
              <span className="font-bold text-[#1f1f1f]">{review.author}</span>
              <span className="text-[#6b7280]">· {review.date}</span>
            </div>
            <p className="line-clamp-4 text-[15px] leading-7 text-[#1f1f1f] sm:leading-8">
              {review.body}
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
