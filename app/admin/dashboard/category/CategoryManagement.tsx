"use client";

import { useState, useTransition } from "react";
import { Category, createCategory, updateCategory, deleteCategory } from "@/app/actions/categories";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Image as ImageIcon,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import Image from "next/image";

interface CategoryManagementProps {
    initialCategories: Category[];
}

export default function CategoryManagement({ initialCategories }: CategoryManagementProps) {
    const [isPending, startTransition] = useTransition();
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const filteredCategories = initialCategories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    async function handleSubmit(formData: FormData) {
        setMessage(null);
        startTransition(async () => {
            let result;
            if (editingCategory) {
                result = await updateCategory(editingCategory.id, formData);
            } else {
                result = await createCategory(formData);
            }

            if (result.error) {
                setMessage({ type: "error", text: result.error });
            } else {
                setMessage({ type: "success", text: `Category ${editingCategory ? "updated" : "created"} successfully` });
                setIsModalOpen(false);
                setEditingCategory(null);
            }
        });
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this category?")) return;

        startTransition(async () => {
            const result = await deleteCategory(id);
            if (result.error) {
                alert(result.error);
            }
        });
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-black/5 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-[#0b3a2c]/5 transition-all shadow-sm"
                    />
                </div>
                <button
                    onClick={() => {
                        setEditingCategory(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-full bg-[#0b3a2c] px-6 py-3 text-sm font-bold text-white shadow-xl shadow-[#0b3a2c]/20 transition-transform hover:scale-105"
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </button>
            </div>

            {message && (
                <div className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                    {message.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {message.text}
                </div>
            )}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCategories.length > 0 ? (
                    filteredCategories.map((category) => (
                        <div key={category.id} className="group relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white p-2 shadow-2xl shadow-black/[0.03] transition-all hover:shadow-black/[0.06]">
                            <div className="relative h-48 w-full overflow-hidden rounded-[2rem]">
                                {category.photo ? (
                                    <img
                                        src={category.photo}
                                        alt={category.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-300">
                                        <ImageIcon className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                                    <button
                                        onClick={() => {
                                            setEditingCategory(category);
                                            setIsModalOpen(true);
                                        }}
                                        className="rounded-full bg-white p-2.5 text-gray-700 shadow-xl transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="rounded-full bg-red-500 p-2.5 text-white shadow-xl transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-[#0b3a2c]">{category.name}</h3>
                                <p className="mt-2 text-sm font-medium text-gray-500 line-clamp-2">
                                    {category.description || "No description provided."}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 rounded-full bg-gray-50 p-6">
                            <ImageIcon className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No categories found</h3>
                        <p className="text-gray-500">Try adjusting your search or add a new category.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-white shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 px-8 py-6">
                            <h2 className="text-2xl font-black text-[#0b3a2c]">
                                {editingCategory ? "Edit Category" : "New Category"}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingCategory(null);
                                }}
                                className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form action={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Category Name</label>
                                    <input
                                        name="name"
                                        defaultValue={editingCategory?.name}
                                        required
                                        placeholder="e.g., Adventure Tours"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0b3a2c]/5 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Photo URL</label>
                                    <input
                                        name="photo"
                                        defaultValue={editingCategory?.photo || ""}
                                        placeholder="https://images.unsplash.com/..."
                                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0b3a2c]/5 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700">Description</label>
                                    <textarea
                                        name="description"
                                        defaultValue={editingCategory?.description || ""}
                                        rows={4}
                                        placeholder="What makes this category special?"
                                        className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0b3a2c]/5 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 rounded-full border border-gray-200 py-3.5 text-sm font-bold text-gray-600 transition-active active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="flex-1 rounded-full bg-[#0b3a2c] py-3.5 text-sm font-bold text-white shadow-xl shadow-[#0b3a2c]/10 transition-active hover:bg-[#0b3a2c]/90 active:scale-95 disabled:opacity-70"
                                >
                                    {isPending ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Saving...
                                        </div>
                                    ) : (
                                        editingCategory ? "Update Category" : "Create Category"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
