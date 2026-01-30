import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Camera, ArrowRight, Calendar, Clock, MapPin, User, Instagram, 
  Check, X, ChevronLeft, MessageCircle, Play, Star, Image as ImageIcon,
  ShieldCheck, Smartphone, Sparkles, Loader2, Aperture, LayoutGrid
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA CINEMATIC OS v3.0 (TYPESCRIPT VERSION)
 * ==================================================================================
 * Stack: React + Tailwind + Lucide Icons
 * Target: High-End Photography Booking
 */

// --- 1. CONFIGURATION & TYPES ---

const CONFIG = {
  PHONE: "5517991360413", // SEU WHATSAPP AQUI
  CURRENCY: 'R$',
  LOCALE: 'pt-BR'
};

interface Service {
  id: string;
  title: string;
  price: number;
  desc: string;
  img: string;
  features: string[];
  tag?: string;
  duration: string;
}

interface Extra {
  id: string;
  label: string;
  price: number;
  desc: string;
}

interface BookingState {
  step: number;
  service: Service | null;
  date: Date | null;
  time: string | null;
  extras: Record<string, boolean>;
  client: {
    name: string;
    instagram: string;
    notes: string;
  };
  termsAccepted: boolean;
}

// --- 2. MOCK DATA (CONTENT) ---

const DATA = {
  heroVideo: "https://videos.pexels.com/video-files/3205914/3205914-hd_1920_1080_25fps.mp4", // Vídeo Free de Moda
  services: [
    {
      id: 'portrait',
      title: "Retrato Signature",
      price: 450,
      duration: "1h",
      desc: "Sua imagem pessoal elevada ao nível de arte. Ideal para branding.",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      features: ["10 Fotos High-End", "1 Look", "Galeria Online Vitalícia"],
      tag: "POPULAR"
    },
    {
      id: 'editorial',
      title: "Editorial Mode",
      price: 890,
      duration: "2h",
      desc: "Produção completa de moda e lifestyle. Para quem dita tendências.",
      img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
      features: ["30 Fotos Editadas", "3 Looks", "Reels de Bastidores (15s)"],
      tag: "BEST SELLER"
    },
    {
      id: 'brand',
      title: "Full Branding",
      price: 1490,
      duration: "4h",
      desc: "Banco de imagens estratégico para 3 meses de conteúdo.",
      img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
      features: ["50 Fotos + Guia", "Looks Ilimitados", "Make & Hair Incluso"],
      tag: "BUSINESS"
    }
  ] as Service[],
  extras: [
    { id: 'video', label: "Fashion Film (4K)", price: 350, desc: "Vídeo cinematic de 30s" },
    { id: 'express', label: "Edição 24h", price: 150, desc: "Receba as fotos amanhã" },
    { id: 'album', label: "Álbum Físico", price: 600, desc: "20x20cm Capa Dura" }
  ] as Extra[],
  reviews: [
    { name: "Ana Clara", role: "Influencer", txt: "Mudou meu posicionamento no Instagram." },
    { name: "Ricardo M.", role: "CEO", txt: "Profissionalismo impecável. Fotos de revista." },
    { name: "Agência Vibe", role: "Parceiro", txt: "Nosso fotógrafo exclusivo para modelos." }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
    "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
    "https://images.unsplash.com/photo-1519744531242-c10a2295d8be?w=800&q=80"
  ]
};

// --- 3. UI COMPONENTS (DESIGN SYSTEM) ---

const GlassCard = ({ children, className = "", onClick, active = false }: any) => (
  <div
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl transition-all duration-500 border
    ${active 
      ? 'border-white/60 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] bg-white/10' 
      : 'border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/5'}
    ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}
    ${className} backdrop-blur-xl`}
  >
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', full = false, icon: Icon, disabled, onClick, className = '' }: any) => {
  const base = "relative flex items-center justify-center font-bold tracking-wider transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  const variants: any = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10",
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

const Input = ({ label, icon: Icon, ...props }: any) => (
  <div className="space-y-2 w-full group">
    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-focus-within:text-white transition-colors ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors">{Icon && <Icon size={18} />}</div>
      <input 
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/50 focus:bg-white/10 transition-all"
      />
    </div>
  </div>
);

// --- 4. MAIN APPLICATION ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  
  // CORE STATE
  const [booking, setBooking] = useState<BookingState>({
    step: 0,
    service: null,
    date: null,
    time: null,
    extras: {},
    client: { name: '', instagram: '', notes: '' },
    termsAccepted: false
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simular loading inicial cinematográfico
    setTimeout(() => setLoading(false), 2000);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }, [booking.step]);

  // LOGIC
  const calculateTotal = useMemo(() => {
    if (!booking.service) return 0;
    let total = booking.service.price;
    Object.keys(booking.extras).forEach(key => {
      if (booking.extras[key]) {
        const extraItem = DATA.extras.find(e => e.id === key);
        if (extraItem) total += extraItem.price;
      }
    });
    return total;
  }, [booking.service, booking.extras]);

  const generateWhatsAppMessage = () => {
    if (!booking.service || !booking.date || !booking.time) return '';

    const dateStr = booking.date.toLocaleDateString(CONFIG.LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
    const extrasList = Object.keys(booking.extras)
      .filter(k => booking.extras[k])
      .map(k => {
        const item = DATA.extras.find(e => e.id === k);
        return `✅ + ${item?.label} (${CONFIG.CURRENCY} ${item?.price})`;
      }).join('\n');

    const message = `
⬛ *NOVA SOLICITAÇÃO DE ENSAIO* ⬛
───────────────────────
👤 *CLIENTE*
Nome: ${booking.client.name}
Insta: ${booking.client.instagram || 'Não informado'}
${booking.client.notes ? `Obs: ${booking.client.notes}` : ''}

🎬 *PROJETO*
Serviço: *${booking.service.title.toUpperCase()}*
Pacote: ${booking.service.duration} • ${booking.service.features[0]}
Valor Base: ${CONFIG.CURRENCY} ${booking.service.price}

🗓 *AGENDAMENTO*
Data: ${dateStr}
Horário: ${booking.time}

✨ *ADICIONAIS*
${extrasList || 'Nenhum selecionado'}

───────────────────────
💎 *INVESTIMENTO TOTAL: ${CONFIG.CURRENCY} ${calculateTotal}*
───────────────────────
*Aguardo confirmação de disponibilidade.*
`.trim();

    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(message)}`;
  };

  // HANDLERS
  const handleNext = () => {
    setBooking(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleBack = () => {
    setBooking(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleBook = () => {
    window.open(generateWhatsAppMessage(), '_blank');
  };

  // --- RENDER: LOADING SCREEN ---
  if (loading) return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse"></div>
        <Aperture size={64} className="text-white relative z-10 animate-spin-slow" strokeWidth={1}/>
      </div>
      <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-white animate-progress"></div>
      </div>
      <p className="mt-4 text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">Carregando Estúdio</p>
    </div>
  );

  return (
    <div className="h-[100dvh] w-full bg-black text-white font-sans overflow-hidden flex flex-col selection:bg-white/30">
      
      {/* 5. BACKGROUND LAYERS (CINEMATIC NOISE & GRADIENTS) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-900/20 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-900/20 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
      </div>

      {/* 6. HEADER */}
      <header className="h-20 px-6 md:px-12 flex items-center justify-between z-20 shrink-0 border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setBooking(prev => ({...prev, step: 0}))}>
          <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <Camera size={20} strokeWidth={2.5}/>
          </div>
          <div>
            <h1 className="text-lg font-light leading-none tracking-tight">Lumina<span className="font-bold">.OS</span></h1>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Studio Premium</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" icon={ImageIcon} onClick={() => setIsGalleryOpen(true)}>Portfólio</Button>
      </header>

      {/* 7. SCROLLABLE CONTENT AREA */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 p-4 md:p-8 scroll-smooth pb-32">
        <div className="max-w-5xl mx-auto">
          
          {/* ========== STEP 0: LANDING PAGE (VITRINE) ========== */}
          {booking.step === 0 && (
            <div className="animate-fade-in space-y-12">
              
              {/* HERO SECTION WITH VIDEO */}
              <div className="relative rounded-[2.5rem] overflow-hidden min-h-[550px] flex flex-col justify-end p-8 md:p-12 border border-white/10 group shadow-2xl">
                <div className="absolute inset-0 z-0">
                  <video 
                    autoPlay loop muted playsInline 
                    className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-105 opacity-60"
                  >
                    <source src={DATA.heroVideo} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>
                
                <div className="relative z-10 max-w-2xl animate-slide-in-up">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Agenda 2026 Disponível
                  </div>
                  <h2 className="text-5xl md:text-7xl font-light leading-[0.9] mb-6 tracking-tight shadow-black drop-shadow-2xl">
                    Sua história em <br/>
                    <span className="font-serif italic font-medium text-white/90">Movimento.</span>
                  </h2>
                  <p className="text-sm md:text-base text-white/80 max-w-md leading-relaxed mb-8 font-light backdrop-blur-sm">
                    Fotografia não é apenas clicar. É construir legado, autoridade e arte. 
                    Experiência completa de direção, luz e edição high-end.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" size="lg" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth'})}>
                      Ver Experiências <ArrowRight size={16} className="ml-2"/>
                    </Button>
                  </div>
                </div>
              </div>

              {/* SOCIAL PROOF */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DATA.reviews.map((r, i) => (
                  <GlassCard key={i} className="p-6 flex flex-col justify-center">
                    <div className="flex gap-1 text-amber-400 mb-3">
                      {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor"/>)}
                    </div>
                    <p className="text-sm text-white/80 italic mb-4">"{r.txt}"</p>
                    <div className="flex items-center gap-3 opacity-60">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">{r.name[0]}</div>
                      <div>
                        <p className="text-xs font-bold">{r.name}</p>
                        <p className="text-[10px] uppercase tracking-wider">{r.role}</p>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>

              {/* SERVICES GRID */}
              <div id="services" className="space-y-6 pt-8">
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-light">Selecione sua Experiência</h3>
                  <p className="text-xs text-white/40 uppercase tracking-widest hidden md:block">Role para ver mais</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {DATA.services.map((s) => (
                    <GlassCard 
                      key={s.id} 
                      className="group p-0 h-full flex flex-col"
                      onClick={() => {
                        setBooking(prev => ({ ...prev, service: s }));
                        handleNext();
                      }}
                      hoverEffect
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img src={s.img} alt={s.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                        
                        {s.tag && (
                          <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md">
                            {s.tag}
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                          <h4 className="text-2xl font-light mb-1">{s.title}</h4>
                          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/70">
                            <span>{s.duration}</span>
                            <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                            <span>{CONFIG.CURRENCY} {s.price}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col flex-1 bg-white/5 border-t border-white/5">
                        <p className="text-xs text-white/60 leading-relaxed mb-6">{s.desc}</p>
                        <ul className="space-y-3 mb-6 flex-1">
                          {s.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-3 text-xs text-white/80">
                              <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <Check size={10}/>
                              </div>
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button full variant="secondary">Selecionar</Button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========== STEP 1: DATE & TIME ========== */}
          {booking.step === 1 && booking.service && (
            <div className="animate-slide-in grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-light mb-2">Quando será?</h2>
                  <p className="text-xs text-white/50 uppercase tracking-widest">Escolha a data ideal para {booking.service.title}</p>
                </div>

                <GlassCard className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6 text-xs font-bold uppercase tracking-widest opacity-50">
                    <Calendar size={14}/> Próximos dias disponíveis
                  </div>
                  
                  {/* DATA SCROLL */}
                  <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-2 px-2">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const d = new Date();
                      d.setDate(d.getDate() + i + 1);
                      const isSelected = booking.date?.toDateString() === d.toDateString();
                      
                      return (
                        <button
                          key={i}
                          onClick={() => setBooking(prev => ({ ...prev, date: d, time: null }))}
                          className={`min-w-[80px] h-28 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all
                          ${isSelected 
                            ? 'bg-white text-black border-white shadow-lg scale-105' 
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-widest">{d.toLocaleDateString(CONFIG.LOCALE, { weekday: 'short' }).slice(0,3)}</span>
                          <span className="text-3xl font-light">{d.getDate()}</span>
                          <span className="text-[10px] uppercase">{d.toLocaleDateString(CONFIG.LOCALE, { month: 'short' }).slice(0,3)}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* TIME GRID */}
                  {booking.date && (
                    <div className="pt-6 border-t border-white/10 animate-fade-in">
                       <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest opacity-50">
                        <Clock size={14}/> Horários para {booking.date.toLocaleDateString(CONFIG.LOCALE, { weekday: 'long' })}
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {['09:00', '10:30', '13:00', '15:00', '16:30', '19:00'].map(time => (
                          <button
                            key={time}
                            onClick={() => setBooking(prev => ({ ...prev, time }))}
                            className={`py-3 rounded-xl text-xs font-bold transition-all border
                            ${booking.time === time 
                              ? 'bg-white text-black border-white shadow-lg' 
                              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              </div>

              {/* SIDE SUMMARY (DESKTOP) */}
              <div className="hidden lg:block">
                 <BookingSummary booking={booking} total={calculateTotal} />
              </div>
            </div>
          )}

          {/* ========== STEP 2: DETAILS & EXTRAS ========== */}
          {booking.step === 2 && booking.service && (
            <div className="animate-slide-in grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-light mb-2">Finalizar Projeto</h2>
                  <p className="text-xs text-white/50 uppercase tracking-widest">Personalize e identifique-se</p>
                </div>

                {/* EXTRAS */}
                <GlassCard className="p-6 md:p-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-white/50"><Sparkles size={14}/> Upgrades Disponíveis</h3>
                  <div className="space-y-3">
                    {DATA.extras.map(extra => (
                      <div 
                        key={extra.id}
                        onClick={() => setBooking(prev => ({
                          ...prev,
                          extras: { ...prev.extras, [extra.id]: !prev.extras[extra.id] }
                        }))}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
                        ${booking.extras[extra.id] ? 'bg-white/10 border-white text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                         <div className="flex items-center gap-4">
                           <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${booking.extras[extra.id] ? 'bg-white border-white text-black' : 'border-white/40'}`}>
                             {booking.extras[extra.id] && <Check size={14} strokeWidth={3}/>}
                           </div>
                           <div>
                             <p className="text-sm font-bold">{extra.label}</p>
                             <p className="text-xs opacity-60">{extra.desc}</p>
                           </div>
                         </div>
                         <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-md">
                           + {CONFIG.CURRENCY} {extra.price}
                         </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* CLIENT FORM */}
                <GlassCard className="p-6 md:p-8 space-y-4">
                   <h3 className="text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2 text-white/50"><User size={14}/> Seus Dados</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input 
                        label="Nome Completo" 
                        icon={User} 
                        value={booking.client.name} 
                        onChange={(e: any) => setBooking(prev => ({...prev, client: {...prev.client, name: e.target.value}}))}
                        placeholder="Ex: Ana Silva"
                     />
                     <Input 
                        label="Instagram" 
                        icon={Instagram} 
                        value={booking.client.instagram} 
                        onChange={(e: any) => setBooking(prev => ({...prev, client: {...prev.client, instagram: e.target.value}}))}
                        placeholder="@seu.perfil"
                     />
                   </div>
                   <Input 
                      label="Observações (Opcional)" 
                      icon={MessageCircle} 
                      value={booking.client.notes} 
                      onChange={(e: any) => setBooking(prev => ({...prev, client: {...prev.client, notes: e.target.value}}))}
                      placeholder="Alguma ideia específica para as fotos?"
                   />
                </GlassCard>
                
                {/* TERMS */}
                <div 
                  onClick={() => setBooking(prev => ({...prev, termsAccepted: !prev.termsAccepted}))}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${booking.termsAccepted ? 'border-white/40 bg-white/5' : 'border-white/10 opacity-70'}`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${booking.termsAccepted ? 'bg-white border-white text-black' : 'border-white/40'}`}>
                    {booking.termsAccepted && <Check size={14} strokeWidth={3}/>}
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Li e concordo com a <span className="text-white underline font-bold">Política de Agendamento</span>. O valor final será confirmado via WhatsApp.
                  </p>
                </div>

              </div>

              {/* SIDE SUMMARY (DESKTOP) */}
              <div className="hidden lg:block">
                 <BookingSummary booking={booking} total={calculateTotal} onBook={handleBook} isReady={booking.client.name.length > 3 && booking.termsAccepted} />
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 8. MOBILE BOTTOM BAR NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 p-4 pt-8 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none">
         <div className="pointer-events-auto shadow-2xl">
           {booking.step === 0 && (
             <div className="hidden"></div> // No bar on landing
           )}
           
           {booking.step === 1 && (
             <Button full size="xl" variant="primary" onClick={handleNext} disabled={!booking.date || !booking.time}>
               <div className="flex justify-between w-full items-center">
                 <span>Continuar</span>
                 {booking.time && <span className="opacity-50 text-xs">{booking.time}</span>}
               </div>
             </Button>
           )}

           {booking.step === 2 && (
              <Button 
                full size="xl" variant="whatsapp" onClick={handleBook} 
                disabled={!booking.termsAccepted || booking.client.name.length < 3}
                className={(!booking.termsAccepted || booking.client.name.length < 3) ? 'grayscale opacity-80' : ''}
              >
                <div className="flex justify-between w-full items-center">
                   <span>Finalizar no WhatsApp</span>
                   <span>{CONFIG.CURRENCY} {calculateTotal}</span>
                </div>
              </Button>
           )}
           
           {booking.step > 0 && (
             <button onClick={handleBack} className="w-full text-center py-4 text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white">Voltar</button>
           )}
         </div>
      </div>

      {/* 9. GALLERY MODAL */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in">
           <div className="h-20 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
             <h3 className="text-sm font-bold uppercase tracking-widest">Portfólio Selecionado</h3>
             <button onClick={() => setIsGalleryOpen(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><X size={20}/></button>
           </div>
           <div className="flex-1 overflow-y-auto p-4 md:p-8">
             <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
               {DATA.gallery.map((src, i) => (
                 <div key={i} className="break-inside-avoid rounded-2xl overflow-hidden group relative">
                   <img src={src} alt="Portfolio" className="w-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}

      {/* CSS ANIMATIONS INJECTED */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-in-up { animation: slideInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-progress { animation: progress 2s ease-in-out infinite; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes progress { 0% { transform: translateX(-100%); } 50% { transform: translateX(0); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}

// 10. HELPER COMPONENT: SUMMARY CARD
const BookingSummary = ({ booking, total, onBook, isReady }: any) => (
  <GlassCard className="p-8 sticky top-8 border-white/20 bg-gradient-to-br from-white/5 to-black/80">
     <h3 className="text-lg font-light mb-6">Resumo do Pedido</h3>
     <div className="space-y-4 mb-8">
        <div className="flex justify-between text-xs text-white/60">
           <span>Serviço Base</span>
           <span>{CONFIG.CURRENCY} {booking.service.price}</span>
        </div>
        {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
           const item = DATA.extras.find(e => e.id === k);
           return (
             <div key={k} className="flex justify-between text-xs text-white/80">
               <span>+ {item?.label}</span>
               <span>{item?.price}</span>
             </div>
           );
        })}
        <div className="h-px bg-white/10 my-4"></div>
        <div className="flex justify-between items-end">
           <span className="text-xs font-bold uppercase tracking-widest text-white/40">Total Estimado</span>
           <span className="text-3xl font-light">{CONFIG.CURRENCY} {total}</span>
        </div>
     </div>
     {onBook && (
       <Button 
         full variant="whatsapp" size="xl" icon={MessageCircle} onClick={onBook} 
         disabled={!isReady}
         className={!isReady ? 'opacity-50 grayscale cursor-not-allowed' : ''}
       >
         Confirmar Reserva
       </Button>
     )}
  </GlassCard>
);
