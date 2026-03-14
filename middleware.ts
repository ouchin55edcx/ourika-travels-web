import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/reservation",
  "/reservation-historic",
  "/wishlist",
  "/ticket-generator",
];

// Routes that require specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  "/admin": ["admin"],
  "/dashboard/guide": ["guide"],
};

export async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createSupabaseMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  const authPages = ["/auth/login", "/auth/register"];
  if (user && authPages.some((p) => pathname.startsWith(p))) {
    const { data: profile } = await supabase
      .from("users")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (profile && !profile.is_active) {
      // If user is blocked, we don't redirect them to dashboard, we let them stay on login page
      // In a real scenario, we might want to force sign out here too
      return supabaseResponse;
    }

    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard/overview", request.url));
    }
    if (profile?.role === "guide") {
      return NextResponse.redirect(new URL("/dashboard/guide", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect private routes — redirect to login if not authenticated
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  // Also check if user is active for any protected or role-based route
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (profile && !profile.is_active) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("error", "deactivated");
      // Use a different response to ensure we redirect
      const response = NextResponse.redirect(url);
      // We should ideally clear the cookies here
      return response;
    }

    // Role-based protection check (already has user, now check role and access)
    for (const [route, roles] of Object.entries(ROLE_ROUTES)) {
      if (pathname.startsWith(route)) {
        if (!profile || !roles.includes(profile.role)) {
          return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
        }
      }
    }
  } else if (isProtected || Object.keys(ROLE_ROUTES).some(route => pathname.startsWith(route))) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}


export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/test).*)"],
};
