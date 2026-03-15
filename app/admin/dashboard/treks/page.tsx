import { getTreks } from '@/app/actions/treks';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import TreksList from './TreksList';
import Link from 'next/link';
import { Compass, Plus } from 'lucide-react';
import { Suspense } from 'react';

export const metadata = { title: 'Treks | Admin Dashboard' };

export default async function AdminTreksPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/auth/login');

  const treks = await getTreks();
  const publishedCount = treks.filter(t => t.is_active).length;

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ef9d]/10 text-[#00ef9d]">
              <Compass className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#0b3a2c]/60">Treks</p>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[#0b3a2c]">Manage treks</h1>
          <p className="text-lg font-medium text-gray-400">
            {treks.length} total · <span className="text-[#004f32]">{publishedCount} published</span> · <span className="text-gray-400">{treks.length - publishedCount} drafts</span>
          </p>
        </div>

        <Link
          href="/admin/dashboard/treks/new"
          className="group flex items-center gap-3 rounded-full bg-[#0b3a2c] px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add new trek
        </Link>
      </div>

      <Suspense fallback={
        <div className="flex h-64 items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-white">
          <div className="flex flex-col items-center gap-3 text-gray-300">
            <Compass className="h-10 w-10 animate-spin" />
            <p className="text-sm font-black uppercase tracking-widest">Loading treks...</p>
          </div>
        </div>
      }>
        <TreksList initialTreks={treks} />
      </Suspense>
    </div>
  );
}
