import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, ChevronRight, Menu, X, 
  HelpCircle, Instagram, Calendar as CalendarIcon, Clock, User, AlertTriangle, Car, Copy, Info
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO & BANCO DE DADOS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  
  // CUPOM DE PRIMEIRA VEZ
  FIRST_COUPON_VAL: 15.00, 
  
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 73, 
    AROMA: 5,
  },
  
  XP_THRESHOLDS: { MEMBER: 50, VIP: 150, ALPHA: 300 },
  
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

// TABELA DE UBER "SIMULADO" (SP - BASE BELA VISTA)
const SP_LOCATIONS = [
  { id: 'bela_vista', name: 'Bela Vista', fee: 0 },
  { id: 'augusta', name: 'Rua Augusta / Centro', fee: 8.90 },
  { id: 'paulista', name: 'Av. Paulista / Jardins', fee: 12.50 },
  { id: 'higienopolis', name: 'Higienópolis / Sta Cecília', fee: 14.90 },
  { id: 'pinheiros', name: 'Pinheiros / Vila Madalena', fee: 18.90 },
  { id: 'itaim', name: 'Itaim Bibi / V. Olímpia', fee: 22.50 },
  { id: 'moema', name: 'Moema / Ibirapuera', fee: 24.90 },
  { id: 'vila_mariana', name: 'Vila Mariana / Paraíso', fee: 21.50 },
  { id: 'perdizes', name: 'Perdizes / Barra Funda', fee: 19.90 },
  { id: 'brooklin', name: 'Brooklin / Campo Belo', fee: 28.50 },
  { id: 'saude', name: 'Saúde / Jabaquara', fee: 32.90 },
  { id: 'tatuape', name: 'Tatuapé / Mooca', fee: 35.50 },
  { id: 'morumbi', name: 'Morumbi', fee: 42.90 },
  { id: 'santana', name: 'Santana / ZN', fee: 38.90 },
  { id: 'outra', name: 'Outro Bairro (Sob Consulta)', fee: 0 },
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'Massagista de Cueca. O protocolo premium. Massagem profunda soltando a musculatura, óleo quente, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    xp: 100
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico. Ideal para remover dores lombares e pernas cansadas. Toques firmes para tirar o stress, sem toques íntimos.', 
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
  { name: 'Membro', min: 50, color: 'text-blue-400', bg: 'bg-blue-500' },
  { name: 'VIP', min: 150, color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]' }, 
  { name: 'ALPHA', min: 300, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]' }
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita.", a: "Tiago (Bela Vista)", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda, jorrei longe.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo. Pele macia.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto.", a: "Empresário", s: 5 },
  { t: "Precisava desse escape. O stress sumiu na hora.", a: "M. (Casado)", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Visual nota 1000. Profissionalismo raro hoje em dia.", a: "Carlos A.", s: 5 },
  { t: "A mistura de força e suavidade é incrível. Recomendo.", a: "Lucas", s: 5 },
  { t: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Gostei bastante, me senti bem relaxado depois.", a: "Alan SP", s: 5 },
  { t: "O corpo a corpo é quente de verdade. Uma experiência única.", a: "J.P.", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto.", a: "Turista RJ", s: 5 },
  { t: "Cara bonito, limpo e com pegada. O pacote completo.", a: "Anônimo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Me senti renovado. Energia lá em cima depois da sessão.", a: "Vitor", s: 5 },
  { t: "Extremamente educado e com papo bom.", a: "Renan", s: 5 },
  { t: "O lubrificante é um detalhe que faz toda diferença.", a: "Paulo", s: 5 },
  { t: "Já fiz com vários, o Thalyson é o melhor da região.", a: "Cliente Antigo", s: 5 },
  { t: "Fiquei impressionado com a força das mãos dele.", a: "Gym Rat", s: 5 },
  { t: "Excelente profissional. Me deixou super confortável.", a: "Hétero Curioso", s: 5 },
  { t: "Massagem terapêutica de verdade, tirou todos os nós.", a: "Motorista", s: 5 },
  { t: "O sigilo é garantido mesmo. Pode confiar.", a: "M. (Sigilo)", s: 5 },
  { t: "Experiência sensorial incrível. O cheiro, o toque.", a: "Designer", s: 5 },
  { t: "Saí flutuando. Recomendo para quem tem rotina estressante.", a: "Executivo", s: 5 },
  { t: "O Thalyson é muito gente fina. O tempo passou voando.", a: "Matheus", s: 5 },
  { t: "Melhor investimento da semana. Relaxamento total.", a: "Bruno", s: 5 },
  { t: "Toque firme, mas sensível. Sabe onde tocar.", a: "Rafa", s: 5 },
  { t: "Gostei da facilidade de agendar pelo app. Sem enrolação.", a: "Tech Guy", s: 5 },
];

const LIVE_NOTIFICATIONS = [
  "🔥 João acabou de agendar", "👀 3 pessoas vendo a agenda", "📅 Sexta-feira quase cheia",
  "⭐ Pedro avaliou com 5 estrelas", "✅ Matheus confirmou presença", "💎 Murilo usou o Cupom",
  "🏠 Atendimento em Hotel iniciado", "🚀 Bruno fechou o pacote completo", "😈 Felipe adicionou interação",
  "🍃 Gustavo pediu Aromaterapia", "💳 Pagamento via Pix recebido", "🏳️‍🌈 Cliente novo cadastrado",
  "🚗 Thalyson a caminho do Itaim", "⏱️ Sessão estendida agendada", "✨ Avaliação 5 estrelas recebida",
  "📍 Atendimento na Bela Vista", "🎁 Cupom de 1ª Vez resgatado", "🔒 Dados seguros",
  "👋 Marcos mandou um 'Oi'", "💼 Executivo agendou horário"
];

// ==================================================================================
// 2. ESTILOS OTIMIZADOS (LEVE)
// ==================================================================================

const globalStyles = `
:root { --primary: #0A84FF; --bg-app: #050505; --card-bg: #121212; --border: #222; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Roboto", sans-serif; }
html, body { background: var(--bg-app); color: #fff; overflow-x: hidden; overflow-y: auto; -webkit-overflow-scrolling: touch; }
input, select, button { outline: none; }
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll { -ms-overflow-style: none; scrollbar-width: none; }

/* Animações Simplificadas para Performance */
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
@keyframes bubble { 0% { transform: translateY(10px); opacity: 0; } 10% { transform: translateY(0); opacity: 1; } 90% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-10px); opacity: 0; } }

.animate-enter { animation: slideUp 0.4s ease-out forwards; }
.animate-bubble { animation: bubble 5s ease-in-out forwards; }
.btn-pulse { animation: pulse 2s infinite; }

/* UI Elements - Sem Blur Pesado */
.header-solid { background: rgba(18, 18, 18, 0.95); border-bottom: 1px solid #222; }
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; transition: border 0.2s; }
.card-selected { border-color: var(--primary); background: #0A84FF0D; }
.input-field { background: #1C1C1E; border: 1px solid #333; color: white; border-radius: 12px; width: 100%; font-size: 16px; padding: 14px; }
.input-field:focus { border-color: var(--primary); background: #262626; }
.primary-btn { background: var(--primary); color: white; border-radius: 16px; font-weight: 800; border: none; box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3); }

/* Utilitários de Seção */
.section-disabled { opacity: 0.4; pointer-events: none; }
`;

// ==================================================================================
// 3. UTILITÁRIOS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: () => { if (navigator.vibrate) navigator.vibrate(10); },
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
  isTimeBlocked: (d, t) => {
    if (!d) return true;
    const now = new Date();
    const sel = new Date(d); sel.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    if (sel < today) return true;
    if (sel > today) return false;
    const [h] = t.split(':').map(Number);
    return h <= now.getHours() + 1;
  }
};

// ==================================================================================
// 4. COMPONENTES VISUAIS
// ==================================================================================

const LiveBubbles = () => {
    const [msg, setMsg] = useState(null);
    const [queue, setQueue] = useState([]);

    useEffect(() => { setQueue(Utils.shuffle(LIVE_NOTIFICATIONS)); }, []);

    useEffect(() => {
        if(queue.length === 0 && LIVE_NOTIFICATIONS.length > 0) return;
        const timer = setInterval(() => {
            if(queue.length > 0) {
                const next = queue[0];
                setMsg(next);
                setQueue(prev => prev.slice(1));
                setTimeout(() => setMsg(null), 4000);
            }
        }, 12000);
        return () => clearInterval(timer);
    }, [queue]);

    if (!msg) return null;
    return (
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 w-max max-w-[90%] pointer-events-none">
        <div className="bg-[#222] border border-[#333] px-4 py-2 rounded-full flex items-center gap-2 shadow-xl animate-bubble">
           <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse"></div>
           <span className="text-xs font-bold text-white">{msg}</span>
        </div>
      </div>
    );
};

const LevelBar = ({ xp }) => {
    const current = LEVELS.slice().reverse().find(l => xp >= l.min) || LEVELS[0];
    const next = LEVELS.find(l => l.min > xp);
    const progress = next ? Math.min(100, ((xp - current.min) / (next.min - current.min)) * 100) : 100;

    return (
        <div className="mb-6 bg-[#111] p-4 rounded-2xl border border-[#222]">
            <div className="flex justify-between items-end mb-2">
                <div><span className="text-[10px] uppercase font-bold text-gray-500">Nível</span><div className={`flex items-center gap-2 font-black text-lg ${current.color}`}><Crown size={18}/> {current.name.toUpperCase()}</div></div>
                <div className="text-right"><span className="text-[10px] text-gray-500">XP</span><span className="text-sm font-bold block">{xp} / {next ? next.min : 'MAX'}</span></div>
            </div>
            <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden"><div className={`h-full ${current.bg} transition-all duration-500`} style={{ width: `${progress}%` }}></div></div>
        </div>
    );
};

const ReviewsTicker = () => {
    const [idx, setIdx] = useState(0);
    const [list] = useState(() => Utils.shuffle(REVIEWS_DB));
    useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%list.length), 5000); return () => clearInterval(t); }, [list]);

    return (
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-6 shadow-lg flex flex-col justify-between min-h-[120px]">
            <div>
                <div className="flex text-[#FFD60A] mb-2 gap-1"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                <p className="text-sm text-gray-300 italic leading-relaxed">"{list[idx].t}"</p>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 flex items-center gap-1"><Shield size={10} className="text-[#32D74B]"/> {list[idx].a}</p>
        </div>
    )
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  const [data, setData] = useState(() => {
     try {
       const s = localStorage.getItem('thaly_v_opt_2');
       if(s) { const p = JSON.parse(s); if(p.date) p.date = new Date(p.date); return p; }
     } catch(e){}
     return { 
         name: '', age: '', medical: false, 
         service: null, date: null, time: null, 
         extras: { upgrade: false, touch: false, aroma: false }, 
         payment: null,
         location: {
             neighborhood: SP_LOCATIONS[0], 
             type: 'home', 
             street: '', number: '', buildingNum: '', aptNumber: '', 
             hotelName: '', roomNumber: '', 
             motelName: '', suiteType: '' 
         }
     };
  });

  const [stage, setStage] = useState(0); 
  const [couponActive, setCouponActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Verifica se é primeira vez (para cupom)
  const isFirstTime = !localStorage.getItem('thaly_first_order_done');

  const refs = {
    intro: useRef(null), services: useRef(null), datetime: useRef(null), 
    extras: useRef(null), location: useRef(null), payment: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_v_opt_2', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  // --- LÓGICA FINANCEIRA ---
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

    const travelFee = data.location.neighborhood ? data.location.neighborhood.fee : 0;
    
    const sub = base + upg + touch + aroma + travelFee;
    const desc = couponActive ? CONFIG.FIRST_COUPON_VAL : 0;
    
    return { 
        financials: { base, upg, touch, aroma, travelFee, sub, desc, total: Math.max(0, sub - desc) },
        xp: xpPoints
    };
  }, [data.service, data.extras, couponActive, data.location.neighborhood]);

  // --- NAVEGAÇÃO ---
  const scrollToRef = (ref) => {
    if (ref && ref.current) {
        // Pequeno timeout para garantir renderização
        setTimeout(() => {
            const y = ref.current.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
    }
  };

  const advanceStage = (next, ref) => {
    Utils.vibrate();
    if(next > stage) setStage(next);
    scrollToRef(ref);
  };

  const finalizeOrder = () => {
      // Marca cupom como usado para sempre
      if(couponActive) {
          localStorage.setItem('thaly_first_order_done', 'true');
      }
      setSuccess(true);
      window.scrollTo(0,0);
  };

  // --- MENSAGEM WHATSAPP ---
  const generateMessage = () => {
    const d = data.date;
    const loc = data.location;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    
    let t = `🦁 *NOVO AGENDAMENTO*\n`;
    t += `------------------------------\n`;
    t += `👤 *${data.name}* (${data.age})\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name}*\n`;
    
    if(Object.values(data.extras).some(Boolean)) {
        t += `🔥 *EXTRAS:* `;
        const l = [];
        if(data.extras.upgrade) l.push(`+30min`);
        if(data.extras.touch) l.push(`Interação`);
        if(data.extras.aroma) l.push(`Aroma`);
        t += l.join(', ') + `\n`;
    }
    
    t += `\n📍 *BAIRRO: ${loc.neighborhood.name}*\n`;
    
    if(loc.type === 'home') {
        t += `🏠 Casa: ${loc.street}, ${loc.number}\n`;
    } else if (loc.type === 'apto') {
        t += `🏢 Apto: ${loc.street}, ${loc.buildingNum} - Apto ${loc.aptNumber}\n`;
    } else if (loc.type === 'hotel') {
        t += `🏨 Hotel: ${loc.hotelName} (Qto ${loc.roomNumber})\n`;
    } else if (loc.type === 'motel') {
        t += `🏩 Motel: ${loc.motelName} (Suíte ${loc.suiteType || '?'})\n`;
        t += `⚠️ *Eu pago a suíte*\n`;
    }

    t += `\n💰 *TOTAL: ${Utils.formatBRL(financials.total)}*\n`;
    if(financials.travelFee > 0) t += `🚗 Uber/Taxa Inclusa: ${Utils.formatBRL(financials.travelFee)}\n`;
    if(couponActive) t += `🎟️ Cupom 1ª Vez: -${Utils.formatBRL(financials.desc)}\n`;
    t += `💳 Pagamento: ${data.payment?.toUpperCase()}\n`;
    
    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const isAddressValid = () => {
      const l = data.location;
      if (!l.neighborhood) return false;
      if (l.type === 'home') return l.street && l.number;
      if (l.type === 'apto') return l.street && l.buildingNum && l.aptNumber;
      if (l.type === 'hotel') return l.hotelName && l.roomNumber;
      if (l.type === 'motel') return l.motelName;
      return false;
  };

  // --- TELAS AUXILIARES ---
  if (loading) return <div className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center text-white font-bold tracking-widest text-xs uppercase animate-pulse">Carregando...</div>;

  if (success) return (
    <div className="min-h-screen bg-[#050505] pt-12 px-6 flex flex-col items-center text-center animate-enter">
       <style>{globalStyles}</style>
       <div className="w-20 h-20 bg-[#32D74B]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.3)]">
         <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-bold text-white mb-2">Pedido Pronto!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs">Agora é só enviar a confirmação no WhatsApp.</p>

       <div className="w-full max-w-sm bg-[#18181b] border border-[#333] rounded-3xl overflow-hidden shadow-2xl relative mb-8">
           <div className="h-1 bg-gradient-to-r from-[#0A84FF] via-[#32D74B] to-[#0A84FF]"></div>
           <div className="p-6">
              <div className="flex justify-between items-start mb-4 border-b border-[#333] pb-4">
                 <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Final</p>
                    <p className="text-[#32D74B] font-bold text-2xl">{Utils.formatBRL(financials.total)}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Uber/Taxa</p>
                    <p className="text-white font-bold">{Utils.formatBRL(financials.travelFee)}</p>
                 </div>
              </div>
              <div className="text-left space-y-2 text-sm text-gray-300">
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-[#0A84FF]"/> {data.location.neighborhood.name}</p>
                  <p className="flex items-center gap-2"><CalendarIcon size={14} className="text-[#0A84FF]"/> {data.date?.toLocaleDateString()} às {data.time}</p>
              </div>
              {data.payment === 'pix' && (
                  <div onClick={() => {navigator.clipboard.writeText(CONFIG.PIX_KEY); Utils.vibrate()}} className="mt-4 p-3 bg-black/50 rounded-xl border border-white/5 flex items-center justify-between cursor-pointer active:bg-white/10">
                      <div><p className="text-[10px] text-gray-500 uppercase">Chave Pix (Copiar)</p><p className="text-xs font-mono text-white">{CONFIG.PIX_KEY}</p></div>
                      <Copy size={16} className="text-gray-400"/>
                  </div>
              )}
           </div>
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" className="w-full max-w-sm primary-btn py-4 text-lg flex items-center justify-center gap-3 mb-4 shadow-lg shadow-[#32D74B]/20">Enviar no WhatsApp <MessageCircle size={22}/></a>
       <button onClick={() => { setSuccess(false); setStage(0); }} className="text-gray-600 font-bold text-xs uppercase py-4">Novo Pedido</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-40 relative">
      <style>{globalStyles}</style>
      <LiveBubbles />
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 header-solid py-3 px-5 flex justify-between items-center">
        <div className="flex items-center gap-2" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-[#0A84FF] rounded-lg flex items-center justify-center"><span className="font-black text-white text-sm">T.</span></div>
            <span className="font-bold text-lg tracking-tight text-white">THALY.</span>
        </div>
        <div className="flex items-center gap-3">
            <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2 bg-[#1C1C1E] rounded-full border border-[#333]"><Instagram size={18} className="text-white"/></a>
            <button onClick={()=>setHelpOpen(true)} className="p-2 bg-[#1C1C1E] rounded-full border border-[#333]"><HelpCircle size={18} className="text-white"/></button>
        </div>
      </header>

      {/* HELP MODAL */}
      {helpOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-enter">
              <div className="absolute inset-0 bg-black/80" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#1C1C1E] w-full max-w-sm rounded-3xl border border-[#333] p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl flex items-center gap-2"><Info size={20} className="text-[#0A84FF]"/> Ajuda</h3>
                      <button onClick={()=>setHelpOpen(false)} className="bg-[#333] p-1 rounded-full"><X size={16}/></button>
                  </div>
                  <div className="space-y-4 text-sm text-gray-300">
                      <div className="bg-[#111] p-3 rounded-xl border border-[#222]"><p className="font-bold text-white mb-1">Sigilo?</p><p>Total. Atendo em residências e hotéis com discrição.</p></div>
                      <div className="bg-[#111] p-3 rounded-xl border border-[#222]"><p className="font-bold text-white mb-1">Pagamento?</p><p>Pix, Dinheiro ou Cartão.</p></div>
                  </div>
              </div>
          </div>
      )}

      <main className="max-w-md mx-auto pt-24 px-5">
        
        {/* 1. INTRODUÇÃO */}
        <section ref={refs.intro} className={`transition-opacity duration-500 ${stage === 0 ? 'opacity-100' : 'section-disabled'}`}>
            <div className="mb-6 mt-2">
                <h1 className="text-3xl font-extrabold mb-2">Massagem &<br/><span className="text-[#0A84FF]">Momentos Únicos.</span></h1>
                <p className="text-gray-400 text-sm">Atendimento masculino exclusivo. Sigilo total.</p>
            </div>

            <LevelBar xp={xp} />
            <ReviewsTicker />

            <div className="card-base p-5 space-y-4 shadow-xl border-[#222]">
                <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Seu Nome" className="input-field"/>
                <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Idade (Ex: 30)" className="input-field"/>
                
                <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#555]'}`}>{data.medical && <Check size={12} className="text-white"/>}</div>
                    <p className={`text-sm font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Maior de idade e saudável</p>
                </div>

                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => advanceStage(1, refs.services)} className="primary-btn w-full py-4 flex items-center justify-center gap-2">Iniciar <ArrowRight size={20}/></button>
                )}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-8 transition-opacity duration-500 ${stage >= 1 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-3 text-white"><span className="text-[#0A84FF]">01.</span> Experiência</h3>
            <div className="space-y-4">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 1) { setData({...data, service: s}); advanceStage(2, refs.datetime); }}} className={`card-base p-5 cursor-pointer relative ${data.service?.id === s.id ? 'card-selected' : ''}`}>
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-2 py-1 rounded-bl-xl">{s.badge}</div>}
                        <div className="flex justify-between items-start mb-2">
                            <div><h3 className={`text-lg font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3></div>
                            <span className="text-white font-bold bg-[#222] border border-[#333] px-2 py-1 rounded text-sm">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`mt-8 transition-opacity duration-500 ${stage >= 2 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-3 text-white"><span className="text-[#0A84FF]">02.</span> Data e Hora</h3>
            <div className="card-base p-5">
                <div className="flex gap-2 overflow-x-auto pb-4 ios-scroll snap-x">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} className={`snap-center min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center border ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#1C1C1E] border-[#333] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-lg font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`grid grid-cols-4 gap-2 mt-2 ${data.date ? '' : 'opacity-30 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => (
                        <button key={t} disabled={Utils.isTimeBlocked(data.date, t)} onClick={() => { setData({...data, time: t}); advanceStage(3, refs.extras); }} className={`py-2 rounded-lg text-xs font-bold border ${data.time === t ? 'bg-white text-black' : Utils.isTimeBlocked(data.date, t) ? 'opacity-30 line-through' : 'bg-[#1C1C1E] border-[#333] text-gray-300'}`}>{t}</button>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={`mt-8 transition-opacity duration-500 ${stage >= 3 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-3 text-white"><span className="text-[#0A84FF]">03.</span> Turbine o Relaxamento</h3>
            <div className="card-base divide-y divide-[#222]">
                {[
                   { id: 'upgrade', label: '+30 Minutos', icon: Clock, price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT },
                   { id: 'touch', label: 'Interação / Toque', icon: Flame, price: CONFIG.PRICES.TOUCH },
                   { id: 'aroma', label: 'Aromaterapia', icon: Wind, price: CONFIG.PRICES.AROMA }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-4 flex justify-between items-center cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${data.extras[item.id] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333]'}`}>{data.extras[item.id] ? <Check size={14} className="text-white"/> : <item.icon size={14} className="text-gray-500"/>}</div>
                            <p className="font-bold text-white text-sm">{item.label}</p>
                        </div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.formatBRL(item.price)}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => advanceStage(4, refs.location)} className="w-full mt-4 py-3 rounded-xl text-sm font-bold bg-[#1C1C1E] text-gray-300 border border-[#333]">Continuar</button>
        </section>

        {/* 5. LOCALIZAÇÃO (UBER EXATO) */}
        <section ref={refs.location} className={`mt-8 transition-opacity duration-500 ${stage >= 4 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-3 text-white"><span className="text-[#0A84FF]">04.</span> Localização</h3>
            
            <div className="mb-4">
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Bairro (Para cálculo do Uber)</label>
                <select className="input-field" value={data.location.neighborhood.id} onChange={e => setData({...data, location: {...data.location, neighborhood: SP_LOCATIONS.find(l => l.id === e.target.value)}})}>
                    {SP_LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name} (+{Utils.formatBRL(l.fee)})</option>)}
                </select>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
                {LOCATION_TYPES.map(t => (
                    <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border ${data.location.type === t.id ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                        <t.icon size={18} className="mb-1"/>
                        <span className="text-[9px] font-bold uppercase">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="card-base p-4 border-[#333]">
                {data.location.type === 'home' && (
                    <div className="space-y-3">
                        <div className="flex gap-2"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                    </div>
                )}
                {data.location.type === 'apto' && (
                    <div className="space-y-3">
                        <input placeholder="Rua / Avenida" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field"/>
                        <div className="flex gap-2"><input placeholder="Nº Prédio" type="tel" value={data.location.buildingNum} onChange={e => setData({...data, location: {...data.location, buildingNum: e.target.value}})} className="input-field w-1/2"/><input placeholder="Nº Apto" type="tel" value={data.location.aptNumber} onChange={e => setData({...data, location: {...data.location, aptNumber: e.target.value}})} className="input-field w-1/2"/></div>
                    </div>
                )}
                {data.location.type === 'hotel' && (
                    <div className="space-y-3">
                        <input placeholder="Nome do Hotel" value={data.location.hotelName} onChange={e => setData({...data, location: {...data.location, hotelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Número do Quarto" type="tel" value={data.location.roomNumber} onChange={e => setData({...data, location: {...data.location, roomNumber: e.target.value}})} className="input-field"/>
                    </div>
                )}
                {data.location.type === 'motel' && (
                    <div className="space-y-3">
                        <input placeholder="Nome do Motel" value={data.location.motelName} onChange={e => setData({...data, location: {...data.location, motelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Suíte (Ex: Hidro)" value={data.location.suiteType} onChange={e => setData({...data, location: {...data.location, suiteType: e.target.value}})} className="input-field"/>
                        <p className="text-[10px] text-yellow-500 flex items-center gap-1"><AlertTriangle size={10}/> Eu pago a suíte.</p>
                    </div>
                )}
                <button disabled={!isAddressValid()} onClick={() => advanceStage(5, refs.payment)} className="primary-btn w-full py-3 mt-3 disabled:opacity-50">Confirmar Endereço</button>
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`mt-8 transition-opacity duration-500 ${stage === 5 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-3 text-white"><span className="text-[#0A84FF]">05.</span> Pagamento</h3>
            <div className="card-base p-4 grid grid-cols-3 gap-2 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(m => (
                    <button key={m} onClick={() => { setData({...data, payment: m}); advanceStage(6, null); if(m==='pix') navigator.clipboard.writeText(CONFIG.PIX_KEY); }} 
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border ${data.payment === m ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'border-[#333] hover:bg-[#222]'}`}>
                        <span className="text-[10px] font-bold uppercase">{m}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* CHECKOUT STICKY */}
      {stage >= 6 && !success && (
        <div className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="bg-[#111]/95 border-t border-white/10 p-5 rounded-t-[30px] shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Total (+ Uber)</p>
                        <div className="flex items-baseline gap-2">
                            {couponActive && <span className="text-xs text-gray-500 line-through">{Utils.formatBRL(financials.sub)}</span>}
                            <span className="text-3xl font-black text-white">{Utils.formatBRL(financials.total)}</span>
                        </div>
                    </div>
                    {isFirstTime && !couponActive ? (
                        <button onClick={() => { setCouponActive(true); Utils.vibrate(); }} className="h-9 px-3 rounded-full bg-[#FFD60A] text-black font-bold text-xs animate-bounce shadow-[0_0_15px_rgba(255,214,10,0.4)] flex items-center gap-1"><Ticket size={12}/> CUPOM 1ª VEZ</button>
                    ) : couponActive ? <div className="text-[10px] text-[#32D74B] font-bold border border-[#32D74B] px-2 py-1 rounded bg-[#32D74B]/10">DESCONTO ATIVO</div> : null}
                </div>
                <button onClick={finalizeOrder} className="primary-btn w-full h-14 text-lg flex items-center justify-center gap-3">Finalizar Pedido <MessageCircle size={22}/></button>
            </div>
        </div>
      )}
    </div>
  );
}
