import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

// ==================================================================================
// 1. CONFIGURAÇÕES E DADOS DE NEGÓCIO
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  PIX_KEY: "5517991360413",
  INSTAGRAM: "https://www.instagram.com/relaxarhojesp",
  SIGNAL_AMOUNT: 50,
  START_HOUR: 9,
  END_HOUR: 22,
  FIRST_TIME_DISCOUNT: 15,
};

const BASE_SESSION = {
  price: 180,
  min: 60,
  title: 'Relaxamento Base',
  desc: 'Massagem profunda no corpo todo. Uso a força certa das minhas mãos para desfazer os nós de tensão e amassar a musculatura. Você entra cansado e sai leve.'
};

const SESSION_UPGRADES = [
  { 
    id: 'up_tantrica', 
    label: 'Finalização Íntima', 
    price: 40, 
    desc: 'A transição do relaxamento para o prazer. Toques leves e focados que terminam no alívio completo da tensão acumulada.' 
  },
  { 
    id: 'up_naturista', 
    label: 'Sessão Totalmente Nu', 
    price: 60, 
    desc: 'Removemos a barreira da roupa. Nós dois ficamos sem nada do início ao fim para aumentar a liberdade e a conexão visual.' 
  },
  { 
    id: 'up_fusion', 
    label: 'Contato Corpo a Corpo', 
    price: 90, 
    desc: 'Fico de cueca e abandono o uso apenas das mãos. Uso o calor do meu peito, pernas e a textura da minha barba deslizando no seu corpo.' 
  },
  { 
    id: 'up_nuru', 
    label: 'Massagem Nuru com Gel', 
    price: 150, 
    desc: 'A quebra total do espaço pessoal. Nós dois sem roupa, muito gel escorregadio e uso o meu corpo inteiro colado no seu para a massagem.' 
  },
  { 
    id: 'up_interacao', 
    label: 'Interação e Troca (A Sua Vez)', 
    price: 200, 
    desc: 'Você assume o controle. Total liberdade para tocar, explorar e retribuir a massagem no meu corpo da forma que você sentir vontade.' 
  }
];

const ADDONS = [
  { id: 'time', label: '+30 minutos extras', price: 75 },
  { id: 'aparo', label: 'Aparo de Pelos (Máquina)', price: 107 },
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
  'plus': 'M12 5v14M5 12h14'
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
  const numberInputRef = useRef(null);

  const [data, setData] = useState({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', 
    date: null, time: '', req: '', payment: '',
    upgrades: {}, addons: {}
  });

  // Inicialização
  useEffect(() => {
    const hasOnboarded = localStorage.getItem('thaly_onboard_final');
    const hasBookedBefore = localStorage.getItem('thaly_returning_final');
    if (hasOnboarded === 'yes') setStep(1);
    if (hasBookedBefore === 'yes') setIsReturningClient(true);
  }, []);

  // Rola a tela suavemente ao trocar de passo
  useEffect(() => {
    if (step > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Matemática Centralizada
  const invoice = useMemo(() => {
    let subtotal = BASE_SESSION.price;
    let dur = BASE_SESSION.min;
    let upgradesTotal = 0;
    let addonsTotal = 0;
    let activeUpgrades = [];
    let activeAddons = [];
    
    SESSION_UPGRADES.forEach(up => {
      if (data.upgrades[up.id]) {
        upgradesTotal += up.price;
        activeUpgrades.push(up);
      }
    });

    ADDONS.forEach(addon => {
      if (data.addons[addon.id]) {
        addonsTotal += addon.price;
        activeAddons.push(addon);
        if (addon.id === 'time') dur += 30;
      }
    });
    
    subtotal += upgradesTotal + addonsTotal;
    
    let reqFee = data.req.trim().length > 3 ? 130 : 0;
    let peakFee = (PEAK_HOURS.includes(data.time) && data.locType !== 'studio') ? PEAK_FEE : 0;
    let autoDiscount = !isReturningClient ? CONFIG.FIRST_TIME_DISCOUNT : 0;
    
    let totalAfterDiscounts = Math.max(0, subtotal + reqFee - autoDiscount);
    let pixDiscount = data.payment === 'pix' ? Math.ceil(totalAfterDiscounts * 0.03) : 0;
    
    let finalTotal = totalAfterDiscounts - pixDiscount + peakFee;
    
    return { 
      base: BASE_SESSION.price, upgradesTotal, addonsTotal, reqFee, peakFee, 
      autoDiscount, pixDiscount, total: finalTotal, sinal: CONFIG.SIGNAL_AMOUNT, dur,
      activeUpgrades, activeAddons
    };
  }, [data, isReturningClient]);

  const days = useMemo(() => Array.from({length: 14}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  }), []);

  const getSlots = () => {
    if (!data.date) return [];
    let s = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) s.push(`${i<10?'0':''}${i}:00`);
    if (data.date.toDateString() === new Date().toDateString()) {
      s = s.filter(t => parseInt(t.split(':')[0]) > new Date().getHours());
    }
    return s;
  };

  const generateWhatsAppLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';
    const locationText = data.locType === 'studio' 
      ? `Irei até a sua Suíte (Bela Vista)` 
      : `Você virá até mim: ${data.street}, ${data.number}, ${data.bairro}`;

    let text = `Oi Thalyson! Fechei pelo site e quero confirmar.\n\n`;
    text += `*NOME:* ${data.name}\n`;
    text += `*DIA E LOCAL:* ${dStr} às ${data.time} | ${locationText}\n\n`;
    
    text += `*MEU PACOTE (Até ${invoice.dur} min):*\n`;
    text += `✅ ${BASE_SESSION.title}\n`;
    invoice.activeUpgrades.forEach(u => text += `✅ ${u.label}\n`);
    invoice.activeAddons.forEach(a => text += `➕ ${a.label}\n`);
    
    if (data.req.trim()) text += `\n*VONTADE ESPECÍFICA:* "${data.req.trim()}"\n`;

    text += `\n*VALOR FINAL:* ${formatMoney(invoice.total)} no ${data.payment.toUpperCase()}\n`;
    text += `*Sinal:* ${formatMoney(invoice.sinal)} (Restante na hora)\n\n`;
    text += `Aguardo sua chave Pix para mandar o sinal!`;
    
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

  // ==================================================================================
  // 4. RENDERIZAÇÃO DAS ETAPAS
  // ==================================================================================
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 pb-20">
      
      {/* HEADER (Mostrado após o Gate) */}
      {step > 0 && (
        <header className="px-6 py-8 max-w-lg mx-auto flex justify-between items-center border-b border-zinc-800/50 mb-8">
          <div className="flex items-center gap-4">
            <img src="FmtU3Ogx_400x400.jpg" alt="Thalyson" className="w-12 h-12 rounded-full border border-zinc-800 object-cover" />
            <div>
              <h1 className="text-xl font-medium tracking-tight text-white">Thalyson.</h1>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Atendimento Masculino</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[1,2,3].map(i => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-white' : 'w-2 bg-zinc-800'}`} />
            ))}
          </div>
        </header>
      )}

      <main className="px-6 max-w-lg mx-auto">
        
        {/* PASSO 0: GATE DE ENTRADA */}
        {step === 0 && (
          <div className="flex flex-col justify-center min-h-[85vh] animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-10 leading-tight text-white">Seu momento<br/>reservado.</h1>
            
            <div className="space-y-4 mb-12">
              <div className="flex gap-4 p-5 border border-zinc-800 bg-zinc-900/50 rounded-xl">
                <Icon name="shield" className="text-zinc-400 mt-0.5" size={22} />
                <p className="text-zinc-400 text-sm leading-relaxed">Sigilo total. Nada que você preenche aqui fica salvo. Os dados vão direto para o meu WhatsApp particular.</p>
              </div>
              <div className="flex gap-4 p-5 border border-zinc-800 bg-zinc-900/50 rounded-xl">
                <Icon name="lock" className="text-zinc-400 mt-0.5" size={22} />
                <p className="text-zinc-400 text-sm leading-relaxed">O atendimento envolve contato físico intenso. Você confirma que é maior de 18 anos?</p>
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

        {/* PASSO 1: MONTE SUA SESSÃO */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">Passo 1</h2>
            <h1 className="text-3xl font-medium tracking-tight mb-8 text-white">O que você quer sentir hoje?</h1>

            <div className="space-y-4 mb-10">
              {/* Card Base */}
              <div className="p-6 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-white">{BASE_SESSION.title}</h3>
                  <span className="font-bold text-lg text-emerald-400">{formatMoney(BASE_SESSION.price)}</span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{BASE_SESSION.desc}</p>
                <span className="inline-block px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold uppercase tracking-wider rounded-md">Até {BASE_SESSION.min} Minutos</span>
              </div>

              <div className="pt-6 pb-2">
                <h3 className="text-sm font-bold text-white mb-1">Evolua sua sessão (Opcional)</h3>
                <p className="text-xs text-zinc-500">Selecione os toques adicionais que você deseja incluir.</p>
              </div>

              {/* Upgrades */}
              {SESSION_UPGRADES.map(up => {
                const isActive = data.upgrades[up.id];
                return (
                  <button 
                    key={up.id}
                    onClick={() => { vibrate(15); setData(p => ({...p, upgrades: {...p.upgrades, [up.id]: !isActive}})); }}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 outline-none flex gap-4 items-center ${
                      isActive ? 'bg-pink-950/30 border-pink-500/50' : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isActive ? 'border-pink-500 bg-pink-500' : 'border-zinc-700'}`}>
                      {isActive && <Icon name="check" size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className={`font-bold text-base ${isActive ? 'text-pink-400' : 'text-zinc-200'}`}>{up.label}</h4>
                        <span className={`font-bold text-sm ${isActive ? 'text-pink-400' : 'text-zinc-500'}`}>+ {formatMoney(up.price)}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{up.desc}</p>
                    </div>
                  </button>
                )
              })}
              
              {/* Addons Práticos */}
              <div className="pt-6">
                <h3 className="text-sm font-bold text-white mb-3">Extras Práticos</h3>
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

            <div className="fixed bottom-0 left-0 w-full p-4 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-900 z-50">
              <div className="max-w-lg mx-auto flex gap-4 items-center">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Subtotal</p>
                  <p className="text-2xl font-bold text-white">{formatMoney(invoice.base + invoice.upgradesTotal + invoice.addonsTotal)}</p>
                </div>
                <button 
                  onClick={() => { vibrate(30); setStep(2); }} 
                  className="bg-emerald-500 text-zinc-950 px-8 py-4 text-sm font-bold tracking-widest uppercase rounded-xl transition-transform active:scale-[0.98]"
                >
                  Avançar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PASSO 2: DADOS E HORÁRIO */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">Passo 2</h2>
            <h1 className="text-3xl font-medium tracking-tight mb-8 text-white">Onde e Quando?</h1>

            <div className="space-y-8 mb-10">
              {/* Nome */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Seu Nome</label>
                <input type="text" value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-base text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-zinc-600" placeholder="Como gosta de ser chamado?" />
              </div>

              {/* Local */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Local do Atendimento</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={()=>setData({...data, locType:'studio'})} className={`py-4 px-2 text-sm font-bold outline-none transition-colors border rounded-xl ${data.locType==='studio' ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>Na minha Suíte</button>
                  <button onClick={()=>setData({...data, locType:'home'})} className={`py-4 px-2 text-sm font-bold outline-none transition-colors border rounded-xl ${data.locType==='home' ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>Vou até você</button>
                </div>
              </div>

              {data.locType === 'studio' && (
                <p className="text-sm text-zinc-400 bg-zinc-900 p-5 rounded-xl border border-zinc-800 leading-relaxed">Meu espaço fica na <strong>Bela Vista</strong>. Após o agendamento, envio o endereço completo e as instruções no WhatsApp.</p>
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

              {/* Data */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Qual Dia?</label>
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

              {/* Horário */}
              {data.date && (
                <div className="animate-in fade-in">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Qual Horário?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {getSlots().map(t => {
                      const sel = data.time === t;
                      return (
                        <button key={t} onClick={() => { vibrate(15); setData({...data, time: t}); }} className={`py-4 text-sm font-bold border rounded-xl transition-colors ${sel ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>
                          {t}
                        </button>
                      )
                    })}
                    {getSlots().length === 0 && <p className="col-span-3 text-sm text-zinc-500 text-center py-6">Nenhum horário disponível hoje.</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Botoes de Navegação */}
            <div className="flex gap-3 mb-24">
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

        {/* PASSO 3: CHECKOUT */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-2">Passo 3</h2>
            <h1 className="text-3xl font-medium tracking-tight mb-8 text-white">Resumo e Pagamento</h1>

            <div className="space-y-8 mb-10">
              
              {/* Resumo Financeiro */}
              <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-zinc-400">Sessão Base</span><span className="text-white font-medium">{formatMoney(invoice.base)}</span></div>
                  {invoice.upgradesTotal > 0 && <div className="flex justify-between text-sm"><span className="text-zinc-400">Upgrades</span><span className="text-pink-400 font-medium">+{formatMoney(invoice.upgradesTotal)}</span></div>}
                  {invoice.addonsTotal > 0 && <div className="flex justify-between text-sm"><span className="text-zinc-400">Adicionais</span><span className="text-emerald-400 font-medium">+{formatMoney(invoice.addonsTotal)}</span></div>}
                  
                  {/* Desconto Automático 1a Vez */}
                  {!isReturningClient && (
                    <div className="flex justify-between text-sm items-center py-2 border-y border-zinc-800 my-2">
                      <span className="text-emerald-400 font-bold flex items-center gap-2"><Icon name="check" size={16}/> Presente de 1ª Vez</span>
                      <span className="text-emerald-400 font-bold">-{formatMoney(invoice.autoDiscount)}</span>
                    </div>
                  )}
                  
                  {invoice.peakFee > 0 && <div className="flex justify-between text-sm"><span className="text-zinc-400">Taxa Deslocamento/Pico</span><span className="text-white font-medium">+{formatMoney(invoice.peakFee)}</span></div>}
                  {invoice.pixDiscount > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-400">Desconto Pix (3%)</span><span className="text-emerald-400 font-medium">-{formatMoney(invoice.pixDiscount)}</span></div>}
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-zinc-800">
                  <span className="text-sm uppercase tracking-widest text-zinc-500 font-bold">Total a Pagar</span>
                  <span className="text-4xl font-medium text-white tracking-tight">{formatMoney(invoice.total)}</span>
                </div>
              </div>

              {/* Vontade Específica */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Vontade Específica (Opcional)</label>
                <input type="text" placeholder="Alguma fantasia ou pedido especial?" value={data.req} onChange={e=>setData({...data, req:e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-zinc-500 placeholder:text-zinc-600" />
                <p className="text-xs text-zinc-500 mt-2">Avaliamos na hora. Se não rolar, não tem taxa.</p>
              </div>

              {/* Pagamento */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Como vai pagar na hora?</label>
                <div className="grid grid-cols-3 gap-3">
                  {[{id:'pix', l:'Pix (-3%)'},{id:'card', l:'Cartão'},{id:'cash', l:'Dinheiro'}].map(p => (
                    <button key={p.id} onClick={() => { vibrate(15); setData({...data, payment: p.id}) }} className={`py-4 text-xs font-bold uppercase tracking-wider border rounded-xl transition-colors ${data.payment === p.id ? 'bg-zinc-100 text-zinc-900 border-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}>{p.l}</button>
                  ))}
                </div>
              </div>

              {/* Aviso de Sinal */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-xl text-center">
                <p className="text-sm text-emerald-400/90 leading-relaxed">
                  Para garantir o horário na agenda, o sinal é de <strong className="text-emerald-400">R$ 50 via Pix</strong>. O restante acerta lá na hora!
                </p>
              </div>
            </div>

            <div className="flex gap-3 mb-24">
              <button onClick={() => setStep(2)} className="bg-zinc-900 text-zinc-300 w-1/4 py-5 text-xs font-bold tracking-widest uppercase rounded-xl border border-zinc-800">Voltar</button>
              <a 
                href={data.payment ? generateWhatsAppLink() : '#'}
                onClick={(e) => {
                  if (!data.payment) e.preventDefault();
                  else {
                    localStorage.setItem('thaly_returning_final', 'yes');
                    vibrate([30, 50]);
                  }
                }}
                className={`flex-1 py-5 text-sm font-bold tracking-widest uppercase rounded-xl flex items-center justify-center text-center transition-all ${data.payment ? 'bg-white text-black hover:bg-zinc-200' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'}`}
              >
                Gerar meu Pedido
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
