import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Fetch role and redirect accordingly
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

      const role =
        profile?.role ||
        (data.user.user_metadata?.role as string | undefined) ||
        (data.user.app_metadata?.role as string | undefined);

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

      if (role === "admin") return NextResponse.redirect(`${baseUrl}/admin/dashboard`);
      if (role === "guide") return NextResponse.redirect(`${baseUrl}/dashboard/guide`);

      return NextResponse.redirect(`${baseUrl}/experiences`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`);
}
