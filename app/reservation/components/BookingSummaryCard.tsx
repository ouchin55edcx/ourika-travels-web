'use client';

import Image from 'next/image';
import { Clock, Calendar, Users, ShieldCheck, MessageSquare } from 'lucide-react';

type Props = {
  trek: {
    title: string;
    cover_image: string;
    rating: number;
    review_count: number;
    duration: string;
  };
  bookingType: 'group' | 'private';
  date: string;
  time: string;
  adults: number;
  children: number;
  pricePerAdult: number;
  pricePerChild: number;
  totalPrice: number;
  freeCancellationHours: number;
};

export default function BookingSummaryCard({
  trek,
  bookingType,
  date,
  time,
  adults,
  children,
  pricePerAdult,
  pricePerChild,
  totalPrice,
  freeCancellationHours,
}: Props) {
  const displayDate = date
    ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Select date';

  return (
    <aside className="w-full text-gray-700 lg:sticky lg:top-6 lg:w-[380px] lg:self-start">
      <div className="rounded-2xl border border-[#d9d9d9] bg-white p-4 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:p-5">
        <div className="mb-4 flex gap-4">
          <div className="relative h-24 w-32 overflow-hidden rounded-lg">
            <Image
              src={trek.cover_image}
              alt={trek.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg leading-tight font-bold text-[#1a1a1a] line-clamp-2">
              {trek.title}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-gray-700">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className={`h-3 w-3 ${i <= Math.round(trek.rating) ? 'text-green-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-700">({trek.review_count.toLocaleString()})</span>
            </div>
            <p className="mt-1 text-sm text-gray-600">{trek.duration}</p>
          </div>
        </div>

        <div className="space-y-3 border-t border-gray-200 pt-4 text-gray-700">
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold capitalize text-gray-700">
              {bookingType}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-gray-700 shrink-0" />
            <span>{trek.title}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-gray-700 shrink-0" />
            <span>{displayDate} {time ? `• ${time}` : ''}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Users className="h-4 w-4 text-gray-700 shrink-0" />
            <span>
              {adults} adult{adults !== 1 ? 's' : ''}
              {children > 0 ? ` + ${children} children` : ''}
            </span>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Adults × ${pricePerAdult.toFixed(2)}</span>
            <span>${(adults * pricePerAdult).toFixed(2)}</span>
          </div>
          {children > 0 && (
            <div className="mt-1 flex justify-between text-gray-600">
              <span>Children × ${pricePerChild.toFixed(2)}</span>
              <span>${(children * pricePerChild).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-3 text-sm text-green-700">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>Free cancellation up to {freeCancellationHours}h before start</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-700">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
        <p className="font-semibold text-gray-800">24/7 global support</p>
        <div className="mt-2 flex items-center justify-between">
          <a href="tel:+18337642165" className="text-sm font-semibold text-blue-600">
            +1 833 764 2165
          </a>
          <button type="button" className="flex items-center gap-2 text-sm font-semibold text-blue-600">
            <MessageSquare className="h-4 w-4" />
            <span>Chat now</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
