import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera, Calendar, Clock, User, Instagram, 
  Check, X, MessageCircle, Play, Star,
  ShieldCheck, Sparkles, Loader2, Menu, Crown,
  Zap, Film, ChevronDown, ArrowRight, Maximize2, Aperture, Monitor
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA CINEMATIC OS - ULTIMATE GLASS EDITION
 * ==================================================================================
 * VISUAL: Apple Glass 2026 (Blur, Transparência, Glow)
 * FUNCIONALIDADES: Completas (XP, Bio, Lightbox, Video Maker, Fotografia)
 */

// --- 1. CONFIGURAÇÃO & DADOS COMPLETOS ---

const CONFIG = {
  PHONE: "5517991360413", 
  CURRENCY: 'R$',
  BRAND: "Lumina Studio"
};

const DATA = {
  // VÍDEO HERO: Loop de alta qualidade
  heroVideo: "https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4",
  
  // FOTO DO FOTÓGRAFO (BIO)
  aboutImage: "https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&w=1200&q=90",

  stats: [
    { label: "Produções", value: "850+" },
    { label: "Prêmios", value: "14" },
    { label: "Anos de Mercado", value: "8" }
  ],

  // NÍVEIS DE FIDELIDADE (VOLTOU!)
  levels: [
    { level: 1, title: "Member", min: 0, color: "text-zinc-400" },
    { level: 2, title: "VIP Client", min: 1500, color: "text-amber-400" },
    { level: 3, title: "Gold Partner", min: 3000, color: "text-purple-400" }
  ],

  categories: [
    { id: 'foto', label: 'Fotografia', icon: Camera },
    { id: 'video', label: 'Cinema & Vídeo', icon: Film }
  ],

  services: [
    // FOTOGRAFIA
    {
      id: 'foto-pessoal',
      catId: 'foto',
      title: "Signature Portrait",
      price: 490,
      oldPrice: 650,
      duration: "1h",
      desc: "Sua imagem pessoal elevada ao nível de arte. Ideal para branding e LinkedIn.",
      features: ["10 Fotos High-End", "1 Look Completo", "Direção de Poses", "Galeria Vitalícia"],
      tag: "POPULAR"
    },
    {
      id: 'foto-editorial',
      catId: 'foto',
      title: "Vogue Experience",
      price: 990,
      oldPrice: 1400,
      duration: "2h",
      desc: "Sinta-se em uma capa de revista. Produção artística e luz cinematográfica.",
      features: ["30 Fotos Fine Art", "3 Trocas de Look", "Fashion Film (15s)", "Guia de Estilo"],
      tag: "BEST SELLER"
    },
    // VÍDEO / CINEMA
    {
      id: 'video-reels',
      catId: 'video',
      title: "Viral Reels Maker",
      price: 590,
      oldPrice: 800,
      duration: "1.5h",
      desc: "Conteúdo vertical dinâmico para explodir seu alcance (TikTok/Reels).",
      features: ["3 Vídeos Verticais", "Edição Rítmica", "Captação 4K", "Roteiro Incluso"],
      tag: "TRENDING"
    },
    {
      id: 'video-brand',
      catId: 'video',
      title: "Brand Cinema",
      price: 2200,
      oldPrice: 3000,
      duration: "4h",
      desc: "Um manifesto visual da sua marca. Narrativa completa para lançamentos.",
      features: ["Filme Hero (60s)", "Drone Incluso", "Sound Design", "Entrevistas"],
      tag: "PREMIUM"
    }
  ],

  // EXTRAS (VOLTOU!)
  extras: [
    { id: 'video_teaser', label: "Teaser Vertical 4K", price: 400, desc: "Vídeo extra para Stories.", icon: Film },
    { id: 'rush', label: "Entrega Express (24h)", price: 200, desc: "Fure a fila da edição.", icon: Zap },
    { id: 'makeup', label: "Make & Hair", price: 300, desc: "Produção profissional no set.", icon: User }
  ],

  portfolio: [
    { id: 1, cat: "Editorial", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=90" },
    { id: 2, cat: "Cinema", src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=90" },
    { id: 3, cat: "Retrato", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=90" },
    { id: 4, cat: "Urbano", src: "https://images.unsplash.com/photo-1519744531242-c10a2295d8be?w=1200&q=90" },
    { id: 5, cat: "Estúdio", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=90" },
    { id: 6, cat: "Moda", src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=90" }
  ]
};

// --- 2. COMPONENTES VISUAIS (DESIGN SYSTEM GLASS) ---

const GlassCard = ({ children, className = "", hoverEffect = false, onClick }: any) => (
  <div onClick={onClick} className={`
    relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl
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
    primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.2)]",
    glass: "bg-white/10 text-white border border-white/10 hover:bg-white/20 backdrop-blur-md",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebc57] shadow-[0_0_30px_rgba(37,211,102,0.3)]",
    gold: "bg-gradient-to-r from-amber-400 to-amber-600 text-black hover:brightness-110 shadow-[0_0_30px_rgba(245,158,11,0.4)]"
  };
  const sizes: any = { md: "h-12 px-6 text-xs uppercase", lg: "h-16 px-10 text-sm uppercase tracking-widest" };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${sizes[size]} ${full ? 'w-full' : ''}`}>
      {Icon && <Icon size={18} />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

// --- LIGHTBOX (VOLTOU!) ---
const Lightbox = ({ image, onClose }: any) => {
  if (!image) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-50">
        <X size={24} className="text-white"/>
      </button>
      <img src={image.src} alt={image.cat} className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scale-in"/>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-xs font-bold uppercase tracking-widest bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
        Coleção: {image.cat}
      </div>
    </div>
  );
};

// --- 3. APP PRINCIPAL ---

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
    xp: 2200 // Mock XP do usuário
  });

  useEffect(() => setTimeout(() => setLoading(false), 2000), []);

  // CÁLCULOS
  const selectedService = DATA.services.find(s => s.id === booking.serviceId);
  const total = useMemo(() => {
    let val = selectedService ? selectedService.price : 0;
    Object.keys(booking.extras).forEach(k => {
      if(booking.extras[k]) val += DATA.extras.find(e => e.id === k)?.price || 0;
    });
    return val;
  }, [booking.serviceId, booking.extras]);

  const currentLevel = [...DATA.levels].reverse().find(l => booking.xp >= l.min) || DATA.levels[0];
  const nextLevel = DATA.levels.find(l => l.min > booking.xp);
  const progress = nextLevel ? ((booking.xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  const handleCheckout = () => {
    if(!selectedService || !booking.date || !booking.time || !booking.client.name) return;
    const dateStr = booking.date.toLocaleDateString(CONFIG.LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => `+ ${DATA.extras.find(e=>e.id===k)?.label}`).join('\n');
    
    const msg = `
🎬 *SOLICITAÇÃO DE PRODUÇÃO*
──────────────────────
👤 *CLIENTE*
Nome: *${booking.client.name}*
Insta: ${booking.client.instagram}

🎥 *PROJETO*
Serviço: *${selectedService.title.toUpperCase()}*
Tipo: ${selectedService.catId === 'foto' ? 'Fotografia' : 'Vídeo Maker'}
Data: ${dateStr} às ${booking.time}

✨ *ADICIONAIS*
${extrasList || 'Nenhum'}
──────────────────────
💎 *TOTAL ESTIMADO: ${CONFIG.CURRENCY} ${total},00*
`.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center animate-spin-slow mb-4 relative">
        <div className="absolute inset-0 border-t border-white rounded-full animate-spin"></div>
        <Aperture size={32} className="text-white"/>
      </div>
      <p className="text-white/50 text-xs uppercase tracking-[0.5em] animate-pulse">Carregando Estúdio</p>
    </div>
  );

  return (
    <div className="bg-[#030303] text-white font-sans selection:bg-white/30 min-h-screen relative overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/10 rounded-full blur-[150px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

      {/* --- MENU FLUTUANTE (GLASS) --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
        <GlassCard className="flex items-center justify-between px-6 py-4 !rounded-full bg-black/40 backdrop-blur-2xl border-white/10">
          <div className="flex items-center gap-2">
            <Aperture size={20}/>
            <span className="font-bold tracking-tight">Lumina<span className="font-light text-white/50">.OS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Sobre', 'Portfolio', 'Serviços', 'Agendar'].map(item => (
              <button 
                key={item} 
                onClick={() => document.getElementById(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs font-medium text-white/60 hover:text-white transition-colors uppercase tracking-widest"
              >
                {item}
              </button>
            ))}
          </div>
          <Button size="sm" variant="glass" className="hidden md:flex">Login VIP</Button>
          <button className="md:hidden text-white"><Menu size={20}/></button>
        </GlassCard>
      </nav>

      {/* --- HERO SECTION (VÍDEO + XP WIDGET) --- */}
      <section id="hero" className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* VÍDEO HERO */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50 scale-105">
            <source src={DATA.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-end pb-12">
           {/* LEFT: TEXTO */}
           <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Agenda 2026 Aberta
              </div>
              <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[0.9]">
                Visual <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Legacies.</span>
              </h1>
              <p className="text-lg text-white/70 max-w-md leading-relaxed">
                Fotografia e Produção Audiovisual. Transformamos sua imagem pessoal e de marca em cinema.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => document.getElementById('serviços')?.scrollIntoView({behavior:'smooth'})}>
                   Começar Projeto
                </Button>
                <Button size="lg" variant="glass" icon={Play} onClick={() => window.open(DATA.heroVideo, '_blank')}>
                   Showreel
                </Button>
              </div>
           </div>

           {/* RIGHT: XP WIDGET (VOLTOU!) */}
           <div className="hidden lg:flex justify-end animate-fade-in-up delay-200">
             <GlassCard className="w-72 p-6 bg-black/40">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <p className="text-[10px] uppercase font-bold text-white/40 mb-1">Status Atual</p>
                   <p className={`text-lg font-bold flex items-center gap-2 ${currentLevel.color}`}>
                     <Crown size={18}/> {currentLevel.title}
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] uppercase font-bold text-white/40 mb-1">XP Total</p>
                   <p className="text-lg font-bold">{booking.xp}</p>
                 </div>
               </div>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className={`h-full ${currentLevel.color.replace('text', 'bg')} shadow-[0_0_10px_currentColor]`} style={{width: `${progress}%`}}></div>
               </div>
               <p className="text-[10px] text-white/40 text-right">Próximo: {nextLevel?.title}</p>
             </GlassCard>
           </div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-3 divide-x divide-white/5">
          {DATA.stats.map((s, i) => (
            <div key={i} className="py-8 text-center">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-white/40">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SOBRE (PARALLAX + GLASS) --- */}
      <section id="sobre" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[2.5rem] rotate-3 group-hover:rotate-6 transition-transform duration-700 blur-xl"></div>
             <div className="relative rounded-[2.5rem] overflow-hidden aspect-[3/4] border border-white/10">
               <img src={DATA.aboutImage} alt="Profile" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"/>
             </div>
          </div>
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-4 block">O Artista</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Muito Além do <br/>Clique.</h2>
            <div className="space-y-6 text-white/60 leading-relaxed">
              <p>
                Com 8 anos de experiência em sets internacionais, trago a estética do cinema para o seu posicionamento.
                Não é apenas sobre tirar uma foto, é sobre <strong>dirigir a sua melhor versão</strong>.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                 <GlassCard className="p-4 flex items-center gap-4">
                   <Monitor className="text-white/50"/>
                   <div>
                     <p className="font-bold text-sm text-white">Pós-Produção</p>
                     <p className="text-[10px] text-white/40">Retouch High-End</p>
                   </div>
                 </GlassCard>
                 <GlassCard className="p-4 flex items-center gap-4">
                   <User className="text-white/50"/>
                   <div>
                     <p className="font-bold text-sm text-white">Direção</p>
                     <p className="text-[10px] text-white/40">Guia de Poses</p>
                   </div>
                 </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SERVIÇOS (TABS + CARDS) --- */}
      <section id="serviços" className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-bold mb-4">Experiências</h2>
             <p className="text-white/50">Selecione a categoria ideal para seu momento.</p>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex justify-center gap-4 mb-16">
            {DATA.categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-8 py-4 rounded-full border transition-all duration-300 text-xs font-bold uppercase tracking-widest
                ${activeCategory === cat.id ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40'}`}
              >
                <cat.icon size={16}/> {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DATA.services.filter(s => s.catId === activeCategory).map(s => (
              <GlassCard key={s.id} hoverEffect className="p-8 md:p-12 flex flex-col group">
                 <div className="flex justify-between items-start mb-6">
                   {s.tag && <span className="px-3 py-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-full">{s.tag}</span>}
                   <div className="text-right">
                     <p className="text-3xl font-bold">{CONFIG.CURRENCY} {s.price}</p>
                     <p className="text-xs text-white/30 line-through">{CONFIG.CURRENCY} {s.oldPrice}</p>
                   </div>
                 </div>

                 <h3 className="text-2xl font-bold mb-2 group-hover:text-amber-400 transition-colors">{s.title}</h3>
                 <p className="text-white/60 text-sm mb-8 leading-relaxed h-10">{s.desc}</p>

                 <div className="space-y-4 mb-10 flex-1">
                   {s.features.map((f, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm text-white/80">
                       <Check size={14} className="text-green-400"/> {f}
                     </div>
                   ))}
                   <div className="flex items-center gap-3 text-sm text-white/50 pt-2 border-t border-white/5">
                      <Clock size={14}/> Duração: {s.duration}
                   </div>
                 </div>

                 <Button 
                   full 
                   variant={booking.serviceId === s.id ? 'gold' : 'glass'}
                   onClick={() => {
                     setBooking(prev => ({...prev, serviceId: s.id}));
                     document.getElementById('agendar')?.scrollIntoView({behavior:'smooth'});
                   }}
                 >
                   {booking.serviceId === s.id ? 'Selecionado' : 'Reservar Data'}
                 </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO GRID --- */}
      <section id="portfolio" className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-bold">Galeria Recente</h2>
            <span className="text-xs uppercase tracking-widest text-white/50">Explore o Acervo</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 auto-rows-[250px] md:auto-rows-[350px]">
            {DATA.portfolio.map((item, i) => (
              <div 
                key={i} 
                onClick={() => setLightboxImage(item)}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer ${i === 0 || i === 3 ? 'col-span-2' : ''}`}
              >
                <img src={item.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt=""/>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                   <Maximize2 className="text-white"/>
                   <span className="text-xs font-bold uppercase">{item.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- AGENDAMENTO COMPLETO (GLASS ENGINE) --- */}
      <section id="agendar" className="py-32 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
           <GlassCard className="p-8 md:p-12 bg-black/60 overflow-hidden">
             {/* HEADER */}
             <div className="flex items-center gap-6 mb-12 border-b border-white/10 pb-8">
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${selectedService ? 'bg-white text-black' : 'bg-white/5 text-white/20'}`}>
                 {selectedService ? (selectedService.catId === 'foto' ? <Camera/> : <Film/>) : <Aperture/>}
               </div>
               <div>
                 <p className="text-xs uppercase font-bold text-white/40 mb-1">Você está agendando</p>
                 <h2 className="text-2xl font-bold">{selectedService ? selectedService.title : 'Selecione uma experiência acima'}</h2>
               </div>
               <div className="ml-auto text-right hidden md:block">
                 <p className="text-xs uppercase font-bold text-white/40 mb-1">Investimento Total</p>
                 <p className="text-3xl font-bold text-amber-400">{CONFIG.CURRENCY} {total}</p>
               </div>
             </div>

             {selectedService ? (
               <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 animate-fade-in-up">
                 {/* ESQUERDA: SELEÇÕES */}
                 <div className="space-y-10">
                    {/* 1. DATA */}
                    <div>
                       <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
                         <Calendar size={14} className="text-amber-400"/> 1. Data
                       </label>
                       <div className="grid grid-cols-5 md:grid-cols-7 gap-2">
                         {Array.from({length: 14}).map((_, i) => {
                           const d = new Date(); d.setDate(d.getDate() + i + 1);
                           const isSel = booking.date?.toDateString() === d.toDateString();
                           return (
                             <button 
                               key={i} 
                               onClick={() => setBooking(prev => ({...prev, date: d, time: null}))}
                               className={`h-20 rounded-xl border flex flex-col items-center justify-center transition-all
                               ${isSel ? 'bg-white text-black border-white scale-105 shadow-lg' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                             >
                               <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString(CONFIG.LOCALE, {weekday: 'short'}).slice(0,3)}</span>
                               <span className="text-xl font-light">{d.getDate()}</span>
                             </button>
                           )
                         })}
                       </div>
                    </div>

                    {/* 2. HORÁRIO */}
                    <div className={!booking.date ? 'opacity-30 pointer-events-none' : ''}>
                       <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
                         <Clock size={14} className="text-amber-400"/> 2. Horário
                       </label>
                       <div className="grid grid-cols-4 gap-3">
                         {['09:00', '11:00', '14:00', '16:00', '17:30', '19:00', '20:30'].map(t => (
                           <button 
                             key={t}
                             onClick={() => setBooking(prev => ({...prev, time: t}))}
                             className={`py-3 rounded-xl text-xs font-bold border transition-all ${booking.time === t ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                           >
                             {t}
                           </button>
                         ))}
                       </div>
                    </div>

                    {/* 3. EXTRAS (VOLTOU!) */}
                    <div>
                       <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/60 mb-4">
                         <Sparkles size={14} className="text-amber-400"/> 3. Upgrades
                       </label>
                       <div className="space-y-3">
                         {DATA.extras.map(ex => (
                           <div 
                             key={ex.id} 
                             onClick={() => setBooking(b => ({...b, extras: {...b.extras, [ex.id]: !b.extras[ex.id]}}))}
                             className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all
                             ${booking.extras[ex.id] ? 'bg-white/10 border-amber-400/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                           >
                             <div className="flex items-center gap-4">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${booking.extras[ex.id] ? 'bg-amber-400 text-black' : 'bg-white/10 text-white/30'}`}>
                                 <ex.icon size={14}/>
                               </div>
                               <div>
                                 <p className="text-sm font-bold">{ex.label}</p>
                                 <p className="text-[10px] text-white/50">{ex.desc}</p>
                               </div>
                             </div>
                             <span className="text-xs font-bold text-amber-400">+ {CONFIG.CURRENCY} {ex.price}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                 </div>

                 {/* DIREITA: DADOS E CONFIRMAÇÃO */}
                 <div className="bg-white/5 rounded-3xl p-6 border border-white/5 h-fit sticky top-24">
                    <h3 className="text-lg font-bold mb-6">Seus Dados</h3>
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-white/40 ml-2">Nome Completo</label>
                        <input 
                           value={booking.client.name}
                           onChange={e => setBooking(b => ({...b, client: {...b.client, name: e.target.value}}))}
                           className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/50 outline-none transition-colors"
                           placeholder="Ex: João Silva"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-white/40 ml-2">Instagram</label>
                        <input 
                           value={booking.client.instagram}
                           onChange={e => setBooking(b => ({...b, client: {...b.client, instagram: e.target.value}}))}
                           className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/50 outline-none transition-colors"
                           placeholder="@seu.perfil"
                        />
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-white/60">Total Estimado</span>
                        <span className="text-2xl font-bold">{CONFIG.CURRENCY} {total}</span>
                      </div>
                      <p className="text-[10px] text-white/30 text-right">Pagamento seguro via link após confirmação</p>
                    </div>

                    <Button full size="lg" variant="whatsapp" onClick={handleCheckout} disabled={!booking.date || !booking.time || !booking.client.name}>
                       <MessageCircle size={18}/> Enviar Solicitação
                    </Button>
                 </div>
               </div>
             ) : (
               <div className="text-center py-12 text-white/30">
                 <ArrowRight size={32} className="-rotate-90 mx-auto mb-4"/>
                 <p>Por favor, selecione uma experiência na seção anterior.</p>
               </div>
             )}
           </GlassCard>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/5 bg-black text-center relative z-10">
         <p className="text-2xl font-bold tracking-tight mb-2">Lumina<span className="font-light text-white/50">.OS</span></p>
         <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8">Cinema & Fotografia • Est. 2018</p>
         <div className="flex justify-center gap-4">
           <Button variant="glass" size="md" icon={Instagram}>Instagram</Button>
           <Button variant="glass" size="md" icon={MessageCircle}>WhatsApp</Button>
         </div>
      </footer>

      {/* STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        
        .animate-blob { animation: blob 15s infinite; }
        .animation-delay-2000 { animation-delay: 5s; }
        .animate-fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
