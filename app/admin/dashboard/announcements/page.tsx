import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AnnouncementsManagement from "./AnnouncementsManagement";

export const metadata = { title: "Announcements | Admin" };

export default async function AnnouncementsPage() {
  const [admin, supabase] = await Promise.all([getCurrentUser(), createSupabaseServerClient()]);
  if (!admin || admin.role !== "admin") redirect("/auth/login");

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, body, created_at, users(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">
          Communication
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[#0b3a2c] sm:text-[2rem]">
          Announcements
        </h1>
        <p className="mt-1 text-sm font-medium text-gray-500 sm:text-base">
          Post messages to all guides. They appear in the guide mobile app.
        </p>
      </div>
      <AnnouncementsManagement initialAnnouncements={announcements ?? []} adminId={admin.id} />
    </div>
  );
}
