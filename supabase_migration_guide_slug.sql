ALTER TABLE public.users ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

UPDATE public.users
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(full_name, '[^a-zA-Z0-9\s-]', '', 'g'),
    '\s+',
    '-',
    'g'
  )
) || '-guide-ourika'
WHERE role = 'guide' AND slug IS NULL AND full_name IS NOT NULL;
