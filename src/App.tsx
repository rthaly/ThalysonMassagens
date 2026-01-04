import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft, Check, X, MapPin, Calendar, Clock,
  Star, Bell, Tag, ArrowRight, Eye, EyeOff, Share2, 
  LogOut, Crown, Music, CreditCard, Banknote, QrCode, 
  Info, CheckCircle2, Send, Menu, Hand, ShieldCheck, Sparkles, Navigation
} from 'lucide-react';

// ==================================================================================
// 1. DESIGN SYSTEM & ESTILOS GLOBAIS (SENIOR LEVEL)
// ==================================================================================

const globalStyles = `
/* Reset & Base Otimizada */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; }
body { 
  overscroll-behavior-y: none; 
  touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  color: #F2F2F7;
  background: #000;
  -webkit-font-smoothing: antialiased;
}

/* Utilitários */
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.tap-target { min-height: 48px; min-width: 48px; } /* Acessibilidade para dedos maiores */

/* --- BACKGROUND LUXURY --- */
.luxury-bg {
  background: 
    radial-gradient(circle at 50% 0%, #1a1a2e 0%, #000000 70%),
    linear-gradient(180deg, rgba(0,0,0,0) 0%, #000 100%);
  min-height: 100vh;
}

/* --- CARDS & GLASSMORPHISM 2.0 --- */
.glass-card { 
  background: rgba(30, 30, 32, 0.70); 
  backdrop-filter: blur(40px) saturate(180%); 
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.glass-card:active { transform: scale(0.98); }
.glass-card.selected { 
  background: rgba(10, 132, 255, 0.15); 
  border-color: #0A84FF; 
  box-shadow: 0 0 0 1px #0A84FF;
}

/* --- BOTÕES OTIMIZADOS --- */
.action-btn { 
  background: #0A84FF;
  color: white;
  font-weight: 600;
  letter-spacing: -0.01em;
  box-shadow: 0 4px 20px rgba(10, 132, 255, 0.4);
  border: none;
  transition: all 0.2s ease;
}
.action-btn:active { transform: scale(0.96); opacity: 0.9; }
.action-btn:disabled { background: #333; color: #666; box-shadow: none; cursor: not-allowed; }

.secondary-btn {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.05);
  color: white;
}

/* --- INPUTS ALTO CONTRASTE --- */
.high-contrast-input {
  background: #1C1C1E;
  border: 1px solid #3A3A3C;
  color: white;
  font-size: 17px; /* Tamanho legível */
  border-radius: 12px;
  padding: 16px;
  transition: border-color 0.2s;
}
.high-contrast-input:focus { border-color: #0A84FF; outline: none; }
.high-contrast-input::placeholder { color: #636366; }

/* --- ANIMAÇÕES SUAVES --- */
@keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-enter { animation: fadeInScale 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
`;

// ==================================================================================
// 2. CONFIGURAÇÃO & DADOS (LÓGICA DE NEGÓCIO)
// ==================================================================================

const CONFIG = {
  PRICES: {
    MACA: 20,            
    AROMA_FULL: 10,      
    AROMA_DISCOUNT: 5,   
    UPGRADE_PCT: 0.5,
    TOUCH: 55 // R$ 55,00
  },
  COMPANY: {
    NAME: "Thalyson Massagens",
    PIX: "62922530000144",
    WHATSAPP: "5517991360413"
  }
};

const SERVICES_DB = [
  { 
    id: 'masculina', name: 'Massagem Masculina',
    shortDesc: 'Relaxamento + Finalização',
    fullDesc: 'A experiência definitiva. Começa com relaxamento muscular profundo e evolui para toques sensitivos (Tântrica) com finalização manual intensa.', 
    duration: '60 min', 
    price: 155, 
    badge: "⭐ PREFERIDA DOS CLIENTES", 
    features: ["Massagista de Cueca", "Toque Tântrico", "Finalização Manual", "Sigilo Absoluto"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante',
    shortDesc: 'Tira dores e tensão',
    fullDesc: 'Foco terapêutico. Ideal para homens cansados, com dores nas costas ou pernas. Movimentos firmes e precisos para zerar o stress.', 
    duration: '60 min', 
    price: 125, 
    features: ["Corpo Inteiro", "Alívio Muscular", "Toque Firme", "Sem Finalização"] 
  },
];

const LOCATIONS_DB = [
  { id: 'motel', icon: <Bed/>, label: 'Suíte (Motel)', sub: 'Vou até você', fee: 75, type: 'motel' },
  { id: 'santa-fe', icon: <MapPin/>, label: 'Domicílio (Santa Fé)', sub: 'No seu conforto', fee: 23, type: 'uber' },
  { id: 'outras', icon: <Navigation/>, label: 'Região / Vizinhos', sub: 'Taxa a combinar', fee: 0, type: 'pending' },
];

const REVIEWS_DB = [
  { text: "Cara, sensacional. O 'extra' vale cada centavo. Saí renovado.", author: "Empresário (42)", rating: 5 },
  { text: "Discrição total. Fui no motel, ele chegou pontual. Serviço de primeira.", author: "Sigiloso", rating: 5 },
  { text: "A pegada é forte e o toque é macio. Exatamente o que eu precisava pra relaxar.", author: "Ricardo S.", rating: 5 },
  { text: "Ótimo atendimento, só achei a agenda um pouco cheia.", author: "M.V.", rating: 4 },
  { text: "Tocar nele fez toda a diferença. A conexão foi outra. Recomendo muito.", author: "Anônimo", rating: 5 },
];

const LIVE_NOTIFICATIONS = [
  "🔥 Empresário de Jales agendou agora",
  "⚡ Último horário da noite disponível",
  "💎 Cliente VIP acabou de renovar",
  "👀 3 pessoas vendo a agenda agora",
  "✅ Agenda de Sábado quase lotada"
];

// Helpers
const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const haptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
const generateID = () => Math.random().toString(36).substr(2, 6).toUpperCase();

// ==================================================================================
// 3. COMPONENTES REUTILIZÁVEIS (ATOMIC DESIGN)
// ==================================================================================

const Toast = ({ msg, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#32D74B] text-black font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-enter">
      <CheckCircle2 size={20} /> {msg}
    </div>
  );
};

const Header = ({ step, onBack, privacy, onTogglePrivacy }) => (
  <div className="flex items-center justify-between px-6 pt-12 pb-4 bg-gradient-to-b from-black to-transparent sticky top-0 z-40">
    <div className="flex items-center gap-4">
      {step !== 'home' && step !== 'success' && (
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-white/10 active:bg-white/10">
          <ChevronLeft className="text-[#0A84FF]" />
        </button>
      )}
      {step === 'home' && <div className="w-10 h-10 rounded-full bg-[#0A84FF]/20 flex items-center justify-center"><Sparkles size={20} className="text-[#0A84FF]"/></div>}
    </div>
    
    <button onClick={onTogglePrivacy} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1C1C1E] border border-white/10">
      <span className="text-[10px] uppercase font-bold text-gray-400">Modo Discreto</span>
      {privacy ? <EyeOff size={14} className="text-gray-500"/> : <Eye size={14} className="text-[#32D74B]"/>}
    </button>
  </div>
);

const ProgressBar = ({ step }) => {
  const steps = ['identity', 'service', 'config', 'checkout'];
  const currentIdx = steps.indexOf(step);
  if(currentIdx === -1) return null;
  const progress = ((currentIdx + 1) / steps.length) * 100;
  
  return (
    <div className="px-6 mb-6">
      <div className="h-1 bg-[#1C1C1E] rounded-full overflow-hidden">
        <div className="h-full bg-[#0A84FF] transition-all duration-500" style={{width: `${progress}%`}} />
      </div>
      <p className="text-[10px] text-gray-500 text-right mt-1 font-bold uppercase">Passo {currentIdx + 1} de {steps.length}</p>
    </div>
  )
}

// ==================================================================================
// 4. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  // --- STATE ---
  const [step, setStep] = useState('home'); // home, identity, service, config, checkout, success
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [liveMsg, setLiveMsg] = useState(LIVE_NOTIFICATIONS[0]);

  // User Data
  const [user, setUser] = useState({ name: '', isAdult: true }); // Assume adult default for simpler flow, verify later
  
  // Selection Data
  const [booking, setBooking] = useState({
    service: null,
    date: null,
    time: null,
    location: null,
    addressDetails: { street: '', number: '', district: '', ref: '' }, // Unified address
    city: '',
    extras: { upgrade: false, touch: false, aroma: false, table: false }, // Simplified structure
    coupon: null,
    payment: 'pix',
    installments: 1
  });

  // --- EFFECTS ---
  useEffect(() => { 
    setTimeout(() => setLoading(false), 1500); 
    const interval = setInterval(() => {
      setLiveMsg(LIVE_NOTIFICATIONS[Math.floor(Math.random() * LIVE_NOTIFICATIONS.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---
  const handleNext = (nextStep) => { haptic(); setStep(nextStep); window.scrollTo(0,0); };
  const handleBack = () => {
    haptic();
    const flow = ['home', 'identity', 'service', 'config', 'checkout'];
    const curr = flow.indexOf(step);
    if(curr > 0) setStep(flow[curr - 1]);
  };

  const updateBooking = (key, val) => {
    setBooking(prev => ({...prev, [key]: val}));
    haptic();
  };

  const toggleExtra = (key) => {
    setBooking(prev => ({...prev, extras: {...prev.extras, [key]: !prev.extras[key]}}));
    haptic();
  };

  // --- CALCULATIONS ---
  const totalCalc = useMemo(() => {
    if(!booking.service) return 0;
    let total = booking.service.price;
    
    // Extras
    if(booking.extras.upgrade) total += booking.service.price * CONFIG.PRICES.UPGRADE_PCT;
    if(booking.extras.touch) total += CONFIG.PRICES.TOUCH;
    if(booking.extras.table) total += CONFIG.PRICES.MACA;
    if(booking.extras.aroma) total += CONFIG.PRICES.AROMA_FULL; // Simplificado sem nivelamento por enquanto

    // Location
    if(booking.location?.fee) total += booking.location.fee;

    return total;
  }, [booking]);

  // --- WHATSAPP GENERATOR ---
  const sendToWhatsApp = () => {
    const { service, date, time, location, extras, payment, addressDetails, city } = booking;
    const isMotel = location.id === 'motel';
    
    let locText = `${location.label}`;
    if(isMotel) locText += " (Vou até você)";
    if(city) locText += ` - Cidade: ${city}`;
    if(location.id === 'santa-fe') locText += `\n📍 ${addressDetails.street}, ${addressDetails.number} - ${addressDetails.district}`;

    const extrasList = [];
    if(extras.upgrade) extrasList.push("✅ +30 Minutos");
    if(extras.touch) extrasList.push("🔥 Tocar Massagista");
    if(extras.table) extrasList.push("🛏️ Maca Portátil");
    if(extras.aroma) extrasList.push("🌸 Aromaterapia");

    const msg = 
`*AGENDAMENTO VIP - THALYSON*
🆔 *ID:* ${generateID()}
👤 *Cliente:* ${user.name}
📅 *Data:* ${date?.toLocaleDateString('pt-BR')} às ${time}

💆 *Serviço:* ${service.name}
📍 *Local:* ${locText}

✨ *Extras:*
${extrasList.length ? extrasList.join('\n') : 'Nenhum extra selecionado'}

💰 *Total Estimado:* ${formatBRL(totalCalc)}
💳 *Pagamento:* ${payment.toUpperCase()}

_Aguardo confirmação._`;

    window.open(`https://wa.me/${CONFIG.COMPANY.WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  // ==================================================================================
  // 5. RENDERIZAÇÃO
  // ==================================================================================

  return (
    <div className="flex justify-center min-h-screen bg-black">
      <style>{globalStyles}</style>

      {/* LOADER */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#333] border-t-[#0A84FF] rounded-full animate-spin mb-4"/>
          <p className="text-[#0A84FF] font-bold tracking-widest text-xs animate-pulse">CARREGANDO SISTEMA VIP</p>
        </div>
      )}

      {/* CONTAINER MÓVEL */}
      <div className="w-full max-w-md luxury-bg relative flex flex-col shadow-2xl overflow-hidden min-h-screen">
        
        <Header step={step} onBack={handleBack} privacy={privacyMode} onTogglePrivacy={() => setPrivacyMode(!privacyMode)} />
        
        {step !== 'home' && step !== 'success' && <ProgressBar step={step} />}

        <div className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
          
          {/* --- HOME --- */}
          {step === 'home' && (
            <div className="animate-enter pt-4">
              <div className="mb-8">
                <span className="text-[#0A84FF] font-bold text-[11px] tracking-widest uppercase mb-2 block">Experiência Premium</span>
                <h1 className="text-4xl font-bold text-white leading-tight">Massagem<br/>& Relaxamento</h1>
                <p className="text-gray-400 mt-2 text-lg">Para homens exigentes.</p>
              </div>

              {/* LIVE STATUS */}
              <div className="glass-card p-3 rounded-full flex items-center gap-3 mb-8 border border-white/5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"/>
                <p className="text-xs text-gray-300 font-medium">{liveMsg}</p>
              </div>

              {/* ACTION */}
              <button onClick={() => handleNext('identity')} className="w-full action-btn rounded-2xl py-5 text-lg flex items-center justify-center gap-2 mb-8 tap-target">
                Agendar Agora <ArrowRight size={20}/>
              </button>

              {/* REVIEWS */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">O que dizem os clientes</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {REVIEWS_DB.map((r, i) => (
                    <div key={i} className="glass-card min-w-[280px] p-5 rounded-2xl">
                      <div className="flex text-[#FFD60A] mb-2">{[...Array(r.rating)].map((_,k)=><Star key={k} size={14} fill="#FFD60A"/>)}</div>
                      <p className="text-sm text-gray-200 italic mb-3">"{r.text}"</p>
                      <p className="text-xs text-gray-500 font-bold uppercase">{r.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- STEP 1: IDENTITY --- */}
          {step === 'identity' && (
            <div className="animate-enter pt-4">
              <h2 className="text-2xl font-bold text-white mb-2">Identificação</h2>
              <p className="text-gray-400 mb-8">Para garantir sua segurança e a minha.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">Como devo te chamar?</label>
                  <input 
                    value={user.name} 
                    onChange={e => setUser({...user, name: e.target.value})}
                    placeholder="Seu Nome ou Apelido" 
                    className="w-full high-contrast-input"
                    autoFocus
                  />
                </div>

                <div className="glass-card p-5 rounded-2xl border-l-4 border-[#0A84FF]">
                  <div className="flex gap-4 items-start">
                    <ShieldCheck className="text-[#0A84FF] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-white text-sm">Sigilo Garantido</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">Seus dados não ficam salvos online. Tudo é tratado diretamente pelo WhatsApp pessoal.</p>
                    </div>
                  </div>
                </div>

                <button disabled={!user.name.trim()} onClick={() => handleNext('service')} className="w-full action-btn rounded-xl py-4 mt-4 tap-target">
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* --- STEP 2: SERVICE --- */}
          {step === 'service' && (
            <div className="animate-enter pt-4">
              <h2 className="text-2xl font-bold text-white mb-6">Escolha o Serviço</h2>
              <div className="space-y-5">
                {SERVICES_DB.map(s => (
                  <div key={s.id} 
                    onClick={() => { updateBooking('service', s); handleNext('config'); }}
                    className={`glass-card p-6 rounded-3xl relative active:scale-95 transition-transform ${booking.service?.id === s.id ? 'border-[#0A84FF] bg-[#0A84FF]/10' : ''}`}
                  >
                    {s.badge && <span className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-3xl">{s.badge}</span>}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white">{s.name}</h3>
                      <span className="text-[#0A84FF] font-bold text-lg">{formatBRL(s.price)}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{s.fullDesc}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.features.map((f, i) => (
                        <span key={i} className="px-2 py-1 bg-white/5 rounded-md text-[10px] text-gray-300 font-medium uppercase tracking-wide">{f}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- STEP 3: CONFIG (Date, Loc, Extras) --- */}
          {step === 'config' && (
            <div className="animate-enter space-y-10 pt-2">
              
              {/* DATA */}
              <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Quando?</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {[...Array(7)].map((_, i) => {
                    const d = new Date(); d.setDate(d.getDate() + i);
                    const isSel = booking.date?.getDate() === d.getDate();
                    return (
                      <button key={i} onClick={() => updateBooking('date', d)} 
                        className={`min-w-[70px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
                        <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                        <span className="text-xl font-bold">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
                {booking.date && (
                  <div className="grid grid-cols-4 gap-2 mt-4 animate-enter">
                    {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                      <button key={t} onClick={() => updateBooking('time', t)} className={`py-3 rounded-xl text-sm font-bold border ${booking.time === t ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-white/10'}`}>{t}</button>
                    ))}
                  </div>
                )}
              </section>

              {/* LOCAL */}
              <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Onde?</h3>
                <div className="space-y-3">
                  {LOCATIONS_DB.map(l => (
                    <div key={l.id}>
                      <button onClick={() => updateBooking('location', l)} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${booking.location?.id === l.id ? 'bg-[#0A84FF]/15 border-[#0A84FF]' : 'glass-card border-white/10'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${booking.location?.id === l.id ? 'bg-[#0A84FF] text-white' : 'bg-[#333] text-gray-500'}`}>{l.icon}</div>
                          <div className="text-left">
                            <p className="font-bold text-white text-sm">{l.label}</p>
                            <p className="text-xs text-gray-500">{l.sub}</p>
                          </div>
                        </div>
                        {l.fee > 0 && <span className="text-xs font-bold text-[#FFD60A]">+ {formatBRL(l.fee)}</span>}
                      </button>
                      
                      {/* Inputs Condicionais */}
                      {booking.location?.id === l.id && l.id === 'santa-fe' && (
                        <div className="mt-3 pl-4 border-l-2 border-[#333] space-y-3 animate-enter">
                          <input placeholder="Rua / Avenida" className="w-full high-contrast-input py-3" onChange={e => setBooking(b => ({...b, addressDetails: {...b.addressDetails, street: e.target.value}}))} />
                          <div className="flex gap-2">
                             <input placeholder="Número" className="w-1/3 high-contrast-input py-3" onChange={e => setBooking(b => ({...b, addressDetails: {...b.addressDetails, number: e.target.value}}))} />
                             <input placeholder="Bairro" className="flex-1 high-contrast-input py-3" onChange={e => setBooking(b => ({...b, addressDetails: {...b.addressDetails, district: e.target.value}}))} />
                          </div>
                        </div>
                      )}
                      {booking.location?.id === l.id && l.id === 'outras' && (
                        <input placeholder="Qual cidade?" className="mt-3 w-full high-contrast-input animate-enter" onChange={e => updateBooking('city', e.target.value)} />
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* EXTRAS VIP */}
              <section>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Personalize (Extras VIP)</h3>
                <div className="space-y-3">
                  {/* TOUCH - DESTAQUE */}
                  <button onClick={() => toggleExtra('touch')} className={`w-full p-5 rounded-2xl border flex items-center justify-between transition-all ${booking.extras.touch ? 'bg-[#FF375F]/10 border-[#FF375F] shadow-[0_0_20px_rgba(255,55,95,0.2)]' : 'glass-card border-white/10'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${booking.extras.touch ? 'bg-[#FF375F] text-white' : 'bg-[#333] text-gray-500'}`}><Hand size={20}/></div>
                      <div className="text-left">
                        <p className="font-bold text-white">Tocar o Massagista</p>
                        <p className="text-xs text-gray-400">Interação corporal permitida</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#FF375F]">+ {formatBRL(CONFIG.PRICES.TOUCH)}</span>
                  </button>

                  {/* UPGRADE TIME */}
                  <button onClick={() => toggleExtra('upgrade')} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${booking.extras.upgrade ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-card border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <Clock size={18} className={booking.extras.upgrade ? 'text-[#0A84FF]' : 'text-gray-500'}/>
                      <span className="text-sm font-medium text-white">+ 30 Minutos</span>
                    </div>
                    <span className="text-sm text-[#0A84FF]">+ {formatBRL(booking.service.price * CONFIG.PRICES.UPGRADE_PCT)}</span>
                  </button>
                  
                  {/* MACA */}
                   <button onClick={() => toggleExtra('table')} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${booking.extras.table ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-card border-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <Bed size={18} className={booking.extras.table ? 'text-[#0A84FF]' : 'text-gray-500'}/>
                      <span className="text-sm font-medium text-white">Levar Maca Portátil</span>
                    </div>
                    <span className="text-sm text-[#0A84FF]">+ {formatBRL(CONFIG.PRICES.MACA)}</span>
                  </button>
                </div>
              </section>

              <button 
                disabled={!booking.date || !booking.time || !booking.location} 
                onClick={() => handleNext('checkout')} 
                className="w-full action-btn rounded-xl py-4 text-lg font-bold tap-target mt-8 mb-8"
              >
                Revisar e Finalizar
              </button>
            </div>
          )}

          {/* --- STEP 4: CHECKOUT --- */}
          {step === 'checkout' && (
            <div className="animate-enter pt-4 pb-24">
              <h2 className="text-2xl font-bold text-white mb-6">Resumo do Pedido</h2>
              
              {/* RECIBO VISUAL */}
              <div className="bg-white text-black rounded-lg p-6 font-mono text-sm relative mb-8 shadow-2xl transform rotate-1">
                <div className="border-b-2 border-dashed border-gray-300 pb-4 mb-4 text-center">
                  <h3 className="font-bold text-xl uppercase tracking-widest">{CONFIG.COMPANY.NAME}</h3>
                  <p className="text-xs text-gray-500">Recibo Provisório</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between font-bold"><span>{booking.service.name}</span><span>{formatBRL(booking.service.price)}</span></div>
                  {booking.extras.touch && <div className="flex justify-between text-gray-600"><span>+ Toque Massagista</span><span>{formatBRL(CONFIG.PRICES.TOUCH)}</span></div>}
                  {booking.extras.upgrade && <div className="flex justify-between text-gray-600"><span>+ 30 Minutos</span><span>{formatBRL(booking.service.price * CONFIG.PRICES.UPGRADE_PCT)}</span></div>}
                  {booking.extras.table && <div className="flex justify-between text-gray-600"><span>+ Maca</span><span>{formatBRL(CONFIG.PRICES.MACA)}</span></div>}
                  {booking.location.fee > 0 && <div className="flex justify-between text-gray-600"><span>+ Taxa Local</span><span>{formatBRL(booking.location.fee)}</span></div>}
                </div>

                <div className="border-t-2 border-black pt-4 flex justify-between items-end">
                  <span className="font-bold text-xl">TOTAL</span>
                  <span className="font-bold text-2xl">{formatBRL(totalCalc)}</span>
                </div>
              </div>

              {/* FORMA DE PAGAMENTO */}
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Como prefere pagar?</h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button onClick={() => updateBooking('payment', 'pix')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${booking.payment === 'pix' ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'glass-card border-white/10 text-gray-400'}`}>
                  <QrCode/> <span className="font-bold">Pix</span>
                </button>
                <button onClick={() => updateBooking('payment', 'dinheiro')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${booking.payment === 'dinheiro' ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'glass-card border-white/10 text-gray-400'}`}>
                  <Banknote/> <span className="font-bold">Dinheiro</span>
                </button>
              </div>

            </div>
          )}

          {/* --- SUCCESS --- */}
          {step === 'success' && (
            <div className="flex flex-col items-center justify-center pt-20 animate-enter text-center">
              <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.4)]">
                <Check size={48} className="text-white"/>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Solicitação Gerada!</h2>
              <p className="text-gray-400 mb-8 max-w-xs mx-auto">Você será redirecionado para o WhatsApp para confirmar os detalhes.</p>
              
              <button onClick={() => setStep('home')} className="secondary-btn px-8 py-3 rounded-xl font-bold">Voltar ao Início</button>
            </div>
          )}

        </div>

        {/* --- STICKY FOOTER (Checkout Only) --- */}
        {step === 'checkout' && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#1C1C1E] border-t border-white/10 p-5 rounded-t-3xl z-50 animate-enter">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm">Total Final</span>
              <span className="text-2xl font-bold text-white">{formatBRL(totalCalc)}</span>
            </div>
            <button onClick={sendToWhatsApp} className="w-full bg-[#32D74B] hover:bg-[#2DB942] text-black font-bold text-lg py-4 rounded-xl shadow-lg flex items-center justify-center gap-2">
              <Send size={20}/> Confirmar no WhatsApp
            </button>
          </div>
        )}

      </div>
      
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
