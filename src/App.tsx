import { useState, useEffect, useMemo, useRef, memo } from 'react';

/* ==========================================================================
   1. CONFIGURAÇÕES DO NEGÓCIO (SEM BANCO DE DADOS)
   ========================================================================== */
const CONFIG = {
  PHONE: '5517991360413',
  PIX_KEY: '62922530000144',
  INSTAGRAM: 'https://www.instagram.com/relaxarhojesp',
  AVATAR: '/thalyson.jpg',
  
  // Regras Financeiras
  SIGNAL_AMOUNT: 40,
  FIRST_TIME_DISCOUNT: 15,
  FETISH_FEE: 140,
  PEAK_FEE: 18,
  PIX_DISCOUNT: 0.03, // 3%
  
  // Regras de Agenda
  OPEN_MIN: 9 * 60, // 09:00
  LAST_END_MIN: 23 * 60 + 30, // 23:30
  SLOT_STEP: 60, // A cada 60 min
  MIN_LEAD_STUDIO: 60, // 1h de antecedência mínima
  MIN_LEAD_HOME: 120, // 2h de antecedência mínima
  DAYS_AHEAD: 15,
  DAYS_OFF: [], // 0 = Dom, 1 = Seg...
};

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const K = { lang: 'thaly_lang', theme: 'thaly_theme', cid: 'thaly_cid', ret: 'thaly_ret' };
type Lang = 'pt' | 'en';

/* ==========================================================================
   2. COPYWRITING E TRADUÇÃO (Foco em Conversão e Clareza)
   ========================================================================== */
const T = {
  brand: { pt: 'Thalyson Massagens', en: 'Thalyson Massages' },
  heroTitle: { pt: 'Sua rotina pesa.\nDeixe esse peso aqui.', en: 'Your routine is heavy.\nLeave that weight here.' },
  heroSub: { pt: 'Atendimento premium exclusivo para homens. Eu levo óleos, toalhas e toda a técnica. Você só precisa de um lugar confortável para relaxar.', en: 'Premium service exclusive for men. I bring oils, towels, and technique. You just need a comfortable place to relax.' },
  btnStart: { pt: 'Reservar meu momento', en: 'Book my moment' },
  
  card1: { pt: 'Privacidade Absoluta', en: 'Absolute Privacy' },
  card1Desc: { pt: 'Sem cadastros longos. Seus dados vão direto para o meu WhatsApp de forma segura e privada.', en: 'No long sign-ups. Your data goes securely and privately straight to my WhatsApp.' },
  card2: { pt: 'Discrição e Respeito', en: 'Discretion and Respect' },
  card2Desc: { pt: 'Ambiente livre de julgamentos. Foco total em aliviar as tensões do seu corpo (maiores de 18 anos).', en: 'Judgment-free zone. Complete focus on relieving your body\'s tension (18+ only).' },
  consentAdult: { pt: 'Declaro ter 18 anos ou mais e concordo com os termos.', en: 'I am 18 or older and agree to the terms.' },

  step1Title: { pt: 'O que o seu corpo precisa?', en: 'What does your body need?' },
  discountBadge: { pt: 'Presente: R$ 15 de desconto na sua primeira sessão (aplicado no final).', en: 'Gift: R$ 15 off your first session (applied at checkout).' },
  addonsTitle: { pt: 'Quer uma experiência mais longa?', en: 'Want a longer experience?' },
  
  step2Title: { pt: 'Onde e Quando?', en: 'Where and When?' },
  nameLabel: { pt: 'Como prefere ser chamado?', en: 'How prefer to be called?' },
  locLabel: { pt: 'Onde será a sessão?', en: 'Session location?' },
  locStudio: { pt: 'No meu espaço', en: 'At my studio' },
  locHome: { pt: 'No seu endereço', en: 'At your address' },
  studioInfo: { pt: 'Meu espaço fica na Bela Vista (Centro Histórico). O endereço exato é enviado para você no WhatsApp após a confirmação.', en: 'My space is in Bela Vista (Historic Center). The exact address is sent to you on WhatsApp upon confirmation.' },
  cep: { pt: 'CEP (Busca automática)', en: 'ZIP Code' },
  street: { pt: 'Rua / Avenida', en: 'Street / Avenue' },
  num: { pt: 'Número', en: 'Number' },
  comp: { pt: 'Complemento (Opcional)', en: 'Apt / Suite (Optional)' },
  hood: { pt: 'Bairro', en: 'Neighborhood' },
  peakWarn: { pt: `Atenção: Horários de pico no seu endereço têm acréscimo de R$ ${CONFIG.PEAK_FEE}.`, en: `Note: Peak hours at your address include a R$ ${CONFIG.PEAK_FEE} fee.` },
  dateLabel: { pt: 'Qual o melhor dia?', en: 'What is the best day?' },
  timeLabel: { pt: 'Qual o melhor horário?', en: 'What is the best time?' },
  demonstrative: { pt: 'Horários sujeitos à confirmação da minha agenda.', en: 'Slots subject to schedule confirmation.' },
  noSlots: { pt: 'Horários esgotados ou muito próximos para hoje. Tente outra data.', en: 'Slots sold out or too close for today. Try another date.' },

  step3Title: { pt: 'Revisão e Pagamento', en: 'Review and Payment' },
  sumServ: { pt: 'Serviço', en: 'Service' },
  sumAdd: { pt: 'Adicionais', en: 'Add-ons' },
  sumPeak: { pt: 'Deslocamento (Horário de pico)', en: 'Travel (Peak hour)' },
  sumReq: { pt: 'Pedido específico (Avaliação)', en: 'Specific request' },
  sumDisc: { pt: 'Desconto (1ª Sessão)', en: 'Discount (1st Session)' },
  sumPix: { pt: 'Desconto Pix', en: 'Pix Discount' },
  total: { pt: 'Valor Total', en: 'Total' },
  signalNow: { pt: 'Sinal para confirmar (Via Pix)', en: 'Deposit to confirm (Pix)' },
  restLater: { pt: 'Pagar após a sessão', en: 'Pay after session' },
  
  reqLabel: { pt: 'Algum pedido específico ou área de foco? (Opcional)', en: 'Any specific request or focus area? (Optional)' },
  reqConsent: { pt: 'Consinto em enviar este detalhe para avaliação. Se inviável, não será cobrado.', en: 'I consent to send this detail for evaluation. If unfeasible, it won\'t be charged.' },
  reqHold: { pt: 'Ex: Foco intenso na lombar, toque mais leve...', en: 'Ex: Intense focus on lower back, lighter touch...' },
  payLabel: { pt: 'Como você vai pagar o restante da sessão?', en: 'How will you pay the rest of the session?' },
  promoOpt: { pt: 'Aceito receber raras mensagens com promoções exclusivas.', en: 'I accept receiving rare exclusive promos.' },
  
  btnNext: { pt: 'Continuar', en: 'Continue' },
  btnBack: { pt: 'Voltar', en: 'Back' },
  btnSend: { pt: 'Solicitar via WhatsApp', en: 'Request via WhatsApp' },

  step4Title: { pt: 'Quase lá!', en: 'Almost there!' },
  step4Sub: { pt: 'Sua reserva está pronta para ser enviada. Envie a mensagem no WhatsApp e aguarde meu "OK" antes de transferir o Pix do sinal.', en: 'Your booking is ready. Send the WhatsApp message and wait for my "OK" before transferring the deposit.' },
  btnWa: { pt: 'Abrir WhatsApp', en: 'Open WhatsApp' },
  btnPix: { pt: 'Copiar Chave Pix', en: 'Copy Pix Key' },
  btnCal: { pt: 'Salvar no calendário', en: 'Save to calendar' },
  btnReset: { pt: 'Fazer outro agendamento', en: 'Make another booking' },
};

const PACKAGES = [
  { id: 'classica', title: { pt: 'Massagem Clássica', en: 'Classic Massage' }, price: 180, min: 40, tags: { pt: ['Relaxamento', 'Sem Toque Íntimo'], en: ['Relaxation', 'No Intimate Touch'] }, desc: { pt: 'O essencial para quem está com o corpo pesado da rotina. Uso a força das mãos para destravar a musculatura e soltar a tensão profunda.', en: 'Essential for a tired body. Firm hand pressure to unlock muscles and release deep tension.' } },
  { id: 'sensitiva', title: { pt: 'Sensitiva & Prazer', en: 'Sensitive & Pleasure' }, price: 220, min: 60, tags: { pt: ['Tântrica', 'Finalização lingam'], en: ['Tantric', 'Lingam ending'] }, desc: { pt: 'Começamos desatando nós com a massagem clássica. Quando você relaxar de verdade, os toques ficam sutis e encerramos com a massagem lingam.', en: 'Starts with classic massage. Once you relax, touches lighten, ending with lingam.' } },
  { id: 'fusion', title: { pt: 'Sensações com a Barba', en: 'Beard Sensations' }, price: 290, min: 60, tags: { pt: ['Tântrica', 'Naturista', 'Barba'], en: ['Tantric', 'Naturist', 'Beard'] }, desc: { pt: 'Ficamos totalmente à vontade. Massagem clássica firme, seguida do uso sensorial da minha barba pelo seu corpo e finalização.', en: 'Totally free. Classic massage, sensory use of my beard on your body, and ending.' } },
  { id: 'completa', title: { pt: 'Corpo a Corpo & Interação', en: 'Body to Body & Interaction' }, price: 390, min: 60, tags: { pt: ['Tântrica', 'Interação Total'], en: ['Tantric', 'Full Interaction'] }, desc: { pt: 'A experiência máxima sem barreiras. Massagem profunda, proximidade com gel corpo a corpo, espaço para você interagir e relaxamento total no final.', en: 'The ultimate experience. Deep massage, body-to-body gel, freedom to interact, and total relaxation.' } },
  { id: 'aparo_solo', title: { pt: 'Apenas Depilação', en: 'Trimming Only' }, price: 130, min: 40, tags: { pt: ['Estética', 'Máquina'], en: ['Aesthetic', 'Clipper'] }, desc: { pt: 'Foco na estética. Aparo de pelos em até 3 regiões do corpo usando máquina (Pente 1 e 3). Não inclui massagem.', en: 'Aesthetic focus. Hair trimming in up to 3 body areas using clippers. No massage included.' } },
];

const ADDONS = [
  { id: 'time', label: { pt: 'Estender sessão (+30 min)', en: 'Extend session (+30 min)' }, price: 75 },
  { id: 'aparo', label: { pt: 'Aparar pelos (Até 3 áreas)', en: 'Trim hair (Up to 3 areas)' }, price: 130 },
];

const PAY_METHODS = [
  { id: 'pix', label: 'Pix (-3%)' },
  { id: 'card', label: { pt: 'Cartão de Crédito', en: 'Credit Card' } },
  { id: 'cash', label: { pt: 'Dinheiro', en: 'Cash' } },
];

/* ==========================================================================
   3. ÍCONES OTIMIZADOS
   ========================================================================== */
const ICONS = {
  check: 'M20 6L9 17l-5-5', close: 'M18 6L6 18 M6 6l12 12',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  sun: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
  globe: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm-9.1-10.9h18.2M2.9 12.9h18.2M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1', cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4', map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
};

const Icon = memo(({ n, sz = 24, cls = '' }: { n: keyof typeof ICONS; sz?: number; cls?: string }) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${cls}`} aria-hidden="true"><path d={ICONS[n]} /></svg>
));

/* ==========================================================================
   4. HELPERS
   ========================================================================== */
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 15) => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };
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
const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();

/* ==========================================================================
   5. APLICATIVO FRONTEND PURO
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
  
  const isReturning = store.get(K.ret) === 'yes';

  // Injetar Fontes
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
    toastTimer.current = setTimeout(() => setToast(''), 4000);
  };

  // Financeiro Matemático
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

  // Busca CEP Frontend
  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const j = await res.json();
        if (!j.erro) set({ street: j.logradouro, bairro: j.bairro });
      } catch { /* erro silencioso, não assusta o usuário */ }
    }
  };

  // Motor de Agendamento Frontend (Sem DB)
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
      let ok = true;
      if (today && m < nowMin + lead) ok = false; 
      out.push({ t: fromMin(m), ok });
    }
    return out;
  }, [data.date, isHome, invoice.dur, now]);

  const step2Valid = data.name.trim().length >= 2 && data.date && data.time && (!isHome || (data.street && data.number && data.bairro));

  // Exportar Agenda e WhatsApp
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
    const a = document.createElement('a'); a.href = url; a.download = 'massagem.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const getWhatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
    const endT = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';
    const loc = isHome ? `📍 *Local:* No meu endereço\n${clean(data.street)}, ${clean(data.number)} - ${clean(data.bairro)}` : `📍 *Local:* No espaço (Bela Vista, SP)`;
    
    let msg = `Olá Thalyson, finalizei o agendamento no site!\n\n*NOME:* ${clean(data.name)}\n*DATA:* ${dStr} \n*HORÁRIO:* ${data.time} às ${endT}\n${loc}\n\n*SERVIÇO:* ${pkg.title[lang]}\n`;
    
    invoice.activeAddons.forEach(a => msg += `➕ ${a.label[lang]}\n`);
    if (hasReq) msg += `\n*PEDIDO P/ AVALIAÇÃO:* "${clean(data.req)}"\n`;
    
    msg += `\n*TOTAL:* ${money(invoice.total)}\n*SINAL PARA CONFIRMAR:* ${money(invoice.sinal)} (Pix)\n*PAGAR APÓS SESSÃO:* ${money(invoice.rest)} (${(PAY_METHODS.find(m => m.id === data.payment)?.label || data.payment).toString().replace(/ \(.*\)/, '')})\n\n`;
    msg += 'Declaro ter mais de 18 anos.\n';
    if (optIn) msg += 'Aceito receber promoções esporádicas.\n';
    msg += '\nAguardando sua confirmação de agenda para transferir o Pix!';
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const finishBooking = () => {
    if (!data.payment) { vibrate(50); showToast(lang === 'pt' ? 'Selecione a forma de pagamento' : 'Select payment method'); return; }
    store.set(K.ret, 'yes');
    vibrate([30, 50]);
    window.open(getWhatsappLink(), '_blank');
    setStep(4);
  };

  /* ==========================================================================
     6. DESIGN SYSTEM E ESTILOS UI (Acessibilidade + Luxo + Altíssima Conversão)
     ========================================================================== */
  const c = isDark 
    ? { bg: 'bg-[#121110]', text: 'text-[#F5F5F4]', textMuted: 'text-[#A8A29E]', card: 'bg-[#1C1917]', border: 'border-[#292524]', accent: 'text-[#D97706]', btnAccent: 'bg-[#D97706] text-[#121110]', input: 'bg-[#121110] border-[#44403C] focus:border-[#D97706] text-white' }
    : { bg: 'bg-[#F9F9F8]', text: 'text-[#1C1917]', textMuted: 'text-[#57534E]', card: 'bg-white', border: 'border-[#E7E5E4]', accent: 'text-[#0F766E]', btnAccent: 'bg-[#0F766E] text-white', input: 'bg-white border-[#D6D3D1] focus:border-[#0F766E] text-[#1C1917]' };

  // Inputs e Botões otimizados para toque (min 64px)
  const inputCls = `w-full rounded-3xl px-6 h-[64px] text-lg border-2 transition-all outline-none shadow-sm ${c.input}`;
  const labelCls = `block text-lg font-bold mb-4 mt-8 ${c.text}`;
  const btnBig = `w-full h-[64px] rounded-3xl text-xl font-bold flex items-center justify-center transition-all active:scale-[0.97] shadow-lg ${c.btnAccent}`;
  const blockBtn = (active: boolean) => `h-[64px] rounded-3xl border-2 flex items-center justify-center text-lg font-bold cursor-pointer transition-all ${active ? `border-current ${c.accent} ${isDark ? 'bg-[#D97706]/10' : 'bg-[#0F766E]/10'}` : `${c.border} ${c.textMuted} hover:border-[#78716C]`}`;

  const css = (
    <style dangerouslySetInnerHTML={{ __html: `
      .font-serif { font-family: 'Instrument Serif', Georgia, serif; letter-spacing: -0.01em; line-height: 1.05; }
      .font-sans { font-family: 'Hanken Grotesk', system-ui, -apple-system, sans-serif; }
      .hide-scroll::-webkit-scrollbar { display: none; }
      .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      @keyframes floatIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: none; } }
      .animate-float { animation: floatIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    `}} />
  );

  return (
    <div className={`min-h-screen font-sans ${c.bg} ${c.text} pb-36 transition-colors duration-300`}>
      {css}

      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-50 ${c.bg} border-b ${c.border} px-5 py-4 flex justify-between items-center shadow-sm`}>
        <div className="flex items-center gap-3">
          <img src={CONFIG.AVATAR} alt="Thalyson" className={`w-12 h-12 rounded-full object-cover border-2 border-current ${c.accent}`} />
          <span className="font-serif text-2xl pt-1 tracking-wide">{T.brand[lang]}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleLang} className={`p-3 rounded-full ${c.card} border ${c.border} shadow-sm active:scale-95`} aria-label="Idioma"><Icon n="globe" sz={20} /></button>
          <button onClick={toggleTheme} className={`p-3 rounded-full ${c.card} border ${c.border} shadow-sm active:scale-95`} aria-label="Tema"><Icon n={isDark ? 'sun' : 'moon'} sz={20} /></button>
        </div>
      </header>

      {/* ALERTA (TOAST) */}
      {toast && <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[200] ${isDark ? 'bg-stone-200 text-stone-900' : 'bg-slate-900 text-white'} px-8 py-4 rounded-full font-bold text-lg shadow-2xl animate-float whitespace-nowrap`}>{toast}</div>}

      <main className="max-w-xl mx-auto px-5 pt-8">
        
        {/* ==========================================================================
            PASSO 0: LANDING PAGE
            ========================================================================== */}
        {step === 0 && (
          <div className="animate-float">
            <h1 className="font-serif text-[3.25rem] leading-[1.05] mb-6 whitespace-pre-line">{T.heroTitle[lang]}</h1>
            <p className={`text-xl leading-relaxed mb-10 ${c.textMuted}`}>{T.heroSub[lang]}</p>
            
            <div className="space-y-4 mb-10">
              <div className={`p-6 rounded-3xl border-2 ${c.card} ${c.border}`}>
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#D97706]/10' : 'bg-[#0F766E]/10'} ${c.accent}`}><Icon n="shield" sz={24} /></div>
                  <h2 className="font-serif text-3xl">{T.card1[lang]}</h2>
                </div>
                <p className={`text-lg leading-relaxed ${c.textMuted}`}>{T.card1Desc[lang]}</p>
              </div>
              <div className={`p-6 rounded-3xl border-2 ${c.card} ${c.border}`}>
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-[#D97706]/10' : 'bg-[#0F766E]/10'} ${c.accent}`}><Icon n="lock" sz={24} /></div>
                  <h2 className="font-serif text-3xl">{T.card2[lang]}</h2>
                </div>
                <p className={`text-lg leading-relaxed ${c.textMuted}`}>{T.card2Desc[lang]}</p>
              </div>
            </div>

            <label className={`flex items-start gap-4 p-5 rounded-3xl cursor-pointer border-2 transition-colors ${ageOk ? `border-current ${c.accent}` : c.border} mb-8`}>
              <input type="checkbox" checked={ageOk} onChange={(e) => { vibrate(10); setAgeOk(e.target.checked); }} className="mt-1 w-7 h-7 shrink-0" />
              <span className={`text-lg font-medium pt-1 ${c.text}`}>{T.consentAdult[lang]}</span>
            </label>

            <button disabled={!ageOk} onClick={() => { vibrate(30); setStep(1); }} className={`${btnBig} ${!ageOk ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}>
              {T.btnStart[lang]}
            </button>
          </div>
        )}

        {/* ==========================================================================
            PASSO 1: SERVIÇOS
            ========================================================================== */}
        {step === 1 && (
          <div className="animate-float pb-10">
            <h1 className="font-serif text-5xl mb-8">{T.step1Title[lang]}</h1>
            
            {!isReturning && (
              <div className={`p-5 rounded-3xl mb-8 flex gap-4 items-center border-2 ${isDark ? 'bg-[#D97706]/10 border-[#D97706]/30' : 'bg-[#0F766E]/10 border-[#0F766E]/30'}`}>
                <Icon n="check" sz={24} cls={c.accent} />
                <p className={`text-lg font-bold ${c.accent}`}>{T.discountBadge[lang]}</p>
              </div>
            )}

            <div className="space-y-4">
              {PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <label key={p.id} className={`block p-6 rounded-[2rem] border-4 transition-all cursor-pointer ${on ? `border-current ${c.accent} ${c.card} shadow-md` : `${c.border} hover:border-[#78716C] ${c.bg}`}`}>
                    <input type="radio" checked={on} onChange={() => { vibrate(10); set({ packageId: p.id }); }} className="sr-only" />
                    <div className="flex justify-between items-start mb-3">
                      <h3 className={`font-serif text-[2rem] leading-none ${c.text}`}>{p.title[lang]}</h3>
                      <span className="font-bold text-2xl mt-1">{money(p.price)}</span>
                    </div>
                    <p className={`text-lg leading-relaxed mb-5 ${on ? c.text : c.textMuted}`}>{p.desc[lang]}</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 border-2 ${c.border} ${c.text}`}><Icon n="clock" sz={16} />{p.min} min</span>
                      {p.tags[lang].map((t) => <span key={t} className={`px-4 py-2 rounded-xl text-sm font-bold border-2 ${c.border} ${c.textMuted}`}>{t}</span>)}
                    </div>
                  </label>
                );
              })}
            </div>

            <h3 className="font-serif text-4xl mt-12 mb-6">{T.addonsTitle[lang]}</h3>
            <div className="space-y-4">
              {ADDONS.filter(a => !(data.packageId === 'aparo_solo' && a.id === 'aparo')).map((a) => {
                const on = !!data.addons[a.id];
                return (
                  <label key={a.id} className={`flex justify-between items-center p-6 rounded-3xl border-4 cursor-pointer transition-colors ${on ? `border-current ${c.accent} ${c.card}` : `${c.border} ${c.bg}`}`}>
                    <input type="checkbox" checked={on} onChange={() => { vibrate(10); set({ addons: { ...data.addons, [a.id]: !on } }); }} className="sr-only" />
                    <span className={`text-xl font-bold flex items-center gap-4 ${c.text}`}>
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-colors ${on ? `bg-current border-current text-white` : c.border}`}>{on && <Icon n="check" sz={20} />}</div>
                      {a.label[lang]}
                    </span>
                    <span className="text-xl font-bold">+{money(a.price)}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* ==========================================================================
            PASSO 2: DATA E LOCAL
            ========================================================================== */}
        {step === 2 && (
          <div className="animate-float pb-10">
            <h1 className="font-serif text-5xl mb-8">{T.step2Title[lang]}</h1>

            <label className={labelCls}>{T.nameLabel[lang]}</label>
            <input type="text" value={data.name} onChange={e => set({ name: e.target.value })} placeholder={T.nameHold[lang]} className={inputCls} />

            <label className={labelCls}>{T.locLabel[lang]}</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={blockBtn(data.locType === 'studio')}><input type="radio" className="sr-only" checked={data.locType==='studio'} onChange={() => {vibrate(10); set({ locType: 'studio' })}}/>{T.locStudio[lang]}</label>
              <label className={blockBtn(data.locType === 'home')}><input type="radio" className="sr-only" checked={data.locType==='home'} onChange={() => {vibrate(10); set({ locType: 'home' })}}/>{T.locHome[lang]}</label>
            </div>

            {isHome ? (
              <div className="mt-6 space-y-4 animate-float">
                <input type="tel" placeholder={T.cep[lang]} value={data.cep} onChange={e => handleCep(e.target.value)} className={inputCls} maxLength={9}/>
                <input type="text" placeholder={T.street[lang]} value={data.street} onChange={e => set({ street: e.target.value })} className={inputCls} />
                <div className="flex gap-4">
                  <input type="text" placeholder={T.num[lang]} value={data.number} onChange={e => set({ number: e.target.value })} className={`${inputCls} w-1/3`} />
                  <input type="text" placeholder={T.comp[lang]} value={data.comp} onChange={e => set({ comp: e.target.value })} className={`${inputCls} w-2/3`} />
                </div>
                <input type="text" placeholder={T.hood[lang]} value={data.bairro} onChange={e => set({ bairro: e.target.value })} className={inputCls} />
                <p className={`text-sm font-bold mt-2 ${c.accent}`}>{T.peakWarn[lang]}</p>
              </div>
            ) : (
              <div className={`mt-6 p-6 rounded-3xl border-2 ${c.border} ${c.card} flex gap-4 items-start`}>
                <Icon n="map" sz={28} cls={`mt-1 ${c.accent}`} />
                <p className={`text-lg leading-relaxed ${c.textMuted}`}>{T.studioInfo[lang]}</p>
              </div>
            )}

            <label className={labelCls}>{T.dateLabel[lang]}</label>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scroll">
              {days.map(({ d }) => {
                const sel = sameDay(data.date, d);
                return (
                  <label key={dateKey(d)} className={`shrink-0 snap-start w-[110px] h-[120px] rounded-3xl flex flex-col justify-center items-center cursor-pointer border-4 transition-colors ${sel ? `border-current ${c.accent} ${c.card}` : `${c.border} ${c.bg} hover:border-[#78716C]`}`}>
                    <input type="radio" className="sr-only" onChange={() => { vibrate(10); set({ date: d, time: '' }); }} />
                    <span className={`font-serif text-5xl mb-1 ${sel ? c.accent : c.text}`}>{d.getDate()}</span>
                    <span className={`text-sm font-bold uppercase ${c.textMuted}`}>{d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { month: 'short' }).replace('.', '')}</span>
                  </label>
                );
              })}
            </div>

            {data.date && (
              <div className="mt-6 animate-float">
                <div className="flex justify-between items-baseline mb-4">
                  <label className={`text-lg font-bold ${c.text}`}>{T.timeLabel[lang]}</label>
                  <span className={`text-sm font-bold ${c.textMuted}`}>{invoice.dur} min</span>
                </div>
                
                {slots.filter(s => s.ok).length === 0 ? (
                  <p className={`text-xl text-center py-8 font-medium ${c.textMuted}`}>{T.noSlots[lang]}</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {slots.map(({ t, ok }) => {
                      const sel = data.time === t;
                      const peak = isHome && PEAK_HOURS.includes(t);
                      if (!ok) return <div key={t} className={`h-[64px] flex items-center justify-center text-lg font-bold rounded-3xl opacity-30 line-through border-2 ${c.border} ${c.textMuted}`}>{t}</div>;
                      return (
                        <label key={t} className={`${blockBtn(sel)} flex flex-col relative`}>
                          <input type="radio" className="sr-only" onChange={() => { vibrate(10); set({ time: t }); }} />
                          <span>{t}</span>
                          {peak && <span className={`absolute -bottom-6 text-[12px] font-black whitespace-nowrap ${c.accent}`}>+ {money(CONFIG.PEAK_FEE).replace(',00', '')}</span>}
                        </label>
                      );
                    })}
                  </div>
                )}
                <p className={`text-sm font-bold text-center mt-8 ${c.textMuted}`}>{T.demonstrative[lang]}</p>
              </div>
            )}
          </div>
        )}

        {/* ==========================================================================
            PASSO 3: RESUMO E FECHAMENTO
            ========================================================================== */}
        {step === 3 && (
          <div className="animate-float pb-10">
            <h1 className="font-serif text-5xl mb-8">{T.step3Title[lang]}</h1>

            <div className={`p-6 rounded-[2rem] border-2 ${c.border} ${c.card} space-y-4 mb-8 shadow-sm`}>
              <div className={`flex justify-between pb-5 border-b-2 ${c.border}`}>
                <span className={`text-xl font-bold ${c.textMuted}`}>{T.sumServ[lang]}</span>
                <span className="text-xl font-bold text-right">{pkg.title[lang]}<br/>{data.date?.toLocaleDateString()} · {data.time}</span>
              </div>
              <div className="space-y-3 py-3 text-lg font-medium">
                <div className="flex justify-between"><span className={c.textMuted}>{T.sumServ[lang]}</span><span>{money(invoice.base - invoice.reqFee)}</span></div>
                {invoice.addonsTotal > 0 && <div className="flex justify-between"><span className={c.textMuted}>{T.sumAdd[lang]}</span><span>+{money(invoice.addonsTotal)}</span></div>}
                {invoice.reqFee > 0 && <div className="flex justify-between"><span className={c.textMuted}>{T.sumReq[lang]}</span><span>+{money(invoice.reqFee)}</span></div>}
                {invoice.peakFee > 0 && <div className="flex justify-between"><span className={c.textMuted}>{T.sumPeak[lang]}</span><span>+{money(invoice.peakFee)}</span></div>}
                {invoice.discount > 0 && <div className={`flex justify-between font-bold ${c.accent}`}><span>{T.sumDisc[lang]}</span><span>-{money(invoice.discount)}</span></div>}
                {invoice.pixDiscount > 0 && <div className={`flex justify-between font-bold ${c.accent}`}><span>{T.sumPix[lang]}</span><span>-{money(invoice.pixDiscount)}</span></div>}
              </div>
              <div className={`flex justify-between items-end pt-5 border-t-2 ${c.border}`}>
                <span className="text-2xl font-bold">{T.total[lang]}</span>
                <span className={`font-serif text-6xl ${c.accent}`}>{money(invoice.total)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className={`p-5 rounded-3xl ${c.bg} border-2 ${c.border} text-center`}><p className={`text-sm font-bold mb-2 ${c.textMuted}`}>{T.signalNow[lang]}</p><p className={`text-3xl font-serif ${c.accent}`}>{money(invoice.sinal)}</p></div>
                <div className={`p-5 rounded-3xl ${c.bg} border-2 ${c.border} text-center`}><p className={`text-sm font-bold mb-2 ${c.textMuted}`}>{T.restLater[lang]}</p><p className="text-3xl font-serif">{money(invoice.rest)}</p></div>
              </div>
            </div>

            <label className={labelCls}>{T.payLabel[lang]}</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {PAY_METHODS.map(m => (
                <label key={m.id} className={blockBtn(data.payment === m.id)}>
                  <input type="radio" className="sr-only" onChange={() => { vibrate(10); set({ payment: m.id }); }} />
                  {typeof m.label === 'string' ? m.label : m.label[lang]}
                </label>
              ))}
            </div>

            <div className={`p-6 rounded-[2rem] border-2 ${c.border} ${c.card} mb-10`}>
              <h3 className="font-serif text-3xl mb-5">{T.reqLabel[lang]}</h3>
              <label className="flex items-start gap-4 cursor-pointer mb-5">
                <input type="checkbox" checked={reqOk} onChange={e => { vibrate(10); setReqOk(e.target.checked); if(!e.target.checked) set({req: ''}); }} className="mt-1 w-7 h-7 shrink-0" />
                <span className={`text-lg font-medium leading-relaxed ${c.textMuted}`}>{T.reqConsent[lang]}</span>
              </label>
              {reqOk && <textarea value={data.req} onChange={e => set({req: e.target.value})} placeholder={T.reqHold[lang]} className={`${inputCls} h-32 pt-5 resize-none`} />}
            </div>

            <label className="flex items-start gap-4 cursor-pointer mb-10">
              <input type="checkbox" checked={optIn} onChange={e => { vibrate(10); setOptIn(e.target.checked); }} className="mt-1 w-7 h-7 shrink-0" />
              <span className={`text-lg font-medium ${c.textMuted}`}>{T.promoOpt[lang]}</span>
            </label>
          </div>
        )}

        {/* ==========================================================================
            PASSO 4: FINALIZADO E WHATSAPP
            ========================================================================== */}
        {step === 4 && (
          <div className="animate-float text-center flex flex-col items-center justify-center min-h-[60vh] mt-4">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-8 border-4 border-current ${c.accent} ${isDark ? 'bg-[#D97706]/10' : 'bg-[#0F766E]/10'}`}><Icon n="check" sz={48} /></div>
            <h1 className="font-serif text-6xl mb-6">{T.step4Title[lang]}</h1>
            <p className={`text-xl font-medium leading-relaxed mb-12 ${c.textMuted}`}>{T.step4Sub[lang]}</p>
            
            <button onClick={() => window.open(getWhatsappLink(), '_blank')} className={`${btnBig} mb-5`}>{T.btnWa[lang]}</button>
            <button onClick={async () => { await copyText(CONFIG.PIX_KEY); showToast('Chave copiada com sucesso!'); }} className={`w-full h-[64px] rounded-3xl text-xl font-bold border-2 ${c.border} flex items-center justify-center gap-3 mb-5 hover:border-current`}><Icon n="copy" sz={22}/> {T.btnPix[lang]}</button>
            <button onClick={downloadICS} className={`w-full h-[64px] rounded-3xl text-xl font-bold border-2 ${c.border} flex items-center justify-center gap-3 mb-10 hover:border-current`}><Icon n="cal" sz={22}/> {T.btnCal[lang]}</button>
            
            <button onClick={() => { setStep(1); setData(p => ({...p, date: null, time: ''})); }} className="text-xl font-bold underline underline-offset-8 p-4">{T.btnReset[lang]}</button>
          </div>
        )}
      </main>

      {/* ==========================================================================
          RODAPÉ DE NAVEGAÇÃO FIXO (Para Idosos)
          ========================================================================== */}
      {step > 0 && step < 4 && (
        <div className={`fixed bottom-0 inset-x-0 p-5 border-t-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 ${c.card} ${c.border}`}>
          <div className="max-w-xl mx-auto flex gap-4">
            <button onClick={() => { vibrate(10); setStep(s => s - 1); }} aria-label="Voltar" className={`w-24 h-[64px] rounded-3xl flex items-center justify-center border-2 transition-colors ${c.border} hover:border-[#78716C]`}><span className="text-3xl font-bold pb-1">&larr;</span></button>
            <button 
              onClick={() => {
                if (step === 2 && !step2Valid) { setTouched(true); showToast('Preencha os campos obrigatórios.'); vibrate(50); return; }
                if (step === 3) { finishBooking(); return; }
                vibrate(20); setStep(s => s + 1);
              }} 
              className={`flex-1 h-[64px] rounded-3xl text-xl font-bold transition-transform active:scale-[0.98] ${c.btnAccent}`}
            >
              {step === 3 ? T.btnSend[lang] : T.btnNext[lang]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
