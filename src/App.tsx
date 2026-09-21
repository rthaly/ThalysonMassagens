import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

// ==================================================================================
// DESIGN TOKENS & CONFIG
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://www.instagram.com/relaxarhojesp",
  THERAPIST_EMAIL: "thalysonrd@gmail.com",
  START_HOUR: 9,
  END_HOUR: 22,
};

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const RUSH_FEE = 15;

const ICON_PATHS: Record<string, string> = {
  'check': 'M20 6L9 17l-5-5',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'arrow-down': 'M12 5v14 M19 12l-7 7-7-7',
  'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'calendar': 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'lock': 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4'
};

// ==================================================================================
// GLOBAL STYLES (Plus Jakarta Sans & Utilities)
// ==================================================================================
const GlobalStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    
    :root {
      --font-main: 'Plus Jakarta Sans', sans-serif;
      --c-bg: #09090b;
      --c-surface: #121214;
      --c-border: rgba(255,255,255,0.08);
      --c-text: #f4f4f5;
      --c-text-muted: #a1a1aa;
      --c-accent: #fbbf24;
    }

    html, body {
      background-color: var(--c-bg); color: var(--c-text); font-family: var(--font-main);
      overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; scroll-behavior: smooth;
    }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes pulseSoft { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
    
    .animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-pulse-soft { animation: pulseSoft 2s infinite ease-in-out; }

    /* Utilitários 3D para o cartão de cortesia */
    .preserve-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; }

    .glass-panel { background: rgba(18, 18, 20, 0.6); backdrop-filter: blur(16px); border: 1px solid var(--c-border); }
    
    .input-premium {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white; transition: all 0.2s;
    }
    .input-premium:focus { border-color: var(--c-accent); background: rgba(255,255,255,0.05); outline: none; }
    .input-premium:disabled { opacity: 0.5; cursor: not-allowed; }
  `}} />
));

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICON_PATHS[name] || ''} /></svg>
));

const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 50) => { try { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); } catch(e){} };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

// ==================================================================================
// DATA SOURCE
// ==================================================================================
const DATA = {
  services: [
    { 
      id: 'depilacao', min: 60, price: 107, icon: "scissors", tag: "ESTÉTICA", title: "Aparo de Pelos", 
      desc: "Higiene e estética corporal.",
      details: ["Aparo feito com máquina (pentes 0 e 3)", "Cuidado completo para deixar o corpo limpo e preparado."]
    },
    { 
      id: 'pes', min: 40, price: 110, icon: "user-check", tag: "ALÍVIO RÁPIDO", title: "Reflexologia Podal", 
      desc: "Foco total em tirar o cansaço dos pés.",
      details: ["Pressão profunda em pontos de tensão na sola dos pés", "Alívio imediato para quem passa muito tempo em pé."]
    },
    { 
      id: 'relaxante', min: 60, price: 180, icon: "user-check", tag: "ALÍVIO MUSCULAR", title: "Massagem Clássica", 
      desc: "Corpo todo, focada em desfazer nós e dores.",
      details: ["Pressão firme nas costas, braços e pernas", "Foco em tirar travas e estresse muscular", "Estritamente terapêutica, sem toques íntimos."]
    },
    { 
      id: 'sensitiva', min: 60, price: 200, icon: "sparkles", tag: "DESPERTAR", title: "Massagem Sensitiva", 
      desc: "Inicia clássica e termina sensorial.",
      details: ["Massagem inicial profunda para tirar tensão", "Toques sutis com as mãos despertando a pele", "Finalização tântrica manual focada no alívio mental."]
    },
    { 
      id: 'mista', min: 60, price: 250, icon: "zap", tag: "CUECA E BARBA", title: "Experiência Fusion", 
      desc: "Contato físico intenso, corpo a corpo.",
      details: ["Atendo apenas de cueca, garantindo sensações próximas", "Após relaxar seu corpo, passo minha barba em você (frente e costas)", "Nível alto de intimidade, com massagem íntima manual (Lingam)."]
    },
    { 
      id: 'nuru', min: 60, price: 350, icon: "star", popular: true, tag: "DESLIZAMENTO", title: "Massagem Nuru (Gel)", 
      desc: "A mais pedida. Deslizamento total de corpos.",
      details: ["Nós dois sem roupas do início ao fim", "Muito gel especial ultra deslizante sobre a pele", "Contato fluido e intenso de corpo todo (frente e costas)", "Estímulo terminando em uma liberação prazerosa e intensa."]
    },
    { 
      id: 'reversa', min: 60, price: 400, icon: "zap", tag: "SEU CONTROLE", title: "Massagem Reversa", 
      desc: "Você assume o comando da sessão.",
      details: ["Eu começo a massagem relaxando o seu corpo", "Depois, o controle passa para você", "Você dita o ritmo, os toques e a intensidade pelo meu corpo", "Finalização mútua e libertadora."]
    }
  ],
  packs: [
    { id: 'pack_classic4', price: 576, fullPrice: 720, icon: "calendar", tag: "MENSAL", title: "Mês Sem Dor (4x)", desc: "4 sessões clássicas no mês (1x por semana) focadas na saúde muscular e alívio de tensões." },
    { id: 'pack_tantric', price: 640, fullPrice: 800, icon: "heart", tag: "IMERSÃO", title: "Jornada Tântrica (3x)", desc: "3 encontros escalando a intimidade: 1 Sensitiva, 1 Fusion e 1 Nuru com gel." }
  ],
  extras: [
    { id: 'more_time', price: 75, label: "Estender tempo (+30 Minutos)" },
    { id: 'aroma', price: 20, label: "Aromaterapia Relaxante" }
  ],
  reviews: [
    { n: "Marcos A.", loc: "Bela Vista - SP", t: "Atendimento sensacional. O Thalyson é super atencioso e me deixou muito à vontade desde o primeiro minuto. Recomendo a Fusion, valeu cada centavo!" },
    { n: "Leandro S.", loc: "Jardins - SP", t: "Lugar discreto, limpo e bem localizado. A massagem Nuru é indescritível, me desliguei total dos problemas." },
    { n: "João Paulo", loc: "Hotel - SP", t: "Estava de passagem por SP e pedi atendimento no hotel. Pontual, muito profissional e com uma energia maravilhosa. Voltarei com certeza." },
    { n: "Rafael (Sigiloso)", loc: "Consolação - SP", t: "Para quem é casado e precisa de discrição, não tem lugar melhor. Respeito do início ao fim e a massagem tirou todas as minhas dores." }
  ],
  coupons: {
    'RELAX10': { type: 'fixed', value: 10, label: 'Desconto Especial (R$ 10)' },
    'PRIMEIRA15': { type: 'fixed', value: 15, label: 'Primeira Sessão (R$ 15)' },
  }
};

// ==================================================================================
// COMPONENTS
// ==================================================================================

const AgeGateModal = ({ onConfirm }: { onConfirm: (valid: boolean) => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#09090b]/95 backdrop-blur-md animate-fade-in text-center">
      <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
        <Icon name="shield" size={32} />
      </div>
      <h2 className="text-3xl font-bold text-white mb-3">Conteúdo Adulto</h2>
      <p className="text-zinc-400 text-sm mb-10 max-w-sm leading-relaxed">
        Meus serviços de terapia e relaxamento são exclusivos para maiores de 18 anos. Você confirma que tem mais de 18 anos?
      </p>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button onClick={() => onConfirm(true)} className="w-full bg-amber-500 text-black font-bold h-14 rounded-2xl flex items-center justify-center transition-transform active:scale-95">
          Sim, sou maior de 18 anos
        </button>
        <button onClick={() => onConfirm(false)} className="w-full bg-white/5 border border-white/10 text-zinc-300 font-bold h-14 rounded-2xl flex items-center justify-center transition-transform active:scale-95">
          Não sou
        </button>
      </div>
    </div>
  );
};

const PremiumGiftReveal = ({ onWin }: { onWin: (val: number) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealedVal, setRevealedVal] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    vibrate([50, 50]);
    setSelected(idx);
    const chances = [20, 20, 20, 20, 15, 10]; 
    const prize = chances[Math.floor(Math.random() * chances.length)];
    
    setTimeout(() => {
      setRevealedVal(prize);
      vibrate([100, 50, 200]);
      setTimeout(() => onWin(prize), 2500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-6 bg-[#09090b]/95 backdrop-blur-md animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Cortesias</h2>
        <p className="text-zinc-400 text-sm">Escolha um dos cartões para descobrir seu benefício de boas-vindas na primeira sessão.</p>
      </div>
      <div className="flex gap-4">
        {[0, 1, 2].map((idx) => (
          <button key={idx} onClick={() => handleSelect(idx)} disabled={selected !== null}
            className={`relative w-24 h-36 rounded-2xl border transition-all duration-700 preserve-3d ${selected === idx ? 'scale-110' : selected !== null ? 'opacity-30 scale-95' : 'hover:scale-105'} ${revealedVal && selected === idx ? '[transform:rotateY(180deg)_scale(1.1)]' : ''}`}>
            
            <div className={`absolute inset-0 backface-hidden rounded-2xl border flex items-center justify-center bg-[#121214] border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]`}>
              <Icon name="gift" className="text-amber-500/50" />
            </div>

            <div className={`absolute inset-0 backface-hidden rounded-2xl border flex flex-col items-center justify-center bg-amber-500 border-amber-400 [transform:rotateY(180deg)]`}>
              <span className="text-xs font-bold text-amber-950 uppercase tracking-widest">Bônus</span>
              <span className="text-2xl font-bold text-amber-950 mt-1">R$ {revealedVal}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, step }: { title: string, subtitle?: string, step: number }) => (
  <div className="mb-6 flex items-start gap-4">
    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 font-bold shrink-0">{step}</div>
    <div>
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>}
    </div>
  </div>
);

// ==================================================================================
// MAIN APP COMPONENT
// ==================================================================================
export default function App() {
  const [isAdult, setIsAdult] = useState<boolean | null>(null);
  const [giftDone, setGiftDone] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  const [booking, setBooking] = useState({
    cart: [] as any[], extras: {} as Record<string, boolean>, locationType: '',
    name: '', age: '', fetishRequest: '', payment: '', discount: 0,
    address: { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    date: null as Date | null, time: '', manualCoupon: '', manualCouponValue: 0,
    finished: false
  });

  const servicesRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAdult = localStorage.getItem('thaly_adult');
      if (checkAdult === 'yes') {
        setIsAdult(true);
      } else {
        setIsAdult(false);
      }
      
      const hasSeen = localStorage.getItem('thaly_gift_v3');
      if (hasSeen) { 
        setGiftDone(true); 
        setBooking(b => ({ ...b, discount: parseInt(hasSeen) })); 
      }
    }
  }, []);

  const handleAdultConfirm = (valid: boolean) => {
    if (valid) {
      localStorage.setItem('thaly_adult', 'yes');
      setIsAdult(true);
    } else {
      window.location.href = "https://google.com";
    }
  };

  const handleWinGift = (val: number) => {
    localStorage.setItem('thaly_gift_v3', val.toString());
    setBooking(b => ({ ...b, discount: val }));
    setGiftDone(true);
  };

  const handleToggleItem = (item: any) => {
    vibrate(30);
    setBooking(p => {
      const exists = p.cart.find(c => c.id === item.id);
      return { ...p, cart: exists ? p.cart.filter(c => c.id !== item.id) : [...p.cart, item] };
    });
  };

  const handleCep = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(e.target.value);
    setBooking(b => ({...b, address: {...b.address, cep: masked}}));
    
    if (masked.length === 9) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setBooking(b => ({ ...b, address: { ...b.address, street: data.logradouro, district: data.bairro, city: data.localidade }}));
          vibrate([50, 50]);
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
      setBooking(b => ({ ...b, manualCouponValue: couponData.value }));
      vibrate(50);
    } else {
      setBooking(b => ({ ...b, manualCouponValue: 0 }));
      alert("Cupom inválido ou expirado.");
    }
  };

  const financials = useMemo(() => {
    let sub = 0; let duration = 0;
    const isPack = booking.cart.some(i => i.id.startsWith('pack'));
    booking.cart.forEach(item => { sub += item.price; if (!isPack) duration += (item.min || 60); });
    
    if (isPack) duration = 60;
    
    Object.keys(booking.extras).forEach(k => {
      if (booking.extras[k]) { 
        const ex = DATA.extras.find(e => e.id === k); 
        if (ex) { sub += ex.price; if (k === 'more_time') duration += 30; } 
      }
    });

    const fetishFee = booking.fetishRequest.trim().length > 0 ? 130 : 0;
    sub += fetishFee;

    const rushFee = (RUSH_HOURS.includes(booking.time) && booking.locationType !== 'motel') ? RUSH_FEE : 0;
    const totalDiscounts = booking.discount + booking.manualCouponValue;
    
    let running = Math.max(0, sub - totalDiscounts);
    let pixDisc = booking.payment === 'pix' ? Math.ceil(running * 0.03) : 0;
    
    return { sub, rushFee, pixDisc, totalDiscounts, fetishFee, total: Math.max(0, running - pixDisc) + rushFee, duration };
  }, [booking]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) { const y = ref.current.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: y, behavior: 'smooth' }); }
  };

  const currentStepInfo = useMemo(() => {
    if (booking.cart.length === 0) return { label: 'Escolha um serviço', action: () => scrollToRef(servicesRef), ready: false };
    if (!booking.name || !booking.age || !booking.locationType || (booking.locationType === 'home' && !booking.address.street) || (booking.locationType === 'hotel' && !booking.address.placeName)) return { label: 'Preencha seus dados', action: () => scrollToRef(locationRef), ready: false };
    if (!booking.date || !booking.time) return { label: 'Escolha data e horário', action: () => scrollToRef(timeRef), ready: false };
    if (!booking.payment) return { label: 'Selecione o pagamento', action: () => scrollToRef(checkoutRef), ready: false };
    return { label: 'Finalizar e Enviar', action: () => setBooking(b => ({ ...b, finished: true })), ready: true };
  }, [booking]);


  const handleSaveToCalendar = () => {
    if (!booking.date || !booking.time) return;
    
    const d = new Date(booking.date);
    const [h, m] = booking.time.split(':');
    d.setHours(parseInt(h), parseInt(m), 0, 0);
    
    const endD = new Date(d.getTime() + (financials.duration * 60000));
    
    const formatICSDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 15) + 'Z';
    
    const loc = booking.locationType === 'home' 
      ? `${booking.address.street}, ${booking.address.number}` 
      : booking.locationType === 'hotel' ? booking.address.placeName : "Bela Vista, São Paulo";

    const icsString = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Thalyson Massagens//NONSGML v1.0//EN",
      "BEGIN:VEVENT",
      `DTSTART:${formatICSDate(d)}`,
      `DTEND:${formatICSDate(endD)}`,
      "SUMMARY:Sessão - Thalyson Massagens",
      "DESCRIPTION:Momento reservado e sigiloso.",
      `LOCATION:${loc}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sessao-thalyson.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendWhatsApp = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '';
    
    const servicesText = booking.cart.map(item => `▪️ ${item.title}`).join('\n');
    let locTxt = booking.locationType === 'home' 
      ? `🏡 *Casa:* ${booking.address.street}, ${booking.address.number} ${booking.address.comp ? `(${booking.address.comp})` : ''}` 
      : booking.locationType === 'motel' ? `🔑 *Suíte:* Bela Vista` : `🏨 *Hotel:* ${booking.address.placeName} (Qto: ${booking.address.comp || '-'})`; 
    
    const extrasList = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => `➕ ${DATA.extras.find(e=>e.id===k)?.label}`).join('\n');
    
    const fetishText = booking.fetishRequest.trim() ? `\n\n⛓️ *Fetiche / Pedido Especial (+R$ 130,00):*\n"${booking.fetishRequest.trim()}"\n_(Aguardando avaliação do terapeuta)_` : '';
    
    const msg = `*PEDIDO DE SESSÃO*\n\n👤 *Nome:* ${booking.name} (${booking.age} anos)\n📅 *Quando:* ${dateStr} às ${booking.time}\n⏳ *Duração:* ~${f.duration} min\n\n*O que faremos:*\n${servicesText}\n${extrasList ? `\n*Extras:*\n${extrasList}\n` : ''}\n*Onde:* \n${locTxt}${fetishText}\n\n*Pagamento:* ${booking.payment.toUpperCase()}\n💰 *Valor Total:* ${formatMoney(f.total)}\n\n_Estou ciente das regras de higiene e limites da sessão._`;
    
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (isAdult === null) return null;
  if (isAdult === false) return <AgeGateModal onConfirm={handleAdultConfirm} />;
  
  if (!giftDone) return <PremiumGiftReveal onWin={handleWinGift} />;

  if (booking.finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-scale-in">
        <div className="w-24 h-24 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center mb-6 border border-[#25D366]/30"><Icon name="check" size={40} /></div>
        <h2 className="text-3xl font-bold text-white mb-3">Resumo Concluído!</h2>
        <p className="text-zinc-400 text-sm mb-10 max-w-sm leading-relaxed">Sua solicitação está pronta. Para finalizar e garantir nossa discrição, adicione na sua agenda e me envie a mensagem.</p>
        
        <div className="w-full max-w-sm flex flex-col gap-4">
          <button onClick={handleSaveToCalendar} className="w-full bg-white/10 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/20 transition-colors border border-white/20">
            <Icon name="calendar" size={20} /> Salvar no meu Calendário
          </button>

          <button onClick={sendWhatsApp} className="w-full bg-[#25D366] text-black font-bold h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(37,211,102,0.2)]">
            <Icon name="message" size={20} /> Enviar Pedido no WhatsApp
          </button>
        </div>
      </div>
    );
  }

  const days = []; 
  const today = new Date();
  for (let i = 0; i < 30; i++) { 
    const d = new Date(today); 
    d.setDate(today.getDate() + i); 
    days.push(d); 
  }

  const generateTimeSlots = () => {
    if (!booking.date) return [];
    const slots = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) {
      slots.push(`${i < 10 ? '0' : ''}${i}:00`);
    }
    
    const now = new Date();
    if (booking.date.toDateString() === now.toDateString()) {
      return slots.filter(t => parseInt(t.split(':')[0]) > now.getHours());
    }
    return slots;
  };
  const availableTimeSlots = generateTimeSlots();

  return (
    <>
      <GlobalStyles />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 pb-40 flex flex-col gap-14">
        
        <header className="flex justify-end animate-fade-up">
          <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-zinc-400 hover:text-pink-500 transition-colors">
            <Icon name="instagram" size={18} />
          </a>
        </header>

        <section className="animate-fade-up space-y-5 -mt-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-5">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                <img src="https://i.ibb.co/gZxp3Dwz/Screenshot-1.png" alt="Thalyson" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-2 border-[#09090b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse-soft" /> Ativo
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Thalyson Massagens</h1>
            <p className="text-zinc-400 text-sm mb-5 leading-relaxed max-w-sm">Sou eu mesmo quem atende. Um espaço simples na Bela Vista, focado exclusivamente no seu relaxamento.</p>
            
            <div className="flex flex-wrap justify-center gap-2">
              <span className="flex items-center gap-1.5 glass-panel text-xs font-bold text-zinc-300 px-3 py-2 rounded-xl"><Icon name="star" size={14} className="text-amber-500" /> 5.0</span>
              <span className="flex items-center gap-1.5 glass-panel text-xs font-bold text-zinc-300 px-3 py-2 rounded-xl"><Icon name="user-check" size={14} className="text-blue-400" /> 142 Sessões</span>
              <span className="flex items-center gap-1.5 glass-panel text-xs font-bold text-zinc-300 px-3 py-2 rounded-xl"><Icon name="map-pin" size={14} className="text-emerald-400" /> Bela Vista</span>
              <span className="flex items-center gap-1.5 glass-panel text-xs font-bold text-zinc-300 px-3 py-2 rounded-xl"><Icon name="shield" size={14} className="text-purple-400" /> Sigilo Total</span>
            </div>
          </div>
        </section>

        <section ref={servicesRef} className="animate-fade-up">
          <SectionHeader step={1} title="Sessões" subtitle="Leia os detalhes tangíveis e escolha sua experiência." />
          
          <div className="flex gap-2 p-1.5 glass-panel rounded-2xl mb-6 w-full sm:w-fit">
            <button onClick={() => setActiveTab('single')} className={`flex-1 px-6 py-2.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'single' ? 'bg-white text-black' : 'text-zinc-400'}`}>Avulsas</button>
            <button onClick={() => setActiveTab('packs')} className={`flex-1 px-6 py-2.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'packs' ? 'bg-amber-500 text-black' : 'text-zinc-400'}`}>Combos Mensais</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(activeTab === 'single' ? DATA.services : DATA.packs).map(item => {
              const sel = booking.cart.find(c => c.id === item.id);
              return (
                <div key={item.id} onClick={() => handleToggleItem(item)} className={`p-5 sm:p-6 rounded-3xl border transition-all cursor-pointer flex flex-col ${sel ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_4px_20px_rgba(251,191,36,0.1)]' : 'glass-panel hover:border-white/20'}`}>
                  
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${sel ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'}`}>
                      <Icon name={item.icon} size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block truncate">{item.tag}</span>
                        {sel && <Icon name="check" size={20} className="text-amber-500 shrink-0" />}
                      </div>
                      <h3 className="text-white font-bold text-xl mb-1 leading-tight">{item.title}</h3>
                      <p className="text-zinc-400 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>

                  {'details' in item && (
                    <div className="mt-3 mb-5 space-y-2 pl-[4.25rem]">
                      {(item.details as string[]).map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span className="leading-relaxed">{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end justify-between mt-2 pt-4 border-t border-white/5 pl-[4.25rem]">
                    <span className="text-xs text-zinc-500 font-bold">Aprox. {item.min || 60} min</span>
                    <div className="text-right">
                      {item.fullPrice && <span className="text-xs text-zinc-500 line-through block mb-0.5">{formatMoney(item.fullPrice)}</span>}
                      <span className="text-white font-bold text-xl">{formatMoney(item.price)}</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </section>

        <section ref={reviewsRef} className="animate-fade-up py-6 border-y border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Relatos de quem já veio</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pb-4">
            {DATA.reviews.map((r, i) => (
              <div key={i} className="snap-center shrink-0 w-[280px] glass-panel p-5 rounded-3xl flex flex-col h-auto">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm text-white shrink-0">{r.n.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{r.n}</p>
                    <p className="text-xs text-zinc-500">{r.loc}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, idx) => <Icon key={idx} name="star" size={12} className="text-amber-500 fill-amber-500" />)}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed italic">"{r.t}"</p>
              </div>
            ))}
          </div>
        </section>

        <section ref={locationRef} className={`transition-opacity duration-500 ${booking.cart.length ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={2} title="Local e Identificação" subtitle="Apenas para saber como te chamar." />
          
          <div className="glass-panel p-5 sm:p-8 rounded-3xl space-y-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 block pl-1">Nome ou Apelido</label>
                <input type="text" value={booking.name} onChange={(e) => setBooking(b => ({...b, name: e.target.value}))} className="w-full h-14 rounded-xl px-4 input-premium text-sm" placeholder="Manteremos sigilo" />
              </div>
              <div className="w-24 shrink-0">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 block pl-1">Idade</label>
                <input type="tel" maxLength={2} value={booking.age} onChange={(e) => setBooking(b => ({...b, age: e.target.value.replace(/\D/g,'')}))} className="w-full h-14 rounded-xl px-4 input-premium text-sm text-center" placeholder="18+" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 block pl-1">Onde vamos nos encontrar?</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                {[{id: 'motel', label: 'Minha Suíte'}, {id: 'home', label: 'Na sua Casa'}, {id: 'hotel', label: 'Em Hotel'}].map(l => (
                  <button key={l.id} onClick={() => setBooking(b => ({...b, locationType: l.id}))} className={`py-4 px-1 sm:px-2 text-[10px] sm:text-xs font-bold rounded-2xl border transition-colors flex flex-col items-center justify-center text-center ${booking.locationType === l.id ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                    {l.label}
                  </button>
                ))}
              </div>

              {booking.locationType === 'motel' && <p className="text-xs text-amber-500 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 font-medium leading-relaxed">Você virá até meu espaço na Bela Vista (próximo à Av. Paulista). O endereço exato é enviado pelo WhatsApp após finalizarmos.</p>}
              
              {booking.locationType === 'home' && (
                <div className="space-y-3 animate-fade-up">
                  <div className="relative">
                    <input type="tel" maxLength={9} placeholder="CEP" value={booking.address.cep} onChange={handleCep} className="w-full h-14 rounded-xl px-4 input-premium text-sm" />
                    {isLoadingCep && <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />}
                  </div>
                  <input type="text" placeholder="Rua / Avenida" value={booking.address.street} onChange={(e) => setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} className="w-full h-14 rounded-xl px-4 input-premium text-sm" disabled={isLoadingCep} />
                  <div className="flex gap-3">
                    <input type="tel" placeholder="Número" value={booking.address.number} onChange={(e) => setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} className="w-1/3 h-14 rounded-xl px-4 input-premium text-sm" />
                    <input type="text" placeholder="Apto / Bloco" value={booking.address.comp} onChange={(e) => setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} className="w-2/3 h-14 rounded-xl px-4 input-premium text-sm" />
                  </div>
                  <input type="text" placeholder="Bairro" value={booking.address.district} onChange={(e) => setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} className="w-full h-14 rounded-xl px-4 input-premium text-sm" disabled={isLoadingCep} />
                </div>
              )}

              {booking.locationType === 'hotel' && (
                <div className="space-y-3 animate-fade-up">
                  <input type="text" placeholder="Nome do Hotel" value={booking.address.placeName} onChange={(e) => setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} className="w-full h-14 rounded-xl px-4 input-premium text-sm" />
                  <input type="text" placeholder="Quarto / Suíte" value={booking.address.comp} onChange={(e) => setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} className="w-full h-14 rounded-xl px-4 input-premium text-sm" />
                </div>
              )}
            </div>
          </div>
        </section>

        <section ref={timeRef} className={`transition-opacity duration-500 ${booking.locationType && booking.name && booking.age ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={3} title="Data e Horário" subtitle="Trabalho todos os dias, das 09h às 22h." />
          
          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
            {days.map((d, i) => {
              const sel = booking.date?.toDateString() === d.toDateString();
              return (
                <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: '' }))} className={`snap-center shrink-0 w-[72px] h-[88px] rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${sel ? 'bg-amber-500 border-amber-500 text-black scale-105 shadow-[0_4px_15px_rgba(251,191,36,0.3)]' : 'glass-panel text-zinc-400 hover:bg-white/10'}`}>
                  <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}</span>
                  <span className="text-2xl font-bold leading-none">{d.getDate()}</span>
                </button>
              );
            })}
          </div>

          {booking.date && (
            <div className="grid grid-cols-4 gap-3 animate-fade-up">
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map(t => {
                  const sel = booking.time === t;
                  const isRush = RUSH_HOURS.includes(t) && booking.locationType !== 'motel';
                  return (
                    <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))} className={`h-14 rounded-xl text-sm font-bold border transition-colors relative flex items-center justify-center ${sel ? 'bg-amber-500 border-amber-500 text-black' : 'glass-panel text-zinc-300 hover:bg-white/10'}`}>
                      {t}
                      {isRush && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-4 p-4 text-center text-zinc-500 text-sm glass-panel rounded-xl">Nenhum horário disponível para hoje.</div>
              )}
            </div>
          )}
        </section>

        <section ref={checkoutRef} className={`transition-opacity duration-500 ${booking.time ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={4} title="Extras e Pagamento" subtitle="O acerto é feito no local, após a sessão." />
          
          <div className="glass-panel p-5 sm:p-8 rounded-3xl space-y-6">
            
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 pl-1">Adicionais (Opcional)</p>
              <div className="space-y-3">
                {DATA.extras.map(ex => {
                  const sel = booking.extras[ex.id];
                  return (
                    <button key={ex.id} onClick={() => setBooking(b => ({...b, extras: {...b.extras, [ex.id]: !sel}}))} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${sel ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/10'}`}>
                      <span className={`text-sm font-bold ${sel ? 'text-amber-500' : 'text-zinc-300'}`}>{ex.label}</span>
                      <span className="text-xs font-bold text-zinc-500">+{formatMoney(ex.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 pl-1">Fetiches / Pedidos Especiais</p>
                <span className="text-xs font-bold text-amber-500">+ R$ 130,00</span>
              </div>
              <p className="text-xs text-zinc-400 mb-3 pl-1 leading-relaxed">Sujeito a avaliação. Descreva o que deseja. Se não for aceito no momento do atendimento, esse valor não será cobrado.</p>
              <textarea 
                value={booking.fetishRequest} 
                onChange={(e) => setBooking(b => ({ ...b, fetishRequest: e.target.value }))}
                placeholder="Descreva seu pedido ou fetiche com clareza..." 
                className="w-full p-4 rounded-2xl input-premium text-sm min-h-[100px] resize-none"
              />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 pl-1">Possui um Cupom?</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={booking.manualCoupon} 
                  onChange={(e) => setBooking(b => ({ ...b, manualCoupon: e.target.value }))}
                  placeholder="Digite o código" 
                  className="flex-1 h-12 rounded-xl px-4 input-premium text-sm uppercase"
                  disabled={booking.manualCouponValue > 0}
                />
                <button 
                  onClick={booking.manualCouponValue > 0 ? () => setBooking(b => ({ ...b, manualCouponValue: 0, manualCoupon: '' })) : handleApplyCoupon}
                  className={`h-12 px-5 rounded-xl font-bold text-xs transition-colors ${booking.manualCouponValue > 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {booking.manualCouponValue > 0 ? 'Remover' : 'Aplicar'}
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 pl-1">Como vai pagar no local?</p>
              <div className="flex gap-2 sm:gap-3">
                {[{id: 'pix', label: 'Pix (-3%)'}, {id: 'card', label: 'Cartão'}, {id: 'cash', label: 'Dinheiro'}].map(p => (
                  <button key={p.id} onClick={() => setBooking(b => ({...b, payment: p.id}))} className={`flex-1 h-12 rounded-xl text-xs font-bold border transition-colors ${booking.payment === p.id ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-zinc-400'}`}>{p.label}</button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm text-zinc-400 mb-2"><span>Subtotal</span><span>{formatMoney(financials.sub - financials.fetishFee)}</span></div>
              
              {financials.fetishFee > 0 && <div className="flex justify-between text-sm text-zinc-400 mb-2"><span>Pedido / Fetiche</span><span>+{formatMoney(financials.fetishFee)}</span></div>}
              
              {booking.discount > 0 && <div className="flex justify-between text-sm text-amber-500 mb-2"><span>Cortesia (Boas Vindas)</span><span>-{formatMoney(booking.discount)}</span></div>}
              {booking.manualCouponValue > 0 && <div className="flex justify-between text-sm text-amber-500 mb-2"><span>Cupom Aplicado</span><span>-{formatMoney(booking.manualCouponValue)}</span></div>}
              
              {financials.rushFee > 0 && <div className="flex justify-between text-sm text-zinc-400 mb-2"><span>Taxa de Pico (Deslocamento)</span><span>+{formatMoney(financials.rushFee)}</span></div>}
              {financials.pixDisc > 0 && <div className="flex justify-between text-sm text-emerald-400 mb-2"><span>Desconto Pix</span><span>-{formatMoney(financials.pixDisc)}</span></div>}
              
              <div className="flex justify-between items-center mt-6">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-3xl font-bold text-amber-500 tracking-tight">{formatMoney(financials.total)}</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-[#121214] border-t border-white/5 py-10 pb-36 text-center text-zinc-500 text-xs mt-auto">
        <div className="max-w-xl mx-auto px-6">
          <p className="font-bold text-white mb-2">Thalyson Massagens</p>
          <p className="mb-4 leading-relaxed">Atendimento exclusivo, discreto e focado no bem-estar masculino. Não realizamos serviços ilegais ou que desrespeitem nossos termos de uso e higiene.</p>
          <p>© {new Date().getFullYear()} Thalyson Massagens. Bela Vista, SP.</p>
        </div>
      </footer>

      <div className="fixed bottom-0 inset-x-0 p-4 sm:p-6 z-40 bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent pt-12 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <button onClick={currentStepInfo.action} className={`w-full h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-2xl ${currentStepInfo.ready ? 'bg-amber-500 text-black hover:bg-amber-400 hover:scale-[1.02]' : 'glass-panel text-white hover:bg-white/10'}`}>
            {currentStepInfo.label}
            {!currentStepInfo.ready ? <Icon name="arrow-down" size={18} /> : <Icon name="check" size={18} />}
          </button>
        </div>
      </div>
    </>
  );
}
