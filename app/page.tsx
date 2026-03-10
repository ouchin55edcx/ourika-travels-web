import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Interests from "./components/Interests";
import Experiences from "./components/Experiences";
import TouristHighlight from "./components/TouristHighlight";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#34e0a1] selection:text-black">
      <Navbar />
      <main className="flex flex-col gap-2">
        <Hero />
        <Interests />
        <Experiences />
        <TouristHighlight />
      </main>
      <Footer />
    </div>
  );
}
