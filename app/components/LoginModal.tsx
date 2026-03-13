"use client";

import { X, Mail } from "lucide-react";
import { useEffect, useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type EmailStep = "options" | "email" | "password";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<EmailStep>("options");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setStep("options");
      setEmail("");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="animate-in fade-in absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="animate-in zoom-in-95 fade-in slide-in-from-bottom-8 relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl duration-500 ease-out">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="group absolute top-6 right-6 rounded-full p-2 transition-colors hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-400 transition-colors group-hover:text-black" />
        </button>

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-black tracking-tight text-[#0b3a2c]">Welcome back</h2>
            <p className="font-medium text-gray-500">Log in to your Ourika Travels account</p>
          </div>

          {step === "options" && (
            <div className="space-y-4">
              <button
                type="button"
                className="group flex w-full items-center justify-center gap-4 rounded-2xl border-2 border-gray-100 bg-white px-6 py-4 font-bold text-gray-700 transition-all hover:border-gray-200 hover:bg-gray-50 active:scale-[0.98]"
              >
                <div className="flex h-6 w-6 items-center justify-center">
                  <svg viewBox="0 0 24 24" className="h-5 w-5">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                Continue with Google
              </button>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-4 rounded-2xl bg-[#0b3a2c] px-6 py-4 font-bold text-white shadow-xl shadow-emerald-900/10 transition-all hover:bg-black active:scale-[0.98]"
                onClick={() => setStep("email")}
              >
                <Mail className="h-5 w-5" />
                Continue with Email
              </button>
            </div>
          )}

          {step === "email" && (
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault();
                setStep("password");
              }}
            >
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600" htmlFor="login-email">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-2xl border-2 border-gray-100 px-4 py-3 font-semibold text-gray-800 focus:border-[#0b3a2c] focus:outline-none"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm font-bold text-gray-400 hover:text-[#0b3a2c]"
                  onClick={() => setStep("options")}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#0b3a2c] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-black"
                >
                  Continue
                </button>
              </div>
            </form>
          )}

          {step === "password" && (
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600" htmlFor="login-password">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  className="w-full rounded-2xl border-2 border-gray-100 px-4 py-3 font-semibold text-gray-800 focus:border-[#0b3a2c] focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm font-bold text-gray-400 hover:text-[#0b3a2c]"
                  onClick={() => setStep("email")}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-[#0b3a2c] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-black"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm font-bold text-gray-400">
              Don't have an account?{" "}
              <button className="text-[#0b3a2c] decoration-2 underline-offset-4 hover:underline">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
