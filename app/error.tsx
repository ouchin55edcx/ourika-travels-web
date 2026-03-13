"use client";

import { useEffect } from "react";
import Link from "next/link";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="flex min-h-screen items-center justify-center px-6 py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h1 className="text-3xl font-black text-[#004f32] md:text-4xl">Something went wrong</h1>
          <p className="mt-3 text-base font-medium text-slate-600 md:text-lg">
            We&apos;re working on it. Please try again.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-full bg-[#004f32] px-8 py-3 text-sm font-black tracking-wide text-white uppercase shadow-sm transition-colors hover:bg-[#003d27]"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-[#004f32] px-8 py-3 text-sm font-black tracking-wide text-[#004f32] uppercase transition-colors hover:bg-[#004f32] hover:text-white"
            >
              Go home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
