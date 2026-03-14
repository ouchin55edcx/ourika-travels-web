export default function AdminProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-500">Admin Profile</p>
        <h1 className="text-3xl font-black text-[#0b3a2c]">Your admin account</h1>
        <p className="max-w-2xl text-base font-medium text-gray-500">
          Keep contact details, role permissions, and security settings up to date.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Profile details</p>
        <p className="text-lg font-semibold text-gray-800">Add editable profile fields here.</p>
      </div>
    </div>
  );
}
