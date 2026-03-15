import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const exclude = req.nextUrl.searchParams.get('exclude') ?? '';
  const limit   = Math.min(Number(req.nextUrl.searchParams.get('limit') ?? 8), 20);

  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from('treks')
    .select(`
      id, title, slug, cover_image,
      rating, review_count,
      price_per_adult, previous_price,
      badge, award, duration,
      categories(name)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  // Only exclude if we received a valid UUID (36 chars)
  if (exclude.length === 36) {
    query = query.neq('id', exclude);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[/api/treks/similar]', error.message);
    return NextResponse.json([], { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
