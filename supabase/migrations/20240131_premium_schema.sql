-- Refinement of profiles table for Senior SaaS level
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS linkedin TEXT,
ADD COLUMN IF NOT EXISTS facebook TEXT,
ADD COLUMN IF NOT EXISTS tiktok TEXT,
ADD COLUMN IF NOT EXISTS twitter TEXT,
ADD COLUMN IF NOT EXISTS youtube TEXT,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS theme_color TEXT DEFAULT '#3b82f6',
ADD COLUMN IF NOT EXISTS custom_slug TEXT UNIQUE;

-- Ensure the public can only see active profiles or profiles with usernames
CREATE OR REPLACE VIEW public.active_profiles AS
SELECT * FROM public.profiles
WHERE username IS NOT NULL;

-- Update RLS for better security
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Storage bucket is already public but let's ensure it exists with correct name
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar public access" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Avatar authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Avatar owner update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);
CREATE POLICY "Avatar owner delete" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid() = owner);
