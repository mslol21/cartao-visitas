-- Add business_hours column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}'::jsonb;

-- Comment on column
COMMENT ON COLUMN public.profiles.business_hours IS 'Stores business hours as a JSON object with days as keys';

-- Refresh the view if it exists (though it usually auto-refreshes for simple SELECT *)
-- No need for admin_users_overview as it uses SELECT * or explicitly lists columns, 
-- but it doesn't hurt to recreate it if needed.
