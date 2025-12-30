import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, Siren, Send, ThumbsUp, Car, Menu, Smartphone, Sparkles, Settings, MoreHorizontal
} from 'lucide-react';

// ==================================================================================
// 1. INFRAESTRUTURA & ESTILOS
// ==================================================================================

const SecureStorage = {
  SECRET: 'THALY_FINAL_ULTIMATE_V5_',
  encrypt: (data) => { try { return btoa(encodeURIComponent(JSON.stringify(data))); } catch (e) { return null; } },
  decrypt: (cipher) => { try { return JSON.parse(decodeURIComponent(atob(cipher))); } catch (e) { return null; } },
  set: (key, data) => { const cipher = SecureStorage.encrypt(data); if (cipher) localStorage.setItem(SecureStorage.SECRET + key, cipher); },
  get: (key) => {
    const cipher = localStorage.getItem(SecureStorage.SECRET + key);
    if (!cipher) { const old = localStorage.getItem('thaly_system_v22'); if(old) { try { return JSON.parse(old); } catch(e) { return null; } } return null; }
    return cipher ? SecureStorage.decrypt(cipher) : null;
  },
  clear: () => { localStorage.clear(); }
};

const generateBookingId = () => { const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let result = ''; for (let i = 0; i < 4; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); } return result; };
const generateCalendarLink = (serviceName, date, time) => { if (!date || !time) return ''; const [h, m] = time.split(':'); const s = new Date(date); s.setHours(parseInt(h), parseInt(m)); const e = new Date(s); e.setHours(s.getHours() + 1); const fmt = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, ""); return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(serviceName)}&dates=${fmt(s)}/${fmt(e)}&details=${encodeURIComponent("Sessão confirmada.")}&location=${encodeURIComponent("Santa Fé do Sul")}`; };

const globalStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { overscroll-behavior-y: none; touch-action: manipulation; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif; color: #fff; background: #000; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.aurora-bg { background: radial-gradient(140% 100% at 50% 0%, rgba(20, 20, 22, 1), #000000 60%), radial-gradient(100% 100% at 50% 100%, rgba(10, 132, 255, 0.04), transparent 50%); background-attachment: fixed; background-size: cover; min-height: 100vh; }
.ios-card { background: rgba(28, 28, 30, 0.55); backdrop-filter: blur(50px); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4); transition: transform 0.2s ease; }
.ios-card:active { transform: scale(0.99); }
.ios-btn-primary { background: #007AFF; color: white; box-shadow: 0 8px 20px rgba(0, 122, 255, 0.3); border: none; }
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }
.ios-btn-primary:disabled { filter: grayscale(1); opacity: 0.5; }
.custom-input { background: rgba(28, 28, 30, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white; transition: all 0.3s ease; }
.custom-input:focus { border-color: #0A84FF; box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2); }
.flip-container { perspective: 1000px; }
.flip-card { position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; }
.flip-card.flipped { transform: rotateY(180deg); }
.flip-front, .flip-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; border-radius: 28px; overflow: hidden; }
.flip-back { transform: rotateY(180deg); background: #1C1C1E; border: 1px solid rgba(255,255,255,0.1); }
.toast-container { position: fixed; top: 10px; left: 0; right: 0; z-index: 9999; display: flex; flex-col; align-items: center; gap: 8px; pointer-events: none; }
.toast { pointer-events: auto; background: rgba(30,30,30,0.95); backdrop-filter: blur(12px); color: white; padding: 12px 20px; border-radius: 50px; font-size: 13px; font-weight: 600; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; items-center; gap: 8px; border: 1px solid rgba(255,255,255,0.1); animation: slideDown 0.3s ease; }
.toast.error { border-left: 4px solid #FF3B30; } .toast.success { border-left: 4px solid #32D74B; } .toast.info { border-left: 4px solid #0A84FF; }
@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.6s ease forwards; } .animate-slide-up { animation: slideUp 0.6s ease forwards; } .animate-pulse-slow { animation: pulse 3s infinite; } .animate-spin-slow { animation: spin 1.5s linear infinite; } .animate-float { animation: float 3s ease-in-out infinite; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
`;

const IconBack = () => <ChevronLeft className="w-6 h-6 text-[#0A84FF]" />;

// ==================================================================================
// 2. DADOS
// ==================================================================================

const CONFIG = { PRICES: { MACA: 20, AROMA_FULL: 10, AROMA_DISCOUNT: 5, UPGRADE_PCT: 0.5 } };
const services = [
  { id: 'masculina', name: 'Massagem Masculina', type: 'sensual', description: 'Massagem Relaxante + Toques corpo a corpo (de cueca) com finalização Lingam manual completa.', labelDuration: '60 min', basePrice: 140, highlight: "MAIS PEDIDA 🔥", details: ["Relaxante + Body-to-Body", "Massagista de Cueca", "Lingam / Finalização Manual", "Alívio Completo"] },
  { id: 'relaxante', name: 'Massagem Relaxante', type: 'relax', description: 'Corpo inteiro: Costas, braços, mãos, pernas, coxas, pés, peito e frente. (Sem toques íntimos).', labelDuration: '60 min', basePrice: 90, details: ["Corpo Inteiro", "Sem Glúteos/Íntimo", "Toque Terapêutico", "Relaxamento Puro"] },
];
const locations = [
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Vou com você', fee: 75, allowsTableChoice: false, isMotel: true },
  { id: 'santa-fe', label: 'Santa Fé do Sul', sublabel: 'No conforto do seu lar', fee: 40, allowsTableChoice: true, isUber: true, requiresAddress: true },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', sublabel: 'Atendimento na região', fee: 0, allowsTableChoice: false, input: true, isPending: true },
];
const SYSTEM_COUPONS = { 'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (1ª Vez)' }, 'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF Especial' }, 'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' }, 'NIVELPRATA': { code: 'NIVELPRATA', type: 'fixed', value: 15, desc: 'R$ 15,00 OFF (Prata)' }, 'NIVELOURO': { code: 'NIVELOURO', type: 'fixed', value: 25, desc: 'R$ 25,00 OFF (Ouro)' }, 'NIVELDIAMANTE': { code: 'NIVELDIAMANTE', type: 'fixed', value: 50, desc: 'R$ 50,00 OFF (Diamante)' } };
const LEVELS = [{ name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', perks: ["Acesso VIP", "Agendamento"] }, { name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', perks: ["Cupom R$ 15", "Aroma 50% OFF"] }, { name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', perks: ["Cupom R$ 25", "Aroma GRÁTIS"] }, { name: 'Diamante', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: ["Cupom R$ 50", "Prioridade Total"] }];
const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const musicVibes = ['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘', 'Lofi HipHop ☕']; 
const REVIEWS_DB = [{ t: "Sou casado, o sigilo foi total. A massagem tântrica me surpreendeu.", a: "Sigiloso (44 anos)", r: 5 }, { t: "Nunca tinha feito tântrica. Sensibilidade absurda.", a: "R.S. (Santa Fé)", r: 5 }, { t: "Mão leve e firme. A manipulação no lingam me levou às alturas.", a: "Anônimo", r: 5 }, { t: "Profissionalismo puro. Massagem relaxante de verdade.", a: "D.S.", r: 5 }, { t: "Discrição garantida. O lugar é perfeito.", a: "Empresário", r: 5 }, { t: "Gozei tanto que fiquei sem pernas. Vergonha rs, mas foi muito bom.", a: "Safado", r: 5 }];
const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(5); };

// ==================================================================================
// 3. COMPONENTES VISUAIS
// ==================================================================================

const InstallPrompt = () => {
  const [show, setShow] = useState(false);
  useEffect(() => { const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); const isStandalone = window.matchMedia('(display-mode: standalone)').matches; if (isMobile && !isStandalone) setTimeout(() => setShow(true), 3000); }, []);
  if (!show) return null;
  return ( <div className="fixed bottom-6 left-6 right-6 z-50 animate-slide-up"><div className="bg-[#1C1C1E] p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#0A84FF] rounded-lg flex items-center justify-center"><Smartphone className="text-white w-6 h-6"/></div><div><p className="text-white font-bold text-sm">Instalar App</p><p className="text-gray-400 text-xs">Acesso rápido e offline</p></div></div><button onClick={() => setShow(false)} className="p-2 bg-white/10 rounded-full"><X className="w-4 h-4"/></button></div></div> );
};

const LoyaltyFlipCard = ({ data, privacyMode, onTogglePrivacy }) => {
  const [flipped, setFlipped] = useState(false);
  const safeSpent = data.totalSpent || 0;
  const currentLevel = [...LEVELS].reverse().find(l => safeSpent >= l.min) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const progress = nextLevel ? Math.min(100, Math.max(0, ((safeSpent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)) : 100;
  return (
    <div className="flip-container h-48 mb-6" onClick={() => { triggerHaptic(); setFlipped(!flipped); }}>
      <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
        <div className="flip-front ios-card p-5 relative bg-gradient-to-br from-[#1C1C1E] to-[#000]">
          <div className="absolute top-0 right-0 p-4 opacity-50"><MoreHorizontal className="w-5 h-5 text-gray-400"/></div>
          <div className="flex flex-col h-full justify-between"><div className='text-left'><p className="text-[10px] uppercase tracking-widest text-[#0A84FF] font-bold mb-1">Thalyson Rewards</p><h3 className="text-2xl font-bold text-white flex items-center gap-2">{currentLevel.name} {currentLevel.icon}</h3></div><div><div className="flex justify-between items-end mb-2"><span className="text-xs text-gray-400">{privacyMode ? '••••' : formatCurrency(safeSpent)} investidos</span><span className="text-xs font-bold text-[#32D74B]">{progress.toFixed(0)}%</span></div><div className="h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#32D74B] transition-all duration-1000" style={{ width: `${progress}%` }}/></div><div className="flex justify-between text-[9px] text-gray-500 font-medium tracking-wide mt-2"><span>Benefício: <span className="text-[#32D74B]">{currentLevel.perks[1]}</span></span>{nextLevel ? (<span>Faltam {formatCurrency(nextLevel.min - safeSpent)}</span>) : (<span className="text-[#FFD60A]">Nível Máximo</span>)}</div></div></div>
        </div>
        <div className="flip-back flex flex-col items-center justify-center p-5 relative bg-[#111]"><div className="absolute top-4 left-4 text-[10px] text-gray-500 uppercase font-bold">Seu ID de Membro</div><div className="bg-white p-2 rounded-xl"><QrCode className="w-24 h-24 text-black"/></div><p className="text-gray-400 text-xs mt-3 font-mono tracking-widest">MEMBER-{data.savedName ? data.savedName.slice(0,3).toUpperCase() : 'GUEST'}</p></div>
      </div>
    </div>
  );
};

const SmartDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const days = []; const now = new Date();
  for (let i = 0; i < 16; i++) { const d = new Date(now); d.setDate(now.getDate() + i); days.push(d); }
  const checkAvailability = (date, timeStr) => {
      if(!date) return true;
      const slotDate = new Date(date);
      const [h, m] = timeStr.split(':').map(Number);
      slotDate.setHours(h, m, 0, 0);
      const nowTime = new Date();
      if (slotDate < nowTime) return true; 
      const diffMs = slotDate - nowTime;
      const diffMins = diffMs / 1000 / 60; 
      return diffMins < 40; // Bloqueia se faltar menos de 40 min
  };
  return (
    <div className="w-full select-none">
      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Data & Horário</h4>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate() && selectedDate?.getMonth() === d.getMonth();
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} className={`flex flex-col items-center justify-center min-w-[72px] h-[84px] rounded-[20px] border transition-all duration-300 ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-white/5 text-gray-400 hover:bg-[#2C2C2E]'}`}><span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span><span className="text-2xl font-bold tracking-tighter">{d.getDate()}</span></button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="animate-slide-up mt-2">
           <div className="grid grid-cols-4 gap-3">
               {timeSlots.map(t => {
                   const isBlocked = checkAvailability(selectedDate, t);
                   return ( <button key={t} disabled={isBlocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} className={`py-3 rounded-[14px] text-[13px] font-bold transition-all duration-200 ${selectedTime === t ? 'bg-white text-black shadow-lg scale-105' : isBlocked ? 'bg-white/5 text-gray-600 opacity-40 cursor-not-allowed' : 'bg-[#2C2C2E] text-gray-300 border border-white/5 hover:bg-[#3A3A3C]'}`}>{t}</button> )
               })}
           </div>
           <div className="mt-4 flex items-center gap-2 text-gray-500 text-[11px] bg-[#1C1C1E] p-3 rounded-xl border border-white/5"><Clock className="w-3.5 h-3.5"/><span>Mínimo 40 min de antecedência.</span></div>
        </div>
      )}
    </div>
  );
};

const CouponInventory = ({ inventory, appliedCoupon, onApply, onRemove, onAddManual, addToast }) => {
  const [manualCode, setManualCode] = useState('');
  const myCoupons = inventory.map((c) => SYSTEM_COUPONS[c]).filter(Boolean);
  const handleManualAdd = () => {
      const codeUpper = manualCode.toUpperCase().trim();
      if(codeUpper && SYSTEM_COUPONS[codeUpper]) {
          if(!inventory.includes(codeUpper)) { onAddManual(codeUpper); setManualCode(''); triggerHaptic(); addToast('Cupom adicionado!', 'success'); } 
          else addToast('Você já tem este cupom.', 'info');
      } else addToast('Cupom inválido.', 'error');
  };
  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center ml-1 mb-2"><h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Cupons</h4></div>
      <div className="flex gap-2 mb-3"><input value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Possui um código?" className="w-full custom-input p-3.5 rounded-[14px]"/><button onClick={handleManualAdd} className="bg-[#2C2C2E] border border-white/10 text-white px-5 rounded-[14px] font-bold text-[13px] hover:bg-[#3A3A3C] transition-colors">Adicionar</button></div>
      {myCoupons.length > 0 && <div className="space-y-3">{myCoupons.map(c => (<button key={c.code} onClick={() => {triggerHaptic(); appliedCoupon?.code===c.code ? onRemove() : onApply(c.code)}} className={`w-full p-4 rounded-[16px] flex justify-between ${appliedCoupon?.code===c.code ? 'bg-[#0A84FF]/20 border-blue-500' : 'bg-[#1C1C1E] border-white/5'}`}><span>{c.code}</span>{appliedCoupon?.code===c.code ? <X size={16}/> : <div className="w-4 h-4 rounded-full border"/>}</button>))}</div>}
    </div>
  );
};

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
    </div>
  )
};

// ==================================================================================
// 5. APP PRINCIPAL (LÓGICA FINAL)
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showUpsell, setShowUpsell] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const locationRef = useRef(null); const vibeRef = useRef(null); const extrasRef = useRef(null); const paymentRef = useRef(null); const homeRef = useRef(null); const receiptRef = useRef(null); const surfaceRef = useRef(null);
  const scrollTo = (ref) => setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);

  const [loyalty, setLoyalty] = useState(() => SecureStorage.get('DATA') || { savedName: '', avatar: '😎', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], history: [] });
  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ 
      service: null, location: null, date: null, time: '', useTable: null, city: '', 
      address: { street: '', number: '', district: '', ref: '' },
      coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 
  });
  const [privacyMode, setPrivacyMode] = useState(true);

  useEffect(() => { document.title = "Massagens Relaxantes"; setTimeout(() => setLoading(false), 2000); }, []);
  useEffect(() => { SecureStorage.set('DATA', loyalty); if (loyalty.savedName) { setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true})); } }, [loyalty]);
  useEffect(() => { if (selection.location?.allowsTableChoice && step === 'configure') { setTimeout(() => surfaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); } }, [selection.location, step]);
  useEffect(() => { if (step === 'home') { homeRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); } }, [step]);

  const addToast = (msg, type = 'info') => { const id = Date.now(); setToasts(prev => [...prev, { id, msg, type }]); setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000); };
  const handleQuickSchedule = () => { triggerHaptic(); loyalty.savedName ? setStep('services') : setStep('identity'); };
  const handleAddManualCoupon = (code) => { if (!loyalty.inventory.includes(code)) { setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]})); }};
  const handleReset = () => { setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', address: { street: '', number: '', district: '', ref: '' }, coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 }); setStep('home'); };
  const handleLogoClick = () => { setAdminClicks(c => c + 1); if(adminClicks + 1 === 5) { setIsAdmin(true); addToast("Modo Admin Ativado", "success"); setAdminClicks(0); } };

  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.useTable) total += CONFIG.PRICES.MACA;
    const level = [...LEVELS].reverse().find(l => (loyalty.totalSpent||0) >= l.min) || LEVELS[0];
    let aromaPrice = (level.name === 'Ouro' || level.name === 'Diamante') ? 0 : (level.name === 'Prata' ? CONFIG.PRICES.AROMA_DISCOUNT : CONFIG.PRICES.AROMA_FULL);
    if (selection.aroma) total += aromaPrice;
    if (selection.location?.fee) total += selection.location.fee;
    if (selection.coupon) {
      let discountable = total - (selection.location?.fee || 0); 
      let discount = selection.coupon.type === 'percent' ? (discountable * selection.coupon.value / 100) : selection.coupon.value;
      total -= discount;
    }
    return Math.max(0, total);
  }

  const calcFinalPrice = () => {
    let base = calcBaseTotal();
    if (selection.paymentMethod === 'credit_card') { const rate = CARD_RATES[selection.installments] || 0; return base / (1 - rate); }
    return base;
  };

  const canFinalize = selection.service && selection.location && selection.date && selection.time && selection.music && selection.paymentMethod && 
                      (selection.location.allowsTableChoice ? selection.useTable !== null : true) && 
                      (selection.location.id === 'outras-cidades' ? !!selection.city : true) &&
                      (selection.location.requiresAddress ? (selection.address.street && selection.address.number && selection.address.district) : true);

  const handlePreFinalize = () => {
    if (!canFinalize) { addToast("Preencha todos os campos obrigatórios!", "error"); return; }
    if (selection.coupon && !loyalty.inventory.includes(selection.coupon.code)) { addToast("Cupom inválido.", "error"); setSelection(prev => ({ ...prev, coupon: null })); return; }
    if (!selection.upgrade && !selection.aroma) { setShowUpsell(true); } else { handleWhatsApp(); }
  };

  const handleWhatsApp = (acceptedUpsell = false) => {
    triggerHaptic();
    let sel = { ...selection };
    if (acceptedUpsell) { sel.aroma = true; setSelection(sel); }

    const priceBase = sel.service.basePrice;
    let extrasTxt = "";
    if (sel.upgrade) extrasTxt += "\n➕ +30 Min"; 
    if (sel.useTable) extrasTxt += "\n➕ Maca Portátil"; 
    const level = [...LEVELS].reverse().find(l => (loyalty.totalSpent||0) >= l.min) || LEVELS[0];
    let aromaPrice = (level.name === 'Ouro' || level.name === 'Diamante') ? 0 : (level.name === 'Prata' ? CONFIG.PRICES.AROMA_DISCOUNT : CONFIG.PRICES.AROMA_FULL);
    if (sel.aroma) extrasTxt += `\n➕ Aromaterapia (${aromaPrice === 0 ? 'GRÁTIS' : formatCurrency(aromaPrice)})`;

    let fee = sel.location.fee || 0;
    let discount = 0;
    if (sel.coupon) {
        let baseD = priceBase + (sel.upgrade ? priceBase * CONFIG.PRICES.UPGRADE_PCT : 0) + (sel.useTable ? CONFIG.PRICES.MACA : 0) + (sel.aroma ? aromaPrice : 0);
        discount = sel.coupon.type === 'percent' ? (baseD * sel.coupon.value / 100) : sel.coupon.value;
    }

    const finalVal = calcFinalPrice(); 
    setLoyalty(prev => ({...prev, totalSpent: (loyalty.totalSpent || 0) + priceBase, savedName: user.name }));

    let addressTxt = "";
    if(sel.location.requiresAddress) { addressTxt = `\n📍 *ENDEREÇO:*\n${sel.address.street}, ${sel.address.number}\n${sel.address.district}\nRef: ${sel.address.ref}`; } 
    else if(sel.city) { addressTxt = `\n📍 Cidade: ${sel.city}`; }

    const msg = `*NOVO PEDIDO #${generateBookingId()}*
👤 ${user.name}
📅 ${sel.date.toLocaleDateString()} às ${sel.time}
💆 ${sel.service.name} ${sel.upgrade ? '(+UPGRADE)' : ''}
📍 ${sel.location.label}${addressTxt}

*RESUMO:*
Base: ${formatCurrency(priceBase)}${extrasTxt}
Taxa: ${formatCurrency(fee)}
Desconto: -${formatCurrency(discount)}

*TOTAL: ${formatCurrency(finalVal)}*
Pagamento: ${sel.paymentMethod}
🎵 Vibe: ${sel.music}`;

    window.open(`https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success'); setShowUpsell(false);
  };

  return (
    <div className="min-h-screen flex justify-center bg-black text-gray-200 font-sans" onClick={()=>{if(showMenu)setShowMenu(false)}}>
      <style>{globalStyles}</style>
      <div className="toast-container">{toasts.map(t => (<div key={t.id} className={`toast ${t.type}`}>{t.type === 'error' ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>} {t.msg}</div>))}</div>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in"><div className="relative w-16 h-16 mb-8"><div className="absolute inset-0 rounded-full border-4 border-[#0A84FF]/20"></div><div className="absolute inset-0 rounded-full border-4 border-t-[#0A84FF] animate-spin-slow"></div></div><span className="text-[11px] font-bold tracking-[0.3em] text-[#0A84FF] animate-pulse uppercase">Carregando</span></div>
      ) : (
        <div className="w-full max-w-[440px] bg-[#000] sm:my-4 sm:rounded-[40px] sm:border border-white/10 shadow-2xl relative overflow-hidden h-screen sm:h-[90vh] flex flex-col aurora-bg">
          <div className="relative z-20 px-6 pt-10 pb-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
             {step !== 'home' && step !== 'success' ? ( <button onClick={() => setStep(step === 'config' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full bg-white/5 backdrop-blur-md"><IconBack/></button> ) : ( <div onClick={handleLogoClick} className="cursor-pointer"><p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Bem-vindo</p><h1 className="text-xl font-bold text-white">Massagens Relaxantes</h1></div> )}
             <div className="flex gap-3"><button onClick={() => setShowNotifications(true)} className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-white/10 relative"><Bell className="w-5 h-5 text-gray-400"/>{loyalty.notifications.some(n=>!n.read)&&<div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"/>}</button><button onClick={() => setShowMenu(!showMenu)} className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-white/10"><Menu className="w-5 h-5 text-gray-400"/></button></div>
          </div>
          
          {showMenu && ( <div className="absolute top-20 right-6 w-48 bg-[#1C1C1E] border border-white/10 rounded-2xl z-50 animate-slide-up overflow-hidden shadow-2xl"><button onClick={() => setShowFaq(true)} className="w-full p-4 text-left text-sm hover:bg-white/5 flex items-center gap-2"><HelpCircle size={16}/> Ajuda</button><button onClick={() => { SecureStorage.clear(); window.location.reload(); }} className="w-full p-4 text-left text-red-500 text-sm hover:bg-white/5 flex items-center gap-2"><LogOut size={16}/> Sair</button></div> )}

          <div className="flex-1 overflow-y-auto px-6 pb-32 relative z-10 scrollbar-hide">
            {step === 'home' && ( <div className="animate-fade-in pt-4"><LoyaltyFlipCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} /><LiveStatus /><ReviewsCarousel /><button onClick={() => { triggerHaptic(); loyalty.savedName ? setStep('services') : setStep('identity'); }} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] shadow-lg flex justify-center items-center gap-2 text-[17px] mb-8">Agendar Sessão <ArrowRight className="w-5 h-5" /></button>{isAdmin && <div className="p-4 bg-red-900/20 border border-red-500 rounded-xl mb-6 text-center text-red-500 font-bold">Modo Admin Ativo</div>}</div> )}

            {step === 'identity' && (
               <div className="animate-slide-up pt-10 space-y-6"><h2 className="text-2xl font-bold">Quem é você?</h2>
                  <div className="ios-card p-4 rounded-2xl"><label className="text-xs text-blue-500 font-bold uppercase mb-2 block">Seu Nome</label><input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent text-xl font-bold border-b border-white/10 pb-2 focus:border-blue-500 outline-none"/></div>
                  <div className="space-y-3"><button onClick={() => setUser({...user, isAdult: !user.isAdult})} className={`w-full p-4 rounded-xl border flex gap-3 ${user.isAdult ? 'bg-blue-500/10 border-blue-500' : 'bg-[#1C1C1E] border-transparent'}`}><div className={`w-5 h-5 rounded-full border flex items-center justify-center ${user.isAdult ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>{user.isAdult && <Check size={12}/>}</div><span>Maior de 18 anos</span></button><button onClick={() => setUser({...user, isMassagemOk: !user.isMassagemOk})} className={`w-full p-4 rounded-xl border flex gap-3 ${user.isMassagemOk ? 'bg-blue-500/10 border-blue-500' : 'bg-[#1C1C1E] border-transparent'}`}><div className={`w-5 h-5 rounded-full border flex items-center justify-center ${user.isMassagemOk ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>{user.isMassagemOk && <Check size={12}/>}</div><span>Li e concordo com as regras</span></button></div>
                  <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => setStep('services')} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] disabled:opacity-50">Continuar</button>
               </div>
            )}

            {step === 'services' && (
                <div className="animate-fade-in pt-4 space-y-4"><h2 className="text-2xl font-bold mb-4">Serviços</h2>
                    {services.map(s => (
                        <div key={s.id} onClick={() => { setSelection(prev => ({...prev, service: s})); setStep('config'); }} className="ios-card p-5 rounded-[24px] relative overflow-hidden active:scale-95 transition-transform">
                            {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl">{s.highlight}</div>}
                            <h3 className="text-xl font-bold mb-1">{s.name}</h3><div className="flex gap-2 text-sm text-gray-400 mb-3"><span>{formatCurrency(s.basePrice)}</span><span>•</span><span>{s.labelDuration}</span></div><p className="text-sm text-gray-300 mb-4">{s.description}</p>
                            <div className="flex flex-wrap gap-2">{s.details.slice(0,3).map((d,i)=><span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded-md">{d}</span>)}</div>
                        </div>
                    ))}
                </div>
            )}

            {step === 'config' && selection.service && (
               <div className="animate-slide-up pt-4 space-y-8">
                  <SmartDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />
                  <div ref={locationRef} className="space-y-3"><h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Local</h4>
                      {locations.map(l => (
                          <div key={l.id}>
                              <button onClick={() => { setSelection({...selection, location: l, useTable: null}); scrollTo(surfaceRef); }} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${selection.location?.id === l.id ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}><div className="text-left"><span className="font-bold block">{l.label}</span><span className="text-xs">{l.sublabel}</span></div>{l.fee > 0 && <span className="text-xs font-bold text-yellow-500">+{formatCurrency(l.fee)}</span>}</button>
                              {selection.location?.id === l.id && l.requiresAddress && (
                                  <div className="mt-3 animate-fade-in p-4 bg-[#2C2C2E] rounded-xl border border-white/5 space-y-3"><h5 className="text-[10px] font-bold uppercase text-blue-400 flex items-center gap-1"><MapPin size={10}/> Endereço Obrigatório</h5><input value={selection.address.street} onChange={e => setSelection(p => ({...p, address: {...p.address, street: e.target.value}}))} placeholder="Rua" className="w-full custom-input p-3 rounded-lg text-sm"/><div className="flex gap-2"><input value={selection.address.number} onChange={e => setSelection(p => ({...p, address: {...p.address, number: e.target.value}}))} placeholder="Número" className="w-1/3 custom-input p-3 rounded-lg text-sm"/><input value={selection.address.district} onChange={e => setSelection(p => ({...p, address: {...p.address, district: e.target.value}}))} placeholder="Bairro" className="w-2/3 custom-input p-3 rounded-lg text-sm"/></div><input value={selection.address.ref} onChange={e => setSelection(p => ({...p, address: {...p.address, ref: e.target.value}}))} placeholder="Ponto de Referência" className="w-full custom-input p-3 rounded-lg text-sm"/></div>
                              )}
                              {selection.location?.id === l.id && l.allowsTableChoice && ( <div ref={surfaceRef} className="grid grid-cols-2 gap-3 mt-3 animate-fade-in"><button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(extrasRef); }} className={`p-3 rounded-xl border text-sm font-bold ${selection.useTable===false ? 'bg-blue-600 border-blue-600' : 'bg-[#1C1C1E] border-white/10'}`}>🛏 Na Cama</button><button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(extrasRef); }} className={`p-3 rounded-xl border text-sm font-bold ${selection.useTable===true ? 'bg-blue-600 border-blue-600' : 'bg-[#1C1C1E] border-white/10'}`}>💆‍♂️ Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button></div> )}
                              {selection.location?.id === l.id && l.input && <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Qual cidade?" className="w-full mt-2 bg-[#1C1C1E] p-3 rounded-xl border border-white/10"/>}
                          </div>
                      ))}
                  </div>
                  <div ref={vibeRef}><h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Vibe Sonora</h4><div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">{musicVibes.map(v => (<button key={v} onClick={() => { setSelection({...selection, music: v}); scrollTo(extrasRef); }} className={`px-5 py-2 rounded-xl border text-xs font-bold whitespace-nowrap ${selection.music === v ? 'bg-white text-black' : 'bg-[#1C1C1E] border-white/10'}`}>{v}</button>))}</div></div>
                  <div ref={extrasRef} className="space-y-3"><h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Extras</h4><button onClick={() => setSelection({...selection, upgrade: !selection.upgrade})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.upgrade ? 'bg-blue-500/10 border-blue-500' : 'bg-[#1C1C1E] border-transparent'}`}><div className="text-left"><span className="font-bold block">+30 Minutos</span><span className="text-xs text-gray-500">Sessão estendida</span></div><span className="text-blue-500 font-bold">+{formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span></button><button onClick={() => setSelection({...selection, aroma: !selection.aroma})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.aroma ? 'bg-blue-500/10 border-blue-500' : 'bg-[#1C1C1E] border-transparent'}`}><div className="text-left"><span className="font-bold block">Aromaterapia</span><span className="text-xs text-gray-500">Óleos essenciais</span></div><span className="text-green-500 font-bold">VIP</span></button></div>
                  <div className="space-y-3"><CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(code) => { setSelection({...selection, coupon: SYSTEM_COUPONS[code]}); scrollTo(paymentRef); }} onRemove={() => setSelection({...selection, coupon: null})} onAddManual={handleAddManualCoupon} addToast={addToast}/></div>
                  <div ref={paymentRef} className="space-y-3"><h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Pagamento</h4><div className="grid grid-cols-3 gap-2">{['pix','cash','credit_card'].map(m => (<button key={m} onClick={() => setSelection({...selection, paymentMethod: m})} className={`py-4 rounded-xl border flex flex-col items-center justify-center gap-1 ${selection.paymentMethod===m ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>{m==='pix'?<QrCode size={20}/>:m==='cash'?<Banknote size={20}/>:<CreditCard size={20}/>}<span className="text-[10px] uppercase font-bold">{m==='credit_card'?'Cartão':m==='cash'?'Dinheiro':'Pix'}</span></button>))}</div>{selection.paymentMethod === 'credit_card' && (<select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#1C1C1E] p-3 rounded-xl border border-white/10 text-white">{CARD_RATES.map((r, i) => i > 0 && <option key={i} value={i}>{i}x de {formatCurrency(calcFinalPrice()/i)}</option>)}</select>)}</div>
                  {canFinalize && <div ref={receiptRef}><OrderReceipt selection={selection} priceFunc={calcFinalPrice}/></div>}
               </div>
            )}

            {step === 'success' && ( <div className="flex flex-col items-center justify-center pt-20 animate-fade-in text-center"><div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-float"><Check className="w-12 h-12 text-white stroke-[3]"/></div><h2 className="text-2xl font-bold text-white mb-2">Pedido Enviado!</h2><p className="text-gray-400 text-sm mb-8 px-8">Verifique seu WhatsApp.</p><div className="w-full space-y-3"><a href={generateCalendarLink(selection.service.name, selection.date, selection.time)} target="_blank" className="w-full bg-[#1C1C1E] border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-300 hover:bg-[#2C2C2E]"><Calendar className="w-4 h-4 text-blue-500"/> Adicionar à Agenda</a><button onClick={() => setStep('home')} className="w-full py-3 text-sm text-gray-500 hover:text-white">Voltar ao Início</button></div></div> )}
          </div>

          {step === 'config' && selection.location && ( <div className="absolute bottom-0 w-full p-5 bg-[#1C1C1E]/90 backdrop-blur-md border-t border-white/10 z-30"><button onClick={handlePreFinalize} className="w-full ios-btn-primary py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2">Confirmar no WhatsApp <ArrowRight className="w-5 h-5"/></button></div> )}

          {showUpsell && ( <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in"><div className="bg-[#1C1C1E] w-full max-w-sm rounded-3xl p-6 border border-yellow-500/30 shadow-2xl relative overflow-hidden animate-slide-up"><div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"/><div className="flex justify-center mb-4"><Flame className="w-12 h-12 text-orange-500 fill-orange-500 animate-pulse"/></div><h3 className="text-xl font-bold text-white text-center mb-2">Oferta Especial!</h3><p className="text-gray-400 text-center text-sm mb-6">Adicione <b>Aromaterapia</b> agora com desconto exclusivo?</p><div className="space-y-3"><button onClick={() => handleWhatsApp(true)} className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-black flex justify-center items-center gap-2"><Sparkles className="w-4 h-4"/> SIM, EU QUERO</button><button onClick={() => handleWhatsApp(false)} className="w-full py-3 text-gray-500 text-sm font-medium hover:text-white">Não, obrigado</button></div></div></div> )}
          {showFaq && ( <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-5"><div className="bg-[#1C1C1E] w-full max-w-sm rounded-[32px] p-8 border border-white/10 shadow-2xl animate-scale"><h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-[#0A84FF]"/> Ajuda & Informações</h3><div className="space-y-5 text-[15px] text-gray-300 leading-relaxed"><div><h4 className="font-bold text-white mb-1 flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400"/> Conduta</h4><p className="text-sm">Apenas massagem terapêutica e relaxante. Sem sexo, sem oral. Respeito acima de tudo.</p></div><div className="pt-6 border-t border-white/10"><p className="text-xs text-gray-500 mb-3">⚠️Atenção: Limpar dados apagará seu progresso e nível.</p><button onClick={() => { if(window.confirm("Tem certeza?")) { SecureStorage.clear(); window.location.reload(); }}} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4"/> Limpar Dados do App</button></div></div><button onClick={() => setShowFaq(false)} className="mt-6 w-full bg-[#3A3A3C] text-white py-4 rounded-[18px] font-bold hover:bg-[#4A4A4C] transition-colors">Fechar</button></div></div> )}
          {showNotifications && ( <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-5" onClick={() => setShowNotifications(false)}><div className="bg-[#1C1C1E] w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 border-t sm:border border-white/10 shadow-2xl animate-slide-up h-[75vh] sm:h-[600px] flex flex-col" onClick={e => e.stopPropagation()}><div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold text-white flex items-center gap-2">Notificações</h3><button onClick={() => { setLoyalty(p => ({...p, notifications: p.notifications.map(n => ({...n, read: true}))})); setShowNotifications(false); }} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button></div><div className="space-y-3 overflow-y-auto flex-1 scrollbar-hide">{loyalty.notifications.length === 0 ? (<div className="flex flex-col items-center justify-center h-full text-gray-500"><Bell className="w-12 h-12 mb-4 opacity-20"/><p>Nenhuma notificação recente.</p></div>) : (loyalty.notifications.map(n => (<div key={n.id} className="p-4 rounded-[20px] bg-[#2C2C2E] border border-white/5 flex items-start gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.icon === 'level' ? 'bg-[#FFD60A]/20 text-[#FFD60A]' : n.icon === 'coupon' ? 'bg-[#FF375F]/20 text-[#FF375F]' : 'bg-[#0A84FF]/20 text-[#0A84FF]'}`}>{n.icon === 'calendar' ? <Calendar className="w-5 h-5"/> : n.icon === 'level' ? <Crown className="w-5 h-5"/> : n.icon === 'coupon' ? <Tag className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}</div><div className="flex-1"><div className="flex justify-between items-start"><h4 className="font-bold text-white text-[15px] mb-1">{n.title}</h4>{!n.read && <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>}</div><p className="text-[13px] text-gray-400 leading-snug">{n.message}</p><span className="text-[10px] text-gray-600 mt-2 block">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div></div>)))}</div></div></div> )}
          <InstallPrompt />
        </div>
      )}
    </div>
  );
}
