import { connection } from "next/server";
import { createSupabaseServerClient } from "./supabase/server";

export type UserRole = "tourist" | "guide" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  guide_badge_code: string | null;
  badge_image_url: string | null;
  email_verified: boolean;
  is_active: boolean;
  specialties: string[];
  languages: string[];
  location: string | null;
  years_experience: number | null;
  certifications: string[];
  is_verified: boolean;
  verification_status: 'unsubmitted' | 'pending' | 'verified' | 'rejected';
  verification_note: string | null;
  verified_at: string | null;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  // connection() opts out of the Static Site Generation and Data Cache in Next.js 15,
  // ensuring we always check the actual session from cookies on every refresh.
  try {
    await connection();
  } catch {
    // connection() might fail in some environments (like mid-middleware), 
    // we continue as cookies() will also opt-out usually.
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Try to fetch profile from the public.users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile) {
    return profile as AuthUser;
  }

  // Fallback: If public.users record isn't ready yet (common with triggers),
  // construct a basic AuthUser from auth metadata to avoid "logged out" flicker
  return {
    id: user.id,
    email: user.email || "",
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
    role: (user.user_metadata?.role as UserRole) || "tourist",
    avatar_url: user.user_metadata?.avatar_url || null,
    phone: user.user_metadata?.phone || null,
    bio: null,
    guide_badge_code: null,
    badge_image_url: null,
    email_verified: !!user.email_confirmed_at,
    is_active: true,
    specialties: [],
    languages: [],
    location: null,
    years_experience: null,
    certifications: [],
    is_verified: false,
    verification_status: 'unsubmitted',
    verification_note: null,
    verified_at: null,
  } as AuthUser;
}

export async function requireAuth(allowedRoles?: UserRole[]): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("UNAUTHORIZED");
  if (!user.is_active) throw new Error("DEACTIVATED");
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }
  return user;
}

