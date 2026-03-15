import { getTrekById } from '@/app/actions/treks';
import { getCategories } from '@/app/actions/categories';
import { getCurrentUser } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import TrekWizard from '../../new/TrekWizard';

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

    return <TrekWizard categories={categories} initialData={trek} trekId={id} />;
}
