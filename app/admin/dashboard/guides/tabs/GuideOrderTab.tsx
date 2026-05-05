"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Pause, Play, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { updateGuideOrder, toggleGuideActive, markGuideAbsent } from "@/app/actions/guides";

type Guide = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  guide_order: number | null;
  guide_active: boolean | null;
  is_verified: boolean | null;
  specialties: string[] | null;
  languages: string[] | null;
  is_active: boolean | null;
};

type Absence = {
  id: string;
  guide_id: string;
  absent_from: string;
  absent_until: string;
  reason?: string;
};

export default function GuideOrderTab({
  guides: initialGuides,
  absences: initialAbsences,
}: {
  guides: Guide[];
  absences: Absence[];
}) {
  const [guides, setGuides] = useState<Guide[]>(
    [...initialGuides]
      .map((g) => ({
        ...g,
        guide_active: g.guide_active ?? false,
        is_active: g.is_active ?? true,
        is_verified: g.is_verified ?? false,
        specialties: g.specialties ?? [],
        languages: g.languages ?? [],
        guide_order: g.guide_order ?? null,
      }))
      .sort((a, b) => (a.guide_order ?? 9999) - (b.guide_order ?? 9999)),
  );

  const [absences, setAbsences] = useState(initialAbsences);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedGuideForAbsence, setSelectedGuideForAbsence] = useState<string | null>(null);

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

  function handleMarkAbsent(guideId: string) {
    startTransition(async () => {
      const result = await markGuideAbsent({
        guide_id: guideId,
        absent_from: new Date().toISOString(),
        reason: "Marked absent by admin",
      });
      if ("success" in result) {
        showToast("Guide marked absent for 24 hours ✓");
        // Simulate adding to absences
        setAbsences((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            guide_id: guideId,
            absent_from: new Date().toISOString(),
            absent_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            reason: "Marked absent by admin",
          },
        ]);
      }
    });
  }

  function isGuideAbsent(guideId: string): boolean {
    return absences.some((a) => a.guide_id === guideId && new Date(a.absent_until) > new Date());
  }

  const activeGuideCount = guides.filter((g) => g.guide_active).length;
  const officialGuides = guides.filter((g) => g.is_verified);
  const nonOfficialGuides = guides.filter((g) => !g.is_verified);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Guides</p>
          <p className="mt-1 text-2xl font-black text-[#0b3a2c]">{guides.length}</p>
          <p className="mt-1 text-xs text-gray-400">
            {officialGuides.length} official · {nonOfficialGuides.length} non-official
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Active Guides</p>
          <p className="mt-1 text-2xl font-black text-[#00ef9d]">{activeGuideCount}</p>
          <p className="mt-1 text-xs text-gray-400">
            {guides.length - activeGuideCount} paused or inactive
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Absent</p>
          <p className="mt-1 text-2xl font-black text-amber-600">{absences.length}</p>
          <p className="mt-1 text-xs text-gray-400">Currently absent (24h cycle)</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl border border-[#d0ede0] bg-[#edf7f1] px-5 py-4 text-sm font-medium text-[#0b3a2c]">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>
            Round-Robin Order: Next booking goes to the first <strong>active</strong> guide.
            Paused guides are skipped. Move guide up/down to change their position in queue.
          </p>
        </div>
      </div>

      {/* Guide List */}
      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
        {guides.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl font-black text-gray-300">No guides found</p>
            <p className="mt-2 text-sm text-gray-400">Create guide accounts in the Users page first</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {guides.map((guide, index) => {
              const isAbsent = isGuideAbsent(guide.id);
              return (
                <div
                  key={guide.id}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                    !guide.guide_active || isAbsent
                      ? "bg-gray-50/50 opacity-50"
                      : "hover:bg-[#f7fdf9]"
                  }`}
                >
                  {/* Order Number */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                      index === 0 && guide.guide_active && !isAbsent
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
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-black text-[#0b3a2c]">{guide.full_name || "Unknown"}</p>
                      {guide.is_verified && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#00ef9d]/40 bg-[#00ef9d]/10 px-2 py-0.5 text-[10px] font-black text-[#0b3a2c]">
                          <Shield className="h-3 w-3" /> Official
                        </span>
                      )}
                      {isAbsent && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
                          <AlertCircle className="h-3 w-3" /> Absent 24h
                        </span>
                      )}
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
                      {index === 0 && guide.guide_active && !isAbsent && (
                        <span className="rounded-full border border-[#00ef9d]/40 bg-[#00ef9d]/20 px-2 py-0.5 text-[10px] font-black text-[#0b3a2c]">
                          ⚡ Next in line
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-gray-400">
                      {guide.languages?.slice(0, 3).join(" · ") || ""}
                      {guide.specialties && guide.specialties.length > 0 ? ` · ${guide.specialties[0]}` : ""}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Move Up/Down */}
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

                    {/* Pause/Resume */}
                    <button
                      onClick={() => handleToggleActive(guide.id, guide.guide_active ?? false)}
                      disabled={isPending}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all disabled:opacity-50 ${
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

                    {/* Mark Absent */}
                    {!isAbsent && (
                      <button
                        onClick={() => handleMarkAbsent(guide.id)}
                        disabled={isPending}
                        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-100 disabled:opacity-50"
                      >
                        Absent 24h
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-2xl bg-[#0b3a2c] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-[#00ef9d]" />
          {toast}
        </div>
      )}
    </div>
  );
}
