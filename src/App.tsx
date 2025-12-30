import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft, Check, X, MapPin, Calendar, Clock,
  Shield, Star, Zap, Bell, ArrowRight, Eye, EyeOff,
  LogOut, CreditCard, Banknote, QrCode, 
  Info, Send, Menu, Flame, Lock, User, 
  ChevronRight, Sparkles, Map, Phone, Gift,
  Crown,  TrendingUp, Activity, ThumbsUp, AlertCircle
} from 'lucide-react';

// ==================================================================================
// 1. ARQUITETURA DE DADOS & MARKETING (SENIOR LEVEL)
// ==================================================================================

const CONFIG = {
  APP_VERSION: "3.0.0-Titanium",
  WHATSAPP: "5517991360413",
  THEME: {
    bg: "#050505", // Ultra Dark
    surface: "#121212", 
    surfaceHighlight: "#1E1E1E",
    primary: "#0A84FF", // iOS Blue
    gold: "#FFD700", // VIP Gold
    success: "#30D158",
    danger: "#FF453A",
    text: "#FFFFFF",
    subtext: "#8E8E93"
  }
};

// Gamificação: Sistema de Níveis baseado em Gasto (Lógica de Retenção)
const LOYALTY_LEVELS = [
  { id: 'bronze', name: 'Membro', min: 0, icon: <User className="w-4 h-4"/>, perk: 'Acesso Básico' },
  { id: 'prata', name: 'VIP Prata', min: 350, icon: <Star className="w-4 h-4 text-gray-300"/>, perk: 'Aroma Grátis' },
  { id: 'ouro', name: 'VIP Ouro', min: 800, icon: <Crown className="w-4 h-4 text-[#FFD700]"/>, perk: 'Desconto de 5%' },
  { id: 'diamante', name: 'Diamond', min: 1500, icon: <Sparkles className="w-4 h-4 text-blue-400"/>, perk: 'Prioridade Total + 10% OFF' }
];

const SERVICES = [
  { 
    id: 'masculina', 
    name: 'Tântrica Masculina', 
    type: 'premium',
    duration: '60 min', 
    basePrice: 150, 
    badge: 'MAIS VENDIDA 🔥',
    description: 'A união perfeita entre o toque terapêutico e a energia sensorial. Inclui relaxamento muscular profundo e finalização manual técnica.',
    benefits: ['Alívio de Tensão', 'Controle da Ejaculação', 'Potência', 'Sigilo Absoluto'],
    upgrades: ['Prostática', 'Body-to-Body']
  },
  { 
    id: 'relaxante', 
    name: 'Relaxante Deep Tissue', 
    type: 'standard',
    duration: '50 min', 
    basePrice: 100, 
    badge: null,
    description: 'Terapia manual focada na remoção de nódulos de tensão (stress). Costas, ombros, pernas e pescoço. Sem toques íntimos.',
    benefits: ['Zero Stress', 'Dores nas Costas', 'Insônia', 'Cansaço Físico'],
    upgrades: ['Pedras Quentes', 'Ventosaterapia']
  },
  { 
    id: 'dual', 
    name: 'Experiência Dual (Interativa)', 
    type: 'exclusive',
    duration: '90 min', 
    basePrice: 250, 
    badge: 'NOVIDADE VIP 👑',
    description: 'Quebre a barreira passiva. Nesta sessão, você recebe a massagem e também pode interagir com o terapeuta. Troca de energia intensa.',
    benefits: ['Interatividade', 'Conexão Real', 'Tempo Estendido', 'Liberdade Sensorial'],
    upgrades: ['Banho Premium', 'Óleos Aquecidos']
  }
];

const LOCATIONS = [
  { id: 'santa-fe', label: 'Domicílio / Hotel', sub: 'Vou até você (Santa Fé)', fee: 40, icon: <MapPin className="w-5 h-5"/>, type: 'uber' },
  { id: 'motel', label: 'Suíte (Motel)', sub: 'Encontro discreto', fee: 0, icon: <Lock className="w-5 h-5"/>, type: 'motel' },
  { id: 'outras', label: 'Região', sub: 'Cidades Vizinhas', fee: 0, icon: <Map className="w-5 h-5"/>, type: 'negotiate' }
];

const REVIEWS_DATABASE = [
  { text: "Discrição impecável. Sou casado e me senti 100% seguro.", author: "Anônimo (42 anos)", stars: 5 },
  { text: "A técnica manual é outro nível. O final foi explosivo.", author: "M.S. (Jales)", stars: 5 },
  { text: "Ambiente do motel facilitou. Ele é muito profissional.", author: "Curioso", stars: 5 },
  { text: "Melhor investimento da semana. Saí leve.", author: "Empresário", stars: 5 },
  { text: "Gostei da massagem relaxante, tirou minha dor nas costas.", author: "Pedro", stars: 4 }
];

// ==================================================================================
// 2. CSS ENGINE (Motion Design System)
// ==================================================================================

const globalStyles = `
  :root { --app-bg: #000000; --card-bg: #1C1C1E; --primary: #0A84FF; }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
  body { background-color: var(--app-bg); color: #fff; overscroll-behavior-y: none; user-select: none; padding-bottom: env(safe-area-inset-bottom); }
  
  /* --- UI COMPONENTS --- */
  .ios-card {
    background: rgba(28, 28, 30, 0.65);
    backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
  }
  
  .ios-btn-active { transform: scale(0.96); opacity: 0.9; transition: 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); }
  
  .glass-nav {
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.1);
  }

  .premium-gradient { background: linear-gradient(135deg, #0A84FF 0%, #0056b3 100%); }
  .gold-gradient { background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%); }
  
  /* --- ANIMATIONS --- */
  @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .animate-enter { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  @keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }
  .status-pulse { animation: pulse-glow 2s infinite; }

  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .animate-marquee { display: flex; animation: marquee 20s linear infinite; }

  .hide-scroll::-webkit-scrollbar { display: none; }
  .blur-secret { filter: blur(8px); transition: 0.3s; }
  .blur-secret:hover { filter: blur(0px); }
`;

// ==================================================================================
// 3. LOGIC HOOKS & UTILS
// ==================================================================================

const useHaptic = () => (pattern = 10) => { if (navigator.vibrate) navigator.vibrate(pattern); };
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

// Algoritmo de Data Inteligente (Mostra próximos 14 dias, pula domingos se quiser)
const getSmartDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

// ==================================================================================
// 4. COMPONENTES COMPLEXOS (SENIOR UI)
// ==================================================================================

// --- BOTÃO DE PÂNICO DISCRETO ---
const PanicButton = () => (
  <button 
    onClick={() => window.location.href = "https://www.google.com/search?q=previsão+do+tempo"}
    className="fixed top-4 right-4 z-[999] w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 opacity-60 hover:opacity-100 transition-all"
    title="Sair Imediatamente"
  >
    <LogOut className="w-4 h-4" />
  </button>
);

// --- HEADER COM PROGRESSO DE FIDELIDADE ---
const HeaderProfile = ({ user, level, totalSpent, privacy }) => {
  const nextLevel = LOYALTY_LEVELS.find(l => l.min > totalSpent) || LOYALTY_LEVELS[LOYALTY_LEVELS.length - 1];
  const progress = Math.min(100, (totalSpent / (nextLevel.min || (totalSpent + 100))) * 100);

  return (
    <div className="pt-14 pb-6 px-5 bg-gradient-to-b from-blue-900/20 to-transparent">
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{privacy ? 'Olá, Visitante' : `Olá, ${user.name || 'Cliente'}`}</p>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            {level.name} 
            {level.id === 'ouro' || level.id === 'diamante' ? <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400"/> : level.icon}
          </h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400 uppercase">Investido</p>
          <p className={`text-lg font-mono font-bold text-white ${privacy ? 'blur-secret' : ''}`}>{formatBRL(totalSpent)}</p>
        </div>
      </div>
      
      {/* Barra de XP */}
      <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-1000" style={{width: `${progress}%`}}></div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-medium">
        <span>{level.perk}</span>
        <span>Próximo: {nextLevel.name}</span>
      </div>
    </div>
  );
};

// --- CARROSSEL DE REVIEWS (MARQUEE INFINITO) ---
const ReviewMarquee = () => (
  <div className="w-full overflow-hidden py-6 border-y border-white/5 bg-[#0a0a0a]">
    <div className="animate-marquee gap-4 px-4 w-max">
      {[...REVIEWS_DATABASE, ...REVIEWS_DATABASE].map((r, i) => (
        <div key={i} className="w-[280px] bg-[#1C1C1E] p-4 rounded-xl border border-white/5 flex flex-col gap-2">
          <div className="flex text-yellow-500 gap-0.5">
            {[...Array(5)].map((_, k) => <Star key={k} className={`w-3 h-3 ${k < r.stars ? 'fill-current' : 'text-gray-700'}`}/>)}
          </div>
          <p className="text-xs text-gray-300 italic leading-relaxed">"{r.text}"</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase mt-auto">- {r.author}</p>
        </div>
      ))}
    </div>
  </div>
);

// ==================================================================================
// 5. APP CORE (STATE MACHINE)
// ==================================================================================

export default function App() {
  const vibrate = useHaptic();
  
  // --- GLOBAL STATE ---
  const [step, setStep] = useState('home'); // home, service, customize, checkout, success
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- USER DATA (PERSISTÊNCIA) ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('thaly_user_v3');
    return saved ? JSON.parse(saved) : { name: '', phone: '', totalSpent: 0, bookings: 0 };
  });

  useEffect(() => { localStorage.setItem('thaly_user_v3', JSON.stringify(user)); }, [user]);

  // --- CART STATE ---
  const [cart, setCart] = useState({
    service: null,
    location: null,
    date: null,
    time: null,
    upgrades: [],
    payment: null
  });

  // --- COMPUTED ---
  const currentLevel = LOYALTY_LEVELS.findLast(l => user.totalSpent >= l.min) || LOYALTY_LEVELS[0];
  
  const totalValue = useMemo(() => {
    let t = cart.service ? cart.service.basePrice : 0;
    if (cart.location?.fee) t += cart.location.fee;
    // Upgrades Logic
    if (cart.upgrades.includes('Body-to-Body')) t += 50;
    if (cart.upgrades.includes('Prostática')) t += 30;
    if (cart.upgrades.includes('Banho Premium')) t += 40;
    
    // Discounts
    if (currentLevel.id === 'ouro') t = t * 0.95;
    if (currentLevel.id === 'diamante') t = t * 0.90;
    
    return t;
  }, [cart, currentLevel]);

  // --- ACTIONS ---
  const handleServiceSelect = (s) => {
    vibrate();
    setCart({ ...cart, service: s, upgrades: [] });
    setStep('customize');
  };

  const finishBooking = () => {
    setLoading(true);
    setTimeout(() => {
      // Update User Stats
      setUser(prev => ({
        ...prev,
        totalSpent: prev.totalSpent + totalValue,
        bookings: prev.bookings + 1
      }));
      
      // WhatsApp Generator
      const msg = `*RESERVA CONFIRMADA - APP v3* 🔒
      
👤 *Cliente:* ${user.name} (${currentLevel.name})
💆‍♂️ *Serviço:* ${cart.service.name}
📍 *Local:* ${cart.location.label}
📅 *Data:* ${cart.date.toLocaleDateString('pt-BR')} às ${cart.time}
🚀 *Upgrades:* ${cart.upgrades.length ? cart.upgrades.join(', ') : 'Nenhum'}

💰 *VALOR FINAL:* ${formatBRL(totalValue)}
💳 *Pagamento:* ${cart.payment}

_Gerado via WebApp Seguro._`;

      window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
      setStep('success');
      setLoading(false);
    }, 1500);
  };

  // --- RENDERERS ---

  if (step === 'home') return (
    <div className="min-h-screen bg-black pb-24">
      <style>{globalStyles}</style>
      <PanicButton />
      
      <HeaderProfile user={user} level={currentLevel} totalSpent={user.totalSpent} privacy={privacy} />
      
      {/* IDENTITY INPUT (Se não tiver nome) */}
      {!user.name && (
        <div className="px-5 mb-6">
          <div className="ios-card p-4 rounded-2xl flex items-center gap-3">
            <User className="w-5 h-5 text-blue-500" />
            <input 
              placeholder="Digite seu nome/apelido..." 
              className="bg-transparent w-full text-white outline-none"
              onChange={e => setUser({...user, name: e.target.value})}
            />
          </div>
        </div>
      )}

      {/* QUICK ACTIONS */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-8">
        <button onClick={() => setPrivacy(!privacy)} className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/5 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
          {privacy ? <EyeOff className="w-6 h-6 text-blue-500"/> : <Eye className="w-6 h-6 text-gray-400"/>}
          <span className="text-xs font-bold text-gray-400">Modo Discreto</span>
        </button>
        <button onClick={() => { vibrate(); setStep('service'); }} className="p-4 rounded-2xl bg-blue-600 flex flex-col items-center justify-center gap-2 shadow-[0_0_20px_rgba(10,132,255,0.3)] active:scale-95 transition-transform">
          <Calendar className="w-6 h-6 text-white"/>
          <span className="text-xs font-bold text-white">Agendar Agora</span>
        </button>
      </div>

      <div className="px-5 mb-2 flex justify-between items-end">
        <h2 className="text-lg font-bold text-white">Menu de Experiências</h2>
        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider animate-pulse">● Online Agora</span>
      </div>

      {/* SERVICE LIST (Preview) */}
      <div className="px-5 space-y-4 mb-8">
        {SERVICES.map((s) => (
          <div key={s.id} onClick={() => handleServiceSelect(s)} className="ios-card p-5 rounded-[24px] relative overflow-hidden group">
            {s.badge && <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">{s.badge}</div>}
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">{s.name}</h3>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-lg font-bold ${privacy ? 'blur-secret text-white' : 'text-blue-500'}`}>{formatBRL(s.basePrice)}</span>
              <span className="text-xs text-gray-500 border border-white/10 px-2 py-1 rounded-md">{s.duration}</span>
            </div>
            <div className="flex gap-2 overflow-hidden">
               {s.benefits.slice(0,3).map((b,i) => <span key={i} className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded">{b}</span>)}
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      <ReviewMarquee />
      
      <div className="mt-8 px-6 text-center">
         <p className="text-[10px] text-gray-600">Thalyson Terapêuta • CNPJ: 56.456.789/0001-XX</p>
         <p className="text-[10px] text-gray-700 mt-1">Santa Fé do Sul - SP</p>
      </div>
    </div>
  );

  if (step === 'customize') return (
    <div className="min-h-screen bg-black pb-32">
      <style>{globalStyles}</style>
      {/* Top Bar Navigation */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md pt-12 pb-4 px-5 flex items-center justify-between border-b border-white/5">
        <button onClick={() => setStep('home')} className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-white"><ChevronLeft/></button>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Personalizar</h2>
        <div className="w-10"></div>
      </div>

      <div className="p-5 animate-enter">
        <h1 className="text-2xl font-bold text-white mb-1">{cart.service.name}</h1>
        <p className="text-sm text-gray-400 mb-6">{cart.service.description}</p>

        {/* 1. LOCAL */}
        <section className="mb-8">
          <h3 className="text-xs font-bold text-blue-500 uppercase mb-3 flex items-center gap-2"><MapPin className="w-3 h-3"/> Localização</h3>
          <div className="space-y-3">
            {LOCATIONS.map(l => (
              <button key={l.id} onClick={() => { vibrate(); setCart({...cart, location: l})}} className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ${cart.location?.id === l.id ? 'bg-blue-600 border-blue-600' : 'bg-[#1C1C1E] border-white/5'}`}>
                <div className="bg-black/20 p-2 rounded-full text-white">{l.icon}</div>
                <div className="text-left flex-1">
                  <p className="font-bold text-sm text-white">{l.label}</p>
                  <p className={`text-xs ${cart.location?.id === l.id ? 'text-blue-100' : 'text-gray-500'}`}>{l.sub}</p>
                </div>
                {l.fee > 0 && <span className="text-xs font-bold text-yellow-400">+ {formatBRL(l.fee)}</span>}
              </button>
            ))}
          </div>
        </section>

        {/* 2. UPGRADES (UPSALE) */}
        <section className="mb-8">
           <h3 className="text-xs font-bold text-blue-500 uppercase mb-3 flex items-center gap-2"><Sparkles className="w-3 h-3"/> Potencialize (Opcional)</h3>
           <div className="grid grid-cols-2 gap-3">
             {cart.service.upgrades?.map(u => (
               <button 
                 key={u} 
                 onClick={() => {
                    vibrate(); 
                    const newUpgrades = cart.upgrades.includes(u) ? cart.upgrades.filter(i => i !== u) : [...cart.upgrades, u];
                    setCart({...cart, upgrades: newUpgrades});
                 }} 
                 className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${cart.upgrades.includes(u) ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-white/5'}`}
               >
                 {u}
               </button>
             ))}
           </div>
        </section>

        {/* 3. DATA E HORA */}
        <section className="mb-8">
          <h3 className="text-xs font-bold text-blue-500 uppercase mb-3 flex items-center gap-2"><Clock className="w-3 h-3"/> Horário</h3>
          {/* Scroll Horizontal de Dias */}
          <div className="flex gap-3 overflow-x-auto pb-4 hide-scroll">
            {getSmartDates().map(d => {
              const isSelected = cart.date?.toDateString() === d.toDateString();
              return (
                <button key={d} onClick={() => {vibrate(); setCart({...cart, date: d, time: null})}} className={`min-w-[70px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#1C1C1E] border-white/5 text-gray-500'}`}>
                  <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                  <span className="text-2xl font-bold">{d.getDate()}</span>
                </button>
              )
            })}
          </div>
          {/* Grid de Horas (Só aparece se tiver dia) */}
          {cart.date && (
            <div className="grid grid-cols-4 gap-2 animate-enter">
              {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => (
                <button key={t} onClick={() => {vibrate(); setCart({...cart, time: t})}} className={`py-2.5 rounded-lg text-sm font-bold border transition-all ${cart.time === t ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-white/5'}`}>{t}</button>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* FLOAT FOOTER */}
      <div className="fixed bottom-0 w-full p-5 bg-[#000]/90 backdrop-blur-xl border-t border-white/10 z-50">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-gray-400 uppercase">Total Estimado</span>
          <span className="text-2xl font-bold text-white">{formatBRL(totalValue)}</span>
        </div>
        <button 
          disabled={!cart.location || !cart.date || !cart.time} 
          onClick={() => setStep('checkout')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-lg shadow-lg disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
        >
          Revisar Pedido <ArrowRight className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );

  if (step === 'checkout') return (
    <div className="min-h-screen bg-black p-5 pt-12 flex flex-col justify-between">
      <style>{globalStyles}</style>
      
      <div className="animate-enter">
        <button onClick={() => setStep('customize')} className="text-gray-500 mb-6 flex items-center gap-1 text-sm"><ChevronLeft className="w-4 h-4"/> Voltar</button>
        <h1 className="text-3xl font-bold text-white mb-2">Resumo VIP</h1>
        <p className="text-gray-400 text-sm mb-8">Confira os detalhes antes de enviar.</p>

        <div className="ios-card p-6 rounded-[24px] mb-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-gray-400">Serviço</span>
              <span className="text-white font-bold">{cart.service.name}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-gray-400">Quando</span>
              <span className="text-white font-bold">{cart.date.toLocaleDateString('pt-BR')} às {cart.time}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-gray-400">Local</span>
              <span className="text-white font-bold">{cart.location.label}</span>
            </div>
            {cart.upgrades.length > 0 && (
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-gray-400">Adicionais</span>
                <span className="text-white font-bold text-right text-xs max-w-[150px]">{cart.upgrades.join(', ')}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 items-end">
              <div>
                <span className="text-gray-400 text-xs block">Total Final</span>
                {currentLevel.id !== 'bronze' && <span className="text-[10px] text-yellow-500">Desconto {currentLevel.name} aplicado</span>}
              </div>
              <span className="text-3xl font-bold text-blue-500">{formatBRL(totalValue)}</span>
            </div>
          </div>
        </div>

        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Pagamento</h3>
        <div className="grid grid-cols-3 gap-3">
          {['Pix', 'Dinheiro', 'Cartão'].map(p => (
            <button key={p} onClick={() => setCart({...cart, payment: p})} className={`py-3 rounded-xl border font-bold text-sm transition-all ${cart.payment === p ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-white/5'}`}>{p}</button>
          ))}
        </div>
      </div>

      <button 
        disabled={!cart.payment}
        onClick={finishBooking}
        className="w-full py-4 bg-[#30D158] hover:bg-[#28c04d] text-white font-bold rounded-xl text-lg shadow-[0_0_30px_rgba(48,209,88,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 mt-8"
      >
        {loading ? 'Processando...' : <><Check className="w-5 h-5"/> Confirmar Reserva</>}
      </button>
    </div>
  );

  if (step === 'success') return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-enter">
      <div className="w-24 h-24 bg-[#30D158] rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(48,209,88,0.4)]">
        <Check className="w-10 h-10 text-white stroke-[3px]" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Solicitação Enviada!</h1>
      <p className="text-gray-400 mb-8">Verifique seu WhatsApp. O terapeuta irá confirmar a disponibilidade em instantes.</p>
      
      {/* LEVEL UP CARD (Gamificação) */}
      <div className="w-full bg-[#1C1C1E] p-6 rounded-2xl border border-white/10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10"><Crown className="w-20 h-20 text-yellow-500"/></div>
        <p className="text-xs font-bold text-gray-500 uppercase mb-2 text-left">Progresso VIP</p>
        <div className="flex justify-between text-white font-bold mb-2">
          <span>{currentLevel.name}</span>
          <span>{formatBRL(user.totalSpent)}</span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-500 w-full animate-pulse"></div>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-left">Você ganhou pontos com esta sessão!</p>
      </div>

      <button onClick={() => setStep('home')} className="text-blue-500 font-bold">Voltar ao Início</button>
    </div>
  );
}
