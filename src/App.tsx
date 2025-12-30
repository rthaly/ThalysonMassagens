import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback, useContext, createContext } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Bell, Tag, AlertCircle, ArrowRight, Eye, EyeOff, Share2, 
  LogOut, Star, Instagram, Menu, Send, CreditCard, Banknote, QrCode, 
  CheckCircle2, Info, ChevronRight, Crown, Trash2, Siren, Flame, Gift
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS & CONFIGURAÇÃO
// ==================================================================================

const globalStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif; 
  color: #fff; background: #000; -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
input, select { user-select: text; font-size: 17px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; cursor: pointer; }

/* Aurora Background & Cards */
.aurora-bg {
  background: 
    radial-gradient(140% 100% at 50% 0%, rgba(20, 20, 22, 1), #000000 60%),
    radial-gradient(100% 100% at 50% 100%, rgba(10, 132, 255, 0.04), transparent 50%);
  background-attachment: fixed; background-size: cover; min-height: 100vh;
}
.ios-card { 
  background: rgba(28, 28, 30, 0.55); backdrop-filter: blur(50px); 
  border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.ios-card:active { transform: scale(0.98); }
.ios-btn-primary {
  background: #007AFF; color: white; box-shadow: 0 8px 20px rgba(0, 122, 255, 0.3); border: none;
}
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pulse-slow { animation: pulse 3s infinite; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
`;

const CONFIG = {
  PRICES: { MACA: 20, AROMA_FULL: 10, AROMA_DISCOUNT: 5, UPGRADE_PCT: 0.5 },
  CONTACT: { PHONE: '5517991360413', PIX: '62922530000144' },
  RATES: [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238]
};

// ==================================================================================
// 2. BANCOS DE DADOS
// ==================================================================================

const SERVICES_DB = [
  { 
    id: 'masculina', name: 'Massagem Masculina', type: 'sensual',
    description: 'Massagem Relaxante + Toques corpo a corpo (de cueca) com finalização Lingam manual completa.', 
    labelDuration: '60 min', basePrice: 140, highlight: "MAIS PEDIDA 🔥", ratings: 5.0, reviews: 310, 
    details: ["Relaxante + Body-to-Body", "Massagista de Cueca", "Finalização Manual", "Alívio Completo"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    description: 'Corpo inteiro: Costas, braços, mãos, pernas, coxas, pés, peito e frente. (Sem toques íntimos).', 
    labelDuration: '60 min', basePrice: 90, ratings: 4.9, reviews: 142, 
    details: ["Corpo Inteiro", "Sem Glúteos/Íntimo", "Toque Terapêutico", "Relaxamento Puro"] 
  },
];

const LOCATIONS_DB = [
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Vou com você', fee: 75, allowsTableChoice: false, isMotel: true },
  { id: 'santa-fe', label: 'Santa Fé do Sul', sublabel: 'No conforto do seu lar', fee: 40, allowsTableChoice: true, askAddress: true, isUber: true },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', sublabel: 'Atendimento na região', fee: 0, allowsTableChoice: false, estimatedTravelTime: 'A combinar', inputCity: true, isPending: true },
];

const LEVELS = [
  { name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', perks: ["Acesso VIP", "Agendamento Rápido"] },
  { name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', perks: ["Cupom R$ 15 (Ganhou!)", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', perks: ["Cupom R$ 25 (Ganhou!)", "Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: ["Cupom R$ 50 (Ganhou!)", "Prioridade Total"] },
];

const REVIEWS_DB = [
  { t: "Sou casado, o sigilo foi total. A massagem tântrica me surpreendeu.", a: "Sigiloso (44 anos)", r: 5 },
  { t: "A sensibilidade que ele desperta no corpo é absurda. Recomendo.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Ambiente discreto e toque muito profissional.", a: "Curioso", r: 5 },
  { t: "Fui tenso e saí leve. O respeito durante a massagem foi total.", a: "M.V. (Jales)", r: 5 },
  { t: "Minha esposa nem desconfia. Foi meu momento de escape.", a: "Casado (Jales)", r: 5 },
  { t: "Cara profissional. Focou no meu prazer.", a: "Vitor", r: 5 },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (1ª Vez)' },
  'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF Especial' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
  'NIVELPRATA': { code: 'NIVELPRATA', type: 'fixed', value: 15, desc: 'R$ 15,00 OFF (Prata)' },
  'NIVELOURO': { code: 'NIVELOURO', type: 'fixed', value: 25, desc: 'R$ 25,00 OFF (Ouro)' },
  'NIVELDIAMANTE': { code: 'NIVELDIAMANTE', type: 'fixed', value: 50, desc: 'R$ 50,00 OFF (Diamante)' },
};

const MUSIC_VIBES = ['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘'];

// ==================================================================================
// 3. UTILS & HELPERS
// ==================================================================================

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(5); };
const generateBookingId = () => Math.random().toString(36).substring(2, 6).toUpperCase();

// ==================================================================================
// 4. CONTEXTOS E HOOKS
// ==================================================================================

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
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border animate-fade-in" 
             style={{ backgroundColor: toast.type === 'success' ? 'rgba(50, 215, 75, 0.9)' : 'rgba(255, 69, 58, 0.9)', borderColor: 'rgba(255,255,255,0.2)' }}>
           {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
           <span className="text-white font-bold text-[14px]">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

const usePersistedState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) { return initialValue; }
  });
  useEffect(() => { localStorage.setItem(key, JSON.stringify(state)); }, [key, state]);
  return [state, setState];
};

const usePriceCalculator = (selection, loyalty) => {
  return useMemo(() => {
    if (!selection.service) return { total: 0, visualTotal: 0, fee: 0, discount: 0, aromaPrice: 0 };

    let base = selection.service.basePrice;
    
    let upgradePrice = 0;
    if (selection.upgrade) {
      upgradePrice = selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
      base += upgradePrice;
    }
    
    let tablePrice = 0;
    if (selection.useTable) {
      tablePrice = CONFIG.PRICES.MACA;
      base += tablePrice;
    }
    
    const currentLevel = [...LEVELS].reverse().find(l => (loyalty.totalSpent || 0) >= l.min) || LEVELS[0];
    let aromaPrice = CONFIG.PRICES.AROMA_FULL;
    if (currentLevel.name === 'Prata') aromaPrice = CONFIG.PRICES.AROMA_DISCOUNT;
    if (currentLevel.name === 'Ouro' || currentLevel.name === 'Diamante') aromaPrice = 0;
    
    let appliedAromaCost = 0;
    if (selection.aroma) {
      appliedAromaCost = aromaPrice;
      base += aromaPrice;
    }

    const fee = selection.location?.fee || 0;
    const feeLabel = selection.location?.isPending ? "A Combinar" : formatCurrency(fee);
    
    let discount = 0;
    if (selection.coupon) {
       const discountableAmount = base; 
       if (selection.coupon.type === 'percent') discount = discountableAmount * (selection.coupon.value / 100);
       else discount = selection.coupon.value;
       base -= discount;
    }

    const visualTotal = Math.max(0, base + fee); 
    
    let creditTotal = visualTotal;
    if (selection.paymentMethod === 'credit_card') {
      const rate = CONFIG.RATES[selection.installments || 1] || 0;
      creditTotal = visualTotal / (1 - rate);
    }

    return { total: visualTotal, creditTotal, fee, feeLabel, discount, appliedAromaCost, regularAromaPrice: CONFIG.PRICES.AROMA_FULL, upgradePrice, tablePrice };
  }, [selection, loyalty]);
};

// ==================================================================================
// 5. COMPONENTES UI
// ==================================================================================

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`ios-card rounded-[24px] border border-white/10 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = "", disabled, onClick, loading }) => {
  const base = "w-full font-bold py-4 rounded-[18px] flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-[#007AFF] text-white shadow-[0_4px_20px_rgba(0,122,255,0.4)]",
    secondary: "bg-[#2C2C2E] border border-white/10 hover:bg-[#3A3A3C] text-white",
  };
  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${base} ${styles[variant]} ${className}`}>
      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : children}
    </button>
  );
};

// Componente Live Status (Trouxe de volta!)
const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  const msgs = ["Atendimento em andamento 💆‍♂️", "Horários da noite acabando 🌙", "Anônimo acabou de agendar 🔥", "3 pessoas vendo agora 👀"];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%msgs.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-in flex items-center gap-2 bg-[#1C1C1E] border border-white/5 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{msgs[idx]}</span>
      </div>
    </div>
  );
};

const LevelProgressBar = ({ data, privacyMode, onTogglePrivacy }) => {
  const safeSpent = data.totalSpent || 0;
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => safeSpent >= l.min);
  const currentLevel = currentLevelIdx !== -1 ? LEVELS[LEVELS.length - 1 - currentLevelIdx] : LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const min = currentLevel.min || 0;
  const nextMin = nextLevel ? nextLevel.min : min + 100; 
  const progress = nextLevel ? Math.min(100, Math.max(0, ((safeSpent - min) / (nextMin - min)) * 100)) : 100;

  return (
    <div className="relative z-10">
        <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Seu Nível</p>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                 {currentLevel.name} {currentLevel.icon}
              </h3>
            </div>
            <div className="text-right">
              <button onClick={onTogglePrivacy} className="flex items-center justify-end gap-1.5 mb-0.5 ml-auto text-gray-500 hover:text-white transition-colors">
                  <span className="text-[10px] font-bold uppercase">Investido</span>
                  {privacyMode ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
              </button>
              <span className={`text-[15px] font-mono text-white font-bold block transition-all ${privacyMode ? 'blur-[5px] select-none opacity-50' : ''}`}>
                {formatCurrency(safeSpent)}
              </span>
            </div>
        </div>
        <div className="relative h-2 bg-white/10 rounded-full mb-2 overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0A84FF] to-[#30D158] transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[9px] text-gray-500 font-medium tracking-wide">
            <span>Benefício: <span className="text-[#32D74B]">{currentLevel.perks[1]}</span></span>
            {nextLevel ? <span>Faltam {formatCurrency(nextLevel.min - safeSpent)}</span> : <span className="text-[#FFD60A]">Nível Máximo</span>}
        </div>
    </div>
  )
}

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
  const currentReview = REVIEWS_DB[idx];
  return (
    <div className="relative h-28 flex items-center justify-center mb-8">
      <div key={idx} className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in px-4 bg-[#1C1C1E] rounded-[24px] border border-white/5 shadow-xl mx-1">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_,k) => <Star key={k} className={`w-3.5 h-3.5 ${k < currentReview.r ? 'text-[#FFD60A] fill-[#FFD60A]' : 'text-gray-800'}`}/>)}
        </div>
        <p className="text-[13px] text-gray-200 text-center font-medium leading-relaxed tracking-tight italic">"{currentReview.t}"</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest">- {currentReview.a}</p>
      </div>
    </div>
  );
};

// Componente de Inventário de Cupons (Trouxe de volta e melhorei)
const CouponSystem = ({ inventory, appliedCoupon, onApply, onRemove, onAddManual }) => {
    const [code, setCode] = useState('');
    const myCoupons = inventory.map(c => SYSTEM_COUPONS[c]).filter(Boolean);
    const showToast = useToast();

    const handleAdd = () => {
        const c = code.toUpperCase().trim();
        if(!c) return;
        if(inventory.includes(c)) { showToast('Você já tem este cupom', 'error'); return; }
        if(!SYSTEM_COUPONS[c]) { showToast('Cupom inválido', 'error'); return; }
        onAddManual(c);
        setCode('');
    }

    return (
        <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Cupons & Descontos</h4>
            <div className="flex gap-2">
                <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="Tem um código?" className="flex-1 bg-[#1C1C1E] p-3 rounded-xl text-sm border border-white/10 focus:border-[#0A84FF] outline-none"/>
                <button onClick={handleAdd} className="px-5 bg-[#2C2C2E] rounded-xl text-xs font-bold hover:bg-[#3A3A3C]">Adicionar</button>
            </div>
            <div className="space-y-2">
                {myCoupons.length === 0 && <p className="text-xs text-gray-600 text-center py-2">Nenhum cupom disponível.</p>}
                {myCoupons.map(coupon => {
                    const isApplied = appliedCoupon?.code === coupon.code;
                    return (
                        <button key={coupon.code} onClick={() => { triggerHaptic(); isApplied ? onRemove() : onApply(coupon); }}
                            className={`w-full p-3 rounded-xl flex justify-between items-center transition-all ${isApplied ? 'bg-[#0A84FF]/20 border border-[#0A84FF]' : 'bg-[#1C1C1E] border border-white/5'}`}>
                            <div className="text-left">
                                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-bold">{coupon.code}</span>
                                <p className="text-xs text-gray-400 mt-1">{coupon.desc}</p>
                            </div>
                            {isApplied ? <X className="w-4 h-4 text-[#0A84FF]"/> : <div className="w-4 h-4 rounded-full border border-gray-600"/>}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// ==================================================================================
// 6. COMPONENTES DO FLUXO (Views)
// ==================================================================================

const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const days = Array.from({length: 14}, (_, i) => {
    const d = new Date(); d.setDate(new Date().getDate() + i); return d;
  });

  const periods = [
      { label: 'Manhã ☀️', slots: ['09:00', '10:00', '11:00'] },
      { label: 'Tarde 🌤️', slots: ['13:00', '14:00', '15:00', '16:00', '17:00'] },
      { label: 'Noite 🌙', slots: ['18:00', '19:00', '20:00', '21:00'] }
  ];

  const isTimeBlocked = (t, d) => {
    if(!d) return true;
    const now = new Date();
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    if (!isToday) return false;
    const [h] = t.split(':').map(Number);
    return h <= now.getHours() + 1;
  };

  return (
    <div className="w-full select-none">
      <div className="flex justify-between items-end mb-4 px-1">
        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Data</h4>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate();
          const label = i === 0 ? 'HOJE' : i === 1 ? 'AMANHÃ' : d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).replace('.','');
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} 
              className={`flex-shrink-0 w-[72px] h-[84px] rounded-[18px] flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-white/5 text-gray-400'}`}>
              <span className={`text-[9px] font-bold uppercase mb-1 ${label==='HOJE' ? 'text-green-400' : ''}`}>{label}</span>
              <span className="text-xl font-bold">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="animate-slide-up space-y-5 pt-2 border-t border-white/5 mt-2">
           {periods.map((period, idx) => (
               <div key={idx}>
                   <h5 className="text-[10px] font-bold text-gray-600 uppercase mb-2 flex items-center gap-2">{period.label}<div className="h-px bg-white/5 flex-1"/></h5>
                   <div className="grid grid-cols-4 gap-2">
                       {period.slots.map(t => {
                           const blocked = isTimeBlocked(t, selectedDate);
                           return (
                               <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                                 className={`py-2 rounded-xl text-[13px] font-bold border transition-all ${selectedTime === t ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : blocked ? 'bg-white/5 border-transparent text-gray-700 opacity-50 cursor-not-allowed' : 'bg-[#2C2C2E] border-transparent text-gray-300'}`}>
                                 {t}
                               </button>
                           )
                       })}
                   </div>
               </div>
           ))}
        </div>
      )}
    </div>
  );
};

// ==================================================================================
// 7. MÁQUINA DE ESTADO
// ==================================================================================

const initialState = {
  step: 'home',
  service: null,
  location: null,
  address: '', 
  city: '',
  date: null,
  time: '',
  useTable: null,
  coupon: null,
  upgrade: false,
  music: null,
  aroma: false,
  paymentMethod: null,
  installments: 1
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP': return { ...state, step: action.payload };
    case 'SELECT_SERVICE': return { ...state, service: action.payload, step: 'configure' };
    case 'UPDATE': return { ...state, ...action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}

// ==================================================================================
// 8. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  // Inicialização do Loyalty com verificação se é null
  const [loyalty, setLoyalty] = usePersistedState('thaly_system_v4_senior', { 
    savedName: '', totalSpent: 0, inventory: [], notifications: [], hasVisited: false 
  });
  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [privacyMode, setPrivacyMode] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const showToast = useToast();

  // --- LÓGICA DE ONBOARDING (PRIMEIRA VISITA) ---
  useEffect(() => {
    if (!loyalty.hasVisited) {
        // Primeira vez: Adiciona Cupom e Notificação
        setTimeout(() => {
            setLoyalty(prev => ({
                ...prev,
                hasVisited: true,
                inventory: [...prev.inventory, 'BEMVINDO'],
                notifications: [{
                    id: Date.now(),
                    title: 'Bem-vindo!',
                    message: 'Você ganhou um cupom de 10% OFF para sua primeira sessão!',
                    icon: 'gift',
                    read: false,
                    timestamp: Date.now()
                }, ...prev.notifications]
            }));
            showToast('🎉 Você ganhou um cupom de Boas-vindas!');
        }, 1500);
    }
  }, [loyalty.hasVisited]);

  useEffect(() => {
    if (loyalty.savedName && !user.name) {
      setUser(prev => ({ ...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true }));
    }
  }, [loyalty.savedName]);

  const pricing = usePriceCalculator(state, loyalty);
  const locationRef = useRef(null);
  const musicRef = useRef(null);
  const extrasRef = useRef(null);
  const payRef = useRef(null);
  const scrollTo = (ref) => setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);

  const handleIdentitySubmit = () => {
    setLoyalty(prev => ({...prev, savedName: user.name}));
    if (state.service) dispatch({ type: 'SET_STEP', payload: 'configure' });
    else dispatch({ type: 'SET_STEP', payload: 'home' });
  };

  const handleFinalize = () => {
    setIsProcessing(true);
    setTimeout(() => {
        const dateStr = state.date.toLocaleDateString('pt-BR');
        let locStr = state.location.label;
        if(state.location.isMotel) locStr += " (Vou com você)";
        if(state.city) locStr += ` (${state.city})`;
        let addressStr = "";
        if(state.location.askAddress && state.address) { addressStr = `\n🏠 Endereço: ${state.address}`; }

        const msg = `*PEDIDO #${generateBookingId()}*\n👤 ${user.name}\n💆 ${state.service.name}\n📅 ${dateStr} às ${state.time}\n📍 ${locStr}${addressStr}\n\n*Detalhes Financeiros:*\nTotal: ${formatCurrency(pricing.total)} (${state.paymentMethod === 'credit_card' ? 'Cartão' : 'Pix/Dinheiro'})\n\n🔗 _Gerado via App Web_`;
        const url = `https://api.whatsapp.com/send?phone=${CONFIG.CONTACT.PHONE}&text=${encodeURIComponent(msg)}`;
        
        const newSpent = (loyalty.totalSpent || 0) + pricing.total;
        let newInventory = [...loyalty.inventory];
        if(state.coupon) newInventory = newInventory.filter(c => c !== state.coupon.code);

        setLoyalty(prev => ({ ...prev, totalSpent: newSpent, inventory: newInventory }));
        
        window.open(url, '_blank');
        dispatch({ type: 'SET_STEP', payload: 'success' });
        setIsProcessing(false);
    }, 1500);
  };

  const canFinalize = state.service && state.location && state.date && state.time && state.paymentMethod && 
                      (state.location.allowsTableChoice ? state.useTable !== null : true) && 
                      (state.location.inputCity ? state.city.length > 3 : true) &&
                      (state.location.askAddress ? state.address.length > 5 : true);

  return (
    <ToastProvider>
      <div className="min-h-screen flex justify-center bg-black font-sans text-gray-200" onClick={() => showMenu && setShowMenu(false)}>
        <style>{globalStyles}</style>

        <div className="w-full max-w-[440px] aurora-bg min-h-screen sm:h-[95vh] sm:my-4 sm:rounded-[40px] sm:border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
          
          {/* --- HEADER --- */}
          <div className="absolute top-0 w-full z-50 px-6 pt-12 pb-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
             <div className="pointer-events-auto">
                {state.step !== 'home' && state.step !== 'success' ? (
                   <button onClick={() => dispatch({ type: 'SET_STEP', payload: state.step === 'identity' ? 'home' : 'home' })} className="p-2 -ml-2 rounded-full bg-white/10 backdrop-blur-md"><ChevronLeft className="w-6 h-6 text-[#0A84FF]"/></button>
                ) : (
                   <div className="flex flex-col animate-fade-in">
                      <span className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest">Bem-vindo</span>
                      <span className="text-[14px] font-bold text-gray-200">{user.name || 'Visitante'}</span>
                   </div>
                )}
             </div>
             <div className="flex gap-3 pointer-events-auto">
                 <button onClick={() => setShowNotifications(true)} className="relative w-10 h-10 rounded-full bg-[#1C1C1E]/80 border border-white/10 flex items-center justify-center backdrop-blur-md">
                    <Bell className="w-5 h-5 text-gray-400"/>
                    {loyalty.notifications.some(n => !n.read) && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1C1C1E]"/>}
                 </button>
                 <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-full bg-[#1C1C1E]/80 border border-white/10 flex items-center justify-center backdrop-blur-md">
                    <Menu className="w-5 h-5 text-gray-400"/>
                 </button>
             </div>
          </div>

          {/* --- MENU MODAL --- */}
          {showMenu && (
             <div className="absolute top-20 right-6 w-48 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-slide-up origin-top-right">
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="w-full px-4 py-3 text-left text-sm text-red-500 hover:bg-white/5 flex items-center gap-2">
                   <LogOut className="w-4 h-4"/> Sair / Reset
                </button>
             </div>
          )}

          {/* --- NOTIFICATIONS MODAL --- */}
          {showNotifications && (
             <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-end sm:items-center justify-center" onClick={() => setShowNotifications(false)}>
                 <div className="bg-[#1C1C1E] w-full h-[70vh] sm:h-[500px] sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 border-t border-white/10 flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">Notificações</h3>
                        <button onClick={() => { setLoyalty(prev => ({...prev, notifications: prev.notifications.map(n => ({...n, read:true}))})); setShowNotifications(false); }} className="bg-white/5 p-2 rounded-full"><X className="w-5 h-5"/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-3">
                        {loyalty.notifications.length === 0 && <p className="text-center text-gray-500 mt-10">Nenhuma notificação.</p>}
                        {loyalty.notifications.map(n => (
                            <div key={n.id} className="bg-[#2C2C2E] p-4 rounded-xl border border-white/5 flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF] flex-shrink-0">
                                    {n.icon === 'gift' ? <Gift className="w-5 h-5"/> : <Bell className="w-5 h-5"/>}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-white">{n.title}</h4>
                                    <p className="text-xs text-gray-400">{n.message}</p>
                                    <span className="text-[10px] text-gray-600 mt-1 block">{new Date(n.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
             </div>
          )}

          {/* --- CONTENT AREA --- */}
          <div className="flex-1 overflow-y-auto pt-28 px-6 pb-40 scrollbar-hide">
            
            {state.step === 'home' && (
              <div className="animate-fade-in space-y-8">
                <div>
                   <h1 className="text-3xl font-bold text-white leading-tight">Relaxe &<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A84FF] to-[#5AC8FA]">Renove as Energias</span></h1>
                </div>

                <Card className="p-5 relative overflow-hidden group">
                   <div className="absolute top-[-50%] right-[-20%] w-48 h-48 bg-[#0A84FF]/20 blur-[60px] rounded-full pointer-events-none"/>
                   <LevelProgressBar data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => setPrivacyMode(!privacyMode)} />
                </Card>

                <LiveStatus />

                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">O que dizem</h3>
                  <ReviewsCarousel />
                </div>

                <div>
                   <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">Menu de Massagens</h3>
                   <div className="space-y-4">
                      {SERVICES_DB.map(s => (
                         <div key={s.id} onClick={() => { triggerHaptic(); dispatch({ type: 'SELECT_SERVICE', payload: s }); if(!user.name) dispatch({ type: 'SET_STEP', payload: 'identity' }); }} 
                              className="ios-card p-5 rounded-[26px] active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden">
                             {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-bold px-3 py-1.5 rounded-bl-[18px]">{s.highlight}</div>}
                             <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-white">{s.name}</h3>
                                <span className="text-[#0A84FF] font-bold">{formatCurrency(s.basePrice)}</span>
                             </div>
                             <p className="text-sm text-gray-400 leading-relaxed mb-4">{s.description}</p>
                             <div className="flex flex-wrap gap-2">
                                {s.details.slice(0,3).map((d,i) => (
                                   <span key={i} className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded-md border border-white/5">{d}</span>
                                ))}
                             </div>
                         </div>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {state.step === 'identity' && (
              <div className="animate-fade-in space-y-6">
                 <h2 className="text-2xl font-bold text-white">Identificação</h2>
                 <div className="bg-[#1C1C1E] p-6 rounded-[24px] border border-white/10">
                    <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider block mb-2">Seu Nome</label>
                    <input 
                      value={user.name} 
                      onChange={e => setUser({...user, name: e.target.value})} 
                      className="w-full bg-transparent text-white text-[22px] font-medium placeholder:text-gray-600 border-b border-white/10 py-2 focus:border-[#0A84FF] transition-colors" 
                      placeholder="Como devo te chamar?" 
                    />
                 </div>
                 <div className="space-y-3">
                    <button onClick={() => setUser({...user, isAdult: !user.isAdult})} className={`w-full p-4 rounded-[20px] border flex items-center gap-3 transition-all ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                       <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isAdult && <Check className="w-3 h-3 text-white"/>}</div>
                       <span className={user.isAdult ? 'text-white' : 'text-gray-400'}>Maior de 18 anos</span>
                    </button>
                    <button onClick={() => setUser({...user, isMassagemOk: !user.isMassagemOk})} className={`w-full p-4 rounded-[20px] border flex items-center gap-3 transition-all ${user.isMassagemOk ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                       <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${user.isMassagemOk ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isMassagemOk && <Check className="w-3 h-3 text-white"/>}</div>
                       <span className={user.isMassagemOk ? 'text-white' : 'text-gray-400'}>Ciente dos termos</span>
                    </button>
                 </div>
                 <Button onClick={handleIdentitySubmit} disabled={!user.name || !user.isAdult || !user.isMassagemOk}>Continuar</Button>
              </div>
            )}

            {state.step === 'configure' && state.service && (
               <div className="animate-fade-in space-y-10">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                     <div>
                        <h2 className="text-xl font-bold text-white">{state.service.name}</h2>
                        <p className="text-xs text-gray-500 mt-1">{state.service.labelDuration} • Personalização</p>
                     </div>
                     <span className="text-[#0A84FF] font-bold text-lg">{formatCurrency(state.service.basePrice)}</span>
                  </div>

                  {/* 1. DATA */}
                  <InlineDateSelector selectedDate={state.date} selectedTime={state.time} onSelect={(d, t) => {
                     dispatch({ type: 'UPDATE', payload: { date: d, time: t } });
                     if(t) scrollTo(locationRef);
                  }} />

                  {/* 2. LOCAL */}
                  <div ref={locationRef}>
                     <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Local</h4>
                     <div className="space-y-3">
                        {LOCATIONS_DB.map(loc => (
                           <div key={loc.id}>
                              <button onClick={() => { dispatch({ type: 'UPDATE', payload: { location: loc, useTable: null, city: '', address: '' } }); scrollTo(musicRef); }}
                                 className={`w-full p-4 rounded-[20px] border text-left flex justify-between items-center transition-all ${state.location?.id === loc.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                                 <div><p className="font-bold text-sm text-white">{loc.label}</p><p className="text-xs text-gray-500">{loc.sublabel}</p></div>
                                 {loc.fee > 0 && <span className="text-[10px] font-bold text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-1 rounded">+ {formatCurrency(loc.fee)}</span>}
                              </button>
                              
                              {/* Sub-opções de Local */}
                              {state.location?.id === loc.id && (
                                <div className="mt-3 animate-fade-in pl-4 border-l-2 border-white/10 space-y-3">
                                   
                                   {/* Opção Maca/Cama */}
                                   {loc.allowsTableChoice && (
                                     <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => { dispatch({ type: 'UPDATE', payload: { useTable: false } }); }} className={`p-3 rounded-xl border text-xs font-bold ${state.useTable === false ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#2C2C2E] border-transparent text-gray-400'}`}>🛏 Na Cama</button>
                                        <button onClick={() => { dispatch({ type: 'UPDATE', payload: { useTable: true } }); }} className={`p-3 rounded-xl border text-xs font-bold ${state.useTable === true ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#2C2C2E] border-transparent text-gray-400'}`}>💆‍♂️ Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                                     </div>
                                   )}
                                   
                                   {/* Endereço Santa Fé */}
                                   {loc.askAddress && (
                                     <div className="relative">
                                        <MapPin className="absolute top-3 left-3 w-4 h-4 text-gray-500"/>
                                        <input 
                                          value={state.address} 
                                          onChange={e => dispatch({ type: 'UPDATE', payload: { address: e.target.value } })} 
                                          placeholder="Rua, Número e Bairro..." 
                                          className="w-full bg-[#2C2C2E] p-3 pl-10 rounded-xl text-sm text-white focus:border-[#0A84FF] border border-transparent outline-none" 
                                        />
                                     </div>
                                   )}

                                   {/* Input Outras Cidades */}
                                   {loc.inputCity && (
                                     <input value={state.city} onChange={e => dispatch({ type: 'UPDATE', payload: { city: e.target.value } })} placeholder="Qual cidade?" className="w-full bg-[#2C2C2E] p-3 rounded-xl text-sm text-white focus:border-[#0A84FF] border border-transparent outline-none" />
                                   )}
                                </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* 3. VIBE */}
                  <div ref={musicRef}>
                     <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Som Ambiente</h4>
                     <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {MUSIC_VIBES.map(v => (
                           <button key={v} onClick={() => { dispatch({ type: 'UPDATE', payload: { music: v } }); scrollTo(extrasRef); }} className={`px-5 py-3 rounded-xl border text-xs font-bold whitespace-nowrap transition-all ${state.music === v ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>{v}</button>
                        ))}
                     </div>
                  </div>

                  {/* 4. EXTRAS & CUPONS */}
                  <div ref={extrasRef} className="space-y-3">
                     <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Adicionais</h4>
                     <button onClick={() => dispatch({ type: 'UPDATE', payload: { upgrade: !state.upgrade } })} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${state.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                        <div className="text-left"><p className="text-white font-bold text-sm">+30 Minutos</p><p className="text-[10px] text-gray-500">Sessão estendida</p></div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {formatCurrency(state.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                     </button>
                     <button onClick={() => dispatch({ type: 'UPDATE', payload: { aroma: !state.aroma } })} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${state.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                        <div className="text-left"><p className="text-white font-bold text-sm">Aromaterapia</p><p className="text-[10px] text-gray-500">Óleos essenciais</p></div>
                        <div className="text-right">
                           {pricing.appliedAromaCost < pricing.regularAromaPrice ? (
                              <><span className="text-gray-500 line-through text-[10px] mr-2">{formatCurrency(pricing.regularAromaPrice)}</span><span className="text-[#30D158] font-bold text-sm">{pricing.appliedAromaCost === 0 ? 'GRÁTIS' : `+${formatCurrency(pricing.appliedAromaCost)}`}</span></>
                           ) : (<span className="text-[#0A84FF] font-bold text-sm">+ {formatCurrency(pricing.regularAromaPrice)}</span>)}
                        </div>
                     </button>

                     <CouponSystem 
                        inventory={loyalty.inventory}
                        appliedCoupon={state.coupon}
                        onApply={(c) => { dispatch({ type: 'UPDATE', payload: { coupon: c } }); scrollTo(payRef); }}
                        onRemove={() => dispatch({ type: 'UPDATE', payload: { coupon: null } })}
                        onAddManual={(c) => { 
                            setLoyalty(prev => ({...prev, inventory: [...prev.inventory, c]}));
                            showToast('Cupom adicionado com sucesso!');
                        }}
                     />
                  </div>

                  {/* 5. PAGAMENTO */}
                  <div ref={payRef}>
                     <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pagamento</h4>
                     <div className="grid grid-cols-2 gap-3 mb-4">
                        {['pix', 'cash', 'debit_card', 'credit_card'].map(m => (
                           <button key={m} onClick={() => dispatch({ type: 'UPDATE', payload: { paymentMethod: m } })} 
                              className={`h-20 rounded-[18px] border flex flex-col items-center justify-center gap-1 transition-all ${state.paymentMethod === m ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                              {m === 'pix' && <QrCode className="w-5 h-5 text-[#0A84FF]"/>}
                              {m === 'cash' && <Banknote className="w-5 h-5 text-[#30D158]"/>}
                              {m === 'debit_card' && <CreditCard className="w-5 h-5 text-white"/>}
                              {m === 'credit_card' && <CreditCard className="w-5 h-5 text-[#FFD60A]"/>}
                              <span className="text-[11px] font-bold text-gray-300 uppercase">{m.replace('_', ' ')}</span>
                           </button>
                        ))}
                     </div>
                     {state.paymentMethod === 'credit_card' && (
                        <select onChange={e => dispatch({ type: 'UPDATE', payload: { installments: parseInt(e.target.value) } })} className="w-full bg-[#1C1C1E] text-white p-3 rounded-xl border border-white/10 text-sm animate-fade-in">
                           {CONFIG.RATES.map((r, i) => i > 0 && <option key={i} value={i}>{i}x de {formatCurrency((pricing.total / (1-r)) / i)}</option>)}
                        </select>
                     )}
                  </div>
                  
                  <div className="h-24"></div> {/* Spacer */}
               </div>
            )}

            {state.step === 'success' && (
               <div className="flex flex-col items-center justify-center pt-20 animate-fade-in text-center">
                  <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(50,215,75,0.4)] mb-6">
                     <Check className="w-10 h-10 text-white stroke-[3px]"/>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Pedido Criado!</h2>
                  <p className="text-gray-400 mb-8 max-w-[200px]">Finalize a conversa no WhatsApp para confirmar.</p>
                  <Button variant="secondary" onClick={() => dispatch({ type: 'SET_STEP', payload: 'home' })}>Voltar ao Início</Button>
               </div>
            )}
          </div>

          {/* --- FOOTER (CHECKOUT) --- */}
          {state.step === 'configure' && state.location && (
             <div className="absolute bottom-0 w-full bg-[#1C1C1E] rounded-t-[32px] p-5 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] z-50 animate-slide-up">
                <div className="flex justify-between items-end mb-4 px-1">
                   <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Estimado</p>
                      <div className="flex flex-col">
                         <span className="text-2xl font-bold text-white tracking-tight">{formatCurrency(pricing.total)}</span>
                         {state.paymentMethod === 'credit_card' && <span className="text-[10px] text-[#FFD60A] font-bold">💳 {state.installments}x no Cartão</span>}
                      </div>
                   </div>
                   <div className="text-right text-[10px] text-gray-500">
                      {pricing.fee > 0 && <p>{pricing.feeLabel} de taxa incl.</p>}
                      {pricing.discount > 0 && <p className="text-red-500">-{formatCurrency(pricing.discount)} desc.</p>}
                   </div>
                </div>
                <Button onClick={handleFinalize} disabled={!canFinalize} loading={isProcessing}>
                   {isProcessing ? 'PROCESSANDO...' : 'AGENDAR NO WHATSAPP'}
                </Button>
             </div>
          )}

        </div>
      </div>
    </ToastProvider>
  );
}
