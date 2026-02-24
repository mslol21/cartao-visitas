-- Add photo customization fields for enhanced avatar control
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS photo_filter TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS photo_border_effect TEXT DEFAULT 'none';
