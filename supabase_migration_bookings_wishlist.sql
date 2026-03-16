-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Bookings + Wishlist tables — Run in Supabase SQL Editor
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Generic trigger function to set updated_at (use this if update_trek_timestamp doesn't exist)
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref         TEXT NOT NULL UNIQUE,
  trek_id             UUID REFERENCES public.treks(id) ON DELETE SET NULL,
  tourist_id          UUID REFERENCES public.users(id) ON DELETE SET NULL,
  booking_type        TEXT NOT NULL CHECK (booking_type IN ('group', 'private')),
  status              TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  payment_status      TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid', 'paid')),
  tourist_name        TEXT NOT NULL,
  tourist_email       TEXT NOT NULL,
  tourist_phone       TEXT NOT NULL,
  trek_date           DATE NOT NULL,
  trek_time           TEXT NOT NULL DEFAULT '08:30',
  adults              INTEGER NOT NULL DEFAULT 1,
  children            INTEGER NOT NULL DEFAULT 0,
  price_per_adult     NUMERIC(10,2) NOT NULL,
  price_per_child     NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price         NUMERIC(10,2) NOT NULL,
  special_requests    TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at (use trigger_set_updated_at; or update_trek_timestamp if you have it)
DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings_own_read" ON public.bookings
  FOR SELECT USING (
    tourist_id = auth.uid() OR
    tourist_email = (SELECT email FROM public.users WHERE id = auth.uid())
  );

CREATE POLICY "bookings_insert" ON public.bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "bookings_admin_all" ON public.bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  trek_id    UUID NOT NULL REFERENCES public.treks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, trek_id)
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wishlist_own" ON public.wishlist
  FOR ALL USING (user_id = auth.uid());

-- Booking reference generator
CREATE OR REPLACE FUNCTION generate_booking_ref()
RETURNS TEXT AS $$
DECLARE
  ref TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    ref := 'OT-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
           UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    SELECT EXISTS(SELECT 1 FROM public.bookings WHERE booking_ref = ref) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN ref;
END;
$$ LANGUAGE plpgsql;
