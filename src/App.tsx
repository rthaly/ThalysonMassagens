import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, Siren, Send, ThumbsUp, Car, Menu
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS (PREMIUM DARK / STEALTH)
// ==================================================================================

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700&display=swap');

/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: 'Manrope', -apple-system, Helvetica, Arial, sans-serif; 
  letter-spacing: -0.02em;
  color: #E0E0E0;
  background: #050505;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Hide */
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Inputs & Form Elements */
input, select { user-select: text; font-size: 17px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; -webkit-touch-callout: none; cursor: pointer; }

/* --- BACKGROUNDS --- */
.aurora-bg {
  background: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 85%);
  min-height: 100vh;
  position: relative;
}
.aurora-bg::before {
  content: "";
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

/* --- COMPONENTS --- */
.ios-card { 
  background: rgba(20, 20, 20, 0.7); 
  backdrop-filter: blur(20px); 
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.2s ease, border-color 0.3s;
}
.ios-card:active { transform: scale(0.99); }

/* --- BOTÕES --- */
.ios-btn { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s; 
}
.ios-btn:active { transform: scale(0.97); background: rgba(255, 255, 255, 0.1); }

.ios-btn-primary {
  background: #E0E0E0; /* Branco Gelo/Prata */
  color: #000;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
  border: none;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }
.ios-btn-primary:disabled { background: #333; color: #666; cursor: not-allowed; box-shadow: none; }

/* --- INPUTS --- */
.custom-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  color: white;
  transition: all 0.3s ease;
  border-radius: 0;
  padding-left: 0;
}
.custom-input:focus { border-color: #D4AF37; box-shadow: 0 4px 8px -4px rgba(212, 175, 55, 0.2); }

/* --- ANIMATIONS --- */
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pulse-slow { animation: pulse 3s infinite; }
.animate-spin-slow { animation: spin 1.5s linear infinite; }
.blur-mode { filter: blur(10px) grayscale(100%); transition: filter 0.3s ease; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const IconBack = () => <ChevronLeft className="w-6 h-6 text-[#D4AF37]" />;

// ==================================================================================
// 2. CONFIGURAÇÃO (DADOS)
// ==================================================================================

const CONFIG = {
  PRICES: {
    MACA: 20,            
    AROMA_FULL: 10,      
    AROMA_DISCOUNT: 5,   
    UPGRADE_PCT: 0.5     
  }
};

const services = [
  { 
    id: 'masculina', name: 'Experiência Tântrica', type: 'sensual',
    description: 'Conexão profunda. Relaxante + Toques bioelétricos corpo a corpo (traje sumário) e finalização Lingam.', 
    labelDuration: '60 min', minutes: 60, 
    basePrice: 140, 
    highlight: "EXCLUSIVA 🔥", ratings: 5.0, reviews: 310, 
    details: ["Relaxante + Body-to-Body", "Traje Sumário", "Finalização Manual", "Alívio Completo"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    description: 'Protocolo clássico para alívio de tensões musculares e stress. (Sem toques íntimos).', 
    labelDuration: '60 min', minutes: 60, 
    basePrice: 90, 
    ratings: 4.9, reviews: 142, 
    details: ["Corpo Inteiro", "Sem Glúteos/Íntimo", "Toque Terapêutico", "Relaxamento Puro"] 
  },
];

const locations = [
  { 
    id: 'motel', 
    label: 'Suíte Privada (Motel)', 
    sublabel: 'Vou até sua suíte', 
    fee: 75,
    allowsTableChoice: false, 
    estimatedTravelTime: '10-15 min',
    isMotel: true
  },
  { 
    id: 'santa-fe', 
    label: 'Santa Fé do Sul', 
    sublabel: 'Home Care / Hotel', 
    fee: 40,
    allowsTableChoice: true, 
    estimatedTravelTime: '15-20 min',
    isUber: true
  },
  { 
    id: 'outras-cidades', 
    label: 'Cidades Vizinhas', 
    sublabel: 'Atendimento regional', 
    fee: 0,
    allowsTableChoice: false, 
    estimatedTravelTime: 'A combinar', 
    input: true,
    isPending: true 
  },
];

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (1ª Vez)' },
  'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF Especial' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
  'NIVELPRATA': { code: 'NIVELPRATA', type: 'fixed', value: 15, desc: 'R$ 15,00 OFF (Prata)' },
  'NIVELOURO': { code: 'NIVELOURO', type: 'fixed', value: 25, desc: 'R$ 25,00 OFF (Ouro)' },
  'NIVELDIAMANTE': { code: 'NIVELDIAMANTE', type: 'fixed', value: 50, desc: 'R$ 50,00 OFF (Diamante)' },
};

const LEVELS = [
  { name: 'Membro', min: 0, rewardCode: null, icon: '🛡️', perks: ["Acesso VIP", "Agendamento Rápido"] },
  { name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', perks: ["Cupom R$ 15 (Ganhou!)", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', perks: ["Cupom R$ 25 (Ganhou!)", "Aroma GRÁTIS"] },
  { name: 'Black', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: ["Cupom R$ 50 (Ganhou!)", "Prioridade Total"] },
];

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const musicVibes = ['Silêncio 🤫', 'Deep Lounge 🍸', 'Natureza 🌿', 'Tantra 🧘']; 

const REVIEWS_DB = [
  { t: "Sou casado, o sigilo foi total. A massagem tântrica me surpreendeu.", a: "Sigiloso (44 anos)", r: 5 },
  { t: "Nunca tinha feito tântrica. A sensibilidade é absurda.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Ambiente discreto. Toque íntimo com muito respeito e técnica.", a: "Curioso", r: 5 },
  { t: "Gostei da massagem, relaxou bem os músculos.", a: "Paulo", r: 4 },
  { t: "Mão leve e firme. A manipulação foi perfeita.", a: "Anônimo", r: 5 },
  { t: "Para quem busca relaxamento de verdade, sem pressa.", a: "Cliente VIP", r: 5 },
  { t: "Achei o local super limpo e o atendimento impecável.", a: "M.V.", r: 5 }
];

// --- HELPERS ---
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(5); };
const generateBookingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 4; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return result;
};

// ==================================================================================
// 3. COMPONENTES DE UI
// ==================================================================================

const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  const msgs = ["Atendimento em andamento", "Últimas vagas da semana", "Respeito e Sigilo garantidos"];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%msgs.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-in flex items-center gap-3 bg-[#111] border border-white/5 rounded-full px-5 py-2 shadow-lg backdrop-blur-md">
        <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
        <span className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{msgs[idx]}</span>
      </div>
    </div>
  );
};

// Novo Componente de Reviews (Carrossel)
const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
  const currentReview = REVIEWS_DB[idx];
  
  return (
    <div className="relative h-24 flex items-center justify-center mb-6">
      <div key={idx} className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in px-4 bg-[#111] rounded-[16px] border border-white/5 shadow-xl">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_,k) => <Star key={k} className={`w-3 h-3 ${k < currentReview.r ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-800'}`}/>)}
        </div>
        <p className="text-[12px] text-gray-300 text-center font-medium leading-relaxed italic">"{currentReview.t}"</p>
        <p className="text-[9px] text-gray-500 font-bold uppercase mt-2 tracking-widest">- {currentReview.a}</p>
      </div>
    </div>
  );
};

const LevelProgressBar = ({ data, privacyMode, onTogglePrivacy }) => {
  const safeSpent = (data && typeof data.totalSpent === 'number') ? data.totalSpent : 0;
  
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => safeSpent >= l.min);
  const currentLevel = currentLevelIdx !== -1 ? LEVELS[LEVELS.length - 1 - currentLevelIdx] : LEVELS[0];
  const nextLevel = currentLevelIdx !== -1 && (LEVELS.length - 1 - currentLevelIdx + 1) < LEVELS.length ? LEVELS[LEVELS.length - 1 - currentLevelIdx + 1] : null;
  
  const min = currentLevel.min || 0;
  const nextMin = nextLevel ? nextLevel.min : min + 1;
  const rawProgress = ((safeSpent - min) / (nextMin - min)) * 100;
  const progress = nextLevel ? Math.min(100, Math.max(0, rawProgress)) : 100;

  return (
    <div>
        <div className="flex justify-between items-end mb-3 relative z-10">
            <div>
              <p className="text-[9px] text-[#8E8E93] font-bold uppercase tracking-[0.1em] mb-1">Status do Cliente</p>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                 {currentLevel.name} <span className="text-sm opacity-70">{currentLevel.icon}</span>
              </h3>
            </div>
            <div className="text-right">
              <button onClick={onTogglePrivacy} className="flex items-center justify-end gap-1.5 mb-1 ml-auto text-gray-500 hover:text-[#D4AF37] transition-colors">
                  <span className="text-[9px] font-bold uppercase tracking-wider">Investimento</span>
                  {privacyMode ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
              </button>
              <span className={`text-[14px] font-mono text-[#D4AF37] font-bold block transition-all duration-300 ${privacyMode ? 'blur-[6px] select-none opacity-50' : ''}`}>
                {formatCurrency(safeSpent)}
              </span>
            </div>
        </div>
        
        <div className="relative h-1.5 bg-gray-800/50 rounded-full mb-3 overflow-hidden z-10">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D4AF37] to-[#F1C40F] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(212,175,55,0.4)]" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="flex justify-between text-[9px] text-gray-500 font-medium tracking-wide">
            <span className="flex items-center gap-1">Próximo: <span className="text-gray-300">{nextLevel ? nextLevel.name : 'Máximo'}</span></span>
            {nextLevel && <span>Faltam {formatCurrency(nextLevel.min - safeSpent)}</span>}
        </div>
    </div>
  )
}

const LoyaltyCard = ({ data, privacyMode, onTogglePrivacy }) => {
  return (
    <div className="ios-card p-6 rounded-[24px] relative overflow-hidden mb-6 group border-t border-white/5 bg-gradient-to-br from-[#1a1a1a] to-[#050505]">
      {/* Visual de "Cartão Black" */}
      <div className="absolute top-0 right-0 p-4 opacity-10"><Crown size={64} className="text-white"/></div>
      <LevelProgressBar data={data} privacyMode={privacyMode} onTogglePrivacy={onTogglePrivacy} />
    </div>
  );
};

const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const DAYS_TO_SHOW = 12;
  const days = [];
  const now = new Date();
  for (let i = 0; i < DAYS_TO_SHOW; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      days.push(d);
  }
  
  const isTimeBlocked = (t, d) => {
    if(!d) return true;
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    if (!isToday) return false;
    const [h] = t.split(':').map(Number);
    return h <= now.getHours() + 1;
  };

  const getDayLabel = (d) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      d.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      tomorrow.setHours(0,0,0,0);

      if (d.getTime() === today.getTime()) return 'HOJE';
      if (d.getTime() === tomorrow.getTime()) return 'AMANHÃ';
      return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).replace('.','');
  };

  return (
    <div className="w-full select-none">
      <div className="flex justify-between items-end mb-4 px-1">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Disponibilidade</h4>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-6 animate-fade-in">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate() && selectedDate?.getMonth() === d.getMonth();
          const label = getDayLabel(d);
          
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} 
              className={`relative flex flex-col items-center justify-center h-[75px] rounded-[14px] transition-all duration-200 border 
              ${isSel ? 'bg-[#D4AF37] text-black shadow-lg border-[#D4AF37]' : 'bg-[#111] text-gray-400 border-white/5 active:bg-[#222] hover:bg-[#1a1a1a]'}`}>
              
              <span className={`text-[9px] uppercase font-bold tracking-wide mb-0.5 ${label === 'HOJE' ? 'text-[#D4AF37]' : isSel ? 'text-black/70' : 'opacity-50'}`}>{isSel && label === 'HOJE' ? 'HOJE' : label}</span>
              <span className={`text-xl font-bold leading-none ${isSel ? 'text-black' : 'text-gray-200'}`}>{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="animate-slide-up space-y-4 pt-2 border-t border-white/5">
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Horários Livres</h5>
            <div className="grid grid-cols-4 gap-2">
                {timeSlots.map(t => {
                    const blocked = isTimeBlocked(t, selectedDate);
                    const isSelected = selectedTime === t;
                    return (
                        <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                          className={`py-3 rounded-[12px] text-[12px] font-semibold transition-all duration-200 relative overflow-hidden
                          ${isSelected ? 'bg-white text-black shadow-lg' : blocked ? 'bg-white/5 text-gray-700 opacity-30 cursor-not-allowed' : 'bg-[#111] text-gray-300 hover:bg-[#222] border border-white/5'}`}>
                          {t}
                        </button>
                    )
                })}
            </div>
        </div>
      )}
    </div>
  );
};

const CouponInventory = ({ inventory, appliedCoupon, onApply, onRemove, onAddManual }) => {
  const [manualCode, setManualCode] = useState('');
  const myCoupons = inventory.map((c) => SYSTEM_COUPONS[c]).filter(Boolean);

  const handleManualAdd = () => {
      const codeUpper = manualCode.toUpperCase().trim();
      if(codeUpper && SYSTEM_COUPONS[codeUpper]) {
          if (inventory.includes(codeUpper)) {
              alert('Você já possui este benefício.');
          } else {
              onAddManual(codeUpper);
              setManualCode('');
              triggerHaptic();
          }
      } else {
          alert('Código inválido.');
      }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center ml-1 mb-2">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Carteira Digital (Coupons)</h4>
      </div>
      <div className="flex gap-2 mb-3">
          <input 
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Adicionar código promocional" 
            className="w-full custom-input text-white text-[14px] p-2 bg-transparent placeholder:text-gray-600 font-medium"
          />
          <button onClick={handleManualAdd} className="text-[#D4AF37] font-bold text-[12px] uppercase tracking-wider px-4">Adicionar</button>
      </div>
      {myCoupons.length > 0 ? (
        <div className="space-y-3">
          {myCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <button key={coupon.code} onClick={() => { triggerHaptic(); isApplied ? onRemove() : onApply(coupon.code); }} className={`w-full p-4 rounded-[12px] flex justify-between items-center transition-all duration-300 ${isApplied ? 'bg-[#D4AF37]/10 border border-[#D4AF37]' : 'bg-[#111] border border-white/5 hover:bg-[#1a1a1a]'}`}>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-300 bg-white/10 px-1.5 py-0.5 rounded tracking-wider">{coupon.code}</span>
                    {isApplied && <span className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-widest">ATIVADO</span>}
                  </div>
                  <p className="text-[12px] text-gray-400 mt-1">{coupon.desc}</p>
                </div>
                {isApplied ? <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> : <div className="w-4 h-4 rounded-full border border-gray-600"></div>}
              </button>
            )
          })}
        </div>
      ) : (
          <div className="p-4 rounded-[12px] border border-dashed border-white/10 text-center bg-white/5">
              <p className="text-[12px] text-gray-500">Carteira vazia.</p>
          </div>
      )}
    </div>
  );
};

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const [privacyBlur, setPrivacyBlur] = useState(false);
  
  // Refs
  const locationRef = useRef(null);
  const vibeRef = useRef(null);
  const extrasRef = useRef(null);
  const couponRef = useRef(null);
  const paymentRef = useRef(null);
  const homeRef = useRef(null);
  const receiptRef = useRef(null);

  const scrollTo = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300); 
  };
    
  // State
  const [loyalty, setLoyalty] = useState(() => {
    const saved = localStorage.getItem('thaly_system_v22'); 
    return saved ? JSON.parse(saved) : { savedName: '', avatar: '😎', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], history: [] };
  });

  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
  const [showFaq, setShowFaq] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true); 
  const [weatherHint, setWeatherHint] = useState("");
  const [lastOrderLink, setLastOrderLink] = useState(""); 
    
  const surfaceRef = useRef(null);

  // Init
  useEffect(() => { 
    document.title = "Thalyson | Terapia Manual"; 
    setTimeout(() => setLoading(false), 2000); 
  }, []);

  useEffect(() => {
    localStorage.setItem('thaly_system_v22', JSON.stringify(loyalty));
    if (loyalty.savedName) {
        setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true}));
    }
  }, [loyalty]);

  useEffect(() => {
    const hr = new Date().getHours();
    setWeatherHint(hr < 18 ? "Atendimento disponível ☀️" : "Plantão noturno 🌙"); 
  }, []);

  useEffect(() => {
    if (selection.location?.allowsTableChoice && step === 'configure') {
      setTimeout(() => surfaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, [selection.location, step]);

  useEffect(() => {
    if (step === 'home') {
      homeRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  // Actions
  const handleQuickSchedule = () => {
    triggerHaptic();
    if (loyalty.savedName) {
        setStep('services');
    } else {
        setStep('identity'); 
    }
  };

  const handlePanic = () => { window.location.href = "https://google.com"; };
  
  const handleAddManualCoupon = (code) => {
      if (!loyalty.inventory.includes(code)) {
          setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]}));
          triggerHaptic();
      } else {
          alert('Cupom já adicionado.');
      }
  };

  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  // --- LOGICA DE PREÇOS ---
  const getCurrentLevel = () => {
      return [...LEVELS].reverse().find(l => (loyalty.totalSpent || 0) >= l.min) || LEVELS[0];
  };

  const getAromaPrice = () => {
      const level = getCurrentLevel().name;
      if (level === 'Ouro' || level === 'Black') return 0;
      if (level === 'Prata') return CONFIG.PRICES.AROMA_DISCOUNT;
      return CONFIG.PRICES.AROMA_FULL;
  };

  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    
    if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.useTable) total += CONFIG.PRICES.MACA;
    if (selection.aroma) total += getAromaPrice();
    if (selection.location?.fee) total += selection.location.fee;
    
    if (selection.coupon) {
      let discountableAmount = total - (selection.location?.fee || 0); 
      let discountValue = 0;
      if (selection.coupon.type === 'percent') discountValue = (discountableAmount * selection.coupon.value / 100);
      else discountValue = selection.coupon.value;
      total -= discountValue;
    }
    return Math.max(0, total);
  }

  const calcFinalPrice = () => {
    let base = calcBaseTotal();
    if (selection.paymentMethod === 'credit_card') {
       const rate = CARD_RATES[selection.installments] || 0;
       return base / (1 - rate);
    }
    return base;
  };

  const canFinalize = selection.service && selection.location && selection.date && selection.time && selection.music && selection.paymentMethod && (selection.location.allowsTableChoice ? selection.useTable !== null : true) && (selection.location.id === 'outras-cidades' ? !!selection.city : true);

  const handleWhatsApp = () => {
    triggerHaptic();
    if (!canFinalize) return;
    
    if (selection.coupon && !loyalty.inventory.includes(selection.coupon.code)) {
      alert("Cupom inválido.");
      setSelection(prev => ({ ...prev, coupon: null }));
      return;
    }

    // --- CÁLCULO ---
    let serviceValueForLoyalty = selection.service.basePrice;
    let extrasText = "";
    
    if (selection.upgrade) { 
        const upgradePrice = selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
        serviceValueForLoyalty += upgradePrice; 
        extrasText += `\n➕ Extensão de Tempo 30min (+${formatCurrency(upgradePrice)})`; 
    }
    if (selection.useTable) { 
        serviceValueForLoyalty += CONFIG.PRICES.MACA; 
        extrasText += `\n➕ Maca Portátil (+${formatCurrency(CONFIG.PRICES.MACA)})`; 
    }
    
    let aromaPrice = 0;
    let aromaText = "";
    if (selection.aroma) {
        aromaPrice = getAromaPrice();
        serviceValueForLoyalty += aromaPrice;
        aromaText = `\n➕ Aromaterapia (${aromaPrice === 0 ? 'CORTESIA VIP' : `+${formatCurrency(aromaPrice)}`})`;
    }

    let feeVal = selection.location.fee || 0;
    let feeType = selection.location.isMotel ? "🏨 Taxa Suíte (Motel)" : selection.location.isUber ? "🚗 Taxa Deslocamento" : "";
    if(selection.location.isPending) {
        feeType = "Taxa Deslocamento (A Combinar)";
        feeVal = 0; 
    }

    let discountVal = 0;
    if (selection.coupon) {
      if (selection.coupon.type === 'percent') {
          discountVal = serviceValueForLoyalty * (selection.coupon.value / 100);
      } else {
          discountVal = selection.coupon.value;
      }
    }

    const baseTotal = serviceValueForLoyalty + feeVal - discountVal;
    
    let finalPrice = baseTotal;
    if (selection.paymentMethod === 'credit_card') {
       const rate = CARD_RATES[selection.installments] || 0;
       finalPrice = baseTotal / (1 - rate);
    }

    const bookingId = generateBookingId(); 

    let newInventory = [...loyalty.inventory];
    if (selection.coupon) {
        newInventory = newInventory.filter(c => c !== selection.coupon.code);
    }

    const oldTotal = loyalty.totalSpent || 0;
    const newTotal = oldTotal + serviceValueForLoyalty; 
    
    let newNotifications = [...loyalty.notifications];
    newNotifications.unshift({
        id: Date.now(),
        title: 'Agendamento Recebido',
        message: `Sua sessão para ${selection.date.toLocaleDateString('pt-BR')} foi pré-aprovada.`,
        read: false,
        timestamp: Date.now(),
        icon: 'calendar'
    });

    const levelReached = [...LEVELS].reverse().find(l => newTotal >= l.min);
    const oldLevel = [...LEVELS].reverse().find(l => oldTotal >= l.min);

    if(levelReached && (!oldLevel || levelReached.name !== oldLevel.name)) {
       newNotifications.unshift({
           id: Date.now() + 1,
           title: 'Novo Status VIP',
           message: `Você alcançou o nível ${levelReached.name}.`,
           read: false,
           timestamp: Date.now(),
           icon: 'level'
       });
       if(levelReached.rewardCode && !newInventory.includes(levelReached.rewardCode)) {
           newInventory.push(levelReached.rewardCode);
       }
    }

    setLoyalty(prev => ({ 
      ...prev, 
      savedName: user.name || prev.savedName, 
      totalSpent: newTotal, 
      totalSaved: (prev.totalSaved || 0) + (selection.coupon ? 10 : 0),
      inventory: newInventory,
      notifications: newNotifications
    }));

    const isToday = selection.date.getDate() === new Date().getDate();
    const dateStr = `${selection.date.toLocaleDateString('pt-BR')}${isToday ? ' (HOJE)' : ''}`;
    
    let locationString = selection.location.label;
    if(selection.location.isMotel) locationString += " (Vou até a suíte)";
    if(selection.location.id === 'outras-cidades' && selection.city) locationString += ` (${selection.city})`;

    const netMasseur = serviceValueForLoyalty - discountVal;
    
    let priceDisplay = "";
    
    if (feeVal > 0) {
        priceDisplay = `💆 Valor Procedimento: ${formatCurrency(netMasseur)}
${feeType}: ${formatCurrency(feeVal)}
💰 *INVESTIMENTO TOTAL: ${formatCurrency(finalPrice)}*`;
    } else {
        priceDisplay = `💰 *INVESTIMENTO: ${selection.location.isPending ? formatCurrency(finalPrice) + ' + Taxa' : formatCurrency(finalPrice)}*`;
    }

    let msg = `*NOVA SOLICITAÇÃO: #${bookingId}*
👤 ${user.name} (Cliente Verificado)
📅 ${dateStr} às ${selection.time}
💆 ${selection.service.name} ${selection.upgrade ? '*(Sessão Estendida)*' : ''}
📍 ${locationString}

*DETALHAMENTO:*
• Base: ${formatCurrency(selection.service.basePrice)}${extrasText}${aromaText}
${discountVal > 0 ? `• Benefício Aplicado: -${formatCurrency(discountVal)}` : ''}

------------------------------
${priceDisplay}
(Forma de Pagto: ${selection.paymentMethod === 'credit_card' ? `${selection.installments}x Cartão` : selection.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'})
------------------------------
🎵 Vibe Sonora: ${selection.music}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`;
    setLastOrderLink(whatsappUrl); 
    window.open(whatsappUrl, '_blank');
    setStep('success');
  };

  // --- COMPONENTE DE RECIBO VISUAL ---
  const OrderReceipt = () => {
    let grossService = selection.service.basePrice;
    if(selection.upgrade) grossService += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if(selection.useTable) grossService += CONFIG.PRICES.MACA;
    if(selection.aroma) grossService += getAromaPrice();

    let fee = selection.location.fee || 0;
    let discount = 0;
    if (selection.coupon) {
        if (selection.coupon.type === 'percent') discount = grossService * (selection.coupon.value / 100);
        else discount = selection.coupon.value;
    }
    
    const totalVisual = grossService + fee - discount;

    return (
        <div className="mt-8 mx-0 mb-32 bg-[#E0E0E0] text-black rounded-[2px] p-6 font-mono text-xs shadow-2xl relative animate-slide-up transform rotate-0">
            <div className="text-center mb-6 border-b border-black/10 pb-4 mt-2">
                <h3 className="font-bold text-base uppercase tracking-widest">Resumo do Pedido</h3>
                <p className="text-[10px] text-gray-500 uppercase mt-1">Serviço de Terapia Manual</p>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between font-bold">
                    <span>{selection.service.name}</span>
                    <span>{formatCurrency(selection.service.basePrice)}</span>
                </div>
                {selection.upgrade && <div className="flex justify-between text-gray-700"><span>Tempo Adicional (+30m)</span><span>{formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span></div>}
                {selection.useTable && <div className="flex justify-between text-gray-700"><span>Maca Portátil</span><span>{formatCurrency(CONFIG.PRICES.MACA)}</span></div>}
                {selection.aroma && <div className="flex justify-between text-gray-700"><span>Aromaterapia</span><span>{getAromaPrice() === 0 ? 'ISENTO' : formatCurrency(getAromaPrice())}</span></div>}
                
                {fee > 0 && (
                     <div className="flex justify-between text-gray-700 pt-2">
                         <span>{selection.location.isMotel ? 'Taxa Externa (Motel)' : 'Deslocamento'}</span>
                         <span>{formatCurrency(fee)}</span>
                     </div>
                 )}
                
                {discount > 0 && (
                    <div className="flex justify-between text-black font-bold">
                        <span>Desconto</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                )}
            </div>

            <div className="border-t border-black pt-4 flex justify-between items-end">
                <span className="font-bold text-lg">TOTAL</span>
                <div className="text-right">
                    <span className="font-bold text-xl">{formatCurrency(selection.paymentMethod === 'credit_card' ? calcFinalPrice() : totalVisual)}</span>
                    {selection.paymentMethod === 'credit_card' && <p className="text-[9px] text-gray-600">parcelado no cartão</p>}
                </div>
            </div>
        </div>
    )
  }

  // --- MENU HAMBURGUER (MODAL) ---
  const HamburgerMenu = () => {
      if(!showMenu) return null;
      return (
          <div className="absolute top-16 right-6 w-52 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-[60] flex flex-col overflow-hidden animate-fade-in origin-top-right">
              <button onClick={() => { setShowFaq(true); setShowMenu(false); }} className="px-5 py-4 text-left text-[13px] text-white hover:bg-white/5 flex items-center gap-3 border-b border-white/5">
                  <HelpCircle className="w-4 h-4 text-gray-400"/> Dúvidas / Regras
              </button>
              <a href="https://instagram.com/thalymassagens" target="_blank" onClick={() => setShowMenu(false)} className="px-5 py-4 text-left text-[13px] text-white hover:bg-white/5 flex items-center gap-3 border-b border-white/5">
                  <Instagram className="w-4 h-4 text-[#E1306C]"/> Instagram
              </a>
              <button onClick={handlePanic} className="px-5 py-4 text-left text-[13px] text-red-500 hover:bg-red-500/10 flex items-center gap-3">
                  <LogOut className="w-4 h-4"/> Sair Rápido
              </button>
          </div>
      )
  }

  // --- HEADER GLOBAL ---
  const GlobalHeader = () => (
      <div className="absolute top-0 w-full z-50 px-6 pt-10 pb-6 flex justify-between items-center pointer-events-none bg-gradient-to-b from-black/90 to-transparent">
          <div className="pointer-events-auto">
             {step !== 'home' && step !== 'success' ? (
                <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10 bg-black/40 backdrop-blur-md border border-white/5"><IconBack /></button>
             ) : (
                <div className="flex flex-col items-start animate-fade-in">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-0.5">
                        Thalyson
                    </span>
                    <span className="text-[12px] font-bold text-gray-300 leading-tight">
                        Terapia Manual
                    </span>
                </div>
             )}
          </div>

          <div className="flex items-center gap-3 pointer-events-auto relative">
              <button onClick={() => setShowNotifications(true)} className="relative w-10 h-10 rounded-full bg-[#111]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 active:scale-95 transition-all">
                  <Bell className="w-4 h-4"/>
                  {loyalty.notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#D4AF37] rounded-full border-2 border-[#111]"></span>
                  )}
              </button>
              <button onClick={() => setShowMenu(!showMenu)} className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-95 ${showMenu ? 'bg-white text-black' : 'bg-[#111]/80 text-gray-400'}`}>
                  {showMenu ? <X className="w-4 h-4"/> : <Menu className="w-4 h-4"/>}
              </button>
              <HamburgerMenu />
          </div>
      </div>
  );

  return (
    <div className={`min-h-screen flex justify-center p-0 sm:p-6 font-sans text-gray-200 bg-black transition-all duration-300 ${privacyBlur ? 'blur-md scale-[0.98] opacity-60' : ''}`} onClick={() => { if(showMenu) setShowMenu(false); }}>
      <style>{globalStyles}</style>

      {/* --- BOTÃO FLUTUANTE DE PRIVACIDADE/SIGILO --- */}
      <div className="fixed bottom-6 left-6 z-[100]">
        <button onClick={() => { triggerHaptic(); setPrivacyBlur(!privacyBlur); }} className="w-10 h-10 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center shadow-2xl text-gray-400">
            {privacyBlur ? <EyeOff className="w-4 h-4 text-[#D4AF37]"/> : <Eye className="w-4 h-4"/>}
        </button>
      </div>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
          <div className="relative w-12 h-12 mb-6">
             <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20"></div>
             <div className="absolute inset-0 rounded-full border-2 border-t-[#D4AF37] animate-spin-slow"></div>
          </div>
          <span className="text-[10px] font-bold tracking-[0.4em] text-[#D4AF37] uppercase">Carregando</span>
        </div>
      ) : (
      <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[32px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/5 h-screen sm:h-[92vh] aurora-bg">
        
        <GlobalHeader />

        {/* --- HOME --- */}
        {step === 'home' && (
          <div className="flex-1 p-6 overflow-y-auto pb-32 pt-32 scrollbar-hide" ref={homeRef}>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-2">Protocolos de<br/><span className="text-[#D4AF37]">Relaxamento Profundo</span></h1>
              <p className="text-sm text-gray-500 max-w-[200px] mx-auto">Atendimento individual e exclusivo em Santa Fé do Sul.</p>
            </div>

            <LoyaltyCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            <LiveStatus />
            
            {/* Avaliações no Início */}
            <div className="mt-2 mb-2 px-1 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">O que dizem os clientes</div>
            <ReviewsCarousel />
            
            <div className="mt-4">
              <button onClick={handleQuickSchedule} className="w-full bg-[#E0E0E0] text-black font-bold py-5 rounded-[16px] shadow-[0_5px_30px_rgba(255,255,255,0.1)] flex justify-center items-center gap-3 text-[15px] uppercase tracking-wider hover:bg-white transition-colors">
                Iniciar Agendamento <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-3">
               <div className="bg-[#111] p-4 rounded-[16px] border border-white/5">
                  <Shield className="w-5 h-5 text-[#D4AF37] mb-2"/>
                  <h4 className="text-[12px] font-bold text-white">Sigilo Total</h4>
                  <p className="text-[10px] text-gray-500 mt-1">Sua privacidade é prioridade.</p>
               </div>
               <div className="bg-[#111] p-4 rounded-[16px] border border-white/5">
                  <Users className="w-5 h-5 text-[#D4AF37] mb-2"/>
                  <h4 className="text-[12px] font-bold text-white">Atendimento Solo</h4>
                  <p className="text-[10px] text-gray-500 mt-1">Você é atendido apenas por mim.</p>
               </div>
            </div>

          </div>
        )}

        {/* --- IDENTITY --- */}
        {step === 'identity' && (
          <div className="flex-1 p-6 pt-32 animate-fade-in flex flex-col h-full pb-32">
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-white mb-2">Identificação</h2>
               <p className="text-gray-400 text-[14px]">Para manter a exclusividade do atendimento.</p>
            </div>
            
            <div className="space-y-8 flex-1">
              <div className="relative">
                <label className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest block mb-4">Como devo chamá-lo?</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full custom-input text-[24px] font-light placeholder:text-gray-700 pb-2" placeholder="Seu nome..." autoFocus />
              </div>

              <div className="space-y-4">
                <button onClick={() => { triggerHaptic(); setUser({...user, isAdult: !user.isAdult}); }} className={`w-full py-4 px-0 flex items-center gap-4 transition-all duration-300 border-b ${user.isAdult ? 'border-[#D4AF37]' : 'border-white/10'}`}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${user.isAdult ? 'bg-[#D4AF37] text-black' : 'bg-[#222] text-gray-600'}`}>{user.isAdult && <Check className="w-3 h-3" />}</div>
                  <span className={`text-[15px] ${user.isAdult ? 'text-white' : 'text-gray-500'}`}>Confirmo ser maior de 18 anos</span>
                </button>
                <button onClick={() => { triggerHaptic(); setUser({...user, isMassagemOk: !user.isMassagemOk}); }} className={`w-full py-4 px-0 flex items-center gap-4 transition-all duration-300 border-b ${user.isMassagemOk ? 'border-[#D4AF37]' : 'border-white/10'}`}>
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${user.isMassagemOk ? 'bg-[#D4AF37] text-black' : 'bg-[#222] text-gray-600'}`}>{user.isMassagemOk && <Check className="w-3 h-3" />}</div>
                  <span className={`text-[15px] ${user.isMassagemOk ? 'text-white' : 'text-gray-500'}`}>Concordo com as regras de conduta</span>
                </button>
              </div>

              <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full ios-btn-primary py-5 rounded-[16px] text-[15px] uppercase tracking-wider disabled:opacity-30 shadow-lg mt-8">Ver Experiências</button>
            </div>
          </div>
        )}

        {/* --- SERVICES (SELEÇÃO DA EXPERIÊNCIA) --- */}
        {step === 'services' && (
          <div className="flex-1 p-6 pt-32 overflow-y-auto pb-32 animate-fade-in scrollbar-hide">
            <h2 className="text-2xl font-bold text-white mb-2">Experiências</h2>
            <p className="text-gray-500 text-[13px] mb-6">Escolha o protocolo ideal para você.</p>
            
            {/* Avaliações aqui também */}
            <ReviewsCarousel />

            <div className="space-y-6 mt-4">
              {services.map(s => (
                <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className={`ios-card p-6 rounded-[24px] active:scale-98 transition-transform group relative overflow-hidden cursor-pointer`}>
                  {s.highlight && <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] font-bold px-3 py-1.5 uppercase tracking-widest">{s.highlight}</div>}
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-[20px] leading-tight mb-1">{s.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[#D4AF37] font-bold text-[16px]">{formatCurrency(s.basePrice)}</span>
                        <span className="text-gray-600 text-[12px] uppercase tracking-wide">| {s.labelDuration}</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-gray-400 leading-relaxed mb-6 font-light">{s.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.details.slice(0,4).map((d, idx) => (
                        <span key={idx} className="text-[10px] text-gray-400 border border-white/10 px-2 py-1 rounded-md uppercase tracking-wide">{d}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONFIGURE (AGENDAMENTO) - DATA PRIMEIRO --- */}
        {step === 'configure' && selection.service && (
          <div className="flex-1 p-6 pt-32 overflow-y-auto pb-48 animate-fade-in scrollbar-hide"> 
            <div className="mb-8">
               <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest">Você selecionou</span>
               <h3 className="font-bold text-white text-[22px] mt-1">{selection.service.name}</h3>
            </div>

            <div className="space-y-10">
              
              {/* SEÇÃO 1: DATA E HORA (Agora é a primeira) */}
              <section>
                <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />
              </section>

              {/* SEÇÃO 2: LOCAL */}
              <section ref={locationRef}>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Defina o Local</h4>
                <div className="space-y-3">
                  {locations.map(l => {
                    if (selection.location && selection.location.id !== l.id) return null;
                    return (
                    <div key={l.id} className="animate-fade-in">
                        <button onClick={() => { triggerHaptic(); setSelection({...selection, location: l, useTable: null}); scrollTo(vibeRef); }} className={`w-full p-4 rounded-[14px] border text-left transition-all duration-300 flex justify-between items-center ${selection.location?.id === l.id ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#111] border-white/5 text-gray-400'}`}>
                          <div className="flex flex-col">
                            <span className="font-bold text-[14px]">{l.label}</span> 
                            <span className="text-[11px] opacity-70">{l.sublabel}</span>
                          </div>
                          {l.fee > 0 && <span className="text-[10px] font-bold opacity-80">+ {formatCurrency(l.fee)}</span>}
                        </button>
                        
                        {selection.location?.id === l.id && l.id === 'santa-fe' && l.allowsTableChoice && (
                          <div ref={surfaceRef} className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                            <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(vibeRef); }} className={`p-4 rounded-[12px] border text-[12px] font-bold transition-all uppercase tracking-wide ${selection.useTable === false ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>Na Cama</button>
                            <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(vibeRef); }} className={`p-4 rounded-[12px] border text-[12px] font-bold transition-all uppercase tracking-wide ${selection.useTable === true ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                          </div>
                        )}
                        {selection.location?.id === l.id && l.id === 'outras-cidades' && (
                            <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Qual cidade?" className="mt-3 w-full custom-input text-[16px] p-2" />
                        )}
                        {selection.location && (
                           <button onClick={() => setSelection({...selection, location: null, useTable: null, city: ''})} className="mt-4 text-[11px] text-[#D4AF37] font-bold uppercase tracking-wider flex items-center gap-1"><ChevronLeft className="w-3 h-3"/> Trocar Local</button>
                        )}
                    </div>
                  )})}
                </div>
              </section>

              <div ref={vibeRef}>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Ambiente Sonoro</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   {musicVibes.map(vibe => (
                      <button key={vibe} onClick={() => { setSelection({...selection, music: vibe}); scrollTo(extrasRef); }} className={`px-5 py-3 rounded-[10px] border text-[12px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${selection.music === vibe ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>
                        {vibe}
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-3" ref={extrasRef}>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 mt-8">Extras de Sessão</h4>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, upgrade: !selection.upgrade}); }} className={`w-full p-4 rounded-[14px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#111] border-white/5'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[13px]">Extensão de Tempo (+30min)</p></div>
                  <span className="text-[#D4AF37] font-bold text-[13px]">+ {formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                </button>

                <button onClick={() => { triggerHaptic(); setSelection({...selection, aroma: !selection.aroma}); }} className={`w-full p-4 rounded-[14px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#111] border-white/5'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[13px]">Aromaterapia</p></div>
                  <div className="text-right">
                      {getAromaPrice() < CONFIG.PRICES.AROMA_FULL ? (
                          <><span className="text-gray-500 line-through text-[10px] mr-2">{formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span><span className="text-green-500 font-bold text-[13px]">{getAromaPrice() === 0 ? 'VIP FREE' : `+${formatCurrency(getAromaPrice())}`}</span></>
                      ) : (<span className="text-[#D4AF37] font-bold text-[13px]">+ {formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span>)}
                  </div>
                </button>
              </div>

              <CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(code) => { setSelection({...selection, coupon: SYSTEM_COUPONS[code]}); scrollTo(paymentRef); }} onRemove={() => setSelection({...selection, coupon: null})} onAddManual={handleAddManualCoupon}/>

              <div className="mt-6" ref={paymentRef}>
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pagamento</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`h-16 rounded-[12px] border flex items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'bg-[#111] border-white/5 text-gray-400'}`}>
                    <QrCode className="w-4 h-4" /><span className="text-[12px] font-bold">Pix</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`h-16 rounded-[12px] border flex items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'bg-[#111] border-white/5 text-gray-400'}`}>
                    <Banknote className="w-4 h-4" /><span className="text-[12px] font-bold">Dinheiro</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`col-span-2 h-16 rounded-[12px] border flex items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'bg-[#111] border-white/5 text-gray-400'}`}>
                    <CreditCard className="w-4 h-4" /><span className="text-[12px] font-bold">Cartão de Crédito</span>
                  </button>
                </div>
                
                {selection.paymentMethod === 'credit_card' && (
                  <div className="mt-3 animate-fade-in">
                    <select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#111] border border-white/10 text-white text-[14px] rounded-[10px] p-3 focus:border-[#D4AF37]">
                      {CARD_RATES.map((rate, i) => i > 0 && (<option key={i} value={i}>{i}x de {formatCurrency(calcFinalPrice()/i)}</option>))}
                    </select>
                  </div>
                )}
              </div>
              
              {canFinalize && <div ref={receiptRef}><OrderReceipt /></div>}
            </div>
          </div>
        )}

        {/* FOOTER FIXO */}
        {step === 'configure' && selection.location && (
          <div className="absolute bottom-0 w-full p-0 z-40">
            <div className="h-16 bg-gradient-to-t from-[#000] to-transparent pointer-events-none"></div>
            <div className="bg-[#111] rounded-t-[24px] p-6 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
              <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col"><span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Investimento Final</span></div>
                  <div className="text-right">
                      <span className="text-[24px] font-bold text-white tracking-tight">
                        {selection.location.isPending ? formatCurrency(calcFinalPrice()) + ' + Taxa' : formatCurrency(calcFinalPrice())}
                      </span>
                  </div>
              </div>
              <button disabled={!canFinalize} onClick={handleWhatsApp} className="w-full bg-[#E0E0E0] hover:bg-white active:scale-[0.98] transition-all text-black font-bold py-5 rounded-[14px] shadow-lg flex justify-center items-center gap-2 text-[14px] uppercase tracking-wider disabled:opacity-50 disabled:shadow-none">Confirmar Agendamento</button>
            </div>
          </div>
        )}

        {/* TELA SUCESSO */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in pb-32">
            <div className="w-24 h-24 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-6 animate-pulse"><Check className="w-10 h-10 text-[#D4AF37]"/></div>
            <h2 className="text-2xl font-bold text-white mb-2">Solicitação Enviada</h2>
            <p className="text-gray-400 mb-10 text-[14px]">O WhatsApp abrirá automaticamente para finalizarmos.</p>
            
            <button onClick={() => window.open(lastOrderLink, '_blank')} className="mb-4 w-full flex items-center justify-center gap-2 text-[13px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 py-4 rounded-[12px] border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 transition-colors uppercase tracking-wider">Reenviar</button>
            <button onClick={handleReset} className="text-gray-600 text-[12px] font-bold uppercase tracking-widest border-b border-gray-800 pb-1 hover:text-white transition-colors">Voltar ao Início</button>
          </div>
        )}

        {/* FAQ MODAL */}
        {showFaq && (
          <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
            <div className="bg-[#111] w-full max-w-sm rounded-[24px] p-8 border border-white/10 shadow-2xl animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">Informações</h3>
              <div className="space-y-6 text-[14px] text-gray-400 leading-relaxed">
                <div><h4 className="font-bold text-white mb-1 uppercase text-[10px] tracking-widest">Conduta</h4><p>Atendimento estritamente profissional e terapêutico. Qualquer desrespeito resultará no cancelamento imediato.</p></div>
                <div><h4 className="font-bold text-white mb-1 uppercase text-[10px] tracking-widest">Pagamento</h4><p>O pagamento pode ser realizado via Pix, Dinheiro ou Cartão (com acréscimo da máquina) ao final da sessão.</p></div>
                
                <div className="pt-6 border-t border-white/5">
                    <button onClick={() => { if(window.confirm("Apagar dados locais?")) { localStorage.clear(); window.location.reload(); }}} className="w-full py-3 rounded-[10px] bg-red-900/20 text-red-500 text-[12px] font-bold flex items-center justify-center gap-2 hover:bg-red-900/30 transition-colors">Resetar Aplicativo</button>
                </div>
              </div>
              <button onClick={() => setShowFaq(false)} className="mt-6 w-full bg-white text-black py-4 rounded-[14px] font-bold hover:bg-gray-200 transition-colors uppercase tracking-wide text-[12px]">Fechar</button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS MODAL */}
        {showNotifications && (
          <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-5" onClick={() => setShowNotifications(false)}>
            <div className="bg-[#111] w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[24px] p-6 border-t sm:border border-white/10 shadow-2xl animate-slide-up h-[70vh] sm:h-[600px] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Notificações</h3>
                  <button onClick={() => { setLoyalty(p => ({...p, notifications: p.notifications.map(n => ({...n, read: true}))})); setShowNotifications(false); }} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1 scrollbar-hide">
                {loyalty.notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600"><Bell className="w-8 h-8 mb-4 opacity-20"/><p className="text-[12px]">Sem novidades.</p></div>
                ) : (
                    loyalty.notifications.map(n => (
                        <div key={n.id} className="p-4 rounded-[16px] bg-[#1a1a1a] border border-white/5 flex items-start gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-[#D4AF37]/10 text-[#D4AF37]`}>
                                {n.icon === 'calendar' ? <Calendar className="w-4 h-4"/> : <Crown className="w-4 h-4"/>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start"><h4 className="font-bold text-white text-[13px] mb-1">{n.title}</h4>{!n.read && <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full mt-1.5"></div>}</div>
                                <p className="text-[12px] text-gray-400 leading-snug">{n.message}</p>
                                <span className="text-[10px] text-gray-600 mt-2 block">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      )}
    </div>
  );
}
