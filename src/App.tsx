import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, MapPin, Star, ArrowRight, Bed, 
  Home, MessageCircle, Clock, Zap, Ticket, Lock,
  ShieldCheck, Map, Navigation, User, ChevronDown, Flame, AlertCircle, 
  CreditCard, Banknote, QrCode, Copy, Wind, Calendar as CalendarIcon, X
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO (Business Config)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 12,
  PRICES: {
    UPGRADE_PCT: 0.5, // 50% do valor base
    TOUCH: 53, 
    AROMA: 10,
  },
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send",
    GOOGLE_CALENDAR: "https://calendar.google.com/calendar/render"
  }
};

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'Massagista de Cueca. O protocolo premium. Inicia de bruços soltando a musculatura, vira de frente com óleo morno, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    features: ['Massagista de Cueca', 'Corpo a Corpo', 'Finalização']
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico. Ideal para remover dores lombares, pernas cansadas e zerar o stress. Toque firme e preciso.', 
    duration: 60, 
    price: 125, 
    badge: null,
    features: ['Tira Dores', 'Zero Stress', 'Revigorante']
  },
];

const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const LOCATIONS = [
  { id: 'home', label: 'Na sua Casa / Apto', sub: 'Atendimento no seu conforto', icon: Home, input: true },
  { id: 'hotel', label: 'Hotel / Motel', sub: 'Vou até a sua suíte (Sigilo Total)', icon: Bed, input: true },
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita.", a: "Tiago (Bela Vista)", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí renovado. A técnica é real.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. Óleo quente top.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra e valeu cada centavo.", a: "M. (Jardins)", s: 5 },
];

// ==================================================================================
// 2. UTILITÁRIOS (Helpers)
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  
  vibrate: () => { if (navigator.vibrate) navigator.vibrate(10); },
  
  shuffleArray: (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  },

  // Bloqueio de Horário Passado (Lógica Robusta)
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Converte selectedDate (pode vir como string do JSON)
    const sel = new Date(selectedDate);
    sel.setHours(0,0,0,0);

    // Passado = Bloqueado
    if (sel < today) return true;
    // Futuro = Liberado
    if (sel > today) return false;

    // Hoje: verifica hora
    const [hours] = timeString.split(':').map(Number);
    const currentHour = now.getHours();
    return hours <= currentHour;
  },

  // Link Google Calendar
  generateCalendarLink: (data) => {
    if (!data.date || !data.time || !data.service) return '';
    const [h] = data.time.split(':');
    const start = new Date(data.date);
    start.setHours(parseInt(h));
    const end = new Date(start);
    const duration = data.service.duration + (data.extras.upgrade ? 30 : 0);
    end.setMinutes(end.getMinutes() + duration);
    const formatGCalDate = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Massagem Thalyson - ${data.service.name}`,
      dates: `${formatGCalDate(start)}/${formatGCalDate(end)}`,
      details: `Serviço: ${data.service.name}\nLocal: ${data.location?.label}\nObs: Pagamento no local.`,
      location: data.location?.label === 'home' ? 'Meu Endereço' : 'Hotel/Motel',
    });
    return `${CONFIG.URLS.GOOGLE_CALENDAR}?${params.toString()}`;
  },

  getGreeting: () => {
    const h = new Date().getHours();
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  }
};

// ==================================================================================
// 3. ESTILOS GLOBAIS (CSS-in-JS)
// ==================================================================================

const globalStyles = `
/* --- CORE --- */
:root { --primary: #0A84FF; --bg-glass: rgba(14, 14, 14, 0.7); }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; color-scheme: dark; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Helvetica, sans-serif; 
  letter-spacing: -0.02em; color: #e5e5e5; background: #050505;
  padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden;
}

/* --- ANIMATIONS --- */
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.animate-enter { animation: fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.slide-up-enter { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* --- COMPONENTS --- */
.luxury-bg {
  background: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 70%);
  min-height: 100vh;
}
.glass-card { 
  background: #0e0e0e; border: 1px solid #222; 
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.glass-card:active { transform: scale(0.98); background: #151515; }
.glass-card.selected {
  border-color: var(--primary); background: rgba(10, 132, 255, 0.08);
  box-shadow: 0 0 0 1px var(--primary), 0 10px 40px rgba(10, 132, 255, 0.1);
}
.smart-input {
  background: #090909; border: 1px solid #2a2a2a; color: white;
  transition: all 0.3s ease; font-size: 16px; border-radius: 12px; width: 100%;
}
.smart-input:focus { border-color: var(--primary); background: #111; outline: none; }

.section-blur { opacity: 0.3; filter: blur(2px); pointer-events: none; transition: all 0.5s ease; }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; }

/* --- SCROLLBAR HIDE --- */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

// ==================================================================================
// 4. SUB-COMPONENTES
// ==================================================================================

const ReviewsTicker = () => {
  const [reviews, setReviews] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => { setReviews(Utils.shuffleArray([...REVIEWS_DB])); }, []);
  useEffect(() => { 
    if (reviews.length === 0) return;
    const t = setInterval(() => setIdx(i => (i+1)%reviews.length), 5000); 
    return () => clearInterval(t); 
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
      <div className="mb-6 p-4 bg-[#0e0e0e] border border-[#222] rounded-[20px] flex items-start gap-4 animate-enter">
          <div className="flex-1">
              <div className="flex gap-0.5 text-[#FFD60A] mb-2">
                  {[...Array(5)].map((_,i) => <Star key={i} size={12} fill="currentColor" strokeWidth={0} />)}
              </div>
              <p className="text-[13px] text-gray-300 italic leading-snug mb-2">"{reviews[idx].t}"</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide text-right">— {reviews[idx].a}</p>
          </div>
      </div>
  )
}

const SuccessScreen = ({ data, financials, whatsappLink, onCopy }) => {
  const calendarLink = Utils.generateCalendarLink(data);
  
  return (
    <div className="fixed inset-0 z-[300] bg-[#050505] flex flex-col items-center justify-center p-6 text-center animate-enter overflow-y-auto">
      <div className="w-24 h-24 bg-gradient-to-tr from-[#32D74B] to-[#28a745] rounded-full flex items-center justify-center mb-6 shadow-[0_0_80px_rgba(50,215,75,0.3)]">
        <Check className="w-10 h-10 text-white" strokeWidth={4} />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-2">Solicitação Pronta!</h2>
      <p className="text-gray-400 mb-8 leading-relaxed max-w-xs mx-auto text-sm">
        Clique abaixo para enviar os detalhes no WhatsApp. Se não abrir, use o botão "Copiar".
      </p>

      {/* Botões de Ação */}
      <a href={whatsappLink} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm bg-[#25D366] text-black font-bold py-4 rounded-xl mb-3 flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-900/20">
         <MessageCircle size={20} /> Enviar no WhatsApp
      </a>
      
      <button onClick={onCopy} 
         className="w-full max-w-sm bg-[#1a1a1a] border border-[#333] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#222] mb-6">
         <Copy size={20} /> Copiar Texto
      </button>

      {/* Card Calendar */}
      <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-2xl p-4 mb-6">
         <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#222]">
            <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center">
               <CalendarIcon className="text-white w-5 h-5" />
            </div>
            <div className="text-left">
               <p className="text-white font-bold text-sm">Adicionar Lembrete</p>
               <p className="text-gray-500 text-xs">Google Agenda</p>
            </div>
         </div>
         <a href={calendarLink} target="_blank" rel="noreferrer" 
            className="flex items-center justify-center gap-2 w-full text-[#0A84FF] font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
             Salvar Data <ArrowRight size={12} />
         </a>
      </div>

      <button onClick={() => { localStorage.removeItem('thaly_booking_state'); window.location.reload(); }} className="text-gray-600 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
        Novo Agendamento
      </button>
    </div>
  );
};

// ==================================================================================
// 5. APLICAÇÃO PRINCIPAL (Core Logic + UI)
// ==================================================================================

export default function App() {
  // 1. STATE PERSISTENTE (Lazy Initializer)
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('thaly_booking_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restaura datas de string para Objeto Date
        if (parsed.date) parsed.date = new Date(parsed.date);
        return parsed;
      }
    } catch (e) { console.error("Erro ao carregar storage", e); }
    
    return {
      name: '', age: '', service: null, date: null, time: null, location: null,
      street: '', number: '', district: '', comp: '',
      extras: { upgrade: false, touch: false, aroma: false }, payment: null 
    };
  });

  const [stage, setStage] = useState(0);
  const [hasCoupon, setHasCoupon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Efeito: Salvar no LocalStorage a cada mudança
  useEffect(() => {
    localStorage.setItem('thaly_booking_state', JSON.stringify(data));
  }, [data]);

  useEffect(() => { setTimeout(() => setLoading(false), 1000); }, []);

  // Refs para Scroll
  const refs = {
    intro: useRef(null), services: useRef(null), datetime: useRef(null),
    extras: useRef(null), location: useRef(null), payment: useRef(null), checkout: useRef(null)
  };

  // Cálculos Financeiros (Memoized)
  const financials = useMemo(() => {
    const basePrice = data.service ? data.service.price : 0;
    const upgradePrice = data.extras.upgrade ? (basePrice * CONFIG.PRICES.UPGRADE_PCT) : 0;
    const touchPrice = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    const aromaPrice = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    
    const subTotal = basePrice + upgradePrice + touchPrice + aromaPrice;
    const discount = hasCoupon ? CONFIG.COUPON_VAL : 0;
    
    return { 
      basePrice, upgradePrice, touchPrice, aromaPrice, 
      subTotal, discount, 
      finalTotal: Math.max(0, subTotal - discount) 
    };
  }, [data.service, data.extras, hasCoupon]);

  // Ações
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
        setTimeout(() => { ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
    }
  };

  const advanceStage = (nextStage, nextRef) => {
    Utils.vibrate();
    if(nextStage > stage) setStage(nextStage);
    scrollToRef(nextRef);
  };

  const handleTimeSelect = (t) => {
    if (Utils.isTimeBlocked(data.date, t)) return;
    setData({...data, time: t});
    advanceStage(3, refs.extras);
  };

  const generateMessage = () => {
    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';
    let text = `${Utils.getGreeting()} Thalyson! 🌿\nGostaria de agendar:\n\n`;
    text += `👤 *${data.name}* (${data.age} anos)\n`;
    text += `💆 *${data.service?.name}*\n`;
    text += `📅 *${dateStr} às ${data.time}*\n`;
    
    if (data.location) {
        text += `📍 *${data.location.label}*\n`;
        text += `🏠 ${data.street}, ${data.number} - ${data.district}\n`;
        if(data.comp) text += `🏢 ${data.comp}\n`;
    }

    text += `\n*Financeiro:*\n`;
    text += `Valor Sessão: ${Utils.formatBRL(financials.basePrice)}\n`;
    if(financials.upgradePrice > 0) text += `+ Upgrade 30min\n`;
    if(financials.touchPrice > 0) text += `+ Interação\n`;
    if(financials.aromaPrice > 0) text += `+ Aromaterapia\n`;
    if(financials.discount > 0) text += `🎟️ Desconto VIP: -${Utils.formatBRL(financials.discount)}\n`;

    text += `\n💰 *Total Estimado: ${Utils.formatBRL(financials.finalTotal)}*\n`;
    text += `🚗 *Taxa Deslocamento: A calcular*\n`;
    text += `💳 Pagamento: ${data.payment ? data.payment.toUpperCase() : 'A combinar'}`;
    
    return text;
  };

  const finishOrder = () => {
    if (hasCoupon) localStorage.setItem('thaly_coupon_redeemed', 'true');
    const text = generateMessage();
    const link = `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
    setWhatsappLink(link);
    setSuccess(true);
    window.open(link, '_blank');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMessage());
    setToast('Texto copiado para a área de transferência!');
    setTimeout(() => setToast(null), 3000);
  };

  // RENDERIZAÇÃO
  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-t-2 border-[#0A84FF] rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] animate-pulse">Carregando...</p>
    </div>
  );

  if (success) return <SuccessScreen data={data} financials={financials} whatsappLink={whatsappLink} onCopy={handleCopy} />;

  return (
    <div className="luxury-bg min-h-screen text-gray-200 pb-48 selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex justify-between items-center shadow-lg">
        <div className="flex flex-col">
          <span className="font-bold text-white tracking-tight text-lg">Thalyson</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Massoterapia & Tantra</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#111] rounded-full border border-[#222]">
          <Lock className="w-3 h-3 text-[#32D74B]" />
          <span className="text-[9px] font-bold text-gray-400 uppercase">Sigilo</span>
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-[#32D74B] text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm animate-enter w-max">
            <Check size={16} strokeWidth={3}/> {toast}
        </div>
      )}

      {/* CUPOM FLUTUANTE (Gamification) */}
      {!hasCoupon && !localStorage.getItem('thaly_coupon_redeemed') && stage > 0 && (
         <button onClick={() => { setHasCoupon(true); setToast('Desconto de R$ 12 aplicado!'); Utils.vibrate(); }} 
            className="fixed bottom-24 right-4 z-40 bg-[#0A84FF] text-white p-4 rounded-full shadow-[0_0_20px_rgba(10,132,255,0.5)] animate-bounce">
            <Ticket size={24} />
         </button>
      )}

      <main className="max-w-md mx-auto pt-28 px-5">
        
        {/* 1. PERFIL & INPUTS */}
        <section ref={refs.intro} className={`transition-all duration-700 ${stage >= 0 ? 'section-active' : 'section-blur'}`}>
          <div className="mb-6">
             <h1 className="text-4xl font-extrabold text-white leading-[0.9] tracking-tighter mb-2">
               Relaxamento<br/><span className="text-[#333]">Premium.</span>
             </h1>
             <p className="text-gray-500 text-sm max-w-[280px] leading-relaxed mb-4">
               Atendimento exclusivo em Santa Fé do Sul e região. Sem pagamento antecipado.
             </p>
          </div>

          <ReviewsTicker />

          <div className="glass-card p-6 rounded-[28px] relative overflow-hidden group">
            <div className="grid grid-cols-10 gap-3">
                <div className="col-span-7">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">Seu Nome</label>
                    <input 
                      value={data.name} onChange={e => setData({...data, name: e.target.value})}
                      placeholder="Nome ou Apelido" className="smart-input p-4"
                    />
                </div>
                <div className="col-span-3">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block ml-1">Idade</label>
                    <input 
                      type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})}
                      placeholder="30" className="smart-input p-4 text-center"
                    />
                </div>
            </div>
            {data.name.length > 2 && data.age && stage === 0 && (
                <button onClick={() => advanceStage(1, refs.services)} className="w-full mt-4 bg-[#0A84FF] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#007aff] transition-colors shadow-[0_0_20px_rgba(10,132,255,0.2)]">
                   Iniciar Agendamento <ArrowRight size={18}/>
                </button>
            )}
          </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`transition-all duration-700 ${stage >= 1 ? 'section-active' : 'section-blur'}`}>
            <div className="flex items-center gap-3 mb-5 opacity-90 mt-10">
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xs font-bold text-white shadow-inner">1</div>
                <h2 className="text-xl font-bold text-white tracking-tight">Experiência</h2>
            </div>
            
            <div className="space-y-4">
                {SERVICES.map(s => {
                    const isActive = data.service?.id === s.id;
                    return (
                        <div key={s.id} onClick={() => { setData({...data, service: s}); advanceStage(2, refs.datetime); }}
                            className={`glass-card p-6 rounded-[24px] cursor-pointer relative ${isActive ? 'selected' : ''}`}>
                            {s.badge && <span className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-extrabold px-3 py-1 rounded-bl-xl tracking-wide">{s.badge}</span>}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className={`text-lg font-bold ${isActive ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3>
                                <span className="text-white font-bold bg-[#333] px-2 py-1 rounded-lg text-xs">{Utils.formatBRL(s.price)}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-bold uppercase mb-3">{s.short}</p>
                            <p className="text-sm text-gray-300 leading-relaxed mb-4">{s.desc}</p>
                            <div className="flex gap-2 flex-wrap">
                                {s.features.map(f => <span key={f} className="text-[10px] bg-black/40 text-gray-400 px-2 py-1 rounded border border-white/5">{f}</span>)}
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`transition-all duration-700 ${stage >= 2 ? 'section-active' : 'section-blur'}`}>
            <div className="flex items-center gap-3 mb-5 opacity-90 mt-10">
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xs font-bold text-white shadow-inner">2</div>
                <h2 className="text-xl font-bold text-white tracking-tight">Data & Hora</h2>
            </div>

            <div className="glass-card p-5 rounded-[28px]">
                {/* Scroll Dias */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSelected = data.date && new Date(data.date).getDate() === d.getDate();
                        const isToday = i === 0;
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }}
                                className={`snap-center min-w-[70px] h-[85px] rounded-[20px] flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#151515] border-[#222] text-gray-500 hover:border-gray-600'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{isToday ? 'HOJE' : d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold tracking-tighter">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                
                {/* Grid Horas */}
                <div className={`grid grid-cols-4 gap-2 transition-all duration-500 ${data.date ? 'opacity-100 mt-4' : 'opacity-20 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => {
                        const isBlocked = Utils.isTimeBlocked(data.date, t);
                        const isSelected = data.time === t;
                        return (
                            <button key={t} disabled={isBlocked} onClick={() => handleTimeSelect(t)}
                                className={`py-3 rounded-[14px] text-xs font-bold border transition-all relative overflow-hidden
                                    ${isSelected ? 'bg-white text-black border-white shadow-md' : 
                                      isBlocked ? 'bg-[#111] text-[#333] border-transparent cursor-not-allowed decoration-slice' : 
                                      'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:border-gray-500'}`}>
                                {isBlocked && <div className="absolute inset-0 flex items-center justify-center"><div className="w-[120%] h-[1px] bg-[#333] rotate-45"></div></div>}
                                {t}
                            </button>
                        )
                    })}
                </div>
                {data.date && Utils.isTimeBlocked(data.date, '23:00') && (
                    <p className="text-center text-[10px] text-red-500/50 mt-4 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <AlertCircle size={10}/> Horários passados bloqueados
                    </p>
                )}
            </div>
        </section>

        {/* 4. PERSONALIZAR */}
        <section ref={refs.extras} className={`transition-all duration-700 ${stage >= 3 ? 'section-active' : 'section-blur'}`}>
            <div className="flex items-center gap-3 mb-5 opacity-90 mt-10">
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xs font-bold text-white shadow-inner">3</div>
                <h2 className="text-xl font-bold text-white tracking-tight">Extras</h2>
            </div>

            <div className="glass-card rounded-[24px] overflow-hidden divide-y divide-[#222]">
                 {/* Upgrade Tempo */}
                 <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, upgrade: !data.extras.upgrade}}); }}
                      className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${data.extras.upgrade ? 'bg-[#0A84FF]/10' : 'hover:bg-[#1a1a1a]'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${data.extras.upgrade ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444] bg-[#111]'}`}>
                           {data.extras.upgrade && <Check size={14} className="text-white"/>}
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">+30 Minutos</p>
                            <p className="text-[11px] text-gray-500">Mais tempo de sessão</p>
                        </div>
                     </div>
                     <span className="text-[#0A84FF] font-bold text-xs">+ {Utils.formatBRL(data.service ? data.service.price * CONFIG.PRICES.UPGRADE_PCT : 0)}</span>
                 </div>

                 {/* Upgrade Touch */}
                 <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, touch: !data.extras.touch}}); }}
                      className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${data.extras.touch ? 'bg-[#FF375F]/10' : 'hover:bg-[#1a1a1a]'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${data.extras.touch ? 'bg-[#FF375F] border-[#FF375F]' : 'border-[#444] bg-[#111]'}`}>
                           {data.extras.touch && <Flame size={14} className="text-white"/>}
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">Interação / Toque</p>
                            <p className="text-[11px] text-gray-500">Liberdade total</p>
                        </div>
                     </div>
                     <span className="text-[#FF375F] font-bold text-xs">+ {Utils.formatBRL(CONFIG.PRICES.TOUCH)}</span>
                 </div>

                 {/* Upgrade Aroma */}
                 <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, aroma: !data.extras.aroma}}); }}
                      className={`p-5 flex justify-between items-center cursor-pointer transition-colors ${data.extras.aroma ? 'bg-[#32D74B]/10' : 'hover:bg-[#1a1a1a]'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${data.extras.aroma ? 'bg-[#32D74B] border-[#32D74B]' : 'border-[#444] bg-[#111]'}`}>
                           {data.extras.aroma && <Wind size={14} className="text-white"/>}
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">Aromaterapia</p>
                            <p className="text-[11px] text-gray-500">Óleos essenciais</p>
                        </div>
                     </div>
                     <span className="text-[#32D74B] font-bold text-xs">+ {Utils.formatBRL(CONFIG.PRICES.AROMA)}</span>
                 </div>

                 <button onClick={() => advanceStage(4, refs.location)} className="w-full py-4 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-white hover:bg-[#222] transition-colors">
                     Confirmar Extras
                 </button>
            </div>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section ref={refs.location} className={`transition-all duration-700 ${stage >= 4 ? 'section-active' : 'section-blur'}`}>
            <div className="flex items-center gap-3 mb-5 opacity-90 mt-10">
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xs font-bold text-white shadow-inner">4</div>
                <h2 className="text-xl font-bold text-white tracking-tight">Onde?</h2>
            </div>

            <div className="space-y-3">
                {LOCATIONS.map(loc => {
                    const isSel = data.location?.id === loc.id;
                    return (
                        <div key={loc.id}>
                            <div onClick={() => { setData({...data, location: loc}); }}
                                className={`p-4 rounded-[20px] border flex items-center gap-4 cursor-pointer transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-card border-transparent'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#1a1a1a] text-gray-500'}`}>
                                    <loc.icon size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-white">{loc.label}</p>
                                    <p className="text-[11px] text-gray-500">{loc.sub}</p>
                                </div>
                            </div>
                            
                            {isSel && (
                                <div className="mt-3 ml-4 pl-4 border-l-2 border-[#222] space-y-3 animate-enter">
                                    <input value={data.street} onChange={e => setData({...data, street: e.target.value})} placeholder="Rua / Avenida" className="smart-input p-3 text-sm"/>
                                    <div className="flex gap-2">
                                        <input type="tel" value={data.number} onChange={e => setData({...data, number: e.target.value})} placeholder="Nº" className="smart-input p-3 text-sm w-1/3 text-center"/>
                                        <input value={data.district} onChange={e => setData({...data, district: e.target.value})} placeholder="Bairro" className="smart-input p-3 text-sm w-2/3"/>
                                    </div>
                                    <input value={data.comp} onChange={e => setData({...data, comp: e.target.value})} placeholder="Complemento (Opcional)" className="smart-input p-3 text-sm"/>
                                    
                                    <button disabled={!data.street || !data.number || !data.district}
                                        onClick={() => advanceStage(5, refs.payment)}
                                        className="w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-xs font-bold border border-[#333] hover:bg-[#222] disabled:opacity-50 transition-all flex justify-center gap-2">
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
        <section ref={refs.payment} className={`transition-all duration-700 ${stage >= 5 ? 'section-active' : 'section-blur'}`}>
            <div className="flex items-center gap-3 mb-5 opacity-90 mt-10">
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xs font-bold text-white shadow-inner">5</div>
                <h2 className="text-xl font-bold text-white tracking-tight">Pagamento</h2>
            </div>
            
            <div className="glass-card p-2 rounded-[24px] grid grid-cols-3 gap-1 mb-24">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(6, refs.checkout); if(method==='pix'){navigator.clipboard.writeText(CONFIG.PIX_KEY); setToast('Chave Pix Copiada!')} }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-[18px] transition-all border ${data.payment === method ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'border-transparent hover:bg-[#1a1a1a]'}`}>
                        {method === 'pix' && <QrCode className="text-[#0A84FF]" size={20}/>}
                        {method === 'dinheiro' && <Banknote className="text-[#32D74B]" size={20}/>}
                        {method === 'cartao' && <CreditCard className="text-[#FFD60A]" size={20}/>}
                        <span className="text-[10px] font-bold text-gray-300 uppercase">{method}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* 7. CHECKOUT BARRA FLUTUANTE */}
      {stage >= 6 && (
        <div ref={refs.checkout} className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="h-20 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            <div className="bg-[#090909]/95 backdrop-blur-xl border-t border-white/10 p-6 pb-8 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] max-w-md mx-auto relative">
                
                <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Estimado</p>
                        <div className="flex items-baseline gap-2">
                            {hasCoupon && <span className="text-sm text-gray-600 line-through decoration-red-500">{Utils.formatBRL(financials.subTotal)}</span>}
                            <span className="text-3xl font-bold text-white tracking-tighter">{Utils.formatBRL(financials.finalTotal)}</span>
                        </div>
                    </div>
                    {hasCoupon && <div className="text-[9px] font-bold text-[#32D74B] bg-[#32D74B]/10 px-2 py-1 rounded border border-[#32D74B]/20">VIP -R${CONFIG.COUPON_VAL}</div>}
                </div>
                
                <button onClick={finishOrder} className="w-full bg-[#0A84FF] h-14 rounded-[20px] font-bold text-[16px] text-white shadow-[0_0_30px_rgba(10,132,255,0.3)] flex items-center justify-center gap-3 active:scale-[0.98] transition-transform">
                    <MessageCircle size={20} fill="currentColor" />
                    SOLICITAR VIA WHATSAPP
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
