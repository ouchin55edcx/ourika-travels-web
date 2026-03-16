import Link from "next/link";
import { MessageSquare } from "lucide-react";
import WishlistButton from "@/app/components/WishlistButton";

type Props = {
  title: string;
  rating: number;
  reviewCount: number;
  trekId: string;
  isWishlisted: boolean;
};

export default function TourHeroHeader({ title, rating, reviewCount, trekId, isWishlisted }: Props) {
  return (
    <>
      <div className="mb-3">
        <Link
          href="/"
          className="inline-flex items-start gap-2 text-xs font-medium text-[#2d2d2d] underline decoration-[#7f7f7f] underline-offset-2 sm:items-center sm:text-sm"
        >
          <span aria-hidden="true">‹</span>
          <span className="leading-5">See all Things to Do in Marrakech-Safi</span>
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[760px]">
          <h1 className="text-[26px] leading-[1.15] font-extrabold tracking-[-0.03em] text-[#0f172a] sm:text-[32px] lg:text-[38px]">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#1f1f1f]">
            <span className="text-[18px] leading-none font-extrabold">{rating.toFixed(1)}</span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`h-3.5 w-3.5 rounded-full border border-[#00aa6c] ${index < Math.round(rating) ? "bg-[#00aa6c]" : "bg-white"
                    }`}
                />
              ))}
            </div>
            <Link href="#reviews" className="font-medium text-[#245b4a] underline">
              ({reviewCount.toLocaleString()} reviews)
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 self-start sm:w-auto">
          <WishlistButton trekId={trekId} initialState={isWishlisted} />
          <button className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#123d2f] px-4 py-2 text-sm font-semibold text-[#123d2f] transition hover:bg-[#f7faf9] sm:min-h-0 sm:flex-none">
            <MessageSquare className="h-4 w-4" />
            <span>Write a review</span>
          </button>
        </div>
      </div>
    </>
  );
}
