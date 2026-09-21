import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

// ==================================================================================
// CONFIGURAÇÕES E TIPAGENS
// ==================================================================================
const CONFIG = {
  BUSINESS_NAME: "Thalyson Massagens",
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://www.instagram.com/relaxarhojesp",
  ADDRESS_AREA: "Bela Vista, São Paulo",
  START_HOUR: 9,
  END_HOUR: 22,
};

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const PEAK_FEE = 15;

interface Service {
  id: string;
  min: number;
  price: number;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  details?: string[];
  fullPrice?: number;
  popular?: boolean;
}

interface BookingState {
  cart: Service[];
  extras: Record<string, boolean>;
  locationType: string;
  name: string;
  age: string;
  specialRequest: string;
  payment: string;
  discount: number;
  address: { cep: string; street: string; number: string; district: string; city: string; comp: string; placeName: string; };
  date: Date | null;
  time: string;
  manualCoupon: string;
  manualCouponValue: number;
  finished: boolean;
}

const ICON_PATHS: Record<string, string> = {
  'check': 'M20 6L9 17l-5-5',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'hand': 'M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0 M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2 M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8 M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-1-6-3l-3.5-5.5a1.5 1.5 0 0 1 2.5-1.7L7 15',
  'droplet': 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z',
  'flame': 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'arrow-down': 'M12 5v14 M19 12l-7 7-7-7',
  'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'calendar': 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
};

// ==================================================================================
// ESTILOS GLOBAIS — Tema Mineral Premium
// ==================================================================================
const GlobalStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

    :root {
      --font-display: 'Fraunces', serif;
      --font-body: 'Work Sans', sans-serif;
      --c-bg: #1B1815;
      --c-surface: #242019;
      --c-surface-2: #2C2721;
      --c-line: rgba(242,236,225,0.09);
      --c-text: #F2ECE1;
      --c-text-muted: #A79E8E;
      --c-sage: #8FA888;
      --c-sage-deep: #6E8768;
      --c-clay: #C79A62;
    }

    html, body {
      background-color: var(--c-bg); color: var(--c-text); font-family: var(--font-body);
      overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; scroll-behavior: smooth;
    }

    .font-display { font-family: var(--font-display); font-optical-sizing: auto; }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { transform: scale(0.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes ripple { 0%, 100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.15); opacity: 0.15; } }
    @keyframes pageLoad { 0% { opacity: 0; filter: blur(8px); transform: translateY(20px); } 100% { opacity: 1; filter: blur(0); transform: translateY(0); } }

    .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-ripple { animation: ripple 3s infinite ease-in-out; }
    .animate-page-load { animation: pageLoad 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

    .panel { background: var(--c-surface); border: 1px solid var(--c-line); }
    .panel-soft { background: rgba(36,32,25,0.6); backdrop-filter: blur(14px); border: 1px solid var(--c-line); }

    .field {
      background: rgba(242,236,225,0.04); border: 1px solid rgba(242,236,225,0.12); color: var(--c-text); transition: all 0.2s;
    }
    .field:focus { border-color: var(--c-sage); background: rgba(242,236,225,0.06); outline: none; }
    .field:disabled { opacity: 0.5; cursor: not-allowed; }
  `}} />
));

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICON_PATHS[name] || ''} /></svg>
));

const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 40) => { try { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

// ==================================================================================
// DADOS DOS SERVIÇOS (Foco em clareza, Lingam explícito e semiótica premium)
// ==================================================================================
const DATA = {
  services: [
    { 
      id: 'depilacao', min: 40, price: 107, icon: "scissors", tag: "Estética", title: "Aparo de Pelos", 
      desc: "Higiene e estética corporal.",
      details: ["Aparo feito com máquina (pentes 0 e 3)", "Deixa o corpo limpo e preparado para a sessão."]
    },
    { 
      id: 'relaxante', min: 60, price: 180, icon: "droplet", tag: "Alívio Muscular", title: "Massagem Clássica", 
      desc: "Corpo todo, focada em desfazer nós e dores.",
      details: ["Pressão firme nas costas, braços e pernas", "Foco em tirar tensões do dia a dia", "Sessão estritamente terapêutica."]
    },
    { 
      id: 'sensitiva', min: 60, price: 200, icon: "hand", tag: "Despertar", title: "Massagem Sensitiva", 
      desc: "Inicia relaxante e termina com foco íntimo.",
      details: ["Trabalho corporal profundo para tirar a tensão", "Toques sutis despertando a sensibilidade da pele", "Inclui técnica Lingam (toques e massagem na região íntima) para máximo alívio."]
    },
    { 
      id: 'mista', min: 60, price: 250, icon: "flame", tag: "Contato Intenso", title: "Experiência Fusion", 
      desc: "Contato físico mais próximo e corpo a corpo.",
      details: ["Atendo apenas de cueca, garantindo maior intimidade", "Contato da minha barba pelo seu corpo", "Técnica Lingam inclusa e prolongada."]
    },
    { 
      id: 'nuru', min: 60, price: 350, icon: "star", popular: true, tag: "Imersiva", title: "Massagem Nuru (Gel)", 
      desc: "Deslizamento total de corpos.",
      details: ["Nós dois sem roupas do início ao fim", "Fluidez total usando gel especial ultra deslizante", "Técnica Lingam inclusa, estímulo intenso frente e costas."]
    },
    { 
      id: 'reversa', min: 60, price: 400, icon: "heart", tag: "Seu Controle", title: "Massagem Reversa", 
      desc: "Você assume o comando da sessão.",
      details: ["Eu começo relaxando e estimulando seu corpo", "Depois, o controle passa para você", "Você dita o ritmo e explora meu corpo livremente."]
    }
  ],
  packs: [
    { id: 'pack_classic4', min: 60, price: 576, fullPrice: 720, icon: "calendar", tag: "Mensal", title: "Mês Sem Dor (4x)", desc: "4 sessões clássicas no mês focadas na saúde muscular e alívio do estresse." },
    { id: 'pack_tantric', min: 60, price: 640, fullPrice: 800, icon: "flame", tag: "Imersão", title: "Jornada Tântrica (3x)", desc: "3 encontros escalando a intimidade: 1 Sensitiva, 1 Fusion e 1 Nuru com Lingam inclusos." }
  ],
  extras: [
    { id: 'more_time', price: 75, label: 'Estender tempo (+30 Minutos)' },
    { id: 'aroma', price: 20, label: 'Aromaterapia Relaxante' },
  ],
  reviews: [
    { n: 'Marcos A.', loc: 'Bela Vista - SP', t: 'O ambiente que o Thalyson cria é incrível. Me senti à vontade no primeiro minuto. A técnica da massagem é de primeira.' },
    { n: 'Leandro S.', loc: 'Jardins - SP', t: 'Lugar super discreto. A experiência da Nuru foi surreal, desliguei total do mundo lá fora.' },
    { n: 'João Paulo', loc: 'Hotel - SP', t: 'Pedi atendimento no hotel. Pontual, respeitoso e com uma energia maravilhosa. Recomendo muito.' },
    { n: 'Rafael', loc: 'Consolação - SP', t: 'Para quem precisa de discrição absoluta. O toque é firme onde tem que ser e muito suave no final.' },
  ],
  coupons: {
    'RELAX10': { value: 10, label: 'Desconto especial' },
    'PRIMEIRA15': { value: 15, label: 'Primeira sessão' },
  },
};

// ==================================================================================
// COMPONENTES MODAIS
// ==================================================================================
const AgeGateModal = ({ onConfirm }: { onConfirm: (valid: boolean) => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#1B1815]/98 backdrop-blur-md animate-scale-in text-center">
      <div className="w-20 h-20 bg-[#8FA888]/10 text-[#8FA888] rounded-full flex items-center justify-center mb-6 border border-[#8FA888]/20">
        <Icon name="shield" size={32} />
      </div>
      <h2 className="font-display text-3xl text-[#F2ECE1] mb-3">Conteúdo Restrito</h2>
      <p className="text-[#A79E8E] text-sm mb-10 max-w-sm leading-relaxed">
        Meus serviços envolvem contato físico próximo e incluem técnicas de massagem íntima (Lingam). Você confirma ser maior de 18 anos?
      </p>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button onClick={() => onConfirm(true)} className="w-full bg-[#8FA888] text-[#1B1815] font-semibold h-14 rounded-2xl flex items-center justify-center transition-transform active:scale-95">
          Sim, sou maior de 18 anos
        </button>
        <button onClick={() => onConfirm(false)} className="w-full panel text-[#A79E8E] font-semibold h-14 rounded-2xl flex items-center justify-center transition-transform active:scale-95">
          Não sou
        </button>
      </div>
    </div>
  );
};

const WelcomeGiftReveal = ({ onWin }: { onWin: (val: number) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealedVal, setRevealedVal] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    vibrate([40, 40]);
    setSelected(idx);
    const prize = 15; // Valor fixo de cortesia simplificado
    
    setTimeout(() => {
      setRevealedVal(prize);
      vibrate([90, 40, 160]);
      setTimeout(() => onWin(prize), 2000);
    }, 550);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-6 bg-[#1B1815]/98 backdrop-blur-md animate-scale-in">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full border border-[#8FA888]/20 animate-ripple" />
      </div>
      <div className="text-center mb-10 max-w-sm animate-fade-up">
        <p className="text-[#8FA888] text-xs font-semibold mb-3">Boas-vindas</p>
        <h2 className="font-display text-3xl text-[#F2ECE1] mb-3">Um mimo para sua primeira sessão</h2>
        <p className="text-[#A79E8E] text-sm leading-relaxed">Escolha um dos cartões e descubra seu benefício.</p>
      </div>
      <div className="flex gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        {[0, 1, 2].map((idx) => (
          <button key={idx} onClick={() => handleSelect(idx)} disabled={selected !== null}
            className={`relative w-24 h-36 rounded-2xl border transition-all duration-700 [transform-style:preserve-3d] ${selected === idx ? 'scale-110' : selected !== null ? 'opacity-30 scale-95' : 'hover:scale-105'} ${revealedVal && selected === idx ? '[transform:rotateY(180deg)_scale(1.1)]' : ''}`}>

            <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border flex items-center justify-center panel border-[#8FA888]/25">
              <Icon name="gift" className="text-[#8FA888]/60" />
            </div>

            <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl border flex flex-col items-center justify-center bg-[#8FA888] border-[#8FA888] [transform:rotateY(180deg)]">
              <span className="text-xs font-semibold text-[#1B1815]">Cortesia</span>
              <span className="font-display text-2xl text-[#1B1815] mt-1">R$ {revealedVal}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, step }: { title: string; subtitle?: string; step: number }) => (
  <div className="mb-6 flex items-start gap-4">
    <div className="w-8 h-8 rounded-full bg-[#F2ECE1]/8 flex items-center justify-center text-[#A79E8E] text-sm font-semibold shrink-0 mt-0.5">{step}</div>
    <div>
      <h2 className="font-display text-2xl text-[#F2ECE1]">{title}</h2>
      {subtitle && <p className="text-[#A79E8E] text-sm mt-1">{subtitle}</p>}
    </div>
  </div>
);

// ==================================================================================
// APP PRINCIPAL
// ==================================================================================
export default function App() {
  const [isAdult, setIsAdult] = useState<boolean | null>(null);
  const [giftDone, setGiftDone] = useState(false);
  const [isAppVisible, setIsAppVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const [booking, setBooking] = useState<BookingState>({
    cart: [], extras: {}, locationType: '',
    name: '', age: '', specialRequest: '', payment: '', discount: 0,
    address: { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    date: null, time: '', manualCoupon: '', manualCouponValue: 0,
    finished: false,
  });

  const servicesRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAdult = localStorage.getItem('thaly_adult_v5');
      if (checkAdult === 'yes') setIsAdult(true);
      else setIsAdult(false);

      const hasSeen = localStorage.getItem('thaly_gift_v5');
      if (hasSeen) {
        setGiftDone(true);
        setBooking((b) => ({ ...b, discount: parseInt(hasSeen) }));
      }
    }
  }, []);

  useEffect(() => {
    // Quando passou pelo gate e pelo gift, aciona a animação da página inteira
    if (isAdult && giftDone) {
      setTimeout(() => setIsAppVisible(true), 100);
    }
  }, [isAdult, giftDone]);

  const handleAdultConfirm = (valid: boolean) => {
    if (valid) {
      localStorage.setItem('thaly_adult_v5', 'yes');
      setIsAdult(true);
    } else {
      window.location.href = "https://google.com";
    }
  };

  const handleWinGift = (val: number) => {
    localStorage.setItem('thaly_gift_v5', val.toString());
    setBooking((b) => ({ ...b, discount: val }));
    setGiftDone(true);
  };

  // Lógica de Seleção Inteligente + Auto-Scroll
  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) { const y = ref.current.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: y, behavior: 'smooth' }); }
  };

  const handleToggleItem = (item: Service) => {
    vibrate(25);
    setBooking((p) => {
      const exists = p.cart.find((c) => c.id === item.id);
      
      // Auto-scroll se o usuário acabou de adicionar um serviço
      if (!exists) {
        setTimeout(() => {
          scrollToRef(locationRef);
        }, 300); // tempo para o react renderizar o próximo passo ativo
      }

      return { ...p, cart: exists ? p.cart.filter((c) => c.id !== item.id) : [...p.cart, item] };
    });
  };

  const handleCep = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    setBooking((b) => ({ ...b, address: { ...b.address, cep: masked } }));

    if (masked.length === 9) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setBooking((b) => ({ ...b, address: { ...b.address, street: data.logradouro, district: data.bairro, city: data.localidade } }));
          vibrate([40, 40]);
        }
      } catch (err) {} finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleApplyCoupon = () => {
    const code = booking.manualCoupon.trim().toUpperCase();
    const couponData = (DATA.coupons as any)[code];
    if (couponData) {
      setBooking((b) => ({ ...b, manualCouponValue: couponData.value }));
      vibrate(40);
    } else {
      setBooking((b) => ({ ...b, manualCouponValue: 0 }));
      alert('Cupom inválido ou expirado.');
    }
  };

  const financials = useMemo(() => {
    let sub = 0; let duration = 0;
    const isPack = booking.cart.some((i) => i.id.startsWith('pack'));
    booking.cart.forEach((item) => { sub += item.price; if (!isPack) duration += (item.min || 60); });
    if (isPack) duration = 60;

    Object.keys(booking.extras).forEach((k) => {
      if (booking.extras[k]) {
        const ex = DATA.extras.find((e) => e.id === k);
        if (ex) { sub += ex.price; if (k === 'more_time') duration += 30; }
      }
    });

    const customRequestFee = booking.specialRequest.trim().length > 0 ? 130 : 0;
    sub += customRequestFee;

    const peakFee = (PEAK_HOURS.includes(booking.time) && booking.locationType !== 'studio') ? PEAK_FEE : 0;
    const totalDiscounts = booking.discount + booking.manualCouponValue;

    const running = Math.max(0, sub - totalDiscounts);
    const pixDisc = booking.payment === 'pix' ? Math.ceil(running * 0.03) : 0;

    return { sub, peakFee, pixDisc, totalDiscounts, customRequestFee, total: Math.max(0, running - pixDisc) + peakFee, duration };
  }, [booking]);

  const currentStepInfo = useMemo(() => {
    if (booking.cart.length === 0) return { label: 'Escolha uma sessão', action: () => scrollToRef(servicesRef), ready: false };
    if (!booking.name || !booking.age || !booking.locationType || (booking.locationType === 'home' && !booking.address.street) || (booking.locationType === 'hotel' && !booking.address.placeName)) return { label: 'Preencha a identificação', action: () => scrollToRef(locationRef), ready: false };
    if (!booking.date || !booking.time) return { label: 'Escolha o horário', action: () => scrollToRef(timeRef), ready: false };
    if (!booking.payment) return { label: 'Revise o pagamento', action: () => scrollToRef(checkoutRef), ready: false };
    return { label: 'Confirmar Agendamento', action: () => setBooking((b) => ({ ...b, finished: true })), ready: true };
  }, [booking]);

  const sendWhatsApp = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '';

    const servicesText = booking.cart.map((item) => `▪️ ${item.title}`).join('\n');
    const locTxt = booking.locationType === 'home'
      ? `🏡 Casa: ${booking.address.street}, ${booking.address.number} ${booking.address.comp ? `(${booking.address.comp})` : ''}`
      : booking.locationType === 'studio' ? `📍 Estúdio: Bela Vista` : `🏨 Hotel: ${booking.address.placeName} (Qto: ${booking.address.comp || '-'})`;

    const extrasList = Object.keys(booking.extras).filter((k) => booking.extras[k]).map((k) => `➕ ${DATA.extras.find((e) => e.id === k)?.label}`).join('\n');
    const reqText = booking.specialRequest.trim() ? `\n\n📝 Preferência Especial (+R$ 130,00):\n"${booking.specialRequest.trim()}"\n_(Aguardando avaliação)_` : '';

    const msg = `*NOVO AGENDAMENTO*\n\n👤 Nome: ${booking.name} (${booking.age} anos)\n📅 Data: ${dateStr} às ${booking.time}\n⏳ Duração: ~${f.duration} min\n\n*Serviços:*\n${servicesText}\n${extrasList ? `\n*Extras:*\n${extrasList}\n` : ''}\n*Local:*\n${locTxt}${reqText}\n\n*Pagamento:* ${booking.payment.toUpperCase()}\n💰 Valor total: ${formatMoney(f.total)}`;

    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (isAdult === null) return null;
  if (isAdult === false) return <><GlobalStyles /><AgeGateModal onConfirm={handleAdultConfirm} /></>;
  if (!giftDone) return <><GlobalStyles /><WelcomeGiftReveal onWin={handleWinGift} /></>;

  if (booking.finished) {
    return (
      <>
        <GlobalStyles />
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-scale-in">
          <div className="w-20 h-20 bg-[#8FA888]/15 text-[#8FA888] rounded-full flex items-center justify-center mb-6 border border-[#8FA888]/25"><Icon name="check" size={34} /></div>
          <h2 className="font-display text-3xl text-[#F2ECE1] mb-3">Resumo Concluído</h2>
          <p className="text-[#A79E8E] text-sm mb-10 max-w-sm leading-relaxed">Para garantir nosso sigilo e confirmar seu horário, envie as informações geradas direto no meu WhatsApp.</p>

          <button onClick={sendWhatsApp} className="w-full max-w-sm bg-[#25D366] text-[#0d1f14] font-semibold h-14 rounded-2xl flex items-center justify-center gap-2 hover:brightness-105 transition-all">
            <Icon name="message" size={20} /> Enviar Pedido no WhatsApp
          </button>
        </div>
      </>
    );
  }

  const days = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }

  const generateTimeSlots = () => {
    if (!booking.date) return [];
    const slots = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) slots.push(`${i < 10 ? '0' : ''}${i}:00`);
    const now = new Date();
    if (booking.date.toDateString() === now.toDateString()) return slots.filter((t) => parseInt(t.split(':')[0]) > now.getHours());
    return slots;
  };
  const availableTimeSlots = generateTimeSlots();

  return (
    <div className={isAppVisible ? "animate-page-load" : "opacity-0"}>
      <GlobalStyles />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-40 flex flex-col gap-14">

        <header className="flex justify-between items-center">
          <span className="font-display text-lg text-[#F2ECE1]">{CONFIG.BUSINESS_NAME}</span>
          <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl panel flex items-center justify-center text-[#A79E8E] hover:text-[#F2ECE1] transition-colors">
            <Icon name="instagram" size={17} />
          </a>
        </header>

        {/* HERO */}
        <section>
          <div className="relative panel rounded-[2rem] p-8 sm:p-10 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#8FA888]/10 blur-2xl" />
            <div className="relative">
              <p className="text-[#8FA888] text-xs font-semibold mb-4">{CONFIG.ADDRESS_AREA}</p>
              <h1 className="font-display text-[2.2rem] sm:text-4xl leading-[1.1] text-[#F2ECE1] mb-4 max-w-sm">
                Desligue do mundo. Sinta o corpo.
              </h1>
              <p className="text-[#A79E8E] text-sm leading-relaxed max-w-sm mb-6">
                Atendimento masculino exclusivo e individual. Das tensões do dia a dia à total imersão e relaxamento.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 bg-[#2C2721] text-xs font-medium text-[#F2ECE1] px-3 py-2 rounded-xl"><Icon name="star" size={13} className="text-[#C79A62]" /> 5.0</span>
                <span className="flex items-center gap-1.5 bg-[#2C2721] text-xs font-medium text-[#F2ECE1] px-3 py-2 rounded-xl"><Icon name="shield" size={13} className="text-[#8FA888]" /> Sigilo absoluto</span>
              </div>
            </div>
          </div>
        </section>

        {/* 1. SERVIÇOS */}
        <section ref={servicesRef}>
          <SectionHeader step={1} title="Sessões" subtitle="Compare as opções e escolha a sua experiência." />

          <div className="flex gap-2 p-1.5 panel rounded-2xl mb-6 w-full sm:w-fit">
            <button onClick={() => setActiveTab('single')} className={`flex-1 px-6 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === 'single' ? 'bg-[#F2ECE1] text-[#1B1815]' : 'text-[#A79E8E]'}`}>Sessões</button>
            <button onClick={() => setActiveTab('packs')} className={`flex-1 px-6 py-2.5 rounded-xl text-xs font-semibold transition-colors ${activeTab === 'packs' ? 'bg-[#8FA888] text-[#1B1815]' : 'text-[#A79E8E]'}`}>Planos Mensais</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(activeTab === 'single' ? DATA.services : DATA.packs).map((item) => {
              const sel = booking.cart.find((c) => c.id === item.id);
              return (
                <div key={item.id} onClick={() => handleToggleItem(item)} className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer flex flex-col ${sel ? 'bg-[#8FA888]/10 border-[#8FA888]/50 shadow-[0_4px_20px_rgba(143,168,136,0.1)]' : 'panel hover:border-[#F2ECE1]/20'}`}>

                  <div className="flex items-start gap-4 mb-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${sel ? 'bg-[#8FA888] text-[#1B1815]' : 'bg-[#F2ECE1]/8 text-[#F2ECE1]'}`}>
                      <Icon name={item.icon} size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-[#8FA888] block truncate">{item.tag}</span>
                        {sel && <Icon name="check" size={18} className="text-[#8FA888] shrink-0" />}
                      </div>
                      <h3 className="font-display text-xl text-[#F2ECE1] mb-1 leading-tight">{item.title}</h3>
                      <p className="text-[#A79E8E] text-sm">{item.desc}</p>
                    </div>
                  </div>

                  {'details' in item && item.details && (
                    <div className="mt-3 mb-5 space-y-2 pl-[4.25rem]">
                      {item.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#c9c1b3]">
                          <span className="text-[#8FA888] mt-0.5">•</span>
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end justify-between mt-2 pt-4 border-t border-[#F2ECE1]/8 pl-[4.25rem]">
                    <span className="text-xs text-[#A79E8E] font-medium">Até {item.min || 60} min</span>
                    <div className="text-right">
                      {item.fullPrice && <span className="text-xs text-[#A79E8E] line-through block mb-0.5">{formatMoney(item.fullPrice)}</span>}
                      <span className="font-display text-xl text-[#F2ECE1]">{formatMoney(item.price)}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        {/* 2. LOCAL E DADOS */}
        <section ref={locationRef} className={`transition-opacity duration-500 ${booking.cart.length ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={2} title="Local e Identificação" subtitle="Como devo te chamar e onde vamos nos encontrar." />

          <div className="panel p-5 sm:p-8 rounded-3xl space-y-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs font-medium text-[#A79E8E] mb-2 block pl-1">Nome ou Apelido</label>
                <input type="text" value={booking.name} onChange={(e) => setBooking((b) => ({ ...b, name: e.target.value }))} className="w-full h-14 rounded-xl px-4 field text-sm" placeholder="Manteremos sigilo" />
              </div>
              <div className="w-24 shrink-0">
                <label className="text-xs font-medium text-[#A79E8E] mb-2 block pl-1">Idade</label>
                <input type="tel" maxLength={2} value={booking.age} onChange={(e) => setBooking((b) => ({ ...b, age: e.target.value.replace(/\D/g, '') }))} className="w-full h-14 rounded-xl px-4 field text-sm text-center" placeholder="18+" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#A79E8E] mb-3 block pl-1">Onde vamos nos encontrar?</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                {[{ id: 'studio', label: 'Meu Espaço' }, { id: 'home', label: 'Na sua Casa' }, { id: 'hotel', label: 'Em Hotel' }].map((l) => (
                  <button key={l.id} onClick={() => {
                      setBooking((b) => ({ ...b, locationType: l.id }));
                      if(l.id === 'studio') setTimeout(() => scrollToRef(timeRef), 200); // Auto-scroll se for estúdio
                    }} 
                    className={`py-4 px-1 sm:px-2 text-xs font-semibold rounded-2xl border transition-colors flex flex-col items-center justify-center text-center ${booking.locationType === l.id ? 'bg-[#8FA888] border-[#8FA888] text-[#1B1815]' : 'bg-[#F2ECE1]/4 border-[#F2ECE1]/10 text-[#A79E8E]'}`}>
                    {l.label}
                  </button>
                ))}
              </div>

              {booking.locationType === 'studio' && <p className="text-xs text-[#8FA888] bg-[#8FA888]/10 p-4 rounded-xl border border-[#8FA888]/20 leading-relaxed">Eu atendo na Bela Vista. O endereço exato é enviado por WhatsApp após a finalizarmos esse pedido.</p>}

              {booking.locationType === 'home' && (
                <div className="space-y-3 animate-fade-up">
                  <div className="relative">
                    <input type="tel" maxLength={9} placeholder="CEP" value={booking.address.cep} onChange={handleCep} className="w-full h-14 rounded-xl px-4 field text-sm" />
                    {isLoadingCep && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#8FA888] border-t-transparent rounded-full animate-spin" />}
                  </div>
                  <input type="text" placeholder="Rua / Avenida" value={booking.address.street} onChange={(e) => setBooking((b) => ({ ...b, address: { ...b.address, street: e.target.value } }))} className="w-full h-14 rounded-xl px-4 field text-sm" disabled={isLoadingCep} />
                  <div className="flex gap-3">
                    <input type="tel" placeholder="Número" value={booking.address.number} onChange={(e) => setBooking((b) => ({ ...b, address: { ...b.address, number: e.target.value } }))} className="w-1/3 h-14 rounded-xl px-4 field text-sm" />
                    <input type="text" placeholder="Apto / Bloco" value={booking.address.comp} onChange={(e) => setBooking((b) => ({ ...b, address: { ...b.address, comp: e.target.value } }))} className="w-2/3 h-14 rounded-xl px-4 field text-sm" />
                  </div>
                  <input type="text" placeholder="Bairro" value={booking.address.district} onChange={(e) => setBooking((b) => ({ ...b, address: { ...b.address, district: e.target.value } }))} className="w-full h-14 rounded-xl px-4 field text-sm" disabled={isLoadingCep} />
                </div>
              )}

              {booking.locationType === 'hotel' && (
                <div className="space-y-3 animate-fade-up">
                  <input type="text" placeholder="Nome do Hotel" value={booking.address.placeName} onChange={(e) => setBooking((b) => ({ ...b, address: { ...b.address, placeName: e.target.value } }))} className="w-full h-14 rounded-xl px-4 field text-sm" />
                  <input type="text" placeholder="Quarto / Suíte" value={booking.address.comp} onChange={(e) => setBooking((b) => ({ ...b, address: { ...b.address, comp: e.target.value } }))} className="w-full h-14 rounded-xl px-4 field text-sm" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={timeRef} className={`transition-opacity duration-500 ${booking.locationType && booking.name && booking.age ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={3} title="Data e horário" subtitle={`Meus horários disponíveis, das ${CONFIG.START_HOUR}h às ${CONFIG.END_HOUR}h.`} />

          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
            {days.map((d, i) => {
              const sel = booking.date?.toDateString() === d.toDateString();
              return (
                <button key={i} onClick={() => setBooking((b) => ({ ...b, date: d, time: '' }))} className={`snap-center shrink-0 w-[68px] h-[84px] rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${sel ? 'bg-[#8FA888] border-[#8FA888] text-[#1B1815] scale-105 shadow-[0_4px_15px_rgba(143,168,136,0.3)]' : 'panel text-[#A79E8E] hover:border-[#F2ECE1]/20'}`}>
                  <span className="text-[10px] font-semibold">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}</span>
                  <span className="font-display text-xl leading-none">{d.getDate()}</span>
                </button>
              );
            })}
          </div>

          {booking.date && (
            <div className="grid grid-cols-4 gap-3 animate-fade-up">
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((t) => {
                  const sel = booking.time === t;
                  const isPeak = PEAK_HOURS.includes(t) && booking.locationType !== 'studio';
                  return (
                    <button key={t} onClick={() => {
                        setBooking((b) => ({ ...b, time: t }));
                        setTimeout(() => scrollToRef(checkoutRef), 200); // Auto scroll ao selecionar horário
                      }} 
                      className={`h-14 rounded-xl text-sm font-semibold border transition-colors relative flex items-center justify-center ${sel ? 'bg-[#8FA888] border-[#8FA888] text-[#1B1815]' : 'panel text-[#c9c1b3] hover:border-[#F2ECE1]/20'}`}>
                      {t}
                      {isPeak && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C79A62] rounded-full" />}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-4 p-4 text-center text-[#A79E8E] text-sm panel rounded-xl">Nenhum horário disponível para hoje.</div>
              )}
            </div>
          )}
        </section>

        {/* 4. EXTRAS E PAGAMENTO */}
        <section ref={checkoutRef} className={`transition-opacity duration-500 ${booking.time ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={4} title="Extras e pagamento" subtitle="O acerto final é feito presencialmente." />

          <div className="panel p-5 sm:p-8 rounded-3xl space-y-6">

            <div>
              <p className="text-xs font-medium text-[#A79E8E] mb-3 pl-1">Adicionais (opcional)</p>
              <div className="space-y-3">
                {DATA.extras.map((ex) => {
                  const sel = booking.extras[ex.id];
                  return (
                    <button key={ex.id} onClick={() => setBooking((b) => ({ ...b, extras: { ...b.extras, [ex.id]: !sel } }))} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${sel ? 'bg-[#8FA888]/10 border-[#8FA888]/40' : 'bg-[#F2ECE1]/4 border-[#F2ECE1]/10'}`}>
                      <span className={`text-sm font-medium ${sel ? 'text-[#8FA888]' : 'text-[#c9c1b3]'}`}>{ex.label}</span>
                      <span className="text-xs font-semibold text-[#A79E8E]">+{formatMoney(ex.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 pl-1">
                <p className="text-xs font-medium text-[#A79E8E]">Pedidos e Preferências Especiais</p>
                <span className="text-xs font-bold text-[#C79A62]">+ R$ 130,00</span>
              </div>
              <p className="text-xs text-[#7d7565] mb-3 pl-1 leading-relaxed">Fique à vontade para descrever se tiver alguma preferência específica ou fetiche. Será avaliado na hora (se não aceito, a taxa não é cobrada).</p>
              <textarea
                value={booking.specialRequest}
                onChange={(e) => setBooking((b) => ({ ...b, specialRequest: e.target.value }))}
                placeholder="Pode descrever com clareza..."
                className="w-full p-4 rounded-2xl field text-sm min-h-[90px] resize-none"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-[#A79E8E] mb-2 pl-1">Cupom de desconto</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={booking.manualCoupon}
                  onChange={(e) => setBooking((b) => ({ ...b, manualCoupon: e.target.value }))}
                  placeholder="Digite o código"
                  className="flex-1 h-12 rounded-xl px-4 field text-sm uppercase"
                  disabled={booking.manualCouponValue > 0}
                />
                <button
                  onClick={booking.manualCouponValue > 0 ? () => setBooking((b) => ({ ...b, manualCouponValue: 0, manualCoupon: '' })) : handleApplyCoupon}
                  className={`h-12 px-5 rounded-xl font-semibold text-xs transition-colors ${booking.manualCouponValue > 0 ? 'bg-[#b5534a]/20 text-[#e08a80]' : 'bg-[#F2ECE1]/8 text-[#F2ECE1] hover:bg-[#F2ECE1]/14'}`}
                >
                  {booking.manualCouponValue > 0 ? 'Remover' : 'Aplicar'}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#A79E8E] mb-3 pl-1">Como prefere pagar no local?</p>
              <div className="flex gap-2 sm:gap-3">
                {[{ id: 'pix', label: 'Pix (-3%)' }, { id: 'card', label: 'Cartão' }, { id: 'cash', label: 'Dinheiro' }].map((p) => (
                  <button key={p.id} onClick={() => setBooking((b) => ({ ...b, payment: p.id }))} className={`flex-1 h-12 rounded-xl text-xs font-semibold border transition-colors ${booking.payment === p.id ? 'bg-[#8FA888] border-[#8FA888] text-[#1B1815]' : 'bg-[#F2ECE1]/4 border-[#F2ECE1]/10 text-[#A79E8E]'}`}>{p.label}</button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#F2ECE1]/10">
              <div className="flex justify-between text-sm text-[#A79E8E] mb-2"><span>Subtotal</span><span>{formatMoney(financials.sub - financials.customRequestFee)}</span></div>
              
              {financials.customRequestFee > 0 && <div className="flex justify-between text-sm text-[#A79E8E] mb-2"><span>Pedido Especial</span><span>+{formatMoney(financials.customRequestFee)}</span></div>}
              
              {booking.discount > 0 && <div className="flex justify-between text-sm text-[#8FA888] mb-2"><span>Cortesia (Boas Vindas)</span><span>-{formatMoney(booking.discount)}</span></div>}
              {booking.manualCouponValue > 0 && <div className="flex justify-between text-sm text-[#8FA888] mb-2"><span>Cupom aplicado</span><span>-{formatMoney(booking.manualCouponValue)}</span></div>}
              {financials.peakFee > 0 && <div className="flex justify-between text-sm text-[#A79E8E] mb-2"><span>Taxa de deslocamento</span><span>+{formatMoney(financials.peakFee)}</span></div>}
              {financials.pixDisc > 0 && <div className="flex justify-between text-sm text-[#8FA888] mb-2"><span>Desconto Pix</span><span>-{formatMoney(financials.pixDisc)}</span></div>}

              <div className="flex justify-between items-center mt-6">
                <span className="font-display text-lg text-[#F2ECE1]">Total</span>
                <span className="font-display text-3xl text-[#C79A62]">{formatMoney(financials.total)}</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="panel border-t-0 rounded-t-[2rem] py-10 pb-36 text-center text-[#A79E8E] text-xs mt-auto">
        <div className="max-w-xl mx-auto px-6">
          <p className="font-display text-lg text-[#F2ECE1] mb-2">{CONFIG.BUSINESS_NAME}</p>
          <p className="mb-4 leading-relaxed">Atendimento exclusivo, discreto e focado no bem-estar masculino. Não realizamos serviços que desrespeitem nossos termos de uso.</p>
          <p>© {new Date().getFullYear()} {CONFIG.BUSINESS_NAME}. {CONFIG.ADDRESS_AREA}.</p>
        </div>
      </footer>

      <div className="fixed bottom-0 inset-x-0 p-4 sm:p-6 z-40 bg-gradient-to-t from-[#1B1815] via-[#1B1815]/92 to-transparent pt-12 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <button onClick={currentStepInfo.action} className={`w-full h-14 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-2xl ${currentStepInfo.ready ? 'bg-[#8FA888] text-[#1B1815] hover:brightness-105' : 'panel-soft text-[#F2ECE1] hover:bg-[#2C2721]'}`}>
            {currentStepInfo.label}
            {!currentStepInfo.ready ? <Icon name="arrow-down" size={18} /> : <Icon name="check" size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
