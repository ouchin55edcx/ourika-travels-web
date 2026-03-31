-- Add can_add_treks permission to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS can_add_treks BOOLEAN DEFAULT false;

-- Add general settings table
CREATE TABLE IF NOT EXISTS general_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO general_settings (key, value) VALUES
  ('site_logo_url', NULL),
  ('site_name', 'Ourika Travels')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE general_settings ENABLE ROW LEVEL SECURITY;

-- Allow admins to read/write settings
CREATE POLICY "settings_admin_full_access" ON general_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Allow authenticated users to read settings
CREATE POLICY "settings_public_read" ON general_settings
  FOR SELECT USING (auth.role() = 'authenticated');

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_general_settings_key ON general_settings(key);
