import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseJS } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fyexdnjvxphhgestfvrt.supabase.co';

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder').trim();

  return createServerClient(
    SUPABASE_URL,
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

export async function createAdminClient() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseServiceKey) {
    console.error('CONFIG_ERROR: SUPABASE_SERVICE_ROLE_KEY não configurada.');
    return null;
  }

  return createSupabaseJS(SUPABASE_URL, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
