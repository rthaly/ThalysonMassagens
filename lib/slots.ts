// Regras de horário usadas pelo assistente de IA (espelham as do site: components/legacy-experience.tsx).
// São Paulo está em UTC-3 o ano todo (sem horário de verão desde 2019).

export const OPEN = 9 * 60
export const LAST_END = 23 * 60 + 30
export const STEP = 60
export const LEAD_STUDIO = 30
export const LEAD_HOME = 60
export const TRAVEL_BUFFER = 30
export const DAYS_AHEAD = 14

export type Busy = { start: string; end: string }

const pad = (n: number) => String(n).padStart(2, '0')
export const fromMin = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`

/** Data e minutos desde 00:00 agora, no relógio de São Paulo. */
export function spNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now)
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? '00'
  return { date: `${g('year')}-${g('month')}-${g('day')}`, minutes: Number(g('hour')) * 60 + Number(g('minute')) }
}

export const instant = (date: string, minutes: number) => new Date(`${date}T${fromMin(minutes)}:00-03:00`)

export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00-03:00`)
  d.setUTCDate(d.getUTCDate() + n)
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d)
}

export function isValidDate(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(new Date(`${date}T12:00:00-03:00`).getTime())
}

/** Horários livres de um dia para uma sessão com certa duração. */
export function freeSlots(date: string, duration: number, isHome: boolean, busy: Busy[], now = new Date()): string[] {
  const today = spNow(now)
  if (date < today.date || date > addDays(today.date, DAYS_AHEAD - 1)) return []
  const lead = isHome ? LEAD_HOME : LEAD_STUDIO
  const buf = isHome ? TRAVEL_BUFFER : 0
  const out: string[] = []
  for (let m = OPEN; m + duration <= LAST_END; m += STEP) {
    if (date === today.date && m < today.minutes + lead) continue
    const a = instant(date, m - buf).getTime()
    const b = instant(date, m + duration + buf).getTime()
    const clash = busy.some((x) => new Date(x.start).getTime() < b && new Date(x.end).getTime() > a)
    if (!clash) out.push(fromMin(m))
  }
  return out
}
