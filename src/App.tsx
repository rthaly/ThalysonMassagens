import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar,
  Bell, Tag, ArrowRight, Eye, EyeOff, Share2, 
  LogOut, Crown, Trash2, CreditCard, Banknote, QrCode, 
  Info, CheckCircle2, Send, Menu, Smartphone, User, FileText, Sparkles, Star, AlertTriangle
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS
// ==================================================================================

const globalStyles = `
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
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
input, select { user-select: text; font-size: 17px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; cursor: pointer; }

/* Background & Cards */
.aurora-bg {
  background: 
    radial-gradient(140% 100% at 50% 0%, rgba(20, 20, 22, 1), #000000 60%),
    radial-gradient(100% 100% at 50% 100%, rgba(10, 132, 255, 0.06), transparent 50%);
  background-attachment: fixed;
  background-size: cover;
  min-height: 100vh;
}
.ios-card { 
  background: rgba(28, 28, 30, 0.65); 
  backdrop-filter: blur(40px); 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}
.ios-btn-primary {
  background: #007AFF; color: white; border: none;
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.4);
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }
.ios-btn-primary:disabled { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; box-shadow: none; }

.custom-input {
  background: rgba(28, 28, 30, 0.5);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  transition: all 0.3s ease;
}
.custom-input:focus { border-color: #0A84FF; box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2); }

/* Animations */
.animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
.animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pop { animation: pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
`;

// ==================================================================================
// 2. CONFIGURAÇÃO & DADOS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144",
  PRICES: { MACA: 20, AROMA_FULL: 10, AROMA_DISCOUNT: 5, UPGRADE_PCT: 0.5 }
};

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
const generateBookingId = () => Math.random().toString(36).substring(2, 6).toUpperCase();

// Serviços
const services = [
  { 
    id: 'masculina', name: 'Massagem Masculina', type: 'sensual',
    description: 'Massagem Relaxante + Toques corpo a corpo (de cueca) com finalização Lingam manual completa.', 
    labelDuration: '60 min', basePrice: 155, 
    highlight: "MAIS PEDIDA 🔥", ratings: 5.0, reviews: 310, 
    details: ["Relaxante + Body", "Massagista de Cueca", "Finalização Manual", "Alívio Completo"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    description: 'Corpo inteiro: Costas, braços, mãos, pernas, coxas, pés, peito e frente. (Sem toques íntimos).', 
    labelDuration: '60 min', basePrice: 95, 
    ratings: 4.9, reviews: 142, 
    details: ["Corpo Inteiro", "Sem Glúteos/Íntimo", "Toque Terapêutico", "Relaxamento Puro"] 
  },
];

// Locais
const locations = [
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Vou com você', fee: 75, allowsTableChoice: false, isMotel: true },
  { id: 'santa-fe', label: 'Rio Preto, Uber Ida e Volta', sublabel: 'No conforto do seu lar', fee: 40, allowsTableChoice: true, isUber: true },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', sublabel: 'Atendimento na região', fee: 0, allowsTableChoice: false, isPending: true },
];

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];
const LEVELS = [
  { name: 'Bronze', min: 0, icon: '🥉', perks: ["Acesso VIP"] },
  { name: 'Prata', min: 400, icon: '🥈', perks: ["Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, icon: '🥇', perks: ["Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, icon: '💎', perks: ["Prioridade Total"] },
];

const REVIEWS = [
  { t: "Sou casado, sigilo total. Surpreendeu.", a: "Sigiloso (44)", r: 5 },
  { t: "Sensibilidade absurda no corpo.", a: "R.S. (Rio Preto)", r: 5 },
  { t: "Ambiente discreto e técnica perfeita.", a: "Curioso", r: 5 },
  { t: "Mão leve e firme. Recomendo.", a: "Anônimo", r: 5 },
];

// ==================================================================================
// 3. COMPONENTES VISUAIS & UTILITÁRIOS
// ==================================================================================

// --- PROTEÇÃO CONTRA INSTAGRAM (NOVO) ---
const InAppBrowserGuard = () => {
  const [isInApp, setIsInApp] = useState(false);

  useEffect(() => {
    // Deteta se é o navegador interno do Instagram ou Facebook
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/Instagram|FBAN|FBAV/i.test(ua)) {
      setIsInApp(true);
    }
  }, []);

  if (!isInApp) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-full max-w-sm bg-[#1C1C1E] p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A84FF] to-[#30D158]"></div>
        <AlertTriangle className="w-12 h-12 text-[#FFD60A] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Atenção!</h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          O navegador do Instagram bloqueia o agendamento e o pagamento. Para continuar:
        </p>
        <div className="space-y-3">
          <div className="p-4 rounded-[18px] bg-[#2C2C2E] border border-white/5 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[#0A84FF]/20 text-[#0A84FF] flex items-center justify-center font-bold flex-shrink-0">1</div>
            <span className="text-sm text-white">Toque nos <span className="font-bold">3 pontinhos (•••)</span> no topo</span>
          </div>
          <div className="p-4 rounded-[18px] bg-[#2C2C2E] border border-white/5 flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-[#30D158]/20 text-[#30D158] flex items-center justify-center font-bold flex-shrink-0">2</div>
            <span className="text-sm text-white">Escolha <span className="font-bold">"Abrir no Navegador"</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-[300] bg-[#32D74B] text-black px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-pop font-bold text-[14px]">
      <CheckCircle2 className="w-5 h-5 text-black" />
      <span>{message}</span>
    </div>
  );
};

const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  const msgs = ["Atendimento em andamento 💆‍♂️", "Horários da noite acabando 🌙", "Anônimo agendou agora 🔥"];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%msgs.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-in flex items-center gap-2 bg-[#1C1C1E] border border-white/5 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-gray-400 font-medium uppercase">{msgs[idx]}</span>
      </div>
    </div>
  );
};

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS.length), 5000); return () => clearInterval(t); }, []);
  const cr = REVIEWS[idx];
  return (
    <div className="relative h-24 flex items-center justify-center mb-6">
      <div key={idx} className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in px-4 bg-[#1C1C1E] rounded-[24px] border border-white/5 shadow-lg">
        <div className="flex gap-1 mb-2">{[...Array(5)].map((_,k) => <Star key={k} className="w-3 h-3 text-[#FFD60A] fill-[#FFD60A]"/>)}</div>
        <p className="text-[12px] text-gray-200 text-center italic">"{cr.t}"</p>
        <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">- {cr.a}</p>
      </div>
    </div>
  );
};

const LevelProgressBar = ({ spent, privacyMode, onToggle }) => {
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => spent >= l.min);
  const currentLevel = currentLevelIdx !== -1 ? LEVELS[LEVELS.length - 1 - currentLevelIdx] : LEVELS[0];
  const nextLevel = LEVELS[LEVELS.length - 1 - currentLevelIdx + 1];
  const progress = nextLevel ? Math.min(100, Math.max(0, ((spent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)) : 100;

  return (
    <div className="ios-card p-5 rounded-[28px] mb-6 border-t border-white/10 relative overflow-hidden">
        <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase">Nível VIP</p>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">{currentLevel.name} {currentLevel.icon}</h3>
            </div>
            <div className="text-right">
              <button onClick={onToggle} className="flex items-center justify-end gap-1 mb-0.5 ml-auto text-gray-500"><Eye className="w-3 h-3"/></button>
              <span className={`text-sm font-mono font-bold ${privacyMode ? 'blur-sm opacity-50' : ''}`}>{formatCurrency(spent)}</span>
            </div>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full mb-2 overflow-hidden"><div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#30D158]" style={{ width: `${progress}%` }} /></div>
        <p className="text-[9px] text-gray-500">Benefício: <span className="text-[#32D74B]">{currentLevel.perks[0]}</span></p>
    </div>
  );
};

const Stepper = ({ current, total }) => (
  <div className="flex justify-center gap-2 mb-6">
    {[...Array(total)].map((_, i) => (
      <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i + 1 <= current ? 'w-8 bg-[#0A84FF]' : 'w-2 bg-white/10'}`} />
    ))}
  </div>
);

// --- SELETOR DE DATA ---
const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const days = useMemo(() => Array.from({length: 14}, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; }), []);
  
  const isTimeBlocked = (t, d) => {
    if(!d) return true;
    const [h] = t.split(':').map(Number);
    const slotDate = new Date(d); slotDate.setHours(h, 0, 0, 0);
    const now = new Date();
    // Bloqueia se a diferença for menor que 30 minutos
    if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth()) {
        const diff = (slotDate - now) / (1000 * 60);
        return diff < 30; 
    }
    return false;
  };

  const getDayLabel = (d) => {
      const now = new Date();
      if (d.getDate() === now.getDate()) return 'HOJE';
      if (d.getDate() === now.getDate() + 1) return 'AMANHÃ';
      return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3);
  };

  return (
    <div className="w-full select-none">
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide px-1">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate();
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} 
              className={`flex-shrink-0 flex flex-col items-center justify-center w-[70px] h-[80px] rounded-[18px] transition-all border 
              ${isSel ? 'bg-[#0A84FF] text-white shadow-lg border-[#0A84FF] scale-[1.05]' : 'bg-[#2C2C2E] text-gray-400 border-white/5'}`}>
              <span className={`text-[9px] uppercase font-bold mb-0.5 ${getDayLabel(d) === 'HOJE' ? 'text-[#32D74B]' : 'opacity-60'}`}>{getDayLabel(d)}</span>
              <span className="text-xl font-mono mb-0.5">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="animate-slide-up pt-2 border-t border-white/5">
           {['Manhã', 'Tarde', 'Noite'].map((label, idx) => {
               const slots = idx===0?['09:00','10:00','11:00']:idx===1?['13:00','14:00','15:00','16:00','17:00']:['18:00','19:00','20:00','21:00'];
               const validSlots = slots.filter(t => !isTimeBlocked(t, selectedDate));
               if(validSlots.length === 0) return null;
               return (
                   <div key={idx} className="mb-4">
                       <h5 className="text-[10px] font-bold text-gray-500 uppercase mb-2">{label}</h5>
                       <div className="grid grid-cols-4 gap-2">
                           {slots.map(t => {
                               const blocked = isTimeBlocked(t, selectedDate);
                               return (
                                  <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                                    className={`py-2 rounded-[12px] text-[13px] font-bold transition-all relative overflow-hidden
                                    ${selectedTime === t ? 'bg-[#0A84FF] text-white shadow-lg' : blocked ? 'bg-white/5 text-gray-600 opacity-20' : 'bg-[#2C2C2E] text-gray-300 border border-white/5'}`}>
                                    {t}
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
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('home');
  const [toast, setToast] = useState(null);
  
  // Refs
  const locationRef = useRef(null);
  const vibeRef = useRef(null);
  const extrasRef = useRef(null);
  const paymentRef = useRef(null);
  
  // State
  const [loyalty, setLoyalty] = useState(() => JSON.parse(localStorage.getItem('thaly_data_v4')) || { totalSpent: 0 });
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('thaly_user_v4')) || { name: '', phone: '', isAdult: false });
  const [selection, setSelection] = useState({ 
    service: null, location: null, date: null, time: '', useTable: null, 
    city: '', address: '', number: '', district: '', reference: '',
    upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1, termsAccepted: false 
  });

  const [privacyMode, setPrivacyMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);
  useEffect(() => { localStorage.setItem('thaly_data_v4', JSON.stringify(loyalty)); }, [loyalty]);
  useEffect(() => { localStorage.setItem('thaly_user_v4', JSON.stringify(user)); }, [user]);

  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', address: '', number: '', district: '', reference: '', upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1, termsAccepted: false });
    setStep('home');
  };

  // Cálculos
  const getAromaPrice = () => {
    const spent = loyalty.totalSpent;
    if (spent >= 900) return 0; // Ouro/Diamante
    if (spent >= 400) return CONFIG.PRICES.AROMA_DISCOUNT; // Prata
    return CONFIG.PRICES.AROMA_FULL;
  };

  const calcFinalPrice = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.useTable) total += CONFIG.PRICES.MACA;
    if (selection.aroma) total += getAromaPrice();
    if (selection.location?.fee) total += selection.location.fee;
    if (selection.paymentMethod === 'credit_card') total /= (1 - (CARD_RATES[selection.installments] || 0));
    return Math.max(0, total);
  };

  // Validação
  const canFinalize = selection.service && selection.location && selection.date && selection.time && selection.music && selection.paymentMethod && selection.termsAccepted &&
  (selection.location.allowsTableChoice ? selection.useTable !== null : true) && 
  (selection.location.id === 'outras-cidades' ? !!selection.city : true) &&
  (selection.location.id === 'santa-fe' ? (selection.address && selection.number && selection.district) : true);

  // WhatsApp
  const handleWhatsApp = () => {
    if (!canFinalize) { setToast("Preencha todos os campos!"); return; }
    triggerHaptic();

    const bookingId = generateBookingId(); 
    const price = calcFinalPrice();
    setLoyalty(prev => ({ ...prev, totalSpent: prev.totalSpent + selection.service.basePrice }));

    let locationTxt = selection.location.label;
    if(selection.location.id === 'santa-fe') locationTxt += `\n🏠 End: ${selection.address}, ${selection.number}\n🏘️ Bairro: ${selection.district}\n📍 Ref: ${selection.reference || '-'}`;
    if(selection.location.id === 'outras-cidades') locationTxt += ` (${selection.city})`;

    const msg = `*PEDIDO #${bookingId}*
👤 *Cliente:* ${user.name}
📱 *Tel:* ${user.phone}
📅 *Data:* ${selection.date.toLocaleDateString()} às ${selection.time}
💆 *Serviço:* ${selection.service.name} ${selection.upgrade ? '+ UPGRADE 30min' : ''}

📍 *Local:* ${locationTxt}

💰 *Valor Final:* ${formatCurrency(price)}
💳 *Pagamento:* ${selection.paymentMethod === 'pix' ? 'PIX' : selection.paymentMethod === 'credit_card' ? `${selection.installments}x Cartão` : 'Dinheiro'}

✅ *Termos Aceitos*`;

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  return (
    <div className="min-h-screen flex justify-center font-sans text-gray-200 bg-black">
      <style>{globalStyles}</style>

      {/* --- BLOQUEIO DE INSTAGRAM AQUI --- */}
      <InAppBrowserGuard />
      
      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
          <Sparkles className="w-12 h-12 text-[#0A84FF] animate-pulse mb-4"/>
          <span className="text-xs font-bold tracking-widest text-[#0A84FF]">CARREGANDO...</span>
        </div>
      ) : (
        <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] aurora-bg flex flex-col">
          
          {/* HEADER */}
          <div className="absolute top-0 w-full z-50 px-6 pt-12 pb-4 bg-gradient-to-b from-black via-black/80 to-transparent flex justify-between items-center pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3">
              {step !== 'home' && step !== 'success' && <button onClick={() => setStep(prev => prev === 'configure' ? 'services' : prev === 'services' ? 'identity' : 'home')} className="p-2 rounded-full bg-white/10 backdrop-blur-md"><ChevronLeft className="w-6 h-6"/></button>}
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest">Olá, {user.name.split(' ')[0] || 'Visitante'}</span>
              </div>
            </div>
            <div className="pointer-events-auto">
               <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"><Menu className="w-5 h-5"/></button>
            </div>
          </div>

          {/* MENU LATERAL */}
          {showMenu && <div className="absolute inset-0 bg-black/80 z-[60] backdrop-blur-xl animate-fade-in" onClick={() => setShowMenu(false)}>
              <div className="absolute right-0 top-0 h-full w-64 bg-[#1C1C1E] p-8 pt-24 space-y-6 shadow-2xl border-l border-white/10 animate-slide-up">
                  <h3 className="text-xl font-bold text-white mb-6">Menu</h3>
                  <button onClick={handleReset} className="flex items-center gap-3 text-red-500 mt-10"><LogOut className="w-5 h-5"/> Resetar App</button>
              </div>
          </div>}

          {/* CONTEÚDO */}
          <div className="flex-1 overflow-y-auto pb-32 pt-28 px-6 scrollbar-hide relative z-10">
            
            {step === 'home' && (
              <div className="animate-fade-in">
                <div className="mb-8 text-center">
                   <h1 className="text-4xl font-bold text-white tracking-tight leading-none mb-2">Massagens<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A84FF] to-[#30D158]">Relaxantes</span></h1>
                </div>
                <LevelProgressBar spent={loyalty.totalSpent} privacyMode={privacyMode} onToggle={() => setPrivacyMode(!privacyMode)} />
                <LiveStatus />
                <ReviewsCarousel />
                <button onClick={() => { triggerHaptic(); setStep(user.name ? 'services' : 'identity'); }} className="w-full ios-btn-primary h-14 rounded-[20px] font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg">Agendar Agora <ArrowRight className="w-5 h-5"/></button>
              </div>
            )}

            {step === 'identity' && (
              <div className="animate-fade-in pt-4">
                <Stepper current={1} total={4} />
                <h2 className="text-2xl font-bold text-white mb-6">Identificação</h2>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[11px] uppercase font-bold text-[#0A84FF] ml-1">Seu Nome</label>
                      <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full custom-input p-4 rounded-[16px]" placeholder="Ex: João Silva" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] uppercase font-bold text-[#0A84FF] ml-1">Seu Celular</label>
                      <input type="tel" value={user.phone} onChange={e => setUser({...user, phone: e.target.value})} className="w-full custom-input p-4 rounded-[16px]" placeholder="(XX) XXXXX-XXXX" />
                   </div>
                   <button onClick={() => setUser({...user, isAdult: !user.isAdult})} className={`p-4 rounded-[18px] border flex items-center gap-3 w-full transition-all ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                       <div className={`w-5 h-5 rounded border flex items-center justify-center ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isAdult && <Check className="w-3 h-3 text-white"/>}</div>
                       <span className="text-sm">+18 Anos</span>
                   </button>
                   <button disabled={!user.name || !user.phone || !user.isAdult} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full ios-btn-primary h-14 rounded-[20px] font-bold mt-4">Continuar</button>
                </div>
              </div>
            )}

            {step === 'services' && (
              <div className="animate-fade-in pt-4">
                 <Stepper current={2} total={4} />
                 <h2 className="text-2xl font-bold text-white mb-6">Serviços</h2>
                 <div className="space-y-4">
                    {services.map(s => (
                       <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className="ios-card p-5 rounded-[26px] relative overflow-hidden active:scale-95 transition-all cursor-pointer">
                          {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-bold px-3 py-1.5 rounded-bl-[16px]">{s.highlight}</div>}
                          <div className="flex justify-between items-start mb-2">
                             <h3 className="text-xl font-bold text-white">{s.name}</h3>
                             <div className="text-[#0A84FF] font-bold text-lg">{formatCurrency(s.basePrice)}</div>
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{s.description}</p>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {step === 'configure' && selection.service && (
               <div className="animate-fade-in pt-4 pb-24">
                  <Stepper current={3} total={4} />
                  <div className="ios-card p-4 rounded-[20px] mb-6 border-l-4 border-l-[#0A84FF] flex justify-between items-center">
                     <div><h3 className="font-bold text-white">{selection.service.name}</h3></div>
                     <button onClick={() => setStep('services')} className="text-xs text-[#0A84FF] font-bold">Alterar</button>
                  </div>

                  <div className="space-y-8">
                     <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection(prev => ({...prev, date: d, time: t})); if(t) setTimeout(() => locationRef.current?.scrollIntoView({behavior:'smooth', block:'center'}), 300); }} />

                     <div ref={locationRef} className="space-y-3">
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Local</h4>
                        {locations.map(l => (
                           <div key={l.id} className={`${selection.location && selection.location.id !== l.id ? 'hidden' : 'block'} animate-fade-in`}>
                              <button onClick={() => { triggerHaptic(); setSelection(prev => ({...prev, location: l, useTable: null})); if(l.id!=='santa-fe') setTimeout(() => vibeRef.current?.scrollIntoView({behavior:'smooth'}), 300); }} className={`w-full p-4 rounded-[20px] border text-left flex justify-between items-center transition-all ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                                 <div><span className="font-bold text-white block">{l.label}</span><span className="text-xs text-gray-500">{l.sublabel}</span></div>
                                 {l.fee > 0 && <span className="text-[10px] bg-[#FFD60A]/10 text-[#FFD60A] px-2 py-1 rounded border border-[#FFD60A]/20">+ {formatCurrency(l.fee)}</span>}
                              </button>

                              {/* --- ENDEREÇO RIO PRETO --- */}
                              {selection.location?.id === l.id && l.id === 'santa-fe' && (
                                 <div className="mt-4 bg-[#2C2C2E]/50 p-4 rounded-[20px] border border-white/5 space-y-3 animate-slide-up">
                                    <div className="flex gap-2">
                                       <button onClick={() => setSelection(p => ({...p, useTable: false}))} className={`flex-1 py-3 rounded-[14px] text-xs font-bold border ${selection.useTable === false ? 'bg-[#0A84FF] border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>🛏 Na Cama</button>
                                       <button onClick={() => setSelection(p => ({...p, useTable: true}))} className={`flex-1 py-3 rounded-[14px] text-xs font-bold border ${selection.useTable === true ? 'bg-[#0A84FF] border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>💆‍♂️ Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                                    </div>
                                    <input value={selection.address} onChange={e => setSelection(p => ({...p, address: e.target.value}))} className={`w-full custom-input px-4 py-3 rounded-[14px] text-sm`} placeholder="Rua / Avenida *" />
                                    <div className="flex gap-2">
                                        <input value={selection.number} onChange={e => setSelection(p => ({...p, number: e.target.value}))} className={`w-1/3 custom-input px-4 py-3 rounded-[14px] text-sm`} placeholder="Nº *" type="tel" />
                                        <input value={selection.district} onChange={e => setSelection(p => ({...p, district: e.target.value}))} className={`flex-1 custom-input px-4 py-3 rounded-[14px] text-sm`} placeholder="Bairro *" />
                                    </div>
                                    <input value={selection.reference} onChange={e => setSelection(p => ({...p, reference: e.target.value}))} className="w-full custom-input px-4 py-3 rounded-[14px] text-sm" placeholder="Ref (Opcional)" />
                                 </div>
                              )}
                              
                              {selection.location?.id === l.id && l.id === 'outras-cidades' && (
                                 <input value={selection.city} onChange={e => setSelection(p => ({...p, city: e.target.value}))} className="mt-3 w-full custom-input p-4 rounded-[18px] text-white" placeholder="Qual cidade?" />
                              )}
                              {selection.location && <button onClick={() => setSelection(p => ({...p, location: null}))} className="text-xs text-gray-500 underline w-full mt-2">Alterar Local</button>}
                           </div>
                        ))}
                     </div>

                     <div ref={vibeRef}>
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Vibe</h4>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                           {['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘', 'Deep House 🎧'].map(v => (
                              <button key={v} onClick={() => { setSelection(p => ({...p, music: v})); setTimeout(() => extrasRef.current?.scrollIntoView({behavior:'smooth', block:'center'}), 300); }} className={`px-4 py-3 rounded-[14px] border text-xs font-bold whitespace-nowrap transition-all ${selection.music === v ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>{v}</button>
                           ))}
                        </div>
                     </div>

                     <div ref={extrasRef} className="space-y-3">
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Extras</h4>
                        <button onClick={() => setSelection(p => ({...p, upgrade: !p.upgrade}))} className={`w-full p-4 rounded-[18px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                           <div className="text-left"><span className="text-sm font-bold block">+30 Minutos</span><span className="text-xs text-gray-500">Sessão estendida</span></div>
                           <span className="text-[#0A84FF] font-bold text-sm">+ {formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                        </button>
                        <button onClick={() => setSelection(p => ({...p, aroma: !p.aroma}))} className={`w-full p-4 rounded-[18px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                           <div className="text-left"><span className="text-sm font-bold block">Aromaterapia</span></div>
                           <span className={`${getAromaPrice() === 0 ? 'text-[#30D158]' : 'text-[#0A84FF]'} font-bold text-sm`}>{getAromaPrice() === 0 ? 'GRÁTIS (VIP)' : `+ ${formatCurrency(getAromaPrice())}`}</span>
                        </button>
                     </div>

                     <div ref={paymentRef}>
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Pagamento</h4>
                        <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => { setSelection(p=>({...p, paymentMethod:'pix'})); navigator.clipboard.writeText(CONFIG.PIX_KEY); setToast("Chave PIX copiada!"); triggerHaptic(); }} className={`h-20 rounded-[18px] border flex flex-col items-center justify-center gap-1 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                              <QrCode className="w-5 h-5 text-[#0A84FF]"/><span className="text-xs font-bold">PIX (Copia)</span>
                           </button>
                           <button onClick={() => setSelection(p=>({...p, paymentMethod:'cash'}))} className={`h-20 rounded-[18px] border flex flex-col items-center justify-center gap-1 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                              <Banknote className="w-5 h-5 text-[#30D158]"/><span className="text-xs font-bold">Dinheiro</span>
                           </button>
                           <button onClick={() => setSelection(p=>({...p, paymentMethod:'credit_card'}))} className={`h-20 col-span-2 rounded-[18px] border flex flex-col items-center justify-center gap-1 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                              <CreditCard className="w-5 h-5 text-[#FFD60A]"/><span className="text-xs font-bold">Cartão de Crédito</span>
                           </button>
                        </div>
                        {selection.paymentMethod === 'credit_card' && (
                           <select value={selection.installments} onChange={e => setSelection(p => ({...p, installments: Number(e.target.value)}))} className="w-full mt-3 bg-[#1C1C1E] text-white p-3 rounded-[14px] border border-white/10 text-sm">
                              {CARD_RATES.map((r, i) => i > 0 && <option key={i} value={i}>{i}x de {formatCurrency(calcFinalPrice())}</option>)}
                           </select>
                        )}
                     </div>

                     <label className="flex items-start gap-3 p-4 bg-[#2C2C2E]/30 rounded-[16px] border border-white/5 cursor-pointer">
                        <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center mt-0.5 ${selection.termsAccepted ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>
                           {selection.termsAccepted && <Check className="w-3 h-3 text-white"/>}
                        </div>
                        <input type="checkbox" className="hidden" checked={selection.termsAccepted} onChange={() => setSelection(p => ({...p, termsAccepted: !p.termsAccepted}))} />
                        <span className="text-xs text-gray-400 leading-snug">Li e aceito as regras de conduta.</span>
                     </label>
                  </div>
               </div>
            )}

            {step === 'success' && (
               <div className="animate-fade-in flex flex-col items-center justify-center h-full pb-20 pt-10">
                  <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.6)] animate-pop">
                     <Check className="w-12 h-12 text-black stroke-[3px]"/>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">Pedido Enviado!</h2>
                  <p className="text-gray-400 text-sm mb-8">Verifique seu WhatsApp.</p>
                  <button onClick={handleReset} className="text-gray-500 text-sm font-bold py-4">Voltar ao Início</button>
               </div>
            )}
          </div>

          {step === 'configure' && (
             <div className="absolute bottom-0 w-full z-50 animate-slide-up">
                <div className="h-12 bg-gradient-to-t from-black to-transparent pointer-events-none"/>
                <div className="bg-[#1C1C1E]/90 backdrop-blur-xl border-t border-white/10 p-5 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                   <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-col"><span className="text-[10px] text-gray-400 font-bold uppercase">Total Estimado</span><span className="text-2xl font-bold text-white">{formatCurrency(calcFinalPrice())}</span></div>
                      <div className="text-right text-[10px] text-gray-500 max-w-[120px]">{selection.location?.isPending ? '+ Taxa a combinar' : 'Inclui taxas e descontos'}</div>
                   </div>
                   <button disabled={!canFinalize} onClick={handleWhatsApp} className="w-full ios-btn-primary h-14 rounded-[20px] font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all">Confirmar no WhatsApp <Send className="w-5 h-5"/></button>
                </div>
             </div>
          )}

          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
      )}
    </div>
  );
}
