"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Tab = "overview" | "treks" | "bookings" | "profile";

type Props = {
  overviewContent: ReactNode;
  treksContent: ReactNode;
  bookingsContent: ReactNode;
  profileContent: ReactNode;
};

export default function DashboardTabs({
  overviewContent,
  treksContent,
  bookingsContent,
  profileContent,
}: Props) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  // Sync with URL parameter
  useEffect(() => {
    const tab = searchParams.get("tab") as Tab;
    if (tab && ["overview", "treks", "bookings", "profile"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="animate-in fade-in duration-300">
      {activeTab === "overview" && overviewContent}
      {activeTab === "treks" && treksContent}
      {activeTab === "bookings" && bookingsContent}
      {activeTab === "profile" && profileContent}
    </div>
  );
}
