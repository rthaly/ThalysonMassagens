import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

/* ==========================================================================
   CONFIGURAÇÕES GERAIS E BANCO DE DADOS
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

/* ==========================================================================
   DICIONÁRIO DE TRADUÇÃO (PT / EN) E CONTEÚDOS
   ========================================================================== */
type Lang = 'pt' | 'en';

const T = {
  header: { pt: 'Thalyson Massagens', en: 'Thalyson Massages' },
  profileBtn: { pt: 'Ver perfil', en: 'View profile' },
  theme: { pt: 'Mudar tema', en: 'Toggle theme' },
  lang: { pt: 'Mudar idioma', en: 'Change language' },
  
  homeTitle: { pt: 'O seu momento\nde pausa.', en: 'Your moment\nof pause.' },
  guarantee1Title: { pt: 'Sem complicações', en: 'No complications' },
  guarantee1Desc: { pt: 'Levo óleos, toalhas e cremes. Você só precisa de uma cama ou sofá confortável.', en: 'I bring oils, towels, and lotions. You just need a comfortable bed or sofa.' },
  guarantee2Title: { pt: 'Privacidade Total', en: 'Total Privacy' },
  guarantee2Desc: { pt: 'Atendimento discreto. Seus dados só saem daqui quando você envia pelo WhatsApp.', en: 'Discreet service. Your data only leaves here when you send it via WhatsApp.' },
  ageCheck: { pt: 'Declaro ter 18 anos ou mais e li os termos.', en: 'I am 18 or older and have read the terms.' },
  btnStart: { pt: 'Iniciar agendamento', en: 'Start booking' },

  step1: { pt: 'Passo 1: Escolha o pacote', en: 'Step 1: Choose a package' },
  discountWarn: { pt: 'Primeira vez? Desconto de R$ 15 no final.', en: 'First time? R$ 15 discount at checkout.' },
  addonsTitle: { pt: 'Quer adicionar algo?', en: 'Want to add something?' },
  btnNext: { pt: 'Continuar', en: 'Continue' },

  step2: { pt: 'Passo 2: Local e Data', en: 'Step 2: Location and Date' },
  nameLabel: { pt: 'Como devo te chamar?', en: 'What should I call you?' },
  nameHold: { pt: 'Seu nome ou apelido', en: 'Your name or nickname' },
  locLabel: { pt: 'Onde será a sessão?', en: 'Where will the session be?' },
  locStudio: { pt: 'No meu espaço (Bela Vista)', en: 'At my studio (Bela Vista)' },
  locHome: { pt: 'No seu endereço', en: 'At your location' },
  cep: { pt: 'CEP', en: 'Zip code' },
  street: { pt: 'Rua / Avenida', en: 'Street / Avenue' },
  num: { pt: 'Nº', en: 'No.' },
  comp: { pt: 'Complemento', en: 'Apt / Suite' },
  hood: { pt: 'Bairro', en: 'Neighborhood' },
  peakWarn: { pt: `Horários de pico têm taxa de R$ ${CONFIG.PEAK_FEE}.`, en: `Peak hours have a R$ ${CONFIG.PEAK_FEE} fee.` },
  dateLabel: { pt: 'Escolha o dia', en: 'Choose the date' },
  timeLabel: { pt: 'Escolha o horário', en: 'Choose the time' },
  loadingBusy: { pt: 'Consultando agenda...', en: 'Checking schedule...' },

  step3: { pt: 'Passo 3: Resumo', en: 'Step 3: Summary' },
  summary: { pt: 'Revisão', en: 'Review' },
  total: { pt: 'Total', en: 'Total' },
  signalNow: { pt: 'Sinal agora (Pix)', en: 'Deposit now (Pix)' },
  restLater: { pt: 'Pagar na hora', en: 'Pay in person' },
  reqTitle: { pt: 'Pedido específico? (Opcional)', en: 'Specific request? (Optional)' },
  reqConsent: { pt: 'Aceito descrever um pedido que pode ser de natureza íntima apenas para avaliação.', en: 'I consent to describe a request of intimate nature solely for evaluation.' },
  reqHold: { pt: 'Descreva aqui...', en: 'Describe here...' },
  payLabel: { pt: 'Como pagará o restante?', en: 'How will you pay the rest?' },
  whatsappNews: { pt: 'Quero receber promoções no WhatsApp.', en: 'I want to receive promos on WhatsApp.' },
  btnSend: { pt: 'Enviar para WhatsApp', en: 'Send to WhatsApp' },

  step4: { pt: 'Tudo pronto!', en: 'All set!' },
  step4Desc: { pt: 'A reserva só é confirmada após minha resposta no WhatsApp. Envie a mensagem abaixo e aguarde para fazer o Pix do sinal.', en: 'The booking is only confirmed after my WhatsApp reply. Send the message and wait before sending the Pix deposit.' },
  btnWa: { pt: 'Abrir WhatsApp agora', en: 'Open WhatsApp now' },
  btnPix: { pt: 'Copiar Chave Pix', en: 'Copy Pix Key' },
  btnReset: { pt: 'Fazer outro agendamento', en: 'Make another booking' }
};

const PACKAGES = {
  pt: [
    { id: 'classica', title: 'Massagem Clássica', price: 180, min: 40, tags: ['Relaxamento', 'Sem Toque Íntimo'], desc: 'Força nas mãos para soltar musculatura e tensão.' },
    { id: 'sensitiva', title: 'Sensitiva & Prazer', price: 220, min: 60, tags: ['Tântrica', 'Finalização lingam'], desc: 'Clássica primeiro, depois toques leves e finalização lingam.' },
    { id: 'fusion', title: 'Sensações com a Barba', price: 290, min: 60, tags: ['Tântrica', 'Naturista', 'Uso de Barba'], desc: 'Clássica, toques com a barba pelo corpo e lingam.' },
    { id: 'completa', title: 'Corpo a Corpo & Interação', price: 390, min: 60, tags: ['Tântrica', 'Interação'], desc: 'O pacote sem barreiras. Proximidade física, troca de massagem e lingam.' },
    { id: 'aparo_solo', title: 'Apenas Depilação (Máquina)', price: 130, min: 40, tags: ['Estética'], desc: 'Aparo de pelos (até 3 lugares) com máquina.' },
  ],
  en: [
    { id: 'classica', title: 'Classic Massage', price: 180, min: 40, tags: ['Relaxation', 'No intimate touch'], desc: 'Firm pressure to release muscle tension.' },
    { id: 'sensitiva', title: 'Sensitive & Pleasure', price: 220, min: 60, tags: ['Tantric', 'Lingam ending'], desc: 'Classic first, then light touches and lingam ending.' },
    { id: 'fusion', title: 'Beard Sensations', price: 290, min: 60, tags: ['Tantric', 'Naturist', 'Beard use'], desc: 'Classic massage, beard strokes on body, and lingam.' },
    { id: 'completa', title: 'Body to Body & Interaction', price: 390, min: 60, tags: ['Tantric', 'Interaction'], desc: 'The ultimate package. Physical closeness, massage exchange, and lingam.' },
    { id: 'aparo_solo', title: 'Trimming Only (Clipper)', price: 130, min: 40, tags: ['Aesthetic'], desc: 'Hair trimming (up to 3 areas) using a clipper.' },
  ]
};

const ADDONS = {
  pt: [ { id: 'time', label: '+30 minutos extras', price: 75 }, { id: 'aparo', label: 'Aparar Pelos (até 3 lugares)', price: 130 } ],
  en: [ { id: 'time', label: '+30 extra minutes', price: 75 }, { id: 'aparo', label: 'Hair Trimming (up to 3 areas)', price: 130 } ]
};

const PAY_METHODS = {
  pt: [ { id: 'pix', label: 'Pix (-3%)' }, { id: 'card', label: 'Cartão / Card' }, { id: 'cash', label: 'Dinheiro / Cash' } ],
  en: [ { id: 'pix', label: 'Pix (-3%)' }, { id: 'card', label: 'Card' }, { id: 'cash', label: 'Cash' } ]
};

/* ==========================================================================
   ICONES
   ========================================================================== */
const ICONS = {
  check: 'M20 6L9 17l-5-5', close: 'M18 6L6 18 M6 6l12 12',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  globe: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-9.1-10.9h18.2M2.9 12.9h18.2M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M7 11V7a5 5 0 0 1 10 0v4',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1'
};
const Icon = memo(({ n, sz = 24, cls = '' }: { n: keyof typeof ICONS; sz?: number; cls?: string }) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${cls}`} aria-hidden="true"><path d={ICONS[n]} /></svg>
));

/* ==========================================================================
   UTILITÁRIOS
   ========================================================================== */
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };
const store = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
};

const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };

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
   APP PRINCIPAL
   ========================================================================== */
interface BookingData {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addons: Record<string, boolean>;
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => (store.get('t_lang') as Lang) || 'pt');
  const [isDark, setIsDark] = useState(() => store.get('t_theme') !== 'light');
  
  const [step, setStep] = useState(0);
  const [ageOk, setAgeOk] = useState(false);
  const [reqOk, setReqOk] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [data, setData] = useState<BookingData>({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', req: '', payment: '', packageId: 'classica', addons: {}
  });
  const set = (patch: Partial<BookingData>) => setData((p) => ({ ...p, ...patch }));

  const [now, setNow] = useState(() => new Date());
  const [busy, setBusy] = useState<{ s: number; e: number }[] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Efeitos e Listeners
  useEffect(() => { store.set('t_lang', lang); }, [lang]);
  useEffect(() => { store.set('t_theme', isDark ? 'dark' : 'light'); }, [isDark]);
  useEffect(() => { if (step > 0) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 4000);
  };

  const toggleTheme = () => { vibrate(10); setIsDark(!isDark); };
  const toggleLang = () => { vibrate(10); setLang(lang === 'pt' ? 'en' : 'pt'); };

  // Lógica de Preços
  const pkgList = PACKAGES[lang];
  const pkg = useMemo(() => pkgList.find((p) => p.id === data.packageId) || pkgList[0], [data.packageId, pkgList]);
  const isHome = data.locType === 'home';
  const hasReq = reqOk && data.req.trim().length > 2;

  const invoice = useMemo(() => {
    let dur = pkg.min, addonsTotal = 0;
    const activeAddons: typeof ADDONS.pt = [];
    ADDONS[lang].forEach((a) => {
      if (data.addons[a.id]) { addonsTotal += a.price; activeAddons.push(a); if (a.id === 'time') dur += 30; }
    });
    const reqFee = hasReq ? CONFIG.FETISH_FEE : 0;
    const base = pkg.price + addonsTotal + reqFee;
    const peakFee = isHome && PEAK_HOURS.includes(data.time) ? CONFIG.PEAK_FEE : 0;
    
    // Simplificando desconto: Se for primeira sessão, R$ 15 off. (Lógica de cupom removida para focar na facilidade do idoso)
    const discount = Math.min(CONFIG.FIRST_TIME_DISCOUNT, base);
    const afterDiscount = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.ceil(afterDiscount * CONFIG.PIX_DISCOUNT) : 0;
    
    const total = afterDiscount - pixDiscount + peakFee;
    const sinal = Math.min(CONFIG.SIGNAL_AMOUNT, total);
    return { base: pkg.price, addonsTotal, reqFee, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, activeAddons };
  }, [data, pkg, isHome, hasReq, lang]);

  // Busca CEP automático
  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const j = await res.json();
        if (!j.erro) set({ street: j.logradouro, bairro: j.bairro });
      } catch { /* erro silencioso, idoso não deve ser bombardeado com popups técnicos */ }
    }
  };

  // Agenda (Simulada se não tiver Supabase ativo)
  useEffect(() => {
    if (!data.date || !BACKEND_ON) return;
    rpc<{ s: number; e: number }[]>('get_busy_thalyson', { p_date: dateKey(data.date) }).then((r) => r.ok && setBusy(r.data));
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
    const out: { t: string; ok: boolean }[] = [];

    for (let m = CONFIG.OPEN_MIN; m + invoice.dur <= CONFIG.LAST_END_MIN; m += CONFIG.SLOT_STEP) {
      const end = m + invoice.dur + buffer;
      let ok = true;
      if (today && m < nowMin + lead) ok = false;
      if ((busy || []).some((x) => x.s < end && (x.e + buffer) > m)) ok = false;
      out.push({ t: fromMin(m), ok });
    }
    return out;
  }, [data.date, isHome, invoice.dur, now, busy]);

  // Mensagem WhatsApp final
  const finishBooking = () => {
    if (!data.payment) { showToast(lang === 'pt' ? 'Escolha como pagar.' : 'Choose a payment method.'); return; }
    setSubmitting(true);

    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
    const endT = fromMin(toMin(data.time) + invoice.dur);
    const loc = isHome ? `${data.street}, ${data.number} - ${data.bairro}` : 'Meu Espaço (Bela Vista)';

    let msg = `Olá Thalyson, fiz um agendamento no site:\n\n*NOME:* ${clean(data.name)}\n*DATA/HORA:* ${dStr}, das ${data.time} às ${endT}\n*LOCAL:* ${loc}\n\n*SERVIÇO:* ${pkg.title}\n`;
    invoice.activeAddons.forEach(a => msg += `➕ ${a.label}\n`);
    if (hasReq) msg += `\n*PEDIDO ESPECIAL:* ${clean(data.req)}\n`;
    msg += `\n*TOTAL:* ${money(invoice.total)}\n*SINAL AGORA:* ${money(invoice.sinal)}\n*PAGAR NA HORA:* ${money(invoice.rest)} (${data.payment.toUpperCase()})\n\nAguardando sua confirmação!`;

    const link = `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
    window.location.href = link;
    setStep(4);
    setSubmitting(false);
  };

  /* ==========================================================================
     CLASSES DE ESTILO (Tailwind sem depender de config complexa)
     ========================================================================== */
  const colors = isDark 
    ? { bg: 'bg-stone-950', text: 'text-stone-100', textMuted: 'text-stone-400', card: 'bg-stone-900 border-stone-800', border: 'border-stone-800', accent: 'bg-amber-500 text-stone-950', accentText: 'text-amber-400', input: 'bg-stone-950 border-stone-700 text-stone-100' }
    : { bg: 'bg-stone-100', text: 'text-stone-900', textMuted: 'text-stone-600', card: 'bg-white border-stone-300', border: 'border-stone-300', accent: 'bg-teal-700 text-white', accentText: 'text-teal-700', input: 'bg-white border-stone-400 text-stone-900' };

  const inputCls = `w-full ${colors.input} rounded-2xl px-6 h-16 text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all`;
  const labelCls = `block text-lg font-bold ${colors.text} mb-3 mt-6`;
  const btnBig = `w-full h-16 rounded-2xl text-xl font-bold flex items-center justify-center transition-transform active:scale-95 shadow-lg ${colors.accent}`;
  const blockBtn = (active: boolean) => `h-16 border-2 rounded-2xl flex items-center justify-center text-lg font-bold cursor-pointer transition-all ${active ? `border-amber-500 bg-amber-500/10 ${colors.text}` : `${colors.border} ${colors.textMuted}`}`;

  return (
    <div className={`min-h-screen font-sans ${colors.bg} ${colors.text} pb-32 transition-colors duration-300`}>
      
      {/* HEADER FIXO TOPO */}
      <header className={`sticky top-0 z-50 ${colors.card} border-b px-4 py-3 flex justify-between items-center shadow-sm`}>
        <div className="flex items-center gap-3">
          <img src={CONFIG.AVATAR} alt="Thalyson" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500" />
          <span className="font-bold text-lg">{T.header[lang]}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleLang} className={`p-3 rounded-full ${colors.bg}`} aria-label={T.lang[lang]}><Icon n="globe" /></button>
          <button onClick={toggleTheme} className={`p-3 rounded-full ${colors.bg}`} aria-label={T.theme[lang]}><Icon n={isDark ? 'sun' : 'moon'} /></button>
        </div>
      </header>

      {/* TOAST NOTIFICATION */}
      {toast && <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] ${isDark ? 'bg-stone-100 text-stone-900' : 'bg-stone-900 text-white'} px-8 py-4 rounded-full font-bold text-lg shadow-2xl animate-bounce`}>{toast}</div>}

      <main className="max-w-xl mx-auto px-5 pt-8">
        
        {/* PASSO 0: HOME / INÍCIO */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h1 className="text-5xl font-extrabold mb-10 leading-tight whitespace-pre-line">{T.homeTitle[lang]}</h1>
            
            <div className="space-y-6 mb-10">
              <div className={`p-6 rounded-3xl border ${colors.card}`}>
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-3 rounded-full ${colors.bg}`}><Icon n="shield" cls={colors.accentText} /></div>
                  <h2 className="text-xl font-bold">{T.guarantee2Title[lang]}</h2>
                </div>
                <p className={`text-lg ${colors.textMuted}`}>{T.guarantee2Desc[lang]}</p>
              </div>

              <div className={`p-6 rounded-3xl border ${colors.card}`}>
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-3 rounded-full ${colors.bg}`}><Icon n="lock" cls={colors.accentText} /></div>
                  <h2 className="text-xl font-bold">{T.guarantee1Title[lang]}</h2>
                </div>
                <p className={`text-lg ${colors.textMuted}`}>{T.guarantee1Desc[lang]}</p>
              </div>
            </div>

            <label className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 cursor-pointer mb-8">
              <input type="checkbox" checked={ageOk} onChange={(e) => { vibrate(10); setAgeOk(e.target.checked); }} className="mt-1 w-8 h-8 accent-amber-500" />
              <span className="text-lg font-bold pt-1">{T.ageCheck[lang]}</span>
            </label>

            <button disabled={!ageOk} onClick={() => { vibrate(30); setStep(1); }} className={`${btnBig} ${!ageOk ? 'opacity-50 grayscale' : ''}`}>
              {T.btnStart[lang]}
            </button>
          </div>
        )}

        {/* PASSO 1: PACOTES */}
        {step === 1 && (
          <div className="animate-fade-in pb-10">
            <h2 className={`text-2xl font-bold mb-6 ${colors.accentText}`}>{T.step1[lang]}</h2>
            
            <div className="space-y-4">
              {PACKAGES[lang].map((p) => {
                const on = data.packageId === p.id;
                return (
                  <label key={p.id} className={`block p-6 rounded-3xl border-2 transition-all cursor-pointer ${on ? `border-amber-500 bg-amber-500/5` : `${colors.card}`}`}>
                    <input type="radio" checked={on} onChange={() => { vibrate(10); set({ packageId: p.id }); }} className="sr-only" />
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-2xl font-bold">{p.title}</h3>
                      <span className="text-2xl font-extrabold text-amber-500">{money(p.price)}</span>
                    </div>
                    <p className={`text-lg leading-snug ${colors.textMuted}`}>{p.desc}</p>
                    <div className="mt-4 flex gap-2">
                      <span className={`px-3 py-1 rounded-lg text-sm font-bold bg-stone-500/20`}><Icon n="clock" sz={16} cls="inline mr-1 -mt-1"/>{p.min} min</span>
                    </div>
                  </label>
                );
              })}
            </div>

            <h3 className="text-xl font-bold mt-10 mb-4">{T.addonsTitle[lang]}</h3>
            <div className="space-y-3">
              {ADDONS[lang].filter(a => !(data.packageId === 'aparo_solo' && a.id === 'aparo')).map((a) => {
                const on = !!data.addons[a.id];
                return (
                  <label key={a.id} className={`flex justify-between items-center p-5 rounded-2xl border-2 cursor-pointer ${on ? 'border-amber-500 bg-amber-500/5' : colors.card}`}>
                    <input type="checkbox" checked={on} onChange={() => { vibrate(); set({ addons: { ...data.addons, [a.id]: !on } }); }} className="sr-only" />
                    <span className="text-lg font-bold flex items-center gap-3">
                      <div className={`w-8 h-8 rounded border-2 flex items-center justify-center ${on ? 'bg-amber-500 border-amber-500 text-stone-900' : colors.border}`}>{on && <Icon n="check" sz={20} />}</div>
                      {a.label}
                    </span>
                    <span className="text-lg font-bold text-amber-500">+{money(a.price)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* PASSO 2: DADOS, LOCAL E HORA */}
        {step === 2 && (
          <div className="animate-fade-in pb-10">
            <h2 className={`text-2xl font-bold mb-6 ${colors.accentText}`}>{T.step2[lang]}</h2>

            <label className={labelCls}>{T.nameLabel[lang]}</label>
            <input type="text" value={data.name} onChange={e => set({ name: e.target.value })} placeholder={T.nameHold[lang]} className={inputCls} />

            <label className={labelCls}>{T.locLabel[lang]}</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={blockBtn(data.locType === 'studio')}><input type="radio" className="sr-only" checked={data.locType==='studio'} onChange={() => {vibrate(); set({ locType: 'studio' })}}/>{T.locStudio[lang]}</label>
              <label className={blockBtn(data.locType === 'home')}><input type="radio" className="sr-only" checked={data.locType==='home'} onChange={() => {vibrate(); set({ locType: 'home' })}}/>{T.locHome[lang]}</label>
            </div>

            {isHome && (
              <div className={`mt-6 p-6 rounded-3xl border ${colors.card} space-y-4`}>
                <input type="tel" placeholder={T.cep[lang]} value={data.cep} onChange={e => handleCep(e.target.value)} className={inputCls} maxLength={9}/>
                <input type="text" placeholder={T.street[lang]} value={data.street} onChange={e => set({ street: e.target.value })} className={inputCls} />
                <div className="flex gap-4">
                  <input type="text" placeholder={T.num[lang]} value={data.number} onChange={e => set({ number: e.target.value })} className={`${inputCls} w-1/3`} />
                  <input type="text" placeholder={T.comp[lang]} value={data.comp} onChange={e => set({ comp: e.target.value })} className={`${inputCls} w-2/3`} />
                </div>
                <input type="text" placeholder={T.hood[lang]} value={data.bairro} onChange={e => set({ bairro: e.target.value })} className={inputCls} />
                <p className="text-amber-500 font-bold">{T.peakWarn[lang]}</p>
              </div>
            )}

            <label className={labelCls}>{T.dateLabel[lang]}</label>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scroll">
              {days.map(({ d }) => {
                const sel = sameDay(data.date, d);
                return (
                  <label key={dateKey(d)} className={`shrink-0 snap-start w-24 h-24 rounded-2xl flex flex-col justify-center items-center cursor-pointer border-2 transition-all ${sel ? 'border-amber-500 bg-amber-500/10' : colors.card}`}>
                    <input type="radio" className="sr-only" onChange={() => { vibrate(); set({ date: d, time: '' }); }} />
                    <span className="text-3xl font-black">{d.getDate()}</span>
                    <span className={`text-sm font-bold uppercase ${sel ? colors.text : colors.textMuted}`}>{d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short' })}</span>
                  </label>
                );
              })}
            </div>

            {data.date && (
              <div className="mt-6 animate-fade-in">
                <label className={labelCls}>{T.timeLabel[lang]}</label>
                <div className="grid grid-cols-3 gap-4">
                  {slots.map(({ t, ok }) => {
                    const sel = data.time === t;
                    if (!ok) return <div key={t} className={`h-16 flex items-center justify-center text-xl rounded-2xl opacity-30 line-through ${colors.border} border-2`}>{t}</div>;
                    return (
                      <label key={t} className={blockBtn(sel)}>
                        <input type="radio" className="sr-only" onChange={() => { vibrate(); set({ time: t }); }} />
                        <span className="text-2xl">{t}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PASSO 3: RESUMO E PAGAMENTO */}
        {step === 3 && (
          <div className="animate-fade-in pb-10">
            <h2 className={`text-2xl font-bold mb-6 ${colors.accentText}`}>{T.step3[lang]}</h2>

            <div className={`p-6 rounded-3xl border-2 ${colors.card} space-y-4 mb-8`}>
              <div className="flex justify-between border-b pb-4 border-stone-500/20">
                <span className={`text-lg ${colors.textMuted}`}>{T.summary[lang]}</span>
                <span className="text-lg font-bold text-right">{pkg.title} <br/> {data.date?.toLocaleDateString()} - {data.time}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-2xl font-bold">{T.total[lang]}</span>
                <span className="text-4xl font-black text-amber-500">{money(invoice.total)}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className={`p-4 rounded-xl ${colors.bg} text-center`}><p className={`text-sm font-bold ${colors.textMuted}`}>{T.signalNow[lang]}</p><p className="text-xl font-black">{money(invoice.sinal)}</p></div>
                <div className={`p-4 rounded-xl ${colors.bg} text-center`}><p className={`text-sm font-bold ${colors.textMuted}`}>{T.restLater[lang]}</p><p className="text-xl font-black">{money(invoice.rest)}</p></div>
              </div>
            </div>

            <label className={labelCls}>{T.payLabel[lang]}</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {PAY_METHODS[lang].map(m => (
                <label key={m.id} className={blockBtn(data.payment === m.id)}>
                  <input type="radio" className="sr-only" onChange={() => { vibrate(); set({ payment: m.id }); }} />
                  {m.label}
                </label>
              ))}
            </div>

            <div className={`p-6 rounded-3xl border ${colors.card} mb-8`}>
              <h3 className="text-xl font-bold mb-4">{T.reqTitle[lang]}</h3>
              <label className="flex items-start gap-4 cursor-pointer mb-4">
                <input type="checkbox" checked={reqOk} onChange={e => setReqOk(e.target.checked)} className="mt-1 w-8 h-8 accent-amber-500" />
                <span className={`text-lg ${colors.textMuted}`}>{T.reqConsent[lang]}</span>
              </label>
              {reqOk && <textarea value={data.req} onChange={e => set({req: e.target.value})} placeholder={T.reqHold[lang]} className={`${inputCls} h-24 pt-4 resize-none`} />}
            </div>
          </div>
        )}

        {/* PASSO 4: FINALIZADO */}
        {step === 4 && (
          <div className="animate-fade-in text-center flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-24 h-24 bg-amber-500 text-stone-900 rounded-full flex items-center justify-center mb-8"><Icon n="check" sz={48} /></div>
            <h1 className="text-4xl font-black mb-6">{T.step4[lang]}</h1>
            <p className={`text-xl leading-relaxed mb-10 ${colors.textMuted}`}>{T.step4Desc[lang]}</p>
            <button onClick={finishBooking} className={`${btnBig} mb-6`}>{T.btnWa[lang]}</button>
            <button onClick={async () => { await copyText(CONFIG.PIX_KEY); showToast(lang==='pt'?'Chave copiada!':'Key copied!'); }} className={`${btnBig} !bg-stone-500/20 !text-inherit mb-6`}><Icon n="copy" cls="mr-2"/> {T.btnPix[lang]}</button>
            <button onClick={() => { setStep(1); setData(p => ({...p, date: null, time: ''})); }} className="text-lg font-bold underline p-4">{T.btnReset[lang]}</button>
          </div>
        )}

      </main>

      {/* BARRA FIXA DE AÇÃO NO RODAPÉ (Para os passos 1, 2 e 3) */}
      {step > 0 && step < 4 && (
        <div className={`fixed bottom-0 inset-x-0 p-5 border-t-2 shadow-2xl ${colors.card} z-50`}>
          <div className="max-w-xl mx-auto flex gap-4">
            <button onClick={() => setStep(s => s - 1)} className={`w-20 h-16 rounded-2xl flex items-center justify-center font-bold text-xl border-2 ${colors.border}`}>&larr;</button>
            <button 
              onClick={() => {
                if (step === 2 && (!data.name || !data.date || !data.time || (isHome && !data.street))) { showToast(lang === 'pt' ? 'Preencha os campos' : 'Fill all fields'); return; }
                if (step === 3) { finishBooking(); return; }
                vibrate(20); setStep(s => s + 1);
              }} 
              className={`flex-1 h-16 rounded-2xl text-xl font-black transition-transform active:scale-95 shadow-lg ${colors.accent}`}
            >
              {step === 3 ? T.btnSend[lang] : T.btnNext[lang]}
            </button>
          </div>
        </div>
      )}

      {/* Estilos CSS extras (esconder scrollbar nativa) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
      `}} />
    </div>
  );
}
