"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
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

export default function ReservationHistoricPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const savedBookings = JSON.parse(
      localStorage.getItem("ourika_bookings") || "[]",
    );
    // Sort by most recent first
    setBookings(
      savedBookings.sort((a: Booking, b: Booking) => b.timestamp - a.timestamp),
    );
  }, []);

  const deleteBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem("ourika_bookings", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(140deg,_#f9f6ef_0%,_#f1f5f1_45%,_#eef2f7_100%)] font-sans text-[#0f1f18] selection:bg-[#34e0a1] selection:text-black">
      <Navbar sticky={false} />

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
        <div className="absolute left-1/2 top-0 h-[260px] w-[85%] -translate-x-1/2 rounded-[32px] bg-[radial-gradient(circle_at_top,_#fff8df_0%,_rgba(255,248,223,0)_70%)]" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#7d816f]">
                Reservations
              </p>
              <h1 className="text-[30px] font-black leading-tight text-[#111827] sm:text-[36px]">
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
                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a8f7f]">
                        <span className="rounded-full bg-[#f6f2e7] px-2.5 py-1 text-[#8a6a2a]">
                          Pay on start
                        </span>
                        <span className="text-[#c0c9c4]">#{booking.id}</span>
                      </div>
                      <h3 className="mt-2 text-lg font-black text-[#111827] truncate">
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

                  <div className="flex w-full items-center justify-between gap-3 border-t border-[#eef1e9] pt-4 md:w-auto md:border-t-0 md:pt-0">
                    <div className="text-xl font-black text-[#111827]">
                      {booking.totalPrice}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-full bg-[#0f3d2b] px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-[#0b2d20] active:scale-95"
                      >
                        View ticket
                      </button>
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="rounded-full p-2.5 text-[#c2c7bf] transition hover:bg-red-50 hover:text-red-500"
                        title="Remove from history"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-[#d6d7cc] bg-white/70 p-10 text-center">
              <p className="text-[20px] font-black text-[#1f2937]">
                Your booking history is empty
              </p>
              <p className="mt-2 text-sm text-[#6b7280]">
                Browse experiences and save the ones that match your travel
                mood.
              </p>
              <div className="mt-6">
                <Link
                  href="/experiences"
                  className="rounded-full bg-[#0f3d2b] px-6 py-3 text-[11px] font-black uppercase tracking-[0.3em] text-white transition hover:bg-[#0b2d20] active:scale-95"
                >
                  Explore experiences
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
