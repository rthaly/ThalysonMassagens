import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, Home, MessageCircle, Ticket, Flame, Wind, Crown, 
  Shield, MapPin, Building, Bed, Clock, User, Zap, ChevronDown, Share2, 
  Music, Lock, RefreshCw, Heart, HelpCircle, Menu, X, Calendar as CalIcon,
  Smartphone, Navigation, DollarSign, ChevronRight
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO & DADOS (CONSTANTS)
// ==================================================================================

const CONFIG = {
  APP_KEY: 'thaly_app_v3_pro',
  PERMANENT_KEY: 'thaly_user_history_v1',
  WHATSAPP: "5517991360413",
  PIX: "62922530000144",
  COUPON_VALUE: 15.00,
  VIP_XP: 100
};

const CITIES = {
  sp: {
    id: 'sp', name: 'São Paulo', uf: 'SP', color: '#3B82F6', fee: 75,
    zones: [
      { id: 'centro', name: 'Bela Vista / Augusta', price: 0 },
      { id: 'z1', name: 'Jardins / Paulista', price: 20 },
      { id: 'z2', name: 'Pinheiros / V. Madalena', price: 30 },
      { id: 'z3', name: 'Moema / Itaim', price: 40 },
      { id: 'z4', name: 'Zona Norte / Leste', price: 60 }
    ]
  },
  londrina: {
    id: 'londrina', name: 'Londrina', uf: 'PR', color: '#22C55E', fee: 30,
    zones: [
      { id: 'centro', name: 'Centro / Gleba', price: 10 },
      { id: 'z_norte', name: 'Zona Norte', price: 25 },
      { id: 'z_sul', name: 'Zona Sul', price: 20 },
      { id: 'cambe', name: 'Cambé / Ibiporã', price: 40 }
    ]
  },
  santa_fe: {
    id: 'santa_fe', name: 'Santa Fé do Sul', uf: 'SP', color: '#EAB308', fee: 0,
    zones: [
      { id: 'centro', name: 'Urbana', price: 20 },
      { id: 'rural', name: 'Ranchos / Rural', price: 40 }
    ]
  }
};

const SERVICES = [
  { 
    id: 'completa', name: 'Experiência Completa', 
    desc: 'Relaxamento profundo + Finalização manual intensa.', 
    time: 60, price: 180, xp: 60, popular: true 
  },
  { 
    id: 'relax', name: 'Massagem Relaxante', 
    desc: 'Terapêutica focada em dores e stress. Sem toques íntimos.', 
    time: 60, price: 150, xp: 30, popular: false 
  },
  { 
    id: 'tantra', name: 'Tântrica Sensitive', 
    desc: 'Despertar sensorial, toques sutis e conexão energética.', 
    time: 90, price: 250, xp: 100, popular: false 
  }
];

const EXTRAS = [
  { id: 'upgrade', label: '+30 Minutos', icon: Clock, percent: 0.3 },
  { id: 'touch', label: 'Interação Recíproca', icon: Flame, fixed: 60 },
  { id: 'aroma', label: 'Aromaterapia Premium', icon: Wind, fixed: 10 }
];

// Mock de reviews para carrossel
const REVIEWS = [
  { t: "Mão firme e técnica impecável. Recomendo demais.", a: "Tiago S.", r: 5 },
  { t: "A melhor experiência que já tive em SP.", a: "Bruno M.", r: 5 },
  { t: "Profissional, limpo e muito educado.", a: "André L.", r: 5 },
  { t: "Sai de lá renovado, valeu cada centavo.", a: "Lucas", r: 5 },
];

// ==================================================================================
// 2. UTILS & HOOKS
// ==================================================================================

const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };
const cn = (...classes) => classes.filter(Boolean).join(' ');

// Hook para persistência segura
const useStickyState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const sticky = localStorage.getItem(key);
      return sticky ? JSON.parse(sticky) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
};

// ==================================================================================
// 3. UI COMPONENTS (ATOMIC)
// ==================================================================================

const Button = ({ children, variant = 'primary', className, ...props }) => {
  const base = "w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 relative overflow-hidden";
  const styles = {
    primary: "bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/10",
    outline: "border border-white/20 text-white hover:bg-white/5",
    ghost: "text-gray-400 hover:text-white bg-transparent",
    city: `bg-[var(--theme-color)] text-white shadow-lg shadow-[var(--theme-color)]/20`
  };
  return (
    <button className={cn(base, styles[variant], className)} {...props} onClick={(e) => { vibrate(); props.onClick && props.onClick(e); }}>
      {children}
    </button>
  );
};

const Input = ({ label, ...props }) => (
  <div className="relative group">
    <input 
      className="w-full bg-[#1A1A1A] border border-[#333] text-white px-4 pt-6 pb-2 rounded-xl focus:border-[var(--theme-color)] focus:ring-1 focus:ring-[var(--theme-color)] outline-none transition-all peer placeholder-transparent"
      placeholder={label}
      {...props}
    />
    <label className="absolute left-4 top-4 text-gray-500 text-xs transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-[var(--theme-color)] peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[10px]">
      {label}
    </label>
  </div>
);

const Toggle = ({ active, onChange }) => (
  <button onClick={() => { vibrate(); onChange(!active); }} className={cn("w-12 h-7 rounded-full transition-colors relative", active ? "bg-[var(--theme-color)]" : "bg-[#333]")}>
    <div className={cn("w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm", active ? "left-6" : "left-1")} />
  </button>
);

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#121212] border-t sm:border border-[#333] rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up shadow-2xl">
        <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-6 sm:hidden" />
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="p-2 bg-[#222] rounded-full text-gray-400"><X size={16}/></button>
        </div>
        {children}
      </div>
    </div>
  );
};

// ==================================================================================
// 4. SUB-COMPONENTS (SECTIONS)
// ==================================================================================

const ReviewCarousel = () => (
  <div className="w-full overflow-hidden py-4 mask-gradient-x">
    <div className="flex gap-4 animate-scroll-slow w-max">
      {[...REVIEWS, ...REVIEWS].map((r, i) => (
        <div key={i} className="w-64 bg-[#111] border border-[#222] p-4 rounded-2xl flex-shrink-0">
          <div className="flex text-yellow-500 mb-2 gap-0.5">{[...Array(5)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
          <p className="text-gray-300 text-xs italic mb-2 line-clamp-2">"{r.t}"</p>
          <p className="text-gray-500 text-[10px] font-bold uppercase">{r.a}</p>
        </div>
      ))}
    </div>
  </div>
);

const SummaryTicket = ({ data, cost, cityConfig }) => {
  return (
    <div className="relative bg-[#18181B] rounded-3xl overflow-hidden border border-[#333]">
      {/* Header do Ticket */}
      <div className="bg-[var(--theme-color)]/10 p-6 border-b border-dashed border-[#444] relative">
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-black rounded-full" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-black rounded-full" />
        <h4 className="text-[10px] font-black tracking-widest text-[var(--theme-color)] uppercase mb-1">Confirmação</h4>
        <h2 className="text-2xl font-bold text-white">{data.service?.name || 'Selecione...'}</h2>
        <p className="text-gray-400 text-xs mt-1">{data.date ? new Date(data.date).toLocaleDateString('pt-BR') : '--/--'} • {data.time || '--:--'} • {cityConfig.name}</p>
      </div>
      
      {/* Body do Ticket */}
      <div className="p-6 space-y-3">
        {data.service && (
            <div className="flex justify-between text-sm">
                <span className="text-gray-400">Serviço Base</span>
                <span className="text-white font-mono">{formatBRL(data.service.price)}</span>
            </div>
        )}
        {Object.entries(data.extras).map(([key, active]) => {
           if(!active) return null;
           const ex = EXTRAS.find(e => e.id === key);
           const val = ex.percent ? (data.service?.price * ex.percent) : ex.fixed;
           return (
             <div key={key} className="flex justify-between text-xs text-[var(--theme-color)]">
               <span>+ {ex.label}</span>
               <span className="font-mono">{formatBRL(val)}</span>
             </div>
           );
        })}
        
        <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-[#333]">
           <span>Deslocamento ({data.zone?.name})</span>
           <span className="font-mono">{cost.transport === 0 ? 'Grátis' : formatBRL(cost.transport)}</span>
        </div>

        {data.coupon && (
             <div className="flex justify-between text-xs text-green-500">
             <span>Cupom Primeira Vez</span>
             <span className="font-mono">- {formatBRL(CONFIG.COUPON_VALUE)}</span>
          </div>
        )}
      </div>

      {/* Footer Total */}
      <div className="bg-[#111] p-4 flex justify-between items-center">
         <span className="text-gray-400 font-bold text-sm">Total Estimado</span>
         <span className="text-2xl font-bold text-white tracking-tighter">{formatBRL(cost.total)}</span>
      </div>
    </div>
  );
};

// ==================================================================================
// 5. MAIN APP
// ==================================================================================

export default function App() {
  // --- STATES ---
  const [cityId, setCityId] = useStickyState('thaly_city_v3', 'sp');
  const [user, setUser] = useStickyState('thaly_user_v3', { name: '', phone: '', birth: '' });
  const [history, setHistory] = useStickyState(CONFIG.PERMANENT_KEY, { couponsUsed: [] });
  
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    service: null,
    extras: { upgrade: false, touch: false, aroma: false },
    date: null,
    time: null,
    zone: null,
    address: { type: 'home', text: '' },
    payment: 'pix',
    coupon: false
  });
  
  const [ui, setUi] = useState({ menu: false, cityModal: false, details: null });
  const [success, setSuccess] = useState(false);

  // --- DERIVED ---
  const city = CITIES[cityId];
  
  // Set theme color dynamically via CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', city.color);
  }, [city]);

  const financials = useMemo(() => {
    const base = data.service?.price || 0;
    let extras = 0;
    if (data.service) {
        if (data.extras.upgrade) extras += base * 0.3;
        if (data.extras.touch) extras += 60;
        if (data.extras.aroma) extras += 10;
    }
    
    // Logica Motel vs Zona
    let transport = 0;
    if (data.address.type === 'motel') {
        transport = city.fee; // Taxa fixa motel
    } else if (data.zone) {
        transport = data.zone.price * 2; // Ida e volta
    }

    const sub = base + extras + transport;
    const discount = data.coupon ? CONFIG.COUPON_VALUE : 0;
    
    return {
        base, extras, transport, total: Math.max(0, sub - discount), discount
    };
  }, [data, city]);

  // --- HANDLERS ---
  const handleNext = () => {
    vibrate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s + 1);
  };

  const handleBack = () => {
    vibrate();
    if (step > 0) setStep(s => s - 1);
  };

  const finalize = () => {
    if (data.coupon) {
        setHistory(prev => ({ ...prev, couponsUsed: [...prev.couponsUsed, 'FIRST_TIME'] }));
    }
    setSuccess(true);
    
    // Gerar Link WhatsApp
    const msg = `
*AGENDAMENTO - THALYSON (${city.name})* 🌿
-------------------------------
👤 *Cliente:* ${user.name}
📅 *Data:* ${data.date?.toLocaleDateString('pt-BR')} às ${data.time}
💆 *Serviço:* ${data.service?.name}

✨ *Extras:*
${Object.entries(data.extras).filter(([_,v])=>v).map(([k]) => `• ${EXTRAS.find(e=>e.id===k).label}`).join('\n') || 'Nenhum'}

📍 *Local:* ${data.address.type === 'motel' ? 'Motel' : 'Domicílio'}
${data.address.text} 
(${data.zone?.name})

💰 *Resumo:*
Serviço: ${formatBRL(financials.base + financials.extras)}
Deslocamento: ${financials.transport === 0 ? 'Grátis' : formatBRL(financials.transport)}
${data.coupon ? `Desconto: -${formatBRL(financials.discount)}` : ''}
*TOTAL: ${formatBRL(financials.total)}*
Pagamento: ${data.payment.toUpperCase()}
-------------------------------
_Enviado pelo Web App_
    `.trim();
    
    setTimeout(() => {
       window.open(`https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${encodeURIComponent(msg)}`, '_blank');
    }, 1500);
  };

  // --- RENDER HELPERS ---
  const isStepValid = () => {
    if (step === 0) return user.name.length > 2;
    if (step === 1) return !!data.service;
    if (step === 2) return !!data.date && !!data.time;
    if (step === 3) return true; // Extras optional
    if (step === 4) return !!data.zone && data.address.text.length > 3;
    return true;
  };

  // SUCCESS SCREEN
  if (success) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center animate-fade-in relative overflow-hidden">
        {/* Confetti Mock */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://cdn.dribbble.com/users/1162077/screenshots/3848914/confetti.gif')] bg-cover"/>
        
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-bounce-slow">
            <Check size={40} className="text-black" strokeWidth={4} />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Confirmado!</h1>
        <p className="text-gray-400 mb-8 max-w-xs mx-auto">Seu agendamento foi gerado. Se o WhatsApp não abrir, clique abaixo.</p>
        
        <div className="w-full max-w-sm mb-6 scale-90 origin-top">
             <SummaryTicket data={data} cost={financials} cityConfig={city} />
        </div>

        <Button onClick={() => window.location.reload()} variant="outline">Fazer Novo Pedido</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans selection:bg-[var(--theme-color)] selection:text-white">
      {/* GLOBAL STYLES & ANIMATIONS */}
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .mask-gradient-x { mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent); }
        .ios-scroll { -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; }
      `}</style>

      {/* HEADER FIXO */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="flex items-center justify-between px-5 py-3 pt-safe-top">
            <div className="flex items-center gap-3">
                {step > 0 && <button onClick={handleBack} className="p-1 -ml-2"><ChevronRight size={24} className="rotate-180 text-gray-400"/></button>}
                <div>
                    <h1 className="text-sm font-bold tracking-widest uppercase text-gray-400">Thalymassagens</h1>
                    <div onClick={() => setUi({ ...ui, cityModal: true })} className="flex items-center gap-1 cursor-pointer">
                        <MapPin size={12} style={{ color: city.color }} />
                        <span className="text-xs font-bold text-white">{city.name}</span>
                        <ChevronDown size={10} className="text-gray-500"/>
                    </div>
                </div>
            </div>
            <button onClick={() => setUi({...ui, menu: true})} className="p-2 bg-[#1A1A1A] rounded-full border border-[#333]">
                <Menu size={18} />
            </button>
        </div>
        {/* Progress Bar */}
        <div className="h-[2px] w-full bg-[#111]">
            <div className="h-full bg-[var(--theme-color)] transition-all duration-500 ease-out" style={{ width: `${((step + 1) / 6) * 100}%` }} />
        </div>
      </header>

      <main className="pt-24 px-5 max-w-md mx-auto space-y-8 animate-slide-up">
        
        {/* ETAPA 0: IDENTIFICAÇÃO */}
        {step === 0 && (
          <section className="space-y-6">
            <div className="space-y-1">
                <span className="text-[var(--theme-color)] font-bold text-xs uppercase tracking-widest">Bem-vindo</span>
                <h2 className="text-3xl font-bold leading-tight">Vamos começar.<br/>Como te chamam?</h2>
            </div>
            <div className="space-y-4">
                <Input label="Seu Nome" value={user.name} onChange={e => setUser({...user, name: e.target.value})} autoFocus />
                <Input label="Idade (Apenas números)" type="tel" maxLength={2} value={user.birth} onChange={e => setUser({...user, birth: e.target.value.replace(/\D/g,'')})} />
            </div>
            <div className="p-4 bg-[#111] rounded-2xl border border-[#222]">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2"><Heart size={12} className="text-red-500"/> Experiências Recentes</h3>
                <ReviewCarousel />
            </div>
          </section>
        )}

        {/* ETAPA 1: SERVIÇOS */}
        {step === 1 && (
            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Escolha sua Experiência</h2>
                <div className="space-y-4">
                    {SERVICES.map(s => (
                        <div key={s.id} onClick={() => { setData({...data, service: s}); }}
                            className={cn(
                                "relative p-5 rounded-3xl border transition-all cursor-pointer overflow-hidden group",
                                data.service?.id === s.id ? "bg-[#1A1A1A] border-[var(--theme-color)]" : "bg-[#111] border-[#222]"
                            )}>
                            {s.popular && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-3 py-1 rounded-bl-xl">POPULAR</div>}
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-white">{s.name}</h3>
                                <span className="bg-[#222] px-3 py-1 rounded-lg text-xs font-bold font-mono">{formatBRL(s.price)}</span>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed max-w-[90%]">{s.desc}</p>
                            <div className="flex gap-4 mt-4">
                                <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase"><Clock size={12}/> {s.time} min</div>
                                <div className="flex items-center gap-1 text-[10px] text-[var(--theme-color)] font-bold uppercase"><Zap size={12}/> +{s.xp} XP</div>
                            </div>
                            {/* Radio check visual */}
                            <div className={cn("absolute bottom-5 right-5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", data.service?.id === s.id ? "border-[var(--theme-color)] bg-[var(--theme-color)]" : "border-[#444]")}>
                                {data.service?.id === s.id && <Check size={14} className="text-white"/>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        {/* ETAPA 2: DATA & HORA */}
        {step === 2 && (
            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Quando será?</h2>
                
                {/* Date Strip */}
                <div className="flex gap-3 overflow-x-auto ios-scroll pb-4 -mx-5 px-5">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && d.toDateString() === new Date(data.date).toDateString();
                        return (
                            <button key={i} onClick={() => { vibrate(); setData({...data, date: d, time: null}) }}
                                className={cn("min-w-[72px] h-20 rounded-2xl flex flex-col items-center justify-center border transition-all snap-start", isSel ? "bg-[var(--theme-color)] border-[var(--theme-color)] text-white shadow-lg shadow-[var(--theme-color)]/20" : "bg-[#111] border-[#222] text-gray-500")}>
                                <span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>

                {/* Time Grid (Morning/Afternoon/Evening) */}
                <div className={cn("space-y-4 transition-opacity", !data.date && "opacity-30 pointer-events-none")}>
                     {['Tarde (13h-18h)', 'Noite (18h-22h)'].map(period => (
                         <div key={period}>
                             <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">{period}</h4>
                             <div className="grid grid-cols-4 gap-2">
                                 {['13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].filter(t => {
                                     const h = parseInt(t);
                                     if(period.includes('Tarde')) return h >= 13 && h < 18;
                                     return h >= 18;
                                 }).map(time => (
                                     <button key={time} onClick={() => { vibrate(); setData({...data, time}) }}
                                        className={cn("py-2 rounded-lg text-xs font-bold border transition-all", data.time === time ? "bg-white text-black border-white" : "bg-[#1A1A1A] border-[#333] hover:border-gray-500")}>
                                        {time}
                                     </button>
                                 ))}
                             </div>
                         </div>
                     ))}
                </div>
            </section>
        )}

        {/* ETAPA 3: EXTRAS & PERSONALIZAÇÃO */}
        {step === 3 && (
            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Personalize</h2>
                <div className="space-y-3">
                    {EXTRAS.map(ex => {
                        const active = data.extras[ex.id];
                        const price = ex.percent ? (data.service?.price * ex.percent) : ex.fixed;
                        return (
                            <div key={ex.id} onClick={() => { vibrate(); setData({...data, extras: {...data.extras, [ex.id]: !active}}) }}
                                className={cn("p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all", active ? "bg-[var(--theme-color)]/10 border-[var(--theme-color)]" : "bg-[#111] border-[#222]")}>
                                <div className="flex items-center gap-4">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", active ? "bg-[var(--theme-color)] text-white" : "bg-[#222] text-gray-500")}>
                                        <ex.icon size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-white">{ex.label}</p>
                                        <p className="text-[10px] text-gray-400">Adicionar ao serviço</p>
                                    </div>
                                </div>
                                <span className={cn("font-bold text-xs", active ? "text-[var(--theme-color)]" : "text-gray-500")}>+ {formatBRL(price)}</span>
                            </div>
                        )
                    })}
                </div>
                
                {/* Upselling do Cupom */}
                {!history.couponsUsed.includes('FIRST_TIME') && !data.coupon && (
                     <div onClick={() => setData({...data, coupon: true})} className="p-4 rounded-2xl border border-dashed border-[#FFD60A] bg-[#FFD60A]/5 flex items-center gap-4 cursor-pointer animate-pulse">
                         <Ticket className="text-[#FFD60A]" />
                         <div>
                             <p className="text-[#FFD60A] font-bold text-sm">Cupom de Primeira Vez</p>
                             <p className="text-[10px] text-gray-400">Toque para aplicar desconto de {formatBRL(CONFIG.COUPON_VALUE)}</p>
                         </div>
                     </div>
                )}
            </section>
        )}

        {/* ETAPA 4: LOCALIZAÇÃO */}
        {step === 4 && (
             <section className="space-y-6">
                 <h2 className="text-2xl font-bold">Onde te encontro?</h2>
                 <div className="flex p-1 bg-[#111] rounded-xl border border-[#222]">
                     {['home', 'motel', 'hotel'].map(t => (
                         <button key={t} onClick={() => setData({...data, address: {...data.address, type: t}})} 
                            className={cn("flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all", data.address.type === t ? "bg-[#333] text-white" : "text-gray-500")}>
                             {t === 'home' ? 'Residência' : t}
                         </button>
                     ))}
                 </div>
                 
                 {/* Zonas (Only if not Motel, or adapt logic) */}
                 {data.address.type !== 'motel' && (
                     <div className="grid grid-cols-2 gap-2">
                         {city.zones.map(z => (
                             <button key={z.id} onClick={() => setData({...data, zone: z})}
                                className={cn("p-3 rounded-xl border text-left transition-all", data.zone?.id === z.id ? "bg-[var(--theme-color)] border-[var(--theme-color)] text-white" : "bg-[#111] border-[#222] text-gray-400")}>
                                 <span className="block text-xs font-bold mb-1">{z.name}</span>
                                 <span className="text-[10px] opacity-70">Taxa: {z.price === 0 ? 'Grátis' : formatBRL(z.price*2)}</span>
                             </button>
                         ))}
                     </div>
                 )}

                 <Input 
                    label={data.address.type === 'motel' ? 'Nome do Motel e Suíte' : 'Endereço Completo (Rua, Nº, Compl)'} 
                    value={data.address.text} 
                    onChange={e => setData({...data, address: {...data.address, text: e.target.value}})} 
                 />
                 
                 {data.address.type === 'motel' && (
                     <p className="text-xs text-yellow-500 flex gap-2 items-start"><AlertTriangle size={14} className="mt-0.5"/> Em motéis, a taxa de deslocamento é fixa ({formatBRL(city.fee)}). O valor da suíte é pago diretamente ao estabelecimento.</p>
                 )}
             </section>
        )}

        {/* ETAPA 5: REVISÃO */}
        {step === 5 && (
            <section className="space-y-6 pb-20">
                <h2 className="text-2xl font-bold">Quase lá...</h2>
                <SummaryTicket data={data} cost={financials} cityConfig={city} />
                
                <h3 className="text-sm font-bold text-gray-400 uppercase mt-6 mb-3">Pagamento no Local</h3>
                <div className="grid grid-cols-3 gap-3">
                    {['pix', 'dinheiro', 'cartao'].map(p => (
                        <button key={p} onClick={() => setData({...data, payment: p})}
                            className={cn("py-3 rounded-xl border text-xs font-bold uppercase transition-all", data.payment === p ? "bg-white text-black border-white" : "bg-[#111] border-[#333] text-gray-500")}>
                            {p}
                        </button>
                    ))}
                </div>
            </section>
        )}

      </main>

      {/* FOOTER CTA STICKY */}
      <div className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-xl border-t border-white/5 p-5 pb-safe-bottom z-40">
         <div className="max-w-md mx-auto flex items-center gap-4">
             <div className="flex-1">
                 <p className="text-[10px] text-gray-400 uppercase font-bold">Total Estimado</p>
                 <p className="text-xl font-bold text-white">{formatBRL(financials.total)}</p>
             </div>
             <div className="w-1/2">
                {step < 5 ? (
                    <Button onClick={handleNext} disabled={!isStepValid()} className={!isStepValid() ? "opacity-50 cursor-not-allowed" : ""}>
                        Continuar <ArrowRight size={18}/>
                    </Button>
                ) : (
                    <Button onClick={finalize} variant="city">
                        Agendar <MessageCircle size={18}/>
                    </Button>
                )}
             </div>
         </div>
      </div>

      {/* MODAL CIDADES */}
      <Modal isOpen={ui.cityModal} onClose={() => setUi({...ui, cityModal: false})} title="Selecione sua Região">
           <div className="space-y-3 pb-8">
               {Object.values(CITIES).map(c => (
                   <button key={c.id} onClick={() => { setCityId(c.id); setUi({...ui, cityModal: false}); window.location.reload(); }}
                      className={cn("w-full p-4 rounded-xl border flex items-center justify-between", cityId === c.id ? "bg-[#222] border-white text-white" : "bg-[#111] border-[#222] text-gray-400")}>
                       <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: c.color}}><MapPin size={16} className="text-white"/></div>
                           <span className="font-bold">{c.name}</span>
                       </div>
                       {cityId === c.id && <Check size={16}/>}
                   </button>
               ))}
           </div>
      </Modal>

      {/* MENU LATERAL */}
      {ui.menu && (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setUi({...ui, menu: false})} />
            <div className="relative w-3/4 max-w-xs bg-[#111] h-full border-l border-[#222] p-6 animate-slide-in-right shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={() => setUi({...ui, menu: false})}><X className="text-gray-400"/></button>
                </div>
                <div className="space-y-2">
                    <Button variant="ghost" className="justify-start"><HelpCircle size={18}/> Ajuda</Button>
                    <Button variant="ghost" className="justify-start" onClick={() => { 
                         if(navigator.share) navigator.share({title: 'Thalymassagens', url: window.location.href}); 
                    }}><Share2 size={18}/> Compartilhar App</Button>
                </div>
                <div className="absolute bottom-8 left-0 w-full text-center">
                    <p className="text-[10px] text-gray-600 uppercase">Versão 3.5.0 (Pro)</p>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

// Icone extra necessario
const AlertTriangle = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
