import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Fetch role and activation status
      const { data: profile } = await supabase
        .from("users")
        .select("role, is_active")
        .eq("id", data.user.id)
        .single();

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

      if (profile && profile.is_active === false) {
        await supabase.auth.signOut();
        return NextResponse.redirect(new URL("/auth/login?error=deactivated", baseUrl));
      }

      const role =
        profile?.role ||
        (data.user.user_metadata?.role as string | undefined) ||

        (data.user.app_metadata?.role as string | undefined) ||
        "tourist"; // Default to tourist

      // Essential for Next.js to notice the auth change across all server components
      revalidatePath("/", "layout");

      if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", baseUrl));
      if (role === "guide") return NextResponse.redirect(new URL("/dashboard/guide", baseUrl));

      return NextResponse.redirect(new URL("/experiences", baseUrl));
    }
  }

  return NextResponse.redirect(new URL("/auth/login?error=auth_callback_failed", origin));
}

