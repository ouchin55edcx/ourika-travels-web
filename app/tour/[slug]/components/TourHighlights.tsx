import { CheckCircle2, XCircle, Zap } from "lucide-react";

type Props = {
  highlights: string[];
  included: string[];
  not_included: string[];
  services: string[];
};

export default function TourHighlights({ highlights, included, not_included, services }: Props) {
  return (
    <section className="max-w-[760px] border-t border-[#e5e7eb] py-8 space-y-10">
      {/* 1. Highlights */}
      <div>
        <h3 className="mb-4 text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
          Highlights
        </h3>
        <ul className="grid gap-3">
          {highlights.filter(Boolean).map((h, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-[#1f1f1f] py-1">
              <CheckCircle2 className="w-4 h-4 text-[#00aa6c] mt-0.5 shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Two-column grid (included vs not_included) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div>
          <h4 className="font-black text-[#111827] mb-4 uppercase tracking-widest text-xs">What's included</h4>
          <ul className="space-y-3">
            {included.filter(Boolean).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-[#1f1f1f]">
                <CheckCircle2 className="w-4 h-4 text-[#00aa6c] mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-black text-[#111827] mb-4 uppercase tracking-widest text-xs">Not included</h4>
          <ul className="space-y-3">
            {not_included.filter(Boolean).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-[#1f1f1f]">
                <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Services */}
      <div className="pt-4">
        <h4 className="font-black text-[#111827] mb-4 uppercase tracking-widest text-xs">Services</h4>
        <div className="flex flex-wrap gap-2">
          {services.filter(Boolean).map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 bg-[#f0faf5]
              text-[#0b3a2c] text-[13px] font-semibold px-3 py-1.5 rounded-full border
              border-[#d0ede0]">
              <Zap className="w-3 h-3" /> {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
