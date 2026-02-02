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
  if (!profileId) return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0 };

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('Analytics: Unauthorized access attempt');
      return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0 };
    }

    // Usar admin client para garantir a leitura dos dados independente de RLS,
    // mas verificamos se o perfil pertence ao usuário atual.
    const { createAdminClient } = await import('@/utils/supabase/admin');
    const admin = createAdminClient();

    // 1. Verificar propriedade
    const { data: profile } = await admin
      .from('profiles')
      .select('id')
      .eq('id', profileId)
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      console.warn(`Analytics: Profile ${profileId} not found or doesn't belong to user ${user.id}`);
      return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0 };
    }

    // 2. Buscar contagens usando o admin para evitar problemas de RLS no dashboard
    const [visitsRes, clicksRes, waRes] = await Promise.all([
      admin.from('analytics').select('*', { count: 'exact', head: true }).eq('profile_id', profileId).eq('event_type', 'page_view'),
      admin.from('analytics').select('*', { count: 'exact', head: true }).eq('profile_id', profileId).neq('event_type', 'page_view'),
      admin.from('analytics').select('*', { count: 'exact', head: true }).eq('profile_id', profileId).eq('event_type', 'click_whatsapp')
    ]);

    const v = visitsRes.count || 0;
    const c = clicksRes.count || 0;
    const w = waRes.count || 0;
    
    const conversionRate = v > 0 ? Math.round((c / v) * 100) : 0;

    return {
      visits: v,
      clicks: c,
      whatsappClicks: w,
      conversionRate
    };
  } catch (error) {
    console.error('Critical Error in getProfileAnalytics:', error);
    return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0 };
  }
}
