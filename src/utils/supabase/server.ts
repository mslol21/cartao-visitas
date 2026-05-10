import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient as createSupabaseJS } from '@supabase/supabase-js'

const DEFAULT_URL = 'https://fyexdnjvxphhgestfvrt.supabase.co';

function getSanitizedUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url === 'undefined' || url === 'null' || url.trim() === '') {
    return DEFAULT_URL;
  }
  
  const sanitized = url.trim().replace(/['"]/g, '').replace(/\/$/, '');
  
  if (!sanitized.startsWith('http')) {
    return DEFAULT_URL;
  }
  
  return sanitized;
}

const SUPABASE_URL = getSanitizedUrl();

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/['"]/g, '');

  if (!supabaseKey || supabaseKey === 'placeholder' || supabaseKey === 'undefined') {
    console.error('CRITICAL: NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid.');
  }

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
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim().replace(/['"]/g, '');

  if (!supabaseServiceKey || supabaseServiceKey === 'undefined') {
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
