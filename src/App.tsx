import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback, createContext, useContext } from 'react';
import {
  ChevronLeft, Check, X, MapPin, Calendar, Clock,
  Bell, Tag, AlertCircle, ArrowRight, Eye, EyeOff, 
  LogOut, Star, Menu, CreditCard, Banknote, QrCode, 
  CheckCircle2, Info, ChevronRight, Crown, Gift, Sparkles, Flame, ShieldCheck, Ticket, Music, HelpCircle, Share2, Instagram, Phone
} from 'lucide-react';

// ==================================================================================
// 1. DESIGN SYSTEM & ESTILOS GLOBAIS
// ==================================================================================

const globalStyles = `
  :root {
    --primary: #007AFF;
    --success: #32D74B;
    --warning: #FFD60A;
    --danger: #FF453A;
    --bg-dark: #000000;
    --card-bg: rgba(28, 28, 30, 0.7);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  
  html, body { 
    height: 100%; 
    background-color: var(--bg-dark); 
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif;
    color: #fff;
    -webkit-font-smoothing: antialiased;
    overflow: hidden; /* App-like feel */
  }

  /* Scrollbar invisível mas funcional */
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

  /* Inputs e Botões */
  input, select { font-size: 16px !important; outline: none; appearance: none; } /* Evita zoom no iOS */
  button { user-select: none; cursor: pointer; touch-action: manipulation; }

  /* Background Animado */
  .aurora-bg {
    background: 
      radial-gradient(140% 120% at 50% 0%, #1c1c1e 0%, #000 100%),
      radial-gradient(60% 40% at 50% 100%, rgba(0, 122, 255, 0.08), transparent 100%);
    position: absolute; inset: 0; z-index: 0;
  }

  /* Glassmorphism Cards High-End */
  .glass-panel { 
    background: var(--card-bg);
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  }

  /* Animações Suaves */
  .animate-in { animation: fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  
  @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
`;

// ==================================================================================
// 2. CONFIGURAÇÃO E DADOS
// ==================================================================================

const CONFIG = {
  PRICES: { MACA: 20, AROMA_FULL: 10, AROMA_DISCOUNT: 5, UPGRADE_PCT: 0.5 },
  CONTACT: { PHONE: '5517991360413', INSTAGRAM: 'thalymassagens' },
  RATES: [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238]
};

const SERVICES_DB = [
  { 
    id: 'masculina', name: 'Massagem Tântrica', type: 'sensual',
    shortDesc: 'A experiência definitiva de conexão e prazer.',
    description: 'Uma jornada sensorial completa que combina técnicas de relaxamento profundo com toques corpo a corpo (Body-to-Body) e finalização tântrica manual.', 
    duration: '60 min', basePrice: 140, highlight: "MAIS PEDIDA 🔥", ratings: 5.0, 
    benefits: ["Relaxamento Muscular", "Toque Body-to-Body", "Desbloqueio Energético", "Finalização Manual"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    shortDesc: 'Desconexão total do estresse diário.',
    description: 'Protocolo focado exclusivamente no relaxamento muscular e alívio de tensões. Movimentos fluidos em todo o corpo. Sem toques íntimos.', 
    duration: '60 min', basePrice: 90, ratings: 4.9, 
    benefits: ["Alívio de Dores", "Melhora da Circulação", "Zero Conteúdo Sexual", "Ambiente Zen"] 
  },
];

const LOCATIONS_DB = [
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Atendimento no local', fee: 75, allowsTableChoice: false, isMotel: true },
  { id: 'santa-fe', label: 'Domicílio (Santa Fé)', sublabel: 'Vou até sua casa', fee: 40, allowsTableChoice: true, askAddress: true, isUber: true },
  { id: 'outras-cidades', label: 'Outras Cidades', sublabel: 'Região próxima', fee: 0, allowsTableChoice: false, estimatedTravelTime: 'A combinar', inputCity: true, isPending: true },
];

const REVIEWS_DB = [
  { t: "O sigilo foi total. A massagem tântrica me surpreendeu muito.", a: "Anônimo", r: 5 },
  { t: "A sensibilidade que ele desperta no corpo é absurda. Recomendo.", a: "R.S.", r: 5 },
  { t: "Ambiente discreto e toque muito profissional.", a: "Curioso", r: 5 },
  { t: "Mãos de fada com pegada firme. Exatamente o que eu precisava.", a: "Cliente Vip", r: 5 },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (Primeira Vez)' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
};

const MUSIC_VIBES = ['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘', 'Lo-Fi ☕', 'Deep 🔊'];

// ==================================================================================
// 3. LOGIC & HOOKS
// ==================================================================================

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const generateBookingId = () => Math.random().toString(36).substring(2, 6).toUpperCase();
const triggerHaptic = () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(5); };

const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);
  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast.show && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border border-white/10 bg-[#1C1C1E]/90 animate-in">
           {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <AlertCircle className="w-5 h-5 text-red-500" />}
           <span className="text-white font-medium text-sm">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

const usePriceCalculator = (selection, loyalty) => {
  return useMemo(() => {
    if (!selection.service) return { total: 0, visualTotal: 0, fee: 0, discount: 0 };
    let base = selection.service.basePrice;
    if (selection.upgrade) base += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.useTable) base += CONFIG.PRICES.MACA;
    
    // Aroma Logic
    const hasAromaFree = loyalty.totalSpent >= 900; 
    const hasAromaDisc = loyalty.totalSpent >= 400 && loyalty.totalSpent < 900;
    
    let aromaPrice = CONFIG.PRICES.AROMA_FULL;
    if (hasAromaDisc) aromaPrice = CONFIG.PRICES.AROMA_DISCOUNT;
    if (hasAromaFree) aromaPrice = 0;
    
    let appliedAromaCost = selection.aroma ? aromaPrice : 0;
    if (selection.aroma) base += aromaPrice;

    const fee = selection.location?.fee || 0;
    let discount = 0;
    if (selection.coupon) {
       const discountable = base; 
       if (selection.coupon.type === 'percent') discount = discountable * (selection.coupon.value / 100);
       else discount = selection.coupon.value;
       base -= discount;
    }

    const visualTotal = Math.max(0, base + fee); 
    let creditTotal = visualTotal;
    if (selection.paymentMethod === 'credit_card') {
      const rate = CONFIG.RATES[selection.installments || 1] || 0;
      creditTotal = visualTotal / (1 - rate);
    }
    return { total: visualTotal, creditTotal, fee, discount, appliedAromaCost, regularAromaPrice: CONFIG.PRICES.AROMA_FULL };
  }, [selection, loyalty]);
};

// ==================================================================================
// 4. UI COMPONENTS (SENIOR LEVEL)
// ==================================================================================

const Button = ({ children, variant = 'primary', className = "", disabled, onClick, loading }) => {
  const styles = {
    primary: "bg-[#007AFF] hover:bg-[#0062cc] text-white shadow-[0_8px_16px_rgba(0,122,255,0.25)]",
    secondary: "bg-[#2C2C2E] border border-white/10 text-white hover:bg-[#3A3A3C]",
    outline: "border border-white/20 text-white bg-transparent hover:bg-white/5"
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} 
      className={`w-full h-[56px] font-semibold rounded-[16px] flex justify-center items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale text-[17px] ${styles[variant]} ${className}`}>
      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : children}
    </button>
  );
};

const Header = ({ title, subtitle, onBack, rightAction }) => (
  <div className="flex items-center justify-between px-6 py-4 bg-[#000000]/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
    <div className="flex items-center gap-4">
      {onBack && <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"><ChevronLeft className="w-6 h-6 text-white"/></button>}
      <div>
        <h1 className="text-lg font-bold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
      </div>
    </div>
    {rightAction}
  </div>
);

const Card = ({ children, className = "", onClick, active }) => (
  <div onClick={onClick} 
    className={`glass-panel p-5 rounded-[20px] transition-all cursor-pointer relative overflow-hidden ${active ? 'border-[#007AFF] bg-[#007AFF]/10' : 'hover:bg-white/5'} ${className}`}>
    {children}
  </div>
);

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
  const current = REVIEWS_DB[idx];
  return (
    <div className="relative h-28 mb-6">
      <div key={idx} className="absolute inset-0 glass-panel rounded-[20px] p-5 flex flex-col justify-center animate-in">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_,k) => <Star key={k} className="w-3.5 h-3.5 text-[#FFD60A] fill-[#FFD60A]"/>)}
        </div>
        <p className="text-sm text-gray-200 italic leading-relaxed">"{current.t}"</p>
        <p className="text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-wide">- {current.a}</p>
      </div>
    </div>
  );
};

const LiveStatus = () => {
  return (
    <div className="flex items-center justify-center gap-2 py-2 mb-4">
       <div className="w-2 h-2 bg-[#32D74B] rounded-full animate-pulse"/>
       <span className="text-xs font-medium text-[#32D74B] uppercase tracking-wide">Atendimento Online</span>
    </div>
  );
};

// ==================================================================================
// 5. TELAS DO FLUXO (Views)
// ==================================================================================

const HomeScreen = ({ loyalty, onSelectService, onOpenNotifs, hasNotifs }) => {
  return (
    <div className="animate-in pb-32">
       {/* Top Bar */}
       <div className="px-6 pt-12 pb-6 flex justify-between items-center">
          <div>
             <p className="text-xs font-bold text-[#007AFF] uppercase tracking-widest mb-1">Bem-vindo</p>
             <h1 className="text-3xl font-bold text-white leading-none">Relaxe &<br/><span className="text-[#007AFF]">Renove-se.</span></h1>
          </div>
          <button onClick={onOpenNotifs} className="w-12 h-12 rounded-full glass-panel flex items-center justify-center active:scale-95 transition-transform relative">
             <Bell className="w-6 h-6 text-gray-300"/>
             {hasNotifs && <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1c1c1e]"/>}
          </button>
       </div>

       <div className="px-6 space-y-8">
          <LiveStatus />
          <ReviewsCarousel />

          <div>
             <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-1">Escolha sua Experiência</h2>
             <div className="space-y-4">
                {SERVICES_DB.map(s => (
                   <Card key={s.id} onClick={() => onSelectService(s)} className="group">
                      {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-[16px] z-10">{s.highlight}</div>}
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-bold text-white group-hover:text-[#007AFF] transition-colors">{s.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed mb-4 pr-4">{s.shortDesc}</p>
                      <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                         <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> {s.duration}</div>
                         <div className="w-1 h-1 bg-gray-700 rounded-full"/>
                         <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-[#FFD60A]"/> {s.ratings}</div>
                         <div className="flex-1"/>
                         <span className="text-[#007AFF] text-lg font-bold">{formatCurrency(s.basePrice)}</span>
                      </div>
                   </Card>
                ))}
             </div>
          </div>

          {/* Loyalty Status */}
          <div className="border-t border-white/10 pt-6">
              <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
                 <span>Nível Fidelidade</span>
                 <span>{formatCurrency(loyalty.totalSpent)} investidos</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-[#007AFF]" style={{width: `${Math.min(100, (loyalty.totalSpent/1800)*100)}%`}}/> 
              </div>
          </div>
       </div>
    </div>
  )
}

const ServiceDetailModal = ({ service, onClose, onContinue }) => {
  if (!service) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity" onClick={onClose}/>
       <div className="relative pointer-events-auto bg-[#1C1C1E] w-full max-w-[480px] h-[85vh] sm:h-auto sm:rounded-[32px] rounded-t-[32px] border-t sm:border border-white/10 shadow-2xl animate-slide-up flex flex-col overflow-hidden">
          
          {/* Header Image Placeholder / Gradient */}
          <div className="h-24 bg-gradient-to-b from-[#007AFF]/20 to-[#1C1C1E] relative flex-shrink-0">
             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full"/>
             <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/70"><X className="w-5 h-5"/></button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-24 scrollbar-hide -mt-6 relative z-10">
             <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold text-white w-3/4 leading-tight">{service.name}</h2>
                <div className="text-right">
                   <span className="block text-xl font-bold text-[#007AFF]">{formatCurrency(service.basePrice)}</span>
                   <span className="text-xs text-gray-500">{service.duration}</span>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300 font-medium flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#32D74B]"/> Sigilo Absoluto</span>
                <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-300 font-medium flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#FFD60A]"/> Higiene Premium</span>
             </div>

             <div className="space-y-6">
                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sobre a Experiência</h3>
                    <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                        {service.description}
                    </p>
                </section>

                <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">O que está incluso</h3>
                    <ul className="space-y-3">
                        {service.benefits.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                            <Check className="w-5 h-5 text-[#007AFF] flex-shrink-0 mt-0.5"/> {b}
                        </li>
                        ))}
                    </ul>
                </section>
             </div>
          </div>

          <div className="absolute bottom-0 w-full p-6 bg-[#1C1C1E]/95 backdrop-blur-md border-t border-white/10 z-20">
             <Button onClick={onContinue}>Selecionar Horário</Button>
          </div>
       </div>
    </div>
  )
}

const BookingLogisticsScreen = ({ state, dispatch, onNext, onBack }) => {
  const days = Array.from({length: 14}, (_, i) => { const d = new Date(); d.setDate(new Date().getDate() + i); return d; });
  const isTimeBlocked = (t, d) => {
    if(!d) return true;
    const now = new Date();
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    if (!isToday) return false;
    const [h] = t.split(':').map(Number);
    return h <= now.getHours() + 1;
  };

  const scrollRef = useRef(null);
  const handleOptionSelect = (payload) => {
      dispatch({type: 'UPDATE', payload});
      // Micro-interação de scroll suave
      if(payload.time || payload.location) {
          setTimeout(() => {
              window.scrollBy({ top: 120, behavior: 'smooth' });
          }, 150);
      }
  }

  return (
    <div className="animate-in pb-32" ref={scrollRef}>
       <Header title="Agendamento" subtitle="Data e Local" onBack={onBack} />
       
       <div className="px-6 pt-6 space-y-8">
          {/* Data */}
          <section>
             <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#007AFF]"/> Escolha a Data</h3>
             <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {days.map((d, i) => {
                   const isSel = state.date?.getDate() === d.getDate();
                   const label = i === 0 ? 'HOJE' : d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3);
                   return (
                      <button key={i} onClick={() => handleOptionSelect({date: d, time: ''})}
                         className={`flex-shrink-0 w-[72px] h-[84px] rounded-[20px] flex flex-col items-center justify-center border transition-all duration-300 ${isSel ? 'bg-[#007AFF] border-[#007AFF] shadow-lg scale-105 z-10' : 'bg-[#1C1C1E] border-white/10 text-gray-400 hover:bg-white/5'}`}>
                         <span className={`text-[10px] font-bold uppercase mb-1 ${label==='HOJE' ? 'text-[#32D74B]' : 'opacity-70'}`}>{label}</span>
                         <span className={`text-xl font-bold ${isSel ? 'text-white' : 'text-gray-200'}`}>{d.getDate()}</span>
                      </button>
                   )
                })}
             </div>
          </section>

          {/* Hora */}
          {state.date && (
             <section className="animate-slide-up">
                <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-[#007AFF]"/> Horário</h3>
                <div className="grid grid-cols-4 gap-3">
                   {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => {
                      const blocked = isTimeBlocked(t, state.date);
                      return (
                         <button key={t} disabled={blocked} onClick={() => handleOptionSelect({time: t})}
                            className={`py-3 rounded-[14px] text-sm font-bold border transition-all ${state.time === t ? 'bg-white text-black border-white shadow-lg scale-105' : blocked ? 'opacity-20 grayscale cursor-not-allowed border-transparent bg-white/5' : 'bg-[#1C1C1E] border-white/10 text-gray-300 hover:border-white/30'}`}>
                            {t}
                         </button>
                      )
                   })}
                </div>
             </section>
          )}

          {/* Local */}
          <section>
             <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-[#007AFF]"/> Local do Atendimento</h3>
             <div className="space-y-3">
                {LOCATIONS_DB.map(loc => (
                   <div key={loc.id} onClick={() => handleOptionSelect({location: loc, address: '', city: ''})}
                      className={`p-5 rounded-[20px] border cursor-pointer transition-all duration-300 ${state.location?.id === loc.id ? 'bg-[#007AFF]/10 border-[#007AFF] shadow-[0_0_20px_rgba(0,122,255,0.1)]' : 'bg-[#1C1C1E] border-white/10 hover:bg-white/5'}`}>
                      <div className="flex justify-between items-center">
                         <div>
                            <p className={`text-sm font-bold ${state.location?.id === loc.id ? 'text-[#007AFF]' : 'text-white'}`}>{loc.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{loc.sublabel}</p>
                         </div>
                         {loc.fee > 0 && <span className="text-[10px] bg-[#FFD60A]/10 text-[#FFD60A] px-2 py-1 rounded-md font-bold">+{formatCurrency(loc.fee)}</span>}
                      </div>

                      {/* Expanded Fields */}
                      {state.location?.id === loc.id && (
                         <div className="mt-4 pt-4 border-t border-white/10 animate-in space-y-4">
                            {loc.allowsTableChoice && (
                               <div className="flex gap-3">
                                  <button onClick={(e) => {e.stopPropagation(); dispatch({type: 'UPDATE', payload: {useTable: false}})}} className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${state.useTable === false ? 'bg-[#007AFF] text-white border-[#007AFF]' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}>🛏 Na Cama</button>
                                  <button onClick={(e) => {e.stopPropagation(); dispatch({type: 'UPDATE', payload: {useTable: true}})}} className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${state.useTable === true ? 'bg-[#007AFF] text-white border-[#007AFF]' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'}`}>💆‍♂️ Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                               </div>
                            )}
                            {loc.askAddress && (
                               <div className="relative">
                                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-500"/>
                                  <input value={state.address} onChange={(e) => dispatch({type: 'UPDATE', payload: {address: e.target.value}})} placeholder="Rua, Número e Bairro..." className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-[#007AFF] transition-colors"/>
                               </div>
                            )}
                            {loc.inputCity && (
                               <div className="relative">
                                  <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-500"/>
                                  <input value={state.city} onChange={(e) => dispatch({type: 'UPDATE', payload: {city: e.target.value}})} placeholder="Qual a cidade?" className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-[#007AFF] transition-colors"/>
                               </div>
                            )}
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </section>
       </div>

       <div className="fixed bottom-0 w-full max-w-[480px] p-6 bg-[#000]/90 backdrop-blur-lg border-t border-white/10 z-50">
          <Button onClick={onNext} disabled={!state.date || !state.time || !state.location || (state.location.askAddress && state.address.length < 5) || (state.location.inputCity && state.city.length < 3)}>
             Continuar
          </Button>
       </div>
    </div>
  )
}

const CheckoutScreen = ({ state, dispatch, user, setUser, pricing, loyalty, setLoyalty, onFinalize, onBack, isProcessing }) => {
  const showToast = useToast();
  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
     const c = couponCode.toUpperCase().trim();
     if (SYSTEM_COUPONS[c]) {
        if(loyalty.inventory.includes(c)) {
            dispatch({type: 'UPDATE', payload: {coupon: SYSTEM_COUPONS[c]}});
            showToast('Cupom aplicado!', 'success');
            setCouponCode('');
        } else {
            showToast('Você não possui este cupom.', 'error');
        }
     } else {
        showToast('Código inválido.', 'error');
     }
  }

  return (
     <div className="animate-in pb-44">
        <Header title="Finalizar" subtitle="Pagamento e Detalhes" onBack={onBack} />
        <div className="px-6 pt-6 space-y-8">

           {/* Extras Card */}
           <div className="glass-panel rounded-[24px] p-5 border-l-4 border-l-[#007AFF]">
               <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#FFD60A]"/> Melhore sua experiência</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <div><p className="text-sm font-medium text-gray-200">Aromaterapia</p><p className="text-[10px] text-gray-500">Óleos essenciais</p></div>
                     <button onClick={() => { triggerHaptic(); dispatch({type: 'UPDATE', payload: {aroma: !state.aroma}}); }} className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${state.aroma ? 'bg-[#007AFF] justify-end' : 'bg-gray-700 justify-start'}`}><div className="w-5 h-5 bg-white rounded-full shadow-sm"/></button>
                  </div>
                  <div className="h-px bg-white/5"/>
                  <div className="flex items-center justify-between">
                     <div><p className="text-sm font-medium text-gray-200">+30 Minutos</p><p className="text-[10px] text-gray-500">Sessão estendida</p></div>
                     <button onClick={() => { triggerHaptic(); dispatch({type: 'UPDATE', payload: {upgrade: !state.upgrade}}); }} className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${state.upgrade ? 'bg-[#007AFF] justify-end' : 'bg-gray-700 justify-start'}`}><div className="w-5 h-5 bg-white rounded-full shadow-sm"/></button>
                  </div>
               </div>
           </div>

           {/* Music Vibe */}
           <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Music className="w-3.5 h-3.5"/> Vibe Sonora</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                 {MUSIC_VIBES.map(v => (
                    <button key={v} onClick={() => dispatch({type: 'UPDATE', payload: {music: v}})} className={`px-4 py-2.5 rounded-[12px] border text-xs font-bold whitespace-nowrap transition-all ${state.music === v ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400 hover:border-white/30'}`}>{v}</button>
                 ))}
              </div>
           </section>

           {/* Pagamento */}
           <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><CreditCard className="w-3.5 h-3.5"/> Pagamento</h3>
              <div className="grid grid-cols-2 gap-3">
                 {['pix', 'credit_card', 'cash', 'debit_card'].map(m => (
                    <button key={m} onClick={() => dispatch({type: 'UPDATE', payload: {paymentMethod: m}})}
                       className={`h-16 rounded-[16px] border flex flex-col items-center justify-center gap-1 text-[11px] font-bold uppercase transition-all ${state.paymentMethod === m ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400 hover:bg-white/5'}`}>
                       {m === 'pix' && <QrCode className="w-4 h-4"/>}
                       {m === 'credit_card' && <CreditCard className="w-4 h-4"/>}
                       {m === 'cash' && <Banknote className="w-4 h-4"/>}
                       {m === 'debit_card' && <CreditCard className="w-4 h-4"/>}
                       {m.replace('_', ' ')}
                    </button>
                 ))}
              </div>
              {state.paymentMethod === 'credit_card' && (
                 <div className="mt-3 relative animate-slide-up">
                    <select onChange={e => dispatch({type: 'UPDATE', payload: {installments: e.target.value}})} className="w-full bg-[#1C1C1E] text-white p-3.5 rounded-[16px] border border-white/10 text-sm focus:border-[#007AFF]">
                       {CONFIG.RATES.map((r, i) => i > 0 && <option key={i} value={i}>{i}x de {formatCurrency((pricing.total / (1-r)) / i)}</option>)}
                    </select>
                 </div>
              )}
           </section>

           {/* Coupon Wallet */}
           <div className="mt-4 pt-4 border-t border-white/10">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Ticket className="w-3.5 h-3.5"/> Cupons</h3>
              <div className="flex gap-2 mb-4">
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Adicionar código" className="flex-1 bg-[#1C1C1E] border border-white/10 rounded-[14px] px-4 py-2.5 text-sm text-white focus:border-[#007AFF]"/>
                  <button onClick={() => { 
                      const c = couponCode.toUpperCase().trim();
                      if(!SYSTEM_COUPONS[c]) { showToast('Cupom inválido', 'error'); return; }
                      if(loyalty.inventory.includes(c)) { showToast('Já possui este cupom', 'error'); return; }
                      setLoyalty(p => ({...p, inventory: [...p.inventory, c]}));
                      setCouponCode('');
                      showToast('Cupom adicionado!', 'success');
                  }} className="px-4 bg-white/10 rounded-[14px] text-xs font-bold hover:bg-white/20">Resgatar</button>
              </div>
              <div className="space-y-2">
                  {loyalty.inventory.length === 0 && <p className="text-xs text-gray-600 text-center py-2">Sua carteira está vazia.</p>}
                  {loyalty.inventory.map(code => {
                      const c = SYSTEM_COUPONS[code];
                      if(!c) return null;
                      const isSelected = state.coupon?.code === code;
                      return (
                          <button key={code} onClick={() => dispatch({type: 'UPDATE', payload: {coupon: isSelected ? null : c}})}
                              className={`w-full p-3 rounded-[14px] border flex justify-between items-center transition-all ${isSelected ? 'bg-[#007AFF]/10 border-[#007AFF]' : 'bg-[#1C1C1E] border-white/5'}`}>
                              <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-[#007AFF] text-white' : 'bg-white/5 text-gray-400'}`}><Tag className="w-4 h-4"/></div>
                                  <div className="text-left"><p className={`text-xs font-bold ${isSelected ? 'text-[#007AFF]' : 'text-white'}`}>{code}</p><p className="text-[10px] text-gray-500">{c.desc}</p></div>
                              </div>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#007AFF] bg-[#007AFF]' : 'border-gray-600'}`}>{isSelected && <Check className="w-3 h-3 text-white"/>}</div>
                          </button>
                      )
                  })}
              </div>
           </div>

           {/* Identity */}
           <section className="bg-[#1C1C1E] p-5 rounded-[24px] border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">Confirmação</h3>
              <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} placeholder="Seu Nome Completo" className="w-full bg-black/30 border-b border-white/10 py-2.5 text-lg text-white placeholder:text-gray-600 outline-none mb-6 focus:border-[#007AFF] transition-colors"/>
              <div className="space-y-3">
                 <button onClick={() => setUser({...user, isAdult: !user.isAdult})} className="flex items-center gap-3 w-full">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${user.isAdult ? 'bg-[#007AFF] border-[#007AFF]' : 'border-gray-600'}`}>{user.isAdult && <Check className="w-3 h-3 text-white"/>}</div>
                    <span className="text-xs text-gray-400">Sou maior de 18 anos</span>
                 </button>
                 <button onClick={() => setUser({...user, isMassagemOk: !user.isMassagemOk})} className="flex items-center gap-3 w-full">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${user.isMassagemOk ? 'bg-[#007AFF] border-[#007AFF]' : 'border-gray-600'}`}>{user.isMassagemOk && <Check className="w-3 h-3 text-white"/>}</div>
                    <span className="text-xs text-gray-400">Li e concordo com os termos de conduta</span>
                 </button>
              </div>
           </section>
        </div>

        {/* Footer Float */}
        <div className="fixed bottom-0 w-full max-w-[480px] bg-[#1C1C1E]/95 backdrop-blur-xl border-t border-white/10 p-6 rounded-t-[32px] z-50">
           <div className="flex justify-between items-end mb-4">
              <div><p className="text-[10px] text-gray-500 uppercase font-bold">Total Final</p><span className="text-2xl font-bold text-white">{formatCurrency(pricing.total)}</span></div>
              {pricing.discount > 0 && <span className="text-xs font-bold text-[#FF453A] bg-[#FF453A]/10 px-2 py-1 rounded">-{formatCurrency(pricing.discount)}</span>}
           </div>
           <Button onClick={onFinalize} loading={isProcessing} disabled={!user.name || !user.isAdult || !user.isMassagemOk || !state.paymentMethod}>Confirmar Agendamento</Button>
        </div>
     </div>
  )
}

// ==================================================================================
// 6. MAIN APP CONTROLLER
// ==================================================================================

const initialState = { step: 'home', service: null, location: null, address: '', city: '', date: null, time: '', useTable: null, coupon: null, upgrade: false, aroma: false, music: null, paymentMethod: null, installments: 1 };
function reducer(state, action) {
  switch (action.type) {
    case 'SET_STEP': return { ...state, step: action.payload };
    case 'SELECT_SERVICE': return { ...state, service: action.payload, step: 'service_detail' };
    case 'UPDATE': return { ...state, ...action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}
const useLocalStorage = (key, initial) => {
  const [val, setVal] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) || initial } catch { return initial } });
  useEffect(() => localStorage.setItem(key, JSON.stringify(val)), [key, val]);
  return [val, setVal];
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loyalty, setLoyalty] = useLocalStorage('thaly_v8_senior_ultimate', { totalSpent: 0, inventory: [], notifications: [], hasVisited: false, savedName: '' });
  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const showToast = useToast();

  useEffect(() => {
     if (!loyalty.hasVisited) {
        setTimeout(() => {
            setLoyalty(p => ({ ...p, hasVisited: true, inventory: ['BEMVINDO'], notifications: [{id: Date.now(), title: 'Bem-vindo!', message: 'Você ganhou o cupom BEMVINDO (10% OFF).', icon: 'gift', read: false, timestamp: Date.now()}] }));
            showToast('🎁 Você ganhou um cupom de boas-vindas!');
        }, 1500);
     }
     if (loyalty.savedName && !user.name) setUser(p => ({...p, name: loyalty.savedName, isAdult: true, isMassagemOk: true}));
  }, []);

  const pricing = usePriceCalculator(state, loyalty);

  const handleFinalize = () => {
     setIsProcessing(true);
     setTimeout(() => {
        const newTotal = loyalty.totalSpent + pricing.total;
        let newInventory = [...loyalty.inventory];
        if(state.coupon) newInventory = newInventory.filter(c => c !== state.coupon.code);
        setLoyalty(p => ({...p, savedName: user.name, totalSpent: newTotal, inventory: newInventory}));
        
        const dateStr = state.date.toLocaleDateString('pt-BR');
        let locStr = state.location.label;
        if(state.location.askAddress) locStr += `\n🏠 ${state.address}`;
        if(state.city) locStr += ` (${state.city})`;
        const msg = `*RESERVA CONFIRMADA #${generateBookingId()}*\n👤 ${user.name}\n💆 ${state.service.name}\n📅 ${dateStr} às ${state.time}\n📍 ${locStr}\n\n💰 Total: ${formatCurrency(pricing.total)} (${state.paymentMethod})\n🎵 Vibe: ${state.music || 'Padrão'}\n🔗 _Via App Web_`;
        
        window.open(`https://api.whatsapp.com/send?phone=${CONFIG.CONTACT.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
        dispatch({type: 'SET_STEP', payload: 'success'});
        setIsProcessing(false);
     }, 1500);
  }

  return (
    <ToastProvider>
       <div className="flex justify-center min-h-screen bg-black font-sans" onClick={() => setShowMenu(false)}>
          <style>{globalStyles}</style>
          <div className="w-full max-w-[480px] aurora-bg relative shadow-2xl overflow-hidden flex flex-col md:my-8 md:rounded-[40px] md:h-[90vh] md:border border-white/10">
             
             {/* Header Menu (Contextual) */}
             {state.step !== 'service_detail' && (
                 <div className="absolute top-0 right-0 z-50 p-6 pt-12 flex gap-3">
                     <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="w-10 h-10 rounded-full bg-[#1C1C1E]/80 border border-white/10 flex items-center justify-center backdrop-blur-md text-gray-300 hover:text-white transition-all"><Menu className="w-5 h-5"/></button>
                 </div>
             )}

             {showMenu && (
                 <div className="absolute top-24 right-6 w-56 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-slide-up origin-top-right">
                    <button className="w-full px-5 py-4 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 transition-colors"><HelpCircle className="w-4 h-4"/> Ajuda / Conduta</button>
                    <a href={`https://instagram.com/${CONFIG.CONTACT.INSTAGRAM}`} target="_blank" className="w-full px-5 py-4 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 transition-colors"><Instagram className="w-4 h-4"/> Instagram</a>
                    <button onClick={() => { if(navigator.share) navigator.share({title: 'Massagem', url: window.location.href}); }} className="w-full px-5 py-4 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3 transition-colors"><Share2 className="w-4 h-4"/> Compartilhar</button>
                    <div className="h-px bg-white/5 mx-4"/>
                    <button onClick={() => window.location.href="https://google.com"} className="w-full px-5 py-4 text-left text-sm text-[#FF453A] hover:bg-[#FF453A]/10 flex items-center gap-3 transition-colors font-medium"><LogOut className="w-4 h-4"/> Sair Rápido (Pânico)</button>
                 </div>
             )}

             {state.step === 'home' && (
                <HomeScreen loyalty={loyalty} onSelectService={(s) => dispatch({type: 'SELECT_SERVICE', payload: s})} hasNotifs={loyalty.notifications.some(n => !n.read)} onOpenNotifs={() => setShowNotifs(true)} />
             )}

             {state.step === 'service_detail' && (
                <div className="animate-in h-full relative">
                   <div className="absolute inset-0 bg-gradient-to-b from-[#007AFF]/10 to-black z-0"/> 
                   <HomeScreen loyalty={loyalty} onSelectService={()=>{}} hasNotifs={false} onOpenNotifs={()=>{}}/> 
                   <ServiceDetailModal service={state.service} onClose={() => dispatch({type: 'SET_STEP', payload: 'home'})} onContinue={() => dispatch({type: 'SET_STEP', payload: 'logistics'})} />
                </div>
             )}

             {state.step === 'logistics' && (
                <BookingLogisticsScreen state={state} dispatch={dispatch} onBack={() => dispatch({type: 'SET_STEP', payload: 'home'})} onNext={() => dispatch({type: 'SET_STEP', payload: 'checkout'})} />
             )}

             {state.step === 'checkout' && (
                <CheckoutScreen state={state} dispatch={dispatch} user={user} setUser={setUser} pricing={pricing} loyalty={loyalty} setLoyalty={setLoyalty} onBack={() => dispatch({type: 'SET_STEP', payload: 'logistics'})} onFinalize={handleFinalize} isProcessing={isProcessing} />
             )}

             {state.step === 'success' && (
                <div className="h-full flex flex-col items-center justify-center p-8 animate-in text-center">
                   <div className="w-24 h-24 rounded-full bg-[#32D74B] flex items-center justify-center shadow-[0_0_60px_rgba(50,215,75,0.4)] mb-8"><Check className="w-10 h-10 text-white stroke-[3px]"/></div>
                   <h2 className="text-3xl font-bold text-white mb-3">Pedido Enviado!</h2>
                   <p className="text-gray-400 mb-8 max-w-[240px] leading-relaxed">Verifique seu WhatsApp para os detalhes da confirmação.</p>
                   <Button variant="secondary" onClick={() => dispatch({type: 'RESET'})}>Voltar ao Início</Button>
                </div>
             )}

             {showNotifs && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowNotifs(false)}>
                   <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[24px] p-6 border border-white/10 shadow-2xl animate-slide-up" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-white text-lg">Notificações</h3><button onClick={() => setShowNotifs(false)} className="bg-white/5 p-2 rounded-full hover:bg-white/10"><X className="w-5 h-5 text-gray-400"/></button></div>
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
                         {loyalty.notifications.length === 0 && <p className="text-gray-500 text-center text-sm py-8">Nenhuma notificação recente.</p>}
                         {loyalty.notifications.map(n => (
                            <div key={n.id} className="flex gap-4 p-4 bg-white/5 rounded-[16px] border border-white/5">
                               <div className="w-10 h-10 rounded-full bg-[#007AFF]/20 flex items-center justify-center flex-shrink-0 text-[#007AFF]">{n.icon === 'gift' ? <Gift className="w-5 h-5"/> : <Bell className="w-5 h-5"/>}</div>
                               <div><h4 className="font-bold text-sm text-white mb-1">{n.title}</h4><p className="text-xs text-gray-400 leading-snug">{n.message}</p><span className="text-[10px] text-gray-600 mt-2 block">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             )}
          </div>
       </div>
    </ToastProvider>
  )
}
