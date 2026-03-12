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
  Info,
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

          <div className="flex items-center gap-3 md:gap-4">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= 1 ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"}`}>
                1
              </div>
              <span className={`hidden md:inline text-sm font-bold ${step >= 1 ? "text-gray-900" : "text-gray-400"}`}>Profile</span>
            </div>

            <div className={`w-6 h-[1px] md:w-4 ${step >= 2 ? "bg-gray-800" : "bg-gray-200"}`} />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= 2 ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"}`}>
                2
              </div>
              <span className={`hidden md:inline text-sm font-bold ${step >= 2 ? "text-gray-900" : "text-gray-400"}`}>Expérience</span>
            </div>

            <div className={`w-6 h-[1px] md:w-4 ${step >= 3 ? "bg-gray-800" : "bg-gray-200"}`} />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= 3 ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"}`}>
                3
              </div>
              <span className={`hidden md:inline text-sm font-bold ${step >= 3 ? "text-gray-900" : "text-gray-400"}`}>Vérification</span>
            </div>
          </div>

          <Link
            href="/"
            className="absolute right-6 md:static p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900 group"
          >
            <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
          </Link>
        </div>
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${calculateProgress()}%` }}
        />
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-24 pb-20">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white font-bold">
                {step}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 1 && "Personal details"}
                {step === 2 && "Activity details"}
                {step === 3 && "Verification"}
              </h2>
            </div>
            {step === 1 && <User className="w-5 h-5 text-gray-400" />}
            {step === 2 && <Compass className="w-5 h-5 text-gray-400" />}
            {step === 3 && <ShieldCheck className="w-5 h-5 text-gray-400" />}
          </div>

          <div className="p-6 md:p-8">
            {/* Step 1: Personal Profile */}
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-gray-600">Enter your official information as it appears on your identity document.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 focus-within:text-emerald-700">
                    <label className="text-sm font-bold text-gray-700">First Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Ahmed"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 text-gray-900 font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-emerald-700">
                    <label className="text-sm font-bold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Amziane"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 text-gray-900 font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 focus-within:text-emerald-700">
                  <label className="text-sm font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 text-gray-900 font-medium transition-all"
                  />
                </div>

                <div className="space-y-1.5 focus-within:text-emerald-700">
                  <label className="text-sm font-bold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                    <select className="px-4 py-2.5 rounded-xl sm:rounded-r-none border border-gray-300 bg-gray-50 text-gray-700 focus:border-emerald-500 focus:ring-emerald-500 font-medium sm:border-r-0">
                      <option>Morocco (+212)</option>
                      <option>France (+33)</option>
                      <option>Spain (+34)</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="flex-1 rounded-xl sm:rounded-l-none border border-gray-300 px-4 py-2.5 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 text-gray-900 font-medium transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Primary Location <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 font-medium appearance-none cursor-pointer">
                    <option>Select location</option>
                    <option>Setti Fatma</option>
                    <option>Tnine Ourika</option>
                    <option>Oukaimeden</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700 font-medium">Select your primary specialties:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Hiking", "Culture", "Cooking", "Photography"].map((spec) => (
                      <button
                        key={spec}
                        className="flex flex-col items-start p-5 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white transition-all text-left"
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <div className="p-2 bg-emerald-50 rounded-xl">
                            <Compass className="w-6 h-6 text-[#0b3a2c]" />
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-900">{spec}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                          Share your expertise in {spec.toLowerCase()} with our travelers.
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">Your professional bio <span className="text-red-500">*</span></label>
                  <textarea
                    rows={4}
                    placeholder="Tell travelers why they should explore Ourika with you..."
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl text-gray-900 focus:border-emerald-500 focus:ring-emerald-500 font-medium resize-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center hover:bg-emerald-50/30 hover:border-emerald-200 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7 text-[#0b3a2c]" />
                  </div>
                  <h4 className="font-bold text-gray-900">Upload ID Document</h4>
                  <p className="text-gray-500 text-xs mt-2">Take a photo of your official ID card or passport.</p>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                  <Info className="w-5 h-5 text-amber-600 shrink-0" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>Trust & Safety:</strong> We use this to verify your identity and ensure the safety of our community. Your data is encrypted and never shared.
                  </p>
                </div>

                <div className="flex items-start gap-4 p-2 cursor-pointer group">
                  <input type="checkbox" id="terms-guide" className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  <label htmlFor="terms-guide" className="text-xs text-gray-500 leading-relaxed">
                    By registering, I agree to the <span className="underline text-gray-700 font-medium">Terms of Service</span> and <span className="underline text-gray-700 font-medium">Community Standards</span>.
                  </label>
                </div>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-gray-100 flex items-center justify-between gap-4">
              <button
                onClick={prevStep}
                className={`text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-all ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
              >
                <ArrowLeft className="w-4 h-4" /> Back to details
              </button>

              <div className="flex flex-col items-center sm:items-end gap-3 flex-1 sm:flex-none">
                <button
                  onClick={step === 3 ? () => router.push("/register/guide/success") : nextStep}
                  className="w-full sm:w-[220px] rounded-full bg-gray-900 text-white font-black px-8 py-3.5 text-lg hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
                >
                  {step === 3 ? "Complete Registration" : "Next step"}
                </button>
                <div className="flex items-center gap-1.5 opacity-60">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Need help?</p>
                  <Link href="/contact" className="text-[10px] font-bold text-[#0b3a2c] hover:underline uppercase tracking-widest leading-none">Support</Link>
                </div>
              </div>
            </div>
          </div>
        </div>


      </main>
    </div>
  );
}
