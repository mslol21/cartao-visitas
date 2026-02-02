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
  if (!profileId) {
    console.error('getProfileAnalytics: profileId is missing');
    return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0 };
  }

  try {
    const supabase = await createClient();
    
    // Test connection
    const { data: authTest, error: authError } = await supabase.auth.getUser();
    if (authError || !authTest.user) {
      console.warn('Analytics: User not authenticated in server action');
    }

    // Total visits (page_view)
    const { count: visits, error: visitError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('event_type', 'page_view');

    if (visitError) {
      console.error('Analytics Fetch Error (visits):', visitError);
      // Don't throw, just return what we have
    }

    // Total clicks (anything that is not page_view)
    const { count: clicks, error: clickError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .neq('event_type', 'page_view');

    if (clickError) console.error('Analytics Fetch Error (clicks):', clickError);

    // Specific WhatsApp clicks
    const { count: whatsappClicks, error: waError } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('event_type', 'click_whatsapp');

    if (waError) console.error('Analytics Fetch Error (whatsapp):', waError);

    const v = visits || 0;
    const c = clicks || 0;
    const conversionRate = v > 0 ? Math.round((c / v) * 100) : 0;

    return {
      visits: v,
      clicks: c,
      whatsappClicks: whatsappClicks || 0,
      conversionRate
    };
  } catch (error) {
    console.error('Critical Error in getProfileAnalytics:', error);
    return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0 };
  }
}
