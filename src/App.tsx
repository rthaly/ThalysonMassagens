import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera, ArrowRight, Calendar, Clock, User, Instagram, 
  Check, X, MessageCircle, Play, Star,
  ShieldCheck, Sparkles, Loader2, Aperture, Menu, Crown,
  Zap, Film, Monitor, Quote, MousePointer2, Maximize2
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA CINEMATIC OS v7.0 - FINAL PRODUCTION
 * ==================================================================================
 * Status: Stable
 * Assets: Verified High-Res Videos & Images
 * UX: Mobile-First, One Page Scroll, Booking Engine
 */

// --- 1. CONFIGURATION & ASSETS ---

const CONFIG = {
  PHONE: "5517991360413", 
  CURRENCY: 'R$',
  LOCALE: 'pt-BR',
  BRAND: "Lumina Studio"
};

const DATA = {
  // VÍDEO HERO: Backstage de moda, alta qualidade, loop suave.
  heroVideo: "https://videos.pexels.com/video-files/3205914/3205914-hd_1920_1080_25fps.mp4",
  heroPoster: "https://images.pexels.com/videos/3205914/free-video-3205914.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",

  // Imagem do Fotógrafo/Sobre
  aboutImage: "https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&w=1200&q=90",

  stats: [
    { label: "Ensaios Realizados", value: "850+" },
    { label: "Prêmios Internacionais", value: "14" },
    { label: "Anos de Mercado", value: "8" }
  ],

  services: [
    {
      id: 'portrait',
      title: "Signature Portrait",
      price: 490,
      oldPrice: 650,
      duration: "1h",
      desc: "Sua imagem pessoal elevada ao nível de arte. Ideal para branding pessoal, LinkedIn e posicionamento de autoridade.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      features: ["10 Fotos High-End", "1 Look Completo", "Direção de Poses", "Galeria Vitalícia"],
      tag: "POPULAR"
    },
    {
      id: 'editorial',
      title: "Vogue Experience",
      price: 990,
      oldPrice: 1400,
      duration: "2h",
      desc: "Sinta-se em uma capa de revista. Produção artística completa, luz cinematográfica e direção de moda.",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
      features: ["30 Fotos Fine Art", "3 Trocas de Look", "Fashion Film (15s)", "Guia de Estilo"],
      tag: "BEST SELLER"
    },
    {
      id: 'brand',
      title: "Empire Branding",
      price: 1890,
      oldPrice: 2500,
      duration: "4h",
      desc: "Banco de imagens estratégico para 3 meses de conteúdo. Pare de se preocupar com o que postar.",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      features: ["50 Fotos + Guia", "Looks Ilimitados", "Make & Hair Incluso", "Planejamento Feed"],
      tag: "BUSINESS"
    }
  ],

  extras: [
    { id: 'video', label: "Cinematic Teaser 4K", price: 400, desc: "Vídeo vertical (Reels) de 45s", icon: Film },
    { id: 'express', label: "Rush Delivery (24h)", price: 200, desc: "Fotos entregues no dia seguinte", icon: Zap },
    { id: 'makeup', label: "Make & Hair Extra", price: 300, desc: "Produção adicional no set", icon: User }
  ],

  // Portfólio Rico e Completo
  portfolio: [
    { id: 1, cat: "Editorial", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=90" },
    { id: 2, cat: "Love", src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=90" },
    { id: 3, cat: "Portrait", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=90" },
    { id: 4, cat: "Urban", src: "https://images.unsplash.com/photo-1519744531242-c10a2295d8be?w=1200&q=90" },
    { id: 5, cat: "Studio", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=90" },
    { id: 6, cat: "Fashion", src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=90" }
  ],

  reviews: [
    { name: "Julia M.", role: "CEO", txt: "O resultado superou todas as expectativas. Minha marca pessoal subiu de nível instantaneamente.", stars: 5 },
    { name: "Lucas F.", role: "Modelo", txt: "Direção impecável. Ele sabe exatamente como extrair o melhor ângulo.", stars: 5 },
    { name: "Agência V.", role: "Parceiro", txt: "Nosso fotógrafo de confiança. Entrega rápida e qualidade surreal.", stars: 5 }
  ],

  levels: [
    { level: 1, title: "Member", min: 0, color: "text-zinc-400" },
    { level: 2, title: "VIP", min: 1500, color: "text-amber-400" },
    { level: 3, title: "Gold", min: 3000, color: "text-purple-400" }
  ]
};

// --- 2. UI COMPONENTS ---

const Button = ({ children, variant = 'primary', size = 'md', full = false, icon: Icon, onClick, className = '', disabled, loading }: any) => {
  const base = "relative flex items-center justify-center font-bold tracking-wider transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] overflow-hidden group";
  const variants: any = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]",
    secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/20 backdrop-blur-md",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-lg shadow-green-900/20 border border-green-500/20",
    outline: "border border-white/30 text-white hover:border-white hover:bg-white/5"
  };
  const sizes: any = {
    sm: "h-10 text-[10px] px-4 uppercase",
    md: "h-12 text-xs px-6 uppercase",
    lg: "h-14 text-sm px-8 uppercase",
    xl: "h-16 text-base px-8 uppercase tracking-[0.2em]"
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10"></div>
      {loading ? <Loader2 className="animate-spin" size={20}/> : (
        <div className="flex items-center gap-2 relative z-20">
          {Icon && <Icon size={18} strokeWidth={2.5} />}
          {children}
        </div>
      )}
    </button>
  );
};

const SectionTitle = ({ sub, title, desc, align = 'center' }: any) => (
  <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'} animate-on-scroll`}>
    <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 mb-6 backdrop-blur-md">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      {sub}
    </span>
    <h2 className="text-4xl md:text-6xl font-light text-white leading-[1.1] mb-6">
      {title}
    </h2>
    {desc && <p className={`text-white/50 text-sm md:text-base leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>{desc}</p>}
  </div>
);

// --- 3. LIGHTBOX COMPONENT ---
const Lightbox = ({ image, onClose }: { image: any, onClose: () => void }) => {
  if (!image) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50">
        <X size={24} className="text-white"/>
      </button>
      <img src={image.src} alt={image.cat} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scale-in"/>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
        {image.cat} Collection
      </div>
    </div>
  );
};

// --- 4. MAIN APP ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('home');
  
  // BOOKING STATE
  const [booking, setBooking] = useState({
    serviceId: '',
    date: null as Date | null,
    time: null as string | null,
    extras: {} as Record<string, boolean>,
    client: { name: '', instagram: '' },
    xp: 2200 // Mock XP para gamificação
  });

  useEffect(() => {
    // Intro animada
    setTimeout(() => setLoading(false), 2000);

    const handleScroll = () => {
      const sections = ['home', 'about', 'portfolio', 'services', 'booking'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) { const rect = el.getBoundingClientRect(); return rect.top >= -300 && rect.top <= 300; }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CALCULOS
  const selectedService = DATA.services.find(s => s.id === booking.serviceId);
  const total = useMemo(() => {
    let val = selectedService ? selectedService.price : 0;
    Object.keys(booking.extras).forEach(k => {
      if(booking.extras[k]) val += DATA.extras.find(e => e.id === k)?.price || 0;
    });
    return val;
  }, [booking.serviceId, booking.extras]);

  const selectService = (id: string) => {
    setBooking(prev => ({ ...prev, serviceId: id }));
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCheckout = () => {
    if(!selectedService || !booking.date || !booking.time || !booking.client.name) return;
    const dateStr = booking.date.toLocaleDateString(CONFIG.LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => `+ ${DATA.extras.find(e=>e.id===k)?.label}`).join('\n');
    
    const msg = `
✨ *NOVA RESERVA VIP* ✨
──────────────────────
👤 *CLIENTE*
Nome: *${booking.client.name}*
Insta: ${booking.client.instagram || 'N/A'}

📸 *EXPERIÊNCIA*
Serviço: *${selectedService.title.toUpperCase()}*
Duração: ${selectedService.duration}

🗓 *AGENDA*
${dateStr} às ${booking.time}

⭐ *ADICIONAIS*
${extrasList || 'Nenhum'}
──────────────────────
💎 *INVESTIMENTO: ${CONFIG.CURRENCY} ${total},00*
💳 *Status:* Aguardando Link

*ID:* #${Math.floor(Math.random()*9999)}
`.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const currentLevel = [...DATA.levels].reverse().find(l => booking.xp >= l.min) || DATA.levels[0];
  const nextLevel = DATA.levels.find(l => l.min > booking.xp);
  const progress = nextLevel ? ((booking.xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  if (loading) return (
    <div className="fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full animate-pulse"></div>
        <div className="relative w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center animate-[spin_10s_linear_infinite]">
            <Aperture size={64} className="text-white relative z-10 animate-[pulse_2s_infinite]" strokeWidth={0.5}/>
        </div>
      </div>
      <div className="h-[1px] w-48 bg-white/10 overflow-hidden">
        <div className="h-full bg-white animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>
      <p className="mt-6 text-[10px] font-bold tracking-[0.5em] text-white/50 uppercase">Carregando Estúdio</p>
    </div>
  );

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-white/30 overflow-x-hidden relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-900/10 blur-[150px] rounded-full opacity-40"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full opacity-40"></div>
      </div>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 w-full h-24 px-6 md:px-12 flex items-center justify-between z-50 transition-all duration-500 ${activeSection !== 'home' ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
          <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center transition-transform group-hover:rotate-180 duration-700">
            <Aperture size={20} strokeWidth={2}/>
          </div>
          <span className="text-xl font-light tracking-tighter">Lumina<span className="font-bold">.OS</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-md">
          {['Home', 'Portfolio', 'Serviços', 'Booking'].map((item) => (
            <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({behavior:'smooth'})} className={`text-xs uppercase font-bold tracking-widest hover:text-white transition-all ${activeSection === item.toLowerCase() ? 'text-white' : 'text-white/40'}`}>
              {item}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <Button size="sm" variant="secondary" onClick={() => document.getElementById('booking')?.scrollIntoView({behavior:'smooth'})} className="hidden md:flex">Agendar</Button>
          <button className="md:hidden w-10 h-10 flex items-center justify-center text-white bg-white/10 rounded-full backdrop-blur-md" onClick={() => setMenuOpen(!menuOpen)}>
             {menuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         {['Home', 'Portfolio', 'Serviços', 'Booking'].map((item, i) => (
          <button key={item} style={{transitionDelay: `${i * 100}ms`}} onClick={() => { document.getElementById(item.toLowerCase())?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false); }} className={`text-4xl font-light text-white ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} transition-all duration-700`}>
            {item}
          </button>
        ))}
      </div>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative min-h-screen flex items-end pb-24 px-6 md:px-12 pt-32 overflow-hidden">
        <div className="absolute inset-0 z-0 scale-[1.02]">
          {/* VIDEO FIXED: Plays inline, muted, loop for movement */}
          <video 
            autoPlay loop muted playsInline 
            poster={DATA.heroPoster}
            className="w-full h-full object-cover opacity-60"
          >
            <source src={DATA.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/30 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Agenda 2026 Disponível
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-[0.9] tracking-tighter drop-shadow-2xl">
              Arte em <br/>
              <span className="font-serif italic font-medium bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">Movimento.</span>
            </h1>
            
            <p className="text-base md:text-lg text-white/80 max-w-lg leading-relaxed font-light backdrop-blur-sm p-4 rounded-xl border-l-2 border-white/20 bg-black/20">
              Não é apenas uma foto. É o seu legado visual. Fotografia high-end focada em branding, moda e posicionamento.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="xl" onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}>
                Explorar Planos <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform"/>
              </Button>
              <Button size="xl" variant="secondary" icon={Play} onClick={() => window.open(DATA.heroVideo, '_blank')}>
                Showreel
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-6 animate-fade-in-up delay-200">
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-64 hover:bg-white/10 transition-colors cursor-default">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500"><Crown size={20}/></div>
                   <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Nível Atual</span>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs font-bold">
                      <span>{currentLevel.title}</span>
                      <span>{booking.xp} XP</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" style={{width: `${progress}%`}}></div>
                   </div>
                   <p className="text-[10px] text-white/50 text-right">Próximo: {nextLevel?.title}</p>
                </div>
             </div>
             
             <div className="flex gap-4">
               {DATA.stats.map((s, i) => (
                 <div key={i} className="text-right">
                   <p className="text-3xl font-bold">{s.value}</p>
                   <p className="text-[10px] uppercase tracking-widest text-white/50">{s.label}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
          <MousePointer2 className="rotate-180"/>
        </div>
      </section>

      {/* --- BIO SECTION (PARALLAX EFFECT) --- */}
      <section id="about" className="py-32 px-6 md:px-12 relative overflow-hidden">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative group">
               <div className="absolute inset-0 bg-white/5 rotate-3 rounded-[2rem] group-hover:rotate-6 transition-transform duration-700"></div>
               <div className="relative rounded-[2rem] overflow-hidden aspect-[3/4]">
                 <img src={DATA.aboutImage} alt="Photographer" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"/>
               </div>
            </div>
            <div className="space-y-8">
               <SectionTitle align="left" sub="O Artista" title="Muito Além do Clique" desc="Com 8 anos de experiência em editoriais de moda e branding internacional, trago o olhar da alta costura para o seu posicionamento pessoal." />
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                     <Monitor size={24} className="mb-4 text-white/70"/>
                     <h4 className="text-lg font-light mb-2">Pós-Produção High-End</h4>
                     <p className="text-sm text-white/50">Tratamento de pele e cor nível editorial, mantendo a textura e a realidade.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                     <User size={24} className="mb-4 text-white/70"/>
                     <h4 className="text-lg font-light mb-2">Direção de Poses</h4>
                     <p className="text-sm text-white/50">Você não precisa ser modelo. Eu te guio em cada movimento e expressão.</p>
                  </div>
               </div>
               
               <div className="pt-6 border-t border-white/10">
                 <div className="flex items-center gap-4">
                   <img src={DATA.aboutImage} className="w-12 h-12 rounded-full object-cover border border-white/20"/>
                   <div>
                     <p className="text-sm font-bold">Thalyson Designer</p>
                     <p className="text-xs text-white/40 uppercase tracking-widest">Fotógrafo Principal</p>
                   </div>
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- PORTFOLIO (LIGHTBOX ACTIVATED) --- */}
      <section id="portfolio" className="py-32 px-6 md:px-12 bg-white/5 relative border-y border-white/5">
        <SectionTitle sub="Galeria" title="Acervo Visual" desc="Uma curadoria dos nossos melhores momentos." />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[350px]">
          {DATA.portfolio.map((item, i) => (
            <div 
              key={i} 
              onClick={() => setLightboxImage(item)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer ${i === 0 || i === 3 ? 'md:col-span-2' : ''}`}
            >
              <img src={item.src} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-4">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{item.cat}</span>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                  <Maximize2 size={20}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="services" className="py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none"></div>
        
        <SectionTitle sub="Investimento" title="Escolha seu Legado" desc="Pacotes desenhados para cada etapa da sua jornada." />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {DATA.services.map((s) => (
            <div 
              key={s.id} 
              onClick={() => selectService(s.id)} 
              className={`group relative p-1 rounded-[2rem] transition-all duration-500 hover:-translate-y-4 cursor-pointer
              ${booking.serviceId === s.id ? 'bg-gradient-to-b from-white via-white/50 to-transparent shadow-[0_0_50px_rgba(255,255,255,0.1)]' : 'bg-white/10 hover:bg-white/20'}`}
            >
              <div className="bg-[#050505] h-full rounded-[1.9rem] p-8 relative overflow-hidden flex flex-col border border-white/5">
                {/* Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full group-hover:bg-white/10 transition-colors"></div>
                
                {s.tag && (
                  <div className="absolute top-6 right-6 bg-white text-black text-[10px] font-bold uppercase px-3 py-1.5 rounded-full tracking-wider shadow-lg z-20">
                    {s.tag}
                  </div>
                )}
                
                <div className="mb-8 relative h-56 rounded-2xl overflow-hidden shadow-2xl">
                   <img src={s.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt=""/>
                   <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1.5 border border-white/10">
                     <Clock size={10}/> {s.duration}
                   </div>
                </div>

                <h3 className="text-2xl font-light mb-2">{s.title}</h3>
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold">{CONFIG.CURRENCY} {s.price}</span>
                  <span className="text-sm text-white/40 line-through decoration-white/20">{CONFIG.CURRENCY} {s.oldPrice}</span>
                </div>
                
                <p className="text-sm text-white/60 mb-8 leading-relaxed border-b border-white/5 pb-6">{s.desc}</p>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {s.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-white/80 group-hover:text-white transition-colors">
                      <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white group-hover:text-black transition-colors">
                        <Check size={10}/>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>

                <Button full variant={booking.serviceId === s.id ? 'primary' : 'secondary'} className={booking.serviceId === s.id ? 'animate-pulse' : ''}>
                  {booking.serviceId === s.id ? 'Experiência Selecionada' : 'Selecionar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- BOOKING ENGINE (DESKTOP OPTIMIZED) --- */}
      <section id="booking" className="py-32 px-6 md:px-12 max-w-6xl mx-auto relative">
        <SectionTitle sub="Agendamento" title="Sua Jornada Começa Aqui" desc="Finalize os detalhes. Seus dados estão seguros." />
        
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-20"></div>

          {/* Status Selection */}
          <div className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="flex items-center gap-6">
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all ${selectedService ? 'bg-white text-black scale-100' : 'bg-white/5 text-white/20 scale-95'}`}>
                 {selectedService ? <Check size={32}/> : <Aperture size={32} className="animate-spin-slow"/>}
               </div>
               <div>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Experiência Escolhida</p>
                 <h3 className="text-xl md:text-2xl font-light">{selectedService ? selectedService.title : 'Nenhuma selecionada'}</h3>
                 {selectedService && <p className="text-xs text-white/60 mt-1 hidden md:block">{selectedService.desc}</p>}
               </div>
             </div>
             <div className="text-right">
               <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-1">Valor Atual</p>
               <p className="text-3xl font-bold">{CONFIG.CURRENCY} {total}</p>
             </div>
          </div>

          {selectedService ? (
            <div className="space-y-12 animate-fade-in-up">
              
              {/* 1. Date Selection (Responsive Grid/Scroll) */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 border-b border-white/5 pb-12">
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Calendar size={16} className="text-white/50"/> Selecione a Data</h3>
                   
                   {/* FIXED GRID FOR DESKTOP */}
                   <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                     {Array.from({length:14}).map((_, i) => {
                       const d = new Date(); d.setDate(d.getDate() + i + 1);
                       const isSelected = booking.date?.toDateString() === d.toDateString();
                       return (
                         <button 
                            key={i} 
                            onClick={()=>setBooking(b=>({...b, date: d, time: null}))} 
                            className={`h-24 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-300
                            ${isSelected ? 'bg-white text-black border-white scale-105 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                         >
                           <span className="text-[10px] font-bold uppercase tracking-wider">{d.toLocaleDateString(CONFIG.LOCALE, {weekday:'short'})}</span>
                           <span className="text-2xl font-light">{d.getDate()}</span>
                         </button>
                       )
                     })}
                   </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Clock size={16} className="text-white/50"/> Horário</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {['09:00', '10:30', '13:00', '15:00', '16:30', '19:00'].map(t => (
                      <button 
                        key={t} 
                        onClick={()=>setBooking(b=>({...b, time: t}))} 
                        disabled={!booking.date} 
                        className={`py-4 rounded-xl text-xs font-bold border transition-all duration-300
                        ${booking.time===t ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Extras */}
              <div className="border-b border-white/5 pb-12">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles size={16} className="text-white/50"/> Upgrades de Sessão</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DATA.extras.map(ex => (
                    <div 
                        key={ex.id} 
                        onClick={()=>setBooking(b=>({...b, extras: {...b.extras, [ex.id]: !b.extras[ex.id]}}))} 
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group hover:scale-[1.02]
                        ${booking.extras[ex.id] ? 'bg-white/10 border-white' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                       <div className="flex items-start justify-between mb-2">
                           <ex.icon size={20} className={booking.extras[ex.id] ? 'text-white' : 'text-white/50'}/>
                           <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${booking.extras[ex.id] ? 'bg-white border-white text-black' : 'border-white/40'}`}>
                               {booking.extras[ex.id] && <Check size={12} strokeWidth={4}/>}
                           </div>
                       </div>
                       <p className="text-sm font-bold mb-1">{ex.label}</p>
                       <p className="text-[10px] text-white/50 leading-relaxed mb-3">{ex.desc}</p>
                       <div className="inline-block bg-white/10 px-2 py-1 rounded text-[10px] font-bold">+ {CONFIG.CURRENCY} {ex.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-white/50 group-focus-within:text-white transition-colors">Seu Nome</label>
                  <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18}/>
                      <input 
                        value={booking.client.name} 
                        onChange={e=>setBooking(b=>({...b, client:{...b.client, name:e.target.value}}))} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:border-white/50 transition-colors" 
                        placeholder="Ex: Ana Souza"
                      />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-white/50 group-focus-within:text-white transition-colors">Instagram</label>
                  <div className="relative">
                      <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18}/>
                      <input 
                        value={booking.client.instagram} 
                        onChange={e=>setBooking(b=>({...b, client:{...b.client, instagram:e.target.value}}))} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:border-white/50 transition-colors" 
                        placeholder="@seu.perfil"
                      />
                  </div>
                </div>
              </div>

              {/* 4. Final CTA */}
              <div className="space-y-4 pt-4">
                  <Button full size="xl" variant="whatsapp" onClick={handleCheckout} disabled={!booking.date || !booking.time || !booking.client.name}>
                    <div className="flex justify-between w-full items-center px-4">
                       <span className="flex items-center gap-3"><MessageCircle size={24}/> Enviar Solicitação</span>
                       <span className="text-lg opacity-90">{CONFIG.CURRENCY} {total}</span>
                    </div>
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                      <ShieldCheck size={12}/> Pagamento Seguro e Verificado
                  </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-500">
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 animate-bounce">
                  <ArrowRight size={32} className="-rotate-90 md:rotate-0"/>
               </div>
               <p className="text-sm font-light">Role para cima e selecione uma experiência para desbloquear o calendário.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 text-center relative z-10 bg-black">
         <div className="flex items-center justify-center gap-2 mb-8 opacity-50 grayscale hover:grayscale-0 transition-all">
             <Aperture size={24}/>
             <span className="text-xl font-light tracking-tight">Lumina<span className="font-bold">.OS</span></span>
         </div>
         <div className="flex justify-center gap-8 mb-12">
           <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Instagram size={20}/></a>
           <a href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all"><MessageCircle size={20}/></a>
         </div>
         <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">&copy; 2026 {CONFIG.BRAND}. All Rights Reserved.</p>
      </footer>

      {/* --- CSS STYLES --- */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .mask-fade-right { -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%); }
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes progress { 0% { width: 0% } 50% { width: 70% } 100% { width: 100% } }
      `}</style>
    </div>
  );
}
