import { createSupabaseServerClient } from "@/lib/supabase/server";
import QuickBookForm from "./QuickBookForm";
import type { Metadata } from "next";
import { BASE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Reserve your experience — Ourika Travels",
  description: "Quick walk-in reservation at Ourika Travels bureau, Setti Fatma.",
  alternates: {
    canonical: `${BASE_URL}/quick-book`,
  },
};

export default async function QuickBookPage() {
  const supabase = await createSupabaseServerClient();
  const { data: treks } = await supabase
    .from("treks")
    .select("id, title, slug, price_per_adult, duration, time_of_day")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-[#0b3a2c]">
      <div className="px-6 pt-10 pb-6 text-center">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ef9d]">
          <span className="text-2xl font-black text-[#0b3a2c]">OT</span>
        </div>
        <h1 className="text-2xl font-black text-white">Ourika Travels</h1>
        <p className="mt-1 text-sm text-white/60">Reserve your experience — Setti Fatma bureau</p>
      </div>
      <div className="flex-1 rounded-t-[2.5rem] bg-white px-6 pt-8 pb-10">
        <QuickBookForm treks={treks ?? []} />
      </div>
    </div>
  );
}
