import Link from "next/link";
import { Star } from "lucide-react";

type Props = {
  title: string;
  rating: number;
  reviewCount: number;
};

export default function TourHeroHeader({ title, rating, reviewCount }: Props) {
  return (
    <>
      <div className="mb-3">
        <Link
          href="/"
          className="inline-flex items-start gap-2 text-xs font-medium text-[#2d2d2d] underline decoration-[#7f7f7f] underline-offset-2 sm:items-center sm:text-sm"
        >
          <span aria-hidden="true">‹</span>
          <span className="leading-5">Ver todo lo que hacer en Marrakech-Safi</span>
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
                <Star key={index} className={`size-3.5 ${index < Math.round(rating) ? "fill-[#F26B21] text-[#F26B21]" : "text-[#D1D5DB]"}`} />
              ))}
            </div>
            <Link href="#reviews" className="font-medium text-[#12355B] underline">
              ({reviewCount.toLocaleString("es-ES")} opiniones)
            </Link>
          </div>
        </div>

        <div className="hidden sm:block" />
      </div>
    </>
  );
}
