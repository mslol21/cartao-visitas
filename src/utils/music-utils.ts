import type { Profile } from '@/types/profile';
import type { MusicProfileConfig, MusicProfileData, MusicRelease, MusicVideo, MusicRepertoireItem, MusicEvent } from '@/types/music';
import { DEFAULT_MUSIC_HIRE_MESSAGE, MUSIC_DEFAULT_EVENT_TYPES } from '@/config/music-constants';

export function getDefaultMusicConfig(profile?: Partial<Profile> | null): MusicProfileConfig {
  return {
    enabled: true,
    template: 'stage',
    primary_color: '#ef4444',
    secondary_color: '#f43f5e',
    stage_name: profile?.business_name || profile?.name || '',
    musical_genre: (profile?.custom_fields as any)?.estilo_musical || 'Pop / Rock / Shows',
    city: profile?.city || profile?.area_atendimento || '',
    state: '',
    performance_region: profile?.area_atendimento || 'Todo o Brasil',
    bio_short: profile?.bio_profissional || profile?.subtitle || profile?.tagline || '',
    hire_button_text: 'Contratar para Eventos',
    whatsapp_hire_message: DEFAULT_MUSIC_HIRE_MESSAGE,
    hire_email: '',
    event_types: MUSIC_DEFAULT_EVENT_TYPES,
    avatar_framing: 'center',
    cover_framing: 'center',
    custom_cover_url: '',
    custom_avatar_url: '',
    section_order: ['hero', 'releases', 'videos', 'repertoire', 'events', 'contact'],
    hidden_sections: [],
    plan_tier: profile?.plan === 'pro' ? 'music_pro' : 'music',
    subscription_status: 'active'
  };
}

export function parseMusicProfileData(profile?: Partial<Profile> | null): MusicProfileData {
  const raw = (profile?.custom_fields as any)?.music_pro;
  const config = {
    ...getDefaultMusicConfig(profile),
    ...(raw?.config || raw || {})
  };

  const releases: MusicRelease[] = Array.isArray(raw?.releases) ? raw.releases : [];
  const videos: MusicVideo[] = Array.isArray(raw?.videos) ? raw.videos : [];
  const repertoire: MusicRepertoireItem[] = Array.isArray(raw?.repertoire) ? raw.repertoire : [];
  const events: MusicEvent[] = Array.isArray(raw?.events) ? raw.events : [];

  return { config, releases, videos, repertoire, events };
}
