ALTER TABLE public.treks
  ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_treks_creator_id ON public.treks (creator_id);
