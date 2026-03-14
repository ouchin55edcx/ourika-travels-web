"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { forgotPassword } from "@/app/actions/auth";

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

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function onSubmit(formData: FormData) {
    const value = (formData.get("email") as string) || "";
    setEmail(value);
    await forgotPassword(formData);
    setSubmittedEmail(value);
  }

  if (submittedEmail) {
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
                <Mail className="h-6 w-6" />
              </div>
              <h1
                className="text-2xl font-semibold text-[#004f32]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Check your email
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                We sent a password reset link to {submittedEmail}
              </p>
            </div>

            <div className="mt-6 text-center text-sm text-slate-600">
              <button
                type="button"
                onClick={() =>
                  startTransition(async () => {
                    const formData = new FormData();
                    formData.set("email", submittedEmail);
                    await onSubmit(formData);
                  })
                }
                className="font-medium text-[#004f32] hover:underline"
                disabled={isPending}
              >
                {isPending ? "Resending..." : "Didn't receive it? Resend"}
              </button>
              <div className="mt-3">
                <Link
                  href="/auth/login"
                  className="font-medium text-[#004f32] hover:underline"
                >
                  Back to sign in
                </Link>
              </div>
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

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#004f32]"
          >
            <span aria-hidden="true">←</span>
            Back to sign in
          </Link>

          <div className="mt-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Lock className="h-6 w-6" />
            </div>
            <h1
              className="text-2xl font-semibold text-[#004f32]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Forgot your password?
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Enter your email and we&apos;ll send you a reset link.
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
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoFocus
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#00ef9d] focus:ring-2 focus:ring-[#00ef9d]/40"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#004f32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004029] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isPending ? <Spinner /> : null}
              Send reset link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
