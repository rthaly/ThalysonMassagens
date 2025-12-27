import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, FlaskConical, Pencil,
  Ghost, Thermometer, ShieldCheck, FileSpreadsheet, Fingerprint, Siren
} from 'lucide-react';

// --- ESTILOS GLOBAIS (IOS 2026 DARK PLATINUM) ---
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

/* Background Atmosférico "Dark Desire" */
.aurora-bg {
  background: 
    radial-gradient(120% 100% at 50% 0%, rgba(20, 20, 30, 1), transparent 60%),
    radial-gradient(100% 100% at 50% 100%, rgba(10, 80, 255, 0.05), transparent 70%),
    #050505;
  background-attachment: fixed;
  background-size: cover;
}

/* Glassmorphism Ultra Premium */
.ios-card { 
  background: rgba(30, 30, 35, 0.75); 
  backdrop-filter: blur(50px) saturate(180%); 
  -webkit-backdrop-filter: blur(50px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
}

.ios-header { 
  background: rgba(10, 10, 10, 0.9); 
  backdrop-filter: blur(20px); 
  border-bottom: 1px solid rgba(255,255,255,0.05); 
}

/* Botões com Feedback Visual Forte */
.ios-btn { 
  background: rgba(255, 255, 255, 0.08); 
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); 
}
.ios-btn:active { transform: scale(0.96); background: rgba(255, 255, 255, 0.15); }

.ios-btn-primary {
  background: linear-gradient(180deg, #0A84FF 0%, #0056B3 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 122, 255, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }

.animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

.pulse-red { animation: pulseRed 2s infinite; }
@keyframes pulseRed { 0% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(255, 59, 48, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0); } }

/* Camuflagem */
.spreadsheet-mode { background: #fff; color: #000; font-family: Arial, sans-serif; font-size: 12px; }
.spreadsheet-cell { border: 1px solid #ccc; padding: 4px; }
`;

const IconBack = () => <ChevronLeft className="w-7 h-7 text-[#0A84FF]" />;

const CARD_RATES = [0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1210, 0.1238];

// --- DADOS COM COPYWRITING PERSUASIVO ---
const services = [
  { 
    id: 'masculina', name: 'Massagem Masculina', type: 'sensual',
    description: 'O ápice do prazer masculino. Massagem relaxante + contato corpo a corpo (traje sumário) e finalização Lingam manual até o clímax.', 
    labelDuration: '60 min', minutes: 60, basePrice: 115, 
    highlight: "🔥 A MAIS ESCOLHIDA", ratings: 5.0, reviews: 310, 
    details: ["🔥 Body-to-Body Intenso", "🩲 Visual Provocante", "🍆 Finalização Lingam Completa", "💦 Alívio de Tensão Máxima"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    description: 'Protocolo anti-stress. Costas, braços, pernas e peitoral. Foco total em relaxar (Sem toques íntimos/glúteos).', 
    labelDuration: '60 min', minutes: 60, basePrice: 80, 
    ratings: 4.9, reviews: 142, 
    details: ["💆‍♂️ Relaxamento profundo", "🚫 Sem Área Íntima", "✋ Toques suaves", "☮️ A paz que precisa"] 
  },
];

const locations = [
  { id: 'santa-fe', label: 'Domicílio (Sigilo Total)', sublabel: 'Vou até sua casa/hotel.', fee: 40, allowsTableChoice: true, estimatedTravelTime: '15-20 min' },
  { id: 'outras-cidades', label: 'Região (Vizinhas)', sublabel: 'Atendimento num raio de 50km.', fee: null, allowsTableChoice: false, estimatedTravelTime: 'A combinar' },
  { 
    id: 'motel', 
    label: 'Encontro em Motel', 
    sublabel: 'Acompanho você na suíte (Sem taxa Uber).', 
    fee: 75, 
    allowsTableChoice: false, 
    estimatedTravelTime: '10-15 min' 
  },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF - Primeira Vez' },
  'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF - Cliente Vip' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF - Fidelidade' },
};

const LEVELS = [
  { name: 'Visitante', min: 0, rewardCode: null, icon: '🛡️' },
  { name: 'Membro Discreto', min: 300, rewardCode: 'NIVELPRATA', icon: '🥈' },
  { name: 'Vip Gold', min: 600, rewardCode: 'NIVELOURO', icon: '🥇' },
  { name: 'Elite Diamond', min: 1200, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: "Prioridade na Agenda" },
];

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const musicVibes = ['Silêncio🤫', 'Zen 🧘', 'Natureza 🌿'];
const moodOptions = [
  { id: 'stressed', icon: '🤯', label: 'Estressado', desc: 'Preciso desligar a mente' },
  { id: 'needy', icon: '🥺', label: 'Carente', desc: 'Preciso de atenção e toque' },
  { id: 'tired', icon: '🔋', label: 'Esgotado', desc: 'Preciso recarregar energia' },
  { id: 'horny', icon: '🔥', label: 'Explosivo', desc: 'Preciso de alívio intenso' }
];

const REVIEWS_DB = [
  { t: "Sou casado, o sigilo foi absoluto. Ninguém desconfiou. Serviço de primeira.", a: "Anônimo (42 anos)", r: 5 },
  { t: "Mãos firmes, sabe onde tocar. A finalização foi coisa de outro mundo.", a: "R.S. (35 anos)", r: 5 },
  { t: "Atenção que eu não tinha em casa há meses. Virei cliente fiel.", a: "M. (55 anos)", r: 5 }
];

// --- UTILS ---
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate([10, 30, 10]); }; // Padrão tátil mais sofisticado
const generateBookingId = () => {
    const chars = 'XYZ789'; // IDs curtos e masculinos
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// --- COMPONENTES UI INOVADORES ---

// 1. Feature: Camuflagem (Planilha Falsa)
const FakeSpreadsheet = ({ onExit }) => (
  <div className="fixed inset-0 bg-white z-[9999] spreadsheet-mode p-2 overflow-auto text-black" onClick={onExit}>
    <div className="flex justify-between mb-2 border-b pb-2">
      <span className="font-bold text-green-700">Excel Mobile - Orçamento 2026.xlsx</span>
      <span className="text-gray-500">Toque para voltar</span>
    </div>
    <table className="w-full border-collapse">
      <tbody>
        {[...Array(20)].map((_, r) => (
          <tr key={r}>
            {[...Array(5)].map((_, c) => (
              <td key={c} className="spreadsheet-cell">{r === 0 ? `COL ${c}` : (Math.random() * 1000).toFixed(2)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 2. Feature: Botão de Pânico Flutuante
const PanicButton = ({ onTrigger }) => (
  <button onClick={onTrigger} className="fixed bottom-4 right-4 z-[100] bg-[#1C1C1E]/80 backdrop-blur border border-white/10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
    <FileSpreadsheet className="w-6 h-6 text-green-500" />
  </button>
);

// 4. Feature: Perfil do Massagista (Conexão Humana)
const MasseurProfile = () => (
  <div className="flex items-center gap-4 bg-[#1C1C1E] p-4 rounded-2xl border border-white/5 mb-6">
    <div className="relative">
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-2xl">👨🏻‍💻</div>
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1C1C1E] animate-pulse"></div>
    </div>
    <div>
      <h3 className="font-bold text-white text-lg">Thalyson Rodrigo <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded ml-2">VERIFICADO</span></h3>
      <p className="text-gray-400 text-sm">"Sigilo, respeito e satisfação garantida. Seu momento de relaxar"</p>
    </div>
  </div>
);

const LiveStatus = () => {
  const [viewers, setViewers] = useState(3);
  useEffect(() => { const t = setInterval(() => setViewers(v => Math.max(2, v + Math.floor(Math.random() * 3) - 1)), 5000); return () => clearInterval(t); }, []);
  
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-in flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-[11px] text-red-400 font-bold uppercase tracking-wide">{viewers} HOMENS VENDO ESTA AGENDA</span>
      </div>
    </div>
  );
};

const LoyaltyCard = ({ data, privacyMode, onTogglePrivacy }) => {
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => data.totalSpent >= l.min);
  const currentLevel = LEVELS[LEVELS.length - 1 - currentLevelIdx];
  const nextLevel = LEVELS[LEVELS.length - 1 - currentLevelIdx + 1];
  const rawProgress = nextLevel ? ((data.totalSpent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <div className="ios-card p-6 rounded-[28px] relative overflow-hidden mb-8 group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Crown className="w-24 h-24 text-[#0A84FF]" />
      </div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> STATUS FIDELIDADE</p>
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">{currentLevel.icon} {currentLevel.name}</h3>
        </div>
        <div className="text-right">
          <button onClick={onTogglePrivacy} className="mb-1 text-gray-500 hover:text-white"><Eye className="w-5 h-5" /></button>
          <p className={`text-xl font-mono text-[#0A84FF] ${privacyMode ? 'blur-md select-none opacity-50' : ''} transition-all`}>
            {formatCurrency(data.totalSpent)}
          </p>
        </div>
      </div>
      <div className="relative h-1.5 bg-white/10 rounded-full mb-3 overflow-hidden z-10">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0056B3] to-[#0A84FF]" style={{ width: `${Math.min(100, Math.max(0, rawProgress))}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-gray-500 relative z-10 font-bold uppercase tracking-wide">
        <span>Economia: {formatCurrency(data.totalSaved)}</span>
        {nextLevel && <span>Meta: {formatCurrency(nextLevel.min)}</span>}
      </div>
    </div>
  );
};

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 6000); return () => clearInterval(t); }, []);
  const currentReview = REVIEWS_DB[idx];
  return (
    <div className="ios-card p-0 rounded-[20px] relative overflow-hidden h-32 flex items-center justify-center mb-8 border border-white/5">
      <div key={idx} className="absolute inset-0 p-6 flex flex-col items-center justify-center animate-fade-in bg-gradient-to-b from-transparent to-black/30">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_,k) => <Star key={k} className={`w-3.5 h-3.5 ${k < currentReview.r ? 'text-[#FFD60A] fill-[#FFD60A]' : 'text-gray-700'}`}/>)}
        </div>
        <p className="text-[14px] text-gray-300 text-center font-medium leading-relaxed italic">"{currentReview.t}"</p>
        <p className="text-[10px] text-[#0A84FF] font-bold uppercase mt-3 tracking-widest flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {currentReview.a}</p>
      </div>
    </div>
  );
};

// 20. Feature: Scroll Infinito de Data Inteligente
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

  const getDayLabel = (d) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (d.toDateString() === today.toDateString()) return 'HOJE';
      if (d.toDateString() === tomorrow.toDateString()) return 'AMANHÃ';
      return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).toUpperCase();
  };

  return (
    <div>
      {currentMonthName && <h3 className="text-[11px] font-bold text-[#0A84FF] uppercase tracking-widest mb-3 ml-1 flex items-center gap-2"><Calendar className="w-3 h-3"/> {currentMonthName}</h3>}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-4">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate();
          const label = getDayLabel(d);
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} className={`flex flex-col items-center justify-center min-w-[70px] h-[85px] rounded-[20px] transition-all duration-300 border ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-white/5 text-gray-500'}`}>
              <span className={`text-[10px] uppercase font-bold tracking-wide mb-1 ${label === 'HOJE' ? 'text-green-400' : isSel ? 'text-white' : 'text-gray-400'}`}>{label}</span>
              <span className="text-2xl font-bold">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="grid grid-cols-4 gap-3 animate-fade-in">
          {timeSlots.map(t => {
            const [h] = t.split(':').map(Number);
            const blocked = selectedDate.getDate() === now.getDate() && h <= now.getHours();
            return (
              <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                className={`py-3.5 rounded-[16px] text-[14px] font-bold transition-all duration-200 border ${selectedTime === t ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : blocked ? 'bg-white/5 border-transparent text-gray-700' : 'bg-[#1C1C1E] border-white/10 text-gray-300 hover:border-white/30'}`}>
                {blocked ? <Lock className="w-3.5 h-3.5 mx-auto opacity-20" /> : t}
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
          if (inventory.includes(codeUpper)) { alert('Você já resgatou este cupom!'); } 
          else { onAddManual(codeUpper); setManualCode(''); triggerHaptic(); }
      } else { alert('Cupom inválido ou expirado.'); }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center ml-1 mb-2">
        <h4 className="text-[13px] font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2"><Tag className="w-3 h-3"/> Cupons & Benefícios</h4>
      </div>
      <div className="flex gap-2 mb-3">
          <input value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Código (ex: VIP20)..." className="w-full bg-[#1C1C1E] border border-white/10 text-white text-[15px] rounded-[16px] p-4 placeholder:text-gray-600 focus:border-[#0A84FF]" />
          <button onClick={handleManualAdd} className="bg-[#2C2C2E] border border-white/10 text-white px-6 rounded-[16px] font-bold text-[13px] hover:bg-[#3A3A3C]">Add</button>
      </div>
      {myCoupons.length > 0 && (
        <div className="space-y-3">
          {myCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <button key={coupon.code} onClick={() => { triggerHaptic(); isApplied ? onRemove() : onApply(coupon.code); }} className={`w-full p-4 rounded-[18px] flex justify-between items-center transition-all duration-300 border ${isApplied ? 'bg-[#0A84FF]/15 border-[#0A84FF] shadow-lg' : 'bg-[#1C1C1E] border-white/5'}`}>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-black bg-[#FFD60A] px-2 py-1 rounded tracking-wider">{coupon.code}</span>
                    {isApplied && <span className="text-[10px] text-[#0A84FF] font-bold">APLICADO</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">{coupon.desc}</p>
                </div>
                {isApplied ? <X className="w-5 h-5 text-gray-400" /> : <div className="w-6 h-6 rounded-full border border-gray-500 flex items-center justify-center"><Plus className="w-3 h-3 text-gray-400"/></div>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};

// ...Notifications mantido igual por brevidade...
const Notifications = ({ notifications, onClear }) => {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  useEffect(() => { const close = () => setOpen(false); if(open) window.addEventListener('click', close); return () => window.removeEventListener('click', close); }, [open]);
  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button onClick={() => { setOpen(!open); if(!open && unread > 0) onClear(); }} className="relative p-2.5 rounded-full bg-[#1C1C1E] active:bg-[#2C2C2E] transition-colors border border-white/5">
        <Bell className="w-6 h-6 text-white" />
        {unread > 0 && <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-[#1C1C1E] animate-pulse" />}
      </button>
      {open && (
        <div className="absolute top-14 right-0 w-80 bg-[#121214] border border-white/10 shadow-2xl rounded-[24px] overflow-hidden z-[100] animate-fade-in">
           <div className="p-4 border-b border-white/10 bg-[#1C1C1E] flex justify-between items-center">
             <h4 className="font-semibold text-white text-sm">Central de Avisos</h4>
             <button onClick={() => setOpen(false)} className="p-1"><X className="w-4 h-4 text-gray-400"/></button>
           </div>
           <div className="max-h-64 overflow-y-auto p-2">
             {notifications.length === 0 ? <div className="p-6 text-center text-gray-500 text-sm">Sem novidades.</div> : notifications.map(n => (
                 <div key={n.id} className="p-3 mb-1 rounded-xl bg-white/5 border border-white/5">
                   <div className="flex justify-between"><p className="text-sm font-semibold text-white mb-0.5">{n.title}</p><span className="text-[10px] text-gray-500">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                   <p className="text-xs text-gray-400 leading-snug">{n.message}</p>
                 </div>
               ))}
           </div>
        </div>
      )}
    </div>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [step, setStep] = useState('scan'); // 2. Feature: Scan Biométrico Inicial
  const [loading, setLoading] = useState(false);
  const [camouflage, setCamouflage] = useState(false); // 1. Feature: Camuflagem
  
  // Refs & States
  const locationRef = useRef(null);
  const vibeRef = useRef(null);
  const extrasRef = useRef(null);
  const paymentRef = useRef(null);
  const homeRef = useRef(null);

  const scrollTo = (ref) => setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);

  const [loyalty, setLoyalty] = useState(() => {
    const saved = localStorage.getItem('thaly_system_v70'); 
    return saved ? JSON.parse(saved) : { savedName: '', avatar: '😎', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], history: [] };
  });

  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, mood: null, aroma: false, paymentMethod: null, installments: 1 });
  const [showFaq, setShowFaq] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [weatherHint, setWeatherHint] = useState("");

  const surfaceRef = useRef(null);

  // Inicialização com Scan Fake
  useEffect(() => {
    if (step === 'scan') {
      setTimeout(() => setStep('home'), 2500);
    }
  }, [step]);

  useEffect(() => {
    localStorage.setItem('thaly_system_v70', JSON.stringify(loyalty));
    if (loyalty.savedName) { setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true})); }
  }, [loyalty]);

  useEffect(() => {
    const hr = new Date().getHours();
    setGreeting(hr < 12 ? "Bom dia" : hr < 18 ? "Boa tarde" : "Boa noite");
    // 17. Feature: Frases de Impacto por Horário
    if (hr >= 22 || hr < 5) setWeatherHint("🌙 A madrugada é o melhor momento para segredos.");
    else if (hr >= 18) setWeatherHint("🌑 A noite pede um alívio intenso.");
    else setWeatherHint("☀️ O dia está corrido? Pare e respire.");
  }, []);

  useEffect(() => { if (selection.location?.allowsTableChoice && step === 'configure') setTimeout(() => surfaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); }, [selection.location, step]);
  useEffect(() => { if (step === 'home') homeRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const handleQuickSchedule = () => { triggerHaptic(); loyalty.savedName ? setStep('services') : setStep('identity'); };
  
  // 15. Feature: WhatsApp Anti-Curioso (Texto técnico)
  const handleCopyPix = () => { navigator.clipboard.writeText("62922530000144"); alert("Chave Pix Copiada! Banco Inter"); }; 

  const handleAddManualCoupon = (code) => {
      if (!loyalty.inventory.includes(code)) { setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]})); triggerHaptic(); } 
      else { alert('Você já possui este benefício!'); }
  };

  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    if (selection.location?.fee) total += selection.location.fee;
    if (selection.upgrade) total += selection.service.basePrice * 0.5;
    if (selection.useTable) total += 20;
    if (selection.aroma) total += 10;
    if (selection.coupon) {
      if (selection.coupon.type === 'percent') total -= (total * selection.coupon.value / 100);
      else total -= selection.coupon.value;
    }
    return Math.max(0, total);
  }

  const calcOriginalPrice = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    if (selection.location?.fee) total += selection.location.fee;
    if (selection.upgrade) total += selection.service.basePrice * 0.5;
    if (selection.useTable) total += 20;
    if (selection.aroma) total += 10;
    return total;
  }

  const calcFinalPrice = () => {
    let base = calcBaseTotal();
    if (selection.paymentMethod === 'credit_card') {
       const rate = CARD_RATES[selection.installments] || 0;
       return base / (1 - rate);
    }
    return base;
  };

  const canFinalize = selection.service && selection.location && selection.date && selection.time && selection.music && selection.mood && selection.paymentMethod && (selection.location.allowsTableChoice ? selection.useTable !== null : true) && (selection.location.id === 'outras-cidades' ? !!selection.city : true);

  const handleWhatsApp = () => {
    triggerHaptic();
    if (!canFinalize) return;
    if (selection.coupon && !loyalty.inventory.includes(selection.coupon.code)) { alert("Cupom inválido."); setSelection(prev => ({ ...prev, coupon: null })); return; }

    const basePrice = calcBaseTotal();
    const finalPrice = calcFinalPrice();
    const oldTotal = loyalty.totalSpent;
    const newTotal = oldTotal + selection.service.basePrice; 
    const bookingId = generateBookingId(); 
    const discountAmount = selection.coupon ? (selection.coupon.type === 'percent' ? (calcBaseTotal() / (1 - selection.coupon.value/100) - calcBaseTotal()) : selection.coupon.value) : 0;
    
    let newInventory = [...loyalty.inventory];
    if (selection.coupon) { newInventory = newInventory.filter(c => c !== selection.coupon.code); }

    const notifications = [...loyalty.notifications];
    LEVELS.forEach(lvl => {
      if (newTotal >= lvl.min && oldTotal < lvl.min && lvl.rewardCode) {
        if (!newInventory.includes(lvl.rewardCode)) {
          newInventory.push(lvl.rewardCode);
          notifications.unshift({ id: Date.now()+1, title: '👑 Novo Status!', message: `Você atingiu o nível ${lvl.name}!`, read: false, timestamp: Date.now() });
        }
      }
    });

    const newHistory = [{ id: Date.now(), serviceName: selection.service.name, date: new Date().toLocaleDateString(), value: basePrice }, ...loyalty.history];
    setLoyalty(prev => ({ ...prev, savedName: user.name || prev.savedName, totalSpent: newTotal, totalSaved: prev.totalSaved + discountAmount, inventory: newInventory, notifications, history: newHistory }));

    const isToday = selection.date.getDate() === new Date().getDate();
    const dateStr = `${selection.date.toLocaleDateString('pt-BR')}${isToday ? ' (HOJE)' : ''}`;
    let finalDuration = selection.service.labelDuration;
    if (selection.upgrade) { finalDuration = "60 min + 30 min (Extensão)"; }
    
    let surfaceText = "";
    if (selection.location.allowsTableChoice) surfaceText = selection.useTable ? "Maca Portátil (+R$20)" : "Leito Próprio";
    else if (selection.location.id === 'motel') surfaceText = "Suíte Privada"; 
    else surfaceText = `Local: ${selection.city}`;

    let paymentText = "";
    if (selection.paymentMethod === 'pix') paymentText = "PIX";
    else if (selection.paymentMethod === 'cash') paymentText = "ESPÉCIE";
    else if (selection.paymentMethod === 'debit_card') paymentText = "DÉBITO";
    else if (selection.paymentMethod === 'credit_card') {
        const parcelValue = finalPrice / selection.installments;
        paymentText = `CRÉDITO (${selection.installments}x ${formatCurrency(parcelValue)})`;
    }

    const moodLabel = moodOptions.find(m => m.id === selection.mood)?.label || "Normal";

    // 15. Feature: Mensagem Técnica e Discreta
    let msg = `*CONFIRMAÇÃO DE AGENDAMENTO #${bookingId}*
--------------------------------
👤 *Cliente:* ${user.name}
📅 *Data:* ${dateStr}
⏰ *Horário:* ${selection.time}
📍 *Local:* ${selection.location.label}
🛠 *Protocolo:* ${selection.service.name}
⏳ *Duração:* ${finalDuration}
🎵 *Ambiente:* ${selection.music} / ${moodLabel}
${surfaceText}
${selection.aroma ? '🌿 Aromaterapia Inclusa' : ''}

💲 *TOTAL:* ${selection.location.id === 'outras-cidades' ? 'A definir' : formatCurrency(finalPrice)}
💳 *Pagamento:* ${paymentText}
--------------------------------
*Status:* Aguardando aprovação do terapeuta.
_Mensagem gerada automaticamente pelo App._`;

    msg = msg.replace(/^\s*[\r\n]/gm, "");
    window.open(`https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, mood: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  if (camouflage) return <FakeSpreadsheet onExit={() => setCamouflage(false)} />;

  // Tela de Scan Biométrico (Fake)
  if (step === 'scan') return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <Fingerprint className="w-24 h-24 text-[#0A84FF] animate-pulse mb-6 opacity-80"/>
        <h2 className="text-xl font-bold text-white mb-2">Verificação de Segurança</h2>
        <p className="text-gray-500 text-sm">Validando identidade e acesso...</p>
        <div className="w-48 h-1 bg-gray-800 rounded-full mt-8 overflow-hidden">
            <div className="h-full bg-[#0A84FF] animate-[width_2s_ease-out_forwards]" style={{width: '100%'}}></div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-6 font-sans text-gray-200 bg-black selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>

      {/* Botão de Pânico */}
      <PanicButton onTrigger={() => setCamouflage(true)} />

      <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] aurora-bg">
        
        {/* HEADER FIXO */}
        {step !== 'home' && step !== 'success' && (
          <div className="absolute top-0 w-full z-30 ios-header px-6 pt-12 pb-4 flex justify-between items-center">
            {step === 'services' && loyalty.savedName ? (
               <div className="flex items-center gap-1"><button onClick={() => setStep('home')} className="p-2 -ml-2 rounded-full active:bg-white/10"><IconBack /></button></div>
            ) : (
               <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10"><IconBack /></button>
            )}
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-full bg-white/5 text-gray-400 text-[10px] font-bold border border-white/10 flex items-center gap-1"><Ghost className="w-3 h-3"/> MODO SIGILO</span>
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
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[11px] text-[#0A84FF] uppercase tracking-[0.2em] font-bold flex items-center gap-2 mb-1">
                  {greeting}
                </p>
                <h1 className="text-3xl font-bold text-white tracking-tight">{loyalty.savedName ? `Olá, ${loyalty.savedName}` : 'Bem-vindo'}</h1>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFaq(true)} className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center active:scale-95 transition-transform"><HelpCircle className="w-5 h-5 text-gray-300" /></button>
                <a href="https://www.instagram.com/thalymassagens/" target="_blank" className="w-10 h-10 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center active:scale-95 transition-transform"><Instagram className="w-5 h-5 text-[#FF2D55]" /></a>
              </div>
            </div>

            <LoyaltyCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            
            {/* 5. Feature: Indicador de Espiões */}
            <LiveStatus />
            
            {/* 4. Feature: Perfil do Massagista */}
            <MasseurProfile />

            <div className="flex justify-between items-center mb-6 px-1">
              <span className="text-[11px] font-semibold text-gray-400 bg-white/5 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2"><Music className="w-3 h-3"/> {weatherHint}</span>
            </div>

            <ReviewsCarousel />
            
            <div className="mt-auto">
              <button onClick={handleQuickSchedule} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] shadow-lg flex justify-center items-center gap-3 text-[18px] group">
                <span className="group-active:scale-95 transition-transform">Agendar Experiência</span> <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-center text-[10px] text-gray-600 mt-4 flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3"/> Seus dados não ficam salvos na nuvem.</p>
            </div>
          </div>
        )}

        {/* --- IDENTITY --- */}
        {step === 'identity' && (
          <div className="flex-1 p-6 pt-32 animate-fade-in flex flex-col h-full">
            <h2 className="text-3xl font-bold text-white mb-2">Quem é você?</h2>
            <p className="text-gray-400 text-[15px] mb-8">Para mantermos o controle interno. Use um apelido se preferir.</p>
            
            <div className="space-y-6 flex-1">
              <div className="ios-card p-5 rounded-[22px]">
                <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider block mb-2">Nome ou Apelido</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent text-white text-[19px] font-medium placeholder:text-gray-600 border-b border-white/10 py-2 focus:border-[#0A84FF] transition-colors" placeholder="Ex: Sr. Silva..." />
              </div>
              
              <div className="space-y-3">
                <button onClick={() => { triggerHaptic(); setUser({...user, isAdult: !user.isAdult}); }} className={`w-full p-5 rounded-[20px] border flex items-center gap-4 transition-all duration-300 ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-500'}`}>{user.isAdult && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[17px] font-medium ${user.isAdult ? 'text-white' : 'text-gray-400'}`}>Sou maior de 18 anos</span>
                </button>
                <button onClick={() => { triggerHaptic(); setUser({...user, isMassagemOk: !user.isMassagemOk}); }} className={`w-full p-5 rounded-[20px] border flex items-center gap-4 transition-all duration-300 ${user.isMassagemOk ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isMassagemOk ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-500'}`}>{user.isMassagemOk && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[17px] font-medium ${user.isMassagemOk ? 'text-white' : 'text-gray-400'}`}>Estou liberado para a sessão</span>
                </button>
              </div>

              <div className="mt-auto">
                <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] text-[17px] disabled:opacity-50 shadow-lg">Continuar</button>
              </div>
            </div>
          </div>
        )}

        {/* --- SERVICES --- */}
        {step === 'services' && (
          <div className="flex-1 p-6 pt-32 overflow-y-auto pb-28 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Menu Exclusivo</h2>
            </div>
            <div className="space-y-6">
              {services.map(s => (
                <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className={`ios-card p-5 rounded-[24px] active:scale-[0.98] transition-all group relative overflow-hidden ${s.id === 'masculina' ? 'border-[#0A84FF] shadow-[0_0_30px_rgba(10,132,255,0.15)]' : 'border-white/5'}`}>
                  {s.id === 'masculina' && <div className="absolute top-0 right-0 p-2 bg-[#0A84FF] rounded-bl-xl"><Flame className="w-4 h-4 text-white animate-pulse" /></div>}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-white text-[20px]">{s.name}</h3>
                    <span className="text-[#0A84FF] font-bold text-[17px] bg-[#0A84FF]/10 px-3 py-1 rounded-lg border border-[#0A84FF]/20">{formatCurrency(s.basePrice)}</span>
                  </div>
                  {s.highlight && <span className="text-[10px] font-bold text-black bg-[#FFD60A] px-2 py-0.5 rounded mb-3 inline-block tracking-wide">{s.highlight}</span>}
                  <p className="text-[15px] text-gray-300 leading-relaxed mb-4 font-medium">{s.description}</p>
                  <ul className="space-y-2.5 mb-4">
                    {s.details.map((d, idx) => (<li key={idx} className="text-[13px] text-gray-400 flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]"></div> {d}</li>))}
                  </ul>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[12px] bg-white/5 px-3 py-1.5 rounded-full text-gray-300 flex items-center gap-1.5 font-medium"><Clock className="w-3.5 h-3.5"/> {s.labelDuration}</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#0A84FF] transition-colors"><ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONFIGURE --- */}
        {step === 'configure' && selection.service && (
          <div className="flex-1 p-6 pt-32 overflow-y-auto pb-48 animate-fade-in">
            <div className="ios-card p-5 rounded-[22px] mb-8 flex items-center justify-between border-l-4 border-l-[#0A84FF]">
              <div>
                <h3 className="font-bold text-white text-[19px]">{selection.service.name}</h3>
                <p className="text-[13px] text-gray-400 mt-0.5">{selection.service.labelDuration}</p>
              </div>
              <span className="text-[19px] font-bold text-[#0A84FF]">{formatCurrency(selection.service.basePrice)}</span>
            </div>

            <div className="space-y-10">
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3.5 h-3.5"/> Disponibilidade</h4>
                </div>
                <div className="ios-card p-2 rounded-[24px]">
                   <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />
                </div>
              </section>

              <section ref={locationRef}>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/> Local do Encontro</h4>
                  {selection.location && <button onClick={() => setSelection({...selection, location: null, useTable: null, city: ''})} className="text-[10px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 px-3 py-1 rounded-full">ALTERAR</button>}
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
                            <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === false ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'ios-btn border-transparent text-gray-400'}`}>🛏 Leito Próprio</button>
                            <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === true ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'ios-btn border-transparent text-gray-400'}`}>💆‍♂️ Levar Maca (+20)</button>
                          </div>
                        )}
                        {selection.location?.id === l.id && l.id === 'outras-cidades' && (
                            <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Nome da cidade..." className="mt-3 w-full bg-[#1C1C1E] p-4 rounded-[18px] border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0A84FF] transition-all animate-fade-in" />
                        )}
                    </div>
                  )})}
                </div>
              </section>

              {/* 3. Feature: Seletor de Mood */}
              <div className="mt-4" ref={vibeRef}>
                <h4 className="text-[13px] font-bold text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-2"><Zap className="w-3.5 h-3.5"/> Como você está se sentindo?</h4>
                <div className="grid grid-cols-2 gap-3">
                   {moodOptions.map(m => (
                      <button key={m.id} onClick={() => { setSelection({...selection, mood: m.id}); scrollTo(extrasRef); }} className={`p-4 rounded-[18px] border text-left transition-all duration-300 ${selection.mood === m.id ? 'bg-[#0A84FF] border-[#0A84FF] shadow-lg' : 'ios-btn border-transparent'}`}>
                        <span className="text-2xl mb-2 block">{m.icon}</span>
                        <p className={`text-[14px] font-bold ${selection.mood === m.id ? 'text-white' : 'text-gray-300'}`}>{m.label}</p>
                        <p className={`text-[10px] ${selection.mood === m.id ? 'text-white/80' : 'text-gray-500'}`}>{m.desc}</p>
                      </button>
                   ))}
                </div>
                
                {selection.mood && (
                  <div className="mt-6 animate-fade-in">
                    <h4 className="text-[13px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Trilha Sonora</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {musicVibes.map(vibe => (
                          <button key={vibe} onClick={() => { setSelection({...selection, music: vibe}); }} className={`px-5 py-3 rounded-[16px] border text-[13px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${selection.music === vibe ? 'bg-white text-black border-white' : 'ios-btn border-transparent text-gray-400'}`}>
                            {vibe}
                          </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3" ref={extrasRef}>
                <h4 className="text-[13px] font-bold text-gray-400 uppercase mb-1 tracking-widest mt-4">Personalização</h4>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, upgrade: !selection.upgrade}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">Extensão (+30min)</p><p className="text-[11px] text-gray-500">Para não ter pressa de acabar</p></div>
                  <span className="text-[#0A84FF] font-bold text-[15px]">+{formatCurrency(selection.service.basePrice * 0.5)}</span>
                </button>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, aroma: !selection.aroma}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">Aromaterapia 🌿</p><p className="text-[11px] text-gray-500">Óleos essenciais afrodisíacos</p></div>
                  <span className="text-[#0A84FF] font-bold text-[15px]">+R$ 10,00</span>
                </button>
              </div>

              <CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(code) => { setSelection({...selection, coupon: SYSTEM_COUPONS[code]}); scrollTo(paymentRef); }} onRemove={() => setSelection({...selection, coupon: null})} onAddManual={handleAddManualCoupon}/>

              <div className="mt-6" ref={paymentRef}>
                <h4 className="text-[13px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Pagamento</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`p-4 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}><QrCode className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Pix</span></button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`p-4 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}><Banknote className="w-6 h-6 text-[#30D158]" /><span className="text-[13px] font-bold text-white">Dinheiro</span></button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'debit_card'})} className={`p-4 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'debit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}><CreditCard className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Débito</span></button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`p-4 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}><CreditCard className="w-6 h-6 text-[#FFD60A]" /><span className="text-[13px] font-bold text-white">Crédito</span></button>
                </div>
                {selection.paymentMethod === 'credit_card' && (
                  <div className="mt-3 ios-card p-3 rounded-[16px] animate-fade-in">
                    <label className="text-[12px] text-gray-400 block mb-1 font-bold ml-1">Parcelas (Discreto na Fatura):</label>
                    <select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#1C1C1E] border border-white/10 text-white text-[15px] rounded-lg p-3 focus:border-[#0A84FF]">
                      {Array.from({length: 12}, (_, i) => i + 1).map(num => {
                          const rate = CARD_RATES[num] || 0;
                          const totalWithRate = calcBaseTotal() / (1 - rate);
                          const parcelValue = totalWithRate / num;
                          return <option key={num} value={num}>{num}x de {formatCurrency(parcelValue)} (Total: {formatCurrency(totalWithRate)})</option>;
                      })}
                    </select>
                  </div>
                )}

                <div className="mt-8 mb-4 ios-card p-5 rounded-[22px] border border-white/5 bg-[#121214]">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5"><Receipt className="w-4 h-4 text-gray-400" /><span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Resumo do Pedido</span></div>
                    <div className="space-y-3 text-[14px]">
                        <div className="flex justify-between text-gray-300"><span>{selection.service.name}</span><span>{formatCurrency(selection.service.basePrice)}</span></div>
                        {selection.location?.fee > 0 && <div className="flex justify-between text-gray-400"><span>+ Taxa Deslocamento</span><span>{formatCurrency(selection.location.fee)}</span></div>}
                        {selection.upgrade && <div className="flex justify-between text-gray-400"><span>+ Extensão (+30m)</span><span>{formatCurrency(selection.service.basePrice * 0.5)}</span></div>}
                        {selection.useTable && <div className="flex justify-between text-gray-400"><span>+ Maca Portátil</span><span>{formatCurrency(20)}</span></div>}
                        {selection.aroma && <div className="flex justify-between text-gray-400"><span>+ Aromaterapia</span><span>{formatCurrency(10)}</span></div>}
                        {selection.coupon && <div className="flex justify-between text-[#30D158]"><span>Desconto ({selection.coupon.code})</span><span>-{selection.coupon.type === 'percent' ? formatCurrency(calcBaseTotal() / (1 - selection.coupon.value/100) - calcBaseTotal()) : formatCurrency(selection.coupon.value)}</span></div>}
                        {selection.location?.id === 'motel' && <div className="flex items-center gap-2 text-[#FFD60A] text-[11px] bg-[#FFD60A]/10 p-2 rounded-lg mt-2"><Info className="w-3 h-3" /><span>Taxa da Suíte (R$75) paga separadamente no local.</span></div>}
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER FIXO */}
        {step === 'configure' && selection.location && (
          <div className="absolute bottom-0 w-full p-0 z-30">
            <div className="h-12 bg-gradient-to-t from-[#000] to-transparent pointer-events-none"></div>
            <div className="bg-[#1C1C1E]/95 backdrop-blur-xl rounded-t-[32px] p-6 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
              <div className="flex justify-between items-end mb-4 px-1">
                <div className='flex flex-col'>
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">TOTAL PREVISTO</span>
                  <div className="flex items-end gap-3">
                    {(selection.coupon || selection.paymentMethod === 'credit_card') && <span className="text-sm text-gray-500 line-through font-medium mb-1">{formatCurrency(calcOriginalPrice())}</span>}
                    <span className="text-4xl font-bold text-white tracking-tighter leading-none">{selection.location.id === 'outras-cidades' ? 'A definir' : formatCurrency(calcFinalPrice())}</span>
                  </div>
                  {selection.paymentMethod === 'credit_card' && <span className="text-[10px] text-gray-500 mt-1 ml-0.5">Inclui taxa da máquina</span>}
                </div>
              </div>
              <button disabled={!canFinalize} onClick={handleWhatsApp} className="w-full bg-[#0A84FF] hover:bg-[#007AFF] active:scale-[0.98] transition-all text-white font-bold py-4 rounded-[20px] shadow-[0_4px_20px_rgba(10,132,255,0.4)] flex justify-center items-center gap-2 text-[17px] disabled:opacity-50 disabled:shadow-none uppercase tracking-wide">
                {canFinalize ? `Confirmar (${selection.upgrade ? '90' : '60'} min) • ${formatCurrency(calcFinalPrice())}` : 'Preencha tudo para continuar'} <MessageCircle className="w-5 h-5"/>
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-24 h-24 bg-[#30D158] rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(48,209,88,0.4)] animate-scale"><Check className="w-12 h-12 text-white drop-shadow-md"/></div>
            <h2 className="text-3xl font-bold text-white mb-3">Tudo Certo!</h2>
            <p className="text-gray-400 mb-10 text-[17px] leading-relaxed">Seu agendamento foi gerado. Finalize a conversa no WhatsApp para garantir sua vaga.</p>
            <button onClick={handleCopyPix} className="mb-6 flex items-center gap-2 text-[15px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 px-6 py-3 rounded-xl border border-[#0A84FF]/20 hover:bg-[#0A84FF]/20 transition-colors"><Copy className="w-4 h-4"/> Copiar Pix</button>
            <button onClick={handleReset} className="w-full ios-btn py-4 rounded-[18px] text-white font-bold">Voltar ao Início</button>
          </div>
        )}

        {showFaq && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-5">
            <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[32px] p-8 border border-white/10 shadow-2xl animate-scale">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Shield className="w-7 h-7 text-[#0A84FF]" /> Segurança & Dúvidas</h3>
              <div className="space-y-5 text-[15px] text-gray-300 leading-relaxed">
                <p>🔒 <strong>Sigilo Absoluto:</strong> Seus dados não ficam salvos. O app roda apenas no seu navegador.</p>
                <p>🚫 <strong>Conduta:</strong> Não tem sexo,oral. Apenas massagem terapêutica e relaxamento. Ambiente seguro e sem julgamentos. Relaxar e não cansar mais kkk</p>
                <p>💳 <strong>Pagamentos:</strong>PIX, dinheiro e cartões até 12x.</p>
                <div className="pt-6 border-t border-white/10">
                   <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-xs text-[#FF3B30] flex items-center gap-2 font-bold uppercase tracking-wider"><Trash2 className="w-3.5 h-3.5"/> Destruir Dados Locais</button>
                </div>
              </div>
              <button onClick={() => setShowFaq(false)} className="mt-8 w-full bg-[#2C2C2E] text-white py-4 rounded-[18px] font-bold">Entendi</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
