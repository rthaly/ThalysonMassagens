import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Sparkles, User, Shield,
  CreditCard, Banknote, QrCode, Copy, Music, Zap,
  ChevronRight, Menu, X, HelpCircle, Instagram, MapPin, Calendar as CalendarIcon, Clock, ChevronLeft
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO (EDITE AQUI)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 15.00, // Aumentei um pouco para parecer mais vantajoso
  PRICES: {
    UPGRADE_PCT: 0.4, // 40% do valor base
    TOUCH: 80, // Valor psicológico arredondado
    AROMA: 10,
  },
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

const LIVE_NOTIFICATIONS = [
  "🔥 André (35) acabou de agendar",
  "👀 6 homens visualizando agora",
  "🔒 Sigilo total garantido",
  "⭐ Ricardo avaliou: 'Mão perfeita'",
  "✅ Agenda de hoje quase lotada",
  "💎 Cliente VIP ativou o Cupom",
  "💬 Lucas perguntou sobre local",
  "🏠 Atendimento Domiciliar iniciado"
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Premium', 
    short: 'Completa + Finalização',
    desc: 'O protocolo exclusivo para homens exigentes. Massagem tântrica e relaxante, inicia de bruços e finaliza com toque corpo a corpo intenso. Liberdade total.', 
    duration: 60, 
    price: 160, 
    badge: 'A ESCOLHA DA MAIORIA 🔥',
    popular: true
  },
  { 
    id: 'relax', 
    name: 'Relaxamento Clássico', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico. Ideal para remover o stress do dia a dia, dores lombares e cansaço físico. Toque firme e profissional.', 
    duration: 50, 
    price: 130, 
    badge: null,
    popular: false
  },
];

const REVIEWS_DB = [
  { t: "Energia surreal. O toque dele vicia, saí de perna bamba.", a: "Tiago, 32", s: 5 },
  { t: "Sou casado, o sigilo foi absoluto. Atendeu no meu escritório.", a: "Empresário Sigilo", s: 5 },
  { t: "Visual nota 1000, atendimento impecável. Valeu o extra.", a: "Gustavo, 28", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Fui pra relaxar e acabei vivendo uma experiência única.", a: "Pedro H.", s: 5 },
  { t: "Profissionalismo raro. Pontual, limpo e muito educado.", a: "Dr. Carlos", s: 5 },
];

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const LOCATIONS = [
  { id: 'home', label: 'Na sua Residência', sub: 'Levo a maca (se precisar) e os óleos.', icon: Home, input: true },
  { id: 'hotel', label: 'Hotel / Motel', sub: 'Vou até a sua suíte com total discrição.', icon: Bed, input: true },
];

// ==================================================================================
// 2. UTILITÁRIOS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: (pattern = 10) => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); },
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = new Date(selectedDate); sel.setHours(0,0,0,0);
    if (sel < today) return true; 
    if (sel > today) return false; 
    const [hours] = timeString.split(':').map(Number);
    return hours <= now.getHours(); // Bloqueia horas passadas
  },
  getGreeting: () => {
    const h = new Date().getHours();
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  }
};

// ==================================================================================
// 3. ESTILOS GLOBAIS (DESIGN SYSTEM)
// ==================================================================================

const globalStyles = `
:root { 
  --primary: #0A84FF; 
  --success: #32D74B;
  --bg-app: #050505; 
  --card-bg: #141416; 
  --border: #27272A; 
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: var(--bg-app); color-scheme: dark; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Helvetica, sans-serif; 
  letter-spacing: -0.015em; color: #fff; background: var(--bg-app);
  padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden;
}
input, button { outline: none; font-family: inherit; }

/* Animações */
@keyframes shimmer { 0% {background-position: -200% 0;} 100% {background-position: 200% 0;} }
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse-subtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
@keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }

.text-gradient {
  background: linear-gradient(90deg, #ffffff 0%, #0A84FF 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.animate-enter { animation: fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.animate-float { animation: float 4s ease-in-out infinite; }

/* UI Components */
.ios-card { 
  background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); transition: all 0.2s ease;
}
.ios-card:active { transform: scale(0.98); background: #1A1A1C; }
.ios-card.selected { 
  border-color: var(--primary); background: rgba(10, 132, 255, 0.05); 
  box-shadow: 0 0 0 1px var(--primary), 0 8px 30px rgba(10, 132, 255, 0.15); 
}
.ios-input { 
  background: #1C1C1E; border: 1px solid #333; color: white; font-size: 16px; 
  border-radius: 12px; width: 100%; transition: all 0.2s; padding: 16px;
}
.ios-input:focus { border-color: var(--primary); background: #222; }
.ios-btn { 
  background: var(--primary); color: white; border-radius: 16px; font-weight: 700; 
  font-size: 16px; border: none; box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3);
  transition: all 0.2s; position: relative; overflow: hidden;
}
.ios-btn:active { transform: scale(0.96); opacity: 0.9; }
.ios-btn:disabled { background: #333; color: #666; box-shadow: none; transform: none; }

.section-blur { opacity: 0.4; filter: blur(2px); pointer-events: none; transition: all 0.5s ease; }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; }
.scrollbar-hide::-webkit-scrollbar { display: none; }

/* Confetti simples via CSS */
.confetti-piece { position: absolute; width: 10px; height: 10px; background: #0A84FF; top: -10px; z-index: 50; }
`;

// ==================================================================================
// 4. COMPONENTES VISUAIS AUXILIARES
// ==================================================================================

const ProgressBar = ({ stage }) => (
  <div className="fixed top-0 left-0 w-full h-1 bg-[#222] z-50">
    <div 
      className="h-full bg-gradient-to-r from-[#0A84FF] to-[#32D74B] transition-all duration-500 ease-out"
      style={{ width: `${((stage + 1) / 7) * 100}%` }}
    />
  </div>
);

const LiveBubbles = () => {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    const cycle = () => {
      const randomMsg = LIVE_NOTIFICATIONS[Math.floor(Math.random() * LIVE_NOTIFICATIONS.length)];
      setMsg(randomMsg);
      setTimeout(() => setMsg(null), 4000);
    };
    setTimeout(cycle, 1000); // Start faster
    const interval = setInterval(cycle, 12000);
    return () => clearInterval(interval);
  }, []);

  if (!msg) return null;
  return (
    <div className="fixed top-20 inset-x-0 flex justify-center z-30 pointer-events-none">
      <div className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl animate-enter">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[11px] font-bold text-gray-100 tracking-wide">{msg}</span>
      </div>
    </div>
  );
};

const SuccessConfetti = () => {
  // Simulação visual simples
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="confetti-piece rounded-sm" style={{
            left: `${Math.random() * 100}%`,
            animation: `confetti ${3 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: ['#0A84FF', '#32D74B', '#FFD60A'][Math.floor(Math.random() * 3)]
        }}></div>
      ))}
    </div>
  )
}

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [data, setData] = useState({
    name: '', age: '', medical: false, 
    service: null, date: null, time: null, location: null,
    street: '', number: '', district: '', comp: '',
    extras: { upgrade: false, touch: false, aroma: false }, payment: null
  });

  const [stage, setStage] = useState(0); // 0:Intro, 1:Service, 2:Time, 3:Extras, 4:Location, 5:Payment, 6:Review
  const [hasCoupon, setHasCoupon] = useState(false); 
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refs para scroll
  const refs = {
    intro: useRef(null), services: useRef(null), datetime: useRef(null),
    extras: useRef(null), location: useRef(null), payment: useRef(null), checkout: useRef(null)
  };

  useEffect(() => { setTimeout(() => setLoading(false), 1000); }, []);

  // Cálculos Financeiros
  const financials = useMemo(() => {
    const basePrice = data.service ? data.service.price : 0;
    const upgradePrice = data.extras.upgrade ? (basePrice * CONFIG.PRICES.UPGRADE_PCT) : 0;
    const touchPrice = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    const aromaPrice = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    
    let subTotal = basePrice + upgradePrice + touchPrice + aromaPrice;
    let discount = hasCoupon ? CONFIG.COUPON_VAL : 0;
    
    // Regra de negócio: Cupom não pode negativar
    let finalTotal = Math.max(0, subTotal - discount);
    
    return { basePrice, upgradePrice, touchPrice, aromaPrice, subTotal, discount, finalTotal };
  }, [data, hasCoupon]);

  const advanceStage = (nextStage, nextRef) => {
    Utils.vibrate([15]);
    if(nextStage > stage) setStage(nextStage);
    setTimeout(() => {
        nextRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTimeSelect = (t) => {
    if (Utils.isTimeBlocked(data.date, t)) {
        Utils.vibrate([50, 50, 50]); // Erro
        showToast('Horário indisponível!');
        return;
    }
    setData({...data, time: t});
    advanceStage(3, refs.extras);
  };

  const generateMessage = () => {
    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';
    
    let text = `*NOVO AGENDAMENTO VIP* 🦁\n\n`;
    text += `👤 *Cliente:* ${data.name} (${data.age} anos)\n`;
    text += `🛠 *Serviço:* ${data.service?.name}\n`;
    text += `📅 *Data:* ${dateStr} às ${data.time}\n\n`;
    
    if (data.location) {
        text += `📍 *Local:* ${data.location.label}\n`;
        if(data.street) text += `🏠 ${data.street}, ${data.number} - ${data.district}\n`;
        if(data.comp) text += `🏢 Comp: ${data.comp}\n`;
    }

    const extrasList = [];
    if(data.extras.upgrade) extrasList.push("⚡ Upgrade 30min");
    if(data.extras.touch) extrasList.push("🔥 Interação/Toque");
    if(data.extras.aroma) extrasList.push("🍃 Aromaterapia");
    
    if(extrasList.length > 0) {
        text += `\n*ADICIONAIS:*\n${extrasList.map(e => `• ${e}`).join('\n')}\n`;
    }

    text += `\n💰 *VALOR TOTAL: ${Utils.formatBRL(financials.finalTotal)}*\n`;
    if(data.payment === 'pix') text += `💳 Pagamento via PIX\n`;
    if(data.payment === 'cartao') text += `💳 Levar Maquininha\n`;
    if(data.payment === 'dinheiro') text += `💵 Pagamento em Dinheiro\n`;
    
    text += `\n_Aguardo a confirmação!_`;
    return text;
  };

  const finishOrder = () => {
    setSuccess(true);
    Utils.vibrate([100, 50, 100]);
    const text = generateMessage();
    const link = `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
    // Pequeno delay para a animação de sucesso rodar antes de abrir o zap
    setTimeout(() => { window.open(link, '_blank'); }, 1500);
  };

  const showToast = (msg) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#000] z-50 flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-t-2 border-b-2 border-[#0A84FF] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#0A84FF]">TM</div>
      </div>
      <p className="mt-4 text-gray-500 text-[10px] uppercase tracking-[0.3em] animate-pulse">Carregando Ambiente...</p>
    </div>
  );

  return (
    <div className="min-h-screen text-white pb-32 selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>
      <ProgressBar stage={success ? 7 : stage} />
      <LiveBubbles />
      
      {/* HEADER SIMPLES */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3" onClick={() => { if(stage > 0) setStage(stage-1) }}>
           {stage > 0 && !success && <ChevronLeft className="text-gray-400" size={24} />}
           <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tighter text-white">THALY<span className="text-[#0A84FF]">MASSAGENS</span></span>
              {!success && <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">● ONLINE AGORA</span>}
           </div>
        </div>
        {/* AVATAR PLACEHOLDER */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 border border-white/20 flex items-center justify-center overflow-hidden">
            <User size={18} className="text-gray-400" />
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-[100] bg-[#32D74B] text-black px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm animate-enter">
            <Check size={16} strokeWidth={3}/> {toast}
        </div>
      )}

      {/* --- TELA DE SUCESSO --- */}
      {success ? (
        <div className="min-h-screen pt-32 px-6 flex flex-col items-center animate-enter text-center relative z-20">
          <SuccessConfetti />
          <div className="w-24 h-24 bg-[#32D74B]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.4)] animate-float">
            <Check className="w-12 h-12 text-[#32D74B]" strokeWidth={4} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Pedido Enviado!</h2>
          <p className="text-gray-400 mb-10 text-sm max-w-xs leading-relaxed">
            Agora é só aguardar minha confirmação no WhatsApp. Prepare-se para relaxar.
          </p>
          <button onClick={() => window.location.reload()} className="text-[#0A84FF] font-bold text-sm uppercase tracking-widest border-b border-[#0A84FF] pb-1">Fazer novo pedido</button>
        </div>
      ) : (
        <main className="max-w-md mx-auto pt-24 px-5">
            
            {/* 1. INTRODUÇÃO & DADOS */}
            <section ref={refs.intro} className={`transition-all duration-500 ${stage >= 0 ? 'section-active' : 'section-blur'}`}>
                <div className="mb-8 mt-4 space-y-2">
                    <span className="inline-block px-3 py-1 bg-[#1C1C1E] border border-[#333] rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        <Star size={10} className="inline mr-1 text-yellow-500 mb-0.5"/> 
                        Profissional Verificado
                    </span>
                    <h1 className="text-[38px] font-bold leading-[1.05] tracking-tight text-white">
                       Seu momento de <br/> <span className="text-gradient">liberdade total.</span>
                    </h1>
                    <p className="text-gray-400 text-[16px] leading-relaxed max-w-[90%]">
                       Terapia corporal masculina. Sigilo absoluto, conforto e técnicas exclusivas para homens.
                    </p>
                </div>

                <div className="ios-card p-6 space-y-5 border-t-4 border-t-[#0A84FF]">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Seus Dados</h3>
                    <div className="space-y-4">
                        <input 
                            value={data.name} 
                            onChange={e => setData({...data, name: e.target.value})}
                            placeholder="Seu Nome ou Apelido" 
                            className="ios-input"
                        />
                        <div className="flex gap-4">
                            <input 
                                type="tel" maxLength={2} 
                                value={data.age} 
                                onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})}
                                placeholder="Idade" 
                                className="ios-input text-center w-1/3"
                            />
                            <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                                className={`flex-1 rounded-xl border flex items-center px-4 cursor-pointer transition-all ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-500'}`}>
                                    {data.medical && <Check size={12} className="text-white"/>}
                                </div>
                                <span className="text-xs font-bold text-gray-300">Saúde OK?</span>
                            </div>
                        </div>
                    </div>

                    {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                        <button onClick={() => advanceStage(1, refs.services)} className="ios-btn w-full py-4 mt-2 flex items-center justify-center gap-2 animate-enter">
                            Ver Experiências <ArrowRight size={18}/>
                        </button>
                    )}
                </div>
            </section>

            {/* 2. SERVIÇOS */}
            <section ref={refs.services} className={`mt-12 transition-all duration-500 ${stage >= 1 ? 'section-active' : 'section-blur'}`}>
                <div className="flex items-center gap-2 mb-4 ml-1">
                    <div className="w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-xs font-bold text-gray-500 border border-[#333]">1</div>
                    <h3 className="text-lg font-bold text-white">Escolha sua Experiência</h3>
                </div>
                
                <div className="space-y-4">
                    {SERVICES.map(s => (
                        <div key={s.id} onClick={() => { setData({...data, service: s}); advanceStage(2, refs.datetime); }}
                            className={`ios-card p-5 cursor-pointer relative overflow-hidden group ${data.service?.id === s.id ? 'selected ring-1 ring-[#0A84FF]' : ''}`}>
                            {s.popular && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl z-10">POPULAR</div>}
                            {/* Efeito Hover Sutil */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <h3 className={`text-lg font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3>
                                <span className="text-white font-bold text-lg">{Utils.formatBRL(s.price)}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-bold bg-[#333] px-2 py-0.5 rounded text-gray-300 flex items-center gap-1"><Clock size={10}/> {s.duration} min</span>
                                <span className="text-[10px] font-bold bg-[#1C1C1E] border border-[#333] text-[#0A84FF] px-2 py-0.5 rounded uppercase">{s.short}</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed relative z-10">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. DATA E HORA */}
            <section ref={refs.datetime} className={`mt-12 transition-all duration-500 ${stage >= 2 ? 'section-active' : 'section-blur'}`}>
                <div className="flex items-center gap-2 mb-4 ml-1">
                    <div className="w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-xs font-bold text-gray-500 border border-[#333]">2</div>
                    <h3 className="text-lg font-bold text-white">Data e Horário</h3>
                </div>

                <div className="ios-card p-5">
                    {/* Datas com Scroll Snap */}
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                        {[...Array(14)].map((_, i) => {
                            const d = new Date(); d.setDate(d.getDate() + i);
                            const isSelected = data.date && new Date(data.date).getDate() === d.getDate();
                            const isToday = i === 0;
                            return (
                                <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }}
                                    className={`snap-center shrink-0 w-[70px] h-[85px] rounded-xl flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                                    <span className="text-[9px] font-bold uppercase mb-1">{isToday ? 'HOJE' : d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','')}</span>
                                    <span className="text-2xl font-bold tracking-tighter">{d.getDate()}</span>
                                </button>
                            )
                        })}
                    </div>
                    
                    {/* Grid de Horários */}
                    <div className={`grid grid-cols-4 gap-2 transition-all duration-500 ${data.date ? 'opacity-100 mt-2' : 'opacity-20 pointer-events-none'}`}>
                        {TIME_SLOTS.map(t => {
                            const isBlocked = Utils.isTimeBlocked(data.date, t);
                            return (
                                <button key={t} disabled={isBlocked} onClick={() => handleTimeSelect(t)}
                                    className={`py-3 rounded-lg text-sm font-bold border transition-all relative
                                        ${data.time === t ? 'bg-white text-black border-white shadow-lg scale-105 z-10' : 
                                        isBlocked ? 'bg-transparent text-[#333] border-transparent decoration-slice cursor-not-allowed' : 
                                        'bg-[#1C1C1E] border-[#333] text-gray-400 hover:border-gray-500'}`}>
                                    {isBlocked && <div className="absolute w-[1px] h-[120%] bg-[#333] left-1/2 top-[-10%] rotate-45"></div>}
                                    {t}
                                </button>
                            )
                        })}
                    </div>
                    {data.date && <p className="text-center text-[10px] text-gray-600 mt-4 uppercase tracking-widest font-bold">Horário de Brasília</p>}
                </div>
            </section>

            {/* 4. EXTRAS / UPSELL */}
            <section ref={refs.extras} className={`mt-12 transition-all duration-500 ${stage >= 3 ? 'section-active' : 'section-blur'}`}>
                <div className="flex items-center gap-2 mb-4 ml-1">
                    <div className="w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-xs font-bold text-gray-500 border border-[#333]">3</div>
                    <h3 className="text-lg font-bold text-white">Personalize (Opcional)</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {/* Card Upgrade */}
                    <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, upgrade: !data.extras.upgrade}}); }}
                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${data.extras.upgrade ? 'bg-[#1C1C1E] border-[#0A84FF] shadow-[0_0_15px_rgba(10,132,255,0.15)]' : 'bg-[#141416] border-[#333]'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.extras.upgrade ? 'bg-[#0A84FF] text-white' : 'bg-[#222] text-gray-600'}`}><Clock size={20}/></div>
                            <div>
                                <p className="font-bold text-white text-sm">Mais Tempo (+30min)</p>
                                <p className="text-[11px] text-gray-500">Sessão estendida</p>
                            </div>
                        </div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.formatBRL(data.service ? data.service.price * CONFIG.PRICES.UPGRADE_PCT : 0)}</span>
                    </div>

                    {/* Card Touch */}
                    <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, touch: !data.extras.touch}}); }}
                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${data.extras.touch ? 'bg-[#1C1C1E] border-[#FF375F] shadow-[0_0_15px_rgba(255,55,95,0.15)]' : 'bg-[#141416] border-[#333]'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.extras.touch ? 'bg-[#FF375F] text-white' : 'bg-[#222] text-gray-600'}`}><Flame size={20}/></div>
                            <div>
                                <p className="font-bold text-white text-sm">Interação & Toque</p>
                                <p className="text-[11px] text-gray-500">Troca mútua permitida</p>
                            </div>
                        </div>
                        <span className="text-[#FF375F] font-bold text-sm">+ {Utils.formatBRL(CONFIG.PRICES.TOUCH)}</span>
                    </div>

                    {/* Card Aroma */}
                    <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, aroma: !data.extras.aroma}}); }}
                        className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${data.extras.aroma ? 'bg-[#1C1C1E] border-[#32D74B] shadow-[0_0_15px_rgba(50,215,75,0.15)]' : 'bg-[#141416] border-[#333]'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${data.extras.aroma ? 'bg-[#32D74B] text-white' : 'bg-[#222] text-gray-600'}`}><Wind size={20}/></div>
                            <div>
                                <p className="font-bold text-white text-sm">Aromaterapia</p>
                                <p className="text-[11px] text-gray-500">Imersão sensorial</p>
                            </div>
                        </div>
                        <span className="text-[#32D74B] font-bold text-sm">+ {Utils.formatBRL(CONFIG.PRICES.AROMA)}</span>
                    </div>
                </div>

                <button onClick={() => advanceStage(4, refs.location)} 
                    className={`w-full mt-6 py-4 rounded-xl text-sm font-bold transition-all border
                    ${Object.values(data.extras).some(x=>x) 
                        ? 'bg-[#0A84FF] text-white border-[#0A84FF]' 
                        : 'bg-transparent text-gray-500 border-[#333] hover:text-white hover:border-gray-500'}`}>
                    {Object.values(data.extras).some(x=>x) ? 'Confirmar Adicionais' : 'Pular e Continuar'}
                </button>
            </section>

            {/* 5. LOCALIZAÇÃO */}
            <section ref={refs.location} className={`mt-12 transition-all duration-500 ${stage >= 4 ? 'section-active' : 'section-blur'}`}>
                <div className="flex items-center gap-2 mb-4 ml-1">
                    <div className="w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-xs font-bold text-gray-500 border border-[#333]">4</div>
                    <h3 className="text-lg font-bold text-white">Onde será?</h3>
                </div>

                <div className="space-y-3">
                    {LOCATIONS.map(loc => {
                        const isSel = data.location?.id === loc.id;
                        return (
                            <div key={loc.id} className="animate-enter">
                                <div onClick={() => setData({...data, location: loc})}
                                    className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#222] text-gray-500'}`}>
                                        <loc.icon size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white text-sm">{loc.label}</p>
                                        <p className="text-[11px] text-gray-500">{loc.sub}</p>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSel ? 'border-[#0A84FF] bg-[#0A84FF]' : 'border-[#444]'}`}>
                                        {isSel && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                    </div>
                                </div>
                                {isSel && (
                                    <div className="mt-3 pl-4 border-l-2 border-[#333] ml-5 space-y-3 animate-enter">
                                        <input value={data.street} onChange={e => setData({...data, street: e.target.value})} placeholder="Rua / Avenida" className="ios-input py-3 text-sm"/>
                                        <div className="flex gap-2">
                                            <input type="tel" value={data.number} onChange={e => setData({...data, number: e.target.value})} placeholder="Nº" className="ios-input py-3 text-sm w-1/3 text-center"/>
                                            <input value={data.district} onChange={e => setData({...data, district: e.target.value})} placeholder="Bairro" className="ios-input py-3 text-sm w-2/3"/>
                                        </div>
                                        <button disabled={!data.street || !data.number || !data.district}
                                            onClick={() => advanceStage(5, refs.payment)}
                                            className="w-full bg-white text-black py-3 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:bg-gray-200 transition-colors">
                                            Confirmar Local
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* 6. PAGAMENTO (Última Etapa) */}
            <section ref={refs.payment} className={`mt-12 mb-40 transition-all duration-500 ${stage >= 5 ? 'section-active' : 'section-blur'}`}>
                <div className="flex items-center gap-2 mb-4 ml-1">
                    <div className="w-6 h-6 rounded-full bg-[#1C1C1E] flex items-center justify-center text-xs font-bold text-gray-500 border border-[#333]">5</div>
                    <h3 className="text-lg font-bold text-white">Forma de Pagamento</h3>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'pix', icon: QrCode, label: 'Pix', color: 'text-[#0A84FF]' },
                        { id: 'dinheiro', icon: Banknote, label: 'Dinheiro', color: 'text-[#32D74B]' },
                        { id: 'cartao', icon: CreditCard, label: 'Cartão', color: 'text-[#FFD60A]' }
                    ].map(m => (
                        <button key={m.id} onClick={() => { setData({...data, payment: m.id}); advanceStage(6, refs.checkout); }}
                            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all h-24
                            ${data.payment === m.id ? 'bg-[#1C1C1E] border-white' : 'bg-[#141416] border-[#333] opacity-60 hover:opacity-100'}`}>
                            <m.icon size={24} className={m.color}/>
                            <span className="text-[11px] font-bold text-gray-300 uppercase">{m.label}</span>
                        </button>
                    ))}
                </div>
                
                {/* Garantia de Sigilo */}
                <div className="mt-8 flex items-center justify-center gap-2 text-gray-600 opacity-60">
                    <Shield size={12}/>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Sigilo Absoluto Garantido</span>
                </div>
            </section>
        </main>
      )}

      {/* 7. CHECKOUT SHEET FIXED */}
      {!success && stage >= 6 && (
        <div ref={refs.checkout} className="fixed bottom-0 w-full z-50 animate-enter">
            {/* Gradient Overlay */}
            <div className="h-24 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-[95%] w-full pointer-events-none"></div>
            
            <div className="bg-[#1C1C1E] border-t border-[#333] p-6 pb-10 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] max-w-md mx-auto relative">
                {/* Puxador */}
                <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total a Pagar</p>
                        <div className="flex items-baseline gap-2">
                             {hasCoupon && <span className="text-sm text-gray-500 line-through decoration-red-500 font-bold">{Utils.formatBRL(financials.subTotal)}</span>}
                            <span className="text-4xl font-extrabold text-white tracking-tighter">{Utils.formatBRL(financials.finalTotal)}</span>
                        </div>
                    </div>
                    {!hasCoupon ? (
                        <button onClick={() => { setHasCoupon(true); Utils.vibrate(); showToast('Cupom VIP Ativado!'); }} 
                            className="bg-[#0A84FF]/10 text-[#0A84FF] border border-[#0A84FF]/30 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 hover:bg-[#0A84FF]/20 transition-colors animate-pulse">
                            <Ticket size={12}/> Aplicar Desconto
                        </button>
                    ) : (
                        <div className="px-3 py-1 rounded bg-[#32D74B]/10 border border-[#32D74B]/20 text-[#32D74B] text-[10px] font-bold uppercase">Desconto Aplicado</div>
                    )}
                </div>
                
                <button onClick={finishOrder} className="w-full bg-[#32D74B] text-black h-16 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(50,215,75,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                    <MessageCircle size={24} fill="currentColor" />
                    Confirmar no WhatsApp
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
