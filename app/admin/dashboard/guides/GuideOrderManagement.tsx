'use client';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { GripVertical, Pause, Play, Loader2,
         CheckCircle2, Shield } from 'lucide-react';

import { updateGuideOrder, toggleGuideActive }
  from '@/app/actions/guides';

type Guide = {
  id: string; full_name: string; avatar_url: string | null;
  phone: string | null; guide_order: number | null;
  guide_active: boolean; is_verified: boolean;
  specialties: string[]; languages: string[];
};

export default function GuideOrderManagement({
  initialGuides,
}: { initialGuides: Guide[] }) {
  const [guides, setGuides] = useState<Guide[]>(
    [...initialGuides].sort((a, b) =>
      (a.guide_order ?? 999) - (b.guide_order ?? 999)
    )
  );
  const [toast, setToast] = useState<string|null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg); setTimeout(() => setToast(null), 3000);
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...guides];
    [next[index-1], next[index]] = [next[index], next[index-1]];
    const updated = next.map((g, i) => ({ ...g, guide_order: i + 1 }));
    setGuides(updated);
    saveOrder(updated);
  }

  function moveDown(index: number) {
    if (index === guides.length - 1) return;
    const next = [...guides];
    [next[index], next[index+1]] = [next[index+1], next[index]];
    const updated = next.map((g, i) => ({ ...g, guide_order: i + 1 }));
    setGuides(updated);
    saveOrder(updated);
  }

  function saveOrder(updated: Guide[]) {
    startTransition(async () => {
      const payload = updated.map(g => ({
        id: g.id, guide_order: g.guide_order ?? 0
      }));
      const result = await updateGuideOrder(payload);
      if ('success' in result) showToast('Order saved ✓');
    });
  }

  function handleToggleActive(guideId: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleGuideActive(guideId, !current);
      if ('success' in result) {
        setGuides(prev => prev.map(g =>
          g.id === guideId ? { ...g, guide_active: !current } : g
        ));
        showToast(`Guide ${!current ? 'activated' : 'paused'} ✓`);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#d0ede0] bg-[#f0faf5]
        px-5 py-4 text-sm font-medium text-[#0b3a2c]">
        ℹ️ Drag order matters: the next booking goes to the first
        <strong> active</strong> guide after the last assigned one.
        Paused guides are skipped.
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-black/5
        bg-white shadow-sm">
        {guides.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-xl font-black text-gray-300">
              No active guides
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {guides.map((guide, index) => (
              <div key={guide.id}
                className={`flex items-center gap-4 px-5 py-4
                  transition-colors
                  ${!guide.guide_active ? 'opacity-50 bg-gray-50/50' : 'hover:bg-[#f7fdf9]'}`}>

                {/* Order number */}
                <div className={`flex h-9 w-9 shrink-0 items-center
                  justify-center rounded-full font-black text-sm
                  ${index === 0 && guide.guide_active
                    ? 'bg-[#00ef9d] text-[#0b3a2c]'
                    : 'bg-gray-100 text-gray-500'}`}>
                  {guide.guide_order ?? index + 1}
                </div>

                {/* Avatar */}
                <div className="h-12 w-12 rounded-2xl overflow-hidden
                  bg-[#0b3a2c] flex items-center justify-center shrink-0">
                  {guide.avatar_url ? (
                    <Image src={guide.avatar_url} alt=""
                      width={48} height={48}
                      className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-white font-black text-lg">
                      {guide.full_name?.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-black text-[#0b3a2c]">
                      {guide.full_name}
                    </p>
                    {guide.is_verified && (
                      <Shield className="h-4 w-4 text-[#00ef9d]" />
                    )}
                    {!guide.guide_active && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5
                        text-[10px] font-black text-gray-500">
                        Paused
                      </span>
                    )}
                    {index === 0 && guide.guide_active && (
                      <span className="rounded-full bg-[#00ef9d]/20
                        border border-[#00ef9d]/40 px-2 py-0.5
                        text-[10px] font-black text-[#0b3a2c]">
                        ⚡ Next in line
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {guide.languages?.slice(0,3).join(' · ')}
                    {guide.specialties?.length > 0
                      ? ` · ${guide.specialties[0]}` : ''}
                  </p>
                </div>

                {/* Move up/down buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0 || isPending}
                    className="h-7 w-7 rounded-lg bg-gray-100 flex
                      items-center justify-center text-gray-500
                      hover:bg-[#0b3a2c] hover:text-white
                      disabled:opacity-20 transition-all text-xs
                      font-black">
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === guides.length-1 || isPending}
                    className="h-7 w-7 rounded-lg bg-gray-100 flex
                      items-center justify-center text-gray-500
                      hover:bg-[#0b3a2c] hover:text-white
                      disabled:opacity-20 transition-all text-xs
                      font-black">
                    ↓
                  </button>
                </div>

                {/* Pause/resume toggle */}
                <button
                  onClick={() => handleToggleActive(guide.id, guide.guide_active)}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 rounded-full
                    px-4 py-2 text-xs font-black transition-all
                    disabled:opacity-50
                    ${guide.guide_active
                      ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                      : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}>
                  {guide.guide_active
                    ? <><Pause className="h-3 w-3" /> Pause</>
                    : <><Play  className="h-3 w-3" /> Resume</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center
          gap-2 rounded-2xl bg-[#0b3a2c] px-5 py-3 text-sm font-semibold
          text-white shadow-2xl animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4 text-[#00ef9d]" />
          {toast}
        </div>
      )}
    </div>
  );
}
