"use server";

import { createClient } from '@/utils/supabase/server';
import { getNeonSql } from '@/utils/neon/db';

export type AnalyticsEventType = 'page_view' | 'click_whatsapp' | 'click_instagram' | 'click_linkedin' | 'click_facebook' | 'click_tiktok' | 'click_twitter' | 'click_youtube' | 'click_website' | 'click_cta' | 'click_address' | 'click_music_play';

export async function trackEvent(profileId: string, eventType: AnalyticsEventType, metadata: any = {}) {
  try {
    if (process.env.NEON_READS_ENABLED === 'true') {
      const allowed: readonly string[] = ['page_view', 'click_whatsapp', 'click_instagram', 'click_linkedin', 'click_facebook', 'click_tiktok', 'click_twitter', 'click_youtube', 'click_website', 'click_cta', 'click_address', 'click_music_play'];
      if (!/^[0-9a-f-]{36}$/i.test(profileId) || !allowed.includes(eventType)) return { success: false };
      const sql = getNeonSql();
      await sql`INSERT INTO public.analytics (profile_id, event_type, metadata)
        SELECT id, ${eventType}, ${JSON.stringify(metadata ?? {})}::jsonb
        FROM public.profiles WHERE id = ${profileId}::uuid AND ativo IS DISTINCT FROM false`;
      return { success: true };
    }
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('analytics')
      .insert({
        profile_id: profileId,
        event_type: eventType,
        metadata
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error tracking event:', error);
    return { success: false, error };
  }
}

// Mover imports para o topo para evitar problemas com dynamic imports em Server Actions
import { createAdminClient } from '@/utils/supabase/admin';

export interface AnalyticsData {
  visits: number;
  clicks: number;
  whatsappClicks: number;
  conversionRate: number;
  breakdown: Record<string, number>;
  dailyStats: { date: string; count: number }[];
}

export async function getProfileAnalytics(profileId: string): Promise<AnalyticsData> {
  console.log('📊 Fetching Analytics for Profile:', profileId);
  
  const emptyResult: AnalyticsData = { 
    visits: 0, 
    clicks: 0, 
    whatsappClicks: 0, 
    conversionRate: 0, 
    breakdown: {}, 
    dailyStats: [] 
  };

  if (!profileId || profileId === 'undefined') {
    console.error('❌ getProfileAnalytics: invalid profileId');
    return emptyResult;
  }

  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
      console.error('❌ getProfileAnalytics: Unauthorized access');
      return emptyResult;
    }

    const admin = createAdminClient();
    if (!admin && process.env.NEON_READS_ENABLED !== 'true') {
      console.error('❌ getProfileAnalytics: Admin client unavailable');
      return emptyResult;
    }

    let requesterProfile: { id: string; role: string | null } | null = null;
    let allEvents: { event_type: string; created_at: string }[] | null = null;
    let eventsError: unknown = null;
    if (process.env.NEON_READS_ENABLED === 'true') {
      const sql = getNeonSql();
      const requester = await sql`SELECT id, role FROM public.profiles WHERE user_id = ${authUser.id}::uuid LIMIT 1`;
      requesterProfile = requester[0] as { id: string; role: string | null } | undefined || null;
    } else {
      const result = await admin!.from('profiles').select('id, role').eq('user_id', authUser.id).single();
      requesterProfile = result.data;
    }
    const isOwner = requesterProfile?.id === profileId;
    const isAdmin = requesterProfile?.role === 'admin';
    if (!isOwner && !isAdmin) return emptyResult;

    if (process.env.NEON_READS_ENABLED === 'true') {
      const sql = getNeonSql();
      allEvents = await sql`SELECT event_type, created_at FROM public.analytics WHERE profile_id = ${profileId}::uuid` as { event_type: string; created_at: string }[];
    } else {
      const result = await admin!.from('analytics').select('event_type, created_at').eq('profile_id', profileId);
      allEvents = result.data;
      eventsError = result.error;
    }

    if (eventsError) {
      console.error('❌ Supabase Analytics Query Error:', eventsError);
      throw eventsError;
    }

    if (!allEvents || allEvents.length === 0) {
      console.log('ℹ️ No events found for profile:', profileId);
      return emptyResult;
    }

    console.log(`✅ Found ${allEvents.length} total events for this profile.`);

    const visits = allEvents.filter(e => e.event_type === 'page_view').length;
    const clicks = allEvents.filter(e => e.event_type !== 'page_view').length;
    const whatsappClicks = allEvents.filter(e => e.event_type === 'click_whatsapp').length;
    
    // 2. Breakdown by event type (Top sources)
    const breakdown: Record<string, number> = {};
    allEvents.forEach(e => {
      if (e.event_type !== 'page_view') {
        const type = e.event_type.replace('click_', '');
        breakdown[type] = (breakdown[type] || 0) + 1;
      }
    });

    // 3. Daily stats (Sliding window of actual data or last 7 days)
    const dailyStatsMap: Record<string, number> = {};
    
    // Initializing the last 7 days with 0 to ensure the chart isn't empty if there's no recent data
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      dailyStatsMap[label] = 0;
    }

    allEvents.forEach(e => {
      const date = new Date(e.created_at);
      const label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      // If this date is in our current 7-day window, count it
      if (dailyStatsMap[label] !== undefined) {
        dailyStatsMap[label]++;
      } else {
        // Option: we could also dynamically add older dates if we want, 
        // but for now let's stick to the recent window for the chart.
      }
    });

    const dailyStats = Object.entries(dailyStatsMap)
      .map(([date, count]) => ({ date, count }));
      // Map maintains insertion order, so 0-6 days ago is already sorted.

    const conversionRate = visits > 0 ? Math.round((clicks / visits) * 100) : 0;

    return {
      visits,
      clicks,
      whatsappClicks,
      conversionRate,
      breakdown,
      dailyStats
    };
  } catch (err: any) {
    console.error('🚨 ERRO FATAL ANALYTICS:', err);
    return emptyResult;
  }
}


