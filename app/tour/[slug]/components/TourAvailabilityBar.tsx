import { CalendarDays, Users } from "lucide-react";

export default function TourAvailabilityBar() {
  return (
    <section className="border-t border-[#e5e7eb] pt-8">
      <div className="rounded-[8px] bg-[#004f24] px-5 py-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-[26px] font-extrabold tracking-[-0.03em]">
            Select date and travelers
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-[#111827]">
              <CalendarDays className="h-4 w-4" />
              <span>Enter date</span>
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-[#111827]">
              <Users className="h-4 w-4" />
              <span>Select Travelers</span>
            </button>
            <button className="inline-flex items-center justify-center rounded-full bg-[#00e05a] px-6 py-3 text-[15px] font-bold text-black">
              Check availability
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
