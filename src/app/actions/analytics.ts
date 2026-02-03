"use server";

import { createClient } from '@/utils/supabase/server';

export type AnalyticsEventType = 'page_view' | 'click_whatsapp' | 'click_instagram' | 'click_linkedin' | 'click_facebook' | 'click_tiktok' | 'click_twitter' | 'click_youtube' | 'click_website' | 'click_cta';

export async function trackEvent(profileId: string, eventType: AnalyticsEventType, metadata: any = {}) {
  try {
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
  console.log('--- Servindo Analytics para:', profileId);
  
  const emptyResult: AnalyticsData = { 
    visits: 0, 
    clicks: 0, 
    whatsappClicks: 0, 
    conversionRate: 0, 
    breakdown: {}, 
    dailyStats: [] 
  };

  if (!profileId) {
    console.error('getProfileAnalytics: profileId vazia');
    return emptyResult;
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error('CRÍTICO: Chaves de Admin do Supabase ausentes no servidor!');
      return emptyResult;
    }

    const { data: { user } } = await (await createClient()).auth.getUser();
    if (!user) {
      console.error('Analytics: Usuário não autenticado');
      return emptyResult;
    }

    const admin = createAdminClient();

    // 1. Fetch total counts
    const { data: allEvents, error: eventsError } = await admin
      .from('analytics')
      .select('event_type, created_at')
      .eq('profile_id', profileId);

    if (eventsError) throw eventsError;

    if (!allEvents || allEvents.length === 0) {
      return emptyResult;
    }

    const visits = allEvents.filter(e => e.event_type === 'page_view').length;
    const clicks = allEvents.filter(e => e.event_type !== 'page_view').length;
    const whatsappClicks = allEvents.filter(e => e.event_type === 'click_whatsapp').length;
    
    // 2. Breakdown by event type
    const breakdown: Record<string, number> = {};
    allEvents.forEach(e => {
      if (e.event_type !== 'page_view') {
        const type = e.event_type.replace('click_', '');
        breakdown[type] = (breakdown[type] || 0) + 1;
      }
    });

    // 3. Daily stats (last 7 days)
    const dailyStatsMap: Record<string, number> = {};
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    allEvents.forEach(e => {
      const date = new Date(e.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      if (new Date(e.created_at) >= sevenDaysAgo) {
        dailyStatsMap[date] = (dailyStatsMap[date] || 0) + 1;
      }
    });

    const dailyStats = Object.entries(dailyStatsMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

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
    console.error('ERRO FATAL ANALYTICS:', err);
    return emptyResult;
  }
}

