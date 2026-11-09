"use server";

import { createClient } from '@/utils/supabase/server';
import { getNeonSql } from '@/utils/neon/db';
import type { Profile, ProfileFormData } from '@/types/profile';

// Only user-editable profile fields. Billing, permissions, ownership and verification
// must never be writable from the profile editor.
const editable = new Set([
  'username','name','photo_url','tagline','whatsapp','instagram','website',
  'city','cta_text','seo_title','seo_description','linkedin','facebook',
  'tiktok','twitter','youtube','theme_color','custom_slug','theme_style',
  'font_family','background_video_url','services','custom_links','address',
  'service_area','photo_filter','photo_border_effect','avatar_frame',
  'expert_area','founded_year','category','business_hours','profession',
  'business_name','subtitle','area_atendimento','tipo_atendimento',
  'horario_funcionamento','has_physical_location','endereco_completo',
  'bio_profissional','diferenciais','servicos','custom_fields','whatsapp_message'
]);

async function authenticatedUserId() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Não autenticado');
  return user.id;
}

export async function getOwnerProfileNeon(): Promise<Profile | null> {
  if (process.env.NEON_READS_ENABLED !== 'true') throw new Error('Neon não habilitado');
  const userId = await authenticatedUserId();
  const sql = getNeonSql();
  const rows = await sql`SELECT * FROM public.profiles WHERE user_id = ${userId}::uuid LIMIT 1`;
  return (rows[0] as unknown as Profile) ?? null;
}

export async function updateOwnerProfileNeon(input: Partial<ProfileFormData>) {
  try {
    if (process.env.NEON_READS_ENABLED !== 'true') throw new Error('Neon não habilitado');
    const userId = await authenticatedUserId();
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Dados inválidos');
    const entries = Object.entries(input).filter(([key, value]) => editable.has(key) && value !== undefined);
    if (entries.length === 0) throw new Error('Nenhum campo editável');
    if (entries.length > 50 || JSON.stringify(input).length > 100_000) throw new Error('Dados excedem o limite');
    const sql = getNeonSql();
    // Column identifiers come exclusively from the fixed allowlist above.
    // Values and the authenticated owner ID are passed as query parameters.
    const assignments = entries.map(([key], index) => `"${key}" = $${index + 1}`).join(', ');
    const values = entries.map(([, value]) => typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
    const query = `UPDATE public.profiles SET ${assignments}, updated_at = now() WHERE user_id = $${entries.length + 1}::uuid RETURNING id`;
    const rows = await sql.query(query, [...values, userId]);
    if (!rows.length) throw new Error('Perfil não encontrado');
    return { error: null };
  } catch (error) {
    console.error('Neon profile update failed:', error instanceof Error ? error.message : 'unknown');
    return { error: 'Não foi possível salvar o perfil' };
  }
}
