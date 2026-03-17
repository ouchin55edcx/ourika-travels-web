import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import GuideOrderManagement from "./GuideOrderManagement";

export const metadata = { title: "Guide Order | Admin" };

export default async function GuidesPage() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") redirect("/auth/login");

  const supabase = await createSupabaseServerClient();
  const { data: guides } = await supabase
    .from("users")
    .select(
      "id, full_name, avatar_url, phone, guide_order, guide_active, is_verified, specialties, languages",
    )
    .eq("role", "guide")
    .eq("is_active", true)
    .order("guide_order", { ascending: true, nullsFirst: false });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">Guides</p>
        <h1 className="text-4xl font-black tracking-tight text-[#0b3a2c]">Round-Robin Order</h1>
        <p className="mt-1 text-base font-medium text-gray-500">
          Set the order guides receive bookings. #1 gets the next booking, then #2, and so on.
          Guides can be paused without losing their spot.
        </p>
      </div>
      <GuideOrderManagement initialGuides={guides ?? []} />
    </div>
  );
}
