import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, ChevronRight, Menu, X, 
  HelpCircle, Instagram, Calendar as CalendarIcon, Clock, User, AlertTriangle, Car, Copy, Info
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO (EDITÁVEL)
// ==================================================================================

const CONFIG = {
  // MUDE AQUI: 'SP' ou 'INTERIOR'
  REGION_MODE: 'SP', 

  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  
  // FINANCEIRO
  COUPON_VAL: 15.00, 
  PRICES: {
    UPGRADE_PCT: 0.5, // +50% do valor base
    TOUCH: 73, 
    AROMA: 5,
  },
  
  // GAMIFICAÇÃO (BALANCEADA PARA NÃO DAR PREJUÍZO)
  // O cliente precisa gastar aprox 200 reais para ganhar o cupom de 15.
  XP_THRESHOLDS: { VIP: 100, ALPHA: 150 },
  
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

// --- BASE DE DADOS DE LOCAIS (SP x INTERIOR) ---
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

const CURRENT_LOCATIONS = LOCATIONS_DB[CONFIG.REGION_MODE];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'Massagista de Cueca. O protocolo premium. Inicia de bruços soltando a musculatura, vira de frente com creme e óleo, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    xp: 60 // Sozinho não dá VIP (Precisa de extras)
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico e relaxante. Ideal para remover dores lombares, pernas cansadas. Toques suaves para relaxar e tirar o stress, sem toques íntimos.', 
    duration: 60, 
    price: 125, 
    badge: null,
    xp: 30 // Precisa de muito extra pra dar VIP
  },
];

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

const LEVELS = [
  { name: 'Visitante', min: 0, color: 'text-gray-500', bg: 'bg-gray-700' },
  { name: 'Membro', min: 40, color: 'text-blue-400', bg: 'bg-blue-500' },
  { name: 'VIP', min: CONFIG.XP_THRESHOLDS.VIP, color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]' }, 
  { name: 'ALPHA', min: CONFIG.XP_THRESHOLDS.ALPHA, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]' }
];

// --- BANCO DE DADOS DE TEXTOS ---

const LIVE_NOTIFICATIONS = [
  "🔥 João acabou de agendar", "👀 4 pessoas vendo a agenda", "📅 Agenda de Sexta quase cheia",
  "⭐ Pedro avaliou com 5 estrelas", "✅ Matheus confirmou presença", "💎 Murilo virou VIP",
  "🌊 Ricardo ativou o modo relax", "💬 Lucas enviou uma dúvida", "🏠 Atendimento em domicílio iniciado",
  "🚀 Bruno fechou o pacote completo", "😈 Felipe adicionou interação", "🏨 Atendimento em Hotel iniciado",
  "🍃 Gustavo pediu Aromaterapia", "💳 Pagamento via Pix recebido", "🏳️‍🌈 Cliente novo cadastrado",
  "🕶️ Modo Sigilo Ativado", "🚗 Thalyson está a caminho", "⏱️ Sessão estendida agendada",
  "🧖‍♂️ Rafael finalizou a sessão", "✨ Avaliação 5 estrelas recebida", "🔥 Agenda de Sábado abriu",
  "📍 Atendimento na Bela Vista", "📍 Atendimento no Jardins", "📍 Atendimento em Moema",
  "🎁 Cupom VIP foi resgatado", "🔒 Dados criptografados", "👋 Marcos mandou um 'Oi'",
  "💼 Executivo agendou horário", "✈️ Turista do RJ agendou", "🛌 Suíte de Motel reservada"
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", a: "Tiago (Bela Vista)", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda, jorrei longe.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório.", a: "Empresário", s: 5 },
  { t: "Precisava desse escape. O stress sumiu na hora. Discrição nota 10.", a: "M. (Casado)", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Ele de cueca branca... sem comentários. Visual nota 1000.", a: "Fã", s: 5 },
  { t: "Profissionalismo raro hoje em dia. Pontual e educado.", a: "Carlos A.", s: 5 },
  { t: "A mistura de força e suavidade é incrível. Recomendo.", a: "Lucas", s: 5 },
  { t: "Primeira vez que faço e me senti super à vontade. Thalyson é gente boa.", a: "Novato", s: 5 },
  { t: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Gostei bastante, me senti bem relaxado depois, saí mais leve.", a: "Alan SP", s: 5 },
  { t: "O corpo a corpo é quente de verdade. Uma experiência única.", a: "J.P.", s: 5 },
  { t: "Gostei que ele respeita os limites, mas entrega muito prazer.", a: "André", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto. Salvou minha viagem.", a: "Turista RJ", s: 5 },
  { t: "Cara bonito, limpo e com pegada. O pacote completo.", a: "Anônimo", s: 5 },
  { t: "A técnica dele é diferente de tudo. Vale cada real.", a: "Dr. Marcelo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Me senti renovado. Energia lá em cima depois da sessão.", a: "Vitor", s: 5 },
  { t: "Extremamente educado e com papo bom, além da massagem top.", a: "Renan", s: 5 },
  { t: "O lubrificante é um detalhe que faz toda diferença.", a: "Paulo", s: 5 },
  { t: "Já fiz com vários massagistas, o Thalyson é o melhor da região.", a: "Cliente Antigo", s: 5 },
  { t: "Não economizem, peçam a completa com aromaterapia.", a: "Dica do Beto", s: 5 },
  { t: "Pontualidade britânica. Chegou na hora marcada.", a: "Advogado SP", s: 5 },
  { t: "Fiquei impressionado com a força das mãos dele.", a: "Gym Rat", s: 5 },
  { t: "A finalização manual é intensa mesmo, cumpriu o que prometeu.", a: "Anônimo", s: 5 },
  { t: "Excelente profissional. Me deixou super confortável.", a: "Hétero Curioso", s: 5 },
  { t: "Massagem terapêutica de verdade, tirou todos os nós das costas.", a: "Motorista", s: 5 },
  { t: "O sigilo é garantido mesmo. Pode confiar.", a: "M. (Sigilo)", s: 5 },
  { t: "Agradeço pela paciência e pelo serviço impecável.", a: "Sr. João", s: 5 },
  { t: "Experiência sensorial incrível. O cheiro, o toque, a música.", a: "Designer", s: 5 },
  { t: "Saí flutuando. Recomendo para quem tem rotina estressante.", a: "Executivo", s: 5 },
  { t: "O Thalyson é muito gente fina. O tempo passou voando.", a: "Matheus", s: 5 },
  { t: "Melhor investimento da semana. Relaxamento total.", a: "Bruno", s: 5 },
  { t: "Toque firme, mas sensível. Sabe onde tocar.", a: "Rafa", s: 5 },
  { t: "Gostei da facilidade de agendar pelo app. Sem enrolação.", a: "Tech Guy", s: 5 },
  { t: "Massagem nos pés foi um bônus que eu não esperava. Ótimo.", a: "Corredor", s: 5 },
  { t: "Simpático e bonito. O serviço é completo mesmo.", a: "Fã #2", s: 5 },
  { t: "Me ajudou muito com a ansiedade. Gratidão.", a: "Pedro", s: 5 },
  { t: "Fiz no meu apto e foi Prático.", a: "Morador Centro", s: 5 },
  { t: "A massagem tântrica dele desbloqueou sensações novas.", a: "Curioso", s: 5 },
  { t: "Valeu a pena esperar a agenda liberar.", a: "Ricardo", s: 5 },
  { t: "Nota 10. Nada a reclamar.", a: "Sérgio", s: 5 },
  { t: "O final foi explosivo. Recomendo.", a: "Anônimo", s: 5 },
  { t: "Muito higiênico e cuidadoso.", a: "Médico", s: 5 },
  { t: "Voltarei com certeza na próxima semana.", a: "Cliente Fiel", s: 5 },
  { t: "Paz de espírito e corpo relaxado. Obrigado.", a: "Fernando", s: 5 }
];

// ==================================================================================
// 3. UTILITÁRIOS & ESTILOS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: (pattern = 10) => { if (navigator.vibrate) navigator.vibrate(pattern); },
  // Embaralha sem repetir imediatamente
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = new Date(selectedDate); sel.setHours(0,0,0,0);
    if (sel < today) return true; 
    if (sel > today) return false; 
    const [hours] = timeString.split(':').map(Number);
    return hours <= now.getHours() + 2; 
  }
};

const globalStyles = `
:root { --primary: #0A84FF; --bg-app: #050505; --card-bg: #141414; --border: #222; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Roboto", sans-serif; }
body { background: var(--bg-app); color: #fff; padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden; scroll-behavior: smooth; }
input, select, button { outline: none; }
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }
@keyframes bubblePop { 0% { opacity: 0; transform: scale(0.8) translateY(-10px); } 10% { opacity: 1; transform: scale(1) translateY(0); } 90% { opacity: 1; transform: scale(1) translateY(0); } 100% { opacity: 0; transform: scale(0.8) translateY(-10px); } }

.animate-enter { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-scale { animation: scaleIn 0.4s ease-out forwards; }
.animate-bubble { animation: bubblePop 6s ease-in-out forwards; }
.btn-pulse { animation: pulse-glow 2s infinite; }

.glass-header { background: rgba(5, 5, 5, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.08); }
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.card-selected { border-color: var(--primary); background: rgba(10, 132, 255, 0.08); box-shadow: 0 0 30px rgba(10, 132, 255, 0.1); }
.input-field { background: #1C1C1E; border: 1px solid #333; color: white; border-radius: 14px; width: 100%; transition: all 0.3s; font-size: 15px; padding: 14px; }
.input-field:focus { border-color: var(--primary); background: #262626; box-shadow: 0 0 0 2px rgba(10,132,255,0.2); }
.primary-btn { background: var(--primary); color: white; border-radius: 18px; font-weight: 800; border: none; box-shadow: 0 8px 30px rgba(10, 132, 255, 0.3); }

.section-blur { opacity: 0.3; filter: blur(3px); pointer-events: none; transition: all 0.6s ease; transform: scale(0.98); }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; transform: scale(1); }
`;

// ==================================================================================
// 4. COMPONENTES VISUAIS & LOGICA
// ==================================================================================

// Live Bubbles: Não repete até acabar a lista
const LiveBubbles = () => {
    const [msg, setMsg] = useState(null);
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        // Inicializa fila embaralhada
        setQueue(Utils.shuffle([...LIVE_NOTIFICATIONS]));
    }, []);

    useEffect(() => {
        if(queue.length === 0 && LIVE_NOTIFICATIONS.length > 0) {
             setQueue(Utils.shuffle([...LIVE_NOTIFICATIONS])); // Recarrega
             return;
        }

        const cycle = () => {
            if (queue.length > 0) {
                const nextMsg = queue[0];
                setMsg(nextMsg);
                setQueue(q => q.slice(1)); // Remove o usado
                setTimeout(() => setMsg(null), 8000);
            }
        };

        const interval = setInterval(cycle, 18000); // 18 segundos entre bolhas
        cycle(); // Primeira execução
        return () => clearInterval(interval);
    }, [queue]);

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

const LevelBar = ({ xp }) => {
    const currentLevel = LEVELS.slice().reverse().find(l => xp >= l.min) || LEVELS[0];
    const nextLevel = LEVELS.find(l => l.min > xp);
    const progress = nextLevel ? Math.min(100, ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100) : 100;

    return (
        <div className="mb-6 animate-enter bg-[#111] p-4 rounded-2xl border border-[#222]">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status Cliente</span>
                    <div className={`flex items-center gap-2 font-black text-xl ${currentLevel.color}`}>
                        <Crown size={20} fill="currentColor" /> {currentLevel.name.toUpperCase()}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] text-gray-500 block">XP Acumulado</span>
                    <span className="text-sm font-bold text-white">{xp} <span className="text-gray-600">/ {nextLevel ? nextLevel.min : 'MAX'}</span></span>
                </div>
            </div>
            <div className="h-2.5 w-full bg-[#222] rounded-full overflow-hidden relative shadow-inner">
                <div className={`h-full ${currentLevel.bg} transition-all duration-1000 ease-out shadow-[0_0_15px_currentColor]`} style={{ width: `${progress}%` }}></div>
            </div>
            {xp >= CONFIG.XP_THRESHOLDS.VIP ? (
                <p className="text-[10px] text-center mt-2 text-[#FFD60A] font-bold animate-pulse flex items-center justify-center gap-1">
                    <Ticket size={12}/> CUPOM DE R$ {CONFIG.COUPON_VAL} LIBERADO
                </p>
            ) : (
                <p className="text-[10px] mt-2 text-gray-400 text-center">
                   Adicione <span className="text-[#0A84FF]">Extras</span> para subir de nível e ganhar desconto.
                </p>
            )}
        </div>
    );
};

const ReviewsTicker = () => {
    const [idx, setIdx] = useState(0);
    // Shuffle inicial para não repetir ordem
    const [list] = useState(() => Utils.shuffle([...REVIEWS_DB]));

    useEffect(() => { 
        const t = setInterval(() => setIdx(i => (i+1)%list.length), 7000); 
        return () => clearInterval(t); 
    }, [list]);

    return (
        <div className="bg-[#111] border border-[#222] rounded-2xl p-4 mb-6 relative shadow-lg flex flex-col justify-center min-h-[110px]">
            <div className="flex text-[#FFD60A] mb-2 gap-1"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
            {/* Altura fixa para evitar pulo de layout */}
            <div className="relative">
                <p className="text-[14px] text-gray-300 italic mb-2 leading-relaxed animate-enter" key={idx}>
                    "{list[idx].t}"
                </p>
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1 mt-auto">
                <Shield size={10} className="text-[#32D74B]"/> {list[idx].a}
            </p>
        </div>
    )
};

// ==================================================================================
// 5. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  const [data, setData] = useState(() => {
     try {
       const s = localStorage.getItem('thaly_ultimate_v2');
       if(s) { const p = JSON.parse(s); if(p.date) p.date = new Date(p.date); return p; }
     } catch(e){}
     return { 
         name: '', age: '', medical: false, 
         service: null, date: null, time: null, 
         extras: { upgrade: false, touch: false, aroma: false }, 
         payment: null,
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

  const refs = {
    intro: useRef(null), services: useRef(null), datetime: useRef(null), 
    extras: useRef(null), location: useRef(null), payment: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_ultimate_v2', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 1200); }, []);

  // --- LÓGICA FINANCEIRA & XP (GAMIFICAÇÃO BALANCEADA) ---
  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    const base = data.service ? data.service.price : 0;
    if (data.service) xpPoints += data.service.xp;

    const upg = data.extras.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    if (data.extras.upgrade) xpPoints += 25;

    const touch = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    if (data.extras.touch) xpPoints += 30; // + XP porque é lucrativo

    const aroma = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    if (data.extras.aroma) xpPoints += 15;

    const travelFee = data.location.city ? data.location.city.fee : 0;
    
    const sub = base + upg + touch + aroma + travelFee;
    const desc = hasCoupon ? CONFIG.COUPON_VAL : 0;
    
    return { 
        financials: { base, upg, touch, aroma, travelFee, sub, desc, total: Math.max(0, sub - desc) },
        xp: xpPoints
    };
  }, [data.service, data.extras, hasCoupon, data.location.city]);

  const isVip = xp >= CONFIG.XP_THRESHOLDS.VIP;

  const scrollToSection = (sectionRef) => {
    if (sectionRef && sectionRef.current) {
        setTimeout(() => {
            const yOffset = -85; 
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

  // --- GERADOR WHATSAPP SENIOR ---
  const generateMessage = () => {
    const d = data.date;
    const loc = data.location;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    
    let t = `🦁 *AGENDAMENTO CONFIRMADO*\n`;
    t += `------------------------------\n`;
    t += `👤 *${data.name}* (${data.age} anos)\n`;
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
    
    t += `\n📍 *LOCAL: ${loc.city.name}*\n`;
    
    if(loc.type === 'home') {
        t += `🏠 Rua: ${loc.street}, ${loc.number}\n`;
        t += `🏘️ Bairro: ${loc.district}\n`;
        if(loc.reference) t += `👀 Ref: ${loc.reference}\n`;
    } else if (loc.type === 'apto') {
        t += `🏢 Edifício: ${loc.building}\n`;
        t += `🚪 Apto ${loc.aptNumber} - Bloco ${loc.block}\n`;
        t += `🏘️ Bairro: ${loc.district}\n`;
        if(loc.intercom) t += `🔔 Interfone: ${loc.intercom}\n`;
    } else if (loc.type === 'hotel') {
        t += `🏨 Hotel: ${loc.hotelName}\n`;
        t += `🔑 Quarto: ${loc.roomNumber}\n`;
    } else if (loc.type === 'motel') {
        t += `🏩 Motel: ${loc.motelName}\n`;
        t += `🛏️ Suíte: ${loc.suiteType || 'A escolher'}\n`;
        t += `⚠️ *Cliente paga a suíte*\n`;
    }

    t += `\n💰 *TOTAL FINAL: ${Utils.formatBRL(financials.total)}*\n`;
    if(financials.travelFee > 0) t += `🚗 Taxa ${loc.city.zone}: ${Utils.formatBRL(financials.travelFee)} (Inclusa)\n`;
    if(hasCoupon) t += `🎟️ Cupom VIP: -${Utils.formatBRL(financials.desc)}\n`;
    t += `💳 Pagamento: ${data.payment?.toUpperCase()}\n`;
    
    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const isAddressValid = () => {
      const l = data.location;
      if (!l.city) return false;
      if (l.type === 'home') return l.street && l.number && l.district;
      if (l.type === 'apto') return l.building && l.aptNumber && l.district;
      if (l.type === 'hotel') return l.hotelName && l.roomNumber;
      if (l.type === 'motel') return l.motelName;
      return false;
  };

  if (loading) return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center">
      <style>{globalStyles}</style>
      <div className="w-20 h-20 border-4 border-[#111] border-t-[#0A84FF] rounded-full animate-spin mb-6"></div>
      <h1 className="text-3xl font-black tracking-tighter text-white mb-2">THALY.</h1>
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em] animate-pulse">Carregando...</p>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-[#050505] pt-12 pb-12 px-6 flex flex-col items-center animate-enter text-center">
       <style>{globalStyles}</style>
       <div className="w-24 h-24 bg-[#32D74B]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.4)] animate-scale">
         <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Pedido Pronto!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs">Envie a confirmação para o meu WhatsApp agora.</p>

       <div className="w-full max-w-sm bg-[#18181b] border border-[#333] rounded-3xl overflow-hidden shadow-2xl relative mb-8">
           <div className="h-1.5 w-full bg-gradient-to-r from-[#0A84FF] via-[#32D74B] to-[#0A84FF]"></div>
           <div className="p-6">
              <div className="flex justify-between items-start mb-4 border-b border-[#333] pb-4">
                 <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Valor Total</p>
                    <p className="text-[#32D74B] font-bold text-2xl">{Utils.formatBRL(financials.total)}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Taxa {data.location.city.zone}</p>
                    <p className="text-white font-bold">{Utils.formatBRL(financials.travelFee)}</p>
                 </div>
              </div>
              <div className="text-left space-y-3">
                  <p className="text-gray-300 text-sm flex items-center gap-2"><MapPin size={16} className="text-[#0A84FF]"/> {data.location.city.name}</p>
                  <p className="text-gray-300 text-sm flex items-center gap-2"><CalendarIcon size={16} className="text-[#0A84FF]"/> {data.date?.toLocaleDateString()} às {data.time}</p>
                  <p className="text-gray-300 text-sm flex items-center gap-2"><User size={16} className="text-[#0A84FF]"/> {data.name}</p>
              </div>
              {data.payment === 'pix' && (
                  <div onClick={() => {navigator.clipboard.writeText(CONFIG.PIX_KEY); Utils.vibrate()}} className="mt-4 p-3 bg-black/50 rounded-xl border border-white/5 flex items-center justify-between cursor-pointer active:bg-white/10">
                      <div className="text-left">
                          <p className="text-[10px] text-gray-500 uppercase mb-1">Chave Pix (Toque p/ Copiar)</p>
                          <p className="text-xs font-mono text-white truncate w-40">{CONFIG.PIX_KEY}</p>
                      </div>
                      <Copy size={16} className="text-gray-400"/>
                  </div>
              )}
           </div>
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm primary-btn py-4 text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform mb-4 shadow-lg shadow-[#32D74B]/20">
         <MessageCircle size={24} fill="currentColor" /> Enviar no WhatsApp
       </a>
       {/* RESET TOTAL AO VOLTAR */}
       <button onClick={() => { setSuccess(false); setHasCoupon(false); setStage(0); window.scrollTo(0,0); }} className="text-gray-600 font-bold text-xs uppercase py-4">Novo Pedido</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-48 selection:bg-[#0A84FF] selection:text-white relative">
      <style>{globalStyles}</style>
      <LiveBubbles />
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 glass-header py-3 px-5 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2" onClick={() => window.location.reload()}>
            <div className="w-8 h-8 bg-[#0A84FF] rounded-lg flex items-center justify-center shadow-lg"><span className="font-black text-white text-sm">T.</span></div>
            <span className="font-bold text-lg tracking-tight text-white">THALY.</span>
        </div>
        <div className="flex items-center gap-3">
            <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-95"><Instagram size={18} className="text-white"/></a>
            <button onClick={()=>setHelpOpen(true)} className="p-2 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-95"><HelpCircle size={18} className="text-white"/></button>
        </div>
      </header>

      {/* HELP MODAL */}
      {helpOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-enter">
              <div className="absolute inset-0 bg-black/80 backdrop-blur" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#1C1C1E] w-full max-w-sm rounded-3xl border border-[#333] p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl flex items-center gap-2"><Info size={20} className="text-[#0A84FF]"/> Guia Rápido</h3>
                      <button onClick={()=>setHelpOpen(false)} className="bg-[#333] p-1 rounded-full"><X size={16}/></button>
                  </div>
                  <div className="space-y-4">
                      <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                          <div><h3 className="font-bold text-white text-sm">O Serviço</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Massagem profissional masculina realizada no conforto do seu local (Apt, Casa, Suíte e Hotel).</p></div>
                      </div>
                      <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                          <div><h3 className="font-bold text-white text-sm">Preparação</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Recomendo um banho quente antes. Levo creme, óleos, lubrificantes e aromatizador.</p></div>
                      </div>
                      <div className="bg-[#2C2C2E] p-4 rounded-xl border border-[#333]">
                          <h4 className="font-bold text-white text-xs uppercase mb-2 flex items-center gap-2"><Lock size={12}/> Pagamento</h4>
                          <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                              <li>Pix, Cartão e Dinheiro.</li>
                              <li>Cancelamentos com min. 2 horas.</li>
                          </ul>
                      </div>
                  </div>
                  <button onClick={()=>setHelpOpen(false)} className="w-full mt-6 bg-[#0A84FF] py-3 rounded-xl font-bold">Entendi</button>
              </div>
          </div>
      )}

      <main className="max-w-md mx-auto pt-24 px-5">
        
        {/* 1. INTRODUÇÃO */}
        <section ref={refs.intro} className={`transition-all duration-500 ${stage === 0 ? 'section-active' : 'section-blur'}`}>
            <div className="mb-6 mt-2">
                <h1 className="text-[34px] font-extrabold leading-tight mb-2">Massagem &<br/><span className="text-[#0A84FF]">Momentos Únicos.</span></h1>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[90%]">Massoterapia masculina no conforto do seu local. Discrição total e técnica apurada.</p>
            </div>

            <LevelBar xp={xp} />
            <ReviewsTicker />

            <div className="card-base p-6 space-y-5 shadow-2xl border-[#222]">
                <div><label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1">Seu Nome</label><input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Como prefere ser chamado?" className="input-field"/></div>
                <div><label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1">Idade</label><input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Ex: 30" className="input-field"/></div>
                
                <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#161616] border-[#333]'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#555]'}`}>{data.medical && <Check size={14} className="text-white"/>}</div>
                    <div><p className={`text-sm font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Maior de idade e saudável</p></div>
                </div>

                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => advanceStage(1, refs.services)} className="primary-btn w-full py-4 flex items-center justify-center gap-2 animate-scale">Iniciar Agendamento <ArrowRight size={20}/></button>
                )}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-10 transition-all duration-500 ${stage === 1 ? 'section-active' : stage > 1 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 1) { setStage(1); scrollToSection(refs.services); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">01.</span> Experiência</h3>
            <div className="space-y-5">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 1) { setData({...data, service: s}); advanceStage(2, refs.datetime); }}} className={`card-base p-6 cursor-pointer relative ${data.service?.id === s.id ? 'card-selected' : ''}`}>
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-black px-3 py-1 rounded-bl-xl">{s.badge}</div>}
                        <div className="flex justify-between items-start mb-3">
                            <div><h3 className={`text-xl font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3><p className="text-[10px] font-bold text-gray-500 uppercase mt-1">+ {s.xp} XP</p></div>
                            <span className="text-white font-bold bg-[#222] border border-[#333] px-3 py-1 rounded-lg text-sm">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-[11px] font-bold text-[#0A84FF] uppercase tracking-wide border border-[#0A84FF]/30 inline-block px-2 py-1 rounded mb-3">{s.short}</p>
                        <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`mt-10 transition-all duration-500 ${stage === 2 ? 'section-active' : stage > 2 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 2) { setStage(2); scrollToSection(refs.datetime); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">02.</span> Data e Hora</h3>
            <div className="card-base p-6">
                <div className="flex gap-2 overflow-x-auto pb-4 ios-scroll snap-x">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} className={`snap-center min-w-[65px] h-[75px] rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`grid grid-cols-4 gap-2 mt-4 ${data.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => (
                        <button key={t} disabled={Utils.isTimeBlocked(data.date, t)} onClick={() => { setData({...data, time: t}); advanceStage(3, refs.extras); }} className={`py-2.5 rounded-lg text-xs font-bold border ${data.time === t ? 'bg-white text-black scale-105' : Utils.isTimeBlocked(data.date, t) ? 'opacity-30 line-through' : 'bg-[#161616] border-[#333] text-gray-300'}`}>{t}</button>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={`mt-10 transition-all duration-500 ${stage === 3 ? 'section-active' : stage > 3 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 3) { setStage(3); scrollToSection(refs.extras); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">03.</span> Turbine o Relaxamento</h3>
            <div className="card-base divide-y divide-[#222]">
                {[
                   { id: 'upgrade', label: '+30 Minutos', sub: 'Estenda o tempo', icon: Clock, price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT, badge: '+30 XP' },
                   { id: 'touch', label: 'Interação / Toque', sub: 'Toques recíprocos', icon: Flame, price: CONFIG.PRICES.TOUCH, badge: '+25 XP' },
                   { id: 'aroma', label: 'Aromaterapia', sub: 'Óleos especiais', icon: Wind, price: CONFIG.PRICES.AROMA, badge: '+15 XP' }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-5 flex justify-between items-center cursor-pointer active:bg-[#1a1a1a]">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${data.extras[item.id] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333]'}`}>{data.extras[item.id] ? <Check size={18} className="text-white"/> : <item.icon size={18} className="text-gray-500"/>}</div>
                            <div><div className="flex items-center gap-2"><p className="font-bold text-white text-sm">{item.label}</p><span className="text-[9px] bg-[#222] text-gray-400 px-1.5 py-0.5 rounded border border-[#333] font-bold">{item.badge}</span></div><p className="text-[11px] text-gray-500 mt-0.5">{item.sub}</p></div>
                        </div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.formatBRL(item.price)}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => advanceStage(4, refs.location)} className={`w-full mt-4 py-4 rounded-2xl text-sm font-bold border transition-all ${Object.values(data.extras).some(Boolean) ? 'bg-[#0A84FF] text-white' : 'bg-[#1C1C1E] text-gray-400 border-[#333]'}`}>{Object.values(data.extras).some(Boolean) ? 'Confirmar Extras' : 'Pular Extras'}</button>
        </section>

        {/* 5. LOCALIZAÇÃO (SP & INTERIOR LOGIC) */}
        <section ref={refs.location} className={`mt-10 transition-all duration-500 ${stage === 4 ? 'section-active' : stage > 4 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 4) { setStage(4); scrollToSection(refs.location); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">04.</span> Localização</h3>
            
            <div className="mb-5">
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Bairro / Região</label>
                <div className="flex gap-2 overflow-x-auto pb-2 ios-scroll">
                    {CURRENT_LOCATIONS.map(c => (
                        <button key={c.id} onClick={() => setData({...data, location: {...data.location, city: c}})} 
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold border transition-all ${data.location.city.id === c.id ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                            {c.name} {c.fee > 0 && `(+${Utils.formatBRL(c.fee)})`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-5">
                {LOCATION_TYPES.map(t => (
                    <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${data.location.type === t.id ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#161616] border-[#333] text-gray-500'}`}>
                        <t.icon size={20} className="mb-1"/>
                        <span className="text-[10px] font-bold uppercase">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="card-base p-5 animate-enter border-[#333]">
                {data.location.type === 'home' && (
                    <div className="space-y-3">
                        <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                        <input placeholder="Bairro" value={data.location.district} onChange={e => setData({...data, location: {...data.location, district: e.target.value}})} className="input-field"/>
                        <input placeholder="Ponto de Referência (Opcional)" value={data.location.reference} onChange={e => setData({...data, location: {...data.location, reference: e.target.value}})} className="input-field"/>
                    </div>
                )}
                {data.location.type === 'apto' && (
                    <div className="space-y-3">
                        <input placeholder="Nome do Edifício / Condomínio" value={data.location.building} onChange={e => setData({...data, location: {...data.location, building: e.target.value}})} className="input-field"/>
                        <div className="flex gap-3"><input placeholder="Bloco" value={data.location.block} onChange={e => setData({...data, location: {...data.location, block: e.target.value}})} className="input-field w-1/2"/><input placeholder="Apto" type="tel" value={data.location.aptNumber} onChange={e => setData({...data, location: {...data.location, aptNumber: e.target.value}})} className="input-field w-1/2"/></div>
                        <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                        <input placeholder="Bairro" value={data.location.district} onChange={e => setData({...data, location: {...data.location, district: e.target.value}})} className="input-field"/>
                        <input placeholder="Interfone / Portaria" value={data.location.intercom} onChange={e => setData({...data, location: {...data.location, intercom: e.target.value}})} className="input-field"/>
                    </div>
                )}
                {data.location.type === 'hotel' && (
                    <div className="space-y-3">
                        <input placeholder="Nome do Hotel" value={data.location.hotelName} onChange={e => setData({...data, location: {...data.location, hotelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Número do Quarto" type="tel" value={data.location.roomNumber} onChange={e => setData({...data, location: {...data.location, roomNumber: e.target.value}})} className="input-field"/>
                        <p className="text-[10px] text-gray-500 flex items-center gap-2 p-2 bg-yellow-500/10 rounded-lg"><AlertTriangle size={12} className="text-yellow-500"/> Deixe minha subida autorizada na recepção.</p>
                    </div>
                )}
                {data.location.type === 'motel' && (
                    <div className="space-y-3">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl flex gap-3 items-start">
                             <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5"/>
                             <p className="text-xs text-yellow-500/90 leading-relaxed">A conta da suíte/período é paga por você diretamente ao Motel na saída.</p>
                        </div>
                        <input placeholder="Nome do Motel" value={data.location.motelName} onChange={e => setData({...data, location: {...data.location, motelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Tipo de Suíte (Ex: Hidro)" value={data.location.suiteType} onChange={e => setData({...data, location: {...data.location, suiteType: e.target.value}})} className="input-field"/>
                    </div>
                )}
                
                <button disabled={!isAddressValid()} onClick={() => advanceStage(5, refs.payment)} 
                    className="primary-btn w-full py-4 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">Confirmar Local</button>
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`mt-10 transition-all duration-500 ${stage === 5 ? 'section-active' : 'hidden opacity-0'}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">05.</span> Pagamento</h3>
            <div className="card-base p-4 grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(6, null); if(method==='pix') navigator.clipboard.writeText(CONFIG.PIX_KEY); }} 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${data.payment === method ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'border-[#333] hover:bg-[#222]'}`}>
                        {method==='pix' && <QrCode size={24} className="text-[#0A84FF]"/>}
                        {method==='dinheiro' && <Banknote size={24} className="text-[#32D74B]"/>}
                        {method==='cartao' && <CreditCard size={24} className="text-[#FFD60A]"/>}
                        <span className="text-[10px] font-bold uppercase">{method}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* CHECKOUT STICKY */}
      {stage >= 6 && !success && (
        <div className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="h-12 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            <div className="bg-[#111]/95 backdrop-blur-xl border-t border-white/10 p-5 rounded-t-[30px] shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Total (Serviço + Taxas)</p>
                        <div className="flex items-baseline gap-2">
                            {hasCoupon && <span className="text-xs text-gray-500 line-through">{Utils.formatBRL(financials.sub)}</span>}
                            <span className="text-3xl font-black text-white">{Utils.formatBRL(financials.total)}</span>
                        </div>
                        {financials.travelFee > 0 && <p className="text-[9px] text-[#0A84FF] mt-1 flex items-center gap-1"><Car size={10}/> Taxa {data.location.city.zone} inclusa</p>}
                    </div>
                    {!hasCoupon ? (
                        isVip ? (
                            <button onClick={() => { setHasCoupon(true); Utils.vibrate([50,50]); }} className="h-9 px-3 rounded-full bg-[#FFD60A] text-black font-bold text-xs animate-bounce shadow-[0_0_15px_rgba(255,214,10,0.4)] flex items-center gap-1"><Ticket size={12}/> RESGATAR</button>
                        ) : (
                            <div className="text-right">
                                <div className="text-[9px] text-gray-500 mb-1">Falta {CONFIG.XP_THRESHOLDS.VIP - xp} XP p/ Cupom</div>
                                <div className="w-20 h-1.5 bg-[#333] rounded-full overflow-hidden ml-auto"><div className="h-full bg-gray-500" style={{width: `${(xp/CONFIG.XP_THRESHOLDS.VIP)*100}%`}}></div></div>
                            </div>
                        )
                    ) : <div className="text-[10px] text-[#32D74B] font-bold border border-[#32D74B] px-2 py-1 rounded bg-[#32D74B]/10">VIP ATIVO</div>}
                </div>
                <button onClick={() => { setSuccess(true); window.scrollTo(0,0); }} className="primary-btn w-full h-14 text-lg flex items-center justify-center gap-3">Finalizar Pedido <MessageCircle size={22}/></button>
            </div>
        </div>
      )}
    </div>
  );
}
