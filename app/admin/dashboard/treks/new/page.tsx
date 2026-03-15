import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getCategories } from '@/app/actions/categories';
import TrekWizard from './TrekWizard';
import { Compass } from 'lucide-react';

export const metadata = { title: 'Add New Trek | Admin' };

export default async function NewTrekPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') redirect('/auth/login');

    const categories = await getCategories();

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
                    <h1 className="text-4xl font-black tracking-tight text-[#0b3a2c]">Add new trek</h1>
                    <p className="max-w-xl text-lg font-medium text-gray-500">
                        Fill in the details step by step. You can save as a draft at any time.
                    </p>
                </div>
            </div>

            <TrekWizard categories={categories} />
        </div>
    );
}
