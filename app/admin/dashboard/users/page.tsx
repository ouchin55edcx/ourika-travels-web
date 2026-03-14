export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-500">Users</p>
        <h1 className="text-3xl font-black text-[#0b3a2c]">Travelers and guides</h1>
        <p className="max-w-2xl text-base font-medium text-gray-500">
          Manage accounts, verify guides, and keep traveler profiles organized.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Next steps</p>
        <p className="text-lg font-semibold text-gray-800">
          Connect this section to your user database.
        </p>
      </div>
    </div>
  );
}
