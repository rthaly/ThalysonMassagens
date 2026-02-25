import * as React from 'react';
import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES ESTÁTICAS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v20_optimized',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_SECURE_V5',
  START_HOUR: 9,
  END_HOUR: 20,
  MAX_STORAGE_SIZE: 5000 
} as const;

const ICON_PATHS: Record<string, string> = {
  'menu': 'M4 6h16M4 12h16M4 18h16',
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
  'video': 'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 01-3-3v-6l6 6v3z M18 20a3 3 0 003-3v-6l-6 6v3z',
  'copy': 'M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3'
};

// ==================================================================================
// 2. DESIGN SYSTEM & ESTILOS GLOBAIS (UX/UI Limpo)
// ==================================================================================

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    :root {
      --font-primary: 'Plus Jakarta Sans', sans-serif;
      --font-display: 'Playfair Display', serif;
    }
    html, body {
      background-color: ${isDark ? '#09090b' : '#fafafa'};
      color: ${isDark ? '#f4f4f5' : '#18181b'};
      transition: background-color 0.3s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      font-family: var(--font-primary);
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .emoji-icon { font-style: normal; display: inline-block; line-height: 1; vertical-align: middle; text-align: center; }
  `}} />
));

const Icon = memo(({ name, size = 22, className = "", isEmoji = false }: { name: string, size?: number, className?: string, isEmoji?: boolean }) => {
  if (isEmoji) return <span className={`emoji-icon ${className}`} style={{ fontSize: size }} role="img" aria-label={name}>{name}</span>;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={ICON_PATHS[name] || ''} />
    </svg>
  );
});

// Formatador Limpo e Profissional
const formatMoney = (val: number, isPT: boolean = true) => {
  return isPT ? `R$ ${val.toFixed(2).replace('.', ',')}` : `$${val.toFixed(2)}`;
};

interface ServiceItem { id: string; min: number; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; popular?: boolean; }
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; loc: string; t: string; s: number; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { street: string; number: string; district: string; city: string; comp: string; placeName: string; }
interface BookingData { type: 'single' | 'pack'; item: ServiceItem | null; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; mediaAllowed: boolean; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// 3. COMPONENTES DE UI MINIMALISTAS
// ==================================================================================

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.98] gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-900/10",
    secondary: "bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-md shadow-green-900/10",
    outline: "bg-transparent border border-zinc-600 text-zinc-300 hover:border-zinc-400",
    ghost: "bg-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
  };
  const sizes = { sm: "h-10 text-sm px-4", md: "h-12 text-sm px-6", lg: "h-14 text-base px-8", xl: "h-16 text-base px-10" };
  
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} aria-label={ariaLabel} className={`${baseStyle} ${variants[variant as keyof typeof variants] || variants.primary} ${sizes[size as keyof typeof sizes]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span> : <>{icon && <Icon name={icon} size={20} />}{children}</>}
    </button>
  );
});

const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, toggleLang, lang, user }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} role="presentation" />
      <aside className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-[70] p-8 shadow-2xl animate-slide-in ${isDark ? 'bg-zinc-950 text-white border-l border-zinc-800' : 'bg-white text-slate-900 border-l border-slate-100'}`}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-playfair">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors" aria-label="Fechar menu"><Icon name="x" size={24} /></button>
        </div>
        
        <div className="mb-10 p-5 rounded-2xl bg-zinc-900 text-white">
          <p className="text-xs opacity-70 uppercase tracking-widest mb-1">Seu Nível Atual</p>
          <div className="flex justify-between items-end">
             <span className="text-3xl font-light font-playfair">{user.xp} <span className="text-sm font-sans font-bold text-blue-400">XP</span></span>
             <Icon name="award" className="text-blue-400" />
          </div>
        </div>

        <nav className="space-y-4">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name={isDark ? "moon" : "sun"} className={isDark ? "text-zinc-400" : "text-slate-400"} />
              <span className="font-medium">Interface</span>
            </div>
            <span className="text-xs opacity-50 uppercase tracking-wider">{isDark ? 'Escuro' : 'Claro'}</span>
          </button>
          
          <button onClick={toggleLang} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name="globe" className={isDark ? "text-zinc-400" : "text-slate-400"} />
              <span className="font-medium">Idioma</span>
            </div>
            <span className="text-xs opacity-50 uppercase tracking-wider">{lang}</span>
          </button>
        </nav>
      </aside>
    </>
  );
});

const Card = memo(({ children, className = '', onClick, active = false, isDark = true, popular = false }: any) => (
  <div onClick={onClick} className={`relative p-8 rounded-3xl transition-all duration-300 flex flex-col h-full ${onClick ? 'cursor-pointer active:scale-[0.99] hover:-translate-y-1' : ''} ${active ? 'bg-blue-500/5 border border-blue-500/50 shadow-sm' : isDark ? 'bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700' : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'} ${className}`}>
    {popular && (
      <div className="absolute -top-3 left-8 bg-zinc-800 text-zinc-100 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm border border-zinc-700">
        ✦ Mais Escolhida
      </div>
    )}
    {children}
  </div>
));

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text", isDark = true, hasError = false }: any) => (
  <div className="space-y-2 w-full">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{label}</label>}
    <div className="relative">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${hasError ? 'text-red-500' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name={icon} size={18} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-12 rounded-xl outline-none text-sm transition-all bg-transparent ${icon ? 'pl-11 pr-4' : 'px-4'} ${hasError ? 'border border-red-500/50 bg-red-500/5 text-red-500 placeholder:text-red-400' : isDark ? 'border border-zinc-800 focus:border-zinc-500 text-zinc-100 placeholder:text-zinc-700' : 'border border-slate-300 focus:border-slate-400 text-slate-900 placeholder:text-slate-400'}`} />
    </div>
  </div>
));

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`w-full h-full p-6 rounded-3xl transition-all duration-300 border ${isDark ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-slate-100 shadow-sm'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
          {review.n.charAt(0)}
        </div>
        <div>
          <span className={`text-sm font-medium block ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{review.n}</span>
          <span className={`text-xs ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-0.5 mt-1" aria-label={`Avaliação: ${review.s} estrelas`}>{[...Array(5)].map((_, i) => <Icon key={i} name="star" size={12} className={i < review.s ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-zinc-800' : 'text-slate-200'} />)}</div>
    </div>
    <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>"{review.t}"</p>
  </article>
));

const SmartTimer = memo(({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  useEffect(() => { 
    const interval = setInterval(() => { setTime(prev => prev <= 0 ? 600 : prev - 1); }, 1000); 
    return () => clearInterval(interval); 
  }, []);
  const format = (t: number) => { const m = Math.floor(t / 60); const s = t % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  return (
    <div className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${isDark ? 'bg-zinc-900/50 text-zinc-400' : 'bg-slate-50 text-slate-500'}`}>
      <Icon name="watch" size={16} />
      <span className="text-xs font-medium uppercase tracking-widest">{text}: <span className="font-mono">{format(time)}</span></span>
    </div>
  );
});

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800/50' : 'border-slate-100'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left group" aria-expanded={isOpen}>
        <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{q}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name="chevron-down" size={18} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
        <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{a}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 rounded-2xl border border-transparent ${isDark ? 'hover:bg-zinc-900/30' : 'hover:bg-slate-50'}`}>
    <div className={`flex-shrink-0 mt-1 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name={rule.icon} size={20} /></div>
    <div>
      <h4 className={`text-sm font-medium mb-1 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{rule.title}</h4>
      <p className={`text-xs font-light leading-relaxed ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{rule.description}</p>
    </div>
  </div>
));

// ==================================================================================
// 4. LÓGICA DE DADOS E FUNÇÕES PURAS (Intacta, usando avaliações do código 1)
// ==================================================================================
const sanitizeInput = (value: string): string => value.replace(/[<>&"']/g, '');
const validateAddress = (address: Address): boolean => !!(address.street && address.number && address.district && address.city);

const cleanupStorage = () => { 
  try { 
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key && key.startsWith('@thaly_app')) {
             try {
                 const item = localStorage.getItem(key);
                 if (item) {
                     const parsed = JSON.parse(item);
                     if (parsed.expires && new Date(parsed.expires) < new Date()) {
                         localStorage.removeItem(key);
                     }
                 }
             } catch (e) {
                 localStorage.removeItem(key);
             }
        }
    });
  } catch (e) { console.error('Storage cleanup error:', e); } 
};

// Exatas avaliações solicitadas baseadas no código 1 do usuário
const generateReviews = (isPT: boolean): Review[] => {
  const realReviews = [
    { n: "Gustavo", loc: "Bela Vista - SP", t: isPT ? "O Thalyson chegou na hora certa, quando eu precisava relaxar após as tensões de início de ano e pós-Carnaval. Foi a primeira vez que contratei um massagista pra atender em minha casa e a experiência foi incrível. Ele consegue deixar a gente relaxado, tem mãos incríveis e os efeitos são imediatos, pois eu levantei e parecia que pesava 10kg a menos. Recomendo e já quero de novo." : "Thalyson arrived at the exact right time, when I needed to relax after the tension of early year and post-Carnival. It was the first time I hired a massage therapist at my home and the experience was incredible. He leaves us relaxed, has amazing hands and the effects are immediate, because I stood up and felt 10kg lighter. Highly recommend and want it again." },
    { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: isPT ? "Você tem mãos abençoadas e eu voeeei! Precisava muito desse descanso, dessa paz. Foi super respeitoso a todo tempo e me relaxou demais. Obrigada! ❤️" : "You have blessed hands and I soared! I really needed this rest, this peace. It was super respectful all the time and relaxed me a lot. Thank you! ❤️" },
    { n: "Osvaldo", loc: "Santa Fé do Sul", t: isPT ? "HOJE, 10/02/26 não poderia ter teminado MELHOR o dia, sendo atendido por Thalyson em casa numa sessão de massagem por suas MÃOS MÁGICAS !!! Que delícia!\nOs 4 pilares essenciais do seu trabalho são bases para transformar o atendimento em uma SENSAÇÃO UNICA que gera valores pro corpo, combinando o aspecto de super EMPATIA com o cliente, sem esquecer da EFICIENCIA e agilidade, clareza durante a sessão, tornando ha, uma visão da PERFEIÇÃO de executar este trabalho de massagem com maestria! Thalyson foca sempre no propósito de servir bem o cliente, desde o início ao fim q é surpreendente! VALE A PENA. 👏👏👏" : "TODAY, 02/10/26, the day couldn’t have ended BETTER, being attended by Thalyson at home in a massage session with his MAGIC HANDS !!! What a delight!\nThe 4 essential pillars of his work are the foundation to turn the service into a UNIQUE SENSATION that brings value to the body, combining a super EMPATHY with the client, without forgetting about EFFICIENCY and agility, clarity throughout the session, giving a view of the PERFECTION of performing this massage work with mastery! Thalyson always focuses on the purpose of serving the client well, from start to finish, which is amazing! WORTH IT. 👏👏👏" },
    { n: "Bruno", loc: "SP - Bela Vista", t: isPT ? "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito." : "Thalyson, I want to say that your massage was very well executed. Highly recommend." },
    { n: "Alan", loc: "SP - Bela Vista", t: isPT ? "Gostei bastante, saí mais leve. Da pra ver que ele manda bem no que faz." : "Liked it a lot, left feeling lighter. You can tell he knows what he's doing." },
    { n: "Tiago", loc: "SP - Bela Vista", t: isPT ? "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida." : "Thalyson has surreal energy. The massage was perfect, best of my life." }
  ];

  const seriousReviews = [
    { n: "Roberto", loc: isPT ? "São Paulo - Jardins" : "SP - Jardins", t: isPT ? "A sensação de vazio e paz que senti após a sessão foi indescritível. A finalização foi extremamente potente, liberando uma carga de tensão que eu carregava há meses. Profissionalismo impecável." : "The feeling of emptiness and peace I felt after the session was indescribable. The finish was extremely powerful, releasing a load of tension I had been carrying for months. Impeccable professionalism." },
    { n: "Carla", loc: "Rio Preto", t: isPT ? "Me senti acolhida em um nível que não esperava. Ele tem uma pegada firme que relaxa a musculatura e ao mesmo tempo desperta sensações adormecidas. O alívio no final foi total." : "I felt welcomed on a level I didn't expect. He has a firm grip that relaxes muscles while awakening dormant sensations. The relief at the end was total." },
    { n: "Lucas", loc: "Londrina", t: isPT ? "Sendo casado, a discrição era minha prioridade e fui atendido com total sigilo. A massagem tântrica me permitiu redescobrir meu próprio corpo. A descarga de energia no final foi intensa." : "Being married, discretion was my priority and I was served with total secrecy. Tantric massage allowed me to rediscover my own body. The energy discharge at the end was intense." },
    { n: "Felipe", loc: "Votuporanga", t: isPT ? "Uma experiência de conexão rara. Fiquei trêmulo após a sessão, de uma forma boa. Foi um momento de esvaziar a mente completamente. Recomendo para quem busca algo além do físico." : "A rare connection experience. I was trembling after the session, in a good way. It was a moment to empty the mind completely. Recommend for those seeking something beyond the physical." },
    { n: "Mariana", loc: "Jales", t: isPT ? "Toque respeitoso, mas com a intensidade certa. Consegui me desligar dos problemas do trabalho e focar apenas no meu prazer e bem-estar. Foi libertador." : "Respectful touch, but with the right intensity. I managed to disconnect from work problems and focus only on my pleasure and well-being. It was liberating." },
    { n: "Gustavo", loc: "Hotel Ibis - SP", t: isPT ? "A combinação da massagem relaxante com a sensitiva criou uma jornada perfeita. O ápice da sessão foi vigoroso e restaurador. Sensação de leveza absurda ao final." : "The combination of relaxing and sensory massage created a perfect journey. The peak of the session was vigorous and restorative. Absurd feeling of lightness at the end." },
    { n: "Ricardo", loc: "Fernandópolis", t: isPT ? "Encontrei um profissionalismo raro. Me senti à vontade para soltar minhas travas. Saí de lá me sentindo 10kg mais leve, física e emocionalmente." : "I found rare professionalism. I felt comfortable letting go of my inhibitions. I left feeling 10kg lighter, physically and emotionally." },
    { n: "Sérgio", loc: "Santa Fé", t: isPT ? "Sofro de ansiedade e essa sessão foi mais eficaz que muitas terapias. A conexão humana foi real, e o clímax final foi o mais forte e libertador que já experimentei." : "I suffer from anxiety and this session was more effective than many therapies. The human connection was real, and the final climax was the strongest and most liberating I've ever experienced." },
    { n: "Beatriz", loc: "Rio Preto", t: isPT ? "Mãos quentes e presença firme. O ambiente ficou carregado de uma energia positiva. Consegui relaxar profundamente e esquecer o caos lá fora." : "Warm hands and firm presence. The environment was charged with positive energy. I managed to relax deeply and forget the chaos outside." },
    { n: "Marcelo", loc: isPT ? "SP - Centro" : "SP - Downtown", t: isPT ? "Fui sem expectativa e saí surpreendido. A massagem lingam foi executada com uma técnica precisa e respeitosa. O prazer foi intenso e genuíno." : "I went without expectation and left surprised. The lingam massage was executed with precise and respectful technique. The pleasure was intense and genuine." },
    { n: "André", loc: "Motel K2", t: isPT ? "Discrição absoluta. O Thalyson é uma pessoa de energia muito boa e sabe o que faz. Foi um escape necessário e revitalizante da minha rotina." : "Absolute discretion. Thalyson has very good energy and knows what he's doing. It was a necessary and revitalizing escape from my routine." },
    { n: "Juliana", loc: "Londrina", t: isPT ? "Delicadeza e força alternadas nos momentos exatos. Me senti viva de novo. Obrigada pelo carinho e respeito com meu corpo." : "Delicacy and strength alternated at the exact moments. I felt alive again. Thank you for the care and respect for my body." },
    { n: "Paulo", loc: "São Paulo - Paulista", t: isPT ? "Uma experiência completa. Do toque inicial reconfortante até a explosão final de energia. Foi intenso e me deixou com as pernas bambas de tanto relaxamento." : "A complete experience. From the comforting initial touch to the final explosion of energy. It was intense and left me weak in the knees from so much relaxation." },
    { n: "Vinícius", loc: "Jales", t: isPT ? "Tirou um peso das minhas costas que eu nem sabia que carregava. A finalização foi potente e necessária. Voltarei com certeza." : "Took a weight off my back I didn't know I was carrying. The finish was potent and necessary. I will definitely be back." },
    { n: "Fernanda", loc: "Santa Fé", t: isPT ? "Super respeitoso com meu corpo. Foi uma troca de energia muito bonita, intensa e sem pressa. Me senti renovada." : "Super respectful with my body. It was a very beautiful, intense, and unhurried exchange of energy. I felt renewed." },
    { n: "Eduardo", loc: "Rio Preto", t: isPT ? "Sensacional. A técnica dele para construir e depois liberar a energia é coisa de outro mundo. Foi um alívio físico e mental gigantesco." : "Sensational. His technique to build and then release energy is out of this world. It was a gigantic physical and mental relief." },
    { n: "Caio", loc: isPT ? "SP - Consolação" : "SP - Consolação", t: isPT ? "Atendimento impecável no meu hotel. Pontual, discreto e com uma mão que sabe exatamente onde tocar para aliviar a tensão." : "Impeccable service at my hotel. Punctual, discreet, and with a hand that knows exactly where to touch to relieve tension." },
    { n: "Larissa", loc: "Votuporanga", t: isPT ? "Relaxamento profundo. Esqueci de tudo lá fora. Recomendo para qualquer pessoa que precise se reconectar consigo mesma." : "Deep relaxation. I forgot everything outside. Recommend to anyone who needs to reconnect with themselves." },
    { n: "Otávio", loc: "Londrina", t: isPT ? "Foi intenso do início ao fim. Uma descarga de energia que eu estava precisando desesperadamente. Me senti limpo por dentro." : "It was intense from start to finish. An energy discharge I desperately needed. I felt clean inside." },
    { n: "Diego", loc: "Fernandópolis", t: isPT ? "A melhor parte foi não me sentir julgado. Pude ser eu mesmo, expressar meu prazer e aproveitar cada segundo de cuidado." : "The best part was not feeling judged. I could be myself, express my pleasure, and enjoy every second of care." }
  ];

  const finalMix = [...realReviews, ...seriousReviews];
  return finalMix.map(r => ({ ...r, s: 5 }));
};

const getData = (lang: string) => {
  const isPT = lang === 'pt';
  const USD_RATE = 5.75;
  const getPrice = (brl: number) => isPT ? brl : Math.round(brl / USD_RATE);

  const p = {
    relax: getPrice(145),
    sens: getPrice(175),
    titan: getPrice(205),
    nuru: getPrice(320),
    depil: getPrice(110),
    packRelax: { v: getPrice(490), full: getPrice(585), save: getPrice(95) },
    packTri: { v: getPrice(525), full: getPrice(615), save: getPrice(90) },
    packMix: { v: getPrice(640), full: getPrice(760), save: getPrice(120) },
    packSupreme: { v: getPrice(550), full: getPrice(670), save: getPrice(120) }, 
    extras: {
      more_time: getPrice(77),
      touch: getPrice(77),
      aroma: getPrice(10),
      hair_trim: getPrice(50),
      pain_relief: getPrice(10)
    }
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
        id: 'depilacao',
        min: 45,
        price: p.depil,
        icon: "scissors",
        tag: isPT ? "NOVO" : "NEW",
        title: isPT ? "Depilação (Maquininha)" : "Body Trimming",
        desc: isPT ? "Higiene e estética em dia." : "Hygiene and aesthetics.",
        details: isPT ? "Aparo completo com máquina (Zero ou Pente)\nPeito, pernas, braços e costas" : "Full body trimming with machine\nChest, legs, arms, and back"
      },
      {
        id: 'relaxante',
        min: 60,
        price: p.relax,
        icon: "user-check",
        tag: isPT ? "ALÍVIO & PAZ" : "RELIEF & PEACE",
        title: isPT ? "Massagem Clássica" : "Classic Massage",
        desc: isPT ? "Para quem carrega o peso do mundo. Relaxe profundamente." : "For those carrying the world's weight. Deep relaxation.",
        details: isPT ? "Toque suave e acolhedor no corpo todo, foco nas costas, mãos, pernas e pés. \nAlivia o estresse e o cansaço mental\nUm momento só seu de relaxamento e paz\n(Modalidade terapêutica, sem toque íntimo)" : "Firm and welcoming touch on back and legs\nRelieves stress and mental fatigue\nA moment of peace just for you\n(Therapeutic mode, no intimate touch)"
      },
      {
        id: 'sensitiva',
        min: 60,
        price: p.sens,
        icon: "sparkles",
        tag: isPT ? "DESPERTAR SENSORIAL" : "SENSORY AWAKENING",
        title: isPT ? "Tântrica Sensorial" : "Sensory Tantra",
        desc: isPT ? "Reconecte-se com seu corpo. Toques sutis que arrepiam." : "Reconnect with your body. Subtle touches that thrill.",
        details: isPT ? "Toques leves para despertar a pele\nSensação de leveza e acolhimento\nFinalização especial (Lingam)\nPara quem busca sentir mais" : "Touches to awaken the skin\nFeeling of lightness and warmth\nSpecial finish (Lingam)\nFor those seeking to feel more"
      },
      {
        id: 'mista',
        min: 60,
        price: p.titan,
        icon: "zap",
        popular: true, 
        tag: isPT ? "EXPERIÊNCIA COMPLETA" : "FULL EXPERIENCE",
        title: isPT ? "Fusion Experience" : "Fusion Experience",
        desc: isPT ? "A união perfeita: relaxamento muscular + energia intensa." : "The perfect union: muscle relaxation + intense energy.",
        details: isPT ? "Começa tirando a tensão muscular\nEvolui para uma troca de energia corpo a corpo (Massagista de cueca)\nFinalização intensa e libertadora\nA escolha favorita de quem quer tudo" : "Starts removing muscle tension\nEvolves into body-to-body energy exchange\nIntense and liberating finish\nThe favorite choice for those who want it all"
      },
      {
        id: 'nuru',
        min: 60,
        price: p.nuru,
        icon: "sparkles",
        tag: isPT ? "ENTREGA & ACOLHIMENTO" : "SURRENDER & WARMTH",
        title: isPT ? "Massagem Nuru" : "Nuru Massage",
        desc: isPT ? "Deslizamento corpo a corpo com gel aquecido. O ápice do relaxamento e cuidado." : "Body-to-body slide with heated gel. The peak of relaxation and care.",
        details: isPT ? "Uso de gel Nuru aquecido que hidrata e relaxa\nContato intenso e acolhedor corpo a corpo\nAlivia o estresse profundo através do calor e fricção\nUma experiência de pura liberdade e conexão" : "Use of heated Nuru gel that hydrates and relaxes\nIntense and welcoming body-to-body contact\nRelieves deep stress through heat and friction\nAn experience of pure freedom and connection"
      }
    ] as ServiceItem[],
    extras: [
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "✂️", isEmoji: true, label: isPT ? "Aparo (Extra)" : "Trim (Extra)", desc: isPT ? "Adicione aparo a sua massagem 2 partes do corpo" : "Add trim to your massage, 2 parts of body" },
      { id: 'more_time', price: p.extras.more_time, icon: "⏱️", isEmoji: true, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Mais tempo para você relaxar" : "More time for you" },
      { id: 'touch', price: p.extras.touch, icon: "🖐️", isEmoji: true, label: isPT ? "Troca Interativa" : "Interactive Touch", desc: isPT ? "Sinta a liberdade de tocar também" : "Feel free to touch too" },
      { id: 'aroma', price: p.extras.aroma, icon: "🌸", isEmoji: true, label: isPT ? "Aromaterapia" : "Aromatherapy", desc: isPT ? "Cheiro bom no ar" : "Essential oils to calm the mind" },
      { id: 'pain_relief', price: p.extras.pain_relief, icon: "💊", isEmoji: true, label: isPT ? "Pomada Dores" : "Pain Cream", desc: isPT ? "Alivia dores musculares fortes" : "Relieves strong muscle pain" }
    ],
    plans: [
      { id: 'pack_relax', type: 'pack', title: isPT ? "Pack Relax (4x)" : "Relax Pack (4x)", price: p.packRelax.v, fullPrice: p.packRelax.full, savings: p.packRelax.save, desc: isPT ? "4 Sessões Relaxantes" : "4 Relax Sessions", details: isPT ? "Garanta sua paz semanalmente.\nO cuidado constante que você merece." : "Ensure your weekly peace.\nThe constant care you deserve.", tag: isPT ? "MANUTENÇÃO" : "MAINTENANCE", icon: "package" },
      { id: 'pack_mista', type: 'pack', title: isPT ? "Pack Fusion (3x)" : "Fusion Pack (3x)", price: p.packTri.v, fullPrice: p.packTri.full, savings: p.packTri.save, desc: isPT ? "3 Sessões Fusion" : "3 Fusion Sessions", details: isPT ? "Três encontros intensos.\nPara quem precisa escapar da rotina." : "Three intense encounters.\nFor those who need to escape routine.", tag: isPT ? "ESCAPE" : "ESCAPE", icon: "layers" },
      { id: 'pack_supreme', type: 'pack', title: isPT ? "Pack Supreme (3x)" : "Supreme Pack (3x)", price: p.packSupreme.v, fullPrice: p.packSupreme.full, savings: p.packSupreme.save, desc: isPT ? "1 Nuru + 1 Relaxante + 1 Fusion" : "1 Nuru + 1 Relax + 1 Fusion", details: isPT ? "O cuidado máximo com o seu bem-estar.\nTrês momentos de fuga da rotina para você se renovar." : "The maximum care for your well-being.\nThree moments of escape from routine for you to renew yourself.", tag: "VIP", icon: "award" },
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
    text: {
      welcome: isPT ? "Olá," : "Hello,",
      choose_sub: isPT ? "Como você quer se sentir hoje? Permita-se esse cuidado." : "How do you want to feel today? Allow yourself this care.",
      level_label: isPT ? "Sua Jornada" : "Your Journey",
      tab_packs: isPT ? "Pacotes" : "Packages",
      tab_single: isPT ? "Sessão Avulsa" : "Single Session",
      book_btn: isPT ? "Reservar" : "Book",
      next_btn: isPT ? "Continuar" : "Continue",
      finish_btn: isPT ? "Finalizar Pedido" : "Finish Order",
      loading: isPT ? "Preparando seu espaço..." : "Preparing your space...",
      toast_select_item: isPT ? "Selecione o que seu corpo pede" : "Select what your body needs",
      toast_select_date: isPT ? "Escolha seu momento" : "Choose your moment",
      toast_fill_name: isPT ? "Como prefere ser chamado?" : "How do you prefer to be called?",
      toast_fill_addr: isPT ? "Onde levo o relaxamento?" : "Where should I bring relaxation?",
      toast_fill_hotel: isPT ? "Qual hotel você está?" : "Which hotel are you at?",
      toast_select_pay: isPT ? "Como prefere acertar?" : "How do you prefer to pay?",
      toast_accept_terms: isPT ? "Por favor, aceite as regras de convivência" : "Please accept the coexistence rules",
      toast_coupon_success: isPT ? "Presente aplicado com sucesso!" : "Gift applied successfully!",
      toast_coupon_invalid: isPT ? "Código inválido ou expirado." : "Invalid or expired coupon.",
      details_label: isPT ? "O que esperar" : "What to expect",
      select_time_title: isPT ? "Seu Momento" : "Your Moment",
      location_title: isPT ? "Onde nos encontramos?" : "Where do we meet?",
      extras_title: isPT ? "Algo a mais para você?" : "Something more for you?",
      coupon_section: isPT ? "Seus Presentes" : "Your Gifts",
      no_coupons: isPT ? "Sem presentes no momento" : "No gifts at the moment",
      payment_title: isPT ? "Facilidades de Pagamento" : "Payment Options",
      terms_title: isPT ? "Regras de Convivência" : "Coexistence Rules",
      success_title: isPT ? "Tudo Pronto!" : "All Set!",
      success_sub: isPT ? "Seu momento de paz está quase garantido. Envie o resumo para eu confirmar sua reserva." : "Your moment of peace is almost guaranteed. Send the summary so I can confirm your booking.",
      whatsapp_btn: isPT ? "Confirmar no WhatsApp" : "Confirm on WhatsApp",
      back_home: isPT ? "Voltar ao Início" : "Back to Home",
      timer_text: isPT ? "Segurando seu horário" : "Holding your slot",
      motel_note: isPT ? "Em motéis, garantimos sua privacidade total. A suíte fica por sua conta." : "In motels, we ensure your total privacy. The suite fee is on you.",
      upgrade_msg: isPT ? "💡 Dica: A Clássica é maravilhosa, mas a Tântrica toca a alma. Que tal experimentar?" : "💡 Tip: The Classic is wonderful, but the Tantra touches the soul. How about trying it?",
      input_name: isPT ? "Como quer ser chamado?" : "How do you want to be called?",
      input_addr: isPT ? "Endereço (Rua)" : "Address (Street)",
      input_num: isPT ? "Número" : "Number",
      input_district: isPT ? "Bairro" : "District",
      input_city: isPT ? "Cidade" : "City",
      input_comp: isPT ? "Complemento (Apto, Bloco)" : "Unit/Apt",
      input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
      input_room: isPT ? "Número do Quarto" : "Room Number",
      agree_terms: isPT ? "Li e concordo com o sigilo e respeito" : "I read and agree with privacy and respect",
      install_app: isPT ? "Tenha acesso fácil" : "Easy access",
      install_desc: isPT ? "Adicione à tela inicial para agendar com privacidade quando quiser" : "Add to home screen to book with privacy whenever you want",
      faq_title: isPT ? "Dúvidas Comuns" : "Common Questions",
      reviews_title: isPT ? "Quem já experimentou" : "Who has tried it",
      empty_date: isPT ? "Selecione um dia acima" : "Select a day above",
      empty_slots: isPT ? "Agenda cheia neste dia" : "Full schedule this day",
      total_label: isPT ? "Total" : "Total",
      subtotal: isPT ? "Valor" : "Value",
      discount: isPT ? "Desconto" : "Discount",
      pix_discount: isPT ? "Desconto Pix (3%)" : "Pix Discount (3%)",
      welcome_popup_title: isPT ? "Seja Bem-vindo!" : "Welcome!",
      welcome_popup_msg: isPT ? "Fico feliz que você esteja aqui. Para começar nossa conexão com o pé direito, um presente especial." : "I'm happy you're here. To start our connection on the right foot, a special gift.",
      levelup_popup_title: isPT ? "Você evoluiu!" : "You leveled up!",
      levelup_popup_msg: isPT ? "Nossa conexão está mais forte. Aproveite seu reconhecimento." : "Our connection is stronger. Enjoy your recognition.",
      get_coupon: isPT ? "Aceitar Presente" : "Accept Gift",
      rules_complete: isPT ? "Nossas Regras de Ouro" : "Our Golden Rules",
      media_discount: isPT ? "Desconto Mídia (1%)" : "Media Discount (1%)",
      media_title: isPT ? "Autorização de Imagem" : "Image Rights",
      media_desc: isPT ? "Autorizo uso de fotos/vídeos (sem rosto/partes íntimas) para divulgação responsável." : "I authorize photos/videos (no face/intimate parts) for responsible marketing.",
      media_bonus: isPT ? "Ganhe 1% de desconto!" : "Get 1% OFF!",
      uber_notice: isPT ? "Taxa de Deslocamento (Uber): Calculada e cobrada à parte no WhatsApp." : "Transport Fee (Uber): Calculated and charged separately on WhatsApp."
    }
  };
};

// ==================================================================================
// 5. MAIN APP
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error"}[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;
  
  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 0, lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isClient) {
        document.title = step === 0 ? "Thalyson Massagens - Agende seu Relaxamento" : "Thalyson - Finalizar Reserva";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = "Agende massagens relaxantes, tântricas e depilação no conforto da sua casa ou hotel. Atendimento profissional e discreto.";
            document.head.appendChild(meta);
        }
    }
  }, [step, isClient]);

  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
  }, []);
  
  useEffect(() => {
    if (!isClient) return;
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.user && typeof parsed.user === 'object') {
            setUser({
              name: parsed.user.name || '',
              xp: typeof parsed.user.xp === 'number' ? parsed.user.xp : 0,
              coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
              usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
              hasSeenWelcome: typeof parsed.user.hasSeenWelcome === 'boolean' ? parsed.user.hasSeenWelcome : false,
              ordersCount: typeof parsed.user.ordersCount === 'number' ? parsed.user.ordersCount : 0,
              lastActivity: parsed.user.lastActivity || new Date().toISOString()
            });
          }
          if (parsed.bookingDraft && typeof parsed.bookingDraft === 'object') {
            const draftDate = new Date(parsed.bookingDraft.date);
            if (draftDate > new Date()) {
              setBooking({
                ...parsed.bookingDraft,
                mediaAllowed: parsed.bookingDraft.mediaAllowed || false,
                address: { 
                  street: sanitizeInput(parsed.bookingDraft.address?.street || ''), 
                  number: sanitizeInput(parsed.bookingDraft.address?.number || ''), 
                  district: sanitizeInput(parsed.bookingDraft.address?.district || ''), 
                  city: sanitizeInput(parsed.bookingDraft.address?.city || ''), 
                  comp: sanitizeInput(parsed.bookingDraft.address?.comp || ''), 
                  placeName: sanitizeInput(parsed.bookingDraft.address?.placeName || '') 
                }
              });
            }
          }
          if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) setStep(parsed.step);
        } catch (e) { localStorage.removeItem(CONFIG.STORAGE_KEY); }
      }
    } catch (e) { localStorage.removeItem(CONFIG.STORAGE_KEY); }
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 800);
  }, [isClient]);
  
  useEffect(() => {
    if (isClient && dataLoaded) {
      try {
        const saveData = {
          user: { ...user, lastActivity: new Date().toISOString() },
          bookingDraft: { 
            ...booking, 
            appliedCoupon: booking.appliedCoupon ? { id: booking.appliedCoupon.id, val: booking.appliedCoupon.val, title: booking.appliedCoupon.title, code: booking.appliedCoupon.code } : null 
          },
          step, 
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        const serialized = JSON.stringify(saveData);
        if (serialized.length < CONFIG.MAX_STORAGE_SIZE * 1024) { localStorage.setItem(CONFIG.STORAGE_KEY, serialized); }
      } catch (e) {}
    }
  }, [user, booking, step, isClient, dataLoaded]);
  
  useEffect(() => {
    if (!loading && isClient && dataLoaded && !user.hasSeenWelcome && !welcomePopup) {
      const timer = setTimeout(() => setWelcomePopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded, welcomePopup]);
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  
  const handleSelectItem = useCallback((type: 'single' | 'pack', item: ServiceItem) => {
    setBooking(prev => ({ ...prev, type, item, extras: {}, payment: '', termsAccepted: false, bookingId: `BOOK_${Date.now()}` }));
    if (item.id === 'relaxante') addToast(DATA.text.upgrade_msg, "success");
    else addToast(item.title, "success");
    setTimeout(() => setStep(1), 300);
  }, [addToast, DATA.text.upgrade_msg]);

  const daysArray = useMemo(() => {
    const days = []; const today = new Date();
    for (let i = 0; i < 30; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }
    return days;
  }, []);
  
  const generateTimeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) slots.push(`${i < 10 ? '0' : ''}${i}:00`);
    const now = new Date(); const selectedDate = new Date(booking.date);
    if (isNaN(selectedDate.getTime())) return [];
    if (selectedDate.toDateString() === now.toDateString()) {
      const currentHour = now.getHours();
      return slots.filter(time => { const [hour] = time.split(':').map(Number); return hour > currentHour + 1; });
    }
    return slots;
  }, [booking.date]);
  
  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0 };
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => { 
      if (booking.extras[k]) { 
        const extData = DATA.extras.find(e => e.id === k); 
        if (extData) sub += booking.type !== 'single' ? Math.floor(extData.price * 0.8) : extData.price; 
      } 
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let runningTotal = Math.max(0, sub - disc);
    let mediaDisc = 0;
    if (booking.mediaAllowed) { mediaDisc = Math.ceil(runningTotal * 0.01); runningTotal = Math.max(0, runningTotal - mediaDisc); }
    let pixDisc = 0;
    if (booking.payment === 'pix') { pixDisc = Math.ceil(runningTotal * 0.03); }
    return { sub, disc, pixDisc, mediaDisc, total: Math.max(0, runningTotal - pixDisc) };
  }, [booking.item, booking.extras, booking.appliedCoupon, booking.type, DATA.extras, booking.payment, booking.mediaAllowed]);
  
  const estimatedXP = useMemo(() => Math.floor(financials.total * (booking.type === 'pack' ? 0.30 : 0.15)), [financials.total, booking.type]);
  
  const getNextLevelInfo = (currentXP: number) => {
    if (currentXP >= 800) return { needed: 500 - ((currentXP - 800) % 500), reward: 50, title: "Íntimo Plus" };
    const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
    return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };
  
  const getCurrentLevelProgress = () => {
    if (user.xp >= 800) return ((user.xp - 800) % 500 / 500) * 100;
    const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
    const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
    const currentLevel = DATA.levels[realIndex]; const nextLevel = DATA.levels[realIndex + 1];
    if (!nextLevel) return 100; return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };
  
  const generateWhatsAppMsg = () => {
    const f = financials; const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : '';
    const securityHash = btoa(`${f.total}-${dateStr}-${booking.item?.id || ''}-${CONFIG.SECRET_TOKEN}`).substring(0, 8).toUpperCase();
    let serviceTitle = booking.item?.title || ''; if (booking.type !== 'single' && booking.item?.desc) serviceTitle += ` ${lang === 'pt' ? '(Pacote)' : '(Pack)'}`;
    
    let locTxt = ""; let mapQuery = "";
    if (booking.locationType === 'home') { 
      const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`; 
      locTxt = `🏠 *${lang === 'pt' ? 'Residência' : 'Home'}*\n📍 ${fullAddr}\n📝 ${lang === 'pt' ? 'Comp' : 'Unit'}: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    else if (booking.locationType === 'motel') { 
      locTxt = `🏩 *Motel*\n⚠️ (${lang === 'pt' ? 'Local por conta do cliente' : 'Venue fee on client'})`; 
    }
    else { 
      const fullAddr = `${booking.address.placeName}, ${booking.address.city}`; 
      locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 ${lang === 'pt' ? 'Quarto' : 'Room'}: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    
    const extrasList = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => { 
      const ex = DATA.extras.find(e => e.id === k); 
      if (!ex) return ''; 
      return `✅ ${ex.label} (+${formatMoney(booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price, lang === 'pt')})`; 
    }).filter(Boolean).join('\n');
    
    let priceDetails = `💵 *${lang === 'pt' ? 'Base' : 'Base'} (${serviceTitle}):* ${formatMoney(booking.item?.price || 0, lang === 'pt')}`;
    if (f.disc > 0) priceDetails += `\n📉 *${lang === 'pt' ? 'Cupom' : 'Coupon'} (${booking.appliedCoupon?.code}):* -${formatMoney(f.disc, lang === 'pt')}`;
    if (f.mediaDisc > 0) priceDetails += `\n📸 *${lang === 'pt' ? 'Mídia (1%)' : 'Media (1%)'}:* -${formatMoney(f.mediaDisc, lang === 'pt')}`;
    if (f.pixDisc > 0) priceDetails += `\n💸 *Pix (3%):* -${formatMoney(f.pixDisc, lang === 'pt')}`;
    priceDetails += `\n\n💰 *TOTAL FINAL: ${formatMoney(f.total, lang === 'pt')}*`;
    
    return `
*${lang === 'pt' ? 'NOVA RESERVA' : 'NEW BOOKING'}* | #${securityHash}
──────────────────
👤 *${lang === 'pt' ? 'Cliente' : 'Client'}:* ${sanitizeInput(user.name)}
📅 *${lang === 'pt' ? 'Data' : 'Date'}:* ${dateStr}
⏰ *${lang === 'pt' ? 'Horário' : 'Time'}:* ${booking.time}

💆‍♂️ *${lang === 'pt' ? 'SESSÃO' : 'SESSION'}:*
*${serviceTitle}*
${extrasList ? `\n➕ *${lang === 'pt' ? 'ADICIONAIS' : 'ADD-ONS'}:*\n${extrasList}` : ''}

📍 *${lang === 'pt' ? 'LOCAL' : 'LOCATION'}:*
${locTxt}
${mapQuery ? `🔗 Mapa: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : ''}

🚗 *${lang === 'pt' ? 'TRANSPORTE (UBER)' : 'TRANSPORT (UBER)'}:*
*${lang === 'pt' ? 'Valor a combinar à parte' : 'Value to be agreed separately'}*

💰 *${lang === 'pt' ? 'RESUMO FINANCEIRO' : 'FINANCIAL SUMMARY'}:*
${priceDetails}

💳 *${lang === 'pt' ? 'Pagamento' : 'Payment'}:* ${booking.payment.toUpperCase()}
──────────────────
*Aguardando confirmação e valor do Uber...*
    `.trim();
  };

  const generateWhatsAppLink = () => `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(generateWhatsAppMsg())}`;
  
  const isStepValid = () => {
    if (step === 0) return !!booking.item;
    if (step === 1) return !!(booking.date && booking.time);
    if (step === 2) {
      if (!user.name || user.name.trim().length < 3) return false;
      if (booking.locationType === 'home') return validateAddress(booking.address);
      if (booking.locationType === 'hotel') return !!(booking.address.placeName && booking.address.city);
      return true;
    }
    if (step === 3) return !!(booking.payment && booking.termsAccepted);
    return true;
  };
  
  const handleNextStep = useCallback(() => {
    if (!isStepValid()) {
      if (step === 0) addToast(T.toast_select_item, "error");
      if (step === 1) addToast(T.toast_select_date, "error");
      if (step === 2) addToast(T.toast_fill_addr, "error");
      if (step === 3) addToast(T.toast_accept_terms, "error");
      return;
    }
    if (step === 3) finishBooking(); 
    else setStep(s => s + 1);
  }, [step, booking, user.name, T, addToast, isStepValid]);
  
  const finishBooking = () => {
    let updatedCoupons = [...user.coupons]; 
    let updatedHistory = [...user.usedCoupons];
    
    if (booking.appliedCoupon && booking.appliedCoupon.id !== 'manual') {
      if (!updatedHistory.includes(booking.appliedCoupon.code)) updatedHistory.push(booking.appliedCoupon.code);
      updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon?.code);
    }
    
    const newXP = user.xp + estimatedXP; 
    let leveledUp = false; 
    let newLevelTitle = "";
    
    DATA.levels.forEach(lvl => {
      if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) { 
        leveledUp = true; 
        newLevelTitle = lvl.title; 
        updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 ${lvl.title}`, code: `LVLUP${lvl.level}` }); 
      }
    });
    
    const newOrdersCount = user.ordersCount + 1;
    setUser(prev => ({ ...prev, xp: newXP, coupons: updatedCoupons, usedCoupons: updatedHistory, ordersCount: newOrdersCount, lastActivity: new Date().toISOString() }));
    
    if (leveledUp) { 
      setLevelUpPopup(true); 
      setTimeout(() => addToast(`${T.levelup_popup_title} ${newLevelTitle}!`, "success"), 500); 
    }
    
    window.open(generateWhatsAppLink(), '_blank');
    setStep(4);
  };
  
  const scrollDates = (dir: 'left' | 'right') => { 
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' }); 
    }
  };
  
  const getDayLabel = (d: Date) => {
    const today = new Date(); 
    const tomorrow = new Date(today); 
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) return lang === 'pt' ? 'HOJE' : 'TODAY';
    if (d.toDateString() === tomorrow.toDateString()) return lang === 'pt' ? 'AMANHÃ' : 'TMRW';
    return d.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'short' }).slice(0, 3).toUpperCase();
  };
  
  const isPT = lang === 'pt';
  
  if (!isClient) return <div className="min-h-screen w-full bg-zinc-950" />;
  
  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center max-w-xs w-full px-6">
          <div className="w-20 h-20 rounded-2xl bg-zinc-800 text-white flex items-center justify-center text-3xl font-playfair mb-8 animate-pulse">
            T
          </div>
          <div className="w-full h-1 bg-zinc-800/40 overflow-hidden mb-4 rounded-full">
            <div className="h-full bg-zinc-400" style={{ width: '100%', animation: 'loading-bar 1.5s ease-in-out infinite' }}></div>
          </div>
          <p className="text-[10px] uppercase tracking-widest opacity-50">{T.loading}</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}} />
      </div>
    );
  }
  
  return (
    <>
      <GlobalStyles isDark={isDark} />
      
      <div className={`fixed inset-0 z-[-1] pointer-events-none ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`} aria-hidden="true" />
      
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div key={t.id} role="alert" className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl shadow-lg animate-fade-in font-inter ${t.type === 'success' ? isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-slate-200 text-slate-800' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={18} />
            <span className="text-xs font-medium tracking-wide">{t.msg}</span>
          </div>
        ))}
      </div>
      
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} toggleLang={() => setLang(l => l === 'pt' ? 'en' : 'pt')} lang={lang} user={user} />

      <main className={`min-h-screen relative z-10 pb-36 px-6 md:px-12 max-w-5xl mx-auto`}>
        {step !== 4 && (
          <header className="pt-10 pb-8 border-b border-transparent">
            <div className="flex items-start justify-between">
              <div className="flex flex-col cursor-pointer transition-opacity" onClick={() => setStep(0)}>
                <h1 className={`text-3xl font-playfair tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Thalyson <br className="block md:hidden" /> Massagens
                </h1>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest mt-3 font-medium font-inter">
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-500"></span></span>
                  {69 + user.ordersCount} Sessões Realizadas
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setMenuOpen(true)} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                   <Icon name="menu" size={20} />
                </button>
              </div>
            </div>
            
            {step > 0 && step < 4 && (
              <div className="mt-12 flex items-center justify-between gap-4 max-w-sm mx-auto">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div className={`w-full h-0.5 rounded-full transition-all ${step >= i ? isDark ? 'bg-zinc-400' : 'bg-slate-800' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-widest font-inter ${step >= i ? isDark ? 'text-zinc-300' : 'text-slate-800' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                      {i === 1 ? 'Data' : i === 2 ? 'Local' : 'Resumo'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </header>
        )}
        
        <div className="space-y-16 mt-8">
          {step === 0 && (
            <section className="space-y-16 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-4">
                <div>
                  <h2 className={`text-4xl md:text-5xl font-playfair font-medium leading-tight mb-6 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    {T.welcome} <span className="font-italic text-zinc-500">{user.name ? user.name.split(' ')[0] : (isPT ? "Visitante" : "Visitor")}.</span>
                  </h2>
                  <p className={`text-base md:text-lg font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {T.choose_sub}
                  </p>
                </div>
                
                <div className={`p-8 md:p-10 rounded-[2rem] border ${isDark ? 'bg-zinc-900/20 border-zinc-800/60' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        <Icon name="award" size={20} />
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-widest block mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          {T.level_label}
                        </span>
                        <h3 className={`text-xl font-playfair ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          {user.xp >= 800 ? "Íntimo Plus" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-3xl font-playfair ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{user.xp}</span>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mt-1">XP</span>
                    </div>
                  </div>
                  <div>
                    <div className={`flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                      <span>Progresso</span>
                      <span className={isDark ? 'text-zinc-400' : 'text-slate-700'}>{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800/50' : 'bg-slate-100'}`} role="progressbar" aria-valuenow={getCurrentLevelProgress()} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full bg-zinc-500 transition-all duration-1000 ease-out" style={{ width: `${getCurrentLevelProgress()}%` }} />
                    </div>
                    {nextLevelInfo && (
                      <p className={`text-xs mt-4 text-center font-light ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        Faltam {nextLevelInfo.needed} XP para +{formatMoney(nextLevelInfo.reward, isPT)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`flex p-1.5 rounded-2xl border max-w-md mx-auto ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-slate-50 border-slate-200/50'}`} role="tablist">
                <button role="tab" aria-selected={activeTab === 'single'} onClick={() => setActiveTab('single')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'single' ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm border border-slate-100' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="user" size={16} /> {T.tab_single}
                </button>
                <button role="tab" aria-selected={activeTab === 'packs'} onClick={() => setActiveTab('packs')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'packs' ? isDark ? 'bg-zinc-800 text-white shadow-sm' : 'bg-white text-slate-900 shadow-sm border border-slate-100' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="package" size={16} /> {T.tab_packs}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => (
                  <Card key={s.id} active={booking.item?.id === s.id} onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : 'pack', s)} isDark={isDark} popular={s.popular}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-8">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                          <Icon name={s.icon} size={20} isEmoji={s.isEmoji} />
                        </div>
                        <div className="text-right">
                          {s.fullPrice && (
                            <span className={`text-[10px] block mb-1 font-inter uppercase tracking-widest ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                              De: <span className="line-through">{formatMoney(s.fullPrice, isPT)}</span>
                            </span>
                          )}
                          <span className={`text-2xl font-playfair font-medium ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                            {formatMoney(s.price, isPT)}
                          </span>
                          {s.savings && (
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full block mt-2 border ${isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              ECONOMIZE {formatMoney(s.savings, isPT)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <span className={`text-[9px] font-bold uppercase tracking-widest border px-3 py-1.5 rounded-full inline-block mb-5 ${isDark ? 'bg-zinc-900/50 border-zinc-700 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                          {s.tag}
                        </span>
                        <h3 className={`text-xl font-playfair mb-3 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                          {s.title}
                        </h3>
                        <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`pt-6 border-t ${isDark ? 'border-zinc-800/50' : 'border-slate-100'}`}>
                      <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        <Icon name="alert-circle" size={12} /> {T.details_label}
                      </div>
                      <div className={`text-xs space-y-2 font-light leading-relaxed ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        {s.details.split('\n').map((line, i) => <p key={i}>• {line}</p>)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="py-16 relative">
                <div className="flex items-center justify-between mb-10 px-2">
                  <h3 className={`text-2xl font-playfair ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                    {T.reviews_title}
                  </h3>
                  <div className="hidden md:flex gap-3">
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: -350, behavior: 'smooth' })} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800'}`}><Icon name="chevron-left" size={18} /></button>
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: 350, behavior: 'smooth' })} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800'}`}><Icon name="chevron-right" size={18} /></button>
                  </div>
                </div>
                <div id="reviews-slider" className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-8 -mx-6 px-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center flex-shrink-0 w-[300px] md:w-[350px] mr-6 last:mr-0">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="max-w-3xl mx-auto py-16">
                <h3 className={`text-2xl font-playfair text-center mb-10 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                  {T.faq_title}
                </h3>
                <div className={`border-t ${isDark ? 'border-zinc-800/50' : 'border-slate-100'}`}>
                  {DATA.faq.map((item, idx) => <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />)}
                </div>
              </div>
            </section>
          )}
          
          {step === 1 && (
            <section className="space-y-12 animate-fade-in max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className={`text-3xl font-playfair mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  {T.select_time_title}
                </h2>
                <p className={`text-sm font-light ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                  {T.toast_select_date}
                </p>
              </div>
              
              <div className={`p-5 rounded-2xl flex items-center justify-between border ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-slate-200/50 shadow-sm'}`}>
                 <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{booking.item?.title}</span>
                 <button onClick={() => setStep(0)} className={`text-[10px] uppercase font-bold tracking-widest transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-700'}`}>Trocar Escolha</button>
              </div>

              <div className="relative mt-12">
                <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 shadow-sm'}`}><Icon name="chevron-left" size={18} /></button>
                
                <div ref={dateScrollRef} className="flex gap-4 overflow-x-auto px-2 py-4 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const monthName = d.toLocaleDateString(isPT ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' }).replace('.', '');
                    return (
                      <div key={idx} className="snap-center">
                        <button onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))} className={`w-[80px] h-[100px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all border ${isSel ? isDark ? 'bg-zinc-200 border-zinc-200 text-zinc-900 scale-105' : 'bg-slate-900 border-slate-900 text-white scale-105 shadow-md' : isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:border-zinc-600' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}>
                          <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">{monthName}</span>
                          <span className="text-xl font-medium font-playfair">{d.getDate()}</span>
                          <span className={`text-[9px] uppercase font-bold tracking-widest ${isSel ? isDark ? 'text-zinc-600' : 'text-slate-300' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{getDayLabel(d)}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 shadow-sm'}`}><Icon name="chevron-right" size={18} /></button>
              </div>
              
              {!booking.date && (
                <div className={`text-center py-20 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-5 mt-8 ${isDark ? 'border-zinc-800/50 text-zinc-600' : 'border-slate-300 text-slate-400'}`}>
                  <Icon name="calendar" size={32} />
                  <p className="text-[11px] font-bold uppercase tracking-widest">{T.empty_date}</p>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                  {generateTimeSlots.map((t) => (
                    <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))} className={`py-4 rounded-2xl text-sm font-medium transition-all border ${booking.time === t ? isDark ? 'bg-zinc-200 border-zinc-200 text-zinc-900' : 'bg-slate-900 border-slate-900 text-white shadow-md' : isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              )}
              
              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-16 rounded-3xl border mt-8 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50 text-zinc-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <p className="text-xs font-medium tracking-wide">{T.empty_slots}</p>
                </div>
              )}
            </section>
          )}
          
          {step === 2 && (
            <section className="space-y-12 animate-fade-in max-w-3xl mx-auto">
              <h2 className={`text-3xl font-playfair text-center ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'home', label: isPT ? 'Residência' : 'Home', icon: 'home' },
                  { id: 'motel', label: 'Motel', icon: 'bed' },
                  { id: 'hotel', label: 'Hotel', icon: 'building' }
                ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))} className={`py-6 rounded-3xl flex flex-col items-center gap-4 transition-all border ${booking.locationType === x.id ? isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-900' : isDark ? 'bg-zinc-900/30 border-zinc-800/50 text-zinc-500 hover:border-zinc-700' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 shadow-sm'}`}>
                    <Icon name={x.icon} size={24} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">{x.label}</span>
                  </button>
                ))}
              </div>
              
              <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-zinc-900/20 border-zinc-800/60' : 'bg-white border-slate-100 shadow-sm'} space-y-6`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder={isPT ? "Inserir seu nome" : "Your name"} hasError={!user.name || user.name.trim().length < 3} />
                
                {booking.locationType === 'home' && (
                  <>
                    <div className="grid grid-cols-[1fr_100px] gap-4">
                      <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} icon="map-pin" placeholder={isPT ? "Rua / Avenida" : "Street"} hasError={!booking.address.street} />
                      <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Nº" type="tel" hasError={!booking.address.number} />
                    </div>
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Bairro" : "District"} hasError={!booking.address.district} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Cidade" : "City"} hasError={!booking.address.city} />
                      <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Apto / Bloco" : "Apt 10"} />
                    </div>
                  </>
                )}
                
                {booking.locationType === 'hotel' && (
                  <>
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder={isPT ? "Nome do hotel" : "Hotel name"} hasError={!booking.address.placeName} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Cidade" : "City"} hasError={!booking.address.city} />
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Nº do Quarto" />
                  </>
                )}
                
                {booking.locationType === 'motel' && (
                  <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-zinc-900/30 border-zinc-800' : 'bg-slate-50 border-slate-200'} flex flex-col items-center gap-4`}>
                    <Icon name="shield" size={24} className={isDark ? 'text-zinc-600' : 'text-slate-400'} />
                    <p className={`text-xs font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      {T.motel_note}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className={`text-[10px] font-bold uppercase mb-6 tracking-widest pl-2 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                  {T.extras_title}
                </h3>
                <div className="space-y-3">
                  {DATA.extras.map((ex) => {
                    const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                    const isActive = booking.extras[ex.id];
                    return (
                      <div key={ex.id} onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))} className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all ${isActive ? isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-300 shadow-sm' : isDark ? 'bg-zinc-900/20 border-zinc-800/50 hover:border-zinc-700' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`} role="checkbox" aria-checked={isActive}>
                        <div className="flex items-center gap-4">
                          <div className={`${isActive ? isDark ? 'text-zinc-200' : 'text-slate-800' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name={ex.icon} size={20} isEmoji={ex.isEmoji} /></div>
                          <div>
                            <p className={`text-sm font-medium ${isActive ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{ex.label}</p>
                            <p className={`text-xs font-light mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{ex.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full ${isActive ? isDark ? 'bg-zinc-700 text-zinc-100' : 'bg-slate-200 text-slate-800' : isDark ? 'bg-zinc-900 text-zinc-600' : 'bg-slate-50 text-slate-400'}`}>
                            + {formatMoney(price, isPT)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
          
          {step === 3 && (
            <section className="space-y-10 animate-fade-in max-w-4xl mx-auto">
              <SmartTimer isDark={isDark} text={T.timer_text} />
              
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
                <div className={`p-8 md:p-10 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900/20 border-zinc-800/60' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <h3 className={`text-2xl font-playfair mb-8 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    Resumo do Pedido
                  </h3>
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          MODALIDADE SELECIONADA
                        </p>
                        <h4 className={`text-lg font-playfair font-medium ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          {booking.item ? (DATA.services.find(s => s.id === booking.item!.id) || DATA.plans.find(p => p.id === booking.item!.id))?.title : ''}
                        </h4>
                        <div className={`flex items-center gap-2 text-xs font-medium mt-3 border px-3 py-1.5 rounded-full w-fit ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                          <Icon name="calendar" size={14} />
                          {booking.date ? new Date(booking.date).toLocaleDateString(isPT ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : ''} • {booking.time}
                        </div>
                      </div>
                      <span className={`text-xl font-medium font-playfair ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        {formatMoney(financials.sub, isPT)}
                      </span>
                    </div>
                    
                    {Object.keys(booking.extras).filter(k => booking.extras[k]).length > 0 && (
                      <div className={`pt-8 border-t ${isDark ? 'border-zinc-800/50' : 'border-slate-100'}`}>
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          ADICIONAIS
                        </p>
                        <div className="space-y-3">
                          {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
                            const ex = DATA.extras.find(e => e.id === k);
                            const price = booking.type !== 'single' ? Math.floor(ex!.price * 0.8) : ex!.price;
                            return (
                              <div key={k} className="flex justify-between text-sm font-light">
                                <span className={isDark ? 'text-zinc-400' : 'text-slate-600'}>{ex!.label}</span>
                                <span className={`font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>+ {formatMoney(price, isPT)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className={`pt-8 border-t ${isDark ? 'border-zinc-800/50' : 'border-slate-100'}`}>
                      <div className="flex justify-between mb-3">
                        <span className={`text-sm font-light ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.subtotal}</span>
                        <span className={`text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          {formatMoney(financials.sub, isPT)}
                        </span>
                      </div>
                      
                      {financials.disc > 0 && (
                        <div className="flex justify-between mb-3 text-emerald-500/80">
                          <span className="text-sm font-light">{T.discount} ({booking.appliedCoupon?.code})</span>
                          <span className="text-sm font-medium">- {formatMoney(financials.disc, isPT)}</span>
                        </div>
                      )}

                      {financials.mediaDisc > 0 && (
                        <div className="flex justify-between mb-3 text-blue-400/80">
                          <span className="text-sm font-light">{T.media_discount}</span>
                          <span className="text-sm font-medium">- {formatMoney(financials.mediaDisc, isPT)}</span>
                        </div>
                      )}
                      
                      {financials.pixDisc > 0 && (
                        <div className="flex justify-between mb-3 text-zinc-400">
                          <span className="text-sm font-light">{T.pix_discount}</span>
                          <span className="text-sm font-medium">- {formatMoney(financials.pixDisc, isPT)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-6 mt-2">
                        <span className={`text-sm uppercase tracking-widest font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.total_label}</span>
                        <div className="text-right">
                          <span className={`text-4xl font-playfair font-medium ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                            {formatMoney(financials.total, isPT)}
                          </span>
                          <div className={`flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-widest font-bold mt-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                            <Icon name="sparkles" size={12} /> +{estimatedXP} XP
                          </div>
                        </div>
                      </div>
                      
                      <div className={`mt-8 p-4 rounded-xl border flex items-start gap-3 text-xs font-light leading-relaxed ${isDark ? 'bg-zinc-900/30 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                          <Icon name="car" size={16} className="mt-0.5 shrink-0" />
                          <span>{T.uber_notice}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-zinc-900/20 border-zinc-800/60' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h3 className={`text-lg font-playfair mb-5 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                      {T.coupon_section}
                    </h3>
                    
                    <div className="flex gap-2 mb-5">
                      <input type="text" value={manualCouponInput} onChange={(e) => setManualCouponInput(e.target.value)} placeholder="Código do Cupom" className={`flex-1 h-12 px-4 rounded-xl text-sm outline-none font-mono uppercase transition-all bg-transparent border ${isDark ? 'border-zinc-800 focus:border-zinc-500 text-zinc-100 placeholder:text-zinc-700' : 'border-slate-300 focus:border-slate-400 text-slate-900 placeholder:text-slate-400'}`} />
                      <button onClick={applyManualCoupon} className={`px-5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Aplicar</button>
                    </div>

                    {user.coupons.length > 0 && (
                      <div className={`flex flex-wrap gap-2 pt-5 border-t ${isDark ? 'border-zinc-800/50' : 'border-slate-100'}`}>
                        {user.coupons.map(c => (
                          <button key={c.id} onClick={() => setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${booking.appliedCoupon?.id === c.id ? isDark ? 'bg-zinc-200 border-zinc-200 text-zinc-900' : 'bg-slate-900 border-slate-900 text-white' : isDark ? 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-600' : 'bg-transparent border-slate-300 text-slate-500 hover:border-slate-400'}`}>
                            {c.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-zinc-900/20 border-zinc-800/60' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h3 className={`text-lg font-playfair mb-5 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.payment_title}</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'pix', label: 'Pix (3% OFF)', icon: 'smartphone' },
                        { id: 'card', label: isPT ? 'Cartão' : 'Card', icon: 'credit-card' },
                        { id: 'money', label: isPT ? 'Dinheiro' : 'Cash', icon: 'banknote' }
                      ].map(p => (
                        <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${booking.payment === p.id ? isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-slate-100 border-slate-200 text-slate-800' : isDark ? 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                          <Icon name={p.icon} size={20} />
                          <span className="text-xs font-bold uppercase tracking-widest flex-1 text-left">{p.label}</span>
                          {booking.payment === p.id && <Icon name="check" size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div onClick={() => setTermsOpen(true)} className={`flex items-center justify-between p-6 rounded-[2rem] border cursor-pointer transition-all ${booking.termsAccepted ? isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-100 border-slate-200' : isDark ? 'bg-zinc-900/20 border-zinc-800/60 hover:border-zinc-700' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`${booking.termsAccepted ? isDark ? 'text-zinc-300' : 'text-slate-700' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name="shield" size={20} /></div>
                      <div>
                        <span className={`text-sm font-medium block mb-1 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.terms_title}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Regras e Acordos</span>
                      </div>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted })); }} className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${booking.termsAccepted ? isDark ? 'bg-zinc-200 border-zinc-200 text-zinc-900' : 'bg-slate-900 border-slate-900 text-white' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                      {booking.termsAccepted && <Icon name="check" size={12} />}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {step === 4 && (
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in max-w-lg mx-auto">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                <Icon name="check" size={32} />
              </div>
              <h2 className={`text-4xl font-playfair mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-base font-light leading-relaxed mb-12 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.success_sub}</p>
              
              <div className="flex flex-col gap-4 w-full">
                <Button variant="whatsapp" size="lg" full icon="message" onClick={() => window.open(generateWhatsAppLink(), '_blank')}>{T.whatsapp_btn}</Button>
                <button onClick={() => { setStep(0); setBooking({ ...booking, item: null, type: 'single', termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false }); }} className={`mt-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-slate-400 hover:text-slate-600'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {/* Navegação Inferior Despoluída */}
      {step > 0 && step < 4 && booking.item && (
        <nav className="fixed bottom-0 left-0 right-0 p-4 md:p-8 z-40 animate-fade-in pointer-events-none">
          <div className={`max-w-3xl mx-auto rounded-[2rem] p-4 border backdrop-blur-xl pointer-events-auto flex justify-between items-center transition-all ${isDark ? 'bg-zinc-950/80 border-zinc-800/50' : 'bg-white/80 border-slate-200/50 shadow-xl shadow-slate-200/20'}`}>
            <button onClick={() => { setStep(s => s - 1); }} className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`} aria-label="Voltar Etapa">
              <Icon name="chevron-left" size={24} />
            </button>
            
            <div className="text-center px-4">
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{step === 3 ? T.total_label : T.subtotal}</p>
              <p className={`text-lg font-playfair font-medium ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{step === 3 ? formatMoney(financials.total, isPT) : formatMoney(financials.sub, isPT)}</p>
            </div>
            
            <button onClick={handleNextStep} disabled={!isStepValid()} className={`h-12 px-6 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isDark ? 'bg-zinc-200 text-zinc-900 hover:bg-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
              {step === 3 ? T.finish_btn : T.next_btn} <Icon name="chevron-right" size={16} />
            </button>
          </div>
        </nav>
      )}
      
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 flex flex-col border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100 shadow-2xl'}`}>
            <button onClick={() => setTermsOpen(false)} className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-500' : 'hover:bg-slate-50 text-slate-400'}`} aria-label="Fechar"><Icon name="x" size={20} /></button>
            <h3 className={`text-2xl font-playfair mb-8 text-center shrink-0 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.rules_complete}</h3>
            <div className="space-y-2 overflow-y-auto scrollbar-hide mb-8">
              {DATA.rules.map((rule, i) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className="shrink-0 pt-6">
              <Button full size="lg" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}
      
      {welcomePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100 shadow-2xl'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-8 border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}><Icon name="gift" size={32} /></div>
            <h3 className={`text-2xl font-playfair mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-sm font-light leading-relaxed mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.welcome_popup_msg}</p>
            <div className={`p-5 rounded-2xl border mb-8 ${isDark ? 'bg-zinc-900/50 border-zinc-800/50' : 'bg-slate-50 border-slate-100'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>CUPOM</p>
              <p className={`text-2xl font-playfair tracking-wide ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>BEMVINDO10</p>
            </div>
            <button onClick={() => { setWelcomePopup(false); setUser(u => ({ ...u, hasSeenWelcome: true })); const welcomeCoupon = { id: 'welcome', val: 10, title: '🎁 BEMVINDO10', code: 'BEMVINDO10' }; setBooking(b => ({ ...b, appliedCoupon: welcomeCoupon })); setUser(prev => ({ ...prev, coupons: [...prev.coupons, welcomeCoupon] })); addToast(T.toast_coupon_success, "success"); }} className={`w-full h-14 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-200 text-zinc-900 hover:bg-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
              {T.get_coupon}
            </button>
          </div>
        </div>
      )}
      
      {levelUpPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center border ${isDark ? 'bg-zinc-950 border-amber-500/20' : 'bg-white border-slate-100 shadow-2xl'}`}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none"><div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 blur-3xl rounded-full" /></div>
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/40 animate-bounce text-white"><Icon name="trophy" size={32} /></div>
            <h3 className={`text-3xl font-playfair mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-sm font-light leading-relaxed mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.levelup_popup_msg}</p>
            <button onClick={() => setLevelUpPopup(false)} className={`w-full h-14 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-200 text-zinc-900 hover:bg-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
              Uhuul!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
