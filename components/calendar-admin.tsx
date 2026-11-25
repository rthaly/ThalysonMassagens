'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { calendarStatus, createCalendarEvent, readCalendarAvailability, startCalendarAuthorization } from '@/app/gestao/actions'

const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export function AdminAccess() {
  const [email, setEmail] = useState('relaxecomthalyson@gmail.com')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')
    if (email.trim().toLowerCase() !== 'relaxecomthalyson@gmail.com') { setMessage('Este acesso está reservado ao responsável pelo atendimento.'); return }
    setBusy(true)
    const result = isSignUp
      ? await supabase.auth.signUp({ email: email.trim().toLowerCase(), password, options: { emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback` } })
      : await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    setBusy(false)
    if (result.error) {
      setMessage(isSignUp ? (result.error.status === 429 ? 'Muitas tentativas. Aguarde e tente novamente.' : 'Não foi possível criar o acesso. Confira os dados e tente novamente.') : (result.error.status === 429 ? 'Muitas tentativas. Aguarde e tente novamente.' : 'E-mail ou senha inválidos.'))
      return
    }
    if (isSignUp && !result.data.session) { setMessage('Confira o e-mail e confirme o endereço antes de entrar.'); return }
    router.replace('/gestao')
    router.refresh()
  }
  return <form className="admin-auth-card" onSubmit={submit}>
    <p className="admin-eyebrow">ÁREA PRIVADA</p><h1>{isSignUp ? 'Criar acesso do responsável' : 'Entrar na gestão'}</h1><p>Esta área é exclusiva de Thalyson e protegida por autenticação.</p>
    <label htmlFor="admin-email">E-mail</label><input id="admin-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
    <label htmlFor="admin-password">Senha</label><input id="admin-password" type="password" autoComplete={isSignUp ? 'new-password' : 'current-password'} minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
    {message && <p className="admin-message" role="status">{message}</p>}
    <button className="admin-primary" disabled={busy}>{busy ? 'Aguarde…' : isSignUp ? 'Criar acesso' : 'Entrar'}</button>
    <button type="button" className="admin-secondary" onClick={() => { setIsSignUp(!isSignUp); setMessage('') }}>{isSignUp ? 'Já tenho acesso' : 'Primeiro acesso? Criar conta'}</button>
  </form>
}

export function CalendarAdmin({ email }: { email: string }) {
  const [connected, setConnected] = useState(false)
  const [checked, setChecked] = useState(false)
  const [ownerId, setOwnerId] = useState('')
  const [publicLinked, setPublicLinked] = useState(false)
  const [busy, setBusy] = useState(false)
  const [busyIntervals, setBusyIntervals] = useState<Array<{ start: string; end: string }>>([])
  const [status, setStatus] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', session: 'Massagem Clássica', date: '', time: '10:00', duration: '60', location: 'Suíte Bela Vista, São Paulo', total: '220', deposit: '40' })
  useEffect(() => { calendarStatus().then((result) => { setConnected(result.connected); setOwnerId(result.ownerId); setPublicLinked(result.publicLinked); setChecked(true) }).catch(() => { setStatus('Não foi possível conferir a autorização agora.'); setChecked(true) }) }, [])
  async function authorize() {
    setBusy(true); setStatus('')
    try { const { url } = await startCalendarAuthorization(); if (window.self !== window.top) window.open(url, '_blank', 'noopener,noreferrer'); else window.location.href = url }
    catch { setStatus('Não foi possível iniciar a conexão. Confira a sessão e tente novamente.') }
    finally { setBusy(false) }
  }
  async function refreshAvailability() {
    setBusy(true); setStatus('')
    try {
      const start = new Date(); const end = new Date(start); end.setDate(end.getDate() + 7)
      const result = await readCalendarAvailability(start.toISOString(), end.toISOString())
      setBusyIntervals(result)
      setStatus(`Agenda consultada. ${result.length} período(s) ocupado(s) nos próximos 7 dias.`)
    } catch { setStatus('Falha ao consultar a agenda. Verifique a autorização do Google e tente novamente.') }
    finally { setBusy(false) }
  }
  async function submitEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus('')
    const start = new Date(`${form.date}T${form.time}:00-03:00`)
    const end = new Date(start.getTime() + Number(form.duration) * 60_000)
    try {
      await createCalendarEvent({ name: form.name, phone: form.phone, session: form.session, start: start.toISOString(), end: end.toISOString(), location: form.location, total: Number(form.total), deposit: Number(form.deposit) })
      setStatus('Evento criado no Google Calendar.')
      await refreshAvailability()
    } catch { setStatus('Não foi possível criar o evento. Confira os dados, a conexão e a disponibilidade.') }
    finally { setBusy(false) }
  }
  async function signOut() { await createClient().auth.signOut(); window.location.assign('/gestao/entrar') }
  return <main className="admin-page"><header className="admin-header"><a href="/" className="admin-brand">Relaxar hoje <span>· gestão</span></a><div><span>{email}</span><button className="admin-secondary" onClick={signOut}>Sair</button></div></header>
    <div className="admin-content"><p className="admin-eyebrow">AGENDA PRIVADA</p><h1>Gestão do atendimento</h1><p className="admin-lead">Conecte a agenda Google para conferir horários e registrar os pedidos confirmados. Dados e tokens ficam somente no servidor.</p>
      <section className="admin-panel"><div className="admin-panel-head"><div><h2>Google Calendar</h2><p>{checked ? connected ? 'Conectado à agenda principal.' : 'Conexão ainda não autorizada.' : 'Verificando autorização…'}</p></div><span className={connected ? 'admin-status connected' : 'admin-status'}>{connected ? 'Conectado' : 'Pendente'}</span></div><div className="admin-actions">{!connected && <button className="admin-primary" onClick={authorize} disabled={busy}>Autorizar Google Calendar</button>}{connected && <button className="admin-primary" onClick={refreshAvailability} disabled={busy}>Consultar próximos 7 dias</button>}</div>{busyIntervals.length > 0 && <ul className="busy-list">{busyIntervals.map((interval) => <li key={interval.start}><span>{new Date(interval.start).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' })}</span><span>até {new Date(interval.end).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })}</span></li>)}</ul>}</section>
      {connected && <section className="admin-panel"><div className="admin-panel-head"><div><h2>Horários reais no site</h2><p>{publicLinked ? 'Ligado. O site mostra como ocupados os horários que já estão na sua agenda (só início e fim, nenhum detalhe).' : 'Falta um passo: na Vercel, em Settings → Environment Variables, crie AGENDA_OWNER_USER_ID com o valor abaixo e faça um novo deploy.'}</p></div><span className={publicLinked ? 'admin-status connected' : 'admin-status'}>{publicLinked ? 'Ativo' : 'Pendente'}</span></div>{!publicLinked && ownerId && <p><code style={{ userSelect: 'all', wordBreak: 'break-all' }}>{ownerId}</code></p>}</section>}
      {connected && <section className="admin-panel"><h2>Registrar pedido confirmado</h2><p>Cria um evento privado na agenda principal. Confirme primeiro a disponibilidade da faixa de horário.</p><form className="admin-event-form" onSubmit={submitEvent}><label>Nome<input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label><label>WhatsApp<input required maxLength={32} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/></label><label>Sessão<input required maxLength={100} value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })}/></label><label>Local<input required maxLength={300} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}/></label><div className="admin-form-row"><label>Data<input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}/></label><label>Horário<input required type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}/></label><label>Duração (min)<input required type="number" min="20" max="180" step="5" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}/></label></div><div className="admin-form-row"><label>Total (R$)<input required type="number" min="0" step="0.01" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })}/></label><label>Sinal (R$)<input required type="number" min="0" step="0.01" value={form.deposit} onChange={(e) => setForm({ ...form, deposit: e.target.value })}/></label></div><button className="admin-primary" disabled={busy}>Criar evento no Google</button></form></section>}
      {status && <p className="admin-message" role="status">{status}</p>}
      <p className="admin-note">A autorização permite consultar horários ocupados e criar eventos. Os detalhes da agenda não são enviados ao navegador público.</p>
    </div></main>
}
