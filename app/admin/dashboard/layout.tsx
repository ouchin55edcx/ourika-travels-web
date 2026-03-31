import type { ReactNode } from "react";
import type { Metadata } from "next";
import AdminHeader from "./components/AdminHeader";
import { headers } from "next/headers";

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
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isWizard =
    pathname.includes("/treks/new") || (pathname.includes("/treks/") && pathname.includes("/edit"));

  return (
    <div data-admin-dashboard className="relative min-h-screen bg-[#f5f7f6] pb-20 lg:pb-0">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(0,239,157,0.16),_transparent_60%)]" />
      {!isWizard && <AdminHeader />}
      <main
        className={`relative ${isWizard ? "w-full p-0" : "mx-auto w-full max-w-[1440px] px-4 pt-5 pb-16 sm:px-6 lg:px-8 lg:pt-8"}`}
      >
        {children}
      </main>
    </div>
  );
}
