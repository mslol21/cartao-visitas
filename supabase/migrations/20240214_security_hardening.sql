-- Migration for Security and Performance Hardening
-- Resolve critical security views, duplicate indexes, and RLS performance issues

-- 1. CORREÇÃO DA VIEW (SECURITY DEFINER -> SECURITY INVOKER)
-- Isso resolve o alerta "Critical" na view active_profiles
DROP VIEW IF EXISTS public.active_profiles;
CREATE VIEW public.active_profiles 
WITH (security_invoker = true) AS
SELECT * FROM public.profiles
WHERE username IS NOT NULL;

-- 2. LIMPEZA E OTIMIZAÇÃO DA TABELA ANALYTICS
-- Remove duplicidade de políticas e índices
DROP POLICY IF EXISTS "Users can view their own analytics" ON public.analytics;
DROP POLICY IF EXISTS "Anonymous can insert tracking data" ON public.analytics;
DROP POLICY IF EXISTS "Permitir inserção pública de eventos" ON public.analytics;
DROP POLICY IF EXISTS "Dono pode ver seus próprios analytics" ON public.analytics;
DROP POLICY IF EXISTS "Donos podem visualizar suas próprias análises" ON public.analytics;

-- Recria políticas com Otimização de Performance (Auth RLS Initialization Plan)
-- O uso de (SELECT auth.uid()) permite que o Postgres cacheie o ID do usuário
CREATE POLICY "analytics_select_policy" 
ON public.analytics FOR SELECT 
USING (
    profile_id IN (
        SELECT id FROM public.profiles 
        WHERE user_id = (SELECT auth.uid())
    )
);

CREATE POLICY "analytics_insert_policy" 
ON public.analytics FOR INSERT 
WITH CHECK (true);

-- 3. RESOLUÇÃO DE ÍNDICES DUPLICADOS
-- Remove índices que cobrem as mesmas colunas
DROP INDEX IF EXISTS public.analytics_event_type_idx;
DROP INDEX IF EXISTS public.idx_analytics_event_type;

-- Cria um índice único e otimizado para filtragem de eventos
CREATE INDEX IF NOT EXISTS idx_analytics_event_type_final ON public.analytics(event_type);

-- 4. HARDENING DE SEGURANÇA
-- Garante que o RLS está habilitado em todas as tabelas sensíveis
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
