import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Camera, Image, 
  Clock, Zap, X, Globe, Building, PartyPopper, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, Share2, Video, Film
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON PHOTOGRAPHY OS v30.0 - BOOKING & PORTFOLIO
 * ==================================================================================
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.fotos", 
  STORAGE_KEY: '@thaly_photo_v30', 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US'
};

// ==================================================================================
// UI COMPONENTS
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 border border-blue-400/20 hover:shadow-blue-500/30",
    secondary: "bg-white/5 backdrop-blur-md border border-white/10 text-zinc-200 hover:bg-white/10 hover:border-white/20",
    whatsapp: "bg-[#25D366] text-white shadow-lg shadow-green-500/20 hover:bg-[#20bd5a] border border-green-400/20",
    outline: "bg-transparent border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500",
    icon: "bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
  };
  
  const sizes = { 
    sm: "h-10 text-[10px] px-3", 
    md: "h-12 text-xs px-5", 
    lg: "h-14 text-sm px-6", 
    xl: "h-14 text-xs font-bold uppercase tracking-widest", 
    icon: "h-10 w-10 p-0 flex-shrink-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={18} className="animate-spin text-current"/> : (
        <>
          {Icon && <Icon size={18} className={children ? "mr-2 opacity-90 flex-shrink-0" : ""} strokeWidth={2.5} />}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark }) => (
  <div className="space-y-2 w-full group">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-blue-500' : 'text-slate-500 group-focus-within:text-blue-600'}`}>{label}</label>}
    <div className="relative">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${isDark ? 'text-zinc-500 group-focus-within:text-blue-500' : 'text-slate-400 group-focus-within:text-blue-600'}`}>{Icon && <Icon size={18} />}</div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-sm font-medium transition-all duration-300 
        ${isDark 
            ? 'bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus:bg-zinc-900 focus:border-blue-500/30' 
            : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-md'} 
        border focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.1)] ${error ? 'border-red-500/50 text-red-500' : ''}`} 
      />
    </div>
    {error && <p className="text-red-500 text-[10px] ml-2 font-bold animate-pulse">{error}</p>}
  </div>
);

const Card = ({ children, className = '', onClick, active = false, isDark = true }) => (
  <div 
    onClick={onClick} 
    className={`relative p-6 rounded-[1.8rem] transition-all duration-500 overflow-hidden 
    ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''} 
    ${active 
        ? 'bg-blue-500/5 border border-blue-500/30 shadow-[0_0_25px_-10px_rgba(59,130,246,0.15)]' 
        : (isDark ? 'bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10' : 'bg-white border border-slate-200 shadow-lg shadow-slate-200/50 hover:border-blue-500/30')} 
    ${className}`}
  >
    {active && <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none" />}
    {children}
  </div>
);

// ==================================================================================
// DATA SCHEMA (PHOTOGRAPHY FOCUS)
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Iniciante" : "Newcomer" },
            { level: 2, xpNeeded: 150, reward: 15, title: isPT ? "Entusiasta" : "Fan" },
            { level: 3, xpNeeded: 500, reward: 40, title: isPT ? "Colecionador" : "Collector" },
            { level: 4, xpNeeded: 1200, reward: 80, title: isPT ? "VIP Legend" : "VIP Legend" }
        ],
        services: [
            { 
              id: 'ensaio_express', min: 45, price: 250, icon: Camera, tag: isPT ? "ESSENCIAL" : "ESSENTIAL",
              title: isPT ? "Ensaio Express" : "Express Session",
              desc: isPT ? "Para quem precisa de fotos rápidas e profissionais." : "Quick professional shots.",
              details: isPT ? `O QUE INCLUI:
• 10 Fotos editadas em alta resolução.
• 45 Minutos de sessão em estúdio ou externa.
• Entrega via Galeria Online em até 5 dias.
• Ideal para: LinkedIn, Perfil ou Datas Especiais.` : `INCLUDES:
• 10 Edited High-Res Photos.
• 45 Minutes session (Studio or Outdoor).
• Online Gallery delivery (5 days).
• Ideal for: LinkedIn, Profile or Special Dates.`
            },
            { 
              id: 'ensaio_premium', min: 90, price: 450, icon: Film, tag: isPT ? "O FAVORITO" : "BEST SELLER",
              title: isPT ? "Portfólio Premium" : "Premium Portfolio",
              desc: isPT ? "Sessão completa com troca de looks e direção." : "Full session with outfit changes.",
              details: isPT ? `EXPERIÊNCIA COMPLETA:
• 30 Fotos selecionadas e editadas.
• 1h30 de sessão com até 3 trocas de roupa.
• Direção criativa de poses e cenários.
• Todas as fotos sem edição (brutas) enviadas.
• Entrega em 7 dias úteis.` : `FULL EXPERIENCE:
• 30 Selected and edited photos.
• 1h30 session / 3 outfit changes.
• Creative direction for poses.
• All raw files included.
• 7 business days delivery.`
            },
            { 
              id: 'evento_wedding', min: 240, price: 1200, icon: PartyPopper, tag: isPT ? "EVENTOS" : "EVENTS",
              title: isPT ? "Eventos & Casamentos" : "Events & Weddings",
              desc: isPT ? "Cobertura completa do seu grande momento." : "Full coverage of your big moment.",
              details: isPT ? `COBERTURA PROFISSIONAL:
• Até 4 horas de evento inclusas.
• Fotos ilimitadas (todas as boas são editadas).
• Pen Drive personalizado ou Galeria Nuvem.
• 1 Cinegrafista assistente incluso.
• Entrega prioritária (15 dias).` : `PROFESSIONAL COVERAGE:
• Up to 4 hours of event coverage.
• Unlimited photos (all good ones edited).
• Personalized Pen Drive or Cloud Gallery.
• 1 Assistant videographer included.
• Priority delivery (15 days).`
            }
        ],
        plans: [
            { 
              id: 'pack_3_ensaios', type: 'pack', title: isPT ? "Plano Anual (3x)" : "Annual Plan (3x)", 
              price: 850, fullPrice: 1350, savings: 500, 
              desc: isPT ? "3 Ensaios Premium durante o ano." : "3 Premium sessions during the year.",
              details: isPT ? "Ideal para criadores de conteúdo. Garanta 3 ensaios completos com 40% de desconto real." : "Ideal for creators. Save 40% on 3 full sessions.", 
              tag: isPT ? "SUPER OFF" : "BEST VALUE", icon: Package 
            },
            { 
              id: 'social_media', type: 'subscription', title: isPT ? "Assinatura Mensal" : "Monthly Sub", 
              price: 390, fullPrice: 450, savings: 60, 
              desc: isPT ? "Fotos novas todo mês para seu feed." : "New content every month for your feed.",
              details: isPT ? "1 Ensaio Express por mês + Prioridade na edição (24h) + Storytelling para Instagram." : "1 Express session/mo + 24h editing priority + IG storytelling.", 
              tag: "CREATORS", icon: Crown 
            }
        ],
        extras: [
            { id: 'extra_photos', price: 15, icon: Image, label: isPT ? "Foto Extra" : "Extra Photo", desc: isPT ? "Edição avulsa adicional." : "Single extra edit." },
            { id: 'video_reels', price: 150, icon: Video, label: isPT ? "Making of Reels" : "Reels Making of", desc: isPT ? "Vídeo editado para redes." : "Edited video for social media." },
            { id: 'priority', price: 50, icon: Zap, label: isPT ? "Entrega 24h" : "24h Delivery", desc: isPT ? "Receba tudo amanhã." : "Get everything tomorrow." }
        ],
        reviews: [
            { n: "Larissa K.", loc: "São Paulo", t: "O Thalyson tem um olhar único. Me senti super à vontade e as fotos ficaram incríveis!", s: 5 },
            { n: "Marcos V.", loc: "Londrina", t: "Cobertura do meu evento impecável. Discreto e pegou os melhores momentos.", s: 5 },
            { n: "Juliana F.", loc: "S.F. do Sul", t: "A edição é natural e elegante. Superou minhas expectativas!", s: 5 }
        ],
        text: {
            loading: isPT ? "CARREGANDO LENTES..." : "LOADING LENSES...",
            welcome: isPT ? "Bem-vindo," : "Welcome,",
            subtitle: isPT ? "Transformando seus momentos em memórias eternas." : "Transforming moments into eternal memories.",
            tab_single: isPT ? "Ensaios" : "Sessions",
            tab_packs: isPT ? "Pacotes" : "Packs",
            select_time_title: isPT ? "Agende seu Set" : "Book your Set",
            date_sub: isPT ? "Escolha a melhor luz para fotografarmos." : "Choose the best light for shooting.",
            location_title: isPT ? "Onde será o ensaio?" : "Where is the shoot?",
            input_name: isPT ? "Seu nome ou marca" : "Your name or brand",
            input_addr: isPT ? "Localização sugerida" : "Location",
            total_label: isPT ? "Orçamento Total" : "Total Budget",
            book_btn: isPT ? "SOLICITAR AGENDAMENTO" : "REQUEST BOOKING",
            success_title: isPT ? "Foco Ajustado!" : "Focus Set!",
            success_sub: isPT ? "Sua solicitação foi enviada. Vamos conversar no WhatsApp para definir o conceito criativo." : "Request sent. Let's talk on WhatsApp to define the creative concept.",
            agree_terms: isPT ? "Estou ciente da política de cancelamento e prazos." : "I agree with the cancellation policy.",
            level_label: isPT ? "Fidelidade Fotográfica" : "Photo Loyalty",
            zap: {
              intro: isPT ? "Olá Thalyson! Vi seu portfólio e quero um ensaio." : "Hi Thalyson! I saw your portfolio and want a shoot.",
              order_title: isPT ? "*SOLICITAÇÃO DE ENSAIO*" : "*SHOOT REQUEST*",
              client: isPT ? "📸 *Cliente:*" : "📸 *Client:*",
              service: isPT ? "🎞️ *Serviço:*" : "🎞️ *Service:*",
              date: isPT ? "📅 *Data Sugerida:*" : "📅 *Date:*",
              location: isPT ? "📍 *Local do Set:*" : "📍 *Set Location:*",
              value: isPT ? "💰 *VALOR ESTIMADO:*" : "💰 *ESTIMATED:*",
              wait: isPT ? "Podemos alinhar o conceito das fotos?" : "Can we talk about the shoot concept?"
            }
        }
    };
};

// ==================================================================================
// MAIN APPLICATION (EXTRACTED LOGIC)
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  const [showConfetti, setShowConfetti] = useState(false);
  const [toasts, addToast] = useState([]); // Simplified for brevity

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState({ name: '', xp: 0, coupons: [] });
  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home',
    address: { city: '', street: '' }, payment: '', termsAccepted: false
  });

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0 };
    let total = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
      if(booking.extras[k]) total += DATA.extras.find(e=>e.id===k).price;
    });
    return { total };
  }, [booking.item, booking.extras, DATA.extras]);

  const handleFinish = () => {
    const msg = `
${T.zap.intro}
${T.zap.order_title}
──────────────────────
${T.zap.client} ${user.name}
${T.zap.service} ${booking.item.title}
${T.zap.date} ${booking.date?.toLocaleDateString()} às ${booking.time}
${T.zap.location} ${booking.address.street} - ${booking.address.city}
──────────────────────
${T.zap.value} R$ ${financials.total},00

${T.zap.wait}
    `.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
    setStep(4);
  };

  // ... [RENDER LOGIC SIMILAR TO BASE, UPDATED WITH PHOTO THEME] ...

  if (loading) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <Camera size={48} className="animate-pulse text-blue-500 mb-4" />
        <span className="text-[10px] font-bold tracking-widest">{T.loading}</span>
    </div>
  );

  return (
    <div className={`h-[100dvh] w-full flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* HEADER */}
      <header className="h-20 px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none">THALYSON</span>
            <span className="text-[9px] uppercase font-bold text-blue-500 tracking-[0.3em]">Photography</span>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className="p-2.5 rounded-full bg-white/5 border border-white/10"><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full bg-white/5 border border-white/10">{isDark ? <Moon size={18}/> : <Sun size={18}/>}</button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-md mx-auto px-5 pt-4 space-y-8">

          {/* CATALOG STEP */}
          {step === 0 && (
            <div className="animate-fade-in space-y-8">
              <section>
                <h1 className="text-3xl font-light mb-2">{T.welcome} <span className="font-bold text-blue-500">{user.name || 'Set'}</span></h1>
                <p className="text-xs text-zinc-500 font-light">{T.subtitle}</p>
                
                {/* LOYALTY CARD */}
                <div className={`mt-8 p-6 rounded-[2rem] border ${isDark ? 'bg-zinc-900/40 border-white/5' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center text-white"><Trophy size={20}/></div>
                            <div>
                                <span className="text-[9px] uppercase font-bold text-zinc-500">{T.level_label}</span>
                                <h3 className="font-bold text-sm">Platinum Creator</h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-bold block">340</span>
                            <span className="text-[9px] text-blue-500 font-bold uppercase">CREDITS</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{width: '65%'}}></div>
                    </div>
                </div>
              </section>

              {/* TABS */}
              <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-zinc-900/50 border border-white/5">
                  <button onClick={()=>setActiveTab('single')} className={`py-3 text-[10px] font-bold uppercase rounded-xl transition-all ${activeTab==='single' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>{T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`py-3 text-[10px] font-bold uppercase rounded-xl transition-all ${activeTab==='packs' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>{T.tab_packs}</button>
              </div>

              {/* LIST */}
              <div className="space-y-6">
                  {(activeTab === 'single' ? DATA.services : DATA.plans).map(s => (
                    <Card key={s.id} active={booking.item?.id === s.id} onClick={() => setBooking(b => ({...b, item: s}))} isDark={isDark}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${booking.item?.id === s.id ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}><s.icon size={22}/></div>
                            <div className="text-right">
                                <span className="block text-xl font-bold">R$ {s.price}</span>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{s.min} MIN SET</span>
                            </div>
                        </div>
                        <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                        <p className="text-xs text-zinc-500 font-light leading-relaxed mb-4">{s.desc}</p>
                        {booking.item?.id === s.id && (
                            <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-[10px] leading-relaxed animate-slide-in">
                                <p className="whitespace-pre-line text-zinc-400">{s.details}</p>
                            </div>
                        )}
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* STEP NAVIGATION MOCKED FOR PREVIEW */}
          {step === 1 && <div className="text-center py-20 animate-fade-in"><Calendar size={48} className="mx-auto mb-4 text-blue-500"/><h2 className="text-xl font-bold">{T.select_time_title}</h2><p className="text-zinc-500 text-xs mt-2">Próxima data disponível: Amanhã</p></div>}
        </div>
      </main>

      {/* FOOTER ACTION */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-zinc-950 to-transparent">
          <div className="max-w-md mx-auto">
              <Button full size="xl" onClick={() => step < 3 ? setStep(step + 1) : handleFinish()} icon={ArrowRight}>
                  {step === 3 ? T.book_btn : "PRÓXIMO PASSO"}
              </Button>
          </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-in { animation: slideIn 0.4s ease-out; }
      `}</style>
    </div>
  );
}
