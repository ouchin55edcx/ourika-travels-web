import Link from "next/link";
import { ShieldX } from "lucide-react";
import Navbar from "@/hooks/components/Navbar";
import Footer from "@/hooks/components/Footer";

export const metadata = { title: "Access Denied | Ourika Travels" };

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
          <ShieldX className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-semibold text-[#004f32]">Access denied</h1>
        <p className="mt-3 text-sm text-slate-600">
          You don&apos;t have permission to view this page.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-[#004f32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#004029]"
          >
            Go home
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center rounded-lg border border-[#004f32] px-6 py-3 text-sm font-semibold text-[#004f32] transition hover:bg-[#004f32]/10"
          >
            Sign in with a different account
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
