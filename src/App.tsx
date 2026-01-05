import { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, Calendar, MapPin, Clock, Check, Star, 
  Sparkles, ArrowRight, ShieldCheck, Flame, 
  Music, Phone, Zap, Info, CreditCard
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS & ANIMAÇÕES (CSS-IN-JS)
// ==================================================================================
const styles = `
  :root { --primary: #0A84FF; --bg: #000000; --card: #1C1C1E; --glass: rgba(28, 28, 30, 0.65); }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
  
  body { 
    background-color: var(--bg); color: #fff; 
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
    overscroll-behavior-y: none;
    margin: 0; padding: 0;
  }

  /* Fundo Animado Premium */
  .aurora-bg {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
    background: 
      radial-gradient(circle at 100% 0%, rgba(10, 132, 255, 0.15) 0%, transparent 40%),
      radial-gradient(circle at 0% 100%, rgba(50, 215, 75, 0.1) 0%, transparent 40%);
    background-color: #000;
  }

  /* Componentes UI */
  .glass-panel {
    background: var(--glass); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  
  .btn-primary {
    background: var(--primary); color: white; border: none; font-weight: 600;
    box-shadow: 0 4px 15px rgba(10, 132, 255, 0.4); transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .btn-primary:active { transform: scale(0.96); opacity: 0.9; }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
  
  /* Animações de Entrada */
  .fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  
  @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
  
  .pulse-border { animation: pulseBorder 2s infinite; }
  @keyframes pulseBorder { 0% { border-color: rgba(10,132,255,0.3); } 50% { border-color: rgba(10,132,255,0.8); } 100% { border-color: rgba(10,132,255,0.3); } }
`;

// ==================================================================================
// 2. DADOS DO NEGÓCIO
// ==================================================================================

const SERVICES = [
  { 
    id: 'masculina', title: 'Massagem Masculina', price: 150, duration: '60 min', 
    tag: 'MAIS VENDIDA 🔥',
    desc: 'Protocolo completo: Relaxamento muscular profundo + Finalização Tântrica.',
    features: ['Alívio de Stress', 'Toque Sensitivo', 'Finalização Manual']
  },
  { 
    id: 'relaxante', title: 'Relaxante Clássica', price: 120, duration: '50 min', 
    tag: 'TIRA DORES',
    desc: 'Foco total em remover tensão muscular, dores nas costas e pernas.',
    features: ['Corpo Todo', 'Óleos Essenciais', 'Música Zen']
  },
  { 
    id: 'premium', title: 'Experiência Premium', price: 200, duration: '90 min', 
    tag: 'VIP 💎',
    desc: 'A fusão perfeita: Mais tempo, mais técnica e imersão total.',
    features: ['90 Minutos', 'Tântrica + Relax', 'Bebida Inclusa']
  }
];

const ADDONS = [
  { id: 'aroma', name: 'Aromaterapia', price: 15, icon: '🌿' },
  { id: 'pedras', name: 'Pedras Quentes', price: 25, icon: '🔥' },
  { id: 'ducha', name: 'Banho Tomado', price: 0, icon: '🚿' } // Exemplo de 'free' addon
];

// ==================================================================================
// 3. HELPERS DE UX
// ==================================================================================
const haptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================
export default function UltraMassageApp() {
  const [view, setView] = useState('home'); // home, detail, book, success
  
  // Estado do Carrinho (Tudo que o user escolhe)
  const [selection, setSelection] = useState({
    service: null,
    addons: [],
    date: null,
    time: null,
    locationType: 'studio', // 'studio' ou 'delivery'
    address: '',
    couponApplied: false
  });

  // Estado de 'Intenção' (para salvar progresso se fechar)
  const [userIntent, setUserIntent] = useState({ visitedBefore: false });

  useEffect(() => {
    // Verifica se é cliente recorrente silenciosamente
    const history = localStorage.getItem('thaly_history');
    if (history) setUserIntent({ visitedBefore: true });
  }, []);

  const total = (selection.service?.price || 0) + 
                selection.addons.reduce((acc, curr) => acc + curr.price, 0) +
                (selection.locationType === 'delivery' ? 25 : 0) - // Taxa fixa Uber ex
                (selection.couponApplied ? 20 : 0);

  // --- COMPONENTES INTERNOS ---

  // 1. HEADER DINÂMICO
  const Header = ({ title, showBack }) => (
    <div className="flex items-center justify-between p-6 pt-12 sticky top-0 z-20 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3">
        {showBack && (
          <button onClick={() => { haptic(); setView('home'); }} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center active:scale-90 transition-transform">
            <ChevronLeft className="text-white w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold text-white tracking-tight shadow-black drop-shadow-lg">{title}</h1>
      </div>
      <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center pointer-events-auto">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
      </div>
    </div>
  );

  // 2. CUPOM INTELIGENTE (FLOAT)
  const SmartCoupon = () => {
    if (userIntent.visitedBefore || selection.couponApplied) return null;
    return (
      <div onClick={() => { haptic(); setSelection(p => ({...p, couponApplied: true})); }} className="mx-6 mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 flex items-center gap-4 cursor-pointer active:scale-98 transition-transform fade-in-up">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm text-white">Presente de Boas-vindas</h3>
          <p className="text-xs text-gray-400">Toque para ativar <span className="text-blue-400 font-bold">R$ 20 OFF</span> agora.</p>
        </div>
        <div className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white">ATIVAR</div>
      </div>
    );
  };

  // --- VIEWS ---

  if (view === 'home') return (
    <div className="min-h-screen pb-32">
      <style>{styles}</style>
      <div className="aurora-bg"></div>
      
      <Header title="Thalyson Massagens" showBack={false} />
      
      <div className="px-6 mb-6">
        <h2 className="text-3xl font-bold text-white leading-tight mb-2 fade-in-up">
          Relaxe.<br/>
          <span className="text-[#0A84FF]">Recupere.</span>
        </h2>
        <p className="text-gray-400 text-sm fade-in-up delay-100">Agendamento exclusivo em Santa Fé do Sul.</p>
      </div>

      <SmartCoupon />

      <div className="space-y-4 px-6 fade-in-up delay-200">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Menu de Tratamentos</h3>
        {SERVICES.map(service => (
          <div key={service.id} onClick={() => { haptic(); setSelection({...selection, service}); setView('book'); }}
            className="glass-panel p-5 rounded-3xl relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer border-l-4 border-l-transparent hover:border-l-[#0A84FF]">
            
            {service.tag && (
              <div className="absolute top-0 right-0 bg-[#0A84FF] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                {service.tag}
              </div>
            )}

            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-white">{service.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <Clock className="w-3 h-3 text-gray-500" />
                   <span className="text-xs text-gray-400">{service.duration}</span>
                </div>
              </div>
              <span className="text-lg font-bold text-[#0A84FF]">{formatBRL(service.price)}</span>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed mb-4 border-t border-white/5 pt-3 mt-3">
              {service.desc}
            </p>

            <div className="flex gap-2">
              {service.features.map((f, i) => (
                <span key={i} className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded-lg border border-white/5">{f}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Social Proof - Reviews Rápidas */}
      <div className="mt-8 px-6 fade-in-up delay-200">
        <div className="flex items-center gap-2 mb-4 opacity-70">
           <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
           <span className="text-xs font-bold text-white">4.9/5.0 <span className="text-gray-500 font-normal">(120+ Clientes)</span></span>
        </div>
      </div>
    </div>
  );

  if (view === 'book') return (
    <div className="min-h-screen flex flex-col">
      <style>{styles}</style>
      <div className="aurora-bg"></div>
      <Header title="Personalizar" showBack={true} />

      <div className="flex-1 overflow-y-auto px-6 pb-40 fade-in-up">
        
        {/* Card Resumo Topo */}
        <div className="mb-6 flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
           <div>
             <p className="text-xs text-gray-500 uppercase font-bold">Selecionado</p>
             <h3 className="text-white font-bold">{selection.service.title}</h3>
           </div>
           <div className="text-right">
             <p className="text-xs text-gray-500 uppercase font-bold">Valor Base</p>
             <h3 className="text-[#0A84FF] font-bold">{formatBRL(selection.service.price)}</h3>
           </div>
        </div>

        {/* 1. Escolha de Local (Fator de UX Crítico) */}
        <section className="mb-8">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin className="w-3 h-3"/> Local</h3>
           <div className="grid grid-cols-2 gap-3">
             <button onClick={() => { haptic(); setSelection({...selection, locationType: 'studio'}); }} 
               className={`p-4 rounded-2xl border text-left transition-all ${selection.locationType === 'studio' ? 'bg-[#0A84FF] border-[#0A84FF] shadow-lg shadow-blue-900/40' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
               <span className="font-bold text-sm block mb-1">Motel / Suíte</span>
               <span className="text-[10px] opacity-80">Vou até você</span>
             </button>
             <button onClick={() => { haptic(); setSelection({...selection, locationType: 'delivery'}); }} 
               className={`p-4 rounded-2xl border text-left transition-all ${selection.locationType === 'delivery' ? 'bg-[#0A84FF] border-[#0A84FF] shadow-lg shadow-blue-900/40' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
               <span className="font-bold text-sm block mb-1">Uber Ida/Volta</span>
               <span className="text-[10px] opacity-80">+ R$ 25,00 (Taxa)</span>
             </button>
           </div>
           {selection.locationType === 'delivery' && (
              <input 
                placeholder="Endereço (Rua, Número, Bairro)" 
                className="w-full mt-3 bg-transparent border-b border-white/20 py-3 text-white text-sm focus:border-[#0A84FF] outline-none transition-colors"
                onChange={e => setSelection({...selection, address: e.target.value})}
              />
           )}
        </section>

        {/* 2. Data e Hora (Scroll Horizontal) */}
        <section className="mb-8">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Calendar className="w-3 h-3"/> Data e Hora</h3>
           <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {['Hoje', 'Amanhã', 'Sáb', 'Dom'].map((d, i) => (
                <button key={d} onClick={() => { haptic(); setSelection({...selection, date: d}); }}
                   className={`px-5 py-3 rounded-xl border text-sm font-bold whitespace-nowrap transition-all ${selection.date === d ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
                   {d}
                </button>
              ))}
           </div>
           {selection.date && (
             <div className="grid grid-cols-4 gap-2 mt-3 animate-pulse-once">
                {['10:00', '14:00', '18:00', '20:00'].map(t => (
                  <button key={t} onClick={() => { haptic(); setSelection({...selection, time: t}); }}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${selection.time === t ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#1C1C1E] border-white/5 text-gray-500'}`}>
                    {t}
                  </button>
                ))}
             </div>
           )}
        </section>

        {/* 3. Add-ons (Upsell Fácil) */}
        <section className="mb-8">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Zap className="w-3 h-3"/> Turbinar Sessão</h3>
           <div className="space-y-2">
             {ADDONS.map(addon => {
               const active = selection.addons.some(a => a.id === addon.id);
               return (
                 <div key={addon.id} onClick={() => {
                    haptic();
                    setSelection(prev => ({
                      ...prev, 
                      addons: active ? prev.addons.filter(a => a.id !== addon.id) : [...prev.addons, addon]
                    }))
                 }} className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${active ? 'bg-[#32D74B]/10 border-[#32D74B] text-white' : 'bg-[#1C1C1E] border-white/5 text-gray-400'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{addon.icon}</span>
                      <span className="text-sm font-medium">{addon.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-xs">{addon.price === 0 ? 'Grátis' : `+ ${formatBRL(addon.price)}`}</span>
                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'bg-[#32D74B] border-[#32D74B]' : 'border-gray-600'}`}>
                          {active && <Check className="w-3 h-3 text-black" />}
                       </div>
                    </div>
                 </div>
               )
             })}
           </div>
        </section>

      </div>

      {/* FOOTER FLUTUANTE DE CHECKOUT */}
      <div className="fixed bottom-0 w-full p-0 z-30">
        <div className="h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="bg-[#1C1C1E] border-t border-white/10 rounded-t-[30px] p-6 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.8)]">
           
           {/* Resumo de Preço */}
           <div className="flex justify-between items-end mb-4">
              <div className="flex flex-col">
                 <span className="text-xs text-gray-500 font-bold uppercase mb-1">Total Estimado</span>
                 {selection.couponApplied && <span className="text-[10px] text-green-400 flex items-center gap-1"><Sparkles className="w-3 h-3"/> Cupom Aplicado</span>}
              </div>
              <div className="text-right">
                 {selection.couponApplied && <span className="text-sm text-gray-500 line-through mr-2">{formatBRL(total + 20)}</span>}
                 <span className="text-3xl font-bold text-white tracking-tighter">{formatBRL(total)}</span>
              </div>
           </div>

           {/* Botão de Ação */}
           <button 
             disabled={!selection.date || !selection.time}
             onClick={() => setView('success')}
             className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:scale-100 disabled:shadow-none">
             <span className="font-bold">Agendar pelo WhatsApp</span>
             <ArrowRight className="w-5 h-5" />
           </button>
           <p className="text-center text-[10px] text-gray-600 mt-3 flex items-center justify-center gap-1">
             <ShieldCheck className="w-3 h-3"/> Pagamento direto ao massagista. Sem cartão no app.
           </p>
        </div>
      </div>
    </div>
  );

  // VIEW SUCESSO (Geração da Msg)
  if (view === 'success') {
    const msg = `*PEDIDO INICIADO* 🚀
    
💆 *${selection.service.title}*
📅 ${selection.date} às ${selection.time}
📍 ${selection.locationType === 'studio' ? 'No Motel/Suíte' : 'No meu Local (Uber)'}
${selection.address ? `🏠 ${selection.address}` : ''}

*EXTRAS:*
${selection.addons.map(a => `+ ${a.name}`).join('\n') || 'Nenhum'}

${selection.couponApplied ? '🎟 *CUPOM DE 1ª VEZ APLICADO (-R$20)*' : ''}

💰 *TOTAL FINAL: ${formatBRL(total)}*
(Pagamento: Pix ou Dinheiro)

-----------------------------
*Aguardo confirmação.*`;

    const zapLink = `https://wa.me/5517991360413?text=${encodeURIComponent(msg)}`;
    
    // Auto-redirect UX
    setTimeout(() => {
       window.open(zapLink, '_blank');
       localStorage.setItem('thaly_history', 'true'); // Marca como cliente antigo
    }, 1500);

    return (
      <div className="h-screen flex flex-col items-center justify-center bg-black px-6 text-center">
        <style>{styles}</style>
        <div className="w-24 h-24 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(34,197,94,0.5)] animate-bounce">
           <Check className="w-12 h-12 text-black" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Quase lá!</h2>
        <p className="text-gray-400 mb-8">Abrindo seu WhatsApp para confirmar...</p>
        
        <div className="p-4 rounded-xl bg-[#1C1C1E] border border-white/10 w-full max-w-xs animate-pulse">
           <p className="text-xs text-gray-500 mb-2">Resumo</p>
           <div className="flex justify-between text-sm font-bold">
              <span>Total</span>
              <span>{formatBRL(total)}</span>
           </div>
        </div>

        <button onClick={() => window.location.reload()} className="mt-8 text-sm text-[#0A84FF] font-bold">Voltar ao Início</button>
      </div>
    );
  }
}
