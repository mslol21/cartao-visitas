-- Add whatsapp_message column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp_message TEXT;
