"use client";

import { useState, useTransition, useEffect } from "react";
import { Category, createCategory, updateCategory, deleteCategory, uploadCategoryImage } from "@/app/actions/categories";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Image as ImageIcon,
    Loader2,
    X,
    CheckCircle2,
    AlertCircle,
    UploadCloud
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
    const [photoUrl, setPhotoUrl] = useState("");
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [photoError, setPhotoError] = useState<string | null>(null);

    const filteredCategories = initialCategories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        setPhotoUrl(editingCategory?.photo || "");
        setPhotoError(null);
    }, [editingCategory, isModalOpen]);

    async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingPhoto(true);
        setPhotoError(null);
        const fd = new FormData();
        fd.append("file", file);
        const result = await uploadCategoryImage(fd);
        setUploadingPhoto(false);
        if ("error" in result) {
            setPhotoError(result.error);
        } else {
            setPhotoUrl(result.url);
        }
    }

    async function handleSubmit(formData: FormData) {
        setMessage(null);
        formData.set("photo", photoUrl);
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
                setPhotoUrl("");
                setPhotoError(null);
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

            {/* Stats row */}
            <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
                <span>
                    <span className="font-black text-[#0b3a2c] text-lg">
                        {filteredCategories.length}
                    </span>{' '}
                    {filteredCategories.length === 1 ? 'category' : 'categories'}
                </span>
                {searchQuery && (
                    <span className="text-gray-400">
                        — filtered from {initialCategories.length} total
                    </span>
                )}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
                {filteredCategories.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/60">
                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 w-16">
                                    Photo
                                </th>
                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 hidden md:table-cell">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 hidden lg:table-cell">
                                    Created
                                </th>
                                <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredCategories.map((category, index) => (
                                <tr
                                    key={category.id}
                                    className="group transition-colors hover:bg-[#f7fdf9]"
                                >
                                    {/* Photo thumbnail */}
                                    <td className="px-6 py-4">
                                        <div className="h-12 w-12 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            {category.photo ? (
                                                <img
                                                    src={category.photo}
                                                    alt={category.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <ImageIcon className="h-5 w-5 text-gray-300" />
                                            )}
                                        </div>
                                    </td>

                                    {/* Name */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b3a2c]/8 text-[10px] font-black text-[#0b3a2c]">
                                                {index + 1}
                                            </div>
                                            <span className="font-bold text-[#0b3a2c] text-[15px]">
                                                {category.name}
                                            </span>
                                        </div>
                                    </td>

                                    {/* Description */}
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <span className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                                            {category.description || (
                                                <span className="italic text-gray-300">No description</span>
                                            )}
                                        </span>
                                    </td>

                                    {/* Created date */}
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <span className="text-sm text-gray-400">
                                            {category.created_at
                                                ? new Date(category.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })
                                                : '—'}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(category);
                                                    setIsModalOpen(true);
                                                }}
                                                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] font-bold text-gray-600 shadow-sm transition-all hover:border-[#0b3a2c] hover:text-[#0b3a2c] opacity-0 group-hover:opacity-100"
                                            >
                                                <Edit2 className="h-3 w-3" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                disabled={isPending}
                                                className="flex items-center gap-1.5 rounded-full border border-red-100 bg-white px-3 py-1.5 text-[12px] font-bold text-red-400 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 disabled:opacity-30"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-4 rounded-full bg-gray-50 p-6">
                            <ImageIcon className="h-10 w-10 text-gray-200" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900">
                            {searchQuery ? 'No categories match your search' : 'No categories yet'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            {searchQuery
                                ? 'Try a different search term'
                                : 'Add your first category to get started'}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={() => { setEditingCategory(null); setIsModalOpen(true); }}
                                className="mt-6 flex items-center gap-2 rounded-full bg-[#0b3a2c] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0d4a38] transition-all"
                            >
                                <Plus className="h-4 w-4" /> Add category
                            </button>
                        )}
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
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Category Photo</label>

                                    <label className={`relative flex flex-col items-center justify-center
                                        w-full h-44 rounded-2xl border-2 border-dashed cursor-pointer
                                        overflow-hidden transition-all
                                        ${photoUrl
                                            ? 'border-[#0b3a2c]'
                                            : 'border-gray-200 hover:border-[#0b3a2c] hover:bg-[#f7fdf9]'
                                        }`}>

                                        {uploadingPhoto && (
                                            <div className="absolute inset-0 bg-white/90 flex flex-col
                                                items-center justify-center gap-2 z-10">
                                                <Loader2 className="w-6 h-6 text-[#0b3a2c] animate-spin" />
                                                <p className="text-sm font-semibold text-[#0b3a2c]">
                                                    Uploading to Cloudflare...
                                                </p>
                                            </div>
                                        )}

                                        {photoUrl && !uploadingPhoto && (
                                            <>
                                                <img src={photoUrl} alt="Preview"
                                                    className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/0 hover:bg-black/30
                                                    transition-all flex items-center justify-center
                                                    opacity-0 hover:opacity-100">
                                                    <span className="text-white text-sm font-semibold
                                                        bg-black/50 px-4 py-2 rounded-full">
                                                        Change photo
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={e => { e.preventDefault(); setPhotoUrl(""); }}
                                                    className="absolute top-2 right-2 bg-white rounded-full p-1.5
                                                        shadow-lg hover:bg-red-50 z-10 transition-colors">
                                                    <X className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </>
                                        )}

                                        {!photoUrl && !uploadingPhoto && (
                                            <div className="flex flex-col items-center gap-2 p-6 text-center">
                                                <UploadCloud className="w-8 h-8 text-gray-300" />
                                                <p className="text-sm font-semibold text-gray-500">
                                                    Click to upload a photo
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    JPG, PNG or WebP · Max 10 MB
                                                </p>
                                                <span className="mt-1 bg-[#0b3a2c] text-white text-xs
                                                    font-bold px-4 py-2 rounded-full pointer-events-none">
                                                    Browse file
                                                </span>
                                            </div>
                                        )}

                                        <input type="file" accept="image/jpeg,image/png,image/webp"
                                            className="hidden" onChange={handlePhotoUpload} />
                                    </label>

                                    {photoError && (
                                        <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {photoError}
                                        </p>
                                    )}
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
