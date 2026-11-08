import { createClient } from '@supabase/supabase-js';

const reserved = new Set(['admin', 'dashboard', 'management', 'login', 'signup', 'auth', 'api', 'pricing', 'servicos', 'streetup']);
export async function publicProfileEntries(): Promise<{username: string; updated_at?: string}[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('example.') || url.includes('placeholder')) return [];
  // Anonymous read: the sitemap must never bypass RLS or expose account details.
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
}
