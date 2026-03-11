import { CalendarDays, Users } from "lucide-react";
import Link from "next/link";

export default function TourAvailabilityBar() {
  return (
    <section className="hidden border-t border-[#e5e7eb] pt-8 lg:block">
      <div className="rounded-[8px] bg-[#004f24] px-4 py-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-[22px] font-extrabold tracking-[-0.03em] sm:text-[26px]">
            Select date and travelers
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-[#111827]">
              <CalendarDays className="h-4 w-4" />
              <span>Enter date</span>
            </button>
            <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-semibold text-[#111827]">
              <Users className="h-4 w-4" />
              <span>Select Travelers</span>
            </button>
            <Link
              href="/reservation"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#00e05a] px-6 py-3 text-[15px] font-bold text-black"
            >
              Check availability
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
