ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp_secondary TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_secondary_message TEXT;
