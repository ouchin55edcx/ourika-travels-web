"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
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

/**
 * Guide requests verification.
 * Sets verification_status to 'pending' for admin review.
 */
export async function requestVerification() {
  const supabase = await createSupabaseServerClient();
  const user = await getCurrentUser();
  if (!user || user.role !== 'guide') return { error: 'Unauthorized' };

  // Only allow if not already verified or pending
  if (user.verification_status === 'verified') {
    return { error: 'Already verified' };
  }

  const { error } = await supabase
    .from('users')
    .update({ verification_status: 'pending' })
    .eq('id', user.id);

  if (error) return { error: error.message };

  revalidatePath('/dashboard/guide');
  revalidatePath('/dashboard/guide/profile');
  revalidatePath('/admin/dashboard/users');
  return { success: true };
}

/**
 * Admin verifies a guide.
 * Sets is_verified to true and verification_status to 'verified'.
 */
export async function verifyGuide(guideId: string, note?: string) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  const { error } = await supabase
    .from('users')
    .update({
      is_verified:         true,
      verification_status: 'verified',
      verification_note:   note || null,
      verified_at:         new Date().toISOString(),
    })
    .eq('id', guideId);

  if (error) return { error: error.message };

  revalidatePath('/admin/dashboard/users');
  return { success: true };
}

/**
 * Admin rejects a guide's verification request.
 * Sets verification_status to 'rejected' with a note.
 */
export async function rejectGuide(guideId: string, note: string) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return { error: 'Forbidden' };

  const { error } = await supabase
    .from('users')
    .update({
      is_verified:         false,
      verification_status: 'rejected',
      verification_note:   note,
      verified_at:         null,
    })
    .eq('id', guideId);

  if (error) return { error: error.message };

  revalidatePath('/admin/dashboard/users');
  return { success: true };
}
