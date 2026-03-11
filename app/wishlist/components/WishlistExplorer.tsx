"use client";

import { useState } from "react";
import MoreToExplore from "@/app/experiences/components/MoreToExplore";
import WishlistCard from "./WishlistCard";
import { wishlistData } from "./wishlistData";

export default function WishlistExplorer() {
  const [items, setItems] = useState(wishlistData);

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <div className="absolute left-1/2 top-0 h-[260px] w-[85%] -translate-x-1/2 rounded-[32px] bg-[radial-gradient(circle_at_top,_#fff8df_0%,_rgba(255,248,223,0)_70%)]" />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#7d816f]">
              Saved experiences
            </p>
            <h1 className="text-[30px] font-black leading-tight text-[#111827] sm:text-[36px]">
              Your Wishlist
            </h1>
            <p className="text-sm font-medium text-[#6b7280]">
              {items.length} experiences ready to plan
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-5">
        {items.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#d6d7cc] bg-white/70 p-10 text-center">
            <p className="text-[20px] font-black text-[#1f2937]">
              Your wishlist is empty
            </p>
            <p className="mt-2 text-sm text-[#6b7280]">
              Browse experiences and save the ones that match your travel mood.
            </p>
          </div>
        ) : (
          items.map((experience) => (
            <WishlistCard
              key={experience.id}
              experience={experience}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>

      <div className="pt-10">
        <div className="mb-8 h-px w-full bg-[#e5e7eb]" />
        <MoreToExplore />
      </div>
    </section>
  );
}
