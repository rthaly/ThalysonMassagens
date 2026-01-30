import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Aperture, Camera, Film, 
  Clock, Zap, X, Globe, MapPin, Calendar, Smartphone, Crown, 
  LayoutList, Package, Image as ImageIcon, User, Share2, 
  Sparkles, Heart, Sun, Moon, Loader2, ChevronLeft, CreditCard, 
  QrCode, Banknote, ShieldCheck, Tag, Info, Gift, Trophy, Play
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA LENS OS v2.0 - RESPONSIVE & HIGH CONVERSION
 * ==================================================================================
 * Desenvolvido por: Senior UX/UI Dev
 * Foco: Venda de Ensaios Fotográficos Premium
 */

const CONFIG = {
  PHONE: "5517991360413", // Seu número atualizado
  INSTAGRAM_URL: "https://instagram.com/",
  STORAGE_KEY: '@lumina_os_v2',
  LOCALE: 'pt-BR',
  CURRENCY: 'R$'
};

// ==================================================================================
// 1. COMPONENTES DE UI (DESIGN SYSTEM)
// ==================================================================================

const GlassCard = ({ children, className = '', onClick, active = false, bgImage, hoverEffect = true }) => (
  <div 
    onClick={onClick} 
    className={`relative overflow-hidden rounded-2xl transition-all duration-500 border
    ${onClick ? 'cursor-pointer' : ''} 
    ${active 
        ? 'border-white/60 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)] scale-[1.02]' 
        : 'border-white/10 bg-white/5 hover:border-white/30'} 
    ${hoverEffect && !active ? 'hover:scale-[1.01]' : ''}
    ${className}`}
  >
    {bgImage && (
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="bg" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110 opacity-60" />
        <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent`} />
      </div>
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

const Button = ({ children, onClick, variant = 'primary', size = 'md', full = false, icon: Icon, loading = false, className = '' }) => {
  const base = "relative flex items-center justify-center font-bold tracking-wider transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_-5px_rgba(255,255,255,0.4)]",
    secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/20 backdrop-blur-md",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-lg shadow-green-900/20",
    ghost: "text-white/60 hover:text-white"
  };
  
  const sizes = { 
    sm: "h-10 text-[10px] px-4 uppercase", 
    md: "h-12 text-xs px-6 uppercase", 
    lg: "h-14 text-sm px-8 uppercase", 
    icon: "h-10 w-10 p-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={loading} className={`${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={18} className="animate-spin"/> : (
        <>{Icon && <Icon size={18} className={children ? "mr-2" : ""} strokeWidth={2.5} />}{children}</>
      )}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="group space-y-2 w-full">
    {label && <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-focus-within:text-white transition-colors ml-1">{label}</label>}
    <input 
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/50 focus:bg-white/10 transition-all"
    />
  </div>
);

// ==================================================================================
// 2. DADOS E COPYWRITING (HIGH TICKET)
// ==================================================================================

const DATA = {
    galleryImages: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1519744531242-c10a2295d8be?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1505932794465-14a6192049d4?auto=format&fit=crop&w=800&q=80"
    ],
    services: [
        { 
          id: 'portrait', title: "Retrato Signature", price: 450, 
          desc: "Sua imagem pessoal elevada ao nível de arte. Ideal para branding e posicionamento.",
          img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
          features: ["1h de Sessão", "10 Fotos High-End", "Galeria Online Vitalícia"],
          tag: "BEST SELLER"
        },
        { 
          id: 'editorial', title: "Editorial Mode", price: 890, 
          desc: "Uma produção completa de moda e lifestyle. Para quem dita tendências.",
          img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
          features: ["2h de Sessão", "30 Fotos Editadas", "Reels de Bastidores (15s)"],
          tag: "POPULAR"
        },
        { 
          id: 'pack_creator', title: "Creator Pack", price: 1400, 
          desc: "Banco de imagens estratégico para 3 meses de conteúdo digital.",
          img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80",
          features: ["3h de Sessão", "Múltiplos Looks", "50 Fotos + Guia Visual"],
          tag: "BUSINESS"
        }
    ],
    extras: [
        { id: 'makeup', label: "Make & Hair", price: 250, desc: "Profissional no set" },
        { id: 'express', label: "Edição 24h", price: 150, desc: "Entrega expressa" },
        { id: 'video', label: "Fashion Film", price: 400, desc: "Vídeo 30s 4K" }
    ]
};

// ==================================================================================
// 3. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [galleryOpen, setGalleryOpen] = useState(false);
  
  // Estado do Pedido
  const [booking, setBooking] = useState({
    item: null, extras: {}, date: null, time: null,
    client: { name: '', instagram: '' },
    payment: 'pix', terms: false
  });

  const scrollRef = useRef(null);

  useEffect(() => { setTimeout(() => setLoading(false), 2000); }, []);
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  const total = useMemo(() => {
      if(!booking.item) return 0;
      let val = booking.item.price;
      Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) val += DATA.extras.find(e=>e.id===k).price });
      return val;
  }, [booking]);

  const generateLink = () => {
    const d = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '';
    const msg = `
📸 *NOVA SOLICITAÇÃO VIP*
──────────────────
👤 *Cliente:* ${booking.client.name}
📱 *Insta:* ${booking.client.instagram || 'N/A'}

🎞️ *Serviço:* ${booking.item.title}
📅 *Data:* ${d} às ${booking.time}

✨ *Extras:*
${Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>`+ ${DATA.extras.find(e=>e.id===k).label}`).join('\n') || 'Nenhum'}
──────────────────
💰 *Total:* R$ ${total},00
💳 *Pagamento:* ${booking.payment.toUpperCase()}

*Aguardando confirmação de agenda.*
`.trim();
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  if (loading) return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[100]">
          <div className="relative">
             <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse"></div>
             <Aperture size={64} className="text-white relative z-10 animate-spin-slow" strokeWidth={1}/>
          </div>
          <p className="mt-8 text-xs font-bold tracking-[0.3em] text-white/50 animate-pulse">CARREGANDO ESTÚDIO</p>
      </div>
  );

  return (
    <div className="h-[100dvh] w-full bg-black text-white font-sans overflow-hidden flex flex-col selection:bg-white/30">
      
      {/* BACKGROUND AMBIENTE */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow delay-1000"></div>
          <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
      </div>

      {/* HEADER */}
      <header className="h-20 px-6 md:px-12 flex items-center justify-between z-20 shrink-0 border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center">
                <Camera size={20} strokeWidth={2.5}/>
            </div>
            <div>
                <h1 className="text-lg font-light leading-none tracking-tight">Lumina<span className="font-bold">OS</span></h1>
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Photography Studio</p>
            </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setGalleryOpen(true)} icon={ImageIcon}>Portfólio</Button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 p-4 md:p-8 scroll-smooth">
        <div className="max-w-5xl mx-auto">
            
            {/* STEP 0: VITRINE */}
            {step === 0 && (
                <div className="animate-fade-in space-y-8">
                    {/* HERO */}
                    <div className="relative rounded-[2rem] overflow-hidden min-h-[400px] md:min-h-[500px] flex flex-col justify-end p-8 md:p-12 border border-white/10 group">
                        <div className="absolute inset-0 z-0">
                            <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" alt="Hero"/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                        </div>
                        <div className="relative z-10 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Agenda 2026 Aberta
                            </div>
                            <h2 className="text-4xl md:text-6xl font-light leading-none mb-4">
                                Capture sua <br/><span className="font-serif italic font-medium">Melhor Versão.</span>
                            </h2>
                            <p className="text-sm md:text-base text-white/70 max-w-md leading-relaxed mb-8">
                                Fotografia não é apenas clicar. É construir legado, autoridade e arte. Escolha sua experiência abaixo.
                            </p>
                        </div>
                    </div>

                    {/* SERVICES GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {DATA.services.map(s => (
                            <GlassCard 
                                key={s.id} 
                                onClick={() => setBooking({...booking, item: s})}
                                active={booking.item?.id === s.id}
                                className="p-6 md:p-8 flex flex-col h-full bg-white/5"
                            >
                                <div className="mb-6 relative aspect-[4/3] rounded-xl overflow-hidden">
                                    <img src={s.img} className="w-full h-full object-cover" alt={s.title}/>
                                    {s.tag && <div className="absolute top-3 right-3 bg-black/80 backdrop-blur text-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded">{s.tag}</div>}
                                </div>
                                <h3 className="text-2xl font-light mb-2">{s.title}</h3>
                                <p className="text-xs text-white/60 leading-relaxed mb-6 flex-1">{s.desc}</p>
                                <div className="space-y-2 mb-8">
                                    {s.features.map((f, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                                            <Check size={12} className="text-white"/> {f}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                                    <span className="text-lg font-bold">R$ {s.price}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${booking.item?.id === s.id ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                                        <ArrowRight size={14}/>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 1: DATA E DETALHES */}
            {step === 1 && (
                <div className="animate-slide-in grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 md:gap-12">
                    
                    {/* LEFT COLUMN: INPUTS */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-light mb-2">Configure sua Sessão</h2>
                            <p className="text-xs text-white/50 uppercase tracking-widest">Personalize cada detalhe</p>
                        </div>

                        {/* Calendar */}
                        <GlassCard className="p-6">
                             <h3 className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar size={14}/> Data Preferida</h3>
                             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                                {[...Array(14)].map((_,i) => {
                                    const d = new Date(); d.setDate(d.getDate() + i);
                                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                                    return (
                                        <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`min-w-[70px] h-24 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${isSel ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                                            <span className="text-[9px] font-bold uppercase tracking-widest">{d.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3)}</span>
                                            <span className="text-2xl font-light">{d.getDate()}</span>
                                        </button>
                                    )
                                })}
                             </div>
                             {booking.date && (
                                 <div className="grid grid-cols-4 gap-3 pt-4 border-t border-white/10 animate-fade-in">
                                     {['09:00','10:30','14:00','16:30'].map(t => (
                                         <button key={t} onClick={()=>setBooking(b=>({...b, time: t}))} className={`py-2 rounded-lg text-xs font-bold transition-all ${booking.time===t ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/10 text-white/60'}`}>{t}</button>
                                     ))}
                                 </div>
                             )}
                        </GlassCard>

                        {/* Extras */}
                        <div className="space-y-3">
                            {DATA.extras.map(ex => (
                                <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${booking.extras[ex.id] ? 'bg-white/10 border-white text-white' : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${booking.extras[ex.id] ? 'bg-white border-white text-black' : 'border-white/40'}`}>
                                            {booking.extras[ex.id] && <Check size={12} strokeWidth={4}/>}
                                        </div>
                                        <div><p className="text-xs font-bold">{ex.label}</p><p className="text-[10px] opacity-60">{ex.desc}</p></div>
                                    </div>
                                    <span className="text-[10px] font-bold">+ R$ {ex.price}</span>
                                </div>
                            ))}
                        </div>

                        {/* Client Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Seu Nome" placeholder="Nome completo" value={booking.client.name} onChange={e=>setBooking(b=>({...b, client:{...b.client, name: e.target.value}}))}/>
                            <Input label="Instagram" placeholder="@seu.perfil" value={booking.client.instagram} onChange={e=>setBooking(b=>({...b, client:{...b.client, instagram: e.target.value}}))}/>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY (Sticky on Desktop) */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        <GlassCard className="p-8 bg-gradient-to-br from-white/10 to-black/50 backdrop-blur-xl border-white/20">
                            <h3 className="text-xl font-light mb-6">{booking.item.title}</h3>
                            
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs text-white/60">
                                    <span>Valor Base</span>
                                    <span>R$ {booking.item.price}</span>
                                </div>
                                {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                                    <div key={k} className="flex justify-between text-xs text-white/80">
                                        <span>+ {DATA.extras.find(e=>e.id===k).label}</span>
                                        <span>{DATA.extras.find(e=>e.id===k).price}</span>
                                    </div>
                                ))}
                                <div className="h-px bg-white/10 my-2"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold uppercase tracking-widest text-white/40">Total</span>
                                    <span className="text-3xl font-light">R$ {total}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${booking.terms ? 'bg-white border-white text-black' : 'border-white/40 group-hover:border-white'}`} onClick={()=>setBooking(b=>({...b, terms: !b.terms}))}>
                                        {booking.terms && <Check size={10} strokeWidth={4}/>}
                                    </div>
                                    <span className="text-[10px] text-white/60">Li e concordo com a política de cancelamento.</span>
                                </label>

                                <Button full variant="whatsapp" size="lg" icon={MessageCircle} 
                                    onClick={() => window.open(generateLink(), '_blank')}
                                    disabled={!booking.date || !booking.time || !booking.client.name || !booking.terms}
                                    className={`${(!booking.date || !booking.time || !booking.client.name || !booking.terms) ? 'opacity-50 grayscale' : ''}`}
                                >
                                    Agendar via WhatsApp
                                </Button>
                                <p className="text-[9px] text-center text-white/30">Você será redirecionado para finalizar a reserva.</p>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            )}

        </div>
      </main>

      {/* FOOTER NAV (MOBILE ONLY) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 p-4 bg-gradient-to-t from-black via-black/95 to-transparent">
          {step === 0 ? (
              <Button full variant="primary" disabled={!booking.item} onClick={() => setStep(1)}>
                  {booking.item ? `Continuar • R$ ${booking.item.price}` : 'Selecione uma Experiência'}
              </Button>
          ) : (
             <Button full variant="secondary" onClick={() => setStep(0)} icon={ChevronLeft}>Voltar</Button> 
          )}
      </div>

      {/* GALLERY MODAL */}
      {galleryOpen && (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
              <div className="w-full max-w-4xl h-[80vh] bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-widest">Portfólio Selecionado</h3>
                      <button onClick={()=>setGalleryOpen(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                      {DATA.galleryImages.map((src, i) => (
                          <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden group relative">
                              <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Portfolio"/>
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* GLOBAL STYLES */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-pulse-slow { animation: pulse 8s ease-in-out infinite; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
