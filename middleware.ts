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
      .select("role")
      .eq("id", user.id)
      .single();
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
  if (isProtected && !user) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based protection
  for (const [route, roles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!user) {
        const url = new URL("/auth/login", request.url);
        url.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(url);
      }
      // Fetch role from users table
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      if (!profile || !roles.includes(profile.role)) {
        return NextResponse.redirect(new URL("/auth/unauthorized", request.url));
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|api/test).*)"],
};
