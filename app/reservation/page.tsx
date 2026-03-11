"use client";

import BookingSummaryCard from "./components/BookingSummaryCard";
import ContactDetailsForm from "./components/ContactDetailsForm";
import ReservationAccordion from "./components/ReservationAccordion";

function ActivityDetails() {
  return (
    <div className="text-gray-600">
      <p>Details about the activity will be shown here.</p>
    </div>
  );
}

function PaymentDetails() {
  return (
    <div className="text-gray-600">
      <p>Payment details form will be shown here.</p>
    </div>
  );
}

export default function ReservationPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-[#34e0a1] selection:text-black">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-[22px] font-black text-[#0b3a2c] sm:text-[24px]">
            Ourika Travels
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8">
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

            <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:hidden">
              <h2 className="text-lg font-bold text-gray-800">
                Contact details
              </h2>
              <div className="mt-4">
                <ContactDetailsForm showActions={false} />
              </div>
              <div className="mt-6">
                <button className="w-full rounded-full bg-[#0b3a2c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#07261e]">
                  Next
                </button>
              </div>
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
                <div className="flex items-start gap-2 text-green-700">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-green-600 text-[11px]">
                    i
                  </span>
                  <p>
                    Free cancellation before 3:00 PM on March 27 (tour local
                    time)
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 text-sm">
                <p className="font-semibold text-gray-800">
                  24/7 global support
                </p>
                <div className="mt-2 flex items-center justify-between text-[#0b3a2c]">
                  <span className="font-semibold">+1 833 764 2165</span>
                  <button className="font-semibold">Chat now</button>
                </div>
              </div>
            </div>

            <div className="hidden space-y-6 lg:block">
              <ReservationAccordion
                step={1}
                title="Contact details"
                isOpen={true}
              >
                <ContactDetailsForm />
              </ReservationAccordion>
              <ReservationAccordion step={2} title="Activity details">
                <ActivityDetails />
              </ReservationAccordion>
              <ReservationAccordion step={3} title="Payment details">
                <PaymentDetails />
              </ReservationAccordion>
            </div>
          </div>
          <div className="hidden lg:block">
            <BookingSummaryCard />
          </div>
        </div>
      </main>
    </div>
  );
}
