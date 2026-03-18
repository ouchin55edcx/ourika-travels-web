import { getGalleryImages } from "@/app/actions/gallery";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import GalleryManagement from "./GalleryManagement";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings | Admin" };

export default async function AdminParamsPage() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== "admin") redirect("/auth/login");

  const slots = await getGalleryImages();

  return <GalleryManagement initialSlots={slots} />;
}
