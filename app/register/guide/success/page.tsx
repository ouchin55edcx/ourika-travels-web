import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function GuideSuccessPage({
  searchParams,
}: {
  searchParams?: { email?: string };
}) {
  const email = searchParams?.email ? decodeURIComponent(searchParams.email) : null;

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-[#34e0a1] selection:text-black">
      <header className="fixed top-0 right-0 left-0 z-[100] border-b border-gray-200 bg-white shadow-sm">
        <div className="relative mx-auto flex h-16 max-w-[1280px] items-center justify-center px-6 md:justify-between">
          <Link href="/" className="group hidden flex-col items-start leading-none md:flex">
            <span className="text-[20px] font-black tracking-tighter text-[#0b3a2c] md:text-[22px]">
              Ourika Travels
            </span>
            <span className="mt-0.5 text-[9px] font-black tracking-[0.2em] text-[#0b3a2c] uppercase opacity-70">
              Local Partner
            </span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[90vh] max-w-[560px] flex-col items-center justify-center px-6 pt-20 pb-20 text-center">
        <div className="rounded-3xl border border-emerald-100 bg-white px-8 py-12 shadow-[0_30px_60px_rgba(0,0,0,0.06)]">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-[#004f32]">
            Account created! Please verify your email.
          </h1>
          <p className="mt-3 text-sm font-medium text-gray-600">
            We sent a verification email{email ? " to " : ""}
            {email ? <span className="font-bold text-[#004f32]">{email}</span> : ""}.
            Click the link to activate your guide profile.
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-[#004f32] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#003d27]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
