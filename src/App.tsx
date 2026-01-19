import React, { useState, useEffect, useMemo, useRef, useReducer, useCallback } from 'react';
import {
  Check, Star, ArrowRight, Home, MessageCircle, 
  Ticket, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, X, HelpCircle, Instagram, 
  Calendar as CalendarIcon, Clock, User, AlertTriangle, 
  Car, Copy, Info, Zap, ChevronDown, Share2, Music, Bed, Heart, 
  Navigation, Ban, ChevronRight, Menu, RefreshCw, Lock, Smartphone
} from 'lucide-react';

// ==================================================================================
// 1. CONSTANTES & CONFIG (Imutáveis)
// ==================================================================================

const CONFIG = {
  APP_KEY: 'thaly_v26_pro_store', 
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 12.00, 
  XP_THRESHOLDS: { VIP: 100 },
  ANIMATION_DELAY_MS: 50,
  PRICING: { UPGRADE_PCT: 0.3, TOUCH: 63, AROMA: 5, RUSH_HOUR_FEE: 15 }
};

const CITIES_DB = {
  sp: { id: 'sp', name: 'São Paulo', short: 'SP', theme: '#0A84FF', motelFee: 75, locations: [
      { id: 'centro', name: 'Consolação / Centro', fee: 16 }, 
      { id: 'jardins', name: 'Jardins / Paulista', fee: 23 }, 
      { id: 'pinheiros', name: 'Pinheiros / V. Madalena', fee: 30 },
      { id: 'itaim', name: 'Itaim Bibi / V. Olímpia', fee: 36 },
      { id: 'moema', name: 'Moema / V. Mariana', fee: 44 },
      { id: 'outros', name: 'Outros Bairros (Consultar)', fee: 50 }
  ]},
  londrina: { id: 'londrina', name: 'Londrina', short: 'LDB', theme: '#32D74B', motelFee: 30, locations: [
      { id: 'centro', name: 'Centro / Gleba', fee: 15 },
      { id: 'zona_sul', name: 'Zona Sul', fee: 20 },
      { id: 'zona_norte', name: 'Zona Norte', fee: 25 }
  ]},
  santa_fe: { id: 'santa_fe', name: 'Santa Fé do Sul', short: 'SFS', theme: '#FFD60A', motelFee: 0, locations: [
      { id: 'cidade', name: 'Perímetro Urbano', fee: 21.50 },
      { id: 'rural', name: 'Ranchos / Rural', fee: 40 }
  ]}
};

const SERVICES = [
  { id: 'completa', name: 'Experiência Completa', desc: 'Relaxamento muscular + Finalização intensa.', duration: 60, price: 175, xp: 60, highlight: true },
  { id: 'relax', name: 'Massagem Relaxante', desc: 'Foco 100% terapêutico. Alívio de dores.', duration: 60, price: 145, xp: 30, highlight: false },
];

const TIME_SLOTS = {
  morning: ['08:00', '09:00', '10:00', '11:00'],
  afternoon: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  night: ['18:00', '19:00', '20:00', '21:00']
};

// ==================================================================================
// 2. HOOKS & UTILS (Lógica Pura)
// ==================================================================================

const useHaptic = () => {
  return useCallback((pattern = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern);
  }, []);
};

const usePersistedState = (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch (e) { return initial; }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};

// REDUCER PARA MÁQUINA DE ESTADO DO PEDIDO
const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CITY':
      return { ...state, city: action.payload, location: { ...state.location, zone: action.payload.locations[0] } };
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'UPDATE_NESTED':
      return { ...state, [action.parent]: { ...state[action.parent], [action.field]: action.value } };
    case 'TOGGLE_EXTRA':
      return { ...state, extras: { ...state.extras, [action.extra]: !state.extras[action.extra] } };
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
};

const initialBookingState = {
  city: CITIES_DB.sp,
  name: '', age: '', medical: false,
  mood: null, service: null, date: null, time: null,
  extras: { upgrade: false, touch: false, aroma: false },
  location: { type: 'home', zone: CITIES_DB.sp.locations[0], street: '', number: '', complement: '' },
  payment: null, couponActive: false
};

const useBookingPrice = (state) => {
    return useMemo(() => {
        if (!state.service) return { total: 0, xp: 0 };
        
        let base = state.service.price;
        let xp = state.service.xp;
        let extrasTotal = 0;

        if (state.extras.upgrade) { extrasTotal += base * CONFIG.PRICING.UPGRADE_PCT; xp += 25; }
        if (state.extras.touch) { extrasTotal += CONFIG.PRICING.TOUCH; xp += 30; }
        if (state.extras.aroma) { extrasTotal += CONFIG.PRICING.AROMA; xp += 15; }

        const isNight = state.time && parseInt(state.time) >= 18;
        const rushFee = isNight ? CONFIG.PRICING.RUSH_HOUR_FEE : 0;
        
        // Lógica de Deslocamento
        const transport = state.location.type === 'motel' 
            ? state.city.motelFee 
            : (state.location.zone?.fee || 0) * 2;

        const subtotal = base + extrasTotal + rushFee + transport;
        const discount = state.couponActive ? CONFIG.COUPON_VAL : 0;

        return {
            base, extrasTotal, rushFee, transport, subtotal, discount,
            total: Math.max(0, subtotal - discount),
            xpTotal: xp
        };
    }, [state]);
};

// ==================================================================================
// 3. COMPONENTES VISUAIS (Atomic Design)
// ==================================================================================

const XPBar = ({ current, max = 100 }) => {
    const pct = Math.min(100, (current / max) * 100);
    return (
        <div className="w-full mb-6">
            <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1">
                <span>Nível {current >= max ? 'VIP' : 'Iniciante'}</span>
                <span>{current}/{max} XP</span>
            </div>
            <div className="h-2 bg-[#222] rounded-full overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 z-10 animate-pulse"></div>
                <div 
                    className="h-full bg-[var(--primary)] transition-all duration-1000 ease-out relative" 
                    style={{ width: `${pct}%` }}
                >
                    {pct >= 100 && <div className="absolute right-0 top-0 bottom-0 w-2 bg-white box-shadow-[0_0_10px_white]"></div>}
                </div>
            </div>
        </div>
    );
};

const StepWizard = ({ stage, total, onBack }) => (
    <div className="fixed top-0 left-0 w-full bg-[#050505]/90 backdrop-blur-md z-50 border-b border-white/5 pt-safe-top">
        <div className="flex items-center justify-between px-4 h-14">
            <button onClick={onBack} disabled={stage === 0} className={`p-2 rounded-full ${stage===0 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white'}`}>
                <ChevronRight className="rotate-180" size={24}/>
            </button>
            <span className="font-black text-sm tracking-widest text-white/90">THALYSON</span>
            <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-xs font-bold">
                {stage + 1}
            </div>
        </div>
        <div className="h-[2px] w-full bg-[#111]">
            <div className="h-full bg-[var(--primary)] transition-all duration-500 ease-out" style={{ width: `${((stage+1)/total)*100}%` }}></div>
        </div>
    </div>
);

const RadioCard = ({ selected, onClick, icon: Icon, label, sub, color = "text-white" }) => (
    <button 
        onClick={onClick}
        className={`relative w-full p-4 rounded-2xl border text-left transition-all duration-200 active:scale-[0.98] group
        ${selected 
            ? 'bg-[#1C1C1E] border-[var(--primary)] shadow-[0_0_20px_rgba(0,0,0,0.5)]' 
            : 'bg-[#111] border-[#222] hover:border-[#333]'}`}
    >
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors 
                ${selected ? 'bg-[var(--primary)] text-white' : 'bg-[#222] text-gray-500'}`}>
                <Icon size={22} />
            </div>
            <div className="flex-1">
                <h3 className={`font-bold text-sm ${selected ? 'text-white' : 'text-gray-300'}`}>{label}</h3>
                {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
            </div>
            {selected && <div className="w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center">
                <Check size={12} className="text-white"/>
            </div>}
        </div>
    </button>
);

const WalletTicket = ({ data, pricing }) => (
    <div className="relative w-full bg-[#1C1C1E] rounded-3xl overflow-hidden shadow-2xl animate-enter transition-transform hover:scale-[1.01]">
        {/* CSS Mask Logic for Holes would go here in styled-components, simulating with divs for simplicity in single-file */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#050505] z-10"></div>
        <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#050505] z-10"></div>
        
        {/* Header */}
        <div className="p-6 pb-8 bg-gradient-to-b from-[#222] to-[#1C1C1E] border-b border-dashed border-[#444] text-center">
            <p className="text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase mb-2">Comprovante de Reserva</p>
            <h2 className="text-2xl font-black text-white mb-1">{data.service?.name || "Serviço"}</h2>
            <div className="inline-flex items-center gap-2 bg-[var(--primary)]/10 px-3 py-1 rounded-full border border-[var(--primary)]/20 mt-2">
                <CalendarIcon size={12} className="text-[var(--primary)]"/>
                <span className="text-xs font-bold text-[var(--primary)] uppercase">
                    {data.date ? `${data.date.getDate()}/${data.date.getMonth()+1}` : '--/--'} • {data.time || '--:--'}
                </span>
            </div>
        </div>

        {/* Body */}
        <div className="p-6 pt-8 space-y-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Serviço Base</span>
                <span className="text-white font-bold">R$ {pricing.base.toFixed(2)}</span>
            </div>
            {data.extras.upgrade && <div className="flex justify-between text-xs text-[var(--primary)]"><span>+ 30 Minutos</span><span>R$ {(pricing.base * CONFIG.PRICING.UPGRADE_PCT).toFixed(2)}</span></div>}
            
            {pricing.transport > 0 && (
                <div className="flex justify-between items-center text-xs text-yellow-500 bg-yellow-500/5 p-2 rounded-lg border border-yellow-500/10">
                    <span className="flex items-center gap-1"><Car size={12}/> Deslocamento ({data.city.short})</span>
                    <span className="font-bold">R$ {pricing.transport.toFixed(2)}</span>
                </div>
            )}
            
            {data.couponActive && (
                <div className="flex justify-between items-center text-xs text-green-400">
                    <span className="flex items-center gap-1"><Ticket size={12}/> Cupom VIP</span>
                    <span>- R$ {pricing.discount.toFixed(2)}</span>
                </div>
            )}

            <div className="pt-4 mt-2 border-t border-[#333] flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Total a Pagar</span>
                    <span className="text-3xl font-black text-white tracking-tighter">R$ {pricing.total.toFixed(2)}</span>
                </div>
                <QrCode size={40} className="text-white/20"/>
            </div>
        </div>
        
        {/* Bottom Decorative */}
        <div className="h-2 bg-[var(--primary)] w-full"></div>
    </div>
);

// ==================================================================================
// 4. MAIN APP
// ==================================================================================

export default function App() {
  const vibrate = useHaptic();
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState(0);
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState);
  const pricing = useBookingPrice(state);
  
  // Efeito de Load Inicial "Fake"
  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
    // Recuperar dados persistidos se existirem (simplificado)
  }, []);

  // Dynamic Theme Injection
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', state.city.theme);
  }, [state.city]);

  const handleNext = () => {
    vibrate(15);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStage(p => p + 1);
  };

  const handleBack = () => {
    vibrate(5);
    setStage(p => Math.max(0, p - 1));
  };

  const generateWhatsAppLink = () => {
    const text = `*NOVA RESERVA - ${state.city.short}*\n----------------\n👤 ${state.name} (${state.age})\n📅 ${state.date?.toLocaleDateString()} às ${state.time}\n💆 ${state.service?.name}\n💰 Total: R$ ${pricing.total.toFixed(2)}`;
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
  };

  if (loading) return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-[#222] border-t-[var(--primary)] rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest animate-pulse">Carregando...</p>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[var(--primary)] selection:text-white pb-32">
        <style>{`
            :root { --bg-card: #141414; }
            .ios-scroll { -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory; }
            .ios-scroll > * { scroll-snap-align: start; }
            .animate-enter { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
            @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
            input:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
        `}</style>

        {/* HEADER PROGRESSO */}
        <StepWizard stage={stage} total={5} onBack={handleBack} />

        <main className="max-w-md mx-auto px-5 pt-24">
            
            {/* STAGE 0: INTRO & USER DATA */}
            {stage === 0 && (
                <div className="space-y-6 animate-enter">
                    <header>
                        <span className="text-[var(--primary)] font-bold text-[10px] tracking-widest uppercase mb-2 block">Bem-vindo</span>
                        <h1 className="text-3xl font-bold leading-tight mb-4">Seu momento de<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">relaxamento absoluto.</span></h1>
                    </header>

                    {/* CITY SELECTOR (New Visuals) */}
                    <div className="flex gap-3 overflow-x-auto ios-scroll pb-2 no-scrollbar">
                        {Object.values(CITIES_DB).map(city => (
                            <button key={city.id} onClick={() => dispatch({type: 'SET_CITY', payload: city})}
                                className={`min-w-[120px] p-3 rounded-xl border transition-all ${state.city.id === city.id ? `bg-[${city.theme}]/10 border-[${city.theme}] ring-1 ring-[${city.theme}]` : 'bg-[#111] border-[#222] opacity-60'}`}>
                                <MapPin size={16} style={{ color: city.theme }} className="mb-2"/>
                                <span className="text-xs font-bold block">{city.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="bg-[#141414] border border-[#222] p-5 rounded-3xl space-y-4 shadow-lg">
                        <div>
                            <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Seu Nome</label>
                            <input 
                                value={state.name} 
                                onChange={e => dispatch({type: 'UPDATE_FIELD', field: 'name', value: e.target.value})}
                                placeholder="Como deseja ser chamado?" 
                                className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl p-3 text-sm focus:border-[var(--primary)] transition-colors"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 mb-1 block">Idade</label>
                                <input type="tel" maxLength={2} value={state.age} onChange={e => dispatch({type: 'UPDATE_FIELD', field: 'age', value: e.target.value.replace(/\D/g,'')})}
                                className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl p-3 text-sm text-center"/>
                            </div>
                            <button 
                                onClick={() => dispatch({type: 'UPDATE_FIELD', field: 'medical', value: !state.medical})}
                                className={`rounded-xl border flex flex-col items-center justify-center text-xs font-bold transition-all ${state.medical ? 'bg-[var(--primary)]/20 border-[var(--primary)] text-[var(--primary)]' : 'bg-[#0A0A0A] border-[#333] text-gray-500'}`}
                            >
                                <Check size={16} className="mb-1"/>
                                <span>Saúde OK</span>
                            </button>
                        </div>
                    </div>

                    <button 
                        onClick={handleNext} 
                        disabled={!state.name || !state.age || !state.medical}
                        className="w-full py-4 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        Começar Agendamento <ArrowRight size={18}/>
                    </button>
                    
                    <p className="text-[10px] text-center text-gray-600 flex items-center justify-center gap-1">
                        <Lock size={10}/> Seus dados estão seguros e não serão compartilhados.
                    </p>
                </div>
            )}

            {/* STAGE 1: SERVICES & ADDONS */}
            {stage === 1 && (
                <div className="animate-enter space-y-6">
                    <XPBar current={pricing.xpTotal} max={CONFIG.XP_THRESHOLDS.VIP} />
                    
                    <h3 className="text-lg font-bold">Escolha a Experiência</h3>
                    <div className="space-y-4">
                        {SERVICES.map((srv, idx) => (
                            <div key={srv.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-enter">
                                <RadioCard 
                                    selected={state.service?.id === srv.id} 
                                    onClick={() => { dispatch({type: 'UPDATE_FIELD', field: 'service', value: srv}); vibrate(); }}
                                    icon={SparkleIcon} // Placeholder icon
                                    label={srv.name}
                                    sub={`R$ ${srv.price} • ${srv.duration} min`}
                                />
                            </div>
                        ))}
                    </div>

                    {state.service && (
                        <div className="animate-enter">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mt-8 mb-4">Adicionais Premium</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => dispatch({type: 'TOGGLE_EXTRA', extra: 'upgrade'})} className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${state.extras.upgrade ? 'bg-[var(--primary)]/20 border-[var(--primary)] text-white' : 'bg-[#111] border-[#222] text-gray-500'}`}>
                                    <Clock size={20}/> +30 Minutos
                                </button>
                                <button onClick={() => dispatch({type: 'TOGGLE_EXTRA', extra: 'touch'})} className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${state.extras.touch ? 'bg-[var(--primary)]/20 border-[var(--primary)] text-white' : 'bg-[#111] border-[#222] text-gray-500'}`}>
                                    <Flame size={20}/> Interação
                                </button>
                            </div>
                        </div>
                    )}
                    
                     <button onClick={handleNext} disabled={!state.service} className="fixed bottom-6 left-5 right-5 h-14 bg-[var(--primary)] text-white font-bold rounded-2xl shadow-xl z-20 flex items-center justify-center disabled:translate-y-24 transition-transform">
                        Continuar (R$ {pricing.total})
                    </button>
                </div>
            )}

            {/* STAGE 2: DATE & TIME (Smart Grouping) */}
            {stage === 2 && (
                <div className="animate-enter space-y-6">
                    <h3 className="text-lg font-bold">Data & Horário</h3>
                    
                    {/* Date Scroll */}
                    <div className="flex gap-3 overflow-x-auto ios-scroll pb-4 -mx-5 px-5">
                        {[...Array(14)].map((_, i) => {
                            const d = new Date(); d.setDate(d.getDate() + i);
                            const isSel = state.date?.toDateString() === d.toDateString();
                            return (
                                <button key={i} onClick={() => { dispatch({type: 'UPDATE_FIELD', field: 'date', value: d}); vibrate(); }}
                                    className={`min-w-[72px] h-[84px] rounded-2xl border flex flex-col items-center justify-center transition-all ${isSel ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-lg scale-105' : 'bg-[#111] border-[#222] text-gray-500'}`}>
                                    <span className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                    <span className="text-2xl font-bold">{d.getDate()}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Time Slots Grouped */}
                    {state.date && (
                        <div className="space-y-6 animate-enter">
                            {Object.entries(TIME_SLOTS).map(([period, slots]) => (
                                <div key={period}>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                        {period === 'morning' ? <Sun size={12}/> : period === 'afternoon' ? <Cloud size={12}/> : <Moon size={12}/>}
                                        {period === 'morning' ? 'Manhã' : period === 'afternoon' ? 'Tarde' : 'Noite'}
                                    </h4>
                                    <div className="grid grid-cols-4 gap-3">
                                        {slots.map(t => (
                                            <button key={t} onClick={() => { dispatch({type: 'UPDATE_FIELD', field: 'time', value: t}); handleNext(); }}
                                                className={`py-2 rounded-lg border text-sm font-medium transition-all hover:border-white/40 ${state.time === t ? 'bg-white text-black border-white' : 'bg-[#141414] border-[#222] text-gray-300'}`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* STAGE 3: LOCATION (With Mock Geo) */}
            {stage === 3 && (
                <div className="animate-enter space-y-6">
                    <div className="flex justify-between items-center">
                         <h3 className="text-lg font-bold">Onde será?</h3>
                         <button className="text-[var(--primary)] text-xs font-bold flex items-center gap-1" onClick={() => { vibrate(); alert('Geolocalização simulada!'); }}>
                            <Navigation size={12}/> Usar GPS
                         </button>
                    </div>

                    <div className="flex bg-[#141414] p-1 rounded-xl border border-[#222]">
                        {['home', 'hotel', 'motel'].map(type => (
                            <button key={type} onClick={() => dispatch({type: 'UPDATE_NESTED', parent: 'location', field: 'type', value: type})}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition-all ${state.location.type === type ? 'bg-[#333] text-white shadow' : 'text-gray-500'}`}>
                                {type === 'home' ? 'Residência' : type}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3">
                         <input placeholder="Rua / Avenida" value={state.location.street} onChange={e => dispatch({type: 'UPDATE_NESTED', parent: 'location', field: 'street', value: e.target.value})} className="w-full bg-[#111] border border-[#333] p-4 rounded-xl text-sm focus:border-[var(--primary)]"/>
                         <div className="flex gap-3">
                             <input placeholder="Número" className="w-1/3 bg-[#111] border border-[#333] p-4 rounded-xl text-sm"/>
                             <select className="w-2/3 bg-[#111] border border-[#333] p-4 rounded-xl text-sm appearance-none text-gray-300"
                                onChange={(e) => {
                                    const loc = state.city.locations.find(l => l.id === e.target.value);
                                    dispatch({type: 'UPDATE_NESTED', parent: 'location', field: 'zone', value: loc})
                                }}>
                                 {state.city.locations.map(l => (
                                     <option key={l.id} value={l.id}>{l.name} (+R${l.fee * 2})</option>
                                 ))}
                             </select>
                         </div>
                    </div>
                    
                    <button onClick={handleNext} className="w-full py-4 bg-[#222] border border-[#333] text-white font-bold rounded-2xl mt-4">Confirmar Endereço</button>
                </div>
            )}

            {/* STAGE 4: REVIEW & PAY */}
            {stage === 4 && (
                <div className="animate-enter pb-10">
                    <h3 className="text-lg font-bold mb-6">Revisão Final</h3>
                    
                    <WalletTicket data={state} pricing={pricing} />

                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-[#111] rounded-xl border border-[#222]">
                             <Shield size={20} className="text-green-500"/>
                             <div>
                                 <p className="text-xs font-bold text-white">Pagamento Seguro</p>
                                 <p className="text-[10px] text-gray-500">Pague somente no local (Dinheiro/Pix).</p>
                             </div>
                        </div>

                        <label className="flex items-start gap-3 p-2">
                             <input type="checkbox" className="mt-1 rounded border-gray-600 bg-transparent text-[var(--primary)]"/>
                             <span className="text-xs text-gray-400">Declaro que li e concordo com os <u className="text-white">Termos de Serviço</u> e política de cancelamento.</span>
                        </label>
                    </div>

                    <a href={generateWhatsAppLink()} target="_blank" rel="noreferrer"
                        className="w-full py-4 bg-[#32D74B] text-black font-black text-lg rounded-2xl shadow-[0_4px_30px_rgba(50,215,75,0.3)] flex items-center justify-center gap-2 mt-6 animate-pulse">
                        <MessageCircle fill="black" size={24}/> CONFIRMAR VIA WHATSAPP
                    </a>
                </div>
            )}

        </main>
    </div>
  );
}

// Icons placeholders for cleaner code block
const Sun = (p) => <Flame {...p}/>; 
const Moon = (p) => <Wind {...p}/>;
const Cloud = (p) => <User {...p}/>; 
const SparkleIcon = (p) => <Star {...p}/>;
