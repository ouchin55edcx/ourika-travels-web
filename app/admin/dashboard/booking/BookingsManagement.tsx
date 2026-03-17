"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Calendar,
  Clock,
  Users,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Loader2,
  DollarSign,
  Eye,
} from "lucide-react";
import {
  updateBookingStatus,
  markBookingPaid,
  assignGuide,
  autoAssignGuide,
  getActiveGuides,
} from "@/app/actions/bookings";

type Booking = any;

type StatusFilter = "all" | "pending" | "confirmed" | "cancelled" | "completed";
type PaymentFilter = "all" | "paid" | "unpaid";
type SourceFilter = "all" | "online" | "walkin" | "partner";

export default function BookingsManagement({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [payFilter, setPayFilter] = useState<PaymentFilter>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [guides, setGuides] = useState<any[]>([]);

  useEffect(() => {
    getActiveGuides().then(setGuides);
  }, []);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  }

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.tourist_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.tourist_email?.toLowerCase().includes(search.toLowerCase()) ||
      b.booking_ref?.toLowerCase().includes(search.toLowerCase()) ||
      b.treks?.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchPayment = payFilter === "all" || b.payment_status === payFilter;
    const matchSource = sourceFilter === "all" || b.source === sourceFilter;
    return matchSearch && matchStatus && matchPayment && matchSource;
  });

  function handleStatusChange(bookingId: string, newStatus: string) {
    startTransition(async () => {
      const result = await updateBookingStatus(bookingId, newStatus as any);
      if ("success" in result) {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
        );
        if (selected?.id === bookingId) {
          setSelected((prev: Booking | null) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast("success", `Booking ${newStatus}`);
      } else {
        showToast("error", result.error);
      }
    });
  }

  function handleMarkPaid(bookingId: string) {
    startTransition(async () => {
      const result = await markBookingPaid(bookingId);
      if ("success" in result) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === bookingId ? { ...b, payment_status: "paid", status: "confirmed" } : b,
          ),
        );
        if (selected?.id === bookingId) {
          setSelected((prev: Booking | null) =>
            prev ? { ...prev, payment_status: "paid", status: "confirmed" } : null,
          );
        }
        showToast("success", "Payment confirmed ✓");
      } else {
        showToast("error", result.error);
      }
    });
  }

  // ── STATUS BADGE helper ────────────────────────────────────────
  function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      confirmed: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-red-100 text-red-600",
      completed: "bg-blue-100 text-blue-700",
    };
    return (
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-black tracking-wide uppercase ${styles[status] ?? "bg-gray-100 text-gray-500"}`}
      >
        {status}
      </span>
    );
  }

  function PayBadge({ status }: { status: string }) {
    return (
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-black tracking-wide uppercase ${
          status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
        }`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── FILTERS ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, email, ref or trek..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-100 bg-white py-3 pr-4 pl-11 text-sm shadow-sm focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="cursor-pointer rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment filter */}
        <select
          value={payFilter}
          onChange={(e) => setPayFilter(e.target.value as PaymentFilter)}
          className="cursor-pointer rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
        >
          <option value="all">All payments</option>
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>

        {/* Source filter */}
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
          className="cursor-pointer rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
        >
          <option value="all">All sources</option>
          <option value="online">Online</option>
          <option value="walkin">Walk-in</option>
          <option value="partner">Partner</option>
        </select>

        <span className="text-sm font-medium text-gray-400">
          {filtered.length} booking{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── TABLE ─────────────────────────────────────────────── */}
      <div className="overflow-hidden overflow-x-auto rounded-[2rem] border border-black/5 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span className="mb-4 text-5xl">📋</span>
            <p className="text-xl font-black text-gray-300">No bookings found</p>
            {(search || statusFilter !== "all" || payFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                  setPayFilter("all");
                }}
                className="mt-4 text-sm font-bold text-[#0b3a2c] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {[
                  "Trek",
                  "Source",
                  "Tourist",
                  "Date & Time",
                  "Guests",
                  "Total",
                  "Status",
                  "Payment",
                  "Guide",
                  "Actions",
                ].map((h) => (
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
              {filtered.map((booking) => (
                <tr key={booking.id} className="group transition-colors hover:bg-[#f7fdf9]">
                  {/* Trek */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {booking.treks?.cover_image && (
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={booking.treks.cover_image}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="line-clamp-2 max-w-[160px] text-sm font-bold text-[#0b3a2c]">
                          {booking.treks?.title ?? "—"}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {booking.booking_type === "private" ? "🔒 Private" : "👥 Group"}
                          &nbsp;·&nbsp;
                          <span className="font-mono">{booking.booking_ref}</span>
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase ${
                        booking.source === "walkin"
                          ? "bg-blue-100 text-blue-700"
                          : booking.source === "partner"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {booking.source === "walkin"
                        ? "🚶"
                        : booking.source === "partner"
                          ? "🤝"
                          : "🌐"}
                      {booking.source ?? "online"}
                    </span>
                  </td>

                  {/* Tourist */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">{booking.tourist_name}</p>
                    <p className="text-[11px] text-gray-400">{booking.tourist_email}</p>
                    <p className="text-[11px] text-gray-400">{booking.tourist_phone}</p>
                  </td>

                  {/* Date & Time */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(booking.trek_date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-[11px] text-gray-400">{booking.trek_time}</p>
                  </td>

                  {/* Guests */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700">
                      {booking.adults} adult{booking.adults > 1 ? "s" : ""}
                      {booking.children > 0
                        ? ` + ${booking.children} child${booking.children > 1 ? "ren" : ""}`
                        : ""}
                    </p>
                  </td>

                  {/* Total */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-black text-[#0b3a2c]">
                      ${booking.total_price?.toFixed(2)}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={booking.status} />
                  </td>

                  {/* Payment */}
                  <td className="px-5 py-4">
                    <PayBadge status={booking.payment_status} />
                  </td>

                  {/* Guide */}
                  <td className="px-5 py-4">
                    {booking.guide_id ? (
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0b3a2c] text-[10px] font-black text-white">
                          {guides.find((g) => g.id === booking.guide_id)?.full_name?.charAt(0) ??
                            "?"}
                        </div>
                        <span className="max-w-[80px] truncate text-xs font-semibold text-gray-700">
                          {guides.find((g) => g.id === booking.guide_id)?.full_name ?? "Assigned"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-gray-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => setSelected(booking)}
                        className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-bold text-gray-600 transition-all hover:border-[#0b3a2c] hover:text-[#0b3a2c]"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </button>

                      {booking.payment_status === "unpaid" && booking.status !== "cancelled" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startTransition(async () => {
                              const r = await markBookingPaid(booking.id);
                              if ("success" in r) {
                                setBookings((prev) =>
                                  prev.map((b) =>
                                    b.id === booking.id
                                      ? { ...b, payment_status: "paid", status: "confirmed" }
                                      : b,
                                  ),
                                );
                                showToast("success", "Payment confirmed ✓");
                              }
                            });
                          }}
                          disabled={isPending}
                          className="flex items-center gap-1 rounded-full bg-[#0b3a2c] px-3 py-1.5 text-[11px] font-black text-[#00ef9d] transition-all hover:bg-[#0d4a38] disabled:opacity-50"
                        >
                          💳 Paid
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

      {/* ── DETAIL PANEL (right drawer) ──────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-[300] flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="animate-in slide-in-from-right flex h-full w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl duration-300">
            {/* Panel header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase">
                  Booking detail
                </p>
                <h2 className="text-lg font-black text-[#0b3a2c]">{selected.booking_ref}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <XCircle className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Panel body */}
            <div className="flex-1 space-y-6 px-6 py-6">
              {/* Trek info */}
              {selected.treks && (
                <div className="flex items-center gap-4">
                  {selected.treks.cover_image && (
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl">
                      <Image
                        src={selected.treks.cover_image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm leading-snug font-black text-[#0b3a2c]">
                      {selected.treks.title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {selected.treks.duration}
                      &nbsp;·&nbsp;
                      {selected.booking_type === "private" ? "🔒 Private tour" : "👥 Group tour"}
                    </p>
                  </div>
                </div>
              )}

              {/* Status row */}
              <div className="flex items-center gap-3">
                <StatusBadge status={selected.status} />
                <PayBadge status={selected.payment_status} />
                {selected.payment_status === "unpaid" && (
                  <span className="text-xs font-semibold text-amber-600">Pay at bureau</span>
                )}
              </div>

              {/* Trip details */}
              <div className="space-y-3 rounded-2xl bg-gray-50 p-5">
                <p className="mb-3 text-xs font-black tracking-widest text-gray-400 uppercase">
                  Trip details
                </p>
                {[
                  {
                    icon: Calendar,
                    label: "Date",
                    value: new Date(selected.trek_date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }),
                  },
                  { icon: Clock, label: "Time", value: selected.trek_time },
                  {
                    icon: Users,
                    label: "Guests",
                    value: `${selected.adults} adult${selected.adults > 1 ? "s" : ""}${
                      selected.children > 0
                        ? ` + ${selected.children} child${selected.children > 1 ? "ren" : ""}`
                        : ""
                    }`,
                  },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0 text-[#0b3a2c]" />
                      <span className="w-12 shrink-0 text-xs text-gray-500">{row.label}</span>
                      <span className="text-sm font-semibold text-gray-800">{row.value}</span>
                    </div>
                  );
                })}
              </div>

              {/* Tourist info */}
              <div className="space-y-3 rounded-2xl bg-gray-50 p-5">
                <p className="mb-3 text-xs font-black tracking-widest text-gray-400 uppercase">
                  Tourist
                </p>
                <p className="font-bold text-gray-800">{selected.tourist_name}</p>
                <a
                  href={`mailto:${selected.tourist_email}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {selected.tourist_email}
                </a>
                <a
                  href={`tel:${selected.tourist_phone}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {selected.tourist_phone}
                </a>
              </div>

              {/* Pricing */}
              <div className="space-y-2 rounded-2xl bg-gray-50 p-5">
                <p className="mb-3 text-xs font-black tracking-widest text-gray-400 uppercase">
                  Pricing
                </p>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {selected.adults} adult{selected.adults > 1 ? "s" : ""}× $
                    {selected.price_per_adult?.toFixed(2)}
                  </span>
                  <span>${(selected.adults * selected.price_per_adult).toFixed(2)}</span>
                </div>
                {selected.children > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      {selected.children} child{selected.children > 1 ? "ren" : ""}× $
                      {selected.price_per_child?.toFixed(2)}
                    </span>
                    <span>${(selected.children * selected.price_per_child).toFixed(2)}</span>
                  </div>
                )}
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 font-black text-[#0b3a2c]">
                  <span>Total</span>
                  <span>${selected.total_price?.toFixed(2)}</span>
                </div>
              </div>

              {/* Special requests */}
              {selected.special_requests && (
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                  <p className="mb-2 text-xs font-black tracking-widest text-amber-600 uppercase">
                    Special requests
                  </p>
                  <p className="text-sm text-gray-700">{selected.special_requests}</p>
                </div>
              )}

              {/* Booked on */}
              <p className="text-center text-xs text-gray-400">
                Booked on{" "}
                {new Date(selected.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Panel footer — actions */}
            <div className="sticky bottom-0 space-y-3 border-t border-gray-100 bg-white px-6 py-5">
              {/* Guide assignment */}
              <div className="mb-2 space-y-3 border-b border-gray-100 pb-5">
                <p className="text-xs font-black tracking-widest text-gray-400 uppercase">
                  Guide assignment
                </p>

                {selected.guide_id ? (
                  <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-[#f0faf5] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b3a2c] text-sm font-black text-[#00ef9d]">
                        {guides.find((g) => g.id === selected.guide_id)?.full_name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#0b3a2c]">
                          {guides.find((g) => g.id === selected.guide_id)?.full_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Assigned{" "}
                          {selected.guide_assigned_at
                            ? new Date(selected.guide_assigned_at).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                    </div>
                    {guides.find((g) => g.id === selected.guide_id)?.phone && (
                      <a
                        href={`https://wa.me/${guides.find((g) => g.id === selected.guide_id)?.phone?.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hi! You've been assigned to booking ${selected.booking_ref} — ` +
                            `${selected.treks?.title} on ${new Date(selected.trek_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${selected.trek_time} — ` +
                            `Tourist: ${selected.tourist_name} (${selected.tourist_phone})`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-xs font-black text-white transition-all hover:bg-[#20bd5a]"
                      >
                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp guide
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={async () => {
                        startTransition(async () => {
                          const result = await autoAssignGuide(selected.id);
                          if ("success" in result) {
                            const updatedGuides = await getActiveGuides();
                            setGuides(updatedGuides);
                            const nextGuide = updatedGuides.find(
                              (g) => result.guideName === g.full_name,
                            );
                            setBookings((prev) =>
                              prev.map((b) =>
                                b.id === selected.id
                                  ? {
                                      ...b,
                                      guide_id: nextGuide?.id,
                                      guide_assigned_at: new Date().toISOString(),
                                    }
                                  : b,
                              ),
                            );
                            setSelected((prev: any) =>
                              prev
                                ? {
                                    ...prev,
                                    guide_id: nextGuide?.id,
                                    guide_assigned_at: new Date().toISOString(),
                                  }
                                : null,
                            );
                            showToast("success", `Auto-assigned to ${result.guideName}`);
                          } else {
                            showToast("error", result.error);
                          }
                        });
                      }}
                      disabled={isPending || guides.length === 0}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b3a2c] py-3 text-sm font-black text-[#00ef9d] transition-all hover:bg-[#0d4a38] disabled:opacity-50"
                    >
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "⚡"}
                      Auto-assign next guide
                    </button>

                    <div className="flex gap-2">
                      <select
                        id={`guide-select-${selected.id}`}
                        className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0b3a2c]/10 focus:outline-none"
                      >
                        <option value="">Select guide manually...</option>
                        {guides.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.guide_order ? `#${g.guide_order} ` : ""}
                            {g.full_name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={async () => {
                          const sel = document.getElementById(
                            `guide-select-${selected.id}`,
                          ) as HTMLSelectElement;
                          if (!sel?.value) return;
                          startTransition(async () => {
                            const result = await assignGuide(selected.id, sel.value);
                            if ("success" in result) {
                              const guide = guides.find((g) => g.id === sel.value);
                              setBookings((prev) =>
                                prev.map((b) =>
                                  b.id === selected.id
                                    ? {
                                        ...b,
                                        guide_id: sel.value,
                                        guide_assigned_at: new Date().toISOString(),
                                      }
                                    : b,
                                ),
                              );
                              setSelected((prev: any) =>
                                prev
                                  ? {
                                      ...prev,
                                      guide_id: sel.value,
                                      guide_assigned_at: new Date().toISOString(),
                                    }
                                  : null,
                              );
                              showToast("success", `Assigned to ${guide?.full_name ?? "guide"}`);
                            } else {
                              showToast("error", result.error);
                            }
                          });
                        }}
                        disabled={isPending}
                        className="rounded-2xl bg-[#0b3a2c] px-4 py-2.5 text-sm font-black text-white transition-all hover:bg-[#0d4a38] disabled:opacity-50"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mark as paid */}
              {selected.payment_status === "unpaid" && selected.status !== "cancelled" && (
                <button
                  onClick={() => handleMarkPaid(selected.id)}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#0b3a2c] py-3.5 text-sm font-black text-[#00ef9d] transition-all hover:bg-[#0d4a38] active:scale-95 disabled:opacity-60"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4" />
                  )}
                  Mark as paid & confirm
                </button>
              )}

              {/* Status actions */}
              <div className="grid grid-cols-2 gap-2">
                {selected.status !== "confirmed" && selected.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusChange(selected.id, "confirmed")}
                    disabled={isPending}
                    className="rounded-full border-2 border-emerald-200 bg-emerald-50 py-2.5 text-xs font-black text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-50"
                  >
                    ✓ Confirm
                  </button>
                )}
                {selected.status !== "completed" && selected.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusChange(selected.id, "completed")}
                    disabled={isPending}
                    className="rounded-full border-2 border-blue-200 bg-blue-50 py-2.5 text-xs font-black text-blue-700 transition-all hover:bg-blue-100 disabled:opacity-50"
                  >
                    ✓ Complete
                  </button>
                )}
                {selected.status !== "cancelled" && (
                  <button
                    onClick={() => handleStatusChange(selected.id, "cancelled")}
                    disabled={isPending}
                    className="col-span-2 rounded-full border-2 border-red-200 bg-red-50 py-2.5 text-xs font-black text-red-500 transition-all hover:bg-red-100 disabled:opacity-50"
                  >
                    Cancel booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-[400] flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-semibold shadow-2xl duration-300 ${
            toast.type === "success" ? "bg-[#0b3a2c] text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          {toast.text}
        </div>
      )}
    </div>
  );
}
