"use client";

import Link from "next/link";
import Image from "next/image";
import GuideNavbar from "@/app/components/GuideNavbar";
import Footer from "@/app/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Smartphone,
  ShieldCheck,
  UserCircle,
  TrendingUp,
  Download,
  CheckCircle2,
  PlayCircle,
  ChevronRight,
  MapPin,
  Star,
} from "lucide-react";

export default function GuideHomePage() {
  const heroReveal = useScrollReveal(0.05);
  const pillarReveal = useScrollReveal(0.05);
  const appReveal = useScrollReveal(0.05);

  return (
    <div className="min-h-screen bg-white text-[#0f1f18] selection:bg-[#00ef9d] selection:text-black">
      <GuideNavbar />

      <main className="flex flex-col gap-2">
        {/* Premium Minimal Hero Section */}
        <section
          ref={heroReveal.elementRef as any}
          className="relative min-h-[70vh] md:min-h-[85vh] flex flex-col items-center justify-center pt-24 pb-8 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4rem]"
        >
          {/* Hero Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2400&auto=format&fit=crop"
              alt="Ourika Guides Team"
              fill
              className="object-cover"
              priority
            />
            {/* Professional Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#004f32]/80 via-[#004f32]/40 to-white" />
          </div>

          <div className={`relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center reveal ${heroReveal.isVisible ? 'reveal-visible' : ''}`}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              The Home <br className="hidden sm:block" />
              <span className="text-[#00ef9d]">
                of Local Expertise.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-2xl text-white/90 max-w-2xl mb-10 leading-relaxed font-medium">
              Join the specialized digital infrastructure built for independent local experts to build, manage, and scale their guiding business in the Ourika Valley.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="#download"
                className="w-full sm:w-auto flex items-center justify-center gap-4 bg-[#00ef9d] text-[#004f32] px-8 md:px-10 py-4 md:py-5 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
              >
                Get Started
                <Download className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-white font-bold text-lg px-8 py-4 md:py-5 hover:bg-white/10 rounded-2xl transition-all duration-300 backdrop-blur-sm"
              >
                Explore features
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Premium Trust Section */}
            <div className="mt-16 md:mt-24 w-full grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 pt-12 border-t border-white/20">
              {[
                { icon: Star, label: "COMMUNITY", value: "Verified Locals" },
                { icon: MapPin, label: "FOCUS", value: "Ourika Valley" },
                { icon: Smartphone, label: "MANAGEMENT", value: "Mobile First" },
                { icon: ShieldCheck, label: "PAYMENTS", value: "Secure Payouts" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#00ef9d] backdrop-blur-md">
                    <item.icon className="w-4 h-4 md:w-5 md:h-5 stroke-[2.5px]" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-white/60 mb-0.5">{item.label}</span>
                    <span className="text-xs md:text-sm font-bold text-white">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Professional Pillar Section */}
        <section
          id="how-it-works"
          ref={pillarReveal.elementRef as any}
          className="py-4 px-6 bg-white relative overflow-hidden"
        >
          <div className="max-w-6xl mx-auto relative z-10">
            <div className={`mb-12 md:mb-20 text-center flex flex-col items-center reveal ${pillarReveal.isVisible ? 'reveal-visible' : ''}`}>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-[#004f32] mb-6 md:mb-8 tracking-tight">Focus on hosting, <br className="hidden md:block" /> not logistics</h2>
              <p className="text-gray-500 text-sm sm:text-lg md:text-xl max-w-2xl font-medium leading-relaxed px-4">
                We provide the professional tools you need to build a successful independent guiding career with zero technical friction.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              {/* Feature 1: Mobile Management */}
              <div
                className={`group p-8 md:p-16 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 hover:border-[#00ef9d]/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col items-center text-center reveal ${pillarReveal.isVisible ? 'reveal-visible' : ''}`}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl md:rounded-[2rem] text-[#004f32] mb-8 md:mb-10 group-hover:bg-[#00ef9d]/20 transition-all duration-500">
                  <Smartphone className="w-8 h-8 md:w-10 md:h-10 stroke-[2px]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-[#004f32] mb-4 md:mb-6 tracking-tight">Management In Pocket</h3>
                <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed mb-8 md:mb-10 max-w-sm">
                  The specialized mobile app is your daily operations center. Manage everything without even needing a computer.
                </p>
                <div className="flex flex-col gap-4 md:gap-5 items-center w-full">
                  {[
                    "Instant booking confirmation",
                    "Real-time guest communication",
                    "Automated daily payout tracking"
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 md:gap-3">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#00ef9d]" />
                      <span className="text-sm md:text-base font-bold text-[#004f32]/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature 2: Digital Profile */}
              <div
                className={`group p-8 md:p-16 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 hover:border-[#00ef9d]/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500 flex flex-col items-center text-center reveal ${pillarReveal.isVisible ? 'reveal-visible' : ''}`}
                style={{ transitionDelay: '150ms' }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-2xl md:rounded-[2rem] text-[#004f32] mb-8 md:mb-10 group-hover:bg-[#00ef9d]/20 transition-all duration-500">
                  <UserCircle className="w-8 h-8 md:w-10 md:h-10 stroke-[2px]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-[#004f32] mb-4 md:mb-6 tracking-tight">Strong Digital Profile</h3>
                <p className="text-gray-500 text-base md:text-lg font-medium leading-relaxed mb-8 md:mb-10 max-w-sm">
                  We showcase your local expertise to travelers globally. A professional profile builds instant trust and converts more bookings.
                </p>
                <div className="flex flex-col gap-4 md:gap-5 items-center w-full">
                  {[
                    "Professional storytelling tools",
                    "Authentic photo gallery showcase",
                    "Certified & verified local badges"
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2 md:gap-3">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#00ef9d]" />
                      <span className="text-sm md:text-base font-bold text-[#004f32]/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="download"
          ref={appReveal.elementRef as any}
          className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-2 pb-20 md:pb-32"
        >
          <div className={`relative bg-[#004f32] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] reveal ${appReveal.isVisible ? 'reveal-visible' : ''}`}>
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-[#00ef9d]/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-[#00ef9d]/5 rounded-full blur-[100px]" />
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
              {/* Content Side */}
              <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16 lg:p-24 flex flex-col justify-center">
                <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ef9d] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ef9d]"></span>
                  </span>
                  <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-[#00ef9d]">Start your journey today</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 leading-[1] tracking-tighter">
                  Ready to Lead <br className="hidden sm:block" />
                  with Ourika<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ef9d] to-[#00f5ff]">
                    Expert Team?
                  </span>
                </h2>

                <p className="text-base md:text-xl text-white/70 font-medium mb-12 max-w-lg leading-relaxed">
                  Join the elite community of local guides. Our companion app simplifies your operations so you can focus on what matters: delivering unforgettable stories.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <button className="w-full sm:w-auto group flex items-center justify-center gap-4 bg-[#00ef9d] text-[#004f32] px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(0,239,157,0.3)] hover:bg-white">
                    <PlayCircle className="w-6 h-6 md:w-8 md:h-8" />
                    <div className="text-left leading-none">
                      <span className="text-[9px] md:text-[10px] uppercase opacity-60 block mb-1 font-black">Download for Android</span>
                      <span className="text-lg md:text-xl">Google Play</span>
                    </div>
                  </button>
                </div>

                {/* Social Proof Section */}
                <div className="mt-16 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-[#004f32] overflow-hidden relative shadow-xl transform hover:-translate-y-1 transition-transform cursor-pointer">
                        <Image src={`https://i.pravatar.cc/150?u=${i + 40}`} alt="Active Guide" fill className="object-cover" />
                      </div>
                    ))}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-[#004f32] bg-[#00ef9d] flex items-center justify-center text-[#004f32] font-black text-xs md:text-sm shadow-xl">
                      +50
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg md:text-xl">Join Verified Partners</div>
                    <div className="text-[#00ef9d] text-[10px] md:text-xs font-black uppercase tracking-widest">Active Guiding Community</div>
                  </div>
                </div>
              </div>

              {/* Visual Side: Dynamic Mockup */}
              <div className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[600px] lg:h-auto bg-[#003d27]/30 flex items-center justify-center p-8 lg:p-12 overflow-hidden">
                {/* Abstract Visual Elements */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none scale-150">
                  <div className="w-64 h-64 border border-[#00ef9d] rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute w-96 h-96 border border-[#00ef9d]/30 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                </div>

                <div className="relative group z-10">
                  {/* Floating Notification */}
                  <div className="absolute -top-10 -left-10 md:-left-20 z-30 bg-white p-4 rounded-2xl shadow-2xl animate-bounce hidden sm:flex items-center gap-4 border border-gray-100 min-w-[200px] transform -rotate-6">
                    <div className="w-10 h-10 bg-[#00ef9d]/20 rounded-xl flex items-center justify-center text-[#004f32]">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-black text-gray-400 uppercase">New Booking</div>
                      <div className="text-sm font-bold text-[#004f32]">Ourika Waterfall Hike</div>
                    </div>
                  </div>

                  {/* Main Mockup Container */}
                  <div className="relative z-20">
                    <div className="w-[260px] md:w-[300px] h-[540px] md:h-[620px] bg-[#111] rounded-[3rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[8px] border-[#222]">
                      <div className="h-full w-full bg-[#004f32] rounded-[2.2rem] overflow-hidden relative">
                        {/* Mockup App Interface */}
                        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#00ef9d]/20 to-transparent" />

                        <div className="relative h-full flex flex-col p-6 items-center">
                          <div className="w-12 h-1 bg-white/20 rounded-full mb-8" />

                          <div className="w-16 h-16 bg-[#00ef9d] rounded-2xl flex items-center justify-center text-[#004f32] shadow-2xl mb-6">
                            <Smartphone className="w-8 h-8" />
                          </div>

                          <div className="text-center mb-8">
                            <div className="text-white text-xl font-black tracking-tight leading-tight">Partner Dashboard</div>
                            <div className="text-[#00ef9d] text-[10px] font-black uppercase tracking-widest mt-1">Live Status: Online</div>
                          </div>

                          {/* Mock UI Elements */}
                          <div className="w-full space-y-3 mb-auto">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[#00ef9d]" />
                                <div className="h-2 w-20 bg-white/20 rounded-full" />
                              </div>
                            ))}
                          </div>

                          <div className="w-full bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 text-center">
                            <div className="text-[9px] text-white/40 uppercase font-black mb-2 tracking-widest">Connect ID</div>
                            <div className="flex justify-center mb-2">
                              <TrendingUp className="w-8 h-8 text-[#00ef9d]" />
                            </div>
                            <p className="text-[10px] text-white/60 font-medium">ourika-partner-portal-v2</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Mockup (Desktop only) */}
                  <div className="absolute -bottom-10 -right-20 w-[240px] h-[480px] bg-[#1a1a1a] rounded-[2.5rem] opacity-30 blur-sm scale-90 hidden lg:block -z-10 translate-x-10 -rotate-12 transition-transform group-hover:translate-x-16" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
