"use client";

import { useState, useTransition } from "react";
import { createWalkinBooking } from "@/app/actions/bookings";
import { CheckCircle2, Loader2 } from "lucide-react";

type Trek = {
  id: string;
  title: string;
  price_per_adult: number;
  duration: string;
};

export default function QuickBookForm({ treks }: { treks: Trek[] }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    trek_id: treks[0]?.id ?? "",
    booking_type: "group" as "group" | "private",
    tourist_name: "",
    tourist_phone: "",
    tourist_email: "",
    trek_date: "",
    trek_time: "08:30",
    adults: 1,
    children: 0,
  });

  const trek = treks.find((t) => t.id === form.trek_id);
  const multiplier = form.booking_type === "private" ? 1.5 : 1;
  const total = trek
    ? form.adults * trek.price_per_adult * multiplier +
      form.children * trek.price_per_adult * multiplier * 0.5
    : 0;

  const INPUT = `w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base font-medium text-gray-900 focus:border-[#0b3a2c] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0b3a2c]/10 transition-all`;

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const result = await createWalkinBooking({
        trek_id: form.trek_id,
        booking_type: form.booking_type,
        tourist_name: form.tourist_name,
        tourist_phone: form.tourist_phone,
        tourist_email: form.tourist_email || undefined,
        trek_date: form.trek_date,
        trek_time: form.trek_time,
        adults: form.adults,
        children: form.children,
      });
      if ("error" in result) {
        setError(result.error);
      } else {
        setDone(result.booking_ref);
      }
    });
  }

  if (done)
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-10 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#edf7f1]">
          <CheckCircle2 className="h-10 w-10 text-[#0b3a2c]" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#0b3a2c]">You&apos;re booked! 🎉</h2>
          <p className="mt-2 text-gray-500">Your reservation is confirmed.</p>
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-[#edf7f1] px-6 py-4">
            <p className="mb-1 text-xs font-black tracking-widest text-gray-400 uppercase">
              Booking reference
            </p>
            <p className="font-mono text-3xl font-black text-[#0b3a2c]">{done}</p>
          </div>
        </div>
        <div className="w-full rounded-2xl border border-amber-100 bg-amber-50 px-5 py-4 text-left">
          <p className="mb-1 text-sm font-black text-amber-800">📍 Pay before you start</p>
          <p className="text-sm text-amber-700">
            Please pay at the Ourika Travels bureau in Setti Fatma before your guide arrives.
          </p>
        </div>
        <button
          onClick={() => {
            setDone(null);
            setStep(1);
            setForm((f) => ({
              ...f,
              tourist_name: "",
              tourist_phone: "",
              tourist_email: "",
              trek_date: "",
              adults: 1,
              children: 0,
            }));
          }}
          className="w-full rounded-full border-2 border-[#0b3a2c] py-3.5 text-sm font-black text-[#0b3a2c] transition-all hover:bg-[#edf7f1]"
        >
          Book another experience
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`rounded-full transition-all duration-300 ${
              step === n
                ? "h-2.5 w-6 bg-[#0b3a2c]"
                : step > n
                  ? "h-2.5 w-2.5 bg-[#00ef9d]"
                  : "h-2.5 w-2.5 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="animate-in fade-in space-y-5 duration-300">
          <div>
            <h2 className="text-xl font-black text-[#0b3a2c]">Your details</h2>
            <p className="mt-1 text-sm text-gray-500">Just the basics — takes 30 seconds.</p>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Full name *"
              value={form.tourist_name}
              onChange={(e) => setForm((f) => ({ ...f, tourist_name: e.target.value }))}
              className={INPUT}
            />
            <input
              type="tel"
              placeholder="Phone number (WhatsApp) *"
              value={form.tourist_phone}
              onChange={(e) => setForm((f) => ({ ...f, tourist_phone: e.target.value }))}
              className={INPUT}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.tourist_email}
              onChange={(e) => setForm((f) => ({ ...f, tourist_email: e.target.value }))}
              className={INPUT}
            />
          </div>
          <button
            disabled={!form.tourist_name || !form.tourist_phone}
            onClick={() => setStep(2)}
            className="w-full rounded-full bg-[#0b3a2c] py-4 text-base font-black text-white transition-all active:scale-95 disabled:opacity-40"
          >
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in space-y-5 duration-300">
          <div>
            <h2 className="text-xl font-black text-[#0b3a2c]">Choose your trek</h2>
            <p className="mt-1 text-sm text-gray-500">Pick the experience you want.</p>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              {treks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setForm((f) => ({ ...f, trek_id: t.id }))}
                  className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                    form.trek_id === t.id
                      ? "border-[#0b3a2c] bg-[#edf7f1]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <p
                    className={`text-sm font-bold ${
                      form.trek_id === t.id ? "text-[#0b3a2c]" : "text-gray-800"
                    }`}
                  >
                    {t.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {t.duration} · ${t.price_per_adult}/adult
                  </p>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(["group", "private"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setForm((f) => ({ ...f, booking_type: type }))}
                  className={`rounded-2xl border-2 py-3.5 text-sm font-black transition-all ${
                    form.booking_type === type
                      ? "border-[#0b3a2c] bg-[#edf7f1] text-[#0b3a2c]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {type === "group" ? "👥 Group" : "🔒 Private"}
                </button>
              ))}
            </div>

            <input
              type="date"
              min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
              value={form.trek_date}
              onChange={(e) => setForm((f) => ({ ...f, trek_date: e.target.value }))}
              className={INPUT}
            />

            <select
              value={form.trek_time}
              onChange={(e) => setForm((f) => ({ ...f, trek_time: e.target.value }))}
              className={INPUT}
            >
              {["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                <p className="mb-2 text-xs font-black text-gray-500">Adults</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setForm((f) => ({ ...f, adults: Math.max(1, f.adults - 1) }))}
                    className="h-8 w-8 rounded-full border border-gray-200 font-black text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="text-xl font-black text-[#0b3a2c]">{form.adults}</span>
                  <button
                    onClick={() => setForm((f) => ({ ...f, adults: f.adults + 1 }))}
                    className="h-8 w-8 rounded-full border border-gray-200 font-black text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                <p className="mb-2 text-xs font-black text-gray-500">
                  Children
                  <span className="ml-1 font-normal text-emerald-600">−50%</span>
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        children: Math.max(0, f.children - 1),
                      }))
                    }
                    className="h-8 w-8 rounded-full border border-gray-200 font-black text-gray-600 hover:bg-gray-100"
                  >
                    −
                  </button>
                  <span className="text-xl font-black text-[#0b3a2c]">{form.children}</span>
                  <button
                    onClick={() => setForm((f) => ({ ...f, children: f.children + 1 }))}
                    className="h-8 w-8 rounded-full border border-gray-200 font-black text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="rounded-full border-2 border-gray-200 px-6 py-3.5 text-sm font-black text-gray-500 hover:bg-gray-50"
            >
              ←
            </button>
            <button
              disabled={!form.trek_date || !form.trek_id}
              onClick={() => setStep(3)}
              className="flex-1 rounded-full bg-[#0b3a2c] py-3.5 text-sm font-black text-white transition-all active:scale-95 disabled:opacity-40"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in space-y-5 duration-300">
          <div>
            <h2 className="text-xl font-black text-[#0b3a2c]">Confirm booking</h2>
          </div>

          <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-gray-50">
            {[
              { label: "Trek", value: trek?.title },
              {
                label: "Type",
                value: form.booking_type === "private" ? "🔒 Private" : "👥 Group",
              },
              {
                label: "Date",
                value: new Date(form.trek_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }),
              },
              { label: "Time", value: form.trek_time },
              {
                label: "Guests",
                value: `${form.adults} adult${form.adults > 1 ? "s" : ""}${
                  form.children > 0
                    ? ` + ${form.children} child${form.children > 1 ? "ren" : ""}`
                    : ""
                }`,
              },
              { label: "Name", value: form.tourist_name },
              { label: "Phone", value: form.tourist_phone },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-xs font-black tracking-wider text-gray-400 uppercase">
                  {row.label}
                </span>
                <span className="line-clamp-2 max-w-[60%] text-right text-sm font-semibold text-gray-800">
                  {row.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-b-2xl bg-[#edf7f1] px-4 py-3">
              <span className="text-sm font-black text-[#0b3a2c]">Total</span>
              <span className="text-xl font-black text-[#0b3a2c]">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-black text-amber-700">
              💰 Pay at the bureau before your trek starts
            </p>
          </div>

          {error && <p className="text-sm font-medium text-red-500">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="rounded-full border-2 border-gray-200 px-6 py-3.5 text-sm font-black text-gray-500 hover:bg-gray-50"
            >
              ←
            </button>
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0b3a2c] py-3.5 text-sm font-black text-white transition-all active:scale-95 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Booking...
                </>
              ) : (
                "Confirm reservation ✓"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
