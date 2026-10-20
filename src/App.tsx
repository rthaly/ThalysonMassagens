import { useState, useEffect, useMemo, useRef, memo, useCallback, type ReactNode } from 'react';

const ENV = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

const CFG = {
  phone: '5517991360413',
  pix: '62922530000144',
  ig: 'https://www.instagram.com/relaxarhojesp',
  review: 'https://g.page/r/Cd1aEwEt0R1QEAE/review',
  avatar: 'FmtU3Ogx_400x400.jpg',
  sbUrl: ENV.VITE_SUPABASE_URL || '',
  sbKey: ENV.VITE_SUPABASE_ANON_KEY || ENV.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  coupons: { SESSAO2: 0.08, RELAXAR13: 0.13 } as Record<string, number>,
  signal: 40, first: 15, fetish: 140, peak: 18, pixOff: 0.03,
  open: 540, lastEnd: 1410, stepMin: 60,
  bufStudio: 15, bufHome: 60,
  leadStudio: 30, leadHome: 60,
  ahead: 14,
} as const;
const ONLINE = !!(CFG.sbUrl && CFG.sbKey);

const PKGS = [
  { id: 'classica', title: 'Clássica', subtitle: 'Massagem relaxante', was: 220, price: 180, min: 40,
    tags: ['Apenas mãos', 'Sem toque íntimo'],
    desc: 'O essencial para quem está moído. Força das mãos para desfazer nós e soltar a musculatura. Você entra pesado, sai leve.' },
  { id: 'sensitiva', title: 'Sensitiva', subtitle: 'Massagem + finalização', was: 280, price: 220, min: 60,
    tags: ['Toques leves', 'Finalização íntima'],
    desc: 'Começamos desmanchando o cansaço com massagem clássica. Quando você estiver entregue, os toques mudam, causam arrepios, e encerramos com a massagem íntima.' },
  { id: 'fusion', title: 'Fusion', subtitle: 'Massagem + barba', was: 350, price: 290, min: 60,
    tags: ['Naturista', 'Uso de barba'],
    desc: 'Ficamos à vontade. Primeiro relaxo o corpo com a massagem clássica, depois uso minha barba em algumas partes e encerramos com a massagem íntima.' },
  { id: 'completa', title: 'Completa', subtitle: 'Corpo a corpo + interação', was: 480, price: 390, min: 60,
    tags: ['Gel nuru', 'Sua vez de tocar'],
    desc: 'Sem barreiras. Massagem clássica, proximidade física corpo a corpo com gel escorregadio, liberdade total para você fazer massagem em mim e encerramos com a massagem íntima.' },
  { id: 'aparo', title: 'Aparo', subtitle: 'Apenas depilação', was: 180, price: 130, min: 40,
    tags: ['Estética', 'Sem massagem'],
    desc: 'Serviço isolado para quem busca apenas estética. Aparo de pelos (até 3 lugares) pente 1 e 3, com máquina, sem dores.' },
];

const ADDONS = [
  { id: 'time', label: '+30 min extras', price: 75 },
  { id: 'aparo', label: 'Aparo de pelos', price: 130 },
];

const PEAK = ['12:00','13:00','17:00','18:00','19:00'];

// helpers
const money = (v: number) => `R$ ${v.toFixed(2).replace('.',',')}`;
const vib = (p: number|number[] = 20) => { try { navigator.vibrate?.(p); } catch {} };
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
  del: (k: string) => { try { localStorage.removeItem(k); } catch {} },
};
const dk = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const kd = (k: string) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return null; const [y,m,d] = k.split('-').map(Number); const dt = new Date(y, m-1, d, 12); return isNaN(dt.getTime()) ? null : dt; };
const tmin = (t: string) => { const [h,m] = t.split(':').map(Number); return h*60+m; };
const fmin = (m: number) => `${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
const same = (a: Date|null, b: Date) => !!a && dk(a) === dk(b);
const dlabel = (d: Date, i: number) => i===0 ? 'Hoje' : i===1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.','');
const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };
const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();
const cid = () => { let id = store.get('thaly_cid'); if (!id || id.length < 8) { id = (crypto as any)?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`; store.set('thaly_cid', id); } return id; };
const maskCEP = (v: string) => v.replace(/\D/g,'').replace(/^(\d{5})(\d)/,'$1-$2').slice(0,9);
const maskPix = (k: string) => k.length > 4 ? `•••.•••.•••/${'•'.repeat(4)}-${k.slice(-2)}` : k;

async function rpc<T>(fn: string, args: Record<string, unknown>, signal?: AbortSignal): Promise<{ ok: boolean; data: T|null }> {
  if (!ONLINE) return { ok: false, data: null };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  signal?.addEventListener('abort', () => ctrl.abort(), { once: true });
  try {
    const r = await fetch(`${CFG.sbUrl}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: CFG.sbKey, Authorization: `Bearer ${CFG.sbKey}` },
      body: JSON.stringify(args),
      signal: ctrl.signal,
    });
    if (!r.ok) return { ok: false, data: null };
    return { ok: true, data: await r.json().catch(() => null) };
  } catch { return { ok: false, data: null }; }
  finally { clearTimeout(t); }
}

async function getCoupon(code: string) {
  if (!ONLINE) return { ok: true, value: CFG.coupons[code] || 0 };
  const r = await rpc<number|null>('check_coupon_thalyson', { p_code: code });
  return { ok: r.ok, value: typeof r.data === 'number' ? r.data : 0 };
}

// Icons
const IC = {
  ig: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M7 11V7a5 5 0 0 1 10 0v4',
  check: 'M20 6L9 17l-5-5',
  close: 'M18 6L6 18 M6 6l12 12',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4',
  arr: 'M5 12h14 M12 5l7 7-7 7',
  chat: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 16v-4 M12 8h.01',
};
type ICName = keyof typeof IC;
const Ico = memo(({ n, s = 18, c = '' }: { n: ICName; s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${c}`} aria-hidden="true"><path d={IC[n]} /></svg>
));
Ico.displayName = 'Ico';

// ==== MAIN ====
type Step = 'session' | 'schedule' | 'sent';
interface S {
  pkg: string;
  addons: Record<string, boolean>;
  date: Date | null;
  time: string;
  name: string;
  loc: 'studio' | 'home';
  cep: string;
  street: string;
  num: string;
  comp: string;
  bairro: string;
  pay: '' | 'pix' | 'card' | 'cash';
  req: string;
  coupon: { code: string; value: number; input: string; err: string };
}
const INIT: S = {
  pkg: 'classica', addons: {}, date: null, time: '', name: '',
  loc: 'studio', cep: '', street: '', num: '', comp: '', bairro: '',
  pay: 'pix', req: '', coupon: { code: '', value: 0, input: '', err: '' },
};

const DRAFT = 'thaly_draft_v3';

export default function App() {
  const [step, setStep] = useState<Step>('session');
  const [s, setS] = useState<S>(INIT);
  const upd = useCallback((p: Partial<S>) => setS(v => ({ ...v, ...p })), []);
  
  const [busy, setBusy] = useState<{s:number;e:number}[] | null>(null);
  const [busyLoad, setBusyLoad] = useState(false);
  const [tick, setTick] = useState(0);
  const [sentLink, setSentLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState('');
  const [ret, setRet] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [hp, setHp] = useState('');
  const [showMsg, setShowMsg] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const toastT = useRef<ReturnType<typeof setTimeout>|null>(null);
  const numRef = useRef<HTMLInputElement>(null);

  const say = useCallback((m: string) => { setToast(m); if (toastT.current) clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(''), 2800); }, []);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);

  // restore
  useEffect(() => {
    if (store.get('thaly_returning_final') === 'yes') setRet(true);
    const raw = store.get(DRAFT);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      const dt = typeof d.date === 'string' ? kd(d.date) : null;
      setS(v => ({ ...v, ...d, date: dt, time: typeof d.time === 'string' ? d.time : '' }));
    } catch {}
  }, []);

  // save
  useEffect(() => {
    store.set(DRAFT, JSON.stringify({ ...s, date: s.date ? dk(s.date) : null }));
  }, [s]);

  // busy fetch
  useEffect(() => {
    if (!s.date) { setBusy(null); setBusyLoad(false); return; }
    const ctrl = new AbortController();
    setBusy(null); setBusyLoad(true);
    rpc<{s:number;e:number}[]>('get_busy_thalyson', { p_date: dk(s.date) }, ctrl.signal)
      .then(r => { if (!ctrl.signal.aborted) setBusy(r.ok ? r.data : null); })
      .finally(() => { if (!ctrl.signal.aborted) setBusyLoad(false); });
    return () => ctrl.abort();
  }, [s.date, tick]);

  const pkg = useMemo(() => PKGS.find(p => p.id === s.pkg) || PKGS[0], [s.pkg]);

  const inv = useMemo(() => {
    let dur = pkg.min, addT = 0;
    const list: typeof ADDONS = [];
    ADDONS.forEach(a => { if (s.addons[a.id]) { addT += a.price; list.push(a); if (a.id === 'time') dur += 30; } });
    const reqFee = s.req.trim().length > 3 ? CFG.fetish : 0;
    const base = pkg.price + addT + reqFee;
    const peak = s.loc === 'home' && PEAK.includes(s.time) ? CFG.peak : 0;
    let disc = s.coupon.code ? (s.coupon.value < 1 ? Math.floor(base * s.coupon.value) : s.coupon.value) : (!ret ? CFG.first : 0);
    disc = Math.min(disc, base);
    const after = base - disc;
    const pixOff = s.pay === 'pix' ? Math.ceil(after * CFG.pixOff) : 0;
    const total = after - pixOff + peak;
    const sig = Math.min(CFG.signal, total);
    return { dur, addT, reqFee, base, peak, disc, pixOff, total, sig, rest: Math.max(0, total - sig), list };
  }, [pkg, s.addons, s.req, s.time, s.pay, s.loc, s.coupon, ret]);

  const days = useMemo(() => {
    const out: { d: Date; i: number }[] = [];
    for (let i = 0; out.length < CFG.ahead && i < 40; i++) {
      const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()+i);
      out.push({ d, i });
    }
    return out;
  }, []);

  const slots = useMemo(() => {
    if (!s.date) return [];
    const buf = s.loc === 'home' ? CFG.bufHome : CFG.bufStudio;
    const lead = s.loc === 'home' ? CFG.leadHome : CFG.leadStudio;
    const nowM = now.getHours()*60 + now.getMinutes();
    const today = same(s.date, now);
    const out: { t: string; ok: boolean }[] = [];
    for (let m = CFG.open; m + inv.dur <= CFG.lastEnd; m += CFG.stepMin) {
      let ok = true;
      if (today && m < nowM + lead) ok = false;
      else if ((busy||[]).some(x => x.s < m + inv.dur + buf && x.e + buf > m)) ok = false;
      out.push({ t: fmin(m), ok });
    }
    return out;
  }, [s.date, s.loc, inv.dur, now, busy]);

  useEffect(() => {
    if (!busyLoad && s.time && !slots.some(x => x.t === s.time && x.ok)) upd({ time: '' });
  }, [slots, busyLoad, s.time, upd]);

  const grouped = useMemo(() => {
    const g = [
      { l: 'Manhã', v: [] as typeof slots },
      { l: 'Tarde', v: [] as typeof slots },
      { l: 'Noite', v: [] as typeof slots },
    ];
    slots.forEach(x => { const h = +x.t.slice(0,2); if (h < 12) g[0].v.push(x); else if (h < 18) g[1].v.push(x); else g[2].v.push(x); });
    return g.filter(x => x.v.length > 0);
  }, [slots]);

  const avail = useMemo(() => slots.filter(x => x.ok).length, [slots]);
  const end = s.time ? fmin(tmin(s.time) + inv.dur) : '';
  const isHome = s.loc === 'home';
  const errs = {
    name: s.name.trim().length < 3,
    date: !s.date,
    time: !s.time,
    addr: isHome && !(s.street && s.num && s.bairro),
    pay: !s.pay,
  };
  const canSend = !errs.name && !errs.date && !errs.time && !errs.addr && !errs.pay;

  const applyCoupon = async () => {
    const code = s.coupon.input.trim().toUpperCase().slice(0, 30);
    if (!code) return;
    const r = await getCoupon(code);
    if (r.value > 0) { vib([20,40]); upd({ coupon: { code, value: r.value, input: '', err: '' } }); say('Cupom ativado'); }
    else { vib(50); upd({ coupon: { ...s.coupon, err: r.ok ? 'Cupom inválido.' : 'Sem conexão.' } }); }
  };

  const onCEP = async (v: string) => {
    const m = maskCEP(v); upd({ cep: m });
    if (m.length !== 9) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${m.replace('-','')}/json/`);
      const j = await r.json();
      if (!j.erro) { upd({ street: j.logradouro || s.street, bairro: j.bairro || s.bairro }); setTimeout(() => numRef.current?.focus(), 150); }
      else say('CEP não encontrado.');
    } catch { say('Sem conexão para buscar CEP.'); }
  };

  const buildMsg = useCallback((code = '') => {
    const dStr = s.date ? s.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc: string;
    if (!isHome) loc = '📍 Local: no meu espaço (Bela Vista / Centro Histórico). Endereço exato após confirmação.';
    else {
      const full = `${clean(s.street)}, ${clean(s.num)}${s.comp ? ' - ' + clean(s.comp) : ''} - ${clean(s.bairro)}, São Paulo`;
      loc = `📍 Local: vou até você.\n*Endereço:* ${full}\n*Mapa:* https://maps.google.com/?q=${encodeURIComponent(full)}`;
    }
    let t = `Oi! Fechei pelo site e quero confirmar.\n\n*NOME:* ${clean(s.name)}\n`;
    if (code) t += `*CÓDIGO:* ${code}\n`;
    t += `*QUANDO:* ${dStr}, ${s.time} às ${end} (${inv.dur} min)\n${loc}\n\n`;
    t += `*PACOTE:* ${pkg.title}\n`;
    inv.list.forEach(a => t += `➕ ${a.label}\n`);
    if (s.req.trim()) t += `\n*PEDIDO:* "${clean(s.req)}"\n`;
    t += `\n*PAGAMENTO:* ${money(inv.total)} via ${s.pay.toUpperCase()}\n`;
    t += `*Sinal agora:* ${money(inv.sig)}\n*Restante:* ${money(inv.rest)}\n\n`;
    t += 'Aguardo a resposta pra mandar o comprovante do sinal!';
    return `https://api.whatsapp.com/send?phone=${CFG.phone}&text=${encodeURIComponent(t)}`;
  }, [s, isHome, end, inv, pkg]);

  const send = async () => {
    if (!canSend || submitting) { vib(50); say('Complete os campos'); return; }
    if (hp) { setSubmitting(false); setSentLink('#'); setStep('sent'); return; }
    setSubmitting(true);
    const w = window.open('', '_blank');
    let code = '';
    if (ONLINE && s.date && s.time) {
      const r = await rpc<{ ok: boolean; error?: string; booking_code?: string }>('book_slot_thalyson', {
        p_date: dk(s.date), p_start_minute: tmin(s.time), p_service_id: pkg.id, p_duration: inv.dur,
        p_customer_name: s.name.trim(), p_client_key: cid(),
        p_total: +inv.total.toFixed(2), p_signal: +inv.sig.toFixed(2), p_remaining: +inv.rest.toFixed(2),
        p_is_home: isHome,
      });
      if (!r.ok || !r.data) { w?.close(); setSubmitting(false); say('Não registrei. Tente de novo.'); return; }
      if (!r.data.ok) {
        const m: Record<string,string> = { taken: 'Horário ocupado. Escolha outro.', limit: 'Você já tem solicitações.', past: 'Horário passou.', outside_hours: 'Fora do horário.' };
        w?.close(); setSubmitting(false); vib(50); say(m[r.data.error || ''] || 'Tente outro horário.');
        setTick(v => v + 1); upd({ time: '' }); return;
      }
      code = r.data.booking_code || '';
    }
    const link = buildMsg(code);
    store.set('thaly_returning_final', 'yes'); store.del(DRAFT);
    setSentLink(link); vib([30,50]);
    if (w) { w.opener = null; w.location.href = link; } else window.location.href = link;
    setSubmitting(false); setStep('sent');
  };

  const copyPix = async () => { const ok = await copy(CFG.pix); say(ok ? 'Chave copiada' : `Chave: ${CFG.pix}`); };

  const downloadICS = () => {
    if (!s.date || !s.time) return;
    const f = (d: Date, m: number) => `${dk(d).replace(/-/g,'')}T${fmin(m).replace(':','')}00`;
    const m0 = tmin(s.time);
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Thalyson//PT','BEGIN:VEVENT',`UID:${Date.now()}@th`,
      `DTSTAMP:${f(new Date(), now.getHours()*60+now.getMinutes())}`,`DTSTART:${f(s.date, m0)}`,`DTEND:${f(s.date, m0+inv.dur)}`,
      `SUMMARY:${pkg.title} - Thalyson`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const u = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = u; a.download = 'sessao.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  };

  const restart = () => {
    setS(INIT); setSentLink(''); setStep('session'); vib(15);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const greet = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  // styles
  const styles = (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --ink: #0A0806;
        --surface: #14110E;
        --surface-2: #1C1814;
        --line: #2A241D;
        --line-2: #3A3128;
        --text: #F0EBE3;
        --muted: #8F877B;
        --muted-2: #5C554B;
        --brass: #C9A961;
        --brass-hi: #E0C585;
        --sage: #7A9B76;
        --terra: #C27365;
      }
      html, body { background: var(--ink); color: var(--text); }
      body { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
      .serif { font-family: 'Instrument Serif', 'Cormorant Garamond', Georgia, 'Times New Roman', serif; letter-spacing: -0.02em; font-weight: 400; }
      .lnk { color: var(--brass); text-decoration: none; border-bottom: 1px solid transparent; transition: border-color .2s; }
      .lnk:hover { border-color: var(--brass); }
      .card { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; }
      .card-sel { border-color: var(--brass); box-shadow: 0 0 0 1px var(--brass), 0 8px 32px -16px rgba(201,169,97,.4); background: var(--surface-2); }
      .fade-up { animation: fu .35s cubic-bezier(.2,.8,.2,1) both; }
      @keyframes fu { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      .pulse { animation: pl 1.8s ease-out 1; }
      @keyframes pl { 0%,100% { box-shadow: 0 0 0 0 rgba(201,169,97,.5); } 50% { box-shadow: 0 0 0 10px rgba(201,169,97,0); } }
      .hide-sb::-webkit-scrollbar { display: none; } .hide-sb { scrollbar-width: none; }
      @media (prefers-reduced-motion: reduce) { .fade-up, .pulse { animation: none !important; } *, *::before, *::after { transition: none !important; } }
    ` }} />
  );

  // ========== RENDER ==========
  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)', color: 'var(--text)' }}>
      {styles}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full text-sm font-medium fade-up"
          style={{ background: 'var(--text)', color: 'var(--ink)' }} role="status" aria-live="polite">
          {toast}
        </div>
      )}

      <div className="max-w-lg mx-auto px-5 pb-40">
        {/* ===== HERO (always visible at top) ===== */}
        {step !== 'sent' && (
          <header className="pt-8 pb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={CFG.avatar} alt="" className="w-10 h-10 rounded-full object-cover" style={{ border: '1px solid var(--line)' }} />
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text)' }}>Thalyson</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>Bela Vista, SP</div>
              </div>
            </div>
            <a href={CFG.ig} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full" style={{ color: 'var(--muted)' }} aria-label="Instagram">
              <Ico n="ig" s={18} />
            </a>
          </header>
        )}

        {/* ===== SESSION ===== */}
        {step === 'session' && (
          <div className="fade-up">
            <div className="mb-8">
              <div className="text-xs mb-3" style={{ color: 'var(--brass)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Passo 1 de 2</div>
              <h1 className="serif text-4xl leading-tight mb-3" style={{ color: 'var(--text)' }}>
                {greet}.<br/>Escolha sua <em style={{ color: 'var(--brass)' }}>experiência</em>.
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                Sem pressa. Sem julgamento. +18 anos.
              </p>
            </div>

            <div className="space-y-3" role="radiogroup" aria-label="Pacotes">
              {PKGS.map(p => {
                const on = s.pkg === p.id;
                return (
                  <button key={p.id} role="radio" aria-checked={on}
                    onClick={() => { vib(15); upd({ pkg: p.id }); }}
                    className={`w-full text-left p-5 rounded-2xl transition-all ${on ? 'card-sel' : 'card'}`}
                    style={!on ? {} : {}}>
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="serif text-2xl leading-tight" style={{ color: on ? 'var(--brass-hi)' : 'var(--text)' }}>{p.title}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{p.subtitle}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs line-through" style={{ color: 'var(--muted-2)' }}>{money(p.was)}</div>
                        <div className="text-lg font-semibold" style={{ color: on ? 'var(--brass)' : 'var(--text)' }}>{money(p.price)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap mt-3 mb-3">
                      <span className="text-xs px-2 py-1 rounded-md inline-flex items-center gap-1" style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--line)' }}>
                        <Ico n="clock" s={11} /> {p.min} min
                      </span>
                      {p.tags.map(t => (
                        <span key={t} className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--surface-2)', color: 'var(--muted)', border: '1px solid var(--line)' }}>{t}</span>
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: on ? 'var(--text)' : 'var(--muted)' }}>{p.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Addons */}
            <div className="mt-6">
              <button onClick={() => setShowExtra(!showExtra)} className="text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--brass)' }}>
                <Ico n={showExtra ? 'close' : 'arr'} s={14} />
                {showExtra ? 'Ocultar adicionais' : 'Adicionar extras'}
              </button>
              {showExtra && (
                <div className="space-y-2 fade-up">
                  {ADDONS.filter(a => !(s.pkg === 'aparo' && a.id === 'aparo')).map(a => {
                    const on = !!s.addons[a.id];
                    return (
                      <button key={a.id} onClick={() => { vib(15); upd({ addons: { ...s.addons, [a.id]: !on } }); }}
                        className={`w-full p-4 rounded-xl flex items-center justify-between gap-3 text-sm text-left transition-all ${on ? 'card-sel' : 'card'}`}>
                        <span className="flex items-center gap-3">
                          <span className="w-4 h-4 rounded border flex items-center justify-center shrink-0"
                            style={{ borderColor: on ? 'var(--brass)' : 'var(--line-2)', background: on ? 'var(--brass)' : 'transparent', color: 'var(--ink)' }}>
                            {on && <Ico n="check" s={12} />}
                          </span>
                          <span style={{ color: 'var(--text)' }}>{a.label}</span>
                        </span>
                        <span style={{ color: 'var(--brass)' }}>+{money(a.price)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!ret && (
              <div className="mt-8 p-4 rounded-xl flex items-start gap-3" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                <Ico n="star" s={16} c="mt-0.5" />
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                  Primeira vez? <strong style={{ color: 'var(--brass)' }}>R$15 de desconto</strong> aplicados automaticamente.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===== SCHEDULE ===== */}
        {step === 'schedule' && (
          <div className="fade-up">
            <button onClick={() => setStep('session')} className="text-xs mb-6 flex items-center gap-1" style={{ color: 'var(--muted)' }}>
              ← Trocar experiência
            </button>

            <div className="mb-6">
              <div className="text-xs mb-3" style={{ color: 'var(--brass)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Passo 2 de 2</div>
              <h1 className="serif text-3xl leading-tight mb-2" style={{ color: 'var(--text)' }}>Quando e onde?</h1>
              <div className="text-sm" style={{ color: 'var(--muted)' }}>{pkg.title} · {inv.dur} min</div>
            </div>

            {/* Date strip */}
            <div className="mb-6">
              <div className="flex gap-2 overflow-x-auto pb-2 hide-sb -mx-5 px-5 snap-x">
                {days.map(({ d, i }) => {
                  const on = same(s.date, d);
                  return (
                    <button key={dk(d)} onClick={() => { vib(10); upd({ date: d, time: '' }); setBusy(null); }}
                      className={`shrink-0 snap-start w-[68px] py-2.5 rounded-xl flex flex-col items-center transition-all ${on ? 'card-sel' : 'card'}`}>
                      <span className="text-[10px] uppercase tracking-wider font-medium" style={{ color: on ? 'var(--brass)' : 'var(--muted)' }}>{dlabel(d, i)}</span>
                      <span className="serif text-2xl leading-tight mt-0.5" style={{ color: on ? 'var(--text)' : 'var(--text)' }}>{d.getDate()}</span>
                      <span className="text-[10px] uppercase" style={{ color: 'var(--muted)' }}>{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.','')}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slots */}
            {s.date && (
              <div className="mb-8 fade-up">
                {busyLoad ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--surface)' }} />
                    ))}
                  </div>
                ) : avail === 0 ? (
                  <div className="p-6 rounded-xl text-center" style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}>
                    <p className="text-sm" style={{ color: 'var(--muted)' }}>Nenhum horário neste dia.</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-2)' }}>Tente outra data.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {grouped.map(g => (
                      <div key={g.l}>
                        <div className="text-[10px] uppercase tracking-wider mb-2 font-medium" style={{ color: 'var(--muted-2)' }}>{g.l}</div>
                        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label={g.l}>
                          {g.v.map(x => {
                            const on = s.time === x.t;
                            const peak = isHome && PEAK.includes(x.t);
                            return (
                              <button key={x.t} disabled={!x.ok} onClick={() => { vib(10); upd({ time: x.t }); }}
                                className={`py-3 rounded-lg text-sm font-medium transition-all ${on ? 'card-sel' : x.ok ? 'card' : ''}`}
                                style={!x.ok ? { background: 'transparent', border: '1px dashed var(--line)', color: 'var(--muted-2)', cursor: 'not-allowed' } : {}}
                                aria-pressed={on} aria-label={`${x.t}${peak ? ', pico' : ''}${!x.ok ? ', ocupado' : ''}`}>
                                <div style={{ color: on ? 'var(--brass)' : x.ok ? 'var(--text)' : 'var(--muted-2)' }}>{x.t}</div>
                                {peak && <div className="text-[9px] mt-0.5" style={{ color: on ? 'var(--brass)' : 'var(--muted-2)' }}>+R$18</div>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            {s.time && (
              <div className="mb-6 fade-up">
                <div className="text-xs mb-2 font-medium" style={{ color: 'var(--muted)' }}>Local</div>
                <div className="grid grid-cols-2 gap-2">
                  {([['studio','No meu espaço'],['home','Vou até você']] as const).map(([v,l]) => (
                    <button key={v} onClick={() => upd({ loc: v })}
                      className={`py-3 px-3 rounded-xl text-sm font-medium transition-all ${s.loc === v ? 'card-sel' : 'card'}`}
                      style={{ color: s.loc === v ? 'var(--brass)' : 'var(--text)' }}>
                      {l}
                    </button>
                  ))}
                </div>
                {!isHome ? (
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    <Ico n="map" s={11} c="inline mb-0.5 mr-1" /> Bela Vista, próximo ao Metrô Anhangabaú. Endereço após confirmação.
                  </p>
                ) : (
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
                    +R$18 em horários de pico (12h, 13h, 17h, 18h, 19h). Preciso de mais antecedência.
                  </p>
                )}
              </div>
            )}

            {/* Address (home only) */}
            {isHome && s.time && (
              <div className="mb-6 space-y-2 fade-up">
                <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9}
                  value={s.cep} onChange={e => onCEP(e.target.value)} placeholder="CEP"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }} />
                <input type="text" autoComplete="street-address" value={s.street}
                  onChange={e => upd({ street: e.target.value })} placeholder="Rua"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }} />
                <div className="grid grid-cols-3 gap-2">
                  <input ref={numRef} type="text" value={s.num} onChange={e => upd({ num: e.target.value })} placeholder="Nº" inputMode="numeric"
                    className="px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }} />
                  <input type="text" value={s.comp} onChange={e => upd({ comp: e.target.value })} placeholder="Compl." className="col-span-2 px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }} />
                </div>
                <input type="text" value={s.bairro} onChange={e => upd({ bairro: e.target.value })} placeholder="Bairro"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }} />
              </div>
            )}

            {/* Name */}
            {s.time && (!isHome || (s.street && s.num && s.bairro)) && (
              <div className="mb-6 fade-up">
                <input type="text" value={s.name} onChange={e => upd({ name: e.target.value })} placeholder="Como devo te chamar?" autoComplete="given-name" maxLength={60}
                  className="w-full px-4 py-4 rounded-xl text-base outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }} />
                <input type="text" name="website" value={hp} onChange={e => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              </div>
            )}

            {/* Payment */}
            {s.name.trim().length >= 3 && (!isHome || (s.street && s.num && s.bairro)) && (
              <div className="mb-6 fade-up">
                <div className="text-xs mb-2 font-medium" style={{ color: 'var(--muted)' }}>Pagamento do restante</div>
                <div className="grid grid-cols-3 gap-2">
                  {([['pix','Pix −3%'],['card','Cartão'],['cash','Dinheiro']] as const).map(([v,l]) => (
                    <button key={v} onClick={() => upd({ pay: v })}
                      className={`py-3 rounded-xl text-xs font-medium transition-all ${s.pay === v ? 'card-sel' : 'card'}`}
                      style={{ color: s.pay === v ? 'var(--brass)' : 'var(--text)' }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extras: coupon + request, collapsible */}
            {canSend && (
              <div className="fade-up space-y-3">
                <details className="card p-4">
                  <summary className="text-sm cursor-pointer" style={{ color: 'var(--brass)' }}>Tenho cupom</summary>
                  {!s.coupon.code ? (
                    <div className="flex gap-2 mt-3">
                      <input type="text" value={s.coupon.input} onChange={e => upd({ coupon: { ...s.coupon, input: e.target.value.toUpperCase(), err: '' } })}
                        placeholder="Código" className="flex-1 px-3 py-2 rounded-lg text-sm uppercase outline-none"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--text)' }} />
                      <button onClick={applyCoupon} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--brass)', color: 'var(--ink)' }}>OK</button>
                    </div>
                  ) : (
                    <div className="mt-3 flex justify-between items-center text-sm">
                      <span style={{ color: 'var(--sage)' }}>✓ {s.coupon.code}</span>
                      <button onClick={() => upd({ coupon: { code: '', value: 0, input: '', err: '' } })} className="text-xs" style={{ color: 'var(--muted)' }}>remover</button>
                    </div>
                  )}
                  {s.coupon.err && <p className="text-xs mt-2" style={{ color: 'var(--terra)' }}>{s.coupon.err}</p>}
                </details>

                <details className="card p-4">
                  <summary className="text-sm cursor-pointer" style={{ color: 'var(--brass)' }}>Adicionar pedido específico</summary>
                  <textarea value={s.req} onChange={e => upd({ req: e.target.value })} maxLength={140} rows={3}
                    placeholder="Algum detalhe ou vontade pra sessão (opcional)"
                    className="w-full mt-3 px-3 py-2 rounded-lg text-sm resize-none outline-none"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--text)' }} />
                  <p className="text-[11px] mt-1" style={{ color: 'var(--muted-2)' }}>+{money(CFG.fetish)} se aceito. Não cobrado se inviável.</p>
                </details>

                <details className="card p-4" onToggle={e => setShowMsg((e.target as HTMLDetailsElement).open)}>
                  <summary className="text-sm cursor-pointer flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                    <Ico n="chat" s={14} /> Ver mensagem que será enviada
                  </summary>
                  <pre className="mt-3 p-3 rounded-lg text-xs whitespace-pre-wrap break-words" style={{ background: 'var(--surface-2)', color: 'var(--muted)', fontFamily: 'ui-monospace, monospace' }}>
                    {buildMsg().replace('https://api.whatsapp.com/send?phone='+CFG.phone+'&text=', '').slice(0, 400)}...
                  </pre>
                </details>
              </div>
            )}
          </div>
        )}

        {/* ===== SENT ===== */}
        {step === 'sent' && (
          <div className="fade-up pt-16 text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center pulse"
              style={{ background: 'rgba(122,155,118,.15)', border: '1px solid var(--sage)' }}>
              <Ico n="check" s={36} c="" />
            </div>
            <h1 className="serif text-3xl mb-3" style={{ color: 'var(--text)' }}>Tudo pronto.</h1>
            <p className="text-sm leading-relaxed mb-8 max-w-xs mx-auto" style={{ color: 'var(--muted)' }}>
              Sua solicitação foi preparada. O horário só confirma após resposta no WhatsApp.
            </p>
            <div className="max-w-xs mx-auto space-y-2">
              <a href={sentLink || buildMsg()} target="_blank" rel="noopener noreferrer"
                className="block w-full py-4 rounded-xl text-sm font-semibold text-center"
                style={{ background: 'var(--brass)', color: 'var(--ink)' }}>
                Abrir WhatsApp
              </a>
              <button onClick={copyPix} className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }}>
                <Ico n="copy" s={14} /> Pix ({maskPix(CFG.pix)})
              </button>
              <button onClick={downloadICS} className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--text)' }}>
                <Ico n="cal" s={14} /> Adicionar à agenda
              </button>
              <button onClick={restart} className="w-full py-3 text-xs" style={{ color: 'var(--muted)' }}>Novo agendamento</button>
            </div>
            <p className="text-xs mt-8 leading-relaxed" style={{ color: 'var(--muted-2)' }}>
              Envie o comprovante do sinal de <strong style={{ color: 'var(--brass)' }}>{money(inv.sig)}</strong> na conversa pra confirmar.
            </p>
          </div>
        )}
      </div>

      {/* ===== STICKY CTA ===== */}
      {step !== 'sent' && (
        <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: 'linear-gradient(to top, var(--ink) 60%, transparent)' }}>
          <div className="max-w-lg mx-auto px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--muted-2)' }}>Total</div>
                <div className="serif text-2xl leading-tight" style={{ color: 'var(--text)' }}>{money(inv.total)}</div>
                {inv.disc > 0 && <div className="text-[10px]" style={{ color: 'var(--sage)' }}>−{money(inv.disc)} {s.coupon.code ? 'cupom' : 'boas-vindas'}</div>}
              </div>
              {step === 'session' ? (
                <button onClick={() => { vib(20); setStep('schedule'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-6 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2"
                  style={{ background: 'var(--brass)', color: 'var(--ink)' }}>
                  Continuar <Ico n="arr" s={14} />
                </button>
              ) : (
                <button onClick={send} disabled={!canSend || submitting}
                  className="px-5 py-3.5 rounded-xl text-sm font-semibold flex items-center gap-2 disabled:opacity-40"
                  style={{ background: canSend ? 'var(--sage)' : 'var(--surface)', color: canSend ? 'var(--ink)' : 'var(--muted)' }}>
                  {submitting ? '...' : <><Ico n="chat" s={14} /> Enviar no WhatsApp</>}
                </button>
              )}
            </div>
            {step === 'schedule' && !canSend && (
              <div className="text-[10px] mt-1" style={{ color: 'var(--muted-2)' }}>
                {errs.date ? 'Escolha a data' : errs.time ? 'Escolha o horário' : errs.addr ? 'Complete o endereço' : errs.name ? 'Informe seu nome' : ''}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
