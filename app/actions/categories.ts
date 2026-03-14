"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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
