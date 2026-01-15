import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, ChevronRight, Menu, X, 
  HelpCircle, Instagram, Calendar as CalendarIcon, Clock, User, AlertTriangle, Car, Copy, Info, Sparkles, Navigation, Zap
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO (BUSINESS CORE)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  FIRST_COUPON_VAL: 15.00,
  
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 73, 
    AROMA: 5,
  },
  
  // Gamificação: XP necessário para cada nível
  XP_THRESHOLDS: { MEMBER: 50, VIP: 150, ALPHA: 300 },
  
  URLS: { WHATSAPP: "https://api.whatsapp.com/send" }
};

// LOCAIS SP (PREÇOS DE UBER IDA+VOLTA INCLUSOS)
const LOCATIONS = [
  { id: 'bela_vista', name: 'Bela Vista', fee: 0, zone: 'Base' },
  { id: 'augusta', name: 'Augusta / Centro', fee: 15.00, zone: 'Centro' },
  { id: 'paulista', name: 'Paulista / Jardins', fee: 20.00, zone: 'Nobre' },
  { id: 'higienopolis', name: 'Higienópolis', fee: 25.00, zone: 'Centro' },
  { id: 'pinheiros', name: 'Pinheiros / V. Madalena', fee: 30.00, zone: 'Oeste' },
  { id: 'itaim', name: 'Itaim / V. Olímpia', fee: 35.00, zone: 'Sul' },
  { id: 'moema', name: 'Moema / Ibirapuera', fee: 35.00, zone: 'Sul' },
  { id: 'mariana', name: 'Vila Mariana', fee: 30.00, zone: 'Sul' },
  { id: 'perdizes', name: 'Perdizes / Barra Funda', fee: 30.00, zone: 'Oeste' },
  { id: 'brooklin', name: 'Brooklin / Campo Belo', fee: 40.00, zone: 'Sul' },
  { id: 'tatuape', name: 'Tatuapé / Mooca', fee: 50.00, zone: 'Leste' },
  { id: 'morumbi', name: 'Morumbi', fee: 60.00, zone: 'Sul' },
  { id: 'outra', name: 'Outro Bairro (Consultar)', fee: 0, zone: '?' },
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    desc: 'Massagista de Cueca. O protocolo premium. Inicia de bruços soltando a musculatura, vira de frente com creme e óleos, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    xp: 100
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    desc: 'Foco 100% terapêutico. Ideal para remover dores lombares e pernas cansadas. Toques firmes para tirar o stress, sem toques íntimos.', 
    duration: 60, 
    price: 125, 
    badge: null,
    xp: 50
  },
];

const EXTRAS_OPTS = [
  { id: 'upgrade', label: '+30 Minutos', desc: 'Sessão estendida.', icon: Clock, getPrice: (base) => base * CONFIG.PRICES.UPGRADE_PCT, xp: 30 },
  { id: 'touch', label: 'Interação / Toque', desc: 'Toques recíprocos.', icon: Flame, getPrice: () => CONFIG.PRICES.TOUCH, xp: 40 },
  { id: 'aroma', label: 'Aromaterapia', desc: 'Essências calmantes.', icon: Wind, getPrice: () => CONFIG.PRICES.AROMA, xp: 15 }
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

const REVIEWS = [
  { t: "O toque dele vicia. A finalização foi absurda.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. Surreal.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto.", a: "Empresário", s: 5 },
  { t: "O upgrade vale cada centavo. Não dá vontade de parar.", a: "Roberto", s: 5 },
];

const LIVE_ALERTS = [
  "🔥 João agendou agora", "👀 3 pessoas vendo a agenda", "📅 Sexta-feira quase cheia",
  "✅ Matheus confirmou", "💎 Murilo virou VIP", "🏠 Atendimento Hotel iniciado", 
  "💳 Pix recebido", "🚗 Thalyson a caminho", "✨ Avaliação 5 estrelas recebida",
  "📍 Atendimento na Bela Vista", "🎁 Cupom resgatado", "🔒 Dados seguros"
];

const LOCATION_TYPES = [
  { id: 'home', label: 'Casa', icon: Home },
  { id: 'apto', label: 'Apto', icon: Building },
  { id: 'hotel', label: 'Hotel', icon: Bed },
  { id: 'motel', label: 'Motel', icon: Flame },
];

// ==================================================================================
// 2. ESTILOS GLOBAIS (DESIGN SYSTEM "MIDNIGHT GLASS")
// ==================================================================================

const globalStyles = `
:root { 
  --primary: #0A84FF; 
  --primary-glow: rgba(10, 132, 255, 0.5);
  --bg: #050505; 
  --card: #121212; 
  --border: #222; 
  --success: #32D74B;
  --gold: #FFD60A;
}
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif; }
html { background: var(--bg); }
body { background: var(--bg); color: #fff; overflow-x: hidden; min-height: 100vh; padding-bottom: 120px; }
input, button, select { outline: none; }

/* Scrollbars ocultas */
.hide-scroll::-webkit-scrollbar { display: none; }
.hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

/* Animações de Alta Performance */
@keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 var(--primary-glow); } 70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0px); } }

.anim-enter { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.anim-pop { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.btn-pulse { animation: pulse 2s infinite; }
.anim-float { animation: float 3s ease-in-out infinite; }

/* Componentes UI */
.glass-nav { 
  background: rgba(5, 5, 5, 0.85); 
  backdrop-filter: blur(20px); 
  -webkit-backdrop-filter: blur(20px); 
  border-bottom: 1px solid rgba(255,255,255,0.08); 
  z-index: 100; 
}

.logo-shimmer {
  background: linear-gradient(90deg, #fff 0%, #0A84FF 50%, #fff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s infinite linear;
}

.card-base { 
  background: var(--card); 
  border: 1px solid var(--border); 
  border-radius: 24px; 
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
}
.card-active { 
  border-color: var(--primary); 
  background: linear-gradient(145deg, rgba(10,132,255,0.1) 0%, rgba(18,18,18,0) 100%); 
  box-shadow: 0 8px 32px rgba(10, 132, 255, 0.1); 
  transform: scale(1.01);
}

.input-clean { 
  background: #1C1C1E; 
  border: 1px solid #333; 
  color: white; 
  border-radius: 16px; 
  width: 100%; 
  padding: 16px; 
  font-size: 16px; 
  transition: 0.2s; 
}
.input-clean:focus { 
  border-color: var(--primary); 
  background: #222; 
  box-shadow: 0 0 0 2px rgba(10,132,255,0.2); 
}

.btn-primary { 
  background: linear-gradient(135deg, #0A84FF 0%, #0056B3 100%); 
  color: white; 
  border-radius: 20px; 
  font-weight: 700; 
  border: none; 
  box-shadow: 0 8px 25px rgba(10, 132, 255, 0.3); 
  transition: transform 0.1s;
}
.btn-primary:active { transform: scale(0.96); }
.btn-disabled { opacity: 0.5; pointer-events: none; filter: grayscale(1); }

.section-blur { opacity: 0.3; filter: blur(2px); pointer-events: none; transition: all 0.5s; }
`;

// ==================================================================================
// 3. UTILITÁRIOS ROBUSTOS
// ==================================================================================

const Utils = {
  fmt: (v) => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12); },
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
  isBlocked: (d, t) => {
    if (!d) return true;
    const now = new Date();
    const sel = new Date(d); sel.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    if (sel < today) return true;
    if (sel > today) return false;
    const [h] = t.split(':').map(Number);
    const slot = new Date(); slot.setHours(h, 0, 0, 0);
    return slot < new Date(now.getTime() + 60 * 60000); // Bloqueia próxima 1h
  }
};

// ==================================================================================
// 4. COMPONENTES VISUAIS APRIMORADOS
// ==================================================================================

const LiveStatus = () => {
    const [msg, setMsg] = useState(null);
    useEffect(() => {
        const msgs = Utils.shuffle([...LIVE_ALERTS]);
        let i = 0;
        const interval = setInterval(() => {
            setMsg(msgs[i]);
            i = (i + 1) % msgs.length;
            setTimeout(() => setMsg(null), 4000);
        }, 12000);
        return () => clearInterval(interval);
    }, []);
    if(!msg) return null;
    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-max max-w-[90%] pointer-events-none anim-enter">
            <div className="bg-[#18181b]/95 border border-[#333] px-4 py-2 rounded-full flex items-center gap-2.5 shadow-xl backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse shrink-0"/>
                <span className="text-xs font-bold text-gray-200 truncate">{msg}</span>
            </div>
        </div>
    );
};

const ReviewsCarousel = () => {
    const [idx, setIdx] = useState(0);
    const list = useMemo(() => Utils.shuffle([...REVIEWS]), []);
    useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%list.length), 6000); return () => clearInterval(t); }, [list]);

    return (
        <div className="bg-[#141416] border border-[#222] rounded-3xl p-6 mb-8 shadow-lg flex flex-col justify-between min-h-[160px] relative overflow-hidden group transition-colors hover:border-[#333]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#0A84FF]/10 to-transparent rounded-bl-full pointer-events-none"></div>
            <div>
                <div className="flex text-[#FFD60A] mb-3 gap-1"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                <p className="text-[15px] text-gray-300 italic leading-relaxed font-light anim-enter" key={idx}>"{list[idx].t}"</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <Shield size={14} className="text-[#32D74B]"/>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">{list[idx].a}</p>
            </div>
        </div>
    )
};

const LocationScroller = ({ selected, onSelect }) => (
    <div className="mb-6 -mx-5 px-5">
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scroll snap-x px-1">
            {LOCATIONS.map(loc => (
                <div key={loc.id} onClick={() => onSelect(loc)}
                    className={`snap-center flex-shrink-0 w-36 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selected?.id === loc.id ? 'border-[#0A84FF] bg-[#0A84FF]/10' : 'border-[#27272a] bg-[#18181b]'}`}>
                    <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">{loc.zone}</p>
                    <p className="text-sm font-bold text-white mb-2 leading-tight h-8 flex items-center">{loc.name}</p>
                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                        <span className="text-[9px] text-gray-400">Taxa</span>
                        <span className={`text-[10px] font-bold ${selected?.id === loc.id ? 'text-[#0A84FF]' : 'text-white'}`}>{loc.fee === 0 ? 'Grátis' : Utils.fmt(loc.fee)}</span>
                    </div>
                    {selected?.id === loc.id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0A84FF] shadow-[0_0_10px_#0A84FF]"></div>}
                </div>
            ))}
        </div>
    </div>
);

// ==================================================================================
// 5. APP PRINCIPAL (LÓGICA BLINDADA)
// ==================================================================================

export default function App() {
  // STATE INICIAL SEGURO (ANTI-CRASH)
  const [data, setData] = useState(() => {
     try {
       const s = localStorage.getItem('THALY_V100_ULTIMATE');
       if(s) { 
           const p = JSON.parse(s); 
           if(p.date) p.date = new Date(p.date);
           // Verificação de integridade (se faltar algo, reseta)
           if(!p.location || !p.location.type) throw new Error("Reset"); 
           return p; 
       }
     } catch(e) { localStorage.removeItem('THALY_V100_ULTIMATE'); }
     
     // Estado Padrão
     return { 
         name: '', age: '', medical: false, 
         service: null, date: null, time: null, 
         extras: { upgrade: false, touch: false, aroma: false }, 
         payment: null,
         location: { neighborhood: null, type: 'home', street: '', number: '', apt: '', hotel: '', room: '', motel: '', suite: '' }
     };
  });

  const [stage, setStage] = useState(0); 
  const [couponActive, setCouponActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Histórico de Primeira Vez (Persistente)
  const isFirstTime = !localStorage.getItem('thaly_history_v100');

  const refs = { 
      services: useRef(null), datetime: useRef(null), 
      extras: useRef(null), location: useRef(null), payment: useRef(null) 
  };

  useEffect(() => { localStorage.setItem('THALY_V100_ULTIMATE', JSON.stringify(data)); }, [data]);
  
  useEffect(() => { 
      setTimeout(() => setLoading(false), 500);
      if(isFirstTime && !couponActive && stage === 0) {
          const t = setTimeout(() => setShowPopup(true), 2000);
          return () => clearTimeout(t);
      }
  }, [isFirstTime, couponActive, stage]);

  // CÁLCULO FINANCEIRO
  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    // Uso de ?. e || 0 para evitar crash matemático
    const base = data.service?.price || 0;
    if (data.service) xpPoints += data.service.xp;

    const upg = data.extras?.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    if (data.extras?.upgrade) xpPoints += EXTRAS_OPTS[0].xp;

    const touch = data.extras?.touch ? CONFIG.PRICES.TOUCH : 0;
    if (data.extras?.touch) xpPoints += EXTRAS_OPTS[1].xp;

    const aroma = data.extras?.aroma ? CONFIG.PRICES.AROMA : 0;
    if (data.extras?.aroma) xpPoints += EXTRAS_OPTS[2].xp;

    const travelFee = data.location?.neighborhood?.fee || 0;
    
    const sub = base + upg + touch + aroma + travelFee;
    const desc = couponActive ? CONFIG.FIRST_COUPON_VAL : 0;
    
    return { 
        base, upg, touch, aroma, travelFee, sub, desc, 
        total: Math.max(0, sub - desc),
        locName: data.location?.neighborhood?.name || 'Não Selecionado'
    };
  }, [data, couponActive]);

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
        const y = ref.current.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const advanceStage = (next, ref) => {
    Utils.vibrate();
    if(next > stage) setStage(next);
    setTimeout(() => scrollToRef(ref), 100);
  };

  const finalizeOrder = () => {
      // Grava que o cliente já fez pedido
      if(couponActive || isFirstTime) localStorage.setItem('thaly_history_v100', 'true');
      setSuccess(true);
      window.scrollTo(0,0);
  };

  // WHATSAPP "NOTA FISCAL"
  const generateMessage = () => {
    const d = data.date;
    const loc = data.location;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    
    let t = `🦁 *AGENDAMENTO CONFIRMADO*\n──────────────────\n`;
    t += `👤 *${data.name}* (${data.age}a)\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name}*: ${Utils.fmt(financials.base)}\n`;
    
    if(Object.values(data.extras || {}).some(Boolean)) {
        t += `🔥 *EXTRAS:*\n`;
        if(data.extras?.upgrade) t += `   + Upgrade 30min: ${Utils.fmt(financials.upg)}\n`;
        if(data.extras?.touch) t += `   + Interação: ${Utils.fmt(financials.touch)}\n`;
        if(data.extras?.aroma) t += `   + Aromaterapia: ${Utils.fmt(financials.aroma)}\n`;
    }
    
    t += `\n📍 *LOCAL: ${loc.neighborhood?.name}*\n`;
    if(loc.type === 'home') t += `🏠 Casa: ${loc.street}, ${loc.number}\n`;
    else if (loc.type === 'apto') t += `🏢 Apto: ${loc.street}, ${loc.number} - Ap ${loc.apt}\n`;
    else if (loc.type === 'hotel') t += `🏨 Hotel: ${loc.hotel} (Qto ${loc.room})\n`;
    else if (loc.type === 'motel') { t += `🏩 Motel: ${loc.motel} (Suíte ${loc.suite || '?'})\n`; t += `⚠️ *Cliente paga a suíte*\n`; }

    t += `\n💰 *DETALHAMENTO:*\n`;
    if(financials.travelFee > 0) t += `🚗 Deslocamento: ${Utils.fmt(financials.travelFee)}\n`;
    if(couponActive) t += `🎟️ Desconto 1ª Vez: -${Utils.fmt(financials.desc)}\n`;
    t += `✅ *TOTAL FINAL: ${Utils.fmt(financials.total)}*\n`;
    t += `💳 Pagamento: ${data.payment?.toUpperCase()}\n`;
    
    return `${CONFIG.URLS.WHATSAPP}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const isFormValid = () => {
      const l = data.location;
      if (!l.neighborhood) return false;
      if (l.type === 'home') return l.street && l.number;
      if (l.type === 'apto') return l.street && l.number && l.apt;
      if (l.type === 'hotel') return l.hotel && l.room;
      if (l.type === 'motel') return l.motel;
      return false;
  };

  if (loading) return <div className="fixed inset-0 bg-[#09090b] z-50 flex items-center justify-center text-white font-bold tracking-widest text-xs uppercase animate-pulse">Carregando...</div>;

  if (success) return (
    <div className="min-h-screen bg-[#09090b] pt-20 px-6 flex flex-col items-center text-center anim-enter pb-20">
       <style>{globalStyles}</style>
       <div className="w-20 h-20 bg-[#32D74B]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.2)]">
         <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-black text-white mb-2">Tudo Certo!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs">Pedido gerado com sucesso. Envie no WhatsApp para confirmar.</p>

       <div className="w-full max-w-sm bg-[#18181b] border border-[#333] rounded-3xl p-6 mb-8 text-left shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A84FF] to-[#32D74B]"></div>
           <div className="flex justify-between items-end mb-6 border-b border-[#333] pb-6">
               <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total</p><p className="text-[#32D74B] font-black text-3xl">{Utils.fmt(financials.total)}</p></div>
               <div className="text-right"><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Taxa</p><p className="text-white font-bold">{Utils.fmt(financials.travelFee)}</p></div>
           </div>
           <div className="space-y-3 text-sm text-gray-300">
               <p className="flex items-center gap-3"><MapPin size={16} className="text-[#0A84FF]"/> {financials.locName}</p>
               <p className="flex items-center gap-3"><CalendarIcon size={16} className="text-[#0A84FF]"/> {data.date?.toLocaleDateString()} às {data.time}</p>
           </div>
           {data.payment === 'pix' && <div className="mt-6 p-4 bg-[#27272a] rounded-xl border border-[#333]"><p className="text-[10px] text-[#0A84FF] font-bold uppercase mb-1">Chave Pix</p><p className="text-xs font-mono text-white select-all">{CONFIG.PIX_KEY}</p></div>}
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" className="w-full max-w-sm btn-primary py-4 text-lg flex items-center justify-center gap-2 mb-4">Enviar no WhatsApp <MessageCircle size={22}/></a>
       <button onClick={() => { setSuccess(false); setStage(0); setCouponActive(false); window.scrollTo(0,0); }} className="text-gray-500 font-bold text-xs uppercase py-4">Voltar</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-40 relative">
      <style>{globalStyles}</style>
      <LiveStatus />
      
      {/* HEADER */}
      <header className="fixed top-0 w-full glass-nav py-3 px-5 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-[#0A84FF] rounded-lg flex items-center justify-center shadow-lg"><span className="font-black text-white text-sm">T.</span></div>
            <span className="font-bold text-lg tracking-tight logo-shimmer">THALY.</span>
        </div>
        <div className="flex gap-3">
            <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2 bg-[#27272a] rounded-full"><Instagram size={18}/></a>
            <button onClick={()=>setHelpOpen(true)} className="p-2 bg-[#27272a] rounded-full"><HelpCircle size={18}/></button>
        </div>
      </header>

      {/* POPUP CUPOM (1ª VEZ) */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 anim-enter">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowPopup(false)}/>
            <div className="relative bg-[#18181b] w-full max-w-sm rounded-3xl border border-[#0A84FF]/50 p-6 shadow-2xl text-center">
                <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-full flex items-center justify-center mx-auto mb-4 anim-float">
                    <Ticket size={32} className="text-[#0A84FF]"/>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Ganhou R$ {CONFIG.FIRST_COUPON_VAL}!</h2>
                <p className="text-gray-400 text-sm mb-6">Presente exclusivo de primeira visita.</p>
                <button onClick={() => { setCouponActive(true); setShowPopup(false); Utils.vibrate(); }} className="w-full py-4 rounded-xl btn-primary mb-3 btn-pulse">USAR DESCONTO</button>
                <button onClick={() => setShowPopup(false)} className="text-gray-500 text-xs font-bold uppercase p-2">Dispensar</button>
            </div>
        </div>
      )}

      {/* AJUDA MODAL */}
      {helpOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 anim-enter">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#18181b] w-full max-w-sm rounded-3xl border border-[#222] p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl flex items-center gap-2 text-white"><Info size={20} className="text-[#0A84FF]"/> Guia Rápido</h3>
                      <button onClick={()=>setHelpOpen(false)} className="bg-[#27272a] p-1.5 rounded-full"><X size={16}/></button>
                  </div>
                  <div className="space-y-4">
                      <div className="bg-[#27272a] p-4 rounded-2xl">
                          <h4 className="font-bold text-white text-sm mb-1 flex gap-2"><Sparkles size={14}/> Preparação</h4>
                          <p className="text-xs text-gray-400">Recomendo um banho quente antes. Levo creme, óleos, lubrificantes e som ambiente.</p>
                      </div>
                      <div className="bg-[#27272a] p-4 rounded-2xl">
                          <h4 className="font-bold text-white text-sm mb-1 flex gap-2"><Shield size={14}/> Sigilo & Segurança</h4>
                          <p className="text-xs text-gray-400">Atendimento estritamente profissional. Sigilo total garantido.</p>
                      </div>
                      <div className="bg-[#27272a] p-4 rounded-2xl">
                          <h4 className="font-bold text-white text-sm mb-1 flex gap-2"><Lock size={14}/> Pagamento</h4>
                          <p className="text-xs text-gray-400">Pix, Dinheiro e Cartão. Cancelamento com 2h de antecedência.</p>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <main className="max-w-md mx-auto pt-28 px-5">
        
        {/* 1. INTRODUÇÃO */}
        <section className={`transition-all duration-500 ${stage === 0 ? 'opacity-100' : 'section-disabled'}`}>
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold mb-3 leading-[1.1] tracking-tight">Massagem &<br/><span className="logo-shimmer">Experiência.</span></h1>
                <p className="text-gray-400 text-[15px] leading-relaxed">Massoterapia masculina no conforto do seu local. Técnica apurada e experiência premium.</p>
            </div>

            {/* LEVEL BAR */}
            <div className="mb-8 bg-[#18181b] p-5 rounded-3xl border border-[#222] relative overflow-hidden">
                <div className="flex justify-between items-end mb-3 relative z-10">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Nível VIP</span>
                        <div className="flex items-center gap-2 font-black text-xl mt-0.5">
                            <Crown size={20} className={xp >= CONFIG.XP_THRESHOLDS.VIP ? "text-[#FFD60A]" : "text-gray-500"} /> 
                            <span className={xp >= CONFIG.XP_THRESHOLDS.VIP ? "text-[#FFD60A]" : "text-white"}>
                                {xp >= CONFIG.XP_THRESHOLDS.ALPHA ? 'ALPHA' : xp >= CONFIG.XP_THRESHOLDS.VIP ? 'VIP' : 'MEMBRO'}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-gray-500">XP</span>
                        <span className="text-sm font-bold block text-white">{xp} / 300</span>
                    </div>
                </div>
                <div className="h-2 w-full bg-[#131316] rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000" style={{ width: `${Math.min(100, (xp/300)*100)}%` }}></div>
                </div>
            </div>

            <ReviewsCarousel />

            <div className="card-base p-6 space-y-5 shadow-2xl border-[#222]">
                <div className="space-y-4">
                    <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Seu Nome / Apelido" className="input-clean"/>
                    <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Sua Idade" className="input-clean"/>
                </div>
                <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#27272a] border-[#333]'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444]'}`}>{data.medical && <Check size={14} className="text-white"/>}</div>
                    <p className="text-sm font-bold text-white">Sou maior de idade e saudável</p>
                </div>
                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => { setStage(1); window.scrollTo(0, 400); }} className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-2 anim-enter">Começar Agendamento <ArrowRight size={20}/></button>
                )}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-12 transition-opacity duration-500 ${stage >= 1 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">01.</span> Escolha</h3>
            <div className="space-y-5">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 1) { setData({...data, service: s}); advanceStage(2, refs.datetime); }}} className={`card-base p-6 cursor-pointer relative group ${data.service?.id === s.id ? 'card-active' : ''}`}>
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-3 py-1.5 rounded-bl-2xl shadow-lg">{s.badge}</div>}
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-white">{s.name}</h3>
                            <span className="text-white font-bold bg-[#27272a] px-3 py-1 rounded-lg text-sm">{Utils.fmt(s.price)}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`mt-12 transition-opacity duration-500 ${stage >= 2 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">02.</span> Agenda</h3>
            <div className="card-base p-6 border-[#222]">
                <div className="flex gap-3 overflow-x-auto pb-6 hide-scroll snap-x">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} className={`snap-center min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#27272a] border-[#3f3f46] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`grid grid-cols-4 gap-3 mt-2 ${data.date ? '' : 'opacity-30 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => (
                        <button key={t} disabled={Utils.isBlocked(data.date, t)} onClick={() => { setData({...data, time: t}); advanceStage(3, refs.extras); }} className={`py-3 rounded-xl text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black' : Utils.isBlocked(data.date, t) ? 'opacity-20 line-through border-transparent' : 'bg-[#27272a] border-[#3f3f46] text-gray-300'}`}>{t}</button>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={`mt-12 transition-opacity duration-500 ${stage >= 3 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">03.</span> Adicionais</h3>
            <div className="card-base divide-y divide-[#27272a]">
                {EXTRAS_OPTS.map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#27272a] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${data.extras?.[item.id] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#3f3f46]'}`}>{data.extras?.[item.id] ? <Check size={16} className="text-white"/> : <item.icon size={16} className="text-gray-500"/>}</div>
                            <div><p className="font-bold text-white text-base">{item.label}</p><p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p></div>
                        </div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.fmt(item.getPrice(data.service?.price || 0))}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => advanceStage(4, refs.location)} className="w-full mt-5 py-4 rounded-xl text-sm font-bold bg-[#27272a] text-gray-300 border border-[#3f3f46]">Continuar</button>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section ref={refs.location} className={`mt-12 transition-opacity duration-500 ${stage >= 4 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">04.</span> Localização</h3>
            
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-3 ml-1">Selecione o Bairro (Taxa Uber Ida+Volta)</p>
            <LocationScroller selected={data.location.neighborhood} onSelect={(loc) => setData({...data, location: {...data.location, neighborhood: loc}})} />

            <div className="grid grid-cols-4 gap-3 mb-5">
                {LOCATION_TYPES.map(t => (
                    <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${data.location.type === t.id ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#18181b] border-[#3f3f46] text-gray-500'}`}>
                        <t.icon size={20} className="mb-1.5"/>
                        <span className="text-[10px] font-bold uppercase">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="card-base p-6 border-[#3f3f46] space-y-4">
                {data.location.type === 'home' && <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-clean w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-clean w-1/3"/></div>}
                {data.location.type === 'apto' && (
                    <>
                        <input placeholder="Rua / Avenida" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-clean"/>
                        <div className="flex gap-3"><input placeholder="Nº Prédio" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-clean w-1/2"/><input placeholder="Nº Apto" type="tel" value={data.location.apt} onChange={e => setData({...data, location: {...data.location, apt: e.target.value}})} className="input-clean w-1/2"/></div>
                    </>
                )}
                {data.location.type === 'hotel' && (
                    <>
                        <input placeholder="Nome do Hotel" value={data.location.hotel} onChange={e => setData({...data, location: {...data.location, hotel: e.target.value}})} className="input-clean"/>
                        <input placeholder="Nº Quarto" type="tel" value={data.location.room} onChange={e => setData({...data, location: {...data.location, room: e.target.value}})} className="input-clean"/>
                    </>
                )}
                {data.location.type === 'motel' && (
                    <>
                        <input placeholder="Nome do Motel" value={data.location.motel} onChange={e => setData({...data, location: {...data.location, motel: e.target.value}})} className="input-clean"/>
                        <input placeholder="Suíte (Ex: Hidro)" value={data.location.suite} onChange={e => setData({...data, location: {...data.location, suite: e.target.value}})} className="input-clean"/>
                        <p className="text-[10px] text-yellow-500 flex items-center gap-1.5"><AlertTriangle size={12}/> O valor da suíte é pago por você.</p>
                    </>
                )}
                <button disabled={!isFormValid()} onClick={() => advanceStage(5, refs.payment)} className="btn-primary w-full py-4 mt-2 disabled:opacity-50">Confirmar Endereço</button>
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`mt-10 transition-opacity duration-500 ${stage === 5 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">05.</span> Forma de Pagamento</h3>
            <div className="card-base p-4 grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(m => (
                    <button key={m} onClick={() => { setData({...data, payment: m}); }} 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${data.payment === m ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'border-[#333] hover:bg-[#1A1A1E]'}`}>
                        {m==='pix' && <QrCode className="text-[#0A84FF]"/>}
                        {m==='dinheiro' && <Banknote className="text-[#32D74B]"/>}
                        {m==='cartao' && <CreditCard className="text-[#FFD60A]"/>}
                        <span className="text-[10px] font-bold uppercase tracking-wider">{m}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* CHECKOUT BAR */}
      {stage >= 5 && !success && (
        <div className="fixed bottom-0 w-full z-50 anim-enter">
            <div className="bg-[#18181b]/95 border-t border-[#333] p-6 rounded-t-[32px] shadow-[0_-10px_60px_rgba(0,0,0,0.9)] backdrop-blur-md">
                <div className="flex justify-between items-end mb-5">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Total (+ Deslocamento)</p>
                        <div className="flex items-baseline gap-2">
                            {couponActive && <span className="text-xs text-gray-500 line-through decoration-red-500">{Utils.fmt(financials.sub)}</span>}
                            <span className="text-4xl font-black text-white tracking-tighter">{Utils.fmt(financials.total)}</span>
                        </div>
                    </div>
                    {couponActive && <div className="text-[10px] text-[#32D74B] font-bold border border-[#32D74B] px-3 py-1.5 rounded-full bg-[#32D74B]/10 flex items-center gap-1"><Check size={12}/> DESCONTO ATIVO</div>}
                </div>
                <button disabled={!data.payment} onClick={finalizeOrder} className="btn-primary w-full h-16 text-lg flex items-center justify-center gap-3 disabled:opacity-50">Finalizar Pedido <MessageCircle size={24} fill="currentColor"/></button>
            </div>
        </div>
      )}
    </div>
  );
}
