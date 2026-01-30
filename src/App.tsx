import React, { useState, useEffect, useMemo } from 'react';
import {
  Camera, ArrowRight, Calendar, Clock, User, Instagram, 
  Check, X, MessageCircle, Play, Star,
  ShieldCheck, Sparkles, Loader2, Aperture, Menu, Crown,
  Zap, Film, Monitor, Quote, MousePointer2, Maximize2, Video
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA CINEMATIC OS v8.0 - MASTER EDITION
 * ==================================================================================
 * Concept: "Noir Luxury"
 * Stack: React + Tailwind + Lucide
 * UX Goal: High-Ticket Conversion & Emotional Connection
 */

// --- 1. CONFIGURAÇÃO E DADOS DE PRODUTO (COPYWRITING SÊNIOR) ---

const CONFIG = {
  PHONE: "5517991360413", 
  CURRENCY: 'R$',
  LOCALE: 'pt-BR',
  BRAND: "Lumina Studio",
  WHATSAPP_MSG: "Olá! Vim através do site e gostaria de confirmar minha experiência cinematográfica."
};

const DATA = {
  // HERO: Foco em movimento e emoção
  heroVideo: "https://videos.pexels.com/video-files/3205914/3205914-hd_1920_1080_25fps.mp4",
  heroPoster: "https://images.pexels.com/videos/3205914/free-video-3205914.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  aboutImage: "https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&w=1200&q=90",

  stats: [
    { label: "Produções", value: "850+" },
    { label: "Awards", value: "14" },
    { label: "Experience", value: "8 Anos" }
  ],

  // PRODUTO: Estrutura Híbrida (Foto & Vídeo)
  categories: [
    { id: 'photo', label: 'Fotografia High-End', icon: Camera },
    { id: 'cinema', label: 'Cinema & Video Maker', icon: Film }
  ],

  services: [
    // FOTOGRAFIA
    {
      id: 'portrait',
      category: 'photo',
      title: "Signature Portrait",
      price: 490,
      oldPrice: 650,
      duration: "1h",
      desc: "Sua imagem pessoal elevada ao nível de arte. A escolha definitiva para branding pessoal e posicionamento de autoridade.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      features: ["10 Fotos High-End Retouch", "Direção de Poses & Expressão", "Galeria Online Vitalícia"],
      tag: "POPULAR"
    },
    {
      id: 'editorial',
      category: 'photo',
      title: "Vogue Experience",
      price: 990,
      oldPrice: 1400,
      duration: "2h",
      desc: "Sinta a atmosfera de uma capa de revista. Produção artística completa, iluminação cinematográfica e styling direction.",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
      features: ["30 Fotos Fine Art", "3 Trocas de Look", "Fashion Film Teaser (15s)", "Consultoria de Imagem"],
      tag: "BEST SELLER"
    },
    // VÍDEO / CINEMA
    {
      id: 'reels',
      category: 'cinema',
      title: "Viral Reels Maker",
      price: 590,
      oldPrice: 800,
      duration: "1.5h",
      desc: "Conteúdo vertical dinâmico para explodir seu alcance. Edição rítmica, sound design e color grading profissional.",
      img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44c?auto=format&fit=crop&w=800&q=80",
      features: ["3 Vídeos Verticais (Reels/TikTok)", "Roteiro Estratégico", "Captação 4K 60fps", "Entrega em 48h"],
      tag: "TRENDING"
    },
    {
      id: 'campaign',
      category: 'cinema',
      title: "Brand Campaign Film",
      price: 2200,
      oldPrice: 3500,
      duration: "4h",
      desc: "Um manifesto visual da sua marca. Narrativa cinematográfica completa para lançamentos, sites e anúncios de alto impacto.",
      img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
      features: ["Filme Hero (60s-90s)", "Drone (se aplicável)", "Sound Design Imersivo", "Entrevistas & B-Roll"],
      tag: "PREMIUM"
    }
  ],

  extras: [
    { id: 'rush', label: "Entrega Express (24h)", price: 250, desc: "Fure a fila da edição.", icon: Zap },
    { id: 'raw', label: "Arquivos RAW/Log", price: 400, desc: "Todos os arquivos originais.", icon: Aperture },
    { id: 'makeup', label: "Make & Hair Pro", price: 350, desc: "Profissional dedicado no set.", icon: User }
  ],

  portfolio: [
    { id: 1, cat: "Editorial", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=90" },
    { id: 2, cat: "Cinema", src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&q=90" },
    { id: 3, cat: "Portrait", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&q=90" },
    { id: 4, cat: "Urban", src: "https://images.unsplash.com/photo-1519744531242-c10a2295d8be?w=1200&q=90" },
    { id: 5, cat: "Studio", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&q=90" },
    { id: 6, cat: "Fashion", src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&q=90" }
  ]
};

// --- 2. COMPONENTES UI (DESIGN SYSTEM) ---

const Button = ({ children, variant = 'primary', size = 'md', full = false, icon: Icon, onClick, className = '', disabled, loading }: any) => {
  const base = "relative flex items-center justify-center font-bold tracking-widest transition-all duration-300 rounded-none uppercase disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden border";
  
  const variants: any = {
    primary: "bg-white text-black border-white hover:bg-zinc-200 hover:border-zinc-200",
    secondary: "bg-transparent text-white border-white/20 hover:border-white hover:bg-white/5",
    whatsapp: "bg-[#25D366] text-white border-[#25D366] hover:bg-[#20bd5a] hover:border-[#20bd5a] shadow-[0_0_20px_rgba(37,211,102,0.3)]",
    gold: "bg-amber-600 text-white border-amber-600 hover:bg-amber-500 hover:border-amber-500"
  };
  
  const sizes: any = {
    sm: "h-10 text-[10px] px-6",
    md: "h-12 text-xs px-8",
    lg: "h-16 text-sm px-10",
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 className="animate-spin" size={18}/> : (
        <span className="flex items-center gap-3 relative z-10">
          {Icon && <Icon size={18} />}
          {children}
        </span>
      )}
    </button>
  );
};

const SectionTitle = ({ sub, title, desc, align = 'center' }: any) => (
  <div className={`mb-20 ${align === 'center' ? 'text-center' : 'text-left'} animate-on-scroll`}>
    <span className="inline-block py-1 px-3 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
      {sub}
    </span>
    <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-6">
      {title}
    </h2>
    <div className={`h-[1px] w-24 bg-amber-500/50 mb-8 ${align === 'center' ? 'mx-auto' : ''}`}></div>
    {desc && <p className={`text-white/60 text-sm md:text-base leading-relaxed font-light max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>{desc}</p>}
  </div>
);

// --- 3. APLICAÇÃO PRINCIPAL ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('photo');
  
  // BOOKING STATE
  const [booking, setBooking] = useState({
    serviceId: '',
    date: null as Date | null,
    time: null as string | null,
    extras: {} as Record<string, boolean>,
    client: { name: '', instagram: '' }
  });

  useEffect(() => {
    // Intro Simulada
    setTimeout(() => setLoading(false), 2500);
  }, []);

  const selectedService = DATA.services.find(s => s.id === booking.serviceId);
  
  const total = useMemo(() => {
    let val = selectedService ? selectedService.price : 0;
    Object.keys(booking.extras).forEach(k => {
      if(booking.extras[k]) val += DATA.extras.find(e => e.id === k)?.price || 0;
    });
    return val;
  }, [booking.serviceId, booking.extras]);

  const handleCheckout = () => {
    if(!selectedService || !booking.date || !booking.time || !booking.client.name) return;
    
    const dateStr = booking.date.toLocaleDateString(CONFIG.LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => `+ ${DATA.extras.find(e=>e.id===k)?.label}`).join('\n');
    
    const msg = `
🎬 *PEDIDO DE PRODUÇÃO - ${CONFIG.BRAND.toUpperCase()}*
──────────────────────
👤 *PROTAGONISTA*
Nome: *${booking.client.name}*
Instagram: ${booking.client.instagram}

📽️ *PROJETO*
Serviço: *${selectedService.title.toUpperCase()}*
Categoria: ${selectedService.category === 'photo' ? 'Fotografia' : 'Cinema/Vídeo'}
Duração: ${selectedService.duration}

📅 *AGENDA*
${dateStr}
Horário: ${booking.time}

✨ *ADICIONAIS*
${extrasList || 'Standard'}
──────────────────────
💰 *INVESTIMENTO FINAL: ${CONFIG.CURRENCY} ${total},00*
🔗 *Status:* Aguardando Aprovação

ID: #${Math.floor(Math.random()*99999)}
`.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#050505] z-[100] flex flex-col items-center justify-center">
      <div className="w-px h-24 bg-gradient-to-b from-transparent via-amber-500 to-transparent animate-pulse mb-8"></div>
      <p className="text-[10px] font-bold tracking-[0.5em] text-white/50 uppercase animate-pulse">Lumina Cinematic</p>
    </div>
  );

  return (
    <div className="bg-[#020202] text-white font-sans selection:bg-amber-900/50 selection:text-white overflow-x-hidden relative">
      
      {/* BACKGROUND NOISE TEXTURE */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>

      {/* --- LIGHTBOX --- */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-4 md:p-12 animate-fade-in">
          <button onClick={() => setLightboxImage(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
            <X size={32} strokeWidth={1} />
          </button>
          <img src={lightboxImage.src} className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" alt=""/>
          <div className="absolute bottom-8 left-8">
            <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mb-1">{lightboxImage.cat}</p>
            <p className="text-white text-sm opacity-50">Lumina Portfolio</p>
          </div>
        </div>
      )}

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          <Aperture className="text-white" size={24}/>
          <span className="text-lg font-bold tracking-tighter uppercase">Lumina<span className="font-light opacity-70">Studio</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {['Portfolio', 'Serviços', 'Agendar'].map((item) => (
             <button key={item} onClick={() => document.getElementById(item === 'Agendar' ? 'booking' : item.toLowerCase())?.scrollIntoView({behavior:'smooth'})} className="text-[10px] uppercase tracking-[0.2em] font-bold hover:text-amber-500 transition-colors">
               {item}
             </button>
          ))}
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}><Menu/></button>
      </nav>

      {/* --- HERO CINEMATIC --- */}
      <section className="relative h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline poster={DATA.heroPoster} className="w-full h-full object-cover opacity-40 scale-105">
            <source src={DATA.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl space-y-8 animate-fade-in-up">
           <div className="flex justify-center mb-4">
             <div className="px-4 py-1 border border-white/20 rounded-full backdrop-blur-md flex items-center gap-2">
               <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
               <span className="text-[10px] uppercase tracking-widest font-bold">Rec / On Air</span>
             </div>
           </div>
           
           <h1 className="text-5xl md:text-8xl font-serif text-white leading-[0.9]">
             We Create <br/>
             <span className="italic text-white/80">Visual Legacies.</span>
           </h1>
           
           <p className="text-sm md:text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
             Produção audiovisual e fotografia high-end. Transformamos sua imagem pessoal e sua marca em uma narrativa cinematográfica.
           </p>

           <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
             <Button variant="primary" size="lg" onClick={() => document.getElementById('serviços')?.scrollIntoView({behavior:'smooth'})}>
               Ver Produções
             </Button>
             <Button variant="secondary" size="lg" icon={Play} onClick={() => window.open(DATA.heroVideo, '_blank')}>
               Showreel 2026
             </Button>
           </div>
        </div>
      </section>

      {/* --- STATS STRIP --- */}
      <div className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center px-6 py-8 gap-8">
          {DATA.stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center md:items-start">
              <span className="text-2xl font-serif text-amber-500">{s.value}</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">{s.label}</span>
            </div>
          ))}
          <div className="hidden md:block w-px h-10 bg-white/10"></div>
          <p className="text-xs text-white/40 max-w-xs italic hidden md:block">
            "A arte não reproduz o visível, ela torna visível." — Paul Klee
          </p>
        </div>
      </div>

      {/* --- SERVICES (PRODUCT STRATEGY) --- */}
      <section id="serviços" className="py-32 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            sub="Nossas Especialidades" 
            title="Escolha seu Formato" 
            desc="Da fotografia editorial à produção de vídeos virais. Soluções completas para quem exige excelência visual."
          />

          {/* Category Toggle */}
          <div className="flex justify-center gap-6 mb-16">
            {DATA.categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 px-8 py-4 border transition-all duration-300 uppercase tracking-widest text-xs font-bold
                ${activeCategory === cat.id ? 'bg-white text-black border-white' : 'bg-transparent text-white/40 border-white/10 hover:border-white/40'}`}
              >
                <cat.icon size={16} /> {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DATA.services.filter(s => s.category === activeCategory).map((service) => (
              <div 
                key={service.id}
                className="group relative bg-[#0a0a0a] border border-white/5 hover:border-amber-500/30 transition-all duration-500"
              >
                <div className="aspect-video overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105"/>
                  {service.tag && <div className="absolute top-4 right-4 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">{service.tag}</div>}
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-serif text-white group-hover:text-amber-500 transition-colors">{service.title}</h3>
                    <div className="text-right">
                       <p className="text-xl font-bold">{CONFIG.CURRENCY} {service.price}</p>
                       <p className="text-xs text-white/30 line-through">{CONFIG.CURRENCY} {service.oldPrice}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/50 mb-8 h-12">{service.desc}</p>
                  
                  <ul className="space-y-3 mb-8 border-t border-white/5 pt-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs text-white/70">
                        <Check size={12} className="text-amber-500"/> {feature}
                      </li>
                    ))}
                  </ul>

                  <Button full variant={booking.serviceId === service.id ? 'gold' : 'secondary'} onClick={() => {
                    setBooking(prev => ({...prev, serviceId: service.id}));
                    document.getElementById('booking')?.scrollIntoView({behavior:'smooth'});
                  }}>
                    {booking.serviceId === service.id ? 'Selecionado' : 'Reservar Data'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO GRID --- */}
      <section id="portfolio" className="py-32 px-6 border-t border-white/5">
         <SectionTitle sub="Acervo" title="Selected Works" />
         <div className="grid grid-cols-1 md:grid-cols-3 gap-1 max-w-[1600px] mx-auto">
            {DATA.portfolio.map((item, i) => (
              <div key={i} className="group relative aspect-[3/4] md:aspect-square overflow-hidden cursor-pointer" onClick={() => setLightboxImage(item)}>
                <img src={item.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt=""/>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center flex-col gap-2">
                   <p className="text-amber-500 text-xs font-bold uppercase tracking-[0.3em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{item.cat}</p>
                   <Maximize2 className="text-white opacity-80" size={24}/>
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* --- BOOKING ENGINE (UX REFINED) --- */}
      <section id="booking" className="py-32 px-6 bg-[#080808] relative">
        <div className="max-w-5xl mx-auto">
          <SectionTitle sub="Agendamento" title="Reserve sua Sessão" desc="Selecione os detalhes finais para garantirmos a melhor produção." />

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
            {/* LEFT: CONFIGURATION */}
            <div className="space-y-12">
               
               {/* 1. SELEÇÃO DE DATA */}
               <div>
                 <h4 className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/80 mb-6 border-b border-white/10 pb-4">
                   <Calendar className="text-amber-500" size={18}/> 1. Escolha a Data
                 </h4>
                 <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                   {Array.from({length: 14}).map((_, i) => {
                     const d = new Date(); d.setDate(d.getDate() + i + 1);
                     const isSel = booking.date?.toDateString() === d.toDateString();
                     return (
                       <button key={i} onClick={() => setBooking(b => ({...b, date: d, time: null}))}
                         className={`py-4 border flex flex-col items-center justify-center transition-all
                         ${isSel ? 'bg-amber-600 border-amber-600 text-white' : 'border-white/10 text-white/40 hover:border-white/50 hover:text-white'}`}
                       >
                         <span className="text-[10px] uppercase">{d.toLocaleDateString(CONFIG.LOCALE, {weekday:'short'})}</span>
                         <span className="text-xl font-serif">{d.getDate()}</span>
                       </button>
                     )
                   })}
                 </div>
               </div>

               {/* 2. HORÁRIO */}
               <div className={!booking.date ? 'opacity-30 pointer-events-none grayscale' : ''}>
                 <h4 className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/80 mb-6 border-b border-white/10 pb-4">
                   <Clock className="text-amber-500" size={18}/> 2. Horário de Início
                 </h4>
                 <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                    {['09:00', '11:00', '14:00', '16:00', '19:00'].map(t => (
                      <button key={t} onClick={() => setBooking(b => ({...b, time: t}))}
                        className={`py-3 text-xs border transition-all ${booking.time === t ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white'}`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
               </div>

               {/* 3. EXTRAS */}
               <div>
                  <h4 className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/80 mb-6 border-b border-white/10 pb-4">
                   <Sparkles className="text-amber-500" size={18}/> 3. Adicionais de Produção
                 </h4>
                 <div className="space-y-3">
                   {DATA.extras.map(ex => (
                     <div key={ex.id} onClick={() => setBooking(b => ({...b, extras: {...b.extras, [ex.id]: !b.extras[ex.id]}}))}
                       className={`p-4 border flex items-center justify-between cursor-pointer transition-all hover:bg-white/5
                       ${booking.extras[ex.id] ? 'border-amber-500 bg-amber-500/10' : 'border-white/10'}`}
                     >
                       <div className="flex items-center gap-4">
                         <div className={`w-5 h-5 border flex items-center justify-center ${booking.extras[ex.id] ? 'bg-amber-500 border-amber-500 text-black' : 'border-white/30'}`}>
                           {booking.extras[ex.id] && <Check size={12} strokeWidth={4}/>}
                         </div>
                         <div>
                           <p className="text-sm font-bold">{ex.label}</p>
                           <p className="text-xs text-white/40">{ex.desc}</p>
                         </div>
                       </div>
                       <span className="text-xs font-bold text-amber-500">+ {CONFIG.CURRENCY} {ex.price}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            {/* RIGHT: SUMMARY & CHECKOUT */}
            <div className="bg-[#111] border border-white/10 p-8 h-fit sticky top-24">
               <h3 className="text-xl font-serif mb-6 text-center">Resumo da Produção</h3>
               
               <div className="space-y-6 text-sm mb-8">
                 <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-white/50">Serviço Principal</span>
                   <span className="text-right max-w-[50%]">{selectedService ? selectedService.title : '---'}</span>
                 </div>
                 <div className="flex justify-between border-b border-white/5 pb-2">
                   <span className="text-white/50">Data & Hora</span>
                   <span className="text-right">
                     {booking.date ? `${booking.date.toLocaleDateString()} às ${booking.time || '--:--'}` : '---'}
                   </span>
                 </div>
                 <div className="flex justify-between items-end">
                   <span className="text-white/50">Investimento Total</span>
                   <span className="text-3xl font-serif text-amber-500">{CONFIG.CURRENCY} {total}</span>
                 </div>
               </div>

               <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded border border-white/5">
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-2">Seu Nome</label>
                    <input 
                      type="text" 
                      placeholder="Nome Completo"
                      className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-amber-500 transition-colors"
                      onChange={(e) => setBooking(b => ({...b, client: {...b.client, name: e.target.value}}))}
                    />
                  </div>
                  <div className="bg-white/5 p-4 rounded border border-white/5">
                    <label className="text-[10px] uppercase font-bold text-white/40 block mb-2">Seu Instagram</label>
                    <input 
                      type="text" 
                      placeholder="@usuario"
                      className="w-full bg-transparent border-b border-white/20 pb-2 text-sm outline-none focus:border-amber-500 transition-colors"
                      onChange={(e) => setBooking(b => ({...b, client: {...b.client, instagram: e.target.value}}))}
                    />
                  </div>

                  <Button full variant="whatsapp" size="lg" onClick={handleCheckout} disabled={!selectedService || !booking.date || !booking.time || !booking.client.name}>
                    Confirmar via WhatsApp
                  </Button>
                  
                  <p className="text-[10px] text-center text-white/30 uppercase tracking-widest mt-4 flex justify-center items-center gap-2">
                    <ShieldCheck size={12}/> Pagamento Seguro na Reserva
                  </p>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-20 border-t border-white/10 text-center bg-black">
         <Aperture size={32} className="mx-auto mb-6 text-white/20"/>
         <p className="text-2xl font-serif text-white/80 mb-2">{CONFIG.BRAND}</p>
         <p className="text-xs text-white/40 tracking-[0.3em] uppercase mb-8">Cinematic Productions • Est. 2018</p>
         <div className="flex justify-center gap-6 opacity-40">
           <Instagram size={20} className="hover:text-white cursor-pointer transition-colors"/>
           <MessageCircle size={20} className="hover:text-white cursor-pointer transition-colors"/>
         </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;600&display=swap');
        
        body { font-family: 'Inter', sans-serif; }
        .font-serif { font-family: 'Playfair Display', serif; }
        
        .animate-fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
