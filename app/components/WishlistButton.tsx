'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleWishlist } from '@/app/actions/wishlist';

export default function WishlistButton({
  trekId,
  initialState = false,
  iconOnly,
}: {
  trekId: string;
  initialState?: boolean;
  iconOnly?: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(initialState);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleWishlist(trekId);
      if ('added' in result) setWishlisted(result.added);
    });
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#123d2f] shadow-sm transition hover:bg-white disabled:opacity-50"
        aria-label={wishlisted ? 'Saved' : 'Save'}
      >
        <Heart
          className={`h-4 w-4 transition-all ${
            wishlisted ? 'fill-red-500 text-red-500' : '' 
          }`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-[#f5f5f5] disabled:opacity-50"
    >
      <Heart
        className={`h-4 w-4 transition-all ${
          wishlisted ? 'fill-red-500 text-red-500' : 'text-[#123d2f]'
        }`}
      />
      <span>{wishlisted ? 'Saved' : 'Save'}</span>
    </button>
  );
}
