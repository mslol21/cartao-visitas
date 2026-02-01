import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Se as chaves não existirem (comum durante o build do Vercel), 
  // retornamos um fallback seguro para não quebrar a compilação
  if (!supabaseUrl || !supabaseKey) {
    return createServerClient(
      'https://placeholder.supabase.co',
      'placeholder',
      { cookies: { getAll: () => [], setAll: () => {} } }
    )
  }

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options)
            } catch (error) {
              // Safe to ignore in Server Components
            }
          })
        },
      },
    }
  )
}
