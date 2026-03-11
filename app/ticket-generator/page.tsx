"use client";

import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
    { id: "royal", name: "Royal Mirage (Teal & Gold)", primaryColor: "#004d40", accentColor: "#bda27e", bgColor: "#f5f0e6" },
    { id: "sahara", name: "Saharan Sands (Ochre & Cream)", primaryColor: "#8d6e63", accentColor: "#d4af37", bgColor: "#fff8e1" },
    { id: "atlas", name: "Atlas Mist (Blue & Silver)", primaryColor: "#1a237e", accentColor: "#c0c0c0", bgColor: "#f5f5f5" },
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
    const ticketRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        QRCode.toDataURL(ticketData.bookingRef).then(setQrCodeUrl);
    }, [ticketData.bookingRef]);

    const downloadPNG = async () => {
        if (!ticketRef.current) return;
        const canvas = await html2canvas(ticketRef.current, { scale: 3, useCORS: true });
        const link = document.createElement("a");
        link.download = `Ticket_${ticketData.bookingRef}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    const downloadPDF = async () => {
        if (!ticketRef.current) return;
        const canvas = await html2canvas(ticketRef.current, { scale: 3, useCORS: true });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("l", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Ticket_${ticketData.bookingRef}.pdf`);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTicketData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
                {/* Settings Panel */}
                <div className="xl:w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                        <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-emerald-600" />
                            Ticket Generator
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Select Template</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {templates.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setActiveTemplate(t)}
                                            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${activeTemplate.id === t.id ? "border-emerald-600 bg-emerald-50" : "border-transparent bg-slate-50 hover:bg-slate-100"}`}
                                        >
                                            <span className="text-sm font-bold">{t.name}</span>
                                            <div className="flex gap-1">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.primaryColor }} />
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: t.accentColor }} />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">Experience Title</label>
                                    <input name="experienceTitle" value={ticketData.experienceTitle} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">Booking Ref</label>
                                    <input name="bookingRef" value={ticketData.bookingRef} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">Date</label>
                                    <input name="date" value={ticketData.date} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">Time</label>
                                    <input name="departureTime" value={ticketData.departureTime} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">Guests</label>
                                    <input name="guests" value={ticketData.guests} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">Quad Ride</label>
                                    <input name="quadRideDuration" value={ticketData.quadRideDuration} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 mb-1 block">Camel Ride</label>
                                    <input name="camelRide" value={ticketData.camelRide} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium" />
                                </div>
                                <div className="col-span-2 flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-slate-400 mb-1 block">Price</label>
                                        <input name="price" value={ticketData.price} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium" />
                                    </div>
                                    <div className="w-24">
                                        <label className="text-xs font-bold text-slate-400 mb-1 block">Currency</label>
                                        <input name="currency" value={ticketData.currency} onChange={handleInputChange} className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium uppercase" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button onClick={downloadPNG} className="flex-1 bg-black text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                                <Download className="w-4 h-4" /> PNG
                            </button>
                            <button onClick={downloadPDF} className="flex-1 bg-emerald-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
                                <Printer className="w-4 h-4" /> PDF
                            </button>
                        </div>
                    </div>
                </div>

                {/* Ticket Preview */}
                <div className="xl:w-2/3 flex items-center justify-center bg-slate-200/50 rounded-3xl p-4 md:p-12 border-2 border-dashed border-slate-300 min-h-[600px]">
                    <div
                        ref={ticketRef}
                        className="relative w-[900px] h-[450px] shadow-2xl flex overflow-hidden rounded-r-3xl"
                        style={{ backgroundColor: activeTemplate.bgColor, borderRadius: "20px 0 0 20px" }}
                    >
                        {/* Main Section */}
                        <div className="flex-1 p-10 relative overflow-hidden flex flex-col">
                            {/* Pattern Background Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"https://www.transparenttextures.com/patterns/cubes.png\")" }} />

                            {/* Elegant Border */}
                            <div className="absolute inset-4 border-2 border-double pointer-events-none rounded-xl" style={{ borderColor: `${activeTemplate.accentColor}33` }} />

                            {/* Corner Ornaments */}
                            <div className="absolute top-6 left-6 w-8 h-8 pointer-events-none" style={{ borderTop: `2px solid ${activeTemplate.accentColor}`, borderLeft: `2px solid ${activeTemplate.accentColor}` }} />
                            <div className="absolute top-6 right-6 w-8 h-8 pointer-events-none" style={{ borderTop: `2px solid ${activeTemplate.accentColor}`, borderRight: `2px solid ${activeTemplate.accentColor}` }} />
                            <div className="absolute bottom-6 left-6 w-8 h-8 pointer-events-none" style={{ borderBottom: `2px solid ${activeTemplate.accentColor}`, borderLeft: `2px solid ${activeTemplate.accentColor}` }} />
                            <div className="absolute bottom-6 right-6 w-8 h-8 pointer-events-none" style={{ borderBottom: `2px solid ${activeTemplate.accentColor}`, borderRight: `2px solid ${activeTemplate.accentColor}` }} />

                            <div className="relative text-center mb-8">
                                <p
                                    className="text-3xl italic tracking-wide"
                                    style={{ color: activeTemplate.accentColor, fontFamily: "serif" }}
                                >
                                    {ticketData.companyName}
                                </p>
                                <div className="h-px bg-slate-300 w-32 mx-auto my-2 opacity-50" />
                                <h1
                                    className="text-5xl font-black uppercase tracking-tight"
                                    style={{ color: activeTemplate.primaryColor }}
                                >
                                    {ticketData.experienceTitle.split('with')[0]}
                                </h1>
                                {ticketData.experienceTitle.includes('with') && (
                                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mt-1">
                                        with {ticketData.experienceTitle.split('with')[1]}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 text-[10px] font-black uppercase tracking-widest text-slate-400">Booking Ref</div>
                                        <div className="text-lg font-bold text-slate-800">{ticketData.bookingRef}</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</div>
                                        <div className="text-lg font-bold text-slate-800">{ticketData.date}</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 text-[10px] font-black uppercase tracking-widest text-slate-400">Quad Ride</div>
                                        <div className="text-lg font-bold text-slate-800">{ticketData.quadRideDuration}</div>
                                    </div>
                                    <div className="pt-4 mt-2">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Price</div>
                                        <div className="text-4xl font-black" style={{ color: activeTemplate.primaryColor }}>
                                            ${ticketData.price} <span className="text-lg font-bold opacity-50 uppercase tracking-tighter">{ticketData.currency}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 border-l border-slate-200 pl-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 text-[10px] font-black uppercase tracking-widest text-slate-400">Departure</div>
                                        <div className="text-lg font-bold text-slate-800">{ticketData.departureTime}</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 text-[10px] font-black uppercase tracking-widest text-slate-400">Guests</div>
                                        <div className="text-lg font-bold text-slate-800">{ticketData.guests}</div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 text-[10px] font-black uppercase tracking-widest text-slate-400">Camel Ride</div>
                                        <div className="text-lg font-bold text-slate-800">{ticketData.camelRide}</div>
                                    </div>

                                    <div className="pt-2 flex justify-end">
                                        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm relative">
                                            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />}
                                            <p className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-black tracking-tighter text-slate-400 whitespace-nowrap uppercase">Scan for details</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto flex gap-4">
                                <div className="flex-1 bg-slate-900 text-white rounded-xl flex items-center justify-center p-3 gap-3 border border-slate-700 shadow-lg" style={{ background: `linear-gradient(135deg, ${activeTemplate.primaryColor}, #1a1a1a)` }}>
                                    <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                                    <span className="font-black text-sm uppercase tracking-widest">Boarding Pass</span>
                                </div>
                                <div className="flex-1 bg-white border-2 rounded-xl flex items-center justify-center p-3 gap-3" style={{ borderColor: activeTemplate.accentColor }}>
                                    <ShieldCheck className="w-4 h-4" style={{ color: activeTemplate.accentColor }} />
                                    <span className="font-black text-sm uppercase tracking-widest" style={{ color: activeTemplate.accentColor }}>VIP Access Included</span>
                                </div>
                            </div>
                        </div>

                        {/* Side Info Section */}
                        <div className="w-72 relative flex flex-col p-8 text-white text-center" style={{ backgroundColor: activeTemplate.primaryColor }}>
                            {/* Perforated Line Effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-px border-l-4 border-dashed opacity-30 z-20" style={{ borderImage: "linear-gradient(to bottom, transparent 3px, black 3px) 1 100%" }} />

                            <div className="mt-4 mb-2">
                                <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto mb-2 bg-white/5 shadow-2xl overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="text-2xl font-black tracking-tighter" style={{ color: activeTemplate.accentColor }}>OT</span>
                                </div>
                                <div className="h-0.5 w-12 bg-white/20 mx-auto" />
                            </div>

                            <h3 className="text-xs font-black uppercase tracking-widest my-8 flex items-center justify-center gap-2">
                                <span className="w-4 h-px bg-white/20" />
                                Important Information
                                <span className="w-4 h-px bg-white/20" />
                            </h3>

                            <div className="space-y-6 text-left relative z-10 flex-1">
                                {(ticketData.importantInfo || []).map((info, idx) => (
                                    <div key={idx} className="flex gap-3 items-start animate-in slide-in-from-right duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
                                        <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: activeTemplate.accentColor }} />
                                        <p className="text-[11px] font-bold leading-relaxed opacity-90">{info}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto opacity-30 grayscale invert">
                                <img src="https://www.transparenttextures.com/patterns/az-subtle.png" className="w-full" alt="decoration" />
                            </div>

                            <div className="absolute bottom-6 left-0 right-0">
                                <Star className="w-4 h-4 text-emerald-400 mx-auto opacity-20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,900;1,400;1,900&display=swap');
      `}</style>
        </div>
    );
}
