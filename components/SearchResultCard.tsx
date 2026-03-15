import Image from 'next/image';
import Link from 'next/link';
import { Tag } from 'lucide-react';
import type { TrekResult } from '@/hooks/useSearchTreks';

export default function SearchResultCard({
  trek,
  onSelect,
}: {
  trek: TrekResult;
  onSelect: () => void;
}) {
  return (
    <Link
      href={`/tour/${trek.slug}`}
      onClick={onSelect}
      className="group flex cursor-pointer items-center gap-4 rounded-xl
        px-3 py-2.5 transition-all hover:bg-gray-50"
    >
      {/* Trek cover image */}
      <div className="relative h-12 w-12 shrink-0 overflow-hidden
        rounded-xl border border-gray-100">
        <Image
          src={trek.cover_image}
          alt={trek.title}
          fill
          className="object-cover transition-transform duration-300
            group-hover:scale-105"
          sizes="48px"
        />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-[14px] font-bold text-[#004f32]
          group-hover:text-[#0b3a2c]">
          {trek.title}
        </h4>

        <div className="mt-0.5 flex items-center gap-2 flex-wrap">
          {/* Category pill */}
          {trek.categories?.name && (
            <span className="inline-flex items-center gap-1 rounded-full
              bg-[#f0faf5] border border-emerald-100 px-2 py-0.5
              text-[11px] font-bold text-[#004f32]">
              {trek.categories.photo ? (
                <span className="relative h-3 w-3 overflow-hidden
                  rounded-full inline-block shrink-0">
                  <Image
                    src={trek.categories.photo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="12px"
                  />
                </span>
              ) : (
                <Tag className="h-2.5 w-2.5 shrink-0" />
              )}
              {trek.categories.name}
            </span>
          )}

          {/* Duration */}
          <span className="text-[11px] font-medium text-gray-400">
            {trek.duration}
          </span>

          {/* Price */}
          <span className="text-[11px] font-black text-[#004f32]">
            from ${trek.price_per_adult.toFixed(0)}
          </span>
        </div>
      </div>
    </Link>
  );
}
