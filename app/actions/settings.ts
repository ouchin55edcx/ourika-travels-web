"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateGeneralSettings(settings: {
  site_name?: string;
  site_logo_url?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    const updates = Object.entries(settings).map(async ([key, value]) => {
      await supabase
        .from("general_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    });

    await Promise.all(updates);
    revalidatePath("/admin/dashboard/params");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Settings update error:", err);
    return { error: "Failed to update settings" };
  }
}

export async function uploadLogo(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file || !file.type.startsWith("image/")) {
    return { error: "Please upload a valid image file" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "File size must be less than 5 MB" };
  }

  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("guide-documents")
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("guide-documents").getPublicUrl(fileName);

    return { url: publicUrl };
  } catch (err) {
    console.error("Upload error:", err);
    return { error: "Upload failed" };
  }
}
