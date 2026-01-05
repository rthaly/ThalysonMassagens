import { useState, useEffect, useRef } from 'react';
import {
  Check, MapPin, Star, ArrowRight, Bed, 
  Home, MessageCircle, Clock, Zap, Ticket, Lock,
  ShieldCheck, Map, Navigation, User
} from 'lucide-react';

// ==================================================================================
// 1. DESIGN SYSTEM (DARK LUXURY)
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

/* --- SCROLL OFFSET (CRUCIAL PARA O SCROLL PERFEITO) --- */
section { scroll-margin-top: 130px; }

/* --- BACKGROUNDS --- */
.luxury-bg {
  background: 
    radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 70%),
    radial-gradient(circle at 85% 90%, rgba(10, 132, 255, 0.03), transparent 40%);
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
.glass-panel:active { transform: scale(0.98); background: #1a1a1a; }

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
  background: #080808;
  border: 1px solid #333;
  color: white;
  transition: all 0.3s ease;
  font-size: 16px;
  border-radius: 12px;
}
.smart-input:focus { 
  border-color: #0A84FF; 
  background: #0f0f0f;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.1);
}
.smart-input::placeholder { color: #444; }

/* --- ANIMATIONS --- */
.animate-enter { animation: enter 0.7s cubic-bezier(0.2, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(30px); }
@keyframes enter { to { opacity: 1; transform: translateY(0); } }

.animate-pop { animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform: scale(0.8); opacity: 0; }
@keyframes pop { to { transform: scale(1); opacity: 1; } }
`;

// ==================================================================================
// 2. CONFIGURAÇÃO & COPYWRITING (MASCULINO/SIGILOSO)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  COUPON_VAL: 12, 
  PRICES: {
    UPGRADE_PCT: 0.5,
    TOUCH: 60,
  }
};

const REVIEWS = [
  { t: "O cara entende do assunto. Finalização top e sigilo total.", a: "M. (Casado)", s: 5 },
  { t: "Fui tenso e saí leve. A massagem é forte e relaxante.", a: "Bruno (32)", s: 5 },
  { t: "Atendeu no meu hotel, super discreto. Recomendo.", a: "Viajante SP", s: 5 },
  { t: "Melhor experiência que tive em SP. Vale o valor.", a: "Anon", s: 5 },
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'A Experiência (Completa)', 
    desc: 'O que você procura. Relaxamento muscular seguido daquela atenção especial. Toque tântrico, corpo a corpo e finalização manual intensa.', 
    duration: '60 min', 
    price: 160, 
    badge: 'A PREFERIDA 😈',
    features: ['Corpo a corpo', 'Tântrica', 'Finalização']
  },
  { 
    id: 'relax', 
    name: 'Relaxante Muscular', 
    desc: 'Pra quem tá travado do treino ou trabalho. Foco em zerar as dores nas costas e pernas. Terapia manual firme. Sem foco sexual.', 
    duration: '60 min', 
    price: 130, 
    badge: null,
    features: ['Tira Dores', 'Óleos', 'Revigorante']
  },
];

const LOCATIONS = [
  { id: 'sp_home', label: 'Sua Casa / Apto (SP)', sub: 'Atendimento na sua cama', fee: 35, icon: Home, input: true },
  { id: 'sp_hotel', label: 'Hotel / Motel (SP)', sub: 'Vou até a sua suíte', fee: 70, icon: Bed, input: true },
];

// ==================================================================================
// 3. UTILS
// ==================================================================================

const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };

// ==================================================================================
// 4. COMPONENTES
// ==================================================================================

const WelcomeCoupon = ({ onClaim }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setTimeout(() => setShow(true), 1000); }, []);
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-enter">
      <div className="bg-[#111] border border-[#333] w-full max-w-sm rounded-[30px] p-6 text-center shadow-2xl relative overflow-hidden">
        <div className="w-14 h-14 bg-[#0A84FF]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0A84FF]/20">
          <Ticket className="w-7 h-7 text-[#0A84FF]" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Presente de Boas-vindas</h2>
        <p className="text-gray-400 text-sm mb-6">Comece sua experiência em alto nível.</p>
        <div className="bg-[#000] border border-[#222] border-dashed rounded-xl p-4 mb-6">
          <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Desconto Liberado</span>
          <span className="text-3xl font-bold text-white tracking-tighter">R$ 12,00</span>
        </div>
        <button onClick={() => { vibrate(); setShow(false); onClaim(); }} className="w-full bg-[#0A84FF] text-white font-bold py-4 rounded-[18px] text-[15px]">RESGATAR AGORA</button>
      </div>
    </div>
  );
};

const ReviewsCarousel = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="mb-8 animate-enter">
       <div className="bg-[#111] border border-[#222] rounded-[20px] p-4 flex gap-4 items-center">
          <div className="flex-1">
             <div className="flex text-[#FFD60A] mb-1">
               {[...Array(5)].map((_,i) => <Star key={i} size={12} fill="currentColor"/>)}
             </div>
             <p className="text-xs text-gray-300 italic leading-snug">"{REVIEWS[idx].t}"</p>
             <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase text-right">- {REVIEWS[idx].a}</p>
          </div>
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
  const [success, setSuccess] = useState(false); // Tela de Sucesso
  
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
    name: '', age: '', service: null, date: null, time: null, location: null,
    street: '', number: '', district: '', comp: '',
    extras: { upgrade: false, touch: false }, payment: 'pix'
  });

  const [stage, setStage] = useState(0);

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  // --- LOGIC ---
  const scrollTo = (ref, delay = 400) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, delay);
  };

  const nextStage = (lvl, ref) => {
    vibrate();
    if(lvl > stage) setStage(lvl);
    scrollTo(ref);
  };

  const handleIdentity = () => {
    if(data.name.length < 3 || !data.age) return;
    nextStage(1, refs.services);
  };

  const handleAddressComplete = () => {
     if(data.street && data.number && data.district) {
         nextStage(4, refs.extras);
     } else {
         alert("Preencha Rua, Número e Bairro.");
     }
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

  const finishOrder = () => {
    const total = calcTotal();
    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';

    let text = `*SOLICITAÇÃO VIP (SP)* 🕶️\n`;
    text += `👤 *${data.name}* (${data.age} anos)\n`;
    
    text += `💆 *${data.service.name}*\n`;
    text += `📅 ${dateStr} às ${data.time}\n`;
    text += `📍 *${data.location.label}*\n`;
    
    if (data.location.input) {
        text += `🏠 ${data.street}, ${data.number}\n`;
        text += `🏘️ Bairro: ${data.district}\n`;
        if(data.comp) text += `🏢 Comp: ${data.comp}\n`;
    }

    text += `\n*RESUMO:*\n`;
    text += `Serviço: ${formatBRL(data.service.price)}\n`;
    if(data.location.fee > 0) text += `Taxa: ${formatBRL(data.location.fee)}\n`;
    if(data.extras.upgrade) text += `Upgrade 30min: ${formatBRL(data.service.price * CONFIG.PRICES.UPGRADE_PCT)}\n`;
    if(data.extras.touch) text += `Interação: ${formatBRL(CONFIG.PRICES.TOUCH)}\n`;
    if(hasCoupon) text += `Cupom: -${formatBRL(CONFIG.COUPON_VAL)}\n`;

    text += `\n💰 *TOTAL: ${formatBRL(total)}*`;
    text += `\n💳 Pagto: ${data.payment.toUpperCase()}`;

    // Abrir WhatsApp e mostrar tela de sucesso
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
    setSuccess(true);
  };

  const resetApp = () => {
      setSuccess(false);
      setStage(0);
      setData({ ...data, service: null, date: null, time: null, location: null, street: '', number: '', district: '', comp: '', extras: {upgrade: false, touch: false} });
      window.scrollTo(0,0);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-[#0A84FF] rounded-full animate-spin mb-4"></div>
      <p className="text-[#0A84FF] text-[10px] font-bold tracking-[0.3em] animate-pulse">CARREGANDO</p>
    </div>
  );

  // --- TELA DE SUCESSO ---
  if (success) return (
      <div className="fixed inset-0 bg-black z-[300] flex flex-col items-center justify-center p-8 animate-enter text-center">
          <div className="w-24 h-24 bg-[#32D74B]/20 rounded-full flex items-center justify-center mb-6 border border-[#32D74B]/30 shadow-[0_0_40px_rgba(50,215,75,0.2)]">
              <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Solicitação Enviada!</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">Sua mensagem já está no meu WhatsApp.<br/>Te respondo em instantes para confirmar.</p>
          
          <button onClick={resetApp} className="w-full bg-[#222] border border-[#333] text-white py-4 rounded-[18px] font-bold hover:bg-[#333] transition-colors">
              Voltar ao Início
          </button>
      </div>
  );

  // --- APP NORMAL ---
  return (
    <div className="luxury-bg min-h-screen text-gray-200 pb-40">
      <style>{globalStyles}</style>

      <WelcomeCoupon onClaim={() => setHasCoupon(true)} />
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5 py-4 px-6 flex justify-between items-center transition-all">
        <span className="font-bold text-white tracking-tight text-lg">Thalyson<span className="text-[#0A84FF]">Massagens</span></span>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#111] rounded-full border border-[#222]">
            <Lock className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Sigilo</span>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-24 px-5">

        {/* 1. INTRODUÇÃO */}
        <section className="mb-12 animate-enter">
          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">Para quem<br/><span className="text-gray-500">entende do assunto.</span></h1>
          <p className="text-gray-500 text-sm mb-6">Personalize sua sessão. Sigilo absoluto.</p>

          <ReviewsCarousel />

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                    <label className="text-[9px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Nome / Apelido</label>
                    <input 
                      value={data.name} onChange={e => setData({...data, name: e.target.value})}
                      placeholder="Como te chamo?"
                      className="w-full smart-input p-4 text-base"
                    />
                </div>
                <div>
                    <label className="text-[9px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Idade</label>
                    <input 
                      type="tel"
                      value={data.age} onChange={e => setData({...data, age: e.target.value})}
                      placeholder="30"
                      className="w-full smart-input p-4 text-base text-center"
                    />
                </div>
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
                    <h2 className="text-xl font-bold text-white">Escolha a Sessão</h2>
                </div>

                <div className="space-y-4">
                    {SERVICES.map(s => {
                        const active = data.service?.id === s.id;
                        return (
                            <button key={s.id} onClick={() => { setData({...data, service: s}); nextStage(2, refs.datetime); }}
                                className={`w-full p-6 rounded-[24px] text-left relative glass-panel ${active ? 'glass-panel-selected' : ''}`}
                            >
                                {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-bold px-3 py-1 rounded-bl-xl">{s.badge}</div>}
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-white">{s.name}</h3>
                                    <span className="text-[#0A84FF] font-bold">{formatBRL(s.price)}</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-[95%]">{s.desc}</p>
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
                    <h2 className="text-xl font-bold text-white">Horário</h2>
                </div>

                <div className="glass-panel p-5 rounded-[24px]">
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
                        {[...Array(7)].map((_, i) => {
                            const d = new Date(); d.setDate(d.getDate() + i);
                            const isSel = data.date && data.date.getDate() === d.getDate();
                            return (
                                <button key={i} onClick={() => { vibrate(); setData({...data, date: d, time: null}); }}
                                    className={`min-w-[60px] h-[72px] rounded-[14px] flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#111] border-[#222] text-gray-500'}`}
                                >
                                    <span className="text-[9px] uppercase font-bold mb-1">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                    <span className="text-lg font-bold">{d.getDate()}</span>
                                </button>
                            )
                        })}
                    </div>
                    
                    <div className={`grid grid-cols-4 gap-2 transition-all duration-300 ${data.date ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                        {['10:00','12:00','14:00','16:00','18:00','20:00','22:00','23:30'].map(t => (
                            <button key={t} onClick={() => { setData({...data, time: t}); nextStage(3, refs.location); }}
                                className={`py-2.5 rounded-[10px] text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] border-[#222] text-gray-400 hover:bg-[#222]'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* 4. LOCALIZAÇÃO (ENDEREÇO COMPLETO) */}
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
                                <button onClick={() => { setData({...data, location: loc, street:'', number:'', district:'', comp:''}); }}
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

                                {/* FORMULÁRIO DE ENDEREÇO REFINADO */}
                                {isSel && loc.input && (
                                    <div ref={refs.addressBlock} className="mt-4 pl-2 space-y-3 animate-enter">
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Rua / Avenida</label>
                                            <input 
                                                value={data.street} onChange={e => setData({...data, street: e.target.value})}
                                                placeholder="Nome da rua..."
                                                className="w-full smart-input p-3"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1/3">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Número</label>
                                                <input type="tel" value={data.number} onChange={e => setData({...data, number: e.target.value})}
                                                    placeholder="Nº" className="w-full smart-input p-3"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Bairro</label>
                                                <input value={data.district} onChange={e => setData({...data, district: e.target.value})}
                                                    placeholder="Bairro..." className="w-full smart-input p-3"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Complemento (Opcional)</label>
                                            <input value={data.comp} onChange={e => setData({...data, comp: e.target.value})}
                                                placeholder="Apto, Bloco..." className="w-full smart-input p-3"
                                            />
                                        </div>
                                        
                                        <button onClick={handleAddressComplete} className="w-full bg-[#1a1a1a] border border-[#333] text-white py-3 rounded-xl text-xs font-bold mt-2 hover:bg-[#222] flex justify-center items-center gap-2">
                                            Confirmar Local <Check size={14}/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>
        )}

        {/* 5. EXTRAS (UPSELL) */}
        {stage >= 4 && (
            <section ref={refs.extras} className="mb-32 animate-enter">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-6 h-6 rounded-full bg-[#0A84FF] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_#0A84FF]">4</div>
                    <h2 className="text-xl font-bold text-white">Extras</h2>
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
                                <span className="text-[10px] text-gray-500">Estender a sessão</span>
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
                                <span className="text-[10px] text-gray-500">Reciprocidade liberada</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-[#FF375F]">+ {formatBRL(CONFIG.PRICES.TOUCH)}</span>
                     </button>
                </div>
            </section>
        )}

      </main>

      {/* FOOTER FIXO */}
      {stage >= 4 && (
        <div ref={refs.checkout} className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="h-24 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            <div className="bg-[#0f0f0f] border-t border-[#222] p-6 pb-8 rounded-t-[30px] shadow-[0_-10px_40px_rgba(0,0,0,0.8)] max-w-md mx-auto">
                <div className="flex justify-between items-end mb-4 px-1">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Total Final</span>
                        <div className="flex items-baseline gap-2">
                             <span className="text-3xl font-bold text-white tracking-tighter">{formatBRL(calcTotal())}</span>
                             {hasCoupon && <span className="text-[10px] text-[#0A84FF] bg-[#0A84FF]/10 px-2 py-0.5 rounded font-bold"> -{formatBRL(CONFIG.COUPON_VAL)}</span>}
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={finishOrder}
                  className="w-full primary-btn h-14 rounded-[18px] font-bold text-[16px] flex items-center justify-center gap-3 hover:shadow-[0_0_30px_#0A84FF]"
                >
                    <MessageCircle size={20} fill="currentColor"/>
                    CONFIRMAR NO WHATSAPP
                </button>
            </div>
        </div>
      )}

    </div>
  );
}
