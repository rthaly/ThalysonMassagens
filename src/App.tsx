import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, MapPin, Star, ArrowRight, Bed, 
  Home, MessageCircle, Clock, Zap, Ticket, Lock,
  ShieldCheck, Map, Navigation, User, ChevronDown, Flame, AlertCircle, 
  CreditCard, Banknote, QrCode, Copy, Wind, Calendar as CalendarIcon, X, ChevronRight
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
    badge: 'MAIS PEDIDA',
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
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", a: "Tiago (Bela Vista)", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda, jorrei longe.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O óleo quente faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório.", a: "Empresário (Faria Lima)", s: 5 },
  { t: "Precisava desse escape. O stress sumiu na hora. Discrição nota 10.", a: "M. (Casado)", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Massagem top, mas o trânsito de SP me fez atrasar e perdi 10 min.", a: "Fernando", s: 4 },
  { t: "Achei a taxa do Uber justa, mas podia ser inclusa. O serviço compensa.", a: "M.O.", s: 4 },
  { t: "Ele de cueca branca... sem comentários. Visual nota 1000.", a: "Fã", s: 5 },
  { t: "Profissionalismo raro hoje em dia. Pontual e educado.", a: "Carlos A.", s: 5 },
  { t: "A mistura de força e suavidade é incrível. Recomendo.", a: "Lucas", s: 5 },
  { t: "Primeira vez que faço e me senti super à vontade. Thalyson é gente boa.", a: "Novato", s: 5 },
  { t: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", a: "Gustavo", s: 5 }
];

// ==================================================================================
// 2. UTILITÁRIOS (Helpers)
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

  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date();
    today.setHours(0,0,0,0);
    const sel = new Date(selectedDate);
    sel.setHours(0,0,0,0);

    if (sel < today) return true;
    if (sel > today) return false;

    const [hours] = timeString.split(':').map(Number);
    const currentHour = now.getHours();
    return hours <= currentHour;
  },

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
// 3. DESIGN SYSTEM (Apple Style CSS)
// ==================================================================================

const globalStyles = `
:root { --primary: #0A84FF; --bg-ios: #000000; --card-ios: #1C1C1E; --separator: #38383A; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: var(--bg-ios); color-scheme: dark; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Helvetica, sans-serif; 
  letter-spacing: -0.01em; color: #fff; background: var(--bg-ios);
  padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden;
}

/* --- ANIMATIONS --- */
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-enter { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-scale { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

/* --- COMPONENTS --- */
.ios-bg {
  background: radial-gradient(120% 120% at 50% 10%, #1a1a1a 0%, #000000 60%);
  min-height: 100vh;
}

.ios-card { 
  background: rgba(28, 28, 30, 0.6);
  backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ios-card:active { transform: scale(0.98); background: rgba(28, 28, 30, 0.8); }

.ios-card.selected {
  border-color: var(--primary); 
  background: rgba(10, 132, 255, 0.1);
  box-shadow: 0 0 0 1px var(--primary);
}

.ios-input {
  background: rgba(118, 118, 128, 0.24);
  border: none;
  color: white;
  font-size: 17px;
  border-radius: 12px;
  width: 100%;
  transition: background 0.2s;
}
.ios-input:focus { background: rgba(118, 118, 128, 0.4); outline: none; }
.ios-input::placeholder { color: rgba(235, 235, 245, 0.6); }

.ios-btn {
  background: var(--primary);
  color: white;
  border-radius: 14px;
  font-weight: 600;
  font-size: 17px;
  border: none;
  transition: opacity 0.2s, transform 0.2s;
}
.ios-btn:active { opacity: 0.8; transform: scale(0.98); }

.section-blur { opacity: 0.4; filter: blur(4px); pointer-events: none; transition: all 0.6s ease; }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; }

/* --- SCROLLBAR --- */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

// ==================================================================================
// 4. COMPONENTES VISUAIS (UI Components)
// ==================================================================================

const ReviewsTicker = () => {
  const [reviews, setReviews] = useState([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => { setReviews(Utils.shuffleArray([...REVIEWS_DB])); }, []);
  useEffect(() => { 
    if (reviews.length === 0) return;
    const t = setInterval(() => setIdx(i => (i+1)%reviews.length), 6000); 
    return () => clearInterval(t); 
  }, [reviews]);

  if (reviews.length === 0) return null;

  return (
      <div className="mb-8 p-0 overflow-hidden relative h-20 animate-enter">
          <div key={idx} className="absolute inset-0 flex flex-col justify-center animate-enter">
              <div className="flex gap-1 text-[#FFD60A] mb-1.5">
                  {[...Array(5)].map((_,i) => <Star key={i} size={13} fill="currentColor" strokeWidth={0} />)}
              </div>
              <p className="text-[15px] text-white font-medium leading-snug mb-1 line-clamp-2">"{reviews[idx].t}"</p>
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
      
      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Tudo pronto!</h2>
      <p className="text-gray-400 mb-10 text-base leading-relaxed max-w-xs mx-auto">
        Seu pedido foi gerado. Finalize enviando a mensagem no WhatsApp.
      </p>

      <a href={whatsappLink} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm bg-[#32D74B] text-black font-bold py-4 rounded-2xl mb-3 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-lg">
         <MessageCircle size={22} fill="currentColor" /> Enviar Agora
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
          <a href={calendarLink} target="_blank" rel="noreferrer" className="text-[#0A84FF] font-bold text-sm">Adicionar</a>
      </div>

      <button onClick={() => { localStorage.removeItem('thaly_ios_v2'); window.location.reload(); }} 
        className="mt-8 text-gray-500 font-medium text-sm hover:text-white transition-colors">
        Fazer novo pedido
      </button>
    </div>
  );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('thaly_ios_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date) parsed.date = new Date(parsed.date);
        return parsed;
      }
    } catch (e) { console.error(e); }
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

  // Refs
  const refs = {
    intro: useRef(null), services: useRef(null), datetime: useRef(null),
    extras: useRef(null), location: useRef(null), payment: useRef(null), checkout: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_ios_v2', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  // Cálculos Financeiros
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
        Utils.vibrate([50, 50, 50]); // Vibração de erro
        return;
    }
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

    text += `\n*Detalhes:*\n`;
    if(financials.upgradePrice > 0) text += `+ Upgrade 30min\n`;
    if(financials.touchPrice > 0) text += `+ Interação\n`;
    if(financials.aromaPrice > 0) text += `+ Aromaterapia\n`;
    if(financials.discount > 0) text += `🎟️ Desconto VIP Aplicado\n`;
    if(activeExtrasCount === 0) text += `(Sem adicionais)\n`;

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
      <div className="w-10 h-10 border-t-2 border-[#0A84FF] rounded-full animate-spin"></div>
    </div>
  );

  if (success) return <SuccessScreen data={data} financials={financials} whatsappLink={whatsappLink} onCopy={handleCopy} />;

  return (
    <div className="ios-bg min-h-screen text-white pb-48 selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>
      
      {/* HEADER BLUR */}
      <header className="fixed top-0 w-full z-40 bg-[#000000]/80 backdrop-blur-xl border-b border-white/5 py-3 px-6 flex justify-between items-center transition-all duration-300">
        <span className="font-semibold text-lg tracking-tight">Thalyson</span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1C1C1E] rounded-full">
          <Lock className="w-3 h-3 text-[#32D74B]" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Sigilo</span>
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] bg-[#32D74B] text-black px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm animate-scale">
            <Check size={16} strokeWidth={3}/> {toast}
        </div>
      )}

      <main className="max-w-md mx-auto pt-24 px-5">
        
        {/* 1. INTRODUÇÃO */}
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

          <div className="ios-card p-6 rounded-[24px]">
            <div className="space-y-4">
                <div>
                    <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-2 block ml-1">Seu Nome</label>
                    <input 
                      value={data.name} onChange={e => setData({...data, name: e.target.value})}
                      placeholder="Como prefere ser chamado?" className="ios-input p-4"
                    />
                </div>
                <div>
                    <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-2 block ml-1">Sua Idade</label>
                    <input 
                      type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})}
                      placeholder="Ex: 30" className="ios-input p-4"
                    />
                </div>
            </div>
            {data.name.length > 2 && data.age && stage === 0 && (
                <button onClick={() => advanceStage(1, refs.services)} className="ios-btn w-full mt-6 py-4 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20">
                   Começar <ArrowRight size={18}/>
                </button>
            )}
          </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-12 transition-all duration-700 ${stage >= 1 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">01.</span> Experiência</h3>
            <div className="space-y-4">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { setData({...data, service: s}); advanceStage(2, refs.datetime); }}
                        className={`ios-card p-5 rounded-[24px] cursor-pointer relative ${data.service?.id === s.id ? 'selected' : ''}`}>
                        {s.badge && <span className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">{s.badge}</span>}
                        <div className="flex justify-between items-start mb-1">
                            <h3 className={`text-xl font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3>
                            <span className="text-gray-400 font-medium text-sm bg-[#333] px-2 py-1 rounded-lg">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-[13px] text-gray-500 font-bold uppercase mb-3">{s.short}</p>
                        <p className="text-[15px] text-gray-300 leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`mt-12 transition-all duration-700 ${stage >= 2 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">02.</span> Agendamento</h3>
            <div className="ios-card p-5 rounded-[28px]">
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSelected = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }}
                                className={`snap-center min-w-[64px] h-[80px] rounded-[18px] flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#2C2C2E] border-transparent text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-60">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-[22px] font-bold tracking-tight">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                
                <div className={`grid grid-cols-4 gap-2 transition-all duration-500 ${data.date ? 'opacity-100 mt-4' : 'opacity-20 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => {
                        const isBlocked = Utils.isTimeBlocked(data.date, t);
                        return (
                            <button key={t} disabled={isBlocked} onClick={() => handleTimeSelect(t)}
                                className={`py-3 rounded-[12px] text-[13px] font-semibold border transition-all relative overflow-hidden
                                    ${data.time === t ? 'bg-white text-black border-white shadow-md' : 
                                      isBlocked ? 'bg-transparent text-[#333] border-[#222] cursor-not-allowed decoration-slice' : 
                                      'bg-[#2C2C2E] border-transparent text-gray-300'}`}>
                                {isBlocked && <div className="absolute inset-0 flex items-center justify-center"><div className="w-[120%] h-[1px] bg-[#333] rotate-45"></div></div>}
                                {t}
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>

        {/* 4. ADICIONAIS (FLUXO CORRIGIDO) */}
        <section ref={refs.extras} className={`mt-12 transition-all duration-700 ${stage >= 3 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">03.</span> Personalizar</h3>
            
            <div className="ios-card rounded-[24px] overflow-hidden">
                 {/* UPGRADE TEMPO */}
                 <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, upgrade: !data.extras.upgrade}}); }}
                      className="p-5 flex justify-between items-center cursor-pointer active:bg-[#333] border-b border-[#38383A] transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${data.extras.upgrade ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444] bg-transparent'}`}>
                           {data.extras.upgrade && <Check size={14} className="text-white"/>}
                        </div>
                        <div>
                            <p className="font-semibold text-white text-[15px]">+30 Minutos</p>
                            <p className="text-[12px] text-gray-500">Sessão estendida</p>
                        </div>
                     </div>
                     <span className="text-[#0A84FF] font-semibold text-[13px]">+ {Utils.formatBRL(data.service ? data.service.price * CONFIG.PRICES.UPGRADE_PCT : 0)}</span>
                 </div>

                 {/* TOUCH */}
                 <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, touch: !data.extras.touch}}); }}
                      className="p-5 flex justify-between items-center cursor-pointer active:bg-[#333] border-b border-[#38383A] transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${data.extras.touch ? 'bg-[#FF375F] border-[#FF375F]' : 'border-[#444] bg-transparent'}`}>
                           {data.extras.touch && <Flame size={14} className="text-white"/>}
                        </div>
                        <div>
                            <p className="font-semibold text-white text-[15px]">Interação / Toque</p>
                            <p className="text-[12px] text-gray-500">Liberdade total</p>
                        </div>
                     </div>
                     <span className="text-[#FF375F] font-semibold text-[13px]">+ {Utils.formatBRL(CONFIG.PRICES.TOUCH)}</span>
                 </div>

                 {/* AROMA */}
                 <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, aroma: !data.extras.aroma}}); }}
                      className="p-5 flex justify-between items-center cursor-pointer active:bg-[#333] transition-colors">
                     <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${data.extras.aroma ? 'bg-[#32D74B] border-[#32D74B]' : 'border-[#444] bg-transparent'}`}>
                           {data.extras.aroma && <Wind size={14} className="text-white"/>}
                        </div>
                        <div>
                            <p className="font-semibold text-white text-[15px]">Aromaterapia</p>
                            <p className="text-[12px] text-gray-500">Óleos essenciais</p>
                        </div>
                     </div>
                     <span className="text-[#32D74B] font-semibold text-[13px]">+ {Utils.formatBRL(CONFIG.PRICES.AROMA)}</span>
                 </div>
            </div>

            {/* BOTÃO INTELIGENTE (FLUXO) */}
            <button onClick={() => advanceStage(4, refs.location)} 
                className={`w-full mt-4 py-4 rounded-[18px] text-[15px] font-bold transition-all flex items-center justify-center gap-2
                ${activeExtrasCount > 0 
                    ? 'bg-[#0A84FF] text-white shadow-lg shadow-blue-900/30' 
                    : 'bg-[#1C1C1E] text-gray-400 border border-[#333] hover:text-white hover:bg-[#2C2C2E]'
                }`}>
                {activeExtrasCount > 0 ? `Confirmar ${activeExtrasCount} Adicionais` : 'Pular esta etapa'}
                {activeExtrasCount > 0 ? <Check size={18}/> : <ChevronRight size={18}/>}
            </button>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section ref={refs.location} className={`mt-12 transition-all duration-700 ${stage >= 4 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">04.</span> Localização</h3>
            <div className="space-y-3">
                {LOCATIONS.map(loc => {
                    const isSel = data.location?.id === loc.id;
                    return (
                        <div key={loc.id}>
                            <div onClick={() => { setData({...data, location: loc}); }}
                                className={`p-4 rounded-[20px] border flex items-center gap-4 cursor-pointer transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-card border-transparent'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#2C2C2E] text-gray-400'}`}>
                                    <loc.icon size={18} />
                                </div>
                                <div>
                                    <p className="font-bold text-white text-[15px]">{loc.label}</p>
                                    <p className="text-[12px] text-gray-500">{loc.sub}</p>
                                </div>
                            </div>
                            
                            {isSel && (
                                <div className="mt-3 ml-4 pl-4 border-l-2 border-[#222] space-y-3 animate-enter">
                                    <input value={data.street} onChange={e => setData({...data, street: e.target.value})} placeholder="Rua / Avenida" className="ios-input p-3.5 text-sm"/>
                                    <div className="flex gap-2">
                                        <input type="tel" value={data.number} onChange={e => setData({...data, number: e.target.value})} placeholder="Nº" className="ios-input p-3.5 text-sm w-1/3 text-center"/>
                                        <input value={data.district} onChange={e => setData({...data, district: e.target.value})} placeholder="Bairro" className="ios-input p-3.5 text-sm w-2/3"/>
                                    </div>
                                    <input value={data.comp} onChange={e => setData({...data, comp: e.target.value})} placeholder="Complemento (Opcional)" className="ios-input p-3.5 text-sm"/>
                                    
                                    <button disabled={!data.street || !data.number || !data.district}
                                        onClick={() => advanceStage(5, refs.payment)}
                                        className="w-full bg-[#1C1C1E] text-white py-3.5 rounded-xl text-[13px] font-bold border border-[#333] hover:bg-[#2C2C2E] disabled:opacity-50 transition-all flex justify-center gap-2">
                                        Confirmar Endereço <Check size={16}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`mt-12 transition-all duration-700 ${stage >= 5 ? 'section-active' : 'section-blur'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">05.</span> Pagamento</h3>
            
            <div className="ios-card p-2 rounded-[24px] grid grid-cols-3 gap-2 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(6, refs.checkout); if(method==='pix'){navigator.clipboard.writeText(CONFIG.PIX_KEY); setToast('Chave Pix Copiada!')} }}
                        className={`flex flex-col items-center gap-2 p-4 rounded-[18px] transition-all border ${data.payment === method ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'border-transparent hover:bg-[#2C2C2E]'}`}>
                        {method === 'pix' && <QrCode className="text-[#0A84FF]" size={22}/>}
                        {method === 'dinheiro' && <Banknote className="text-[#32D74B]" size={22}/>}
                        {method === 'cartao' && <CreditCard className="text-[#FFD60A]" size={22}/>}
                        <span className="text-[11px] font-bold text-gray-300 uppercase mt-1">{method}</span>
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
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Estimado</p>
                        <div className="flex items-baseline gap-2.5">
                            {hasCoupon && <span className="text-[15px] text-gray-600 line-through decoration-red-500 font-medium">{Utils.formatBRL(financials.subTotal)}</span>}
                            <span className="text-[34px] font-bold text-white tracking-tight">{Utils.formatBRL(financials.finalTotal)}</span>
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
                
                <button onClick={finishOrder} className="ios-btn w-full h-16 rounded-[22px] text-[17px] shadow-lg shadow-blue-900/30 flex items-center justify-center gap-3">
                    <MessageCircle size={22} fill="currentColor" />
                    Enviar Pedido
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
