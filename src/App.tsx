import { useState, useEffect, useRef } from 'react';
import {
  Check, MapPin, Star, ArrowRight, Bed, 
  Home, MessageCircle, Clock, Zap, Ticket, Lock,
  ShieldCheck, Map, Navigation, User, ChevronRight
} from 'lucide-react';

// ==================================================================================
// 1. DESIGN SYSTEM & TOKENS
// ==================================================================================

const globalStyles = `
/* --- RESET & BASE --- */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; scroll-behavior: smooth; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.015em;
  color: #e5e5e5;
  background: #050505;
  -webkit-font-smoothing: antialiased;
  padding-bottom: env(safe-area-inset-bottom);
  overflow-x: hidden;
}

/* --- SCROLL OFFSET INTELIGENTE --- */
/* Garante que o item pare abaixo do header fixo */
section { scroll-margin-top: 140px; }

/* --- BACKGROUNDS --- */
.luxury-bg {
  background: 
    radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 85%),
    radial-gradient(circle at 90% 90%, rgba(10, 132, 255, 0.04), transparent 40%);
  background-attachment: fixed;
  min-height: 100vh;
}

/* --- CARDS & GLASSMORPHISM --- */
.glass-panel { 
  background: #0e0e0e;
  border: 1px solid #222; 
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.glass-panel:active { transform: scale(0.98); background: #151515; }

.glass-panel-selected {
  border-color: #0A84FF;
  background: rgba(10, 132, 255, 0.04);
  box-shadow: 0 0 0 1px #0A84FF, 0 10px 40px rgba(10, 132, 255, 0.08);
}

/* --- BUTTONS --- */
.primary-btn {
  background: #0A84FF;
  color: white;
  box-shadow: 0 0 25px rgba(10, 132, 255, 0.25);
  border: none;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}
.primary-btn:active { transform: scale(0.97); opacity: 0.95; }
.primary-btn:disabled { filter: grayscale(1); opacity: 0.4; cursor: not-allowed; box-shadow: none; }

/* --- INPUTS --- */
.smart-input {
  background: #090909;
  border: 1px solid #2a2a2a;
  color: white;
  transition: all 0.3s ease;
  font-size: 16px;
  border-radius: 14px;
  width: 100%;
}
.smart-input:focus { 
  border-color: #0A84FF; 
  background: #111;
  box-shadow: 0 0 0 1px rgba(10, 132, 255, 0.3);
  outline: none;
}
.smart-input::placeholder { color: #444; font-weight: 500; }

/* --- ANIMATIONS --- */
.animate-enter { animation: enter 0.7s cubic-bezier(0.2, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(30px); }
@keyframes enter { to { opacity: 1; transform: translateY(0); } }

.animate-pulse-slow { animation: pulse 3s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
`;

// ==================================================================================
// 2. CONFIGURAÇÃO & COPYWRITING (PERFIL MASCULINO SP)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  COUPON_CODE: "THALYVIP12",
  COUPON_VAL: 12, 
  PRICES: {
    UPGRADE_PCT: 0.5,
    TOUCH: 60,
  }
};

const SERVICES = [
  { 
    id: 'completa', 
    name: 'A Experiência (Signature)', 
    desc: 'O protocolo completo. Fusão de relaxamento muscular profundo com a intensidade tântrica. Toque corpo a corpo, óleo aquecido e finalização manual.', 
    duration: '60 min', 
    price: 160, 
    badge: 'MAIS SOLICITADA 🏆',
    features: ['Tântrica', 'Corpo a Corpo', 'Finalização']
  },
  { 
    id: 'relax', 
    name: 'Descompressão (Deep Tissue)', 
    desc: 'Foco 100% físico. Ideal para soltar a musculatura travada, pós-treino ou stress corporativo. Pressão firme e precisa.', 
    duration: '60 min', 
    price: 130, 
    badge: null,
    features: ['Tira Dores', 'Zero Stress', 'Revigorante']
  },
];

const LOCATIONS = [
  { id: 'sp_home', label: 'Delivery (Sua Casa/Apto)', sub: 'Atendimento discreto no seu ambiente', fee: 35, icon: Home, input: true },
  { id: 'sp_hotel', label: 'Hotel / Flat (SP)', sub: 'Vou até sua suíte (Business/Trip)', fee: 70, icon: Bed, input: true },
];

const REVIEWS = [
  { t: "Profissional de alto nível. O toque é firme e sensitivo na medida certa.", a: "André (Jardins)", s: 5 },
  { t: "Discrição total. Atendeu no meu flat e foi super pontual. Recomendo.", a: "M. (Business)", s: 5 },
  { t: "Finalização intensa, valeu cada minuto do upgrade.", a: "Anônimo", s: 5 },
];

// ==================================================================================
// 3. UTILS
// ==================================================================================

const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };

// ==================================================================================
// 4. COMPONENTES
// ==================================================================================

const CouponModal = ({ onClaim }) => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    // Verifica se já usou o cupom no passado
    const used = localStorage.getItem('thaly_coupon_used');
    if (!used) {
        setTimeout(() => setShow(true), 1200);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-enter">
      <div className="bg-[#111] border border-[#222] w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A84FF] to-transparent"></div>
        
        <div className="w-16 h-16 bg-[#0A84FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#0A84FF]/20 shadow-[0_0_30px_rgba(10,132,255,0.1)]">
          <Ticket className="w-8 h-8 text-[#0A84FF]" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Presente VIP</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Inicie sua primeira experiência com um benefício exclusivo de convidado.
        </p>
        
        <div className="bg-[#050505] border border-[#222] border-dashed rounded-xl p-5 mb-8">
          <span className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">Desconto Liberado</span>
          <span className="text-4xl font-bold text-white tracking-tighter">R$ 12,00</span>
        </div>
        
        <button 
            onClick={() => { vibrate(); setShow(false); onClaim(); }} 
            className="w-full bg-[#0A84FF] hover:bg-[#007AFF] text-white font-bold py-4 rounded-[18px] text-[15px] transition-all active:scale-95"
        >
            RESGATAR BENEFÍCIO
        </button>
        <button onClick={() => setShow(false)} className="mt-6 text-xs text-gray-600 font-medium hover:text-gray-400">
            Dispensar (Não aparecerá novamente)
        </button>
      </div>
    </div>
  );
};

const ReviewsTicker = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS.length), 5000); return () => clearInterval(t); }, []);
  return (
      <div className="mb-8 p-4 bg-[#0e0e0e] border border-[#222] rounded-[20px] flex items-start gap-4 animate-enter">
          <div className="flex-1">
              <div className="flex gap-0.5 text-[#FFD60A] mb-2">
                  {[...Array(5)].map((_,i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0}/>)}
              </div>
              <p className="text-[13px] text-gray-300 italic leading-snug mb-2">"{REVIEWS[idx].t}"</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide text-right">— {REVIEWS[idx].a}</p>
          </div>
      </div>
  )
}

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [hasCoupon, setHasCoupon] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Refs de Scroll
  const refs = {
    identity: useRef(null),
    services: useRef(null),
    datetime: useRef(null),
    location: useRef(null),
    addressForm: useRef(null),
    extras: useRef(null),
    checkout: useRef(null)
  };

  // State Global
  const [data, setData] = useState({
    name: '', age: '', service: null, date: null, time: null, location: null,
    street: '', number: '', district: '', comp: '',
    extras: { upgrade: false, touch: false }, payment: 'pix'
  });

  const [stage, setStage] = useState(0);

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  // --- ENGINE DE SCROLL ---
  const scrollTo = (ref, delay = 300) => {
    if (ref && ref.current) {
        setTimeout(() => {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, delay);
    }
  };

  const nextStep = (nextStageLevel, nextRef) => {
    vibrate();
    if(nextStageLevel > stage) setStage(nextStageLevel);
    scrollTo(nextRef);
  };

  const handleIdentity = () => {
    if(data.name.length < 3 || !data.age) return;
    nextStep(1, refs.services);
  };

  const handleAddressConfirm = () => {
      if(data.street && data.number && data.district) {
          nextStep(4, refs.extras);
      }
  };

  const calculateTotal = () => {
    if (!data.service) return 0;
    let total = data.service.price;
    if (data.extras.upgrade) total += (data.service.price * CONFIG.PRICES.UPGRADE_PCT);
    if (data.extras.touch) total += CONFIG.PRICES.TOUCH;
    if (data.location) total += data.location.fee;
    if (hasCoupon) total -= CONFIG.COUPON_VAL;
    return Math.max(0, total);
  };

  const finishOrder = () => {
    // 1. Marcar cupom como usado para sempre
    if (hasCoupon) {
        localStorage.setItem('thaly_coupon_used', 'true');
    }

    // 2. Montar mensagem
    const total = calculateTotal();
    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';

    let text = `*NOVA SOLICITAÇÃO SP* 🏙️\n`;
    text += `👤 *${data.name}* (${data.age} anos)\n`;
    
    text += `💆 *${data.service.name}*\n`;
    text += `📅 ${dateStr} às ${data.time}\n`;
    text += `📍 *${data.location.label}*\n`;
    
    if (data.location.input) {
        text += `🏠 ${data.street}, ${data.number}\n`;
        text += `🏘️ Bairro: ${data.district}\n`;
        if(data.comp) text += `🏢 Comp: ${data.comp}\n`;
    }

    text += `\n*DETALHAMENTO:*\n`;
    text += `Base: ${formatBRL(data.service.price)}\n`;
    text += `Deslocamento: ${formatBRL(data.location.fee)}\n`;
    if(data.extras.upgrade) text += `Upgrade 30min: ${formatBRL(data.service.price * CONFIG.PRICES.UPGRADE_PCT)}\n`;
    if(data.extras.touch) text += `Interação: ${formatBRL(CONFIG.PRICES.TOUCH)}\n`;
    if(hasCoupon) text += `Cupom VIP: -${formatBRL(CONFIG.COUPON_VAL)}\n`;

    text += `\n💎 *TOTAL: ${formatBRL(total)}*`;
    text += `\n💳 Pagto: ${data.payment.toUpperCase()}`;

    // 3. Enviar e Sucesso
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
    setSuccess(true);
  };

  const resetApp = () => {
      window.location.reload();
  };

  // --- TELA DE CARREGAMENTO ---
  if (loading) return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center">
      <div className="relative">
          <div className="w-16 h-16 border-t-2 border-[#0A84FF] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#0A84FF] rounded-full shadow-[0_0_15px_#0A84FF]"></div>
          </div>
      </div>
      <p className="text-[#0A84FF] text-[10px] font-bold tracking-[0.4em] mt-6 animate-pulse">CARREGANDO</p>
    </div>
  );

  // --- TELA DE SUCESSO ---
  if (success) return (
      <div className="fixed inset-0 bg-black z-[300] flex flex-col items-center justify-center p-8 animate-enter text-center">
          <div className="w-24 h-24 bg-[#32D74B]/10 rounded-full flex items-center justify-center mb-6 border border-[#32D74B]/20 shadow-[0_0_60px_rgba(50,215,75,0.15)] relative">
              <div className="absolute inset-0 border border-[#32D74B]/30 rounded-full animate-ping opacity-20"></div>
              <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Solicitação Enviada!</h2>
          <p className="text-gray-400 mb-10 leading-relaxed max-w-xs mx-auto">
              Sua mensagem já está no meu WhatsApp. Aguarde minha confirmação para garantir o horário.
          </p>
          
          <button onClick={resetApp} className="w-full bg-[#1a1a1a] border border-[#333] text-white py-4 rounded-[18px] font-bold hover:bg-[#222] transition-colors">
              Voltar ao Início
          </button>
      </div>
  );

  return (
    <div className="luxury-bg min-h-screen text-gray-200 pb-40">
      <style>{globalStyles}</style>

      {/* MODAL DE CUPOM (SÓ APARECE SE NÃO USOU) */}
      <CouponModal onClaim={() => setHasCoupon(true)} />
      
      {/* HEADER FIXO DISCRETO */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex justify-between items-center transition-all shadow-lg">
        <span className="font-bold text-white tracking-tight text-lg">Thalyson<span className="text-[#0A84FF]">Bot</span></span>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111] rounded-full border border-[#222]">
            <Lock className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Sigilo Total</span>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-28 px-5">

        {/* 1. PERFIL & INTRO */}
        <section ref={refs.identity} className="mb-12 animate-enter">
          <h1 className="text-3xl font-bold text-white mb-2 leading-none tracking-tight">Discrição e<br/><span className="text-gray-600">Técnica.</span></h1>
          <p className="text-gray-500 text-sm mb-8 mt-3 leading-relaxed">Personalize sua sessão em São Paulo.<br/>Ambiente seguro e profissional.</p>

          <ReviewsTicker />

          <div className="space-y-4">
            <div className="grid grid-cols-10 gap-3">
                <div className="col-span-7">
                    <label className="text-[9px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Como te chamo?</label>
                    <input 
                      value={data.name} onChange={e => setData({...data, name: e.target.value})}
                      placeholder="Nome ou Apelido"
                      className="smart-input p-4"
                    />
                </div>
                <div className="col-span-3">
                    <label className="text-[9px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Idade</label>
                    <input 
                      type="tel" maxLength={2}
                      value={data.age} onChange={e => setData({...data, age: e.target.value})}
                      placeholder="30"
                      className="smart-input p-4 text-center"
                    />
                </div>
            </div>

            {stage === 0 && (
                <button 
                  disabled={data.name.length < 3 || !data.age}
                  onClick={handleIdentity}
                  className="primary-btn w-full py-4 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 mt-4"
                >
                  Continuar <ArrowRight size={18}/>
                </button>
            )}
          </div>
        </section>

        {/* 2. SERVIÇOS */}
        {stage >= 1 && (
            <section ref={refs.services} className="mb-12 animate-enter">
                <div className="flex items-center gap-3 mb-6 opacity-80">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs font-bold text-white">1</div>
                    <h2 className="text-lg font-bold text-white">O que você busca?</h2>
                </div>

                <div className="space-y-4">
                    {SERVICES.map(s => {
                        const active = data.service?.id === s.id;
                        return (
                            <button key={s.id} onClick={() => { setData({...data, service: s}); nextStep(2, refs.datetime); }}
                                className={`w-full p-6 rounded-[24px] text-left relative glass-panel group ${active ? 'glass-panel-selected' : ''}`}
                            >
                                {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg">{s.badge}</div>}
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#0A84FF] transition-colors">{s.name}</h3>
                                    <span className="text-[#0A84FF] font-bold bg-[#0A84FF]/10 px-2 py-1 rounded-lg text-sm">{formatBRL(s.price)}</span>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-[95%]">{s.desc}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {s.features.map(f => <span key={f} className="text-[10px] bg-[#1a1a1a] text-gray-400 px-2.5 py-1 rounded-md border border-[#333] font-medium">{f}</span>)}
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
                <div className="flex items-center gap-3 mb-6 opacity-80">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs font-bold text-white">2</div>
                    <h2 className="text-lg font-bold text-white">Melhor Horário</h2>
                </div>

                <div className="glass-panel p-5 rounded-[26px]">
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
                        {[...Array(10)].map((_, i) => {
                            const d = new Date(); d.setDate(d.getDate() + i);
                            const isSel = data.date && data.date.getDate() === d.getDate();
                            return (
                                <button key={i} onClick={() => { vibrate(); setData({...data, date: d, time: null}); }}
                                    className={`min-w-[64px] h-[76px] rounded-[16px] flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#151515] border-[#222] text-gray-500 hover:bg-[#1a1a1a]'}`}
                                >
                                    <span className="text-[9px] uppercase font-bold mb-1 opacity-80">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                    <span className="text-xl font-bold tracking-tight">{d.getDate()}</span>
                                </button>
                            )
                        })}
                    </div>
                    
                    <div className={`grid grid-cols-4 gap-2.5 transition-all duration-500 ${data.date ? 'opacity-100 max-h-96' : 'opacity-20 max-h-0 overflow-hidden'}`}>
                        {['10:00','12:00','14:00','16:00','18:00','20:00','22:00','23:30'].map(t => (
                            <button key={t} onClick={() => { setData({...data, time: t}); nextStep(3, refs.location); }}
                                className={`py-3 rounded-[12px] text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black border-white shadow-md' : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400 hover:border-[#444]'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        )}

        {/* 4. LOCALIZAÇÃO (ENDEREÇO SP) */}
        {stage >= 3 && (
            <section ref={refs.location} className="mb-12 animate-enter">
                <div className="flex items-center gap-3 mb-6 opacity-80">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs font-bold text-white">3</div>
                    <h2 className="text-lg font-bold text-white">Local (São Paulo)</h2>
                </div>

                <div className="space-y-3">
                    {LOCATIONS.map(loc => {
                        const isSel = data.location?.id === loc.id;
                        return (
                            <div key={loc.id} className="transition-all duration-300">
                                <button onClick={() => { setData({...data, location: loc, street:'', number:'', district:'', comp:''}); }}
                                    className={`w-full p-4 rounded-[22px] border flex items-center justify-between transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-panel border-transparent'}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#1a1a1a] text-gray-500'}`}><loc.icon size={18} /></div>
                                        <div className="text-left">
                                            <div className="font-bold text-white text-[15px]">{loc.label}</div>
                                            <div className="text-[11px] text-gray-500 mt-0.5">{loc.sub}</div>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-[#0A84FF] bg-[#0A84FF]/10 px-2 py-1 rounded">+ {formatBRL(loc.fee)}</span>
                                </button>

                                {/* FORMULÁRIO DE ENDEREÇO COM VALIDAÇÃO VISUAL */}
                                {isSel && loc.input && (
                                    <div ref={refs.addressForm} className="mt-4 pl-2 space-y-3 animate-enter border-l-2 border-[#222] ml-4 pr-1 py-2">
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Rua / Avenida</label>
                                            <input 
                                                value={data.street} onChange={e => setData({...data, street: e.target.value})}
                                                placeholder="Nome da rua..."
                                                className="smart-input p-3.5"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1/3">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Número</label>
                                                <input type="tel" value={data.number} onChange={e => setData({...data, number: e.target.value})}
                                                    placeholder="Nº" className="smart-input p-3.5 text-center"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Bairro</label>
                                                <input value={data.district} onChange={e => setData({...data, district: e.target.value})}
                                                    placeholder="Seu bairro..." className="smart-input p-3.5"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Complemento</label>
                                            <input value={data.comp} onChange={e => setData({...data, comp: e.target.value})}
                                                placeholder="Apto, Bloco (Opcional)" className="smart-input p-3.5"
                                            />
                                        </div>
                                        
                                        <button 
                                            disabled={!data.street || !data.number || !data.district}
                                            onClick={handleAddressConfirm} 
                                            className="w-full bg-[#1a1a1a] border border-[#333] text-white py-3.5 rounded-xl text-xs font-bold mt-2 hover:bg-[#222] flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            Confirmar Endereço <Check size={14}/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>
        )}

        {/* 5. EXTRAS (UPSELL PREMIUM) */}
        {stage >= 4 && (
            <section ref={refs.extras} className="mb-48 animate-enter">
                <div className="flex items-center gap-3 mb-6 opacity-80">
                    <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs font-bold text-white">4</div>
                    <h2 className="text-lg font-bold text-white">Personalização</h2>
                </div>

                <div className="glass-panel p-2 rounded-[24px] mb-8 overflow-hidden">
                     {/* UPGRADE TIME */}
                     <button onClick={() => { vibrate(); setData({...data, extras: {...data.extras, upgrade: !data.extras.upgrade}}); }}
                        className={`w-full p-5 flex justify-between items-center border-b border-[#222] transition-colors ${data.extras.upgrade ? 'bg-[#0A84FF]/5' : 'hover:bg-[#151515]'}`}
                     >
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${data.extras.upgrade ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444] bg-[#111]'}`}>
                                {data.extras.upgrade && <Check size={14} className="text-white"/>}
                            </div>
                            <div className="text-left">
                                <span className="block text-[15px] font-bold text-white mb-0.5">+30 Minutos</span>
                                <span className="text-[11px] text-gray-500">Estender o tempo da sessão</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-[#0A84FF]">+ {formatBRL(data.service.price * CONFIG.PRICES.UPGRADE_PCT)}</span>
                     </button>

                     {/* UPGRADE TOUCH */}
                     <button onClick={() => { vibrate(); setData({...data, extras: {...data.extras, touch: !data.extras.touch}}); }}
                        className={`w-full p-5 flex justify-between items-center transition-colors ${data.extras.touch ? 'bg-[#FF375F]/5' : 'hover:bg-[#151515]'}`}
                     >
                        <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${data.extras.touch ? 'bg-[#FF375F] border-[#FF375F]' : 'border-[#444] bg-[#111]'}`}>
                                {data.extras.touch && <Check size={14} className="text-white"/>}
                            </div>
                            <div className="text-left">
                                <span className="block text-[15px] font-bold text-white mb-0.5">Interação / Toque</span>
                                <span className="text-[11px] text-gray-500">Reciprocidade e corpo a corpo</span>
                            </div>
                        </div>
                        <span className="text-sm font-bold text-[#FF375F]">+ {formatBRL(CONFIG.PRICES.TOUCH)}</span>
                     </button>
                </div>
            </section>
        )}

      </main>

      {/* 6. CHECKOUT FLUTUANTE */}
      {stage >= 4 && (
        <div ref={refs.checkout} className="fixed bottom-0 w-full z-50 animate-enter">
            {/* Gradiente para suavizar o corte */}
            <div className="h-24 bg-gradient-to-t from-black via-black/95 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            
            <div className="bg-[#0e0e0e] border-t border-[#222] p-6 pb-8 rounded-t-[32px] shadow-[0_-10px_50px_rgba(0,0,0,0.8)] max-w-md mx-auto relative">
                
                {/* Indicador de Swipe (Decorativo) */}
                <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-6"></div>

                <div className="flex justify-between items-end mb-5 px-1">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Valor Final</span>
                        <div className="flex items-baseline gap-2.5">
                             <span className="text-3xl font-bold text-white tracking-tighter">{formatBRL(calculateTotal())}</span>
                             {hasCoupon && <span className="text-[10px] text-[#0A84FF] bg-[#0A84FF]/10 px-2 py-1 rounded font-bold border border-[#0A84FF]/20">CUPOM ATIVO</span>}
                        </div>
                    </div>
                </div>
                
                <button 
                  onClick={finishOrder}
                  className="w-full primary-btn h-14 rounded-[20px] font-bold text-[16px] flex items-center justify-center gap-3 animate-pulse-slow hover:animate-none"
                >
                    <MessageCircle size={20} fill="currentColor"/>
                    GARANTIR MEU HORÁRIO
                </button>
            </div>
        </div>
      )}

    </div>
  );
}
