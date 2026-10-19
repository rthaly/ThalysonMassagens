import { useState, useEffect, useMemo, useRef, memo, type ReactNode, type CSSProperties } from 'react';

/* ==========================================================================
   CONFIGURAÇÃO DOS ESTÚDIOS (FEMININO & MASCULINO)
   ========================================================================== */
interface StudioConfig {
  NOME_PROFISSIONAL: string;
  GENERO: 'feminino' | 'masculino';
  SUBTITULO: string;
  BIO: string;
  PHONE: string;
  PIX_KEY: string;
  INSTAGRAM: string;
  AVATAR: string;
  COVER_IMAGE: string;
  TEMA: 'pinho' | 'ameixa' | 'oceano' | 'grafite' | 'bronze';
  PREFIXO_STORAGE: string;
  CUPONS: Record<string, { label: string; value: number }>;
  SIGNAL_AMOUNT: number;
  FIRST_TIME_DISCOUNT: number;
  PEAK_FEE: number;
  PIX_DISCOUNT: number;
  OPEN_MIN: number;
  LAST_END_MIN: number;
  SLOT_STEP: number;
  BUFFER_STUDIO: number;
  BUFFER_HOME: number;
  MIN_LEAD_STUDIO: number;
  MIN_LEAD_HOME: number;
  DAYS_AHEAD: number;
  DAYS_OFF: number[];
  BLOQUEIOS: Record<string, string[]>;
  PACKAGES: { id: string; title: string; originalPrice: number; price: number; min: number; tags: string[]; desc: string }[];
  ADDONS: { id: string; label: string; price: number }[];
}

const STUDIOS: Record<'feminino' | 'masculino', StudioConfig> = {
  feminino: {
    NOME_PROFISSIONAL: 'Marina Albuquerque',
    GENERO: 'feminino',
    SUBTITULO: 'Massoterapia e estética avançada',
    BIO: 'Terapias manuais com foco em resultado real: alívio de dores, relaxamento profundo e autocuidado. Atendimento no studio ou em domicílio com estrutura completa.',
    PHONE: '5511999999999',
    PIX_KEY: '123.456.789-00',
    INSTAGRAM: 'https://www.instagram.com/',
    AVATAR: '',
    COVER_IMAGE: '',
    TEMA: 'pinho',
    PREFIXO_STORAGE: 'agenda_marina',
    CUPONS: {
      '97f3d191265f088b2c6c27a1007e5ea39bb59af039bb622273198ef4249fa2ce': { label: 'Boas-vindas', value: 15 },
      '6750db4abc5d9f40baba4b6284cfbfb5ff8e8e2573a8625ae936d4a6e6515e6d': { label: 'VIP', value: 0.15 },
    },
    SIGNAL_AMOUNT: 50,
    FIRST_TIME_DISCOUNT: 20,
    PEAK_FEE: 35,
    PIX_DISCOUNT: 0.05,
    OPEN_MIN: 9 * 60,
    LAST_END_MIN: 20 * 60,
    SLOT_STEP: 30,
    BUFFER_STUDIO: 30,
    BUFFER_HOME: 60,
    MIN_LEAD_STUDIO: 120,
    MIN_LEAD_HOME: 240,
    DAYS_AHEAD: 14,
    DAYS_OFF: [0],
    BLOQUEIOS: {},
    PACKAGES: [
      { id: 'relaxante', title: 'Massagem Relaxante', originalPrice: 190, price: 160, min: 60, tags: ['Aromaterapia', 'Corpo inteiro'], desc: 'Movimentos contínuos com óleos essenciais para soltar a tensão do dia a dia.' },
      { id: 'drenagem', title: 'Drenagem Linfática', originalPrice: 220, price: 180, min: 60, tags: ['Redução de inchaço', 'Modeladora'], desc: 'Toques leves que estimulam o sistema linfático e reduzem a retenção.' },
      { id: 'pedras', title: 'Pedras Quentes', originalPrice: 260, price: 220, min: 90, tags: ['Termoterapia', 'Alívio profundo'], desc: 'O calor das pedras vulcânicas relaxa a musculatura profunda.' },
      { id: 'spa_facial', title: 'Spa Facial', originalPrice: 180, price: 140, min: 50, tags: ['Limpeza', 'Hidratação'], desc: 'Limpeza, esfoliação suave e máscara nutritiva para devolver viço à pele.' },
    ],
    ADDONS: [
      { id: 'esfoliacao', label: 'Esfoliação corporal', price: 50 },
      { id: 'escalda', label: 'Escalda-pés com ervas', price: 40 },
    ],
  },
  masculino: {
    NOME_PROFISSIONAL: 'Marcos Vinícius',
    GENERO: 'masculino',
    SUBTITULO: 'Recovery & Massoterapia Performance',
    BIO: 'Atendimento especializado em liberação miofascial, recuperação pós-treino e alívio de dores tensionais por estresse ou carga física.',
    PHONE: '5511888888888',
    PIX_KEY: '987.654.321-11',
    INSTAGRAM: 'https://www.instagram.com/',
    AVATAR: '',
    COVER_IMAGE: '',
    TEMA: 'grafite',
    PREFIXO_STORAGE: 'agenda_marcos',
    CUPONS: {
      '97f3d191265f088b2c6c27a1007e5ea39bb59af039bb622273198ef4249fa2ce': { label: 'Performance', value: 20 },
    },
    SIGNAL_AMOUNT: 60,
    FIRST_TIME_DISCOUNT: 25,
    PEAK_FEE: 40,
    PIX_DISCOUNT: 0.05,
    OPEN_MIN: 8 * 60,
    LAST_END_MIN: 21 * 60,
    SLOT_STEP: 30,
    BUFFER_STUDIO: 30,
    BUFFER_HOME: 60,
    MIN_LEAD_STUDIO: 120,
    MIN_LEAD_HOME: 240,
    DAYS_AHEAD: 14,
    DAYS_OFF: [0],
    BLOQUEIOS: {},
    PACKAGES: [
      { id: 'miofascial', title: 'Liberação Miofascial', originalPrice: 210, price: 180, min: 60, tags: ['Atletas', 'Mobilidade'], desc: 'Foco em liberar aderências musculares, melhorar amplitude e eliminar dores agudas.' },
      { id: 'sport', title: 'Massagem Desportiva', originalPrice: 230, price: 190, min: 60, tags: ['Pós-treino', 'Recuperação'], desc: 'Manobras profundas e aceleradas para recuperação de fadiga muscular intensa.' },
      { id: 'anti_stress', title: 'Deep Tissue Anti-Stress', originalPrice: 250, price: 210, min: 75, tags: ['Tensão profunda', 'Escritório'], desc: 'Alívio focado em regiões críticas como cervical, lombar e trapézio.' },
      { id: 'recovery', title: 'Full Body Recovery', originalPrice: 300, price: 250, min: 90, tags: ['Completa', 'Desintoxicação'], desc: 'Protocolo completo combinando liberação, drenagem e relaxamento muscular.' },
    ],
    ADDONS: [
      { id: 'ventosa', label: 'Aplicação de Ventosas', price: 45 },
      { id: 'percussao', label: 'Pistola Percussiva Pro', price: 40 },
    ],
  },
};

const THEMES = {
  pinho: { brand: '#23403A', dark: '#162B27', accent: '#B08D57', paper: '#F3F5F2', soft: '#E3EAE5' },
  ameixa: { brand: '#4A2C4A', dark: '#321D32', accent: '#C9A27A', paper: '#F7F3F6', soft: '#EBE0EA' },
  oceano: { brand: '#1F3B57', dark: '#14283C', accent: '#C7A97B', paper: '#F2F5F8', soft: '#DFE8F0' },
  grafite: { brand: '#1E2229', dark: '#111317', accent: '#D4AF37', paper: '#F5F6F8', soft: '#E6E8ED' },
  bronze: { brand: '#3A2E2B', dark: '#241C1A', accent: '#D99B6C', paper: '#F8F6F4', soft: '#ECE7E2' },
};

const PEAK_HOURS = ['18:00', '18:30', '19:00', '19:30', '20:00'];

/* ==========================================================================
   2. UTILITÁRIOS E SEGURANÇA
   ========================================================================== */
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const money = (v: number) => brl.format(v).replace(/\u00a0/g, ' ');
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate?.(p); } catch (e) {} };
const store = {
  get: (prefix: string, k: string): string | null => { try { return localStorage.getItem(`${prefix}_${k}`); } catch (e) { return null; } },
  set: (prefix: string, k: string, v: string) => { try { localStorage.setItem(`${prefix}_${k}`, v); } catch (e) {} },
};

const clean = (t: string, max = 140) =>
  t.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/[*_~`]+/g, '').replace(/https?:\/\/\S+/gi, '[link removido]').replace(/\s+/g, ' ').trim().slice(0, max);
const cleanName = (t: string) => t.replace(/[^\p{L}\p{M}\s'.-]/gu, '').replace(/\s+/g, ' ').slice(0, 60);
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const safeUrl = (u: string) => { try { return new URL(u).protocol === 'https:' ? u : '#'; } catch (e) { return '#'; } };

const sha256 = async (s: string) => {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
};

const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const dayLabel = (d: Date, i: number) => (i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''));
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } };

const ICONS = {
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  check: 'M20 6L9 17l-5-5',
  close: 'M18 6L6 18 M6 6l12 12',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  lock: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
  chevronLeft: 'M15 18l-6-6 6-6',
  userSwitch: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75',
};
type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICONS[name]} />
  </svg>
));

const Avatar = ({ name, url, size = 48 }: { name: string; url?: string; size?: number }) => {
  const [failed, setFailed] = useState(false);
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  if (url && !failed) {
    return <img src={url} alt="" width={size} height={size} onError={() => setFailed(true)} referrerPolicy="no-referrer" className="rounded-full object-cover shrink-0 shadow-md" style={{ width: size, height: size }} />;
  }
  return (
    <span className="rounded-full shrink-0 inline-flex items-center justify-center font-serif font-semibold bg-[var(--brand)] text-[var(--paper)] shadow-md" style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">{initials}</span>
  );
};

const inputCls = 'w-full bg-white border border-stone-300 rounded-xl px-4 min-h-[56px] text-[16px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 transition';
const labelCls = 'block text-[15px] font-semibold text-stone-900 mb-2';
const errCls = 'text-[14px] font-medium text-red-700 mt-2';
const chipOn = 'bg-[var(--brand)] text-white border-[var(--brand)] shadow-sm';
const chipOff = 'bg-white border-stone-300 text-stone-800 hover:border-stone-500';
const btnPrimary = 'min-h-[56px] px-8 text-[16px] font-semibold rounded-xl bg-[var(--brand)] text-white hover:bg-[var(--dark)] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg';

/* ==========================================================================
   3. APLICAÇÃO PRINCIPAL
   ========================================================================== */
interface BookingData {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addons: Record<string, boolean>;
}

export default function App() {
  const [studioType, setStudioType] = useState<'feminino' | 'masculino'>('feminino');
  const CONFIG = STUDIOS[studioType];

  const [step, setStep] = useState(0);
  const [isReturning, setIsReturning] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [touched, setTouched] = useState(false);
  const [coupon, setCoupon] = useState({ input: '', applied: '', value: 0, error: '', open: false });
  const [now, setNow] = useState(() => new Date());
  const [ref] = useState(() => Math.random().toString(36).slice(2, 7).toUpperCase());
  const numberRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cepAbort = useRef<AbortController | null>(null);
  const attempts = useRef({ fails: 0, lockUntil: 0 });

  const [data, setData] = useState<BookingData>({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
    date: null, time: '', req: '', payment: '', packageId: CONFIG.PACKAGES[0].id, addons: {}
  });

  const set = (patch: Partial<BookingData>) => setData((p) => ({ ...p, ...patch }));

  // Ao trocar de studio, reseta pacote padrão e dados dependentes
  const switchStudio = (type: 'feminino' | 'masculino') => {
    vibrate(20);
    setStudioType(type);
    setData({
      name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
      date: null, time: '', req: '', payment: '', packageId: STUDIOS[type].PACKAGES[0].id, addons: {}
    });
    setCoupon({ input: '', applied: '', value: 0, error: '', open: false });
    setStep(0);
  };

  const theme = THEMES[CONFIG.TEMA] || THEMES.pinho;
  const themeVars = { '--brand': theme.brand, '--dark': theme.dark, '--accent': theme.accent, '--paper': theme.paper, '--soft': theme.soft } as CSSProperties;

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3200);
  };

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  useEffect(() => { if (store.get(CONFIG.PREFIXO_STORAGE, 'ret') === 'yes') setIsReturning(true); else setIsReturning(false); }, [studioType, CONFIG.PREFIXO_STORAGE]);
  useEffect(() => { if (step > 0) window.scrollTo({ top: 0 }); }, [step]);
  useEffect(() => { document.title = `${CONFIG.NOME_PROFISSIONAL} · Agendamento`; }, [CONFIG.NOME_PROFISSIONAL]);

  const pkg = useMemo(() => CONFIG.PACKAGES.find((p) => p.id === data.packageId) || CONFIG.PACKAGES[0], [CONFIG.PACKAGES, data.packageId]);
  const isHome = data.locType === 'home';

  const invoice = useMemo(() => {
    const activeAddons = CONFIG.ADDONS.filter((a) => data.addons[a.id]);
    const addonsTotal = activeAddons.reduce((s, a) => s + a.price, 0);
    const base = pkg.price + addonsTotal;
    const peakFee = isHome && PEAK_HOURS.includes(data.time) ? CONFIG.PEAK_FEE : 0;
    let discount = 0;
    if (coupon.applied) discount = coupon.value < 1 ? Math.floor(base * coupon.value) : coupon.value;
    else if (!isReturning) discount = CONFIG.FIRST_TIME_DISCOUNT;
    discount = Math.min(discount, base);
    const afterDiscount = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.ceil(afterDiscount * CONFIG.PIX_DISCOUNT) : 0;
    const total = afterDiscount - pixDiscount + peakFee;
    const sinal = Math.min(CONFIG.SIGNAL_AMOUNT, total);
    return { base: pkg.price, addonsTotal, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur: pkg.min, activeAddons };
  }, [CONFIG.ADDONS, CONFIG.FIRST_TIME_DISCOUNT, CONFIG.PEAK_FEE, CONFIG.PIX_DISCOUNT, CONFIG.SIGNAL_AMOUNT, data.addons, data.time, data.payment, pkg, isHome, isReturning, coupon.applied, coupon.value]);

  const todayKey = dateKey(now);
  const days = useMemo(() => {
    const out: { d: Date; i: number }[] = [];
    for (let i = 0; out.length < CONFIG.DAYS_AHEAD && i < 40; i++) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
      if (!CONFIG.DAYS_OFF.includes(d.getDay())) out.push({ d, i });
    }
    return out;
  }, [CONFIG.DAYS_AHEAD, CONFIG.DAYS_OFF, todayKey]);

  const slots = useMemo(() => {
    if (!data.date) return [];
    const buffer = isHome ? CONFIG.BUFFER_HOME : CONFIG.BUFFER_STUDIO;
    const lead = isHome ? CONFIG.MIN_LEAD_HOME : CONFIG.MIN_LEAD_STUDIO;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = sameDay(data.date, now);
    const blocks = (CONFIG.BLOQUEIOS[dateKey(data.date)] || []).map((r) => { const [a, b] = r.split('-'); return [toMin(a), toMin(b)]; });
    const out: { t: string; status: 'ok' | 'past' | 'busy' }[] = [];
    for (let m = CONFIG.OPEN_MIN; m + invoice.dur <= CONFIG.LAST_END_MIN; m += CONFIG.SLOT_STEP) {
      let status: 'ok' | 'past' | 'busy' = 'ok';
      if (today && m < nowMin + lead) status = 'past';
      else if (blocks.some(([a, b]) => m < b + buffer && m + invoice.dur + buffer > a)) status = 'busy';
      out.push({ t: fromMin(m), status });
    }
    return out;
  }, [CONFIG.BLOQUEIOS, CONFIG.BUFFER_HOME, CONFIG.BUFFER_STUDIO, CONFIG.LAST_END_MIN, CONFIG.MIN_LEAD_HOME, CONFIG.MIN_LEAD_STUDIO, CONFIG.OPEN_MIN, CONFIG.SLOT_STEP, data.date, isHome, invoice.dur, now]);

  const availableCount = slots.filter((s) => s.status === 'ok').length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';
  const periods = [
    { label: 'Manhã', items: slots.filter((s) => toMin(s.t) < 720) },
    { label: 'Tarde', items: slots.filter((s) => toMin(s.t) >= 720 && toMin(s.t) < 1080) },
    { label: 'Noite', items: slots.filter((s) => toMin(s.t) >= 1080) },
  ].filter((p) => p.items.length);

  const errors = {
    name: data.name.trim().split(' ').filter(Boolean).length < 2 ? 'Informe nome e sobrenome.' : '',
    date: !data.date ? 'Escolha uma data.' : '',
    time: data.date && !data.time ? 'Escolha um horário.' : '',
    address: isHome && !(data.street.trim() && data.number.trim() && data.bairro.trim()) ? 'Preencha rua, número e bairro.' : '',
  };
  const step2Valid = !errors.name && !errors.date && !errors.time && !errors.address;

  const applyCoupon = async () => {
    const code = coupon.input.trim().toUpperCase().slice(0, 30);
    if (!code) return;
    if (Date.now() < attempts.current.lockUntil) { setCoupon((c) => ({ ...c, error: 'Muitas tentativas. Aguarde 1 minuto.' })); return; }
    const found = CONFIG.CUPONS[await sha256(code)];
    if (found) {
      attempts.current.fails = 0;
      vibrate([20, 40]); setCoupon({ input: '', applied: found.label, value: found.value, error: '', open: false }); showToast('Cupom aplicado.');
    } else {
      attempts.current.fails += 1;
      if (attempts.current.fails >= 5) { attempts.current = { fails: 0, lockUntil: Date.now() + 60000 }; }
      vibrate(50); setCoupon((c) => ({ ...c, error: 'Cupom inválido ou expirado.' }));
    }
  };

  const copyPix = async () => showToast((await copyText(CONFIG.PIX_KEY)) ? 'Chave Pix copiada.' : `Chave Pix: ${CONFIG.PIX_KEY}`);

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length !== 9) return;
    cepAbort.current?.abort();
    const ctl = new AbortController(); cepAbort.current = ctl;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${masked.replace(/\D/g, '')}/json/`, { signal: ctl.signal, referrerPolicy: 'no-referrer' });
      if (!res.ok) throw new Error('bad');
      const j = await res.json();
      if (j && !j.erro) {
        setData((p) => ({ ...p, street: clean(String(j.logradouro || ''), 100) || p.street, bairro: clean(String(j.bairro || ''), 60) || p.bairro }));
        setTimeout(() => numberRef.current?.focus(), 150);
      } else showToast('CEP não encontrado. Preencha o endereço manualmente.');
    } catch (e) { if ((e as Error).name !== 'AbortError') showToast('Não foi possível buscar o CEP.'); }
  };

  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    const loc = !isHome
      ? 'Local: Studio'
      : `Atendimento em domicílio\nEndereço: ${clean(data.street, 100)}, ${clean(data.number, 10)}${data.comp ? ' - ' + clean(data.comp, 40) : ''} - ${clean(data.bairro, 60)}`;
    let t = `Olá, ${CONFIG.NOME_PROFISSIONAL.split(' ')[0]}! Quero confirmar meu agendamento (ref. ${ref}).\n\n`;
    t += `*Nome:* ${clean(data.name, 60)}\n*Dia e hora:* ${dStr}, ${data.time} às ${endTime}\n${loc}\n\n`;
    t += `*Sessão (${invoice.dur} min):* ${pkg.title}\n`;
    invoice.activeAddons.forEach((a) => (t += `Adicional: ${a.label}\n`));
    if (data.req.trim()) t += `Observação: "${clean(data.req)}"\n`;
    t += `\n*Total:* ${money(invoice.total)}\n*Sinal via Pix:* ${money(invoice.sinal)}\n*Restante no dia:* ${money(invoice.rest)} (${{ pix: 'Pix', card: 'cartão', cash: 'dinheiro' }[data.payment] || ''})\n\n`;
    t += 'Vou enviar o comprovante do sinal em seguida.';
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const openWhatsapp = () => {
    const w = window.open(whatsappLink(), '_blank');
    if (w) w.opener = null; else window.location.href = whatsappLink();
  };

  const finishBooking = () => {
    if (!data.payment) { vibrate(50); setTouched(true); showToast('Escolha como vai pagar o restante.'); return; }
    if (!data.date || !step2Valid) return;
    store.set(CONFIG.PREFIXO_STORAGE, 'ret', 'yes');
    vibrate([30, 50]);
    openWhatsapp();
    setStep(4);
  };

  const restart = () => { setData({ ...data, date: null, time: '', payment: '', req: '', addons: {} }); setCoupon({ input: '', applied: '', value: 0, error: '', open: false }); setTouched(false); setStep(1); };

  const goStep3 = () => {
    if (step2Valid) { vibrate(30); setStep(3); return; }
    vibrate(50); setTouched(true); showToast('Falta preencher alguns campos.');
    setTimeout(() => document.querySelector('[data-err]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  };

  const css = (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&display=swap');
      body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background: var(--paper); color: #1c1917; -webkit-tap-highlight-color: transparent; }
      .font-serif { font-family: 'Playfair Display', Georgia, serif; }
      @keyframes rise { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
      @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
      .rise { animation: rise .4s cubic-bezier(.16,1,.3,1) both; }
      .fade { animation: fade .25s ease both; }
      .hide-scrollbar::-webkit-scrollbar { display: none } .hide-scrollbar { scrollbar-width: none }
      button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
    ` }} />
  );

  return (
    <div className="min-h-screen text-stone-900 relative selection:bg-[var(--accent)] selection:text-white pb-12" style={{ ...themeVars, background: 'var(--paper)' }}>
      {toast && <div role="status" aria-live="polite" className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-stone-900 text-white px-6 py-3.5 rounded-xl font-medium text-[15px] shadow-2xl rise max-w-[90vw] text-center">{toast}</div>}

      {/* Barra de Demonstração de Versões (Feminino vs Masculino) */}
      <div className="bg-stone-900 text-stone-300 px-4 py-2 text-xs flex flex-wrap justify-between items-center gap-3 border-b border-stone-800">
        <span className="flex items-center gap-1.5 font-medium text-stone-400">
          <Icon name="userSwitch" size={14} /> Modo de Demonstração:
        </span>
        <div className="inline-flex bg-stone-800 p-1 rounded-lg gap-1">
          <button
            onClick={() => switchStudio('feminino')}
            className={`px-3 py-1 rounded-md font-medium transition ${studioType === 'feminino' ? 'bg-[var(--brand)] text-white shadow' : 'hover:text-white'}`}>
            Studio Feminino (Marina)
          </button>
          <button
            onClick={() => switchStudio('masculino')}
            className={`px-3 py-1 rounded-md font-medium transition ${studioType === 'masculino' ? 'bg-[var(--brand)] text-white shadow' : 'hover:text-white'}`}>
            Studio Masculino (Marcos)
          </button>
        </div>
      </div>

      {profileOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-sm fade" onClick={() => setProfileOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Perfil" className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-7 rise shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <Avatar name={CONFIG.NOME_PROFISSIONAL} url={CONFIG.AVATAR} size={72} />
              <button aria-label="Fechar" autoFocus onClick={() => setProfileOpen(false)} className="p-3 -m-2 rounded-full hover:bg-stone-100"><Icon name="close" /></button>
            </div>
            <h2 className="text-2xl font-serif font-semibold">{CONFIG.NOME_PROFISSIONAL}</h2>
            <p className="text-[var(--brand)] font-medium mb-4">{CONFIG.SUBTITULO}</p>
            <p className="text-stone-700 leading-relaxed mb-6">{CONFIG.BIO}</p>
            <a href={safeUrl(CONFIG.INSTAGRAM)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 font-semibold bg-stone-100 hover:bg-stone-200 min-h-[52px] rounded-xl transition text-stone-900"><Icon name="instagram" /> Ver Instagram</a>
          </div>
        </div>
      )}

      {step > 0 && step < 4 && (
        <header className="sticky top-0 z-40 bg-[var(--paper)]/90 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-lg mx-auto px-5 py-3 flex justify-between items-center">
            <button onClick={() => setProfileOpen(true)} className="flex items-center gap-3 text-left rounded-xl group" aria-label="Abrir perfil">
              <Avatar name={CONFIG.NOME_PROFISSIONAL} url={CONFIG.AVATAR} size={40} />
              <div>
                <span className="font-serif font-semibold text-[16px] block group-hover:text-[var(--brand)] transition">{CONFIG.NOME_PROFISSIONAL}</span>
                <span className="text-xs text-stone-500 block">{CONFIG.SUBTITULO}</span>
              </div>
            </button>
            <p className="text-[14px] font-semibold text-[var(--brand)] bg-[var(--soft)] px-3 py-1 rounded-full" aria-live="polite">Passo {step} de 3</p>
          </div>
          <div className="h-1 bg-stone-200" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
            <div className="h-full bg-[var(--brand)] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </header>
      )}

      <main className={`max-w-lg mx-auto ${step === 0 ? '' : 'px-5 pt-8 pb-36'}`}>
        {step === 0 && (
          <div className="min-h-[100dvh] flex flex-col justify-between">
            <div className="relative h-[45dvh] min-h-[300px] overflow-hidden rounded-b-[2.5rem] bg-[var(--brand)] shadow-xl">
              {CONFIG.COVER_IMAGE ? (
                <img src={CONFIG.COVER_IMAGE} alt="" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover opacity-85" />
              ) : (
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <Avatar name={CONFIG.NOME_PROFISSIONAL} url={CONFIG.AVATAR} size={60} />
                  <div>
                    <p className="font-serif text-2xl font-semibold leading-tight">{CONFIG.NOME_PROFISSIONAL}</p>
                    <p className="text-[14px] text-white/90 font-medium">{CONFIG.SUBTITULO}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pt-8 pb-12 flex-1 flex flex-col justify-between rise">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[var(--brand)] bg-[var(--soft)] px-3 py-1 rounded-md inline-block mb-4">Studio Profissional</span>
                <h1 className="text-[2.4rem] leading-[1.1] font-serif font-semibold mb-4 text-stone-900">Alívio de tensão e recuperação com hora marcada.</h1>
                <p className="text-stone-600 text-lg leading-relaxed">{CONFIG.BIO}</p>
              </div>
              <div className="mt-8 space-y-3">
                <button onClick={() => { vibrate(30); store.set(CONFIG.PREFIXO_STORAGE, 'onboard', 'yes'); setStep(1); }} className={`${btnPrimary} w-full text-lg`}>Agendar horário agora</button>
                <button onClick={() => setProfileOpen(true)} className="w-full py-3 text-sm font-semibold text-stone-600 hover:text-stone-900 transition">Conhecer espaço e detalhes</button>
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="rise">
            <h1 className="text-[2rem] leading-tight font-serif font-semibold mb-3">Escolha sua sessão</h1>
            <p className="text-stone-600 mb-6 text-[15px]">Selecione o protocolo ideal para o seu momento atual.</p>
            {!isReturning && (
              <div className="bg-[var(--soft)] text-stone-900 p-4 rounded-2xl mb-6 text-[15px] leading-relaxed border border-[var(--accent)]/30 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">🎁</span>
                <div>Primeira vez no studio? Você ganha <strong>{money(CONFIG.FIRST_TIME_DISCOUNT)} de desconto</strong> aplicado automaticamente.</div>
              </div>
            )}
            <div className="space-y-4" role="radiogroup" aria-label="Sessões">
              {CONFIG.PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <button key={p.id} role="radio" aria-checked={on} onClick={() => { vibrate(15); set({ packageId: p.id, time: '' }); }}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${on ? 'bg-[var(--brand)] border-[var(--brand)] text-white shadow-lg scale-[1.01]' : 'bg-white border-stone-200 hover:border-stone-400 shadow-sm'}`}>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-serif text-[1.35rem] font-semibold leading-snug">{p.title}</h3>
                      <div className="text-right shrink-0">
                        <span className={`text-[13px] line-through block ${on ? 'text-white/70' : 'text-stone-400'}`}>{money(p.originalPrice)}</span>
                        <span className="font-bold text-lg">{money(p.price)}</span>
                      </div>
                    </div>
                    <p className={`text-[15px] leading-relaxed mb-3 ${on ? 'text-white/9oomla' : 'text-stone-600'}`}>{p.desc}</p>
                    <div className={`flex flex-wrap items-center gap-2 text-[13px] ${on ? 'text-white/90' : 'text-stone-500'}`}>
                      <span className="flex items-center gap-1 bg-black/10 px-2.5 py-1 rounded-lg"><Icon name="clock" size={14} /> {p.min} min</span>
                      {p.tags.map((tag, idx) => (
                        <span key={idx} className="bg-black/10 px-2.5 py-1 rounded-lg">{tag}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <h2 className="font-serif text-xl font-semibold mt-9 mb-3">Deseja adicionar complementos?</h2>
            <div className="flex flex-col gap-3">
              {CONFIG.ADDONS.map((a) => {
                const on = !!data.addons[a.id];
                return (
                  <button key={a.id} role="checkbox" aria-checked={on} onClick={() => { vibrate(15); set({ addons: { ...data.addons, [a.id]: !on } }); }}
                    className={`w-full p-4 min-h-[60px] rounded-xl border-2 flex justify-between items-center gap-3 transition ${on ? 'border-[var(--brand)] bg-[var(--soft)] shadow-sm' : 'bg-white border-stone-200 hover:border-stone-400'}`}>
                    <span className="flex items-center gap-3 font-medium text-stone-900">
                      <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${on ? 'bg-[var(--brand)] border-[var(--brand)] text-white' : 'border-stone-400'}`}>{on && <Icon name="check" size={14} />}</span>
                      {a.label}
                    </span>
                    <span className="font-semibold text-stone-700">+ {money(a.price)}</span>
                  </button>
                );
              })}
            </div>
            <BottomBar>
              <div className="flex-1"><p className="text-[13px] text-stone-500 font-medium">{invoice.dur} min de sessão</p><p className="text-2xl font-serif font-semibold">{money(invoice.base + invoice.addonsTotal)}</p></div>
              <button onClick={() => { vibrate(30); setStep(2); }} className={btnPrimary}>Continuar</button>
            </BottomBar>
          </div>
        )}

        {step === 2 && (
          <div className="rise">
            <button onClick={() => setStep(1)} className="text-stone-600 hover:text-stone-900 flex items-center gap-1 text-[15px] mb-5 font-semibold min-h-[44px]"><Icon name="chevronLeft" size={18} /> Voltar</button>
            <h1 className="text-[2rem] leading-tight font-serif font-semibold mb-2">Quando e onde?</h1>
            <p className="text-stone-600 mb-6 text-[15px]">Informe seus dados e o melhor momento para o atendimento.</p>

            <section className="mb-7">
              <label htmlFor="nm" className={labelCls}>Seu nome completo</label>
              <input id="nm" autoComplete="name" type="text" value={data.name} onChange={(e) => set({ name: cleanName(e.target.value) })} className={inputCls} placeholder="Ex.: Lucas Mendes" maxLength={60} aria-invalid={touched && !!errors.name} />
              {touched && errors.name && <p data-err className={errCls}>{errors.name}</p>}
            </section>

            <section className="mb-7">
              <span className={labelCls}>Local do atendimento</span>
              <div className="grid grid-cols-2 gap-3" role="radiogroup">
                {[['studio', 'No Studio'], ['home', 'Na minha casa']].map(([v, l]) => (
                  <button key={v} role="radio" aria-checked={data.locType === v} onClick={() => set({ locType: v as 'studio' | 'home', time: '' })} className={`min-h-[56px] rounded-xl border-2 font-semibold transition ${data.locType === v ? chipOn : chipOff}`}>{l}</button>
                ))}
              </div>
              {!isHome ? (
                <p className="text-[14px] text-stone-600 mt-3 flex items-start gap-2 bg-white p-3.5 rounded-xl border border-stone-200"><Icon name="map" size={18} className="mt-0.5 text-[var(--brand)]" />Endereço privativo com estacionamento e total conforto. Enviado na confirmação.</p>
              ) : (
                <div className="mt-4 space-y-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
                  <p className="text-[13px] text-stone-600">Levei maca profissional, toalhas e óleos. Atendimentos das 18h às 21h possuem taxa de deslocamento de {money(CONFIG.PEAK_FEE)}.</p>
                  <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder="CEP (preenche automático)" aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className={inputCls} />
                  <input type="text" autoComplete="address-line1" placeholder="Rua / Avenida" aria-label="Rua" maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className={inputCls} />
                  <div className="flex gap-3">
                    <input ref={numberRef} type="text" inputMode="numeric" placeholder="Número" aria-label="Número" maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className={`${inputCls} w-2/5`} />
                    <input type="text" placeholder="Apto / Bloco" aria-label="Complemento" maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className={`${inputCls} w-3/5`} />
                  </div>
                  <input type="text" placeholder="Bairro" aria-label="Bairro" maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className={inputCls} />
                  {touched && errors.address && <p data-err className={errCls}>{errors.address}</p>}
                </div>
              )}
            </section>

            <section className="mb-7">
              <span className={labelCls}>Data do agendamento</span>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar -mx-5 px-5" role="radiogroup">
                {days.map(({ d, i }) => {
                  const sel = sameDay(data.date, d);
                  return (
                    <button key={dateKey(d)} role="radio" aria-checked={sel} onClick={() => { vibrate(10); set({ date: d, time: '' }); }}
                      className={`shrink-0 snap-start w-[76px] py-3.5 flex flex-col items-center border-2 rounded-xl transition ${sel ? chipOn : chipOff}`}>
                      <span className={`text-[12px] uppercase font-bold tracking-wider ${sel ? 'text-white/80' : 'text-stone-400'}`}>{dayLabel(d, i)}</span>
                      <span className="text-2xl font-serif font-semibold my-1">{d.getDate()}</span>
                      <span className={`text-[13px] capitalize ${sel ? 'text-white/80' : 'text-stone-500'}`}>{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                    </button>
                  );
                })}
              </div>
              {touched && errors.date && <p data-err className={errCls}>{errors.date}</p>}
            </section>

            {data.date && (
              <section className="fade">
                <span className={labelCls}>Horário de início <span className="font-normal text-stone-500">({invoice.dur} min)</span></span>
                {availableCount === 0 ? (
                  <p className="text-[15px] text-stone-700 bg-white border border-stone-200 rounded-xl p-5 shadow-sm">Sem horários livres nesta data. Escolha outro dia.</p>
                ) : periods.map((p) => (
                  <div key={p.label} className="mb-5">
                    <p className="text-[14px] font-semibold text-stone-500 mb-2">{p.label}</p>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup">
                      {p.items.map(({ t, status }) => {
                        const sel = data.time === t, ok = status === 'ok', peak = isHome && PEAK_HOURS.includes(t);
                        return (
                          <button key={t} role="radio" aria-checked={sel} disabled={!ok} aria-label={`${t}${ok ? '' : ', indisponível'}`} onClick={() => { vibrate(15); set({ time: t }); }}
                            className={`min-h-[52px] border-2 rounded-xl flex flex-col items-center justify-center transition text-[15px] font-semibold ${sel ? chipOn : ok ? 'bg-white border-stone-300 hover:border-stone-500 text-stone-800' : 'bg-stone-100 border-stone-100 text-stone-400 line-through cursor-not-allowed'}`}>
                            {t}{peak && ok && <span className={`text-[10px] leading-none mt-0.5 ${sel ? 'text-white/80' : 'text-stone-500'}`}>+{money(CONFIG.PEAK_FEE)}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {data.time && <p className="text-[14px] text-stone-600 bg-white p-3 rounded-xl border border-stone-200">Sessão agendada das <strong>{data.time}</strong> às <strong>{endTime}</strong>.</p>}
                {touched && errors.time && <p data-err className={errCls}>{errors.time}</p>}
              </section>
            )}

            <BottomBar>
              <div className="flex-1"><p className="text-[13px] text-stone-500">{pkg.title}</p><p className="text-xl font-serif font-semibold">{money(invoice.base + invoice.addonsTotal)}</p></div>
              <button onClick={goStep3} className={btnPrimary}>Revisar e pagar</button>
            </BottomBar>
          </div>
        )}

        {step === 3 && (
          <div className="rise">
            <button onClick={() => setStep(2)} className="text-stone-600 hover:text-stone-900 flex items-center gap-1 text-[15px] mb-5 font-semibold min-h-[44px]"><Icon name="chevronLeft" size={18} /> Alterar dados</button>
            <h1 className="text-[2rem] leading-tight font-serif font-semibold mb-6">Confirmação do Pedido</h1>

            <section className="bg-white p-6 rounded-2xl border border-stone-200 mb-6 shadow-sm space-y-2">
              <SummaryRow bold label="Sessão" value={pkg.title} />
              <SummaryRow label="Cliente" value={data.name} />
              <SummaryRow label="Dia" value={<span className="capitalize">{data.date?.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>} />
              <SummaryRow label="Horário" value={`${data.time} às ${endTime}`} />
              <SummaryRow label="Local" value={isHome ? `${clean(data.street, 60)}, ${clean(data.number, 10)}` : 'Studio Privativo'} />
              <div className="h-px bg-stone-200 my-3" />
              <SummaryRow label="Valor Base" value={money(invoice.base)} />
              {invoice.activeAddons.map((a) => <SummaryRow key={a.id} label={a.label} value={`+ ${money(a.price)}`} />)}
              {invoice.discount > 0 && <SummaryRow label={coupon.applied ? `Cupom (${coupon.applied})` : 'Desconto 1ª Sessão'} value={<span className="text-emerald-700 font-semibold">- {money(invoice.discount)}</span>} />}
              {invoice.peakFee > 0 && <SummaryRow label="Deslocamento (Horário de Pico)" value={`+ ${money(invoice.peakFee)}`} />}
              {invoice.pixDiscount > 0 && <SummaryRow label="Desconto Pix (5% off)" value={<span className="text-emerald-700 font-semibold">- {money(invoice.pixDiscount)}</span>} />}
              <div className="flex justify-between items-baseline pt-4 mt-3 border-t border-stone-300">
                <span className="font-semibold text-lg">Total do Serviço</span>
                <span className="text-3xl font-serif font-semibold text-[var(--brand)]">{money(invoice.total)}</span>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="font-serif text-xl font-semibold mb-3">Forma de pagamento do restante</h2>
              <div className="grid grid-cols-3 gap-2.5" role="radiogroup">
                {[['pix', 'Pix (-5%)'], ['card', 'Cartão'], ['cash', 'Dinheiro']].map(([id, l]) => (
                  <button key={id} role="radio" aria-checked={data.payment === id} onClick={() => { vibrate(15); set({ payment: id }); }} className={`min-h-[56px] rounded-xl border-2 text-[14px] font-semibold transition ${data.payment === id ? chipOn : chipOff}`}>{l}</button>
                ))}
              </div>
              {touched && !data.payment && <p data-err className={errCls}>Escolha uma forma de pagamento para o dia.</p>}
            </section>

            <section className="mb-6">
              <label htmlFor="rq" className={labelCls}>Alguma observação para o atendimento? <span className="font-normal text-stone-500">(opcional)</span></label>
              <input id="rq" type="text" placeholder="Ex.: Foco maior em lombar e ombros" maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className={inputCls} />
            </section>

            <section className="mb-6">
              {!coupon.applied && (coupon.open ? (
                <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 shadow-sm">
                  <label htmlFor="cp" className={labelCls}>Possui cupom de desconto?</label>
                  <div className="flex gap-3">
                    <input id="cp" type="text" autoCapitalize="characters" autoComplete="off" maxLength={30} value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className={`${inputCls} flex-1 uppercase`} placeholder="CÓDIGO" />
                    <button onClick={applyCoupon} className="min-h-[56px] px-6 font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition">Aplicar</button>
                  </div>
                  {coupon.error && <p className={errCls}>{coupon.error}</p>}
                </div>
              ) : (
                <button onClick={() => setCoupon({ ...coupon, open: true })} className="text-[15px] font-semibold text-[var(--brand)] underline underline-offset-4 min-h-[44px]">Tenho um cupom de desconto</button>
              ))}
            </section>

            <section className="bg-[var(--soft)] p-6 rounded-2xl mb-6 border border-[var(--accent)]/30">
              <h2 className="font-serif text-xl font-semibold mb-1">Sinal para confirmação do horário</h2>
              <p className="text-[14px] text-stone-700 mb-4">O agendamento é concluído após o envio do comprovante do sinal via Pix.</p>
              <div className="bg-white rounded-xl p-4 space-y-2 mb-4 shadow-sm">
                <div className="flex justify-between text-[15px]"><span className="text-stone-600">Sinal agora (Pix)</span><strong className="text-stone-900">{money(invoice.sinal)}</strong></div>
                <div className="flex justify-between text-[15px]"><span className="text-stone-600">Restante no dia</span><strong className="text-stone-900">{money(invoice.rest)}</strong></div>
              </div>
              <button onClick={copyPix} className="w-full min-h-[52px] flex items-center justify-center gap-2 font-semibold rounded-xl bg-white border-2 border-stone-300 hover:border-[var(--brand)] transition shadow-sm"><Icon name="copy" size={18} /> Copiar Chave Pix</button>
              <p className="text-[13px] text-stone-600 text-center mt-3 break-all font-mono bg-white/60 py-2 rounded-lg">{CONFIG.PIX_KEY}</p>
            </section>

            <BottomBar>
              <div className="flex-1"><p className="text-[13px] text-stone-500">Total</p><p className="text-xl font-serif font-semibold">{money(invoice.total)}</p></div>
              <button onClick={finishBooking} className={btnPrimary}>Confirmar no WhatsApp</button>
            </BottomBar>
          </div>
        )}

        {step === 4 && (
          <div className="fade flex flex-col items-center text-center pt-12">
            <div className="w-20 h-20 bg-[var(--brand)] text-white rounded-full flex items-center justify-center mb-6 shadow-xl"><Icon name="check" size={36} /></div>
            <h1 className="text-[2.2rem] font-serif font-semibold mb-2">Quase tudo pronto!</h1>
            <p className="text-stone-600 mb-8 text-lg">Código do pedido: <strong className="text-stone-900 font-mono bg-stone-100 px-3 py-1 rounded-lg">{ref}</strong></p>
            <ol className="text-left w-full space-y-3 mb-8 text-[15px]">
              <li className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">1. Realize o Pix do sinal no valor de <strong>{money(invoice.sinal)}</strong>.</li>
              <li className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">2. Envie o comprovante na janela do WhatsApp aberta automaticamente.</li>
              <li className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">3. Pronto! Seu horário estará garantido.</li>
            </ol>
            <div className="w-full space-y-3">
              <button onClick={openWhatsapp} className={`${btnPrimary} w-full`}>Abrir WhatsApp Novamente</button>
              <button onClick={restart} className="w-full min-h-[52px] font-semibold text-stone-600 hover:text-stone-900 transition">Realizar Novo Agendamento</button>
            </div>
          </div>
        )}
      </main>
      {css}
    </div>
  );
}

const SummaryRow = ({ label, value, bold = false }: { label: string; value: ReactNode; bold?: boolean }) => (
  <div className={`flex justify-between items-baseline gap-4 py-1.5 text-[15px] ${bold ? 'text-stone-900 font-semibold' : 'text-stone-600'}`}>
    <span>{label}</span><span className="text-right text-stone-900 font-medium">{value}</span>
  </div>
);

const BottomBar = ({ children }: { children: ReactNode }) => (
  <div className="fixed bottom-0 inset-x-0 z-30 bg-[var(--paper)]/95 backdrop-blur-md border-t border-stone-200 shadow-lg" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
    <div className="max-w-lg mx-auto px-5 py-3 flex items-center gap-4">{children}</div>
  </div>
);
