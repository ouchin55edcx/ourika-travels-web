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
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("slot", { ascending: true });

  if (error) {
    console.error("Error fetching gallery images:", error);
    return [];
  }

  return data ?? [];
}

export async function updateGalleryImage(
  slot: number,
  formData: FormData,
): Promise<{ success: true; url: string } | { error: string }> {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return { error: "Forbidden" };
  }

  if (slot < 1 || slot > 4) {
    return { error: "Invalid slot number" };
  }

  const supabase = await createSupabaseServerClient();

  // Get existing image to delete from Cloudflare
  const { data: existing } = await supabase
    .from("gallery_images")
    .select("cf_image_id")
    .eq("slot", slot)
    .single();

  const file = formData.get("file") as File;
  if (!file || file.size === 0) {
    return { error: "No file provided" };
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return { error: "Invalid file type. Use JPG, PNG or WebP." };
  }

  try {
    // Delete old image from Cloudflare if exists
    if (existing?.cf_image_id) {
      await deleteFromCloudflare(existing.cf_image_id);
    }

    // Upload new image to Cloudflare
    const uploadResult = await uploadToCloudflare(file, {
      folder: "gallery",
      uploadedBy: user.id,
    });

    const cfImageId = uploadResult.imageId;
    const imageUrl = uploadResult.url;

    // Upsert into database
    const { error: dbError } = await supabase.from("gallery_images").upsert({
      slot,
      image_url: imageUrl,
      cf_image_id: cfImageId,
      title: `Gallery Image ${slot}`,
      updated_at: new Date().toISOString(),
    });

    if (dbError) {
      // Rollback: delete from Cloudflare if DB fails
      await deleteFromCloudflare(cfImageId);
      return { error: dbError.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard/params");

    return { success: true, url: imageUrl };
  } catch (err: any) {
    console.error("Gallery image upload error:", err);
    return { error: err.message || "Upload failed. Please try again." };
  }
}
