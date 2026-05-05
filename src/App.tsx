import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 0. DESIGN SYSTEM & TIPOGRAFIA (PREMIUM, MINIMALISTA, ZERO EMOJIS)
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v27_premium',
  PIX_KEY: "62.922.530/0001-14", 
  START_HOUR: 8,
  END_HOUR: 22, 
  BASE_LOCATION: 'Bela Vista, SP'
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const RUSH_FEE = 20; 

const ICON_PATHS: Record<string, string> = {
  'menu': 'M4 12h16 M4 6h16 M4 18h16', 'chevron-left': 'M15 18l-6-6 6-6', 'chevron-right': 'M9 18l6-6-6-6',
  'chevron-down': 'M6 9l6 6 6-6', 'x': 'M18 6L6 18M6 6l12 12', 'check': 'M20 6L9 17l-5-5',
  'alert': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', 'sun': 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', 'package': 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  'user': 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', 'building': 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'calendar': 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  'credit-card': 'M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'plus': 'M12 5v14 M5 12h14', 'wind': 'M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2'
};

const GlobalStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    
    :root {
      --bg-dark: #0a0a0c;
      --surface-dark: #121214;
      --border-dark: #27272a;
      --text-main: #f4f4f5;
      --text-muted: #a1a1aa;
      --accent: #3b82f6;
    }

    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    
    html, body {
      background-color: var(--bg-dark); 
      color: var(--text-main);
      font-family: 'Plus Jakarta Sans', sans-serif;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    h1, h2, h3, h4, .font-playfair { font-family: 'Playfair Display', serif; }
    
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `}} />
));

const Icon = memo(({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;

// ==================================================================================
// 1. CONTEÚDO PROFISSIONAL E COPY ACOLHEDORA
// ==================================================================================
const DATA = {
  services: [
    { id: 'relaxante', category: 'relax', min: 60, price: 157, icon: "wind", tag: "Alívio Muscular", title: "Massagem Clássica", desc: "Técnica focada em desfazer nós de tensão e aliviar o peso da rotina pesada. Pressão ajustada ao seu limite.", details: "Foco no relaxamento total do corpo.\nSem toques íntimos." },
    { id: 'desportiva', category: 'relax', min: 60, price: 187, icon: "zap", tag: "Recuperação", title: "Massagem Desportiva", desc: "Liberação miofascial profunda com pegada firme. Ideal para quem treina ou acumula muita tensão física.", details: "Foco em áreas de dor agudas.\nToque preciso e anatômico." },
    { id: 'sensitiva', category: 'sensory', min: 60, price: 177, icon: "moon", tag: "Descompressão Mental", title: "Massagem Sensorial", desc: "A sessão é construída como uma jornada. Toques muito sutis projetados para baixar a frequência do seu cérebro e combater a ansiedade.", details: "Ritmo lento e envolvente.\nFoco no relaxamento mental e sensitivo." },
    { id: 'nuru', category: 'sensory', min: 60, price: 317, icon: "star", popular: true, tag: "Experiência Completa", title: "Massagem Nuru", desc: "A entrega definitiva. Deslizamento corporal completo utilizando gel específico para uma experiência fluida e sem atritos.", details: "Jornada intensa e imersiva.\nRequer ducha prévia obrigatória." },
    { id: 'depilacao', category: 'aesthetics', min: 40, price: 107, icon: "scissors", tag: "Estética", title: "Aparo Corporal", desc: "Manutenção estética corporal utilizando máquina profissional. Fique com o corpo limpo e preparado para a semana.", details: "Aparo na zero ou pente 3.\n(Atenção: Este serviço é estético, não inclui massagem)." }
  ],
  packs: [
    { id: 'pack_essencial', type: 'pack', title: "Plano Sobrevivência (2x)", price: 297, fullPrice: 334, desc: "Sessões agendadas para garantir o seu equilíbrio durante o mês.", details: "1x Clássica\n1x Sensorial", tag: "Custo-Benefício", icon: "calendar" },
    { id: 'pack_premium', type: 'pack', title: "Assinatura Executiva (3x)", price: 637, fullPrice: 721, desc: "O nível máximo de cuidado com três encontros estruturados para sua saúde física e mental.", details: "1x Desportiva\n1x Sensorial\n1x Nuru", tag: "Premium", icon: "shield" }
  ],
  faq: [
    { q: "Onde o atendimento é realizado?", a: `Vou até a sua residência ou hotel. Se preferir, possuo uma base de apoio discreta na região da ${CONFIG.BASE_LOCATION}.` },
    { q: "Como devo me preparar?", a: "Uma ducha prévia é obrigatória para ambas as partes. Além disso, reserve um ambiente tranquilo." }
  ]
};

// ==================================================================================
// 2. COMPONENTES DE UI
// ==================================================================================
const Button = memo(({ children, onClick, disabled = false, full = false, variant = 'primary', icon }: any) => {
  const styles = {
    primary: "bg-white text-black hover:bg-zinc-200",
    secondary: "bg-[#18181b] border border-[#27272a] text-white hover:bg-[#27272a]",
    accent: "bg-blue-600 text-white hover:bg-blue-500"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`flex items-center justify-center gap-2 h-14 px-8 font-medium tracking-wide transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant as keyof typeof styles]} ${full ? 'w-full' : ''}`}>
      {icon && <Icon name={icon} size={18} />} {children}
    </button>
  );
});

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text" }: any) => (
  <div className="space-y-2 w-full">
    {label && <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 pl-1">{label}</label>}
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors"><Icon name={icon} size={18} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-14 rounded-xl outline-none text-sm transition-all bg-[#121214] border border-[#27272a] text-white placeholder:text-zinc-600 focus:border-zinc-400 focus:bg-[#18181b] ${icon ? 'pl-11 pr-4' : 'px-4'}`} />
    </div>
  </div>
));

const ServiceCard = memo(({ service, active, onClick }: any) => (
  <div onClick={onClick} className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${active ? 'bg-[#18181b] border-white' : 'bg-[#121214] border-[#27272a] hover:border-zinc-500'}`}>
    {service.popular && <div className="absolute -top-3 left-6 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Recomendado</div>}
    {active && <div className="absolute top-6 right-6 text-black bg-white w-6 h-6 rounded-full flex items-center justify-center"><Icon name="check" size={14} /></div>}
    
    <div className="flex items-start gap-4 mb-4">
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl shrink-0 ${active ? 'bg-white text-black' : 'bg-[#18181b] text-zinc-400 border border-[#27272a]'}`}>
        <Icon name={service.icon} size={24} />
      </div>
      <div className="pt-1 pr-6">
        <h3 className="text-lg font-playfair font-medium text-white mb-1">{service.title}</h3>
        <span className="text-xl font-medium text-white">{formatMoney(service.price)}</span>
      </div>
    </div>
    
    <p className="text-sm text-zinc-400 font-light leading-relaxed mb-4">{service.desc}</p>
    
    <div className="pt-4 border-t border-[#27272a]">
      <div className="text-[11px] text-zinc-500 space-y-1.5">
        {service.details.split('\n').map((line: string, i: number) => (
          <p key={i} className="flex items-start gap-2"><span className="text-zinc-600">•</span> {line}</p>
        ))}
      </div>
    </div>
  </div>
));

// ==================================================================================
// 3. FLUXO PRINCIPAL DE AGENDAMENTO
// ==================================================================================
export default function BookingFlow() {
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('relax');
  
  const [form, setForm] = useState({
    name: '',
    locationType: 'home',
    address: { street: '', number: '', district: '', comp: '' },
    date: null as Date | null,
    time: '',
    payment: 'pix'
  });

  const toggleCart = (item: any) => {
    setCart(prev => prev.some(c => c.id === item.id) ? prev.filter(c => c.id !== item.id) : [...prev, item]);
  };

  const getSubtotal = () => cart.reduce((acc, item) => acc + item.price, 0);
  const getTotal = () => {
    let total = getSubtotal();
    if (RUSH_HOURS.includes(form.time) && form.locationType !== 'suite') total += RUSH_FEE;
    if (form.payment === 'pix') total = total * 0.97; // 3% OFF
    return total;
  };

  const generateDates = () => {
    const dates = []; const today = new Date();
    for (let i = 0; i < 14; i++) { const d = new Date(today); d.setDate(today.getDate() + i); dates.push(d); }
    return dates;
  };

  const times = []; for(let i=CONFIG.START_HOUR; i<=CONFIG.END_HOUR; i++) times.push(`${i}:00`);

  const generateWhatsAppMessage = () => {
    const dStr = form.date ? form.date.toLocaleDateString('pt-BR') : '';
    const itemsStr = cart.map(i => `• ${i.title}`).join('\n');
    const locStr = form.locationType === 'suite' ? `Sua suíte na ${CONFIG.BASE_LOCATION}` : `${form.address.street}, ${form.address.number} - ${form.address.district}`;
    
    const msg = `*Reserva de Horário*\n\n` +
      `*Nome:* ${form.name}\n` +
      `*Data:* ${dStr} às ${form.time}\n` +
      `*Serviços:*\n${itemsStr}\n\n` +
      `*Local:* ${locStr}\n` +
      `*Pagamento:* ${form.payment.toUpperCase()} (${formatMoney(getTotal())})`;
      
    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`;
  };

  const isStepValid = () => {
    if (step === 0) return cart.length > 0;
    if (step === 1) {
      if (form.name.length < 3) return false;
      if (form.locationType === 'home') return !!(form.address.street && form.address.number && form.address.district);
      return true;
    }
    if (step === 2) return !!(form.date && form.time);
    return true;
  };

  return (
    <>
      <GlobalStyles />
      <div className="min-h-screen bg-[var(--bg-dark)] pb-32 font-sans text-zinc-200">
        
        {/* Header Premium */}
        <header className="pt-12 pb-8 px-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <img src="https://ui-avatars.com/api/?name=Thalyson&background=18181b&color=fff&size=120" alt="Thalyson" className="w-14 h-14 rounded-full border border-zinc-800" />
            <div>
              <h1 className="text-2xl font-playfair font-medium text-white tracking-tight">Thalyson Rodrigo</h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mt-1">Terapia Corporal & Bem-estar</p>
            </div>
          </div>
          
          {/* Barra de Progresso Sutíl */}
          <div className="flex gap-2 h-1">
            {[0,1,2,3].map(i => (
              <div key={i} className={`flex-1 rounded-full transition-colors duration-500 ${step >= i ? 'bg-white' : 'bg-[#27272a]'}`} />
            ))}
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6">
          
          {/* PASSO 0: Seleção de Serviços */}
          {step === 0 && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h2 className="text-3xl font-playfair text-white mb-3">Como você quer ser cuidado hoje?</h2>
                <p className="text-zinc-400 font-light text-sm">Selecione as terapias ou planos que melhor atendem sua necessidade atual.</p>
              </div>

              {/* Categorias Tabs (Sem Emojis, design tipográfico) */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {[
                  { id: 'relax', label: 'Terapia Física' },
                  { id: 'sensory', label: 'Jornada Sensorial' },
                  { id: 'pack', label: 'Planos Mensais' },
                  { id: 'aesthetics', label: 'Estética Pessoal' }
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-white text-black' : 'bg-[#18181b] text-zinc-400 border border-[#27272a]'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {(activeTab === 'pack' ? DATA.packs : DATA.services.filter(s => s.category === activeTab)).map((item: any) => (
                  <ServiceCard key={item.id} service={item} active={cart.some(c => c.id === item.id)} onClick={() => toggleCart(item)} />
                ))}
              </div>
              
              {activeTab === 'aesthetics' && (
                 <p className="text-xs text-zinc-500 italic mt-4">* Os serviços de estética envolvem apenas o aparo dos pelos com máquina. Não constituem e não incluem massagem relaxante.</p>
              )}
            </div>
          )}

          {/* PASSO 1: Identificação e Local */}
          {step === 1 && (
            <div className="animate-fade-in space-y-8">
              <h2 className="text-3xl font-playfair text-white">Sobre o encontro</h2>
              
              <div className="space-y-6 bg-[#121214] p-6 rounded-2xl border border-[#27272a]">
                <InputField label="Como devo te chamar?" value={form.name} onChange={(e:any) => setForm({...form, name: e.target.value})} icon="user" placeholder="Seu nome" />
                
                <div className="pt-4">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 pl-1 block mb-3">Onde será o atendimento?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setForm({...form, locationType: 'home'})} className={`py-4 rounded-xl border flex gap-2 justify-center items-center text-sm transition-colors ${form.locationType === 'home' ? 'bg-white text-black border-white' : 'bg-transparent border-[#27272a] text-zinc-400 hover:border-zinc-500'}`}>
                      <Icon name="home" size={18} /> Sua Residência
                    </button>
                    <button onClick={() => setForm({...form, locationType: 'suite'})} className={`py-4 rounded-xl border flex gap-2 justify-center items-center text-sm transition-colors ${form.locationType === 'suite' ? 'bg-white text-black border-white' : 'bg-transparent border-[#27272a] text-zinc-400 hover:border-zinc-500'}`}>
                      <Icon name="building" size={18} /> Minha Suíte
                    </button>
                  </div>
                </div>

                {form.locationType === 'home' ? (
                  <div className="space-y-4 pt-4 border-t border-[#27272a] animate-fade-in">
                     <InputField label="Endereço (Rua/Av)" value={form.address.street} onChange={(e:any) => setForm(f=>({...f, address: {...f.address, street: e.target.value}}))} placeholder="Nome da rua" />
                     <div className="grid grid-cols-2 gap-4">
                       <InputField label="Número" value={form.address.number} onChange={(e:any) => setForm(f=>({...f, address: {...f.address, number: e.target.value}}))} placeholder="Nº" />
                       <InputField label="Bairro" value={form.address.district} onChange={(e:any) => setForm(f=>({...f, address: {...f.address, district: e.target.value}}))} placeholder="Bairro" />
                     </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-[#27272a] animate-fade-in">
                    <p className="text-sm text-zinc-400 flex items-start gap-3 bg-[#18181b] p-4 rounded-xl">
                      <Icon name="map-pin" className="text-zinc-500 mt-0.5" size={16} />
                      O endereço exato da suíte na Bela Vista será fornecido via WhatsApp após a confirmação.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASSO 2: Data e Hora */}
          {step === 2 && (
            <div className="animate-fade-in space-y-8">
              <h2 className="text-3xl font-playfair text-white">Quando?</h2>
              
              <div className="bg-[#121214] p-6 rounded-2xl border border-[#27272a]">
                 <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 pl-1 block mb-4">Escolha a Data</label>
                 <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
                    {generateDates().map((d, i) => {
                      const isSel = form.date?.toDateString() === d.toDateString();
                      return (
                        <button key={i} onClick={() => setForm({...form, date: d, time: ''})} className={`shrink-0 w-[70px] h-[90px] rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${isSel ? 'bg-white border-white text-black' : 'bg-[#18181b] border-[#27272a] text-zinc-400 hover:border-zinc-500'}`}>
                          <span className="text-[10px] uppercase font-semibold">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).replace('.','')}</span>
                          <span className="text-2xl font-playfair">{d.getDate()}</span>
                        </button>
                      )
                    })}
                 </div>

                 {form.date && (
                   <div className="mt-8 animate-fade-in">
                     <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 pl-1 block mb-4">Escolha o Horário</label>
                     <div className="grid grid-cols-4 gap-3">
                       {times.map(t => {
                         const isRush = RUSH_HOURS.includes(t);
                         const isSel = form.time === t;
                         return (
                           <button key={t} onClick={() => setForm({...form, time: t})} className={`relative py-3 rounded-xl text-sm font-medium border transition-all ${isSel ? 'bg-white border-white text-black' : isRush ? 'bg-[#18181b] border-[#27272a] text-zinc-300' : 'bg-transparent border-[#27272a] text-zinc-400 hover:border-zinc-500'}`}>
                             {t}
                             {isRush && form.locationType !== 'suite' && <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-zinc-600 rounded-full border-2 border-[#121214]" title="Horário de Pico" />}
                           </button>
                         )
                       })}
                     </div>
                   </div>
                 )}
              </div>
            </div>
          )}

          {/* PASSO 3: Resumo e Pagamento */}
          {step === 3 && (
            <div className="animate-fade-in space-y-8">
              <h2 className="text-3xl font-playfair text-white">Resumo do Encontro</h2>
              
              <div className="bg-[#121214] p-6 rounded-2xl border border-[#27272a] space-y-6">
                
                {/* Resumo Itens */}
                <div className="space-y-4">
                  {cart.map((item, i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-[#27272a]">
                      <div>
                        <p className="font-playfair text-white text-lg">{item.title}</p>
                        <p className="text-xs text-zinc-500">{item.tag}</p>
                      </div>
                      <span className="text-white font-medium">{formatMoney(item.price)}</span>
                    </div>
                  ))}
                  
                  {RUSH_HOURS.includes(form.time) && form.locationType !== 'suite' && (
                    <div className="flex justify-between items-center pb-4 border-b border-[#27272a] text-sm text-zinc-400">
                      <span>Taxa de Deslocamento (Pico)</span>
                      <span>{formatMoney(RUSH_FEE)}</span>
                    </div>
                  )}
                </div>

                {/* Forma de Pagamento */}
                <div>
                   <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 pl-1 block mb-3">Forma de Pagamento (No Local)</label>
                   <div className="flex gap-3">
                     <button onClick={() => setForm({...form, payment: 'pix'})} className={`flex-1 py-3 border rounded-xl text-sm transition-colors ${form.payment === 'pix' ? 'bg-white text-black border-white' : 'border-[#27272a] text-zinc-400 hover:border-zinc-500'}`}>Pix (3% OFF)</button>
                     <button onClick={() => setForm({...form, payment: 'card'})} className={`flex-1 py-3 border rounded-xl text-sm transition-colors ${form.payment === 'card' ? 'bg-white text-black border-white' : 'border-[#27272a] text-zinc-400 hover:border-zinc-500'}`}>Cartão</button>
                   </div>
                </div>

                {/* Total */}
                <div className="pt-4 flex justify-between items-end">
                  <span className="text-zinc-500 text-sm">Valor Final</span>
                  <span className="text-3xl font-playfair text-white">{formatMoney(getTotal())}</span>
                </div>

                <div className="bg-[#18181b] p-4 rounded-xl border border-[#27272a] flex gap-3 items-start mt-4">
                  <Icon name="shield" className="text-zinc-500 shrink-0" size={18} />
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Ao prosseguir, você concorda com o respeito mútuo. Declara estar saudável para a prática corporal e ciente de que o serviço será prestado com profissionalismo.
                  </p>
                </div>

              </div>
            </div>
          )}

        </main>

        {/* Floating Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--bg-dark)] via-[var(--bg-dark)] to-transparent pointer-events-none">
          <div className="max-w-3xl mx-auto flex gap-4 pointer-events-auto">
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep(s=>s-1)} icon="chevron-left" />
            )}
            
            {step < 3 ? (
               <Button full disabled={!isStepValid()} onClick={() => setStep(s=>s+1)}>
                 Continuar
               </Button>
            ) : (
               <Button full variant="accent" onClick={() => window.open(generateWhatsAppMessage(), '_blank')}>
                 Confirmar Reserva no WhatsApp
               </Button>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
