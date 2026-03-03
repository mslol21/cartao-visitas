-- Atualizar a VIEW para usar o username no lugar do email
CREATE OR REPLACE VIEW admin_users_overview AS
SELECT 
    p.id,
    p.user_id,
    -- Substituindo email por username para privacidade administrativa
    p.username as display_name,
    u.email as private_email, -- Mantido internamente se precisar mas não exibido por padrão
    p.plan,
    p.billing_type,
    p.plan_expires_at,
    p.is_founder,
    p.category,
    p.can_customize_theme,
    p.role,
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
