-- Add authority fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN expert_area TEXT,
ADD COLUMN founded_year INTEGER;
