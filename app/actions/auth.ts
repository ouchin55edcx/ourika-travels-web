"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
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

// ─── GUIDE REGISTER (multi-step, called at final step) ───
export async function registerGuide(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;
  const bio = formData.get("bio") as string;

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

  // Update additional guide fields (phone, bio) after registration
  if (data.user) {
    await supabase.from("users").update({ phone, bio, role: "guide" }).eq("id", data.user.id);
  }

  return {
    success: "Account created! Please verify your email to activate your guide profile.",
  };
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
