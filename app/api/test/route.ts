import { NextResponse } from "next/server";

import { getSupabaseClient } from "@/lib/supabase";

type TestApiResponse = {
  ok: boolean;
  message: string;
  details?: string;
};

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // This intentionally queries a non-existent table to validate endpoint reachability.
    // A "relation does not exist" style error confirms the API is reachable.
    const { error } = await supabase
      .from("__connection_test__")
      .select("id")
      .limit(1);

    if (!error) {
      console.log("[supabase-test] Connected: query succeeded.");

      return NextResponse.json<TestApiResponse>({
        ok: true,
        message: "Supabase connection is working.",
      });
    }

    const reachableErrorCodes = new Set(["42P01", "PGRST106"]);
    const reachableByMessage =
      /does not exist|schema cache|Could not find the table/i.test(
        error.message,
      );

    if (reachableErrorCodes.has(error.code ?? "") || reachableByMessage) {
      console.log(
        "[supabase-test] Connected: Supabase reachable with expected test-table error.",
        {
          code: error.code,
          message: error.message,
        },
      );

      return NextResponse.json<TestApiResponse>({
        ok: true,
        message: "Supabase connection is reachable and credentials are valid.",
        details: error.message,
      });
    }

    console.error("[supabase-test] Not connected: unexpected Supabase error.", {
      code: error.code,
      message: error.message,
    });

    return NextResponse.json<TestApiResponse>(
      {
        ok: false,
        message: "Supabase responded with an error.",
        details: error.message,
      },
      { status: 500 },
    );
  } catch (error: unknown) {
    const details = error instanceof Error ? error.message : "Unknown error";

    console.error("[supabase-test] Connection test failed with exception.", {
      details,
    });

    return NextResponse.json<TestApiResponse>(
      {
        ok: false,
        message: "Failed to verify Supabase connection.",
        details,
      },
      { status: 500 },
    );
  }
}
