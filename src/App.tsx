import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, Check, Star, MapPin, Calendar, Clock,
  ArrowRight, ShieldCheck, Zap, Hand, Gift, Crown,
  CreditCard, Banknote, QrCode, Send, Sparkles, X, 
  AlertTriangle, CheckCircle2, Info
} from 'lucide-react';

/* ==================================================================================
   1. ESTILOS CSS INJETADOS (DARK LUXURY SP EDITION)
   ================================================================================== */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');

  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body, html { margin: 0; padding: 0; background-color: #000; color: #fff; font-family: 'Inter', -apple-system, sans-serif; }
  
  /* Utilitários */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .tap-target { min-height: 52px; } /* Melhor para dedos em telas mobile */

  /* Animações */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }
  @keyframes loadBar { 0% { width: 0%; } 100% { width: 100%; } }

  .animate-enter { animation: fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  
  /* Glassmorphism Premium */
  .glass-panel {
    background: rgba(30, 30, 30, 0.7);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  /* Inputs Mobile-First (Font 16px evita zoom no iOS) */
  .custom-input {
    background: #151517;
    border: 1px solid #333;
    color: white;
    font-size: 16px; 
    border-radius: 14px;
    width: 100%;
    padding: 18px;
    transition: 0.2s;
  }
  .custom-input:focus { border-color: #0A84FF; outline: none; background: #1C1C1E; }

  /* Botão Principal */
  .btn-primary {
    background: #0A84FF;
    color: white;
    font-weight: 700;
    font-size: 16px;
    border-radius: 16px;
    padding: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    box-shadow: 0 8px 30px rgba(10, 132, 255, 0.3);
    border: none;
    cursor: pointer;
    transition: transform 0.1s;
  }
  .btn-primary:active { transform: scale(0.97); }
  .btn-primary:disabled { background: #333; color: #666; box-shadow: none; cursor: not-allowed; }

  /* Loader */
  .loader-bg {
    position: fixed; inset: 0; z-index: 9999; background: #000;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .progress-container { width: 200px; height: 4px; background: #222; border-radius: 4px; overflow: hidden; margin-top: 20px; }
  .progress-bar { height: 100%; background: #0A84FF; animation: loadBar 2.5s ease-in-out forwards; }

  /* Popup Cupom */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px);
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fadeIn 0.3s ease-out;
  }
`;

/* ==================================================================================
   2. CONFIGURAÇÃO DE NEGÓCIO (SÃO PAULO)
   ================================================================================== */
const CONFIG = {
  PHONE: "5517991360413", // Seu número
  COUPONS: {
    'BEMVINDO': { code: 'BEMVINDO', discount: 0.10, type: 'percent', label: '10% OFF' }, // 10%
    'VIPSP': { code: 'VIPSP', discount: 20, type: 'fixed', label: 'R$ 20 OFF' }
  }
};

const DATA = {
  services: [
    { 
      id: 'masculina', 
      title: 'Massagem Masculina (SP)', 
      price: 200, 
      desc: 'Técnica exclusiva. Relaxamento profundo + Finalização manual inclusa.',
      tag: 'PREFERIDA EM SP 🔥'
    },
    { 
      id: 'relaxante', 
      title: 'Massagem Relaxante', 
      price: 150, 
      desc: 'Foco terapêutico. Costas, pernas e lombar. Alívio de tensão e stress urbano.',
      tag: null
    }
  ],
  extras: [
    { id: 'touch', label: 'Tocar o Massagista', price: 55, sub: 'Interação permitida', icon: <Hand size={18}/> },
    { id: 'upgrade', label: '+30 Minutos', price: 80, sub: 'Sessão estendida', icon: <Clock size={18}/> },
    { id: 'table', label: 'Levar Maca Portátil', price: 30, sub: 'Experiência Pro', icon: <Zap size={18}/> },
  ],
  locations: [
    { id: 'home_sp', label: 'Domicílio / Hotel', fee: 35, icon: <MapPin size={20}/>, details: 'Vou até você (Uber Incluso)' },
    // Removido Motel e Cidades Vizinhas conforme solicitado
  ]
};

/* ==================================================================================
   3. COMPONENTES VISUAIS
   ================================================================================== */
const AdvancedLoader = () => (
  <div className="loader-bg">
    <div className="relative">
      <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
      <Crown size={48} className="text-[#0A84FF] relative z-10 animate-pulse" />
    </div>
    <h1 className="text-white font-bold text-lg mt-6 tracking-widest uppercase">Thalyson VIP</h1>
    <p className="text-gray-500 text-xs mt-2">São Paulo • Massoterapia</p>
    <div className="progress-container"><div className="progress-bar"></div></div>
  </div>
);

const CouponPopup = ({ onClose, onApply }) => (
  <div className="modal-overlay">
    <div className="bg-[#1C1C1E] border border-[#333] w-full max-w-sm rounded-3xl p-6 text-center relative shadow-2xl animate-enter">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 p-2"><X size={20}/></button>
      
      <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <Gift size={32} className="text-[#0A84FF]" />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2">Presente para Você</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        Como é sua primeira vez no novo App, ganhe <strong>10% de Desconto</strong> no seu agendamento em São Paulo.
      </p>

      <button onClick={onApply} className="btn-primary">
        RESGATAR AGORA
      </button>
      <p className="text-[10px] text-gray-600 mt-4">Válido apenas hoje. Aplicado no final.</p>
    </div>
  </div>
);

const BetaBanner = () => (
  <div className="bg-[#FFD60A]/10 border-b border-[#FFD60A]/20 px-4 py-2 flex items-center justify-center gap-2">
    <AlertTriangle size={12} className="text-[#FFD60A]" />
    <span className="text-[10px] font-bold text-[#FFD60A] uppercase tracking-wide">App em Fase de Testes (Beta)</span>
  </div>
);

/* ==================================================================================
   4. APP PRINCIPAL
   ================================================================================== */
export default function App() {
  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [step, setStep] = useState('home'); 
  
  const [user, setUser] = useState({ name: '' });
  const [cart, setCart] = useState({
    service: null,
    date: null,
    time: null,
    addressDetails: { street: '', number: '', comp: '' }, // SP Address
    extras: [], 
    payment: 'pix',
    coupon: null 
  });

  // --- LIFECYCLE ---
  useEffect(() => {
    // Simula carregamento pesado
    setTimeout(() => {
      setLoading(false);
      // Mostra popup após 1 segundo de carregado
      setTimeout(() => setShowPopup(true), 1000);
    }, 2500);
  }, []);

  // --- ACTIONS ---
  const handleNext = (next) => { 
    if (navigator.vibrate) navigator.vibrate(15);
    window.scrollTo(0,0);
    setStep(next); 
  };

  const applyCoupon = (code) => {
    const cp = CONFIG.COUPONS[code];
    if (cp) {
      setCart(c => ({...c, coupon: cp}));
      setShowPopup(false);
      return true;
    }
    return false;
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

  // --- CALCULADORA ---
  const totals = useMemo(() => {
    let subtotal = 0;
    if (cart.service) subtotal += cart.service.price;
    // SP Location Fee
    subtotal += 35; // Default fee
    
    // Extras
    cart.extras.forEach(id => {
      const item = DATA.extras.find(e => e.id === id);
      if(item) subtotal += item.price;
    });

    let discount = 0;
    if (cart.coupon) {
      if (cart.coupon.type === 'percent') {
        discount = subtotal * cart.coupon.discount;
      } else {
        discount = cart.coupon.discount;
      }
    }

    return { subtotal, discount, final: subtotal - discount };
  }, [cart]);

  // --- GERADOR DE WHATSAPP (AVANÇADO) ---
  const sendToWhatsapp = () => {
    const dateStr = cart.date ? `${cart.date.getDate()}/${cart.date.getMonth()+1}` : 'Hoje';
    
    const extrasText = cart.extras.length > 0 
      ? cart.extras.map(id => `✅ + ${DATA.extras.find(e=>e.id===id).label}`).join('\n') 
      : '⛔ Nenhum extra';

    const addressText = `${cart.addressDetails.street}, ${cart.addressDetails.number} ${cart.addressDetails.comp ? `(${cart.addressDetails.comp})` : ''} - SP`;

    const couponText = cart.coupon 
      ? `🎫 *CUPOM APLICADO:* ${cart.coupon.code} (- R$ ${totals.discount.toFixed(2)})`
      : '';

    const msg = 
`*NOVO AGENDAMENTO (APP BETA)* 📱
--------------------------------
👤 *Cliente:* ${user.name}
📍 *Local:* SP (Domicílio/Hotel)
📅 *Data:* ${dateStr} às ${cart.time}

💆 *SERVIÇO:*
${cart.service.title}

🏠 *ENDEREÇO:*
${addressText}

✨ *EXTRAS:*
${extrasText}

--------------------------------
💰 *RESUMO FINANCEIRO:*
Subtotal: R$ ${totals.subtotal.toFixed(2)}
${couponText ? couponText + '\n' : ''}
*TOTAL FINAL: R$ ${totals.final.toFixed(2)}*

💳 *Pagamento:* ${cart.payment === 'pix' ? 'PIX' : 'Dinheiro'}
--------------------------------
_Aguardando confirmação do terapeuta._`;

    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  if (loading) return <AdvancedLoader />;

  return (
    <div className="min-h-screen pb-10">
      <style>{styles}</style>
      
      {/* HEADER FIXO */}
      <div className="bg-black/90 backdrop-blur-md sticky top-0 z-40 border-b border-white/5">
        <BetaBanner />
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
             {step !== 'home' && step !== 'success' && (
                <button onClick={() => {
                  if(step==='checkout') setStep('config');
                  else if(step==='config') setStep('service');
                  else if(step==='service') setStep('identity');
                  else setStep('home');
                }} className="p-2 bg-[#1C1C1E] rounded-full"><ChevronLeft size={20}/></button>
             )}
             <div>
               <h1 className="font-bold text-sm tracking-wide">THALYSON VIP</h1>
               <p className="text-[10px] text-[#0A84FF] font-bold">ONLINE EM SÃO PAULO</p>
             </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 overflow-hidden">
             {/* Placeholder Avatar */}
             <div className="w-full h-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-xs">👨🏻</div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6">

        {/* --- STEP: HOME --- */}
        {step === 'home' && (
          <div className="animate-enter">
            <h1 className="text-3xl font-bold mb-2">Massagem &<br/>Relaxamento SP</h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Atendimento exclusivo para homens em São Paulo (Capital). 
              Discrição, técnica e relaxamento no conforto do seu local.
            </p>

            {/* CARD DESTAQUE */}
            <div className="glass-panel p-6 rounded-3xl mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20"><Crown size={80} /></div>
              <h3 className="text-xl font-bold mb-1">Experiência VIP</h3>
              <p className="text-sm text-gray-300 mb-4">Massagem + Finalização + Extras</p>
              <div className="flex gap-2">
                 <span className="text-[10px] bg-white/10 px-2 py-1 rounded">Higienizado</span>
                 <span className="text-[10px] bg-white/10 px-2 py-1 rounded">Sigiloso</span>
              </div>
            </div>

            <button onClick={() => handleNext('identity')} className="btn-primary">
              INICIAR AGENDAMENTO <ArrowRight size={18} />
            </button>

            <div className="mt-8 grid grid-cols-2 gap-4">
               <div className="bg-[#111] p-4 rounded-2xl text-center">
                 <ShieldCheck size={24} className="mx-auto text-[#0A84FF] mb-2"/>
                 <p className="text-xs text-gray-500 font-bold">100% DISCRETO</p>
               </div>
               <div className="bg-[#111] p-4 rounded-2xl text-center">
                 <Star size={24} className="mx-auto text-[#FFD60A] mb-2"/>
                 <p className="text-xs text-gray-500 font-bold">5 ESTRELAS</p>
               </div>
            </div>
          </div>
        )}

        {/* --- STEP: IDENTIFICAÇÃO --- */}
        {step === 'identity' && (
          <div className="animate-enter">
            <h2 className="text-xl font-bold mb-6">Identificação</h2>
            <div className="glass-panel p-6 rounded-3xl">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block">Seu Nome</label>
              <input 
                value={user.name} 
                onChange={e => setUser({name: e.target.value})}
                placeholder="Como prefere ser chamado?" 
                className="custom-input mb-6"
                autoFocus
              />
              <div className="flex gap-3 items-start">
                 <Info size={16} className="text-[#0A84FF] flex-shrink-0 mt-1"/>
                 <p className="text-xs text-gray-400 leading-relaxed">
                   Seus dados ficam salvos apenas localmente. A negociação final ocorre no WhatsApp privado.
                 </p>
              </div>
            </div>
            <button disabled={!user.name} onClick={() => handleNext('service')} className="btn-primary mt-6">
              CONTINUAR
            </button>
          </div>
        )}

        {/* --- STEP: SERVIÇO --- */}
        {step === 'service' && (
          <div className="animate-enter pb-24">
            <h2 className="text-xl font-bold mb-6">Menu de Serviços</h2>
            <div className="space-y-4">
              {DATA.services.map(s => (
                <button 
                  key={s.id}
                  onClick={() => { setCart(c => ({...c, service: s})); handleNext('config'); }}
                  className={`w-full text-left glass-panel p-6 rounded-3xl relative border transition-all ${cart.service?.id === s.id ? 'border-[#0A84FF] bg-[#0A84FF]/10' : 'border-white/5'}`}
                >
                  {s.tag && <span className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">{s.tag}</span>}
                  <h3 className="text-lg font-bold mb-1">{s.title}</h3>
                  <p className="text-[#0A84FF] font-bold mb-3">R$ {s.price},00</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- STEP: CONFIGURAÇÃO --- */}
        {step === 'config' && (
          <div className="animate-enter space-y-8 pb-32">
            
            {/* DATA */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Data e Horário</h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[0,1,2,3,4].map(d => {
                  const date = new Date(); date.setDate(date.getDate() + d);
                  const isSel = cart.date?.getDate() === date.getDate();
                  return (
                    <button key={d} onClick={() => setCart(c => ({...c, date}))} 
                      className={`min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF]' : 'bg-[#151517] border-[#333]'}`}>
                      <span className="text-[10px] uppercase font-bold text-gray-400">{date.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3)}</span>
                      <span className="text-lg font-bold text-white">{date.getDate()}</span>
                    </button>
                  )
                })}
              </div>
              {cart.date && (
                <div className="grid grid-cols-4 gap-2 mt-3 animate-enter">
                   {['10:00','11:00','13:00','15:00','17:00','19:00','20:00','21:00'].map(t => (
                     <button key={t} onClick={() => setCart(c => ({...c, time: t}))} className={`py-2 rounded-lg text-xs font-bold border ${cart.time === t ? 'bg-white text-black border-white' : 'bg-[#151517] text-gray-400 border-[#333]'}`}>{t}</button>
                   ))}
                </div>
              )}
            </section>

            {/* LOCAL SP */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Local (São Paulo)</h3>
              <div className="glass-panel p-5 rounded-3xl border-l-4 border-l-[#0A84FF]">
                 <div className="flex items-center gap-3 mb-4">
                   <MapPin className="text-[#0A84FF]" />
                   <div>
                     <p className="font-bold text-sm">Domicílio / Hotel</p>
                     <p className="text-xs text-gray-500">Taxa fixa (Uber): R$ 35,00</p>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <input placeholder="Rua / Avenida" className="custom-input" onChange={e => setCart(c => ({...c, addressDetails: {...c.addressDetails, street: e.target.value}}))} />
                   <div className="flex gap-3">
                     <input placeholder="Número" type="tel" className="custom-input w-1/3" onChange={e => setCart(c => ({...c, addressDetails: {...c.addressDetails, number: e.target.value}}))} />
                     <input placeholder="Compl. (Apt/Bloco)" className="custom-input flex-1" onChange={e => setCart(c => ({...c, addressDetails: {...c.addressDetails, comp: e.target.value}}))} />
                   </div>
                 </div>
              </div>
            </section>

            {/* EXTRAS */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Turbinar Sessão</h3>
              <div className="space-y-3">
                {DATA.extras.map(e => {
                  const active = cart.extras.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => toggleExtra(e.id)} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${active ? 'bg-[#0A84FF]/20 border-[#0A84FF] shadow-[0_0_15px_rgba(10,132,255,0.2)]' : 'bg-[#151517] border-[#333]'}`}>
                       <div className="flex items-center gap-3">
                         <div className={`text-${active ? 'white' : 'gray-500'}`}>{e.icon}</div>
                         <div className="text-left">
                           <p className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-300'}`}>{e.label}</p>
                           <p className="text-xs text-gray-500">{e.sub}</p>
                         </div>
                       </div>
                       <span className={`text-sm font-bold ${active ? 'text-[#0A84FF]' : 'text-gray-500'}`}>+ R$ {e.price}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* TOTAL BAR */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] border-t border-white/10 p-5 z-30">
               <div className="max-w-md mx-auto flex justify-between items-center gap-4">
                 <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Total Estimado</p>
                   <p className="text-2xl font-bold text-white">R$ {totals.final}</p>
                 </div>
                 <button disabled={!cart.date || !cart.time || !cart.addressDetails.street} onClick={() => handleNext('checkout')} className="btn-primary w-auto px-8 py-3 rounded-xl text-sm">
                   FINALIZAR <ArrowRight size={18}/>
                 </button>
               </div>
            </div>

          </div>
        )}

        {/* --- STEP: CHECKOUT --- */}
        {step === 'checkout' && (
          <div className="animate-enter pb-24">
            <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>

            {/* RECIBO VISUAL */}
            <div className="bg-white text-black p-6 rounded-2xl shadow-2xl relative overflow-hidden mb-8">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#0A84FF]"></div>
               <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                  <h3 className="font-bold text-lg tracking-tight">THALYSON VIP</h3>
                  <span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded">PENDENTE</span>
               </div>
               
               <div className="space-y-2 text-sm mb-6">
                 <div className="flex justify-between font-bold"><span>{cart.service.title}</span><span>R$ {cart.service.price}</span></div>
                 <div className="flex justify-between text-gray-600"><span>Taxa Local (SP)</span><span>R$ 35</span></div>
                 {cart.extras.map(id => {
                   const item = DATA.extras.find(e => e.id === id);
                   return <div key={id} className="flex justify-between text-blue-600 font-medium"><span>+ {item.label}</span><span>R$ {item.price}</span></div>
                 })}
                 {cart.coupon && (
                   <div className="flex justify-between text-green-600 font-bold border-t border-dashed border-gray-300 pt-2 mt-2">
                     <span>Cupom: {cart.coupon.code}</span>
                     <span>- R$ {totals.discount.toFixed(2)}</span>
                   </div>
                 )}
               </div>

               <div className="flex justify-between items-end border-t border-gray-800 pt-4">
                 <span className="font-bold text-xl">TOTAL</span>
                 <span className="font-bold text-2xl">R$ {totals.final.toFixed(0)}</span>
               </div>
            </div>

            {/* CUPOM MANUAL */}
            {!cart.coupon && (
              <div className="mb-8">
                 <p className="text-xs font-bold text-gray-500 uppercase mb-2">Possui outro cupom?</p>
                 <div className="flex gap-2">
                   <input id="manualCoupon" placeholder="DIGITE O CÓDIGO" className="custom-input py-3 uppercase" />
                   <button onClick={() => {
                     const val = document.getElementById('manualCoupon').value.toUpperCase();
                     if(!applyCoupon(val)) alert('Cupom inválido');
                   }} className="bg-[#333] px-6 rounded-xl font-bold text-sm">APLICAR</button>
                 </div>
              </div>
            )}

            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Pagamento</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
               <button onClick={() => setCart(c => ({...c, payment:'pix'}))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${cart.payment === 'pix' ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333] text-gray-500'}`}>
                 <QrCode/> <span className="font-bold text-sm">PIX</span>
               </button>
               <button onClick={() => setCart(c => ({...c, payment:'dinheiro'}))} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${cart.payment === 'dinheiro' ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333] text-gray-500'}`}>
                 <Banknote/> <span className="font-bold text-sm">Dinheiro</span>
               </button>
            </div>

            <button onClick={sendToWhatsapp} className="btn-primary bg-[#25D366] hover:bg-[#20bd5a] shadow-[0_8px_30px_rgba(37,211,102,0.3)]">
              CONFIRMAR NO WHATSAPP <Send size={20}/>
            </button>
            <p className="text-center text-xs text-gray-600 mt-4">Ao confirmar, você concorda com a política de sigilo.</p>
          </div>
        )}

        {/* --- STEP: SUCCESS --- */}
        {step === 'success' && (
          <div className="animate-enter flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/40">
              <Check size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Pedido Enviado!</h2>
            <p className="text-gray-400 mb-8 max-w-[250px]">
              Verifique seu WhatsApp. O terapeuta irá confirmar a disponibilidade e o endereço.
            </p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl border border-[#333] text-gray-400 text-sm">
              Voltar ao Início
            </button>
          </div>
        )}

      </div>

      {/* POPUP DE CUPOM */}
      {showPopup && <CouponPopup onClose={() => setShowPopup(false)} onApply={() => applyCoupon('BEMVINDO')} />}
    </div>
  );
}
