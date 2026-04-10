CREATE TABLE IF NOT EXISTS public.promotions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  subtitle     TEXT,
  cta_label    TEXT NOT NULL DEFAULT 'Book now',
  cta_href     TEXT NOT NULL DEFAULT '/experiences',
  badge        TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  bg_style     TEXT DEFAULT 'dark',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promotions_public_read" ON public.promotions
  FOR SELECT USING (is_active = true);
CREATE POLICY "promotions_admin_write" ON public.promotions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin')
  );

-- Insert default static welcome promotion
INSERT INTO public.promotions
  (title, subtitle, cta_label, cta_href, badge, bg_style, display_order)
VALUES (
  'Book online — reserve your spot for free',
  'Join a guided trek or private experience in Ourika Valley. Pay only at our bureau in Setti Fatma before the activity starts. No card required.',
  'Browse experiences',
  '/experiences',
  'New · Online booking open',
  'dark',
  1
);
