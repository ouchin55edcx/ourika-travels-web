"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { uploadToCloudflare, deleteFromCloudflare } from "@/lib/cloudflare-images";

export type GalleryImage = {
  id: string;
  slot: number;
  image_url: string;
  cf_image_id: string | null;
  title: string | null;
  updated_at: string;
};

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("id, slot, image_url, cf_image_id, title, updated_at")
    .order("slot", { ascending: true });
  return data ?? [];
}

export async function updateGalleryImage(
  slot: number,
  formData: FormData,
): Promise<{ success: true; image_url: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "No file provided" };

  // Fetch existing row for this slot to get old cf_image_id
  const { data: existing } = await supabase
    .from("gallery_images")
    .select("id, cf_image_id")
    .eq("slot", slot)
    .maybeSingle();

  // Upload new image to Cloudflare (throws on error)
  let uploadResult: { imageId: string; url: string };
  try {
    uploadResult = await uploadToCloudflare(file, { folder: `gallery/slot-${slot}` });
  } catch (err: any) {
    return { error: err.message ?? "Upload failed" };
  }

  // Delete old Cloudflare image if one existed
  if (existing?.cf_image_id) {
    await deleteFromCloudflare(existing.cf_image_id).catch(() => {});
  }

  const newImageUrl = uploadResult.url;

  if (existing?.id) {
    // Row exists — UPDATE it, never INSERT
    const { error } = await supabase
      .from("gallery_images")
      .update({
        image_url: newImageUrl,
        cf_image_id: uploadResult.imageId,
        updated_at: new Date().toISOString(),
      })
      .eq("slot", slot);

    if (error) return { error: error.message };
  } else {
    // Row doesn't exist yet — safe to INSERT
    const { error } = await supabase.from("gallery_images").insert({
      slot,
      image_url: newImageUrl,
      cf_image_id: uploadResult.imageId,
      title: `Photo ${slot}`,
    });

    if (error) return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin/dashboard/params");
  return { success: true, image_url: newImageUrl };
}
