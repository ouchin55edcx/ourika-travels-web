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
        <div className="min-h-screen bg-gray-50 selection:bg-[#34e0a1] selection:text-black">
            <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-center md:justify-between relative">
                    <Link href="/" className="hidden md:flex flex-col items-start leading-none group">
                        <span className="text-[20px] md:text-[22px] font-black text-[#0b3a2c] tracking-tighter">
                            Ourika Travels
                        </span>
                        <span className="text-[9px] font-black text-[#0b3a2c] uppercase tracking-[0.2em] opacity-70 mt-0.5">
                            Local Partner
                        </span>
                    </Link>
                    <Link
                        href="/"
                        className="absolute right-6 md:static p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900 group"
                    >
                        <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                    </Link>
                </div>
            </header>
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
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full mb-8">
                            <Smartphone className="w-4 h-4 text-[#0b3a2c]" />
                            <span className="text-[12px] font-black text-[#0b3a2c] tracking-widest uppercase">Guide Application</span>
                        </div>

                        <h2 className="text-3xl font-black text-black mb-3">Download the App</h2>
                        <p className="text-gray-500 font-bold mb-12 opacity-70">
                            Get ready to manage your bookings and lead your first group in Ourika.
                        </p>

                        <div className="flex flex-col gap-4 mb-12">
                            {/* Play Store */}
                            <button className="flex items-center gap-4 bg-black text-white px-8 py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl text-left group w-full">
                                <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform relative">
                                    <NextImage
                                        src="/image.png"
                                        alt="Google Play"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-black text-white/50 leading-none tracking-widest">Get it on</div>
                                    <div className="text-xl font-[900] leading-tight mt-1">Google Play</div>
                                </div>
                                <div className="ml-auto text-white/30"><ChevronRight className="w-5 h-5" /></div>
                            </button>

                            {/* Direct APK Download */}
                            <button className="flex items-center gap-4 bg-emerald-50 text-[#0b3a2c] px-8 py-5 rounded-2xl hover:bg-emerald-100 transition-all border-2 border-emerald-100 border-dashed text-left w-full group">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    <Download className="w-5 h-5 text-[#0b3a2c]" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-[10px] uppercase font-black opacity-50 leading-none tracking-widest">Available now</div>
                                    <div className="text-lg font-[900] leading-tight mt-1 uppercase tracking-tighter">Download Native APK</div>
                                </div>
                                <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black rounded-lg uppercase">Android Only</div>
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
                            <Link href="/" className="inline-flex items-center gap-3 text-[#0b3a2c] font-black text-lg hover:text-[#00ef9d] transition-colors underline decoration-4 underline-offset-8">
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
