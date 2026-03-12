"use client";
import { useState } from "react";
import BookingSummaryCard from "./components/BookingSummaryCard";
import ContactDetailsForm from "./components/ContactDetailsForm";
import ReservationAccordion from "./components/ReservationAccordion";
import BookingTicket from "./components/BookingTicket";
import { Clock, MapPin, CheckCircle, Info, HandCoins, Download, CreditCard, Wallet } from "lucide-react";

function ActivityDetails() {
  return (
    <div className="space-y-6 text-gray-700">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-emerald-50 rounded-xl">
          <MapPin className="w-5 h-5 text-[#0b3a2c]" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Meeting point</h4>
          <p className="text-sm mt-1">Place Jemaa el-Fnaa, Marrakech. Beside the main post office. Your guide will be wearing a green "Ourika Travels" vest.</p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="p-2 bg-emerald-50 rounded-xl">
          <Clock className="w-5 h-5 text-[#0b3a2c]" />
        </div>
        <div>
          <h4 className="font-bold text-gray-900">Duration & Schedule</h4>
          <p className="text-sm mt-1">7 hours total journey. Please arrive 15 minutes before the 3:00 PM start time.</p>
        </div>
      </div>

      <div className="pl-14">
        <h4 className="font-bold text-gray-900 mb-2">What's included</h4>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {["Professional guide", "Transportation by 4x4", "Berber dinner", "Camel ride", "Quad biking experience"].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Important:</strong> Bring comfortable walking shoes for the hike component. Local taxes and tips are not included in the total price.
        </p>
      </div>
    </div>
  );
}

function PaymentDetails({ onReserve }: { onReserve: () => void }) {
  const [method, setMethod] = useState<'later' | 'card'>('later');

  return (
    <div className="space-y-6">
      <p className="text-gray-700 font-medium">Choose how you'd like to pay for your experience:</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setMethod('later')}
          className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all ${method === 'later' ? 'border-[#0b3a2c] bg-[#f0f9f6]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <HandCoins className="w-6 h-6 text-[#0b3a2c]" />
            </div>
            {method === 'later' && <div className="w-4 h-4 rounded-full bg-[#0b3a2c] flex items-center justify-center p-0.5"><div className="w-full h-full rounded-full bg-white" /></div>}
          </div>
          <h4 className={`font-bold transition-colors ${method === 'later' ? 'text-[#0b3a2c]' : 'text-gray-900'}`}>Pay at Start</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed text-left">Confirm your spot now for free and pay the full $65.72 when you meet your guide.</p>
        </button>

        <button
          onClick={() => setMethod('card')}
          className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all ${method === 'card' ? 'border-[#0b3a2c] bg-[#f0f9f6]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
        >
          <div className="flex items-center justify-between w-full mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
              <div className="flex gap-1 items-center">
                <CreditCard className="w-6 h-6" />
                <Wallet className="w-4 h-4 opacity-50" />
              </div>
            </div>
            {method === 'card' && <div className="w-4 h-4 rounded-full bg-[#0b3a2c] flex items-center justify-center p-0.5"><div className="w-full h-full rounded-full bg-white" /></div>}
          </div>
          <h4 className={`font-bold transition-colors ${method === 'card' ? 'text-[#0b3a2c]' : 'text-gray-400'}`}>Pay with Card</h4>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed text-left opacity-60">Coming soon! Instant secure payment with Visa, Mastercard or Apple Pay.</p>
        </button>
      </div>

      <div className="pt-4">
        <div className="flex items-start gap-4 mb-8">
          <input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0b3a2c] focus:ring-[#0b3a2c]" defaultChecked />
          <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
            By clicking "Complete Reservation", I agree to Ourika Travels' <span className="underline text-gray-700 font-medium">Terms of Service</span> and <span className="underline text-gray-700 font-medium">Cancellation Policy</span>. I understand I am booking a spot and am committed to paying at the start of the activity.
          </label>
        </div>

        <button
          disabled={method === 'card'}
          onClick={onReserve}
          className="w-full rounded-full bg-gray-900 text-white font-black px-8 py-4 text-lg hover:bg-black transition-all active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
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
      timestamp: Date.now()
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
          <p className="text-[22px] font-black text-[#0b3a2c] sm:text-[24px]">
            Ourika Travels
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white lg:hidden">
              <details>
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-800">
                  <span>Order summary</span>
                  <span className="text-[#0b3a2c]">$65.72</span>
                </summary>
                <div className="border-t border-gray-200 px-4 py-4 text-sm text-gray-700">
                  <p className="font-semibold text-gray-700">
                    Marrakech: Dinner Show in Agafay Desert with Quad Bike &
                    Camels
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
              <ReservationAccordion
                step={1}
                title="Contact details"
                isOpen={true}
              >
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
          <div className="hidden lg:block relative">
            <div className="sticky top-10">
              <BookingSummaryCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

