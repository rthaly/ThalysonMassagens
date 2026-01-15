import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, ChevronRight, Menu, X, 
  HelpCircle, Instagram, Calendar as CalendarIcon, Clock, User, AlertTriangle, Car, Copy, Info, Sparkles, Navigation, Zap, Battery
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO & DADOS (COMPLETOS E RESTAURADOS)
// ==================================================================================

const APP_VERSION = 'THALY_MAX_PRO_V2026'; // Chave mestra para evitar crash

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
  
  // Gamificação: Níveis mais difíceis para valorizar
  XP_THRESHOLDS: { MEMBER: 100, VIP: 250, ALPHA: 500 },
  
  URLS: { WHATSAPP: "https://api.whatsapp.com/send" }
};

// --- LOCAIS (TAXAS DE UBER IDA+VOLTA INCLUSAS) ---
const LOCATIONS = [
  { id: 'bela_vista', name: 'Bela Vista', fee: 0, zone: 'Base', time: '5 min' },
  { id: 'augusta', name: 'Rua Augusta / Centro', fee: 18.00, zone: 'Centro', time: '10 min' },
  { id: 'paulista', name: 'Paulista / Jardins', fee: 22.00, zone: 'Nobre', time: '15 min' },
  { id: 'higienopolis', name: 'Higienópolis / Sta Cecília', fee: 25.00, zone: 'Centro', time: '20 min' },
  { id: 'liberdade', name: 'Liberdade / Aclimação', fee: 28.00, zone: 'Centro', time: '20 min' },
  { id: 'pinheiros', name: 'Pinheiros / V. Madalena', fee: 32.00, zone: 'Oeste', time: '30 min' },
  { id: 'itaim', name: 'Itaim Bibi / V. Olímpia', fee: 38.00, zone: 'Sul', time: '35 min' },
  { id: 'moema', name: 'Moema / Ibirapuera', fee: 42.00, zone: 'Sul', time: '40 min' },
  { id: 'mariana', name: 'Vila Mariana / Paraíso', fee: 30.00, zone: 'Sul', time: '25 min' },
  { id: 'perdizes', name: 'Perdizes / Barra Funda', fee: 28.00, zone: 'Oeste', time: '25 min' },
  { id: 'brooklin', name: 'Brooklin / Campo Belo', fee: 45.00, zone: 'Sul', time: '45 min' },
  { id: 'tatuape', name: 'Tatuapé / Mooca', fee: 55.00, zone: 'Leste', time: '50 min' },
  { id: 'morumbi', name: 'Morumbi', fee: 65.00, zone: 'Sul', time: '60 min' },
  { id: 'santana', name: 'Santana / ZN', fee: 50.00, zone: 'Norte', time: '45 min' },
  { id: 'outra', name: 'Outro Bairro (Consultar)', fee: 0, zone: '?', time: '--' },
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    desc: 'Massagista de Cueca. O protocolo premium. Inicia de bruços soltando a musculatura, vira de frente com cremes e óleos de alta qualidade, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    xp: 100
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    desc: 'Foco 100% terapêutico e relaxante. Ideal para remover dores lombares, pernas cansadas. Toques firmes e técnicos para tirar o stress, sem toques íntimos.', 
    duration: 60, 
    price: 125, 
    badge: 'TERAPÊUTICA 🌿',
    xp: 50
  },
];

const EXTRAS_OPTS = [
  { id: 'upgrade', label: '+30 Minutos', desc: 'Mais tempo para curtir cada detalhe.', icon: Clock, getPrice: (base) => base * CONFIG.PRICES.UPGRADE_PCT, xp: 30 },
  { id: 'touch', label: 'Interação / Toque', desc: 'Você no controle. Toques recíprocos.', icon: Flame, getPrice: () => CONFIG.PRICES.TOUCH, xp: 40 },
  { id: 'aroma', label: 'Aromaterapia', desc: 'Óleos essenciais que acalmam a mente.', icon: Wind, getPrice: () => CONFIG.PRICES.AROMA, xp: 15 }
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

const LEVELS = [
  { name: 'Visitante', min: 0, color: 'text-gray-400', bg: 'bg-gray-700' },
  { name: 'Membro', min: 100, color: 'text-blue-400', bg: 'bg-blue-600' },
  { name: 'VIP', min: 250, color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]' }, 
  { name: 'ALPHA', min: 500, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]' }
];

// --- BANCO DE DADOS DE REVIEWS (COMPLETO) ---
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
  { t: "Gostei bastante da massagem do Thalyson, me senti bem relaxado depois, saí mais leve.", a: "Alan SP", s: 5 },
  { t: "O corpo a corpo é quente de verdade. Uma experiência única.", a: "J.P.", s: 5 },
  { t: "Gostei que ele respeita os limites, mas entrega muito prazer.", a: "André", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto. Salvou minha viagem.", a: "Turista RJ", s: 5 },
  { t: "Cara bonito, limpo e com pegada. O pacote completo.", a: "Anônimo", s: 5 },
  { t: "Thalyson, quero dizer que sua massagem foi muito bem executada.", a: "Bruno", s: 5 },
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

// --- NOTIFICAÇÕES GATILHO (COMPLETAS) ---
const LIVE_NOTIFICATIONS = [
  "🔥 João acabou de agendar", "👀 6 pessoas visualizando agora", "📅 Sexta-feira quase cheia",
  "⭐ Pedro avaliou com 5 estrelas", "✅ Matheus confirmou presença", "💎 Murilo usou o Cupom VIP",
  "🏠 Atendimento em Hotel iniciado", "🚀 Bruno fechou o pacote completo", "😈 Felipe adicionou interação",
  "🍃 Gustavo pediu Aromaterapia", "💳 Pagamento via Pix recebido", "🏳️‍🌈 Cliente novo cadastrado",
  "🚗 Thalyson a caminho do Itaim", "⏱️ Sessão estendida agendada", "✨ Avaliação 5 estrelas recebida",
  "📍 Atendimento na Bela Vista", "🎁 Cupom de 1ª Vez resgatado", "🔒 Dados seguros e criptografados",
  "👋 Marcos mandou um 'Oi'", "💼 Executivo agendou horário", "🛑 Agenda de Sábado Lotada",
  "🛁 Banho tomado, pronto p/ atender", "💬 Lucas tirou uma dúvida", "🌚 Atendimento Noturno Iniciado",
  "⚡ Ricardo agendou de última hora", "🏩 Chegando no Motel agora", "📝 Cadastro aprovado",
  "🍷 Cliente VIP pediu vinho", "🗝️ Check-in no Hotel realizado", "🏃‍♂️ Voltando da Academia",
  "🌧️ Dia chuvoso, perfeito p/ massagem", "🕶️ Modo Sigilo Ativado", "💎 Cliente tornou-se Alpha"
];

const LOCATION_TYPES = [
  { id: 'home', label: 'Casa', icon: Home },
  { id: 'apto', label: 'Apto', icon: Building },
  { id: 'hotel', label: 'Hotel', icon: Bed },
  { id: 'motel', label: 'Motel', icon: Flame },
];

// ==================================================================================
// 2. ESTILOS GLOBAIS (PERFORMANCE GPU & DESIGN SYSTEM)
// ==================================================================================

const globalStyles = `
:root { 
  --primary: #0A84FF; 
  --bg-app: #050505; 
  --card-bg: #121212; 
  --border: #27272a;
  --success: #32D74B;
  --gold: #FFD60A;
}

* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif; }
html { background: var(--bg-app); height: 100%; scroll-behavior: smooth; }
body { min-height: 100%; background: var(--bg-app); color: #fff; overflow-x: hidden; padding-bottom: 120px; }
input, select, button { outline: none; }

/* Otimização de Scroll */
.hide-scroll::-webkit-scrollbar { display: none; }
.hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

/* Animações GPU */
@keyframes slideUp { from { opacity: 0; transform: translate3d(0, 20px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
@keyframes scaleIn { from { transform: scale3d(0.95, 0.95, 1); opacity: 0; } to { transform: scale3d(1, 1, 1); opacity: 1; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }

.anim-enter { animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.anim-pop { animation: scaleIn 0.3s cubic-bezier(0.17, 0.67, 0.23, 1.4) forwards; }
.btn-pulse { animation: pulse 2s infinite; }
.anim-float { animation: float 3s ease-in-out infinite; }

.logo-shimmer {
  background: linear-gradient(90deg, #fff 0%, #0A84FF 50%, #fff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s infinite linear;
}

/* Componentes */
.glass-nav { 
  background: rgba(5, 5, 5, 0.95); 
  backdrop-filter: blur(20px); 
  border-bottom: 1px solid rgba(255,255,255,0.08); 
  z-index: 50; 
}

.card-base { 
  background: var(--card-bg); 
  border: 1px solid var(--border); 
  border-radius: 24px; 
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1); 
}
.card-active { 
  border-color: var(--primary); 
  background: linear-gradient(145deg, rgba(10,132,255,0.1) 0%, rgba(18,18,18,0) 100%); 
  box-shadow: 0 8px 30px rgba(10, 132, 255, 0.15); 
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
  border-radius: 18px; 
  font-weight: 700; 
  border: none; 
  box-shadow: 0 8px 25px rgba(10, 132, 255, 0.3); 
  transition: transform 0.1s;
}
.btn-primary:active { transform: scale(0.97); }
.btn-disabled { opacity: 0.5; pointer-events: none; filter: grayscale(1); }

.section-disabled { opacity: 0.4; pointer-events: none; filter: grayscale(1); transition: opacity 0.5s; }
`;

// ==================================================================================
// 3. UTILITÁRIOS (ROBUSTOS)
// ==================================================================================

const Utils = {
  fmt: (v) => v ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00',
  vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12); },
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
  
  isBlocked: (d, t) => {
    if (!d) return true;
    const now = new Date();
    const sel = new Date(d); sel.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    
    // Bloqueia passado
    if (sel < today) return true;
    // Libera futuro
    if (sel > today) return false;
    
    // Se for hoje, bloqueia horários passados + 1h
    const [h] = t.split(':').map(Number);
    const slot = new Date(); slot.setHours(h, 0, 0, 0);
    return slot < new Date(now.getTime() + 60 * 60000); 
  }
};

// ==================================================================================
// 4. COMPONENTES VISUAIS (WIDGETS)
// ==================================================================================

const Header = ({ onReload, onHelp }) => (
  <header className="fixed top-0 w-full glass-nav py-3 px-5 flex justify-between items-center transition-all">
    <div className="flex items-center gap-2" onClick={onReload}>
       <div className="w-9 h-9 bg-[#0A84FF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><span className="font-black text-white text-sm">T.</span></div>
       <span className="font-bold text-xl tracking-tight logo-shimmer">THALY.</span>
    </div>
    <div className="flex gap-3">
        <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2.5 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-95 transition-transform"><Instagram size={20} className="text-white"/></a>
        <button onClick={onHelp} className="p-2.5 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-95 transition-transform"><HelpCircle size={20} className="text-white"/></button>
    </div>
  </header>
);

const LiveStatus = () => {
    const [msg, setMsg] = useState(null);
    useEffect(() => {
        const msgs = Utils.shuffle([...LIVE_NOTIFICATIONS]);
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
            <div className="bg-[#1C1C1E]/95 border border-[#333] px-4 py-2.5 rounded-full flex items-center gap-2.5 shadow-xl backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse shrink-0"/>
                <span className="text-xs font-bold text-gray-200 truncate">{msg}</span>
            </div>
        </div>
    );
};

const ReviewsCarousel = () => {
    const [idx, setIdx] = useState(0);
    const list = useMemo(() => Utils.shuffle([...REVIEWS_DB]), []);
    useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%list.length), 6000); return () => clearInterval(t); }, [list]);

    return (
        <div className="bg-[#121212] border border-[#27272a] rounded-3xl p-6 mb-8 shadow-lg flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
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
                    className={`snap-center flex-shrink-0 w-36 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${selected?.id === loc.id ? 'border-[#0A84FF] bg-[#0A84FF]/10' : 'border-[#27272a] bg-[#121212]'}`}>
                    <p className="text-[9px] uppercase font-bold text-gray-500 mb-1">{loc.zone}</p>
                    <p className="text-sm font-bold text-white mb-2 leading-tight h-8 flex items-center">{loc.name}</p>
                    <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                        <span className="text-[9px] text-gray-400">Ida+Volta</span>
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
       // CHAVE NOVA: Reseta dados antigos que causavam tela branca
       const s = localStorage.getItem(APP_VERSION);
       if(s) { 
           const p = JSON.parse(s); 
           if(p.date) p.date = new Date(p.date);
           // Validação de integridade
           if(!p.location || !p.location.type) throw new Error("Reset"); 
           return p; 
       }
     } catch(e) { localStorage.removeItem(APP_VERSION); }
     
     // Estado Limpo Padrão
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

  // Histórico para saber se é 1ª vez
  const isFirstTime = !localStorage.getItem('THALY_CLIENT_HISTORY_V10');

  const refs = { 
      services: useRef(null), datetime: useRef(null), 
      extras: useRef(null), location: useRef(null), payment: useRef(null) 
  };

  useEffect(() => { localStorage.setItem(APP_VERSION, JSON.stringify(data)); }, [data]);
  
  useEffect(() => { 
      setTimeout(() => setLoading(false), 500);
      if(isFirstTime && !couponActive && stage === 0) {
          const t = setTimeout(() => setShowPopup(true), 1500);
          return () => clearTimeout(t);
      }
  }, [isFirstTime, couponActive, stage]);

  // CÁLCULO FINANCEIRO (COM PROTEÇÃO CONTRA CRASH)
  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    // Proteção contra nulos (?. || 0)
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
      // Grava que o cliente já fez pedido (queima o cupom de 1a vez)
      if(couponActive || isFirstTime) localStorage.setItem('THALY_CLIENT_HISTORY_V10', 'true');
      setSuccess(true);
      window.scrollTo(0,0);
  };

  // WHATSAPP "NOTA FISCAL" DETALHADA
  const generateMessage = () => {
    const d = data.date;
    const loc = data.location;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    
    let t = `🦁 *AGENDAMENTO CONFIRMADO*\n──────────────────\n`;
    t += `👤 *${data.name}* (${data.age} anos)\n`;
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

  if (loading) return <div className="fixed inset-0 bg-[#050505] z-50 flex items-center justify-center text-white font-bold tracking-widest text-xs uppercase animate-pulse">Carregando...</div>;

  if (success) return (
    <div className="min-h-screen bg-[#050505] pt-20 px-6 flex flex-col items-center text-center anim-enter pb-20">
       <style>{globalStyles}</style>
       <div className="w-20 h-20 bg-[#32D74B]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.2)]">
         <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-black text-white mb-2">Pedido Pronto!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs">Agora é só enviar a confirmação abaixo para meu WhatsApp.</p>

       <div className="w-full max-w-sm bg-[#121212] border border-[#333] rounded-3xl p-6 mb-8 text-left shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A84FF] to-[#32D74B]"></div>
           <div className="flex justify-between items-end mb-6 border-b border-[#333] pb-6">
               <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Final</p><p className="text-[#32D74B] font-black text-3xl">{Utils.fmt(financials.total)}</p></div>
               <div className="text-right"><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Taxa Inclusa</p><p className="text-white font-bold">{Utils.fmt(financials.travelFee)}</p></div>
           </div>
           <div className="space-y-3 text-sm text-gray-300">
               <p className="flex items-center gap-3"><MapPin size={16} className="text-[#0A84FF]"/> {financials.locName}</p>
               <p className="flex items-center gap-3"><CalendarIcon size={16} className="text-[#0A84FF]"/> {data.date?.toLocaleDateString()} às {data.time}</p>
           </div>
           {data.payment === 'pix' && <div className="mt-6 p-4 bg-[#1C1C1E] rounded-xl border border-[#333]"><p className="text-[10px] text-[#0A84FF] font-bold uppercase mb-1">Chave Pix</p><p className="text-xs font-mono text-white select-all">{CONFIG.PIX_KEY}</p></div>}
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" className="w-full max-w-sm btn-primary py-4 text-lg flex items-center justify-center gap-2 mb-4">Enviar no WhatsApp <MessageCircle size={22}/></a>
       <button onClick={() => { setSuccess(false); setStage(0); setCouponActive(false); window.scrollTo(0,0); }} className="text-gray-500 font-bold text-xs uppercase py-4">Fazer Novo Pedido</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-40 relative">
      <style>{globalStyles}</style>
      <LiveStatus />
      <Header onReload={()=>window.location.reload()} onHelp={()=>setHelpOpen(true)} />

      {/* POPUP CUPOM (Apenas se for novo cliente e não tiver aceito ainda) */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 anim-enter">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowPopup(false)}/>
            <div className="relative bg-[#18181b] w-full max-w-sm rounded-3xl border border-[#0A84FF]/50 p-6 shadow-2xl text-center">
                <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-full flex items-center justify-center mx-auto mb-4 anim-float">
                    <Ticket size={32} className="text-[#0A84FF]"/>
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Ganhou R$ {CONFIG.FIRST_COUPON_VAL}!</h2>
                <p className="text-gray-400 text-sm mb-6">Presente de boas-vindas para sua primeira sessão.</p>
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
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                    <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444]'}`}>{data.medical && <Check size={14} className="text-white"/>}</div>
                    <p className="text-sm font-bold text-white">Sou maior de idade e saudável</p>
                </div>
                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => advanceStage(1, refs.services)} className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-2 anim-enter">Começar Agendamento <ArrowRight size={20}/></button>
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
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} className={`snap-center min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#1C1C1E] border-[#3f3f46] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`grid grid-cols-4 gap-3 mt-2 ${data.date ? '' : 'opacity-30 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => (
                        <button key={t} disabled={Utils.isBlocked(data.date, t)} onClick={() => { setData({...data, time: t}); advanceStage(3, refs.extras); }} className={`py-3 rounded-xl text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black' : Utils.isBlocked(data.date, t) ? 'opacity-20 line-through border-transparent' : 'bg-[#1C1C1E] border-[#3f3f46] text-gray-300'}`}>{t}</button>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={`mt-12 transition-opacity duration-500 ${stage >= 3 ? 'opacity-100' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">03.</span> Adicionais</h3>
            <div className="card-base divide-y divide-[#27272a]">
                {EXTRAS_OPTS.map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#1C1C1E] transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${data.extras?.[item.id] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#3f3f46]'}`}>{data.extras?.[item.id] ? <Check size={16} className="text-white"/> : <item.icon size={16} className="text-gray-500"/>}</div>
                            <div><p className="font-bold text-white text-base">{item.label}</p><p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p></div>
                        </div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.fmt(item.getPrice(data.service?.price || 0))}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => advanceStage(4, refs.location)} className="w-full mt-5 py-4 rounded-xl text-sm font-bold bg-[#1C1C1E] text-gray-300 border border-[#3f3f46]">Continuar</button>
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
