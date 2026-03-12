"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  X,
  MessageSquare,
  Globe,
  Award,
} from "lucide-react";
import NextImage from "next/image";

export default function GuideRegisterPage() {
  const router = useRouter();
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
    hasCertification: false,
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const calculateProgress = () => (step / 3) * 100;

  return (
    <div className="min-h-screen bg-[linear-gradient(140deg,_#f9f6ef_0%,_#f1f5f1_45%,_#eef2f7_100%)] relative overflow-x-hidden selection:bg-[#00ef9d] selection:text-[#004f32]">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-black text-[#004f32] tracking-tighter transition-transform group-active:scale-95">
              Ourika Travels
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-[13px] font-black uppercase text-gray-400">
              <span className={step >= 1 ? "text-[#004f32]" : ""}>Profile</span>
              <ChevronRight className="w-3 h-3 stroke-[3px]" />
              <span className={step >= 2 ? "text-[#004f32]" : ""}>
                Expérience
              </span>
              <ChevronRight className="w-3 h-3 stroke-[3px]" />
              <span className={step >= 3 ? "text-[#004f32]" : ""}>
                Vérification
              </span>
            </div>
            <Link
              href="/"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900 group"
            >
              <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
            </Link>
          </div>
        </div>
        {/* Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-[#00ef9d] shadow-[0_0_10px_rgba(0,239,157,0.5)] transition-all duration-500 ease-out"
          style={{ width: `${calculateProgress()}%` }}
        />
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-24 pb-20 sm:px-6 md:pt-32">
        <div className="absolute left-1/2 top-20 h-[260px] w-[85%] -translate-x-1/2 rounded-[32px] bg-[radial-gradient(circle_at_top,_#fff8df_0%,_rgba(255,248,223,0)_70%)]" />

        {/* Page Title Section */}
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[#7d816f]">
                Devenir guide
              </p>
              <h1 className="text-[30px] font-black leading-tight text-[#111827] sm:text-[36px]">
                Become a Guide
              </h1>
              <p className="text-sm font-medium text-[#6b7280] max-w-lg">
                Share the hidden gems of Ourika with travelers from around the
                world.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/70 backdrop-blur border border-[#e2ece7] px-4 py-3 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-[#e8f5ef] flex items-center justify-center text-[#0f3d2b]">
                <Compass className="w-5 h-5" />
              </div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-[#7a8b83] leading-tight">
                Step {step}
                <br />
                of 3
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-white/80 border border-[#e4e8df] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] p-6 md:p-12 transition-all duration-300 backdrop-blur">
          <div className="flex items-center gap-2 mb-10">
            <div className="text-[12px] font-black text-[#2d4b3f] bg-[#00ef9d]/20 px-4 py-1.5 rounded-full uppercase tracking-wider">
              Étape {step} sur 3
            </div>
          </div>

          {/* Step 1: Personal Profile */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[14px] font-black text-black uppercase tracking-wide flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00ef9d]" /> First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Ahmed"
                    className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[15px] text-black outline-none focus:bg-white focus:border-[#004f32] focus:ring-4 focus:ring-[#34e0a1]/10 transition-all placeholder:text-gray-400 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[14px] font-black text-black uppercase tracking-wide flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#00ef9d]" /> Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Amziane"
                    className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[15px] text-black outline-none focus:bg-white focus:border-[#004f32] focus:ring-4 focus:ring-[#34e0a1]/10 transition-all placeholder:text-gray-400 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-black text-black uppercase tracking-wide flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00ef9d]" /> Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[15px] text-black outline-none focus:bg-white focus:border-[#004f32] focus:ring-4 focus:ring-[#34e0a1]/10 transition-all placeholder:text-gray-400 font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-black text-black uppercase tracking-wide flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#00ef9d]" /> Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="+212 6 XX XX XX XX"
                    className="w-full px-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[15px] text-black outline-none focus:bg-white focus:border-[#004f32] focus:ring-4 focus:ring-[#34e0a1]/10 transition-all placeholder:text-gray-400 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="space-y-2">
                <label className="text-[14px] font-black text-black uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00ef9d]" /> Primary Location
                </label>
                <div className="relative group">
                  <select className="w-full pl-5 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-[15px] text-black outline-none focus:bg-white focus:border-[#004f32] focus:ring-4 focus:ring-[#34e0a1]/10 transition-all font-bold appearance-none cursor-pointer">
                    <option>Select location</option>
                    <option>Setti Fatma</option>
                    <option>Tnine Ourika</option>
                    <option>Oukaimeden</option>
                  </select>
                  <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 rotate-90 pointer-events-none transition-transform group-focus-within:-rotate-90" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[14px] font-black text-black uppercase tracking-wide flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#00ef9d]" /> Specialties
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Hiking", "Culture", "Cooking", "Photography"].map(
                    (spec) => (
                      <button
                        key={spec}
                        className="px-5 py-4 border-2 border-gray-50 bg-gray-50/30 rounded-2xl text-[14px] font-black text-gray-700 hover:border-[#00ef9d] hover:bg-white hover:text-[#004f32] hover:shadow-lg hover:scale-[1.02] transition-all text-left flex items-center gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        {spec}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[14px] font-black text-black uppercase tracking-wide flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#00ef9d]" /> Your Bio
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell travelers why they should explore Ourika with you..."
                  className="w-full px-5 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl text-[15px] text-black outline-none focus:bg-white focus:border-[#004f32] focus:ring-4 focus:ring-[#34e0a1]/10 transition-all font-bold resize-none placeholder:text-gray-400 leading-relaxed"
                ></textarea>
              </div>
            </div>
          )}

          {/* Step 3: Verification */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400">
              <div className="p-12 border-2 border-dashed border-gray-100 rounded-[2rem] text-center hover:bg-gray-50 hover:border-[#00ef9d]/30 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-[#00ef9d]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-[#004f32]" />
                </div>
                <p className="font-black text-black text-lg">
                  Upload ID Document
                </p>
                <p className="text-gray-400 text-[13px] mt-2 font-bold uppercase tracking-widest">
                  PDF, PNG or JPG (Max 10MB)
                </p>
              </div>

              <div className="space-y-5">
                <div className="p-6 bg-[#00ef9d]/10 border border-[#00ef9d]/20 rounded-2xl flex gap-4">
                  <div className="w-10 h-10 bg-[#34e0a1] rounded-full flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#004f32]" />
                  </div>
                  <div>
                    <p className="font-black text-[#004f32] text-sm uppercase tracking-wide">
                      Pro Tip
                    </p>
                    <p className="text-[#004f32]/80 text-[13px] mt-1 leading-relaxed font-bold">
                      Verified guides receive 3x more bookings. Have your
                      license ready for a faster approval.
                    </p>
                  </div>
                </div>

                <label className="flex items-start gap-4 cursor-pointer group py-3 px-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    className="mt-1 w-6 h-6 rounded-lg border-gray-200 text-[#004f32] focus:ring-[#34e0a1] accent-[#004f32]"
                  />
                  <span className="text-[14px] text-gray-500 font-bold leading-relaxed group-hover:text-black transition-colors">
                    I agree to the{" "}
                    <span className="text-[#004f32] underline hover:no-underline underline-offset-4">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-[#004f32] underline hover:no-underline underline-offset-4">
                      Privacy Policy
                    </span>
                    .
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Footer / Actions */}
          <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
            <button
              onClick={prevStep}
              className={`text-[15px] font-black uppercase tracking-wider transition-all flex items-center gap-3 ${
                step === 1
                  ? "opacity-0 pointer-events-none"
                  : "text-gray-400 hover:text-black"
              }`}
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>

            <button
              onClick={
                step === 3
                  ? () => router.push("/register/guide/success")
                  : nextStep
              }
              className="bg-[#004f32] text-white px-10 py-4 rounded-full font-black text-[15px] uppercase tracking-widest shadow-[0_10px_30px_rgba(0,79,50,0.2)] hover:bg-[#003d27] hover:shadow-[0_15px_40px_rgba(0,79,50,0.3)] hover:-translate-y-1 transition-all active:scale-95 outline-none focus:ring-4 focus:ring-[#34e0a1]/20 flex items-center gap-4"
            >
              {step === 3 ? "Register" : "Continue"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-[14px] text-gray-400 font-bold uppercase tracking-widest">
            Need help?{" "}
            <Link
              href="/contact"
              className="text-[#004f32] hover:text-[#00ef9d] transition-colors underline decoration-2 underline-offset-4"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
