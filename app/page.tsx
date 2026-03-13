import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Interests from "@/components/Interests";
import Experiences from "@/components/Experiences";
import TouristHighlight from "@/components/TouristHighlight";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#34e0a1] selection:text-black">
      <Navbar />
      <main className="flex flex-col">
        <Hero />
        <div className="relative mt-2 space-y-0">
          <Interests />
          <Experiences />
          <TouristHighlight />
        </div>
      </main>
      <Footer />
    </div>
  );
}
