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
