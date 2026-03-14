import { CalendarCheck, Compass, Ticket, TrendingUp, UsersRound } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";

const stats = [
  { label: "Active treks", value: "32", change: "+4 this week", icon: Compass },
  { label: "Bookings today", value: "18", change: "+12% vs yesterday", icon: Ticket },
  { label: "New travelers", value: "56", change: "+8% this month", icon: UsersRound },
  { label: "Revenue", value: "$12.4k", change: "+15% vs last week", icon: TrendingUp },
];

const tasks = [
  { title: "Review new trek submissions", detail: "4 pending approvals" },
  { title: "Confirm tomorrow's guides", detail: "3 guides need confirmation" },
  { title: "Reply to open support tickets", detail: "5 messages waiting" },
];

const recentBookings = [
  {
    traveler: "Ava Martinez",
    trek: "Atlas Sunrise Trek",
    date: "Mar 12, 2026",
    status: "Confirmed",
  },
  {
    traveler: "Youssef El Idrissi",
    trek: "Ourika Waterfalls",
    date: "Mar 12, 2026",
    status: "Pending",
  },
  { traveler: "Hanna Becker", trek: "Berber Village Walk", date: "Mar 11, 2026", status: "Paid" },
];

export default async function AdminOverviewPage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-6 rounded-[2.5rem] border border-black/5 bg-white p-8 shadow-sm sm:p-10">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-500">Overview</p>
          <h1 className="text-3xl font-black text-[#0b3a2c] sm:text-4xl">
            Welcome back, {user?.full_name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="max-w-2xl text-base font-medium text-gray-500">
            Everything you need to keep treks, bookings, and travelers moving. Start with the quick
            actions or review today&apos;s updates.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-[#0b3a2c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
            Create new trek
          </button>
          <button className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700">
            Send update to guides
          </button>
          <button className="rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700">
            Export bookings
          </button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-start gap-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b3a2c]/10 text-[#0b3a2c]">
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500">{stat.label}</p>
              <p className="text-2xl font-black text-[#0b3a2c]">{stat.value}</p>
              <p className="text-xs font-semibold text-emerald-600">{stat.change}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500">Today</p>
              <h2 className="text-2xl font-black text-[#0b3a2c]">Recent bookings</h2>
            </div>
            <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={`${booking.traveler}-${booking.trek}`}
                className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-[#f7f9f8] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800">{booking.traveler}</p>
                  <p className="text-xs font-semibold text-gray-500">{booking.trek}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                    <CalendarCheck className="h-4 w-4" />
                    {booking.date}
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#0b3a2c] shadow-sm">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500">Focus</p>
            <h2 className="text-2xl font-black text-[#0b3a2c]">Priority tasks</h2>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.title} className="rounded-2xl border border-black/5 bg-[#f7f9f8] p-4">
                <p className="text-sm font-semibold text-gray-800">{task.title}</p>
                <p className="text-xs font-semibold text-gray-500">{task.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

