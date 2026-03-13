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
        className="flex cursor-pointer items-center gap-4 p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 font-bold text-white">
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
