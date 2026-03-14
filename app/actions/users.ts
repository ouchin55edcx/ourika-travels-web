"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Toggles a user's active status.
 * This is the primary mechanism for blocking/activating accounts.
 */
export async function toggleUserStatus(userId: string, isActive: boolean) {
  const supabase = await createSupabaseServerClient();
  
  // 1. Update the database profile
  const { error } = await supabase
    .from("users")
    .update({ is_active: isActive })
    .eq("id", userId);

  if (error) return { error: error.message };

  // 2. Revalidate the users management page
  revalidatePath("/admin/dashboard/users");
  
  return { 
    success: true, 
    message: `User ${isActive ? "activated" : "blocked"} successfully` 
  };
}

/**
 * Toggles a guide's verification status.
 */
export async function toggleGuideVerification(userId: string, isVerified: boolean) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("users")
    .update({ email_verified: isVerified }) // Deriving verification from email_verified for now
    .eq("id", userId);

  if (error) return { error: error.message };
  
  revalidatePath("/admin/dashboard/users");
  
  return { 
    success: true, 
    message: `Guide ${isVerified ? "verified" : "unverified"} successfully` 
  };
}

/**
 * Archives a user.
 * For now, this is implemented as a block (is_active: false).
 * In a future update, this could move the user to a separate 'archived_users' table.
 */
export async function archiveUser(userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("users")
    .update({ is_active: false })
    .eq("id", userId);

  if (error) return { error: error.message };
  
  revalidatePath("/admin/dashboard/users");
  
  return { 
    success: true, 
    message: "User archived successfully" 
  };
}

/**
 * Permanently deletes a user from the public.users table.
 * Note: This does NOT delete the user from Supabase Auth automatically 
 * unless there is a database trigger configured for 'on delete cascade'.
 */
export async function deleteUser(userId: string) {
  const supabase = await createSupabaseServerClient();
  
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (error) return { error: error.message };
  
  revalidatePath("/admin/dashboard/users");
  
  return { 
    success: true, 
    message: "User record removed successfully" 
  };
}
