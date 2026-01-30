import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera, ArrowRight, Calendar, Clock, MapPin, User, Instagram, 
  Check, X, ChevronDown, MessageCircle, Play, Star, Image as ImageIcon,
  ShieldCheck, Sparkles, Loader2, Aperture, Menu, Trophy, Crown,
  Heart, Zap, Film, Monitor, Quote, MousePointer2
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA CINEMATIC OS v5.0 (GOLD MASTER)
 * ==================================================================================
 * Stack: React + Tailwind CSS
 * Concept: "The Apple of Photography Booking Sites"
 * Audience: High-Ticket Photography Clients
 */

// --- 1. CONFIGURATION & MOCK DATA ---

const CONFIG = {
  PHONE: "5517991360413", // Seu WhatsApp
  CURRENCY: 'R$',
  LOCALE: 'pt-BR',
  PHOTOGRAPHER: "Lumina Studio"
};

const DATA = {
  // Cinematic Fashion Video for Hero Background
  heroVideo: "https://videos.pexels.com/video-files/5709664/5709664-uhd_2560_1440_25fps.mp4", 
  
  stats: [
    { label: "Histórias Contadas", value: "850+" },
    { label: "Prêmios Internacionais", value: "12" },
    { label: "Anos de Legado", value: "8" }
  ],

  services: [
    {
      id: 'portrait',
      title: "Signature Portrait",
      price: 490,
      oldPrice: 650,
      duration: "1h",
      desc: "Sua imagem é sua marca. Um ensaio focado em autoridade, elegância e essência. Ideal para LinkedIn, Branding Pessoal e Posicionamento.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      features: ["10 Fotos High-End (Tratamento Pele)", "1 Look Completo", "Guia de Poses e Expressão", "Galeria Online Vitalícia"],
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
      features: ["30 Fotos Editadas (Fine Art)", "3 Trocas de Look", "Fashion Film (Reels 15s)", "Consultoria de Estilo Prévia"],
      tag: "BEST SELLER"
    },
    {
      id: 'brand',
      title: "Empire Branding",
      price: 1890,
      oldPrice: 2500,
      duration: "4h",
      desc: "Um banco de imagens estratégico para 3 meses de conteúdo. Pare de se preocupar com o que postar.",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      features: ["50 Fotos + Guia de Uso", "Looks Ilimitados", "Make & Hair Profissional Incluso", "Planejamento de Feed"],
      tag: "BUSINESS"
    }
  ],

  extras: [
    { id: 'video', label: "Cinematic Teaser (4K)", price: 400, desc: "Vídeo horizontal e vertical de 45s", icon: Film },
    { id: 'express', label: "Rush Delivery (24h)", price: 200, desc: "Receba as prévias no dia seguinte", icon: Zap },
    { id: 'makeup', label: "Make & Hair Extra", price: 300, desc: "Retoque ou mudança de visual", icon: User }
  ],

  portfolio: [
    { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", cat: "Editorial" },
    { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80", cat: "Love" },
    { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80", cat: "Portrait" },
    { src: "https://images.unsplash.com/photo-1519744531242-c10a2295d8be?w=600&q=80", cat: "Dark" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", cat: "Urban" },
    { src: "https://images.unsplash.com/photo-1505932794465-14a6192049d4?w=600&q=80", cat: "Studio" }
  ],

  reviews: [
    { name: "Isabela F.", role: "Arquiteta", txt: "Eu sempre travei na frente das câmeras. O Lumina me fez sentir poderosa. As fotos mudaram a percepção dos meus clientes.", stars: 5 },
    { name: "Lucas M.", role: "Empresário", txt: "Não é só foto, é estratégia. O retorno que tive com o Branding pagou o ensaio em uma semana.", stars: 5 },
    { name: "Camila R.", role: "Influencer", txt: "A entrega Express salvou meu lançamento. Qualidade surreal e agilidade.", stars: 5 }
  ],

  levels: [
    { level: 1, title: "Member", min: 0, color: "text-zinc-400", benefits: "Acesso à agenda" },
    { level: 2, title: "VIP Client", min: 1500, color: "text-amber-400", benefits: "5% OFF + Prioridade" },
    { level: 3, title: "Lumina Gold", min: 3000, color: "text-purple-400", benefits: "10% OFF + Gifts Exclusivos" }
  ]
};

// --- 2. DESIGN SYSTEM COMPONENTS ---

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
      {/* Shine Effect */}
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
    <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.25em] text-white/60 mb-6 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
      {sub}
    </span>
    <h2 className="text-4xl md:text-6xl font-extralight text-white leading-[1.1] mb-6">
      {title.split(' ').map((word: string, i: number) => (
        <span key={i} className={i % 2 !== 0 ? "font-serif italic text-white/90 font-normal" : "text-white"}>{word} </span>
      ))}
    </h2>
    {desc && <p className={`text-white/50 text-sm md:text-base leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>{desc}</p>}
  </div>
);

// --- 3. MAIN APPLICATION ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // BOOKING STATE
  const [booking, setBooking] = useState({
    serviceId: '',
    date: null as Date | null,
    time: null as string | null,
    extras: {} as Record<string, boolean>,
    client: { name: '', instagram: '', email: '' },
    xp: 2200 // Mock XP for demo
  });

  // INITIALIZATION
  useEffect(() => {
    // Cinematic Loading Sequence
    setTimeout(() => setLoading(false), 2500);

    const handleScroll = () => {
      const sections = ['home', 'about', 'portfolio', 'services', 'booking'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= -300 && rect.top <= 300;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // LOGIC
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
✨ *PEDIDO DE AGENDAMENTO VIP* ✨
──────────────────────
👤 *CLIENTE*
Nome: *${booking.client.name}*
Insta: ${booking.client.instagram}

📸 *EXPERIÊNCIA ESCOLHIDA*
Serviço: *${selectedService.title.toUpperCase()}*
Incluso: ${selectedService.duration} • ${selectedService.features[0]}

🗓 *DATA RESERVADA*
${dateStr} às ${booking.time}

⭐ *ADICIONAIS*
${extrasList || 'Nenhum'}

──────────────────────
💎 *INVESTIMENTO: ${CONFIG.CURRENCY} ${total},00*
💳 *Status:* Aguardando Link de Pagamento

*ID do Cliente:* #${Math.floor(Math.random()*10000)}
`.trim();
    
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // GAMIFICATION LOGIC
  const currentLevel = [...DATA.levels].reverse().find(l => booking.xp >= l.min) || DATA.levels[0];
  const nextLevel = DATA.levels.find(l => l.min > booking.xp);
  const progress = nextLevel ? ((booking.xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  // RENDER LOADING SCREEN
  if (loading) return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-white/10 blur-[60px] rounded-full animate-pulse"></div>
        {/* Shutter Animation */}
        <div className="relative w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center animate-[spin_10s_linear_infinite]">
            <Aperture size={64} className="text-white relative z-10 animate-[pulse_2s_infinite]" strokeWidth={0.5}/>
        </div>
      </div>
      <div className="h-[2px] w-48 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-white animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>
      <p className="mt-6 text-[10px] font-bold tracking-[0.5em] text-white/50 uppercase">Carregando Experiência</p>
    </div>
  );

  return (
    <div className="bg-black text-white font-sans selection:bg-white/30 overflow-x-hidden">
      
      {/* --- AMBIENT LAYERS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-900/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-amber-900/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow delay-1000"></div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 w-full h-24 px-6 md:px-12 flex items-center justify-between z-50 transition-all duration-500 ${activeSection !== 'home' ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
          <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-180 duration-700">
            <Aperture size={20} strokeWidth={2}/>
          </div>
          <div>
            <span className="text-xl font-light tracking-tighter block leading-none">Lumina<span className="font-bold">.OS</span></span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-white/50 block">Cinematic Studio</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-md">
          {['Home', 'Portfolio', 'Serviços', 'Sobre'].map((item) => (
            <button key={item} onClick={() => document.getElementById(item.toLowerCase() === 'sobre' ? 'about' : item.toLowerCase())?.scrollIntoView({behavior:'smooth'})} className={`text-xs uppercase font-bold tracking-widest hover:text-white transition-all hover:scale-105 ${activeSection === item.toLowerCase() ? 'text-white' : 'text-white/40'}`}>
              {item}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <Button size="sm" variant="primary" onClick={() => document.getElementById('booking')?.scrollIntoView({behavior:'smooth'})} className="hidden md:flex">Agendar</Button>
          <button className="md:hidden w-10 h-10 flex items-center justify-center text-white bg-white/10 rounded-full backdrop-blur-md" onClick={() => setMenuOpen(!menuOpen)}>
             {menuOpen ? <X size={20}/> : <Menu size={20}/>}
          </button>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         {['Home', 'Portfolio', 'Serviços', 'Booking'].map((item, i) => (
          <button key={item} style={{transitionDelay: `${i * 100}ms`}} onClick={() => { document.getElementById(item.toLowerCase())?.scrollIntoView({behavior:'smooth'}); setMenuOpen(false); }} className={`text-4xl font-light text-white hover:text-white/50 transition-all ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {item}
          </button>
        ))}
      </div>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative min-h-screen flex items-end pb-24 px-6 md:px-12 pt-32 overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 scale-105">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60"><source src={DATA.heroVideo} type="video/mp4" /></video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20"></div>
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
            
            <h1 className="text-6xl md:text-9xl font-light leading-[0.85] tracking-tighter drop-shadow-2xl">
              Eternize <br/>
              <span className="font-serif italic font-medium bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">Sua Essência.</span>
            </h1>
            
            <p className="text-base md:text-lg text-white/80 max-w-lg leading-relaxed font-light backdrop-blur-sm p-4 rounded-xl border-l-2 border-white/20 bg-black/20">
              Não é apenas fotografia. É uma experiência de autoconhecimento, luxo e posicionamento de imagem.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="xl" onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}>
                Ver Experiências <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform"/>
              </Button>
              <Button size="xl" variant="secondary" icon={Play} onClick={() => window.open(DATA.heroVideo, '_blank')}>
                Ver Bastidores
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex flex-col items-end gap-6 animate-fade-in-up delay-200">
             <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-64 hover:bg-white/10 transition-colors cursor-default">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500"><Crown size={20}/></div>
                   <span className="text-[10px] uppercase font-bold tracking-widest text-white/40">Loyalty</span>
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

      {/* --- ABOUT SECTION (THE EMOTIONAL HOOK) --- */}
      <section id="about" className="py-32 px-6 md:px-12 relative">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <div className="absolute inset-0 bg-white/5 rotate-3 rounded-[2rem]"></div>
               <img src="https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&w=800&q=80" alt="Photographer" className="relative rounded-[2rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 rotate-[-3deg] hover:rotate-0"/>
               <div className="absolute -bottom-6 -right-6 bg-white text-black p-6 rounded-2xl shadow-xl max-w-xs">
                  <Quote size={24} className="mb-2 opacity-50"/>
                  <p className="text-xs font-serif italic leading-relaxed">
                     "Minha missão não é apenas tirar fotos, é revelar a versão mais poderosa que já existe dentro de você."
                  </p>
               </div>
            </div>
            <div className="space-y-8">
               <SectionTitle align="left" sub="O Artista" title="Muito Além do Clique" desc="Com 8 anos de experiência em editoriais de moda e branding internacional, trago o olhar da alta costura para o seu posicionamento pessoal." />
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Eye size={20}/></div>
                     <h4 className="text-lg font-light">Direção Completa</h4>
                     <p className="text-sm text-white/50">Você não precisa saber posar. Eu guio cada movimento, olhar e ângulo.</p>
                  </div>
                  <div className="space-y-3">
                     <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10"><Sun size={20}/></div>
                     <h4 className="text-lg font-light">Luz Cinematográfica</h4>
                     <p className="text-sm text-white/50">Equipamento de cinema para criar a atmosfera perfeita para sua história.</p>
                  </div>
               </div>
               <Button variant="outline" className="mt-8">Conheça Minha História</Button>
            </div>
         </div>
      </section>

      {/* --- PORTFOLIO GRID (MASONRY STYLE) --- */}
      <section id="portfolio" className="py-32 px-6 md:px-12 bg-white/5 relative border-y border-white/5">
        <SectionTitle sub="Portfólio" title="Galeria de Arte" desc="Uma curadoria dos nossos melhores momentos." />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[300px]">
          {DATA.portfolio.map((item, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-2xl cursor-pointer ${i === 0 || i === 3 ? 'md:col-span-2' : ''}`}>
              <img src={item.src} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-4">
                <span className="text-[10px] uppercase font-bold tracking-[0.3em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">{item.cat}</span>
                <Button variant="secondary" size="sm" className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">Ver Projeto</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SERVICES (PRICING) --- */}
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
                {/* Background Glow */}
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
                  {booking.serviceId === s.id ? 'Experiência Selecionada' : 'Selecionar Experiência'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SOCIAL PROOF --- */}
      <section className="py-24 border-y border-white/5 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {DATA.reviews.map((r, i) => (
               <div key={i} className="p-8 rounded-2xl bg-black border border-white/10 relative hover:border-white/30 transition-colors">
                 <div className="absolute -top-3 -left-3 bg-white text-black p-2 rounded-lg">
                   <Quote size={16}/>
                 </div>
                 <div className="flex gap-1 text-amber-400 mb-6">
                   {[...Array(r.stars)].map((_,k)=><Star key={k} size={14} fill="currentColor"/>)}
                 </div>
                 <p className="text-sm text-white/80 italic mb-8 leading-relaxed">"{r.txt}"</p>
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">{r.name[0]}</div>
                   <div>
                     <p className="font-bold text-sm">{r.name}</p>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest">{r.role}</p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* --- BOOKING ENGINE (THE CONVERSION CORE) --- */}
      <section id="booking" className="py-32 px-6 md:px-12 max-w-5xl mx-auto relative">
        <SectionTitle sub="Agendamento" title="Comece Sua Jornada" desc="Finalize os detalhes abaixo. Entraremos em contato via WhatsApp para confirmar." />
        
        <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-20"></div>

          {/* Service Selection Summary */}
          <div className="mb-12 p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-white/10">
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
              
              {/* 1. Date & Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/5 pb-12">
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Calendar size={16} className="text-white/50"/> Data Preferida</h3>
                   <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mask-fade-right">
                     {Array.from({length:14}).map((_, i) => {
                       const d = new Date(); d.setDate(d.getDate() + i + 1);
                       const isSelected = booking.date?.toDateString() === d.toDateString();
                       return (
                         <button 
                            key={i} 
                            onClick={()=>setBooking(b=>({...b, date: d, time: null}))} 
                            className={`min-w-[80px] h-24 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all duration-300
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
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles size={16} className="text-white/50"/> Customize sua Experiência</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DATA.extras.map(ex => (
                    <div 
                        key={ex.id} 
                        onClick={()=>setBooking(b=>({...b, extras: {...b.extras, [ex.id]: !b.extras[ex.id]}}))} 
                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden group
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
                    <div className="flex justify-between w-full items-center px-2">
                       <span className="flex items-center gap-3"><MessageCircle size={24}/> Confirmar Agendamento</span>
                       <span className="text-lg opacity-90">{CONFIG.CURRENCY} {total}</span>
                    </div>
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-[10px] text-white/30 uppercase tracking-widest">
                      <ShieldCheck size={12}/> Pagamento Seguro via WhatsApp
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
         <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">&copy; 2026 {CONFIG.PHOTOGRAPHER}. All Rights Reserved.</p>
      </footer>

      {/* --- EXTRA ICONS FOR IMPORTS --- */}
      <div className="hidden"><Eye/><Sun/></div>

      {/* --- CSS INJECTION (ANIMATIONS) --- */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .mask-fade-right { -webkit-mask-image: linear-gradient(to right, black 80%, transparent 100%); }
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        .animate-fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        @keyframes progress { 0% { width: 0% } 50% { width: 70% } 100% { width: 100% } }
      `}</style>
    </div>
  );
}

// Helper icons just for this file context
const Eye = (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
const Sun = (props:any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
