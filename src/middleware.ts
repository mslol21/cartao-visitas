import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const allCookies = request.cookies.getAll()
  const session = allCookies.find(c => c.name.includes('auth-token'))
  const pathname = request.nextUrl.pathname

  // Proteção básica: se tentar acessar dashboard sem cookie de sessão, vai para login
  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se já tem sessão e está no login, vai para dashboard
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/signup'
  ],
}
