import { createSupabaseServerClient } from '@/lib/supabase/server';
import QuickBookForm from './QuickBookForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reserve your experience — Ourika Travels',
  description:
    'Quick walk-in reservation at Ourika Travels bureau, Setti Fatma.',
};

export default async function QuickBookPage() {
  const supabase = await createSupabaseServerClient();
  const { data: treks } = await supabase
    .from('treks')
    .select('id, title, slug, price_per_adult, duration, time_of_day')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-[#0b3a2c] flex flex-col">
      <div className="px-6 pt-10 pb-6 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#00ef9d] mb-4 mx-auto">
          <span className="text-2xl font-black text-[#0b3a2c]">OT</span>
        </div>
        <h1 className="text-2xl font-black text-white">Ourika Travels</h1>
        <p className="text-white/60 text-sm mt-1">
          Reserve your experience — Setti Fatma bureau
        </p>
      </div>
      <div className="flex-1 bg-white rounded-t-[2.5rem] px-6 pt-8 pb-10">
        <QuickBookForm treks={treks ?? []} />
      </div>
    </div>
  );
}
