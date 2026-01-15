import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, ChevronRight, Menu, X, 
  HelpCircle, Instagram, Calendar as CalendarIcon, Clock, User, AlertTriangle, Car, Copy, Info, Sparkles
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO (BUSINESS LOGIC)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  
  // FINANCEIRO
  FIRST_COUPON_VAL: 15.00, 
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 73, 
    AROMA: 5,
  },
  
  // GAMIFICAÇÃO
  XP_THRESHOLDS: { VIP: 120, ALPHA: 250 },
  
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

// LOCAIS SP - CÁLCULO DE IDA E VOLTA (ESTIMATIVA REALISTA)
const SP_LOCATIONS = [
  { id: 'bela_vista', name: 'Bela Vista / Centro', fee: 10.00, time: '10 min', zone: 'Base' },
  { id: 'paulista', name: 'Av. Paulista / Jardins', fee: 20.00, time: '15 min', zone: 'Zona 1' },
  { id: 'higienopolis', name: 'Higienópolis / Sta Cecília', fee: 25.00, time: '20 min', zone: 'Zona 1' },
  { id: 'pinheiros', name: 'Pinheiros / Vila Madalena', fee: 35.00, time: '30 min', zone: 'Zona 2' },
  { id: 'itaim', name: 'Itaim Bibi / V. Olímpia', fee: 40.00, time: '35 min', zone: 'Zona 2' },
  { id: 'moema', name: 'Moema / Ibirapuera', fee: 45.00, time: '40 min', zone: 'Zona 2' },
  { id: 'vila_mariana', name: 'Vila Mariana / Paraíso', fee: 30.00, time: '25 min', zone: 'Zona 2' },
  { id: 'perdizes', name: 'Perdizes / Barra Funda', fee: 30.00, time: '25 min', zone: 'Zona 2' },
  { id: 'brooklin', name: 'Brooklin / Campo Belo', fee: 50.00, time: '45 min', zone: 'Zona 3' },
  { id: 'tatuape', name: 'Tatuapé / Mooca', fee: 55.00, time: '50 min', zone: 'Zona 3' },
  { id: 'morumbi', name: 'Morumbi', fee: 60.00, time: '60 min', zone: 'Zona 4' },
  { id: 'santana', name: 'Santana / ZN', fee: 55.00, time: '50 min', zone: 'Zona 4' },
  { id: 'outra', name: 'Outro Bairro (Consultar)', fee: 0, time: '--', zone: 'Sob Consulta' },
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Alpha Premium', 
    short: 'Protocolo Completo', 
    desc: 'O ápice do relaxamento. Massagem profunda para soltar a musculatura, seguida de óleo quente, toque pele na pele e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'RECOMENDADO 🔥',
    xp: 100
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico. Ideal para remover dores lombares, pernas cansadas e stress do trabalho. Movimentos firmes e técnicos. Sem interação íntima.', 
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
  { name: 'VIP', min: 120, color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]' }, 
  { name: 'ALPHA', min: 250, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]' }
];

const LOCATION_TYPES = [
  { id: 'home', label: 'Casa', icon: Home },
  { id: 'apto', label: 'Apto', icon: Building },
  { id: 'hotel', label: 'Hotel', icon: Bed },
  { id: 'motel', label: 'Motel', icon: Flame },
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita.", a: "Tiago (Bela Vista)", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo. Pele macia.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto.", a: "Empresário", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena.", a: "Roberto", s: 5 },
  { t: "Visual nota 1000. Profissionalismo raro hoje em dia.", a: "Carlos A.", s: 5 },
  { t: "Ambiente relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Gostei bastante, me senti bem relaxado depois.", a: "Alan SP", s: 5 },
  { t: "O corpo a corpo é quente de verdade.", a: "J.P.", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto.", a: "Turista RJ", s: 5 },
  { t: "Cara bonito, limpo e com pegada. O pacote completo.", a: "Anônimo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Me senti renovado. Energia lá em cima depois da sessão.", a: "Vitor", s: 5 },
  { t: "Extremamente educado e com papo bom.", a: "Renan", s: 5 },
  { t: "Já fiz com vários, o Thalyson é o melhor da região.", a: "Cliente Antigo", s: 5 },
  { t: "Massagem terapêutica de verdade, tirou todos os nós.", a: "Motorista", s: 5 },
  { t: "Experiência sensorial incrível. O cheiro, o toque.", a: "Designer", s: 5 },
  { t: "Saí flutuando. Recomendo para quem tem rotina estressante.", a: "Executivo", s: 5 },
  { t: "O Thalyson é muito gente fina. O tempo passou voando.", a: "Matheus", s: 5 },
  { t: "Toque firme, mas sensível. Sabe onde tocar.", a: "Rafa", s: 5 },
];

const LIVE_NOTIFICATIONS = [
  "🔥 João acabou de agendar", "👀 5 pessoas vendo a agenda", "📅 Sexta-feira quase cheia",
  "⭐ Pedro avaliou com 5 estrelas", "✅ Matheus confirmou presença", "💎 Murilo usou o Cupom",
  "🏠 Atendimento em Hotel iniciado", "🚀 Bruno fechou o pacote completo", "😈 Felipe adicionou interação",
  "🍃 Gustavo pediu Aromaterapia", "💳 Pagamento via Pix recebido", "🏳️‍🌈 Cliente novo cadastrado",
  "🚗 Thalyson a caminho do Itaim", "⏱️ Sessão estendida agendada", "✨ Avaliação 5 estrelas recebida",
  "📍 Atendimento na Bela Vista", "🎁 Cupom de 1ª Vez resgatado", "🔒 Dados seguros",
  "👋 Marcos mandou um 'Oi'", "💼 Executivo agendou horário", "🛑 Agenda de Sábado Lotada",
  "🛁 Banho tomado, pronto p/ atender", "💬 Lucas tirou uma dúvida", "🌚 Atendimento Noturno Iniciado",
  "⚡ Ricardo agendou de última hora", "🏩 Chegando no Motel agora", "📝 Cadastro aprovado"
];

// ==================================================================================
// 2. ESTILOS GLOBAIS & TEMA (DARK LUXURY)
// ==================================================================================

const globalStyles = `
:root { --primary: #0A84FF; --accent: #7B61FF; --bg-app: #050507; --card-bg: #131316; --border: #222226; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif; }
html { height: 100%; background: var(--bg-app); overflow-y: scroll; }
body { min-height: 100%; background: var(--bg-app); color: #fff; overflow-x: hidden; position: relative; }
input, select, button { outline: none; }
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll { -ms-overflow-style: none; scrollbar-width: none; }

/* Animações Cinematográficas */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
@keyframes glow { 0% { box-shadow: 0 0 5px rgba(10, 132, 255, 0.2); } 50% { box-shadow: 0 0 20px rgba(10, 132, 255, 0.5); } 100% { box-shadow: 0 0 5px rgba(10, 132, 255, 0.2); } }

.animate-enter { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.btn-pulse { animation: glow 3s infinite; }

/* Componentes UI */
.glass-header { background: rgba(5, 5, 7, 0.95); border-bottom: 1px solid rgba(255,255,255,0.05); z-index: 50; }
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; position: relative; overflow: hidden; transition: all 0.3s ease; }
.card-selected { border-color: var(--primary); background: linear-gradient(145deg, rgba(10,132,255,0.05) 0%, rgba(5,5,7,0) 100%); box-shadow: 0 4px 30px rgba(10, 132, 255, 0.1); }

.input-field { background: #1A1A1E; border: 1px solid #2A2A30; color: white; border-radius: 14px; width: 100%; font-size: 15px; padding: 16px; appearance: none; transition: border 0.2s; }
.input-field:focus { border-color: var(--primary); background: #202025; }
.primary-btn { background: linear-gradient(135deg, #0A84FF 0%, #0056B3 100%); color: white; border-radius: 18px; font-weight: 700; border: none; box-shadow: 0 8px 25px rgba(10, 132, 255, 0.3); letter-spacing: 0.5px; }
.primary-btn:active { transform: scale(0.98); }

.text-gradient { background: linear-gradient(90deg, #fff, #a5b4fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.section-disabled { opacity: 0.3; pointer-events: none; filter: grayscale(1); }
`;

// ==================================================================================
// 3. UTILITÁRIOS INTELIGENTES
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: () => { if (navigator.vibrate) navigator.vibrate(10); },
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
  
  // NOVA LÓGICA DE TEMPO: Permite agendar se for hoje e faltar > 20min
  isTimeBlocked: (d, t) => {
    if (!d) return true;
    const now = new Date();
    const sel = new Date(d); sel.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    
    // Passado
    if (sel < today) return true;
    // Futuro (Amanhã em diante)
    if (sel > today) return false;
    
    // Se for hoje, verifica a hora
    const [h, m] = t.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(h, m || 0, 0, 0);
    
    // Bloqueia se o horário já passou ou se é muito em cima (menos de 20 min)
    const bufferTime = new Date(now.getTime() + 20 * 60000); // +20 minutos
    return slotTime < bufferTime;
  }
};

// ==================================================================================
// 4. COMPONENTES VISUAIS REFINADOS
// ==================================================================================

const LiveBubbles = () => {
    const [msg, setMsg] = useState(null);
    const [pool, setPool] = useState([]);

    useEffect(() => { setPool(Utils.shuffle([...LIVE_NOTIFICATIONS])); }, []);

    useEffect(() => {
        if(pool.length === 0 && LIVE_NOTIFICATIONS.length > 0) return;
        const timer = setInterval(() => {
            setPool(prevPool => {
                if (prevPool.length === 0) return Utils.shuffle([...LIVE_NOTIFICATIONS]);
                const [next, ...rest] = prevPool;
                setMsg(next);
                setTimeout(() => setMsg(null), 4500);
                return rest;
            });
        }, 14000); // Intervalo maior para não irritar
        return () => clearInterval(timer);
    }, [pool]);

    if (!msg) return null;
    return (
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 w-max max-w-[92%] pointer-events-none">
        <div className="bg-[#1A1A1E]/95 border border-[#333] px-4 py-2.5 rounded-full flex items-center gap-2.5 shadow-2xl animate-bubble">
           <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse shrink-0"></div>
           <span className="text-xs font-bold text-gray-200 truncate">{msg}</span>
        </div>
      </div>
    );
};

const ReviewsTicker = () => {
    const [idx, setIdx] = useState(0);
    const list = useMemo(() => Utils.shuffle([...REVIEWS_DB]), []);
    useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%list.length), 6000); return () => clearInterval(t); }, [list]);

    return (
        <div className="bg-[#131316] border border-[#222] rounded-3xl p-5 mb-8 relative shadow-lg flex flex-col justify-between min-h-[140px] overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#0A84FF]/10 to-transparent rounded-bl-full"></div>
            <div>
                <div className="flex text-[#FFD60A] mb-3 gap-1"><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/></div>
                <p className="text-[15px] text-gray-300 italic leading-relaxed font-light">"{list[idx].t}"</p>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#222] flex items-center justify-center text-[#32D74B]"><Shield size={12}/></div>
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">{list[idx].a}</p>
            </div>
        </div>
    )
};

const LevelBar = ({ xp }) => {
    const current = LEVELS.slice().reverse().find(l => xp >= l.min) || LEVELS[0];
    const next = LEVELS.find(l => l.min > xp);
    const progress = next ? Math.min(100, ((xp - current.min) / (next.min - current.min)) * 100) : 100;

    return (
        <div className="mb-8 bg-[#131316] p-5 rounded-3xl border border-[#222] relative overflow-hidden">
            <div className="flex justify-between items-end mb-3 relative z-10">
                <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status VIP</span>
                    <div className={`flex items-center gap-2 font-black text-xl ${current.color} mt-0.5`}>
                        <Crown size={20} fill="currentColor"/> {current.name.toUpperCase()}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-gray-500">Progresso</span>
                    <span className="text-sm font-bold block text-white">{xp} <span className="text-gray-600">/ {next ? next.min : 'MAX'}</span></span>
                </div>
            </div>
            <div className="h-3 w-full bg-[#1A1A1E] rounded-full overflow-hidden relative z-10 box-border border border-[#222]">
                <div className={`h-full ${current.bg} transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }}></div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#0A84FF]/10 blur-[50px]"></div>
        </div>
    );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  // STATE: Inicialização Segura (Anti-Crash Version)
  const [data, setData] = useState(() => {
     try {
       const s = localStorage.getItem('thaly_v_final_1'); // Nova chave limpa
       if(s) { 
           const p = JSON.parse(s); 
           if(p.date) p.date = new Date(p.date);
           if(!p.location || !p.location.neighborhood) throw new Error("Reset");
           return p; 
       }
     } catch(e) { localStorage.removeItem('thaly_v_final_1'); }
     
     // Estado Padrão
     return { 
         name: '', age: '', medical: false, 
         service: null, date: null, time: null, 
         extras: { upgrade: false, touch: false, aroma: false }, 
         payment: null,
         location: {
             neighborhood: SP_LOCATIONS[0], 
             type: 'home', 
             street: '', number: '', buildingNum: '', aptNumber: '', ref: '',
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
  
  const hasOrderedBefore = !!localStorage.getItem('thaly_history_log');

  const refs = {
    services: useRef(null), datetime: useRef(null), 
    extras: useRef(null), location: useRef(null), payment: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_v_final_1', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 600); }, []);

  // CÁLCULO FINANCEIRO (IDA + VOLTA)
  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    
    const base = data.service?.price || 0;
    if (data.service) xpPoints += data.service.xp;

    const upg = data.extras?.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    if (data.extras?.upgrade) xpPoints += 25;

    const touch = data.extras?.touch ? CONFIG.PRICES.TOUCH : 0;
    if (data.extras?.touch) xpPoints += 30;

    const aroma = data.extras?.aroma ? CONFIG.PRICES.AROMA : 0;
    if (data.extras?.aroma) xpPoints += 15;

    // Taxa já calculada como ida e volta no array SP_LOCATIONS
    const travelFee = data.location?.neighborhood?.fee || 0;
    
    const sub = base + upg + touch + aroma + travelFee;
    const desc = couponActive ? CONFIG.FIRST_COUPON_VAL : 0;
    
    return { 
        financials: { base, upg, touch, aroma, travelFee, sub, desc, total: Math.max(0, sub - desc) },
        xp: xpPoints
    };
  }, [data, couponActive]);

  const scrollToRef = (ref) => {
    if (ref && ref.current) {
        setTimeout(() => {
            const y = ref.current.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 150);
    }
  };

  const advanceStage = (next, ref) => {
    Utils.vibrate();
    if(next > stage) setStage(next);
    scrollToRef(ref);
  };

  const finalizeOrder = () => {
      if(couponActive || !hasOrderedBefore) {
          localStorage.setItem('thaly_history_log', 'true');
      }
      setSuccess(true);
      window.scrollTo(0,0);
  };

  const generateMessage = () => {
    const d = data.date;
    const loc = data.location;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    
    let t = `🦁 *SOLICITAÇÃO DE AGENDAMENTO*\n`;
    t += `──────────────────────\n`;
    t += `👤 *${data.name}* (${data.age}a)\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name}*\n`;
    
    if(Object.values(data.extras || {}).some(Boolean)) {
        t += `🔥 *EXTRAS:* `;
        const l = [];
        if(data.extras?.upgrade) l.push(`+30min`);
        if(data.extras?.touch) l.push(`Interação`);
        if(data.extras?.aroma) l.push(`Aroma`);
        t += l.join(', ') + `\n`;
    }
    
    t += `\n📍 *LOCAL: ${loc.neighborhood?.name}*\n`;
    
    if(loc.type === 'home') {
        t += `🏠 Casa: ${loc.street}, ${loc.number}\n`;
        if(loc.ref) t += `👀 Ref: ${loc.ref}\n`;
    } else if (loc.type === 'apto') {
        t += `🏢 Apto: ${loc.street}, ${loc.buildingNum}\n`;
        t += `🚪 Unidade: ${loc.aptNumber}\n`;
        if(loc.ref) t += `👀 Ref: ${loc.ref}\n`;
    } else if (loc.type === 'hotel') {
        t += `🏨 Hotel: ${loc.hotelName} (Qto ${loc.roomNumber})\n`;
    } else if (loc.type === 'motel') {
        t += `🏩 Motel: ${loc.motelName} (Suíte ${loc.suiteType || '?'})\n`;
        t += `⚠️ *Cliente paga a suíte*\n`;
    }

    t += `\n💰 *TOTAL: ${Utils.formatBRL(financials.total)}*\n`;
    if(financials.travelFee > 0) t += `🚗 Taxa Deslocamento (Ida+Volta): ${Utils.formatBRL(financials.travelFee)}\n`;
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

  if (loading) return (
    <div className="fixed inset-0 bg-[#050507] z-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#1A1A1E] border-t-[#0A84FF] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold tracking-[0.3em] text-[10px] uppercase animate-pulse">Carregando</p>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-[#050507] pt-12 px-6 flex flex-col items-center text-center animate-enter pb-20">
       <style>{globalStyles}</style>
       <div className="w-24 h-24 bg-[#32D74B]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.2)]">
         <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Pedido Pronto!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs leading-relaxed">Agora é só enviar a confirmação gerada para o meu WhatsApp.</p>

       <div className="w-full max-w-sm bg-[#131316] border border-[#222] rounded-3xl overflow-hidden shadow-2xl relative mb-8">
           <div className="h-1 bg-gradient-to-r from-[#0A84FF] via-[#32D74B] to-[#0A84FF]"></div>
           <div className="p-6">
              <div className="flex justify-between items-start mb-6 border-b border-[#222] pb-6">
                 <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Total Final</p>
                    <p className="text-[#32D74B] font-black text-3xl">{Utils.formatBRL(financials.total)}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Taxa Ida/Volta</p>
                    <p className="text-white font-bold">{Utils.formatBRL(financials.travelFee)}</p>
                 </div>
              </div>
              <div className="text-left space-y-3 text-sm text-gray-300">
                  <p className="flex items-center gap-3"><MapPin size={16} className="text-[#0A84FF]"/> {data.location?.neighborhood?.name}</p>
                  <p className="flex items-center gap-3"><CalendarIcon size={16} className="text-[#0A84FF]"/> {data.date?.toLocaleDateString()} às {data.time}</p>
                  <p className="flex items-center gap-3"><User size={16} className="text-[#0A84FF]"/> {data.name}</p>
              </div>
              {data.payment === 'pix' && (
                  <div onClick={() => {navigator.clipboard.writeText(CONFIG.PIX_KEY); Utils.vibrate()}} className="mt-6 p-4 bg-[#0A84FF]/10 rounded-xl border border-[#0A84FF]/20 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform">
                      <div><p className="text-[10px] text-[#0A84FF] font-bold uppercase mb-1">Toque para Copiar Chave Pix</p><p className="text-xs font-mono text-white tracking-wide">{CONFIG.PIX_KEY}</p></div>
                      <Copy size={18} className="text-[#0A84FF]"/>
                  </div>
              )}
           </div>
           {/* Recortes do Ticket */}
           <div className="absolute top-[100px] left-[-10px] w-5 h-5 rounded-full bg-[#050507]"></div>
           <div className="absolute top-[100px] right-[-10px] w-5 h-5 rounded-full bg-[#050507]"></div>
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" className="w-full max-w-sm primary-btn py-4 text-lg flex items-center justify-center gap-3 mb-4 shadow-lg shadow-[#32D74B]/20 hover:scale-[1.02] transition-transform">Enviar no WhatsApp <MessageCircle size={22}/></a>
       <button onClick={() => { setSuccess(false); setStage(0); setCouponActive(false); window.scrollTo(0,0); }} className="text-gray-600 font-bold text-xs uppercase py-4 hover:text-white transition-colors">Fazer Novo Pedido</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-48 relative selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>
      <LiveBubbles />
      
      {/* HEADER */}
      <header className="fixed top-0 w-full header-solid py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#0A84FF] to-[#0056B3] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20"><span className="font-black text-white text-sm">T.</span></div>
            <span className="font-bold text-lg tracking-tight text-white">THALY.</span>
        </div>
        <div className="flex items-center gap-3">
            <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2.5 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-90 transition-transform"><Instagram size={18} className="text-white"/></a>
            <button onClick={()=>setHelpOpen(true)} className="p-2.5 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-90 transition-transform"><HelpCircle size={18} className="text-white"/></button>
        </div>
      </header>

      {/* AJUDA MODAL (PROFISSIONAL) */}
      {helpOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-enter">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#131316] w-full max-w-sm rounded-3xl border border-[#222] p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl flex items-center gap-2 text-white"><Info size={20} className="text-[#0A84FF]"/> Informações</h3>
                      <button onClick={()=>setHelpOpen(false)} className="bg-[#222] p-1.5 rounded-full text-gray-400 hover:text-white"><X size={16}/></button>
                  </div>
                  <div className="space-y-4">
                      <div className="bg-[#1A1A1E] p-4 rounded-2xl border border-[#2A2A30]">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF]"><Shield size={16}/></div>
                              <p className="font-bold text-white text-sm">Privacidade</p>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">Atendimento estritamente profissional e discreto. Seus dados são utilizados apenas para o agendamento.</p>
                      </div>
                      <div className="bg-[#1A1A1E] p-4 rounded-2xl border border-[#2A2A30]">
                          <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-[#32D74B]/20 flex items-center justify-center text-[#32D74B]"><CreditCard size={16}/></div>
                              <p className="font-bold text-white text-sm">Pagamento</p>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">Aceito Pix, Dinheiro e Cartão (Crédito/Débito).</p>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <main className="max-w-md mx-auto pt-28 px-5">
        
        {/* 1. INTRODUÇÃO */}
        <section className={`transition-all duration-500 ${stage === 0 ? 'opacity-100' : 'section-disabled'}`}>
            <div className="mb-8 mt-2">
                <h1 className="text-4xl font-extrabold mb-3 leading-[1.1] tracking-tight">Massagem &<br/><span className="text-gradient">Momentos Únicos.</span></h1>
                <p className="text-gray-400 text-[15px] leading-relaxed">Massoterapia masculina no conforto do seu local. Técnica apurada e experiência premium.</p>
            </div>

            <LevelBar xp={xp} />
            <ReviewsTicker />

            <div className="card-base p-6 space-y-5 shadow-2xl border-[#222]">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Identificação</label>
                        <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Seu Nome ou Apelido" className="input-field"/>
                    </div>
                    <div>
                        <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Sua Idade (Ex: 30)" className="input-field"/>
                    </div>
                </div>
                
                <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1A1A1E] border-[#333]'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444]'}`}>{data.medical && <Check size={14} className="text-white"/>}</div>
                    <p className={`text-sm font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Sou maior de idade e saudável</p>
                </div>

                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => advanceStage(1, refs.services)} className="primary-btn w-full py-4 flex items-center justify-center gap-2 mt-2 animate-enter">Iniciar Agendamento <ArrowRight size={20}/></button>
                )}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-10 transition-opacity duration-500 ${stage >= 1 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">01.</span> Experiência</h3>
            <div className="space-y-5">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 1) { setData({...data, service: s}); advanceStage(2, refs.datetime); }}} className={`card-base p-6 cursor-pointer relative group ${data.service?.id === s.id ? 'card-selected' : ''}`}>
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-3 py-1.5 rounded-bl-2xl shadow-lg z-10">{s.badge}</div>}
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div><h3 className={`text-xl font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3></div>
                            <span className="text-white font-bold bg-[#222] border border-[#333] px-3 py-1 rounded-lg text-sm">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`mt-10 transition-opacity duration-500 ${stage >= 2 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">02.</span> Data e Hora</h3>
            <div className="card-base p-6 border-[#222]">
                <div className="flex gap-3 overflow-x-auto pb-6 ios-scroll snap-x">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} className={`snap-center min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1A1A1E] border-[#333] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold tracking-tight">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`grid grid-cols-4 gap-3 mt-2 ${data.date ? '' : 'opacity-30 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => (
                        <button key={t} disabled={Utils.isTimeBlocked(data.date, t)} onClick={() => { setData({...data, time: t}); advanceStage(3, refs.extras); }} className={`py-3 rounded-xl text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black scale-105 border-white shadow-lg' : Utils.isTimeBlocked(data.date, t) ? 'opacity-20 line-through border-transparent' : 'bg-[#1A1A1E] border-[#333] text-gray-300'}`}>{t}</button>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={`mt-10 transition-opacity duration-500 ${stage >= 3 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">03.</span> Adicionais</h3>
            <div className="card-base divide-y divide-[#222]">
                {[
                   { id: 'upgrade', label: '+30 Minutos', icon: Clock, price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT },
                   { id: 'touch', label: 'Interação / Toque', icon: Flame, price: CONFIG.PRICES.TOUCH },
                   { id: 'aroma', label: 'Aromaterapia', icon: Wind, price: CONFIG.PRICES.AROMA }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#1A1A1E] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${data.extras?.[item.id] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333]'}`}>{data.extras?.[item.id] ? <Check size={16} className="text-white"/> : <item.icon size={16} className="text-gray-500"/>}</div>
                            <p className="font-bold text-white text-base">{item.label}</p>
                        </div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.formatBRL(item.price)}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => advanceStage(4, refs.location)} className="w-full mt-5 py-4 rounded-xl text-sm font-bold bg-[#1A1A1E] text-gray-300 border border-[#333] hover:bg-[#222] transition-colors">Continuar</button>
        </section>

        {/* 5. LOCALIZAÇÃO (UBER EXATO) */}
        <section ref={refs.location} className={`mt-10 transition-opacity duration-500 ${stage >= 4 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">04.</span> Localização</h3>
            
            <div className="mb-5">
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block ml-1">Região / Bairro (Taxa Uber Ida+Volta)</label>
                <select className="input-field" value={data.location.neighborhood?.id} onChange={e => setData({...data, location: {...data.location, neighborhood: SP_LOCATIONS.find(l => l.id === e.target.value)}})}>
                    {SP_LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name} (+{Utils.formatBRL(l.fee)})</option>)}
                </select>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-5">
                {LOCATION_TYPES.map(t => (
                    <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${data.location.type === t.id ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#1A1A1E] border-[#333] text-gray-500'}`}>
                        <t.icon size={20} className="mb-1.5"/>
                        <span className="text-[10px] font-bold uppercase">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="card-base p-6 border-[#333] space-y-4">
                {data.location.type === 'home' && (
                    <>
                        <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                        <input placeholder="Ponto de Referência (Opcional)" value={data.location.ref} onChange={e => setData({...data, location: {...data.location, ref: e.target.value}})} className="input-field"/>
                    </>
                )}
                {data.location.type === 'apto' && (
                    <>
                        <input placeholder="Rua / Avenida" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field"/>
                        <div className="flex gap-3">
                            <input placeholder="Nº Prédio" type="tel" value={data.location.buildingNum} onChange={e => setData({...data, location: {...data.location, buildingNum: e.target.value}})} className="input-field w-1/2"/>
                            <input placeholder="Nº Apto" type="tel" value={data.location.aptNumber} onChange={e => setData({...data, location: {...data.location, aptNumber: e.target.value}})} className="input-field w-1/2"/>
                        </div>
                    </>
                )}
                {data.location.type === 'hotel' && (
                    <>
                        <input placeholder="Nome do Hotel" value={data.location.hotelName} onChange={e => setData({...data, location: {...data.location, hotelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Número do Quarto" type="tel" value={data.location.roomNumber} onChange={e => setData({...data, location: {...data.location, roomNumber: e.target.value}})} className="input-field"/>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1.5 p-3 bg-[#1A1A1E] rounded-lg border border-[#333]"><AlertTriangle size={12} className="text-yellow-500"/> Deixe minha subida autorizada na recepção.</p>
                    </>
                )}
                {data.location.type === 'motel' && (
                    <>
                        <input placeholder="Nome do Motel" value={data.location.motelName} onChange={e => setData({...data, location: {...data.location, motelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Suíte (Ex: Hidro)" value={data.location.suiteType} onChange={e => setData({...data, location: {...data.location, suiteType: e.target.value}})} className="input-field"/>
                        <p className="text-[10px] text-yellow-500 flex items-center gap-1.5 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20"><AlertTriangle size={12}/> O valor da suíte é pago por você.</p>
                    </>
                )}
                <button disabled={!isAddressValid()} onClick={() => advanceStage(5, refs.payment)} className="primary-btn w-full py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">Confirmar Endereço</button>
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`mt-10 transition-opacity duration-500 ${stage === 5 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">05.</span> Forma de Pagamento</h3>
            <div className="card-base p-4 grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(m => (
                    <button key={m} onClick={() => { setData({...data, payment: m}); advanceStage(6, null); if(m==='pix') navigator.clipboard.writeText(CONFIG.PIX_KEY); }} 
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

      {/* CHECKOUT STICKY */}
      {stage >= 6 && !success && (
        <div className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="bg-[#131316]/95 border-t border-[#333] p-6 rounded-t-[32px] shadow-[0_-10px_60px_rgba(0,0,0,0.9)] backdrop-blur-md">
                <div className="flex justify-between items-end mb-5">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Total (+ Deslocamento)</p>
                        <div className="flex items-baseline gap-2">
                            {couponActive && <span className="text-xs text-gray-500 line-through decoration-red-500">{Utils.formatBRL(financials.sub)}</span>}
                            <span className="text-4xl font-black text-white tracking-tighter">{Utils.formatBRL(financials.total)}</span>
                        </div>
                    </div>
                    {/* LOGICA CUPOM 1ª VEZ */}
                    {!hasOrderedBefore && !couponActive ? (
                        <button onClick={() => { setCouponActive(true); Utils.vibrate(); }} className="h-10 px-4 rounded-full bg-[#FFD60A] text-black font-bold text-xs animate-bounce shadow-[0_0_20px_rgba(255,214,10,0.3)] flex items-center gap-2"><Ticket size={14} fill="black"/> CUPOM 1ª VEZ</button>
                    ) : couponActive ? <div className="text-[10px] text-[#32D74B] font-bold border border-[#32D74B] px-3 py-1.5 rounded-full bg-[#32D74B]/10 flex items-center gap-1"><Check size={12}/> DESCONTO ATIVO</div> : null}
                </div>
                <button onClick={finalizeOrder} className="primary-btn w-full h-16 text-lg flex items-center justify-center gap-3">Finalizar Pedido <MessageCircle size={24} fill="currentColor"/></button>
            </div>
        </div>
      )}
    </div>
  );
}
