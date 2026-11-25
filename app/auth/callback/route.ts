import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/gestao'
  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/gestao'
      return NextResponse.redirect(new URL(safeNext, origin))
    }
  }
  return NextResponse.redirect(new URL('/gestao/entrar?erro=confirmacao', origin))
}
