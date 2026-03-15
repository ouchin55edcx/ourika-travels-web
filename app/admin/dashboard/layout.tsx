import type { ReactNode } from "react";
import type { Metadata } from "next";
import AdminHeader from "./components/AdminHeader";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: {
    template: "%s | Ourika Admin",
    default: "Admin Dashboard | Ourika Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isWizard = pathname.includes('/treks/new') || (pathname.includes('/treks/') && pathname.includes('/edit'));

  return (
    <div className="relative min-h-screen bg-[#f5f7f6]">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(0,239,157,0.16),_transparent_60%)]" />
      {!isWizard && <AdminHeader user={user} />}
      <main className={`relative ${isWizard ? 'w-full p-0' : 'mx-auto w-full max-w-6xl px-6 pt-10 pb-16'}`}>
        {children}
      </main>
    </div>
  );
}

