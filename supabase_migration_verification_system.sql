-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Guide Verification System Migration
-- Run this in Supabase SQL Editor
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_verified          BOOLEAN   DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS verification_status  TEXT      DEFAULT 'unsubmitted'
    CHECK (verification_status IN (
      'unsubmitted',   -- guide has not requested yet
      'pending',       -- guide submitted request, waiting for admin
      'verified',      -- admin approved
      'rejected'       -- admin rejected
    )),
  ADD COLUMN IF NOT EXISTS verification_note    TEXT,       -- admin can leave a reason
  ADD COLUMN IF NOT EXISTS verified_at          TIMESTAMPTZ;

-- Index for admin dashboard performance
CREATE INDEX IF NOT EXISTS idx_users_verification_status
  ON public.users(verification_status)
  WHERE role = 'guide';

-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
-- Column Descriptions:
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
--
-- is_verified:         Boolean flag - true when admin verifies the guide
-- verification_status: Current status in the verification workflow
--                      - 'unsubmitted': Guide hasn't requested verification yet
--                      - 'pending': Guide requested, waiting for admin review
--                      - 'verified': Admin approved the guide
--                      - 'rejected': Admin rejected with a note
-- verification_note:   Optional text note from admin (shown to guide if rejected)
-- verified_at:         Timestamp when admin verified the guide
--
-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Verify the migration
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users'
  AND column_name IN (
    'is_verified',
    'verification_status',
    'verification_note',
    'verified_at'
  )
ORDER BY column_name;

-- Check the constraint
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.users'::regclass
  AND conname LIKE '%verification_status%';

-- Check the index
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users'
  AND indexname = 'idx_users_verification_status';

