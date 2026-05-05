import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/guide-management/guide/[guideId]/assignments
 * Returns all trip assignments for a specific guide with action options
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ guideId: string }> },
) {
  try {
    const { guideId } = await context.params;
    const supabase = await createSupabaseServerClient();

    // Get guide info
    const { data: guide, error: guideError } = await supabase
      .from("users")
      .select("*")
      .eq("id", guideId)
      .eq("role", "guide")
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: "Guide not found" }, { status: 404 });
    }

    // Get all assignments for this guide
    const { data: assignments, error: assignmentsError } = await supabase
      .from("guide_assignments")
      .select(
        `
        id,
        trip_id,
        status,
        chauffeur_name,
        assigned_at,
        completed_at,
        cancelled_at,
        notes,
        bookings(
          id,
          booking_ref,
          trek_date,
          trek_time,
          tourist_name,
          tourist_phone,
          adults,
          children,
          total_price,
          special_requests,
          treks(
            id,
            title,
            description,
            duration,
            difficulty_level
          )
        )
      `,
      )
      .eq("guide_id", guideId)
      .order("assigned_at", { ascending: false });

    if (assignmentsError) throw assignmentsError;

    // Categorize assignments
    const active = assignments?.filter((a) => a.status === "active") || [];
    const completed = assignments?.filter((a) => a.status === "completed") || [];
    const cancelled = assignments?.filter((a) => a.status === "cancelled") || [];

    return NextResponse.json({
      success: true,
      guide: {
        id: guide.id,
        full_name: guide.full_name,
        phone: guide.phone,
        avatar_url: guide.avatar_url,
        guide_order: guide.guide_order,
      },
      assignments: {
        active,
        completed,
        cancelled,
      },
      summary: {
        total_assignments: assignments?.length || 0,
        active_assignments: active.length,
        completed_assignments: completed.length,
        cancelled_assignments: cancelled.length,
      },
    });
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch assignments" },
      { status: 500 },
    );
  }
}
