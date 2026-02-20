-- Add location and service area fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN address TEXT,
ADD COLUMN service_area TEXT;
