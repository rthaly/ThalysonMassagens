import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback, useContext, createContext } from 'react';
import {
  ChevronLeft, Check, X, MapPin, Calendar, Clock,
  Bell, Tag, AlertCircle, ArrowRight, Eye, EyeOff, 
  LogOut, Star, Menu, CreditCard, Banknote, QrCode, 
  CheckCircle2, Info, ChevronRight, Crown, Gift, Sparkles, Flame, ShieldCheck, Ticket, Music, HelpCircle, Share2, Instagram
} from 'lucide-react';

// ==================================================================================
// 1. DESIGN SYSTEM & ASSETS (Visual High-End)
// ==================================================================================

const globalStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000; }
body { 
  overscroll-behavior-y: none; touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif; 
  color: #fff; background: #000; -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
input, select { font-size: 16px; outline: none; appearance: none; }
button { user-select: none; cursor: pointer; }

/* Aurora Background Premium */
.aurora-bg {
  background: 
    radial-gradient(130% 100% at 50% 0%, #101012 0%, #000 100%),
    radial-gradient(60% 50% at 50% 100%, rgba(10, 132, 255, 0.05), transparent 100%);
  background-attachment: fixed; min-height: 100vh;
}

/* Glassmorphism Cards */
.glass-card { 
  background: rgba(28, 28, 30, 0.65); backdrop-filter: blur(40px); 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.glass-card:active { transform: scale(0.98); background: rgba(40, 40, 42, 0.8); }

/* Animations */
.animate-enter { animation: enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes enter { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }

/* Typography & Utilities */
.text-gradient { background: linear-gradient(90deg, #fff, #94a3b8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
`;

const CONFIG = {
  PRICES: { MACA: 20, AROMA_FULL: 10, AROMA_DISCOUNT: 5, UPGRADE_PCT: 0.5 },
  CONTACT: { PHONE: '5517991360413', INSTAGRAM: 'thalymassagens' },
  RATES: [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238]
};

// ==================================================================================
// 2. DATA LAYERS
// ==================================================================================

const SERVICES_DB = [
  { 
    id: 'masculina', name: 'Massagem Tântrica/Sensual', type: 'sensual',
    shortDesc: 'A experiência definitiva de relaxamento e prazer.',
    description: 'Uma jornada sensorial completa. Combina técnicas de relaxamento profundo com toques corpo a corpo (Body-to-Body) e finalização manual tântrica para alívio total do estresse.', 
    duration: '60 min', basePrice: 140, highlight: "MAIS ESCOLHIDA 🔥", ratings: 5.0, 
    benefits: ["Relaxamento Muscular Profundo", "Toque Body-to-Body (Intenso)", "Desbloqueio Energético", "Finalização Manual Completa"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante Clássica', type: 'relax',
    shortDesc: 'Desconexão total do estresse diário.',
    description: 'Protocolo focado exclusivamente no relaxamento muscular e alívio de tensões. Movimentos fluidos em todo o corpo (costas, pernas, braços). Sem toques íntimos.', 
    duration: '60 min', basePrice: 90, ratings: 4.9, 
    benefits: ["Alívio de Dores nas Costas", "Melhora da Circulação", "Zero Conteúdo Sexual", "Ambiente Zen"] 
  },
];

const LOCATIONS_DB = [
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Eu vou até você (Sigilo Total)', fee: 75, allowsTableChoice: false, isMotel: true },
  { id: 'santa-fe', label: 'Domicílio (Santa Fé)', sublabel: 'No conforto do seu lar', fee: 40, allowsTableChoice: true, askAddress: true, isUber: true },
  { id: 'outras-cidades', label: 'Região / Outras', sublabel: 'Cidades vizinhas', fee: 0, allowsTableChoice: false, estimatedTravelTime: 'A combinar', inputCity: true, isPending: true },
];

const REVIEWS_DB = [
  { t: "O sigilo foi total. A massagem tântrica me surpreendeu muito.", a: "Anônimo (44 anos)", r: 5 },
  { t: "A sensibilidade que ele desperta no corpo é absurda. Recomendo.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Ambiente discreto e toque muito profissional.", a: "Curioso", r: 5 },
  { t: "Fui tenso e saí leve. O respeito durante a massagem foi total.", a: "M.V. (Jales)", r: 5 },
  { t: "Mãos de fada com pegada firme. Exatamente o que eu precisava.", a: "Cliente Vip", r: 5 },
];

const LEVELS = [
  { name: 'Bronze', min: 0, icon: '🥉', perks: ["Cliente", "Acesso Padrão"] },
  { name: 'Prata', min: 400, icon: '🥈', perks: ["Cliente Frequente", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, icon: '🥇', perks: ["Cliente VIP", "Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, icon: '💎', perks: ["Cliente Elite", "Prioridade Total"] },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (Primeira Vez)' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
  'PRATA15': { code: 'PRATA15', type: 'fixed', value: 15, desc: 'R$ 15,00 OFF (Prata)' },
};

const MUSIC_VIBES = ['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘', 'Lo-Fi ☕', 'Deep 🔊'];

// ==================================================================================
// 3. LOGIC & HOOKS
// ==================================================================================

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const generateBookingId = () => Math.random().toString(36).substring(2, 6).toUpperCase();
const triggerHaptic = () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); };

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
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border border-white/10 bg-[#1C1C1E]/90 animate-enter">
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
    const currentLevel = [...LEVELS].reverse().find(l => (loyalty.totalSpent || 0) >= l.min) || LEVELS[0];
    let aromaPrice = CONFIG.PRICES.AROMA_FULL;
    if (currentLevel.name === 'Prata') aromaPrice = CONFIG.PRICES.AROMA_DISCOUNT;
    if (currentLevel.name === 'Ouro' || currentLevel.name === 'Diamante') aromaPrice = 0;
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
// 4. UI COMPONENTS
// ==================================================================================

const Button = ({ children, variant = 'primary', className = "", disabled, onClick, loading }) => {
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20",
    secondary: "bg-[#2C2C2E] border border-white/10 text-white hover:bg-[#3A3A3C]",
    outline: "border border-blue-600/30 text-blue-500 bg-blue-600/5"
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} 
      className={`w-full font-semibold py-4 rounded-2xl flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale ${styles[variant]} ${className}`}>
      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : children}
    </button>
  );
};

const Header = ({ title, subtitle, onBack, rightAction }) => (
  <div className="flex items-center justify-between pt-12 pb-6 px-6 bg-gradient-to-b from-black/90 via-black/80 to-transparent sticky top-0 z-40 backdrop-blur-sm">
    <div className="flex items-center gap-3">
      {onBack && <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"><ChevronLeft className="w-6 h-6 text-white"/></button>}
      <div>
        <h1 className="text-xl font-bold text-white leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
    {rightAction}
  </div>
);

const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  const msgs = ["Atendimento Online 💆‍♂️", "Horários da noite acabando 🌙", "Anônimo agendou agora 🔥", "Sigilo Total Garantido 🔒"];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%msgs.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="flex items-center gap-3 mb-8 bg-green-500/10 border border-green-500/20 px-4 py-3 rounded-2xl animate-enter">
       <div className="relative">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"/>
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"/>
       </div>
       <p className="text-xs font-medium text-green-400 uppercase tracking-wide">{msgs[idx]}</p>
    </div>
  );
};

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
  const current = REVIEWS_DB[idx];
  return (
    <div className="relative h-24 mb-8">
      <div key={idx} className="absolute inset-0 bg-[#1C1C1E]/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-center animate-enter shadow-lg">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_,k) => <Star key={k} className="w-3 h-3 text-[#FFD60A] fill-[#FFD60A]"/>)}
        </div>
        <p className="text-xs text-gray-300 italic line-clamp-2">"{current.t}"</p>
        <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wide">- {current.a}</p>
      </div>
    </div>
  );
};

const CouponWallet = ({ inventory, selected, onSelect, onAdd }) => {
    const [code, setCode] = useState('');
    const showToast = useToast();
    
    const handleAdd = () => {
        const c = code.toUpperCase().trim();
        if(!c) return;
        if(inventory.includes(c)) { showToast('Você já tem este cupom!', 'error'); return; }
        if(!SYSTEM_COUPONS[c]) { showToast('Cupom inválido ou expirado.', 'error'); return; }
        onAdd(c);
        setCode('');
    }

    const availableCoupons = inventory.map(c => SYSTEM_COUPONS[c]).filter(Boolean);

    return (
        <div className="mt-4 pt-4 border-t border-white/10">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Carteira de Descontos</h3>
            <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                    <Ticket className="absolute left-3 top-3 w-4 h-4 text-gray-500"/>
                    <input value={code} onChange={e => setCode(e.target.value)} placeholder="Adicionar código..." className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white focus:border-blue-500"/>
                </div>
                <button onClick={handleAdd} className="px-4 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20">Resgatar</button>
            </div>
            <div className="space-y-2">
                {availableCoupons.length === 0 && <p className="text-xs text-gray-600 text-center italic">Sua carteira está vazia.</p>}
                {availableCoupons.map(coupon => {
                    const isSelected = selected?.code === coupon.code;
                    return (
                        <button key={coupon.code} onClick={() => onSelect(isSelected ? null : coupon)}
                            className={`w-full p-3 rounded-xl border flex justify-between items-center transition-all group ${isSelected ? 'bg-blue-600/10 border-blue-600' : 'bg-[#1C1C1E] border-white/5 hover:border-white/20'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400'}`}>
                                    <Tag className="w-4 h-4"/>
                                </div>
                                <div className="text-left">
                                    <p className={`text-xs font-bold ${isSelected ? 'text-blue-400' : 'text-white'}`}>{coupon.code}</p>
                                    <p className="text-[10px] text-gray-500">{coupon.desc}</p>
                                </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-600'}`}>
                                {isSelected && <Check className="w-3 h-3 text-white"/>}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ==================================================================================
// 5. TELAS DO FLUXO (Router Visual)
// ==================================================================================

const HomeScreen = ({ loyalty, onSelectService, onOpenNotifs, hasNotifs }) => {
  return (
    <div className="animate-enter pb-32">
       <div className="px-6 pt-14 pb-8">
          <div className="flex justify-between items-start mb-6">
             <div>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Bem-vindo</p>
                <h1 className="text-3xl font-bold text-white leading-tight">Relaxe &<br/><span className="text-gradient">Renove-se.</span></h1>
             </div>
             <button onClick={onOpenNotifs} className="relative p-3 rounded-full bg-white/5 border border-white/10 active:scale-95 transition-transform">
                <Bell className="w-5 h-5 text-gray-300"/>
                {hasNotifs && <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"/>}
             </button>
          </div>

          <LiveStatus />
          <ReviewsCarousel />

          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Experiências Disponíveis</h2>
          <div className="space-y-5">
             {SERVICES_DB.map(s => (
                <button key={s.id} onClick={() => onSelectService(s)} className="w-full glass-card p-0 rounded-[24px] overflow-hidden group text-left relative">
                   {s.highlight && <div className="absolute top-4 right-4 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg z-10">{s.highlight}</div>}
                   <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{s.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed mb-4 pr-4">{s.shortDesc}</p>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                         <Clock className="w-3.5 h-3.5"/> {s.duration}
                         <span className="w-1 h-1 bg-gray-600 rounded-full"/>
                         <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"/> {s.ratings}
                         <div className="flex-1"/>
                         <span className="text-blue-500 text-lg">{formatCurrency(s.basePrice)}</span>
                      </div>
                   </div>
                   <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"/>
                </button>
             ))}
          </div>

          {/* Loyalty Mini */}
          <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
                 <span>Nível Fidelidade</span>
                 <span>{formatCurrency(loyalty.totalSpent)} investidos</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600" style={{width: `${Math.min(100, (loyalty.totalSpent/1800)*100)}%`}}/> 
              </div>
          </div>
       </div>
    </div>
  )
}

const ServiceDetailModal = ({ service, onClose, onContinue }) => {
  if (!service) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
       <div className="relative bg-[#1C1C1E] w-full max-w-[440px] rounded-t-[32px] border-t border-white/10 shadow-2xl animate-slide-up h-[85vh] flex flex-col">
          <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}><div className="w-12 h-1.5 bg-white/20 rounded-full"/></div>
          <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32">
             <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-white w-3/4 leading-tight">{service.name}</h2>
                <div className="text-right">
                   <span className="block text-xl font-bold text-blue-500">{formatCurrency(service.basePrice)}</span>
                   <span className="text-xs text-gray-500">{service.duration}</span>
                </div>
             </div>
             <div className="flex gap-2 mb-6">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-gray-300 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Sigilo Total</span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-gray-300 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Higiene Premium</span>
             </div>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">A Experiência</h3>
             <p className="text-gray-300 text-sm leading-relaxed mb-6 bg-white/5 p-4 rounded-2xl border border-white/5">{service.description}</p>
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">O que está incluso</h3>
             <ul className="space-y-3 mb-8">
                {service.benefits.map((b, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-gray-300"><Check className="w-5 h-5 text-blue-500 flex-shrink-0"/> {b}</li>
                ))}
             </ul>
          </div>
          <div className="absolute bottom-0 w-full p-6 bg-[#1C1C1E] border-t border-white/10">
             <Button onClick={onContinue}>Agendar Sessão</Button>
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
      // Auto-scroll logic
      if(scrollRef.current) {
          setTimeout(() => {
              window.scrollBy({ top: 150, behavior: 'smooth' });
          }, 200);
      }
  }

  return (
    <div className="animate-enter pb-32" ref={scrollRef}>
       <Header title="Agendamento" subtitle="Passo 1 de 2" onBack={onBack} />
       <div className="px-6 space-y-8">
          
          <section>
             <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4"/> Escolha a Data</h3>
             <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                {days.map((d, i) => {
                   const isSel = state.date?.getDate() === d.getDate();
                   const label = i === 0 ? 'HOJE' : d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3);
                   return (
                      <button key={i} onClick={() => handleOptionSelect({date: d, time: ''})}
                         className={`flex-shrink-0 w-[70px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-blue-600 border-blue-600 shadow-lg scale-105 z-10' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
                         <span className={`text-[10px] font-bold uppercase mb-1 ${label==='HOJE' ? 'text-green-400' : ''}`}>{label}</span>
                         <span className={`text-xl font-bold ${isSel ? 'text-white' : 'text-gray-200'}`}>{d.getDate()}</span>
                      </button>
                   )
                })}
             </div>
          </section>

          {state.date && (
             <section className="animate-slide-up">
                <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><Clock className="w-4 h-4"/> Horário Disponível</h3>
                <div className="grid grid-cols-4 gap-2">
                   {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => {
                      const blocked = isTimeBlocked(t, state.date);
                      return (
                         <button key={t} disabled={blocked} onClick={() => handleOptionSelect({time: t})}
                            className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${state.time === t ? 'bg-white text-black border-white' : blocked ? 'opacity-30 grayscale cursor-not-allowed bg-[#1C1C1E] border-transparent' : 'bg-[#1C1C1E] border-white/5 hover:border-white/20'}`}>
                            {t}
                         </button>
                      )
                   })}
                </div>
             </section>
          )}

          <section>
             <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4"/> Local do Atendimento</h3>
             <div className="space-y-3">
                {LOCATIONS_DB.map(loc => (
                   <div key={loc.id} onClick={() => handleOptionSelect({location: loc, address: '', city: ''})}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${state.location?.id === loc.id ? 'bg-blue-600/10 border-blue-600' : 'bg-[#1C1C1E] border-white/5'}`}>
                      <div className="flex justify-between items-center">
                         <div>
                            <p className={`text-sm font-bold ${state.location?.id === loc.id ? 'text-blue-400' : 'text-white'}`}>{loc.label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{loc.sublabel}</p>
                         </div>
                         {loc.fee > 0 && <span className="text-[10px] bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded font-bold">+{formatCurrency(loc.fee)}</span>}
                      </div>
                      {state.location?.id === loc.id && (
                         <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in space-y-3">
                            {loc.allowsTableChoice && (
                               <div className="flex gap-2">
                                  <button onClick={(e) => {e.stopPropagation(); dispatch({type: 'UPDATE', payload: {useTable: false}})}} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${state.useTable === false ? 'bg-blue-600 text-white border-blue-600' : 'bg-black/20 border-white/10 text-gray-400'}`}>Na Cama</button>
                                  <button onClick={(e) => {e.stopPropagation(); dispatch({type: 'UPDATE', payload: {useTable: true}})}} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${state.useTable === true ? 'bg-blue-600 text-white border-blue-600' : 'bg-black/20 border-white/10 text-gray-400'}`}>Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                               </div>
                            )}
                            {loc.askAddress && (
                               <input value={state.address} onChange={(e) => dispatch({type: 'UPDATE', payload: {address: e.target.value}})} placeholder="Digite Rua, Nº e Bairro..." className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-600 focus:border-blue-500"/>
                            )}
                            {loc.inputCity && (
                               <input value={state.city} onChange={(e) => dispatch({type: 'UPDATE', payload: {city: e.target.value}})} placeholder="Qual a cidade?" className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-gray-600 focus:border-blue-500"/>
                            )}
                         </div>
                      )}
                   </div>
                ))}
             </div>
          </section>
       </div>
       <div className="fixed bottom-0 w-full max-w-[440px] p-6 bg-[#000] border-t border-white/10">
          <Button onClick={onNext} disabled={!state.date || !state.time || !state.location || (state.location.askAddress && state.address.length < 5) || (state.location.inputCity && state.city.length < 3)}>
             Continuar para Checkout
          </Button>
       </div>
    </div>
  )
}

const CheckoutScreen = ({ state, dispatch, user, setUser, pricing, loyalty, setLoyalty, onFinalize, onBack, isProcessing }) => {
  const showToast = useToast();

  return (
     <div className="animate-enter pb-40">
        <Header title="Finalizar" subtitle="Passo 2 de 2" onBack={onBack} />
        <div className="px-6 space-y-6">

           {/* Upsell Card */}
           <div className="glass-card rounded-2xl p-5 border-l-4 border-l-blue-600">
               <h3 className="text-sm font-bold text-white mb-4">Personalize sua experiência</h3>
               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                     <div><p className="text-sm font-medium text-gray-200">Aromaterapia</p><p className="text-[10px] text-gray-500">Óleos essenciais importados</p></div>
                     <button onClick={() => { triggerHaptic(); dispatch({type: 'UPDATE', payload: {aroma: !state.aroma}}); }} className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${state.aroma ? 'bg-blue-600 justify-end' : 'bg-gray-700 justify-start'}`}><div className="w-5 h-5 bg-white rounded-full shadow-sm"/></button>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                     <div><p className="text-sm font-medium text-gray-200">+30 Minutos</p><p className="text-[10px] text-gray-500">Sessão estendida</p></div>
                     <button onClick={() => { triggerHaptic(); dispatch({type: 'UPDATE', payload: {upgrade: !state.upgrade}}); }} className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${state.upgrade ? 'bg-blue-600 justify-end' : 'bg-gray-700 justify-start'}`}><div className="w-5 h-5 bg-white rounded-full shadow-sm"/></button>
                  </div>
               </div>
           </div>

           {/* Music Vibe (Novo) */}
           <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Music className="w-3 h-3"/> Vibe Sonora</h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                 {MUSIC_VIBES.map(v => (
                    <button key={v} onClick={() => dispatch({type: 'UPDATE', payload: {music: v}})} className={`px-4 py-2 rounded-xl border text-xs font-bold whitespace-nowrap transition-all ${state.music === v ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>{v}</button>
                 ))}
              </div>
           </section>

           {/* Pagamento */}
           <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Forma de Pagamento</h3>
              <div className="grid grid-cols-2 gap-3">
                 {['pix', 'credit_card', 'cash', 'debit_card'].map(m => (
                    <button key={m} onClick={() => dispatch({type: 'UPDATE', payload: {paymentMethod: m}})}
                       className={`h-14 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${state.paymentMethod === m ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-white/5 text-gray-400'}`}>
                       {m === 'pix' && <QrCode className="w-4 h-4"/>}
                       {m === 'credit_card' && <CreditCard className="w-4 h-4"/>}
                       {m === 'cash' && <Banknote className="w-4 h-4"/>}
                       {m === 'debit_card' && <CreditCard className="w-4 h-4"/>}
                       {m === 'credit_card' ? 'Crédito' : m === 'debit_card' ? 'Débito' : m === 'cash' ? 'Dinheiro' : 'Pix'}
                    </button>
                 ))}
              </div>
              {state.paymentMethod === 'credit_card' && (
                 <select onChange={e => dispatch({type: 'UPDATE', payload: {installments: e.target.value}})} className="w-full mt-3 bg-[#1C1C1E] text-white p-3 rounded-xl border border-white/10 text-sm">
                    {CONFIG.RATES.map((r, i) => i > 0 && <option key={i} value={i}>{i}x de {formatCurrency((pricing.total / (1-r)) / i)}</option>)}
                 </select>
              )}
           </section>

           <CouponWallet 
              inventory={loyalty.inventory} 
              selected={state.coupon}
              onSelect={(c) => dispatch({type: 'UPDATE', payload: {coupon: c}})}
              onAdd={(code) => {
                  setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]}));
                  showToast('Cupom adicionado à carteira!', 'success');
              }}
           />

           <section className="bg-[#1C1C1E] p-5 rounded-2xl border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">Para quem é o agendamento?</h3>
              <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} placeholder="Seu Nome" className="w-full bg-black/30 border-b border-white/10 py-2 text-lg text-white placeholder:text-gray-600 outline-none mb-4 focus:border-blue-500 transition-colors"/>
              <div className="space-y-3">
                 <button onClick={() => setUser({...user, isAdult: !user.isAdult})} className="flex items-center gap-3 w-full">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${user.isAdult ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}`}>{user.isAdult && <Check className="w-3 h-3 text-white"/>}</div>
                    <span className="text-xs text-gray-400">Sou maior de 18 anos</span>
                 </button>
                 <button onClick={() => setUser({...user, isMassagemOk: !user.isMassagemOk})} className="flex items-center gap-3 w-full">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${user.isMassagemOk ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}`}>{user.isMassagemOk && <Check className="w-3 h-3 text-white"/>}</div>
                    <span className="text-xs text-gray-400">Li e concordo com a conduta</span>
                 </button>
              </div>
           </section>
        </div>

        <div className="fixed bottom-0 w-full max-w-[440px] bg-[#1C1C1E]/90 backdrop-blur-xl border-t border-white/10 p-5 rounded-t-[32px] z-50">
           <div className="flex justify-between items-end mb-4">
              <div><p className="text-[10px] text-gray-500 uppercase font-bold">Total Final</p><span className="text-2xl font-bold text-white">{formatCurrency(pricing.total)}</span></div>
              {pricing.discount > 0 && <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded">Economia: {formatCurrency(pricing.discount)}</span>}
           </div>
           <Button onClick={onFinalize} loading={isProcessing} disabled={!user.name || !user.isAdult || !user.isMassagemOk || !state.paymentMethod}>Confirmar Agendamento</Button>
        </div>
     </div>
  )
}

// ==================================================================================
// 6. MAIN APP (Controller)
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
  const [loyalty, setLoyalty] = useLocalStorage('thaly_v7_senior', { totalSpent: 0, inventory: [], notifications: [], hasVisited: false, savedName: '' });
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
        }, 1000);
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
        const msg = `*RESERVA #${generateBookingId()}*\n👤 ${user.name}\n💆 ${state.service.name}\n📅 ${dateStr} às ${state.time}\n📍 ${locStr}\n\n💰 Total: ${formatCurrency(pricing.total)} (${state.paymentMethod})\n🎵 Vibe: ${state.music || 'Padrão'}\n🔗 _Via App_`;
        window.open(`https://api.whatsapp.com/send?phone=${CONFIG.CONTACT.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
        dispatch({type: 'SET_STEP', payload: 'success'});
        setIsProcessing(false);
     }, 1500);
  }

  return (
    <ToastProvider>
       <div className="flex justify-center min-h-screen bg-black" onClick={() => setShowMenu(false)}>
          <style>{globalStyles}</style>
          <div className="w-full max-w-[440px] aurora-bg relative shadow-2xl overflow-hidden flex flex-col">
             
             {/* HEADER MENU (Global) */}
             {state.step !== 'service_detail' && (
                 <div className="absolute top-0 right-0 z-50 p-6 pt-12 flex gap-3">
                     <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="w-10 h-10 rounded-full bg-[#1C1C1E]/80 border border-white/10 flex items-center justify-center backdrop-blur-md text-gray-300 hover:text-white"><Menu className="w-5 h-5"/></button>
                 </div>
             )}

             {showMenu && (
                 <div className="absolute top-24 right-6 w-52 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-slide-up origin-top-right">
                    <button className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3"><HelpCircle className="w-4 h-4"/> Ajuda / FAQ</button>
                    <a href={`https://instagram.com/${CONFIG.CONTACT.INSTAGRAM}`} target="_blank" className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3"><Instagram className="w-4 h-4"/> Instagram</a>
                    <button onClick={() => { if(navigator.share) navigator.share({title: 'Massagem', url: window.location.href}); }} className="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-3"><Share2 className="w-4 h-4"/> Compartilhar</button>
                    <div className="h-px bg-white/10"/>
                    <button onClick={() => window.location.href="https://google.com"} className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-white/5 flex items-center gap-3"><LogOut className="w-4 h-4"/> Sair Rápido (Pânico)</button>
                 </div>
             )}

             {state.step === 'home' && (
                <HomeScreen loyalty={loyalty} onSelectService={(s) => dispatch({type: 'SELECT_SERVICE', payload: s})} hasNotifs={loyalty.notifications.some(n => !n.read)} onOpenNotifs={() => setShowNotifs(true)} />
             )}

             {state.step === 'service_detail' && (
                <div className="animate-enter h-full relative">
                   <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black z-0"/> 
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
                <div className="h-full flex flex-col items-center justify-center p-8 animate-enter text-center">
                   <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.5)] mb-6"><Check className="w-10 h-10 text-white stroke-[3px]"/></div>
                   <h2 className="text-3xl font-bold text-white mb-2">Reserva Enviada!</h2>
                   <p className="text-gray-400 mb-8">Verifique seu WhatsApp para a confirmação final.</p>
                   <Button variant="secondary" onClick={() => dispatch({type: 'RESET'})}>Voltar ao Início</Button>
                </div>
             )}

             {showNotifs && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowNotifs(false)}>
                   <div className="bg-[#1C1C1E] w-full max-w-sm rounded-3xl p-6 border border-white/10" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-white text-lg">Notificações</h3><button onClick={() => setShowNotifs(false)} className="bg-white/5 p-2 rounded-full"><X className="w-5 h-5 text-gray-400"/></button></div>
                      <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-hide">
                         {loyalty.notifications.length === 0 && <p className="text-gray-500 text-center text-sm py-4">Nenhuma notificação recente.</p>}
                         {loyalty.notifications.map(n => (
                            <div key={n.id} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                               <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-500">{n.icon === 'gift' ? <Gift className="w-5 h-5"/> : <Bell className="w-5 h-5"/>}</div>
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
