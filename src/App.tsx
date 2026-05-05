import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 0. THE ONYX DESIGN SYSTEM (ARCHITECTURE & CORE)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  BASE_LOCATION: "Bela Vista, São Paulo",
  STORAGE_KEY: '@thaly_signature_v27',
  PIX_KEY: "62.922.530/0001-14",
  LIMITS: { start: 8, end: 22, maxDaily: 6 },
  FEES: { rush: 25, weekend: 15, portfolio_discount: 0.02, pix_discount: 0.03 }
};

// Paleta focada em Profundidade e Contraste (Onyx & Slate)
const THEME = {
  bg: '#050505',
  surface: '#0f0f12',
  border: '#1f1f23',
  accent: '#3b82f6',
  text: { main: '#ffffff', muted: '#88888e', success: '#10b981' }
};

// ==================================================================================
// 1. DATA ENGINE (O CONTEÚDO QUE CONVERTE)
// ==================================================================================

const SERVICES = [
  { id: 'classic', cat: 'massagem', title: 'Terapia Clássica', price: 157, duration: 60, tag: 'Recuperação Muscular', desc: 'Protocolo focado em descompressão miofascial e liberação de pontos de gatilho.' },
  { id: 'sensory', cat: 'massagem', title: 'Experiência Sensorial', price: 177, duration: 60, tag: 'Equilíbrio Mental', desc: 'Foco no sistema nervoso central. Ritmo lento e toques sutis para combate à ansiedade.' },
  { id: 'fusion', cat: 'massagem', title: 'Fusion Premium', price: 210, duration: 80, tag: 'A Experiência Completa', desc: 'O equilíbrio perfeito entre a força da desportiva e a fluidez do toque sensorial.' },
  { id: 'nuru', cat: 'premium', title: 'Massagem Nuru', price: 317, duration: 60, tag: 'Imersão Absoluta', desc: 'Técnica de deslizamento corporal total (Skin-to-Skin) com gel de algas marinhas.' },
  { id: 'reversa', cat: 'premium', title: 'Interação Reversa', price: 260, duration: 60, tag: 'Reciprocidade', desc: 'Dinâmica de troca ativa onde o cliente participa do fluxo da sessão.' },
  { id: 'grooming', cat: 'estetica', title: 'Grooming Corporal', price: 107, duration: 40, tag: 'Higiene & Estética', desc: 'Aparo técnico de pelos com máquina profissional. (Atenção: Serviço sem massagem).' }
];

const BUNDLES = [
  { id: 'pack_1', title: 'Signature Pack (2x)', price: 297, savings: 37, desc: 'Acesso prioritário e manutenção mensal do seu bem-estar.' },
  { id: 'pack_2', title: 'Executive Plan (3x)', price: 637, savings: 84, desc: 'O padrão ouro de cuidado. Três sessões estrategicamente distribuídas.' }
];

const UPGRADES = [
  { id: 'time', label: '+30 Minutos de Sessão', price: 77, icon: 'clock' },
  { id: 'aromatherapy', label: 'Óleos de Alta Performance', price: 20, icon: 'wind' },
  { id: 'hot_towel', label: 'Toalhas Quentes (Apenas Home)', price: 30, icon: 'sun' }
];

// ==================================================================================
// 2. COMPONENTES ATÔMICOS (UX/UI SENIOR)
// ==================================================================================

const GlobalStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;1,400&display=swap');
    body { background: ${THEME.bg}; color: ${THEME.text.main}; font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    .font-display { font-family: 'Playfair Display', serif; }
    .glass { background: rgba(15, 15, 18, 0.8); backdrop-filter: blur(20px); border: 1px solid ${THEME.border}; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-in { animation: fadeIn 0.4s ease-out forwards; }
  `}} />
));

const Icon = ({ name, size = 20, className = "" }: any) => {
  const paths: any = {
    check: 'M20 6L9 17l-5-5', x: 'M18 6L6 18M6 6l12 12', clock: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
    home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', bed: 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10',
    plus: 'M12 5v14 M5 12h14', award: 'M12 15l2 5 2-5 5-2-5-2-2-5-2 5-5 2 5 2z', shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={paths[name] || ''} />
    </svg>
  );
};

// ==================================================================================
// 3. CORE ENGINE (A INTELIGÊNCIA DO PRODUTO)
// ==================================================================================

export default function ThalySignatureApp() {
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<any[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [activeCat, setActiveCat] = useState('massagem');
  const [user, setUser] = useState({ name: '', xp: 240, level: 'Platinum Client' });
  const [booking, setBooking] = useState({
    date: null as Date | null,
    time: '',
    locType: 'residencia',
    address: { street: '', num: '', dist: '' },
    payment: 'pix',
    portfolioConsent: false
  });

  // Cálculo de Subtotal e Tempo (Fundamental para a agenda)
  const stats = useMemo(() => {
    const sub = cart.reduce((acc, i) => acc + i.price, 0);
    const exTotal = extras.reduce((acc, id) => acc + (UPGRADES.find(u => u.id === id)?.price || 0), 0);
    const duration = cart.reduce((acc, i) => acc + i.duration, 0) + (extras.includes('time') ? 30 : 0);
    
    let total = sub + exTotal;
    if (booking.payment === 'pix') total *= (1 - CONFIG.FEES.pix_discount);
    if (booking.portfolioConsent) total *= (1 - CONFIG.FEES.portfolio_discount);
    
    return { total, duration, sub };
  }, [cart, extras, booking.payment, booking.portfolioConsent]);

  const handleToggle = (item: any) => {
    setCart(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]);
  };

  const handleFinalize = () => {
    const dStr = booking.date?.toLocaleDateString('pt-BR');
    const items = cart.map(i => `✅ *${i.title}*`).join('\n');
    const loc = booking.locType === 'suite' ? `Sua Suíte (Bela Vista)` : `${booking.address.street}, ${booking.address.num} - ${booking.address.dist}`;
    
    const msg = `*RESERVA SIGNATURE V27*\n\n👤 *Nome:* ${user.name}\n📅 *Data:* ${dStr} às ${booking.time}\n⏱️ *Tempo Estimado:* ${stats.duration}min\n\n*Serviços:*\n${items}\n\n📍 *Localização:* ${loc}\n💳 *Pagamento:* ${booking.payment.toUpperCase()}\n💰 *Investimento:* R$ ${stats.total.toFixed(2)}`;
    
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen px-6 pb-40 max-w-4xl mx-auto">
      <GlobalStyles />
      
      {/* Header de Status */}
      <header className="py-10 flex justify-between items-center animate-in">
        <div className="space-y-1">
          <h1 className="text-2xl font-display tracking-tight">Thalyson <span className="opacity-40 font-light">Rodrigo</span></h1>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Premium Wellness Services</p>
          </div>
        </div>
        <div className="text-right glass px-4 py-2 rounded-2xl border-white/5">
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Status Fidelidade</p>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase">
            <Icon name="award" size={14} /> {user.level}
          </div>
        </div>
      </header>

      {/* Navegação de Passos (Iconic UI) */}
      <div className="flex gap-2 mb-12">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-700 ${step >= i ? 'bg-white' : 'bg-zinc-800'}`} />
        ))}
      </div>

      <main className="animate-in">
        
        {/* PASSO 0: CURADORIA DE SERVIÇOS */}
        {step === 0 && (
          <div className="space-y-10">
            <div className="space-y-2">
              <h2 className="text-4xl font-display italic">Escolha sua renovação.</h2>
              <p className="text-zinc-500 text-sm font-light">Selecione as terapias para compor sua sessão personalizada.</p>
            </div>

            <div className="flex gap-2 no-scrollbar overflow-x-auto pb-4">
              {['massagem', 'premium', 'estetica', 'pacotes'].map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)} className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${activeCat === cat ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeCat === 'pacotes' ? (
                BUNDLES.map(b => (
                  <div key={b.id} onClick={() => handleToggle(b)} className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${cart.find(i=>i.id===b.id) ? 'bg-blue-600/10 border-blue-500 shadow-2xl' : 'bg-zinc-900/40 border-zinc-800'}`}>
                    <div className="flex justify-between items-start mb-6">
                       <Icon name="award" className="text-blue-500" />
                       <span className="text-[9px] font-bold text-blue-400 border border-blue-400/30 px-2 py-1 rounded-full">ECONOMIZE R$ {b.savings}</span>
                    </div>
                    <h3 className="text-lg font-display mb-1">{b.title}</h3>
                    <p className="text-xs text-zinc-500 font-light mb-4">{b.desc}</p>
                    <p className="text-xl font-bold">R$ {b.price}</p>
                  </div>
                ))
              ) : (
                SERVICES.filter(s => s.cat === activeCat).map(s => (
                  <div key={s.id} onClick={() => handleToggle(s)} className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${cart.find(i=>i.id===s.id) ? 'bg-zinc-900 border-white' : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-600'}`}>
                    {cart.find(i=>i.id===s.id) && <Icon name="check" size={18} className="absolute top-6 right-6 text-white" />}
                    <div className="mb-4">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{s.tag}</span>
                      <h3 className="text-lg font-display mt-1">{s.title}</h3>
                    </div>
                    <p className="text-xs text-zinc-400 font-light mb-6 leading-relaxed">{s.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">R$ {s.price}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{s.duration} MINUTOS</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PASSO 1: LOGÍSTICA & IDENTIFICAÇÃO */}
        {step === 1 && (
          <div className="space-y-10 max-w-xl mx-auto">
            <h2 className="text-3xl font-display">Informações de Acesso</h2>
            
            <div className="glass p-8 rounded-[2.5rem] space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Seu Nome</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 outline-none focus:border-white transition-all font-light" placeholder="Como devo te chamar?" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Onde será nosso encontro?</label>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setBooking({...booking, locType: 'residencia'})} className={`h-14 rounded-2xl border flex items-center justify-center gap-3 transition-all ${booking.locType === 'residencia' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                    <Icon name="home" size={16} /> Residência
                  </button>
                  <button onClick={() => setBooking({...booking, locType: 'suite'})} className={`h-14 rounded-2xl border flex items-center justify-center gap-3 transition-all ${booking.locType === 'suite' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                    <Icon name="bed" size={16} /> Minha Suíte
                  </button>
                </div>
              </div>

              {booking.locType === 'residencia' ? (
                <div className="space-y-4 animate-in">
                  <input value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 outline-none" placeholder="Rua / Avenida" />
                  <div className="grid grid-cols-2 gap-4">
                    <input value={booking.address.num} onChange={e => setBooking({...booking, address: {...booking.address, num: e.target.value}})} className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 outline-none" placeholder="Número / Apto" />
                    <input value={booking.address.dist} onChange={e => setBooking({...booking, address: {...booking.address, dist: e.target.value}})} className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 outline-none" placeholder="Bairro" />
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-zinc-800/40 border border-zinc-700/50 text-center animate-in">
                  <p className="text-xs text-zinc-400 font-light italic">A base Signature fica no coração da Bela Vista. O endereço detalhado será fornecido após a pré-reserva.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PASSO 2: CRONOGRAMA & UPGRADES */}
        {step === 2 && (
          <div className="space-y-10">
            <h2 className="text-3xl font-display">Agenda & Detalhes</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[2.5rem]">
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-6">Disponibilidade</p>
                <div className="grid grid-cols-4 gap-3">
                  {[0,1,2,3,4,5,6,7].map(i => {
                    const d = new Date(); d.setDate(d.getDate() + i);
                    const isSel = booking.date?.toDateString() === d.toDateString();
                    return (
                      <button key={i} onClick={() => setBooking({...booking, date: d})} className={`h-20 flex flex-col items-center justify-center rounded-2xl border transition-all ${isSel ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                        <span className="text-[9px] uppercase font-bold mb-1">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                        <span className="text-lg font-display">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
                
                {booking.date && (
                  <div className="mt-8 grid grid-cols-3 gap-3 animate-in">
                    {['09:00', '11:00', '14:00', '16:00', '19:00', '21:00'].map(t => (
                      <button key={t} onClick={() => setBooking({...booking, time: t})} className={`h-12 rounded-xl border text-xs font-bold transition-all ${booking.time === t ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest ml-1">Refine seu momento</p>
                {UPGRADES.map(ex => (
                  <button key={ex.id} onClick={() => setExtras(p => p.includes(ex.id) ? p.filter(e=>e!==ex.id) : [...p, ex.id])} className={`w-full p-5 rounded-3xl border flex items-center justify-between transition-all ${extras.includes(ex.id) ? 'bg-zinc-900 border-white' : 'bg-zinc-900/30 border-zinc-800'}`}>
                    <div className="flex items-center gap-4">
                      <Icon name={ex.icon as any} size={18} className={extras.includes(ex.id) ? 'text-white' : 'text-zinc-600'} />
                      <span className="text-xs font-bold uppercase tracking-tight">{ex.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500">+ R$ {ex.price}</span>
                  </button>
                ))}
                
                <div onClick={() => setBooking({...booking, portfolioConsent: !booking.portfolioConsent})} className={`p-5 rounded-3xl border cursor-pointer transition-all ${booking.portfolioConsent ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-zinc-900/30 border-zinc-800'}`}>
                   <p className="text-[11px] font-bold mb-1">Apoio ao Portfólio (Opcional)</p>
                   <p className="text-[10px] text-zinc-500 font-light">Autorizo fotos estéticas anônimas para divulgação e ganho **2% de desconto**.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASSO 3: CHECKOUT FINAL */}
        {step === 3 && (
          <div className="max-w-xl mx-auto space-y-8 animate-in">
             <h2 className="text-3xl font-display">Resumo do Pedido</h2>
             <div className="glass p-10 rounded-[3rem] space-y-8">
                <div className="space-y-4">
                  {cart.map(i => (
                    <div key={i.id} className="flex justify-between items-end border-b border-zinc-800 pb-4">
                      <div>
                        <p className="font-display text-lg">{i.title}</p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{i.duration} minutos de duração</p>
                      </div>
                      <span className="font-bold">R$ {i.price}</span>
                    </div>
                  ))}
                  {extras.length > 0 && (
                    <div className="space-y-2 pt-2">
                       {extras.map(id => (
                         <div key={id} className="flex justify-between text-xs text-zinc-500">
                           <span>{UPGRADES.find(u=>u.id===id)?.label}</span>
                           <span>R$ {UPGRADES.find(u=>u.id===id)?.price}</span>
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block">Pagamento no Local</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setBooking({...booking, payment: 'pix'})} className={`h-14 rounded-2xl border text-xs font-bold transition-all ${booking.payment === 'pix' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>PIX (3% OFF)</button>
                    <button onClick={() => setBooking({...booking, payment: 'cartao'})} className={`h-14 rounded-2xl border text-xs font-bold transition-all ${booking.payment === 'cartao' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>CARTÃO</button>
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-800 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Investimento Final</p>
                    <p className="text-5xl font-display text-white">R$ {stats.total.toFixed(2)}</p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                     <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold">
                        <Icon name="shield" size={14} /> AMBIENTE SEGURO
                     </div>
                     <p className="text-[9px] text-zinc-600 uppercase max-w-[100px]">Previsão de término: {stats.duration}min</p>
                  </div>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Floating Control Bar (The Conversion Bar) */}
      <nav className="fixed bottom-0 left-0 right-0 p-8 z-50 pointer-events-none">
        <div className="max-w-xl mx-auto glass rounded-[2.5rem] p-4 flex gap-4 pointer-events-auto shadow-2xl">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="w-16 h-16 flex items-center justify-center rounded-3xl bg-zinc-900 border border-zinc-800 hover:border-zinc-500 transition-all text-white">
              <Icon name="x" className="rotate-45" size={20} />
            </button>
          )}
          
          <button 
            disabled={step === 0 ? cart.length === 0 : step === 1 ? !user.name : step === 2 ? (!booking.date || !booking.time) : false}
            onClick={step === 3 ? handleFinalize : () => setStep(s => s + 1)} 
            className="flex-1 h-16 bg-white text-black rounded-[1.8rem] font-bold uppercase text-[11px] tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-20 shadow-xl shadow-white/5"
          >
            {step === 3 ? 'Confirmar Reserva via WhatsApp' : 'Próximo Passo'}
          </button>
        </div>
      </nav>
    </div>
  );
}
