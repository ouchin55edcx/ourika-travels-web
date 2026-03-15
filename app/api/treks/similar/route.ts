import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const exclude = req.nextUrl.searchParams.get('exclude') ?? '';
    const limit = Number(req.nextUrl.searchParams.get('limit') ?? 4);
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
        .from('treks')
        .select('id, title, slug, cover_image, rating, review_count, price_per_adult, previous_price, badge, duration, categories(name)')
        .eq('is_active', true)
        .neq('id', exclude)
        .order('rating', { ascending: false })
        .limit(limit);
    return NextResponse.json(data ?? []);
}
