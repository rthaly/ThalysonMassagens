import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, 
  Shield, Users, Star, Instagram, Bell, Tag, ArrowRight, 
  Lock, Eye, EyeOff, Share2, LogOut, Zap, Crown, 
  Trash2, CreditCard, Banknote, QrCode, Info, 
  Siren, Send, Menu, Clock, Flame, Sparkles, Navigation
} from 'lucide-react';

// ==================================================================================
// 🎨 1. ESTILOS GLOBAIS & ANIMAÇÕES (CSS IN JS)
// ==================================================================================

const globalStyles = `
/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.01em;
  color: #fff;
  background: #000;
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Hide */
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* --- BACKGROUNDS PREMIUM --- */
.midnight-bg {
  background: 
    radial-gradient(circle at 50% 0%, #1a1a2e 0%, #000000 60%),
    radial-gradient(circle at 85% 30%, rgba(192, 160, 98, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 15% 70%, rgba(10, 132, 255, 0.05) 0%, transparent 40%);
  background-attachment: fixed;
  background-size: cover;
  min-height: 100vh;
}

/* --- GLASSMORPHISM CARDS --- */
.glass-card { 
  background: rgba(30, 30, 35, 0.6); 
  backdrop-filter: blur(20px); 
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), border-color 0.3s ease;
}
.glass-card:active { transform: scale(0.98); }
.glass-card.selected {
  background: rgba(10, 132, 255, 0.15);
  border-color: #0A84FF;
  box-shadow: 0 0 20px rgba(10, 132, 255, 0.2);
}

/* --- BUTTONS --- */
.btn-primary {
  background: linear-gradient(135deg, #0A84FF 0%, #0056b3 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(10, 132, 255, 0.4);
  border: none;
  position: relative;
  overflow: hidden;
}
.btn-primary::after {
  content: '';
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: linear-gradient(rgba(255,255,255,0.2), transparent);
  opacity: 0;
  transition: opacity 0.2s;
}
.btn-primary:active::after { opacity: 1; }
.btn-primary:disabled { filter: grayscale(1); opacity: 0.5; cursor: not-allowed; }

.btn-gold {
  background: linear-gradient(135deg, #FFD700 0%, #C5A000 100%);
  color: black;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
}

/* --- ANIMATIONS --- */
.animate-in { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.pulse-slow { animation: pulse 3s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.shimmer {
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 2s infinite linear;
}
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
`;

// ==================================================================================
// 🧠 2. DADOS & LÓGICA DE NEGÓCIO (BUSINESS LOGIC)
// ==================================================================================

const CONFIG = {
  PRICES: {
    MACA: 20,            
    AROMA_FULL: 15,      
    UPGRADE_PCT: 0.4, // 40% a mais pelo upgrade    
  },
  PHONE: "5517991360413", // Seu número real
  PIX: "62922530000144"
};

const SERVICES = [
  { 
    id: 'tantrica_dual', name: 'Experiência Tântrica Dual', type: 'sensual',
    shortDesc: 'A mais pedida. Conexão total.',
    description: 'A fusão perfeita entre relaxamento muscular e despertar sensorial. Inclui massagem relaxante completa seguida de manobras tântricas, toques corpo a corpo (body) e finalização manual intensa.', 
    duration: '60 min', minutes: 60, 
    basePrice: 150, 
    badge: "🔥 MAIS VENDIDA", 
    rating: 5.0, reviews: 412, 
    tags: ["Relaxante", "Body-to-Body", "Lingam Massagem", "Finalização Manual"] 
  },
  { 
    id: 'relaxante_premium', name: 'Relaxante Deep Tissue', type: 'relax',
    shortDesc: 'Alívio profundo de tensão.',
    description: 'Foco total na musculatura. Movimentos firmes e deslizantes para tirar o peso das costas e pernas. Ideal para quem treina ou trabalha muito sentado. Sem toques íntimos.', 
    duration: '50 min', minutes: 50, 
    basePrice: 100, 
    rating: 4.9, reviews: 180, 
    tags: ["Muscular", "Sem Íntimo", "Terapêutica", "Óleos Essenciais"] 
  },
  { 
    id: 'nuru_massage', name: 'Nuru Gel Experience', type: 'sensual',
    shortDesc: 'Deslize total corpo a corpo.',
    description: 'Técnica japonesa com gel ultra deslizante. O contato é pele com pele o tempo todo, criando uma sensação elétrica e contínua. Êxtase garantido.', 
    duration: '60 min', minutes: 60, 
    basePrice: 180, 
    badge: "👑 VIP",
    rating: 5.0, reviews: 89, 
    tags: ["Gel Nuru", "Corpo a Corpo", "Sensorial Extremo", "Finalização"] 
  },
];

const LOCATIONS = [
  { 
    id: 'motel', 
    label: 'Suíte Privada (Motel)', 
    desc: 'Eu vou até sua suíte', 
    fee: 75,
    icon: <Lock className="w-5 h-5 text-[#FFD700]"/>,
    info: 'Taxa única (inclui deslocamento)',
    isMotel: true
  },
  { 
    id: 'santa-fe', 
    label: 'Domicílio (Santa Fé)', 
    desc: 'No conforto da sua casa', 
    fee: 35,
    icon: <MapPin className="w-5 h-5 text-[#0A84FF]"/>,
    allowsTable: true,
    info: 'Taxa de Uber inclusa',
    isUber: true
  },
  { 
    id: 'outras', 
    label: 'Cidades Vizinhas', 
    desc: 'Jales, Urânia, Três Fronteiras...', 
    fee: 0,
    icon: <Navigation className="w-5 h-5 text-gray-400"/>,
    info: 'Taxa a combinar via WhatsApp',
    isPending: true,
    input: true
  },
];

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

const LEVELS = [
  { name: 'Visitante', min: 0, icon: '👋', benefit: 'Acesso ao agendamento' },
  { name: 'Bronze', min: 300, icon: '🥉', benefit: 'Prioridade na agenda' },
  { name: 'Prata', min: 800, icon: '🥈', benefit: '50% OFF na Aromaterapia' },
  { name: 'Ouro', min: 1500, icon: '🥇', benefit: 'Aromaterapia GRÁTIS' },
  { name: 'Diamante', min: 3000, icon: '💎', benefit: 'Atendimento em feriados + Mimos' },
];

const REVIEWS = [
  { txt: "A melhor de Santa Fé. O sigilo é total, me senti muito seguro.", author: "Casado, 42 anos" },
  { txt: "Mão pesada na medida certa. Sai de lá flutuando. A tântrica é surreal.", author: "R.S." },
  { txt: "Profissional, educado e limpo. A finalização foi incrível.", author: "Anônimo" },
  { txt: "Gostei que ele vai no motel. Super discreto, parecia um amigo visitando.", author: "M.V." }
];

// --- UTILS ---
const formatBRL = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
const playSound = () => { /* Placeholder para som de click */ };

// ==================================================================================
// 🧩 3. COMPONENTES UI (ATÓMICOS)
// ==================================================================================

const PrivacyToggle = ({ mode, setMode }) => (
  <button onClick={() => { triggerHaptic(); setMode(!mode); }} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5 active:scale-95 transition-all">
    {mode ? <EyeOff className="w-3.5 h-3.5 text-gray-400"/> : <Eye className="w-3.5 h-3.5 text-[#0A84FF]"/>}
    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-300">{mode ? "Modo Espião" : "Visível"}</span>
  </button>
);

const PanicButton = () => (
  <button onClick={() => window.location.href = "https://www.google.com"} className="fixed top-4 right-4 z-[100] bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 rounded-full p-2.5 transition-all duration-300 shadow-lg group">
    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
  </button>
);

const ProgressBar = ({ step, total }) => (
  <div className="flex gap-1.5 mb-6 px-2">
    {[...Array(total)].map((_, i) => (
      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#0A84FF] shadow-[0_0_10px_#0A84FF]' : 'bg-gray-800'}`} />
    ))}
  </div>
);

const BlurGallery = () => {
  const [unlocked, setUnlocked] = useState(false);
  return (
    <div className="mb-8 animate-in delay-200">
      <div className="flex justify-between items-end mb-3 px-1">
        <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Galeria (Prévia)</h4>
        <span className="text-[10px] text-[#0A84FF] flex items-center gap-1"><Lock className="w-3 h-3"/> Conteúdo Privado</span>
      </div>
      <div className="grid grid-cols-3 gap-2 relative">
        {[1,2,3].map(i => (
          <div key={i} className="aspect-square bg-gray-800 rounded-xl overflow-hidden relative group">
            {/* Simulando imagem borrada */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-black opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[15px]">
               <Lock className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors"/>
            </div>
          </div>
        ))}
        {!unlocked && (
           <div className="absolute inset-0 z-10 flex items-center justify-center">
             <button onClick={() => { triggerHaptic(); alert('Fotos liberadas após o primeiro agendamento para sua segurança e sigilo.'); }} className="bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl active:scale-95 transition-transform">
               Toque para solicitar acesso
             </button>
           </div>
        )}
      </div>
    </div>
  );
};

// ==================================================================================
// 🚀 4. APLICAÇÃO PRINCIPAL (CORE)
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0); // 0:Intro, 1:Service, 2:Config, 3:Success
  const [privacyMode, setPrivacyMode] = useState(false);
  const [user, setUser] = useState({ name: '', isAdult: false });
  const [selection, setSelection] = useState({
    service: null, location: null, date: null, time: null, 
    extras: { upgrade: false, aroma: false, table: false },
    payment: 'pix', installments: 1, city: ''
  });

  // Load User Data
  useEffect(() => {
    const saved = localStorage.getItem('thaly_user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Save User Data
  useEffect(() => {
    localStorage.setItem('thaly_user', JSON.stringify(user));
  }, [user]);

  // Scroll Top on Step Change
  const scrollRef = useRef(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  // --- CALCS ---
  const currentTotal = useMemo(() => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    if (selection.extras.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.extras.table) total += CONFIG.PRICES.MACA;
    if (selection.extras.aroma) total += CONFIG.PRICES.AROMA_FULL; // Simplified logic for demo
    if (selection.location?.fee) total += selection.location.fee;
    
    if (selection.payment === 'credit_card') {
      const rate = CARD_RATES[selection.installments] || 0;
      return total / (1 - rate);
    }
    return total;
  }, [selection]);

  const handleNext = () => { triggerHaptic(); setStep(p => p + 1); };
  const handleBack = () => { triggerHaptic(); setStep(p => p - 1); };

  const handleWhatsApp = () => {
    const isMotel = selection.location?.id === 'motel';
    const locText = selection.location?.id === 'outras' ? `${selection.location.label} (${selection.city})` : selection.location.label;
    
    const msg = `
*NOVO AGENDAMENTO VIP 💎*
--------------------------------
👤 *Cliente:* ${user.name}
📅 *Data:* ${selection.date?.toLocaleDateString('pt-BR')}
⏰ *Horário:* ${selection.time}
💆 *Serviço:* ${selection.service.name.toUpperCase()}
📍 *Local:* ${locText} ${isMotel ? '(Vou até você)' : ''}

*EXTRAS:*
${selection.extras.upgrade ? '✅ +30 Minutos (Upgrade)' : ''}
${selection.extras.aroma ? '✅ Aromaterapia' : ''}
${selection.extras.table ? '✅ Maca Portátil' : ''}
${!selection.extras.upgrade && !selection.extras.aroma && !selection.extras.table ? 'Nenhum extra selecionado' : ''}

💰 *Valor Final:* ${formatBRL(currentTotal)}
💳 *Pagamento:* ${selection.payment === 'pix' ? 'Pix' : selection.payment === 'cash' ? 'Dinheiro' : `Cartão (${selection.installments}x)`}
--------------------------------
*Dúvida:* Possui estacionamento discreto?
`.trim();
    
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
    setStep(3);
  };

  // --- RENDER STEPS ---
  
  // STEP 0: INTRO & IDENTITY
  const renderIntro = () => (
    <div className="flex flex-col h-full justify-between pt-10 pb-6 animate-in">
      <div>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0A84FF] to-[#004e9a] flex items-center justify-center shadow-[0_0_30px_rgba(10,132,255,0.3)]">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 leading-tight">
          Experiência <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A84FF] to-[#60a5fa]">Sensorial</span><br/>& Relaxante
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8 px-4">
          O refúgio que você merece em Santa Fé do Sul. <br/>Atendimento exclusivo para homens exigentes.
        </p>
        
        <div className="glass-card p-6 rounded-3xl mx-2 mb-6">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-4 flex items-center gap-2"><Shield className="w-4 h-4 text-[#0A84FF]"/> Segurança & Sigilo</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-bold ml-1 mb-1 block">Como prefere ser chamado?</label>
              <input 
                value={user.name} 
                onChange={e => setUser({...user, name: e.target.value})}
                placeholder="Ex: Sr. Silva (ou Apelido)" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:border-[#0A84FF] outline-none transition-all"
              />
            </div>
            <button 
              onClick={() => setUser({...user, isAdult: !user.isAdult})}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-black/20 border-white/5'}`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-500'}`}>
                {user.isAdult && <Check className="w-3 h-3 text-white"/>}
              </div>
              <span className="text-sm text-gray-300">Confirmo ter mais de 18 anos.</span>
            </button>
          </div>
        </div>
        
        <BlurGallery />
        
        <div className="mx-2 p-4 rounded-2xl bg-[#FFD700]/5 border border-[#FFD700]/10 flex items-start gap-3">
           <Siren className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5"/>
           <p className="text-xs text-[#FFD700]/80 leading-relaxed">
             <strong>Aviso:</strong> Apenas massagem terapêutica e tântrica profissional. Respeito total é exigido e oferecido.
           </p>
        </div>
      </div>

      <button 
        disabled={!user.name || !user.isAdult} 
        onClick={handleNext} 
        className="btn-primary w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 mt-4"
      >
        Ver Menu de Experiências <ArrowRight className="w-5 h-5"/>
      </button>
    </div>
  );

  // STEP 1: SERVICES
  const renderServices = () => (
    <div className="pt-4 pb-24 animate-in">
       <div className="flex items-center justify-between mb-6 px-1">
         <h2 className="text-2xl font-bold">Escolha o Ritual</h2>
         <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">Passo 1 de 2</span>
       </div>

       <div className="space-y-5">
         {SERVICES.map(s => (
           <div 
             key={s.id} 
             onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); handleNext(); }}
             className="glass-card p-5 rounded-[24px] relative overflow-hidden group"
           >
             {s.badge && (
               <div className="absolute top-0 right-0 bg-[#0A84FF] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg z-10">
                 {s.badge}
               </div>
             )}
             
             <div className="flex justify-between items-start mb-2 relative z-10">
               <div>
                 <h3 className="text-xl font-bold text-white leading-tight">{s.name}</h3>
                 <p className="text-xs text-[#0A84FF] font-medium mt-1 uppercase tracking-wide">{s.type === 'sensual' ? '🔥 Experiência Intensa' : '🌿 Relaxamento Puro'}</p>
               </div>
               <div className="text-right">
                  <span className={`text-xl font-bold block ${privacyMode ? 'blur-sm' : ''}`}>{formatBRL(s.basePrice)}</span>
                  <span className="text-[10px] text-gray-500">{s.duration}</span>
               </div>
             </div>

             <p className="text-sm text-gray-300 leading-relaxed mb-4 opacity-90">{s.description}</p>
             
             <div className="flex flex-wrap gap-2">
               {s.tags.map((t, i) => (
                 <span key={i} className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded-md text-gray-400 font-medium">
                   {t}
                 </span>
               ))}
             </div>
             
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#0A84FF]/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-[#0A84FF]/20 transition-all"/>
           </div>
         ))}
       </div>

       <div className="mt-8">
         <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-1">O que dizem os clientes</h4>
         <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-1">
           {REVIEWS.map((r, i) => (
             <div key={i} className="min-w-[260px] glass-card p-4 rounded-2xl flex flex-col justify-between">
               <div className="flex gap-1 mb-2">
                 {[...Array(5)].map((_,k) => <Star key={k} className="w-3 h-3 text-[#FFD700] fill-[#FFD700]"/>)}
               </div>
               <p className="text-xs text-gray-300 italic mb-3">"{r.txt}"</p>
               <p className="text-[10px] font-bold text-gray-500 uppercase text-right">- {r.author}</p>
             </div>
           ))}
         </div>
       </div>
    </div>
  );

  // STEP 2: CONFIGURE (Dates, Location, Extras)
  const renderConfig = () => {
    // Generate Dates
    const dates = [];
    const today = new Date();
    for(let i=0; i<7; i++){
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    const timeSlots = ['09:00','11:00','13:00','14:30','16:00','18:00','19:30','21:00','22:30'];

    return (
      <div className="pt-4 pb-48 animate-in">
        <div className="glass-card p-4 rounded-2xl mb-6 flex items-center gap-4 border-l-4 border-l-[#0A84FF]">
           <div className="w-10 h-10 rounded-full bg-[#0A84FF]/20 flex items-center justify-center text-[#0A84FF] font-bold">1</div>
           <div>
             <h3 className="font-bold text-sm">{selection.service.name}</h3>
             <p className="text-xs text-gray-400">Serviço selecionado</p>
           </div>
           <button onClick={() => setStep(1)} className="ml-auto text-xs text-[#0A84FF] font-bold underline">Alterar</button>
        </div>

        {/* DATA */}
        <section className="mb-8">
           <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Data & Hora</h4>
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
             {dates.map((d, i) => {
               const isSel = selection.date?.getDate() === d.getDate();
               return (
                 <button key={i} onClick={() => {triggerHaptic(); setSelection({...selection, date: d, time: null})}} className={`min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-white/5 text-gray-400'}`}>
                   <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                   <span className="text-xl font-bold font-mono">{d.getDate()}</span>
                 </button>
               )
             })}
           </div>
           {selection.date && (
             <div className="grid grid-cols-4 gap-2 animate-in">
               {timeSlots.map(t => (
                 <button key={t} onClick={() => {triggerHaptic(); setSelection({...selection, time: t})}} className={`py-2 rounded-lg text-sm font-bold border transition-all ${selection.time === t ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-white/5 text-gray-300 hover:bg-white/5'}`}>
                   {t}
                 </button>
               ))}
             </div>
           )}
        </section>

        {/* LOCAL */}
        <section className="mb-8 animate-in delay-100">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Onde será o atendimento?</h4>
          <div className="space-y-3">
            {LOCATIONS.map(l => (
              <div key={l.id}>
                <button onClick={() => {triggerHaptic(); setSelection({...selection, location: l})}} className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-white/5'}`}>
                  <div className={`p-2 rounded-full ${selection.location?.id === l.id ? 'bg-[#0A84FF] text-white' : 'bg-white/5 text-gray-400'}`}>
                    {l.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className={`font-bold text-sm ${selection.location?.id === l.id ? 'text-white' : 'text-gray-300'}`}>{l.label}</p>
                    <p className="text-xs text-gray-500">{l.desc}</p>
                  </div>
                  {l.fee > 0 && <span className="text-xs font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded border border-[#FFD700]/20">+{formatBRL(l.fee)}</span>}
                </button>
                {/* Inputs Condicionais */}
                {selection.location?.id === l.id && l.id === 'santa-fe' && l.allowsTable && (
                  <div className="ml-12 mt-2 flex gap-2 animate-in">
                    <button onClick={() => setSelection({...selection, extras: {...selection.extras, table: !selection.extras.table}})} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${selection.extras.table ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
                      {selection.extras.table ? '✅ Levar Maca (+R$20)' : '⬜ Usar Cama/Sofá'}
                    </button>
                  </div>
                )}
                {selection.location?.id === l.id && l.input && (
                  <input value={selection.city} onChange={e=>setSelection({...selection, city: e.target.value})} placeholder="Qual cidade?" className="ml-2 mt-2 w-[90%] bg-black/40 border border-white/10 p-2 rounded text-sm text-white focus:border-[#0A84FF] outline-none"/>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* EXTRAS */}
        <section className="mb-8 animate-in delay-200">
           <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Incremente sua experiência</h4>
           
           <button onClick={() => setSelection({...selection, extras: {...selection.extras, upgrade: !selection.extras.upgrade}})} className={`w-full p-4 rounded-xl border mb-3 flex justify-between items-center transition-all ${selection.extras.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-white/5'}`}>
             <div className="text-left">
               <p className="font-bold text-sm text-white">+30 Minutos (Upgrade)</p>
               <p className="text-xs text-gray-500">Não tenha pressa de ir embora.</p>
             </div>
             <span className="text-[#0A84FF] font-bold text-sm">+{formatBRL(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
           </button>

           <button onClick={() => setSelection({...selection, extras: {...selection.extras, aroma: !selection.extras.aroma}})} className={`w-full p-4 rounded-xl border mb-3 flex justify-between items-center transition-all ${selection.extras.aroma ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-white/5'}`}>
             <div className="text-left">
               <p className="font-bold text-sm text-white">Aromaterapia</p>
               <p className="text-xs text-gray-500">Óleos essenciais para imersão.</p>
             </div>
             <span className="text-[#0A84FF] font-bold text-sm">+{formatBRL(CONFIG.PRICES.AROMA_FULL)}</span>
           </button>
        </section>

        {/* PAGAMENTO */}
        <section className="animate-in delay-300">
           <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Forma de Pagamento</h4>
           <div className="grid grid-cols-3 gap-2">
             {['pix', 'cash', 'credit_card'].map(m => (
               <button key={m} onClick={() => setSelection({...selection, payment: m})} className={`h-16 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${selection.payment === m ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-white/5 text-gray-400'}`}>
                 {m === 'pix' ? <QrCode className="w-4 h-4"/> : m === 'cash' ? <Banknote className="w-4 h-4"/> : <CreditCard className="w-4 h-4"/>}
                 <span className="text-[10px] font-bold uppercase">{m === 'credit_card' ? 'Cartão' : m === 'cash' ? 'Dinheiro' : 'Pix'}</span>
               </button>
             ))}
           </div>
           {selection.payment === 'credit_card' && (
             <select onChange={e => setSelection({...selection, installments: e.target.value})} className="mt-3 w-full bg-black border border-white/10 text-white rounded-lg p-3 text-sm">
               {CARD_RATES.map((r, i) => i > 0 && <option key={i} value={i}>{i}x de {formatBRL(currentTotal/i)}</option>)}
             </select>
           )}
        </section>

      </div>
    )
  };

  // --- MAIN LAYOUT ---
  return (
    <div className="min-h-screen flex justify-center bg-black font-sans">
      <style>{globalStyles}</style>
      <PanicButton />
      
      <div className="w-full max-w-[440px] midnight-bg relative shadow-2xl overflow-hidden flex flex-col h-screen">
        
        {/* HEADER */}
        <header className="px-6 pt-12 pb-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent">
          {step > 0 ? (
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full bg-white/5 backdrop-blur border border-white/10 active:scale-90 transition-transform"><ChevronLeft className="w-5 h-5 text-white"/></button>
          ) : <div className="w-9 h-9"/>}
          
          <img src="https://via.placeholder.com/40" alt="Logo" className="w-8 h-8 opacity-0"/> {/* Placeholder para centralizar */}
          
          <PrivacyToggle mode={privacyMode} setMode={setPrivacyMode} />
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto px-5 scrollbar-hide relative" ref={scrollRef}>
           {step > 0 && <ProgressBar step={step-1} total={2} />}
           {step === 0 && renderIntro()}
           {step === 1 && renderServices()}
           {step === 2 && renderConfig()}
           {step === 3 && (
             <div className="h-full flex flex-col items-center justify-center animate-in pb-20">
               <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                 <Check className="w-10 h-10 text-white stroke-[3px]"/>
               </div>
               <h2 className="text-2xl font-bold mb-2">Solicitação Enviada!</h2>
               <p className="text-gray-400 text-center text-sm px-8 mb-8">Verifique seu WhatsApp para confirmar os detalhes com o terapeuta.</p>
               <button onClick={() => setStep(0)} className="text-[#0A84FF] font-bold text-sm underline">Voltar ao Início</button>
             </div>
           )}
        </main>

        {/* STICKY FOOTER (Steps 1 & 2) */}
        {step > 0 && step < 3 && (
          <div className="absolute bottom-0 w-full p-4 z-50 bg-[#121212]/90 backdrop-blur-xl border-t border-white/10 pb-8">
            <div className="flex justify-between items-center mb-3">
               <div>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Estimado</p>
                 <p className={`text-2xl font-bold text-white tracking-tight ${privacyMode ? 'blur-md' : ''}`}>{formatBRL(currentTotal)}</p>
               </div>
               <div className="text-right">
                 <p className="text-[10px] text-[#0A84FF] font-bold">{selection.location?.isMotel ? '+ Taxa Motel Inclusa' : 'Sem surpresas'}</p>
               </div>
            </div>
            <button 
              disabled={step === 2 && (!selection.date || !selection.time || !selection.location)}
              onClick={step === 1 ? handleNext : handleWhatsApp}
              className="w-full btn-primary h-14 rounded-2xl font-bold text-lg flex justify-center items-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              {step === 1 ? 'Continuar' : 'CONFIRMAR NO WHATSAPP'} <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
