import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Camera, Calendar, Clock, User, Instagram, 
  Check, X, MessageCircle, Play, Sparkles, 
  Menu, Crown, Zap, Film, ArrowRight, 
  Maximize2, Aperture, Monitor, ChevronLeft, ChevronRight
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA CINEMATIC OS - VERSÃO DEFINITIVA (CORRIGIDA & OTIMIZADA)
 * ==================================================================================
 * - Galeria Carrossel Automático + Manual
 * - Agendamento Simplificado (Horizontal Scroll)
 * - 100% Português
 * - Imagens corrigidas
 */

// --- 1. CONFIGURAÇÃO & DADOS ---

const CONFIG = {
  PHONE: "5517991360413", // Seu número
  CURRENCY: 'R$',
  BRAND: "Lumina Studio"
};

const DATA = {
  // VÍDEO HERO: Fundo em loop
  heroVideo: "https://videos.pexels.com/video-files/3205914/3205914-hd_1920_1080_25fps.mp4",
  
  // IMAGEM DE PERFIL (CORRIGIDA - Link estável)
  aboutImage: "https://images.unsplash.com/photo-1554048612-387768052bf7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",

  stats: [
    { label: "Produções", value: "850+" },
    { label: "Prêmios", value: "14" },
    { label: "Anos de Mercado", value: "8" }
  ],

  levels: [
    { level: 1, title: "Membro", min: 0, color: "text-zinc-400" },
    { level: 2, title: "Cliente VIP", min: 1500, color: "text-amber-400" },
    { level: 3, title: "Parceiro Gold", min: 3000, color: "text-purple-400" }
  ],

  categories: [
    { id: 'foto', label: 'Fotografia', icon: Camera },
    { id: 'video', label: 'Vídeo & Cinema', icon: Film }
  ],

  services: [
    // FOTOGRAFIA
    {
      id: 'foto-pessoal',
      catId: 'foto',
      title: "Retrato Signature",
      price: 490,
      oldPrice: 650,
      duration: "1h",
      desc: "Sua imagem pessoal elevada ao nível de arte. Ideal para LinkedIn e posicionamento.",
      features: ["10 Fotos Editadas", "1 Look Completo", "Direção de Poses", "Galeria Online"],
      tag: "POPULAR"
    },
    {
      id: 'foto-editorial',
      catId: 'foto',
      title: "Experiência Vogue",
      price: 990,
      oldPrice: 1400,
      duration: "2h",
      desc: "Sinta-se em uma capa de revista. Produção artística e luz de cinema.",
      features: ["30 Fotos Fine Art", "3 Trocas de Look", "Vídeo Bastidores (15s)", "Guia de Estilo"],
      tag: "MAIS VENDIDO"
    },
    // VÍDEO
    {
      id: 'video-reels',
      catId: 'video',
      title: "Reels Viral Maker",
      price: 590,
      oldPrice: 800,
      duration: "1.5h",
      desc: "Vídeos verticais dinâmicos para TikTok e Reels. Edição rápida incluída.",
      features: ["3 Vídeos Verticais", "Edição com Música", "Qualidade 4K", "Roteiro Incluso"],
      tag: "TENDÊNCIA"
    },
    {
      id: 'video-brand',
      catId: 'video',
      title: "Cinema para Marcas",
      price: 2200,
      oldPrice: 3000,
      duration: "4h",
      desc: "Comercial completo para sua empresa. Narrativa visual de alto impacto.",
      features: ["Filme Completo (60s)", "Imagens de Drone", "Sound Design", "Entrevistas"],
      tag: "PREMIUM"
    }
  ],

  extras: [
    { id: 'video_teaser', label: "Teaser Extra (Stories)", price: 400, desc: "Vídeo curto vertical.", icon: Film },
    { id: 'rush', label: "Entrega em 24h", price: 200, desc: "Receba as fotos amanhã.", icon: Zap },
    { id: 'makeup', label: "Maquiagem Profissional", price: 300, desc: "Profissional no estúdio.", icon: User }
  ],

  // PORTFÓLIO PARA CARROSSEL
  portfolio: [
    { id: 1, cat: "Editorial", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80" },
    { id: 2, cat: "Cinema", src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80" },
    { id: 3, cat: "Retrato", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80" },
    { id: 4, cat: "Urbano", src: "https://images.unsplash.com/photo-1519744531242-c10a2295d8be?w=800&q=80" },
    { id: 5, cat: "Estúdio", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" },
    { id: 6, cat: "Moda", src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80" }
  ]
};

// --- 2. COMPONENTES VISUAIS (DESIGN SYSTEM) ---

const GlassCard = ({ children, className = "", hoverEffect = false, onClick }: any) => (
  <div onClick={onClick} className={`
    relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl
    bg-white/5 backdrop-blur-xl transition-all duration-500
    ${hoverEffect ? 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.01] cursor-pointer' : ''}
    ${className}
  `}>
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', full, onClick, disabled, icon: Icon }: any) => {
  const base = "rounded-xl font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles: any = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_25px_rgba(255,255,255,0.3)]",
    glass: "bg-white/10 text-white border border-white/10 hover:bg-white/20 backdrop-blur-md",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebc57] shadow-[0_0_25px_rgba(37,211,102,0.4)]",
    gold: "bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:brightness-110 shadow-[0_0_25px_rgba(245,158,11,0.5)]"
  };
  const sizes: any = { 
    sm: "h-10 px-4 text-[10px] uppercase",
    md: "h-12 px-6 text-xs uppercase", 
    lg: "h-14 px-8 text-sm uppercase tracking-widest" 
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${sizes[size]} ${full ? 'w-full' : ''}`}>
      {Icon && <Icon size={18} />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// --- COMPONENTE CARROSSEL (AUTO + MANUAL) ---
const Carousel = ({ items, onItemClick }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Rolagem Automática
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        if (scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 3000); // Passa a cada 3 segundos
    return () => clearInterval(interval);
  }, [isPaused]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {/* Botões Manuais */}
      <button onClick={() => scroll('left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black">
        <ChevronLeft size={24}/>
      </button>
      <button onClick={() => scroll('right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black">
        <ChevronRight size={24}/>
      </button>

      {/* Container Scroll */}
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-4 md:px-0"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((item: any, i: number) => (
          <div 
            key={i} 
            onClick={() => onItemClick(item)}
            className="snap-center shrink-0 w-[280px] h-[350px] md:w-[350px] md:h-[450px] relative rounded-2xl overflow-hidden cursor-pointer border border-white/10 group/card"
          >
            <img src={item.src} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 grayscale group-hover/card:grayscale-0"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-6">
              <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-1">{item.cat}</p>
              <div className="flex items-center gap-2 text-white text-xs">
                <Maximize2 size={14}/> Ampliar
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- LIGHTBOX ---
const Lightbox = ({ image, onClose }: any) => {
  if (!image) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50">
        <X size={24} className="text-white"/>
      </button>
      <img src={image.src} alt={image.cat} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-scale-in"/>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-xs font-bold uppercase tracking-widest bg-black/50 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
        Galeria: {image.cat}
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('foto');
  const [lightboxImage, setLightboxImage] = useState<any>(null);
  
  // ESTADO DO AGENDAMENTO
  const [booking, setBooking] = useState({
    serviceId: '',
    date: null as Date | null,
    time: null as string | null,
    extras: {} as Record<string, boolean>,
    client: { name: '', instagram: '' },
    xp: 2200
  });

  useEffect(() => setTimeout(() => setLoading(false), 2000), []);

  const selectedService = DATA.services.find(s => s.id === booking.serviceId);
  
  const total = useMemo(() => {
    let val = selectedService ? selectedService.price : 0;
    Object.keys(booking.extras).forEach(k => {
      if(booking.extras[k]) val += DATA.extras.find(e => e.id === k)?.price || 0;
    });
    return val;
  }, [booking.serviceId, booking.extras]);

  // Nível de XP
  const currentLevel = [...DATA.levels].reverse().find(l => booking.xp >= l.min) || DATA.levels[0];
  const nextLevel = DATA.levels.find(l => l.min > booking.xp);
  const progress = nextLevel ? ((booking.xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  const handleCheckout = () => {
    if(!selectedService || !booking.date || !booking.time || !booking.client.name) return;
    const dateStr = booking.date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => `+ ${DATA.extras.find(e=>e.id===k)?.label}`).join('\n');
    
    const msg = `
🎬 *NOVA RESERVA - LUMINA STUDIO*
──────────────────────
👤 *CLIENTE*
Nome: *${booking.client.name}*
Insta: ${booking.client.instagram}

🎥 *PROJETO ESCOLHIDO*
Serviço: *${selectedService.title.toUpperCase()}*
Tipo: ${selectedService.catId === 'foto' ? 'Fotografia' : 'Produção de Vídeo'}
Data: ${dateStr}
Horário: ${booking.time}

✨ *EXTRAS*
${extrasList || 'Nenhum'}
──────────────────────
💎 *VALOR FINAL: ${CONFIG.CURRENCY} ${total},00*
`.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center mb-4 relative animate-spin">
        <div className="absolute top-0 left-0 w-full h-full border-t-2 border-amber-400 rounded-full"></div>
      </div>
      <p className="text-white/50 text-xs uppercase tracking-[0.5em] animate-pulse">Carregando Studio</p>
    </div>
  );

  return (
    <div className="bg-[#050505] text-white font-sans selection:bg-amber-500/30 min-h-screen relative overflow-x-hidden">
      
      {/* FUNDO AMBIENTE */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-amber-900/5 rounded-full blur-[120px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

      {/* --- MENU FLUTUANTE --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl">
        <GlassCard className="flex items-center justify-between px-6 py-3 !rounded-full bg-black/60 backdrop-blur-2xl border-white/10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <Aperture size={20} className="text-amber-400"/>
            <span className="font-bold tracking-tight text-sm">Lumina<span className="font-light text-white/50">.Studio</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {['Início', 'Sobre', 'Portfolio', 'Agendar'].map(item => (
              <button 
                key={item} 
                onClick={() => document.getElementById(item === 'Início' ? 'hero' : item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs font-bold text-white/60 hover:text-white transition-colors uppercase tracking-widest"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[9px] uppercase font-bold text-amber-400">{currentLevel.title}</span>
                <span className="text-[9px] text-white/50">{booking.xp} XP</span>
             </div>
             <button className="md:hidden text-white"><Menu size={20}/></button>
          </div>
        </GlassCard>
      </nav>

      {/* --- HERO SECTION --- */}
      <section id="hero" className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50 scale-105">
            <source src={DATA.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl text-center space-y-8 animate-fade-in-up">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest mx-auto">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Disponível para 2026
           </div>
           
           <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.9]">
             Eternize seu <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Legado Visual.</span>
           </h1>
           
           <p className="text-lg text-white/70 max-w-xl mx-auto leading-relaxed font-light">
             Fotografia High-End e Cinema. Elevamos sua autoridade digital com produções que narram a sua história.
           </p>

           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
             <Button size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}>
                Ver Projetos
             </Button>
             <Button size="lg" variant="glass" icon={Play} onClick={() => window.open(DATA.heroVideo, '_blank')}>
                Ver Vídeo
             </Button>
           </div>
        </div>
      </section>

      {/* --- ESTATÍSTICAS --- */}
      <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-3 divide-x divide-white/5">
          {DATA.stats.map((s, i) => (
            <div key={i} className="py-8 text-center group hover:bg-white/5 transition-colors">
              <p className="text-2xl md:text-4xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SOBRE (CORRIGIDO) --- */}
      <section id="sobre" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute inset-0 bg-amber-500/20 rounded-[2rem] rotate-3 blur-2xl"></div>
             {/* Imagem garantida */}
             <GlassCard className="aspect-[3/4] relative p-0 overflow-hidden">
               <img src={DATA.aboutImage} alt="Fotógrafo" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"/>
               <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6">
                 <p className="text-white font-bold">Thalyson Designer</p>
                 <p className="text-amber-400 text-xs uppercase tracking-widest">Diretor Criativo</p>
               </div>
             </GlassCard>
          </div>
          <div className="space-y-8">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">O Artista</span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Direção Cinematográfica <br/>para Pessoas Reais.</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              Com 8 anos de experiência, meu foco não é apenas "tirar fotos", mas dirigir cenas. 
              Trago técnicas de cinema e iluminação de moda para criar uma imagem que posiciona você como autoridade no seu nicho.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                <Monitor className="text-amber-400"/>
                <span className="font-bold text-sm">Pós-Produção Premium</span>
                <span className="text-xs text-white/40">Edição de pele natural e cores de cinema.</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                <User className="text-amber-400"/>
                <span className="font-bold text-sm">Direção de Poses</span>
                <span className="text-xs text-white/40">Eu guio cada movimento seu.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVIÇOS --- */}
      <section id="services" className="py-32 px-6 bg-[#080808] relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-bold mb-4">Experiências Disponíveis</h2>
             <p className="text-white/50">Escolha o formato ideal para sua necessidade.</p>
          </div>

          <div className="flex justify-center gap-4 mb-12">
            {DATA.categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full border transition-all duration-300 text-xs font-bold uppercase tracking-widest
                ${activeCategory === cat.id ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40'}`}
              >
                <cat.icon size={16}/> {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DATA.services.filter(s => s.catId === activeCategory).map(s => (
              <GlassCard key={s.id} hoverEffect className="p-8 md:p-10 flex flex-col relative group border-white/5">
                 {/* Destaque */}
                 {s.tag && <div className="absolute top-6 right-6 px-3 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-bold uppercase text-amber-400">{s.tag}</div>}
                 
                 <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors">{s.title}</h3>
                 <p className="text-white/60 text-sm mb-6 h-10">{s.desc}</p>

                 <div className="flex items-baseline gap-2 mb-8 border-b border-white/5 pb-6">
                   <span className="text-3xl font-bold">{CONFIG.CURRENCY} {s.price}</span>
                   <span className="text-xs text-white/30 line-through">{CONFIG.CURRENCY} {s.oldPrice}</span>
                 </div>

                 <div className="space-y-3 mb-8 flex-1">
                   {s.features.map((f, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                       <Check size={14} className="text-amber-400 shrink-0"/> {f}
                     </div>
                   ))}
                 </div>

                 <Button 
                   full 
                   variant={booking.serviceId === s.id ? 'gold' : 'glass'}
                   onClick={() => {
                     setBooking(prev => ({...prev, serviceId: s.id}));
                     document.getElementById('agendar')?.scrollIntoView({behavior:'smooth'});
                   }}
                 >
                   {booking.serviceId === s.id ? 'Selecionado' : 'Agendar Data'}
                 </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- CARROSSEL PORTFÓLIO (NOVO) --- */}
      <section id="portfolio" className="py-20 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold mb-2">Galeria Visual</h2>
            <p className="text-white/50 text-sm">Arraste para o lado ou use as setas.</p>
          </div>
          <Button variant="glass" size="sm" onClick={() => window.open(DATA.heroVideo)}>Ver Showreel</Button>
        </div>
        
        {/* Componente Carrossel */}
        <Carousel items={DATA.portfolio} onItemClick={setLightboxImage} />
      </section>

      {/* --- AGENDAMENTO SIMPLIFICADO (UX MELHORADA) --- */}
      <section id="agendar" className="py-32 px-6 relative z-10 bg-[#080808]">
        <div className="max-w-4xl mx-auto">
           <GlassCard className="p-8 md:p-12 bg-black/40 backdrop-blur-2xl border-white/10">
             
             <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-2">Finalizar Agendamento</h2>
               <p className="text-white/50">Selecione data e hora para garantir sua produção.</p>
             </div>

             {/* RESUMO DO SERVIÇO SELECIONADO */}
             <div className="mb-10 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedService ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/20'}`}>
                    {selectedService ? (selectedService.catId === 'foto' ? <Camera size={20}/> : <Film size={20}/>) : <ArrowRight size={20}/>}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/40">Serviço Escolhido</p>
                    <p className="font-bold text-lg">{selectedService ? selectedService.title : 'Nenhum selecionado'}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                   <p className="text-[10px] uppercase font-bold text-white/40">Valor</p>
                   <p className="font-bold text-xl text-amber-400">{CONFIG.CURRENCY} {total}</p>
                </div>
             </div>

             {selectedService ? (
               <div className="space-y-10 animate-fade-in-up">
                  
                  {/* 1. SELEÇÃO DE DATA HORIZONTAL (SCROLL) */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
                      <Calendar size={14} className="text-amber-400"/> 1. Escolha o Dia
                    </label>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                       {Array.from({length: 15}).map((_, i) => {
                         const d = new Date(); d.setDate(d.getDate() + i + 1);
                         const isSelected = booking.date?.toDateString() === d.toDateString();
                         return (
                           <button 
                             key={i}
                             onClick={() => setBooking(prev => ({...prev, date: d, time: null}))}
                             className={`flex-shrink-0 snap-start w-20 h-24 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all
                             ${isSelected ? 'bg-white text-black border-white scale-105 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                           >
                             <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).replace('.', '')}</span>
                             <span className="text-2xl font-light">{d.getDate()}</span>
                           </button>
                         )
                       })}
                    </div>
                  </div>

                  {/* 2. SELEÇÃO DE HORÁRIO (GRID LIMPO) */}
                  <div className={!booking.date ? 'opacity-30 pointer-events-none' : ''}>
                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
                      <Clock size={14} className="text-amber-400"/> 2. Escolha o Horário
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {['09:00', '10:30', '14:00', '16:00', '19:00'].map(t => (
                        <button 
                          key={t}
                          onClick={() => setBooking(prev => ({...prev, time: t}))}
                          className={`py-4 rounded-xl text-sm font-bold border transition-all
                          ${booking.time === t ? 'bg-white text-black border-white shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. DADOS FINAIS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Seu Nome</label>
                      <input 
                        value={booking.client.name}
                        onChange={e => setBooking(b => ({...b, client: {...b.client, name: e.target.value}}))}
                        className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:border-white/50 outline-none transition-colors"
                        placeholder="Nome Completo"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Instagram (Opcional)</label>
                      <input 
                        value={booking.client.instagram}
                        onChange={e => setBooking(b => ({...b, client: {...b.client, instagram: e.target.value}}))}
                        className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-4 py-4 focus:border-white/50 outline-none transition-colors"
                        placeholder="@seu.perfil"
                      />
                    </div>
                  </div>

                  {/* EXTRAS CHECKBOX */}
                  <div className="flex flex-wrap gap-3">
                    {DATA.extras.map(ex => (
                      <button 
                        key={ex.id}
                        onClick={() => setBooking(b => ({...b, extras: {...b.extras, [ex.id]: !b.extras[ex.id]}}))}
                        className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center gap-2 transition-all
                        ${booking.extras[ex.id] ? 'bg-amber-400 text-black border-amber-400' : 'bg-transparent text-white/50 border-white/10'}`}
                      >
                        {booking.extras[ex.id] ? <Check size={12}/> : <Sparkles size={12}/>}
                        {ex.label} (+R${ex.price})
                      </button>
                    ))}
                  </div>

                  <Button full size="lg" variant="whatsapp" onClick={handleCheckout} disabled={!booking.date || !booking.time || !booking.client.name}>
                    <MessageCircle size={20}/> Confirmar Agendamento
                  </Button>

               </div>
             ) : (
               <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                 <p className="text-white/40 mb-4">Escolha uma experiência acima para desbloquear a agenda.</p>
                 <Button variant="glass" size="sm" onClick={() => document.getElementById('services')?.scrollIntoView({behavior:'smooth'})}>Ver Experiências</Button>
               </div>
             )}
           </GlassCard>
        </div>
      </section>

      {/* --- RODAPÉ --- */}
      <footer className="py-20 bg-black text-center border-t border-white/5 relative z-10">
        <p className="text-2xl font-bold tracking-tight mb-2">Lumina<span className="text-amber-400">.Studio</span></p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8">© 2026 Todos os direitos reservados</p>
      </footer>

      {/* STYLES GLOBAIS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        
        body { font-family: 'Inter', sans-serif; background: #050505; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
