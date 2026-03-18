import { CheckCircle2, XCircle, Zap } from "lucide-react";

type Props = {
  highlights: string[];
  included: string[];
  not_included: string[];
  services: string[];
};

export default function TourHighlights({ highlights, included, not_included, services }: Props) {
  return (
    <section className="max-w-[760px] space-y-10 border-t border-[#e5e7eb] py-8">
      {/* 1. Highlights */}
      <div>
        <h3 className="mb-4 text-2xl leading-tight font-black text-[#111827] md:text-[28px]">
          Highlights
        </h3>
        <ul className="grid gap-3">
          {highlights.filter(Boolean).map((h, i) => (
            <li key={i} className="flex items-start gap-3 py-1 text-[15px] text-[#1f1f1f]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00aa6c]" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* 2. Two-column grid (included vs not_included) */}
      <div className="grid grid-cols-1 gap-8 pt-4 md:grid-cols-2">
        <div>
          <h4 className="mb-4 text-xs font-black tracking-widest text-[#111827] uppercase">
            What's included
          </h4>
          <ul className="space-y-3">
            {included.filter(Boolean).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-[#1f1f1f]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00aa6c]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-xs font-black tracking-widest text-[#111827] uppercase">
            Not included
          </h4>
          <ul className="space-y-3">
            {not_included.filter(Boolean).map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-[#1f1f1f]">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Services */}
      <div className="pt-4">
        <h4 className="mb-4 text-xs font-black tracking-widest text-[#111827] uppercase">
          Services
        </h4>
        <div className="flex flex-wrap gap-2">
          {services.filter(Boolean).map((s, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#d0ede0] bg-[#edf7f1] px-3 py-1.5 text-[13px] font-semibold text-[#0b3a2c]"
            >
              <Zap className="h-3 w-3" /> {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
