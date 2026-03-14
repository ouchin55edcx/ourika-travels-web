import NavbarWrapper from "@/app/components/NavbarWrapper";
import Footer from "@/components/Footer";
import ReservationHistoricClient from "./ReservationHistoricClient";

export default function ReservationHistoricPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(140deg,_#f9f6ef_0%,_#f1f5f1_45%,_#eef2f7_100%)] text-[#0f1f18] selection:bg-[#34e0a1] selection:text-black">
      <NavbarWrapper sticky={false} />
      <ReservationHistoricClient />
      <Footer />
    </div>
  );
}
