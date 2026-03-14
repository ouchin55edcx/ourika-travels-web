export default function AdminBookingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-500">Booking</p>
        <h1 className="text-3xl font-black text-[#0b3a2c]">Manage reservations</h1>
        <p className="max-w-2xl text-base font-medium text-gray-500">
          Confirm payments, adjust schedules, and keep travelers informed.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Workflow</p>
        <p className="text-lg font-semibold text-gray-800">Surface pending approvals first.</p>
      </div>
    </div>
  );
}
