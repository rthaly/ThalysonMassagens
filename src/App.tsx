import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, Check, Star, MapPin, Clock,
  ShieldCheck, Crown, CreditCard, Send, X, Gift, 
  Info, ThumbsUp, Map, User, Zap
} from 'lucide-react';

/* ==================================================================================
   1. ESTILOS CSS (DARK LUXURY - SP)
   ================================================================================== */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  :root {
    --primary: #0A84FF;
    --bg-body: #050505;
    --card-bg: #141414;
  }

  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  
  body, html { 
    margin: 0; padding: 0; 
    background-color: var(--bg-body); 
    color: #F5F5F7; 
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }

  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  
  /* ANIMAÇÕES */
  .fade-in { animation: fadeIn 0.5s ease-out forwards; }
  .slide-up { animation: slideUp 0.4s ease-out forwards; }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes loadBar { 0% { width: 0%; } 100% { width: 100%; } }

  /* COMPONENTES */
  .glass-card {
    background: rgba(30, 30, 30, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .custom-input {
    background: #1C1C1E;
    border: 1px solid #333;
    color: white;
    font-size: 16px;
    border-radius: 12px;
    width: 100%;
    padding: 16px;
    outline: none;
    transition: 0.2s;
  }
  .custom-input:focus { border-color: var(--primary); background: #222; }

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
  .btn-main:disabled { background: #333; color: #666; box-shadow: none; cursor: not-allowed; }

  /* LOADER */
  .loader-wrapper {
    position: fixed; inset: 0; z-index: 9999;
    background: #000;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    transition: opacity 0.5s ease;
  }
  .loader-bar { width: 200px; height: 4px; background: #222; border-radius: 4px; margin-top: 20px; overflow: hidden; }
  .loader-fill { height: 100%; background: var(--primary); animation: loadBar 2s ease-in-out forwards; }
`;

/* ==================================================================================
   2. DADOS E REGRAS
   ================================================================================== */
const CONFIG = {
  WHATSAPP: "5517991360413", 
  COUPON_VAL: 0.10 // 10%
};

const DATA = {
  services: [
    { 
      id: 'masc_sp', 
      title: 'Protocolo Masculino SP', 
      price: 200, 
      desc: 'Experiência completa. Relaxamento + Técnica Tântrica + Finalização Manual.',
      tag: 'MAIS PEDIDO 🏆'
    },
    { 
      id: 'relax_sp', 
      title: 'Massagem Relaxante', 
      price: 150, 
      desc: 'Foco em dores musculares e stress. Sem toques íntimos.',
      tag: null
    }
  ],
  // SEM MACA
  extras: [
    { id: 'touch', label: 'Interação (Tocar)', price: 55, sub: 'Permitido tocar o massagista' },
    { id: 'upgrade', label: '+30 Minutos', price: 80, sub: 'Sessão estendida' },
    { id: 'aroma', label: 'Aromaterapia', price: 20, sub: 'Óleos essenciais' }
  ],
  reviews: [
    { txt: "Atendimento no hotel foi impecável.", author: "Ricardo", stars: 5 },
    { txt: "A interação vale cada centavo.", author: "Anônimo", stars: 5 },
    { txt: "Resolveu minha dor nas costas.", author: "Carlos", stars: 5 }
  ]
};

/* ==================================================================================
   3. APP PRINCIPAL
   ================================================================================== */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState('home');
  const [showCoupon, setShowCoupon] = useState(false);
  
  const [user, setUser] = useState('');
  const [cart, setCart] = useState({
    service: null,
    date: null,
    time: null,
    locationType: null, // 'metro' | 'uber'
    address: '',
    extras: [],
    payment: 'pix',
    couponApplied: false
  });

  // Inicialização (Simples e Segura)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      try {
        const used = localStorage.getItem('thaly_coupon_used');
        if (!used) setTimeout(() => setShowCoupon(true), 1000);
        
        const savedUser = localStorage.getItem('thaly_user');
        if (savedUser) setUser(savedUser);
      } catch (e) {
        console.log("Storage access error");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Navegação
  const handleNext = (next) => {
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

  // Cálculos
  const totals = useMemo(() => {
    let sub = 0;
    if (cart.service) sub += cart.service.price;
    
    cart.extras.forEach(eid => {
      const item = DATA.extras.find(e => e.id === eid);
      if (item) sub += item.price;
    });

    let discount = 0;
    if (cart.couponApplied) discount = sub * CONFIG.COUPON_VAL;

    return { sub, discount, final: sub - discount };
  }, [cart]);

  // Enviar WhatsApp
  const sendWhatsApp = () => {
    try {
      localStorage.setItem('thaly_user', user);
      if (cart.couponApplied) localStorage.setItem('thaly_coupon_used', 'true');
    } catch(e) {}

    const dateStr = cart.date ? `${cart.date.getDate()}/${cart.date.getMonth()+1}` : '';
    
    const extrasTxt = cart.extras.length 
      ? cart.extras.map(id => `✅ ${DATA.extras.find(e=>e.id===id).label}`).join('\n') 
      : 'Nenhum extra';

    const locTxt = cart.locationType === 'metro' 
      ? `📍 *Perto do Metrô (<1km)*\nEndereço: ${cart.address}\n(Taxa: GRÁTIS)`
      : `🚗 *Longe do Metrô (>1km)*\nEndereço: ${cart.address}\n(Taxa: A CALCULAR)`;

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

  return (
    <div className="min-h-screen pb-10">
      <style>{styles}</style>
      
      {/* LOADER */}
      <div className={`loader-wrapper ${!loading ? 'pointer-events-none opacity-0' : ''}`}>
        <Crown size={64} className="text-[#0A84FF] animate-pulse" />
        <h1 className="text-white font-bold text-xl mt-4">THALYSON VIP</h1>
        <div className="loader-bar"><div className="loader-fill"></div></div>
      </div>

      {/* HEADER FIXO */}
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="bg-yellow-500/10 py-1 text-center border-b border-yellow-500/10">
          <p className="text-[10px] font-bold text-yellow-500 uppercase">APP BETA • SP CAPITAL</p>
        </div>
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
               <h1 className="font-bold text-sm text-white">THALYSON VIP</h1>
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 <span className="text-[10px] text-gray-400">Online</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 pt-6 pb-24">

        {/* === HOME === */}
        {step === 'home' && (
          <div className="fade-in">
            <h1 className="text-3xl font-bold mb-3 text-white">Massagem &<br/>Relaxamento SP</h1>
            <p className="text-gray-400 text-sm mb-8">
              Atendimento exclusivo masculino em São Paulo. 
              Técnica apurada, discrição e conforto.
            </p>

            <div className="glass-card p-6 rounded-3xl mb-8 relative overflow-hidden">
              <h3 className="text-xl font-bold mb-1 text-white relative z-10">Experiência VIP</h3>
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
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Avaliações</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {DATA.reviews.map((r, i) => (
                <div key={i} className="min-w-[260px] bg-[#111] p-5 rounded-2xl border border-white/5">
                  <div className="flex text-yellow-500 mb-2 gap-1">
                    {[...Array(r.stars)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}
                  </div>
                  <p className="text-sm text-gray-300 italic mb-3">"{r.txt}"</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{r.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === IDENTITY === */}
        {step === 'identity' && (
          <div className="slide-up">
            <h2 className="text-2xl font-bold mb-2 text-white">Identificação</h2>
            <p className="text-gray-400 text-sm mb-8">Como prefere ser chamado?</p>
            
            <input 
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Nome / Apelido"
              className="custom-input mb-6"
            />

            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3 items-start mb-6">
               <ShieldCheck size={20} className="text-[#0A84FF] flex-shrink-0"/>
               <p className="text-xs text-blue-200/80">
                 Seus dados não ficam online. Tudo é tratado diretamente no WhatsApp.
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
            <h2 className="text-2xl font-bold mb-6 text-white">Menu</h2>
            <div className="space-y-4">
              {DATA.services.map(s => (
                <div 
                  key={s.id}
                  onClick={() => { setCart({...cart, service: s}); handleNext('config'); }}
                  className={`glass-card p-6 rounded-3xl relative cursor-pointer ${cart.service?.id === s.id ? 'border-[#0A84FF] bg-[#0A84FF]/10' : ''}`}
                >
                  {s.tag && <span className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">{s.tag}</span>}
                  <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-[#0A84FF] font-bold text-lg mb-2">R$ {s.price}</p>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === CONFIG === */}
        {step === 'config' && (
          <div className="slide-up space-y-8 pb-32">
            
            {/* DATA */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Data e Horário</h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[0,1,2,3,4].map(d => {
                  const date = new Date(); date.setDate(date.getDate() + d);
                  const isSel = cart.date?.getDate() === date.getDate();
                  return (
                    <button key={d} onClick={() => setCart({...cart, date})} 
                      className={`min-w-[64px] h-[72px] rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                      <span className="text-[10px] uppercase font-bold text-gray-400">{date.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3)}</span>
                      <span className="text-lg font-bold text-white">{date.getDate()}</span>
                    </button>
                  )
                })}
              </div>
              {cart.date && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                   {['11:00','13:00','15:00','17:00','19:00','20:00','21:00'].map(t => (
                     <button key={t} onClick={() => setCart({...cart, time: t})} className={`py-2 rounded-lg text-xs font-bold border ${cart.time === t ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-[#333]'}`}>{t}</button>
                   ))}
                </div>
              )}
            </section>

            {/* LOCALIZAÇÃO */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Localização (SP)</h3>
              <div className="glass-card p-5 rounded-3xl">
                <div className="flex gap-3 mb-4">
                  <button onClick={() => setCart({...cart, locationType: 'metro'})} className={`flex-1 p-3 rounded-xl border text-center transition-all ${cart.locationType === 'metro' ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-white' : 'bg-[#111] border-[#333] text-gray-400'}`}>
                    <Map size={20} className="mx-auto mb-1"/>
                    <p className="text-xs font-bold">Perto Metrô</p>
                    <p className="text-[10px] text-green-500">&lt; 1km (Free)</p>
                  </button>
                  <button onClick={() => setCart({...cart, locationType: 'uber'})} className={`flex-1 p-3 rounded-xl border text-center transition-all ${cart.locationType === 'uber' ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-white' : 'bg-[#111] border-[#333] text-gray-400'}`}>
                    <MapPin size={20} className="mx-auto mb-1"/>
                    <p className="text-xs font-bold">Longe Metrô</p>
                    <p className="text-[10px] text-yellow-500">Uber (Combinar)</p>
                  </button>
                </div>
                
                {cart.locationType && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 ml-1 mb-2 block">Endereço</label>
                    <input 
                      placeholder="Rua, Número, Bairro..." 
                      className="custom-input"
                      onChange={e => setCart({...cart, address: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* EXTRAS */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Adicionais</h3>
              <div className="space-y-3">
                {DATA.extras.map(e => {
                  const active = cart.extras.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => toggleExtra(e.id)} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${active ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                       <div className="flex items-center gap-3">
                         {e.id === 'touch' && <Hand className={active ? 'text-white' : 'text-gray-500'} size={20}/>}
                         {e.id === 'upgrade' && <Clock className={active ? 'text-white' : 'text-gray-500'} size={20}/>}
                         {e.id === 'aroma' && <Sparkles className={active ? 'text-white' : 'text-gray-500'} size={20}/>}
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

            <div className="fixed bottom-0 left-0 right-0 bg-[#151515] border-t border-white/10 p-5 z-50">
               <div className="max-w-md mx-auto flex justify-between items-center gap-4">
                 <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase">Total Estimado</p>
                   <p className="text-2xl font-bold text-white">R$ {totals.final}</p>
                 </div>
                 <button 
                    disabled={!cart.date || !cart.time || !cart.locationType || cart.address.length < 5} 
                    onClick={() => handleNext('checkout')} 
                    className="btn-main w-auto px-8"
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
            <h2 className="text-2xl font-bold mb-6 text-white">Confirmação</h2>

            <div className="bg-white text-black p-6 rounded-2xl shadow-2xl relative overflow-hidden mb-8">
               <div className="absolute top-0 left-0 w-full h-2 bg-[#0A84FF]"></div>
               <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                  <h3 className="font-bold text-lg">THALYSON VIP</h3>
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
               <button onClick={() => setCart({...cart, payment:'pix'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${cart.payment === 'pix' ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333] text-gray-500'}`}>
                 <QrCode/> <span className="font-bold text-sm">PIX</span>
               </button>
               <button onClick={() => setCart({...cart, payment:'dinheiro'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${cart.payment === 'dinheiro' ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333] text-gray-500'}`}>
                 <Banknote/> <span className="font-bold text-sm">Dinheiro</span>
               </button>
            </div>

            <button onClick={sendWhatsApp} className="btn-main bg-[#25D366]">
              ENVIAR PEDIDO <Send size={20}/>
            </button>
          </div>
        )}

        {/* === SUCCESS === */}
        {step === 'success' && (
          <div className="fade-in flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <ThumbsUp size={48} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2 text-white">Solicitação Enviada!</h2>
            <p className="text-gray-400 mb-8 max-w-[250px]">
              Sua pré-reserva está no meu WhatsApp. Responderei em instantes.
            </p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 rounded-xl border border-[#333] text-gray-400 text-sm">
              Voltar ao Início
            </button>
          </div>
        )}

      </div>

      {/* MODAL CUPOM */}
      {showCoupon && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 fade-in">
          <div className="bg-[#1C1C1E] w-full max-w-sm rounded-3xl p-8 text-center border border-white/10 relative">
            <button onClick={() => setShowCoupon(false)} className="absolute top-4 right-4 text-gray-500"><X size={20}/></button>
            <Gift size={48} className="text-[#0A84FF] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Boas-vindas VIP</h3>
            <p className="text-gray-400 text-sm mb-6">
              Como é sua primeira vez aqui, ganhe <strong>10% de Desconto</strong>.
            </p>
            <button onClick={applyCoupon} className="btn-main">RESGATAR 10% OFF</button>
          </div>
        </div>
      )}
    </div>
  );
}
