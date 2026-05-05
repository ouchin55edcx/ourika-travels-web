"use client";

import { useState, useTransition } from "react";
import { Settings, CheckCircle2, AlertCircle } from "lucide-react";
import { updateGuideParameters } from "@/app/actions/guides";

type GuideParameters = {
  id?: string;
  trip_fixed_amount: number;
  guide_payment_per_trip: number;
};

export default function ParametersTab({
  initialParameters,
}: {
  initialParameters: GuideParameters;
}) {
  const [parameters, setParameters] = useState<GuideParameters>(initialParameters);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSaveParameters() {
    startTransition(async () => {
      const result = await updateGuideParameters({
        trip_fixed_amount: parseFloat(parameters.trip_fixed_amount as unknown as string),
        guide_payment_per_trip: parseFloat(
          parameters.guide_payment_per_trip as unknown as string,
        ),
      });

      if ("success" in result) {
        showToast("Parameters saved successfully ✓");
      } else if ("error" in result) {
        showToast(`Error: ${result.error}`);
      }
    });
  }

  const handleTripAmountChange = (value: string) => {
    setParameters((prev) => ({
      ...prev,
      trip_fixed_amount: value ? parseFloat(value) : 0,
    }));
  };

  const handleGuidePaymentChange = (value: string) => {
    setParameters((prev) => ({
      ...prev,
      guide_payment_per_trip: value ? parseFloat(value) : 0,
    }));
  };

  const adminMargin = parameters.trip_fixed_amount - parameters.guide_payment_per_trip;
  const guidePercentage = (
    (parameters.guide_payment_per_trip / parameters.trip_fixed_amount) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Info Banner */}
      <div className="rounded-2xl border border-[#d0ede0] bg-[#edf7f1] px-5 py-4 text-sm font-medium text-[#0b3a2c]">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>
            Global parameters for the guide management system. These values are used to calculate
            guide payments and admin earnings for each trip.
          </p>
        </div>
      </div>

      {/* Parameters Form */}
      <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-sm">
        <div className="space-y-8">
          {/* Trip Fixed Amount */}
          <div>
            <label className="block text-sm font-semibold text-[#0b3a2c] mb-2">
              Trip Fixed Amount (DH)
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={parameters.trip_fixed_amount}
              onChange={(e) => handleTripAmountChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-semibold text-[#0b3a2c] placeholder-gray-400 focus:border-[#00ef9d] focus:outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              Base amount charged per trip. This is the total revenue per trip.
            </p>
          </div>

          {/* Guide Payment Per Trip */}
          <div>
            <label className="block text-sm font-semibold text-[#0b3a2c] mb-2">
              Guide Payment Per Trip (DH)
            </label>
            <input
              type="number"
              min="0"
              step="10"
              value={parameters.guide_payment_per_trip}
              onChange={(e) => handleGuidePaymentChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-semibold text-[#0b3a2c] placeholder-gray-400 focus:border-[#00ef9d] focus:outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              Amount paid to the guide for completing one trip.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Financial Breakdown */}
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[#0b3a2c]">Financial Breakdown per Trip</p>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Trip Revenue */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-xs font-semibold text-blue-600 uppercase">Trip Revenue</p>
                <p className="mt-2 text-2xl font-black text-blue-700">
                  {parameters.trip_fixed_amount} DH
                </p>
                <p className="mt-1 text-xs text-blue-600">Total charged per trip</p>
              </div>

              {/* Guide Payment */}
              <div className="rounded-xl border border-[#00ef9d] bg-[#f0fdf9] p-4">
                <p className="text-xs font-semibold text-[#0b3a2c] uppercase">Guide Payment</p>
                <p className="mt-2 text-2xl font-black text-[#0b3a2c]">
                  {parameters.guide_payment_per_trip} DH
                </p>
                <p className="mt-1 text-xs text-gray-500">{guidePercentage}% of trip revenue</p>
              </div>

              {/* Admin Margin */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-semibold text-amber-600 uppercase">Admin Margin</p>
                <p className="mt-2 text-2xl font-black text-amber-700">{adminMargin} DH</p>
                <p className="mt-1 text-xs text-amber-600">
                  {(((adminMargin) / parameters.trip_fixed_amount) * 100).toFixed(1)}% profit margin
                </p>
              </div>
            </div>
          </div>

          {/* Example Calculation */}
          <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <p className="mb-3 text-xs font-semibold text-gray-600 uppercase">
              Example: Guide Daily Earnings
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">5 completed trips × {parameters.guide_payment_per_trip} DH</span>
                <span className="font-semibold text-gray-700">
                  {parameters.guide_payment_per_trip * 5} DH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">10 completed trips × {parameters.guide_payment_per_trip} DH</span>
                <span className="font-semibold text-gray-700">
                  {parameters.guide_payment_per_trip * 10} DH
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">20 completed trips × {parameters.guide_payment_per_trip} DH</span>
                <span className="font-semibold text-gray-700">
                  {parameters.guide_payment_per_trip * 20} DH
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex gap-3">
          <button
            onClick={handleSaveParameters}
            disabled={isPending}
            className="flex items-center gap-2 rounded-full bg-[#0b3a2c] px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0b3a2c]/90 disabled:opacity-50"
          >
            <Settings className="h-4 w-4" />
            {isPending ? "Saving..." : "Save Parameters"}
          </button>
          <button className="flex items-center gap-2 rounded-full border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50">
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Usage Information */}
      <div className="rounded-2xl border border-black/5 bg-gray-50 p-6">
        <h3 className="text-sm font-black text-[#0b3a2c] mb-3">How These Parameters Work</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex gap-2">
            <span className="font-semibold text-[#0b3a2c]">•</span>
            <span>
              <strong>Trip Fixed Amount:</strong> The base price charged per trip. This is what
              tourists pay.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[#0b3a2c]">•</span>
            <span>
              <strong>Guide Payment Per Trip:</strong> The commission paid to the guide for each
              completed trip.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[#0b3a2c]">•</span>
            <span>
              <strong>Admin Margin:</strong> The difference between trip amount and guide payment
              (company profit).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-[#0b3a2c]">•</span>
            <span>
              Guides earn based on completed trips. Cancelled or no-show trips don't generate
              earnings.
            </span>
          </li>
        </ul>
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
