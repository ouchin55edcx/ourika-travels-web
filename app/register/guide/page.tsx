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
      <header className="fixed top-0 right-0 left-0 z-[100] border-b border-gray-200 bg-white shadow-sm">
        <div className="relative mx-auto flex h-16 max-w-[1280px] items-center justify-center px-6 md:justify-between">
          <Link href="/" className="group hidden flex-col items-start leading-none md:flex">
            <span className="text-[20px] font-black tracking-tighter text-[#0b3a2c] md:text-[22px]">
              Ourika Travels
            </span>
            <span className="mt-0.5 text-[9px] font-black tracking-[0.2em] text-[#0b3a2c] uppercase opacity-70">
              Local Partner
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${step >= 1 ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"}`}
              >
                1
              </div>
              <span
                className={`hidden text-sm font-bold md:inline ${step >= 1 ? "text-gray-900" : "text-gray-400"}`}
              >
                Profile
              </span>
            </div>

            <div className={`h-[1px] w-6 md:w-4 ${step >= 2 ? "bg-gray-800" : "bg-gray-200"}`} />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${step >= 2 ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"}`}
              >
                2
              </div>
              <span
                className={`hidden text-sm font-bold md:inline ${step >= 2 ? "text-gray-900" : "text-gray-400"}`}
              >
                Expérience
              </span>
            </div>

            <div className={`h-[1px] w-6 md:w-4 ${step >= 3 ? "bg-gray-800" : "bg-gray-200"}`} />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${step >= 3 ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-400"}`}
              >
                3
              </div>
              <span
                className={`hidden text-sm font-bold md:inline ${step >= 3 ? "text-gray-900" : "text-gray-400"}`}
              >
                Vérification
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="group absolute right-6 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 md:static"
          >
            <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
          </Link>
        </div>
        <div
          className="absolute bottom-0 left-0 h-[3px] bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: `${calculateProgress()}%` }}
        />
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-24 pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm duration-500">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 font-bold text-white">
                {step}
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 1 && "Personal details"}
                {step === 2 && "Activity details"}
                {step === 3 && "Verification"}
              </h2>
            </div>
            {step === 1 && <User className="h-5 w-5 text-gray-400" />}
            {step === 2 && <Compass className="h-5 w-5 text-gray-400" />}
            {step === 3 && <ShieldCheck className="h-5 w-5 text-gray-400" />}
          </div>

          <div className="p-6 md:p-8">
            {/* Step 1: Personal Profile */}
            {step === 1 && (
              <div className="space-y-6">
                <p className="text-gray-600">
                  Enter your official information as it appears on your identity document.
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1.5 focus-within:text-emerald-700">
                    <label className="text-sm font-bold text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ahmed"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5 focus-within:text-emerald-700">
                    <label className="text-sm font-bold text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amziane"
                      className="w-full rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 focus-within:text-emerald-700">
                  <label className="text-sm font-bold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5 focus-within:text-emerald-700">
                  <label className="text-sm font-bold text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
                    <select className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-2.5 font-medium text-gray-700 focus:border-emerald-500 focus:ring-emerald-500 sm:rounded-r-none sm:border-r-0">
                      <option>Morocco (+212)</option>
                      <option>France (+33)</option>
                      <option>Spain (+34)</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 font-medium text-gray-900 placeholder-gray-400 transition-all focus:border-emerald-500 focus:ring-emerald-500 sm:rounded-l-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Primary Location <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-900 focus:border-emerald-500 focus:ring-emerald-500">
                    <option>Select location</option>
                    <option>Setti Fatma</option>
                    <option>Tnine Ourika</option>
                    <option>Oukaimeden</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <p className="font-medium text-gray-700">Select your primary specialties:</p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {["Hiking", "Culture", "Cooking", "Photography"].map((spec) => (
                      <button
                        key={spec}
                        className="flex flex-col items-start rounded-2xl border-2 border-gray-200 bg-white p-5 text-left transition-all hover:border-gray-300"
                      >
                        <div className="mb-3 flex w-full items-center justify-between">
                          <div className="rounded-xl bg-emerald-50 p-2">
                            <Compass className="h-6 w-6 text-[#0b3a2c]" />
                          </div>
                        </div>
                        <h4 className="font-bold text-gray-900">{spec}</h4>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500">
                          Share your expertise in {spec.toLowerCase()} with our travelers.
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Your professional bio <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell travelers why they should explore Ourika with you..."
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-4 font-medium text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Verification */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="group cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center transition-all hover:border-emerald-200 hover:bg-emerald-50/30">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 transition-transform group-hover:scale-110">
                    <Upload className="h-7 w-7 text-[#0b3a2c]" />
                  </div>
                  <h4 className="font-bold text-gray-900">Upload ID Document</h4>
                  <p className="mt-2 text-xs text-gray-500">
                    Take a photo of your official ID card or passport.
                  </p>
                </div>

                <div className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <Info className="h-5 w-5 shrink-0 text-amber-600" />
                  <p className="text-xs leading-relaxed text-amber-800">
                    <strong>Trust & Safety:</strong> We use this to verify your identity and ensure
                    the safety of our community. Your data is encrypted and never shared.
                  </p>
                </div>

                <div className="group flex cursor-pointer items-start gap-4 p-2">
                  <input
                    type="checkbox"
                    id="terms-guide"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="terms-guide" className="text-xs leading-relaxed text-gray-500">
                    By registering, I agree to the{" "}
                    <span className="font-medium text-gray-700 underline">Terms of Service</span>{" "}
                    and{" "}
                    <span className="font-medium text-gray-700 underline">Community Standards</span>
                    .
                  </label>
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between gap-4 border-t border-gray-100 pt-8">
              <button
                onClick={prevStep}
                className={`flex items-center gap-2 text-sm font-bold text-gray-500 transition-all hover:text-gray-900 ${step === 1 ? "pointer-events-none opacity-0" : ""}`}
              >
                <ArrowLeft className="h-4 w-4" /> Back to details
              </button>

              <div className="flex flex-1 flex-col items-center gap-3 sm:flex-none sm:items-end">
                <button
                  onClick={step === 3 ? () => router.push("/register/guide/success") : nextStep}
                  className="w-full rounded-full bg-gray-900 px-8 py-3.5 text-lg font-black text-white shadow-xl shadow-gray-200 transition-all hover:bg-black active:scale-95 sm:w-[220px]"
                >
                  {step === 3 ? "Complete Registration" : "Next step"}
                </button>
                <div className="flex items-center gap-1.5 opacity-60">
                  <p className="text-[10px] leading-none font-bold tracking-widest text-gray-400 uppercase">
                    Need help?
                  </p>
                  <Link
                    href="/contact"
                    className="text-[10px] leading-none font-bold tracking-widest text-[#0b3a2c] uppercase hover:underline"
                  >
                    Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
