import { experienceFacts } from "./tourData";

export default function TourFacts() {
  return (
    <section className="max-w-[760px] border-t border-[#e5e7eb] py-6">
      <div className="space-y-3">
        {experienceFacts.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-start gap-3 text-[15px] text-[#1f1f1f]"
          >
            <Icon className="mt-1 h-4 w-4 shrink-0 text-[#123d2f]" />
            <p className="leading-7">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
