import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/app/actions/categories";
import CategoryManagement from "./CategoryManagement";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience Categories",
  description: "Organize and manage experience categories to help travelers find their perfect trek.",
};


export default async function AdminCategoryPage() {
  const admin = await getCurrentUser();

  if (!admin || admin.role !== "admin") {
    redirect("/auth/login");
  }

  const categories = await getCategories();

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-bold uppercase tracking-wider text-[#0b3a2c]/60">Management</p>
        <h1 className="text-4xl font-black tracking-tight text-[#0b3a2c]">Experience Categories</h1>
        <p className="max-w-2xl text-lg font-medium text-gray-500">
          Define and organize the types of journeys you offer, making it easier for travelers to find their perfect match.
        </p>
      </div>

      <CategoryManagement initialCategories={categories} />
    </div>
  );
}

