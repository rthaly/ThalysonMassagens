import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// DESIGN TOKENS & CONFIG
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/relaxarhojesp",
  THERAPIST_EMAIL: "thalysonrd@gmail.com",
  STORAGE_KEY: '@thaly_premium_flow_v1',
  PIX_KEY: "62.922.530/0001-14",
  START_HOUR: 9,
  END_HOUR: 22,
};

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const RUSH_FEE = 15;

const ICON_PATHS: Record<string, string> = {
  'menu': 'M4 12h16 M4 6h16 M4 18h16',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'chevron-down': 'M6 9l6 6 6-6',
  'x': 'M18 6L6 18M6 6l12 12',
  'check': 'M20 6L9 17l-5-5',
  'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01',
  'share': 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4',
  'sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'package': 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  'user': 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  'bed': 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
  'building': 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'calendar-plus': 'M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8 M16 2v4 M8 2v4 M3 10h18 M19 16v6 M16 19h6',
  'smartphone': 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'credit-card': 'M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  'banknote': 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'message-circle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'arrow-down': 'M12 5v14 M19 12l-7 7-7-7',
};

// ==================================================================================
// GLOBAL STYLES (Plus Jakarta Sans para exclusividade e legibilidade)
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
    @keyframes cardFlip { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(180deg); } }
    
    .animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

    .glass-panel { background: rgba(18, 18, 20, 0.7); backdrop-filter: blur(12px); border: 1px solid var(--c-border); }
    .premium-shadow { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5); }
    
    .input-premium {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white; transition: all 0.2s;
    }
    .input-premium:focus { border-color: var(--c-accent); background: rgba(255,255,255,0.05); outline: none; }
  `}} />
));

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICON_PATHS[name] || ''} /></svg>
));

const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 50) => { try { if (navigator?.vibrate) navigator.vibrate(pattern); } catch(e){} };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

// ==================================================================================
// DATA SOURCE
// ==================================================================================
const DATA = {
  services: [
    { id: 'pes', min: 40, price: 110, icon: "user-check", tag: "ALÍVIO RÁPIDO", title: "Reflexologia Podal", desc: "Alívio focado nos pés cansados após um longo dia." },
    { id: 'relaxante', min: 40, price: 180, icon: "user-check", tag: "ALÍVIO MUSCULAR", title: "Massagem Clássica", desc: "Massagem no corpo todo focada em tirar dores e destravar músculos. Apenas terapêutica." },
    { id: 'sensitiva', min: 60, price: 200, icon: "sparkles", tag: "DESPERTAR", title: "Massagem Sensitiva", desc: "Clássica para dores, seguida de toques sutis pelo corpo. Finalização tântrica manual para relaxar a mente." },
    { id: 'mista', min: 60, price: 250, icon: "zap", tag: "PELE A PELE", title: "Experiência Fusion", desc: "O equilíbrio perfeito. Massagem para dores e depois muito contato físico (atendo de cueca) com finalização intensa." },
    { id: 'reversa', min: 60, price: 400, icon: "zap", tag: "SEU CONTROLE", title: "Massagem Reversa", desc: "Começo tirando suas tensões. Depois, você assume o controle do ritmo da sessão." },
    { id: 'nuru', min: 60, price: 350, icon: "star", popular: true, tag: "PREMIUM", title: "Massagem Nuru (Gel)", desc: "A mais pedida. Muito gel, contato fluido de corpo todo e relaxamento extremo no ápice." },
    { id: 'depilacao', min: 60, price: 107, icon: "scissors", tag: "ESTÉTICA", title: "Aparo de Pelos", desc: "Estética e higiene com máquina (pente 0 e 3)." }
  ],
  packs: [
    { id: 'pack_classic4', price: 576, fullPrice: 720, icon: "calendar-plus", tag: "MENSAL", title: "Mês Sem Dor (4x)", desc: "Quatro sessões de massagem clássica no mês." },
    { id: 'pack_tantric', price: 640, fullPrice: 800, icon: "heart", tag: "IMERSÃO", title: "Jornada Tântrica (3x)", desc: "Três encontros escalando o nível de intimidade (Sensitiva, Fusion, Nuru)." }
  ],
  extras: [
    { id: 'more_time', price: 77, label: "Estender tempo (+30 Min)" },
    { id: 'aroma', price: 17, label: "Aromaterapia Relaxante" }
  ]
};

// ==================================================================================
// COMPONENTS
// ==================================================================================

// Presente Premium ao invés de Roleta
const PremiumGiftReveal = ({ onWin }: { onWin: (val: number) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealedVal, setRevealedVal] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    vibrate([50, 50]);
    setSelected(idx);
    // Maior chance para 20
    const chances = [20, 20, 20, 20, 15, 10]; 
    const prize = chances[Math.floor(Math.random() * chances.length)];
    
    setTimeout(() => {
      setRevealedVal(prize);
      vibrate([100, 50, 200]);
      setTimeout(() => onWin(prize), 2500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-white mb-2">Um presente para você</h2>
        <p className="text-zinc-400 text-sm">Escolha um cartão para liberar sua cortesia de boas-vindas.</p>
      </div>
      <div className="flex gap-4">
        {[0, 1, 2].map((idx) => (
          <button key={idx} onClick={() => handleSelect(idx)} disabled={selected !== null}
            className={`relative w-24 h-36 rounded-2xl border transition-all duration-700 preserve-3d ${selected === idx ? 'scale-110' : selected !== null ? 'opacity-30 scale-95' : 'hover:scale-105'} ${revealedVal && selected === idx ? '[transform:rotateY(180deg)_scale(1.1)]' : ''}`}>
            
            {/* Frente (Verso do cartão) */}
            <div className={`absolute inset-0 backface-hidden rounded-2xl border flex items-center justify-center bg-[#121214] border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]`}>
              <Icon name="gift" className="text-amber-500/50" />
            </div>

            {/* Verso (Resultado) */}
            <div className={`absolute inset-0 backface-hidden rounded-2xl border flex flex-col items-center justify-center bg-amber-500 border-amber-400 [transform:rotateY(180deg)]`}>
              <span className="text-xs font-bold text-amber-950 uppercase tracking-widest">Bônus</span>
              <span className="text-2xl font-bold text-amber-950">R$ {revealedVal}</span>
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
  const [giftDone, setGiftDone] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const [booking, setBooking] = useState({
    cart: [] as any[], extras: {} as any, locationType: '',
    address: { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    date: null as Date | null, time: '', name: '', payment: '', discount: 0
  });

  // Refs para rolagem
  const servicesRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeen = localStorage.getItem('thaly_gift');
    if (hasSeen) { setGiftDone(true); setBooking(b => ({ ...b, discount: parseInt(hasSeen) })); }
  }, []);

  const handleWinGift = (val: number) => {
    localStorage.setItem('thaly_gift', val.toString());
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

  const financials = useMemo(() => {
    let sub = 0; let duration = 0;
    const isPack = booking.cart.some(i => i.id.startsWith('pack'));
    booking.cart.forEach(item => { sub += item.price; if (!isPack) duration += (item.min || 60); });
    if (isPack) duration = 60;
    Object.keys(booking.extras).forEach(k => {
      if (booking.extras[k]) { const ex = DATA.extras.find(e => e.id === k); if (ex) { sub += ex.price; if (k === 'more_time') duration += 30; } }
    });
    const rushFee = (RUSH_HOURS.includes(booking.time) && booking.locationType !== 'motel') ? RUSH_FEE : 0;
    let running = Math.max(0, sub - booking.discount);
    let pixDisc = booking.payment === 'pix' ? Math.ceil(running * 0.03) : 0;
    return { sub, rushFee, pixDisc, total: Math.max(0, running - pixDisc) + rushFee, duration };
  }, [booking]);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) { const y = ref.current.getBoundingClientRect().top + window.scrollY - 80; window.scrollTo({ top: y, behavior: 'smooth' }); }
  };

  const currentStepInfo = useMemo(() => {
    if (booking.cart.length === 0) return { label: 'Escolha um serviço', action: () => scrollToRef(servicesRef), ready: false };
    if (!booking.name || !booking.locationType || (booking.locationType === 'home' && !booking.address.street) || (booking.locationType === 'hotel' && !booking.address.placeName)) return { label: 'Preencha seus dados', action: () => scrollToRef(locationRef), ready: false };
    if (!booking.date || !booking.time) return { label: 'Escolha data e horário', action: () => scrollToRef(timeRef), ready: false };
    if (!booking.payment) return { label: 'Selecione o pagamento', action: () => scrollToRef(checkoutRef), ready: false };
    return { label: 'Confirmar Agendamento', action: () => setBooking(b => ({ ...b, finished: true })), ready: true };
  }, [booking]);

  // Deep Link do Google Calendar (Abre o App Nativo)
  const openCalendarApp = () => {
    if (!booking.date || !booking.time) return;
    const d = new Date(booking.date);
    const [h, m] = booking.time.split(':');
    d.setHours(parseInt(h), parseInt(m), 0, 0);
    const endD = new Date(d.getTime() + (financials.duration * 60000));
    
    const fmt = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 15) + 'Z';
    
    let loc = "A combinar";
    if (booking.locationType === 'home') loc = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}`;
    else if (booking.locationType === 'hotel') loc = booking.address.placeName;
    else if (booking.locationType === 'motel') loc = "Bela Vista, São Paulo (Suíte Privada)";

    const link = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Sessão de Relaxamento - Thalyson')}&dates=${fmt(d)}/${fmt(endD)}&details=${encodeURIComponent('Seu momento de cuidado e sigilo.')}&location=${encodeURIComponent(loc)}&add=${encodeURIComponent(CONFIG.THERAPIST_EMAIL)}`;
    
    window.open(link, '_blank');
  };

  const sendWhatsApp = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '';
    const servicesText = booking.cart.map(item => `▪️ ${item.title}`).join('\n');
    let locTxt = booking.locationType === 'home' ? `🏡 *Casa:* ${booking.address.street}, ${booking.address.number}` : booking.locationType === 'motel' ? `🔑 *Suíte:* Bela Vista (Aguardando local exato)` : `🏨 *Hotel:* ${booking.address.placeName}`; 
    const extrasList = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => `➕ ${DATA.extras.find(e=>e.id===k)?.label}`).join('\n');
    
    const msg = `*RESERVA DE SESSÃO*\n\n👤 *Nome:* ${booking.name}\n📅 *Data:* ${dateStr} às ${booking.time}\n⏳ *Duração:* ~${f.duration} min\n\n*Serviços:*\n${servicesText}\n${extrasList ? `\n*Extras:*\n${extrasList}\n` : ''}\n*Local:*\n${locTxt}\n\n*Pagamento:* ${booking.payment.toUpperCase()}\n*Total:* ${formatMoney(f.total)}\n\n_Estou ciente que é um atendimento individual na Bela Vista, focado no relaxamento (sem ato sexual)._`;
    
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!giftDone) return <PremiumGiftReveal onWin={handleWinGift} />;

  // TELA DE SUCESSO (FINALIZADO)
  if ((booking as any).finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-scale-in">
        <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6"><Icon name="check" size={32} /></div>
        <h2 className="text-3xl font-bold text-white mb-2">Tudo quase pronto!</h2>
        <p className="text-zinc-400 text-sm mb-8 max-w-sm">Para garantir o sigilo e segurar sua vaga, me envie os dados no WhatsApp e já adicione na sua agenda.</p>
        
        <div className="w-full max-w-sm space-y-4">
          <button onClick={sendWhatsApp} className="w-full bg-[#25D366] text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 transition-colors">
            <Icon name="message" size={20} /> Confirmar no WhatsApp
          </button>
          
          <button onClick={openCalendarApp} className="w-full glass-panel text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            <Icon name="calendar-plus" size={20} /> Abrir Aplicativo de Agenda
          </button>
        </div>
      </div>
    );
  }

  // GERADOR DE DIAS
  const days = []; const today = new Date();
  for (let i = 0; i < 30; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }
  const timeSlots = []; for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) timeSlots.push(`${i < 10 ? '0' : ''}${i}:00`);

  return (
    <>
      <GlobalStyles />
      
      {/* Botão flutuante WhatsApp (ocultável) */}
      <div className="fixed bottom-28 right-4 z-40">
        <button onClick={() => window.open(`https://wa.me/${CONFIG.PHONE}`, '_blank')} className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,211,102,0.3)]">
          <Icon name="message-circle" className="text-white" size={28} />
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-12 pb-40 flex flex-col gap-16">
        
        {/* HERO SECTION */}
        <section className="animate-fade-up text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-white/10 mb-4">
            <img src="https://i.ibb.co/gZxp3Dwz/Screenshot-1.png" alt="Thalyson" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Thalyson</h1>
          <p className="text-amber-500 font-bold text-xs uppercase tracking-widest">Atendimento Exclusivo • Bela Vista</p>
          <p className="text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">Sou apenas eu, um atendimento simples, focado no seu relaxamento e alívio da rotina. Sessões de até 60 minutos com total sigilo.</p>
        </section>

        {/* 1. SERVIÇOS */}
        <section ref={servicesRef} className="animate-fade-up">
          <SectionHeader step={1} title="Escolha sua experiência" subtitle="Selecione os cuidados que você precisa hoje." />
          
          <div className="flex gap-2 p-1.5 glass-panel rounded-2xl mb-6 w-full sm:w-fit">
            <button onClick={() => setActiveTab('single')} className={`flex-1 px-6 py-2.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'single' ? 'bg-white text-black' : 'text-zinc-400'}`}>Sessões</button>
            <button onClick={() => setActiveTab('packs')} className={`flex-1 px-6 py-2.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'packs' ? 'bg-amber-500 text-black' : 'text-zinc-400'}`}>Combos Mensais</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(activeTab === 'single' ? DATA.services : DATA.packs).map(item => {
              const sel = booking.cart.find(c => c.id === item.id);
              return (
                <div key={item.id} onClick={() => handleToggleItem(item)} className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col ${sel ? 'bg-amber-500/10 border-amber-500/50' : 'glass-panel hover:border-white/20'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sel ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'}`}><Icon name={item.icon} size={20} /></div>
                    {sel && <div className="text-amber-500"><Icon name="check" size={20} /></div>}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-zinc-400 text-xs mb-4 flex-1 line-clamp-2">{item.desc}</p>
                  <div className="flex items-end justify-between mt-auto">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800 px-2 py-1 rounded-md">{item.tag}</span>
                    <span className="text-white font-bold text-lg">{formatMoney(item.price)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 2. LOCAL & DADOS */}
        <section ref={locationRef} className={`transition-opacity duration-500 ${booking.cart.length ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={2} title="Onde e quem?" subtitle="Garantimos sigilo absoluto." />
          
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block pl-1">Seu Nome ou Apelido</label>
              <input type="text" value={booking.name} onChange={(e) => setBooking(b => ({...b, name: e.target.value}))} className="w-full h-14 rounded-xl px-4 input-premium" placeholder="Como quer ser chamado?" />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 mb-3 block pl-1">Local do Encontro</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[{id: 'motel', label: 'Minha Suíte'}, {id: 'home', label: 'Sua Casa'}, {id: 'hotel', label: 'Hotel'}].map(l => (
                  <button key={l.id} onClick={() => setBooking(b => ({...b, locationType: l.id}))} className={`py-3 px-2 text-xs font-bold rounded-xl border transition-colors ${booking.locationType === l.id ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-zinc-400'}`}>{l.label}</button>
                ))}
              </div>

              {booking.locationType === 'motel' && <p className="text-xs text-amber-500 bg-amber-500/10 p-3 rounded-xl">Atendo em um apartamento alugado na Bela Vista. O endereço exato envio após a confirmação.</p>}
              
              {booking.locationType === 'home' && (
                <div className="space-y-3 animate-fade-up">
                  <input type="text" placeholder="CEP" value={booking.address.cep} onChange={(e) => setBooking(b=>({...b, address: {...b.address, cep: maskCEP(e.target.value)}}))} className="w-full h-14 rounded-xl px-4 input-premium" />
                  <input type="text" placeholder="Rua / Avenida" value={booking.address.street} onChange={(e) => setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} className="w-full h-14 rounded-xl px-4 input-premium" />
                  <div className="flex gap-3">
                    <input type="text" placeholder="Número" value={booking.address.number} onChange={(e) => setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} className="w-1/3 h-14 rounded-xl px-4 input-premium" />
                    <input type="text" placeholder="Bairro" value={booking.address.district} onChange={(e) => setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} className="w-2/3 h-14 rounded-xl px-4 input-premium" />
                  </div>
                </div>
              )}

              {booking.locationType === 'hotel' && (
                <div className="space-y-3 animate-fade-up">
                  <input type="text" placeholder="Nome do Hotel" value={booking.address.placeName} onChange={(e) => setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} className="w-full h-14 rounded-xl px-4 input-premium" />
                  <input type="text" placeholder="Quarto / Suíte" value={booking.address.comp} onChange={(e) => setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} className="w-full h-14 rounded-xl px-4 input-premium" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={timeRef} className={`transition-opacity duration-500 ${booking.locationType && booking.name ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={3} title="Quando nos vemos?" subtitle="Selecione sua preferência." />
          
          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            {days.map((d, i) => {
              const sel = booking.date?.toDateString() === d.toDateString();
              return (
                <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: '' }))} className={`snap-center shrink-0 w-[72px] py-4 rounded-2xl border flex flex-col items-center gap-1 transition-all ${sel ? 'bg-amber-500 border-amber-500 text-black scale-105' : 'glass-panel text-zinc-400 hover:bg-white/10'}`}>
                  <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}</span>
                  <span className="text-2xl font-bold">{d.getDate()}</span>
                </button>
              );
            })}
          </div>

          {booking.date && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 animate-fade-up">
              {timeSlots.map(t => {
                const sel = booking.time === t;
                const isRush = RUSH_HOURS.includes(t) && booking.locationType !== 'motel';
                return (
                  <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))} className={`h-12 rounded-xl text-sm font-bold border transition-colors relative flex items-center justify-center ${sel ? 'bg-amber-500 border-amber-500 text-black' : 'glass-panel text-zinc-300 hover:bg-white/10'}`}>
                    {t}
                    {isRush && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full" />}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. EXTRAS E PAGAMENTO */}
        <section ref={checkoutRef} className={`transition-opacity duration-500 ${booking.time ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={4} title="Finalização" subtitle="Extras e pagamento (feito no local)." />
          
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500 mb-3 pl-1">Deseja algo a mais?</p>
              <div className="space-y-3">
                {DATA.extras.map(ex => {
                  const sel = booking.extras[ex.id];
                  return (
                    <button key={ex.id} onClick={() => setBooking(b => ({...b, extras: {...b.extras, [ex.id]: !sel}}))} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${sel ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white/5 border-white/10'}`}>
                      <span className={`text-sm font-bold ${sel ? 'text-amber-500' : 'text-zinc-300'}`}>{ex.label}</span>
                      <span className="text-xs font-bold text-zinc-500">+{formatMoney(ex.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-zinc-500 mb-3 pl-1">Forma de Pagamento</p>
              <div className="flex gap-3">
                {[{id: 'pix', label: 'Pix (-3%)'}, {id: 'card', label: 'Cartão'}, {id: 'cash', label: 'Dinheiro'}].map(p => (
                  <button key={p.id} onClick={() => setBooking(b => ({...b, payment: p.id}))} className={`flex-1 h-12 rounded-xl text-xs font-bold border transition-colors ${booking.payment === p.id ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-zinc-400'}`}>{p.label}</button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm text-zinc-400 mb-2"><span>Subtotal</span><span>{formatMoney(financials.sub)}</span></div>
              {booking.discount > 0 && <div className="flex justify-between text-sm text-amber-500 mb-2"><span>Bônus (Presente)</span><span>-{formatMoney(booking.discount)}</span></div>}
              {financials.rushFee > 0 && <div className="flex justify-between text-sm text-zinc-400 mb-2"><span>Taxa Deslocamento/Pico</span><span>+{formatMoney(financials.rushFee)}</span></div>}
              {financials.pixDisc > 0 && <div className="flex justify-between text-sm text-emerald-400 mb-2"><span>Desconto Pix</span><span>-{formatMoney(financials.pixDisc)}</span></div>}
              <div className="flex justify-between items-center mt-4">
                <span className="text-white font-bold">Investimento</span>
                <span className="text-2xl font-bold text-amber-500">{formatMoney(financials.total)}</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* BOTTOM STICKY BAR */}
      <div className="fixed bottom-0 inset-x-0 p-4 z-40">
        <div className="max-w-2xl mx-auto">
          <button onClick={currentStepInfo.action} className={`w-full h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-2xl ${currentStepInfo.ready ? 'bg-amber-500 text-black hover:bg-amber-400' : 'glass-panel text-white hover:bg-white/10'}`}>
            {currentStepInfo.label}
            {!currentStepInfo.ready ? <Icon name="arrow-down" size={18} /> : <Icon name="check" size={18} />}
          </button>
        </div>
      </div>
    </>
  );
}
