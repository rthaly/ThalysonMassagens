import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  // Só a área privada precisa da sessão. As páginas públicas saem direto do cache da Vercel, sem passar por aqui.
  matcher: ['/gestao/:path*', '/auth/:path*'],
}
