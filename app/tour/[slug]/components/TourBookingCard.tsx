import { MessageSquare } from "lucide-react";
import { bookingBenefits } from "./tourData";

export default function TourBookingCard() {
  return (
    <aside className="self-start lg:sticky lg:top-5">
      <div className="rounded-2xl border border-[#d9d9d9] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="mb-1 flex items-baseline gap-1">
          <span className="text-[15px] font-semibold text-[#1f1f1f]">From</span>
          <span className="text-[32px] font-extrabold tracking-[-0.03em] text-[#1f1f1f]">
            $17.60
          </span>
          <span className="text-sm text-[#5f6368]">per adult</span>
        </div>
        <button className="mb-5 text-sm font-semibold text-[#333] underline underline-offset-2">
          Lowest price guarantee
        </button>

        <button className="mb-6 w-full rounded-full bg-[#00e05a] px-5 py-4 text-[17px] font-bold text-black transition hover:bg-[#00cb52]">
          Check availability
        </button>

        <div className="space-y-5">
          {bookingBenefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1f32b] text-[#123d2f]">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-[14px] leading-6 text-[#444]">
                <span className="font-semibold text-[#1f1f1f]">{title}</span>
                <span> • {description}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#f6f6f6] p-5">
        <p className="inline-block bg-[#dedede] px-1 text-[15px] font-semibold text-[#434343]">
          Have booking questions?
        </p>
        <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#123d2f] underline underline-offset-2">
          <MessageSquare className="h-4 w-4" />
          <span>Chat now</span>
        </button>
      </div>
    </aside>
  );
}
