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
  AppWindowIcon,
} from "lucide-react";
import NextImage from "next/image";

export default function GuideSuccessPage() {
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
          <Link
            href="/"
            className="group absolute right-6 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 md:static"
          >
            <X className="h-5 w-5 transition-transform group-hover:rotate-90" />
          </Link>
        </div>
      </header>
      <main className="relative z-10 mx-auto flex min-h-[90vh] max-w-[600px] flex-col items-center justify-center px-6 pt-16 pb-20 text-center md:pt-32">
        <div className="mb-12 text-center">
          <div className="animate-in zoom-in mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-[#00ef9d] shadow-[0_20px_40px_rgba(0,239,157,0.3)] duration-700">
            <CheckCircle className="h-12 w-12 text-[#004f32]" />
          </div>
          <h1 className="mb-4 text-4xl leading-[1.1] font-[900] tracking-tight text-black md:text-6xl">
            Account Created!
          </h1>
          <p className="mx-auto max-w-md text-xl font-medium text-gray-500 opacity-80">
            Welcome to the family. Your application is being reviewed by our team.
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-6 overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-[0_30px_60px_rgba(0,0,0,0.05)] duration-700">
          <div className="p-8 text-center md:p-16">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5">
              <Smartphone className="h-4 w-4 text-[#0b3a2c]" />
              <span className="text-[12px] font-black tracking-widest text-[#0b3a2c] uppercase">
                Guide Application
              </span>
            </div>

            <h2 className="mb-3 text-3xl font-black text-black">Download the App</h2>
            <p className="mb-12 font-bold text-gray-500 opacity-70">
              Get ready to manage your bookings and lead your first group in Ourika.
            </p>

            <div className="mb-12 flex flex-col gap-4">
              {/* Play Store */}
              <button className="group flex w-full items-center gap-4 rounded-2xl bg-black px-8 py-5 text-left text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                <div className="relative flex h-8 w-8 items-center justify-center transition-transform group-hover:scale-110">
                  <NextImage
                    src="/image.png"
                    alt="Google Play"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] leading-none font-black tracking-widest text-white/50 uppercase">
                    Get it on
                  </div>
                  <div className="mt-1 text-xl leading-tight font-[900]">Google Play</div>
                </div>
                <div className="ml-auto text-white/30">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </button>

              {/* Direct APK Download */}
              <button className="group flex w-full items-center gap-4 rounded-2xl border-2 border-dashed border-emerald-100 bg-emerald-50 px-8 py-5 text-left text-[#0b3a2c] transition-all hover:bg-emerald-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110">
                  <Download className="h-5 w-5 text-[#0b3a2c]" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] leading-none font-black tracking-widest uppercase opacity-50">
                    Available now
                  </div>
                  <div className="mt-1 text-lg leading-tight font-[900] tracking-tighter uppercase">
                    Download Native APK
                  </div>
                </div>
                <div className="rounded-lg bg-emerald-500 px-3 py-1 text-[10px] font-black text-white uppercase">
                  Android Only
                </div>
              </button>
            </div>

            {/* Additional Info / Features */}
            <div className="grid grid-cols-3 gap-6 border-t border-gray-100 py-10">
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
                  <Clock className="h-6 w-6" />
                </div>
                <p className="text-[11px] font-[900] tracking-widest text-gray-400 uppercase">
                  Real-time
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="text-[11px] font-[900] tracking-widest text-gray-400 uppercase">
                  Secure
                </p>
              </div>
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm">
                  <Star className="h-6 w-6" />
                </div>
                <p className="text-[11px] font-[900] tracking-widest text-gray-400 uppercase">
                  Premium
                </p>
              </div>
            </div>

            <div className="mt-12">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-lg font-black text-[#0b3a2c] underline decoration-4 underline-offset-8 transition-colors hover:text-[#00ef9d]"
              >
                Back to website <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] border border-gray-100 bg-gray-50 p-8 text-center">
          <p className="text-base leading-relaxed font-bold text-gray-500">
            Waiting for approval? Ourika Travels verification usually takes{" "}
            <span className="font-black text-[#004f32]">24-48 hours</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
