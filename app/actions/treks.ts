"use server";

import { createSupabaseServerClient, createSupabasePublicClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { uploadToCloudflare, deleteFromCloudflare } from '@/lib/cloudflare-images';

// ━━━ TYPES TO EXPORT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type GalleryImage = { src: string; alt: string };

export type ItineraryStep = {
    id: number;
    title: string;
    duration: string;
    shortLabel?: string;
    image?: string;
    description?: string;
    buttonLabel?: string;
    coordinates?: { lng: number; lat: number };
};

export type ReviewBreakdown = { label: string; count: number; percentage: string };

export type Trek = {
    id: string;
    title: string;
    slug: string;
    category_id: string | null;
    category_name?: string; // Virtual field for display
    cover_image: string;
    gallery_images: GalleryImage[];
    total_photo_count: number;
    price_per_adult: number;
    previous_price: number | null;
    price_note: string | null;
    rating: number;
    review_count: number;
    review_breakdown: ReviewBreakdown[];
    popular_mentions: string[];
    about: string;
    highlights: string[];
    meta_description: string | null;
    duration: string;
    time_of_day: 'Morning' | 'Afternoon' | 'Evening' | 'Flexible';
    max_group_size: number;
    min_age: number;
    max_age: number;
    start_time: string | null;
    mobile_ticket: boolean;
    avg_booking_lead_days: number | null;
    live_guide_languages: string[];
    audio_guide_languages: string[];
    written_guide_languages: string[];
    start_location: string;
    pickup_available: boolean;
    itinerary_steps: ItineraryStep[];
    map_image_url: string | null;
    free_cancellation_hours: number;
    reserve_now_pay_later: boolean;
    badge: string | null;
    award: string | null;
    included: string[];
    not_included: string[];
    services: string[];
    reviews?: any[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type TrekFormData = Omit<Trek, 'id' | 'slug' | 'created_at' | 'updated_at' | 'category_name'>;

// ━━━ PRIVATE HELPERS (not exported) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function uniqueSlug(supabase: any, base: string, excludeId?: string): Promise<string> {
    let slug = base;
    let counter = 1;
    while (true) {
        let q = supabase.from('treks').select('id').eq('slug', slug);
        if (excludeId) q = q.neq('id', excludeId);
        const { data } = await q.maybeSingle();
        if (!data) return slug;
        slug = `${base}-${++counter}`;
    }
}

// ━━━ SERVER ACTIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function getTreks(): Promise<Trek[]> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('treks')
        .select(`
      *,
      categories (
        name
      )
    `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching treks:', error);
        return [];
    }

    return (data || []).map((item: any) => ({
        ...item,
        category_name: item.categories?.name
    }));
}

export async function getTrekById(id: string): Promise<Trek | null> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('treks')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) return null;
    return data as Trek;
}

export async function getTrekBySlug(slug: string): Promise<Trek | null> {
    const supabase = await createSupabaseServerClient();
    const user = await getCurrentUser();

    let query = supabase
        .from('treks')
        .select('*, categories(name)')
        .eq('slug', slug);

    if (!user || user.role !== 'admin') {
        query = query.eq('is_active', true);
    }

    const { data, error } = await query.single();

    if (error || !data) return null;
    return data as Trek;
}

export async function getPublicTreks(): Promise<{ slug: string }[]> {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
        .from('treks')
        .select('slug')
        .eq('is_active', true);
    if (error) return [];
    return data || [];
}

export async function createTrek(data: TrekFormData): Promise<{ success: true; slug: string } | { error: string }> {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return { error: 'Forbidden' };

    const supabase = await createSupabaseServerClient();
    const slugBase = slugify(data.title);
    const slug = await uniqueSlug(supabase, slugBase);

    const { slug: _slug, cover_image_id, ...rest } = data as any;
    const { error } = await supabase.from('treks').insert({ ...rest, slug });

    if (error) return { error: error.message };

    revalidatePath('/admin/dashboard/treks');
    revalidatePath('/experiences');
    return { success: true, slug };
}

export async function updateTrek(id: string, data: Partial<TrekFormData>): Promise<{ success: true } | { error: string }> {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return { error: 'Forbidden' };

    const supabase = await createSupabaseServerClient();
    let slug;
    if (data.title) {
        slug = await uniqueSlug(supabase, slugify(data.title), id);
    }

    const { slug: _slug, id: _id, cover_image_id, ...rest } = data as any;
    const { error } = await supabase
        .from('treks')
        .update({ ...rest, ...(slug && { slug }) })
        .eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/admin/dashboard/treks');
    revalidatePath('/experiences');
    return { success: true };
}

export async function deleteTrek(id: string): Promise<{ success: true } | { error: string }> {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return { error: 'Forbidden' };

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('treks').delete().eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/admin/dashboard/treks');
    revalidatePath('/experiences');
    return { success: true };
}

export async function toggleTrekStatus(id: string, isActive: boolean): Promise<{ success: true; message: string } | { error: string }> {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return { error: 'Forbidden' };

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('treks').update({ is_active: isActive }).eq('id', id);

    if (error) return { error: error.message };

    revalidatePath('/admin/dashboard/treks');
    revalidatePath('/experiences');
    return { success: true, message: `Trek ${isActive ? 'published' : 'saved as draft'}` };
}

export async function uploadTrekImage(
    formData: FormData
): Promise<{ url: string; imageId: string } | { error: string }> {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return { error: 'Forbidden' };

    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string; // 'covers'|'gallery'|'itinerary'

    if (!file || file.size === 0) return { error: 'No file provided' };
    if (file.size > 10 * 1024 * 1024) return { error: 'File too large (max 10 MB)' };

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
        return { error: 'Invalid file type. Use JPG, PNG or WebP.' };
    }

    try {
        const result = await uploadToCloudflare(file, {
            folder,                         // stored as metadata tag
            uploadedBy: user.id,
            trek: 'pending',                // updated after trek is saved
        });
        return result;
    } catch (err: any) {
        console.error('[Cloudflare Images] upload error:', err);
        return { error: err.message || 'Upload failed. Please try again.' };
    }
}

export async function deleteTrekImage(
    imageId: string
): Promise<{ success: true } | { error: string }> {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return { error: 'Forbidden' };
    try {
        await deleteFromCloudflare(imageId);
        return { success: true };
    } catch (err: any) {
        return { error: err.message || 'Delete failed' };
    }
}
