"use client";

import React, { useRef, useState, useEffect } from "react";
import { Download, Printer, QrCode, Ticket, Info, Star, ShieldCheck } from "lucide-react";

interface TicketData {
  companyName: string;
  experienceTitle: string;
  bookingRef: string;
  date: string;
  departureTime: string;
  guests: string;
  quadRideDuration: string;
  camelRide: string;
  price: string;
  currency: string;
  importantInfo?: string[];
}

const templates = [
  {
    id: "royal",
    name: "Royal Mirage (Teal & Gold)",
    primaryColor: "#004d40",
    accentColor: "#bda27e",
    bgColor: "#f5f0e6",
  },
  {
    id: "sahara",
    name: "Saharan Sands (Ochre & Cream)",
    primaryColor: "#8d6e63",
    accentColor: "#d4af37",
    bgColor: "#fff8e1",
  },
  {
    id: "atlas",
    name: "Atlas Mist (Blue & Silver)",
    primaryColor: "#1a237e",
    accentColor: "#c0c0c0",
    bgColor: "#f5f5f5",
  },
];

export default function LuxuryTicketGenerator() {
  const [ticketData, setTicketData] = useState<TicketData>({
    companyName: "Ourika Travels",
    experienceTitle: "Dinner Show in Agafay Desert",
    bookingRef: "OT45987",
    date: "15th March 2024",
    departureTime: "3:00 PM",
    guests: "2 Adults",
    quadRideDuration: "1 Hour",
    camelRide: "Sunset Trek",
    price: "290",
    currency: "USD",
    importantInfo: [
      "Please bring comfortable clothing and closed shoes.",
      "Safety briefing and helmets provided.",
      "Dinner & Live Show included.",
    ],
  });

  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const generateQrCode = async () => {
      setIsGenerating(true);
      try {
        const QRCode = (await import("qrcode")).default;
        const url = await QRCode.toDataURL(ticketData.bookingRef);
        if (isMounted) {
          setQrCodeUrl(url);
        }
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    };
    generateQrCode();
    return () => {
      isMounted = false;
    };
  }, [ticketData.bookingRef]);

  const downloadPNG = async () => {
    if (!ticketRef.current) return;
    setIsGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `Ticket_${ticketData.bookingRef}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    setIsGenerating(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket_${ticketData.bookingRef}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicketData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 xl:flex-row">
        {/* Settings Panel */}
        <div className="space-y-6 xl:w-1/3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-black">
              <Ticket className="h-6 w-6 text-emerald-600" />
              Ticket Generator
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold tracking-widest text-slate-500 uppercase">
                  Select Template
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTemplate(t)}
                      className={`flex items-center justify-between rounded-xl border-2 p-3 transition-all ${activeTemplate.id === t.id ? "border-emerald-600 bg-emerald-50" : "border-transparent bg-slate-50 hover:bg-slate-100"}`}
                    >
                      <span className="text-sm font-bold">{t.name}</span>
                      <div className="flex gap-1">
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: t.primaryColor }}
                        />
                        <div
                          className="h-4 w-4 rounded-full"
                          style={{ backgroundColor: t.accentColor }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-bold text-slate-400">
                    Experience Title
                  </label>
                  <input
                    name="experienceTitle"
                    value={ticketData.experienceTitle}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Booking Ref</label>
                  <input
                    name="bookingRef"
                    value={ticketData.bookingRef}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Date</label>
                  <input
                    name="date"
                    value={ticketData.date}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Time</label>
                  <input
                    name="departureTime"
                    value={ticketData.departureTime}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Guests</label>
                  <input
                    name="guests"
                    value={ticketData.guests}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Quad Ride</label>
                  <input
                    name="quadRideDuration"
                    value={ticketData.quadRideDuration}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-400">Camel Ride</label>
                  <input
                    name="camelRide"
                    value={ticketData.camelRide}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium"
                  />
                </div>
                <div className="col-span-2 flex gap-4">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs font-bold text-slate-400">Price</label>
                    <input
                      name="price"
                      value={ticketData.price}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium"
                    />
                  </div>
                  <div className="w-24">
                    <label className="mb-1 block text-xs font-bold text-slate-400">Currency</label>
                    <input
                      name="currency"
                      value={ticketData.currency}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={downloadPNG}
                disabled={isGenerating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black p-3 font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-4 w-4" /> PNG
              </button>
              <button
                onClick={downloadPDF}
                disabled={isGenerating}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 p-3 font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Printer className="h-4 w-4" /> PDF
              </button>
            </div>
            {isGenerating && (
              <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-600">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
                Loading export libraries...
              </div>
            )}
          </div>
        </div>

        {/* Ticket Preview */}
        <div className="flex min-h-[600px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-200/50 p-4 md:p-12 xl:w-2/3">
          <div
            ref={ticketRef}
            className="relative flex h-[450px] w-[900px] overflow-hidden rounded-r-3xl shadow-2xl"
            style={{
              backgroundColor: activeTemplate.bgColor,
              borderRadius: "20px 0 0 20px",
            }}
          >
            {/* Main Section */}
            <div className="relative flex flex-1 flex-col overflow-hidden p-10">
              {/* Pattern Background Overlay */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                }}
              />

              {/* Elegant Border */}
              <div
                className="pointer-events-none absolute inset-4 rounded-xl border-2 border-double"
                style={{ borderColor: `${activeTemplate.accentColor}33` }}
              />

              {/* Corner Ornaments */}
              <div
                className="pointer-events-none absolute top-6 left-6 h-8 w-8"
                style={{
                  borderTop: `2px solid ${activeTemplate.accentColor}`,
                  borderLeft: `2px solid ${activeTemplate.accentColor}`,
                }}
              />
              <div
                className="pointer-events-none absolute top-6 right-6 h-8 w-8"
                style={{
                  borderTop: `2px solid ${activeTemplate.accentColor}`,
                  borderRight: `2px solid ${activeTemplate.accentColor}`,
                }}
              />
              <div
                className="pointer-events-none absolute bottom-6 left-6 h-8 w-8"
                style={{
                  borderBottom: `2px solid ${activeTemplate.accentColor}`,
                  borderLeft: `2px solid ${activeTemplate.accentColor}`,
                }}
              />
              <div
                className="pointer-events-none absolute right-6 bottom-6 h-8 w-8"
                style={{
                  borderBottom: `2px solid ${activeTemplate.accentColor}`,
                  borderRight: `2px solid ${activeTemplate.accentColor}`,
                }}
              />

              <div className="relative mb-8 text-center">
                <p
                  className="text-3xl tracking-wide italic"
                  style={{
                    color: activeTemplate.accentColor,
                    fontFamily: "serif",
                  }}
                >
                  {ticketData.companyName}
                </p>
                <div className="mx-auto my-2 h-px w-32 bg-slate-300 opacity-50" />
                <h1
                  className="text-5xl font-black tracking-tight uppercase"
                  style={{ color: activeTemplate.primaryColor }}
                >
                  {ticketData.experienceTitle.split("with")[0]}
                </h1>
                {ticketData.experienceTitle.includes("with") && (
                  <p className="mt-1 text-sm font-bold tracking-widest text-slate-400 uppercase">
                    with {ticketData.experienceTitle.split("with")[1]}
                  </p>
                )}
              </div>

              <div className="relative z-10 grid grid-cols-2 gap-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="w-24 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Booking Ref
                    </div>
                    <div className="text-lg font-bold text-slate-800">{ticketData.bookingRef}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-24 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Date
                    </div>
                    <div className="text-lg font-bold text-slate-800">{ticketData.date}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-24 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Quad Ride
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {ticketData.quadRideDuration}
                    </div>
                  </div>
                  <div className="mt-2 pt-4">
                    <div className="mb-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Price
                    </div>
                    <div
                      className="text-4xl font-black"
                      style={{ color: activeTemplate.primaryColor }}
                    >
                      ${ticketData.price}{" "}
                      <span className="text-lg font-bold tracking-tighter uppercase opacity-50">
                        {ticketData.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-l border-slate-200 pl-10">
                  <div className="flex items-center gap-6">
                    <div className="w-24 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Departure
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {ticketData.departureTime}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-24 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Guests
                    </div>
                    <div className="text-lg font-bold text-slate-800">{ticketData.guests}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-24 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Camel Ride
                    </div>
                    <div className="text-lg font-bold text-slate-800">{ticketData.camelRide}</div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <div className="relative rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                      {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="h-20 w-20" />}
                      <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-tighter whitespace-nowrap text-slate-400 uppercase">
                        Scan for details
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex gap-4">
                <div
                  className="flex flex-1 items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 p-3 text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${activeTemplate.primaryColor}, #1a1a1a)`,
                  }}
                >
                  <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                  <span className="text-sm font-black tracking-widest uppercase">
                    Boarding Pass
                  </span>
                </div>
                <div
                  className="flex flex-1 items-center justify-center gap-3 rounded-xl border-2 bg-white p-3"
                  style={{ borderColor: activeTemplate.accentColor }}
                >
                  <ShieldCheck className="h-4 w-4" style={{ color: activeTemplate.accentColor }} />
                  <span
                    className="text-sm font-black tracking-widest uppercase"
                    style={{ color: activeTemplate.accentColor }}
                  >
                    VIP Access Included
                  </span>
                </div>
              </div>
            </div>

            {/* Side Info Section */}
            <div
              className="relative flex w-72 flex-col p-8 text-center text-white"
              style={{ backgroundColor: activeTemplate.primaryColor }}
            >
              {/* Perforated Line Effect */}
              <div
                className="absolute top-0 bottom-0 left-0 z-20 w-px border-l-4 border-dashed opacity-30"
                style={{
                  borderImage: "linear-gradient(to bottom, transparent 3px, black 3px) 1 100%",
                }}
              />

              <div className="mt-4 mb-2">
                <div className="group relative mx-auto mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/5 shadow-2xl">
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span
                    className="text-2xl font-black tracking-tighter"
                    style={{ color: activeTemplate.accentColor }}
                  >
                    OT
                  </span>
                </div>
                <div className="mx-auto h-0.5 w-12 bg-white/20" />
              </div>

              <h3 className="my-8 flex items-center justify-center gap-2 text-xs font-black tracking-widest uppercase">
                <span className="h-px w-4 bg-white/20" />
                Important Information
                <span className="h-px w-4 bg-white/20" />
              </h3>

              <div className="relative z-10 flex-1 space-y-6 text-left">
                {(ticketData.importantInfo || []).map((info, idx) => (
                  <div
                    key={idx}
                    className="animate-in slide-in-from-right flex items-start gap-3 duration-500"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div
                      className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: activeTemplate.accentColor }}
                    />
                    <p className="text-[11px] leading-relaxed font-bold opacity-90">{info}</p>
                  </div>
                ))}
              </div>

              <div className="mt-auto opacity-30 grayscale invert">
                <img
                  src="https://www.transparenttextures.com/patterns/az-subtle.png"
                  className="w-full"
                  alt="decoration"
                />
              </div>

              <div className="absolute right-0 bottom-6 left-0">
                <Star className="mx-auto h-4 w-4 text-emerald-400 opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,900;1,400;1,900&display=swap");
      `}</style>
    </div>
  );
}
