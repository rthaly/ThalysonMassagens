import { useState, useEffect, useRef } from 'react';
import {
  Check, MapPin, Calendar, Star, ArrowRight, Bed, 
  Home, MessageCircle, Clock, Sparkles, Flame, X, 
  ChevronDown, DollarSign, ShieldCheck, Zap, Ticket, Lock
} from 'lucide-react';

// ==================================================================================
// 1. DESIGN SYSTEM & TOKENS (DARK LUXURY)
// ==================================================================================

const globalStyles = `
/* --- RESET & BASE --- */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; scroll-behavior: smooth; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.02em;
  color: #e5e5e5;
  background: #050505;
  -webkit-font-smoothing: antialiased;
  padding-bottom: env(safe-area-inset-bottom);
  overflow-x: hidden;
}

/* --- SCROLL PHYSICS --- */
section { scroll-margin-top: 120px; }

/* --- BACKGROUNDS --- */
.luxury-bg {
  background: 
    radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 80%),
    radial-gradient(circle at 85% 90%, rgba(20, 20, 255, 0.03), transparent 40%);
  background-attachment: fixed;
  min-height: 100vh;
}

/* --- CARDS --- */
.glass-panel { 
  background: #121212;
  border: 1px solid #2a2a2a; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.glass-panel:active { transform: scale(0.99); background: #1a1a1a; }

.glass-panel-selected {
  border-color: #0A84FF;
  background: rgba(10, 132, 255, 0.05);
  box-shadow: 0 0 0 1px #0A84FF, 0 15px 50px rgba(10, 132, 255, 0.1);
}

/* --- BUTTONS --- */
.primary-btn {
  background: #0A84FF;
  color: white;
  box-shadow: 0 0 20px rgba(10, 132, 255, 0.3);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}
.primary-btn:active { transform: scale(0.97); opacity: 0.9; }

/* --- INPUTS --- */
.smart-input {
  background: #000;
  border: 1px solid #333;
  color: white;
  transition: all 0.3s ease;
  font-size: 16px;
  border-radius: 12px;
}
.smart-input:focus { 
  border-color: #0A84FF; 
  background: #0a0a0a;
}
.smart-input::placeholder { color: #555; }

/* --- ANIMATIONS --- */
.animate-enter { animation: enter 0.7s cubic-bezier(0.2, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(30px); }
@keyframes enter { to { opacity: 1; transform: translateY(0); } }

.animate-pop { animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform: scale(0.8); opacity: 0; }
@keyframes pop { to { transform: scale(1); opacity: 1; } }

/* --- COUPON MODAL --- */
.modal-overlay {
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(10px);
}
`;

// ==================================================================================
// 2. CONFIGURAÇÃO & COPYWRITING (MASCULINO/DIRETO)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  COUPON_VAL: 12, // R$ 12,00
  PRICES: {
    UPGRADE_PCT: 0.5,
    TOUCH: 60,
    AROMA: 0, // Agora grátis para gerar valor
  }
};

const SERVICES = [
  { 
    id: 'completa', 
    name: 'A Experiência (Completa)', 
    desc: 'O carro-chefe. Mix de relaxamento muscular com toques provocantes. Finalização manual intensa garantida.', 
    duration: '60 min', 
    price: 160, 
    badge: 'MAIS PROCURADA 🔥',
    features: ['Corpo a corpo', 'Tântrica', 'Finalização']
  },
  { 
    id: 'relax', 
    name: 'Descompressão Total', 
    desc: 'Pra quem tá travado. Foco em tirar o peso das costas e zerar a mente. Sem pressa, apenas toque firme.', 
    duration: '60 min', 
    price: 130, 
    badge: null,
    features: ['Tira dores', 'Zero Stress', 'Revigorante']
  },
];

const LOCATIONS = [
  { id: 'sp_home', label: 'Sua Casa / Apto (SP)', sub: 'Levo a maca ou na sua cama', fee: 35, icon: Home, input: true },
  { id: 'sp_hotel', label: 'Hotel / Motel (SP)', sub: 'Vou até a sua suíte', fee: 70, icon: Bed, input: true },
];

// ==================================================================================
// 3. UTILS
// ==================================================================================

const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(12); };

// ==================================================================================
// 4. COMPONENTES
// ==================================================================================

const WelcomeCoupon = ({ onClaim }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 800); }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-6 animate-fade-in">
      <div className="bg-[#111] border border-[#333] w-full max-w-sm rounded-[30px] p-6 text-center shadow-2xl animate-pop relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A84FF] to-[#004488]"></div>
        
        <div className="w-16 h-16 bg-[#0A84FF]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0A84FF]/20">
          <Ticket className="w-8 h-8 text-[#0A84FF]" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Você ganhou um presente.</h2>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Para sua primeira experiência de alto nível em SP. Use agora.
        </p>

        <div className="bg-[#000] border border-[#222] border-dashed rounded-xl p-4 mb-6">
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-1">Valor do Cupom</span>
          <span className="text-3xl font-bold text-white tracking-tighter">R$ 12,00</span>
        </div>

        <button 
          onClick={() => { vibrate(); setShow(false); onClaim(); }}
          className="w-full bg-[#0A84FF] text-white font-bold py-4 rounded-[18px] text-[15px] shadow-[0_5px_20px_rgba(10,132,255,0.3)] hover:scale-[1.02] transition-transform"
        >
          RESGATAR DESCONTO
        </button>
        <button onClick={() => setShow(false)} className="mt-4 text-xs text-gray-600 font-medium">Dispensar</button>
      </div>
    </div>
  );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [hasCoupon, setHasCoupon] = useState(false);
  
  // Refs
  const refs = {
    services: useRef(null),
    datetime: useRef(null),
    location: useRef(null),
    addressBlock: useRef(null),
    extras: useRef(null),
    checkout: useRef(null)
  };

  // State
  const [data, setData] = useState({
    name: '',
    age: '',
    service: null,
    date: null,
    time: null,
    location: null,
    // Address Split
    street: '',
    number: '',
    comp: '',
    // Extras
    extras: { upgrade: false, touch: false },
    payment: 'pix'
  });

  const [stage, setStage] = useState(0);

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  // --- LOGIC ---
  const scrollNext = (nextStage, ref, delay = 500) => {
    vibrate();
    if (nextStage > stage) setStage(nextStage);
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, delay);
  };

  const handleIdentity = () => {
    if(data.name.length < 3 || !data.age) return;
    scrollNext(1, refs.services);
  };

  const calcTotal = () => {
    if (!data.service) return 0;
    let total = data.service.price;
    if (data.extras.upgrade) total += (data.service.price * CONFIG.PRICES.UPGRADE_PCT);
    if (data.extras.touch) total += CONFIG.PRICES.TOUCH;
    if (data.location) total += data.location.fee;
    if (hasCoupon) total -= CONFIG.COUPON_VAL;
    return total;
  };

  const isAddressComplete = () => {
      return data.street.length > 3 && data.number.length > 0;
  };

  const generateZap = () => {
    const total = calcTotal();
    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';

    let text = `*NOVO PEDIDO SP* 🔥\n`;
    text += `👤 *${data.name}* (${data.age} anos)\n`;
    text += `🎟️ *Cupom R$12:* ${hasCoupon ? 'APLICADO ✅' : 'NÃO'}\n\n`;
    
    text += `💆 *${data.service.name}*\n`;
    text += `📅 ${dateStr} às ${data.time}\n`;
    text += `📍 *${data.location.label}*\n`;
    
    if (data.location.input) {
        text += `🏠 Rua: ${data.street}, Nº ${data.number}\n`;
        if(data.comp) text += `🏢 Comp: ${data.comp}\n`;
    }

    text += `\n*DETALHES DO VALOR:*\n`;
    text += `Base: ${formatBRL(data.service.price)}\n`;
    text += `Deslocamento: ${formatBRL(data.location.fee)}\n`;
    if(data.extras.upgrade) text += `+30 Minutos: ${formatBRL(data.service.price * CONFIG.PRICES.UPGRADE_PCT)}\n`;
    if(data.extras.touch) text += `Interação: ${formatBRL(CONFIG.PRICES.TOUCH)}\n`;
    if(hasCoupon) text += `Desconto: -${formatBRL(CONFIG.COUPON_VAL)}\n`;

    text += `\n💰 *TOTAL FINAL: ${formatBRL(total)}*`;
    text += `\n💳 Pagamento: ${data.payment.toUpperCase()}`;

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center">
      <div className="w-12 h-12 bg-[#0A84FF] rounded-full animate-ping opacity-20 absolute"></div>
      <div className="w-3 h-3 bg-[#0A84FF] rounded-full relative shadow-[0_0_20px_#0A84FF]"></div>
    </div>
  );

  return (
    <div className="luxury-bg min-h-screen text-gray-200 pb-40">
      <style>{globalStyles}</style>

      <WelcomeCoupon onClaim={() => setHasCoupon(true)} />
      
      {/* HEADER DISCRETO */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 flex justify-between items-center">
        <span className="font-bold text-white tracking-tight text-lg">Thalyson<span className="text-[#0A84FF]">Bot</span></span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#111] rounded-full border border-[#222]">
            <Lock className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Sigilo Total</span>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-24 px-5">

        {/* 1. INTRODUÇÃO & PERFIL */}
        <section className="mb-12 animate-enter">
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">Vamos direto<br/><span className="text-gray-500">ao que interessa.</span></h1>
          <p className="text-gray-500 text-sm mb-8">Personalize sua sessão. Sem julgamentos.</p>

          <div className="space-y-5">
            <div>
                <label className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Como quer ser chamado?</label>
                <input 
                  value={data.name} onChange={e => setData({...data, name: e.target.value})}
                  placeholder="Seu Nome ou Apelido"
                  className="w-full smart-input p-4 text-lg"
                />
            </div>
            <div>
                <label className="text-[10px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Sua Idade</label>
                <input 
                  type="number"
                  value={data.age} onChange={e => setData({...data, age: e.target.value})}
                  placeholder="Ex: 30"
                  className="w-full smart-input p-4 text-lg"
                />
            </div>

            {stage === 0 && (
                <button 
                  disabled={data.name.length < 3 || !data.age}
                  onClick={handleIdentity}
                  className="primary-btn w-full py-4 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 mt-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Continuar <ArrowRight size={18}/>
                </button>
            )}
          </div>
        </section>

        {/* 2. SERVIÇOS */}
        {stage >= 1 && (
            <section ref={refs.services} className="mb-12 animate-enter">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-6 h-6 rounded-full bg-[#0A84FF] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_#0A84FF]">1</div>
                    <h2 className="text-xl font-bold text-white">Escolha a Vibe</h2>
                </div>

                <div className="space-y-4">
                    {SERVICES.map(s => {
                        const active = data.service?.id === s.id;
                        return (
                            <button key={s.id} onClick={() => { setData({...data, service: s}); scrollNext(2, refs.datetime); }}
                                className={`w-full p-6 rounded-[24px] text-left relative glass-panel ${active ? 'glass-panel-selected' : ''}`}
                            >
                                {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-bold px-3 py-1 rounded-bl-xl">{s.badge}</div>}
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-white">{s.name}</h3>
                                    <span className="text-[#0A84FF] font-bold">{formatBRL(s.price)}</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-[90%]">{s.desc}</p>
                                <div className="flex gap-2">
                                    {s.features.map(f => <span key={f} className="text-[10px] bg-[#222] text-gray-300 px-2 py-1 rounded border border-[#333]">{f}</span>)}
                                </div>
                            </button>
                        )
                    })}
                </div>
            </section>
        )}

        {/* 3. DATA E HORA */}
        {stage >= 2 && (
            <section ref={refs.datetime} className="mb-12 animate-enter">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-6 h-6 rounded-full bg-[#0A84FF] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_#0A84FF]">2</div>
                    <h2 className="text-xl font-bold text-white">Quando?</h2>
                </div>

                <div className="glass-panel p-5 rounded-[24px]">
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
                        {[...Array(7)].map((_, i) => {
                            const d = new Date(); d.setDate(d.getDate() + i);
                            const isSel = data.date && data.date.getDate() === d.getDate();
                            return (
                                <button key={i} onClick={() => { vibrate(); setData({...data, date: d, time: null}); }}
                                    className={`min-w-[60px] h-[70px] rounded-[14px] flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#111] border-[#222] text-gray-500'}`}
                                >
                                    <span className="text-[9px] uppercase font-bold mb-1">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                    <span className="text-lg font-bold">{d.getDate()}</span>
                                </button>
                            )
                        })}
                    </div>
                    
                    <div className={`grid grid-cols-4 gap-2 transition-all duration-300 ${data.date ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                        {['09:00','11:00','13:00','15:00','17:00','19:00','21:00','23:00'].map(t => (
                            <button key={t} onClick={() => { setData({...data, time: t}); scrollNext(3, refs.location); }}
                                className={`py-2 rounded-[10px] text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] border-[#222] text-gray-400 hover:bg-[#222]'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* 4. LOCALIZAÇÃO (SP ONLY - FRAGMENTADO) */}
        {stage >= 3 && (
            <section ref={refs.location} className="mb-12 animate-enter">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-6 h-6 rounded-full bg-[#0A84FF] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_#0A84FF]">3</div>
                    <h2 className="text-xl font-bold text-white">Local (São Paulo)</h2>
                </div>

                <div className="space-y-3">
                    {LOCATIONS.map(loc => {
                        const isSel = data.location?.id === loc.id;
                        return (
                            <div key={loc.id}>
                                <button onClick={() => { setData({...data, location: loc, street:'', number:'', comp:''}); }}
                                    className={`w-full p-4 rounded-[20px] border flex items-center justify-between transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-panel border-transparent'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#222] text-gray-500'}`}><loc.icon size={16} /></div>
                                        <div className="text-left">
                                            <div className="font-bold text-white text-sm">{loc.label}</div>
                                            <div className="text-[10px] text-gray-500">{loc.sub}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-[#0A84FF]">+ {formatBRL(loc.fee)}</span>
                                </button>

                                {/* ENDEREÇO FRAGMENTADO - UX REFINADA */}
                                {isSel && loc.input && (
                                    <div ref={refs.addressBlock} className="mt-4 pl-4 space-y-3 animate-enter">
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Rua / Avenida</label>
                                            <input 
                                                value={data.street} onChange={e => setData({...data, street: e.target.value})}
                                                placeholder="Nome da rua"
                                                className="w-full smart-input p-3"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1/3">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Número</label>
                                                <input 
                                                    type="tel"
                                                    value={data.number} onChange={e => setData({...data, number: e.target.value})}
                                                    placeholder="Nº"
                                                    className="w-full smart-input p-3"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Comp/Apto (Opcional)</label>
                                                <input 
                                                    value={data.comp} onChange={e => setData({...data, comp: e.target.value})}
                                                    placeholder="Apto 12..."
                                                    className="w-full smart-input p-3"
                                                />
                                            </div>
                                        </div>
                                        
                                        {isAddressComplete() && (
                                            <button onClick={() => scrollNext(4, refs.extras, 200)} className="w-full bg-[#111] border border-[#333] text-white py-3 rounded-xl text-xs font-bold mt-2 hover:bg-[#222]">
                                                Confirmar Endereço
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>
        )}

        {/* 5. EXTRAS */}
        {stage >= 4 && (
            <section ref={refs.extras} className="mb-32 animate-enter">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-6 h-6 rounded-full bg-[#0A84FF] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_#0A84FF]">4</div>
                    <h2 className="text-xl font-bold text-white">Toque Final</h2>
                </div>

                <div className="glass-panel p-2 rounded-[24px] mb-8">
                     <button onClick={() => { vibrate(); setData({...data, extras: {...data.extras, upgrade: !data.extras.upgrade}}); }}
                        className={`w-full p-4 flex justify-between items-center border-b border-[#222] transition-colors ${data.extras.upgrade ? 'bg-[#0A84FF]/5' : ''}`}
                     >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${data.extras.upgrade ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444]'}`}>
                                {data.extras.upgrade && <Check size={12} className="text-white"/>}
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-white">+30 Minutos</span>
                                <span className="text-[10px] text-gray-500">Mais tempo de prazer</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-[#0A84FF]">+ {formatBRL(data.service.price * CONFIG.PRICES.UPGRADE_PCT)}</span>
                     </button>

                     <button onClick={() => { vibrate(); setData({...data, extras: {...data.extras, touch: !data.extras.touch}}); }}
                        className={`w-full p-4 flex justify-between items-center transition-colors ${data.extras.touch ? 'bg-[#FF375F]/5' : ''}`}
                     >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${data.extras.touch ? 'bg-[#FF375F] border-[#FF375F]' : 'border-[#444]'}`}>
                                {data.extras.touch && <Check size={12} className="text-white"/>}
                            </div>
                            <div className="text-left">
                                <span className="block text-sm font-bold text-white">Interação / Toque</span>
                                <span className="text-[10px] text-gray-500">Liberado tocar o massagista</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-[#FF375F]">+ {formatBRL(CONFIG.PRICES.TOUCH)}</span>
                     </button>
                </div>
            </section>
        )}

      </main>

      {/* FOOTER CHECKOUT */}
      {stage >= 4 && (
        <div className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="h-24 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            <div className="bg-[#0f0f0f] border-t border-[#222] p-6 pb-8 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] max-w-md mx-auto">
                <div className="flex justify-between items-end mb-4 px-1">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Total Confirmado</span>
                        <div className="flex items-baseline gap-2">
                             <span className="text-3xl font-bold text-white tracking-tighter">{formatBRL(calcTotal())}</span>
                             {hasCoupon && <span className="text-[10px] text-[#0A84FF] bg-[#0A84FF]/10 px-2 py-0.5 rounded font-bold"> -{formatBRL(CONFIG.COUPON_VAL)} OFF</span>}
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={generateZap}
                  disabled={!data.location}
                  className="w-full primary-btn h-14 rounded-[18px] font-bold text-[16px] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_#0A84FF]"
                >
                    <MessageCircle size={20} fill="currentColor"/>
                    GARANTIR HORÁRIO
                </button>
            </div>
        </div>
      )}

    </div>
  );
}
