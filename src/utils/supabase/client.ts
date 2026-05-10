import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  let supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  // Forçar URL correta se o build cache estiver teimoso
  if (supabaseUrl.includes('fyexdrjmshpwstfvrt')) {
    supabaseUrl = 'https://fyexdnjvxphhgestfvrt.supabase.co';
  }

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== 'undefined') {
      console.error('MISSING SUPABASE ENV VARS: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    }
  }

  return createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder'
  )
}
