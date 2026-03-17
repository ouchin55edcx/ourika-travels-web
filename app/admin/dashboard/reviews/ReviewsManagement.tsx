"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
  Star,
  Check,
  X,
  Eye,
  Send,
  Loader2,
  Plus,
  ChevronDown,
  CheckCircle2,
  PenLine,
} from "lucide-react";
import {
  approveReview,
  rejectReview,
  sendReviewRequest,
  createManualReview,
} from "@/app/actions/reviews";

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "unsent";

function StarPicker({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState(0);
  const sz = size === "md" ? "h-7 w-7" : "h-5 w-5";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`${sz} transition-colors ${
              (hover || value) >= s
                ? "fill-[#00aa6c] text-[#00aa6c]"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= rating ? "fill-[#00aa6c] text-[#00aa6c]" : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

const INPUT = `w-full rounded-2xl border border-gray-200 bg-gray-50 px-4
  py-3 text-sm font-medium focus:border-[#0b3a2c] focus:bg-white
  focus:outline-none focus:ring-2 focus:ring-[#0b3a2c]/10 transition-all`;

export default function ReviewsManagement({
  initialReviews,
  treks,
}: {
  initialReviews: any[];
  treks: { id: string; title: string; slug: string }[];
}) {
  const [reviews, setReviews] = useState(initialReviews);
  const [statusFilter, setFilter] = useState<StatusFilter>("pending");
  const [selected, setSelected] = useState<any | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Manual form state
  const [form, setForm] = useState({
    trek_id: "",
    tourist_name: "",
    tourist_email: "",
    rating: 5,
    title: "",
    body: "",
    rating_guide: 0,
    rating_value: 0,
    rating_service: 0,
    status: "approved" as "pending" | "approved",
  });
  const [formError, setFormError] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function resetForm() {
    setForm({
      trek_id: "",
      tourist_name: "",
      tourist_email: "",
      rating: 5,
      title: "",
      body: "",
      rating_guide: 0,
      rating_value: 0,
      rating_service: 0,
      status: "approved",
    });
    setFormError(null);
  }

  function handleCreateReview() {
    setFormError(null);
    if (!form.trek_id) {
      setFormError("Select a trek");
      return;
    }
    if (!form.tourist_name) {
      setFormError("Enter tourist name");
      return;
    }
    if (!form.tourist_email) {
      setFormError("Enter tourist email");
      return;
    }
    if (!form.body || form.body.length < 10) {
      setFormError("Review must be at least 10 characters");
      return;
    }

    startTransition(async () => {
      const result = await createManualReview({
        trek_id: form.trek_id,
        tourist_name: form.tourist_name,
        tourist_email: form.tourist_email,
        rating: form.rating,
        title: form.title || undefined,
        body: form.body,
        rating_guide: form.rating_guide || undefined,
        rating_value: form.rating_value || undefined,
        rating_service: form.rating_service || undefined,
        status: form.status,
      });

      if ("error" in result) {
        setFormError(result.error);
        return;
      }

      showToast(`✓ Review ${form.status === "approved" ? "published" : "saved as pending"}`);
      setShowForm(false);
      resetForm();

      // Refresh reviews list
      window.location.reload();
    });
  }

  const filtered = reviews.filter((r) => {
    if (statusFilter === "unsent") return !r.body || r.body.length === 0;
    if (statusFilter === "pending") return r.status === "pending" && r.body?.length > 0;
    if (statusFilter === "all") return r.body?.length > 0;
    return r.status === statusFilter;
  });

  const RATING_LABEL: Record<number, string> = {
    1: "Terrible",
    2: "Poor",
    3: "Average",
    4: "Good",
    5: "Excellent",
  };

  return (
    <div className="space-y-6">
      {/* ── MANUAL REVIEW FORM ────────────────────────────── */}
      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
        {/* Header / toggle */}
        <button
          onClick={() => {
            setShowForm((v) => !v);
            resetForm();
          }}
          className="flex w-full items-center justify-between px-6 py-5 transition-colors hover:bg-gray-50/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0b3a2c]/10">
              <PenLine className="h-5 w-5 text-[#0b3a2c]" />
            </div>
            <div className="text-left">
              <p className="font-black text-[#0b3a2c]">Add a review manually</p>
              <p className="text-xs font-medium text-gray-500">
                Post a review on behalf of a tourist for any trek
              </p>
            </div>
          </div>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${showForm ? "bg-[#0b3a2c] text-white" : "bg-gray-100 text-gray-500"}`}
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
        </button>

        {/* Form body */}
        {showForm && (
          <div className="animate-in fade-in slide-in-from-top-2 space-y-5 border-t border-gray-100 px-6 py-6 duration-200">
            {/* Trek selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black tracking-widest text-gray-500 uppercase">
                Trek *
              </label>
              <select
                value={form.trek_id}
                onChange={(e) => setForm((p) => ({ ...p, trek_id: e.target.value }))}
                className={INPUT}
              >
                <option value="">Select a trek...</option>
                {treks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Tourist info — two columns */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-black tracking-widest text-gray-500 uppercase">
                  Tourist name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sophie Martin"
                  value={form.tourist_name}
                  onChange={(e) => setForm((p) => ({ ...p, tourist_name: e.target.value }))}
                  className={INPUT}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black tracking-widest text-gray-500 uppercase">
                  Tourist email *
                </label>
                <input
                  type="email"
                  placeholder="e.g. sophie@email.com"
                  value={form.tourist_email}
                  onChange={(e) => setForm((p) => ({ ...p, tourist_email: e.target.value }))}
                  className={INPUT}
                />
              </div>
            </div>

            {/* Overall rating */}
            <div className="space-y-2">
              <label className="text-xs font-black tracking-widest text-gray-500 uppercase">
                Overall rating *
              </label>
              <div className="flex items-center gap-4">
                <StarPicker
                  value={form.rating}
                  onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
                  size="md"
                />
                {form.rating > 0 && (
                  <span className="text-sm font-black text-[#0b3a2c]">
                    {RATING_LABEL[form.rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Review title (optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-black tracking-widest text-gray-500 uppercase">
                Review title
                <span className="ml-2 font-medium text-gray-400 normal-case">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Unforgettable day in the Atlas Mountains"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                maxLength={100}
                className={INPUT}
              />
            </div>

            {/* Review body */}
            <div className="space-y-1.5">
              <label className="text-xs font-black tracking-widest text-gray-500 uppercase">
                Review text *
              </label>
              <textarea
                rows={5}
                placeholder="Write the review experience here..."
                value={form.body}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                className={`${INPUT} resize-none`}
              />
              <p
                className={`text-right text-xs font-medium ${form.body.length < 10 ? "text-amber-500" : "text-emerald-600"}`}
              >
                {form.body.length} characters
              </p>
            </div>

            {/* Sub-ratings */}
            <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <p className="text-xs font-black tracking-widest text-gray-400 uppercase">
                Sub-ratings (optional)
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { key: "rating_guide", label: "Guide" },
                  { key: "rating_value", label: "Value" },
                  { key: "rating_service", label: "Service" },
                ].map((sub) => (
                  <div key={sub.key} className="space-y-1.5">
                    <p className="text-xs font-bold text-gray-500">{sub.label}</p>
                    <StarPicker
                      value={form[sub.key as keyof typeof form] as number}
                      onChange={(v) => setForm((p) => ({ ...p, [sub.key]: v }))}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Publish status toggle */}
            <div className="flex items-center gap-4">
              <p className="shrink-0 text-xs font-black tracking-widest text-gray-500 uppercase">
                Publish as
              </p>
              <div className="flex gap-2">
                {(["approved", "pending"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((p) => ({ ...p, status: s }))}
                    className={`rounded-full px-4 py-2 text-xs font-black transition-all ${
                      form.status === s
                        ? s === "approved"
                          ? "border-2 border-emerald-300 bg-emerald-100 text-emerald-700"
                          : "border-2 border-amber-300 bg-amber-100 text-amber-700"
                        : "border-2 border-transparent bg-gray-100 text-gray-500"
                    }`}
                  >
                    {s === "approved" ? "✓ Published immediately" : "⏳ Pending moderation"}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {formError && (
              <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                <X className="h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 border-t border-gray-100 pt-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateReview}
                disabled={isPending}
                className="flex items-center gap-2 rounded-full bg-[#0b3a2c] px-6 py-2.5 text-sm font-black text-white shadow-sm transition-all hover:bg-[#0d4a38] active:scale-95 disabled:opacity-60"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <PenLine className="h-4 w-4" />
                )}
                {form.status === "approved" ? "Publish review" : "Save as pending"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── FILTER TABS ────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {(["pending", "all", "approved", "rejected", "unsent"] as StatusFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
              statusFilter === f
                ? "bg-[#0b3a2c] text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:border-[#0b3a2c]"
            }`}
          >
            {f === "unsent" ? "Not sent yet" : f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-2 text-xs opacity-70">
              (
              {f === "unsent"
                ? reviews.filter((r) => !r.body || r.body.length === 0).length
                : f === "all"
                  ? reviews.filter((r) => r.body?.length > 0).length
                  : reviews.filter((r) => r.status === f && r.body?.length > 0).length}
              )
            </span>
          </button>
        ))}
      </div>

      {/* ── REVIEWS TABLE ─────────────────────────────────── */}
      <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <span className="text-4xl">⭐</span>
            <p className="mt-4 text-lg font-black text-gray-300">No reviews in this category</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {["Trek", "Tourist", "Rating", "Review", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 text-left text-[11px] font-black tracking-widest text-gray-400 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((review) => (
                <tr key={review.id} className="group transition-colors hover:bg-[#f7fdf9]">
                  {/* Trek */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {review.treks?.cover_image && (
                        <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={review.treks.cover_image}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="line-clamp-2 max-w-[120px] text-xs font-bold text-[#0b3a2c]">
                        {review.treks?.title ?? "—"}
                      </p>
                    </div>
                  </td>

                  {/* Tourist */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">{review.tourist_name}</p>
                    <p className="text-[11px] text-gray-400">{review.tourist_email}</p>
                  </td>

                  {/* Rating */}
                  <td className="px-5 py-4">
                    {review.rating && review.body ? (
                      <div className="space-y-1">
                        <RatingStars rating={review.rating} />
                        <p className="text-xs font-black text-gray-600">{review.rating}/5</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not submitted</span>
                    )}
                  </td>

                  {/* Review excerpt */}
                  <td className="max-w-[200px] px-5 py-4">
                    {review.body ? (
                      <div>
                        {review.title && (
                          <p className="mb-0.5 line-clamp-1 text-xs font-bold text-gray-800">
                            "{review.title}"
                          </p>
                        )}
                        <p className="line-clamp-2 text-xs text-gray-500">{review.body}</p>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-amber-600">Awaiting tourist</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-black tracking-wide uppercase ${
                        review.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : review.status === "rejected"
                            ? "bg-red-100 text-red-600"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {review.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => {
                          setSelected(review);
                          setShowReject(false);
                          setRejectNote("");
                        }}
                        className="flex items-center gap-1 rounded-full border border-gray-200 px-3 py-1.5 text-[11px] font-bold text-gray-600 transition-all hover:border-[#0b3a2c] hover:text-[#0b3a2c]"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      {/* Quick approve */}
                      {review.body && review.body.length > 0 && review.status !== "approved" && (
                        <button
                          onClick={() =>
                            startTransition(async () => {
                              const r = await approveReview(review.id);
                              if ("success" in r) {
                                setReviews((prev) =>
                                  prev.map((rv) =>
                                    rv.id === review.id ? { ...rv, status: "approved" } : rv,
                                  ),
                                );
                                showToast("✓ Review approved");
                              }
                            })
                          }
                          disabled={isPending}
                          className="flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-50"
                        >
                          <Check className="h-3 w-3" />
                          Approve
                        </button>
                      )}

                      {/* Send email if not submitted */}
                      {(!review.body || review.body.length === 0) && (
                        <button
                          onClick={() =>
                            startTransition(async () => {
                              const r = await sendReviewRequest(review.booking_id);
                              if ("success" in r) showToast("Email sent ✓");
                              else showToast("❌ " + r.error);
                            })
                          }
                          disabled={isPending}
                          className="flex items-center gap-1 rounded-full bg-[#0b3a2c] px-3 py-1.5 text-[11px] font-black text-[#00ef9d] transition-all hover:bg-[#0d4a38] disabled:opacity-50"
                        >
                          <Send className="h-3 w-3" />
                          Send email
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── DETAIL PANEL ──────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-[300] flex">
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setSelected(null);
              setShowReject(false);
            }}
          />
          <div className="animate-in slide-in-from-right flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl duration-300">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <h2 className="text-lg font-black text-[#0b3a2c]">Review detail</h2>
              <button
                onClick={() => {
                  setSelected(null);
                  setShowReject(false);
                }}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 space-y-5 px-6 py-6">
              {/* Trek */}
              {selected.treks && (
                <div className="flex items-center gap-4 rounded-2xl bg-gray-50 p-4">
                  {selected.treks.cover_image && (
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={selected.treks.cover_image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <p className="text-sm leading-snug font-black text-[#0b3a2c]">
                    {selected.treks.title}
                  </p>
                </div>
              )}

              {/* Tourist */}
              <div className="space-y-1.5 rounded-2xl bg-gray-50 p-4">
                <p className="mb-2 text-xs font-black tracking-widest text-gray-400 uppercase">
                  Tourist
                </p>
                <p className="font-bold text-gray-800">{selected.tourist_name}</p>
                <p className="text-sm text-gray-500">{selected.tourist_email}</p>
              </div>

              {/* Rating */}
              {selected.rating && selected.body && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <RatingStars rating={selected.rating} />
                    <span className="text-lg font-black text-[#0b3a2c]">{selected.rating}/5</span>
                  </div>

                  {(selected.rating_guide || selected.rating_value || selected.rating_service) && (
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Guide", val: selected.rating_guide },
                        { label: "Value", val: selected.rating_value },
                        { label: "Service", val: selected.rating_service },
                      ]
                        .filter((x) => x.val)
                        .map((x) => (
                          <div key={x.label} className="rounded-xl bg-gray-50 p-2.5 text-center">
                            <p className="mb-1 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                              {x.label}
                            </p>
                            <p className="text-sm font-black text-[#0b3a2c]">{x.val}/5</p>
                          </div>
                        ))}
                    </div>
                  )}

                  {selected.title && <p className="font-black text-gray-800">"{selected.title}"</p>}
                  <p className="rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-gray-600">
                    {selected.body}
                  </p>
                </div>
              )}

              {/* Status */}
              <span
                className={`inline-block rounded-full px-3 py-1 text-[11px] font-black tracking-wide uppercase ${
                  selected.status === "approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : selected.status === "rejected"
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                {selected.status}
              </span>

              <p className="text-xs text-gray-400">
                Submitted{" "}
                {new Date(selected.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Footer actions */}
            {selected.body && selected.body.length > 0 && selected.status !== "approved" && (
              <div className="sticky bottom-0 space-y-3 border-t border-gray-100 bg-white px-6 py-5">
                {showReject ? (
                  <div className="space-y-2">
                    <textarea
                      value={rejectNote}
                      onChange={(e) => setRejectNote(e.target.value)}
                      placeholder="Reason for rejection (optional)..."
                      rows={3}
                      className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-red-300 focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowReject(false)}
                        className="flex-1 rounded-full border border-gray-200 py-2.5 text-sm font-bold text-gray-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          startTransition(async () => {
                            const r = await rejectReview(selected.id, rejectNote);
                            if ("success" in r) {
                              setReviews((prev) =>
                                prev.map((rv) =>
                                  rv.id === selected.id ? { ...rv, status: "rejected" } : rv,
                                ),
                              );
                              setSelected(null);
                              setShowReject(false);
                              showToast("Review rejected");
                            }
                          })
                        }
                        disabled={isPending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 py-2.5 text-sm font-bold text-white disabled:opacity-50"
                      >
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Confirm reject"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowReject(true)}
                      className="flex-1 rounded-full border-2 border-red-200 bg-red-50 py-3 text-sm font-black text-red-500 transition-all hover:bg-red-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        startTransition(async () => {
                          const r = await approveReview(selected.id);
                          if ("success" in r) {
                            setReviews((prev) =>
                              prev.map((rv) =>
                                rv.id === selected.id ? { ...rv, status: "approved" } : rv,
                              ),
                            );
                            setSelected(null);
                            showToast("✓ Review approved and published");
                          }
                        })
                      }
                      disabled={isPending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0b3a2c] py-3 text-sm font-black text-[#00ef9d] transition-all hover:bg-[#0d4a38] disabled:opacity-60"
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Approve & publish
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-[400] flex items-center gap-2 rounded-2xl bg-[#0b3a2c] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          <CheckCircle2 className="h-4 w-4 text-[#00ef9d]" />
          {toast}
        </div>
      )}
    </div>
  );
}
