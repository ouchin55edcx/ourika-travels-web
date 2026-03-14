export default function AdminTreksPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-500">Treks</p>
        <h1 className="text-3xl font-black text-[#0b3a2c]">Curate adventure listings</h1>
        <p className="max-w-2xl text-base font-medium text-gray-500">
          Track trek performance, availability, and guide readiness in one place.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Tip</p>
        <p className="text-lg font-semibold text-gray-800">
          Add filters for difficulty, guide, and season.
        </p>
      </div>
    </div>
  );
}
