export default function AdminCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gray-500">Category</p>
        <h1 className="text-3xl font-black text-[#0b3a2c]">Organize experiences</h1>
        <p className="max-w-2xl text-base font-medium text-gray-500">
          Keep trek categories clear so travelers find the right experience quickly.
        </p>
      </div>

      <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-gray-500">Suggestion</p>
        <p className="text-lg font-semibold text-gray-800">
          Add a short description to each category.
        </p>
      </div>
    </div>
  );
}
