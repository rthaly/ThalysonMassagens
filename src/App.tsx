import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronLeft, Check, Star, MapPin, Calendar, Clock,
  ArrowRight, ShieldCheck, Zap, Hand, Bed, Crown,
  CreditCard, Banknote, QrCode, Send, Sparkles, AlertCircle
} from 'lucide-react';

/* ==================================================================================
   1. ESTILOS CSS INJETADOS (Para funcionar sem arquivos .css externos)
   ================================================================================== */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body, html { margin: 0; padding: 0; background-color: #000; color: #fff; font-family: 'Inter', -apple-system, sans-serif; }
  
  /* Utilitários de Scroll */
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* Animações */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-enter { animation: fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
  
  /* Efeitos de Vidro (Glassmorphism Premium) */
  .glass-panel {
    background: rgba(28, 28, 30, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  /* Inputs Customizados */
  .custom-input {
    background: #1C1C1E;
    border: 1px solid #333;
    color: white;
    font-size: 16px;
    border-radius: 12px;
    width: 100%;
    padding: 16px;
    transition: 0.2s;
  }
  .custom-input:focus { border-color: #0A84FF; outline: none; }

  /* Botão Principal */
  .btn-primary {
    background: #0A84FF;
    color: white;
    font-weight: 700;
    border-radius: 16px;
    padding: 18px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 24px rgba(10, 132, 255, 0.25);
    border: none;
    cursor: pointer;
    transition: transform 0.1s;
  }
  .btn-primary:active { transform: scale(0.98); opacity: 0.9; }
  .btn-primary:disabled { background: #333; color: #666; box-shadow: none; }

  /* Cards Selecionáveis */
  .selection-card {
    transition: all 0.2s ease;
    border: 1px solid rgba(255,255,255,0.05);
  }
  .selection-card.selected {
    background: rgba(10, 132, 255, 0.1);
    border-color: #0A84FF;
    box-shadow: 0 0 0 1px #0A84FF;
  }
`;

/* ==================================================================================
   2. DADOS E CONFIGURAÇÃO
   ================================================================================== */
const DATA = {
  services: [
    { 
      id: 'masculina', 
      title: 'Massagem Masculina', 
      price: 155, 
      desc: 'Relaxante + Tântrica. Finalização manual inclusa. A experiência completa.',
      tag: 'MAIS PEDIDA 🔥'
    },
    { 
      id: 'relaxante', 
      title: 'Massagem Relaxante', 
      price: 125, 
      desc: 'Foco em dores musculares e stress. Corpo todo. Sem toques íntimos.',
      tag: null
    }
  ],
  extras: [
    { id: 'upgrade', label: '+30 Minutos', price: 77, sub: 'Estenda seu relaxamento' },
    { id: 'touch', label: 'Tocar o Massagista', price: 55, sub: 'Interação corporal permitida' }, // ITEM SOLICITADO
    { id: 'table', label: 'Levar Maca', price: 20, sub: 'Experiência profissional' },
    { id: 'aroma', label: 'Aromaterapia', price: 10, sub: 'Óleos essenciais' }
  ],
  locations: [
    { id: 'motel', label: 'Suíte / Motel', fee: 75, icon: <Bed size={20}/>, details: 'Vou até você' },
    { id: 'home', label: 'Domicílio (Santa Fé)', fee: 23, icon: <MapPin size={20}/>, details: 'No seu conforto' },
    { id: 'other', label: 'Outra Cidade', fee: 0, icon: <MapPin size={20}/>, details: 'Combinar taxa' }
  ],
  reviews: [
    { t: "Sou casado, sigilo foi total. Gostei muito.", a: "Anônimo", s: 5 },
    { t: "O extra de tocar nele vale cada centavo.", a: "Empresário", s: 5 },
    { t: "Tira todo o stress. Mãos firmes.", a: "Ricardo", s: 5 }
  ]
};

/* ==================================================================================
   3. COMPONENTES INTERNOS
   ================================================================================== */
const Header = ({ step, onBack }) => (
  <div className="flex items-center justify-between p-6 pt-8 bg-black sticky top-0 z-50 border-b border-white/5">
    <div className="flex items-center gap-4">
      {step !== 'home' && step !== 'success' && (
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center text-[#0A84FF]">
          <ChevronLeft />
        </button>
      )}
      <span className="font-bold text-lg tracking-tight">Thalyson VIP</span>
    </div>
    <div className="px-3 py-1 rounded-full bg-green-900/30 border border-green-500/30 flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-[10px] font-bold text-green-400 uppercase">Online Agora</span>
    </div>
  </div>
);

const StepTitle = ({ title, sub }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
    <p className="text-gray-400 text-sm">{sub}</p>
  </div>
);

/* ==================================================================================
   4. APP PRINCIPAL
   ================================================================================== */
export default function App() {
  // --- STATES ---
  const [step, setStep] = useState('home'); // home, identity, service, config, checkout, success
  const [user, setUser] = useState({ name: '' });
  const [cart, setCart] = useState({
    service: null,
    date: null,
    time: null,
    location: null,
    address: '',
    city: '',
    selectedExtras: [], // Array de IDs
    payment: 'pix'
  });

  // --- CALCS ---
  const total = useMemo(() => {
    let t = 0;
    if (cart.service) t += cart.service.price;
    if (cart.location) t += cart.location.fee;
    cart.selectedExtras.forEach(exId => {
      const item = DATA.extras.find(e => e.id === exId);
      if (item) t += item.price;
    });
    return t;
  }, [cart]);

  // --- ACTIONS ---
  const handleNext = (next) => { 
    if (navigator.vibrate) navigator.vibrate(10); // Haptic
    window.scrollTo(0,0);
    setStep(next); 
  };

  const toggleExtra = (id) => {
    setCart(prev => {
      const exists = prev.selectedExtras.includes(id);
      return {
        ...prev,
        selectedExtras: exists 
          ? prev.selectedExtras.filter(x => x !== id) 
          : [...prev.selectedExtras, id]
      };
    });
  };

  const sendWhatsapp = () => {
    const { service, date, time, location, address, city, selectedExtras, payment } = cart;
    const dateStr = date ? `${date.getDate()}/${date.getMonth()+1}` : '';
    
    // Lista de extras
    const extrasNames = selectedExtras.map(id => {
      const item = DATA.extras.find(e => e.id === id);
      return `+ ${item.label}`;
    }).join('\n');

    let locationText = location.label;
    if (location.id === 'home') locationText += `\n📍 Endereço: ${address}`;
    if (location.id === 'other') locationText += `\n📍 Cidade: ${city}`;

    const msg = `
*NOVO AGENDAMENTO VIP*
👤 *Cliente:* ${user.name}

🗓 *Data:* ${dateStr} às ${time}
💆 *Serviço:* ${service.title}
📍 *Local:* ${locationText}

✨ *Extras:*
${extrasNames || 'Nenhum extra'}

💰 *Total:* R$ ${total},00
💳 *Pagamento:* ${payment.toUpperCase()}

_Aguardo confirmação._
    `.trim();

    window.open(`https://wa.me/5517991360413?text=${encodeURIComponent(msg)}`, '_blank');
    setStep('success');
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-black pb-10 font-sans text-white">
      <style>{styles}</style>

      <Header step={step} onBack={() => {
        if(step === 'checkout') setStep('config');
        if(step === 'config') setStep('service');
        if(step === 'service') setStep('identity');
        if(step === 'identity') setStep('home');
      }}/>

      <div className="max-w-md mx-auto w-full px-6 pt-4">

        {/* ================= HOME ================= */}
        {step === 'home' && (
          <div className="animate-enter pt-4">
            <div className="mb-8 text-center">
              <span className="text-[#0A84FF] text-xs font-bold tracking-widest uppercase mb-2 block">Exclusivo para Homens</span>
              <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">Relaxe.<br/>Renove-se.<br/>Sinta.</h1>
              <p className="text-gray-400 text-lg">Massoterapia profissional com foco no bem-estar masculino e sigilo absoluto.</p>
            </div>

            <div className="space-y-4 mb-8">
              {DATA.reviews.map((r, i) => (
                <div key={i} className="glass-panel p-4 rounded-2xl flex gap-3">
                  <div className="text-yellow-500"><Star size={16} fill="currentColor"/></div>
                  <div>
                    <p className="text-sm text-gray-200 italic">"{r.t}"</p>
                    <p className="text-xs text-gray-500 font-bold mt-1 uppercase">- {r.a}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => handleNext('identity')} className="btn-primary">
              AGENDAR AGORA <ArrowRight size={20}/>
            </button>
            <p className="text-center text-xs text-gray-600 mt-4">Atendimento em Santa Fé do Sul e Região</p>
          </div>
        )}

        {/* ================= IDENTITY ================= */}
        {step === 'identity' && (
          <div className="animate-enter">
            <StepTitle title="Identificação" sub="Como prefere ser chamado?" />
            
            <div className="glass-panel p-6 rounded-2xl mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Seu Nome / Apelido</label>
              <input 
                className="custom-input text-xl font-semibold"
                placeholder="Digite aqui..."
                value={user.name}
                onChange={e => setUser({name: e.target.value})}
                autoFocus
              />
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-900/20 border border-blue-500/20 mb-8">
              <ShieldCheck className="text-blue-500" size={32} />
              <p className="text-xs text-blue-200 leading-relaxed">
                <span className="font-bold">Sigilo Total:</span> Seus dados não são armazenados em banco de dados. Tudo é tratado diretamente no WhatsApp.
              </p>
            </div>

            <button disabled={!user.name.trim()} onClick={() => handleNext('service')} className="btn-primary">
              CONTINUAR
            </button>
          </div>
        )}

        {/* ================= SERVICE ================= */}
        {step === 'service' && (
          <div className="animate-enter">
            <StepTitle title="Menu de Serviços" sub="Escolha sua experiência" />
            
            <div className="space-y-4 pb-24">
              {DATA.services.map(s => (
                <div 
                  key={s.id}
                  onClick={() => { setCart({...cart, service: s}); handleNext('config'); }}
                  className={`glass-panel p-6 rounded-2xl relative selection-card cursor-pointer ${cart.service?.id === s.id ? 'selected' : ''}`}
                >
                  {s.tag && (
                    <span className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                      {s.tag}
                    </span>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{s.title}</h3>
                    <span className="text-[#0A84FF] text-xl font-bold">R$ {s.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CONFIG (Date, Loc, Extras) ================= */}
        {step === 'config' && (
          <div className="animate-enter space-y-8 pb-32">
            
            {/* DATA */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Data e Hora</h3>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {[0,1,2,3,4,5].map(d => {
                  const date = new Date();
                  date.setDate(date.getDate() + d);
                  const isSel = cart.date?.getDate() === date.getDate();
                  return (
                    <button key={d} onClick={() => setCart({...cart, date})} 
                      className={`min-w-[70px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                      <span className="text-[10px] font-bold uppercase">{date.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3)}</span>
                      <span className="text-xl font-bold">{date.getDate()}</span>
                    </button>
                  )
                })}
              </div>
              {cart.date && (
                <div className="grid grid-cols-4 gap-2 mt-4 animate-enter">
                  {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                    <button key={t} onClick={() => setCart({...cart, time: t})} className={`py-2 rounded-lg text-sm font-bold border ${cart.time === t ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-[#333]'}`}>{t}</button>
                  ))}
                </div>
              )}
            </section>

            {/* LOCAL */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Local de Atendimento</h3>
              <div className="space-y-3">
                {DATA.locations.map(l => (
                  <div key={l.id}>
                    <button onClick={() => setCart({...cart, location: l})} className={`w-full p-4 rounded-xl border flex items-center justify-between text-left transition-all ${cart.location?.id === l.id ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`text-${cart.location?.id === l.id ? 'white' : 'gray-500'}`}>{l.icon}</div>
                        <div>
                          <p className="font-bold text-white text-sm">{l.label}</p>
                          <p className="text-xs text-gray-500">{l.details}</p>
                        </div>
                      </div>
                      {l.fee > 0 && <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">+ R$ {l.fee}</span>}
                    </button>
                    {/* INPUTS CONDICIONAIS */}
                    {cart.location?.id === l.id && l.id === 'home' && (
                      <input placeholder="Endereço Completo" className="custom-input mt-2 animate-enter" onChange={e => setCart({...cart, address: e.target.value})} />
                    )}
                    {cart.location?.id === l.id && l.id === 'other' && (
                      <input placeholder="Nome da Cidade" className="custom-input mt-2 animate-enter" onChange={e => setCart({...cart, city: e.target.value})} />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* EXTRAS */}
            <section>
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Personalize (Extras)</h3>
              <div className="space-y-3">
                {DATA.extras.map(e => {
                  const isSelected = cart.selectedExtras.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => toggleExtra(e.id)} 
                      className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${isSelected ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                      <div className="flex items-center gap-3 text-left">
                        {e.id === 'touch' ? <Hand size={20} className={isSelected ? 'text-[#FF375F]' : 'text-gray-500'} /> : 
                         e.id === 'upgrade' ? <Clock size={20} className={isSelected ? 'text-[#0A84FF]' : 'text-gray-500'} /> :
                         <Sparkles size={20} className={isSelected ? 'text-yellow-500' : 'text-gray-500'} />}
                        
                        <div>
                          <p className={`font-bold text-sm ${e.id === 'touch' ? 'text-[#FF375F]' : 'text-white'}`}>{e.label}</p>
                          <p className="text-xs text-gray-500">{e.sub}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${e.id === 'touch' ? 'text-[#FF375F]' : 'text-[#0A84FF]'}`}>+ R$ {e.price}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Botão Flutuante Next */}
            <div className="fixed bottom-0 left-0 right-0 p-5 bg-black border-t border-white/10 z-40">
              <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-500 uppercase font-bold">Total Estimado</span>
                   <span className="text-2xl font-bold text-white">R$ {total}</span>
                 </div>
                 <button 
                   disabled={!cart.date || !cart.time || !cart.location} 
                   onClick={() => handleNext('checkout')} 
                   className="btn-primary w-auto px-8"
                 >
                   Revisar <ArrowRight size={20}/>
                 </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= CHECKOUT ================= */}
        {step === 'checkout' && (
          <div className="animate-enter pb-24">
            <StepTitle title="Resumo do Pedido" sub="Confira antes de enviar" />

            {/* Recibo Visual */}
            <div className="bg-white text-black rounded-xl p-6 mb-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-blue-300"></div>
               
               <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                 <h3 className="font-bold text-lg">THALYSON VIP</h3>
                 <span className="text-xs bg-black text-white px-2 py-1 rounded">PENDENTE</span>
               </div>

               <div className="space-y-3 text-sm mb-6">
                 <div className="flex justify-between font-bold">
                    <span>{cart.service.title}</span>
                    <span>R$ {cart.service.price}</span>
                 </div>
                 {cart.location.fee > 0 && (
                   <div className="flex justify-between text-gray-600">
                      <span>Taxa: {cart.location.label}</span>
                      <span>+ R$ {cart.location.fee}</span>
                   </div>
                 )}
                 {cart.selectedExtras.map(id => {
                   const item = DATA.extras.find(e => e.id === id);
                   return (
                     <div key={id} className="flex justify-between text-blue-600 font-medium">
                        <span>+ {item.label}</span>
                        <span>+ R$ {item.price}</span>
                     </div>
                   )
                 })}
               </div>

               <div className="border-t border-gray-300 pt-4 flex justify-between items-end">
                 <span className="font-bold text-xl">TOTAL FINAL</span>
                 <span className="font-bold text-2xl">R$ {total}</span>
               </div>
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Forma de Pagamento</h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
               <button onClick={() => setCart({...cart, payment:'pix'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${cart.payment === 'pix' ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333] text-gray-400'}`}>
                 <QrCode size={24}/> <span className="font-bold text-sm">Pix (Preferencial)</span>
               </button>
               <button onClick={() => setCart({...cart, payment:'dinheiro'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${cart.payment === 'dinheiro' ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333] text-gray-400'}`}>
                 <Banknote size={24}/> <span className="font-bold text-sm">Dinheiro</span>
               </button>
            </div>

            <button onClick={sendWhatsapp} className="btn-primary" style={{backgroundColor: '#25D366'}}>
              CONFIRMAR NO WHATSAPP <Send size={20}/>
            </button>
          </div>
        )}

        {/* ================= SUCCESS ================= */}
        {step === 'success' && (
          <div className="animate-enter flex flex-col items-center justify-center pt-20 text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/30">
              <Check size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Solicitação Gerada!</h2>
            <p className="text-gray-400 mb-8 max-w-xs">
              Você será redirecionado para o WhatsApp para confirmar os detalhes. Se não abrir, clique abaixo.
            </p>
            <button onClick={sendWhatsapp} className="px-6 py-3 rounded-xl bg-[#1C1C1E] text-[#0A84FF] font-bold border border-[#333]">
              Abrir Conversa Novamente
            </button>
            <button onClick={() => window.location.reload()} className="mt-8 text-sm text-gray-500 underline">
              Voltar ao Início
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
