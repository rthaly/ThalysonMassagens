import { NextResponse, type NextRequest } from 'next/server'
import { readPublicBusy } from '@/lib/calendar'
import { answer } from '@/lib/faq-engine'
import { DAYS_AHEAD, type Busy } from '@/lib/slots'

export const dynamic = 'force-dynamic'

// Assistente de dúvidas SEM IA e SEM custo: responde com as regras do próprio site (lib/faq-engine.ts)
// e consulta só os horários livres da agenda. Nada do que a pessoa digita sai do site nem é guardado.
const MAX_MESSAGES = 10
const MAX_CHARS = 400

// Limite simples em memória, só para impedir uso abusivo (cada instância serverless tem o seu).
const hits = new Map<string, number[]>()
const PER_IP = 60 // mensagens por 10 minutos
function limited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000)
  if (recent.length >= PER_IP) { hits.set(ip, recent); return true }
  recent.push(now); hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return false
}

export async function GET() {
  return NextResponse.json({ enabled: true }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: NextRequest) {
  // Só aceita chamadas feitas pelo próprio site
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== request.headers.get('host')) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const ip = (request.headers.get('x-forwarded-for') ?? 'local').split(',')[0].trim()
  if (limited(ip)) return NextResponse.json({ error: 'rate_limited' }, { status: 429 })

  let body: unknown
  try { body = await request.json() } catch { return NextResponse.json({ error: 'bad_request' }, { status: 400 }) }
  const raw = (body as { messages?: unknown })?.messages
  const lang = (['pt', 'en', 'es'].includes(String((body as { lang?: unknown })?.lang)) ? String((body as { lang?: unknown }).lang) : 'pt') as 'pt' | 'en' | 'es'
  if (!Array.isArray(raw) || raw.length === 0) return NextResponse.json({ error: 'bad_request' }, { status: 400 })

  const messages = raw
    .slice(-MAX_MESSAGES)
    .filter((m): m is { role: 'user' | 'assistant'; content: string } => (m?.role === 'user' || m?.role === 'assistant') && typeof m?.content === 'string' && m.content.trim().length > 0)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
  if (!messages.length || messages[messages.length - 1].role !== 'user') return NextResponse.json({ error: 'bad_request' }, { status: 400 })

  const busy: Busy[] = (await readPublicBusy(new Date(), new Date(Date.now() + DAYS_AHEAD * 86400000))) ?? []
  return NextResponse.json(answer(messages, lang, busy))
}
