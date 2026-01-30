import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera, ArrowRight, Calendar, Clock, MapPin, User, Instagram, 
  Check, X, ChevronDown, MessageCircle, Play, Star, Image as ImageIcon,
  ShieldCheck, Sparkles, Loader2, Aperture, Menu, Trophy, Crown,
  Heart, Zap, Film, Monitor
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA CINEMATIC LANDING PAGE (V4.0 - ULTIMATE)
 * ==================================================================================
 * Estrutura: One Page Scroll + Booking Engine Integrado
 * Features: Gamification, Video BG, Glassmorphism, WhatsApp API
 */

// --- 1. CONFIG & DATA ---

const CONFIG = {
  PHONE: "5517991360413",
  CURRENCY: 'R$',
  LOCALE: 'pt-BR'
};

const DATA = {
  heroVideo: "https://videos.pexels.com/video-files/3205914/3205914-hd_1920_1080_25fps.mp4",
  stats: [
    { label: "Ensaios Realizados", value: "850+" },
    { label: "Avaliação Média", value: "5.0" },
    { label: "Anos de Mercado", value: "8" }
  ],
  services: [
    {
      id: 'portrait',
      title: "Retrato Signature",
      price: 450,
      oldPrice: 600,
      duration: "1h",
      desc: "Sua imagem pessoal elevada ao nível de arte. Ideal para LinkedIn e Branding.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      features: ["10 Fotos High-End", "1 Look", "Direção de Poses", "Galeria Vitalícia"],
      tag: "POPULAR"
    },
    {
      id: 'editorial',
      title: "Editorial Mode",
      price: 890,
      oldPrice: 1200,
      duration: "2h",
      desc: "Produção completa de moda e lifestyle. A escolha das influenciadoras.",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
      features: ["30 Fotos Editadas", "3 Looks", "Reels Bastidores (15s)", "Guia de Estilo"],
      tag: "BEST SELLER"
    },
    {
      id: 'brand',
      title: "Full Branding",
      price: 1490,
      oldPrice: 2000,
      duration: "4h",
      desc: "Banco de imagens estratégico para 3 meses de conteúdo digital.",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      features: ["50 Fotos + Guia", "Looks Ilimitados", "Make & Hair Incluso", "Planejamento Visual"],
      tag: "BUSINESS"
    }
  ],
  extras: [
    { id: 'video', label: "Fashion Film (4K)", price: 350, desc: "Teaser cinematic 30s", icon: Film },
    { id: 'express', label: "Edição 24h", price: 150, desc: "Fura fila na edição", icon: Zap },
    { id: 'makeup', label: "Make & Hair", price: 250, desc: "Profissional no set", icon: User }
  ],
  portfolio: [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    "https://images.unsplash.com/photo-1519744531242-c10a2295d8be?w=600&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    "https://images.unsplash.com/photo-1505932794465-14a6192049d4?w=600&q=80"
  ],
  reviews: [
    { name: "Ana Clara", role: "Influencer", txt: "Minhas parcerias triplicaram depois dessas fotos.", stars: 5 },
    { name: "Ricardo M.", role: "CEO Tech", txt: "Profissionalismo impecável. O estúdio é incrível.", stars: 5 },
    { name: "Beatriz L.", role: "Model", txt: "O melhor diretor de fotografia com quem já trabalhei.", stars: 5 }
  ],
  levels: [
    { level: 1, title: "Novo Cliente", min: 0, color: "text-zinc-400" },
    { level: 2, title: "Cliente VIP", min: 1500, color: "text-amber-400" },
    { level: 3, title: "Lumina Gold", min: 3000, color: "text-purple-400" }
  ]
};

// --- 2. COMPONENTS ---

const Button = ({ children, variant = 'primary', size = 'md', full = false, icon: Icon, onClick, className = '', disabled }: any) => {
  const base = "relative flex items-center justify-center font-bold tracking-wider transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const variants: any = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/20 backdrop-blur-md",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-lg shadow-green-900/20",
    outline: "border border-white/20 text-white hover:bg-white/10"
  };
  const sizes: any = {
    sm: "h-10 text-[10px] px-4 uppercase",
    md: "h-12 text-xs px-6 uppercase",
    lg: "h-14 text-sm px-8 uppercase",
    xl: "h-16 text-base px-8 uppercase tracking-widest"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {Icon && <Icon size={18} className="mr-2" strokeWidth={2.5} />}
      {children}
    </button>
  );
};

const SectionTitle = ({ sub, title, align = 'center' }: any) => (
  <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'} animate-on-scroll`}>
    <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4 backdrop-blur-md">
      {sub}
    </span>
    <h2 className="text-3xl md:text-5xl font-light text-white leading-tight">
      {title.split(' ').map((word: string, i: number) => (
        <span key={i} className={i % 2 !== 0 ? "font-serif italic text-white/80" : ""}>{word} </span>
      ))}
    </h2>
  </div>
);

const Confetti = ({ active }: { active: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      color: ['#ffffff', '#fbbf24', '#a855f7'][Math.floor(Math.random() * 3)],
      size: Math.random() * 5 + 2,
      speed: Math.random() * 5 + 2
    }));
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.y += p.speed;
        if(p.y > canvas.height) p.y = -10;
      });
      requestAnimationFrame(draw);
    };
    draw();
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
};

// --- 3. MAIN APP ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  // BOOKING STATE
  const [booking, setBooking] = useState({
    serviceId: '',
    date: null as Date | null,
    time: null as string | null,
    extras: {} as Record<string, boolean>,
    client: { name: '', instagram: '' },
    xp: 1200 // Simulação de cliente recorrente (Gamification)
  });

  // INITIAL LOAD
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
    const handleScroll = () => {
      const sections = ['home', 'portfolio', 'services', 'loyalty', 'booking'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top >= 0 && rect.top <= 300;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CALCULATIONS
  const selectedService = DATA.services.find(s => s.id === booking.serviceId);
  const total = useMemo(() => {
    let val = selectedService ? selectedService.price : 0;
    Object.keys(booking.extras).forEach(k => {
      if(booking.extras[k]) val += DATA.extras.find(e => e.id === k)?.price || 0;
    });
    return val;
  }, [booking.serviceId, booking.extras]);

  // SCROLL TO BOOKING
  const selectService = (id: string) => {
    setBooking(prev => ({ ...prev, serviceId: id }));
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  // WHATSAPP GENERATOR
  const handleCheckout = () => {
    if(!selectedService || !booking.date || !booking.time || !booking.client.name) return;
    
    setShowConfetti(true);
    const dateStr = booking.date.toLocaleDateString(CONFIG.LOCALE);
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => `+ ${DATA.extras.find(e=>e.id===k)?.label}`).join('\n');
    
    const msg = `
📸 *NOVA SOLICITAÇÃO VIP*
──────────────────
👤 *Cliente:* ${booking.client.name}
📱 *Insta:* ${booking.client.instagram}

🎞️ *Serviço:* ${selectedService.title}
📅 *Data:* ${dateStr} às ${booking.time}

✨ *Extras:*
${extrasList || 'Nenhum'}
──────────────────
💰 *TOTAL: ${CONFIG.CURRENCY} ${total}*
💳 *Status:* Aguardando Link de Pagamento

*Cliente Nível:* ${DATA.levels.find(l => booking.xp >= l.min)?.title || 'Novo'}
`.trim();
    
    setTimeout(() => {
      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
    }, 1500);
  };

  // CURRENT LEVEL
  const currentLevel = [...DATA.levels].reverse().find(l => booking.xp >= l.min) || DATA.levels[0];
  const nextLevel = DATA.levels.find(l => l.min > booking.xp);
  const progress = nextLevel ? ((booking.xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  if (loading) return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      <div className="relative mb-8"><div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse"></div><Aperture size={64} className="text-white relative z-10 animate-spin-slow" strokeWidth={1}/></div>
      <p className="text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase animate-pulse">Carregando Estúdio</p>
    </div>
  );

  return (
    <div className="bg-black text-white font-sans selection:bg-white/30 overflow-x-hidden">
      <Confetti active={showConfetti} />
      
      {/* BACKGROUND NOISE & GRADIENTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen opacity-40 animate-pulse-slow delay-1000"></div>
      </div>

      {/* HEADER */}
      <nav className="fixed top-0 left-0 w-full h-20 px-6 md:px-12 flex items-center justify-between z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center"><Camera size={18} strokeWidth={2.5}/></div>
          <span className="text-lg font-light tracking-tight">Lumina<span className="font-bold">.OS</span></span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {['Home', 'Portfolio', 'Serviços', 'Loyalty'].map((item) => (
            <button key={item} onClick={() => document.getElementById(item.toLowerCase())?.scrollIntoView({behavior:'smooth'})} className={`text-xs uppercase font-bold tracking-widest hover:text-white transition-colors ${activeSection === item.toLowerCase() ? 'text-white' : 'text-white/50'}`}>
              {item}
            </button>
          ))}
        </div>
        
        <Button size="sm" variant="secondary" onClick={() => document.getElementById('booking')?.scrollIntoView({behavior:'smooth'})} className="hidden md:flex">Agendar Agora</Button>
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu /></button>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
           <button className="absolute top-6 right-6" onClick={() => setMobileMenuOpen(false)}><X/></button>
           {['Home', 'Portfolio', 'Serviços', 'Booking'].map((item) => (
            <button key={item} onClick={() => { document.getElementById(item.toLowerCase())?.scrollIntoView({behavior:'smooth'}); setMobileMenuOpen(false); }} className="text-2xl font-light text-white">
              {item}
            </button>
          ))}
        </div>
      )}

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-screen flex items-end pb-20 px-6 md:px-12 pt-32">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50"><source src={DATA.heroVideo} type="video/mp4" /></video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Agenda 2026 Aberta
            </div>
            <h1 className="text-5xl md:text-8xl font-light leading-[0.9] tracking-tighter">
              A Arte de <br/><span className="font-serif italic font-medium text-white/90">Ser Visto.</span>
            </h1>
            <p className="text-sm md:text-lg text-white/70 max-w-md leading-relaxed">
              Fotografia high-end para quem busca autoridade e elegância. Capture sua melhor versão com nossa direção exclusiva.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}>Ver Planos</Button>
              <Button size="lg" variant="secondary" icon={Play}>Showreel</Button>
            </div>
          </div>
          <div className="hidden md:flex justify-end gap-4">
            {DATA.stats.map((s, i) => (
              <div key={i} className="p-6 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl w-40">
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-50"><ChevronDown/></div>
      </section>

      {/* PORTFOLIO GRID */}
      <section id="portfolio" className="py-24 px-6 md:px-12 relative z-10">
        <SectionTitle sub="Galeria" title="Momentos Eternizados" />
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4">
          {DATA.portfolio.map((img, i) => (
            <div key={i} className={`group relative overflow-hidden rounded-2xl ${i%2===0 ? 'md:row-span-2 aspect-[3/4]' : 'aspect-square'}`}>
              <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" size="sm">Ver Detalhes</Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LOYALTY CLUB (GAMIFICATION) */}
      <section id="loyalty" className="py-20 px-6 md:px-12 bg-zinc-900/50 border-y border-white/5">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-800 to-black border border-white/10 p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                 <Trophy className="text-amber-400" size={32}/>
                 <h2 className="text-3xl font-light">Lumina <span className="font-serif italic text-amber-400">Club</span></h2>
              </div>
              <p className="text-sm text-white/60">
                Cada ensaio acumula XP. Desbloqueie benefícios exclusivos como descontos, prioridade na agenda e mimos no estúdio.
              </p>
              <div className="bg-black/40 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-2">
                   <span className={currentLevel.color}>{currentLevel.title}</span>
                   <span>{booking.xp} XP</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-600 to-amber-300" style={{width: `${progress}%`}}></div>
                </div>
                <p className="text-[10px] text-white/40 mt-2 text-right">Próximo: {nextLevel?.title || 'Max Level'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {['Prioridade', 'Descontos', 'Brindes', 'VIP Eventos'].map((b,i) => (
                 <div key={i} className="flex items-center gap-2 text-xs font-bold text-white/70 bg-white/5 px-4 py-3 rounded-lg border border-white/5">
                   <Crown size={14} className="text-amber-400"/> {b}
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <SectionTitle sub="Investimento" title="Escolha sua Experiência" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {DATA.services.map((s) => (
            <div key={s.id} onClick={() => selectService(s.id)} className={`group relative p-1 rounded-3xl transition-all duration-500 hover:-translate-y-2 cursor-pointer ${booking.serviceId === s.id ? 'bg-gradient-to-b from-white to-transparent' : 'bg-white/10'}`}>
              <div className="bg-black h-full rounded-[1.4rem] p-6 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] rounded-full group-hover:bg-white/10 transition-colors"></div>
                
                {s.tag && <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold uppercase px-2 py-1 rounded tracking-wider">{s.tag}</div>}
                
                <div className="mb-6 relative h-48 rounded-xl overflow-hidden">
                   <img src={s.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt=""/>
                   <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                     <Clock size={10}/> {s.duration}
                   </div>
                </div>

                <h3 className="text-xl font-light mb-2">{s.title}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold">{CONFIG.CURRENCY} {s.price}</span>
                  <span className="text-sm text-white/40 line-through">{CONFIG.CURRENCY} {s.oldPrice}</span>
                </div>
                <p className="text-xs text-white/50 mb-6 flex-1">{s.desc}</p>
                
                <ul className="space-y-3 mb-6">
                  {s.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-white/80">
                      <Check size={12} className="text-white"/> {f}
                    </li>
                  ))}
                </ul>

                <Button full variant={booking.serviceId === s.id ? 'primary' : 'secondary'}>
                  {booking.serviceId === s.id ? 'Selecionado' : 'Selecionar'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {DATA.reviews.map((r, i) => (
               <div key={i} className="p-8 rounded-2xl bg-black border border-white/10 relative">
                 <div className="flex gap-1 text-amber-400 mb-4">
                   {[...Array(r.stars)].map((_,k)=><Star key={k} size={14} fill="currentColor"/>)}
                 </div>
                 <p className="text-sm text-white/80 italic mb-6">"{r.txt}"</p>
                 <div>
                   <p className="font-bold text-sm">{r.name}</p>
                   <p className="text-xs text-white/40 uppercase tracking-widest">{r.role}</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* BOOKING ENGINE (THE FUNCTIONAL PART) */}
      <section id="booking" className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
        <SectionTitle sub="Agendamento" title="Finalize seu Pedido" />
        
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Top Selection Status */}
          <div className="mb-8 p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                 {selectedService ? <Check className="text-green-400"/> : <Aperture className="animate-pulse opacity-50"/>}
               </div>
               <div>
                 <p className="text-xs uppercase font-bold tracking-widest text-white/40">Experiência Escolhida</p>
                 <p className="text-lg font-light">{selectedService ? selectedService.title : 'Selecione acima'}</p>
               </div>
             </div>
             <div className="text-right">
               <p className="text-2xl font-bold">{CONFIG.CURRENCY} {total}</p>
             </div>
          </div>

          {selectedService ? (
            <div className="space-y-8 animate-fade-in">
              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={14}/> Data</h3>
                   <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                     {Array.from({length:10}).map((_, i) => {
                       const d = new Date(); d.setDate(d.getDate() + i + 1);
                       const sel = booking.date?.toDateString() === d.toDateString();
                       return (
                         <button key={i} onClick={()=>setBooking(b=>({...b, date: d, time: null}))} className={`min-w-[70px] h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${sel ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                           <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString(CONFIG.LOCALE, {weekday:'short'})}</span>
                           <span className="text-xl font-light">{d.getDate()}</span>
                         </button>
                       )
                     })}
                   </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Clock size={14}/> Horário</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00', '10:30', '14:00', '16:30', '19:00'].map(t => (
                      <button key={t} onClick={()=>setBooking(b=>({...b, time: t}))} disabled={!booking.date} className={`py-3 rounded-lg text-xs font-bold border transition-all ${booking.time===t ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-30'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Extras */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={14}/> Upgrades</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DATA.extras.map(ex => (
                    <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras: {...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${booking.extras[ex.id] ? 'bg-white/10 border-white' : 'bg-white/5 border-white/10 opacity-70 hover:opacity-100'}`}>
                       <div className={`w-5 h-5 rounded border flex items-center justify-center ${booking.extras[ex.id] ? 'bg-white border-white text-black' : 'border-white/40'}`}>{booking.extras[ex.id] && <Check size={12} strokeWidth={4}/>}</div>
                       <div><p className="text-xs font-bold">{ex.label}</p><p className="text-[10px] opacity-60">+{ex.price}</p></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-50">Seu Nome</label>
                  <input value={booking.client.name} onChange={e=>setBooking(b=>({...b, client:{...b.client, name:e.target.value}}))} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-white/50" placeholder="Ex: Maria Silva"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-50">Instagram</label>
                  <input value={booking.client.instagram} onChange={e=>setBooking(b=>({...b, client:{...b.client, instagram:e.target.value}}))} className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-white/50" placeholder="@seu.perfil"/>
                </div>
              </div>

              {/* CTA */}
              <Button full size="xl" variant="whatsapp" onClick={handleCheckout} disabled={!booking.date || !booking.time || !booking.client.name}>
                <div className="flex justify-between w-full items-center">
                   <span className="flex items-center gap-2"><MessageCircle size={20}/> Confirmar no WhatsApp</span>
                   <span>{CONFIG.CURRENCY} {total}</span>
                </div>
              </Button>
              <p className="text-[10px] text-center text-white/30">Ao confirmar, você será redirecionado para o WhatsApp do fotógrafo para finalizar o pagamento.</p>
            </div>
          ) : (
            <div className="text-center py-12 opacity-50">
               <Camera size={48} className="mx-auto mb-4 animate-bounce"/>
               <p>Por favor, selecione uma experiência acima para começar.</p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 text-center text-white/40 text-xs">
         <p className="uppercase tracking-widest mb-4">Lumina Cinematic Studio</p>
         <div className="flex justify-center gap-4 mb-8">
           <Instagram size={20} className="hover:text-white cursor-pointer"/>
           <MessageCircle size={20} className="hover:text-white cursor-pointer"/>
         </div>
         <p>&copy; 2026 Todos os direitos reservados.</p>
      </footer>

      {/* STYLES */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-pulse-slow { animation: pulse 8s infinite; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-on-scroll { animation: fadeUp 0.8s ease-out forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
