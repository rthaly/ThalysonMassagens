import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, Siren, Send, ThumbsUp, Car, Menu
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS
// ==================================================================================

const globalStyles = `
/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.02em;
  color: #fff;
  background: #000;
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
  background: 
    radial-gradient(140% 100% at 50% 0%, rgba(20, 20, 22, 1), #000000 60%),
    radial-gradient(100% 100% at 50% 100%, rgba(10, 132, 255, 0.04), transparent 50%);
  background-attachment: fixed;
  background-size: cover;
  min-height: 100vh;
}

/* --- COMPONENTS --- */
.ios-card { 
  background: rgba(28, 28, 30, 0.55); 
  backdrop-filter: blur(50px) saturate(180%); 
  -webkit-backdrop-filter: blur(50px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.2s ease;
}
.ios-card:active { transform: scale(0.99); }

/* --- BOTÕES --- */
.ios-btn { 
  background: rgba(255, 255, 255, 0.08); 
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); 
}
.ios-btn:active { transform: scale(0.97); background: rgba(255, 255, 255, 0.15); }

.ios-btn-primary {
  background: #007AFF;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.3);
  border: none;
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }
.ios-btn-primary:disabled { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }

/* --- INPUTS --- */
.custom-input {
  background: rgba(28, 28, 30, 0.5);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  transition: all 0.3s ease;
}
.custom-input:focus { border-color: #0A84FF; box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2); }

/* --- ANIMATIONS --- */
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pulse-slow { animation: pulse 3s infinite; }
.animate-spin-slow { animation: spin 1.5s linear infinite; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

const IconBack = () => <ChevronLeft className="w-6 h-6 text-[#0A84FF]" />;

// ==================================================================================
// 2. BANCO DE DADOS 
// ==================================================================================

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

const services = [
  { 
    id: 'masculina', name: 'Massagem Masculina', type: 'sensual',
    description: 'Massagem Relaxante + Toques corpo a corpo (de cueca) com finalização Lingam manual completa.', 
    labelDuration: '60 min', minutes: 60, basePrice: 100, 
    highlight: "MAIS PEDIDA 🔥", ratings: 5.0, reviews: 310, 
    details: ["Relaxante + Body-to-Body", "Massagista de Cueca", "Lingam / Finalização Manual", "Alívio Completo"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    description: 'Corpo inteiro: Costas, braços, mãos, pernas, coxas, pés, peito e frente. (Sem toques íntimos).', 
    labelDuration: '60 min', minutes: 60, basePrice: 75, 
    ratings: 4.9, reviews: 142, 
    details: ["Corpo Inteiro", "Sem Glúteos/Íntimo", "Toque Terapêutico", "Relaxamento Puro"] 
  },
];

const locations = [
  { 
    id: 'motel', 
    label: 'Suíte Privada (Motel)', 
    sublabel: 'Vou com você', 
    fee: 75, 
    allowsTableChoice: false, 
    estimatedTravelTime: '10-15 min',
    isMotel: true
  },
  { 
    id: 'santa-fe', 
    label: 'Santa Fé do Sul', 
    sublabel: 'No conforto do seu lar', 
    fee: 40, 
    allowsTableChoice: true, 
    estimatedTravelTime: '15-20 min',
    isUber: true
  },
  { 
    id: 'outras-cidades', 
    label: 'Cidades Vizinhas', 
    sublabel: 'Atendimento na região', 
    fee: 0, 
    allowsTableChoice: false, 
    estimatedTravelTime: 'A combinar', 
    input: true,
    isPending: true // Flag para identificar pendência
  },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (1ª Vez)' },
  'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF Especial' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
  'NIVELPRATA': { code: 'NIVELPRATA', type: 'fixed', value: 15, desc: 'R$ 15,00 OFF (Prata)' },
  'NIVELOURO': { code: 'NIVELOURO', type: 'fixed', value: 25, desc: 'R$ 25,00 OFF (Ouro)' },
  'NIVELDIAMANTE': { code: 'NIVELDIAMANTE', type: 'fixed', value: 50, desc: 'R$ 50,00 OFF (Diamante)' },
};

const LEVELS = [
  { name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', perks: ["Acesso VIP", "Agendamento Rápido"] },
  { name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', perks: ["Cupom R$ 15 (Ganhou!)", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', perks: ["Cupom R$ 25 (Ganhou!)", "Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: ["Cupom R$ 50 (Ganhou!)", "Prioridade Total"] },
];

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const musicVibes = ['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘']; 

const REVIEWS_DB = [
  { t: "Cheguei travado, saí flutuando. A finalização foi absurda de boa. Gozei litros.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Nunca gemi tanto na minha vida. Mão pesada na medida certa, sabe onde tocar.", a: "Carlos, 35", r: 5 },
  { t: "Sou casado, sigilo foi total. O alívio no final é explosivo.", a: "Empresário (Casado)", r: 5 },
  { t: "Maluco, que sensação. Tremi as pernas no final quando ele acelerou.", a: "Lucas, 22", r: 5 },
  { t: "Toque firme, corpo quente... gozei demais. Valeu cada centavo.", a: "Anônimo", r: 5 },
  { t: "Fui pro motel com ele, foi a melhor experiência. Respeitoso.", a: "M.V. (Jales)", r: 5 },
  { t: "Sem frescura. Foi direto ao ponto e me deixou leve.", a: "Paulo", r: 5 },
  { t: "Ambiente discreto, me senti um rei.", a: "Empresário", r: 5 },
  { t: "Técnica perfeita. O toque no corpo todo arrepia.", a: "Pedro", r: 5 },
  { t: "Fiz na minha cama, foi super prático. O vizinho nem percebeu.", a: "Anônimo", r: 5 },
  { t: "Primeira vez com homem. Fiquei nervoso, mas ele me deixou zen.", a: "Curioso", r: 5 },
  { t: "O óleo quente, a respiração... foi intenso demais.", a: "G.H.", r: 5 },
  { t: "Atendimento vip, me senti especial. Vou voltar.", a: "M.", r: 5 },
  { t: "Relaxamento profundo seguido de um clímax insano.", a: "J.P.", r: 5 },
  { t: "Cara gente boa, papo bom e mão melhor ainda. Serviço completo.", a: "Vitor", r: 5 },
  { t: "Saí renovado e vazio haha. Muito bom.", a: "D.S.", r: 5 },
  { t: "Melhor massagem da região. Não troco por nada.", a: "Cliente Fiel", r: 5 }
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
  const msgs = ["Atendimento em andamento 💆‍♂️", "Horários da noite acabando 🌙", "Anônimo acabou de agendar 🔥"];
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
        <div className="flex justify-between items-end mb-2 relative z-10">
            <div>
              <p className="text-[9px] text-[#8E8E93] font-bold uppercase tracking-[0.1em] mb-0.5">Seu Nível</p>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                 {currentLevel.name} {currentLevel.icon}
              </h3>
            </div>
            <div className="text-right">
              <button onClick={onTogglePrivacy} className="flex items-center justify-end gap-1.5 mb-0.5 ml-auto text-gray-500 hover:text-white transition-colors">
                  <span className="text-[10px] font-bold uppercase">Investido</span>
                  {privacyMode ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
              </button>
              <span className={`text-[15px] font-mono text-white font-bold block transition-all duration-300 ${privacyMode ? 'blur-[6px] select-none opacity-50' : ''}`}>
                {formatCurrency(safeSpent)}
              </span>
            </div>
        </div>
        
        <div className="relative h-2 bg-white/10 rounded-full mb-2 overflow-hidden z-10">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0A84FF] to-[#30D158] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(48,209,88,0.5)]" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="flex justify-between text-[9px] text-gray-500 font-medium tracking-wide">
            <span>Benefício: <span className="text-[#32D74B]">{currentLevel.perks[1]}</span></span>
            {nextLevel ? (
               <span>Faltam {formatCurrency(nextLevel.min - safeSpent)} p/ {nextLevel.name}</span>
            ) : (
               <span className="text-[#FFD60A]">Nível Máximo</span>
            )}
        </div>
    </div>
  )
}

const LoyaltyCard = ({ data, privacyMode, onTogglePrivacy }) => {
  return (
    <div className="ios-card p-5 rounded-[28px] relative overflow-hidden mb-6 group border-t border-white/10">
      <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-[#0A84FF]/10 blur-[80px] rounded-full pointer-events-none"></div>
      <LevelProgressBar data={data} privacyMode={privacyMode} onTogglePrivacy={onTogglePrivacy} />
    </div>
  );
};

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
  const currentReview = REVIEWS_DB[idx];
  
  return (
    <div className="relative h-28 flex items-center justify-center mb-8">
      <div key={idx} className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in px-4 bg-[#1C1C1E] rounded-[24px] border border-white/5 shadow-xl">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_,k) => <Star key={k} className={`w-3.5 h-3.5 ${k < currentReview.r ? 'text-[#FFD60A] fill-[#FFD60A]' : 'text-gray-800'}`}/>)}
        </div>
        <p className="text-[13px] text-gray-200 text-center font-medium leading-relaxed tracking-tight italic">"{currentReview.t}"</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest">- {currentReview.a}</p>
      </div>
    </div>
  );
};

const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const days = [];
  let tempDate = new Date(now);
  while (tempDate.getMonth() === currentMonth) {
      days.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
  }
  
  const isTimeBlocked = (t, d) => {
    if(!d) return true;
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    if (!isToday) return false;
    const [h] = t.split(':').map(Number);
    return h <= now.getHours();
  };

  const getDayLabel = (d) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (d.toDateString() === today.toDateString()) return 'HOJE';
      if (d.toDateString() === tomorrow.toDateString()) return 'AMANHÃ';
      return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3);
  };

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-4">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate();
          const label = getDayLabel(d);
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} className={`flex flex-col items-center justify-center min-w-[64px] h-[76px] rounded-[18px] transition-all duration-300 ${isSel ? 'bg-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#2C2C2E] text-gray-400 border border-white/5'}`}>
              <span className={`text-[10px] uppercase font-bold tracking-wide opacity-80 ${label === 'HOJE' ? 'text-[#32D74B]' : ''}`}>{label}</span>
              <span className="text-2xl font-semibold mt-1 font-mono">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="grid grid-cols-4 gap-2 animate-fade-in">
          {timeSlots.map(t => {
            const blocked = isTimeBlocked(t, selectedDate);
            return (
              <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                className={`py-3 rounded-[12px] text-[13px] font-semibold transition-all duration-200 ${selectedTime === t ? 'bg-[#0A84FF] text-white shadow-md' : blocked ? 'bg-white/5 text-gray-600 opacity-40' : 'bg-[#2C2C2E] text-gray-300 hover:bg-[#3A3A3C]'}`}>
                {blocked ? <span className="opacity-50 line-through decoration-white/30">{t}</span> : t}
              </button>
            )
          })}
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
              alert('Você já tem este cupom!');
          } else {
              onAddManual(codeUpper);
              setManualCode('');
              triggerHaptic();
          }
      } else {
          alert('Cupom inválido ou expirado.');
      }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center ml-1 mb-2">
        <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Cupons & Descontos</h4>
      </div>
      <div className="flex gap-2 mb-3">
          <input 
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Possui um código?" 
            className="w-full custom-input text-white text-[15px] rounded-[14px] p-3.5 placeholder:text-gray-600 bg-[#1C1C1E]"
          />
          <button onClick={handleManualAdd} className="bg-[#2C2C2E] border border-white/10 text-white px-5 rounded-[14px] font-bold text-[13px] hover:bg-[#3A3A3C] transition-colors">Adicionar</button>
      </div>
      {myCoupons.length > 0 ? (
        <div className="space-y-3">
          {myCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <button key={coupon.code} onClick={() => { triggerHaptic(); isApplied ? onRemove() : onApply(coupon.code); }} className={`w-full p-4 rounded-[16px] flex justify-between items-center transition-all duration-300 ${isApplied ? 'bg-[#0A84FF]/20 border border-[#0A84FF] shadow-lg' : 'bg-[#1C1C1E] border border-white/5'}`}>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-300 bg-[#3A3A3C] px-1.5 py-0.5 rounded tracking-wider border border-white/10">{coupon.code}</span>
                    {isApplied && <span className="text-[10px] text-[#0A84FF] font-bold animate-pulse">APLICADO</span>}
                  </div>
                  <p className="text-[13px] text-gray-400 mt-1">{coupon.desc}</p>
                </div>
                {isApplied ? <X className="w-5 h-5 text-gray-400" /> : <div className="w-5 h-5 rounded-full border border-gray-600"></div>}
              </button>
            )
          })}
        </div>
      ) : (
          <div className="p-4 rounded-[16px] border border-dashed border-white/10 text-center bg-white/5">
              <p className="text-[12px] text-gray-500">Nenhum cupom disponível.</p>
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
    const saved = localStorage.getItem('thaly_system_v21'); 
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
    document.title = "Massagens Relaxantes"; 
    setTimeout(() => setLoading(false), 2000); 
  }, []);

  useEffect(() => {
    localStorage.setItem('thaly_system_v21', JSON.stringify(loyalty));
    if (loyalty.savedName) {
        setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true}));
    }
  }, [loyalty]);

  useEffect(() => {
    const hr = new Date().getHours();
    setWeatherHint(hr < 18 ? "☀️ Dia ideal para relaxar" : "🌙 Noite perfeita para relaxar"); 
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

  // --- CRASH FIX: FUNÇÃO DEFINIDA AQUI (IMPORTANTE) ---
  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  const handleCopyPix = () => { navigator.clipboard.writeText("62922530000144"); alert("CNPJ Pix Copiado!"); }; 
  const handlePanic = () => { window.location.href = "https://google.com"; };
  const handleShare = () => { if(navigator.share) navigator.share({title:'Thalyson Massagens', text:'Massagens Relaxantes em Santa Fé do Sul', url: window.location.href}); };

  const handleAddManualCoupon = (code) => {
      if (!loyalty.inventory.includes(code)) {
          setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]}));
          triggerHaptic();
      } else {
          alert('Este cupom já está na sua carteira!');
      }
  };

  // --- LOGICA DE PREÇOS ---
  const getCurrentLevel = () => {
      return [...LEVELS].reverse().find(l => (loyalty.totalSpent || 0) >= l.min) || LEVELS[0];
  };

  const getAromaPrice = () => {
      const level = getCurrentLevel().name;
      if (level === 'Ouro' || level === 'Diamante') return 0;
      if (level === 'Prata') return 5;
      return 10;
  };

  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    
    // Adicionais
    if (selection.upgrade) total += selection.service.basePrice * 0.5;
    if (selection.useTable) total += 20;
    if (selection.aroma) total += getAromaPrice();
    
    // Taxa adicionada ao total VISUAL
    if (selection.location?.fee) {
        total += selection.location.fee;
    }
    
    // Cupons
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
      alert("Cupom inválido ou expirado.");
      setSelection(prev => ({ ...prev, coupon: null }));
      return;
    }

    // --- CÁLCULO SEGURO ---
    let grossService = selection.service.basePrice;
    let extrasText = "";
    
    if (selection.upgrade) { 
        grossService += selection.service.basePrice * 0.5; 
        extrasText += "\n➕ +30 Minutos (Upgrade)"; 
    }
    if (selection.useTable) { 
        grossService += 20; 
        extrasText += "\n➕ Maca Portátil (+R$20)"; 
    }
    
    let aromaPrice = 0;
    let aromaText = "";
    if (selection.aroma) {
        aromaPrice = getAromaPrice();
        grossService += aromaPrice;
        aromaText = `\n➕ Aromaterapia (${aromaPrice === 0 ? 'GRÁTIS VIP' : `+${formatCurrency(aromaPrice)}`})`;
    }

    let feeVal = selection.location.fee || 0;
    let feeType = selection.location.isMotel ? "Taxa Motel (Suíte)" : selection.location.isUber ? "Taxa Deslocamento (Uber)" : "";
    
    if(selection.location.isPending) {
        feeType = "Taxa Deslocamento (A Combinar)";
        feeVal = 0; 
    }

    let discountVal = 0;
    if (selection.coupon) {
      let baseForDiscount = grossService; 
      if (selection.coupon.type === 'percent') {
          discountVal = baseForDiscount * (selection.coupon.value / 100);
      } else {
          discountVal = selection.coupon.value;
      }
    }

    const baseTotal = grossService + feeVal - discountVal;
    let finalPrice = baseTotal;
    if (selection.paymentMethod === 'credit_card') {
       const rate = CARD_RATES[selection.installments] || 0;
       finalPrice = baseTotal / (1 - rate);
    }

    const bookingId = generateBookingId(); 

    // Atualiza Inventário
    let newInventory = [...loyalty.inventory];
    if (selection.coupon) {
        newInventory = newInventory.filter(c => c !== selection.coupon.code);
    }

    // Atualiza Nível e Notificações
    const oldTotal = loyalty.totalSpent || 0;
    const newTotal = oldTotal + selection.service.basePrice; 
    let newNotifications = [...loyalty.notifications];
    
    newNotifications.unshift({
        id: Date.now(),
        title: 'Agendamento Confirmado',
        message: `Sua sessão para ${selection.date.toLocaleDateString('pt-BR')} foi confirmada.`,
        read: false,
        timestamp: Date.now(),
        icon: 'calendar'
    });

    const levelReached = [...LEVELS].reverse().find(l => newTotal >= l.min);
    const oldLevel = [...LEVELS].reverse().find(l => oldTotal >= l.min);

    if(levelReached && (!oldLevel || levelReached.name !== oldLevel.name)) {
       newNotifications.unshift({
           id: Date.now() + 1,
           title: 'Nível VIP Alcançado!',
           message: `Você chegou no ${levelReached.name} e ganhou novos benefícios!`,
           read: false,
           timestamp: Date.now(),
           icon: 'level'
       });
       if(levelReached.rewardCode && !newInventory.includes(levelReached.rewardCode)) {
           newInventory.push(levelReached.rewardCode);
           newNotifications.unshift({
               id: Date.now() + 2,
               title: 'Ganhou Cupom!',
               message: `O cupom ${levelReached.rewardCode} foi adicionado à sua carteira.`,
               read: false,
               timestamp: Date.now(),
               icon: 'coupon'
           });
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
    
    // --- LÓGICA DA LOCALIZAÇÃO ---
    let locationString = selection.location.label;
    if(selection.location.isMotel) locationString += " (Vou com você)";
    if(selection.location.id === 'outras-cidades' && selection.city) locationString += ` (${selection.city})`;

    // --- CORREÇÃO DO LÍQUIDO ---
    const expenses = feeVal; 
    const netMasseur = baseTotal - expenses;

    let msg = `*NOVO PEDIDO: #${bookingId}*
👤 ${user.name} (Liberado p/ Massagem)
📅 ${dateStr} às ${selection.time}
💆 ${selection.service.name} ${selection.upgrade ? '*(+30 MIN UPGRADE)*' : ''}
📍 ${locationString}

*DETALHES:*
• Serviço Base: ${formatCurrency(grossService)}${extrasText}${aromaText}
${selection.location.isPending ? `• ${feeType}` : (feeVal > 0 ? `• ${feeType}: ${formatCurrency(feeVal)}` : '')}
${discountVal > 0 ? `• Desconto (${selection.coupon.code}): -${formatCurrency(discountVal)}` : ''}

💰 *TOTAL CLIENTE: ${selection.location.isPending ? formatCurrency(finalPrice) + ' + Taxa' : formatCurrency(finalPrice)}*
(Pagamento: ${selection.paymentMethod === 'credit_card' ? `${selection.installments}x Cartão` : selection.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'})

------------------------------
💸 *LÍQUIDO (Seu Lucro): ${formatCurrency(netMasseur)}*
------------------------------

🎵 Vibe: ${selection.music}
${selection.location.isMotel ? '⚠️ Obs: Taxa Motel inclusa no total cliente.' : ''}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`;
    setLastOrderLink(whatsappUrl); 
    window.open(whatsappUrl, '_blank');
    setStep('success');
  };

  // --- COMPONENTE DE RECIBO VISUAL (NOTINHA CORRIGIDA) ---
  const OrderReceipt = () => {
    let grossService = selection.service.basePrice;
    if(selection.upgrade) grossService += selection.service.basePrice * 0.5;
    if(selection.useTable) grossService += 20;
    if(selection.aroma) grossService += getAromaPrice();

    let fee = selection.location.fee || 0;
    let discount = 0;
    if (selection.coupon) {
        if (selection.coupon.type === 'percent') discount = grossService * (selection.coupon.value / 100);
        else discount = selection.coupon.value;
    }
    
    // Total Visual (Sem Juros)
    const totalVisual = grossService + fee - discount;

    return (
        <div className="mt-8 mx-2 mb-64 bg-white text-black rounded-[10px] p-6 font-mono text-sm shadow-2xl relative animate-slide-up transform rotate-1">
            <div className="absolute top-0 left-0 right-0 h-4 bg-white" style={{background: 'linear-gradient(45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%)', backgroundSize: '12px 20px', backgroundPosition: '0 -10px'}}></div>
            
            <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4 mt-2">
                <h3 className="font-bold text-lg uppercase tracking-wider">Massagens Relaxantes</h3>
                <p className="text-xs text-gray-500">Resumo do Pedido</p>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                    <span>{selection.service.name}</span>
                    <span>{formatCurrency(selection.service.basePrice)}</span>
                </div>
                {selection.upgrade && <div className="flex justify-between text-gray-600 text-xs"><span>+ 30 Minutos</span><span>{formatCurrency(selection.service.basePrice * 0.5)}</span></div>}
                {selection.useTable && <div className="flex justify-between text-gray-600 text-xs"><span>+ Maca Portátil</span><span>R$ 20,00</span></div>}
                {selection.aroma && <div className="flex justify-between text-gray-600 text-xs"><span>+ Aromaterapia (Vip)</span><span>{getAromaPrice() === 0 ? 'GRÁTIS' : formatCurrency(getAromaPrice())}</span></div>}
                
                {/* Lógica de Taxa Pendente */}
                {selection.location.isPending ? (
                    <div className="flex justify-between text-blue-600 font-bold border-t border-dashed border-gray-200 pt-2 mt-2">
                        <span>Taxa Deslocamento</span>
                        <span>A Combinar</span>
                    </div>
                ) : (
                    fee > 0 && (
                        <div className="flex justify-between text-blue-600 font-bold border-t border-dashed border-gray-200 pt-2 mt-2">
                            <span>{selection.location.isMotel ? 'Taxa Suíte (Motel)' : 'Uber/Deslocamento'}</span>
                            <span>{formatCurrency(fee)}</span>
                        </div>
                    )
                )}
                
                {discount > 0 && (
                    <div className="flex justify-between text-red-500">
                        <span>Desconto ({selection.coupon.code})</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                )}
            </div>

            <div className="border-t-2 border-black pt-4 flex justify-between items-end">
                <span className="font-bold text-xl">TOTAL</span>
                <div className="text-right">
                    <span className="font-bold text-2xl">{formatCurrency(selection.paymentMethod === 'credit_card' ? calcFinalPrice() : totalVisual)}</span>
                    {selection.paymentMethod === 'credit_card' && <p className="text-[10px] text-gray-500">c/ juros maquininha</p>}
                    {selection.location.isPending && <p className="text-[10px] text-blue-600">+ Taxa a combinar</p>}
                </div>
            </div>
            
            <div className="mt-6 text-center text-[10px] text-gray-400 uppercase">
                Obrigado pela preferência
            </div>
        </div>
    )
  }

  // --- MENU HAMBURGUER (MODAL) ---
  const HamburgerMenu = () => {
      if(!showMenu) return null;
      return (
          <div className="absolute top-16 right-6 w-52 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden animate-slide-up origin-top-right">
              <button onClick={() => { setShowFaq(true); setShowMenu(false); }} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5 active:bg-white/20">
                  <HelpCircle className="w-4 h-4 text-gray-400"/> Ajuda / Conduta
              </button>
              <a href="https://instagram.com/thalymassagens" target="_blank" onClick={() => setShowMenu(false)} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5 active:bg-white/20">
                  <Instagram className="w-4 h-4 text-[#E1306C]"/> Instagram
              </a>
              <button onClick={() => { handleShare(); setShowMenu(false); }} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5 active:bg-white/20">
                  <Share2 className="w-4 h-4 text-gray-400"/> Compartilhar
              </button>
              <button onClick={() => { handleReset(); }} className="px-4 py-4 text-left text-[14px] text-red-500 hover:bg-red-500/10 flex items-center gap-3 active:bg-red-500/20">
                  <LogOut className="w-4 h-4"/> Sair (Pânico)
              </button>
          </div>
      )
  }

  // --- HEADER GLOBAL FIXO (COM MENU BURGER) ---
  const GlobalHeader = () => (
      <div className="absolute top-0 w-full z-50 px-6 pt-12 pb-8 flex justify-between items-center pointer-events-none bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="pointer-events-auto">
             {step !== 'home' && step !== 'success' ? (
                <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10 bg-black/20 backdrop-blur-md border border-white/5"><IconBack /></button>
             ) : (
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">{new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric'})}</span>
             )}
          </div>

          <div className="flex items-center gap-3 pointer-events-auto relative">
              {/* Notificações */}
              <button onClick={() => setShowNotifications(true)} className="relative w-10 h-10 rounded-full bg-[#1C1C1E]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 active:scale-95 transition-all">
                  <Bell className="w-5 h-5"/>
                  {loyalty.notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white border-2 border-[#1C1C1E]">
                          {loyalty.notifications.filter(n => !n.read).length}
                      </span>
                  )}
              </button>
              
              {/* Menu Hamburguer */}
              <button onClick={() => setShowMenu(!showMenu)} className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-95 ${showMenu ? 'bg-white text-black' : 'bg-[#1C1C1E]/80 text-gray-400'}`}>
                  {showMenu ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
              </button>

              {/* Dropdown Menu */}
              <HamburgerMenu />
          </div>
      </div>
  );

  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-6 font-sans text-gray-200 bg-black" onClick={() => { if(showMenu) setShowMenu(false); }}>
      <style>{globalStyles}</style>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
          <div className="relative w-16 h-16 mb-8">
             <div className="absolute inset-0 rounded-full border-4 border-[#0A84FF]/20"></div>
             <div className="absolute inset-0 rounded-full border-4 border-t-[#0A84FF] animate-spin-slow"></div>
          </div>
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#0A84FF] animate-pulse uppercase">Carregando</span>
        </div>
      ) : (
      <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] aurora-bg">
        
        <GlobalHeader />

        {/* --- HOME --- */}
        {step === 'home' && (
          <div className="flex-1 p-6 overflow-y-auto pb-32 pt-32" ref={homeRef}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-2">Massagens Relaxantes<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A84FF] to-[#5AC8FA] text-2xl">em Santa Fé do Sul e Região</span></h1>
              <p className="text-gray-400 text-[15px]">{weatherHint}</p>
            </div>

            <LoyaltyCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            <LiveStatus />

            <div className="mb-3 px-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Resumo das Sessões</div>
            <ReviewsCarousel />
            
            <div className="mt-4">
              <button onClick={handleQuickSchedule} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] shadow-lg flex justify-center items-center gap-2 text-[17px]">
                Agendar Sessão <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* --- IDENTITY --- */}
        {step === 'identity' && (
          <div className="flex-1 p-6 pt-36 animate-fade-in flex flex-col h-full pb-32">
            {selection.service && (
                <div className="mb-8 ios-card p-4 rounded-[20px] flex items-center justify-between border-l-2 border-l-[#0A84FF]">
                  <div>
                    <h3 className="font-bold text-white text-[15px]">{selection.service.name}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">{selection.service.labelDuration}</p>
                  </div>
                  <span className="text-[15px] font-bold text-[#0A84FF]">{formatCurrency(selection.service.basePrice)}</span>
                </div>
            )}

            <h2 className="text-3xl font-bold text-white mb-2">Quem é você?</h2>
            <p className="text-gray-400 text-[15px] mb-8">Para manter a segurança e exclusividade.</p>
            
            <div className="space-y-6 flex-1">
              <div className="ios-card p-6 rounded-[24px]">
                <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider block mb-2">Seu Nome</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent text-white text-[22px] font-medium placeholder:text-gray-600 border-b border-white/10 py-2 focus:border-[#0A84FF] transition-colors" placeholder="Digite seu nome..." />
              </div>

              <div className="space-y-3">
                <button onClick={() => { triggerHaptic(); setUser({...user, isAdult: !user.isAdult}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isAdult && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[16px] font-medium ${user.isAdult ? 'text-white' : 'text-gray-400'}`}>Maior de 18 anos</span>
                </button>
                <button onClick={() => { triggerHaptic(); setUser({...user, isMassagemOk: !user.isMassagemOk}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user.isMassagemOk ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isMassagemOk ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isMassagemOk && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[16px] font-medium ${user.isMassagemOk ? 'text-white' : 'text-gray-400'}`}>Liberado para massagem</span>
                </button>
              </div>

              <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] text-[17px] disabled:opacity-50 shadow-lg mt-4">Continuar</button>
            </div>
          </div>
        )}

        {/* --- SERVICES --- */}
        {step === 'services' && (
          <div className="flex-1 p-6 pt-36 overflow-y-auto pb-32 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Menu</h2>
            <div className="space-y-6">
              {services.map(s => (
                <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className={`ios-card p-6 rounded-[30px] active:scale-98 transition-transform group relative overflow-hidden`}>
                  {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-[20px]">{s.highlight}</div>}
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-[22px] leading-tight mb-1">{s.name}</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[#0A84FF] font-bold text-[18px]">{formatCurrency(s.basePrice)}</span>
                       <span className="text-gray-500 text-[13px]">• {s.labelDuration}</span>
                    </div>
                  </div>
                  <p className="text-[15px] text-gray-300 leading-relaxed mb-5 opacity-90">{s.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {s.details.slice(0,4).map((d, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                            <div className="w-1 h-1 rounded-full bg-[#0A84FF]"></div> 
                            <span className="text-[11px] text-gray-300 font-medium">{d}</span>
                        </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONFIGURE --- */}
        {step === 'configure' && selection.service && (
          <div className="flex-1 p-6 pt-36 overflow-y-auto pb-64 animate-fade-in scrollbar-hide"> 
            <div className="ios-card p-5 rounded-[22px] mb-8 flex items-center justify-between border-l-4 border-l-[#0A84FF]">
              <div>
                <h3 className="font-bold text-white text-[17px]">{selection.service.name}</h3>
                <p className="text-[13px] text-gray-400 mt-0.5">Configuração Personalizada</p>
              </div>
            </div>

            <div className="space-y-10">
              <section>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Data e Hora</h4>
                <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />
              </section>

              <section ref={locationRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Local de Atendimento</h4>
                <div className="space-y-3">
                  {locations.map(l => {
                    if (selection.location && selection.location.id !== l.id) return null;
                    return (
                    <div key={l.id} className="animate-fade-in">
                        <button onClick={() => { triggerHaptic(); setSelection({...selection, location: l, useTable: null}); scrollTo(vibeRef); }} className={`w-full p-5 rounded-[22px] border text-left transition-all duration-300 ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-white text-[16px]">{l.label}</span> 
                            {l.fee > 0 && <span className="text-[10px] font-bold text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-1 rounded border border-[#FFD60A]/20">+ {formatCurrency(l.fee)}</span>}
                          </div>
                          <p className="text-[13px] text-gray-500">{l.sublabel}</p>
                        </button>
                        
                        {selection.location?.id === l.id && l.id === 'santa-fe' && l.allowsTableChoice && (
                          <div ref={surfaceRef} className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                            <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === false ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>🛏 Na Cama</button>
                            <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === true ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>💆‍♂️ Maca (+20)</button>
                          </div>
                        )}
                        {selection.location?.id === l.id && l.id === 'outras-cidades' && (
                            <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Digite o nome da cidade..." className="mt-3 w-full bg-[#1C1C1E] p-4 rounded-[18px] border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0A84FF] transition-all animate-fade-in" />
                        )}
                        {selection.location && (
                           <button onClick={() => setSelection({...selection, location: null, useTable: null, city: ''})} className="mt-3 w-full py-2 text-[12px] text-gray-500 underline">Alterar Local</button>
                        )}
                    </div>
                  )})}
                </div>
              </section>

              <div ref={vibeRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Vibe Sonora</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   {musicVibes.map(vibe => (
                      <button key={vibe} onClick={() => { setSelection({...selection, music: vibe}); scrollTo(extrasRef); }} className={`px-6 py-3 rounded-[14px] border text-[13px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${selection.music === vibe ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>
                        {vibe}
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-3" ref={extrasRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 mt-8">Extras Premium</h4>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, upgrade: !selection.upgrade}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">+30 Minutos</p><p className="text-[11px] text-gray-500">Mais tempo para curtir</p></div>
                  <span className="text-[#0A84FF] font-bold text-[15px]">+ {formatCurrency(selection.service.basePrice * 0.5)}</span>
                </button>

                <button onClick={() => { triggerHaptic(); setSelection({...selection, aroma: !selection.aroma}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">Aromaterapia</p><p className="text-[11px] text-gray-500">Óleos essenciais</p></div>
                  <div className="text-right">
                      {getAromaPrice() < 10 ? (
                          <><span className="text-gray-500 line-through text-[11px] mr-2">R$ 10</span><span className="text-[#30D158] font-bold text-[15px]">{getAromaPrice() === 0 ? 'GRÁTIS' : `+${formatCurrency(getAromaPrice())}`}</span></>
                      ) : (<span className="text-[#0A84FF] font-bold text-[15px]">+ R$ 10</span>)}
                  </div>
                </button>
              </div>

              <CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(code) => { setSelection({...selection, coupon: SYSTEM_COUPONS[code]}); scrollTo(paymentRef); }} onRemove={() => setSelection({...selection, coupon: null})} onAddManual={handleAddManualCoupon}/>

              <div className="mt-6" ref={paymentRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pagamento</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <QrCode className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Pix</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <Banknote className="w-6 h-6 text-[#30D158]" /><span className="text-[13px] font-bold text-white">Dinheiro</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'debit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'debit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Débito</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-[#FFD60A]" /><span className="text-[13px] font-bold text-white">Crédito</span>
                  </button>
                </div>
                
                {selection.paymentMethod === 'credit_card' && (
                  <div className="mt-3 ios-card p-4 rounded-[16px] animate-fade-in">
                    <label className="text-[11px] text-gray-400 block mb-2 font-bold uppercase">Parcelamento</label>
                    <select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#000] border border-white/10 text-white text-[15px] rounded-xl p-3 focus:border-[#0A84FF]">
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
            <div className="h-12 bg-gradient-to-t from-[#000] to-transparent pointer-events-none"></div>
            <div className="bg-[#1C1C1E] rounded-t-[32px] p-5 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
              <div className="flex justify-between items-center mb-4 px-1">
                  <div className="flex flex-col"><span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Final</span></div>
                  <div className="text-right">
                      <span className="text-[26px] font-bold text-white tracking-tight">
                        {selection.location.isPending ? formatCurrency(calcFinalPrice()) + ' + Taxa' : formatCurrency(calcFinalPrice())}
                      </span>
                      <p className="text-[10px] text-gray-500 leading-none mt-1">{selection.location.isMotel ? '(Inclui Taxa do Motel)' : selection.location.isUber ? '(Inclui Uber)' : selection.location.isPending ? '(Taxa de deslocamento à parte)' : 'Total Estimado'}</p>
                  </div>
              </div>
              <button disabled={!canFinalize} onClick={handleWhatsApp} className="w-full bg-[#0A84FF] hover:bg-[#007AFF] active:scale-[0.98] transition-all text-white font-bold py-4 rounded-[18px] shadow-[0_4px_20px_rgba(10,132,255,0.4)] flex justify-center items-center gap-2 text-[16px] disabled:opacity-50 disabled:shadow-none">CONFIRMAR NO WHATSAPP</button>
            </div>
          </div>
        )}

        {/* TELA SUCESSO */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in pb-32">
            <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.4)] animate-scale"><Check className="w-10 h-10 text-white stroke-[3px]"/></div>
            <h2 className="text-3xl font-bold text-white mb-2">Pedido Enviado!</h2>
            <p className="text-gray-400 mb-8 text-[15px]">Verifique seu WhatsApp.</p>
            <div className="w-full mb-8 bg-[#1C1C1E] p-4 rounded-[20px] border border-white/10 text-left">
                <LevelProgressBar data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            </div>
            <button onClick={() => window.open(lastOrderLink, '_blank')} className="mb-4 w-full flex items-center justify-center gap-2 text-[15px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 py-3.5 rounded-xl border border-[#0A84FF]/20 hover:bg-[#0A84FF]/20 transition-colors"><Send className="w-4 h-4"/> Reenviar Mensagem</button>
            <button onClick={handleReset} className="w-full py-4 text-gray-500 text-[14px] font-medium">Voltar ao Início</button>
          </div>
        )}

        {/* FAQ MODAL */}
        {showFaq && (
          <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-5">
            <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[32px] p-8 border border-white/10 shadow-2xl animate-scale">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-[#0A84FF]"/> Ajuda & Informações</h3>
              <div className="space-y-5 text-[15px] text-gray-300 leading-relaxed">
                <div><h4 className="font-bold text-white mb-1 flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400"/> Conduta</h4><p className="text-sm">Apenas massagem terapêutica e relaxante. Sem sexo, sem oral. Respeito acima de tudo.</p></div>
                <div><h4 className="font-bold text-white mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400"/> Locais</h4><p className="text-sm">Atendimento em Suítes (Motel), Domicílio (Santa Fé) ou Cidades Vizinhas (a combinar).</p></div>
                <div><h4 className="font-bold text-white mb-1 flex items-center gap-2"><Tag className="w-4 h-4 text-gray-400"/> Cupons & Descontos</h4><p className="text-sm">Cupons são de uso único. Descontos de nível (Aromaterapia) são aplicados automaticamente.</p></div>
                <div className="pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-3">⚠️ Atenção: Limpar dados apagará seu progresso e nível.</p>
                    <button onClick={() => { if(window.confirm("Tem certeza? Você perderá todo o seu progresso e nível VIP.")) { localStorage.clear(); window.location.reload(); }}} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4"/> Limpar Dados do App</button>
                </div>
              </div>
              <button onClick={() => setShowFaq(false)} className="mt-6 w-full bg-[#3A3A3C] text-white py-4 rounded-[18px] font-bold hover:bg-[#4A4A4C] transition-colors">Fechar</button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS MODAL */}
        {showNotifications && (
          <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-5" onClick={() => setShowNotifications(false)}>
            <div className="bg-[#1C1C1E] w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 border-t sm:border border-white/10 shadow-2xl animate-slide-up h-[75vh] sm:h-[600px] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">Notificações</h3>
                  <button onClick={() => { setLoyalty(p => ({...p, notifications: p.notifications.map(n => ({...n, read: true}))})); setShowNotifications(false); }} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1 scrollbar-hide">
                {loyalty.notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500"><Bell className="w-12 h-12 mb-4 opacity-20"/><p>Nenhuma notificação recente.</p></div>
                ) : (
                    loyalty.notifications.map(n => (
                        <div key={n.id} className="p-4 rounded-[20px] bg-[#2C2C2E] border border-white/5 flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.icon === 'level' ? 'bg-[#FFD60A]/20 text-[#FFD60A]' : n.icon === 'coupon' ? 'bg-[#FF375F]/20 text-[#FF375F]' : 'bg-[#0A84FF]/20 text-[#0A84FF]'}`}>
                                {n.icon === 'calendar' ? <Calendar className="w-5 h-5"/> : n.icon === 'level' ? <Crown className="w-5 h-5"/> : n.icon === 'coupon' ? <Tag className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start"><h4 className="font-bold text-white text-[15px] mb-1">{n.title}</h4>{!n.read && <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>}</div>
                                <p className="text-[13px] text-gray-400 leading-snug">{n.message}</p>
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
