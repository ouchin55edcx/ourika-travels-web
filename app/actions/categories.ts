"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { uploadToCloudflare } from "@/lib/cloudflare-images";
import { getCurrentUser } from "@/lib/auth";

export type Category = {
    id: string;
    name: string;
    description: string | null;
    photo: string | null;
    created_at?: string;
};

export async function getCategories() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
    return data as Category[];
}

export async function createCategory(formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const photo = formData.get("photo") as string;

    const { error } = await supabase.from("categories").insert([
        { name, description, photo },
    ]);

    if (error) return { error: error.message };

    revalidatePath("/admin/dashboard/category");
    return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createSupabaseServerClient();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const photo = formData.get("photo") as string;

    const { error } = await supabase
        .from("categories")
        .update({ name, description, photo })
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/dashboard/category");
    return { success: true };
}

export async function deleteCategory(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/dashboard/category");
    return { success: true };
}

export async function uploadCategoryImage(
    formData: FormData
): Promise<{ url: string } | { error: string }> {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") return { error: "Forbidden" };

    const file = formData.get("file") as File;
    if (!file || file.size === 0) return { error: "No file provided" };
    if (file.size > 10 * 1024 * 1024) return { error: "File too large (max 10 MB)" };
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        return { error: "Use JPG, PNG or WebP only" };
    }

    try {
        const result = await uploadToCloudflare(file, { folder: "categories" });
        // Fix any double-slash in the URL
        const url = result.url.replace(/([^:])\/\/+/g, "$1/");
        return { url };
    } catch (err: any) {
        return { error: err.message || "Upload failed" };
    }
}
