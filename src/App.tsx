import React, { useState, useEffect, useMemo, memo, useRef } from 'react';

// ==================================================================================
// 1. CONFIGURAÇÕES E ÍCONES
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/relaxarhojesp",
  PIX_KEY: "62.922.530/0001-14",
  START_HOUR: 9,
  END_HOUR: 22,
};

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

const ICON_PATHS: Record<string, string> = {
  'hand': 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
  'sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'refresh-cw': 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'calendar': 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'user': 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'check': 'M20 6L9 17l-5-5',
  'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01',
  'message-circle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  'bed': 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
  'building': 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-left': 'M15 18l-6-6 6-6',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
};

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 30) => { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { } };

// ==================================================================================
// 2. DADOS E COPY ESTRATÉGICA
// ==================================================================================
const SERVICES = [
  { id: 'classica', title: 'Clássica', price: 180, icon: 'hand', desc: 'Massagem com força para tirar a dor. Fico de roupa, você fica como achar melhor. Não tem toque nas partes íntimas.' },
  { id: 'sensorial', title: 'Sensorial', price: 200, icon: 'sparkles', desc: 'Toque bem leve só com a ponta dos dedos para dar arrepio e esvaziar a mente, até chegar no alívio final.' },
  { id: 'fusion', title: 'Fusion', price: 250, icon: 'zap', popular: true, desc: 'Mistura a força das mãos com a minha barba passando no seu corpo (atendo só de cueca). É a que mais sai, com alívio final.' },
  { id: 'reversa', title: 'Reversa', price: 300, icon: 'refresh-cw', desc: 'Metade do tempo eu tiro o seu estresse. Na outra metade, você faz a massagem em mim. Com alívio final.' },
  { id: 'nuru', title: 'Nuru', price: 350, icon: 'star', desc: 'Nós dois pelados. Muito gel para escorregar fácil. Passo meu corpo no seu até o relaxamento final.' },
];

const EXTRAS = [
  { id: 'more_time', price: 77, icon: 'clock', label: 'Tempo Estendido (+30m)', desc: 'Para quando você não quer que acabe logo.' },
  { id: 'aroma', price: 17, icon: 'sparkles', label: 'Aromaterapia', desc: 'Óleos essenciais para desacelerar a mente.' },
];

const REVIEWS = [
  { n: "Gustavo", loc: "Bela Vista - SP", t: "O Thalyson chegou na hora certa. Mãos com técnica sem igual, o alívio foi imediato. Levantei parecendo mais leve.", serv: "Experiência Fusion", s: 5 },
  { n: "Lucas", loc: "Londrina", t: "A discrição era minha prioridade e fui atendido com total sigilo. A massagem me permitiu redescobrir meu próprio corpo. Sensacional.", serv: "Massagem Nuru", s: 5 },
  { n: "Ricardo", loc: "Fernandópolis", t: "Encontrei um profissionalismo raro. Me senti à vontade para soltar minhas travas. Saí me sentindo mais leve.", serv: "Massagem Reversa", s: 5 }
];

const FAQ = [
  { q: "Como a finalização funciona na prática?", a: "Tudo é conduzido com muito respeito ao seu tempo e corpo. O objetivo é criar um espaço seguro para você se soltar totalmente e chegar a um relaxamento intenso que tira todo o peso da rotina." },
  { q: "Onde nós vamos nos encontrar?", a: "Eu vou até você para o seu conforto. Pode ser na sua casa ou em um hotel. Eu levo o necessário para transformar o ambiente." },
  { q: "Tenho vergonha do meu corpo, o que eu faço?", a: "Esqueça completamente isso. Meu ambiente é de acolhimento e sem julgamentos. Não importa sua idade ou seu corpo. Estou indo exclusivamente para cuidar de você." }
];

// ==================================================================================
// 3. COMPONENTES DE UI REUTILIZÁVEIS
// ==================================================================================
const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', maxLength, error }: any) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 pl-1">{label}</label>}
    <div className="relative group">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-blue-400'}`}><Icon name={icon} size={18} /></div>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
        className={`w-full min-h-[52px] rounded-xl text-sm transition-all border outline-none bg-white/5 placeholder:text-zinc-500 focus:bg-white/10 ${icon ? 'pl-11 pr-4' : 'px-4'} ${error ? 'border-red-500/50 text-red-400 focus:border-red-500' : 'border-zinc-700 text-white focus:border-blue-500'}`}
      />
    </div>
  </div>
));

const Accordion = memo(({ title, content }: { title: string; content: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-center justify-between text-left gap-4">
        <h3 className="text-sm font-bold text-zinc-200">{title}</h3>
        <Icon name="chevron-down" size={18} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-sm text-zinc-400 leading-relaxed">{content}</p>
      </div>
    </div>
  );
});

// ==================================================================================
// 4. APLICAÇÃO PRINCIPAL
// ==================================================================================
export default function App() {
  const [step, setStep] = useState<0 | 1>(0); // 0 = Landing, 1 = Checkout
  
  // Estado do Carrinho e Checkout
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [locationType, setLocationType] = useState<'home' | 'motel' | 'hotel'>('home');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [payment, setPayment] = useState<'pix' | 'card' | 'money' | null>(null);
  const [activeExtras, setActiveExtras] = useState<Record<string, boolean>>({});
  
  // Sistema de Cupons
  const [manualCoupon, setManualCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  const selectedService = SERVICES.find(s => s.id === selectedServiceId);
  const isRush = time ? RUSH_HOURS.includes(time) && locationType !== 'motel' : false;

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApplyCoupon = () => {
    if (manualCoupon.toUpperCase() === 'RETORNO10') {
      setAppliedCoupon({ code: 'RETORNO10', discount: 0.10 }); // 10% off
      showToast('Benefício ativado com sucesso!');
      setManualCoupon('');
    } else {
      showToast('Código inválido ou expirado.', 'error');
    }
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    let sub = selectedService.price;
    
    EXTRAS.forEach(ex => {
      if (activeExtras[ex.id]) sub += ex.price;
    });

    const discountAmount = appliedCoupon ? (sub * appliedCoupon.discount) : 0;
    const totalAfterDiscount = sub - discountAmount;
    
    return totalAfterDiscount + (isRush ? RUSH_FEE : 0);
  };

  const generateWhatsAppMsg = () => {
    if (!selectedService || !name || !time || !date) return '';
    const dateStr = date.toLocaleDateString('pt-BR');
    const locText = locationType === 'motel' ? 'Sua Suíte (Endereço a confirmar)' : address || 'Não informado';
    
    const extrasText = Object.keys(activeExtras).filter(k => activeExtras[k])
      .map(k => EXTRAS.find(e => e.id === k)?.label)
      .join(', ');

    return `*Pedido de Reserva* | #${Math.floor(Math.random()*10000)}\n──────────────────\nOlá Thalyson, quero agendar meu momento de relaxamento.\n\n👤 *Nome:* ${name}\n💆‍♂️ *Experiência:* ${selectedService.title}\n📅 *Quando:* ${dateStr} às ${time}\n📍 *Onde:* ${locText}\n${extrasText ? `✨ *Extras:* ${extrasText}\n` : ''}\n💳 *Pagamento:* ${payment?.toUpperCase() || 'A COMBINAR'}\n💰 *Total Estimado:* ${formatMoney(calculateTotal())}\n${appliedCoupon ? `🎟 *Benefício:* ${appliedCoupon.code}\n` : ''}──────────────────\n_Declaro ter lido as regras e aceito os termos de respeito mútuo._`;
  };

  const handleFinish = () => {
    if (!name || !date || !time || !payment) {
      showToast("Preencha todos os campos obrigatórios para finalizar.", "error");
      return;
    }
    vibrate([50, 50, 50]);
    const url = `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(generateWhatsAppMsg())}`;
    window.open(url, '_blank');
  };

  const daysArray = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) { 
      const d = new Date(today); d.setDate(today.getDate() + i); arr.push(d); 
    }
    return arr;
  }, []);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) slots.push(`${i < 10 ? '0' : ''}${i}:00`);
    if (!date) return slots;
    if (date.toDateString() === new Date().toDateString()) {
      return slots.filter(t => parseInt(t) > new Date().getHours());
    }
    return slots;
  }, [date]);

  return (
    <div className="min-h-screen bg-[#11141a] text-zinc-100 font-sans selection:bg-blue-500/30 pb-24">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; -webkit-tap-highlight-color: transparent; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
        .animate-slide-up { animation: slideUp 0.4s ease forwards; }
      `}} />

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] animate-fade-in">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md ${toast.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-100' : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'}`}>
            <Icon name={toast.type === 'error' ? 'alert-circle' : 'check'} size={18} />
            <span className="text-sm font-bold">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* VIEW 0: LANDING PAGE HÍBRIDA (CONFIANÇA + SERVIÇOS) */}
      {/* ============================================================================== */}
      {step === 0 && (
        <main className="max-w-2xl mx-auto px-5 pt-8 sm:pt-12 animate-fade-in">
          
          <header className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 mb-5 overflow-hidden shadow-lg">
               <img src="https://i.ibb.co/gZxp3Dwz/Screenshot-1.png" alt="Thalyson" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
              Beleza. Toda sessão dura entre 40 e 60 minutos...
            </h1>
            <p className="text-zinc-300 text-[15px] leading-relaxed">
              ...e sempre começa tirando a dor e o peso do seu corpo.<br/>
              <strong className="text-white mt-2 block">Depois, você escolhe o estilo:</strong>
            </p>
          </header>

          <div className="space-y-4 mb-12">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => { setSelectedServiceId(s.id); setStep(1); window.scrollTo(0,0); vibrate(30); }}
                className="w-full text-left p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden bg-[#181c25] border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800/80 group"
              >
                {s.popular && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                    A Mais Pedida
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-zinc-900 border border-zinc-700 text-zinc-400 group-hover:bg-blue-900/30 group-hover:text-blue-400 group-hover:border-blue-500/30">
                    <Icon name={s.icon} size={24} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{s.title}</h3>
                      <span className="font-bold text-zinc-300">{formatMoney(s.price)}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {s.desc.split('(').map((part, i) => i === 0 ? part : <span key={i} className="opacity-60">({part}</span>)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* SOCIAL PROOF (REVIEWS) */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="star" size={20} className="text-amber-400" /> O que dizem sobre o encontro
            </h2>
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 -mx-5 px-5">
              {REVIEWS.map((r, i) => (
                <article key={i} className="snap-center shrink-0 w-[280px] p-5 rounded-3xl bg-[#181c25] border border-zinc-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 shrink-0">{r.n.charAt(0)}</div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{r.n}</h4>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{r.serv}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 italic">"{r.t}"</p>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ E REGRAS */}
          <section className="mb-10 p-6 rounded-3xl bg-[#181c25] border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-2">Tire suas dúvidas</h2>
            <p className="text-sm text-zinc-400 mb-4">Transparência total antes de agendar.</p>
            <div className="divide-y divide-zinc-800">
              {FAQ.map((f, i) => <Accordion key={i} title={f.q} content={f.a} />)}
            </div>
          </section>

        </main>
      )}

      {/* ============================================================================== */}
      {/* VIEW 1: CHECKOUT VERTICAL FOCADO */}
      {/* ============================================================================== */}
      {step === 1 && selectedService && (
        <div className="max-w-xl mx-auto px-5 pt-6 animate-slide-up space-y-6">
          
          <button onClick={() => setStep(0)} className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-colors mb-4">
            <Icon name="chevron-left" size={16} /> Voltar para o menu
          </button>

          {/* RESUMO DO SERVIÇO SELECIONADO */}
          <div className="p-5 rounded-3xl bg-blue-900/10 border border-blue-900/30 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-blue-400 uppercase font-bold tracking-widest mb-1">Selecionado</p>
              <h2 className="text-xl font-bold text-white">{selectedService.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-blue-400">{formatMoney(selectedService.price)}</span>
            </div>
          </div>

          {/* SEÇÃO 1: QUEM E ONDE */}
          <section className="p-6 rounded-3xl bg-[#181c25] border border-zinc-800 space-y-5">
            <h3 className="font-bold text-white flex items-center gap-2"><Icon name="user" size={18} className="text-zinc-500" /> Quem e Onde?</h3>
            <InputField label="Seu Nome" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Como devo te chamar?" icon="user" />
            
            <div className="pt-2">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Local do Encontro</label>
              <div className="grid grid-cols-3 gap-2">
                {[ { id: 'home', label: 'Sua Casa' }, { id: 'motel', label: 'Minha Suíte' }, { id: 'hotel', label: 'Hotel' } ].map(x => (
                  <button key={x.id} onClick={() => setLocationType(x.id as any)} className={`py-3 rounded-xl text-xs font-bold border transition-colors ${locationType === x.id ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'}`}>
                    {x.label}
                  </button>
                ))}
              </div>
            </div>

            {locationType !== 'motel' && (
              <div className="animate-fade-in pt-2">
                <InputField label="Endereço Completo" value={address} onChange={(e: any) => setAddress(e.target.value)} placeholder="Rua, Número, Bairro..." icon="map-pin" />
                <p className="text-[10px] text-amber-500 mt-2 font-bold uppercase tracking-widest flex items-center gap-1.5"><Icon name="alert-circle" size={14} /> Taxa de Uber confirmada no WhatsApp.</p>
              </div>
            )}
          </section>

          {/* SEÇÃO 2: QUANDO */}
          <section className="p-6 rounded-3xl bg-[#181c25] border border-zinc-800 space-y-5">
            <h3 className="font-bold text-white flex items-center gap-2"><Icon name="calendar" size={18} className="text-zinc-500" /> Data e Horário</h3>
            
            <div className="flex gap-2 overflow-x-auto snap-x py-1 scrollbar-hide -mx-2 px-2">
              {daysArray.map((d, idx) => {
                const isSel = date?.toDateString() === d.toDateString();
                return (
                  <button key={idx} onClick={() => { setDate(d); setTime(null); vibrate(30); }} className={`snap-center shrink-0 w-16 py-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${isSel ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                    <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.','')}</span>
                    <span className="text-lg font-bold leading-none">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            {date && (
              <div className="grid grid-cols-4 gap-2 pt-3 animate-fade-in">
                {timeSlots.map(t => {
                  const isRushSlot = RUSH_HOURS.includes(t) && locationType !== 'motel';
                  const isSel = time === t;
                  return (
                    <button key={t} onClick={() => { setTime(t); vibrate(30); }} className={`py-3 rounded-xl text-sm font-bold border transition-colors flex flex-col items-center ${isSel ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-300'}`}>
                      {t}
                      {isRushSlot && <span className={`text-[8px] font-bold uppercase mt-0.5 ${isSel ? 'text-blue-200' : 'text-amber-500'}`}>+R$15</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </section>

          {/* SEÇÃO 3: EXTRAS E CUPONS */}
          <section className="p-6 rounded-3xl bg-[#181c25] border border-zinc-800 space-y-6">
            <div>
              <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Icon name="sparkles" size={18} className="text-zinc-500" /> Toques Adicionais</h3>
              <div className="space-y-2">
                {EXTRAS.map(ex => {
                  const isActive = activeExtras[ex.id];
                  return (
                    <button key={ex.id} onClick={() => setActiveExtras(p => ({ ...p, [ex.id]: !p[ex.id] }))} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-colors ${isActive ? 'bg-blue-900/20 border-blue-800' : 'bg-zinc-900 border-zinc-800'}`}>
                      <div className="text-left">
                        <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-zinc-300'}`}>{ex.label}</p>
                        <p className="text-xs text-zinc-500">{ex.desc}</p>
                      </div>
                      <span className={`text-sm font-bold ${isActive ? 'text-blue-400' : 'text-zinc-500'}`}>+{formatMoney(ex.price)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
              <h3 className="font-bold text-white flex items-center gap-2 mb-4"><Icon name="gift" size={18} className="text-zinc-500" /> Benefícios</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código do cupom"
                  value={manualCoupon}
                  onChange={(e) => setManualCoupon(e.target.value.toUpperCase())}
                  className="flex-1 h-12 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-sm text-white focus:border-blue-500 outline-none"
                />
                <button onClick={handleApplyCoupon} className="h-12 px-6 rounded-xl bg-zinc-800 text-white font-bold text-sm border border-zinc-700 hover:bg-zinc-700 transition-colors">
                  Aplicar
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-emerald-900/20 border border-emerald-800">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{appliedCoupon.code} APLICADO</span>
                  <button onClick={() => setAppliedCoupon(null)} className="text-zinc-400 hover:text-white"><Icon name="refresh-cw" size={14}/></button>
                </div>
              )}
            </div>
          </section>

          {/* SEÇÃO 4: RESUMO E PAGAMENTO */}
          <section className="p-6 rounded-3xl bg-[#181c25] border border-zinc-800 space-y-6 mb-8">
            <h3 className="font-bold text-white flex items-center gap-2"><Icon name="shield" size={18} className="text-zinc-500" /> Resumo e Pagamento</h3>
            
            <div className="space-y-2 text-sm text-zinc-300 pb-4 border-b border-zinc-800">
              <div className="flex justify-between"><span>Subtotal ({selectedService.title})</span> <span>{formatMoney(selectedService.price)}</span></div>
              {Object.keys(activeExtras).filter(k => activeExtras[k]).map(k => {
                const ex = EXTRAS.find(e => e.id === k);
                return ex ? <div key={k} className="flex justify-between"><span>{ex.label}</span> <span>+{formatMoney(ex.price)}</span></div> : null;
              })}
              {appliedCoupon && <div className="flex justify-between text-emerald-400 font-bold"><span>Desconto Aplicado</span> <span>- {appliedCoupon.discount * 100}%</span></div>}
              {isRush && <div className="flex justify-between text-amber-500 font-bold"><span>Taxa de Horário de Pico</span> <span>+{formatMoney(RUSH_FEE)}</span></div>}
              <div className="flex justify-between text-lg font-bold text-white pt-2 mt-2 border-t border-zinc-800">
                <span>Total Estimado</span> <span className="text-blue-400">{formatMoney(calculateTotal())}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Pagamento no Local via:</label>
              <div className="grid grid-cols-3 gap-2">
                {['pix', 'card', 'money'].map(p => (
                  <button key={p} onClick={() => setPayment(p as any)} className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${payment === p ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                    {p === 'money' ? 'Dinheiro' : p === 'card' ? 'Cartão' : 'Pix'}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleFinish}
              className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#22c55e] text-white p-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-green-900/20"
            >
              <Icon name="message-circle" size={24} />
              Enviar Reserva no WhatsApp
            </button>
            <p className="text-[10px] text-center text-zinc-500 uppercase font-bold tracking-widest">Ao agendar, você concorda com nossos termos de respeito mútuo.</p>
          </section>

        </div>
      )}
    </div>
  );
}
