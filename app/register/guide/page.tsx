"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerGuide, uploadGuideBadgeImage, checkEmailExists } from "@/app/actions/auth";
import {
  Mail,
  Phone,
  Eye,
  EyeOff,
  X,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Check,
  Upload,
} from "lucide-react";

const INPUT_CLASS = `
  w-full rounded-xl border border-gray-200 bg-white px-4 py-3
  text-sm font-medium text-gray-900 placeholder-gray-400
  focus:border-[#0a2e1a] focus:outline-none focus:ring-2
  focus:ring-[#0a2e1a]/10 transition-all
`;

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black tracking-widest text-gray-500 uppercase">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
          <AlertCircle className="h-3 w-3 shrink-0" /> {error}
        </p>
      )}
    </div>
  );
}

export default function GuideRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [badgeUrl, setBadgeUrl] = useState("");
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [badgeError, setBadgeError] = useState<string | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // Debounced email check
  const checkEmail = useCallback(async (email: string) => {
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailAvailable(null);
      return;
    }

    setCheckingEmail(true);
    try {
      const result = await checkEmailExists(email);
      setEmailAvailable(!result.exists);
      if (result.exists) {
        setErrors((prev) => ({ ...prev, email: "This email is already registered" }));
      } else {
        setErrors((prev) => {
          const { email: _, ...rest } = prev;
          return rest;
        });
      }
    } catch {
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  // Debounce email validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (form.email && /^\S+@\S+\.\S+$/.test(form.email)) {
        checkEmail(form.email);
      } else {
        setEmailAvailable(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.email, checkEmail]);

  async function handleBadgeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBadge(true);
    setBadgeError(null);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadGuideBadgeImage(fd);
    setUploadingBadge(false);
    if ("error" in result) setBadgeError(result.error);
    else setBadgeUrl(result.url);
  }

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = "Required";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email required";
    if (emailAvailable === false) e.email = "This email is already registered";
    if (checkingEmail) e.email = "Checking email...";
    if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleContinue() {
    if (validateStep1()) {
      setStep(2);
    }
  }

  function submitRegistration() {
    setSubmitError(null);
    const payload = new FormData();
    payload.set("email", form.email.trim());
    payload.set("password", form.password);
    payload.set("full_name", form.full_name.trim());
    payload.set("phone", form.phone.trim());
    if (badgeUrl) payload.set("badge_image_url", badgeUrl);
    startTransition(async () => {
      const result = await registerGuide(payload);
      if (result?.error) {
        setSubmitError(result.error);
        return;
      }
      const redirectEmail = (result as any)?.email || form.email;
      router.push(`/register/guide/verify?email=${encodeURIComponent(redirectEmail)}`);
    });
  }

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL — desktop only, fixed */}
      <div className="fixed top-0 left-0 hidden h-screen w-[480px] flex-col justify-between bg-[#0a2e1a] px-12 py-16 lg:flex">
        {/* Top: logo + close */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-white">
            Ourika Travels
          </Link>
          <Link
            href="/"
            className="rounded-full p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Link>
        </div>

        {/* Middle: headline + trust bullets */}
        <div className="space-y-8">
          <div>
            {/* OT Logo */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#00ef9d] text-xl font-black text-[#0a2e1a] shadow-[0_0_30px_rgba(0,239,157,0.3)]">
              OT
            </div>
            <h1 className="text-4xl leading-[1.05] font-black tracking-tight text-white xl:text-5xl">
              Become a
              <br />
              certified guide
            </h1>
            <p className="mt-4 text-base leading-relaxed font-medium text-white/50">
              Join Morocco&apos;s most authentic guide community.
            </p>
          </div>

          {/* Trust bullets */}
          <ul className="space-y-4">
            {[
              "Manage bookings & earnings in one place",
              "Get discovered by travelers worldwide",
              "Verified badge builds traveler trust",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#00ef9d]/20">
                  <Check className="h-3.5 w-3.5 text-[#00ef9d]" />
                </div>
                <span className="text-sm font-medium text-white/70">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: photo */}
        <div className="relative h-48 w-full overflow-hidden rounded-2xl">
          <Image
            src="/ourika-valley.jpg"
            alt="Ourika Valley"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2e1a] to-transparent" />
          <p className="absolute bottom-4 left-4 text-xs font-bold text-white/60">
            Ourika Valley, Morocco
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — scrollable form */}
      <div className="flex min-h-screen flex-1 flex-col bg-white lg:ml-[480px]">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4 lg:hidden">
          <Link href="/" className="text-lg font-black text-[#0a2e1a]">
            Ourika Travels
          </Link>
          <Link href="/" className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-400" />
          </Link>
        </div>

        {/* Form content */}
        <div className="flex flex-1 items-start justify-center px-6 py-10 lg:px-16 lg:py-16">
          <div className="w-full max-w-md">
            {/* Step indicator */}
            <div className="mb-8 flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full transition-all ${
                  step === 1 ? "bg-[#0a2e1a]" : "bg-[#00ef9d]"
                }`}
              />
              <div
                className={`h-3 w-3 rounded-full transition-all ${
                  step === 2 ? "bg-[#0a2e1a]" : "bg-gray-300"
                }`}
              />
              <span className="ml-2 text-xs font-black tracking-widest text-gray-400 uppercase">
                Step {step} of 2
              </span>
            </div>

            {/* Step header */}
            <div className="mb-8">
              <h2 className="text-3xl leading-tight font-black text-[#0a2e1a]">
                {step === 1 && "Personal info"}
                {step === 2 && "Upload your badge"}
              </h2>
              <p className="mt-2 font-medium text-gray-500">
                {step === 1 && "Enter your details to get started."}
                {step === 2 && "Upload your official guide badge or certification."}
              </p>
            </div>

            {/* ─── STEP 1 — Personal Info ────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <Field label="Full name" required error={errors.full_name}>
                  <input
                    type="text"
                    placeholder="Ahmed Amziane"
                    value={form.full_name}
                    onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                    className={INPUT_CLASS}
                  />
                </Field>

                <Field label="Email address" required error={errors.email}>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-300" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, email: e.target.value }));
                        setEmailAvailable(null);
                      }}
                      className={`${INPUT_CLASS} pr-11 pl-11 ${
                        emailAvailable === false
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                          : emailAvailable === true
                            ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                            : ""
                      }`}
                    />
                    <div className="absolute top-1/2 right-4 -translate-y-1/2">
                      {checkingEmail && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                      {!checkingEmail && emailAvailable === true && !errors.email && (
                        <Check className="h-4 w-4 text-emerald-500" />
                      )}
                      {!checkingEmail && emailAvailable === false && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </Field>

                <Field label="Phone number" required error={errors.phone}>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-300" />
                    <input
                      type="tel"
                      placeholder="+212 6XX XXX XXX"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      className={`${INPUT_CLASS} pl-11`}
                    />
                  </div>
                </Field>

                <Field label="Password" required error={errors.password}>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                      className={`${INPUT_CLASS} pr-14`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((v) => !v)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                <Field label="Confirm password" required error={errors.confirmPassword}>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                      className={`${INPUT_CLASS} pr-14`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                {submitError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {submitError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0a2e1a] px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-[#0a2e1a]/20 transition-all hover:bg-[#0f3d24] active:scale-[0.98]"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* ─── STEP 2 — Badge Upload ─────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Field label="Guide badge" error={badgeError ?? undefined}>
                    <label
                      className={`relative flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-all ${
                        badgeUrl
                          ? "h-48 border-[#0a2e1a]"
                          : "h-48 border-gray-200 hover:border-[#0a2e1a] hover:bg-[#edf7f1]"
                      }`}
                    >
                      {uploadingBadge && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/90">
                          <Loader2 className="h-6 w-6 animate-spin text-[#0a2e1a]" />
                          <p className="text-sm font-semibold text-[#0a2e1a]">Uploading...</p>
                        </div>
                      )}

                      {badgeUrl && !uploadingBadge && (
                        <>
                          <img
                            src={badgeUrl}
                            alt="Badge"
                            className="h-full w-full object-contain p-4"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setBadgeUrl("");
                            }}
                            className="absolute top-3 right-3 z-10 rounded-full bg-white p-1.5 shadow-lg transition-colors hover:bg-red-50"
                          >
                            <X className="h-3.5 w-3.5 text-gray-500" />
                          </button>
                          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#0a2e1a] px-3 py-1 text-[11px] font-bold text-white">
                            <CheckCircle2 className="h-3 w-3" /> Uploaded
                          </div>
                        </>
                      )}

                      {!badgeUrl && !uploadingBadge && (
                        <div className="flex flex-col items-center gap-3 px-6 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                            <Upload className="h-6 w-6 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-500">
                              Drag & drop or click to upload
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                              JPG, PNG or WebP · Max 10 MB
                            </p>
                          </div>
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleBadgeUpload}
                      />
                    </label>
                  </Field>
                  <p className="text-xs text-gray-400">
                    Optional — you can add your badge later from the dashboard.
                  </p>
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {submitError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={submitRegistration}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0a2e1a] px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-[#0a2e1a]/20 transition-all hover:bg-[#0f3d24] active:scale-[0.98] disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                    </>
                  ) : (
                    <>
                      Create my account <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-center text-sm font-bold text-gray-400 transition-colors hover:text-[#0a2e1a]"
                >
                  ← Back to personal info
                </button>
              </div>
            )}

            {/* Sign in link */}
            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-bold text-[#0a2e1a] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
