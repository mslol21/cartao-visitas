import { createClient } from '@supabase/supabase-js';
import { getSanitizedUrl } from '@/utils/supabase/server';
import { getNeonSql } from '@/utils/neon/db';

const reserved = new Set(['admin', 'dashboard', 'management', 'login', 'signup', 'auth', 'api', 'pricing', 'servicos', 'streetup']);
export async function publicProfileEntries(): Promise<{username: string; updated_at?: string}[]> {
  if (process.env.NEON_READS_ENABLED === 'true') {
    try {
      const sql = getNeonSql();
      const rows = await sql`SELECT username, updated_at FROM public.profiles
        WHERE username IS NOT NULL AND ativo IS DISTINCT FROM false ORDER BY username`;
      return rows.filter(row => typeof row.username === 'string' && /^[a-zA-Z0-9_-]+$/.test(row.username) && !reserved.has(row.username.toLowerCase()))
        .map(row => ({ username: String(row.username), updated_at: row.updated_at ? String(row.updated_at) : undefined }));
    } catch {
      console.warn('Sitemap: consulta Neon indisponível');
      return [];
    }
  }
  const url = getSanitizedUrl();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/['"]/g, '');
  if (!url || !key || url.includes('example.') || url.includes('placeholder')) return [];
  // Anonymous read: the sitemap must never bypass RLS or expose account details.
  try {
  const client = createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
  const result: {username: string; updated_at?: string}[] = [];
  for (let offset = 0; ; offset += 1000) {
    const {data, error} = await client.from('profiles').select('username,updated_at')
      .or('ativo.eq.true,ativo.is.null').not('username', 'is', null)
      .order('username').range(offset, offset + 999).abortSignal(AbortSignal.timeout(5000));
    if (error) { console.warn('Sitemap: consulta de perfis públicos indisponível'); return result; }
    for (const row of data || []) {
      if (/^[a-zA-Z0-9_-]+$/.test(row.username) && !reserved.has(row.username.toLowerCase())) result.push(row);
    }
    if (!data || data.length < 1000) break;
  }
  return result;
  } catch { console.warn('Sitemap: perfis públicos temporariamente indisponíveis'); return []; }
}
