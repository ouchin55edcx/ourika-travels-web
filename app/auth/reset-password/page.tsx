"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ShieldCheck, ShieldX } from "lucide-react";
import { resetPassword } from "@/app/actions/auth";

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
      />
    </svg>
  );
}

function getPasswordStrength(password: string) {
  const lengthScore = password.length >= 12 ? 2 : password.length >= 8 ? 1 : 0;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const varietyScore =
    [hasUpper, hasLower, hasNumber].filter(Boolean).length >= 2 ? 1 : 0;
  const score = Math.min(lengthScore + varietyScore, 3);

  if (score >= 3) return { label: "Strong", level: 3 };
  if (score >= 2) return { label: "Medium", level: 2 };
  if (password.length > 0) return { label: "Weak", level: 1 };
  return { label: "", level: 0 };
}

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  async function onSubmit(formData: FormData) {
    setClientError(null);
    setServerError(null);

    const pass = (formData.get("password") as string) || "";
    const confirm = (formData.get("confirm_password") as string) || "";

    if (pass.length < 8) {
      setClientError("Password must be at least 8 characters");
      return;
    }
    if (pass !== confirm) {
      setClientError("Passwords do not match");
      return;
    }

    const result = await resetPassword(formData);
    if (result?.error) {
      setServerError(result.error);
      return;
    }

    setIsSuccess(true);
  }

  if (serverError) {
    return (
      <div className="min-h-screen bg-[#f6f7f5] px-4 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-sm flex-col justify-center">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex justify-center">
              <Link
                href="/"
                className="text-2xl font-semibold text-[#004f32]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Ourika Travels
              </Link>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <ShieldX className="h-6 w-6" />
              </div>
              <h1
                className="text-2xl font-semibold text-[#004f32]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                This reset link has expired or is invalid.
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Please request a new reset link to continue.
              </p>
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-[#004f32] hover:underline"
              >
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f6f7f5] px-4 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-sm flex-col justify-center">
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex justify-center">
              <Link
                href="/"
                className="text-2xl font-semibold text-[#004f32]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Ourika Travels
              </Link>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1
                className="text-2xl font-semibold text-[#004f32]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Password updated!
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Your password has been changed successfully.
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="inline-flex w-full items-center justify-center rounded-lg bg-[#004f32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004029]"
              >
                Sign in now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f5] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-sm flex-col justify-center">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-6 flex justify-center">
            <Link
              href="/"
              className="text-2xl font-semibold text-[#004f32]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Ourika Travels
            </Link>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1
              className="text-2xl font-semibold text-[#004f32]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Set new password
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Choose a strong password for your account
            </p>
          </div>

          <form
            action={(formData) =>
              startTransition(async () => {
                await onSubmit(formData);
              })
            }
            className="mt-6 space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-slate-700">
                New password
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus-within:border-[#00ef9d] focus-within:ring-2 focus-within:ring-[#00ef9d]/40">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-xs font-medium text-[#004f32]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <span
                      key={level}
                      className={`h-1.5 flex-1 rounded-full ${
                        strength.level >= level
                          ? level === 1
                            ? "bg-red-400"
                            : level === 2
                              ? "bg-amber-400"
                              : "bg-emerald-500"
                          : "bg-slate-200"
                      }`}
                    />
                  ))}
                </div>
                {strength.label && (
                  <p className="mt-1 text-xs text-slate-500">
                    Strength: {strength.label}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Confirm password
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus-within:border-[#00ef9d] focus-within:ring-2 focus-within:ring-[#00ef9d]/40">
                <input
                  name="confirm_password"
                  type={showConfirm ? "text" : "password"}
                  required
                  minLength={8}
                  className="w-full text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((value) => !value)}
                  className="text-xs font-medium text-[#004f32]"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {(clientError || serverError) && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {clientError || serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#004f32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004029] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isPending ? <Spinner /> : null}
              Reset password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
