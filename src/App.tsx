import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, Siren, Send, ThumbsUp, Car, Menu, Smartphone, Sparkles, Settings, MoreHorizontal
} from 'lucide-react';

// ==================================================================================
// 1. INFRAESTRUTURA DE SEGURANÇA & ARMAZENAMENTO
// ==================================================================================

const SecureStorage = {
  SECRET: 'THALY_ULTIMATE_FINAL_',
  encrypt: (data) => {
    try { return btoa(encodeURIComponent(JSON.stringify(data))); } catch (e) { return null; }
  },
  decrypt: (cipher) => {
    try { return JSON.parse(decodeURIComponent(atob(cipher))); } catch (e) { return null; }
  },
  set: (key, data) => {
    const cipher = SecureStorage.encrypt(data);
    if (cipher) localStorage.setItem(SecureStorage.SECRET + key, cipher);
  },
  get: (key) => {
    const cipher = localStorage.getItem(SecureStorage.SECRET + key);
    // Tenta recuperar versão antiga se não achar a nova
    if (!cipher) {
        const old = localStorage.getItem('thaly_system_v22');
        if(old) {
            try { return JSON.parse(old); } catch(e) { return null; }
        }
        return null;
    }
    return cipher ? SecureStorage.decrypt(cipher) : null;
  },
  clear: () => localStorage.clear()
};

const generateBookingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 4; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return result;
};

const generateCalendarLink = (serviceName, date, time) => {
  if (!date || !time) return '';
  const [hours, minutes] = time.split(':');
  const startDate = new Date(date);
  startDate.setHours(parseInt(hours), parseInt(minutes));
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1);
  const formatDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(serviceName)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent("Sessão confirmada com Thalyson Massagens.")}&location=${encodeURIComponent("Santa Fé do Sul")}`;
};

// ==================================================================================
// 2. ESTILOS GLOBAIS (CSS IN JS)
// ==================================================================================

const globalStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  overscroll-behavior-y: none; touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif; 
  color: #fff; background: #000; -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Aurora Background */
.aurora-bg {
  background: radial-gradient(140% 100% at 50% 0%, rgba(20, 20, 22, 1), #000000 60%), radial-gradient(100% 100% at 50% 100%, rgba(10, 132, 255, 0.04), transparent 50%);
  background-attachment: fixed; background-size: cover; min-height: 100vh;
}

/* UI Elements */
.ios-card { 
  background: rgba(28, 28, 30, 0.55); backdrop-filter: blur(50px);
  border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease;
}
.ios-card:active { transform: scale(0.99); }

.ios-btn-primary {
  background: linear-gradient(135deg, #007AFF, #0055FF); color: white; 
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.3); border: none;
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }
.ios-btn-primary:disabled { filter: grayscale(1); opacity: 0.5; }

.custom-input {
  background: rgba(28, 28, 30, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white; transition: all 0.3s ease;
}
.custom-input:focus { border-color: #0A84FF; box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2); }

/* 3D FLIP CARD */
.flip-container { perspective: 1000px; }
.flip-card { 
  position: relative; width: 100%; height: 100%; text-align: center; 
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; 
}
.flip-card.flipped { transform: rotateY(180deg); }
.flip-front, .flip-back { 
  position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; 
  border-radius: 28px; overflow: hidden;
}
.flip-back { transform: rotateY(180deg); background: #1C1C1E; border: 1px solid rgba(255,255,255,0.1); }

/* TOASTS */
.toast-container { position: fixed; top: 10px; left: 0; right: 0; z-index: 9999; display: flex; flex-col; align-items: center; gap: 8px; pointer-events: none; }
.toast { pointer-events: auto; background: rgba(30,30,30,0.95); backdrop-filter: blur(12px); color: white; padding: 12px 20px; border-radius: 50px; font-size: 13px; font-weight: 600; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; items-center; gap: 8px; border: 1px solid rgba(255,255,255,0.1); animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* ANIMATIONS */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
.animate-fade-in { animation: fadeIn 0.6s ease forwards; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-float { animation: float 3s ease-in-out infinite; }
`;

const IconBack = () => <ChevronLeft className="w-6 h-6 text-[#0A84FF]" />;

// ==================================================================================
// 3. DADOS COMPLETOS (SEM CORTES)
// ==================================================================================

const CONFIG = {
  PRICES: { MACA: 20, AROMA_FULL: 10, AROMA_DISCOUNT: 5, UPGRADE_PCT: 0.5 }
};

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

const locations = [
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Vou com você', fee: 75, allowsTableChoice: false, isMotel: true },
  { id: 'santa-fe', label: 'Santa Fé do Sul', sublabel: 'No conforto do seu lar', fee: 40, allowsTableChoice: true, isUber: true },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', sublabel: 'Atendimento na região', fee: 0, allowsTableChoice: false, estimatedTravelTime: 'A combinar', input: true, isPending: true },
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
  { name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', perks: ["Acesso VIP", "Agendamento"] },
  { name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', perks: ["Cupom R$ 15", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', perks: ["Cupom R$ 25", "Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: ["Cupom R$ 50", "Prioridade Total"] },
];

const REVIEWS_DB = [
  { t: "Sou casado, o sigilo foi total. A massagem tântrica me surpreendeu.", a: "Sigiloso (44 anos)", r: 5 },
  { t: "Nunca tinha feito tântrica. A sensibilidade que ele desperta no corpo é absurda.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Mão leve e firme ao mesmo tempo. A manipulação no lingam me levou às alturas.", a: "Anônimo", r: 5 },
  { t: "Profissionalismo puro. Massagem relaxante de verdade, com um final feliz incrível.", a: "D.S.", r: 5 },
  { t: "Discrição garantida. Para quem é casado e quer relaxar sem preocupação.", a: "Empresário", r: 5 },
  { t: "Primeira vez recebendo massagem no lingam. Foi uma descoberta.", a: "Pedro (24 anos)", r: 5 },
  { t: "Gozei tanto que fiquei sem pernas. Vergonha rs, mas foi muito bom.", a: "Safado", r: 5 },
  { t: "O toque de cueca roçando... excitante demais.", a: "Curioso (30)", r: 5 },
  { t: "Me tratou super bem. A massagem perineal ajudou muito na potência.", a: "C.A.", r: 5 },
  { t: "Fiquei com receio, mas ele é super profissional. Relaxei e gozei muito.", a: "Iniciante", r: 5 },
  { t: "Muito bom. Aliviou a tensão e o tesão acumulado.", a: "Trabalhador", r: 4 },
  { t: "Experiência completa. Banho, tântrica e alívio manual. Nota 10.", a: "M.S.", r: 5 },
  { t: "O melhor da região. Técnica apurada, sabe levar ao clímax sem pressa.", a: "Cliente Vip", r: 5 }
];

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];
const musicVibes = ['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘', 'Lofi HipHop ☕']; 
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(5); };

// ==================================================================================
// 4. SUB-COMPONENTES AVANÇADOS
// ==================================================================================

const InstallPrompt = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isMobile && !isStandalone) setTimeout(() => setShow(true), 3000);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 animate-slide-up">
      <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0A84FF] rounded-lg flex items-center justify-center"><Smartphone className="text-white w-6 h-6"/></div>
          <div><p className="text-white font-bold text-sm">Instalar App</p><p className="text-gray-400 text-xs">Acesso rápido e offline</p></div>
        </div>
        <button onClick={() => setShow(false)} className="p-2 bg-white/10 rounded-full"><X className="w-4 h-4"/></button>
      </div>
    </div>
  );
};

const LoyaltyFlipCard = ({ data, privacyMode }) => {
  const [flipped, setFlipped] = useState(false);
  const safeSpent = data.totalSpent || 0;
  const currentLevel = [...LEVELS].reverse().find(l => safeSpent >= l.min) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const progress = nextLevel ? Math.min(100, Math.max(0, ((safeSpent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)) : 100;

  return (
    <div className="flip-container h-48 mb-6" onClick={() => { triggerHaptic(); setFlipped(!flipped); }}>
      <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
        {/* FRENTE */}
        <div className="flip-front ios-card p-5 relative bg-gradient-to-br from-[#1C1C1E] to-[#000]">
          <div className="absolute top-0 right-0 p-4 opacity-50"><MoreHorizontal className="w-5 h-5 text-gray-400"/></div>
          <div className="flex flex-col h-full justify-between">
            <div className='text-left'>
              <p className="text-[10px] uppercase tracking-widest text-[#0A84FF] font-bold mb-1">Thalyson Rewards</p>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">{currentLevel.name} {currentLevel.icon}</h3>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-gray-400">{privacyMode ? '••••' : formatCurrency(safeSpent)} investidos</span>
                <span className="text-xs font-bold text-[#32D74B]">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#32D74B] transition-all duration-1000" style={{ width: `${progress}%` }}/>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-right">{nextLevel ? `Faltam ${formatCurrency(nextLevel.min - safeSpent)} para ${nextLevel.name}` : 'Nível Máximo!'}</p>
            </div>
          </div>
        </div>
        {/* VERSO */}
        <div className="flip-back flex flex-col items-center justify-center p-5 relative bg-[#111]">
          <div className="absolute top-4 left-4 text-[10px] text-gray-500 uppercase font-bold">Seu ID de Membro</div>
          <div className="bg-white p-2 rounded-xl"><QrCode className="w-24 h-24 text-black"/></div>
          <p className="text-gray-400 text-xs mt-3 font-mono tracking-widest">MEMBER-{data.savedName ? data.savedName.slice(0,3).toUpperCase() : 'GST'}-{Math.floor(Math.random()*999)}</p>
          <p className="text-[10px] text-[#0A84FF] mt-2 animate-pulse">Apresente para Check-in</p>
        </div>
      </div>
    </div>
  );
};

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
  const cr = REVIEWS_DB[idx];
  return (
    <div className="relative h-28 flex items-center justify-center mb-8">
      <div key={idx} className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in px-4 bg-[#1C1C1E] rounded-[24px] border border-white/5 shadow-xl">
        <div className="flex gap-1 mb-2">{[...Array(5)].map((_,k) => <Star key={k} className={`w-3.5 h-3.5 ${k < cr.r ? 'text-[#FFD60A] fill-[#FFD60A]' : 'text-gray-800'}`}/>)}</div>
        <p className="text-[13px] text-gray-200 text-center font-medium italic">"{cr.t}"</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-2">- {cr.a}</p>
      </div>
    </div>
  );
};

// Seletor de Datas Completo (Grade)
const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const days = []; const now = new Date();
  for (let i = 0; i < 16; i++) { const d = new Date(now); d.setDate(now.getDate() + i); days.push(d); }
  const isTimeBlocked = (t, d) => {
    if(!d) return true;
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    if (!isToday) return false;
    const [h] = t.split(':').map(Number); return h <= now.getHours() + 1;
  };
  const periods = [{ l: 'Manhã', s: ['09:00','10:00','11:00'] }, { l: 'Tarde', s: ['13:00','14:00','15:00','16:00','17:00'] }, { l: 'Noite', s: ['18:00','19:00','20:00','21:00'] }];

  return (
    <div className="w-full select-none">
      <div className="flex justify-between items-end mb-4 px-1"><h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Escolha o Dia</h4></div>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate();
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} className={`flex flex-col items-center justify-center h-[70px] rounded-[16px] border ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#2C2C2E] border-white/5 text-gray-400'}`}>
              <span className="text-[9px] uppercase font-bold">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
              <span className="text-xl font-mono font-bold">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="animate-slide-up space-y-4 pt-2 border-t border-white/5">
           {periods.map((p, idx) => (
             <div key={idx}>
                <h5 className="text-[11px] font-bold text-gray-500 uppercase mb-2">{p.l}</h5>
                <div className="grid grid-cols-4 gap-2">
                   {p.s.map(t => {
                       const blk = isTimeBlocked(t, selectedDate);
                       return <button key={t} disabled={blk} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} className={`py-2 rounded-[10px] text-[12px] font-bold ${selectedTime === t ? 'bg-[#0A84FF] text-white' : blk ? 'bg-white/5 text-gray-600 opacity-30' : 'bg-[#2C2C2E] text-gray-300'}`}>{t}</button>
                   })}
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

// Recibo Visual Detalhado
const OrderReceipt = ({ selection, priceFunc }) => {
  const finalPrice = priceFunc();
  return (
    <div className="mt-8 mx-2 mb-32 bg-white text-black rounded-[10px] p-6 font-mono text-sm shadow-2xl relative animate-slide-up transform rotate-1">
      <div className="absolute top-0 left-0 right-0 h-4 bg-white" style={{background: 'linear-gradient(45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%)', backgroundSize: '12px 20px', backgroundPosition: '0 -10px'}}></div>
      <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4 mt-2"><h3 className="font-bold text-lg uppercase">Massagens Relaxantes</h3><p className="text-xs text-gray-500">Resumo do Pedido</p></div>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between"><span>{selection.service.name}</span><span>{formatCurrency(selection.service.basePrice)}</span></div>
        {selection.upgrade && <div className="flex justify-between text-gray-600 text-xs"><span>+ 30 Minutos</span><span>{formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span></div>}
        {selection.useTable && <div className="flex justify-between text-gray-600 text-xs"><span>+ Maca Portátil</span><span>{formatCurrency(CONFIG.PRICES.MACA)}</span></div>}
        {selection.aroma && <div className="flex justify-between text-gray-600 text-xs"><span>+ Aromaterapia</span><span>VIP</span></div>}
        {selection.location.fee > 0 && <div className="flex justify-between text-blue-600 font-bold border-t border-dashed border-gray-200 pt-2"><span>Taxa Local</span><span>{formatCurrency(selection.location.fee)}</span></div>}
        {selection.coupon && <div className="flex justify-between text-red-500"><span>Desconto ({selection.coupon.code})</span><span>APLICADO</span></div>}
      </div>
      <div className="border-t-2 border-black pt-4 flex justify-between items-end"><span className="font-bold text-xl">TOTAL</span><span className="font-bold text-2xl">{formatCurrency(finalPrice)}</span></div>
      <div className="mt-4 text-center text-[10px] text-gray-400">AGUARDANDO CONFIRMAÇÃO VIA WHATSAPP</div>
    </div>
  )
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showUpsell, setShowUpsell] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [manualCode, setManualCode] = useState('');

  // Refs
  const locationRef = useRef(null); const vibeRef = useRef(null); const extrasRef = useRef(null); const paymentRef = useRef(null); const receiptRef = useRef(null); const surfaceRef = useRef(null);
  const scrollTo = (ref) => setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);

  // States
  const [loyalty, setLoyalty] = useState(() => SecureStorage.get('DATA') || { savedName: '', totalSpent: 0, inventory: ['BEMVINDO'], notifications: [] });
  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: 'Zen 🧘', aroma: false, paymentMethod: null, installments: 1 });
  const [privacyMode, setPrivacyMode] = useState(true);

  // Init
  useEffect(() => { 
      setTimeout(() => setLoading(false), 1500); 
      if(loyalty.savedName) setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true})); 
      document.title = "Massagens Relaxantes";
  }, []);
  
  useEffect(() => { SecureStorage.set('DATA', loyalty); }, [loyalty]);

  const addToast = (msg, type = 'info') => {
    const id = Date.now(); setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleLogoClick = () => {
    setAdminClicks(c => c + 1);
    if(adminClicks + 1 === 5) { setIsAdmin(true); addToast("Modo Admin Ativado 🕵️‍♂️", "success"); setAdminClicks(0); }
  };

  const handleAddCoupon = () => {
      const codeUpper = manualCode.toUpperCase().trim();
      if(codeUpper && SYSTEM_COUPONS[codeUpper]) {
          if(!loyalty.inventory.includes(codeUpper)) {
             setLoyalty(p => ({...p, inventory: [...p.inventory, codeUpper]}));
             addToast('Cupom Adicionado!', 'success');
             setManualCode('');
          } else addToast('Você já tem este cupom.', 'info');
      } else addToast('Cupom Inválido.', 'error');
  };

  // Preço Calculation (Centralized Logic)
  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.useTable) total += CONFIG.PRICES.MACA;
    
    // Aroma Logic (Level based)
    const level = [...LEVELS].reverse().find(l => (loyalty.totalSpent||0) >= l.min) || LEVELS[0];
    let aromaPrice = (level.name === 'Ouro' || level.name === 'Diamante') ? 0 : (level.name === 'Prata' ? CONFIG.PRICES.AROMA_DISCOUNT : CONFIG.PRICES.AROMA_FULL);
    if (selection.aroma) total += aromaPrice;

    if (selection.location?.fee) total += selection.location.fee;
    
    if (selection.coupon) {
      let discountableAmount = total - (selection.location?.fee || 0); 
      let discountValue = selection.coupon.type === 'percent' ? (discountableAmount * selection.coupon.value / 100) : selection.coupon.value;
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

  const canFinalize = selection.service && selection.location && selection.date && selection.time && selection.paymentMethod && (selection.location.allowsTableChoice ? selection.useTable !== null : true) && (selection.location.id === 'outras-cidades' ? !!selection.city : true);

  const handlePreFinalize = () => {
    if (!canFinalize) { addToast("Preencha todos os dados!", "error"); return; }
    if (!selection.aroma && !selection.upgrade) { setShowUpsell(true); } else { handleWhatsApp(); }
  };

  const handleWhatsApp = (acceptedUpsell = false) => {
    let currentSelection = { ...selection };
    if (acceptedUpsell) { currentSelection.aroma = true; setSelection(currentSelection); }

    const priceBase = currentSelection.service.basePrice;
    let extrasTxt = "";
    if (currentSelection.upgrade) extrasTxt += "\n➕ +30 Min (+Upgrade)"; 
    if (currentSelection.useTable) extrasTxt += "\n➕ Maca Portátil"; 
    
    const level = [...LEVELS].reverse().find(l => (loyalty.totalSpent||0) >= l.min) || LEVELS[0];
    let aromaPrice = (level.name === 'Ouro' || level.name === 'Diamante') ? 0 : (level.name === 'Prata' ? CONFIG.PRICES.AROMA_DISCOUNT : CONFIG.PRICES.AROMA_FULL);
    if (currentSelection.aroma) extrasTxt += `\n➕ Aromaterapia (${aromaPrice === 0 ? 'GRÁTIS' : formatCurrency(aromaPrice)})`;

    let fee = currentSelection.location.fee || 0;
    let discount = 0;
    if (currentSelection.coupon) {
        let baseForDiscount = priceBase + (currentSelection.upgrade ? priceBase * CONFIG.PRICES.UPGRADE_PCT : 0) + (currentSelection.useTable ? CONFIG.PRICES.MACA : 0) + (currentSelection.aroma ? aromaPrice : 0);
        discount = currentSelection.coupon.type === 'percent' ? (baseForDiscount * currentSelection.coupon.value / 100) : currentSelection.coupon.value;
    }

    const finalVal = calcFinalPrice(); 
    
    // Update Loyalty
    const newTotalSpent = (loyalty.totalSpent || 0) + priceBase; 
    setLoyalty(prev => ({...prev, totalSpent: newTotalSpent, savedName: user.name }));

    const msg = `*NOVO PEDIDO #${generateBookingId()}*
👤 ${user.name}
📅 ${currentSelection.date.toLocaleDateString()} às ${currentSelection.time}
💆 ${currentSelection.service.name}
📍 ${currentSelection.location.label} ${currentSelection.city ? `(${currentSelection.city})` : ''}

*RESUMO:*
Base: ${formatCurrency(priceBase)}${extrasTxt}
Taxa Local: ${formatCurrency(fee)}
Desconto: -${formatCurrency(discount)}

*TOTAL: ${formatCurrency(finalVal)}*
Pagamento: ${currentSelection.paymentMethod === 'credit_card' ? `${currentSelection.installments}x Cartão` : currentSelection.paymentMethod}
🎵 Vibe: ${currentSelection.music}`;

    window.open(`https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success'); setShowUpsell(false);
  };

  return (
    <div className="min-h-screen flex justify-center bg-black text-gray-200 font-sans">
      <style>{globalStyles}</style>
      <div className="toast-container">{toasts.map(t => (<div key={t.id} className="toast" style={{borderLeft: `4px solid ${t.type === 'error' ? '#FF3B30' : '#32D74B'}`}}>{t.type === 'error' ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>} {t.msg}</div>))}</div>

      {loading ? (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
          <p className="mt-4 text-xs font-bold tracking-[0.3em] text-blue-500 animate-pulse">CARREGANDO</p>
        </div>
      ) : (
        <div className="w-full max-w-[440px] bg-[#000] sm:my-4 sm:rounded-[40px] sm:border border-white/10 shadow-2xl relative overflow-hidden h-screen sm:h-[90vh] flex flex-col aurora-bg">
          
          {/* HEADER */}
          <div className="relative z-20 px-6 pt-10 pb-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
             {step !== 'home' && step !== 'success' ? (
               <button onClick={() => setStep(step === 'config' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full bg-white/5 backdrop-blur-md"><IconBack/></button>
             ) : (
               <div onClick={handleLogoClick} className="cursor-pointer">
                 <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Bem-vindo</p>
                 <h1 className="text-xl font-bold text-white">Massagens Relaxantes</h1>
               </div>
             )}
             <div className="flex gap-3">
               <button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-white/10"><Menu className="w-5 h-5 text-gray-400"/></button>
             </div>
          </div>
          
          {/* MENU MODAL */}
          {showMenu && (
             <div className="absolute top-20 right-6 w-48 bg-[#1C1C1E] border border-white/10 rounded-2xl z-50 animate-slide-up overflow-hidden shadow-2xl">
                <button onClick={() => { SecureStorage.clear(); window.location.reload(); }} className="w-full p-4 text-left text-red-500 text-sm hover:bg-white/5 flex items-center gap-2"><LogOut size={16}/> Sair / Resetar</button>
             </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 pb-32 relative z-10 scrollbar-hide">
            {step === 'home' && (
              <div className="animate-fade-in pt-4">
                <LoyaltyFlipCard data={loyalty} privacyMode={privacyMode} />
                <ReviewsCarousel />
                <button onClick={() => { triggerHaptic(); loyalty.savedName ? setStep('services') : setStep('identity'); }} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] shadow-lg flex justify-center items-center gap-2 text-[17px] mb-8">Agendar Sessão <ArrowRight className="w-5 h-5" /></button>
                {isAdmin && <div className="p-4 bg-red-900/20 border border-red-500 rounded-xl mb-6 text-center text-red-500 font-bold">Modo Admin Ativo: {loyalty.savedName}</div>}
              </div>
            )}

            {step === 'identity' && (
               <div className="animate-slide-up pt-10 space-y-6">
                  <h2 className="text-2xl font-bold">Quem é você?</h2>
                  <div className="ios-card p-4 rounded-2xl">
                     <label className="text-xs text-blue-500 font-bold uppercase mb-2 block">Seu Nome</label>
                     <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent text-xl font-bold border-b border-white/10 pb-2 focus:border-blue-500 outline-none"/>
                  </div>
                  <div className="space-y-3">
                    <button onClick={() => setUser({...user, isAdult: !user.isAdult})} className={`w-full p-4 rounded-xl border flex gap-3 ${user.isAdult ? 'bg-blue-500/10 border-blue-500' : 'bg-[#1C1C1E] border-transparent'}`}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${user.isAdult ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>{user.isAdult && <Check size={12}/>}</div>
                        <span>Maior de 18 anos</span>
                    </button>
                    <button onClick={() => setUser({...user, isMassagemOk: !user.isMassagemOk})} className={`w-full p-4 rounded-xl border flex gap-3 ${user.isMassagemOk ? 'bg-blue-500/10 border-blue-500' : 'bg-[#1C1C1E] border-transparent'}`}>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${user.isMassagemOk ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>{user.isMassagemOk && <Check size={12}/>}</div>
                        <span>Li e concordo com as regras</span>
                    </button>
                  </div>
                  <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => setStep('services')} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] disabled:opacity-50">Continuar</button>
               </div>
            )}

            {step === 'services' && (
                <div className="animate-fade-in pt-4 space-y-4">
                    <h2 className="text-2xl font-bold mb-4">Serviços</h2>
                    {services.map(s => (
                        <div key={s.id} onClick={() => { setSelection(prev => ({...prev, service: s})); setStep('config'); }} className="ios-card p-5 rounded-[24px] relative overflow-hidden active:scale-95 transition-transform">
                            {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl">{s.highlight}</div>}
                            <h3 className="text-xl font-bold mb-1">{s.name}</h3>
                            <div className="flex gap-2 text-sm text-gray-400 mb-3"><span>{formatCurrency(s.basePrice)}</span><span>•</span><span>{s.labelDuration}</span></div>
                            <p className="text-sm text-gray-300 mb-4">{s.description}</p>
                            <div className="flex flex-wrap gap-2">{s.details.slice(0,3).map((d,i)=><span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded-md">{d}</span>)}</div>
                        </div>
                    ))}
                </div>
            )}

            {step === 'config' && selection.service && (
               <div className="animate-slide-up pt-4 space-y-8">
                  {/* DATA */}
                  <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />

                  {/* LOCAL */}
                  <div ref={locationRef} className="space-y-3">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Local</h4>
                      {locations.map(l => (
                          <div key={l.id}>
                              <button onClick={() => { setSelection({...selection, location: l, useTable: null}); scrollTo(surfaceRef); }} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${selection.location?.id === l.id ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
                                  <div className="text-left"><span className="font-bold block">{l.label}</span><span className="text-xs">{l.sublabel}</span></div>
                                  {l.fee > 0 && <span className="text-xs font-bold text-yellow-500">+{formatCurrency(l.fee)}</span>}
                              </button>
                              {selection.location?.id === l.id && l.allowsTableChoice && (
                                  <div ref={surfaceRef} className="grid grid-cols-2 gap-3 mt-3 animate-fade-in">
                                      <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(extrasRef); }} className={`p-3 rounded-xl border text-sm font-bold ${selection.useTable===false ? 'bg-blue-600 border-blue-600' : 'bg-[#1C1C1E] border-white/10'}`}>🛏 Na Cama</button>
                                      <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(extrasRef); }} className={`p-3 rounded-xl border text-sm font-bold ${selection.useTable===true ? 'bg-blue-600 border-blue-600' : 'bg-[#1C1C1E] border-white/10'}`}>💆‍♂️ Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                                  </div>
                              )}
                              {selection.location?.id === l.id && l.input && <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Qual cidade?" className="w-full mt-2 bg-[#1C1C1E] p-3 rounded-xl border border-white/10"/>}
                          </div>
                      ))}
                  </div>

                  {/* EXTRAS */}
                  <div ref={extrasRef} className="space-y-3">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Extras</h4>
                      <button onClick={() => setSelection({...selection, upgrade: !selection.upgrade})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.upgrade ? 'bg-blue-500/10 border-blue-500' : 'bg-[#1C1C1E] border-transparent'}`}>
                          <div className="text-left"><span className="font-bold block">+30 Minutos</span><span className="text-xs text-gray-500">Sessão estendida</span></div>
                          <span className="text-blue-500 font-bold">+{formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                      </button>
                      <button onClick={() => setSelection({...selection, aroma: !selection.aroma})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.aroma ? 'bg-blue-500/10 border-blue-500' : 'bg-[#1C1C1E] border-transparent'}`}>
                          <div className="text-left"><span className="font-bold block">Aromaterapia</span><span className="text-xs text-gray-500">Óleos essenciais</span></div>
                          <span className="text-green-500 font-bold">VIP</span>
                      </button>
                  </div>

                  {/* CUPONS */}
                  <div className="space-y-3">
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Cupons</h4>
                      <div className="flex gap-2"><input value={manualCode} onChange={e => setManualCode(e.target.value)} placeholder="Código" className="flex-1 bg-[#1C1C1E] p-3 rounded-xl border border-white/10"/><button onClick={handleAddCoupon} className="bg-[#2C2C2E] px-4 rounded-xl font-bold">Adicionar</button></div>
                      {loyalty.inventory.map(code => {
                          const cp = SYSTEM_COUPONS[code]; if(!cp) return null;
                          const isSel = selection.coupon?.code === code;
                          return <button key={code} onClick={() => { isSel ? setSelection({...selection, coupon: null}) : setSelection({...selection, coupon: cp}); scrollTo(paymentRef); }} className={`w-full p-3 rounded-xl border flex justify-between ${isSel ? 'bg-blue-500/20 border-blue-500' : 'bg-[#1C1C1E] border-white/5'}`}><span>{code}</span><span>{cp.desc}</span></button>
                      })}
                  </div>

                  {/* PAGAMENTO */}
                  <div ref={paymentRef} className="space-y-3">
                     <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Pagamento</h4>
                     <div className="grid grid-cols-3 gap-2">
                        {['pix','cash','credit_card'].map(m => (
                            <button key={m} onClick={() => setSelection({...selection, paymentMethod: m})} className={`py-4 rounded-xl border flex flex-col items-center justify-center gap-1 ${selection.paymentMethod===m ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
                                {m==='pix'?<QrCode size={20}/>:m==='cash'?<Banknote size={20}/>:<CreditCard size={20}/>}
                                <span className="text-[10px] uppercase font-bold">{m==='credit_card'?'Cartão':m==='cash'?'Dinheiro':'Pix'}</span>
                            </button>
                        ))}
                     </div>
                     {selection.paymentMethod === 'credit_card' && (
                         <select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#1C1C1E] p-3 rounded-xl border border-white/10 text-white">
                             {CARD_RATES.map((r, i) => i > 0 && <option key={i} value={i}>{i}x de {formatCurrency(calcFinalPrice()/i)}</option>)}
                         </select>
                     )}
                  </div>

                  {canFinalize && <div ref={receiptRef}><OrderReceipt selection={selection} priceFunc={calcFinalPrice}/></div>}
               </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center justify-center pt-20 animate-fade-in text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-float"><Check className="w-12 h-12 text-white stroke-[3]"/></div>
                <h2 className="text-2xl font-bold text-white mb-2">Pedido Enviado!</h2>
                <p className="text-gray-400 text-sm mb-8 px-8">Verifique seu WhatsApp.</p>
                <div className="w-full space-y-3">
                  <a href={generateCalendarLink(selection.service.name, selection.date, selection.time)} target="_blank" className="w-full bg-[#1C1C1E] border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-300 hover:bg-[#2C2C2E]"><Calendar className="w-4 h-4 text-blue-500"/> Adicionar à Agenda</a>
                  <button onClick={() => setStep('home')} className="w-full py-3 text-sm text-gray-500 hover:text-white">Voltar ao Início</button>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER BUTTON */}
          {step === 'config' && selection.location && (
            <div className="absolute bottom-0 w-full p-5 bg-[#1C1C1E]/90 backdrop-blur-md border-t border-white/10 z-30">
              <button onClick={handlePreFinalize} className="w-full ios-btn-primary py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2">Confirmar no WhatsApp <ArrowRight className="w-5 h-5"/></button>
            </div>
          )}

          {/* UPSELL MODAL */}
          {showUpsell && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
              <div className="bg-[#1C1C1E] w-full max-w-sm rounded-3xl p-6 border border-yellow-500/30 shadow-2xl relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"/>
                <div className="flex justify-center mb-4"><Flame className="w-12 h-12 text-orange-500 fill-orange-500 animate-pulse"/></div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Oferta Especial!</h3>
                <p className="text-gray-400 text-center text-sm mb-6">Adicione <b>Aromaterapia</b> agora com desconto exclusivo?</p>
                <div className="space-y-3">
                  <button onClick={() => handleWhatsApp(true)} className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-black flex justify-center items-center gap-2"><Sparkles className="w-4 h-4"/> SIM, EU QUERO</button>
                  <button onClick={() => handleWhatsApp(false)} className="w-full py-3 text-gray-500 text-sm font-medium hover:text-white">Não, obrigado</button>
                </div>
              </div>
            </div>
          )}

          <InstallPrompt />
        </div>
      )}
    </div>
  );
}
