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

                  {booking.guide && (
                    <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#f0faf5] border border-emerald-100 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full overflow-hidden bg-[#0b3a2c] flex items-center justify-center text-white font-black text-sm shrink-0`}
                        >
                          {booking.guide.avatar_url ? (
                            <img
                              src={booking.guide.avatar_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            booking.guide.full_name?.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-[#0b3a2c]">
                            Your guide
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            {booking.guide.full_name}
                          </p>
                        </div>
                      </div>
                      {booking.guide.phone && (
                        <a
                          href={`https://wa.me/${booking.guide.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hi! I have booking ${booking.booking_ref} for "${booking.treks?.title}". Looking forward to meeting you!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-black text-white hover:bg-[#20bd5a] transition-all"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          WhatsApp guide
                        </a>
                      )}
                    </div>
                  )}

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
