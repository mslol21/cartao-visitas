import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 1. Tentar pegar o usuário (pode falhar/timeout em rede lenta)
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // 2. Verificar se existe o cookie específico do seu projeto atual
  // O ID do seu projeto é 'fyexdnjvxphhgestfvrt'
  const projectAuthCookie = request.cookies.get('sb-fyexdnjvxphhgestfvrt-auth-token')
  
  console.log(`[Middleware] Rota: ${pathname} | User: ${user ? '✅' : '❌'} | Cookie Projeto: ${projectAuthCookie ? 'Sim' : 'Não'}`)

  // 3. Regras de Redirecionamento com tolerância para erro de rede
  if (user || projectAuthCookie) {
    // Se logado (ou com cookie), não acessa login/signup
    if (pathname === '/login' || pathname === '/signup') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Permite dashboard
    return response
  } else {
    // Se REALMENTE não tem nada, manda pro login apenas se estiver no dashboard
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
