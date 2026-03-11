"use client";

import { useState } from "react";

type ReservationAccordionProps = {
  step: number;
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
};

export default function ReservationAccordion({
  step,
  title,
  children,
  isOpen: defaultOpen = false,
}: ReservationAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-gray-200">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white font-bold">
          {step}
        </div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>
      {isOpen && (
        <div className="p-4 pt-0">
          <div className="border-t border-gray-200 pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}
