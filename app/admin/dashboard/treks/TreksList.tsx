'use client';

import { useState, useTransition, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Trek, toggleTrekStatus, deleteTrek } from '@/app/actions/treks';
import {
    Search,
    Eye,
    Edit2,
    Trash2,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    Clock,
    Compass,
    Loader2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface TreksListProps {
    initialTreks: Trek[];
}

export default function TreksList({ initialTreks }: TreksListProps) {
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [treks, setTreks] = useState(initialTreks);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    function showToast(type: 'success' | 'error', text: string) {
        setToast({ type, text });
        setTimeout(() => setToast(null), 3000);
    }

    useEffect(() => {
        const created = searchParams.get('created');
        const updated = searchParams.get('updated');
        if (created) showToast('success', `Trek created successfully! 🎉`);
        if (updated) showToast('success', `Trek updated successfully ✓`);
    }, [searchParams]);

    const filtered = treks
        .filter(t =>
            statusFilter === 'all' ? true
                : statusFilter === 'published' ? t.is_active
                    : !t.is_active
        )
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    const publishedCount = treks.filter(t => t.is_active).length;
    const draftCount = treks.length - publishedCount;

    async function handleToggle(trek: Trek) {
        startTransition(async () => {
            const result = await toggleTrekStatus(trek.id, !trek.is_active);
            if ('success' in result) {
                setTreks(prev => prev.map(t =>
                    t.id === trek.id ? { ...t, is_active: !t.is_active } : t
                ));
                showToast('success', result.message);
            } else {
                showToast('error', result.error);
            }
        });
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this trek? This cannot be undone.')) return;

        startTransition(async () => {
            const result = await deleteTrek(id);
            if ('success' in result) {
                setTreks(prev => prev.filter(t => t.id !== id));
                showToast('success', 'Trek deleted');
            } else {
                showToast('error', result.error);
            }
        });
    }

    return (
        <div className="space-y-6">
            {/* Controls Row */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`rounded-full px-5 py-2.5 text-xs font-black transition-all ${statusFilter === 'all' ? 'bg-[#0b3a2c] text-white shadow-lg' : 'bg-white border text-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        All ({treks.length})
                    </button>
                    <button
                        onClick={() => setStatusFilter('published')}
                        className={`rounded-full px-5 py-2.5 text-xs font-black transition-all ${statusFilter === 'published' ? 'bg-[#0b3a2c] text-white shadow-lg' : 'bg-white border text-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        Published ({publishedCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter('draft')}
                        className={`rounded-full px-5 py-2.5 text-xs font-black transition-all ${statusFilter === 'draft' ? 'bg-[#0b3a2c] text-white shadow-lg' : 'bg-white border text-gray-400 hover:bg-gray-50'
                            }`}
                    >
                        Drafts ({draftCount})
                    </button>
                </div>

                <div className="flex flex-1 items-center gap-4 max-w-xl">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search treks by title..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-2xl border border-black/5 bg-white py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#0b3a2c]/5 transition-all shadow-sm"
                        />
                    </div>
                    <span className="hidden text-sm font-bold text-gray-400 whitespace-nowrap lg:block">
                        Showing {filtered.length} treks
                    </span>
                </div>
            </div>

            {/* Treks List */}
            <div className="grid grid-cols-1 gap-4">
                {filtered.length > 0 ? (
                    filtered.map((trek) => (
                        <div key={trek.id} className="group relative flex flex-col gap-4 rounded-[2.5rem] border border-black/5 bg-white p-4 shadow-sm transition-all hover:shadow-xl hover:shadow-black/5 md:flex-row md:items-center">
                            <div className="relative h-40 w-full overflow-hidden rounded-[1.8rem] md:h-24 md:w-32 lg:h-28 lg:w-40">
                                <Image
                                    src={trek.cover_image}
                                    alt={trek.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="flex flex-1 flex-col gap-2 px-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600">
                                        {trek.category_name || 'Experience'}
                                    </span>
                                    <div className="flex items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        {trek.duration}
                                    </div>
                                </div>
                                <h3 className="line-clamp-2 text-lg font-black leading-tight text-[#0b3a2c]">
                                    {trek.title}
                                </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 px-2 md:gap-8 md:px-6">
                                <div className="text-left md:text-right">
                                    <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Price</span>
                                    <span className="text-xl font-black text-[#0b3a2c]">${trek.price_per_adult}</span>
                                </div>

                                <div className="flex items-center gap-2 rounded-full px-3 py-1.5">
                                    <div className={`h-2 w-2 rounded-full ${trek.is_active ? 'bg-[#00ef9d]' : 'bg-gray-300'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${trek.is_active ? 'text-[#004f32]' : 'text-gray-400'}`}>
                                        {trek.is_active ? 'Live' : 'Draft'}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 border-t border-black/5 pt-4 md:border-t-0 md:pt-0">
                                <Link
                                    href={`/tour/${trek.slug}`}
                                    target="_blank"
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all hover:bg-[#0b3a2c] hover:text-white"
                                >
                                    <Eye className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={`/admin/dashboard/treks/${trek.id}/edit`}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-all hover:bg-[#0b3a2c] hover:text-white"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </Link>
                                <button
                                    onClick={() => handleToggle(trek)}
                                    disabled={isPending}
                                    className={`flex h-10 items-center justify-center gap-2 rounded-full px-4 text-xs font-black transition-all ${trek.is_active
                                            ? 'border border-amber-200 text-amber-600 hover:bg-amber-50'
                                            : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                        }`}
                                >
                                    {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : trek.is_active ? 'Unpublish' : 'Publish'}
                                </button>
                                <button
                                    onClick={() => handleDelete(trek.id)}
                                    disabled={isPending}
                                    className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="mb-6 rounded-full bg-gray-50 p-8">
                            <Compass className="h-16 w-16 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-[#0b3a2c]">
                            {search ? 'No treks match your search' : 'No treks yet'}
                        </h3>
                        <p className="mt-2 text-gray-500">
                            {search ? 'Try adjusting your filters or search keywords.' : 'Add your first trek to start seeing them here.'}
                        </p>
                        {!search && (
                            <Link
                                href="/admin/dashboard/treks/new"
                                className="mt-8 rounded-full bg-[#0b3a2c] px-8 py-3.5 text-sm font-black text-white shadow-xl transition-transform hover:scale-105"
                            >
                                + Add your first trek
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Success/Error Toast */}
            {toast && (
                <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-bottom-10">
                    <div className={`flex items-center gap-3 rounded-2xl px-6 py-4 font-bold text-white shadow-2xl ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}>
                        {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                        {toast.text}
                    </div>
                </div>
            )}
        </div>
    );
}
