import { getTrekById } from '@/app/actions/treks';
import { getCategories } from '@/app/actions/categories';
import { getCurrentUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import TrekWizard from '../../new/TrekWizard';
import { Compass, Edit2 } from 'lucide-react';

export const metadata = { title: 'Edit Trek | Admin' };

export default async function EditTrekPage({
    params,
}: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') redirect('/auth/login');

    const [trek, categories] = await Promise.all([
        getTrekById(id),
        getCategories()
    ]);

    if (!trek) notFound();

    return (
        <div className="space-y-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00ef9d]/10 text-[#00ef9d]">
                            <Compass className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-wider text-[#0b3a2c]/60">Treks</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black tracking-tight text-[#0b3a2c]">Edit trek</h1>
                        <div className="rounded-full bg-emerald-50 px-4 py-1 text-xs font-black text-emerald-600">
                            ID: {id.slice(0, 8)}...
                        </div>
                    </div>
                    <p className="max-w-xl text-lg font-medium text-gray-400">
                        Currently editing <span className="text-[#0b3a2c] font-black italic">"{trek.title}"</span>
                    </p>
                </div>
            </div>

            <TrekWizard categories={categories} initialData={trek} trekId={id} />
        </div>
    );
}
