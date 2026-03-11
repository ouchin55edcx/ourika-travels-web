"use client";

import { Info } from "lucide-react";

function FormField({
  label,
  children,
  required = false,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function ContactDetailsForm({
  showActions = true,
}: {
  showActions?: boolean;
}) {
  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        We'll use this information to send you confirmation and updates about
        your booking.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="First Name" required>
          <input
            type="text"
            placeholder="First name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
          />
        </FormField>
        <FormField label="Last Name" required>
          <input
            type="text"
            placeholder="Last name"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
          />
        </FormField>
      </div>
      <FormField label="Email" required>
        <div className="relative">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-green-500 focus:ring-green-500"
          />
          <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </FormField>
      <FormField label="Phone Number" required>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
          <select className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 focus:border-green-500 focus:ring-green-500 sm:w-auto sm:rounded-r-none sm:border-r-0">
            <option>United States (+1)</option>
            <option>United Kingdom (+44)</option>
            <option>Morocco (+212)</option>
          </select>
          <input
            type="tel"
            placeholder="Phone number"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 sm:flex-1 sm:rounded-l-none"
          />
        </div>
      </FormField>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="sms-updates"
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="sms-updates" className="ml-2 text-sm text-gray-700">
          Receive SMS updates about your booking. Message rates may apply.
        </label>
      </div>
      {showActions ? (
        <div className="flex justify-end">
          <button className="w-full rounded-full bg-gray-800 text-white font-bold px-8 py-3 transition hover:bg-gray-900 sm:w-auto">
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
