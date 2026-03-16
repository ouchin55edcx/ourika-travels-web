import { getAllBookings } from '@/app/actions/bookings';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import BookingsManagement from './BookingsManagement';
import type { Metadata } from 'next';
import QRCode from 'qrcode';

export const metadata: Metadata = { title: 'Bookings | Admin Dashboard' };

export default async function AdminBookingPage() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') redirect('/auth/login');

  const bookings = await getAllBookings();

  const qrUrl =
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/quick-book`;
  const qrDataUrl = await QRCode.toDataURL(qrUrl, {
    width: 200,
    margin: 2,
    color: { dark: '#0b3a2c', light: '#ffffff' },
  });

  const pending   = bookings.filter(b => b.status === 'pending').length;
  const unpaid    = bookings.filter(b => b.payment_status === 'unpaid'
                      && b.status !== 'cancelled').length;
  const today     = bookings.filter(b =>
                      b.trek_date === new Date().toISOString().split('T')[0]).length;
  const revenue   = bookings
                      .filter(b => b.payment_status === 'paid')
                      .reduce((sum, b) => sum + (b.total_price ?? 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider
          text-[#0b3a2c]/60">
          Bookings
        </p>
        <h1 className="text-4xl font-black tracking-tight text-[#0b3a2c]">
          Manage reservations
        </h1>
        <p className="mt-1 text-base font-medium text-gray-500">
          Confirm payments, adjust schedules, and keep travelers informed.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Total bookings',  value: bookings.length, color: 'text-[#0b3a2c]',  bg: 'bg-[#f0faf5]' },
          { label: 'Pending',         value: pending,         color: 'text-amber-700',  bg: 'bg-amber-50'  },
          { label: 'Awaiting payment',value: unpaid,          color: 'text-red-700',    bg: 'bg-red-50'    },
          { label: 'Revenue (paid)',  value: `$${revenue.toFixed(0)}`, color: 'text-emerald-700', bg: 'bg-emerald-50' },
        ].map(stat => (
          <div key={stat.label}
            className={`rounded-3xl ${stat.bg} p-6 flex flex-col gap-1`}>
            <p className="text-xs font-bold uppercase tracking-widest
              text-gray-500">
              {stat.label}
            </p>
            <p className={`text-3xl font-black ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Walk-in QR */}
      <div className="rounded-3xl border border-[#d0ede0] bg-[#f0faf5] p-6 flex items-center gap-6">
        <img
          src={qrDataUrl}
          alt="Walk-in QR code"
          className="h-24 w-24 rounded-xl shadow-sm shrink-0"
        />
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">
            Walk-in fast booking
          </p>
          <p className="font-black text-[#0b3a2c] text-lg">Bureau QR Code</p>
          <p className="text-sm text-gray-500 mt-1">
            Print this and place it at the bureau. Tourists scan → book in 60
            seconds → guide auto-assigned immediately.
          </p>
          <a
            href="/quick-book"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-bold text-[#0b3a2c] hover:underline"
          >
            {qrUrl} ↗
          </a>
        </div>
      </div>

      <BookingsManagement initialBookings={bookings} />
    </div>
  );
}
