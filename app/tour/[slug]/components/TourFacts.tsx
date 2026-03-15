import { Users, Clock3, CircleAlert, Smartphone, Globe, Languages } from "lucide-react";

type Props = {
  duration: string;
  maxGroupSize: number;
  minAge: number;
  maxAge: number;
  startTime: string | null;
  mobileTicket: boolean;
  liveGuideLanguages: string[];
  audioGuideLanguages: string[];
  writtenGuideLanguages: string[];
};

export default function TourFacts({
  duration,
  maxGroupSize,
  minAge,
  maxAge,
  startTime,
  mobileTicket,
  liveGuideLanguages,
  audioGuideLanguages,
  writtenGuideLanguages,
}: Props) {
  const facts = [
    { icon: Users, text: `Ages ${minAge}–${maxAge}, max of ${maxGroupSize} per group` },
    { icon: Clock3, text: `Duration: ${duration}` },
    { icon: CircleAlert, text: `Start time: ${startTime || 'Check availability'}` },
    ...(mobileTicket ? [{ icon: Smartphone, text: 'Mobile ticket' }] : []),
    ...(liveGuideLanguages.length > 0
      ? [{ icon: Globe, text: `Live guide: ${liveGuideLanguages.join(', ')}` }]
      : []),
    ...(audioGuideLanguages.length > 0
      ? [{ icon: Languages, text: `Audio guide: ${audioGuideLanguages.join(', ')}` }]
      : []),
    ...(writtenGuideLanguages.length > 0
      ? [{ icon: CircleAlert, text: `Written guide: ${writtenGuideLanguages.join(', ')}` }]
      : []),
  ];

  return (
    <section className="max-w-[760px] border-t border-[#e5e7eb] py-6">
      <div className="space-y-3">
        {facts.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-start gap-3 text-[14px] text-[#1f1f1f] sm:text-[15px]"
          >
            <Icon className="mt-1 h-4 w-4 shrink-0 text-[#123d2f]" />
            <p className="leading-6 sm:leading-7">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
