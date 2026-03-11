import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import WishlistExplorer from "./components/WishlistExplorer";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(140deg,_#f9f6ef_0%,_#f1f5f1_45%,_#eef2f7_100%)] font-sans selection:bg-[#34e0a1] selection:text-black">
      <Navbar sticky={false} />
      <main className="flex flex-col gap-2 pb-8">
        <WishlistExplorer />
      </main>
      <Footer />
    </div>
  );
}
