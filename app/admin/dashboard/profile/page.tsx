import { getCurrentUser } from "@/lib/auth";
import ProfileForm from "./ProfileForm";
import { redirect } from "next/navigation";

export default async function AdminProfilePage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-[#0b3a2c]/60">Settings</p>
        <h1 className="mt-1 text-4xl font-black tracking-tight text-[#0b3a2c]">Admin Profile</h1>
        <p className="mt-3 text-lg font-medium text-gray-500">
          Manage your account information and preferences.
        </p>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-2xl shadow-black/[0.03]">
        <div className="mb-8 flex items-center gap-6 border-b border-gray-100 pb-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0b3a2c] text-2xl font-bold text-white shadow-xl shadow-[#0b3a2c]/20">
            {user.full_name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
            <p className="text-sm font-medium text-gray-400">{user.email}</p>
            <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 uppercase tracking-tighter">
              {user.role} Account
            </div>
          </div>
        </div>

        <ProfileForm user={user} />
      </div>
    </div>
  );
}

