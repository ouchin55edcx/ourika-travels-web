"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

export async function updateProfile(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) return { error: "User not authenticated" };

    const full_name = formData.get("full_name") as string;
    const phone = formData.get("phone") as string;
    const bio = formData.get("bio") as string;
    // const avatar_url = formData.get("avatar_url") as string; // Will handle avatar later if needed

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
        .from("users")
        .update({
            full_name,
            phone,
            bio,
            // avatar_url,
        })
        .eq("id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/dashboard/profile");
    return { success: "Profile updated successfully" };
}

export async function updateGuideProfile(formData: FormData) {
    const user = await getCurrentUser();
    if (!user || user.role !== 'guide') return { error: 'Unauthorized' };

    const supabase = await createSupabaseServerClient();

    const updates: Record<string, any> = {
        full_name:        formData.get('full_name') as string,
        phone:            formData.get('phone') as string,
        bio:              formData.get('bio') as string,
        location:         formData.get('location') as string,
        years_experience: parseInt(formData.get('years_experience') as string) || null,
    };

    const langRaw = formData.get('languages') as string;
    const specRaw = formData.get('specialties') as string;
    const certRaw = formData.get('certifications') as string;

    try {
        if (langRaw) updates.languages      = JSON.parse(langRaw);
        if (specRaw) updates.specialties    = JSON.parse(specRaw);
        if (certRaw) updates.certifications = JSON.parse(certRaw);
    } catch {}

    const avatarUrl    = formData.get('avatar_url') as string | null;
    const badgeUrl     = formData.get('badge_image_url') as string | null;
    const badgeCode    = formData.get('guide_badge_code') as string | null;

    if (avatarUrl)  updates.avatar_url        = avatarUrl;
    if (badgeUrl)   updates.badge_image_url   = badgeUrl;
    if (badgeCode)  updates.guide_badge_code  = badgeCode;

    const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

    if (error) return { error: error.message };

    revalidatePath('/dashboard/guide/profile');
    revalidatePath('/dashboard/guide');
    return { success: true };
}
