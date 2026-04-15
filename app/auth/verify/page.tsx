"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { verifyCode, resendVerification } from "@/app/actions/auth";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const INPUT_CLASS = `
  w-full rounded-xl border border-gray-200 bg-white px-4 py-3
  text-sm font-medium text-gray-900 placeholder-gray-400
  focus:border-[#004f32] focus:outline-none focus:ring-2
  focus:ring-[#004f32]/10 transition-all text-center text-2xl tracking-[0.5em] font-mono
`;

export default function TouristVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState(["", "", "", ""]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendPending, setResendPending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError(null);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const newCode = pasted.split("");
      setCode(newCode);
      inputRefs.current[3]?.focus();
    }
  }

  function handleSubmit() {
    const fullCode = code.join("");
    if (fullCode.length !== 4) {
      setError("Please enter all 4 digits");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await verifyCode(email, fullCode, "tourist");
      if (result?.error) {
        setError(result.error);
        setCode(["", "", "", ""]);
        inputRefs.current[0]?.focus();
        return;
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/?verified=true");
      }, 1500);
    });
  }

  function handleResend() {
    if (countdown > 0) return;
    setResendPending(true);
    setResendMessage(null);
    setCountdown(60);

    resendVerification(email).then((result) => {
      setResendPending(false);
      if (result?.error) {
        setResendMessage(result.error);
      } else {
        setResendMessage("New code sent! Check your email.");
      }
    });
  }

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7f5] px-6">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-amber-500" />
          <h2 className="text-2xl font-semibold text-[#004f32]">No email provided</h2>
          <p className="mt-2 text-sm text-gray-500">
            Please register again to receive a verification code.
          </p>
          <Link
            href="/auth/register"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#004f32] px-6 py-3 text-sm font-semibold text-white"
          >
            Go to registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f5] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 flex justify-center">
            <Link href="/" className="text-2xl font-semibold text-[#004f32]">
              Ourika Travels
            </Link>
          </div>

          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-semibold text-[#004f32]">Email verified!</h1>
              <p className="mt-2 text-sm text-gray-500">Redirecting you to Ourika Travels...</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Mail className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-semibold text-[#004f32]">Check your inbox!</h1>
                <p className="mt-2 text-sm text-gray-600">
                  We sent a 4-digit verification code to{" "}
                  <span className="font-bold text-[#004f32]">{email}</span>
                </p>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3" onPaste={handlePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={INPUT_CLASS}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {resendMessage && (
                <p className="mt-4 text-center text-sm text-emerald-700">{resendMessage}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || code.some((d) => !d)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#004f32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004029] disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  "Verify email"
                )}
              </button>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendPending || countdown > 0}
                  className="text-sm font-medium text-[#004f32] hover:underline disabled:opacity-50"
                >
                  {countdown > 0
                    ? `Resend in ${countdown}s`
                    : resendPending
                      ? "Resending..."
                      : "Resend code"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
