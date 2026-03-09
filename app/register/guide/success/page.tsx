"use client";

import Link from "next/link";
import {
    CheckCircle,
    Smartphone,
    ChevronRight,
    ArrowRight,
    Download,
    Star,
    ShieldCheck,
    Clock,
    X,
    SmartphoneIcon,
    AppWindowIcon
} from "lucide-react";
import NextImage from "next/image";

export default function GuideSuccessPage() {
    return (
        <div className="min-h-screen bg-white relative overflow-x-hidden selection:bg-[#00ef9d] selection:text-[#004f32]">
            <main className="relative z-10 max-w-[600px] mx-auto px-6 pt-16 pb-20 md:pt-32 text-center flex flex-col items-center justify-center min-h-[90vh]">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-[#00ef9d] rounded-full mb-8 shadow-[0_20px_40px_rgba(0,239,157,0.3)] animate-in zoom-in duration-700">
                        <CheckCircle className="w-12 h-12 text-[#004f32]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-[900] text-black tracking-tight mb-4 leading-[1.1]">
                        Account Created!
                    </h1>
                    <p className="text-gray-500 text-xl font-medium max-w-md mx-auto opacity-80">
                        Welcome to the family. Your application is being reviewed by our team.
                    </p>
                </div>

                <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.05)] overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="p-8 md:p-16 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00ef9d]/20 rounded-full mb-8">
                            <Smartphone className="w-4 h-4 text-[#004f32]" />
                            <span className="text-[12px] font-black text-[#004f32] tracking-widest uppercase">Guide Application</span>
                        </div>

                        <h2 className="text-3xl font-black text-black mb-3">Download the App</h2>
                        <p className="text-gray-500 font-bold mb-12 opacity-70">
                            Get ready to manage your bookings and lead your first group in Ourika.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
                            {/* App Store */}
                            <button className="flex items-center gap-4 bg-black text-white px-8 py-5 rounded-[1.2rem] hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl text-left group">
                                <div className="text-3xl group-hover:scale-110 transition-transform"></div>
                                <div>
                                    <div className="text-[10px] uppercase font-black text-white/50 leading-none tracking-widest">Download on the</div>
                                    <div className="text-xl font-[900] leading-tight mt-1">App Store</div>
                                </div>
                            </button>

                            {/* Play Store */}
                            <button className="flex items-center gap-4 bg-black text-white px-8 py-5 rounded-[1.2rem] hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl text-left group">
                                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L18.77,16.24C19.46,16.63 19.46,17.37 18.77,17.76L16.03,19.34L14.4,12.7L16.81,15.12M14.4,11.3L16.03,4.66L18.77,6.24C19.46,6.63 19.46,7.37 18.77,7.76L16.81,8.88L14.4,11.3M13.69,12L3.84,2.15L13.69,12ZM15.34,12L13.69,12L15.34,12Z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-black text-white/50 leading-none tracking-widest">Get it on</div>
                                    <div className="text-xl font-[900] leading-tight mt-1">Google Play</div>
                                </div>
                            </button>
                        </div>

                        {/* Additional Info / Features */}
                        <div className="grid grid-cols-3 gap-6 py-10 border-t border-gray-100">
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <p className="text-[11px] font-[900] text-gray-400 uppercase tracking-widest">Real-time</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <p className="text-[11px] font-[900] text-gray-400 uppercase tracking-widest">Secure</p>
                            </div>
                            <div className="space-y-3">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                    <Star className="w-6 h-6" />
                                </div>
                                <p className="text-[11px] font-[900] text-gray-400 uppercase tracking-widest">Premium</p>
                            </div>
                        </div>

                        <div className="mt-12">
                            <Link href="/" className="inline-flex items-center gap-3 text-[#004f32] font-[900] text-lg hover:text-[#00ef9d] transition-colors underline decoration-4 underline-offset-8">
                                Back to website <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-16 p-8 rounded-[2rem] bg-gray-50 border border-gray-100 text-center">
                    <p className="text-gray-500 font-bold text-base leading-relaxed">
                        Waiting for approval? Ourika Travels verification usually takes <span className="text-[#004f32] font-black">24-48 hours</span>.
                    </p>
                </div>
            </main>
        </div>
    );
}
