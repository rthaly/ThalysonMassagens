import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Shield, Flame, Star, Instagram, Bell, Tag, ArrowRight, Lock, Eye, Share2, 
  Copy, Zap, Music, Trash2, CreditCard, Banknote, QrCode, Edit3, Info, Receipt, 
  FileSpreadsheet, ShieldCheck, User, Siren, CheckCircle2, Battery, ThumbsUp
} from 'lucide-react';

// --- ESTILOS GLOBAIS (IOS 2026 DARK PLATINUM) ---
const globalStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Roboto", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.01em;
  color: #fff;
  background: #050505;
}
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
input, select { user-select: text; font-size: 18px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; -webkit-touch-callout: none; }

/* Fundo Premium Sóbrio */
.aurora-bg {
  background: 
    radial-gradient(100% 100% at 50% 0%, rgba(20, 20, 30, 1), transparent 70%),
    radial-gradient(100% 100% at 50% 100%, rgba(10, 80, 255, 0.08), transparent 80%),
    #000000;
  background-attachment: fixed;
  background-size: cover;
}

/* Cards com Leitura Fácil e Contraste Alto */
.ios-card { 
  background: rgba(30, 30, 35, 0.95); 
  border: 1px solid rgba(255, 255, 255, 0.12); 
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
}

.ios-header { 
  background: rgba(10, 10, 10, 0.98); 
  border-bottom: 1px solid rgba(255,255,255,0.1); 
  backdrop-filter: blur(20px);
}

/* Botões Robustos (Área de toque maior para homens) */
.ios-btn { 
  background: rgba(255, 255, 255, 0.08); 
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.1s; 
}
.ios-btn:active { transform: scale(0.97); background: rgba(255, 255, 255, 0.15); }

.ios-btn-primary {
  background: #0A84FF;
  color: white;
  box-shadow: 0 4px 15px rgba(10, 132, 255, 0.4);
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }

.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Modo Planilha (Camuflagem) */
.spreadsheet-mode { background: #fff; color: #000; font-family: Arial, sans-serif; font-size: 13px; }
.spreadsheet-cell { border: 1px solid #ddd; padding: 4px 8px; text-align: right; }
`;

const IconBack = () => <ChevronLeft className="w-8 h-8 text-[#0A84FF]" />;

const CARD_RATES = [0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1210, 0.1238];

// --- TEXTOS DIRETO AO PONTO (COPYWRITING SENIOR) ---
const services = [
  { 
    id: 'masculina', name: 'Massagem Masculina Completa', type: 'sensual',
    description: 'Relaxamento muscular + Toque corpo a corpo (de cueca). Inclui a finalização manual (Lingam) para alívio total.', 
    labelDuration: '1 Hora', minutes: 60, basePrice: 115, 
    highlight: "🏆 A CAMPEÃ DE PEDIDOS", ratings: 5.0, reviews: 310, 
    details: ["🔥 Toque firme e presente", "🩲 Massagista de Cueca", "🍆 Finalização Manual (Lingam)", "💦 Alívio do Stress"] 
  },
  { 
    id: 'relaxante', name: 'Relaxante Tradicional', type: 'relax',
    description: 'Foco total em tirar a dor das costas e cansaço. Pescoço, braços, pernas e peito. (Aviso: Essa NÃO tem toque íntimo).', 
    labelDuration: '1 Hora', minutes: 60, basePrice: 80, 
    ratings: 4.9, reviews: 142, 
    details: ["💆‍♂️ Tira dores do corpo", "🚫 Sem parte íntima/glúteo", "✋ Mãos fortes", "☮️ Apenas relaxamento"] 
  },
];

const locations = [
  { id: 'santa-fe', label: 'Vou até Você (Casa/Hotel)', sublabel: 'Chego discreto, sem uniforme.', fee: 40, allowsTableChoice: true, estimatedTravelTime: '20 min' },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', sublabel: 'Atendimento na região (até 50km).', fee: null, allowsTableChoice: false, estimatedTravelTime: 'Combinar' },
  { 
    id: 'motel', 
    label: 'Encontro no Motel', 
    sublabel: 'Te encontro lá ou vou no seu carro.', 
    fee: 75, // OBS: No código esse fee soma, mas no recibo separamos
    allowsTableChoice: false, 
    estimatedTravelTime: '15 min' 
  },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% de Desconto (1ª Vez)' },
  'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF para Vips' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 de Desconto' },
};

const LEVELS = [
  { name: 'Visitante', min: 0, icon: '👤' },
  { name: 'Cliente Frequente', min: 300, icon: '🥈' },
  { name: 'Cliente Vip', min: 600, icon: '🥇' },
  { name: 'Patrão', min: 1200, icon: '💎', perks: "Prioridade Total" },
];

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const musicVibes = ['Silêncio (Sem papo) 🤫', 'Música Zen 🧘', 'Sons de Natureza 🌿'];

// OBJETIVOS CLAROS (SUBSTITUI O "MOOD")
const moodOptions = [
  { id: 'relax', icon: '🤯', label: 'Cabeça Cheia', desc: 'Preciso desligar a mente' },
  { id: 'pain', icon: '🤕', label: 'Dor no Corpo', desc: 'Preciso soltar a musculatura' },
  { id: 'care', icon: '🥺', label: 'Atenção Total', desc: 'Preciso de toque e carinho' },
  { id: 'relief', icon: '🔥', label: 'Alívio/Vigor', desc: 'Preciso de finalização' }
];

const REVIEWS_DB = [
  { t: "Pode confiar. O cara é ponta firme, discreto e a massagem resolveu meu problema.", a: "Carlos (45 anos)", r: 5 },
  { t: "Sou casado, fiquei com receio, mas foi tudo 100% profissional e sigiloso.", a: "Anônimo", r: 5 },
  { t: "Mão pesada na medida certa. Sai de lá zerado.", a: "Roberto (52 anos)", r: 5 }
];

// --- UTILS ---
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate([15]); }; 
const generateBookingId = () => {
    const chars = 'XYZ789'; 
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// --- COMPONENTES UI (SIMPLES E FUNCIONAIS) ---

// 1. Botão de Camuflagem (Planilha)
const FakeSpreadsheet = ({ onExit }) => (
  <div className="fixed inset-0 bg-white z-[9999] spreadsheet-mode p-2 overflow-auto text-black" onClick={onExit}>
    <div className="flex justify-between mb-2 border-b border-gray-300 pb-2">
      <span className="font-bold text-green-700">Excel - Relatório Financeiro.xlsx</span>
      <span className="text-gray-500 text-[10px]">Toque para sair</span>
    </div>
    <table className="w-full border-collapse text-[11px]">
      <thead className="bg-gray-100">
        <tr><th className="border p-1">Data</th><th className="border p-1">Descrição</th><th className="border p-1">Valor (R$)</th><th className="border p-1">Status</th></tr>
      </thead>
      <tbody>
        {[...Array(25)].map((_, r) => (
          <tr key={r}>
            <td className="spreadsheet-cell">0{r+1}/12/2025</td>
            <td className="spreadsheet-cell" style={{textAlign: 'left'}}>Pagamento Fornecedor {r+10}</td>
            <td className="spreadsheet-cell">{(Math.random() * 2000).toFixed(2)}</td>
            <td className="spreadsheet-cell">Pago</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// 2. Botão Flutuante Discreto
const PanicButton = ({ onTrigger }) => (
  <button onClick={onTrigger} className="fixed bottom-5 right-5 z-[100] bg-[#1C1C1E] border border-white/20 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform">
    <FileSpreadsheet className="w-5 h-5 text-gray-400" />
  </button>
);

// 3. Perfil Simples (COM FOTO)
const MasseurProfile = () => (
  <div className="flex items-center gap-4 bg-[#151517] p-4 rounded-2xl border border-white/5 mb-6">
    <div className="relative">
      {/* IMPORTANTE: Substitua o 'src' abaixo pelo link da sua foto hospedada ou base64.
         Como exemplo, estou usando um placeholder de avatar.
      */}
      <img 
        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" 
        alt="Thalyson" 
        className="w-16 h-16 rounded-full object-cover border-2 border-white/10"
      />
      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#151517]"></div>
    </div>
    <div>
      <h3 className="font-bold text-white text-[18px]">Thalyson R. <span className="text-[10px] text-[#0A84FF] bg-[#0A84FF]/10 px-2 py-0.5 rounded ml-1 uppercase">Verificado</span></h3>
      <p className="text-gray-400 text-[13px] leading-tight mt-1">"Trabalho sério. Sigilo, respeito e a melhor massagem da região."</p>
    </div>
  </div>
);

// 4. Aviso de "Espiões" (Gatilho)
const LiveStatus = () => {
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-in flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[11px] text-gray-300 font-bold uppercase tracking-wide">Agenda aberta agora</span>
      </div>
    </div>
  );
};

const LoyaltyCard = ({ data, privacyMode, onTogglePrivacy }) => {
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => data.totalSpent >= l.min);
  const currentLevel = LEVELS[LEVELS.length - 1 - currentLevelIdx];
  const nextLevel = LEVELS[LEVELS.length - 1 - currentLevelIdx + 1];
  
  return (
    <div className="ios-card p-5 rounded-[24px] relative overflow-hidden mb-8">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-[10px] text-[#0A84FF] font-bold uppercase tracking-widest mb-1">Seu Nível</p>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">{currentLevel.icon} {currentLevel.name}</h3>
        </div>
        <div className="text-right">
          <button onClick={onTogglePrivacy} className="mb-1 text-gray-500 p-1"><Eye className="w-5 h-5" /></button>
          <p className={`text-lg font-mono text-white font-bold ${privacyMode ? 'blur-sm opacity-50' : ''}`}>
            {formatCurrency(data.totalSpent)}
          </p>
        </div>
      </div>
      <div className="w-full bg-white/10 h-1.5 rounded-full mb-3">
        <div className="bg-[#0A84FF] h-1.5 rounded-full" style={{width: '60%'}}></div>
      </div>
      <div className="flex justify-between text-[11px] text-gray-400 font-medium">
        <span>Economia: {formatCurrency(data.totalSaved)}</span>
        {nextLevel && <span>Próximo: {formatCurrency(nextLevel.min)}</span>}
      </div>
    </div>
  );
};

// 5. Seletor de Data Inteligente (Scroll Mês)
const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const days = [];
  let tempDate = new Date(now);
  
  // Preenche dias até o fim do mês
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
      {currentMonthName && <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">{currentMonthName}</h3>}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate();
          const label = getDayLabel(d);
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} className={`flex flex-col items-center justify-center min-w-[72px] h-[84px] rounded-[18px] transition-all border ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#1C1C1E] border-white/10 text-gray-500'}`}>
              <span className={`text-[10px] uppercase font-bold mb-1 ${label === 'HOJE' ? 'text-green-400' : isSel ? 'text-white' : 'text-gray-400'}`}>{label}</span>
              <span className="text-2xl font-bold">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="grid grid-cols-4 gap-2 animate-fade-in">
          {timeSlots.map(t => {
            const [h] = t.split(':').map(Number);
            const blocked = selectedDate.getDate() === now.getDate() && h <= now.getHours();
            return (
              <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                className={`py-3 rounded-[14px] text-[14px] font-bold transition-all border ${selectedTime === t ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : blocked ? 'bg-white/5 border-transparent text-gray-700' : 'bg-[#1C1C1E] border-white/10 text-gray-300'}`}>
                {blocked ? <Lock className="w-3 h-3 mx-auto opacity-20" /> : t}
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
          if (inventory.includes(codeUpper)) { alert('Você já tem esse cupom!'); } 
          else { onAddManual(codeUpper); setManualCode(''); triggerHaptic(); }
      } else { alert('Código inválido.'); }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center ml-1 mb-2">
        <h4 className="text-[13px] font-bold text-gray-400 uppercase">Tem algum código?</h4>
      </div>
      <div className="flex gap-2 mb-3">
          <input value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Digite aqui..." className="w-full bg-[#1C1C1E] border border-white/10 text-white text-[16px] rounded-[14px] p-3 placeholder:text-gray-600 focus:border-[#0A84FF]" />
          <button onClick={handleManualAdd} className="bg-[#2C2C2E] border border-white/10 text-white px-5 rounded-[14px] font-bold text-[13px]">Aplicar</button>
      </div>
      {myCoupons.length > 0 && (
        <div className="space-y-3">
          {myCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <button key={coupon.code} onClick={() => { triggerHaptic(); isApplied ? onRemove() : onApply(coupon.code); }} className={`w-full p-4 rounded-[18px] flex justify-between items-center transition-all border ${isApplied ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-white/5'}`}>
                <div className="text-left">
                  <span className="text-[11px] font-bold text-black bg-[#FFD60A] px-2 py-0.5 rounded uppercase">{coupon.code}</span>
                  <p className="text-xs text-gray-300 mt-1">{coupon.desc}</p>
                </div>
                {isApplied ? <CheckCircle2 className="w-5 h-5 text-[#0A84FF]" /> : <div className="text-[11px] font-bold text-[#0A84FF]">USAR</div>}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};

const Notifications = ({ notifications, onClear }) => {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  useEffect(() => { const close = () => setOpen(false); if(open) window.addEventListener('click', close); return () => window.removeEventListener('click', close); }, [open]);
  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button onClick={() => { setOpen(!open); if(!open && unread > 0) onClear(); }} className="relative p-2.5 rounded-full bg-[#1C1C1E] border border-white/10">
        <Bell className="w-6 h-6 text-white" />
        {unread > 0 && <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-[#FF3B30] rounded-full border-2 border-[#1C1C1E] animate-pulse" />}
      </button>
      {open && (
        <div className="absolute top-14 right-0 w-80 bg-[#121214] border border-white/10 shadow-2xl rounded-[20px] overflow-hidden z-[100] animate-fade-in">
           <div className="p-4 border-b border-white/10 bg-[#1C1C1E] flex justify-between items-center">
             <h4 className="font-bold text-white text-sm">Avisos</h4>
             <button onClick={() => setOpen(false)} className="p-1"><X className="w-4 h-4 text-gray-400"/></button>
           </div>
           <div className="max-h-64 overflow-y-auto p-2">
             {notifications.length === 0 ? <div className="p-6 text-center text-gray-500 text-sm">Nenhum aviso.</div> : notifications.map(n => (
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
  const [step, setStep] = useState('home'); 
  const [loading, setLoading] = useState(true);
  const [camouflage, setCamouflage] = useState(false);
  
  const locationRef = useRef(null);
  const vibeRef = useRef(null);
  const extrasRef = useRef(null);
  const paymentRef = useRef(null);
  const homeRef = useRef(null);
  const surfaceRef = useRef(null);

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

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  useEffect(() => {
    localStorage.setItem('thaly_system_v70', JSON.stringify(loyalty));
    if (loyalty.savedName) { setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true})); }
  }, [loyalty]);

  useEffect(() => {
    const hr = new Date().getHours();
    setGreeting(hr < 12 ? "Bom dia" : hr < 18 ? "Boa tarde" : "Boa noite");
    if (hr >= 18) setWeatherHint("A noite pede um descanso.");
    else setWeatherHint("Pausa merecida no dia.");
  }, []);

  useEffect(() => { if (selection.location?.allowsTableChoice && step === 'configure') setTimeout(() => surfaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); }, [selection.location, step]);
  useEffect(() => { if (step === 'home') homeRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const handleQuickSchedule = () => { triggerHaptic(); loyalty.savedName ? setStep('services') : setStep('identity'); };
  
  const handleCopyPix = () => { navigator.clipboard.writeText("62922530000144"); alert("Chave Pix Copiada!"); }; 

  const handleAddManualCoupon = (code) => {
      if (!loyalty.inventory.includes(code)) { setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]})); triggerHaptic(); } 
      else { alert('Você já tem esse cupom!'); }
  };

  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    // Removendo taxas externas do cálculo base para mostrar separado no recibo
    // No código original, location.fee estava somando aqui. Vamos manter o calculo bruto para parcelamento,
    // mas separar no display final.
    if (selection.location?.fee) total += selection.location.fee; 
    
    if (selection.upgrade) total += selection.service.basePrice * 0.5;
    if (selection.useTable) total += 20;
    if (selection.aroma) total += 10;
    
    // Cupom só aplica no serviço base + extras, não na taxa de Uber (lógica justa)
    let discount = 0;
    if (selection.coupon) {
      if (selection.coupon.type === 'percent') discount = (total * selection.coupon.value / 100);
      else discount = selection.coupon.value;
    }
    return Math.max(0, total - discount);
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

    // --- CÁLCULO DETALHADO ---
    const serviceVal = selection.service.basePrice;
    const upgradeVal = selection.upgrade ? selection.service.basePrice * 0.5 : 0;
    const aromaVal = selection.aroma ? 10 : 0;
    const tableVal = selection.useTable ? 20 : 0;
    const subTotal = serviceVal + upgradeVal + aromaVal + tableVal; // Valor do Massagista Bruto

    let discountVal = 0;
    if (selection.coupon) {
        if (selection.coupon.type === 'percent') discountVal = (subTotal * selection.coupon.value / 100);
        else discountVal = selection.coupon.value;
    }
    
    const massageNet = subTotal - discountVal; // Quanto o massagista recebe do serviço
    
    let externalCost = 0;
    let externalLabel = "";
    
    if (selection.location.id === 'motel') {
        // Motel paga lá, não soma no app
        externalCost = 75; 
        externalLabel = "(Pagar na Saída do Motel)";
    } else if (selection.location.id === 'santa-fe') {
        externalCost = selection.location.fee || 0;
        externalLabel = "(Taxa Deslocamento)";
    }

    // Soma final para o cliente
    let totalToPay = massageNet;
    if (selection.location.id !== 'motel') totalToPay += externalCost; // Se for uber, soma. Se for motel, é separado.

    const oldTotal = loyalty.totalSpent;
    const newTotal = oldTotal + totalToPay; 
    const bookingId = generateBookingId(); 
    
    let newInventory = [...loyalty.inventory];
    if (selection.coupon) { newInventory = newInventory.filter(c => c !== selection.coupon.code); }

    const notifications = [...loyalty.notifications];
    LEVELS.forEach(lvl => {
      if (newTotal >= lvl.min && oldTotal < lvl.min && lvl.rewardCode) {
        if (!newInventory.includes(lvl.rewardCode)) {
          newInventory.push(lvl.rewardCode);
          notifications.unshift({ id: Date.now()+1, title: '🏆 Subiu de Nível!', message: `Agora você é ${lvl.name}!`, read: false, timestamp: Date.now() });
        }
      }
    });

    const newHistory = [{ id: Date.now(), serviceName: selection.service.name, date: new Date().toLocaleDateString(), value: totalToPay }, ...loyalty.history];
    setLoyalty(prev => ({ ...prev, savedName: user.name || prev.savedName, totalSpent: newTotal, totalSaved: prev.totalSaved + discountVal, inventory: newInventory, notifications, history: newHistory }));

    const isToday = selection.date.getDate() === new Date().getDate();
    const dateStr = `${selection.date.toLocaleDateString('pt-BR')}${isToday ? ' (HOJE)' : ''}`;
    let finalDuration = selection.service.labelDuration;
    if (selection.upgrade) { finalDuration = "1 Hora + 30 min (Extra)"; }
    
    let surfaceText = "";
    if (selection.location.allowsTableChoice) surfaceText = selection.useTable ? "Maca Portátil (+R$20)" : "Na minha cama";
    else if (selection.location.id === 'motel') surfaceText = "Motel (Suíte)"; 
    else surfaceText = `Cidade: ${selection.city}`;

    let paymentText = "";
    if (selection.paymentMethod === 'pix') paymentText = "PIX";
    else if (selection.paymentMethod === 'cash') paymentText = "DINHEIRO";
    else if (selection.paymentMethod === 'debit_card') paymentText = "DÉBITO";
    else if (selection.paymentMethod === 'credit_card') {
        const parcelValue = calcFinalPrice() / selection.installments; // Usa função antiga para parcelas
        paymentText = `CARTÃO (${selection.installments}x ${formatCurrency(parcelValue)})`;
    }

    const moodLabel = moodOptions.find(m => m.id === selection.mood)?.label || "Normal";

    // MENSAGEM FINAL AJUSTADA
    let msg = `*PEDIDO #${bookingId} - THALY MASSAGENS*
--------------------------------
👤 *Nome:* ${user.name}
📅 *Data:* ${dateStr}
⏰ *Hora:* ${selection.time}
📍 *Local:* ${selection.location.label}
${surfaceText}

💆‍♂️ *SERVIÇO:*
• ${selection.service.name}
• Duração: ${finalDuration}
• Objetivo: ${moodLabel}
${selection.aroma ? '• Com Aromaterapia' : ''}

💰 *RESUMO VALORES:*
(+) Serviço Massagem: ${formatCurrency(subTotal)}
(-) Desconto Cupom: ${formatCurrency(discountVal)}
--------------------------------
*= TOTAL SERVIÇO: ${formatCurrency(massageNet)}*

🚗 *TAXAS EXTRAS:*
${externalCost > 0 ? `+ ${formatCurrency(externalCost)} ${externalLabel}` : 'Sem taxa extra'}

💳 *PAGAMENTO:* ${paymentText}
Total Previsto: ${formatCurrency(totalToPay)}
--------------------------------
Aguardo confirmação.`;

    msg = msg.replace(/^\s*[\r\n]/gm, "");
    window.open(`https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, mood: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  if (camouflage) return <FakeSpreadsheet onExit={() => setCamouflage(false)} />;

  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-6 font-sans text-gray-200 bg-black selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#0A84FF] to-[#0056B3] rounded-3xl flex items-center justify-center mb-6 shadow-2xl animate-pulse">
            <span className="text-3xl">💆‍♂️</span>
          </div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Carregando...</p>
        </div>
      ) : (
      <>
        <PanicButton onTrigger={() => setCamouflage(true)} />

        <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] aurora-bg">
          
          {/* HEADER FIXO */}
          {step !== 'home' && step !== 'success' && (
            <div className="absolute top-0 w-full z-30 ios-header px-5 pt-12 pb-4 flex justify-between items-center">
              {step === 'services' && loyalty.savedName ? (
                 <div className="flex items-center gap-1"><button onClick={() => setStep('home')} className="p-2 -ml-2 rounded-full active:bg-white/10"><IconBack /></button></div>
              ) : (
                 <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10"><IconBack /></button>
              )}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 text-[10px] font-bold border border-white/10 flex items-center gap-1 uppercase tracking-wider"><ShieldCheck className="w-3 h-3"/> Sigilo</span>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-[15px]">{user.name || loyalty.savedName || 'Visitante'}</span>
                    {loyalty.savedName && <button onClick={() => setStep('identity')} className="p-1 text-gray-500 hover:text-white"><Edit3 className="w-4 h-4"/></button>}
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
                  <p className="text-[11px] text-[#0A84FF] uppercase tracking-widest font-bold flex items-center gap-2 mb-1">
                    {greeting}
                  </p>
                  <h1 className="text-3xl font-bold text-white tracking-tight">{loyalty.savedName ? `Fala, ${loyalty.savedName}` : 'Bem-vindo'}</h1>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowFaq(true)} className="w-11 h-11 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center active:scale-95 transition-transform"><HelpCircle className="w-6 h-6 text-gray-300" /></button>
                  <a href="https://www.instagram.com/thalymassagens/" target="_blank" className="w-11 h-11 rounded-full bg-[#1C1C1E] border border-white/10 flex items-center justify-center active:scale-95 transition-transform"><Instagram className="w-6 h-6 text-[#FF2D55]" /></a>
                </div>
              </div>

              <LoyaltyCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
              
              <LiveStatus />
              <MasseurProfile />

              <div className="flex justify-between items-center mb-6 px-1">
                <span className="text-[12px] font-bold text-gray-400 bg-white/5 px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2">{weatherHint}</span>
              </div>
              
              <div className="mt-auto">
                <button onClick={handleQuickSchedule} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] shadow-lg flex justify-center items-center gap-3 text-[18px] h-16">
                  AGENDAR HORÁRIO <ArrowRight className="w-6 h-6" />
                </button>
                <p className="text-center text-[11px] text-gray-600 mt-4 flex items-center justify-center gap-1 font-medium">Seus dados não ficam salvos online.</p>
              </div>
            </div>
          )}

          {/* --- IDENTITY --- */}
          {step === 'identity' && (
            <div className="flex-1 p-6 pt-32 animate-fade-in flex flex-col h-full">
              <h2 className="text-3xl font-bold text-white mb-2">Quem é você?</h2>
              <p className="text-gray-400 text-[16px] mb-8 font-medium">Precisamos de um nome para o controle. Pode ser apelido.</p>
              
              <div className="space-y-6 flex-1">
                <div className="ios-card p-6 rounded-[24px]">
                  <label className="text-[12px] text-[#0A84FF] font-bold uppercase tracking-wider block mb-2">Seu Nome / Apelido</label>
                  <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent text-white text-[22px] font-bold placeholder:text-gray-600 border-b border-white/10 py-2 focus:border-[#0A84FF] transition-colors" placeholder="Ex: Carlos..." />
                </div>
                
                <div className="space-y-3">
                  <button onClick={() => { triggerHaptic(); setUser({...user, isAdult: !user.isAdult}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                    <div className={`w-7 h-7 rounded-full border-[2px] flex items-center justify-center transition-all ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-500'}`}>{user.isAdult && <Check className="w-4 h-4 text-white" />}</div>
                    <span className={`text-[18px] font-bold ${user.isAdult ? 'text-white' : 'text-gray-400'}`}>Sou maior de 18 anos</span>
                  </button>
                  <button onClick={() => { triggerHaptic(); setUser({...user, isMassagemOk: !user.isMassagemOk}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user.isMassagemOk ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                    <div className={`w-7 h-7 rounded-full border-[2px] flex items-center justify-center transition-all ${user.isMassagemOk ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-500'}`}>{user.isMassagemOk && <Check className="w-4 h-4 text-white" />}</div>
                    <span className={`text-[18px] font-bold ${user.isMassagemOk ? 'text-white' : 'text-gray-400'}`}>Aceito a conduta</span>
                  </button>
                </div>

                <div className="mt-auto">
                  <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] text-[18px] h-16 disabled:opacity-50 shadow-lg uppercase tracking-wide">Continuar</button>
                </div>
              </div>
            </div>
          )}

          {/* --- SERVICES --- */}
          {step === 'services' && (
            <div className="flex-1 p-6 pt-32 overflow-y-auto pb-28 animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Escolha o Serviço</h2>
              </div>
              <div className="space-y-6">
                {services.map(s => (
                  <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className={`ios-card p-6 rounded-[26px] active:scale-[0.98] transition-all group relative overflow-hidden ${s.id === 'masculina' ? 'border-[#0A84FF] shadow-[0_0_30px_rgba(10,132,255,0.15)]' : 'border-white/5'}`}>
                    {s.id === 'masculina' && <div className="absolute top-0 right-0 p-2 bg-[#0A84FF] rounded-bl-xl"><Flame className="w-5 h-5 text-white animate-pulse" /></div>}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-white text-[20px] max-w-[70%] leading-tight">{s.name}</h3>
                      <span className="text-[#0A84FF] font-bold text-[18px] bg-[#0A84FF]/10 px-3 py-1 rounded-lg border border-[#0A84FF]/20">{formatCurrency(s.basePrice)}</span>
                    </div>
                    {s.highlight && <span className="text-[11px] font-bold text-black bg-[#FFD60A] px-2 py-0.5 rounded mb-3 inline-block tracking-wide uppercase">{s.highlight}</span>}
                    <p className="text-[15px] text-gray-300 leading-relaxed mb-5 font-medium">{s.description}</p>
                    <ul className="space-y-3 mb-4">
                      {s.details.map((d, idx) => (<li key={idx} className="text-[14px] text-gray-300 flex items-center gap-3 font-medium"><div className="w-2 h-2 rounded-full bg-[#0A84FF]"></div> {d}</li>))}
                    </ul>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[13px] bg-white/5 px-3 py-1.5 rounded-full text-gray-300 flex items-center gap-1.5 font-bold uppercase"><Clock className="w-4 h-4"/> {s.labelDuration}</span>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#0A84FF] transition-colors"><ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white" /></div>
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
                  <h3 className="font-bold text-white text-[18px]">{selection.service.name}</h3>
                  <p className="text-[13px] text-gray-400 mt-0.5 font-medium">{selection.service.labelDuration}</p>
                </div>
                <span className="text-[20px] font-bold text-[#0A84FF]">{formatCurrency(selection.service.basePrice)}</span>
              </div>

              <div className="space-y-10">
                <section>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-4 h-4"/> Data e Hora</h4>
                  </div>
                  <div className="ios-card p-2 rounded-[24px]">
                     <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />
                  </div>
                </section>

                <section ref={locationRef}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4"/> Onde vai ser?</h4>
                    {selection.location && <button onClick={() => setSelection({...selection, location: null, useTable: null, city: ''})} className="text-[11px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 px-3 py-1 rounded-full uppercase">Trocar</button>}
                  </div>
                  <div className="space-y-3">
                    {locations.map(l => {
                      if (selection.location && selection.location.id !== l.id) return null;
                      return (
                      <div key={l.id} className="animate-fade-in">
                          <button onClick={() => { triggerHaptic(); setSelection({...selection, location: l, useTable: null}); scrollTo(vibeRef); }} className={`w-full p-5 rounded-[22px] border text-left transition-all duration-300 ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-white text-[18px]">{l.label}</span> 
                              {l.fee > 0 && <span className="text-[12px] font-bold text-gray-300 bg-white/10 px-2 py-1 rounded">+ {formatCurrency(l.fee)}</span>}
                            </div>
                            <p className="text-[14px] text-gray-400 font-medium">{l.sublabel}</p>
                          </button>
                          {selection.location?.id === l.id && l.id === 'santa-fe' && l.allowsTableChoice && (
                            <div ref={surfaceRef} className="mt-3 grid grid-cols-2 gap-3 animate-fade-in">
                              <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[14px] font-bold transition-all ${selection.useTable === false ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'ios-btn border-transparent text-gray-400'}`}>🛏 Na minha Cama</button>
                              <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[14px] font-bold transition-all ${selection.useTable === true ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'ios-btn border-transparent text-gray-400'}`}>💆‍♂️ Trazer Maca (+20)</button>
                            </div>
                          )}
                          {selection.location?.id === l.id && l.id === 'outras-cidades' && (
                              <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Nome da cidade..." className="mt-3 w-full bg-[#1C1C1E] p-4 rounded-[18px] border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0A84FF] transition-all animate-fade-in" />
                          )}
                      </div>
                    )})}
                  </div>
                </section>

                <div className="mt-4" ref={vibeRef}>
                  <h4 className="text-[13px] font-bold text-gray-400 uppercase mb-3 tracking-widest flex items-center gap-2"><Zap className="w-4 h-4"/> Qual seu objetivo?</h4>
                  <div className="grid grid-cols-2 gap-3">
                     {moodOptions.map(m => (
                        <button key={m.id} onClick={() => { setSelection({...selection, mood: m.id}); scrollTo(extrasRef); }} className={`p-4 rounded-[18px] border text-left transition-all duration-300 ${selection.mood === m.id ? 'bg-[#0A84FF] border-[#0A84FF] shadow-lg' : 'ios-btn border-transparent'}`}>
                          <span className="text-3xl mb-2 block">{m.icon}</span>
                          <p className={`text-[15px] font-bold ${selection.mood === m.id ? 'text-white' : 'text-gray-300'}`}>{m.label}</p>
                          <p className={`text-[11px] font-medium ${selection.mood === m.id ? 'text-white/80' : 'text-gray-500'}`}>{m.desc}</p>
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
                  <h4 className="text-[13px] font-bold text-gray-400 uppercase mb-1 tracking-widest mt-4">Personalizar</h4>
                  <button onClick={() => { triggerHaptic(); setSelection({...selection, upgrade: !selection.upgrade}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                    <div className="text-left"><p className="text-white font-bold text-[16px]">Mais Tempo (+30min)</p><p className="text-[12px] text-gray-500 font-medium">Sem pressa para acabar</p></div>
                    <span className="text-[#0A84FF] font-bold text-[16px]">+{formatCurrency(selection.service.basePrice * 0.5)}</span>
                  </button>
                  <button onClick={() => { triggerHaptic(); setSelection({...selection, aroma: !selection.aroma}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-btn border-transparent'}`}>
                    <div className="text-left"><p className="text-white font-bold text-[16px]">Aromaterapia 🌿</p><p className="text-[12px] text-gray-500 font-medium">Óleos especiais e cheiro bom</p></div>
                    <span className="text-[#0A84FF] font-bold text-[16px]">+R$ 10,00</span>
                  </button>
                </div>

                <CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(code) => { setSelection({...selection, coupon: SYSTEM_COUPONS[code]}); scrollTo(paymentRef); }} onRemove={() => setSelection({...selection, coupon: null})} onAddManual={handleAddManualCoupon}/>

                <div className="mt-6" ref={paymentRef}>
                  <h4 className="text-[13px] font-bold text-gray-400 uppercase mb-3 tracking-widest">Pagamento</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`p-4 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}><QrCode className="w-6 h-6 text-[#0A84FF]" /><span className="text-[14px] font-bold text-white">Pix</span></button>
                    <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`p-4 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}><Banknote className="w-6 h-6 text-[#30D158]" /><span className="text-[14px] font-bold text-white">Dinheiro</span></button>
                    <button onClick={() => setSelection({...selection, paymentMethod: 'debit_card'})} className={`p-4 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'debit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}><CreditCard className="w-6 h-6 text-[#0A84FF]" /><span className="text-[14px] font-bold text-white">Débito</span></button>
                    <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`p-4 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'ios-btn border-transparent'}`}><CreditCard className="w-6 h-6 text-[#FFD60A]" /><span className="text-[14px] font-bold text-white">Crédito</span></button>
                  </div>
                  {selection.paymentMethod === 'credit_card' && (
                    <div className="mt-3 ios-card p-3 rounded-[16px] animate-fade-in">
                      <label className="text-[13px] text-gray-400 block mb-1 font-bold ml-1">Parcelas (Sem nome de massagem na fatura):</label>
                      <select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#1C1C1E] border border-white/10 text-white text-[16px] rounded-lg p-3 focus:border-[#0A84FF]">
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
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5"><Receipt className="w-5 h-5 text-gray-400" /><span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">Resumo do Pedido</span></div>
                      <div className="space-y-3 text-[15px]">
                          <div className="flex justify-between text-gray-300 font-medium"><span>{selection.service.name}</span><span>{formatCurrency(selection.service.basePrice)}</span></div>
                          {selection.location?.fee > 0 && <div className="flex justify-between text-gray-400"><span>+ Taxa Deslocamento</span><span>{formatCurrency(selection.location.fee)}</span></div>}
                          {selection.upgrade && <div className="flex justify-between text-gray-400"><span>+ 30 Minutos Extra</span><span>{formatCurrency(selection.service.basePrice * 0.5)}</span></div>}
                          {selection.useTable && <div className="flex justify-between text-gray-400"><span>+ Levar Maca</span><span>{formatCurrency(20)}</span></div>}
                          {selection.aroma && <div className="flex justify-between text-gray-400"><span>+ Aromaterapia</span><span>{formatCurrency(10)}</span></div>}
                          {selection.coupon && <div className="flex justify-between text-[#30D158] font-bold"><span>Desconto ({selection.coupon.code})</span><span>-{selection.coupon.type === 'percent' ? formatCurrency(calcBaseTotal() / (1 - selection.coupon.value/100) - calcBaseTotal()) : formatCurrency(selection.coupon.value)}</span></div>}
                          {selection.location?.id === 'motel' && <div className="flex items-center gap-2 text-[#FFD60A] text-[12px] bg-[#FFD60A]/10 p-2 rounded-lg mt-2"><Info className="w-4 h-4" /><span>Taxa da Suíte (R$75) paga lá na saída.</span></div>}
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
                    <span className="text-[11px] text-gray-500 uppercase font-black tracking-widest mb-1">TOTAL FINAL</span>
                    <div className="flex items-end gap-3">
                      {(selection.coupon || selection.paymentMethod === 'credit_card') && <span className="text-sm text-gray-500 line-through font-medium mb-1">{formatCurrency(calcOriginalPrice())}</span>}
                      <span className="text-4xl font-bold text-white tracking-tighter leading-none">{selection.location.id === 'outras-cidades' ? 'A definir' : formatCurrency(calcFinalPrice())}</span>
                    </div>
                    {selection.paymentMethod === 'credit_card' && <span className="text-[11px] text-gray-500 mt-1 ml-0.5">Com taxa da máquina</span>}
                  </div>
                </div>
                <button disabled={!canFinalize} onClick={handleWhatsApp} className="w-full bg-[#0A84FF] hover:bg-[#007AFF] active:scale-[0.98] transition-all text-white font-bold py-4 rounded-[20px] shadow-[0_4px_20px_rgba(10,132,255,0.4)] flex justify-center items-center gap-3 text-[18px] disabled:opacity-50 disabled:shadow-none h-16 uppercase tracking-wide">
                  {canFinalize ? `Confirmar (${selection.upgrade ? '90' : '60'} min) • ${formatCurrency(calcFinalPrice())}` : 'Preencha tudo para continuar'} <ArrowRight className="w-6 h-6"/>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
              <div className="w-24 h-24 bg-[#30D158] rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(48,209,88,0.4)] animate-scale"><Check className="w-12 h-12 text-white drop-shadow-md"/></div>
              <h2 className="text-3xl font-bold text-white mb-3">Tudo Certo!</h2>
              <p className="text-gray-400 mb-10 text-[18px] leading-relaxed font-medium">Seu pedido foi gerado. Finalize a conversa no WhatsApp para garantir sua vaga.</p>
              <button onClick={handleCopyPix} className="mb-6 flex items-center gap-2 text-[16px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 px-6 py-4 rounded-xl border border-[#0A84FF]/20 hover:bg-[#0A84FF]/20 transition-colors uppercase tracking-wide"><Copy className="w-5 h-5"/> Copiar Chave Pix</button>
              <button onClick={handleReset} className="w-full ios-btn py-4 rounded-[18px] text-white font-bold text-[16px]">Voltar ao Início</button>
            </div>
          )}

          {showFaq && (
            <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-5">
              <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[32px] p-8 border border-white/10 shadow-2xl animate-scale">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Shield className="w-7 h-7 text-[#0A84FF]" /> Dúvidas & Segurança</h3>
                <div className="space-y-6 text-[15px] text-gray-300 leading-relaxed font-medium">
                  <p>🔒 <strong>Sigilo Total:</strong> Seus dados não ficam salvos em nenhum lugar. O app roda só no seu navegador.</p>
                  <p>🚫 <strong>Conduta:</strong> Apenas massagem terapêutica. Respeito é a base de tudo.</p>
                  <p>💳 <strong>Fatura Discreta:</strong> No cartão, não aparece nome de massagem.</p>
                  <p className="text-red-400 text-xs mt-2 border-l-2 border-red-500 pl-2">⚠️ Atenção: Ao limpar os dados abaixo, você perderá seu Nível Vip e saldo de pontos acumulados.</p>
                  <div className="pt-6 border-t border-white/10">
                     <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="text-xs text-[#FF3B30] flex items-center gap-2 font-bold uppercase tracking-wider"><Trash2 className="w-4 h-4"/> Apagar tudo e sair</button>
                  </div>
                </div>
                <button onClick={() => setShowFaq(false)} className="mt-8 w-full bg-[#2C2C2E] text-white py-4 rounded-[18px] font-bold text-[16px]">Entendi</button>
              </div>
            </div>
          )}
        </div>
      </>
      )}
    </div>
  );
}
