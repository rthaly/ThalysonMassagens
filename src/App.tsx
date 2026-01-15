import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, ChevronRight, Menu, X, 
  HelpCircle, Instagram, Calendar as CalendarIcon, Clock, User, AlertTriangle, Car, Copy, Info, Sparkles
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS (FIXOS)
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
  
  XP_THRESHOLDS: { VIP: 150, ALPHA: 300 },
  URLS: { WHATSAPP_API: "https://api.whatsapp.com/send" }
};

// LOCAIS SP (TAXAS IDA+VOLTA JÁ CALCULADAS)
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
    short: 'Premium + Finalização',
    // DESCRIÇÃO ORIGINAL RESTAURADA
    desc: 'Massagista de Cueca. O protocolo premium. Inicia de bruços soltando a musculatura, vira de frente com creme e óleos, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    xp: 100
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico e relaxante. Ideal para remover dores lombares, pernas cansadas. Toques suaves para relaxar e tirar o stress, sem toques íntimos.', 
    duration: 60, 
    price: 125, 
    badge: null,
    xp: 50
  },
];

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const LEVELS = [
  { name: 'Visitante', min: 0, color: 'text-gray-400', bg: 'bg-gray-700' },
  { name: 'Membro', min: 50, color: 'text-blue-400', bg: 'bg-blue-600' },
  { name: 'VIP', min: 150, color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]' }, 
  { name: 'ALPHA', min: 300, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]' }
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita.", a: "Tiago", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto.", a: "Empresário", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena.", a: "Roberto", s: 5 },
  { t: "Visual nota 1000. Profissionalismo raro.", a: "Carlos A.", s: 5 },
  { t: "Ambiente relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Gostei bastante, me senti bem relaxado depois.", a: "Alan SP", s: 5 },
  { t: "O corpo a corpo é quente de verdade.", a: "J.P.", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto.", a: "Turista RJ", s: 5 },
  { t: "Cara bonito, limpo e com pegada. O pacote completo.", a: "Anônimo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Extremamente educado e com papo bom.", a: "Renan", s: 5 },
];

const LIVE_NOTIFICATIONS = [
  "🔥 João agendou agora", "👀 3 pessoas vendo a agenda", "📅 Sexta-feira quase cheia",
  "⭐ Pedro avaliou com 5 estrelas", "✅ Matheus confirmou", "💎 Murilo virou VIP",
  "🏠 Atendimento Hotel iniciado", "🚀 Bruno fechou pacote completo", "😈 Felipe adicionou interação",
  "🍃 Gustavo pediu Aromaterapia", "💳 Pix recebido", "🏳️‍🌈 Novo cliente cadastrado",
  "🚗 Thalyson a caminho", "✨ Avaliação 5 estrelas", "📍 Atendimento Bela Vista", 
  "🎁 Cupom resgatado", "🔒 Dados seguros", "🛁 Banho tomado, pronto", 
  "⚡ Ricardo agendou", "🏩 Chegando no Motel"
];

const LOCATION_TYPES = [
  { id: 'home', label: 'Casa', icon: Home },
  { id: 'apto', label: 'Apto', icon: Building },
  { id: 'hotel', label: 'Hotel', icon: Bed },
  { id: 'motel', label: 'Motel', icon: Flame },
];

// ==================================================================================
// 2. ESTILOS GLOBAIS (PREMIUM & LIGHTWEIGHT)
// ==================================================================================

const styles = `
:root { --primary: #0A84FF; --bg: #09090b; --card: #18181b; --border: #27272a; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
html, body { background: var(--bg); color: #fff; overflow-x: hidden; height: 100%; scroll-behavior: smooth; }
input, button { outline: none; }

.hide-scroll::-webkit-scrollbar { display: none; }
.hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
@keyframes pulse-soft { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }

.animate-fade { animation: fadeIn 0.6s ease-out forwards; }
.animate-pop { animation: scaleUp 0.4s cubic-bezier(0.17, 0.67, 0.23, 1.4) forwards; }
.animate-float { animation: float 3s ease-in-out infinite; }
.btn-pulse { animation: pulse-soft 2s infinite; }

.glass-nav { background: rgba(9, 9, 11, 0.95); border-bottom: 1px solid rgba(255,255,255,0.05); z-index: 50; }
.card-base { background: var(--card); border: 1px solid var(--border); border-radius: 20px; transition: all 0.2s; }
.card-active { border-color: var(--primary); background: rgba(10,132,255,0.05); }
.input-clean { background: #27272a; border: 1px solid #3f3f46; color: white; border-radius: 12px; width: 100%; padding: 14px; font-size: 16px; transition: all 0.2s; }
.input-clean:focus { border-color: var(--primary); background: #3f3f46; }
.btn-primary { background: linear-gradient(to right, #0A84FF, #0066CC); color: white; border-radius: 16px; font-weight: 700; border: none; box-shadow: 0 4px 20px rgba(10, 132, 255, 0.25); }
.btn-primary:active { transform: scale(0.98); }
.btn-disabled { opacity: 0.5; pointer-events: none; }
`;

// ==================================================================================
// 3. UTILITÁRIOS (SEGURANÇA FINANCEIRA)
// ==================================================================================

const Utils = {
  fmt: (v) => v ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00',
  vibrate: () => { if (navigator.vibrate) navigator.vibrate(10); },
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
    return slot < new Date(now.getTime() + 30 * 60000); 
  }
};

// ==================================================================================
// 4. COMPONENTES
// ==================================================================================

const Header = ({ onReload, onHelp }) => (
  <header className="fixed top-0 w-full glass-nav py-3 px-5 flex justify-between items-center transition-all">
    <div className="flex items-center gap-2" onClick={onReload}>
       <div className="w-8 h-8 bg-[#0A84FF] rounded-lg flex items-center justify-center shadow-lg"><span className="font-black text-white text-sm">T.</span></div>
       <span className="font-bold text-lg tracking-tight text-white">THALY.</span>
    </div>
    <div className="flex gap-3">
        <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2 bg-[#27272a] rounded-full"><Instagram size={18}/></a>
        <button onClick={onHelp} className="p-2 bg-[#27272a] rounded-full"><HelpCircle size={18}/></button>
    </div>
  </header>
);

const LiveStatus = () => {
    const [msg, setMsg] = useState(null);
    const [pool, setPool] = useState([]);
    useEffect(() => { setPool(Utils.shuffle([...LIVE_NOTIFICATIONS])); }, []);
    useEffect(() => {
        if(pool.length === 0) return;
        const timer = setInterval(() => {
            setPool(prev => {
                if (prev.length === 0) return Utils.shuffle([...LIVE_NOTIFICATIONS]);
                const [next, ...rest] = prev;
                setMsg(next);
                setTimeout(() => setMsg(null), 4000);
                return rest;
            });
        }, 12000);
        return () => clearInterval(timer);
    }, [pool]);

    if(!msg) return null;
    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-max max-w-[90%] pointer-events-none animate-fade">
            <div className="bg-[#18181b]/95 border border-[#333] px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse"/>
                <span className="text-xs font-bold text-gray-200">{msg}</span>
            </div>
        </div>
    );
};

const ReviewsTicker = () => {
    const [idx, setIdx] = useState(0);
    const list = useMemo(() => Utils.shuffle([...REVIEWS_DB]), []);
    useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%list.length), 6000); return () => clearInterval(t); }, [list]);

    return (
        <div className="bg-[#141416] border border-[#222] rounded-3xl p-6 mb-8 shadow-lg flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#0A84FF]/10 to-transparent rounded-bl-full transition-opacity group-hover:opacity-50"></div>
            <div>
                <div className="flex text-[#FFD60A] mb-3 gap-1"><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/></div>
                <p className="text-[15px] text-gray-300 italic leading-relaxed font-light">"{list[idx].t}"</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <Shield size={12} className="text-[#32D74B]"/>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">{list[idx].a}</p>
            </div>
        </div>
    )
};

const LocationSelector = ({ selected, onSelect }) => {
    return (
        <div className="mb-6 -mx-5 px-5">
            <div className="flex gap-3 overflow-x-auto pb-6 hide-scroll snap-x px-1">
                {LOCATIONS.map(loc => (
                    <div key={loc.id} onClick={() => onSelect(loc)}
                        className={`snap-center flex-shrink-0 w-40 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selected?.id === loc.id ? 'border-[#0A84FF] bg-[#0A84FF]/10' : 'border-[#222] bg-[#141416]'}`}>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">{loc.zone}</p>
                        <p className="text-sm font-bold text-white mb-2 leading-tight h-10">{loc.name}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <span className="text-[10px] text-gray-400">Ida+Volta</span>
                            <span className={`text-xs font-bold ${selected?.id === loc.id ? 'text-[#0A84FF]' : 'text-white'}`}>{loc.fee === 0 ? 'Grátis' : Utils.fmt(loc.fee)}</span>
                        </div>
                        {selected?.id === loc.id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0A84FF] shadow-[0_0_10px_#0A84FF]"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const CouponPopup = ({ onClose, onAccept }) => (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}/>
        <div className="relative bg-[#18181b] w-full max-w-sm rounded-3xl border border-[#0A84FF]/50 p-6 shadow-[0_0_50px_rgba(10,132,255,0.2)] animate-pop text-center">
            <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <Ticket size={32} className="text-[#0A84FF]"/>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Você ganhou R$ {CONFIG.FIRST_COUPON_VAL}!</h2>
            <p className="text-gray-400 text-sm mb-6">Como é sua primeira vez aqui, liberei um desconto especial para você conhecer meu trabalho.</p>
            <button onClick={onAccept} className="w-full py-4 rounded-xl bg-[#0A84FF] text-white font-bold text-lg mb-3 shadow-lg btn-pulse">RESGATAR AGORA</button>
            <button onClick={onClose} className="text-gray-500 text-xs font-bold uppercase tracking-wider p-2">Dispensar por enquanto</button>
        </div>
    </div>
);

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  // STATE SEGURO (ANTI-CRASH)
  const [data, setData] = useState(() => {
     try {
       // CHAVE NOVA: thaly_system_v2024
       const s = localStorage.getItem('thaly_system_v2024');
       if(s) { 
           const p = JSON.parse(s); 
           if(p.date) p.date = new Date(p.date);
           // Validação de integridade
           if(!p.location || !p.location.type) throw new Error("Reset"); 
           return p; 
       }
     } catch(e) { localStorage.removeItem('thaly_system_v2024'); }
     
     // Estado Inicial Limpo
     return { 
         name: '', age: '', medical: false, 
         service: null, date: null, time: null, 
         extras: { upgrade: false, touch: false, aroma: false }, 
         payment: null,
         location: { id: null, type: 'home', street: '', number: '', apt: '', hotel: '', room: '', motel: '', suite: '' }
     };
  });

  const [stage, setStage] = useState(0); 
  const [couponActive, setCouponActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Histórico para saber se é 1ª vez
  const isFirstTime = !localStorage.getItem('thaly_history_complete');

  // Rola suave
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => { localStorage.setItem('thaly_system_v2024', JSON.stringify(data)); }, [data]);
  
  useEffect(() => { 
      setTimeout(() => setLoading(false), 600);
      
      const onScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener('scroll', onScroll);

      // Trigger do Popup de Cupom
      if(isFirstTime && !couponActive && stage === 0) {
          const t = setTimeout(() => setShowPopup(true), 2000);
          return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll); }
      }
      return () => window.removeEventListener('scroll', onScroll);
  }, [isFirstTime, couponActive, stage]);

  // CALCULO FINANCEIRO BLINDADO
  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    // Uso de ?. para evitar crash
    const base = data.service?.price || 0;
    if (data.service) xpPoints += data.service.xp;

    const upg = data.extras?.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    if (data.extras?.upgrade) xpPoints += 25;

    const touch = data.extras?.touch ? CONFIG.PRICES.TOUCH : 0;
    if (data.extras?.touch) xpPoints += 30;

    const aroma = data.extras?.aroma ? CONFIG.PRICES.AROMA : 0;
    if (data.extras?.aroma) xpPoints += 15;

    const loc = LOCATIONS.find(l => l.id === data.location?.id);
    const travelFee = loc ? loc.fee : 0;
    
    const sub = base + upg + touch + aroma + travelFee;
    const desc = couponActive ? CONFIG.FIRST_COUPON_VAL : 0;
    
    return { 
        base, upg, touch, aroma, travelFee, sub, desc, 
        total: Math.max(0, sub - desc),
        locName: loc ? loc.name : ''
    };
  }, [data, couponActive]);

  const finalizeOrder = () => {
      // Se usou cupom ou é primeira vez, marca como usado
      if(couponActive || isFirstTime) localStorage.setItem('thaly_history_complete', 'true');
      setSuccess(true);
      scrollToTop();
  };

  const generateMessage = () => {
    const d = data.date;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    let t = `🦁 *PEDIDO DE AGENDAMENTO*\n──────────────────\n`;
    t += `👤 *${data.name}* (${data.age})\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name}*: ${Utils.fmt(financials.base)}\n`;
    
    if(Object.values(data.extras).some(Boolean)) {
        t += `🔥 *EXTRAS:*\n`;
        if(data.extras.upgrade) t += `   + Upgrade 30min: ${Utils.fmt(financials.upg)}\n`;
        if(data.extras.touch) t += `   + Interação: ${Utils.fmt(financials.touch)}\n`;
        if(data.extras.aroma) t += `   + Aromaterapia: ${Utils.fmt(financials.aroma)}\n`;
    }
    
    t += `\n📍 *LOCAL: ${financials.locName}*\n`;
    if(data.location.type === 'home') t += `🏠 Casa: ${data.location.street}, ${data.location.number}\n`;
    else if (data.location.type === 'apto') t += `🏢 Apto: ${data.location.street}, ${data.location.number} - Ap ${data.location.apt}\n`;
    else if (data.location.type === 'hotel') t += `🏨 Hotel: ${data.location.hotel} (Qto ${data.location.room})\n`;
    else if (data.location.type === 'motel') { t += `🏩 Motel: ${data.location.motel} (Suíte ${data.location.suite})\n`; t += `⚠️ *Eu pago a suíte*\n`; }

    t += `\n💰 *RESUMO FINANCEIRO:*\n`;
    if(financials.travelFee > 0) t += `🚗 Deslocamento: ${Utils.fmt(financials.travelFee)}\n`;
    if(couponActive) t += `🎟️ Desconto 1ª Vez: -${Utils.fmt(financials.desc)}\n`;
    t += `✅ *TOTAL: ${Utils.fmt(financials.total)}*\n`;
    t += `💳 Pagamento: ${data.payment?.toUpperCase()}\n`;
    
    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const isFormValid = () => {
      const l = data.location;
      if (!l.id) return false;
      if (l.type === 'home') return l.street && l.number;
      if (l.type === 'apto') return l.street && l.number && l.apt;
      if (l.type === 'hotel') return l.hotel && l.room;
      if (l.type === 'motel') return l.motel;
      return false;
  };

  if (loading) return <div className="fixed inset-0 bg-[#09090b] z-50 flex items-center justify-center text-white font-bold tracking-widest text-xs uppercase animate-pulse">Carregando...</div>;

  if (success) return (
    <div className="min-h-screen bg-[#09090b] pt-20 px-6 flex flex-col items-center text-center animate-fade">
       <style>{styles}</style>
       <div className="w-24 h-24 bg-[#32D74B]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.2)]">
         <Check className="w-12 h-12 text-[#32D74B]" strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-black text-white mb-2">Pedido Pronto!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs">Agora é só enviar a confirmação gerada para o meu WhatsApp.</p>

       <div className="w-full max-w-sm bg-[#18181b] border border-[#333] rounded-3xl p-6 mb-8 text-left shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A84FF] to-[#32D74B]"></div>
           <div className="flex justify-between items-end mb-6 border-b border-[#333] pb-6">
               <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Final</p><p className="text-[#32D74B] font-black text-3xl">{Utils.fmt(financials.total)}</p></div>
               <div className="text-right"><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Taxa</p><p className="text-white font-bold">{Utils.fmt(financials.travelFee)}</p></div>
           </div>
           <div className="space-y-3 text-sm text-gray-300">
               <p className="flex items-center gap-3"><MapPin size={16} className="text-[#0A84FF]"/> {financials.locName}</p>
               <p className="flex items-center gap-3"><CalendarIcon size={16} className="text-[#0A84FF]"/> {data.date?.toLocaleDateString()} às {data.time}</p>
           </div>
           {data.payment === 'pix' && <div className="mt-6 p-4 bg-[#27272a] rounded-xl border border-[#333]"><p className="text-[10px] text-[#0A84FF] font-bold uppercase mb-1">Chave Pix</p><p className="text-xs font-mono text-white">{CONFIG.PIX_KEY}</p></div>}
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" className="w-full max-w-sm btn-primary py-4 text-lg flex items-center justify-center gap-2 mb-4">Enviar no WhatsApp <MessageCircle size={22}/></a>
       <button onClick={() => { setSuccess(false); setStage(0); setCouponActive(false); scrollToTop(); }} className="text-gray-500 font-bold text-xs uppercase py-4">Fazer Novo Pedido</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-40 relative">
      <style>{styles}</style>
      <LiveStatus />
      <Header onReload={()=>window.location.reload()} onHelp={()=>setHelpOpen(true)} />

      {/* POPUP CUPOM */}
      {showPopup && <CouponPopup onClose={() => setShowPopup(false)} onAccept={() => { setCouponActive(true); setShowPopup(false); Utils.vibrate(); }} />}

      {/* AJUDA */}
      {helpOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#18181b] w-full max-w-sm rounded-3xl border border-[#222] p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl flex items-center gap-2 text-white"><Info size={20} className="text-[#0A84FF]"/> Guia Rápido</h3>
                      <button onClick={()=>setHelpOpen(false)} className="bg-[#222] p-1.5 rounded-full text-gray-400 hover:text-white"><X size={16}/></button>
                  </div>
                  <div className="space-y-6">
                      <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                          <div><h3 className="font-bold text-white text-sm">O Serviço</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Massagem profissional masculina realizada no conforto do seu local (Apt, Casa, Suíte e Hotel).</p></div>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                          <div><h3 className="font-bold text-white text-sm">Preparação</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Recomendo um banho quente antes. Levo creme, óleos, lubrificantes e aromatizador.</p></div>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                          <div><h3 className="font-bold text-white text-sm">Segurança</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Sigilo total garantido. Atendimento discreto e respeitoso.</p></div>
                      </div>
                      <div className="bg-[#1A1A1E] p-4 rounded-xl border border-[#333]">
                          <h4 className="font-bold text-white text-xs uppercase mb-2 flex items-center gap-2"><Lock size={12}/> Pagamento & Cancelamento</h4>
                          <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                              <li>Pagamento direto via Pix, Cartão e Dinheiro.</li>
                              <li>Cancelamentos com min. 2 horas de antecedência.</li>
                              <li>Taxa de deslocamento pode variar conforme distância.</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <main className="max-w-md mx-auto pt-28 px-5">
        
        {/* 1. INTRODUÇÃO & GAMIFICAÇÃO */}
        <section className={`transition-all duration-500 ${stage === 0 ? 'opacity-100' : 'section-disabled'}`}>
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold mb-3 leading-[1.1] tracking-tight">Massagem &<br/><span className="logo-shimmer">Experiência.</span></h1>
                <p className="text-gray-400 text-[15px] leading-relaxed">Massoterapia masculina no conforto do seu local. Técnica apurada e experiência premium.</p>
            </div>

            {/* LEVEL BAR (XP GAMIFICAÇÃO) */}
            <div className="mb-8 bg-[#18181b] p-5 rounded-3xl border border-[#222] relative overflow-hidden">
                <div className="flex justify-between items-end mb-3 relative z-10">
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status VIP</span>
                        <div className={`flex items-center gap-2 font-black text-xl mt-0.5`}>
                            <Crown size={20} className={xp >= CONFIG.XP_THRESHOLDS.VIP ? "text-[#FFD60A]" : "text-gray-500"} /> 
                            <span className={xp >= CONFIG.XP_THRESHOLDS.VIP ? "text-[#FFD60A]" : "text-white"}>
                                {xp >= CONFIG.XP_THRESHOLDS.ALPHA ? 'ALPHA' : xp >= CONFIG.XP_THRESHOLDS.VIP ? 'VIP' : 'MEMBRO'}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-gray-500">XP Atual</span>
                        <span className="text-sm font-bold block text-white">{xp} <span className="text-gray-600">/ 300</span></span>
                    </div>
                </div>
                <div className="h-3 w-full bg-[#131316] rounded-full overflow-hidden relative z-10 box-border border border-[#222]">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, (xp/300)*100)}%` }}></div>
                </div>
            </div>

            <ReviewsTicker />

            <div className="card-base p-6 space-y-5 shadow-2xl border-[#222]">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Seus Dados</label>
                        <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Seu Nome ou Apelido" className="input-clean"/>
                    </div>
                    <div>
                        <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Sua Idade (Ex: 30)" className="input-clean"/>
                    </div>
                </div>
                
                <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#18181b] border-[#333]'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444]'}`}>{data.medical && <Check size={14} className="text-white"/>}</div>
                    <p className={`text-sm font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Sou maior de idade e saudável</p>
                </div>

                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => { setStage(1); window.scrollTo(0, 400); }} className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-2 animate-enter">Começar Agendamento <ArrowRight size={20}/></button>
                )}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section className={`mt-12 transition-opacity duration-500 ${stage >= 1 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">01.</span> Experiência</h3>
            <div className="space-y-5">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 1) { setData({...data, service: s}); setStage(2); window.scrollTo(0, 800); }}} className={`card-base p-6 cursor-pointer relative group ${data.service?.id === s.id ? 'card-active' : ''}`}>
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-3 py-1.5 rounded-bl-2xl shadow-lg z-10">{s.badge}</div>}
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div><h3 className={`text-xl font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3></div>
                            <span className="text-white font-bold bg-[#18181b] border border-[#333] px-3 py-1 rounded-lg text-sm">{Utils.fmt(s.price)}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section className={`mt-12 transition-opacity duration-500 ${stage >= 2 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">02.</span> Data e Hora</h3>
            <div className="card-base p-6 border-[#222]">
                <div className="flex gap-3 overflow-x-auto pb-6 hide-scroll snap-x">
                    {[...Array(10)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} className={`snap-center min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#18181b] border-[#3f3f46] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`grid grid-cols-4 gap-3 mt-2 ${data.date ? '' : 'opacity-30 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => (
                        <button key={t} disabled={Utils.isBlocked(data.date, t)} onClick={() => { setData({...data, time: t}); setStage(3); window.scrollTo(0, 1200); }} className={`py-3 rounded-xl text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black' : Utils.isBlocked(data.date, t) ? 'opacity-20 line-through border-transparent' : 'bg-[#18181b] border-[#3f3f46] text-gray-300'}`}>{t}</button>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section className={`mt-12 transition-opacity duration-500 ${stage >= 3 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">03.</span> Adicionais</h3>
            <div className="card-base divide-y divide-[#27272a]">
                {[
                   { id: 'upgrade', label: '+30 Minutos', desc: 'Mais tempo para curtir cada detalhe.', icon: Clock, price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT },
                   { id: 'touch', label: 'Interação / Toque', desc: 'Você no controle. Toques recíprocos.', icon: Flame, price: CONFIG.PRICES.TOUCH },
                   { id: 'aroma', label: 'Aromaterapia', desc: 'Óleos essenciais que acalmam a mente.', icon: Wind, price: CONFIG.PRICES.AROMA }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#18181b] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${data.extras?.[item.id] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#3f3f46]'}`}>{data.extras?.[item.id] ? <Check size={16} className="text-white"/> : <item.icon size={16} className="text-gray-500"/>}</div>
                            <div>
                                <p className="font-bold text-white text-base">{item.label}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.fmt(item.price)}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => { setStage(4); window.scrollTo(0, 1600); }} className="w-full mt-5 py-4 rounded-xl text-sm font-bold bg-[#18181b] text-gray-300 border border-[#3f3f46]">Continuar</button>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section className={`mt-12 transition-opacity duration-500 ${stage >= 4 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">04.</span> Localização</h3>
            
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-3 ml-1">Selecione o Bairro (Taxa Uber Ida+Volta)</p>
            <LocationSelector selected={data.location.neighborhood} onSelect={(loc) => setData({...data, location: {...data.location, neighborhood: loc}})} />

            <div className="grid grid-cols-4 gap-3 mb-5">
                {LOCATION_TYPES.map(t => (
                    <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${data.location.type === t.id ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#18181b] border-[#3f3f46] text-gray-500'}`}>
                        <t.icon size={20} className="mb-1.5"/>
                        <span className="text-[10px] font-bold uppercase">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="card-base p-6 border-[#333] space-y-4">
                {data.location.type === 'home' && (
                    <>
                        <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-clean w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-clean w-1/3"/></div>
                    </>
                )}
                {data.location.type === 'apto' && (
                    <>
                        <input placeholder="Rua / Avenida" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-clean"/>
                        <div className="flex gap-3">
                            <input placeholder="Nº Prédio" type="tel" value={data.location.buildingNum} onChange={e => setData({...data, location: {...data.location, buildingNum: e.target.value}})} className="input-clean w-1/2"/>
                            <input placeholder="Nº Apto" type="tel" value={data.location.aptNumber} onChange={e => setData({...data, location: {...data.location, aptNumber: e.target.value}})} className="input-clean w-1/2"/>
                        </div>
                    </>
                )}
                {data.location.type === 'hotel' && (
                    <>
                        <input placeholder="Nome do Hotel" value={data.location.hotelName} onChange={e => setData({...data, location: {...data.location, hotelName: e.target.value}})} className="input-clean"/>
                        <input placeholder="Número do Quarto" type="tel" value={data.location.roomNumber} onChange={e => setData({...data, location: {...data.location, roomNumber: e.target.value}})} className="input-clean"/>
                    </>
                )}
                {data.location.type === 'motel' && (
                    <>
                        <input placeholder="Nome do Motel" value={data.location.motelName} onChange={e => setData({...data, location: {...data.location, motelName: e.target.value}})} className="input-clean"/>
                        <input placeholder="Suíte (Ex: Hidro)" value={data.location.suiteType} onChange={e => setData({...data, location: {...data.location, suiteType: e.target.value}})} className="input-clean"/>
                        <p className="text-[10px] text-yellow-500 flex items-center gap-1.5"><AlertTriangle size={12}/> O valor da suíte é pago por você.</p>
                    </>
                )}
                <button disabled={!isFormValid()} onClick={() => { setStage(5); window.scrollTo(0, 2000); }} className="btn-primary w-full py-4 mt-2 disabled:opacity-50">Confirmar Endereço</button>
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section className={`mt-10 transition-opacity duration-500 ${stage === 5 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">05.</span> Forma de Pagamento</h3>
            <div className="card-base p-4 grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(m => (
                    <button key={m} onClick={() => { setData({...data, payment: m}); }} 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${data.payment === m ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'border-[#333] hover:bg-[#18181b]'}`}>
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
        <div className="fixed bottom-0 w-full z-50 animate-fade">
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
