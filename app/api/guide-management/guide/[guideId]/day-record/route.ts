import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/guide-management/guide/[guideId]/day-record
 * Query parameters:
 * - date: ISO date string (YYYY-MM-DD), defaults to today
 * 
 * Returns day record with trip count, earnings, and time tracking
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ guideId: string }> },
) {
  try {
    const { guideId } = await context.params;
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    const supabase = await createSupabaseServerClient();

    // Use provided date or today
    const targetDate = dateParam || new Date().toISOString().split("T")[0];

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

    // Get daily record
    const { data: dailyRecord } = await supabase
      .from("guide_daily_records")
      .select("*")
      .eq("guide_id", guideId)
      .eq("record_date", targetDate)
      .maybeSingle();

    // Get all trips for this day
    const { data: trips } = await supabase
      .from("guide_assignments")
      .select(
        `
        id,
        status,
        assigned_at,
        completed_at,
        bookings(
          id,
          trek_date,
          trek_time,
          total_price
        )
      `,
      )
      .eq("guide_id", guideId)
      .gte("assigned_at", `${targetDate}T00:00:00Z`)
      .lte("assigned_at", `${targetDate}T23:59:59Z`);

    // Get global parameters
    const { data: params } = await supabase
      .from("guide_parameters")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      success: true,
      guide: {
        id: guide.id,
        full_name: guide.full_name,
        phone: guide.phone,
      },
      date: targetDate,
      daily_record: dailyRecord || {
        trip_count: 0,
        completed_trips: 0,
        cancelled_trips: 0,
        no_show_trips: 0,
        total_earnings: 0,
        total_amount: 0,
        is_absent: false,
      },
      trips: trips?.map((t) => ({
        id: t.id,
        status: t.status,
        assigned_at: t.assigned_at,
        completed_at: t.completed_at,
        trip_info: t.bookings,
      })) || [],
      global_parameters: {
        trip_fixed_amount: params?.trip_fixed_amount || 300,
        guide_payment_per_trip: params?.guide_payment_per_trip || 250,
      },
      summary: {
        total_trips: trips?.length || 0,
        completed: dailyRecord?.completed_trips || 0,
        cancelled: dailyRecord?.cancelled_trips || 0,
        no_show: dailyRecord?.no_show_trips || 0,
        total_earnings: dailyRecord?.total_earnings || 0,
        total_amount: dailyRecord?.total_amount || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching day record:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch day record" },
      { status: 500 },
    );
  }
}
