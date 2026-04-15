"use server";

import { BASE_URL } from "@/lib/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || BASE_URL;

// ─── CHECK EMAIL EXISTS ───
export async function checkEmailExists(email: string): Promise<{ exists: boolean }> {
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { exists: false };
  }

  const supabase = await createSupabaseServerClient();

  // Use the SQL function to check if email exists
  const { data, error } = await supabase.rpc("check_email_exists", {
    email_to_check: email,
  });

  if (error) {
    console.error("Error checking email:", error);
    return { exists: false };
  }

  return { exists: data === true };
}

// ─── TOURIST REGISTER ───
export async function registerTourist(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;

  // Validation
  if (!email || !password || !full_name) return { error: "All fields required" };
  if (password.length < 8) return { error: "Password must be at least 8 characters" };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${APP_URL}/auth/confirm`,
      data: { full_name, role: "tourist" },
    },
  });

  if (error) return { error: error.message };

  // Generate 4-digit verification code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

  // Store verification code on user
  if (data.user) {
    await supabase
      .from("users")
      .update({
        verification_code: code,
        code_expires_at: expiresAt,
      })
      .eq("id", data.user.id);
  }

  // Send verification code via email
  try {
    const { sendVerificationCodeEmail } = await import("@/lib/email");
    await sendVerificationCodeEmail({ to: email, code, role: "tourist" });
  } catch (err) {
    console.error("Failed to send verification code:", err);
  }

  return { success: "Check your email to verify your account.", email };
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
  if (error) {
    // Check if it's an email not confirmed error
    if (error.message.includes("Email not confirmed") || error.message.includes("not confirmed")) {
      return {
        error: "Please verify your email address first. Check your inbox for a verification code.",
      };
    }
    return { error: "Invalid email or password" };
  }

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
      redirectTo: `${APP_URL}/auth/callback`,
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
    redirectTo: `${APP_URL}/auth/reset-password`,
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
      emailRedirectTo: `${APP_URL}/register/guide/welcome`,
      data: { full_name, role: "guide", phone },
    },
  });

  if (error) return { error: error.message };

  // Generate 4-digit verification code
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

  // Update user with verification code and guide fields
  if (data.user) {
    const updates: Record<string, any> = {
      phone,
      role: "guide",
      verification_code: code,
      code_expires_at: expiresAt,
    };
    if (badge_image_url) updates.badge_image_url = badge_image_url;
    await supabase.from("users").update(updates).eq("id", data.user.id);
  }

  // Send verification code via email
  try {
    const { sendVerificationCodeEmail } = await import("@/lib/email");
    await sendVerificationCodeEmail({ to: email, code, role: "guide" });
  } catch (err) {
    console.error("Failed to send verification code:", err);
  }

  return {
    success: "Account created! Please verify your email to activate your guide profile.",
    email,
  };
}

// ─── VERIFY EMAIL OTP ───
export async function verifyEmailOtp(
  email: string,
  token: string,
): Promise<{ success: true; role: string } | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
  if (error) return { error: error.message };
  const role = data.user?.user_metadata?.role ?? "guide";

  // Mark email as verified in users table
  if (data.user) {
    await supabase
      .from("users")
      .update({ email_verified: true, verification_code: null, code_expires_at: null })
      .eq("id", data.user.id);
  }

  return { success: true, role };
}

// ─── RESEND OTP ───
export async function resendOtp(email: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${APP_URL}/register/guide/welcome` },
  });
  if (error) return { error: error.message };
  return { success: true };
}

// ─── UPLOAD GUIDE BADGE IMAGE ───
export async function uploadGuideBadgeImage(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { error: "No file provided" };
  if (file.size > 10 * 1024 * 1024) return { error: "File too large (max 10 MB)" };
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Use JPG, PNG or WebP" };
  }
  try {
    const { uploadToCloudflare } = await import("@/lib/cloudflare-images");
    const result = await uploadToCloudflare(file, { folder: "guide-badges" });
    const url = result.url.replace(/([^:])\/ \/+/g, "$1/");
    return { url };
  } catch (err: any) {
    return { error: err.message || "Upload failed" };
  }
}

// ─── RESEND VERIFICATION ───
export async function resendVerification(email: string) {
  const supabase = await createSupabaseServerClient();
  if (!email) return { error: "Email is required" };

  // Use Supabase auth resend with type 'signup'
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${APP_URL}/register/guide/welcome` },
  });
  if (error) return { error: error.message };
  return { success: true };
}

// ─── VERIFY CODE ───
export async function verifyCode(email: string, code: string, role: "tourist" | "guide") {
  const supabase = await createSupabaseServerClient();
  if (!email || !code) return { error: "Email and code are required" };

  // Find user by email
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, verification_code, code_expires_at, role, email_verified")
    .eq("email", email)
    .single();

  if (userError || !user) {
    return { error: "User not found" };
  }

  // Check if already verified
  if (user.email_verified) {
    return { success: true, alreadyVerified: true };
  }

  // Check if code matches
  if (user.verification_code !== code) {
    return { error: "Invalid verification code" };
  }

  // Check if code has expired
  const expiresAt = new Date(user.code_expires_at);
  if (new Date() > expiresAt) {
    return { error: "Verification code has expired. Please request a new code." };
  }

  // Mark email as verified in users table
  await supabase
    .from("users")
    .update({ email_verified: true, verification_code: null, code_expires_at: null })
    .eq("id", user.id);

  return { success: true };
}
