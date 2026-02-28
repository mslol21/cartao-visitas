import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Se as chaves não existirem (comum durante o build do Vercel), 
  // retornamos um fallback seguro para não quebrar a compilação
  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('CRITICAL: Supabase keys missing in production!');
    }
    return createServerClient(
      'https://placeholder.supabase.co',
      'placeholder',
      { cookies: { getAll: () => [], setAll: () => {} } }
    )
  }

  const client = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options as any)
            } catch (error) {
              // Safe to ignore in Server Components
            }
          })
        },
      },
    }
  )

  return client;
}
