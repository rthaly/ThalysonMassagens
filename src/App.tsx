import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

// ==================================================================================
// 1. CONFIGURAÇÕES E DADOS DE NEGÓCIO
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  PIX_KEY: "62922530000144",
  INSTAGRAM: "https://www.instagram.com/relaxarhojesp",
  ADDRESS_AREA: "Centro Histórico (Próx. Metrô Anhangabaú)",
  STUDIO_MAPS_LINK: "https://maps.app.goo.gl/search/Metrô+Anhangabaú", // Coloque o link exato do seu Maps aqui
  SIGNAL_AMOUNT: 50,
  START_HOUR: 9,
  END_HOUR: 22,
  FIRST_TIME_DISCOUNT: 15,
  FETISH_FEE: 130,
  COUPONS: {
    "SESSAO2": 0.08,
    "RELAXAR13": 0.13,
    "THALY20": 20,
    "BEMVINDO50": 50
  }
};

const PACKAGES = [
  {
    id: 'classica',
    title: 'Massagem Clássica',
    price: 180,
    min: 60,
    tags: ['Apenas Mãos', 'Sem Toque Íntimo'],
    desc: 'O essencial para quem está moído da rotina. Uso a força das minhas mãos para desfazer os nós de tensão e soltar sua musculatura. Você entra pesado e sai leve.'
  },
  {
    id: 'sensitiva',
    title: 'Sensitiva & Prazer',
    price: 220,
    min: 60,
    tags: ['Toques Leves', 'Finalização Íntima'],
    desc: 'Começamos desmanchando o cansaço do seu corpo. Quando você estiver entregue, os toques mudam, causam arrepios e vamos até o alívio completo.'
  },
  {
    id: 'fusion',
    title: 'Combo Corpo a Corpo',
    price: 290,
    min: 60,
    tags: ['Naturista', 'Uso de Barba e Peito'],
    desc: 'Ficamos totalmente à vontade. Uso o calor do meu peito, o peso das pernas e a textura da barba deslizando no seu corpo para uma imersão física profunda.'
  },
  {
    id: 'completa',
    title: 'A Experiência Completa',
    price: 390,
    min: 60,
    tags: ['Gel Nuru', 'A Sua Vez de Tocar'],
    desc: 'O pacote sem barreiras. Muita proximidade física com gel escorregadio e liberdade total para você interagir, tocar e explorar o meu corpo do seu jeito.'
  }
];

const ADDONS = [
  { id: 'time', label: '+30 minutos extras', price: 75 },
  { id: 'aparo', label: 'Aparar Pelos (Máquina)', price: 107 },
];

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const PEAK_FEE = 18;

// ==================================================================================
// 2. UTILITÁRIOS E ÍCONES
// ==================================================================================
const formatMoney = (val) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern = 20) => { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} };
const maskCEP = (v) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const ICON_PATHS = {
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'lock': 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M7 11V7a5 5 0 0 1 10 0v4',
  'check': 'M20 6L9 17l-5-5',
  'close': 'M18 6L6 18 M6 6l12 12',
  'map': 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'
};

const Icon = memo(({ name, size = 24, className = '' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

// ==================================================================================
// 3. COMPONENTE PRINCIPAL
// ==================================================================================
export default function App() {
  const [step, setStep] = useState(0); 
  const [isReturningClient, setIsReturningClient] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const numberInputRef = useRef(null);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const [data, setData] = useState({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', 
    date: null, time: '', req: '', payment: '',
    packageId: PACKAGES[0].id, addons: {}
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  useEffect(() => {
    const hasOnboarded = localStorage.getItem('thaly_onboard_final');
    const hasBookedBefore = localStorage.getItem('thaly_returning_final');
    const savedDraft = localStorage.getItem('thaly_draft_booking');
    
    if (hasOnboarded === 'yes') setStep(1);
    if (hasBookedBefore === 'yes') setIsReturningClient(true);
    
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setData(prev => ({ ...prev, name: parsed.name || '', locType: parsed.locType || 'studio', street: parsed.street || '', number: parsed.number || '', bairro: parsed.bairro || '' }));
      } catch(e) {}
    }
  }, []);

  useEffect(() => {
    if (data.name.length > 2) {
      localStorage.setItem('thaly_draft_booking', JSON.stringify({
        name: data.name, locType: data.locType, street: data.street, number: data.number, bairro: data.bairro
      }));
    }
  }, [data.name, data.locType, data.street, data.number, data.bairro]);

  useEffect(() => {
    if (step > 0 && !isProfileOpen) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, isProfileOpen]);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    
    if (CONFIG.COUPONS[code]) {
      vibrate([20, 40]);
      setAppliedCoupon(code);
      setCouponError('');
      showToast('✅ Cupom ativado com sucesso!');
    } else {
      vibrate(50);
      setCouponError('Cupom inválido ou expirado.');
      setAppliedCoupon('');
    }
  };

  const handlePaymentSelect = (method) => {
    vibrate(15);
    setData({...data, payment: method});
    if (method === 'pix') {
      try {
        navigator.clipboard.writeText(CONFIG.PIX_KEY);
        showToast('✅ CNPJ copiado para o teclado!');
      } catch (err) {}
    }
  };

  const selectedPackage = useMemo(() => PACKAGES.find(p => p.id === data.packageId) || PACKAGES[0], [data.packageId]);

  const invoice = useMemo(() => {
    let subtotal = selectedPackage.price;
    let dur = selectedPackage.min;
    let addonsTotal = 0;
    let activeAddons = [];

    ADDONS.forEach(addon => {
      if (data.addons[addon.id]) {
        addonsTotal += addon.price;
        activeAddons.push(addon);
        if (addon.id === 'time') dur += 30;
      }
    });
    
    let reqFee = data.req.trim().length > 3 ? CONFIG.FETISH_FEE : 0;
    let baseWithAddons = subtotal + addonsTotal + reqFee;
    
    let peakFee = (PEAK_HOURS.includes(data.time) && data.locType !== 'studio') ? PEAK_FEE : 0;
    
    let discountValue = 0;
    if (appliedCoupon) {
      const val = CONFIG.COUPONS[appliedCoupon];
      discountValue = val < 1 ? Math.floor(baseWithAddons * val) : val;
    } else if (!isReturningClient) {
      discountValue = CONFIG.FIRST_TIME_DISCOUNT;
    }
    
    let totalAfterDiscounts = Math.max(0, baseWithAddons - discountValue);
    let pixDiscount = data.payment === 'pix' ? Math.ceil(totalAfterDiscounts * 0.03) : 0;
    
    let finalTotal = totalAfterDiscounts - pixDiscount + peakFee;
    
    return { 
      base: selectedPackage.price, addonsTotal, reqFee, peakFee, 
      discount: discountValue, pixDiscount, total: finalTotal, sinal: CONFIG.SIGNAL_AMOUNT, dur,
      activeAddons
    };
  }, [data, selectedPackage, isReturningClient, appliedCoupon]);

  // Janela de exatos 14 dias
  const days = useMemo(() => Array.from({length: 14}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  }), []);

  const getSlots = () => {
    if (!data.date) return [];
    
    let s = [];
    
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) {
      const timeStr = `${i < 10 ? '0' : ''}${i}:00`;
      
      // Filtra apenas se o horário já passou hoje
      const isPast = data.date.toDateString() === new Date().toDateString() && i <= new Date().getHours();
      
      if (!isPast) {
        s.push(timeStr);
      }
    }
    return s;
  };

  const generateWhatsAppLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';
    
    let locationText = '';
    
    if (data.locType === 'studio') {
      locationText = `📍 *Local:* Irei até o seu espaço no Centro Histórico.`;
    } else {
      const fullAddress = `${data.street}, ${data.number}${data.comp ? ' - ' + data.comp : ''} - ${data.bairro}, São Paulo`;
      const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`;
      locationText = `📍 *Local:* Você virá até mim.\n*Endereço:* ${fullAddress}\n*Mapa:* ${mapsUrl}`;
    }

    let text = `Oi Thalyson! Fechei pelo site e quero confirmar.\n\n`;
    text += `*NOME:* ${data.name}\n`;
    text += `*DIA E HORA:* ${dStr} às ${data.time}\n${locationText}\n\n`;
    
    text += `*MEU PACOTE (Até ${invoice.dur} min):*\n`;
    text += `✅ ${selectedPackage.title}\n`;
    invoice.activeAddons.forEach(a => text += `➕ ${a.label}\n`);
    
    if (data.req.trim()) text += `\n*VONTADE ESPECÍFICA:* "${data.req.trim()}" (Ciente da taxa se rolar)\n`;

    text += `\n*VALOR FINAL:* ${formatMoney(invoice.total)} no ${data.payment.toUpperCase()}\n`;
    text += `*Sinal:* ${formatMoney(invoice.sinal)} (Restante lá na hora)\n\n`;
    text += `Aguardo sua resposta para mandar o comprovante do sinal!`;
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
  };

  const handleCep = async (val) => {
    const masked = maskCEP(val);
    setData(prev => ({ ...prev, cep: masked }));
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const json = await res.json();
        if (!json.erro) {
          setData(prev => ({ ...prev, street: json.logradouro || '', bairro: json.bairro || '' }));
          setTimeout(() => numberInputRef.current?.focus(), 150);
        }
      } catch (e) {}
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // ==================================================================================
  // 4. RENDERIZAÇÃO DAS ETAPAS
  // ==================================================================================
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 pb-24 relative">
      
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-zinc-950 px-5 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4">
          {toastMsg}
        </div>
      )}

      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in" onClick={() => setIsProfileOpen(false)}>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors outline-none">
              <Icon name="close" size={24} />
            </button>
            <img src="FmtU3Ogx_400x400.jpg" className="w-24 h-24 rounded-full object-cover mb-5 border-2 border-zinc-700 shadow-xl" alt="Thalyson" />
            <h2 className="text-3xl font-medium text-white tracking-tight mb-1">Thalyson.</h2>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">Terapeuta Masculino</p>
            <div className="space-y-4 text-sm text-zinc-400 leading-relaxed mb-6">
              <p>{getGreeting()}. Sou focado no público masculino e meu trabalho é direto: usar minhas mãos (e meu corpo, dependendo do pacote) para aliviar o peso da sua rotina.</p>
              <p className="flex items-start gap-2 text-zinc-300 bg-zinc-950/50 p-3 rounded-lg border border-zinc-800">
                <Icon name="map" size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                Atendo em um espaço super acolhedor e discreto no Centro Histórico de SP, a 5 minutinhos do Metrô Anhangabaú. Um refúgio seguro no meio do caos.
              </p>
            </div>
            <div className="pt-6 border-t border-zinc-800 flex justify-center">
              <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors outline-none">
                <Icon name="instagram" size={18} /> Meu Instagram
              </a>
            </div>
          </div>
        </div>
      )}

      {step > 0 && (
        <header className="px-6 py-6 max-w-lg mx-auto flex justify-between items-center border-b border-zinc-900 mb-8 sticky top-0 bg-zinc-950/80 backdrop-blur-md z-40">
          <button onClick={() => { vibrate(10); setIsProfileOpen(true); }} className="flex items-center gap-3 group text-left outline-none">
            <img src="FmtU3Ogx_400x400.jpg" alt="Thalyson" className="w-10 h-10 rounded-full border border-zinc-700 object-cover group-hover:scale-105 transition-transform shadow-lg" />
            <div>
              <h1 className="text-lg font-medium tracking-tight text-white group-hover:text-zinc-200 transition-colors">Thalyson.</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-emerald-400/70 transition-colors">Conhecer Local</p>
            </div>
          </button>
          <div className="flex gap-1.5">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-5 bg-white' : 'w-2 bg-zinc-800'}`} />
            ))}
          </div>
        </header>
      )}

      <main className="px-6 max-w-lg mx-auto">
        
        {step === 0 && (
          <div className="flex flex-col justify-center min-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-10 leading-tight text-white">O seu refúgio<br/>em São Paulo.</h1>
            
            <div className="space-y-4 mb-12">
              <div className="flex gap-4 p-5 border border-zinc-800 bg-zinc-900/50 rounded-xl">
                <Icon name="shield" className="text-zinc-400 mt-0.5" size={22} />
                <p className="text-zinc-400 text-sm leading-relaxed">Sigilo total. Nada que você preenche aqui fica salvo na internet. Os dados vão direto para o meu celular pessoal.</p>
              </div>
              <div className="flex gap-4 p-5 border border-zinc-800 bg-zinc-900/50 rounded-xl">
                <Icon name="lock" className="text-zinc-400 mt-0.5" size={22} />
                <p className="text-zinc-400 text-sm leading-relaxed">O atendimento é intenso, focado no corpo masculino. Você confirma que tem mais de 18 anos?</p>
              </div>
            </div>

            <button 
              onClick={() => { vibrate(30); localStorage.setItem('thaly_onboard_final', 'yes'); setStep(1); }} 
              className="bg-white text-black h-16 w-full text-sm font-bold tracking-widest uppercase rounded-xl transition-transform active:scale-[0.98]"
            >
              Confirmar e Entrar
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">Passo 1 de 3</h2>
            <h1 className="text-3xl font-medium tracking-tight mb-8 text-white">Como posso te ajudar hoje?</h1>

            <div className="space-y-4 mb-10">
              {PACKAGES.map(pkg => {
                const isActive = data.packageId === pkg.id;
                return (
                  <button 
                    key={pkg.id}
                    onClick={() => { vibrate(15); setData({...data, packageId: pkg.id}); }}
                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 outline-none block ${
                      isActive ? 'bg-zinc-900 border-white shadow-xl scale-[1.02]' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-xl ${isActive ? 'text-white' : 'text-zinc-300'}`}>{pkg.title}</h3>
                      <span className={`font-bold text-lg ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>{formatMoney(pkg.price)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pkg.tags.map((tag, idx) => (
                        <span key={idx} className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm border ${isActive ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-transparent text-zinc-600 border-zinc-800'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className={`text-sm leading-relaxed ${isActive ? 'text-zinc-400' : 'text-zinc-600'}`}>{pkg.desc}</p>
                  </button>
                )
              })}
              
              <div className="pt-6">
                <h3 className="text-sm font-bold text-white mb-3">Extras Práticos (Opcional)</h3>
                <div className="flex flex-col gap-3">
                  {ADDONS.map(addon => {
                    const isActive = data.addons[addon.id];
                    return (
                      <button 
                        key={addon.id}
                        onClick={() => { vibrate(15); setData(p => ({...p, addons: {...p.addons, [addon.id]: !isActive}})); }}
                        className={`w-full p-4 text-sm font-bold rounded-xl border transition-colors flex justify-between items-center ${
                          isActive ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <span>{addon.label}</span>
                        <span>+ {formatMoney(addon.price)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 w-full p-4 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-900 z-50">
              <div className="max-w-lg mx-auto flex gap-4 items-center">
                <div className="flex-1">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Até {invoice.dur} minutos</p>
                  <p className="text-2xl font-bold text-white">{formatMoney(invoice.base + invoice.addonsTotal)}</p>
                </div>
                <button onClick={() => { vibrate(30); setStep(2); }} className="bg-emerald-500 text-zinc-950 px-8 py-4 text-sm font-bold tracking-widest uppercase rounded-xl transition-transform active:scale-[0.98]">
                  Avançar
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">Passo 2 de 3</h2>
            <h1 className="text-3xl font-medium tracking-tight mb-8 text-white">Onde e Quando?</h1>

            <div className="space-y-8 mb-10">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Seu Nome</label>
                <input type="text" value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600" placeholder="Como gosta de ser chamado?" />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Local do Atendimento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={()=>setData({...data, locType:'studio', time:''})} className={`py-4 px-2 text-sm font-bold outline-none transition-colors border rounded-xl ${data.locType==='studio' ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>No meu Espaço</button>
                  <button onClick={()=>setData({...data, locType:'home', time:''})} className={`py-4 px-2 text-sm font-bold outline-none transition-colors border rounded-xl ${data.locType==='home' ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>Vou até você</button>
                </div>
              </div>

              {data.locType === 'studio' && (
                <p className="text-sm text-zinc-400 bg-zinc-900 p-5 rounded-xl border border-zinc-800 leading-relaxed">
                  A suíte fica no <strong>Centro Histórico (próximo ao Metrô Anhangabaú)</strong>. Um ambiente seguro, limpo e preparado pra você relaxar. O endereço completo vai no WhatsApp.
                </p>
              )}

              {data.locType === 'home' && (
                <div className="space-y-4 animate-in fade-in">
                  <input type="tel" maxLength={9} placeholder="CEP (opcional)" value={data.cep} onChange={e=>handleCep(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600" />
                  <input type="text" placeholder="Rua ou Avenida" value={data.street} onChange={e=>setData({...data, street: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600" />
                  <div className="flex gap-3">
                    <input ref={numberInputRef} type="text" placeholder="Número" value={data.number} onChange={e=>setData({...data, number: e.target.value})} className="w-1/3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600" />
                    <input type="text" placeholder="Apto / Complemento" value={data.comp} onChange={e=>setData({...data, comp: e.target.value})} className="w-2/3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600" />
                  </div>
                  <input type="text" placeholder="Bairro" value={data.bairro} onChange={e=>setData({...data, bairro: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600" />
                </div>
              )}

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Qual Dia?</label>
                  <span className="text-[10px] bg-zinc-900 px-2 py-1 rounded text-zinc-500">Próximos 14 Dias</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar -mx-6 px-6">
                  {days.map((d, i) => {
                    const sel = data.date?.toDateString() === d.toDateString();
                    return (
                      <button key={i} onClick={() => setData({...data, date: d, time: ''})} className={`shrink-0 snap-start w-20 py-4 flex flex-col items-center justify-center border rounded-2xl transition-all ${sel ? 'bg-zinc-100 text-zinc-900 border-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                        <span className="text-xs uppercase font-bold tracking-widest mb-1">{d.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3)}</span>
                        <span className="text-2xl font-medium">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {data.date && (
                <div className="animate-in fade-in">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">Qual Horário?</label>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {getSlots().map(t => {
                      const sel = data.time === t;
                      const isPeak = PEAK_HOURS.includes(t) && data.locType !== 'studio';
                      return (
                        <button key={t} onClick={() => { vibrate(15); setData({...data, time: t}); }} className={`py-4 flex flex-col items-center justify-center border rounded-xl transition-colors ${sel ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                          <span className="text-sm font-bold">{t}</span>
                          {isPeak && <span className={`text-[9px] uppercase font-bold tracking-widest mt-1 ${sel ? 'text-zinc-600' : 'text-pink-500/80'}`}>+ R$ 18 Pico</span>}
                        </button>
                      )
                    })}
                    {getSlots().length === 0 && <p className="col-span-3 text-sm text-zinc-500 text-center py-6">Não há mais horários hoje.</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={() => setStep(1)} className="bg-zinc-900 text-zinc-300 w-1/3 py-4 text-xs font-bold tracking-widest uppercase rounded-xl border border-zinc-800">Voltar</button>
              <button 
                disabled={!(data.name.length > 2 && data.date && data.time && (data.locType === 'studio' || (data.street && data.number && data.bairro)))} 
                onClick={() => { vibrate(30); setStep(3); }} 
                className="bg-emerald-500 text-zinc-950 flex-1 py-4 text-sm font-bold tracking-widest uppercase rounded-xl disabled:opacity-20 transition-opacity"
              >
                Revisar Pedido
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">Passo 3 de 3</h2>
            <h1 className="text-3xl font-medium tracking-tight mb-8 text-white">Resumo Final</h1>

            <div className="space-y-8 mb-10">
              
              <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm items-center"><span className="text-zinc-400">Pacote Escolhido</span><span className="text-white font-medium">{formatMoney(invoice.base)}</span></div>
                  {invoice.addonsTotal > 0 && <div className="flex justify-between text-sm items-center"><span className="text-zinc-400">Adicionais</span><span className="text-emerald-400 font-medium">+{formatMoney(invoice.addonsTotal)}</span></div>}
                  {invoice.reqFee > 0 && <div className="flex justify-between text-sm items-center"><span className="text-pink-400">Taxa de Fetiche/Especial</span><span className="text-pink-400 font-medium">+{formatMoney(invoice.reqFee)}</span></div>}
                  
                  {appliedCoupon ? (
                    <div className="flex justify-between text-sm items-center py-2 border-y border-zinc-800 my-2">
                      <span className="text-emerald-400 font-bold flex items-center gap-2"><Icon name="check" size={16}/> Cupom {appliedCoupon}</span>
                      <span className="text-emerald-400 font-bold">-{formatMoney(invoice.discount)}</span>
                    </div>
                  ) : (!isReturningClient && (
                    <div className="flex justify-between text-sm items-center py-2 border-y border-zinc-800 my-2">
                      <span className="text-emerald-400 font-bold flex items-center gap-2"><Icon name="check" size={16}/> Presente de 1ª Vez</span>
                      <span className="text-emerald-400 font-bold">-{formatMoney(invoice.discount)}</span>
                    </div>
                  ))}
                  
                  {invoice.peakFee > 0 && <div className="flex justify-between text-sm items-center"><span className="text-zinc-400">Taxa Deslocamento/Pico</span><span className="text-white font-medium">+{formatMoney(invoice.peakFee)}</span></div>}
                  {invoice.pixDiscount > 0 && <div className="flex justify-between text-sm items-center"><span className="text-emerald-400">Desconto Pix (3%)</span><span className="text-emerald-400 font-medium">-{formatMoney(invoice.pixDiscount)}</span></div>}
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-zinc-800">
                  <span className="text-sm uppercase tracking-widest text-zinc-500 font-bold">Total a Pagar</span>
                  <span className="text-4xl font-medium text-white tracking-tight">{formatMoney(invoice.total)}</span>
                </div>
              </div>

              {!appliedCoupon && (
                <div className="animate-in fade-in">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Tem um cupom?</label>
                  <div className="flex gap-3">
                    <input type="text" placeholder="Código" value={couponInput} onChange={e => {setCouponInput(e.target.value); setCouponError('');}} className={`flex-1 bg-zinc-900 border ${couponError ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-4 py-4 text-sm text-white focus:outline-none uppercase`} />
                    <button onClick={handleApplyCoupon} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-4 rounded-xl transition-colors outline-none">Aplicar</button>
                  </div>
                  {couponError && <p className="text-xs text-red-400 mt-2">{couponError}</p>}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Vontade Específica (+ R$ {CONFIG.FETISH_FEE})</label>
                <input type="text" placeholder="Ex: Alguma fantasia, roleplay..." value={data.req} onChange={e=>setData({...data, req:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600" />
                <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Avaliamos na hora. Se não for possível realizar o seu pedido com segurança, eu tiro essa taxa de R$ 130 do valor final, fica tranquilo.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Como vai pagar na hora?</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{id:'pix', l:'Pix (-3%)'},{id:'card', l:'Cartão'},{id:'cash', l:'Dinheiro'}].map(p => (
                    <button key={p.id} onClick={() => handlePaymentSelect(p.id)} className={`py-4 text-xs font-bold uppercase tracking-wider border rounded-xl transition-colors ${data.payment === p.id ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>{p.l}</button>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl text-center">
                <p className="text-sm text-emerald-400/90 leading-relaxed">
                  Pra eu segurar seu horário na agenda, o sinal é de <strong className="text-emerald-400">R$ 50 via Pix</strong>. Acertamos a diferença lá na hora.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={() => setStep(2)} className="bg-zinc-900 text-zinc-300 w-1/4 py-5 text-xs font-bold tracking-widest uppercase rounded-xl border border-zinc-800">Voltar</button>
              <a 
                href={data.payment ? generateWhatsAppLink() : '#'}
                onClick={(e) => {
                  if (!data.payment) e.preventDefault();
                  else {
                    localStorage.setItem('thaly_returning_final', 'yes');
                    localStorage.removeItem('thaly_draft_booking');
                    vibrate([30, 50]);
                  }
                }}
                className={`flex-1 py-5 text-sm font-bold tracking-widest uppercase rounded-xl flex items-center justify-center text-center transition-all ${data.payment ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'}`}
              >
                Mandar no WhatsApp
              </a>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
