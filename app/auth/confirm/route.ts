import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (token_hash && type) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check database profile first, then fall back to metadata
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        const role = profile?.role || user.user_metadata?.role;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || origin;

        if (role === "guide") {
          return NextResponse.redirect(new URL("/dashboard/guide", baseUrl));
        }
        if (role === "admin") {
          return NextResponse.redirect(new URL("/admin/dashboard/overview", baseUrl));
        }
      }

      return NextResponse.redirect(`${origin}/?verified=true`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`);
}
