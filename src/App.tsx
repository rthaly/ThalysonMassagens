import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

// ==================================================================================
// CONFIGURAÇÃO GERAL E CUPONS
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  PIX_KEY: "5517991360413",
  INSTAGRAM: "https://www.instagram.com/relaxarhojesp",
  ADDRESS_AREA: "Bela Vista, São Paulo",
  START_HOUR: 9,
  END_HOUR: 22,
  SIGNAL_AMOUNT: 50, // Added fixed signal amount
  
  // CUPONS
  COUPONS: {
    "SESSAO2": 0.08,
    "RELAXAR13": 0.13,
    "THALY20": 20,
    "BEMVINDO50": 50
  }
};

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const PEAK_FEE = 18;

// ==================================================================================
// DICIONÁRIO E TEXTOS (DIRETO E MASCULINO)
// ==================================================================================
const TEXTS = {
  PT: {
    gateTitle: "Seu momento\nreservado.",
    gatePrivacyDesc: "Pode ficar tranquilo. Nada que você preenche aqui fica salvo na internet. Tudo vai direto e apenas para o meu WhatsApp particular.",
    gateAgeDesc: "O atendimento é focado em tirar o seu estresse e te dar prazer. Envolve contato físico intenso e massagem íntima. Você confirma que tem mais de 18 anos?",
    gateBtn: "Confirmar e Entrar",
    step1Label: "Passo 1",
    step1Title: "O que você está precisando hoje?",
    tabSingle: "Sessões",
    tabEstetica: "Aparar Pelos",
    tabCombo: "Pacotes",
    upTo: "ATÉ",
    btnContinue: "Escolher essa e avançar",
    step2Label: "Passo 2",
    step2Title: "Nome e Local.",
    namePlace: "Qual é o seu nome?",
    locLabel: "Onde vamos nos encontrar?",
    locStudio: "Na minha Suíte (Bela Vista)",
    locHome: "No seu endereço (Vou até você)",
    studioDesc: "Eu te atendo no meu espaço reservado na Bela Vista. Assim que fecharmos o horário, te mando o endereço completo e como chegar lá.",
    cep: "CEP (opcional)",
    street: "Sua Rua ou Avenida",
    number: "Número",
    comp: "Apto / Quarto (opcional)",
    bairroPlace: "Seu Bairro",
    btnNext: "Avançar para Horários",
    step3Label: "Passo 3",
    step3Title: "Que dia e horário?",
    noSlots: "Nenhum horário livre pra hoje.",
    step4Label: "Passo 4",
    step4Title: "Resumo e Pagamento.",
    giftTitle: "Desconto Liberado",
    giftDesc: "Como é a sua primeira vez marcando comigo, deixei um desconto pra gente fechar hoje.",
    giftBtn: "Usar meu desconto (R$ 15)",
    giftActive: "Desconto de 1ª vez ativado",
    couponLabel: "Tem algum cupom?",
    couponPlace: "Código do cupom",
    couponBtn: "Aplicar",
    couponActive: "aplicado no valor",
    btnRemove: "Tirar",
    reqLabel: "Tem alguma vontade específica?",
    reqPlace: "Se tiver alguma fantasia ou fetiche, escreve aqui...",
    reqDesc: "A gente avalia na hora. Se não der pra fazer o que você pediu, eu não te cobro essa taxa, fica tranquilo.",
    payLabel: "Como você vai pagar na hora?",
    payPix: "Pix (3% Desconto)",
    payCard: "Cartão",
    payCash: "Dinheiro",
    subBase: "Valor da Sessão",
    subExtras: "Personalizações Adicionadas",
    subReq: "Vontade Específica",
    subGift: "Desconto de Primeira Vez",
    subCoupon: "Cupom",
    subPeak: "Taxa de Horário de Pico",
    subPix: "Desconto pagando no Pix",
    total: "Valor Final",
    btnFinish: "Gerar meu Pedido",
    step5Title: "Pedido Gerado.",
    step5Desc: "Tudo certo. As suas escolhas viraram uma mensagem pro meu WhatsApp. É só clicar no botão abaixo para me enviar e a gente confirmar o horário.",
    btnSend: "Me enviar no WhatsApp",
    btnBack: "Começar do zero",
  }
};

// ==================================================================================
// MASSAGENS E SERVIÇOS (TANGÍVEL, CORPO TODO E PRAZER)
// ==================================================================================
const MOODS = [
  {
    id: 'classica', color: '#3f3f46', price: 180, min: 60, isCombo: false, hasTantrica: false, hideTouch: false,
    PT: { title: 'Tirar o Peso do Corpo', category: 'Massagem Clássica', desc: 'Massagem profunda no corpo todo. Uso a força certa das minhas mãos para desfazer os nós de tensão e amassar a musculatura de ponta a ponta. Você entra cansado e sai muito leve. É apenas relaxamento do corpo inteiro, não tem toques íntimos.' }
  },
  {
    id: 'sensitiva', color: '#713f12', price: 200, min: 60, isCombo: false, hasTantrica: true, hideTouch: false,
    PT: { title: 'Relaxamento e Prazer', category: 'Massagem Tântrica', desc: 'Tudo começa relaxando o seu corpo inteiro com bastante força, da cabeça aos pés. Quando você estiver bem entregue e sem dores, os toques mudam de ritmo, percorrem a sua pele e terminam direto numa massagem íntima demorada para você aliviar tudo.' }
  },
  {
    id: 'naturista', color: '#14532d', price: 240, min: 60, isCombo: false, hasTantrica: false, hideTouch: false,
    PT: { title: 'Massagem Totalmente Nu', category: 'Massagem Naturista', desc: 'A mesma massagem profunda com as mãos no seu corpo todo, mas com uma diferença: nós dois ficamos totalmente sem roupa do início ao fim. O contato direto da nossa pele ajuda você a relaxar muito mais. Apenas relaxamento, não tem toques íntimos e não tem escorrega no corpo.' }
  },
  {
    id: 'fusion', color: '#831843', price: 250, min: 60, isCombo: false, hasTantrica: true, hideTouch: false,
    PT: { title: 'Muito Contato e Tesão', category: 'Massagem Tântrica', desc: 'Relaxo o seu corpo inteiro primeiro. Depois, fico apenas de cueca e uso o calor do meu corpo no seu. Passo o meu peito e a minha barba em você para subir bem o clima, até chegar na parte final da massagem íntima.' }
  },
  {
    id: 'nuru', color: '#1e1b4b', price: 350, min: 60, isCombo: false, hasTantrica: true, hideTouch: false,
    PT: { title: 'Corpo a Corpo com Gel', category: 'Massagem Tântrica', desc: 'A experiência com mais contato físico. Nós dois sem roupa, passo um gel bem liso e uso o meu próprio corpo (peito, pernas, braços) para massagear o seu corpo todo. É muito escorregadio, quente e termina na massagem íntima.' }
  },
  {
    id: 'reversa', color: '#312e81', price: 400, min: 60, isCombo: false, hasTantrica: true, hideTouch: true,
    PT: { title: 'A Sua Vez de Tocar', category: 'Massagem Tântrica', desc: 'Eu começo tirando o peso do seu corpo inteiro com a massagem para você relaxar. Depois, você tem tempo e liberdade para passar a mão e explorar o meu corpo como quiser. No fim, eu retomo o controle para fazer você gozar na massagem íntima.' }
  }
];

const ESTETICA = [
  {
    id: 'depilacao_solo', color: '#0f766e', price: 107, min: 40, isCombo: false, hasTantrica: false, hideTouch: true,
    PT: { title: 'Aparar os Pelos', category: 'Máquina', desc: 'Passo a maquininha para deixar os pelos baixinhos e manter a higiene em até 3 lugares do seu corpo. Depois, finalizo com um creme para não dar alergia e deixar sua pele macia.' }
  }
];

const COMBOS = [
  {
    id: 'combo_depil_classica', color: '#0369a1', price: 270, min: 100, isCombo: true, hasTantrica: false, hideTouch: true,
    PT: { title: 'Pelos Aparados + Corpo Leve', category: 'Pacote Duplo', desc: 'Primeiro eu aparo seus pelos com a maquininha. Depois, você deita e eu faço a massagem clássica no seu corpo inteiro para tirar o cansaço. De R$ 287 por R$ 270.' }
  },
  {
    id: 'combo_classica_2', color: '#3f3f46', price: 320, min: 60, isCombo: true, hasTantrica: false, hideTouch: true,
    PT: { title: 'Manutenção do Corpo', category: '2 Sessões Clássicas', desc: 'Duas vezes no mês você vem me ver apenas para amassar os músculos do corpo todo e desestressar. Não tem massagem íntima. De R$ 360 por R$ 320.' }
  },
  {
    id: 'combo_classica_4', color: '#18181b', price: 560, min: 60, isCombo: true, hasTantrica: false, hideTouch: true,
    PT: { title: 'Mês Zero Dores', category: '4 Sessões Clássicas', desc: 'Você vem uma vez por semana. Eu solto seus nós de tensão do corpo todo e te deixo novo pra aguentar a rotina. De R$ 720 por R$ 560.' }
  },
  {
    id: 'combo_tantrica_2', color: '#831843', price: 590, min: 60, isCombo: true, hasTantrica: true, hideTouch: true,
    PT: { title: 'Pacote do Prazer', category: '2 Sessões Tântricas', desc: 'Você vem um dia para fazer a "Corpo a Corpo", e num outro dia marca a "A Sua Vez de Tocar". Ambas começam relaxando o corpo e finalizam com a técnica íntima. De R$ 750 por R$ 590.' }
  },
  {
    id: 'combo_tantrica_4', color: '#1e1b4b', price: 890, min: 60, isCombo: true, hasTantrica: true, hideTouch: true,
    PT: { title: 'O Mês Completo', category: '4 Sessões Tântricas', desc: 'Você vem toda semana. Começamos com a massagem básica e o contato vai aumentando a cada semana até chegar nas mais completas sem roupa. De R$ 1.200 por R$ 890.' }
  }
];

// ADICIONAIS INTELIGENTES DENTRO DO CARD
const ADDONS_OPTIONS = [
  { id: 'touch', label: 'Quero te tocar', price: 50 },
  { id: 'kisses', label: 'Beijos', price: 50 },
  { id: 'time', label: '+30 minutos extras', price: 75 },
  { id: 'aparo', label: 'Aparo de Pêlos', price: 107 },
];

// ==================================================================================
// UTILITÁRIOS E ÍCONES
// ==================================================================================
const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 20) => { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const ICON_PATHS: Record<string, string> = {
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'gift': 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  'close': 'M18 6L6 18 M6 6l12 12',
  'ticket': 'M15 5.5a4 4 0 0 0-4 4v3a4 4 0 0 1-4 4H3M21 5.5a4 4 0 0 1-4 4v3a4 4 0 0 0-4 4h-8M3 13h18M3 5.5v13M21 5.5v13',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'lock': 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M7 11V7a5 5 0 0 1 10 0v4',
  'check': 'M20 6L9 17l-5-5'
};

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICON_PATHS[name] || ''} /></svg>
));

// ==================================================================================
// ESTILOS DO SITE
// ==================================================================================
const CinematicStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }
    
    :root {
      --font-ui: 'DM Sans', sans-serif;
      --font-serif: 'Newsreader', serif;
      --c-bg: #111111;
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
    
    .toast-enter { animation: toastEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes toastEnter {
      0% { opacity: 0; transform: translate(-50%, -20px); }
      100% { opacity: 1; transform: translate(-50%, 0); }
    }

    .modern-input {
      background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.1);
      color: white; border-radius: 0; padding: 16px 0; transition: border-color 0.3s;
    }
    .modern-input:focus { outline: none; border-bottom-color: rgba(255,255,255,0.8); }
    .modern-input::placeholder { color: rgba(255,255,255,0.2); }

    .custom-slider {
      -webkit-appearance: none; width: 100%; background: transparent; outline: none; margin: 0;
    }
    .custom-slider::-webkit-slider-thumb {
      -webkit-appearance: none; height: 28px; width: 28px; border-radius: 50%;
      background: white; margin-top: -11px; box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
      cursor: grab; transition: transform 0.15s ease;
    }
    .custom-slider::-webkit-slider-thumb:active { transform: scale(1.15); cursor: grabbing; }
    .custom-slider::-webkit-slider-runnable-track {
      width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px;
    }

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
  const [usedCoupons, setUsedCoupons] = useState<string[]>([]);
  
  const [giftApplied, setGiftApplied] = useState(false);
  
  const [bookingMode, setBookingMode] = useState<'single'|'estetica'|'combo'>('single');
  const activeList = bookingMode === 'single' ? MOODS : bookingMode === 'estetica' ? ESTETICA : COMBOS;
  
  const [moodIndex, setMoodIndex] = useState(0);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  const numberInputRef = useRef<HTMLInputElement>(null);

  const T = TEXTS.PT;

  const [data, setData] = useState({
    name: '', locType: '', cep: '', street: '', number: '', comp: '', bairro: '', 
    date: null as Date | null, time: '', addons: {} as Record<string, boolean>,
    req: '', payment: ''
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('thaly_onboard_final');
    const hasBookedBefore = localStorage.getItem('thaly_returning_final');
    const storedCoupons = localStorage.getItem('thaly_used_coupons');
    
    if (storedCoupons) {
      try { setUsedCoupons(JSON.parse(storedCoupons)); } catch(e) {}
    }
    if (hasOnboarded === 'yes') setStep(1);
    if (hasBookedBefore === 'yes') setIsReturningClient(true);
    
    // Reseta o index e as personalizações ao trocar de aba
    setMoodIndex(0);
    setData(prev => ({ ...prev, addons: {} }));
  }, [bookingMode, activeList]);

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

  const mood = useMemo(() => activeList[moodIndex] || activeList[0], [moodIndex, activeList]);

  const acceptTermsAndContinue = () => {
    vibrate(30);
    localStorage.setItem('thaly_onboard_final', 'yes');
    setStep(1);
  };

  const toggleAddon = (addonId: string) => {
    vibrate(15);
    setData(prev => ({
      ...prev,
      addons: { ...prev.addons, [addonId]: !prev.addons[addonId] }
    }));
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (usedCoupons.includes(code)) {
      vibrate(50);
      setCouponError('Esse cupom já foi usado.');
      setTimeout(() => setCouponError(''), 2500);
      return;
    }

    if (CONFIG.COUPONS[code as keyof typeof CONFIG.COUPONS]) {
      vibrate([20, 40]);
      setAppliedCoupon(code);
      setGiftApplied(false);
      setCouponError('');
    } else {
      vibrate(50);
      setCouponError('Cupom inválido.');
      setTimeout(() => setCouponError(''), 2500);
      setAppliedCoupon('');
    }
  };

  const resetFlow = () => {
    vibrate(20);
    const hasOnboarded = localStorage.getItem('thaly_onboard_final');
    const hasBookedBefore = localStorage.getItem('thaly_returning_final');
    
    setIsReturningClient(hasBookedBefore === 'yes');
    setGiftApplied(false);
    setAppliedCoupon('');
    setCouponInput('');
    setData({
      name: '', locType: '', cep: '', street: '', number: '', comp: '', bairro: '', 
      date: null, time: '', addons: {}, req: '', payment: ''
    });
    
    setStep(hasOnboarded === 'yes' ? 1 : 0);
    window.scrollTo(0,0);
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
            ...prev, street: json.logradouro || '', bairro: json.bairro || '' 
          }));
          setTimeout(() => numberInputRef.current?.focus(), 150);
        }
      } catch (e) {}
    }
  };

  const handlePaymentSelect = (method: string) => {
    setData({...data, payment: method});
    if (method === 'pix') {
      try {
        navigator.clipboard.writeText(CONFIG.PIX_KEY);
        showToast('✅ Chave Pix copiada!');
        vibrate([20, 40]);
      } catch (err) {
        console.error('Falha ao copiar:', err);
      }
    } else {
      vibrate(20);
    }
  };

  const isStep2Valid = data.name.trim().length > 1 && data.locType !== '' && 
    (data.locType === 'studio' || (data.locType === 'home' && data.street.trim() !== '' && data.number.trim() !== '' && data.bairro.trim() !== ''));

  const fin = useMemo(() => {
    let basePrice = mood.price;
    let dur = mood.min;
    let addonsTotal = 0;
    
    // Soma os adicionais selecionados
    ADDONS_OPTIONS.forEach(addon => {
      if (data.addons[addon.id]) {
        addonsTotal += addon.price;
        if (addon.id === 'time') dur += 30;
      }
    });
    
    let reqFee = data.req.trim().length > 3 ? 130 : 0;
    let peakFee = (PEAK_HOURS.includes(data.time) && data.locType !== 'studio') ? PEAK_FEE : 0;
    
    let subTotal = basePrice + addonsTotal + reqFee;
    let discountGift = giftApplied ? 15 : 0;
    let couponDiscountValue = 0;
    
    if (appliedCoupon) {
      const val = CONFIG.COUPONS[appliedCoupon as keyof typeof CONFIG.COUPONS];
      couponDiscountValue = val < 1 ? Math.floor(subTotal * val) : val;
    }
    
    let totalAfterDiscounts = Math.max(0, subTotal - discountGift - couponDiscountValue);
    let pixDiscount = data.payment === 'pix' ? Math.ceil(totalAfterDiscounts * 0.03) : 0;
    
    let finalTotal = totalAfterDiscounts - pixDiscount + peakFee;
    
    // The signal is now fixed to R$ 50
    let sinal = CONFIG.SIGNAL_AMOUNT; 
    
    return { 
      basePrice, addonsTotal, reqFee, peakFee, discountGift, 
      couponDiscount: couponDiscountValue, pixDiscount, 
      total: finalTotal, sinal, dur 
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
    const paymentMethod = data.payment === 'pix' ? 'Pix' : data.payment === 'card' ? 'Cartão' : 'Dinheiro';

    let locationText = data.locType === 'studio' ? 
      `Irei até a sua Suíte (Bela Vista)` : 
      `Você virá até o meu endereço: ${data.street}, ${data.number}${data.comp ? ', ' + data.comp : ''}, ${data.bairro}`;

    let text = `Oi Thalyson, tudo bem? Fechei pelo seu site e quero confirmar nosso horário.\n\n`;
    text += `*MEU NOME:* ${data.name}\n\n`;
    
    text += `*A MASSAGEM QUE EU QUERO:*\n`;
    text += `• ${mood.PT.title} (${mood.PT.category})\n`;
    text += `_“${mood.PT.desc}”_\n\n`;

    const activeAddons = ADDONS_OPTIONS.filter(a => data.addons[a.id]);

    if (activeAddons.length > 0) {
      text += `*ADICIONAIS ESCOLHIDOS:*\n`;
      activeAddons.forEach(a => {
        text += `• ${a.label} (+ R$ ${a.price})\n`;
      });
      text += `\n`;
    }

    text += `*DIA E LOCAL:*\n`;
    text += `• Dia: ${dStr} às ${data.time}\n`;
    text += `• Duração: até ${fin.dur} min\n`;
    text += `• Local: ${locationText}\n\n`;

    if (data.req.trim()) {
      text += `*MEU PEDIDO ESPECÍFICO:*\n`;
      text += `• "${data.req.trim()}"\n\n`;
    }

    text += `*OS VALORES:*\n`;
    if (fin.addonsTotal > 0) text += `• Total dos adicionais: + ${formatMoney(fin.addonsTotal)}\n`;
    if (fin.reqFee > 0) text += `• Taxa de pedido: + ${formatMoney(fin.reqFee)}\n`;
    if (fin.peakFee > 0) text += `• Taxa de Deslocamento/Pico: + ${formatMoney(fin.peakFee)}\n`;
    if (fin.discountGift > 0 || fin.couponDiscount > 0 || fin.pixDiscount > 0) {
      let totalDesc = fin.discountGift + fin.couponDiscount + fin.pixDiscount;
      text += `• Meus descontos: - ${formatMoney(totalDesc)}\n`;
    }
    
    text += `*Valor Final:* ${formatMoney(fin.total)} (vou pagar no ${paymentMethod})\n`;
    text += `*Sinal para garantir a reserva:* ${formatMoney(fin.sinal)}\n`;
    text += `*Restante lá na hora:* ${formatMoney(fin.total - fin.sinal)}\n\n`;

    text += `Estou ciente do sinal para fechar o horário. Aguardo sua resposta pra confirmar!`;
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
  }, [data, mood, fin, appliedCoupon]);

  const finishFlow = () => {
    vibrate([30,50]);
    localStorage.setItem('thaly_returning_final', 'yes');
    
    if (appliedCoupon && !usedCoupons.includes(appliedCoupon)) {
      const newUsed = [...usedCoupons, appliedCoupon];
      setUsedCoupons(newUsed);
      localStorage.setItem('thaly_used_coupons', JSON.stringify(newUsed));
    }
    
    setIsReturningClient(true);
    setStep(5);
    window.location.href = wppLink;
  };

  // Renderiza a área de botões de personalização (Add-ons)
  const renderAddons = () => {
    const available = ADDONS_OPTIONS.filter(a => !(a.id === 'touch' && mood.hideTouch));
    
    if (available.length === 0) return null;

    return (
      <div className="mt-6 pt-5 border-t border-white/10 relative z-10">
        <p className="text-[11px] text-white/50 uppercase tracking-widest font-bold mb-4">Personalize esta sessão:</p>
        <div className="flex flex-wrap gap-2">
          {available.map(addon => {
            const isActive = data.addons[addon.id];
            return (
              <button
                key={addon.id}
                onClick={(e) => { e.stopPropagation(); toggleAddon(addon.id); }}
                className={`px-3 py-2.5 text-[11px] outline-none font-bold uppercase tracking-widest rounded-sm border transition-all duration-300 ${isActive ? 'bg-[#4ade80] text-black border-[#4ade80] shadow-[0_0_15px_rgba(74,222,128,0.2)]' : 'bg-transparent text-white/60 border-white/20 hover:border-white/50 hover:text-white'}`}
              >
                {addon.label} <span className={`font-normal ml-1 ${isActive ? 'text-black/60' : 'text-white/40'}`}>(+R$ {addon.price})</span>
              </button>
            )
          })}
        </div>
      </div>
    )
  };

  return (
    <>
      <CinematicStyles />
      <div className="grain-overlay" />
      <div className="ambient-glow" style={{ backgroundColor: mood.color }} />

      {toastMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-[#4ade80] text-black px-5 py-3 flex items-center gap-2 rounded-full shadow-2xl toast-enter">
          <Icon name="check" size={18} />
          <span className="text-[11px] font-bold uppercase tracking-widest">{toastMsg}</span>
        </div>
      )}

      <div className="relative z-10 min-h-[100dvh] flex flex-col px-6 py-10 max-w-md mx-auto">
        
        {step > 0 && (
          <header className="flex justify-between items-center mb-10 step-enter">
            <button onClick={() => setIsProfileOpen(true)} className="text-left group outline-none py-2 flex items-center gap-3">
              <img src="FmtU3Ogx_400x400.jpg" alt="Thalyson" className="w-10 h-10 rounded-full object-cover border border-white/20 shadow-lg transition-transform group-hover:scale-105" />
              <span style={{ fontFamily: 'var(--font-serif)' }} className="text-xl italic text-white/90 group-hover:text-white transition-colors">
                Thalyson Massagens.
              </span>
            </button>
            <div className="flex gap-1.5 mr-2">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-[3px] rounded-full transition-all duration-500 ${step >= i ? 'w-5 bg-white' : 'w-2 bg-white/20'}`} />
              ))}
            </div>
          </header>
        )}

        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsProfileOpen(false)}>
            <div className="bg-[#09090b] border border-white/10 rounded-md w-full max-w-sm p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors outline-none">
                <Icon name="close" size={20} />
              </button>
              <img src="FmtU3Ogx_400x400.jpg" className="w-24 h-24 rounded-full object-cover mb-5 border border-white/10 shadow-lg" alt="Thalyson" />
              <h2 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl text-white mb-1">Thalyson.</h2>
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-6">Atendimento Masculino</p>
              <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                <p>Sou terapeuta focado no público masculino. Meu trabalho é simples: usar as minhas mãos para tirar o peso do seu corpo inteiro, aliviar o seu estresse e te dar prazer num ambiente tranquilo e acolhedor.</p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors outline-none">
                  <Icon name="instagram" size={16} /> Meu Instagram
                </a>
              </div>
            </div>
          </div>
        )}

        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center step-enter pb-10">
            <h1 style={{ fontFamily: 'var(--font-serif)', whiteSpace: 'pre-line' }} className="text-4xl leading-tight mb-10">{T.gateTitle}</h1>
            
            <div className="space-y-6 mb-12">
              <div className="flex gap-4 p-4 border border-white/10 bg-white/5 rounded-sm">
                <div className="mt-1"><Icon name="shield" size={20} className="text-white/60"/></div>
                <p className="text-white/60 text-sm leading-relaxed">{T.gatePrivacyDesc}</p>
              </div>
              <div className="flex gap-4 p-4 border border-white/10 bg-white/5 rounded-sm">
                <div className="mt-1"><Icon name="lock" size={20} className="text-white/60"/></div>
                <p className="text-white/60 text-sm leading-relaxed">{T.gateAgeDesc}</p>
              </div>
            </div>

            <button onClick={acceptTermsAndContinue} className="bg-white text-black h-14 w-full font-bold tracking-widest uppercase transition-transform active:scale-95 outline-none rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              {T.gateBtn}
            </button>
          </div>
        )}

        <div className={step >= 1 && step < 5 ? "block" : "hidden"}>
          
          <div id="step-1" className="step-enter mb-16">
            <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step1Label}</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step1Title}</h1>
            
            <div className="flex bg-white/5 p-1 rounded-sm border border-white/10 mb-8 overflow-x-auto hide-scrollbar">
              <button onClick={() => { vibrate(10); setBookingMode('single'); }} 
                className={`flex-1 py-3 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors rounded-sm outline-none whitespace-nowrap ${bookingMode === 'single' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}>
                {T.tabSingle}
              </button>
              <button onClick={() => { vibrate(10); setBookingMode('estetica'); }} 
                className={`flex-1 py-3 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors rounded-sm outline-none whitespace-nowrap ${bookingMode === 'estetica' ? 'bg-[#2dd4bf] text-black shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'text-white/40 hover:text-white'}`}>
                {T.tabEstetica}
              </button>
              <button onClick={() => { vibrate(10); setBookingMode('combo'); }} 
                className={`flex-1 py-3 px-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors rounded-sm outline-none whitespace-nowrap ${bookingMode === 'combo' ? 'bg-[#f59e0b] text-black shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'text-white/40 hover:text-white'}`}>
                {T.tabCombo}
              </button>
            </div>

            {bookingMode === 'single' ? (
              <>
                <div className="mb-10">
                  <p className="text-[12px] text-white/80 font-medium mb-5 text-center">
                    Deslize o botão abaixo para encontrar o nível exato da sensação que você quer sentir hoje:
                  </p>
                  <div className="flex justify-between items-center text-[10px] text-white/50 uppercase tracking-widest font-bold mb-3 px-1">
                    <span>Apenas Relaxar</span>
                    <span>Prazer Máximo</span>
                  </div>
                  <div className="relative py-2">
                    <div className="absolute top-1/2 left-0 w-full h-1.5 bg-white/10 rounded-full -translate-y-1/2 pointer-events-none" />
                    <div className="absolute top-1/2 left-0 h-1.5 rounded-full -translate-y-1/2 pointer-events-none transition-all duration-300"
                      style={{ width: `${(moodIndex / Math.max(1, activeList.length - 1)) * 100}%`, backgroundColor: 'white' }}
                    />
                    <input type="range" min="0" max={Math.max(0, activeList.length - 1)} value={moodIndex} 
                      onChange={(e) => { vibrate(10); setMoodIndex(Number(e.target.value)); }}
                      className="custom-slider relative z-10 w-full"
                    />
                  </div>
                </div>

                <div className="p-6 backdrop-blur-xl border rounded-xl relative transition-all duration-500 shadow-2xl bg-[#1c1c1e] border-white/10 flex flex-col text-left">
                  <h3 className="font-bold text-2xl text-white tracking-wide leading-tight mb-1">{mood.PT.title}</h3>
                  <p className="text-[11px] text-[#4ade80] font-bold uppercase tracking-widest mb-3">{mood.PT.category}</p>
                  <span className="text-xl font-bold text-white/90 mb-4">
                    {formatMoney(mood.price)} <span className="text-[10px] font-normal text-white/40 ml-1">{T.upTo} {mood.min}M</span>
                  </span>
                  
                  <p className="text-[14px] text-white/70 leading-relaxed">{mood.PT.desc}</p>

                  {mood.hasTantrica && (
                    <div className="mt-6 mb-2">
                      <span className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
                        ✅ Inclui Finalização Íntima
                      </span>
                    </div>
                  )}

                  {/* RENDERIZA OS ADDONS DA SESSÃO */}
                  {renderAddons()}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {activeList.map((m, idx) => {
                  const active = moodIndex === idx;
                  return (
                    <div key={m.id} className={`w-full text-left p-6 transition-all duration-300 border rounded-xl flex flex-col ${active ? 'bg-[#1c1c1e] border-white/20 scale-100' : 'bg-transparent border-white/5 opacity-60 hover:opacity-100 scale-[0.98]'}`}>
                      
                      <button onClick={() => { vibrate(20); setMoodIndex(idx); }} className="w-full text-left outline-none">
                        <h3 className={`font-bold text-xl tracking-wide leading-tight mb-1 ${active ? 'text-white' : 'text-white/70'}`}>{m.PT.title}</h3>
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${active ? 'text-[#4ade80]' : 'text-[#4ade80]/60'}`}>{m.PT.category}</p>
                        <span className={`block text-lg font-bold mb-4 ${active ? 'text-white/90' : 'text-white/50'}`}>{formatMoney(m.price)}</span>
                        
                        {active && <p className="text-[13px] text-white/60 leading-relaxed">{m.PT.desc}</p>}

                        {active && m.hasTantrica && (
                          <div className="mt-5 mb-2">
                            <span className="inline-block bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm">
                              ✅ Inclui Finalização Íntima
                            </span>
                          </div>
                        )}
                      </button>

                      {/* RENDERIZA OS ADDONS DA SESSÃO QUANDO ATIVO */}
                      {active && renderAddons()}
                    </div>
                  )
                })}
              </div>
            )}

            {step === 1 && (
              <button onClick={() => { vibrate(30); setStep(2); }} className="mt-8 bg-white text-black h-14 w-full font-bold tracking-widest uppercase transition-transform active:scale-95 outline-none rounded-sm">
                {T.btnContinue}
              </button>
            )}
          </div>

          {step >= 2 && (
            <div id="step-2" className="step-enter mb-16 pt-8 border-t border-white/10">
              <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step2Label}</h2>
              <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step2Title}</h1>

              <div className="space-y-6">
                <input type="text" placeholder={T.namePlace} value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="w-full modern-input text-lg font-medium" />

                <div className="pt-4">
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.locLabel}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={()=>setData({...data, locType:'studio'})} className={`py-4 px-2 text-sm font-medium outline-none transition-colors border rounded-sm ${data.locType==='studio' ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{T.locStudio}</button>
                    <button onClick={()=>setData({...data, locType:'home'})} className={`py-4 px-2 text-sm font-medium outline-none transition-colors border rounded-sm ${data.locType==='home' ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{T.locHome}</button>
                  </div>
                </div>

                {data.locType === 'studio' && <p className="text-sm text-white/60 bg-white/5 p-4 border border-white/10 leading-relaxed rounded-sm step-enter">{T.studioDesc}</p>}
                
                {data.locType === 'home' && (
                  <div className="space-y-4 step-enter">
                    <input type="tel" maxLength={9} placeholder={T.cep} value={data.cep} onChange={e=>handleCep(e.target.value)} className="w-full modern-input" />
                    <input type="text" placeholder={T.street} value={data.street} onChange={e=>setData({...data, street: e.target.value})} className="w-full modern-input" />
                    <div className="flex gap-4">
                      <input ref={numberInputRef} type="text" placeholder={T.number} value={data.number} onChange={e=>setData({...data, number: e.target.value})} className="w-1/3 modern-input" />
                      <input type="text" placeholder={T.comp} value={data.comp} onChange={e=>setData({...data, comp: e.target.value})} className="w-2/3 modern-input" />
                    </div>
                    <input type="text" placeholder={T.bairroPlace} value={data.bairro} onChange={e=>setData({...data, bairro: e.target.value})} className="w-full modern-input" />
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

          {step >= 3 && (
            <div id="step-3" className="step-enter mb-16 pt-8 border-t border-white/10">
              <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step3Label}</h2>
              <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step3Title}</h1>

              <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-4 mb-6">
                {days.map((d, i) => {
                  const sel = data.date?.toDateString() === d.toDateString();
                  const dayName = d.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3);
                  return (
                    <button key={i} onClick={() => setData({...data, date: d, time: ''})} className={`shrink-0 w-16 h-20 outline-none flex flex-col items-center justify-center border rounded-sm transition-all ${sel ? 'bg-white text-black border-white' : 'border-white/10 text-white/50'}`}>
                      <span className="text-[10px] uppercase font-bold tracking-widest">{dayName}</span>
                      <span style={{ fontFamily: 'var(--font-serif)' }} className="text-2xl mt-1">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              {data.date && (
                <div className="grid grid-cols-3 gap-3 step-enter">
                  {getSlots().map(t => {
                    const sel = data.time === t;
                    return (
                      <button key={t} onClick={() => { vibrate(20); setData({...data, time: t}); if (step === 3) setStep(4); }} 
                        className={`py-4 text-sm outline-none font-medium border rounded-sm transition-colors ${sel ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>
                        {t}
                      </button>
                    )
                  })}
                  {getSlots().length === 0 && <p className="col-span-3 text-sm text-white/40 text-center py-4 border border-white/5 rounded-sm">{T.noSlots}</p>}
                </div>
              )}
            </div>
          )}

          {step >= 4 && (
            <div id="step-4" className="step-enter mb-8 pt-8 border-t border-white/10">
              <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step4Label}</h2>
              <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step4Title}</h1>

              <div className="space-y-8">
                
                <div className="space-y-5">
                  {!isReturningClient && !appliedCoupon && !giftApplied && (
                    <div className="p-6 border border-[#4ade80]/40 bg-[#4ade80]/10 rounded-md flex flex-col items-start relative overflow-hidden shadow-[0_0_20px_rgba(74,222,128,0.05)]">
                      <div className="absolute -right-4 -bottom-4 opacity-5"><Icon name="gift" size={120} /></div>
                      <div className="relative z-10 w-full">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="gift" className="text-[#4ade80]" size={18} />
                          <h3 className="text-[#4ade80] font-bold uppercase tracking-widest text-xs">{T.giftTitle}</h3>
                        </div>
                        <p className="text-sm text-[#4ade80]/90 mb-5 leading-relaxed">{T.giftDesc}</p>
                        <button onClick={() => {vibrate(30); setGiftApplied(true);}} className="bg-[#4ade80] text-black w-full text-xs font-bold px-5 py-3.5 uppercase tracking-widest outline-none rounded-sm transition-transform active:scale-95">
                          {T.giftBtn}
                        </button>
                      </div>
                    </div>
                  )}

                  {!isReturningClient && giftApplied && (
                    <div className="flex justify-between items-center p-4 bg-[#4ade80]/10 border border-[#4ade80]/30 rounded-sm">
                      <span className="text-[#4ade80] text-sm font-bold flex items-center gap-2"><Icon name="check" size={16}/> {T.giftActive}</span>
                      <button onClick={() => setGiftApplied(false)} className="text-white/50 hover:text-white text-xs underline outline-none">{T.btnRemove}</button>
                    </div>
                  )}

                  {!giftApplied && (
                    <div>
                      <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.couponLabel}</p>
                      <div className="flex gap-3">
                        <input type="text" placeholder={T.couponPlace} value={couponInput} onChange={e => {setCouponInput(e.target.value); setCouponError('');}} disabled={!!appliedCoupon}
                          className={`flex-1 bg-white/5 border ${couponError ? 'border-red-500/50' : 'border-white/10'} text-white rounded-sm px-4 outline-none focus:border-white/50 transition-colors uppercase disabled:opacity-50`}
                        />
                        {!appliedCoupon ? (
                          <button onClick={handleApplyCoupon} className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-sm transition-colors outline-none">{T.couponBtn}</button>
                        ) : (
                          <button onClick={() => { setAppliedCoupon(''); setCouponInput(''); }} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-sm transition-colors outline-none">{T.btnRemove}</button>
                        )}
                      </div>
                      {couponError && <p className="text-xs text-red-400 mt-3">{couponError}</p>}
                      {appliedCoupon && <p className="text-xs text-[#4ade80] mt-3">✅ Cupom <strong>{appliedCoupon}</strong> {T.couponActive} (-{formatMoney(fin.couponDiscount)})</p>}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs text-white/50 uppercase tracking-widest">{T.reqLabel}</p>
                  </div>
                  <input type="text" placeholder={T.reqPlace} value={data.req} onChange={e=>setData({...data, req:e.target.value})} className="w-full modern-input text-sm" />
                  <p className="text-[10px] text-white/40 mt-2 leading-relaxed">{T.reqDesc}</p>
                </div>

                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.payLabel}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[{id:'pix', l:T.payPix},{id:'card', l:T.payCard},{id:'cash', l:T.payCash}].map(p => (
                      <button key={p.id} onClick={() => handlePaymentSelect(p.id)} className={`py-4 outline-none text-[11px] sm:text-xs font-bold uppercase tracking-wider border rounded-sm transition-colors ${data.payment === p.id ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{p.l}</button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/10">
                  <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subBase}</span><span>{formatMoney(fin.basePrice)}</span></div>
                  {fin.addonsTotal > 0 && <div className="flex justify-between text-sm text-[#4ade80] mb-2"><span>{T.subExtras}</span><span>+{formatMoney(fin.addonsTotal)}</span></div>}
                  {fin.reqFee > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subReq}</span><span>+{formatMoney(fin.reqFee)}</span></div>}
                  {fin.discountGift > 0 && <div className="flex justify-between text-sm text-[#4ade80] mb-2"><span>{T.subGift}</span><span>-{formatMoney(fin.discountGift)}</span></div>}
                  {fin.couponDiscount > 0 && <div className="flex justify-between text-sm text-[#4ade80] mb-2"><span>{T.subCoupon}</span><span>-{formatMoney(fin.couponDiscount)}</span></div>}
                  {fin.peakFee > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subPeak}</span><span>+{formatMoney(fin.peakFee)}</span></div>}
                  {fin.pixDiscount > 0 && <div className="flex justify-between text-sm text-[#4ade80] mb-2"><span>{T.subPix}</span><span>-{formatMoney(fin.pixDiscount)}</span></div>}
                  
                  <div className="flex justify-between items-end mt-8 mb-4">
                    <span className="text-sm uppercase tracking-widest text-white/50">{T.total}</span>
                    <span style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl text-white">{formatMoney(fin.total)}</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-md mb-8">
                    <p className="text-xs text-white/80 leading-relaxed text-center">
                      Pra deixar o horário 100% fechado, me manda o sinal de <strong className="text-[#4ade80]">R$ 50,00 agora</strong> via Pix. O restante a gente acerta lá na hora.
                    </p>
                  </div>

                  <button disabled={!data.payment} onClick={finishFlow} className="bg-white text-black h-16 w-full font-bold tracking-widest uppercase disabled:opacity-20 transition-opacity outline-none rounded-sm shadow-xl shadow-white/10">
                    {T.btnFinish}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {step === 5 && (
          <div className="flex-1 flex flex-col justify-center text-center step-enter pb-20">
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl mb-4">{T.step5Title}</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-6">{T.step5Desc}</p>
            
            <div className="bg-white/5 border border-white/10 p-5 rounded-sm mb-10 text-left">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="ticket" className="text-[#4ade80]" size={16} />
                <p className="text-[#4ade80] text-xs font-bold uppercase tracking-widest">Desconto pra próxima</p>
              </div>
              <p className="text-sm text-white/70">Guarde o cupom <strong className="text-white">SESSAO2</strong>. Quando for marcar a próxima vez, coloca ele lá pra ganhar 8% de desconto.</p>
            </div>

            <a href={wppLink} className="bg-transparent border border-white text-white flex items-center justify-center h-14 w-full font-bold tracking-widest uppercase transition-colors hover:bg-white hover:text-black outline-none rounded-sm no-underline">
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
