import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import SettingsForm from "./SettingsForm";
import GalleryManagement from "./GalleryManagement";
import { getGalleryImages } from "@/app/actions/gallery";

export const metadata: Metadata = { title: "General Settings | Admin" };

export default async function GeneralSettingsPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const [user, supabase] = await Promise.all([getCurrentUser(), createSupabaseServerClient()]);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeTab = resolvedSearchParams?.tab === "gallery" ? "gallery" : "general";

  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const [{ data: settings }, galleryImages] = await Promise.all([
    supabase
      .from("general_settings")
      .select("key, value")
      .in("key", ["site_logo_url", "site_name"]),
    getGalleryImages(),
  ]);

  const settingsObj =
    settings?.reduce(
      (acc, s) => {
        acc[s.key] = s.value;
        return acc;
      },
      {} as Record<string, string | null>,
    ) || {};

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-gray-500">Admin</p>
        <h1 className="text-3xl font-black text-[#0b3a2c] sm:text-[2rem]">General Settings</h1>
        <p className="mt-1 max-w-2xl text-sm font-medium text-gray-500 sm:text-base">
          Manage your site-wide settings and branding.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/dashboard/params"
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "general"
              ? "bg-[#0b3a2c] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#0b3a2c]"
          }`}
        >
          General
        </Link>
        <Link
          href="/admin/dashboard/params?tab=gallery"
          className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
            activeTab === "gallery"
              ? "bg-[#0b3a2c] text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:border-[#0b3a2c]"
          }`}
        >
          Gallery
        </Link>
      </div>

      {activeTab === "general" ? (
        <SettingsForm initialSettings={settingsObj} />
      ) : (
        <GalleryManagement initialSlots={galleryImages} showHeader={false} />
      )}
    </div>
  );
}
