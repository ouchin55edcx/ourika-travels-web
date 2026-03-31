import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/app/actions/categories";
import CategoryManagement from "./CategoryManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience Categories",
  description:
    "Organize and manage experience categories to help travelers find their perfect trek.",
};

export default async function AdminCategoryPage() {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "admin") {
    redirect("/auth/login");
  }

  const categories = await getCategories();

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-1.5">
        <p className="text-sm font-bold tracking-wider text-[#0b3a2c]/60 uppercase">Management</p>
        <h1 className="text-3xl font-black tracking-tight text-[#0b3a2c] sm:text-[2rem]">
          Experience Categories
        </h1>
        <p className="max-w-2xl text-sm font-medium text-gray-500 sm:text-base">
          Define and organize the types of journeys you offer, making it easier for travelers to
          find their perfect match.
        </p>
      </div>

      <CategoryManagement initialCategories={categories} />
    </div>
  );
}
