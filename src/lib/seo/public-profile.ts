import { cache } from 'react';
import { createClient } from '@/utils/supabase/server';
export const getPublicProfile = cache(async (username: string) => {
  const supabase = await createClient();
  const {data} = await supabase.from('profiles').select('*').eq('username', username).single();
  return data;
});
