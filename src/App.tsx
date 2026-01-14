import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield,
  CreditCard, Banknote, QrCode, Copy, 
  ChevronRight, Menu, X, HelpCircle, Instagram, MapPin, Calendar as CalendarIcon, Clock, User, ChevronDown
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO & COPYWRITING
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 15, // Aumentei um pouco para parecer mais vantajoso
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 80, // Ajuste de preço psicológico
    AROMA: 10,
  },
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Alpha Premium', 
    short: 'O Protocolo Completo',
    desc: 'A escolha da maioria. Massagem profunda para soltar a musculatura, seguida de óleo quente, toque pele na pele e finalização manual intensa. Você no comando das sensações.', 
    duration: 60, 
    price: 160, 
    badge: 'RECOMENDADO 🔥'
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico. Ideal para remover dores lombares, pernas cansadas e stress do trabalho. Movimentos firmes e técnicos. Sem interação íntima.', 
    duration: 50, 
    price: 130, 
    badge: null
  },
];

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const LOCATIONS = [
  { id: 'home', label: 'Sua Residência', sub: 'Vou até seu endereço', icon: Home, input: true },
  { id: 'hotel', label: 'Hotel / Motel', sub: 'Vou até sua suíte (Sigilo Absoluto)', icon: Bed, input: true },
];

const REVIEWS_DB = [
  { t: "A melhor da vida. O toque dele vicia. A finalização foi absurda.", a: "Tiago (Sigilo)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Profissionalismo raro.", a: "Empresário SP", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O visual dele de cueca... nota 1000.", a: "Anônimo", s: 5 },
  { t: "O upgrade vale cada centavo. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Cara bonito, limpo e discreto. Atendeu no meu escritório.", a: "Executivo", s: 5 },
];

// ==================================================================================
// 2. UTILITÁRIOS & ESTILOS GLOBAIS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: (pattern = 5) => { if (navigator.vibrate) navigator.vibrate(pattern); },
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = new Date(selectedDate); sel.setHours(0,0,0,0);
    if (sel < today) return true; 
    if (sel > today) return false; 
    const [hours] = timeString.split(':').map(Number);
    return hours <= now.getHours() + 1; // Bloqueia próxima hora para deslocamento
  },
  getGreeting: () => {
    const h = new Date().getHours();
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  }
};

const globalStyles = `
:root { --primary: #0A84FF; --accent: #32D74B; --bg-app: #050505; --card-bg: #121212; --border: #27272a; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
body { background: var(--bg-app); color: #fff; padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden; }
input, button { outline: none; }
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll { -ms-overflow-style: none; scrollbar-width: none; }

/* Animations */
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }
@keyframes shimmer { 0% {background-position: -200% 0;} 100% {background-position: 200% 0;} }

.animate-enter { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.btn-pulse { animation: pulse-glow 2s infinite; }
.text-gradient { background: linear-gradient(90deg, #fff, #0A84FF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

/* Components */
.glass-panel { background: rgba(28, 28, 30, 0.6); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; transition: all 0.3s ease; }
.card-base:active { transform: scale(0.98); background: #18181b; }
.card-selected { border-color: var(--primary); background: rgba(10, 132, 255, 0.08); box-shadow: 0 0 20px rgba(10, 132, 255, 0.15); }
.input-field { background: #18181b; border: 1px solid #3f3f46; color: white; border-radius: 14px; width: 100%; transition: all 0.3s; font-size: 16px; }
.input-field:focus { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(10,132,255,0.2); }
.primary-btn { background: var(--primary); color: white; border-radius: 16px; font-weight: 700; border: none; box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3); position: relative; overflow: hidden; }
.primary-btn::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(rgba(255,255,255,0.2), transparent); opacity: 0; transition: opacity 0.2s; }
.primary-btn:active::after { opacity: 1; }

/* Utilities */
.section-closed { height: 60px; overflow: hidden; opacity: 0.6; pointer-events: none; }
.section-open { height: auto; opacity: 1; pointer-events: auto; }
`;

// ==================================================================================
// 3. COMPONENTES DE UI
// ==================================================================================

const StepHeader = ({ number, title, active, completed, onClick, summary }) => (
  <div onClick={completed ? onClick : undefined} 
    className={`flex items-center justify-between py-4 mb-2 transition-all ${completed ? 'cursor-pointer' : ''}`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors
        ${active ? 'bg-[#0A84FF] text-white shadow-[0_0_15px_rgba(10,132,255,0.5)]' : 
          completed ? 'bg-[#32D74B] text-black' : 'bg-[#27272a] text-gray-500'}`}>
        {completed ? <Check size={16} strokeWidth={3}/> : number}
      </div>
      <div>
        <h3 className={`font-bold text-lg ${active ? 'text-white' : 'text-gray-400'}`}>{title}</h3>
        {completed && summary && <p className="text-xs text-[#0A84FF] font-medium mt-0.5">{summary}</p>}
      </div>
    </div>
    {completed && <div className="bg-[#27272a] p-1.5 rounded-full"><ChevronDown size={16} className="text-gray-400"/></div>}
  </div>
);

const ProgressBar = ({ progress }) => (
  <div className="fixed top-0 left-0 w-full h-1 bg-[#27272a] z-[60]">
    <div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#32D74B] transition-all duration-500" style={{ width: `${progress}%` }}></div>
  </div>
);

const ReviewsCarousel = () => {
    const [idx, setIdx] = useState(0);
    useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 5000); return () => clearInterval(t); }, []);
    return (
        <div className="bg-[#121212] border border-[#27272a] rounded-2xl p-4 mb-8 relative overflow-hidden">
            <div className="flex text-[#FFD60A] mb-2 gap-1">{[...Array(5)].map((_,i)=><Star key={i} size={14} fill="currentColor"/>)}</div>
            <p className="text-sm text-gray-300 italic mb-2 leading-relaxed animate-enter" key={idx}>"{REVIEWS_DB[idx].t}"</p>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide flex items-center gap-1">
                 <Shield size={10} className="text-[#32D74B]"/> {REVIEWS_DB[idx].a}
            </p>
        </div>
    )
};

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  const [data, setData] = useState({
    name: '', age: '', medical: false, 
    service: null, date: null, time: null, location: null,
    street: '', number: '', district: '', comp: '',
    extras: { upgrade: false, touch: false, aroma: false }, payment: null
  });

  const [currentStep, setCurrentStep] = useState(0); // 0:Intro, 1:Service, 2:Date, 3:Extras, 4:Location, 5:Payment
  const [hasCoupon, setHasCoupon] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem('thaly_v10_booking');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.date) p.date = new Date(p.date);
        setData(p);
      } catch (e) {}
    }
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => { localStorage.setItem('thaly_v10_booking', JSON.stringify(data)); }, [data]);

  // Scroll to active step
  const stepRefs = useRef([]);
  useEffect(() => {
    if (stepRefs.current[currentStep]) {
        setTimeout(() => {
            stepRefs.current[currentStep].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
  }, [currentStep]);

  const financials = useMemo(() => {
    const base = data.service ? data.service.price : 0;
    const upg = data.extras.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    const touch = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    const aroma = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    const sub = base + upg + touch + aroma;
    const desc = hasCoupon ? CONFIG.COUPON_VAL : 0;
    return { base, upg, touch, aroma, sub, desc, total: Math.max(0, sub - desc) };
  }, [data.service, data.extras, hasCoupon]);

  const progress = Math.min(100, (currentStep / 5) * 100);

  const handleNext = (step) => {
    Utils.vibrate();
    setCurrentStep(step);
  };

  const generateWhatsapp = () => {
    const d = data.date;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    let t = `*NOVO AGENDAMENTO VIP* 🦁\n\n`;
    t += `👤 *Cliente:* ${data.name} (${data.age} anos)\n`;
    t += `📅 *Data:* ${dateStr} às ${data.time}\n`;
    t += `💆 *Serviço:* ${data.service?.name.toUpperCase()}\n\n`;
    
    if(data.extras.upgrade || data.extras.touch || data.extras.aroma) {
        t += `🔥 *ADICIONAIS:*\n`;
        if(data.extras.upgrade) t += `+ ⏱️ Upgrade Tempo (30m)\n`;
        if(data.extras.touch) t += `+ 😈 Interação Recíproca\n`;
        if(data.extras.aroma) t += `+ 🍃 Aromaterapia\n`;
        t += `\n`;
    }

    t += `📍 *LOCAL:* ${data.location?.label}\n`;
    if(data.location) t += `📝 ${data.street}, ${data.number} - ${data.district}\n\n`;
    
    t += `💰 *TOTAL: ${Utils.formatBRL(financials.total)}*\n`;
    t += `💳 Pagamento: ${data.payment?.toUpperCase()}\n`;
    t += `--------------------------\n`;
    t += `_Aguardo confirmação e chave Pix._`;
    
    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <style>{globalStyles}</style>
      <div className="w-16 h-16 border-4 border-[#121212] border-t-[#0A84FF] rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl font-bold tracking-tighter mb-2">THALYMASSAGENS</h1>
      <p className="text-gray-500 text-xs uppercase tracking-[0.3em]">Carregando Experiência...</p>
    </div>
  );

  if (isSuccess) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-enter">
       <style>{globalStyles}</style>
       <div className="w-24 h-24 bg-[#32D74B]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.3)]">
          <Check size={48} className="text-[#32D74B]" />
       </div>
       <h2 className="text-3xl font-bold text-white mb-2">Solicitação Enviada!</h2>
       <p className="text-gray-400 mb-8 max-w-xs mx-auto">Sua solicitação já está no meu WhatsApp. Aguarde alguns instantes que irei confirmar sua sessão.</p>
       
       <a href={generateWhatsapp()} target="_blank" rel="noreferrer" 
         className="primary-btn w-full py-4 text-lg mb-4 flex items-center justify-center gap-2">
         <MessageCircle size={24}/> Reenviar Mensagem
       </a>
       <button onClick={() => window.location.reload()} className="text-gray-500 text-sm font-bold p-4">VOLTAR AO INÍCIO</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-40">
      <style>{globalStyles}</style>
      <ProgressBar progress={progress} />

      {/* Header */}
      <header className="fixed top-1 w-full z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
         <span className="font-black text-xl tracking-tighter text-white drop-shadow-lg pointer-events-auto" onClick={()=>window.location.reload()}>THALY.</span>
         <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10 pointer-events-auto">
            <Instagram size={20} className="text-white"/>
         </a>
      </header>

      <main className="max-w-md mx-auto pt-24 px-5">
        
        {/* STEP 0: INTRO & IDENTIFICATION */}
        <section ref={el => stepRefs.current[0] = el} className={`mb-8 ${currentStep > 0 ? 'hidden' : 'block animate-enter'}`}>
           <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-[#0A84FF]/20 text-[#0A84FF] rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-[#0A84FF]/20">Exclusivo para Homens</span>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight mb-3">Seu momento de <br/><span className="text-gradient">escape e prazer.</span></h1>
              <p className="text-gray-400 text-lg leading-relaxed">Massoterapia profissional, sigilosa e sem tabus. No conforto do seu local.</p>
           </div>

           <div className="flex items-center gap-4 bg-[#18181b] p-4 rounded-2xl border border-[#27272a] mb-6">
              <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden shrink-0">
                  {/* Placeholder Foto Avatar */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center"><User size={20}/></div>
              </div>
              <div>
                  <p className="font-bold text-white text-sm">Thalyson</p>
                  <p className="text-xs text-gray-400">Massoterapeuta Certificado</p>
                  <div className="flex items-center gap-1 mt-1"><div className="w-2 h-2 bg-[#32D74B] rounded-full animate-pulse"></div><span className="text-[10px] text-[#32D74B] font-bold uppercase">Online Agora</span></div>
              </div>
           </div>

           <ReviewsCarousel />

           <div className="card-base p-6 space-y-4 shadow-2xl">
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Como te chamo?</label>
                 <input value={data.name} onChange={e => setData({...data, name: e.target.value})} className="input-field p-4" placeholder="Nome ou Apelido" />
              </div>
              <div>
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1.5 block">Sua Idade</label>
                 <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} className="input-field p-4" placeholder="Ex: 35" />
              </div>
              
              <div onClick={() => setData({...data, medical: !data.medical})} 
                 className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#18181b] border-[#27272a]'}`}>
                 <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>
                    {data.medical && <Check size={12} className="text-white"/>}
                 </div>
                 <span className="text-sm text-gray-300 font-medium">Declaro que sou maior de idade e estou saudável.</span>
              </div>

              <button disabled={!data.name || !data.age || !data.medical} onClick={() => handleNext(1)}
                 className="primary-btn w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                 Começar Agendamento <ArrowRight size={20}/>
              </button>
           </div>
           
           <p className="text-center text-[10px] text-gray-600 mt-6 flex items-center justify-center gap-1">
              <Lock size={10}/> SEUS DADOS ESTÃO SEGUROS E CRIPTOGRAFADOS
           </p>
        </section>

        {/* STEP 1: SERVICES */}
        <section ref={el => stepRefs.current[1] = el} className={currentStep === 1 ? 'block animate-enter' : currentStep > 1 ? 'hidden' : 'hidden'}>
           <StepHeader number={1} title="Escolha a Experiência" active={true} />
           <div className="space-y-4 mt-2">
              {SERVICES.map(s => (
                  <div key={s.id} onClick={() => { setData({...data, service: s}); handleNext(2); }}
                     className={`card-base p-5 cursor-pointer relative overflow-hidden group ${data.service?.id === s.id ? 'card-selected' : ''}`}>
                     {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">{s.badge}</div>}
                     <div className="flex justify-between items-start mb-2 relative z-10">
                        <h3 className="text-lg font-bold text-white group-hover:text-[#0A84FF] transition-colors">{s.name}</h3>
                        <span className="font-bold text-gray-300 bg-white/10 px-2 py-1 rounded text-sm">{Utils.formatBRL(s.price)}</span>
                     </div>
                     <p className="text-[#0A84FF] text-xs font-bold uppercase tracking-wider mb-2">{s.short}</p>
                     <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                     <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 font-bold">
                        <Clock size={12}/> {s.duration} MINUTOS
                     </div>
                  </div>
              ))}
           </div>
           {currentStep > 1 && <div onClick={() => setCurrentStep(1)} className="text-center p-2 text-gray-500 text-xs mt-4 underline">Alterar Serviço</div>}
        </section>

        {currentStep > 1 && <StepHeader number={1} title="Serviço" completed={true} summary={data.service?.name} onClick={() => setCurrentStep(1)} />}

        {/* STEP 2: DATE & TIME */}
        <section ref={el => stepRefs.current[2] = el} className={currentStep === 2 ? 'block animate-enter' : 'hidden'}>
           <StepHeader number={2} title="Data e Hora" active={true} />
           <div className="card-base p-5">
              <div className="flex gap-2 overflow-x-auto pb-4 ios-scroll">
                 {[...Array(10)].map((_, i) => {
                    const d = new Date(); d.setDate(d.getDate() + i);
                    const isSel = data.date && data.date.getDate() === d.getDate();
                    return (
                       <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}) }}
                          className={`min-w-[64px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#18181b] border-[#27272a] text-gray-500'}`}>
                          <span className="text-[10px] font-bold uppercase">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                          <span className="text-2xl font-bold tracking-tighter">{d.getDate()}</span>
                       </button>
                    )
                 })}
              </div>
              
              <div className={`grid grid-cols-4 gap-2 transition-all ${data.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                 {TIME_SLOTS.map(t => {
                    const blocked = Utils.isTimeBlocked(data.date, t);
                    return (
                       <button key={t} disabled={blocked} onClick={() => { setData({...data, time: t}); handleNext(3); }}
                          className={`py-3 rounded-lg text-sm font-bold border transition-all ${data.time === t ? 'bg-white text-black' : blocked ? 'opacity-30 line-through decoration-red-500 border-transparent' : 'bg-[#27272a] border-transparent hover:border-white/30'}`}>
                          {t}
                       </button>
                    )
                 })}
              </div>
           </div>
        </section>

        {currentStep > 2 && <StepHeader number={2} title="Agendamento" completed={true} summary={`${data.date?.toLocaleDateString('pt-BR')} às ${data.time}`} onClick={() => setCurrentStep(2)} />}

        {/* STEP 3: EXTRAS */}
        <section ref={el => stepRefs.current[3] = el} className={currentStep === 3 ? 'block animate-enter' : 'hidden'}>
           <StepHeader number={3} title="Personalizar (Opcional)" active={true} />
           <div className="space-y-3">
              {[
                 { key: 'upgrade', icon: Clock, label: '+30 Minutos', desc: 'Sessão estendida', price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT, color: 'text-[#0A84FF]' },
                 { key: 'touch', icon: Flame, label: 'Interação / Toque', desc: 'Toques recíprocos permitidos', price: CONFIG.PRICES.TOUCH, color: 'text-[#FF375F]' },
                 { key: 'aroma', icon: Wind, label: 'Aromaterapia', desc: 'Essências relaxantes no ambiente', price: CONFIG.PRICES.AROMA, color: 'text-[#32D74B]' },
              ].map((item) => (
                  <div key={item.key} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.key]: !data.extras[item.key]}}); }}
                     className={`card-base p-4 flex justify-between items-center cursor-pointer border-l-4 ${data.extras[item.key] ? `border-l-${item.color.split('[')[1].replace(']','')} bg-[#18181b]` : 'border-l-transparent'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-[#27272a] flex items-center justify-center ${item.color}`}>
                           <item.icon size={20} />
                        </div>
                        <div>
                           <p className="font-bold text-white">{item.label}</p>
                           <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className={`text-sm font-bold ${item.color}`}>+ {Utils.formatBRL(item.price)}</span>
                        {data.extras[item.key] && <div className="bg-[#0A84FF] rounded-full p-0.5 mt-1"><Check size={10}/></div>}
                     </div>
                  </div>
              ))}
              <button onClick={() => handleNext(4)} className="w-full bg-[#27272a] py-4 rounded-xl font-bold text-gray-300 hover:text-white mt-4 flex items-center justify-center gap-2">
                 {Object.values(data.extras).some(Boolean) ? 'Continuar com Selecionados' : 'Continuar sem Extras'} <ChevronRight size={16}/>
              </button>
           </div>
        </section>

        {currentStep > 3 && <StepHeader number={3} title="Adicionais" completed={true} summary={Object.values(data.extras).some(Boolean) ? 'Itens Selecionados' : 'Nenhum'} onClick={() => setCurrentStep(3)} />}

        {/* STEP 4: LOCATION */}
        <section ref={el => stepRefs.current[4] = el} className={currentStep === 4 ? 'block animate-enter' : 'hidden'}>
           <StepHeader number={4} title="Onde será?" active={true} />
           <div className="space-y-3">
              {LOCATIONS.map(loc => (
                 <div key={loc.id} onClick={() => setData({...data, location: loc})}
                    className={`card-base p-4 flex items-center gap-4 cursor-pointer ${data.location?.id === loc.id ? 'card-selected' : ''}`}>
                    <div className="bg-[#27272a] w-12 h-12 rounded-full flex items-center justify-center text-white"><loc.icon size={22}/></div>
                    <div>
                       <p className="font-bold text-white">{loc.label}</p>
                       <p className="text-xs text-gray-500">{loc.sub}</p>
                    </div>
                 </div>
              ))}

              {data.location && (
                 <div className="animate-enter bg-[#18181b] p-4 rounded-2xl border border-[#27272a] mt-4 space-y-3">
                    <input value={data.street} onChange={e => setData({...data, street: e.target.value})} className="input-field p-3.5" placeholder="Nome da Rua / Hotel" />
                    <div className="flex gap-3">
                       <input type="tel" value={data.number} onChange={e => setData({...data, number: e.target.value})} className="input-field p-3.5 w-1/3" placeholder="Nº" />
                       <input value={data.district} onChange={e => setData({...data, district: e.target.value})} className="input-field p-3.5 w-2/3" placeholder="Bairro" />
                    </div>
                    <button disabled={!data.street || !data.number} onClick={() => handleNext(5)} className="primary-btn w-full py-3.5 text-sm disabled:opacity-50">Confirmar Local</button>
                 </div>
              )}
           </div>
        </section>

        {currentStep > 4 && <StepHeader number={4} title="Local" completed={true} summary={data.street} onClick={() => setCurrentStep(4)} />}

        {/* STEP 5: PAYMENT */}
        <section ref={el => stepRefs.current[5] = el} className={currentStep === 5 ? 'block animate-enter' : 'hidden'}>
           <StepHeader number={5} title="Forma de Pagamento" active={true} />
           <div className="grid grid-cols-3 gap-3 mb-8">
              {['pix', 'dinheiro', 'cartao'].map(m => (
                 <div key={m} onClick={() => setData({...data, payment: m})}
                    className={`card-base p-4 flex flex-col items-center justify-center gap-2 cursor-pointer h-24 ${data.payment === m ? 'border-[#32D74B] bg-[#32D74B]/10' : ''}`}>
                    {m==='pix' && <QrCode className="text-[#32D74B]"/>}
                    {m==='dinheiro' && <Banknote className="text-[#32D74B]"/>}
                    {m==='cartao' && <CreditCard className="text-[#32D74B]"/>}
                    <span className="text-[10px] font-bold uppercase">{m}</span>
                 </div>
              ))}
           </div>
        </section>

      </main>

      {/* STICKY CHECKOUT BAR (Mostra após selecionar serviço) */}
      {data.service && (
        <div className="fixed bottom-0 w-full z-[100] animate-enter">
           <div className="bg-gradient-to-t from-black via-black to-transparent h-12 pointer-events-none absolute bottom-full w-full"></div>
           <div className="bg-[#1C1C1E]/90 backdrop-blur-xl border-t border-white/10 p-5 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              
              <div className="flex justify-between items-end mb-4 px-2">
                 <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Total Estimado</p>
                    <div className="flex items-end gap-2">
                        {hasCoupon && <span className="text-sm line-through text-gray-500 font-bold decoration-red-500 mb-1">{Utils.formatBRL(financials.sub)}</span>}
                        <span className="text-3xl font-black text-white tracking-tight">{Utils.formatBRL(financials.total)}</span>
                    </div>
                 </div>
                 {!hasCoupon ? (
                    <button onClick={() => { Utils.vibrate(); setHasCoupon(true); }} className="px-3 py-1.5 rounded-lg bg-[#FFD60A]/10 text-[#FFD60A] border border-[#FFD60A]/30 text-xs font-bold flex items-center gap-1.5 btn-pulse">
                       <Ticket size={12}/> CUPOM VIP
                    </button>
                 ) : (
                    <div className="px-3 py-1 bg-[#32D74B]/20 text-[#32D74B] text-[10px] font-bold rounded flex items-center gap-1"><Check size={10}/> DESC. APLICADO</div>
                 )}
              </div>

              <button 
                 onClick={() => { if(currentStep < 5) handleNext(currentStep + 1); else { setIsSuccess(true); window.open(generateWhatsapp(), '_blank'); } }}
                 disabled={currentStep === 5 && !data.payment}
                 className={`w-full h-14 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale
                 ${currentStep === 5 ? 'bg-[#32D74B] text-black hover:scale-[1.02]' : 'bg-[#0A84FF] text-white'}`}>
                 {currentStep === 5 ? 
                    <><MessageCircle size={24} fill="black"/> FINALIZAR PEDIDO</> : 
                    <>AVANÇAR <ChevronRight size={20}/></>}
              </button>

           </div>
        </div>
      )}
    </div>
  );
}
