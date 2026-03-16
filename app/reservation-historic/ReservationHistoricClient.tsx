'use client';

import { useEffect, useState } from 'react';
import { getTouristBookings } from '@/app/actions/bookings';
import Link from 'next/link';
import Image from 'next/image';
import BookingTicket from '../reservation/components/BookingTicket';
import {
  Calendar,
  Clock,
  Users,
  Ticket,
  ChevronRight,
  History,
  AlertCircle,
} from 'lucide-react';

export default function ReservationHistoricClient() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    getTouristBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-3xl bg-gray-100" />
        ))}
      </div>
    );

  return (
    <>
      {selected && (
        <BookingTicket
          bookingId={selected.booking_ref}
          activityTitle={selected.treks?.title ?? selected.booking_ref}
          date={new Date(selected.trek_date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          time={selected.trek_time}
          guests={`${selected.adults} adult${selected.adults > 1 ? 's' : ''}${selected.children > 0 ? ` + ${selected.children} children` : ''}`}
          totalPrice={`$${Number(selected.total_price).toFixed(2)}`}
          customerName={selected.tourist_name}
          onClose={() => setSelected(null)}
        />
      )}

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Reservations
          </p>
          <h1 className="mt-1 text-3xl font-black text-[#0b3a2c]">Booking history</h1>
          <p className="mt-1 text-sm text-gray-500">
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 p-16 text-center">
            <History className="mx-auto mb-4 h-12 w-12 text-gray-200" />
            <p className="text-xl font-black text-gray-300">No bookings yet</p>
            <Link
              href="/experiences"
              className="mt-6 inline-block rounded-full bg-[#0b3a2c] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#0d4a38]"
            >
              Browse experiences
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="group flex items-start gap-5 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
              >
                {booking.treks?.cover_image && (
                  <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-2xl sm:block">
                    <Image
                      src={booking.treks.cover_image}
                      alt={booking.treks.title || ''}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 text-base font-black text-[#0b3a2c]">
                      {booking.treks?.title ?? 'Trek'}
                    </h3>
                    <div className="flex shrink-0 gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-700'
                            : booking.status === 'cancelled'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide ${
                          booking.payment_status === 'paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {booking.payment_status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[#0b3a2c]" />
                      {new Date(booking.trek_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#0b3a2c]" />
                      {booking.trek_time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[#0b3a2c]" />
                      {booking.adults} adult{booking.adults > 1 ? 's' : ''}
                      {booking.children > 0 ? ` + ${booking.children} children` : ''}
                    </span>
                    <span className="font-black text-[#0b3a2c]">
                      ${Number(booking.total_price).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="font-mono text-xs text-gray-400">
                      Ref: {booking.booking_ref}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelected(booking)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#0b3a2c] hover:underline"
                    >
                      <Ticket className="h-3.5 w-3.5" />
                      View ticket
                    </button>

                    {booking.payment_status === 'unpaid' && booking.status !== 'cancelled' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Pay at Setti Fatma bureau before start
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
