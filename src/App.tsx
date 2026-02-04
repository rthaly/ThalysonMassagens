import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, 
  ChevronLeft, ChevronRight, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, Share2, ExternalLink, Copy, ChevronDown, CheckCircle2, 
  Navigation, Music, Fingerprint
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v99.0 - THE MAGNUM OPUS (SPATIAL EDITION)
 * ==================================================================================
 * "Não é apenas um agendamento. É o início da experiência."
 * * ARQUITETURA DE LUXO:
 * 1. Cinematic Grain: Textura de filme para sensação tátil.
 * 2. Spatial UI: Profundidade controlada por sombras coloridas (Glow).
 * 3. Physics-based CSS: Curvas Bezier (0.4, 0, 0.2, 1) para movimento natural.
 * 4. Robust Form Logic: Validação em tempo real sem intrusão.
 */

// --- 1. CONFIGURAÇÕES & TEXTOS DE ALTO PADRÃO ---

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_magnum_v99',
  PIX_KEY: "62922530000144",
  PIX_DISPLAY: "62.922.530/0001-44",
  START_HOUR: 9,
  END_HOUR: 21,
  // Paleta de cores semântica para injeção dinâmica
  COLORS: {
    GOLD: "from-amber-200 via-yellow-400 to-amber-600",
    DEEP: "bg-[#050505]",
    GLASS: "backdrop-blur-2xl bg-white/5 border-white/10"
  }
};

const DATA = {
  services: [
    { 
      id: 'relax', 
      min: 60, price: 130, 
      icon: Wind, 
      tag: "CLASSIC", 
      accent: "teal",
      title: "Sessão Relaxante", 
      desc: "Descompressão absoluta.",
      details: "O silêncio que o seu corpo pede.\n\nFocada inteiramente na musculatura profunda, esta sessão utiliza óleos aquecidos e manobras de deslizamento contínuo para zerar o estresse físico. Sem conotação sexual." 
    },
    { 
      id: 'sensitiva', 
      min: 60, price: 160, 
      icon: Flame, 
      tag: "SENSORIAL", 
      accent: "rose",
      title: "Terapia Sensitiva", 
      desc: "O despertar do toque.",
      details: "Uma jornada de pele e arrepio.\n\nComeçamos soltando a musculatura e evoluímos para toques de pluma (ponta dos dedos), ativando a bioletricidade do corpo. A massagem tântrica finaliza o ciclo de prazer e relaxamento."
    },
    { 
      id: 'mista', 
      min: 90, price: 200, 
      icon: Crown, 
      tag: "ROYAL EXPERIENCE", 
      accent: "indigo",
      title: "Experiência Royal", 
      desc: "A fusão perfeita. Top 1.",
      details: "A assinatura da casa. \n\nUne a pressão firme da Relaxante com a liberdade sensorial da Tântrica. Inclui a técnica 'Body-to-Body' (massagem corpo a corpo) e finalização livre. É a escolha de 80% dos clientes."
    }
  ],
  plans: [
    { 
      id: 'pack_3', type: 'pack', title: "Trilogia (3 Sessões)", 
      price: 490, fullPrice: 600, savings: 110, 
      desc: "3x Experiência Royal.",
      details: "Garanta sua manutenção mensal de bem-estar com prioridade de agenda e preço congelado.", 
      tag: "BEST VALUE", icon: Sparkles
    },
    { 
      id: 'pack_4', type: 'pack', title: "Ciclo Recovery (4 Sessões)", 
      price: 420, fullPrice: 520, savings: 100, 
      desc: "4x Sessões Relaxantes.",
      details: "Protocolo focado em dor crônica e recuperação muscular intensa.", 
      tag: "THERAPY", icon: Package
    }
  ],
  extras: [
    { id: 'extratime', price: 60, icon: Clock, label: "Extended Time", sub: "+30 Minutos", desc: "Para quem não gosta de pressa." },
    { id: 'reciprocidade', price: 50, icon: Heart, label: "Interatividade", sub: "Troca de Toques", desc: "Você participa da massagem." },
    { id: 'aromaterapia', price: 20, icon: Wind, label: "Aromaterapia", sub: "Óleos Essenciais", desc: "Lavanda francesa ou Sândalo." }
  ],
  reviews: [
    { n: "Dr. Ricardo", l: "Jardins", t: "É impressionante a técnica. Ambiente de alto nível e total discrição.", s: 5 },
    { n: "Felipe M.", l: "Bela Vista", t: "A experiência mista é transformadora. Recomendo de olhos fechados.", s: 5 },
    { n: "Gustavo", l: "Rio Preto", t: "Mão firme, energia boa e muito educado. Virei cliente fixo.", s: 5 },
    { n: "André", l: "Higienópolis", t: "O toque sensitivo é algo que nunca senti antes. Surreal.", s: 5 }
  ]
};

// ==================================================================================
// 2. CSS ENGINE (INJECTED)
// ==================================================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Manrope:wght@300;400;500;600;700;800&display=swap');

    :root {
      --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
      --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
    }

    body {
      background-color: #050505;
      color: #fafafa;
      font-family: 'Manrope', sans-serif;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Cinematic Noise Texture */
    .noise-bg {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.03;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    .font-display { font-family: 'Cinzel', serif; }

    /* Custom Scrollbar */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
    
    /* Animation Utilities */
    .animate-in { animation: fadeUp 0.8s var(--ease-smooth) forwards; opacity: 0; transform: translateY(20px); }
    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }

    @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

    /* Interaction Physics */
    .touch-spring { transition: transform 0.4s var(--ease-spring), opacity 0.2s; }
    .touch-spring:active { transform: scale(0.96); opacity: 0.9; }

    /* Glass Panels */
    .glass-panel {
      background: rgba(20, 20, 20, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    .gold-text {
      background: linear-gradient(to bottom, #fcd34d, #d97706);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Checkbox Customization */
    .custom-checkbox:checked { background-color: #d97706; border-color: #d97706; }
    .custom-checkbox { appearance: none; width: 20px; height: 20px; border: 2px solid #525252; border-radius: 6px; display: grid; place-content: center; transition: all 0.2s; }
    .custom-checkbox::before { content: ""; width: 10px; height: 10px; transform: scale(0); transition: 0.2s transform ease-in-out; box-shadow: inset 1em 1em white; transform-origin: center; clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%); }
    .custom-checkbox:checked::before { transform: scale(1); }
  `}</style>
);

// ==================================================================================
// 3. COMPONENTES UI DE ELITE
// ==================================================================================

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start gap-5 mb-8 animate-in">
    <div className="relative">
      <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20"></div>
      <div className="relative w-12 h-12 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center text-amber-400 shadow-2xl">
        <Icon size={22} strokeWidth={1.5} />
      </div>
    </div>
    <div>
      <h2 className="text-2xl font-display font-semibold text-white tracking-wide">{title}</h2>
      <p className="text-sm text-neutral-400 font-medium leading-relaxed">{subtitle}</p>
    </div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', full, loading, icon: Icon, disabled }) => {
  const styles = {
    primary: "bg-gradient-to-r from-amber-200 to-amber-500 text-black shadow-[0_0_30px_-5px_rgba(251,191,36,0.4)] hover:brightness-110",
    whatsapp: "bg-[#25D366] text-white shadow-[0_0_30px_-5px_rgba(37,211,102,0.4)] hover:brightness-105",
    ghost: "bg-white/5 border border-white/10 text-neutral-300 hover:bg-white/10"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`relative h-14 rounded-xl font-bold text-sm tracking-widest uppercase transition-all touch-spring overflow-hidden
      ${styles[variant]} ${full ? 'w-full' : 'px-8'} ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
    >
      {loading ? <Loader2 className="animate-spin mx-auto" /> : (
        <div className="flex items-center justify-center gap-3 relative z-10">
          {Icon && <Icon size={18} />}
          {children}
        </div>
      )}
    </button>
  );
};

const Input = ({ label, value, onChange, placeholder, icon: Icon, type = 'text' }) => (
  <div className="group space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 ml-1">{label}</label>
    <div className="relative transition-all duration-300 focus-within:scale-[1.01]">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-amber-400 transition-colors">
        {Icon && <Icon size={18} />}
      </div>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 bg-[#0a0a0a] border border-white/10 rounded-xl pl-12 pr-4 text-sm font-medium text-white placeholder:text-neutral-700 outline-none focus:border-amber-500/50 focus:bg-[#0f0f0f] focus:shadow-[0_0_20px_-10px_rgba(245,158,11,0.2)] transition-all"
      />
    </div>
  </div>
);

const DynamicIslandToast = ({ toasts }) => (
  <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center pointer-events-none">
    <div className="flex flex-col items-center gap-2">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 px-5 py-3 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl animate-in">
          <div className={`w-2 h-2 rounded-full ${t.type === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`}></div>
          <span className="text-xs font-bold text-white tracking-wide">{t.msg}</span>
        </div>
      ))}
    </div>
  </div>
);

// ==================================================================================
// 4. APLICAÇÃO PRINCIPAL (LÓGICA BLINDADA)
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState('services');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Refs para Scroll Suave
  const refs = {
    calendar: useRef(null),
    location: useRef(null),
    payment: useRef(null)
  };

  // Estado Unificado
  const [user, setUser] = useState({ name: '', xp: 0 });
  const [booking, setBooking] = useState({
    item: null, // Serviço selecionado
    extras: {}, // IDs dos extras
    date: null, // Objeto Date
    time: null, // String "HH:00"
    location: 'home', // 'home' | 'hotel' | 'motel'
    address: { street: '', number: '', obs: '' },
    payment: 'pix',
    terms: false
  });

  // Inicialização
  useEffect(() => {
    // Recuperar sessão
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if(saved) {
      try {
        const p = JSON.parse(saved);
        if(p.user) setUser(p.user);
      } catch(e) {}
    }
    // Efeito de carregamento "Fake" para construir antecipação
    setTimeout(() => setLoading(false), 2000);
  }, []);

  // Salvar progresso
  useEffect(() => {
    if(!loading) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user }));
  }, [user, loading]);

  // Helpers
  const addToast = (msg, type = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    if (navigator.vibrate) navigator.vibrate(50);
  };

  const smoothScrollTo = (refName) => {
    setTimeout(() => {
      refs[refName].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Lógica Financeira
  const totals = useMemo(() => {
    if (!booking.item) return { total: 0 };
    let t = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
      if(booking.extras[k]) {
        const ex = DATA.extras.find(e => e.id === k);
        if(ex) t += ex.price;
      }
    });
    return t;
  }, [booking]);

  // Gerador de Horários Inteligente
  const timeSlots = useMemo(() => {
    if(!booking.date) return [];
    const now = new Date();
    const isToday = booking.date.getDate() === now.getDate() && booking.date.getMonth() === now.getMonth();
    const currentHour = now.getHours();
    
    let slots = [];
    for(let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) {
      if(!isToday || i > currentHour + 1) { // +1 hora de antecedência mínima
        slots.push(`${i < 10 ? '0' : ''}${i}:00`);
      }
    }
    return slots;
  }, [booking.date]);

  // Finalização via WhatsApp
  const handleFinish = () => {
    if(!booking.item) return addToast("Selecione um serviço.");
    if(!booking.date || !booking.time) return addToast("Defina data e hora.");
    if(!user.name) {
      addToast("Qual é o seu nome?");
      smoothScrollTo('location');
      return;
    }
    if(!booking.terms) return addToast("Aceite os termos para continuar.");

    const msg = `
*🏛️ THALYSON | ROYAL BOOKING*
-------------------------------
👤 *Cliente:* ${user.name}
✨ *Experiência:* ${booking.item.title}
🗓️ *Data:* ${booking.date.toLocaleDateString('pt-BR')} às ${booking.time}
📍 *Local:* ${booking.location.toUpperCase()}
${booking.location !== 'motel' ? `📝 *Endereço:* ${booking.address.street}, ${booking.address.number}` : ''}

➕ *Adicionais:* ${Object.keys(booking.extras).filter(k=>booking.extras[k]).length ? Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>DATA.extras.find(e=>e.id===k).label).join(', ') : 'Padrão'}

💎 *Investimento:* R$ ${totals},00
💳 *Forma Pagto:* ${booking.payment.toUpperCase()}
-------------------------------
*Aguardando validação do terapeuta.*
    `.trim();

    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
    setShowConfetti(true);
    setUser(u => ({ ...u, xp: u.xp + 100 }));
  };

  // --- RENDERIZAÇÃO ---
  if(loading) return (
    <div className="fixed inset-0 bg-[#050505] z-[200] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative w-20 h-20 border border-amber-500/30 rounded-full flex items-center justify-center">
          <span className="font-display font-bold text-2xl text-amber-500">T</span>
        </div>
      </div>
      <p className="mt-6 text-[10px] font-bold tracking-[0.4em] text-neutral-500 animate-pulse">CARREGANDO EXPERIÊNCIA</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-32 lg:pb-0 relative selection:bg-amber-500/30">
      <GlobalStyles />
      <div className="noise-bg"></div>
      <DynamicIslandToast toasts={toasts} />

      {/* AMBIENT LIGHTING */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 glass-panel border-b border-white/5 h-20 flex items-center justify-between px-6 lg:px-12">
        <div>
          <h1 className="font-display text-xl font-bold text-white tracking-wide">THALYSON</h1>
          <p className="text-[9px] text-amber-500 font-bold tracking-[0.3em] uppercase">Private Therapist</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
            <Crown size={14} className="text-amber-400" />
            <span className="text-xs font-bold text-neutral-300">{user.xp} XP</span>
          </div>
          <a href={CONFIG.INSTAGRAM} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
            <Instagram size={18} />
          </a>
        </div>
      </header>

      {/* LAYOUT GRID */}
      <main className="relative z-10 pt-28 px-4 lg:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
        
        {/* COLUNA ESQUERDA: FLUXO */}
        <div className="space-y-12">
          
          {/* 1. HERO & SERVICES */}
          <section className="animate-in">
            <h2 className="text-3xl lg:text-5xl font-display font-medium text-white leading-tight mb-4">
              A redefinição do <span className="gold-text italic pr-2">seu bem-estar.</span>
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed max-w-xl mb-8">
              Protocolos exclusivos que unem terapia manual avançada e despertar sensorial em um ambiente seguro e controlado.
            </p>

            {/* Abas */}
            <div className="flex gap-4 mb-6 border-b border-white/5 pb-1">
              {['services', 'packs'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-xs font-bold tracking-widest uppercase transition-all border-b-2 
                  ${activeTab === tab ? 'text-amber-400 border-amber-400' : 'text-neutral-600 border-transparent hover:text-neutral-400'}`}
                >
                  {tab === 'services' ? 'Sessões Avulsas' : 'Ciclos VIP'}
                </button>
              ))}
            </div>

            {/* Cards de Serviço */}
            <div className="space-y-4">
              {(activeTab === 'services' ? DATA.services : DATA.plans).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => { setBooking(b => ({ ...b, item, type: item.type || 'single' })); smoothScrollTo('calendar'); }}
                  className={`group relative p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                  ${booking.item?.id === item.id 
                    ? 'bg-[#111] border-amber-500/50 shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)]' 
                    : 'bg-[#0a0a0a] border-white/5 hover:border-white/10 hover:bg-[#111]'}`}
                >
                  {/* Spotlight Gradient on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(600px_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.05),transparent)] pointer-events-none"></div>

                  <div className="flex justify-between items-start relative z-10">
                    <div className="flex gap-5">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 
                        ${booking.item?.id === item.id ? 'bg-gradient-to-br from-amber-400 to-orange-600 text-black shadow-lg' : 'bg-[#151515] text-neutral-500'}`}>
                        <item.icon size={24} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={`text-lg font-bold ${booking.item?.id === item.id ? 'text-white' : 'text-neutral-300'}`}>{item.title}</h3>
                          {item.tag && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-white/10 text-neutral-400 tracking-wider">{item.tag}</span>}
                        </div>
                        <p className="text-sm text-neutral-500 leading-relaxed max-w-sm">{item.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.fullPrice && <span className="block text-xs line-through text-neutral-700">R$ {item.fullPrice}</span>}
                      <span className={`text-xl font-bold ${booking.item?.id === item.id ? 'text-amber-400' : 'text-neutral-400'}`}>R$ {item.price}</span>
                    </div>
                  </div>

                  {/* Detalhes Expansíveis */}
                  <div className={`grid transition-all duration-500 ease-in-out ${booking.item?.id === item.id ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-white/5' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <p className="text-sm text-neutral-400 whitespace-pre-line leading-relaxed pl-4 border-l-2 border-amber-500/20">
                        {item.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* REVIEWS SCROLL INFINITO */}
          <section className="py-8 relative overflow-hidden -mx-4 lg:mx-0">
             <div className="flex gap-4 w-max animate-[scroll_40s_linear_infinite] hover:pause">
               {[...DATA.reviews, ...DATA.reviews].map((r, i) => (
                 <div key={i} className="w-80 p-5 rounded-2xl bg-[#0a0a0a] border border-white/5">
                   <div className="flex gap-1 text-amber-500 mb-2">
                     {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
                   </div>
                   <p className="text-neutral-300 text-sm italic mb-3">"{r.t}"</p>
                   <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">{r.n} - {r.l}</p>
                 </div>
               ))}
             </div>
             <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .hover\\:pause:hover { animation-play-state: paused; }`}</style>
          </section>

          {/* 2. CALENDAR (SMART) */}
          {booking.item && (
            <div ref={refs.calendar} className="scroll-mt-28">
              <SectionHeader icon={Calendar} title="Data & Hora" subtitle="Sincronize sua agenda com a minha." />
              
              <div className="space-y-6">
                {/* DIAS */}
                <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
                   {Array.from({length: 14}).map((_, i) => {
                     const d = new Date();
                     d.setDate(d.getDate() + i);
                     const isSel = booking.date?.toDateString() === d.toDateString();
                     return (
                       <button 
                        key={i}
                        onClick={() => { setBooking(b => ({...b, date: d, time: null})); }}
                        className={`min-w-[4.5rem] h-20 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all snap-start
                        ${isSel ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-[#0a0a0a] border-white/10 text-neutral-500 hover:border-white/20'}`}
                       >
                         <span className="text-[9px] font-bold uppercase tracking-wider">{i === 0 ? 'HOJE' : d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                         <span className="text-xl font-bold font-display">{d.getDate()}</span>
                       </button>
                     )
                   })}
                </div>

                {/* HORAS */}
                {booking.date ? (
                  timeSlots.length > 0 ? (
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 animate-in">
                      {timeSlots.map(t => (
                        <button
                          key={t}
                          onClick={() => { setBooking(b => ({...b, time: t})); smoothScrollTo('location'); }}
                          className={`py-2.5 rounded-lg border text-xs font-bold transition-all
                          ${booking.time === t ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-[#0a0a0a] border-white/10 text-neutral-400 hover:bg-white/5'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center border border-dashed border-white/10 rounded-xl text-neutral-500 text-sm">
                      Agenda cheia para esta data. Tente o dia seguinte.
                    </div>
                  )
                ) : <div className="h-10"></div>}
              </div>
            </div>
          )}

          {/* 3. LOCATION & DATA */}
          {booking.date && booking.time && (
            <div ref={refs.location} className="scroll-mt-28">
               <SectionHeader icon={MapPin} title="Localização" subtitle="Atendimento personalizado onde você estiver." />

               <div className="space-y-6">
                 {/* Tipos de Local */}
                 <div className="grid grid-cols-3 gap-4">
                   {[
                     {id: 'home', l: 'Residência', i: Home},
                     {id: 'hotel', l: 'Hotel', i: Building},
                     {id: 'motel', l: 'Motel', i: BedDouble}
                   ].map(loc => (
                     <button
                      key={loc.id}
                      onClick={() => setBooking(b => ({...b, location: loc.id}))}
                      className={`h-24 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all
                      ${booking.location === loc.id ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-[#0a0a0a] border-white/10 text-neutral-500 hover:bg-white/5'}`}
                     >
                       <loc.i size={20} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">{loc.l}</span>
                     </button>
                   ))}
                 </div>

                 {/* Inputs */}
                 <div className="space-y-4 animate-in">
                   <Input label="Seu Nome" placeholder="Como deseja ser chamado?" icon={User} value={user.name} onChange={v => setUser({...user, name: v})} />
                   
                   {booking.location !== 'motel' && (
                     <div className="grid grid-cols-[1fr_80px] gap-4">
                       <Input label="Endereço" placeholder="Rua / Avenida" icon={MapPin} value={booking.address.street} onChange={v => setBooking(b => ({...b, address: {...b.address, street: v}}))} />
                       <Input label="Número" placeholder="123" value={booking.address.number} onChange={v => setBooking(b => ({...b, address: {...b.address, number: v}}))} />
                     </div>
                   )}
                   
                   {booking.location === 'motel' && (
                     <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
                       <AlertTriangle size={16} className="text-amber-500" />
                       <p className="text-xs text-amber-200/80">Em motéis, a taxa da suíte é responsabilidade do cliente.</p>
                     </div>
                   )}
                 </div>

                 {/* Extras */}
                 <div className="pt-6 border-t border-white/5">
                   <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Personalize sua sessão</p>
                   <div className="space-y-3">
                     {DATA.extras.map(ex => (
                       <div 
                        key={ex.id}
                        onClick={() => setBooking(b => ({...b, extras: {...b.extras, [ex.id]: !b.extras[ex.id]}}))}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
                        ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500/40' : 'bg-[#0a0a0a] border-white/10 hover:border-white/20'}`}
                       >
                         <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${booking.extras[ex.id] ? 'bg-amber-500 text-black' : 'bg-[#151515] text-neutral-500'}`}>
                             <ex.icon size={16} />
                           </div>
                           <div>
                             <p className={`text-sm font-bold ${booking.extras[ex.id] ? 'text-white' : 'text-neutral-400'}`}>{ex.label}</p>
                             <p className="text-[10px] text-neutral-600">{ex.sub}</p>
                           </div>
                         </div>
                         <span className="text-xs font-bold text-neutral-500">+ R$ {ex.price}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          )}

          <div className="h-24 lg:hidden"></div>
        </div>

        {/* COLUNA DIREITA: RESUMO (DESKTOP) & FLUTUANTE (MOBILE) */}
        <div className="lg:block">
           <div className="sticky top-28">
             <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
               {/* Decorative Shine */}
               <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 blur-[60px] rounded-full"></div>
               
               <h3 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Ticket size={18} className="text-amber-500"/> Seu Ticket
               </h3>

               {booking.item ? (
                 <div className="space-y-6 animate-in">
                   {/* Item Principal */}
                   <div className="flex justify-between items-start pb-4 border-b border-white/10">
                     <div>
                       <p className="font-bold text-white text-lg">{booking.item.title}</p>
                       <p className="text-xs text-neutral-400 mt-1">{booking.item.min} min • {booking.item.tag}</p>
                     </div>
                     <p className="font-bold text-amber-400 text-lg">R$ {booking.item.price}</p>
                   </div>

                   {/* Extras Listados */}
                   {Object.keys(booking.extras).some(k => booking.extras[k]) && (
                     <div className="space-y-2 pb-4 border-b border-white/10">
                       {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => (
                         <div key={k} className="flex justify-between text-xs text-neutral-300">
                           <span>+ {DATA.extras.find(e=>e.id===k).label}</span>
                           <span>R$ {DATA.extras.find(e=>e.id===k).price}</span>
                         </div>
                       ))}
                     </div>
                   )}

                   {/* Info Contexto */}
                   <div className="bg-white/5 p-4 rounded-xl space-y-2">
                     <div className="flex items-center gap-3 text-xs text-neutral-300">
                       <Calendar size={14} className="text-amber-500"/>
                       {booking.date ? `${booking.date.toLocaleDateString()} às ${booking.time || '--:--'}` : 'Data pendente'}
                     </div>
                     <div className="flex items-center gap-3 text-xs text-neutral-300">
                       <MapPin size={14} className="text-amber-500"/>
                       {booking.location === 'home' ? 'Sua Residência' : (booking.location === 'hotel' ? 'Hotel' : 'Motel')}
                     </div>
                   </div>

                   {/* Total */}
                   <div className="flex justify-between items-end">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Valor Total</span>
                     <span className="text-4xl font-display font-bold text-white">R$ {totals}</span>
                   </div>

                   {/* Termos e Ação */}
                   <div className="pt-4 space-y-4">
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <input type="checkbox" checked={booking.terms} onChange={e => setBooking(b => ({...b, terms: e.target.checked}))} className="custom-checkbox shrink-0 mt-0.5" />
                       <span className="text-xs text-neutral-400 leading-snug group-hover:text-neutral-300 transition-colors">
                         Concordo com os protocolos de segurança, higiene e política de cancelamento (24h).
                       </span>
                     </label>

                     <Button full variant="whatsapp" icon={MessageCircle} onClick={handleFinish}>
                       CONFIRMAR AGENDAMENTO
                     </Button>
                     
                     <div className="flex justify-center gap-4 text-neutral-700">
                       <ShieldCheck size={16} /> <Fingerprint size={16} />
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl text-neutral-600 text-sm">
                   Selecione uma experiência para começar.
                 </div>
               )}
             </div>
           </div>
        </div>
      </main>

      {/* MOBILE FLOATING DOCK (RESUMO) */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
        <div className="glass-panel p-4 rounded-2xl flex items-center justify-between shadow-2xl">
          {booking.item ? (
            <>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase text-neutral-500">Total</span>
                <span className="text-xl font-bold text-white">R$ {totals}</span>
              </div>
              <Button onClick={() => {
                if(!booking.date) smoothScrollTo('calendar');
                else if(!user.name) smoothScrollTo('location');
                else handleFinish();
              }} variant={booking.date && booking.time && user.name ? 'whatsapp' : 'primary'}>
                {booking.date && booking.time && user.name ? 'Finalizar' : 'Continuar'} <ArrowRight size={16} className="ml-2"/>
              </Button>
            </>
          ) : (
            <div className="w-full text-center text-xs font-bold text-neutral-500 uppercase tracking-widest">
              Escolha sua Experiência
            </div>
          )}
        </div>
      </div>

      {/* CONFETTI OVERLAY */}
      {showConfetti && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center animate-in">
          <div className="text-center p-8 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/20 blur-[50px] rounded-full"></div>
            <div className="relative w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_#10b981] animate-bounce">
              <Check size={40} className="text-white" strokeWidth={4} />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">Confirmado</h2>
            <p className="text-neutral-400">Redirecionando para o WhatsApp...</p>
          </div>
        </div>
      )}

    </div>
  );
}
