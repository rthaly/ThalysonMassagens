import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, Siren, Send, ThumbsUp, Car
} from 'lucide-react';

// --- ESTILOS GLOBAIS ---
const globalStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.015em;
  color: #fff;
  background: #000;
}
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
input, select { user-select: text; font-size: 17px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; -webkit-touch-callout: none; }

/* Background Premium */
.aurora-bg {
  background: radial-gradient(140% 100% at 50% 0%, rgba(20, 20, 30, 0.5), transparent 50%), #000000;
  background-attachment: fixed;
  background-size: cover;
}

/* Glassmorphism Refinado */
.ios-card { 
  background: rgba(28, 28, 30, 0.65); 
  backdrop-filter: blur(40px) saturate(180%); 
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.ios-header { 
  background: rgba(0, 0, 0, 0.85); 
  backdrop-filter: blur(20px); 
  border-bottom: 0.5px solid rgba(255,255,255,0.1); 
}

/* Botões Interativos */
.ios-btn { 
  background: rgba(255, 255, 255, 0.06); 
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); 
}
.ios-btn:active { transform: scale(0.97); background: rgba(255, 255, 255, 0.12); }

.ios-btn-primary {
  background: linear-gradient(180deg, #0A84FF 0%, #0056B3 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255,255,255,0.2);
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }

/* Inputs Customizados */
.custom-input {
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}
.custom-input:focus { border-color: #0A84FF; box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2); }

/* Animações */
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const IconBack = () => <ChevronLeft className="w-6 h-6 text-[#0A84FF]" />;

// --- DADOS E CONFIGURAÇÕES ---
const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

const services = [
  { 
    id: 'masculina', name: 'Massagem Masculina', type: 'sensual',
    description: 'Massagem Relaxante + Toques corpo a corpo (de cueca) com finalização Lingam manual completa.', 
    labelDuration: '60 min', minutes: 60, basePrice: 100, 
    highlight: "🔥 A MAIS PEDIDA", ratings: 5.0, reviews: 310, 
    details: ["🔥 Relaxante + Body-to-Body", "🩲 Massagista de Cueca", "🍆 Lingam / Finalização Manual", "💦 Alívio Completo"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    description: 'Corpo inteiro: Costas, braços, mãos, pernas, coxas, pés, peito e frente. (Sem toques íntimos e sem glúteos).', 
    labelDuration: '60 min', minutes: 60, basePrice: 75, 
    ratings: 4.9, reviews: 142, 
    details: ["💆‍♂️ Corpo Inteiro", "🚫 Sem Glúteos/Íntimo", "✋ Toque Terapêutico", "☮️ Relaxamento Puro"] 
  },
];

const locations = [
  { 
    id: 'motel', 
    label: 'Suíte Privada (Motel)', 
    sublabel: 'Vou com você (Taxa R$75 inclusa)', 
    fee: 75, // Pago no local
    allowsTableChoice: false, 
    estimatedTravelTime: '10-15 min' 
  },
  { 
    id: 'santa-fe', 
    label: 'Santa Fé do Sul', 
    sublabel: 'No conforto do seu lar (Uber R$40)', 
    fee: 40, // Taxa Uber
    allowsTableChoice: true, 
    estimatedTravelTime: '15-20 min' 
  },
  { 
    id: 'outras-cidades', 
    label: 'Cidades Vizinhas', 
    sublabel: 'Atendimento na região', 
    fee: 0, 
    allowsTableChoice: false, 
    estimatedTravelTime: 'A combinar', 
    input: true 
  },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (Primeira Vez)' },
  'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF Especial' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
  'NIVELPRATA': { code: 'NIVELPRATA', type: 'fixed', value: 15, desc: 'R$ 15,00 OFF (Prata)' },
  'NIVELOURO': { code: 'NIVELOURO', type: 'fixed', value: 25, desc: 'R$ 25,00 OFF (Ouro)' },
  'NIVELDIAMANTE': { code: 'NIVELDIAMANTE', type: 'fixed', value: 50, desc: 'R$ 50,00 OFF (Diamante)' },
};

const LEVELS = [
  { 
    name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', 
    perks: ["Acesso ao App VIP", "Agendamento Digital", "Histórico Seguro", "Suporte Básico"] 
  },
  { 
    name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', 
    perks: ["Cupom R$ 15 OFF (Ganhou!)", "Aromaterapia 50% OFF (Automático)", "Prioridade na Fila"] 
  },
  { 
    name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', 
    perks: ["Cupom R$ 25 OFF (Ganhou!)", "Aromaterapia GRÁTIS (Automático)", "Agenda Noturna VIP"] 
  },
  { 
    name: 'Diamante', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', 
    perks: ["Cupom R$ 50 OFF (Ganhou!)", "Mimo Surpresa", "Prioridade Absoluta", "Concierge Pessoal"] 
  },
];

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const musicVibes = ['Silêncio 🤫', 'Zen 🧘', 'Natureza 🌿']; 

const REVIEWS_DB = [
  { t: "Sou casado, sigilo foi absoluto. A finalização foi de tremer as pernas.", a: "R.S.", r: 5 },
  { t: "Nunca senti nada igual. Gemi sem vergonha nenhuma, que alívio!", a: "Anônimo", r: 5 },
  { t: "Toque macio e firme ao mesmo tempo. A explosão no final foi incrível.", a: "Carlos", r: 5 },
  { t: "Mãos de fada. Fiquei muito à vontade, gozei muito no final.", a: "M.V.", r: 5 },
  { t: "Sensação única. O corpo a corpo me deixou louco.", a: "Empresário Sigiloso", r: 5 }
];

// --- UTILS ---
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(8); };
const generateBookingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// --- COMPONENTES UI ---

const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  const msgs = ["Carlos agendou Massagem Masculina", "Vagas da noite acabando", "Atendimento em Suíte finalizado"];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%msgs.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-in flex items-center gap-2 bg-[#1C1C1E] border border-white/5 rounded-full px-4 py-1.5 shadow-xl">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[11px] text-gray-400 font-medium tracking-wide">{msgs[idx]}</span>
      </div>
    </div>
  );
};

const LoyaltyCard = ({ data, privacyMode, onTogglePrivacy }) => {
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => data.totalSpent >= l.min);
  const currentLevel = LEVELS[LEVELS.length - 1 - currentLevelIdx];
  const nextLevel = LEVELS[LEVELS.length - 1 - currentLevelIdx + 1];
  const spent = data.totalSpent || 0;
  const min = currentLevel.min || 0;
  const nextMin = nextLevel ? nextLevel.min : min + 1;
  const rawProgress = ((spent - min) / (nextMin - min)) * 100;
  const progress = nextLevel ? Math.min(100, Math.max(0, rawProgress)) : 100;

  return (
    <div className="ios-card p-6 rounded-[28px] relative overflow-hidden mb-6 group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A84FF]/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#0A84FF]/20 transition-all"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-[10px] text-[#0A84FF] font-black uppercase tracking-[0.2em] mb-1">Status Vip</p>
          <h3 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
             {currentLevel.name} {currentLevel.icon}
          </h3>
        </div>
        <div className="text-right">
          <button onClick={onTogglePrivacy} className="flex items-center justify-end gap-1.5 mb-1 text-gray-500 hover:text-white transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-wider">Investido</span>
            {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <p className={`text-xl font-mono text-white ${privacyMode ? 'blur-md select-none opacity-50' : ''} transition-all duration-300`}>
            {formatCurrency(data.totalSpent)}
          </p>
        </div>
      </div>
      
      <div className="relative h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden z-10">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#007AFF] to-[#5AC8FA] rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="flex justify-between text-[11px] text-gray-500 relative z-10 font-medium">
        <span>Economia: <span className="text-green-500">{formatCurrency(data.totalSaved)}</span></span>
        {nextLevel ? (
            <span>Próximo: {formatCurrency(nextLevel.min)}</span>
        ) : (
            <span className="text-[#FFD60A] animate-pulse">👑 Nível Máximo</span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
          {currentLevel.perks.slice(0, 4).map((perk, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <CheckCircle2 className="w-3 h-3 text-[#0A84FF]" /> {perk}
              </div>
          ))}
      </div>
    </div>
  );
};

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 4000); return () => clearInterval(t); }, []);
  const currentReview = REVIEWS_DB[idx];
  
  return (
    <div className="ios-card p-0 rounded-[20px] relative overflow-hidden h-28 flex items-center justify-center mb-6 border-l-2 border-l-[#0A84FF]">
      <div key={idx} className="absolute inset-0 p-5 flex flex-col items-center justify-center animate-fade-in">
        <div className="flex gap-0.5 mb-2">
          {[...Array(5)].map((_,k) => <Star key={k} className={`w-3.5 h-3.5 ${k < currentReview.r ? 'text-[#FFD60A] fill-[#FFD60A]' : 'text-gray-700'}`}/>)}
        </div>
        <p className="text-[13px] text-gray-200 text-center font-medium leading-relaxed italic">"{currentReview.t}"</p>
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
  const currentMonthName = days[0]?.toLocaleDateString('pt-BR', { month: 'long' });

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
      {currentMonthName && <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">{currentMonthName}</h3>}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-4">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate();
          const label = getDayLabel(d);
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} className={`flex flex-col items-center justify-center min-w-[64px] h-[76px] rounded-[18px] transition-all duration-300 ${isSel ? 'bg-[#0A84FF] text-white shadow-lg scale-105' : 'ios-btn text-gray-400'}`}>
              <span className={`text-[11px] uppercase font-bold tracking-wide opacity-80 ${label === 'HOJE' ? 'text-green-400' : ''}`}>{label}</span>
              <span className="text-2xl font-semibold mt-1">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="grid grid-cols-4 gap-3 animate-fade-in">
          {timeSlots.map(t => {
            const blocked = isTimeBlocked(t, selectedDate);
            return (
              <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                className={`py-3 rounded-[14px] text-[13px] font-semibold transition-all duration-200 ${selectedTime === t ? 'bg-[#0A84FF] text-white shadow-md' : blocked ? 'bg-white/5 text-gray-600' : 'ios-btn text-gray-300'}`}>
                {blocked ? <Lock className="w-3.5 h-3.5 mx-auto opacity-30" /> : t}
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
              alert('Você já resgatou este cupom!');
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
        <h4 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide">Cupons & Descontos</h4>
      </div>
      <div className="flex gap-2 mb-3">
          <input 
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Cód. Promocional" 
            className="w-full custom-input text-white text-[15px] rounded-[16px] p-4 placeholder:text-gray-600"
          />
          <button onClick={handleManualAdd} className="bg-[#2C2C2E] border border-white/10 text-white px-6 rounded-[16px] font-bold text-[13px] hover:bg-[#3A3A3C] transition-colors">Adicionar</button>
      </div>
      {myCoupons.length > 0 ? (
        <div className="space-y-3">
          {myCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <button key={coupon.code} onClick={() => { triggerHaptic(); isApplied ? onRemove() : onApply(coupon.code); }} className={`w-full p-4 rounded-[18px] flex justify-between items-center transition-all duration-300 ${isApplied ? 'bg-[#0A84FF]/15 border border-[#0A84FF] shadow-lg' : 'ios-btn'}`}>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-white bg-[#2C2C2E] px-2 py-1 rounded-md tracking-wider">{coupon.code}</span>
                    {isApplied && <span className="text-[10px] text-[#0A84FF] font-bold">ATIVO</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{coupon.desc}</p>
                </div>
                {isApplied ? <X className="w-5 h-5 text-gray-400" /> : <span className="text-[11px] bg-[#0A84FF] text-white px-3 py-1.5 rounded-full font-bold">Usar</span>}
              </button>
            )
          })}
        </div>
      ) : (
          <div className="p-4 rounded-[18px] border border-dashed border-white/10 text-center">
              <p className="text-[12px] text-gray-500">Seu inventário de cupons está vazio.</p>
              <p className="text-[10px] text-gray-600">Suba de nível para ganhar novos cupons.</p>
          </div>
      )}
    </div>
  );
};

const Notifications = ({ notifications, onClear }) => {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  useEffect(() => {
    const close = () => setOpen(false);
    if(open) window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [open]);

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button onClick={() => { setOpen(!open); if(!open && unread > 0) onClear(); }} className="relative p-2.5 rounded-full bg-[#1C1C1E] active:bg-[#2C2C2E] transition-colors">
        <Bell className="w-6 h-6 text-white" />
        {unread > 0 && <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-[#1C1C1E]" />}
      </button>
      {open && (
        <div className="absolute top-14 right-0 w-80 bg-[#121214] border border-white/10 shadow-2xl rounded-[20px] overflow-hidden z-[100] animate-scale">
           <div className="p-4 border-b border-white/10 bg-[#1C1C1E] flex justify-between items-center">
             <h4 className="font-semibold text-white text-sm">Notificações</h4>
             <button onClick={() => setOpen(false)} className="p-1"><X className="w-4 h-4 text-gray-400"/></button>
           </div>
           <div className="max-h-64 overflow-y-auto p-2">
             {notifications.length === 0 ? (
               <div className="p-6 text-center text-gray-500 text-sm">Nenhuma novidade.</div>
             ) : (
               notifications.map(n => (
                 <div key={n.id} className="p-3 mb-1 rounded-xl bg-white/5">
                   <div className="flex justify-between">
                      <p className="text-sm font-semibold text-white mb-0.5">{n.title}</p>
                      <span className="text-[10px] text-gray-500">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                   </div>
                   <p className="text-xs text-gray-400 leading-snug">{n.message}</p>
                 </div>
               ))
             )}
           </div>
        </div>
      )}
    </div>
  );
};

// --- APP PRINCIPAL ---
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

  const scrollTo = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 300); 
  };
    
  // State
  const [loyalty, setLoyalty] = useState(() => {
    const saved = localStorage.getItem('thaly_system_v70'); 
    return saved ? JSON.parse(saved) : { savedName: '', avatar: '😎', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], history: [] };
  });

  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
  const [showFaq, setShowFaq] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true); // Começa com olho fechado
  const [greeting, setGreeting] = useState("");
  const [weatherHint, setWeatherHint] = useState("");
  const [lastOrderLink, setLastOrderLink] = useState(""); 
    
  const surfaceRef = useRef(null);

  // Init
  useEffect(() => { setTimeout(() => setLoading(false), 2000); }, []);

  useEffect(() => {
    localStorage.setItem('thaly_system_v70', JSON.stringify(loyalty));
    if (loyalty.savedName) {
        setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true}));
    }
  }, [loyalty]);

  useEffect(() => {
    const hr = new Date().getHours();
    setGreeting(hr < 12 ? "Bom dia" : hr < 18 ? "Boa tarde" : "Boa noite");
    setWeatherHint(hr < 18 ? "☀️ Dia ideal para relaxar, vamos?" : "🌙 Noite perfeita para relaxar, vamos?"); 
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

  const handleCopyPix = () => { navigator.clipboard.writeText("62922530000144"); alert("CNPJ Pix Copiado!"); }; 
  const handlePanic = () => { window.location.href = "https://google.com"; };
  const handleShare = () => { if(navigator.share) navigator.share({title:'Thalyson Massagens', text:'Agende agora', url: window.location.href}); };

  const handleAddManualCoupon = (code) => {
      if (!loyalty.inventory.includes(code)) {
          setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]}));
          triggerHaptic();
      } else {
          alert('Você já possui este cupom!');
      }
  };

  // --- BENEFÍCIOS REAIS AUTOMÁTICOS ---
  const getCurrentLevel = () => {
      return [...LEVELS].reverse().find(l => loyalty.totalSpent >= l.min) || LEVELS[0];
  };

  const getAromaPrice = () => {
      const level = getCurrentLevel().name;
      if (level === 'Ouro' || level === 'Diamante') return 0; // Grátis
      if (level === 'Prata') return 5; // 50% OFF
      return 10; // Normal
  };

  // Calculations
  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    
    // Adicionais (EXCETO UBER DO TOTAL FINAL DE SERVIÇO)
    if (selection.upgrade) total += selection.service.basePrice * 0.5;
    if (selection.useTable) total += 20;
    if (selection.aroma) total += getAromaPrice();
    if (selection.location?.fee && selection.location.id === 'santa-fe') total += selection.location.fee; // Uber entra no total cliente
    
    // Cupons
    if (selection.coupon) {
      if (selection.coupon.type === 'percent') total -= (total * selection.coupon.value / 100);
      else total -= selection.coupon.value;
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

    const finalPrice = calcFinalPrice();
    const oldTotal = loyalty.totalSpent;
    const newTotal = oldTotal + selection.service.basePrice; 
    const bookingId = generateBookingId(); 

    // --- LOGICA DE CUPOM (Consumir Cupom) ---
    let newInventory = [...loyalty.inventory];
    if (selection.coupon) {
        newInventory = newInventory.filter(c => c !== selection.coupon.code);
    }

    // --- CHECK LEVEL UP E GANHAR CUPOM ---
    const levelReached = [...LEVELS].reverse().find(l => newTotal >= l.min);
    if(levelReached && levelReached.rewardCode) {
        if (!newInventory.includes(levelReached.rewardCode)) {
            newInventory.push(levelReached.rewardCode);
        }
    }
    
    // --- GERAR NOTIFICAÇÃO ---
    const newNotification = {
        id: Date.now(),
        title: 'Pedido Enviado',
        message: 'Aguarde a confirmação no WhatsApp para garantir seu horário.',
        read: false,
        timestamp: Date.now()
    };

    // Loyalty Update
    setLoyalty(prev => ({ 
      ...prev, 
      savedName: user.name || prev.savedName, 
      totalSpent: newTotal, 
      totalSaved: prev.totalSaved + (selection.coupon ? 10 : 0) + (selection.aroma ? (10 - getAromaPrice()) : 0),
      inventory: newInventory,
      notifications: [newNotification, ...prev.notifications]
    }));

    const isToday = selection.date.getDate() === new Date().getDate();
    const dateStr = `${selection.date.toLocaleDateString('pt-BR')}${isToday ? ' (HOJE)' : ''}`;
    
    // Duration Logic
    let finalDuration = selection.service.labelDuration;
    if (selection.upgrade) {
        finalDuration = "60 min + 30 min (90 min total)";
    }
    
    let surfaceText = "";
    if (selection.location.allowsTableChoice) surfaceText = selection.useTable ? "✅ Levar Maca Portátil (+R$20)" : "🛏 Na Cama do Cliente";
    else if (selection.location.id === 'motel') surfaceText = ""; 
    else surfaceText = `🛏 Cama/Sofá em ${selection.city}`;

    let paymentText = "";
    if (selection.paymentMethod === 'pix') paymentText = "(Pix)";
    else if (selection.paymentMethod === 'cash') paymentText = "(Dinheiro)";
    else if (selection.paymentMethod === 'debit_card') paymentText = "(Débito)";
    else if (selection.paymentMethod === 'credit_card') {
        const parcelValue = finalPrice / selection.installments;
        paymentText = `(${selection.installments}x de ${formatCurrency(parcelValue)})`;
    }

    // --- CÁLCULOS DETALHADOS PARA WHATSAPP ---
    let grossService = selection.service.basePrice;
    if (selection.upgrade) grossService += selection.service.basePrice * 0.5;
    if (selection.useTable) grossService += 20;
    if (selection.aroma) grossService += getAromaPrice();

    let uberFee = 0;
    if (selection.location.id === 'santa-fe') {
        uberFee = 40; // Uber Santa Fé
    }

    let motelFee = 0;
    if (selection.location.id === 'motel') {
        motelFee = 75; // Pago no local
    }

    // Desconto
    let discountVal = 0;
    if (selection.coupon) {
      // Aplica desconto no valor do serviço bruto (sem uber/motel)
      if (selection.coupon.type === 'percent') discountVal = grossService * (selection.coupon.value / 100);
      else discountVal = selection.coupon.value;
    }

    // Líquido Massagista = Serviço + Extras - Desconto
    const masseurNet = grossService - discountVal;

    // Total Cliente Paga = Líquido Massagista + Uber (se houver)
    let clientPaysTotal = masseurNet + uberFee;
    
    let cardFee = 0;
    if (selection.paymentMethod === 'credit_card') {
       const rate = CARD_RATES[selection.installments] || 0;
       const totalWithCardFee = clientPaysTotal / (1 - rate);
       cardFee = totalWithCardFee - clientPaysTotal;
       clientPaysTotal = totalWithCardFee;
    }

    let msg = `✨ NOVO PEDIDO: #${bookingId}
👤 Cliente: ${user.name}
✅ Maior de 18 | ✅ Liberado p/ Massagem
📅 ${dateStr} às ${selection.time}
💆 ${selection.service.name}
⏱ Duração: ${finalDuration}
📍 Local: ${selection.location.label}
${surfaceText ? surfaceText : ''}
${selection.aroma ? `🌸 Com Aromaterapia (${getAromaPrice() === 0 ? 'Grátis VIP' : formatCurrency(getAromaPrice())})` : ''}

💰 RESUMO FINANCEIRO:
➡️ Valor Serviço + Extras: ${formatCurrency(grossService)}
${discountVal > 0 ? `🎫 Desconto Cupom: -${formatCurrency(discountVal)}` : ''}
${uberFee > 0 ? `🚗 Taxa Uber/Deslocamento: ${formatCurrency(uberFee)}` : ''}
${motelFee > 0 ? `⚠️ Taxa da Suíte: ${formatCurrency(motelFee)} (Pagar na SAÍDA)` : ''}
${cardFee > 0 ? `💳 Taxa Máquina: ${formatCurrency(cardFee)}` : ''}

💰 TOTAL CLIENTE: ${formatCurrency(clientPaysTotal)} ${paymentText}
(Líquido Massagista: ${formatCurrency(masseurNet)})

⏱️ Chegada estimada: ${selection.location.estimatedTravelTime || 'A combinar'}
------------------------------
Olá, aguardo confirmação para relaxar. (Via App Beta)`;

    msg = msg.replace(/^\s*[\r\n]/gm, "");
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`;
    setLastOrderLink(whatsappUrl); 
    window.open(whatsappUrl, '_blank');
    setStep('success');
  };

  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-6 font-sans text-gray-200 bg-black">
      <style>{globalStyles}</style>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#0A84FF] to-[#5E5CE6] rounded-[24px] flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(10,132,255,0.4)] animate-pulse">
            <div className="text-4xl">💆‍♂️</div>
          </div>
        </div>
      ) : (
      <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] aurora-bg">
        
        {/* HEADER FIXO */}
        {step !== 'home' && step !== 'success' && (
          <div className="absolute top-0 w-full z-30 ios-header px-6 pt-12 pb-4 flex justify-between items-center">
             <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10"><IconBack /></button>
            
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] text-[10px] font-bold border border-[#0A84FF]/20 animate-pulse">BETA</span>
              <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-[15px]">{user.name || loyalty.savedName || 'Visitante'}</span>
                  {loyalty.savedName && <button onClick={() => setStep('identity')} className="p-1 text-gray-500 hover:text-white"><Edit3 className="w-3.5 h-3.5"/></button>}
              </div>
              <Notifications notifications={loyalty.notifications} onClear={() => setLoyalty(p => ({...p, notifications: p.notifications.map(n => ({...n, read: true}))}))} />
            </div>
          </div>
        )}

        {/* --- HOME --- */}
        {step === 'home' && (
          <div className="flex-1 p-6 overflow-y-auto pb-28 pt-12" ref={homeRef}>
            {/* TOPO: PERFIL + FERRAMENTAS */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                  <h1 className="text-2xl font-bold text-white tracking-tight">Thalyson Massagens</h1>
                  <button onClick={handlePanic} className="w-8 h-8 rounded-full bg-[#2C1C1C] border border-red-500/20 flex items-center justify-center active:bg-red-900/40">
                       <LogOut className="w-4 h-4 text-red-500"/> 
                  </button>
              </div>
              <p className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-bold flex items-center gap-2 mb-4">
                  {greeting} <span className="text-lg">{loyalty.avatar}</span>
              </p>

              {/* QUICK ACTIONS ROW (ABAIXO DO CABEÇALHO) */}
              <div className="flex gap-2">
                  <button onClick={() => setShowFaq(true)} className="flex-1 flex items-center justify-center bg-[#1C1C1E] border border-white/10 py-2.5 rounded-lg gap-2 active:bg-[#333]">
                     <Shield className="w-3.5 h-3.5 text-gray-300"/> 
                     <span className="text-[10px] font-bold text-gray-300">Conduta</span>
                  </button>
                  <button onClick={handleShare} className="flex-1 flex items-center justify-center bg-[#1C1C1E] border border-white/10 py-2.5 rounded-lg gap-2 active:bg-[#333]">
                     <Share2 className="w-3.5 h-3.5 text-gray-300"/> 
                     <span className="text-[10px] font-bold text-gray-300">Compartilhar</span>
                  </button>
                   <a href="https://instagram.com/thalymassagens" target="_blank" className="flex-1 flex items-center justify-center bg-[#1C1C1E] border border-white/10 py-2.5 rounded-lg gap-2 active:bg-[#333]">
                     <Instagram className="w-3.5 h-3.5 text-[#E1306C]"/> 
                     <span className="text-[10px] font-bold text-gray-300">Instagram</span>
                  </a>
              </div>
            </div>

            <LoyaltyCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            <LiveStatus />

            <div className="flex justify-between items-center mb-6 px-1">
              <span className="text-[11px] font-semibold text-gray-400 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-md">{weatherHint}</span>
            </div>

            <ReviewsCarousel />
            
            {/* CTA FLUTUANTE NO FINAL DA ROLAGEM */}
            <div className="mt-4">
              <button onClick={handleQuickSchedule} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] shadow-lg flex justify-center items-center gap-2 text-[17px]">
                Agendar Sessão <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* --- IDENTITY --- */}
        {step === 'identity' && (
          <div className="flex-1 p-6 pt-32 animate-fade-in flex flex-col h-full">
            <h2 className="text-3xl font-bold text-white mb-2">Identificação</h2>
            <p className="text-gray-400 text-[15px] mb-8">Precisamos saber quem é você para confirmar.</p>
            
            <div className="space-y-6 flex-1">
              <div className="ios-card p-5 rounded-[22px]">
                <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider block mb-2">Seu Nome</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent text-white text-[19px] font-medium placeholder:text-gray-600 border-b border-white/10 py-2 focus:border-[#0A84FF] transition-colors" placeholder="Digite seu nome..." />
              </div>

              <div className="space-y-3">
                <button onClick={() => { triggerHaptic(); setUser({...user, isAdult: !user.isAdult}); }} className={`w-full p-5 rounded-[20px] border flex items-center gap-4 transition-all duration-300 ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-500'}`}>{user.isAdult && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[17px] font-medium ${user.isAdult ? 'text-white' : 'text-gray-400'}`}>Maior de 18 anos</span>
                </button>
                
                <button onClick={() => { triggerHaptic(); setUser({...user, isMassagemOk: !user.isMassagemOk}); }} className={`w-full p-5 rounded-[20px] border flex items-center gap-4 transition-all duration-300 ${user.isMassagemOk ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isMassagemOk ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-500'}`}>{user.isMassagemOk && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[17px] font-medium ${user.isMassagemOk ? 'text-white' : 'text-gray-400'}`}>Liberado p/ Massagem</span>
                </button>
              </div>

              <button 
                disabled={!user.name || !user.isAdult || !user.isMassagemOk} 
                onClick={() => { triggerHaptic(); setStep('services'); }} 
                className="w-full ios-btn-primary font-bold py-4 rounded-[22px] text-[17px] disabled:opacity-50 shadow-lg mt-4"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* --- SERVICES --- */}
        {step === 'services' && (
          <div className="flex-1 p-6 pt-32 overflow-y-auto pb-28 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Serviços</h2>
            </div>
            <div className="space-y-5">
              {services.map(s => (
                <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className={`ios-card p-5 rounded-[24px] active:scale-98 transition-transform group ${s.id === 'masculina' ? 'border-[#0A84FF] shadow-[0_0_25px_rgba(10,132,255,0.2)]' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white text-[20px]">{s.name}</h3>
                    <span className="text-[#0A84FF] font-bold text-[17px] bg-[#0A84FF]/10 px-2 py-1 rounded-md">{formatCurrency(s.basePrice)}</span>
                  </div>
                  {s.highlight && <span className="text-[10px] font-bold text-black bg-[#FFD60A] px-2 py-0.5 rounded mb-2 inline-block">{s.highlight}</span>}
                  <p className="text-[15px] text-gray-300 leading-relaxed mb-4">{s.description}</p>
                  <ul className="space-y-2 mb-4">
                    {s.details.map((d, idx) => (<li key={idx} className="text-[13px] text-gray-400 flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]"></div> {d}</li>))}
                  </ul>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[12px] bg-white/5 px-3 py-1.5 rounded-full text-gray-300 flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5"/> {s.labelDuration}</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><ChevronRight className="w-5 h-5 text-gray-400" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONFIGURE --- */}
        {step === 'configure' && selection.service && (
          <div className="flex-1 p-6 pt-32 overflow-y-auto pb-64 animate-fade-in"> 
            <div className="ios-card p-5 rounded-[22px] mb-8 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-[19px]">{selection.service.name}</h3>
                <p className="text-[13px] text-gray-400 mt-0.5">{selection.service.labelDuration}</p>
              </div>
              <span className="text-[19px] font-bold text-[#0A84FF]">{formatCurrency(selection.service.basePrice)}</span>
            </div>

            <div className="space-y-8">
              <section>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide">Quando? (Max 21h)</h4>
                </div>
                <div className="ios-card p-4 rounded-[22px]">
                   <InlineDateSelector 
                      selectedDate={selection.date} 
                      selectedTime={selection.time} 
                      onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} 
                   />
                </div>
              </section>

              <section ref={locationRef}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide">Onde?</h4>
                  {selection.location && (
                    <button onClick={() => setSelection({...selection, location: null, useTable: null, city: ''})} className="text-[11px] font-bold text-[#0A84FF] flex items-center gap-1 bg-[#0A84FF]/10 px-2 py-1 rounded-md"><Edit3 className="w-3 h-3"/> TROCAR</button>
                  )}
                </div>
                
                <div className="space-y-3">
                  {locations.map(l => {
                    if (selection.location && selection.location.id !== l.id) return null;

                    return (
                    <div key={l.id} className="animate-fade-in">
                        <button onClick={() => { triggerHaptic(); setSelection({...selection, location: l, useTable: null}); scrollTo(vibeRef); }} className={`w-full p-5 rounded-[22px] border text-left transition-all duration-300 ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-white text-[17px]">{l.label}</span> 
                            {l.fee > 0 && <span className="text-[11px] font-bold text-gray-300 bg-white/10 px-2 py-1 rounded">+ {formatCurrency(l.fee)}</span>}
                          </div>
                          <p className="text-[13px] text-gray-500">{l.sublabel}</p>
                        </button>
                        
                        {selection.location?.id === l.id && l.id === 'santa-fe' && l.allowsTableChoice && (
                          <div ref={surfaceRef} className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                            <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === false ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'ios-btn border-transparent text-gray-400'}`}>🛏 Na Cama</button>
                            <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === true ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'ios-btn border-transparent text-gray-400'}`}>💆‍♂️ Levar Maca (+20)</button>
                          </div>
                        )}

                        {selection.location?.id === l.id && l.id === 'outras-cidades' && (
                            <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Digite o nome da cidade..." className="mt-3 w-full bg-[#1C1C1E] p-4 rounded-[18px] border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0A84FF] transition-all animate-fade-in" />
                        )}
                    </div>
                  )})}
                </div>
              </section>

              <div className="mt-4" ref={vibeRef}>
                <h4 className="text-[13px] font-semibold text-gray-400 uppercase mb-3 tracking-wide">Vibe Sonora 🎵</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   {musicVibes.map(vibe => (
                      <button key={vibe} onClick={() => { setSelection({...selection, music: vibe}); scrollTo(extrasRef); }} className={`px-5 py-3 rounded-[16px] border text-[13px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${selection.music === vibe ? 'bg-[#0A84FF] border-[#0A84FF] text-white scale-105' : 'ios-btn border-transparent text-gray-400'}`}>
                        {vibe}
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-3" ref={extrasRef}>
                <h4 className="text-[13px] font-semibold text-gray-400 uppercase mb-1 tracking-wide mt-4">EXTRAS</h4>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, upgrade: !selection.upgrade}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">+30 Minutos</p><p className="text-[11px] text-gray-500">Mais tempo para curtir</p></div>
                  <span className="text-[#0A84FF] font-bold text-[15px]">+{formatCurrency(selection.service.basePrice * 0.5)}</span>
                </button>

                <button onClick={() => { triggerHaptic(); setSelection({...selection, aroma: !selection.aroma}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                  <div className="text-left">
                      <p className="text-white font-bold text-[15px]">Aromaterapia 🌿</p>
                      <p className="text-[11px] text-gray-500">Cheiro suave que acalma</p>
                  </div>
                  <div className="text-right">
                      {getAromaPrice() < 10 ? (
                          <>
                            <span className="text-gray-500 line-through text-[11px] mr-2">R$ 10,00</span>
                            <span className="text-[#30D158] font-bold text-[15px]">{getAromaPrice() === 0 ? 'GRÁTIS' : `+${formatCurrency(getAromaPrice())}`}</span>
                          </>
                      ) : (
                          <span className="text-[#0A84FF] font-bold text-[15px]">+R$ 10,00</span>
                      )}
                  </div>
                </button>
              </div>

              <CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(code) => { setSelection({...selection, coupon: SYSTEM_COUPONS[code]}); scrollTo(paymentRef); }} onRemove={() => setSelection({...selection, coupon: null})} onAddManual={handleAddManualCoupon}/>

              <div className="mt-6" ref={paymentRef}>
                <h4 className="text-[13px] font-semibold text-gray-400 uppercase mb-3 tracking-wide">Pagamento</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                    <QrCode className="w-6 h-6 text-[#0A84FF]" />
                    <span className="text-[13px] font-bold text-white">Pix</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                    <Banknote className="w-6 h-6 text-[#30D158]" />
                    <span className="text-[13px] font-bold text-white">Dinheiro</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'debit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'debit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-[#0A84FF]" />
                    <span className="text-[13px] font-bold text-white">Débito</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-[#FFD60A]" />
                    <span className="text-[13px] font-bold text-white">Crédito</span>
                  </button>
                </div>
                
                {selection.paymentMethod === 'credit_card' && (
                  <div className="mt-3 ios-card p-3 rounded-[16px] animate-fade-in">
                    <label className="text-[12px] text-gray-400 block mb-1 font-bold ml-1">Parcelas (c/ taxa):</label>
                    <select 
                      value={selection.installments} 
                      onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})}
                      className="w-full bg-[#1C1C1E] border border-white/10 text-white text-[15px] rounded-lg p-3 focus:border-[#0A84FF]"
                    >
                      {CARD_RATES.map((rate, i) => i > 0 && (
                          <option key={i} value={i}>{i}x de {formatCurrency(calcFinalPrice()/i)}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-gray-500 mt-2 ml-1 flex items-center gap-1"><Info className="w-3 h-3"/> Taxa da máquina aplicada no parcelamento.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER FIXO (NOVO LAYOUT INTUITIVO) */}
        {step === 'configure' && selection.location && (
          <div className="absolute bottom-0 w-full p-0 z-30">
            <div className="h-10 bg-gradient-to-t from-[#000] to-transparent pointer-events-none"></div>
            
            <div className="bg-[#1C1C1E]/95 backdrop-blur-xl rounded-t-[32px] p-5 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              
              {/* RESUMO INTELIGENTE NO TOPO DO BOTÃO */}
              <div className="flex justify-between items-center mb-3 px-1">
                  <div className="flex flex-col">
                      <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3"/> 60 Minutos
                          {selection.paymentMethod && <span>• {selection.paymentMethod === 'credit_card' ? `${selection.installments}x Cartão` : selection.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'}</span>}
                      </span>
                  </div>
                  <div className="text-right">
                      <span className="text-[22px] font-bold text-white tracking-tight">{formatCurrency(calcFinalPrice())}</span>
                      {selection.location.id === 'motel' && <p className="text-[9px] text-[#FFD60A] leading-none">+ Taxa Motel</p>}
                      {selection.location.id === 'santa-fe' && <p className="text-[9px] text-gray-500 leading-none">Inclui Uber R$40</p>}
                  </div>
              </div>

              <button 
                disabled={!canFinalize} 
                onClick={handleWhatsApp} 
                className="w-full bg-[#0A84FF] hover:bg-[#007AFF] active:scale-[0.98] transition-all text-white font-bold py-4 rounded-[18px] shadow-[0_4px_20px_rgba(10,132,255,0.4)] flex justify-center items-center gap-2 text-[16px] disabled:opacity-50 disabled:shadow-none"
              >
                {canFinalize ? 'CONFIRMAR NO WHATSAPP' : 'Preencha tudo para continuar'} <MessageCircle className="w-5 h-5"/>
              </button>
            </div>
          </div>
        )}

        {/* TELA SUCESSO (COM PROGRESSO REAL E GAMIFICAÇÃO) */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-24 h-24 bg-[#30D158] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(48,209,88,0.4)] animate-scale">
                <Check className="w-12 h-12 text-white drop-shadow-md"/>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Pedido Enviado!</h2>
            <p className="text-gray-400 mb-8 text-[15px] leading-relaxed">Aguarde a confirmação no WhatsApp.</p>

            {/* BARRA DE XP REAL (SINCRONIZADA COM A HOME) */}
            <div className="w-full bg-[#1C1C1E] p-5 rounded-[22px] border border-white/10 mb-6 relative overflow-hidden">
                <div className="flex justify-between text-[11px] font-bold uppercase text-gray-500 mb-2 relative z-10">
                    <span>Nível {LEVELS.find(l => loyalty.totalSpent >= l.min).name}</span>
                    <span>Próximo: {LEVELS.find(l => l.min > loyalty.totalSpent)?.name || 'Máximo'}</span>
                </div>
                
                {/* CÁLCULO DE PROGRESSO EXATO */}
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3 relative z-10">
                    <div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#30D158]" style={{
                        width: `${(() => {
                            const currentLvl = LEVELS.slice().reverse().find(l => loyalty.totalSpent >= l.min);
                            const nextLvl = LEVELS.find(l => l.min > loyalty.totalSpent);
                            if(!nextLvl) return 100;
                            return Math.max(5, ((loyalty.totalSpent - currentLvl.min) / (nextLvl.min - currentLvl.min)) * 100);
                        })()}%`
                    }}></div>
                </div>
                
                <p className="text-[12px] text-gray-300 relative z-10">
                    Faltam <strong>{formatCurrency((LEVELS.find(l => l.min > loyalty.totalSpent)?.min || loyalty.totalSpent) - loyalty.totalSpent)}</strong> para ganhar novos benefícios.
                </p>
                
                {/* Background Decorativo */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-[30px] rounded-full"></div>
            </div>

            <button onClick={() => window.open(lastOrderLink, '_blank')} className="mb-4 w-full flex items-center justify-center gap-2 text-[15px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 py-3 rounded-xl border border-[#0A84FF]/20 hover:bg-[#0A84FF]/20 transition-colors">
                <Send className="w-4 h-4"/> Reenviar Pedido
            </button>

            <button onClick={handleCopyPix} className="mb-6 w-full flex items-center justify-center gap-2 text-[15px] font-bold text-gray-300 bg-[#1C1C1E] py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors">
                <Copy className="w-4 h-4"/> Copiar Chave Pix
            </button>
            
            <button onClick={handleReset} className="w-full ios-btn py-4 rounded-[18px] text-white font-bold">Voltar ao Início</button>
          </div>
        )}

        {/* FAQ MODAL */}
        {showFaq && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-5">
            <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[32px] p-8 border border-white/10 shadow-2xl animate-scale">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><HelpCircle className="w-7 h-7 text-[#0A84FF]" /> Informações</h3>
              <div className="space-y-5 text-[15px] text-gray-300 leading-relaxed">
                <p>🚫 <strong>Conduta:</strong> Sem sexo, sem penetração, sem oral. Apenas massagem terapêutica. Um espaço seguro para relaxar sem julgamentos.</p>
                <p>💰 <strong>Pagamento:</strong> Pix, Débito, Dinheiro ou Crédito.</p>
                <p>📍 <strong>Locais:</strong> Atendo em domicílio ou motéis (suítes).</p>
                <div className="pt-6 border-t border-white/10">
                    <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-xs text-[#FF3B30] flex items-center gap-2"><Trash2 className="w-3.5 h-3.5"/> Resetar App</button>
                </div>
              </div>
              <button onClick={() => setShowFaq(false)} className="mt-8 w-full bg-[#2C2C2E] text-white py-4 rounded-[18px] font-bold">Fechar</button>
            </div>
          </div>
        )}

      </div>
      )}
    </div>
  );
}
