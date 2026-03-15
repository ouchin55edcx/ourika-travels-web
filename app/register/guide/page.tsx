'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerGuide, uploadGuideBadgeImage } from '@/app/actions/auth';
import {
  Mail, Phone, Eye, EyeOff, X, Shield, Loader2,
  CheckCircle2, AlertCircle, ArrowLeft, ArrowRight
} from 'lucide-react';

const INPUT_CLASS = `
  w-full rounded-xl border border-gray-200 bg-white px-4 py-3
  text-sm font-medium text-gray-900 placeholder-gray-400
  focus:border-[#0b3a2c] focus:outline-none focus:ring-2
  focus:ring-[#0b3a2c]/10 transition-all
`;

function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-black uppercase tracking-widest
        text-gray-500">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500
          font-medium">
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
  const [badgeUrl, setBadgeUrl] = useState('');
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [badgeError, setBadgeError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '', phone: '',
  });

  async function handleBadgeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBadge(true);
    setBadgeError(null);
    const fd = new FormData();
    fd.append('file', file);
    const result = await uploadGuideBadgeImage(fd);
    setUploadingBadge(false);
    if ('error' in result) setBadgeError(result.error);
    else setBadgeUrl(result.url);
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = 'Valid email required';
    if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords don\'t match';
    if (!form.phone.trim()) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submitRegistration() {
    setSubmitError(null);
    const payload = new FormData();
    payload.set('email', form.email.trim());
    payload.set('password', form.password);
    payload.set('full_name', `${form.firstName.trim()} ${form.lastName.trim()}`);
    payload.set('phone', form.phone.trim());
    if (badgeUrl) payload.set('badge_image_url', badgeUrl);
    startTransition(async () => {
      const result = await registerGuide(payload);
      if (result?.error) { setSubmitError(result.error); return; }
      router.push(`/register/guide/success?email=${encodeURIComponent(form.email)}`);
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — desktop only, fixed */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] shrink-0
        bg-[#0b3a2c] flex-col justify-between px-12 py-16 fixed left-0 top-0
        h-screen">

        {/* Top: logo + close */}
        <div className="flex items-center justify-between">
          <Link href="/" className="text-white text-xl font-black tracking-tight">
            Ourika Travels
          </Link>
          <Link href="/"
            className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </Link>
        </div>

        {/* Middle: headline + step progress */}
        <div className="space-y-12">
          <div>
            <p className="text-[#00ef9d] text-xs font-black uppercase
              tracking-[0.2em] mb-4">
              Join our guide network
            </p>
            <h1 className="text-white text-4xl xl:text-5xl font-black
              leading-[1.05] tracking-tight">
              Share the magic<br />of Ourika Valley
            </h1>
            <p className="text-white/50 text-base font-medium mt-4 leading-relaxed">
              Certified guides. Real travelers.<br />
              Authentic experiences.
            </p>
          </div>

          {/* Vertical step indicator */}
          <div className="space-y-0">
            {[
              { n: 1, label: 'Account',      hint: 'Name, email & password' },
              { n: 2, label: 'Your profile', hint: 'Phone & guide badge'     },
              { n: 3, label: 'Verification', hint: 'Confirm & submit'        },
            ].map((s, i) => {
              const isCompleted = step > s.n;
              const isActive    = step === s.n;
              return (
                <div key={s.n} className="flex gap-4">
                  {/* Line + circle column */}
                  <div className="flex flex-col items-center">
                    <div className={`flex h-9 w-9 shrink-0 items-center
                      justify-center rounded-full border-2 transition-all
                      duration-300 text-sm font-black
                      ${isCompleted
                        ? 'border-[#00ef9d] bg-[#00ef9d] text-[#0b3a2c]'
                        : isActive
                        ? 'border-[#00ef9d] bg-transparent text-[#00ef9d]'
                        : 'border-white/20 bg-transparent text-white/30'
                      }`}>
                      {isCompleted
                        ? <CheckCircle2 className="w-4 h-4" />
                        : s.n}
                    </div>
                    {i < 2 && (
                      <div className={`w-px h-10 mt-1 transition-colors
                        duration-500
                        ${step > s.n ? 'bg-[#00ef9d]' : 'bg-white/10'}`} />
                    )}
                  </div>
                  {/* Labels */}
                  <div className="pt-1.5 pb-10">
                    <p className={`text-sm font-black transition-colors
                      ${isActive ? 'text-white' : isCompleted
                        ? 'text-white/50' : 'text-white/25'}`}>
                      {s.label}
                    </p>
                    <p className={`text-xs mt-0.5 transition-colors
                      ${isActive ? 'text-white/60' : 'text-white/20'}`}>
                      {s.hint}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom: testimonial */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-white/60 text-sm leading-relaxed italic">
            "Joining Ourika Travels changed everything. I now guide
             travelers from around the world through my valley."
          </p>
          <p className="text-[#00ef9d] text-xs font-black mt-3 uppercase
            tracking-wider">
            — Ahmed, Guide since 2022
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — scrollable form */}
      <div className="flex-1 lg:ml-[420px] xl:ml-[480px] min-h-screen
        bg-[#f8faf8] flex flex-col">

        {/* Mobile header only */}
        <div className="lg:hidden flex items-center justify-between
          px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-40">
          <Link href="/" className="text-[#0b3a2c] text-lg font-black">
            Ourika Travels
          </Link>
          <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Mobile step bar */}
        <div className="lg:hidden px-6 pt-4 pb-2 bg-white border-b
          border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-widest
              text-gray-400">
              Step {step} of 3
            </span>
            <span className="text-xs font-black text-[#0b3a2c]">
              {step === 1 ? 'Account' : step === 2 ? 'Profile' : 'Verify'}
            </span>
          </div>
          <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-[#00ef9d] rounded-full
              transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-start justify-center
          px-6 py-10 lg:py-16 lg:px-16">
          <div className="w-full max-w-md">

            {/* Step header */}
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-[0.2em]
                text-[#00ef9d] mb-2">
                Step {step} of 3
              </p>
              <h2 className="text-3xl font-black text-[#0b3a2c] leading-tight">
                {step === 1 && 'Create your account'}
                {step === 2 && 'Complete your profile'}
                {step === 3 && 'Almost there'}
              </h2>
              <p className="text-gray-500 font-medium mt-2">
                {step === 1 && 'Enter your basic details to get started.'}
                {step === 2 && 'Add your contact info and guide badge.'}
                {step === 3 && 'Review and submit your registration.'}
              </p>
            </div>

            {/* ─── STEP 1 ─────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-4
                duration-300">

                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="First name" required error={errors.firstName}>
                    <input type="text" placeholder="Ahmed"
                      value={form.firstName}
                      onChange={e => setForm(p => ({...p, firstName: e.target.value}))}
                      className={INPUT_CLASS} />
                  </Field>
                  <Field label="Last name" required error={errors.lastName}>
                    <input type="text" placeholder="Amziane"
                      value={form.lastName}
                      onChange={e => setForm(p => ({...p, lastName: e.target.value}))}
                      className={INPUT_CLASS} />
                  </Field>
                </div>

                <Field label="Email address" required error={errors.email}>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2
                      h-4 w-4 text-gray-300 pointer-events-none" />
                    <input type="email" placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm(p => ({...p, email: e.target.value}))}
                      className={`${INPUT_CLASS} pl-11`} />
                  </div>
                </Field>

                <Field label="Password" required error={errors.password}>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={form.password}
                      onChange={e => setForm(p => ({...p, password: e.target.value}))}
                      className={`${INPUT_CLASS} pr-14`} />
                    <button type="button" onClick={() => setShowPass(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-gray-600 transition-colors">
                      {showPass
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Password strength bar */}
                  {form.password.length > 0 && (
                    <div className="mt-2">
                      <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300
                          ${form.password.length < 8
                            ? 'w-1/4 bg-red-400'
                            : form.password.length < 12
                            ? 'w-2/4 bg-amber-400'
                            : 'w-full bg-[#00ef9d]'}`} />
                      </div>
                      <p className={`text-[11px] font-bold mt-1
                        ${form.password.length < 8 ? 'text-red-400'
                        : form.password.length < 12 ? 'text-amber-500'
                        : 'text-emerald-600'}`}>
                        {form.password.length < 8 ? 'Too short'
                        : form.password.length < 12 ? 'Good'
                        : 'Strong'}
                      </p>
                    </div>
                  )}
                </Field>

                <Field label="Confirm password" required error={errors.confirmPassword}>
                  <div className="relative">
                    <input type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      value={form.confirmPassword}
                      onChange={e => setForm(p => ({...p, confirmPassword: e.target.value}))}
                      className={`${INPUT_CLASS} pr-14`} />
                    <button type="button" onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2
                        text-gray-400 hover:text-gray-600 transition-colors">
                      {showConfirm
                        ? <EyeOff className="h-4 w-4" />
                        : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
              </div>
            )}

            {/* ─── STEP 2 ─────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4
                duration-300">

                <Field label="Phone number" required error={errors.phone}>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2
                      h-4 w-4 text-gray-300 pointer-events-none" />
                    <input type="tel" placeholder="+212 6XX XXX XXX"
                      value={form.phone}
                      onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                      className={`${INPUT_CLASS} pl-11`} />
                  </div>
                </Field>

                {/* Badge upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-gray-700">
                      Official guide badge
                    </p>
                    <span className="text-xs text-gray-400 font-medium">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 -mt-1">
                    Upload your official certificate from the Moroccan Ministry
                    of Tourism. You can add this later from your profile.
                  </p>

                  <label className={`relative flex flex-col items-center
                    justify-center w-full rounded-2xl border-2 border-dashed
                    cursor-pointer transition-all overflow-hidden
                    ${badgeUrl
                      ? 'border-[#0b3a2c] h-40'
                      : 'border-gray-200 h-40 hover:border-[#0b3a2c] hover:bg-[#f0faf5]'
                    }`}>

                    {uploadingBadge && (
                      <div className="absolute inset-0 bg-white/90 flex
                        flex-col items-center justify-center gap-2 z-10">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0b3a2c]" />
                        <p className="text-sm font-semibold text-[#0b3a2c]">
                          Uploading...
                        </p>
                      </div>
                    )}

                    {badgeUrl && !uploadingBadge && (
                      <>
                        <img src={badgeUrl} alt="Badge"
                          className="h-full w-full object-contain p-4" />
                        <button type="button"
                          onClick={e => { e.preventDefault(); setBadgeUrl(''); }}
                          className="absolute top-3 right-3 bg-white rounded-full
                            p-1.5 shadow-lg hover:bg-red-50 z-10 transition-colors">
                          <X className="h-3.5 w-3.5 text-gray-500" />
                        </button>
                        <div className="absolute bottom-3 left-1/2
                          -translate-x-1/2 flex items-center gap-1.5
                          bg-[#0b3a2c] text-white text-[11px] font-bold
                          px-3 py-1 rounded-full">
                          <CheckCircle2 className="h-3 w-3" /> Uploaded
                        </div>
                      </>
                    )}

                    {!badgeUrl && !uploadingBadge && (
                      <div className="flex flex-col items-center gap-2
                        text-center px-6">
                        <div className="w-12 h-12 rounded-full bg-gray-100
                          flex items-center justify-center">
                          <Shield className="h-6 w-6 text-gray-300" />
                        </div>
                        <p className="text-sm font-semibold text-gray-500">
                          Click to upload badge
                        </p>
                        <p className="text-xs text-gray-400">
                          JPG, PNG or WebP · Max 10 MB
                        </p>
                      </div>
                    )}

                    <input type="file" accept="image/jpeg,image/png,image/webp"
                      className="hidden" onChange={handleBadgeUpload} />
                  </label>

                  {badgeError && (
                    <p className="flex items-center gap-1.5 text-xs text-red-500
                      font-medium">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {badgeError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ─── STEP 3 ─────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4
                duration-300">

                {/* Summary card */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5
                  space-y-3 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-widest
                    text-gray-400 mb-4">
                    Registration summary
                  </p>
                  {[
                    { label: 'Name',  value: `${form.firstName} ${form.lastName}` },
                    { label: 'Email', value: form.email },
                    { label: 'Phone', value: form.phone },
                    { label: 'Badge', value: badgeUrl
                        ? '✓ Uploaded'
                        : 'Not uploaded (add later)' },
                  ].map(row => (
                    <div key={row.label}
                      className="flex items-center justify-between
                        border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <span className="text-xs font-bold text-gray-400 uppercase
                        tracking-wider">
                        {row.label}
                      </span>
                      <span className={`text-sm font-semibold
                        ${row.value.startsWith('✓')
                          ? 'text-emerald-600'
                          : 'text-gray-800'}`}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* What happens next */}
                <div className="rounded-2xl bg-[#f0faf5] border border-emerald-100
                  p-5 space-y-3">
                  <p className="text-sm font-black text-[#0b3a2c]">
                    What happens next
                  </p>
                  {[
                    'You\'ll receive a verification email',
                    'Click the link to activate your account',
                    'Complete your guide profile to start accepting bookings',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-5 w-5 shrink-0 items-center
                        justify-center rounded-full bg-[#00ef9d] text-[10px]
                        font-black text-[#0b3a2c] mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{item}</p>
                    </div>
                  ))}
                </div>

                {/* Terms checkbox */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input type="checkbox" required
                    className="mt-1 h-4 w-4 rounded border-gray-300
                      text-[#0b3a2c] focus:ring-[#0b3a2c]" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By registering I agree to Ourika Travels'{' '}
                    <Link href="/terms"
                      className="underline font-semibold text-gray-700">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy"
                      className="underline font-semibold text-gray-700">
                      Privacy Policy
                    </Link>
                  </p>
                </label>

                {submitError && (
                  <div className="flex items-center gap-2 rounded-xl
                    border border-red-100 bg-red-50 px-4 py-3
                    text-sm font-medium text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {submitError}
                  </div>
                )}
              </div>
            )}

            {/* ─── NAVIGATION ──────────────────────────────── */}
            <div className="mt-8 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 text-sm font-bold
                    text-gray-500 hover:text-[#0b3a2c] transition-colors">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={step === 3 ? submitRegistration : () => {
                  // Validate step 1 before moving to step 2
                  if (step === 1) {
                    const e: Record<string, string> = {};
                    if (!form.firstName.trim()) e.firstName = 'Required';
                    if (!form.lastName.trim())  e.lastName  = 'Required';
                    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
                      e.email = 'Valid email required';
                    if (form.password.length < 8)
                      e.password = 'Min 8 characters';
                    if (form.password !== form.confirmPassword)
                      e.confirmPassword = "Passwords don't match";
                    setErrors(e);
                    if (Object.keys(e).length > 0) return;
                  }
                  // Validate step 2 before moving to step 3
                  if (step === 2) {
                    const e: Record<string, string> = {};
                    if (!form.phone.trim()) e.phone = 'Required';
                    setErrors(e);
                    if (Object.keys(e).length > 0) return;
                  }
                  setStep(s => s + 1);
                }}
                disabled={step === 3 && isPending}
                className="flex items-center gap-2 rounded-full bg-[#0b3a2c]
                  px-8 py-3.5 text-sm font-black text-white shadow-lg
                  shadow-[#0b3a2c]/20 transition-all hover:bg-[#0d4a38]
                  active:scale-95 disabled:opacity-60">
                {step === 3
                  ? isPending
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                    : 'Complete registration'
                  : <>Continue <ArrowRight className="h-4 w-4" /></>
                }
              </button>
            </div>

            {/* Sign in link */}
            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login"
                className="font-bold text-[#0b3a2c] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

