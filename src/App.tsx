import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Shield, Star, Instagram, Bell, Tag, ArrowRight, Eye, EyeOff, Share2, 
  LogOut, QrCode, CreditCard, Banknote, Menu, Phone, User, Zap, Lock
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS & TEMA "STEALTH LUXURY"
// ==================================================================================

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');

/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: 'Manrope', -apple-system, sans-serif; 
  letter-spacing: -0.01em;
  color: #E0E0E0;
  background: #050505;
  -webkit-font-smoothing: antialiased;
}

/* Tipografia de Destaque */
h1, h2, h3, .serif-font { font-family: 'Playfair Display', serif; }

/* Scrollbar Hide */
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* --- BACKGROUNDS & TEXTURES --- */
.noise-bg {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 80%);
  z-index: -2;
}
.noise-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none; z-index: -1;
}

/* --- COMPONENTES VISUAIS --- */
.glass-panel { 
  background: rgba(20, 20, 20, 0.6); 
  backdrop-filter: blur(20px) saturate(180%); 
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.premium-card {
  background: linear-gradient(180deg, rgba(30,30,30,0.4) 0%, rgba(20,20,20,0.6) 100%);
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.premium-card:active { transform: scale(0.98); background: rgba(40,40,40,0.5); }
.premium-card.selected { 
  border-color: #D4AF37; /* Ouro Sóbrio */
  background: rgba(212, 175, 55, 0.05);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
}

/* --- BOTÕES --- */
.btn-primary {
  background: #E0E0E0;
  color: #000;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.15);
  border: none;
  transition: all 0.2s;
}
.btn-primary:active { transform: scale(0.97); opacity: 0.9; }
.btn-primary:disabled { background: #333; color: #666; box-shadow: none; cursor: not-allowed; }

.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
}

/* --- INPUTS --- */
.noble-input {
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  color: white;
  font-family: 'Playfair Display', serif;
  transition: all 0.3s ease;
  border-radius: 0;
}
.noble-input:focus { border-color: #D4AF37; box-shadow: 0 4px 10px -4px rgba(212, 175, 55, 0.3); }

/* --- ANIMATIONS --- */
.animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-blur-in { animation: blurIn 0.4s ease-out forwards; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes blurIn { from { filter: blur(10px); opacity: 0; } to { filter: blur(0); opacity: 1; } }
`;

// ==================================================================================
// 2. CONFIGURAÇÃO DE DADOS & NEGÓCIO
// ==================================================================================

const CONFIG = {
  PRICES: { MACA: 20, AROMA_FULL: 10, AROMA_DISCOUNT: 5, UPGRADE_PCT: 0.5 }
};

const services = [
  { 
    id: 'masculina', name: 'Experiência Tântrica', type: 'sensual',
    description: 'A fusão perfeita entre relaxamento muscular profundo e bioeletricidade. Toques sutis e firmes que despertam a sensibilidade.', 
    labelDuration: '60 min', minutes: 60, basePrice: 140, 
    highlight: "PREMIUM SELECTION", ratings: 5.0, reviews: 310, 
    details: ["Toque Body-to-Body", "Traje Sumário", "Finalização Manual", "Desbloqueio Energético"] 
  },
  { 
    id: 'relaxante', name: 'Terapêutica Relaxante', type: 'relax',
    description: 'Protocolo clássico focado em aliviar tensões do dia a dia. Movimentos de deslizamento e amassamento por todo o corpo.', 
    labelDuration: '60 min', minutes: 60, basePrice: 90, 
    ratings: 4.9, reviews: 142, 
    details: ["Corpo Inteiro", "Foco em Dores", "Óleos Aquecidos", "Sem Interação Íntima"] 
  },
];

const locations = [
  { id: 'santa-fe', label: 'Domicílio / Hotel', sublabel: 'Santa Fé do Sul', fee: 40, allowsTableChoice: true, estimatedTravelTime: '15-20 min', isUber: true },
  { id: 'motel', label: 'Suíte (Motel)', sublabel: 'Encontro discreto', fee: 75, allowsTableChoice: false, estimatedTravelTime: '10-15 min', isMotel: true },
  { id: 'outras-cidades', label: 'Outras Cidades', sublabel: 'Região', fee: 0, allowsTableChoice: false, estimatedTravelTime: 'A combinar', input: true, isPending: true },
];

const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

const SYSTEM_COUPONS = {
  'PRIMEIRA': { code: 'PRIMEIRA', type: 'percent', value: 10, desc: '10% de Boas-vindas' },
  'CLIENTEVIP': { code: 'CLIENTEVIP', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
};

const REVIEWS_DB = [
  { t: "Profissionalismo raro. O sigilo foi mantido do início ao fim. Recomendo.", a: "Empresário (44)", r: 5 },
  { t: "A técnica tântrica dele é diferenciada. Ambiente seguro.", a: "R.S. (Santa Fé)", r: 5 },
  { t: "Fui tenso, saí renovado. O respeito impera.", a: "M.V. (Jales)", r: 5 },
  { t: "Para quem é casado e precisa de um escape discreto, é o melhor.", a: "Anônimo", r: 5 }
];

// Helpers
const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
const generateBookingId = () => Math.random().toString(36).substr(2, 6).toUpperCase();

// ==================================================================================
// 3. COMPONENTES VISUAIS (SENIOR UI)
// ==================================================================================

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6 border-l-2 border-[#D4AF37] pl-4 animate-fade-up">
    <h2 className="text-2xl text-white font-serif italic tracking-wide">{title}</h2>
    {subtitle && <p className="text-xs text-gray-400 font-medium uppercase tracking-[0.15em] mt-1">{subtitle}</p>}
  </div>
);

const DiscreteToggle = ({ isActive, onToggle }) => (
  <button onClick={onToggle} className={`fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full backdrop-blur-md border transition-all duration-300 shadow-2xl ${isActive ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-black/60 text-gray-400 border-white/10'}`}>
    {isActive ? <EyeOff size={16} /> : <Eye size={16} />}
    <span className="text-[10px] font-bold uppercase tracking-widest">{isActive ? 'Modo Discreto' : 'Visível'}</span>
  </button>
);

const ReviewTicker = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 6000); return () => clearInterval(t); }, []);
  return (
    <div className="relative h-20 overflow-hidden mb-8">
      <div key={idx} className="absolute inset-0 flex flex-col items-start justify-center animate-fade-up">
        <div className="flex text-[#D4AF37] mb-1">{[...Array(5)].map((_,i)=><Star key={i} size={10} fill="#D4AF37"/>)}</div>
        <p className="text-sm text-gray-300 font-serif italic">"{REVIEWS_DB[idx].t}"</p>
        <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">— {REVIEWS_DB[idx].a}</span>
      </div>
    </div>
  );
};

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const [privacyBlur, setPrivacyBlur] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // User State
  const [user, setUser] = useState({ name: '', isAdult: false });
  const [selection, setSelection] = useState({ 
    service: null, location: null, date: null, time: '', 
    useTable: false, city: '', coupon: null, upgrade: false, 
    music: 'Lounge Jazz', aroma: false, paymentMethod: null, installments: 1 
  });

  // Init
  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);
  const topRef = useRef(null);
  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Handlers
  const handleReset = () => { setSelection({ ...selection, service: null, location: null }); setStep('home'); };
  const handleWhatsApp = () => {
    triggerHaptic();
    const total = calcFinalPrice();
    const dateStr = selection.date ? selection.date.toLocaleDateString('pt-BR') : '';
    
    let msg = `Olá, Thalyson. Gostaria de agendar um atendimento exclusivo.\n\n` +
      `👤 *Cliente:* ${user.name}\n` +
      `📅 *Data:* ${dateStr} às ${selection.time}\n` +
      `💆‍♂️ *Experiência:* ${selection.service.name} ${selection.upgrade ? '(+30min)' : ''}\n` +
      `📍 *Local:* ${selection.location.label} ${selection.location.id === 'outras-cidades' ? `(${selection.city})` : ''}\n` +
      `💳 *Investimento Total:* ${formatCurrency(total)}\n\n` +
      `Aguardo confirmação.`;

    window.open(`https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  // Pricing Logic
  const calcFinalPrice = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;
    if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.useTable) total += CONFIG.PRICES.MACA;
    if (selection.aroma) total += CONFIG.PRICES.AROMA_FULL;
    if (selection.location?.fee) total += selection.location.fee;
    if (selection.coupon) {
      if (selection.coupon.type === 'percent') total -= (total * selection.coupon.value / 100);
      else total -= selection.coupon.value;
    }
    if (selection.paymentMethod === 'credit_card') {
      total = total / (1 - (CARD_RATES[selection.installments] || 0));
    }
    return Math.max(0, total);
  };

  // Renderers
  if (loading) return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-[#D4AF37]">
      <div className="w-12 h-12 border-t-2 border-[#D4AF37] rounded-full animate-spin mb-4"/>
      <span className="text-[10px] uppercase tracking-[0.4em] font-medium">Carregando Experiência</span>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans text-gray-200 overflow-x-hidden selection:bg-[#D4AF37] selection:text-black ${privacyBlur ? 'blur-lg scale-[0.98] opacity-50 transition-all duration-500' : 'transition-all duration-500'}`}>
      <style>{globalStyles}</style>
      <div className="noise-bg"></div>
      <div className="noise-overlay"></div>

      {/* --- HEADER FLUTUANTE --- */}
      <header className="fixed top-0 w-full z-40 px-6 py-6 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2" onClick={() => setStep('home')}>
           <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-serif font-bold italic text-lg">T</div>
           <span className="text-sm font-bold tracking-widest uppercase text-white/80">Thalyson</span>
        </div>
        <div className="pointer-events-auto flex gap-4">
           {step !== 'home' && <button onClick={() => setStep(step === 'config' ? 'services' : step === 'services' ? 'identity' : 'home')} className="p-2 rounded-full border border-white/10 bg-black/40"><ChevronLeft size={18}/></button>}
           <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full border border-white/10 bg-black/40"><Menu size={18}/></button>
        </div>
      </header>

      {/* --- MENU LATERAL (OVERLAY) --- */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-fade-up">
           <button onClick={() => setShowMenu(false)} className="absolute top-8 right-8 text-white"><X/></button>
           <nav className="flex flex-col gap-8 text-center">
             <a href="https://instagram.com/thalymassagens" target="_blank" className="text-2xl font-serif italic text-white hover:text-[#D4AF37]">Instagram</a>
             <button onClick={() => {alert('Área exclusiva em breve.'); setShowMenu(false);}} className="text-2xl font-serif italic text-white hover:text-[#D4AF37]">Área Vip</button>
             <button onClick={() => {window.location.href="https://google.com"}} className="text-lg text-red-500 mt-8 flex items-center justify-center gap-2"><LogOut size={16}/> Sair Rápido</button>
           </nav>
        </div>
      )}

      {/* --- BODY CONTENT --- */}
      <main className="pt-28 pb-32 px-6 max-w-lg mx-auto min-h-screen flex flex-col relative" ref={topRef}>
        
        {/* --- STEP 1: HOME (LANDING) --- */}
        {step === 'home' && (
          <div className="flex-1 flex flex-col animate-fade-up">
            <div className="flex-1 flex flex-col justify-center">
              <span className="text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-2">Terapias Manuais</span>
              <h1 className="text-4xl text-white leading-tight mb-6">Redescubra o seu <br/><span className="italic text-gray-400">equilíbrio vital.</span></h1>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                Um atendimento exclusivo e individual, focado no homem moderno. Sem filas, sem pressa, total sigilo em Santa Fé do Sul.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass-panel p-4 rounded-2xl">
                   <Shield className="text-[#D4AF37] mb-2" size={20}/>
                   <h3 className="text-sm font-bold text-white">100% Sigiloso</h3>
                   <p className="text-[10px] text-gray-400 mt-1">Sua privacidade é minha prioridade absoluta.</p>
                </div>
                <div className="glass-panel p-4 rounded-2xl">
                   <User className="text-[#D4AF37] mb-2" size={20}/>
                   <h3 className="text-sm font-bold text-white">Atendimento Solo</h3>
                   <p className="text-[10px] text-gray-400 mt-1">Você será atendido apenas por mim.</p>
                </div>
              </div>

              <ReviewTicker />
            </div>
            <button onClick={() => { triggerHaptic(); setStep('identity'); }} className="btn-primary w-full py-5 rounded-xl flex items-center justify-center gap-3 text-sm uppercase tracking-wider">
              Iniciar Agendamento <ArrowRight size={16}/>
            </button>
          </div>
        )}

        {/* --- STEP 2: IDENTITY (CONCIERGE) --- */}
        {step === 'identity' && (
          <div className="animate-fade-up pt-10">
            <SectionHeader title="Identificação" subtitle="Segurança & Exclusividade" />
            
            <div className="space-y-8">
              <div className="group">
                <label className="block text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-4">Como devo chamá-lo?</label>
                <input 
                  type="text" 
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="w-full noble-input text-2xl pb-2 placeholder:text-gray-700 placeholder:italic"
                  placeholder="Seu nome ou apelido..."
                  autoFocus
                />
              </div>

              <div className="space-y-4">
                 <button onClick={() => setUser({...user, isAdult: !user.isAdult})} className={`w-full text-left p-4 border-l-2 transition-all ${user.isAdult ? 'border-[#D4AF37] bg-white/5' : 'border-gray-700 text-gray-500'}`}>
                    <h4 className="text-sm font-bold uppercase">Maior de 18 Anos</h4>
                    <p className="text-xs mt-1">Confirmo que sou maior de idade.</p>
                 </button>
                 <div className="text-left p-4 border-l-2 border-[#D4AF37] bg-white/5">
                    <h4 className="text-sm font-bold uppercase text-white">Conduta</h4>
                    <p className="text-xs mt-1 text-gray-400">Atendimento estritamente profissional. Respeito mútuo é essencial para a realização do serviço.</p>
                 </div>
              </div>

              <div className="pt-8">
                <button 
                  disabled={!user.name || !user.isAdult} 
                  onClick={() => { triggerHaptic(); setStep('services'); }} 
                  className="btn-primary w-full py-5 rounded-xl text-sm uppercase tracking-wider"
                >
                  Ver Menu de Serviços
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- STEP 3: SERVICES (MENU) --- */}
        {step === 'services' && (
          <div className="animate-fade-up">
            <SectionHeader title="O Menu" subtitle="Escolha sua Experiência" />
            
            <div className="space-y-6">
              {services.map((item) => (
                <div key={item.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: item}); setStep('config'); }} className="premium-card p-6 rounded-2xl cursor-pointer relative overflow-hidden group">
                  {item.highlight && <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[9px] font-bold px-3 py-1 uppercase tracking-widest">{item.highlight}</div>}
                  
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl text-white font-serif">{item.name}</h3>
                    <span className="text-[#D4AF37] font-bold text-lg">{formatCurrency(item.basePrice)}</span>
                  </div>
                  
                  <p className="text-sm text-gray-400 leading-relaxed mb-6 border-l border-gray-700 pl-3">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.details.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-300 uppercase tracking-wide border border-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- STEP 4: CONFIGURAÇÃO (AGENDAMENTO) --- */}
        {step === 'config' && selection.service && (
          <div className="animate-fade-up space-y-10 pb-20">
            <div className="text-center mb-8">
              <span className="text-[#D4AF37] text-[10px] uppercase tracking-[0.3em]">Você escolheu</span>
              <h2 className="text-2xl text-white font-serif italic mt-2">{selection.service.name}</h2>
            </div>

            {/* Local */}
            <section>
              <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Local da Sessão</h4>
              <div className="space-y-3">
                {locations.map(loc => (
                  <div key={loc.id} onClick={() => { triggerHaptic(); setSelection({...selection, location: loc, city: '', useTable: false}); }} className={`premium-card p-4 rounded-xl flex items-center justify-between cursor-pointer ${selection.location?.id === loc.id ? 'selected' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selection.location?.id === loc.id ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-500'}`}>
                        {loc.isMotel ? <Lock size={14}/> : <MapPin size={14}/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{loc.label}</p>
                        <p className="text-[10px] text-gray-500">{loc.sublabel}</p>
                      </div>
                    </div>
                    {loc.fee > 0 && <span className="text-xs text-gray-400">+ {formatCurrency(loc.fee)}</span>}
                  </div>
                ))}
              </div>
              
              {/* Inputs Condicionais de Local */}
              {selection.location?.id === 'outras-cidades' && (
                <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Qual cidade?" className="mt-4 w-full noble-input text-lg pb-2" autoFocus />
              )}
              {selection.location?.allowsTableChoice && (
                <div className="mt-4 flex gap-4">
                  <button onClick={() => setSelection({...selection, useTable: false})} className={`flex-1 py-3 text-xs uppercase tracking-wider rounded border ${!selection.useTable ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-gray-800 text-gray-600'}`}>Na Cama</button>
                  <button onClick={() => setSelection({...selection, useTable: true})} className={`flex-1 py-3 text-xs uppercase tracking-wider rounded border ${selection.useTable ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-gray-800 text-gray-600'}`}>Maca (+{formatCurrency(CONFIG.PRICES.MACA)})</button>
                </div>
              )}
            </section>

            {/* Data e Hora */}
            {selection.location && (selection.location.id !== 'outras-cidades' || selection.city) && (
              <section className="animate-fade-up">
                 <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Data e Horário</h4>
                 <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {[0,1,2,3,4].map(d => {
                      const date = new Date(); date.setDate(date.getDate() + d);
                      const isSel = selection.date?.toDateString() === date.toDateString();
                      return (
                        <button key={d} onClick={() => setSelection({...selection, date: date, time: ''})} className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-transparent border-gray-800 text-gray-500'}`}>
                          <span className="text-[10px] font-bold uppercase">{date.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                          <span className="text-xl font-serif font-bold">{date.getDate()}</span>
                        </button>
                      )
                    })}
                 </div>
                 {selection.date && (
                   <div className="grid grid-cols-4 gap-3 mt-4">
                      {['09:00','10:00','11:00','14:00','15:00','16:00','18:00','19:00','20:00','21:00'].map(t => (
                        <button key={t} onClick={() => setSelection({...selection, time: t})} className={`py-2 rounded text-xs font-bold border ${selection.time === t ? 'bg-white text-black border-white' : 'bg-transparent border-gray-800 text-gray-400 hover:border-gray-600'}`}>{t}</button>
                      ))}
                   </div>
                 )}
              </section>
            )}

            {/* Checkout & Pagamento */}
            {selection.time && (
              <section className="animate-fade-up border-t border-white/10 pt-8">
                 <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-4">Finalização</h4>
                 
                 {/* Extras */}
                 <div className="space-y-3 mb-8">
                    <button onClick={() => setSelection({...selection, upgrade: !selection.upgrade})} className={`w-full flex justify-between items-center p-4 rounded-xl border ${selection.upgrade ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800'}`}>
                       <span className="text-sm text-gray-300">+ 30 Minutos de Sessão</span>
                       <span className="text-xs text-[#D4AF37] font-bold">+{formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                    </button>
                    <button onClick={() => setSelection({...selection, aroma: !selection.aroma})} className={`w-full flex justify-between items-center p-4 rounded-xl border ${selection.aroma ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-gray-800'}`}>
                       <span className="text-sm text-gray-300">Aromaterapia Premium</span>
                       <span className="text-xs text-[#D4AF37] font-bold">+{formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span>
                    </button>
                 </div>

                 <div className="mb-8">
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Método de Pagamento</p>
                   <div className="flex gap-4">
                      {[{id:'pix', l:'Pix'}, {id:'cash', l:'Dinheiro'}, {id:'credit_card', l:'Cartão'}].map(m => (
                        <button key={m.id} onClick={() => setSelection({...selection, paymentMethod: m.id})} className={`flex-1 py-4 rounded-xl border text-xs font-bold uppercase ${selection.paymentMethod === m.id ? 'bg-white text-black border-white' : 'border-gray-800 text-gray-500'}`}>{m.l}</button>
                      ))}
                   </div>
                   {selection.paymentMethod === 'credit_card' && (
                     <select className="w-full mt-4 bg-black border border-gray-700 text-gray-300 p-3 rounded text-sm" onChange={e => setSelection({...selection, installments: parseInt(e.target.value)})}>
                        {CARD_RATES.map((r, i) => i > 1 && <option key={i} value={i}>{i}x no Cartão</option>)}
                     </select>
                   )}
                 </div>

                 {/* Nota Fiscal Visual */}
                 <div className="bg-[#E0E0E0] text-black p-6 rounded-sm shadow-xl font-mono text-xs mb-8 relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdGggZD0iTTAgMTBMNSAwIDEwIDEweiIgZmlsbD0iIzA1MDUwNSIvPjwvc3ZnPg==')] opacity-100 mt-[-5px]"></div>
                    <div className="text-center border-b border-black/10 pb-4 mb-4">
                       <h3 className="font-bold text-lg uppercase">Resumo</h3>
                       <p className="text-[10px] text-gray-600">Serviços de Terapia Corporal</p>
                    </div>
                    <div className="space-y-2 mb-4">
                       <div className="flex justify-between"><span>{selection.service.name}</span><span>{formatCurrency(selection.service.basePrice)}</span></div>
                       {selection.upgrade && <div className="flex justify-between text-gray-600"><span>Tempo Adicional</span><span>{formatCurrency(selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span></div>}
                       {selection.location.fee > 0 && <div className="flex justify-between text-gray-600"><span>Deslocamento/Taxa</span><span>{formatCurrency(selection.location.fee)}</span></div>}
                       {selection.paymentMethod === 'credit_card' && <div className="flex justify-between text-gray-600"><span>Taxa Cartão</span><span>INCLUSO</span></div>}
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-black pt-4">
                       <span>TOTAL</span>
                       <span>{formatCurrency(calcFinalPrice())}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBhdGggZD0iTTAgMEw1IDEwIDEwIDB6IiBmaWxsPSIjMDUwNTA1Ii8+PC9zdmc+')] opacity-100 mb-[-5px]"></div>
                 </div>

                 <button onClick={handleWhatsApp} disabled={!selection.paymentMethod} className="btn-primary w-full py-5 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                    <Check size={18}/> Confirmar Agendamento
                 </button>
              </section>
            )}
          </div>
        )}

        {/* --- STEP 5: SUCESSO --- */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-up">
            <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mb-6">
              <Check className="text-[#D4AF37]" size={40}/>
            </div>
            <h2 className="text-3xl text-white font-serif italic mb-2">Solicitação Enviada</h2>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mb-10">O WhatsApp foi aberto para finalizarmos o contato. Aguarde meu retorno para confirmação final.</p>
            <button onClick={handleReset} className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest border-b border-[#D4AF37] pb-1">Voltar ao Início</button>
          </div>
        )}

      </main>

      {/* --- FLOATING CONTROLS --- */}
      <DiscreteToggle isActive={privacyBlur} onToggle={() => { triggerHaptic(); setPrivacyBlur(!privacyBlur); }} />
    </div>
  );
}
