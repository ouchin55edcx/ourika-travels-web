"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { GripVertical, Pause, Play, Loader2, CheckCircle2, Shield, PlusCircle } from "lucide-react";

import { updateGuideOrder, toggleGuideActive } from "@/app/actions/guides";
import { toggleGuideAddTreksPermission } from "@/app/actions/guide-permissions";

type Guide = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  guide_order: number | null;
  guide_active: boolean | null;
  is_verified: boolean | null;
  can_add_treks: boolean | null;
  specialties: string[] | null;
  languages: string[] | null;
  is_active: boolean | null;
  role?: string;
};

export default function GuideOrderManagement({ initialGuides }: { initialGuides: Guide[] }) {
  const [guides, setGuides] = useState<Guide[]>(
    [...initialGuides]
      .map((g) => ({
        ...g,
        guide_active: g.guide_active ?? false,
        is_active: g.is_active ?? true,
        is_verified: g.is_verified ?? false,
        can_add_treks: g.can_add_treks ?? false,
        specialties: g.specialties ?? [],
        languages: g.languages ?? [],
        guide_order: g.guide_order ?? null,
      }))
      .sort((a, b) => (a.guide_order ?? 9999) - (b.guide_order ?? 9999)),
  );
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...guides];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    const updated = next.map((g, i) => ({ ...g, guide_order: i + 1 }));
    setGuides(updated);
    saveOrder(updated);
  }

  function moveDown(index: number) {
    if (index === guides.length - 1) return;
    const next = [...guides];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    const updated = next.map((g, i) => ({ ...g, guide_order: i + 1 }));
    setGuides(updated);
    saveOrder(updated);
  }

  function saveOrder(updated: Guide[]) {
    startTransition(async () => {
      const payload = updated.map((g) => ({
        id: g.id,
        guide_order: g.guide_order ?? 0,
      }));
      const result = await updateGuideOrder(payload);
      if ("success" in result) showToast("Order saved ✓");
    });
  }

  function handleToggleActive(guideId: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleGuideActive(guideId, !current);
      if ("success" in result) {
        setGuides((prev) =>
          prev.map((g) => (g.id === guideId ? { ...g, guide_active: !current } : g)),
        );
        showToast(`Guide ${!current ? "activated" : "paused"} ✓`);
      }
    });
  }

  function handleToggleAddTreks(guideId: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleGuideAddTreksPermission(guideId, !current);
      if ("success" in result) {
        setGuides((prev) =>
          prev.map((g) => (g.id === guideId ? { ...g, can_add_treks: !current } : g)),
        );
        showToast(`Trek creation ${!current ? "enabled" : "disabled"} ✓`);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#d0ede0] bg-[#edf7f1] px-5 py-4 text-sm font-medium text-[#0b3a2c]">
        ℹ️ Drag order matters: the next booking goes to the first
        <strong> active</strong> guide after the last assigned one. Paused guides are skipped.
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
        {guides.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl font-black text-gray-300">No guides found</p>
            <p className="mt-2 text-sm text-gray-400">
              Create a guide account in the Users page first
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {guides.map((guide, index) => (
              <div
                key={guide.id}
                className={`flex items-center gap-4 px-5 py-4 transition-colors ${!guide.guide_active ? "bg-gray-50/50 opacity-50" : "hover:bg-[#f7fdf9]"}`}
              >
                {/* Order number */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                    index === 0 && guide.guide_active
                      ? "bg-[#00ef9d] text-[#0b3a2c]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {guide.guide_order ?? index + 1}
                </div>

                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#0b3a2c]">
                  {guide.avatar_url ? (
                    <Image
                      src={guide.avatar_url}
                      alt=""
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-black text-white">
                      {guide.full_name?.charAt(0) || "G"}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-[#0b3a2c]">{guide.full_name || "Unknown"}</p>
                    {guide.is_verified && <Shield className="h-4 w-4 text-[#00ef9d]" />}
                    {!guide.guide_active && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-black text-gray-500">
                        Paused
                      </span>
                    )}
                    {!guide.is_active && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-600">
                        Inactive
                      </span>
                    )}
                    {index === 0 && guide.guide_active && (
                      <span className="rounded-full border border-[#00ef9d]/40 bg-[#00ef9d]/20 px-2 py-0.5 text-[10px] font-black text-[#0b3a2c]">
                        ⚡ Next in line
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs font-medium text-gray-400">
                    {guide.languages?.slice(0, 3).join(" · ") || ""}
                    {guide.specialties?.length > 0 ? ` · ${guide.specialties[0]}` : ""}
                  </p>
                </div>

                {/* Move up/down buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0 || isPending}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-black text-gray-500 transition-all hover:bg-[#0b3a2c] hover:text-white disabled:opacity-20"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === guides.length - 1 || isPending}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-black text-gray-500 transition-all hover:bg-[#0b3a2c] hover:text-white disabled:opacity-20"
                  >
                    ↓
                  </button>
                </div>

                {/* Pause/resume toggle */}
                <button
                  onClick={() => handleToggleActive(guide.id, guide.guide_active)}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-all disabled:opacity-50 ${
                    guide.guide_active
                      ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                      : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  }`}
                >
                  {guide.guide_active ? (
                    <>
                      <Pause className="h-3 w-3" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-3 w-3" /> Resume
                    </>
                  )}
                </button>

                {/* Add Trek Permission Toggle */}
                <button
                  onClick={() => handleToggleAddTreks(guide.id, guide.can_add_treks)}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-black transition-all disabled:opacity-50 ${
                    guide.can_add_treks
                      ? "border border-[#00ef9d] bg-[#00ef9d]/20 text-[#0b3a2c] hover:bg-[#00ef9d]/30"
                      : "border border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  <PlusCircle className="h-3 w-3" />
                  {guide.can_add_treks ? "Can add treks" : "Cannot add treks"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-2xl bg-[#0b3a2c] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-[#00ef9d]" />
          {toast}
        </div>
      )}
    </div>
  );
}
