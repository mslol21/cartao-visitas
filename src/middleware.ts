import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim()
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim()

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ MIDDLEWARE: Variáveis NEXT_PUBLIC_SUPABASE_URL ou KEY não encontradas!');
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: Record<string, unknown> }[]) {
          // No Next.js 15, atualizamos o request para que o getUser() veja as novas cookies
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          })
          
          // Criamos a resposta base
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // Aplicamos as cookies na resposta para o navegador
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: getUser() precisa ser chamado para o refresh do token funcionar via middleware
  let user = null;
  try {
    const { data: { user: authUser }, error } = await supabase.auth.getUser()
    if (error) {
      // Se houver erro de "FetchError", pode ser o URL do Supabase inacessível pelo Edge
      console.warn('⚠️ MIDDLEWARE: Erro ao recuperar usuário:', error.message);
    }
    user = authUser;
  } catch (err) {
    console.error('🔥 MIDDLEWARE: Falha crítica na autenticação:', err);
  }

  const pathname = request.nextUrl.pathname

  // 1. Redirecionamento de usuários logados (Dashboard/Admin)
  if (user) {
    if (pathname === '/login' || pathname === '/signup') {
      console.log('✅ MIDDLEWARE: Usuário autenticado, enviando para /dashboard');
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } else {
    // 2. Proteção de rotas privadas se NÃO houver usuário
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
      console.log('🚫 MIDDLEWARE: Sem usuário, enviando para /login');
      const redirectUrl = new URL('/login', request.url);
      // Opcional: Adicionar parâmetro para retornar após login
      // redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  return supabaseResponse;

}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
