-- Gallery Images Management Table
-- Run this in Supabase SQL Editor to create the gallery_images table

CREATE TABLE IF NOT EXISTS public.gallery_images (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot        INTEGER NOT NULL UNIQUE CHECK (slot BETWEEN 1 AND 4),
  image_url   TEXT NOT NULL,
  cf_image_id TEXT,
  title       TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Public can read gallery images
CREATE POLICY "gallery_public_read" ON public.gallery_images
  FOR SELECT USING (true);

-- Admins can do everything
CREATE POLICY "gallery_admin_write" ON public.gallery_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert 4 default slots (won't overwrite existing)
INSERT INTO public.gallery_images (slot, image_url, title) VALUES
  (1, 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?q=80&w=1200', 'Ourika Waterfalls'),
  (2, 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1200', 'Berber Tea Ceremony'),
  (3, 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?q=80&w=1200', 'Atlas Mountain Village'),
  (4, 'https://images.unsplash.com/photo-1507502707541-f369a3b18502?q=80&w=1200', 'Hot Air Balloon')
ON CONFLICT (slot) DO NOTHING;
