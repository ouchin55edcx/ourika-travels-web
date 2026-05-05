"use server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ==================== GUIDE ORDER MANAGEMENT ====================

export async function updateGuideOrder(guides: { id: string; guide_order: number }[]) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  // Update each guide's order
  for (const g of guides) {
    await supabase.from("users").update({ guide_order: g.guide_order }).eq("id", g.id);
  }
  revalidatePath("/admin/dashboard/guides");
  revalidatePath("/admin/dashboard/overview");
  return { success: true };
}

export async function toggleGuideActive(guideId: string, active: boolean) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  await supabase.from("users").update({ guide_active: active }).eq("id", guideId);
  revalidatePath("/admin/dashboard/guides");
  revalidatePath("/admin/dashboard/overview");
  return { success: true };
}

// ==================== GUIDE ASSIGNMENTS ====================

export type GuideAssignmentInput = {
  trip_id: string;
  guide_id: string;
  status?: "active" | "completed" | "cancelled" | "no_show";
  chauffeur_name?: string | null;
};

export async function assignGuideToTrip(data: GuideAssignmentInput) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  // Check if trip exists
  const { data: trip, error: tripError } = await supabase
    .from("bookings")
    .select("id, total_price, trek_date")
    .eq("id", data.trip_id)
    .single();

  if (tripError || !trip) return { error: "Trip not found" };

  // Check if guide is available (not absent)
  const { data: absences } = await supabase
    .from("guide_absences")
    .select("*")
    .eq("guide_id", data.guide_id)
    .gt("absent_until", new Date().toISOString())
    .limit(1);

  if (absences && absences.length > 0) {
    return { error: "Guide is currently absent" };
  }

  // Create assignment
  const { data: assignment, error: assignError } = await supabase
    .from("guide_assignments")
    .insert({
      trip_id: data.trip_id,
      guide_id: data.guide_id,
      status: data.status || "active",
      chauffeur_name: data.chauffeur_name || null,
      assigned_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (assignError) return { error: assignError.message };

  // Update guide order (move assigned guide to end)
  const { data: guides } = await supabase
    .from("users")
    .select("id, guide_order")
    .eq("role", "guide")
    .not("guide_order", "is", null)
    .order("guide_order", { ascending: false })
    .limit(1);

  if (guides && guides.length > 0) {
    const maxOrder = guides[0].guide_order as number;
    await supabase
      .from("users")
      .update({ guide_order: maxOrder + 1 })
      .eq("id", data.guide_id);
  }

  revalidatePath("/admin/dashboard/guides");
  return { success: true, assignment };
}

export async function completeGuideAssignment(assignmentId: string) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  const { data: assignment, error: fetchError } = await supabase
    .from("guide_assignments")
    .select("*, guide_id")
    .eq("id", assignmentId)
    .single();

  if (fetchError || !assignment) return { error: "Assignment not found" };

  // Update assignment status
  const { error: updateError } = await supabase
    .from("guide_assignments")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", assignmentId);

  if (updateError) return { error: updateError.message };

  // Update daily record
  const today = new Date().toISOString().split("T")[0];
  const { data: dailyRecord } = await supabase
    .from("guide_daily_records")
    .select("*")
    .eq("guide_id", assignment.guide_id)
    .eq("record_date", today)
    .maybeSingle();

  if (dailyRecord) {
    await supabase
      .from("guide_daily_records")
      .update({
        completed_trips: (dailyRecord.completed_trips || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dailyRecord.id);
  } else {
    // Create new daily record
    const { data: params } = await supabase
      .from("guide_parameters")
      .select("guide_payment_per_trip")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    await supabase.from("guide_daily_records").insert({
      guide_id: assignment.guide_id,
      record_date: today,
      trip_count: 1,
      completed_trips: 1,
      total_earnings: params?.guide_payment_per_trip || 250,
    });
  }

  revalidatePath("/admin/dashboard/guides");
  return { success: true };
}

export async function cancelGuideAssignment(assignmentId: string, reason?: string) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  const { data: assignment } = await supabase
    .from("guide_assignments")
    .select("*")
    .eq("id", assignmentId)
    .single();

  if (!assignment) return { error: "Assignment not found" };

  await supabase
    .from("guide_assignments")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      notes: reason,
      updated_at: new Date().toISOString(),
    })
    .eq("id", assignmentId);

  revalidatePath("/admin/dashboard/guides");
  return { success: true };
}

// ==================== GUIDE ABSENCES ====================

export type GuideAbsenceInput = {
  guide_id: string;
  absent_from: string; // ISO date
  reason?: string;
};

export async function markGuideAbsent(data: GuideAbsenceInput) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  const absentFrom = new Date(data.absent_from);
  const absentUntil = new Date(absentFrom.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const { data: absence, error } = await supabase
    .from("guide_absences")
    .insert({
      guide_id: data.guide_id,
      absent_from: absentFrom.toISOString(),
      absent_until: absentUntil.toISOString(),
      reason: data.reason,
      auto_remove: true,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Update daily record
  const today = data.absent_from.split("T")[0];
  const { data: dailyRecord } = await supabase
    .from("guide_daily_records")
    .select("*")
    .eq("guide_id", data.guide_id)
    .eq("record_date", today)
    .maybeSingle();

  if (dailyRecord) {
    await supabase
      .from("guide_daily_records")
      .update({
        is_absent: true,
        absent_reason: data.reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dailyRecord.id);
  } else {
    await supabase.from("guide_daily_records").insert({
      guide_id: data.guide_id,
      record_date: today,
      is_absent: true,
      absent_reason: data.reason,
    });
  }

  revalidatePath("/admin/dashboard/guides");
  return { success: true, absence };
}

export async function removeGuideAbsence(absenceId: string) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  const { error } = await supabase.from("guide_absences").delete().eq("id", absenceId);

  if (error) return { error: error.message };

  revalidatePath("/admin/dashboard/guides");
  return { success: true };
}

// ==================== GUIDE PARAMETERS ====================

export type GuideParametersInput = {
  trip_fixed_amount: number;
  guide_payment_per_trip: number;
};

export async function updateGuideParameters(data: GuideParametersInput) {
  const supabase = await createSupabaseServerClient();
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") return { error: "Forbidden" };

  const { data: params, error } = await supabase
    .from("guide_parameters")
    .update({
      trip_fixed_amount: data.trip_fixed_amount,
      guide_payment_per_trip: data.guide_payment_per_trip,
      updated_by: admin.id,
      updated_at: new Date().toISOString(),
    })
    .gt("created_at", new Date(0).toISOString()) // Get the first one
    .select()
    .single();

  if (error) {
    // If no record exists, create one
    const { error: insertError } = await supabase
      .from("guide_parameters")
      .insert({
        trip_fixed_amount: data.trip_fixed_amount,
        guide_payment_per_trip: data.guide_payment_per_trip,
        updated_by: admin.id,
      });

    if (insertError) return { error: insertError.message };
  }

  revalidatePath("/admin/dashboard/guides");
  return { success: true };
}

export async function getGuideParameters() {
  const supabase = await createSupabaseServerClient();

  const { data: params, error } = await supabase
    .from("guide_parameters")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    // Return defaults if none exist
    return {
      trip_fixed_amount: 300,
      guide_payment_per_trip: 250,
    };
  }

  return params;
}
