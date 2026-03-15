'use client';

import { useState, useTransition } from 'react';
import { requestVerification } from '@/app/actions/users';
import {
  ShieldCheck, ShieldAlert, Clock, ShieldX,
  ChevronRight, Loader2, CheckCircle2
} from 'lucide-react';

type Props = {
  status: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  verifiedAt?: string | null;
  note?: string | null;
};

export default function VerificationBanner({ status, verifiedAt, note }: Props) {
  const [isPending, startTransition] = useTransition();
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleRequest() {
    startTransition(async () => {
      const result = await requestVerification();
      if ('error' in result) setError(result.error || 'An error occurred');
      else setRequested(true);
    });
  }

  // ── VERIFIED ──────────────────────────────────────────────────────
  if (status === 'verified') {
    return (
      <div className="flex items-center gap-4 rounded-[2rem]
        bg-[#0b3a2c] px-8 py-6 shadow-sm">
        {/* Ourika Travels badge */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center
          rounded-2xl bg-[#00ef9d]">
          <ShieldCheck className="h-8 w-8 text-[#0b3a2c]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-lg font-black text-white">
              Ourika Travels Verified Guide
            </p>
            <span className="rounded-full bg-[#00ef9d] px-3 py-0.5
              text-[10px] font-black uppercase tracking-widest text-[#0b3a2c]">
              Official
            </span>
          </div>
          <p className="mt-1 text-sm text-white/60">
            Your profile is verified and trusted by travelers.
            {verifiedAt && ` Verified on ${new Date(verifiedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.`}
          </p>
        </div>
        <CheckCircle2 className="h-8 w-8 shrink-0 text-[#00ef9d]" />
      </div>
    );
  }

  // ── PENDING ───────────────────────────────────────────────────────
  if (status === 'pending' || requested) {
    return (
      <div className="flex items-center gap-4 rounded-[2rem]
        border border-amber-100 bg-amber-50 px-8 py-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center
          rounded-2xl bg-amber-100">
          <Clock className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <p className="font-black text-amber-900">
            Verification request submitted
          </p>
          <p className="mt-1 text-sm text-amber-700">
            Our team is reviewing your profile and credentials.
            This usually takes 1–2 business days.
          </p>
        </div>
      </div>
    );
  }

  // ── REJECTED ──────────────────────────────────────────────────────
  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-4 rounded-[2rem]
        border border-red-100 bg-red-50 px-8 py-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center
          rounded-2xl bg-red-100">
          <ShieldX className="h-6 w-6 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="font-black text-red-900">
            Verification not approved
          </p>
          {note && (
            <p className="mt-1 text-sm text-red-700">
              Reason: {note}
            </p>
          )}
          <p className="mt-1 text-sm text-red-700">
            Please update your profile and resubmit.
          </p>
        </div>
        <button
          onClick={handleRequest}
          disabled={isPending}
          className="shrink-0 rounded-full bg-red-600 px-5 py-2.5
            text-sm font-bold text-white hover:bg-red-700 transition-all
            flex items-center gap-2 disabled:opacity-60">
          {isPending
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : 'Resubmit'}
        </button>
      </div>
    );
  }

  // ── UNSUBMITTED (default) ─────────────────────────────────────────
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center
      gap-4 rounded-[2rem] border border-[#d0ede0] bg-[#f0faf5]
      px-8 py-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center
        rounded-2xl bg-[#0b3a2c]/10">
        <ShieldAlert className="h-6 w-6 text-[#0b3a2c]" />
      </div>
      <div className="flex-1">
        <p className="font-black text-[#0b3a2c]">
          Get the Ourika Travels Verified badge
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Verified guides get 3× more bookings. Complete your profile
          then request verification — our team reviews within 48h.
        </p>
        {error && (
          <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
        )}
      </div>
      <button
        onClick={handleRequest}
        disabled={isPending}
        className="shrink-0 flex items-center gap-2 rounded-full
          bg-[#0b3a2c] px-6 py-3 text-sm font-black text-white
          shadow-sm hover:bg-[#0d4a38] transition-all active:scale-95
          disabled:opacity-60">
        {isPending
          ? <><Loader2 className="h-4 w-4 animate-spin" /> Requesting...</>
          : <><ShieldCheck className="h-4 w-4" /> Request verification
             <ChevronRight className="h-4 w-4" /></>}
      </button>
    </div>
  );
}

