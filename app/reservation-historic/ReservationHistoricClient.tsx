"use client";

import { useEffect, useState } from "react";
import {
  Ticket,
  Calendar,
  Clock,
  Users,
  ChevronRight,
  History,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import BookingTicket from "../reservation/components/BookingTicket";

interface Booking {
  id: string;
  activityTitle: string;
  date: string;
  time: string;
  guests: string;
  totalPrice: string;
  customerName: string;
  status: string;
  timestamp: number;
}

export default function ReservationHistoricClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem("ourika_bookings") || "[]");
    // Sort by most recent first
    setBookings(savedBookings.sort((a: Booking, b: Booking) => b.timestamp - a.timestamp));
  }, []);

  const deleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("ourika_bookings", JSON.stringify(updated));
  };

  return (
    <>
      {selectedBooking && (
        <BookingTicket
          bookingId={selectedBooking.id}
          activityTitle={selectedBooking.activityTitle}
          date={selectedBooking.date}
          time={selectedBooking.time}
          guests={selectedBooking.guests}
          totalPrice={selectedBooking.totalPrice}
          customerName={selectedBooking.customerName}
          onClose={() => setSelectedBooking(null)}
        />
      )}

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
        <div className="absolute top-0 left-1/2 h-[260px] w-[85%] -translate-x-1/2 rounded-[32px] bg-[radial-gradient(circle_at_top,_#fff8df_0%,_rgba(255,248,223,0)_70%)]" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-[13px] font-semibold tracking-[0.2em] text-[#7d816f] uppercase">
                Reservations
              </p>
              <h1 className="text-[30px] leading-tight font-black text-[#111827] sm:text-[36px]">
                Booking history
              </h1>
              <p className="text-sm font-medium text-[#6b7280]">
                {bookings.length} experiences saved in your account
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-5">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-[24px] border border-[#e4e8df] bg-white/80 p-5 shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition hover:shadow-[0_12px_28px_rgba(15,23,42,0.08)] md:p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4f6f0] text-[#1d4735]">
                      <Ticket className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#8a8f7f] uppercase">
                        <span className="rounded-full bg-[#f6f2e7] px-2.5 py-1 text-[#8a6a2a]">
                          Pay on start
                        </span>
                        <span className="text-[#c0c9c4]">#{booking.id}</span>
                      </div>
                      <h3 className="mt-2 truncate text-lg font-black text-[#111827]">
                        {booking.activityTitle}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-[#6b7280]">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-[#00aa6c]" />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-[#00aa6c]" />
                          {booking.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#00aa6c]" />
                          {booking.guests}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#004f32] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#003d27]"
                    >
                      View ticket
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-[#e4e8df] px-4 py-2 text-sm font-bold text-[#b45309] transition hover:bg-[#fff7ed]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-[32px] border border-dashed border-[#d2d6c8] bg-white/80 px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4f6f0] text-[#1d4735]">
                <History className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-black text-[#111827]">No bookings yet</h2>
                <p className="text-sm font-medium text-[#6b7280]">
                  Your booking history will appear here once you reserve an experience.
                </p>
              </div>
              <Link
                href="/experiences"
                className="inline-flex items-center gap-2 rounded-full bg-[#004f32] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#003d27]"
              >
                Explore experiences
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
