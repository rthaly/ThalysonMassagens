import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, Siren, Send, ThumbsUp, Car
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS & CONFIGURAÇÕES (VISUAL IOS 2026 DARK PREMIUM)
// ==================================================================================

const globalStyles = `
/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.02em;
  color: #fff;
  background: #000;
}
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
input, select { user-select: text; font-size: 17px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; -webkit-touch-callout: none; cursor: pointer; }

/* Visual Azul Elétrico Premium */
.ios-card { 
  background: #121212; 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ios-header { 
  background: rgba(0, 0, 0, 0.85); 
  backdrop-filter: blur(20px); 
  border-bottom: 0.5px solid rgba(255,255,255,0.1); 
}

.ios-btn { 
  background: #1C1C1E; 
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease; 
}
.ios-btn:active { transform: scale(0.96); background: #2C2C2E; }

.ios-btn-primary {
  background: #007AFF; /* Azul das Imagens */
  color: white;
  box-shadow: 0 0 20px rgba(0, 122, 255, 0.4);
  border: none;
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }

.custom-input {
  background: #1C1C1E;
  border: 1px solid #333;
  transition: all 0.3s ease;
}
.custom-input:focus { border-color: #007AFF; box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2); }

/* Animações Completas */
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

const IconBack = () => <ChevronLeft className="w-6 h-6 text-[#007AFF]" />;

// ==================================================================================
// 2. BANCO DE DADOS (CONFIGURAÇÕES DO NEGÓCIO)
// ==================================================================================

// Taxas da Maquininha (1x a 12x)
const CARD_RATES = [
  0, 
  0,        // 1x (Débito/Crédito vista assumido sem taxa no repasse visual ou ajustar conforme necessidade)
  0.0499,   // 2x
  0.0600,   // 3x
  0.0700,   // 4x
  0.0800,   // 5x
  0.0900,   // 6x
  0.1000,   // 7x
  0.1050,   // 8x
  0.1100,   // 9x
  0.1150,   // 10x
  0.1190,   // 11x
  0.1238    // 12x
];

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
    sublabel: 'Vou com você (+ Taxa R$75)', 
    fee: 75, // SOMA NO TOTAL
    allowsTableChoice: false, 
    estimatedTravelTime: '10-15 min' 
  },
  { 
    id: 'santa-fe', 
    label: 'Santa Fé do Sul', 
    sublabel: 'No conforto do seu lar (+ Uber R$40)', 
    fee: 40, // SOMA NO TOTAL
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
  { name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', perks: ["Acesso App VIP", "Agendamento Rápido"] },
  { name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', perks: ["Cupom R$ 15 (Ganhou!)", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', perks: ["Cupom R$ 25 (Ganhou!)", "Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: ["Cupom R$ 50 (Ganhou!)", "Prioridade Total"] },
];

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const musicVibes = ['Silêncio 🤫', 'Zen 🧘', 'Natureza 🌿']; 

const REVIEWS_DB = [
  { t: "Sou casado, sigilo foi absoluto. A finalização foi de tremer as pernas.", a: "R.S.", r: 5 },
  { t: "Nunca senti nada igual. Gemi sem vergonha nenhuma, que alívio!", a: "Anônimo", r: 5 },
  { t: "Toque macio e firme ao mesmo tempo. A explosão no final foi incrível.", a: "Carlos", r: 5 },
  { t: "Mãos de fada. Fiquei muito à vontade, gozei muito no final.", a: "M.V.", r: 5 },
  { t: "Sensação única. O corpo a corpo me deixou louco.", a: "Empresário Sigiloso", r: 5 },
  { t: "Fui no motel e foi perfeito. O Thaly entende o que homem precisa.", a: "João", r: 5 },
  { t: "Estava travado de stress, saí flutuando e leve.", a: "P.H.", r: 5 },
  { t: "Melhor massagem da região. O final é inesquecível.", a: "Visitante", r: 5 }
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

// ==================================================================================
// 3. COMPONENTES DE UI (INTERFACE)
// ==================================================================================

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
        <div className="absolute top-14 right-0 w-80 bg-[#121214] border border-white/10 shadow-2xl rounded-[20px] overflow-hidden z-[100] animate-fade-in">
           <div className="p-4 border-b border-white/10 bg-[#1C1C1E] flex justify-between items-center">
             <h4 className="font-semibold text-white text-sm">Notificações</h4>
             <button onClick={() => setOpen(false)} className="p-1"><X className="w-4 h-4 text-gray-400"/></button>
           </div>
           <div className="max-h-64 overflow-y-auto p-2">
             {notifications.length === 0 ? (
               <div className="p-6 text-center text-gray-500 text-sm">Nenhuma novidade.</div>
             ) : (
               notifications.map(n => (
                 <div key={n.id} className="p-3 mb-1 rounded-xl bg-white/5 border border-white/5">
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

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const summaryRef = useRef(null);
  
  // State Principal (Dados Persistentes)
  const [loyalty, setLoyalty] = useState(() => {
    const saved = localStorage.getItem('thaly_v12'); 
    return saved ? JSON.parse(saved) : { savedName: '', avatar: '😎', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], levelsUnlocked: ['Bronze'] };
  });

  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
  const [showFaq, setShowFaq] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true); 
  const [greeting, setGreeting] = useState("");
  const [weatherHint, setWeatherHint] = useState("");
  const [lastOrderLink, setLastOrderLink] = useState(""); 
    
  const surfaceRef = useRef(null);

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);
  
  // TITLE SETTING
  useEffect(() => {
      document.title = "Hora de Relaxar";
  }, []);

  useEffect(() => {
    localStorage.setItem('thaly_v12', JSON.stringify(loyalty));
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
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  useEffect(() => {
      if(step === 'configure' && selection.paymentMethod) {
          setTimeout(() => summaryRef.current?.scrollIntoView({behavior: 'smooth', block: 'end'}), 200);
      }
  }, [selection.paymentMethod]);

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
      if (level === 'Ouro' || level === 'Diamante') return 0;
      if (level === 'Prata') return 5;
      return 10;
  };

  // Calculations
  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    
    // Adicionais (EXCETO UBER DO TOTAL FINAL DE SERVIÇO)
    if (selection.upgrade) total += selection.service.basePrice * 0.5;
    if (selection.useTable) total += 20;
    if (selection.aroma) total += getAromaPrice();
    if (selection.location?.fee && selection.location.id !== 'motel') total += selection.location.fee; // Motel soma separado
    
    // Cupons
    if (selection.coupon) {
      if (selection.coupon.type === 'percent') total -= (total * selection.coupon.value / 100);
      else total -= selection.coupon.value;
    }
    return Math.max(0, total);
  }

  const calcFinalPrice = () => {
    let base = calcBaseTotal();
    // Se for Motel, soma a taxa de 75 no total visual do APP (conforme pedido)
    if (selection.location?.id === 'motel') base += 75;

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
    // Remove o cupom do inventário ao usar
    let newInventory = [...loyalty.inventory];
    if (selection.coupon) {
        newInventory = newInventory.filter(c => c !== selection.coupon.code);
    }

    // --- CHECK LEVEL UP E GANHAR CUPOM ---
    // Agora verifica se o nível já foi desbloqueado antes usando levelsUnlocked
    let updatedLevelsUnlocked = loyalty.levelsUnlocked ? [...loyalty.levelsUnlocked] : ['Bronze'];
    const currentLevel = [...LEVELS].reverse().find(l => newTotal >= l.min);
    
    let newNotifications = [...loyalty.notifications];
    
    // Se atingiu um nível novo que não estava desbloqueado
    if(currentLevel && !updatedLevelsUnlocked.includes(currentLevel.name)) {
        updatedLevelsUnlocked.push(currentLevel.name);
        
        if (currentLevel.rewardCode) {
            // Adiciona o cupom no inventário
            newInventory.push(currentLevel.rewardCode);
            // Notifica
            newNotifications.unshift({
                id: Date.now() + 1,
                title: '🎉 Subiu de Nível!',
                message: `Parabéns! Você atingiu o nível ${currentLevel.name} e ganhou o cupom ${currentLevel.rewardCode}!`,
                read: false,
                timestamp: Date.now()
            });
        }
    }
    
    // Notificação de Pedido Enviado
    newNotifications.unshift({
        id: Date.now(),
        title: 'Pedido Enviado 📤',
        message: 'Aguarde a confirmação no WhatsApp.',
        read: false,
        timestamp: Date.now()
    });

    setLoyalty(prev => ({ 
        ...prev, 
        savedName: user.name || prev.savedName, 
        totalSpent: newTotal, 
        totalSaved: prev.totalSaved + (selection.coupon ? 10 : 0) + (selection.aroma ? (10 - getAromaPrice()) : 0),
        inventory: newInventory,
        notifications: newNotifications,
        levelsUnlocked: updatedLevelsUnlocked
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

    // Taxas Separadas
    let uberFee = 0;
    if (selection.location.id === 'santa-fe') uberFee = 40;

    let motelFee = 0;
    if (selection.location.id === 'motel') motelFee = 75;

    // Desconto
    let discountVal = 0;
    if (selection.coupon) {
      if (selection.coupon.type === 'percent') discountVal = grossService * (selection.coupon.value / 100);
      else discountVal = selection.coupon.value;
    }

    // 1. Total Cliente Paga
    let totalClientPays = grossService - discountVal + uberFee + motelFee; 
    
    // 2. Líquido Massagista (O que entra na sua mao, sem motel, com uber pra reembolso)
    let masseurNet = grossService - discountVal + uberFee; 

    // Cartão
    let totalWithCard = totalClientPays;
    let cardFee = 0;
    if (selection.paymentMethod === 'credit_card') {
       const rate = CARD_RATES[selection.installments] || 0;
       totalWithCard = totalClientPays / (1 - rate);
       cardFee = totalWithCard - totalClientPays;
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

💰 TOTAL CLIENTE: ${formatCurrency(totalWithCard)} ${paymentText}
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
    <div className="min-h-screen flex justify-center bg-black text-white font-sans">
      <style>{globalStyles}</style>
      <div ref={scrollRef} className="w-full max-w-[440px] h-[100dvh] flex flex-col relative overflow-y-auto scrollbar-hide bg-[#000]">
        
        {/* HEADER */}
        {step !== 'home' && step !== 'success' && (
          <div className="sticky top-0 z-30 ios-header px-5 py-4 flex justify-between items-center">
             <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10"><IconBack /></button>
             <div className="flex items-center gap-3">
               <span className="text-sm font-bold">{user.name || 'Visitante'}</span>
               <Notifications notifications={loyalty.notifications} onClear={() => setLoyalty(p=>({...p, notifications: p.notifications.map(n=>({...n, read:true}))}))} />
             </div>
          </div>
        )}

        {/* HOME */}
        {step === 'home' && (
          <div className="p-6 pb-32 pt-8">
             {/* Topo Limpo */}
             <div className="flex justify-between items-start mb-6">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-300 flex items-center gap-1"><Info className="w-3 h-3"/> Dia ideal para relaxar</span>
                   </div>
                   <h1 className="text-2xl font-bold tracking-tight">Thalyson Massagens</h1>
                </div>
                
                {/* Barra de Ferramentas */}
                <div className="flex bg-[#1C1C1E] rounded-full p-1 border border-white/10">
                   <button onClick={() => setShowFaq(true)} className="p-2 rounded-full hover:bg-white/10 text-gray-400"><Shield className="w-5 h-5"/></button>
                   <a href="https://instagram.com/thalymassagens" target="_blank" className="p-2 rounded-full hover:bg-white/10 text-[#E1306C]"><Instagram className="w-5 h-5"/></a>
                   <button onClick={handleShare} className="p-2 rounded-full hover:bg-white/10 text-blue-400"><Share2 className="w-5 h-5"/></button>
                   <div className="w-px h-6 bg-white/10 mx-1 self-center"/>
                   <button onClick={handlePanic} className="p-2 rounded-full hover:bg-red-900/30 text-red-500"><LogOut className="w-5 h-5"/></button>
                </div>
             </div>

             {/* Cartão Fidelidade */}
             <div className="ios-card p-6 rounded-[28px] mb-6 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6 relative z-10">
                   <div>
                      <p className="text-[10px] text-[#007AFF] font-black uppercase tracking-widest mb-1">CLUBE VIP</p>
                      <h3 className="text-3xl font-bold flex items-center gap-2">{getCurrentLevel().name} {getCurrentLevel().icon}</h3>
                   </div>
                   <button onClick={() => setPrivacyMode(!privacyMode)} className="text-right">
                      <div className="flex items-center justify-end gap-1 text-gray-500 mb-1"><span className="text-[10px] font-bold">INVESTIDO</span> {privacyMode ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}</div>
                      <p className={`text-xl font-mono ${privacyMode ? 'blur-md' : ''}`}>{formatCurrency(loyalty.totalSpent)}</p>
                   </button>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden">
                   <div className="h-full bg-[#007AFF]" style={{width: `${Math.min(100, (loyalty.totalSpent / (getNextLevel()?.min || loyalty.totalSpent))*100)}%`}}/>
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase">
                   <span>Economia: {formatCurrency(loyalty.totalSaved)}</span>
                   <span>Próx: {formatCurrency(getNextLevel()?.min || loyalty.totalSpent)}</span>
                </div>
             </div>

             <LiveStatus />
             
             {/* Avaliações Carrossel */}
             <div className="mb-6 flex overflow-x-auto gap-3 scrollbar-hide pb-2 snap-x">
                {REVIEWS_DB.map((r, i) => (
                   <div key={i} className="snap-center min-w-[260px] ios-card p-4 rounded-2xl border-l-2 border-[#007AFF]">
                      <div className="flex gap-1 mb-2 text-[#FFD700]"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
                      <p className="text-sm text-gray-300 italic mb-2">"{r.t}"</p>
                      <p className="text-[10px] font-bold text-gray-500 uppercase">- {r.a}</p>
                   </div>
                ))}
             </div>

             <button onClick={() => { triggerHaptic(); setStep(loyalty.savedName ? 'services' : 'identity'); }} className="w-full h-14 ios-btn-primary rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg">
                Agendar Sessão <ChevronRight className="w-5 h-5"/>
             </button>
          </div>
        )}

        {/* IDENTITY */}
        {step === 'identity' && (
           <div className="p-6 pt-10 h-full flex flex-col animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Identificação</h2>
              <div className="space-y-4 flex-1">
                 <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} placeholder="Seu Nome" className="w-full custom-input p-4 rounded-xl text-lg text-white" />
                 <div className="flex gap-3">
                    <button onClick={() => setUser({...user, isAdult: !user.isAdult})} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 ${user.isAdult ? 'border-[#007AFF] bg-[#007AFF]/10' : 'border-white/10'}`}>
                       {user.isAdult ? <CheckCircle2 className="w-6 h-6 text-[#007AFF]"/> : <div className="w-6 h-6 rounded-full border border-gray-500"/>}
                       <span className="text-xs font-bold text-gray-400">+18 Anos</span>
                    </button>
                    <button onClick={() => setUser({...user, isMassagemOk: !user.isMassagemOk})} className={`flex-1 p-4 rounded-xl border flex flex-col items-center gap-2 ${user.isMassagemOk ? 'border-[#007AFF] bg-[#007AFF]/10' : 'border-white/10'}`}>
                       {user.isMassagemOk ? <CheckCircle2 className="w-6 h-6 text-[#007AFF]"/> : <div className="w-6 h-6 rounded-full border border-gray-500"/>}
                       <span className="text-xs font-bold text-gray-400">Liberado</span>
                    </button>
                 </div>
              </div>
              <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full h-14 ios-btn-primary rounded-2xl font-bold disabled:opacity-50">Continuar</button>
           </div>
        )}

        {/* SERVICES */}
        {step === 'services' && (
           <div className="p-6 pt-10 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Serviços</h2>
              {services.map(s => (
                 <div key={s.id} onClick={() => { setSelection({...selection, service: s}); setStep('configure'); }} className="ios-card p-5 rounded-2xl mb-4 active:scale-95 transition-transform relative overflow-hidden">
                    {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl">{s.highlight}</div>}
                    <div className="flex justify-between items-end mb-2">
                       <h3 className="text-xl font-bold">{s.name}</h3>
                       <span className="text-[#007AFF] font-bold text-lg">{formatCurrency(s.basePrice)}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{s.description}</p>
                    <div className="flex gap-2 flex-wrap">{s.details.map((d,i) => <span key={i} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-300">{d}</span>)}</div>
                 </div>
              ))}
           </div>
        )}

        {/* CONFIGURE */}
        {step === 'configure' && selection.service && (
           <div className="p-6 pt-6 pb-64 animate-fade-in">
              {/* Data */}
              <div className="mb-8">
                 <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Data e Hora</h4>
                 <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-3">
                    {[0,1,2,3,4].map(i => {
                       const d = new Date(); d.setDate(d.getDate() + i);
                       const isSel = selection.date?.toDateString() === d.toDateString();
                       return (
                          <button key={i} onClick={() => setSelection({...selection, date: d, time: ''})} className={`min-w-[70px] h-20 rounded-xl border flex flex-col items-center justify-center ${isSel ? 'bg-white text-black' : 'ios-btn'}`}>
                             <span className="text-[10px] font-bold">{i===0?'HOJE':d.getDate()}</span>
                             <span className="text-lg font-bold">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                          </button>
                       )
                    })}
                 </div>
                 {selection.date && (
                    <div className="grid grid-cols-4 gap-2">
                       {timeSlots.map(t => (
                          <button key={t} onClick={() => setSelection({...selection, time: t})} className={`py-2 rounded-lg text-sm font-bold border ${selection.time === t ? 'bg-[#007AFF] border-[#007AFF]' : 'ios-btn'}`}>{t}</button>
                       ))}
                    </div>
                 )}
              </div>

              {/* Local */}
              <div className="mb-8">
                 <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Local</h4>
                 {locations.map(l => (
                    <div key={l.id} onClick={() => setSelection({...selection, location: l, useTable: false})} className={`p-4 rounded-xl border mb-2 ${selection.location?.id === l.id ? 'bg-[#007AFF]/20 border-[#007AFF]' : 'ios-btn'}`}>
                       <div className="flex justify-between font-bold text-sm"><span>{l.label}</span> {l.fee>0 && <span className="text-gray-400">+{formatCurrency(l.fee)}</span>}</div>
                       <p className="text-xs text-gray-500">{l.sublabel}</p>
                       {selection.location?.id === l.id && l.id === 'santa-fe' && (
                          <div className="flex gap-2 mt-3">
                             <button onClick={(e)=>{e.stopPropagation(); setSelection({...selection, useTable: false})}} className={`flex-1 py-2 rounded text-xs border ${!selection.useTable ? 'bg-white text-black' : 'border-white/10'}`}>Na Cama</button>
                             <button onClick={(e)=>{e.stopPropagation(); setSelection({...selection, useTable: true})}} className={`flex-1 py-2 rounded text-xs border ${selection.useTable ? 'bg-white text-black' : 'border-white/10'}`}>Maca (+20)</button>
                          </div>
                       )}
                       {selection.location?.id === l.id && l.input && <input onChange={e=>setSelection({...selection, city: e.target.value})} placeholder="Cidade..." className="w-full mt-2 bg-black p-2 rounded text-sm"/>}
                    </div>
                 ))}
              </div>

              {/* Extras */}
              <div className="mb-8 space-y-3">
                 <button onClick={() => setSelection({...selection, upgrade: !selection.upgrade})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.upgrade ? 'bg-[#007AFF]/20 border-[#007AFF]' : 'ios-btn'}`}>
                    <span className="text-sm font-bold">Mais Tempo (+30m)</span>
                    <span className="text-[#007AFF] font-bold">+R$ 50</span>
                 </button>
                 <button onClick={() => setSelection({...selection, aroma: !selection.aroma})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.aroma ? 'bg-[#007AFF]/20 border-[#007AFF]' : 'ios-btn'}`}>
                    <div className="text-left"><p className="text-sm font-bold">Aromaterapia</p><p className="text-[10px] text-gray-500">Óleos essenciais</p></div>
                    <span className={`${getAromaPrice() === 0 ? 'text-green-500' : 'text-[#007AFF]'} font-bold`}>{getAromaPrice() === 0 ? 'GRÁTIS (VIP)' : `+R$ ${getAromaPrice()}`}</span>
                 </button>
              </div>

              <CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(c)=>setSelection({...selection, coupon: SYSTEM_COUPONS[c]})} onRemove={()=>setSelection({...selection, coupon: null})} onAddManual={(c)=>{if(!loyalty.inventory.includes(c)) setLoyalty(p=>({...p, inventory:[...p.inventory, c]}))}}/>

              {/* Pagamento */}
              <div className="grid grid-cols-2 gap-2 mt-6">
                 {['pix', 'cash', 'debit_card', 'credit_card'].map(m => (
                    <button key={m} onClick={() => setSelection({...selection, paymentMethod: m})} className={`py-4 rounded-xl border flex flex-col items-center gap-1 ${selection.paymentMethod === m ? 'bg-[#007AFF]/20 border-[#007AFF]' : 'ios-btn'}`}>
                       <span className="text-[10px] font-black uppercase">{m.replace('_',' ')}</span>
                    </button>
                 ))}
              </div>
              {selection.paymentMethod === 'credit_card' && (
                 <select onChange={e=>setSelection({...selection, installments: e.target.value})} className="w-full mt-3 bg-[#1C1C1E] p-3 rounded-xl text-white outline-none">
                    {CARD_RATES.map((r,i)=> i>0 && <option key={i} value={i}>{i}x (c/ taxa)</option>)}
                 </select>
              )}

              {/* RESUMO DO PEDIDO VISUAL (ATUALIZADO) */}
              <div ref={summaryRef} className="mt-8 ios-card p-5 rounded-[22px] bg-[#1C1C1E] border border-white/10">
                 <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                    <Receipt className="w-5 h-5 text-[#007AFF]"/>
                    <h4 className="text-sm font-bold uppercase tracking-wider">Resumo do Pedido</h4>
                 </div>
                 <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex justify-between">
                       <span>{selection.service.name}</span>
                       <span>{formatCurrency(selection.service.basePrice)}</span>
                    </div>
                    {selection.upgrade && <div className="flex justify-between text-[#007AFF]"><span>+ Tempo Extra</span><span>{formatCurrency(selection.service.basePrice * 0.5)}</span></div>}
                    {selection.useTable && <div className="flex justify-between text-[#007AFF]"><span>+ Maca</span><span>R$ 20,00</span></div>}
                    {selection.aroma && <div className="flex justify-between text-[#007AFF]"><span>+ Aroma</span><span>{getAromaPrice()===0 ? 'GRÁTIS' : formatCurrency(getAromaPrice())}</span></div>}
                    {selection.location?.fee > 0 && <div className="flex justify-between text-[#FFD700]"><span>+ Taxa Local ({selection.location.id === 'motel' ? 'Motel' : 'Uber'})</span><span>{formatCurrency(selection.location.fee)}</span></div>}
                    {selection.coupon && <div className="flex justify-between text-green-500"><span>Desconto</span><span>-{formatCurrency(calculateTotals().discount)}</span></div>}
                    <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-bold text-white text-lg">
                       <span>TOTAL FINAL</span>
                       <span>{formatCurrency(calculateTotals().totalWithCard)}</span>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* FOOTER TOTAL */}
        {step === 'configure' && selection.location && (
           <div className="fixed bottom-0 w-full max-w-[440px] bg-[#121212] border-t border-white/10 p-5 rounded-t-[30px] z-20 shadow-2xl">
              <div className="flex justify-between items-end mb-4">
                 <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Cliente</p>
                    <p className="text-3xl font-bold tracking-tighter text-white">{formatCurrency(calculateTotals().totalWithCard)}</p>
                 </div>
                 {selection.location.id === 'motel' && <span className="text-[10px] text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded font-bold">Taxa Motel Inclusa</span>}
                 {selection.location.id === 'santa-fe' && <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded">Inclui Uber R$40</span>}
              </div>
              <button disabled={!selection.date || !selection.time || !selection.paymentMethod} onClick={handleWhatsApp} className="w-full h-14 ios-btn-primary rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50">
                 Confirmar no WhatsApp <MessageCircle className="w-5 h-5"/>
              </button>
           </div>
        )}

        {/* SUCCESS SCREEN */}
        {step === 'success' && (
           <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]"><Check className="w-10 h-10 text-white"/></div>
              <h2 className="text-3xl font-bold mb-2">Pedido Enviado!</h2>
              <p className="text-gray-400 mb-8">Aguarde a confirmação no WhatsApp.</p>
              
              <div className="bg-[#1C1C1E] p-5 rounded-2xl w-full border border-white/10 mb-4">
                 <div className="flex justify-between text-xs font-bold text-gray-500 mb-2"><span>Nível Atual</span><span>Próximo</span></div>
                 <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2"><div className="h-full bg-[#007AFF]" style={{width: `${(loyalty.totalSpent/1800)*100}%`}}/></div>
                 <p className="text-xs text-white">Falta pouco para o próximo benefício!</p>
              </div>

              <button onClick={() => window.open(lastOrderLink, '_blank')} className="w-full py-3 mb-3 text-[#007AFF] bg-[#007AFF]/10 rounded-xl font-bold text-sm">Reenviar Pedido</button>
              <button onClick={() => {setStep('home'); setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });}} className="w-full py-3 bg-[#1C1C1E] rounded-xl text-white font-bold text-sm">Voltar ao Início</button>
           </div>
        )}

        {/* FAQ */}
        {showFaq && (
           <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl p-6 flex flex-col justify-center animate-fade-in">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield className="w-6 h-6 text-[#007AFF]"/> Conduta</h3>
              <ul className="space-y-4 text-sm text-gray-300 list-disc pl-5">
                 <li>Sigilo Absoluto.</li>
                 <li>Sem sexo/penetração.</li>
                 <li>Pagamento Pix/Dinheiro/Cartão.</li>
              </ul>
              <button onClick={() => setShowFaq(false)} className="mt-8 py-4 bg-[#1C1C1E] rounded-xl font-bold">Fechar</button>
           </div>
        )}

      </div>
    </div>
  );
}
