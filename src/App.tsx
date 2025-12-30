import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, Siren, Send, ThumbsUp, Car, Menu, Fingerprint, Moon, Sun, Wind
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS (LUXURY DARK THEME - ONYX & GOLD)
// ==================================================================================

const globalStyles = `
/* --- RESET & BASE --- */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.02em;
  color: #E5E5E5;
  background: #000;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Hide */
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Inputs & Form Elements */
input, select { user-select: text; font-size: 17px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; -webkit-touch-callout: none; cursor: pointer; }

/* --- BACKGROUNDS (ATMOSFERA) --- */
.luxury-bg {
  background: 
    radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 80%),
    radial-gradient(circle at 50% 100%, rgba(212, 175, 55, 0.05), transparent 50%);
  background-attachment: fixed;
  background-size: cover;
  min-height: 100vh;
}

/* --- COMPONENTS: GLASSMORPHISM & CARDS --- */
.glass-card { 
  background: rgba(28, 28, 30, 0.65); 
  backdrop-filter: blur(40px) saturate(180%); 
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.2s ease;
}
.glass-card:active { transform: scale(0.985); }

/* --- BOTÕES (GOLD GRADIENT) --- */
.btn-gold {
  background: linear-gradient(135deg, #D4AF37 0%, #B4941F 100%);
  color: #000;
  border: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.2);
}
.btn-gold:active { transform: scale(0.98); opacity: 0.9; }
.btn-gold:disabled { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }

.btn-ghost {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
  transition: all 0.2s ease;
}
.btn-ghost:active { background: rgba(255, 255, 255, 0.1); border-color: rgba(255,255,255,0.2); }

/* --- INPUTS --- */
.custom-input {
  background: rgba(20, 20, 22, 0.6);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  transition: all 0.3s ease;
  font-family: monospace;
}
.custom-input:focus { border-color: #D4AF37; box-shadow: 0 0 0 1px rgba(212, 175, 55, 0.3); }

/* --- ANIMATIONS --- */
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pulse-slow { animation: pulse 3s infinite; }
.animate-shimmer { animation: shimmer 2.5s infinite linear; background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%); background-size: 200% 100%; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }

/* --- TEXT GRADIENTS --- */
.text-gold-gradient {
    background: linear-gradient(to right, #D4AF37, #F2E2A6, #D4AF37);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% auto;
    animation: shimmer 5s linear infinite;
}
`;

const IconBack = () => <ChevronLeft className="w-6 h-6 text-white" />;

// ==================================================================================
// 2. INTELLIGÊNCIA DE PREÇOS E DADOS (EXPANDIDO)
// ==================================================================================

const CONFIG = {
  PRICES: {
    MACA: 25, // Ajustado p/ valorização            
    AROMA_FULL: 15,      
    AROMA_DISCOUNT: 0, // VIP ganha grátis  
    UPGRADE_PCT: 0.40  
  }
};

// 💆‍♂️ MENU DE SERVIÇOS (COPYWRITING SENSUAL/MASCULINO)
const services = [
  { 
    id: 'tantrica_royal', name: 'Tântrica Royal Experience', type: 'sensual',
    description: 'A experiência definitiva. Conexão total, respiração guiada e toques bioenergéticos que despertam a virilidade. Inclui Lingam Massagem e finalização manual intensa.', 
    labelDuration: '60 min', minutes: 60, 
    basePrice: 150, 
    highlight: "MAIS ESCOLHIDA 👑", ratings: 5.0, reviews: 412, 
    details: ["Massagem Bioenergética", "Toque Íntimo/Lingam", "Body-to-Body (Nuru)", "Clímax Estendido"] 
  },
  { 
    id: 'relax_deep', name: 'Deep Tissue Relax', type: 'relax',
    description: 'Foco total em descompressão muscular. Ideal para executivos e rotinas estressantes. Sem viés erótico, apenas técnica apurada e alívio profundo.', 
    labelDuration: '50 min', minutes: 50, 
    basePrice: 100, 
    ratings: 4.8, reviews: 189, 
    details: ["Alívio de Tensão", "Música Theta Waves", "Óleos Aquecidos", "Reset Mental"] 
  },
];

// 📍 LOCAIS (COM ÍCONES E TEXTO DE SIGILO)
const locations = [
  { 
    id: 'motel', 
    label: 'Suíte Privada (Motel)', 
    sublabel: 'Vou até você. Total Discrição.', 
    fee: 80,
    allowsTableChoice: false, 
    estimatedTravelTime: '15 min',
    isMotel: true,
    icon: <Lock className="w-4 h-4 text-[#D4AF37]"/>
  },
  { 
    id: 'santa-fe', 
    label: 'Domicílio (Santa Fé)', 
    sublabel: 'No conforto do seu lar.', 
    fee: 45,
    allowsTableChoice: true, 
    estimatedTravelTime: '20 min',
    isUber: true,
    icon: <MapPin className="w-4 h-4 text-gray-400"/>
  },
  { 
    id: 'outras-cidades', 
    label: 'Cidades Vizinhas', 
    sublabel: 'Região de Jales/Urânia', 
    fee: 0,
    allowsTableChoice: false, 
    estimatedTravelTime: 'A combinar', 
    input: true,
    isPending: true,
    icon: <Car className="w-4 h-4 text-gray-400"/>
  },
];

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

// ==================================================================================
// 3. SISTEMA DE FIDELIDADE (BLACK CARD GAMIFICATION)
// ==================================================================================

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (1ª Vez)' },
  'SILVERVIP': { code: 'SILVERVIP', type: 'fixed', value: 20, desc: 'R$ 20 OFF (Nível Silver)' },
  'GOLDVIP': { code: 'GOLDVIP', type: 'fixed', value: 40, desc: 'R$ 40 OFF (Nível Gold)' },
  'BLACKVIP': { code: 'BLACKVIP', type: 'fixed', value: 80, desc: 'R$ 80 OFF (Nível Black)' },
};

const LEVELS = [
  { name: 'Member', min: 0, rewardCode: null, icon: '🛡️', color: 'text-gray-400', perks: ["Acesso ao App"] },
  { name: 'Silver', min: 400, rewardCode: 'SILVERVIP', icon: '🥈', color: 'text-gray-200', perks: ["Cupom R$ 20", "Preferência na Agenda"] },
  { name: 'Gold', min: 1000, rewardCode: 'GOLDVIP', icon: '🥇', color: 'text-[#D4AF37]', perks: ["Cupom R$ 40", "Aroma Grátis"] },
  { name: 'Black', min: 2500, rewardCode: 'BLACKVIP', icon: '💎', color: 'text-white', perks: ["Cupom R$ 80", "Atendimento Prioritário"] },
];

const musicVibes = ['Zen 🧘', 'Deep House 🔊', 'Natureza 🌿', 'Silêncio 🤫']; 

const REVIEWS_DB = [
  { t: "Sou casado, o sigilo foi total. A tântrica me surpreendeu, finalização manual perfeita.", a: "Sigiloso (44 anos)", r: 5 },
  { t: "Nunca tinha feito. A sensibilidade que ele desperta é absurda. Gozei muito.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Ambiente discreto. Toque íntimo com respeito e técnica. Alívio imediato.", a: "Curioso", r: 5 },
  { t: "Mão leve e firme. A manipulação no lingam me levou às alturas.", a: "Anônimo", r: 5 },
  { t: "Minha esposa nem desconfia. Foi meu escape. Descarga de energia intensa.", a: "Casado (Jales)", r: 5 },
];

// --- HELPERS ---
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(8); }; // Vibração mais premium
const generateBookingId = () => Math.random().toString(36).substr(2, 6).toUpperCase();

// ==================================================================================
// 4. COMPONENTES DE UI (REESTRUTURADOS)
// ==================================================================================

const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  const msgs = ["🔥 Agenda da noite quase cheia", "🛡️ Ambiente 100% Seguro", "👀 3 pessoas vendo a agenda agora"];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%msgs.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-in flex items-center gap-2 bg-[#1C1C1E]/90 border border-[#D4AF37]/20 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
        <div className="w-1.5 h-1.5 bg-[#32D74B] rounded-full animate-pulse" />
        <span className="text-[10px] text-gray-300 font-medium tracking-wide uppercase">{msgs[idx]}</span>
      </div>
    </div>
  );
};

// --- NOVO CARTÃO BLACK (Member ID) ---
const BlackCard = ({ data, privacyMode, onTogglePrivacy }) => {
  const safeSpent = (data && typeof data.totalSpent === 'number') ? data.totalSpent : 0;
  const currentLevel = [...LEVELS].reverse().find(l => safeSpent >= l.min) || LEVELS[0];
  const nextLevel = [...LEVELS].find(l => l.min > safeSpent);
  const progress = nextLevel ? ((safeSpent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <div className="glass-card p-6 rounded-[24px] relative overflow-hidden mb-6 group border-t border-white/10 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] transition-all duration-500">
      {/* Efeitos de Fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#000] to-[#1a1a1a] z-0"></div>
      <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-[#D4AF37]/10 blur-[80px] rounded-full pointer-events-none animate-pulse-slow"></div>
      
      {/* Conteúdo */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
            <Fingerprint className="w-8 h-8 text-[#D4AF37] opacity-80" />
            <div className="text-right">
                <p className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-[0.2em] mb-1">Status</p>
                <div className="flex items-center gap-2 justify-end">
                    <span className={`text-lg font-bold ${currentLevel.color} tracking-widest uppercase`}>{currentLevel.name}</span>
                    <span className="text-xl">{currentLevel.icon}</span>
                </div>
            </div>
        </div>

        <div className="mb-4">
             <div className="flex justify-between items-end mb-2">
                <span className="text-gray-500 text-[10px] uppercase tracking-wider">Total Investido</span>
                <button onClick={onTogglePrivacy} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    {privacyMode ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                </button>
             </div>
             <div className={`text-2xl font-mono text-white tracking-widest ${privacyMode ? 'blur-md select-none opacity-50' : ''}`}>
                {formatCurrency(safeSpent)}
             </div>
        </div>

        {/* Barra de Progresso Dourada */}
        <div className="relative h-1.5 bg-gray-800 rounded-full mb-2 overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#8E7015] via-[#D4AF37] to-[#F2E2A6] transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[9px] text-gray-500 font-medium tracking-wide uppercase">
            <span>{currentLevel.name}</span>
            <span>{nextLevel ? nextLevel.name : 'Max'}</span>
        </div>
      </div>
    </div>
  );
};

// --- REVIEWS CAROUSEL ---
const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
  const currentReview = REVIEWS_DB[idx];
  
  return (
    <div className="relative h-auto min-h-[100px] flex items-center justify-center mb-8">
      <div key={idx} className="w-full animate-fade-in px-5 py-4 bg-[#1C1C1E] rounded-[24px] border border-white/5 border-l-4 border-l-[#D4AF37] shadow-lg">
        <div className="flex justify-between items-start mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_,k) => <Star key={k} className={`w-3 h-3 ${k < currentReview.r ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-800'}`}/>)}
            </div>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">{currentReview.a}</span>
        </div>
        <p className="text-[13px] text-gray-200 font-medium leading-relaxed italic">"{currentReview.t}"</p>
      </div>
    </div>
  );
};

// --- SELETOR DE DATA OTIMIZADO (GRID LIMPO) ---
const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const days = Array.from({length: 12}, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() + i); return d;
  });
  
  const periods = [
      { label: 'Tarde 🌤️', slots: ['13:00', '14:00', '15:00', '16:00', '17:00'] },
      { label: 'Noite 🌙', slots: ['18:00', '19:00', '20:00', '21:00'] }
  ];

  return (
    <div className="w-full select-none">
      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">1. Data da Sessão</h4>
      <div className="grid grid-cols-4 gap-2 mb-6 animate-fade-in">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate();
          const isToday = i === 0;
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} 
              className={`relative flex flex-col items-center justify-center h-[75px] rounded-[16px] transition-all border 
              ${isSel ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg scale-[1.03] z-10' : 'bg-[#1C1C1E] text-gray-400 border-white/5 hover:bg-[#2C2C2E]'}`}>
              {isToday && <span className="absolute -top-2 bg-[#32D74B] text-black text-[8px] font-bold px-1.5 py-0.5 rounded">HOJE</span>}
              <span className="text-[9px] uppercase font-bold tracking-wide mb-0.5">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
              <span className="text-lg font-bold font-mono leading-none">{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="animate-slide-up space-y-4 pt-2 border-t border-white/5">
           <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">2. Horário</h4>
           {periods.map((period, idx) => (
                <div key={idx}>
                    <p className="text-[10px] text-gray-600 mb-2 font-bold ml-1">{period.label}</p>
                    <div className="grid grid-cols-4 gap-2">
                        {period.slots.map(t => (
                           <button key={t} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                             className={`py-2.5 rounded-[12px] text-[13px] font-semibold transition-all border
                             ${selectedTime === t ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg scale-105' : 'bg-[#2C2C2E] text-gray-300 border-white/5 hover:bg-[#3A3A3C]'}`}>
                             {t}
                           </button>
                        ))}
                    </div>
                </div>
           ))}
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
          if (inventory.includes(codeUpper)) { alert('Cupom já adicionado!'); } 
          else { onAddManual(codeUpper); setManualCode(''); triggerHaptic(); }
      } else { alert('Cupom inválido.'); }
  };

  return (
    <div className="space-y-4 mt-8">
      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">Carteira Digital</h4>
      <div className="flex gap-2 mb-3">
          <input value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Código Promocional" className="w-full custom-input text-white text-[15px] rounded-[14px] p-3.5 placeholder:text-gray-600" />
          <button onClick={handleManualAdd} className="bg-[#2C2C2E] border border-white/10 text-white px-5 rounded-[14px] font-bold text-[13px] hover:bg-[#3A3A3C]">Add</button>
      </div>
      {myCoupons.length > 0 ? (
        <div className="space-y-3">
          {myCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <button key={coupon.code} onClick={() => { triggerHaptic(); isApplied ? onRemove() : onApply(coupon.code); }} className={`w-full p-4 rounded-[16px] flex justify-between items-center transition-all ${isApplied ? 'bg-[#D4AF37]/20 border border-[#D4AF37]' : 'bg-[#1C1C1E] border border-white/5'}`}>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-1.5 py-0.5 rounded tracking-wider border border-[#D4AF37]/20">{coupon.code}</span>
                    {isApplied && <span className="text-[10px] text-white font-bold animate-pulse">ATIVO</span>}
                  </div>
                  <p className="text-[13px] text-gray-400 mt-1">{coupon.desc}</p>
                </div>
                {isApplied ? <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" /> : <div className="w-5 h-5 rounded-full border border-gray-600"></div>}
              </button>
            )
          })}
        </div>
      ) : <p className="text-center text-[12px] text-gray-600 py-4 border border-dashed border-white/10 rounded-[16px]">Sua carteira está vazia.</p>}
    </div>
  );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  
  // Refs & UI State
  const locationRef = useRef(null);
  const vibeRef = useRef(null);
  const extrasRef = useRef(null);
  const paymentRef = useRef(null);
  const homeRef = useRef(null);
  const receiptRef = useRef(null);

  const [loyalty, setLoyalty] = useState(() => {
    const saved = localStorage.getItem('thaly_system_v23_gold'); 
    return saved ? JSON.parse(saved) : { savedName: '', totalSpent: 0, inventory: ['BEMVINDO'], notifications: [] };
  });

  const [user, setUser] = useState({ name: loyalty.savedName || '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
  const [showFaq, setShowFaq] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false); 
  const [weatherHint, setWeatherHint] = useState("");
  const [lastOrderLink, setLastOrderLink] = useState(""); 
    
  const surfaceRef = useRef(null);

  // Init
  useEffect(() => { 
    setTimeout(() => setLoading(false), 2000); 
    const hr = new Date().getHours();
    setWeatherHint(hr < 18 ? "☀️ 28°C Dia Ensolarado" : "🌙 22°C Noite Agradável");
  }, []);

  useEffect(() => { localStorage.setItem('thaly_system_v23_gold', JSON.stringify(loyalty)); }, [loyalty]);

  useEffect(() => {
    if (selection.location?.allowsTableChoice && step === 'configure') {
      setTimeout(() => surfaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }
  }, [selection.location, step]);

  // Actions
  const scrollTo = (ref) => { setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); };
  const handleQuickSchedule = () => { triggerHaptic(); setStep(user.name ? 'services' : 'identity'); };
  const handlePanic = () => { window.location.href = "https://www.google.com/search?q=previsão+do+tempo"; };
  const handleShare = () => { if(navigator.share) navigator.share({title:'Thalyson Massagens', url: window.location.href}); };

  const handleAddManualCoupon = (code) => {
      setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]}));
  };

  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  // --- LÓGICA DE PREÇOS ---
  const getCurrentLevel = () => [...LEVELS].reverse().find(l => (loyalty.totalSpent || 0) >= l.min) || LEVELS[0];
  const getAromaPrice = () => {
      const level = getCurrentLevel().name;
      return (level === 'Ouro' || level === 'Diamante') ? 0 : (level === 'Prata' ? CONFIG.PRICES.AROMA_DISCOUNT : CONFIG.PRICES.AROMA_FULL);
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
      const discountValue = selection.coupon.type === 'percent' ? (discountableAmount * selection.coupon.value / 100) : selection.coupon.value;
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
    
    // Calcula valores p/ mensagem
    let basePrice = selection.service.basePrice;
    let extrasText = "";
    if (selection.upgrade) { basePrice += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT; extrasText += `\n⚡ Extra 30min (+${formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)})`; }
    if (selection.useTable) { basePrice += CONFIG.PRICES.MACA; extrasText += `\n🛏 Maca Portátil (+${formatCurrency(CONFIG.PRICES.MACA)})`; }
    let aromaPrice = selection.aroma ? getAromaPrice() : 0;
    if (selection.aroma) extrasText += `\n🌸 Aroma (${aromaPrice === 0 ? 'VIP Free' : formatCurrency(aromaPrice)})`;

    let feeVal = selection.location.fee || 0;
    let discountVal = 0;
    if (selection.coupon) discountVal = selection.coupon.type === 'percent' ? (basePrice * selection.coupon.value / 100) : selection.coupon.value;

    const totalFinal = calcFinalPrice();
    const bookingId = generateBookingId(); 

    // Atualiza Fidelidade
    const newTotal = (loyalty.totalSpent || 0) + basePrice; 
    setLoyalty(prev => ({ ...prev, savedName: user.name, totalSpent: newTotal, notifications: [{id: Date.now(), title: 'Reserva Confirmada', message: 'Aguardando pagamento.', read: false, timestamp: Date.now(), icon: 'calendar'}, ...prev.notifications] }));

    let locationString = selection.location.label;
    if(selection.location.isMotel) locationString += " (Sigilo Total)";
    if(selection.location.id === 'outras-cidades' && selection.city) locationString += ` (${selection.city})`;

    let msg = `*🔒 RESERVA VIP #${bookingId}*
👤 *Cliente:* ${user.name}
📅 ${selection.date.toLocaleDateString('pt-BR')} às ${selection.time}
💆 *Experiência:* ${selection.service.name}
📍 *Local:* ${locationString}

*DETALHES:*
• Base: ${formatCurrency(selection.service.basePrice)}${extrasText}
${discountVal > 0 ? `• Cupom: -${formatCurrency(discountVal)}` : ''}
${feeVal > 0 ? `• Taxa Local: ${formatCurrency(feeVal)}` : ''}

💰 *TOTAL: ${formatCurrency(totalFinal)}*
💳 Pagamento: ${selection.paymentMethod.toUpperCase()}
------------------------------
🎵 Vibe: ${selection.music}`;

    const url = `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`;
    setLastOrderLink(url); 
    window.open(url, '_blank');
    setStep('success');
  };

  // --- COMPONENTE RECIBO (FISCAL STYLE) ---
  const OrderReceipt = () => (
    <div className="mt-8 mx-2 mb-32 bg-white text-black rounded-[6px] p-6 font-mono text-sm shadow-2xl relative animate-slide-up rotate-1">
      <div className="absolute top-0 left-0 right-0 h-4 bg-white" style={{background: 'linear-gradient(45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%)', backgroundSize: '12px 20px', backgroundPosition: '0 -10px'}}></div>
      <div className="text-center border-b border-dashed border-gray-400 pb-4 mb-4 mt-2">
         <h3 className="font-bold text-lg uppercase tracking-wider">THALYSON VIP</h3>
         <p className="text-[10px] text-gray-500">{new Date().toLocaleString()}</p>
      </div>
      <div className="space-y-2">
         <div className="flex justify-between"><span>{selection.service.name}</span><span>{formatCurrency(selection.service.basePrice)}</span></div>
         {selection.upgrade && <div className="flex justify-between text-gray-600"><span>+ 30 Minutos</span><span>{formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span></div>}
         {selection.useTable && <div className="flex justify-between text-gray-600"><span>+ Maca</span><span>{formatCurrency(CONFIG.PRICES.MACA)}</span></div>}
         {selection.location.fee > 0 && <div className="flex justify-between text-gray-600"><span>Taxa Local</span><span>{formatCurrency(selection.location.fee)}</span></div>}
         {selection.coupon && <div className="flex justify-between text-red-500"><span>Desconto</span><span>- {formatCurrency(calcBaseTotal() - (calcFinalPrice()))}</span></div>}
      </div>
      <div className="border-t-2 border-black pt-2 mt-4 flex justify-between text-lg font-bold">
         <span>TOTAL</span>
         <span>{formatCurrency(calcFinalPrice())}</span>
      </div>
      <div className="mt-4 text-center text-[10px] uppercase text-gray-400">Obrigado pela preferência</div>
    </div>
  );

  // --- HAMBURGUER MENU ---
  const HamburgerMenu = () => {
      if(!showMenu) return null;
      return (
          <div className="absolute top-16 right-6 w-52 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden animate-slide-up origin-top-right">
              <button onClick={() => { setShowFaq(true); setShowMenu(false); }} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5 active:bg-white/20"><HelpCircle className="w-4 h-4 text-gray-400"/> Ajuda / Conduta</button>
              <a href="https://instagram.com/thalymassagens" target="_blank" onClick={() => setShowMenu(false)} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5 active:bg-white/20"><Instagram className="w-4 h-4 text-[#E1306C]"/> Instagram</a>
              <button onClick={() => { handleShare(); setShowMenu(false); }} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5 active:bg-white/20"><Share2 className="w-4 h-4 text-gray-400"/> Compartilhar</button>
          </div>
      )
  }

  // --- HEADER GLOBAL ---
  const GlobalHeader = () => (
      <div className="absolute top-0 w-full z-50 px-6 pt-12 pb-8 flex justify-between items-center pointer-events-none bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="pointer-events-auto">
             {step !== 'home' && step !== 'success' ? (
                <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10 bg-black/20 backdrop-blur-md border border-white/5"><IconBack /></button>
             ) : (
                <div className="flex flex-col items-start animate-fade-in">
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-widest mb-0.5">{new Date().toLocaleDateString('pt-BR', {weekday:'long'})}</span>
                    <span className="text-[13px] font-bold text-gray-200 leading-tight flex items-center gap-1">{weatherHint}</span>
                </div>
             )}
          </div>
          <div className="flex items-center gap-3 pointer-events-auto relative">
              <button onClick={handlePanic} className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 active:bg-red-500 active:text-white transition-all"><LogOut className="w-4 h-4"/></button>
              <button onClick={() => setShowMenu(!showMenu)} className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-95 ${showMenu ? 'bg-white text-black' : 'bg-[#1C1C1E]/80 text-gray-400'}`}>{showMenu ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}</button>
              <HamburgerMenu />
          </div>
      </div>
  );

  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-6 font-sans text-gray-200 bg-black" onClick={() => { if(showMenu) setShowMenu(false); }}>
      <style>{globalStyles}</style>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
          <div className="relative w-20 h-20 mb-8">
             <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/20"></div>
             <Fingerprint className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-[#D4AF37] animate-pulse" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.4em] text-[#D4AF37] uppercase">Ambiente Seguro</span>
        </div>
      ) : (
      <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] luxury-bg">
        
        <GlobalHeader />

        {/* --- HOME --- */}
        {step === 'home' && (
          <div className="flex-1 p-6 overflow-y-auto pb-32 pt-32" ref={homeRef}>
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold text-white tracking-tight leading-[0.95] mb-2">Escape da <br/><span className="text-gold-gradient">Rotina.</span></h1>
              <p className="text-sm text-gray-400 max-w-[80%] leading-relaxed">Massagem exclusiva para homens exigentes em Santa Fé do Sul.</p>
            </div>

            <BlackCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            <LiveStatus />

            <div className="mb-3 px-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Avaliações Verificadas</div>
            <ReviewsCarousel />
            
            <div className="mt-4">
              <button onClick={handleQuickSchedule} className="w-full btn-gold py-5 rounded-[22px] shadow-lg flex justify-center items-center gap-2 text-[16px] animate-pulse-slow">
                AGENDAR SESSÃO <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-600 mt-6 uppercase tracking-widest flex items-center justify-center gap-1"><Lock className="w-3 h-3"/> Sigilo Absoluto</p>
          </div>
        )}

        {/* --- IDENTITY --- */}
        {step === 'identity' && (
          <div className="flex-1 p-6 pt-36 animate-fade-in flex flex-col h-full pb-32">
            <h2 className="text-2xl font-bold text-white mb-2">Discrição</h2>
            <p className="text-gray-400 text-[14px] mb-8">Precisamos identificar você para manter a segurança do nosso clube privado.</p>
            
            <div className="glass-card p-6 rounded-[24px] mb-6">
               <label className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider block mb-3">Como prefere ser chamado?</label>
               <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent border-b border-white/20 text-xl py-2 text-white placeholder:text-gray-700 focus:border-[#D4AF37] transition-colors" placeholder="Nome ou Apelido" />
            </div>

            <button onClick={() => { triggerHaptic(); setUser({...user, isAdult: !user.isAdult}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all mb-4 ${user.isAdult ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#1C1C1E] border-transparent'}`}>
               <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${user.isAdult ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-gray-600'}`}>{user.isAdult && <Check className="w-3.5 h-3.5" />}</div>
               <span className="text-[15px] font-medium text-gray-300">Concordo com os termos de sigilo</span>
            </button>

            <button disabled={!user.name || !user.isAdult} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full btn-gold py-4 rounded-[22px] text-[16px] disabled:opacity-50 mt-auto">ACESSAR MENU VIP</button>
          </div>
        )}

        {/* --- SERVICES --- */}
        {step === 'services' && (
          <div className="flex-1 p-6 pt-36 overflow-y-auto pb-32 animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-6">Menu de Experiências</h2>
            <div className="space-y-6">
              {services.map(s => (
                <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className={`glass-card p-6 rounded-[30px] active:scale-98 transition-transform group relative overflow-hidden`}>
                  {s.highlight && <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] font-bold px-3 py-1.5 rounded-bl-[20px] z-10">{s.highlight}</div>}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="mb-4 relative z-10">
                    <h3 className="font-bold text-white text-[20px] leading-tight mb-1">{s.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[#D4AF37] font-bold text-[18px]">{formatCurrency(s.basePrice)}</span>
                        <span className="text-gray-500 text-[13px]">• {s.labelDuration}</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-gray-300 leading-relaxed mb-5 opacity-90 relative z-10">{s.description}</p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {s.details.slice(0,3).map((d, idx) => (
                        <span key={idx} className="text-[10px] text-gray-300 bg-white/5 px-2 py-1 rounded border border-white/5">{d}</span>
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
            <div className="glass-card p-5 rounded-[22px] mb-8 flex items-center justify-between border-l-4 border-l-[#D4AF37]">
              <div>
                <h3 className="font-bold text-white text-[17px]">{selection.service.name}</h3>
                <p className="text-[12px] text-gray-400 mt-0.5">Personalização da Sessão</p>
              </div>
            </div>

            <div className="space-y-10">
              <section>
                <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />
              </section>

              <section ref={locationRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">3. Local</h4>
                <div className="space-y-3">
                  {locations.map(l => (
                    <div key={l.id} className="animate-fade-in">
                        <button onClick={() => { triggerHaptic(); setSelection({...selection, location: l, useTable: null}); scrollTo(vibeRef); }} className={`w-full p-5 rounded-[22px] border text-left transition-all duration-300 ${selection.location?.id === l.id ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#1C1C1E] border-transparent'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-3">
                                {l.icon} <span className="font-semibold text-white text-[16px]">{l.label}</span> 
                            </div>
                            {l.fee > 0 && <span className="text-[10px] font-bold text-[#D4AF37] font-mono">+ {formatCurrency(l.fee)}</span>}
                          </div>
                          <p className="text-[13px] text-gray-500 ml-7">{l.sublabel}</p>
                        </button>
                        
                        {selection.location?.id === l.id && l.id === 'santa-fe' && l.allowsTableChoice && (
                          <div ref={surfaceRef} className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                            <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === false ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>🛏 Na Cama</button>
                            <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === true ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>💆‍♂️ Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                          </div>
                        )}
                        {selection.location?.id === l.id && l.id === 'outras-cidades' && (
                            <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Digite a cidade..." className="mt-3 w-full custom-input p-4 rounded-[18px]" />
                        )}
                    </div>
                  ))}
                </div>
              </section>

              <div ref={vibeRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">4. Vibe Sonora</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   {musicVibes.map(vibe => (
                      <button key={vibe} onClick={() => { setSelection({...selection, music: vibe}); scrollTo(extrasRef); }} className={`px-6 py-3 rounded-[14px] border text-[13px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${selection.music === vibe ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>
                        {vibe}
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-3" ref={extrasRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 mt-8">5. Upgrades VIP</h4>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, upgrade: !selection.upgrade}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">+30 Minutos</p><p className="text-[11px] text-gray-500">Estender o clímax</p></div>
                  <span className="text-[#D4AF37] font-bold text-[15px]">+ {formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                </button>

                <button onClick={() => { triggerHaptic(); setSelection({...selection, aroma: !selection.aroma}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#D4AF37]/10 border-[#D4AF37]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">Aromaterapia</p><p className="text-[11px] text-gray-500">Óleos essenciais</p></div>
                  <div className="text-right">
                      {getAromaPrice() < CONFIG.PRICES.AROMA_FULL ? (
                          <><span className="text-gray-500 line-through text-[11px] mr-2">{formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span><span className="text-[#30D158] font-bold text-[15px]">{getAromaPrice() === 0 ? 'GRÁTIS' : `+${formatCurrency(getAromaPrice())}`}</span></>
                      ) : (<span className="text-[#D4AF37] font-bold text-[15px]">+ {formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span>)}
                  </div>
                </button>
              </div>

              <CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(code) => { setSelection({...selection, coupon: SYSTEM_COUPONS[code]}); scrollTo(paymentRef); }} onRemove={() => setSelection({...selection, coupon: null})} onAddManual={handleAddManualCoupon}/>

              <div className="mt-6" ref={paymentRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pagamento</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#D4AF37]/20 border-[#D4AF37]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <QrCode className="w-6 h-6 text-[#D4AF37]" /><span className="text-[13px] font-bold text-white">Pix</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#D4AF37]/20 border-[#D4AF37]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <Banknote className="w-6 h-6 text-[#30D158]" /><span className="text-[13px] font-bold text-white">Dinheiro</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'debit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'debit_card' ? 'bg-[#D4AF37]/20 border-[#D4AF37]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-white" /><span className="text-[13px] font-bold text-white">Débito</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#D4AF37]/20 border-[#D4AF37]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-[#FFD60A]" /><span className="text-[13px] font-bold text-white">Crédito</span>
                  </button>
                </div>
                
                {selection.paymentMethod === 'credit_card' && (
                  <div className="mt-3 ios-card p-4 rounded-[16px] animate-fade-in">
                    <label className="text-[11px] text-gray-400 block mb-2 font-bold uppercase">Parcelamento</label>
                    <select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#000] border border-white/10 text-white text-[15px] rounded-xl p-3 focus:border-[#D4AF37]">
                      {CARD_RATES.map((rate, i) => i > 0 && (<option key={i} value={i}>{i}x de {formatCurrency(calcFinalPrice()/i)}</option>))}
                    </select>
                  </div>
                )}
              </div>
              
              {canFinalize && <div ref={receiptRef}><OrderReceipt /></div>}
            </div>
          </div>
        )}

        {/* FOOTER FIXO (TOTAL BAR) */}
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
                      <p className="text-[10px] text-gray-500 leading-none mt-1">{selection.location.isMotel ? '(Inclui Taxa Motel)' : selection.location.isUber ? '(Inclui Deslocamento)' : 'Valor da Sessão'}</p>
                  </div>
              </div>
              <button disabled={!canFinalize} onClick={handleWhatsApp} className="w-full btn-gold py-4 rounded-[18px] shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex justify-center items-center gap-2 text-[16px] disabled:opacity-50 disabled:shadow-none">CONFIRMAR RESERVA</button>
            </div>
          </div>
        )}

        {/* TELA SUCESSO */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in pb-32">
            <div className="w-24 h-24 bg-[#32D74B]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.4)] animate-scale"><Check className="w-10 h-10 text-[#32D74B] stroke-[3px]"/></div>
            <h2 className="text-3xl font-bold text-white mb-2">Reserva Solicitada</h2>
            <p className="text-gray-400 mb-8 text-[15px]">Aguarde a confirmação segura no WhatsApp.</p>
            
            <button onClick={() => window.open(lastOrderLink, '_blank')} className="mb-4 w-full flex items-center justify-center gap-2 text-[15px] font-bold text-[#D4AF37] bg-[#D4AF37]/10 py-3.5 rounded-xl border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 transition-colors"><Send className="w-4 h-4"/> Reenviar Mensagem</button>
            <button onClick={handleReset} className="w-full py-4 text-gray-500 text-[14px] font-medium">Voltar ao Início</button>
          </div>
        )}

        {/* FAQ MODAL */}
        {showFaq && (
          <div className="absolute inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-5">
            <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[32px] p-8 border border-white/10 shadow-2xl animate-scale">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-[#D4AF37]"/> Ajuda & Conduta</h3>
              <div className="space-y-5 text-[15px] text-gray-300 leading-relaxed">
                <div><h4 className="font-bold text-white mb-1 flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400"/> Conduta</h4><p className="text-sm">Apenas massagem terapêutica e tântrica. Respeito e discrição acima de tudo.</p></div>
                <div><h4 className="font-bold text-white mb-1 flex items-center gap-2"><Tag className="w-4 h-4 text-gray-400"/> Cupons</h4><p className="text-sm">Descontos VIP (Gold/Black) são aplicados automaticamente.</p></div>
                <div className="pt-6 border-t border-white/10">
                    <button onClick={() => { if(window.confirm("Apagar todos os dados e resetar nível?")) { localStorage.clear(); window.location.reload(); }}} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4"/> Resetar App (Pânico)</button>
                </div>
              </div>
              <button onClick={() => setShowFaq(false)} className="mt-6 w-full bg-[#3A3A3C] text-white py-4 rounded-[18px] font-bold hover:bg-[#4A4A4C] transition-colors">Fechar</button>
            </div>
          </div>
        )}

      </div>
      )}
    </div>
  );
}
