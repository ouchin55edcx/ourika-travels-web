import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ourika Travels Guide",
  description: "Professional local guide services in Ourika Valley, Morocco",
};

export default function GuidePublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-white">
      {children}
    </div>
  );
}
