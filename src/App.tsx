import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Check, MapPin, Star, ArrowRight, Bed, 
  Home, MessageCircle, Clock, Zap, Ticket, Lock,
  ShieldCheck, Map, Navigation, User, ChevronDown, Flame, AlertCircle, 
  CreditCard, Banknote, QrCode, Calendar as CalendarIcon, X
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO AVANÇADA & MOCK DE DADOS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 12,
  // Simulando banco de dados de horários já ocupados (Formato: "YYYY-MM-DD HH:mm")
  BLOCKED_SLOTS: [
    '2024-02-20 14:00', // Exemplo: dia 20 às 14h já está ocupado
    '2024-02-21 10:00'
  ],
  PRICES: {
    UPGRADE_PCT: 0.5,
    TOUCH: 53, 
    AROMA: 10,
  }
};

const TIME_SLOTS_BASE = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'Massagista de Cueca. O protocolo que você quer. Começa de bruços soltando a musculatura. Vira de frente, óleo morno, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, // em minutos
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    features: ['Massagista de Cueca', 'Corpo a Corpo', 'Finalização']
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico e físico. Ideal para tirar dores nas costas, pernas cansadas e zerar o stress. Toque firme e preciso. Sem foco sexual.', 
    duration: 60, // em minutos
    price: 125, 
    badge: null,
    features: ['Tira Dores', 'Zero Stress', 'Revigorante']
  },
];

const LOCATIONS = [
  { id: 'home', label: 'Na sua Casa / Apto', sub: 'Atendimento no seu conforto', icon: Home, input: true },
  { id: 'hotel', label: 'Hotel / Motel', sub: 'Vou até a sua suíte (Sigilo Total)', icon: Bed, input: true },
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia muito boa e é simpático. A massagem foi simplesmente perfeita.", a: "Tiago (Bela Vista)", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda, jorrei longe.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O óleo quente faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto.", a: "Empresário (Faria Lima)", s: 5 },
];

// ==================================================================================
// 2. ESTILOS (CSS-IN-JS OTIMIZADO)
// ==================================================================================

const globalStyles = `
:root {
  --primary: #0A84FF;
  --bg-deep: #050505;
  --glass: rgba(20, 20, 20, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: var(--bg-deep); scroll-behavior: smooth; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", Helvetica, sans-serif; 
  color: #e5e5e5; background: var(--bg-deep);
  padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden;
}

/* Animations */
@keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }

.animate-enter { animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.pulse-effect { animation: pulseGlow 2s infinite; }

/* Utilities */
.luxury-bg {
  background: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 70%);
  min-height: 100vh;
}
.glass-card { 
  background: var(--glass); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.glass-card:active { transform: scale(0.98); background: rgba(30,30,30,0.8); }
.glass-card.selected {
  border-color: var(--primary); background: rgba(10, 132, 255, 0.08);
  box-shadow: 0 0 0 1px var(--primary), 0 10px 40px rgba(10, 132, 255, 0.1);
}

.primary-btn {
  background: var(--primary); color: white; border: none;
  box-shadow: 0 4px 20px rgba(10, 132, 255, 0.3);
  transition: transform 0.2s;
}
.primary-btn:active { transform: scale(0.96); opacity: 0.9; }
.primary-btn:disabled { background: #222; color: #555; box-shadow: none; cursor: not-allowed; }

.smart-input {
  background: #090909; border: 1px solid #2a2a2a; color: white;
  transition: all 0.3s; border-radius: 12px; width: 100%;
}
.smart-input:focus { border-color: var(--primary); background: #111; outline: none; }

/* Steps Transition */
section { opacity: 0.3; filter: blur(2px); pointer-events: none; transition: all 0.6s ease; scroll-margin-top: 15vh; }
section.active-step { opacity: 1; filter: blur(0); pointer-events: auto; }
`;

// ==================================================================================
// 3. UTILS & HELPERS
// ==================================================================================

const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const vibrate = () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); };

// Gerador de Link do Google Agenda
const generateGoogleCalendarUrl = (serviceName, dateObj, timeStr, locationStr) => {
    if (!dateObj || !timeStr) return '';
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const startDate = new Date(dateObj);
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate);
    endDate.setHours(hours + 1, minutes, 0); // Assume 1h de duração base

    const formatDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `Massagem: ${serviceName} com Thalyson`,
        dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
        details: 'Massagem relaxante agendada via Web App. Lembre-se do pagamento e endereço.',
        location: locationStr || 'Endereço a combinar',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// ==================================================================================
// 4. CUSTOM HOOKS (LÓGICA SEPARADA)
// ==================================================================================

// Hook para gerenciar slots de tempo inteligente
const useTimeSlots = (selectedDate) => {
    return useMemo(() => {
        if (!selectedDate) return [];

        const now = new Date();
        const isToday = selectedDate.getDate() === now.getDate() && 
                        selectedDate.getMonth() === now.getMonth() && 
                        selectedDate.getFullYear() === now.getFullYear();
        
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        return TIME_SLOTS_BASE.map(slot => {
            const [slotHour, slotMinute] = slot.split(':').map(Number);
            
            // 1. Bloqueia horários passados se for hoje
            let isPast = false;
            if (isToday) {
                if (slotHour < currentHour) isPast = true;
                if (slotHour === currentHour && currentMinutes > 0) isPast = true; // Tolerância zero para hora atual
            }

            // 2. Bloqueia horários da "blacklist" (CONFIG.BLOCKED_SLOTS)
            // Formata a data selecionada + slot para comparar com a lista de bloqueados
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const slotIsoCheck = `${year}-${month}-${day} ${slot}`;
            
            const isBooked = CONFIG.BLOCKED_SLOTS.includes(slotIsoCheck);

            return {
                time: slot,
                available: !isPast && !isBooked,
                reason: isBooked ? 'Ocupado' : (isPast ? 'Passou' : 'Livre')
            };
        });
    }, [selectedDate]);
};

// ==================================================================================
// 5. COMPONENTES VISUAIS (ATOMIC DESIGN)
// ==================================================================================

const Toast = ({ msg }) => (
  <div className="fixed top-6 left-1/2 z-[200] bg-[#32D74B] text-black px-6 py-3 rounded-full shadow-[0_10px_40px_rgba(50,215,75,0.4)] flex items-center gap-3 animate-enter font-bold text-sm transform -translate-x-1/2 backdrop-blur-md">
    <Check className="w-5 h-5" strokeWidth={3} /> {msg}
  </div>
);

const SectionHeader = ({ step, title }) => (
    <div className="flex items-center gap-3 mb-5 opacity-90 mt-12">
        <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xs font-bold text-[#0A84FF] shadow-inner">{step}</div>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
    </div>
);

const CouponModal = ({ onClaim }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const used = localStorage.getItem('thaly_coupon_v10');
    if (!used) setTimeout(() => setShow(true), 1200);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-enter">
      <div className="bg-[#111] border border-[#222] w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0A84FF] to-transparent"></div>
        <div className="w-16 h-16 bg-[#0A84FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#0A84FF]/20 shadow-[0_0_30px_rgba(10,132,255,0.15)] pulse-effect">
          <Ticket className="w-8 h-8 text-[#0A84FF]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Presente de Boas-vindas</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">Ganhe desconto exclusivo na sua primeira sessão.</p>
        <div className="bg-[#050505] border border-[#222] border-dashed rounded-xl p-5 mb-8">
          <span className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">Valor do Bônus</span>
          <span className="text-4xl font-bold text-white tracking-tighter">R$ {CONFIG.COUPON_VAL},00</span>
        </div>
        <button onClick={() => { vibrate(); setShow(false); onClaim(); }} className="w-full bg-[#0A84FF] text-white font-bold py-4 rounded-[18px] text-[15px] active:scale-95 transition-transform hover:brightness-110">RESGATAR AGORA</button>
        <button onClick={() => setShow(false)} className="mt-6 text-xs text-gray-600 font-medium hover:text-white transition-colors">Dispensar benefício</button>
      </div>
    </div>
  );
};

// ==================================================================================
// 6. MAIN APP LOGIC
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [hasCoupon, setHasCoupon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Refs para Scroll
  const refs = {
    intro: useRef(null), services: useRef(null), datetime: useRef(null),
    extras: useRef(null), location: useRef(null), payment: useRef(null), checkout: useRef(null)
  };

  // State Unificado
  const [data, setData] = useState({
    name: '', age: '', service: null, date: null, time: null, location: null,
    street: '', number: '', district: '', comp: '',
    extras: { upgrade: false, touch: false, aroma: false }, payment: null 
  });

  const [stage, setStage] = useState(0);

  // Hook de Slots (Inteligência de Horário)
  const availableSlots = useTimeSlots(data.date);

  useEffect(() => { setTimeout(() => setLoading(false), 1200); }, []);

  const scrollTo = (ref) => {
    if (ref?.current) setTimeout(() => ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
  };

  const nextStep = (nextStageLevel, nextRef) => {
    vibrate();
    if(nextStageLevel > stage) setStage(nextStageLevel);
    scrollTo(nextRef);
  };

  // Cálculos Financeiros (Memoized)
  const financials = useMemo(() => {
    const basePrice = data.service ? data.service.price : 0;
    const upgradePrice = data.extras.upgrade ? (basePrice * CONFIG.PRICES.UPGRADE_PCT) : 0;
    const touchPrice = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    const aromaPrice = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    const subTotal = basePrice + upgradePrice + touchPrice + aromaPrice;
    const discount = hasCoupon ? CONFIG.COUPON_VAL : 0;
    const finalTotal = Math.max(0, subTotal - discount);
    return { basePrice, upgradePrice, touchPrice, aromaPrice, subTotal, discount, finalTotal };
  }, [data, hasCoupon]);

  const handleIdentity = () => {
    if(data.name.length < 3 || !data.age) return;
    nextStep(1, refs.services);
  };

  const handlePaymentSelect = (method) => {
    vibrate();
    setData(prev => ({...prev, payment: method}));
    if (method === 'pix') {
        navigator.clipboard.writeText(CONFIG.PIX_KEY);
        setToast("Chave Pix Copiada!");
        setTimeout(() => setToast(null), 3000);
    }
    nextStep(6, refs.checkout);
  };

  const finishOrder = () => {
    // 1. Persistência do Cupom
    if (hasCoupon) localStorage.setItem('thaly_coupon_v10', 'true');

    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';

    // 2. Construção da Mensagem
    let text = `*SOLICITAÇÃO DE AGENDAMENTO* 📝\n`;
    text += `👤 *${data.name}* (${data.age} anos)\n`;
    text += `💆 *${data.service?.name}*\n`;
    text += `📅 ${dateStr} às ${data.time}\n`;
    
    if (data.location) {
        text += `📍 *${data.location.label}*\n`;
        text += `🏠 ${data.street}, ${data.number}\n`;
        text += `🏘️ ${data.district}\n`;
        if(data.comp) text += `🏢 ${data.comp}\n`;
    }

    text += `\n*RESUMO FINANCEIRO:*\n`;
    text += `Sessão: ${formatBRL(financials.basePrice)}\n`;
    if(financials.upgradePrice > 0) text += `Upgrade: ${formatBRL(financials.upgradePrice)}\n`;
    if(financials.touchPrice > 0) text += `Interação: ${formatBRL(financials.touchPrice)}\n`;
    if(financials.aromaPrice > 0) text += `Aromaterapia: ${formatBRL(financials.aromaPrice)}\n`;
    if(financials.discount > 0) text += `Desconto VIP: -${formatBRL(financials.discount)}\n`;

    text += `\n💰 *TOTAL DO SERVIÇO: ${formatBRL(financials.finalTotal)}*\n`;
    text += `🚗 *TAXA DESLOCAMENTO: A CALCULAR*\n`;
    text += `💳 Pagto: ${data.payment ? data.payment.toUpperCase() : 'A COMBINAR'}`;

    // 3. Redirecionamento e Sucesso
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
    setSuccess(true);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#050505] z-[200] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-t-2 border-l-2 border-[#0A84FF] rounded-full animate-spin mb-6"></div>
      <p className="text-[#0A84FF] text-[10px] font-bold tracking-[0.4em] animate-pulse">CARREGANDO</p>
    </div>
  );

  // TELA DE SUCESSO COM GOOGLE CALENDAR
  if (success) {
      const calendarUrl = generateGoogleCalendarUrl(
          data.service?.name, 
          data.date, 
          data.time, 
          `${data.street}, ${data.number} - ${data.district}`
      );

      return (
        <div className="fixed inset-0 bg-black z-[300] flex flex-col items-center justify-center p-8 text-center animate-enter">
            <div className="w-24 h-24 bg-[#32D74B]/10 rounded-full flex items-center justify-center mb-6 border border-[#32D74B]/20 shadow-[0_0_60px_rgba(50,215,75,0.15)]">
                <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Solicitação Enviada!</h2>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto">
                Já recebi seu pedido no WhatsApp. Vou calcular o Uber e te confirmo o valor final por lá.
            </p>
            
            <div className="space-y-3 w-full max-w-xs">
                {/* BOTÃO GOOGLE AGENDA */}
                <a href={calendarUrl} target="_blank" rel="noreferrer" className="w-full bg-[#1a1a1a] border border-[#333] text-white py-4 rounded-[18px] font-bold hover:bg-[#222] flex items-center justify-center gap-2 transition-colors">
                    <CalendarIcon size={18} /> Adicionar na Agenda
                </a>

                <button onClick={() => window.location.reload()} className="w-full text-gray-600 py-3 text-sm font-medium hover:text-white">
                    Fazer novo agendamento
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="luxury-bg min-h-screen text-gray-200 pb-48 selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>
      
      {toast && <Toast msg={toast} />}
      <CouponModal onClaim={() => setHasCoupon(true)} />
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex justify-between items-center transition-all">
        <span className="font-bold text-white tracking-tight text-lg">Thaly<span className="text-[#0A84FF]">Massagens</span></span>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#111] rounded-full border border-[#222]">
            <Lock className="w-3 h-3 text-[#0A84FF]" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Ambiente Seguro</span>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-32 px-5">

        {/* 1. PERFIL */}
        <section ref={refs.intro} className="active-step">
          <h1 className="text-4xl font-bold text-white mb-2 leading-[0.9] tracking-tighter">Relaxamento<br/><span className="text-[#333]">Superior.</span></h1>
          <p className="text-gray-500 text-sm mb-8 mt-4 leading-relaxed max-w-[80%]">Atendimento exclusivo, discreto e no seu conforto. O App não salva seus dados.</p>

          <div className="glass-card p-6 rounded-[24px]">
            <div className="grid grid-cols-10 gap-3">
                <div className="col-span-7">
                    <label className="text-[9px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Seu Nome</label>
                    <input 
                      value={data.name} onChange={e => setData({...data, name: e.target.value})}
                      placeholder="Como quer ser chamado?" className="smart-input p-4"
                    />
                </div>
                <div className="col-span-3">
                    <label className="text-[9px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Idade</label>
                    <input 
                      type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})}
                      placeholder="30" className="smart-input p-4 text-center"
                    />
                </div>
            </div>
            {stage === 0 && (
                <button 
                  disabled={data.name.length < 3 || !data.age}
                  onClick={handleIdentity}
                  className="primary-btn w-full py-4 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 mt-4"
                >
                  Iniciar Agendamento <ArrowRight size={18}/>
                </button>
            )}
          </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={stage >= 1 ? 'active-step' : ''}>
            <SectionHeader step="1" title="Escolha a Experiência" />
            <div className="space-y-4">
                {SERVICES.map(s => {
                    const active = data.service?.id === s.id;
                    return (
                        <button key={s.id} onClick={() => { setData(prev => ({...prev, service: s})); nextStep(2, refs.datetime); }}
                            className={`w-full p-6 rounded-[24px] text-left relative glass-card group ${active ? 'selected' : ''}`}
                        >
                            {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-bold px-3 py-1.5 rounded-bl-xl shadow-[0_4px_10px_rgba(255,214,10,0.2)]">{s.badge}</div>}
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-white group-hover:text-[#0A84FF] transition-colors">{s.name}</h3>
                                <span className="text-[#0A84FF] font-bold bg-[#0A84FF]/10 px-2 py-1 rounded-lg text-sm border border-[#0A84FF]/20">{formatBRL(s.price)}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">{s.short}</p>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4 font-medium">{s.desc}</p>
                            <div className="flex gap-2 flex-wrap">
                                {s.features.map(f => <span key={f} className="text-[10px] bg-[#1a1a1a] text-gray-500 px-2.5 py-1 rounded-md border border-[#333] font-bold">{f}</span>)}
                            </div>
                        </button>
                    )
                })}
            </div>
        </section>

        {/* 3. DATA E HORA (COM BLOQUEIO INTELIGENTE) */}
        <section ref={refs.datetime} className={stage >= 2 ? 'active-step' : ''}>
            <SectionHeader step="2" title="Melhor Data" />
            
            <div className="glass-card p-5 rounded-[26px]">
                {/* CALENDÁRIO HORIZONTAL */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2 -mx-2 px-2">
                    {[...Array(14)].map((_, i) => { // Aumentado para 14 dias
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && data.date.toDateString() === d.toDateString();
                        
                        return (
                            <button key={i} onClick={() => { vibrate(); setData(prev => ({...prev, date: d, time: null})); }}
                                className={`min-w-[68px] h-[80px] rounded-[18px] flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#151515] border-[#222] text-gray-500 hover:border-gray-700'}`}
                            >
                                <span className="text-[9px] uppercase font-bold mb-1 opacity-80">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold tracking-tight">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                
                {/* GRADE DE HORÁRIOS */}
                <div className={`transition-all duration-500 overflow-hidden ${data.date ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-4 pl-1">Horários Disponíveis</p>
                    <div className="grid grid-cols-4 gap-2.5">
                        {availableSlots.map(({ time, available, reason }) => (
                            <button key={time} 
                                disabled={!available}
                                onClick={() => { setData(prev => ({...prev, time})); nextStep(3, refs.extras); }}
                                className={`py-3 rounded-[12px] text-xs font-bold border transition-all relative
                                    ${!available ? 'opacity-30 cursor-not-allowed bg-[#111] border-transparent' : 
                                      data.time === time ? 'bg-white text-black border-white shadow-lg scale-105 z-10' : 
                                      'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-gray-500 hover:bg-[#222]'}`}
                            >
                                {time}
                                {!available && <span className="absolute inset-0 flex items-center justify-center text-[8px] uppercase tracking-widest text-red-500 font-black rotate-[-15deg] bg-black/50 rounded-[12px]">{reason}</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={stage >= 3 ? 'active-step' : ''}>
            <SectionHeader step="3" title="Turbinar Sessão" />
            <div className="glass-card p-0 rounded-[24px] overflow-hidden divide-y divide-[#222]">
                    {[
                        { key: 'upgrade', label: '+30 Minutos', sub: 'Estender a duração', price: data.service ? data.service.price * CONFIG.PRICES.UPGRADE_PCT : 0, color: 'text-[#0A84FF]', bg: 'bg-[#0A84FF]' },
                        { key: 'touch', label: 'Interação / Toque', sub: 'Reciprocidade permitida', price: CONFIG.PRICES.TOUCH, color: 'text-[#FF375F]', bg: 'bg-[#FF375F]' },
                        { key: 'aroma', label: 'Aromaterapia', sub: 'Óleos essenciais no ambiente', price: CONFIG.PRICES.AROMA, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]' }
                    ].map(extra => (
                        <button key={extra.key} onClick={() => { vibrate(); setData(prev => ({...prev, extras: {...prev.extras, [extra.key]: !prev.extras[extra.key]}})); }}
                            className={`w-full p-5 flex justify-between items-center transition-all hover:bg-white/5 ${data.extras[extra.key] ? 'bg-white/5' : ''}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${data.extras[extra.key] ? `${extra.bg} border-transparent` : 'border-[#444] bg-[#111]'}`}>
                                    {data.extras[extra.key] && <Check size={14} className="text-white"/>}
                                </div>
                                <div className="text-left">
                                    <span className="block text-[15px] font-bold text-white mb-0.5">{extra.label}</span>
                                    <span className="text-[11px] text-gray-500">{extra.sub}</span>
                                </div>
                            </div>
                            <span className={`text-sm font-bold ${extra.color}`}>+ {formatBRL(extra.price)}</span>
                        </button>
                    ))}

                    <button onClick={() => nextStep(4, refs.location)} className="w-full text-center py-4 text-xs text-gray-500 font-bold uppercase tracking-widest hover:text-white hover:bg-[#222] transition-colors">
                        Pular Extras
                    </button>
            </div>
        </section>

        {/* 5. LOCALIZAÇÃO (SIMPLIFICADA E LIMPA) */}
        <section ref={refs.location} className={stage >= 4 ? 'active-step' : ''}>
            <SectionHeader step="4" title="Local de Atendimento" />
            <div className="space-y-3 pb-8">
                {LOCATIONS.map(loc => {
                    const isSel = data.location?.id === loc.id;
                    return (
                        <div key={loc.id} className="transition-all duration-300">
                            <button onClick={() => { setData(prev => ({...prev, location: loc, street:'', number:'', district:'', comp:''})); }}
                                className={`w-full p-4 rounded-[22px] border flex items-center justify-between transition-all text-left ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-card border-transparent hover:border-[#333]'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#1a1a1a] text-gray-500'}`}><loc.icon size={18} /></div>
                                    <div>
                                        <div className="font-bold text-white text-[15px]">{loc.label}</div>
                                        <div className="text-[11px] text-gray-500 mt-0.5">{loc.sub}</div>
                                    </div>
                                </div>
                            </button>

                            {isSel && loc.input && (
                                <div className="mt-4 pl-4 space-y-3 animate-enter border-l-2 border-[#222] ml-5 pr-1 py-2">
                                    <input value={data.street} onChange={e => setData(prev => ({...prev, street: e.target.value}))} placeholder="Nome da Rua / Avenida" className="smart-input p-3.5" />
                                    <div className="flex gap-3">
                                        <div className="w-1/3">
                                            <input type="tel" value={data.number} onChange={e => setData(prev => ({...prev, number: e.target.value}))} placeholder="Nº" className="smart-input p-3.5 text-center" />
                                        </div>
                                        <div className="flex-1">
                                            <input value={data.district} onChange={e => setData(prev => ({...prev, district: e.target.value}))} placeholder="Bairro" className="smart-input p-3.5" />
                                        </div>
                                    </div>
                                    <input value={data.comp} onChange={e => setData(prev => ({...prev, comp: e.target.value}))} placeholder="Complemento (Opcional)" className="smart-input p-3.5" />
                                    
                                    <button 
                                        disabled={!data.street || !data.number || !data.district}
                                        onClick={() => nextStep(5, refs.payment)} 
                                        className="w-full bg-[#1a1a1a] border border-[#333] text-white py-3.5 rounded-xl text-xs font-bold mt-2 hover:bg-[#222] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Confirmar Endereço <Check size={14}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={stage >= 5 ? 'active-step' : ''}>
            <SectionHeader step="5" title="Como prefere pagar?" />
            <div className="glass-card p-3 rounded-[24px] grid grid-cols-3 gap-2">
                {[
                    { id: 'pix', label: 'Pix', icon: QrCode, color: 'text-[#0A84FF]' },
                    { id: 'dinheiro', label: 'Dinheiro', icon: Banknote, color: 'text-[#32D74B]' },
                    { id: 'cartao', label: 'Cartão', icon: CreditCard, color: 'text-[#FFD60A]' },
                ].map(method => (
                    <button key={method.id} onClick={() => handlePaymentSelect(method.id)} 
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-[18px] border transition-all ${data.payment === method.id ? `bg-[${method.color}]/10 border-current shadow-lg` : 'border-[#222] hover:bg-[#1a1a1a]'}`}
                        style={{ borderColor: data.payment === method.id ? 'currentColor' : '#222', color: data.payment === method.id ? 'white' : '#666' }}
                    >
                        <method.icon className={`w-6 h-6 ${method.color}`} />
                        <span className="text-xs font-bold text-white">{method.label}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* 7. CHECKOUT FLUTUANTE */}
      {stage >= 6 && (
        <div ref={refs.checkout} className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="h-32 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            
            <div className="bg-[#0e0e0e] border-t border-[#222] p-6 pb-8 rounded-t-[32px] shadow-[0_-10px_50px_rgba(0,0,0,0.8)] max-w-md mx-auto relative">
                <div className="flex justify-between items-end mb-5 px-1">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Total Estimado</span>
                        <div className="flex items-baseline gap-2.5">
                             {hasCoupon && <span className="line-through text-gray-600 font-medium text-sm">{formatBRL(financials.subTotal)}</span>}
                             <span className="text-3xl font-bold text-white tracking-tighter">{formatBRL(financials.finalTotal)}</span>
                             {hasCoupon && <span className="text-[10px] text-[#0A84FF] bg-[#0A84FF]/10 px-2 py-1 rounded font-bold border border-[#0A84FF]/20">CUPOM APLICADO</span>}
                        </div>
                    </div>
                </div>
                
                <button onClick={finishOrder} className="w-full primary-btn h-14 rounded-[20px] font-bold text-[16px] flex items-center justify-center gap-3">
                    <MessageCircle size={20} fill="currentColor"/>
                    FINALIZAR PEDIDO
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
