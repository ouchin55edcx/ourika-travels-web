import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import GuideManagementTabs from "./GuideManagementTabs";

export const metadata = { title: "Guide Management | Admin" };

export default async function GuidesPage() {
  const [admin, supabase] = await Promise.all([getCurrentUser(), createSupabaseServerClient()]);
  if (!admin || admin.role !== "admin") redirect("/auth/login");

  // Fetch all guides
  const { data: guides, error: guidesError } = await supabase
    .from("users")
    .select(
      "id, full_name, avatar_url, phone, guide_order, guide_active, is_verified, can_add_treks, specialties, languages, is_active, verification_status",
    )
    .eq("role", "guide")
    .order("guide_order", { ascending: true, nullsFirst: true });

  // Fetch active bookings for assignment
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(
      "id, booking_ref, trek_date, trek_time, tourist_name, total_price, adults, children, payment_status, status",
    )
    .in("status", ["pending", "confirmed"])
    .not("guide_id", "is", null);

  // Fetch guide assignments
  const { data: assignments } = await supabase
    .from("guide_assignments")
    .select("*")
    .in("status", ["active", "completed"]);

  // Fetch guide parameters
  const { data: params } = await supabase
    .from("guide_parameters")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch guide absences
  const { data: absences } = await supabase
    .from("guide_absences")
    .select("*")
    .gt("absent_until", new Date().toISOString());

  if (guidesError || bookingsError) {
    console.error("Error fetching data:", { guidesError, bookingsError });
  }

  const guideParameters = params || {
    trip_fixed_amount: 300,
    guide_payment_per_trip: 250,
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">
          Guide Management System
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[#0b3a2c] sm:text-[2rem]">
          Comprehensive Guide Management
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">
          Manage guide order, assignments, absences, and track daily performance metrics
        </p>
      </div>
      <GuideManagementTabs
        initialGuides={guides ?? []}
        initialBookings={bookings ?? []}
        initialAssignments={assignments ?? []}
        initialAbsences={absences ?? []}
        guideParameters={guideParameters}
      />
    </div>
  );
}
