import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ArrowRight, Check, X, MapPin, Calendar, Clock,
  Shield, Star, Instagram, MessageCircle, Bell, Tag, 
  Share2, LogOut, Zap, Crown, Music, Trash2, CreditCard, 
  Banknote, QrCode, Info, CheckCircle2, Menu, Hand, 
  Flame, Wind, Sparkles, AlertCircle, Eye, EyeOff
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS & TEMA
// ==================================================================================

const globalStyles = `
/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif; 
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
    radial-gradient(100% 100% at 50% 100%, rgba(37, 99, 235, 0.08), transparent 50%);
  background-attachment: fixed;
  background-size: cover;
  min-height: 100vh;
}

/* --- COMPONENTS --- */
.ios-card { 
  background: rgba(30, 30, 35, 0.7); 
  backdrop-filter: blur(30px) saturate(180%); 
  -webkit-backdrop-filter: blur(30px) saturate(180%);
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
  background: linear-gradient(135deg, #2563EB, #1d4ed8);
  color: white;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  border: none;
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }
.ios-btn-primary:disabled { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }

/* --- INPUTS --- */
.custom-input {
  background: rgba(20, 20, 22, 0.6);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  transition: all 0.3s ease;
}
.custom-input:focus { border-color: #2563EB; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2); }

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

const IconBack = () => <ChevronLeft className="w-6 h-6 text-[#2563EB]" />;

// --- COMPONENTE TOAST ---
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-[300] bg-[#10B981] text-black px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-slide-up font-bold text-[14px]">
      <CheckCircle2 className="w-5 h-5 text-black" />
      <span>{message}</span>
    </div>
  );
};

// ==================================================================================
// 2. CENTRAL DE PREÇOS E DADOS
// ==================================================================================

const CONFIG = {
  WHATSAPP: "5517991360413",
  PRICES: {
    MACA: 20,            
    AROMA_FULL: 15,      
    AROMA_DISCOUNT: 0, // Grátis para VIPs
    UPGRADE_PCT: 0.4,
    TOUCH: 55 
  }
};

const services = [
  { 
    id: 'sensorial', name: 'Experiência Sensorial', type: 'sensual',
    description: 'A mais procurada. Relaxamento profundo seguido de toques sensitivos e conexão intensa.', 
    labelDuration: '60 min', minutes: 60, 
    basePrice: 190, 
    highlight: "TOP 1 🔥", ratings: 5.0, reviews: 310, 
    details: ["Relaxante + Tântrica", "Massagem Lingam", "Finalização Manual", "Corpo a corpo"] 
  },
  { 
    id: 'relaxante', name: 'Descompressão Total', type: 'relax',
    description: 'Foco total em tirar dores e tensão muscular. Costas, pescoço e pernas. Zero estresse.', 
    labelDuration: '50 min', minutes: 50, 
    basePrice: 140, 
    ratings: 4.9, reviews: 142, 
    details: ["Foco em Dores", "Óleo Neutro", "Toque Firme", "Sem Toques Íntimos"] 
  },
];

// LOCALIZAÇÃO SIMPLIFICADA
const locations = [
  { 
    id: 'domicilio', 
    label: 'No seu Local (Casa ou Hotel)', 
    sublabel: 'Vou até você (Sigilo Total)', 
    fee: 30, // Taxa base de deslocamento
    allowsTableChoice: true, 
    estimatedTravelTime: '20-30 min',
    input: true
  }
];

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

// ==================================================================================
// 3. LÓGICA DO SISTEMA (CUPONS & REVIEWS)
// ==================================================================================

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (1ª Vez)' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
};

const LEVELS = [
  { name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', perks: ["Acesso VIP", "Agendamento Rápido"] },
  { name: 'Prata', min: 400, rewardCode: null, icon: '🥈', perks: ["Aroma 50% OFF", "Prioridade"] },
  { name: 'Ouro', min: 900, rewardCode: null, icon: '🥇', perks: ["Aroma GRÁTIS", "Atendimento Noturno"] },
  { name: 'Diamante', min: 1800, rewardCode: null, icon: '💎', perks: ["Descontos Exclusivos", "Prioridade Total"] },
];

const musicVibes = ['Silêncio 🤫', 'Natureza 🌿', 'Deep House 🔊', 'Zen 🧘']; 

// --- REVIEWS EXPANDIDAS ---
const REVIEWS_DB = [
  { t: "Sou casado, o sigilo foi total. A massagem tântrica me surpreendeu, finalização manual perfeita.", a: "Sigiloso (44 anos)", r: 5 },
  { t: "Tava carente há meses. O toque dele preencheu um vazio em mim. Não é só sexo, é conexão.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Massagem top, a melhor que já fiz na região. O cara é profissional.", a: "Carlos M.", r: 5 },
  { t: "Sou empresário, vivo estressado. Essa hora na maca me salvou. O final foi explosivo.", a: "M. (Ouro)", r: 5 },
  { t: "Local limpo, discreto. Fiquei meio tímido no começo mas ele deixa a gente super a vontade.", a: "Felipe", r: 5 },
  { t: "O cara é gato e tem pegada. O extra de tocar faz toda a diferença pra quem curte interagir.", a: "Cliente VIP", r: 5 },
  { t: "Sensação única. Gozei litros no final. A técnica tântrica é real mesmo.", a: "Sigilo (38)", r: 5 },
  { t: "Sou hétero curioso, fui pra testar e voltei renovado. Respeito total.", a: "Anon", r: 5 },
  { t: "Muito bom tirar a roupa e sentir o corpo dele no meu. O óleo quente ajuda muito.", a: "T.L.", r: 5 },
  { t: "Atendimento no hotel foi perfeito, chegou rápido e com tudo que precisava.", a: "Viajante", r: 5 },
  { t: "Recomendo a experiência sensorial. Vale cada centavo.", a: "Gustavo", r: 5 }
];

const LIVE_STATUS_MSGS = [
    "Atendimento em andamento 💆‍♂️", 
    "Horário das 20h acabou de sair 🌙", 
    "Anônimo acabou de agendar 🔥",
    "Empresário reservou agora 💼",
    "Agenda de hoje quase cheia! ⚡",
];

// --- HELPERS ---
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
const generateBookingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 4; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return result;
};

// ==================================================================================
// 4. COMPONENTES DE UI
// ==================================================================================

const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%LIVE_STATUS_MSGS.length), 3500); return () => clearInterval(t); }, []);
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-in flex items-center gap-2 bg-[#1C1C1E] border border-white/5 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{LIVE_STATUS_MSGS[idx]}</span>
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
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#2563EB] to-[#30D158] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[9px] text-gray-500 font-medium tracking-wide">
            <span>Benefício: <span className="text-[#32D74B]">{currentLevel.perks[0]}</span></span>
            {nextLevel ? (
               <span>Faltam {formatCurrency(nextLevel.min - safeSpent)}</span>
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
      <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-[#2563EB]/10 blur-[80px] rounded-full pointer-events-none"></div>
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
          {[...Array(5)].map((_,k) => <Star key={k} className={`w-3.5 h-3.5 ${k < currentReview.r ? 'text-[#FFD60A] fill-[#FFD60A]' : 'text-gray-700'}`}/>)}
        </div>
        <p className="text-[13px] text-gray-200 text-center font-medium leading-relaxed tracking-tight italic line-clamp-2">"{currentReview.t}"</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest">- {currentReview.a}</p>
      </div>
    </div>
  );
};

// --- SELETOR DE DATA E HORA MELHORADO ---
const PracticalDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const DAYS_TO_SHOW = 14;
  const days = [];
  const now = new Date();
  
  for (let i = 0; i < DAYS_TO_SHOW; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      days.push(d);
  }

  // Horários fixos para melhor organização
  const slots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const getLabel = (d) => {
    const today = new Date();
    if(d.toDateString() === today.toDateString()) return 'HOJE';
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    if(d.toDateString() === tomorrow.toDateString()) return 'AMANHÃ';
    return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).toUpperCase();
  };

  const isTimeBlocked = (t, d) => {
    if (!d) return true;
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    
    if (isToday) {
      const [h] = t.split(':').map(Number);
      const currentH = now.getHours();
      // Bloqueia se a hora já passou ou é muito próxima (1h de margem)
      return h <= currentH + 1;
    }
    return false;
  };

  return (
    <div className="w-full">
      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Escolha o Dia</h4>
      
      {/* Scroll Horizontal de Dias */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-4">
        {days.map((d, i) => {
          const isSel = selectedDate?.toDateString() === d.toDateString();
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} 
              className={`flex flex-col items-center justify-center min-w-[70px] h-[75px] rounded-xl border transition-all ${isSel ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-lg scale-105' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
              <span className={`text-[9px] font-bold mb-1 ${isSel ? 'text-white' : 'text-[#2563EB]'}`}>{getLabel(d)}</span>
              <span className="text-xl font-bold font-mono">{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="animate-slide-up">
           <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Horário Disponível</h4>
           <div className="grid grid-cols-4 gap-3">
             {slots.map(t => {
               const blocked = isTimeBlocked(t, selectedDate);
               const isSel = selectedTime === t;
               return (
                 <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }}
                   className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${isSel ? 'bg-[#2563EB] text-white border-[#2563EB]' : blocked ? 'bg-white/5 text-gray-600 border-transparent opacity-40 cursor-not-allowed line-through' : 'bg-[#1C1C1E] border-white/10 text-gray-300 hover:bg-white/5'}`}>
                   {t}
                 </button>
               )
             })}
           </div>
           <p className="text-[10px] text-gray-500 mt-2 text-center flex items-center justify-center gap-1">
             <Info className="w-3 h-3"/> Horários passados são bloqueados automaticamente.
           </p>
        </div>
      )}
    </div>
  );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Refs
  const vibeRef = useRef(null);
  const homeRef = useRef(null);
  
  // State
  const [loyalty, setLoyalty] = useState(() => {
    const saved = localStorage.getItem('thaly_system_v24'); 
    return saved ? JSON.parse(saved) : { savedName: '', totalSpent: 0, inventory: ['BEMVINDO'], notifications: [] };
  });

  const [user, setUser] = useState({ name: '' });
  
  const [selection, setSelection] = useState({ 
      service: null, location: null, date: null, time: '', useTable: null, 
      address: '', number: '', complement: '', district: '',
      coupon: null, upgrade: false, touch: false, music: null, aroma: false, paymentMethod: null, installments: 1 
  });

  const [privacyMode, setPrivacyMode] = useState(true); 
  const [weatherHint, setWeatherHint] = useState("");
  const [lastOrderLink, setLastOrderLink] = useState(""); 

  useEffect(() => { 
    setTimeout(() => setLoading(false), 1500); 
    const hr = new Date().getHours();
    setWeatherHint(hr < 18 ? "☀️ Dia ideal para relaxar" : "🌙 Noite perfeita para relaxar");
  }, []);

  useEffect(() => {
    localStorage.setItem('thaly_system_v24', JSON.stringify(loyalty));
    if (loyalty.savedName) setUser(prev => ({...prev, name: loyalty.savedName}));
  }, [loyalty]);

  useEffect(() => {
    if (step === 'home') homeRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, address: '', number: '', complement: '', district: '', coupon: null, upgrade: false, touch: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  const getAromaPrice = () => {
      const level = [...LEVELS].reverse().find(l => (loyalty.totalSpent || 0) >= l.min) || LEVELS[0];
      return (level.name === 'Ouro' || level.name === 'Diamante') ? 0 : CONFIG.PRICES.AROMA_FULL;
  };

  const calcTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.touch) total += CONFIG.PRICES.TOUCH;
    if (selection.useTable) total += CONFIG.PRICES.MACA;
    if (selection.aroma) total += getAromaPrice();
    if (selection.location?.fee) total += selection.location.fee;
    
    if (selection.coupon) {
      if (selection.coupon.type === 'percent') total -= (total * selection.coupon.value / 100);
      else total -= selection.coupon.value;
    }
    return Math.max(0, total);
  };

  const handleWhatsApp = () => {
    triggerHaptic();
    const total = calcTotal();
    
    const addressStr = `${selection.address}, ${selection.number} - ${selection.district} (${selection.complement || 'Sem compl.'})`;
    const dateStr = selection.date.toLocaleDateString('pt-BR');

    let msg = `*NOVO PEDIDO VIP* 🔒
👤 *${user.name || 'Cliente'}*
💆‍♂️ *${selection.service.name}*
📅 ${dateStr} às ${selection.time}

📍 *LOCAL:*
${addressStr}
(${selection.useTable ? 'Levar Maca' : 'Na Cama/Sofá'})

*ADICIONAIS:*
${selection.touch ? '✅ Toque Interativo\n' : ''}${selection.aroma ? '✅ Aromaterapia\n' : ''}${selection.upgrade ? '✅ +30 Minutos\n' : ''}
💰 *TOTAL: ${formatCurrency(total)}*
Pagamento: ${selection.paymentMethod === 'credit_card' ? 'Cartão' : selection.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'}`;

    const url = `https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${encodeURIComponent(msg)}`;
    setLastOrderLink(url);
    
    // Atualiza Stats
    setLoyalty(prev => ({
        ...prev, 
        savedName: user.name || prev.savedName,
        totalSpent: (prev.totalSpent || 0) + total
    }));

    window.open(url, '_blank');
    setStep('success');
  };

  const GlobalHeader = () => (
      <div className="absolute top-0 w-full z-50 px-6 pt-12 pb-8 flex justify-between items-center pointer-events-none bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="pointer-events-auto">
             {step !== 'home' && step !== 'success' ? (
                <button onClick={() => setStep(step === 'configure' ? 'services' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10 bg-black/20 backdrop-blur-md border border-white/5"><IconBack /></button>
             ) : (
                <div className="flex flex-col items-start animate-fade-in">
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-0.5">Thalyson VIP</span>
                    <span className="text-[13px] font-bold text-gray-200 leading-tight">{weatherHint}</span>
                </div>
             )}
          </div>
          <div className="pointer-events-auto">
             <button className="w-10 h-10 rounded-full bg-[#1C1C1E]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400">
                  <Menu className="w-5 h-5"/>
              </button>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-6 font-sans text-gray-200 bg-black">
      <style>{globalStyles}</style>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-[#2563EB]/20 border-t-[#2563EB] rounded-full animate-spin mb-4"/>
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#2563EB] animate-pulse">CARREGANDO</span>
        </div>
      ) : (
      <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] aurora-bg">
        
        <GlobalHeader />

        {/* --- HOME --- */}
        {step === 'home' && (
          <div className="flex-1 p-6 overflow-y-auto pb-32 pt-32" ref={homeRef}>
            <div className="mb-6 animate-fade-in">
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-2">Massagens Relaxantes<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#60A5FA] text-2xl">em Santa Fé do Sul</span></h1>
            </div>

            <LoyaltyCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => setPrivacyMode(!privacyMode)} />
            <LiveStatus />

            <div className="mb-3 px-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Escolha sua Experiência</div>
            
            <div className="space-y-6 mb-8">
              {services.map(s => (
                <div key={s.id} className="ios-card p-6 rounded-[28px] relative overflow-hidden group">
                  {s.highlight && <div className="absolute top-0 right-0 bg-[#2563EB] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-[20px] shadow-lg">{s.highlight}</div>}
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-[22px] leading-tight mb-1">{s.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[#2563EB] font-bold text-[18px]">{formatCurrency(s.basePrice)}</span>
                        <span className="text-gray-500 text-[13px]">• {s.labelDuration}</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-gray-300 leading-relaxed mb-5 opacity-90">{s.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {s.details.map((d, idx) => (
                        <span key={idx} className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded-md text-gray-400 font-medium">{d}</span>
                    ))}
                  </div>

                  <button onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('services'); }} className="w-full ios-btn-primary font-bold py-3.5 rounded-xl shadow-lg flex justify-center items-center gap-2 text-[15px] hover:scale-[1.02] transition-transform">
                    RESERVAR ESTE <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mb-3 px-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Avaliações Reais</div>
            <ReviewsCarousel />
          </div>
        )}

        {/* --- IDENTITY / NAME --- */}
        {step === 'services' && (
             <div className="flex-1 p-6 pt-36 animate-fade-in flex flex-col h-full pb-10">
                <h2 className="text-2xl font-bold text-white mb-2">Para começar</h2>
                <p className="text-gray-400 text-sm mb-6">Como gostaria de ser chamado?</p>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full custom-input p-4 rounded-xl text-white text-lg mb-4" placeholder="Seu nome..." />
                <button disabled={!user.name} onClick={() => setStep('configure')} className="w-full ios-btn-primary font-bold py-4 rounded-xl mt-auto">Continuar</button>
             </div>
        )}

        {/* --- CONFIGURE --- */}
        {step === 'configure' && selection.service && (
          <div className="flex-1 p-6 pt-32 overflow-y-auto pb-40 animate-fade-in scrollbar-hide"> 
            
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-white mb-1">Agendamento</h2>
               <p className="text-gray-400 text-sm">{selection.service.name}</p>
            </div>

            <div className="space-y-8">
              {/* DATA */}
              <PracticalDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => setSelection({...selection, date: d, time: t})} />

              {/* LOCAL (SÓ CASA/HOTEL) */}
              {selection.date && selection.time && (
                  <div className="animate-slide-up">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Localização</h4>
                    <div className="ios-card p-5 rounded-[22px] border-l-4 border-[#2563EB]">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="text-[#2563EB] w-5 h-5"/>
                            <span className="font-bold text-white text-sm">No seu Local (Casa/Hotel)</span>
                        </div>
                        <div className="space-y-3">
                            <input value={selection.address} onChange={e => setSelection({...selection, address: e.target.value})} placeholder="Rua / Avenida" className="w-full custom-input p-3 rounded-lg text-sm" />
                            <div className="flex gap-2">
                                <input value={selection.number} onChange={e => setSelection({...selection, number: e.target.value})} placeholder="Número" className="w-1/3 custom-input p-3 rounded-lg text-sm" type="tel"/>
                                <input value={selection.district} onChange={e => setSelection({...selection, district: e.target.value})} placeholder="Bairro" className="flex-1 custom-input p-3 rounded-lg text-sm" />
                            </div>
                            <input value={selection.complement} onChange={e => setSelection({...selection, complement: e.target.value})} placeholder="Complemento (Apto, Bloco...)" className="w-full custom-input p-3 rounded-lg text-sm" />
                        </div>
                        
                        <div className="mt-4 flex gap-2">
                             <button onClick={() => setSelection({...selection, useTable: false})} className={`flex-1 py-3 rounded-lg border text-xs font-bold ${!selection.useTable ? 'bg-[#2563EB] border-[#2563EB]' : 'border-white/10 text-gray-400'}`}>Na Cama</button>
                             <button onClick={() => setSelection({...selection, useTable: true})} className={`flex-1 py-3 rounded-lg border text-xs font-bold ${selection.useTable ? 'bg-[#2563EB] border-[#2563EB]' : 'border-white/10 text-gray-400'}`}>Levar Maca (+R$20)</button>
                        </div>
                    </div>
                  </div>
              )}

              {/* EXTRAS */}
              {selection.address && (
                  <div className="animate-slide-up" ref={vibeRef}>
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Adicionais</h4>
                    <div className="space-y-3">
                        <button onClick={() => setSelection({...selection, touch: !selection.touch})} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${selection.touch ? 'bg-[#FF375F]/10 border-[#FF375F]' : 'bg-[#1C1C1E] border-white/5'}`}>
                            <div className="flex items-center gap-3"><Hand className={`w-5 h-5 ${selection.touch ? 'text-[#FF375F]' : 'text-gray-500'}`} /><span className="text-sm font-bold text-gray-200">Toque Interativo</span></div>
                            <span className="text-xs font-bold text-[#FF375F]">+ {formatCurrency(CONFIG.PRICES.TOUCH)}</span>
                        </button>
                        <button onClick={() => setSelection({...selection, aroma: !selection.aroma})} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#30D158]/10 border-[#30D158]' : 'bg-[#1C1C1E] border-white/5'}`}>
                            <div className="flex items-center gap-3"><Wind className={`w-5 h-5 ${selection.aroma ? 'text-[#30D158]' : 'text-gray-500'}`} /><span className="text-sm font-bold text-gray-200">Aromaterapia</span></div>
                            <span className="text-xs font-bold text-[#30D158]">{getAromaPrice() === 0 ? 'GRÁTIS' : `+ ${formatCurrency(getAromaPrice())}`}</span>
                        </button>
                    </div>

                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 mt-6">Pagamento</h4>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`py-3 rounded-xl border text-xs font-bold ${selection.paymentMethod === 'pix' ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-[#1C1C1E] border-white/10'}`}>Pix</button>
                        <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`py-3 rounded-xl border text-xs font-bold ${selection.paymentMethod === 'cash' ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-[#1C1C1E] border-white/10'}`}>Dinheiro</button>
                        <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`py-3 rounded-xl border text-xs font-bold ${selection.paymentMethod === 'credit_card' ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-[#1C1C1E] border-white/10'}`}>Cartão</button>
                    </div>
                  </div>
              )}

            </div>
          </div>
        )}

        {/* FOOTER TOTAL */}
        {step === 'configure' && selection.date && selection.time && selection.address && selection.paymentMethod && (
            <div className="absolute bottom-0 w-full bg-[#1C1C1E] border-t border-white/10 p-5 rounded-t-[32px] animate-slide-up z-50">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Total Final</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(calcTotal())}</p>
                    </div>
                    <div className="text-right text-[10px] text-gray-500">
                        <p>{selection.date.getDate()}/{selection.date.getMonth()+1} às {selection.time}</p>
                        <p>{selection.address.slice(0,15)}...</p>
                    </div>
                </div>
                <button onClick={handleWhatsApp} className="w-full ios-btn-primary font-bold py-4 rounded-xl flex justify-center items-center gap-2">
                    CONFIRMAR NO WHATSAPP <MessageCircle className="w-5 h-5"/>
                </button>
            </div>
        )}

        {/* TELA SUCESSO */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in pb-32">
            <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.4)] animate-scale"><Check className="w-10 h-10 text-white stroke-[3px]"/></div>
            <h2 className="text-3xl font-bold text-white mb-2">Pedido Enviado!</h2>
            <p className="text-gray-400 mb-8 text-[15px]">Verifique seu WhatsApp.</p>
            <button onClick={() => window.open(lastOrderLink, '_blank')} className="mb-4 w-full flex items-center justify-center gap-2 text-[15px] font-bold text-[#2563EB] bg-[#2563EB]/10 py-3.5 rounded-xl border border-[#2563EB]/20">Reenviar</button>
            <button onClick={handleReset} className="w-full py-4 text-gray-500 text-[14px] font-medium">Voltar ao Início</button>
          </div>
        )}

      </div>
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
