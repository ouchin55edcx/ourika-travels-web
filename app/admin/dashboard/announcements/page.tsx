import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AnnouncementsManagement from './AnnouncementsManagement';

export const metadata = { title: 'Announcements | Admin' };

export default async function AnnouncementsPage() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') redirect('/auth/login');

  const supabase = await createSupabaseServerClient();
  const { data: announcements } = await supabase
    .from('announcements')
    .select('*, users(full_name)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider
          text-[#0b3a2c]/60">
          Communication
        </p>
        <h1 className="text-4xl font-black tracking-tight text-[#0b3a2c]">
          Announcements
        </h1>
        <p className="mt-1 text-base font-medium text-gray-500">
          Post messages to all guides. They appear in the guide mobile app.
        </p>
      </div>
      <AnnouncementsManagement
        initialAnnouncements={announcements ?? []}
        adminId={admin.id}
      />
    </div>
  );
}
