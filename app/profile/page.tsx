import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/profile");
  }

  const displayName = user.full_name?.trim() || user.email;
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-[#f6f7f5] selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-xl">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={displayName}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#004f32] text-2xl font-bold text-white">
                {initials || "U"}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-semibold text-[#004f32]">{displayName}</h1>
              <p className="mt-1 text-sm text-slate-600">{user.email}</p>
              <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#004f32]">Contact</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Email</span>
                <span className="font-semibold text-slate-800">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Phone</span>
                <span className="font-semibold text-slate-800">{user.phone || "Not provided"}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#004f32]">Profile</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Full name</span>
                <span className="font-semibold text-slate-800">{user.full_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <span className="font-semibold text-slate-800">
                  {user.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Email verified</span>
                <span className="font-semibold text-slate-800">
                  {user.email_verified ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-[#004f32]">Bio</h2>
          <p className="mt-3 text-sm text-slate-600">
            {user.bio || "Tell travelers a little about yourself."}
          </p>
        </div>

        {user.role === "guide" ? (
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-[#004f32]">Guide tools</h2>
            <p className="mt-3 text-sm text-slate-600">
              Jump into your guide dashboard or preview the public-facing profile.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/dashboard/guide"
                className="rounded-full bg-[#004f32] px-5 py-2 text-sm font-semibold text-white shadow-sm"
              >
                Guide dashboard
              </Link>
              <Link
                href="/dashboard/guide/profile"
                className="rounded-full border border-[#004f32]/20 bg-white px-5 py-2 text-sm font-semibold text-[#004f32]"
              >
                Guide profile
              </Link>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
