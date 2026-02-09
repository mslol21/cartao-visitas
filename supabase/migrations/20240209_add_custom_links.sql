-- Migration to add custom_links column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS custom_links JSONB DEFAULT '[]'::jsonb;
