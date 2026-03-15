import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import UsersManagement from "./UsersManagement";
import { AuthUser } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage platform tourists and local guides, verify credentials, and moderate access.",
};


export default async function AdminUsersPage() {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "admin") {
    redirect("/auth/login");
  }

  const supabase = await createSupabaseServerClient();
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold uppercase tracking-wider text-[#0b3a2c]/60">Management</p>
        <h1 className="text-4xl font-black tracking-tight text-[#0b3a2c]">Travelers and Guides</h1>
        <p className="max-w-2xl text-lg font-medium text-gray-500">
          Monitor user activity, verify local expert credentials, and manage community access.
        </p>
      </div>

      <UsersManagement initialUsers={(users as AuthUser[]) || []} />
    </div>
  );
}

