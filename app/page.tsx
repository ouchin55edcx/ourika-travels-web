import NavbarWrapper from "@/app/components/NavbarWrapper";
import Hero from "@/components/Hero";
import Interests from "@/components/Interests";
import Experiences from "@/components/Experiences";
import TouristHighlight from "@/components/TouristHighlight";
import Footer from "@/components/Footer";
import { getCategories } from "@/app/actions/categories";

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper />
      <main className="flex flex-col">
        <Hero />
        <div className="relative mt-2 space-y-0">
          <Interests initialCategories={categories} />
          <Experiences />

          <TouristHighlight />
        </div>
      </main>
      <Footer />
    </div>
  );
}
