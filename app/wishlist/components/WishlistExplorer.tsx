'use client';

import { useEffect, useState, useTransition } from 'react';
import { getWishlist, toggleWishlist } from '@/app/actions/wishlist';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Star, Clock, ChevronRight } from 'lucide-react';

export default function WishlistExplorer() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getWishlist().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  function handleRemove(trekId: string) {
    startTransition(async () => {
      await toggleWishlist(trekId);
      setItems((prev) => prev.filter((item) => item.trek_id !== trekId));
    });
  }

  if (loading)
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-gray-100" />
        ))}
      </div>
    );

  return (
    <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
          Saved experiences
        </p>
        <h1 className="mt-1 text-3xl font-black text-[#0b3a2c]">Your Wishlist</h1>
        <p className="mt-1 text-sm text-gray-500">
          {items.length} experience{items.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-gray-200" />
          <p className="text-xl font-black text-gray-300">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-gray-400">
            Tap the heart icon on any experience to save it here.
          </p>
          <Link
            href="/experiences"
            className="mt-6 inline-block rounded-full bg-[#0b3a2c] px-6 py-3 text-sm font-bold text-white"
          >
            Browse experiences
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const trek = item.treks;
            if (!trek) return null;
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={trek.cover_image}
                    alt={trek.title}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(item.trek_id)}
                    disabled={isPending}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-red-50"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                  {trek.badge && (
                    <div className="absolute left-3 top-3 rounded-lg bg-[#f2ef31] px-2 py-1 text-[10px] font-black text-[#111827]">
                      {trek.badge}
                    </div>
                  )}
                </div>

                <div className="space-y-2 p-4">
                  <h3 className="line-clamp-2 font-bold text-[#0b3a2c]">{trek.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Star className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
                    <span className="font-bold text-gray-700">
                      {trek.rating?.toFixed(1)}
                    </span>
                    <span>({trek.review_count?.toLocaleString()})</span>
                    <span className="text-gray-300">·</span>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{trek.duration}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      {trek.previous_price && (
                        <span className="mr-1 text-xs text-gray-400 line-through">
                          ${trek.previous_price}
                        </span>
                      )}
                      <span className="font-black text-[#0b3a2c]">
                        from ${trek.price_per_adult?.toFixed(2)}
                      </span>
                    </div>
                    <Link
                      href={`/tour/${trek.slug}`}
                      className="flex items-center gap-1 rounded-full bg-[#0b3a2c] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#0d4a38]"
                    >
                      Book <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
