-- 1. REVOGAR ACESSO PÚBLICO À VIEW ADMINISTRATIVA
-- Apenas service_role / supabase admin necessita consultar esta view.
-- Isso impede que qualquer usuário autenticado comum possa ler a lista de usuários e emails pelo client-side.
REVOKE SELECT ON public.admin_users_overview FROM authenticated;
GRANT SELECT ON public.admin_users_overview TO service_role;

-- 2. FUNÇÃO E TRIGGER PARA IMPEDIR ESCALAÇÃO DE PRIVILÉGIOS (ROLE) E ALTERAÇÃO DE PLANOS (PLAN)
-- Usuários finais não devem conseguir atualizar 'role', 'plan', 'billing_type', 'plan_expires_at', 'is_founder' ou 'can_customize_theme'
-- por meio de atualizações RLS no client-side.
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN := false;
BEGIN
  -- Se a conexão for do service_role (ex: Stripe webhooks, Server Actions com admin client), permite qualquer alteração
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Se for um usuário autenticado pelo JWT, verifica se ele já é um administrador
  IF auth.uid() IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    ) INTO is_admin;
  END IF;

  -- Se não for um administrador, bloqueia a modificação de colunas sensíveis de faturamento e permissões
  IF NOT is_admin THEN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Erro de Segurança: Você não tem permissão para alterar o campo "role".';
    END IF;
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
      RAISE EXCEPTION 'Erro de Segurança: Você não tem permissão para alterar o campo "plan".';
    END IF;
    IF NEW.billing_type IS DISTINCT FROM OLD.billing_type THEN
      RAISE EXCEPTION 'Erro de Segurança: Você não tem permissão para alterar o campo "billing_type".';
    END IF;
    IF NEW.plan_expires_at IS DISTINCT FROM OLD.plan_expires_at THEN
      RAISE EXCEPTION 'Erro de Segurança: Você não tem permissão para alterar o campo "plan_expires_at".';
    END IF;
    IF NEW.is_founder IS DISTINCT FROM OLD.is_founder THEN
      RAISE EXCEPTION 'Erro de Segurança: Você não tem permissão para alterar o campo "is_founder".';
    END IF;
    IF NEW.can_customize_theme IS DISTINCT FROM OLD.can_customize_theme THEN
      RAISE EXCEPTION 'Erro de Segurança: Você não tem permissão para alterar o campo "can_customize_theme".';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Associar a função de proteção como trigger BEFORE UPDATE
DROP TRIGGER IF EXISTS protect_profile_fields_trigger ON public.profiles;
CREATE TRIGGER protect_profile_fields_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_fields();
