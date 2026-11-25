'use server'

import 'server-only'
import { getToken, startAuthorization, UserAuthorizationRequiredError } from '@vercel/connect'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { CALENDAR_SCOPES, CONNECTOR_UID } from '@/lib/calendar'

const OWNER_EMAIL = 'relaxecomthalyson@gmail.com'

async function getOwner() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email?.toLowerCase() !== OWNER_EMAIL) throw new Error('Acesso não autorizado.')
  return user
}

async function getOrigin() {
  if (process.env.NODE_ENV !== 'production' && process.env.V0_RUNTIME_URL) return process.env.V0_RUNTIME_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
  if (!host) throw new Error('Não foi possível determinar a origem do site.')
  return `${requestHeaders.get('x-forwarded-proto') ?? 'https'}://${host}`
}

export async function startCalendarAuthorization() {
  const user = await getOwner()
  const { url } = await startAuthorization(CONNECTOR_UID, { subject: { type: 'user', id: user.id }, scopes: CALENDAR_SCOPES }, { callbackUrl: `${await getOrigin()}/gestao` })
  return { url }
}

export async function calendarStatus() {
  const user = await getOwner()
  const publicLinked = process.env.AGENDA_OWNER_USER_ID?.trim() === user.id
  try {
    await getToken(CONNECTOR_UID, { subject: { type: 'user', id: user.id }, scopes: CALENDAR_SCOPES })
    return { connected: true, ownerId: user.id, publicLinked }
  } catch (error) {
    if (error instanceof UserAuthorizationRequiredError) return { connected: false, ownerId: user.id, publicLinked }
    throw error
  }
}

export async function readCalendarAvailability(startDate: string, endDate: string) {
  const user = await getOwner()
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start || end.getTime() - start.getTime() > 15 * 24 * 60 * 60 * 1000) {
    throw new Error('Intervalo de consulta inválido.')
  }
  const token = await getToken(CONNECTOR_UID, { subject: { type: 'user', id: user.id }, scopes: CALENDAR_SCOPES })
  const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeMin: start.toISOString(), timeMax: end.toISOString(), timeZone: 'America/Sao_Paulo', items: [{ id: 'primary' }] }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Não foi possível consultar o Google Calendar.')
  const data = await response.json()
  return (data.calendars?.primary?.busy ?? []).map((item: { start: string; end: string }) => ({ start: item.start, end: item.end }))
}

export async function createCalendarEvent(input: { name: string; phone: string; session: string; start: string; end: string; location: string; total: number; deposit: number }) {
  const user = await getOwner()
  const start = new Date(input.start)
  const end = new Date(input.end)
  if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start || end.getTime() - start.getTime() > 180 * 60 * 1000) throw new Error('Horário inválido.')
  const name = input.name.trim().slice(0, 100)
  const phone = input.phone.replace(/[^+0-9()\- ]/g, '').slice(0, 32)
  const session = input.session.trim().slice(0, 100)
  if (!name || !phone || !session || !Number.isFinite(input.total) || input.total < 0 || !Number.isFinite(input.deposit) || input.deposit < 0 || input.deposit > input.total) throw new Error('Dados do agendamento inválidos.')
  const token = await getToken(CONNECTOR_UID, { subject: { type: 'user', id: user.id }, scopes: CALENDAR_SCOPES })
  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ summary: `${session} · ${name}`, description: `WhatsApp: ${phone}\\nTotal: R$ ${input.total.toFixed(2)}\\nSinal: R$ ${input.deposit.toFixed(2)}`, location: input.location.trim().slice(0, 300), visibility: 'private', start: { dateTime: start.toISOString(), timeZone: 'America/Sao_Paulo' }, end: { dateTime: end.toISOString(), timeZone: 'America/Sao_Paulo' } }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Não foi possível criar o evento no Google Calendar.')
  const event = await response.json()
  return { id: typeof event.id === 'string' ? event.id : null }
}


type GoogleEvent = { id?: unknown; summary?: unknown; start?: { dateTime?: unknown }; end?: { dateTime?: unknown } }

// Próximos 30 dias da agenda principal, para a lista "Próximos atendimentos" da gestão.
export async function listUpcomingEvents() {
  const user = await getOwner()
  const token = await getToken(CONNECTOR_UID, { subject: { type: 'user', id: user.id }, scopes: CALENDAR_SCOPES })
  const now = new Date()
  const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const query = new URLSearchParams({ timeMin: now.toISOString(), timeMax: end.toISOString(), singleEvents: 'true', orderBy: 'startTime', maxResults: '50' })
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${query}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
  if (!response.ok) throw new Error('Não foi possível ler a agenda.')
  const data = (await response.json()) as { items?: GoogleEvent[] }
  return (data.items ?? [])
    .filter((e) => typeof e.id === 'string' && typeof e.start?.dateTime === 'string')
    .map((e) => ({
      id: e.id as string,
      summary: typeof e.summary === 'string' ? e.summary.slice(0, 120) : '(sem título)',
      start: e.start?.dateTime as string,
      end: typeof e.end?.dateTime === 'string' ? e.end.dateTime : '',
    }))
}

// Cancela um atendimento: apaga o evento da agenda. O site volta a mostrar o horário livre.
export async function cancelCalendarEvent(id: string) {
  const user = await getOwner()
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{5,1024}$/.test(id)) throw new Error('Evento inválido.')
  const token = await getToken(CONNECTOR_UID, { subject: { type: 'user', id: user.id }, scopes: CALENDAR_SCOPES })
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
  if (!response.ok && response.status !== 404 && response.status !== 410) throw new Error('Não foi possível cancelar o evento.')
  return { ok: true }
}
