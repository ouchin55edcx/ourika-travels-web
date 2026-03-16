import { notFound, redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import BookingForm from './components/BookingForm';
import Link from 'next/link';

export default async function ReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ trek?: string; type?: string }>;
}) {
  const { trek: trekSlug, type } = await searchParams;

  if (!trekSlug) redirect('/experiences');

  const supabase = await createSupabaseServerClient();
  const { data: trek } = await supabase
    .from('treks')
    .select('*, categories(name)')
    .eq('slug', trekSlug)
    .eq('is_active', true)
    .single();

  if (!trek) notFound();

  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-black text-[#0b3a2c]">
            Ourika Travels
          </Link>
          <Link
            href={`/tour/${trekSlug}`}
            className="text-sm font-semibold text-gray-500 hover:text-[#0b3a2c] transition-colors"
          >
            ← Back to trek
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <BookingForm
          trek={trek}
          initialType={(type === 'private' ? 'private' : 'group') as 'group' | 'private'}
          prefillName={user?.full_name ?? ''}
          prefillEmail={user?.email ?? ''}
          prefillPhone={user?.phone ?? ''}
        />
      </main>
    </div>
  );
}
