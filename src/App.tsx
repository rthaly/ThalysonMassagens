import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, ChevronRight, Menu, X, 
  HelpCircle, Instagram, Calendar as CalendarIcon, Clock, User, AlertTriangle, Car, Copy, Info, Sparkles, Activity
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE VIAGEM & NEGÓCIO
// ==================================================================================

const CONFIG = {
  // --- SELETOR DE REGIÃO (MUDE AQUI) ---
  // 'SP'  = São Paulo Capital
  // 'LDR' = Londrina (PR)
  // 'INT' = Interior (Santa Fé/Região)
  CURRENT_REGION: 'LDR', 

  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  
  FIRST_COUPON_VAL: 15.00, 
  
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 73, 
    AROMA: 5,
  },
  
  // GAMIFICAÇÃO (HARD MODE - Mais difícil upar)
  XP_THRESHOLDS: { MEMBER: 100, VIP: 300, ALPHA: 600 },
  
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

// --- BANCO DE DADOS DE LOCAIS (MULTI-CIDADE) ---
const LOCATIONS_DB = {
  SP: [
    { id: 'bela_vista', name: 'Bela Vista / Centro', fee: 10, zone: 'Base' },
    { id: 'paulista', name: 'Paulista / Jardins', fee: 15, zone: 'Nobre' },
    { id: 'pinheiros', name: 'Pinheiros / V. Madalena', fee: 25, zone: 'Oeste' },
    { id: 'itaim', name: 'Itaim / V. Olímpia', fee: 30, zone: 'Sul' },
    { id: 'moema', name: 'Moema / Ibirapuera', fee: 35, zone: 'Sul' },
    { id: 'outra', name: 'Outro Bairro (Consultar)', fee: 0, zone: 'Sob Consulta' }
  ],
  LDR: [
    { id: 'centro_ldr', name: 'Centro Londrina', fee: 10, zone: 'Central' },
    { id: 'gleba', name: 'Gleba Palhano', fee: 15, zone: 'Nobre' },
    { id: 'aeroporto', name: 'Aeroporto / Z. Leste', fee: 20, zone: 'Leste' },
    { id: 'catuai', name: 'Shopping Catuaí / Z. Sul', fee: 20, zone: 'Sul' },
    { id: 'zs_outros', name: 'Zona Sul (Outros)', fee: 25, zone: 'Sul' },
    { id: 'zn_ldr', name: 'Zona Norte', fee: 30, zone: 'Norte' },
    { id: 'cambe', name: 'Cambé / Ibiporã', fee: 40, zone: 'Região' }
  ],
  INT: [
    { id: 'santafe', name: 'Santa Fé do Sul', fee: 0, zone: 'Base' },
    { id: 'tresfron', name: 'Três Fronteiras', fee: 20, zone: 'Vizinha' },
    { id: 'rubineia', name: 'Rubinéia', fee: 25, zone: 'Vizinha' },
    { id: 'jales', name: 'Jales', fee: 60, zone: 'Viagem' },
    { id: 'aparecida', name: 'Ap. do Taboado (MS)', fee: 70, zone: 'Viagem' }
  ]
};

const CURRENT_LOCATIONS = LOCATIONS_DB[CONFIG.CURRENT_REGION];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'Massagista de Cueca. O protocolo premium. Inicia de bruços soltando a musculatura, vira de frente com creme e óleo, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    xp: 50 // XP Base
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico e relaxante. Ideal para remover dores lombares, pernas cansadas. Toques suaves para relaxar e tirar o stress, sem toques íntimos.', 
    duration: 60, 
    price: 125, 
    badge: null,
    xp: 25 // Menos XP
  },
];

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const LOCATION_TYPES = [
  { id: 'home', label: 'Casa', icon: Home },
  { id: 'apto', label: 'Apto', icon: Building },
  { id: 'hotel', label: 'Hotel', icon: Bed },
  { id: 'motel', label: 'Motel', icon: Flame },
];

const LEVELS = [
  { name: 'Visitante', min: 0, color: 'text-gray-500', bg: 'bg-gray-800' },
  { name: 'Membro', min: 100, color: 'text-blue-400', bg: 'bg-blue-600' },
  { name: 'VIP', min: 300, color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]' }, 
  { name: 'ALPHA', min: 600, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]' }
];

// --- GATILHOS MENTAIS (LIVE STATUS) ---
const LIVE_NOTIFICATIONS = [
  "🔥 Último horário de Domingo preenchido", 
  "👀 6 pessoas visualizando a agenda agora",
  "📅 Agenda da noite quase lotada",
  "⭐ Pedro avaliou: 'Melhor da cidade'",
  "✅ Matheus confirmou presença",
  "💎 Murilo atingiu nível VIP",
  "🏠 Atendimento em Hotel iniciado",
  "🚀 Bruno fechou o pacote completo + extras",
  "😈 Felipe adicionou interação extra",
  "🍃 Gustavo pediu Aromaterapia",
  "💳 Pagamento via Pix recebido",
  "🏳️‍🌈 Cliente novo cadastrado com sucesso",
  "🚗 Thalyson está a caminho",
  "⚡ Ricardo agendou de última hora",
  "🔒 Dados criptografados e seguros",
  "💼 Executivo agendou horário de almoço",
  "🛑 Sábado restam apenas 2 vagas",
  "✨ 'Mão firme e pegada forte' - Review Recente",
  "📍 Atendimento realizado na Gleba Palhano",
  "🛁 Banho tomado, pronto para atender"
];

// --- AVALIAÇÕES COMPLETAS (50+) ---
const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", a: "Tiago", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda, jorrei longe.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório.", a: "Empresário", s: 5 },
  { t: "Precisava desse escape. O stress sumiu na hora. Discrição nota 10.", a: "M. (Casado)", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Ele de cueca branca... sem comentários. Visual nota 1000.", a: "Fã", s: 5 },
  { t: "Profissionalismo raro hoje em dia. Pontual e educado.", a: "Carlos A.", s: 5 },
  { t: "A mistura de força e suavidade é incrível. Recomendo.", a: "Lucas", s: 5 },
  { t: "Primeira vez que faço e me senti super à vontade. Thalyson é gente boa.", a: "Novato", s: 5 },
  { t: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Gostei bastante da massagem do Thalyson, me senti bem relaxado depois.", a: "Alan", s: 5 },
  { t: "O corpo a corpo é quente de verdade. Uma experiência única.", a: "J.P.", s: 5 },
  { t: "Gostei que ele respeita os limites, mas entrega muito prazer.", a: "André", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto. Salvou minha viagem.", a: "Turista", s: 5 },
  { t: "Cara bonito, limpo e com pegada. O pacote completo.", a: "Anônimo", s: 5 },
  { t: "Thalyson, quero dizer que sua massagem foi muito bem executada.", a: "Bruno", s: 5 },
  { t: "A técnica dele é diferente de tudo. Vale cada real.", a: "Dr. Marcelo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Me senti renovado. Energia lá em cima depois da sessão.", a: "Vitor", s: 5 },
  { t: "Extremamente educado e com papo bom, além da massagem top.", a: "Renan", s: 5 },
  { t: "O lubrificante é um detalhe que faz toda diferença.", a: "Paulo", s: 5 },
  { t: "Já fiz com vários massagistas, o Thalyson é o melhor da região.", a: "Cliente Antigo", s: 5 },
  { t: "Não economizem, peçam a completa com aromaterapia.", a: "Dica do Beto", s: 5 },
  { t: "Pontualidade britânica. Chegou na hora marcada.", a: "Advogado", s: 5 },
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
// 2. ESTILOS (PERFORMANCE & SCROLL)
// ==================================================================================

const globalStyles = `
:root { --primary: #0A84FF; --bg-app: #050507; --card-bg: #141416; --border: #222; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif; }
html { height: 100%; background: var(--bg-app); overflow-y: scroll; }
body { min-height: 100%; background: var(--bg-app); color: #fff; overflow-x: hidden; position: relative; padding-bottom: 20px; }
input, select, button { outline: none; }
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(40px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes bubble { 0% { transform: translateY(10px); opacity: 0; } 10% { transform: translateY(0); opacity: 1; } 90% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-10px); opacity: 0; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.animate-enter { animation: fadeInUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.animate-bubble { animation: bubble 6s ease-in-out forwards; }

.navbar { transition: all 0.4s ease; background: transparent; border-bottom: 1px solid transparent; z-index: 50; }
.navbar.glass { background: rgba(5, 5, 7, 0.85); border-bottom: 1px solid rgba(255,255,255,0.08); }

.logo-shimmer {
  background: linear-gradient(90deg, #fff 0%, #0A84FF 50%, #fff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s infinite linear;
}

.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; transition: all 0.2s ease; }
.card-selected { border-color: var(--primary); background: linear-gradient(145deg, rgba(10,132,255,0.08) 0%, rgba(20,20,22,0) 100%); box-shadow: 0 4px 30px rgba(10, 132, 255, 0.1); }

.input-field { background: #1C1C1E; border: 1px solid #333; color: white; border-radius: 14px; width: 100%; font-size: 16px; padding: 16px; appearance: none; transition: all 0.3s; }
.input-field:focus { border-color: var(--primary); background: #262626; box-shadow: 0 0 0 2px rgba(10,132,255,0.2); }

.primary-btn { background: linear-gradient(135deg, #0A84FF 0%, #0066CC 100%); color: white; border-radius: 18px; font-weight: 800; border: none; box-shadow: 0 10px 30px rgba(10, 132, 255, 0.3); }
.primary-btn:active { transform: scale(0.97); }

.section-disabled { opacity: 0.3; pointer-events: none; filter: grayscale(1); transition: all 0.5s; }
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
    const [h, m] = t.split(':').map(Number);
    const slot = new Date(); slot.setHours(h, m||0, 0, 0);
    return slot < new Date(now.getTime() + 30 * 60000);
  }
};

// ==================================================================================
// 4. COMPONENTES VISUAIS
// ==================================================================================

const LiveBubbles = () => {
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

    if (!msg) return null;
    return (
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-30 w-max max-w-[95%] pointer-events-none">
        <div className="bg-[#1C1C1E]/95 border border-[#333] px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl animate-bubble">
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
        <div className="bg-[#141416] border border-[#222] rounded-3xl p-6 mb-8 shadow-lg flex flex-col justify-between min-h-[150px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#0A84FF]/10 to-transparent rounded-bl-full"></div>
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
            <div className="flex gap-3 overflow-x-auto pb-6 ios-scroll snap-x px-1">
                {CURRENT_LOCATIONS.map(loc => (
                    <div key={loc.id} onClick={() => onSelect(loc)}
                        className={`snap-center flex-shrink-0 w-40 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selected?.id === loc.id ? 'border-[#0A84FF] bg-[#0A84FF]/10' : 'border-[#222] bg-[#141416]'}`}>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">{loc.zone}</p>
                        <p className="text-sm font-bold text-white mb-2 leading-tight h-10">{loc.name}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                            <span className="text-[10px] text-gray-400">Taxa</span>
                            <span className={`text-xs font-bold ${selected?.id === loc.id ? 'text-[#0A84FF]' : 'text-white'}`}>{loc.fee === 0 ? 'Grátis' : Utils.formatBRL(loc.fee)}</span>
                        </div>
                        {selected?.id === loc.id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0A84FF] shadow-[0_0_10px_#0A84FF]"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  const [data, setData] = useState(() => {
     try {
       const s = localStorage.getItem('thaly_travel_v1'); 
       if(s) { 
           const p = JSON.parse(s); 
           if(p.date) p.date = new Date(p.date);
           if(!p.location || !p.location.neighborhood) throw new Error("Reset");
           return p; 
       }
     } catch(e) { localStorage.removeItem('thaly_travel_v1'); }
     
     return { 
         name: '', age: '', medical: false, 
         service: null, date: null, time: null, 
         extras: { upgrade: false, touch: false, aroma: false }, 
         payment: null,
         location: {
             neighborhood: null, 
             type: 'home', 
             street: '', number: '', buildingNum: '', aptNumber: '', 
             hotelName: '', roomNumber: '', motelName: '', suiteType: '' 
         }
     };
  });

  const [stage, setStage] = useState(0); 
  const [couponActive, setCouponActive] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const hasOrderedBefore = !!localStorage.getItem('thaly_client_history_travel');
  const refs = { services: useRef(null), datetime: useRef(null), extras: useRef(null), location: useRef(null), payment: useRef(null) };

  useEffect(() => { localStorage.setItem('thaly_travel_v1', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);
  
  useEffect(() => {
      const onScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    const base = data.service?.price || 0;
    if (data.service) xpPoints += data.service.xp;

    const upg = data.extras?.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    if (data.extras?.upgrade) xpPoints += 15;

    const touch = data.extras?.touch ? CONFIG.PRICES.TOUCH : 0;
    if (data.extras?.touch) xpPoints += 20;

    const aroma = data.extras?.aroma ? CONFIG.PRICES.AROMA : 0;
    if (data.extras?.aroma) xpPoints += 10;

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
      if(couponActive || !hasOrderedBefore) localStorage.setItem('thaly_client_history_travel', 'true');
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
    if(loc.type === 'home') t += `🏠 Casa: ${loc.street}, ${loc.number}\n`;
    else if (loc.type === 'apto') t += `🏢 Apto: ${loc.street}, ${loc.buildingNum} - Unid ${loc.aptNumber}\n`;
    else if (loc.type === 'hotel') t += `🏨 Hotel: ${loc.hotelName} (Qto ${loc.roomNumber})\n`;
    else if (loc.type === 'motel') { t += `🏩 Motel: ${loc.motelName} (Suíte ${loc.suiteType || '?'})\n`; t += `⚠️ *Eu pago a suíte*\n`; }

    t += `\n💰 *TOTAL: ${Utils.formatBRL(financials.total)}*\n`;
    if(financials.travelFee > 0) t += `🚗 Taxa Ida+Volta: ${Utils.formatBRL(financials.travelFee)}\n`;
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

  if (loading) return <div className="fixed inset-0 bg-[#050507] z-50 flex items-center justify-center text-white font-bold tracking-widest text-xs uppercase animate-pulse">Carregando...</div>;

  if (success) return (
    <div className="min-h-screen bg-[#050507] pt-20 px-6 flex flex-col items-center text-center animate-enter pb-20">
       <style>{globalStyles}</style>
       <div className="w-24 h-24 bg-[#32D74B]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.2)]">
         <Check className="w-12 h-12 text-[#32D74B]" strokeWidth={4} />
       </div>
       <h2 className="text-4xl font-black text-white mb-2 tracking-tight">Pedido Pronto!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs leading-relaxed">Agora é só enviar a confirmação gerada para o meu WhatsApp.</p>

       <div className="w-full max-w-sm bg-[#141416] border border-[#222] rounded-3xl overflow-hidden shadow-2xl relative mb-8">
           <div className="h-1 bg-gradient-to-r from-[#0A84FF] via-[#32D74B] to-[#0A84FF]"></div>
           <div className="p-6">
              <div className="flex justify-between items-start mb-6 border-b border-[#222] pb-6">
                 <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Total Final</p>
                    <p className="text-[#32D74B] font-black text-3xl">{Utils.formatBRL(financials.total)}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-wider">Taxa</p>
                    <p className="text-white font-bold">{Utils.formatBRL(financials.travelFee)}</p>
                 </div>
              </div>
              <div className="text-left space-y-3 text-sm text-gray-300">
                  <p className="flex items-center gap-3"><MapPin size={16} className="text-[#0A84FF]"/> {data.location?.neighborhood?.name}</p>
                  <p className="flex items-center gap-3"><CalendarIcon size={16} className="text-[#0A84FF]"/> {data.date?.toLocaleDateString()} às {data.time}</p>
                  <p className="flex items-center gap-3"><User size={16} className="text-[#0A84FF]"/> {data.name}</p>
              </div>
              {data.payment === 'pix' && (
                  <div onClick={() => {navigator.clipboard.writeText(CONFIG.PIX_KEY); Utils.vibrate()}} className="mt-6 p-4 bg-[#0A84FF]/10 rounded-xl border border-[#0A84FF]/20 flex items-center justify-between cursor-pointer active:scale-[0.98]">
                      <div><p className="text-[10px] text-[#0A84FF] font-bold uppercase mb-1">Toque para Copiar Chave Pix</p><p className="text-xs font-mono text-white tracking-wide">{CONFIG.PIX_KEY}</p></div>
                      <Copy size={18} className="text-[#0A84FF]"/>
                  </div>
              )}
           </div>
           <div className="absolute top-[100px] left-[-10px] w-5 h-5 rounded-full bg-[#050507]"></div>
           <div className="absolute top-[100px] right-[-10px] w-5 h-5 rounded-full bg-[#050507]"></div>
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" className="w-full max-w-sm primary-btn py-4 text-lg flex items-center justify-center gap-3 mb-4 shadow-lg shadow-[#32D74B]/20">Enviar no WhatsApp <MessageCircle size={22}/></a>
       <button onClick={() => { setSuccess(false); setStage(0); setCouponActive(false); window.scrollTo(0,0); }} className="text-gray-600 font-bold text-xs uppercase py-4 hover:text-white transition-colors">Fazer Novo Pedido</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-48 relative selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>
      <LiveBubbles />
      
      {/* NAVBAR GLASSMORPHISM */}
      <header className={`fixed top-0 w-full py-4 px-6 flex justify-between items-center z-50 navbar ${scrolled ? 'glass' : ''}`}>
        <div className="flex items-center gap-2" onClick={() => window.location.reload()}>
            <span className="font-black text-xl tracking-tight logo-shimmer">Thaly Massagens</span>
        </div>
        <div className="flex items-center gap-3">
            <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2.5 bg-[#141416] rounded-full border border-[#333] active:scale-90 transition-transform"><Instagram size={20} className="text-white"/></a>
            <button onClick={()=>setHelpOpen(true)} className="p-2.5 bg-[#141416] rounded-full border border-[#333] active:scale-90 transition-transform"><HelpCircle size={20} className="text-white"/></button>
        </div>
      </header>

      {/* AJUDA COMPLETA */}
      {helpOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-enter">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#141416] w-full max-w-sm rounded-3xl border border-[#222] p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
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

      <main className="max-w-md mx-auto pt-32 px-5">
        
        {/* 1. INTRODUÇÃO */}
        <section className={`transition-all duration-500 ${stage === 0 ? 'opacity-100' : 'section-disabled'}`}>
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold mb-3 leading-[1.1] tracking-tight">Massagem &<br/><span className="text-gradient">Momentos Únicos.</span></h1>
                <p className="text-gray-400 text-[15px] leading-relaxed">Massoterapia masculina no conforto do seu local. Técnica apurada e experiência premium.</p>
            </div>

            <ReviewsTicker />

            <div className="card-base p-6 space-y-5 shadow-2xl border-[#222]">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Seus Dados</label>
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
                    <button onClick={() => advanceStage(1, refs.services)} className="primary-btn w-full py-4 flex items-center justify-center gap-2 mt-2 animate-enter">Começar Agendamento <ArrowRight size={20}/></button>
                )}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-12 transition-opacity duration-500 ${stage >= 1 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">01.</span> Experiência</h3>
            <div className="space-y-5">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 1) { setData({...data, service: s}); advanceStage(2, refs.datetime); }}} className={`card-base p-6 cursor-pointer relative group ${data.service?.id === s.id ? 'card-selected' : ''}`}>
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-3 py-1.5 rounded-bl-2xl shadow-lg z-10">{s.badge}</div>}
                        <div className="flex justify-between items-start mb-3 relative z-10">
                            <div><h3 className={`text-xl font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3></div>
                            <span className="text-white font-bold bg-[#222] border border-[#333] px-3 py-1 rounded-lg text-sm">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-[11px] font-bold text-[#0A84FF] uppercase tracking-wide border border-[#0A84FF]/30 inline-block px-2 py-1 rounded mb-3">{s.short}</p>
                        <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`mt-12 transition-opacity duration-500 ${stage >= 2 ? 'opacity-100' : 'hidden'}`}>
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
        <section ref={refs.extras} className={`mt-12 transition-opacity duration-500 ${stage >= 3 ? 'opacity-100' : 'hidden'}`}>
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

        {/* 5. LOCALIZAÇÃO (SELETOR VISUAL INOVADOR) */}
        <section ref={refs.location} className={`mt-12 transition-opacity duration-500 ${stage >= 4 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">04.</span> Localização</h3>
            
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-3 ml-1">Selecione o Bairro (Taxa Uber Ida+Volta)</p>
            <LocationSelector selected={data.location.neighborhood} onSelect={(loc) => setData({...data, location: {...data.location, neighborhood: loc}})} />

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
