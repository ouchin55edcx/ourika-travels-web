import type { ReactNode } from "react";
import type { Metadata } from "next";
import GuideHeader from "./components/GuideHeader";

export const metadata: Metadata = {
  title: "Guide Dashboard | Manage Your Local Experiences",
  description:
    "The central hub for Ourika Valley local experts. Track your upcoming treks, manage traveler bookings, and update your guide profile.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GuideDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f5f7f4] pb-20 text-slate-900 md:pb-0">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(0,79,50,0.18),_transparent_60%)]" />
      <GuideHeader />
      <main className="relative mx-auto w-full max-w-6xl px-4 pt-6 pb-16 md:px-6 md:pt-10 md:pb-16">
        {children}
      </main>
    </div>
  );
}
