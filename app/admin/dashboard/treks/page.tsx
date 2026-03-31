import { getTreks } from "@/app/actions/treks";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TreksList from "./TreksList";
import Link from "next/link";
import { Compass, Plus } from "lucide-react";
import { Suspense } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Treks | Admin Dashboard" };

export default async function AdminTreksPage() {
  const [user, supabase] = await Promise.all([getCurrentUser(), createSupabaseServerClient()]);
  if (!user || user.role !== "admin") redirect("/auth/login");

  const [treks, totalCount, publishedCount] = await Promise.all([
    getTreks(),
    supabase.from("treks").select("id", { count: "exact", head: true }),
    supabase.from("treks").select("id", { count: "exact", head: true }).eq("is_active", true),
  ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ef9d]/10 text-[#00ef9d]">
              <Compass className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">Treks</p>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#0b3a2c] sm:text-[2rem]">
            Manage treks
          </h1>
          <p className="text-sm font-medium text-gray-400 sm:text-base">
            {totalCount.count ?? 0} total ·{" "}
            <span className="text-[#004f32]">{publishedCount.count ?? 0} published</span> ·{" "}
            <span className="text-gray-400">
              {(totalCount.count ?? 0) - (publishedCount.count ?? 0)} drafts
            </span>
          </p>
        </div>

        <Link
          href="/admin/dashboard/treks/new"
          className="group flex items-center gap-3 rounded-full bg-[#0b3a2c] px-8 py-4 text-sm font-black text-white shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Add new trek
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded-[2.5rem] border-2 border-dashed border-gray-100 bg-white">
            <div className="flex flex-col items-center gap-3 text-gray-300">
              <Compass className="h-10 w-10 animate-spin" />
              <p className="text-sm font-black tracking-widest uppercase">Loading treks...</p>
            </div>
          </div>
        }
      >
        <TreksList initialTreks={treks} />
      </Suspense>
    </div>
  );
}
