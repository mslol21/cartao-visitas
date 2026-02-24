-- Add avatar_frame to profiles table
ALTER TABLE public.profiles 
ADD COLUMN avatar_frame TEXT DEFAULT 'none';
