import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = 'https://fyexdnjvxphhgestfvrt.supabase.co';
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  return createBrowserClient(supabaseUrl, supabaseKey)
}
