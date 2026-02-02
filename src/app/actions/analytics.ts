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

export async function getProfileAnalytics(profileId: string) {
  try {
    const supabase = await createClient();
    
    // Total visits (page_view)
    const { count: visits, error: visitError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('event_type', 'page_view');

    if (visitError) throw visitError;

    // Total clicks (anything that is not page_view)
    const { count: clicks, error: clickError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .neq('event_type', 'page_view');

    if (clickError) throw clickError;

    // Specific WhatsApp clicks
    const { count: whatsappClicks, error: waError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('event_type', 'click_whatsapp');

    if (waError) throw waError;

    const conversionRate = visits && visits > 0 ? Math.round((clicks || 0) / visits * 100) : 0;

    return {
      visits: visits || 0,
      clicks: clicks || 0,
      whatsappClicks: whatsappClicks || 0,
      conversionRate
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0 };
  }
}
