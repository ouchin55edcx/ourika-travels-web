-- Guide Management System
-- Created for comprehensive guide order management, trip assignments, and daily tracking

-- 1. GUIDE ASSIGNMENTS TABLE
-- Tracks which guide is assigned to which trip
CREATE TABLE IF NOT EXISTS public.guide_assignments (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  trip_id uuid NOT NULL,
  guide_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active'::text,
  chauffeur_name text,
  assigned_at timestamp with time zone NOT NULL DEFAULT NOW(),
  completed_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  CONSTRAINT guide_assignments_pkey PRIMARY KEY (id),
  CONSTRAINT guide_assignments_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.bookings (id) ON DELETE CASCADE,
  CONSTRAINT guide_assignments_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES public.users (id) ON DELETE CASCADE,
  CONSTRAINT guide_assignments_status_check CHECK (
    status = ANY (ARRAY['active'::text, 'completed'::text, 'cancelled'::text, 'no_show'::text])
  )
);

CREATE INDEX IF NOT EXISTS idx_guide_assignments_guide_id ON public.guide_assignments (guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_assignments_trip_id ON public.guide_assignments (trip_id);
CREATE INDEX IF NOT EXISTS idx_guide_assignments_status ON public.guide_assignments (status);
CREATE INDEX IF NOT EXISTS idx_guide_assignments_assigned_at ON public.guide_assignments (assigned_at);

-- 2. GUIDE DAILY RECORDS TABLE
-- Tracks daily trip counts and earnings for each guide
CREATE TABLE IF NOT EXISTS public.guide_daily_records (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  guide_id uuid NOT NULL,
  record_date date NOT NULL,
  trip_count integer NOT NULL DEFAULT 0,
  completed_trips integer NOT NULL DEFAULT 0,
  cancelled_trips integer NOT NULL DEFAULT 0,
  no_show_trips integer NOT NULL DEFAULT 0,
  total_earnings numeric (10, 2) NOT NULL DEFAULT 0,
  total_amount numeric (10, 2) NOT NULL DEFAULT 0,
  is_absent boolean NOT NULL DEFAULT false,
  absent_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  CONSTRAINT guide_daily_records_pkey PRIMARY KEY (id),
  CONSTRAINT guide_daily_records_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES public.users (id) ON DELETE CASCADE,
  CONSTRAINT guide_daily_records_unique_guide_date UNIQUE (guide_id, record_date)
);

CREATE INDEX IF NOT EXISTS idx_guide_daily_records_guide_id ON public.guide_daily_records (guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_daily_records_record_date ON public.guide_daily_records (record_date);
CREATE INDEX IF NOT EXISTS idx_guide_daily_records_guide_date ON public.guide_daily_records (guide_id, record_date);

-- 3. GUIDE ABSENCES TABLE
-- Tracks guide absences for 24-hour periods
CREATE TABLE IF NOT EXISTS public.guide_absences (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  guide_id uuid NOT NULL,
  absent_from timestamp with time zone NOT NULL,
  absent_until timestamp with time zone NOT NULL,
  reason text,
  auto_remove boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  CONSTRAINT guide_absences_pkey PRIMARY KEY (id),
  CONSTRAINT guide_absences_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES public.users (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_guide_absences_guide_id ON public.guide_absences (guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_absences_absent_from ON public.guide_absences (absent_from);
CREATE INDEX IF NOT EXISTS idx_guide_absences_absent_until ON public.guide_absences (absent_until);

-- 4. GUIDE PARAMETERS TABLE
-- Global settings for guide management
CREATE TABLE IF NOT EXISTS public.guide_parameters (
  id uuid NOT NULL DEFAULT gen_random_uuid (),
  trip_fixed_amount numeric (10, 2) NOT NULL DEFAULT 300,
  guide_payment_per_trip numeric (10, 2) NOT NULL DEFAULT 250,
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT NOW(),
  updated_at timestamp with time zone NOT NULL DEFAULT NOW(),
  CONSTRAINT guide_parameters_pkey PRIMARY KEY (id),
  CONSTRAINT guide_parameters_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_guide_parameters_updated_at ON public.guide_parameters (updated_at);

-- Insert default parameters
INSERT INTO public.guide_parameters (trip_fixed_amount, guide_payment_per_trip)
VALUES (300.00, 250.00)
ON CONFLICT DO NOTHING;

-- 5. GUIDE ASSIGNMENT HISTORY VIEW
-- View for analytics and reporting
CREATE OR REPLACE VIEW public.guide_assignment_summary AS
SELECT
  g.id,
  g.full_name,
  g.phone,
  g.avatar_url,
  g.guide_order,
  g.guide_active,
  g.is_verified,
  COUNT(DISTINCT ga.id) as total_assignments,
  COUNT(DISTINCT CASE WHEN ga.status = 'completed' THEN ga.id END) as completed_assignments,
  COUNT(DISTINCT CASE WHEN ga.status = 'cancelled' THEN ga.id END) as cancelled_assignments,
  COUNT(DISTINCT CASE WHEN ga.status = 'no_show' THEN ga.id END) as no_show_count,
  SUM(CASE WHEN ga.status = 'completed' THEN 1 ELSE 0 END) as completion_rate,
  MAX(ga.assigned_at) as last_assigned_at,
  (
    SELECT COUNT(*)
    FROM public.guide_absences
    WHERE guide_id = g.id
      AND absent_until > NOW()
  ) as active_absence_count
FROM public.users g
LEFT JOIN public.guide_assignments ga ON g.id = ga.guide_id
WHERE g.role = 'guide'::user_role
GROUP BY g.id;

-- Permissions (adjust based on your auth setup)
ALTER TABLE public.guide_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guide_parameters ENABLE ROW LEVEL SECURITY;
