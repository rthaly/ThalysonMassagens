'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Status = 'marcado' | 'realizado' | 'faltou' | 'cancelado'
type Atend = { id: string; data_hora: string; cliente: string; whatsapp: string; sessao: string; valor: number; sinal: number; pagamento: string; status: Status; cupom: string; obs: string }

const SITE = 'https://relaxarhoje.com.br'
const SESSOES = [
  { nome: 'Massagem Clássica', slug: 'classica', valor: 180 },
  { nome: 'Sensitiva + Lingam', slug: 'sensitiva', valor: 220 },
  { nome: 'Sensações com a Barba + Lingam', slug: 'fusion', valor: 290 },
  { nome: 'Corpo a Corpo + Lingam', slug: 'completa', valor: 390 },
  { nome: 'Apenas Aparo de Pelos', slug: 'aparo_solo', valor: 130 },
]
const CUPONS = ['RELAXAR13', 'SESSAO2']
const STATUS_TXT: Record<Status, string> = { marcado: 'Marcado', realizado: 'Realizado', faltou: 'Faltou', cancelado: 'Cancelado' }

const money = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
const dia = (iso: string) => new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
const soDia = (iso: string) => new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })
const mesChave = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }).slice(0, 7)
const digits = (v: string) => v.replace(/\D/g, '')
const zapLink = (tel: string, msg: string) => { const d = digits(tel); const full = d.length <= 11 ? `55${d}` : d; return `https://wa.me/${full}?text=${encodeURIComponent(msg)}` }
const nomeMes = (chave: string) => new Date(`${chave}-15T12:00:00`).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

async function copiar(texto: string) {
  try { await navigator.clipboard.writeText(texto); return true } catch { return false }
}

export function GestaoPainel() {
  const [aba, setAba] = useState<'resumo' | 'atendimentos' | 'clientes' | 'links'>('resumo')
  const [lista, setLista] = useState<Atend[] | null>(null)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [busy, setBusy] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const carregar = useCallback(async () => {
    setErro('')
    const { data, error } = await supabase.from('atendimentos').select('*').order('data_hora', { ascending: false }).limit(1000)
    if (error) { setErro('Não foi possível ler os atendimentos. Entre de novo ou tente em alguns minutos.'); setLista([]); return }
    setLista((data ?? []).map((r) => ({ ...r, valor: Number(r.valor), sinal: Number(r.sinal) })) as Atend[])
  }, [supabase])
  useEffect(() => { void carregar() }, [carregar])

  async function mudarStatus(a: Atend, status: Status) {
    setBusy(true)
    const { error } = await supabase.from('atendimentos').update({ status }).eq('id', a.id)
    setBusy(false)
    if (error) { setAviso('Não foi possível atualizar.'); return }
    setLista((l) => (l ? l.map((x) => (x.id === a.id ? { ...x, status } : x)) : l))
  }
  async function apagar(a: Atend) {
    if (!window.confirm(`Apagar o atendimento de ${a.cliente} em ${dia(a.data_hora)}? Não dá para desfazer.`)) return
    setBusy(true)
    const { error } = await supabase.from('atendimentos').delete().eq('id', a.id)
    setBusy(false)
    if (error) { setAviso('Não foi possível apagar.'); return }
    setLista((l) => (l ? l.filter((x) => x.id !== a.id) : l))
  }

  const abas: [typeof aba, string][] = [['resumo', 'Resumo'], ['atendimentos', 'Atendimentos'], ['clientes', 'Clientes'], ['links', 'Links e cupons']]
  return <>
    <nav className="admin-tabs" aria-label="Seções da gestão">
      {abas.map(([k, t]) => <button key={k} type="button" aria-pressed={aba === k} className={aba === k ? 'on' : ''} onClick={() => { setAba(k); setAviso('') }}>{t}</button>)}
    </nav>
    {erro && <p className="admin-message" role="alert">{erro}</p>}
    {aviso && <p className="admin-message" role="status">{aviso}</p>}
    {lista === null && <p className="admin-lead">Carregando…</p>}
    {lista !== null && aba === 'resumo' && <Resumo lista={lista} />}
    {lista !== null && aba === 'atendimentos' && <Atendimentos lista={lista} busy={busy} onStatus={mudarStatus} onApagar={apagar} onSalvo={carregar} supabase={supabase} setAviso={setAviso} />}
    {lista !== null && aba === 'clientes' && <Clientes lista={lista} supabase={supabase} onMudou={carregar} setAviso={setAviso} />}
    {aba === 'links' && <Links setAviso={setAviso} />}
  </>
}

function Resumo({ lista }: { lista: Atend[] }) {
  const agora = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }).slice(0, 7)
  const [y, m] = agora.split('-').map(Number)
  const anterior = m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`
  const doMes = (c: string) => lista.filter((a) => mesChave(a.data_hora) === c)
  const feitas = (c: string) => doMes(c).filter((a) => a.status === 'realizado')
  const atual = feitas(agora), ant = feitas(anterior)
  const soma = (l: Atend[]) => l.reduce((t, a) => t + a.valor, 0)
  const fat = soma(atual), fatAnt = soma(ant)
  const ticket = atual.length ? fat / atual.length : 0
  const aReceber = doMes(agora).filter((a) => a.status === 'marcado').reduce((t, a) => t + Math.max(0, a.valor - a.sinal), 0)
  const sinais = doMes(agora).filter((a) => a.status === 'marcado').reduce((t, a) => t + a.sinal, 0)
  const porSessao = new Map<string, { n: number; v: number }>()
  atual.forEach((a) => { const x = porSessao.get(a.sessao) ?? { n: 0, v: 0 }; x.n += 1; x.v += a.valor; porSessao.set(a.sessao, x) })
  const ranking = [...porSessao.entries()].sort((a, b) => b[1].v - a[1].v)
  const faltas = doMes(agora).filter((a) => a.status === 'faltou' || a.status === 'cancelado').length
  const variacao = fatAnt > 0 ? Math.round(((fat - fatAnt) / fatAnt) * 100) : null
  const proximos = lista.filter((a) => a.status === 'marcado' && new Date(a.data_hora) >= new Date()).sort((a, b) => a.data_hora.localeCompare(b.data_hora)).slice(0, 5)

  return <section className="admin-panel">
    <div className="admin-panel-head"><div><h2>Resumo de {nomeMes(agora)}</h2><p>Conta só os atendimentos marcados como "Realizado".</p></div></div>
    <div className="adm-cards">
      <div><span>Faturamento</span><strong>{money(fat)}</strong>{variacao !== null && <small>{variacao >= 0 ? '+' : ''}{variacao}% sobre {nomeMes(anterior)}</small>}</div>
      <div><span>Sessões feitas</span><strong>{atual.length}</strong><small>{ant.length} no mês passado</small></div>
      <div><span>Valor médio</span><strong>{money(ticket)}</strong><small>por sessão</small></div>
      <div><span>A receber</span><strong>{money(aReceber)}</strong><small>{money(sinais)} já em sinais</small></div>
    </div>
    <h3 className="adm-h3">Sessões que mais vendem</h3>
    {ranking.length === 0 ? <p>Nenhuma sessão realizada neste mês ainda.</p> : <ul className="busy-list">{ranking.map(([nome, x]) => <li key={nome} className="adm-li"><span>{nome}</span><span>{x.n} sessão(ões) · {money(x.v)}</span></li>)}</ul>}
    <h3 className="adm-h3">Próximos marcados</h3>
    {proximos.length === 0 ? <p>Nenhum atendimento marcado pela gestão.</p> : <ul className="busy-list">{proximos.map((a) => <li key={a.id} className="adm-li"><span><strong>{dia(a.data_hora)}</strong> · {a.cliente}</span><span>{a.sessao}</span></li>)}</ul>}
    {faltas > 0 && <p className="admin-note">{faltas} falta(s) ou cancelamento(s) neste mês.</p>}
    <p className="admin-note">O faturamento começa a contar do dia em que você passa a registrar os atendimentos aqui.</p>
  </section>
}

function Atendimentos({ lista, busy, onStatus, onApagar, onSalvo, supabase, setAviso }: { lista: Atend[]; busy: boolean; onStatus: (a: Atend, s: Status) => void; onApagar: (a: Atend) => void; onSalvo: () => void; supabase: ReturnType<typeof createClient>; setAviso: (s: string) => void }) {
  const [f, setF] = useState({ cliente: '', whatsapp: '', sessao: SESSOES[1].nome, data: '', hora: '19:00', valor: String(SESSOES[1].valor), sinal: '40', pagamento: 'pix', cupom: '' })
  const [salvando, setSalvando] = useState(false)
  const [filtro, setFiltro] = useState<'todos' | Status>('todos')
  const mostrar = lista.filter((a) => filtro === 'todos' || a.status === filtro).slice(0, 80)

  async function salvar(e: React.FormEvent) {
    e.preventDefault(); setAviso('')
    const quando = new Date(`${f.data}T${f.hora}:00-03:00`)
    if (!Number.isFinite(quando.getTime())) { setAviso('Escolha o dia e a hora.'); return }
    setSalvando(true)
    const { error } = await supabase.from('atendimentos').insert({ data_hora: quando.toISOString(), cliente: f.cliente.trim().slice(0, 100), whatsapp: digits(f.whatsapp).slice(0, 20), sessao: f.sessao, valor: Number(f.valor) || 0, sinal: Number(f.sinal) || 0, pagamento: f.pagamento, cupom: f.cupom.trim().toUpperCase().slice(0, 40), status: 'marcado' })
    setSalvando(false)
    if (error) { setAviso('Não foi possível salvar. Confira os dados.'); return }
    setAviso('Atendimento registrado. Lembre de colocar o horário na agenda do Google, na aba Agenda.')
    setF({ ...f, cliente: '', whatsapp: '', cupom: '' }); onSalvo()
  }

  return <>
    <section className="admin-panel">
      <h2>Registrar atendimento</h2>
      <p>Anote cada pedido confirmado. Depois da sessão, marque "Realizado" para entrar no faturamento.</p>
      <form className="admin-event-form" onSubmit={salvar}>
        <label>Nome<input required maxLength={100} value={f.cliente} onChange={(e) => setF({ ...f, cliente: e.target.value })} /></label>
        <label>WhatsApp (com DDD)<input required inputMode="tel" maxLength={20} value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} /></label>
        <label>Sessão<select value={f.sessao} onChange={(e) => { const s = SESSOES.find((x) => x.nome === e.target.value); setF({ ...f, sessao: e.target.value, valor: String(s?.valor ?? f.valor) }) }}>{SESSOES.map((s) => <option key={s.slug}>{s.nome}</option>)}</select></label>
        <div className="admin-form-row">
          <label>Dia<input required type="date" value={f.data} onChange={(e) => setF({ ...f, data: e.target.value })} /></label>
          <label>Hora<input required type="time" value={f.hora} onChange={(e) => setF({ ...f, hora: e.target.value })} /></label>
        </div>
        <div className="admin-form-row">
          <label>Valor total (R$)<input required type="number" min="0" step="0.01" value={f.valor} onChange={(e) => setF({ ...f, valor: e.target.value })} /></label>
          <label>Sinal pago (R$)<input required type="number" min="0" step="0.01" value={f.sinal} onChange={(e) => setF({ ...f, sinal: e.target.value })} /></label>
          <label>Cupom (se usou)<input maxLength={40} value={f.cupom} onChange={(e) => setF({ ...f, cupom: e.target.value })} /></label>
        </div>
        <button className="admin-primary" disabled={salvando}>{salvando ? 'Salvando…' : 'Salvar atendimento'}</button>
      </form>
    </section>
    <section className="admin-panel">
      <div className="admin-panel-head"><div><h2>Atendimentos</h2><p>{lista.length} registrado(s). Mostrando os mais recentes.</p></div></div>
      <div className="adm-filtros" role="group" aria-label="Filtrar por situação">
        {(['todos', 'marcado', 'realizado', 'faltou', 'cancelado'] as const).map((k) => <button key={k} type="button" aria-pressed={filtro === k} className={filtro === k ? 'on' : ''} onClick={() => setFiltro(k)}>{k === 'todos' ? 'Todos' : STATUS_TXT[k]}</button>)}
      </div>
      {mostrar.length === 0 ? <p>Nenhum atendimento aqui.</p> : <ul className="busy-list">{mostrar.map((a) => <li key={a.id} className="adm-item">
        <div className="adm-item-top"><span><strong>{dia(a.data_hora)}</strong> · {a.cliente}</span><span className={`adm-badge ${a.status}`}>{STATUS_TXT[a.status]}</span></div>
        <div className="adm-item-sub">{a.sessao} · {money(a.valor)}{a.sinal > 0 && <> · sinal {money(a.sinal)}</>}{a.cupom && <> · cupom {a.cupom}</>}</div>
        <div className="adm-item-acoes">
          {a.status === 'marcado' && <><button className="admin-primary" disabled={busy} onClick={() => onStatus(a, 'realizado')}>Realizado</button><button className="admin-secondary" disabled={busy} onClick={() => onStatus(a, 'faltou')}>Faltou</button><button className="admin-secondary" disabled={busy} onClick={() => onStatus(a, 'cancelado')}>Cancelou</button></>}
          {a.status !== 'marcado' && <button className="admin-secondary" disabled={busy} onClick={() => onStatus(a, 'marcado')}>Voltar para marcado</button>}
          {a.whatsapp && <a className="admin-secondary" href={zapLink(a.whatsapp, `Oi, ${a.cliente.split(' ')[0]}!`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
          <button className="admin-secondary" disabled={busy} onClick={() => onApagar(a)}>Apagar</button>
        </div>
      </li>)}</ul>}
    </section>
  </>
}

function Clientes({ lista, supabase, onMudou, setAviso }: { lista: Atend[]; supabase: ReturnType<typeof createClient>; onMudou: () => void; setAviso: (s: string) => void }) {
  const [busca, setBusca] = useState('')
  const clientes = useMemo(() => {
    const mapa = new Map<string, { chave: string; nome: string; whatsapp: string; feitas: number; gasto: number; ultima: string; sessoes: Map<string, number>; total: number }>()
    lista.forEach((a) => {
      const chave = digits(a.whatsapp) || a.cliente.toLowerCase()
      const c = mapa.get(chave) ?? { chave, nome: a.cliente, whatsapp: a.whatsapp, feitas: 0, gasto: 0, ultima: '', sessoes: new Map(), total: 0 }
      c.total += 1
      if (a.status === 'realizado') { c.feitas += 1; c.gasto += a.valor; c.sessoes.set(a.sessao, (c.sessoes.get(a.sessao) ?? 0) + 1); if (a.data_hora > c.ultima) c.ultima = a.data_hora }
      mapa.set(chave, c)
    })
    return [...mapa.values()].sort((a, b) => b.gasto - a.gasto)
  }, [lista])
  const trinta = Date.now() - 30 * 24 * 60 * 60 * 1000
  const filtrados = clientes.filter((c) => !busca || c.nome.toLowerCase().includes(busca.toLowerCase()) || digits(c.whatsapp).includes(digits(busca) || '§'))
  const sumidos = clientes.filter((c) => c.feitas > 0 && c.ultima && new Date(c.ultima).getTime() < trinta && c.whatsapp)

  async function apagarCliente(c: { nome: string; whatsapp: string; chave: string }) {
    if (!window.confirm(`Apagar ${c.nome} e todos os atendimentos dele? Use quando o cliente pedir para remover os dados. Não dá para desfazer.`)) return
    const ids = lista.filter((a) => (digits(a.whatsapp) || a.cliente.toLowerCase()) === c.chave).map((a) => a.id)
    const { error } = await supabase.from('atendimentos').delete().in('id', ids)
    if (error) { setAviso('Não foi possível apagar o cliente.'); return }
    setAviso(`${c.nome} foi apagado.`); onMudou()
  }

  return <>
    {sumidos.length > 0 && <section className="admin-panel">
      <h2>Sumidos há mais de 30 dias</h2>
      <p>Quem já fez sessão e não voltou. O botão abre o WhatsApp com a mensagem pronta.</p>
      <ul className="busy-list">{sumidos.slice(0, 15).map((c) => <li key={c.chave} className="adm-li"><span><strong>{c.nome}</strong> · última em {soDia(c.ultima)}</span>
        <a className="admin-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} href={zapLink(c.whatsapp, `Oi, ${c.nome.split(' ')[0]}! Faz um tempo desde a sua última sessão. Se bater vontade de relaxar essa semana, me chama que eu vejo um horário pra você.`)} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a></li>)}</ul>
    </section>}
    <section className="admin-panel">
      <h2>Clientes</h2>
      <label className="adm-busca">Buscar por nome ou WhatsApp<input value={busca} onChange={(e) => setBusca(e.target.value)} /></label>
      {filtrados.length === 0 ? <p>Nenhum cliente ainda. Eles aparecem quando você registra atendimentos.</p> : <ul className="busy-list">{filtrados.slice(0, 60).map((c) => {
        const fav = [...c.sessoes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
        return <li key={c.chave} className="adm-item">
          <div className="adm-item-top"><span><strong>{c.nome}</strong></span><span>{c.feitas} sessão(ões)</span></div>
          <div className="adm-item-sub">Gastou {money(c.gasto)}{c.ultima && <> · última em {soDia(c.ultima)}</>}{fav && <> · prefere {fav}</>}</div>
          <div className="adm-item-acoes">
            {c.whatsapp && <a className="admin-secondary" href={zapLink(c.whatsapp, `Oi, ${c.nome.split(' ')[0]}!`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            <button className="admin-secondary" onClick={() => apagarCliente(c)}>Apagar dados</button>
          </div>
        </li>
      })}</ul>}
    </section>
  </>
}

function Links({ setAviso }: { setAviso: (s: string) => void }) {
  const [sessao, setSessao] = useState('sensitiva')
  const [cupom, setCupom] = useState('')
  const [copiado, setCopiado] = useState('')
  const url = `${SITE}/?sessao=${sessao}${cupom ? `&cupom=${cupom}` : ''}`
  const nome = SESSOES.find((s) => s.slug === sessao)?.nome ?? ''
  const textos = [
    ['Story ou anúncio', `${nome}. Vagas esta semana. Escolha o dia e o horário e o pedido chega pronto no meu WhatsApp:\n${url}`],
    ['Mensagem para quem sumiu', `Oi! Separei um horário pra você. É só escolher o dia aqui e me mandar o pedido:\n${url}`],
  ]
  async function copiar1(k: string, t: string) { const ok = await copiar(t); setCopiado(ok ? k : ''); setAviso(ok ? '' : 'Não consegui copiar. Segure no texto e copie à mão.') }
  return <section className="admin-panel">
    <h2>Links e cupons</h2>
    <p>Escolha a sessão e, se quiser, um cupom. O cliente cai direto na sessão escolhida, com o desconto aplicado.</p>
    <div className="admin-event-form">
      <label>Sessão<select value={sessao} onChange={(e) => setSessao(e.target.value)}>{SESSOES.map((s) => <option key={s.slug} value={s.slug}>{s.nome}</option>)}</select></label>
      <label>Cupom<select value={cupom} onChange={(e) => setCupom(e.target.value)}><option value="">Sem cupom</option>{CUPONS.map((c) => <option key={c}>{c}</option>)}</select></label>
    </div>
    <p className="adm-url" aria-label="Link pronto">{url}</p>
    <div className="admin-actions">
      <button className="admin-primary" onClick={() => copiar1('link', url)}>{copiado === 'link' ? 'Link copiado!' : 'Copiar link'}</button>
      <a className="admin-secondary" href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>Abrir para testar</a>
    </div>
    <h3 className="adm-h3">Textos prontos com o link</h3>
    {textos.map(([k, t]) => <div key={k} className="adm-texto"><p><strong>{k}</strong></p><p style={{ whiteSpace: 'pre-wrap' }}>{t}</p><button className="admin-secondary" onClick={() => copiar1(k, t)}>{copiado === k ? 'Copiado!' : 'Copiar texto'}</button></div>)}
    <p className="admin-note">Cupons ativos hoje: RELAXAR13 (13%) e SESSAO2 (8%). Para criar ou mudar um cupom, peça para eu ajustar no código.</p>
  </section>
}
