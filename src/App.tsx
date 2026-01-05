import { useState, useEffect, useRef } from 'react';
import {
  Check, MapPin, Star, ArrowRight, Bed, 
  Home, MessageCircle, Clock, Zap, Ticket, Lock,
  ShieldCheck, Map, Navigation, User, ChevronDown, Flame
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS (DARK MODE REFINADO)
// ==================================================================================

const globalStyles = `
/* --- RESET --- */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #050505; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.02em;
  color: #e5e5e5;
  background: #050505;
  -webkit-font-smoothing: antialiased;
  padding-bottom: env(safe-area-inset-bottom);
  overflow-x: hidden;
}

/* --- SCROLL PHYSICS (O SEGREDO DO APP) --- */
/* Margem superior grande para o item nunca ficar escondido atrás do header */
section { 
  scroll-margin-top: 15vh; 
  opacity: 0.4; 
  transition: opacity 0.5s ease;
  pointer-events: none; /* Bloqueia interação até ativar */
}

section.active-step {
  opacity: 1;
  pointer-events: auto;
}

/* --- BACKGROUND --- */
.luxury-bg {
  background: 
    radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 70%),
    radial-gradient(circle at 90% 90%, rgba(10, 132, 255, 0.03), transparent 40%);
  background-attachment: fixed;
  min-height: 100vh;
}

/* --- CARDS --- */
.glass-card { 
  background: #0e0e0e;
  border: 1px solid #222; 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;
}
.glass-card:active { transform: scale(0.98); background: #151515; }

.glass-card.selected {
  border-color: #0A84FF;
  background: rgba(10, 132, 255, 0.04);
  box-shadow: 0 0 0 1px #0A84FF, 0 10px 40px rgba(10, 132, 255, 0.08);
}

/* --- BUTTONS --- */
.primary-btn {
  background: #0A84FF;
  color: white;
  box-shadow: 0 0 25px rgba(10, 132, 255, 0.3);
  border: none;
  transition: all 0.2s ease;
}
.primary-btn:active { transform: scale(0.97); opacity: 0.9; }

/* --- INPUTS --- */
.smart-input {
  background: #090909;
  border: 1px solid #2a2a2a;
  color: white;
  transition: all 0.3s ease;
  font-size: 16px; 
  border-radius: 12px;
  width: 100%;
}
.smart-input:focus { 
  border-color: #0A84FF; 
  background: #111;
  box-shadow: 0 0 0 1px rgba(10, 132, 255, 0.3);
  outline: none;
}
.smart-input::placeholder { color: #555; font-weight: 500; }

/* --- ANIMATIONS --- */
.animate-enter { animation: enter 0.6s ease forwards; opacity: 0; transform: translateY(20px); }
@keyframes enter { to { opacity: 1; transform: translateY(0); } }
`;

// ==================================================================================
// 2. CONFIGURAÇÃO (PREÇOS & DADOS)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  COUPON_VAL: 12, 
  PRICES: {
    UPGRADE_PCT: 0.5,
    TOUCH: 53, // Ajustado conforme pedido
    UBER: 20   // Ajustado conforme pedido
  }
};

// Horários 08h as 21h
const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'O protocolo que você quer. Começa de bruços soltando a musculatura. Vira de frente, óleo morno, toque corpo a corpo e finalização manual intensa garantida.', 
    duration: '60 min', 
    price: 160, 
    badge: 'MAIS PEDIDA 🔥',
    features: ['Corpo a Corpo', 'Tântrica', 'Finalização']
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico e físico. Ideal para tirar dores nas costas, pernas cansadas e zerar o stress. Toque firme e preciso. Sem foco sexual.', 
    duration: '60 min', 
    price: 130, 
    badge: null,
    features: ['Tira Dores', 'Zero Stress', 'Revigorante']
  },
];

const LOCATIONS = [
  { id: 'home', label: 'Na sua Casa / Apto', sub: 'Levo a maca ou atendemos na cama/sofá', fee: CONFIG.PRICES.UBER, icon: Home, input: true },
  { id: 'hotel', label: 'Hotel / Motel', sub: 'Vou até a sua suíte (Total discrição)', fee: CONFIG.PRICES.UBER, icon: Bed, input: true },
];

const REVIEWS = [
  { t: "Sou casado, precisava de um escape. O sigilo foi total e o final foi explosivo. Gozei muito.", a: "Sigiloso", s: 5 },
  { t: "Empresário aqui. O cara é pontual, educado e a massagem tira todo o peso das costas.", a: "M. (Business)", s: 5 },
  { t: "Curti a liberdade de poder tocar nele também. O corpo dele é quente, pele macia.", a: "Bi Curioso", s: 5 },
  { t: "Mãos firmes e sabe onde tocar pra excitar. Saí de lá flutuando.", a: "Gustavo", s: 5 },
];

// ==================================================================================
// 3. UTILS
// ==================================================================================

const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(12); };

// ==================================================================================
// 4. COMPONENTES
// ==================================================================================

const CouponModal = ({ onClaim }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const used = localStorage.getItem('thaly_coupon_gold');
    if (!used) setTimeout(() => setShow(true), 1200);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-enter">
      <div className="bg-[#111] border border-[#222] w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl relative">
        <div className="w-16 h-16 bg-[#0A84FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#0A84FF]/20 shadow-[0_0_30px_rgba(10,132,255,0.1)]">
          <Ticket className="w-8 h-8 text-[#0A84FF]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Primeira Vez?</h2>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Liberei um desconto especial para você conhecer o serviço hoje.
        </p>
        <div className="bg-[#050505] border border-[#222] border-dashed rounded-xl p-5 mb-8">
          <span className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">Valor do Cupom</span>
          <span className="text-4xl font-bold text-white tracking-tighter">R$ {CONFIG.COUPON_VAL},00</span>
        </div>
        <button onClick={() => { vibrate(); setShow(false); onClaim(); }} className="w-full bg-[#0A84FF] text-white font-bold py-4 rounded-[18px] text-[15px] active:scale-95 transition-transform">
            RESGATAR AGORA
        </button>
        <button onClick={() => setShow(false)} className="mt-6 text-xs text-gray-600 font-medium hover:text-gray-400">
            Dispensar
        </button>
      </div>
    </div>
  );
};

const ReviewsTicker = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS.length), 4000); return () => clearInterval(t); }, []);
  return (
      <div className="mb-8 p-4 bg-[#0e0e0e] border border-[#222] rounded-[20px] flex items-start gap-4">
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
  
  // Refs para Scroll
  const refs = {
    intro: useRef(null),
    services: useRef(null),
    datetime: useRef(null),
    extras: useRef(null),
    location: useRef(null),
    checkout: useRef(null)
  };

  // State Global
  const [data, setData] = useState({
    name: '', age: '', service: null, date: null, time: null, location: null,
    street: '', number: '', district: '', comp: '',
    extras: { upgrade: false, touch: false }, payment: 'pix'
  });

  const [stage, setStage] = useState(0); // Controle rigoroso de passos

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  // --- ENGINE DE SCROLL (CENTRALIZADO) ---
  const scrollTo = (ref) => {
    if (ref && ref.current) {
        setTimeout(() => {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300); // Delay suave para UX
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

  const handleServiceSelect = (s) => {
    setData({...data, service: s});
    nextStep(2, refs.datetime);
  };

  const handleTimeSelect = (t) => {
    setData({...data, time: t});
    nextStep(3, refs.extras); // Vai para extras antes do local
  };

  const handleAddressConfirm = () => {
      if(data.street && data.number && data.district) {
          nextStep(5, refs.checkout); // Mostra o botão final
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
    if (hasCoupon) localStorage.setItem('thaly_coupon_gold', 'true');

    const total = calculateTotal();
    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';

    let text = `*AGENDAMENTO CONFIRMADO* 🚨\n`;
    text += `👤 *${data.name}* (${data.age} anos)\n`;
    
    text += `💆 *${data.service.name}*\n`;
    text += `📅 ${dateStr} às ${data.time}\n`;
    
    if (data.location) {
        text += `📍 *${data.location.label}*\n`;
        text += `🏠 ${data.street}, ${data.number}\n`;
        text += `🏘️ ${data.district}\n`;
        if(data.comp) text += `🏢 ${data.comp}\n`;
    }

    text += `\n*RESUMO FINANCEIRO:*\n`;
    text += `Sessão: ${formatBRL(data.service.price)}\n`;
    text += `Taxa Uber: ${formatBRL(CONFIG.PRICES.UBER)}\n`;
    
    if(data.extras.upgrade) text += `Upgrade 30min: ${formatBRL(data.service.price * CONFIG.PRICES.UPGRADE_PCT)}\n`;
    if(data.extras.touch) text += `Interação: ${formatBRL(CONFIG.PRICES.TOUCH)}\n`;
    if(hasCoupon) text += `Desconto VIP: -${formatBRL(CONFIG.COUPON_VAL)}\n`;

    text += `\n💰 *TOTAL: ${formatBRL(total)}*`;
    text += `\n💳 Pagto: ${data.payment.toUpperCase()}`;

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
    setSuccess(true);
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-t-2 border-[#0A84FF] rounded-full animate-spin mb-6"></div>
      <p className="text-[#0A84FF] text-[10px] font-bold tracking-[0.4em] animate-pulse">THALYSON MASSAGENS</p>
    </div>
  );

  if (success) return (
      <div className="fixed inset-0 bg-black z-[300] flex flex-col items-center justify-center p-8 text-center animate-enter">
          <div className="w-24 h-24 bg-[#32D74B]/10 rounded-full flex items-center justify-center mb-6 border border-[#32D74B]/20 shadow-[0_0_60px_rgba(50,215,75,0.15)]">
              <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Tudo Pronto!</h2>
          <p className="text-gray-400 mb-10 leading-relaxed max-w-xs mx-auto">
              Te enviei os detalhes no WhatsApp. Confirme lá para eu me deslocar.
          </p>
          <button onClick={() => window.location.reload()} className="w-full bg-[#1a1a1a] border border-[#333] text-white py-4 rounded-[18px] font-bold">
              Voltar ao Início
          </button>
      </div>
  );

  return (
    <div className="luxury-bg min-h-screen text-gray-200 pb-40">
      <style>{globalStyles}</style>
      <CouponModal onClaim={() => setHasCoupon(true)} />
      
      {/* HEADER FIXO */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex justify-between items-center shadow-lg transition-all">
        <span className="font-bold text-white tracking-tight text-lg">Thalyson <span className="text-[#0A84FF]">Massagens</span></span>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#111] rounded-full border border-[#222]">
            <Lock className="w-3 h-3 text-gray-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase">Sigilo</span>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-28 px-5">

        {/* 1. PERFIL (SEMPRE VISIVEL) */}
        <section ref={refs.intro} className="active-step">
          <h1 className="text-3xl font-bold text-white mb-2 leading-none tracking-tight">Discrição e<br/><span className="text-gray-600">Prazer.</span></h1>
          <p className="text-gray-500 text-sm mb-6 mt-2 leading-relaxed">Atendimento exclusivo para homens.<br/>Eu vou até você.</p>

          <ReviewsTicker />

          <div className="glass-card p-6 rounded-[24px]">
            <div className="grid grid-cols-10 gap-3">
                <div className="col-span-7">
                    <label className="text-[9px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Seu Nome</label>
                    <input 
                      value={data.name} onChange={e => setData({...data, name: e.target.value})}
                      placeholder="Nome ou Apelido" className="smart-input p-4"
                    />
                </div>
                <div className="col-span-3">
                    <label className="text-[9px] font-bold text-[#0A84FF] uppercase tracking-widest mb-2 block ml-1">Idade</label>
                    <input 
                      type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value})}
                      placeholder="30" className="smart-input p-4 text-center"
                    />
                </div>
            </div>

            {stage === 0 && (
                <button 
                  disabled={data.name.length < 3 || !data.age}
                  onClick={handleIdentity}
                  className="primary-btn w-full py-4 rounded-[16px] font-bold text-[15px] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                >
                  Continuar <ArrowRight size={18}/>
                </button>
            )}
          </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={stage >= 1 ? 'active-step' : ''}>
            <div className="flex items-center gap-3 mb-4 opacity-80 mt-12">
                <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs font-bold text-white">1</div>
                <h2 className="text-lg font-bold text-white">Escolha a Sessão</h2>
            </div>

            <div className="space-y-4">
                {SERVICES.map(s => {
                    const active = data.service?.id === s.id;
                    return (
                        <button key={s.id} onClick={() => handleServiceSelect(s)}
                            className={`w-full p-6 rounded-[24px] text-left relative glass-card group ${active ? 'selected' : ''}`}
                        >
                            {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-bold px-3 py-1.5 rounded-bl-xl">{s.badge}</div>}
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-white group-hover:text-[#0A84FF] transition-colors">{s.name}</h3>
                                <span className="text-[#0A84FF] font-bold bg-[#0A84FF]/10 px-2 py-1 rounded-lg text-sm">{formatBRL(s.price)}</span>
                            </div>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">{s.short}</p>
                            <p className="text-sm text-gray-300 leading-relaxed mb-4">{s.desc}</p>
                            <div className="flex gap-2 flex-wrap">
                                {s.features.map(f => <span key={f} className="text-[10px] bg-[#1a1a1a] text-gray-400 px-2.5 py-1 rounded-md border border-[#333] font-medium">{f}</span>)}
                            </div>
                        </button>
                    )
                })}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={stage >= 2 ? 'active-step' : ''}>
            <div className="flex items-center gap-3 mb-4 opacity-80 mt-12">
                <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs font-bold text-white">2</div>
                <h2 className="text-lg font-bold text-white">Data e Horário</h2>
            </div>

            <div className="glass-card p-5 rounded-[26px]">
                {/* DATAS */}
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2">
                    {[...Array(10)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && data.date.getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { vibrate(); setData({...data, date: d, time: null}); }}
                                className={`min-w-[64px] h-[76px] rounded-[16px] flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#151515] border-[#222] text-gray-500'}`}
                            >
                                <span className="text-[9px] uppercase font-bold mb-1 opacity-80">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-xl font-bold tracking-tight">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                
                {/* HORÁRIOS */}
                <div className={`grid grid-cols-4 gap-2.5 transition-all duration-500 ${data.date ? 'opacity-100 max-h-96' : 'opacity-20 max-h-0 overflow-hidden'}`}>
                    {TIME_SLOTS.map(t => (
                        <button key={t} onClick={() => handleTimeSelect(t)}
                            className={`py-3 rounded-[12px] text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black border-white shadow-md' : 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS (AGORA VEM ANTES DO LOCAL PARA FLUXO MELHOR) */}
        <section ref={refs.extras} className={stage >= 3 ? 'active-step' : ''}>
            <div className="flex items-center gap-3 mb-4 opacity-80 mt-12">
                <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs font-bold text-white">3</div>
                <h2 className="text-lg font-bold text-white">Personalizar (Opcional)</h2>
            </div>

            <div className="glass-card p-2 rounded-[24px] overflow-hidden">
                    {/* UPGRADE TIME */}
                    <button onClick={() => { vibrate(); setData({...data, extras: {...data.extras, upgrade: !data.extras.upgrade}}); }}
                    className={`w-full p-5 flex justify-between items-center border-b border-[#222] transition-colors ${data.extras.upgrade ? 'bg-[#0A84FF]/5' : ''}`}
                    >
                    <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${data.extras.upgrade ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444] bg-[#111]'}`}>
                            {data.extras.upgrade && <Check size={14} className="text-white"/>}
                        </div>
                        <div className="text-left">
                            <span className="block text-[15px] font-bold text-white mb-0.5">+30 Minutos</span>
                            <span className="text-[11px] text-gray-500">Estender a sessão</span>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-[#0A84FF]">+ {formatBRL(data.service?.price * CONFIG.PRICES.UPGRADE_PCT || 0)}</span>
                    </button>

                    {/* UPGRADE TOUCH */}
                    <button onClick={() => { vibrate(); setData({...data, extras: {...data.extras, touch: !data.extras.touch}}); }}
                    className={`w-full p-5 flex justify-between items-center transition-colors ${data.extras.touch ? 'bg-[#FF375F]/5' : ''}`}
                    >
                    <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${data.extras.touch ? 'bg-[#FF375F] border-[#FF375F]' : 'border-[#444] bg-[#111]'}`}>
                            {data.extras.touch && <Check size={14} className="text-white"/>}
                        </div>
                        <div className="text-left">
                            <span className="block text-[15px] font-bold text-white mb-0.5">Interação / Toque</span>
                            <span className="text-[11px] text-gray-500">Você pode tocar</span>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-[#FF375F]">+ {formatBRL(CONFIG.PRICES.TOUCH)}</span>
                    </button>

                    <button onClick={() => nextStep(4, refs.location)} className="w-full text-center py-3 text-xs text-gray-500 font-bold uppercase tracking-widest border-t border-[#222] hover:text-white hover:bg-[#222] transition-colors">
                        Avançar Próximo Passo
                    </button>
            </div>
        </section>

        {/* 5. LOCALIZAÇÃO (FINAL) */}
        <section ref={refs.location} className={stage >= 4 ? 'active-step' : ''}>
            <div className="flex items-center gap-3 mb-4 opacity-80 mt-12">
                <div className="w-6 h-6 rounded-full bg-[#222] border border-[#333] flex items-center justify-center text-xs font-bold text-white">4</div>
                <h2 className="text-lg font-bold text-white">Onde irei te atender?</h2>
            </div>

            <div className="space-y-3 pb-32">
                {LOCATIONS.map(loc => {
                    const isSel = data.location?.id === loc.id;
                    return (
                        <div key={loc.id} className="transition-all duration-300">
                            <button onClick={() => { setData({...data, location: loc, street:'', number:'', district:'', comp:''}); }}
                                className={`w-full p-4 rounded-[22px] border flex items-center justify-between transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'glass-card border-transparent'}`}
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

                            {isSel && loc.input && (
                                <div className="mt-4 pl-2 space-y-3 animate-enter border-l-2 border-[#222] ml-4 pr-1 py-2">
                                    <div>
                                        <label className="text-[9px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Rua / Avenida</label>
                                        <input value={data.street} onChange={e => setData({...data, street: e.target.value})}
                                            placeholder="Nome da rua..." className="smart-input p-3.5"
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
                                        Salvar Endereço <Check size={14}/>
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>

      </main>

      {/* 6. CHECKOUT FLUTUANTE (SÓ APARECE NO FINAL) */}
      {stage >= 5 && (
        <div ref={refs.checkout} className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="h-24 bg-gradient-to-t from-black via-black/95 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            
            <div className="bg-[#0e0e0e] border-t border-[#222] p-6 pb-8 rounded-t-[32px] shadow-[0_-10px_50px_rgba(0,0,0,0.8)] max-w-md mx-auto">
                <div className="flex justify-between items-end mb-5 px-1">
                    <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Valor Total</span>
                        <div className="flex items-baseline gap-2.5">
                             <span className="text-3xl font-bold text-white tracking-tighter">{formatBRL(calculateTotal())}</span>
                             {hasCoupon && <span className="text-[10px] text-[#0A84FF] bg-[#0A84FF]/10 px-2 py-1 rounded font-bold border border-[#0A84FF]/20">CUPOM ATIVO</span>}
                        </div>
                    </div>
                </div>
                
                <button onClick={finishOrder} className="w-full primary-btn h-14 rounded-[20px] font-bold text-[16px] flex items-center justify-center gap-3">
                    <MessageCircle size={20} fill="currentColor"/>
                    CONFIRMAR PEDIDO
                </button>
            </div>
        </div>
      )}

    </div>
  );
}
