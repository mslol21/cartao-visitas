import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Prevenir Open Redirect: aceitar apenas caminhos relativos válidos iniciados por /
  const rawNext = searchParams.get('next');
  let safeNext = '/dashboard';
  if (rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.includes('\\')) {
    safeNext = rawNext;
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${safeNext}`)
      } else if (forwardedHost && !forwardedHost.includes('/') && !forwardedHost.includes('\\')) {
        return NextResponse.redirect(`https://${forwardedHost}${safeNext}`)
      } else {
        return NextResponse.redirect(`${origin}${safeNext}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
