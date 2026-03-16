-- Run this in Supabase SQL Editor (Steps 1 + 8)
-- Guide assignment + round-robin + walk-in source

-- Add guide assignment + round-robin order to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS guide_id           UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS guide_assigned_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS source             TEXT DEFAULT 'online';

-- Allow source constraint only if not already present (avoid error on re-run)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bookings_source_check'
  ) THEN
    ALTER TABLE public.bookings
      ADD CONSTRAINT bookings_source_check
      CHECK (source IN ('online', 'walkin', 'partner'));
  END IF;
END $$;

-- Add round-robin order to guides
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS guide_order        INTEGER,
  ADD COLUMN IF NOT EXISTS guide_active       BOOLEAN DEFAULT TRUE;

-- Index for fast round-robin lookup
CREATE INDEX IF NOT EXISTS idx_users_guide_order
  ON public.users(guide_order)
  WHERE role = 'guide' AND is_active = TRUE AND guide_active = TRUE;

-- Function: get next guide in round-robin sequence
CREATE OR REPLACE FUNCTION get_next_guide()
RETURNS UUID AS $$
DECLARE
  next_guide_id UUID;
  last_guide_order INTEGER;
BEGIN
  -- Find the order of the guide who got the most recent booking
  SELECT u.guide_order INTO last_guide_order
  FROM public.bookings b
  JOIN public.users u ON u.id = b.guide_id
  WHERE b.guide_id IS NOT NULL
    AND b.status NOT IN ('cancelled')
  ORDER BY b.guide_assigned_at DESC
  LIMIT 1;

  -- Get the next guide by order (wraps around)
  SELECT id INTO next_guide_id
  FROM public.users
  WHERE role = 'guide'
    AND is_active = TRUE
    AND guide_active = TRUE
    AND guide_order IS NOT NULL
  ORDER BY
    CASE
      WHEN guide_order > COALESCE(last_guide_order, 0) THEN 0
      ELSE 1
    END,
    guide_order ASC
  LIMIT 1;

  RETURN next_guide_id;
END;
$$ LANGUAGE plpgsql;

-- RLS: guides can see their assigned bookings
DROP POLICY IF EXISTS "bookings_guide_read" ON public.bookings;
CREATE POLICY "bookings_guide_read" ON public.bookings
  FOR SELECT USING (guide_id = auth.uid());

-- Step 8: Set guide_order for existing guides
WITH ordered_guides AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.users
  WHERE role = 'guide' AND is_active = TRUE
)
UPDATE public.users
SET guide_order = ordered_guides.rn,
    guide_active = TRUE
FROM ordered_guides
WHERE public.users.id = ordered_guides.id;
