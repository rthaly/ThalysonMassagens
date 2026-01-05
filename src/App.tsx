import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, Siren, Send, ThumbsUp, Car, Menu, Hand, Home, Navigation
} from 'lucide-react';

// ==================================================================================
// 1. DESIGN SYSTEM & TOKENS (CSS-IN-JS)
// ==================================================================================

const globalStyles = `
/* --- RESET & BASE --- */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; scroll-behavior: smooth; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.015em;
  color: #fff;
  background: #000;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* --- SCROLLBAR --- */
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* --- BACKGROUNDS & ATMOSPHERE --- */
.luxury-bg {
  background: 
    radial-gradient(circle at 50% 0%, rgba(20, 20, 25, 1) 0%, #000000 70%),
    radial-gradient(circle at 80% 90%, rgba(10, 132, 255, 0.08), transparent 40%);
  background-attachment: fixed;
  min-height: 100vh;
}

/* --- CARDS & GLASSMORPHISM --- */
.glass-panel { 
  background: rgba(22, 22, 24, 0.7); 
  backdrop-filter: blur(40px) saturate(180%); 
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.06); 
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease;
}

.glass-panel-active {
  border-color: rgba(10, 132, 255, 0.5);
  background: rgba(30, 30, 35, 0.8);
  box-shadow: 0 0 30px rgba(10, 132, 255, 0.15);
}

/* --- BUTTONS --- */
.action-btn { 
  transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); 
}
.action-btn:active { transform: scale(0.96); }

.primary-btn {
  background: linear-gradient(135deg, #007AFF 0%, #0056B3 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.3);
  border: none;
  position: relative;
  overflow: hidden;
}
.primary-btn::after {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0.15), transparent);
  pointer-events: none;
}

/* --- ANIMATIONS --- */
.reveal-up { animation: revealUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(30px); }
.fade-in { animation: fadeIn 0.5s ease forwards; opacity: 0; }
.pulse-subtle { animation: pulseSubtle 3s infinite; }

@keyframes revealUp { to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { to { opacity: 1; } }
@keyframes pulseSubtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

/* --- INPUTS --- */
.stealth-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255,255,255,0.08);
  color: white;
  transition: all 0.3s ease;
}
.stealth-input:focus { 
  border-color: #0A84FF; 
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 0 0 1px rgba(10, 132, 255, 0.3); 
}
`;

// ==================================================================================
// 2. DATA LAYER & CONFIG
// ==================================================================================

const CONFIG = {
  PRICES: {
    AROMA_FULL: 10,      
    AROMA_DISCOUNT: 5,   
    UPGRADE_PCT: 0.5, // 50% increase
    TOUCH: 60 // Preço atualizado do toque
  }
};

const SERVICES_DB = [
  { 
    id: 'masculina', name: 'Massagem Masculina', 
    shortDesc: 'Experiência tântrica completa.',
    description: 'A combinação perfeita entre relaxamento muscular profundo e a intensidade do toque tântrico. Finalização manual inclusa.', 
    duration: '60 min', minutes: 60, 
    basePrice: 160, 
    badge: "MAIS VENDIDA 🔥", 
    tags: ["Relaxante + Tântrica", "Finalização Manual", "Corpo a Corpo"],
    imageGradient: "from-blue-900/40 to-black"
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', 
    shortDesc: 'Alívio de dores e tensão.',
    description: 'Terapia focada na musculatura. Ideal para pós-treino, estresse e dores nas costas. Sem conotação sexual explícita, foco no bem-estar.', 
    duration: '60 min', minutes: 60, 
    basePrice: 130, 
    badge: null,
    tags: ["Tira Dores", "Óleos Essenciais", "Música Zen"],
    imageGradient: "from-green-900/40 to-black"
  },
];

const LOCATIONS_DB = [
  { 
    id: 'santa-fe', 
    title: 'No seu Local (Delivery)', 
    subtitle: 'Casa ou Apartamento',
    fee: 25,
    icon: Home,
    requiresAddress: true,
    isUber: true
  },
  { 
    id: 'motel', 
    title: 'Suíte / Hotel', 
    subtitle: 'Vou até o seu quarto', 
    fee: 75,
    icon: Bed,
    requiresAddress: false, // Assume user sends name of hotel
    isMotel: true
  },
];

const REVIEWS_DB = [
  { t: "O toque dele é diferente. Não é mecânico, tem sentimento. Saí de lá flutuando.", a: "Bruno (32)", s: 5 },
  { t: "Profissionalismo nota 10. A parte tântrica me levou a lugares que eu não conhecia.", a: "Anônimo", s: 5 },
  { t: "Melhor massagem de Santa Fé. O ambiente que ele cria com a música e os óleos é surreal.", a: "M.S.", s: 5 },
  { t: "Fiquei com receio por ser a primeira vez, mas ele me deixou super confortável.", a: "Lucas", s: 5 },
  { t: "A finalização foi explosiva. Vale cada centavo o upgrade de tempo.", a: "Cliente VIP", s: 5 },
  { t: "Pontual e discreto. O sigilo pra mim é fundamental e ele respeitou 100%.", a: "Empresário", s: 5 },
  { t: "Massagem forte, tirou a dor nas costas e depois relaxou a mente. Recomendo.", a: "Felipe", s: 4 },
  { t: "A pele dele é muito macia, o contato corpo a corpo é a melhor parte.", a: "R.L.", s: 5 },
];

const TIME_SLOTS = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30', '22:00'];

// ==================================================================================
// 3. UTILS & HOOKS
// ==================================================================================

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };

// ==================================================================================
// 4. SUB-COMPONENTES DE UI
// ==================================================================================

const SectionHeader = ({ number, title, active }) => (
  <div className={`flex items-center gap-4 mb-6 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${active ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-[0_0_15px_rgba(10,132,255,0.5)]' : 'bg-transparent border-white/20 text-gray-500'}`}>
      {number}
    </div>
    <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
  </div>
);

const ReviewTicker = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 6000); return () => clearInterval(t); }, []);
  return (
    <div className="w-full bg-white/5 border-y border-white/5 py-3 mb-8 backdrop-blur-md">
       <div className="flex flex-col items-center justify-center text-center px-6 animate-fade-in key={idx}">
          <div className="flex gap-1 mb-1 text-[#FFD60A]">
            {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < REVIEWS_DB[idx].s ? "currentColor" : "none"} />)}
          </div>
          <p className="text-[12px] italic text-gray-300 leading-snug">"{REVIEWS_DB[idx].t}"</p>
          <span className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-widest">— {REVIEWS_DB[idx].a}</span>
       </div>
    </div>
  )
}

// ==================================================================================
// 5. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  
  // Refs para Auto-Scroll
  const servicesRef = useRef(null);
  const calendarRef = useRef(null);
  const locationRef = useRef(null);
  const extrasRef = useRef(null);
  const checkoutRef = useRef(null);

  // Estados do Fluxo
  const [stage, setStage] = useState(0); // 0:Intro, 1:Services, 2:Date, 3:Location, 4:Checkout
  
  // Dados do Usuário & Pedido
  const [user, setUser] = useState({ name: '', isAdult: false });
  const [cart, setCart] = useState({
    service: null,
    date: null,
    time: null,
    location: null,
    address: '',
    extras: { upgrade: false, touch: false, aroma: false },
    payment: 'pix'
  });

  // Init
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Smooth Auto-Scroll Helper
  const smoothScrollTo = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  // Handlers
  const handleStart = () => {
    if (user.name.length > 2 && user.isAdult) {
      triggerHaptic();
      setStage(Math.max(stage, 1));
      smoothScrollTo(servicesRef);
    } else {
        alert("Preencha seu nome e confirme ser maior de 18 anos.");
    }
  };

  const handleServiceSelect = (service) => {
    triggerHaptic();
    setCart({ ...cart, service });
    setStage(Math.max(stage, 2));
    smoothScrollTo(calendarRef);
  };

  const handleDateTimeSelect = (date, time) => {
    triggerHaptic();
    setCart({ ...cart, date, time });
    setStage(Math.max(stage, 3));
    smoothScrollTo(locationRef);
  };

  const handleLocationSelect = (loc) => {
    triggerHaptic();
    setCart({ ...cart, location: loc });
    setStage(Math.max(stage, 4));
    smoothScrollTo(extrasRef);
  };

  // Cálculos de Preço
  const getTotal = () => {
    if (!cart.service) return 0;
    let total = cart.service.basePrice;
    if (cart.extras.upgrade) total += (cart.service.basePrice * CONFIG.PRICES.UPGRADE_PCT);
    if (cart.extras.touch) total += CONFIG.PRICES.TOUCH;
    if (cart.extras.aroma) total += CONFIG.PRICES.AROMA_FULL;
    if (cart.location?.fee) total += cart.location.fee;
    return total;
  };

  // Gerar WhatsApp
  const finishOrder = () => {
    const total = getTotal();
    const dateStr = cart.date ? cart.date.toLocaleDateString('pt-BR') : '';
    
    let msg = `*NOVO AGENDAMENTO VIP* ✨\n`;
    msg += `👤 Cliente: *${user.name}*\n`;
    msg += `📅 Data: *${dateStr}* às *${cart.time}*\n\n`;
    
    msg += `💆 *${cart.service.name}*\n`;
    msg += `💰 Base: ${formatCurrency(cart.service.basePrice)}\n`;
    
    if (cart.extras.upgrade) msg += `➕ Upgrade 30min (+${formatCurrency(cart.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)})\n`;
    if (cart.extras.touch) msg += `➕ Interação/Toque (+${formatCurrency(CONFIG.PRICES.TOUCH)})\n`;
    if (cart.extras.aroma) msg += `➕ Aromaterapia (+${formatCurrency(CONFIG.PRICES.AROMA_FULL)})\n`;
    
    msg += `\n📍 *Local:* ${cart.location.title}\n`;
    if (cart.location.isUber) msg += `🚗 Taxa Deslocamento: ${formatCurrency(cart.location.fee)}\n`;
    else msg += `🏨 Taxa Motel/Hotel: ${formatCurrency(cart.location.fee)}\n`;
    
    if (cart.address) msg += `🏠 Endereço: ${cart.address}\n`;

    msg += `\n💳 Pagamento: ${cart.payment.toUpperCase()}\n`;
    msg += `💎 *TOTAL FINAL: ${formatCurrency(total)}*`;

    const url = `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Render Loader
  if (loading) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-[#0A84FF]/30 border-t-[#0A84FF] rounded-full animate-spin mb-4"></div>
      <p className="text-[10px] font-bold tracking-[0.4em] text-[#0A84FF] animate-pulse">CARREGANDO</p>
    </div>
  );

  return (
    <div className="luxury-bg text-gray-200 pb-32">
      <style>{globalStyles}</style>

      {/* --- HEADER --- */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/5 py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-[14px] font-bold text-white tracking-wider uppercase">Thalyson<span className="text-[#0A84FF]">Massagens</span></h1>
        </div>
        <div className="flex gap-4">
           <div className="text-[10px] font-bold bg-[#32D74B]/10 text-[#32D74B] px-2 py-1 rounded border border-[#32D74B]/20 animate-pulse">ON</div>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-24 px-5 relative">
        
        <ReviewTicker />

        {/* --- 1. INTRO & IDENTITY --- */}
        <section className="mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">Bem-vindo.<br/><span className="text-gray-500 text-xl">Vamos personalizar sua sessão.</span></h2>
          
          <div className="glass-panel p-6 rounded-[24px] mt-6">
            <div className="mb-6">
              <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider mb-2 block">Como posso te chamar?</label>
              <input 
                type="text" 
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                placeholder="Seu Nome" 
                className="w-full bg-transparent border-b border-gray-700 text-2xl font-medium py-2 focus:border-[#0A84FF] outline-none text-white transition-colors placeholder:text-gray-700"
              />
            </div>

            <button 
              onClick={() => setUser({...user, isAdult: !user.isAdult})}
              className={`w-full py-4 px-4 rounded-[16px] border flex items-center gap-3 transition-all mb-6 ${user.isAdult ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-transparent border-white/10'}`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-500'}`}>
                {user.isAdult && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm text-gray-300">Confirmo que tenho +18 anos</span>
            </button>

            {stage === 0 && (
                <button 
                  onClick={handleStart}
                  disabled={!user.name || !user.isAdult}
                  className="w-full primary-btn py-4 rounded-[18px] font-bold text-[15px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all"
                >
                  Iniciar Agendamento <ArrowRight size={18} />
                </button>
            )}
          </div>
        </section>

        {/* --- 2. SERVICES (REVEAL) --- */}
        {stage >= 1 && (
          <section ref={servicesRef} className="mb-12 reveal-up">
            <SectionHeader number="1" title="Escolha a Experiência" active={true} />
            
            <div className="space-y-5">
              {SERVICES_DB.map((s) => {
                const isSelected = cart.service?.id === s.id;
                return (
                  <div key={s.id} onClick={() => handleServiceSelect(s)} className={`glass-panel p-0 rounded-[24px] overflow-hidden relative group cursor-pointer ${isSelected ? 'glass-panel-active transform scale-[1.02]' : ''}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${s.imageGradient} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                    
                    {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">{s.badge}</div>}

                    <div className="p-6 relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white">{s.name}</h3>
                        <span className="text-[#0A84FF] font-bold text-lg">{formatCurrency(s.basePrice)}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-4 leading-relaxed">{s.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {s.tags.map(t => <span key={t} className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded-md text-gray-300">{t}</span>)}
                      </div>

                      <div className={`w-full py-3 rounded-[14px] flex items-center justify-center font-bold text-[13px] transition-all ${isSelected ? 'bg-[#0A84FF] text-white shadow-lg' : 'bg-white/5 text-gray-400 group-hover:bg-white/10'}`}>
                         {isSelected ? 'Selecionado' : 'Escolher Massagem'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* --- 3. DATE & TIME (REVEAL) --- */}
        {stage >= 2 && (
          <section ref={calendarRef} className="mb-12 reveal-up">
            <SectionHeader number="2" title="Data e Hora" active={true} />
            
            <div className="glass-panel p-6 rounded-[24px]">
               {/* Date Strip */}
               <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-4">
                  {[...Array(14)].map((_, i) => {
                      const d = new Date(); d.setDate(d.getDate() + i);
                      const isSel = cart.date?.getDate() === d.getDate();
                      return (
                          <button key={i} onClick={() => setCart({...cart, date: d, time: null})} className={`min-w-[70px] h-[80px] rounded-[18px] flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#2C2C2E] border-white/5 text-gray-400'}`}>
                              <span className="text-[10px] uppercase font-bold mb-1">{i === 0 ? 'HOJE' : d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                              <span className="text-xl font-bold">{d.getDate()}</span>
                          </button>
                      )
                  })}
               </div>

               {/* Time Grid */}
               {cart.date && (
                   <div className="grid grid-cols-3 gap-2 animate-fade-in">
                       {TIME_SLOTS.map(t => (
                           <button 
                             key={t} 
                             onClick={() => handleDateTimeSelect(cart.date, t)}
                             className={`py-3 rounded-[12px] text-sm font-bold border transition-all ${cart.time === t ? 'bg-white text-black border-white' : 'bg-[#2C2C2E] border-white/5 text-gray-400 hover:bg-[#3A3A3C]'}`}
                           >
                               {t}
                           </button>
                       ))}
                   </div>
               )}
            </div>
          </section>
        )}

        {/* --- 4. LOCATION (REVEAL) --- */}
        {stage >= 3 && (
            <section ref={locationRef} className="mb-12 reveal-up">
                <SectionHeader number="3" title="Local de Atendimento" active={true} />
                
                <div className="grid grid-cols-1 gap-3">
                    {LOCATIONS_DB.map(loc => {
                        const Icon = loc.icon;
                        const isSel = cart.location?.id === loc.id;
                        return (
                            <div key={loc.id} className="animate-fade-in">
                                <button onClick={() => { handleLocationSelect(loc); }} className={`w-full p-4 rounded-[20px] border flex items-center justify-between transition-all text-left ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-panel border-transparent'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#2C2C2E] text-gray-400'}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-[15px]">{loc.title}</h4>
                                            <p className="text-[11px] text-gray-500">{loc.subtitle}</p>
                                        </div>
                                    </div>
                                    <span className="text-[12px] font-bold text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-1 rounded border border-[#FFD60A]/20">+ {formatCurrency(loc.fee)}</span>
                                </button>
                                
                                {/* Address Input only if selected and required */}
                                {isSel && loc.requiresAddress && (
                                    <div className="mt-3 pl-4 animate-fade-in">
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 text-gray-500" size={16}/>
                                            <input 
                                                value={cart.address}
                                                onChange={e => setCart({...cart, address: e.target.value})}
                                                placeholder="Endereço: Rua, Número, Bairro" 
                                                className="w-full pl-10 stealth-input p-3 rounded-[12px] text-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>
        )}

        {/* --- 5. EXTRAS & CHECKOUT (REVEAL) --- */}
        {stage >= 4 && (
            <section ref={extrasRef} className="mb-32 reveal-up">
                <SectionHeader number="4" title="Finalizar e Relaxar" active={true} />

                <div className="glass-panel p-6 rounded-[24px] mb-6">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Extras Premium</h4>
                    
                    {/* Upgrade */}
                    <button onClick={() => setCart({...cart, extras: {...cart.extras, upgrade: !cart.extras.upgrade}})} className="w-full flex justify-between items-center py-3 border-b border-white/5 mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${cart.extras.upgrade ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>{cart.extras.upgrade && <Check size={12} />}</div>
                            <div className="text-left"><span className="block text-sm font-bold text-gray-200">+30 Minutos</span><span className="text-[10px] text-gray-500">Sessão estendida</span></div>
                        </div>
                        <span className="text-sm font-bold text-[#0A84FF]">+ {formatCurrency(cart.service.basePrice * CONFIG.PRICES.UPGRADE_PCT)}</span>
                    </button>

                    {/* Touch */}
                    <button onClick={() => setCart({...cart, extras: {...cart.extras, touch: !cart.extras.touch}})} className="w-full flex justify-between items-center py-3 border-b border-white/5 mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${cart.extras.touch ? 'bg-[#FF375F] border-[#FF375F]' : 'border-gray-600'}`}>{cart.extras.touch && <Check size={12} />}</div>
                            <div className="text-left"><span className="block text-sm font-bold text-gray-200">Toque/Interação</span><span className="text-[10px] text-gray-500">Tocar o massagista</span></div>
                        </div>
                        <span className="text-sm font-bold text-[#FF375F]">+ {formatCurrency(CONFIG.PRICES.TOUCH)}</span>
                    </button>

                     {/* Aroma */}
                     <button onClick={() => setCart({...cart, extras: {...cart.extras, aroma: !cart.extras.aroma}})} className="w-full flex justify-between items-center py-3">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${cart.extras.aroma ? 'bg-[#32D74B] border-[#32D74B]' : 'border-gray-600'}`}>{cart.extras.aroma && <Check size={12} />}</div>
                            <div className="text-left"><span className="block text-sm font-bold text-gray-200">Aromaterapia</span><span className="text-[10px] text-gray-500">Óleos essenciais no ar</span></div>
                        </div>
                        <span className="text-sm font-bold text-[#32D74B]">+ {formatCurrency(CONFIG.PRICES.AROMA_FULL)}</span>
                    </button>
                </div>

                <div className="glass-panel p-6 rounded-[24px]">
                    <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Pagamento</h4>
                    <div className="flex gap-2">
                        {['pix', 'cartão', 'dinheiro'].map(method => (
                            <button 
                              key={method} 
                              onClick={() => setCart({...cart, payment: method})}
                              className={`flex-1 py-3 rounded-[12px] text-[12px] font-bold border uppercase transition-all ${cart.payment === method ? 'bg-white text-black border-white' : 'bg-[#2C2C2E] text-gray-400 border-white/5'}`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        )}

      </main>

      {/* --- STICKY FOOTER --- */}
      {stage >= 4 && (
          <div ref={checkoutRef} className="fixed bottom-0 w-full z-50 reveal-up">
              <div className="h-20 bg-gradient-to-t from-black to-transparent pointer-events-none absolute bottom-full w-full"></div>
              <div className="bg-[#161618] border-t border-white/10 p-5 pb-8 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] max-w-md mx-auto relative">
                  <div className="flex justify-between items-end mb-4 px-2">
                      <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Estimado</p>
                          <div className="text-3xl font-bold text-white flex items-baseline gap-1">
                              {formatCurrency(getTotal())}
                              <span className="text-sm font-normal text-gray-500">/sessão</span>
                          </div>
                      </div>
                  </div>
                  <button 
                    onClick={finishOrder}
                    className="w-full primary-btn h-14 rounded-[20px] font-bold text-[16px] flex items-center justify-center gap-3 animate-pulse-subtle"
                  >
                      <MessageCircle size={20} fill="currentColor" />
                      CONFIRMAR NO WHATSAPP
                  </button>
              </div>
          </div>
      )}
    </div>
  );
}
