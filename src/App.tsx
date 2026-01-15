import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, X, HelpCircle, Instagram, 
  Calendar as CalendarIcon, Clock, User, AlertTriangle, 
  Car, Copy, Info, Zap, ChevronDown, Share2, Music, Coffee,
  Hand, Droplet, Lock, RefreshCw, Eye
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO
// ==================================================================================

const CONFIG = {
  APP_VERSION: '6.0.0-STABLE',
  REGION_MODE: 'SP', 
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  
  // FINANCEIRO
  COUPON_VAL: 15.00, 
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 73, 
    AROMA: 5,
    RUSH_HOUR_FEE: 15,
  },
  
  // GAMIFICAÇÃO
  XP_THRESHOLDS: { VIP: 100, ALPHA: 150 },
  
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

// --- BASE DE DADOS ---
const LOCATIONS_DB = {
  SP: [
    { id: 'bela_vista', name: 'Bela Vista / Augusta', fee: 0, zone: 'Base' },
    { id: 'consola', name: 'Consolação / Centro', fee: 10, zone: 'Zona 1' },
    { id: 'jardins', name: 'Jardins / Paulista', fee: 15, zone: 'Zona 1' },
    { id: 'higien', name: 'Higienópolis / Sta Cecília', fee: 18, zone: 'Zona 1' },
    { id: 'pinheiros', name: 'Pinheiros / V. Madalena', fee: 25, zone: 'Zona 2' },
    { id: 'itaim', name: 'Itaim Bibi / V. Olímpia', fee: 28, zone: 'Zona 2' },
    { id: 'moema', name: 'Moema / V. Mariana', fee: 30, zone: 'Zona 2' },
    { id: 'perdizes', name: 'Perdizes / Barra Funda', fee: 30, zone: 'Zona 2' },
    { id: 'brooklin', name: 'Brooklin / Campo Belo', fee: 35, zone: 'Zona 3' },
    { id: 'saude', name: 'Saúde / Jabaquara', fee: 40, zone: 'Zona 3' },
    { id: 'tatuape', name: 'Tatuapé / Mooca', fee: 45, zone: 'Zona 3' },
    { id: 'morumbi', name: 'Morumbi / Panamby', fee: 50, zone: 'Zona 4' },
    { id: 'santana', name: 'Santana / ZN', fee: 50, zone: 'Zona 4' },
    { id: 'outra', name: 'Outro Bairro (Consultar)', fee: 0, zone: 'Consultar' },
  ],
  INTERIOR: [
    { id: 'santafe', name: 'Santa Fé do Sul', fee: 0, zone: 'Base' },
    { id: 'tresfron', name: 'Três Fronteiras', fee: 20, zone: 'Vizinha' },
    { id: 'rubineia', name: 'Rubinéia', fee: 25, zone: 'Vizinha' },
    { id: 'santaclara', name: 'Santa Clara', fee: 30, zone: 'Vizinha' },
    { id: 'jales', name: 'Jales', fee: 60, zone: 'Longe' },
    { id: 'aparecida', name: 'Ap. do Taboado', fee: 70, zone: 'MS' },
  ]
};

const CURRENT_LOCATIONS = LOCATIONS_DB[CONFIG.REGION_MODE] || LOCATIONS_DB.SP;

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'Protocolo Premium. Inicia de bruços soltando a musculatura, vira de frente com creme e óleo, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'RECOMENDADO ⭐',
    xp: 60,
    highlight: true // Destaque Dourado
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico. Ideal para remover dores lombares e pernas cansadas. Toques suaves para tirar o stress, sem toques íntimos.', 
    duration: 60, 
    price: 125, 
    badge: null,
    xp: 30,
    highlight: false
  },
];

const MOODS = [
  { id: 'relax', label: 'Relaxar', icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'energy', label: 'Energia', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'intense', label: 'Intenso', icon: Flame, color: 'text-red-400', bg: 'bg-red-500/10' },
];

const PREFERENCES = {
  music: ['Zen / Spa', 'Sons da Natureza', 'Silêncio Total', 'Minha Playlist']
};

const LOCATION_TYPES = [
  { id: 'home', label: 'Casa', icon: Home },
  { id: 'apto', label: 'Apto', icon: Building },
  { id: 'hotel', label: 'Hotel', icon: Bed },
  { id: 'motel', label: 'Motel', icon: Flame },
];

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const RUSH_HOURS = ['18:00', '19:00', '20:00', '21:00'];

const FAQS = [
  { q: "Como é a Massagem Completa?", a: "Começa com manobras relaxantes nas costas para soltar a tensão. Depois, de frente, utiliza-se óleo corporal para toques mais sensitivos e corpo a corpo, finalizando com alívio manual total." },
  { q: "Como é a Massagem Relaxante?", a: "Focada exclusivamente em dores musculares, nós de tensão e circulação. Não há toques nas partes íntimas. É puramente terapêutica." },
  { q: "Pagamento do Transporte", a: "O valor do deslocamento (Uber) pode ser pago antecipadamente para garantir a reserva. O valor da massagem você paga apenas ao final da sessão." },
  { q: "Onde você atende?", a: "Sou especializado em Home Care. Levo a maca, toalhas e óleos até sua residência, apartamento ou hotel com total discrição." }
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita.", a: "Tiago", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto.", a: "Empresário", s: 5 },
  { t: "Pontualidade britânica. Chegou na hora marcada.", a: "Advogado SP", s: 5 },
  { t: "Fiquei impressionado com a força das mãos dele.", a: "Gym Rat", s: 5 },
  { t: "A finalização manual é intensa mesmo.", a: "Anônimo", s: 5 },
  { t: "Profissional nota 10. Levou a maca e tudo.", a: "Dr. Marcelo", s: 5 },
  { t: "Simpático e educado. Me deixou super à vontade.", a: "Felipe", s: 5 },
];

const LIVE_NOTIFICATIONS = [
  "🔥 João acabou de agendar", "👀 6 pessoas vendo a agenda", "📅 Sexta-feira está quase lotada",
  "⭐ Pedro avaliou com 5 estrelas", "✅ Matheus confirmou presença", "💎 Murilo virou VIP",
  "🌊 Ricardo ativou o modo relax", "💬 Lucas enviou uma dúvida", "🏠 Atendimento em domicílio iniciado",
  "🚀 Bruno fechou o pacote completo", "😈 Felipe adicionou interação", "🏨 Atendimento em Hotel iniciado",
  "🍃 Gustavo pediu Aromaterapia", "💳 Pagamento via Pix recebido", "🏳️‍🌈 Cliente novo cadastrado",
  "🕶️ Modo Sigilo Ativado", "🚗 Thalyson está a caminho", "⏱️ Sessão estendida agendada",
  "🧖‍♂️ Rafael finalizou a sessão", "✨ Avaliação 5 estrelas recebida", "🔥 Agenda de Sábado abriu",
  "🎁 Cupom VIP foi resgatado", "🔒 Dados criptografados", "👋 Marcos mandou um 'Oi'",
  "💼 Executivo agendou horário", "✈️ Turista do RJ agendou", "🛌 Suíte de Motel reservada"
];

// ==================================================================================
// UTILITÁRIOS & ESTILOS GLOBAIS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: (pattern = 10) => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); },
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
  },

  getGreeting: () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }
};

const globalStyles = `
:root { --primary: #0A84FF; --bg-app: #000000; --card-bg: #121212; --border: #1F1F1F; --success: #32D74B; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Roboto", sans-serif; }
body { background: var(--bg-app); color: #fff; padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden; scroll-behavior: smooth; }
input, select, button { outline: none; }

/* SCROLL FIX OTIMIZADO */
.ios-scroll { 
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding: 4px 4px 16px 4px;
    -webkit-overflow-scrolling: touch; /* Crucial para iOS */
    scroll-snap-type: x mandatory;
}
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll > * { flex-shrink: 0; scroll-snap-align: start; }

/* ANIMAÇÕES */
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }
@keyframes bubblePop { 0% { opacity: 0; transform: scale(0.8) translateY(10px); } 10% { opacity: 1; transform: scale(1) translateY(0); } 90% { opacity: 1; transform: scale(1) translateY(0); } 100% { opacity: 0; transform: scale(0.8) translateY(-10px); } }
@keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.animate-enter { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-scale { animation: scaleIn 0.3s ease-out forwards; }
.animate-bubble { animation: bubblePop 6s ease-in-out forwards; }
.btn-pulse { animation: pulse-glow 2s infinite; }
.animate-shimmer { background: linear-gradient(90deg, #1C1C1E 25%, #2C2C2E 50%, #1C1C1E 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }

.glass-header { background: rgba(0, 0, 0, 0.9); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05); }
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; transition: transform 0.2s, border-color 0.2s; position: relative; overflow: hidden; }
.card-base:active { transform: scale(0.99); }
.card-selected { border-color: var(--primary); background: rgba(10, 132, 255, 0.05); box-shadow: 0 0 20px rgba(10, 132, 255, 0.1); }

.input-field { background: #181818; border: 1px solid #333; color: white; border-radius: 12px; width: 100%; transition: all 0.3s; font-size: 16px; padding: 16px; -webkit-appearance: none; }
.input-field:focus { border-color: var(--primary); background: #202020; box-shadow: 0 0 0 1px var(--primary); }
.primary-btn { background: var(--primary); color: white; border-radius: 16px; font-weight: 800; border: none; box-shadow: 0 4px 20px rgba(10, 132, 255, 0.25); position: relative; overflow: hidden; }

.section-blur { opacity: 0.3; filter: blur(3px); pointer-events: none; transition: all 0.6s ease; transform: scale(0.98); }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; transform: scale(1); }
.confetti-piece { position: absolute; width: 8px; height: 8px; background: #FFD60A; top: -10px; animation: confetti 3s ease-in-out forwards; }
`;

// ==================================================================================
// COMPONENTES UI
// ==================================================================================

const Toast = ({ msg, type = 'success', onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
    const icons = { success: Check, error: AlertTriangle, info: Info };
    const colors = { success: 'bg-[#32D74B]', error: 'bg-red-500', info: 'bg-[#0A84FF]' };
    const Icon = icons[type];
    
    return (
        <div className="fixed top-28 right-4 z-[100] animate-scale">
            <div className="bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center gap-3">
                <div className={`${colors[type]} w-8 h-8 rounded-full flex items-center justify-center shadow-lg`}><Icon size={16} className="text-white"/></div>
                <p className="text-sm font-bold text-white pr-2">{msg}</p>
            </div>
        </div>
    );
};

const ConfettiExplosion = () => (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {[...Array(40)].map((_, i) => (
            <div key={i} className="confetti-piece" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#FFD60A', '#32D74B', '#0A84FF', '#FF375F'][Math.floor(Math.random() * 4)]
            }}></div>
        ))}
    </div>
);

// STATUS BAR (CORRIGIDA)
const StatusBar = () => {
  return (
    <div className="w-full bg-[#111] border-b border-[#222] py-2 px-5 flex justify-between items-center text-[10px] uppercase font-bold text-gray-400">
       <div className="flex items-center gap-2">
         <span className="relative flex h-2 w-2">
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
           <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
         </span>
         Disponível Agora
       </div>
       <div className="flex items-center gap-1">
         <Eye size={12} /> Agenda Aberta
       </div>
    </div>
  );
};

// LIVE BUBBLES
const LiveBubbles = () => {
    const [msg, setMsg] = useState(null);
    const [queue, setQueue] = useState([]);

    useEffect(() => { setQueue(Utils.shuffle([...LIVE_NOTIFICATIONS])); }, []);

    useEffect(() => {
        if(queue.length === 0 && LIVE_NOTIFICATIONS.length > 0) {
             setQueue(Utils.shuffle([...LIVE_NOTIFICATIONS])); return;
        }
        const cycle = () => {
            if (queue.length > 0) {
                const nextMsg = queue[0];
                setMsg(nextMsg);
                setQueue(q => q.slice(1));
                setTimeout(() => setMsg(null), 6000); 
            }
        };
        const interval = setInterval(cycle, 12000); 
        cycle(); 
        return () => clearInterval(interval);
    }, [queue]);

    if (!msg) return null;
    return (
      <div className="fixed top-28 left-1/2 -translate-x-1/2 z-30 w-max max-w-[90%] pointer-events-none">
        <div className="bg-[#1C1C1E]/90 backdrop-blur-md border border-white/10 pl-3 pr-4 py-2 rounded-full flex items-center gap-3 shadow-2xl animate-bubble">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center shrink-0">
              <span className="text-xs">🦁</span>
           </div>
           <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Status Update</p>
               <p className="text-xs font-medium text-white">{msg}</p>
           </div>
        </div>
      </div>
    );
};

// LISTA DE AVALIAÇÕES (NOVA)
const ReviewsList = () => {
    return (
        <div className="mb-6">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 px-1 flex items-center gap-1"><Star size={10}/> Últimas Avaliações</h4>
            <div className="ios-scroll">
                {REVIEWS_DB.map((r, i) => (
                    <div key={i} className="min-w-[260px] max-w-[260px] bg-[#161616] border border-[#222] p-4 rounded-xl flex flex-col justify-between hover:border-gray-600 transition-colors">
                        <div className="flex text-[#FFD60A] mb-2 gap-0.5"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                        <p className="text-xs text-gray-300 leading-relaxed mb-3 line-clamp-3">"{r.t}"</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1"><Shield size={10} className="text-green-500"/> {r.a}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// BARRA DE XP
const LevelBar = ({ xp }) => {
    const currentLevel = LEVELS.slice().reverse().find(l => xp >= l.min) || LEVELS[0];
    const nextLevel = LEVELS.find(l => l.min > xp);
    const progress = nextLevel ? Math.min(100, ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100) : 100;

    return (
        <div className="mb-6 animate-enter bg-gradient-to-b from-[#161616] to-[#111] p-5 rounded-3xl border border-[#222] shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-end mb-3 relative z-10">
                <div>
                    <span className="text-[9px] uppercase font-extrabold text-gray-600 tracking-widest">Status Atual</span>
                    <div className={`flex items-center gap-2 font-black text-xl mt-1 ${currentLevel.color}`}>
                        <Crown size={20} fill="currentColor" /> {currentLevel.name.toUpperCase()}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[9px] text-gray-600 uppercase font-bold block">XP Total</span>
                    <span className="text-sm font-bold text-white tabular-nums">{xp} <span className="text-gray-600 text-[10px]">/ {nextLevel ? nextLevel.min : 'MAX'}</span></span>
                </div>
            </div>
            <div className="h-2 w-full bg-[#000] rounded-full overflow-hidden relative shadow-inner">
                <div className={`h-full ${currentLevel.bg} transition-all duration-1000 ease-out relative`} style={{ width: `${progress}%` }}></div>
            </div>
            {xp >= CONFIG.XP_THRESHOLDS.VIP ? (
                <div className="mt-3 flex items-center justify-center gap-2 text-[#FFD60A] bg-[#FFD60A]/10 py-1.5 rounded-lg border border-[#FFD60A]/20">
                     <Ticket size={14} className="animate-bounce"/> 
                     <span className="text-[10px] font-bold">CUPOM DE R$ {CONFIG.COUPON_VAL} DESBLOQUEADO</span>
                </div>
            ) : (
                <p className="text-[10px] mt-3 text-gray-500 text-center flex items-center justify-center gap-1">
                   Falta <span className="text-white font-bold">{nextLevel.min - xp} XP</span> para subir de nível.
                </p>
            )}
        </div>
    );
};

// ==================================================================================
// APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  const [data, setData] = useState(() => {
     try {
       // Backup para evitar crash se o localStorage estiver corrompido
       const s = localStorage.getItem('thaly_data_v7');
       if(s) { 
           const p = JSON.parse(s); 
           if(p.date) p.date = new Date(p.date); 
           // Garantir que location.city existe
           if(!p.location || !p.location.city) p.location = { ...p.location, city: CURRENT_LOCATIONS[0] };
           return p; 
       }
     } catch(e) { console.error(e); }
     
     // Estado Inicial Seguro
     return { 
         name: '', age: '', medical: false, 
         mood: null, service: null, date: null, time: null, 
         extras: { upgrade: false, touch: false, aroma: false }, 
         prefs: { music: 'Zen / Spa' },
         payment: null,
         couponRescued: false,
         location: {
             city: CURRENT_LOCATIONS[0], 
             type: 'home', 
             street: '', number: '', district: '', reference: '', 
             building: '', block: '', aptNumber: '', intercom: '', 
             hotelName: '', roomNumber: '', 
             motelName: '', suiteType: '' 
         }
     };
  });

  const [stage, setStage] = useState(0); 
  const [hasCoupon, setHasCoupon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const refs = {
    intro: useRef(null), mood: useRef(null), services: useRef(null), datetime: useRef(null), 
    extras: useRef(null), location: useRef(null), payment: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_data_v7', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  // Recuperar cupom se já foi resgatado
  useEffect(() => { if(data.couponRescued) setHasCoupon(true); }, [data.couponRescued]);

  // CÁLCULOS DETALHADOS
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

    const isRush = data.time && RUSH_HOURS.includes(data.time);
    const rushFee = isRush ? CONFIG.PRICES.RUSH_HOUR_FEE : 0;
    const travelFee = data.location.city ? data.location.city.fee : 0;
    
    // Separação de valores
    const serviceTotal = base + upg + touch + aroma + rushFee; // Massagista
    const transportTotal = travelFee; // Uber
    
    const sub = serviceTotal + transportTotal;
    const desc = hasCoupon ? CONFIG.COUPON_VAL : 0;
    const total = Math.max(0, sub - desc);
    
    return { 
        financials: { base, upg, touch, aroma, travelFee, rushFee, sub, desc, total, serviceTotal, transportTotal },
        xp: xpPoints
    };
  }, [data.service, data.extras, hasCoupon, data.location.city, data.time]);

  const isVip = xp >= CONFIG.XP_THRESHOLDS.VIP;

  const scrollToSection = (sectionRef) => {
    if (sectionRef && sectionRef.current) {
        setTimeout(() => {
            const yOffset = -140; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 100);
    }
  };

  const advanceStage = (next, ref) => {
    Utils.vibrate();
    if(next > stage) setStage(next);
    scrollToSection(ref);
  };

  const showToast = (msg, type='success') => setToast({msg, type});

  const generateMessage = () => {
    const d = data.date;
    const loc = data.location;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    
    let t = `🦁 *AGENDAMENTO CONFIRMADO*\n`;
    t += `------------------------------\n`;
    t += `👤 *${data.name.toUpperCase()}* (${data.age})\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name.toUpperCase()}*\n`;
    
    if(Object.values(data.extras).some(Boolean)) {
        t += `🔥 *EXTRAS:* `;
        const extrasList = [];
        if(data.extras.upgrade) extrasList.push(`+30min`);
        if(data.extras.touch) extrasList.push(`Interação`);
        if(data.extras.aroma) extrasList.push(`Aroma`);
        t += extrasList.join(', ') + `\n`;
    }
    
    t += `🎧 Vibe: ${data.mood?.label} | 🎵 Som: ${data.prefs.music}\n`;
    
    t += `\n📍 *LOCAL: ${loc.city.name}*\n`;
    if(loc.type === 'home' || loc.type === 'apto') {
        t += `🏠 End: ${loc.street}, ${loc.number} - ${loc.district}\n`;
        if(loc.type === 'apto') t += `🏢 Compl: ${loc.building} (Apto ${loc.aptNumber})\n`;
    } else {
        t += `🏨 Local: ${loc.hotelName || loc.motelName} (${loc.roomNumber || loc.suiteType})\n`;
    }

    t += `\n💰 *RESUMO DE VALORES:*\n`;
    t += `------------------------------\n`;
    t += `🔹 *Serviço + Extras:* ${Utils.formatBRL(financials.serviceTotal)} (Pagar ao final)\n`;
    
    if(financials.transportTotal > 0) {
         t += `🚗 *Taxa Deslocamento:* ${Utils.formatBRL(financials.transportTotal)} (Pode adiantar)\n`;
    }
    
    if(hasCoupon) t += `🎟️ *Desconto VIP:* -${Utils.formatBRL(financials.desc)}\n`;
    
    t += `\n✅ *TOTAL FINAL: ${Utils.formatBRL(financials.total)}*\n`;
    t += `💳 Forma de Pagto: ${data.payment?.toUpperCase()}\n`;
    
    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const isAddressValid = () => {
      const l = data.location;
      if (!l.city) return false;
      const basics = l.street && l.number && l.district;
      if (l.type === 'home') return basics;
      if (l.type === 'apto') return basics && l.building && l.aptNumber;
      if (l.type === 'hotel') return l.hotelName && l.roomNumber;
      if (l.type === 'motel') return l.motelName;
      return false;
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#000] z-50 flex flex-col items-center justify-center overflow-hidden">
      <style>{globalStyles}</style>
      <div className="relative mb-8">
          <div className="w-24 h-24 border-2 border-[#111] bg-[#111] rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(10,132,255,0.2)]">
               <span className="text-4xl">🦁</span>
          </div>
      </div>
      <div className="w-48 h-1 bg-[#111] rounded-full overflow-hidden mb-4">
           <div className="h-full bg-[#0A84FF] animate-[shimmer_1s_infinite]"></div>
      </div>
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] animate-pulse">Carregando...</p>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-[#000] flex flex-col items-center justify-center p-6 animate-enter text-center relative overflow-hidden">
       <style>{globalStyles}</style>
       <ConfettiExplosion />
       <div className="w-24 h-24 bg-[#32D74B] text-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.6)] animate-scale">
         <Check size={40} strokeWidth={4} />
       </div>
       <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">SUCESSO!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs">Pedido gerado. Envie para o WhatsApp para confirmar.</p>

       <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-3xl overflow-hidden shadow-2xl relative mb-8 group">
           <div className="p-6">
              <div className="flex justify-between items-baseline mb-6 border-b border-[#222] pb-4">
                 <span className="text-xs font-bold text-gray-500 uppercase">Total Final</span>
                 <span className="text-[#32D74B] font-black text-3xl">{Utils.formatBRL(financials.total)}</span>
              </div>
              
              <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-sm text-gray-300">
                      <span>Serviço (Pagar depois)</span>
                      <span className="font-bold">{Utils.formatBRL(financials.serviceTotal)}</span>
                  </div>
                  {financials.transportTotal > 0 && (
                      <div className="flex justify-between items-center text-sm text-[#0A84FF]">
                          <span>Uber/Deslocamento (Pagar antes)</span>
                          <span className="font-bold">{Utils.formatBRL(financials.transportTotal)}</span>
                      </div>
                  )}
              </div>

              {data.payment === 'pix' && (
                  <div onClick={() => {navigator.clipboard.writeText(CONFIG.PIX_KEY); Utils.vibrate(); showToast('Chave Pix copiada!')}} className="p-4 bg-[#1A1A1A] rounded-xl border border-dashed border-[#444] flex items-center justify-between cursor-pointer active:bg-[#222]">
                      <div className="text-left overflow-hidden">
                          <p className="text-[10px] text-[#0A84FF] uppercase font-bold mb-1">Toque para Copiar o Pix</p>
                          <p className="text-xs font-mono text-gray-400 truncate w-48">{CONFIG.PIX_KEY}</p>
                      </div>
                      <Copy size={18} className="text-white"/>
                  </div>
              )}
           </div>
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm primary-btn py-4 text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform mb-4 shadow-lg shadow-[#32D74B]/20 btn-pulse">
         <MessageCircle size={24} fill="currentColor" /> Enviar no WhatsApp
       </a>
       
       <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-gray-600 font-bold text-xs uppercase py-4 hover:text-white transition-colors">
           <RefreshCw size={12}/> Fazer Novo Pedido
       </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-48 selection:bg-[#0A84FF] selection:text-white relative bg-[#000]">
      <style>{globalStyles}</style>
      <LiveBubbles />
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 glass-header flex flex-col transition-all duration-300">
        <div className="px-5 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
                <div className="w-9 h-9 bg-[#0A84FF] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(10,132,255,0.5)] group-hover:rotate-12 transition-transform"><span className="font-black text-white text-sm">T.</span></div>
                <div>
                    <span className="font-bold text-lg tracking-tight text-white block leading-none">THALY.</span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Exclusive</span>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => {if(navigator.share) navigator.share({url: window.location.href}); else showToast("Link copiado!");}} className="p-2.5 bg-[#111] rounded-full border border-[#222] text-gray-400 hover:text-white transition-all"><Share2 size={16}/></button>
                <button onClick={()=>setHelpOpen(true)} className="p-2.5 bg-[#111] rounded-full border border-[#222] text-gray-400 hover:text-white transition-all"><HelpCircle size={16}/></button>
            </div>
        </div>
        <StatusBar />
        <div className="w-full h-[2px] bg-[#111] mt-0">
            <div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#00C7BE] transition-all duration-500 shadow-[0_0_10px_#0A84FF]" style={{width: `${(stage / 6) * 100}%`}}></div>
        </div>
      </header>

      {/* HELP MODAL */}
      {helpOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-enter">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#1C1C1E] w-full max-w-sm rounded-3xl border border-[#333] p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl flex items-center gap-2 text-white"><Info size={20} className="text-[#0A84FF]"/> Guia & Dúvidas</h3>
                      <button onClick={()=>setHelpOpen(false)} className="bg-[#333] p-1.5 rounded-full hover:bg-[#444]"><X size={16} className="text-white"/></button>
                  </div>
                  <div className="space-y-4">
                      {FAQS.map((f,i) => (
                          <div key={i} className="bg-[#111] p-4 rounded-xl border border-[#222]">
                              <h4 className="font-bold text-white text-sm mb-2">{f.q}</h4>
                              <p className="text-xs text-gray-400 leading-relaxed">{f.a}</p>
                          </div>
                      ))}
                  </div>
                  <button onClick={()=>setHelpOpen(false)} className="w-full mt-6 bg-[#0A84FF] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition-transform">Entendi</button>
              </div>
          </div>
      )}

      <main className="max-w-md mx-auto pt-36 px-5 relative z-10">
        
        {/* 1. INTRODUÇÃO */}
        <section ref={refs.intro} className={`transition-all duration-500 ${stage === 0 ? 'section-active' : 'section-blur'}`}>
            <div className="mb-8 mt-4">
                <p className="text-[#0A84FF] font-bold text-[10px] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#0A84FF]"></span>
                    {Utils.getGreeting()}, {data.name || 'Visitante'}
                </p>
                <h1 className="text-[38px] font-black leading-[0.95] tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500">
                    Relaxe com<br/>Nível Superior.
                </h1>
            </div>

            <LevelBar xp={xp} />
            <ReviewsList />

            <div className="card-base p-1 space-y-4 shadow-2xl border-[#222] bg-[#000]">
                 <div className="p-5 bg-[#121212] rounded-[18px] space-y-4 border border-[#1F1F1F]">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1 block">Como devo te chamar?</label>
                        <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Seu Nome ou Apelido" className="input-field placeholder:text-gray-700"/>
                    </div>
                    
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1.5 ml-1 block">Sua Idade</label>
                        <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Ex: 30" className="input-field placeholder:text-gray-700"/>
                    </div>
                    
                    <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all active:scale-98 ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#0A0A0A] border-[#222]'}`}>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444] bg-black'}`}>{data.medical && <Check size={14} className="text-white"/>}</div>
                        <div><p className={`text-xs font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Sou maior de idade e saudável</p></div>
                    </div>
                </div>

                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => advanceStage(1, refs.mood)} className="primary-btn w-full py-4 flex items-center justify-center gap-2 animate-scale text-lg">
                        Começar <ArrowRight size={20}/>
                    </button>
                )}
            </div>
        </section>

        {/* 1.5 SELETOR DE MOOD */}
        <section ref={refs.mood} className={`mt-8 transition-all duration-500 ${stage === 1 ? 'section-active' : stage > 1 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 1) { setStage(1); scrollToSection(refs.mood); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF] font-mono">01.</span> Qual sua Vibe hoje?</h3>
            <div className="grid grid-cols-3 gap-3">
                {MOODS.map(m => (
                    <button key={m.id} onClick={() => { setData({...data, mood: m}); advanceStage(2, refs.services); }}
                        className={`group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${data.mood?.id === m.id ? `border-white/50 bg-[#1A1A1A]` : 'bg-[#121212] border-[#222] hover:bg-[#181818]'}`}>
                        <div className={`mb-3 p-3 rounded-full ${m.bg} group-hover:scale-110 transition-transform`}><m.icon size={24} className={m.color}/></div>
                        <span className="text-xs font-bold text-white mb-1">{m.label}</span>
                    </button>
                ))}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-8 transition-all duration-500 ${stage === 2 ? 'section-active' : stage > 2 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 2) { setStage(2); scrollToSection(refs.services); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF] font-mono">02.</span> Experiência</h3>
            <div className="space-y-4">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 2) { setData({...data, service: s}); advanceStage(3, refs.datetime); }}} 
                        className={`card-base p-6 cursor-pointer group hover:border-gray-600 ${data.service?.id === s.id ? 'card-selected' : ''} ${s.highlight ? 'border-[#FFD60A]/50' : ''}`}>
                        
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-3 py-1.5 rounded-bl-xl shadow-lg z-10">{s.badge}</div>}
                        
                        <div className="flex justify-between items-start mb-3">
                            <div className="pr-4">
                                <h3 className={`text-xl font-bold tracking-tight ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                     <span className="text-[10px] font-bold text-[#32D74B] bg-[#32D74B]/10 px-1.5 py-0.5 rounded border border-[#32D74B]/20">+{s.xp} XP</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-white font-bold bg-[#222] border border-[#333] px-3 py-1.5 rounded-lg text-sm">{Utils.formatBRL(s.price)}</span>
                                <span className="text-[9px] text-gray-500 mt-1">{s.duration} min</span>
                            </div>
                        </div>
                        
                        <div className="my-3 h-px w-full bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
                        <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`mt-8 transition-all duration-500 ${stage === 3 ? 'section-active' : stage > 3 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 3) { setStage(3); scrollToSection(refs.datetime); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF] font-mono">03.</span> Data e Hora</h3>
            <div className="card-base p-5">
                <div className="ios-scroll pb-4">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        const isToday = i === 0;
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} 
                                className={`snap-center min-w-[70px] h-[85px] rounded-2xl flex flex-col items-center justify-center border transition-all relative overflow-hidden ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-[0_0_20px_rgba(10,132,255,0.3)]' : 'bg-[#161616] border-[#222] text-gray-400 hover:border-gray-500'}`}>
                                {isToday && <span className="absolute top-0 w-full bg-white/10 text-[8px] font-bold py-0.5 text-center">HOJE</span>}
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-black tracking-tighter">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                
                <div className={`grid grid-cols-4 gap-2 mt-2 transition-opacity duration-300 ${data.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => {
                        const isRush = RUSH_HOURS.includes(t);
                        const blocked = Utils.isTimeBlocked(data.date, t);
                        return (
                        <button key={t} disabled={blocked} onClick={() => { setData({...data, time: t}); advanceStage(4, refs.extras); }} 
                            className={`relative py-3 rounded-xl text-xs font-bold border overflow-hidden transition-all ${data.time === t ? 'bg-white text-black scale-105 shadow-lg z-10' : blocked ? 'opacity-20 cursor-not-allowed bg-[#111] border-transparent' : 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-300 hover:bg-[#222]'}`}>
                            {t}
                            {isRush && !blocked && (
                                <div className="absolute top-0 right-0 w-2 h-2 bg-[#FFD60A] rounded-bl-md"></div>
                            )}
                        </button>
                    )})}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={`mt-8 transition-all duration-500 ${stage === 4 ? 'section-active' : stage > 4 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 4) { setStage(4); scrollToSection(refs.extras); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF] font-mono">04.</span> Personalize</h3>
            <div className="card-base divide-y divide-[#222]">
                {[
                   { id: 'upgrade', label: '+30 Minutos', sub: 'Sessão estendida', icon: Clock, price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT, badge: '+30 XP' },
                   { id: 'touch', label: 'Interação', sub: 'Toques recíprocos', icon: Flame, price: CONFIG.PRICES.TOUCH, badge: '+25 XP' },
                   { id: 'aroma', label: 'Aromaterapia', sub: 'Óleos essenciais', icon: Wind, price: CONFIG.PRICES.AROMA, badge: '+15 XP' }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#181818] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${data.extras[item.id] ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-[0_0_15px_rgba(10,132,255,0.4)]' : 'border-[#333] bg-[#0F0F0F] text-gray-500'}`}>
                                {data.extras[item.id] ? <Check size={20}/> : <item.icon size={20}/>}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-white text-sm">{item.label}</p>
                                    <span className="text-[9px] bg-[#1A1A1A] text-gray-400 px-1.5 py-0.5 rounded border border-[#333] font-bold">{item.badge}</span>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-0.5">{item.sub}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <span className="text-[#0A84FF] font-bold text-sm block">+ {Utils.formatBRL(item.price)}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* 4.5 PREFERÊNCIAS */}
            <div className="mt-4 card-base p-5 border border-[#222] bg-[#0A0A0A]">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><Coffee size={12}/> Detalhes (Grátis)</h4>
                <div>
                     <label className="text-[10px] text-gray-500 mb-2 block font-bold">Trilha Sonora</label>
                     <div className="ios-scroll pb-1">
                         {PREFERENCES.music.map(m => (
                             <button key={m} onClick={() => setData({...data, prefs: {...data.prefs, music: m}})} 
                                 className={`px-4 py-2 rounded-lg text-[11px] font-bold border whitespace-nowrap transition-all ${data.prefs.music === m ? 'bg-[#FFD60A] border-[#FFD60A] text-black shadow-lg' : 'bg-[#161616] border-[#333] text-gray-400 hover:border-gray-500'}`}>
                                 {data.prefs.music === m && <Music size={10} className="inline mr-1"/>}
                                 {m}
                             </button>
                         ))}
                     </div>
                </div>
            </div>

            <button onClick={() => advanceStage(5, refs.location)} className={`w-full mt-4 py-4 rounded-2xl text-sm font-bold border transition-all ${Object.values(data.extras).some(Boolean) ? 'bg-[#0A84FF] text-white shadow-lg' : 'bg-[#1C1C1E] text-gray-400 border-[#333]'}`}>
                {Object.values(data.extras).some(Boolean) ? 'Confirmar Extras' : 'Continuar sem Extras'}
            </button>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section ref={refs.location} className={`mt-8 transition-all duration-500 ${stage === 5 ? 'section-active' : stage > 5 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 5) { setStage(5); scrollToSection(refs.location); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF] font-mono">05.</span> Localização</h3>
            
            <div className="mb-6">
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block ml-1">Região de Atendimento</label>
                <div className="ios-scroll pb-2">
                    {Object.values(LOCATIONS_DB).flat().map(c => (
                        <button key={c.id} onClick={() => setData({...data, location: {...data.location, city: c}})} 
                            className={`flex-shrink-0 px-4 py-3 rounded-xl text-xs font-bold border transition-all ${data.location.city.id === c.id ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                            {c.name} {c.fee > 0 && `(+${Utils.formatBRL(c.fee)})`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
                {LOCATION_TYPES.map(t => (
                    <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                        className={`group flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${data.location.type === t.id ? 'bg-[#0A84FF]/10 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#121212] border-[#222] text-gray-500 hover:bg-[#181818]'}`}>
                        <t.icon size={20} className={`mb-1.5 transition-transform group-active:scale-90 ${data.location.type === t.id ? 'text-[#0A84FF]' : 'text-gray-500'}`}/>
                        <span className="text-[9px] font-bold uppercase">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="card-base p-5 animate-enter border-[#333] bg-[#0F0F0F]">
                {data.location.type === 'home' && (
                    <div className="space-y-4">
                        <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                        <input placeholder="Bairro" value={data.location.district} onChange={e => setData({...data, location: {...data.location, district: e.target.value}})} className="input-field"/>
                        <input placeholder="Ponto de Referência (Opcional)" value={data.location.reference} onChange={e => setData({...data, location: {...data.location, reference: e.target.value}})} className="input-field"/>
                    </div>
                )}
                {data.location.type === 'apto' && (
                    <div className="space-y-4">
                        <input placeholder="Nome do Edifício" value={data.location.building} onChange={e => setData({...data, location: {...data.location, building: e.target.value}})} className="input-field"/>
                        <div className="flex gap-3"><input placeholder="Bloco" value={data.location.block} onChange={e => setData({...data, location: {...data.location, block: e.target.value}})} className="input-field w-1/2"/><input placeholder="Apto" type="tel" value={data.location.aptNumber} onChange={e => setData({...data, location: {...data.location, aptNumber: e.target.value}})} className="input-field w-1/2"/></div>
                        <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                        <input placeholder="Bairro" value={data.location.district} onChange={e => setData({...data, location: {...data.location, district: e.target.value}})} className="input-field"/>
                        <input placeholder="Interfone" value={data.location.intercom} onChange={e => setData({...data, location: {...data.location, intercom: e.target.value}})} className="input-field"/>
                    </div>
                )}
                {data.location.type === 'hotel' && (
                    <div className="space-y-4">
                        <input placeholder="Nome do Hotel" value={data.location.hotelName} onChange={e => setData({...data, location: {...data.location, hotelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Número do Quarto" type="tel" value={data.location.roomNumber} onChange={e => setData({...data, location: {...data.location, roomNumber: e.target.value}})} className="input-field"/>
                        <p className="text-[10px] text-gray-500 flex items-center gap-2 p-3 bg-[#1A1A1A] rounded-xl border border-[#222]"><Lock size={12}/> Seus dados de localização são criptografados.</p>
                    </div>
                )}
                {data.location.type === 'motel' && (
                    <div className="space-y-4">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl flex gap-3 items-start">
                             <AlertTriangle size={16} className="text-yellow-500 shrink-0 mt-0.5"/>
                             <p className="text-[10px] text-yellow-500/90 leading-relaxed font-medium">Lembre-se: A suíte é paga separadamente na saída.</p>
                        </div>
                        <input placeholder="Nome do Motel" value={data.location.motelName} onChange={e => setData({...data, location: {...data.location, motelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Tipo de Suíte (Ex: Hidro)" value={data.location.suiteType} onChange={e => setData({...data, location: {...data.location, suiteType: e.target.value}})} className="input-field"/>
                    </div>
                )}
                
                <button disabled={!isAddressValid()} onClick={() => advanceStage(6, refs.payment)} 
                    className="primary-btn w-full py-4 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">Confirmar Local</button>
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`mt-8 transition-all duration-500 ${stage === 6 ? 'section-active' : 'hidden opacity-0'}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF] font-mono">06.</span> Pagamento</h3>
            <div className="card-base p-4 grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(7, null); if(method==='pix') {navigator.clipboard.writeText(CONFIG.PIX_KEY); showToast('Pix Copiado!');} }} 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all group ${data.payment === method ? 'bg-[#0A84FF]/20 border-[#0A84FF] shadow-[0_0_20px_rgba(10,132,255,0.2)]' : 'border-[#333] hover:bg-[#222] bg-[#121212]'}`}>
                        {method==='pix' && <QrCode size={24} className={`mb-1 transition-transform group-hover:scale-110 ${data.payment===method?'text-[#0A84FF]':'text-gray-400'}`}/>}
                        {method==='dinheiro' && <Banknote size={24} className={`mb-1 transition-transform group-hover:scale-110 ${data.payment===method?'text-[#32D74B]':'text-gray-400'}`}/>}
                        {method==='cartao' && <CreditCard size={24} className={`mb-1 transition-transform group-hover:scale-110 ${data.payment===method?'text-[#FFD60A]':'text-gray-400'}`}/>}
                        <span className="text-[10px] font-bold uppercase">{method}</span>
                    </button>
                ))}
            </div>
            
             <p className="text-[10px] text-gray-500 text-center flex justify-center items-center gap-1 mb-8">
                 <Lock size={10}/> Pagamento seguro e direto. Sem intermediários.
             </p>
        </section>

      </main>

      {/* CHECKOUT STICKY BAR */}
      {stage >= 7 && !success && (
        <div className="fixed bottom-0 w-full z-50 animate-enter">
            {/* Gradient Fade */}
            <div className="h-16 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            
            <div className="bg-[#111]/95 backdrop-blur-xl border-t border-white/10 p-5 pb-8 rounded-t-[30px] shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Total Final</p>
                        <div className="flex items-baseline gap-2">
                            {hasCoupon && <span className="text-xs text-gray-500 line-through decoration-red-500">{Utils.formatBRL(financials.sub)}</span>}
                            <span className="text-3xl font-black text-white tracking-tight">{Utils.formatBRL(financials.total)}</span>
                        </div>
                        {financials.transportTotal > 0 && <p className="text-[9px] text-[#0A84FF] mt-1 flex items-center gap-1"><Car size={10}/> Taxa de deslocamento inclusa</p>}
                    </div>
                    {!hasCoupon ? (
                        isVip && !data.couponRescued ? (
                            <button onClick={() => { setHasCoupon(true); setData({...data, couponRescued: true}); Utils.vibrate([50,50]); showToast('Cupom VIP Ativado!', 'success'); }} className="h-10 px-4 rounded-full bg-[#FFD60A] text-black font-bold text-xs animate-bounce shadow-[0_0_20px_rgba(255,214,10,0.4)] flex items-center gap-2 hover:scale-105 transition-transform"><Ticket size={14}/> RESGATAR DESCONTO</button>
                        ) : (
                            <div className="text-right">
                                <div className="text-[9px] text-gray-500 mb-1 font-bold">XP para Desconto</div>
                                <div className="w-24 h-2 bg-[#222] rounded-full overflow-hidden ml-auto border border-[#333]">
                                    <div className="h-full bg-gradient-to-r from-gray-600 to-white" style={{width: `${(xp/CONFIG.XP_THRESHOLDS.VIP)*100}%`}}></div>
                                </div>
                            </div>
                        )
                    ) : <div className="text-[10px] text-[#32D74B] font-bold border border-[#32D74B] px-3 py-1.5 rounded-lg bg-[#32D74B]/10 flex items-center gap-1"><Check size={10}/> VIP APLICADO</div>}
                </div>
                
                <button onClick={() => { setSuccess(true); window.scrollTo(0,0); }} className="primary-btn w-full h-14 text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform">
                    Finalizar Pedido <MessageCircle size={22} fill="currentColor" className="opacity-50"/>
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
