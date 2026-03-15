-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Guide Profile Columns Migration
-- Run this in Supabase SQL Editor
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS specialties    TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS languages      TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS location       TEXT,
  ADD COLUMN IF NOT EXISTS years_experience INTEGER,
  ADD COLUMN IF NOT EXISTS certifications TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badge_image_url TEXT;

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Column Descriptions:
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- specialties:       Array of guide specialties (e.g., ['Hiking', 'Cultural tours'])
-- languages:         Array of languages spoken (e.g., ['Arabic', 'French', 'English'])
-- location:          Guide's base location (e.g., 'Setti Fatma, Ourika Valley')
-- years_experience:  Number of years as a guide (1-50)
-- certifications:    Array of certifications (e.g., ['Certified mountain guide'])
-- badge_image_url:   URL to uploaded guide badge image (Cloudflare Images)
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Verify the migration
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN (
    'specialties',
    'languages',
    'location',
    'years_experience',
    'certifications',
    'badge_image_url'
  )
ORDER BY column_name;

