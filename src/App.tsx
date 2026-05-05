import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 0. CONFIGURAÇÕES & MOTOR DE LÓGICA (v27 PREMIUM)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  STORAGE_KEY: '@thaly_app_v27_ultra',
  PIX_KEY: "62.922.530/0001-14", 
  START_HOUR: 8,
  END_HOUR: 22, 
  RUSH_FEE: 20,
  RUSH_HOURS: ['12:00', '13:00', '17:00', '18:00', '19:00'],
  LOCALE: 'pt-BR'
} as const;

// Ícones SVG Inline para garantir performance e independência de libs externas
const ICON_PATHS: Record<string, string> = {
  'menu': 'M4 12h16 M4 6h16 M4 18h16', 'x': 'M18 6L6 18M6 6l12 12', 'check': 'M20 6L9 17l-5-5',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', 'package': 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  'user': 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', 'bed': 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', 'award': 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'plus': 'M12 5v14 M5 12h14', 'chevron-left': 'M15 18l-6-6 6-6', 'alert': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01'
};

// Estilos Globais Refinados (Glassmorphism & Design Onyx)
const GlobalStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
    :root { --accent: #3b82f6; --bg: #09090b; --surface: #121214; --border: #27272a; --text: #f4f4f5; }
    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    body { background: var(--bg); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; }
    h1, h2, h3, .font-display { font-family: 'Playfair Display', serif; }
    .glass { background: rgba(18, 18, 20, 0.7); backdrop-filter: blur(12px); border: 1px solid var(--border); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `}} />
));

// ==================================================================================
// 1. DATA E RECURSOS (CATÁLOGO COMPLETO)
// ==================================================================================

const SERVICES = [
  { id: 'relax', cat: 'terapia', title: 'Massagem Clássica', price: 157, min: 60, icon: 'heart', tag: 'Alívio Imediato', desc: 'Foco na descompressão muscular profunda e alívio do estresse acumulado.', details: 'Pressão moderada/forte\nUso de óleos essenciais' },
  { id: 'sensorial', cat: 'terapia', title: 'Experiência Sensorial', price: 177, min: 60, icon: 'zap', tag: 'Desconexão Mental', desc: 'Toques sutis e ritmo lento para baixar a frequência cerebral e combater ansiedade.', details: 'Ritmo envolvente\nFoco no sistema nervoso' },
  { id: 'fusion', cat: 'especial', title: 'Fusion Experience', price: 207, min: 70, icon: 'award', tag: 'O Melhor dos 2 Mundos', desc: 'Inicia com alívio muscular e finaliza com uma jornada sensorial completa.', details: 'Terapia híbrida\nFinalização relaxante' },
  { id: 'nuru', cat: 'premium', title: 'Massagem Nuru', price: 317, min: 60, icon: 'star', tag: 'Entrega Total', desc: 'Deslizamento corporal completo com gel específico para máxima fluidez.', details: 'Exclusiva e imersiva\nRequer ducha prévia' },
  { id: 'reversa', cat: 'especial', title: 'Massagem Reversa', price: 260, min: 60, icon: 'award', tag: 'Reciprocidade', desc: 'Dinâmica de troca onde ambos participam ativamente do relaxamento.', details: 'Conexão mútua\nInterativa' },
  { id: 'depil', cat: 'care', title: 'Aparo Corporal', price: 107, min: 40, icon: 'package', tag: 'Estética', desc: 'Higiene e manutenção dos pelos com máquina profissional.', details: 'Serviço estético apenas\nNão inclui massagem' }
];

const PACKS = [
  { id: 'p_essencial', title: 'Kit Sobrevivência (2x)', price: 297, full: 334, save: 37, desc: 'Dois encontros mensais para manter o equilíbrio.', icon: 'award' },
  { id: 'p_boss', title: 'Mensalidade do Chefe (3x)', price: 637, full: 721, save: 84, desc: 'O cuidado definitivo para sua rotina executiva.', icon: 'award' }
];

const EXTRAS = [
  { id: 'ext_time', label: 'Tempo Estendido (+30m)', price: 77, icon: 'clock' },
  { id: 'ext_touch', label: 'Interação Orgânica', price: 77, icon: 'heart' },
  { id: 'ext_focus', label: 'Foco Extra em Dores', price: 20, icon: 'zap' }
];

// ==================================================================================
// 2. COMPONENTES DE UI ATÔMICOS
// ==================================================================================

const Icon = memo(({ name, size = 20, className = "" }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

const Button = memo(({ children, onClick, variant = 'primary', full = false, icon, disabled = false }: any) => {
  const base = "h-14 px-8 rounded-2xl flex items-center justify-center gap-3 font-semibold transition-all active:scale-95 disabled:opacity-40";
  const styles = {
    primary: "bg-white text-black hover:bg-zinc-200",
    secondary: "bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800",
    accent: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant as keyof typeof styles]} ${full ? 'w-full' : ''}`}>
      {icon && <Icon name={icon} size={18} />} {children}
    </button>
  );
});

// ==================================================================================
// 3. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function PremiumBookingApp() {
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<any[]>([]);
  const [extras, setExtras] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('terapia');
  const [user, setUser] = useState({ name: '', xp: 125 }); // XP simulado do cliente
  const [form, setForm] = useState({
    date: null as Date | null,
    time: '',
    locType: 'residencia',
    addr: { street: '', num: '', dist: '' },
    payment: 'pix'
  });

  // Cálculos Financeiros
  const subtotal = useMemo(() => cart.reduce((acc, i) => acc + i.price, 0), [cart]);
  const extrasTotal = useMemo(() => extras.reduce((acc, id) => acc + (EXTRAS.find(e => e.id === id)?.price || 0), 0), [extras]);
  const rushFee = useMemo(() => (CONFIG.RUSH_HOURS.includes(form.time) && form.locType !== 'suite' ? CONFIG.RUSH_FEE : 0), [form.time, form.locType]);
  const total = useMemo(() => {
    let t = subtotal + extrasTotal + rushFee;
    return form.payment === 'pix' ? t * 0.97 : t; // 3% OFF no PIX
  }, [subtotal, extrasTotal, rushFee, form.payment]);

  const toggleCart = (item: any) => {
    setCart(prev => prev.find(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item]);
  };

  const handleNext = () => {
    if (step === 0 && cart.length === 0) return;
    if (step === 1 && (!user.name || (form.locType === 'residencia' && !form.addr.street))) return;
    if (step === 3) return handleConfirm();
    setStep(s => s + 1);
  };

  const handleConfirm = () => {
    const items = cart.map(i => `✅ *${i.title}*`).join('\n');
    const exStr = extras.map(e => `➕ ${EXTRAS.find(ex => ex.id === e)?.label}`).join('\n');
    const msg = `*SOLICITAÇÃO DE RESERVA*\n\n👤 *Cliente:* ${user.name}\n📅 *Data:* ${form.date?.toLocaleDateString()} às ${form.time}\n\n*Serviços:*\n${items}\n${exStr ? `\n*Extras:*\n${exStr}` : ''}\n\n📍 *Local:* ${form.locType === 'suite' ? 'Sua Suíte (Bela Vista)' : `${form.addr.street}, ${form.addr.num}`}\n💳 *Pagamento:* ${form.payment.toUpperCase()}\n💰 *Total:* R$ ${total.toFixed(2)}`;
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-32">
      <GlobalStyles />
      
      {/* Header Sophistication */}
      <header className="p-8 max-w-4xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display text-white">Thalyson <span className="text-zinc-500">Massage</span></h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Disponível em São Paulo</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Client Level</p>
          <div className="flex items-center gap-2 text-blue-500 font-bold">
            <Icon name="award" size={14} />
            <span className="text-sm">GOLD {user.xp} XP</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 animate-up">
        
        {/* STEP 0: SELEÇÃO DE TERAPIAS */}
        {step === 0 && (
          <section className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-display text-white italic">Seu momento de pausa.</h2>
              <p className="text-zinc-500 text-sm font-light">Selecione os cuidados que você precisa hoje.</p>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {['terapia', 'especial', 'premium', 'care', 'pacotes'].map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold border transition-all ${activeTab === t ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}>
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTab === 'pacotes' ? (
                PACKS.map(p => (
                  <div key={p.id} onClick={() => toggleCart(p)} className={`p-6 rounded-3xl border transition-all cursor-pointer ${cart.find(i=>i.id===p.id) ? 'bg-blue-600/10 border-blue-500' : 'bg-zinc-900/50 border-zinc-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-10 w-10 glass rounded-xl flex items-center justify-center text-blue-400">
                        <Icon name="package" size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-400/10 px-3 py-1 rounded-full">Economize {p.save}</span>
                    </div>
                    <h3 className="text-lg font-display text-white">{p.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 mb-4">{p.desc}</p>
                    <span className="text-xl font-bold text-white">R$ {p.price}</span>
                  </div>
                ))
              ) : (
                SERVICES.filter(s => s.cat === activeTab).map(s => (
                  <div key={s.id} onClick={() => toggleCart(s)} className={`p-6 rounded-3xl border transition-all cursor-pointer relative ${cart.find(i=>i.id===s.id) ? 'border-white bg-zinc-900' : 'bg-zinc-900/30 border-zinc-800'}`}>
                    {cart.find(i=>i.id===s.id) && <div className="absolute top-4 right-4 text-white"><Icon name="check" size={16} /></div>}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-10 w-10 glass rounded-xl flex items-center justify-center text-zinc-400">
                        <Icon name={s.icon} size={20} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{s.title}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500">{s.tag}</p>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-400 font-light mb-4 line-clamp-2">{s.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">R$ {s.price}</span>
                      <span className="text-[10px] text-zinc-500">{s.min} MIN</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* STEP 1: LOGÍSTICA & IDENTIFICAÇÃO */}
        {step === 1 && (
          <section className="space-y-8 max-w-xl mx-auto">
            <h2 className="text-3xl font-display text-white">Onde e para quem?</h2>
            
            <div className="glass p-8 rounded-[2rem] space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Seu Nome ou Apelido</label>
                <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 outline-none focus:border-blue-500 transition-all" placeholder="Como devo te chamar?" />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 ml-1">Local do Atendimento</label>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setForm({...form, locType: 'residencia'})} className={`h-14 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${form.locType === 'residencia' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                    <Icon name="home" size={16} /> Residência
                  </button>
                  <button onClick={() => setForm({...form, locType: 'suite'})} className={`h-14 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${form.locType === 'suite' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                    <Icon name="bed" size={16} /> Minha Suíte
                  </button>
                </div>
              </div>

              {form.locType === 'residencia' ? (
                <div className="space-y-4 animate-up">
                  <input value={form.addr.street} onChange={e => setForm({...form, addr: {...form.addr, street: e.target.value}})} className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 outline-none" placeholder="Rua / Avenida" />
                  <div className="grid grid-cols-2 gap-4">
                    <input value={form.addr.num} onChange={e => setForm({...form, addr: {...form.addr, num: e.target.value}})} className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 outline-none" placeholder="Número" />
                    <input value={form.addr.dist} onChange={e => setForm({...form, addr: {...form.addr, dist: e.target.value}})} className="w-full h-14 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 outline-none" placeholder="Bairro" />
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-center animate-up">
                  <p className="text-xs text-zinc-400">A base fica na Bela Vista (São Paulo). O endereço completo é enviado após a reserva.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* STEP 2: AGENDA & EXTRAS */}
        {step === 2 && (
          <section className="space-y-8">
            <h2 className="text-3xl font-display text-white">Quando nos encontramos?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass p-6 rounded-3xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Escolha a data</p>
                <div className="grid grid-cols-4 gap-2">
                  {[0,1,2,3,4,5,6,7].map(i => {
                    const d = new Date(); d.setDate(d.getDate() + i);
                    const isSel = form.date?.toDateString() === d.toDateString();
                    return (
                      <button key={i} onClick={() => setForm({...form, date: d})} className={`h-16 flex flex-col items-center justify-center rounded-xl border transition-all ${isSel ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                        <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                        <span className="text-sm font-bold">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="glass p-6 rounded-3xl">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Horários Disponíveis</p>
                <div className="grid grid-cols-3 gap-2 h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                  {Array.from({length: 12}).map((_, i) => {
                    const t = `${i + 9}:00`;
                    const isSel = form.time === t;
                    const isRush = CONFIG.RUSH_HOURS.includes(t);
                    return (
                      <button key={t} onClick={() => setForm({...form, time: t})} className={`h-12 rounded-xl border relative transition-all ${isSel ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                        <span className="text-xs font-bold">{t}</span>
                        {isRush && <div className="absolute top-1 right-1 h-1 w-1 rounded-full bg-blue-500" title="Horário de Pico" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-display text-white italic">Quer algo a mais?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {EXTRAS.map(ex => (
                  <button key={ex.id} onClick={() => setExtras(prev => prev.includes(ex.id) ? prev.filter(e => e!==ex.id) : [...prev, ex.id])} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${extras.includes(ex.id) ? 'border-white bg-zinc-900' : 'border-zinc-800 bg-zinc-900/20'}`}>
                    <div className="flex items-center gap-3">
                      <Icon name={ex.icon} size={16} className={extras.includes(ex.id) ? 'text-white' : 'text-zinc-600'} />
                      <span className="text-[10px] font-bold uppercase tracking-tight text-left leading-none">{ex.label}</span>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500">+ R${ex.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STEP 3: RESUMO & PAGAMENTO */}
        {step === 3 && (
          <section className="space-y-8 max-w-xl mx-auto">
             <h2 className="text-3xl font-display text-white">Finalização</h2>
             <div className="glass p-8 rounded-[2rem] space-y-6">
                <div className="space-y-4">
                  {cart.map(i => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="text-zinc-400 italic">{i.title}</span>
                      <span className="font-bold">R$ {i.price}</span>
                    </div>
                  ))}
                  {extras.map(id => {
                    const ex = EXTRAS.find(e => e.id === id);
                    return (
                      <div key={id} className="flex justify-between text-sm">
                        <span className="text-zinc-500">{ex?.label}</span>
                        <span className="text-zinc-500">R$ {ex?.price}</span>
                      </div>
                    )
                  })}
                  {rushFee > 0 && (
                    <div className="flex justify-between text-sm text-blue-400">
                      <span>Taxa de deslocamento (Horário de Pico)</span>
                      <span>R$ {rushFee}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-3 block">Forma de Pagamento (Acerto no local)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setForm({...form, payment: 'pix'})} className={`h-14 rounded-2xl border text-xs font-bold transition-all ${form.payment === 'pix' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>PIX (3% OFF)</button>
                    <button onClick={() => setForm({...form, payment: 'card'})} className={`h-14 rounded-2xl border text-xs font-bold transition-all ${form.payment === 'card' ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>CARTÃO</button>
                  </div>
                </div>

                <div className="pt-6 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Total com desconto</p>
                    <p className="text-4xl font-display text-white">R$ {total.toFixed(2)}</p>
                  </div>
                  <div className="text-right text-[10px] text-zinc-500 leading-tight">
                    <p>Agendamento garantido</p>
                    <p>pelo sistema v27</p>
                  </div>
                </div>
             </div>
          </section>
        )}
      </main>

      {/* Floating Control Bar */}
      <nav className="fixed bottom-0 left-0 right-0 p-6 z-50">
        <div className="max-w-xl mx-auto glass rounded-3xl p-4 flex gap-4 shadow-2xl">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="w-14 h-14 flex items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-all">
              <Icon name="chevron-left" size={20} />
            </button>
          )}
          
          <div className="flex-1">
             <Button full variant={step === 3 ? 'accent' : 'primary'} disabled={!isStepValid()} onClick={handleNext}>
                {step === 3 ? 'Confirmar Agendamento' : 'Avançar'}
             </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
