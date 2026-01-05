import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, Check, Star, MapPin, Calendar, Clock,
  ArrowRight, ShieldCheck, Hand, Gift, Crown,
  CreditCard, Banknote, QrCode, Send, Sparkles, X, 
  AlertTriangle, Navigation, ThumbsUp, Info
} from 'lucide-react';

/* ==================================================================================
   1. ESTILOS CSS (DARK LUXURY - SP EDITION)
   ================================================================================== */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --primary: #0A84FF;
    --success: #32D74B;
    --bg-body: #050505;
    --bg-card: #141414;
    --border-color: rgba(255, 255, 255, 0.1);
  }

  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  
  body, html { 
    margin: 0; padding: 0; 
    background-color: var(--bg-body); 
    color: #F5F5F7; 
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  /* UTILS */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  /* ANIMATIONS */
  .fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes loadProgress { 0% { width: 0%; } 100% { width: 100%; } }

  /* COMPONENTES */
  .glass-card {
    background: rgba(28, 28, 30, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .input-field {
    background: #1C1C1E;
    border: 1px solid #333;
    color: white;
    font-size: 16px; /* Evita zoom no iOS */
    border-radius: 12px;
    width: 100%;
    padding: 16px;
    outline: none;
    transition: 0.2s;
  }
  .input-field:focus { border-color: var(--primary); background: #222; }

  .btn-main {
    background: var(--primary);
    color: white;
    font-weight: 700;
    font-size: 16px;
    border-radius: 14px;
    padding: 18px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3);
    transition: transform 0.1s;
  }
  .btn-main:active { transform: scale(0.98); }
  .btn-main:disabled { background: #333; color: #666; box-shadow: none; }

  /* LOADER */
  .loader-wrapper {
    position: fixed; inset: 0; z-index: 9999;
    background: #000;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    transition: opacity 0.5s ease;
  }
  .loader-bar { width: 200px; height: 4px; background: #222; border-radius: 4px; margin-top: 20px; overflow: hidden; }
  .loader-fill { height: 100%; background: var(--primary); animation: loadProgress 2s ease-in-out forwards; }
`;

/* ==================================================================================
   2. DADOS E REGRAS DE NEGÓCIO
   ================================================================================== */
const CONFIG = {
  WHATSAPP: "5517991360413", 
  COUPON_CODE: "PRIMEIRA10",
  COUPON_PCT: 0.10 // 10%
};

const DATA = {
  services: [
    { 
      id: 'masc_sp', 
      title: 'Protocolo Masculino SP', 
      price: 200, 
      time: '60 min',
      desc: 'Experiência completa. Relaxamento muscular profundo, técnica tântrica e finalização manual.',
      tag: 'MAIS PEDIDO 🏆'
    },
    { 
      id: 'relax_sp', 
      title: 'Massagem Relaxante', 
      price: 150, 
      time: '50 min',
      desc: 'Foco em dores musculares, stress e tensão urbana. Sem toques íntimos.',
      tag: null
    }
  ],
  extras: [
    { id: 'touch', label: 'Interação (Tocar)', price: 55, sub: 'Permitido tocar o massagista' },
    { id: 'upgrade', label: '+30 Minutos', price: 80, sub: 'Sessão estendida' },
    { id: 'aroma', label: 'Aromaterapia', price: 20, sub: 'Óleos essenciais importados' }
  ],
  reviews: [
    { txt: "Discrição total. O atendimento no hotel foi impecável.", author: "Ricardo (Empresário)", stars: 5 },
    { txt: "O extra de interação vale cada centavo. Recomendo.", author: "Anônimo SP", stars: 5 },
    { txt: "Mãos firmes, resolveu minha dor nas costas.", author: "Carlos M.", stars: 5 },
    { txt: "Pontual e muito educado.", author: "Felipe", stars: 5 }
  ]
};

/* ==================================================================================
   3. HELPER SEGURO PARA STORAGE (Evita quebra de Deploy)
   ================================================================================== */
const getStorage = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

/* ==================================================================================
   4. COMPONENTES INTERNOS
   ================================================================================== */
const FullScreenLoader = ({ visible }) => (
  <div className={`loader-wrapper ${!visible ? 'pointer-events-none opacity-0' : ''}`}>
    <div className="relative">
      <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 animate-pulse"></div>
      <Crown size={64} className="text-[#0A84FF] relative z-10" />
    </div>
    <h1 className="text-white font-bold text-xl mt-6 tracking-[0.2em] uppercase">Thalyson VIP</h1>
    <p className="text-gray-500 text-xs mt-2 font-medium">Carregando Sistema...</p>
    <div className="loader-bar"><div className="loader-fill"></div></div>
  </div>
);

const CouponModal = ({ onClose, onApply }) => (
  <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
    <div className="bg-[#1C1C1E] w-full max-w-sm rounded-3xl p-8 text-center border border-white/10 shadow-2xl relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 p-2 hover:text-white"><X size={20}/></button>
      <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Gift size={32} className="text-[#0A84FF]" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">Boas-vindas VIP</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Como é sua primeira vez aqui, liberamos <strong>10% de Desconto</strong> no seu agendamento hoje.
      </p>
      <button onClick={onApply} className="btn-main">RESGATAR 10% OFF</button>
    </div>
  </div>
);

const BetaHeader = () => (
  <div className="bg-[#FFD60A]/10 border-b border-[#FFD60A]/10 py-2 px-4 flex items-center justify-center gap-2">
    <AlertTriangle size={14} className="text-[#FFD60A]" />
    <span className="text-[10px] font-bold text-[#FFD60A] uppercase tracking-wide">App em Fase Beta • SP</span>
  </div>
);

/* ==================================================================================
   5. APLICAÇÃO PRINCIPAL
   ================================================================================== */
export default function App() {
  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('home');
  const [showCoupon, setShowCoupon] = useState(false);
  
  // Persistência
  const [user, setUser] = useState('');
  const [cart, setCart] = useState({
    service: null,
    date: null,
    time: null,
    locationType: null, // 'metro' or 'uber'
    address: '',
    extras: [],
    payment: 'pix',
    couponApplied: false
  });

  // --- INIT LOGIC ---
  useEffect(() => {
    // Simula carregamento
    setTimeout(() => {
      setLoading(false);
      // Verifica se já usou cupom antes
      const usedBefore = getStorage('thaly_coupon_used');
      if (!usedBefore) {
        setTimeout(() => setShowCoupon(true), 1000);
      }
    }, 2000);
  }, []);

  // --- ACTIONS ---
  const handleNext = (next) => {
    if (navigator.vibrate) navigator.vibrate(10);
    window.scrollTo(0,0);
    setStep(next);
  };

  const applyCoupon = () => {
    setCart(prev => ({ ...prev, couponApplied: true }));
    setShowCoupon(false);
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
      const item = DATA.extras.find(e => e.id === eid);
      if (item) sub += item.price;
    });

    // Desconto
    let discount = 0;
    if (cart.couponApplied) {
      discount = sub * CONFIG.COUPON_PCT;
    }

    return { sub, discount, final: sub - discount };
  }, [cart]);

  // --- WHATSAPP GENERATOR ---
  const sendWhatsApp = () => {
    // Salvar que usou cupom
    if (cart.couponApplied) setStorage('thaly_coupon_used', 'true');

    const dateStr = cart.date ? `${cart.date.getDate()}/${cart.date.getMonth()+1}` : '';
    
    // Montar texto dos extras
    const extrasTxt = cart.extras.length 
      ? cart.extras.map(id => `✅ ${DATA.extras.find(e=>e.id===id).label}`).join('\n') 
      : 'Nenhum extra';

    // Lógica UBER vs METRO
    const locTxt = cart.locationType === 'metro' 
      ? `📍 *Perto do Metrô (<1km)*\nEndereço: ${cart.address}\n(Taxa de Deslocamento: GRÁTIS)`
      : `🚗 *Longe do Metrô (>1km)*\nEndereço: ${cart.address}\n(Taxa de Uber: A CALCULAR)`;

    const msg = 
`*AGENDAMENTO VIP SP* 🔒
--------------------------------
👤 *Nome:* ${user}
📅 *Data:* ${dateStr} às ${cart.time}

💆 *SERVIÇO:*
${cart.service.title}

🏠 *LOCALIZAÇÃO:*
${locTxt}

✨ *ADICIONAIS:*
${extrasTxt}

--------------------------------
💰 *RESUMO (Estimado):*
Subtotal: R$ ${totals.sub.toFixed(2)}
${cart.couponApplied ? `Desconto (10%): - R$ ${totals.discount.toFixed(2)}` : ''}
*TOTAL SERVIÇO: R$ ${totals.final.toFixed(2)}*
${cart.locationType === 'uber' ? '_(+ Valor do Uber a somar)_' : ''}

💳 *Pagamento:* ${cart.payment === 'pix' ? 'PIX' : 'Dinheiro'}
--------------------------------`;

    window.open(`https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen pb-10">
      <style>{styles}</style>
      <FullScreenLoader visible={loading} />

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
        <BetaHeader />
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
          {/* Avatar Placeholder */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center">
            <span className="text-xs">🧔🏻</span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6 pb-24">

        {/* === HOME === */}
        {step === 'home' && (
          <div className="fade-in">
            <h1 className="text-3xl font-bold mb-3 leading-tight">Massagem &<br/>Relaxamento SP</h1>
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

            <button onClick={() => handleNext('identity')} className="btn-main mb-8">
              AGENDAR AGORA <ArrowRight size={20}/>
            </button>

            {/* AVALIAÇÕES */}
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
          <div className="slide-up">
            <h2 className="text-2xl font-bold mb-2">Identificação</h2>
            <p className="text-gray-400 text-sm mb-8">Como prefere ser chamado?</p>
            
            <div className="glass-card p-6 rounded-3xl mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block">Nome / Apelido</label>
              <input 
                value={user}
                onChange={e => setUser(e.target.value)}
                placeholder="Digite aqui..."
                className="input-field text-lg font-medium"
                autoFocus
              />
            </div>

            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 items-start mb-6">
               <ShieldCheck size={20} className="text-[#0A84FF] flex-shrink-0 mt-0.5"/>
               <p className="text-xs text-blue-200/80 leading-relaxed">
                 <strong className="text-blue-400">Política de Sigilo:</strong> Seus dados não ficam online. Tudo é tratado diretamente no WhatsApp.
               </p>
            </div>

            <button disabled={user.length < 3} onClick={() => handleNext('service')} className="btn-main">
              CONTINUAR
            </button>
          </div>
        )}

        {/* === SERVICE === */}
        {step === 'service' && (
          <div className="slide-up pb-20">
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

        {/* === CONFIGURATION === */}
        {step === 'config' && (
          <div className="slide-up space-y-8 pb-32">
            
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
                <div className="grid grid-cols-4 gap-2 mt-3 fade-in">
                   {['10:00','11:00','13:00','15:00','17:00','19:00','20:00','21:00'].map(t => (
                     <button key={t} onClick={() => setCart(c => ({...c, time: t}))} className={`py-2.5 rounded-lg text-xs font-bold border ${cart.time === t ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-[#333]'}`}>{t}</button>
                   ))}
                </div>
              )}
            </section>

            {/* LOCALIZAÇÃO - UBER LOGIC */}
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
                    <p className="text-[10px] text-yellow-500">Uber (A Combinar)</p>
                  </button>
                </div>
                
                {cart.locationType && (
                  <div className="fade-in">
                    <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block">Endereço (Hotel/Domicílio)</label>
                    <input 
                      placeholder="Rua, Número, Bairro..." 
                      className="input-field"
                      onChange={e => setCart(c => ({...c, address: e.target.value}))}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* EXTRAS (SEM MACA) */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Adicionais VIP</h3>
              <div className="space-y-3">
                {DATA.extras.map(e => {
                  const active = cart.extras.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => toggleExtra(e.id)} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${active ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
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

            {/* FOOTER FIXO */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#151515] border-t border-white/10 p-5 z-50">
               <div className="max-w-md mx-auto flex justify-between items-center gap-4">
                 <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Total Estimado</p>
                   <p className="text-2xl font-bold text-white">R$ {totals.final}</p>
                 </div>
                 <button 
                    disabled={!cart.date || !cart.time || !cart.locationType || cart.address.length < 5} 
                    onClick={() => handleNext('checkout')} 
                    className="btn-main w-auto px-8 py-3 rounded-xl text-sm"
                 >
                   REVISAR <ArrowRight size={18}/>
                 </button>
               </div>
            </div>

          </div>
        )}

        {/* === CHECKOUT === */}
        {step === 'checkout' && (
          <div className="slide-up pb-24">
            <h2 className="text-2xl font-bold mb-6">Confirmação</h2>

            {/* RECIBO */}
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

            <button onClick={sendWhatsApp} className="btn-main bg-[#25D366] hover:bg-[#20bd5a] shadow-[0_8px_30px_rgba(37,211,102,0.3)]">
              ENVIAR PEDIDO <Send size={20}/>
            </button>
            <p className="text-center text-xs text-gray-600 mt-4 max-w-[280px] mx-auto">
              Ao clicar, você será redirecionado para o WhatsApp com todos os detalhes.
            </p>
          </div>
        )}

        {/* === SUCCESS === */}
        {step === 'success' && (
          <div className="fade-in flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,211,102,0.4)]">
              <ThumbsUp size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Solicitação Enviada!</h2>
            <p className="text-gray-400 mb-8 max-w-[250px] leading-relaxed">
              Sua pré-reserva está no meu WhatsApp. Responderei em instantes.
            </p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl border border-[#333] text-gray-400 text-sm hover:text-white hover:border-white transition-colors">
              Voltar ao Início
            </button>
          </div>
        )}

      </div>

      {/* MODAL CUPOM */}
      {showCoupon && <CouponModal onClose={() => setShowCoupon(false)} onApply={applyCoupon} />}
    </div>
  );
}
