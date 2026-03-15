import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? 6), 10);
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("treks")
    .select("id, title, slug, cover_image, price_per_adult, duration, categories(id, name, photo)")
    .eq("is_active", true)
    .limit(limit);

  if (q) {
    query = query.ilike("title", `%${q}%`);
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data } = await query;
  return NextResponse.json(data ?? []);
}
