import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';
import { getNeonSql } from '@/utils/neon/db';

export const getPublicProfile = cache(async (username: string) => {
  if (process.env.NEON_READS_ENABLED === 'true') {
    // Preview-only, server-side test of the migrated public profiles table.
    // Authentication and the owner dashboard remain on Supabase until cutover.
    const sql = getNeonSql();
    const rows = await sql`SELECT * FROM public.profiles
      WHERE username = ${username} LIMIT 1`;
    return rows[0] || null;
  }

  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('*').eq('username', username).single();
  return data;
});
