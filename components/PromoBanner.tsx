import Link from 'next/link';
import { createSupabasePublicClient } from '@/lib/supabase/server';
import { ArrowRight, Tag } from 'lucide-react';

export default async function PromoBanner() {
  const supabase = createSupabasePublicClient();
  const { data: promos } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1);

  if (!promos || promos.length === 0) return null;
  const promo = promos[0];

  return (
    <section
      aria-label="Ourika Travels promotion"
      className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl bg-[#0a2e1a] px-6 py-5 sm:px-10 sm:py-6">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#00ef9d]/10" />
          <div className="pointer-events-none absolute -bottom-10 right-32 h-24 w-24 rounded-full bg-[#00ef9d]/5" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: content */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00ef9d]/15">
                <Tag className="h-5 w-5 text-[#00ef9d]" />
              </div>

              <div>
                {promo.badge && (
                  <span className="mb-2 inline-block rounded-full border border-[#00ef9d]/30 bg-[#00ef9d]/10 px-3 py-0.5 text-[10px] font-black tracking-widest text-[#00ef9d] uppercase">
                    {promo.badge}
                  </span>
                )}
                <h2 className="text-base font-black text-white sm:text-lg leading-snug">
                  {promo.title}
                </h2>
                {promo.subtitle && (
                  <p className="mt-1 max-w-xl text-sm text-white/55 leading-relaxed">
                    {promo.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right: CTA */}
            <Link
              href={promo.cta_href}
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#00ef9d] px-6 py-3 text-sm font-black text-[#0a2e1a] transition-all hover:bg-[#00dd8e] active:scale-95 sm:self-center"
            >
              {promo.cta_label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
