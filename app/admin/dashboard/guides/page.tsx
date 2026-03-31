import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import GuideOrderManagement from "./GuideOrderManagement";

export const metadata = { title: "Guide Order | Admin" };

export default async function GuidesPage() {
  const [admin, supabase] = await Promise.all([getCurrentUser(), createSupabaseServerClient()]);
  if (!admin || admin.role !== "admin") redirect("/auth/login");

  const { data: guides, error } = await supabase
    .from("users")
    .select(
      "id, full_name, avatar_url, phone, guide_order, guide_active, is_verified, can_add_treks, specialties, languages, is_active",
    )
    .eq("role", "guide")
    .order("guide_order", { ascending: true, nullsFirst: true });

  if (error) {
    console.error("Error fetching guides:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">Guides</p>
        <h1 className="text-3xl font-black tracking-tight text-[#0b3a2c] sm:text-[2rem]">
          Round-Robin Order
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">
          Set the order guides receive bookings. #1 gets the next booking, then #2, and so on.
          Guides can be paused without losing their spot.
        </p>
      </div>
      <GuideOrderManagement initialGuides={guides ?? []} />
    </div>
  );
}
