import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getCategories } from '@/app/actions/categories';
import TrekWizard from './TrekWizard';

export const metadata = { title: 'Add New Trek | Admin' };

export default async function NewTrekPage() {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') redirect('/auth/login');
    const categories = await getCategories();
    return <TrekWizard categories={categories} />;
}
