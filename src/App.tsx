import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

// ==================================================================================
// CONFIGURAÇÃO GERAL E CUPONS
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM: "https://www.instagram.com/relaxarhojesp",
  ADDRESS_AREA: "Bela Vista, São Paulo",
  START_HOUR: 9,
  END_HOUR: 22,
  
  // CUPONS (Valores menores que 1 são porcentagem. Ex: 0.08 = 8%. Valores maiores são Reais. Ex: 50 = R$ 50)
  COUPONS: {
    "SESSAO2": 0.08,
    "GOZAR10": 10,
    "THALY20": 20,
    "BEMVINDO50": 50
  }
};

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const PEAK_FEE = 15;

// ==================================================================================
// DICIONÁRIO E TEXTOS (i18n)
// ==================================================================================
const TEXTS = {
  PT: {
    ageTitle: "Ambiente\nReservado.",
    ageDesc: "O atendimento é feito de forma individual. Algumas das experiências incluem contato físico intenso e técnicas íntimas focadas no prazer e relaxamento. Confirma ter mais de 18 anos para prosseguir?",
    ageBtn: "Sim, tenho mais de 18 anos",
    step1Label: "Etapa 01",
    step1Title: "Como você quer se sentir hoje?",
    tabSingle: "Só Hoje",
    tabCombo: "Ciclos de Prazer",
    upTo: "Até",
    btnContinue: "Continuar para Local",
    step2Label: "Etapa 02",
    step2Title: "Quem e Onde.",
    namePlace: "Como prefere ser chamado?",
    locLabel: "Onde será a 1ª sessão?",
    locStudio: "Minha Suíte (Bela Vista)",
    locHome: "Seu Espaço (Vou até você)",
    studioDesc: "Atendo sozinho em uma suíte privativa na Bela Vista. O endereço completo e as instruções eu te mando no WhatsApp assim que confirmarmos o horário.",
    cep: "CEP (opcional)",
    street: "Rua ou Avenida",
    number: "Número",
    comp: "Apto / Quarto (opcional)",
    bairroPlace: "Bairro",
    btnNext: "Avançar para Horários",
    step3Label: "Etapa 03",
    step3Title: "O Momento.",
    noSlots: "Nenhum horário disponível hoje.",
    step4Label: "Etapa 04",
    step4Title: "O Acordo.",
    giftTitle: "Presente Liberado",
    giftDesc: "Como é sua primeira vez marcando por aqui, deixei um pequeno desconto no valor final.",
    giftBtn: "Desbloquear Cortesia (R$ 15)",
    giftActive: "Presente de 1ª vez ativo",
    couponLabel: "Tem um cupom?",
    couponPlace: "Digite o código",
    couponBtn: "Aplicar",
    couponActive: "aplicado com sucesso",
    btnRemove: "Remover",
    addons: "Vontades Extras (Hoje)",
    reqLabel: "Tem algum fetiche ou pedido?",
    reqPlace: "O que você quer que role hoje?",
    reqDesc: "Sujeito a avaliação na hora. Caso não seja possível realizar o pedido, o valor da taxa não será cobrado.",
    payLabel: "Como vai pagar na hora?",
    payPix: "Pix (3% OFF)",
    payCard: "Cartão",
    payCash: "Dinheiro",
    subBase: "Valor Base",
    subExtras: "Extras (Hoje)",
    subReq: "Pedido Especial (Hoje)",
    subGift: "Cortesia (Primeira Vez)",
    subCoupon: "Cupom Aplicado",
    subPeak: "Deslocamento",
    subPix: "Desconto Pix",
    total: "Valor Final",
    btnFinish: "Finalizar Pedido",
    step5Title: "Tudo Pronto.",
    step5Desc: "O seu resumo foi gerado. Para confirmar a sua reserva na minha agenda, clique no botão abaixo e me envie a mensagem no WhatsApp.",
    btnSend: "Confirmar no WhatsApp",
    btnBack: "Voltar para o início",
  },
  EN: {
    ageTitle: "Private\nEnvironment.",
    ageDesc: "The service is strictly individual. Experiences include intense physical contact and intimate techniques focused on pleasure and release. Confirm you are over 18?",
    ageBtn: "Yes, I am over 18",
    step1Label: "Step 01",
    step1Title: "How do you want to feel today?",
    tabSingle: "Just Today",
    tabCombo: "Pleasure Cycles",
    upTo: "Up to",
    btnContinue: "Continue to Location",
    step2Label: "Step 02",
    step2Title: "Who and Where.",
    namePlace: "How should I call you?",
    locLabel: "Where will the 1st session be?",
    locStudio: "My Suite (Bela Vista)",
    locHome: "Your Space (I go to you)",
    studioDesc: "I receive alone in a private suite in Bela Vista. Exact address and instructions sent on WhatsApp after confirming.",
    cep: "ZIP Code (optional)",
    street: "Street or Avenue",
    number: "Number",
    comp: "Apt / Room (optional)",
    bairroPlace: "Neighborhood",
    btnNext: "Next to Schedule",
    step3Label: "Step 03",
    step3Title: "The Moment.",
    noSlots: "No slots available today.",
    step4Label: "Step 04",
    step4Title: "The Agreement.",
    giftTitle: "Gift Unlocked",
    giftDesc: "Since it is your first time booking here, I unlocked a small discount on the final amount.",
    giftBtn: "Unlock Courtesy (R$ 15)",
    giftActive: "1st time gift active",
    couponLabel: "Have a coupon?",
    couponPlace: "Enter code",
    couponBtn: "Apply",
    couponActive: "applied successfully",
    btnRemove: "Remove",
    addons: "Extra Desires (Today)",
    reqLabel: "Any fetish or special request?",
    reqPlace: "What do you want to happen today?",
    reqDesc: "Subject to evaluation on site. If not possible, the fee will not be charged.",
    payLabel: "How will you pay on site?",
    payPix: "Pix (3% OFF)",
    payCard: "Credit Card",
    payCash: "Cash",
    subBase: "Base Value",
    subExtras: "Extras (Today)",
    subReq: "Special Request (Today)",
    subGift: "Courtesy (First Time)",
    subCoupon: "Coupon Applied",
    subPeak: "Travel Fee",
    subPix: "Pix Discount",
    total: "Final Value",
    btnFinish: "Finish Order",
    step5Title: "All Set.",
    step5Desc: "Your summary is ready. To confirm your booking on my schedule, click the button below and send the message on WhatsApp.",
    btnSend: "Confirm on WhatsApp",
    btnBack: "Back to start",
  }
};

const MOODS = [
  {
    id: 'classica', color: '#3f3f46', accent: '#a1a1aa', price: 180, min: 60, isCombo: false,
    PT: { title: 'Desatar os nós', subtitle: 'Tensão e peso nas costas.', service: 'Massagem Clássica', desc: 'Começamos relaxando todo o seu corpo para tirar a dor com pressão firme. Estritamente para amassar a musculatura. Sem toques íntimos.' },
    EN: { title: 'Untie the knots', subtitle: 'Tension and back weight.', service: 'Classic Massage', desc: 'We start by relaxing your entire body to relieve pain. Strictly to knead muscles. No intimate touch.' }
  },
  {
    id: 'sensitiva', color: '#713f12', accent: '#fbbf24', price: 200, min: 60, isCombo: false,
    PT: { title: 'A Jornada Tântrica', subtitle: 'Começa relaxando, termina gozando.', service: 'Massagem Sensitiva / Tântrica', desc: 'Toda sessão começa relaxando e destravando seu corpo com a massagem clássica. Só com o corpo solto é que a gente evolui pros toques na pele e pra técnica íntima final (Lingam).' },
    EN: { title: 'The Tantric Journey', subtitle: 'Starts relaxing, ends releasing.', service: 'Sensitive / Tantric Massage', desc: 'Every session starts relaxing and unlocking your body. Then we evolve to skin touches and final intimate technique (Lingam).' }
  },
  {
    id: 'fusion', color: '#831843', accent: '#f43f5e', price: 250, min: 60, isCombo: false,
    PT: { title: 'Proximidade', subtitle: 'Mais intimidade, pele na pele.', service: 'Experiência Fusion', desc: 'Começo relaxando seu corpo inteiro para soltar a tensão. Depois, fico só de cueca. O contato fica intenso, corpo a corpo, com o toque da minha barba. Finalização íntima prolongada.' },
    EN: { title: 'Closeness', subtitle: 'More intimacy, skin on skin.', service: 'Fusion Experience', desc: 'I start by relaxing your whole body. Then, I stay only in underwear. Intense body-to-body contact. Prolonged intimate finish.' }
  },
  {
    id: 'nuru', color: '#1e1b4b', accent: '#818cf8', price: 350, min: 60, isCombo: false,
    PT: { title: 'Imersão Total', subtitle: 'Nós dois suados e escorregadios.', service: 'Massagem Nuru (Gel)', desc: 'Iniciamos relaxando toda a sua musculatura. Depois, a gente tira tudo. Muito gel ultra deslizante. Nossos corpos colados deslizando um no outro até você chegar lá.' },
    EN: { title: 'Total Immersion', subtitle: 'Both of us sweaty and slippery.', service: 'Nuru Massage (Gel)', desc: 'We begin by relaxing your muscles. Then we take it all off. Lots of ultra-gliding gel. Bodies glued sliding on each other.' }
  },
  {
    id: 'reversa', color: '#14532d', accent: '#4ade80', price: 400, min: 60, isCombo: false,
    PT: { title: 'Assumir o Controle', subtitle: 'Aproveite o meu corpo.', service: 'Massagem Reversa', desc: 'Eu começo relaxando o seu corpo e tirando sua tensão, mas depois você assume. Você dita o ritmo, toca onde quiser e explora o meu corpo livremente até gozarmos juntos.' },
    EN: { title: 'Take Control', subtitle: 'Enjoy my body.', service: 'Reverse Massage', desc: 'I start by relaxing your body, then you take over. Set the pace, touch anywhere, explore my body freely until mutual release.' }
  }
];

const COMBOS = [
  {
    id: 'combo_tantrica_2', color: '#831843', accent: '#f43f5e', price: 590, min: 60, isCombo: true,
    PT: { title: 'Intensidade (Nuru + Reversa)', subtitle: 'Exploração e gozo sem pressa.', service: '2 Encontros', desc: 'Uma sessão Nuru e uma Reversa. Ambas começam relaxando e destravando seu corpo inteiro primeiro. Corpo solto, mente leve e finalização intensa. De R$ 750 por R$ 590 (Economia de R$ 160).' },
    EN: { title: 'Intensity (Nuru + Reverse)', subtitle: 'Exploration and release without rush.', service: '2 Encounters', desc: 'One Nuru and one Reverse. Both start by completely relaxing your body first. From R$ 750 for R$ 590 (Save R$ 160).' }
  },
  {
    id: 'combo_tantrica_4', color: '#1e1b4b', accent: '#818cf8', price: 890, min: 60, isCombo: true,
    PT: { title: 'Exploração Total (As 4 Fases)', subtitle: 'Um mês inteiro de descobertas.', service: '4 Encontros', desc: 'Você vem uma vez por semana. Todo encontro começa relaxando sua musculatura, evoluindo a intimidade a cada visita até a explosão da Reversa. De R$ 1.200 por R$ 890 (Economia de R$ 310).' },
    EN: { title: 'Total Exploration (All 4 Phases)', subtitle: 'A whole month of discoveries.', service: '4 Encounters', desc: 'Come once a week. Every session starts by relaxing your muscles, evolving intimacy each visit. From R$ 1,200 for R$ 890 (Save R$ 310).' }
  },
  {
    id: 'combo_classica_2', color: '#3f3f46', accent: '#a1a1aa', price: 320, min: 60, isCombo: true,
    PT: { title: 'Alívio Quinzenal (2 Sessões)', subtitle: 'Tirando o peso dos ombros.', service: '2 Encontros', desc: 'Duas visitas no mês focadas apenas em amassar a musculatura e relaxar seu corpo para tirar dores. Sem toques íntimos. De R$ 360 por R$ 320 (Economia de R$ 40).' },
    EN: { title: 'Biweekly Relief (2 Sessions)', subtitle: 'Taking the weight off.', service: '2 Encounters', desc: 'Two visits a month purely to relax your body and relieve pain. No intimate touch. From R$ 360 for R$ 320 (Save R$ 40).' }
  },
  {
    id: 'combo_classica_4', color: '#18181b', accent: '#71717a', price: 560, min: 60, isCombo: true,
    PT: { title: 'Rotina Leve (4 Sessões)', subtitle: 'Corpo sem dores o mês todo.', service: '4 Encontros', desc: 'Uma hora por semana para a gente relaxar seu corpo inteiro e soltar todos os nós. Você chega travado e sai leve. De R$ 720 por R$ 560 (Economia de R$ 160).' },
    EN: { title: 'Light Routine (4 Sessions)', subtitle: 'Pain-free body all month.', service: '4 Encounters', desc: 'One hour a week to relax your entire body. Arrive stiff, leave light. From R$ 720 for R$ 560 (Save R$ 160).' }
  }
];

const EXTRAS = [
  { id: 'aroma', price: 20, PT: { label: 'Óleos essenciais relaxantes' }, EN: { label: 'Relaxing essential oils' } },
  { id: 'time', price: 75, PT: { label: 'Ficar mais tempo (+30min)' }, EN: { label: 'Stay longer (+30min)' } }
];

// ==================================================================================
// UTILITÁRIOS E ÍCONES
// ==================================================================================
const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 20) => { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const ICON_PATHS: Record<string, string> = {
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'globe': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  'gift': 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  'close': 'M18 6L6 18 M6 6l12 12',
  'ticket': 'M15 5.5a4 4 0 0 0-4 4v3a4 4 0 0 1-4 4H3M21 5.5a4 4 0 0 1-4 4v3a4 4 0 0 0-4 4h-8M3 13h18M3 5.5v13M21 5.5v13'
};

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICON_PATHS[name] || ''} /></svg>
));

// ==================================================================================
// ESTILOS CINEMATOGRÁFICOS
// ==================================================================================
const CinematicStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }
    
    :root {
      --font-ui: 'DM Sans', sans-serif;
      --font-serif: 'Newsreader', serif;
      --c-bg: #09090b;
      --c-text: #fafafa;
    }

    body, html { 
      background-color: var(--c-bg); 
      color: var(--c-text); 
      font-family: var(--font-ui);
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      margin: 0; padding: 0;
      scroll-behavior: smooth;
    }

    .grain-overlay {
      position: fixed; inset: 0; z-index: 50; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
    }

    .ambient-glow {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 150vw; height: 150vh; opacity: 0.15; filter: blur(120px);
      transition: background-color 1.5s cubic-bezier(0.25, 1, 0.5, 1);
      z-index: 0; pointer-events: none;
    }

    .step-enter { animation: stepEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes stepEnter {
      0% { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    .modern-input {
      background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.1);
      color: white; border-radius: 0; padding: 16px 0; transition: border-color 0.3s;
    }
    .modern-input:focus { outline: none; border-bottom-color: rgba(255,255,255,0.8); }
    .modern-input::placeholder { color: rgba(255,255,255,0.2); }

    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}} />
));

// ==================================================================================
// APP PRINCIPAL
// ==================================================================================
export default function App() {
  const [step, setStep] = useState(0); 
  const [isReturningClient, setIsReturningClient] = useState(false);
  const [giftApplied, setGiftApplied] = useState(false);
  const [lang, setLang] = useState<'PT' | 'EN'>('PT');
  
  const [bookingMode, setBookingMode] = useState<'single'|'combo'>('single');
  const activeList = bookingMode === 'single' ? MOODS : COMBOS;
  const [moodId, setMoodId] = useState(MOODS[0].id);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState(false);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setMoodId(activeList[0].id);
  }, [bookingMode, activeList]);

  const mood = useMemo(() => activeList.find(m => m.id === moodId) || activeList[0], [moodId, activeList]);
  
  const T = TEXTS[lang];
  const numberInputRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState({
    name: '', locType: '', cep: '', street: '', number: '', comp: '', bairro: '', 
    date: null as Date | null, time: '', extras: {} as Record<string, boolean>,
    req: '', payment: ''
  });

  // Chave atualizada para v24. O teste será limpo e puro.
  useEffect(() => {
    const isAdult = localStorage.getItem('thaly_adult_v24');
    const hasBookedBefore = localStorage.getItem('thaly_returning_v24');
    
    if (isAdult === 'yes') setStep(1);
    if (hasBookedBefore === 'yes') setIsReturningClient(true);
  }, []);

  useEffect(() => {
    if (step > 0 && step < 5 && !isProfileOpen) {
      setTimeout(() => {
        const el = document.getElementById(`step-${step}`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 30;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [step, isProfileOpen]);

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const target = e.target;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
  };

  const acceptAdult = () => {
    vibrate(30);
    localStorage.setItem('thaly_adult_v24', 'yes');
    setStep(1);
  };

  const applyGift = () => {
    vibrate([40, 60]);
    setGiftApplied(true);
    setAppliedCoupon('');
    setCouponInput('');
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (CONFIG.COUPONS[code as keyof typeof CONFIG.COUPONS]) {
      vibrate([30, 50]);
      setAppliedCoupon(code);
      setGiftApplied(false);
      setCouponError(false);
    } else {
      vibrate(50);
      setAppliedCoupon('');
      setCouponError(true);
      setTimeout(() => setCouponError(false), 2000);
    }
  };

  const openProfile = () => {
    vibrate(15);
    setIsProfileOpen(true);
  };

  const resetFlow = () => {
    vibrate(20);
    const isAdult = localStorage.getItem('thaly_adult_v24');
    setStep(isAdult === 'yes' ? 1 : 0);
    window.scrollTo(0,0);
  };

  const toggleLang = () => {
    vibrate(15);
    setLang(l => l === 'PT' ? 'EN' : 'PT');
  };

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    setData(prev => ({ ...prev, cep: masked }));
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const json = await res.json();
        if (!json.erro) {
          setData(prev => ({ 
            ...prev, 
            street: json.logradouro || '', 
            bairro: json.bairro || '' 
          }));
          setTimeout(() => numberInputRef.current?.focus(), 150);
        }
      } catch (e) {}
    }
  };

  const isStep2Valid = data.name.trim().length > 1 && data.locType !== '' && 
    (data.locType === 'studio' || (data.locType === 'home' && data.street.trim() !== '' && data.number.trim() !== '' && data.bairro.trim() !== ''));

  const fin = useMemo(() => {
    let basePrice = mood.price;
    let dur = mood.min;
    
    let extrasTotal = 0;
    if (data.extras['time']) { extrasTotal += 75; dur += 30; }
    if (data.extras['aroma']) { extrasTotal += 20; }
    
    let reqFee = data.req.trim().length > 3 ? 130 : 0;
    let peakFee = (PEAK_HOURS.includes(data.time) && data.locType !== 'studio') ? PEAK_FEE : 0;
    
    let subTotal = basePrice + extrasTotal + reqFee;
    
    let discountGift = giftApplied ? 15 : 0;
    let couponDiscountValue = 0;
    
    if (appliedCoupon) {
      const val = CONFIG.COUPONS[appliedCoupon as keyof typeof CONFIG.COUPONS];
      couponDiscountValue = val < 1 ? Math.floor(subTotal * val) : val;
    }
    
    let totalAfterDiscounts = Math.max(0, subTotal - discountGift - couponDiscountValue);
    let pixDiscount = data.payment === 'pix' ? Math.ceil(totalAfterDiscounts * 0.03) : 0;
    
    let finalTotal = totalAfterDiscounts - pixDiscount + peakFee;
    
    return { 
      basePrice, extrasTotal, reqFee, peakFee, discountGift, 
      couponDiscount: couponDiscountValue, pixDiscount, 
      total: finalTotal, dur 
    };
  }, [mood, data, giftApplied, appliedCoupon]);

  const days = useMemo(() => Array.from({length: 15}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  }), []);

  const getSlots = () => {
    if (!data.date) return [];
    let s = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) s.push(`${i<10?'0':''}${i}:00`);
    if (data.date.toDateString() === new Date().toDateString()) s = s.filter(t => parseInt(t.split(':')[0]) > new Date().getHours());
    return s;
  };

  const wppLink = useMemo(() => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';
    const ext = Object.keys(data.extras).filter(k=>data.extras[k]).map(k=>EXTRAS.find(e=>e.id===k)?.[lang].label).join(', ');
    const paymentMethod = data.payment === 'pix' ? 'Pix' : data.payment === 'card' ? 'Cartão' : 'Dinheiro';

    // A Bússola: Define exatamente quem vai até quem com base no que foi escolhido.
    let locationText = '';
    if (data.locType === 'studio') {
      locationText = `Você vem até o meu espaço (Minha Suíte, Bela Vista)`;
    } else {
      locationText = `Eu vou até você (${data.street}, ${data.number}${data.comp ? ', ' + data.comp : ''}, ${data.bairro})`;
    }

    let text = `Oi Thalyson, tudo bem? Finalizei a minha reserva no site e vim confirmar o nosso encontro.\n\n`;
    
    text += `*QUEM VEM:* ${data.name}\n\n`;
    
    text += `*A EXPERIÊNCIA:*\n`;
    text += `• ${mood[lang].title} (${mood[lang].service})\n`;
    text += `_“${mood[lang].desc}”_\n\n`;

    text += `*QUANDO E ONDE:*\n`;
    text += `• Data: ${dStr} às ${data.time}\n`;
    text += `• Duração: até ${fin.dur} min\n`;
    text += `• Local: ${locationText}\n\n`;

    if (ext || data.req.trim()) {
      text += `*DETALHES DA SESSÃO:*\n`;
      if (ext) text += `• Adicionais: ${ext}\n`;
      if (data.req.trim()) text += `• Pedido especial: "${data.req.trim()}"\n`;
      text += `\n`;
    }

    text += `*O INVESTIMENTO:*\n`;
    text += `• Valor base: ${formatMoney(fin.basePrice)}\n`;
    if (fin.extrasTotal > 0) text += `• Adicionais extras: + ${formatMoney(fin.extrasTotal)}\n`;
    if (fin.reqFee > 0) text += `• Taxa de pedido: + ${formatMoney(fin.reqFee)}\n`;
    if (fin.peakFee > 0) text += `• Deslocamento: + ${formatMoney(fin.peakFee)}\n`;
    if (fin.discountGift > 0) text += `• Presente de 1ª vez: - ${formatMoney(fin.discountGift)}\n`;
    if (fin.couponDiscount > 0) text += `• Cupom (${appliedCoupon}): - ${formatMoney(fin.couponDiscount)}\n`;
    if (fin.pixDiscount > 0) text += `• Desconto Pix: - ${formatMoney(fin.pixDiscount)}\n`;
    text += `*Valor Final:* ${formatMoney(fin.total)} (via ${paymentMethod})\n\n`;

    text += `*PRÓXIMA SESSÃO:*\n`;
    text += `Já deixei anotado o cupom SESSAO2 para garantir 8% de desconto na minha próxima visita.\n\n`;

    text += `Estou ciente do nosso acordo de respeito mutuo e higiene. Aguardo a sua confirmação!`;
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
  }, [data, mood, fin, lang, appliedCoupon]);

  const finishFlow = () => {
    vibrate([30,50]);
    // A mágica acontece aqui: ao finalizar, ele é marcado como cliente recorrente.
    // Na próxima vez que ele recarregar o site, a caixa do presente desaparece.
    localStorage.setItem('thaly_returning_v24', 'yes');
    setStep(5);
  };

  return (
    <>
      <CinematicStyles />
      <div className="grain-overlay" />
      <div className="ambient-glow" style={{ backgroundColor: mood.color }} />

      <div className="relative z-10 min-h-[100dvh] flex flex-col px-6 py-10 max-w-md mx-auto">
        
        {/* CABEÇALHO */}
        <header className="flex justify-between items-center mb-10">
          <button onClick={openProfile} className="text-left group outline-none py-2 flex items-center gap-3">
            <img 
              src="FmtU3Ogx_400x400.jpg" 
              alt="Terapeuta Thalyson" 
              className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-lg transition-transform group-hover:scale-105"
            />
            <span style={{ fontFamily: 'var(--font-serif)' }} className="text-xl italic text-white/90 group-hover:text-white transition-colors">
              Thalyson Massagens
            </span>
          </button>
          
          <div className="flex items-center gap-5">
            {step > 0 && step < 5 && (
              <div className="flex gap-1.5 mr-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-[3px] rounded-full transition-all duration-500 ${step >= i ? 'w-5 bg-white' : 'w-2 bg-white/20'}`} />
                ))}
              </div>
            )}
            
            <button onClick={toggleLang} className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-white/50 hover:text-white transition-colors outline-none py-2">
              <Icon name="globe" size={14} />
              {lang}
            </button>
          </div>
        </header>

        {/* MODAL DO PERFIL */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsProfileOpen(false)}>
            <div className="bg-[#09090b] border border-white/10 rounded-md w-full max-w-sm p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors outline-none">
                <Icon name="close" size={20} />
              </button>
              
              <img src="FmtU3Ogx_400x400.jpg" className="w-24 h-24 rounded-full object-cover mb-5 border border-white/10 shadow-lg" alt=" /Terapeuta Thalyson" />
              
              <h2 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl text-white mb-1">Terapeuta Thalyson.</h2>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-6">30 anos • Solteiro</p>
              
              <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                <p>
                  Nasci em Santa Fé do Sul, no interior de São Paulo. Hoje meu espaço fica aqui na capital, na Bela Vista.
                </p>
                <p>
                  Trabalho como terapeuta há mais de um ano. O que eu faço é simples: uso minhas mãos e o toque para tirar o peso da sua rotina e te entregar uma experiência onde você só precisa fechar os olhos, relaxar e aproveitar.
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors outline-none">
                  <Icon name="instagram" size={16} />
                  Acompanhe no Instagram
                </a>
              </div>
            </div>
          </div>
        )}

        {/* STEP 0: O AVISO (+18) */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center step-enter pb-10">
            <h1 style={{ fontFamily: 'var(--font-serif)', whiteSpace: 'pre-line' }} className="text-4xl leading-tight mb-6">{T.ageTitle}</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-12">{T.ageDesc}</p>
            <button onClick={acceptAdult} className="bg-white text-black h-14 w-full font-bold tracking-widest uppercase transition-transform active:scale-95 outline-none rounded-sm">
              {T.ageBtn}
            </button>
          </div>
        )}

        {/* O FLUXO CONTÍNUO */}
        <div className={step >= 1 && step < 5 ? "block" : "hidden"}>
          
          {/* STEP 1: A FREQUÊNCIA */}
          <div id="step-1" className="step-enter mb-16">
            <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step1Label}</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step1Title}</h1>
            
            <div className="flex bg-white/5 p-1 rounded-sm border border-white/10 mb-6">
              <button onClick={() => { vibrate(10); setBookingMode('single'); }} 
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm outline-none ${bookingMode === 'single' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
                {T.tabSingle}
              </button>
              <button onClick={() => { vibrate(10); setBookingMode('combo'); }} 
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm outline-none ${bookingMode === 'combo' ? 'bg-[#f59e0b] text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-white/40 hover:text-white'}`}>
                {T.tabCombo}
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {activeList.map(m => {
                const active = mood.id === m.id;
                return (
                  <button key={m.id} onClick={() => { vibrate(20); setMoodId(m.id); }}
                    className={`text-left p-5 transition-all duration-500 border outline-none rounded-sm ${active ? 'bg-white/10 backdrop-blur-md' : 'border-white/5 hover:border-white/20 bg-transparent'}`}
                    style={{ borderColor: active ? m.accent : '' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: active ? m.accent : 'rgba(255,255,255,0.4)' }}>{m[lang].title}</p>
                    <p className={`text-sm ${active ? 'text-white' : 'text-white/60'}`}>{m[lang].subtitle}</p>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 p-6 bg-black/40 backdrop-blur-xl border border-white/10 min-h-[140px] rounded-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg pr-4">{mood[lang].service}</h3>
                <div className="text-right flex flex-col items-end shrink-0">
                  <span className="text-base font-bold block" style={{ color: mood.accent }}>{formatMoney(mood.price)}</span>
                  {!mood.isCombo && <span className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">{T.upTo} {mood.min}m</span>}
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mt-2">{mood[lang].desc}</p>
            </div>

            {step === 1 && (
              <button onClick={() => { vibrate(30); setStep(2); }} className="mt-10 bg-white text-black h-14 w-full font-bold tracking-widest uppercase transition-transform active:scale-95 outline-none rounded-sm">
                {T.btnContinue}
              </button>
            )}
          </div>

          {/* STEP 2: COORDENADAS */}
          {step >= 2 && (
            <div id="step-2" className="step-enter mb-16 pt-8 border-t border-white/10">
              <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step2Label}</h2>
              <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step2Title}</h1>

              <div className="space-y-6">
                <div>
                  <input type="text" placeholder={T.namePlace} value={data.name} onChange={e=>setData({...data, name: e.target.value})} onFocus={handleInputFocus} className="w-full modern-input text-lg font-medium" />
                </div>

                <div className="pt-4">
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.locLabel}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={()=>setData({...data, locType:'studio'})} className={`py-4 text-sm font-medium outline-none transition-colors border rounded-sm ${data.locType==='studio' ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{T.locStudio}</button>
                    <button onClick={()=>setData({...data, locType:'home'})} className={`py-4 text-sm font-medium outline-none transition-colors border rounded-sm ${data.locType==='home' ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{T.locHome}</button>
                  </div>
                </div>

                {data.locType === 'studio' && <p className="text-sm text-white/60 bg-white/5 p-4 border border-white/10 leading-relaxed rounded-sm animate-in fade-in">{T.studioDesc}</p>}
                
                {data.locType === 'home' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <input type="tel" maxLength={9} placeholder={T.cep} value={data.cep} onChange={e=>handleCep(e.target.value)} onFocus={handleInputFocus} className="w-full modern-input" />
                    <input type="text" placeholder={T.street} value={data.street} onChange={e=>setData({...data, street: e.target.value})} onFocus={handleInputFocus} className="w-full modern-input" />
                    <div className="flex gap-4">
                      <input ref={numberInputRef} type="text" placeholder={T.number} value={data.number} onChange={e=>setData({...data, number: e.target.value})} onFocus={handleInputFocus} className="w-1/3 modern-input" />
                      <input type="text" placeholder={T.comp} value={data.comp} onChange={e=>setData({...data, comp: e.target.value})} onFocus={handleInputFocus} className="w-2/3 modern-input" />
                    </div>
                    <input type="text" placeholder={T.bairroPlace} value={data.bairro} onChange={e=>setData({...data, bairro: e.target.value})} onFocus={handleInputFocus} className="w-full modern-input" />
                  </div>
                )}
              </div>

              {step === 2 && (
                <button disabled={!isStep2Valid} onClick={() => { vibrate(30); setStep(3); }} className="mt-10 bg-white text-black h-14 w-full font-bold tracking-widest uppercase disabled:opacity-20 disabled:cursor-not-allowed transition-opacity outline-none rounded-sm">
                  {T.btnNext}
                </button>
              )}
            </div>
          )}

          {/* STEP 3: TEMPO */}
          {step >= 3 && (
            <div id="step-3" className="step-enter mb-16 pt-8 border-t border-white/10">
              <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step3Label}</h2>
              <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step3Title}</h1>

              <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4 mb-6">
                {days.map((d, i) => {
                  const sel = data.date?.toDateString() === d.toDateString();
                  const dayName = d.toLocaleDateString(lang === 'PT' ? 'pt-BR' : 'en-US', {weekday:'short'}).slice(0,3);
                  return (
                    <button key={i} onClick={() => setData({...data, date: d, time: ''})} className={`shrink-0 w-16 h-20 outline-none flex flex-col items-center justify-center border rounded-sm transition-all ${sel ? 'bg-white text-black border-white' : 'border-white/10 text-white/50'}`}>
                      <span className="text-[10px] uppercase font-bold tracking-widest">{dayName}</span>
                      <span style={{ fontFamily: 'var(--font-serif)' }} className="text-2xl mt-1">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              {data.date && (
                <div className="grid grid-cols-3 gap-3 animate-in fade-in">
                  {getSlots().map(t => {
                    const sel = data.time === t;
                    return (
                      <button key={t} onClick={() => { 
                        vibrate(20);
                        setData({...data, time: t});
                        if (step === 3) setStep(4);
                      }} className={`py-4 text-sm outline-none font-medium border rounded-sm transition-colors ${sel ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>
                        {t}
                      </button>
                    )
                  })}
                  {getSlots().length === 0 && <p className="col-span-3 text-sm text-white/40 text-center py-4 border border-white/5 rounded-sm">{T.noSlots}</p>}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: O ACORDO */}
          {step >= 4 && (
            <div id="step-4" className="step-enter mb-8 pt-8 border-t border-white/10">
              <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step4Label}</h2>
              <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step4Title}</h1>

              <div className="space-y-8">
                
                <div className="space-y-5">
                  {/* CAIXA DE PRESENTE: Só existe se a pessoa NUNCA tiver finalizado um agendamento e não tiver cupom ativo */}
                  {!isReturningClient && !appliedCoupon && !giftApplied && (
                    <div className="p-6 border border-[#4ade80]/40 bg-[#4ade80]/10 rounded-md animate-in fade-in flex flex-col items-start relative overflow-hidden shadow-[0_0_20px_rgba(74,222,128,0.05)]">
                      <div className="absolute -right-4 -bottom-4 opacity-5">
                        <Icon name="gift" size={120} />
                      </div>
                      <div className="relative z-10 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="gift" className="text-[#4ade80]" size={18} />
                          <h3 className="text-[#4ade80] font-bold uppercase tracking-widest text-xs">{T.giftTitle}</h3>
                        </div>
                        <p className="text-sm text-[#4ade80]/90 mb-5 leading-relaxed">{T.giftDesc}</p>
                        <button onClick={applyGift} className="bg-[#4ade80] text-black w-full text-xs font-bold px-5 py-3.5 uppercase tracking-widest outline-none rounded-sm transition-transform active:scale-95 shadow-lg shadow-[#4ade80]/20">
                          {T.giftBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AVISO DO PRESENTE APLICADO */}
                  {!isReturningClient && giftApplied && (
                    <div className="flex justify-between items-center p-4 bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-sm animate-in fade-in">
                      <span className="text-[#4ade80] text-sm font-bold flex items-center gap-2"><Icon name="gift" size={16}/> {T.giftActive}</span>
                      <button onClick={() => setGiftApplied(false)} className="text-white/50 hover:text-white text-xs underline outline-none">{T.btnRemove}</button>
                    </div>
                  )}

                  {/* CAMPO DE CUPOM MANUAL (Some se o presente estiver em uso) */}
                  {!giftApplied && (
                    <div className="animate-in fade-in">
                      <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.couponLabel}</p>
                      <div className="flex gap-3">
                        <input 
                          type="text" 
                          placeholder={T.couponPlace} 
                          value={couponInput} 
                          onChange={e => setCouponInput(e.target.value)}
                          onFocus={handleInputFocus}
                          disabled={!!appliedCoupon}
                          className={`flex-1 bg-white/5 border ${couponError ? 'border-red-500/50' : 'border-white/10'} text-white rounded-sm px-4 outline-none focus:border-white/50 transition-colors uppercase disabled:opacity-50`}
                        />
                        {!appliedCoupon ? (
                          <button 
                            onClick={handleApplyCoupon}
                            className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-sm transition-colors outline-none"
                          >
                            {T.couponBtn}
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setAppliedCoupon(''); setCouponInput(''); }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-sm transition-colors outline-none"
                          >
                            {T.btnRemove}
                          </button>
                        )}
                      </div>
                      {appliedCoupon && <p className="text-xs text-[#4ade80] mt-3">✅ Cupom <strong>{appliedCoupon}</strong> {T.couponActive} (-{formatMoney(fin.couponDiscount)})</p>}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.addons}</p>
                  <div className="space-y-3">
                    {EXTRAS.map(ex => {
                      const sel = data.extras[ex.id];
                      return (
                        <button key={ex.id} onClick={()=>setData({...data, extras:{...data.extras, [ex.id]:!sel}})} className={`w-full outline-none flex justify-between p-4 border rounded-sm text-sm transition-colors ${sel ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/60'}`}>
                          <span>{ex[lang].label}</span>
                          <span>+{formatMoney(ex.price)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs text-white/50 uppercase tracking-widest">{T.reqLabel}</p>
                    <span className="text-xs font-bold text-white/60">+ R$ 130</span>
                  </div>
                  <input type="text" placeholder={T.reqPlace} value={data.req} onChange={e=>setData({...data, req:e.target.value})} onFocus={handleInputFocus} className="w-full modern-input text-sm" />
                  <p className="text-[10px] text-white/40 mt-2 leading-relaxed">{T.reqDesc}</p>
                </div>

                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.payLabel}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[{id:'pix', l:T.payPix},{id:'card', l:T.payCard},{id:'cash', l:T.payCash}].map(p => (
                      <button key={p.id} onClick={()=>setData({...data, payment:p.id})} className={`py-4 outline-none text-xs font-bold uppercase tracking-wider border rounded-sm transition-colors ${data.payment === p.id ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{p.l}</button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subBase}</span><span>{formatMoney(fin.basePrice)}</span></div>
                  {fin.extrasTotal > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subExtras}</span><span>+{formatMoney(fin.extrasTotal)}</span></div>}
                  {fin.reqFee > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subReq}</span><span>+{formatMoney(fin.reqFee)}</span></div>}
                  {fin.discountGift > 0 && <div className="flex justify-between text-sm text-[#4ade80] mb-2"><span>{T.subGift}</span><span>-{formatMoney(fin.discountGift)}</span></div>}
                  {fin.couponDiscount > 0 && <div className="flex justify-between text-sm text-[#4ade80] mb-2"><span>{T.subCoupon}</span><span>-{formatMoney(fin.couponDiscount)}</span></div>}
                  {fin.peakFee > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subPeak}</span><span>+{formatMoney(fin.peakFee)}</span></div>}
                  {fin.pixDiscount > 0 && <div className="flex justify-between text-sm text-[#4ade80] mb-2"><span>{T.subPix}</span><span>-{formatMoney(fin.pixDiscount)}</span></div>}
                  
                  <div className="flex justify-between items-end mt-8 mb-10">
                    <span className="text-sm uppercase tracking-widest text-white/50">{T.total}</span>
                    <span style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl text-white">{formatMoney(fin.total)}</span>
                  </div>

                  <button disabled={!data.payment} onClick={finishFlow} className="bg-white text-black h-16 w-full font-bold tracking-widest uppercase disabled:opacity-20 transition-opacity outline-none rounded-sm shadow-xl shadow-white/10">
                    {T.btnFinish}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* STEP 5: FINALIZADO */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-center text-center step-enter pb-20">
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl mb-4">{T.step5Title}</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-6">{T.step5Desc}</p>
            
            <div className="bg-white/5 border border-white/10 p-5 rounded-sm mb-10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ticket" className="text-[#4ade80]" size={16} />
                <p className="text-[#4ade80] text-xs font-bold uppercase tracking-widest">Para o próximo encontro</p>
              </div>
              <p className="text-sm text-white/70">Guarde o cupom <strong className="text-white">SESSAO2</strong>. Você pode aplicar ele no nosso site para garantir 8% de desconto na sua próxima visita.</p>
            </div>

            <a 
              href={wppLink} 
              className="bg-transparent border border-white text-white flex items-center justify-center h-14 w-full font-bold tracking-widest uppercase transition-colors hover:bg-white hover:text-black outline-none rounded-sm no-underline"
            >
              {T.btnSend}
            </a>

            <button onClick={resetFlow} className="mt-8 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors outline-none py-2">
              {T.btnBack}
            </button>
          </div>
        )}

      </div>
    </>
  );
}
