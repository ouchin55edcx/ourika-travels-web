"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

// ─── TOURIST REGISTER ───
export async function registerTourist(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;

  // Validation
  if (!email || !password || !full_name) return { error: "All fields required" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      data: { full_name, role: "tourist" },
    },
  });

  if (error) return { error: error.message };
  return { success: "Check your email to verify your account." };
}

// ─── TOURIST / ADMIN LOGIN ───
export async function loginWithEmail(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirectTo") as string | null;

  if (!email || !password) return { error: "Email and password required" };

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { error: "Invalid email or password" };

  // Fetch role to redirect correctly
  const { data: profile } = await supabase
    .from("users")
    .select("role, is_active, email_verified")
    .eq("id", data.user.id)
    .single();

  if (!profile?.is_active) {
    await supabase.auth.signOut();
    return { error: "Your account has been deactivated. Contact support." };
  }

  revalidatePath("/", "layout");

  // Role-based redirect
  if (profile.role === "admin") redirect("/admin/dashboard");
  if (profile.role === "guide") redirect("/dashboard/guide");

  // Default for tourists
  redirect("/experiences");
}

// ─── GOOGLE OAUTH ───
export async function loginWithGoogle() {
  const supabase = await createSupabaseServerClient();
  const host = (await headers()).get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
  if (error) return { error: error.message };
  if (data.url) redirect(data.url);
}

// ─── SIGN OUT ───
export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  revalidatePath("/", "page");
  redirect("/");
}

// ─── FORGOT PASSWORD ───
export async function forgotPassword(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required" };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  // Always return success to prevent email enumeration
  return {
    success: "If that email exists, you will receive a reset link shortly.",
  };
}

// ─── RESET PASSWORD ───
export async function resetPassword(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm_password") as string;

  if (!password || password !== confirm) return { error: "Passwords do not match" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/auth/login?reset=success");
}

// ─── GUIDE REGISTER (simplified single-step) ───
export async function registerGuide(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const badge_image_url = formData.get("badge_image_url") as string | null;

  if (!email || !password || !full_name || !phone) {
    return { error: "All required fields must be filled" };
  }
  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
      data: { full_name, role: "guide", phone },
    },
  });

  if (error) return { error: error.message };

  // Update additional guide fields (phone, badge_image_url) after registration
  if (data.user) {
    const updates: Record<string, any> = { phone, role: "guide" };
    if (badge_image_url) updates.badge_image_url = badge_image_url;
    await supabase.from("users").update(updates).eq("id", data.user.id);
  }

  return {
    success: "Account created! Please verify your email to activate your guide profile.",
  };
}

// ─── UPLOAD GUIDE BADGE IMAGE ───
export async function uploadGuideBadgeImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) return { error: 'No file provided' };
  if (file.size > 10 * 1024 * 1024) return { error: 'File too large (max 10 MB)' };
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return { error: 'Use JPG, PNG or WebP' };
  }
  try {
    const { uploadToCloudflare } = await import('@/lib/cloudflare-images');
    const result = await uploadToCloudflare(file, { folder: 'guide-badges' });
    const url = result.url.replace(/([^:])\/ \/+/g, '$1/');
    return { url };
  } catch (err: any) {
    return { error: err.message || 'Upload failed' };
  }
}

// ─── RESEND VERIFICATION ───
export async function resendVerification(email: string) {
  const supabase = await createSupabaseServerClient();
  if (!email) return { error: "Email is required" };

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
    },
  });

  if (error) return { error: error.message };
  return { success: "Verification email resent." };
}
