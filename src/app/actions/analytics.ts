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

export async function getProfileAnalytics(profileId: string) {
  console.log('--- Servindo Analytics para:', profileId);
  
  if (!profileId) {
    console.error('getProfileAnalytics: profileId vazia');
    return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0, error: 'ID ausente' };
  }

  try {
    // 1. Verificar chaves antes de tudo
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error('CRÍTICO: Chaves de Admin do Supabase ausentes no servidor!');
      return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0, error: 'Configuração incompleta' };
    }

    const { data: { user } } = await (await createClient()).auth.getUser();
    if (!user) {
      console.error('Analytics: Usuário não autenticado');
      return { visits: 0, clicks: 0, whatsappClicks: 0, conversionRate: 0, error: 'Não autenticado' };
    }

    // 2. Usar Admin Client
    const admin = createAdminClient();

    // 3. Buscar tudo em paralelo de forma segura
    console.log('Iniciando queries de contagem...');
    
    // Contagem de visitas (page_view)
    const visitsPromise = admin
      .from('analytics')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('event_type', 'page_view');

    // Contagem de cliques gerais (excluindo page_view)
    const clicksPromise = admin
      .from('analytics')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .neq('event_type', 'page_view');

    // Contagem específica de WhatsApp
    const waPromise = admin
      .from('analytics')
      .select('id', { count: 'exact', head: true })
      .eq('profile_id', profileId)
      .eq('event_type', 'click_whatsapp');

    const [visitsRes, clicksRes, waRes] = await Promise.all([
      visitsPromise,
      clicksPromise,
      waPromise
    ]);

    if (visitsRes.error) console.error('Erro visitas:', visitsRes.error);
    if (clicksRes.error) console.error('Erro cliques:', clicksRes.error);
    if (waRes.error) console.error('Erro whatsapp:', waRes.error);

    const v = visitsRes.count || 0;
    const c = clicksRes.count || 0;
    const w = waRes.count || 0;
    
    const conversionRate = v > 0 ? Math.round((c / v) * 100) : 0;

    console.log(`Resultados para ${profileId}: Visitas=${v}, Cliques=${c}`);

    return {
      visits: v,
      clicks: c,
      whatsappClicks: w,
      conversionRate
    };
  } catch (err: any) {
    console.error('ERRO FATAL ANALYTICS:', err);
    return { 
      visits: 0, 
      clicks: 0, 
      whatsappClicks: 0, 
      conversionRate: 0,
      error: err.message 
    };
  }
}
