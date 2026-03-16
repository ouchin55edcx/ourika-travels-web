'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  Search, Calendar, Clock, Users, Phone, Mail,
  CheckCircle2, XCircle, Loader2,
  DollarSign, Eye
} from 'lucide-react';
import {
  updateBookingStatus, markBookingPaid
} from '@/app/actions/bookings';

type Booking = any;

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'cancelled' | 'completed';
type PaymentFilter = 'all' | 'paid' | 'unpaid';

export default function BookingsManagement({
  initialBookings,
}: { initialBookings: Booking[] }) {
  const [bookings, setBookings]         = useState<Booking[]>(initialBookings);
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [payFilter, setPayFilter]       = useState<PaymentFilter>('all');
  const [selected, setSelected]         = useState<Booking | null>(null);
  const [toast, setToast]               = useState<{type:'success'|'error';text:string}|null>(null);
  const [isPending, startTransition]    = useTransition();

  function showToast(type: 'success'|'error', text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.tourist_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.tourist_email?.toLowerCase().includes(search.toLowerCase()) ||
      b.booking_ref?.toLowerCase().includes(search.toLowerCase()) ||
      b.treks?.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = statusFilter === 'all' || b.status === statusFilter;
    const matchPayment = payFilter === 'all' || b.payment_status === payFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  function handleStatusChange(bookingId: string, newStatus: string) {
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, newStatus as any);
      if ('success' in result) {
        setBookings(prev => prev.map(b =>
          b.id === bookingId ? { ...b, status: newStatus } : b
        ));
        if (selected?.id === bookingId) {
          setSelected((prev: Booking | null) => prev ? { ...prev, status: newStatus } : null);
        }
        showToast('success', `Booking ${newStatus}`);
      } else {
        showToast('error', result.error);
      }
    });
  }

  function handleMarkPaid(bookingId: string) {
    startTransition(async () => {
      const result = await markBookingPaid(bookingId);
      if ('success' in result) {
        setBookings(prev => prev.map(b =>
          b.id === bookingId
            ? { ...b, payment_status: 'paid', status: 'confirmed' }
            : b
        ));
        if (selected?.id === bookingId) {
          setSelected((prev: Booking | null) => prev
            ? { ...prev, payment_status: 'paid', status: 'confirmed' }
            : null
          );
        }
        showToast('success', 'Payment confirmed ✓');
      } else {
        showToast('error', result.error);
      }
    });
  }

  // ── STATUS BADGE helper ────────────────────────────────────────
  function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
      pending:   'bg-amber-100 text-amber-700',
      confirmed: 'bg-emerald-100 text-emerald-700',
      cancelled: 'bg-red-100 text-red-600',
      completed: 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`rounded-full px-3 py-1 text-[11px] font-black
        uppercase tracking-wide ${styles[status] ?? 'bg-gray-100 text-gray-500'}`}>
        {status}
      </span>
    );
  }

  function PayBadge({ status }: { status: string }) {
    return (
      <span className={`rounded-full px-3 py-1 text-[11px] font-black
        uppercase tracking-wide
        ${status === 'paid'
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-gray-100 text-gray-500'}`}>
        {status}
      </span>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── FILTERS ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2
            h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, ref or trek..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-100 bg-white
              py-3 pl-11 pr-4 text-sm shadow-sm focus:outline-none
              focus:ring-2 focus:ring-[#0b3a2c]/10"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as StatusFilter)}
          className="rounded-2xl border border-gray-100 bg-white px-4 py-3
            text-sm font-semibold shadow-sm focus:outline-none
            focus:ring-2 focus:ring-[#0b3a2c]/10 cursor-pointer">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment filter */}
        <select
          value={payFilter}
          onChange={e => setPayFilter(e.target.value as PaymentFilter)}
          className="rounded-2xl border border-gray-100 bg-white px-4 py-3
            text-sm font-semibold shadow-sm focus:outline-none
            focus:ring-2 focus:ring-[#0b3a2c]/10 cursor-pointer">
          <option value="all">All payments</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>

        <span className="text-sm font-medium text-gray-400">
          {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── TABLE ─────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-[2rem] border border-black/5
        bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="text-5xl mb-4">📋</span>
            <p className="text-xl font-black text-gray-300">
              No bookings found
            </p>
            {(search || statusFilter !== 'all' || payFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setStatusFilter('all'); setPayFilter('all'); }}
                className="mt-4 text-sm font-bold text-[#0b3a2c] hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['Trek', 'Tourist', 'Date & Time', 'Guests', 'Total',
                  'Status', 'Payment', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[11px]
                    font-black uppercase tracking-widest text-gray-400">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(booking => (
                <tr key={booking.id}
                  className="group hover:bg-[#f7fdf9] transition-colors">

                  {/* Trek */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {booking.treks?.cover_image && (
                        <div className="relative h-10 w-14 rounded-xl
                          overflow-hidden shrink-0">
                          <Image
                            src={booking.treks.cover_image}
                            alt="" fill className="object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-bold text-[#0b3a2c]
                          max-w-[160px] line-clamp-2">
                          {booking.treks?.title ?? '—'}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {booking.booking_type === 'private'
                            ? '🔒 Private'
                            : '👥 Group'}
                          &nbsp;·&nbsp;
                          <span className="font-mono">{booking.booking_ref}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Tourist */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {booking.tourist_name}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {booking.tourist_email}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {booking.tourist_phone}
                    </p>
                  </td>

                  {/* Date & Time */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(booking.trek_date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {booking.trek_time}
                    </p>
                  </td>

                  {/* Guests */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">
                      {booking.adults} adult{booking.adults > 1 ? 's' : ''}
                      {booking.children > 0
                        ? ` + ${booking.children} child${booking.children > 1 ? 'ren' : ''}`
                        : ''}
                    </p>
                  </td>

                  {/* Total */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-black text-[#0b3a2c]">
                      ${booking.total_price?.toFixed(2)}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>

                  {/* Payment */}
                  <td className="px-5 py-4">
                    <PayBadge status={booking.payment_status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2
                      opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setSelected(booking)}
                        className="flex items-center gap-1.5 rounded-full
                          border border-gray-200 bg-white px-3 py-1.5
                          text-[11px] font-bold text-gray-600
                          hover:border-[#0b3a2c] hover:text-[#0b3a2c]
                          transition-all">
                        <Eye className="h-3 w-3" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── DETAIL PANEL (right drawer) ──────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-[300] flex">
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="w-full max-w-md bg-white h-full overflow-y-auto
            shadow-2xl flex flex-col animate-in slide-in-from-right
            duration-300">

            {/* Panel header */}
            <div className="flex items-center justify-between border-b
              border-gray-100 px-6 py-5 sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs font-black uppercase tracking-widest
                  text-gray-400">
                  Booking detail
                </p>
                <h2 className="text-lg font-black text-[#0b3a2c]">
                  {selected.booking_ref}
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full p-2 hover:bg-gray-100">
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 px-6 py-6 space-y-6">

              {/* Trek info */}
              {selected.treks && (
                <div className="flex items-center gap-4">
                  {selected.treks.cover_image && (
                    <div className="relative h-16 w-24 rounded-2xl
                      overflow-hidden shrink-0">
                      <Image src={selected.treks.cover_image}
                        alt="" fill className="object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="font-black text-[#0b3a2c] text-sm
                      leading-snug">
                      {selected.treks.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {selected.treks.duration}
                      &nbsp;·&nbsp;
                      {selected.booking_type === 'private'
                        ? '🔒 Private tour'
                        : '👥 Group tour'}
                    </p>
                  </div>
                </div>
              )}

              {/* Status row */}
              <div className="flex items-center gap-3">
                <StatusBadge status={selected.status} />
                <PayBadge status={selected.payment_status} />
                {selected.payment_status === 'unpaid' && (
                  <span className="text-xs text-amber-600 font-semibold">
                    Pay at bureau
                  </span>
                )}
              </div>

              {/* Trip details */}
              <div className="space-y-3 rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-black uppercase tracking-widest
                  text-gray-400 mb-3">
                  Trip details
                </p>
                {[
                  { icon: Calendar, label: 'Date',
                    value: new Date(selected.trek_date).toLocaleDateString('en-US',
                      {weekday:'long',month:'long',day:'numeric',year:'numeric'}) },
                  { icon: Clock,    label: 'Time',    value: selected.trek_time },
                  { icon: Users,    label: 'Guests',
                    value: `${selected.adults} adult${selected.adults>1?'s':''}${
                      selected.children > 0
                        ? ` + ${selected.children} child${selected.children>1?'ren':''}`
                        : ''}` },
                ].map(row => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label}
                      className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-[#0b3a2c] shrink-0" />
                      <span className="text-xs text-gray-500 w-12 shrink-0">
                        {row.label}
                      </span>
                      <span className="text-sm font-semibold text-gray-800">
                        {row.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Tourist info */}
              <div className="space-y-3 rounded-2xl bg-gray-50 p-5">
                <p className="text-xs font-black uppercase tracking-widest
                  text-gray-400 mb-3">
                  Tourist
                </p>
                <p className="font-bold text-gray-800">{selected.tourist_name}</p>
                <a href={`mailto:${selected.tourist_email}`}
                  className="flex items-center gap-2 text-sm text-blue-600
                    hover:underline">
                  <Mail className="h-3.5 w-3.5" />
                  {selected.tourist_email}
                </a>
                <a href={`tel:${selected.tourist_phone}`}
                  className="flex items-center gap-2 text-sm text-blue-600
                    hover:underline">
                  <Phone className="h-3.5 w-3.5" />
                  {selected.tourist_phone}
                </a>
              </div>

              {/* Pricing */}
              <div className="rounded-2xl bg-gray-50 p-5 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest
                  text-gray-400 mb-3">
                  Pricing
                </p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {selected.adults} adult{selected.adults>1?'s':''}
                    × ${selected.price_per_adult?.toFixed(2)}
                  </span>
                  <span>${(selected.adults * selected.price_per_adult).toFixed(2)}</span>
                </div>
                {selected.children > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {selected.children} child{selected.children>1?'ren':''}
                      × ${selected.price_per_child?.toFixed(2)}
                    </span>
                    <span>
                      ${(selected.children * selected.price_per_child).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-black text-[#0b3a2c]
                  border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span>${selected.total_price?.toFixed(2)}</span>
                </div>
              </div>

              {/* Special requests */}
              {selected.special_requests && (
                <div className="rounded-2xl bg-amber-50 border
                  border-amber-100 p-4">
                  <p className="text-xs font-black uppercase tracking-widest
                    text-amber-600 mb-2">
                    Special requests
                  </p>
                  <p className="text-sm text-gray-700">
                    {selected.special_requests}
                  </p>
                </div>
              )}

              {/* Booked on */}
              <p className="text-xs text-gray-400 text-center">
                Booked on {new Date(selected.created_at).toLocaleDateString('en-US',
                  {month:'long',day:'numeric',year:'numeric',
                   hour:'2-digit',minute:'2-digit'})}
              </p>
            </div>

            {/* Panel footer — actions */}
            <div className="border-t border-gray-100 px-6 py-5 space-y-3
              sticky bottom-0 bg-white">

              {/* Mark as paid */}
              {selected.payment_status === 'unpaid' &&
               selected.status !== 'cancelled' && (
                <button
                  onClick={() => handleMarkPaid(selected.id)}
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2
                    rounded-full bg-[#0b3a2c] py-3.5 text-sm font-black
                    text-[#00ef9d] hover:bg-[#0d4a38] transition-all
                    disabled:opacity-60 active:scale-95">
                  {isPending
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <CheckCircle2 className="h-4 w-4" />}
                  Mark as paid & confirm
                </button>
              )}

              {/* Status actions */}
              <div className="grid grid-cols-2 gap-2">
                {selected.status !== 'confirmed' &&
                 selected.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange(selected.id, 'confirmed')}
                    disabled={isPending}
                    className="rounded-full border-2 border-emerald-200
                      bg-emerald-50 py-2.5 text-xs font-black text-emerald-700
                      hover:bg-emerald-100 transition-all disabled:opacity-50">
                    ✓ Confirm
                  </button>
                )}
                {selected.status !== 'completed' &&
                 selected.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange(selected.id, 'completed')}
                    disabled={isPending}
                    className="rounded-full border-2 border-blue-200
                      bg-blue-50 py-2.5 text-xs font-black text-blue-700
                      hover:bg-blue-100 transition-all disabled:opacity-50">
                    ✓ Complete
                  </button>
                )}
                {selected.status !== 'cancelled' && (
                  <button
                    onClick={() => handleStatusChange(selected.id, 'cancelled')}
                    disabled={isPending}
                    className="rounded-full border-2 border-red-200
                      bg-red-50 py-2.5 text-xs font-black text-red-500
                      hover:bg-red-100 transition-all disabled:opacity-50
                      col-span-2">
                    Cancel booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[400] flex items-center
          gap-3 px-5 py-3 rounded-2xl shadow-2xl font-semibold text-sm
          animate-in slide-in-from-bottom-4 duration-300
          ${toast.type === 'success'
            ? 'bg-[#0b3a2c] text-white'
            : 'bg-red-600 text-white'}`}>
          {toast.type === 'success'
            ? <CheckCircle2 className="h-4 w-4" />
            : <XCircle className="h-4 w-4" />}
          {toast.text}
        </div>
      )}
    </div>
  );
}
