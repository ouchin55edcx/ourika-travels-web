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
    { icon: Users, text: `De ${minAge} a ${maxAge} años, máximo ${maxGroupSize} personas por grupo` },
    { icon: Clock3, text: `Duración: ${duration}` },
    { icon: CircleAlert, text: `Hora de inicio: ${startTime || "consulta disponibilidad"}` },
    ...(mobileTicket ? [{ icon: Smartphone, text: "Entrada digital" }] : []),
    ...(liveGuideLanguages.length > 0
      ? [{ icon: Globe, text: `Guía en directo: español, francés, árabe` }]
      : []),
    ...(audioGuideLanguages.length > 0
      ? [{ icon: Languages, text: `Audio guide: ${audioGuideLanguages.join(", ")}` }]
      : []),
    ...(writtenGuideLanguages.length > 0
      ? [{ icon: CircleAlert, text: `Written guide: ${writtenGuideLanguages.join(", ")}` }]
      : []),
  ];

  return (
    <section id="details" className="max-w-[760px] border-t border-[#e5e7eb] py-6">
      <div className="space-y-3">
        {facts.map(({ icon: Icon, text }) => (
          <div
            key={text}
            className="flex items-start gap-3 text-[14px] text-[#1f1f1f] sm:text-[15px]"
          >
            <Icon className="mt-1 h-4 w-4 shrink-0 text-[#12355B]" />
            <p className="leading-6 sm:leading-7">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
