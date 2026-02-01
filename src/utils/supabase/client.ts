import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('ERRO: Variáveis de ambiente do Supabase não encontradas!');
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  )
}
