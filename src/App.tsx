import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Home, MessageCircle, 
  Ticket, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, X, HelpCircle, Instagram, 
  Calendar as CalendarIcon, Clock, User, AlertTriangle, 
  Car, Copy, Info, Zap, ChevronDown, Share2, Music, Coffee,
  Lock, RefreshCw, Eye, ThumbsUp
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO
// ==================================================================================

const CONFIG = {
  APP_VERSION: '9.0.0-FIXED',
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
  
  XP_THRESHOLDS: { VIP: 100, ALPHA: 150 },
  URLS: { WHATSAPP_API: "https://api.whatsapp.com/send" }
};

// LOCAIS
const LOCATIONS_DB = [
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
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'Protocolo Premium. Inicia de bruços soltando a musculatura, vira de frente com creme e óleo, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    xp: 60,
    highlight: true // Borda dourada
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
  { q: "Como é a Massagem Completa?", a: "A sessão começa de bruços com manobras de relaxamento profundo. Depois, de frente, utilizo óleos para um contato corpo a corpo mais sensitivo, finalizando com alívio manual total." },
  { q: "Como é a Massagem Relaxante?", a: "Focada exclusivamente em dores musculares, nós de tensão e circulação. Não há toques nas partes íntimas. É puramente terapêutica para o corpo." },
  { q: "Pagamento do Transporte", a: "O valor do deslocamento (Uber) pode ser pago antecipadamente para garantir a reserva. O valor da massagem você paga apenas ao final da sessão." },
  { q: "Você leva maca?", a: "Não. O atendimento é realizado no conforto da sua cama ou sofá. Levo óleos, toalhas, música e aromaterapia para ambientar o local." }
];

// AVALIAÇÕES REAIS E COMPLETAS
const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida. Me senti muito conectado.", a: "Tiago (Bela Vista)", s: 5 },
  { t: "Gostei bastante, me senti bem relaxado depois, saí mais leve. O papo fluiu bem e a técnica é ótima.", a: "Alan", s: 5 },
  { t: "Melhor investimento da semana. Relaxamento total. O toque dele é firme na medida certa.", a: "Bruno", s: 5 },
  { t: "Fui pra relaxar e saí renovado. A massagem tântrica é real, desbloqueou sensações que eu nem conhecia.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz diferença. Recomendo pra quem treina pesado.", a: "Curioso SP", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório com total discrição.", a: "Empresário", s: 5 },
  { t: "Profissionalismo raro. Pontual, limpo e educado. A experiência completa vale cada centavo.", a: "Carlos A.", s: 5 },
  { t: "O final foi explosivo. Recomendo a todos que querem sair da rotina.", a: "Anônimo", s: 5 },
];

const LIVE_NOTIFICATIONS = [
  "✨ João acabou de agendar", "👀 4 pessoas vendo a agenda", "📅 Sexta-feira com poucos horários",
  "⭐ Pedro avaliou com 5 estrelas", "✅ Matheus confirmou presença", "💎 Murilo virou VIP",
  "🌊 Ricardo ativou o modo relax", "💬 Lucas enviou uma dúvida", "🏠 Atendimento em domicílio iniciado",
  "🚀 Bruno fechou o pacote completo", "💆‍♂️ Felipe adicionou interação", "🏨 Atendimento em Hotel iniciado",
  "🍃 Gustavo pediu Aromaterapia", "💳 Pagamento via Pix recebido", "🏳️‍🌈 Cliente novo cadastrado",
  "🕶️ Modo Sigilo Ativado", "🚗 Thalyson está a caminho", "⏱️ Sessão estendida agendada",
  "🧖‍♂️ Rafael finalizou a sessão", "✨ Avaliação 5 estrelas recebida", "🔥 Agenda de Sábado abriu",
  "🎁 Cupom VIP foi resgatado", "🔒 Dados criptografados", "👋 Marcos mandou um 'Oi'",
  "💼 Executivo agendou horário", "✈️ Turista do RJ agendou", "🛌 Suíte de Motel reservada"
];

// ==================================================================================
// UTILS & STYLES
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
:root { --primary: #0A84FF; --bg-app: #050505; --card-bg: #141414; --border: #222; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "Roboto", sans-serif; }
body { background: var(--bg-app); color: #fff; padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden; scroll-behavior: smooth; }
input, select, button { outline: none; }

/* SCROLL CORRIGIDO E SUAVE */
.ios-scroll { 
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding: 0 4px 16px 4px;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
}
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll > * { 
    flex-shrink: 0; 
    scroll-snap-align: center;
}

.glass-header { background: rgba(5, 5, 5, 0.95); border-bottom: 1px solid #222; }
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; position: relative; overflow: hidden; }
.card-selected { border-color: var(--primary); background: #0A1E33; }
.input-field { background: #1C1C1E; border: 1px solid #333; color: white; border-radius: 12px; width: 100%; font-size: 16px; padding: 14px; }
.input-field:focus { border-color: var(--primary); background: #262626; }
.primary-btn { background: var(--primary); color: white; border-radius: 16px; font-weight: 800; border: none; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-enter { animation: fadeIn 0.4s ease-out forwards; }
.btn-pulse { animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }
`;

// ==================================================================================
// COMPONENTES
// ==================================================================================

const Toast = ({ msg, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90%]">
            <div className="bg-[#222] border border-white/10 px-4 py-3 rounded-full flex items-center gap-3 shadow-xl animate-enter">
                <Check size={16} className="text-[#32D74B]"/>
                <p className="text-sm font-bold text-white">{msg}</p>
            </div>
        </div>
    );
};

const StatusBar = () => {
  return (
    <div className="w-full bg-[#111] border-b border-[#222] py-2 px-5 flex justify-between items-center text-[10px] uppercase font-bold text-gray-400">
       <div className="flex items-center gap-2 text-green-500">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
         Disponível Agora
       </div>
       <div className="flex items-center gap-1">
         <Eye size={12} /> Agenda Aberta
       </div>
    </div>
  );
};

// LIVE BUBBLES AJUSTADO (Mais lento e fluido)
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
                // Fica visível por 5 segundos
                setTimeout(() => setMsg(null), 5000); 
            }
        };
        // Novo ciclo a cada 12 segundos (Mais calmo)
        const interval = setInterval(cycle, 12000); 
        cycle(); 
        return () => clearInterval(interval);
    }, [queue]);

    if (!msg) return null;
    return (
      <div className="fixed top-28 left-1/2 -translate-x-1/2 z-30 w-max max-w-[90%] pointer-events-none">
        <div className="bg-[#1C1C1E]/95 backdrop-blur-md border border-white/10 pl-3 pr-4 py-2 rounded-full flex items-center gap-3 shadow-2xl animate-enter">
           <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              <span className="text-xs">🔔</span>
           </div>
           <div>
               <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Agora</p>
               <p className="text-xs font-medium text-white">{msg}</p>
           </div>
        </div>
      </div>
    );
};

const ReviewsList = () => {
    return (
        <div className="mb-6">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 px-1 flex items-center gap-1"><Star size={10}/> O que dizem...</h4>
            <div className="ios-scroll">
                {REVIEWS_DB.map((r, i) => (
                    <div key={i} className="min-w-[280px] max-w-[280px] bg-[#161616] border border-[#222] p-4 rounded-xl flex flex-col justify-between hover:border-gray-600 transition-colors">
                        <div className="flex text-[#FFD60A] mb-2 gap-0.5"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                        <p className="text-xs text-gray-300 leading-relaxed mb-3">"{r.t}"</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1"><Shield size={10} className="text-green-500"/> {r.a}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

const FAQSection = () => {
    const [open, setOpen] = useState(null);
    return (
        <div className="mt-8 mb-4">
            <h4 className="text-xs font-bold text-gray-500 mb-3 px-1 uppercase flex items-center gap-2"><HelpCircle size={12}/> Dúvidas & Detalhes</h4>
            <div className="card-base divide-y divide-[#222]">
                {FAQS.map((f, i) => (
                    <div key={i} className="p-4 cursor-pointer hover:bg-[#1a1a1a]" onClick={() => setOpen(open === i ? null : i)}>
                        <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium text-white">{f.q}</h5>
                            <ChevronDown size={16} className={`text-gray-500 transition-transform ${open === i ? 'rotate-180' : ''}`}/>
                        </div>
                        {open === i && <p className="text-xs text-gray-400 mt-3 leading-relaxed border-t border-[#333] pt-3">{f.a}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==================================================================================
// APP PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  const [data, setData] = useState(() => {
     try {
       const s = localStorage.getItem('thaly_v9_fixed');
       if(s) { 
           const p = JSON.parse(s); 
           if(p.date) p.date = new Date(p.date);
           return p; 
       }
     } catch(e) { console.error("Resetting data", e); }
     
     // Estado Seguro
     return { 
         name: '', age: '', medical: false, 
         mood: null, service: null, date: null, time: null, 
         extras: { upgrade: false, touch: false, aroma: false }, 
         prefs: { music: 'Zen / Spa' },
         payment: null,
         couponRescued: false,
         location: { city: LOCATIONS_DB[0], type: 'home', street: '', number: '', district: '', reference: '', building: '', block: '', aptNumber: '', intercom: '', hotelName: '', roomNumber: '', motelName: '', suiteType: '' }
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

  useEffect(() => { localStorage.setItem('thaly_v9_fixed', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 1200); }, []);
  
  useEffect(() => { if(data.couponRescued) setHasCoupon(true); }, [data.couponRescued]);

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
            const yOffset = -100; 
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

  const showToast = (msg) => setToast({msg});

  // MENSAGEM WHATSAPP
  const generateMessage = () => {
    const d = data.date;
    const loc = data.location;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    
    let t = `🌿 *AGENDAMENTO CONFIRMADO*\n`;
    t += `------------------------------\n`;
    t += `👤 *${data.name.toUpperCase()}* (${data.age})\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name.toUpperCase()}*\n`;
    
    if(Object.values(data.extras).some(Boolean)) {
        t += `✨ *EXTRAS:* `;
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

    t += `\n💰 *RESUMO FINANCEIRO:*\n`;
    t += `------------------------------\n`;
    t += `🔹 *Serviço:* ${Utils.formatBRL(financials.serviceTotal)} (Pagar ao final)\n`;
    
    if(financials.transportTotal > 0) {
         t += `🚗 *Uber/Deslocamento:* ${Utils.formatBRL(financials.transportTotal)} (Pode adiantar)\n`;
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
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center">
      <style>{globalStyles}</style>
      <div className="relative">
          <div className="w-20 h-20 bg-[#111] border-2 border-[#222] rounded-2xl flex items-center justify-center animate-pulse">
              <span className="text-3xl">🌿</span>
          </div>
      </div>
      <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-4 font-bold">Carregando...</p>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 animate-enter text-center">
       <style>{globalStyles}</style>
       <div className="w-24 h-24 bg-[#32D74B] text-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(50,215,75,0.4)] animate-enter">
         <Check size={40} strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-black text-white mb-2">TUDO CERTO!</h2>
       <p className="text-gray-400 mb-8 text-sm">Pedido gerado. Envie para o WhatsApp para confirmar.</p>

       <div className="w-full max-w-sm bg-[#111] border border-[#222] rounded-3xl overflow-hidden shadow-2xl relative mb-6">
           <div className="p-6">
              <div className="flex justify-between items-baseline mb-4 border-b border-[#222] pb-4">
                 <span className="text-xs font-bold text-gray-500 uppercase">Total Final</span>
                 <span className="text-[#32D74B] font-black text-3xl">{Utils.formatBRL(financials.total)}</span>
              </div>
              <div className="text-left space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-400 border-b border-[#222] pb-2">
                      <span>Serviço (Pagar depois)</span>
                      <span className="text-white font-bold">{Utils.formatBRL(financials.serviceTotal)}</span>
                  </div>
                  {financials.transportTotal > 0 && (
                      <div className="flex justify-between text-sm text-[#0A84FF]">
                          <span>Uber/Deslocamento (Pagar antes)</span>
                          <span className="font-bold">{Utils.formatBRL(financials.transportTotal)}</span>
                      </div>
                  )}
              </div>
              
              {data.payment === 'pix' && (
                  <div onClick={() => {navigator.clipboard.writeText(CONFIG.PIX_KEY); Utils.vibrate(); showToast('Chave Pix copiada!')}} className="p-3 bg-[#1A1A1A] rounded-xl border border-dashed border-[#444] flex items-center justify-between cursor-pointer active:bg-[#222]">
                      <div className="text-left overflow-hidden">
                          <p className="text-[10px] text-[#0A84FF] uppercase font-bold mb-1">Pix (Toque para copiar)</p>
                          <p className="text-xs font-mono text-gray-400 truncate w-48">{CONFIG.PIX_KEY}</p>
                      </div>
                      <Copy size={16} className="text-white"/>
                  </div>
              )}
           </div>
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm primary-btn py-4 text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#32D74B]/20 btn-pulse">
         <MessageCircle size={22} fill="currentColor" /> Enviar no WhatsApp
       </a>
       
       <button onClick={() => { setData(prev => ({...prev, service: null})); setSuccess(false); setStage(0); window.scrollTo(0,0); }} className="mt-6 flex items-center gap-2 text-gray-600 font-bold text-xs uppercase hover:text-white">
           <RefreshCw size={12}/> Fazer Novo Pedido
       </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-40 relative bg-[#050505]">
      <style>{globalStyles}</style>
      <LiveBubbles />
      {toast && <Toast msg={toast.msg} onClose={() => setToast(null)} />}
      
      {/* HEADER SIMPLIFICADO */}
      <header className="fixed top-0 w-full z-40 glass-header">
        <div className="px-5 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2" onClick={() => window.location.reload()}>
                <div className="w-8 h-8 bg-[#0A84FF] rounded-lg flex items-center justify-center font-black text-white text-sm shadow-lg">T.</div>
                <span className="font-bold text-lg text-white">THALY.</span>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => {if(navigator.share) navigator.share({url: window.location.href});}} className="text-gray-400 hover:text-white"><Share2 size={20}/></button>
                <button onClick={()=>setHelpOpen(true)} className="text-gray-400 hover:text-white"><HelpCircle size={20}/></button>
            </div>
        </div>
        <StatusBar />
        <div className="w-full h-[2px] bg-[#111]">
            <div className="h-full bg-[#0A84FF] transition-all duration-300" style={{width: `${(stage / 6) * 100}%`}}></div>
        </div>
      </header>

      {/* MODAL AJUDA */}
      {helpOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-enter">
              <div className="absolute inset-0 bg-black/90" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#1C1C1E] w-full max-w-sm rounded-3xl border border-[#333] p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl text-white">Ajuda & Dúvidas</h3>
                      <button onClick={()=>setHelpOpen(false)}><X size={20} className="text-white"/></button>
                  </div>
                  
                  <div className="space-y-4">
                      {FAQS.map((f, i) => (
                          <div key={i} className="bg-[#111] p-4 rounded-xl border border-[#222]">
                              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><Info size={14} className="text-[#0A84FF]"/> {f.q}</h4>
                              <p className="text-xs text-gray-400 leading-relaxed">{f.a}</p>
                          </div>
                      ))}
                  </div>
                  <button onClick={()=>setHelpOpen(false)} className="w-full mt-6 bg-[#0A84FF] text-white py-3 rounded-xl font-bold">Fechar</button>
              </div>
          </div>
      )}

      <main className="max-w-md mx-auto pt-28 px-5">
        
        {/* INTRODUÇÃO */}
        <section ref={refs.intro} className={`${stage === 0 ? 'block animate-enter' : 'hidden'}`}>
            <div className="my-6">
                <p className="text-[#0A84FF] font-bold text-[10px] uppercase tracking-widest mb-1">{Utils.getGreeting()}</p>
                <h1 className="text-3xl font-bold text-white leading-tight">Agende seu<br/>Relaxamento.</h1>
            </div>

            <ReviewsList />

            <div className="card-base p-6 border-[#222] bg-[#111] mb-8">
                 <div className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1">Seu Nome</label>
                        <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Como prefere ser chamado?" className="input-field"/>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1">Idade</label>
                        <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Ex: 30" className="input-field"/>
                    </div>
                    <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#0A0A0A] border-[#222]'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444]'}`}>{data.medical && <Check size={14} className="text-white"/>}</div>
                        <p className="text-xs text-gray-400">Maior de idade e saudável</p>
                    </div>
                </div>
                {data.name.length > 2 && data.age && data.medical && (
                    <button onClick={() => advanceStage(1, refs.mood)} className="primary-btn w-full py-4 mt-4 flex items-center justify-center gap-2">
                        Começar <ArrowRight size={18}/>
                    </button>
                )}
            </div>
            <FAQSection />
        </section>

        {/* 1. VIBE */}
        <section ref={refs.mood} className={`${stage === 1 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">01. Qual sua Vibe?</h3>
            <div className="grid grid-cols-3 gap-3">
                {MOODS.map(m => (
                    <button key={m.id} onClick={() => { setData({...data, mood: m}); advanceStage(2, refs.services); }}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${data.mood?.id === m.id ? 'border-white bg-[#222]' : 'bg-[#111] border-[#222]'}`}>
                        <m.icon size={24} className={`mb-2 ${m.color}`}/>
                        <span className="text-xs font-bold text-white">{m.label}</span>
                    </button>
                ))}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`${stage === 2 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">02. Escolha o Serviço</h3>
            <div className="space-y-4">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { setData({...data, service: s}); advanceStage(3, refs.datetime); }} 
                        className={`card-base p-5 cursor-pointer border transition-all ${s.highlight ? 'border-[#FFD60A]/50 bg-[#1A1A1A]' : 'border-[#222]'} ${data.service?.id === s.id ? 'card-selected' : ''}`}>
                        
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-3 py-1 rounded-bl-xl">{s.badge}</div>}
                        
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-lg font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3>
                            <span className="text-white font-bold bg-[#222] px-3 py-1 rounded-lg text-sm">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`${stage === 3 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">03. Data e Hora</h3>
            <div className="card-base p-4 bg-[#111]">
                <div className="ios-scroll pb-2">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} 
                                className={`min-w-[70px] h-[80px] rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#161616] border-[#222] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`grid grid-cols-4 gap-2 mt-4 ${data.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => {
                        const blocked = Utils.isTimeBlocked(data.date, t);
                        return (
                        <button key={t} disabled={blocked} onClick={() => { setData({...data, time: t}); advanceStage(4, refs.extras); }} 
                            className={`py-3 rounded-lg text-xs font-bold border ${data.time === t ? 'bg-white text-black' : blocked ? 'opacity-20 line-through' : 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-300'}`}>
                            {t}
                        </button>
                    )})}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={`${stage === 4 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">04. Personalize</h3>
            <div className="card-base divide-y divide-[#222] mb-4">
                {[
                   { id: 'upgrade', label: '+30 Minutos', icon: Clock, price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT },
                   { id: 'touch', label: 'Interação', icon: Flame, price: CONFIG.PRICES.TOUCH },
                   { id: 'aroma', label: 'Aromaterapia', icon: Wind, price: CONFIG.PRICES.AROMA }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-4 flex justify-between items-center cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${data.extras[item.id] ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'border-[#333] bg-[#0F0F0F] text-gray-500'}`}>
                                {data.extras[item.id] ? <Check size={18}/> : <item.icon size={18}/>}
                            </div>
                            <span className="font-bold text-white text-sm">{item.label}</span>
                        </div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.formatBRL(item.price)}</span>
                    </div>
                ))}
            </div>

            <div className="card-base p-4 border-[#222] bg-[#111]">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Music size={12}/> Som Ambiente</h4>
                <div className="ios-scroll pb-1">
                     {PREFERENCES.music.map(m => (
                         <button key={m} onClick={() => setData({...data, prefs: {...data.prefs, music: m}})} 
                             className={`px-4 py-2 rounded-lg text-[11px] font-bold border whitespace-nowrap ${data.prefs.music === m ? 'bg-[#FFD60A] border-[#FFD60A] text-black' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                             {m}
                         </button>
                     ))}
                </div>
            </div>

            <button onClick={() => advanceStage(5, refs.location)} className="primary-btn w-full py-4 mt-4">Continuar</button>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section ref={refs.location} className={`${stage === 5 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">05. Localização</h3>
            <div className="mb-4">
                <div className="ios-scroll pb-2">
                    {LOCATIONS_DB.map(c => (
                        <button key={c.id} onClick={() => setData({...data, location: {...data.location, city: c}})} 
                            className={`px-4 py-3 rounded-xl text-xs font-bold border whitespace-nowrap ${data.location.city.id === c.id ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                            {c.name} {c.fee > 0 && `(+${Utils.formatBRL(c.fee)})`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
                {LOCATION_TYPES.map(t => (
                    <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border ${data.location.type === t.id ? 'bg-[#0A84FF]/10 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#121212] border-[#222] text-gray-500'}`}>
                        <t.icon size={20} className="mb-1.5"/>
                        <span className="text-[9px] font-bold uppercase">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="card-base p-4 bg-[#111] border-[#222]">
                {data.location.type === 'home' && (
                    <div className="space-y-3">
                        <div className="flex gap-2"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                        <input placeholder="Bairro" value={data.location.district} onChange={e => setData({...data, location: {...data.location, district: e.target.value}})} className="input-field"/>
                        <input placeholder="Referência" value={data.location.reference} onChange={e => setData({...data, location: {...data.location, reference: e.target.value}})} className="input-field"/>
                    </div>
                )}
                {['apto', 'hotel', 'motel'].includes(data.location.type) && (
                     <div className="space-y-3">
                        <input placeholder={data.location.type === 'apto' ? 'Edifício' : 'Nome do Local'} className="input-field" onChange={e => setData({...data, location: {...data.location, building: e.target.value, hotelName: e.target.value, motelName: e.target.value}})}/>
                        <div className="flex gap-2"><input placeholder={data.location.type === 'apto' ? 'Apto' : 'Quarto/Suíte'} className="input-field" onChange={e => setData({...data, location: {...data.location, aptNumber: e.target.value, roomNumber: e.target.value, suiteType: e.target.value}})} /></div>
                     </div>
                )}
                
                <button disabled={!isAddressValid()} onClick={() => advanceStage(6, refs.payment)} className="primary-btn w-full py-4 mt-4 disabled:opacity-50">Confirmar Local</button>
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`${stage === 6 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">06. Pagamento</h3>
            <div className="card-base p-4 grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(7, null); if(method==='pix') {navigator.clipboard.writeText(CONFIG.PIX_KEY); showToast('Pix Copiado!');} }} 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${data.payment === method ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'border-[#333] bg-[#121212]'}`}>
                        <span className="text-[10px] font-bold uppercase text-white">{method}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* CHECKOUT BAR */}
      {stage >= 7 && !success && (
        <div className="fixed bottom-0 w-full z-50 animate-enter bg-[#111] border-t border-[#333] p-5 pb-8 rounded-t-3xl shadow-2xl">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Estimado</p>
                    <div className="flex items-baseline gap-2">
                        {hasCoupon && <span className="text-xs text-gray-500 line-through">{Utils.formatBRL(financials.sub)}</span>}
                        <span className="text-3xl font-black text-white">{Utils.formatBRL(financials.total)}</span>
                    </div>
                </div>
                {!hasCoupon ? (
                    isVip && !data.couponRescued ? (
                        <button onClick={() => { setHasCoupon(true); setData({...data, couponRescued: true}); Utils.vibrate(); showToast('Desconto Aplicado!'); }} className="h-10 px-4 rounded-full bg-[#FFD60A] text-black font-bold text-xs animate-bounce flex items-center gap-2"><Ticket size={14}/> USAR CUPOM</button>
                    ) : (
                        <div className="text-right">
                             <div className="text-[9px] text-gray-500 mb-1">Falta {CONFIG.XP_THRESHOLDS.VIP - xp} XP</div>
                             <div className="w-20 h-1.5 bg-[#333] rounded-full overflow-hidden"><div className="h-full bg-gray-600" style={{width: `${(xp/CONFIG.XP_THRESHOLDS.VIP)*100}%`}}></div></div>
                        </div>
                    )
                ) : <div className="text-[10px] text-[#32D74B] font-bold border border-[#32D74B] px-3 py-1 rounded bg-[#32D74B]/10">CUPOM ATIVO</div>}
            </div>
            <button onClick={() => { setSuccess(true); window.scrollTo(0,0); }} className="primary-btn w-full h-14 text-lg flex items-center justify-center gap-2">
                Finalizar Pedido <MessageCircle size={20}/>
            </button>
        </div>
      )}
    </div>
  );
}
