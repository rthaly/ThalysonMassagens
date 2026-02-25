import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES ESTÁTICAS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v23_pro', 
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_SECURE_V5',
  START_HOUR: 9,
  END_HOUR: 20,
  MAX_STORAGE_SIZE: 5000 
} as const;

// Ícones
const ICON_PATHS: Record<string, string> = {
  'menu': 'M4 12h16 M4 6h16 M4 18h16',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'chevron-down': 'M6 9l6 6 6-6',
  'x': 'M18 6L6 18M6 6l12 12',
  'check': 'M20 6L9 17l-5-5',
  'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01',
  'share': 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  'globe': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  'sun': 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4',
  'sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'package': 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  'layers': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'user': 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  'bed': 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
  'building': 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'car': 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M7 17v4h2v-4 M15 17v4h2v-4',
  'calendar': 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'smartphone': 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'watch': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
  'credit-card': 'M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  'banknote': 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'shower': 'M12 4v4 M12 8l-2 2 M12 8l2 2 M7.5 12.5L5 15 M14 12.5L21.5 15 M10 15l-1 4 M16 15l1 4 M4 8h16',
  'hand': 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
  'clock': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  'award': 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
  'trophy': 'M8 21h8M12 17v4m9-13.5a2.5 2.5 0 0 0-5 0v3a2.5 2.5 0 0 0 5 0v-3zM3 7.5a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-5 0v-3zM9 4.5h6',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'camera': 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'video': 'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  'copy': 'M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1 M16 3H10a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8'
};

// ==================================================================================
// 2. DESIGN SYSTEM & ESTILOS GLOBAIS
// ==================================================================================

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
    
    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    
    :root {
      --font-primary: 'Plus Jakarta Sans', sans-serif;
      --font-display: 'Playfair Display', serif;
    }

    html, body {
      background-color: ${isDark ? '#09090b' : '#fafafa'};
      color: ${isDark ? '#f4f4f5' : '#18181b'};
      transition: background-color 0.3s ease, color 0.3s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      font-family: var(--font-primary);
    }
    
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    
    .animate-slide-in { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    
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

const formatMoney = (val: number | undefined, isPT: boolean = true) => {
  if (val === undefined || isNaN(val)) return isPT ? 'R$ 0,00' : '$0.00';
  return isPT ? `R$ ${val.toFixed(2).replace('.', ',')}` : `$${val.toFixed(2)}`;
};

// Types & Interfaces
interface ServiceItem { id: string; min: number; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; popular?: boolean; }
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; loc: string; t: string; s: number; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { street: string; number: string; district: string; city: string; comp: string; placeName: string; }
interface BookingData { type: 'single' | 'pack'; item: ServiceItem | null; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; mediaAllowed: boolean; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// 3. COMPONENTES DE UI (FOCO EM CONVERSÃO E GRID)
// ==================================================================================

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.98] gap-3";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20",
    secondary: "bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-green-900/20",
    outline: "bg-transparent border border-zinc-600 text-zinc-300 hover:border-zinc-400",
    ghost: "bg-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
  };
  const sizes = { sm: "h-10 text-sm px-4", md: "h-14 text-base px-8", lg: "h-16 text-lg px-10", xl: "h-20 text-xl px-12" };
  
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} aria-label={ariaLabel} className={`${baseStyle} ${variants[variant as keyof typeof variants] || variants.primary} ${sizes[size as keyof typeof sizes]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <span className="inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></span> : <>{icon && <Icon name={icon} size={24} />}{children}</>}
    </button>
  );
});

const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, toggleLang, lang, user }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] animate-fade-in" onClick={onClose} role="presentation" />
      <aside className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-[70] p-10 shadow-2xl animate-slide-in ${isDark ? 'bg-zinc-950 text-white border-l border-zinc-800' : 'bg-white text-slate-900 border-l border-slate-100'}`}>
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-playfair font-medium">Menu</h2>
          <button onClick={onClose} className="p-3 rounded-full hover:bg-zinc-500/10 transition-colors" aria-label="Fechar menu"><Icon name="x" size={28} /></button>
        </div>
        
        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-white shadow-inner border border-zinc-700/50">
          <p className="text-xs opacity-70 uppercase font-bold tracking-widest mb-2">Seu Progresso</p>
          <div className="flex justify-between items-end">
             <span className="text-4xl font-light font-playfair">{user.xp} <span className="text-sm font-bold text-blue-400 font-sans">XP</span></span>
             <Icon name="award" className="text-blue-400" size={32} />
          </div>
        </div>

        <nav className="space-y-6">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-5 rounded-2xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-5">
              <Icon name={isDark ? "moon" : "sun"} className={isDark ? "text-blue-400" : "text-blue-600"} size={24} />
              <span className="font-medium text-lg">Interface</span>
            </div>
            <span className="text-sm font-bold opacity-50 uppercase tracking-widest">{isDark ? 'Noturna' : 'Clara'}</span>
          </button>
          
          <button onClick={toggleLang} className={`w-full flex items-center justify-between p-5 rounded-2xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-5">
              <Icon name="globe" className={isDark ? "text-emerald-400" : "text-emerald-600"} size={24} />
              <span className="font-medium text-lg">Idioma</span>
            </div>
            <span className="text-sm font-bold opacity-50 uppercase tracking-widest">{lang}</span>
          </button>
        </nav>
      </aside>
    </>
  );
});

const Card = memo(({ children, className = '', onClick, active = false, isDark = true, popular = false }: any) => (
  <div onClick={onClick} className={`relative p-8 md:p-10 rounded-[2.5rem] transition-all duration-300 flex flex-col h-full ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-2 hover:shadow-xl' : ''} ${active ? 'bg-blue-600/10 border-2 border-blue-500 shadow-blue-500/20' : isDark ? 'bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700' : 'bg-white border border-slate-200 shadow-md hover:border-slate-300'} ${className}`}>
    {popular && (
      <div className="absolute -top-4 left-8 md:left-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full shadow-lg border border-blue-500/50 z-10">
        ✦ Mais Pedida
      </div>
    )}
    {children}
  </div>
));

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text", isDark = true, hasError = false }: any) => (
  <div className="space-y-3 w-full">
    {label && <label className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{label}</label>}
    <div className="relative group">
      {icon && <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-500' : isDark ? 'text-zinc-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}><Icon name={icon} size={22} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-16 rounded-2xl outline-none text-base font-medium transition-all bg-transparent ${icon ? 'pl-14 pr-5' : 'px-5'} ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:bg-zinc-900/80' : 'border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-blue-50/50'}`} />
    </div>
  </div>
));

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`w-full h-full p-8 md:p-10 rounded-[2.5rem] transition-all duration-300 border ${isDark ? 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900/60' : 'bg-white border-slate-200 shadow-md hover:shadow-lg flex flex-col justify-between'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold font-playfair ${isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-slate-100 text-slate-600'}`}>
          {review.n.charAt(0)}
        </div>
        <div>
          <span className={`text-base font-semibold block ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{review.n}</span>
          <span className={`text-sm opacity-70 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-1 mt-1">
        {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={16} className={i < review.s ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-zinc-800' : 'text-slate-200'} />)}
      </div>
    </div>
    <p className={`text-base leading-relaxed font-light italic ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>"{review.t}"</p>
  </article>
));

const SmartTimer = memo(({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  useEffect(() => { 
    const interval = setInterval(() => setTime(prev => prev <= 0 ? 600 : prev - 1), 1000); 
    return () => clearInterval(interval); 
  }, []);
  
  const format = (t: number) => { const m = Math.floor(t / 60); const s = t % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  
  return (
    <div className={`flex items-center justify-center gap-4 p-5 rounded-2xl transition-all border ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
      <Icon name="watch" size={24} className="animate-pulse" />
      <span className="text-sm font-bold uppercase tracking-widest">{text}: <span className="font-mono text-lg ml-2">{format(time)}</span></span>
    </div>
  );
});

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800/80' : 'border-slate-200'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-8 flex items-center justify-between text-left group" aria-expanded={isOpen}>
        <span className={`text-lg font-medium pr-6 ${isDark ? 'text-zinc-200 group-hover:text-white' : 'text-slate-800 group-hover:text-black'}`}>{q}</span>
        <span className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-400' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name="chevron-down" size={24} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-8 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-base font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-6 p-6 md:p-8 rounded-3xl border border-transparent transition-colors ${isDark ? 'hover:bg-zinc-900/60' : 'hover:bg-slate-50'}`}>
    <div className={`flex-shrink-0 mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}><Icon name={rule.icon} size={28} /></div>
    <div>
      <h4 className={`text-lg font-playfair font-medium mb-2 ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{rule.title}</h4>
      <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{rule.description}</p>
    </div>
  </div>
));

// ==================================================================================
// 4. LÓGICA DE DADOS
// ==================================================================================
const sanitizeInput = (value: string): string => String(value || '').replace(/[<>&"']/g, '');
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

// ==================================================================================
// 5. MAIN APP OTIMIZADO (COM COPY SÊNIOR E ACOLHEDORA)
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
  const [manualCouponInput, setManualCouponInput] = useState(''); 
  
  const getData = useCallback((lang: string) => {
    const isPT = lang === 'pt';
    const USD_RATE = 5.75;
    const getPrice = (brl: number) => isPT ? brl : Math.round(brl / USD_RATE);
  
    const p = {
      relax: getPrice(157), sens: getPrice(177), titan: getPrice(207), nuru: getPrice(317), depil: getPrice(107), 
      packRelax: { v: getPrice(527), full: getPrice(628), save: getPrice(101) },
      packTri: { v: getPrice(517), full: getPrice(621), save: getPrice(104) },
      packMix: { v: getPrice(637), full: getPrice(768), save: getPrice(131) },
      packSupreme: { v: getPrice(567), full: getPrice(681), save: getPrice(114) },
      extras: { more_time: getPrice(77), touch: getPrice(77), aroma: getPrice(17), hair_trim: getPrice(57), pain_relief: getPrice(17) }
    };
    
    return {
      levels: [
        { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Iniciante no Cuidado" : "Self-Care Beginner" },
        { level: 2, xpNeeded: 100, reward: getPrice(15), title: isPT ? "Prioridade Certa" : "Right Priority" },
        { level: 3, xpNeeded: 350, reward: getPrice(30), title: isPT ? "Corpo Consciente" : "Conscious Body" },
        { level: 4, xpNeeded: 800, reward: getPrice(50), title: isPT ? "Plenitude Alcançada" : "Fullness Achieved" }
      ],
      services: [
        { id: 'depilacao', min: 45, price: p.depil, icon: "scissors", tag: isPT ? "CUIDADO BÁSICO" : "PERSONAL CARE", title: isPT ? "Aparo Corporal" : "Body Trimming", desc: isPT ? "Higiene e estética com máquina profissional. Um cuidado básico para quem gosta de estar sempre pronto e limpo." : "Hygiene and aesthetics with a professional machine.", details: isPT ? "Aparo uniforme no peito, costas, axilas e virilha\nSensação imediata de limpeza e leveza\nExecução rápida e respeitosa" : "Uniform trimming\nImmediate feeling of cleanliness\nQuick and respectful execution" },
        { id: 'relaxante', min: 60, price: p.relax, icon: "user-check", tag: isPT ? "ALÍVIO FÍSICO" : "PHYSICAL RELIEF", title: isPT ? "Massagem Terapêutica" : "Therapeutic Massage", desc: isPT ? "Focada em desmanchar nós de tensão nas costas e pescoço. Ideal para quem carrega o peso da rotina nas costas e quer voltar a dormir bem." : "Focused on dismantling tension knots. Ideal for heavy routines.", details: isPT ? "Pressão firme e localizada com óleos essenciais\nDesbloqueio intenso da lombar e cervical\nAlívio imediato de dores musculares\nZero foco íntimo, 100% voltada para saúde e destravamento físico" : "Firm pressure\nLower back unblocking\nImmediate pain relief\nNo intimate focus" },
        { id: 'sensitiva', min: 60, price: p.sens, icon: "sparkles", tag: isPT ? "PRAZER & DESCONEXÃO" : "PLEASURE & DISCONNECT", title: isPT ? "Tântrica Sensorial" : "Sensory Tantra", desc: isPT ? "Uma jornada de reconexão. Acorda seu corpo para sensações esquecidas, desliga a mente acelerada e te leva a um relaxamento absurdo." : "A journey of reconnection. Awakens forgotten sensations.", details: isPT ? "Toques sutis, fluidos e lentos pelo corpo todo\nEstímulo contínuo da energia vital e redirecionamento de pensamentos\nFoco em te proporcionar prazer intenso, gozo e liberação de endorfina\nAcolhimento para você soltar o controle e apenas sentir" : "Subtle, fluid touches\nContinuous energy stimulation\nFocus on intense pleasure and release\nWarmth to let go of control" },
        { id: 'mista', min: 60, price: p.titan, icon: "zap", popular: true, tag: isPT ? "EXPERIÊNCIA COMPLETA" : "FULL EXPERIENCE", title: isPT ? "Fusion Experience" : "Fusion Experience", desc: isPT ? "O melhor dos dois mundos: começa quebrando a tensão muscular pesada e termina numa explosão de prazer e relaxamento tântrico." : "The best of both worlds: breaks tension and ends with intense pleasure.", details: isPT ? "Inicia com massagem firme (terapêutica) para soltar a musculatura\nTransição fluida para o corpo a corpo sensitivo\nDescarga total de estresse e energia acumulada (foco no ápice do prazer)\nA escolha certeira para quem precisa resolver a dor e relaxar a mente" : "Starts with firm massage\nTransitions to sensory body-to-body\nTotal discharge of stress and accumulated energy\nThe right choice for pain and pleasure" },
        { id: 'nuru', min: 60, price: p.nuru, icon: "sparkles", tag: isPT ? "ENTREGA TOTAL" : "TOTAL SURRENDER", title: isPT ? "Experiência Nuru" : "Nuru Experience", desc: isPT ? "Imersão total. Deslize corpo a corpo com gel aquecido. Uma experiência sensorial profunda e quente que derrete qualquer resistência sua." : "Total immersion. Heated gel body-to-body slide.", details: isPT ? "Uso exclusivo de gel orgânico morno em todo o corpo\nContato físico contínuo, íntimo e extremamente acolhedor\nNível máximo de entrega, prazer e relaxamento físico/mental\nPara dias em que você quer se desconectar completamente do mundo" : "Exclusive use of warm organic gel\nContinuous, intimate physical contact\nMaximum level of surrender and pleasure\nFor days you want to completely disconnect" }
      ] as ServiceItem[],
      extras: [
        { id: 'hair_trim', price: p.extras.hair_trim, icon: "✂️", isEmoji: true, label: isPT ? "Aparo Extra" : "Extra Trim", desc: isPT ? "Adicionar pernas ou braços" : "Add legs or arms" },
        { id: 'more_time', price: p.extras.more_time, icon: "⏱️", isEmoji: true, label: isPT ? "Tempo Estendido" : "Extended Time", desc: isPT ? "+30 min para não ter pressa" : "+30 min to not rush" },
        { id: 'touch', price: p.extras.touch, icon: "🖐️", isEmoji: true, label: isPT ? "Interação Livre" : "Free Interaction", desc: isPT ? "Liberdade para tocar e interagir organicamente" : "Freedom to touch and interact" },
        { id: 'aroma', price: p.extras.aroma, icon: "🌸", isEmoji: true, label: isPT ? "Aromaterapia" : "Aromatherapy", desc: isPT ? "Óleos para baixar a frequência mental" : "Oils to lower mental frequency" },
        { id: 'pain_relief', price: p.extras.pain_relief, icon: "💊", isEmoji: true, label: isPT ? "Foco Analgésico" : "Pain Focus", desc: isPT ? "Pomada extra forte para áreas muito travadas" : "Extra strong cream for locked areas" }
      ],
      plans: [
        { id: 'pack_relax', type: 'pack', title: isPT ? "Ciclo Terapêutico (4x)" : "Therapeutic Cycle (4x)", price: p.packRelax.v, fullPrice: p.packRelax.full, savings: p.packRelax.save, desc: isPT ? "4 Encontros para matar a dor" : "4 Pain Relief Encounters", details: isPT ? "O estresse volta toda semana. A dor também.\nUm compromisso sério com a saúde das suas costas." : "Stress returns weekly.\nA serious commitment to your back.", tag: isPT ? "ROTINA SEM DOR" : "PAIN-FREE", icon: "package" },
        { id: 'pack_mista', type: 'pack', title: isPT ? "Ciclo Fusion (3x)" : "Fusion Cycle (3x)", price: p.packTri.v, fullPrice: p.packTri.full, savings: p.packTri.save, desc: isPT ? "3 Sessões Completas (Dor + Prazer)" : "3 Complete Sessions", details: isPT ? "Para períodos onde a carga de trabalho está insana.\nTrês imersões completas para zerar a fadiga física e mental." : "For insane workloads.\nThree immersions to reset physical/mental fatigue.", tag: isPT ? "ALTA DEMANDA" : "HIGH DEMAND", icon: "layers" },
        { id: 'pack_supreme', type: 'pack', title: isPT ? "Jornada Supreme (3x)" : "Supreme Journey (3x)", price: p.packSupreme.v, fullPrice: p.packSupreme.full, savings: p.packSupreme.save, desc: isPT ? "Terapêutica + Fusion + Nuru" : "The complete therapy", details: isPT ? "O resgate absoluto da sua vitalidade.\nUm cronograma desenhado para te fazer esquecer dos problemas e gozar muito." : "Absolute rescue of vitality.\nDesigned to make you forget problems.", tag: "✦ LUXO & PRAZER", icon: "award" },
        { id: 'pack_mix_4', type: 'pack', title: isPT ? "Pacote Premium" : "Premium Pack", price: p.packMix.v, fullPrice: p.packMix.full, savings: p.packMix.save, desc: isPT ? "Sua válvula de escape" : "Your escape valve", details: isPT ? "Uma exploração cadenciada alternando alívio e muito estímulo.\nA garantia de que você sempre terá um momento só seu no mês." : "A rhythmic exploration.\nThe guarantee of your own moment.", tag: "EXCELÊNCIA", icon: "star" }
      ] as ServiceItem[],
      faq: [
        { q: isPT ? "Como funciona a sessão Mista (Fusion)?" : "How does Fusion work?", a: isPT ? "É a junção perfeita. Primeiro, uso técnicas firmes e terapêuticas para tirar o peso dos seus ombros e destravar a lombar. Depois que seu corpo relaxa, o ambiente muda, o toque fica suave, corpo a corpo, focando em te dar muito prazer, desligar sua mente por completo e te levar a um relaxamento e gozo absurdos." : "Perfect mix. Firm techniques first to relieve pain, then shifts to soft, sensory body-to-body focusing on pleasure." },
        { q: isPT ? "Nunca fiz massagem antes, qual você indica?" : "Never had a massage, what do you recommend?", a: isPT ? "A Mista (Fusion) é sempre a campeã para iniciantes. Ela resolve a dor física chata do dia a dia e te apresenta ao relaxamento mental e ao prazer da tântrica de forma muito conduzida, acolhedora e confortável." : "Fusion is champion for beginners. Solves physical pain and introduces sensory pleasure comfortably." },
        { q: isPT ? "Como devo me preparar para o nosso encontro?" : "How should I prepare?", a: isPT ? "O ideal é tomar um banho morno e relaxante antes de eu chegar na sua casa (ou no hotel). Deixe o quarto à meia-luz, uma temperatura agradável e coloque o celular no silencioso. Pode relaxar, o resto do acolhimento é por minha conta." : "Take a warm shower before I arrive. Leave the room dimly lit, put your phone on silent. The rest is on me." },
        { q: isPT ? "O atendimento é totalmente sigiloso?" : "Is it confidential?", a: isPT ? "100%. Sou um profissional focado exclusivamente no seu bem-estar e prazer. Não exponho clientes, não julgo corpos e garanto um espaço seguro onde você pode ser você mesmo e se entregar sem medos ou amarras." : "100%. Professional focused on your well-being. Safe space to be yourself without judgment." }
      ],
      rules: isPT ? [
        { icon: "shower", title: "Higiene é Essencial", description: "O banho morno antes da sessão tira a sujeira da rua, relaxa os poros e mostra respeito mútuo. É o primeiro passo para o seu corpo receber o toque." },
        { icon: "hand", title: "Limites e Sintonia", description: "O toque é guiado pelo bom senso. Eu estou ali para te proporcionar uma experiência foda, e o seu conforto e respeito sustentam a qualidade da sessão." },
        { icon: "shield", title: "Privacidade Absoluta", description: "O que acontece na cama, fica lá. Sem perguntas invasivas, sem exposição. Seu momento de escape é sagrado e blindado." },
        { icon: "clock", title: "Meu tempo e o seu", description: "Atendo com hora marcada para não fazer ninguém esperar. Temos uma tolerância técnica de 15min, depois disso o tempo é descontado da sessão." }
      ] : [
        { icon: "shower", title: "Hygiene is Essential", description: "A warm shower beforehand removes street dirt and shows mutual respect." },
        { icon: "hand", title: "Boundaries and Connection", description: "Touch is guided by common sense. I'm there to provide an amazing experience." },
        { icon: "shield", title: "Absolute Privacy", description: "What happens in bed stays there. Your escape moment is sacred." },
        { icon: "clock", title: "My time and yours", description: "I work by appointment. 15min tolerance, then time is deducted." }
      ],
      reviews: [
        { n: "Carlos E.", loc: "Bela Vista - SP", t: isPT ? "Sempre tive dor nas costas e muito estresse acumulado. A massagem mista resolveu os dois. A parte terapêutica tirou o peso gigante dos meus ombros, e a finalização sensitiva me fez gozar e relaxar como há anos não conseguia. Nota 1000." : "The combination of relaxing and sensory massage created a perfect journey. Absurd feeling of lightness at the end.", s: 5 },
        { n: "Marcos P.", loc: "Jardins - SP", t: isPT ? "Ambiente super acolhedor, Thalyson me deixou à vontade desde o primeiro 'oi'. A Nuru é uma experiência de outro mundo. O gel quentinho e o contato corpo a corpo derreteram a minha ansiedade inteira na hora." : "The feeling of emptiness and peace I felt after the session was indescribable.", s: 5 },
        { n: "Rafael S.", loc: "Pinheiros - SP", t: isPT ? "A tântrica me ajudou a finalmente desligar a cabeça do trabalho. O toque dele é muito respeitoso, mas extremamente excitante e relaxante ao mesmo tempo. A liberação no final foi incrível, dormi como um bebê depois." : "Respectful touch, but with the right intensity. It was liberating.", s: 5 },
        { n: "Leandro V.", loc: "Centro - SP", t: isPT ? "Fui sem expectativa e saí surpreendido. Resolve a dor física com as mãos firmes no começo e entrega um prazer absurdo na parte sensitiva. O pacote Supreme vale cada centavo pra quem quer se priorizar." : "I went without expectation and left surprised. The pleasure was intense and genuine.", s: 5 }
      ],
      text: {
        welcome: isPT ? "Olá," : "Hello,",
        choose_sub: isPT ? "O peso da rotina cansa demais o corpo e a mente. Qual nível de cuidado e prazer você precisa para hoje?" : "The weight of routine exhausts. What level of decompression does your body ask for today?",
        level_label: isPT ? "Nível de Constância" : "Consistency Level",
        tab_packs: isPT ? "Ciclos de Cuidado" : "Premium Packages",
        tab_single: isPT ? "Sessão Avulsa" : "Single Session",
        next_btn: isPT ? "Garantir Meu Horário" : "Secure Slot",
        finish_btn: isPT ? "Confirmar Reserva (WhatsApp)" : "Confirm Booking via WhatsApp",
        loading: isPT ? "Arrumando o ambiente..." : "Preparing your space...",
        toast_select_item: isPT ? "Por favor, escolha a massagem que deseja fazer." : "Please select an experience",
        toast_select_date: isPT ? "Selecione o melhor dia e horário na agenda." : "Set the best date and time for your session",
        toast_fill_name: isPT ? "Preciso saber o seu nome." : "What should I call you?",
        toast_fill_addr: isPT ? "Preencha direitinho onde vou te atender." : "Please fill in the location details.",
        toast_accept_terms: isPT ? "Leia e aceite as regrinhas básicas para continuarmos." : "Please accept the code of ethics to continue.",
        toast_coupon_success: isPT ? "Presente ativado com sucesso!" : "VIP Discount applied successfully!",
        toast_coupon_invalid: isPT ? "Ops, esse código não funcionou." : "Oops, this code is not valid.",
        details_label: isPT ? "O que rola na sessão:" : "Session details",
        select_time_title: isPT ? "Sua janela de escape" : "Your decompression window",
        location_title: isPT ? "Onde vou te atender?" : "Where will we meet?",
        extras_title: isPT ? "Adicionais para a sua experiência:" : "Boost your experience:",
        coupon_section: isPT ? "Tem algum Benefício Especial?" : "Special Benefit",
        payment_title: isPT ? "Como prefere acertar no dia?" : "Payment Method (Post-Session)",
        terms_title: isPT ? "Nosso Acordo de Respeito" : "Code of Ethics and Respect",
        success_title: isPT ? "Tudo quase pronto!" : "Almost done!",
        success_sub: isPT ? "Resumo montado com sucesso. Agora é só me mandar no WhatsApp pra gente confirmar e eu travar sua vaga na minha agenda." : "Your protocol is generated. Send it to my WhatsApp to officially book it.",
        whatsapp_btn: isPT ? "Mandar Reserva no WhatsApp" : "Send Booking to WhatsApp",
        back_home: isPT ? "Refazer escolhas" : "Back to home",
        timer_text: isPT ? "Segurando essa vaga por" : "Reservation guaranteed for",
        upgrade_msg: isPT ? "Ótima escolha para o corpo! Se precisar desligar a mente também, dá uma olhada na Mista (Fusion)." : "Great choice! Check out Fusion for mental relief too.",
        input_name: isPT ? "Como quer ser chamado?" : "What should I call you?",
        input_addr: isPT ? "Sua Rua ou Avenida" : "Street or Avenue",
        input_num: isPT ? "Número da casa/prédio" : "Number",
        input_district: isPT ? "Seu Bairro" : "District",
        input_city: isPT ? "Cidade" : "City",
        input_comp: isPT ? "Complemento (Apto, Bloco)" : "Complement (Apt, Block)",
        input_hotel: isPT ? "Qual o nome do Hotel?" : "Hotel Name",
        input_room: isPT ? "Número do Quarto" : "Room Number",
        agree_terms: isPT ? "Li e aceito as regrinhas" : "I have read and agree to the Code of Ethics",
        faq_title: isPT ? "Ficou alguma dúvida?" : "Frequently Asked Questions",
        reviews_title: isPT ? "Quem já passou por minhas mãos" : "Real Experiences",
        empty_date: isPT ? "Toca num dia ali em cima pra ver meus horários livres" : "Tap a day to see availability",
        empty_slots: isPT ? "Poxa, minha agenda já lotou nesse dia. Tenta ver o dia seguinte." : "Oh, my schedule is full this day. Try the next.",
        total_label: isPT ? "Valor Final" : "Final Value",
        subtotal: isPT ? "Investimento da Sessão" : "Base Investment",
        discount: isPT ? "Desconto Especial" : "Special Discount",
        pix_discount: isPT ? "Desconto no Pix (3%)" : "Pix Discount (3%)",
        welcome_popup_title: isPT ? "Seja bem-vindo!" : "Welcome!",
        welcome_popup_msg: isPT ? "Que bom ter você aqui. Tirar um tempo para relaxar o corpo é o melhor investimento que você faz. Aqui está um presente para o nosso primeiro encontro." : "Glad to have you here. Taking time to care for your body is essential. Here is a welcome gift.",
        levelup_popup_title: isPT ? "Você Subiu de Nível!" : "Evolution Achieved!",
        levelup_popup_msg: isPT ? "Cuidar de você mesmo gerou recompensas. Acabei de liberar um novo benefício exclusivo para a nossa próxima sessão." : "Your consistency generated rewards. I just unlocked a new exclusive benefit.",
        get_coupon: isPT ? "Resgatar Meu Presente" : "Redeem My Benefit",
        rules_complete: isPT ? "Nosso acordo básico de respeito" : "Our agreement of respect",
        media_discount: isPT ? "Desconto de Portfólio (1%)" : "Portfolio Discount (1%)",
        media_title: isPT ? "Autoriza o uso de imagem? (Opcional)" : "Media Authorization (Optional)",
        media_desc: isPT ? "Autorizo fotos anônimas (apenas corpo, sem rosto ou nudez) focadas no resultado estético, unicamente para meu portfólio de trabalho." : "I authorize anonymous photos exclusively for body aesthetics portfolio.",
        media_bonus: isPT ? "Liberar para ganhar 1% OFF" : "Allow for 1% OFF",
        uber_notice: isPT ? "Sobre o Deslocamento: A taxa do meu Uber é calculada e somada no momento em que a gente for aprovar no WhatsApp, tá bom?" : "Uber: Travel fee will be calculated and informed on WhatsApp."
      }
    };
  }, []);

  const DATA = useMemo(() => getData(lang), [getData, lang]);
  const T = DATA.text;
  
  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 83, lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false
  });
  
  const dateScrollRef = useRef<HTMLDivElement>(null);
  
  // Hydration Fix & Metadata
  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
  }, []);

  useEffect(() => {
    if (isClient) {
        document.title = step === 0 ? "Thalyson Massagens - Alívio & Prazer" : "Fechando Sessão - Thalyson";
    }
  }, [step, isClient]);
  
  // Recuperação de Cache
  useEffect(() => {
    if (!isClient) return;
    
    let loadedUser = { ...user };
    let loadedBooking = { ...booking };
    let loadedStep = 0;

    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        if (parsed.user && typeof parsed.user === 'object') {
          loadedUser = {
            name: parsed.user.name || '',
            xp: typeof parsed.user.xp === 'number' ? parsed.user.xp : 0,
            coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
            usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
            hasSeenWelcome: typeof parsed.user.hasSeenWelcome === 'boolean' ? parsed.user.hasSeenWelcome : false,
            ordersCount: typeof parsed.user.ordersCount === 'number' ? Math.max(parsed.user.ordersCount, 83) : 83,
            lastActivity: parsed.user.lastActivity || new Date().toISOString()
          };
        }
        
        let draftItemExists = false;
        if (parsed.bookingDraft && parsed.bookingDraft.item && parsed.bookingDraft.item.id) {
           const allServices = [...DATA.services, ...DATA.plans];
           draftItemExists = allServices.some(s => s.id === parsed.bookingDraft.item.id);
        }

        if (draftItemExists && parsed.bookingDraft) {
          const draftDate = parsed.bookingDraft.date ? new Date(parsed.bookingDraft.date) : null;
          if (draftDate && draftDate > new Date()) {
            loadedBooking = {
              ...booking,
              ...parsed.bookingDraft,
              extras: typeof parsed.bookingDraft.extras === 'object' && parsed.bookingDraft.extras !== null ? parsed.bookingDraft.extras : {},
              mediaAllowed: parsed.bookingDraft.mediaAllowed || false,
              address: { 
                street: sanitizeInput(parsed.bookingDraft.address?.street || ''), 
                number: sanitizeInput(parsed.bookingDraft.address?.number || ''), 
                district: sanitizeInput(parsed.bookingDraft.address?.district || ''), 
                city: sanitizeInput(parsed.bookingDraft.address?.city || ''), 
                comp: sanitizeInput(parsed.bookingDraft.address?.comp || ''), 
                placeName: sanitizeInput(parsed.bookingDraft.address?.placeName || '') 
              }
            };
            
            if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) {
              loadedStep = parsed.step;
            }
          }
        }
      }
    } catch (e) {
      console.error('Cache inválido, iniciando limpo.', e);
      loadedStep = 0;
    }
    
    setUser(loadedUser);
    setBooking(loadedBooking);
    setStep(loadedStep);
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, DATA.services, DATA.plans]);
  
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
      const timer = setTimeout(() => setWelcomePopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded, welcomePopup]);
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);
  
  const handleSelectItem = useCallback((type: 'single' | 'pack', item: ServiceItem) => {
    setBooking(prev => ({ ...prev, type, item, extras: {}, payment: '', termsAccepted: false, bookingId: `BOOK_${Date.now()}` }));
    if (item.id === 'relaxante') addToast(DATA.text.upgrade_msg, "success");
    setTimeout(() => setStep(1), 250);
  }, [addToast, DATA.text.upgrade_msg]);
  
  const applyManualCoupon = () => {
    const code = manualCouponInput.toUpperCase().trim();
    if (code === 'BEMVINDO10' || code === 'THALY10') {
      setBooking(b => ({ ...b, appliedCoupon: { id: 'manual', val: 10, title: `🛡️ ${code}`, code } }));
      addToast(T.toast_coupon_success, "success");
      setManualCouponInput('');
    } else {
      addToast(T.toast_coupon_invalid, "error");
    }
  };

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
    Object.keys(booking.extras || {}).forEach(k => { 
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
    if (currentXP >= 800) return { needed: 500 - ((currentXP - 800) % 500), reward: 50, title: "Plenitude Alcançada Plus" };
    const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
    return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };
  
  const nextLevelInfo = getNextLevelInfo(user.xp);

  const getCurrentLevelProgress = () => {
    if (user.xp >= 800) return ((user.xp - 800) % 500 / 500) * 100;
    const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
    const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
    const currentLevel = DATA.levels[realIndex]; const nextLevel = DATA.levels[realIndex + 1];
    if (!nextLevel) return 100; return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };
  
  const generateWhatsAppMsg = () => {
    const f = financials; const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : '';
    const securityHash = btoa(encodeURIComponent(`${f.total}-${dateStr}-${booking.item?.id || ''}-${CONFIG.SECRET_TOKEN}`)).substring(0, 8).toUpperCase();
    let serviceTitle = booking.item?.title || ''; if (booking.type !== 'single' && booking.item?.desc) serviceTitle += ` ${lang === 'pt' ? '(Pacote Fechado)' : '(Premium Journey)'}`;
    
    let locTxt = ""; let mapQuery = "";
    if (booking.locationType === 'home') { 
      const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`; 
      locTxt = `🏠 *${lang === 'pt' ? 'Residência' : 'Home'}*\n📍 ${fullAddr}\n📝 ${lang === 'pt' ? 'Dados Extras' : 'Unit'}: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    else if (booking.locationType === 'motel') { 
      locTxt = `🏩 *Suíte/Motel*\n⚠️ (${lang === 'pt' ? 'Reserva do local por conta do cliente' : 'Venue fee on client'})`; 
    }
    else { 
      const fullAddr = `${booking.address.placeName}, ${booking.address.city}`; 
      locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 ${lang === 'pt' ? 'Quarto/Suíte' : 'Room'}: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    
    const extrasList = Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => { 
      const ex = DATA.extras.find(e => e.id === k); 
      if (!ex) return ''; 
      return `✅ ${ex.label} (+${formatMoney(booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price, lang === 'pt')})`; 
    }).filter(Boolean).join('\n');
    
    let priceDetails = `💵 *${lang === 'pt' ? 'Sessão Base' : 'Base'} (${serviceTitle}):* ${formatMoney(booking.item?.price || 0, lang === 'pt')}`;
    if (f.disc > 0) priceDetails += `\n📉 *${lang === 'pt' ? 'Presente/Desconto' : 'Coupon'} (${booking.appliedCoupon?.code}):* -${formatMoney(f.disc, lang === 'pt')}`;
    if (f.mediaDisc > 0) priceDetails += `\n📸 *${lang === 'pt' ? 'Autorização de Mídia (1%)' : 'Media (1%)'}:* -${formatMoney(f.mediaDisc, lang === 'pt')}`;
    if (f.pixDisc > 0) priceDetails += `\n💸 *Desconto PIX (3%):* -${formatMoney(f.pixDisc, lang === 'pt')}`;
    priceDetails += `\n\n💰 *VALOR FINAL: ${formatMoney(f.total, lang === 'pt')}*`;
    
    return `
*${lang === 'pt' ? 'FECHAMENTO DE SESSÃO' : 'NEW VIP BOOKING'}* | #${securityHash}
──────────────────
👤 *${lang === 'pt' ? 'Nome' : 'Client'}:* ${sanitizeInput(user.name)}
📅 *${lang === 'pt' ? 'Data' : 'Date'}:* ${dateStr}
⏰ *${lang === 'pt' ? 'Horário' : 'Time'}:* ${booking.time}

💆‍♂️ *${lang === 'pt' ? 'O QUE VAMOS FAZER' : 'SESSION'}:*
*${serviceTitle}*
${extrasList ? `\n➕ *${lang === 'pt' ? 'POTENCIALIZADORES' : 'ADD-ONS'}:*\n${extrasList}` : ''}

📍 *${lang === 'pt' ? 'ONDE SERÁ' : 'LOCATION'}:*
${locTxt}
${mapQuery ? `🔗 GPS: http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(mapQuery)}` : ''}

🚗 *${lang === 'pt' ? 'UBER/DESLOCAMENTO' : 'TRANSPORT (UBER)'}:*
*${lang === 'pt' ? 'Vamos somar agora na aprovação!' : 'To be agreed separately'}*

💰 *${lang === 'pt' ? 'ACERTO FINANCEIRO' : 'FINANCIAL SUMMARY'}:*
${priceDetails}

💳 *${lang === 'pt' ? 'Forma de Pgto' : 'Payment'}:* ${booking.payment.toUpperCase()}
──────────────────
*Aguardando sua aprovação para travar a agenda.*
    `.trim();
  };

  const generateWhatsAppLink = () => `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(generateWhatsAppMsg())}`;
  
  const copyToClipboard = () => { 
    navigator.clipboard.writeText(generateWhatsAppMsg()); 
    addToast(lang === 'pt' ? "Resumo copiado!" : "Summary copied!", "success"); 
  };
  
  const isStepValid = useCallback(() => {
    if (step === 0) return !!booking.item;
    if (step === 1) return !!(booking.date && booking.time);
    if (step === 2) {
      if (!user.name || String(user.name).trim().length < 3) return false;
      if (booking.locationType === 'home') return validateAddress(booking.address);
      if (booking.locationType === 'hotel') return !!(booking.address.placeName && booking.address.city);
      return true;
    }
    if (step === 3) return !!(booking.payment && booking.termsAccepted);
    return true;
  }, [step, booking, user.name]);
  
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
    
    const newOrdersCount = (user.ordersCount || 83) + 1;
    
    setUser(prev => ({ 
      ...prev, 
      xp: newXP, 
      coupons: updatedCoupons, 
      usedCoupons: updatedHistory, 
      ordersCount: newOrdersCount, 
      lastActivity: new Date().toISOString() 
    }));
    
    if (leveledUp) { 
      setLevelUpPopup(true); 
      setTimeout(() => addToast(`${T.levelup_popup_title} ${newLevelTitle}!`, "success"), 500); 
    }
    
    window.open(generateWhatsAppLink(), '_blank');
    setStep(4);
  };
  
  const scrollDates = (dir: 'left' | 'right') => { 
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' }); 
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
  
  if (!isClient) return <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center" />;
  
  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center max-w-xs w-full px-8">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-5xl font-playfair mb-10 animate-bounce shadow-xl shadow-blue-500/30">
            T
          </div>
          <div className="w-full h-2 bg-zinc-800/20 overflow-hidden mb-5 rounded-full">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%', animation: 'loading-bar 1.5s ease-in-out infinite' }}></div>
          </div>
          <p className="text-xs uppercase font-bold tracking-widest opacity-60">{T.loading}</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}} />
      </div>
    );
  }
  
  return (
    <>
      <GlobalStyles isDark={isDark} />
      
      <div className={`fixed inset-0 z-[-1] pointer-events-none transition-colors duration-500 ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`} aria-hidden="true" />
      
      {/* Notificações no topo */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none px-6 w-full max-w-md">
        {toasts.map(t => (
          <div key={t.id} role="alert" className={`pointer-events-auto flex items-center gap-4 px-6 py-5 rounded-[2rem] border backdrop-blur-2xl shadow-2xl animate-fade-in ${t.type === 'success' ? isDark ? 'bg-zinc-800/95 border-zinc-700 text-zinc-100' : 'bg-white/95 border-slate-200 text-slate-800' : 'bg-red-500/95 border-red-500 text-white'}`}>
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={24} />
            <span className="text-sm font-semibold tracking-wide">{t.msg}</span>
          </div>
        ))}
      </div>
      
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} toggleLang={() => setLang(l => l === 'pt' ? 'en' : 'pt')} lang={lang} user={user} />

      <main className="min-h-screen relative z-10 pb-48 px-6 md:px-14 max-w-6xl mx-auto selection:bg-blue-500/30 selection:text-blue-200">
        {step !== 4 && (
          <header className="pt-12 pb-10">
            <div className="flex items-start justify-between">
              <div className="flex flex-col cursor-pointer transition-opacity hover:opacity-80" onClick={() => setStep(0)} title="Voltar ao Início">
                <h1 className={`text-4xl font-playfair tracking-tight font-medium ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Thalyson <br className="block md:hidden" /> Massagens
                </h1>
                <div className="flex items-center gap-3 text-xs text-zinc-500 uppercase tracking-widest mt-4 font-bold">
                  <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>
                  {user.ordersCount || 83} Vidas Reestruturadas
                </div>
              </div>
              <div className="flex items-center gap-6">
                {step > 0 && (
                  <button onClick={() => setStep(0)} className={`hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-700'}`}>
                    Menu Central
                  </button>
                )}
                <button onClick={() => setMenuOpen(true)} className={`w-14 h-14 flex items-center justify-center rounded-[1.5rem] transition-all border shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                   <Icon name="menu" size={24} />
                </button>
              </div>
            </div>
            
            {/* Steps Visual */}
            {step > 0 && step < 4 && (
              <div className="mt-16 flex items-center justify-between gap-4 max-w-lg mx-auto">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4">
                    <div className={`w-full h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${step >= i ? isDark ? 'text-zinc-100' : 'text-slate-900' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                      {i === 1 ? 'Data/Hora' : i === 2 ? 'Local' : 'Resumo'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </header>
        )}
        
        <div className="space-y-16">
          {step === 0 && (
            <section className="space-y-16 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-6">
                <div>
                  <h2 className={`text-5xl md:text-6xl font-playfair font-medium leading-[1.1] mb-8 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    {T.welcome} <span className="font-italic text-blue-500">{user.name ? String(user.name).trim().split(' ')[0] : (isPT ? "Priorize-se" : "Visitor")}.</span>
                  </h2>
                  <p className={`text-lg md:text-xl font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {T.choose_sub}
                  </p>
                </div>
                
                <div className={`p-10 md:p-12 rounded-[3rem] border transition-colors ${isDark ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40 hover:border-slate-300'}`}>
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-6">
                      <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center border shadow-inner ${isDark ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 text-yellow-500' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 text-yellow-600'}`}>
                        <Icon name="award" size={32} />
                      </div>
                      <div>
                        <span className={`text-[11px] uppercase font-bold tracking-widest block mb-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          {T.level_label}
                        </span>
                        <h3 className={`text-2xl font-playfair font-medium ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                          {user.xp >= 800 ? "Plenitude Alcançada Plus" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-5xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-zinc-100 to-zinc-400' : 'from-slate-700 to-slate-900'}`}>{user.xp}</span>
                      <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest block mt-2">XP Atual</span>
                    </div>
                  </div>
                  <div>
                    <div className={`flex justify-between text-[11px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      <span>Progresso da Constância</span>
                      <span>{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800/80' : 'bg-slate-200'}`} role="progressbar" aria-valuenow={getCurrentLevelProgress()} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full bg-blue-500 transition-all duration-1000 ease-out relative" style={{ width: `${getCurrentLevelProgress()}%` }}>
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    {nextLevelInfo && (
                      <p className={`text-sm mt-6 text-center font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        Faltam apenas {nextLevelInfo.needed} XP para garantir um presente de <span className="text-blue-500">+{formatMoney(nextLevelInfo.reward, isPT)}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Abas */}
              <div className={`flex p-2 rounded-[2rem] border max-w-xl mx-auto shadow-inner ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-100 border-slate-200/80'}`} role="tablist">
                <button role="tab" aria-selected={activeTab === 'single'} onClick={() => setActiveTab('single')} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] text-[13px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="user" size={20} /> {T.tab_single}
                </button>
                <button role="tab" aria-selected={activeTab === 'packs'} onClick={() => setActiveTab('packs')} className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] text-[13px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'packs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="package" size={20} /> {T.tab_packs}
                </button>
              </div>
              
              {/* Cards de Serviço (GRID OTIMIZADO) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => (
                  <Card key={s.id} active={booking.item?.id === s.id} onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : 'pack', s)} isDark={isDark} popular={s.popular}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-8">
                        <div className={`w-16 h-16 flex items-center justify-center rounded-[2rem] border shadow-sm ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-700'}`}>
                          <Icon name={s.icon} size={28} isEmoji={s.isEmoji} />
                        </div>
                        <div className="text-right">
                          {s.fullPrice && (
                            <span className={`text-[11px] block mb-1 font-inter uppercase tracking-widest font-bold ${isDark ? 'text-red-400/80' : 'text-red-500/80'}`}>
                              De: <span className="line-through">{formatMoney(s.fullPrice, isPT)}</span>
                            </span>
                          )}
                          <span className={`text-3xl font-playfair font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {formatMoney(s.price, isPT)}
                          </span>
                          {s.savings && (
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full block mt-3 border ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                              ECONOMIA: {formatMoney(s.savings, isPT)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <span className={`text-[10px] font-bold uppercase tracking-widest border px-4 py-2 rounded-full inline-block mb-5 ${isDark ? 'bg-zinc-800/80 border-zinc-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                          {s.tag}
                        </span>
                        <h3 className={`text-2xl font-playfair font-medium mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                          {s.title}
                        </h3>
                        <p className={`text-base font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`pt-6 border-t ${isDark ? 'border-zinc-800/80' : 'border-slate-200'}`}>
                      <div className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-300' : 'text-slate-500'}`}>
                        <Icon name="check" size={16} className="text-emerald-500" /> {T.details_label}
                      </div>
                      <div className={`text-sm space-y-3.5 font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {s.details.split('\n').map((line, i) => <p key={i} className="flex items-start gap-2.5"><span className="text-blue-500 mt-0.5 text-lg leading-none">•</span> <span>{line}</span></p>)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Reviews */}
              <div className="py-20 relative">
                <div className="flex items-center justify-between mb-10 px-4">
                  <h3 className={`text-3xl font-playfair font-medium ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                    {T.reviews_title}
                  </h3>
                  <div className="hidden md:flex gap-4">
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: -400, behavior: 'smooth' })} className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 shadow-sm hover:shadow-md'}`}><Icon name="chevron-left" size={24} /></button>
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: 400, behavior: 'smooth' })} className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 shadow-sm hover:shadow-md'}`}><Icon name="chevron-right" size={24} /></button>
                  </div>
                </div>
                <div id="reviews-slider" className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-10 -mx-6 px-6 gap-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center flex-shrink-0 w-[85vw] md:w-[420px]">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* FAQ */}
              <div className="max-w-4xl mx-auto py-16">
                <h3 className={`text-3xl font-playfair font-medium text-center mb-12 ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                  {T.faq_title}
                </h3>
                <div className={`border-t border-b ${isDark ? 'border-zinc-800/80' : 'border-slate-200'}`}>
                  {DATA.faq.map((item, idx) => <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />)}
                </div>
              </div>
            </section>
          )}
          
          {step === 1 && (
            <section className="space-y-12 animate-fade-in max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className={`text-4xl font-playfair font-medium mb-6 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  {T.select_time_title}
                </h2>
                <p className={`text-base font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {T.toast_select_date}
                </p>
              </div>
              
              <div className={`p-8 rounded-[2.5rem] flex items-center justify-between border shadow-md ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200'}`}>
                 <div className="flex flex-col gap-1">
                   <span className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Escolha de hoje</span>
                   <span className={`text-xl font-semibold font-playfair ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{booking.item?.title}</span>
                 </div>
                 <button onClick={() => setStep(0)} className={`text-xs uppercase font-bold tracking-widest px-6 py-3 rounded-full transition-colors border ${isDark ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>Alterar Sessão</button>
              </div>

              <div className="relative mt-16">
                <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-16 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full transition-all border shadow-lg ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><Icon name="chevron-left" size={24} /></button>
                
                <div ref={dateScrollRef} className="flex gap-5 overflow-x-auto px-4 py-6 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const monthName = d.toLocaleDateString(isPT ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' }).replace('.', '');
                    return (
                      <div key={idx} className="snap-center">
                        <button onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))} className={`w-[110px] h-[130px] rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all duration-300 border ${isSel ? 'bg-blue-600 border-blue-500 text-white scale-[1.05] shadow-xl shadow-blue-900/40' : isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/80' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                          <span className={`text-[11px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-100' : 'opacity-60'}`}>{monthName}</span>
                          <span className="text-3xl font-bold font-playfair">{d.getDate()}</span>
                          <span className={`text-[11px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-200' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{getDayLabel(d)}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-16 top-1/2 -translate-y-1/2 z-20 w-14 h-14 items-center justify-center rounded-full transition-all border shadow-lg ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><Icon name="chevron-right" size={24} /></button>
              </div>
              
              {!booking.date && (
                <div className={`text-center py-24 rounded-[3rem] border border-dashed flex flex-col items-center justify-center gap-5 mt-10 transition-colors ${isDark ? 'border-zinc-800 bg-zinc-900/30 text-zinc-500' : 'border-slate-300 bg-slate-50/50 text-slate-400'}`}>
                  <Icon name="calendar" size={48} className="opacity-50" />
                  <p className="text-sm font-bold uppercase tracking-widest">{T.empty_date}</p>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="mt-16 animate-fade-in">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className={`text-base font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Minha Agenda</h4>
                    <span className="text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 px-4 py-1.5 rounded-full animate-pulse">Alta Procura</span>
                  </div>
                  <div className="grid grid-cols-2 min-[380px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 md:gap-6">
                    {generateTimeSlots.map((t) => (
                      <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))} className={`py-5 rounded-2xl text-base font-bold transition-all duration-300 border ${booking.time === t ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30 scale-105' : isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/80' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-20 rounded-[3rem] border mt-10 ${isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <p className="text-base font-medium tracking-wide">{T.empty_slots}</p>
                </div>
              )}
            </section>
          )}
          
          {step === 2 && (
            <section className="space-y-16 animate-fade-in max-w-4xl mx-auto">
              <h2 className={`text-4xl font-playfair font-medium text-center ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { id: 'home', label: isPT ? 'Sua Casa/Apto' : 'Home', icon: 'home' },
                  { id: 'motel', label: 'Suíte/Motel', icon: 'bed' },
                  { id: 'hotel', label: 'Hotel', icon: 'building' }
                ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))} className={`py-10 px-6 rounded-[2.5rem] flex flex-col items-center gap-6 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/30 -translate-y-2' : isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 shadow-md'}`}>
                    <Icon name={x.icon} size={36} />
                    <span className="text-xs font-bold uppercase tracking-widest text-center px-2">{x.label}</span>
                  </button>
                ))}
              </div>
              
              <div className={`p-10 md:p-14 rounded-[3rem] border shadow-md transition-colors ${isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-slate-100'} space-y-10`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder={isPT ? "Seu nome ou como prefere ser chamado" : "Your name"} hasError={!user.name || String(user.name).trim().length < 3} />
                
                {booking.locationType === 'home' && (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px] gap-6">
                      <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} icon="map-pin" placeholder={isPT ? "Avenida / Rua" : "Street"} hasError={!booking.address.street} />
                      <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Nº" type="tel" hasError={!booking.address.number} />
                    </div>
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Bairro" : "District"} hasError={!booking.address.district} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Sua Cidade" : "City"} hasError={!booking.address.city} />
                      <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Apto / Bloco (Opcional)" : "Apt 10"} />
                    </div>
                  </div>
                )}
                
                {booking.locationType === 'hotel' && (
                  <div className="space-y-8 animate-fade-in">
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder={isPT ? "Nome exato do Hotel" : "Hotel name"} hasError={!booking.address.placeName} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Cidade onde o hotel fica" : "City"} hasError={!booking.address.city} />
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Nº do Quarto / Reserva em nome de quem?" />
                  </div>
                )}
                
                {booking.locationType === 'motel' && (
                  <div className={`p-10 rounded-3xl border text-center animate-fade-in ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'} flex flex-col items-center gap-5`}>
                    <Icon name="shield" size={36} className={isDark ? 'text-zinc-500' : 'text-slate-400'} />
                    <p className={`text-base font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                      {T.uber_notice.split(':')[0]} garantido. <br/>Lembre-se de reservar a suíte com antecedência. Os custos e escolha do local ficam por conta de quem contrata a sessão.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-6">
                <h3 className={`text-sm font-bold uppercase mb-8 tracking-widest pl-2 flex items-center gap-3 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <Icon name="sparkles" size={18} className="text-blue-500" /> {T.extras_title}
                </h3>
                <div className="space-y-5">
                  {DATA.extras.map((ex) => {
                    const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                    const isActive = booking.extras[ex.id];
                    return (
                      <div key={ex.id} onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))} className={`flex items-center justify-between p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-300 ${isActive ? 'bg-blue-600/10 border-blue-500 shadow-lg shadow-blue-900/20' : isDark ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'} group`} role="checkbox" aria-checked={isActive}>
                        <div className="flex items-center gap-6">
                          <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}><Icon name={ex.icon} size={32} isEmoji={ex.isEmoji} /></div>
                          <div>
                            <p className={`text-base md:text-lg font-semibold ${isActive ? isDark ? 'text-blue-400' : 'text-blue-700' : isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{ex.label}</p>
                            <p className={`text-sm font-light mt-1.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{ex.desc}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-xs font-bold tracking-widest px-5 py-2.5 rounded-full transition-colors ${isActive ? 'bg-blue-500 text-white' : isDark ? 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}`}>
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
            <section className="space-y-12 animate-fade-in max-w-5xl mx-auto">
              <SmartTimer isDark={isDark} text={T.timer_text} />
              
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
                <div className={`p-10 md:p-14 rounded-[3rem] border shadow-md flex flex-col justify-between ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-100'}`}>
                  <div>
                    <h3 className={`text-3xl font-playfair font-medium mb-10 flex items-center gap-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                      <Icon name="file-text" size={32} className="text-blue-500" /> O que combinamos
                    </h3>
                    <div className="space-y-10">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className={`text-[11px] uppercase font-bold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                            O SEU CUIDADO DE HOJE
                          </p>
                          <h4 className={`text-2xl font-playfair font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                            {booking.item ? (DATA.services.find(s => s.id === booking.item?.id) || DATA.plans.find(p => p.id === booking.item?.id))?.title : ''}
                          </h4>
                          <div className={`flex items-center gap-3 text-sm font-medium mt-5 border px-5 py-3 rounded-full w-fit shadow-sm ${isDark ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                            <Icon name="calendar" size={18} className="text-blue-500" />
                            {booking.date ? new Date(booking.date).toLocaleDateString(isPT ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : ''} às {booking.time}
                          </div>
                        </div>
                        <span className={`text-3xl font-medium font-playfair ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                          {formatMoney(financials.sub, isPT)}
                        </span>
                      </div>
                      
                      {Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).length > 0 && (
                        <div className={`pt-10 border-t ${isDark ? 'border-zinc-800/80' : 'border-slate-200'}`}>
                          <p className={`text-[11px] uppercase font-bold tracking-widest mb-6 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                            POTENCIALIZADORES ADICIONADOS
                          </p>
                          <div className="space-y-5">
                            {Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => {
                              const ex = DATA.extras.find(e => e.id === k);
                              if (!ex) return null;
                              const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                              return (
                                <div key={k} className="flex justify-between text-base font-medium">
                                  <span className={`flex items-center gap-3 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                     <Icon name="check" size={18} className="text-blue-500" /> {ex.label}
                                  </span>
                                  <span className={isDark ? 'text-zinc-100' : 'text-slate-900'}>+ {formatMoney(price, isPT)}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`py-8 my-8 border-y border-dashed ${isDark ? 'border-zinc-800' : 'border-slate-300'}`}>
                    <div className="flex justify-between mb-5">
                      <span className={`text-base font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.subtotal}</span>
                      <span className={`text-base font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                        {formatMoney(financials.sub, isPT)}
                      </span>
                    </div>
                    
                    {financials.disc > 0 && (
                      <div className="flex justify-between mb-5 text-emerald-500 font-medium">
                        <span className="text-base">Seu Presente ({booking.appliedCoupon?.code})</span>
                        <span className="text-base">- {formatMoney(financials.disc, isPT)}</span>
                      </div>
                    )}

                    {financials.mediaDisc > 0 && (
                      <div className="flex justify-between mb-5 text-blue-400 font-medium">
                        <span className="text-base">{T.media_discount}</span>
                        <span className="text-base">- {formatMoney(financials.mediaDisc, isPT)}</span>
                      </div>
                    )}
                    
                    {financials.pixDisc > 0 && (
                      <div className={`flex justify-between mb-5 font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        <span className="text-base">{T.pix_discount}</span>
                        <span className="text-base">- {formatMoney(financials.pixDisc, isPT)}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-6">
                      <span className={`text-base uppercase tracking-widest font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.total_label}</span>
                      <div className="text-right">
                        <span className={`text-6xl md:text-7xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'}`}>
                          {formatMoney(financials.total, isPT)}
                        </span>
                        <div className={`flex items-center justify-end gap-2 text-[11px] uppercase tracking-widest font-bold mt-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                          <Icon name="sparkles" size={16} /> VOCÊ GARANTE +{estimatedXP} XP NESTA SESSÃO
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-6 rounded-2xl border flex items-start gap-5 text-sm font-medium leading-relaxed ${isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-400' : 'bg-blue-50/80 border-blue-100 text-blue-800'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-blue-100 text-blue-600'}`}>
                          <Icon name="car" size={20} />
                        </div>
                        <span className="mt-1.5">{T.uber_notice}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-10">
                  {/* Cupom Section */}
                  <div className={`p-10 rounded-[3rem] border shadow-md ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-100'}`}>
                    <h3 className={`text-xl font-playfair font-medium mb-8 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                      {T.coupon_section}
                    </h3>
                    
                    <div className="flex gap-4 mb-8">
                      <input type="text" value={manualCouponInput} onChange={(e) => setManualCouponInput(e.target.value)} placeholder="Código" className={`flex-1 h-14 px-6 rounded-2xl text-base outline-none font-mono uppercase transition-all bg-transparent border ${isDark ? 'border-zinc-700 focus:border-blue-500 text-zinc-100 placeholder:text-zinc-600' : 'border-slate-300 focus:border-blue-500 text-slate-900 placeholder:text-slate-400'}`} />
                      <button onClick={applyManualCoupon} className={`px-8 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/30' : 'bg-slate-900 text-white hover:bg-black shadow-md'}`}>Aplicar</button>
                    </div>

                    {user.coupons.length > 0 && (
                      <div className={`flex flex-wrap gap-3 pt-8 border-t ${isDark ? 'border-zinc-800/80' : 'border-slate-200'}`}>
                        {user.coupons.map(c => (
                          <button key={c.id} onClick={() => setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))} className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all border ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-900/30' : isDark ? 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 shadow-sm'}`}>
                            {c.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media Permission */}
                  <div className={`p-10 rounded-[3rem] border shadow-md ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-100'}`}>
                      <div className="flex items-start gap-6">
                        <div className={`mt-1 p-3 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}><Icon name={booking.mediaAllowed ? 'camera' : 'video'} size={24} /></div>
                        <div className="flex-1">
                           <h3 className={`text-xl font-playfair font-medium mb-4 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.media_title}</h3>
                           <p className={`text-sm font-light leading-relaxed mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.media_desc}</p>
                           <button onClick={() => setBooking(b => ({ ...b, mediaAllowed: !b.mediaAllowed }))} className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all text-[11px] md:text-xs font-bold uppercase tracking-widest ${booking.mediaAllowed ? 'bg-blue-600/10 border-blue-500 text-blue-500' : isDark ? 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 shadow-sm'}`}>
                              <span>{booking.mediaAllowed ? 'Autorização Concedida' : 'Autorizar Anonimamente'}</span>
                              {booking.mediaAllowed ? <div className="flex items-center gap-2"><Icon name="check" size={20} /></div> : <span className={`text-[10px] px-4 py-1.5 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>{T.media_bonus}</span>}
                           </button>
                        </div>
                      </div>
                  </div>
                  
                  {/* Payment */}
                  <div className={`p-10 rounded-[3rem] border shadow-md ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-slate-100'}`}>
                    <h3 className={`text-xl font-playfair font-medium mb-8 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.payment_title}</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'pix', label: 'Pix (3% OFF)', icon: 'smartphone' },
                        { id: 'card', label: isPT ? 'Cartão' : 'Card', icon: 'credit-card' },
                        { id: 'money', label: isPT ? 'Dinheiro' : 'Cash', icon: 'banknote' }
                      ].map(p => (
                        <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))} className={`w-full flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 ${booking.payment === p.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/30 scale-[1.03]' : isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm'}`}>
                          <Icon name={p.icon} size={26} />
                          <span className="text-sm font-bold uppercase tracking-widest flex-1 text-left">{p.label}</span>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${booking.payment === p.id ? 'border-white bg-blue-500' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                             {booking.payment === p.id && <div className="w-3 h-3 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className={`mt-8 p-5 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-widest ${isDark ? 'bg-zinc-900/80 text-zinc-500' : 'bg-slate-50 text-slate-400'}`}>
                      <Icon name="shield" size={18} /> Acerto feito só lá no momento. Fique tranquilo.
                    </div>
                  </div>
                  
                  {/* Terms */}
                  <div onClick={() => setTermsOpen(true)} className={`flex items-center justify-between p-10 rounded-[3rem] border cursor-pointer transition-all duration-300 ${booking.termsAccepted ? 'bg-emerald-500/10 border-emerald-500/50' : isDark ? 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-md'}`}>
                    <div className="flex items-center gap-6">
                      <div className={`${booking.termsAccepted ? 'text-emerald-500' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name="shield" size={32} /></div>
                      <div>
                        <span className={`text-lg font-semibold block mb-2 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.terms_title}</span>
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Clique, leia e concorde</span>
                      </div>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted })); }} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-white' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                      {booking.termsAccepted && <Icon name="check" size={20} />}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {step === 4 && (
            <section className="min-h-[75vh] flex flex-col items-center justify-center text-center animate-fade-in max-w-xl mx-auto px-4">
              <div className="relative mb-14">
                <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full scale-150 animate-pulse" />
                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center border-4 shadow-2xl ${isDark ? 'bg-zinc-900 border-zinc-800 text-blue-500' : 'bg-white border-slate-100 text-blue-600'}`}>
                  <Icon name="check" size={56} />
                </div>
              </div>
              <h2 className={`text-5xl font-playfair font-medium mb-6 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-lg font-light leading-relaxed mb-14 px-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.success_sub}</p>
              
              <div className="flex flex-col gap-6 w-full">
                <Button variant="whatsapp" size="xl" full icon="message" onClick={() => window.open(generateWhatsAppLink(), '_blank')}>{T.whatsapp_btn}</Button>
                <Button variant="secondary" size="lg" full icon="copy" onClick={copyToClipboard}>Copiar Resumo Oficial</Button>
                <button onClick={() => { setStep(0); setBooking({ ...booking, item: null, type: 'single', termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false }); }} className={`mt-8 text-xs font-bold uppercase tracking-widest transition-colors py-4 ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {/* Footer Navigation (Premium Fixed Bar) */}
      {step > 0 && step < 4 && booking.item && (
        <nav className="fixed bottom-0 left-0 right-0 p-6 md:p-8 z-40 animate-fade-in pointer-events-none">
          <div className={`max-w-5xl mx-auto rounded-[2.5rem] p-4 md:p-5 border backdrop-blur-2xl pointer-events-auto flex justify-between items-center transition-all shadow-2xl ${isDark ? 'bg-zinc-950/90 border-zinc-800 shadow-black/80' : 'bg-white/95 border-slate-200 shadow-slate-300/80'}`}>
            <button onClick={() => { setStep(s => s - 1); }} className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full transition-colors border border-transparent ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200'}`} aria-label="Voltar Etapa">
              <Icon name="chevron-left" size={28} />
            </button>
            
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{step === 3 ? T.total_label : T.subtotal}</p>
              <p className={`text-2xl md:text-3xl font-playfair font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{step === 3 ? formatMoney(financials.total, isPT) : formatMoney(financials.sub, isPT)}</p>
            </div>
            
            <button onClick={handleNextStep} disabled={!isStepValid()} className={`h-14 md:h-16 px-8 md:px-10 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest flex items-center gap-4 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/60 hover:-translate-y-1' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/30 hover:-translate-y-1'}`}>
              {step === 3 ? T.finish_btn : T.next_btn} <Icon name="chevron-right" size={20} />
            </button>
          </div>
        </nav>
      )}
      
      {/* Modal Termos */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-2xl max-h-[85vh] rounded-[3.5rem] p-10 md:p-14 flex flex-col border shadow-2xl shadow-black/80 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100'}`}>
            <button onClick={() => setTermsOpen(false)} className={`absolute top-8 right-8 p-3 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-500' : 'hover:bg-slate-50 text-slate-400'}`} aria-label="Fechar"><Icon name="x" size={28} /></button>
            <h3 className={`text-3xl font-playfair font-medium mb-10 text-center shrink-0 ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{T.rules_complete}</h3>
            <div className="space-y-4 overflow-y-auto scrollbar-hide mb-10">
              {DATA.rules.map((rule, i) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className="shrink-0 pt-8 border-t border-zinc-800/50">
              <Button full size="xl" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Popups */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-md rounded-[3rem] p-12 text-center border shadow-2xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100'}`}>
            <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-10 border-4 shadow-inner ${isDark ? 'bg-zinc-900 border-zinc-800 text-blue-500' : 'bg-slate-50 border-slate-100 text-blue-600'}`}><Icon name="gift" size={48} /></div>
            <h3 className={`text-4xl font-playfair font-medium mb-5 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-base font-light leading-relaxed mb-10 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.welcome_popup_msg}</p>
            <div className={`p-8 rounded-3xl border mb-10 border-dashed ${isDark ? 'bg-blue-900/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>BENEFÍCIO INAUGURAL</p>
              <p className={`text-4xl font-playfair font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>BEMVINDO10</p>
            </div>
            <button onClick={() => { setWelcomePopup(false); setUser(u => ({ ...u, hasSeenWelcome: true })); const welcomeCoupon = { id: 'welcome', val: 10, title: '🎁 BEMVINDO10', code: 'BEMVINDO10' }; setBooking(b => ({ ...b, appliedCoupon: welcomeCoupon })); setUser(prev => ({ ...prev, coupons: [...prev.coupons, welcomeCoupon] })); addToast(T.toast_coupon_success, "success"); }} className={`w-full h-16 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 ${isDark ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20'}`}>
              {T.get_coupon}
            </button>
          </div>
        </div>
      )}
      
      {levelUpPopup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-lg rounded-[3rem] p-12 md:p-14 text-center border shadow-2xl ${isDark ? 'bg-zinc-950 border-amber-500/30 shadow-amber-900/30' : 'bg-white border-slate-100 shadow-amber-500/10'}`}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[3rem] pointer-events-none"><div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/20 blur-[60px] rounded-full" /></div>
            <div className="w-28 h-28 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-amber-500/50 text-white animate-bounce"><Icon name="trophy" size={48} /></div>
            <h3 className={`text-4xl md:text-5xl font-playfair font-medium mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-lg font-light leading-relaxed mb-12 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.levelup_popup_msg}</p>
            <button onClick={() => setLevelUpPopup(false)} className={`w-full h-16 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 ${isDark ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-amber-900/50' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30'}`}>
              Resgatar Nova Conquista
            </button>
          </div>
        </div>
      )}
    </>
  );
}
