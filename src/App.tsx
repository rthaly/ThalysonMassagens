import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, FlaskConical, Pencil, Moon, Sun
} from 'lucide-react';

// --- ESTILOS GLOBAIS (DESIGN SYSTEM: 'MIDNIGHT LOUNGE') ---
const globalStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.02em;
  color: #E0E0E0;
  background: #050505;
}
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
input, select { user-select: text; font-size: 17px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; -webkit-touch-callout: none; }

/* Fundo Premium Masculino */
.premium-bg {
  background: 
    radial-gradient(circle at 50% 0%, rgba(20, 30, 48, 0.4), transparent 60%),
    linear-gradient(180deg, #09090b 0%, #000000 100%);
  background-attachment: fixed;
  background-size: cover;
}

/* Glassmorphism Escuro (Privacidade & Luxo) */
.glass-card { 
  background: rgba(30, 30, 35, 0.7); 
  backdrop-filter: blur(25px) saturate(120%); 
  -webkit-backdrop-filter: blur(25px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.glass-header { 
  background: rgba(5, 5, 5, 0.9); 
  backdrop-filter: blur(20px); 
  border-bottom: 1px solid rgba(255,255,255,0.05); 
}

/* Botões de Alta Performance */
.btn-base { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
}
.btn-base:active { transform: scale(0.96); background: rgba(255, 255, 255, 0.1); }

.btn-active { 
  background: rgba(10, 132, 255, 0.15); 
  color: #fff; 
  box-shadow: 0 0 25px rgba(10, 132, 255, 0.2);
  border: 1px solid #0A84FF;
}

/* Botão Principal (Call to Action) */
.btn-primary {
  background: linear-gradient(135deg, #0A84FF 0%, #0056B3 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 86, 179, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.btn-primary:active { transform: scale(0.98); opacity: 0.95; }
.btn-primary:disabled { background: #333; box-shadow: none; color: #666; }

/* Animações Suaves */
.animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

/* Inputs Otimizados */
.input-field {
  background: #151517;
  border: 1px solid #333;
  color: #fff;
  transition: border-color 0.3s ease;
}
.input-field:focus { border-color: #0A84FF; }
.input-field::placeholder { color: #555; }
`;

// --- DADOS REFINADOS PARA O PÚBLICO ALVO ---
const IconBack = () => <ChevronLeft className="w-6 h-6 text-gray-300" />;

const CARD_RATES = [0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1210, 0.1238];

const services = [
  { 
    id: 'masculina', name: 'Experiência Tantra VIP', type: 'sensual',
    description: 'A sessão mais completa. Conexão total, toques corpo a corpo e alívio de tensão acumulada. Finalização manual inclusa.', 
    labelDuration: '60 min', minutes: 60, basePrice: 115, 
    highlight: "🔥 A ESCOLHA DOS HOMENS", ratings: 5.0, reviews: 310, 
    details: ["Toque Corpo a Corpo (Body-to-Body)", "Massagista de Cueca", "Finalização Manual (Lingam)", "Sigilo Absoluto"] 
  },
  { 
    id: 'relaxante', name: 'Descompressão Total', type: 'relax',
    description: 'Massagem terapêutica profunda para zerar o stress do trabalho e dia a dia. Foco muscular nas costas e pernas.', 
    labelDuration: '60 min', minutes: 60, basePrice: 80, 
    ratings: 4.9, reviews: 142, 
    details: ["Muscular Profunda", "Sem Toques Íntimos", "Alívio de Dores", "Relaxamento Mental"] 
  },
];

const locations = [
  { id: 'santa-fe', label: 'Domicílio / Hotel', sublabel: 'Vou até você (Santa Fé)', fee: 40, allowsTableChoice: true, estimatedTravelTime: '15-20 min', icon: <MapPin className="w-5 h-5"/> },
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Encontro no local (Eu vou com você)', fee: 75, allowsTableChoice: false, estimatedTravelTime: '10-15 min', icon: <Bed className="w-5 h-5"/> },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', sublabel: 'Jales, Três Fronteiras, etc.', fee: null, allowsTableChoice: false, estimatedTravelTime: 'A combinar', icon: <MapPin className="w-5 h-5"/> },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF - Primeira Vez' },
  'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF - Especial' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF - Membro' },
};

const LEVELS = [
  { name: 'Membro', min: 0, rewardCode: null, icon: '🛡️' },
  { name: 'Silver', min: 300, rewardCode: 'NIVELPRATA', icon: '🥈' },
  { name: 'Gold VIP', min: 600, rewardCode: 'NIVELOURO', icon: '👑' },
  { name: 'Black', min: 1200, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: "Prioridade Máxima" },
];

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const musicVibes = ['Silêncio Total 🤫', 'Lounge Zen 🧘', 'Sons da Natureza 🌿', 'Deep House 🍸']; 

const REVIEWS_DB = [
  { t: "Profissionalismo raro. Sigilo absoluto e mão muito boa.", a: "Empresário, 42", r: 5 },
  { t: "Tirou todo o stress da semana. Recomendo a Tantra.", a: "Anônimo, 35", r: 5 },
  { t: "Pontual e educado. A massagem é vigorosa.", a: "M.S., 50", r: 5 }
];

// --- UTILS ---
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(5); };
const generateBookingId = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; 
    let result = '';
    for (let i = 0; i < 5; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    return result;
};

// --- COMPONENTES UI OTIMIZADOS ---

const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  const msgs = ["Agenda de hoje quase lotada", "3 clientes agendaram na última hora", "Sigilo e discrição garantidos"];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%msgs.length), 5000); return () => clearInterval(t); }, []);
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-up flex items-center gap-3 bg-[#111] border border-white/10 rounded-full px-4 py-1.5">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
        <span className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">{msgs[idx]}</span>
      </div>
    </div>
  );
};

const LoyaltyCard = ({ data, privacyMode, onTogglePrivacy }) => {
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => data.totalSpent >= l.min);
  const currentLevel = LEVELS[LEVELS.length - 1 - currentLevelIdx];
  const nextLevel = LEVELS[LEVELS.length - 1 - currentLevelIdx + 1];
  const spent = data.totalSpent || 0;
  
  return (
    <div className="glass-card p-6 rounded-[24px] relative overflow-hidden mb-8 group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A84FF] opacity-10 blur-[50px] rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">Status do Membro</p>
          <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            {currentLevel.name} <span className="text-2xl">{currentLevel.icon}</span>
          </h3>
        </div>
        <div className="text-right">
          <button onClick={onTogglePrivacy} className="flex items-center justify-end gap-1.5 mb-1 text-gray-500 hover:text-white transition-colors">
            <span className="text-[10px] font-bold uppercase">Investimento</span>
            {privacyMode ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3" />}
          </button>
          <p className={`text-xl font-mono text-white ${privacyMode ? 'blur-sm select-none opacity-50' : ''} transition-all duration-300`}>
            {formatCurrency(data.totalSpent)}
          </p>
        </div>
      </div>
      
      <div className="relative h-1.5 bg-white/5 rounded-full mb-3 overflow-hidden z-10">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0A84FF] to-[#0056B3] rounded-full" style={{ width: `${nextLevel ? ((spent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100}%` }} />
      </div>
      
      <div className="flex justify-between text-[11px] text-gray-500 font-medium relative z-10">
        <span>Economia: <span className="text-green-500">{formatCurrency(data.totalSaved)}</span></span>
        {nextLevel ? (
           <span>Próximo nível: {formatCurrency(nextLevel.min)}</span>
        ) : <span className="text-[#FFD60A]">Nível Máximo Alcançado</span>}
      </div>
    </div>
  );
};

const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const now = new Date();
  const days = [];
  for(let i=0; i<14; i++) {
      const d = new Date();
      d.setDate(now.getDate() + i);
      days.push(d);
  }
  
  const getDayLabel = (d) => {
      const today = new Date();
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
      if (d.toDateString() === today.toDateString()) return 'HOJE';
      if (d.toDateString() === tomorrow.toDateString()) return 'AMANHÃ';
      return d.toLocaleDateString('pt-BR', {weekday: 'short'}).replace('.','').toUpperCase();
  };

  const isTimeBlocked = (t, d) => {
    if(!d) return true;
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    if (!isToday) return false;
    const [h] = t.split(':').map(Number);
    return h <= now.getHours() + 1; // 1 hour buffer
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4 px-1">
        {days.map((d, i) => {
          const isSel = selectedDate?.toDateString() === d.toDateString();
          const label = getDayLabel(d);
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} 
              className={`flex flex-col items-center justify-center min-w-[70px] h-[80px] rounded-[16px] border transition-all duration-200 
              ${isSel ? 'bg-white text-black border-white shadow-lg scale-[1.02]' : 'bg-[#151517] border-white/5 text-gray-500'}`}>
              <span className={`text-[10px] font-black tracking-wider ${label === 'HOJE' && !isSel ? 'text-[#0A84FF]' : ''}`}>{label}</span>
              <span className="text-2xl font-bold mt-0.5">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      
      {selectedDate && (
        <div className="grid grid-cols-4 gap-2 animate-fade-up">
          {timeSlots.map(t => {
            const blocked = isTimeBlocked(t, selectedDate);
            return (
              <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                className={`py-3 rounded-[12px] text-[14px] font-semibold border transition-all duration-200 
                ${selectedTime === t ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-md' : blocked ? 'bg-transparent border-transparent text-gray-700 decoration-slice line-through opacity-30' : 'bg-[#1C1C1E] border-white/5 text-gray-300 hover:border-gray-600'}`}>
                {t}
              </button>
            )
          })}
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
  const paymentRef = useRef(null);
  const homeRef = useRef(null);

  const scrollTo = (ref) => {
    setTimeout(() => { ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250); 
  };
    
  // State
  const [loyalty, setLoyalty] = useState(() => {
    const saved = localStorage.getItem('thaly_system_v70'); 
    return saved ? JSON.parse(saved) : { savedName: '', avatar: '😎', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], history: [] };
  });

  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
  const [privacyMode, setPrivacyMode] = useState(true);
  const [showFaq, setShowFaq] = useState(false);
  
  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);
  useEffect(() => { localStorage.setItem('thaly_system_v70', JSON.stringify(loyalty)); }, [loyalty]);
  useEffect(() => { if (loyalty.savedName) setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true})); }, [loyalty.savedName]);

  const handleQuickSchedule = () => {
    triggerHaptic();
    setStep(loyalty.savedName ? 'services' : 'identity');
  };

  const handleWhatsApp = () => {
    triggerHaptic();
    if (!selection.service || !selection.location || !selection.date || !selection.time || !selection.paymentMethod) return;
    
    // Cálculo Financeiro Preciso
    let base = selection.service.basePrice;
    if (selection.location.fee) base += selection.location.fee;
    if (selection.upgrade) base += (selection.service.basePrice * 0.5);
    if (selection.useTable) base += 20;
    if (selection.aroma) base += 10;
    
    let discount = 0;
    if (selection.coupon) {
        discount = selection.coupon.type === 'percent' ? (base * (selection.coupon.value/100)) : selection.coupon.value;
    }
    const netBase = base - discount;
    
    let finalTotal = netBase;
    let cardFee = 0;
    if (selection.paymentMethod === 'credit_card') {
       const rate = CARD_RATES[selection.installments] || 0;
       finalTotal = netBase / (1 - rate);
       cardFee = finalTotal - netBase;
    }

    // Atualiza Histórico
    const newTotal = loyalty.totalSpent + selection.service.basePrice;
    setLoyalty(prev => ({ ...prev, savedName: user.name || prev.savedName, totalSpent: newTotal, totalSaved: prev.totalSaved + discount }));

    // Mensagem Formatada Profissional
    const dateStr = selection.date.toLocaleDateString('pt-BR');
    const msg = `Olá, Thaly. Gostaria de confirmar meu agendamento:

📅 *${dateStr} às ${selection.time}*
👤 *${user.name}* (Confirmado +18)

💆‍♂️ *${selection.service.name}*
⏱ Duração: ${selection.upgrade ? '90 min (Extra)' : '60 min'}
📍 Local: ${selection.location.label} ${selection.city ? `(${selection.city})` : ''}
${selection.useTable ? '✅ Levar Maca (+R$20)' : ''}
${selection.aroma ? '🌿 Com Aromaterapia' : ''}
🎵 Vibe: ${selection.music || 'Silêncio'}

💰 *RESUMO PAGAMENTO:*
Valor Serviço: ${formatCurrency(selection.service.basePrice)}
Deslocamento: ${selection.location.fee ? formatCurrency(selection.location.fee) : 'A combinar'}
${selection.upgrade ? `Adicional Tempo: ${formatCurrency(selection.service.basePrice*0.5)}\n` : ''}
${discount > 0 ? `🎫 Desconto: -${formatCurrency(discount)}\n` : ''}
${cardFee > 0 ? `💳 Taxa Cartão: ${formatCurrency(cardFee)}\n` : ''}
${selection.location.id === 'motel' ? `⚠️ Taxa Suíte R$75 (Pagar na saída)\n` : ''}

💎 *TOTAL A PAGAR: ${formatCurrency(finalTotal)}*
Forma: ${selection.paymentMethod === 'pix' ? 'PIX' : selection.paymentMethod === 'cash' ? 'DINHEIRO' : `CARTÃO (${selection.installments}x)`}

Fico no aguardo da confirmação.`;

    window.open(`https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  const calcFinalPrice = () => {
    // Lógica duplicada simplificada para visualização
    let t = selection.service.basePrice;
    if (selection.location?.fee) t += selection.location.fee;
    if (selection.upgrade) t += selection.service.basePrice * 0.5;
    if (selection.useTable) t += 20;
    if (selection.aroma) t += 10;
    if (selection.coupon) t -= (selection.coupon.type === 'percent' ? t * (selection.coupon.value/100) : selection.coupon.value);
    if (selection.paymentMethod === 'credit_card') t = t / (1 - (CARD_RATES[selection.installments] || 0));
    return t;
  };

  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-4 font-sans text-gray-200 bg-[#050505]">
      <style>{globalStyles}</style>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-t-2 border-[#0A84FF] rounded-full animate-spin mb-4"/>
          <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">Carregando Sistema Seguro</p>
        </div>
      ) : (
      <div className="w-full max-w-[430px] bg-[#000] sm:rounded-[32px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-[#222] h-[100dvh] sm:h-[90vh] premium-bg">
        
        {/* HEADER FLUTUANTE */}
        {step !== 'home' && step !== 'success' && (
          <div className="absolute top-0 w-full z-30 glass-header px-5 pt-10 pb-3 flex justify-between items-center">
            <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'home' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10 text-gray-300"><IconBack /></button>
            <span className="text-[15px] font-semibold text-white tracking-tight">{step === 'services' ? 'Escolha a Experiência' : step === 'configure' ? 'Personalizar' : 'Identificação'}</span>
            <div className="w-8" />
          </div>
        )}

        {/* --- TELA: HOME --- */}
        {step === 'home' && (
          <div className="flex-1 p-6 overflow-y-auto pb-32 pt-14" ref={homeRef}>
            <div className="flex justify-between items-center mb-10">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#1C1C1E] border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest">Web App v2.0</span>
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 </div>
                 <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">Olá, {loyalty.savedName ? loyalty.savedName.split(' ')[0] : 'Visitante'}</h1>
                 <p className="text-gray-400 text-sm mt-1">Sua pausa para descompressão começa aqui.</p>
              </div>
              <button onClick={() => setShowFaq(true)} className="w-11 h-11 rounded-full bg-[#1C1C1E] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-500 transition-all"><HelpCircle className="w-5 h-5"/></button>
            </div>

            <LoyaltyCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => setPrivacyMode(!privacyMode)} />
            <LiveStatus />
            
            <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                  <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Últimas Avaliações</h3>
                  <div className="flex text-[#FFD60A] text-xs gap-0.5"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {REVIEWS_DB.map((r, i) => (
                    <div key={i} className="snap-center min-w-[260px] glass-card p-4 rounded-xl border border-white/5">
                        <p className="text-sm text-gray-300 leading-relaxed italic">"{r.t}"</p>
                        <p className="text-[10px] text-gray-500 font-bold mt-3 uppercase tracking-wide text-right">— {r.a}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
              <button onClick={handleQuickSchedule} className="w-full btn-primary h-[60px] rounded-xl font-bold text-[17px] flex justify-center items-center gap-3 shadow-2xl relative overflow-hidden group">
                <span className="relative z-10">AGENDAR SESSÃO</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform"/>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"/>
              </button>
            </div>
          </div>
        )}

        {/* --- TELA: IDENTITY --- */}
        {step === 'identity' && (
           <div className="flex-1 p-6 pt-32 animate-fade-up">
              <h2 className="text-2xl font-bold text-white mb-2">Primeiro Acesso</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">Para segurança mútua e sigilo, preciso saber quem você é. Seus dados ficam salvos apenas neste dispositivo.</p>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider mb-2 block">Como devo te chamar?</label>
                    <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="input-field w-full rounded-xl px-4 py-4 text-lg font-medium outline-none" placeholder="Ex: Ricardo" autoFocus />
                 </div>
                 
                 <div className="space-y-3">
                    <button onClick={() => { triggerHaptic(); setUser(p=>({...p, isAdult:!p.isAdult})) }} className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#151517] border-transparent'}`}>
                        <div className={`w-6 h-6 rounded border flex items-center justify-center ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isAdult && <Check className="w-4 h-4 text-white"/>}</div>
                        <span className="text-sm font-medium text-gray-300">Tenho mais de 18 anos</span>
                    </button>
                    <button onClick={() => { triggerHaptic(); setUser(p=>({...p, isMassagemOk:!p.isMassagemOk})) }} className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${user.isMassagemOk ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#151517] border-transparent'}`}>
                        <div className={`w-6 h-6 rounded border flex items-center justify-center ${user.isMassagemOk ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isMassagemOk && <Check className="w-4 h-4 text-white"/>}</div>
                        <span className="text-sm font-medium text-gray-300">Busco massagem profissional</span>
                    </button>
                 </div>
                 
                 <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => setStep('services')} className="w-full btn-primary h-[56px] rounded-xl font-bold mt-6 disabled:opacity-50">Continuar</button>
              </div>
           </div>
        )}

        {/* --- TELA: SERVICES --- */}
        {step === 'services' && (
          <div className="flex-1 p-5 pt-28 overflow-y-auto pb-10 animate-fade-up">
            {services.map(s => (
              <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} 
                className={`relative glass-card p-5 rounded-[20px] mb-5 active:scale-[0.98] transition-all group overflow-hidden border border-white/5 hover:border-white/20`}>
                
                {s.id === 'masculina' && (
                    <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider z-10">
                        Mais Pedido
                    </div>
                )}
                
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <h3 className="text-xl font-bold text-white">{s.name}</h3>
                </div>
                
                <p className="text-sm text-gray-400 leading-relaxed mb-4 pr-4">{s.description}</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {s.details.map((d,i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-gray-500 font-medium bg-black/20 p-1.5 rounded-lg">
                            <div className="w-1 h-1 bg-[#0A84FF] rounded-full"/> {d}
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-white/5 relative z-10">
                   <div className="flex flex-col">
                       <span className="text-[10px] text-gray-500 uppercase font-bold">Investimento</span>
                       <span className="text-lg font-bold text-[#0A84FF]">{formatCurrency(s.basePrice)}</span>
                   </div>
                   <button className="bg-white/10 p-2.5 rounded-full text-white"><ChevronRight className="w-5 h-5"/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- TELA: CONFIGURE (O CORAÇÃO DO APP) --- */}
        {step === 'configure' && selection.service && (
          <div className="flex-1 p-5 pt-24 overflow-y-auto pb-48 animate-fade-up">
            
            {/* Seção 1: Quando */}
            <section className="mb-8">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">1. Data e Hora</h4>
                <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />
            </section>

            {/* Seção 2: Onde */}
            <section className="mb-8" ref={locationRef}>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">2. Local de Atendimento</h4>
                <div className="space-y-3">
                    {locations.map(l => (
                        <div key={l.id} onClick={() => { triggerHaptic(); setSelection({...selection, location: l, useTable: null}); scrollTo(vibeRef); }}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#151517] border-white/5 hover:border-white/10'}`}>
                            <div className={`p-2.5 rounded-full ${selection.location?.id === l.id ? 'bg-[#0A84FF] text-white' : 'bg-[#222] text-gray-500'}`}>{l.icon}</div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <span className={`font-semibold text-[15px] ${selection.location?.id === l.id ? 'text-white' : 'text-gray-300'}`}>{l.label}</span>
                                    {l.fee > 0 && <span className="text-xs font-bold text-gray-500">+ {formatCurrency(l.fee)}</span>}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{l.sublabel}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Opção de Maca (Condicional) */}
                {selection.location?.allowsTableChoice && (
                    <div className="mt-3 grid grid-cols-2 gap-3 animate-fade-up">
                        <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(vibeRef); }} className={`p-3 rounded-xl border text-xs font-bold transition-all ${selection.useTable === false ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-500'}`}>NA CAMA</button>
                        <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(vibeRef); }} className={`p-3 rounded-xl border text-xs font-bold transition-all ${selection.useTable === true ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-gray-500'}`}>LEVAR MACA (+20)</button>
                    </div>
                )}
            </section>

            {/* Seção 3: Personalização */}
            <section className="mb-8" ref={vibeRef}>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">3. Personalize a Sessão</h4>
                
                <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-3 ml-1">Trilha Sonora</p>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {musicVibes.map(v => (
                            <button key={v} onClick={() => setSelection({...selection, music: v})} className={`px-4 py-2.5 rounded-lg text-xs font-bold border whitespace-nowrap transition-all ${selection.music === v ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#151517] border-white/5 text-gray-500'}`}>{v}</button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <button onClick={() => setSelection({...selection, upgrade: !selection.upgrade})} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#151517] border-white/5'}`}>
                        <div className="text-left">
                            <p className="text-sm font-bold text-gray-200">Extensão de Tempo (+30min)</p>
                            <p className="text-[11px] text-gray-500">Total 1h 30min de sessão</p>
                        </div>
                        <span className="text-sm font-bold text-[#0A84FF]">+ {formatCurrency(selection.service.basePrice * 0.5)}</span>
                    </button>
                    <button onClick={() => setSelection({...selection, aroma: !selection.aroma})} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#151517] border-white/5'}`}>
                        <div className="text-left">
                            <p className="text-sm font-bold text-gray-200">Aromaterapia Relaxante</p>
                            <p className="text-[11px] text-gray-500">Óleos essenciais para acalmar</p>
                        </div>
                        <span className="text-sm font-bold text-[#0A84FF]">+ {formatCurrency(10)}</span>
                    </button>
                </div>
            </section>

            {/* Seção 4: Pagamento */}
            <section ref={paymentRef}>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">4. Pagamento</h4>
                <div className="grid grid-cols-3 gap-2">
                    {['pix', 'cash', 'credit_card'].map(m => (
                        <button key={m} onClick={() => setSelection({...selection, paymentMethod: m})} className={`py-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${selection.paymentMethod === m ? 'bg-white text-black border-white' : 'bg-[#151517] border-white/5 text-gray-500'}`}>
                            {m === 'pix' && <QrCode className="w-5 h-5"/>}
                            {m === 'cash' && <Banknote className="w-5 h-5"/>}
                            {m === 'credit_card' && <CreditCard className="w-5 h-5"/>}
                            <span className="text-[10px] font-black uppercase">{m === 'credit_card' ? 'Cartão' : m === 'cash' ? 'Dinheiro' : 'PIX'}</span>
                        </button>
                    ))}
                </div>
                {selection.paymentMethod === 'credit_card' && (
                    <div className="mt-3 bg-[#1C1C1E] p-3 rounded-xl border border-white/10 animate-fade-up">
                        <select onChange={(e) => setSelection({...selection, installments: Number(e.target.value)})} className="w-full bg-transparent text-white text-sm outline-none">
                            {[1,2,3,4,5,6].map(i => <option key={i} value={i} className="text-black">{i}x Parcelas (c/ taxa da máquina)</option>)}
                        </select>
                    </div>
                )}
            </section>
          </div>
        )}

        {/* --- FOOTER DE AÇÃO (STICKY) --- */}
        {step === 'configure' && selection.location && (
            <div className="absolute bottom-0 w-full z-40">
                <div className="h-12 bg-gradient-to-t from-[#000] to-transparent pointer-events-none"/>
                <div className="bg-[#111] border-t border-white/10 p-5 pb-8 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
                    <div className="flex justify-between items-end mb-4 px-1">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Estimado</p>
                            <p className="text-3xl font-bold text-white tracking-tighter">{formatCurrency(calcFinalPrice())}</p>
                        </div>
                        {selection.location.id === 'motel' && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded font-bold">Taxa Motel à parte</span>}
                    </div>
                    <button 
                        onClick={handleWhatsApp}
                        disabled={!selection.date || !selection.time || !selection.paymentMethod}
                        className="w-full btn-primary h-[60px] rounded-2xl text-[16px] font-bold flex justify-center items-center gap-2 disabled:opacity-50 disabled:grayscale">
                        {(!selection.date || !selection.time) ? 'Selecione Data e Hora' : !selection.paymentMethod ? 'Selecione Pagamento' : <span>Confirmar via WhatsApp <MessageCircle className="w-5 h-5 inline ml-1"/></span>}
                    </button>
                </div>
            </div>
        )}

        {/* --- TELA: SUCESSO --- */}
        {step === 'success' && (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#050505]">
                <div className="w-24 h-24 bg-[#0A84FF] rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(10,132,255,0.4)] animate-bounce">
                    <Check className="w-10 h-10 text-white"/>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Solicitação Enviada!</h2>
                <p className="text-gray-400 text-sm mb-10 max-w-[280px] mx-auto">Você será redirecionado para o WhatsApp para finalizar a confirmação com o Thaly.</p>
                <button onClick={() => setStep('home')} className="px-8 py-3 rounded-full border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors">Voltar ao Início</button>
             </div>
        )}

        {/* --- MODAL FAQ --- */}
        {showFaq && (
             <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-up">
                 <div className="bg-[#1C1C1E] w-full rounded-[30px] p-8 border border-white/10 shadow-2xl">
                     <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Shield className="w-6 h-6 text-[#0A84FF]"/> Termos & Condições</h3>
                     <div className="space-y-4 text-sm text-gray-300">
                        <p>🔒 <strong>Sigilo Absoluto:</strong> O que acontece na sessão, fica na sessão.</p>
                        <p>🚫 <strong>Limites:</strong> Respeito mútuo é inegociável. Qualquer conduta agressiva encerrará o atendimento.</p>
                        <p>🧼 <strong>Higiene:</strong> Tomar banho antes da sessão é obrigatório.</p>
                     </div>
                     <button onClick={() => setShowFaq(false)} className="mt-8 w-full bg-[#333] text-white py-4 rounded-xl font-bold">Entendido</button>
                 </div>
             </div>
        )}

      </div>
      )}
    </div>
  );
}
