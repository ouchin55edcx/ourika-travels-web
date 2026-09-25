import { MessageSquare, ShieldCheck, WalletCards, CalendarDays } from "lucide-react";
import Link from "next/link";
import { BASE_URL, WHATSAPP_PHONE } from "@/lib/config";

type Props = {
  trekSlug: string;
  trekTitle: string;
  price: number;
  previousPrice: number | null;
  freeCancellationHours: number;
  reserveNowPayLater: boolean;
  avgBookingLeadDays: number | null;
};

export default function TourBookingCard({
  trekSlug,
  trekTitle,
  price,
  previousPrice,
  freeCancellationHours,
  reserveNowPayLater,
  avgBookingLeadDays,
}: Props) {
  const whatsappPhone = WHATSAPP_PHONE.replace(/\D/g, "");
  const whatsappMessage = `Hi! I want to reserve "${trekTitle}". ${BASE_URL}/tour/${trekSlug}`;
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`
    : "";

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Cancelación gratuita",
      description: `Cancelación gratuita hasta ${freeCancellationHours}h antes del inicio.`,
    },
    ...(reserveNowPayLater
      ? [
          {
            icon: WalletCards,
            title: "Reserva ahora y paga después",
            description: "Asegura tu plaza con total flexibilidad.",
          },
        ]
      : []),
    ...(avgBookingLeadDays
      ? [
          {
            icon: CalendarDays,
            title: "Book ahead",
            description: `This is booked ${avgBookingLeadDays} days in advance on average.`,
          },
        ]
      : []),
  ];

  return (
    <aside className="self-start lg:sticky lg:top-5">
      <div className="rounded-2xl border border-[#d9d9d9] bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:p-5">
        <div className="mb-1 flex flex-wrap items-baseline gap-1">
          <span className="text-[15px] font-semibold text-[#1f1f1f]">Desde</span>
          <div className="flex flex-col">
            {previousPrice && (
              <span className="text-sm text-gray-400 line-through">
                €{previousPrice.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
              </span>
            )}
            <span className="text-[28px] font-extrabold tracking-[-0.03em] text-[#1f1f1f] sm:text-[32px]">
              €{price.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <span className="text-sm text-[#5f6368]">por adulto</span>
        </div>
        <button className="mb-4 text-sm font-semibold text-[#333] underline underline-offset-2">
          Mejor precio garantizado
        </button>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <Link
            href={`/reservation?trek=${trekSlug}&type=group`}
            className="rounded-full border-2 border-[#12355B] px-4 py-2.5 text-center text-sm font-bold text-[#12355B] transition-all hover:bg-[#edf7f1]"
          >
            Unirse al grupo
          </Link>
          <Link
            href={`/reservation?trek=${trekSlug}&type=private`}
            className="rounded-full bg-[#12355B] px-4 py-2.5 text-center text-sm font-bold text-white transition-all hover:bg-[#0f3d24]"
          >
            Reservar en privado
          </Link>
        </div>

        <Link
          href={`/reservation?trek=${trekSlug}`}
          className="mb-6 block min-h-12 w-full rounded-full bg-[#F26B21] px-5 py-4 text-center text-[16px] font-bold text-white transition hover:bg-[#d95b18] sm:text-[17px]"
        >
          Comprobar disponibilidad
        </Link>
        {whatsappUrl ? (
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 block min-h-12 w-full rounded-full border-2 border-[#12355B] px-5 py-4 text-center text-[15px] font-bold text-[#12355B] transition hover:bg-[#edf7f1]"
          >
            Reservar por WhatsApp
          </Link>
        ) : null}

        <div className="space-y-5">
          {benefits.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f1f32b] text-[#12355B]">
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

      <div className="mt-4 rounded-2xl bg-[#f6f6f6] p-4 sm:p-5">
        <p className="inline-block bg-[#dedede] px-1 text-[15px] font-semibold text-[#434343]">
          ¿Tienes dudas sobre la reserva?
        </p>
        {whatsappUrl ? (
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#12355B] underline underline-offset-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chatea ahora</span>
          </Link>
        ) : (
          <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#12355B] underline underline-offset-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chatea ahora</span>
          </button>
        )}
      </div>
    </aside>
  );
}
