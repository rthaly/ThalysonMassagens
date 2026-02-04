import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind,
  Clock, Zap, X, Globe, Building, BedDouble,
  Heart, Instagram, Moon, Sun, Home,
  CreditCard, Banknote, QrCode, Trophy, Info, Gift,
  ChevronLeft, ChevronRight, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles,
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package,
  Lock, User, Quote, Share2, ExternalLink, Copy, Hourglass, Settings, Download, HelpCircle, ChevronDown
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v58.0 - COMPLETO, CORRIGIDO & RESPONSIVO
 * ==================================================================================
 */

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v58_final',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_2026_SECURE',
  START_HOUR: 9,
  END_HOUR: 22
};

// ==================================================================================
// 1. DESIGN SYSTEM
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden active:scale-[0.98] hover:brightness-110 shadow-lg font-['Poppins']";

  const variants = {
    primary: "bg-blue-600 text-white border border-blue-500/20 shadow-blue-600/30",
    secondary: "bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white border border-green-400/20 shadow-green-500/20",
    instagram: "bg-gradient-to-tr from-purple-600 to-pink-600 text-white border border-pink-400/20",
    outline: "bg-transparent border-2 border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-300",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    icon: "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700"
  };

  const sizes = {
    sm: "h-10 text-xs px-4",
    md: "h-14 text-sm px-6",
    lg: "h-16 text-base px-8",
    xl: "h-16 text-base font-bold uppercase tracking-widest",
    icon: "h-12 w-12 p-0 flex-shrink-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={22} className="animate-spin text-current"/> : (
        <>
          {Icon && <Icon size={22} className={children ? "mr-3 opacity-90 flex-shrink-0" : ""} strokeWidth={2.5} />}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark }) => (
  <div className="space-y-2.5 w-full group font-['Poppins']">
    {label && <label className={`text-sm font-bold uppercase tracking-widest ml-1 transition-colors ${isDark ? 'text-zinc-400 group-focus-within:text-blue-500' : 'text-slate-600 group-focus-within:text-blue-600'}`}>{label}</label>}
    <div className="relative">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors z-10 ${isDark ? 'text-zinc-500 group-focus-within:text-blue-500' : 'text-slate-400 group-focus-within:text-blue-600'}`}>{Icon && <Icon size={22} />}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-14 pr-5 h-16 rounded-2xl outline-none text-base font-medium transition-all duration-300 
        ${isDark
            ? 'bg-zinc-900 border-2 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:bg-zinc-950 focus:border-blue-500'
            : 'bg-white border-2 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-md'} 
        focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] ${error ? 'border-red-500/50 text-red-500' : ''}`}
      />
    </div>
  </div>
);

const Card = ({ children, className = '', onClick, active = false, isDark = true }) => (
  <div
    onClick={onClick}
    className={`relative p-8 rounded-[2.5rem] transition-all duration-300 flex flex-col justify-between h-full group font-['Poppins'] min-h-[480px]
    ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} 
    ${active
        ? 'bg-blue-900/10 border-2 border-blue-500 shadow-[0_0_50px_-10px_rgba(37,99,235,0.4)]'
        : (isDark ? 'bg-zinc-900/80 backdrop-blur-2xl border border-white/10 hover:border-blue-500/50' : 'bg-white border border-slate-200 shadow-xl shadow-slate-200/50')} 
    ${className}`}
  >
    {children}
  </div>
);

const SmartTimer = ({ isDark }) => {
  const [time, setTime] = useState(600);
  useEffect(() => {
    const interval = setInterval(() => {
        setTime(prev => (prev <= 0 ? 600 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const format = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  return (
    <div className={`flex items-center justify-center gap-3 p-4 rounded-2xl mb-8 border-2 transition-colors duration-500 ${time < 60 ? 'bg-red-500/10 border-red-500/30 text-red-400' : (isDark ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600')}`}>
        <Hourglass size={20} className={time < 60 ? "animate-spin" : "animate-pulse"}/>
        <span className="text-sm font-bold uppercase tracking-wider">
            {time < 60 ? "Expira em breve: " : "Segurando vaga: "}
            <span className="font-mono text-base ml-1">{format(time)}</span>
        </span>
    </div>
  );
};

const ReviewsCarousel = ({ reviews, isDark, title }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = 340;
        current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };
  return (
    <div className={`w-full overflow-hidden py-14 border-t mt-20 relative group/reviews ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
      <div className="text-center mb-12 px-6">
          <h3 className={`text-3xl font-light mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>O que dizem sobre mim</h3>
          <p className={`text-sm uppercase tracking-[0.25em] font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{title}</p>
      </div>
      <div className="hidden md:block">
        <button onClick={() => scroll('left')} className="absolute left-8 top-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full border-2 bg-zinc-900/90 border-zinc-700 text-white"><ChevronLeft size={24} /></button>
        <button onClick={() => scroll('right')} className="absolute right-8 top-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full border-2 bg-zinc-900/90 border-zinc-700 text-white"><ChevronRight size={24} /></button>
      </div>
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide px-6 md:px-20 snap-x snap-mandatory font-['Poppins']">
        {reviews.map((r, i) => (
            <div key={i} className={`snap-center flex-shrink-0 w-80 sm:w-96 border p-8 rounded-[2rem] transition-all duration-300 ${isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-start mb-5">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>{r.n.charAt(0)}</div>
                    <div><span className={`text-base font-bold block leading-none mb-1 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{r.n}</span><span className="text-xs text-blue-500 uppercase font-bold tracking-wider">{r.loc}</span></div>
                 </div>
                 <div className="flex gap-0.5">{[...Array(5)].map((_, k) => (<Star key={k} size={14} fill={k < r.s ? "#3b82f6" : "none"} className={k < r.s ? "text-blue-500" : "text-zinc-700"} />))}</div>
              </div>
              <p className={`text-sm leading-relaxed italic ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>"{r.t}"</p>
            </div>
        ))}
      </div>
    </div>
  );
};

const FAQItem = ({ q, a, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left group">
                <span className={`text-base font-semibold transition-colors ${isDark ? 'text-zinc-200 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'}`}>{q}</span>
                <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-zinc-500'}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
            </div>
        </div>
    );
};

// ==================================================================================
// 2. DATA (PREÇOS CORRIGIDOS)
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    const currency = isPT ? 'R$' : '$';
    
    // PREÇOS CONFORME ÚLTIMO PEDIDO
    const p = {
        relax: isPT ? 125 : 35,
        sens: isPT ? 155 : 45,
        titan: isPT ? 195 : 60,
        packRelax: { v: isPT ? 397 : 120, full: isPT ? 500 : 140, save: isPT ? 103 : 20 },
        packTri: { v: isPT ? 487 : 150, full: isPT ? 585 : 180, save: isPT ? 98 : 30 },
        packPass: { v: isPT ? 780 : 240, full: isPT ? 975 : 300, save: isPT ? 195 : 60 }
    };

    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor" },
            { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "Amigo" : "Bronze" },
            { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "Próximo" : "Silver" },
            { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "Íntimo" : "Gold" }
        ],
        services: [
            {
              id: 'relaxante', min: 60, price: p.relax, icon: Wind, tag: isPT ? "100% FÍSICO" : "PHYSICAL",
              title: isPT ? "Massagem Clássica" : "Classic Relax",
              desc: isPT ? "Foco exclusivo muscular. Sem toque íntimo." : "Muscle focus only. No intimate touch.",
              details: isPT ? `ALÍVIO MUSCULAR:\n• Manobras firmes e profundas para soltar a musculatura.\n• Foco: Tirar "nós" e cansaço físico.\n• Traje: Roupa padrão.\n• Sessão puramente terapêutica.` : `BODY RESET:\n• Firm maneuvers to release muscles.\n• Focus: Fatigue and knots.\n• Standard attire.\n• Purely therapeutic.`
            },
            {
              id: 'sensitiva', min: 60, price: p.sens, icon: Flame, tag: isPT ? "SENSORIAL + LINGAM" : "SENSORY",
              title: isPT ? "Tântrica Sensorial" : "Tantric Sensory",
              desc: isPT ? "Relaxamento + Toque Sutil + Finalização. Atendo de cueca." : "Relax + Subtle Touch + Finish. Underwear service.",
              details: isPT ? `DESPERTAR SENSORIAL:\n• Inicia soltando a musculatura.\n• Toques sutis despertam a pele e energia.\n• Traje: Atendo de cueca.\n• Inclui Massagem Lingam (toque íntimo).` : `TOUCH EVOLUTION:\n• Starts with muscle release.\n• Subtle skin awakening.\n• Underwear service.\n• Includes Lingam massage.`
            },
            {
              id: 'mista', min: 60, price: p.titan, icon: Zap, tag: isPT ? "FUSÃO COMPLETA" : "FULL FUSION",
              title: isPT ? "Experiência Fusion" : "Fusion Experience",
              desc: isPT ? "Tudo em um: Muscular + Corpo a Corpo + Lingam Intenso." : "All in one: Muscle + Body-to-Body + Intense Lingam.",
              details: isPT ? `JORNADA PREMIUM:\n• Mistura de força (muscular) e conexão (pele com pele).\n• Dedico mais tempo na região íntima.\n• Traje: Atendo de cueca.\n• O ápice do alívio e prazer.` : `FULL JOURNEY:\n• Muscle relief + Body-to-body.\n• More time on intimate area.\n• Underwear service.\n• The peak of pleasure.`
            }
        ],
        extras: [
            { id: 'more_time', price: isPT ? 55 : 15, icon: Clock, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Sem pressa." : "No rush." },
            { id: 'touch', price: isPT ? 55 : 15, icon: Heart, label: isPT ? "Interativo" : "Interactive", desc: isPT ? "Você toca também." : "You touch too." },
            { id: 'aroma', price: isPT ? 5 : 5, icon: Wind, label: isPT ? "Aromaterapia" : "Aromatherapy", desc: isPT ? "Imersão total." : "Total immersion." }
        ],
        faq: [
            { q: "Qual a diferença das sessões?", a: "Clássica (R$125) é muscular. Sensitiva (R$155) tem toque íntimo. Fusion (R$195) é a mais completa com corpo a corpo." },
            { q: "Atende em domicílio?", a: "Sim, 100% Delivery em São Paulo e região. Uber cobrado à parte." },
            { q: "Aceita cartão?", a: "Sim, aceito Pix e Cartão de Crédito via link seguro." }
        ],
        plans: [
            { id: 'pack_mista', type: 'pack', title: "Trilogia do Êxtase", price: p.packTri.v, fullPrice: p.packTri.full, savings: p.packTri.save, tag: "MELHOR VALOR", icon: Zap, desc: "3 Sessões da Experiência Fusion.", details: "3 encontros completos para viver o ápice." }
        ],
        reviews: [
            { n: "Bruno", loc: "SP - Bela Vista", t: "Sua massagem foi muito bem executada. Recomendo muito.", s: 5 },
            { n: "Tiago", loc: "SP - Bela Vista", t: "Energia surreal. Massagem perfeita.", s: 5 },
            { n: "Alan", loc: "SP - Bela Vista", t: "Da pra ver que ele manda bem no que faz. Obrigado!", s: 5 },
            { n: "Felipe", loc: "Londrina", t: "Fiquei na dúvida por ser no sofá, mas foi ótimo.", s: 5 }
        ],
        reviews_title: "+50 Avaliações 5 Estrelas",
        currency: currency,
        text: {
            welcome: isPT ? "Olá," : "Hello,",
            subtitle: isPT ? "Escolha sua experiência e agende seu momento." : "Choose your experience and schedule your moment.",
            loading: isPT ? "Carregando..." : "Loading...",
            level_label: isPT ? "Fidelidade" : "Loyalty",
            tab_packs: isPT ? "Pacotes" : "Packs",
            tab_single: isPT ? "Sessões" : "Sessions",
            details_label: isPT ? "O que inclui" : "Includes",
            location_title: isPT ? "Onde será?" : "Location?",
            input_name: isPT ? "Seu Nome" : "Your Name",
            input_addr: isPT ? "Endereço" : "Address",
            whatsapp_btn: isPT ? "Finalizar no WhatsApp" : "Finish on WhatsApp",
            terms_title: isPT ? "Termos" : "Terms",
            zap: {
                intro: "Olá Thalyson! Gostaria de agendar.",
                order_title: "PEDIDO DE RESERVA",
                client: "👤 *Cliente:* ",
                service: "💆‍♂️ *Serviço:* ",
                date: "📅 *Data:* ",
                location: "📍 *Localização:* ",
                value: "💰 *Valor Total:* "
            }
        }
    };
};

// ==================================================================================
// 3. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  const [isClient, setIsClient] = useState(false);
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toasts, addToastState] = useState([]);
  const dateScrollRef = useRef(null);

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState({ name: '', xp: 0, coupons: [], usedCoupons: [] });
  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, 
    locationType: 'home', address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', termsAccepted: false
  });

  const addToast = (msg) => {
      const id = Date.now();
      addToastState(prev => [...prev, { id, msg }]);
      setTimeout(() => addToastState(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => { setIsClient(true); }, []);
  useEffect(() => {
    if (!isClient) return;
    const s = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (s) {
        try { const p = JSON.parse(s); if(p.user) setUser(u => ({...u, ...p.user})); } catch(e){}
    }
    setTimeout(() => setLoading(false), 1000);
  }, [isClient]);

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0 };
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) sub += DATA.extras.find(e=>e.id===k)?.price || 0; });
    return { sub, total: sub };
  }, [booking.item, booking.extras, DATA.extras]);

  const estimatedXP = Math.floor(financials.total * 0.15);

  const handleNextStep = () => {
    if (step === 0 && !booking.item) return addToast("Selecione um serviço!");
    if (step === 1 && (!booking.date || !booking.time)) return addToast("Selecione data e hora!");
    if (step === 2 && !user.name) return addToast("Informe seu nome!");
    if (step === 3 && !booking.payment) return addToast("Escolha o pagamento!");
    
    if (step === 3) {
        window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent("Olá! " + financials.total)}`, '_blank');
        setStep(4);
    } else {
        setStep(s => s + 1);
    }
  };

  if (!isClient) return null;

  if (loading) return (
    <div className={`fixed inset-0 flex items-center justify-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-black'}`}>
        <div className="animate-bounce font-black text-4xl text-blue-600">TM</div>
    </div>
  );

  return (
    <div className={`h-[100dvh] w-full font-['Poppins'] flex flex-col overflow-hidden ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* TOASTS */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] w-full max-w-xs px-4 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="mb-2 p-4 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-2xl animate-fade-in pointer-events-auto">
            {t.msg}
          </div>
        ))}
      </div>

      {/* HEADER */}
      <header className="h-20 px-6 flex items-center justify-between z-20 shrink-0 border-b border-white/5">
        <div className="flex flex-col">
            <span className="font-bold text-xl leading-none">Thalyson</span>
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Massagens SP</span>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className="p-2.5 rounded-full bg-white/5 border border-white/5"><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full bg-white/5 border border-white/5">{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="max-w-5xl mx-auto">
          
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-10">
                <h1 className="text-4xl font-light">{T.welcome} <span className="font-bold text-blue-600">{user.name.split(' ')[0] || 'Visitante'}</span></h1>
                <p className="text-sm opacity-60 mt-2">{T.subtitle}</p>
              </div>

              {/* FIDELIDADE */}
              <div className="p-6 rounded-[2rem] bg-zinc-900 border border-white/5 mb-10 flex justify-between items-center">
                <div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">{T.level_label}</span>
                    <h3 className="text-xl font-bold">Nível 1</h3>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black">{user.xp}</span>
                    <span className="text-[10px] block opacity-40">XP TOTAL</span>
                </div>
              </div>

              {/* TABS */}
              <div className="flex p-1.5 bg-zinc-900/50 rounded-2xl mb-8">
                <button onClick={() => setActiveTab('single')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'single' ? 'bg-blue-600 text-white' : 'opacity-40'}`}>SESSÕES</button>
                <button onClick={() => setActiveTab('packs')} className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeTab === 'packs' ? 'bg-blue-600 text-white' : 'opacity-40'}`}>PACOTES</button>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map(s => (
                  <Card key={s.id} active={booking.item?.id === s.id} onClick={() => setBooking(b => ({...b, item: s}))} isDark={isDark}>
                    <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-blue-600/10 text-blue-500 rounded-2xl flex items-center justify-center"><s.icon size={28}/></div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-blue-500">{DATA.currency} {s.price}</span>
                            <span className="block text-[10px] font-bold opacity-40 uppercase">{s.min || 'Promo'} MIN</span>
                        </div>
                    </div>
                    <div className="mt-8">
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full">{s.tag}</span>
                        <h3 className="text-2xl font-bold mt-4">{s.title}</h3>
                        <p className="text-sm opacity-60 mt-3 leading-relaxed">{s.desc}</p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase"><Info size={14}/> {T.details_label}</div>
                        <p className="text-[11px] leading-relaxed opacity-50 whitespace-pre-line">{s.details}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <ReviewsCarousel reviews={DATA.reviews} isDark={isDark} title={DATA.reviews_title} />
              
              <div className="py-20 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-8 text-center">Dúvidas</h3>
                {DATA.faq.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} isDark={isDark} />)}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in space-y-12">
                <h2 className="text-3xl font-bold text-center">Quando?</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {[...Array(12)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return (
                            <button key={i} onClick={()=>setBooking(b=>({...b, date: d.toISOString()}))} className={`shrink-0 w-24 h-32 rounded-3xl border-2 flex flex-col items-center justify-center snap-center transition-all ${isSel ? 'bg-blue-600 border-blue-600' : 'bg-zinc-900 border-zinc-800 opacity-40'}`}>
                                <span className="text-[10px] font-bold">{d.toLocaleDateString('pt', {weekday:'short'}).toUpperCase()}</span>
                                <span className="text-3xl font-black">{d.getDate()}</span>
                            </button>
                        );
                    })}
                </div>
                {booking.date && (
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {["10:00", "13:00", "15:00", "17:00", "19:00", "21:00"].map(t => (
                            <button key={t} onClick={()=>setBooking(b=>({...b, time: t}))} className={`py-4 rounded-xl border-2 font-bold transition-all ${booking.time === t ? 'bg-blue-600 border-blue-600' : 'bg-zinc-900 border-zinc-800 opacity-40'}`}>{t}</button>
                        ))}
                    </div>
                )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in space-y-8 max-w-lg mx-auto">
                <h2 className="text-3xl font-bold text-center">Identificação</h2>
                <InputField isDark={isDark} label="Seu Nome" value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} placeholder="Ex: Marcos" />
                <div className="grid grid-cols-3 gap-2">
                    {['home', 'hotel', 'motel'].map(l => (
                        <button key={l} onClick={()=>setBooking(b=>({...b, locationType: l}))} className={`py-4 rounded-xl border-2 text-[10px] font-bold uppercase transition-all ${booking.locationType === l ? 'bg-blue-600 border-blue-600' : 'bg-zinc-900 border-zinc-800'}`}>{l}</button>
                    ))}
                </div>
                <InputField isDark={isDark} label="Endereço / Local" value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} icon={MapPin} placeholder="Rua, Número e Bairro" />
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in space-y-8 max-w-lg mx-auto">
                <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5">
                    <h3 className="text-xl font-bold mb-6">Resumo</h3>
                    <div className="flex justify-between items-center py-3">
                        <span className="opacity-60">{booking.item?.title}</span>
                        <span className="font-bold">{DATA.currency} {booking.item?.price}</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-t border-white/5 mt-4">
                        <span className="text-2xl font-black">Total</span>
                        <div className="text-right">
                            <span className="text-3xl font-black text-blue-600">{DATA.currency} {financials.total},00</span>
                            <span className="block text-blue-500 text-[10px] font-bold mt-1">+ {estimatedXP} XP GANHOS</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {['pix', 'cartão'].map(p => (
                        <button key={p} onClick={()=>setBooking(b=>({...b, payment: p}))} className={`w-full p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${booking.payment === p ? 'border-blue-600 bg-blue-600/10' : 'border-zinc-800'}`}>
                            <span className="font-bold uppercase tracking-widest">{p}</span>
                            {booking.payment === p && <Check size={20}/>}
                        </button>
                    ))}
                </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-20 animate-scale-in">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-600/40"><Check size={48}/></div>
                <h2 className="text-4xl font-bold mb-4">Pré-Agendado!</h2>
                <p className="opacity-60 max-w-xs mx-auto mb-10">Envie a mensagem agora no WhatsApp para que eu possa confirmar seu horário.</p>
                <Button full size="lg" onClick={()=>setStep(0)}>Voltar para o Início</Button>
            </div>
          )}

        </div>
      </main>

      {/* FOOTER */}
      {step < 4 && (
        <footer className="fixed bottom-0 left-0 w-full p-6 z-40">
            <div className="max-w-5xl mx-auto flex gap-4">
                {step > 0 && (
                    <button onClick={()=>setStep(step-1)} className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center"><ChevronLeft/></button>
                )}
                <button onClick={handleNextStep} className="flex-1 h-20 rounded-[2rem] bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-4 shadow-2xl shadow-blue-600/40 active:scale-95 transition-all">
                    {step === 3 ? 'FINALIZAR' : 'PRÓXIMO'}
                    <ArrowRight size={20}/>
                </button>
            </div>
        </footer>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
