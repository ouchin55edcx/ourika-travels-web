"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Ticket, Calendar, Clock, MapPin, Users, ChevronRight, History, Trash2 } from "lucide-react";
import Link from "next/link";
import BookingTicket from "../reservation/components/BookingTicket";

interface Booking {
    id: string;
    activityTitle: string;
    date: string;
    time: string;
    guests: string;
    totalPrice: string;
    customerName: string;
    status: string;
    timestamp: number;
}

export default function ReservationHistoricPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        const savedBookings = JSON.parse(localStorage.getItem("ourika_bookings") || "[]");
        // Sort by most recent first
        setBookings(savedBookings.sort((a: Booking, b: Booking) => b.timestamp - a.timestamp));
    }, []);

    const deleteBooking = (id: string) => {
        const updated = bookings.filter(b => b.id !== id);
        setBookings(updated);
        localStorage.setItem("ourika_bookings", JSON.stringify(updated));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-[#34e0a1] selection:text-black">
            <Navbar sticky={false} />

            {selectedBooking && (
                <BookingTicket
                    bookingId={selectedBooking.id}
                    activityTitle={selectedBooking.activityTitle}
                    date={selectedBooking.date}
                    time={selectedBooking.time}
                    guests={selectedBooking.guests}
                    totalPrice={selectedBooking.totalPrice}
                    customerName={selectedBooking.customerName}
                    onClose={() => setSelectedBooking(null)}
                />
            )}

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                            <History className="w-10 h-10 text-[#004f32]" />
                            Booking History
                        </h1>
                        <p className="text-gray-500 font-medium mt-2">Manage your past and upcoming travel experiences</p>
                    </div>

                    <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-[#004f32] font-black text-xl">
                            {bookings.length}
                        </div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-none">
                            Total<br />Bookings
                        </div>
                    </div>
                </div>

                {bookings.length > 0 ? (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 group hover:shadow-xl hover:border-emerald-100 transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors">
                                    <Ticket className="w-8 h-8 text-slate-400 group-hover:text-[#004f32] transition-colors" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                                            Unpaid · Pay on Start
                                        </span>
                                        <span className="text-xs font-bold text-slate-300">#{booking.id}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-[#004f32] transition-colors">
                                        {booking.activityTitle}
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-4">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Calendar className="w-4 h-4 text-emerald-500" />
                                            {booking.date}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Clock className="w-4 h-4 text-emerald-500" />
                                            {booking.time}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                            <Users className="w-4 h-4 text-emerald-500" />
                                            {booking.guests}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8">
                                    <div className="text-2xl font-black text-gray-900">{booking.totalPrice}</div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setSelectedBooking(booking)}
                                            className="px-6 py-2.5 bg-[#004f32] text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-black transition-all active:scale-95"
                                        >
                                            View Ticket
                                        </button>
                                        <button
                                            onClick={() => deleteBooking(booking.id)}
                                            className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            title="Remove from history"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] py-24 px-8 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                            <History className="w-12 h-12" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">No bookings yet</h2>
                        <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">Your travel adventures will appear here once you've made a reservation.</p>
                        <Link
                            href="/experiences"
                            className="px-10 py-4 bg-black text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
                        >
                            Explore Experiences
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
