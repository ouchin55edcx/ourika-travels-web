"use client";
import Image from "next/image";
import {
  Clock,
  Calendar,
  Users,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

export default function BookingSummaryCard() {
  return (
    <aside className="w-full lg:w-[380px] lg:self-start lg:sticky lg:top-6 text-gray-700">
      <div className="rounded-2xl border border-[#d9d9d9] bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:p-5">
        <div className="flex gap-4 mb-4">
          <div className="relative w-32 h-24 rounded-lg overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=200&auto=format&fit=crop"
              alt="Marrakech: Dinner Show in Agafay Desert"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight text-[#1a1a1a]">
              Marrakech: Dinner Show in Agafay Desert with Quad Bike & Camels
            </h3>
            <div className="flex items-center gap-1 mt-1 text-gray-700">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i < 4 ? "text-green-500" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-700">(3,603)</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">By Mohamed</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-4 text-gray-700">
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-gray-700" />
            <span>Dinner Show in Agafay Desert with Quad Bike & Camels</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-700" />
            <span>Saturday, March 28, 2026 • 3:00 PM</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Users className="w-4 h-4 text-gray-700" />
            <span>2 adults</span>
          </div>
          <button className="text-sm font-semibold text-gray-700 underline">
            Change
          </button>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="flex items-center gap-3 text-sm text-green-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Free cancellation before 3:00 PM on March 27</span>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 text-gray-700">
          <p className="font-semibold mb-2">Promo code</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
            />
            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">
              Apply
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center font-bold text-lg text-gray-700">
          <span>Total</span>
          <span>$65.72</span>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <p className="font-semibold text-gray-800">24/7 global support</p>
        <div className="flex items-center justify-between mt-2">
          <a
            href="tel:+18337642165"
            className="text-sm font-semibold text-blue-600"
          >
            +1 833 764 2165
          </a>
          <button className="flex items-center gap-2 text-sm font-semibold text-blue-600">
            <MessageSquare className="w-4 h-4" />
            <span>Chat now</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
