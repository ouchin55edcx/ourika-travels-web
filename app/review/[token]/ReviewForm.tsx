"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "@/app/actions/reviews";

type RatingField = "rating" | "rating_guide" | "rating_value" | "rating_service";

type Props = {
  token: string;
  initialRating?: number;
  trekTitle: string;
};

function RatingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-[#0a2e1a]">{label}</p>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="rounded-full p-1 transition hover:bg-[#f1f5f2]"
            aria-label={`Set ${label} rating to ${star}`}
          >
            <Star
              className={`h-5 w-5 ${
                star <= value ? "fill-amber-400 text-amber-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewForm({ token, initialRating = 5, trekTitle }: Props) {
  const [formState, setFormState] = useState({
    rating: initialRating,
    rating_guide: 5,
    rating_value: 5,
    rating_service: 5,
    title: "",
    body: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const updateRating = (field: RatingField, value: number) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const payload = {
      rating: formState.rating,
      title: formState.title.trim() || undefined,
      body: formState.body.trim(),
      rating_guide: formState.rating_guide,
      rating_value: formState.rating_value,
      rating_service: formState.rating_service,
    };

    if (!payload.body) {
      setStatus("error");
      setError("Please share a few words about your experience.");
      return;
    }

    const result = await submitReview(token, payload);
    if ("error" in result) {
      setStatus("error");
      setError(result.error);
      return;
    }

    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6 text-center sm:p-8">
        <h3 className="text-2xl font-black text-[#0b3a2c]">Thanks for your review!</h3>
        <p className="mt-2 text-sm text-emerald-700">
          Your feedback has been submitted for moderation. It will appear once approved.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-[#0a2e1a]">Share your experience</h2>
        <p className="text-sm text-gray-500">
          How was {trekTitle}? Your review helps other travelers.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <RatingRow
          label="Overall rating"
          value={formState.rating}
          onChange={(value) => updateRating("rating", value)}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <RatingRow
            label="Guide"
            value={formState.rating_guide}
            onChange={(value) => updateRating("rating_guide", value)}
          />
          <RatingRow
            label="Value"
            value={formState.rating_value}
            onChange={(value) => updateRating("rating_value", value)}
          />
          <RatingRow
            label="Service"
            value={formState.rating_service}
            onChange={(value) => updateRating("rating_service", value)}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <input
          type="text"
          placeholder="Review title (optional)"
          value={formState.title}
          onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
          className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#0b3a2c]"
        />
        <textarea
          placeholder="Tell us what you loved, and what we can improve."
          rows={6}
          value={formState.body}
          onChange={(event) => setFormState((prev) => ({ ...prev, body: event.target.value }))}
          className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-[#0b3a2c]"
        />
      </div>

      {status === "error" && error ? (
        <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-gray-400">
          By submitting, you agree to Ourika Travels review guidelines.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-full bg-[#0b3a2c] px-8 py-3 text-sm font-black text-white transition hover:bg-[#0f3d24] disabled:opacity-50"
        >
          {status === "submitting" ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </form>
  );
}
