"use client";

import { useState, useEffect, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { verifyEmailOtp, resendOtp } from "@/app/actions/auth";
import OtpInput from "@/components/OtpInput";
import { Mail, Loader2, ArrowLeft } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [token, setToken] = useState(Array(8).fill(""));
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  const tokenStr = token.join("");
  const isComplete = tokenStr.length === 6;

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-submit when all 6 digits are filled
  useEffect(() => {
    if (!isComplete || isPending) return;
    handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isComplete]);

  function handleSubmit() {
    if (!isComplete || !email) return;
    setError("");
    startTransition(async () => {
      const result = await verifyEmailOtp(email, tokenStr);
      if ("error" in result) {
        setError("Invalid code. Please try again.");
        setToken(Array(8).fill(""));
        return;
      }
      router.push("/dashboard/guide");
    });
  }

  async function handleResend() {
    if (resendCooldown > 0 || !email) return;
    setResendCooldown(60);
    setResendSuccess(false);
    const result = await resendOtp(email);
    if ("error" in result) {
      setError(result.error ?? "Failed to resend code");
    } else {
      setResendSuccess(true);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8faf8] px-4">
      {/* Back link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 transition-colors hover:text-[#0a2e1a]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>
      </div>

      {/* OT Logo */}
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ef9d] text-xl font-black text-[#0a2e1a] shadow-[0_0_30px_rgba(0,239,157,0.3)]">
        OT
      </div>

      {/* Card */}
      <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white px-8 py-10 shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
        {/* Email icon */}
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#edf7f1]">
          <Mail className="h-7 w-7 text-[#0a2e1a]" />
        </div>

        <h1 className="text-center text-2xl font-black text-[#0a2e1a]">Check your email</h1>
        <p className="mt-2 text-center text-sm font-medium text-gray-500">
          Your account needs email verification before you can access the guide dashboard.
          <br />
          <span className="font-bold text-[#0a2e1a]">Enter the 8-digit code from your email</span>
        </p>

        {/* OTP Input */}
        <div className="mt-8">
          <OtpInput value={token} onChange={setToken} error={!!error} />
        </div>

        {/* Error message */}
        {error && <p className="mt-4 text-center text-sm font-semibold text-red-500">{error}</p>}

        {/* Verify button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isComplete || isPending}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#0a2e1a] px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-[#0a2e1a]/20 transition-all hover:bg-[#0f3d24] active:scale-[0.98] disabled:opacity-40"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
            </>
          ) : (
            "Verify email"
          )}
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-xs font-bold text-gray-300">or</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* Resend section */}
        <div className="text-center">
          <p className="text-sm text-gray-400">Didn&apos;t receive it?</p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="mt-1 text-sm font-bold text-[#0a2e1a] transition-colors hover:underline disabled:opacity-40"
          >
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
          </button>
          {resendSuccess && (
            <p className="mt-2 text-xs font-medium text-emerald-600">
              Code resent! Check your inbox.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
