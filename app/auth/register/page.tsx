"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { loginWithGoogle, registerTourist, resendVerification } from "@/app/actions/auth";

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.5 2.6 30 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6.1C12.4 13.4 17.8 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.5c0-1.6-.1-2.7-.4-3.9H24v7.4h12.7c-.3 2-1.9 5-5.4 7.1l8.2 6.4c4.8-4.4 7.6-10.8 7.6-17z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.7c-.6-1.9-1-3.9-1-6s.4-4.1 1-6L2.7 10.6C1 14 0 17.9 0 22.7s1 8.7 2.7 12.1l7.8-6.1z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.5 0 12-2.1 16-5.7l-8.2-6.4c-2.3 1.6-5.2 2.7-7.8 2.7-6.2 0-11.6-3.9-13.5-9.3l-7.8 6.1C6.6 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

function getPasswordStrength(password: string) {
  const lengthScore = password.length >= 12 ? 2 : password.length >= 8 ? 1 : 0;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const varietyScore = [hasUpper, hasLower, hasNumber].filter(Boolean).length >= 2 ? 1 : 0;
  const score = Math.min(lengthScore + varietyScore, 3);

  if (score >= 3) return { label: "Strong", level: 3 };
  if (score >= 2) return { label: "Medium", level: 2 };
  if (password.length > 0) return { label: "Weak", level: 1 };
  return { label: "", level: 0 };
}

function isValidEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [resendPending, startResend] = useTransition();
  const [clientError, setClientError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  async function onSubmit(formData: FormData) {
    setClientError(null);
    setServerError(null);

    const email = (formData.get("email") as string) || "";
    const passwordValue = (formData.get("password") as string) || "";
    const confirm = (formData.get("confirm_password") as string) || "";

    if (!isValidEmail(email)) {
      setClientError("Please enter a valid email address");
      return;
    }
    if (passwordValue.length < 8) {
      setClientError("Password must be at least 8 characters");
      return;
    }
    if (passwordValue !== confirm) {
      setClientError("Passwords do not match");
      return;
    }

    const result = await registerTourist(formData);
    if (result?.error) {
      setServerError(result.error);
      return;
    }

    setSuccessEmail(email);
  }

  if (successEmail) {
    return (
      <div className="min-h-screen bg-[#f6f7f5] px-4 py-10">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center">
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
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M9.55 17.2 4.8 12.45l1.4-1.4 3.35 3.35L17.8 6.15l1.4 1.4Z"
                  />
                </svg>
              </div>
              <h1
                className="text-2xl font-semibold text-[#004f32]"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Check your inbox!
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                We sent a verification email to {successEmail}. Click the link to activate your
                account.
              </p>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() =>
                  startResend(async () => {
                    setResendMessage(null);
                    const result = await resendVerification(successEmail);
                    if (result?.error) {
                      setResendMessage(result.error);
                      return;
                    }
                    setResendMessage("Verification email resent.");
                  })
                }
                className="text-sm font-medium text-[#004f32] hover:underline"
                disabled={resendPending}
              >
                {resendPending ? "Resending..." : "Resend email"}
              </button>
              {resendMessage && (
                <div className="mt-3 text-sm text-emerald-700">{resendMessage}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f5] px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center">
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
            <h1
              className="text-2xl font-semibold text-[#004f32]"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Create your account
            </h1>
            <p className="mt-2 text-sm text-slate-600">Start exploring Ourika Valley</p>
          </div>

          <button
            type="button"
            onClick={async () => {
              setGooglePending(true);
              const result = await loginWithGoogle();
              if (result?.error) {
                setGooglePending(false);
                setServerError(result.error);
              }
            }}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            disabled={googlePending}
          >
            {googlePending ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs text-slate-500">
            <div className="h-px flex-1 bg-slate-200" />
            or sign up with email
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form
            action={(formData) =>
              startTransition(async () => {
                await onSubmit(formData);
              })
            }
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-slate-700">Full name</label>
              <input
                name="full_name"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#00ef9d] focus:ring-2 focus:ring-[#00ef9d]/40"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#00ef9d] focus:ring-2 focus:ring-[#00ef9d]/40"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
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
                  <p className="mt-1 text-xs text-slate-500">Strength: {strength.label}</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Confirm password</label>
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
              Create account
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            <p>
              Already have an account?{" "}
              <Link href="/auth/login?redirectTo=/profile" className="text-[#004f32]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
