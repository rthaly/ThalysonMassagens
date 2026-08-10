import React, { useState, useMemo, memo, useRef, useEffect } from 'react';

// ==================================================================================
// 1. CONFIGURAÇÕES E ÍCONES
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
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
  'message-circle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  'bed': 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
  'building': 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  'chevron-down': 'M6 9l6 6 6-6',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'calendar-plus': 'M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8 M16 2v4 M8 2v4 M3 10h18 M19 16v6 M16 19h6',
};

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 30) => { try { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); } catch (e) { } };

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
  { n: "Gustavo", loc: "Bela Vista - SP", t: "O Thalyson chegou na hora certa. Mãos com técnica sem igual, o alívio foi imediato. Levantei parecendo mais leve.", serv: "Experiência Fusion" },
  { n: "Lucas", loc: "Londrina", t: "A discrição era minha prioridade e fui atendido com total sigilo. A massagem me permitiu redescobrir meu próprio corpo.", serv: "Massagem Nuru" },
  { n: "Ricardo", loc: "Fernandópolis", t: "Encontrei um profissionalismo raro. Me senti à vontade para soltar minhas travas. Saí me sentindo incrivelmente leve.", serv: "Massagem Reversa" }
];

const FAQ = [
  { q: "Como a finalização funciona na prática?", a: "Tudo é conduzido com muito respeito ao seu tempo e corpo. O objetivo é criar um espaço seguro para você se soltar totalmente e chegar a um relaxamento intenso." },
  { q: "Onde nós vamos nos encontrar?", a: "Eu vou até você para o seu conforto. Pode ser na sua residência ou em um hotel. Eu levo o necessário para transformar o ambiente." },
  { q: "A higiene é garantida?", a: "Absolutamente. Utilizo apenas materiais higienizados, descartáveis quando necessário, e óleos de alta qualidade. O banho prévio é uma regra para ambos." }
];

// ==================================================================================
// 3. COMPONENTES REUTILIZÁVEIS
// ==================================================================================
const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', maxLength, error }: any) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 pl-1">{label}</label>}
    <div className="relative group">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400' : 'text-zinc-500 group-focus-within:text-blue-400'}`}><Icon name={icon} size={18} /></div>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
        className={`w-full min-h-[52px] rounded-xl text-sm transition-all border outline-none bg-zinc-900/50 placeholder:text-zinc-600 focus:bg-zinc-800 ${icon ? 'pl-11 pr-4' : 'px-4'} ${error ? 'border-red-500/50 text-red-400 focus:border-red-500' : 'border-zinc-800 text-white focus:border-blue-500'}`}
      />
    </div>
  </div>
));

const Accordion = memo(({ title, content }: { title: string; content: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-zinc-800/50 last:border-0">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-center justify-between text-left gap-4 outline-none">
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
  const [view, setView] = useState<'landing' | 'success'>('landing');
  
  // Estado do Checkout
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [locationType, setLocationType] = useState<'home' | 'motel' | 'hotel'>('home');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [payment, setPayment] = useState<'pix' | 'card' | 'money' | null>(null);
  const [activeExtras, setActiveExtras] = useState<Record<string, boolean>>({});
  
  // Cupons & UI
  const [manualCoupon, setManualCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const formRef = useRef<HTMLDivElement>(null);

  const selectedService = SERVICES.find(s => s.id === selectedServiceId);
  const isRush = time ? RUSH_HOURS.includes(time) && locationType !== 'motel' : false;

  // Rola suavemente para o formulário ao selecionar um serviço
  useEffect(() => {
    if (selectedServiceId && formRef.current) {
      setTimeout(() => {
        const y = formRef.current!.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    }
  }, [selectedServiceId]);

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApplyCoupon = () => {
    if (manualCoupon.toUpperCase() === 'RETORNO10') {
      setAppliedCoupon({ code: 'RETORNO10', discount: 0.10 });
      showToast('Benefício ativado com sucesso!');
      setManualCoupon('');
    } else {
      showToast('Código inválido ou expirado.', 'error');
    }
  };

  const calculateTotal = () => {
    if (!selectedService) return 0;
    let sub = selectedService.price;
    EXTRAS.forEach(ex => { if (activeExtras[ex.id]) sub += ex.price; });
    const discountAmount = appliedCoupon ? (sub * appliedCoupon.discount) : 0;
    return (sub - discountAmount) + (isRush ? RUSH_FEE : 0);
  };

  const handleCheckoutSubmit = () => {
    const newErrors = [];
    if (!name) newErrors.push('name');
    if (!date) newErrors.push('date');
    if (!time) newErrors.push('time');
    if (locationType !== 'motel' && !address) newErrors.push('address');
    if (!payment) newErrors.push('payment');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      showToast("Preencha todos os campos obrigatórios.", "error");
      vibrate([50, 50]);
      return;
    }
    
    setErrors([]);
    vibrate(30);
    setView('success');
    window.scrollTo(0,0);
  };

  const generateWhatsAppMsg = () => {
    if (!selectedService || !name || !time || !date) return '';
    const dateStr = date.toLocaleDateString('pt-BR');
    const locText = locationType === 'motel' ? 'Sua Suíte' : address;
    const extrasText = Object.keys(activeExtras).filter(k => activeExtras[k]).map(k => EXTRAS.find(e => e.id === k)?.label).join(', ');

    return `*Pedido de Reserva*\n──────────────────\nOlá Thalyson, quero agendar meu momento.\n\n👤 *Nome:* ${name}\n💆‍♂️ *Experiência:* ${selectedService.title}\n📅 *Quando:* ${dateStr} às ${time}\n📍 *Onde:* ${locText}\n${extrasText ? `✨ *Extras:* ${extrasText}\n` : ''}\n💳 *Pagamento:* ${payment?.toUpperCase()}\n💰 *Total:* ${formatMoney(calculateTotal())}\n${appliedCoupon ? `🎟 *Benefício:* ${appliedCoupon.code}\n` : ''}──────────────────`;
  };

  const generateGoogleCalendarLink = () => {
    if (!date || !time || !selectedService) return '#';
    const [hours, minutes] = time.split(':');
    
    const start = new Date(date);
    start.setHours(parseInt(hours), parseInt(minutos), 0);
    
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');
    
    const title = encodeURIComponent(`Sessão: ${selectedService.title}`);
    const details = encodeURIComponent(`Sessão agendada com Thalyson.\nValor: ${formatMoney(calculateTotal())}\nPagamento: ${payment}`);
    const loc = encodeURIComponent(locationType === 'motel' ? 'Sua Suíte' : address);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${format(start)}/${format(end)}&details=${details}&location=${loc}`;
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
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-200 font-sans selection:bg-blue-500/30">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-tap-highlight-color: transparent; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease forwards; }
        .animate-slide-up { animation: slideUp 0.5s ease forwards; }
      `}} />

      {/* TOAST */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] animate-fade-in w-[90%] max-w-sm">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-xl ${toast.type === 'error' ? 'bg-red-950/90 border-red-500/30 text-red-100' : 'bg-emerald-950/90 border-emerald-500/30 text-emerald-100'}`}>
            <Icon name={toast.type === 'error' ? 'alert-circle' : 'check'} size={20} className={toast.type === 'error' ? 'text-red-400' : 'text-emerald-400'} />
            <span className="text-sm font-bold">{toast.msg}</span>
          </div>
        </div>
      )}

      {/* ============================================================================== */}
      {/* VIEW: LANDING & CHECKOUT (VERTICAL FLOW) */}
      {/* ============================================================================== */}
      {view === 'landing' && (
        <>
          {/* NAV HEADER */}
          <nav className="border-b border-zinc-900 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-2xl mx-auto px-5 h-16 flex items-center justify-between">
              <span className="font-extrabold text-lg tracking-tight text-white">Thalyson.</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Agenda Aberta
              </span>
            </div>
          </nav>

          <main className="max-w-2xl mx-auto px-5 pt-10 pb-24">
            
            {/* HERO SECTION */}
            <header className="mb-12 text-left animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-[1.15] tracking-tight">
                Beleza. Toda sessão dura entre 40 e 60 minutos...
              </h1>
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
                ...e sempre começa tirando a dor e o peso do seu corpo.<br/>
                <strong className="text-white mt-3 block font-bold">Depois, você escolhe o estilo abaixo:</strong>
              </p>
            </header>

            {/* SERVICES */}
            <div className="space-y-4 mb-16 animate-slide-up" style={{animationDelay: '0.1s'}}>
              {SERVICES.map((s) => {
                const isSelected = selectedServiceId === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedServiceId(s.id); vibrate(30); }}
                    className={`w-full text-left p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-blue-900/10 border-blue-500 ring-1 ring-blue-500 shadow-[0_8px_30px_rgba(59,130,246,0.1)]' 
                        : 'bg-zinc-900/30 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/80'
                    }`}
                  >
                    {s.popular && (
                      <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-2xl">
                        A Mais Pedida
                      </span>
                    )}
                    <div className="flex items-start gap-4">
                      <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 text-white' : 'bg-zinc-800 border border-zinc-700 text-zinc-400 group-hover:text-zinc-200'}`}>
                        <Icon name={s.icon} size={24} />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex items-baseline justify-between mb-1.5">
                          <h3 className={`text-lg font-bold tracking-tight ${isSelected ? 'text-white' : 'text-zinc-100 group-hover:text-white'}`}>{s.title}</h3>
                          <span className={`font-bold ${isSelected ? 'text-blue-400' : 'text-zinc-400'}`}>{formatMoney(s.price)}</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${isSelected ? 'text-blue-100/80' : 'text-zinc-500'}`}>
                          {s.desc.split('(').map((part, i) => i === 0 ? part : <span key={i} className="opacity-60">({part}</span>)}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* THE VERTICAL CHECKOUT FORM */}
            <div ref={formRef}>
              {selectedServiceId && (
                <div className="animate-slide-up space-y-8 pb-16">
                  <div className="flex items-center gap-4 py-4">
                    <div className="h-px bg-zinc-800 flex-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Configurar Encontro</span>
                    <div className="h-px bg-zinc-800 flex-1" />
                  </div>
                  
                  {/* STEP 1: QUEM E ONDE */}
                  <section className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400"><Icon name="user" size={16} /></div>
                      <h3 className="font-bold text-white text-lg">Seus Dados</h3>
                    </div>
                    
                    <InputField label="Nome ou Apelido" value={name} onChange={(e: any) => setName(e.target.value)} icon="user" placeholder="Como devo te chamar?" error={errors.includes('name')} />
                    
                    <div className="pt-2">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Onde será o encontro?</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[ { id: 'home', label: 'Sua Casa' }, { id: 'motel', label: 'Suíte' }, { id: 'hotel', label: 'Hotel' } ].map(x => (
                          <button key={x.id} onClick={() => setLocationType(x.id as any)} className={`py-3 rounded-2xl text-xs font-bold border transition-all ${locationType === x.id ? 'bg-zinc-100 border-zinc-100 text-zinc-900' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}>
                            {x.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {locationType !== 'motel' && (
                      <div className="animate-fade-in pt-2">
                        <InputField label="Endereço Completo" value={address} onChange={(e: any) => setAddress(e.target.value)} placeholder="Rua, Número, Bairro..." icon="map-pin" error={errors.includes('address')} />
                        <p className="text-[11px] font-medium text-amber-500/80 mt-3 flex items-center gap-1.5"><Icon name="alert-circle" size={14} /> Taxa de deslocamento combinada no WhatsApp.</p>
                      </div>
                    )}
                  </section>

                  {/* STEP 2: QUANDO */}
                  <section className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400"><Icon name="calendar" size={16} /></div>
                      <h3 className="font-bold text-white text-lg">Data e Horário</h3>
                    </div>
                    
                    <div className={`flex gap-3 overflow-x-auto snap-x py-1 scrollbar-hide -mx-2 px-2 ${errors.includes('date') ? 'ring-1 ring-red-500/50 rounded-2xl' : ''}`}>
                      {daysArray.map((d, idx) => {
                        const isSel = date?.toDateString() === d.toDateString();
                        return (
                          <button key={idx} onClick={() => { setDate(d); setTime(null); vibrate(30); }} className={`snap-center shrink-0 w-20 py-4 rounded-2xl flex flex-col items-center gap-1 border transition-all ${isSel ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800'}`}>
                            <span className="text-[10px] uppercase font-bold tracking-widest">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.','')}</span>
                            <span className="text-2xl font-bold leading-none">{d.getDate()}</span>
                          </button>
                        );
                      })}
                    </div>

                    {date && (
                      <div className="grid grid-cols-4 gap-3 pt-4 animate-slide-up">
                        {timeSlots.map(t => {
                          const isRushSlot = RUSH_HOURS.includes(t) && locationType !== 'motel';
                          const isSel = time === t;
                          return (
                            <button key={t} onClick={() => { setTime(t); vibrate(30); }} className={`py-3.5 rounded-2xl text-sm font-bold border transition-all relative flex flex-col items-center ${isSel ? 'bg-blue-600 border-blue-500 text-white' : errors.includes('time') ? 'bg-red-950/20 border-red-900/50 text-red-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800'}`}>
                              {t}
                              {isRushSlot && <span className={`text-[8px] font-bold uppercase tracking-widest mt-1 ${isSel ? 'text-blue-200' : 'text-amber-500/80'}`}>+R$15</span>}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </section>

                  {/* STEP 3: EXTRAS E CUPOM */}
                  <section className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 space-y-8">
                    <div>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400"><Icon name="sparkles" size={16} /></div>
                        <h3 className="font-bold text-white text-lg">Deseja adicionar extras?</h3>
                      </div>
                      <div className="space-y-3">
                        {EXTRAS.map(ex => {
                          const isActive = activeExtras[ex.id];
                          return (
                            <button key={ex.id} onClick={() => setActiveExtras(p => ({ ...p, [ex.id]: !p[ex.id] }))} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all outline-none ${isActive ? 'bg-blue-900/10 border-blue-500 ring-1 ring-blue-500' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800'}`}>
                              <div className="text-left">
                                <p className={`text-sm font-bold ${isActive ? 'text-white' : 'text-zinc-300'}`}>{ex.label}</p>
                                <p className="text-xs text-zinc-500 mt-0.5">{ex.desc}</p>
                              </div>
                              <span className={`text-sm font-bold ${isActive ? 'text-blue-400' : 'text-zinc-500'}`}>+{formatMoney(ex.price)}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-zinc-800/50">
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Possui Cupom?</label>
                      <div className="flex gap-2">
                        <input type="text" placeholder="Código" value={manualCoupon} onChange={(e) => setManualCoupon(e.target.value.toUpperCase())} className="flex-1 h-[52px] bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 text-sm font-bold text-white focus:border-blue-500 outline-none" />
                        <button onClick={handleApplyCoupon} className="h-[52px] px-6 rounded-xl bg-zinc-100 text-zinc-900 font-bold text-sm hover:bg-white transition-colors">
                          Aplicar
                        </button>
                      </div>
                      {appliedCoupon && (
                        <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-emerald-900/10 border border-emerald-900/50">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2"><Icon name="check" size={14}/> {appliedCoupon.code} APLICADO</span>
                          <button onClick={() => setAppliedCoupon(null)} className="text-zinc-500 hover:text-white"><Icon name="refresh-cw" size={14}/></button>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* STEP 4: PAGAMENTO E RESUMO */}
                  <section className="p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400"><Icon name="shield" size={16} /></div>
                      <h3 className="font-bold text-white text-lg">Resumo e Pagamento</h3>
                    </div>
                    
                    <div className="space-y-3 text-sm text-zinc-400 pb-5 border-b border-zinc-800/50">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Sessão {selectedService.title}</span> 
                        <span className="font-bold text-zinc-200">{formatMoney(selectedService.price)}</span>
                      </div>
                      {Object.keys(activeExtras).filter(k => activeExtras[k]).map(k => {
                        const ex = EXTRAS.find(e => e.id === k);
                        return ex ? <div key={k} className="flex justify-between items-center"><span className="font-medium">{ex.label}</span> <span className="font-bold text-zinc-200">+{formatMoney(ex.price)}</span></div> : null;
                      })}
                      {appliedCoupon && <div className="flex justify-between items-center text-emerald-400"><span className="font-bold">Desconto ({appliedCoupon.code})</span> <span className="font-bold">- {appliedCoupon.discount * 100}%</span></div>}
                      {isRush && <div className="flex justify-between items-center text-amber-500"><span className="font-bold">Taxa Horário de Pico</span> <span className="font-bold">+{formatMoney(RUSH_FEE)}</span></div>}
                      
                      <div className="flex justify-between items-center pt-4 mt-2">
                        <span className="text-xs uppercase font-bold tracking-widest text-zinc-500">Total Estimado</span> 
                        <span className="text-2xl font-bold text-white tracking-tight">{formatMoney(calculateTotal())}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Pagamento no Local via:</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['pix', 'card', 'money'].map(p => (
                          <button key={p} onClick={() => setPayment(p as any)} className={`py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all ${payment === p ? 'bg-zinc-100 text-zinc-900 border-zinc-100' : errors.includes('payment') ? 'bg-red-950/20 border-red-900/50 text-red-400' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}>
                            {p === 'money' ? 'Dinheiro' : p === 'card' ? 'Cartão' : 'Pix'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6">
                      <button 
                        onClick={handleCheckoutSubmit}
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white p-5 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-[0_8px_30px_rgba(37,99,235,0.2)]"
                      >
                        Avançar para Confirmação
                      </button>
                      <p className="text-[10px] text-center text-zinc-600 font-bold uppercase tracking-widest mt-4">Nenhum valor será cobrado agora.</p>
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* INSTITUCIONAL / AUTORIDADE */}
            {!selectedServiceId && (
              <div className="animate-fade-in space-y-16">
                
                {/* REVIEWS */}
                <section>
                  <div className="flex items-center gap-3 mb-6">
                    <Icon name="star" size={24} className="text-amber-400" />
                    <h2 className="text-2xl font-bold text-white tracking-tight">O que dizem</h2>
                  </div>
                  <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 -mx-5 px-5">
                    {REVIEWS.map((r, i) => (
                      <article key={i} className="snap-center shrink-0 w-[300px] p-6 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 shrink-0">{r.n.charAt(0)}</div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{r.n}</h4>
                              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{r.serv}</p>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-300 leading-relaxed italic">"{r.t}"</p>
                        </div>
                        <div className="flex gap-1 mt-4">
                          {[...Array(5)].map((_,idx) => <Icon key={idx} name="star" size={14} className="text-amber-400 fill-amber-400" />)}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* ABOUT / PRINCIPLES */}
                <section className="p-8 rounded-3xl bg-blue-950/20 border border-blue-900/30">
                  <h2 className="text-xl font-bold text-white mb-6 tracking-tight">Meus Princípios</h2>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-900/30 flex items-center justify-center text-blue-400 shrink-0"><Icon name="shield" size={20} /></div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Sigilo Absoluto</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">Sua privacidade é inegociável. Ambiente focado apenas no seu bem-estar, sem exposição.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-900/30 flex items-center justify-center text-blue-400 shrink-0"><Icon name="check" size={20} /></div>
                      <div>
                        <h4 className="font-bold text-white mb-1">Higiene e Respeito</h4>
                        <p className="text-sm text-zinc-400 leading-relaxed">Uso exclusivo de materiais limpos e descartáveis. Exijo banho prévio para garantir conforto mútuo.</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* FAQ */}
                <section>
                  <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Dúvidas Frequentes</h2>
                  <div className="rounded-3xl bg-zinc-900/30 border border-zinc-800/50 p-2 sm:p-4">
                    {FAQ.map((f, i) => <Accordion key={i} title={f.q} content={f.a} />)}
                  </div>
                </section>
                
                {/* FOOTER */}
                <footer className="pt-10 border-t border-zinc-900 text-center">
                  <h2 className="font-extrabold text-2xl tracking-tight text-white mb-2">Thalyson.</h2>
                  <p className="text-xs text-zinc-500 mb-6 uppercase font-bold tracking-widest">Massoterapia Profissional</p>
                  <div className="flex items-center justify-center gap-4 mb-10">
                    <button onClick={() => window.open(CONFIG.INSTAGRAM_URL)} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-pink-500 transition-colors"><Icon name="sparkles" size={18} /></button>
                  </div>
                  <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">© 2026 Thalyson Santos. SP, BR.</p>
                </footer>
              </div>
            )}
          </main>
        </>
      )}

      {/* ============================================================================== */}
      {/* VIEW: SUCCESS (WHATSAPP & CALENDAR) */}
      {/* ============================================================================== */}
      {view === 'success' && selectedService && (
        <main className="min-h-screen flex flex-col items-center justify-center px-5 py-12 animate-fade-in text-center relative overflow-hidden">
          {/* Fundo decorativo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-md w-full">
            <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
              <Icon name="check" size={40} className="text-emerald-400" />
            </div>
            
            <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Pedido Montado!</h1>
            <p className="text-zinc-400 text-base mb-10 leading-relaxed">
              Falta apenas um passo. Me envie os dados no WhatsApp para eu confirmar sua reserva na agenda.
            </p>

            <div className="space-y-4 w-full">
              {/* PRIMARY ACTION: WHATSAPP */}
              <button 
                onClick={() => window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(generateWhatsAppMsg())}`, '_blank')}
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#22c55e] text-white p-5 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-[0_10px_40px_rgba(37,211,102,0.3)]"
              >
                <Icon name="message-circle" size={24} />
                Confirmar no WhatsApp
              </button>

              {/* SECONDARY ACTION: ADD TO CALENDAR */}
              <button 
                onClick={() => window.open(generateGoogleCalendarLink(), '_blank')}
                className="w-full flex items-center justify-center gap-3 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white p-5 rounded-2xl font-bold text-base transition-all"
              >
                <Icon name="calendar-plus" size={20} className="text-blue-400" />
                Salvar no Google Agenda
              </button>
            </div>

            <button 
              onClick={() => { setView('landing'); window.scrollTo(0,0); }} 
              className="mt-10 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        </main>
      )}

    </div>
  );
}
