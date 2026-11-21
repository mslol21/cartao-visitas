import { z } from 'zod';

export type MusicTemplateId = 'elegance' | 'stage' | 'neon' | 'acoustic';

export type MusicReleaseType = 'single' | 'ep' | 'album' | 'faixa' | 'pre_save';

export type MusicVideoCategory = 
  | 'videoclipe' 
  | 'ao_vivo' 
  | 'casamento' 
  | 'corporativo' 
  | 'show' 
  | 'ensaio' 
  | 'promocional';

export type MusicRepertoireCategory = 
  | 'casamentos' 
  | 'cerimonias' 
  | 'mpb' 
  | 'pop' 
  | 'rock' 
  | 'jazz' 
  | 'instrumental' 
  | 'corporativo' 
  | 'geral';

export type MusicPlatformId = 
  | 'spotify' 
  | 'apple_music' 
  | 'deezer' 
  | 'youtube_music' 
  | 'youtube' 
  | 'amazon_music' 
  | 'soundcloud' 
  | 'bandcamp' 
  | 'mixcloud' 
  | 'tidal' 
  | 'custom';

export interface MusicStreamingLink {
  platform: MusicPlatformId;
  url: string;
  label?: string;
}

export interface MusicRelease {
  id: string;
  profile_id?: string;
  title: string;
  artist: string;
  slug: string;
  release_type: MusicReleaseType;
  cover_url: string;
  description?: string;
  release_date?: string;
  genre?: string;
  featured?: boolean;
  published: boolean;
  order: number;
  embed_url?: string;
  streaming_links: MusicStreamingLink[];
  created_at?: string;
  updated_at?: string;
}

export interface MusicVideo {
  id: string;
  profile_id?: string;
  title: string;
  description?: string;
  category: MusicVideoCategory;
  video_url: string;
  thumbnail_url?: string;
  duration?: string;
  order: number;
  published: boolean;
  created_at?: string;
}

export interface MusicRepertoireItem {
  id: string;
  profile_id?: string;
  title: string;
  original_artist?: string;
  genre?: string;
  category: MusicRepertoireCategory;
  order: number;
  notes?: string;
  created_at?: string;
}

export interface MusicEvent {
  id: string;
  profile_id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  venue: string;
  city: string;
  state?: string;
  description?: string;
  ticket_url?: string;
  is_private: boolean;
  published: boolean;
  created_at?: string;
}

export interface MusicProfileConfig {
  enabled: boolean;
  template: MusicTemplateId;
  primary_color?: string;
  secondary_color?: string;
  stage_name?: string;
  musical_genre?: string;
  city?: string;
  state?: string;
  performance_region?: string;
  bio_short?: string;
  hire_button_text?: string;
  whatsapp_hire_message?: string;
  hire_email?: string;
  event_types: string[];
  avatar_framing?: 'center' | 'top' | 'bottom';
  cover_framing?: 'center' | 'top' | 'bottom';
  custom_cover_url?: string;
  custom_avatar_url?: string;
  section_order: Array<'hero' | 'releases' | 'videos' | 'repertoire' | 'events' | 'contact'>;
  hidden_sections: Array<'releases' | 'videos' | 'repertoire' | 'events' | 'contact'>;
  plan_tier?: 'music' | 'music_pro' | 'standard';
  subscription_status?: 'trial' | 'active' | 'pending' | 'expired' | 'canceled';
}

export interface MusicProfileData {
  config: MusicProfileConfig;
  releases: MusicRelease[];
  videos: MusicVideo[];
  repertoire: MusicRepertoireItem[];
  events: MusicEvent[];
}

export const MUSIC_PROFESSIONS = [
  'musico',
  'cantor',
  'compositor',
  'banda',
  'grupo_musical',
  'dj',
  'instrumentista',
  'produtor_musical'
] as const;

export type MusicProfession = typeof MUSIC_PROFESSIONS[number];

export function isMusicProfession(profession?: string | null): boolean {
  if (!profession) return false;
  return MUSIC_PROFESSIONS.includes(profession as MusicProfession);
}

// Schemas for validation
export const musicStreamingLinkSchema = z.object({
  platform: z.enum([
    'spotify', 'apple_music', 'deezer', 'youtube_music', 'youtube',
    'amazon_music', 'soundcloud', 'bandcamp', 'mixcloud', 'tidal', 'custom'
  ]),
  url: z.string().url("URL de streaming inválida"),
  label: z.string().optional()
});

export const musicReleaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Título do lançamento é obrigatório"),
  artist: z.string().min(1, "Nome do artista é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório").regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  release_type: z.enum(['single', 'ep', 'album', 'faixa', 'pre_save']),
  cover_url: z.string().url("URL da capa inválida"),
  description: z.string().optional(),
  release_date: z.string().optional(),
  genre: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
  embed_url: z.string().optional(),
  streaming_links: z.array(musicStreamingLinkSchema).default([])
});

export const musicVideoSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Título do vídeo é obrigatório"),
  description: z.string().optional(),
  category: z.enum(['videoclipe', 'ao_vivo', 'casamento', 'corporativo', 'show', 'ensaio', 'promocional']),
  video_url: z.string().url("URL do vídeo inválida"),
  thumbnail_url: z.string().optional(),
  duration: z.string().optional(),
  order: z.number().int().default(0),
  published: z.boolean().default(true)
});

export const musicRepertoireItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Nome da música é obrigatório"),
  original_artist: z.string().optional(),
  genre: z.string().optional(),
  category: z.enum(['casamentos', 'cerimonias', 'mpb', 'pop', 'rock', 'jazz', 'instrumental', 'corporativo', 'geral']),
  order: z.number().int().default(0),
  notes: z.string().optional()
});

export const musicEventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, "Título do evento é obrigatório"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().optional(),
  venue: z.string().min(1, "Local é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().optional(),
  description: z.string().optional(),
  ticket_url: z.string().optional(),
  is_private: z.boolean().default(false),
  published: z.boolean().default(true)
});
