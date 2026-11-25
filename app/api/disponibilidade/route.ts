import { NextResponse } from 'next/server'
import { readPublicBusy } from '@/lib/calendar'

export const dynamic = 'force-dynamic'

const DAYS = 15

export async function GET() {
  const start = new Date()
  const end = new Date(start.getTime() + DAYS * 24 * 60 * 60 * 1000)
  const busy = await readPublicBusy(start, end)
  return NextResponse.json(
    { live: busy !== null, busy: busy ?? [], checkedAt: start.toISOString() },
    // Cache curto na borda da Vercel: a agenda fica quase em tempo real sem estourar a cota do Google.
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
  )
}
