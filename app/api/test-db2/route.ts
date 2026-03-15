import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabasePublicClient } from '@/lib/supabase/server';
import { getTrekBySlug } from '@/app/actions/treks';

export async function GET(req: NextRequest) {
    const slug = "marrakech-ourika-valley-atlas-mountains-setti-fatma-waterfalls";
    const trek = await getTrekBySlug(slug);
    return NextResponse.json({
        highlights: trek?.highlights,
        included: trek?.included,
        not_included: trek?.not_included,
        services: trek?.services
    });
}
