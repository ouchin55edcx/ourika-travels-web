import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ExperiencesExplorer from "./components/ExperiencesExplorer";

export default function ExperiencesPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#34e0a1] selection:text-black">
      <Navbar sticky={false} />
      <main className="flex flex-col gap-2 pb-8">
        <ExperiencesExplorer />
      </main>
      <Footer />
    </div>
  );
}
