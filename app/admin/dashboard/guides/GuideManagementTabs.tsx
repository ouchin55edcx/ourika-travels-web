"use client";

import { useState } from "react";
import { Settings, Users, Package, BarChart3 } from "lucide-react";
import GuideOrderTab from "./tabs/GuideOrderTab";
import TripAssignmentTab from "./tabs/TripAssignmentTab";
import DailyRecordsTab from "./tabs/DailyRecordsTab";
import ParametersTab from "./tabs/ParametersTab";

type Guide = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  guide_order: number | null;
  guide_active: boolean | null;
  is_verified: boolean | null;
  can_add_treks: boolean | null;
  specialties: string[] | null;
  languages: string[] | null;
  is_active: boolean | null;
  verification_status?: string | null;
};

type Booking = {
  id: string;
  booking_ref: string;
  trek_date: string;
  trek_time: string;
  tourist_name: string;
  total_price: number;
  adults: number;
  children: number;
  payment_status: string;
  status: string;
};

type Assignment = {
  id: string;
  trip_id: string;
  guide_id: string;
  status: string;
  chauffeur_name?: string;
  assigned_at: string;
  completed_at?: string;
};

type Absence = {
  id: string;
  guide_id: string;
  absent_from: string;
  absent_until: string;
  reason?: string;
};

type GuideParameters = {
  id?: string;
  trip_fixed_amount: number;
  guide_payment_per_trip: number;
};

type Tab = "order" | "assignments" | "records" | "parameters";

export default function GuideManagementTabs({
  initialGuides,
  initialBookings,
  initialAssignments,
  initialAbsences,
  guideParameters,
}: {
  initialGuides: Guide[];
  initialBookings: Booking[];
  initialAssignments: Assignment[];
  initialAbsences: Absence[];
  guideParameters: GuideParameters;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("order");

  const tabs: {
    id: Tab;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: "order",
      label: "Guide Order",
      icon: <Users className="h-4 w-4" />,
      description: "Manage round-robin guide order and status",
    },
    {
      id: "assignments",
      label: "Trip Assignments",
      icon: <Package className="h-4 w-4" />,
      description: "Assign guides to trips and manage assignments",
    },
    {
      id: "records",
      label: "Daily Records",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "View daily trip counts and earnings",
    },
    {
      id: "parameters",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      description: "Global payment parameters",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="rounded-2xl border border-black/5 bg-white p-1 shadow-sm">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 rounded-xl px-4 py-3 text-xs font-semibold transition-all sm:flex-row sm:justify-center ${
                activeTab === tab.id
                  ? "bg-[#0b3a2c] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="h-4 w-4">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "order" && (
          <GuideOrderTab guides={initialGuides} absences={initialAbsences} />
        )}
        {activeTab === "assignments" && (
          <TripAssignmentTab
            guides={initialGuides}
            bookings={initialBookings}
            assignments={initialAssignments}
            absences={initialAbsences}
          />
        )}
        {activeTab === "records" && <DailyRecordsTab guides={initialGuides} />}
        {activeTab === "parameters" && (
          <ParametersTab initialParameters={guideParameters} />
        )}
      </div>
    </div>
  );
}
