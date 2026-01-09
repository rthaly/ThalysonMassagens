import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, MapPin, Star, ArrowRight, Bed, 
  Home, MessageCircle, Clock, Zap, Ticket, Lock,
  ShieldCheck, Map, Navigation, User, ChevronDown, Flame, AlertCircle, 
  CreditCard, Banknote, QrCode, Copy, Wind, Calendar as CalendarIcon, 
  ChevronRight, Activity
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO (Edite aqui)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", // Seu WhatsApp
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
  { t: "Sou casado, tinha receio. O sigilo foi absoluto.", a: "Empresário", s: 5 },
  { t: "Ambiente relaxante e profissionalismo nota 10.", a: "Lucas", s: 5 },
  { t: "Estava travado das costas, saiu tudo.", a: "Roberto", s: 5 }
];

// ==================================================================================
// 2. UTILITÁRIOS (Lógica)
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  
  vibrate: (pattern = 10) => { if (navigator.vibrate) navigator.vibrate(pattern); },
  
  shuffleArray: (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  },

  // Bloqueio Temporal
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date();
    today.setHours(0,0,0,0);
    const sel = new Date(selectedDate);
    sel.setHours(0,0,0,0);

    if (sel < today) return true; // Passado
    if (sel > today) return false; // Futuro

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
// 3. ESTILOS GLOBAIS (High Contrast & Apple Design)
// ==================================================================================

const globalStyles = `
/* --- CORE --- */
:root { --primary: #0A84FF; --bg-app: #000000; --card-bg: #121212; --border: #2C2C2E; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: var(--bg-app); color-scheme: dark; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Helvetica, sans-serif; 
  letter-spacing: -0.01em; color: #fff; background: var(--bg-app);
  padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden;
}

/* --- ANIMATIONS --- */
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-enter { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-scale { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

/* --- COMPONENTS --- */
.ios-bg {
  background: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 70%);
  min-height: 100vh;
}

.ios-card { 
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ios-card:active { transform: scale(0.98); background: #1A1A1A; }

.ios-card.selected {
  border-color: var(--primary); 
  background: rgba(10, 132, 255, 0.08);
  box-shadow: 0 0 0 1px var(--primary), 0 10px 40px rgba(10, 132, 255, 0.1);
}

.ios-input {
  background: #1C1C1E;
  border: 1px solid #333;
  color: white;
  font-size: 17px;
  border-radius: 14px;
  width: 100%;
  transition: all 0.2s;
}
.ios-input:focus { border-color: var(--primary); background: #222; outline: none; }
.ios-input::placeholder { color: #555; }

.ios-btn {
  background: var(--primary);
  color: white;
  border-radius: 16px;
  font-weight: 700;
  font-size: 17px;
  border: none;
  transition: transform 0.2s;
  box-shadow: 0 4px 20px rgba(10, 132, 255, 0.25);
}
.ios-btn:active { opacity: 0.9; transform: scale(0.97); }

.section-blur { opacity: 0.3; filter: blur(3px); pointer-events: none; transition: all 0.6s ease; }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; }

/* --- SCROLLBAR --- */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

// ==================================================================================
// 4. COMPONENTES VISUAIS (Sub-components)
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
      <div className="mb-8 p-0 overflow-hidden relative h-16 animate-enter">
          <div key={idx} className="absolute inset-0 flex flex-col justify-center animate-enter">
              <div className="flex gap-1 text-[#FFD60A] mb-1.5">
                  {[...Array(5)].map((_,i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
              </div>
              <p className="text-[15px] text-white font-medium leading-snug mb-1 line-clamp-2 italic">"{reviews[idx].t}"</p>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">— {reviews[idx].a}</p>
          </div>
      </div>
  )
}

const SuccessScreen = ({ data, financials, whatsappLink, onCopy }) => {
  const calendarLink = Utils.generateCalendarLink(data);
  return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center p-6 text-center animate-enter">
      <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.4)] animate-scale">
        <Check className="w-12 h-12 text-black" strokeWidth={4} />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Pedido Gerado!</h2>
      <p className="text-gray-400 mb-10 text-base leading-relaxed max-w-xs mx-auto">
        Agora é só enviar a mensagem pronta no WhatsApp para confirmar seu horário.
      </p>

      <a href={whatsappLink} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm bg-[#32D74B] text-black font-bold py-4 rounded-2xl mb-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-lg shadow-lg">
         <MessageCircle size={24} fill="currentColor" /> Enviar no WhatsApp
      </a>
      
      <button onClick={onCopy} 
         className="w-full max-w-sm bg-[#1C1C1E] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mb-8 border border-[#333]">
         <Copy size={20} /> Copiar Texto
      </button>

      <div className="w-full max-w-sm bg-[#1C1C1E] rounded-2xl p-4 flex items-center justify-between border border-[#333]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-[#333] flex items-center justify-center">
               <CalendarIcon className="text-white w-5 h-5" />
             </div>
             <div className="text-left">
               <p className="text-white font-semibold text-sm">Lembrete</p>
               <p className="text-gray-500 text-xs">Google Agenda</p>
             </div>
          </div>
          <a href={calendarLink} target="_blank" rel="noreferrer" className="text-[#0A84FF] font-bold text-sm bg-[#0A84FF]/10 px-3 py-1.5 rounded-lg">Adicionar</a>
      </div>

      <button onClick={() => { localStorage.removeItem('thaly_full_v1'); window.location.reload(); }} 
        className="mt-8 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors">
        Fazer novo pedido
      </button>
    </div>
  );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  // 1. STATE & PERSISTÊNCIA
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('thaly_full_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date) parsed.date = new Date(parsed.date);
        // Garantir que campos novos existam
        if (!parsed.medical) parsed.medical = false;
        return parsed;
      }
    } catch (e) { console.error(e); }
    return {
      name: '', age: '', medical: false, // NOVO CAMPO
      service: null, date: null, time: null, location: null,
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

  // Refs para Scroll
  const refs = {
    intro: useRef(null), services: useRef(null), datetime: useRef(null),
    extras: useRef(null), location: useRef(null), payment: useRef(null), checkout: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_full_v1', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  // Cálculos
  const financials = useMemo(() => {
    const basePrice = data.service ? data.service.price : 0;
    const upgradePrice = data.extras.upgrade ? (basePrice * CONFIG.PRICES.UPGRADE_PCT) : 0;
    const touchPrice = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    const aromaPrice = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    const subTotal = basePrice + upgradePrice + touchPrice + aromaPrice;
    const discount = hasCoupon ? CONFIG.COUPON_VAL : 0;
    return { basePrice, upgradePrice, touchPrice, aromaPrice, subTotal, discount, finalTotal: Math.max(0, subTotal - discount) };
  }, [data.service, data.extras, hasCoupon]);

  const activeExtrasCount = Object.values(data.extras).filter(Boolean).length;

  // Ações de Navegação
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
        setTimeout(() => { ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
    }
  };

  const advanceStage = (nextStage, nextRef) => {
    Utils.vibrate([10]);
    if(nextStage > stage) setStage(nextStage);
    scrollToRef(nextRef);
  };

  const handleTimeSelect = (t) => {
    if (Utils.isTimeBlocked(data.date, t)) {
        Utils.vibrate([50, 50, 50]);
        return;
    }
    setData({...data, time: t});
    advanceStage(3, refs.extras);
  };

  const generateMessage = () => {
    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';
    let text = `${Utils.getGreeting()} Thalyson! 🌿\nGostaria de agendar:\n\n`;
    text += `👤 *${data.name}* (${data.age} anos)\n`;
    text += `✅ *Liberado p/ Massagem: Sim*\n`; // Confirmação médica na msg
    text += `💆 *${data.service?.name}*\n`;
    text += `📅 *${dateStr} às ${data.time}*\n`;
    
    if (data.location) {
        text += `📍 *${data.location.label}*\n`;
        text += `🏠 ${data.street}, ${data.number} - ${data.district}\n`;
        if(data.comp) text += `🏢 ${data.comp}\n`;
    }

    text += `\n*Detalhes:*\n`;
    if(financials.upgradePrice > 0) text += `+ Upgrade 30min\n`;
    if(financials.touchPrice > 0) text += `+ Interação\n`;
    if(financials.aromaPrice > 0) text += `+ Aromaterapia\n`;
    if(financials.discount > 0) text += `🎟️ Desconto VIP\n`;
    if(activeExtrasCount === 0) text += `(Padrão)\n`;

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
    setToast('Copiado!');
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-t-2 border-[#0A84FF] rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] animate-pulse">Carregando...</p>
    </div>
  );

  if (success) return <SuccessScreen data={data} financials={financials} whatsappLink={whatsappLink} onCopy={handleCopy} />;

  return (
    <div className="ios-bg min-h-screen text-white pb-48 selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 px-6 flex justify-between items-center transition-all duration-300">
        <span className="font-semibold text-lg tracking-tight">Thalyson</span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1C1C1E] rounded-full border border-[#333]">
          <Lock className="w-3 h-3 text-[#32D74B]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Sigilo</span>
        </div>
      </header>

      {/* TOAST FLUTUANTE */}
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] bg-[#32D74B] text-black px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm animate-scale">
            <Check size={16} strokeWidth={3}/> {toast}
        </div>
      )}

      <main className="max-w-md mx-auto pt-24 px-5">
        
        {/* 1. INTRODUÇÃO (NOME, IDADE, MEDICAL CHECK) */}
        <section ref={refs.intro} className={`transition-all duration-700 ${stage >= 0 ? 'section-active' : 'section-blur'}`}>
          <div className="mb-8 mt-4">
             <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight mb-3">
               Relaxamento<br/><span className="text-[#555]">Exclusivo.</span>
             </h1>
             <p className="text-gray-400 text-[17px] leading-relaxed">
               Massoterapia masculina no conforto do seu local.
             </p>
          </div>

          <ReviewsTicker />

          <div className="ios-card p-6 space-y-5">
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Seu Nome</label>
                    <input 
                      value={data.name} onChange={e => setData({...data, name: e.target.value})}
                      placeholder="Como prefere ser chamado?" className="ios-input p-4"
                    />
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Sua Idade</label>
                    <input 
                      type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})}
                      placeholder="Ex: 30" className="ios-input p-4"
                    />
                </div>

                {/* --- CHECKBOX DE SAÚDE (NOVO) --- */}
                <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                     className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333] hover:bg-[#222]'}`}>
                    
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#555]'}`}>
                        {data.medical && <Check size={14} className="text-white"/>}
                    </div>
                    
                    <div className="flex-1">
                        <p className={`text-[15px] font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Liberado para massagem</p>
                        <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Confirmo que estou apto e sem lesões.</p>
                    </div>
                </div>

                {/* BOTÃO APARECE SÓ SE TUDO ESTIVER PREENCHIDO */}
                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => advanceStage(1, refs.services)} className="ios-btn w-full py-4 mt-2 flex items-center justify-center gap-2 animate-scale shadow-lg shadow-blue-900/20">
                       Começar Agendamento <ArrowRight size={20}/>
                    </button>
                )}
          </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-16 transition-all duration-700 ${stage >= 1 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">01.</span> Experiência</h3>
            <div className="space-y-6">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { setData({...data, service: s}); advanceStage(2, refs.datetime); }}
                        className={`ios-card p-6 cursor-pointer relative ${data.service?.id === s.id ? 'selected' : ''}`}>
                        {s.badge && <span className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl">{s.badge}</span>}
                        <div className="flex justify-between items-start mb-3">
                            <h3 className={`text-xl font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3>
                            <span className="text-gray-300 font-bold bg-[#333] px-3 py-1 rounded-lg text-sm">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-[11px] font-bold text-[#0A84FF] uppercase tracking-wide border border-[#0A84FF]/30 inline-block px-2 py-1 rounded mb-3">{s.short}</p>
                        <p className="text-gray-400 text-[15px] leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`mt-16 transition-all duration-700 ${stage >= 2 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">02.</span> Agendamento</h3>
            <div className="ios-card p-6">
                <div className="flex gap-3 overflow-x-auto pb-5 scrollbar-hide snap-x">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSelected = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }}
                                className={`snap-center min-w-[72px] h-[88px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-[#333] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-60">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-[24px] font-bold tracking-tight">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                
                <div className={`grid grid-cols-4 gap-3 transition-all duration-500 ${data.date ? 'opacity-100 mt-4' : 'opacity-20 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => {
                        const isBlocked = Utils.isTimeBlocked(data.date, t);
                        return (
                            <button key={t} disabled={isBlocked} onClick={() => handleTimeSelect(t)}
                                className={`py-3.5 rounded-xl text-[14px] font-bold border transition-all relative overflow-hidden
                                    ${data.time === t ? 'bg-white text-black border-white shadow-md' : 
                                      isBlocked ? 'bg-transparent text-[#333] border-[#222] cursor-not-allowed decoration-slice' : 
                                      'bg-[#1C1C1E] border-transparent text-gray-300 hover:bg-[#2C2C2E]'}`}>
                                {isBlocked && <div className="absolute inset-0 flex items-center justify-center"><div className="w-[120%] h-[1px] bg-[#333] rotate-45"></div></div>}
                                {t}
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>

        {/* 4. ADICIONAIS */}
        <section ref={refs.extras} className={`mt-16 transition-all duration-700 ${stage >= 3 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">03.</span> Personalizar</h3>
            
            <div className="ios-card rounded-[24px] overflow-hidden divide-y divide-[#333]">
                 {/* UPGRADE TEMPO */}
                 <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, upgrade: !data.extras.upgrade}}); }}
                      className="p-6 flex justify-between items-center cursor-pointer active:bg-[#333] transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${data.extras.upgrade ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444] bg-transparent'}`}>
                           {data.extras.upgrade && <Check size={16} className="text-white"/>}
                        </div>
                        <div>
                            <p className="font-bold text-white text-[16px]">+30 Minutos</p>
                            <p className="text-[12px] text-gray-500">Sessão estendida</p>
                        </div>
                     </div>
                     <span className="text-[#0A84FF] font-bold text-[14px]">+ {Utils.formatBRL(data.service ? data.service.price * CONFIG.PRICES.UPGRADE_PCT : 0)}</span>
                 </div>

                 {/* TOUCH */}
                 <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, touch: !data.extras.touch}}); }}
                      className="p-6 flex justify-between items-center cursor-pointer active:bg-[#333] transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${data.extras.touch ? 'bg-[#FF375F] border-[#FF375F]' : 'border-[#444] bg-transparent'}`}>
                           {data.extras.touch && <Flame size={16} className="text-white"/>}
                        </div>
                        <div>
                            <p className="font-bold text-white text-[16px]">Interação / Toque</p>
                            <p className="text-[12px] text-gray-500">Liberdade total</p>
                        </div>
                     </div>
                     <span className="text-[#FF375F] font-bold text-[14px]">+ {Utils.formatBRL(CONFIG.PRICES.TOUCH)}</span>
                 </div>

                 {/* AROMA */}
                 <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, aroma: !data.extras.aroma}}); }}
                      className="p-6 flex justify-between items-center cursor-pointer active:bg-[#333] transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${data.extras.aroma ? 'bg-[#32D74B] border-[#32D74B]' : 'border-[#444] bg-transparent'}`}>
                           {data.extras.aroma && <Wind size={16} className="text-white"/>}
                        </div>
                        <div>
                            <p className="font-bold text-white text-[16px]">Aromaterapia</p>
                            <p className="text-[12px] text-gray-500">Óleos essenciais</p>
                        </div>
                     </div>
                     <span className="text-[#32D74B] font-bold text-[14px]">+ {Utils.formatBRL(CONFIG.PRICES.AROMA)}</span>
                 </div>
            </div>

            {/* BOTÃO INTELIGENTE */}
            <button onClick={() => advanceStage(4, refs.location)} 
                className={`w-full mt-6 py-4 rounded-2xl text-[16px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg
                ${activeExtrasCount > 0 
                    ? 'bg-[#0A84FF] text-white' 
                    : 'bg-[#1C1C1E] text-gray-400 border border-[#333] hover:text-white hover:bg-[#2C2C2E]'
                }`}>
                {activeExtrasCount > 0 ? `Confirmar ${activeExtrasCount} Adicionais` : 'Pular esta etapa'}
                {activeExtrasCount > 0 ? <Check size={20}/> : <ChevronRight size={20}/>}
            </button>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section ref={refs.location} className={`mt-16 transition-all duration-700 ${stage >= 4 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">04.</span> Localização</h3>
            <div className="space-y-4">
                {LOCATIONS.map(loc => {
                    const isSel = data.location?.id === loc.id;
                    return (
                        <div key={loc.id}>
                            <div onClick={() => { setData({...data, location: loc}); }}
                                className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-card border-transparent'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#222] text-gray-500'}`}>
                                    <loc.icon size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-[16px]">{loc.label}</p>
                                    <p className="text-[12px] text-gray-500">{loc.sub}</p>
                                </div>
                            </div>
                            
                            {isSel && (
                                <div className="mt-4 ml-6 pl-6 border-l-2 border-[#333] space-y-4 animate-enter">
                                    <input value={data.street} onChange={e => setData({...data, street: e.target.value})} placeholder="Rua / Avenida" className="ios-input p-4"/>
                                    <div className="flex gap-3">
                                        <input type="tel" value={data.number} onChange={e => setData({...data, number: e.target.value})} placeholder="Nº" className="ios-input p-4 w-1/3 text-center"/>
                                        <input value={data.district} onChange={e => setData({...data, district: e.target.value})} placeholder="Bairro" className="ios-input p-4 w-2/3"/>
                                    </div>
                                    <input value={data.comp} onChange={e => setData({...data, comp: e.target.value})} placeholder="Complemento (Opcional)" className="ios-input p-4"/>
                                    
                                    <button disabled={!data.street || !data.number || !data.district}
                                        onClick={() => advanceStage(5, refs.payment)}
                                        className="w-full bg-[#1C1C1E] text-white py-4 rounded-xl text-[14px] font-bold border border-[#333] hover:bg-[#2C2C2E] disabled:opacity-50 transition-all flex justify-center gap-2">
                                        Confirmar Endereço <Check size={18}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`mt-16 transition-all duration-700 ${stage >= 5 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">05.</span> Pagamento</h3>
            
            <div className="ios-card p-3 rounded-3xl grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(6, refs.checkout); if(method==='pix'){navigator.clipboard.writeText(CONFIG.PIX_KEY); setToast('Chave Pix Copiada!')} }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${data.payment === method ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'border-transparent hover:bg-[#222]'}`}>
                        {method === 'pix' && <QrCode className="text-[#0A84FF]" size={24}/>}
                        {method === 'dinheiro' && <Banknote className="text-[#32D74B]" size={24}/>}
                        {method === 'cartao' && <CreditCard className="text-[#FFD60A]" size={24}/>}
                        <span className="text-[12px] font-bold text-gray-300 uppercase">{method}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* 7. CHECKOUT BAR (iOS Sheet Style) */}
      {stage >= 6 && (
        <div ref={refs.checkout} className="fixed bottom-0 w-full z-50 animate-enter">
            {/* Gradient Fade */}
            <div className="h-24 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            
            {/* Sheet Content */}
            <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border-t border-white/10 p-6 pb-10 rounded-t-[36px] shadow-[0_-10px_60px_rgba(0,0,0,0.7)] max-w-md mx-auto relative ring-1 ring-white/5">
                
                {/* Handle */}
                <div className="w-12 h-1.5 bg-[#38383A] rounded-full mx-auto mb-8"></div>

                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Final</p>
                        <div className="flex items-baseline gap-2.5">
                            {hasCoupon && <span className="text-[15px] text-gray-600 line-through decoration-red-500 font-bold">{Utils.formatBRL(financials.subTotal)}</span>}
                            <span className="text-[36px] font-extrabold text-white tracking-tight">{Utils.formatBRL(financials.finalTotal)}</span>
                        </div>
                    </div>
                    {!hasCoupon && !localStorage.getItem('thaly_coupon_redeemed') && (
                        <button onClick={() => { setHasCoupon(true); Utils.vibrate(); setToast('Desconto Aplicado!'); }} 
                            className="h-10 px-4 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] font-bold text-xs border border-[#0A84FF]/20 flex items-center gap-2">
                            <Ticket size={14}/> Aplicar Cupom
                        </button>
                    )}
                    {hasCoupon && <div className="h-8 px-3 rounded-full bg-[#32D74B]/10 text-[#32D74B] font-bold text-[10px] border border-[#32D74B]/20 flex items-center">VIP ATIVO</div>}
                </div>
                
                <button onClick={finishOrder} className="ios-btn w-full h-16 rounded-[22px] text-[18px] shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3">
                    <MessageCircle size={24} fill="currentColor" />
                    Enviar Pedido
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
