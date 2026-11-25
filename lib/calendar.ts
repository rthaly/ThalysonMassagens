import 'server-only'
import { getToken } from '@vercel/connect'

export const CONNECTOR_UID = 'google/agenda-relaxar-hoje'
export const CALENDAR_SCOPES = ['https://www.googleapis.com/auth/calendar.freebusy', 'https://www.googleapis.com/auth/calendar.events']

export type BusyInterval = { start: string; end: string }

/**
 * Consulta só os períodos ocupados (início/fim) da agenda principal do Thalyson.
 * Nenhum título, nome de cliente ou local sai do servidor.
 * Precisa de AGENDA_OWNER_USER_ID (id do usuário Supabase que autorizou o Google em /gestao).
 */
export async function readPublicBusy(start: Date, end: Date): Promise<BusyInterval[] | null> {
  const ownerId = process.env.AGENDA_OWNER_USER_ID?.trim()
  if (!ownerId) return null
  try {
    const token = await getToken(CONNECTOR_UID, { subject: { type: 'user', id: ownerId }, scopes: CALENDAR_SCOPES })
    const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeMin: start.toISOString(), timeMax: end.toISOString(), timeZone: 'America/Sao_Paulo', items: [{ id: 'primary' }] }),
      cache: 'no-store',
    })
    if (!response.ok) return null
    const data = await response.json()
    const busy: unknown = data?.calendars?.primary?.busy
    if (!Array.isArray(busy)) return []
    return busy
      .filter((item): item is BusyInterval => typeof item?.start === 'string' && typeof item?.end === 'string')
      .map(({ start: s, end: e }) => ({ start: s, end: e }))
  } catch {
    return null
  }
}
