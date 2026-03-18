import Link from "next/link";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <NavbarWrapper />
      <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="text-[96px] leading-none font-black text-[#004f32] md:text-[128px]">
            404
          </div>
          <h1 className="mt-4 text-3xl font-black text-[#004f32] md:text-4xl">Page not found</h1>
          <p className="mt-3 text-base font-medium text-slate-600 md:text-lg">
            The experience you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#004f32] px-8 py-3 text-sm font-black tracking-wide text-white uppercase shadow-sm transition-colors hover:bg-[#081f12]"
          >
            Explore experiences
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
