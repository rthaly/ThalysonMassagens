import React, { useState, useEffect, useMemo, memo, useRef } from 'react';

// ==================================================================================
// CONFIG & ICONS
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
};

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 30) => { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) { } };

// ==================================================================================
// COPY E DADOS (ESTRATÉGIA)
// ==================================================================================
const SERVICES = [
  { id: 'classica', title: 'Clássica', price: 180, icon: 'hand', desc: 'Massagem com força para tirar a dor. Fico de roupa, você fica como achar melhor. Não tem toque nas partes íntimas.' },
  { id: 'sensorial', title: 'Sensorial', price: 200, icon: 'sparkles', desc: 'Toque bem leve só com a ponta dos dedos para dar arrepio e esvaziar a mente, até chegar no alívio final.' },
  { id: 'fusion', title: 'Fusion', price: 250, icon: 'zap', popular: true, desc: 'Mistura a força das mãos com a minha barba passando no seu corpo (atendo só de cueca). É a que mais sai, com alívio final.' },
  { id: 'reversa', title: 'Reversa', price: 300, icon: 'refresh-cw', desc: 'Metade do tempo eu tiro o seu estresse. Na outra metade, você faz a massagem em mim. Com alívio final.' },
  { id: 'nuru', title: 'Nuru', price: 350, icon: 'star', desc: 'Nós dois pelados. Muito gel para escorregar fácil. Passo meu corpo no seu até o relaxamento final.' },
];

// ==================================================================================
// COMPONENTES DE UI
// ==================================================================================
const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', maxLength, id }: any) => (
  <div className="space-y-1.5 w-full">
    {label && <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 pl-1">{label}</label>}
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors"><Icon name={icon} size={18} /></div>}
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength}
        className={`w-full min-h-[52px] rounded-xl text-sm transition-all border outline-none bg-white/5 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:bg-white/10 ${icon ? 'pl-11 pr-4' : 'px-4'}`}
      />
    </div>
  </div>
));

// ==================================================================================
// MAIN APP
// ==================================================================================
export default function App() {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [locationType, setLocationType] = useState<'home' | 'motel' | 'hotel'>('home');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [payment, setPayment] = useState<'pix' | 'card' | 'money' | null>(null);

  const detailsRef = useRef<HTMLDivElement>(null);

  // Scroll automático suave quando seleciona o serviço
  useEffect(() => {
    if (selectedServiceId && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [selectedServiceId]);

  const selectedService = SERVICES.find(s => s.id === selectedServiceId);
  
  const isRush = time ? RUSH_HOURS.includes(time) && locationType !== 'motel' : false;
  const total = (selectedService?.price || 0) + (isRush ? RUSH_FEE : 0);

  const generateWhatsAppMsg = () => {
    if (!selectedService || !name || !time || !date) return '';
    const dateStr = date.toLocaleDateString('pt-BR');
    const locText = locationType === 'motel' ? 'Sua Suíte' : address || 'Não informado';
    
    return `*Agendamento: ${selectedService.title}*\n──────────────────\nOlá Thalyson. Quero agendar minha sessão.\n\n👤 *Nome:* ${name}\n💆‍♂️ *Estilo:* ${selectedService.title}\n📅 *Quando:* ${dateStr} às ${time}\n📍 *Onde:* ${locText}\n\n💳 *Pagamento:* ${payment?.toUpperCase() || 'A COMBINAR'}\n💰 *Total:* ${formatMoney(total)}\n──────────────────\n_Estou ciente que a sessão dura entre 40 e 60min e começa focada no alívio corporal._`;
  };

  const handleFinish = () => {
    if (!selectedService || !name || !date || !time) {
      alert("Por favor, preencha os dados principais (Nome, Data e Horário) para continuar.");
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
    <div className="min-h-screen bg-[#11141a] text-zinc-100 font-sans selection:bg-blue-500/30 pb-32">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        body { font-family: 'Poppins', sans-serif; -webkit-tap-highlight-color: transparent; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-down { animation: slideDown 0.4s ease forwards; }
      `}} />

      <main className="max-w-xl mx-auto px-5 pt-8 sm:pt-12">
        
        {/* HEADER & INTRO COPY (Estratégia de Tangibilidade) */}
        <header className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 mb-5 overflow-hidden">
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

        {/* LISTA DE SERVIÇOS VERTICAL */}
        <div className="space-y-4 mb-10">
          {SERVICES.map((s) => {
            const isSelected = selectedServiceId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => { setSelectedServiceId(s.id); vibrate(30); }}
                className={`w-full text-left p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
                  isSelected 
                    ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)] ring-1 ring-blue-500' 
                    : 'bg-[#181c25] border-zinc-800 hover:border-zinc-600'
                }`}
              >
                {s.popular && (
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                    A Mais Pedida
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                    <Icon name={s.icon} size={24} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-zinc-100'}`}>{s.title}</h3>
                      <span className={`font-bold ${isSelected ? 'text-blue-400' : 'text-zinc-400'}`}>{formatMoney(s.price)}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${isSelected ? 'text-blue-100' : 'text-zinc-400'}`}>
                      {s.desc.split('(').map((part, i) => i === 0 ? part : <span key={i} className="opacity-75">({part}</span>)}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* REVELAÇÃO PROGRESSIVA (DESLIZA PARA BAIXO AO ESCOLHER) */}
        {selectedServiceId && (
          <div ref={detailsRef} className="animate-slide-down space-y-8 pb-10">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-10" />
            
            {/* ONDE E QUEM */}
            <section className="space-y-5 bg-[#181c25] p-6 rounded-3xl border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-4">Seus Dados e Local</h2>
              
              <InputField label="Como quer ser chamado?" value={name} onChange={(e: any) => setName(e.target.value)} icon="user" placeholder="Seu nome ou apelido" />
              
              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400 pl-1 mb-2">Onde será o encontro?</label>
                <div className="grid grid-cols-3 gap-2">
                  {[ { id: 'home', label: 'Residência', icon: 'home' }, { id: 'motel', label: 'Sua Suíte', icon: 'bed' }, { id: 'hotel', label: 'Hotel', icon: 'building' } ].map(x => (
                    <button key={x.id} onClick={() => setLocationType(x.id as any)} className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 border transition-colors ${locationType === x.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                      <Icon name={x.icon} size={20} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{x.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {locationType !== 'motel' && (
                <div className="animate-slide-down pt-2">
                  <InputField label="Endereço ou Nome do Hotel" value={address} onChange={(e: any) => setAddress(e.target.value)} icon="map-pin" placeholder="Rua, Número, Bairro..." />
                  <p className="text-xs text-amber-500 mt-2 flex items-center gap-1.5"><Icon name="alert-circle" size={14} /> Taxa de Uber cobrada a parte no local.</p>
                </div>
              )}
            </section>

            {/* QUANDO */}
            <section className="space-y-5 bg-[#181c25] p-6 rounded-3xl border border-zinc-800">
              <h2 className="text-xl font-bold text-white mb-4">Data e Horário</h2>
              
              <div className="flex gap-3 overflow-x-auto snap-x py-1 scrollbar-hide -mx-2 px-2">
                {daysArray.map((d, idx) => {
                  const isSel = date?.toDateString() === d.toDateString();
                  return (
                    <button key={idx} onClick={() => { setDate(d); setTime(null); vibrate(30); }} className={`snap-center shrink-0 w-[72px] py-3 rounded-2xl flex flex-col items-center gap-1 border transition-all ${isSel ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                      <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.','')}</span>
                      <span className="text-xl font-bold leading-none">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              {date && (
                <div className="grid grid-cols-4 gap-2 pt-3 animate-slide-down">
                  {timeSlots.map(t => {
                    const isRushSlot = RUSH_HOURS.includes(t) && locationType !== 'motel';
                    const isSel = time === t;
                    return (
                      <button key={t} onClick={() => { setTime(t); vibrate(30); }} className={`py-3 rounded-xl text-sm font-bold border transition-colors relative flex flex-col items-center ${isSel ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-300'}`}>
                        {t}
                        {isRushSlot && <span className={`text-[8px] font-bold uppercase mt-0.5 ${isSel ? 'text-blue-200' : 'text-amber-500'}`}>+R$15</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </section>

            {/* PAGAMENTO E FINALIZAR */}
            {date && time && (
              <section className="animate-slide-down space-y-6">
                <div className="bg-[#181c25] p-6 rounded-3xl border border-zinc-800">
                  <h2 className="text-xl font-bold text-white mb-4">Forma de Pagamento (No Local)</h2>
                  <div className="grid grid-cols-3 gap-2">
                    {['pix', 'card', 'money'].map(p => (
                      <button key={p} onClick={() => setPayment(p as any)} className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors ${payment === p ? 'bg-white text-black border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                        {p === 'money' ? 'Dinheiro' : p === 'card' ? 'Cartão' : 'Pix'}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleFinish}
                  disabled={!payment}
                  className="w-full flex items-center justify-between bg-[#25D366] hover:bg-[#22c55e] text-white p-5 rounded-2xl font-bold text-lg transition-all disabled:opacity-50 disabled:grayscale active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="message-circle" size={24} />
                    Finalizar via WhatsApp
                  </div>
                  <span>{formatMoney(total)}</span>
                </button>
              </section>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
