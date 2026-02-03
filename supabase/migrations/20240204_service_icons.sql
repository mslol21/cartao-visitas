-- Migration to support icons for services
-- Convert services TEXT[] to JSONB with dependency handling

-- 1. Drop dependent views first
DROP VIEW IF EXISTS public.active_profiles;

-- 2. Create a temporary column
ALTER TABLE public.profiles ADD COLUMN services_new JSONB DEFAULT '[]'::jsonb;

-- 3. Migrate existing data (TEXT[] to JSONB array of objects)
UPDATE public.profiles 
SET services_new = (
  SELECT jsonb_agg(jsonb_build_object('name', s, 'icon', 'Sparkles'))
  FROM unnest(services) AS s
)
WHERE services IS NOT NULL AND array_length(services, 1) > 0;

-- 4. Drop old column and rename new one
ALTER TABLE public.profiles DROP COLUMN services;
ALTER TABLE public.profiles RENAME COLUMN services_new TO services;

-- 5. Recreate the dependent view
CREATE OR REPLACE VIEW public.active_profiles AS
SELECT * FROM public.profiles
WHERE username IS NOT NULL;
