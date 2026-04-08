import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getCategories } from "@/app/actions/categories";

const TrekWizard = dynamic(() => import("@/app/admin/dashboard/treks/new/TrekWizard"), {
  loading: () => (
    <div className="min-h-screen bg-[#f5f7f6] p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-12 w-64 rounded-2xl bg-gray-200" />
        <div className="h-[70vh] rounded-[2rem] bg-white" />
      </div>
    </div>
  ),
});

export const metadata = { title: "Add New Trek | Guide Dashboard" };

export default async function GuideNewTrekPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/dashboard/guide/treks/new");
  }

  if (user.role !== "guide") {
    redirect("/auth/unauthorized");
  }

  if (!user.can_add_treks) {
    redirect("/dashboard/guide");
  }

  const categories = await getCategories();

  return (
    <TrekWizard
      categories={categories}
      listHref="/dashboard/guide"
      successHref="/dashboard/guide"
    />
  );
}
