-- Migration: 20260914000000_security_audit_fixes.sql
-- Segurança e Isolamento Multi-Tenant Estrito no Supabase

-- 1. CORREÇÃO DA TRIGGER DE PROTEÇÃO DE CAMPOS SENSÍVEIS (INSERT + UPDATE)
-- Impede que novos usuários se auto-atribuam role 'admin' ou plano 'pro' durante o INSERT
CREATE OR REPLACE FUNCTION public.protect_profile_fields()
RETURNS TRIGGER AS $$
DECLARE
  is_admin BOOLEAN := false;
BEGIN
  -- Permite bypass apenas se for a conexão service_role do servidor (Stripe webhooks, admin server actions)
  IF current_setting('role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- Se for INSERT por um usuário cliente:
  IF TG_OP = 'INSERT' THEN
    -- Forçar valores padrão de segurança caso o usuário tenha passado campos privilegiados
    NEW.role := 'user';
    NEW.plan := 'free';
    NEW.billing_type := 'stripe';
    NEW.plan_expires_at := NULL;
    NEW.is_founder := false;
    NEW.can_customize_theme := false;
    RETURN NEW;
  END IF;

  -- Se for UPDATE por um usuário autenticado:
  IF TG_OP = 'UPDATE' THEN
    -- Impede a transferência ou sequestro de titularidade do perfil
    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
      RAISE EXCEPTION 'Erro de Segurança: Não é permitido transferir o perfil para outro user_id.';
    END IF;

    -- Verificar se o usuário atual é admin
    IF auth.uid() IS NOT NULL THEN
      SELECT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE user_id = auth.uid() AND role = 'admin'
      ) INTO is_admin;
    END IF;

    -- Se não for admin, bloqueia a modificação das colunas de permissão e faturamento
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
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reassociar o trigger para agir em BEFORE INSERT OR UPDATE
DROP TRIGGER IF EXISTS protect_profile_fields_trigger ON public.profiles;
CREATE TRIGGER protect_profile_fields_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_fields();

-- 2. POLÍTICA EXPLÍCITA DE DELETE EM PROFILES
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;
CREATE POLICY "Users can delete own profile" 
ON public.profiles FOR DELETE 
USING (auth.uid() = user_id);

-- 3. POLÍTICAS DE STORAGE ISOLADAS POR TENANT (BUCKET 'avatars')
-- Usuários autenticados só podem deletar ou alterar objetos cujo owner seja seu auth.uid()
DROP POLICY IF EXISTS "Avatar authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Avatar owner update" ON storage.objects;
DROP POLICY IF EXISTS "Avatar owner delete" ON storage.objects;

CREATE POLICY "Avatar authenticated upload" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Avatar owner update" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND (auth.uid() = owner OR auth.uid()::text = (storage.foldername(name))[1])
);

CREATE POLICY "Avatar owner delete" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND (auth.uid() = owner OR auth.uid()::text = (storage.foldername(name))[1])
);

-- 4. VALIDAÇÃO DE TIPOS DE EVENTOS EM ANALYTICS
ALTER TABLE public.analytics DROP CONSTRAINT IF EXISTS analytics_event_type_check;
ALTER TABLE public.analytics ADD CONSTRAINT analytics_event_type_check 
CHECK (event_type IN (
  'page_view', 
  'click_whatsapp', 
  'click_instagram', 
  'click_linkedin', 
  'click_facebook', 
  'click_tiktok', 
  'click_twitter', 
  'click_youtube', 
  'click_website', 
  'click_cta', 
  'click_address', 
  'click_music_play',
  'click_custom_links'
));
