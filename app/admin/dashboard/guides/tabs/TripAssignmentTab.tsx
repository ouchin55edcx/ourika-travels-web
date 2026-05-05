"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  X,
  Clock,
  Users,
  DollarSign,
  Plus,
  AlertCircle,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  assignGuideToTrip,
  completeGuideAssignment,
  cancelGuideAssignment,
} from "@/app/actions/guides";
import GuideSelectionModal from "../modals/GuideSelectionModal";

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

type Assignment = {
  id: string;
  trip_id: string;
  guide_id: string;
  status: string;
  chauffeur_name?: string;
  assigned_at: string;
  completed_at?: string;
};

type Absence = {
  id: string;
  guide_id: string;
  absent_from: string;
  absent_until: string;
  reason?: string;
};

export default function TripAssignmentTab({
  guides: initialGuides,
  bookings: initialBookings,
  assignments: initialAssignments,
  absences: initialAbsences,
}: {
  guides: Guide[];
  bookings: Booking[];
  assignments: Assignment[];
  absences: Absence[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Booking | null>(null);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleAssignGuide(tripId: string) {
    const trip = initialBookings.find((b) => b.id === tripId);
    if (trip) {
      setSelectedTrip(trip);
      setShowModal(true);
    }
  }

  function handleGuideSelected(guideId: string, chauffeurName?: string, status?: string) {
    if (!selectedTrip) return;

    startTransition(async () => {
      const result = await assignGuideToTrip({
        trip_id: selectedTrip.id,
        guide_id: guideId,
        status: (status as "active" | "completed" | "cancelled" | "no_show") || "active",
        chauffeur_name: chauffeurName,
      });

      if ("success" in result) {
        setAssignments((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            trip_id: selectedTrip.id,
            guide_id: guideId,
            status: status || "active",
            chauffeur_name: chauffeurName,
            assigned_at: new Date().toISOString(),
          },
        ]);
        showToast("Guide assigned to trip ✓");
        setShowModal(false);
        setSelectedTrip(null);
      } else if ("error" in result) {
        showToast(`Error: ${result.error}`);
      }
    });
  }

  function handleCompleteAssignment(assignmentId: string) {
    startTransition(async () => {
      const result = await completeGuideAssignment(assignmentId);
      if ("success" in result) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === assignmentId ? { ...a, status: "completed" } : a)),
        );
        showToast("Assignment marked as completed ✓");
      }
    });
  }

  function handleCancelAssignment(assignmentId: string) {
    startTransition(async () => {
      const result = await cancelGuideAssignment(assignmentId, "Cancelled by admin");
      if ("success" in result) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === assignmentId ? { ...a, status: "cancelled" } : a)),
        );
        showToast("Assignment cancelled ✓");
      }
    });
  }

  const unassignedBookings = initialBookings.filter(
    (b) => !assignments.some((a) => a.trip_id === b.id && a.status === "active"),
  );

  const getGuideForAssignment = (guideId: string) =>
    initialGuides.find((g) => g.id === guideId);

  const isGuideAbsent = (guideId: string) =>
    initialAbsences.some((a) => a.guide_id === guideId && new Date(a.absent_until) > new Date());

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Unassigned Trips</p>
          <p className="mt-1 text-2xl font-black text-amber-600">{unassignedBookings.length}</p>
          <p className="mt-1 text-xs text-gray-400">Waiting for guide assignment</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Active Assignments</p>
          <p className="mt-1 text-2xl font-black text-[#00ef9d]">
            {assignments.filter((a) => a.status === "active").length}
          </p>
          <p className="mt-1 text-xs text-gray-400">In progress</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Completed</p>
          <p className="mt-1 text-2xl font-black text-green-600">
            {assignments.filter((a) => a.status === "completed").length}
          </p>
          <p className="mt-1 text-xs text-gray-400">Finished trips</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl border border-[#d0ede0] bg-[#edf7f1] px-5 py-4 text-sm font-medium text-[#0b3a2c]">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>
            Assign guides to trips here. When assigned, guide moves to end of queue. When completed,
            guide returns to next position for next booking.
          </p>
        </div>
      </div>

      {/* Unassigned Trips Section */}
      <div>
        <h3 className="mb-4 font-bold text-[#0b3a2c]">Unassigned Trips</h3>
        <div className="grid gap-4">
          {unassignedBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
              <p className="mt-2 font-semibold text-gray-600">All trips assigned!</p>
            </div>
          ) : (
            unassignedBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-[#0b3a2c]">{booking.booking_ref}</p>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-700">
                      Unassigned
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{booking.tourist_name}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {booking.trek_date} at {booking.trek_time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {booking.adults} adults, {booking.children} children
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      {booking.total_price} DH
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAssignGuide(booking.id)}
                  disabled={isPending}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0b3a2c] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0b3a2c]/90 disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> Assign
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Assignments Section */}
      <div>
        <h3 className="mb-4 font-bold text-[#0b3a2c]">Active Assignments</h3>
        <div className="grid gap-4">
          {assignments.filter((a) => a.status === "active").length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 font-semibold text-gray-600">No active assignments</p>
            </div>
          ) : (
            assignments
              .filter((a) => a.status === "active")
              .map((assignment) => {
                const guide = getGuideForAssignment(assignment.guide_id);
                const booking = initialBookings.find((b) => b.id === assignment.trip_id);

                return (
                  <div
                    key={assignment.id}
                    className="rounded-2xl border border-[#00ef9d]/30 bg-[#f0fdf9] p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-[#0b3a2c]">{booking?.booking_ref}</p>
                          <span className="rounded-full bg-[#00ef9d]/20 px-2 py-0.5 text-[10px] font-black text-[#0b3a2c]">
                            Active
                          </span>
                        </div>

                        {/* Guide Info */}
                        {guide && (
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0b3a2c]">
                              {guide.avatar_url ? (
                                <Image
                                  src={guide.avatar_url}
                                  alt=""
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-black text-white">
                                  {guide.full_name?.charAt(0) || "G"}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0b3a2c]">{guide.full_name}</p>
                              {assignment.chauffeur_name && (
                                <p className="text-xs text-gray-500">
                                  Chauffeur: {assignment.chauffeur_name}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Trip Details */}
                        <div className="mt-3 grid gap-2 text-xs text-gray-600">
                          <p>
                            <strong>Trip:</strong> {booking?.tourist_name} •{" "}
                            {booking?.trek_date} at {booking?.trek_time}
                          </p>
                          <p>
                            <strong>Passengers:</strong> {booking?.adults} adults,{" "}
                            {booking?.children} children
                          </p>
                          <p>
                            <strong>Amount:</strong> {booking?.total_price} DH
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleCompleteAssignment(assignment.id)}
                          disabled={isPending}
                          className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-green-600 disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-4 w-4" /> Complete
                        </button>
                        <button
                          onClick={() => handleCancelAssignment(assignment.id)}
                          disabled={isPending}
                          className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-red-600 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Guide Selection Modal */}
      {showModal && selectedTrip && (
        <GuideSelectionModal
          trip={selectedTrip}
          guides={initialGuides}
          absences={initialAbsences}
          onSelect={handleGuideSelected}
          onClose={() => {
            setShowModal(false);
            setSelectedTrip(null);
          }}
          isPending={isPending}
        />
      )}

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
