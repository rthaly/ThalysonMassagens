import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

/* ==========================================================================
   1. CONFIGURAÇÃO (edite aqui — não há backend)
   ========================================================================== */
const ENV = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};

const CONFIG = {
  PHONE: '5517991360413',
  PIX_KEY: '62922530000144',
  INSTAGRAM: 'https://www.instagram.com/relaxarhojesp',
  REVIEW_LINK: 'https://g.page/r/Cd1aEwEt0R1QEAE/review',
  AVATAR: 'FmtU3Ogx_400x400.jpg',
  SUPABASE_URL: ENV.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: ENV.VITE_SUPABASE_ANON_KEY || '',
  COUPONS: { SESSAO2: 0.08, RELAXAR13: 0.13, THALY20: 20, BEMVINDO50: 50 } as Record<string, number>,
  PROMO_HOUR: 18,
  EVENING_COUPON: 'RELAXAR13',
  EVENING_LABEL: '13% de desconto na sua sessão',
  SIGNAL_AMOUNT: 50,
  FIRST_TIME_DISCOUNT: 15,
  FETISH_FEE: 130,
  PEAK_FEE: 18,
  PIX_DISCOUNT: 0.03,
  OPEN_MIN: 9 * 60,
  LAST_END_MIN: 23 * 60 + 30,
  SLOT_STEP: 60,
  BUFFER_STUDIO: 15,
  BUFFER_HOME: 60,
  MIN_LEAD_STUDIO: 90,
  MIN_LEAD_HOME: 150,
  DAYS_AHEAD: 14,
  DAYS_OFF: [] as number[],
  BLOCKED: {} as Record<string, string[]>,
};

const PACKAGES = [
  { id: 'classica', title: 'Massagem Clássica', originalPrice: 220, price: 180, min: 40, tags: ['Apenas Mãos', 'Sem Toque Íntimo'],
    desc: 'O essencial para quem está moído da rotina. Uso a força das minhas mãos para desfazer os nós de tensão e soltar sua musculatura. Você entra pesado e sai leve.' },
  { id: 'sensitiva', title: 'Sensitiva & Prazer', originalPrice: 280, price: 220, min: 60, tags: ['Toques Leves', 'Finalização Íntima'],
    desc: 'Começamos desmanchando o cansaço do seu corpo com a massagem clássica. Quando você estiver entregue, os toques mudam, causam arrepios e encerramos com a massagem íntima.' },
  { id: 'fusion', title: 'Sensações com a Barba', originalPrice: 350, price: 290, min: 60, tags: ['Naturista', 'Uso de Barba'],
    desc: 'Ficamos totalmente à vontade. Primeiro vou relaxar seu corpo com a massagem clássica, depois uso minha barba em algumas partes do seu corpo e encerramos com a massagem íntima.' },
  { id: 'completa', title: 'A Experiência Completa', originalPrice: 480, price: 390, min: 60, tags: ['Gel Nuru', 'A Sua Vez de Tocar'],
    desc: 'O pacote sem barreiras. Primeiro vou relaxar seu corpo com a massagem clássica, depois proximidade física com gel escorregadio corpo a corpo e liberdade total para você fazer massagem em mim e encerramos com a massagem íntima.' },
  { id: 'aparo_solo', title: 'Apenas Depilação (Máquina)', originalPrice: 180, price: 130, min: 40, tags: ['Estética', 'Sem Massagem'],
    desc: 'Serviço isolado para quem busca apenas estética. Aparo de pelos (até 3 lugares) pente 1 e 3 utilizando máquina sem dores.' },
];

const ADDONS = [
  { id: 'time', label: '+30 minutos extras', price: 75 },
  { id: 'aparo', label: 'Aparar Pelos até 3 lugares (Máquina)', price: 130 },
];

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];

/* ==========================================================================
   2. UTILITÁRIOS
   ========================================================================== */
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const store = {
  get: (k: string): string | null => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: (k: string) => { try { localStorage.removeItem(k); } catch (e) {} },
};
const BACKEND_ON = !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<{ ok: boolean; data: T | null }> {
  if (!BACKEND_ON) return { ok: false, data: null };
  try {
    const r = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: CONFIG.SUPABASE_ANON_KEY, Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}` },
      body: JSON.stringify(args),
    });
    if (!r.ok) return { ok: false, data: null };
    return { ok: true, data: (await r.json()) as T };
  } catch { return { ok: false, data: null }; }
}

const clientId = () => {
  let id = store.get('thaly_cid');
  if (!id || id.length < 8) { id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`; store.set('thaly_cid', id); }
  return id;
};

const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();

async function lookupCoupon(code: string): Promise<{ ok: boolean; value: number }> {
  if (!BACKEND_ON) return { ok: true, value: CONFIG.COUPONS[code] || 0 };
  const r = await rpc<number | null>('check_coupon', { p_code: code });
  return { ok: r.ok, value: typeof r.data === 'number' ? r.data : 0 };
}

const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date): boolean => !!a && dateKey(a) === dateKey(b);
const dayLabel = (d: Date, i: number) => (i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''));
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } };

const ICONS = {
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M7 11V7a5 5 0 0 1 10 0v4',
  check: 'M20 6L9 17l-5-5',
  close: 'M18 6L6 18 M6 6l12 12',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4',
};

type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICONS[name] || ''} />
  </svg>
));

const inputCls = 'w-full bg-stone-900 border border-stone-700 rounded-2xl px-5 min-h-[52px] text-base text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-colors';
const labelCls = 'block text-xs font-semibold text-stone-300 mb-3';
const chipBase = 'min-h-[52px] border rounded-2xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2';
const chipOn = 'bg-stone-100 text-stone-950 border-stone-100 font-semibold';
const chipOff = 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800';
const btnPrimary = 'min-h-[52px] px-6 text-sm font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 disabled:bg-stone-800 disabled:text-stone-500 disabled:cursor-not-allowed';
const btnGhost = 'min-h-[52px] px-5 text-sm font-semibold rounded-xl border border-stone-600 text-stone-200 hover:bg-stone-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400';

/* ==========================================================================
   3. APP
   ========================================================================== */
type SlotStatus = 'ok' | 'past' | 'blocked';
interface BookingData {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addons: Record<string, boolean>;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [isReturning, setIsReturning] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [touched, setTouched] = useState(false);
  const [coupon, setCoupon] = useState({ input: '', applied: '', value: 0, error: '' });
  const [now, setNow] = useState(() => new Date());
  const numberRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [data, setData] = useState<BookingData>({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
    date: null, time: '', req: '', payment: '', packageId: PACKAGES[0].id, addons: {},
  });
  const set = (patch: Partial<BookingData>) => setData((p) => ({ ...p, ...patch }));

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 900); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);

  useEffect(() => {
    if (isLoading) return;
    if (store.get('thaly_onboard_final') === 'yes') setStep(1);
    if (store.get('thaly_returning_final') === 'yes') setIsReturning(true);
    const draft = store.get('thaly_draft_booking');
    if (draft) {
      try {
        const d = JSON.parse(draft);
        setData((p) => ({ ...p, name: d.name || '', locType: d.locType || 'studio', street: d.street || '', number: d.number || '', bairro: d.bairro || '', cep: d.cep || '' }));
      } catch (e) {}
    }
  }, [isLoading]);

  useEffect(() => {
    if (data.name.length > 2) {
      store.set('thaly_draft_booking', JSON.stringify({ name: data.name, locType: data.locType, street: data.street, number: data.number, bairro: data.bairro, cep: data.cep }));
    }
  }, [data.name, data.locType, data.street, data.number, data.bairro, data.cep]);

  useEffect(() => { if (step > 0) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  useEffect(() => {
    if (!profileOpen && !promoOpen) return undefined;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setProfileOpen(false); setPromoOpen(false); } };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [profileOpen, promoOpen]);

  useEffect(() => {
    if (isLoading) return undefined;
    if (new Date().getHours() < CONFIG.PROMO_HOUR || store.get('thaly_promo_day') === dateKey(new Date())) return undefined;
    const t = setTimeout(() => setPromoOpen(true), 1800);
    return () => clearTimeout(t);
  }, [isLoading]);

  useEffect(() => {
    if (data.packageId === 'aparo_solo' && data.addons.aparo) set({ addons: { ...data.addons, aparo: false } });
  }, [data.packageId, data.addons.aparo]);

  const [busy, setBusy] = useState<{ s: number; e: number }[] | null>(null);
  const [busyLoading, setBusyLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [sentLink, setSentLink] = useState('');
  const [hp, setHp] = useState('');
  const [optIn, setOptIn] = useState(false);
  const lockRef = useRef({ fails: 0, until: 0 });

  useEffect(() => {
    if (!data.date) return undefined;
    let off = false;
    setBusyLoading(true);
    rpc<{ s: number; e: number }[]>('get_busy', { p_date: dateKey(data.date) })
      .then((r) => { if (!off) setBusy(r.ok ? r.data : null); })
      .finally(() => { if (!off) setBusyLoading(false); });
    return () => { off = true; };
  }, [data.date, tick]);

  const pkg = useMemo(() => PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0], [data.packageId]);
  const isHome = data.locType === 'home';

  const invoice = useMemo(() => {
    let dur = pkg.min, addonsTotal = 0;
    const activeAddons: typeof ADDONS = [];
    ADDONS.forEach((a) => {
      if (data.addons[a.id]) { addonsTotal += a.price; activeAddons.push(a); if (a.id === 'time') dur += 30; }
    });
    const reqFee = data.req.trim().length > 3 ? CONFIG.FETISH_FEE : 0;
    const base = pkg.price + addonsTotal + reqFee;
    const peakFee = isHome && PEAK_HOURS.includes(data.time) ? CONFIG.PEAK_FEE : 0;

    let discount = 0;
    if (coupon.applied) {
      const v = coupon.value;
      discount = v < 1 ? Math.floor(base * v) : v;
    } else if (!isReturning) discount = CONFIG.FIRST_TIME_DISCOUNT;
    discount = Math.min(discount, base);

    const afterDiscount = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.ceil(afterDiscount * CONFIG.PIX_DISCOUNT) : 0;
    const total = afterDiscount - pixDiscount + peakFee;
    const sinal = Math.min(CONFIG.SIGNAL_AMOUNT, total);
    return { base: pkg.price, addonsTotal, reqFee, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, activeAddons };
  }, [data, pkg, isHome, isReturning, coupon.applied, coupon.value]);

  const days = useMemo(() => {
    const out: { d: Date; i: number }[] = [];
    for (let i = 0; out.length < CONFIG.DAYS_AHEAD && i < 40; i++) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
      if (!CONFIG.DAYS_OFF.includes(d.getDay())) out.push({ d, i });
    }
    return out;
  }, []);

  const slots = useMemo(() => {
    if (!data.date) return [];
    const buffer = isHome ? CONFIG.BUFFER_HOME : CONFIG.BUFFER_STUDIO;
    const lead = isHome ? CONFIG.MIN_LEAD_HOME : CONFIG.MIN_LEAD_STUDIO;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = sameDay(data.date, now);
    const blocked = (CONFIG.BLOCKED[dateKey(data.date)] || []).map(toMin);
    const out: { t: string; status: SlotStatus }[] = [];
    
    for (let m = CONFIG.OPEN_MIN; m + invoice.dur <= CONFIG.LAST_END_MIN; m += CONFIG.SLOT_STEP) {
      const end = m + invoice.dur + buffer;
      let status: SlotStatus = 'ok';
      if (today && m < nowMin + lead) status = 'past';
      else if (blocked.some((b) => b < end && b + CONFIG.SLOT_STEP > m)) status = 'blocked';
      else if ((busy || []).some((x) => x.s < end && (x.e + buffer) > m)) status = 'blocked';
      out.push({ t: fromMin(m), status });
    }
    return out;
  }, [data.date, isHome, invoice.dur, now, busy]);

  useEffect(() => {
    if (!busyLoading && data.time && !slots.some((s) => s.t === data.time && s.status === 'ok')) {
      set({ time: '' });
    }
  }, [slots, busyLoading, data.time]);

  const availableCount = slots.filter((s) => s.status === 'ok').length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';

  const errors = {
    name: data.name.trim().length < 3 ? 'Informe seu nome (mín. 3 letras).' : '',
    date: !data.date ? 'Escolha uma data.' : '',
    time: data.date && !data.time ? 'Escolha um horário.' : '',
    address: isHome && !(data.street && data.number && data.bairro) ? 'Preencha rua, número e bairro.' : '',
  };
  const step2Valid = !errors.name && data.date && data.time && !errors.address;

  const applyCoupon = async () => {
    const code = coupon.input.trim().toUpperCase().slice(0, 30);
    if (!code) return;
    const L = lockRef.current;
    if (Date.now() < L.until) { setCoupon((c) => ({ ...c, error: 'Muitas tentativas. Aguarde alguns segundos.' })); return; }
    const r = await lookupCoupon(code);
    if (r.value > 0) {
      L.fails = 0; vibrate([20, 40]); setCoupon({ input: '', applied: code, value: r.value, error: '' }); showToast('Cupom ativado');
    } else {
      vibrate(50); L.fails += 1;
      if (L.fails >= 3) { L.until = Date.now() + 30000; L.fails = 0; }
      setCoupon((c) => ({ ...c, error: r.ok ? 'Cupom inválido ou expirado.' : 'Sem conexão. Tente novamente.' }));
    }
  };

  const closePromo = () => { store.set('thaly_promo_day', dateKey(new Date())); setPromoOpen(false); };
  const acceptPromo = async () => {
    closePromo();
    const r = await lookupCoupon(CONFIG.EVENING_COUPON);
    if (r.value > 0) { setCoupon({ input: '', applied: CONFIG.EVENING_COUPON, value: r.value, error: '' }); showToast(`Cupom ${CONFIG.EVENING_COUPON} ativado`); }
  };
  
  const forgetMe = () => {
    store.del('thaly_draft_booking'); store.del('thaly_cid');
    set({ name: '', cep: '', street: '', number: '', comp: '', bairro: '' });
    showToast('Dados apagados deste aparelho');
  };

  const copyPix = async () => {
    const ok = await copyText(CONFIG.PIX_KEY);
    showToast(ok ? 'Chave Pix (CNPJ) copiada' : `Chave Pix: ${CONFIG.PIX_KEY}`);
  };

  const selectPayment = (m: string) => { vibrate(15); set({ payment: m }); };

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const j = await res.json();
        if (!j.erro) { setData((p) => ({ ...p, street: j.logradouro || p.street, bairro: j.bairro || p.bairro })); setTimeout(() => numberRef.current?.focus(), 150); }
        else showToast('CEP não encontrado. Preencha manualmente.');
      } catch (e) { showToast('Sem conexão para buscar o CEP.'); }
    }
  };

  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc;
    if (!isHome) loc = '📍 *Local:* Irei até o seu espaço no Centro Histórico.';
    else {
      const full = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}, São Paulo`;
      loc = `📍 *Local:* Você virá até mim.\n*Endereço:* ${full}\n*Mapa:* https://maps.google.com/?q=${encodeURIComponent(full)}`;
    }
    let t = `Oi Thalyson! Fechei pelo site e quero confirmar.\n\n*NOME:* ${clean(data.name)}\n`;
    t += `*DIA E HORA:* ${dStr} das ${data.time} às ${endTime}\n${loc}\n\n`;
    t += `*MEU PACOTE (${invoice.dur} min):*\n✅ ${pkg.title} (${money(pkg.price)})\n`;
    invoice.activeAddons.forEach((a) => (t += `➕ ${a.label} (+${money(a.price)})\n`));
    if (data.req.trim()) t += `\n*VONTADE ESPECÍFICA:* "${clean(data.req)}" (Ciente da taxa de +${money(CONFIG.FETISH_FEE)} se rolar)\n`;
    if (invoice.discount > 0) t += `\n🎁 *Desconto:* ${coupon.applied ? 'Cupom ' + coupon.applied : 'Presente de 1ª Vez'} (-${money(invoice.discount)})\n`;
    if (invoice.peakFee > 0) t += `📈 *Taxa de Pico:* (+${money(invoice.peakFee)})\n`;
    t += `\n*RESUMO DO PAGAMENTO:*\n*Valor Total:* ${money(invoice.total)} (${data.payment.toUpperCase()})\n`;
    t += `*Sinal (Pix agora):* ${money(invoice.sinal)}\n*Restante (depois da sessão):* ${money(invoice.rest)}\n\n`;
    if (optIn) t += '🔔 Aceito receber lembretes e novidades por WhatsApp.\n\n';
    t += 'Aguardo sua resposta para mandar o comprovante do sinal!';
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const downloadICS = () => {
    if (!data.date || !data.time) return;
    const f = (d: Date, m: number) => `${dateKey(d).replace(/-/g, '')}T${fromMin(m).replace(':', '')}00`;
    const s = toMin(data.time);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thalyson//Agenda//PT', 'BEGIN:VEVENT',
      `UID:${Date.now()}@thalyson`, `DTSTAMP:${f(new Date(), now.getHours() * 60 + now.getMinutes())}`,
      `DTSTART:${f(data.date, s)}`, `DTEND:${f(data.date, s + invoice.dur)}`,
      `SUMMARY:${pkg.title} - Thalyson`, `DESCRIPTION:Sinal de ${money(invoice.sinal)} via Pix para confirmar.`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = url; a.download = 'sessao.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const finishBooking = async () => {
    if (!data.payment) { vibrate(50); showToast('Escolha a forma de pagamento'); return; }
    if (submitting || !data.date) return;
    setSubmitting(true);
    
    if (hp) {
      setSubmitting(false);
      setSentLink('#');
      setStep(4);
      return;
    }

    const w = window.open('', '_blank');
    const link = whatsappLink();
    let held = true;
    
    const r = await rpc<{ ok: boolean; error?: string }>('book_slot', {
      p_date: dateKey(data.date), p_start: toMin(data.time), p_dur: invoice.dur, p_home: isHome,
      p_name: data.name.trim(), p_pkg: pkg.id, p_client: clientId(),
    });
    
    if (r.ok && r.data && !r.data.ok) {
      const err = r.data.error;
      w?.close(); setSubmitting(false); vibrate(50);
      showToast(err === 'taken' ? 'Esse horário acabou de ser reservado. Escolha outro.'
        : err === 'limit' ? 'Você já tem reservas aguardando confirmação.'
        : err === 'busy_system' ? 'Muitas reservas pendentes agora. Tente em alguns minutos.'
        : 'Não foi possível reservar. Revise os dados.');
      setTick((t) => t + 1); set({ time: '' }); setStep(2); return;
    }
    
    if (!r.ok) held = false;
    if (!held && BACKEND_ON) showToast('Sem trava de horário agora. Confirme direto pelo WhatsApp.');
    
    store.set('thaly_returning_final', 'yes'); store.del('thaly_draft_booking');
    setSentLink(link); setIsReturning(true); vibrate([30, 50]);
    if (w) { w.opener = null; w.location.href = link; }
    setSubmitting(false); setStep(4);
  };

  const downloadReminder = () => {
    const d = new Date(); d.setDate(d.getDate() + 14);
    const ds = dateKey(d).replace(/-/g, '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thalyson//Lembrete//PT', 'BEGIN:VEVENT',
      `UID:rem-${Date.now()}@thalyson`, `DTSTAMP:${dateKey(new Date()).replace(/-/g, '')}T000000Z`,
      `DTSTART:${ds}T180000`, `DTEND:${ds}T183000`, 'SUMMARY:Hora de relaxar - Thalyson Massagens',
      `DESCRIPTION:Agende em ${window.location.origin} e use o cupom ${CONFIG.EVENING_COUPON}.`,
      'BEGIN:VALARM', 'TRIGGER:PT0S', 'ACTION:DISPLAY', 'DESCRIPTION:Hora de relaxar', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = url; a.download = 'lembrete.ics'; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const resetFlow = () => {
    vibrate(15); setTouched(false);
    setData((p) => ({ name: p.name, locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', req: '', payment: '', packageId: PACKAGES[0].id, addons: {} }));
    setStep(1);
  };

  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  const css = (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes fadeUp { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform:none } }
      @keyframes slide { 0% { transform: translateX(-100%) } 100% { transform: translateX(300%) } }
      .fade-up { animation: fadeUp .4s ease both }
      .load-bar { animation: slide 1.2s infinite ease-in-out }
      .hide-scrollbar::-webkit-scrollbar { display:none } .hide-scrollbar { scrollbar-width:none }
      @media (prefers-reduced-motion: reduce) { .fade-up, .load-bar { animation: none } * { transition: none !important } }
    ` }} />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center px-6" role="status" aria-live="polite">
        <h1 className="text-sm text-stone-300 tracking-[0.25em] uppercase mb-8 text-center">Escolha, agende e relaxe</h1>
        <div className="w-40 h-0.5 bg-stone-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-stone-300 load-bar rounded-full" />
        </div>
        {css}
      </div>
    );
  }

  const Summary = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex justify-between gap-4 text-sm"><span className="text-stone-400">{label}</span><span className="text-stone-100 font-medium text-right">{value}</span></div>
  );

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-amber-500/30 pb-28 relative">
      {toast && (
        <div role="status" aria-live="polite" className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-stone-100 text-stone-900 px-6 py-3 rounded-full font-medium text-sm shadow-xl fade-up max-w-[90vw] text-center">{toast}</div>
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-950/85 backdrop-blur-sm" onClick={() => setProfileOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Perfil" className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-sm p-8 relative shadow-2xl fade-up" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Fechar perfil" autoFocus onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 p-3 text-stone-400 hover:text-white rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"><Icon name="close" /></button>
            <img src={CONFIG.AVATAR} className="w-20 h-20 rounded-full object-cover mb-6" alt="Foto de Thalyson" />
            <h2 className="text-2xl font-light text-stone-50 mb-1">Thalyson Massagens, SP Bela Vista</h2>
            <p className="text-amber-400 text-xs font-semibold mb-6">Terapeuta masculino</p>
            <div className="space-y-4 text-sm text-stone-300 leading-relaxed mb-8">
              <p>{greeting}. Meu trabalho é direto e focado no corpo masculino: usar o toque para desfazer o peso e a tensão da sua rotina.</p>
              <p className="flex items-start gap-3 bg-stone-950 p-4 rounded-2xl"><Icon name="map" size={18} className="mt-0.5 text-stone-400" /><span>Atendo em um refúgio seguro e discreto no Centro Histórico de SP, próximo ao Metrô Anhangabaú.</span></p>
            </div>
            <button onClick={forgetMe} className="w-full text-xs text-stone-400 hover:text-stone-200 underline underline-offset-4 min-h-[44px] mb-4">Apagar meus dados deste aparelho</button>
            <div className="pt-6 border-t border-stone-700 flex justify-center gap-6">
              <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-stone-300 hover:text-white min-h-[44px]"><Icon name="instagram" size={18} /> Instagram</a>
              <a href={CONFIG.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-stone-300 hover:text-white min-h-[44px]"><Icon name="star" size={18} /> Avaliações</a>
            </div>
          </div>
        </div>
      )}

      {promoOpen && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm" onClick={closePromo}>
          <div role="dialog" aria-modal="true" aria-labelledby="promo-title" className="bg-stone-900 border border-amber-400/40 rounded-3xl w-full max-w-sm p-7 shadow-2xl fade-up text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-semibold text-amber-400 mb-2">{greeting}</p>
            <h2 id="promo-title" className="text-2xl font-light text-stone-50 mb-3">Que tal fechar o dia relaxando?</h2>
            <p className="text-sm text-stone-300 leading-relaxed mb-5">Depois de um dia pesado, seu corpo agradece. Hoje você tem um cupom para agendar:</p>
            <div className="border border-dashed border-amber-400 rounded-2xl py-3 mb-6">
              <span className="text-xl font-semibold tracking-widest text-amber-300">{CONFIG.EVENING_COUPON}</span>
              <p className="text-xs text-stone-400 mt-1">{CONFIG.EVENING_LABEL}</p>
            </div>
            <button autoFocus onClick={acceptPromo} className={`${btnPrimary} w-full`}>Ativar cupom</button>
            <button onClick={closePromo} className="w-full min-h-[48px] mt-2 text-sm text-stone-400 hover:text-stone-200">Agora não</button>
          </div>
        </div>
      )}

      {step > 0 && (
        <header className="px-6 py-4 max-w-lg mx-auto flex justify-between items-center mb-6 sticky top-0 bg-stone-950/95 backdrop-blur-md z-40 border-b border-stone-800">
          <button onClick={() => { vibrate(10); setProfileOpen(true); }} className="flex items-center gap-3 text-left rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
            <img src={CONFIG.AVATAR} alt="" className="w-10 h-10 rounded-full object-cover" />
            <span><span className="block text-sm font-medium text-stone-100">Thalyson Massagens</span><span className="block text-xs text-stone-400">Ver perfil</span></span>
          </button>
          <div className="flex gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={Math.min(step, 3)} aria-label={`Passo ${Math.min(step, 3)} de 3`}>
            {[1, 2, 3].map((i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-amber-400' : 'w-2 bg-stone-700'}`} />)}
          </div>
        </header>
      )}

      <main className="px-6 max-w-lg mx-auto">
        {step === 0 && (
          <div className="flex flex-col justify-center min-h-[85vh] fade-up">
            <h1 className="text-4xl md:text-5xl font-light mb-12 leading-tight text-stone-50">O seu momento<br /><span className="text-stone-300">de pausa.</span></h1>
            <div className="space-y-4 mb-12">
              <div className="flex gap-4 p-6 bg-stone-900 rounded-3xl border border-stone-800"><Icon name="shield" className="text-amber-400 mt-0.5" size={22} /><p className="text-stone-300 text-sm leading-relaxed">{BACKEND_ON ? 'Sigilo e respeito total. Seu nome e horário ficam guardados só para segurar a vaga e vão para o meu WhatsApp pessoal.' : 'Sigilo e respeito total. Não guardo seus dados em nenhum servidor: o que você preenche fica só neste aparelho e segue direto para o meu WhatsApp pessoal quando você enviar.'}</p></div>
              <div className="flex gap-4 p-6 bg-stone-900 rounded-3xl border border-stone-800"><Icon name="lock" className="text-amber-400 mt-0.5" size={22} /><p className="text-stone-300 text-sm leading-relaxed">Atendimento estritamente para maiores de 18 anos, focado no relaxamento do corpo masculino.</p></div>
            </div>
            <button onClick={() => { vibrate(30); store.set('thaly_onboard_final', 'yes'); setStep(1); }} className="bg-stone-100 text-stone-950 min-h-[60px] w-full text-sm font-bold rounded-2xl active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2">Iniciar agendamento</button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-up pb-32">
            <p className="text-xs font-semibold text-amber-400 mb-2">Passo 1 de 3</p>
            <h1 className="text-3xl font-light mb-8 text-stone-50">Escolha o seu pacote</h1>
            <div className="space-y-4 mb-10" role="radiogroup" aria-label="Pacotes">
              {PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <button key={p.id} role="radio" aria-checked={on} onClick={() => { vibrate(15); set({ packageId: p.id }); }}
                    className={`w-full text-left p-6 rounded-3xl transition-all border focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${on ? 'bg-stone-900 border-amber-400 shadow-lg' : 'bg-stone-950 border-stone-700 hover:bg-stone-900'}`}>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className={`font-medium text-lg ${on ? 'text-stone-50' : 'text-stone-200'}`}>{p.title}</h3>
                      <div className="text-right shrink-0">
                        <span className="text-xs line-through text-stone-500 block">{money(p.originalPrice)}</span>
                        <span className={`font-semibold text-lg ${on ? 'text-amber-300' : 'text-stone-200'}`}>{money(p.price)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-stone-800 text-stone-200 inline-flex items-center gap-1"><Icon name="clock" size={12} /> {p.min} min</span>
                      {p.tags.map((t) => <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-md bg-stone-800 text-stone-300">{t}</span>)}
                    </div>
                    <p className="text-sm leading-relaxed text-stone-300">{p.desc}</p>
                  </button>
                );
              })}
              <div className="pt-6">
                <h3 className="text-sm font-semibold text-stone-200 mb-4">Adicionais</h3>
                <div className="flex flex-col gap-3">
                  {ADDONS.filter((a) => !(data.packageId === 'aparo_solo' && a.id === 'aparo')).map((a) => {
                    const on = !!data.addons[a.id];
                    return (
                      <button key={a.id} role="checkbox" aria-checked={on} onClick={() => { vibrate(15); set({ addons: { ...data.addons, [a.id]: !on } }); }}
                        className={`w-full p-5 text-sm rounded-2xl border flex justify-between items-center gap-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 ${on ? 'bg-stone-800 border-amber-400 text-stone-50' : 'bg-stone-950 border-stone-700 text-stone-300 hover:bg-stone-900'}`}>
                        <span className="flex items-center gap-3"><span className={`w-5 h-5 rounded-md border flex items-center justify-center ${on ? 'bg-amber-400 border-amber-400 text-stone-950' : 'border-stone-500'}`}>{on && <Icon name="check" size={14} />}</span>{a.label}</span>
                        <span className="font-medium">+ {money(a.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="fixed bottom-0 left-0 w-full p-4 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 z-50">
              <div className="max-w-lg mx-auto flex gap-6 items-center px-2">
                <div className="flex-1"><p className="text-xs text-stone-400">Duração: {invoice.dur} min</p><p className="text-2xl font-light text-stone-50">{money(invoice.base + invoice.addonsTotal)}</p></div>
                <button onClick={() => { vibrate(30); setStep(2); }} className={btnPrimary}>Continuar</button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <p className="text-xs font-semibold text-amber-400 mb-2">Passo 2 de 3</p>
            <h1 className="text-3xl font-light mb-8 text-stone-50">Agendamento</h1>
            <div className="space-y-9 mb-10">
              <div>
                <label htmlFor="nm" className={labelCls}>Como devo te chamar?</label>
                <input id="nm" autoComplete="given-name" type="text" value={data.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="Seu nome" maxLength={60} aria-invalid={touched && !!errors.name} />
                {touched && errors.name && <p className="text-sm text-red-300 mt-2" role="alert">{errors.name}</p>}
                <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              </div>

              <div>
                <span className={labelCls}>Local da sessão</span>
                <div className="grid grid-cols-2 gap-3" role="radiogroup">
                  {([['studio', 'No meu espaço'], ['home', 'Vou até você']] as const).map(([v, l]) => (
                    <button key={v} role="radio" aria-checked={data.locType === v} onClick={() => set({ locType: v })} className={`${chipBase} text-sm px-3 ${data.locType === v ? chipOn : chipOff}`}>{l}</button>
                  ))}
                </div>
                {isHome && <p className="text-xs text-stone-400 mt-3">Horários de pico no seu endereço têm taxa de {money(CONFIG.PEAK_FEE)}. Pedimos mais antecedência para o deslocamento.</p>}
              </div>

              {!isHome ? (
                <p className="text-sm text-stone-300 bg-stone-900 p-6 rounded-3xl border border-stone-700 leading-relaxed">
                  A suíte fica no <strong className="text-stone-50">Centro Histórico, na Bela Vista (próximo ao Metrô Anhangabaú)</strong>. O endereço exato é enviado junto com a confirmação.
                </p>
              ) : (
                <div className="space-y-4 fade-up">
                  <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder="CEP (preenche o endereço)" aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className={inputCls} />
                  <input type="text" autoComplete="street-address" placeholder="Rua ou Avenida" aria-label="Rua ou Avenida" maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className={inputCls} />
                  <div className="flex gap-3">
                    <input ref={numberRef} type="text" inputMode="numeric" placeholder="Nº" aria-label="Número" maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className={`${inputCls} w-1/3`} />
                    <input type="text" placeholder="Complemento" aria-label="Complemento" maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className={`${inputCls} w-2/3`} />
                  </div>
                  <input type="text" placeholder="Bairro" aria-label="Bairro" maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className={inputCls} />
                  {touched && errors.address && <p className="text-sm text-red-300" role="alert">{errors.address}</p>}
                </div>
              )}

              <div>
                <span className={labelCls}>Data</span>
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x hide-scrollbar -mx-6 px-6" role="radiogroup" aria-label="Datas">
                  {days.map(({ d, i }) => {
                    const sel = sameDay(data.date, d);
                    return (
                      <button key={dateKey(d)} role="radio" aria-checked={sel} onClick={() => { set({ date: d, time: '' }); setBusy(null); }} className={`${chipBase} shrink-0 snap-start w-[74px] py-3 flex flex-col items-center ${sel ? chipOn : chipOff}`}>
                        <span className="text-xs font-semibold capitalize">{dayLabel(d, i)}</span>
                        <span className="text-2xl font-light">{d.getDate()}</span>
                        <span className={`text-xs ${sel ? 'text-stone-600' : 'text-stone-400'}`}>{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                      </button>
                    );
                  })}
                </div>
                {touched && errors.date && <p className="text-sm text-red-300 mt-2" role="alert">{errors.date}</p>}
              </div>

              {data.date && (
                <div className="fade-up">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-xs font-semibold text-stone-300">Horário de início</span>
                    <span className="text-xs text-stone-400" aria-live="polite">{busyLoading ? 'Verificando agenda…' : `Sessão de ${invoice.dur} min`}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Horários">
                    {slots.map(({ t, status }) => {
                      const sel = data.time === t;
                      const ok = status === 'ok';
                      const peak = isHome && PEAK_HOURS.includes(t);
                      return (
                        <button key={t} role="radio" aria-checked={sel} disabled={!ok} aria-label={`${t}${ok ? '' : ', indisponível'}${peak ? ', horário de pico' : ''}`}
                          onClick={() => { vibrate(15); set({ time: t }); }}
                          className={`${chipBase} py-3 flex flex-col items-center justify-center ${sel ? chipOn : ok ? chipOff : 'bg-stone-950 border-stone-800 text-stone-600 line-through cursor-not-allowed'}`}>
                          <span className="text-sm font-medium">{t}</span>
                          {peak && ok && <span className={`text-[11px] font-semibold ${sel ? 'text-amber-800' : 'text-amber-400'}`}>Pico +{money(CONFIG.PEAK_FEE).replace(',00', '')}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {availableCount === 0 && <p className="text-sm text-stone-300 text-center py-6">Sem horários livres neste dia. Tente outra data.</p>}
                  {data.time && <p className="text-sm text-emerald-300 mt-4 flex items-center gap-2"><Icon name="check" size={16} /> Das {data.time} às {endTime}</p>}
                  {touched && errors.time && <p className="text-sm text-red-300 mt-2" role="alert">{errors.time}</p>}
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={() => setStep(1)} className={`${btnGhost} w-1/3`}>Voltar</button>
              <button onClick={() => { if (step2Valid) { vibrate(30); setStep(3); } else { vibrate(50); setTouched(true); showToast('Complete os campos destacados'); } }} className={`${btnPrimary} flex-1`}>Revisar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <p className="text-xs font-semibold text-amber-400 mb-2">Passo 3 de 3</p>
            <h1 className="text-3xl font-light mb-8 text-stone-50">Resumo</h1>
            <div className="space-y-8 mb-10">
              <div className="p-6 bg-stone-900 rounded-3xl border border-stone-700 space-y-3">
                <Summary label="Pacote" value={pkg.title} />
                <Summary label="Data" value={data.date?.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} />
                <Summary label="Horário" value={`${data.time} – ${endTime}`} />
                <Summary label="Local" value={isHome ? `${data.street}, ${data.number}` : 'No espaço (Bela Vista)'} />
                <button onClick={() => setStep(2)} className="text-sm text-amber-300 underline underline-offset-4 min-h-[44px]">Alterar data, horário ou local</button>
              </div>

              <div className="p-6 bg-stone-900 rounded-3xl border border-stone-700">
                <div className="space-y-4 mb-6">
                  <Summary label="Pacote escolhido" value={money(invoice.base)} />
                  {invoice.addonsTotal > 0 && <Summary label="Adicionais" value={`+${money(invoice.addonsTotal)}`} />}
                  {invoice.reqFee > 0 && <Summary label="Pedido específico" value={`+${money(invoice.reqFee)}`} />}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm py-3 border-y border-stone-700 text-amber-300 font-medium">
                      <span className="flex items-center gap-2"><Icon name="check" size={16} />{coupon.applied ? `Cupom ${coupon.applied}` : 'Presente de 1ª sessão'}</span>
                      <span>-{money(invoice.discount)}</span>
                    </div>
                  )}
                  {invoice.peakFee > 0 && <Summary label="Deslocamento / pico" value={`+${money(invoice.peakFee)}`} />}
                  {invoice.pixDiscount > 0 && <div className="flex justify-between text-sm text-amber-300"><span>Desconto Pix (3%)</span><span className="font-medium">-{money(invoice.pixDiscount)}</span></div>}
                </div>
                <div className="flex justify-between items-end pt-5 border-t border-stone-700">
                  <span className="text-sm text-stone-300">Total</span>
                  <span className="text-4xl font-light text-stone-50">{money(invoice.total)}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
                  <div className="bg-stone-950 rounded-2xl p-3"><p className="text-stone-400 text-xs">Sinal agora</p><p className="font-semibold text-amber-300">{money(invoice.sinal)}</p></div>
                  <div className="bg-stone-950 rounded-2xl p-3"><p className="text-stone-400 text-xs">Após a sessão</p><p className="font-semibold text-stone-100">{money(invoice.rest)}</p></div>
                </div>
              </div>

              {!coupon.applied && (
                <div>
                  <label htmlFor="cp" className={labelCls}>Possui cupom?</label>
                  <div className="flex gap-2">
                    <input id="cp" type="text" autoCapitalize="characters" placeholder="Código" value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className={`${inputCls} flex-1 uppercase ${coupon.error ? 'border-red-400' : ''}`} />
                    <button onClick={applyCoupon} className={btnGhost}>Aplicar</button>
                  </div>
                  {coupon.error && <p className="text-sm text-red-300 mt-2" role="alert">{coupon.error}</p>}
                </div>
              )}

              <div>
                <label htmlFor="rq" className={labelCls}>Pedido específico ou fetiche? (+ {money(CONFIG.FETISH_FEE)})</label>
                <input id="rq" type="text" placeholder="Opcional: algum detalhe ou vontade para a sessão" maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className={inputCls} />
                <p className="text-xs text-stone-400 mt-3 leading-relaxed">Pedido avaliado no momento do atendimento. Se inviável, o valor não é cobrado.</p>
              </div>

              <div>
                <span className={labelCls}>Pagamento do restante</span>
                <div className="grid grid-cols-3 gap-3" role="radiogroup">
                  {[['pix', 'Pix (-3%)'], ['card', 'Cartão até 12x'], ['cash', 'Dinheiro']].map(([id, l]) => (
                    <button key={id} role="radio" aria-checked={data.payment === id} onClick={() => selectPayment(id)} className={`${chipBase} text-xs font-semibold px-2 ${data.payment === id ? chipOn : chipOff}`}>{l}</button>
                  ))}
                </div>
                {data.payment === 'card' && <p className="text-xs text-stone-400 mt-3">Taxas do cartão são combinadas pelo WhatsApp.</p>}
              </div>

              <label className="flex items-start gap-3 text-sm text-stone-300 leading-relaxed cursor-pointer min-h-[44px]">
                <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-1 w-5 h-5 accent-amber-400 shrink-0" />
                <span>Quero receber lembretes e novidades pelo WhatsApp. Posso pedir para parar a qualquer momento.</span>
              </label>

              <div className="bg-amber-950/40 border border-amber-700/50 p-6 rounded-3xl">
                <p className="text-sm text-amber-100 leading-relaxed text-center">Para confirmar o horário, envie um sinal de <strong className="text-amber-300">{money(invoice.sinal)} via Pix</strong>. O restante é acertado após a sessão.</p>
                <button onClick={copyPix} className="mt-4 mx-auto flex items-center gap-2 text-sm font-semibold text-amber-200 underline underline-offset-4 min-h-[44px]"><Icon name="copy" size={16} /> Copiar chave Pix (CNPJ)</button>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={() => setStep(2)} className={`${btnGhost} w-1/4`}>Voltar</button>
              <button onClick={finishBooking} disabled={submitting} aria-disabled={!data.payment} className={`flex-1 min-h-[56px] text-sm font-bold rounded-xl flex items-center justify-center text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${data.payment && !submitting ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-stone-800 text-stone-500 cursor-not-allowed'}`}>{submitting ? 'Reservando horário…' : 'Concluir no WhatsApp'}</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fade-up flex flex-col items-center justify-center min-h-[60vh] text-center mt-10">
            <div className="w-20 h-20 bg-emerald-900/40 rounded-full flex items-center justify-center mb-6 border border-emerald-600/60"><Icon name="check" size={32} className="text-emerald-400" /></div>
            <h1 className="text-3xl font-light mb-4 text-stone-50">Tudo pronto!</h1>
            <p className="text-sm text-stone-300 leading-relaxed mb-8 max-w-sm">
              Sua solicitação foi gerada. Se o WhatsApp não abriu, use o botão abaixo.<br /><br />
              <strong className="text-amber-300 font-medium">Envie o comprovante do sinal ({money(invoice.sinal)}) na conversa para confirmar.</strong>
            </p>
            <div className="w-full max-w-xs space-y-3">
              <a href={sentLink || whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={() => vibrate(15)} className={`${btnPrimary} flex items-center justify-center w-full`}>Reenviar mensagem</a>
              <button onClick={copyPix} className={`${btnGhost} w-full flex items-center justify-center gap-2`}><Icon name="copy" size={16} /> Copiar chave Pix</button>
              <button onClick={downloadICS} className={`${btnGhost} w-full flex items-center justify-center gap-2`}><Icon name="cal" size={16} /> Adicionar à agenda</button>
              <button onClick={downloadReminder} className={`${btnGhost} w-full flex items-center justify-center gap-2`}><Icon name="clock" size={16} /> Me lembrar de relaxar em 14 dias</button>
              <button onClick={resetFlow} className="w-full min-h-[48px] text-sm text-stone-400 hover:text-stone-200 underline underline-offset-4">Voltar ao início</button>
            </div>
          </div>
        )}
      </main>
      {css}
    </div>
  );
}
