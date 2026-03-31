import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthUser } from "@/lib/auth";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getAdminUsersPage } from "@/app/actions/users";

const UsersManagement = dynamic(() => import("./UsersManagement"), {
  loading: () => (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm">
      <div className="animate-pulse space-y-4">
        <div className="flex gap-3">
          <div className="h-11 w-80 rounded-2xl bg-gray-100" />
          <div className="h-11 flex-1 rounded-2xl bg-gray-100" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-16 rounded-2xl bg-gray-50" />
        ))}
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "User Management",
  description:
    "Manage platform tourists and local guides, verify credentials, and moderate access.",
};

export default async function AdminUsersPage() {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "admin") {
    redirect("/auth/login");
  }

  const supabase = await createSupabaseServerClient();
  const [users, touristCount, activeGuidesCount, pendingGuidesCount, blockedCount] =
    await Promise.all([
      getAdminUsersPage(0, 50),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("role", "tourist"),
      supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "guide")
        .eq("is_active", true),
      supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("role", "guide")
        .eq("verification_status", "pending"),
      supabase.from("users").select("id", { count: "exact", head: true }).eq("is_active", false),
    ]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">Management</p>
        <h1 className="text-3xl font-black tracking-tight text-[#0b3a2c] sm:text-[2rem]">
          Travelers and Guides
        </h1>
        <p className="max-w-2xl text-sm font-medium text-gray-500 sm:text-base">
          Monitor user activity, verify local expert credentials, and manage community access.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Tourists", value: touristCount.count ?? 0, tone: "bg-blue-50" },
          { label: "Active Guides", value: activeGuidesCount.count ?? 0, tone: "bg-emerald-50" },
          {
            label: "Pending Verification",
            value: pendingGuidesCount.count ?? 0,
            tone: "bg-amber-50",
          },
          { label: "Blocked Accounts", value: blockedCount.count ?? 0, tone: "bg-red-50" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-3xl border border-black/5 ${stat.tone} p-6 shadow-sm`}
          >
            <p className="text-xs font-bold tracking-tight text-gray-400 uppercase">{stat.label}</p>
            <p className="mt-2 text-2xl font-black text-[#0b3a2c]">{stat.value}</p>
          </div>
        ))}
      </div>

      <UsersManagement
        initialUsers={(users as AuthUser[]) || []}
        initialOffset={users.length}
        pendingGuidesCount={pendingGuidesCount.count ?? 0}
      />
    </div>
  );
}
