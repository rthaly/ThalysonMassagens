import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES ESTÁTICAS (PERFORMANCE & SEGURANÇA)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v22_pro', 
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_SECURE_V5',
  START_HOUR: 9,
  END_HOUR: 20,
  MAX_STORAGE_SIZE: 5000 
} as const;

// Ícones Outline Otimizados
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
  'copy': 'M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1 M16 3H10a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z'
};

// ==================================================================================
// 2. DESIGN SYSTEM & ESTILOS GLOBAIS
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
// 3. COMPONENTES DE UI (FOCO EM CONVERSÃO)
// ==================================================================================

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.98] font-poppins gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20",
    secondary: "bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-green-900/20",
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] animate-fade-in" onClick={onClose} role="presentation" />
      <aside className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-[70] p-8 shadow-2xl animate-slide-in ${isDark ? 'bg-zinc-950 text-white border-l border-zinc-800' : 'bg-white text-slate-900 border-l border-slate-100'}`}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-playfair">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors" aria-label="Fechar menu"><Icon name="x" size={24} /></button>
        </div>
        
        <div className="mb-10 p-5 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-white shadow-inner border border-zinc-700/50">
          <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest mb-1">Status de Cuidado</p>
          <div className="flex justify-between items-end">
             <span className="text-3xl font-light font-playfair">{user.xp} <span className="text-sm font-bold text-blue-400 font-sans">XP</span></span>
             <Icon name="award" className="text-blue-400" />
          </div>
        </div>

        <nav className="space-y-4">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name={isDark ? "moon" : "sun"} className={isDark ? "text-blue-400" : "text-blue-600"} />
              <span className="font-medium">Interface</span>
            </div>
            <span className="text-xs font-bold opacity-50 uppercase tracking-widest">{isDark ? 'Noturna' : 'Clara'}</span>
          </button>
          
          <button onClick={toggleLang} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name="globe" className={isDark ? "text-emerald-400" : "text-emerald-600"} />
              <span className="font-medium">Idioma</span>
            </div>
            <span className="text-xs font-bold opacity-50 uppercase tracking-widest">{lang}</span>
          </button>

          <button onClick={() => { if(navigator.share) navigator.share({title: 'Thalyson Massagens', url: window.location.href}) }} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name="share" className="text-purple-400" />
              <span className="font-medium">Indicar Experiência</span>
            </div>
          </button>
        </nav>
      </aside>
    </>
  );
});

const Card = memo(({ children, className = '', onClick, active = false, isDark = true, popular = false }: any) => (
  <div onClick={onClick} className={`relative p-6 md:p-8 rounded-3xl transition-all duration-300 flex flex-col h-full font-poppins ${onClick ? 'cursor-pointer active:scale-[0.99] hover:-translate-y-1 hover:shadow-lg' : ''} ${active ? 'bg-blue-600/10 border-2 border-blue-500 shadow-blue-500/20' : isDark ? 'bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700' : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300'} ${className}`}>
    {popular && (
      <div className="absolute -top-3 left-6 md:left-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md border border-blue-500/50">
        ✦ Mais Escolhida
      </div>
    )}
    {children}
  </div>
));

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text", isDark = true, hasError = false }: any) => (
  <div className="space-y-2 w-full">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest font-poppins ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{label}</label>}
    <div className="relative group">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-500' : isDark ? 'text-zinc-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}><Icon name={icon} size={18} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-14 rounded-xl outline-none text-sm font-medium transition-all font-poppins bg-transparent ${icon ? 'pl-11 pr-4' : 'px-4'} ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus:border-blue-500/50 focus:bg-zinc-900/50' : 'border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-blue-50/50'}`} />
    </div>
  </div>
));

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`w-full h-full p-6 rounded-3xl transition-all duration-300 border ${isDark ? 'bg-zinc-900/30 border-zinc-800/80 hover:bg-zinc-900/60' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-playfair ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
          {review.n.charAt(0)}
        </div>
        <div>
          <span className={`text-sm font-semibold block ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{review.n}</span>
          <span className={`text-xs opacity-70 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-0.5 mt-1">
        {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={12} className={i < review.s ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-zinc-800' : 'text-slate-200'} />)}
      </div>
    </div>
    <p className={`text-sm leading-relaxed font-light italic ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>"{review.t}"</p>
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
    <div className={`flex items-center justify-center gap-3 p-3.5 rounded-xl transition-all font-inter border ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
      <Icon name="watch" size={18} className="animate-pulse" />
      <span className="text-xs font-bold uppercase tracking-widest">{text}: <span className="font-mono text-sm ml-1">{format(time)}</span></span>
    </div>
  );
});

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800/50' : 'border-slate-200'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left group font-inter" aria-expanded={isOpen}>
        <span className={`text-sm font-medium pr-4 ${isDark ? 'text-zinc-300 group-hover:text-white' : 'text-slate-700 group-hover:text-black'}`}>{q}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name="chevron-down" size={20} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-sm font-light leading-relaxed font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 rounded-2xl border border-transparent transition-colors ${isDark ? 'hover:bg-zinc-900/50' : 'hover:bg-slate-50'}`}>
    <div className={`flex-shrink-0 mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}><Icon name={rule.icon} size={22} /></div>
    <div>
      <h4 className={`text-sm font-bold mb-1.5 font-playfair ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{rule.title}</h4>
      <p className={`text-xs font-light leading-relaxed font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{rule.description}</p>
    </div>
  </div>
));

// ==================================================================================
// 4. LÓGICA DE DADOS E FUNÇÕES PURAS
// ==================================================================================
const sanitizeInput = (value: string): string => String(value || '').replace(/[<>&"']/g, '');
const validateAddress = (address: Address): boolean => !!(address.street && address.number && address.district && address.city);

// Limpeza segura
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

// ... O gerador de Reviews e getData() se mantém idêntico ao original pois os dados já foram afinados pelo usuário.
// (Vou incluir eles diretamente no componente App para garantir a integridade do arquivo único que você vai copiar e colar).

// ==================================================================================
// 5. MAIN APP OTIMIZADO (O CORAÇÃO DO SISTEMA)
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('single'); // Ajustado para single como padrão para evitar confusão inicial
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error"}[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [manualCouponInput, setManualCouponInput] = useState(''); 
  
  // Incluindo a inicialização dos dados cruciais aqui dentro do componente para garantir o contexto (mantendo a cópia dos dados que você pediu).
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
        { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Iniciante no Autocuidado" : "Self-Care Beginner" },
        { level: 2, xpNeeded: 100, reward: getPrice(15), title: isPT ? "Prioridade Certa" : "Right Priority" },
        { level: 3, xpNeeded: 350, reward: getPrice(30), title: isPT ? "Corpo Consciente" : "Conscious Body" },
        { level: 4, xpNeeded: 800, reward: getPrice(50), title: isPT ? "Plenitude Alcançada" : "Fullness Achieved" }
      ],
      services: [
        { id: 'depilacao', min: 45, price: p.depil, icon: "scissors", tag: isPT ? "CUIDADO PESSOAL" : "PERSONAL CARE", title: isPT ? "Aparo Corporal" : "Body Trimming", desc: isPT ? "Higiene e manutenção para quem valoriza a própria estética." : "Hygiene and maintenance for those who value aesthetics.", details: isPT ? "Aparo uniforme com máquina profissional\nFoco em áreas extensas: peito, costas e pernas\nSensação de leveza e asseio corporal" : "Uniform trimming with professional machine\nFocus on extensive areas: chest, back, and legs\nFeeling of lightness and body cleanliness" },
        { id: 'relaxante', min: 60, price: p.relax, icon: "user-check", tag: isPT ? "ALÍVIO DE CARGA" : "LOAD RELIEF", title: isPT ? "Massagem Terapêutica" : "Therapeutic Massage", desc: isPT ? "Para quem carrega o estresse e o peso da rotina. Um respiro para corpo e mente." : "For those carrying the stress of routine. A breather for body and mind.", details: isPT ? "Foco direto no desmanche de nódulos de tensão (lombar e cervical)\nPressão firme e acolhedora que devolve a mobilidade\nMomento de absoluto desligamento mental\n(Modalidade terapêutica muscular, sem apelo íntimo)" : "Direct focus on dismantling tension knots\nFirm pressure that restores mobility\nMoment of absolute mental shutdown\n(Therapeutic muscle mode, no intimate appeal)" },
        { id: 'sensitiva', min: 60, price: p.sens, icon: "sparkles", tag: isPT ? "DESCONEXÃO MENTAL" : "MENTAL DISCONNECT", title: isPT ? "Tântrica Sensorial" : "Sensory Tantra", desc: isPT ? "Quando a mente não desliga. Desperte seus sentidos e recupere a presença." : "When the mind won't turn off. Awaken your senses and recover presence.", details: isPT ? "Estímulos sutis que redirecionam o fluxo de pensamento\nAcolhimento e liberação emocional gradativa\nFinalização focada em liberação de endorfina\nPara quem busca esvaziar a mente sentindo o corpo" : "Subtle stimuli that redirect thought flow\nWarmth and gradual emotional release\nFinish focused on endorphin release\nFor those seeking to empty the mind by feeling the body" },
        { id: 'mista', min: 60, price: p.titan, icon: "zap", popular: true, tag: isPT ? "RESTAURAÇÃO PROFUNDA" : "DEEP RESTORATION", title: isPT ? "Fusion Experience" : "Fusion Experience", desc: isPT ? "A combinação exata: destrava a musculatura densa e revitaliza sua energia." : "The exact combination: unlocks dense musculature and revitalizes energy.", details: isPT ? "Inicia quebrando a rigidez muscular causada pelo estresse\nTransita para um deslizamento corpo a corpo terapêutico\nProporciona uma descarga orgânica de tensão e energia estagnada\nA jornada ideal para quem precisa de resultados completos" : "Starts breaking muscle stiffness caused by stress\nTransitions to a therapeutic body-to-body slide\nProvides an organic discharge of tension\nThe ideal journey for those needing complete results" },
        { id: 'nuru', min: 60, price: p.nuru, icon: "sparkles", tag: isPT ? "IMERSÃO & CALOR" : "IMMERSION & WARMTH", title: isPT ? "Experiência Nuru" : "Nuru Experience", desc: isPT ? "O nível máximo de acolhimento térmico. Um cuidado que derrete tensões." : "The maximum level of thermal warmth. Care that melts tensions.", details: isPT ? "Aplicação de gel orgânico aquecido para relaxamento muscular imediato\nContato contínuo corpo a corpo, eliminando focos de estresse\nAumento do fluxo sanguíneo e liberação profunda de toxinas\nUma imersão rara focada em soltar o controle e apenas sentir" : "Application of heated organic gel for immediate muscle relaxation\nContinuous body-to-body contact, eliminating stress focus\nIncreased blood flow and deep toxin release\nA rare immersion focused on letting go of control" }
      ] as ServiceItem[],
      extras: [
        { id: 'hair_trim', price: p.extras.hair_trim, icon: "✂️", isEmoji: true, label: isPT ? "Extensão de Aparo" : "Trim Extension", desc: isPT ? "Manutenção de duas áreas adicionais" : "Maintenance of two additional areas" },
        { id: 'more_time', price: p.extras.more_time, icon: "⏱️", isEmoji: true, label: isPT ? "Tempo Estendido" : "Extended Time", desc: isPT ? "+30 min para garantir a descompressão total" : "+30 min to ensure full decompression" },
        { id: 'touch', price: p.extras.touch, icon: "🖐️", isEmoji: true, label: isPT ? "Liberação de Toque" : "Interactive Touch", desc: isPT ? "Liberdade para uma interação orgânica" : "Freedom for a more organic interaction" },
        { id: 'aroma', price: p.extras.aroma, icon: "🌸", isEmoji: true, label: isPT ? "Aromaterapia" : "Aromatherapy", desc: isPT ? "Óleos essenciais para baixar a frequência mental" : "Essential oils to lower mental frequency" },
        { id: 'pain_relief', price: p.extras.pain_relief, icon: "💊", isEmoji: true, label: isPT ? "Foco Analgésico" : "Pain Focus", desc: isPT ? "Pomada técnica para áreas de dor crônica" : "Technical cream for chronic pain areas" }
      ],
      plans: [
        { id: 'pack_relax', type: 'pack', title: isPT ? "Ciclo Terapêutico (4x)" : "Therapeutic Cycle (4x)", price: p.packRelax.v, fullPrice: p.packRelax.full, savings: p.packRelax.save, desc: isPT ? "4 Encontros de Manutenção" : "4 Maintenance Encounters", details: isPT ? "O estresse não tira férias. Seu corpo também não deveria.\nUm compromisso com a sua saúde física." : "Stress doesn't take vacations. Neither should your body.\nA commitment to your physical health.", tag: isPT ? "PREVENÇÃO" : "PREVENTION", icon: "package" },
        { id: 'pack_mista', type: 'pack', title: isPT ? "Ciclo Fusion (3x)" : "Fusion Cycle (3x)", price: p.packTri.v, fullPrice: p.packTri.full, savings: p.packTri.save, desc: isPT ? "3 Sessões de Desbloqueio" : "3 Unblocking Sessions", details: isPT ? "Para períodos de alta demanda emocional.\nTrês imersões completas para zerar a fadiga mental." : "For periods of high emotional demand.\nThree complete immersions to reset mental fatigue.", tag: isPT ? "FOCO & EQUILÍBRIO" : "FOCUS & BALANCE", icon: "layers" },
        { id: 'pack_supreme', type: 'pack', title: isPT ? "Jornada Supreme (3x)" : "Supreme Journey (3x)", price: p.packSupreme.v, fullPrice: p.packSupreme.full, savings: p.packSupreme.save, desc: isPT ? "A terapia completa das técnicas" : "The complete therapy", details: isPT ? "O resgate absoluto da sua vitalidade.\nUm cronograma (Terapêutica + Fusion + Nuru) desenhado para esgotar tensões extremas." : "The absolute rescue of your vitality.\nA schedule designed to exhaust extreme tensions.", tag: "✦ JORNADA PREMIUM", icon: "award" },
        { id: 'pack_mix_4', type: 'pack', title: isPT ? "Jornada Completa" : "Full Journey", price: p.packMix.v, fullPrice: p.packMix.full, savings: p.packMix.save, desc: isPT ? "Estímulo e Relaxamento" : "Stimulus and Relaxation", details: isPT ? "Uma exploração cadenciada do seu próprio corpo.\nAlternando o sutil com o intenso." : "A rhythmic exploration of your own body.\nAlternating the subtle with the intense.", tag: "EXCELÊNCIA", icon: "star" }
      ] as ServiceItem[],
      faq: [
        { q: isPT ? "A sessão tem foco profissional?" : "Is the session professionally focused?", a: isPT ? "Totalmente. O atendimento é estruturado para entregar bem-estar, alívio de tensões físicas e descarga de estresse emocional." : "Absolutely. The service is structured to deliver well-being, relief from physical tension, and emotional stress discharge." },
        { q: isPT ? "O sigilo do atendimento é garantido?" : "Is confidentiality guaranteed?", a: isPT ? "Ética é o pilar base do meu trabalho. Atendo sob um pacto de confidencialidade inegociável." : "Ethics is the foundational pillar of my work. I serve under an unnegotiable confidentiality pact." },
        { q: isPT ? "Como preparo meu ambiente?" : "How should I prepare my space?", a: isPT ? "Você só precisa do seu próprio chuveiro e da sua cama (ou do hotel). Uma ducha morna prévia é a melhor preparação orgânica." : "You only need your own shower and your bed. A warm shower beforehand is the best organic preparation." }
      ],
      rules: isPT ? [
        { icon: "shower", title: "Preparação Física", description: "O banho prévio remove impurezas da rotina e facilita a absorção do relaxamento cutâneo." },
        { icon: "hand", title: "Limites e Respeito", description: "O conforto mútuo sustenta a qualidade do atendimento. O bom senso guia a sessão." },
        { icon: "shield", title: "Blindagem de Sigilo", description: "Sua privacidade é absoluta. Total discrição." },
        { icon: "clock", title: "Pontualidade Ética", description: "A fluidez da agenda depende do cumprimento dos horários. Tolerância técnica de 15min." }
      ] : [
        { icon: "shower", title: "Physical Preparation", description: "A prior shower removes routine impurities." },
        { icon: "hand", title: "Boundaries and Respect", description: "Mutual comfort sustains service quality." },
        { icon: "shield", title: "Secrecy Shield", description: "Your privacy is absolute. Total discretion." },
        { icon: "clock", title: "Ethical Punctuality", description: "Schedule fluidity depends on keeping time. 15min tolerance." }
      ],
      reviews: [
        { n: "Gustavo", loc: "Bela Vista - SP", t: isPT ? "A combinação da massagem relaxante com a sensitiva criou uma jornada perfeita. O ápice da sessão foi vigoroso e restaurador. Sensação de leveza absurda ao final." : "The combination of relaxing and sensory massage created a perfect journey. Absurd feeling of lightness at the end.", s: 5 },
        { n: "Roberto", loc: "Jardins - SP", t: isPT ? "A sensação de vazio e paz que senti após a sessão foi indescritível. A finalização foi extremamente potente, liberando uma carga de tensão." : "The feeling of emptiness and peace I felt after the session was indescribable.", s: 5 },
        { n: "Mariana", loc: "Jales", t: isPT ? "Toque respeitoso, mas com a intensidade certa. Consegui me desligar dos problemas do trabalho e focar apenas no meu prazer e bem-estar. Foi libertador." : "Respectful touch, but with the right intensity. It was liberating.", s: 5 },
        { n: "Marcelo", loc: "Centro - SP", t: isPT ? "Fui sem expectativa e saí surpreendido. Executado com uma técnica precisa e respeitosa. O prazer foi intenso e genuíno." : "I went without expectation and left surprised. The pleasure was intense and genuine.", s: 5 }
      ],
      text: {
        welcome: isPT ? "Olá," : "Hello,",
        choose_sub: isPT ? "O peso da rotina cansa o corpo e a mente. Qual cuidado você precisa hoje?" : "The weight of routine exhausts. What level of decompression does your body ask for today?",
        level_label: isPT ? "Nível de Constância" : "Consistency Level",
        tab_packs: isPT ? "Pacotes Exclusivos" : "Premium Packages",
        tab_single: isPT ? "Sessão Avulsa" : "Single Session",
        next_btn: isPT ? "Garantir Horário" : "Secure Slot",
        finish_btn: isPT ? "Confirmar Reserva no WhatsApp" : "Confirm Booking via WhatsApp",
        loading: isPT ? "Preparando o seu espaço..." : "Preparing your space...",
        toast_select_item: isPT ? "Por favor, escolha uma das experiências" : "Please select an experience",
        toast_select_date: isPT ? "Escolha a melhor data e horário para sua sessão" : "Set the best date and time for your session",
        toast_fill_name: isPT ? "Como posso te chamar?" : "What should I call you?",
        toast_fill_addr: isPT ? "Preencha os dados do local de atendimento." : "Please fill in the location details.",
        toast_accept_terms: isPT ? "É preciso aceitar o código de ética para avançarmos." : "Please accept the code of ethics to continue.",
        toast_coupon_success: isPT ? "Desconto VIP aplicado com sucesso!" : "VIP Discount applied successfully!",
        toast_coupon_invalid: isPT ? "Ops, esse código não é válido no momento." : "Oops, this code is not valid.",
        details_label: isPT ? "O que inclui na sessão" : "Session details",
        select_time_title: isPT ? "Sua janela de descompressão" : "Your decompression window",
        location_title: isPT ? "Onde será nosso encontro?" : "Where will we meet?",
        extras_title: isPT ? "Potencialize sua experiência:" : "Boost your experience:",
        coupon_section: isPT ? "Benefício Especial" : "Special Benefit",
        payment_title: isPT ? "Forma de Acerto (Pagamento Pós-Sessão)" : "Payment Method (Post-Session)",
        terms_title: isPT ? "Código de Ética e Respeito" : "Code of Ethics and Respect",
        success_title: isPT ? "Tudo quase pronto!" : "Almost done!",
        success_sub: isPT ? "Seu protocolo foi gerado. Agora é só me mandar no WhatsApp para eu aprovar e reservar oficialmente na minha agenda." : "Your protocol is generated. Send it to my WhatsApp to officially book it.",
        whatsapp_btn: isPT ? "Enviar Reserva no WhatsApp" : "Send Booking to WhatsApp",
        back_home: isPT ? "Voltar ao início" : "Back to home",
        timer_text: isPT ? "Reserva garantida por" : "Reservation guaranteed for",
        upgrade_msg: isPT ? "Ótima escolha! Se precisar também aliviar a mente, sugiro dar uma olhada na Mista (Fusion)." : "Great choice! Check out Fusion for mental relief too.",
        input_name: isPT ? "Como prefere ser chamado?" : "What should I call you?",
        input_addr: isPT ? "Rua ou Avenida" : "Street or Avenue",
        input_num: isPT ? "Número" : "Number",
        input_district: isPT ? "Bairro" : "District",
        input_city: isPT ? "Cidade" : "City",
        input_comp: isPT ? "Complemento (Apto, Bloco)" : "Complement (Apt, Block)",
        input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
        input_room: isPT ? "Número da Suíte" : "Room Number",
        agree_terms: isPT ? "Li e concordo com o Código de Ética" : "I have read and agree to the Code of Ethics",
        faq_title: isPT ? "Dúvidas Frequentes" : "Frequently Asked Questions",
        reviews_title: isPT ? "Experiências Reais" : "Real Experiences",
        empty_date: isPT ? "Toque num dia para ver a disponibilidade" : "Tap a day to see availability",
        empty_slots: isPT ? "Poxa, minha agenda já lotou nesse dia. Tente o próximo." : "Oh, my schedule is full this day. Try the next.",
        total_label: isPT ? "Valor Final" : "Final Value",
        subtotal: isPT ? "Investimento Base" : "Base Investment",
        discount: isPT ? "Desconto Especial" : "Special Discount",
        pix_discount: isPT ? "Desconto no Pix (3%)" : "Pix Discount (3%)",
        welcome_popup_title: isPT ? "Bem-vindo!" : "Welcome!",
        welcome_popup_msg: isPT ? "Que bom ter você aqui. Tirar um tempo para cuidar do corpo é essencial. Aqui está um presente para começarmos." : "Glad to have you here. Taking time to care for your body is essential. Here is a welcome gift.",
        levelup_popup_title: isPT ? "Evolução Alcançada!" : "Evolution Achieved!",
        levelup_popup_msg: isPT ? "Sua constância gerou recompensas. Acabei de liberar um novo benefício exclusivo para sua próxima sessão." : "Your consistency generated rewards. I just unlocked a new exclusive benefit.",
        get_coupon: isPT ? "Resgatar Meu Benefício" : "Redeem My Benefit",
        rules_complete: isPT ? "Nosso acordo de respeito" : "Our agreement of respect",
        media_discount: isPT ? "Desconto Portfólio (1%)" : "Portfolio Discount (1%)",
        media_title: isPT ? "Autorização de Mídia (Opcional)" : "Media Authorization (Optional)",
        media_desc: isPT ? "Autorizo fotos anônimas (sem rosto ou intimidade) exclusivamente para portfólio de estética corporal." : "I authorize anonymous photos exclusively for body aesthetics portfolio.",
        media_bonus: isPT ? "Liberar para ganhar 1% OFF" : "Allow for 1% OFF",
        uber_notice: isPT ? "Uber: A taxa de deslocamento será calculada e informada na aprovação via WhatsApp." : "Uber: Travel fee will be calculated and informed on WhatsApp."
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
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  
  // Hydration Fix & Metadata
  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
  }, []);

  useEffect(() => {
    if (isClient) {
        document.title = step === 0 ? "Thalyson Massagens - Alto Padrão" : "Reserva em Andamento - Thalyson";
    }
  }, [step, isClient]);
  
  // Recuperação de Cache Segura (O Front-End Senior blinda a inicialização)
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
    setTimeout(() => setStep(1), 250); // Feedback mais ágil
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
    let serviceTitle = booking.item?.title || ''; if (booking.type !== 'single' && booking.item?.desc) serviceTitle += ` ${lang === 'pt' ? '(Pacote Premium)' : '(Premium Journey)'}`;
    
    let locTxt = ""; let mapQuery = "";
    if (booking.locationType === 'home') { 
      const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`; 
      locTxt = `🏠 *${lang === 'pt' ? 'Residência' : 'Home'}*\n📍 ${fullAddr}\n📝 ${lang === 'pt' ? 'Dados Extras' : 'Unit'}: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    else if (booking.locationType === 'motel') { 
      locTxt = `🏩 *Suíte/Motel*\n⚠️ (${lang === 'pt' ? 'Averbação por conta do titular' : 'Venue fee on client'})`; 
    }
    else { 
      const fullAddr = `${booking.address.placeName}, ${booking.address.city}`; 
      locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 ${lang === 'pt' ? 'Suíte/Quarto' : 'Room'}: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    
    const extrasList = Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => { 
      const ex = DATA.extras.find(e => e.id === k); 
      if (!ex) return ''; 
      return `✅ ${ex.label} (+${formatMoney(booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price, lang === 'pt')})`; 
    }).filter(Boolean).join('\n');
    
    let priceDetails = `💵 *${lang === 'pt' ? 'Investimento Base' : 'Base'} (${serviceTitle}):* ${formatMoney(booking.item?.price || 0, lang === 'pt')}`;
    if (f.disc > 0) priceDetails += `\n📉 *${lang === 'pt' ? 'Benefício Aplicado' : 'Coupon'} (${booking.appliedCoupon?.code}):* -${formatMoney(f.disc, lang === 'pt')}`;
    if (f.mediaDisc > 0) priceDetails += `\n📸 *${lang === 'pt' ? 'Mídia Integrada (1%)' : 'Media (1%)'}:* -${formatMoney(f.mediaDisc, lang === 'pt')}`;
    if (f.pixDisc > 0) priceDetails += `\n💸 *Desconto PIX (3%):* -${formatMoney(f.pixDisc, lang === 'pt')}`;
    priceDetails += `\n\n💰 *VALOR FINAL: ${formatMoney(f.total, lang === 'pt')}*`;
    
    return `
*${lang === 'pt' ? 'SUBMISSÃO DE PROTOCOLO VIP' : 'NEW VIP BOOKING'}* | #${securityHash}
──────────────────
👤 *${lang === 'pt' ? 'Titular' : 'Client'}:* ${sanitizeInput(user.name)}
📅 *${lang === 'pt' ? 'Data' : 'Date'}:* ${dateStr}
⏰ *${lang === 'pt' ? 'Janela Reservada' : 'Time'}:* ${booking.time}

💆‍♂️ *${lang === 'pt' ? 'EXPERIÊNCIA SELECIONADA' : 'SESSION'}:*
*${serviceTitle}*
${extrasList ? `\n➕ *${lang === 'pt' ? 'POTENCIALIZADORES' : 'ADD-ONS'}:*\n${extrasList}` : ''}

📍 *${lang === 'pt' ? 'LOCALIZAÇÃO' : 'LOCATION'}:*
${locTxt}
${mapQuery ? `🔗 Rota GPS: http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(mapQuery)}` : ''}

🚗 *${lang === 'pt' ? 'DESLOCAMENTO (UBER)' : 'TRANSPORT (UBER)'}:*
*${lang === 'pt' ? 'A combinar na aprovação' : 'To be agreed separately'}*

💰 *${lang === 'pt' ? 'RESUMO FINANCEIRO' : 'FINANCIAL SUMMARY'}:*
${priceDetails}

💳 *${lang === 'pt' ? 'Modo de Acerto' : 'Payment'}:* ${booking.payment.toUpperCase()}
──────────────────
*Sessão sujeita a aprovação final.*
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
      dateScrollRef.current.scrollBy({ left: dir === 'left' ? -250 : 250, behavior: 'smooth' }); 
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
        <div className="flex flex-col items-center max-w-xs w-full px-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl font-playfair mb-8 animate-bounce shadow-lg shadow-blue-500/20">
            T
          </div>
          <div className="w-full h-1.5 bg-zinc-800/20 overflow-hidden mb-4 rounded-full">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%', animation: 'loading-bar 1.5s ease-in-out infinite' }}></div>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">{T.loading}</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}} />
      </div>
    );
  }
  
  return (
    <>
      <GlobalStyles isDark={isDark} />
      
      {/* Background Container App */}
      <div className={`fixed inset-0 z-[-1] pointer-events-none transition-colors duration-500 ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`} aria-hidden="true" />
      
      {/* Toasts / Notifications */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div key={t.id} role="alert" className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-xl shadow-xl animate-fade-in font-inter ${t.type === 'success' ? isDark ? 'bg-zinc-800/90 border-zinc-700 text-zinc-100' : 'bg-white/90 border-slate-200 text-slate-800' : 'bg-red-500/90 border-red-500 text-white'}`}>
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={18} />
            <span className="text-xs font-semibold tracking-wide">{t.msg}</span>
          </div>
        ))}
      </div>
      
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} toggleLang={() => setLang(l => l === 'pt' ? 'en' : 'pt')} lang={lang} user={user} />

      <main className="min-h-screen relative z-10 pb-40 px-4 md:px-12 max-w-5xl mx-auto selection:bg-blue-500/30 selection:text-blue-200">
        {step !== 4 && (
          <header className="pt-10 pb-8">
            <div className="flex items-start justify-between">
              <div className="flex flex-col cursor-pointer transition-opacity hover:opacity-80" onClick={() => setStep(0)} title="Voltar ao Início">
                <h1 className={`text-3xl font-playfair tracking-tight font-medium ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Thalyson <br className="block md:hidden" /> Massagens
                </h1>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest mt-3 font-bold font-inter">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
                  {user.ordersCount || 83} Vidas Reestruturadas
                </div>
              </div>
              <div className="flex items-center gap-4">
                {step > 0 && (
                  <button onClick={() => setStep(0)} className={`hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-700'}`}>
                    Menu Central
                  </button>
                )}
                <button onClick={() => setMenuOpen(true)} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                   <Icon name="menu" size={20} />
                </button>
              </div>
            </div>
            
            {/* Progressão Visual Elegante */}
            {step > 0 && step < 4 && (
              <div className="mt-12 flex items-center justify-between gap-3 max-w-sm mx-auto">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div className={`w-full h-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                    <span className={`text-[9px] font-bold uppercase tracking-widest font-inter transition-colors duration-300 ${step >= i ? isDark ? 'text-zinc-100' : 'text-slate-900' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                      {i === 1 ? 'Data/Hora' : i === 2 ? 'Local' : 'Resumo'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </header>
        )}
        
        <div className="space-y-12">
          {step === 0 && (
            <section className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-4">
                <div>
                  <h2 className={`text-4xl md:text-5xl font-playfair font-medium leading-tight mb-6 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    {T.welcome} <span className="font-italic text-blue-500">{user.name ? String(user.name).trim().split(' ')[0] : (isPT ? "Priorize-se" : "Visitor")}.</span>
                  </h2>
                  <p className={`text-base md:text-lg font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {T.choose_sub}
                  </p>
                </div>
                
                <div className={`p-8 md:p-10 rounded-[2rem] border transition-colors ${isDark ? 'bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50 hover:border-slate-300'}`}>
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border shadow-inner ${isDark ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 text-yellow-500' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 text-yellow-600'}`}>
                        <Icon name="award" size={24} />
                      </div>
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-widest block mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          {T.level_label}
                        </span>
                        <h3 className={`text-xl font-playfair font-medium ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                          {user.xp >= 800 ? "Plenitude Alcançada Plus" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-4xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-zinc-100 to-zinc-400' : 'from-slate-700 to-slate-900'}`}>{user.xp}</span>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block mt-1">XP Atual</span>
                    </div>
                  </div>
                  <div>
                    <div className={`flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      <span>Progresso</span>
                      <span>{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800/50' : 'bg-slate-200'}`} role="progressbar" aria-valuenow={getCurrentLevelProgress()} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full bg-blue-500 transition-all duration-1000 ease-out relative" style={{ width: `${getCurrentLevelProgress()}%` }}>
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    {nextLevelInfo && (
                      <p className={`text-xs mt-4 text-center font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        Faltam {nextLevelInfo.needed} XP para resgatar benefício de <span className="text-blue-500">+{formatMoney(nextLevelInfo.reward, isPT)}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`flex p-1.5 rounded-2xl border max-w-md mx-auto shadow-inner ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-100 border-slate-200/80'}`} role="tablist">
                <button role="tab" aria-selected={activeTab === 'single'} onClick={() => setActiveTab('single')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="user" size={16} /> {T.tab_single}
                </button>
                <button role="tab" aria-selected={activeTab === 'packs'} onClick={() => setActiveTab('packs')} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'packs' ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="package" size={16} /> {T.tab_packs}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => (
                  <Card key={s.id} active={booking.item?.id === s.id} onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : 'pack', s)} isDark={isDark} popular={s.popular}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full border shadow-sm ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-white border-slate-200 text-slate-700'}`}>
                          <Icon name={s.icon} size={20} isEmoji={s.isEmoji} />
                        </div>
                        <div className="text-right">
                          {s.fullPrice && (
                            <span className={`text-[10px] block mb-1 font-inter uppercase tracking-widest font-bold ${isDark ? 'text-red-400/80' : 'text-red-500/80'}`}>
                              De: <span className="line-through">{formatMoney(s.fullPrice, isPT)}</span>
                            </span>
                          )}
                          <span className={`text-2xl font-playfair font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {formatMoney(s.price, isPT)}
                          </span>
                          {s.savings && (
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full block mt-2 border ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                              ECONOMIA: {formatMoney(s.savings, isPT)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <span className={`text-[9px] font-bold uppercase tracking-widest border px-3 py-1.5 rounded-full inline-block mb-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                          {s.tag}
                        </span>
                        <h3 className={`text-xl font-playfair font-medium mb-3 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                          {s.title}
                        </h3>
                        <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`pt-5 border-t ${isDark ? 'border-zinc-800/60' : 'border-slate-200'}`}>
                      <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-300' : 'text-slate-500'}`}>
                        <Icon name="check" size={14} className="text-emerald-500" /> {T.details_label}
                      </div>
                      <div className={`text-xs space-y-2.5 font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {s.details.split('\n').map((line, i) => <p key={i} className="flex items-start gap-1.5"><span className="text-blue-500 mt-0.5">•</span> <span>{line}</span></p>)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Seção de Social Proof (Reviews) */}
              <div className="py-16 relative">
                <div className="flex items-center justify-between mb-8 px-2">
                  <h3 className={`text-2xl font-playfair font-medium ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                    {T.reviews_title}
                  </h3>
                  <div className="hidden md:flex gap-3">
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: -360, behavior: 'smooth' })} className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 shadow-sm hover:shadow-md'}`}><Icon name="chevron-left" size={20} /></button>
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: 360, behavior: 'smooth' })} className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 shadow-sm hover:shadow-md'}`}><Icon name="chevron-right" size={20} /></button>
                  </div>
                </div>
                <div id="reviews-slider" className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-8 -mx-4 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center flex-shrink-0 w-[85vw] md:w-[360px] mr-6 last:mr-0">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* FAQ */}
              <div className="max-w-3xl mx-auto py-12">
                <h3 className={`text-2xl font-playfair font-medium text-center mb-10 ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                  {T.faq_title}
                </h3>
                <div className={`border-t border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                  {DATA.faq.map((item, idx) => <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />)}
                </div>
              </div>
            </section>
          )}
          
          {step === 1 && (
            <section className="space-y-10 animate-fade-in max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className={`text-3xl font-playfair font-medium mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  {T.select_time_title}
                </h2>
                <p className={`text-sm font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {T.toast_select_date}
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl flex items-center justify-between border shadow-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                 <div className="flex flex-col">
                   <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Sessão</span>
                   <span className={`text-base font-semibold font-playfair ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{booking.item?.title}</span>
                 </div>
                 <button onClick={() => setStep(0)} className={`text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full transition-colors border ${isDark ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>Trocar</button>
              </div>

              <div className="relative mt-12">
                <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full transition-all border shadow-md ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><Icon name="chevron-left" size={20} /></button>
                
                <div ref={dateScrollRef} className="flex gap-4 overflow-x-auto px-2 py-4 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const monthName = d.toLocaleDateString(isPT ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' }).replace('.', '');
                    return (
                      <div key={idx} className="snap-center">
                        <button onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))} className={`w-[90px] h-[110px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border ${isSel ? 'bg-blue-600 border-blue-500 text-white scale-105 shadow-lg shadow-blue-900/30' : isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/60' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-100' : 'opacity-60'}`}>{monthName}</span>
                          <span className="text-2xl font-bold font-playfair">{d.getDate()}</span>
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-200' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{getDayLabel(d)}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full transition-all border shadow-md ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><Icon name="chevron-right" size={20} /></button>
              </div>
              
              {!booking.date && (
                <div className={`text-center py-20 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-4 mt-8 transition-colors ${isDark ? 'border-zinc-800 bg-zinc-900/20 text-zinc-500' : 'border-slate-300 bg-slate-50/50 text-slate-400'}`}>
                  <Icon name="calendar" size={36} className="opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-widest">{T.empty_date}</p>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="mt-12 animate-fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Horários Disponíveis</h4>
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full animate-pulse">Alta Procura</span>
                  </div>
                  <div className="grid grid-cols-2 min-[380px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3.5">
                    {generateTimeSlots.map((t) => (
                      <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))} className={`py-4 rounded-xl text-sm font-bold transition-all duration-300 border ${booking.time === t ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/20 scale-105' : isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/60' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-16 rounded-3xl border mt-8 ${isDark ? 'bg-zinc-900/30 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <p className="text-sm font-medium tracking-wide">{T.empty_slots}</p>
                </div>
              )}
            </section>
          )}
          
          {step === 2 && (
            <section className="space-y-12 animate-fade-in max-w-3xl mx-auto">
              <h2 className={`text-3xl font-playfair font-medium text-center ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { id: 'home', label: isPT ? 'Residência' : 'Home', icon: 'home' },
                  { id: 'motel', label: 'Suíte / Motel', icon: 'bed' },
                  { id: 'hotel', label: 'Hotel', icon: 'building' }
                ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))} className={`py-8 px-4 rounded-[2rem] flex flex-col items-center gap-5 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20 -translate-y-1' : isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 shadow-sm'}`}>
                    <Icon name={x.icon} size={28} />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-center px-2">{x.label}</span>
                  </button>
                ))}
              </div>
              
              <div className={`p-8 md:p-10 rounded-[2.5rem] border shadow-sm transition-colors ${isDark ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-slate-100'} space-y-8`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder={isPT ? "Seu nome ou como prefere ser chamado" : "Your name"} hasError={!user.name || String(user.name).trim().length < 3} />
                
                {booking.locationType === 'home' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-5">
                      <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} icon="map-pin" placeholder={isPT ? "Avenida / Rua" : "Street"} hasError={!booking.address.street} />
                      <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Nº" type="tel" hasError={!booking.address.number} />
                    </div>
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Bairro" : "District"} hasError={!booking.address.district} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Cidade" : "City"} hasError={!booking.address.city} />
                      <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Apto / Bloco (Opcional)" : "Apt 10"} />
                    </div>
                  </div>
                )}
                
                {booking.locationType === 'hotel' && (
                  <div className="space-y-6 animate-fade-in">
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder={isPT ? "Nome do Hotel" : "Hotel name"} hasError={!booking.address.placeName} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={isPT ? "Cidade" : "City"} hasError={!booking.address.city} />
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Nº do Quarto / Reserva em nome de quem?" />
                  </div>
                )}
                
                {booking.locationType === 'motel' && (
                  <div className={`p-8 rounded-2xl border text-center animate-fade-in ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-200'} flex flex-col items-center gap-4`}>
                    <Icon name="shield" size={28} className={isDark ? 'text-zinc-500' : 'text-slate-400'} />
                    <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                      {T.uber_notice.split(':')[0]} garantido. <br/>Lembre-se: A reserva da suíte e os custos do local ficam por conta do titular do atendimento.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <h3 className={`text-[11px] font-bold uppercase mb-6 tracking-widest pl-2 flex items-center gap-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <Icon name="sparkles" size={14} className="text-blue-500" /> {T.extras_title}
                </h3>
                <div className="space-y-4">
                  {DATA.extras.map((ex) => {
                    const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                    const isActive = booking.extras[ex.id];
                    return (
                      <div key={ex.id} onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))} className={`flex items-center justify-between p-6 rounded-[2rem] border cursor-pointer transition-all duration-300 ${isActive ? 'bg-blue-600/10 border-blue-500 shadow-md shadow-blue-900/10' : isDark ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'} group`} role="checkbox" aria-checked={isActive}>
                        <div className="flex items-center gap-5">
                          <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}><Icon name={ex.icon} size={24} isEmoji={ex.isEmoji} /></div>
                          <div>
                            <p className={`text-sm md:text-base font-semibold ${isActive ? isDark ? 'text-blue-400' : 'text-blue-700' : isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{ex.label}</p>
                            <p className={`text-xs font-light mt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{ex.desc}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] md:text-xs font-bold tracking-widest px-4 py-2 rounded-full transition-colors ${isActive ? 'bg-blue-500 text-white' : isDark ? 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'}`}>
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
                <div className={`p-8 md:p-10 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-slate-100'}`}>
                  <h3 className={`text-2xl font-playfair font-medium mb-8 flex items-center gap-3 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    <Icon name="file-text" size={24} className="text-blue-500" /> Resumo do Protocolo
                  </h3>
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          MODALIDADE SELECIONADA
                        </p>
                        <h4 className={`text-xl font-playfair font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          {booking.item ? (DATA.services.find(s => s.id === booking.item?.id) || DATA.plans.find(p => p.id === booking.item?.id))?.title : ''}
                        </h4>
                        <div className={`flex items-center gap-2 text-xs font-medium mt-4 border px-4 py-2 rounded-full w-fit shadow-sm ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                          <Icon name="calendar" size={14} className="text-blue-500" />
                          {booking.date ? new Date(booking.date).toLocaleDateString(isPT ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : ''} às {booking.time}
                        </div>
                      </div>
                      <span className={`text-2xl font-medium font-playfair ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                        {formatMoney(financials.sub, isPT)}
                      </span>
                    </div>
                    
                    {Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).length > 0 && (
                      <div className={`pt-8 border-t ${isDark ? 'border-zinc-800/60' : 'border-slate-200'}`}>
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          POTENCIALIZADORES ADICIONADOS
                        </p>
                        <div className="space-y-4">
                          {Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => {
                            const ex = DATA.extras.find(e => e.id === k);
                            if (!ex) return null;
                            const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                            return (
                              <div key={k} className="flex justify-between text-sm font-medium">
                                <span className={`flex items-center gap-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                   <Icon name="check" size={14} className="text-blue-500" /> {ex.label}
                                </span>
                                <span className={isDark ? 'text-zinc-100' : 'text-slate-900'}>+ {formatMoney(price, isPT)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className={`pt-8 border-t border-dashed ${isDark ? 'border-zinc-800' : 'border-slate-300'}`}>
                      <div className="flex justify-between mb-4">
                        <span className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.subtotal}</span>
                        <span className={`text-sm font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          {formatMoney(financials.sub, isPT)}
                        </span>
                      </div>
                      
                      {financials.disc > 0 && (
                        <div className="flex justify-between mb-4 text-emerald-500 font-medium">
                          <span className="text-sm">Benefício ({booking.appliedCoupon?.code})</span>
                          <span className="text-sm">- {formatMoney(financials.disc, isPT)}</span>
                        </div>
                      )}

                      {financials.mediaDisc > 0 && (
                        <div className="flex justify-between mb-4 text-blue-400 font-medium">
                          <span className="text-sm">{T.media_discount}</span>
                          <span className="text-sm">- {formatMoney(financials.mediaDisc, isPT)}</span>
                        </div>
                      )}
                      
                      {financials.pixDisc > 0 && (
                        <div className={`flex justify-between mb-4 font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          <span className="text-sm">{T.pix_discount}</span>
                          <span className="text-sm">- {formatMoney(financials.pixDisc, isPT)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-end pt-6 mt-4 border-t border-solid border-blue-500/20">
                        <span className={`text-sm uppercase tracking-widest font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.total_label}</span>
                        <div className="text-right">
                          <span className={`text-5xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'}`}>
                            {formatMoney(financials.total, isPT)}
                          </span>
                          <div className={`flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-widest font-bold mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            <Icon name="sparkles" size={12} /> +{estimatedXP} XP GARANTIDOS
                          </div>
                        </div>
                      </div>
                      
                      <div className={`mt-8 p-5 rounded-2xl border flex items-start gap-4 text-xs font-medium leading-relaxed ${isDark ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400' : 'bg-blue-50/50 border-blue-100 text-blue-800'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-blue-100 text-blue-600'}`}>
                            <Icon name="car" size={16} />
                          </div>
                          <span className="mt-1">{T.uber_notice}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Cupom Section */}
                  <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-slate-100'}`}>
                    <h3 className={`text-lg font-playfair font-medium mb-6 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                      {T.coupon_section}
                    </h3>
                    
                    <div className="flex gap-3 mb-6">
                      <input type="text" value={manualCouponInput} onChange={(e) => setManualCouponInput(e.target.value)} placeholder="Inserir Código" className={`flex-1 h-12 px-5 rounded-xl text-sm outline-none font-mono uppercase transition-all bg-transparent border ${isDark ? 'border-zinc-800 focus:border-blue-500 text-zinc-100 placeholder:text-zinc-600' : 'border-slate-300 focus:border-blue-500 text-slate-900 placeholder:text-slate-400'}`} />
                      <button onClick={applyManualCoupon} className={`px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20' : 'bg-slate-900 text-white hover:bg-black shadow-md'}`}>Aplicar</button>
                    </div>

                    {user.coupons.length > 0 && (
                      <div className={`flex flex-wrap gap-2 pt-6 border-t ${isDark ? 'border-zinc-800/60' : 'border-slate-200'}`}>
                        {user.coupons.map(c => (
                          <button key={c.id} onClick={() => setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-900/20' : isDark ? 'bg-transparent border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 shadow-sm'}`}>
                            {c.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media Permission */}
                  <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-slate-100'}`}>
                      <div className="flex items-start gap-5">
                        <div className={`mt-0.5 p-2 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}><Icon name={booking.mediaAllowed ? 'camera' : 'video'} size={20} /></div>
                        <div className="flex-1">
                           <h3 className={`text-lg font-playfair font-medium mb-3 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.media_title}</h3>
                           <p className={`text-xs font-light leading-relaxed mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.media_desc}</p>
                           <button onClick={() => setBooking(b => ({ ...b, mediaAllowed: !b.mediaAllowed }))} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest ${booking.mediaAllowed ? 'bg-blue-600/10 border-blue-500 text-blue-500' : isDark ? 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 hover:bg-slate-50 shadow-sm'}`}>
                              <span>{booking.mediaAllowed ? 'Autorização Concedida' : 'Autorizar Anonimamente'}</span>
                              {booking.mediaAllowed ? <div className="flex items-center gap-2"><Icon name="check" size={16} /></div> : <span className={`text-[10px] px-3 py-1 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>{T.media_bonus}</span>}
                           </button>
                        </div>
                      </div>
                  </div>
                  
                  {/* Payment */}
                  <div className={`p-8 rounded-[2.5rem] border shadow-sm ${isDark ? 'bg-zinc-900/30 border-zinc-800/80' : 'bg-white border-slate-100'}`}>
                    <h3 className={`text-lg font-playfair font-medium mb-6 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.payment_title}</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'pix', label: 'Pix (3% OFF Adicional)', icon: 'smartphone' },
                        { id: 'card', label: isPT ? 'Cartão de Crédito/Débito' : 'Card', icon: 'credit-card' },
                        { id: 'money', label: isPT ? 'Espécie / Dinheiro' : 'Cash', icon: 'banknote' }
                      ].map(p => (
                        <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))} className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${booking.payment === p.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20 scale-[1.02]' : isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm'}`}>
                          <Icon name={p.icon} size={22} />
                          <span className="text-xs font-bold uppercase tracking-widest flex-1 text-left">{p.label}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${booking.payment === p.id ? 'border-white bg-blue-500' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                             {booking.payment === p.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className={`mt-6 p-4 rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-zinc-900/50 text-zinc-500' : 'bg-slate-50 text-slate-400'}`}>
                      <Icon name="shield" size={14} /> O pagamento é realizado apenas presencialmente.
                    </div>
                  </div>
                  
                  {/* Terms */}
                  <div onClick={() => setTermsOpen(true)} className={`flex items-center justify-between p-6 md:p-8 rounded-[2.5rem] border cursor-pointer transition-all duration-300 ${booking.termsAccepted ? 'bg-emerald-500/10 border-emerald-500/50' : isDark ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                    <div className="flex items-center gap-5">
                      <div className={`${booking.termsAccepted ? 'text-emerald-500' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name="shield" size={28} /></div>
                      <div>
                        <span className={`text-sm font-semibold block mb-1 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.terms_title}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Clique para revisar e aceitar</span>
                      </div>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted })); }} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-white' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                      {booking.termsAccepted && <Icon name="check" size={16} />}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {step === 4 && (
            <section className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-fade-in max-w-lg mx-auto">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-2xl ${isDark ? 'bg-zinc-900 border-zinc-800 text-blue-500' : 'bg-white border-slate-100 text-blue-600'}`}>
                  <Icon name="check" size={40} />
                </div>
              </div>
              <h2 className={`text-4xl font-playfair font-medium mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-base font-light leading-relaxed mb-12 px-6 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.success_sub}</p>
              
              <div className="flex flex-col gap-5 w-full px-4">
                <Button variant="whatsapp" size="xl" full icon="message" onClick={() => window.open(generateWhatsAppLink(), '_blank')}>{T.whatsapp_btn}</Button>
                <Button variant="secondary" size="lg" full icon="copy" onClick={copyToClipboard}>Copiar Resumo Oficial</Button>
                <button onClick={() => { setStep(0); setBooking({ ...booking, item: null, type: 'single', termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false }); }} className={`mt-6 text-[11px] font-bold uppercase tracking-widest transition-colors py-4 ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {/* Footer Navigation (Premium Fixed Bar) */}
      {step > 0 && step < 4 && booking.item && (
        <nav className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 animate-fade-in pointer-events-none">
          <div className={`max-w-4xl mx-auto rounded-full p-3 md:p-4 border backdrop-blur-2xl pointer-events-auto flex justify-between items-center transition-all shadow-2xl ${isDark ? 'bg-zinc-900/80 border-zinc-700/50 shadow-black/50' : 'bg-white/90 border-slate-200/80 shadow-slate-300/50'}`}>
            <button onClick={() => { setStep(s => s - 1); }} className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full transition-colors border border-transparent ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200'}`} aria-label="Voltar Etapa">
              <Icon name="chevron-left" size={24} />
            </button>
            
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{step === 3 ? T.total_label : T.subtotal}</p>
              <p className={`text-xl md:text-2xl font-playfair font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{step === 3 ? formatMoney(financials.total, isPT) : formatMoney(financials.sub, isPT)}</p>
            </div>
            
            <button onClick={handleNextStep} disabled={!isStepValid()} className={`h-12 md:h-14 px-6 md:px-8 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest flex items-center gap-3 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50 hover:-translate-y-0.5' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20 hover:-translate-y-0.5'}`}>
              {step === 3 ? T.finish_btn : T.next_btn} <Icon name="chevron-right" size={18} />
            </button>
          </div>
        </nav>
      )}
      
      {/* Modal Termos */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-xl max-h-[85vh] rounded-[2.5rem] p-8 md:p-10 flex flex-col border shadow-2xl shadow-black/50 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100'}`}>
            <button onClick={() => setTermsOpen(false)} className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-500' : 'hover:bg-slate-50 text-slate-400'}`} aria-label="Fechar"><Icon name="x" size={24} /></button>
            <h3 className={`text-2xl font-playfair font-medium mb-8 text-center shrink-0 ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{T.rules_complete}</h3>
            <div className="space-y-3 overflow-y-auto scrollbar-hide mb-8">
              {DATA.rules.map((rule, i) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className="shrink-0 pt-6">
              <Button full size="xl" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Popups */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center border shadow-2xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100'}`}>
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 border-4 shadow-inner ${isDark ? 'bg-zinc-900 border-zinc-800 text-blue-500' : 'bg-slate-50 border-slate-100 text-blue-600'}`}><Icon name="gift" size={40} /></div>
            <h3 className={`text-3xl font-playfair font-medium mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-sm font-light leading-relaxed mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.welcome_popup_msg}</p>
            <div className={`p-6 rounded-2xl border mb-8 border-dashed ${isDark ? 'bg-blue-900/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>BENEFÍCIO INAUGURAL</p>
              <p className={`text-3xl font-playfair font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>BEMVINDO10</p>
            </div>
            <button onClick={() => { setWelcomePopup(false); setUser(u => ({ ...u, hasSeenWelcome: true })); const welcomeCoupon = { id: 'welcome', val: 10, title: '🎁 BEMVINDO10', code: 'BEMVINDO10' }; setBooking(b => ({ ...b, appliedCoupon: welcomeCoupon })); setUser(prev => ({ ...prev, coupons: [...prev.coupons, welcomeCoupon] })); addToast(T.toast_coupon_success, "success"); }} className={`w-full h-14 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:-translate-y-0.5 ${isDark ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50' : 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20'}`}>
              {T.get_coupon}
            </button>
          </div>
        </div>
      )}
      
      {levelUpPopup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-md rounded-[2.5rem] p-10 md:p-12 text-center border shadow-2xl ${isDark ? 'bg-zinc-950 border-amber-500/30 shadow-amber-900/20' : 'bg-white border-slate-100 shadow-amber-500/10'}`}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none"><div className="absolute -top-32 -right-32 w-72 h-72 bg-amber-500/20 blur-3xl rounded-full" /></div>
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/40 text-white animate-bounce"><Icon name="trophy" size={40} /></div>
            <h3 className={`text-4xl font-playfair font-medium mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-base font-light leading-relaxed mb-10 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.levelup_popup_msg}</p>
            <button onClick={() => setLevelUpPopup(false)} className={`w-full h-14 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:-translate-y-0.5 ${isDark ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-amber-900/50' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/30'}`}>
              Resgatar Nova Conquista
            </button>
          </div>
        </div>
      )}
    </>
  );
}
