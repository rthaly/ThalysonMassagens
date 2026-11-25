'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type Lang = 'pt' | 'en' | 'es'
export type ChatBooking = { packageId: string; offer: string; date: string; time: string; locType: 'studio' | 'home' }
type Msg = { role: 'user' | 'assistant'; content: string }

const T: Record<Lang, Record<string, string>> = {
  pt: {
    launcher: 'Tirar dúvida ou ver horários', title: 'Assistente do Thalyson', sub: 'Respostas automáticas • o Thalyson confirma tudo no WhatsApp',
    hello: 'Oi! Sou o assistente automático do site do Thalyson. Te ajudo a escolher a sessão, ver horários livres e deixar o pedido pronto. Por onde quer começar?',
    q1: 'Qual sessão combina comigo?', q2: 'Horários livres hoje', q3: 'Preços e planos', q4: 'Primeira vez, como funciona?',
    q1m: 'Qual sessão combina comigo?', q2m: 'Quais horários estão livres hoje?', q3m: 'Quais são os preços e planos?', q4m: 'É minha primeira vez, como funciona?',
    ph: 'Escreva sua dúvida', send: 'Enviar', close: 'Fechar chat', open: 'Abrir chat',
    note: 'Não envie telefone nem endereço aqui. O nome vai só no formulário.',
    ready: 'Pedido pronto para revisar', apply: 'Revisar e mandar no WhatsApp', typing: 'Digitando',
    err: 'Não consegui responder agora. Me chama direto no WhatsApp que eu respondo rápido.', limit: 'Muitas mensagens em pouco tempo. Tenta de novo em alguns minutos ou chama no WhatsApp.', wa: 'Abrir WhatsApp',
  },
  en: {
    launcher: 'Ask a question or see times', title: 'Thalyson’s assistant', sub: 'Automatic answers • Thalyson confirms everything on WhatsApp',
    hello: 'Hi! I’m the automatic assistant on Thalyson’s site. I can help you pick a session, check free times and get your request ready. Where do you want to start?',
    q1: 'Which session suits me?', q2: 'Free times today', q3: 'Prices and plans', q4: 'First time, how does it work?',
    q1m: 'Which session suits me?', q2m: 'What times are free today?', q3m: 'What are the prices and plans?', q4m: 'It’s my first time, how does it work?',
    ph: 'Type your question', send: 'Send', close: 'Close chat', open: 'Open chat',
    note: 'Don’t send phone or address here. Your name goes only in the form.',
    ready: 'Request ready to review', apply: 'Review and send on WhatsApp', typing: 'Typing',
    err: 'I couldn’t answer right now. Message me directly on WhatsApp and I’ll reply fast.', limit: 'Too many messages in a short time. Try again in a few minutes or message on WhatsApp.', wa: 'Open WhatsApp',
  },
  es: {
    launcher: 'Preguntar o ver horarios', title: 'Asistente de Thalyson', sub: 'Respuestas automáticas • Thalyson confirma todo por WhatsApp',
    hello: '¡Hola! Soy el asistente automático del sitio de Thalyson. Te ayudo a elegir la sesión, ver horarios libres y dejar el pedido listo. ¿Por dónde quieres empezar?',
    q1: '¿Qué sesión me conviene?', q2: 'Horarios libres hoy', q3: 'Precios y planes', q4: 'Primera vez, ¿cómo funciona?',
    q1m: '¿Qué sesión me conviene?', q2m: '¿Qué horarios hay libres hoy?', q3m: '¿Cuáles son los precios y planes?', q4m: 'Es mi primera vez, ¿cómo funciona?',
    ph: 'Escribe tu duda', send: 'Enviar', close: 'Cerrar chat', open: 'Abrir chat',
    note: 'No envíes teléfono ni dirección aquí. El nombre va solo en el formulario.',
    ready: 'Pedido listo para revisar', apply: 'Revisar y enviar por WhatsApp', typing: 'Escribiendo',
    err: 'No pude responder ahora. Escríbeme directo por WhatsApp y respondo rápido.', limit: 'Demasiados mensajes en poco tiempo. Intenta de nuevo en unos minutos o escribe por WhatsApp.', wa: 'Abrir WhatsApp',
  },
}

const CSS = `
.aic-launch{position:fixed;right:16px;z-index:125;display:flex;align-items:center;gap:10px;padding:6px 18px 6px 6px;border-radius:999px;border:1px solid var(--line);background:color-mix(in srgb,var(--surf) 68%,transparent);backdrop-filter:blur(18px) saturate(170%);-webkit-backdrop-filter:blur(18px) saturate(170%);color:var(--ink);box-shadow:inset 0 1px 0 var(--gl-hi),0 12px 30px -10px var(--gl-sh);cursor:pointer;font-family:inherit;font-weight:700;font-size:14px;line-height:1.2;transition:transform .2s,bottom .25s;animation:aicIn .5s .6s both cubic-bezier(.2,.8,.2,1)}
.aic-launch:hover{transform:translateY(-2px)}
.aic-launch:focus-visible,.aic-btn:focus-visible,.aic-chip:focus-visible,.aic-x:focus-visible,.aic-in:focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.aic-face{position:relative;width:44px;height:44px;border-radius:50%;flex:none}
.aic-face img,.aic-face span{width:100%;height:100%;border-radius:50%;object-fit:cover;display:flex;align-items:center;justify-content:center;background:var(--acc);color:var(--onacc);font:600 20px 'Fraunces',Georgia,serif}
.aic-face:after{content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--ok);opacity:0;animation:aicPulse 2.6s 1.4s infinite}
.aic-dot{position:absolute;right:0;bottom:0;width:11px;height:11px;border-radius:50%;background:var(--ok);border:2px solid var(--surf)}
.aic-panel{position:fixed;z-index:130;right:16px;bottom:16px;width:min(392px,calc(100vw - 24px));height:min(620px,calc(100dvh - 32px));display:flex;flex-direction:column;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:22px;box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden;transform-origin:100% 100%;animation:aicOpen .32s cubic-bezier(.2,.8,.2,1) both}
.aic-head{display:flex;align-items:center;gap:12px;padding:14px 14px 12px 16px;border-bottom:1px solid var(--line);background:var(--surf)}
.aic-head strong{display:block;font:600 17px/1.2 'Fraunces',Georgia,serif}.aic-head small{display:block;color:var(--mute);font-size:12px;line-height:1.35;margin-top:2px}
.aic-x{margin-left:auto;flex:none;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--ink);cursor:pointer;font-size:20px;line-height:1}
.aic-list{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;overscroll-behavior:contain}
.aic-msg{max-width:86%;padding:11px 14px;border-radius:18px;font-size:15px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;animation:aicMsg .28s both cubic-bezier(.2,.8,.2,1)}
.aic-msg.a{align-self:flex-start;background:var(--surf);border:1px solid var(--line);border-bottom-left-radius:6px}
.aic-msg.u{align-self:flex-end;background:var(--acc);color:var(--onacc);border-bottom-right-radius:6px}
.aic-typing{align-self:flex-start;display:flex;gap:5px;padding:14px 16px;border-radius:18px;border-bottom-left-radius:6px;background:var(--surf);border:1px solid var(--line)}
.aic-typing i{width:7px;height:7px;border-radius:50%;background:var(--mute);animation:aicDot 1.1s infinite}.aic-typing i:nth-child(2){animation-delay:.15s}.aic-typing i:nth-child(3){animation-delay:.3s}
.aic-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:2px}
.aic-chip{min-height:44px;display:inline-flex;align-items:center;padding:10px 14px;border-radius:999px;border:1px solid var(--line);background:transparent;color:var(--ink);font-family:inherit;font-weight:600;font-size:14px;line-height:1.2;cursor:pointer;animation:aicMsg .3s both;transition:background .15s}
.aic-chip:hover{background:var(--surf2)}
.aic-card{align-self:stretch;border:1px solid var(--acc);border-radius:18px;padding:14px;background:var(--surf);animation:aicPop .4s both cubic-bezier(.2,1.4,.4,1)}
.aic-card p{margin:0 0 3px;font-size:12px;color:var(--mute);font-weight:700;letter-spacing:.04em}.aic-card strong{display:block;font:600 18px/1.3 'Fraunces',Georgia,serif;margin-bottom:10px}
.aic-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:0 18px;border-radius:999px;border:0;background:var(--acc);color:var(--onacc);font-family:inherit;font-weight:700;font-size:15px;line-height:1;cursor:pointer;width:100%}
.aic-form{display:flex;gap:8px;padding:10px 12px 6px;border-top:1px solid var(--line);background:var(--surf)}
.aic-in{flex:1;min-width:0;min-height:46px;padding:0 14px;border-radius:999px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font-family:inherit;font-weight:400;font-size:16px;line-height:1}
.aic-send{flex:none;min-width:46px;min-height:46px;padding:0 16px;border-radius:999px;border:0;background:var(--acc);color:var(--onacc);font-family:inherit;font-weight:700;font-size:14px;line-height:1;cursor:pointer}.aic-send:disabled{opacity:.45;cursor:not-allowed}
.aic-note{margin:0;padding:2px 16px 10px;background:var(--surf);color:var(--mute);font-size:12px;line-height:1.4}
.aic-wa{display:inline-block;margin-top:8px;color:var(--ink);font-weight:700;text-decoration:underline;text-underline-offset:3px}
@keyframes aicIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
@keyframes aicOpen{from{opacity:0;transform:translateY(18px) scale(.94)}to{opacity:1;transform:none}}
@keyframes aicMsg{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes aicPop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
@keyframes aicDot{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-5px);opacity:1}}
@keyframes aicPulse{0%{transform:scale(.9);opacity:.7}70%,100%{transform:scale(1.35);opacity:0}}
@media (max-width:520px){.aic-panel{right:0;bottom:0;width:100vw;height:min(86dvh,680px);border-radius:22px 22px 0 0}.aic-launch span.aic-lbl{display:none}.aic-launch{padding:5px}}
@media (prefers-reduced-transparency:reduce){.aic-launch{background:var(--surf);backdrop-filter:none;-webkit-backdrop-filter:none}}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.aic-launch{background:var(--surf)}}
@media (prefers-reduced-motion:reduce){.aic-launch,.aic-panel,.aic-msg,.aic-chip,.aic-card{animation:none!important}.aic-face:after,.aic-typing i{animation:none!important}.aic-typing i{opacity:.8}}
`

/** Mostra a resposta palavra por palavra (sem animação se a pessoa reduz movimento). */
function Typed({ text, animate, onTick }: { text: string; animate: boolean; onTick: () => void }) {
  const words = text.split(/(\s+)/)
  const [n, setN] = useState(animate ? 0 : words.length)
  useEffect(() => {
    if (!animate) return
    let i = 0
    const id = setInterval(() => { i += 2; setN(i); onTick(); if (i >= words.length) clearInterval(id) }, 28)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <>{words.slice(0, n).join('')}</>
}

export function AssistantChat({ lang, bottom, avatar, whatsappUrl, labelFor, dateLabel, onApply, onEvent }: {
  lang: Lang
  bottom: number
  avatar: string
  whatsappUrl: string
  labelFor: (packageId: string) => string
  dateLabel: (isoDate: string) => string
  onApply: (b: ChatBooking) => void
  onEvent: (name: string, props?: Record<string, string | number | boolean>) => void
}) {
  const t = T[lang]
  const [enabled, setEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [fail, setFail] = useState<'' | 'err' | 'limit'>('')
  const [draft, setDraft] = useState<ChatBooking | null>(null)
  const [handoff, setHandoff] = useState(false)
  const [reduce, setReduce] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const launchRef = useRef<HTMLButtonElement>(null)
  const [imgOk, setImgOk] = useState(true)

  useEffect(() => {
    try { setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches) } catch { /* */ }
    let alive = true
    fetch('/api/chat', { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (alive && j?.enabled) setEnabled(true) }).catch(() => { /* chat desligado */ })
    return () => { alive = false }
  }, [])

  const scroll = useCallback(() => { const el = listRef.current; if (el) el.scrollTop = el.scrollHeight }, [])
  useEffect(() => { scroll() }, [msgs, busy, draft, fail, scroll])
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 60) }, [open])
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = () => { setOpen(false); setTimeout(() => launchRef.current?.focus(), 30) }

  const send = async (text: string) => {
    const content = text.trim().slice(0, 400)
    if (!content || busy) return
    const next: Msg[] = [...msgs, { role: 'user', content }]
    setMsgs(next); setInput(''); setBusy(true); setFail(''); setDraft(null); setHandoff(false)
    onEvent('chat_mensagem', { n: next.filter((m) => m.role === 'user').length })
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: next, lang }) })
      if (res.status === 429) { setFail('limit'); return }
      if (!res.ok) { setFail('err'); return }
      const j = (await res.json()) as { reply?: string; booking?: ChatBooking | null; handoff?: boolean }
      setMsgs((m) => [...m, { role: 'assistant', content: j.reply || t.err }]); setHandoff(!!j.handoff)
      if (j.booking) { setDraft(j.booking); onEvent('chat_pedido_pronto', { sessao: j.booking.packageId }) }
    } catch { setFail('err') } finally { setBusy(false) }
  }

  if (!enabled) return null
  const face = imgOk ? <img src={avatar} alt="" onError={() => setImgOk(false)} /> : <span aria-hidden="true">T</span>

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {!open && (
        <button ref={launchRef} type="button" className="aic-launch" style={{ bottom }} aria-label={t.open} aria-haspopup="dialog" onClick={() => { setOpen(true); onEvent('chat_aberto') }}>
          <span className="aic-face">{face}<i className="aic-dot" /></span>
          <span className="aic-lbl">{t.launcher}</span>
        </button>
      )}
      {open && (
        <div className="aic-panel" role="dialog" aria-label={t.title}>
          <div className="aic-head">
            <span className="aic-face" style={{ width: 40, height: 40 }}>{face}<i className="aic-dot" /></span>
            <div><strong>{t.title}</strong><small>{t.sub}</small></div>
            <button type="button" className="aic-x" aria-label={t.close} onClick={close}>×</button>
          </div>
          <div className="aic-list" ref={listRef} aria-live="polite">
            <div className="aic-msg a">{t.hello}</div>
            {msgs.length === 0 && (
              <div className="aic-chips">
                {([['q1', 'q1m'], ['q2', 'q2m'], ['q3', 'q3m'], ['q4', 'q4m']] as const).map(([a, b], i) => (
                  <button key={a} type="button" className="aic-chip" style={{ animationDelay: `${0.08 * i + 0.15}s` }} onClick={() => send(t[b])}>{t[a]}</button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`aic-msg ${m.role === 'user' ? 'u' : 'a'}`}>
                {m.role === 'assistant' && i === msgs.length - 1 ? <Typed text={m.content} animate={!reduce} onTick={scroll} /> : m.content}
              </div>
            ))}
            {busy && <div className="aic-typing" role="status" aria-label={t.typing}><i /><i /><i /></div>}
            {draft && (
              <div className="aic-card">
                <p>{t.ready}</p>
                <strong>{labelFor(draft.packageId)} · {dateLabel(draft.date)} · {draft.time}</strong>
                <button type="button" className="aic-btn" onClick={() => { onApply(draft); onEvent('chat_pedido_aplicado', { sessao: draft.packageId }); setDraft(null); setOpen(false) }}>{t.apply}</button>
              </div>
            )}
            {handoff && !fail && !busy && <a className="aic-btn" style={{ textDecoration: 'none', alignSelf: 'flex-start', width: 'auto' }} href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => onEvent('chat_whatsapp')}>{t.wa}</a>}
            {fail && (
              <div className="aic-msg a" role="alert">{fail === 'limit' ? t.limit : t.err}<br /><a className="aic-wa" href={whatsappUrl} target="_blank" rel="noopener noreferrer">{t.wa}</a></div>
            )}
          </div>
          <form className="aic-form" onSubmit={(e) => { e.preventDefault(); send(input) }}>
            <input ref={inputRef} className="aic-in" value={input} onChange={(e) => setInput(e.target.value)} maxLength={400} placeholder={t.ph} aria-label={t.ph} autoComplete="off" enterKeyHint="send" />
            <button className="aic-send" type="submit" disabled={busy || !input.trim()}>{t.send}</button>
          </form>
          <p className="aic-note">{t.note}</p>
        </div>
      )}
    </>
  )
}
