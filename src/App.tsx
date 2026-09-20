import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

// ==================================================================================
// DESIGN TOKENS & CONFIG
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  THERAPIST_EMAIL: "thalysonrd@gmail.com",
  START_HOUR: 9,
  END_HOUR: 22,
};

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const RUSH_FEE = 15;

const ICON_PATHS: Record<string, string> = {
  'check': 'M20 6L9 17l-5-5',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4',
  'sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'arrow-down': 'M12 5v14 M19 12l-7 7-7-7',
  'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
};

// ==================================================================================
// GLOBAL STYLES (Plus Jakarta Sans)
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
    
    .animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

    .glass-panel { background: rgba(18, 18, 20, 0.6); backdrop-filter: blur(16px); border: 1px solid var(--c-border); }
    
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
// DATA SOURCE (ORDENADOS DO MAIS BARATO PARA O MAIS CARO)
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
      id: 'mista', min: 60, price: 250, icon: "zap", tag: "PELE A PELE", title: "Experiência Fusion", 
      desc: "Contato físico intenso, corpo a corpo.",
      details: ["Atendo apenas de cueca, garantindo contato físico direto", "Deslizo meu corpo e passo minha barba em você (frente e costas)", "Nível alto de intimidade, com finalização manual intensa."]
    },
    { 
      id: 'nuru', min: 60, price: 350, icon: "star", popular: true, tag: "PREMIUM", title: "Massagem Nuru (Gel)", 
      desc: "A mais pedida. Deslizamento total de corpos.",
      details: ["Nós dois sem roupas do início ao fim", "Muito gel especial ultra deslizante sobre a pele", "Contato super fluido corpo a corpo (frente e costas)", "Estímulo intenso terminando em uma liberação profunda."]
    },
    { 
      id: 'reversa', min: 60, price: 400, icon: "zap", tag: "SEU CONTROLE", title: "Massagem Reversa", 
      desc: "Você assume o comando da sessão.",
      details: ["Eu começo a massagem relaxando o seu corpo", "Depois, o controle passa para você", "Você dita o ritmo, os toques e a intensidade", "Finalização mútua e libertadora."]
    }
  ],
  packs: [
    { id: 'pack_classic4', price: 576, fullPrice: 720, icon: "calendar", tag: "MENSAL", title: "Mês Sem Dor (4x)", desc: "4 sessões de massagem clássica no mês (1x por semana) focadas na sua saúde muscular." },
    { id: 'pack_tantric', price: 640, fullPrice: 800, icon: "heart", tag: "IMERSÃO", title: "Jornada Tântrica (3x)", desc: "3 encontros escalando a intimidade: 1 Sensitiva, 1 Fusion e 1 Nuru com gel." }
  ],
  extras: [
    { id: 'more_time', price: 77, label: "Estender tempo (+30 Minutos)" },
    { id: 'aroma', price: 17, label: "Aromaterapia Relaxante" }
  ]
};

// ==================================================================================
// COMPONENTS
// ==================================================================================

// Sistema de Presentes Premium (Cartões)
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#09090b]/95 backdrop-blur-md animate-fade-in">
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
  const [giftDone, setGiftDone] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const [booking, setBooking] = useState({
    cart: [] as any[], extras: {} as any, locationType: '',
    address: { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    date: null as Date | null, time: '', name: '', payment: '', discount: 0
  });

  const servicesRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasSeen = localStorage.getItem('thaly_gift_v2');
    if (hasSeen) { setGiftDone(true); setBooking(b => ({ ...b, discount: parseInt(hasSeen) })); }
  }, []);

  const handleWinGift = (val: number) => {
    localStorage.setItem('thaly_gift_v2', val.toString());
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
    return { label: 'Finalizar e Enviar', action: () => setBooking(b => ({ ...b, finished: true })), ready: true };
  }, [booking]);

  // Envio WhatsApp + Link do Google Calendar
  const sendWhatsApp = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '';
    
    // Gerador de Link do Google Calendar (Embutido no ZAP)
    let calendarLink = "";
    if (booking.date && booking.time) {
      const d = new Date(booking.date);
      const [h, m] = booking.time.split(':');
      d.setHours(parseInt(h), parseInt(m), 0, 0);
      const endD = new Date(d.getTime() + (f.duration * 60000));
      const fmt = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 15) + 'Z';
      
      let loc = booking.locationType === 'home' ? `${booking.address.street}, ${booking.address.number}` : booking.locationType === 'hotel' ? booking.address.placeName : "Bela Vista, São Paulo";
      calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Sessão - Thalyson Massagens')}&dates=${fmt(d)}/${fmt(endD)}&details=${encodeURIComponent('Momento de relaxamento e cuidado. Total sigilo.')}&location=${encodeURIComponent(loc)}&add=${encodeURIComponent(CONFIG.THERAPIST_EMAIL)}`;
    }

    const servicesText = booking.cart.map(item => `▪️ ${item.title}`).join('\n');
    let locTxt = booking.locationType === 'home' ? `🏡 *Sua Casa:* ${booking.address.street}, ${booking.address.number}` : booking.locationType === 'motel' ? `🔑 *Minha Suíte:* Bela Vista (Aguardando local exato)` : `🏨 *Hotel:* ${booking.address.placeName} (Quarto: ${booking.address.comp || 'Não informado'})`; 
    const extrasList = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => `➕ ${DATA.extras.find(e=>e.id===k)?.label}`).join('\n');
    
    const msg = `*PEDIDO DE SESSÃO*\n\n👤 *Nome:* ${booking.name}\n📅 *Quando:* ${dateStr} às ${booking.time}\n⏳ *Duração:* ~${f.duration} min\n\n*O que faremos:*\n${servicesText}\n${extrasList ? `\n*Extras:*\n${extrasList}\n` : ''}\n*Onde:* \n${locTxt}\n\n*Pagamento:* ${booking.payment.toUpperCase()}\n💰 *Valor Total:* ${formatMoney(f.total)}\n\n_Estou ciente das regras de higiene e de que a sessão não inclui ato sexual._\n\n🗓️ *Adicione na sua agenda clicando aqui:*\n${calendarLink}`;
    
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!giftDone) return <PremiumGiftReveal onWin={handleWinGift} />;

  if ((booking as any).finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-scale-in">
        <div className="w-24 h-24 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center mb-6"><Icon name="check" size={40} /></div>
        <h2 className="text-3xl font-bold text-white mb-3">Resumo Concluído!</h2>
        <p className="text-zinc-400 text-sm mb-10 max-w-sm">Para garantir sua vaga e nosso sigilo, clique abaixo para me enviar tudo no WhatsApp. <br/><br/>O link para adicionar na sua agenda vai junto na mensagem.</p>
        
        <div className="w-full max-w-sm">
          <button onClick={sendWhatsApp} className="w-full bg-[#25D366] text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(37,211,102,0.3)]">
            <Icon name="message" size={20} /> Enviar para o WhatsApp
          </button>
        </div>
      </div>
    );
  }

  const days = []; const today = new Date();
  for (let i = 0; i < 30; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }
  const timeSlots = []; for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) timeSlots.push(`${i < 10 ? '0' : ''}${i}:00`);

  return (
    <>
      <GlobalStyles />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-40 flex flex-col gap-12">
        
        {/* HERO SECTION / HEADER TURBINADO */}
        <section className="animate-fade-up space-y-5">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.2)]">
                <img src="https://i.ibb.co/gZxp3Dwz/Screenshot-1.png" alt="Thalyson" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-2 border-[#09090b] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Ativo
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Thalyson Massagens</h1>
            <p className="text-zinc-400 text-sm mb-4">Atendimento focado em relaxamento para homens.</p>
            
            <div className="flex flex-wrap justify-center gap-2">
              <span className="flex items-center gap-1.5 glass-panel text-xs font-bold text-zinc-300 px-3 py-1.5 rounded-lg"><Icon name="star" size={14} className="text-amber-500" /> 5.0</span>
              <span className="flex items-center gap-1.5 glass-panel text-xs font-bold text-zinc-300 px-3 py-1.5 rounded-lg"><Icon name="user-check" size={14} className="text-blue-400" /> 142 Atendimentos</span>
              <span className="flex items-center gap-1.5 glass-panel text-xs font-bold text-zinc-300 px-3 py-1.5 rounded-lg"><Icon name="map-pin" size={14} className="text-emerald-400" /> Bela Vista, SP</span>
              <span className="flex items-center gap-1.5 glass-panel text-xs font-bold text-zinc-300 px-3 py-1.5 rounded-lg"><Icon name="shield" size={14} className="text-purple-400" /> Sigilo Absoluto</span>
            </div>
          </div>
        </section>

        {/* 1. SERVIÇOS (COMBO OU AVULSO) */}
        <section ref={servicesRef} className="animate-fade-up">
          <SectionHeader step={1} title="Sessões" subtitle="Leia os detalhes e escolha sua experiência." />
          
          <div className="flex gap-2 p-1.5 glass-panel rounded-2xl mb-6 w-full sm:w-fit">
            <button onClick={() => setActiveTab('single')} className={`flex-1 px-6 py-2.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'single' ? 'bg-white text-black' : 'text-zinc-400'}`}>Avulsas</button>
            <button onClick={() => setActiveTab('packs')} className={`flex-1 px-6 py-2.5 rounded-xl text-xs font-bold transition-colors ${activeTab === 'packs' ? 'bg-amber-500 text-black' : 'text-zinc-400'}`}>Combos (Economia)</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(activeTab === 'single' ? DATA.services : DATA.packs).map(item => {
              const sel = booking.cart.find(c => c.id === item.id);
              return (
                <div key={item.id} onClick={() => handleToggleItem(item)} className={`p-5 sm:p-6 rounded-2xl border transition-all cursor-pointer flex flex-col ${sel ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_4px_20px_rgba(251,191,36,0.1)]' : 'glass-panel hover:border-white/20'}`}>
                  
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${sel ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'}`}>
                      <Icon name={item.icon} size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1 block">{item.tag}</span>
                        {sel && <Icon name="check" size={20} className="text-amber-500" />}
                      </div>
                      <h3 className="text-white font-bold text-xl mb-1 leading-tight">{item.title}</h3>
                      <p className="text-zinc-300 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>

                  {/* Detalhes Tangíveis da Sessão */}
                  {'details' in item && (
                    <div className="mt-2 mb-4 space-y-1.5 pl-16">
                      {(item.details as string[]).map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-end justify-between mt-2 pt-4 border-t border-white/5 pl-16">
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

        {/* 2. LOCAL & DADOS */}
        <section ref={locationRef} className={`transition-opacity duration-500 ${booking.cart.length ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
          <SectionHeader step={2} title="Local e Identificação" subtitle="Apenas para saber onde e como te chamar." />
          
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 mb-2 block pl-1">Nome ou Apelido</label>
              <input type="text" value={booking.name} onChange={(e) => setBooking(b => ({...b, name: e.target.value}))} className="w-full h-14 rounded-xl px-4 input-premium" placeholder="Manteremos o sigilo." />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-zinc-500 mb-3 block pl-1">Onde vamos nos encontrar?</label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[{id: 'motel', label: 'Minha Suíte'}, {id: 'home', label: 'Na sua Casa'}, {id: 'hotel', label: 'Em Hotel'}].map(l => (
                  <button key={l.id} onClick={() => setBooking(b => ({...b, locationType: l.id}))} className={`py-4 px-2 text-xs font-bold rounded-xl border transition-colors flex flex-col items-center justify-center gap-2 ${booking.locationType === l.id ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-zinc-400'}`}>
                    {l.label}
                  </button>
                ))}
              </div>

              {booking.locationType === 'motel' && <p className="text-xs text-amber-500 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 font-medium">Você virá até meu espaço na Bela Vista (próximo à Av. Paulista). O endereço exato é enviado pelo WhatsApp após finalizarmos.</p>}
              
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
          <SectionHeader step={3} title="Data e Horário" subtitle="Trabalho todos os dias, das 09h às 22h." />
          
          <div className="flex gap-3 overflow-x-auto snap-x scrollbar-hide mb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            {days.map((d, i) => {
              const sel = booking.date?.toDateString() === d.toDateString();
              return (
                <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: '' }))} className={`snap-center shrink-0 w-20 py-4 rounded-2xl border flex flex-col items-center gap-1 transition-all ${sel ? 'bg-amber-500 border-amber-500 text-black scale-105 shadow-lg' : 'glass-panel text-zinc-400 hover:bg-white/10'}`}>
                  <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}</span>
                  <span className="text-2xl font-bold">{d.getDate()}</span>
                </button>
              );
            })}
          </div>

          {booking.date && (
            <div className="grid grid-cols-4 gap-3 animate-fade-up">
              {timeSlots.map(t => {
                const sel = booking.time === t;
                const isRush = RUSH_HOURS.includes(t) && booking.locationType !== 'motel';
                return (
                  <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))} className={`h-14 rounded-xl text-sm font-bold border transition-colors relative flex items-center justify-center ${sel ? 'bg-amber-500 border-amber-500 text-black' : 'glass-panel text-zinc-300 hover:bg-white/10'}`}>
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
          <SectionHeader step={4} title="Resumo e Forma de Pagamento" subtitle="O pagamento é feito pessoalmente após a sessão." />
          
          <div className="glass-panel p-6 rounded-3xl space-y-6">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500 mb-3 pl-1">Adicionais (Opcional)</p>
              <div className="space-y-3">
                {DATA.extras.map(ex => {
                  const sel = booking.extras[ex.id];
                  return (
                    <button key={ex.id} onClick={() => setBooking(b => ({...b, extras: {...b.extras, [ex.id]: !sel}}))} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors ${sel ? 'bg-amber-500/10 border-amber-500/50' : 'bg-white/5 border-white/10'}`}>
                      <span className={`text-sm font-bold ${sel ? 'text-amber-500' : 'text-zinc-300'}`}>{ex.label}</span>
                      <span className="text-xs font-bold text-zinc-500">+{formatMoney(ex.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase text-zinc-500 mb-3 pl-1">Como vai pagar no local?</p>
              <div className="flex gap-3">
                {[{id: 'pix', label: 'Pix (-3%)'}, {id: 'card', label: 'Cartão'}, {id: 'cash', label: 'Dinheiro'}].map(p => (
                  <button key={p.id} onClick={() => setBooking(b => ({...b, payment: p.id}))} className={`flex-1 h-12 rounded-xl text-xs font-bold border transition-colors ${booking.payment === p.id ? 'bg-amber-500 border-amber-500 text-black' : 'bg-white/5 border-white/10 text-zinc-400'}`}>{p.label}</button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between text-sm text-zinc-400 mb-2"><span>Subtotal</span><span>{formatMoney(financials.sub)}</span></div>
              {booking.discount > 0 && <div className="flex justify-between text-sm text-amber-500 mb-2"><span>Cortesia (Cartão)</span><span>-{formatMoney(booking.discount)}</span></div>}
              {financials.rushFee > 0 && <div className="flex justify-between text-sm text-zinc-400 mb-2"><span>Taxa de Pico (Uber)</span><span>+{formatMoney(financials.rushFee)}</span></div>}
              {financials.pixDisc > 0 && <div className="flex justify-between text-sm text-emerald-400 mb-2"><span>Desconto Pix</span><span>-{formatMoney(financials.pixDisc)}</span></div>}
              <div className="flex justify-between items-center mt-4">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-3xl font-bold text-amber-500 tracking-tight">{formatMoney(financials.total)}</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* BOTTOM STICKY BAR */}
      <div className="fixed bottom-0 inset-x-0 p-4 z-40 bg-gradient-to-t from-[#09090b] to-transparent pt-10">
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
