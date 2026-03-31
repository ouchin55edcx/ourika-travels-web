"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleGuideAddTreksPermission(guideId: string, canAdd: boolean) {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return { error: "Unauthorized" };
  }

  try {
    await supabase
      .from("users")
      .update({ can_add_treks: canAdd })
      .eq("id", guideId);

    revalidatePath("/admin/dashboard/guides");
    return { success: true };
  } catch (err) {
    console.error("Permission toggle error:", err);
    return { error: "Failed to update permission" };
  }
}
