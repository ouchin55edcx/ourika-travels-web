"use client";

import { useState } from "react";
import Link from "next/link";
import {
    User,
    Mail,
    Phone,
    Languages,
    Compass,
    Star,
    MapPin,
    ShieldCheck,
    FileText,
    CheckCircle,
    ArrowRight,
    ArrowLeft,
    Upload,
    Camera,
    ChevronRight,
    X
} from "lucide-react";
import NextImage from "next/image";

export default function GuideRegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        languages: [] as string[],
        // Step 2
        experience: "",
        specialties: [] as string[],
        location: "",
        bio: "",
        // Step 3
        idType: "passport",
        hasCertification: false
    });

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const calculateProgress = () => (step / 3) * 100;

    return (
        <div className="min-h-screen bg-white relative overflow-x-hidden selection:bg-[#004f32] selection:text-white">
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-xl md:text-2xl font-black text-[#004f32] tracking-tighter transition-transform group-active:scale-95">
                            Ourika Travels
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 text-[13px] font-bold text-gray-400">
                            <span className={step >= 1 ? "text-[#004f32]" : ""}>Profile</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 2 ? "text-[#004f32]" : ""}>Expérience</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className={step >= 3 ? "text-[#004f32]" : ""}>Vérification</span>
                        </div>
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900 group">
                            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        </Link>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#004f32] transition-all duration-500 ease-out" style={{ width: `${calculateProgress()}%` }} />
            </header>

            {/* Immersive Background */}
            <div className="fixed inset-0 z-0">
                <NextImage
                    src="/register/register-guide-bg.png"
                    alt="Register Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/25 backdrop-blur-[2px]" />
            </div>

            <main className="relative z-10 max-w-[540px] mx-auto px-6 pt-24 pb-20 md:pt-32">
                {/* Page Title Section */}
                <div className="mb-8 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#004f32]/10 rounded-full mb-4">
                        <Compass className="w-4 h-4 text-[#004f32]" />
                        <span className="text-[12px] font-bold text-[#004f32] tracking-wide uppercase">Devenir Guide</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                        Become a Guide
                    </h1>
                    <p className="text-white/70 text-base font-medium">
                        Share the hidden gems of Ourika with the world.
                    </p>
                </div>

                <div className="bg-white/20 border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-6 md:p-10 backdrop-blur-xl transition-all duration-300">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="text-sm font-bold text-[#004f32] bg-[#004f32]/10 px-3 py-1 rounded-lg">
                            Étape {step} sur 3
                        </div>
                    </div>

                    {/* Step 1: Personal Profile */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-700 ml-1">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="Ahmed"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] text-black outline-none focus:border-[#004f32] focus:ring-4 focus:ring-[#004f32]/5 transition-all placeholder:text-gray-400 font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[13px] font-bold text-gray-700 ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Amziane"
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] text-black outline-none focus:border-[#004f32] focus:ring-4 focus:ring-[#004f32]/5 transition-all placeholder:text-gray-400 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] text-black outline-none focus:border-[#004f32] focus:ring-4 focus:ring-[#004f32]/5 transition-all placeholder:text-gray-400 font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="+212 6 XX XX XX XX"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] text-black outline-none focus:border-[#004f32] focus:ring-4 focus:ring-[#004f32]/5 transition-all placeholder:text-gray-400 font-medium"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Experience */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Primary Location</label>
                                <select
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] text-black outline-none focus:border-[#004f32] focus:ring-4 focus:ring-[#004f32]/5 transition-all font-medium appearance-none"
                                >
                                    <option>Select location</option>
                                    <option>Setti Fatma</option>
                                    <option>Tnine Ourika</option>
                                    <option>Oukaimeden</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Specialties</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Hiking", "Culture", "Cooking", "Photography"].map((spec) => (
                                        <button
                                            key={spec}
                                            className="px-4 py-3 border border-gray-200 rounded-xl text-[13px] font-bold text-gray-600 hover:border-[#004f32] hover:text-[#004f32] transition-all text-left"
                                        >
                                            {spec}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[13px] font-bold text-gray-700 ml-1">Your Bio</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell travelers why they should explore Ourika with you..."
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-[14px] text-black outline-none focus:border-[#004f32] focus:ring-4 focus:ring-[#004f32]/5 transition-all font-medium resize-none placeholder:text-gray-400"
                                ></textarea>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Verification */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
                            <div className="p-10 border-2 border-dashed border-gray-100 rounded-2xl text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-4 group-hover:text-[#004f32] transition-colors" />
                                <p className="font-bold text-gray-900 text-[15px]">Upload ID Document</p>
                                <p className="text-gray-400 text-[13px] mt-1">PDF, PNG or JPG (Max 10MB)</p>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-[#004f32]/5 border border-[#004f32]/10 rounded-xl">
                                    <p className="font-bold text-[#004f32] text-[13px]">Pro Tip</p>
                                    <p className="text-[#004f32]/70 text-[12px] mt-1 leading-relaxed font-medium">
                                        Verified guides receive 3x more bookings. Have your license ready for a faster approval.
                                    </p>
                                </div>

                                <label className="flex items-start gap-4 cursor-pointer group py-2">
                                    <input type="checkbox" className="mt-1 w-5 h-5 rounded-lg border-gray-300 text-[#004f32] focus:ring-[#004f32] accent-[#004f32]" />
                                    <span className="text-[13px] text-gray-500 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                                        I agree to the Terms of Service and Privacy Policy. I confirm that all information is accurate.
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Footer / Actions */}
                    <div className="mt-10 flex items-center justify-between pt-8 border-t border-gray-100">
                        <button
                            onClick={prevStep}
                            className={`text-[15px] text-white font-bold transition-all flex items-center gap-2 ${step === 1 ? "opacity-0 pointer-events-none" : "text-gray-400 hover:text-[#004f32]"
                                }`}
                        >
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <button
                            onClick={step === 3 ? undefined : nextStep}
                            className="bg-[#004f32] text-white px-8 py-3.5 rounded-xl font-black text-[15px] shadow-[0_10px_25px_rgba(0,79,50,0.2)] hover:bg-[#003d27] transition-all active:scale-95 outline-none focus:ring-4 focus:ring-[#004f32]/10 flex items-center gap-2"
                        >
                            {step === 3 ? "Complete Registration" : "Continue"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[14px] text-white/60 font-medium">
                        Need help? <Link href="/contact" className="text-white font-black hover:underline decoration-2 underline-offset-4">Contact Support</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
