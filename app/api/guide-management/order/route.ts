import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/guide-management/order
 * Returns the complete guide order with trip information and status
 * Used by mobile app for guide queue display
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Get all guides ordered by guide_order
    const { data: guides, error: guidesError } = await supabase
      .from("users")
      .select(
        `
        id,
        full_name,
        avatar_url,
        phone,
        guide_order,
        guide_active,
        is_verified,
        specialties,
        languages,
        location
      `,
      )
      .eq("role", "guide")
      .order("guide_order", { ascending: true, nullsFirst: true });

    if (guidesError) throw guidesError;

    // Get current assignments for each guide
    const { data: assignments } = await supabase
      .from("guide_assignments")
      .select(
        `
        id,
        guide_id,
        trip_id,
        status,
        chauffeur_name,
        assigned_at,
        bookings(
          id,
          booking_ref,
          trek_date,
          trek_time,
          tourist_name,
          total_price,
          adults,
          children
        )
      `,
      )
      .in("status", ["active", "completed"]);

    // Get active absences
    const { data: absences } = await supabase
      .from("guide_absences")
      .select("*")
      .gt("absent_until", new Date().toISOString());

    // Get daily records for today
    const today = new Date().toISOString().split("T")[0];
    const { data: dailyRecords } = await supabase
      .from("guide_daily_records")
      .select("*")
      .eq("record_date", today);

    // Enrich guides with assignment and daily info
    const enrichedGuides = guides?.map((guide) => {
      const guideAssignments = assignments?.filter((a) => a.guide_id === guide.id) || [];
      const guideAbsence = absences?.find((a) => a.guide_id === guide.id);
      const guideDaily = dailyRecords?.find((r) => r.guide_id === guide.id);

      return {
        ...guide,
        is_absent: !!guideAbsence,
        absence_until: guideAbsence?.absent_until,
        absence_reason: guideAbsence?.reason,
        assignments: guideAssignments.map((a) => ({
          id: a.id,
          status: a.status,
          chauffeur_name: a.chauffeur_name,
          assigned_at: a.assigned_at,
          trip: a.bookings,
        })),
        daily_stats: guideDaily || {
          trip_count: 0,
          completed_trips: 0,
          total_earnings: 0,
          total_amount: 0,
        },
      };
    });

    return NextResponse.json({
      success: true,
      data: enrichedGuides,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching guide order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch guide order" },
      { status: 500 },
    );
  }
}
