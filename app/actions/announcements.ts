'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createAnnouncement(title: string, body: string) {
  const supabase = await createSupabaseServerClient();
  const admin    = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  const { data: ann, error } = await supabase
    .from('announcements')
    .insert({ title, body, created_by: admin.id })
    .select()
    .single();

  if (error) return { error: error.message };

  // Send notification to ALL active guides
  const { data: guides } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'guide')
    .eq('is_active', true);

  if (guides && guides.length > 0) {
    await supabase.from('notifications').insert(
      guides.map(g => ({
        user_id: g.id,
        type:    'announcement',
        title:   `📢 ${title}`,
        body,
        data:    { announcement_id: ann.id },
      }))
    );
  }

  revalidatePath('/admin/dashboard/announcements');
  return { announcement: ann };
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createSupabaseServerClient();
  const admin    = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  await supabase.from('announcements').delete().eq('id', id);
  revalidatePath('/admin/dashboard/announcements');
  return { success: true };
}

export async function sendNotificationToAllGuides(
  title: string, body: string
) {
  const supabase = await createSupabaseServerClient();
  const admin    = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  const { data: guides } = await supabase
    .from('users').select('id')
    .eq('role', 'guide').eq('is_active', true);

  if (!guides || guides.length === 0) return { error: 'No active guides' };

  await supabase.from('notifications').insert(
    guides.map(g => ({
      user_id: g.id, type: 'announcement', title, body, data: {},
    }))
  );
  return { success: true };
}
