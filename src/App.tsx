import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, 
  ChevronLeft, Loader2, AlertTriangle, Tag, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, CheckCircle2, Sparkles
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP v20.0 - ULTIMATE CONVERSION EDITION
 * ==================================================================================
 * ATUALIZAÇÕES SENIOR:
 * 1. [UX] Infinite Marquee Reviews (Prova social imediata).
 * 2. [UI] Button Shimmer Effect (Atração visual para o clique).
 * 3. [SALES] Badges de "Mais Vendido" pulsantes.
 * 4. [PERF] Otimização de re-renders com memoização estrita.
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v20_pro', 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US'
};

// ==================================================================================
// 1. COMPONENTES VISUAIS DE ALTO IMPACTO
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false, shimmer = false }) => {
  const baseStyle = "relative flex items-center justify-center font-bold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 rounded-2xl overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:to-amber-400 text-black shadow-lg shadow-amber-500/30 border border-amber-400/50",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700",
    whatsapp: "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-500/20 border border-green-500/20",
    outline: "bg-transparent border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
  };
  const sizes = { sm: "h-9 text-xs px-3", md: "h-12 text-sm px-6", lg: "h-14 text-base px-8", xl: "h-16 text-lg px-8" };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {shimmer && !loading && !disabled && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10 animate-[shimmer_3s_infinite]" />
      )}
      {loading ? <Loader2 size={18} className="animate-spin mr-2"/> : (Icon && <Icon size={18} className="mr-2 relative z-20" strokeWidth={2.5} />)}
      <span className="relative z-20">{children}</span>
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark }) => (
  <div className="space-y-2 w-full animate-fade-in">
    {label && <label className={`text-[11px] font-bold uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{label}</label>}
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-amber-500' : 'text-slate-400 group-focus-within:text-amber-500'}`}>{Icon && <Icon size={18} />}</div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none text-sm transition-all shadow-sm ${error ? 'border-red-500/50 focus:border-red-500 bg-red-500/5' : (isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:border-amber-500/50 focus:bg-zinc-900 focus:shadow-amber-500/10 focus:shadow-lg' : 'bg-white border-slate-200 text-slate-900 focus:border-amber-500')}`} />
    </div>
    {error && <p className="text-red-400 text-[10px] ml-2 mt-1 animate-slide-in flex items-center gap-1"><AlertTriangle size={10}/> {error}</p>}
  </div>
);

const Card = ({ children, isDark, className = '', onClick, active = false, isPlan = false }) => (
  <div onClick={onClick} className={`relative p-6 rounded-3xl transition-all duration-500 overflow-hidden group ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${isDark ? `bg-zinc-900/60 backdrop-blur-md ${active ? 'border border-amber-500/50 bg-amber-500/5 shadow-2xl shadow-amber-900/20' : 'border border-zinc-800/60 hover:border-zinc-600'}` : `bg-white ${active ? 'border border-amber-500 ring-1 ring-amber-500/50 shadow-xl shadow-amber-100' : 'border border-slate-200 shadow-sm hover:shadow-md'}`} ${className}`}>
    {active && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />}
    {children}
  </div>
);

const Marquee = ({ items, isDark }) => {
    return (
        <div className="relative flex overflow-x-hidden group w-full mask-linear-fade">
            <div className="animate-marquee whitespace-nowrap flex gap-4 py-4">
                {[...items, ...items, ...items].map((review, i) => (
                    <div key={i} className={`inline-flex flex-col w-64 p-4 rounded-xl border whitespace-normal transition-colors ${isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-white border-slate-100 text-slate-600'}`}>
                         <div className="flex items-center gap-2 mb-2">
                             <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-[10px] text-black font-black">{review.n.charAt(0)}</div>
                             <span className="text-xs font-bold truncate">{review.n}</span>
                             <div className="flex text-amber-400 ml-auto"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                         </div>
                         <p className="text-[11px] leading-relaxed opacity-80 line-clamp-2 italic">"{review.t}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      color: ['#f59e0b', '#fbbf24', '#ffffff', '#d97706', '#10b981'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * 360,
      spin: Math.random() * 5 - 2.5
    }));
    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.angle += p.spin;
        if (p.y > canvas.height) p.y = -20;
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
};

// ==================================================================================
// 2. DADOS ESTRATÉGICOS (COPYWRITING)
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor" },
            { level: 2, xpNeeded: 150, reward: 15, title: isPT ? "Cliente Bronze" : "Bronze Client" },
            { level: 3, xpNeeded: 450, reward: 30, title: isPT ? "Cliente Prata" : "Silver Client" },
            { level: 4, xpNeeded: 900, reward: 50, title: isPT ? "Membro VIP" : "VIP Member" }
        ],
        services: [
            { 
              id: 'relaxante', min: 60, price: 90, icon: Wind, tag: isPT ? "PARA INICIANTES" : "FOR BEGINNERS",
              title: isPT ? "Relaxante (Rolos de Madeira)" : "Wood Therapy Relax",
              desc: isPT ? "O alívio imediato e sem dor para o cansaço do dia a dia." : "Immediate relief for daily tiredness.",
              details: isPT ? `• TÉCNICA: Rolos de madeira + Manual.\n• FOCO: Tirar dores nas costas e pernas.\n• FINALIZAÇÃO: Manual relaxante.` : `• TECHNIQUE: Wood rollers + Manual.\n• FOCUS: Remove back and leg pain.\n• FINISH: Relaxing manual.`
            },
            { 
              id: 'sensitiva', min: 60, price: 160, icon: Flame, tag: isPT ? "A MAIS VENDIDA" : "BEST SELLER",
              title: isPT ? "Sensitiva Tântrica (+ Lingam)" : "Tantric Sensitive (+ Lingam)",
              desc: isPT ? "Uma jornada sensorial intensa. Arrepios do início ao fim." : "Intense sensory journey. Chills from start to finish.",
              details: isPT ? `• INÍCIO: Toques leves (ponta dos dedos).\n• SENSORIAL: Penas e estímulos sensoriais.\n• LINGAM: Massagem íntima completa.\n• FINALIZAÇÃO: Manual com óleo aquecido.` : `• START: Light touches.\n• SENSORY: Feathers and stimuli.\n• LINGAM: Full intimate massage.\n• FINISH: Warm oil manual.`
            },
            { 
              id: 'mista', min: 60, price: 200, icon: Crown, tag: isPT ? "EXPERIÊNCIA COMPLETA" : "FULL EXPERIENCE",
              title: isPT ? "Experiência Mista VIP" : "Full Mixed VIP Experience",
              desc: isPT ? "O melhor dos dois mundos: Relaxamento profundo + Prazer intenso." : "Best of both worlds: Deep relaxation + Intense pleasure.",
              details: isPT ? `• FUSÃO: Começa relaxante, termina tântrica.\n• BODY TO BODY: Contato corpo a corpo.\n• LINGAM: Finalização estendida.\n• EXTRA: Você no controle do ritmo.` : `• FUSION: Starts relaxing, ends tantric.\n• BODY TO BODY: Full contact.\n• LINGAM: Extended finish.\n• EXTRA: You control the pace.`
            }
        ],
        plans: [
            { id: 'pack_relax', type: 'pack', title: isPT ? "Pack Relax (4 Sessões)" : "Relax Pack (4 Sessions)", price: 320, fullPrice: 360, savings: 40, details: isPT ? "Para manter o corpo leve o mês todo." : "Keep body light all month.", tag: null, icon: Package },
            { id: 'pack_mista', type: 'pack', title: isPT ? "Pack Mista (3 Sessões)" : "Full Pack (3 Sessions)", price: 540, fullPrice: 600, savings: 60, details: isPT ? "O melhor custo-benefício para quem quer prazer." : "Best value for pleasure seekers.", tag: isPT ? "POPULAR" : "POPULAR", icon: Zap },
            { id: 'vip_club', type: 'subscription', title: isPT ? "Clube VIP Mensal" : "VIP Monthly Club", price: 350, fullPrice: 450, savings: 100, details: isPT ? "Status VIP: 2 Sessões Completas + Prioridade na agenda." : "VIP Status: 2 Full Sessions + Priority.", tag: isPT ? "ELITE" : "ELITE", icon: Crown }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Sem pressa para terminar." : "No rush to finish." },
            { id: 'touch', price: 55, icon: Heart, label: isPT ? "Inversão (Você Toca)" : "Switch (You Touch)", desc: isPT ? "Explore meu corpo também." : "Explore my body too." },
            { id: 'aroma', price: 15, icon: Sparkles, label: isPT ? "Kit Aromaterapia Premium" : "Premium Aroma Kit", desc: isPT ? "Óleos essenciais importados." : "Imported essential oils." }
        ],
        reviews: [
            { n: "Tiago M.", t: isPT ? "Experiência de outro mundo. O toque dele vicia." : "Out of this world experience.", s: 5 },
            { n: "Pedro H.", t: isPT ? "Fui estressado e saí flutuando. A sensitiva é real." : "Went in stressed, came out floating.", s: 5 },
            { n: "Marcos (VIP)", t: isPT ? "Já sou cliente há meses. Profissionalismo nota 1000." : "Client for months. 1000/10 professionalism.", s: 5 },
            { n: "Anônimo", t: isPT ? "Finalização absurda, jorrei longe. Recomendo." : "Absurd finish. Recommended.", s: 5 },
            { n: "Dr. André", t: isPT ? "Local impecável e atendimento discreto. Perfeito." : "Impeccable place, discreet service.", s: 5 },
            { n: "Felipe", t: isPT ? "O corpo a corpo é quente de verdade." : "Body to body is truly hot.", s: 5 }
        ],
        text: {
            loading: isPT ? "PREPARANDO AMBIENTE..." : "PREPARING ENVIRONMENT...",
            welcome: isPT ? "Bem-vindo," : "Welcome,",
            subtitle: isPT ? "Seu momento de escape começa aqui." : "Your escape starts here.",
            tab_single: isPT ? "Sessão Avulsa" : "Single Session",
            tab_packs: isPT ? "Planos VIP" : "VIP Plans",
            select_time_title: isPT ? "Sua Reserva" : "Your Reservation",
            date_sub: isPT ? "Garanta seu horário antes que esgote:" : "Secure your slot before it's gone:",
            location_title: isPT ? "Onde será o atendimento?" : "Where will it be?",
            input_name: isPT ? "Seu Nome" : "Your Name",
            input_addr: isPT ? "Endereço Completo" : "Full Address",
            pay_title: isPT ? "Pagamento Seguro" : "Secure Payment",
            pay_pix: "Pix (Instantâneo)",
            pay_card: isPT ? "Cartão de Crédito" : "Credit Card",
            pay_cash: isPT ? "Dinheiro" : "Cash",
            extras_title: isPT ? "Turbine sua Experiência" : "Boost your Experience",
            total_label: isPT ? "Total a Investir" : "Total Investment",
            book_btn: isPT ? "CONFIRMAR RESERVA" : "CONFIRM BOOKING",
            next_btn: isPT ? "CONTINUAR" : "CONTINUE",
            success_title: isPT ? "Agendamento Realizado!" : "Booking Confirmed!",
            success_sub: isPT ? "Já separei seu horário. Finalize o contato no WhatsApp para garantir." : "Slot reserved. Finalize on WhatsApp to guarantee.",
            whatsapp_btn: isPT ? "ABRIR CONVERSA AGORA" : "OPEN CHAT NOW",
            scarcity_msg: isPT ? "pessoas interessadas agora" : "people interested now",
            verified: isPT ? "Profissional Verificado" : "Verified Professional"
        }
    };
};

// ==================================================================================
// 3. MAIN APP
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  
  const [viewers, setViewers] = useState(3);
  const [showScarcity, setShowScarcity] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  
  const [toasts, setToasts] = useState([]);
  const scrollRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], 
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
      hasSeenWelcome: false,
      ordersCount: 0
  });

  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false
  });

  // SETUP INICIAL E RECUPERAÇÃO DE DADOS
  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 2000);
    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            const parsed = JSON.parse(s);
            setUser(prev => ({ ...prev, ...parsed, coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [], xp: parsed.xp || 0 }));
            if(parsed.savedAddress) setBooking(b => ({...b, address: parsed.savedAddress}));
        } else {
            setUser(p => ({...p, coupons: [{ id: 'WELCOME10', val: 10, title: '🎁 Presente de Boas-Vindas', code: 'WELCOME10' }]}));
        }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
     if(!loading && isClient && !user.hasSeenWelcome) {
         const timer = setTimeout(() => setWelcomePopup(true), 3000);
         return () => clearTimeout(timer);
     }
  }, [loading, isClient, user.hasSeenWelcome]);

  // SCARCITY TRIGGER (GATILHO DE ESCASSEZ)
  useEffect(() => {
      if(step === 1) {
          const interval = setInterval(() => {
             const v = Math.floor(Math.random() * 5) + 2;
             setViewers(v);
             setShowScarcity(true);
             setTimeout(() => setShowScarcity(false), 4000);
          }, 15000);
          return () => clearInterval(interval);
      }
  }, [step]);

  useEffect(() => { 
      if(isClient && !loading) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); 
      if(scrollRef.current) scrollRef.current.scrollTo(0,0);
  }, [user, isClient, loading, step]);

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0 };
    let sub = booking.item.price;
    const safeExtras = booking.extras || {};
    Object.keys(safeExtras).forEach(k => { 
        if(safeExtras[k]) {
            const extraItem = DATA.extras.find(e=>e.id===k);
            if(extraItem) sub += extraItem.price; 
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { sub, disc, total: Math.max(0, sub - disc) };
  }, [booking.item, booking.extras, booking.appliedCoupon, DATA.extras]);

  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    let locTxt = booking.locationType === 'motel' ? "Motel (Combinar)" : (booking.locationType === 'hotel' ? `Hotel: ${booking.address.placeName}` : `Casa: ${booking.address.street}, ${booking.address.number}`);
    
    const extrasList = Object.keys(booking.extras || {}).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return ext ? `+ ${ext.label}` : '';
    }).filter(Boolean).join(', ');
    
    const msg = `Olá Thalyson! 🦁\nQuero agendar: *${booking.item?.title}*\n📅 ${dateStr} às ${booking.time}\n📍 ${locTxt}\n${extrasList ? `✨ Extras: ${extrasList}\n` : ''}💰 Total: R$ ${f.total},00 (${booking.payment})\n\nPodemos confirmar?`;
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const handleNextStep = () => {
      // VALIDAÇÃO SIMPLIFICADA PARA FLUIDEZ
      if (step === 0 && !booking.item) return addToast("Selecione um serviço primeiro", "error");
      if (step === 1 && (!booking.date || !booking.time)) return addToast("Escolha data e hora", "error");
      if (step === 2 && !user.name) return addToast("Preciso do seu nome", "error");
      if (step === 3 && !booking.payment) return addToast("Escolha o pagamento", "error");
      
      if (step === 3) {
           setUser(prev => ({ ...prev, xp: (prev.xp||0) + 100, ordersCount: (prev.ordersCount||0) + 1 }));
           setShowConfetti(true);
           setStep(4);
           window.open(generateWhatsAppLink(), '_blank');
      } else {
           setStep(s => s + 1);
      }
  };

  const handleApplyCoupon = () => {
      if(couponInput.toUpperCase() === 'WELCOME10') {
          setBooking(b => ({...b, appliedCoupon: { id: 'WELCOME10', val: 10, title: '🎁 Welcome', code: 'WELCOME10' }}));
          addToast("Cupom aplicado!", "success");
      } else {
          addToast("Cupom inválido", "error");
      }
  };

  if (loading) return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative"><div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(245,158,11,0.5)]"><Crown size={40} className="text-black animate-bounce"/></div></div>
        <h1 className="mt-8 text-2xl font-black tracking-tighter uppercase">{T.loading}</h1>
      </div>
  );
  
  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* TOASTS */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-full max-w-xs pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl animate-slide-down border backdrop-blur-xl ${t.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-red-500/90 text-white border-red-400'}`}>
            {t.type === 'success' ? <CheckCircle2 size={20}/> : <AlertTriangle size={20}/>}
            <span className="text-xs font-bold">{t.msg}</span>
          </div>
        ))}
      </div>

      <Confetti active={showConfetti} />
      
      {/* SCARCITY POPUP */}
      <div className={`fixed top-28 left-1/2 -translate-x-1/2 z-[90] pointer-events-none transition-all duration-500 transform ${showScarcity ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
           <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/10">
               <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
               <span className="text-[10px] font-bold tracking-wide uppercase">{viewers} {T.scarcity_msg}</span>
           </div>
      </div>

      <header className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 ${isDark ? 'bg-zinc-950/80 border-b border-zinc-800' : 'bg-white/80 border-b border-slate-200'} backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20"><Crown size={18} fill="black" strokeWidth={1.5} /></div>
          <div><span className="font-black text-sm tracking-tight block">Thalyson</span><span className="text-[9px] uppercase font-bold text-amber-500 tracking-widest flex items-center gap-1"><CheckCircle2 size={9}/> {T.verified}</span></div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-100 text-slate-600'}`}><Globe size={16}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-900 text-amber-400' : 'bg-slate-100 text-blue-600'}`}>{isDark ? <Sun size={16}/> : <Moon size={16}/>}</button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth relative">
        
        {/* HERO MARQUEE */}
        {step === 0 && <div className="mt-4 mb-2"><Marquee items={DATA.reviews} isDark={isDark} /></div>}

        <div className="max-w-md mx-auto p-6 space-y-8">
          
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-8 relative">
                <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-amber-500 to-transparent"></div>
                <h1 className="text-3xl font-black tracking-tight leading-none mb-2">{T.welcome} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-600">{user.name || (lang==='pt'?'Visitante':'Visitor')}</span></h1>
                <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
              </div>
              
              <div className={`grid grid-cols-2 p-1 rounded-2xl mb-8 relative border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'}`}>
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='single' ? (isDark?'bg-zinc-800 text-white shadow-lg':'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}><LayoutList size={14}/> {T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='packs' ? (isDark?'bg-zinc-800 text-white shadow-lg':'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}><Crown size={14} className="text-amber-500"/> {T.tab_packs}</button>
              </div>

              <div className="space-y-4">
                  {(activeTab === 'single' ? DATA.services : DATA.plans).map(s => (
                      <Card key={s.id} isDark={isDark} active={booking.item?.id === s.id} onClick={() => setBooking(b => ({...b, item: s, type: activeTab}))}>
                          {s.tag && <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg z-10 flex items-center gap-1"><Flame size={10} fill="black"/> {s.tag}</div>}
                          <div className="flex items-start gap-4 mb-3">
                            <div className={`p-3.5 rounded-2xl transition-colors shrink-0 ${booking.item?.id === s.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><s.icon size={26}/></div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">{s.title}</h3>
                                <div className="text-amber-500 font-black text-xl flex items-center gap-2 mt-1">R$ {s.price} {s.fullPrice && <span className="text-xs text-zinc-500 line-through font-normal">R$ {s.fullPrice}</span>}</div>
                            </div>
                          </div>
                          <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{s.desc}</p>
                          {booking.item?.id === s.id && (<div className="pt-3 border-t border-dashed border-zinc-700/50 mt-3 animate-slide-in text-xs whitespace-pre-line opacity-80">{s.details}</div>)}
                      </Card>
                  ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl font-black mb-1">{T.select_time_title}</h2>
              <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-6">{T.date_sub}</p>
              
              <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 mb-2">
                {[...Array(10)].map((_, i) => { 
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`min-w-[70px] h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all active:scale-95 ${isSel ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/30' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-slate-200 text-slate-400')}`}>
                      <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString(lang==='pt'?'pt-BR':'en-US',{weekday:'short'}).slice(0,3)}</span>
                      <span className="text-xl font-black">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>
              
              {booking.date && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in">
                   {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                       <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); }} className={`py-3 rounded-xl text-sm font-bold border transition-all active:scale-95 ${booking.time === t ? 'bg-white text-black border-white shadow-xl scale-[1.02]' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-amber-500/50' : 'bg-white border-slate-200')}`}>{t}</button>
                   ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
             <div className="animate-slide-in space-y-6">
                 <div className="text-center mb-6">
                    <h2 className="text-2xl font-black mb-1">{T.location_title}</h2>
                    <p className="text-xs opacity-60">Seus dados ficam salvos apenas no seu dispositivo.</p>
                 </div>
                 
                 <div className={`grid grid-cols-3 gap-2 p-1 rounded-xl ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                    {[{id:'home', l:'Casa', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(x => (
                       <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-3 rounded-lg text-xs font-bold flex flex-col items-center gap-2 ${booking.locationType === x.id ? 'bg-amber-500 text-black shadow' : 'opacity-40'}`}><x.i size={18}/> {x.l}</button>
                    ))}
                 </div>

                 <InputField label={T.input_name} value={user.name} onChange={e=>setUser({...user, name:e.target.value})} icon={User} isDark={isDark} placeholder="Nome" />
                 
                 {booking.locationType !== 'motel' && (
                     <div className="space-y-3 animate-fade-in">
                         <InputField label="Endereço" value={booking.address.street} onChange={e=>setBooking(b=>({...b, address:{...b.address, street:e.target.value}}))} icon={MapPin} isDark={isDark} placeholder="Rua / Hotel" />
                         <div className="grid grid-cols-2 gap-3">
                             <InputField label="Número" value={booking.address.number} onChange={e=>setBooking(b=>({...b, address:{...b.address, number:e.target.value}}))} isDark={isDark} placeholder="123" />
                             <InputField label="Bairro" value={booking.address.district} onChange={e=>setBooking(b=>({...b, address:{...b.address, district:e.target.value}}))} isDark={isDark} placeholder="Centro" />
                         </div>
                     </div>
                 )}
                 
                 {booking.type === 'single' && (
                     <div className="pt-6 mt-6 border-t border-dashed border-zinc-800">
                        <h3 className="text-xs font-bold uppercase text-amber-500 mb-4">{T.extras_title}</h3>
                        <div className="space-y-3">
                            {DATA.extras.map(ex => (
                                <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500 text-amber-500' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}>
                                    <div className="flex items-center gap-3"><ex.icon size={18}/> <span className="text-sm font-bold">{ex.label}</span></div>
                                    <span className="text-xs font-bold">+ R$ {ex.price}</span>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}
             </div>
          )}

          {step === 3 && (
              <div className="animate-slide-in space-y-6">
                  <div className={`p-8 rounded-[2rem] text-center border relative overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'}`}>
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-500 to-orange-600"></div>
                      <h3 className="text-xs font-bold uppercase opacity-50 mb-2">{T.total_label}</h3>
                      <div className="text-5xl font-black text-amber-500 mb-1 tracking-tighter">R$ {financials.total}</div>
                      <p className="text-sm opacity-60 mb-6">{booking.item.title}</p>
                      
                      <div className="flex gap-2 mb-4">
                          <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder="CUPOM: WELCOME10" className={`flex-1 text-center py-2 rounded-lg text-sm uppercase font-bold tracking-widest outline-none border ${isDark ? 'bg-black border-zinc-800 focus:border-amber-500' : 'bg-slate-100 border-slate-200'}`} />
                          <button onClick={handleApplyCoupon} className="px-4 rounded-lg bg-zinc-800 font-bold text-xs hover:bg-zinc-700">OK</button>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 text-left">
                          {[{id:'pix', l:'Pix (Desconto)', i:QrCode}, {id:'card', l:'Cartão', i:CreditCard}, {id:'cash', l:'Dinheiro', i:Banknote}].map(p => (
                             <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${booking.payment === p.id ? 'bg-amber-500 text-black border-amber-500' : (isDark ? 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800' : 'bg-slate-50 border-slate-200')}`}>
                                 <p.i size={20}/> <span className="font-bold text-sm">{p.l}</span> {booking.payment === p.id && <Check size={16} className="ml-auto"/>}
                             </button>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {step === 4 && (
              <div className="text-center pt-10 animate-scale-in">
                  <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_60px_rgba(34,197,94,0.4)] animate-bounce"><Check size={56} className="text-white"/></div>
                  <h2 className="text-3xl font-black mb-4">{T.success_title}</h2>
                  <p className="opacity-60 mb-8 max-w-xs mx-auto">{T.success_sub}</p>
                  <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle} shimmer>{T.whatsapp_btn}</Button>
                  <button onClick={()=>{setStep(0); setBooking({...booking, item:null, date:null});}} className="mt-8 text-xs font-bold opacity-30 hover:opacity-100 uppercase tracking-widest">Voltar ao Início</button>
              </div>
          )}

        </div>
      </main>

      {step < 4 && (
        <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50 pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
                <div className={`p-2 pl-6 rounded-[2rem] border shadow-2xl flex items-center justify-between backdrop-blur-xl ${isDark ? 'bg-zinc-900/80 border-zinc-700/50' : 'bg-white/90 border-slate-200'}`}>
                    {step > 0 ? (
                        <button onClick={()=>setStep(step-1)} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white"><ChevronLeft size={20}/></button>
                    ) : (
                        <div className="text-xs font-bold opacity-50 uppercase tracking-widest">Passo {step + 1}/4</div>
                    )}
                    <Button onClick={handleNextStep} size="lg" className="rounded-[1.5rem]" shimmer>{step === 3 ? T.book_btn : T.next_btn} <ArrowRight size={18}/></Button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL DE BOAS VINDAS */}
      {welcomePopup && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={()=>setWelcomePopup(false)}>
             <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] max-w-sm w-full text-center relative overflow-hidden animate-scale-in shadow-2xl">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
                 <Gift size={48} className="text-amber-500 mx-auto mb-4 animate-bounce" />
                 <h2 className="text-2xl font-black mb-2 text-white">Presente Exclusivo!</h2>
                 <p className="text-zinc-400 text-sm mb-6">Para sua primeira experiência ser inesquecível, liberamos um cupom especial.</p>
                 <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 mb-6 font-mono text-xl font-bold text-amber-500 tracking-widest">WELCOME10</div>
                 <Button full onClick={()=>{setWelcomePopup(false); setUser(u=>({...u, hasSeenWelcome: true}));}}>PEGAR MEU PRESENTE</Button>
             </div>
         </div>
      )}

      <style>{`.mask-linear-fade { mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); } .scrollbar-hide::-webkit-scrollbar{display:none} .animate-fade-in{animation:fadeIn 0.6s ease-out} .animate-slide-in{animation:slideIn 0.5s cubic-bezier(0.16,1,0.3,1)} .animate-scale-in{animation:scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)} .animate-marquee{animation:marquee 25s linear infinite} @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}} @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}} @keyframes scaleIn{from{transform:scale(0.9);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}
