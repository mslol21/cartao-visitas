-- ============================================================================
-- KONNEXY MUSIC PRO - MIGRATION
-- Expansão do Konnexy Cartão Digital para Músicos, Artistas e Bandas
-- Compatível tanto com Neon PostgreSQL quanto com Supabase PostgreSQL
-- ============================================================================

-- 1. Tabela de Configuração do Perfil Musical (music_profiles)
CREATE TABLE IF NOT EXISTS public.music_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  user_id UUID,
  enabled BOOLEAN NOT NULL DEFAULT true,
  template TEXT NOT NULL DEFAULT 'stage' CHECK (template IN ('elegance', 'stage', 'neon', 'acoustic')),
  primary_color TEXT DEFAULT '#ef4444',
  secondary_color TEXT DEFAULT '#f43f5e',
  stage_name TEXT,
  musical_genre TEXT,
  city TEXT,
  state TEXT,
  performance_region TEXT,
  bio_short TEXT,
  hire_button_text TEXT DEFAULT 'Contratar para Eventos',
  whatsapp_hire_message TEXT DEFAULT 'Olá! Conheci seu trabalho pelo seu portfólio Konnexy e gostaria de informações sobre disponibilidade e valores para uma apresentação.',
  hire_email TEXT,
  event_types TEXT[] DEFAULT ARRAY['Casamentos', 'Cerimônias Religiosas', 'Aniversários & 15 Anos', 'Eventos Corporativos', 'Bares & Restaurantes', 'Festivais & Feiras', 'Shows Particulares'],
  avatar_framing TEXT DEFAULT 'center' CHECK (avatar_framing IN ('center', 'top', 'bottom')),
  cover_framing TEXT DEFAULT 'center' CHECK (cover_framing IN ('center', 'top', 'bottom')),
  custom_cover_url TEXT,
  custom_avatar_url TEXT,
  section_order TEXT[] DEFAULT ARRAY['hero', 'releases', 'videos', 'repertoire', 'events', 'contact'],
  hidden_sections TEXT[] DEFAULT ARRAY[]::TEXT[],
  plan_tier TEXT DEFAULT 'music_pro' CHECK (plan_tier IN ('music', 'music_pro', 'standard')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('trial', 'active', 'pending', 'expired', 'canceled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Tabela de Lançamentos e Discografia (music_releases)
CREATE TABLE IF NOT EXISTS public.music_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  slug TEXT NOT NULL,
  release_type TEXT NOT NULL DEFAULT 'single' CHECK (release_type IN ('single', 'ep', 'album', 'faixa', 'pre_save')),
  cover_url TEXT NOT NULL,
  description TEXT,
  release_date DATE,
  genre TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  embed_url TEXT,
  streaming_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_release_slug_per_profile UNIQUE (profile_id, slug)
);

-- 3. Tabela de Vídeos de Apresentações (music_videos)
CREATE TABLE IF NOT EXISTS public.music_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'ao_vivo' CHECK (category IN ('videoclipe', 'ao_vivo', 'casamento', 'corporativo', 'show', 'ensaio', 'promocional')),
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Tabela de Repertório Musical (music_repertoire)
CREATE TABLE IF NOT EXISTS public.music_repertoire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_artist TEXT,
  genre TEXT,
  category TEXT NOT NULL DEFAULT 'geral' CHECK (category IN ('casamentos', 'cerimonias', 'mpb', 'pop', 'rock', 'jazz', 'instrumental', 'corporativo', 'geral')),
  display_order INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Tabela de Agenda de Shows e Eventos (music_events)
CREATE TABLE IF NOT EXISTS public.music_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  description TEXT,
  ticket_url TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Tabela de Métricas e Cliques Musicais (music_analytics)
CREATE TABLE IF NOT EXISTS public.music_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  release_id UUID REFERENCES public.music_releases(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  platform TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para Performance e Buscas Rápidas
CREATE INDEX IF NOT EXISTS idx_music_profiles_profile_id ON public.music_profiles(profile_id);
CREATE INDEX IF NOT EXISTS idx_music_releases_profile_id ON public.music_releases(profile_id);
CREATE INDEX IF NOT EXISTS idx_music_releases_slug ON public.music_releases(profile_id, slug);
CREATE INDEX IF NOT EXISTS idx_music_videos_profile_id ON public.music_videos(profile_id);
CREATE INDEX IF NOT EXISTS idx_music_repertoire_profile_id ON public.music_repertoire(profile_id);
CREATE INDEX IF NOT EXISTS idx_music_events_profile_id ON public.music_events(profile_id, event_date);
CREATE INDEX IF NOT EXISTS idx_music_analytics_profile_id ON public.music_analytics(profile_id, created_at);

-- Habilitar RLS em todas as novas tabelas
ALTER TABLE public.music_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_repertoire ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública (Perfis e dados publicados são visíveis por todos)
DROP POLICY IF EXISTS "Public music_profiles are viewable by everyone" ON public.music_profiles;
CREATE POLICY "Public music_profiles are viewable by everyone" 
  ON public.music_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public music_releases are viewable by everyone" ON public.music_releases;
CREATE POLICY "Public music_releases are viewable by everyone" 
  ON public.music_releases FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Public music_videos are viewable by everyone" ON public.music_videos;
CREATE POLICY "Public music_videos are viewable by everyone" 
  ON public.music_videos FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Public music_repertoire are viewable by everyone" ON public.music_repertoire;
CREATE POLICY "Public music_repertoire are viewable by everyone" 
  ON public.music_repertoire FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public music_events are viewable by everyone" ON public.music_events;
CREATE POLICY "Public music_events are viewable by everyone" 
  ON public.music_events FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Music analytics insertable by public" ON public.music_analytics;
CREATE POLICY "Music analytics insertable by public" 
  ON public.music_analytics FOR INSERT WITH CHECK (true);

-- Políticas de Gerenciamento (Compatibilidade automática: Supabase com auth.uid() e Neon Serverless com acesso autenticado)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth') THEN
    -- Ambiente Supabase: validação baseada no schema 'auth'
    DROP POLICY IF EXISTS "Users can manage their own music_profiles" ON public.music_profiles;
    EXECUTE '
      CREATE POLICY "Users can manage their own music_profiles"
        ON public.music_profiles FOR ALL
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = music_profiles.profile_id AND user_id = auth.uid()));
    ';

    DROP POLICY IF EXISTS "Users can manage their own music_releases" ON public.music_releases;
    EXECUTE '
      CREATE POLICY "Users can manage their own music_releases"
        ON public.music_releases FOR ALL
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = music_releases.profile_id AND user_id = auth.uid()));
    ';

    DROP POLICY IF EXISTS "Users can manage their own music_videos" ON public.music_videos;
    EXECUTE '
      CREATE POLICY "Users can manage their own music_videos"
        ON public.music_videos FOR ALL
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = music_videos.profile_id AND user_id = auth.uid()));
    ';

    DROP POLICY IF EXISTS "Users can manage their own music_repertoire" ON public.music_repertoire;
    EXECUTE '
      CREATE POLICY "Users can manage their own music_repertoire"
        ON public.music_repertoire FOR ALL
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = music_repertoire.profile_id AND user_id = auth.uid()));
    ';

    DROP POLICY IF EXISTS "Users can manage their own music_events" ON public.music_events;
    EXECUTE '
      CREATE POLICY "Users can manage their own music_events"
        ON public.music_events FOR ALL
        USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = music_events.profile_id AND user_id = auth.uid()));
    ';
  ELSE
    -- Ambiente Neon PostgreSQL: autorização gerenciada com segurança no servidor Next.js
    DROP POLICY IF EXISTS "Server manages music_profiles" ON public.music_profiles;
    CREATE POLICY "Server manages music_profiles" ON public.music_profiles FOR ALL USING (true);

    DROP POLICY IF EXISTS "Server manages music_releases" ON public.music_releases;
    CREATE POLICY "Server manages music_releases" ON public.music_releases FOR ALL USING (true);

    DROP POLICY IF EXISTS "Server manages music_videos" ON public.music_videos;
    CREATE POLICY "Server manages music_videos" ON public.music_videos FOR ALL USING (true);

    DROP POLICY IF EXISTS "Server manages music_repertoire" ON public.music_repertoire;
    CREATE POLICY "Server manages music_repertoire" ON public.music_repertoire FOR ALL USING (true);

    DROP POLICY IF EXISTS "Server manages music_events" ON public.music_events;
    CREATE POLICY "Server manages music_events" ON public.music_events FOR ALL USING (true);
  END IF;
END $$;
