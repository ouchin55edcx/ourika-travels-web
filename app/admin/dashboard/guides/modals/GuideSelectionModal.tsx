"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Shield, AlertCircle, Clock } from "lucide-react";

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
};

type Booking = {
  id: string;
  booking_ref: string;
  trek_date: string;
  trek_time: string;
  tourist_name: string;
  total_price: number;
  adults: number;
  children: number;
  payment_status: string;
  status: string;
};

type Absence = {
  id: string;
  guide_id: string;
  absent_from: string;
  absent_until: string;
  reason?: string;
};

export default function GuideSelectionModal({
  trip,
  guides,
  absences,
  onSelect,
  onClose,
  isPending,
}: {
  trip: Booking;
  guides: Guide[];
  absences: Absence[];
  onSelect: (guideId: string, chauffeurName?: string, status?: string) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);
  const [chauffeurName, setChauffeurName] = useState("");
  const [status, setStatus] = useState<"active" | "completed">("active");

  const isGuideAbsent = (guideId: string) =>
    absences.some((a) => a.guide_id === guideId && new Date(a.absent_until) > new Date());

  const availableGuides = guides.filter((g) => !isGuideAbsent(g.id) && g.guide_active);

  const handleConfirm = () => {
    if (!selectedGuide) return;
    onSelect(selectedGuide, chauffeurName || undefined, status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl space-y-6 rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#0b3a2c]">Assign Guide to Trip</h2>
            <p className="mt-1 text-sm text-gray-500">{trip.booking_ref}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Trip Info */}
        <div className="rounded-2xl border border-black/5 bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-700">
            <Clock className="inline h-4 w-4 mr-2" />
            {trip.trek_date} at {trip.trek_time}
          </p>
          <p className="mt-2 text-sm text-gray-600">
            {trip.tourist_name} • {trip.adults} adults, {trip.children} children • {trip.total_price} DH
          </p>
        </div>

        {/* Guide Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#0b3a2c] mb-3">Select Guide</label>
          {availableGuides.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-6 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No available guides right now</p>
            </div>
          ) : (
            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {availableGuides.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 transition-all text-left ${
                    selectedGuide === guide.id
                      ? "border-[#00ef9d] bg-[#f0fdf9]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0b3a2c]">
                    {guide.avatar_url ? (
                      <Image
                        src={guide.avatar_url}
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-black text-white">
                        {guide.full_name?.charAt(0) || "G"}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#0b3a2c]">{guide.full_name}</p>
                      {guide.is_verified && (
                        <Shield className="h-4 w-4 text-[#00ef9d] shrink-0" />
                      )}
                      {guide.guide_order && (
                        <span className="text-xs font-semibold text-gray-500">
                          #{guide.guide_order}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {guide.languages?.join(" · ") || "No languages"} •{" "}
                      {guide.specialties?.join(" · ") || "No specialties"}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      selectedGuide === guide.id
                        ? "border-[#00ef9d] bg-[#00ef9d]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedGuide === guide.id && (
                      <div className="h-3 w-3 rounded-full bg-white" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chauffeur Name */}
        <div>
          <label className="block text-sm font-semibold text-[#0b3a2c] mb-2">
            Chauffeur Name (Optional)
          </label>
          <input
            type="text"
            value={chauffeurName}
            onChange={(e) => setChauffeurName(e.target.value)}
            placeholder="Driver or chauffeur name"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:border-[#00ef9d] focus:outline-none"
          />
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#0b3a2c] mb-2">Initial Status</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setStatus("active")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                status === "active"
                  ? "border-[#00ef9d] bg-[#f0fdf9] text-[#0b3a2c] border-2"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              In Active Trip
            </button>
            <button
              onClick={() => setStatus("completed")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                status === "completed"
                  ? "border-[#00ef9d] bg-[#f0fdf9] text-[#0b3a2c] border-2"
                  : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t pt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedGuide || isPending}
            className="flex-1 rounded-full bg-[#0b3a2c] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#0b3a2c]/90 disabled:opacity-50"
          >
            {isPending ? "Assigning..." : "Assign Guide"}
          </button>
        </div>
      </div>
    </div>
  );
}
