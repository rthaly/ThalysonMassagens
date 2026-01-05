import { useState, useEffect, useRef } from 'react';
import {
  Check, MapPin, Calendar, Star, ArrowRight, Bed, 
  Home, MessageCircle, Clock, Sparkles, Flame, X, 
  ChevronDown, DollarSign, ShieldCheck, Zap
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
  letter-spacing: -0.02em;
  color: #fff;
  background: #000;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

/* --- SCROLL PHYSICS & OFFSET --- */
/* O segredo para o scroll perfeito: margem invisível no topo de cada seção */
section { scroll-margin-top: 100px; }

/* --- BACKGROUNDS --- */
.luxury-bg {
  background: 
    radial-gradient(circle at 10% 20%, rgba(20, 20, 25, 1) 0%, #000000 80%),
    radial-gradient(circle at 90% 90%, rgba(10, 132, 255, 0.05), transparent 50%);
  background-attachment: fixed;
  min-height: 100vh;
}

/* --- CARDS & GLASSMORPHISM --- */
.glass-panel { 
  background: rgba(28, 28, 30, 0.6); 
  backdrop-filter: blur(40px) saturate(180%); 
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.glass-panel:active { transform: scale(0.98); }

.glass-panel-selected {
  border-color: #0A84FF;
  background: rgba(10, 132, 255, 0.08);
  box-shadow: 0 0 0 1px #0A84FF, 0 10px 40px rgba(10, 132, 255, 0.15);
}

/* --- BUTTONS --- */
.primary-btn {
  background: #007AFF;
  color: white;
  box-shadow: 0 8px 25px rgba(0, 122, 255, 0.4);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}
.primary-btn:active { transform: scale(0.96); box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3); }

/* --- INPUTS --- */
.smart-input {
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  transition: all 0.3s ease;
  font-size: 16px; /* Evita zoom no iPhone */
}
.smart-input:focus { 
  border-color: #0A84FF; 
  background: rgba(10, 132, 255, 0.05);
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.2); 
}

/* --- ANIMATIONS --- */
.animate-enter { animation: enter 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
@keyframes enter { to { opacity: 1; transform: translateY(0); } }

.pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}
@keyframes pulse-ring {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); }
}
`;

// ==================================================================================
// 2. CONFIGURAÇÃO & DADOS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", // Seu número
  PRICES: {
    UPGRADE_PCT: 0.5, // +50%
    TOUCH: 60,
    AROMA: 15,
    MACA_SETUP: 30 // Taxa de montagem de maca se necessário (futuro)
  }
};

const SERVICES = [
  { 
    id: 'masculina', 
    name: 'Massagem Masculina', 
    desc: 'Relaxamento muscular + Tântrica. A experiência completa com finalização.', 
    duration: '60 min', 
    price: 160, 
    badge: 'MAIS PEDIDA 🔥',
    features: ['Corpo a corpo', 'Tântrica', 'Finalização']
  },
  { 
    id: 'relaxante', 
    name: 'Massagem Relaxante', 
    desc: 'Foco total em tirar dores, tensão e stress. Sem foco sexual.', 
    duration: '60 min', 
    price: 130, 
    badge: null,
    features: ['Tira dores', 'Óleos Essenciais', 'Música Zen']
  },
];

const LOCATIONS = [
  { id: 'santa-fe', label: 'Delivery (Sua Casa)', sub: 'Eu levo a maca ou na cama', fee: 25, icon: Home, input: true },
  { id: 'motel', label: 'Motel / Hotel', sub: 'Vou até a sua suíte', fee: 70, icon: Bed, input: false },
];

const TIME_SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00', '21:00', '23:00'];

// ==================================================================================
// 3. UTILS
// ==================================================================================

const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };

// ==================================================================================
// 4. COMPONENTES UI
// ==================================================================================

const Header = ({ progress }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
    <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Agendamento VIP</span>
        <h1 className="text-lg font-bold text-white tracking-tight">Thalyson<span className="text-[#0A84FF]">Bot</span></h1>
      </div>
      <div className="flex items-center gap-2 bg-[#1C1C1E] px-3 py-1.5 rounded-full border border-white/10">
        <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse"></div>
        <span className="text-[10px] font-bold text-gray-300">ONLINE</span>
      </div>
    </div>
    {/* Barra de Progresso Real */}
    <div className="h-[2px] bg-gray-800 w-full">
      <div className="h-full bg-[#0A84FF] transition-all duration-500 ease-out shadow-[0_0_10px_#0A84FF]" style={{ width: `${progress}%` }}></div>
    </div>
  </header>
);

const SectionTitle = ({ step, title, active }) => (
  <div className={`flex items-center gap-3 mb-5 transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-40 grayscale'}`}>
    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold transition-all ${active ? 'bg-[#0A84FF] text-white shadow-lg shadow-blue-900/50' : 'bg-gray-800 text-gray-500'}`}>
      {step}
    </div>
    <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
  </div>
);

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  
  // Refs para Scroll
  const refs = {
    identity: useRef(null),
    services: useRef(null),
    datetime: useRef(null),
    location: useRef(null),
    addressInput: useRef(null),
    extras: useRef(null),
    checkout: useRef(null)
  };

  // Estado do Pedido
  const [data, setData] = useState({
    name: '',
    isAdult: false,
    service: null,
    date: null,
    time: null,
    location: null,
    address: '',
    extras: { upgrade: false, touch: false, aroma: false },
    payment: 'pix'
  });

  // Controle de Fluxo (Stages: 0 a 5)
  const [stage, setStage] = useState(0);

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  // --- LÓGICA DE SCROLL INTELIGENTE ---
  const advanceTo = (nextStage, refTarget, delay = 400) => {
    vibrate();
    if (nextStage > stage) setStage(nextStage);
    
    setTimeout(() => {
      if (refTarget && refTarget.current) {
        refTarget.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Se for input, foca nele
        if (refTarget === refs.addressInput) {
           setTimeout(() => refTarget.current.focus(), 500); // Delay extra pro scroll terminar antes do teclado subir
        }
      }
    }, delay);
  };

  // --- HANDLERS ---
  const handleIdentity = () => {
    if(data.name.length < 3 || !data.isAdult) return;
    advanceTo(1, refs.services);
  };

  const handleService = (s) => {
    setData({ ...data, service: s });
    advanceTo(2, refs.datetime);
  };

  const handleDate = (d) => {
    const newDate = new Date();
    newDate.setDate(new Date().getDate() + d);
    setData({ ...data, date: newDate, time: null }); // Reset time on date change
  };

  const handleTime = (t) => {
    setData({ ...data, time: t });
    advanceTo(3, refs.location);
  };

  const handleLocation = (loc) => {
    const isDelivery = loc.input;
    setData({ ...data, location: loc, address: '' }); // Reset address
    
    if (isDelivery) {
      advanceTo(4, refs.addressInput, 300);
    } else {
      advanceTo(4, refs.extras, 300);
    }
  };

  const handleAddressBlur = () => {
      if(data.address.length > 5) advanceTo(4, refs.extras, 200);
  };

  // --- CÁLCULO DE TOTAL ---
  const calcTotal = () => {
    if (!data.service) return 0;
    let total = data.service.price;
    if (data.extras.upgrade) total += (data.service.price * CONFIG.PRICES.UPGRADE_PCT);
    if (data.extras.touch) total += CONFIG.PRICES.TOUCH;
    if (data.extras.aroma) total += CONFIG.PRICES.AROMA_AROMA;
    if (data.location) total += data.location.fee;
    return total;
  };

  // --- GERADOR DE WHATSAPP ---
  const sendOrder = () => {
    vibrate();
    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'}) : '';
    const total = calcTotal();

    let text = `*NOVO AGENDAMENTO VIP* 💎\n`;
    text += `👤 *${data.name}*\n\n`;
    
    text += `💆 *${data.service.name}*\n`;
    text += `📅 ${dateStr} às ${data.time}\n`;
    text += `📍 ${data.location.label} ${data.location.input ? `\n🏠 ${data.address}` : ''}\n\n`;
    
    text += `*EXTRAS & VALORES:*\n`;
    text += `• Base: ${formatBRL(data.service.price)}\n`;
    if(data.location.fee > 0) text += `• Taxa Local: ${formatBRL(data.location.fee)}\n`;
    if(data.extras.upgrade) text += `• Upgrade 30min: ${formatBRL(data.service.price * CONFIG.PRICES.UPGRADE_PCT)}\n`;
    if(data.extras.touch) text += `• Interação/Toque: ${formatBRL(CONFIG.PRICES.TOUCH)}\n`;
    
    text += `\n💰 *TOTAL FINAL: ${formatBRL(total)}*`;
    text += `\n💳 Pagamento: ${data.payment.toUpperCase()}`;

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-[#0A84FF] rounded-full animate-spin mb-4"></div>
      <p className="text-[#0A84FF] text-xs font-bold tracking-[0.3em] animate-pulse">CARREGANDO</p>
    </div>
  );

  return (
    <div className="luxury-bg min-h-screen text-gray-200 pb-32">
      <style>{globalStyles}</style>
      
      <Header progress={(stage / 4) * 100} />

      <main className="max-w-md mx-auto pt-24 px-5">
        
        {/* --- 1. IDENTIDADE (SEMPRE VISÍVEL) --- */}
        <section ref={refs.identity} className="mb-12 animate-enter">
          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">Olá.<br/><span className="text-gray-500 text-2xl font-normal">Vamos agendar seu relaxamento.</span></h2>
          
          <div className="mt-8 space-y-4">
            <div>
              <label className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block">Seu Nome</label>
              <input 
                value={data.name}
                onChange={e => setData({...data, name: e.target.value})}
                placeholder="Digite seu nome..."
                className="w-full bg-transparent border-b border-gray-700 text-2xl text-white py-2 focus:border-[#0A84FF] outline-none placeholder:text-gray-800 transition-all"
              />
            </div>

            <button 
              onClick={() => { vibrate(); setData({...data, isAdult: !data.isAdult}); }}
              className={`w-full py-4 flex items-center gap-3 transition-colors ${data.isAdult ? 'opacity-100' : 'opacity-60'}`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${data.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>
                {data.isAdult && <Check size={12} className="text-white"/>}
              </div>
              <span className="text-sm">Confirmo ter +18 anos</span>
            </button>

            {stage === 0 && (
              <button 
                disabled={data.name.length < 3 || !data.isAdult}
                onClick={handleIdentity}
                className="primary-btn w-full py-4 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 mt-2 disabled:opacity-30 disabled:scale-100"
              >
                Começar <ArrowRight size={18}/>
              </button>
            )}
          </div>
        </section>

        {/* --- 2. SERVIÇOS --- */}
        {stage >= 1 && (
          <section ref={refs.services} className="mb-12 animate-enter">
            <SectionTitle step="1" title="Escolha a Experiência" active={true} />
            <div className="space-y-4">
              {SERVICES.map(s => {
                const active = data.service?.id === s.id;
                return (
                  <button 
                    key={s.id} 
                    onClick={() => handleService(s)}
                    className={`w-full p-5 rounded-[24px] text-left relative overflow-hidden group glass-panel ${active ? 'glass-panel-selected' : ''}`}
                  >
                    {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-bold px-3 py-1 rounded-bl-xl">{s.badge}</div>}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white">{s.name}</h3>
                      <span className="text-[#0A84FF] font-bold">{formatBRL(s.price)}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-[90%]">{s.desc}</p>
                    <div className="flex gap-2 flex-wrap">
                      {s.features.map(f => (
                        <span key={f} className="text-[10px] bg-white/5 border border-white/5 text-gray-300 px-2 py-1 rounded">{f}</span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* --- 3. DATA & HORA --- */}
        {stage >= 2 && (
          <section ref={refs.datetime} className="mb-12 animate-enter">
            <SectionTitle step="2" title="Data e Hora" active={true} />
            <div className="glass-panel p-5 rounded-[24px]">
              {/* Data Horizontal */}
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-4">
                {[...Array(10)].map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isToday = i === 0;
                  const isSel = data.date && data.date.getDate() === d.getDate();
                  return (
                    <button 
                      key={i} 
                      onClick={() => { vibrate(); handleDate(i); }}
                      className={`min-w-[64px] h-[74px] rounded-[18px] flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#2C2C2E] border-transparent text-gray-500'}`}
                    >
                      <span className="text-[9px] uppercase font-bold mb-0.5">{isToday ? 'HOJE' : d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                      <span className="text-lg font-bold text-white">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              {/* Grid de Horas (Só aparece se tiver data) */}
              <div className={`grid grid-cols-4 gap-2 transition-all duration-500 ${data.date ? 'opacity-100 max-h-96' : 'opacity-20 max-h-0 overflow-hidden'}`}>
                {TIME_SLOTS.map(t => {
                   const isSel = data.time === t;
                   return (
                    <button 
                      key={t} 
                      onClick={() => { vibrate(); handleTime(t); }}
                      className={`py-2.5 rounded-[12px] text-xs font-bold border transition-all ${isSel ? 'bg-white text-black border-white' : 'bg-[#2C2C2E] border-transparent text-gray-400 hover:bg-[#3A3A3C]'}`}
                    >
                      {t}
                    </button>
                   )
                })}
              </div>
            </div>
          </section>
        )}

        {/* --- 4. LOCAL --- */}
        {stage >= 3 && (
          <section ref={refs.location} className="mb-12 animate-enter">
            <SectionTitle step="3" title="Onde será?" active={true} />
            <div className="space-y-3">
              {LOCATIONS.map(loc => {
                const Icon = loc.icon;
                const isSel = data.location?.id === loc.id;
                return (
                  <div key={loc.id}>
                    <button 
                      onClick={() => { vibrate(); handleLocation(loc); }}
                      className={`w-full p-4 rounded-[20px] border flex items-center justify-between transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-panel border-transparent'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#2C2C2E] text-gray-500'}`}>
                          <Icon size={18} />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-white text-sm">{loc.label}</h4>
                          <p className="text-[11px] text-gray-400">{loc.sub}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#FFD60A]">+ {formatBRL(loc.fee)}</span>
                    </button>

                    {/* Input de Endereço Inteligente */}
                    {isSel && loc.input && (
                      <div className="mt-3 pl-4 animate-enter">
                        <input 
                          ref={refs.addressInput}
                          value={data.address}
                          onBlur={handleAddressBlur}
                          onChange={e => setData({...data, address: e.target.value})}
                          placeholder="Digite Rua, Número e Bairro..."
                          className="w-full smart-input p-4 rounded-[16px]"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* --- 5. EXTRAS (UPSELL) --- */}
        {stage >= 4 && (
          <section ref={refs.extras} className="mb-40 animate-enter">
            <SectionTitle step="4" title="Personalize" active={true} />
            
            <div className="glass-panel p-1 rounded-[24px] mb-6">
              {[
                { key: 'upgrade', icon: Clock, label: '+30 Minutos', sub: 'Estenda o prazer', price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT, color: 'text-[#0A84FF]' },
                { key: 'touch', icon: Zap, label: 'Interação/Toque', sub: 'Toque o massagista', price: CONFIG.PRICES.TOUCH, color: 'text-[#FF375F]' },
                { key: 'aroma', icon: Sparkles, label: 'Aromaterapia', sub: 'Óleos essenciais', price: CONFIG.PRICES.AROMA, color: 'text-[#32D74B]' },
              ].map((item, idx) => (
                <button 
                  key={item.key}
                  onClick={() => { vibrate(); setData({...data, extras: {...data.extras, [item.key]: !data.extras[item.key]}}); }}
                  className={`w-full p-4 flex justify-between items-center transition-all ${idx !== 2 ? 'border-b border-white/5' : ''} ${data.extras[item.key] ? 'bg-white/5' : ''}`}
                >
                  <div className="flex items-center gap-3">
                     <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${data.extras[item.key] ? 'bg-white border-white' : 'border-gray-600'}`}>
                        {data.extras[item.key] && <Check size={12} className="text-black"/>}
                     </div>
                     <div className="text-left">
                        <span className="block text-sm font-bold text-gray-200">{item.label}</span>
                        <span className="text-[10px] text-gray-500">{item.sub}</span>
                     </div>
                  </div>
                  <span className={`text-sm font-bold ${item.color}`}>+ {formatBRL(item.price)}</span>
                </button>
              ))}
            </div>

            <div className="glass-panel p-5 rounded-[24px]">
               <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Pagamento</h4>
               <div className="flex gap-2">
                 {['pix', 'cartão', 'dinheiro'].map(m => (
                   <button 
                    key={m} 
                    onClick={() => { vibrate(); setData({...data, payment: m})}}
                    className={`flex-1 py-3 rounded-[12px] text-[11px] font-bold border uppercase transition-all ${data.payment === m ? 'bg-white text-black border-white' : 'bg-[#2C2C2E] border-transparent text-gray-500'}`}
                   >
                     {m}
                   </button>
                 ))}
               </div>
            </div>
          </section>
        )}

      </main>

      {/* --- CHECKOUT FOOTER (STICKY) --- */}
      <div 
        ref={refs.checkout}
        className={`fixed bottom-0 left-0 right-0 z-[60] transition-transform duration-500 ease-in-out ${stage >= 4 ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="h-24 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-full w-full pointer-events-none"></div>
        
        <div className="bg-[#1C1C1E] border-t border-white/10 p-6 pb-8 rounded-t-[32px] shadow-[0_-10px_50px_rgba(0,0,0,0.7)] max-w-md mx-auto">
          
          {/* Resumo Expansível */}
          <div className="flex justify-between items-end mb-5 px-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Final</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tighter">{formatBRL(calcTotal())}</span>
                {data.location?.fee > 0 && <span className="text-[10px] text-[#0A84FF] font-medium bg-[#0A84FF]/10 px-1.5 py-0.5 rounded">Taxa Inclusa</span>}
              </div>
            </div>
          </div>

          <button 
            onClick={sendOrder}
            disabled={!data.location || (data.location.input && data.address.length < 5)}
            className="w-full primary-btn h-16 rounded-[22px] font-bold text-[16px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale pulse-ring"
          >
            <MessageCircle size={22} fill="currentColor" />
            CONFIRMAR AGENDAMENTO
          </button>
        </div>
      </div>

    </div>
  );
}
