import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield, Zap,
  CreditCard, Banknote, QrCode, ChevronRight, Menu, X, 
  HelpCircle, Instagram, MapPin, Calendar as CalendarIcon, Clock, User
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO & LOGICA COMERCIAL
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 15, // Valor do desconto
  XP_THRESHOLDS: { VIP: 80, ALPHA: 100 }, // Gamificação
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 80, 
    AROMA: 15,
  },
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

const LEVELS = [
  { name: 'Visitante', min: 0, color: 'text-gray-400', bg: 'bg-gray-600' },
  { name: 'Membro', min: 20, color: 'text-blue-400', bg: 'bg-blue-500' },
  { name: 'VIP', min: 60, color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]' }, // Desbloqueia Cupom
  { name: 'ALPHA', min: 99, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]' }
];

const LIVE_NOTIFICATIONS = [
  "🔥 João (32) agendou Experiência Alpha",
  "👀 8 pessoas vendo a agenda agora",
  "📅 Agenda de Sexta quase lotada",
  "⭐ Pedro avaliou com 5 estrelas",
  "💎 Murilo desbloqueou Nível VIP",
  "💬 Lucas enviou uma dúvida no Whats",
  "🏠 Atendimento em Hotel iniciado",
  "🚀 Ricardo fechou o pacote completo"
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Alpha Premium', 
    short: 'Protocolo Completo',
    desc: 'O ápice do relaxamento. Massagem profunda para soltar a musculatura, óleo quente, toque pele na pele e finalização manual intensa. Você no controle.', 
    duration: 60, 
    price: 160, 
    badge: 'MAIS ESCOLHIDO 🏆',
    xp: 60 // Pontos de XP
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico. Ideal para remover dores lombares, pernas cansadas e stress. Movimentos firmes e técnicos. Sem interação íntima.', 
    duration: 50, 
    price: 130, 
    badge: null,
    xp: 30
  },
];

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const LOCATIONS = [
  { id: 'home', label: 'Sua Residência', sub: 'Vou até seu endereço', icon: Home },
  { id: 'hotel', label: 'Hotel / Motel', sub: 'Vou até sua suíte (Sigilo Absoluto)', icon: Bed },
];

// Base Completa de Reviews (Shuffle on Load)
const REVIEWS_DB = [
  { t: "A melhor da vida. O toque dele vicia. A finalização foi absurda.", a: "Tiago (Sigilo)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Profissionalismo raro.", a: "Empresário SP", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O visual dele de cueca... nota 1000.", a: "Anônimo", s: 5 },
  { t: "O upgrade vale cada centavo. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Cara bonito, limpo e discreto. Atendeu no meu escritório.", a: "Executivo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Me senti renovado. Energia lá em cima depois da sessão.", a: "Vitor", s: 5 },
  { t: "Extremamente educado e com papo bom, além da massagem top.", a: "Renan", s: 5 },
  { t: "O lubrificante é um detalhe que faz toda diferença.", a: "Paulo", s: 5 },
  { t: "Já fiz com vários, o Thalyson é o melhor da região.", a: "Cliente Antigo", s: 5 },
  { t: "Não economizem, peçam a completa com aromaterapia.", a: "Dica do Beto", s: 5 },
  { t: "Pontualidade britânica. Chegou na hora marcada.", a: "Advogado SP", s: 5 },
  { t: "Fiquei impressionado com a força das mãos dele.", a: "Gym Rat", s: 5 },
  { t: "A finalização manual é intensa mesmo, cumpriu o que prometeu.", a: "Anônimo", s: 5 },
  { t: "Excelente profissional. Me deixou super confortável.", a: "Hétero Curioso", s: 5 },
  { t: "Massagem terapêutica de verdade, tirou todos os nós das costas.", a: "Motorista", s: 5 },
  { t: "O sigilo é garantido mesmo. Pode confiar.", a: "M. (Sigilo)", s: 5 },
  { t: "Experiência sensorial incrível. O cheiro, o toque, a música.", a: "Designer", s: 5 },
  { t: "O corpo a corpo é quente de verdade. Uma experiência única.", a: "J.P.", s: 5 },
  { t: "Gostei que ele respeita os limites, mas entrega muito prazer.", a: "André", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto.", a: "Turista RJ", s: 5 },
  { t: "Saí flutuando. Recomendo para quem tem rotina estressante.", a: "Executivo", s: 5 },
  { t: "Melhor investimento da semana. Relaxamento total.", a: "Bruno", s: 5 },
  { t: "Toque firme, mas sensível. Sabe onde tocar.", a: "Rafa", s: 5 },
  { t: "Gostei da facilidade de agendar pelo app. Sem enrolação.", a: "Tech Guy", s: 5 },
  { t: "Simpático e bonito. O serviço é completo mesmo.", a: "Fã #2", s: 5 },
  { t: "Me ajudou muito com a ansiedade. Gratidão.", a: "Pedro", s: 5 },
  { t: "A massagem tântrica dele desbloqueou sensações novas.", a: "Curioso", s: 5 },
  { t: "Valeu a pena esperar a agenda liberar.", a: "Ricardo", s: 5 },
  { t: "O final foi explosivo. Recomendo.", a: "Anônimo", s: 5 },
  { t: "Muito higiênico e cuidadoso.", a: "Médico", s: 5 },
  { t: "Paz de espírito e corpo relaxado. Obrigado.", a: "Fernando", s: 5 }
];

// ==================================================================================
// 2. UTILITÁRIOS & ESTILOS GLOBAIS (DESIGN SYSTEM)
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: (pattern = 10) => { if (navigator.vibrate) navigator.vibrate(pattern); },
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = new Date(selectedDate); sel.setHours(0,0,0,0);
    if (sel < today) return true; 
    if (sel > today) return false; 
    const [hours] = timeString.split(':').map(Number);
    return hours <= now.getHours() + 1; 
  }
};

const globalStyles = `
:root { --primary: #0A84FF; --accent: #32D74B; --bg-app: #000000; --card-bg: #111111; --border: #222; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Roboto", sans-serif; }
body { background: var(--bg-app); color: #fff; padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden; scroll-behavior: smooth; }
input, button { outline: none; }
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll { -ms-overflow-style: none; scrollbar-width: none; }

/* Animations */
@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }
@keyframes shimmer { 0% {background-position: -200% 0;} 100% {background-position: 200% 0;} }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }

.animate-enter { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-scale { animation: scaleIn 0.4s ease-out forwards; }
.animate-float { animation: float 3s ease-in-out infinite; }
.btn-pulse { animation: pulse-glow 2s infinite; }
.shimmer-text { background: linear-gradient(90deg, #fff 0%, #0A84FF 50%, #fff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 5s linear infinite; }

/* Glassmorphism & Components */
.glass-header { background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.card-base:active { transform: scale(0.98); background: #1a1a1a; }
.card-selected { border-color: var(--primary); background: rgba(10, 132, 255, 0.05); box-shadow: 0 0 30px rgba(10, 132, 255, 0.1); }
.input-field { background: #161616; border: 1px solid #333; color: white; border-radius: 16px; width: 100%; transition: all 0.3s; font-size: 16px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); }
.input-field:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(10,132,255,0.2); background: #222; }
.primary-btn { background: var(--primary); color: white; border-radius: 18px; font-weight: 700; border: none; box-shadow: 0 8px 25px rgba(10, 132, 255, 0.3); position: relative; overflow: hidden; transform: translateZ(0); }
.primary-btn:active { transform: scale(0.96); }

/* Section Management */
.section-blur { opacity: 0.3; filter: blur(4px); pointer-events: none; transition: all 0.6s ease; transform: scale(0.98); }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; transform: scale(1); }
`;

// ==================================================================================
// 3. SUB-COMPONENTES (MODULARES)
// ==================================================================================

const LevelBar = ({ xp }) => {
    // Determina o nível atual
    const currentLevel = LEVELS.slice().reverse().find(l => xp >= l.min) || LEVELS[0];
    const nextLevel = LEVELS.find(l => l.min > xp);
    const progress = nextLevel 
      ? Math.min(100, ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100) 
      : 100;

    return (
        <div className="mb-6 animate-enter">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Nível Atual</span>
                    <div className={`flex items-center gap-2 font-black text-lg ${currentLevel.color}`}>
                        <Crown size={18} fill="currentColor" /> {currentLevel.name.toUpperCase()}
                    </div>
                </div>
                {nextLevel && <span className="text-[10px] text-gray-500">Próximo: {nextLevel.name}</span>}
            </div>
            <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden relative">
                <div className={`h-full ${currentLevel.bg} transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]`} style={{ width: `${progress}%` }}></div>
            </div>
            {currentLevel.name !== 'VIP' && currentLevel.name !== 'ALPHA' && (
                <p className="text-[10px] text-center mt-2 text-gray-400">
                    <span className="text-[#0A84FF]">Dica:</span> Adicione extras para virar VIP e ganhar desconto.
                </p>
            )}
            {currentLevel.name === 'VIP' && (
                <p className="text-[10px] text-center mt-2 text-[#FFD60A] font-bold animate-pulse">
                    PARABÉNS! CUPOM DESBLOQUEADO 🎉
                </p>
            )}
        </div>
    );
};

const LiveBubbles = () => {
    const [msg, setMsg] = useState(null);
    useEffect(() => {
      const cycle = () => {
        setTimeout(() => setMsg(Utils.shuffle(LIVE_NOTIFICATIONS)[0]), 2000);
        setTimeout(() => setMsg(null), 8000);
      };
      cycle();
      const i = setInterval(cycle, 18000);
      return () => clearInterval(i);
    }, []);
    if (!msg) return null;
    return (
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 w-max max-w-[90%] pointer-events-none">
        <div className="bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-full flex items-center gap-2.5 shadow-2xl animate-bubble">
           <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse"></div>
           <span className="text-xs font-bold text-white">{msg}</span>
        </div>
      </div>
    );
};

const ReviewsTicker = () => {
    const [list, setList] = useState([]);
    const [idx, setIdx] = useState(0);
    useEffect(() => { setList(Utils.shuffle([...REVIEWS_DB]).slice(0, 10)); }, []);
    useEffect(() => { if(list.length) { const t = setInterval(() => setIdx(i => (i+1)%list.length), 6000); return () => clearInterval(t); }}, [list]);
    if (!list.length) return null;
    return (
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-6 relative overflow-hidden shadow-lg group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity"><MessageCircle size={40}/></div>
            <div className="flex text-[#FFD60A] mb-2 gap-1">{[...Array(5)].map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div>
            <p className="text-[15px] text-gray-300 italic mb-2 leading-relaxed animate-enter min-h-[44px]" key={idx}>"{list[idx].t}"</p>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1">
                 <Shield size={10} className="text-[#32D74B]"/> {list[idx].a}
            </p>
        </div>
    )
};

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  const [data, setData] = useState(() => {
     try {
       const s = localStorage.getItem('thaly_full_v20');
       if(s) { const p = JSON.parse(s); if(p.date) p.date = new Date(p.date); return p; }
     } catch(e){}
     return { name: '', age: '', medical: false, service: null, date: null, time: null, location: null, street: '', number: '', district: '', comp: '', extras: { upgrade: false, touch: false, aroma: false }, payment: null };
  });

  const [stage, setStage] = useState(0); 
  const [hasCoupon, setHasCoupon] = useState(false);
  const [couponUsed, setCouponUsed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Refs para Scroll Suave
  const refs = {
    top: useRef(null), intro: useRef(null), services: useRef(null), 
    datetime: useRef(null), extras: useRef(null), location: useRef(null), payment: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_full_v20', JSON.stringify(data)); }, [data]);
  useEffect(() => { 
      // Verifica se cupom já foi usado nesta sessão/navegador
      if(localStorage.getItem('thaly_coupon_claimed')) setCouponUsed(true);
      setTimeout(() => setLoading(false), 1200); 
  }, []);

  // CÁLCULO FINANCEIRO & GAMIFICAÇÃO
  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    const base = data.service ? data.service.price : 0;
    if (data.service) xpPoints += data.service.xp;

    const upg = data.extras.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    if (data.extras.upgrade) xpPoints += 25;

    const touch = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    if (data.extras.touch) xpPoints += 30;

    const aroma = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    if (data.extras.aroma) xpPoints += 15;

    const sub = base + upg + touch + aroma;
    const desc = hasCoupon ? CONFIG.COUPON_VAL : 0;
    
    return { 
        financials: { base, upg, touch, aroma, sub, desc, total: Math.max(0, sub - desc) },
        xp: xpPoints
    };
  }, [data.service, data.extras, hasCoupon]);

  const isVip = xp >= CONFIG.XP_THRESHOLDS.VIP;

  const scrollToSection = (sectionRef) => {
    if (sectionRef && sectionRef.current) {
        setTimeout(() => {
            const yOffset = -90; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 200);
    }
  };

  const advanceStage = (next, ref) => {
    Utils.vibrate();
    if(next > stage) setStage(next);
    scrollToSection(ref);
  };

  const generateWhatsappMessage = () => {
    const d = data.date;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    let t = `🦁 *NOVO PEDIDO: EXPERIÊNCIA VIP*\n`;
    t += `------------------------------\n`;
    t += `👤 *Cliente:* ${data.name} (${data.age})\n`;
    t += `📅 *Data:* ${dateStr} às ${data.time}\n`;
    t += `💆 *Serviço:* ${data.service?.name.toUpperCase()}\n`;
    
    if(Object.values(data.extras).some(Boolean)) {
        t += `🔥 *EXTRAS ATIVOS:*\n`;
        if(data.extras.upgrade) t += `+ ⏱️ Upgrade Tempo\n`;
        if(data.extras.touch) t += `+ 😈 Interação Recíproca\n`;
        if(data.extras.aroma) t += `+ 🍃 Aromaterapia\n`;
    }
    
    t += `\n📍 *LOCAL:* ${data.location?.label}\n`;
    if(data.location) t += `📝 ${data.street}, ${data.number} - ${data.district}\n\n`;
    
    t += `💰 *TOTAL FINAL: ${Utils.formatBRL(financials.total)}*\n`;
    if(hasCoupon) t += `🎟️ *Cupom VIP Aplicado*\n`;
    t += `💳 Pagamento: ${data.payment?.toUpperCase()}\n`;
    t += `------------------------------\n`;
    t += `_Aguardo confirmação e chave Pix!_`;
    
    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  // LOADING SCREEN
  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <style>{globalStyles}</style>
      <div className="w-20 h-20 border-4 border-[#111] border-t-[#0A84FF] rounded-full animate-spin mb-6"></div>
      <h1 className="text-3xl font-black tracking-tighter text-white mb-2">THALY.</h1>
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] animate-pulse">Carregando Experiência...</p>
    </div>
  );

  // SUCCESS SCREEN
  if (success) return (
    <div className="min-h-screen bg-[#050505] pt-12 pb-12 px-6 flex flex-col items-center animate-enter text-center">
       <style>{globalStyles}</style>
       <div className="w-24 h-24 bg-[#32D74B]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.4)] animate-scale">
         <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Pedido Realizado!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs leading-relaxed">Sua solicitação foi gerada. Envie a mensagem no WhatsApp para eu confirmar sua vaga imediatamente.</p>

       {/* PREMIUM TICKET */}
       <div className="w-full max-w-sm bg-[#18181b] border border-[#333] rounded-3xl overflow-hidden shadow-2xl relative mb-8">
           <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#32D74B] to-[#0A84FF] animate-pulse"></div>
           <div className="p-6 relative z-10">
              <div className="flex justify-between items-start mb-6 border-b border-[#333] pb-6">
                 <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Serviço</p>
                    <p className="text-white font-bold text-lg">{data.service?.name}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Valor Total</p>
                    <p className="text-[#32D74B] font-bold text-xl">{Utils.formatBRL(financials.total)}</p>
                 </div>
              </div>
              <div className="space-y-4 text-left">
                 <div className="flex items-center gap-3"><CalendarIcon size={18} className="text-[#0A84FF]"/><span className="text-gray-300 font-medium">{data.date?.toLocaleDateString('pt-BR')} às {data.time}</span></div>
                 <div className="flex items-center gap-3"><MapPin size={18} className="text-[#0A84FF]"/><span className="text-gray-300 font-medium">{data.location?.label}</span></div>
                 {data.payment === 'pix' && (
                     <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center cursor-pointer active:bg-white/5" 
                          onClick={()=>{navigator.clipboard.writeText(CONFIG.PIX_KEY); Utils.vibrate()}}>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase mb-1">Chave Pix (Toque p/ Copiar)</p>
                            <p className="text-xs text-white font-mono">{CONFIG.PIX_KEY}</p>
                        </div>
                        <Copy size={16} className="text-gray-500"/>
                     </div>
                 )}
              </div>
           </div>
           {/* Círculos decorativos do ticket */}
           <div className="absolute top-[90px] left-[-10px] w-6 h-6 rounded-full bg-[#050505] z-20"></div>
           <div className="absolute top-[90px] right-[-10px] w-6 h-6 rounded-full bg-[#050505] z-20"></div>
       </div>

       <a href={generateWhatsappMessage()} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm primary-btn py-4 text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform mb-4">
         <MessageCircle size={24} fill="currentColor" /> Enviar no WhatsApp
       </a>
       <button onClick={() => { setSuccess(false); setStage(0); window.scrollTo(0,0); }} className="text-gray-600 font-bold text-xs uppercase py-4 hover:text-white transition-colors">Realizar Novo Pedido</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-48 selection:bg-[#0A84FF] selection:text-white relative">
      <style>{globalStyles}</style>
      <LiveBubbles />
      
      {/* HEADER FIXO */}
      <header ref={refs.top} className="fixed top-0 w-full z-40 glass-header py-3 px-5 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-gradient-to-tr from-[#0A84FF] to-[#0040DD] rounded-lg flex items-center justify-center shadow-lg">
                <span className="font-black text-white text-sm">T.</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">THALY.</span>
        </div>
        <div className="flex items-center gap-3">
            <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-95 transition-transform"><Instagram size={18} className="text-white"/></a>
            <button onClick={() => setHelpOpen(true)} className="p-2 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-95 transition-transform"><HelpCircle size={18} className="text-white"/></button>
        </div>
      </header>

      {/* HELP MODAL */}
      {helpOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-enter">
              <div className="absolute inset-0 bg-black/90 backdrop-blur" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#1C1C1E] w-full max-w-sm rounded-3xl border border-[#333] p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl">Dúvidas Frequentes</h3>
                      <button onClick={()=>setHelpOpen(false)} className="bg-[#333] p-1 rounded-full"><X size={16}/></button>
                  </div>
                  <div className="space-y-4 text-sm text-gray-300">
                      <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                          <p className="font-bold text-white mb-1">É sigiloso?</p>
                          <p>Totalmente. Atendo empresários, casados e figuras públicas. Discrição é o pilar do meu negócio.</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                          <p className="font-bold text-white mb-1">Aceita Cartão?</p>
                          <p>Sim! Pix, Dinheiro e Cartão (Crédito/Débito).</p>
                      </div>
                      <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                          <p className="font-bold text-white mb-1">Tem local próprio?</p>
                          <p>Não. Atendo exclusivamente no seu conforto (Casa, Apto ou Hotel).</p>
                      </div>
                  </div>
                  <button onClick={()=>setHelpOpen(false)} className="w-full mt-6 bg-[#0A84FF] py-3 rounded-xl font-bold">Entendi</button>
              </div>
          </div>
      )}

      <main className="max-w-md mx-auto pt-24 px-5">
        
        {/* 1. INTRODUÇÃO & IDENTIFICAÇÃO */}
        <section ref={refs.intro} className={`transition-all duration-500 ${stage === 0 ? 'section-active' : 'section-blur'}`}>
            <div className="mb-6 mt-2">
                <h1 className="text-[38px] font-extrabold leading-[1.05] tracking-tight mb-3">
                   O Prazer de<br/><span className="shimmer-text">Ser Bem Cuidado.</span>
                </h1>
                <p className="text-gray-400 text-[16px] leading-relaxed max-w-[90%]">
                   Massoterapia masculina profissional. Técnica apurada, sigilo absoluto e a melhor finalização da cidade.
                </p>
            </div>

            <ReviewsTicker />
            <LevelBar xp={xp} />

            <div className="card-base p-6 space-y-5 shadow-2xl border-[#222]">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center"><User size={20} className="text-gray-400"/></div>
                    <div>
                        <p className="text-sm font-bold text-white">Identificação</p>
                        <p className="text-[10px] text-gray-500">Apenas para cadastro interno</p>
                    </div>
                </div>
                <div>
                    <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Seu Nome ou Apelido" className="input-field p-4"/>
                </div>
                <div>
                    <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Sua Idade (Ex: 35)" className="input-field p-4"/>
                </div>
                
                {/* CHECKBOX DE SAUDE CUSTOMIZADO */}
                <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                    className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#161616] border-[#333]'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#555]'}`}>
                        {data.medical && <Check size={14} className="text-white"/>}
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Maior de idade e Saudável</p>
                    </div>
                </div>

                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => advanceStage(1, refs.services)} className="primary-btn w-full py-4 mt-2 flex items-center justify-center gap-2 animate-scale">
                        Iniciar Agendamento <ArrowRight size={20}/>
                    </button>
                )}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} 
                 className={`mt-10 transition-all duration-500 ${stage === 1 ? 'section-active' : stage > 1 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`}
                 onClick={() => {if(stage > 1) { setStage(1); scrollToSection(refs.services); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">01.</span> Escolha a Experiência</h3>
            <div className="space-y-5">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 1) { setData({...data, service: s}); advanceStage(2, refs.datetime); }}}
                        className={`card-base p-6 cursor-pointer relative group overflow-hidden ${data.service?.id === s.id ? 'card-selected' : ''}`}>
                        
                        {s.badge && <div className="absolute top-0 right-0 bg-gradient-to-r from-[#FFD60A] to-[#FFAA00] text-black text-[10px] font-black px-3 py-1.5 rounded-bl-xl shadow-lg z-10">{s.badge}</div>}
                        
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div>
                                <h3 className={`text-xl font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mt-1 tracking-wider">+ {s.xp} XP (NÍVEL)</p>
                            </div>
                            <span className="text-white font-bold bg-[#222] border border-[#333] px-3 py-1 rounded-lg text-sm shadow-inner">{Utils.formatBRL(s.price)}</span>
                        </div>
                        
                        <p className="text-[11px] font-bold text-[#0A84FF] uppercase tracking-wide border border-[#0A84FF]/30 inline-block px-2 py-1 rounded mb-3 bg-[#0A84FF]/5">{s.short}</p>
                        <p className="text-gray-400 text-[15px] leading-relaxed">{s.desc}</p>
                        
                        {/* Glow Effect on Hover */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#0A84FF] blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} 
                 className={`mt-10 transition-all duration-500 ${stage === 2 ? 'section-active' : stage > 2 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`}
                 onClick={() => {if(stage > 2) { setStage(2); scrollToSection(refs.datetime); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">02.</span> Data e Horário</h3>
            <div className="card-base p-6">
                {/* Date Slider */}
                <div className="flex gap-3 overflow-x-auto pb-6 ios-scroll snap-x">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }}
                                className={`snap-center min-w-[70px] h-[86px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-[0_4px_20px_rgba(10,132,255,0.4)] scale-105' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-[22px] font-bold tracking-tight">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                {/* Time Grid */}
                <div className={`grid grid-cols-4 gap-2.5 transition-all duration-500 ${data.date ? 'opacity-100 mt-2' : 'opacity-20 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => {
                        const isBlocked = Utils.isTimeBlocked(data.date, t);
                        return (
                            <button key={t} disabled={isBlocked} onClick={() => { setData({...data, time: t}); advanceStage(3, refs.extras); }}
                                className={`py-3 rounded-xl text-[13px] font-bold border transition-all relative overflow-hidden
                                    ${data.time === t ? 'bg-white text-black border-white shadow-lg scale-[1.02]' : 
                                    isBlocked ? 'bg-transparent text-[#333] border-transparent cursor-not-allowed decoration-slice' : 
                                    'bg-[#161616] border-[#333] text-gray-300 hover:bg-[#222]'}`}>
                                {isBlocked && <div className="absolute inset-0 flex items-center justify-center"><div className="w-[120%] h-[1px] bg-[#333] rotate-45"></div></div>}
                                {t}
                            </button>
                        )
                    })}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS (GAMIFICADO) */}
        <section ref={refs.extras} 
                 className={`mt-10 transition-all duration-500 ${stage === 3 ? 'section-active' : stage > 3 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`}
                 onClick={() => {if(stage > 3) { setStage(3); scrollToSection(refs.extras); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">03.</span> Turbine seu Relaxamento</h3>
            <div className="card-base rounded-[24px] overflow-hidden divide-y divide-[#222]">
                {[
                   { id: 'upgrade', label: '+30 Minutos', sub: 'Estenda o prazer por mais tempo', icon: Clock, price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT, color: 'text-[#0A84FF]', badge: '+25 XP' },
                   { id: 'touch', label: 'Interação / Toque', sub: 'Toques recíprocos permitidos', icon: Flame, price: CONFIG.PRICES.TOUCH, color: 'text-[#FF375F]', badge: '+30 XP' },
                   { id: 'aroma', label: 'Aromaterapia', sub: 'Essências e óleos especiais', icon: Wind, price: CONFIG.PRICES.AROMA, color: 'text-[#32D74B]', badge: '+15 XP' }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }}
                        className="p-6 flex justify-between items-center cursor-pointer active:bg-[#1a1a1a] transition-colors relative">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${data.extras[item.id] ? `bg-current border-current ${item.color}` : 'border-[#333] bg-transparent'}`}>
                                {data.extras[item.id] ? <Check size={18} className="text-black"/> : <item.icon size={18} className="text-gray-500"/>}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-white text-[16px]">{item.label}</p>
                                    {!data.extras[item.id] && <span className="text-[9px] font-bold bg-[#222] text-gray-400 px-1.5 py-0.5 rounded border border-[#333]">{item.badge}</span>}
                                </div>
                                <p className="text-[12px] text-gray-500 mt-0.5">{item.sub}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className={`${item.color} font-bold text-[14px]`}>+ {Utils.formatBRL(item.price)}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <button onClick={() => advanceStage(4, refs.location)} 
                className={`w-full mt-6 py-4 rounded-2xl text-[16px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg 
                ${Object.values(data.extras).some(Boolean) ? 'bg-[#0A84FF] text-white hover:scale-[1.02]' : 'bg-[#1C1C1E] text-gray-400 border border-[#333]'}`}>
                {Object.values(data.extras).some(Boolean) ? 'Confirmar Adicionais' : 'Pular Extras'} <ChevronRight size={20}/>
            </button>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section ref={refs.location} 
                 className={`mt-10 transition-all duration-500 ${stage === 4 ? 'section-active' : stage > 4 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`}
                 onClick={() => {if(stage > 4) { setStage(4); scrollToSection(refs.location); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">04.</span> Local de Atendimento</h3>
            <div className="space-y-4">
                {LOCATIONS.map(loc => {
                    const isSel = data.location?.id === loc.id;
                    return (
                        <div key={loc.id}>
                            <div onClick={() => { setData({...data, location: loc}); }}
                                className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'card-base border-transparent'}`}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#222] text-gray-500'}`}><loc.icon size={22} /></div>
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
        <section ref={refs.payment} className={`mt-10 transition-all duration-500 ${stage === 5 ? 'section-active' : 'hidden opacity-0'}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">05.</span> Pagamento</h3>
            <div className="card-base p-3 rounded-3xl grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(6, null); if(method==='pix'){navigator.clipboard.writeText(CONFIG.PIX_KEY); Utils.vibrate();} }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all active:scale-95 duration-200 ${data.payment === method ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'border-transparent hover:bg-[#1a1a1a]'}`}>
                        {method === 'pix' && <QrCode className="text-[#0A84FF]" size={26}/>}
                        {method === 'dinheiro' && <Banknote className="text-[#32D74B]" size={26}/>}
                        {method === 'cartao' && <CreditCard className="text-[#FFD60A]" size={26}/>}
                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{method}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* CHECKOUT BAR INTELIGENTE (STICKY) */}
      {stage >= 6 && !success && (
        <div className="fixed bottom-0 w-full z-50 animate-enter">
            {/* Gradient Overlay p/ Suavidade */}
            <div className="h-20 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            
            <div className="bg-[#161616]/95 backdrop-blur-2xl border-t border-white/10 p-6 pb-10 rounded-t-[36px] shadow-[0_-10px_60px_rgba(0,0,0,0.8)] max-w-md mx-auto relative ring-1 ring-white/5">
                <div className="w-12 h-1.5 bg-[#333] rounded-full mx-auto mb-8"></div>
                
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Final</p>
                        <div className="flex items-baseline gap-2.5">
                            {hasCoupon && <span className="text-[15px] text-gray-600 line-through decoration-red-500 font-bold">{Utils.formatBRL(financials.sub)}</span>}
                            <span className="text-[36px] font-black text-white tracking-tighter">{Utils.formatBRL(financials.total)}</span>
                        </div>
                    </div>
                    
                    {/* Logica do Cupom Gamificado */}
                    {!hasCoupon && !couponUsed ? (
                        isVip ? (
                             <button onClick={() => { setHasCoupon(true); localStorage.setItem('thaly_coupon_claimed', 'true'); Utils.vibrate([50,50]); }} 
                                     className="h-10 px-4 rounded-full bg-[#FFD60A] text-black font-bold text-xs shadow-[0_0_20px_rgba(255,214,10,0.4)] flex items-center gap-2 animate-bounce">
                                <Ticket size={16} fill="black"/> RESGATAR R$ {CONFIG.COUPON_VAL}
                             </button>
                        ) : (
                             <div className="flex flex-col items-end">
                                 <div className="h-2 w-24 bg-[#333] rounded-full overflow-hidden">
                                     <div className="h-full bg-[#0A84FF]" style={{ width: `${(xp/CONFIG.XP_THRESHOLDS.VIP)*100}%` }}></div>
                                 </div>
                                 <p className="text-[9px] text-gray-400 mt-1">Falta {CONFIG.XP_THRESHOLDS.VIP - xp} XP p/ Cupom</p>
                             </div>
                        )
                    ) : hasCoupon ? (
                        <div className="h-8 px-3 rounded-full bg-[#32D74B]/10 text-[#32D74B] font-bold text-[10px] border border-[#32D74B]/20 flex items-center gap-1"><Check size={12}/> VIP APLICADO</div>
                    ) : null}
                </div>

                <button onClick={() => { setSuccess(true); window.scrollTo(0,0); }} className="primary-btn w-full h-16 rounded-[24px] text-[18px] flex items-center justify-center gap-3">
                    <MessageCircle size={24} fill="currentColor" /> Finalizar Pedido
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
