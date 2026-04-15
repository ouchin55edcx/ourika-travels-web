"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Mountain, Users, Star, ChevronRight } from "lucide-react";

export default function GuideWelcomePage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  // Animation phases
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200); // logo
    const t2 = setTimeout(() => setPhase(2), 600); // title
    const t3 = setTimeout(() => setPhase(3), 900); // subtitle
    const t4 = setTimeout(() => setPhase(4), 1200); // cards
    const t5 = setTimeout(() => setPhase(5), 2000); // CTA

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (phase < 5) return;
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          router.push("/dashboard/guide");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase, router]);

  const transitionClass = "transition-all duration-700 ease-out";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a2e1a] px-4 py-16">
      <div className="w-full max-w-2xl text-center">
        {/* OT Logo */}
        <div
          className={`${transitionClass} mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#00ef9d] text-2xl font-black text-[#0a2e1a] shadow-[0_0_40px_rgba(0,239,157,0.4)] ${
            phase >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        >
          OT
        </div>

        {/* Verified badge */}
        <div
          className={`${transitionClass} mb-6 inline-flex items-center gap-2 rounded-full border border-[#00ef9d]/30 bg-[#00ef9d]/10 px-4 py-1.5 text-sm font-bold text-[#00ef9d] ${
            phase >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <ShieldCheck className="h-4 w-4" /> Verified Guide
        </div>

        {/* Title */}
        <h1
          className={`${transitionClass} text-4xl leading-tight font-black tracking-tight text-white md:text-5xl ${
            phase >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Welcome to Ourika Travels
        </h1>

        {/* Subtitle */}
        <p
          className={`${transitionClass} mx-auto mt-4 max-w-md text-base font-medium text-white/50 ${
            phase >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          You&apos;re now part of Morocco&apos;s most authentic guide community.
        </p>

        {/* Benefit cards */}
        <div
          className={`${transitionClass} mt-10 grid gap-4 sm:grid-cols-3 ${
            phase >= 4 ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {[
            {
              icon: <Mountain className="h-6 w-6 text-[#00ef9d]" />,
              title: "Your dashboard is ready",
              desc: "Manage bookings, your profile and earnings",
            },
            {
              icon: <Users className="h-6 w-6 text-[#00ef9d]" />,
              title: "Connect with travelers",
              desc: "Get discovered by travelers from around the world",
            },
            {
              icon: <Star className="h-6 w-6 text-[#00ef9d]" />,
              title: "Complete your profile",
              desc: "Add a photo and bio to attract more travelers",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition-all duration-500"
              style={{
                borderLeft: "3px solid #00ef9d",
                transitionDelay: phase >= 4 ? `${i * 150}ms` : "0ms",
              }}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#00ef9d]/10">
                {card.icon}
              </div>
              <p className="text-sm font-bold text-white">{card.title}</p>
              <p className="mt-1 text-xs font-medium text-white/40">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div
          className={`${transitionClass} mt-10 ${
            phase >= 5 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => router.push("/dashboard/guide")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#00ef9d] px-8 py-4 text-sm font-black text-[#0a2e1a] shadow-lg shadow-[#00ef9d]/20 transition-all hover:bg-[#00d98a] active:scale-[0.98] sm:w-auto"
          >
            Go to my dashboard <ChevronRight className="h-4 w-4" />
          </button>

          <div className="mt-4">
            <Link
              href="/"
              className="text-sm font-bold text-white/30 transition-colors hover:text-white/60"
            >
              or explore the platform first
            </Link>
          </div>

          {/* Auto-redirect notice */}
          <p className="mt-6 text-xs font-medium text-white/20">Redirecting in {countdown}s...</p>
        </div>
      </div>
    </div>
  );
}
