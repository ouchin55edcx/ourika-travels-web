import Link from "next/link";
import { Heart, MessageSquare } from "lucide-react";
import { ratingDots } from "./tourData";

type TourHeroHeaderProps = {
  title: string;
};

export default function TourHeroHeader({ title }: TourHeroHeaderProps) {
  return (
    <>
      <div className="mb-3">
        <Link
          href="/"
          className="inline-flex items-start gap-2 text-xs font-medium text-[#2d2d2d] underline decoration-[#7f7f7f] underline-offset-2 sm:items-center sm:text-sm"
        >
          <span aria-hidden="true">‹</span>
          <span className="leading-5">
            See all Things to Do in Marrakech-Safi
          </span>
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[760px]">
          <h1 className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#0f172a] sm:text-[32px] lg:text-[38px]">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#1f1f1f]">
            <span className="font-extrabold text-[18px] leading-none">4.6</span>
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

        <div className="flex w-full flex-wrap items-center gap-3 self-start sm:w-auto">
          <button className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-[#123d2f] transition hover:bg-[#f5f5f5]">
            <Heart className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#123d2f] px-4 py-2 text-sm font-semibold text-[#123d2f] transition hover:bg-[#f7faf9] sm:min-h-0 sm:flex-none">
            <MessageSquare className="h-4 w-4" />
            <span>Write a review</span>
          </button>
        </div>
      </div>
    </>
  );
}
