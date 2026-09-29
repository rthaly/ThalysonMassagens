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
// DICIONÁRIO E TEXTOS (AIDA, Simples e Tangível)
// ==================================================================================
const TEXTS = {
  PT: {
    step1Label: "Passo 01",
    step1Title: "O que o seu corpo precisa hoje?",
    tabSingle: "Só Hoje",
    tabEstetica: "Estética",
    tabCombo: "Ciclos",
    btnContinue: "Escolher essa e continuar",
    step2Label: "Passo 02",
    step2Title: "Para onde eu vou?",
    namePlace: "Seu nome ou apelido",
    locLabel: "Onde vamos fazer a sessão?",
    locStudio: "Na sua Suíte (Bela Vista)",
    locHome: "No meu espaço (Você vem)",
    studioDesc: "Eu atendo sozinho em uma suíte privativa e discreta na Bela Vista. Assim que a gente confirmar o horário, eu te mando o endereço certinho e as instruções no WhatsApp.",
    cep: "CEP (opcional)",
    street: "Rua ou Avenida",
    number: "Número",
    comp: "Apto / Quarto (opcional)",
    bairroPlace: "Bairro",
    btnNext: "Avançar para Horários",
    step3Label: "Passo 03",
    step3Title: "Qual horário fica melhor?",
    noSlots: "Sem horários livres hoje.",
    step4Label: "Passo 04",
    step4Title: "Resumo e Acerto",
    giftTitle: "Presente de Primeira Vez",
    giftDesc: "Como é o nosso primeiro encontro, deixei um desconto separado para você usar agora.",
    giftBtn: "Usar desconto de R$ 15",
    giftActive: "Desconto de 1ª vez ativado",
    couponLabel: "Você tem algum cupom?",
    couponPlace: "Código do cupom",
    couponBtn: "Aplicar",
    couponActive: "aplicado com sucesso",
    btnRemove: "Tirar",
    addons: "Quer adicionar algo hoje?",
    reqLabel: "Tem algum pedido especial?",
    reqPlace: "Fetiche, vontade, ideia...",
    reqDesc: "A gente avalia na hora se dá para fazer. Se não rolar, eu não te cobro esse valor extra.",
    payLabel: "Como prefere pagar na hora?",
    payPix: "Pix (3% de desconto)",
    payCard: "Cartão",
    payCash: "Dinheiro",
    subBase: "Sessão",
    subExtras: "Adicionais",
    subReq: "Pedido Especial",
    subGift: "Cortesia",
    subCoupon: "Cupom",
    subPeak: "Deslocamento",
    subPix: "Desconto Pix",
    total: "Valor Final",
    btnFinish: "Confirmar Agendamento",
    step5Title: "Tudo certo",
    step5Desc: "O seu pedido já foi montado. Agora é só me mandar a mensagem no WhatsApp para eu confirmar na agenda.",
    btnSend: "Abrir o WhatsApp",
    btnBack: "Voltar para o começo",
  }
};

const MOODS = [
  {
    id: 'classica', color: '#334155', accent: '#f8fafc', price: 180, min: 60, isCombo: false,
    PT: { 
      title: 'Massagem Clássica', 
      subtitle: 'Tira o peso e solta a musculatura.', 
      service: 'Massagem Clássica', 
      desc: 'Sabe aquele peso nos ombros e a nuca travada? A clássica resolve. Eu uso pressão firme com as mãos para desmanchar cada nó de tensão. Não tem toque íntimo. Você chega travado e sai leve.' 
    }
  },
  {
    id: 'naturista', color: '#0f766e', accent: '#ccfbf1', price: 240, min: 60, isCombo: false,
    PT: { 
      title: 'Clássica Naturista', 
      subtitle: 'Sem roupas, sem amarras.', 
      service: 'Massagem Naturista', 
      desc: 'O mesmo alívio muscular da massagem clássica, mas nós dois ficamos totalmente sem roupa. O corpo respira e as mãos deslizam bem melhor. Não rola toque íntimo, é puramente a liberdade e o respeito do naturismo.' 
    }
  },
  {
    id: 'sensitiva', color: '#b45309', accent: '#fef3c7', price: 200, min: 60, isCombo: false,
    PT: { 
      title: 'Sensorial (Tântrica)', 
      subtitle: 'Começa relaxando, termina aliviando.', 
      service: 'Sensitiva / Tântrica', 
      desc: 'A gente começa pelas costas para tirar sua tensão. Quando seu corpo solta, o toque muda. Fica mais leve, sentindo mais a pele, e evolui aos poucos até a técnica íntima final para você gozar.' 
    }
  },
  {
    id: 'fusion', color: '#9f1239', accent: '#ffe4e6', price: 250, min: 60, isCombo: false,
    PT: { 
      title: 'Experiência Fusion', 
      subtitle: 'Corpo a corpo e calor.', 
      service: 'Experiência Fusion', 
      desc: 'O contato fica muito mais perto. Eu fico só de cueca e a gente tem muito atrito de pele. O toque da minha barba ajuda a arrepiar o corpo todo, e a gente termina com uma finalização bem demorada.' 
    }
  },
  {
    id: 'nuru', color: '#1e3a8a', accent: '#dbeafe', price: 350, min: 60, isCombo: false,
    PT: { 
      title: 'Massagem Nuru', 
      subtitle: 'Muito gel e imersão total.', 
      service: 'Massagem Nuru', 
      desc: 'A gente tira tudo. Eu uso muito gel para escorregar sem esforço. É o meu corpo colado no seu, pele na pele, deslizando devagar até você chegar no limite do prazer.' 
    }
  },
  {
    id: 'reversa', color: '#166534', accent: '#dcfce3', price: 400, min: 60, isCombo: false,
    PT: { 
      title: 'Massagem Reversa', 
      subtitle: 'Você no controle de tudo.', 
      service: 'Massagem Reversa', 
      desc: 'Eu começo relaxando o seu corpo, mas logo você assume o comando. Você tem a liberdade de tocar, explorar e ditar o ritmo no meu corpo até nós dois gozarmos juntos.' 
    }
  }
];

const ESTETICA = [
  {
    id: 'depilacao_solo', color: '#374151', accent: '#e5e7eb', price: 107, min: 40, isCombo: false,
    PT: { 
      title: 'Limpeza e Cuidado', 
      subtitle: 'Máquina e hidratação na pele.', 
      service: 'Estética Corporal', 
      desc: 'Aparo de pelos no corpo usando máquina com os pentes 0 ou 3. Você escolhe até 3 áreas para limpar. Fechamos passando um creme para acalmar a pele recém-aparada.' 
    }
  }
];

const COMBOS = [
  {
    id: 'combo_depil_classica', color: '#111827', accent: '#ffffff', price: 270, min: 100, isCombo: true,
    PT: { 
      title: 'Renovação Completa', 
      subtitle: 'Aparo na máquina + Massagem Clássica.', 
      service: '1 Encontro Duplo', 
      desc: 'Limpamos até 3 áreas do seu corpo na máquina e já emendamos com a Massagem Clássica pesada para soltar toda a sua musculatura de uma vez só.' 
    }
  },
  {
    id: 'combo_tantrica_2', color: '#4c1d95', accent: '#ede9fe', price: 590, min: 60, isCombo: true,
    PT: { 
      title: 'Intensidade Extrema', 
      subtitle: 'Uma sessão Nuru e uma Reversa.', 
      service: '2 Encontros', 
      desc: 'Você marca dois dias diferentes no mês. Um dia fazemos a Nuru com gel, no outro você assume o controle na Reversa. As duas começam relaxando o corpo primeiro.' 
    }
  }
];

const EXTRAS = [
  { id: 'aroma', price: 20, PT: { label: 'Óleos de essência relaxantes' } },
  { id: 'time', price: 75, PT: { label: 'Adicionar mais 30 minutos' } },
  { id: 'depilacao_extra', price: 107, PT: { label: 'Aparo com máquina (3 lugares)' } }
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
// ESTILOS UX/UI PREMIUM
// ==================================================================================
const PremiumStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    :root {
      --bg-base: #09090b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #ffffff;
    }

    *, *::before, *::after { 
      box-sizing: border-box; 
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif; 
    }
    
    body, html { 
      background-color: var(--bg-base); 
      color: var(--text-main); 
      margin: 0; padding: 0;
      -webkit-tap-highlight-color: transparent;
      overscroll-behavior-y: none;
      scroll-behavior: smooth;
    }

    /* Fundo com orbes para realçar o efeito de vidro */
    .bg-orbs {
      position: fixed; inset: 0; z-index: 0; overflow: hidden;
      background: var(--bg-base);
    }
    .orb-1, .orb-2 {
      position: absolute; border-radius: 50%; filter: blur(100px);
      transition: all 1.5s cubic-bezier(0.25, 1, 0.5, 1);
      opacity: 0.4;
    }
    .orb-1 { top: -10%; left: -20%; width: 70vw; height: 70vw; }
    .orb-2 { bottom: -10%; right: -20%; width: 80vw; height: 80vw; }

    /* Efeito de Vidro Refinado */
    .glass-panel {
      background: rgba(25, 25, 28, 0.35);
      backdrop-filter: blur(32px);
      -webkit-backdrop-filter: blur(32px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      border-radius: 24px;
    }

    .glass-input {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-main);
      border-radius: 16px;
      padding: 18px 20px;
      width: 100%;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.3s ease;
      outline: none;
    }
    .glass-input:focus {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.25);
    }
    .glass-input::placeholder { color: var(--text-muted); font-weight: 400; }

    .primary-btn {
      background: var(--accent);
      color: #000;
      border-radius: 20px;
      font-weight: 700;
      letter-spacing: -0.01em;
      transition: transform 0.2s, opacity 0.2s, background-color 0.2s;
      cursor: pointer;
    }
    .primary-btn:active { transform: scale(0.97); opacity: 0.9; }

    .step-enter { animation: fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes fadeSlideUp {
      0% { opacity: 0; transform: translateY(24px); }
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
    const hasOnboarded = localStorage.getItem('thaly_onboard_v28');
    const hasBookedBefore = localStorage.getItem('thaly_returning_v28');
    
    if (hasOnboarded === 'yes') setStep(1);
    if (hasBookedBefore === 'yes') setIsReturningClient(true);
    
    setMoodId(activeList[0].id);
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

  const mood = useMemo(() => activeList.find(m => m.id === moodId) || activeList[0], [moodId, activeList]);

  const acceptTermsAndContinue = () => {
    vibrate(30);
    localStorage.setItem('thaly_onboard_v28', 'yes');
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
    const hasOnboarded = localStorage.getItem('thaly_onboard_v28');
    const hasBookedBefore = localStorage.getItem('thaly_returning_v28');
    
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
      `Sua Suíte (Bela Vista)` : 
      `${data.street}, ${data.number}${data.comp ? ', ' + data.comp : ''} - ${data.bairro}`;

    let text = `Oi Thalyson, fechei pelo site e vim confirmar meu horário.\n\n`;
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
    text += `\nAguardo você me confirmar o endereço!`;
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
  }, [data, mood, fin, appliedCoupon]);

  const finishFlow = () => {
    vibrate([30,50]);
    localStorage.setItem('thaly_returning_v28', 'yes');
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
      <PremiumStyles />
      
      {/* Background com orbes para o efeito de vidro funcionar bem */}
      <div className="bg-orbs">
        <div className="orb-1" style={{ backgroundColor: step === 0 ? '#1f2937' : mood.color }} />
        <div className="orb-2" style={{ backgroundColor: step === 0 ? '#0f172a' : mood.color, opacity: 0.2 }} />
      </div>

      <div className="relative z-10 px-5 pt-8 max-w-md mx-auto">
        
        {/* CABEÇALHO */}
        {step > 0 && (
          <header className="flex justify-between items-center mb-10 step-enter">
            <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-4 active:scale-95 transition-transform">
              <img src="FmtU3Ogx_400x400.jpg" alt="Thalyson" className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-lg" />
              <div className="text-left">
                <p className="text-[15px] font-bold text-white tracking-tight">Thalyson Massagens</p>
                <p className="text-[13px] text-white/60 font-medium">Bela Vista, SP</p>
              </div>
            </button>
          </header>
        )}

        {/* MODAL DO PERFIL */}
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setIsProfileOpen(false)}>
            <div className="glass-panel w-full sm:max-w-sm m-3 sm:m-0 p-8 relative step-enter" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsProfileOpen(false)} className="absolute top-5 right-5 p-2 bg-white/10 rounded-full active:scale-90 transition-transform">
                <Icon name="close" size={20} className="text-white" />
              </button>
              
              <img src="FmtU3Ogx_400x400.jpg" className="w-20 h-20 rounded-full object-cover mb-5 border border-white/20 shadow-xl" alt="Thalyson" />
              <h2 className="text-2xl font-bold tracking-tight mb-1 text-white">Thalyson</h2>
              <p className="text-white/60 text-sm font-medium mb-6">30 anos • Atendimento individual</p>
              
              <div className="space-y-4 text-[15px] text-white/90 leading-relaxed font-medium">
                <p>Eu atendo de forma simples e discreta aqui na Bela Vista.</p>
                <p>O foco do meu trabalho é usar o toque para tirar o peso e o cansaço do seu dia a dia. Você só precisa chegar, deitar e deixar o corpo aproveitar.</p>
              </div>
              
              <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="mt-8 flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl text-[15px] font-bold active:scale-95 transition-transform">
                <Icon name="instagram" size={18} /> Ver no Instagram
              </a>
            </div>
          </div>
        )}

        {/* STEP 0: BOAS-VINDAS E TERMOS */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center step-enter pt-12 pb-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto rounded-2xl glass-panel flex items-center justify-center mb-6 shadow-xl">
                <Icon name="lock" size={28} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-3 text-white">Antes de começar</h1>
              <p className="text-white/60 text-[15px] px-2 font-medium">Por favor, leia os avisos abaixo antes de seguir para a agenda.</p>
            </div>

            <div className="space-y-4 mb-10">
              <div className="glass-panel p-6 flex gap-5 items-start">
                <div className="mt-0.5"><Icon name="shield" size={24} className="text-white/80"/></div>
                <div>
                  <h3 className="font-bold text-white text-[16px] mb-2 tracking-tight">Privacidade Garantida</h3>
                  <p className="text-white/60 text-[14px] leading-relaxed font-medium">Nada que você digita aqui fica salvo. Suas escolhas vão direto para o meu WhatsApp de forma segura.</p>
                </div>
              </div>
              
              <div className="glass-panel p-6 flex gap-5 items-start">
                <div className="mt-0.5"><Icon name="user" size={24} className="text-white/80"/></div>
                <div>
                  <h3 className="font-bold text-white text-[16px] mb-2 tracking-tight">Ambiente Reservado</h3>
                  <p className="text-white/60 text-[14px] leading-relaxed font-medium">O atendimento é individual. Algumas massagens envolvem nudez total e toque íntimo. Você precisa ser maior de 18 anos.</p>
                </div>
              </div>
            </div>

            <button onClick={acceptTermsAndContinue} className="primary-btn w-full py-5 text-[16px]">
              Sou maior de 18 anos e Concordo
            </button>
          </div>
        )}

        {/* FLUXO PRINCIPAL */}
        <div className={step >= 1 && step < 5 ? "block" : "hidden"}>
          
          {/* STEP 1: CATEGORIAS E SERVIÇOS */}
          <div id="step-1" className="step-enter mb-14">
            <p className="text-[13px] font-bold text-white/50 uppercase tracking-widest mb-2">{T.step1Label}</p>
            <h1 className="text-3xl font-bold tracking-tight mb-8 text-white">{T.step1Title}</h1>
            
            <div className="flex glass-panel p-1.5 mb-8">
              <button onClick={() => { vibrate(10); setBookingMode('single'); }} 
                className={`flex-1 py-3 text-[14px] font-bold rounded-[18px] transition-all ${bookingMode === 'single' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40'}`}>
                {T.tabSingle}
              </button>
              <button onClick={() => { vibrate(10); setBookingMode('combo'); }} 
                className={`flex-1 py-3 text-[14px] font-bold rounded-[18px] transition-all ${bookingMode === 'combo' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40'}`}>
                {T.tabCombo}
              </button>
            </div>

            <div className="space-y-4">
              {activeList.map(m => {
                const active = mood.id === m.id;
                return (
                  <button key={m.id} onClick={() => { vibrate(15); setMoodId(m.id); }}
                    className={`w-full text-left p-6 transition-all duration-300 rounded-[24px] border ${active ? 'glass-panel border-white/20 shadow-2xl' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <p className={`text-[17px] font-bold tracking-tight ${active ? 'text-white' : 'text-white/80'}`}>{m.PT.title}</p>
                      <span className={`text-[15px] font-bold ${active ? 'text-white' : 'text-white/60'}`}>{formatMoney(m.price)}</span>
                    </div>
                    <p className={`text-[14px] font-medium ${active ? 'text-white/80' : 'text-white/50'}`}>{m.PT.subtitle}</p>
                    
                    {active && (
                      <div className="mt-5 pt-5 border-t border-white/10 step-enter">
                        <p className="text-[15px] text-white/90 leading-relaxed font-medium">{m.PT.desc}</p>
                        <p className="text-[13px] font-bold text-white/40 mt-4 uppercase tracking-wider">Até {m.min} minutos</p>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {step === 1 && (
              <button onClick={() => { vibrate(20); setStep(2); }} className="primary-btn mt-10 w-full py-5 text-[16px]">
                {T.btnContinue}
              </button>
            )}
          </div>

          {/* STEP 2: DADOS E LOCAL */}
          {step >= 2 && (
            <div id="step-2" className="step-enter mb-14 pt-10 border-t border-white/10">
              <p className="text-[13px] font-bold text-white/50 uppercase tracking-widest mb-2">{T.step2Label}</p>
              <h1 className="text-3xl font-bold tracking-tight mb-8 text-white">{T.step2Title}</h1>

              <div className="space-y-5">
                <input type="text" placeholder={T.namePlace} value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="glass-input" />

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <button onClick={()=>setData({...data, locType:'studio'})} className={`py-4 text-[15px] font-bold rounded-[20px] transition-all border ${data.locType==='studio' ? 'glass-panel border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/50'}`}>Minha Suíte</button>
                  <button onClick={()=>setData({...data, locType:'home'})} className={`py-4 text-[15px] font-bold rounded-[20px] transition-all border ${data.locType==='home' ? 'glass-panel border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/50'}`}>Vou até você</button>
                </div>

                {data.locType === 'studio' && <p className="text-[14px] text-white/70 glass-panel p-5 font-medium leading-relaxed step-enter">{T.studioDesc}</p>}
                
                {data.locType === 'home' && (
                  <div className="space-y-4 step-enter">
                    <input type="tel" maxLength={9} placeholder={T.cep} value={data.cep} onChange={e=>handleCep(e.target.value)} className="glass-input" />
                    <input type="text" placeholder={T.street} value={data.street} onChange={e=>setData({...data, street: e.target.value})} className="glass-input" />
                    <div className="flex gap-4">
                      <input ref={numberInputRef} type="text" placeholder={T.number} value={data.number} onChange={e=>setData({...data, number: e.target.value})} className="glass-input w-1/3" />
                      <input type="text" placeholder={T.comp} value={data.comp} onChange={e=>setData({...data, comp: e.target.value})} className="glass-input w-2/3" />
                    </div>
                    <input type="text" placeholder={T.bairroPlace} value={data.bairro} onChange={e=>setData({...data, bairro: e.target.value})} className="glass-input" />
                  </div>
                )}
              </div>

              {step === 2 && (
                <button disabled={!isStep2Valid} onClick={() => { vibrate(20); setStep(3); }} className="primary-btn mt-10 w-full py-5 text-[16px] disabled:opacity-20 disabled:cursor-not-allowed">
                  {T.btnNext}
                </button>
              )}
            </div>
          )}

          {/* STEP 3: DATA E HORA */}
          {step >= 3 && (
            <div id="step-3" className="step-enter mb-14 pt-10 border-t border-white/10">
              <p className="text-[13px] font-bold text-white/50 uppercase tracking-widest mb-2">{T.step3Label}</p>
              <h1 className="text-3xl font-bold tracking-tight mb-8 text-white">{T.step3Title}</h1>

              <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-5 px-5 pb-4 mb-6">
                {days.map((d, i) => {
                  const sel = data.date?.toDateString() === d.toDateString();
                  const dayName = d.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3);
                  return (
                    <button key={i} onClick={() => setData({...data, date: d, time: ''})} className={`shrink-0 w-[72px] h-[96px] flex flex-col items-center justify-center rounded-[24px] transition-all border ${sel ? 'glass-panel border-white/20 text-white shadow-xl' : 'bg-white/5 border-white/5 text-white/40'}`}>
                      <span className="text-[12px] uppercase font-bold tracking-widest mb-1.5">{dayName}</span>
                      <span className="text-[26px] font-bold">{d.getDate()}</span>
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
                        className={`py-4 text-[15px] font-bold rounded-[20px] transition-all border ${sel ? 'glass-panel border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}>
                        {t}
                      </button>
                    )
                  })}
                  {getSlots().length === 0 && <p className="col-span-3 text-[14px] font-medium text-white/50 text-center py-5 glass-panel">{T.noSlots}</p>}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: ACORDO */}
          {step >= 4 && (
            <div id="step-4" className="step-enter mb-10 pt-10 border-t border-white/10">
              <p className="text-[13px] font-bold text-white/50 uppercase tracking-widest mb-2">{T.step4Label}</p>
              <h1 className="text-3xl font-bold tracking-tight mb-8 text-white">{T.step4Title}</h1>

              <div className="space-y-8">
                
                {/* Cupons e Presentes */}
                <div className="glass-panel p-6 space-y-5">
                  {!isReturningClient && !appliedCoupon && !giftApplied && (
                    <div className="bg-white/5 border border-white/10 p-5 rounded-[20px] flex justify-between items-center">
                      <div>
                        <p className="text-white font-bold text-[15px]">{T.giftTitle}</p>
                        <p className="text-white/60 font-medium text-[13px] mt-1">R$ 15 OFF agora</p>
                      </div>
                      <button onClick={() => { vibrate(20); setGiftApplied(true); }} className="bg-white text-black text-[13px] font-bold px-5 py-2.5 rounded-full active:scale-95 transition-transform">Pegar</button>
                    </div>
                  )}
                  {giftApplied && (
                    <div className="flex justify-between items-center text-[14px] bg-white/10 p-4 rounded-[16px]">
                      <span className="text-white font-bold flex items-center gap-2"><Icon name="check" size={18}/> Presente aplicado</span>
                      <button onClick={() => setGiftApplied(false)} className="text-white/50 font-medium underline">Remover</button>
                    </div>
                  )}

                  {!giftApplied && (
                    <div className="flex gap-3">
                      <input type="text" placeholder={T.couponPlace} value={couponInput} onChange={e => setCouponInput(e.target.value)} disabled={!!appliedCoupon}
                        className="glass-input uppercase disabled:opacity-40" />
                      {!appliedCoupon ? (
                        <button onClick={handleApplyCoupon} className="bg-white/10 text-white font-bold text-[14px] px-6 rounded-[16px] active:scale-95 transition-transform">Aplicar</button>
                      ) : (
                        <button onClick={() => { setAppliedCoupon(''); setCouponInput(''); }} className="bg-white/10 text-white font-bold text-[14px] px-6 rounded-[16px] active:scale-95 transition-transform">Tirar</button>
                      )}
                    </div>
                  )}
                  {appliedCoupon && <p className="text-[14px] font-medium text-white px-2">Cupom <strong className="text-white">{appliedCoupon}</strong> funcionando.</p>}
                </div>

                {/* Extras */}
                <div>
                  <p className="text-[16px] font-bold text-white mb-4 tracking-tight">{T.addons}</p>
                  <div className="space-y-3">
                    {visibleExtras.map(ex => {
                      const sel = data.extras[ex.id];
                      return (
                        <button key={ex.id} onClick={()=>setData({...data, extras:{...data.extras, [ex.id]:!sel}})} 
                          className={`w-full flex justify-between p-5 rounded-[20px] text-[15px] font-medium transition-all border ${sel ? 'glass-panel border-white/20 text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/60'}`}>
                          <span>{ex.PT.label}</span>
                          <span className="font-bold">+{formatMoney(ex.price)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Pedido Especial */}
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <p className="text-[16px] font-bold text-white tracking-tight">{T.reqLabel}</p>
                    <span className="text-[13px] font-bold text-white/50">+ R$ 130</span>
                  </div>
                  <input type="text" placeholder={T.reqPlace} value={data.req} onChange={e=>setData({...data, req:e.target.value})} className="glass-input" />
                  <p className="text-[13px] font-medium text-white/50 mt-3 leading-relaxed px-1">{T.reqDesc}</p>
                </div>

                {/* Pagamento */}
                <div>
                  <p className="text-[16px] font-bold text-white mb-4 tracking-tight">{T.payLabel}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[{id:'pix', l:T.payPix},{id:'card', l:T.payCard},{id:'cash', l:T.payCash}].map(p => (
                      <button key={p.id} onClick={()=>setData({...data, payment:p.id})} 
                        className={`py-4 px-2 text-[13px] font-bold rounded-[16px] border transition-all ${data.payment === p.id ? 'glass-panel border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/50'}`}>
                        {p.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resumo Final */}
                <div className="pt-8 border-t border-white/10">
                  <div className="space-y-3 text-[15px] font-medium text-white/60">
                    <div className="flex justify-between"><span>{T.subBase}</span><span>{formatMoney(fin.basePrice)}</span></div>
                    {fin.extrasTotal > 0 && <div className="flex justify-between"><span>{T.subExtras}</span><span>+{formatMoney(fin.extrasTotal)}</span></div>}
                    {fin.reqFee > 0 && <div className="flex justify-between"><span>{T.subReq}</span><span>+{formatMoney(fin.reqFee)}</span></div>}
                    {fin.discountGift > 0 && <div className="flex justify-between text-white"><span>{T.subGift}</span><span>-{formatMoney(fin.discountGift)}</span></div>}
                    {fin.couponDiscount > 0 && <div className="flex justify-between text-white"><span>{T.subCoupon}</span><span>-{formatMoney(fin.couponDiscount)}</span></div>}
                    {fin.peakFee > 0 && <div className="flex justify-between"><span>{T.subPeak}</span><span>+{formatMoney(fin.peakFee)}</span></div>}
                    {fin.pixDiscount > 0 && <div className="flex justify-between text-white"><span>{T.subPix}</span><span>-{formatMoney(fin.pixDiscount)}</span></div>}
                  </div>
                  
                  <div className="flex justify-between items-center mt-8 mb-10">
                    <span className="text-[18px] font-bold tracking-tight text-white">{T.total}</span>
                    <span className="text-[36px] font-bold tracking-tight text-white">{formatMoney(fin.total)}</span>
                  </div>

                  <button disabled={!data.payment} onClick={finishFlow} className="primary-btn w-full py-5 text-[17px] disabled:opacity-20 disabled:cursor-not-allowed shadow-2xl">
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
            <h1 className="text-4xl font-bold tracking-tight mb-5 text-white">{T.step5Title}</h1>
            <p className="text-white/70 text-[16px] font-medium leading-relaxed mb-10 px-4">{T.step5Desc}</p>
            
            <div className="glass-panel p-6 rounded-[24px] mb-10 text-left flex items-start gap-4">
              <div className="mt-1"><Icon name="ticket" className="text-white" size={24} /></div>
              <div>
                <p className="text-white font-bold text-[16px] mb-2 tracking-tight">Um presente para a volta</p>
                <p className="text-white/60 font-medium text-[14px] leading-relaxed">Guarde o código <strong className="text-white">SESSAO2</strong>. Na sua próxima vez aqui no site, ele te dá 8% de desconto.</p>
              </div>
            </div>

            <a href={wppLink} className="primary-btn flex items-center justify-center py-5 text-[17px] no-underline w-full mb-6 shadow-2xl">
              {T.btnSend}
            </a>

            <button onClick={resetFlow} className="text-white/50 font-bold text-[14px] py-4 active:scale-95 transition-transform">
              {T.btnBack}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
