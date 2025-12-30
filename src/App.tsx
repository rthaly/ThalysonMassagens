import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Shield, Star, Instagram, Bell, Tag, ArrowRight, Lock, Eye, EyeOff, 
  LogOut, Zap, Crown, Trash2, CreditCard, Banknote, QrCode, 
  CheckCircle2, Siren, Send, Menu, Sparkles, Navigation
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS (DESIGN SENIOR: "MIDNIGHT LUXURY")
// ==================================================================================

const globalStyles = `
/* --- RESET & BASE --- */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.02em;
  color: #fff;
  background: #000;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Hide */
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Inputs & Form Elements */
input, select { user-select: text; font-size: 17px; outline: none; appearance: none; }
button { touch-action: manipulation; user-select: none; -webkit-touch-callout: none; cursor: pointer; }

/* --- BACKGROUNDS PREMIUM --- */
.midnight-bg {
  background: 
    radial-gradient(circle at 50% 0%, #15151a 0%, #000000 70%),
    radial-gradient(circle at 85% 30%, rgba(192, 160, 98, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 15% 70%, rgba(10, 132, 255, 0.03) 0%, transparent 40%);
  background-attachment: fixed;
  background-size: cover;
  min-height: 100vh;
}

/* --- GLASSMORPHISM --- */
.glass-panel { 
  background: rgba(28, 28, 30, 0.65); 
  backdrop-filter: blur(25px) saturate(180%); 
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}
.glass-panel:active { transform: scale(0.99); }
.glass-panel.selected {
  background: rgba(10, 132, 255, 0.15);
  border-color: #0A84FF;
  box-shadow: 0 0 25px rgba(10, 132, 255, 0.15);
}

/* --- BOTÕES --- */
.btn-primary {
  background: linear-gradient(135deg, #0A84FF 0%, #0062cc 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.4);
  border: none;
  position: relative;
  overflow: hidden;
}
.btn-primary::after {
  content: ''; position: absolute; top:0; left:0; width:100%; height:100%;
  background: linear-gradient(rgba(255,255,255,0.2), transparent);
  opacity: 0; transition: opacity 0.2s;
}
.btn-primary:active { transform: scale(0.98); }
.btn-primary:active::after { opacity: 1; }
.btn-primary:disabled { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }

/* --- ANIMATIONS --- */
.animate-enter { animation: enterUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
.animate-pulse-slow { animation: pulse 3s infinite; }
.animate-spin-slow { animation: spin 1.5s linear infinite; }

@keyframes enterUp {
  from { opacity: 0; transform: translateY(30px) scale(0.98); } 
  to { opacity: 1; transform: translateY(0) scale(1); } 
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

.shimmer-text {
  background: linear-gradient(90deg, rgba(255,255,255,0.4), #fff, rgba(255,255,255,0.4));
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: shine 3s linear infinite;
}
@keyframes shine { to { background-position: 200% center; } }
`;

// ==================================================================================
// 2. CENTRAL DE DADOS (SEUS DADOS ORIGINAIS)
// ==================================================================================

const CONFIG = {
  PRICES: {
    MACA: 20,            
    AROMA_FULL: 10,      
    AROMA_DISCOUNT: 5,  
    UPGRADE_PCT: 0.5    
  },
  CONTACT: {
    PHONE: "5517991360413",
    PIX_KEY: "62922530000144"
  }
};

// 💆‍♂️ SEUS SERVIÇOS ORIGINAIS (SEM NURU)
const services = [
  { 
    id: 'masculina', name: 'Massagem Masculina', type: 'sensual',
    description: 'Massagem Relaxante + Toques corpo a corpo (de cueca) com finalização Lingam manual completa.', 
    labelDuration: '60 min', minutes: 60, 
    basePrice: 140, 
    highlight: "MAIS PEDIDA 🔥", ratings: 5.0, reviews: 310, 
    details: ["Relaxante + Body-to-Body", "Massagista de Cueca", "Lingam / Finalização Manual", "Alívio Completo"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    description: 'Corpo inteiro: Costas, braços, mãos, pernas, coxas, pés, peito e frente. (Sem toques íntimos).', 
    labelDuration: '60 min', minutes: 60, 
    basePrice: 90, 
    ratings: 4.9, reviews: 142, 
    details: ["Corpo Inteiro", "Sem Glúteos/Íntimo", "Toque Terapêutico", "Relaxamento Puro"] 
  },
];

// 📍 SEUS LOCAIS ORIGINAIS
const locations = [
  { 
    id: 'motel', 
    label: 'Suíte Privada (Motel)', 
    sublabel: 'Vou com você', 
    fee: 75,
    allowsTableChoice: false, 
    isMotel: true,
    icon: <Lock className="w-5 h-5 text-[#FFD60A]" />
  },
  { 
    id: 'santa-fe', 
    label: 'Santa Fé do Sul', 
    sublabel: 'No conforto do seu lar', 
    fee: 40,
    allowsTableChoice: true, 
    isUber: true,
    icon: <MapPin className="w-5 h-5 text-[#0A84FF]" />
  },
  { 
    id: 'outras-cidades', 
    label: 'Cidades Vizinhas', 
    sublabel: 'Atendimento na região', 
    fee: 0,
    allowsTableChoice: false, 
    input: true,
    isPending: true,
    icon: <Navigation className="w-5 h-5 text-gray-400" />
  },
];

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

// 🏆 SEU SISTEMA DE FIDELIDADE
const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (1ª Vez)' },
  'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF Especial' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
  'NIVELPRATA': { code: 'NIVELPRATA', type: 'fixed', value: 15, desc: 'R$ 15,00 OFF (Prata)' },
  'NIVELOURO': { code: 'NIVELOURO', type: 'fixed', value: 25, desc: 'R$ 25,00 OFF (Ouro)' },
  'NIVELDIAMANTE': { code: 'NIVELDIAMANTE', type: 'fixed', value: 50, desc: 'R$ 50,00 OFF (Diamante)' },
};

const LEVELS = [
  { name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', perks: ["Acesso VIP", "Agendamento Rápido"] },
  { name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', perks: ["Cupom R$ 15 (Ganhou!)", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', perks: ["Cupom R$ 25 (Ganhou!)", "Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: ["Cupom R$ 50 (Ganhou!)", "Prioridade Total"] },
];

const musicVibes = ['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘']; 

// ⭐ SUAS REVIEWS ORIGINAIS (LISTA COMPLETA)
const REVIEWS_DB = [
  { t: "Sou casado, o sigilo foi total. A massagem tântrica me surpreendeu, finalização manual perfeita.", a: "Sigiloso (44 anos)", r: 5 },
  { t: "Nunca tinha feito tântrica. A sensibilidade que ele desperta no corpo é absurda. Gozei muito no final.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Ambiente discreto. O toque íntimo foi feito com muito respeito e técnica. Alívio imediato.", a: "Curioso", r: 5 },
  { t: "Gostei da massagem, relaxou bem os músculos. A parte tântrica poderia durar mais tempo.", a: "Paulo", r: 4 },
  { t: "Mão leve e firme ao mesmo tempo. A manipulação no lingam me levou às alturas. Recomendo.", a: "Anônimo", r: 5 },
  { t: "Fui tenso e saí leve. O respeito durante a massagem íntima me deixou muito à vontade.", a: "M.V. (Jales)", r: 5 },
  { t: "Local simples, mas a técnica é ótima. Faltou só um som ambiente melhor.", a: "Lucas", r: 4 },
  { t: "Minha esposa nem desconfia. Foi meu momento de escape. A descarga de energia foi intensa.", a: "Casado (Jales)", r: 5 },
  { t: "Cara profissional. Focou no meu prazer sem ultrapassar os limites combinados. Gozei litros.", a: "Vitor", r: 5 },
  { t: "Atrasou um pouco, mas a massagem compensou. O toque corpo a corpo é viciante.", a: "Cliente", r: 4 },
  { t: "Sensação única. O óleo morno e a respiração... o final manual foi explosivo.", a: "J.P.", r: 5 },
  { t: "Profissionalismo puro. Massagem relaxante de verdade, com um final feliz incrível.", a: "D.S.", r: 5 },
  { t: "Muito relaxante. A estimulação foi crescendo até eu não aguentar mais. Top.", a: "Anônimo", r: 5 },
  { t: "Gostei, mas achei o ar condicionado muito forte. A massagem em si foi nota 10.", a: "R.", r: 4 },
  { t: "Discrição garantida. Para quem é casado e quer relaxar sem preocupação, é o lugar.", a: "Empresário", r: 5 },
  { t: "Primeira vez recebendo massagem no lingam. Foi uma descoberta, prazer muito diferente.", a: "Pedro (24 anos)", r: 5 },
  { t: "Serviço honesto. Relaxamento muscular e alívio da tensão. Voltarei.", a: "Fernando", r: 4 },
  { t: "Me deixou leve. A massagem nas pernas e virilha preparou bem pro final.", a: "G.H.", r: 5 },
  { t: "Já fui em outros, mas a técnica manual dele é diferenciada. Sabe controlar o tempo.", a: "Cliente Fiel", r: 5 },
  { t: "Fizemos num local reservado. O sigilo foi mantido. O prazer foi intenso.", a: "Sigilo Total", r: 5 },
  { t: "Achei difícil de estacionar perto, mas o atendimento valeu a pena.", a: "M.", r: 4 },
  { t: "Gozei bastante. O toque dele é provocante na medida certa. Tântrica de verdade.", a: "Anônimo", r: 5 },
  { t: "Muito limpo e educado. Me senti seguro. A finalização foi no capricho.", a: "Advogado", r: 5 },
  { t: "Bom, mas queria ter ficado mais tempo na parte relaxante antes da íntima.", a: "L.F.", r: 4 },
  { t: "O toque de cueca roçando... excitante demais. Gozei só com a massagem.", a: "Curioso (30)", r: 5 },
  { t: "Sou hétero, foi minha primeira vez. Respeitou e focou só no meu relaxamento. Gostei.", a: "Anônimo", r: 5 },
  { t: "Tirou todo o estresse do trabalho. O clímax no final foi necessário pra renovar.", a: "Beto", r: 5 },
  { t: "Local tranquilo. O atendimento foi impecável do início ao fim.", a: "S.O.", r: 5 },
  { t: "Tudo certo. Só senti falta de toalhas extras, mas levei a minha.", a: "K.", r: 4 },
  { t: "A química foi boa. O toque na região pélvica é de quem entende do assunto.", a: "Jovem", r: 5 },
  { t: "Sou caminhoneiro, parei pra relaxar. Melhor coisa que fiz. Alívio total.", a: "Rodoviário", r: 5 },
  { t: "Relaxamento profundo. Esqueci dos problemas e da rotina de casado por 1 hora.", a: "Casado Estressado", r: 5 },
  { t: "Bom atendimento. O óleo tem um cheiro bom, ajudou a relaxar.", a: "Felipe", r: 4 },
  { t: "Gozei tanto que fiquei sem pernas. Vergonha rs, mas foi muito bom.", a: "Safado", r: 5 },
  { t: "O massagista tem pegada. A massagem prostática externa foi novidade e gostei.", a: "Anônimo", r: 5 },
  { t: "Pontual e discreto. Ninguém na cidade ficou sabendo. Perfeito.", a: "Vizinho (Urânia)", r: 5 },
  { t: "Preço justo pelo nível da tântrica. Com certeza voltarei.", a: "T.M.", r: 4 },
  { t: "Toque suave no começo e intenso no final. Me levou ao limite do prazer.", a: "G.", r: 5 },
  { t: "Ambiente climatizado. Me senti num spa. A finalização foi a cereja do bolo.", a: "Empresário", r: 5 },
  { t: "Massagem relaxante ok, mas a íntima foi o destaque. Mão de veludo.", a: "R.J.", r: 4 },
  { t: "Fiz escondido. O sigilo dele me passou muita segurança. Gozei tranquilo.", a: "Comprometido", r: 5 },
  { t: "Saí renovado. Foi uma das melhores gozadas que tive ultimamente. Só manual.", a: "L.", r: 5 },
  { t: "Sem enrolação. Focou onde eu queria e me fez relaxar absurdamente.", a: "Direto", r: 5 },
  { t: "Gostei, mas a iluminação estava um pouco clara pro clima tântrico.", a: "H.", r: 4 },
  { t: "Sensacional. O corpo a corpo (body) é quente demais. Recomendo.", a: "Anônimo", r: 5 },
  { t: "Me tratou super bem. A massagem perineal ajudou muito na potência.", a: "C.A.", r: 5 },
  { t: "Fiquei com receio, mas ele é super profissional. Relaxei e gozei muito.", a: "Iniciante", r: 5 },
  { t: "Muito bom. Aliviou a tensão e o tesão acumulado.", a: "Trabalhador", r: 4 },
  { t: "Experiência completa. Banho, tântrica e alívio manual. Nota 10.", a: "M.S.", r: 5 },
  { t: "O melhor da região. Técnica apurada, sabe levar ao clímax sem pressa.", a: "Cliente Vip", r: 5 }
];

// --- HELPERS ---
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
const generateBookingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 4; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return result;
};

// ==================================================================================
// 3. COMPONENTES UI (NOVOS E MELHORADOS)
// ==================================================================================

// 🚨 BOTÃO DE PÂNICO
const PanicButton = () => (
  <button onClick={() => window.location.href = "https://www.google.com"} className="fixed top-4 right-4 z-[100] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/30 rounded-full p-2.5 transition-all duration-300 shadow-lg group backdrop-blur-md">
    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
  </button>
);

// 🕵️ TOGGLE DE PRIVACIDADE
const PrivacyToggle = ({ mode, setMode }) => (
  <button onClick={() => { triggerHaptic(); setMode(!mode); }} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5 active:scale-95 transition-all">
    {mode ? <EyeOff className="w-3.5 h-3.5 text-gray-400"/> : <Eye className="w-3.5 h-3.5 text-[#0A84FF]"/>}
    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">{mode ? "Modo Espião" : "Visível"}</span>
  </button>
);

// 🔥 LIVE STATUS TICKER
const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  const msgs = ["Atendimento em andamento 💆‍♂️", "Horários da noite acabando 🌙", "Cliente acabou de agendar 🔥"];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%msgs.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-enter flex items-center gap-2 bg-[#1C1C1E]/80 border border-white/5 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{msgs[idx]}</span>
      </div>
    </div>
  );
};

// 💳 CARTÃO DE FIDELIDADE
const LevelProgressBar = ({ data, privacyMode, onTogglePrivacy }) => {
  const safeSpent = (data && typeof data.totalSpent === 'number') ? data.totalSpent : 0;
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => safeSpent >= l.min);
  const currentLevel = currentLevelIdx !== -1 ? LEVELS[LEVELS.length - 1 - currentLevelIdx] : LEVELS[0];
  const nextLevel = currentLevelIdx !== -1 && (LEVELS.length - 1 - currentLevelIdx + 1) < LEVELS.length ? LEVELS[LEVELS.length - 1 - currentLevelIdx + 1] : null;
    
  const min = currentLevel.min || 0;
  const nextMin = nextLevel ? nextLevel.min : min + 1;
  const rawProgress = ((safeSpent - min) / (nextMin - min)) * 100;
  const progress = nextLevel ? Math.min(100, Math.max(0, rawProgress)) : 100;

  return (
    <div className="glass-panel p-5 rounded-[28px] relative overflow-hidden mb-6 group border-t border-white/10">
        <div className="absolute top-[-50%] right-[-20%] w-64 h-64 bg-[#0A84FF]/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="flex justify-between items-end mb-2 relative z-10">
            <div>
              <p className="text-[9px] text-[#8E8E93] font-bold uppercase tracking-[0.1em] mb-0.5">Seu Status</p>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">{currentLevel.name} {currentLevel.icon}</h3>
            </div>
            <div className="text-right">
              <span className={`text-[15px] font-mono text-white font-bold block transition-all duration-300 ${privacyMode ? 'blur-[6px] select-none opacity-50' : ''}`}>
                {formatCurrency(safeSpent)}
              </span>
              <span className="text-[9px] text-gray-500 font-bold uppercase">Investido</span>
            </div>
        </div>
        <div className="relative h-2 bg-white/10 rounded-full mb-2 overflow-hidden z-10">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#0A84FF] to-[#30D158] rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(48,209,88,0.5)]" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[9px] text-gray-500 font-medium tracking-wide">
            <span>Benefício: <span className="text-[#32D74B]">{currentLevel.perks[1]}</span></span>
            {nextLevel ? (<span>Faltam {formatCurrency(nextLevel.min - safeSpent)} p/ {nextLevel.name}</span>) : (<span className="text-[#FFD60A]">Nível Máximo</span>)}
        </div>
    </div>
  )
}

// ⭐ CARROSSEL DE REVIEWS
const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
  const currentReview = REVIEWS_DB[idx];
  return (
    <div className="relative h-28 flex items-center justify-center mb-8">
      <div key={idx} className="absolute inset-0 flex flex-col items-center justify-center animate-enter px-4 bg-[#1C1C1E] rounded-[24px] border border-white/5 shadow-xl glass-panel">
        <div className="flex gap-1 mb-2">
          {[...Array(5)].map((_,k) => <Star key={k} className={`w-3.5 h-3.5 ${k < currentReview.r ? 'text-[#FFD60A] fill-[#FFD60A]' : 'text-gray-800'}`}/>)}
        </div>
        <p className="text-[13px] text-gray-200 text-center font-medium leading-relaxed tracking-tight italic">"{currentReview.t}"</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-widest">- {currentReview.a}</p>
      </div>
    </div>
  );
};

// 🖼️ GALERIA BLUR (PRIVACIDADE)
const BlurGallery = () => {
  return (
    <div className="mb-8 animate-enter delay-200">
      <div className="flex justify-between items-end mb-3 px-1">
        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Galeria (Prévia)</h4>
        <span className="text-[10px] text-[#0A84FF] flex items-center gap-1"><Lock className="w-3 h-3"/> Conteúdo Privado</span>
      </div>
      <div className="grid grid-cols-3 gap-2 relative">
        {[1,2,3].map(i => (
          <div key={i} className="aspect-square bg-[#1C1C1E] rounded-xl overflow-hidden relative group border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[20px]">
               <Lock className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors"/>
            </div>
          </div>
        ))}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <button onClick={() => { triggerHaptic(); alert('Fotos liberadas após o primeiro agendamento para sua segurança e sigilo.'); }} className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-4 py-2 rounded-full shadow-xl active:scale-95 transition-transform hover:bg-black/80">Toque para solicitar acesso</button>
        </div>
      </div>
    </div>
  );
};

// 📅 SELETOR DE DATA GRID
const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const DAYS_TO_SHOW = 14;
  const days = [];
  const now = new Date();
  for (let i = 0; i < DAYS_TO_SHOW; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      days.push(d);
  }
  const isTimeBlocked = (t, d) => {
    if(!d) return true;
    const isToday = d.getDate() === now.getDate() && d.getMonth() === now.getMonth();
    if (!isToday) return false;
    const [h] = t.split(':').map(Number);
    return h <= now.getHours() + 1;
  };
  const getDayLabel = (d) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      d.setHours(0,0,0,0); today.setHours(0,0,0,0); tomorrow.setHours(0,0,0,0);
      if (d.getTime() === today.getTime()) return 'HOJE';
      if (d.getTime() === tomorrow.getTime()) return 'AMANHÃ';
      return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).replace('.','');
  };
  const periods = [
      { label: 'Manhã ☀️', slots: ['09:00', '10:00', '11:00'] },
      { label: 'Tarde 🌤️', slots: ['13:00', '14:00', '15:00', '16:00', '17:00'] },
      { label: 'Noite 🌙', slots: ['18:00', '19:00', '20:00', '21:00'] }
  ];

  return (
    <div className="w-full select-none">
      <div className="flex justify-between items-end mb-4 px-1">
        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Escolha o Dia</h4>
        <span className="text-[10px] text-[#0A84FF] font-medium">Próximos {DAYS_TO_SHOW} dias</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-6 animate-enter">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate() && selectedDate?.getMonth() === d.getMonth();
          const label = getDayLabel(d);
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} 
              className={`relative flex flex-col items-center justify-center h-[80px] rounded-[18px] transition-all duration-200 border 
              ${isSel ? 'bg-[#0A84FF] text-white shadow-lg border-[#0A84FF] scale-[1.03] z-10 font-bold' : 'bg-[#2C2C2E] text-gray-400 border-white/5 active:bg-[#3A3A3C] hover:bg-[#3A3A3C]'}`}>
              <span className={`text-[9px] uppercase font-bold tracking-wide mb-0.5 ${label === 'HOJE' ? 'text-[#32D74B]' : isSel ? 'text-white/90' : 'opacity-60'}`}>{label}</span>
              <span className={`text-xl font-mono leading-none mb-0.5 ${isSel ? 'text-white' : 'text-gray-200'}`}>{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="animate-enter space-y-6 pt-2 border-t border-white/5">
           {periods.map((period, idx) => {
               const hasSlots = period.slots.some(t => !isTimeBlocked(t, selectedDate));
               return (
                   <div key={idx} className={`transition-opacity ${hasSlots ? 'opacity-100' : 'opacity-40 grayscale'}`}>
                       <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1 flex items-center gap-2">{period.label}<div className="h-[1px] flex-1 bg-white/5"></div></h5>
                       <div className="grid grid-cols-4 gap-2">
                           {period.slots.map(t => {
                               const blocked = isTimeBlocked(t, selectedDate);
                               const isSelected = selectedTime === t;
                               return (
                                  <button key={t} disabled={blocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                                    className={`py-2.5 rounded-[12px] text-[13px] font-semibold transition-all duration-200 relative overflow-hidden
                                    ${isSelected ? 'bg-[#0A84FF] text-white shadow-lg scale-[1.02]' : blocked ? 'bg-white/5 text-gray-600 opacity-30 cursor-not-allowed' : 'bg-[#2C2C2E] text-gray-300 hover:bg-[#3A3A3C] border border-white/5'}`}>
                                    {t}
                                  </button>
                               )
                           })}
                       </div>
                   </div>
               )
           })}
        </div>
      )}
    </div>
  );
};

// 🎫 INVENTÁRIO DE CUPONS
const CouponInventory = ({ inventory, appliedCoupon, onApply, onRemove, onAddManual }) => {
  const [manualCode, setManualCode] = useState('');
  const myCoupons = inventory.map((c) => SYSTEM_COUPONS[c]).filter(Boolean);

  const handleManualAdd = () => {
      const codeUpper = manualCode.toUpperCase().trim();
      if(codeUpper && SYSTEM_COUPONS[codeUpper]) {
          if (inventory.includes(codeUpper)) { alert('Você já tem este cupom!'); } 
          else { onAddManual(codeUpper); setManualCode(''); triggerHaptic(); }
      } else { alert('Cupom inválido ou expirado.'); }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center ml-1 mb-2">
        <h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Cupons & Descontos</h4>
      </div>
      <div className="flex gap-2 mb-3">
          <input value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Possui um código?" className="w-full bg-[#1C1C1E] border border-white/10 text-white text-[15px] rounded-[14px] p-3.5 placeholder:text-gray-600 focus:border-[#0A84FF]" />
          <button onClick={handleManualAdd} className="bg-[#2C2C2E] border border-white/10 text-white px-5 rounded-[14px] font-bold text-[13px] hover:bg-[#3A3A3C] transition-colors">Adicionar</button>
      </div>
      {myCoupons.length > 0 ? (
        <div className="space-y-3">
          {myCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <button key={coupon.code} onClick={() => { triggerHaptic(); isApplied ? onRemove() : onApply(coupon.code); }} className={`w-full p-4 rounded-[16px] flex justify-between items-center transition-all duration-300 ${isApplied ? 'bg-[#0A84FF]/20 border border-[#0A84FF] shadow-lg' : 'bg-[#1C1C1E] border border-white/5'}`}>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-300 bg-[#3A3A3C] px-1.5 py-0.5 rounded tracking-wider border border-white/10">{coupon.code}</span>
                    {isApplied && <span className="text-[10px] text-[#0A84FF] font-bold animate-pulse">APLICADO</span>}
                  </div>
                  <p className="text-[13px] text-gray-400 mt-1">{coupon.desc}</p>
                </div>
                {isApplied ? <X className="w-5 h-5 text-gray-400" /> : <div className="w-5 h-5 rounded-full border border-gray-600"></div>}
              </button>
            )
          })}
        </div>
      ) : (
          <div className="p-4 rounded-[16px] border border-dashed border-white/10 text-center bg-white/5">
              <p className="text-[12px] text-gray-500">Nenhum cupom disponível.</p>
          </div>
      )}
    </div>
  );
};

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  
  // Refs
  const locationRef = useRef(null);
  const vibeRef = useRef(null);
  const extrasRef = useRef(null);
  const paymentRef = useRef(null);
  const homeRef = useRef(null);

  const scrollTo = (ref) => { setTimeout(() => { ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 300); };
    
  // Estado Persistente
  const [loyalty, setLoyalty] = useState(() => {
    const saved = localStorage.getItem('thaly_system_final'); 
    return saved ? JSON.parse(saved) : { savedName: '', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], history: [] };
  });

  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
  const [showFaq, setShowFaq] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false); 
  const [weatherHint, setWeatherHint] = useState("");
  const [lastOrderLink, setLastOrderLink] = useState(""); 
  
  // Init
  useEffect(() => { 
    setTimeout(() => setLoading(false), 2000); 
    const hr = new Date().getHours();
    setWeatherHint(hr < 18 ? "☀️ Dia perfeito para relaxar" : "🌙 Noite ideal para sigilo"); 
  }, []);

  useEffect(() => {
    localStorage.setItem('thaly_system_final', JSON.stringify(loyalty));
    if (loyalty.savedName) { setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true})); }
  }, [loyalty]);

  // Actions
  const handleQuickSchedule = () => {
    triggerHaptic();
    if (loyalty.savedName) { setStep('services'); } else { setStep('identity'); }
  };

  const handleAddManualCoupon = (code) => {
      if (!loyalty.inventory.includes(code)) {
          setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]}));
          triggerHaptic();
      } else { alert('Este cupom já está na sua carteira!'); }
  };

  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  // --- LÓGICA DE PREÇOS (ORIGINAL) ---
  const getCurrentLevel = () => [...LEVELS].reverse().find(l => (loyalty.totalSpent || 0) >= l.min) || LEVELS[0];

  const getAromaPrice = () => {
      const level = getCurrentLevel().name;
      if (level === 'Ouro' || level === 'Diamante') return 0;
      if (level === 'Prata') return CONFIG.PRICES.AROMA_DISCOUNT;
      return CONFIG.PRICES.AROMA_FULL;
  };

  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.useTable) total += CONFIG.PRICES.MACA;
    if (selection.aroma) total += getAromaPrice();
    if (selection.location?.fee) total += selection.location.fee;
    if (selection.coupon) {
      let discountableAmount = total - (selection.location?.fee || 0); 
      let discountValue = 0;
      if (selection.coupon.type === 'percent') discountValue = (discountableAmount * selection.coupon.value / 100);
      else discountValue = selection.coupon.value;
      total -= discountValue;
    }
    return Math.max(0, total);
  }

  const calcFinalPrice = () => {
    let base = calcBaseTotal();
    if (selection.paymentMethod === 'credit_card') {
       const rate = CARD_RATES[selection.installments] || 0;
       return base / (1 - rate);
    }
    return base;
  };

  const canFinalize = selection.service && selection.location && selection.date && selection.time && selection.music && selection.paymentMethod && (selection.location.allowsTableChoice ? selection.useTable !== null : true) && (selection.location.id === 'outras-cidades' ? !!selection.city : true);

  const handleWhatsApp = () => {
    triggerHaptic();
    if (!canFinalize) return;
    
    // Calcula valores e textos
    let serviceValueForLoyalty = selection.service.basePrice;
    let extrasText = "";
    if (selection.upgrade) { 
        const upgradePrice = selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
        serviceValueForLoyalty += upgradePrice; 
        extrasText += `\n➕ +30 Minutos (+${formatCurrency(upgradePrice)})`; 
    }
    if (selection.useTable) { 
        serviceValueForLoyalty += CONFIG.PRICES.MACA; 
        extrasText += `\n➕ Maca Portátil (+${formatCurrency(CONFIG.PRICES.MACA)})`; 
    }
    const aromaPrice = getAromaPrice();
    if (selection.aroma) {
        serviceValueForLoyalty += aromaPrice;
        extrasText += `\n➕ Aromaterapia (${aromaPrice === 0 ? 'GRÁTIS VIP' : `+${formatCurrency(aromaPrice)}`})`;
    }

    let feeVal = selection.location.fee || 0;
    let feeType = selection.location.isMotel ? "🏨 Taxa Motel" : selection.location.isUber ? "🚗 Taxa Uber" : "";
    
    let discountVal = 0;
    if (selection.coupon) {
      if (selection.coupon.type === 'percent') discountVal = serviceValueForLoyalty * (selection.coupon.value / 100);
      else discountVal = selection.coupon.value;
    }

    const bookingId = generateBookingId(); 

    // Atualiza Fidelidade
    const newTotal = (loyalty.totalSpent || 0) + serviceValueForLoyalty;
    setLoyalty(prev => ({ 
      ...prev, 
      savedName: user.name || prev.savedName, 
      totalSpent: newTotal, 
      inventory: prev.inventory.filter(c => c !== selection.coupon?.code),
      notifications: [{
        id: Date.now(), title: 'Agendamento Confirmado', message: `Sua sessão para ${selection.date.toLocaleDateString()} foi confirmada.`, read: false, timestamp: Date.now(), icon: 'calendar'
      }, ...prev.notifications]
    }));

    const locationString = selection.location.id === 'outras-cidades' ? `${selection.location.label} (${selection.city})` : selection.location.label;

    const msg = `*NOVO PEDIDO: #${bookingId}*
👤 *Cliente:* ${user.name}
📅 *Data:* ${selection.date.toLocaleDateString('pt-BR')} às ${selection.time}
💆 *Serviço:* ${selection.service.name}
📍 *Local:* ${locationString} ${selection.location.isMotel ? '(Vou até você)' : ''}

*DETALHES:*
• Base: ${formatCurrency(selection.service.basePrice)}${extrasText}
${discountVal > 0 ? `• Desconto (${selection.coupon.code}): -${formatCurrency(discountVal)}` : ''}

------------------------------
${feeVal > 0 ? `${feeType}: ${formatCurrency(feeVal)}\n` : ''}💰 *TOTAL FINAL: ${formatCurrency(calcFinalPrice())}*
(Pgto: ${selection.paymentMethod === 'credit_card' ? `${selection.installments}x Cartão` : selection.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'})
------------------------------
🎵 Vibe: ${selection.music}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${CONFIG.CONTACT.PHONE}&text=${encodeURIComponent(msg)}`;
    setLastOrderLink(whatsappUrl); 
    window.open(whatsappUrl, '_blank');
    setStep('success');
  };

  // --- MENU LATERAL ---
  const HamburgerMenu = () => {
      if(!showMenu) return null;
      return (
          <div className="absolute top-16 right-6 w-52 bg-[#1C1C1E] border border-white/10 rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden animate-enter origin-top-right">
              <button onClick={() => { setShowFaq(true); setShowMenu(false); }} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5 active:bg-white/20">
                  <HelpCircle className="w-4 h-4 text-gray-400"/> Ajuda / Conduta
              </button>
              <a href="https://instagram.com/thalymassagens" target="_blank" onClick={() => setShowMenu(false)} className="px-4 py-4 text-left text-[14px] text-white hover:bg-white/10 flex items-center gap-3 border-b border-white/5 active:bg-white/20">
                  <Instagram className="w-4 h-4 text-[#E1306C]"/> Instagram
              </a>
              <button onClick={() => { setLoyalty({savedName: '', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], history: []}); window.location.reload(); }} className="px-4 py-4 text-left text-[14px] text-red-500 hover:bg-red-500/10 flex items-center gap-3 active:bg-red-500/20">
                  <Trash2 className="w-4 h-4"/> Limpar Dados
              </button>
          </div>
      )
  }

  // --- HEADER GLOBAL ---
  const GlobalHeader = () => (
      <div className="absolute top-0 w-full z-50 px-6 pt-12 pb-8 flex justify-between items-center pointer-events-none bg-gradient-to-b from-black/90 via-black/60 to-transparent">
          <div className="pointer-events-auto">
             {step !== 'home' && step !== 'success' ? (
                <button onClick={() => setStep(step === 'configure' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 -ml-2 rounded-full active:bg-white/10 bg-black/20 backdrop-blur-md border border-white/5"><ChevronLeft className="w-6 h-6 text-white"/></button>
             ) : (
                <div className="flex flex-col items-start animate-enter">
                    <span className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest mb-0.5">{new Date().toLocaleDateString('pt-BR', {weekday:'long', day:'numeric'})}</span>
                    <span className="text-[13px] font-bold text-gray-200 leading-tight">{weatherHint}</span>
                </div>
             )}
          </div>

          <div className="flex items-center gap-3 pointer-events-auto relative">
              <PrivacyToggle mode={privacyMode} setMode={setPrivacyMode} />
              <button onClick={() => setShowNotifications(true)} className="relative w-10 h-10 rounded-full bg-[#1C1C1E]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-gray-400 active:scale-95 transition-all">
                  <Bell className="w-5 h-5"/>
                  {loyalty.notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center text-white border-2 border-[#1C1C1E]">{loyalty.notifications.filter(n => !n.read).length}</span>
                  )}
              </button>
              <button onClick={() => setShowMenu(!showMenu)} className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/10 flex items-center justify-center transition-all active:scale-95 ${showMenu ? 'bg-white text-black' : 'bg-[#1C1C1E]/80 text-gray-400'}`}>
                  {showMenu ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
              </button>
              <HamburgerMenu />
          </div>
      </div>
  );

  return (
    <div className="min-h-screen flex justify-center p-0 sm:p-6 font-sans text-gray-200 bg-black" onClick={() => { if(showMenu) setShowMenu(false); }}>
      <style>{globalStyles}</style>
      <PanicButton />

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-enter">
          <div className="relative w-20 h-20 mb-8">
             <div className="absolute inset-0 rounded-full border-4 border-[#0A84FF]/20"></div>
             <div className="absolute inset-0 rounded-full border-4 border-t-[#0A84FF] animate-spin-slow"></div>
             <Sparkles className="absolute inset-0 m-auto text-[#0A84FF] animate-pulse w-8 h-8"/>
          </div>
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#0A84FF] uppercase shimmer-text">Carregando Experiência</span>
        </div>
      ) : (
      <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] midnight-bg">
        
        <GlobalHeader />

        {/* --- HOME --- */}
        {step === 'home' && (
          <div className="flex-1 p-6 overflow-y-auto pb-32 pt-32 scrollbar-hide" ref={homeRef}>
            <div className="mb-8 animate-enter">
              <h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-2">Massagens Relaxantes<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A84FF] to-[#5AC8FA] text-2xl shimmer-text">em Santa Fé do Sul</span></h1>
            </div>

            <LevelProgressBar data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            <LiveStatus />
            <BlurGallery />

            <div className="mb-3 px-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">O que dizem os clientes</div>
            <ReviewsCarousel />
            
            <div className="mt-4">
              <button onClick={handleQuickSchedule} className="w-full btn-primary font-bold py-4 rounded-[22px] shadow-lg flex justify-center items-center gap-2 text-[17px]">
                Agendar Sessão VIP <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* --- IDENTITY --- */}
        {step === 'identity' && (
          <div className="flex-1 p-6 pt-36 animate-enter flex flex-col h-full pb-32">
            <h2 className="text-3xl font-bold text-white mb-2">Quem é você?</h2>
            <p className="text-gray-400 text-[15px] mb-8">Para manter a segurança e exclusividade.</p>
            
            <div className="space-y-6 flex-1">
              <div className="glass-panel p-6 rounded-[24px]">
                <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider block mb-2">Seu Nome</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent text-white text-[22px] font-medium placeholder:text-gray-600 border-b border-white/10 py-2 focus:border-[#0A84FF] transition-colors" placeholder="Digite seu nome..." />
              </div>

              <div className="space-y-3">
                <button onClick={() => { triggerHaptic(); setUser({...user, isAdult: !user.isAdult}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isAdult && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[16px] font-medium ${user.isAdult ? 'text-white' : 'text-gray-400'}`}>Maior de 18 anos</span>
                </button>
                <button onClick={() => { triggerHaptic(); setUser({...user, isMassagemOk: !user.isMassagemOk}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user.isMassagemOk ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isMassagemOk ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isMassagemOk && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[16px] font-medium ${user.isMassagemOk ? 'text-white' : 'text-gray-400'}`}>Busco massagem profissional</span>
                </button>
              </div>

              <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full btn-primary font-bold py-4 rounded-[22px] text-[17px] disabled:opacity-50 shadow-lg mt-4">Continuar</button>
            </div>
          </div>
        )}

        {/* --- SERVICES --- */}
        {step === 'services' && (
          <div className="flex-1 p-6 pt-36 overflow-y-auto pb-32 animate-enter scrollbar-hide">
            <h2 className="text-3xl font-bold text-white mb-6">Menu</h2>
            <div className="space-y-6">
              {services.map(s => (
                <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className={`glass-panel p-6 rounded-[30px] active:scale-98 transition-transform group relative overflow-hidden border-t border-white/10`}>
                  {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-[20px] shadow-lg z-10">{s.highlight}</div>}
                  <div className="mb-4 relative z-10">
                    <h3 className="font-bold text-white text-[22px] leading-tight mb-1">{s.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className={`text-[#0A84FF] font-bold text-[24px] ${privacyMode ? 'blur-md' : ''}`}>{formatCurrency(s.basePrice)}</span>
                        <span className="text-gray-500 text-[13px]">• {s.labelDuration}</span>
                    </div>
                  </div>
                  <p className="text-[14px] text-gray-300 leading-relaxed mb-5 opacity-90 relative z-10">{s.description}</p>
                  <div className="grid grid-cols-2 gap-2 relative z-10">
                    {s.details.slice(0,4).map((d, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5">
                            <div className="w-1 h-1 rounded-full bg-[#0A84FF]"></div> 
                            <span className="text-[10px] text-gray-300 font-medium">{d}</span>
                        </div>
                    ))}
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#0A84FF]/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-[#0A84FF]/30 transition-all"/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONFIGURE --- */}
        {step === 'configure' && selection.service && (
          <div className="flex-1 p-6 pt-36 overflow-y-auto pb-64 animate-enter scrollbar-hide"> 
            <div className="glass-panel p-5 rounded-[22px] mb-8 flex items-center justify-between border-l-4 border-l-[#0A84FF]">
              <div>
                <h3 className="font-bold text-white text-[17px]">{selection.service.name}</h3>
                <p className="text-[13px] text-gray-400 mt-0.5">Configuração Personalizada</p>
              </div>
            </div>

            <div className="space-y-10">
              <section>
                <InlineDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />
              </section>

              <section ref={locationRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Local de Atendimento</h4>
                <div className="space-y-3">
                  {locations.map(l => {
                    return (
                    <div key={l.id} className="animate-enter">
                        <button onClick={() => { triggerHaptic(); setSelection({...selection, location: l, useTable: null}); scrollTo(vibeRef); }} className={`w-full p-5 rounded-[22px] border text-left transition-all duration-300 ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${selection.location?.id === l.id ? 'bg-[#0A84FF] text-white' : 'bg-white/5 text-gray-400'}`}>{l.icon}</div>
                                <span className="font-semibold text-white text-[16px]">{l.label}</span> 
                            </div>
                            {l.fee > 0 && <span className={`text-[10px] font-bold text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-1 rounded border border-[#FFD60A]/20 ${privacyMode ? 'blur-sm' : ''}`}>+ {formatCurrency(l.fee)}</span>}
                          </div>
                          <p className="text-[13px] text-gray-500 ml-11">{l.sublabel}</p>
                        </button>
                        
                        {selection.location?.id === l.id && l.id === 'santa-fe' && l.allowsTableChoice && (
                          <div className="mt-3 grid grid-cols-2 gap-3 animate-enter ml-4 border-l-2 border-white/10 pl-4">
                            <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === false ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'glass-panel border-transparent text-gray-400'}`}>🛏 Na Cama</button>
                            <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === true ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'glass-panel border-transparent text-gray-400'}`}>💆‍♂️ Levar Maca <span className={privacyMode ? 'blur-sm' : ''}>(+{formatCurrency(CONFIG.PRICES.MACA)})</span></button>
                          </div>
                        )}
                        {selection.location?.id === l.id && l.id === 'outras-cidades' && (
                            <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Digite o nome da cidade..." className="mt-3 w-full bg-[#1C1C1E] p-4 rounded-[18px] border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0A84FF] transition-all animate-enter" />
                        )}
                    </div>
                  )})}
                </div>
              </section>

              <div ref={vibeRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Vibe Sonora</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   {musicVibes.map(vibe => (
                      <button key={vibe} onClick={() => { setSelection({...selection, music: vibe}); scrollTo(extrasRef); }} className={`px-6 py-4 rounded-[18px] border flex flex-col items-center justify-center gap-1 min-w-[100px] transition-all duration-300 ${selection.music === vibe ? 'bg-white text-black border-white' : 'glass-panel border-transparent text-gray-400'}`}>
                        <span className="text-[14px] font-bold whitespace-nowrap">{vibe}</span>
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-3" ref={extrasRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 mt-8">Extras Premium</h4>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, upgrade: !selection.upgrade}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">+30 Minutos</p><p className="text-[11px] text-gray-500">Mais tempo para curtir</p></div>
                  <span className={`text-[#0A84FF] font-bold text-[15px] ${privacyMode ? 'blur-sm' : ''}`}>+ {formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                </button>

                <button onClick={() => { triggerHaptic(); setSelection({...selection, aroma: !selection.aroma}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">Aromaterapia</p><p className="text-[11px] text-gray-500">Óleos essenciais</p></div>
                  <div className={`text-right ${privacyMode ? 'blur-sm' : ''}`}>
                      {getAromaPrice() < CONFIG.PRICES.AROMA_FULL ? (
                          <><span className="text-gray-500 line-through text-[11px] mr-2">{formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span><span className="text-[#30D158] font-bold text-[15px]">{getAromaPrice() === 0 ? 'GRÁTIS' : `+${formatCurrency(getAromaPrice())}`}</span></>
                      ) : (<span className="text-[#0A84FF] font-bold text-[15px]">+ {formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span>)}
                  </div>
                </button>
              </div>

              <CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(code) => { setSelection({...selection, coupon: SYSTEM_COUPONS[code]}); scrollTo(paymentRef); }} onRemove={() => setSelection({...selection, coupon: null})} onAddManual={handleAddManualCoupon}/>

              <div className="mt-6" ref={paymentRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pagamento</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                    <QrCode className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Pix</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                    <Banknote className="w-6 h-6 text-[#30D158]" /><span className="text-[13px] font-bold text-white">Dinheiro</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-[#FFD60A]" /><span className="text-[13px] font-bold text-white">Crédito</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'debit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'debit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Débito</span>
                  </button>
                </div>
                
                {selection.paymentMethod === 'credit_card' && (
                  <div className="mt-3 glass-panel p-4 rounded-[16px] animate-enter">
                    <label className="text-[11px] text-gray-400 block mb-2 font-bold uppercase">Parcelamento (c/ juros)</label>
                    <select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#000] border border-white/10 text-white text-[15px] rounded-xl p-3 focus:border-[#0A84FF]">
                      {CARD_RATES.map((rate, i) => i > 0 && (<option key={i} value={i}>{i}x de {formatCurrency(calcFinalPrice()/i)}</option>))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER FIXO */}
        {step === 'configure' && selection.location && (
          <div className="absolute bottom-0 w-full p-0 z-40">
            <div className="bg-[#1C1C1E]/90 backdrop-blur-xl rounded-t-[32px] p-5 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
              <div className="flex justify-between items-center mb-4 px-1">
                  <div className="flex flex-col"><span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Valor Estimado</span></div>
                  <div className="text-right">
                      <span className={`text-[26px] font-bold text-white tracking-tight ${privacyMode ? 'blur-md' : ''}`}>
                        {selection.location.isPending ? formatCurrency(calcFinalPrice()) + ' + Taxa' : formatCurrency(calcFinalPrice())}
                      </span>
                      <p className="text-[10px] text-gray-500 leading-none mt-1">{selection.location.isMotel ? '(Inclui Taxa do Motel)' : selection.location.isUber ? '(Inclui Uber)' : 'Total c/ Descontos'}</p>
                  </div>
              </div>
              <button disabled={!canFinalize} onClick={handleWhatsApp} className="w-full btn-primary font-bold py-4 rounded-[18px] flex justify-center items-center gap-2 text-[16px] disabled:opacity-50 disabled:shadow-none">CONFIRMAR AGENDAMENTO</button>
            </div>
          </div>
        )}

        {/* TELA SUCESSO */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-enter pb-32">
            <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.4)] animate-pulse-slow"><Check className="w-10 h-10 text-white stroke-[3px]"/></div>
            <h2 className="text-3xl font-bold text-white mb-2">Pedido Recebido!</h2>
            <p className="text-gray-400 mb-8 text-[15px]">Verifique seu WhatsApp para confirmar.</p>
            <div className="w-full mb-8 bg-[#1C1C1E] p-4 rounded-[20px] border border-white/10 text-left">
                <LevelProgressBar data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            </div>
            <button onClick={() => window.open(lastOrderLink, '_blank')} className="mb-4 w-full flex items-center justify-center gap-2 text-[15px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 py-3.5 rounded-xl border border-[#0A84FF]/20 hover:bg-[#0A84FF]/20 transition-colors"><Send className="w-4 h-4"/> Reenviar Mensagem</button>
            <button onClick={handleReset} className="w-full py-4 text-gray-500 text-[14px] font-medium">Voltar ao Início</button>
          </div>
        )}

        {/* FAQ MODAL */}
        {showFaq && (
          <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-5">
            <div className="glass-panel w-full max-w-sm rounded-[32px] p-8 animate-enter">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-[#0A84FF]"/> Dúvidas</h3>
              <div className="space-y-5 text-[15px] text-gray-300 leading-relaxed">
                <div><h4 className="font-bold text-white mb-1">Sigilo</h4><p className="text-sm">Absoluto. Nada chega na fatura do cartão com nome de massagem.</p></div>
                <div><h4 className="font-bold text-white mb-1">Locais</h4><p className="text-sm">Motel (vou na sua suíte), Sua Casa (Santa Fé) ou Cidades Vizinhas.</p></div>
                <div><h4 className="font-bold text-white mb-1">Conduta</h4><p className="text-sm">Respeito máximo. Serviço profissional.</p></div>
              </div>
              <button onClick={() => setShowFaq(false)} className="mt-8 w-full btn-secondary text-white py-4 rounded-[18px] font-bold hover:bg-white/10 transition-colors">Fechar</button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS MODAL */}
        {showNotifications && (
          <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-5" onClick={() => setShowNotifications(false)}>
            <div className="bg-[#1C1C1E] w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 border-t sm:border border-white/10 shadow-2xl animate-enter h-[75vh] sm:h-[600px] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">Notificações</h3>
                  <button onClick={() => { setLoyalty(p => ({...p, notifications: p.notifications.map(n => ({...n, read: true}))})); setShowNotifications(false); }} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1 scrollbar-hide">
                {loyalty.notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500"><Bell className="w-12 h-12 mb-4 opacity-20"/><p>Nenhuma notificação.</p></div>
                ) : (
                    loyalty.notifications.map(n => (
                        <div key={n.id} className="p-4 rounded-[20px] bg-[#2C2C2E] border border-white/5 flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.icon === 'level' ? 'bg-[#FFD60A]/20 text-[#FFD60A]' : n.icon === 'coupon' ? 'bg-[#FF375F]/20 text-[#FF375F]' : 'bg-[#0A84FF]/20 text-[#0A84FF]'}`}>
                                {n.icon === 'calendar' ? <Calendar className="w-5 h-5"/> : n.icon === 'level' ? <Crown className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start"><h4 className="font-bold text-white text-[15px] mb-1">{n.title}</h4>{!n.read && <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>}</div>
                                <p className="text-[13px] text-gray-400 leading-snug">{n.message}</p>
                                <span className="text-[10px] text-gray-600 mt-2 block">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      )}
    </div>
  );
}
