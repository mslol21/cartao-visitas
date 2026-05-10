import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Retorna apenas a resposta padrão sem nenhuma lógica de Supabase por enquanto
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
