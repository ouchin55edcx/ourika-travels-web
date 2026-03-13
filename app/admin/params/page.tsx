export default function AdminParamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-500">Params</p>
        <h1 className="text-3xl font-black text-[#0b3a2c]">Platform settings</h1>
        <p className="max-w-2xl text-base font-medium text-gray-500">
          Update pricing rules, notification templates, and other global settings.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Note</p>
        <p className="text-lg font-semibold text-gray-800">
          Add form sections for each config group.
        </p>
      </div>
    </div>
  );
}
