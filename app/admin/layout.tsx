import type { ReactNode } from "react";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f5f7f6]">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(0,239,157,0.16),_transparent_60%)]" />
      <AdminHeader />
      <main className="relative mx-auto w-full max-w-6xl px-6 pt-10 pb-16">{children}</main>
    </div>
  );
}
