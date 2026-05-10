import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  let supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  // Forçar URL correta se o build cache estiver teimoso
  if (supabaseUrl.includes('fyexdrjmshpwstfvrt')) {
    supabaseUrl = 'https://fyexdnjvxphhgestfvrt.supabase.co';
  }

  // Fallback robusto para evitar erro de URL inválida no build
  const finalUrl = (supabaseUrl && supabaseUrl.startsWith('http')) 
    ? supabaseUrl 
    : 'https://fyexdnjvxphhgestfvrt.supabase.co';
    
  const finalKey = supabaseKey || 'placeholder';

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window !== 'undefined') {
      console.warn('⚠️ Supabase env vars missing, using fallback URL.');
    }
  }

  return createBrowserClient(finalUrl, finalKey)
}
