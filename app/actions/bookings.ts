'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export type BookingFormData = {
  trek_id: string;
  booking_type: 'group' | 'private';
  tourist_name: string;
  tourist_email: string;
  tourist_phone: string;
  trek_date: string;
  trek_time: string;
  adults: number;
  children: number;
  special_requests?: string;
};

export async function createBooking(
  data: BookingFormData
): Promise<{ success: true; booking_ref: string; booking_id: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();

  const { data: trek } = await supabase
    .from('treks')
    .select('id, title, price_per_adult, is_active')
    .eq('id', data.trek_id)
    .single();

  if (!trek || !trek.is_active) return { error: 'Trek not found or unavailable' };

  const priceMultiplier = data.booking_type === 'private' ? 1.5 : 1;
  const pricePerAdult = trek.price_per_adult * priceMultiplier;
  const pricePerChild = pricePerAdult * 0.5;
  const totalPrice = data.adults * pricePerAdult + data.children * pricePerChild;

  const { data: refData } = await supabase.rpc('generate_booking_ref');
  const booking_ref = refData ?? 'OT-' + Date.now().toString(36).toUpperCase();

  const { data: { user } } = await supabase.auth.getUser();
  const tourist_id = user?.id ?? null;

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      booking_ref,
      trek_id: data.trek_id,
      tourist_id,
      booking_type: data.booking_type,
      status: 'pending',
      payment_status: 'unpaid',
      tourist_name: data.tourist_name,
      tourist_email: data.tourist_email,
      tourist_phone: data.tourist_phone,
      trek_date: data.trek_date,
      trek_time: data.trek_time,
      adults: data.adults,
      children: data.children,
      price_per_adult: pricePerAdult,
      price_per_child: pricePerChild,
      total_price: totalPrice,
      special_requests: data.special_requests ?? null,
    })
    .select('id, booking_ref')
    .single();

  if (error) return { error: error.message };

  if (!tourist_id) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.tourist_email)
      .maybeSingle();

    if (!existingUser && typeof supabase.auth?.admin?.createUser === 'function') {
      try {
        const tempPassword = Math.random().toString(36).slice(-10) + 'Aa1!';
        await supabase.auth.admin.createUser({
          email: data.tourist_email,
          password: tempPassword,
          user_metadata: {
            full_name: data.tourist_name,
            role: 'tourist',
            phone: data.tourist_phone,
          },
          email_confirm: false,
        });
      } catch {
        // Service role may not be configured; booking still succeeded
      }
    }
  }

  revalidatePath('/reservation-historic');
  return { success: true, booking_ref: booking.booking_ref, booking_id: booking.id };
}

export async function getTouristBookings(): Promise<any[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('bookings')
    .select(`
      *,
      treks(title, slug, cover_image, duration, start_location),
      guide:guide_id(full_name, phone, avatar_url, bio, specialties)
    `)
    .eq('tourist_id', user.id)
    .order('created_at', { ascending: false });

  return data ?? [];
}

export async function getBookingByRef(ref: string): Promise<any | null> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('bookings')
    .select('*, treks(title, slug, cover_image, duration, start_location)')
    .eq('booking_ref', ref)
    .single();
  return data ?? null;
}

// ── Get ALL bookings for admin ────────────────────────────────────
export async function getAllBookings(): Promise<any[]> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return [];

  const { data } = await supabase
    .from('bookings')
    .select(`
      *,
      treks(id, title, slug, cover_image, duration, start_location)
    `)
    .order('created_at', { ascending: false });

  return data ?? [];
}

// ── Update booking status ─────────────────────────────────────────
export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<{ success: true } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) return { error: error.message };
  revalidatePath('/admin/dashboard/booking');
  return { success: true };
}

// ── Mark payment as paid ──────────────────────────────────────────
export async function markBookingPaid(
  bookingId: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  const { error } = await supabase
    .from('bookings')
    .update({ payment_status: 'paid', status: 'confirmed' })
    .eq('id', bookingId);

  if (error) return { error: error.message };
  revalidatePath('/admin/dashboard/booking');
  return { success: true };
}

// ── Assign guide manually ─────────────────────────────────────────
export async function assignGuide(
  bookingId: string,
  guideId: string
): Promise<{ success: true } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  const { error } = await supabase
    .from('bookings')
    .update({
      guide_id: guideId,
      guide_assigned_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (error) return { error: error.message };
  revalidatePath('/admin/dashboard/booking');
  return { success: true };
}

// ── Auto-assign next guide in round-robin ─────────────────────────
export async function autoAssignGuide(
  bookingId: string
): Promise<{ success: true; guideName: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  const { data: guideId } = await supabase.rpc('get_next_guide');
  if (!guideId) return { error: 'No active guides available' };

  const { data: guide } = await supabase
    .from('users')
    .select('id, full_name')
    .eq('id', guideId)
    .single();

  if (!guide) return { error: 'Guide not found' };

  const { error } = await supabase
    .from('bookings')
    .update({
      guide_id: guideId,
      guide_assigned_at: new Date().toISOString(),
    })
    .eq('id', bookingId);

  if (error) return { error: error.message };
  revalidatePath('/admin/dashboard/booking');
  return { success: true, guideName: guide.full_name };
}

// ── Get guide's assigned bookings ─────────────────────────────────
export async function getGuideBookings(): Promise<any[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('bookings')
    .select(`
      *,
      treks(id, title, slug, cover_image, duration, start_location)
    `)
    .eq('guide_id', user.id)
    .neq('status', 'cancelled')
    .order('trek_date', { ascending: true });

  return data ?? [];
}

// ── Get active guides for admin dropdown ──────────────────────────
export async function getActiveGuides(): Promise<any[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('users')
    .select('id, full_name, phone, avatar_url, guide_order, specialties')
    .eq('role', 'guide')
    .eq('is_active', true)
    .order('guide_order', { ascending: true });
  return data ?? [];
}

// ── Fast walk-in booking ──────────────────────────────────────────
export async function createWalkinBooking(
  data: {
    tourist_name: string;
    tourist_email?: string;
    tourist_phone: string;
    trek_id: string;
    trek_date: string;
    trek_time: string;
    adults: number;
    children?: number;
    booking_type: 'group' | 'private';
    special_requests?: string;
  }
): Promise<{ success: true; booking_ref: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();

  const { data: trek } = await supabase
    .from('treks')
    .select('price_per_adult, is_active')
    .eq('id', data.trek_id)
    .single();

  if (!trek) return { error: 'Trek not found' };

  const multiplier = data.booking_type === 'private' ? 1.5 : 1;
  const pricePerAdult = trek.price_per_adult * multiplier;
  const pricePerChild = pricePerAdult * 0.5;
  const totalPrice =
    data.adults * pricePerAdult + ((data.children ?? 0) * pricePerChild);

  const { data: refData } = await supabase.rpc('generate_booking_ref');
  const booking_ref =
    refData ?? 'OT-WI-' + Date.now().toString(36).toUpperCase();

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      booking_ref,
      trek_id: data.trek_id,
      tourist_id: null,
      booking_type: data.booking_type,
      status: 'confirmed',
      payment_status: 'unpaid',
      source: 'walkin',
      tourist_name: data.tourist_name,
      tourist_email: data.tourist_email ?? '',
      tourist_phone: data.tourist_phone,
      trek_date: data.trek_date,
      trek_time: data.trek_time,
      adults: data.adults,
      children: data.children ?? 0,
      price_per_adult: pricePerAdult,
      price_per_child: pricePerChild,
      total_price: totalPrice,
      special_requests: data.special_requests ?? null,
    })
    .select('booking_ref')
    .single();

  if (error) return { error: error.message };

  const { data: guideId } = await supabase.rpc('get_next_guide');
  if (guideId && booking) {
    await supabase
      .from('bookings')
      .update({
        guide_id: guideId,
        guide_assigned_at: new Date().toISOString(),
      })
      .eq('booking_ref', booking.booking_ref);
  }

  revalidatePath('/admin/dashboard/booking');
  return { success: true, booking_ref: booking.booking_ref };
}
