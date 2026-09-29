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
  
  // CUPONS
  COUPONS: {
    "SESSAO2": 0.08,
    "RELAXAR13": 0.13,
    "THALY20": 20,
    "BEMVINDO50": 50
  }
};

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const PEAK_FEE = 15;

// ==================================================================================
// DICIONÁRIO E TEXTOS
// ==================================================================================
const TEXTS = {
  PT: {
    step1Label: "Passo 1",
    step1Title: "O que você busca hoje?",
    tabSingle: "Só Hoje",
    tabEstetica: "Estética",
    tabCombo: "Ciclos",
    btnContinue: "Continuar",
    step2Label: "Passo 2",
    step2Title: "Quem e Onde",
    namePlace: "Como prefere ser chamado?",
    locLabel: "Onde será a sessão?",
    locStudio: "Minha Suíte (Bela Vista)",
    locHome: "Seu Espaço (Vou até você)",
    studioDesc: "Atendo sozinho em uma suíte privativa na Bela Vista. O endereço completo e as instruções eu te mando no WhatsApp assim que confirmarmos o horário.",
    cep: "CEP (opcional)",
    street: "Rua ou Avenida",
    number: "Número",
    comp: "Apto / Quarto (opcional)",
    bairroPlace: "Bairro",
    btnNext: "Avançar para Horários",
    step3Label: "Passo 3",
    step3Title: "Qual o melhor horário?",
    noSlots: "Nenhum horário disponível hoje.",
    step4Label: "Passo 4",
    step4Title: "Resumo e Pagamento",
    giftTitle: "Presente Liberado",
    giftDesc: "Como é sua primeira vez marcando por aqui, deixei um pequeno desconto no valor final.",
    giftBtn: "Desbloquear Cortesia (R$ 15)",
    giftActive: "Presente de 1ª vez ativo",
    couponLabel: "Tem um cupom?",
    couponPlace: "Digite o código",
    couponBtn: "Aplicar",
    couponActive: "aplicado",
    btnRemove: "Remover",
    addons: "Adicionais para hoje",
    reqLabel: "Algum pedido especial?",
    reqPlace: "Fetiche, detalhe ou vontade...",
    reqDesc: "Sujeito a avaliação na hora. Caso não seja possível realizar o pedido, a taxa não será cobrada.",
    payLabel: "Forma de pagamento na hora",
    payPix: "Pix (3% OFF)",
    payCard: "Cartão",
    payCash: "Dinheiro",
    subBase: "Valor Base",
    subExtras: "Extras",
    subReq: "Pedido Especial",
    subGift: "Cortesia (1ª Vez)",
    subCoupon: "Cupom Aplicado",
    subPeak: "Deslocamento",
    subPix: "Desconto Pix",
    total: "Total",
    btnFinish: "Finalizar Agendamento",
    step5Title: "Tudo Pronto",
    step5Desc: "Sua solicitação foi gerada e enviada para o WhatsApp. Caso o aplicativo não abra sozinho, clique no botão abaixo.",
    btnSend: "Confirmar no WhatsApp",
    btnBack: "Voltar para o início",
  }
};

const MOODS = [
  {
    id: 'classica', color: '#1c1c1e', accent: '#ffffff', price: 180, min: 60, isCombo: false,
    PT: { 
      title: 'Opção 1: Clássica', 
      subtitle: 'Tensão e peso nas costas.', 
      service: 'Massagem Clássica', 
      desc: 'Suas costas estão pesadas? A clássica resolve. Uso pressão firme nos pontos certos para desmanchar a tensão. O foco aqui é puramente muscular, sem nenhum toque íntimo. Você entra travado e sai renovado.' 
    }
  },
  {
    id: 'naturista', color: '#2c2c2e', accent: '#a8a8aa', price: 240, min: 60, isCombo: false,
    PT: { 
      title: 'Opção 2: Clássica Naturista', 
      subtitle: 'Relaxamento profundo em total liberdade.', 
      service: 'Massagem Naturista', 
      desc: 'Quer relaxar sem amarras? Essa é a massagem clássica, mas nós dois ficamos completamente nus. A pele respira e o toque flui melhor. O foco é soltar a musculatura. Não rola toque íntimo, apenas a troca, o respeito e a leveza do naturismo.' 
    }
  },
  {
    id: 'sensitiva', color: '#4a3000', accent: '#f5a623', price: 200, min: 60, isCombo: false,
    PT: { 
      title: 'Opção 3: Sensorial', 
      subtitle: 'Começa relaxando, termina aliviando.', 
      service: 'Sensitiva / Tântrica', 
      desc: 'Uma jornada que começa nas costas e termina onde você precisa. Eu destravo seus músculos primeiro. Depois a gente evolui para toques mais sutis na pele até chegar na técnica íntima final. Corpo leve e mente vazia.' 
    }
  },
  {
    id: 'fusion', color: '#4a001a', accent: '#ff2d55', price: 250, min: 60, isCombo: false,
    PT: { 
      title: 'Opção 4: Fusion', 
      subtitle: 'Mais contato físico e calor.', 
      service: 'Experiência Fusion', 
      desc: 'Mais proximidade. Eu fico de cueca e a massagem ganha muito contato corpo a corpo. O toque da minha barba ajuda a arrepiar a pele enquanto relaxamos seu corpo. Finalizamos com uma técnica íntima bem prolongada.' 
    }
  },
  {
    id: 'nuru', color: '#001a4a', accent: '#0a84ff', price: 350, min: 60, isCombo: false,
    PT: { 
      title: 'Opção 5: Nuru', 
      subtitle: 'Escorregadio e intenso.', 
      service: 'Massagem Nuru', 
      desc: 'Imersão total. A gente tira tudo e usa muito gel deslizante. O contato é cem por cento corpo a corpo, escorregando pele na pele até você chegar no ápice. Sem pressa e muito intenso.' 
    }
  },
  {
    id: 'reversa', color: '#003314', accent: '#30d158', price: 400, min: 60, isCombo: false,
    PT: { 
      title: 'Opção 6: Reversa', 
      subtitle: 'Você no controle.', 
      service: 'Massagem Reversa', 
      desc: 'Aqui a regra muda. Eu começo cuidando do seu corpo para tirar o estresse, mas logo você assume o controle. Você explora, toca e dita o ritmo no meu corpo até nós dois chegarmos lá juntos.' 
    }
  }
];

const ESTETICA = [
  {
    id: 'depilacao_solo', color: '#004040', accent: '#64d2ff', price: 107, min: 40, isCombo: false,
    PT: { 
      title: 'Limpeza e Cuidado', 
      subtitle: 'Aparo na máquina e hidratação.', 
      service: 'Estética Corporal', 
      desc: 'Aparo higiênico dos pelos usando máquina. Você escolhe até 3 áreas do corpo usando o pente 0 ou o pente 3. Finalizamos com um creme para acalmar e hidratar a pele.' 
    }
  }
];

const COMBOS = [
  {
    id: 'combo_depil_classica', color: '#1a1a1c', accent: '#ffffff', price: 270, min: 100, isCombo: true,
    PT: { 
      title: 'Renovação Completa', 
      subtitle: 'Depilação + Clássica.', 
      service: '1 Encontro Duplo', 
      desc: 'Aparo na máquina em até 3 lugares. Depois partimos para a Massagem Clássica para destravar o corpo todo. De R$ 287 por R$ 270.' 
    }
  },
  {
    id: 'combo_tantrica_2', color: '#2c1a2c', accent: '#ff375f', price: 590, min: 60, isCombo: true,
    PT: { 
      title: 'Intensidade (Nuru + Reversa)', 
      subtitle: 'Exploração em duas visitas.', 
      service: '2 Encontros', 
      desc: 'Uma sessão Nuru e uma Reversa marcadas em dias diferentes. Ambas começam soltando o corpo para uma finalização intensa. De R$ 750 por R$ 590.' 
    }
  }
];

const EXTRAS = [
  { id: 'aroma', price: 20, PT: { label: 'Óleos essenciais relaxantes' } },
  { id: 'time', price: 75, PT: { label: 'Ficar mais tempo (+30min)' } },
  { id: 'depilacao_extra', price: 107, PT: { label: 'Aparo máq (3 lugares) + Creme' } }
];

// ==================================================================================
// UTILITÁRIOS E ÍCONES
// ==================================================================================
const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 15) => { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const ICON_PATHS: Record<string, string> = {
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'gift': 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  'close': 'M18 6L6 18 M6 6l12 12',
  'ticket': 'M15 5.5a4 4 0 0 0-4 4v3a4 4 0 0 1-4 4H3M21 5.5a4 4 0 0 1-4 4v3a4 4 0 0 0-4 4h-8M3 13h18M3 5.5v13M21 5.5v13',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'lock': 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M7 11V7a5 5 0 0 1 10 0v4',
  'user': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'check': 'M20 6L9 17l-5-5'
};

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICON_PATHS[name] || ''} /></svg>
));

// ==================================================================================
// ESTILOS IOS 2026
// ==================================================================================
const IosStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :root {
      --bg: #000000;
      --surface: #1c1c1e;
      --surface-elevated: #2c2c2e;
      --text: #f5f5f7;
      --text-muted: #86868b;
      --accent: #ffffff;
    }

    *, *::before, *::after { box-sizing: border-box; font-family: 'Inter', system-ui, sans-serif; }
    
    body, html { 
      background-color: var(--bg); 
      color: var(--text); 
      margin: 0; padding: 0;
      -webkit-tap-highlight-color: transparent;
      overscroll-behavior-y: none;
      scroll-behavior: smooth;
    }

    .glass-panel {
      background: rgba(28, 28, 30, 0.6);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
    }

    .ios-input {
      background: var(--surface-elevated);
      border: 1px solid transparent;
      color: var(--text);
      border-radius: 16px;
      padding: 16px;
      width: 100%;
      font-size: 16px;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
      outline: none;
    }
    .ios-input:focus {
      background: rgba(44, 44, 46, 0.8);
      border-color: rgba(255,255,255,0.2);
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .ios-input::placeholder { color: var(--text-muted); }

    .ios-button {
      background: var(--accent);
      color: #000;
      border-radius: 20px;
      font-weight: 600;
      transition: transform 0.2s, opacity 0.2s;
      cursor: pointer;
    }
    .ios-button:active { transform: scale(0.97); opacity: 0.8; }

    .step-enter { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes slideUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
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
  const [giftApplied, setGiftApplied] = useState(false);
  
  const [bookingMode, setBookingMode] = useState<'single'|'estetica'|'combo'>('single');
  const activeList = bookingMode === 'single' ? MOODS : bookingMode === 'estetica' ? ESTETICA : COMBOS;
  const [moodId, setMoodId] = useState(MOODS[0].id);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const numberInputRef = useRef<HTMLInputElement>(null);

  const T = TEXTS.PT;

  const [data, setData] = useState({
    name: '', locType: '', cep: '', street: '', number: '', comp: '', bairro: '', 
    date: null as Date | null, time: '', extras: {} as Record<string, boolean>,
    req: '', payment: ''
  });

  useEffect(() => {
    // Verifica se já aceitou os termos para pular o Gatekeeper (Step 0)
    const hasOnboarded = localStorage.getItem('thaly_onboard_v27');
    const hasBookedBefore = localStorage.getItem('thaly_returning_v27');
    
    if (hasOnboarded === 'yes') setStep(1);
    if (hasBookedBefore === 'yes') setIsReturningClient(true);
    
    setMoodId(activeList[0].id);
  }, [bookingMode, activeList]);

  useEffect(() => {
    if (step > 0 && step < 5 && !isProfileOpen) {
      setTimeout(() => {
        const el = document.getElementById(`step-${step}`);
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 20;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [step, isProfileOpen]);

  const mood = useMemo(() => activeList.find(m => m.id === moodId) || activeList[0], [moodId, activeList]);

  const acceptTermsAndContinue = () => {
    vibrate(30);
    localStorage.setItem('thaly_onboard_v27', 'yes');
    setStep(1);
  };

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (CONFIG.COUPONS[code as keyof typeof CONFIG.COUPONS]) {
      vibrate([20, 40]);
      setAppliedCoupon(code);
      setGiftApplied(false);
    } else {
      vibrate(40);
      setAppliedCoupon('');
    }
  };

  const resetFlow = () => {
    vibrate(20);
    const hasOnboarded = localStorage.getItem('thaly_onboard_v27');
    const hasBookedBefore = localStorage.getItem('thaly_returning_v27');
    
    setIsReturningClient(hasBookedBefore === 'yes');
    setGiftApplied(false);
    setAppliedCoupon('');
    setData({
      name: '', locType: '', cep: '', street: '', number: '', comp: '', bairro: '', 
      date: null, time: '', extras: {}, req: '', payment: ''
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
    if (data.extras['depilacao_extra']) { extrasTotal += 107; dur += 30; }
    
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
    const ext = Object.keys(data.extras).filter(k=>data.extras[k]).map(k=>EXTRAS.find(e=>e.id===k)?.PT.label).join(', ');
    const paymentMethod = data.payment === 'pix' ? 'Pix' : data.payment === 'card' ? 'Cartão' : 'Dinheiro';

    let locationText = data.locType === 'studio' ? 
      `Minha Suíte (Bela Vista)` : 
      `${data.street}, ${data.number}${data.comp ? ', ' + data.comp : ''} - ${data.bairro}`;

    let text = `Oi Thalyson, fechei a reserva no site e vim confirmar.\n\n`;
    text += `*Nome:* ${data.name}\n`;
    text += `*Sessão:* ${mood.PT.title}\n`;
    text += `*Data:* ${dStr} às ${data.time} (Até ${fin.dur} min)\n`;
    text += `*Local:* ${locationText}\n\n`;

    if (ext || data.req.trim()) {
      text += `*Detalhes:*\n`;
      if (ext) text += `• Extras: ${ext}\n`;
      if (data.req.trim()) text += `• Pedido: "${data.req.trim()}"\n`;
      text += `\n`;
    }

    text += `*Acerto:* ${formatMoney(fin.total)} (via ${paymentMethod})\n`;
    if (appliedCoupon) text += `_Cupom usado: ${appliedCoupon}_\n`;
    text += `\nAguardo a confirmação do endereço!`;
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
  }, [data, mood, fin, appliedCoupon]);

  const finishFlow = () => {
    vibrate([30,50]);
    localStorage.setItem('thaly_returning_v27', 'yes');
    setIsReturningClient(true);
    setStep(5);
    window.location.href = wppLink;
  };

  const visibleExtras = EXTRAS.filter(ex => {
    if (ex.id === 'depilacao_extra' && (bookingMode === 'estetica' || mood.id.includes('depil'))) return false;
    return true;
  });

  return (
    <div className="relative min-h-[100dvh] pb-24">
      {/* Background suave que muda conforme a sessão escolhida */}
      <div className="fixed inset-0 z-0 transition-colors duration-1000 ease-in-out opacity-20" style={{ backgroundColor: step === 0 ? '#1c1c1e' : mood.color }} />
      <IosStyles />

      <div className="relative z-10 px-5 pt-8 max-w-md mx-auto">
        
        {/* CABEÇALHO IOS (Escondido na tela inicial de Gatekeeper) */}
        {step > 0 && (
          <header className="flex justify-between items-center mb-8 step-enter">
            <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-3 active:scale-95 transition-transform">
              <img src="FmtU3Ogx_400x400.jpg" alt="Thalyson" className="w-12 h-12 rounded-full object-cover border border-white/20" />
              <div className="text-left">
                <p className="text-sm font-semibold text-white">Thalyson Massagens</p>
                <p className="text-xs text-[#86868b]">Terapeuta</p>
              </div>
            </button>
          </header>
        )}

        {/* MODAL DO PERFIL */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setIsProfileOpen(false)}>
            <div className="glass-panel w-full sm:max-w-sm m-2 sm:m-0 p-8 relative step-enter" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full active:scale-90">
                <Icon name="close" size={20} className="text-white" />
              </button>
              <img src="FmtU3Ogx_400x400.jpg" className="w-20 h-20 rounded-full object-cover mb-4" alt="Thalyson" />
              <h2 className="text-2xl font-semibold mb-1">Thalyson</h2>
              <p className="text-[#86868b] text-sm mb-6">30 anos • Bela Vista, SP</p>
              <div className="space-y-4 text-sm text-[#d1d1d6] leading-relaxed">
                <p>O que eu faço é simples: uso o toque para tirar o peso da sua rotina e entregar uma experiência onde você só precisa fechar os olhos e aproveitar.</p>
              </div>
              <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="mt-8 flex items-center justify-center gap-2 bg-white/10 py-3 rounded-xl text-sm font-semibold active:scale-95 transition-transform">
                <Icon name="instagram" size={18} /> Instagram
              </a>
            </div>
          </div>
        )}

        {/* STEP 0: GATEKEEPER (Boas-Vindas, Privacidade e +18) */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center step-enter pt-12 pb-10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-6">
                <Icon name="lock" size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-3">Bem-vindo(a)</h1>
              <p className="text-[#86868b] text-sm px-4">Antes de agendar sua sessão, por favor, confirme os termos abaixo.</p>
            </div>

            <div className="space-y-4 mb-10">
              {/* Card Privacidade */}
              <div className="glass-panel p-5 rounded-3xl flex gap-4 items-start">
                <div className="mt-1"><Icon name="shield" size={24} className="text-[#64d2ff]"/></div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Privacidade Total</h3>
                  <p className="text-[#86868b] text-sm leading-relaxed">Fique tranquilo, nenhum dado preenchido aqui é salvo. Tudo acontece no seu celular e vai direto para o WhatsApp.</p>
                </div>
              </div>
              
              {/* Card +18 */}
              <div className="glass-panel p-5 rounded-3xl flex gap-4 items-start">
                <div className="mt-1"><Icon name="user" size={24} className="text-[#ff375f]"/></div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Ambiente Reservado</h3>
                  <p className="text-[#86868b] text-sm leading-relaxed">O atendimento é estritamente individual. As sessões focam no relaxamento e algumas opções envolvem nudez e toques íntimos.</p>
                </div>
              </div>
            </div>

            <button onClick={acceptTermsAndContinue} className="ios-button w-full py-4 text-lg">
              Tenho mais de 18 anos e Concordo
            </button>
          </div>
        )}

        {/* O FLUXO DE AGENDAMENTO (Steps 1 ao 5) */}
        <div className={step >= 1 && step < 5 ? "block" : "hidden"}>
          
          {/* STEP 1: CATEGORIAS E SERVIÇOS */}
          <div id="step-1" className="step-enter mb-12">
            <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">{T.step1Label}</p>
            <h1 className="text-3xl font-bold mb-6">{T.step1Title}</h1>
            
            <div className="flex bg-[#1c1c1e] p-1 rounded-[20px] mb-6 border border-white/5">
              <button onClick={() => { vibrate(10); setBookingMode('single'); }} 
                className={`flex-1 py-3 text-sm font-semibold rounded-2xl transition-all ${bookingMode === 'single' ? 'bg-[#2c2c2e] text-white shadow-sm' : 'text-[#86868b]'}`}>
                {T.tabSingle}
              </button>
              <button onClick={() => { vibrate(10); setBookingMode('combo'); }} 
                className={`flex-1 py-3 text-sm font-semibold rounded-2xl transition-all ${bookingMode === 'combo' ? 'bg-[#2c2c2e] text-white shadow-sm' : 'text-[#86868b]'}`}>
                {T.tabCombo}
              </button>
            </div>

            <div className="space-y-3">
              {activeList.map(m => {
                const active = mood.id === m.id;
                return (
                  <button key={m.id} onClick={() => { vibrate(15); setMoodId(m.id); }}
                    className={`w-full text-left p-5 transition-all duration-300 rounded-[24px] border ${active ? 'glass-panel border-white/30' : 'bg-[#1c1c1e] border-white/5'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <p className={`font-semibold ${active ? 'text-white' : 'text-[#d1d1d6]'}`}>{m.PT.title}</p>
                      <span className="text-sm font-semibold">{formatMoney(m.price)}</span>
                    </div>
                    <p className={`text-sm ${active ? 'text-[#e5e5ea]' : 'text-[#86868b]'}`}>{m.PT.subtitle}</p>
                    
                    {active && (
                      <div className="mt-4 pt-4 border-t border-white/10 step-enter">
                        <p className="text-sm text-[#d1d1d6] leading-relaxed">{m.PT.desc}</p>
                        <p className="text-xs text-[#86868b] mt-3">• Duração de até {m.min} min</p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {step === 1 && (
              <button onClick={() => { vibrate(20); setStep(2); }} className="ios-button mt-8 w-full py-4 text-lg">
                {T.btnContinue}
              </button>
            )}
          </div>

          {/* STEP 2: DADOS E LOCAL */}
          {step >= 2 && (
            <div id="step-2" className="step-enter mb-12 pt-8 border-t border-white/10">
              <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">{T.step2Label}</p>
              <h1 className="text-3xl font-bold mb-6">{T.step2Title}</h1>

              <div className="space-y-4">
                <input type="text" placeholder={T.namePlace} value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="ios-input" />

                <div className="pt-4 grid grid-cols-2 gap-3">
                  <button onClick={()=>setData({...data, locType:'studio'})} className={`py-4 text-sm font-semibold rounded-2xl transition-all border ${data.locType==='studio' ? 'glass-panel border-white/30 text-white' : 'bg-[#1c1c1e] border-white/5 text-[#86868b]'}`}>Suíte (Bela Vista)</button>
                  <button onClick={()=>setData({...data, locType:'home'})} className={`py-4 text-sm font-semibold rounded-2xl transition-all border ${data.locType==='home' ? 'glass-panel border-white/30 text-white' : 'bg-[#1c1c1e] border-white/5 text-[#86868b]'}`}>Vou até você</button>
                </div>

                {data.locType === 'studio' && <p className="text-sm text-[#86868b] bg-[#1c1c1e] p-4 rounded-2xl step-enter">{T.studioDesc}</p>}
                
                {data.locType === 'home' && (
                  <div className="space-y-3 step-enter">
                    <input type="tel" maxLength={9} placeholder={T.cep} value={data.cep} onChange={e=>handleCep(e.target.value)} className="ios-input" />
                    <input type="text" placeholder={T.street} value={data.street} onChange={e=>setData({...data, street: e.target.value})} className="ios-input" />
                    <div className="flex gap-3">
                      <input ref={numberInputRef} type="text" placeholder={T.number} value={data.number} onChange={e=>setData({...data, number: e.target.value})} className="ios-input w-1/3" />
                      <input type="text" placeholder={T.comp} value={data.comp} onChange={e=>setData({...data, comp: e.target.value})} className="ios-input w-2/3" />
                    </div>
                    <input type="text" placeholder={T.bairroPlace} value={data.bairro} onChange={e=>setData({...data, bairro: e.target.value})} className="ios-input" />
                  </div>
                )}
              </div>

              {step === 2 && (
                <button disabled={!isStep2Valid} onClick={() => { vibrate(20); setStep(3); }} className="ios-button mt-8 w-full py-4 text-lg disabled:opacity-30">
                  {T.btnNext}
                </button>
              )}
            </div>
          )}

          {/* STEP 3: DATA E HORA */}
          {step >= 3 && (
            <div id="step-3" className="step-enter mb-12 pt-8 border-t border-white/10">
              <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">{T.step3Label}</p>
              <h1 className="text-3xl font-bold mb-6">{T.step3Title}</h1>

              <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-2 mb-6">
                {days.map((d, i) => {
                  const sel = data.date?.toDateString() === d.toDateString();
                  const dayName = d.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3);
                  return (
                    <button key={i} onClick={() => setData({...data, date: d, time: ''})} className={`shrink-0 w-16 h-[88px] flex flex-col items-center justify-center rounded-[20px] transition-all border ${sel ? 'glass-panel border-white/30 text-white' : 'bg-[#1c1c1e] border-white/5 text-[#86868b]'}`}>
                      <span className="text-[11px] uppercase font-bold mb-1">{dayName}</span>
                      <span className="text-2xl font-semibold">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              {data.date && (
                <div className="grid grid-cols-3 gap-3 step-enter">
                  {getSlots().map(t => {
                    const sel = data.time === t;
                    return (
                      <button key={t} onClick={() => { vibrate(15); setData({...data, time: t}); if (step === 3) setStep(4); }} 
                        className={`py-4 text-sm font-semibold rounded-2xl transition-all border ${sel ? 'glass-panel border-white/30 text-white' : 'bg-[#1c1c1e] border-white/5 text-[#86868b]'}`}>
                        {t}
                      </button>
                    )
                  })}
                  {getSlots().length === 0 && <p className="col-span-3 text-sm text-[#86868b] text-center py-4 bg-[#1c1c1e] rounded-2xl">{T.noSlots}</p>}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: ACORDO */}
          {step >= 4 && (
            <div id="step-4" className="step-enter mb-8 pt-8 border-t border-white/10">
              <p className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-1">{T.step4Label}</p>
              <h1 className="text-3xl font-bold mb-6">{T.step4Title}</h1>

              <div className="space-y-6">
                
                {/* Cupons e Presentes */}
                <div className="bg-[#1c1c1e] border border-white/5 p-5 rounded-3xl space-y-4">
                  {!isReturningClient && !appliedCoupon && !giftApplied && (
                    <div className="bg-[#30d158]/10 p-4 rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="text-[#30d158] font-semibold text-sm">{T.giftTitle}</p>
                        <p className="text-[#30d158]/70 text-xs mt-1">R$ 15 OFF na primeira vez</p>
                      </div>
                      <button onClick={() => { vibrate(20); setGiftApplied(true); }} className="bg-[#30d158] text-black text-xs font-bold px-4 py-2 rounded-full active:scale-95">Usar</button>
                    </div>
                  )}
                  {giftApplied && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#30d158] font-semibold flex items-center gap-2"><Icon name="check" size={16}/> Presente Ativo</span>
                      <button onClick={() => setGiftApplied(false)} className="text-[#86868b] text-xs underline">Remover</button>
                    </div>
                  )}

                  {!giftApplied && (
                    <div className="flex gap-2">
                      <input type="text" placeholder={T.couponPlace} value={couponInput} onChange={e => setCouponInput(e.target.value)} disabled={!!appliedCoupon}
                        className="bg-[#2c2c2e] text-white border-none rounded-xl px-4 py-3 w-full text-sm outline-none uppercase disabled:opacity-50" />
                      {!appliedCoupon ? (
                        <button onClick={handleApplyCoupon} className="bg-white/10 text-white font-semibold text-sm px-5 rounded-xl active:scale-95">Aplicar</button>
                      ) : (
                        <button onClick={() => { setAppliedCoupon(''); setCouponInput(''); }} className="bg-red-500/20 text-red-400 font-semibold text-sm px-5 rounded-xl active:scale-95">Tirar</button>
                      )}
                    </div>
                  )}
                  {appliedCoupon && <p className="text-xs text-[#30d158]">Cupom {appliedCoupon} aplicado.</p>}
                </div>

                {/* Extras */}
                <div>
                  <p className="text-sm font-semibold text-white mb-3">{T.addons}</p>
                  <div className="space-y-2">
                    {visibleExtras.map(ex => {
                      const sel = data.extras[ex.id];
                      return (
                        <button key={ex.id} onClick={()=>setData({...data, extras:{...data.extras, [ex.id]:!sel}})} 
                          className={`w-full flex justify-between p-4 rounded-2xl text-sm transition-all border ${sel ? 'glass-panel border-white/30 text-white' : 'bg-[#1c1c1e] border-white/5 text-[#86868b]'}`}>
                          <span>{ex.PT.label}</span>
                          <span className="font-semibold">+{formatMoney(ex.price)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Pedido Especial */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-sm font-semibold text-white">{T.reqLabel}</p>
                    <span className="text-xs text-[#86868b]">+ R$ 130</span>
                  </div>
                  <input type="text" placeholder={T.reqPlace} value={data.req} onChange={e=>setData({...data, req:e.target.value})} className="ios-input" />
                  <p className="text-xs text-[#86868b] mt-2">{T.reqDesc}</p>
                </div>

                {/* Pagamento */}
                <div>
                  <p className="text-sm font-semibold text-white mb-3">{T.payLabel}</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[{id:'pix', l:T.payPix},{id:'card', l:T.payCard},{id:'cash', l:T.payCash}].map(p => (
                      <button key={p.id} onClick={()=>setData({...data, payment:p.id})} 
                        className={`py-3 text-xs font-semibold rounded-xl border transition-all ${data.payment === p.id ? 'glass-panel border-white/30 text-white' : 'bg-[#1c1c1e] border-white/5 text-[#86868b]'}`}>
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resumo Final */}
                <div className="pt-6 border-t border-white/10">
                  <div className="space-y-2 text-sm text-[#86868b]">
                    <div className="flex justify-between"><span>{T.subBase}</span><span>{formatMoney(fin.basePrice)}</span></div>
                    {fin.extrasTotal > 0 && <div className="flex justify-between"><span>{T.subExtras}</span><span>+{formatMoney(fin.extrasTotal)}</span></div>}
                    {fin.reqFee > 0 && <div className="flex justify-between"><span>{T.subReq}</span><span>+{formatMoney(fin.reqFee)}</span></div>}
                    {fin.discountGift > 0 && <div className="flex justify-between text-[#30d158]"><span>{T.subGift}</span><span>-{formatMoney(fin.discountGift)}</span></div>}
                    {fin.couponDiscount > 0 && <div className="flex justify-between text-[#30d158]"><span>{T.subCoupon}</span><span>-{formatMoney(fin.couponDiscount)}</span></div>}
                    {fin.peakFee > 0 && <div className="flex justify-between"><span>{T.subPeak}</span><span>+{formatMoney(fin.peakFee)}</span></div>}
                    {fin.pixDiscount > 0 && <div className="flex justify-between text-[#30d158]"><span>{T.subPix}</span><span>-{formatMoney(fin.pixDiscount)}</span></div>}
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 mb-8">
                    <span className="text-lg font-semibold">{T.total}</span>
                    <span className="text-3xl font-bold">{formatMoney(fin.total)}</span>
                  </div>

                  <button disabled={!data.payment} onClick={finishFlow} className="ios-button w-full py-4 text-lg disabled:opacity-30">
                    {T.btnFinish}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 5: FINALIZADO */}
        {step === 5 && (
          <div className="step-enter pt-16 text-center">
            <h1 className="text-3xl font-bold mb-4">{T.step5Title}</h1>
            <p className="text-[#86868b] text-base leading-relaxed mb-8">{T.step5Desc}</p>
            
            <div className="glass-panel p-5 rounded-3xl mb-8 text-left flex items-start gap-3">
              <Icon name="ticket" className="text-[#30d158] mt-0.5" size={20} />
              <div>
                <p className="text-white font-semibold text-sm mb-1">Guarde seu cupom</p>
                <p className="text-[#86868b] text-sm">Use o código <strong className="text-white">SESSAO2</strong> no site para garantir 8% de desconto na sua próxima visita.</p>
              </div>
            </div>

            <a href={wppLink} className="ios-button flex items-center justify-center py-4 text-lg no-underline w-full mb-4">
              {T.btnSend}
            </a>

            <button onClick={resetFlow} className="text-[#86868b] font-semibold text-sm py-4 active:scale-95">
              {T.btnBack}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
