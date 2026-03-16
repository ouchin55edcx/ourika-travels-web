'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Info,
  Users,
  Crown,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { createBooking } from '@/app/actions/bookings';
import BookingSummaryCard from './BookingSummaryCard';
import BookingTicket from './BookingTicket';

type Trek = {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  price_per_adult: number;
  previous_price: number | null;
  duration: string;
  start_location: string;
  start_time: string | null;
  max_group_size: number;
  free_cancellation_hours: number;
  included: string[];
  not_included: string[];
  categories: { name: string } | null;
};

type Props = {
  trek: Trek;
  initialType: 'group' | 'private';
  prefillName: string;
  prefillEmail: string;
  prefillPhone: string;
};

const TIME_OPTIONS = ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00'];

const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export default function BookingForm({
  trek,
  initialType,
  prefillName,
  prefillEmail,
  prefillPhone,
}: Props) {
  const router = useRouter();
  const [bookingType, setBookingType] = useState<'group' | 'private'>(initialType);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ ref: string; id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [form, setForm] = useState({
    name: prefillName,
    email: prefillEmail,
    phone: prefillPhone,
    date: '',
    time: trek.start_time || '08:30',
    adults: 1,
    children: 0,
    special_requests: '',
  });

  const multiplier = bookingType === 'private' ? 1.5 : 1;
  const pricePerAdult = trek.price_per_adult * multiplier;
  const pricePerChild = pricePerAdult * 0.5;
  const totalPrice = form.adults * pricePerAdult + form.children * pricePerChild;

  const step1Valid = !!form.name?.trim() && !!form.email?.trim() && !!form.phone?.trim();
  const step2Valid = !!form.date && form.adults >= 1;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const result = await createBooking({
      trek_id: trek.id,
      booking_type: bookingType,
      tourist_name: form.name.trim(),
      tourist_email: form.email.trim(),
      tourist_phone: form.phone.trim(),
      trek_date: form.date,
      trek_time: form.time,
      adults: form.adults,
      children: form.children,
      special_requests: form.special_requests.trim() || undefined,
    });
    setSubmitting(false);
    if ('error' in result) {
      setError(result.error);
      return;
    }
    setBookingResult({ ref: result.booking_ref, id: result.booking_id });
  }

  if (bookingResult) {
    return (
      <BookingTicket
        bookingId={bookingResult.ref}
        activityTitle={trek.title}
        date={new Date(form.date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
        time={form.time}
        guests={`${form.adults} adult${form.adults > 1 ? 's' : ''}${form.children > 0 ? ` + ${form.children} children` : ''}`}
        totalPrice={`$${totalPrice.toFixed(2)}`}
        customerName={form.name}
        onClose={() => router.push('/reservation-historic')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
      <div className="order-1 space-y-8 lg:order-none">
        {step === 1 && (
        <section>
          <h2 className="text-lg font-black text-[#0b3a2c] mb-4">1. Your details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#0b3a2c] focus:ring-2 focus:ring-[#0b3a2c]/20"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#0b3a2c] focus:ring-2 focus:ring-[#0b3a2c]/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#0b3a2c] focus:ring-2 focus:ring-[#0b3a2c]/20"
                placeholder="+212 6XX XXX XXX"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300 text-[#0b3a2c]" />
              SMS updates
            </label>
            {!prefillEmail && (
              <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <Info className="h-4 w-4 shrink-0 text-blue-500 mt-0.5" />
                <p className="text-sm text-blue-700">
                  No account? No problem. We&apos;ll create one for you automatically after booking so you can track your reservation.
                </p>
              </div>
            )}
          </div>
        </section>
        )}

        {step === 2 && (
        <section>
          <h2 className="text-lg font-black text-[#0b3a2c] mb-4">2. Trip options</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setBookingType('group')}
                className={`flex flex-col items-start rounded-2xl border-2 p-5 text-left transition-all ${
                  bookingType === 'group'
                    ? 'border-[#0b3a2c] bg-[#f0faf5] ring-2 ring-[#0b3a2c]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="rounded-xl bg-[#0b3a2c]/10 p-2">
                    <Users className="h-5 w-5 text-[#0b3a2c]" />
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700">
                    Most popular
                  </span>
                </div>
                <h3 className="mt-2 font-bold text-gray-900">Join a group</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Travel with other adventurers. Fixed schedule, best price.
                </p>
                <p className="mt-2 text-sm font-bold text-[#0b3a2c]">
                  ${(trek.price_per_adult * 1).toFixed(2)} per adult
                </p>
              </button>
              <button
                type="button"
                onClick={() => setBookingType('private')}
                className={`flex flex-col items-start rounded-2xl border-2 p-5 text-left transition-all ${
                  bookingType === 'private'
                    ? 'border-[#0b3a2c] bg-[#f0faf5] ring-2 ring-[#0b3a2c]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="rounded-xl bg-[#0b3a2c]/10 p-2">
                    <Crown className="h-5 w-5 text-[#0b3a2c]" />
                  </div>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
                    ×1.5 price
                  </span>
                </div>
                <h3 className="mt-2 font-bold text-gray-900">Private tour</h3>
                <p className="mt-1 text-xs text-gray-500">
                  Exclusive trek just for your group. You pick the date and time.
                </p>
                <p className="mt-2 text-sm font-bold text-[#0b3a2c]">
                  ${(trek.price_per_adult * 1.5).toFixed(2)} per adult
                </p>
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select date *</label>
              <input
                type="date"
                min={tomorrow}
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-[#0b3a2c] focus:ring-2 focus:ring-[#0b3a2c]/20"
              />
              <p className="mt-1 text-xs text-gray-500">Flexible dates — we&apos;ll confirm within 24h</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred start time</label>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, time: t }))}
                    className={`rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all ${
                      form.time === t
                        ? 'border-[#0b3a2c] bg-[#f0faf5] text-[#0b3a2c]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Adults</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, adults: Math.max(1, f.adults - 1) }))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center font-bold">{form.adults}</span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, adults: Math.min(trek.max_group_size, f.adults + 1) }))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Children (under 12) <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">50% off</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, children: Math.max(0, f.children - 1) }))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center font-bold">{form.children}</span>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, children: Math.min(10, f.children + 1) }))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500">Max group size: {trek.max_group_size} people</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Special requests (optional)</label>
              <textarea
                rows={3}
                value={form.special_requests}
                onChange={(e) => setForm((f) => ({ ...f, special_requests: e.target.value }))}
                placeholder="Dietary requirements, mobility needs, language preference..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-[#0b3a2c] focus:ring-2 focus:ring-[#0b3a2c]/20"
              />
            </div>
          </div>
        </section>
        )}

        {step === 3 && (
        <section>
          <h2 className="text-lg font-black text-[#0b3a2c] mb-4">3. Review & Confirm</h2>
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#0b3a2c] p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00ef9d]">
                  <MapPin className="h-6 w-6 text-[#0b3a2c]" />
                </div>
                <div>
                  <p className="font-black text-lg">Pay at Ourika Travels Bureau</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/80">
                    Your spot is reserved for free. Pay the full amount{' '}
                    <strong className="text-[#00ef9d]">before the activity starts</strong>{' '}
                    at our bureau in the centre of Setti Fatma — the meeting point for all our treks.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white">
                      📍 Setti Fatma, Ourika Valley
                    </span>
                    <span className="rounded-full border border-[#00ef9d]/30 bg-[#00ef9d]/20 px-3 py-1 text-xs font-bold text-[#00ef9d]">
                      Cash only
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-1 text-gray-500">Trek</td>
                    <td className="py-1 font-semibold text-right">{trek.title}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-500">Type</td>
                    <td className="py-1 font-semibold text-right capitalize">{bookingType}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-500">Date & time</td>
                    <td className="py-1 font-semibold text-right">
                      {form.date ? new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'} • {form.time}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-500">Adults × ${pricePerAdult.toFixed(2)}</td>
                    <td className="py-1 text-right">${(form.adults * pricePerAdult).toFixed(2)}</td>
                  </tr>
                  {form.children > 0 && (
                    <tr>
                      <td className="py-1 text-gray-500">Children × ${pricePerChild.toFixed(2)}</td>
                      <td className="py-1 text-right">${(form.children * pricePerChild).toFixed(2)}</td>
                    </tr>
                  )}
                  <tr className="border-t border-gray-200">
                    <td className="py-2 font-bold text-gray-900">Total</td>
                    <td className="py-2 text-right font-black text-[#0b3a2c]">${totalPrice.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-700">
                Free cancellation up to {trek.free_cancellation_hours}h before the start. Cancel anytime from your booking history.
              </p>
            </div>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0b3a2c] focus:ring-[#0b3a2c]"
              />
              <span className="text-sm text-gray-600">
                I agree to Ourika Travels&apos; Terms of Service and Cancellation Policy. I understand I am booking a spot and will pay at the bureau before the activity.
              </span>
            </label>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !termsAccepted}
              className="w-full rounded-full bg-[#0b3a2c] py-4 text-lg font-black text-white transition-all hover:bg-[#0d4a38] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Confirming...' : 'Confirm reservation — Pay at bureau'}
            </button>
            {error && (
              <p className="text-sm font-semibold text-red-600">{error}</p>
            )}
          </div>
        </section>
        )}

        <div className="flex items-center justify-between pt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
              className="text-sm font-semibold text-gray-600 hover:text-[#0b3a2c]"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
              disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
              className="rounded-full bg-[#0b3a2c] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0d4a38] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          ) : null}
        </div>
      </div>

      <div className="relative order-2 lg:order-none lg:block">
        <div className="lg:sticky lg:top-10">
          <BookingSummaryCard
            trek={{
              title: trek.title,
              cover_image: trek.cover_image,
              rating: (trek as { rating?: number }).rating ?? 0,
              review_count: (trek as { review_count?: number }).review_count ?? 0,
              duration: trek.duration,
            }}
            bookingType={bookingType}
            date={form.date}
            time={form.time}
            adults={form.adults}
            children={form.children}
            pricePerAdult={pricePerAdult}
            pricePerChild={pricePerChild}
            totalPrice={totalPrice}
            freeCancellationHours={trek.free_cancellation_hours}
          />
        </div>
      </div>
    </div>
  );
}
