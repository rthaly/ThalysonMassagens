import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, Check, Star, MapPin, Calendar, Clock,
  ArrowRight, ShieldCheck, Hand, Gift, Crown,
  CreditCard, Banknote, QrCode, Send, Sparkles, X, 
  AlertTriangle, Info, Navigation, ThumbsUp
} from 'lucide-react';

/* ==================================================================================
   1. DESIGN SYSTEM & CSS (CSS-IN-JS OTMIZADO)
   ================================================================================== */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');

  :root {
    --primary: #0A84FF;
    --bg-dark: #050505;
    --card-bg: rgba(28, 28, 30, 0.75);
    --glass-border: rgba(255, 255, 255, 0.08);
    --safe-area-bottom: env(safe-area-inset-bottom);
  }

  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
  
  body, html { 
    margin: 0; padding: 0; 
    background-color: var(--bg-dark); 
    color: #F5F5F7; 
    font-family: 'Inter', -apple-system, sans-serif;
    overflow-x: hidden;
  }

  /* --- UTILITÁRIOS --- */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .tap-target { min-height: 56px; } /* Área de toque aumentada */
  .fade-enter { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  @keyframes pulseSubtle { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

  /* --- COMPONENTES --- */
  .glass-card {
    background: var(--card-bg);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid var(--glass-border);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  }

  .custom-input {
    background: #1C1C1E;
    border: 1px solid #333;
    color: white;
    font-size: 16px; /* Evita zoom no iOS */
    border-radius: 14px;
    width: 100%;
    padding: 16px;
    transition: all 0.2s;
    user-select: text; /* Permite digitar */
  }
  .custom-input:focus { border-color: var(--primary); outline: none; background: #2C2C2E; }

  .btn-primary {
    background: var(--primary);
    color: white;
    font-weight: 700;
    font-size: 16px;
    border-radius: 16px;
    padding: 18px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    box-shadow: 0 4px 20px rgba(10, 132, 255, 0.3);
    border: none;
    cursor: pointer;
    transition: transform 0.1s;
  }
  .btn-primary:active { transform: scale(0.96); }
  .btn-primary:disabled { background: #333; color: #666; box-shadow: none; cursor: not-allowed; }

  /* --- LOADER --- */
  .app-loader {
    position: fixed; inset: 0; z-index: 9999; 
    background: #000;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    transition: opacity 0.5s ease, visibility 0.5s;
  }
  .app-loader.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
  
  .loader-bar-bg { width: 180px; height: 3px; background: #222; border-radius: 3px; overflow: hidden; margin-top: 24px; }
  .loader-bar-fill { height: 100%; background: var(--primary); width: 0%; transition: width 0.1s linear; }

  /* --- TOAST --- */
  .toast-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000; }
  .toast { background: #32D74B; color: #000; padding: 12px 24px; rounded: 30px; font-weight: 600; font-size: 14px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 8px; animation: fadeIn 0.3s forwards; }
`;

/* ==================================================================================
   2. REGRAS DE NEGÓCIO & DADOS
   ================================================================================== */
const CONFIG = {
  WHATSAPP: "5517991360413", 
  COUPON_CODE: "BEMVINDO10",
  COUPON_VAL: 0.10, // 10%
  STORAGE_KEYS: {
    USED_COUPON: 'thaly_used_coupon_v1',
    USER_NAME: 'thaly_username_v1'
  }
};

const DATA = {
  services: [
    { 
      id: 'masculina', 
      title: 'Protocolo Masculino SP', 
      price: 200, 
      time: '60 min',
      desc: 'Experiência completa. Relaxamento muscular profundo seguido de técnica tântrica e finalização manual.',
      tag: 'MAIS PEDIDO 🏆'
    },
    { 
      id: 'relaxante', 
      title: 'Massagem Relaxante', 
      price: 150, 
      time: '50 min',
      desc: 'Foco terapêutico. Alívio imediato de dores nas costas, pernas e tensão urbana. Sem toque íntimo.',
      tag: null
    }
  ],
  extras: [
    { id: 'touch', label: 'Interação (Tocar)', price: 55, sub: 'Permitido tocar o massagista' },
    { id: 'upgrade', label: '+30 Minutos', price: 80, sub: 'Sessão estendida' },
    { id: 'aroma', label: 'Aromaterapia Premium', price: 20, sub: 'Óleos importados' }
  ],
  reviews: [
    { txt: "Serviço de primeira. O atendimento no hotel foi super discreto.", author: "Ricardo (Empresário)", stars: 5 },
    { txt: "Vale muito a pena o extra de interação. Conexão surreal.", author: "Anônimo SP", stars: 5 },
    { txt: "Mãos firmes, tirou toda minha dor nas costas.", author: "Carlos M.", stars: 5 },
    { txt: "Pontual e educado. Recomendo para quem busca sigilo.", author: "Felipe", stars: 5 }
  ]
};

/* ==================================================================================
   3. COMPONENTES DE UI
   ================================================================================== */
const Loader = ({ progress, visible }) => (
  <div className={`app-loader ${!visible ? 'hidden' : ''}`}>
    <div className="relative">
      <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-20 rounded-full animate-pulse"></div>
      <Crown size={56} className="text-[#0A84FF] relative z-10" />
    </div>
    <h1 className="text-white font-bold text-xl mt-6 tracking-[0.2em] uppercase">Thalyson VIP</h1>
    <p className="text-gray-500 text-xs mt-2 font-medium">Carregando Experiência...</p>
    <div className="loader-bar-bg">
      <div className="loader-bar-fill" style={{width: `${progress}%`}}></div>
    </div>
  </div>
);

const Toast = ({ msg }) => (
  <div className="toast-container">
    <div className="toast"><Check size={16}/> {msg}</div>
  </div>
);

const BetaBadge = () => (
  <div className="bg-[#FFD60A]/10 border-b border-[#FFD60A]/10 py-2 px-4 flex items-center justify-center gap-2">
    <AlertTriangle size={12} className="text-[#FFD60A]" />
    <span className="text-[10px] font-bold text-[#FFD60A] uppercase tracking-wide">App em Fase Beta • V2.0</span>
  </div>
);

const ModalCoupon = ({ onClose, onApply }) => (
  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 fade-enter">
    <div className="bg-[#1C1C1E] w-full max-w-sm rounded-3xl p-6 text-center border border-white/10 shadow-2xl relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={20}/></button>
      <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Gift size={32} className="text-[#0A84FF]" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Presente de Boas-vindas</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Aplique agora <strong>10% OFF</strong> no seu primeiro agendamento via App.
      </p>
      <button onClick={onApply} className="btn-primary">RESGATAR 10% OFF</button>
    </div>
  </div>
);

/* ==================================================================================
   4. APP LOGIC (FULL STACK SIMULADO)
   ================================================================================== */
export default function App() {
  // --- STATE MANAGEMENT ---
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('home');
  const [toast, setToast] = useState(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [hasUsedCoupon, setHasUsedCoupon] = useState(false);

  // User & Cart State
  const [user, setUser] = useState('');
  const [cart, setCart] = useState({
    service: null,
    date: null,
    time: null,
    locationType: null, // 'metro' (<1km) or 'uber' (>1km)
    address: '',
    extras: [],
    payment: 'pix',
    couponApplied: false
  });

  // --- INITIALIZATION ---
  useEffect(() => {
    // Check Storage
    const storedUser = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_NAME);
    const storedCoupon = localStorage.getItem(CONFIG.STORAGE_KEYS.USED_COUPON);
    
    if (storedUser) setUser(storedUser);
    if (storedCoupon === 'true') setHasUsedCoupon(true);

    // Fake Loading
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p > 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoaded(true);
          // Show coupon only if never used
          if (localStorage.getItem(CONFIG.STORAGE_KEYS.USED_COUPON) !== 'true') {
             setTimeout(() => setShowCoupon(true), 1500);
          }
        }, 500);
      }
      setProgress(p);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // --- ACTIONS ---
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleNext = (nextStep) => {
    if (navigator.vibrate) navigator.vibrate(10);
    window.scrollTo(0,0);
    setStep(nextStep);
  };

  const handleApplyCoupon = () => {
    setCart(c => ({...c, couponApplied: true}));
    setShowCoupon(false);
    showToast("Cupom de 10% Aplicado!");
  };

  const toggleExtra = (id) => {
    setCart(prev => {
      const exists = prev.extras.includes(id);
      return {
        ...prev,
        extras: exists ? prev.extras.filter(x => x !== id) : [...prev.extras, id]
      };
    });
  };

  // --- CALC ENGINE ---
  const totals = useMemo(() => {
    let sub = 0;
    if (cart.service) sub += cart.service.price;
    
    // Extras
    cart.extras.forEach(eid => {
      const it = DATA.extras.find(e => e.id === eid);
      if (it) sub += it.price;
    });

    // Discount
    let discount = 0;
    if (cart.couponApplied && !hasUsedCoupon) {
      discount = sub * CONFIG.COUPON_VAL;
    }

    return {
      sub,
      discount,
      final: sub - discount
    };
  }, [cart, hasUsedCoupon]);

  // --- WHATSAPP GENERATOR ---
  const finalizeOrder = () => {
    // 1. Save Data
    localStorage.setItem(CONFIG.STORAGE_KEYS.USER_NAME, user);
    if (cart.couponApplied) {
      localStorage.setItem(CONFIG.STORAGE_KEYS.USED_COUPON, 'true');
    }

    // 2. Build Message
    const dateStr = cart.date ? `${cart.date.getDate()}/${cart.date.getMonth()+1}` : 'Hoje';
    const extrasTxt = cart.extras.length 
      ? cart.extras.map(id => `✅ ${DATA.extras.find(e=>e.id===id).label}`).join('\n') 
      : 'Nenhum extra';
    
    const locationTxt = cart.locationType === 'metro' 
      ? `📍 Perto do Metrô (Free)\nEndereço: ${cart.address}` 
      : `🚗 Uber (>1km) - Calcular Taxa\nEndereço: ${cart.address}`;

    const msg = 
`*AGENDAMENTO CONFIRMADO* 🔒
--------------------------------
👤 *Cliente:* ${user}
📅 *Data:* ${dateStr} às ${cart.time}

💆 *SERVIÇO:*
${cart.service.title}

🏠 *LOCALIZAÇÃO:*
${locationTxt}

✨ *ADICIONAIS:*
${extrasTxt}

--------------------------------
💰 *RESUMO (Estimado):*
Subtotal: R$ ${totals.sub.toFixed(2)}
${cart.couponApplied ? `Desconto: - R$ ${totals.discount.toFixed(2)}` : ''}
*TOTAL SERVIÇO: R$ ${totals.final.toFixed(2)}*
${cart.locationType === 'uber' ? '_(+ Taxa Uber a calcular)_' : '_(Isento de Taxa)_'}

💳 *Pagamento:* ${cart.payment === 'pix' ? 'PIX' : 'Dinheiro'}
--------------------------------
_Aguardando aprovação do terapeuta._`;

    // 3. Redirect
    window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen pb-safe">
      <style>{styles}</style>
      <Loader progress={progress} visible={!loaded} />
      {toast && <Toast msg={toast} />}

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/5">
        <BetaBadge />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
             {step !== 'home' && step !== 'success' && (
               <button onClick={() => {
                 if(step === 'checkout') setStep('config');
                 else if(step === 'config') setStep('service');
                 else if(step === 'service') setStep('identity');
                 else setStep('home');
               }} className="w-10 h-10 bg-[#1C1C1E] rounded-full flex items-center justify-center text-[#0A84FF]">
                 <ChevronLeft />
               </button>
             )}
             <div>
               <h1 className="font-bold text-sm tracking-wide text-white">THALYSON VIP</h1>
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] text-gray-400 font-medium">Online em SP</span>
               </div>
             </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center">
            <span className="text-xs">🧔🏻</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6 pb-24">
        
        {/* === HOME === */}
        {step === 'home' && (
          <div className="fade-enter">
            <h1 className="text-3xl font-bold mb-3 leading-tight">Massoterapia &<br/>Relaxamento SP</h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Atendimento exclusivo masculino em São Paulo. 
              Técnica apurada, discrição absoluta e conforto onde você estiver.
            </p>

            <div className="glass-card p-6 rounded-3xl mb-8 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10"><Crown size={120} /></div>
              <h3 className="text-xl font-bold mb-1 relative z-10">Experiência VIP</h3>
              <p className="text-sm text-gray-300 mb-4 relative z-10">Massagem + Finalização + Extras</p>
              <div className="flex gap-2 relative z-10">
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-bold text-[#0A84FF]">HIGIENIZADO</span>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded font-bold text-[#0A84FF]">SIGILOSO</span>
              </div>
            </div>

            <button onClick={() => handleNext('identity')} className="btn-primary mb-8">
              AGENDAR AGORA <ArrowRight size={20}/>
            </button>

            {/* AVALIAÇÕES (CARROUSEL) */}
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Avaliações Recentes</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {DATA.reviews.map((r, i) => (
                <div key={i} className="min-w-[260px] bg-[#111] p-5 rounded-2xl border border-white/5">
                  <div className="flex text-[#FFD60A] mb-2 gap-1">
                    {[...Array(r.stars)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}
                  </div>
                  <p className="text-sm text-gray-300 italic mb-3 leading-relaxed">"{r.txt}"</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{r.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === IDENTITY === */}
        {step === 'identity' && (
          <div className="fade-enter">
            <h2 className="text-2xl font-bold mb-2">Identificação</h2>
            <p className="text-gray-400 text-sm mb-8">Como prefere ser chamado?</p>
            
            <div className="glass-card p-6 rounded-3xl mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block">Nome / Apelido</label>
              <input 
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="Digite aqui..."
                className="custom-input text-lg font-medium"
                autoFocus
              />
            </div>

            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 items-start mb-6">
               <ShieldCheck size={20} className="text-[#0A84FF] flex-shrink-0 mt-0.5"/>
               <p className="text-xs text-blue-200/80 leading-relaxed">
                 <strong className="text-blue-400">Política de Sigilo:</strong> Seus dados não são armazenados em nuvem. A negociação ocorre via WhatsApp pessoal.
               </p>
            </div>

            <button disabled={user.length < 3} onClick={() => handleNext('service')} className="btn-primary">
              CONTINUAR
            </button>
          </div>
        )}

        {/* === SERVICE === */}
        {step === 'service' && (
          <div className="fade-enter pb-20">
            <h2 className="text-2xl font-bold mb-6">Menu de Serviços</h2>
            <div className="space-y-4">
              {DATA.services.map(s => (
                <div 
                  key={s.id}
                  onClick={() => { setCart(c => ({...c, service: s})); handleNext('config'); }}
                  className={`glass-card p-6 rounded-3xl relative cursor-pointer transition-all active:scale-98 ${cart.service?.id === s.id ? 'border-[#0A84FF] bg-[#0A84FF]/10' : 'hover:border-white/20'}`}
                >
                  {s.tag && <span className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">{s.tag}</span>}
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{s.title}</h3>
                    <div className="text-right">
                      <p className="text-[#0A84FF] font-bold text-lg">R$ {s.price}</p>
                      <p className="text-[10px] text-gray-500">{s.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === CONFIG (Location, Date, Extras) === */}
        {step === 'config' && (
          <div className="fade-enter space-y-8 pb-32">
            
            {/* DATA */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Data e Horário</h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[0,1,2,3,4,5].map(d => {
                  const date = new Date(); date.setDate(date.getDate() + d);
                  const isSel = cart.date?.getDate() === date.getDate();
                  return (
                    <button key={d} onClick={() => setCart(c => ({...c, date}))} 
                      className={`min-w-[64px] h-[72px] rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                      <span className="text-[10px] uppercase font-bold text-gray-400">{date.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3)}</span>
                      <span className="text-lg font-bold text-white">{date.getDate()}</span>
                    </button>
                  )
                })}
              </div>
              {cart.date && (
                <div className="grid grid-cols-4 gap-2 mt-3 animate-slideUp">
                   {['10:00','11:00','13:00','15:00','17:00','19:00','20:00','21:00'].map(t => (
                     <button key={t} onClick={() => setCart(c => ({...c, time: t}))} className={`py-2.5 rounded-lg text-xs font-bold border ${cart.time === t ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-[#333]'}`}>{t}</button>
                   ))}
                </div>
              )}
            </section>

            {/* LOCALIZAÇÃO (LÓGICA UBER/METRO) */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Localização (SP)</h3>
              <div className="glass-card p-5 rounded-3xl">
                <div className="flex gap-3 mb-4">
                  <button onClick={() => setCart(c => ({...c, locationType: 'metro'}))} className={`flex-1 p-3 rounded-xl border text-center transition-all ${cart.locationType === 'metro' ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-white' : 'bg-[#111] border-[#333] text-gray-400'}`}>
                    <Navigation size={20} className="mx-auto mb-1"/>
                    <p className="text-xs font-bold">Perto Metrô</p>
                    <p className="text-[10px] text-green-500">&lt; 1km (Free)</p>
                  </button>
                  <button onClick={() => setCart(c => ({...c, locationType: 'uber'}))} className={`flex-1 p-3 rounded-xl border text-center transition-all ${cart.locationType === 'uber' ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-white' : 'bg-[#111] border-[#333] text-gray-400'}`}>
                    <MapPin size={20} className="mx-auto mb-1"/>
                    <p className="text-xs font-bold">Longe Metrô</p>
                    <p className="text-[10px] text-yellow-500">Uber (Combinar)</p>
                  </button>
                </div>
                
                {cart.locationType && (
                  <div className="animate-slideUp">
                    <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block">Endereço (Hotel/Domicílio)</label>
                    <input 
                      placeholder="Rua, Número, Bairro..." 
                      className="custom-input"
                      onChange={e => setCart(c => ({...c, address: e.target.value}))}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* EXTRAS */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Adicionais VIP</h3>
              <div className="space-y-3">
                {DATA.extras.map(e => {
                  const active = cart.extras.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => toggleExtra(e.id)} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all tap-target ${active ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                       <div className="text-left">
                         <p className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-300'}`}>{e.label}</p>
                         <p className="text-xs text-gray-500">{e.sub}</p>
                       </div>
                       <span className={`text-sm font-bold ${active ? 'text-[#0A84FF]' : 'text-gray-500'}`}>+ R$ {e.price}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* STICKY FOOTER */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#151515] border-t border-white/10 p-5 z-50 pb-safe">
               <div className="max-w-md mx-auto flex justify-between items-center gap-4">
                 <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Total Estimado</p>
                   <p className="text-2xl font-bold text-white">R$ {totals.final}</p>
                 </div>
                 <button 
                    disabled={!cart.date || !cart.time || !cart.locationType || cart.address.length < 5} 
                    onClick={() => handleNext('checkout')} 
                    className="btn-primary w-auto px-8 py-3 rounded-xl text-sm"
                 >
                   REVISAR <ArrowRight size={18}/>
                 </button>
               </div>
            </div>

          </div>
        )}

        {/* === CHECKOUT === */}
        {step === 'checkout' && (
          <div className="fade-enter pb-24">
            <h2 className="text-2xl font-bold mb-6">Confirmação</h2>

            {/* RECIBO VISUAL */}
            <div className="bg-white text-black p-6 rounded-2xl shadow-2xl relative overflow-hidden mb-8">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#0A84FF]"></div>
               <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                  <h3 className="font-bold text-lg tracking-tight">THALYSON VIP</h3>
                  <span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded">PENDENTE</span>
               </div>
               
               <div className="space-y-2 text-sm mb-6">
                 <div className="flex justify-between font-bold"><span>{cart.service.title}</span><span>R$ {cart.service.price}</span></div>
                 {cart.extras.map(id => {
                   const item = DATA.extras.find(e => e.id === id);
                   return <div key={id} className="flex justify-between text-blue-600 font-medium"><span>+ {item.label}</span><span>R$ {item.price}</span></div>
                 })}
                 {cart.locationType === 'uber' && (
                   <div className="flex justify-between text-yellow-600 font-bold text-xs bg-yellow-100 p-1 rounded">
                     <span>Taxa Uber (>1km)</span>
                     <span>A CALCULAR</span>
                   </div>
                 )}
                 {totals.discount > 0 && (
                   <div className="flex justify-between text-green-600 font-bold border-t border-dashed border-gray-300 pt-2 mt-2">
                     <span>Desconto (10%)</span>
                     <span>- R$ {totals.discount.toFixed(2)}</span>
                   </div>
                 )}
               </div>

               <div className="flex justify-between items-end border-t border-gray-800 pt-4">
                 <span className="font-bold text-xl">TOTAL</span>
                 <span className="font-bold text-2xl">R$ {totals.final.toFixed(0)}</span>
               </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Forma de Pagamento</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
               <button onClick={() => setCart(c => ({...c, payment:'pix'}))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${cart.payment === 'pix' ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333] text-gray-500'}`}>
                 <QrCode/> <span className="font-bold text-sm">PIX</span>
               </button>
               <button onClick={() => setCart(c => ({...c, payment:'dinheiro'}))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${cart.payment === 'dinheiro' ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333] text-gray-500'}`}>
                 <Banknote/> <span className="font-bold text-sm">Dinheiro</span>
               </button>
            </div>

            <button onClick={finalizeOrder} className="btn-primary bg-[#25D366] hover:bg-[#20bd5a] shadow-[0_8px_30px_rgba(37,211,102,0.3)]">
              ENVIAR PEDIDO <Send size={20}/>
            </button>
            <p className="text-center text-xs text-gray-600 mt-4 max-w-[280px] mx-auto">
              Ao clicar, você será redirecionado para o WhatsApp com todos os detalhes preenchidos.
            </p>
          </div>
        )}

        {/* === SUCCESS === */}
        {step === 'success' && (
          <div className="fade-enter flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,211,102,0.4)]">
              <ThumbsUp size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Solicitação Enviada!</h2>
            <p className="text-gray-400 mb-8 max-w-[250px] leading-relaxed">
              Sua pré-reserva está no meu WhatsApp. Responderei em instantes para confirmar.
            </p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl border border-[#333] text-gray-400 text-sm hover:text-white hover:border-white transition-colors">
              Voltar ao Início
            </button>
          </div>
        )}

      </div>

      {/* MODAIS */}
      {showCoupon && <ModalCoupon onClose={() => setShowCoupon(false)} onApply={handleApplyCoupon} />}

    </div>
  );
}
