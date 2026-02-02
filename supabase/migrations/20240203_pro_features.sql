-- Migration to add premium features to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS theme_style TEXT DEFAULT 'standard' CHECK (theme_style IN ('standard', 'oled', 'glass', 'minimalist')),
ADD COLUMN IF NOT EXISTS font_family TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS background_video_url TEXT;

-- Update RLS if needed, but profiles are already public for SELECT
