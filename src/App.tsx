import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

// ==================================================================================
// 1. CONFIGURAÇÕES E DADOS DE NEGÓCIO
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  PIX_KEY: "62922530000144",
  INSTAGRAM: "https://www.instagram.com/relaxarhojesp",
  ADDRESS_AREA: "Centro Histórico, Bela Vista (Próx. Metrô Anhangabaú)",
  STUDIO_MAPS_LINK: "https://maps.app.goo.gl/search/Metrô+Anhangabaú",
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
    originalPrice: 220,
    price: 180,
    min: 40,
    tags: ['Apenas Mãos', 'Sem Toque Íntimo'],
    desc: 'O essencial para quem está moído da rotina. Uso a força das minhas mãos para desfazer os nós de tensão e soltar sua musculatura. Você entra pesado e sai leve.'
  },
  {
    id: 'sensitiva',
    title: 'Sensitiva & Prazer',
    originalPrice: 280,
    price: 220,
    min: 60,
    tags: ['Toques Leves', 'Finalização Íntima'],
    desc: 'Começamos desmanchando o cansaço do seu corpo com a massagem clássica. Quando você estiver entregue, os toques mudam, causam arrepios e encerramos com a massagem íntima.'
  },
  {
    id: 'fusion',
    title: 'Sensações com a Barba',
    originalPrice: 350,
    price: 290,
    min: 60,
    tags: ['Naturista', 'Uso de Barba'],
    desc: 'Ficamos totalmente à vontade. Primeiro vou relaxar seu corpo com a massagem clássica, depois uso minha barba em algumas partes do seu corpo e encerramos com a massagem íntima.'
  },
  {
    id: 'completa',
    title: 'A Experiência Completa',
    originalPrice: 480,
    price: 390,
    min: 60,
    tags: ['Gel Nuru', 'A Sua Vez de Tocar'],
    desc: 'O pacote sem barreiras. Primeiro vou relaxar seu corpo com a massagem clássica, depois proximidade física com gel escorregadio corpo a corpo e liberdade total para você fazer massagem em mim e encerramos com a massagem íntima.'
  },
  {
    id: 'aparo_solo',
    title: 'Apenas Depilação (Máquina)',
    originalPrice: 180,
    price: 130,
    min: 40,
    tags: ['Estética', 'Sem Massagem'],
    desc: 'Serviço isolado para quem busca apenas estética. Aparo de pelos (até 3 lugares) pente 1 e 3 utilizando máquina sem dores.'
  }
];

const ADDONS = [
  { id: 'time', label: '+30 minutos extras', price: 75 },
  { id: 'aparo', label: 'Aparar Pelos até 3 lugares (Máquina)', price: 130 },
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
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

// ==================================================================================
// 3. COMPONENTE PRINCIPAL
// ==================================================================================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
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
  }, [isLoading]);

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

  useEffect(() => {
    if (data.packageId === 'aparo_solo' && data.addons['aparo']) {
      setData(prev => ({ ...prev, addons: { ...prev.addons, aparo: false } }));
    }
  }, [data.packageId]);

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

  const resetFlow = () => {
    vibrate(15);
    setData({
      name: data.name, locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', 
      date: null, time: '', req: '', payment: '',
      packageId: PACKAGES[0].id, addons: {}
    });
    setStep(1);
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

  const days = useMemo(() => Array.from({length: 14}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  }), []);

  const getSlots = () => {
    if (!data.date) return [];
    
    let s = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) {
      const timeStr = `${i < 10 ? '0' : ''}${i}:00`;
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
    
    text += `*MEU PACOTE (Duração: ${invoice.dur} minutos):*\n`;
    text += `✅ ${selectedPackage.title} (${formatMoney(selectedPackage.price)})\n`;
    
    invoice.activeAddons.forEach(a => text += `➕ ${a.label} (+${formatMoney(a.price)})\n`);
    
    if (data.req.trim()) {
      text += `\n*VONTADE ESPECÍFICA:* "${data.req.trim()}" (Ciente da taxa de +${formatMoney(CONFIG.FETISH_FEE)} se rolar)\n`;
    }

    if (invoice.discount > 0) {
      const discountName = appliedCoupon ? `Cupom ${appliedCoupon}` : 'Presente de 1ª Vez';
      text += `\n🎁 *Desconto:* ${discountName} (-${formatMoney(invoice.discount)})\n`;
    }

    if (invoice.peakFee > 0) {
      text += `📈 *Taxa de Pico:* (+${formatMoney(invoice.peakFee)})\n`;
    }

    const restante = Math.max(0, invoice.total - invoice.sinal);

    text += `\n*RESUMO DO PAGAMENTO:*\n`;
    text += `*Valor Total:* ${formatMoney(invoice.total)} (${data.payment.toUpperCase()})\n`;
    text += `*Sinal (Pix agora):* ${formatMoney(invoice.sinal)}\n`;
    text += `*Restante (Depois da sessão):* ${formatMoney(restante)}\n\n`;
    
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center animate-in fade-in duration-500">
        <h1 className="text-xl font-light text-stone-300 tracking-[0.3em] uppercase mb-8 animate-pulse">Thalyson.</h1>
        <div className="w-40 h-0.5 bg-stone-900 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-stone-500/80 animate-loading-bar rounded-full"></div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loading-slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
          .animate-loading-bar { animation: loading-slide 1.2s infinite ease-in-out; }
        `}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-amber-600/30 pb-28 relative">
      
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-stone-100 text-stone-900 px-6 py-3 rounded-full font-medium text-sm flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-4">
          {toastMsg}
        </div>
      )}

      {isProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsProfileOpen(false)}>
          <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-sm p-8 relative shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsProfileOpen(false)} className="absolute top-6 right-6 p-2 text-stone-500 hover:text-stone-300 transition-colors outline-none">
              <Icon name="close" size={24} />
            </button>
            <img src="FmtU3Ogx_400x400.jpg" className="w-20 h-20 rounded-full object-cover mb-6 shadow-md" alt="Thalyson" />
            <h2 className="text-2xl font-light text-stone-100 tracking-wide mb-1">Thalyson Massagens, SP Bela Vista</h2>
            <p className="text-amber-500/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">Terapeuta Masculino</p>
            <div className="space-y-4 text-sm text-stone-400 leading-relaxed mb-8">
              <p>{getGreeting()}. O meu trabalho é direto e focado no corpo masculino: usar o poder do toque para desfazer o peso e a tensão da sua rotina.</p>
              <p className="flex items-start gap-3 bg-stone-950/50 p-5 rounded-2xl">
                <Icon name="map" size={18} className="mt-0.5 shrink-0 text-stone-500" />
                <span className="leading-relaxed">Atendo num refúgio seguro e discreto no Centro Histórico de SP, próximo ao Metrô Anhangabaú.</span>
              </p>
            </div>
            <div className="pt-6 border-t border-stone-800 flex justify-center">
              <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-stone-400 hover:text-stone-200 transition-colors outline-none">
                <Icon name="instagram" size={16} /> Meu Instagram
              </a>
            </div>
          </div>
        </div>
      )}

      {step > 0 && (
        <header className="px-6 py-5 max-w-lg mx-auto flex justify-between items-center mb-6 sticky top-0 bg-stone-950/90 backdrop-blur-md z-40 border-b border-stone-900/50">
          <button onClick={() => { vibrate(10); setIsProfileOpen(true); }} className="flex items-center gap-3 group text-left outline-none">
            <img src="FmtU3Ogx_400x400.jpg" alt="Thalyson Santos" className="w-10 h-10 rounded-full object-cover group-hover:opacity-80 transition-opacity" />
            <div>
              <h1 className="text-sm font-medium text-stone-200 group-hover:text-white transition-colors">Thalyson Massagens</h1>
              <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest group-hover:text-stone-400 transition-colors">Ver Perfil</p>
            </div>
          </button>
          <div className="flex gap-2">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-stone-300' : (step === 4 ? 'w-6 bg-stone-700' : 'w-2 bg-stone-800')}`} />
            ))}
          </div>
        </header>
      )}

      <main className="px-6 max-w-lg mx-auto">
        
        {step === 0 && (
          <div className="flex flex-col justify-center min-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-12 leading-tight text-stone-100">
              O seu momento<br/><span className="text-stone-400">de pausa.</span>
            </h1>
            
            <div className="space-y-4 mb-12">
              <div className="flex gap-4 p-6 bg-stone-900/50 rounded-3xl border border-stone-800/50">
                <Icon name="shield" className="text-stone-500 mt-0.5" size={22} />
                <p className="text-stone-400 text-sm leading-relaxed">Sigilo e respeito total. Nada fica salvo online. Os dados preenchidos vão diretamente para o meu WhatsApp pessoal.</p>
              </div>
              <div className="flex gap-4 p-6 bg-stone-900/50 rounded-3xl border border-stone-800/50">
                <Icon name="lock" className="text-stone-500 mt-0.5" size={22} />
                <p className="text-stone-400 text-sm leading-relaxed">Atendimento estritamente para maiores de 18 anos, focado inteiramente no relaxamento do corpo masculino.</p>
              </div>
            </div>

            <button 
              onClick={() => { vibrate(30); localStorage.setItem('thaly_onboard_final', 'yes'); setStep(1); }} 
              className="bg-stone-100 text-stone-950 h-16 w-full text-sm font-bold tracking-[0.15em] uppercase rounded-2xl transition-transform active:scale-[0.98]"
            >
              Iniciar Agendamento
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-32">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase mb-3">Passo 1</h2>
            <h1 className="text-3xl font-light tracking-wide mb-10 text-stone-100">Escolha o seu pacote</h1>

            <div className="space-y-4 mb-10">
              {PACKAGES.map(pkg => {
                const isActive = data.packageId === pkg.id;
                return (
                  <button 
                    key={pkg.id}
                    onClick={() => { vibrate(15); setData({...data, packageId: pkg.id}); }}
                    className={`w-full text-left p-6 rounded-3xl transition-all duration-300 outline-none block border ${
                      isActive ? 'bg-stone-900 border-amber-700/30 shadow-md scale-[1.02]' : 'bg-stone-950 border-stone-800/80 hover:bg-stone-900/50 hover:border-stone-800'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`font-medium text-lg tracking-wide ${isActive ? 'text-stone-100' : 'text-stone-300'}`}>{pkg.title}</h3>
                      <div className="text-right">
                        {pkg.originalPrice && <span className="text-xs line-through text-stone-600 block mb-0.5">{formatMoney(pkg.originalPrice)}</span>}
                        <span className={`font-medium text-lg ${isActive ? 'text-amber-200' : 'text-stone-400'}`}>{formatMoney(pkg.price)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md ${isActive ? 'bg-stone-800 text-stone-300' : 'bg-stone-900 text-stone-500'}`}>
                        {pkg.min} MIN
                      </span>
                      {pkg.tags.map((tag, idx) => (
                        <span key={idx} className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-md ${isActive ? 'bg-stone-800 text-stone-300' : 'bg-stone-900 text-stone-500'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className={`text-sm leading-relaxed ${isActive ? 'text-stone-400' : 'text-stone-500'}`}>{pkg.desc}</p>
                  </button>
                )
              })}
              
              <div className="pt-8">
                <h3 className="text-sm font-medium tracking-wide text-stone-300 mb-4">Adicionais</h3>
                <div className="flex flex-col gap-3">
                  {ADDONS.map(addon => {
                    if (data.packageId === 'aparo_solo' && addon.id === 'aparo') return null;

                    const isActive = data.addons[addon.id];
                    return (
                      <button 
                        key={addon.id}
                        onClick={() => { vibrate(15); setData(p => ({...p, addons: {...p.addons, [addon.id]: !isActive}})); }}
                        className={`w-full p-5 text-sm font-medium rounded-2xl border transition-all flex justify-between items-center ${
                          isActive ? 'bg-stone-800 text-stone-200 border-stone-600' : 'bg-stone-950 border-stone-800/80 text-stone-500 hover:bg-stone-900'
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

            <div className="fixed bottom-0 left-0 w-full p-5 bg-stone-950/95 backdrop-blur-md border-t border-stone-900 z-50">
              <div className="max-w-lg mx-auto flex gap-6 items-center">
                <div className="flex-1">
                  <p className="text-[9px] text-stone-500 font-bold uppercase tracking-widest mb-0.5">Duração: {invoice.dur} min</p>
                  <p className="text-2xl font-light tracking-wide text-stone-100">{formatMoney(invoice.base + invoice.addonsTotal)}</p>
                </div>
                <button onClick={() => { vibrate(30); setStep(2); }} className="bg-emerald-700 text-stone-50 px-8 py-4 text-[11px] font-bold tracking-widest uppercase rounded-xl transition-transform active:scale-[0.98]">
                  Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase mb-3">Passo 2</h2>
            <h1 className="text-3xl font-light tracking-wide mb-10 text-stone-100">Agendamento</h1>

            <div className="space-y-10 mb-10">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">Como devo te chamar?</label>
                <input type="text" value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl px-5 py-4 text-base text-stone-200 focus:outline-none focus:border-stone-600 focus:bg-stone-900 transition-colors placeholder:text-stone-600" placeholder="Seu nome" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">Local da Sessão</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={()=>setData({...data, locType:'studio', time:''})} className={`py-4 px-3 text-sm font-medium outline-none transition-all border rounded-2xl ${data.locType==='studio' ? 'bg-stone-800 text-stone-200 border-stone-600' : 'bg-stone-900/30 border-stone-800/80 text-stone-500 hover:bg-stone-900'}`}>No meu Espaço</button>
                  <button onClick={()=>setData({...data, locType:'home', time:''})} className={`py-4 px-3 text-sm font-medium outline-none transition-all border rounded-2xl ${data.locType==='home' ? 'bg-stone-800 text-stone-200 border-stone-600' : 'bg-stone-900/30 border-stone-800/80 text-stone-500 hover:bg-stone-900'}`}>Vou até você</button>
                </div>
              </div>

              {data.locType === 'studio' && (
                <p className="text-sm text-stone-400 bg-stone-900/50 p-6 rounded-3xl border border-stone-800/80 leading-relaxed">
                  A suíte fica no <strong>Centro Histórico, na Bela Vista (próximo ao Metrô Anhangabaú)</strong>. O endereço exato é enviado junto com a confirmação.
                </p>
              )}

              {data.locType === 'home' && (
                <div className="space-y-4 animate-in fade-in">
                  <input type="tel" maxLength={9} placeholder="CEP (opcional)" value={data.cep} onChange={e=>handleCep(e.target.value)} className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl px-5 py-4 text-base text-stone-200 focus:outline-none focus:border-stone-600 focus:bg-stone-900 placeholder:text-stone-600 transition-colors" />
                  <input type="text" placeholder="Rua ou Avenida" value={data.street} onChange={e=>setData({...data, street: e.target.value})} className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl px-5 py-4 text-base text-stone-200 focus:outline-none focus:border-stone-600 focus:bg-stone-900 placeholder:text-stone-600 transition-colors" />
                  <div className="flex gap-3">
                    <input ref={numberInputRef} type="text" placeholder="Nº" value={data.number} onChange={e=>setData({...data, number: e.target.value})} className="w-1/3 bg-stone-900/50 border border-stone-800 rounded-2xl px-5 py-4 text-base text-stone-200 focus:outline-none focus:border-stone-600 focus:bg-stone-900 placeholder:text-stone-600 transition-colors" />
                    <input type="text" placeholder="Complemento" value={data.comp} onChange={e=>setData({...data, comp: e.target.value})} className="w-2/3 bg-stone-900/50 border border-stone-800 rounded-2xl px-5 py-4 text-base text-stone-200 focus:outline-none focus:border-stone-600 focus:bg-stone-900 placeholder:text-stone-600 transition-colors" />
                  </div>
                  <input type="text" placeholder="Bairro" value={data.bairro} onChange={e=>setData({...data, bairro: e.target.value})} className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl px-5 py-4 text-base text-stone-200 focus:outline-none focus:border-stone-600 focus:bg-stone-900 placeholder:text-stone-600 transition-colors" />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4">Data</label>
                <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar -mx-6 px-6">
                  {days.map((d, i) => {
                    const sel = data.date?.toDateString() === d.toDateString();
                    return (
                      <button key={i} onClick={() => setData({...data, date: d, time: ''})} className={`shrink-0 snap-start w-20 py-4 flex flex-col items-center justify-center border rounded-2xl transition-all ${sel ? 'bg-stone-200 text-stone-950 border-stone-200' : 'bg-stone-900/30 border-stone-800/80 text-stone-500 hover:bg-stone-900'}`}>
                        <span className="text-[10px] uppercase font-bold tracking-widest mb-1">{d.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3)}</span>
                        <span className="text-2xl font-light">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {data.date && (
                <div className="animate-in fade-in">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4">Horário</label>
                  <div className="grid grid-cols-3 gap-3">
                    {getSlots().map(t => {
                      const sel = data.time === t;
                      const isPeak = PEAK_HOURS.includes(t) && data.locType !== 'studio';
                      return (
                        <button key={t} onClick={() => { vibrate(15); setData({...data, time: t}); }} className={`py-4 flex flex-col items-center justify-center border rounded-2xl transition-all ${sel ? 'bg-stone-800 text-stone-200 border-stone-600' : 'bg-stone-900/30 border-stone-800/80 text-stone-500 hover:bg-stone-900'}`}>
                          <span className="text-sm font-medium">{t}</span>
                          {isPeak && <span className={`text-[8px] uppercase font-bold tracking-[0.2em] mt-1 ${sel ? 'text-amber-200/70' : 'text-amber-700/50'}`}>Pico +R$18</span>}
                        </button>
                      )
                    })}
                    {getSlots().length === 0 && <p className="col-span-3 text-sm text-stone-600 text-center py-6">Agenda encerrada para hoje.</p>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={() => setStep(1)} className="bg-stone-900/50 text-stone-400 w-1/3 py-4 text-[11px] font-bold tracking-widest uppercase rounded-xl border border-stone-800 hover:bg-stone-900 transition-colors">Voltar</button>
              <button 
                disabled={!(data.name.length > 2 && data.date && data.time && (data.locType === 'studio' || (data.street && data.number && data.bairro)))} 
                onClick={() => { vibrate(30); setStep(3); }} 
                className="bg-emerald-700 text-stone-50 flex-1 py-4 text-[11px] font-bold tracking-widest uppercase rounded-xl disabled:opacity-20 disabled:bg-stone-800 transition-all"
              >
                Revisar 
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase mb-3">Passo 3</h2>
            <h1 className="text-3xl font-light tracking-wide mb-10 text-stone-100">Resumo</h1>

            <div className="space-y-8 mb-10">
              
              <div className="p-7 bg-stone-900 rounded-3xl border border-stone-800/50">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm items-center"><span className="text-stone-400">Pacote Escolhido</span><span className="text-stone-200 font-medium">{formatMoney(invoice.base)}</span></div>
                  {invoice.addonsTotal > 0 && <div className="flex justify-between text-sm items-center"><span className="text-stone-400">Adicionais</span><span className="text-stone-400 font-medium">+{formatMoney(invoice.addonsTotal)}</span></div>}
                  {invoice.reqFee > 0 && <div className="flex justify-between text-sm items-center"><span className="text-stone-500">Adicional Específico</span><span className="text-stone-500 font-medium">+{formatMoney(invoice.reqFee)}</span></div>}
                  
                  {appliedCoupon ? (
                    <div className="flex justify-between text-sm items-center py-4 border-y border-stone-800/50 my-2">
                      <span className="text-amber-500 font-medium flex items-center gap-2"><Icon name="check" size={16}/> Cupom {appliedCoupon}</span>
                      <span className="text-amber-500 font-medium">-{formatMoney(invoice.discount)}</span>
                    </div>
                  ) : (!isReturningClient && (
                    <div className="flex justify-between text-sm items-center py-4 border-y border-stone-800/50 my-2">
                      <span className="text-amber-500 font-medium flex items-center gap-2"><Icon name="check" size={16}/> Presente de 1ª Sessão</span>
                      <span className="text-amber-500 font-medium">-{formatMoney(invoice.discount)}</span>
                    </div>
                  ))}
                  
                  {invoice.peakFee > 0 && <div className="flex justify-between text-sm items-center"><span className="text-stone-400">Deslocamento/Pico</span><span className="text-stone-300 font-medium">+{formatMoney(invoice.peakFee)}</span></div>}
                  {invoice.pixDiscount > 0 && <div className="flex justify-between text-sm items-center"><span className="text-amber-500">Desconto Pix (3%)</span><span className="text-amber-500 font-medium">-{formatMoney(invoice.pixDiscount)}</span></div>}
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-stone-800/80">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Total a Pagar</span>
                  <span className="text-4xl font-light text-stone-100 tracking-wide">{formatMoney(invoice.total)}</span>
                </div>
              </div>

              {!appliedCoupon && (
                <div className="animate-in fade-in">
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">Possui Cupom?</label>
                  <div className="flex gap-2">
                    <input type="text" placeholder="Código" value={couponInput} onChange={e => {setCouponInput(e.target.value); setCouponError('');}} className={`flex-1 bg-stone-900/50 border ${couponError ? 'border-red-900/50' : 'border-stone-800'} rounded-2xl px-5 py-4 text-sm text-stone-200 focus:outline-none focus:bg-stone-900 transition-colors uppercase placeholder:text-stone-600`} />
                    <button onClick={handleApplyCoupon} className="bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl transition-colors outline-none border border-stone-700/50">Aplicar</button>
                  </div>
                  {couponError && <p className="text-xs text-red-400/80 mt-2 ml-2">{couponError}</p>}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-3">( 1 ) pedido específico, fetiche? (+ R$ {CONFIG.FETISH_FEE})</label>
                <input type="text" placeholder="Ex: Algum detalhe ou vontade para a sessão..." value={data.req} onChange={e=>setData({...data, req:e.target.value})} className="w-full bg-stone-900/50 border border-stone-800 rounded-2xl px-5 py-4 text-sm text-stone-200 focus:outline-none focus:border-stone-600 focus:bg-stone-900 transition-colors placeholder:text-stone-600" />
                <p className="text-[11px] text-stone-500 mt-3 leading-relaxed">Pedido avaliado no momento do atendimento. Se inviável, o valor não será cobrado.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-4">Pagamento do Restante</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{id:'pix', l:'Pix (-3%)'},{id:'card', l:'Cartão Até 12x (Consultar)'},{id:'cash', l:'Dinheiro'}].map(p => (
                    <button key={p.id} onClick={() => handlePaymentSelect(p.id)} className={`py-4 text-[10px] font-bold uppercase tracking-wider border rounded-2xl transition-all ${data.payment === p.id ? 'bg-stone-800 text-stone-200 border-stone-600' : 'bg-stone-900/30 border-stone-800/80 text-stone-500 hover:bg-stone-900'}`}>{p.l}</button>
                  ))}
                </div>
              </div>

              <div className="bg-amber-900/10 border border-amber-900/20 p-6 rounded-3xl text-center">
                <p className="text-sm text-amber-500/90 leading-relaxed">
                  Para confirmar o horário, é necessário um sinal de <strong className="text-amber-400">R$ 50 via Pix</strong> agora. O restante é acertado após a sessão.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <button onClick={() => setStep(2)} className="bg-stone-900/50 text-stone-400 w-1/4 py-5 text-[11px] font-bold tracking-widest uppercase rounded-xl border border-stone-800 hover:bg-stone-900 transition-colors">Voltar</button>
              <a 
                href={data.payment ? generateWhatsAppLink() : '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!data.payment) {
                    e.preventDefault();
                  } else {
                    localStorage.setItem('thaly_returning_final', 'yes');
                    localStorage.removeItem('thaly_draft_booking');
                    vibrate([30, 50]);
                    setTimeout(() => setStep(4), 500);
                  }
                }}
                className={`flex-1 py-5 text-[11px] font-bold tracking-[0.15em] uppercase rounded-xl flex items-center justify-center text-center transition-all ${data.payment ? 'bg-stone-100 text-stone-950 hover:bg-white' : 'bg-stone-900/30 text-stone-700 cursor-not-allowed border border-stone-800'}`}
              >
                Concluir no WhatsApp
              </a>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center justify-center min-h-[60vh] text-center mt-10">
            <div className="w-20 h-20 bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 border border-emerald-800/50 shadow-lg shadow-emerald-900/20">
              <Icon name="check" size={32} className="text-emerald-500" />
            </div>
            
            <h1 className="text-3xl font-light tracking-wide mb-4 text-stone-100">Tudo pronto!</h1>
            
            <p className="text-sm text-stone-400 leading-relaxed mb-10 max-w-sm">
              Sua solicitação de reserva foi gerada. Se o WhatsApp não abrir automaticamente, clique no botão abaixo para forçar o envio. <br/><br/>
              <strong className="text-amber-500/90 font-medium">Não esqueça de enviar o comprovante do sinal na conversa.</strong>
            </p>

            <div className="w-full max-w-xs space-y-4">
              <a 
                href={generateWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => vibrate(15)}
                className="block w-full bg-emerald-700 text-stone-50 py-4 text-[11px] font-bold tracking-[0.15em] uppercase rounded-xl transition-transform active:scale-[0.98]"
              >
                Reenviar Mensagem
              </a>
              <button 
                onClick={resetFlow}
                className="block w-full bg-stone-900/50 text-stone-400 py-4 text-[11px] font-bold tracking-widest uppercase rounded-xl border border-stone-800 hover:bg-stone-900 transition-colors"
              >
                Voltar ao Início
              </button>
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
