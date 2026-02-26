-- migration for manual plan system
-- Adicionar novas colunas à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS billing_type text DEFAULT 'stripe',
ADD COLUMN IF NOT EXISTS plan_expires_at timestamptz,
ADD COLUMN IF NOT EXISTS is_founder boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS category text DEFAULT 'default',
ADD COLUMN IF NOT EXISTS can_customize_theme boolean DEFAULT false;

-- Atualizar o check do plano para incluir fundador_local
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_plan_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_plan_check CHECK (plan IN ('free', 'pro', 'fundador_local'));

-- Criar a VIEW admin_users_overview
CREATE OR REPLACE VIEW admin_users_overview AS
SELECT 
    p.id,
    u.email,
    p.plan,
    p.billing_type,
    p.plan_expires_at,
    p.is_founder,
    p.created_at,
    CASE 
        WHEN p.billing_type = 'manual' AND p.plan_expires_at < now() THEN 'expired'
        WHEN p.plan = 'free' THEN 'free'
        WHEN p.billing_type = 'manual' THEN 'manual_active'
        WHEN p.billing_type = 'stripe' THEN 'stripe_active'
        ELSE 'unknown'
    END as status
FROM public.profiles p
JOIN auth.users u ON p.user_id = u.id;

-- Grant access to the view (standard for Supabase dashboard)
GRANT SELECT ON admin_users_overview TO authenticated, service_role;
