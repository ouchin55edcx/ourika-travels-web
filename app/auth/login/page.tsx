"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { loginWithEmail, loginWithGoogle } from "@/app/actions/auth";

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

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-5 w-5"
    >
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

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [googlePending, setGooglePending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const verified = searchParams.get("verified") === "true";
  const resetSuccess = searchParams.get("reset") === "success";
  const errorParam = searchParams.get("error");
  const redirectTo = searchParams.get("redirectTo") ?? "";

  const statusMessage = useMemo(() => {
    if (verified) return { type: "success", text: "Email verified! You can now sign in." };
    if (resetSuccess)
      return { type: "success", text: "Password reset successfully." };
    if (errorParam)
      return { type: "error", text: decodeURIComponent(errorParam) };
    return null;
  }, [verified, resetSuccess, errorParam]);

  async function onSubmit(formData: FormData) {
    setServerError(null);
    const result = await loginWithEmail(formData);
    if (result?.error) setServerError(result.error);
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
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to your account
            </p>
          </div>

          {statusMessage && (
            <div
              className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
                statusMessage.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

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
            or continue with email
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
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#00ef9d] focus:ring-2 focus:ring-[#00ef9d]/40"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 shadow-sm focus-within:border-[#00ef9d] focus-within:ring-2 focus-within:ring-[#00ef9d]/40">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-xs font-medium text-[#004f32]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium text-[#004f32] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#004f32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004029] disabled:cursor-not-allowed disabled:opacity-80"
            >
              {isPending ? <Spinner /> : null}
              Sign in
            </button>

            {serverError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {serverError}
              </div>
            )}
          </form>

          <div className="mt-6 space-y-2 text-center text-sm text-slate-600">
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-[#004f32]">
                Sign up
              </Link>
            </p>
            <p>
              Are you a guide?{" "}
              <Link href="/register/guide" className="text-[#004f32]">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
