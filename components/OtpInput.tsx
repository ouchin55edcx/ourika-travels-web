"use client";

import { useRef } from "react";

type Props = {
  value: string[];
  length?: number;
  onChange: (val: string[]) => void;
  error?: boolean;
};

export default function OtpInput({ value, length = 8, onChange, error }: Props) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(index: number, char: string) {
    if (!/^\d?$/.test(char)) return;
    const next = [...value];
    next[index] = char;
    onChange(next);
    if (char && index < length - 1) inputRefs.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const digits = e.clipboardData?.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    const next = Array(length).fill("");
    digits.split("").forEach((d, i) => {
      next[i] = d;
    });
    onChange(next);
    const lastFilled = Math.min(digits.length, length - 1);
    inputRefs.current[lastFilled]?.focus();
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {Array(length)
        .fill(null)
        .map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] ?? ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(e)}
            className={`h-12 w-10 rounded-xl border-2 text-center text-xl font-black transition-all outline-none sm:h-14 sm:w-12 sm:text-2xl ${
              value[i]
                ? "border-[#0a2e1a] bg-[#edf7f1] text-[#0a2e1a]"
                : "border-gray-200 bg-gray-50 text-gray-900"
            } ${error ? "border-red-400 bg-red-50" : ""} focus:border-[#0a2e1a] focus:ring-2 focus:ring-[#0a2e1a]/10`}
          />
        ))}
    </div>
  );
}
