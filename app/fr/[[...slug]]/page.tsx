import Link from "next/link";
import NavbarWrapper from "@/app/components/NavbarWrapper";
import Footer from "@/components/Footer";
import { BASE_URL } from "@/lib/config";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function FrenchPlaceholderPage({ params }: Props) {
  const resolved = await params;
  const englishPath = resolved.slug?.length ? `/${resolved.slug.join("/")}` : "/";

  return (
    <div className="min-h-screen bg-[#f7faf9] selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper sticky={false} />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-full rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-black tracking-[0.22em] text-[#0b3a2c] uppercase">
            Version francaise
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#0a2e1a] sm:text-4xl">
            La version francaise arrive bientot
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Cette page sera disponible en francais prochainement. En attendant, la version
            anglaise contient les memes experiences, tarifs et details de reservation.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={englishPath}
              className="inline-flex items-center justify-center rounded-full bg-[#0b3a2c] px-7 py-3 text-sm font-black text-white"
            >
              View English page
            </Link>
            <Link
              href={BASE_URL}
              className="inline-flex items-center justify-center rounded-full border-2 border-[#0b3a2c] px-7 py-3 text-sm font-black text-[#0b3a2c]"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
