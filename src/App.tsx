import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';

// ==================================================================================
// ESTILOS E ÍCONES
// ==================================================================================

const GlobalStyles = ({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
    
    * { font-family: 'Inter', sans-serif; box-sizing: border-box; }
    h1, h2, h3, h4, h5, h6 { font-family: 'Poppins', sans-serif; }
    
    /* CORREÇÃO DO FUNDO BRANCO NO MOBILE */
    html, body {
      background-color: ${isDark ? '#09090b' : '#ffffff'};
      color: ${isDark ? '#ffffff' : '#000000'};
      transition: background-color 0.3s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      scroll-behavior: smooth;
    }
    
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Animação de entrada vertical */
    .fade-slide-up {
      animation: fadeSlideUp 0.6s ease-out forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    
    @keyframes fadeSlideUp {
      to { opacity: 1; transform: translateY(0); }
    }
    
    .emoji-icon { 
      font-style: normal; 
      display: inline-block; 
      line-height: 1; 
      vertical-align: middle;
      text-align: center;
    }
  `}} />
);

// Sistema Híbrido: SVG Outline para UI/Serviços e Emojis para Extras
const Icon = ({ name, size = 22, className = "", isEmoji = false }: { name: string, size?: number, className?: string, isEmoji?: boolean }) => {
  if (isEmoji) {
    return <span className={`emoji-icon ${className}`} style={{ fontSize: size }}>{name}</span>;
  }

  const paths: Record<string, string> = {
    'chevron-left': 'M15 18l-6-6 6-6',
    'chevron-right': 'M9 18l6-6-6-6',
    'chevron-down': 'M6 9l6 6 6-6',
    'x': 'M18 6L6 18M6 6l12 12',
    'check': 'M20 6L9 17l-5-5',
    'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01',
    'settings': 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z',
    'share': 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
    'globe': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
    'sun': 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
    'moon': 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
    'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    'user-check': 'M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M8.5 3a4 4 0 100 8 4 4 0 000-8z M20 8v6M23 11h-6',
    'sparkles': 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    'package': 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM16.5 9.4L7.5 4.21M3.3 7l8.7 5 8.7-5M12 22v-10',
    'layers': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    'user': 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
    'home': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    'bed': 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    'building': 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5',
    'map-pin': 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    'car': 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2',
    'calendar': 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    'smartphone': 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    'message': 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8.9h.5a8.48 8.48 0 018 8v.5z',
    'watch': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
    'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
    'banknote': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'shield': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    'shower': 'M12 4v4m0 0l-2 2m2-2l2 2M7.5 12.5L5 15m14-2.5L21.5 15M10 15l-1 4m6-4l1 4',
    'hand': 'M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3',
    'clock': 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    'award': 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
    'trophy': 'M8 21h8M12 17v4m9-13.5a2.5 2.5 0 00-5 0v3a2.5 2.5 0 005 0v-3zM3 7.5a2.5 2.5 0 015 0v3a2.5 2.5 0 01-5 0v-3zM9 4.5h6',
    'gift': 'M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7m16-4h-4m-8 0H4m12 0a2 2 0 104 0m-4 0a2 2 0 11-4 0m0 0H8m4 0a2 2 0 11-4 0m0 0a2 2 0 10-4 0m4 8v7m0-7v-4',
    'camera': 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    'video': 'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z'
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={paths[name] || ''} />
    </svg>
  );
};

// ==================================================================================
// CONFIGURAÇÃO
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v19_full',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_SECURE_V5',
  START_HOUR: 9,
  END_HOUR: 20
} as const;

// Types
interface ServiceItem {
  id: string; min: number; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string;
}
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; loc: string; t: string; s: number; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { street: string; number: string; district: string; city: string; comp: string; placeName: string; }
interface BookingData { type: 'single' | 'pack'; item: ServiceItem | null; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; mediaAllowed: boolean; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// COMPONENTES UI
// ==================================================================================
const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.97] font-poppins gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25",
    secondary: "bg-zinc-800 border-2 border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-green-500/20",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"
  };
  const sizes = { sm: "h-10 text-sm px-4", md: "h-12 text-sm px-6", lg: "h-14 text-base px-8", xl: "h-16 text-base px-10" };
  
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant as keyof typeof variants] || variants.primary} ${sizes[size as keyof typeof sizes]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span> : <>{icon && <Icon name={icon} size={20} />}{children}</>}
    </button>
  );
};

const Card = ({ children, className = '', onClick, active = false, isDark = true }: any) => (
  <div onClick={onClick} className={`relative p-8 rounded-3xl transition-all duration-300 flex flex-col h-full font-poppins ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-1' : ''} ${active ? 'bg-blue-900/10 border-2 border-blue-500 shadow-lg shadow-blue-500/20' : isDark ? 'bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700' : 'bg-white border border-slate-200 shadow-lg hover:border-slate-300'} ${className}`}>
    {children}
  </div>
);

const InputField = ({ label, value, onChange, placeholder, icon, type = "text", isDark = true }: any) => (
  <div className="space-y-2 w-full">
    {label && <label className={`text-xs font-bold uppercase tracking-wider font-poppins ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{label}</label>}
    <div className="relative">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name={icon} size={20} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-12 rounded-xl outline-none text-sm font-medium transition-all font-poppins ${icon ? 'pl-12 pr-4' : 'px-4'} ${isDark ? 'bg-zinc-900 border-2 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500' : 'bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-600'}`} />
    </div>
  </div>
);

const ReviewCard = ({ review, isDark }: { review: Review; isDark: boolean }) => (
  <div className={`w-full h-full p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-md'}`}>
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>{review.n.charAt(0)}</div>
        <div><span className={`text-sm font-semibold block ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{review.n}</span><span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{review.loc}</span></div>
      </div>
      <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Icon key={i} name="star" size={14} className={i < review.s ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-zinc-700' : 'text-slate-400'} />)}</div>
    </div>
    <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{review.t}</p>
  </div>
);

const SmartTimer = ({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  useEffect(() => { const interval = setInterval(() => { setTime(prev => prev <= 0 ? 600 : prev - 1); }, 1000); return () => clearInterval(interval); }, []);
  const format = (t: number) => { const m = Math.floor(t / 60); const s = t % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  const isUrgent = time < 60;
  return (
    <div className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-inter ${isUrgent ? 'bg-red-500/10 border-red-500/30 text-red-400' : isDark ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
      <Icon name="watch" size={20} className={isUrgent ? 'animate-pulse' : ''} />
      <span className="text-sm font-semibold">{text}: <span className="font-mono">{format(time)}</span></span>
    </div>
  );
};

const FAQItem = ({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-center justify-between text-left group font-inter">
        <span className={`text-sm font-semibold font-inter ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{q}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : isDark ? 'text-zinc-500' : 'text-slate-500'}`}><Icon name="chevron-down" size={20} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}><p className={`text-sm font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p></div>
    </div>
  );
};

const RuleItem = ({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Icon name={rule.icon} size={24} /></div>
    <div><h4 className={`text-base font-bold mb-1 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.title}</h4><p className={`text-sm leading-relaxed font-inter ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{rule.description}</p></div>
  </div>
);

// ==================================================================================
// FUNÇÕES UTILITÁRIAS
// ==================================================================================
const sanitizeInput = (value: string): string => value.replace(/[<>&"']/g, '');
const validateAddress = (address: Address): boolean => !!(address.street && address.number && address.district && address.city);

// ==================================================================================
// DADOS (ATUALIZADOS)
// ==================================================================================
const generateReviews = (isPT: boolean): Review[] => {
  const reviews = [
    { n: "Giovana", loc: "Hotel Portal", t: "Mãos abençoadas! Precisava desse descanso. Foi super respeitoso e relaxante. ❤️", s: 5 },
    { n: "Bruno", loc: "SP", t: "Massagem muito bem executada. Recomendo muito.", s: 5 },
    { n: "Roberto", loc: "SP", t: "A sensação de paz foi indescritível. A finalização liberou tensões de meses.", s: 5 },
    { n: "Carla", loc: "Rio Preto", t: "Pegada firme que relaxa e desperta. Alívio total no final.", s: 5 },
    { n: "Lucas", loc: "Londrina", t: "Discrição total. A tântrica me permitiu redescobrir meu corpo. Intenso.", s: 5 },
    { n: "Felipe", loc: "Votuporanga", t: "Experiência de conexão rara. Saí trêmulo de uma forma boa.", s: 5 },
    { n: "Gustavo", loc: "Hotel Ibis", t: "Combinação perfeita de relaxante e sensitiva. Leveza absurda.", s: 5 },
    { n: "Sérgio", loc: "Santa Fé", t: "Tenho ansiedade e isso foi melhor que terapia. Clímax libertador.", s: 5 },
    { n: "Marcelo", loc: "SP", t: "Lingam executado com técnica precisa e respeitosa. Prazer genuíno.", s: 5 },
    { n: "André", loc: "Motel K2", t: "Discrição absoluta. Thalyson tem uma energia muito boa.", s: 5 },
    { n: "Eduardo", loc: "Rio Preto", t: "A técnica dele para construir e liberar energia é de outro mundo.", s: 5 },
    { n: "Diego", loc: "Fernandópolis", t: "Pude ser eu mesmo e expressar meu prazer sem julgamentos.", s: 5 }
  ];
  return reviews;
};

const getData = (lang: string) => {
  const isPT = lang === 'pt';
  const currency = isPT ? 'R$' : '$';
  const USD_RATE = 5.75;
  const getPrice = (brl: number) => isPT ? brl : Math.round(brl / USD_RATE);

  const p = {
    relax: getPrice(125),
    sens: getPrice(155),
    titan: getPrice(195),
    packRelax: { v: getPrice(390), full: getPrice(500), save: getPrice(110) },
    packTri: { v: getPrice(480), full: getPrice(585), save: getPrice(105) },
    packMix: { v: getPrice(600), full: getPrice(700), save: getPrice(100) },
    extras: { more_time: getPrice(55), touch: getPrice(55), aroma: getPrice(5), hair_trim: getPrice(66), pain_relief: getPrice(10) }
  };
  
  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Bem-vindo" : "Welcome" },
      { level: 2, xpNeeded: 100, reward: getPrice(15), title: isPT ? "Amigo" : "Friend" },
      { level: 3, xpNeeded: 350, reward: getPrice(30), title: isPT ? "Conectado" : "Connected" },
      { level: 4, xpNeeded: 800, reward: getPrice(50), title: isPT ? "Íntimo" : "Intimate" }
    ],
    services: [
      {
        id: 'relaxante',
        min: 60,
        price: p.relax,
        icon: "user-check",
        tag: isPT ? "CORPO INTEIRO" : "FULL BODY",
        title: isPT ? "Massagem Clássica" : "Classic Massage",
        desc: isPT ? "A relaxante é no corpo inteiro. Foco nas costas, mãos, coxas e pés." : "Full body massage. Focus on back, hands, thighs and feet.",
        details: isPT 
          ? "Massagem completa (Corpo Inteiro)\nFoco especial: Costas, Mãos, Coxas e Pés\nAlívio profundo de dores e estresse\n(Modalidade terapêutica)" 
          : "Full Body Massage\nSpecial focus: Back, Hands, Thighs, Feet\nDeep relief from pain and stress\n(Therapeutic mode)"
      },
      {
        id: 'sensitiva',
        min: 60,
        price: p.sens,
        icon: "sparkles",
        tag: isPT ? "TOQUE DE PELE" : "SKIN TOUCH",
        title: isPT ? "Tântrica Sensorial" : "Sensory Tantra",
        desc: isPT ? "Toques leves e estimulantes (não uso plumas). Reconexão sensorial." : "Light stimulating touches (no feathers used). Sensory reconnection.",
        details: isPT 
          ? "Toques sutis de pele (apenas mãos, sem plumas)\nDespertar sensorial intenso\nSensação de leveza extrema\nFinalização especial inclusa (Lingam)" 
          : "Subtle skin touches (hands only, no feathers)\nIntense sensory awakening\nExtreme lightness feeling\nSpecial finish included (Lingam)"
      },
      {
        id: 'mista',
        min: 60,
        price: p.titan,
        icon: "zap",
        tag: isPT ? "LIBERDADE TOTAL" : "TOTAL FREEDOM",
        title: isPT ? "Fusion Experience" : "Fusion Experience",
        desc: isPT ? "A união perfeita. Finalização intensa e clara: pode gozar." : "Perfect union. Intense and clear finish: climax allowed.",
        details: isPT 
          ? "Começa com relaxamento muscular profundo\nEvolui para troca de energia corpo a corpo\nFinalização completa permitida (Pode gozar)\nSem tabus, foco no seu prazer" 
          : "Starts with deep muscle relaxation\nEvolves into body-to-body energy exchange\nFull finish allowed (Climax allowed)\nNo taboos, focus on your pleasure"
      }
    ] as ServiceItem[],
    extras: [
      { id: 'more_time', price: p.extras.more_time, icon: "⏱️", isEmoji: true, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Mais tempo para você" : "More time for you" },
      { id: 'touch', price: p.extras.touch, icon: "🖐️", isEmoji: true, label: isPT ? "Troca Interativa" : "Interactive Touch", desc: isPT ? "Sinta a liberdade de tocar" : "Feel free to touch" },
      { id: 'aroma', price: p.extras.aroma, icon: "🌸", isEmoji: true, label: isPT ? "Aromaterapia" : "Aromatherapy", desc: isPT ? "Fragrâncias que acalmam" : "Calming fragrances" },
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "✂️", isEmoji: true, label: isPT ? "Aparar Pêlos" : "Trimming", desc: isPT ? "Máquina em até 2 partes do corpo" : "Trimmer on up to 2 body parts" },
      { id: 'pain_relief', price: p.extras.pain_relief, icon: "💊", isEmoji: true, label: isPT ? "Pomada para Dores" : "Pain Relief Cream", desc: isPT ? "Alivia as dores no corpo durante a sessão" : "Relieves body pain during session" }
    ],
    plans: [
      { id: 'pack_relax', type: 'pack', title: isPT ? "Refúgio Anti-Stress" : "Anti-Stress Refuge", price: p.packRelax.v, fullPrice: p.packRelax.full, savings: p.packRelax.save, desc: isPT ? "4 Sessões Relaxantes" : "4 Relax Sessions", details: isPT ? "Garanta sua paz semanalmente.\nO cuidado constante que você merece." : "Ensure your weekly peace.\nThe constant care you deserve.", tag: isPT ? "MANUTENÇÃO" : "MAINTENANCE", icon: "package" },
      { id: 'pack_mista', type: 'pack', title: isPT ? "Jornada Fusion" : "Fusion Journey", price: p.packTri.v, fullPrice: p.packTri.full, savings: p.packTri.save, desc: isPT ? "3 Sessões Fusion" : "3 Fusion Sessions", details: isPT ? "Três encontros intensos.\nPara quem precisa escapar da rotina." : "Three intense encounters.\nFor those who need to escape routine.", tag: isPT ? "ESCAPE" : "ESCAPE", icon: "layers" },
      { id: 'pack_mix_4', type: 'pack', title: isPT ? "Ciclo Completo" : "Full Cycle", price: p.packMix.v, fullPrice: p.packMix.full, savings: p.packMix.save, desc: isPT ? "2 Sensoriais + 2 Fusion" : "2 Sensory + 2 Fusion", details: isPT ? "Explore todas as sensações.\nVariedade para cada momento seu." : "Explore all sensations.\nVariety for your every moment.", tag: "PREMIUM", icon: "star" }
    ] as ServiceItem[],
    faq: [
      { q: isPT ? "Onde é o atendimento?" : "Where is the service?", a: isPT ? "Atendo exclusivamente a domicílio (sua residência, hotel ou motel). Não possuo local próprio e não levo maca: a sessão é realizada na sua cama ou sofá, garantindo seu conforto e privacidade total." : "I attend exclusively at your home, hotel or motel. I do not have my own place and I do not bring a massage table: the session is held on your bed or sofa, ensuring your comfort and total privacy." },
      { q: isPT ? "É seguro e discreto?" : "Is it safe and discreet?", a: isPT ? "Absolutamente. Atendo homens casados, solteiros e pessoas públicas com total sigilo. Ninguém precisa saber do seu momento." : "Absolutely. I attend married men, singles and public figures with total secrecy. No one needs to know about your moment." },
      { q: isPT ? "Como devo me preparar?" : "How should I prepare?", a: isPT ? "Apenas tome um banho e venha de coração aberto. Se preferir, separe um lençol, mas levo óleos de qualidade que não mancham." : "Just take a shower and come with an open heart. If you prefer, separate a sheet, but I bring quality oils that don't stain." },
      { q: isPT ? "Tenho vergonha do meu corpo..." : "I'm ashamed of my body...", a: isPT ? "Não tenha. Aqui não há julgamentos, apenas acolhimento. Todos os corpos merecem toque e carinho." : "Don't be. There are no judgments here, only acceptance. All bodies deserve touch and care." }
    ],
    rules: isPT ? [
      { icon: "shower", title: "Higiene & Conforto", description: "Um banho antes prepara seu corpo e alma para o relaxamento que você merece." },
      { icon: "hand", title: "Respeito Mútuo", description: "Este é um espaço seguro. O respeito é a base da nossa conexão." },
      { icon: "shield", title: "Sigilo Absoluto", description: "O que acontece na sessão, fica na sessão. Sua privacidade é sagrada aqui." },
      { icon: "user-check", title: "Sem Julgamentos", description: "Aqui você pode ser você mesmo. Livre de rótulos ou pressões." },
      { icon: "clock", title: "Seu Tempo", description: "Avisos de cancelamento com 2h de antecedência ajudam a manter a harmonia da agenda." }
    ] : [
      { icon: "shower", title: "Hygiene & Comfort", description: "A shower beforehand prepares your body and soul for the relaxation you deserve." },
      { icon: "hand", title: "Mutual Respect", description: "This is a safe space. Respect is the foundation of our connection." },
      { icon: "shield", title: "Absolute Privacy", description: "What happens in the session, stays in the session. Your privacy is sacred here." },
      { icon: "user-check", title: "No Judgments", description: "Here you can be yourself. Free from labels or pressures." },
      { icon: "clock", title: "Your Time", description: "Cancellation notices 2h in advance help keep the schedule in harmony." }
    ],
    reviews: generateReviews(isPT),
    currency,
    text: {
      welcome: isPT ? "Olá," : "Hello,",
      choose_sub: isPT ? "Selecione sua experiência para começar." : "Select your experience to start.",
      tab_packs: isPT ? "Pacotes" : "Packages",
      tab_single: isPT ? "Sessão Única" : "Single Session",
      loading: isPT ? "Preparando..." : "Preparing...",
      details_label: isPT ? "O que esperar" : "What to expect",
      select_time_title: isPT ? "Seu Momento" : "Your Moment",
      location_title: isPT ? "Onde nos encontramos?" : "Where do we meet?",
      extras_title: isPT ? "Algo a mais para você?" : "Something more for you?",
      coupon_section: isPT ? "Seus Presentes" : "Your Gifts",
      no_coupons: isPT ? "Sem presentes no momento" : "No gifts at the moment",
      payment_title: isPT ? "Pagamento & Finalização" : "Payment & Finish",
      terms_title: isPT ? "Regras de Convivência" : "Coexistence Rules",
      whatsapp_btn: isPT ? "Confirmar no WhatsApp" : "Confirm on WhatsApp",
      timer_text: isPT ? "Segurando seu horário" : "Holding your slot",
      motel_note: isPT ? "Em motéis, garantimos sua privacidade total. A suíte fica por sua conta." : "In motels, we ensure your total privacy. The suite fee is on you.",
      input_name: isPT ? "Como quer ser chamado?" : "How do you want to be called?",
      input_addr: isPT ? "Endereço (Rua)" : "Address (Street)",
      agree_terms: isPT ? "Li e concordo com o sigilo" : "I agree with privacy terms",
      faq_title: isPT ? "Dúvidas Comuns" : "Common Questions",
      reviews_title: isPT ? "Quem já experimentou" : "Who has tried it",
      empty_date: isPT ? "Selecione um dia" : "Select a day",
      total_label: isPT ? "Total" : "Total",
      subtotal: isPT ? "Resumo" : "Summary",
      discount: isPT ? "Desconto" : "Discount",
      pix_discount: isPT ? "Desconto Pix (3%)" : "Pix Discount (3%)",
      welcome_popup_title: isPT ? "Seja Bem-vindo!" : "Welcome!",
      welcome_popup_msg: isPT ? "Fico feliz que você esteja aqui. Para começar com o pé direito, um presente." : "I'm happy you're here. To start right, a gift.",
      get_coupon: isPT ? "Aceitar Presente" : "Accept Gift",
      media_title: isPT ? "Autorização de Imagem" : "Image Rights",
      media_desc: isPT ? "Autorizo uso de fotos/vídeos (sem rosto/partes íntimas)." : "I authorize photos/videos (no face/intimate parts).",
      media_bonus: isPT ? "Ganhe 1% de desconto!" : "Get 1% OFF!",
      uber_notice: isPT ? "Taxa de Deslocamento (Uber): Calculada e cobrada à parte." : "Transport Fee (Uber): Calculated separately."
    }
  };
};

// ==================================================================================
// MAIN APP
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error"}[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;
  
  // Referências para Scroll Automático
  const calendarRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  
  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 69, lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home',
    address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false
  });

  // Carregar dados
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) setUser(parsed.user);
      }
    } catch (e) { console.error(e); }
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Salvar dados
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user, lastSave: new Date().toISOString() }));
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && !user.hasSeenWelcome) setTimeout(() => setWelcomePopup(true), 2000);
  }, [loading, user.hasSeenWelcome]);

  const addToast = (msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSelectItem = (type: 'single' | 'pack', item: ServiceItem) => {
    setBooking(prev => ({ ...prev, type, item, extras: {}, payment: '', termsAccepted: false }));
    addToast(item.title, "success");
    scrollToSection(calendarRef);
  };

  const handleTimeSelect = (t: string) => {
    setBooking(b => ({ ...b, time: t }));
    scrollToSection(locationRef);
  };

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0 };
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
      if (booking.extras[k]) {
        const extData = DATA.extras.find(e => e.id === k);
        if (extData) {
          sub += booking.type !== 'single' ? Math.floor(extData.price * 0.8) : extData.price;
        }
      }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let runningTotal = Math.max(0, sub - disc);
    let mediaDisc = 0;
    if (booking.mediaAllowed) { mediaDisc = Math.ceil(runningTotal * 0.01); runningTotal -= mediaDisc; }
    let pixDisc = 0;
    if (booking.payment === 'pix') { pixDisc = Math.ceil(runningTotal * 0.03); }
    return { sub, disc, pixDisc, mediaDisc, total: Math.max(0, runningTotal - pixDisc) };
  }, [booking.item, booking.extras, booking.appliedCoupon, booking.payment, booking.mediaAllowed]);

  const estimatedXP = useMemo(() => Math.floor(financials.total * (booking.type === 'pack' ? 0.30 : 0.15)), [financials.total, booking.type]);
  const getCurrentLevelProgress = () => {
    const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
    const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
    const currentLevel = DATA.levels[realIndex];
    const nextLevel = DATA.levels[realIndex + 1];
    if (!nextLevel) return 100;
    return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };

  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString() : '';
    let locTxt = "";
    if (booking.locationType === 'home') locTxt = `🏠 *Residência*\n${booking.address.street}, ${booking.address.number} - ${booking.address.district}`;
    else if (booking.locationType === 'motel') locTxt = `🏩 *Motel* (Local por sua conta)`;
    else locTxt = `🏨 *Hotel*: ${booking.address.placeName} - Quarto ${booking.address.comp}`;
    
    const extrasList = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => `+ ${DATA.extras.find(e => e.id === k)?.label}`).join('\n');
    
    const msg = `*NOVA RESERVA*
👤 *Cliente:* ${user.name}
📅 *Data:* ${dateStr} às ${booking.time}

💆‍♂️ *Sessão:* ${booking.item?.title}
${extrasList ? `\nADICIONAIS:\n${extrasList}` : ''}

📍 *Local:*
${locTxt}

💰 *Financeiro:*
Total: ${DATA.currency} ${f.total},00
Pagamento: ${booking.payment.toUpperCase()}

🚗 *Uber:* Aguardando cálculo...`;
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const daysArray = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);

  const generateTimeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) slots.push(`${i < 10 ? '0' : ''}${i}:00`);
    return slots;
  }, [booking.date]);

  const finishBooking = () => {
    if (!booking.termsAccepted) return addToast("Aceite os termos para continuar", "error");
    if (!booking.payment) return addToast("Selecione o pagamento", "error");
    
    // Atualiza User com XP e Cupons usados
    let updatedCoupons = [...user.coupons];
    let updatedHistory = [...user.usedCoupons];
    if (booking.appliedCoupon) {
      if (!updatedHistory.includes(booking.appliedCoupon.code)) updatedHistory.push(booking.appliedCoupon.code);
      updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon?.code);
    }
    setUser(prev => ({
      ...prev,
      xp: prev.xp + estimatedXP,
      coupons: updatedCoupons,
      usedCoupons: updatedHistory,
      ordersCount: prev.ordersCount + 1
    }));

    window.open(generateWhatsAppLink(), '_blank');
  };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-zinc-950 text-white z-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full mb-4"></div>
        <p className="tracking-widest text-xs uppercase">{T.loading}</p>
      </div>
    </div>
  );

  return (
    <>
      <GlobalStyles isDark={isDark} />
      
      {/* BACKGROUND */}
      <div className={`fixed inset-0 z-[-1] pointer-events-none ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
        <div className={`absolute top-0 left-0 w-96 h-96 blur-3xl rounded-full opacity-20 ${isDark ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 blur-3xl rounded-full opacity-20 ${isDark ? 'bg-indigo-600' : 'bg-indigo-400'}`} />
      </div>

      {/* TOASTS */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-md px-4 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg animate-in slide-in-from-top ${t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={20} />
            <span className="text-sm font-medium">{t.msg}</span>
          </div>
        ))}
      </div>

      <div className={`min-h-screen relative z-10 pb-40 px-6 md:px-12 max-w-5xl mx-auto ${isDark ? 'text-white' : 'text-black'}`}>
        
        {/* HEADER */}
        <header className="pt-12 pb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold font-playfair">Thalyson Massagens</h1>
            <div className="flex items-center gap-2 text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {user.ordersCount} Sessões
            </div>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-xl border border-zinc-700 bg-zinc-800/50"><Icon name={isDark ? 'sun' : 'moon'} size={20} /></button>
        </header>

        {/* HERO + XP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-in fade-in duration-700">
           <div>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">{T.welcome} <span className="text-blue-500">{user.name || "Visitante"}</span></h2>
              <p className="text-lg opacity-70 mb-6">{T.choose_sub}</p>
              <div className="flex p-1 rounded-2xl border max-w-sm border-zinc-800 bg-zinc-900/50">
                <button onClick={() => setActiveTab('single')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'single' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>{T.tab_single}</button>
                <button onClick={() => setActiveTab('packs')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeTab === 'packs' ? 'bg-blue-600 text-white' : 'text-zinc-500'}`}>{T.tab_packs}</button>
              </div>
           </div>
           
           {/* XP CARD */}
           <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <span className="text-xs font-bold uppercase tracking-wider opacity-50">Nível Atual</span>
                    <h3 className="text-2xl font-bold font-playfair text-blue-400">
                       {DATA.levels.slice().reverse().find(l => user.xp >= l.xpNeeded)?.title}
                    </h3>
                 </div>
                 <div className="text-right">
                    <span className="text-3xl font-bold">{user.xp}</span>
                    <span className="text-xs block text-blue-500 font-bold">XP</span>
                 </div>
              </div>
              <div className="h-2 rounded-full bg-zinc-800 overflow-hidden mb-2">
                 <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000" style={{ width: `${getCurrentLevelProgress()}%` }} />
              </div>
              <p className="text-xs text-center opacity-50">Continue evoluindo para ganhar mais recompensas.</p>
           </div>
        </div>

        {/* SERVIÇOS (Always Visible) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => (
            <Card key={s.id} active={booking.item?.id === s.id} onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : 'pack', s)} isDark={isDark}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-zinc-800 text-blue-400"><Icon name={s.icon} size={24} /></div>
                <div className="text-right">
                   {s.fullPrice && <span className="text-xs line-through opacity-50 block">{DATA.currency} {s.fullPrice}</span>}
                   <span className="text-2xl font-bold text-blue-500">{DATA.currency} {s.price}</span>
                </div>
              </div>
              <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-3 py-1 rounded-full uppercase w-fit mb-3 block">{s.tag}</span>
              <h3 className="text-xl font-bold mb-2 font-playfair">{s.title}</h3>
              <p className="text-sm opacity-70 mb-4 font-inter">{s.desc}</p>
              <div className="pt-4 border-t border-zinc-800 text-xs opacity-60 space-y-1">
                {s.details.split('\n').map((line, i) => <p key={i}>• {line}</p>)}
              </div>
            </Card>
          ))}
        </div>

        {/* DATA E HORA (Visible if Item Selected) */}
        {booking.item && (
          <div ref={calendarRef} className="space-y-8 mb-16 fade-slide-up scroll-mt-24">
             <div className="text-center">
               <h2 className="text-3xl font-playfair font-bold mb-2">{T.select_time_title}</h2>
               <p className="text-sm opacity-60">Escolha o melhor momento para seu relaxamento.</p>
             </div>
             
             <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
              {daysArray.map((d, idx) => {
                const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                return (
                  <button key={idx} onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))}
                    className={`min-w-[5rem] h-24 rounded-2xl flex flex-col items-center justify-center border-2 snap-center transition-all ${isSel ? 'bg-blue-600 border-blue-500 text-white' : 'border-zinc-800 hover:border-zinc-600'}`}>
                    <span className="text-xs uppercase opacity-60">{d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' })}</span>
                    <span className="text-2xl font-bold">{d.getDate()}</span>
                  </button>
                );
              })}
             </div>
             
             {booking.date ? (
               <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                 {generateTimeSlots.map(t => (
                   <button key={t} onClick={() => handleTimeSelect(t)} className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${booking.time === t ? 'bg-white text-black' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'}`}>
                     {t}
                   </button>
                 ))}
               </div>
             ) : (
                <div className="p-8 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500">
                   {T.empty_date}
                </div>
             )}
          </div>
        )}

        {/* LOCAL E DETALHES (Visible if Date & Time Selected) */}
        {booking.date && booking.time && (
           <div ref={locationRef} className="space-y-8 mb-16 fade-slide-up scroll-mt-24">
              <h2 className="text-3xl font-playfair font-bold text-center">{T.location_title}</h2>
              
              <SmartTimer isDark={isDark} text={T.timer_text} />
              
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                 {[{ id: 'home', label: 'Casa', icon: 'home' }, { id: 'motel', label: 'Motel', icon: 'bed' }, { id: 'hotel', label: 'Hotel', icon: 'building' }].map(x => (
                   <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))}
                     className={`py-6 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${booking.locationType === x.id ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'border-zinc-800 text-zinc-500'}`}>
                     <Icon name={x.icon} size={28} />
                     <span className="text-xs font-bold uppercase">{x.label}</span>
                   </button>
                 ))}
              </div>
              
              <div className="max-w-2xl mx-auto space-y-4">
                 <InputField label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" isDark={isDark} />
                 
                 {booking.locationType === 'home' && (
                    <div className="grid gap-4">
                      <InputField label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: e.target.value } }))} icon="map-pin" isDark={isDark} />
                      <div className="grid grid-cols-2 gap-4">
                         <InputField placeholder="Número" value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: e.target.value } }))} isDark={isDark} />
                         <InputField placeholder="Bairro" value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: e.target.value } }))} isDark={isDark} />
                      </div>
                    </div>
                 )}
                 {booking.locationType === 'hotel' && (
                    <div className="grid gap-4">
                      <InputField label="Nome do Hotel" value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: e.target.value } }))} icon="building" isDark={isDark} />
                      <InputField label="Número do Quarto" value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: e.target.value } }))} isDark={isDark} />
                    </div>
                 )}
                 {booking.locationType === 'motel' && (
                    <div className="p-4 rounded-xl bg-zinc-800/50 text-center text-sm text-zinc-400 border border-zinc-700">
                       {T.motel_note}
                    </div>
                 )}
              </div>

              {/* EXTRAS */}
              <div className="pt-8 border-t border-zinc-800 max-w-2xl mx-auto">
                 <h3 className="text-sm font-bold uppercase mb-4 opacity-60 text-center">{T.extras_title}</h3>
                 <div className="space-y-3">
                   {DATA.extras.map(ex => (
                     <div key={ex.id} onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))}
                       className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all ${booking.extras[ex.id] ? 'bg-blue-600/10 border-blue-500' : 'border-zinc-800 hover:border-zinc-700'}`}>
                       <div className="flex gap-3 items-center">
                         <Icon name={ex.icon} isEmoji={ex.isEmoji} size={22} />
                         <div>
                            <span className="text-sm font-semibold block">{ex.label}</span>
                            <span className="text-xs opacity-50 block">{ex.desc}</span>
                         </div>
                       </div>
                       <span className="text-xs font-bold text-blue-500">+ {DATA.currency} {booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price}</span>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
        )}

        {/* PAGAMENTO E RESUMO (Visible if Address Valid or Motel) */}
        {booking.date && booking.time && user.name && (booking.locationType === 'motel' || validateAddress(booking.address) || (booking.locationType === 'hotel' && booking.address.placeName)) && (
           <div ref={paymentRef} className="space-y-8 mb-24 fade-slide-up scroll-mt-24">
              <h2 className="text-3xl font-playfair font-bold text-center">{T.payment_title}</h2>
              
              <div className="max-w-2xl mx-auto space-y-6">
                 {/* CUPONS */}
                 <div className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                    <h4 className="text-sm font-bold uppercase mb-4">{T.coupon_section}</h4>
                    {user.coupons.length > 0 ? (
                       <div className="flex flex-wrap gap-2">
                          {user.coupons.map(c => (
                             <button key={c.id} onClick={() => setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))}
                               className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'border-zinc-700 text-zinc-400'}`}>
                               {c.title}
                             </button>
                          ))}
                       </div>
                    ) : <p className="text-sm opacity-50">{T.no_coupons}</p>}
                 </div>

                 {/* PAGAMENTO */}
                 <div className="space-y-3">
                   {[{ id: 'pix', label: 'Pix (3% OFF)', icon: 'smartphone' }, { id: 'card', label: 'Cartão', icon: 'credit-card' }, { id: 'money', label: 'Dinheiro', icon: 'banknote' }].map(p => (
                     <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))}
                       className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${booking.payment === p.id ? 'bg-blue-600/10 border-blue-500 text-blue-500' : 'border-zinc-800 text-zinc-500'}`}>
                       <Icon name={p.icon} size={24} />
                       <span className="text-sm font-bold uppercase flex-1 text-left">{p.label}</span>
                       {booking.payment === p.id && <Icon name="check" size={20} />}
                     </button>
                   ))}
                 </div>
                 
                 {/* MEDIA & TERMS */}
                 <div onClick={() => setBooking(b => ({ ...b, mediaAllowed: !b.mediaAllowed }))} className={`p-4 rounded-xl border cursor-pointer flex justify-between items-center transition-all ${booking.mediaAllowed ? 'bg-purple-900/20 border-purple-500' : 'border-zinc-800'}`}>
                    <div>
                       <h4 className="font-bold text-sm text-purple-400">{T.media_title}</h4>
                       <p className="text-xs opacity-60">{T.media_desc}</p>
                    </div>
                    <div className={`w-6 h-6 rounded border flex items-center justify-center ${booking.mediaAllowed ? 'bg-purple-500 border-purple-500' : 'border-zinc-600'}`}>
                       {booking.mediaAllowed && <Icon name="check" size={14} />}
                    </div>
                 </div>

                 <Button full onClick={() => setTermsOpen(true)} variant={booking.termsAccepted ? "primary" : "secondary"} icon="shield">
                    {booking.termsAccepted ? "Termos Aceitos" : "Ler e Aceitar Termos de Sigilo"}
                 </Button>

                 {/* RESUMO DE VALORES */}
                 <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 space-y-2">
                    <div className="flex justify-between text-sm"><span>Subtotal</span><span>{DATA.currency} {financials.sub}</span></div>
                    {financials.disc > 0 && <div className="flex justify-between text-sm text-emerald-500"><span>Cupom</span><span>- {DATA.currency} {financials.disc}</span></div>}
                    {financials.mediaDisc > 0 && <div className="flex justify-between text-sm text-purple-500"><span>Mídia (1%)</span><span>- {DATA.currency} {financials.mediaDisc}</span></div>}
                    {financials.pixDisc > 0 && <div className="flex justify-between text-sm text-blue-500"><span>Pix (3%)</span><span>- {DATA.currency} {financials.pixDisc}</span></div>}
                    <div className="pt-4 mt-2 border-t border-zinc-800 flex justify-between items-center">
                       <span className="font-bold text-lg">{T.total_label}</span>
                       <div className="text-right">
                          <span className="text-3xl font-bold font-playfair text-blue-500">{DATA.currency} {financials.total}</span>
                          <span className="block text-xs text-zinc-500">+ {estimatedXP} XP</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* FEEDBACK & FAQ */}
        <div className="border-t border-zinc-800 pt-16 pb-32">
           <h3 className="text-2xl font-bold font-playfair mb-6 px-4">{T.reviews_title}</h3>
           <div className="flex overflow-x-auto gap-4 pb-8 px-4 snap-x scrollbar-hide">
              {DATA.reviews.map((r, i) => (
                 <div key={i} className="min-w-[280px] snap-center"><ReviewCard review={r} isDark={isDark} /></div>
              ))}
           </div>
           
           <div className="max-w-2xl mx-auto mt-12 px-4">
              <h3 className="text-xl font-bold font-playfair mb-4">{T.faq_title}</h3>
              {DATA.faq.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} isDark={isDark} />)}
           </div>
        </div>

      </div>

      {/* FOOTER FIXO (AÇÃO) */}
      {booking.item && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 pointer-events-none">
           <div className={`max-w-xl mx-auto rounded-3xl p-4 shadow-2xl border backdrop-blur-xl pointer-events-auto flex justify-between items-center transition-all ${isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'}`}>
              <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{T.subtotal}</p>
                 <p className="text-xl font-bold font-playfair text-blue-500">{DATA.currency} {financials.total}</p>
              </div>
              <Button onClick={finishBooking} className="rounded-full !px-6" variant="whatsapp" disabled={!booking.termsAccepted || !booking.payment}>
                 {T.finish_btn} <Icon name="message" size={18} className="ml-2" />
              </Button>
           </div>
        </div>
      )}

      {/* MODAL TERMOS */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
           <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-bold font-playfair">{T.terms_title}</h3>
                 <button onClick={() => setTermsOpen(false)}><Icon name="x" size={24} /></button>
              </div>
              <div className="space-y-4 mb-8">
                 {DATA.rules.map((r, i) => <RuleItem key={i} rule={r} isDark={isDark} />)}
              </div>
              <Button full onClick={() => { setBooking(b => ({...b, termsAccepted: true})); setTermsOpen(false); }}>{T.agree_terms}</Button>
           </div>
        </div>
      )}

      {/* POPUP BEM-VINDO */}
      {welcomePopup && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in">
           <div className="bg-zinc-900 p-10 rounded-[2.5rem] max-w-sm text-center border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                 <Icon name="gift" size={40} />
              </div>
              <h3 className="text-2xl font-playfair font-bold mb-2 text-white">{T.welcome_popup_title}</h3>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">{T.welcome_popup_msg}</p>
              <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl mb-8">
                 <p className="text-xs font-bold uppercase text-zinc-500 mb-1">CUPOM</p>
                 <p className="text-2xl font-mono text-blue-400 font-bold tracking-widest">BEMVINDO10</p>
              </div>
              <Button full onClick={() => { 
                 setWelcomePopup(false); 
                 setUser(u => ({...u, hasSeenWelcome: true, coupons: [...u.coupons, { id: 'welcome', val: 10, title: '🎁 BEMVINDO10', code: 'BEMVINDO10' }]})); 
                 addToast("Cupom adicionado!", "success");
              }}>
                 {T.get_coupon}
              </Button>
           </div>
         </div>
      )}
    </>
  );
}
