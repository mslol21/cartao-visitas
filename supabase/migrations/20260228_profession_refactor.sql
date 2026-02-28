-- Migração para refatoração completa da estrutura de profissões

-- Adicionar novas colunas em português/misto como solicitado
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS profession text,
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS subtitle text,
ADD COLUMN IF NOT EXISTS area_atendimento text,
ADD COLUMN IF NOT EXISTS tipo_atendimento text,
ADD COLUMN IF NOT EXISTS horario_funcionamento text,
ADD COLUMN IF NOT EXISTS has_physical_location boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS endereco_completo text,
ADD COLUMN IF NOT EXISTS bio_profissional text,
ADD COLUMN IF NOT EXISTS diferenciais text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS servicos jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS ativo boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}'::jsonb;

-- Mapear plan compliance
-- Notice: `plan` and `whatsapp`, `instagram` columns already existed, but user requested `plano (text default 'manual')`. 
-- Since `plan` exists we can also add `plano` to strictly match the request or assume they meant to update the existing one.
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plano text DEFAULT 'manual';

-- Atualizar dados existentes (migração simples)
UPDATE public.profiles
SET 
  business_name = COALESCE(business_name, name),
  subtitle = COALESCE(subtitle, tagline),
  endereco_completo = COALESCE(endereco_completo, address),
  area_atendimento = COALESCE(area_atendimento, service_area),
  profession = COALESCE(profession, category);
