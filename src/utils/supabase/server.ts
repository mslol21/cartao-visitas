import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = 'https://fyexdnjvxphhgestfvrt.supabase.co';
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                // Remove restrições estritas de path e domain para garantir leitura no Vercel
                path: '/',
                domain: undefined,
              } as any)
            )
          } catch {
            // Server Components can't set cookies, that's fine
          }
        },
      },
    }
  )
}

import { createClient as createSupabaseJS } from '@supabase/supabase-js'

export async function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('CONFIG_ERROR: SUPABASE_SERVICE_ROLE_KEY não configurada no Vercel.');
    return null;
  }

  return createSupabaseJS(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

