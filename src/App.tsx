import { useState, useEffect, useMemo, useRef, memo, type ReactNode, type RefObject } from 'react';

/* ==========================================================================
   1. CONFIGURAÇÕES E BANCO DE DADOS
   ========================================================================== */
let ENV: Record<string, string | undefined> = {};
try { ENV = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {}; } catch { ENV = {}; }

const CONFIG = {
  PHONE: '5517991360413',
  PIX_KEY: '62922530000144',
  INSTAGRAM: 'https://www.instagram.com/relaxarhojesp',
  REVIEW_LINK: 'https://g.page/r/Cd1aEwEt0R1QEAE/review',
  AVATAR: '/thalyson.jpg',
  SUPABASE_URL: ENV.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: ENV.VITE_SUPABASE_ANON_KEY || ENV.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  COUPONS: { SESSAO2: 0.08, RELAXAR13: 0.13 } as Record<string, number>,
  SIGNAL_AMOUNT: 40,
  FIRST_TIME_DISCOUNT: 15,
  FETISH_FEE: 140,
  PEAK_FEE: 18,
  PIX_DISCOUNT: 0.03,
  OPEN_MIN: 9 * 60,
  LAST_END_MIN: 23 * 60 + 30,
  SLOT_STEP: 60,
  BUFFER_STUDIO: 15,
  BUFFER_HOME: 60,
  MIN_LEAD_STUDIO: 30,
  MIN_LEAD_HOME: 60,
  DAYS_AHEAD: 14,
  DAYS_OFF: [] as number[],
  BLOCKED: {} as Record<string, string[]>,
};

const BACKEND_ON = !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);
const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const K = { lang: 'thaly_lang', theme: 'thaly_theme', draft: 'thaly_draft', cid: 'thaly_cid', ret: 'thaly_ret' };
type Lang = 'pt' | 'en';

/* ==========================================================================
   2. DICIONÁRIO DE TRADUÇÃO
   ========================================================================== */
const T = {
  header: { pt: 'Thalyson Massagens', en: 'Thalyson Massages' },
  heroTitle: { pt: 'O seu momento\nde pausa.', en: 'Your moment\nof pause.' },
  heroSub: { pt: 'Atendimento voltado para o corpo masculino. Levo óleos, toalhas e cremes. Você só precisa de uma cama ou sofá confortável.', en: 'Service focused on the male body. I bring oils, towels, and creams. You just need a comfortable bed or sofa.' },
  btnStart: { pt: 'Escolher meu horário', en: 'Choose my time' },
  
  guarantee1: { pt: 'Privacidade Total', en: 'Total Privacy' },
  guarantee1Desc: { pt: 'Seus dados só saem deste aparelho quando você enviar a mensagem pelo WhatsApp.', en: 'Your data only leaves this device when you send the WhatsApp message.' },
  guarantee2: { pt: 'Discrição e Respeito', en: 'Discretion and Respect' },
  guarantee2Desc: { pt: 'Serviço exclusivo para maiores de 18 anos, focado no relaxamento profundo.', en: 'Exclusive service for adults over 18, focused on deep relaxation.' },
  ageCheck: { pt: 'Declaro ter 18 anos ou mais e concordo com os termos do serviço.', en: 'I am 18 or older and agree to the terms of service.' },

  step1: { pt: 'Passo 1: O que seu corpo pede hoje?', en: 'Step 1: What does your body need today?' },
  discountMsg: { pt: 'Primeira visita? Desconto de R$ 15 aplicado no final.', en: 'First visit? R$ 15 discount applied at checkout.' },
  addonsTitle: { pt: 'Deseja adicionar algo?', en: 'Want to add something?' },
  
  step2: { pt: 'Passo 2: Onde e Quando?', en: 'Step 2: Where and When?' },
  nameLabel: { pt: 'Como devo te chamar?', en: 'What should I call you?' },
  nameHold: { pt: 'Seu nome ou apelido', en: 'Your name or nickname' },
  locLabel: { pt: 'Local da sessão', en: 'Session location' },
  locStudio: { pt: 'No meu espaço', en: 'At my studio' },
  locHome: { pt: 'No seu endereço', en: 'At your address' },
  studioInfo: { pt: 'O espaço fica no Centro Histórico, região da Bela Vista. O endereço exato é enviado após a confirmação.', en: 'The studio is in the Historic Center, Bela Vista area. Exact address sent upon confirmation.' },
  cep: { pt: 'CEP', en: 'ZIP Code' },
  street: { pt: 'Rua ou Avenida', en: 'Street or Avenue' },
  num: { pt: 'Número', en: 'Number' },
  comp: { pt: 'Complemento', en: 'Apt / Suite' },
  hood: { pt: 'Bairro', en: 'Neighborhood' },
  peakWarn: { pt: `Horários de pico no seu endereço têm taxa de R$ ${CONFIG.PEAK_FEE}.`, en: `Peak hours at your address include a R$ ${CONFIG.PEAK_FEE} fee.` },
  dateLabel: { pt: 'Escolha a data', en: 'Choose the date' },
  timeLabel: { pt: 'Horário de início', en: 'Start time' },
  loading: { pt: 'Consultando agenda...', en: 'Checking schedule...' },
  noSlots: { pt: 'Sem horários livres neste dia. Escolha outra data.', en: 'No available slots today. Choose another date.' },

  step3: { pt: 'Passo 3: Revisão e Pagamento', en: 'Step 3: Review and Payment' },
  sumPkg: { pt: 'Serviço', en: 'Service' },
  sumAddons: { pt: 'Adicionais', en: 'Add-ons' },
  sumDiscount: { pt: 'Desconto 1ª vez', en: '1st time discount' },
  sumPeak: { pt: 'Taxa de pico/deslocamento', en: 'Peak/Travel fee' },
  sumReq: { pt: 'Pedido avaliado', en: 'Evaluated request' },
  total: { pt: 'Valor Total', en: 'Total Value' },
  signal: { pt: 'Sinal agora (Pix)', en: 'Deposit now (Pix)' },
  rest: { pt: 'Pagar na hora', en: 'Pay in person' },
  reqTitle: { pt: 'Algum detalhe ou vontade específica? (Opcional)', en: 'Any specific detail or desire? (Optional)' },
  reqConsent: { pt: 'Consinto em informar um detalhe que será avaliado pelo terapeuta. Se inviável, não será cobrado.', en: 'I consent to provide a detail to be evaluated by the therapist. If unfeasible, no charge applies.' },
  reqHold: { pt: 'Ex: Foco nos ombros, pressão leve...', en: 'Ex: Focus on shoulders, light pressure...' },
  payLabel: { pt: 'Como prefere pagar o restante?', en: 'How will you pay the rest?' },
  waPromo: { pt: 'Opcional: aceito receber novidades pelo WhatsApp.', en: 'Optional: I accept receiving updates via WhatsApp.' },
  btnReview: { pt: 'Revisar pedido', en: 'Review booking' },
  btnSend: { pt: 'Solicitar pelo WhatsApp', en: 'Request via WhatsApp' },
  btnBack: { pt: 'Voltar', en: 'Back' },

  step4: { pt: 'Solicitação pronta', en: 'Request ready' },
  step4Desc: { pt: 'O horário fica garantido após minha resposta. Envie a mensagem no WhatsApp e aguarde a confirmação para transferir o Pix do sinal.', en: 'The slot is secured after my reply. Send the WhatsApp message and await confirmation before transferring the Pix deposit.' },
  btnWa: { pt: 'Abrir conversa no WhatsApp', en: 'Open WhatsApp chat' },
  btnPix: { pt: 'Copiar chave Pix', en: 'Copy Pix key' },
  btnCal: { pt: 'Adicionar à agenda', en: 'Add to calendar' },
  btnReset: { pt: 'Voltar ao início', en: 'Back to start' },

  errors: {
    name: { pt: 'Informe seu nome.', en: 'Enter your name.' },
    date: { pt: 'Escolha uma data.', en: 'Choose a date.' },
    time: { pt: 'Escolha um horário.', en: 'Choose a time.' },
    address: { pt: 'Preencha rua, número e bairro.', en: 'Fill out street, number, and neighborhood.' }
  }
};

const PACKAGES = [
  { id: 'classica', title: { pt: 'Massagem Clássica', en: 'Classic Massage' }, price: 180, min: 40, tags: { pt: ['Relaxamento', 'Sem Toque Íntimo'], en: ['Relaxation', 'No Intimate Touch'] }, desc: { pt: 'O essencial para o corpo cansado. Uso a força das mãos para trabalhar a tensão e soltar a musculatura.', en: 'Essential for a tired body. Firm hand pressure to work out tension and loosen muscles.' } },
  { id: 'sensitiva', title: { pt: 'Sensitiva & Prazer', en: 'Sensitive & Pleasure' }, price: 220, min: 60, tags: { pt: ['Tântrica', 'Finalização lingam'], en: ['Tantric', 'Lingam ending'] }, desc: { pt: 'Começamos com a clássica. Quando você estiver à vontade, os toques ficam mais leves até a finalização.', en: 'Starts with classic massage. Once you are comfortable, touches lighten until the ending.' } },
  { id: 'fusion', title: { pt: 'Sensações com a Barba', en: 'Beard Sensations' }, price: 290, min: 60, tags: { pt: ['Tântrica', 'Naturista', 'Barba'], en: ['Tantric', 'Naturist', 'Beard'] }, desc: { pt: 'Totalmente à vontade. Massagem clássica, uso da barba em áreas do corpo e finalização lingam.', en: 'Totally free. Classic massage, use of beard on body areas, and lingam ending.' } },
  { id: 'completa', title: { pt: 'Corpo a Corpo & Interação', en: 'Body to Body & Interaction' }, price: 390, min: 60, tags: { pt: ['Tântrica', 'Interação'], en: ['Tantric', 'Interaction'] }, desc: { pt: 'O pacote sem barreiras. Proximidade física com gel, liberdade para você interagir e finalização.', en: 'The package without barriers. Physical closeness with gel, freedom to interact, and ending.' } },
  { id: 'aparo_solo', title: { pt: 'Apenas Depilação', en: 'Trimming Only' }, price: 130, min: 40, tags: { pt: ['Estética', 'Máquina'], en: ['Aesthetic', 'Clipper'] }, desc: { pt: 'Serviço isolado de estética. Aparo de pelos (até 3 lugares) utilizando máquina.', en: 'Isolated aesthetic service. Hair trimming (up to 3 areas) using a clipper.' } },
];

const ADDONS = [
  { id: 'time', label: { pt: 'Mais 30 minutos extras', en: 'Extra 30 minutes' }, price: 75 },
  { id: 'aparo', label: { pt: 'Aparar pelos (até 3 áreas)', en: 'Trim hair (up to 3 areas)' }, price: 130 },
];

const PAY_METHODS = [
  { id: 'pix', label: 'Pix (-3%)' },
  { id: 'card', label: { pt: 'Cartão', en: 'Card' } },
  { id: 'cash', label: { pt: 'Dinheiro', en: 'Cash' } },
];

/* ==========================================================================
   3. ÍCONES
   ========================================================================== */
const ICONS = {
  check: 'M20 6L9 17l-5-5', close: 'M18 6L6 18 M6 6l12 12',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  globe: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-9.1-10.9h18.2M2.9 12.9h18.2M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M7 11V7a5 5 0 0 1 10 0v4',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1', cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4', map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
};

const Icon = memo(({ n, sz = 24, cls = '' }: { n: keyof typeof ICONS; sz?: number; cls?: string }) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${cls}`} aria-hidden="true"><path d={ICONS[n]} /></svg>
));

/* ==========================================================================
   4. FUNÇÕES GERAIS E BANCO
   ========================================================================== */
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 15) => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
  del: (k: string) => { try { localStorage.removeItem(k); } catch {} },
};

const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };
const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();

const clientId = () => {
  let id = store.get(K.cid);
  if (!id || id.length < 8) { id = `${Date.now()}-${Math.random().toString(36).slice(2)}`; store.set(K.cid, id); }
  return id;
};

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<{ ok: boolean; data: T | null }> {
  if (!BACKEND_ON) return { ok: false, data: null };
  try {
    const r = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: CONFIG.SUPABASE_ANON_KEY, Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}` }, body: JSON.stringify(args),
    });
    if (!r.ok) return { ok: false, data: null };
    return { ok: true, data: (await r.json()) as T };
  } catch { return { ok: false, data: null }; }
}

/* ==========================================================================
   5. APLICATIVO PRINCIPAL
   ========================================================================== */
interface BookingData {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addons: Record<string, boolean>;
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (store.get(K.lang) as Lang) || 'pt');
  const [isDark, setIsDark] = useState(() => store.get(K.theme) !== 'light');
  
  const [step, setStep] = useState(0);
  const [ageOk, setAgeOk] = useState(false);
  const [reqOk, setReqOk] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const [toast, setToast] = useState('');
  const [touched, setTouched] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [data, setData] = useState<BookingData>({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', req: '', payment: '', packageId: 'classica', addons: {}
  });
  const set = (patch: Partial<BookingData>) => setData((p) => ({ ...p, ...patch }));

  const [now, setNow] = useState(() => new Date());
  const [busy, setBusy] = useState<{ s: number; e: number }[] | null>(null);
  const [busyLoading, setBusyLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sentLink, setSentLink] = useState('');

  const isReturning = store.get(K.ret) === 'yes';

  // Configuração das Fontes Elegantes via JS dinâmico
  useEffect(() => {
    if (document.getElementById('brand-fonts')) return;
    const l = document.createElement('link');
    l.id = 'brand-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }, []);

  useEffect(() => { store.set(K.lang, lang); }, [lang]);
  useEffect(() => { store.set(K.theme, isDark ? 'dark' : 'light'); }, [isDark]);
  useEffect(() => { if (step > 0 && step < 4) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3500);
  };

  const toggleTheme = () => { vibrate(10); setIsDark(!isDark); };
  const toggleLang = () => { vibrate(10); setLang(lang === 'pt' ? 'en' : 'pt'); };

  // Cálculo de Preços
  const pkg = useMemo(() => PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0], [data.packageId]);
  const isHome = data.locType === 'home';
  const hasReq = reqOk && data.req.trim().length > 2;

  const invoice = useMemo(() => {
    let dur = pkg.min, addonsTotal = 0;
    const activeAddons: typeof ADDONS = [];
    ADDONS.forEach((a) => {
      if (data.addons[a.id]) { addonsTotal += a.price; activeAddons.push(a); if (a.id === 'time') dur += 30; }
    });
    const reqFee = hasReq ? CONFIG.FETISH_FEE : 0;
    const base = pkg.price + addonsTotal + reqFee;
    const peakFee = isHome && PEAK_HOURS.includes(data.time) ? CONFIG.PEAK_FEE : 0;
    
    const discount = isReturning ? 0 : Math.min(CONFIG.FIRST_TIME_DISCOUNT, base);
    const afterDiscount = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.ceil(afterDiscount * CONFIG.PIX_DISCOUNT) : 0;
    
    const total = afterDiscount - pixDiscount + peakFee;
    const sinal = Math.min(CONFIG.SIGNAL_AMOUNT, total);
    return { base: pkg.price, addonsTotal, reqFee, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, activeAddons };
  }, [data.addons, data.payment, data.time, pkg, isHome, hasReq, isReturning]);

  // Consulta de CEP Automática
  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const j = await res.json();
        if (!j.erro) set({ street: j.logradouro, bairro: j.bairro });
      } catch { /* erro silencioso */ }
    }
  };

  // Agenda Supabase / Fallback
  useEffect(() => {
    if (!data.date) return;
    let off = false;
    setBusyLoading(true);
    rpc<{ s: number; e: number }[]>('get_busy_thalyson', { p_date: dateKey(data.date) })
      .then((r) => { if (!off) setBusy(r.ok ? r.data : null); })
      .finally(() => { if (!off) setBusyLoading(false); });
    return () => { off = true; };
  }, [data.date]);

  const days = useMemo(() => {
    const out: { d: Date }[] = [];
    for (let i = 0; out.length < CONFIG.DAYS_AHEAD; i++) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
      if (!CONFIG.DAYS_OFF.includes(d.getDay())) out.push({ d });
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
    const out: { t: string; ok: boolean }[] = [];

    for (let m = CONFIG.OPEN_MIN; m + invoice.dur <= CONFIG.LAST_END_MIN; m += CONFIG.SLOT_STEP) {
      const end = m + invoice.dur + buffer;
      let ok = true;
      if (today && m < nowMin + lead) ok = false;
      else if (blocked.some((b) => b < end && b + CONFIG.SLOT_STEP > m)) ok = false;
      else if ((busy || []).some((x) => x.s < end && (x.e + buffer) > m)) ok = false;
      out.push({ t: fromMin(m), ok });
    }
    return out;
  }, [data.date, isHome, invoice.dur, now, busy]);

  const errors = {
    name: data.name.trim().length < 3 ? T.errors.name[lang] : '',
    date: !data.date ? T.errors.date[lang] : '',
    time: data.date && !data.time ? T.errors.time[lang] : '',
    address: isHome && !(data.street && data.number && data.bairro) ? T.errors.address[lang] : '',
  };
  const step2Valid = !errors.name && !!data.date && !!data.time && !errors.address;

  // Finalização e WhatsApp / Calendário
  const downloadICS = () => {
    if (!data.date || !data.time) return;
    const f = (d: Date, m: number) => `${dateKey(d).replace(/-/g, '')}T${fromMin(m).replace(':', '')}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const s = toMin(data.time);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thalyson//Agenda//PT', 'BEGIN:VEVENT',
      `UID:${Date.now()}@thalyson`, `DTSTAMP:${stamp}`,
      `DTSTART:${f(data.date, s)}`, `DTEND:${f(data.date, s + invoice.dur)}`,
      `SUMMARY:${pkg.title[lang]} - Thalyson`, `DESCRIPTION:Sinal de ${money(invoice.sinal)} via Pix para confirmar.`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = url; a.download = 'agendamento.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const getWhatsappLink = (code = '') => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
    const endT = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';
    const loc = isHome ? `📍 *Local:* Seu endereço\n${clean(data.street)}, ${clean(data.number)} - ${clean(data.bairro)}` : `📍 *Local:* No espaço (Bela Vista, SP)`;
    
    let msg = `Olá Thalyson, fiz um agendamento no site:\n\n*NOME:* ${clean(data.name)}\n`;
    if (code) msg += `*CÓDIGO:* ${code}\n`;
    msg += `*DATA/HORA:* ${dStr}, das ${data.time} às ${endT}\n${loc}\n\n*SERVIÇO:* ${pkg.title[lang]}\n`;
    
    invoice.activeAddons.forEach(a => msg += `➕ ${a.label[lang]}\n`);
    if (hasReq) msg += `\n*PEDIDO AVALIADO:* "${clean(data.req)}"\n`;
    
    msg += `\n*TOTAL:* ${money(invoice.total)}\n*SINAL AGORA:* ${money(invoice.sinal)}\n*PAGAR NA HORA:* ${money(invoice.rest)} (${(PAY_METHODS.find(m => m.id === data.payment)?.label || data.payment).toString().replace(/ \(.*\)/, '')})\n\n`;
    if (optIn) msg += '🔔 Aceito receber lembretes pelo WhatsApp.\n\n';
    msg += 'Aguardando sua confirmação!';
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const finishBooking = async () => {
    if (!data.payment) { vibrate(50); showToast('Escolha a forma de pagamento'); return; }
    if (submitting || !data.date || !data.time) return;
    setSubmitting(true);

    const w = window.open('', '_blank');
    let code = '';

    if (BACKEND_ON) {
      const r = await rpc<{ ok: boolean; error?: string; booking_code?: string }>('book_slot_thalyson', {
        p_date: dateKey(data.date), p_start_minute: toMin(data.time), p_service_id: pkg.id, p_duration: invoice.dur,
        p_customer_name: data.name.trim(), p_client_key: clientId(),
        p_total: Number(invoice.total.toFixed(2)), p_signal: Number(invoice.sinal.toFixed(2)), p_remaining: Number(invoice.rest.toFixed(2)),
        p_is_home: isHome,
      });

      if (!r.ok || !r.data) { w?.close(); setSubmitting(false); showToast('Falha na comunicação. Tente novamente.'); return; }
      if (!r.data.ok) {
        w?.close(); setSubmitting(false); vibrate(50);
        showToast('Horário indisponível ou limite atingido. Verifique os dados.');
        set({ time: '' }); setStep(2); return;
      }
      code = r.data.booking_code || '';
    }

    const link = getWhatsappLink(code);
    store.set(K.ret, 'yes');
    setSentLink(link); vibrate([30, 50]);
    if (w) { w.opener = null; w.location.href = link; } else window.location.href = link;
    setSubmitting(false); setStep(4);
  };

  /* ==========================================================================
     6. ESTILIZAÇÃO CSS/TAILWIND REFINADA (Acessibilidade + Luxo)
     ========================================================================== */
  const c = isDark 
    ? { bg: 'bg-[#151312]', text: 'text-stone-100', textMuted: 'text-stone-400', card: 'bg-[#1A1817] border-stone-800', border: 'border-stone-800', accText: 'text-amber-500', accBg: 'bg-amber-600 text-stone-950 hover:bg-amber-500', input: 'bg-[#151312] border-stone-700 focus:border-amber-600 text-stone-100 placeholder:text-stone-600' }
    : { bg: 'bg-[#F7F9F8]', text: 'text-slate-900', textMuted: 'text-slate-600', card: 'bg-white border-stone-200', border: 'border-stone-300', accText: 'text-teal-800', accBg: 'bg-teal-800 text-white hover:bg-teal-700', input: 'bg-white border-stone-300 focus:border-teal-800 text-slate-900 placeholder:text-stone-400' };

  const inputCls = `w-full rounded-2xl px-6 h-[64px] text-lg border transition-colors outline-none focus:ring-2 focus:ring-opacity-20 ${c.input}`;
  const labelCls = `block text-lg font-medium mb-3 mt-8 ${c.text}`;
  const btnBig = `w-full h-[64px] rounded-2xl text-xl font-medium flex items-center justify-center transition-transform active:scale-[0.98] ${c.accBg}`;
  const blockBtn = (active: boolean) => `h-[64px] rounded-2xl border-2 flex items-center justify-center text-lg font-medium cursor-pointer transition-colors ${active ? `border-current ${c.accText} ${isDark ? 'bg-amber-600/10' : 'bg-teal-800/5'}` : `${c.border} ${c.textMuted} hover:border-current`}`;

  const css = (
    <style dangerouslySetInnerHTML={{ __html: `
      .font-serif { font-family: 'Instrument Serif', Georgia, serif; letter-spacing: -0.01em; line-height: 1.05; }
      .font-sans { font-family: 'Hanken Grotesk', system-ui, sans-serif; }
      .hide-scroll::-webkit-scrollbar { display: none; }
      .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      @keyframes softIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      .animate-soft { animation: softIn 0.5s ease-out forwards; }
    `}} />
  );

  return (
    <div className={`min-h-screen font-sans ${c.bg} ${c.text} pb-32 transition-colors duration-300`}>
      {css}

      {/* HEADER FIXO TOPO */}
      <header className={`sticky top-0 z-50 ${c.bg} border-b ${c.border} px-5 py-4 flex justify-between items-center shadow-sm`}>
        <div className="flex items-center gap-4">
          <img src={CONFIG.AVATAR} alt="Thalyson" className={`w-12 h-12 rounded-full object-cover border border-current ${c.accText}`} />
          <span className="font-serif text-2xl pt-1">{T.header[lang]}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={toggleLang} className={`p-3 rounded-full ${c.textMuted} hover:${c.text}`} aria-label="Idioma"><Icon n="globe" sz={22} /></button>
          <button onClick={toggleTheme} className={`p-3 rounded-full ${c.textMuted} hover:${c.text}`} aria-label="Tema"><Icon n={isDark ? 'sun' : 'moon'} sz={22} /></button>
        </div>
      </header>

      {/* TOAST */}
      {toast && <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] ${isDark ? 'bg-stone-200 text-stone-900' : 'bg-slate-900 text-white'} px-8 py-4 rounded-full font-medium text-lg shadow-2xl animate-soft whitespace-nowrap`}>{toast}</div>}

      <main className="max-w-xl mx-auto px-6 pt-10">
        
        {/* ==========================================================================
            PASSO 0: HOME
            ========================================================================== */}
        {step === 0 && (
          <div className="animate-soft">
            <h1 className="font-serif text-6xl md:text-7xl mb-8 whitespace-pre-line">{T.heroTitle[lang]}</h1>
            <p className={`text-xl leading-relaxed mb-12 ${c.textMuted}`}>{T.heroSub[lang]}</p>
            
            <div className="space-y-4 mb-12">
              <div className={`p-6 rounded-3xl border ${c.card}`}>
                <div className="flex items-center gap-4 mb-3">
                  <Icon n="shield" sz={26} cls={c.accText} />
                  <h2 className="font-serif text-3xl">{T.guarantee1[lang]}</h2>
                </div>
                <p className={`text-lg leading-relaxed ${c.textMuted}`}>{T.guarantee1Desc[lang]}</p>
              </div>
              <div className={`p-6 rounded-3xl border ${c.card}`}>
                <div className="flex items-center gap-4 mb-3">
                  <Icon n="lock" sz={26} cls={c.accText} />
                  <h2 className="font-serif text-3xl">{T.guarantee2[lang]}</h2>
                </div>
                <p className={`text-lg leading-relaxed ${c.textMuted}`}>{T.guarantee2Desc[lang]}</p>
              </div>
            </div>

            <label className={`flex items-start gap-4 p-5 rounded-3xl cursor-pointer border ${c.border} mb-8`}>
              <input type="checkbox" checked={ageOk} onChange={(e) => { vibrate(10); setAgeOk(e.target.checked); }} className="mt-1 w-6 h-6 shrink-0" />
              <span className={`text-lg ${c.textMuted}`}>{T.ageCheck[lang]}</span>
            </label>

            <button disabled={!ageOk} onClick={() => { vibrate(30); setStep(1); }} className={`${btnBig} ${!ageOk ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
              {T.btnStart[lang]}
            </button>
          </div>
        )}

        {/* ==========================================================================
            PASSO 1: PACOTES
            ========================================================================== */}
        {step === 1 && (
          <div className="animate-soft pb-10">
            <h1 className="font-serif text-5xl mb-8">{T.step1[lang]}</h1>
            
            {!isReturning && (
              <div className={`p-5 rounded-2xl mb-8 flex gap-4 items-center border ${isDark ? 'bg-amber-900/20 border-amber-500/30' : 'bg-teal-50 border-teal-200'}`}>
                <Icon n="check" sz={24} cls={c.accText} />
                <p className={`text-lg font-medium ${c.accText}`}>{T.discountMsg[lang]}</p>
              </div>
            )}

            <div className="space-y-4">
              {PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <label key={p.id} className={`block p-6 rounded-3xl border-2 transition-all cursor-pointer ${on ? `border-current ${c.accText} ${isDark ? 'bg-[#1A1817]' : 'bg-white'}` : c.card}`}>
                    <input type="radio" checked={on} onChange={() => { vibrate(10); set({ packageId: p.id }); }} className="sr-only" />
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`font-serif text-3xl ${c.text}`}>{p.title[lang]}</h3>
                      <span className="font-medium text-xl mt-1">{money(p.price)}</span>
                    </div>
                    <p className={`text-lg leading-relaxed mb-4 ${on ? c.text : c.textMuted}`}>{p.desc[lang]}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 border ${c.border} ${c.text}`}><Icon n="clock" sz={16} />{p.min} min</span>
                      {p.tags[lang].map((t) => <span key={t} className={`px-4 py-2 rounded-xl text-sm font-medium border ${c.border} ${c.textMuted}`}>{t}</span>)}
                    </div>
                  </label>
                );
              })}
            </div>

            <h3 className="font-serif text-4xl mt-12 mb-6">{T.addonsTitle[lang]}</h3>
            <div className="space-y-3">
              {ADDONS.filter(a => !(data.packageId === 'aparo_solo' && a.id === 'aparo')).map((a) => {
                const on = !!data.addons[a.id];
                return (
                  <label key={a.id} className={`flex justify-between items-center p-6 rounded-3xl border-2 cursor-pointer transition-colors ${on ? `border-current ${c.accText} ${isDark ? 'bg-[#1A1817]' : 'bg-white'}` : c.card}`}>
                    <input type="checkbox" checked={on} onChange={() => { vibrate(10); set({ addons: { ...data.addons, [a.id]: !on } }); }} className="sr-only" />
                    <span className={`text-lg font-medium flex items-center gap-4 ${c.text}`}>
                      <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${on ? `bg-current border-current text-white` : c.border}`}>{on && <Icon n="check" sz={20} />}</div>
                      {a.label[lang]}
                    </span>
                    <span className="text-lg font-medium">+{money(a.price)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* ==========================================================================
            PASSO 2: LOCAL, DATA, HORA
            ========================================================================== */}
        {step === 2 && (
          <div className="animate-soft pb-10">
            <h1 className="font-serif text-5xl mb-8">{T.step2[lang]}</h1>

            <label className={labelCls}>{T.nameLabel[lang]}</label>
            <input type="text" value={data.name} onChange={e => set({ name: e.target.value })} placeholder={T.nameHold[lang]} className={inputCls} />
            {touched && errors.name && <p className="text-red-500 mt-2 text-sm">{errors.name}</p>}

            <label className={labelCls}>{T.locLabel[lang]}</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={blockBtn(data.locType === 'studio')}><input type="radio" className="sr-only" checked={data.locType==='studio'} onChange={() => {vibrate(10); set({ locType: 'studio' })}}/>{T.locStudio[lang]}</label>
              <label className={blockBtn(data.locType === 'home')}><input type="radio" className="sr-only" checked={data.locType==='home'} onChange={() => {vibrate(10); set({ locType: 'home' })}}/>{T.locHome[lang]}</label>
            </div>

            {isHome ? (
              <div className="mt-6 space-y-4 animate-soft">
                <input type="tel" placeholder={T.cep[lang]} value={data.cep} onChange={e => handleCep(e.target.value)} className={inputCls} maxLength={9}/>
                <input type="text" placeholder={T.street[lang]} value={data.street} onChange={e => set({ street: e.target.value })} className={inputCls} />
                <div className="flex gap-4">
                  <input type="text" placeholder={T.num[lang]} value={data.number} onChange={e => set({ number: e.target.value })} className={`${inputCls} w-1/3`} />
                  <input type="text" placeholder={T.comp[lang]} value={data.comp} onChange={e => set({ comp: e.target.value })} className={`${inputCls} w-2/3`} />
                </div>
                <input type="text" placeholder={T.hood[lang]} value={data.bairro} onChange={e => set({ bairro: e.target.value })} className={inputCls} />
                {touched && errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                <p className={`text-sm mt-3 ${c.accText}`}>{T.peakWarn[lang]}</p>
              </div>
            ) : (
              <div className={`mt-6 p-6 rounded-3xl border ${c.card} flex gap-4 items-start`}>
                <Icon n="map" sz={24} cls={`mt-1 ${c.accText}`} />
                <p className={`text-lg leading-relaxed ${c.textMuted}`}>{T.studioInfo[lang]}</p>
              </div>
            )}

            <label className={labelCls}>{T.dateLabel[lang]}</label>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scroll">
              {days.map(({ d }) => {
                const sel = sameDay(data.date, d);
                return (
                  <label key={dateKey(d)} className={`shrink-0 snap-start w-[100px] h-[110px] rounded-3xl flex flex-col justify-center items-center cursor-pointer border-2 transition-colors ${sel ? `border-current ${c.accText} ${isDark ? 'bg-amber-600/10' : 'bg-teal-800/5'}` : c.card}`}>
                    <input type="radio" className="sr-only" onChange={() => { vibrate(10); set({ date: d, time: '' }); }} />
                    <span className={`font-serif text-4xl mb-1 ${c.text}`}>{d.getDate()}</span>
                    <span className={`text-sm font-medium uppercase ${c.textMuted}`}>{d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short' }).replace('.', '')}</span>
                  </label>
                );
              })}
            </div>
            {touched && errors.date && <p className="text-red-500 mt-2 text-sm">{errors.date}</p>}

            {data.date && (
              <div className="mt-4 animate-soft">
                <div className="flex justify-between items-baseline mb-3">
                  <label className={`text-lg font-medium ${c.text}`}>{T.timeLabel[lang]}</label>
                  <span className={`text-sm ${c.textMuted}`}>{busyLoading ? T.loading[lang] : `${invoice.dur} min`}</span>
                </div>
                
                {slots.filter(s => s.ok).length === 0 && !busyLoading ? (
                  <p className={`text-lg text-center py-8 ${c.textMuted}`}>{T.noSlots[lang]}</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {slots.map(({ t, ok }) => {
                      const sel = data.time === t;
                      const peak = isHome && PEAK_HOURS.includes(t);
                      if (!ok) return <div key={t} className={`h-[64px] flex items-center justify-center text-lg rounded-2xl opacity-40 line-through border-2 ${c.border} ${c.textMuted}`}>{t}</div>;
                      return (
                        <label key={t} className={`${blockBtn(sel)} flex flex-col relative`}>
                          <input type="radio" className="sr-only" onChange={() => { vibrate(10); set({ time: t }); }} />
                          <span>{t}</span>
                          {peak && <span className={`absolute -bottom-5 text-[11px] whitespace-nowrap ${c.accText}`}>+ {money(CONFIG.PEAK_FEE).replace(',00', '')}</span>}
                        </label>
                      );
                    })}
                  </div>
                )}
                {touched && errors.time && <p className="text-red-500 mt-4 text-sm">{errors.time}</p>}
              </div>
            )}
          </div>
        )}

        {/* ==========================================================================
            PASSO 3: RESUMO
            ========================================================================== */}
        {step === 3 && (
          <div className="animate-soft pb-10">
            <h1 className="font-serif text-5xl mb-8">{T.step3[lang]}</h1>

            <div className={`p-6 rounded-3xl border ${c.card} space-y-4 mb-8`}>
              <div className={`flex justify-between pb-4 border-b ${c.border}`}>
                <span className={`text-lg ${c.textMuted}`}>{T.sumPkg[lang]}</span>
                <span className="text-lg font-medium text-right">{pkg.title[lang]}<br/>{data.date?.toLocaleDateString()} · {data.time}</span>
              </div>
              <div className="space-y-2 py-2">
                <div className="flex justify-between"><span className={c.textMuted}>{T.sumPkg[lang]}</span><span>{money(invoice.base - invoice.reqFee)}</span></div>
                {invoice.addonsTotal > 0 && <div className="flex justify-between"><span className={c.textMuted}>{T.sumAddons[lang]}</span><span>+{money(invoice.addonsTotal)}</span></div>}
                {invoice.reqFee > 0 && <div className="flex justify-between"><span className={c.textMuted}>{T.sumReq[lang]}</span><span>+{money(invoice.reqFee)}</span></div>}
                {invoice.peakFee > 0 && <div className="flex justify-between"><span className={c.textMuted}>{T.sumPeak[lang]}</span><span>+{money(invoice.peakFee)}</span></div>}
                {invoice.discount > 0 && <div className={`flex justify-between font-medium ${c.accText}`}><span>{T.sumDiscount[lang]}</span><span>-{money(invoice.discount)}</span></div>}
                {invoice.pixDiscount > 0 && <div className={`flex justify-between font-medium ${c.accText}`}><span>Desconto Pix (3%)</span><span>-{money(invoice.pixDiscount)}</span></div>}
              </div>
              <div className={`flex justify-between items-end pt-4 border-t ${c.border}`}>
                <span className="text-xl">{T.total[lang]}</span>
                <span className="font-serif text-5xl">{money(invoice.total)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className={`p-5 rounded-2xl ${c.bg} border ${c.border} text-center`}><p className={`text-sm mb-1 ${c.textMuted}`}>{T.signal[lang]}</p><p className={`text-2xl font-serif ${c.accText}`}>{money(invoice.sinal)}</p></div>
                <div className={`p-5 rounded-2xl ${c.bg} border ${c.border} text-center`}><p className={`text-sm mb-1 ${c.textMuted}`}>{T.rest[lang]}</p><p className="text-2xl font-serif">{money(invoice.rest)}</p></div>
              </div>
            </div>

            <label className={labelCls}>{T.payLabel[lang]}</label>
            <div className="grid grid-cols-3 gap-3 mb-10">
              {PAY_METHODS.map(m => (
                <label key={m.id} className={blockBtn(data.payment === m.id)}>
                  <input type="radio" className="sr-only" onChange={() => { vibrate(10); set({ payment: m.id }); }} />
                  {typeof m.label === 'string' ? m.label : m.label[lang]}
                </label>
              ))}
            </div>

            <div className={`p-6 rounded-3xl border ${c.card} mb-10`}>
              <h3 className="font-serif text-3xl mb-4">{T.reqTitle[lang]}</h3>
              <label className="flex items-start gap-4 cursor-pointer mb-5">
                <input type="checkbox" checked={reqOk} onChange={e => { vibrate(10); setReqOk(e.target.checked); if(!e.target.checked) set({req: ''}); }} className="mt-1 w-6 h-6 shrink-0" />
                <span className={`text-lg leading-relaxed ${c.textMuted}`}>{T.reqConsent[lang]}</span>
              </label>
              {reqOk && <textarea value={data.req} onChange={e => set({req: e.target.value})} placeholder={T.reqHold[lang]} className={`${inputCls} h-32 pt-5 resize-none`} />}
            </div>

            <label className="flex items-center gap-4 cursor-pointer mb-10">
              <input type="checkbox" checked={optIn} onChange={e => { vibrate(10); setOptIn(e.target.checked); }} className="w-6 h-6 shrink-0" />
              <span className={`text-lg ${c.textMuted}`}>{T.waPromo[lang]}</span>
            </label>
          </div>
        )}

        {/* ==========================================================================
            PASSO 4: FINALIZADO
            ========================================================================== */}
        {step === 4 && (
          <div className="animate-soft text-center flex flex-col items-center justify-center min-h-[60vh]">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 border border-current ${c.accText} ${isDark ? 'bg-amber-600/10' : 'bg-teal-800/10'}`}><Icon n="check" sz={40} /></div>
            <h1 className="font-serif text-6xl mb-6">{T.step4[lang]}</h1>
            <p className={`text-xl leading-relaxed mb-10 ${c.textMuted}`}>{T.step4Desc[lang]}</p>
            
            <button onClick={finishBooking} className={`${btnBig} mb-4`}>{T.btnWa[lang]}</button>
            <button onClick={async () => { await copyText(CONFIG.PIX_KEY); showToast('Chave copiada!'); }} className={`w-full h-[64px] rounded-2xl text-xl font-medium border ${c.border} flex items-center justify-center gap-3 mb-4`}><Icon n="copy" sz={20}/> {T.btnPix[lang]}</button>
            <button onClick={downloadICS} className={`w-full h-[64px] rounded-2xl text-xl font-medium border ${c.border} flex items-center justify-center gap-3 mb-8`}><Icon n="cal" sz={20}/> {T.btnCal[lang]}</button>
            
            <button onClick={() => { setStep(1); setData(p => ({...p, date: null, time: ''})); }} className="text-lg underline underline-offset-4">{T.btnReset[lang]}</button>
          </div>
        )}
      </main>

      {/* ==========================================================================
          RODAPÉ DE AÇÃO (Sticky)
          ========================================================================== */}
      {step > 0 && step < 4 && (
        <div className={`fixed bottom-0 inset-x-0 p-5 border-t shadow-2xl z-50 ${c.card}`}>
          <div className="max-w-xl mx-auto flex gap-4">
            <button onClick={() => { vibrate(10); setStep(s => s - 1); }} className={`w-20 h-[64px] rounded-2xl flex items-center justify-center border-2 transition-colors ${c.border} hover:border-current`}>&larr;</button>
            <button 
              onClick={() => {
                if (step === 2 && !step2Valid) { setTouched(true); showToast(T.errors.address[lang]); vibrate(50); return; }
                if (step === 3) { finishBooking(); return; }
                vibrate(20); setStep(s => s + 1);
              }} 
              className={`flex-1 h-[64px] rounded-2xl text-xl font-medium transition-transform active:scale-[0.98] ${c.accBg}`}
            >
              {step === 3 ? T.btnSend[lang] : T.btnReview[lang]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
