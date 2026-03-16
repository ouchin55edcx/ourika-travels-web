'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';

export async function toggleWishlist(
  trekId: string
): Promise<{ added: boolean } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: 'Please sign in to save experiences' };

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('trek_id', trekId)
    .maybeSingle();

  if (existing) {
    await supabase.from('wishlist').delete().eq('id', existing.id);
    revalidatePath('/wishlist');
    return { added: false };
  } else {
    await supabase.from('wishlist').insert({ user_id: user.id, trek_id: trekId });
    revalidatePath('/wishlist');
    return { added: true };
  }
}

export async function getWishlist(): Promise<any[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('wishlist')
    .select(`
      id,
      trek_id,
      created_at,
      treks(
        id, title, slug, cover_image,
        price_per_adult, previous_price,
        rating, review_count, duration,
        badge, categories(name)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function isWishlisted(trekId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('trek_id', trekId)
    .maybeSingle();

  return !!data;
}
