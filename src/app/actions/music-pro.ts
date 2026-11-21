"use server";

import { createClient, createAdminClient } from '@/utils/supabase/server';
import { getNeonSql } from '@/utils/neon/db';
import type { 
  MusicProfileConfig, 
  MusicRelease, 
  MusicVideo, 
  MusicRepertoireItem, 
  MusicEvent, 
  MusicProfileData 
} from '@/types/music';
import { 
  musicReleaseSchema, 
  musicVideoSchema, 
  musicRepertoireItemSchema, 
  musicEventSchema 
} from '@/types/music';
import { DEFAULT_MUSIC_HIRE_MESSAGE, MUSIC_DEFAULT_EVENT_TYPES } from '@/config/music-constants';
import type { Profile } from '@/types/profile';
import { getDefaultMusicConfig, parseMusicProfileData } from '@/utils/music-utils';

async function authenticatedUserId(accessToken?: string): Promise<string> {
  const supabase = await createClient();
  const { data: { user }, error } = accessToken
    ? await supabase.auth.getUser(accessToken)
    : await supabase.auth.getUser();
  if (error || !user) throw new Error('Não autenticado');
  return user.id;
}

/**
 * Obtém os dados completos de música de um perfil pelo username ou profileId
 */
export async function getMusicProfileData(identifier: string): Promise<MusicProfileData | null> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    let profile: Profile | null = null;

    if (process.env.NEON_READS_ENABLED === 'true') {
      const sql = getNeonSql();
      const rows = isUuid 
        ? await sql`SELECT * FROM public.profiles WHERE id = ${identifier}::uuid LIMIT 1`
        : await sql`SELECT * FROM public.profiles WHERE username = ${identifier} LIMIT 1`;
      profile = (rows[0] as unknown as Profile) || null;
    } else {
      const supabase = await createClient();
      const query = supabase.from('profiles').select('*');
      const { data } = isUuid 
        ? await query.eq('id', identifier).maybeSingle()
        : await query.eq('username', identifier).maybeSingle();
      profile = (data as Profile) || null;
    }

    if (!profile) return null;
    return parseMusicProfileData(profile);
  } catch (error) {
    console.error('Error in getMusicProfileData:', error);
    return null;
  }
}

/**
 * Salva a configuração visual e institucional do Music Pro
 */
export async function saveMusicConfigAction(
  configInput: Partial<MusicProfileConfig>, 
  accessToken?: string
) {
  try {
    const userId = await authenticatedUserId(accessToken);
    const supabase = await createAdminClient();
    if (!supabase) throw new Error('Serviço indisponível');

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('id, user_id, custom_fields')
      .eq('user_id', userId)
      .single();

    if (profileErr || !profile) throw new Error('Perfil não encontrado');

    const existingCustomFields = (profile.custom_fields || {}) as any;
    const currentMusicData = existingCustomFields.music_pro || {
      config: getDefaultMusicConfig(profile),
      releases: [],
      videos: [],
      repertoire: [],
      events: []
    };

    const updatedConfig: MusicProfileConfig = {
      ...getDefaultMusicConfig(profile),
      ...(currentMusicData.config || {}),
      ...configInput
    };

    const updatedMusicData: MusicProfileData = {
      ...currentMusicData,
      config: updatedConfig
    };

    const newCustomFields = {
      ...existingCustomFields,
      music_pro: updatedMusicData
    };

    const { error: updateErr } = await supabase
      .from('profiles')
      .update({ custom_fields: newCustomFields, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (updateErr) throw updateErr;

    // Se estiver usando Neon diretamente, atualiza também
    if (process.env.NEON_READS_ENABLED === 'true') {
      const sql = getNeonSql();
      await sql`UPDATE public.profiles 
        SET custom_fields = ${JSON.stringify(newCustomFields)}::jsonb, updated_at = now() 
        WHERE id = ${profile.id}::uuid`;
    }

    return { success: true, config: updatedConfig };
  } catch (err: any) {
    console.error('saveMusicConfigAction error:', err);
    return { success: false, error: err.message || 'Erro ao salvar configuração de música' };
  }
}

/**
 * Adiciona ou edita um lançamento musical (Discografia)
 */
export async function saveMusicReleaseAction(
  releaseInput: Partial<MusicRelease>, 
  accessToken?: string
) {
  try {
    const userId = await authenticatedUserId(accessToken);
    const supabase = await createAdminClient();
    if (!supabase) throw new Error('Serviço indisponível');

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id, custom_fields')
      .eq('user_id', userId)
      .single();

    if (!profile) throw new Error('Perfil não encontrado');

    const parsed = musicReleaseSchema.parse({
      id: releaseInput.id || crypto.randomUUID(),
      title: releaseInput.title,
      artist: releaseInput.artist,
      slug: (releaseInput.slug || releaseInput.title || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
      release_type: releaseInput.release_type || 'single',
      cover_url: releaseInput.cover_url,
      description: releaseInput.description || '',
      release_date: releaseInput.release_date || new Date().toISOString().split('T')[0],
      genre: releaseInput.genre || '',
      featured: releaseInput.featured || false,
      published: releaseInput.published ?? true,
      order: releaseInput.order ?? 0,
      embed_url: releaseInput.embed_url || '',
      streaming_links: releaseInput.streaming_links || []
    });

    const existingCustomFields = (profile.custom_fields || {}) as any;
    const currentMusicData = parseMusicProfileData(profile);
    const existingReleases = [...currentMusicData.releases];

    const existingIndex = existingReleases.findIndex(r => r.id === parsed.id || r.slug === parsed.slug);
    if (existingIndex >= 0) {
      existingReleases[existingIndex] = { ...existingReleases[existingIndex], ...parsed };
    } else {
      existingReleases.unshift(parsed);
    }

    const updatedMusicData: MusicProfileData = {
      ...currentMusicData,
      releases: existingReleases
    };

    const newCustomFields = {
      ...existingCustomFields,
      music_pro: updatedMusicData
    };

    await supabase
      .from('profiles')
      .update({ custom_fields: newCustomFields, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (process.env.NEON_READS_ENABLED === 'true') {
      const sql = getNeonSql();
      await sql`UPDATE public.profiles 
        SET custom_fields = ${JSON.stringify(newCustomFields)}::jsonb, updated_at = now() 
        WHERE id = ${profile.id}::uuid`;
    }

    return { success: true, release: parsed };
  } catch (err: any) {
    console.error('saveMusicReleaseAction error:', err);
    return { success: false, error: err.message || 'Erro ao salvar lançamento' };
  }
}

/**
 * Remove um lançamento musical
 */
export async function deleteMusicReleaseAction(releaseId: string, accessToken?: string) {
  try {
    const userId = await authenticatedUserId(accessToken);
    const supabase = await createAdminClient();
    if (!supabase) throw new Error('Serviço indisponível');

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id, custom_fields')
      .eq('user_id', userId)
      .single();

    if (!profile) throw new Error('Perfil não encontrado');

    const existingCustomFields = (profile.custom_fields || {}) as any;
    const currentMusicData = parseMusicProfileData(profile);
    const filteredReleases = currentMusicData.releases.filter(r => r.id !== releaseId);

    const updatedMusicData: MusicProfileData = {
      ...currentMusicData,
      releases: filteredReleases
    };

    const newCustomFields = {
      ...existingCustomFields,
      music_pro: updatedMusicData
    };

    await supabase
      .from('profiles')
      .update({ custom_fields: newCustomFields, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    if (process.env.NEON_READS_ENABLED === 'true') {
      const sql = getNeonSql();
      await sql`UPDATE public.profiles 
        SET custom_fields = ${JSON.stringify(newCustomFields)}::jsonb, updated_at = now() 
        WHERE id = ${profile.id}::uuid`;
    }

    return { success: true };
  } catch (err: any) {
    console.error('deleteMusicReleaseAction error:', err);
    return { success: false, error: err.message || 'Erro ao excluir lançamento' };
  }
}

/**
 * Salva vídeo musical (Videoclipe, Ao Vivo, Casamento, etc.)
 */
export async function saveMusicVideoAction(videoInput: Partial<MusicVideo>, accessToken?: string) {
  try {
    const userId = await authenticatedUserId(accessToken);
    const supabase = await createAdminClient();
    if (!supabase) throw new Error('Serviço indisponível');

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id, custom_fields')
      .eq('user_id', userId)
      .single();

    if (!profile) throw new Error('Perfil não encontrado');

    const parsed = musicVideoSchema.parse({
      id: videoInput.id || crypto.randomUUID(),
      title: videoInput.title,
      description: videoInput.description || '',
      category: videoInput.category || 'ao_vivo',
      video_url: videoInput.video_url,
      thumbnail_url: videoInput.thumbnail_url || '',
      duration: videoInput.duration || '',
      order: videoInput.order ?? 0,
      published: videoInput.published ?? true
    });

    const existingCustomFields = (profile.custom_fields || {}) as any;
    const currentMusicData = parseMusicProfileData(profile);
    const existingVideos = [...currentMusicData.videos];

    const idx = existingVideos.findIndex(v => v.id === parsed.id);
    if (idx >= 0) {
      existingVideos[idx] = parsed;
    } else {
      existingVideos.unshift(parsed);
    }

    const updatedMusicData: MusicProfileData = {
      ...currentMusicData,
      videos: existingVideos
    };

    const newCustomFields = {
      ...existingCustomFields,
      music_pro: updatedMusicData
    };

    await supabase
      .from('profiles')
      .update({ custom_fields: newCustomFields, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    return { success: true, video: parsed };
  } catch (err: any) {
    console.error('saveMusicVideoAction error:', err);
    return { success: false, error: err.message || 'Erro ao salvar vídeo' };
  }
}

/**
 * Remove vídeo musical
 */
export async function deleteMusicVideoAction(videoId: string, accessToken?: string) {
  try {
    const userId = await authenticatedUserId(accessToken);
    const supabase = await createAdminClient();
    if (!supabase) throw new Error('Serviço indisponível');

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id, custom_fields')
      .eq('user_id', userId)
      .single();

    if (!profile) throw new Error('Perfil não encontrado');

    const existingCustomFields = (profile.custom_fields || {}) as any;
    const currentMusicData = parseMusicProfileData(profile);
    const filteredVideos = currentMusicData.videos.filter(v => v.id !== videoId);

    const updatedMusicData: MusicProfileData = {
      ...currentMusicData,
      videos: filteredVideos
    };

    const newCustomFields = {
      ...existingCustomFields,
      music_pro: updatedMusicData
    };

    await supabase
      .from('profiles')
      .update({ custom_fields: newCustomFields, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    return { success: true };
  } catch (err: any) {
    console.error('deleteMusicVideoAction error:', err);
    return { success: false, error: err.message || 'Erro ao excluir vídeo' };
  }
}

/**
 * Salva item de repertório musical
 */
export async function saveMusicRepertoireAction(itemInput: Partial<MusicRepertoireItem>, accessToken?: string) {
  try {
    const userId = await authenticatedUserId(accessToken);
    const supabase = await createAdminClient();
    if (!supabase) throw new Error('Serviço indisponível');

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id, custom_fields')
      .eq('user_id', userId)
      .single();

    if (!profile) throw new Error('Perfil não encontrado');

    const parsed = musicRepertoireItemSchema.parse({
      id: itemInput.id || crypto.randomUUID(),
      title: itemInput.title,
      original_artist: itemInput.original_artist || '',
      genre: itemInput.genre || '',
      category: itemInput.category || 'geral',
      order: itemInput.order ?? 0,
      notes: itemInput.notes || ''
    });

    const existingCustomFields = (profile.custom_fields || {}) as any;
    const currentMusicData = parseMusicProfileData(profile);
    const existingRepertoire = [...currentMusicData.repertoire];

    const idx = existingRepertoire.findIndex(r => r.id === parsed.id);
    if (idx >= 0) {
      existingRepertoire[idx] = parsed;
    } else {
      existingRepertoire.push(parsed);
    }

    const updatedMusicData: MusicProfileData = {
      ...currentMusicData,
      repertoire: existingRepertoire
    };

    const newCustomFields = {
      ...existingCustomFields,
      music_pro: updatedMusicData
    };

    await supabase
      .from('profiles')
      .update({ custom_fields: newCustomFields, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    return { success: true, item: parsed };
  } catch (err: any) {
    console.error('saveMusicRepertoireAction error:', err);
    return { success: false, error: err.message || 'Erro ao salvar repertório' };
  }
}

/**
 * Remove item de repertório musical
 */
export async function deleteMusicRepertoireAction(itemId: string, accessToken?: string) {
  try {
    const userId = await authenticatedUserId(accessToken);
    const supabase = await createAdminClient();
    if (!supabase) throw new Error('Serviço indisponível');

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id, custom_fields')
      .eq('user_id', userId)
      .single();

    if (!profile) throw new Error('Perfil não encontrado');

    const existingCustomFields = (profile.custom_fields || {}) as any;
    const currentMusicData = parseMusicProfileData(profile);
    const filtered = currentMusicData.repertoire.filter(r => r.id !== itemId);

    const updatedMusicData: MusicProfileData = {
      ...currentMusicData,
      repertoire: filtered
    };

    const newCustomFields = {
      ...existingCustomFields,
      music_pro: updatedMusicData
    };

    await supabase
      .from('profiles')
      .update({ custom_fields: newCustomFields, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    return { success: true };
  } catch (err: any) {
    console.error('deleteMusicRepertoireAction error:', err);
    return { success: false, error: err.message || 'Erro ao excluir música do repertório' };
  }
}

/**
 * Salva evento / apresentação na agenda de shows
 */
export async function saveMusicEventAction(eventInput: Partial<MusicEvent>, accessToken?: string) {
  try {
    const userId = await authenticatedUserId(accessToken);
    const supabase = await createAdminClient();
    if (!supabase) throw new Error('Serviço indisponível');

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id, custom_fields')
      .eq('user_id', userId)
      .single();

    if (!profile) throw new Error('Perfil não encontrado');

    const parsed = musicEventSchema.parse({
      id: eventInput.id || crypto.randomUUID(),
      title: eventInput.title,
      date: eventInput.date,
      time: eventInput.time || '',
      venue: eventInput.venue,
      city: eventInput.city,
      state: eventInput.state || '',
      description: eventInput.description || '',
      ticket_url: eventInput.ticket_url || '',
      is_private: eventInput.is_private || false,
      published: eventInput.published ?? true
    });

    const existingCustomFields = (profile.custom_fields || {}) as any;
    const currentMusicData = parseMusicProfileData(profile);
    const existingEvents = [...currentMusicData.events];

    const idx = existingEvents.findIndex(e => e.id === parsed.id);
    if (idx >= 0) {
      existingEvents[idx] = parsed;
    } else {
      existingEvents.push(parsed);
    }

    // Ordenar por data cronológica crescente
    existingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const updatedMusicData: MusicProfileData = {
      ...currentMusicData,
      events: existingEvents
    };

    const newCustomFields = {
      ...existingCustomFields,
      music_pro: updatedMusicData
    };

    await supabase
      .from('profiles')
      .update({ custom_fields: newCustomFields, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    return { success: true, event: parsed };
  } catch (err: any) {
    console.error('saveMusicEventAction error:', err);
    return { success: false, error: err.message || 'Erro ao salvar evento' };
  }
}

/**
 * Remove evento da agenda
 */
export async function deleteMusicEventAction(eventId: string, accessToken?: string) {
  try {
    const userId = await authenticatedUserId(accessToken);
    const supabase = await createAdminClient();
    if (!supabase) throw new Error('Serviço indisponível');

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, user_id, custom_fields')
      .eq('user_id', userId)
      .single();

    if (!profile) throw new Error('Perfil não encontrado');

    const existingCustomFields = (profile.custom_fields || {}) as any;
    const currentMusicData = parseMusicProfileData(profile);
    const filtered = currentMusicData.events.filter(e => e.id !== eventId);

    const updatedMusicData: MusicProfileData = {
      ...currentMusicData,
      events: filtered
    };

    const newCustomFields = {
      ...existingCustomFields,
      music_pro: updatedMusicData
    };

    await supabase
      .from('profiles')
      .update({ custom_fields: newCustomFields, updated_at: new Date().toISOString() })
      .eq('id', profile.id);

    return { success: true };
  } catch (err: any) {
    console.error('deleteMusicEventAction error:', err);
    return { success: false, error: err.message || 'Erro ao excluir evento' };
  }
}

/**
 * Rastreia cliques e interações musicais reais
 */
export async function trackMusicClickAction(
  profileId: string, 
  eventType: string, 
  metadata: Record<string, any> = {}
) {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(profileId)) return { success: false };

    const supabase = await createClient();
    await supabase.from('analytics').insert({
      profile_id: profileId,
      event_type: eventType,
      metadata: {
        ...metadata,
        module: 'music_pro',
        timestamp: new Date().toISOString()
      }
    });

    return { success: true };
  } catch (error) {
    console.error('trackMusicClickAction error:', error);
    return { success: false };
  }
}

/**
 * Métricas musicais reais
 */
export interface MusicStatsSummary {
  visits: number;
  hireClicks: number;
  streamingClicks: number;
  smartLinkClicks: number;
  videoPlays: number;
  platformBreakdown: Record<string, number>;
  dailyVisits: Array<{ date: string; count: number }>;
}

export async function getMusicStatsAction(profileId: string, days: number = 30): Promise<MusicStatsSummary> {
  const empty: MusicStatsSummary = {
    visits: 0,
    hireClicks: 0,
    streamingClicks: 0,
    smartLinkClicks: 0,
    videoPlays: 0,
    platformBreakdown: {},
    dailyVisits: []
  };

  try {
    const supabase = await createClient();
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const { data: rows, error } = await supabase
      .from('analytics')
      .select('event_type, metadata, created_at')
      .eq('profile_id', profileId)
      .gte('created_at', sinceDate.toISOString())
      .limit(5000);

    if (error || !rows) return empty;

    let visits = 0;
    let hireClicks = 0;
    let streamingClicks = 0;
    let smartLinkClicks = 0;
    let videoPlays = 0;
    const platformBreakdown: Record<string, number> = {};
    const dateMap: Record<string, number> = {};

    for (const r of rows) {
      const type = r.event_type;
      const dateKey = r.created_at ? r.created_at.split('T')[0] : '';
      if (dateKey) dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;

      if (type === 'page_view') visits++;
      if (type === 'click_music_hire' || type === 'click_whatsapp') hireClicks++;
      if (type.startsWith('click_streaming_')) {
        streamingClicks++;
        const plat = (r.metadata as any)?.platform || type.replace('click_streaming_', '');
        platformBreakdown[plat] = (platformBreakdown[plat] || 0) + 1;
      }
      if (type === 'click_smart_link') smartLinkClicks++;
      if (type === 'click_video_play') videoPlays++;
    }

    const dailyVisits = Object.entries(dateMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      visits,
      hireClicks,
      streamingClicks,
      smartLinkClicks,
      videoPlays,
      platformBreakdown,
      dailyVisits
    };
  } catch (err) {
    console.error('getMusicStatsAction error:', err);
    return empty;
  }
}
