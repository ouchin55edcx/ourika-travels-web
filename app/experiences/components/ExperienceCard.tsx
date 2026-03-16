import Image from 'next/image';
import Link from 'next/link';
import { Clock3, Languages, MapPin } from 'lucide-react';
import WishlistButton from '@/app/components/WishlistButton';
import type { TrekItem } from './ExperiencesExplorer';

export default function ExperienceCard({
  trek,
  index,
  isWishlisted = false,
}: {
  trek: TrekItem;
  index: number;
  isWishlisted?: boolean;
}) {
  return (
    <Link
      href={`/tour/${trek.slug}`}
      className="group block rounded-[14px] border border-[#d8d8d8] bg-white p-2.5
        shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition
        hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="relative mb-2 overflow-hidden rounded-[12px]">
        <div className="relative aspect-[4/3]">
          <Image
            src={trek.cover_image}
            alt={trek.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div
          className="absolute top-2 right-2 z-10"
          onClick={(e) => e.preventDefault()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <WishlistButton trekId={trek.id} initialState={isWishlisted} iconOnly />
        </div>
        {trek.award && (
          <div className="absolute bottom-2 left-2 rounded-[8px] bg-[#f2ef31]
            px-2 py-1 text-[10px] leading-none font-extrabold text-[#111827]">
            {trek.award}
          </div>
        )}
        {trek.badge && (
          <div className="absolute top-2 left-2 rounded-[8px] bg-[#004f32]
            px-2 py-1 text-[10px] leading-none font-extrabold text-white">
            {trek.badge}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-[11px] font-extrabold text-[#4b5563]">{index}.</p>
        <h3 className="line-clamp-3 text-[15px] leading-6 font-extrabold text-[#12311f]">
          {trek.title}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
          <span className="font-bold text-[#12311f]">{trek.rating.toFixed(1)}</span>
          <div className="flex items-center gap-1">
            {[0,1,2,3,4].map(i => (
              <span key={i}
                className={`h-2.5 w-2.5 rounded-full ${
                  i < Math.round(trek.rating)
                    ? 'bg-[#00aa6c]'
                    : 'border border-[#00aa6c] bg-white'
                }`} />
            ))}
          </div>
          <span className="text-[#6b7280]">({trek.review_count.toLocaleString()})</span>
        </div>

        <p className="text-[12px] text-[#6b7280]">
          {Array.isArray(trek.categories) ? trek.categories[0]?.name : trek.categories?.name}
        </p>

        <div className="space-y-1 text-[11px] text-[#5f6368]">
          <div className="flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-[#00aa6c]" />
            <span>{trek.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Languages className="h-3.5 w-3.5 text-[#00aa6c]" />
            <span>{(trek.live_guide_languages ?? []).slice(0, 2).join(', ')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-[#00aa6c]" />
            <span>{trek.time_of_day}</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 pt-1">
          <p className="text-[15px] font-extrabold text-[#12311f]">
            from{' '}
            {trek.previous_price && (
              <span className="mr-1 text-[#9ca3af] line-through">
                ${trek.previous_price.toFixed(2)}
              </span>
            )}
            <span className={trek.previous_price ? 'text-[#cc184e]' : ''}>
              ${trek.price_per_adult.toFixed(2)}
            </span>
          </p>
          <span className="inline-flex rounded-full bg-[#00e05a] px-3 py-1.5
            text-[11px] font-bold text-black">
            Reserve
          </span>
        </div>
      </div>
    </Link>
  );
}

