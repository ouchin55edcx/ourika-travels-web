"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BarChart3, TrendingUp, Clock, DollarSign, AlertCircle } from "lucide-react";

type Guide = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  guide_order: number | null;
  guide_active: boolean | null;
  is_verified: boolean | null;
  specialties: string[] | null;
};

type DailyRecord = {
  guide_id: string;
  record_date: string;
  trip_count: number;
  completed_trips: number;
  cancelled_trips: number;
  no_show_trips: number;
  total_earnings: number;
  total_amount: number;
  is_absent: boolean;
  absent_reason?: string;
};

export default function DailyRecordsTab({ guides: initialGuides }: { guides: Guide[] }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyRecords();
  }, [selectedDate]);

  async function fetchDailyRecords() {
    setLoading(true);
    try {
      // Fetch daily records from your API or database
      // For now, we'll show a placeholder structure
      setDailyRecords([]);
    } catch (error) {
      console.error("Error fetching daily records:", error);
    } finally {
      setLoading(false);
    }
  }

  const totalTrips = dailyRecords.reduce((sum, r) => sum + r.trip_count, 0);
  const totalEarnings = dailyRecords.reduce((sum, r) => sum + r.total_earnings, 0);
  const totalAmount = dailyRecords.reduce((sum, r) => sum + r.total_amount, 0);
  const absentCount = dailyRecords.filter((r) => r.is_absent).length;

  const getGuideInfo = (guideId: string) => initialGuides.find((g) => g.id === guideId);

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-semibold text-[#0b3a2c]">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-[#00ef9d] focus:outline-none"
        />
      </div>

      {/* Daily Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Trips</p>
          <p className="mt-1 text-2xl font-black text-[#0b3a2c]">{totalTrips}</p>
          <p className="mt-1 text-xs text-gray-400">for {selectedDate}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Earnings</p>
          <p className="mt-1 text-2xl font-black text-green-600">{totalEarnings} DH</p>
          <p className="mt-1 text-xs text-gray-400">guide payments</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Amount</p>
          <p className="mt-1 text-2xl font-black text-blue-600">{totalAmount} DH</p>
          <p className="mt-1 text-xs text-gray-400">trip revenue</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase">Absent</p>
          <p className="mt-1 text-2xl font-black text-amber-600">{absentCount}</p>
          <p className="mt-1 text-xs text-gray-400">guides absent</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-2xl border border-[#d0ede0] bg-[#edf7f1] px-5 py-4 text-sm font-medium text-[#0b3a2c]">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>
            Daily records are automatically updated when trips are completed. View trip count, earnings,
            and guide absences for each day.
          </p>
        </div>
      </div>

      {/* Daily Records Table */}
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-400">Loading records...</p>
          </div>
        ) : dailyRecords.length === 0 ? (
          <div className="py-20 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-lg font-black text-gray-300">No records for this date</p>
            <p className="mt-1 text-sm text-gray-400">
              Daily records will appear here after trips are completed
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
              <div className="col-span-3">Guide</div>
              <div className="col-span-2">Trips</div>
              <div className="col-span-2">Completed</div>
              <div className="col-span-2">Earnings</div>
              <div className="col-span-3">Status</div>
            </div>

            {dailyRecords.map((record) => {
              const guide = getGuideInfo(record.guide_id);
              return (
                <div
                  key={record.guide_id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Guide Info */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0b3a2c]">
                      {guide?.avatar_url ? (
                        <Image
                          src={guide.avatar_url}
                          alt=""
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-black text-white text-sm">
                          {guide?.full_name?.charAt(0) || "G"}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-[#0b3a2c]">{guide?.full_name || "Unknown"}</p>
                  </div>

                  {/* Trips */}
                  <div className="col-span-2">
                    <p className="text-lg font-black text-[#0b3a2c]">{record.trip_count}</p>
                  </div>

                  {/* Completed */}
                  <div className="col-span-2">
                    <p className="text-lg font-black text-green-600">{record.completed_trips}</p>
                  </div>

                  {/* Earnings */}
                  <div className="col-span-2">
                    <p className="text-lg font-black text-blue-600">{record.total_earnings} DH</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-3 flex items-center gap-2">
                    {record.is_absent ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                        <AlertCircle className="h-3 w-3" /> Absent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#00ef9d]/20 px-3 py-1 text-xs font-semibold text-[#0b3a2c]">
                        <TrendingUp className="h-3 w-3" /> Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Export Option */}
      <div className="flex justify-end gap-2">
        <button className="rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50">
          Export CSV
        </button>
        <button className="rounded-full bg-[#0b3a2c] px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-[#0b3a2c]/90">
          Print Report
        </button>
      </div>
    </div>
  );
}
