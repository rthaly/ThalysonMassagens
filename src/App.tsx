import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, Siren, Send, ThumbsUp, Car, Menu, Smartphone, Sparkles, Settings, MoreHorizontal, Home
} from 'lucide-react';

// ==================================================================================
// 1. INFRAESTRUTURA DE SEGURANÇA & ARMAZENAMENTO
// ==================================================================================

const SecureStorage = {
  SECRET: 'THALY_ULTIMATE_FINAL_V2_',
  encrypt: (data) => {
    try { return btoa(encodeURIComponent(JSON.stringify(data))); } catch (e) { return null; }
  },
  decrypt: (cipher) => {
    try { return JSON.parse(decodeURIComponent(atob(cipher))); } catch (e) { return null; }
  },
  set: (key, data) => {
    const cipher = SecureStorage.encrypt(data);
    if (cipher) localStorage.setItem(SecureStorage.SECRET + key, cipher);
  },
  get: (key) => {
    const cipher = localStorage.getItem(SecureStorage.SECRET + key);
    // Tenta recuperar versão antiga se não achar a nova para não perder dados do usuario
    if (!cipher) {
        const old = localStorage.getItem('thaly_system_v22');
        if(old) { try { return JSON.parse(old); } catch(e) { return null; } }
        return null;
    }
    return cipher ? SecureStorage.decrypt(cipher) : null;
  },
  clear: () => {
      localStorage.removeItem('thaly_system_v22'); 
      localStorage.clear();
  }
};

const generateBookingId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 4; i++) { result += chars.charAt(Math.floor(Math.random() * chars.length)); }
    return result;
};

const generateCalendarLink = (serviceName, date, time) => {
  if (!date || !time) return '';
  const [hours, minutes] = time.split(':');
  const startDate = new Date(date);
  startDate.setHours(parseInt(hours), parseInt(minutes));
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1);
  const formatDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(serviceName)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent("Sessão confirmada com Thalyson Massagens.")}&location=${encodeURIComponent("Santa Fé do Sul")}`;
};

// ==================================================================================
// 2. ESTILOS GLOBAIS (UX/UI REDESIGN)
// ==================================================================================

const globalStyles = `
/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  overscroll-behavior-y: none; touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.02em; color: #fff; background: #000; -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* Aurora Background */
.aurora-bg {
  background: radial-gradient(140% 100% at 50% 0%, rgba(20, 20, 22, 1), #000000 60%), radial-gradient(100% 100% at 50% 100%, rgba(10, 132, 255, 0.04), transparent 50%);
  background-attachment: fixed; background-size: cover; min-height: 100vh;
}

/* UI Elements */
.ios-card { 
  background: rgba(28, 28, 30, 0.55); backdrop-filter: blur(50px) saturate(180%); -webkit-backdrop-filter: blur(50px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.2s ease;
}
.ios-card:active { transform: scale(0.99); }

.ios-btn-primary {
  background: linear-gradient(135deg, #007AFF, #0055FF); color: white; 
  box-shadow: 0 8px 20px rgba(0, 122, 255, 0.3); border: none;
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }
.ios-btn-primary:disabled { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }

.custom-input {
  background: rgba(28, 28, 30, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white; transition: all 0.3s ease;
}
.custom-input:focus { border-color: #0A84FF; box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2); }

/* --- 3D FLIP CARD --- */
.flip-container { perspective: 1000px; }
.flip-card { 
  position: relative; width: 100%; height: 100%; text-align: center; 
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; 
}
.flip-card.flipped { transform: rotateY(180deg); }
.flip-front, .flip-back { 
  position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; 
  border-radius: 28px; overflow: hidden;
}
.flip-back { transform: rotateY(180deg); background: #1C1C1E; border: 1px solid rgba(255,255,255,0.1); }

/* --- TOASTS --- */
.toast-container { position: fixed; top: 10px; left: 0; right: 0; z-index: 9999; display: flex; flex-col; align-items: center; gap: 8px; pointer-events: none; }
.toast { pointer-events: auto; background: rgba(30,30,30,0.95); backdrop-filter: blur(12px); color: white; padding: 12px 20px; border-radius: 50px; font-size: 13px; font-weight: 600; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; items-center; gap: 8px; border: 1px solid rgba(255,255,255,0.1); animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast.error { border-left: 4px solid #FF3B30; }
.toast.success { border-left: 4px solid #32D74B; }
.toast.info { border-left: 4px solid #0A84FF; }

/* --- ANIMATIONS --- */
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-pulse-slow { animation: pulse 3s infinite; }
.animate-spin-slow { animation: spin 1.5s linear infinite; }
.animate-float { animation: float 3s ease-in-out infinite; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
`;

const IconBack = () => <ChevronLeft className="w-6 h-6 text-[#0A84FF]" />;

// ==================================================================================
// 3. DADOS (ORIGINAIS)
// ==================================================================================

const CONFIG = {
  PRICES: {
    MACA: 20,            
    AROMA_FULL: 10,      
    AROMA_DISCOUNT: 5,   
    UPGRADE_PCT: 0.5     
  }
};

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

const locations = [
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Vou com você', fee: 75, allowsTableChoice: false, estimatedTravelTime: '10-15 min', isMotel: true },
  { id: 'santa-fe', label: 'Santa Fé do Sul', sublabel: 'No conforto do seu lar', fee: 40, allowsTableChoice: true, estimatedTravelTime: '15-20 min', isUber: true, requiresAddress: true },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', sublabel: 'Atendimento na região', fee: 0, allowsTableChoice: false, estimatedTravelTime: 'A combinar', input: true, isPending: true },
];

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

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

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const musicVibes = ['Silêncio 🤫', 'Natureza 🌿', 'Zen 🧘', 'Lofi HipHop ☕']; 

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

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(5); };

// ==================================================================================
// 4. COMPONENTES AVANÇADOS
// ==================================================================================

const InstallPrompt = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isMobile && !isStandalone) setTimeout(() => setShow(true), 3000);
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 animate-slide-up">
      <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0A84FF] rounded-lg flex items-center justify-center"><Smartphone className="text-white w-6 h-6"/></div>
          <div><p className="text-white font-bold text-sm">Instalar App</p><p className="text-gray-400 text-xs">Acesso rápido e offline</p></div>
        </div>
        <button onClick={() => setShow(false)} className="p-2 bg-white/10 rounded-full"><X className="w-4 h-4"/></button>
      </div>
    </div>
  );
};

const LiveStatus = () => {
  const [idx, setIdx] = useState(0);
  const msgs = ["Atendimento em andamento 💆‍♂️", "Horários da noite acabando 🌙", "Anônimo acabou de agendar 🔥", "Segurança garantida 🔒"];
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%msgs.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="flex justify-center mb-6">
      <div className="animate-fade-in flex items-center gap-2 bg-[#1C1C1E] border border-white/5 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">{msgs[idx]}</span>
      </div>
    </div>
  );
};

const LoyaltyFlipCard = ({ data, privacyMode, onTogglePrivacy }) => {
  const [flipped, setFlipped] = useState(false);
  const safeSpent = (data && typeof data.totalSpent === 'number') ? data.totalSpent : 0;
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => safeSpent >= l.min);
  const currentLevel = currentLevelIdx !== -1 ? LEVELS[LEVELS.length - 1 - currentLevelIdx] : LEVELS[0];
  const nextLevel = currentLevelIdx !== -1 && (LEVELS.length - 1 - currentLevelIdx + 1) < LEVELS.length ? LEVELS[LEVELS.length - 1 - currentLevelIdx + 1] : null;
  const min = currentLevel.min || 0;
  const nextMin = nextLevel ? nextLevel.min : min + 1;
  const progress = nextLevel ? Math.min(100, Math.max(0, ((safeSpent - min) / (nextMin - min)) * 100)) : 100;

  return (
    <div className="flip-container h-48 mb-6" onClick={() => { triggerHaptic(); setFlipped(!flipped); }}>
      <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
        <div className="flip-front ios-card p-5 relative bg-gradient-to-br from-[#1C1C1E] to-[#000]">
          <div className="absolute top-0 right-0 p-4 opacity-50"><MoreHorizontal className="w-5 h-5 text-gray-400"/></div>
          <div className="flex flex-col h-full justify-between">
            <div className='text-left'>
              <p className="text-[10px] uppercase tracking-widest text-[#0A84FF] font-bold mb-1">Thalyson Rewards</p>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">{currentLevel.name} {currentLevel.icon}</h3>
            </div>
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-gray-400">{privacyMode ? '••••' : formatCurrency(safeSpent)} investidos</span>
                <span className="text-xs font-bold text-[#32D74B]">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#32D74B] transition-all duration-1000" style={{ width: `${progress}%` }}/>
              </div>
              <div className="flex justify-between text-[9px] text-gray-500 font-medium tracking-wide mt-2">
                <span>Benefício: <span className="text-[#32D74B]">{currentLevel.perks[1]}</span></span>
                {nextLevel ? (<span>Faltam {formatCurrency(nextLevel.min - safeSpent)}</span>) : (<span className="text-[#FFD60A]">Nível Máximo</span>)}
              </div>
            </div>
          </div>
        </div>
        <div className="flip-back flex flex-col items-center justify-center p-5 relative bg-[#111]">
          <div className="absolute top-4 left-4 text-[10px] text-gray-500 uppercase font-bold">Seu ID de Membro</div>
          <div className="bg-white p-2 rounded-xl">
            <QrCode className="w-24 h-24 text-black"/>
          </div>
          <p className="text-gray-400 text-xs mt-3 font-mono tracking-widest">MEMBER-{data.savedName ? data.savedName.slice(0,3).toUpperCase() : 'GUEST'}-{Math.floor(Math.random()*999)}</p>
          <p className="text-[10px] text-[#0A84FF] mt-2 animate-pulse">Apresente para Check-in</p>
        </div>
      </div>
    </div>
  );
};

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
  const cr = REVIEWS_DB[idx];
  return (
    <div className="relative h-28 flex items-center justify-center mb-8">
      <div key={idx} className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in px-4 bg-[#1C1C1E] rounded-[24px] border border-white/5 shadow-xl">
        <div className="flex gap-1 mb-2">{[...Array(5)].map((_,k) => <Star key={k} className={`w-3.5 h-3.5 ${k < cr.r ? 'text-[#FFD60A] fill-[#FFD60A]' : 'text-gray-800'}`}/>)}</div>
        <p className="text-[13px] text-gray-200 text-center font-medium italic">"{cr.t}"</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase mt-2">- {cr.a}</p>
      </div>
    </div>
  );
};

// 🌟 SENIOR UX DATE SELECTOR (Scroll Horizontal + Chips)
const SmartDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const days = []; const now = new Date();
  for (let i = 0; i < 16; i++) { const d = new Date(now); d.setDate(now.getDate() + i); days.push(d); }

  const checkAvailability = (date, timeStr) => {
      const slotDate = new Date(date);
      const [h, m] = timeStr.split(':').map(Number);
      slotDate.setHours(h, m, 0, 0);
      const nowTime = new Date();
      // Calcula diferença em minutos
      const diffMinutes = (slotDate - nowTime) / (1000 * 60);
      // Regra: Bloqueia se faltar menos de 40 minutos para o horário
      return diffMinutes < 40; 
  };

  const getDayLabel = (d) => {
      const t = new Date(); const tm = new Date(t); tm.setDate(tm.getDate() + 1);
      d.setHours(0,0,0,0); t.setHours(0,0,0,0); tm.setHours(0,0,0,0);
      if (d.getTime() === t.getTime()) return 'HOJE';
      if (d.getTime() === tm.getTime()) return 'AMANHÃ';
      return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3);
  };

  return (
    <div className="w-full select-none">
      <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">Data & Horário</h4>
      
      {/* Scroll de Dias (Instagram Style) */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
        {days.map((d, i) => {
          const isSel = selectedDate?.getDate() === d.getDate() && selectedDate?.getMonth() === d.getMonth();
          return (
            <button key={i} onClick={() => { triggerHaptic(); onSelect(d, ''); }} 
                className={`flex flex-col items-center justify-center min-w-[72px] h-[84px] rounded-[20px] border transition-all duration-300
                ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-white/5 text-gray-400 hover:bg-[#2C2C2E]'}`}>
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">{getDayLabel(d)}</span>
              <span className="text-2xl font-bold tracking-tighter">{d.getDate()}</span>
            </button>
          )
        })}
      </div>

      {/* Grid de Horários */}
      {selectedDate && (
        <div className="animate-slide-up mt-2">
           <div className="grid grid-cols-4 gap-3">
               {timeSlots.map(t => {
                   const isBlocked = checkAvailability(selectedDate, t);
                   const isSelected = selectedTime === t;
                   return (
                      <button key={t} disabled={isBlocked} onClick={() => { triggerHaptic(); onSelect(selectedDate, t); }} 
                        className={`py-3 rounded-[14px] text-[13px] font-bold transition-all duration-200 
                        ${isSelected ? 'bg-white text-black shadow-lg scale-105' : isBlocked ? 'bg-white/5 text-gray-600 opacity-40 cursor-not-allowed' : 'bg-[#2C2C2E] text-gray-300 border border-white/5 hover:bg-[#3A3A3C]'}`}>
                        {t}
                      </button>
                   )
               })}
           </div>
           <div className="mt-4 flex items-center gap-2 text-gray-500 text-[11px] bg-[#1C1C1E] p-3 rounded-xl border border-white/5">
                <Clock className="w-3.5 h-3.5"/>
                <span>Horários disponíveis com mínimo de 40 min de antecedência.</span>
           </div>
        </div>
      )}
    </div>
  );
};

const CouponInventory = ({ inventory, appliedCoupon, onApply, onRemove, onAddManual, addToast }) => {
  const [manualCode, setManualCode] = useState('');
  const myCoupons = inventory.map((c) => SYSTEM_COUPONS[c]).filter(Boolean);

  const handleManualAdd = () => {
      const codeUpper = manualCode.toUpperCase().trim();
      if(codeUpper && SYSTEM_COUPONS[codeUpper]) {
          if (inventory.includes(codeUpper)) {
              addToast('Você já tem este cupom!', 'info');
          } else {
              onAddManual(codeUpper);
              setManualCode('');
              triggerHaptic();
              addToast('Cupom adicionado!', 'success');
          }
      } else {
          addToast('Cupom inválido ou expirado.', 'error');
      }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex justify-between items-center ml-1 mb-2"><h4 className="text-[12px] font-semibold text-gray-500 uppercase tracking-wide">Cupons & Descontos</h4></div>
      <div className="flex gap-2 mb-3">
          <input value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="Possui um código?" className="w-full custom-input text-white text-[15px] rounded-[14px] p-3.5 placeholder:text-gray-600 bg-[#1C1C1E]"/>
          <button onClick={handleManualAdd} className="bg-[#2C2C2E] border border-white/10 text-white px-5 rounded-[14px] font-bold text-[13px] hover:bg-[#3A3A3C] transition-colors">Adicionar</button>
      </div>
      {myCoupons.length > 0 ? (
        <div className="space-y-3">
          {myCoupons.map((coupon) => {
            const isApplied = appliedCoupon?.code === coupon.code;
            return (
              <button key={coupon.code} onClick={() => { triggerHaptic(); isApplied ? onRemove() : onApply(coupon.code); }} className={`w-full p-4 rounded-[16px] flex justify-between items-center transition-all duration-300 ${isApplied ? 'bg-[#0A84FF]/20 border border-[#0A84FF] shadow-lg' : 'bg-[#1C1C1E] border border-white/5'}`}>
                <div className="text-left"><div className="flex items-center gap-2"><span className="text-[10px] font-bold text-gray-300 bg-[#3A3A3C] px-1.5 py-0.5 rounded tracking-wider border border-white/10">{coupon.code}</span>{isApplied && <span className="text-[10px] text-[#0A84FF] font-bold animate-pulse">APLICADO</span>}</div><p className="text-[13px] text-gray-400 mt-1">{coupon.desc}</p></div>
                {isApplied ? <X className="w-5 h-5 text-gray-400" /> : <div className="w-5 h-5 rounded-full border border-gray-600"></div>}
              </button>
            )
          })}
        </div>
      ) : (
          <div className="p-4 rounded-[16px] border border-dashed border-white/10 text-center bg-white/5"><p className="text-[12px] text-gray-500">Nenhum cupom disponível.</p></div>
      )}
    </div>
  );
};

const OrderReceipt = ({ selection, priceFunc }) => {
  const finalPrice = priceFunc();
  return (
    <div className="mt-8 mx-2 mb-32 bg-white text-black rounded-[10px] p-6 font-mono text-sm shadow-2xl relative animate-slide-up transform rotate-1">
      <div className="absolute top-0 left-0 right-0 h-4 bg-white" style={{background: 'linear-gradient(45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%)', backgroundSize: '12px 20px', backgroundPosition: '0 -10px'}}></div>
      <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-4 mt-2"><h3 className="font-bold text-lg uppercase">Massagens Relaxantes</h3><p className="text-xs text-gray-500">Resumo do Pedido</p></div>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between"><span>{selection.service.name}</span><span>{formatCurrency(selection.service.basePrice)}</span></div>
        {selection.upgrade && <div className="flex justify-between text-gray-600 text-xs"><span>+ 30 Minutos</span><span>{formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span></div>}
        {selection.useTable && <div className="flex justify-between text-gray-600 text-xs"><span>+ Maca Portátil</span><span>{formatCurrency(CONFIG.PRICES.MACA)}</span></div>}
        {selection.aroma && <div className="flex justify-between text-gray-600 text-xs"><span>+ Aromaterapia</span><span>VIP</span></div>}
        {selection.location.fee > 0 && <div className="flex justify-between text-blue-600 font-bold border-t border-dashed border-gray-200 pt-2"><span>Taxa Local</span><span>{formatCurrency(selection.location.fee)}</span></div>}
        {selection.coupon && <div className="flex justify-between text-red-500"><span>Desconto ({selection.coupon.code})</span><span>APLICADO</span></div>}
      </div>
      <div className="border-t-2 border-black pt-4 flex justify-between items-end"><span className="font-bold text-xl">TOTAL</span><span className="font-bold text-2xl">{formatCurrency(finalPrice)}</span></div>
      <div className="mt-4 text-center text-[10px] text-gray-400">AGUARDANDO CONFIRMAÇÃO VIA WHATSAPP</div>
    </div>
  )
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showUpsell, setShowUpsell] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [manualCode, setManualCode] = useState('');
  
  // Refs
  const locationRef = useRef(null); const vibeRef = useRef(null); const extrasRef = useRef(null); const paymentRef = useRef(null); const homeRef = useRef(null); const receiptRef = useRef(null); const surfaceRef = useRef(null);

  const scrollTo = (ref) => { setTimeout(() => { ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 300); };
    
  // State
  const [loyalty, setLoyalty] = useState(() => SecureStorage.get('DATA') || { savedName: '', avatar: '😎', totalSpent: 0, totalSaved: 0, inventory: ['BEMVINDO'], notifications: [], history: [] });
  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  // ADDED ADDRESS STATE
  const [selection, setSelection] = useState({ 
      service: null, location: null, date: null, time: '', useTable: null, city: '', 
      address: { street: '', number: '', district: '', ref: '' },
      coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 
  });
  const [showFaq, setShowFaq] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(true); 
  const [weatherHint, setWeatherHint] = useState("");
  const [lastOrderLink, setLastOrderLink] = useState(""); 
    
  // Init
  useEffect(() => { document.title = "Massagens Relaxantes"; setTimeout(() => setLoading(false), 2000); }, []);
  useEffect(() => { SecureStorage.set('DATA', loyalty); if (loyalty.savedName) { setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true})); } }, [loyalty]);
  useEffect(() => { const hr = new Date().getHours(); setWeatherHint(hr < 18 ? "☀️ Dia ideal para relaxar" : "🌙 Noite perfeita para relaxar"); }, []);
  useEffect(() => { if (selection.location?.allowsTableChoice && step === 'configure') { setTimeout(() => surfaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); } }, [selection.location, step]);
  useEffect(() => { if (step === 'home') { homeRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); } }, [step]);

  const addToast = (msg, type = 'info') => {
    const id = Date.now(); setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleQuickSchedule = () => { triggerHaptic(); loyalty.savedName ? setStep('services') : setStep('identity'); };
  const handlePanic = () => { window.location.href = "https://google.com"; };
  const handleShare = () => { if(navigator.share) navigator.share({title:'Thalyson Massagens', text:'Massagens Relaxantes em Santa Fé do Sul', url: window.location.href}); };
  const handleAddManualCoupon = (code) => { if (!loyalty.inventory.includes(code)) { setLoyalty(prev => ({...prev, inventory: [...prev.inventory, code]})); }};
  
  const handleReset = () => {
    setSelection({ service: null, location: null, date: null, time: '', useTable: null, city: '', address: { street: '', number: '', district: '', ref: '' }, coupon: null, upgrade: false, music: null, aroma: false, paymentMethod: null, installments: 1 });
    setStep('home');
  };

  const handleLogoClick = () => {
    setAdminClicks(c => c + 1);
    if(adminClicks + 1 === 5) { setIsAdmin(true); addToast("Painel Admin Ativado 🕵️‍♂️", "success"); setAdminClicks(0); }
  };

  // Pricing
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

  const canFinalize = selection.service && selection.location && selection.date && selection.time && selection.music && selection.paymentMethod && 
                      (selection.location.allowsTableChoice ? selection.useTable !== null : true) && 
                      (selection.location.id === 'outras-cidades' ? !!selection.city : true) &&
                      (selection.location.requiresAddress ? (selection.address.street && selection.address.number && selection.address.district) : true);

  const handlePreFinalize = () => {
    if (!canFinalize) { addToast("Preencha todos os campos obrigatórios (incluindo endereço).", "error"); return; }
    if (selection.coupon && !loyalty.inventory.includes(selection.coupon.code)) { addToast("Cupom inválido.", "error"); setSelection(prev => ({ ...prev, coupon: null })); return; }
    
    if (!selection.upgrade && !selection.aroma) {
        setShowUpsell(true);
    } else {
        handleWhatsApp();
    }
  };

  const handleWhatsApp = (acceptedUpsell = false) => {
    triggerHaptic();
    let currentSelection = { ...selection };
    if (acceptedUpsell) {
        currentSelection.aroma = true;
        setSelection(currentSelection);
    }

    let serviceValueForLoyalty = currentSelection.service.basePrice;
    let extrasText = "";
    
    if (currentSelection.upgrade) { 
        const upgradePrice = currentSelection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
        serviceValueForLoyalty += upgradePrice; extrasText += `\n➕ +30 Minutos (+${formatCurrency(upgradePrice)})`; 
    }
    if (currentSelection.useTable) { 
        serviceValueForLoyalty += CONFIG.PRICES.MACA; extrasText += `\n➕ Maca Portátil (+${formatCurrency(CONFIG.PRICES.MACA)})`; 
    }
    
    let aromaPrice = 0; let aromaText = "";
    if (currentSelection.aroma) {
        aromaPrice = getAromaPrice();
        serviceValueForLoyalty += aromaPrice;
        aromaText = `\n➕ Aromaterapia (${aromaPrice === 0 ? 'GRÁTIS VIP' : `+${formatCurrency(aromaPrice)}`})`;
    }

    let feeVal = currentSelection.location.fee || 0;
    let feeType = currentSelection.location.isMotel ? "🏨 Taxa Motel (Suíte)" : currentSelection.location.isUber ? "🚗 Taxa Uber" : "";
    if(currentSelection.location.isPending) { feeType = "Taxa Deslocamento (A Combinar)"; feeVal = 0; }

    let discountVal = 0;
    if (currentSelection.coupon) {
      if (currentSelection.coupon.type === 'percent') { discountVal = serviceValueForLoyalty * (currentSelection.coupon.value / 100); } 
      else { discountVal = currentSelection.coupon.value; }
    }

    const baseTotal = serviceValueForLoyalty + feeVal - discountVal;
    let finalPrice = baseTotal;
    if (currentSelection.paymentMethod === 'credit_card') {
       const rate = CARD_RATES[currentSelection.installments] || 0;
       finalPrice = baseTotal / (1 - rate);
    }

    const bookingId = generateBookingId(); 
    let newInventory = [...loyalty.inventory];
    if (currentSelection.coupon) { newInventory = newInventory.filter(c => c !== currentSelection.coupon.code); }

    const oldTotal = loyalty.totalSpent || 0;
    const newTotal = oldTotal + serviceValueForLoyalty; 
    let newNotifications = [...loyalty.notifications];
    newNotifications.unshift({ id: Date.now(), title: 'Agendamento Confirmado', message: `Sua sessão para ${currentSelection.date.toLocaleDateString('pt-BR')} foi confirmada.`, read: false, timestamp: Date.now(), icon: 'calendar' });

    const levelReached = [...LEVELS].reverse().find(l => newTotal >= l.min);
    const oldLevel = [...LEVELS].reverse().find(l => oldTotal >= l.min);
    if(levelReached && (!oldLevel || levelReached.name !== oldLevel.name)) {
       newNotifications.unshift({ id: Date.now() + 1, title: 'Nível VIP Alcançado!', message: `Você chegou no ${levelReached.name}!`, read: false, timestamp: Date.now(), icon: 'level' });
       if(levelReached.rewardCode && !newInventory.includes(levelReached.rewardCode)) {
           newInventory.push(levelReached.rewardCode);
           newNotifications.unshift({ id: Date.now() + 2, title: 'Ganhou Cupom!', message: `Cupom ${levelReached.rewardCode} adicionado.`, read: false, timestamp: Date.now(), icon: 'coupon' });
       }
    }

    setLoyalty(prev => ({ ...prev, savedName: user.name || prev.savedName, totalSpent: newTotal, totalSaved: (prev.totalSaved || 0) + (currentSelection.coupon ? 10 : 0), inventory: newInventory, notifications: newNotifications }));

    const isToday = currentSelection.date.getDate() === new Date().getDate();
    const dateStr = `${currentSelection.date.toLocaleDateString('pt-BR')}${isToday ? ' (HOJE)' : ''}`;
    
    let locationString = currentSelection.location.label;
    if(currentSelection.location.isMotel) locationString += " (Vou com você)";
    if(currentSelection.location.id === 'outras-cidades' && currentSelection.city) locationString += ` (${currentSelection.city})`;

    // Construção do endereço no texto
    let addressBlock = "";
    if (currentSelection.location.requiresAddress) {
        addressBlock = `\n📍 *ENDEREÇO CLIENTE:*\nRua: ${currentSelection.address.street}, ${currentSelection.address.number}\nBairro: ${currentSelection.address.district}\nRef: ${currentSelection.address.ref || 'Sem referência'}`;
    }

    let priceDisplay = "";
    if (feeVal > 0) {
        priceDisplay = `💆 Valor Sessão: ${formatCurrency(serviceValueForLoyalty - discountVal)}\n${feeType}: ${formatCurrency(feeVal)}\n💰 *TOTAL FINAL: ${formatCurrency(finalPrice)}*`;
    } else {
        priceDisplay = `💰 *TOTAL CLIENTE: ${currentSelection.location.isPending ? formatCurrency(finalPrice) + ' + Taxa' : formatCurrency(finalPrice)}*`;
    }

    let msg = `*NOVO PEDIDO: #${bookingId}*
👤 ${user.name} (Liberado p/ Massagem)
📅 ${dateStr} às ${currentSelection.time}
💆 ${currentSelection.service.name} ${currentSelection.upgrade ? '*(+30 MIN UPGRADE)*' : ''}
📍 ${locationString}${addressBlock}

*DETALHES:*
• Serviço Base: ${formatCurrency(currentSelection.service.basePrice)}${extrasText}${aromaText}
${discountVal > 0 ? `• Desconto (${currentSelection.coupon.code}): -${formatCurrency(discountVal)}` : ''}

------------------------------
${priceDisplay}
(Pagamento: ${currentSelection.paymentMethod === 'credit_card' ? `${currentSelection.installments}x Cartão` : currentSelection.paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'})
------------------------------
🎵 Vibe: ${currentSelection.music}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`;
    setLastOrderLink(whatsappUrl); window.open(whatsappUrl, '_blank');
    setStep('success'); setShowUpsell(false);
  };

  // --- RENDERS ---

  return (
    <div className="min-h-screen flex justify-center bg-black text-gray-200 font-sans" onClick={() => { if(showMenu) setShowMenu(false); }}>
      <style>{globalStyles}</style>
      <div className="toast-container">{toasts.map(t => (<div key={t.id} className={`toast ${t.type}`}>{t.type === 'error' ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>} {t.msg}</div>))}</div>

      {loading ? (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center animate-fade-in">
          <div className="relative w-16 h-16 mb-8"><div className="absolute inset-0 rounded-full border-4 border-[#0A84FF]/20"></div><div className="absolute inset-0 rounded-full border-4 border-t-[#0A84FF] animate-spin-slow"></div></div>
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#0A84FF] animate-pulse uppercase">Carregando</span>
        </div>
      ) : (
      <div className="w-full max-w-[440px] bg-[#000] sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden sm:border border-white/10 h-screen sm:h-[92vh] aurora-bg">
        
        <GlobalHeader />

        {/* --- HOME --- */}
        {step === 'home' && (
          <div className="flex-1 p-6 overflow-y-auto pb-32 pt-32" ref={homeRef}>
            <div className="mb-8"><h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-2">Massagens Relaxantes<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A84FF] to-[#5AC8FA] text-2xl">em Santa Fé do Sul e Região</span></h1></div>
            <LoyaltyFlipCard data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            <LiveStatus />
            <div className="mb-3 px-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest">Resumo das Sessões</div>
            <ReviewsCarousel />
            <div className="mt-4"><button onClick={handleQuickSchedule} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] shadow-lg flex justify-center items-center gap-2 text-[17px]">Agendar Sessão <ArrowRight className="w-5 h-5" /></button></div>
            {isAdmin && <div className="mt-4 p-3 bg-red-900/20 text-red-500 text-xs text-center border border-red-900 rounded-xl">Painel Admin Ativo</div>}
          </div>
        )}

        {/* --- IDENTITY --- */}
        {step === 'identity' && (
          <div className="flex-1 p-6 pt-36 animate-fade-in flex flex-col h-full pb-32">
            <h2 className="text-3xl font-bold text-white mb-2">Quem é você?</h2>
            <p className="text-gray-400 text-[15px] mb-8">Para manter a segurança e exclusividade.</p>
            <div className="space-y-6 flex-1">
              <div className="ios-card p-6 rounded-[24px]">
                <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider block mb-2">Seu Nome</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent text-white text-[22px] font-medium placeholder:text-gray-600 border-b border-white/10 py-2 focus:border-[#0A84FF] transition-colors" placeholder="Digite seu nome..." />
              </div>
              <div className="space-y-3">
                <button onClick={() => { triggerHaptic(); setUser({...user, isAdult: !user.isAdult}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isAdult && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[16px] font-medium ${user.isAdult ? 'text-white' : 'text-gray-400'}`}>Maior de 18 anos</span>
                </button>
                <button onClick={() => { triggerHaptic(); setUser({...user, isMassagemOk: !user.isMassagemOk}); }} className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user.isMassagemOk ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user.isMassagemOk ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{user.isMassagemOk && <Check className="w-3.5 h-3.5 text-white" />}</div>
                  <span className={`text-[16px] font-medium ${user.isMassagemOk ? 'text-white' : 'text-gray-400'}`}>Liberado para massagem</span>
                </button>
              </div>
              <button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={() => { triggerHaptic(); setStep('services'); }} className="w-full ios-btn-primary font-bold py-4 rounded-[22px] text-[17px] disabled:opacity-50 shadow-lg mt-4">Continuar</button>
            </div>
          </div>
        )}

        {/* --- SERVICES --- */}
        {step === 'services' && (
          <div className="flex-1 p-6 pt-36 overflow-y-auto pb-32 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Menu</h2>
            <div className="space-y-6">
              {services.map(s => (
                <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setStep('configure'); }} className={`ios-card p-6 rounded-[30px] active:scale-98 transition-transform group relative overflow-hidden`}>
                  {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-[20px]">{s.highlight}</div>}
                  <div className="mb-4">
                    <h3 className="font-bold text-white text-[22px] leading-tight mb-1">{s.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-[#0A84FF] font-bold text-[18px]">{formatCurrency(s.basePrice)}</span>
                        <span className="text-gray-500 text-[13px]">• {s.labelDuration}</span>
                    </div>
                  </div>
                  <p className="text-[15px] text-gray-300 leading-relaxed mb-5 opacity-90">{s.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {s.details.slice(0,4).map((d, idx) => (<div key={idx} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg"><div className="w-1 h-1 rounded-full bg-[#0A84FF]"></div> <span className="text-[11px] text-gray-300 font-medium">{d}</span></div>))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONFIGURE --- */}
        {step === 'configure' && selection.service && (
          <div className="flex-1 p-6 pt-36 overflow-y-auto pb-64 animate-fade-in scrollbar-hide"> 
            <div className="ios-card p-5 rounded-[22px] mb-8 flex items-center justify-between border-l-4 border-l-[#0A84FF]">
              <div><h3 className="font-bold text-white text-[17px]">{selection.service.name}</h3><p className="text-[13px] text-gray-400 mt-0.5">Configuração Personalizada</p></div>
            </div>

            <div className="space-y-10">
              <section>
                <SmartDateSelector selectedDate={selection.date} selectedTime={selection.time} onSelect={(d, t) => { setSelection({...selection, date: d, time: t}); if(t) scrollTo(locationRef); }} />
              </section>

              <section ref={locationRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Local de Atendimento</h4>
                <div className="space-y-3">
                  {locations.map(l => {
                    if (selection.location && selection.location.id !== l.id) return null;
                    return (
                    <div key={l.id} className="animate-fade-in">
                        <button onClick={() => { triggerHaptic(); setSelection({...selection, location: l, useTable: null}); scrollTo(vibeRef); }} className={`w-full p-5 rounded-[22px] border text-left transition-all duration-300 ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                          <div className="flex justify-between items-center mb-1"><span className="font-semibold text-white text-[16px]">{l.label}</span> {l.fee > 0 && <span className="text-[10px] font-bold text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-1 rounded border border-[#FFD60A]/20">+ {formatCurrency(l.fee)}</span>}</div>
                          <p className="text-[13px] text-gray-500">{l.sublabel}</p>
                        </button>
                        
                        {selection.location?.id === l.id && l.requiresAddress && (
                            <div className="mt-3 space-y-3 animate-fade-in p-4 rounded-[20px] bg-[#1C1C1E] border border-white/5">
                                <h5 className="text-[11px] font-bold text-gray-500 uppercase flex items-center gap-2"><MapPin size={12}/> Endereço Completo</h5>
                                <input value={selection.address.street} onChange={e => setSelection(p => ({...p, address: {...p.address, street: e.target.value}}))} placeholder="Nome da Rua" className="w-full custom-input p-3 rounded-[12px] text-sm"/>
                                <div className="flex gap-2">
                                    <input value={selection.address.number} onChange={e => setSelection(p => ({...p, address: {...p.address, number: e.target.value}}))} placeholder="Número" className="w-1/3 custom-input p-3 rounded-[12px] text-sm"/>
                                    <input value={selection.address.district} onChange={e => setSelection(p => ({...p, address: {...p.address, district: e.target.value}}))} placeholder="Bairro" className="w-2/3 custom-input p-3 rounded-[12px] text-sm"/>
                                </div>
                                <input value={selection.address.ref} onChange={e => setSelection(p => ({...p, address: {...p.address, ref: e.target.value}}))} placeholder="Ponto de Referência (Opcional)" className="w-full custom-input p-3 rounded-[12px] text-sm"/>
                                
                                {l.allowsTableChoice && (
                                  <div ref={surfaceRef} className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                                    <button onClick={() => { setSelection({...selection, useTable: false}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === false ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#2C2C2E] border-transparent text-gray-400'}`}>🛏 Na Cama</button>
                                    <button onClick={() => { setSelection({...selection, useTable: true}); scrollTo(vibeRef); }} className={`p-4 rounded-[18px] border text-[13px] font-bold transition-all ${selection.useTable === true ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#2C2C2E] border-transparent text-gray-400'}`}>💆‍♂️ Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                                  </div>
                                )}
                            </div>
                        )}

                        {selection.location?.id === l.id && l.id === 'outras-cidades' && (
                            <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Digite o nome da cidade..." className="mt-3 w-full bg-[#1C1C1E] p-4 rounded-[18px] border border-white/10 text-white placeholder:text-gray-600 focus:border-[#0A84FF] transition-all animate-fade-in" />
                        )}
                        {selection.location && (
                           <button onClick={() => setSelection({...selection, location: null, useTable: null, city: '', address: {street:'', number:'', district:'', ref:''}})} className="mt-3 w-full py-2 text-[12px] text-gray-500 underline">Alterar Local</button>
                        )}
                    </div>
                  )})}
                </div>
              </section>

              <div ref={vibeRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Vibe Sonora</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                   {musicVibes.map(vibe => (
                      <button key={vibe} onClick={() => { setSelection({...selection, music: vibe}); scrollTo(extrasRef); }} className={`px-6 py-3 rounded-[14px] border text-[13px] font-bold whitespace-nowrap flex-shrink-0 transition-all duration-300 ${selection.music === vibe ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-transparent text-gray-400'}`}>
                        {vibe}
                      </button>
                   ))}
                </div>
              </div>

              <div className="space-y-3" ref={extrasRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 mt-8">Extras Premium</h4>
                <button onClick={() => { triggerHaptic(); setSelection({...selection, upgrade: !selection.upgrade}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">+30 Minutos</p><p className="text-[11px] text-gray-500">Mais tempo para curtir</p></div>
                  <span className="text-[#0A84FF] font-bold text-[15px]">+ {formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                </button>

                <button onClick={() => { triggerHaptic(); setSelection({...selection, aroma: !selection.aroma}); }} className={`w-full p-4 rounded-[20px] border flex justify-between items-center transition-all ${selection.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                  <div className="text-left"><p className="text-white font-bold text-[15px]">Aromaterapia</p><p className="text-[11px] text-gray-500">Óleos essenciais</p></div>
                  <div className="text-right">
                      {getAromaPrice() < CONFIG.PRICES.AROMA_FULL ? (
                          <><span className="text-gray-500 line-through text-[11px] mr-2">{formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span><span className="text-[#30D158] font-bold text-[15px]">{getAromaPrice() === 0 ? 'GRÁTIS' : `+${formatCurrency(getAromaPrice())}`}</span></>
                      ) : (<span className="text-[#0A84FF] font-bold text-[15px]">+ {formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span>)}
                  </div>
                </button>
              </div>

              <CouponInventory inventory={loyalty.inventory} appliedCoupon={selection.coupon} onApply={(code) => { setSelection({...selection, coupon: SYSTEM_COUPONS[code]}); scrollTo(paymentRef); }} onRemove={() => setSelection({...selection, coupon: null})} onAddManual={handleAddManualCoupon} addToast={addToast}/>

              <div className="mt-6" ref={paymentRef}>
                <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pagamento</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'pix' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <QrCode className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Pix</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'cash' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <Banknote className="w-6 h-6 text-[#30D158]" /><span className="text-[13px] font-bold text-white">Dinheiro</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'debit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'debit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-[#0A84FF]" /><span className="text-[13px] font-bold text-white">Débito</span>
                  </button>
                  <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`h-24 rounded-[18px] border flex flex-col items-center justify-center gap-2 transition-all ${selection.paymentMethod === 'credit_card' ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
                    <CreditCard className="w-6 h-6 text-[#FFD60A]" /><span className="text-[13px] font-bold text-white">Crédito</span>
                  </button>
                </div>
                
                {selection.paymentMethod === 'credit_card' && (
                  <div className="mt-3 ios-card p-4 rounded-[16px] animate-fade-in">
                    <label className="text-[11px] text-gray-400 block mb-2 font-bold uppercase">Parcelamento</label>
                    <select value={selection.installments} onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})} className="w-full bg-[#000] border border-white/10 text-white text-[15px] rounded-xl p-3 focus:border-[#0A84FF]">
                      {CARD_RATES.map((rate, i) => i > 0 && (<option key={i} value={i}>{i}x de {formatCurrency(calcFinalPrice()/i)}</option>))}
                    </select>
                  </div>
                )}
              </div>
              
              {canFinalize && <div ref={receiptRef}><OrderReceipt selection={selection} priceFunc={calcFinalPrice}/></div>}
            </div>
          </div>
        )}

        {/* FOOTER FIXO */}
        {step === 'configure' && selection.location && (
          <div className="absolute bottom-0 w-full p-0 z-40">
            <div className="h-12 bg-gradient-to-t from-[#000] to-transparent pointer-events-none"></div>
            <div className="bg-[#1C1C1E] rounded-t-[32px] p-5 border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
              <div className="flex justify-between items-center mb-4 px-1">
                  <div className="flex flex-col"><span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Total Final</span></div>
                  <div className="text-right">
                      <span className="text-[26px] font-bold text-white tracking-tight">
                        {selection.location.isPending ? formatCurrency(calcFinalPrice()) + ' + Taxa' : formatCurrency(calcFinalPrice())}
                      </span>
                      <p className="text-[10px] text-gray-500 leading-none mt-1">{selection.location.isMotel ? '(Inclui Taxa do Motel)' : selection.location.isUber ? '(Inclui Uber)' : selection.location.isPending ? '(Taxa de deslocamento à parte)' : 'Total Estimado'}</p>
                  </div>
              </div>
              <button onClick={handlePreFinalize} className="w-full bg-[#0A84FF] hover:bg-[#007AFF] active:scale-[0.98] transition-all text-white font-bold py-4 rounded-[18px] shadow-[0_4px_20px_rgba(10,132,255,0.4)] flex justify-center items-center gap-2 text-[16px]">CONFIRMAR NO WHATSAPP</button>
            </div>
          </div>
        )}

        {/* TELA SUCESSO */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in pb-32">
            <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.4)] animate-scale"><Check className="w-10 h-10 text-white stroke-[3px]"/></div>
            <h2 className="text-3xl font-bold text-white mb-2">Pedido Enviado!</h2>
            <p className="text-gray-400 mb-8 text-[15px]">Verifique seu WhatsApp.</p>
            <div className="w-full mb-8 bg-[#1C1C1E] p-4 rounded-[20px] border border-white/10 text-left">
                <LevelProgressBar data={loyalty} privacyMode={privacyMode} onTogglePrivacy={() => { triggerHaptic(); setPrivacyMode(!privacyMode); }} />
            </div>
            <div className="w-full space-y-3 mb-4">
                <a href={generateCalendarLink(selection.service.name, selection.date, selection.time)} target="_blank" className="w-full bg-[#1C1C1E] border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-300 hover:bg-[#2C2C2E]"><Calendar className="w-4 h-4 text-blue-500"/> Adicionar à Agenda</a>
            </div>
            <button onClick={() => window.open(lastOrderLink, '_blank')} className="mb-4 w-full flex items-center justify-center gap-2 text-[15px] font-bold text-[#0A84FF] bg-[#0A84FF]/10 py-3.5 rounded-xl border border-[#0A84FF]/20 hover:bg-[#0A84FF]/20 transition-colors"><Send className="w-4 h-4"/> Reenviar Mensagem</button>
            <button onClick={handleReset} className="w-full py-4 text-gray-500 text-[14px] font-medium">Voltar ao Início</button>
          </div>
        )}

        {/* UPSELL MODAL */}
        {showUpsell && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
              <div className="bg-[#1C1C1E] w-full max-w-sm rounded-3xl p-6 border border-yellow-500/30 shadow-2xl relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"/>
                <div className="flex justify-center mb-4"><Flame className="w-12 h-12 text-orange-500 fill-orange-500 animate-pulse"/></div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Oferta Especial!</h3>
                <p className="text-gray-400 text-center text-sm mb-6">Adicione <b>Aromaterapia</b> agora com desconto exclusivo?</p>
                <div className="space-y-3">
                  <button onClick={() => handleWhatsApp(true)} className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-black flex justify-center items-center gap-2"><Sparkles className="w-4 h-4"/> SIM, EU QUERO</button>
                  <button onClick={() => handleWhatsApp(false)} className="w-full py-3 text-gray-500 text-sm font-medium hover:text-white">Não, obrigado</button>
                </div>
              </div>
            </div>
        )}

        {/* FAQ MODAL */}
        {showFaq && (
          <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-center justify-center p-5">
            <div className="bg-[#1C1C1E] w-full max-w-sm rounded-[32px] p-8 border border-white/10 shadow-2xl animate-scale">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><HelpCircle className="w-6 h-6 text-[#0A84FF]"/> Ajuda & Informações</h3>
              <div className="space-y-5 text-[15px] text-gray-300 leading-relaxed">
                <div><h4 className="font-bold text-white mb-1 flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400"/> Conduta</h4><p className="text-sm">Apenas massagem terapêutica e relaxante. Sem sexo, sem oral. Respeito acima de tudo.</p></div>
                <div><h4 className="font-bold text-white mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400"/> Locais</h4><p className="text-sm">Atendimento em Suítes (Motel), Domicílio (Santa Fé) ou Cidades Vizinhas (a combinar).</p></div>
                <div><h4 className="font-bold text-white mb-1 flex items-center gap-2"><Tag className="w-4 h-4 text-gray-400"/> Cupons & Descontos</h4><p className="text-sm">Cupons são de uso único. Descontos de nível (Aromaterapia) são aplicados automaticamente.</p></div>
                <div className="pt-6 border-t border-white/10">
                    <p className="text-xs text-gray-500 mb-3">⚠️APP BETA 
                      ⚠️Atenção: Limpar dados apagará seu progresso e nível.</p>
                    <button onClick={() => { if(window.confirm("Tem certeza? Você perderá todo o seu progresso e nível VIP.")) { SecureStorage.clear(); window.location.reload(); }}} className="w-full py-3 rounded-xl bg-red-500/10 text-red-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4"/> Limpar Dados do App</button>
                </div>
              </div>
              <button onClick={() => setShowFaq(false)} className="mt-6 w-full bg-[#3A3A3C] text-white py-4 rounded-[18px] font-bold hover:bg-[#4A4A4C] transition-colors">Fechar</button>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS MODAL */}
        {showNotifications && (
          <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-5" onClick={() => setShowNotifications(false)}>
            <div className="bg-[#1C1C1E] w-full sm:max-w-sm rounded-t-[32px] sm:rounded-[32px] p-6 border-t sm:border border-white/10 shadow-2xl animate-slide-up h-[75vh] sm:h-[600px] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">Notificações</h3>
                  <button onClick={() => { setLoyalty(p => ({...p, notifications: p.notifications.map(n => ({...n, read: true}))})); setShowNotifications(false); }} className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-3 overflow-y-auto flex-1 scrollbar-hide">
                {loyalty.notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500"><Bell className="w-12 h-12 mb-4 opacity-20"/><p>Nenhuma notificação recente.</p></div>
                ) : (
                    loyalty.notifications.map(n => (
                        <div key={n.id} className="p-4 rounded-[20px] bg-[#2C2C2E] border border-white/5 flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.icon === 'level' ? 'bg-[#FFD60A]/20 text-[#FFD60A]' : n.icon === 'coupon' ? 'bg-[#FF375F]/20 text-[#FF375F]' : 'bg-[#0A84FF]/20 text-[#0A84FF]'}`}>
                                {n.icon === 'calendar' ? <Calendar className="w-5 h-5"/> : n.icon === 'level' ? <Crown className="w-5 h-5"/> : n.icon === 'coupon' ? <Tag className="w-5 h-5"/> : <CheckCircle2 className="w-5 h-5"/>}
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
      <InstallPrompt />
    </div>
  );
}
