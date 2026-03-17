'use server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateGuideOrder(
  guides: { id: string; guide_order: number }[]
) {
  const supabase = await createSupabaseServerClient();
  const admin    = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  // Update each guide's order
  for (const g of guides) {
    await supabase.from('users')
      .update({ guide_order: g.guide_order })
      .eq('id', g.id);
  }
  revalidatePath('/admin/dashboard/guides');
  return { success: true };
}

export async function toggleGuideActive(
  guideId: string,
  active: boolean
) {
  const supabase = await createSupabaseServerClient();
  const admin    = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  await supabase.from('users')
    .update({ guide_active: active })
    .eq('id', guideId);
  revalidatePath('/admin/dashboard/guides');
  return { success: true };
}
