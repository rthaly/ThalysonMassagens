import React, { useState, useEffect, useMemo, memo } from 'react';

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
// DICIONÁRIO E TEXTOS (i18n)
// ==================================================================================
const TEXTS = {
  PT: {
    ageTitle: "Ambiente\nReservado.",
    ageDesc: "O atendimento é feito de forma individual. Algumas das experiências incluem contato físico intenso e técnicas íntimas focadas no relaxamento. Confirma ter mais de 18 anos para prosseguir?",
    ageBtn: "Sim, tenho mais de 18 anos",
    step1Label: "Etapa 01",
    step1Title: "Como você quer se sentir hoje?",
    upTo: "Até",
    btnContinue: "Continuar",
    step2Label: "Etapa 02",
    step2Title: "Quem e Onde.",
    namePlace: "Nome ou Apelido",
    agePlace: "Idade",
    locLabel: "Local do Encontro",
    locStudio: "Meu Espaço",
    locHome: "Outro Local",
    studioDesc: "Eu atendo em um estúdio privativo na Bela Vista. O endereço completo é liberado no WhatsApp após confirmarmos o horário.",
    cep: "CEP (opcional)",
    street: "Rua ou Hotel",
    number: "Número",
    comp: "Apto / Quarto",
    btnNext: "Avançar",
    step3Label: "Etapa 03",
    step3Title: "O Momento.",
    noSlots: "Nenhum horário disponível hoje.",
    btnAdjust: "Ajustes Finais",
    step4Label: "Etapa 04",
    step4Title: "O Acordo.",
    giftDesc: "Como é sua primeira vez agendando por aqui, liberei um pequeno desconto no valor final.",
    giftBtn: "Desbloquear Cortesia (R$ 15)",
    addons: "Adicionais da Sessão",
    reqLabel: "Pedido Específico / Preferência",
    reqPlace: "Tem alguma vontade específica para hoje?",
    reqDesc: "Sujeito a avaliação na hora. Caso não seja possível realizar o pedido, o valor da taxa não será cobrado.",
    payLabel: "Como vai pagar no local?",
    payPix: "Pix (-3%)",
    payCard: "Cartão",
    payCash: "Dinheiro",
    subBase: "Sessão Base",
    subExtras: "Extras",
    subReq: "Pedido Especial",
    subGift: "Cortesia (Primeira Vez)",
    subPeak: "Taxa de Deslocamento",
    subPix: "Desconto Pix",
    total: "Total Final",
    btnFinish: "Finalizar Pedido",
    step5Title: "Tudo Pronto.",
    step5Desc: "O seu resumo foi gerado e o WhatsApp deve ter aberto automaticamente. Caso o seu navegador tenha bloqueado a janela (ou se quiser tentar novamente), clique no botão abaixo.",
    btnSend: "Reenviar no WhatsApp",
    btnBack: "Voltar para o início",
    wtsNew: "NOVA SOLICITAÇÃO DE AGENDAMENTO",
    wtsId: "Identificação",
    wtsName: "Nome",
    wtsYears: "anos",
    wtsSession: "A Sessão",
    wtsDate: "Data",
    wtsDur: "Duração Estimada",
    wtsMood: "Mood escolhido",
    wtsServ: "Serviço",
    wtsHappen: "O que vai rolar",
    wtsExtras: "Extras inclusos",
    wtsLocStudio: "Local: Meu Espaço (Bela Vista, São Paulo)\n🗺️ Endereço exato enviado por aqui após a confirmação.",
    wtsLocHome: "Local",
    wtsReq: "Pedido Especial / Fetiche",
    wtsReqWait: "(Aguardando sua avaliação)",
    wtsFin: "Resumo Financeiro",
    wtsPay: "Pagamento Presencial",
    wtsRulesTitle: "Diretrizes Concordadas",
    wtsRule1: "Higiene prévia (banho recente) é inegociável.",
    wtsRule2: "Sigilo e discrição garantidos para ambas as partes.",
    wtsRule3: "O desrespeito aos limites informados cancela a sessão imediatamente.",
  },
  EN: {
    ageTitle: "Private\nEnvironment.",
    ageDesc: "The service is strictly individual. Some experiences include intense physical contact and intimate relaxation techniques. Do you confirm you are over 18 to proceed?",
    ageBtn: "Yes, I am over 18",
    step1Label: "Step 01",
    step1Title: "How do you want to feel today?",
    upTo: "Up to",
    btnContinue: "Continue",
    step2Label: "Step 02",
    step2Title: "Who and Where.",
    namePlace: "Name or Nickname",
    agePlace: "Age",
    locLabel: "Meeting Place",
    locStudio: "My Studio",
    locHome: "Other Location",
    studioDesc: "I work in a private studio in Bela Vista. The exact address is shared on WhatsApp once we confirm the schedule.",
    cep: "ZIP Code (optional)",
    street: "Street or Hotel",
    number: "Number",
    comp: "Apt / Room",
    btnNext: "Next",
    step3Label: "Step 03",
    step3Title: "The Moment.",
    noSlots: "No slots available today.",
    btnAdjust: "Final Adjustments",
    step4Label: "Step 04",
    step4Title: "The Agreement.",
    giftDesc: "Since it's your first time booking here, I've unlocked a small discount on the final amount.",
    giftBtn: "Unlock Courtesy (R$ 15)",
    addons: "Session Add-ons",
    reqLabel: "Specific Request / Preference",
    reqPlace: "Any specific desire for today?",
    reqDesc: "Subject to evaluation on site. If the request cannot be fulfilled, the fee will not be charged.",
    payLabel: "How will you pay on site?",
    payPix: "Pix (-3%)",
    payCard: "Credit Card",
    payCash: "Cash",
    subBase: "Base Session",
    subExtras: "Extras",
    subReq: "Special Request",
    subGift: "Courtesy (First Time)",
    subPeak: "Travel Fee",
    subPix: "Pix Discount",
    total: "Final Total",
    btnFinish: "Finish Order",
    step5Title: "All Set.",
    step5Desc: "Your summary is ready and WhatsApp should have opened automatically. If your browser blocked the window (or if you need to try again), click the button below.",
    btnSend: "Resend on WhatsApp",
    btnBack: "Back to start",
    wtsNew: "NEW BOOKING REQUEST",
    wtsId: "Identification",
    wtsName: "Name",
    wtsYears: "years old",
    wtsSession: "The Session",
    wtsDate: "Date",
    wtsDur: "Estimated Duration",
    wtsMood: "Chosen Mood",
    wtsServ: "Service",
    wtsHappen: "What to expect",
    wtsExtras: "Included Extras",
    wtsLocStudio: "Location: My Studio (Bela Vista, São Paulo)\n🗺️ Exact address will be sent here upon confirmation.",
    wtsLocHome: "Location",
    wtsReq: "Special Request / Fetish",
    wtsReqWait: "(Awaiting your evaluation)",
    wtsFin: "Financial Summary",
    wtsPay: "On-site Payment",
    wtsRulesTitle: "Agreed Guidelines",
    wtsRule1: "Prior hygiene (recent shower) is non-negotiable.",
    wtsRule2: "Absolute privacy and discretion guaranteed for both.",
    wtsRule3: "Disrespecting boundaries cancels the session immediately.",
  }
};

const MOODS = [
  {
    id: 'classica',
    color: '#3f3f46', accent: '#a1a1aa', price: 180, min: 60,
    PT: { title: 'Desatar os nós', subtitle: 'Tensão e peso nas costas.', service: 'Massagem Clássica', desc: 'Corpo todo, pressão firme. Estritamente terapêutica para alívio muscular profundo. Sem toques íntimos.' },
    EN: { title: 'Untie the knots', subtitle: 'Tension and back weight.', service: 'Classic Massage', desc: 'Full body, firm pressure. Strictly therapeutic for deep muscle relief. No intimate touch.' }
  },
  {
    id: 'sensitiva',
    color: '#713f12', accent: '#fbbf24', price: 200, min: 60,
    PT: { title: 'Despertar', subtitle: 'Mente cansada, corpo dormente.', service: 'Massagem Sensitiva', desc: 'Inicia com massagem profunda para tirar a tensão e evolui para toques sutis na pele. Inclui técnica íntima manual (Lingam) focada no alívio mental.' },
    EN: { title: 'Awakening', subtitle: 'Tired mind, numb body.', service: 'Sensitive Massage', desc: 'Starts with deep massage to release tension and evolves into subtle skin touches. Includes manual intimate technique (Lingam) focused on mental relief.' }
  },
  {
    id: 'fusion',
    color: '#831843', accent: '#f43f5e', price: 250, min: 60,
    PT: { title: 'Proximidade', subtitle: 'Buscando contato físico real.', service: 'Experiência Fusion', desc: 'Atendo apenas de cueca para garantir maior intimidade. Contato intenso, corpo a corpo e o toque da minha barba por você. Inclui técnica íntima (Lingam) prolongada.' },
    EN: { title: 'Closeness', subtitle: 'Seeking real physical contact.', service: 'Fusion Experience', desc: 'I wear only underwear to ensure greater intimacy. Intense body-to-body contact and the touch of my beard on you. Includes prolonged intimate technique (Lingam).' }
  },
  {
    id: 'nuru',
    color: '#1e1b4b', accent: '#818cf8', price: 350, min: 60,
    PT: { title: 'Imersão Total', subtitle: 'Desconexão absoluta da rotina.', service: 'Massagem Nuru (Gel)', desc: 'Nós dois sem roupas do início ao fim. Usamos muito gel especial ultra deslizante sobre a pele. Contato fluido e intenso de corpos inteiros, frente e costas. Inclui técnica íntima.' },
    EN: { title: 'Total Immersion', subtitle: 'Absolute disconnection from routine.', service: 'Nuru Massage (Gel)', desc: 'Both of us completely naked. We use a lot of special ultra-gliding gel on the skin. Fluid and intense full-body contact, front and back. Includes intimate technique.' }
  },
  {
    id: 'reversa',
    color: '#14532d', accent: '#4ade80', price: 400, min: 60,
    PT: { title: 'Assumir o Controle', subtitle: 'Vontade de explorar e ditar o ritmo.', service: 'Massagem Reversa', desc: 'Eu começo relaxando e estimulando o seu corpo, mas depois o controle passa para você. Você dita o ritmo, os toques e explora livremente o meu corpo. Finalização mútua.' },
    EN: { title: 'Take Control', subtitle: 'Desire to explore and set the pace.', service: 'Reverse Massage', desc: 'I start by relaxing and stimulating your body, but then the control passes to you. You set the pace, the touches, and explore my body freely. Mutual finish.' }
  }
];

const EXTRAS = [
  { id: 'aroma', price: 20, PT: { label: 'Aromaterapia Relaxante' }, EN: { label: 'Relaxing Aromatherapy' } },
  { id: 'time', price: 75, PT: { label: 'Estender Tempo (+30min)' }, EN: { label: 'Extend Time (+30min)' } }
];

// ==================================================================================
// UTILITÁRIOS E ÍCONES
// ==================================================================================
const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;
const vibrate = (pattern: number | number[] = 20) => { try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {} };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const ICON_PATHS: Record<string, string> = {
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'globe': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'
};

const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICON_PATHS[name] || ''} /></svg>
));

// ==================================================================================
// ESTILOS CINEMATOGRÁFICOS
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
      0% { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
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
  const [step, setStep] = useState(0); 
  const [giftApplied, setGiftApplied] = useState(false);
  const [lang, setLang] = useState<'PT' | 'EN'>('PT');
  
  const [moodId, setMoodId] = useState(MOODS[0].id);
  const mood = useMemo(() => MOODS.find(m => m.id === moodId) || MOODS[0], [moodId]);
  const T = TEXTS[lang];

  const [data, setData] = useState({
    name: '', age: '', locType: '', cep: '', street: '', number: '', comp: '', 
    date: null as Date | null, time: '', extras: {} as Record<string, boolean>,
    req: '', payment: ''
  });

  const [cepLoading, setCepLoading] = useState(false);

  useEffect(() => {
    const isAdult = localStorage.getItem('thaly_adult_v8');
    const hasGift = localStorage.getItem('thaly_gift_v8');
    if (isAdult === 'yes') setStep(1);
    if (hasGift === 'yes') setGiftApplied(true);
  }, []);

  const acceptAdult = () => {
    vibrate(30);
    localStorage.setItem('thaly_adult_v8', 'yes');
    setStep(1);
  };

  const applyGift = () => {
    vibrate([40, 60]);
    localStorage.setItem('thaly_gift_v8', 'yes');
    setGiftApplied(true);
  };

  const resetFlow = () => {
    vibrate(20);
    setStep(1);
  };

  const toggleLang = () => {
    vibrate(15);
    setLang(l => l === 'PT' ? 'EN' : 'PT');
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

  const fin = useMemo(() => {
    let sub = mood.price;
    let dur = mood.min;
    let extrasValue = 0;
    
    if (data.extras['time']) { extrasValue += 75; dur += 30; }
    if (data.extras['aroma']) { extrasValue += 20; }
    sub += extrasValue;
    
    const reqFee = data.req.trim().length > 3 ? 130 : 0;
    sub += reqFee;

    const peak = (PEAK_HOURS.includes(data.time) && data.locType !== 'studio') ? PEAK_FEE : 0;
    const discount = giftApplied ? 15 : 0;
    
    const base = Math.max(0, sub - discount);
    const pix = data.payment === 'pix' ? Math.ceil(base * 0.03) : 0;
    
    return { sub, extrasValue, peak, discount, reqFee, pix, total: (base - pix) + peak, dur };
  }, [mood, data, giftApplied]);

  const days = useMemo(() => Array.from({length: 15}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  }), []);

  const getSlots = () => {
    if (!data.date) return [];
    let s = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) s.push(`${i<10?'0':''}${i}:00`);
    if (data.date.toDateString() === new Date().toDateString()) s = s.filter(t => parseInt(t.split(':')[0]) > new Date().getHours());
    return s;
  };

  const sendWhatsApp = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';
    const ext = Object.keys(data.extras).filter(k=>data.extras[k]).map(k=>EXTRAS.find(e=>e.id===k)?.[lang].label).join(', ');
    
    const mapsLink = data.locType === 'studio' 
      ? `📍 *${T.wtsLocStudio}*` 
      : `📍 *${T.wtsLocHome}:* ${data.street}, ${data.number} ${data.comp ? `(${data.comp})` : ''}\n🗺️ *Maps:* https://maps.google.com/?q=${encodeURIComponent(`${data.street},${data.number}, São Paulo`)}`;

    const rTxt = data.req.trim() ? `\n\n🔥 *${T.wtsReq}:*\n"${data.req.trim()}"\n_${T.wtsReqWait}_` : '';

    const text = `*${T.wtsNew}* 🌿\n\n` +
      `*👤 ${T.wtsId}*\n` +
      `${T.wtsName}: ${data.name} (${data.age} ${T.wtsYears})\n\n` +
      `*📅 ${T.wtsSession}*\n` +
      `${T.wtsDate}: ${dStr} às ${data.time}\n` +
      `${T.wtsDur}: ~${fin.dur} min\n` +
      `${T.wtsMood}: ${mood[lang].title}\n` +
      `${T.wtsServ}: ${mood[lang].service}\n` +
      `*${T.wtsHappen}:* ${mood[lang].desc}\n` +
      `${ext ? `\n*${T.wtsExtras}:*${ext}\n` : '\n'}` +
      `${mapsLink}` +
      `${rTxt}\n\n` +
      `*💳 ${T.wtsFin}*\n` +
      `${T.subBase}: ${formatMoney(mood.price)}\n` +
      `${fin.extrasValue > 0 ? `${T.subExtras}: +${formatMoney(fin.extrasValue)}\n` : ''}` +
      `${fin.reqFee > 0 ? `${T.subReq}: +${formatMoney(fin.reqFee)}\n` : ''}` +
      `${fin.peak > 0 ? `${T.subPeak}: +${formatMoney(fin.peak)}\n` : ''}` +
      `${fin.discount > 0 ? `${T.subGift}: -${formatMoney(fin.discount)}\n` : ''}` +
      `${fin.pix > 0 ? `${T.subPix}: -${formatMoney(fin.pix)}\n` : ''}` +
      `------------------------\n` +
      `💰 *${T.total}:* ${formatMoney(fin.total)}\n` +
      `${T.wtsPay}: *${data.payment === 'pix' ? 'Pix' : data.payment === 'card' ? T.payCard : T.payCash}*\n\n` +
      `*⚖️ ${T.wtsRulesTitle}:*\n` +
      `• ${T.wtsRule1}\n` +
      `• ${T.wtsRule2}\n` +
      `• ${T.wtsRule3}`;
    
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      <CinematicStyles />
      <div className="grain-overlay" />
      <div className="ambient-glow" style={{ backgroundColor: mood.color }} />

      <div className="relative z-10 min-h-screen flex flex-col pt-10 pb-24 px-6 max-w-md mx-auto">
        
        {/* Cabecalho de Navegação Dinâmico */}
        {step > 0 && (
          <header className="flex justify-between items-center mb-10 step-enter">
            <button onClick={resetFlow} className="text-left group outline-none">
              <span style={{ fontFamily: 'var(--font-serif)' }} className="text-xl italic text-white/90 group-hover:text-white transition-colors">
                Thalyson.
              </span>
            </button>
            
            <div className="flex items-center gap-5">
              {step < 5 && (
                <div className="flex gap-1.5 mr-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-[3px] rounded-full transition-all duration-500 ${step >= i ? 'w-5 bg-white' : 'w-2 bg-white/20'}`} />
                  ))}
                </div>
              )}
              
              <button onClick={toggleLang} className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-white/50 hover:text-white transition-colors outline-none">
                <Icon name="globe" size={14} />
                {lang}
              </button>

              <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors outline-none">
                <Icon name="instagram" size={18} />
              </a>
            </div>
          </header>
        )}

        {/* STEP 0: O AVISO */}
        {step === 0 && (
          <div className="flex-1 flex flex-col justify-center step-enter">
            <h1 style={{ fontFamily: 'var(--font-serif)', whiteSpace: 'pre-line' }} className="text-4xl leading-tight mb-6">{T.ageTitle}</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-10">{T.ageDesc}</p>
            <button onClick={acceptAdult} className="bg-white text-black h-14 w-full font-medium text-sm tracking-widest uppercase transition-transform active:scale-95 outline-none">
              {T.ageBtn}
            </button>
          </div>
        )}

        {/* STEP 1: A FREQUÊNCIA */}
        {step === 1 && (
          <div className="flex-1 flex flex-col step-enter pb-8">
            <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step1Label}</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step1Title}</h1>
            
            <div className="flex flex-col gap-3">
              {MOODS.map(m => {
                const active = mood.id === m.id;
                return (
                  <button key={m.id} onClick={() => { vibrate(20); setMoodId(m.id); }}
                    className={`text-left p-5 transition-all duration-500 border outline-none ${active ? 'bg-white/10 backdrop-blur-md' : 'border-white/5 hover:border-white/20 bg-transparent'}`}
                    style={{ borderColor: active ? m.accent : '' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: active ? m.accent : 'rgba(255,255,255,0.4)' }}>{m[lang].title}</p>
                    <p className={`text-sm ${active ? 'text-white' : 'text-white/60'}`}>{m[lang].subtitle}</p>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 p-6 bg-black/40 backdrop-blur-xl border border-white/10 min-h-[140px]">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg">{mood[lang].service}</h3>
                <div className="text-right flex flex-col items-end">
                  <span className="text-base font-bold block" style={{ color: mood.accent }}>{formatMoney(mood.price)}</span>
                  <span className="text-[10px] text-white/50 uppercase tracking-widest mt-0.5">{T.upTo} {mood.min}m</span>
                </div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed mt-2">{mood[lang].desc}</p>
            </div>

            <button onClick={() => { vibrate(30); setStep(2); }} className="mt-10 bg-white text-black h-14 w-full font-bold tracking-widest uppercase transition-transform active:scale-95 outline-none">
              {T.btnContinue}
            </button>
          </div>
        )}

        {/* STEP 2: COORDENADAS */}
        {step === 2 && (
          <div className="flex-1 flex flex-col step-enter pb-8">
            <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step2Label}</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step2Title}</h1>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input type="text" placeholder={T.namePlace} value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="w-full modern-input" />
                </div>
                <div className="w-24">
                  <input type="tel" maxLength={2} placeholder={T.agePlace} value={data.age} onChange={e=>setData({...data, age: e.target.value.replace(/\D/g,'')})} className="w-full modern-input text-center" />
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.locLabel}</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={()=>setData({...data, locType:'studio'})} className={`py-4 text-sm outline-none transition-colors border ${data.locType==='studio' ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{T.locStudio}</button>
                  <button onClick={()=>setData({...data, locType:'home'})} className={`py-4 text-sm outline-none transition-colors border ${data.locType==='home' ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{T.locHome}</button>
                </div>
              </div>

              {data.locType === 'studio' && <p className="text-sm text-white/60 bg-white/5 p-4 border border-white/10 leading-relaxed animate-in fade-in">{T.studioDesc}</p>}
              
              {data.locType === 'home' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <input type="tel" maxLength={9} placeholder={T.cep} value={data.cep} onChange={e=>handleCep(e.target.value)} className="w-full modern-input" />
                  <input type="text" placeholder={T.street} value={data.street} onChange={e=>setData({...data, street: e.target.value})} className="w-full modern-input" />
                  <div className="flex gap-4">
                    <input type="text" placeholder={T.number} value={data.number} onChange={e=>setData({...data, number: e.target.value})} className="w-1/3 modern-input" />
                    <input type="text" placeholder={T.comp} value={data.comp} onChange={e=>setData({...data, comp: e.target.value})} className="w-2/3 modern-input" />
                  </div>
                </div>
              )}
            </div>

            <button disabled={!data.name || !data.age || !data.locType || (data.locType==='home' && !data.street)} onClick={() => { vibrate(30); setStep(3); }} className="mt-12 bg-white text-black h-14 w-full font-bold tracking-widest uppercase disabled:opacity-20 disabled:cursor-not-allowed transition-opacity outline-none">
              {T.btnNext}
            </button>
          </div>
        )}

        {/* STEP 3: TEMPO */}
        {step === 3 && (
          <div className="flex-1 flex flex-col step-enter pb-8">
            <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step3Label}</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step3Title}</h1>

            <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2 mb-8">
              {days.map((d, i) => {
                const sel = data.date?.toDateString() === d.toDateString();
                const dayName = d.toLocaleDateString(lang === 'PT' ? 'pt-BR' : 'en-US', {weekday:'short'}).slice(0,3);
                return (
                  <button key={i} onClick={() => setData({...data, date: d, time: ''})} className={`shrink-0 w-16 h-20 outline-none flex flex-col items-center justify-center border transition-all ${sel ? 'bg-white text-black border-white' : 'border-white/10 text-white/50'}`}>
                    <span className="text-[10px] uppercase font-bold tracking-widest">{dayName}</span>
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
                    <button key={t} onClick={() => setData({...data, time: t})} className={`py-4 text-sm outline-none font-medium border transition-colors ${sel ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>
                      {t}
                    </button>
                  )
                })}
                {getSlots().length === 0 && <p className="col-span-3 text-sm text-white/40 text-center py-4 border border-white/5">{T.noSlots}</p>}
              </div>
            )}

            <button disabled={!data.date || !data.time} onClick={() => { vibrate(30); setStep(4); }} className="mt-12 bg-white text-black h-14 w-full font-bold tracking-widest uppercase disabled:opacity-20 transition-opacity outline-none">
              {T.btnAdjust}
            </button>
          </div>
        )}

        {/* STEP 4: O ACORDO */}
        {step === 4 && (
          <div className="flex-1 flex flex-col step-enter pb-8">
            <h2 className="text-xs font-medium tracking-widest text-white/40 uppercase mb-2">{T.step4Label}</h2>
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-3xl mb-8">{T.step4Title}</h1>

            <div className="space-y-8">
              {!giftApplied && (
                <div className="p-5 border border-white/20 bg-white/5 animate-in fade-in">
                  <p className="text-sm text-white mb-3 leading-relaxed">{T.giftDesc}</p>
                  <button onClick={applyGift} className="text-xs font-bold outline-none uppercase tracking-widest border-b border-white pb-1">{T.giftBtn}</button>
                </div>
              )}

              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.addons}</p>
                <div className="space-y-3">
                  {EXTRAS.map(ex => {
                    const sel = data.extras[ex.id];
                    return (
                      <button key={ex.id} onClick={()=>setData({...data, extras:{...data.extras, [ex.id]:!sel}})} className={`w-full outline-none flex justify-between p-4 border text-sm transition-colors ${sel ? 'border-white bg-white/10 text-white' : 'border-white/10 text-white/60'}`}>
                        <span>{ex[lang].label}</span>
                        <span>+{formatMoney(ex.price)}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs text-white/50 uppercase tracking-widest">{T.reqLabel}</p>
                  <span className="text-xs font-bold text-white/60">+ R$ 130</span>
                </div>
                <input type="text" placeholder={T.reqPlace} value={data.req} onChange={e=>setData({...data, req:e.target.value})} className="w-full modern-input text-sm" />
                <p className="text-[10px] text-white/40 mt-2 leading-relaxed">{T.reqDesc}</p>
              </div>

              <div>
                <p className="text-xs text-white/50 uppercase tracking-widest mb-4">{T.payLabel}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[{id:'pix', l:T.payPix},{id:'card', l:T.payCard},{id:'cash', l:T.payCash}].map(p => (
                    <button key={p.id} onClick={()=>setData({...data, payment:p.id})} className={`py-4 outline-none text-xs font-bold uppercase tracking-wider border transition-colors ${data.payment === p.id ? 'bg-white text-black border-white' : 'border-white/10 text-white/60'}`}>{p.l}</button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subBase}</span><span>{formatMoney(mood.price)}</span></div>
                {fin.extrasValue > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subExtras}</span><span>+{formatMoney(fin.extrasValue)}</span></div>}
                {fin.reqFee > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subReq}</span><span>+{formatMoney(fin.reqFee)}</span></div>}
                {fin.discount > 0 && <div className="flex justify-between text-sm text-white mb-2"><span>{T.subGift}</span><span>-{formatMoney(fin.discount)}</span></div>}
                {fin.peak > 0 && <div className="flex justify-between text-sm text-white/60 mb-2"><span>{T.subPeak}</span><span>+{formatMoney(fin.peak)}</span></div>}
                {fin.pix > 0 && <div className="flex justify-between text-sm text-white mb-2"><span>{T.subPix}</span><span>-{formatMoney(fin.pix)}</span></div>}
                
                <div className="flex justify-between items-end mt-8">
                  <span className="text-sm uppercase tracking-widest text-white/50">{T.total}</span>
                  <span style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl text-white">{formatMoney(fin.total)}</span>
                </div>
              </div>
            </div>

            <button disabled={!data.payment} onClick={() => { vibrate([30,50]); sendWhatsApp(); setStep(5); }} className="mt-12 bg-white text-black h-14 w-full font-bold tracking-widest uppercase disabled:opacity-20 transition-opacity outline-none">
              {T.btnFinish}
            </button>
          </div>
        )}

        {/* STEP 5: FINAL */}
        {step === 5 && (
          <div className="flex-1 flex flex-col justify-center text-center step-enter">
            <h1 style={{ fontFamily: 'var(--font-serif)' }} className="text-4xl mb-4">{T.step5Title}</h1>
            <p className="text-white/60 text-sm leading-relaxed mb-10">{T.step5Desc}</p>
            
            <button onClick={sendWhatsApp} className="bg-transparent border border-white text-white h-14 w-full font-bold tracking-widest uppercase transition-colors hover:bg-white hover:text-black outline-none">
              {T.btnSend}
            </button>

            <button onClick={resetFlow} className="mt-8 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors outline-none">
              {T.btnBack}
            </button>
          </div>
        )}

      </div>
    </>
  );
}
