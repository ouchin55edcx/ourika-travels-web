"use client";
import { useState } from "react";
import BookingSummaryCard from "./components/BookingSummaryCard";
import ContactDetailsForm from "./components/ContactDetailsForm";
import ReservationAccordion from "./components/ReservationAccordion";
import BookingTicket from "./components/BookingTicket";
import {
  Clock,
  MapPin,
  CheckCircle,
  Info,
  HandCoins,
  Download,
  CreditCard,
  Wallet,
} from "lucide-react";

function ActivityDetails() {
  return (
    <div className="space-y-6 text-gray-700">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-emerald-50 p-2">
          <MapPin className="h-5 w-5 text-[#0b3a2c]" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Meeting point</h4>
          <p className="mt-1 text-sm">
            Place Jemaa el-Fnaa, Marrakech. Beside the main post office. Your guide will be wearing
            a green "Ourika Travels" vest.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-emerald-50 p-2">
          <Clock className="h-5 w-5 text-[#0b3a2c]" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Duration & Schedule</h4>
          <p className="mt-1 text-sm">
            7 hours total journey. Please arrive 15 minutes before the 3:00 PM start time.
          </p>
        </div>
      </div>

      <div className="pl-14">
        <h4 className="mb-2 font-bold text-gray-900">What's included</h4>
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {[
            "Professional guide",
            "Transportation by 4x4",
            "Berber dinner",
            "Camel ride",
            "Quad biking experience",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
        <Info className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-800">
          <strong>Important:</strong> Bring comfortable walking shoes for the hike component. Local
          taxes and tips are not included in the total price.
        </p>
      </div>
    </div>
  );
}

function PaymentDetails({ onReserve }: { onReserve: () => void }) {
  const [method, setMethod] = useState<"later" | "card">("later");

  return (
    <div className="space-y-6">
      <p className="font-medium text-gray-700">Choose how you'd like to pay for your experience:</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          onClick={() => setMethod("later")}
          className={`flex flex-col items-start rounded-2xl border-2 p-5 transition-all ${method === "later" ? "border-[#0b3a2c] bg-[#f0f9f6]" : "border-gray-200 bg-white hover:border-gray-300"}`}
        >
          <div className="mb-3 flex w-full items-center justify-between">
            <div className="rounded-lg bg-white p-2 shadow-sm">
              <HandCoins className="h-6 w-6 text-[#0b3a2c]" />
            </div>
            {method === "later" && (
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0b3a2c] p-0.5">
                <div className="h-full w-full rounded-full bg-white" />
              </div>
            )}
          </div>
          <h4
            className={`font-bold transition-colors ${method === "later" ? "text-[#0b3a2c]" : "text-gray-900"}`}
          >
            Pay at Start
          </h4>
          <p className="mt-1 text-left text-xs leading-relaxed text-gray-500">
            Confirm your spot now for free and pay the full $65.72 when you meet your guide.
          </p>
        </button>

        <button
          onClick={() => setMethod("card")}
          className={`flex flex-col items-start rounded-2xl border-2 p-5 transition-all ${method === "card" ? "border-[#0b3a2c] bg-[#f0f9f6]" : "border-gray-200 bg-white hover:border-gray-300"}`}
        >
          <div className="mb-3 flex w-full items-center justify-between">
            <div className="rounded-lg bg-white p-2 text-gray-400 shadow-sm">
              <div className="flex items-center gap-1">
                <CreditCard className="h-6 w-6" />
                <Wallet className="h-4 w-4 opacity-50" />
              </div>
            </div>
            {method === "card" && (
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0b3a2c] p-0.5">
                <div className="h-full w-full rounded-full bg-white" />
              </div>
            )}
          </div>
          <h4
            className={`font-bold transition-colors ${method === "card" ? "text-[#0b3a2c]" : "text-gray-400"}`}
          >
            Pay with Card
          </h4>
          <p className="mt-1 text-left text-xs leading-relaxed text-gray-400 opacity-60">
            Coming soon! Instant secure payment with Visa, Mastercard or Apple Pay.
          </p>
        </button>
      </div>

      <div className="pt-4">
        <div className="mb-8 flex items-start gap-4">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0b3a2c] focus:ring-[#0b3a2c]"
            defaultChecked
          />
          <label htmlFor="terms" className="text-xs leading-relaxed text-gray-500">
            By clicking "Complete Reservation", I agree to Ourika Travels'{" "}
            <span className="font-medium text-gray-700 underline">Terms of Service</span> and{" "}
            <span className="font-medium text-gray-700 underline">Cancellation Policy</span>. I
            understand I am booking a spot and am committed to paying at the start of the activity.
          </label>
        </div>

        <button
          disabled={method === "card"}
          onClick={onReserve}
          className="w-full rounded-full bg-gray-900 px-8 py-4 text-lg font-black text-white transition-all hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
        >
          Complete Reservation
        </button>
      </div>
    </div>
  );
}

export default function ReservationPage() {
  const [showTicket, setShowTicket] = useState(false);

  const handleReserve = () => {
    const bookingId = "OT-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    const newBooking = {
      id: bookingId,
      activityTitle: "Dinner Show in Agafay Desert with Quad Bike & Camels",
      date: "Saturday, March 28, 2026",
      time: "3:00 PM",
      guests: "2 adults",
      totalPrice: "$65.72",
      customerName: "Traveler Name",
      status: "Unpaid",
      timestamp: Date.now(),
    };

    // Save to history
    const existing = JSON.parse(localStorage.getItem("ourika_bookings") || "[]");
    localStorage.setItem("ourika_bookings", JSON.stringify([...existing, newBooking]));

    setShowTicket(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-[#34e0a1] selection:text-black">
      {showTicket && (
        <BookingTicket
          bookingId="OT-2026-X842"
          activityTitle="Dinner Show in Agafay Desert with Quad Bike & Camels"
          date="Saturday, March 28, 2026"
          time="3:00 PM"
          guests="2 adults"
          totalPrice="$65.72"
          customerName="Traveler Name"
          onClose={() => setShowTicket(false)}
        />
      )}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-[22px] font-black text-[#0b3a2c] sm:text-[24px]">Ourika Travels</p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white lg:hidden">
              <details>
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-800">
                  <span>Order summary</span>
                  <span className="text-[#0b3a2c]">$65.72</span>
                </summary>
                <div className="border-t border-gray-200 px-4 py-4 text-sm text-gray-700">
                  <p className="font-semibold text-gray-700">
                    Marrakech: Dinner Show in Agafay Desert with Quad Bike & Camels
                  </p>
                  <div className="mt-3 space-y-2">
                    <p>Saturday, March 28, 2026 • 3:00 PM</p>
                    <p>2 adults</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between font-semibold text-gray-700">
                    <span>Total</span>
                    <span>$65.72</span>
                  </div>
                </div>
              </details>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <ReservationAccordion step={1} title="Contact details" isOpen={true}>
                <ContactDetailsForm />
              </ReservationAccordion>

              <ReservationAccordion step={2} title="Activity details" isOpen={true}>
                <ActivityDetails />
              </ReservationAccordion>

              <ReservationAccordion step={3} title="Payment details" isOpen={true}>
                <PaymentDetails onReserve={handleReserve} />
              </ReservationAccordion>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="sticky top-10">
              <BookingSummaryCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
