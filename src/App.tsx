import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Aperture, Camera, Film, 
  Clock, Zap, X, Globe, MapPin, Calendar, Smartphone, Crown, 
  LayoutList, Package, Image as ImageIcon, User, Share2, 
  Sparkles, Heart, Sun, Moon, Loader2, ChevronLeft, CreditCard, 
  QrCode, Banknote, ShieldCheck, Tag, Info, Gift, Trophy
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA LENS OS v1.0 - PHOTOGRAPHY BOOKING SYSTEM
 * ==================================================================================
 * Template White-Label para Fotógrafos.
 * Design: Glassmorphism Avançado (Apple Vision Pro Style).
 * Foco: Conversão de High-Ticket e Experiência Visual.
 */

const CONFIG = {
  PHOTOGRAPHER_NAME: "Lumina Studio",
  PHONE: "5511999999999", 
  INSTAGRAM_URL: "https://instagram.com/",
  STORAGE_KEY: '@lumina_app_v1',
  LOCALE_PT: 'pt-BR',
  CURRENCY: 'R$'
};

// ==================================================================================
// 1. DESIGN SYSTEM & COMPONENTS
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl select-none touch-manipulation overflow-hidden active:scale-[0.98]";
  
  const variants = {
    primary: "bg-white text-black shadow-[0_0_20px_-5px_rgba(255,255,255,0.5)] hover:bg-slate-50 border border-white/50",
    secondary: "bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-black/40 hover:border-white/20",
    whatsapp: "bg-[#25D366] text-white shadow-lg shadow-green-500/20 hover:bg-[#20bd5a] border border-green-400/20",
    ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/5",
    glass: "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 shadow-lg"
  };
  
  const sizes = { 
    sm: "h-9 text-[10px] px-3", 
    md: "h-12 text-xs px-5 uppercase tracking-widest", 
    lg: "h-14 text-sm px-6 uppercase tracking-widest", 
    xl: "h-16 text-sm font-bold uppercase tracking-[0.2em]", 
    icon: "h-10 w-10 p-0 flex-shrink-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''}`}>
      {loading ? <Loader2 size={18} className="animate-spin text-current"/> : (
        <>
          {Icon && <Icon size={18} className={children ? "mr-2 opacity-90 flex-shrink-0" : ""} strokeWidth={2} />}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error }) => (
  <div className="space-y-2 w-full group">
    {label && <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-white/50 group-focus-within:text-white transition-colors">{label}</label>}
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors z-10">{Icon && <Icon size={18} />}</div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full pl-12 pr-4 py-4 rounded-xl outline-none text-sm font-medium transition-all duration-300 
        bg-black/20 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 
        focus:bg-black/40 focus:border-white/30 focus:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)]
        ${error ? 'border-red-500/50 text-red-200' : ''}`} 
      />
    </div>
    {error && <p className="text-red-400 text-[10px] ml-2 font-bold animate-pulse">{error}</p>}
  </div>
);

// Card com suporte a Imagem de Fundo (Glassmorphism Overlay)
const ServiceCard = ({ children, className = '', onClick, active = false, bgImage }) => (
  <div 
    onClick={onClick} 
    className={`relative group overflow-hidden rounded-[1.5rem] transition-all duration-500
    ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''} 
    ${active 
        ? 'ring-2 ring-white/50 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] scale-[1.01]' 
        : 'hover:ring-1 hover:ring-white/20 hover:scale-[1.01]'} 
    ${className}`}
  >
    {/* Background Image with Overlay */}
    {bgImage && (
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="bg" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" />
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-500 ${active ? 'opacity-90' : 'opacity-80'}`} />
      </div>
    )}
    
    {/* Glass Content */}
    <div className={`relative z-10 p-6 h-full flex flex-col justify-end backdrop-blur-[2px] ${!bgImage && 'bg-white/5 border border-white/10'}`}>
      {children}
    </div>
  </div>
);

const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 6 + 2,
      h: Math.random() * 6 + 2,
      color: ['#ffffff', '#a1a1aa', '#fbbf24'][Math.floor(Math.random() * 3)], 
      speed: Math.random() * 4 + 2,
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
// 2. DADOS (PHOTOGRAPHY ORIENTED)
// ==================================================================================

const DATA = {
    levels: [
        { level: 1, xpNeeded: 0, reward: 0, title: "Observador" },
        { level: 2, xpNeeded: 1500, reward: 50, title: "Muse" },
        { level: 3, xpNeeded: 3500, reward: 150, title: "Icon" },
        { level: 4, xpNeeded: 8000, reward: 300, title: "Legend" }
    ],
    // Images from Unsplash for Demo purposes
    services: [
        { 
          id: 'portrait', min: 60, price: 450, icon: User, tag: "ESSENCIAL",
          title: "Retrato Singular",
          img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
          desc: "Sua imagem, sua marca. Ideal para LinkedIn, Redes Sociais e Branding Pessoal.",
          details: `O PODER DA SUA IMAGEM:
• DURAÇÃO: 1 hora de ensaio (Estúdio ou Externo).
• ENTREGÁVEIS: 10 Fotos com tratamento High-End + Galeria Online.
• ESTILO: Direção de poses completa para valorizar sua melhor versão.
• IDEAL PARA: Profissionais, Artistas e Criadores de Conteúdo.`
        },
        { 
          id: 'couple', min: 120, price: 890, icon: Heart, tag: "LOVE STORY",
          title: "Ensaio Casal",
          img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
          desc: "Conexão, risos e intimidade capturados em luz natural.",
          details: `UMA HISTÓRIA A DOIS:
• DURAÇÃO: Até 2 horas de captação (Golden Hour).
• ENTREGÁVEIS: 30 Fotos Editadas + Slideshow Musical.
• LOCAL: Sugestão de locações cinematográficas.
• VIBE: Espontânea, sem poses rígidas. Foco na química do casal.`
        },
        { 
          id: 'branding', min: 180, price: 1400, icon: Aperture, tag: "BUSINESS",
          title: "Branding Visual",
          img: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
          desc: "Um banco de imagens completo para 3 meses de conteúdo.",
          details: `ESTRATÉGIA VISUAL:
• DURAÇÃO: 3 horas (Múltiplas trocas de look).
• ENTREGÁVEIS: 50 Fotos + 5 Short Videos (Reels) bastidores.
• FOCO: Detalhes, lifestyle, ferramentas de trabalho e retratos.
• BÔNUS: Guia de Estilo e Paleta de Cores.`
        }
    ],
    plans: [
        { 
          id: 'pack_wedding', type: 'pack', title: "Wedding Collection", 
          price: 3500, fullPrice: 4200, savings: 700,
          desc: "Cobertura completa: Pré-Wedding + Cerimônia.",
          details: "A narrativa completa do seu grande dia. Inclui Ensaio Pré-Wedding (2h) + Cobertura de 6h no dia do evento. Entrega em Pendrive de Cristal + Box Personalizado.", 
          tag: "NOIVAS", icon: Crown 
        },
        { 
          id: 'subscription_content', type: 'subscription', title: "Creator Club", 
          price: 900, fullPrice: 1350, savings: 450,
          desc: "Mensalidade: 1 Ensaio Mensal para manter seu feed impecável.",
          details: "Para quem não pode parar. Garanta 1 ensaio de 2h todo mês com prioridade na agenda e edição express (48h).", 
          tag: "CREATORS", icon: Zap 
        }
    ],
    extras: [
        { id: 'makeup', price: 250, icon: Sparkles, label: "Make & Hair Profissional", desc: "Produção completa no local." },
        { id: 'express', price: 150, icon: Clock, label: "Edição Express (24h)", desc: "Receba as prévias no dia seguinte." },
        { id: 'album', price: 600, icon: Film, label: "Álbum Impresso (20x20)", desc: "Capa dura, 20 lâminas." }
    ],
    reviews: [
        { n: "Mariana S.", loc: "São Paulo", t: "As fotos transformaram meu perfil. Ganhei autoridade imediata com meus clientes.", s: 5 },
        { n: "Pedro & Ana", loc: "Campinas", t: "Ele nos deixou super à vontade. As fotos ficaram naturais, nada daquela coisa forçada.", s: 5 },
        { n: "TechStart", loc: "Corporate", t: "Contratamos para o time todo. Profissionalismo ímpar e entrega rápida.", s: 5 },
        { n: "Camila R.", loc: "Influencer", t: "O plano mensal salvou minha vida. Tenho conteúdo pro mês todo num só dia.", s: 5 }
    ],
    text: {
        loading: "REVELANDO O FILME...",
        welcome: "Olá,",
        subtitle: "Não é apenas uma foto. É o seu legado visual.",
        tab_single: "Sessões",
        tab_packs: "Collections & Clubs",
        input_name: "Quem será fotografado?",
        input_loc_type: "Tipo de Locação",
        input_addr: "Onde será o ensaio?",
        pay_title: "Garanta sua Data",
        coupon_title: "Possui um Voucher?",
        scarcity_msg: "datas restando este mês",
        terms: [
            "1. RESERVA: A data só é bloqueada mediante sinal de 30%.",
            "2. PRAZOS: Prévias em 48h. Galeria completa em 10 dias úteis.",
            "3. DIREITOS: O uso das imagens é permitido para autopromoção.",
            "4. REAGENDAMENTO: Gratuito com 72h de antecedência."
        ]
    }
};

// ==================================================================================
// 3. MAIN APP
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [activeTab, setActiveTab] = useState('single');
  const [showConfetti, setShowConfetti] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [toasts, setToasts] = useState([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(null); // Shows image preview
  
  const scrollRef = useRef(null);

  // USER & BOOKING STATE
  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], usedCoupons: [], 
      ordersCount: 0
  });

  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'external', 
    address: { city: '', district: '', street: '', number: '', ref: '' },
    payment: '', appliedCoupon: null, termsAccepted: false,
    mood: '' // New field for photography mood
  });

  // INITIALIZATION
  useEffect(() => {
    setTimeout(() => setLoading(false), 2500);
    const s = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (s) {
        try { setUser({...user, ...JSON.parse(s)}); } catch(e){}
    }
  }, []);

  useEffect(() => { 
     localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); 
  }, [user]);

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  // UTILS
  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleSelectItem = (type, item) => {
      setBooking(prev => ({ ...prev, type: type, item: item, extras: {}, payment: '', termsAccepted: false }));
      if(window.navigator.vibrate) window.navigator.vibrate(50);
  };

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0 };
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => { 
        if(booking.extras[k]) {
            const extData = DATA.extras.find(e=>e.id===k);
            if(extData) sub += extData.price; 
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sub - disc);
    return { sub, disc, total };
  }, [booking.item, booking.extras, booking.appliedCoupon]);

  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : 'A combinar';
    
    const msg = `
📸 *NOVA SOLICITAÇÃO DE ENSAIO*
──────────────────────
👤 *Cliente:* ${user.name}
🎞️ *Serviço:* ${booking.item.title}
${booking.type !== 'single' ? `📦 *Pacote:* ${booking.item.desc}` : ''}

🗓️ *Data Desejada:* ${dateStr} - ${booking.time}
📍 *Local:* ${booking.locationType === 'studio' ? 'Estúdio' : `${booking.address.city} - ${booking.address.district}`}
🎨 *Vibe/Mood:* ${booking.mood || 'A definir'}

✨ *Adicionais:*
${Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> `+ ${DATA.extras.find(e=>e.id===k).label}`).join('\n') || 'Nenhum'}
──────────────────────
💰 *Investimento Total:* R$ ${f.total},00
💳 *Pagamento:* ${booking.payment.toUpperCase()}
🏆 *Status Cliente:* ${user.xp > 1500 ? 'VIP Member' : 'Novo'}

Aguardo a confirmação da agenda!
`.trim();
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const handleNextStep = () => {
      if (step === 0 && !booking.item) return addToast("Selecione uma experiência primeiro.", "error");
      if (step === 1 && (!booking.date || !booking.time)) return addToast("Escolha uma data e horário.", "error");
      if (step === 2 && !user.name) return addToast("Preciso saber seu nome.", "error");
      if (step === 3 && !booking.termsAccepted) return addToast("Aceite os termos para continuar.", "error");
      
      if (step === 3) {
          // Finish
          const newXP = user.xp + (booking.item.price * 0.1); // 10% XP
          setUser(u => ({...u, xp: newXP, ordersCount: u.ordersCount + 1}));
          setShowConfetti(true);
          setStep(4);
          window.open(generateWhatsAppLink(), '_blank');
      } else {
          setStep(s => s + 1);
      }
  };

  const currentLevel = DATA.levels.slice().reverse().find(l => user.xp >= l.xpNeeded) || DATA.levels[0];
  const nextLevel = DATA.levels.find(l => l.xpNeeded > user.xp);
  const progressPercent = nextLevel ? ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100 : 100;

  // RENDER LOADING
  if (loading) return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black text-white">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse"></div>
            <Aperture size={64} className="relative z-10 animate-spin-slow text-white/90" strokeWidth={1} />
        </div>
        <div className="flex items-center gap-3 text-xs font-bold tracking-[0.3em] opacity-50 uppercase animate-pulse">
            {DATA.text.loading}
        </div>
      </div>
  );

  return (
    <div className="h-[100dvh] w-full font-sans flex flex-col overflow-hidden bg-black text-white selection:bg-white/30">
      
      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[80%] h-[40%] bg-slate-800/20 blur-[100px] rounded-full"></div>
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
      </div>

      <Confetti active={showConfetti} />

      {/* TOASTS */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] w-full max-w-xs pointer-events-none flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl animate-slide-down">
            {t.type === 'success' ? <Check size={16} className="text-green-400"/> : <ShieldCheck size={16} className="text-red-400"/>}
            <span className="text-xs font-medium">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <header className="h-20 px-6 flex items-center justify-between z-20 shrink-0 relative">
        <div className="flex flex-col">
            <span className="font-light text-xl tracking-tight text-white leading-none">Lumina<span className="font-bold opacity-50">.lens</span></span>
        </div>
        <div className="flex gap-3">
            <Button variant="glass" size="icon" onClick={() => window.open(CONFIG.INSTAGRAM_URL)} icon={LayoutList} />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth relative z-10 px-4">
        <div className="max-w-md mx-auto space-y-8 pt-4">

          {/* STEP 0: CATALOG & HOME */}
          {step === 0 && (
            <div className="animate-fade-in space-y-10">
              
              {/* HERO SECTION */}
              <div className="relative rounded-[2rem] overflow-hidden min-h-[380px] flex flex-col justify-end p-8 group border border-white/10 shadow-2xl">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" alt="Hero" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                </div>
                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/80">
                        <Sparkles size={12} className="text-amber-300" />
                        <span>Agenda 2026 Aberta</span>
                    </div>
                    <h1 className="text-4xl font-light leading-none tracking-tight">
                        Eternizando <br/><span className="font-bold italic font-serif">Momentos.</span>
                    </h1>
                    <p className="text-sm font-light text-white/70 max-w-[280px] leading-relaxed">
                        {DATA.text.subtitle}
                    </p>
                </div>
              </div>

              {/* LOYALTY BAR */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-3">
                      <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-white/40">Legacy Club</p>
                          <p className="font-bold text-lg">{currentLevel.title}</p>
                      </div>
                      <div className="text-right">
                          <p className="font-mono text-xl">{user.xp} XP</p>
                      </div>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000 ease-out" style={{width: `${progressPercent}%`}}></div>
                  </div>
                  <p className="text-[10px] text-white/40 mt-2 text-center">
                      {nextLevel ? `Faltam ${nextLevel.xpNeeded - user.xp} XP para ${nextLevel.title}` : 'Nível Máximo Alcançado'}
                  </p>
              </div>

              {/* TABS */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <button onClick={()=>setActiveTab('single')} className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab==='single' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}>{DATA.text.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab==='packs' ? 'bg-white text-black shadow-lg' : 'text-white/50 hover:text-white'}`}>{DATA.text.tab_packs}</button>
              </div>

              {/* LIST */}
              <div className="space-y-6">
                {activeTab === 'single' ? DATA.services.map(s => (
                    <ServiceCard key={s.id} onClick={() => handleSelectItem('single', s)} active={booking.item?.id === s.id} bgImage={s.img}>
                        <div className="space-y-1">
                            {s.tag && <span className="inline-block px-2 py-1 bg-white text-black text-[9px] font-bold uppercase tracking-wider rounded-md mb-2">{s.tag}</span>}
                            <h3 className="text-2xl font-light text-white">{s.title}</h3>
                            <div className="flex items-center gap-3 text-[11px] font-medium text-white/80 uppercase tracking-widest">
                                <span className="flex items-center gap-1"><Clock size={12}/> {s.min} min</span>
                                <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                                <span>{CONFIG.CURRENCY} {s.price}</span>
                            </div>
                        </div>
                    </ServiceCard>
                )) : DATA.plans.map(p => (
                    <ServiceCard key={p.id} onClick={() => handleSelectItem(p.type, p)} active={booking.item?.id === p.id} className="bg-gradient-to-br from-gray-900 to-black">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/10 rounded-xl text-white border border-white/10"><p.icon size={24}/></div>
                            <div className="text-right">
                                <span className="block text-xl font-bold">{CONFIG.CURRENCY} {p.price}</span>
                                <span className="text-[10px] line-through text-white/40">{CONFIG.CURRENCY} {p.fullPrice}</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                        <p className="text-xs text-white/60 leading-relaxed mb-4">{p.desc}</p>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-white/50 leading-relaxed">
                            {p.details}
                        </div>
                    </ServiceCard>
                ))}
              </div>

              {/* REVIEWS SCROLL */}
              <div className="pt-8 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-50">O que dizem</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {DATA.reviews.map((r, i) => (
                          <div key={i} className="min-w-[260px] p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                              <div className="flex gap-1 mb-3 text-amber-400">
                                  {[...Array(5)].map((_,k) => <Star key={k} size={10} fill="currentColor"/>)}
                              </div>
                              <p className="text-sm italic text-white/80 mb-4 leading-relaxed">"{r.t}"</p>
                              <div className="flex items-center gap-2 opacity-50">
                                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">{r.n[0]}</div>
                                  <span className="text-[10px] font-bold uppercase tracking-wider">{r.n}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
            </div>
          )}

          {/* STEP 1: DATE & TIME */}
          {step === 1 && (
             <div className="animate-slide-in space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl font-light mb-2">Disponibilidade</h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Selecione o dia ideal</p>
                </div>

                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return (
                            <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`min-w-[70px] h-24 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${isSel ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                                <span className="text-[9px] font-bold uppercase tracking-widest">{d.toLocaleDateString(CONFIG.LOCALE_PT, {weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-light">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>

                {booking.date && (
                    <div className="grid grid-cols-3 gap-3 animate-fade-in">
                        {['09:00','11:00','14:00','16:00'].map(t => (
                            <button key={t} onClick={() => setBooking(b => ({...b, time: t}))} className={`py-4 rounded-xl text-xs font-medium border transition-all ${booking.time === t ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                )}
             </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
              <div className="animate-slide-in space-y-8">
                  <div className="text-center mb-6">
                      <h2 className="text-2xl font-light">Detalhes da Sessão</h2>
                  </div>
                  
                  <div className="space-y-5">
                      <InputField label={DATA.text.input_name} icon={User} value={user.name} onChange={e=>setUser({...user, name:e.target.value})} placeholder="Seu nome completo" />
                      
                      <div className="grid grid-cols-2 gap-3">
                          <button onClick={()=>setBooking({...booking, locationType: 'studio'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${booking.locationType === 'studio' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
                              <Aperture size={20}/> <span className="text-[10px] font-bold uppercase">Estúdio</span>
                          </button>
                          <button onClick={()=>setBooking({...booking, locationType: 'external'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${booking.locationType === 'external' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40'}`}>
                              <Globe size={20}/> <span className="text-[10px] font-bold uppercase">Externo</span>
                          </button>
                      </div>

                      {booking.locationType === 'external' && (
                          <div className="animate-fade-in space-y-3">
                              <InputField label="Cidade" icon={MapPin} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address:{...b.address, city:e.target.value}}))} placeholder="Ex: São Paulo" />
                              <InputField label="Bairro/Local" value={booking.address.district} onChange={e=>setBooking(b=>({...b, address:{...b.address, district:e.target.value}}))} placeholder="Ex: Parque Ibirapuera" />
                          </div>
                      )}

                      <InputField label="Mood / Inspiração" icon={Camera} value={booking.mood} onChange={e=>setBooking({...booking, mood:e.target.value})} placeholder="Ex: Urbano, Romântico, Minimalista..." />
                  </div>

                  <div className="pt-6 border-t border-white/10">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">Adicionais</h3>
                      <div className="space-y-3">
                          {DATA.extras.map(ex => (
                              <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${booking.extras[ex.id] ? 'bg-white/10 border-white text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'}`}>
                                  <div className="flex items-center gap-3">
                                      <ex.icon size={18} />
                                      <div><p className="text-xs font-bold">{ex.label}</p><p className="text-[10px] opacity-60">{ex.desc}</p></div>
                                  </div>
                                  <span className="text-[10px] font-bold">+ {CONFIG.CURRENCY}{ex.price}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {/* STEP 3: REVIEW & PAYMENT */}
          {step === 3 && (
              <div className="animate-slide-in space-y-8 pb-10">
                  <div className="relative p-8 rounded-[2rem] border border-white/20 bg-gradient-to-br from-white/10 to-black/40 backdrop-blur-2xl overflow-hidden shadow-2xl">
                      {/* Artistic decoration */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full"></div>
                      
                      <div className="relative z-10">
                          <span className="inline-block px-2 py-1 rounded bg-white/10 text-[9px] font-bold uppercase tracking-widest mb-4">Resumo do Pedido</span>
                          <h2 className="text-2xl font-bold mb-1">{booking.item.title}</h2>
                          <p className="text-sm text-white/60 mb-6 flex items-center gap-2"><Calendar size={14}/> {new Date(booking.date).toLocaleDateString(CONFIG.LOCALE_PT)} • {booking.time}</p>

                          <div className="space-y-3 mb-8">
                               <div className="flex justify-between text-xs text-white/70 border-b border-white/10 pb-2">
                                   <span>Investimento Base</span>
                                   <span>{CONFIG.CURRENCY} {booking.item.price}</span>
                               </div>
                               {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => (
                                   <div key={k} className="flex justify-between text-xs text-white/70">
                                       <span>+ {DATA.extras.find(e=>e.id===k).label}</span>
                                       <span>{DATA.extras.find(e=>e.id===k).price}</span>
                                   </div>
                               ))}
                               {booking.appliedCoupon && (
                                   <div className="flex justify-between text-xs text-green-400 font-bold">
                                       <span>Cupom Aplicado</span>
                                       <span>- {CONFIG.CURRENCY} {booking.appliedCoupon.val}</span>
                                   </div>
                               )}
                          </div>

                          <div className="flex justify-between items-end">
                              <div>
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block mb-1">Total Estimado</span>
                                  <span className="text-3xl font-light">{CONFIG.CURRENCY} {financials.total}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Forma de Pagamento</h3>
                      <div className="grid grid-cols-2 gap-3">
                          <button onClick={()=>setBooking({...booking, payment:'pix'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${booking.payment==='pix'?'bg-white text-black':'bg-white/5 border-white/10 text-white/50'}`}>
                              <QrCode size={20}/> <span className="text-[10px] font-bold uppercase">Pix</span>
                          </button>
                          <button onClick={()=>setBooking({...booking, payment:'card'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${booking.payment==='card'?'bg-white text-black':'bg-white/5 border-white/10 text-white/50'}`}>
                              <CreditCard size={20}/> <span className="text-[10px] font-bold uppercase">Cartão</span>
                          </button>
                      </div>
                  </div>

                  <div className="flex gap-2">
                    <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder="CÓDIGO PROMOCIONAL" className="flex-1 bg-transparent border border-white/20 rounded-xl px-4 text-xs font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:border-white transition-colors outline-none"/>
                    <Button variant="secondary" onClick={() => {
                        if(couponInput === 'LUMINA') {
                            setBooking(b=>({...b, appliedCoupon: {val: 50, code: 'LUMINA'}}));
                            addToast("Cupom de R$ 50 aplicado!");
                        } else {
                            addToast("Cupom inválido", "error");
                        }
                    }}>Aplicar</Button>
                  </div>

                  <div 
                    onClick={() => setBooking(b => ({...b, termsAccepted: !b.termsAccepted}))}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${booking.termsAccepted ? 'bg-white/10 border-white/30' : 'bg-transparent border-white/10 opacity-70'}`}
                  >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${booking.termsAccepted ? 'bg-white border-white text-black' : 'border-white/40'}`}>
                          {booking.termsAccepted && <Check size={14} strokeWidth={3}/>}
                      </div>
                      <div className="text-xs text-white/70 leading-relaxed">
                          Concordo com os <span className="underline text-white font-bold">Termos de Reserva</span> e Política de Cancelamento.
                      </div>
                  </div>
              </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
              <div className="flex flex-col items-center justify-center pt-20 text-center animate-scale-in">
                  <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                      <Camera size={40} strokeWidth={1.5} />
                  </div>
                  <h1 className="text-3xl font-light mb-4">Solicitação Enviada</h1>
                  <p className="text-sm text-white/60 max-w-xs mx-auto leading-relaxed mb-10">
                      Recebi seu interesse. Agora é só finalizar os detalhes diretamente comigo no WhatsApp para garantir sua data.
                  </p>
                  <Button variant="whatsapp" full size="xl" icon={MessageCircle} onClick={() => window.open(generateWhatsAppLink(), '_blank')}>
                      Abrir WhatsApp
                  </Button>
                  <button onClick={() => { setStep(0); setBooking({...booking, item: null}); }} className="mt-8 text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white transition-colors">
                      Voltar ao Início
                  </button>
              </div>
          )}

        </div>
      </main>

      {/* FOOTER NAV */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 w-full z-50 p-4 pb-8 bg-gradient-to-t from-black via-black/90 to-transparent">
            <div className="max-w-md mx-auto flex items-center gap-3">
                {step > 0 && (
                    <Button variant="secondary" size="icon" onClick={() => setStep(s => s - 1)} icon={ChevronLeft} />
                )}
                <Button full variant="primary" size="lg" onClick={handleNextStep}>
                    <div className="flex items-center justify-between w-full">
                        <span>{step === 3 ? "Finalizar Reserva" : "Continuar"}</span>
                        {booking.item && step < 3 && <span className="text-xs opacity-50">{CONFIG.CURRENCY} {financials.total}</span>}
                    </div>
                </Button>
            </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        .animate-slide-in { animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-down { animation: slideDown 0.4s ease-out; }
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
