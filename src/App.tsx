import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield,
  CreditCard, Banknote, QrCode, Copy, 
  ChevronRight, Menu, X, HelpCircle, Instagram, MapPin, Calendar as CalendarIcon, Clock, User, Info, AlertCircle
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO & COPYWRITING (Persuasivo)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 15, // Desconto para fechar venda
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 80, 
    AROMA: 10,
  },
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

const LIVE_NOTIFICATIONS = [
  "🔥 João (32) acabou de agendar",
  "👀 6 pessoas vendo a agenda agora",
  "📅 Sexta-feira quase lotada",
  "⭐ Pedro avaliou com 5 estrelas",
  "💎 Murilo usou o Cupom VIP",
  "💬 Lucas enviou uma dúvida no Whats",
  "🏠 Atendimento em Hotel iniciado"
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Alpha Premium', 
    short: 'O Protocolo Completo',
    desc: 'A escolha da maioria. Massagem profunda para soltar a musculatura, seguida de óleo quente, toque pele na pele e finalização manual intensa. Você no comando das sensações.', 
    duration: 60, 
    price: 160, 
    badge: 'RECOMENDADO 🔥'
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico. Ideal para remover dores lombares, pernas cansadas e stress do trabalho. Movimentos firmes e técnicos. Sem interação íntima.', 
    duration: 50, 
    price: 130, 
    badge: null
  },
];

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const LOCATIONS = [
  { id: 'home', label: 'Sua Residência', sub: 'Vou até seu endereço', icon: Home, input: true },
  { id: 'hotel', label: 'Hotel / Motel', sub: 'Vou até sua suíte (Sigilo Absoluto)', icon: Bed, input: true },
];

const REVIEWS_DB = [
  { t: "A melhor da vida. O toque dele vicia. A finalização foi absurda.", a: "Tiago (Sigilo)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Profissionalismo raro.", a: "Empresário SP", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O visual dele de cueca... nota 1000.", a: "Anônimo", s: 5 },
  { t: "O upgrade vale cada centavo. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Cara bonito, limpo e discreto. Atendeu no meu escritório.", a: "Executivo", s: 5 },
];

// ==================================================================================
// 2. UTILITÁRIOS & ESTILOS GLOBAIS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: (pattern = 5) => { if (navigator.vibrate) navigator.vibrate(pattern); },
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = new Date(selectedDate); sel.setHours(0,0,0,0);
    if (sel < today) return true; 
    if (sel > today) return false; 
    const [hours] = timeString.split(':').map(Number);
    return hours <= now.getHours() + 1; 
  },
  getGreeting: () => {
    const h = new Date().getHours();
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  }
};

const globalStyles = `
:root { --primary: #0A84FF; --accent: #32D74B; --bg-app: #050505; --card-bg: #121212; --border: #27272a; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
body { background: var(--bg-app); color: #fff; padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden; scroll-behavior: smooth; }
input, button { outline: none; }
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll { -ms-overflow-style: none; scrollbar-width: none; }

/* Animations */
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }
@keyframes bubblePop { 0% { opacity: 0; transform: scale(0.8) translateY(-10px); } 10% { opacity: 1; transform: scale(1) translateY(0); } 90% { opacity: 1; transform: scale(1) translateY(0); } 100% { opacity: 0; transform: scale(0.8) translateY(-10px); } }

.animate-enter { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slide { animation: slideInRight 0.3s ease-out forwards; }
.animate-bubble { animation: bubblePop 6s ease-in-out forwards; }
.btn-pulse { animation: pulse-glow 2s infinite; }
.text-gradient { background: linear-gradient(90deg, #fff, #0A84FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

/* Components */
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; transition: all 0.3s ease; }
.card-base:active { transform: scale(0.98); background: #18181b; }
.card-selected { border-color: var(--primary); background: rgba(10, 132, 255, 0.08); box-shadow: 0 0 20px rgba(10, 132, 255, 0.15); }
.input-field { background: #18181b; border: 1px solid #3f3f46; color: white; border-radius: 14px; width: 100%; transition: all 0.3s; font-size: 16px; }
.input-field:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(10,132,255,0.2); }
.primary-btn { background: var(--primary); color: white; border-radius: 16px; font-weight: 700; border: none; box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3); position: relative; overflow: hidden; }
.primary-btn::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(rgba(255,255,255,0.2), transparent); opacity: 0; transition: opacity 0.2s; }
.primary-btn:active::after { opacity: 1; }

.section-blur { opacity: 0.4; filter: blur(2px); pointer-events: none; transition: all 0.5s ease; }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; }
`;

// ==================================================================================
// 3. COMPONENTES VISUAIS AUXILIARES
// ==================================================================================

const LiveBubbles = () => {
    const [activeMsg, setActiveMsg] = useState(null);
    useEffect(() => {
      const cycle = () => {
        const randomMsg = LIVE_NOTIFICATIONS[Math.floor(Math.random() * LIVE_NOTIFICATIONS.length)];
        setTimeout(() => { setActiveMsg(randomMsg); }, 2000);
        setTimeout(() => setActiveMsg(null), 8000);
      };
      cycle();
      const interval = setInterval(cycle, 15000); // Frequencia das bolhas
      return () => clearInterval(interval);
    }, []);
    if (!activeMsg) return null;
    return (
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-30 w-max max-w-[90%] pointer-events-none">
        <div className="bg-[#1C1C1E]/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl animate-bubble">
           <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse"></div>
           <span className="text-xs font-bold text-white tracking-wide">{activeMsg}</span>
        </div>
      </div>
    );
};

const ReviewsCarousel = () => {
    const [idx, setIdx] = useState(0);
    useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 6000); return () => clearInterval(t); }, []);
    return (
        <div className="bg-[#121212] border border-[#27272a] rounded-2xl p-4 mb-6 relative overflow-hidden shadow-lg">
            <div className="flex text-[#FFD60A] mb-2 gap-1">{[...Array(5)].map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div>
            <p className="text-[15px] text-gray-300 italic mb-2 leading-relaxed animate-enter" key={idx}>"{REVIEWS_DB[idx].t}"</p>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1">
                 <Shield size={10} className="text-[#32D74B]"/> {REVIEWS_DB[idx].a}
            </p>
        </div>
    )
};

const MenuOverlay = ({ onClose }) => (
  <div className="fixed inset-0 z-[200] flex justify-end animate-enter">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
    <div className="relative w-3/4 max-w-sm h-full bg-[#1C1C1E] border-l border-[#333] p-6 shadow-2xl animate-slide flex flex-col">
       <button onClick={onClose} className="self-end p-2 bg-[#333] rounded-full mb-8"><X size={20} className="text-white"/></button>
       <h2 className="text-2xl font-bold text-white mb-6">Menu</h2>
       <div className="space-y-4">
          <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" 
             className="flex items-center gap-4 p-4 rounded-xl bg-[#2C2C2E] active:bg-[#333] transition-colors">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 flex items-center justify-center">
                <Instagram size={20} className="text-white"/>
             </div>
             <div><p className="font-bold text-white">Instagram</p><p className="text-xs text-gray-400">@{CONFIG.INSTAGRAM}</p></div>
          </a>
       </div>
       <div className="mt-auto pt-6 border-t border-[#333]">
          <p className="text-xs text-center text-gray-600">Thalymassagens App v11.0</p>
       </div>
    </div>
  </div>
);

const HelpModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-enter">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
    <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Info size={20} className="text-[#0A84FF]"/> Guia Rápido</h2>
            <button onClick={onClose} className="p-1 bg-[#333] rounded-full"><X size={16} className="text-gray-400"/></button>
        </div>
        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                <div><h3 className="font-bold text-white text-sm">Sigilo Absoluto</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Atendimento discreto em sua residência ou hotel. Ninguém saberá.</p></div>
            </div>
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                <div><h3 className="font-bold text-white text-sm">Higiene</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Materiais descartáveis e esterilizados. Recomendo um banho quente antes.</p></div>
            </div>
            <button onClick={onClose} className="w-full mt-6 bg-[#0A84FF] py-3 rounded-xl font-bold text-sm">Entendi!</button>
        </div>
    </div>
  </div>
);

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [data, setData] = useState(() => {
     try {
       const s = localStorage.getItem('thaly_v11');
       if(s) { const p = JSON.parse(s); if(p.date) p.date = new Date(p.date); return p; }
     } catch(e){}
     return { name: '', age: '', medical: false, service: null, date: null, time: null, location: null, street: '', number: '', district: '', comp: '', extras: { upgrade: false, touch: false, aroma: false }, payment: null };
  });

  const [stage, setStage] = useState(0); 
  const [hasCoupon, setHasCoupon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [loading, setLoading] = useState(true);

  const refs = {
    header: useRef(null), intro: useRef(null), services: useRef(null), 
    datetime: useRef(null), extras: useRef(null), location: useRef(null), payment: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_v11', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 1000); }, []);

  // CALCULO DE PREÇOS
  const financials = useMemo(() => {
    const base = data.service ? data.service.price : 0;
    const upg = data.extras.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    const touch = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    const aroma = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    const sub = base + upg + touch + aroma;
    const desc = hasCoupon ? CONFIG.COUPON_VAL : 0;
    return { base, upg, touch, aroma, sub, desc, total: Math.max(0, sub - desc) };
  }, [data.service, data.extras, hasCoupon]);

  // SCROLL INTELIGENTE (TOP-DOWN FIX)
  const scrollToSection = (sectionRef) => {
    if (sectionRef && sectionRef.current) {
        // Pequeno delay para garantir que o DOM renderizou a abertura da seção
        setTimeout(() => {
            const yOffset = -80; // Compensar o Header fixo
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 150);
    }
  };

  const advanceStage = (nextStage, nextRef) => {
    Utils.vibrate();
    setStage(nextStage);
    scrollToSection(nextRef);
  };

  const generateMessage = () => {
    const d = data.date;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    let t = `*NOVO AGENDAMENTO VIP* 🦁\n\n`;
    t += `👤 *Cliente:* ${data.name} (${data.age} anos)\n`;
    t += `📅 *Data:* ${dateStr} às ${data.time}\n`;
    t += `💆 *Serviço:* ${data.service?.name.toUpperCase()}\n`;
    if(data.extras.upgrade || data.extras.touch || data.extras.aroma) {
        t += `🔥 *ADICIONAIS:*\n`;
        if(data.extras.upgrade) t += `+ ⏱️ Upgrade Tempo\n`;
        if(data.extras.touch) t += `+ 😈 Interação Recíproca\n`;
        if(data.extras.aroma) t += `+ 🍃 Aromaterapia\n`;
    }
    t += `\n📍 *LOCAL:* ${data.location?.label}\n`;
    if(data.location) t += `📝 ${data.street}, ${data.number} - ${data.district}\n\n`;
    t += `💰 *TOTAL: ${Utils.formatBRL(financials.total)}*\n`;
    t += `💳 Pagamento: ${data.payment?.toUpperCase()}\n`;
    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <style>{globalStyles}</style>
      <div className="w-16 h-16 border-4 border-[#121212] border-t-[#0A84FF] rounded-full animate-spin mb-6"></div>
      <p className="text-gray-500 text-xs uppercase tracking-[0.3em] animate-pulse">Carregando...</p>
    </div>
  );

  // TELA DE SUCESSO (TICKET RESTAURADO)
  if (success) return (
    <div className="min-h-screen pt-12 pb-12 px-5 flex flex-col items-center animate-enter text-center bg-[#050505]">
       <style>{globalStyles}</style>
       <div className="w-20 h-20 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.3)] animate-scale">
         <Check className="w-10 h-10 text-black" strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Solicitação Enviada!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs">Agora aguarde que vou confirmar sua sessão pelo WhatsApp.</p>

       {/* CARD TICKET STYLE */}
       <div className="w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-0 mb-8 relative overflow-hidden text-left shadow-2xl">
           <div className="h-2 w-full bg-gradient-to-r from-[#0A84FF] to-[#32D74B]"></div>
           <div className="p-6">
              <div className="flex justify-between items-start mb-6 border-b border-[#333] pb-6">
                 <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Serviço</p>
                    <p className="text-white font-bold text-lg">{data.service?.name}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                    <p className="text-[#32D74B] font-bold text-xl">{Utils.formatBRL(financials.total)}</p>
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-3"><CalendarIcon size={18} className="text-[#0A84FF]"/><span className="text-gray-300 font-medium">{data.date?.toLocaleDateString('pt-BR')} às {data.time}</span></div>
                 <div className="flex items-center gap-3"><MapPin size={18} className="text-[#0A84FF]"/><span className="text-gray-300 font-medium">{data.location?.label}</span></div>
                 {data.payment === 'pix' && <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5"><p className="text-[10px] text-gray-500 uppercase mb-1">Chave Pix</p><p className="text-xs text-white font-mono">{CONFIG.PIX_KEY}</p></div>}
              </div>
           </div>
           {/* Recorte do Ticket */}
           <div className="absolute top-[85px] left-[-10px] w-5 h-5 rounded-full bg-[#050505]"></div>
           <div className="absolute top-[85px] right-[-10px] w-5 h-5 rounded-full bg-[#050505]"></div>
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm bg-[#32D74B] text-black font-bold py-4 rounded-2xl mb-4 flex items-center justify-center gap-2 hover:opacity-90 shadow-lg active:scale-95 transition-transform text-lg">
         <MessageCircle size={24} fill="currentColor" /> Ir para WhatsApp
       </a>
       <button onClick={() => { setSuccess(false); setStage(0); window.scrollTo(0,0); }} className="text-gray-500 font-bold text-xs uppercase py-4">Fazer novo pedido</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-48 selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>
      <LiveBubbles />
      {showMenu && <MenuOverlay onClose={() => setShowMenu(false)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      
      {/* HEADER */}
      <header ref={refs.header} className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 px-6 flex justify-between items-center transition-all duration-300">
        <span className="font-extrabold text-lg tracking-tight text-white cursor-pointer" onClick={() => { window.location.reload(); }}>THALYMASSAGENS</span>
        <div className="flex items-center gap-3">
            <button onClick={() => setShowHelp(true)} className="p-2 bg-[#1C1C1E] rounded-full border border-[#333]"><HelpCircle size={18} className="text-white"/></button>
            <button onClick={() => setShowMenu(true)} className="p-2 bg-[#1C1C1E] rounded-full border border-[#333]"><Menu size={18} className="text-white"/></button>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-24 px-5">

        {/* 1. INTRODUÇÃO */}
        <section ref={refs.intro} className={`transition-all duration-500 ${stage === 0 ? 'section-active' : 'section-blur'}`}>
            <div className="mb-8 mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#0A84FF]/20 text-[#0A84FF] text-[10px] font-bold px-2 py-1 rounded border border-[#0A84FF]/20">MASSOTERAPIA MASCULINA</span>
                </div>
                <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight mb-3">
                Relaxamento<br/><span className="text-[#555]">Exclusivo.</span>
                </h1>
                <p className="text-gray-400 text-[17px] leading-relaxed">Massagem profissional no conforto do seu local. Discrição total e respeito.</p>
            </div>

            <ReviewsCarousel />

            <div className="card-base p-6 space-y-5 shadow-xl border-[#333]">
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Seu Nome</label>
                    <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Como prefere ser chamado?" className="input-field p-4"/>
                </div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Sua Idade</label>
                    <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Ex: 30" className="input-field p-4"/>
                </div>
                <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#555]'}`}>
                        {data.medical && <Check size={14} className="text-white"/>}
                    </div>
                    <div>
                        <p className={`text-[15px] font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Maior de idade e saudável</p>
                    </div>
                </div>
                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => advanceStage(1, refs.services)} className="primary-btn w-full py-4 mt-2 flex items-center justify-center gap-2 animate-scale">
                        Começar Agendamento <ArrowRight size={20}/>
                    </button>
                )}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-12 transition-all duration-500 ${stage === 1 ? 'section-active' : stage > 1 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`}
                 onClick={() => {if(stage > 1) { setStage(1); scrollToSection(refs.services); }}}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2 text-white">01. Experiência</h3>
            <div className="space-y-6">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 1) { setData({...data, service: s}); advanceStage(2, refs.datetime); }}}
                        className={`card-base p-6 cursor-pointer relative ${data.service?.id === s.id ? 'card-selected' : ''}`}>
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
        <section ref={refs.datetime} className={`mt-12 transition-all duration-500 ${stage === 2 ? 'section-active' : stage > 2 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`}
                 onClick={() => {if(stage > 2) { setStage(2); scrollToSection(refs.datetime); }}}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2 text-white">02. Data e Hora</h3>
            <div className="card-base p-6">
                <div className="flex gap-3 overflow-x-auto pb-5 ios-scroll snap-x">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }}
                                className={`snap-center min-w-[72px] h-[88px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-[#333] text-gray-400'}`}>
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
                            <button key={t} disabled={isBlocked} onClick={() => { setData({...data, time: t}); advanceStage(3, refs.extras); }}
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
        <section ref={refs.extras} className={`mt-12 transition-all duration-500 ${stage === 3 ? 'section-active' : stage > 3 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`}
                 onClick={() => {if(stage > 3) { setStage(3); scrollToSection(refs.extras); }}}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2 text-white">03. Personalizar</h3>
            <div className="card-base rounded-[24px] overflow-hidden divide-y divide-[#333]">
                {[
                   { id: 'upgrade', label: '+30 Minutos', sub: 'Sessão estendida', icon: Clock, price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT, color: 'text-[#0A84FF]' },
                   { id: 'touch', label: 'Interação / Toque', sub: 'Toques recíprocos', icon: Flame, price: CONFIG.PRICES.TOUCH, color: 'text-[#FF375F]' },
                   { id: 'aroma', label: 'Aromaterapia', sub: 'Essências relaxantes', icon: Wind, price: CONFIG.PRICES.AROMA, color: 'text-[#32D74B]' }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }}
                        className="p-6 flex justify-between items-center cursor-pointer active:bg-[#333] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${data.extras[item.id] ? `bg-current border-current ${item.color}` : 'border-[#444] bg-transparent'}`}>
                                {data.extras[item.id] && <Check size={16} className="text-black"/>}
                            </div>
                            <div>
                                <p className="font-bold text-white text-[16px]">{item.label}</p>
                                <p className="text-[12px] text-gray-500">{item.sub}</p>
                            </div>
                        </div>
                        <span className={`${item.color} font-bold text-[14px]`}>+ {Utils.formatBRL(item.price)}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => advanceStage(4, refs.location)} 
                className={`w-full mt-6 py-4 rounded-2xl text-[16px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${Object.values(data.extras).some(Boolean) ? 'bg-[#0A84FF] text-white' : 'bg-[#1C1C1E] text-gray-400 border border-[#333]'}`}>
                {Object.values(data.extras).some(Boolean) ? 'Confirmar Adicionais' : 'Continuar sem Extras'} <ChevronRight size={20}/>
            </button>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section ref={refs.location} className={`mt-12 transition-all duration-500 ${stage === 4 ? 'section-active' : stage > 4 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`}
                 onClick={() => {if(stage > 4) { setStage(4); scrollToSection(refs.location); }}}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2 text-white">04. Localização</h3>
            <div className="space-y-4">
                {LOCATIONS.map(loc => {
                    const isSel = data.location?.id === loc.id;
                    return (
                        <div key={loc.id}>
                            <div onClick={() => { setData({...data, location: loc}); }}
                                className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'card-base border-transparent'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#222] text-gray-500'}`}><loc.icon size={20} /></div>
                                <div><p className="font-bold text-white text-[16px]">{loc.label}</p><p className="text-[12px] text-gray-500">{loc.sub}</p></div>
                            </div>
                            {isSel && (
                                <div className="mt-4 ml-6 pl-6 border-l-2 border-[#333] space-y-4 animate-enter">
                                    <input value={data.street} onChange={e => setData({...data, street: e.target.value})} placeholder="Rua / Avenida" className="input-field p-4"/>
                                    <div className="flex gap-3">
                                        <input type="tel" value={data.number} onChange={e => setData({...data, number: e.target.value})} placeholder="Nº" className="input-field p-4 w-1/3 text-center"/>
                                        <input value={data.district} onChange={e => setData({...data, district: e.target.value})} placeholder="Bairro" className="input-field p-4 w-2/3"/>
                                    </div>
                                    <button disabled={!data.street || !data.number || !data.district} onClick={() => advanceStage(5, refs.payment)}
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
        <section ref={refs.payment} className={`mt-12 transition-all duration-500 ${stage === 5 ? 'section-active' : 'hidden opacity-0'}`}>
            <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2 text-white">05. Pagamento</h3>
            <div className="card-base p-3 rounded-3xl grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(6, null); if(method==='pix'){navigator.clipboard.writeText(CONFIG.PIX_KEY);} }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${data.payment === method ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'border-transparent hover:bg-[#222]'}`}>
                        {method === 'pix' && <QrCode className="text-[#0A84FF]" size={24}/>}
                        {method === 'dinheiro' && <Banknote className="text-[#32D74B]" size={24}/>}
                        {method === 'cartao' && <CreditCard className="text-[#FFD60A]" size={24}/>}
                        <span className="text-[10px] font-bold text-gray-300 uppercase">{method}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* CHECKOUT BAR FIXO */}
      {stage >= 6 && !success && (
        <div className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="h-24 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border-t border-white/10 p-6 pb-10 rounded-t-[36px] shadow-[0_-10px_60px_rgba(0,0,0,0.7)] max-w-md mx-auto relative ring-1 ring-white/5">
                <div className="w-12 h-1.5 bg-[#38383A] rounded-full mx-auto mb-8"></div>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Final</p>
                        <div className="flex items-baseline gap-2.5">
                            {hasCoupon && <span className="text-[15px] text-gray-600 line-through decoration-red-500 font-bold">{Utils.formatBRL(financials.sub)}</span>}
                            <span className="text-[36px] font-extrabold text-white tracking-tight">{Utils.formatBRL(financials.total)}</span>
                        </div>
                    </div>
                    {!hasCoupon ? (
                        <button onClick={() => { setHasCoupon(true); Utils.vibrate(); }} className="h-10 px-4 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] font-bold text-xs border border-[#0A84FF]/20 flex items-center gap-2 btn-pulse"><Ticket size={14}/> Aplicar Cupom</button>
                    ) : (
                        <div className="h-8 px-3 rounded-full bg-[#32D74B]/10 text-[#32D74B] font-bold text-[10px] border border-[#32D74B]/20 flex items-center">VIP ATIVO</div>
                    )}
                </div>
                <button onClick={() => { setSuccess(true); window.scrollTo(0,0); }} className="primary-btn w-full h-16 rounded-[22px] text-[18px] shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3">
                    <MessageCircle size={24} fill="currentColor" /> Enviar Pedido
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
