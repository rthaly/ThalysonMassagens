import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, 
  Briefcase, Shield, Star, Instagram, 
  Bell, Tag, ArrowRight, Eye, EyeOff, Share2, 
  LogOut, Crown, Trash2, CreditCard, Banknote, QrCode, 
  Info, CheckCircle2, Send, Menu
} from 'lucide-react';

// ==================================================================================
// 1. UTILITÁRIOS E CONFIGURAÇÕES (Lógica Pura)
// ==================================================================================

// 🛡️ SAFE STORAGE: Impede o app de quebrar em aba anônima/privada
const safeStorage = {
  getItem: (key) => {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  },
  setItem: (key, value) => {
    try { localStorage.setItem(key, value); } catch (e) { /* falha silenciosa */ }
  },
  clear: () => {
    try { localStorage.clear(); } catch (e) { /* falha silenciosa */ }
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(5); };
const generateBookingId = () => Math.random().toString(36).substring(2, 6).toUpperCase();

// 🛠️ CONFIGURAÇÕES DE PREÇO
const CONFIG = {
  WHATSAPP_NUM: "5517991360413", // Seu número
  PIX_KEY: "62922530000144",     // Sua chave Pix
  PRICES: {
    MACA: 20,
    AROMA_FULL: 10,
    AROMA_DISCOUNT: 5,
    UPGRADE_PCT: 0.5
  }
};

// 💆‍♂️ MENU DE SERVIÇOS
const services = [
  { 
    id: 'masculina', name: 'Massagem Masculina', type: 'sensual',
    description: 'Massagem Relaxante + Toques corpo a corpo (de cueca) com finalização Lingam manual completa.', 
    labelDuration: '60 min', minutes: 60, 
    basePrice: 140, 
    highlight: "MAIS PEDIDA 🔥", ratings: 5.0, reviews: 310, 
    details: ["Relaxante + Body-to-Body", "Massagista de Cueca", "Lingam / Finalização Manual", "Alívio Completo"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    description: 'Corpo inteiro: Costas, braços, mãos, pernas, coxas, pés, peito e frente. (Sem toques íntimos).', 
    labelDuration: '60 min', minutes: 60, 
    basePrice: 90, 
    ratings: 4.9, reviews: 142, 
    details: ["Corpo Inteiro", "Sem Glúteos/Íntimo", "Toque Terapêutico", "Relaxamento Puro"] 
  },
];

// 📍 LOCAIS
const locations = [
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Vou com você', fee: 75, allowsTableChoice: false, isMotel: true },
  { id: 'santa-fe', label: 'Santa Fé do Sul', sublabel: 'No conforto do seu lar', fee: 40, allowsTableChoice: true, isUber: true },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', sublabel: 'Atendimento na região', fee: 0, allowsTableChoice: false, input: true, isPending: true },
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
  { name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', perks: ["Acesso VIP", "Agendamento Rápido"] },
  { name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', perks: ["Cupom R$ 15 (Ganhou!)", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', perks: ["Cupom R$ 25 (Ganhou!)", "Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: ["Cupom R$ 50 (Ganhou!)", "Prioridade Total"] },
];

const musicVibes = ['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘', 'Deep House 🎧']; 

const REVIEWS_DB = [
  { t: "Sou casado, o sigilo foi total. A massagem tântrica me surpreendeu.", a: "Sigiloso (44 anos)", r: 5 },
  { t: "Nunca tinha feito tântrica. A sensibilidade que ele desperta é absurda.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Ambiente discreto. O toque íntimo foi feito com muito respeito.", a: "Curioso", r: 5 },
  { t: "Gostei da massagem, relaxou bem os músculos.", a: "Paulo", r: 4 },
  { t: "Mão leve e firme ao mesmo tempo. A manipulação foi perfeita.", a: "Anônimo", r: 5 },
];

// ==================================================================================
// 2. ESTILOS GLOBAIS (CSS IN JS OTIMIZADO)
// ==================================================================================

const globalStyles = `
/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; scroll-behavior: smooth; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif; 
  letter-spacing: -0.02em;
  color: #fff;
  background: #000;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Hide */
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Inputs & Elements */
input, select { user-select: text; font-size: 17px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; cursor: pointer; }

/* --- BACKGROUNDS --- */
.aurora-bg {
  background: 
    radial-gradient(120% 100% at 50% 0%, #141416 0%, #000000 70%),
    radial-gradient(80% 60% at 50% 100%, rgba(10, 132, 255, 0.08), transparent 60%);
  background-attachment: fixed;
  background-size: cover;
  min-height: 100vh;
}

/* --- COMPONENTS (GLASSMORPHISM) --- */
.ios-card { 
  background: rgba(28, 28, 30, 0.6); 
  backdrop-filter: blur(40px) saturate(160%); 
  -webkit-backdrop-filter: blur(40px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  transform: translateZ(0); /* Aceleração de Hardware */
}
.ios-card:active { transform: scale(0.98) translateZ(0); }

/* --- BOTÕES --- */
.ios-btn-primary {
  background: #007AFF;
  color: white;
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.4);
  border: none;
  transition: all 0.2s ease;
}
.ios-btn-primary:active { transform: scale(0.97); opacity: 0.9; }
.ios-btn-primary:disabled { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }

/* --- ANIMATIONS --- */
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.5s ease-out forwards; }
.animate-spin-slow { animation: spin 1s linear infinite; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

// ==================================================================================
// 3. COMPONENTES AUXILIARES
// ==================================================================================

const IconBack = () => <ChevronLeft className="w-6 h-6 text-[#0A84FF]" />;

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
            {nextLevel ? (<span>Faltam {formatCurrency(nextLevel.min - safeSpent)} p/ {nextLevel.name}</span>) : (<span className="text-[#FFD60A]">Nível Máximo</span>)}
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
  const DAYS_TO_SHOW = 16;
  const days = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < DAYS_TO_SHOW; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        arr.push(d);
    }
    return arr;
  }, []); // Só calcula uma vez na montagem
   
  const now = new Date();
  
  const isTimeBlocked = (t, d) => {
    if(!d) return true;
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    if (!isToday) return false;
    const [h] = t.split(':').map(Number);
    return h <= now.getHours() + 1; // Bloqueia 1h de antecedência
  };

  const getDayLabel = (d) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      d.setHours(0,0,0,0); today.setHours(0,0,0,0); tomorrow.setHours(0,0,0,0);
      if (d.getTime() === today.getTime()) return 'HOJE';
      if (d.getTime() === tomorrow.getTime()) return 'AMANHÃ';
      return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).replace('.','');
  };

  const periods = [
      { label: 'Manhã ☀️', slots: ['09:00', '10:00', '11:00'] },
      { label: 'Tarde 🌤️', slots: ['13:00', '14:00', '15:00', '16:00', '17:00'] },
      { label: 'Noite 🌙', slots: ['18:00', '19:00', '20:00', '21:00'] }
  ];

  return (
    <div className="w-full select-none">
      <div className="flex justify-between items-end mb-4 px-1">
        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Escolha o Dia</h4>
        <span className="text-[10px] text-[#0A84FF] font-medium">Próximos {DAYS_TO_SHOW} dias</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-6 animate-fade-in">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate() && selectedDate?.getMonth() === d.getMonth();
          const label = getDayLabel(d);
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} 
              className={`relative flex flex-col items-center justify-center h-[80px] rounded-[18px] transition-all duration-200 border 
              ${isSel ? 'bg-[#0A84FF] text-white shadow-lg border-[#0A84FF] scale-[1.03] z-10 font-bold' : 'bg-[#2C2C2E] text-gray-400 border-white/5 active:bg-[#3A3A3C] hover:bg-[#3A3A3C]'}`}>
              <span className={`text-[9px] uppercase font-bold tracking-wide mb-0.5 ${label === 'HOJE' ? 'text-[#32D74B]' : isSel ? 'text-white/90' : 'opacity-60'}`}>{label}</span>
              <span className={`text-xl font-mono leading-none mb-0.5 ${isSel ? 'text-white' : 'text-gray-200'}`}>{d.getDate()}</span>
              {isSel && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>}
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="animate-slide-up space-y-6 pt-2 border-t border-white/5">
           {periods.map((period, idx) => {
               const hasSlots = period.slots.some(t => !isTimeBlocked(t, selectedDate));
               return (
                   <div key={idx} className={`transition-opacity ${hasSlots ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                       <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">
                           {period.label}<div className="h-[1px] flex-1 bg-white/5"></div>
                       </h5>
                       <div className="grid grid-cols-4 gap-2">
                           {period.slots.map(t => {
                               const blocked = isTimeBlocked(t, selectedDate);
                               const isSelected = selectedTime === t;
                               return (
                                  <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                                    className={`py-2.5 rounded-[12px] text-[13px] font-semibold transition-all duration-200 relative overflow-hidden
                                    ${isSelected ? 'bg-[#0A84FF] text-white shadow-lg scale-[1.02]' : blocked ? 'bg-white/5 text-gray-600 opacity-30 cursor-not-allowed' : 'bg-[#2C2C2E] text-gray-300 hover:bg-[#3A3A3C] border border-white/5'}`}>
                                    {blocked && <div className="absolute inset-0 bg-black/40"></div>}{t}
                                  </button>
                               )
                           })}
                       </div>
                   </div>
               )
           })}
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
  
  // Refs para Scroll Automático
  const refs = {
    location: useRef(null), vibe: useRef(null), extras: useRef(null), 
    coupon: useRef(null), payment: useRef(null), home: useRef(null), receipt: useRef(null), surface: useRef(null)
  };

  const scrollTo = (refKey) => setTimeout(() => refs[refKey].current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);

  const [loyalty, setLoyalty] = useState(() => {
    const saved = safeStorage.getItem('thaly_system_v22'); 
    return saved ? JSON.parse(saved) : { savedName: '', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], history: [] };
  });

  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
  
  const [uiState, setUiState] = useState({ showFaq: false, showNotifications: false, showMenu: false, privacyMode: true, weatherHint: '' });

  // Init
  useEffect(() => { 
    setTimeout(() => setLoading(false), 1500); 
    const hr = new Date().getHours();
    setUiState(p => ({...p, weatherHint: hr < 18 ? "☀️ Dia ideal para relaxar" : "🌙 Noite perfeita para relaxar"}));
  }, []);

  useEffect(() => {
    safeStorage.setItem('thaly_system_v22', JSON.stringify(loyalty));
    if (loyalty.savedName) setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true}));
  }, [loyalty]);

  useEffect(() => {
    if (selection.location?.allowsTableChoice && step === 'configure') scrollTo('surface');
  }, [selection.location, step]);

  useEffect(() => {
    if (step === 'home') refs.home.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Actions
  const handleQuickSchedule = () => { triggerHaptic(); setStep(loyalty.savedName ? 'services' : 'identity'); };
  const handleShare = () => { if(navigator.share) navigator.share({title:'Thalyson Massagens', text:'Agende sua massagem agora', url: window.location.href}); };
  const handlePanic = () => { safeStorage.clear(); window.location.href = "https://google.com"; };
  
  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  const handleAddManualCoupon = (code) => {
      const codeUpper = code.toUpperCase().trim();
      if(SYSTEM_COUPONS[codeUpper]) {
          if (loyalty.inventory.includes(codeUpper)) alert('Você já tem este cupom!');
          else {
              setLoyalty(prev => ({...prev, inventory: [...prev.inventory, codeUpper]}));
              triggerHaptic();
          }
      } else alert('Cupom inválido.');
  };

  // --- CÁLCULOS DE PREÇO (MEMOIZED) ---
  const priceData = useMemo(() => {
      if (!selection.service) return { base: 0, final: 0, discount: 0, fee: 0 };

      const currentLevel = [...LEVELS].reverse().find(l => (loyalty.totalSpent || 0) >= l.min) || LEVELS[0];
      const getAromaCost = () => {
        if (currentLevel.name === 'Ouro' || currentLevel.name === 'Diamante') return 0;
        if (currentLevel.name === 'Prata') return CONFIG.PRICES.AROMA_DISCOUNT;
        return CONFIG.PRICES.AROMA_FULL;
      };

      let total = selection.service.basePrice;
      if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
      if (selection.useTable) total += CONFIG.PRICES.MACA;
      
      const aromaCost = selection.aroma ? getAromaCost() : 0;
      total += aromaCost;

      const fee = selection.location?.fee || 0;
      total += fee;

      let discount = 0;
      if (selection.coupon) {
        let discountable = total - fee;
        if (selection.coupon.type === 'percent') discount = (discountable * selection.coupon.value / 100);
        else discount = selection.coupon.value;
        total -= discount;
      }
      total = Math.max(0, total);

      let final = total;
      if (selection.paymentMethod === 'credit_card') {
         const rate = CARD_RATES[selection.installments] || 0;
         final = total / (1 - rate);
      }

      return { base: total, final, discount, fee, aromaCost, levelName: currentLevel.name };
  }, [selection, loyalty.totalSpent]);

  const canFinalize = selection.service && selection.location && selection.date && selection.time && selection.music && selection.paymentMethod && (selection.location.allowsTableChoice ? selection.useTable !== null : true) && (selection.location.id === 'outras-cidades' ? !!selection.city : true);

  const handleWhatsApp = () => {
    triggerHaptic();
    if (!canFinalize) return;
    
    // Atualiza Fidelidade
    const newTotal = (loyalty.totalSpent || 0) + (priceData.base - priceData.fee); // Não conta taxa de deslocamento na fidelidade
    const bookingId = generateBookingId();
    
    // Notificações
    const newNotif = [...loyalty.notifications];
    newNotif.unshift({ id: Date.now(), title: 'Agendamento Confirmado', message: `Sessão confirmada para ${selection.date.toLocaleDateString()}.`, read: false, timestamp: Date.now(), icon: 'calendar' });

    setLoyalty(prev => ({ 
      ...prev, 
      savedName: user.name || prev.savedName, 
      totalSpent: newTotal, 
      inventory: selection.coupon ? prev.inventory.filter(c => c !== selection.coupon.code) : prev.inventory,
      notifications: newNotif 
    }));

    // Mensagem
    const isToday = selection.date.getDate() === new Date().getDate();
    let locStr = selection.location.label;
    if(selection.location.isMotel) locStr += " (Vou com você)";
    if(selection.city) locStr += ` (${selection.city})`;

    let priceMsg = "";
    if (priceData.fee > 0) {
        priceMsg = `💆 Serviço: ${formatCurrency(priceData.base - priceData.fee)}\n🚗 Taxa: ${formatCurrency(priceData.fee)}\n💰 *TOTAL: ${formatCurrency(priceData.final)}*`;
    } else {
        priceMsg = `💰 *TOTAL: ${selection.location.isPending ? formatCurrency(priceData.final) + ' + Taxa' : formatCurrency(priceData.final)}*`;
    }

    const msg = `*NOVO AGENDAMENTO #${bookingId}*
👤 ${user.name}
📅 ${selection.date.toLocaleDateString()} ${isToday ? '(HOJE)' : ''} às ${selection.time}
💆 ${selection.service.name} ${selection.upgrade ? '+30min' : ''}
📍 ${locStr}

*RESUMO FINANCEIRO:*
${priceMsg}
(Pagamento: ${selection.paymentMethod === 'credit_card' ? `${selection.installments}x Cartão` : selection.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'})

🎵 Vibe: ${selection.music}
${selection.useTable ? '🛏️ Levar Maca' : ''}
${selection.aroma ? '🌿 Aromaterapia' : ''}`;

    const url = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP_NUM}&text=${encodeURIComponent(msg)}`;
    setLastOrderLink(url); 
    window.open(url, '_blank');
    setStep('success');
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-6 font-sans text-gray-200 bg-black" onClick={() => setUiState(p => ({...p, showMenu: false}))}>
      <style>{globalStyles}</style>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
          <div className="relative w-16 h-16 mb-8">
             <div className="absolute inset-0 rounded-full border-4 border-[#0A84FF]/20"></div>
             <div className="absolute inset-0 rounded-full border-4 border-t-[#0A84FF] animate-spin-slow"></div>
          </div>
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#0A84FF] animate-pulse uppercase">Carregando App</span>
        </div>
      ) : (
      <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] aurora-bg">
        
        {/* HEADER */}
        <div className="absolute top-0 w-full z-50 px-6 pt-12 pb-8 flex justify-between items-center pointer-events-none bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="pointer-events-auto">
             {step !== 'home' && step !== 'success' ? (
                <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10 bg-black/20 backdrop-blur-md border border-white/5"><IconBack /></button>
             ) : (
                <div className="flex flex-col items-start animate-fade-in">
                    <span className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest mb-0.5">{new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric'})}</span>
                    <span className="text-[13px] font-bold text-gray-200 leading-tight">{uiState.weatherHint}</span>
                </div>
             )}
          </div>
          <div className="flex items-center gap-3 pointer-events-auto relative">
              <button onClick={() => setUiState(p=>({...p, showNotifications: true}))} className="relative w-10 h-10 rounded-full bg-[#1C1C1E]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 active:scale-95 transition-all">
                  <Bell className="w-5 h-5"/>
                  {loyalty.notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white border-2 border-[#1C1C1E]">{loyalty.notifications.filter(n => !n.read).length}</span>
                  )}
              </button>
              <button onClick={(e) => { e.stopPropagation(); setUiState(p=>({...p, showMenu: !p.showMenu})); }} className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-95 ${uiState.showMenu ? 'bg-white text-black' : 'bg-[#1C1C1E]/80 text-gray-400'}`}>
                  {uiState.showMenu ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
              </button>
              {/* MENU DROPDOWN */}
              {uiState.showMenu && (
                 <div className="absolute top-16 right-0 w-52 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden animate-slide-up origin-top-right">
                    <button onClick={() => { setUiState(p=>({...p, showFaq: true, showMenu: false})); }} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5"><HelpCircle className="w-4 h-4 text-gray-400"/> Ajuda</button>
                    <a href="https://instagram.com/thalymassagens" target="_blank" className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5"><Instagram className="w-4 h-4 text-[#E1306C]"/> Instagram</a>
                    <button onClick={() => { handleShare(); setUiState(p=>({...p, showMenu: false})); }} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5"><Share2 className="w-4 h-4 text-gray-400"/> Compartilhar</button>
                    <button onClick={handlePanic} className="px-4 py-4 text-left text-[14px] text-red-500 hover:bg-red-500/10 flex items-center gap-3"><LogOut className="w-4 h-4"/> Sair (Limpar)</button>
                 </div>
              )}
          </div>
        </div>

        {/* --- TELA 1: HOME --- */}
        {step === 'home' && (
          <div className="flex-1 p-6 overflow-y-auto pb-32 pt-32" ref={refs.home}>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-2">Massagens Relaxantes<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A84FF] to-[#5AC8FA] text-2xl">em Santa Fé do Sul e Região</span></h1>
            </div>
            <div className="ios-card p-5 rounded-[28px] relative overflow-hidden mb-6 group border-t border-white/10">
               <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-[#0A84FF]/10 blur-[80px] rounded-full pointer-events-none"></div>
               <LevelProgressBar data={loyalty} privacyMode={uiState.privacyMode} onTogglePrivacy={() => { triggerHaptic(); setUiState(p=>({...p, privacyMode: !p.privacyMode})); }} />
            </div>
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

        {/* --- TELA 2: IDENTIDADE --- */}
        {step === 'identity' && (
          <div className="flex-1 p-6 pt-36 animate-fade-in flex flex-col h-full pb-32">
            <h2 className="text-3xl font-bold text-white mb-2">Quem é você?</h2>
            <p className="text-gray-400 text-[15px] mb-8">Para manter a segurança e exclusividade.</p>
            <div className="space-y-6 flex-1">
              <div className="ios-card p-6 rounded-[24px]">
                <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider block mb-2">Seu Nome</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent text-white text-[22px] font-medium placeholder:text-gray-600 border-b border-white/10 py-2 focus:border-[#0A84FF] transition-colors" placeholder="Digite seu nome..." />
              </div>
              <div className="space-y-3">
                {[{key:'isAdult', label:'Maior de 18 anos'}, {key:'isMassagemOk', label:'Liberado para massagem'}].map(item => (
                    <button key={item.key} onClick={() => { triggerHaptic(); setUser({...user, [item.key]: !user[item.key]}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user[item.key] ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                        <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user[item.key] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user[item.key] && <Check className="w-3.5 h-3.5 text-white" />}</div>
                        <span className={`text-[16px] font-medium ${user[item.key] ? 'text-white' : 'text-gray-400'}`}>{item.label}</span>
                    </button>
                ))}
              </div>
              <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] text-[17px] disabled:opacity-50 shadow-lg mt-4">Continuar</button>
            </div>
          </div>
        )}

        {/* --- TELA 3: SERVIÇOS --- */}
        {step === 'services' && (
          <div className="flex-1 p-6 pt-36 overflow-y-auto pb-32 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Menu</h2>
            <div className="space-y-6">
              {services.map(s => (
                <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className={`ios-card p-6 rounded-[30px] active:scale-98 transition-transform group relative overflow-hidden`}>
                  {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-[20px]">{s.highlight}</div>}
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-[22px] leading-tight mb-1">{s.name}</h3>
                    <div className="flex items-center gap-2"><span className="text-[#0A84FF] font-bold text-[18px]">{formatCurrency(s.basePrice)}</span><span className="text-gray-500 text-[13px]">• {s.labelDuration}</span></div>
                  </div>
                  <p className="text-[15px] text-gray-300 leading-relaxed mb-5 opacity-90">{s.description}</p>
                  <div className="grid grid-cols-2 gap-2">{s.details.slice(0,4).map((d, idx) => (<div key={idx} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg"><div className="w-1 h-1 rounded-full bg-[#0A84FF]"></div><span className="text-[11px] text-gray-300 font-medium">{d}</span></div>))}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TELA 4: CONFIGURAÇÃO --- */}
        {step === 'configure' && selection.service && (
          <div className="flex-1 p-6 pt-36 overflow-y-auto pb-64 animate-fade-in scrollbar-hide"> 
            <div className="ios-card p-5 rounded-[22px] mb-8 flex items-center justify-between border-l-4 border-l-[#0A84FF]">
              <div><h3 className="font-bold text-white text-[17px]">{selection.service.name}</h3><p className="text-[13px] text-gray-400 mt-0.5">Configuração Personalizada</p></div>
            </div>

            <div className="space-y-10">
              <section>
                <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo('location'); }} />
              </section>

              <section ref={refs.location}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Local de Atendimento</h4>
                <div className="space-y-3">
                  {locations.map(l => {
                    if (selection.location && selection.location.id !== l.id) return null;
                    return (
                    <div key={l.id} className="animate-fade-in">
                        <button onClick={() => { triggerHaptic(); setSelection({...selection, location: l, useTable: null}); scrollTo('vibe'); }} className={`w-full p-5 rounded-[22px] border text-left transition-all duration-300 ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                          <div className="flex justify-between items-center mb-1"><span className="font-semibold text-white text-[16px]">{l.label}</span>{l.fee > 0 && <span className="text-[10px] font-bold text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-1 rounded border border-[#FFD60A]/20">+ {formatCurrency(l.fee)}</span>}</div>
                          <p className="text-[13px] text-gray-500">{l.sublabel}</p>
                        </button>
                        {selection.location?.id === l.id && l.allowsTableChoice && (
                          <div ref={refs.surface} className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                            <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo('vibe'); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === false ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>🛏 Na Cama</button>
                            <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo('vibe'); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === true ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>💆‍♂️ Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                          </div>
                        )}
                        {selection.location?.id === l.id && l.input && (
                            <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Digite o nome da cidade..." className="mt-3 w-full bg-[#1C1C1E] p-4 rounded-[18px] border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0A84FF] transition-all animate-fade-in" />
                        )}
                        {selection.location && (<button onClick={() => setSelection({...selection, location: null, useTable: null, city: ''})} className="mt-3 w-full py-2 text-[12px] text-gray-500 underline">Alterar Local</button>)}
                    </div>
                  )})}
                </div>
              </section>

              <div ref={refs.vibe}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Vibe Sonora</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   {musicVibes.map(vibe => (
                      <button key={vibe} onClick={() => { setSelection({...selection, music: vibe}); scrollTo('extras'); }} className={`px-6 py-3 rounded-[14px] border text-[13px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${selection.music === vibe ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>{vibe}</button>
                   ))}
                </div>
              </div>

              <div className="space-y-3" ref={refs.extras}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 mt-8">Extras Premium</h4>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, upgrade: !selection.upgrade}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">+30 Minutos</p><p className="text-[11px] text-gray-500">Mais tempo para curtir</p></div>
                  <span className="text-[#0A84FF] font-bold text-[15px]">+ {formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                </button>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, aroma: !selection.aroma}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">Aromaterapia</p><p className="text-[11px] text-gray-500">{priceData.levelName === 'Ouro' || priceData.levelName === 'Diamante' ? 'Cortesia VIP' : 'Óleos essenciais'}</p></div>
                  <div className="text-right">
                      {priceData.aromaCost === 0 ? <span className="text-[#30D158] font-bold text-[15px]">GRÁTIS</span> : <span className="text-[#0A84FF] font-bold text-[15px]">+ {formatCurrency(priceData.aromaCost)}</span>}
                  </div>
                </button>
              </div>

              <div className="mt-8 space-y-4">
                  <div className="flex gap-2">
                     <input placeholder="Código Promocional" onBlur={(e) => handleAddManualCoupon(e.target.value)} className="w-full custom-input text-white text-[15px] rounded-[14px] p-3.5 placeholder:text-gray-600 bg-[#1C1C1E]" />
                  </div>
                  {loyalty.inventory.map(c => SYSTEM_COUPONS[c] && (
                     <button key={c} onClick={() => setSelection({...selection, coupon: selection.coupon?.code === c ? null : SYSTEM_COUPONS[c]})} className={`w-full p-4 rounded-[16px] flex justify-between items-center border ${selection.coupon?.code === c ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#1C1C1E] border-white/5'}`}>
                         <span className="text-[13px] font-bold">{c}</span>{selection.coupon?.code === c && <span className="text-[10px] text-[#0A84FF] font-bold">APLICADO</span>}
                     </button>
                  ))}
              </div>

              <div className="mt-6" ref={refs.payment}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pagamento</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}><QrCode className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Pix</span></button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}><Banknote className="w-6 h-6 text-[#30D158]" /><span className="text-[13px] font-bold text-white">Dinheiro</span></button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'debit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'debit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}><CreditCard className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Débito</span></button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}><CreditCard className="w-6 h-6 text-[#FFD60A]" /><span className="text-[13px] font-bold text-white">Crédito</span></button>
                </div>
                {selection.paymentMethod === 'credit_card' && (
                  <div className="mt-3 ios-card p-4 rounded-[16px] animate-fade-in">
                    <label className="text-[11px] text-gray-400 block mb-2 font-bold uppercase">Parcelamento</label>
                    <select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#000] border border-white/10 text-white text-[15px] rounded-xl p-3 focus:border-[#0A84FF]">
                      {CARD_RATES.map((rate, i) => i > 0 && (<option key={i} value={i}>{i}x de {formatCurrency(priceData.final/i)}</option>))}
                    </select>
                  </div>
                )}
              </div>
              
              {canFinalize && (
                 <div ref={refs.receipt} className="mt-8 mx-2 mb-32 bg-white text-black rounded-[10px] p-6 font-mono text-sm shadow-2xl relative animate-slide-up transform rotate-1">
                    <div className="absolute top-0 left-0 right-0 h-4 bg-white" style={{background: 'linear-gradient(45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%)', backgroundSize: '12px 20px', backgroundPosition: '0 -10px'}}></div>
                    <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4 mt-2"><h3 className="font-bold text-lg uppercase tracking-wider">Massagens Relaxantes</h3></div>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between"><span>{selection.service.name}</span><span>{formatCurrency(selection.service.basePrice)}</span></div>
                        {selection.upgrade && <div className="flex justify-between text-gray-600 text-xs"><span>+ 30 Minutos</span><span>{formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span></div>}
                        {selection.useTable && <div className="flex justify-between text-gray-600 text-xs"><span>+ Maca Portátil</span><span>{formatCurrency(CONFIG.PRICES.MACA)}</span></div>}
                        {selection.aroma && <div className="flex justify-between text-gray-600 text-xs"><span>+ Aromaterapia</span><span>{formatCurrency(priceData.aromaCost)}</span></div>}
                        {priceData.fee > 0 && <div className="flex justify-between text-blue-600 font-bold border-t border-dashed border-gray-200 pt-2 mt-2"><span>Taxa Deslocamento</span><span>{formatCurrency(priceData.fee)}</span></div>}
                        {priceData.discount > 0 && <div className="flex justify-between text-red-500"><span>Desconto</span><span>-{formatCurrency(priceData.discount)}</span></div>}
                    </div>
                    <div className="border-t-2 border-black pt-4 flex justify-between items-end"><span className="font-bold text-xl">TOTAL</span><span className="font-bold text-2xl">{formatCurrency(priceData.final)}</span></div>
                 </div>
              )}
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
                      <span className="text-[26px] font-bold text-white tracking-tight">{selection.location.isPending ? formatCurrency(priceData.final) + ' + Taxa' : formatCurrency(priceData.final)}</span>
                      <p className="text-[10px] text-gray-500 leading-none mt-1">{selection.location.isPending ? '(Taxa de deslocamento à parte)' : 'Total Estimado'}</p>
                  </div>
              </div>
              <button disabled={!canFinalize} onClick={handleWhatsApp} className="w-full bg-[#0A84FF] hover:bg-[#007AFF] active:scale-[0.98] transition-all text-white font-bold py-4 rounded-[18px] shadow-[0_4px_20px_rgba(10,132,255,0.4)] flex justify-center items-center gap-2 text-[16px] disabled:opacity-50 disabled:shadow-none">CONFIRMAR NO WHATSAPP</button>
            </div>
          </div>
        )}

        {/* SUCESSO */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in pb-32">
            <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.4)] animate-scale"><Check className="w-10 h-10 text-white stroke-[3px]"/></div>
            <h2 className="text-3xl font-bold text-white mb-2">Pedido Enviado!</h2>
            <p className="text-gray-400 mb-8 text-[15px]">Verifique seu WhatsApp.</p>
            <button onClick={() => window.open(lastOrderLink, '_blank')} className="mb-4 w-full flex items-center justify-center gap-2 text-[15px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 py-3.5 rounded-xl border border-[#0A84FF]/20 hover:bg-[#0A84FF]/20 transition-colors"><Send className="w-4 h-4"/> Reenviar Mensagem</button>
            <button onClick={handleReset} className="w-full py-4 text-gray-500 text-[14px] font-medium">Voltar ao Início</button>
          </div>
        )}

        {/* MODAIS (FAQ / NOTIFICAÇÕES) */}
        {uiState.showFaq && (
          <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-5">
            <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[32px] p-8 border border-white/10 shadow-2xl animate-scale">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-[#0A84FF]"/> Ajuda</h3>
              <div className="space-y-5 text-[15px] text-gray-300 leading-relaxed">
                <div><h4 className="font-bold text-white mb-1">Conduta</h4><p className="text-sm">Apenas massagem terapêutica. Respeito total.</p></div>
                <div><h4 className="font-bold text-white mb-1">Pagamento</h4><p className="text-sm">Aceitamos Pix, Dinheiro e Cartão (com taxa).</p></div>
              </div>
              <button onClick={() => setUiState(p=>({...p, showFaq: false}))} className="mt-6 w-full bg-[#3A3A3C] text-white py-4 rounded-[18px] font-bold">Fechar</button>
            </div>
          </div>
        )}
        
        {uiState.showNotifications && (
          <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-5" onClick={() => setUiState(p=>({...p, showNotifications: false}))}>
            <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[32px] p-6 border border-white/10 shadow-2xl animate-slide-up" onClick={e=>e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold">Notificações</h3><button onClick={() => { setLoyalty(p => ({...p, notifications: p.notifications.map(n => ({...n, read: true}))})); setUiState(p=>({...p, showNotifications: false})) }}><X className="w-6 h-6"/></button></div>
                <div className="max-h-60 overflow-y-auto space-y-3">
                    {loyalty.notifications.length === 0 && <p className="text-gray-500 text-center py-4">Sem notificações.</p>}
                    {loyalty.notifications.map(n => (<div key={n.id} className="p-3 bg-[#2C2C2E] rounded-xl border border-white/5"><h4 className="font-bold text-sm">{n.title}</h4><p className="text-xs text-gray-400">{n.message}</p></div>))}
                </div>
            </div>
          </div>
        )}

      </div>
      )}
    </div>
  );
}
