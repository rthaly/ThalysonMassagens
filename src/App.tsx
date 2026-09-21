Para criar algo **único e nunca feito antes**, precisamos abandonar o formato tradicional de "formulário de loja virtual" (onde você coloca itens no carrinho) e adotar uma **jornada sensorial e interativa**.

Agendar um momento íntimo e relaxante não deve parecer uma compra na Amazon. Deve parecer o início da própria sessão.

Nesta versão, criei o conceito **"Frequência"**. O design é cinematográfico, inspirado no minimalismo tátil, com textura analógica (granulado de filme) e iluminação dinâmica que muda de cor dependendo do "clima" que o cliente escolhe. A cópia (textos) segue exatamente sua diretriz: conversa direta, inteligente, sem jargões corporativos, sem exageros e sem travessões.

O sistema de etapas guia o usuário por uma tela limpa, reduzindo a ansiedade e aumentando muito a conversão.

Aqui está o código completo. Copie e substitua no seu ambiente:

```tsx
import React, { useState, useEffect, useMemo, useRef, memo } from 'react';

// ==================================================================================
// CONFIGURAÇÃO
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM: "https://www.instagram.com/relaxarhojesp",
  ADDRESS_AREA: "Bela Vista, São Paulo",
  START_HOUR: 9,
  END_HOUR: 22,
};

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
const PEAK_FEE = 15;

// ==================================================================================
// ESTÉTICA E DADOS (Abordagem por Estado de Espírito / Mood)
// ==================================================================================
const MOODS = [
  {
    id: 'classica',
    title: 'Desatar os nós',
    subtitle: 'Tensão e peso nas costas.',
    color: '#3f3f46', // Zinc
    accent: '#a1a1aa',
    service: 'Massagem Clássica',
    desc: 'Corpo todo, pressão firme. Estritamente terapêutica para alívio muscular profundo.',
    price: 180,
    min: 60,
    includesLingam: false
  },
  {
    id: 'sensitiva',
    title: 'Despertar',
    subtitle: 'Mente cansada, corpo dormente.',
    color: '#713f12', // Yellow/Amber escuro
    accent: '#fbbf24',
    service: 'Massagem Sensitiva',
    desc: 'Inicia com alívio de tensão e evolui para toques sutis. Inclui técnica íntima (Lingam) para alívio mental.',
    price: 200,
    min: 60,
    includesLingam: true
  },
  {
    id: 'fusion',
    title: 'Proximidade',
    subtitle: 'Buscando contato físico real.',
    color: '#831843', // Rose escuro
    accent: '#f43f5e',
    service: 'Experiência Fusion',
    desc: 'Atendo apenas de cueca. Contato intenso, corpo a corpo e barba. Inclui técnica íntima prolongada.',
    price: 250,
    min: 60,
    includesLingam: true
  },
  {
    id: 'nuru',
    title: 'Imersão Total',
    subtitle: 'Desconexão absoluta da rotina.',
    color: '#1e1b4b', // Indigo escuro
    accent: '#818cf8',
    service: 'Massagem Nuru',
    desc: 'Nós dois sem roupas do início ao fim. Muito gel deslizante, fluidez total de corpos frente e costas.',
    price: 350,
    min: 60,
    includesLingam: true
  },
  {
    id: 'reversa',
    title: 'Assumir o Controle',
    subtitle: 'Vontade de explorar e ditar o ritmo.',
    color: '#14532d', // Verde escuro
    accent: '#4ade80',
    service: 'Massagem Reversa',
    desc: 'Eu preparo o seu corpo para relaxar, depois o controle passa para você explorar e guiar o contato.',
    price: 400,
    min: 60,
    includesLingam: true
  }
];

const EXTRAS = [
  { id: 'aroma', price: 20, label: 'Aromaterapia' },
  { id: 'time', price: 75, label: 'Estender (+30min)' }
];

// ==================================================================================
// UTILITÁRIOS
// ==================================================================================
const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 20) => { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

// ==================================================================================
// COMPONENTE: SVG Noise & Estilos
// ==================================================================================
const CinematicStyles = memo(() => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap');

    *, *::before, *::after { box-sizing: border-box; }
    
    :root {
      --font-ui: 'DM Sans', sans-serif;
      --font-serif: 'Newsreader', serif;
      --c-bg: #09090b;
      --c-text: #fafafa;
    }

    body, html { 
      background-color: var(--c-bg); 
      color: var(--c-text); 
      font-family: var(--font-ui);
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      margin: 0; padding: 0;
    }

    .grain-overlay {
      position: fixed; inset: 0; z-index: 50; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
    }

    .ambient-glow {
      position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 150vw; height: 150vh; opacity: 0.15; filter: blur(120px);
      transition: background-color 1.5s cubic-bezier(0.25, 1, 0.5, 1);
      z-index: 0; pointer-events: none;
    }

    .step-enter { animation: stepEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes stepEnter {
      0% { opacity: 0; transform: translateY(20px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    .modern-input {
      background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.1);
      color: white; border-radius: 0; padding: 12px 0; transition: border-color 0.3s;
    }
    .modern-input:focus { outline: none; border-bottom-color: rgba(255,255,255,0.8); }
    .modern-input::placeholder { color: rgba(255,255,255,0.2); }

    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}} />
));

// ==================================================================================
// APP PRINCIPAL
// ==================================================================================
export default function App() {
  // Estados de Fluxo
  const [step, setStep] = useState(0); // 0: Age Gate, 1: Mood, 2: Loc/Ident, 3: Date, 4: Pay/Review, 5: Done
  const [giftApplied, setGiftApplied] = useState(false);
  
  // Estado do Booking
  const [mood, setMood] = useState(MOODS[0]);
  const [data, setData] = useState({
    name: '', age: '', locType: '', cep: '', street: '', number: '', comp: '', 
    date: null as Date | null, time: '', extras: {} as Record<string, boolean>,
    req: '', payment: ''
  });

  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    const isAdult = localStorage.getItem('thaly_adult_v6');
    const hasGift = localStorage.getItem('thaly_gift_v6');
    if (isAdult === 'yes') setStep(1);
    if (hasGift === 'yes') setGiftApplied(true);
  }, []);

  const acceptAdult = () => {
    vibrate(30);
    localStorage.setItem('thaly_adult_v6', 'yes');
    setStep(1);
  };

  const applyGift = () => {
    vibrate([40, 60]);
    localStorage.setItem('thaly_gift_v6', 'yes');
    setGiftApplied(true);
  };

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    setData(prev => ({ ...prev, cep: masked }));
    if (masked.length === 9) {
      setCepLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const json = await res.json();
        if (!json.erro) setData(prev => ({ ...prev, street: json.logradouro }));
      } catch (e) {} finally {
        setCepLoading(false);
      }
    }
  };

  // Cálculos Financeiros
  const fin = useMemo(() => {
    let sub = mood.price;
    let dur = mood.min;
    
    if (data.extras['time']) { sub += 75; dur += 30; }
    if (data.extras['aroma']) sub += 20;
    
    const reqFee = data.req.trim().length > 3 ? 130 : 0;
    sub += reqFee;

    const peak = (PEAK_HOURS.includes(data.time) && data.locType !== 'studio') ? PEAK_FEE : 0;
    const discount = giftApplied ? 15 : 0;
    
    const base = Math.max(0, sub - discount);
    const pix = data.payment === 'pix' ? Math.ceil(base * 0.03) : 0;
    
    return { sub, peak, discount, reqFee, pix, total: (base - pix) + peak, dur };
  }, [mood, data, giftApplied]);

  // Gera dias
  const days = useMemo(() => Array.from({length: 15}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  }), []);

  const getSlots = () => {
    if (!data.date) return [];
    let s = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) s.push(`${i<10?'0':''}${i}:00`);
    if (data.date.toDateString() === new Date().toDateString()) s = s.filter(t => parseInt(t) > new Date().getHours());
    return s;
  };

  const sendWhatsApp = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';
    const ext = Object.keys(data.extras).filter(k=>data.extras[k]).map(k=>EXTRAS.find(e=>e.id===k)?.label).join(', ');
    const loc = data.locType === 'studio' ? 'Estúdio (Bela Vista)' : `${data.street}, ${data.number} ${data.comp}`;
    const rTxt = data.req ? `\nPedido Especial (+R$ 130,00): "${data.req.trim()}"` : '';

    const text = `*NOVA RESERVA*\n\n👤 ${data.name} (${data.age} anos)\n📅 ${dStr} às ${data.time}\n⏳ ~${fin.dur} min\n\n*Sessão:* ${mood.service}\n*Onde:* ${loc}${ext ? `\n*Extras:* ${ext}`:''}${rTxt}\n\n*Pagamento:* ${data.payment.toUpperCase()}\n💰 *Total:* ${formatMoney(fin.total)}`;
    
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Renderização Dinâmica por Passo
  return (
    <>
      <CinematicStyles />
      <div className="grain-overlay" />
      <div className="ambient-glow" style={{ backgroundColor: mood.color }} />

      <div className="relative z-10 min-h-screen flex flex-col pt-12 pb-32 px-6 max-w-md mx-auto">
        
        {/* Cabecalho Minimalista */}
        {step > 0 && step < 5 && (
          <header className="flex justify-between items-center mb-12 step-enter">
            <span style={{ fontFamily: 'var(--font-serif)' }} className="text-xl italic text-white/90">Thalyson.</span>
            <div className="flex gap-1">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-white' : 'w-2 bg-white/20'}`} />
              ))}
            </div>
          </header>
        )}

        {/* STEP 0: O AVISO */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center step-enter">
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl leading-tight mb-6">Ambiente<br/>Reservado.</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-10">
              O atendimento é feito de forma individual. Algumas das experiências incluem contato físico próximo e técnicas íntimas focadas no relaxamento profundo. Confirma ter mais de 18 anos para prosseguir?
            </p>
            <button onClick={acceptAdult} className="bg-white text-black h-14 w-full rounded-none font-medium text-sm tracking-widest uppercase transition-transform active:scale-95">
              Sim, tenho mais de 18 anos
            </button>
          </div>
        )}

        {/* STEP 1: A FREQUÊNCIA (Serviços reinventados) */}
        {step === 1 && (
          <div className="flex-1 flex flex-col step-enter">
            <h2 className="text-sm font-medium tracking-widest text-white/50 uppercase mb-2">Etapa 01</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">Como você quer se sentir hoje?</h1>
            
            <div className="flex flex-col gap-3">
              {MOODS.map(m => {
                const active = mood.id === m.id;
                return (
                  <button key={m.id} onClick={() => { vibrate(20); setMood(m); }}
                    className={`text-left p-5 transition-all duration-500 border ${active ? 'bg-white/10 backdrop-blur-md' : 'border-white/5 hover:border-white/20 bg-transparent'}`}
                    style={{ borderColor: active ? m.accent : '' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: active ? m.accent : 'rgba(255,255,255,0.4)' }}>{m.title}</p>
                    <p className={`text-sm ${active ? 'text-white' : 'text-white/60'}`}>{m.subtitle}</p>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 p-6 bg-black/40 backdrop-blur-xl border border-white/10 min-h-[140px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{mood.service}</h3>
                <span className="text-sm" style={{ color: mood.accent }}>Até {mood.min}m</span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{mood.desc}</p>
            </div>

            <button onClick={() => { vibrate(30); setStep(2); }} className="mt-12 bg-white text-black h-14 w-full font-medium tracking-widest uppercase transition-transform active:scale-95">
              Continuar
            </button>
          </div>
        )}

        {/* STEP 2: COORDENADAS */}
        {step === 2 && (
          <div className="flex-1 flex flex-col step-enter">
            <h2 className="text-sm font-medium tracking-widest text-white/50 uppercase mb-2">Etapa 02</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">Quem e Onde.</h1>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input type="text" placeholder="Nome ou Apelido" value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="w-full modern-input" />
                </div>
                <div className="w-20">
                  <input type="tel" maxLength={2} placeholder="Idade" value={data.age} onChange={e=>setData({...data, age: e.target.value.replace(/\D/g,'')})} className="w-full modern-input text-center" />
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Local do Encontro</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={()=>setData({...data, locType:'studio'})} className={`py-4 text-sm transition-colors border ${data.locType==='studio' ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>Meu Espaço</button>
                  <button onClick={()=>setData({...data, locType:'home'})} className={`py-4 text-sm transition-colors border ${data.locType==='home' ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>Outro Local</button>
                </div>
              </div>

              {data.locType === 'studio' && <p className="text-sm text-white/60 bg-white/5 p-4 border border-white/10 leading-relaxed">Eu atendo na Bela Vista. O endereço completo é liberado no WhatsApp após confirmarmos o horário, garantindo discrição para nós dois.</p>}
              
              {data.locType === 'home' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <input type="tel" maxLength={9} placeholder="CEP (opcional)" value={data.cep} onChange={e=>handleCep(e.target.value)} className="w-full modern-input" />
                  <input type="text" placeholder="Rua ou Hotel" value={data.street} onChange={e=>setData({...data, street: e.target.value})} className="w-full modern-input" />
                  <div className="flex gap-4">
                    <input type="text" placeholder="Número" value={data.number} onChange={e=>setData({...data, number: e.target.value})} className="w-1/3 modern-input" />
                    <input type="text" placeholder="Complemento / Quarto" value={data.comp} onChange={e=>setData({...data, comp: e.target.value})} className="w-2/3 modern-input" />
                  </div>
                </div>
              )}
            </div>

            <button disabled={!data.name || !data.age || !data.locType || (data.locType==='home' && !data.street)} onClick={() => { vibrate(30); setStep(3); }} className="mt-12 bg-white text-black h-14 w-full font-medium tracking-widest uppercase disabled:opacity-30 disabled:cursor-not-allowed">
              Avançar
            </button>
          </div>
        )}

        {/* STEP 3: TEMPO */}
        {step === 3 && (
          <div className="flex-1 flex flex-col step-enter">
            <h2 className="text-sm font-medium tracking-widest text-white/50 uppercase mb-2">Etapa 03</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">O Momento.</h1>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2 mb-8">
              {days.map((d, i) => {
                const sel = data.date?.toDateString() === d.toDateString();
                return (
                  <button key={i} onClick={() => setData({...data, date: d, time: ''})} className={`shrink-0 w-16 h-20 flex flex-col items-center justify-center border transition-all ${sel ? 'bg-white text-black border-white' : 'border-white/10 text-white/50'}`}>
                    <span className="text-[10px] uppercase font-bold tracking-widest">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                    <span style={{ fontFamily: 'var(--font-serif)' }} className="text-2xl mt-1">{d.getDate()}</span>
                  </button>
                )
              })}
            </div>

            {data.date && (
              <div className="grid grid-cols-3 gap-3 animate-in fade-in">
                {getSlots().map(t => {
                  const sel = data.time === t;
                  return (
                    <button key={t} onClick={() => setData({...data, time: t})} className={`py-4 text-sm font-medium border transition-colors ${sel ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>
                      {t}
                    </button>
                  )
                })}
              </div>
            )}

            <button disabled={!data.date || !data.time} onClick={() => { vibrate(30); setStep(4); }} className="mt-auto pt-12 bg-white text-black h-14 w-full font-medium tracking-widest uppercase disabled:opacity-30">
              Ir para Ajustes Finais
            </button>
          </div>
        )}

        {/* STEP 4: O ACORDO */}
        {step === 4 && (
          <div className="flex-1 flex flex-col step-enter">
            <h2 className="text-sm font-medium tracking-widest text-white/50 uppercase mb-2">Etapa 04</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">O Acordo.</h1>

            <div className="space-y-8">
              {!giftApplied && (
                <div className="p-5 border border-white/20 bg-white/5">
                  <p className="text-sm text-white mb-3 leading-relaxed">Como é sua primeira vez agendando por aqui, liberei um pequeno desconto no valor final. Considere um abraço de boas-vindas.</p>
                  <button onClick={applyGift} className="text-xs font-bold uppercase tracking-widest border-b border-white pb-1">Aplicar Cortesia (R$ 15)</button>
                </div>
              )}

              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Ajustes da Sessão</p>
                <div className="space-y-3">
                  {EXTRAS.map(ex => {
                    const sel = data.extras[ex.id];
                    return (
                      <button key={ex.id} onClick={()=>setData({...data, extras:{...data.extras, [ex.id]:!sel}})} className={`w-full flex justify-between p-4 border text-sm transition-colors ${sel ? 'border-white bg-white/10' : 'border-white/10 text-white/60'}`}>
                        <span>{ex.label}</span>
                        <span>+{formatMoney(ex.price)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs text-white/50 uppercase tracking-widest">Pedido Específico / Fetiche</p>
                  <span className="text-xs text-white/40">+ R$ 130</span>
                </div>
                <input type="text" placeholder="Alguma vontade específica para hoje?" value={data.req} onChange={e=>setData({...data, req:e.target.value})} className="w-full modern-input text-sm" />
                <p className="text-[10px] text-white/40 mt-2">Sujeito a avaliação na hora. Se não for realizado, o valor não será cobrado.</p>
              </div>

              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-4">Pagamento presencial</p>
                <div className="grid grid-cols-3 gap-3">
                  {[{id:'pix', l:'Pix (-3%)'},{id:'card', l:'Cartão'},{id:'cash', l:'Dinheiro'}].map(p => (
                    <button key={p.id} onClick={()=>setData({...data, payment:p.id})} className={`py-4 text-xs uppercase tracking-wider border transition-colors ${data.payment === p.id ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{p.l}</button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm text-white/60 mb-2"><span>Sessão Base</span><span>{formatMoney(mood.price)}</span></div>
                {fin.reqFee > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>Pedido / Fetiche</span><span>+{formatMoney(fin.reqFee)}</span></div>}
                {fin.discount > 0 && <div className="flex justify-between text-sm text-white mb-2"><span>Cortesia</span><span>-{formatMoney(fin.discount)}</span></div>}
                {fin.peak > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>Deslocamento</span><span>+{formatMoney(fin.peak)}</span></div>}
                {fin.pix > 0 && <div className="flex justify-between text-sm text-white mb-2"><span>Desconto Pix</span><span>-{formatMoney(fin.pix)}</span></div>}
                
                <div className="flex justify-between items-end mt-6">
                  <span className="text-sm uppercase tracking-widest text-white/50">Total</span>
                  <span style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl">{formatMoney(fin.total)}</span>
                </div>
              </div>
            </div>

            <button disabled={!data.payment} onClick={() => { vibrate([30,50]); setStep(5); }} className="mt-12 mb-8 bg-white text-black h-14 w-full font-medium tracking-widest uppercase disabled:opacity-30">
              Confirmar e Gerar Pedido
            </button>
          </div>
        )}

        {/* STEP 5: FINAL */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-center text-center step-enter">
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl mb-4">Pronto.</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-12">O seu resumo foi criado. Como prezo pelo sigilo, não guardo seus dados em banco de dados. Envie a mensagem gerada direto no meu WhatsApp para travar o horário na agenda.</p>
            
            <button onClick={sendWhatsApp} className="bg-transparent border border-white text-white h-14 w-full font-medium tracking-widest uppercase transition-colors hover:bg-white hover:text-black">
              Mandar no WhatsApp
            </button>
          </div>
        )}

      </div>
    </>
  );
}

```
