-- ADICIONAR COLUNA DE ROLE
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- ATUALIZAR A VIEW PARA INCLUIR O ROLE
CREATE OR REPLACE VIEW admin_users_overview AS
SELECT 
    p.id,
    p.user_id,
    u.email,
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

-- POLÍTICA DE SEGURANÇA: ADMINS PODEM VER E EDITAR TUDO
CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
  )
);
