import * as React from 'react';
import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES ESTÁTICAS (PERFORMANCE)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v20_optimized', // Mantida para não perder XP e histórico
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_SECURE_V5',
  START_HOUR: 9,
  END_HOUR: 20,
  MAX_STORAGE_SIZE: 5000 
} as const;

// Caminhos SVG movidos para fora para não serem recriados a cada renderização
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
  'home': 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
};

// ==================================================================================
// 2. DESIGN SYSTEM & ESTILOS GLOBAIS (Copy Sênior / Minimalista)
// ==================================================================================

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    
    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    
    :root {
      --font-primary: 'Plus Jakarta Sans', sans-serif;
      --font-display: 'Playfair Display', serif;
    }

    html, body {
      background-color: ${isDark ? '#09090b' : '#f8fafc'};
      color: ${isDark ? '#ffffff' : '#0f172a'};
      transition: background-color 0.3s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      font-family: var(--font-primary);
    }
    
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
    .animate-slide-in { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    
    .emoji-icon { font-style: normal; display: inline-block; line-height: 1; vertical-align: middle; text-align: center; }
    
    .glass-panel {
      background: ${isDark ? 'rgba(9, 9, 11, 0.8)' : 'rgba(255, 255, 255, 0.9)'};
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-left: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
    }
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

// Formatador Sênior e Seguro
const formatMoney = (val: number | undefined, isPT: boolean = true) => {
  if (val === undefined || isNaN(val)) return isPT ? 'R$ 0,00' : '$0.00';
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
// 3. COMPONENTES DE UI (MEMORIZADOS PARA PERFORMANCE)
// ==================================================================================

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.97] font-poppins gap-2";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25",
    secondary: "bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-green-500/20",
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} role="presentation" />
      <aside className={`fixed top-0 right-0 h-full w-[85%] max-w-sm z-[70] p-6 shadow-2xl animate-slide-in glass-panel ${isDark ? 'text-white' : 'text-slate-900'}`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-display">Menu</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/10" aria-label="Fechar menu"><Icon name="x" size={24} /></button>
        </div>
        
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg">
          <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Histórico de Cuidado</p>
          <div className="flex justify-between items-end mt-1">
             <span className="text-2xl font-bold">{user.xp} XP</span>
             <Icon name="award" />
          </div>
        </div>

        <nav className="space-y-3">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-slate-200 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <Icon name={isDark ? "moon" : "sun"} className="text-blue-500" />
              <span className="font-medium">Interface</span>
            </div>
            <span className="text-xs font-bold opacity-50 uppercase">{isDark ? 'Noturna' : 'Clara'}</span>
          </button>
          
          <button onClick={toggleLang} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-slate-200 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <Icon name="globe" className="text-purple-500" />
              <span className="font-medium">Idioma</span>
            </div>
            <span className="text-xs font-bold opacity-50 uppercase">{lang}</span>
          </button>

          <button onClick={() => { if(navigator.share) navigator.share({title: 'Thalyson Massagens', url: window.location.href}) }} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-slate-200 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <Icon name="share" className="text-emerald-500" />
              <span className="font-medium">Compartilhar</span>
            </div>
          </button>
        </nav>
      </aside>
    </>
  );
});

const Card = memo(({ children, className = '', onClick, active = false, isDark = true, popular = false }: any) => (
  <div onClick={onClick} className={`relative p-8 rounded-3xl transition-all duration-300 flex flex-col h-full font-poppins ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-1' : ''} ${active ? 'bg-blue-900/10 border border-blue-500 shadow-lg shadow-blue-500/20' : isDark ? 'bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700' : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300'} ${className}`}>
    {popular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg border border-white/20">
        ✦ Jornada Assinatura
      </div>
    )}
    {children}
  </div>
));

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text", isDark = true, hasError = false }: any) => (
  <div className="space-y-2 w-full">
    {label && <label className={`text-xs font-bold uppercase tracking-wider font-poppins ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{label}</label>}
    <div className="relative">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${hasError ? 'text-red-500' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name={icon} size={20} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-12 rounded-xl outline-none text-sm font-medium transition-all font-poppins bg-transparent ${icon ? 'pl-12 pr-4' : 'px-4'} ${hasError ? 'border border-red-500 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500' : 'border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-600'}`} />
    </div>
  </div>
));

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`w-full h-full p-5 rounded-2xl transition-all duration-300 border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>{review.n.charAt(0)}</div>
        <div><span className={`text-sm font-semibold block ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{review.n}</span><span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{review.loc}</span></div>
      </div>
      <div className="flex gap-0.5" aria-label={`Avaliação: ${review.s} estrelas`}>{[...Array(5)].map((_, i) => <Icon key={i} name="star" size={14} className={i < review.s ? 'text-yellow-400 fill-yellow-400' : isDark ? 'text-zinc-700' : 'text-slate-400'} />)}</div>
    </div>
    <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{review.t}</p>
  </article>
));

const SmartTimer = memo(({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  useEffect(() => { 
    const interval = setInterval(() => { 
      setTime(prev => prev <= 0 ? 600 : prev - 1); 
    }, 1000); 
    return () => clearInterval(interval); 
  }, []);
  
  const format = (t: number) => { const m = Math.floor(t / 60); const s = t % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  const isUrgent = time < 60;
  
  return (
    <div className={`flex items-center justify-center gap-3 p-4 rounded-xl border transition-all font-inter ${isUrgent ? 'bg-red-500/10 border-red-500/30 text-red-400' : isDark ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
      <Icon name="watch" size={20} className={isUrgent ? 'animate-pulse' : ''} />
      <span className="text-sm font-semibold">{text}: <span className="font-mono">{format(time)}</span></span>
    </div>
  );
});

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-center justify-between text-left group font-inter" aria-expanded={isOpen}>
        <span className={`text-sm font-semibold font-inter ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{q}</span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : isDark ? 'text-zinc-500' : 'text-slate-500'}`}><Icon name="chevron-down" size={20} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}><p className={`text-sm font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p></div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Icon name={rule.icon} size={24} /></div>
    <div><h4 className={`text-base font-bold mb-1 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.title}</h4><p className={`text-sm leading-relaxed font-inter ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{rule.description}</p></div>
  </div>
));

// ==================================================================================
// 4. LÓGICA DE DADOS E FUNÇÕES PURAS (Com Validação Segura)
// ==================================================================================
const sanitizeInput = (value: string): string => value.replace(/[<>&"']/g, '');
const validateAddress = (address: Address): boolean => !!(address.street && address.number && address.district && address.city);

// Limpeza segura e silenciosa do cache
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
    { n: "Cliente", loc: "Atendimento em Casa", t: isPT ? "O Thalyson chegou na hora certa, quando eu precisava relaxar após as tensões de início de ano e pós-Carnaval. Foi a primeira vez que contratei um massagista pra atender em minha casa e a experiência foi incrível. Ele consegue deixar a gente relaxado, tem mãos incríveis e os efeitos são imediatos, pois eu levantei e parecia que pesava 10kg a menos. Recomendo e já quero de novo." : "Thalyson arrived at the exact right time, when I needed to relax after the tension of early year and post-Carnival. It was the first time I hired a massage therapist at my home and the experience was incredible. He leaves us relaxed, has amazing hands and the effects are immediate, because I stood up and felt 10kg lighter. Highly recommend and want it again." },
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
      { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Iniciante no Autocuidado" : "Self-Care Beginner" },
      { level: 2, xpNeeded: 100, reward: getPrice(15), title: isPT ? "Prioridade Certa" : "Right Priority" },
      { level: 3, xpNeeded: 350, reward: getPrice(30), title: isPT ? "Corpo Consciente" : "Conscious Body" },
      { level: 4, xpNeeded: 800, reward: getPrice(50), title: isPT ? "Plenitude Alcançada" : "Fullness Achieved" }
    ],
    services: [
      {
        id: 'depilacao',
        min: 45,
        price: p.depil,
        icon: "scissors",
        tag: isPT ? "CUIDADO PESSOAL" : "PERSONAL CARE",
        title: isPT ? "Aparo Corporal" : "Body Trimming",
        desc: isPT ? "Higiene e manutenção para quem valoriza a própria estética." : "Hygiene and maintenance for those who value aesthetics.",
        details: isPT 
          ? "Aparo uniforme com máquina profissional\nFoco em áreas extensas: peito, costas e pernas\nSensação de leveza e asseio corporal"
          : "Uniform trimming with professional machine\nFocus on extensive areas: chest, back, and legs\nFeeling of lightness and body cleanliness"
      },
      {
        id: 'relaxante',
        min: 60,
        price: p.relax,
        icon: "user-check",
        tag: isPT ? "ALÍVIO DE CARGA" : "LOAD RELIEF",
        title: isPT ? "Massagem Terapêutica" : "Therapeutic Massage",
        desc: isPT ? "Para quem carrega o estresse e o peso da rotina. Um respiro para corpo e mente." : "For those carrying the stress of routine. A breather for body and mind.",
        details: isPT 
          ? "Foco direto no desmanche de nódulos de tensão (lombar e cervical)\nPressão firme e acolhedora que devolve a mobilidade\nMomento de absoluto desligamento mental\n(Modalidade terapêutica muscular, sem apelo íntimo)" 
          : "Direct focus on dismantling tension knots\nFirm pressure that restores mobility\nMoment of absolute mental shutdown\n(Therapeutic muscle mode, no intimate appeal)"
      },
      {
        id: 'sensitiva',
        min: 60,
        price: p.sens,
        icon: "sparkles",
        tag: isPT ? "DESCONEXÃO MENTAL" : "MENTAL DISCONNECT",
        title: isPT ? "Tântrica Sensorial" : "Sensory Tantra",
        desc: isPT ? "Quando a mente não desliga. Desperte seus sentidos e recupere a presença." : "When the mind won't turn off. Awaken your senses and recover presence.",
        details: isPT 
          ? "Estímulos sutis que redirecionam o fluxo de pensamento\nAcolhimento e liberação emocional gradativa\nFinalização focada em liberação de endorfina\nPara quem busca esvaziar a mente sentindo o corpo" 
          : "Subtle stimuli that redirect thought flow\nWarmth and gradual emotional release\nFinish focused on endorphin release\nFor those seeking to empty the mind by feeling the body"
      },
      {
        id: 'mista',
        min: 60,
        price: p.titan,
        icon: "zap",
        popular: true, // Tag Visual Sênior
        tag: isPT ? "RESTAURAÇÃO PROFUNDA" : "DEEP RESTORATION",
        title: isPT ? "Fusion Experience" : "Fusion Experience",
        desc: isPT ? "A combinação exata: destrava a musculatura densa e revitaliza sua energia." : "The exact combination: unlocks dense musculature and revitalizes energy.",
        details: isPT 
          ? "Inicia quebrando a rigidez muscular causada pelo estresse\nTransita para um deslizamento corpo a corpo terapêutico\nProporciona uma descarga orgânica de tensão e energia estagnada\nA jornada ideal para quem precisa de resultados completos" 
          : "Starts breaking muscle stiffness caused by stress\nTransitions to a therapeutic body-to-body slide\nProvides an organic discharge of tension\nThe ideal journey for those needing complete results"
      },
      {
        id: 'nuru',
        min: 60,
        price: p.nuru,
        icon: "sparkles",
        tag: isPT ? "IMERSÃO & CALOR" : "IMMERSION & WARMTH",
        title: isPT ? "Experiência Nuru" : "Nuru Experience",
        desc: isPT ? "O nível máximo de acolhimento térmico. Um cuidado que derrete tensões." : "The maximum level of thermal warmth. Care that melts tensions.",
        details: isPT 
          ? "Aplicação de gel orgânico aquecido para relaxamento muscular imediato\nContato contínuo corpo a corpo, eliminando focos de estresse\nAumento do fluxo sanguíneo e liberação profunda de toxinas\nUma imersão rara focada em soltar o controle e apenas sentir" 
          : "Application of heated organic gel for immediate muscle relaxation\nContinuous body-to-body contact, eliminating stress focus\nIncreased blood flow and deep toxin release\nA rare immersion focused on letting go of control"
      }
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
      { q: isPT ? "A sessão tem foco profissional?" : "Is the session professionally focused?", a: isPT ? "Totalmente. O atendimento é estruturado para entregar bem-estar, alívio de tensões físicas e descarga de estresse emocional, respeitando rigorosamente os limites do seu corpo." : "Absolutely. The service is structured to deliver well-being, relief from physical tension, and emotional stress discharge, strictly respecting your body's limits." },
      { q: isPT ? "O sigilo do atendimento é garantido?" : "Is confidentiality guaranteed?", a: isPT ? "Ética é o pilar base do meu trabalho. Atendo pessoas de todas as esferas públicas e privadas sob um pacto de confidencialidade inegociável." : "Ethics is the foundational pillar of my work. I serve people from all public and private spheres under an unnegotiable confidentiality pact." },
      { q: isPT ? "Como preparo meu ambiente?" : "How should I prepare my space?", a: isPT ? "Você só precisa do seu próprio chuveiro e da sua cama (ou do hotel). Uma ducha morna prévia é a melhor preparação orgânica que você pode oferecer à sua musculatura antes de começarmos." : "You only need your own shower and your bed. A warm shower beforehand is the best organic preparation you can offer your muscles." },
      { q: isPT ? "Existe uma tolerância para a chegada?" : "Is there a time tolerance?", a: isPT ? "O respeito ao seu tempo e ao tempo dos próximos clientes exige uma tolerância técnica de 15 minutos. Atrasos superiores serão encurtados da sessão original." : "Respect for your time and next clients requires a 15-minute technical tolerance. Delays will be deducted from the session." },
      { q: isPT ? "Tenho tensões com o formato do meu corpo..." : "I have tensions about my body shape...", a: isPT ? "O ambiente da massagem é uma zona livre de julgamentos estéticos. O foco do toque é puramente terapêutico e acolhedor. O respeito por você vem antes de qualquer técnica." : "The massage environment is an aesthetic judgment-free zone. The focus of the touch is purely therapeutic and welcoming." }
    ],
    rules: isPT ? [
      { icon: "shower", title: "Preparação Física", description: "O banho prévio remove impurezas da rotina e facilita a absorção do relaxamento cutâneo." },
      { icon: "hand", title: "Limites e Respeito", description: "O conforto mútuo sustenta a qualidade do atendimento. O bom senso guia a sessão." },
      { icon: "shield", title: "Blindagem de Sigilo", description: "O que compartilhamos no seu espaço, morre no seu espaço. Sua privacidade é absoluta." },
      { icon: "user-check", title: "Sem Avaliações", description: "Você não está aqui para ser julgado, e sim para ser cuidado e restaurado." },
      { icon: "clock", title: "Pontualidade Ética", description: "A fluidez da agenda depende do cumprimento dos horários. Avise alterações com 2h de recuo." }
    ] : [
      { icon: "shower", title: "Physical Preparation", description: "A prior shower removes routine impurities and facilitates the absorption of skin relaxation." },
      { icon: "hand", title: "Boundaries and Respect", description: "Mutual comfort sustains service quality. Common sense guides the session." },
      { icon: "shield", title: "Secrecy Shield", description: "What we share in your space, stays in your space. Your privacy is absolute." },
      { icon: "user-check", title: "No Evaluations", description: "You are not here to be judged, but to be cared for and restored." },
      { icon: "clock", title: "Ethical Punctuality", description: "Schedule fluidity depends on keeping time. Notify changes 2 hours in advance." }
    ],
    reviews: generateReviews(isPT),
    text: {
      welcome: isPT ? "Olá," : "Hello,",
      choose_sub: isPT ? "O peso da rotina esgota. Qual nível de descompressão seu corpo pede hoje?" : "The weight of routine exhausts. What level of decompression does your body ask for today?",
      level_label: isPT ? "Nível de Constância" : "Consistency Level",
      tab_packs: isPT ? "Jornadas de Cuidado" : "Care Journeys",
      tab_single: isPT ? "Sessão Única" : "Single Session",
      book_btn: isPT ? "Priorizar Momento" : "Prioritize Moment",
      next_btn: isPT ? "Avançar Etapa" : "Next Step",
      finish_btn: isPT ? "Confirmar Cuidado" : "Confirm Care",
      loading: isPT ? "Preparando o sistema de reservas..." : "Preparing booking system...",
      toast_select_item: isPT ? "Identifique a modalidade terapêutica desejada" : "Identify the therapeutic modality",
      toast_select_date: isPT ? "Defina a melhor data e horário para a pausa" : "Set the best date and time for the pause",
      toast_fill_name: isPT ? "Por favor, insira o nome de registro." : "Please enter your name.",
      toast_fill_addr: isPT ? "O endereço completo garante a logística correta." : "Complete address ensures correct logistics.",
      toast_fill_hotel: isPT ? "Identifique o hotel para o acesso corporativo." : "Identify the hotel for corporate access.",
      toast_select_pay: isPT ? "Defina a modalidade de acerto." : "Define the payment method.",
      toast_accept_terms: isPT ? "A validação do pacto de respeito é obrigatória." : "Validation of the respect pact is mandatory.",
      toast_coupon_success: isPT ? "Benefício ativado com sucesso em sua jornada." : "Benefit successfully activated.",
      toast_coupon_invalid: isPT ? "Código de benefício expirado ou inexistente." : "Benefit code expired or non-existent.",
      details_label: isPT ? "Análise do Protocolo" : "Protocol Analysis",
      select_time_title: isPT ? "Definição de Agenda" : "Schedule Definition",
      location_title: isPT ? "Logística de Encontro" : "Encounter Logistics",
      extras_title: isPT ? "Adicionais Clínicos e Sensoriais" : "Clinical and Sensory Add-ons",
      coupon_section: isPT ? "Código de Benefício" : "Benefit Code",
      no_coupons: isPT ? "Nenhum benefício retido na conta." : "No benefits retained in the account.",
      payment_title: isPT ? "Liquidação do Honorário" : "Fee Settlement",
      terms_title: isPT ? "Pacto de Tratamento e Sigilo" : "Treatment and Secrecy Pact",
      success_title: isPT ? "Protocolo Gerado!" : "Protocol Generated!",
      success_sub: isPT ? "Seu pedido de reserva está rascunhado. Direcione o sumário ao WhatsApp corporativo para averbação final." : "Your booking request is drafted. Direct the summary to corporate WhatsApp for final confirmation.",
      whatsapp_btn: isPT ? "Submeter via WhatsApp" : "Submit via WhatsApp",
      back_home: isPT ? "Retornar ao Painel" : "Return to Dashboard",
      timer_text: isPT ? "Reserva sistêmica" : "System reservation",
      motel_note: isPT ? "O deslocamento é garantido. A averbação do leito fica sob encargo do titular da reserva." : "Displacement is guaranteed. Suite booking is the responsibility of the reservation holder.",
      upgrade_msg: isPT ? "Excelente escolha para alívio estrutural. Caso a tensão seja também mental, sugere-se observar a modalidade Tântrica." : "Excellent choice for structural relief. If tension is also mental, consider the Tantric modality.",
      input_name: isPT ? "Nome de Identificação" : "Identification Name",
      input_addr: isPT ? "Endereço Residencial (Rua)" : "Residential Address (Street)",
      input_num: isPT ? "Número Residencial" : "Number",
      input_district: isPT ? "Setor / Bairro" : "Sector / District",
      input_city: isPT ? "Município" : "City",
      input_comp: isPT ? "Dados Adicionais (Apto/Bloco)" : "Additional Data (Apt/Block)",
      input_hotel: isPT ? "Hospedagem (Nome)" : "Accommodation (Name)",
      input_room: isPT ? "Identificação da Suíte" : "Suite Identification",
      agree_terms: isPT ? "Homologo a compreensão das normas de ética" : "I homologate understanding of the ethical norms",
      install_app: isPT ? "Acesso Rápido" : "Quick Access",
      install_desc: isPT ? "Firme o atalho corporativo na página inicial para discrição contínua." : "Fix the corporate shortcut to the home page for continuous discretion.",
      faq_title: isPT ? "Esclarecimento de Políticas" : "Policy Clarification",
      reviews_title: isPT ? "Registros de Transformação" : "Records of Transformation",
      empty_date: isPT ? "Selecione uma janela viável" : "Select a viable window",
      empty_slots: isPT ? "Grade profissional esgotada nesta data" : "Professional grid depleted on this date",
      total_label: isPT ? "Custo Efetivo Final" : "Effective Final Cost",
      subtotal: isPT ? "Base dos Honorários" : "Fee Base",
      discount: isPT ? "Amortização" : "Amortization",
      pix_discount: isPT ? "Liquidação Instantânea (PIX)" : "Instant Settlement (PIX)",
      welcome_popup_title: isPT ? "Bem-vindo ao Autocuidado" : "Welcome to Self-Care",
      welcome_popup_msg: isPT ? "É um prazer ter você aqui. Priorizar o próprio corpo é o primeiro passo de mudança. Ative seu benefício inaugural para darmos andamento." : "It's a pleasure to have you here. Prioritizing your own body is the first step of change. Activate your inaugural benefit to proceed.",
      levelup_popup_title: isPT ? "Reconhecimento de Constância!" : "Consistency Recognition!",
      levelup_popup_msg: isPT ? "Sua adesão ao autocuidado evoluiu as métricas do sistema. Esta é a consolidação de quem prioriza a saúde mental e física." : "Your adherence to self-care evolved the system's metrics. This is the consolidation of someone who prioritizes mental and physical health.",
      get_coupon: isPT ? "Acoplar Benefício" : "Attach Benefit",
      rules_complete: isPT ? "Declaração de Conformidade" : "Declaration of Compliance",
      media_discount: isPT ? "Abatimento de Midia Integrada (1%)" : "Media Integrated Abatement (1%)",
      media_title: isPT ? "Concessão Visual" : "Visual Concession",
      media_desc: isPT ? "Autorizo a captura descaracterizada (ausência facial/áreas íntimas) para acervo de portfólio." : "I authorize uncharacterized capture (no facial/intimate areas) for portfolio collection.",
      media_bonus: isPT ? "Habilitar para 1% de amortização" : "Enable for 1% amortization",
      uber_notice: isPT ? "Logística (Uber): Indexada diretamente no escopo do WhatsApp." : "Logistics (Uber): Indexed directly in the WhatsApp scope."
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
  const [manualCouponInput, setManualCouponInput] = useState(''); 
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;
  
  // ordersCount base = 0 aqui, mas será 69 na UI somado com esse 0 para evitar bugs no salvamento.
  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 0, lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  
  // Title update
  useEffect(() => {
    if (isClient) {
        document.title = step === 0 ? "Thalyson Massagens - Protocolo de Relaxamento" : "Thalyson - Confirmação do Cuidado";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = "Atendimento terapêutico e descompressão tântrica focada no alívio severo de estresse. Logística domiciliar ou hoteleira. Agendamento em total sigilo.";
            document.head.appendChild(meta);
        }
    }
  }, [step, isClient]);

  // Init cache and cleanup
  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
  }, []);
  
  // Safe Storage Loader
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
            ordersCount: typeof parsed.user.ordersCount === 'number' ? parsed.user.ordersCount : 0, // Garante número inteiro real da máquina
            lastActivity: parsed.user.lastActivity || new Date().toISOString()
          };
        }
        
        if (parsed.bookingDraft && typeof parsed.bookingDraft === 'object') {
          const draftDate = parsed.bookingDraft.date ? new Date(parsed.bookingDraft.date) : null;
          if (draftDate && draftDate > new Date()) {
            loadedBooking = {
              ...booking,
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
            };
          }
        }
        
        if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) {
          loadedStep = parsed.step;
        }
      }
    } catch (e) { 
      localStorage.removeItem(CONFIG.STORAGE_KEY); 
    }
    
    setUser(loadedUser);
    setBooking(loadedBooking);
    setStep(loadedStep);
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 1200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);
  
  // Safe Storage Saver
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
        if (serialized.length < CONFIG.MAX_STORAGE_SIZE * 1024) { 
          localStorage.setItem(CONFIG.STORAGE_KEY, serialized); 
        }
      } catch (e) {
        console.error('Storage error', e);
      }
    }
  }, [user, booking, step, isClient, dataLoaded]);
  
  useEffect(() => {
    if (!loading && isClient && dataLoaded && !user.hasSeenWelcome && !welcomePopup) {
      const timer = setTimeout(() => setWelcomePopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded, welcomePopup]);
  
  useEffect(() => { 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }, [step]);
  
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  
  const handleSelectItem = useCallback((type: 'single' | 'pack', item: ServiceItem) => {
    setBooking(prev => ({ ...prev, type, item, extras: {}, payment: '', termsAccepted: false, bookingId: `BOOK_${Date.now()}` }));
    if (item.id === 'relaxante') addToast(DATA.text.upgrade_msg, "success"); // Changed to success visual to match clean UI
    else addToast(item.title, "success");
    setTimeout(() => setStep(1), 400);
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
  
  // Safe Financial Calculation
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
    if (currentXP >= 800) return { needed: 500 - ((currentXP - 800) % 500), reward: 50, title: "Plenitude Alcançada Plus" };
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
    let serviceTitle = booking.item?.title || ''; if (booking.type !== 'single' && booking.item?.desc) serviceTitle += ` ${lang === 'pt' ? '(Jornada)' : '(Journey)'}`;
    
    let locTxt = ""; let mapQuery = "";
    if (booking.locationType === 'home') { 
      const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`; 
      locTxt = `🏠 *${lang === 'pt' ? 'Residência' : 'Home'}*\n📍 ${fullAddr}\n📝 ${lang === 'pt' ? 'Dados Extras' : 'Unit'}: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    else if (booking.locationType === 'motel') { 
      locTxt = `🏩 *Motel*\n⚠️ (${lang === 'pt' ? 'Averbação por conta do titular' : 'Venue fee on client'})`; 
    }
    else { 
      const fullAddr = `${booking.address.placeName}, ${booking.address.city}`; 
      locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 ${lang === 'pt' ? 'Suíte' : 'Room'}: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    
    const extrasList = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => { 
      const ex = DATA.extras.find(e => e.id === k); 
      if (!ex) return ''; 
      return `✅ ${ex.label} (+${formatMoney(booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price, lang === 'pt')})`; 
    }).filter(Boolean).join('\n');
    
    let priceDetails = `💵 *${lang === 'pt' ? 'Honorário Base' : 'Base'} (${serviceTitle}):* ${formatMoney(booking.item?.price || 0, lang === 'pt')}`;
    if (f.disc > 0) priceDetails += `\n📉 *${lang === 'pt' ? 'Amortização' : 'Coupon'} (${booking.appliedCoupon?.code}):* -${formatMoney(f.disc, lang === 'pt')}`;
    if (f.mediaDisc > 0) priceDetails += `\n📸 *${lang === 'pt' ? 'Mídia Integrada (1%)' : 'Media (1%)'}:* -${formatMoney(f.mediaDisc, lang === 'pt')}`;
    if (f.pixDisc > 0) priceDetails += `\n💸 *PIX (3%):* -${formatMoney(f.pixDisc, lang === 'pt')}`;
    priceDetails += `\n\n💰 *CUSTO EFETIVO: ${formatMoney(f.total, lang === 'pt')}*`;
    
    return `
*${lang === 'pt' ? 'SUBMISSÃO DE PROTOCOLO' : 'NEW BOOKING'}* | #${securityHash}
──────────────────
👤 *${lang === 'pt' ? 'Titular' : 'Client'}:* ${sanitizeInput(user.name)}
📅 *${lang === 'pt' ? 'Agendamento' : 'Date'}:* ${dateStr}
⏰ *${lang === 'pt' ? 'Janela de Tempo' : 'Time'}:* ${booking.time}

💆‍♂️ *${lang === 'pt' ? 'PROJETO TERAPÊUTICO' : 'SESSION'}:*
*${serviceTitle}*
${extrasList ? `\n➕ *${lang === 'pt' ? 'COMPLEMENTOS CLÍNICOS' : 'ADD-ONS'}:*\n${extrasList}` : ''}

📍 *${lang === 'pt' ? 'DIRETRIZ DE LOCAL' : 'LOCATION'}:*
${locTxt}
${mapQuery ? `🔗 Rota Fixada: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : ''}

🚗 *${lang === 'pt' ? 'TAXA DE MOBILIDADE (UBER)' : 'TRANSPORT (UBER)'}:*
*${lang === 'pt' ? 'A ser indexada na aprovação' : 'To be agreed separately'}*

💰 *${lang === 'pt' ? 'ANÁLISE DE HONORÁRIOS' : 'FINANCIAL SUMMARY'}:*
${priceDetails}

💳 *${lang === 'pt' ? 'Modalidade de Acerto' : 'Payment'}:* ${booking.payment.toUpperCase()}
──────────────────
*Sessão condicionada à resposta da equipe de atendimento.*
    `.trim();
  };

  const generateWhatsAppLink = () => `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(generateWhatsAppMsg())}`;
  
  const copyToClipboard = () => { 
    navigator.clipboard.writeText(generateWhatsAppMsg()); 
    addToast(lang === 'pt' ? "Sumário averbado e copiado!" : "Summary copied!", "success"); 
  };
  
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
      
      {/* Container de Background Limpo */}
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
              <div className="flex flex-col cursor-pointer transition-opacity" onClick={() => setStep(0)} title="Voltar ao Início">
                <h1 className={`text-3xl font-playfair tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Thalyson <br className="block md:hidden" /> Massagens
                </h1>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest mt-3 font-medium font-inter">
                  <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-500"></span></span>
                  {/* Corrigido o Bug do Contador -> soma base fake com reais */}
                  {69 + user.ordersCount} Vidas Reestruturadas
                </div>
              </div>
              <div className="flex items-center gap-4">
                {step > 0 && (
                  <button onClick={() => setStep(0)} className={`hidden md:flex items-center gap-2 text-xs font-semibold uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-700'}`}>
                    Painel Central
                  </button>
                )}
                <button onClick={() => setMenuOpen(true)} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all border ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                   <Icon name="menu" size={20} />
                </button>
              </div>
            </div>
            
            {/* Indicador de Progresso (UX Limpa) */}
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
                              Base: <span className="line-through">{formatMoney(s.fullPrice, isPT)}</span>
                            </span>
                          )}
                          <span className={`text-2xl font-playfair font-medium ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                            {formatMoney(s.price, isPT)}
                          </span>
                          {s.savings && (
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full block mt-2 border ${isDark ? 'bg-zinc-800 text-zinc-300 border-zinc-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              BENEFÍCIO: {formatMoney(s.savings, isPT)}
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
              
              {/* Depoimentos */}
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
              
              {/* FAQ Sênior */}
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
                      <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} icon="map-pin" placeholder={isPT ? "Avenida / Rua" : "Street"} hasError={!booking.address.street} />
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
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder={isPT ? "Nome da Instalação" : "Hotel name"} hasError={!booking.address.placeName} />
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
                    Análise do Protocolo
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
                          EXTENSÕES CLÍNICAS
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
                          <span className="text-sm font-light">{T.discount} ({booking.appliedCoupon?.title})</span>
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
                      <input type="text" value={manualCouponInput} onChange={(e) => setManualCouponInput(e.target.value)} placeholder="Validação Técnica" className={`flex-1 h-12 px-4 rounded-xl text-sm outline-none font-mono uppercase transition-all bg-transparent border ${isDark ? 'border-zinc-800 focus:border-zinc-500 text-zinc-100 placeholder:text-zinc-700' : 'border-slate-300 focus:border-slate-400 text-slate-900 placeholder:text-slate-400'}`} />
                      <button onClick={applyManualCoupon} className={`px-5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>Ativar</button>
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
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name={booking.mediaAllowed ? 'camera' : 'video'} size={20} /></div>
                        <div className="flex-1">
                           <h3 className={`text-lg font-playfair mb-2 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.media_title}</h3>
                           <p className={`text-xs font-light leading-relaxed mb-5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.media_desc}</p>
                           <button onClick={() => setBooking(b => ({ ...b, mediaAllowed: !b.mediaAllowed }))} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-xs font-bold uppercase tracking-widest ${booking.mediaAllowed ? isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-slate-100 border-slate-200 text-slate-800' : isDark ? 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                              <span>{booking.mediaAllowed ? 'Concedido' : 'Reter Autorização'}</span>
                              {booking.mediaAllowed ? <div className="flex items-center gap-2"><span className={`text-[9px] px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-700 text-zinc-300' : 'bg-slate-200 text-slate-600'}`}>-1%</span><Icon name="check" size={14} /></div> : <span className={`text-[9px] ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>{T.media_bonus}</span>}
                           </button>
                        </div>
                      </div>
                  </div>
                  
                  <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-zinc-900/20 border-zinc-800/60' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <h3 className={`text-lg font-playfair mb-5 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.payment_title}</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'pix', label: 'Pix (3% de Amortização)', icon: 'smartphone' },
                        { id: 'card', label: isPT ? 'Cartão' : 'Card', icon: 'credit-card' },
                        { id: 'money', label: isPT ? 'Espécie' : 'Cash', icon: 'banknote' }
                      ].map(p => (
                        <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))} className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${booking.payment === p.id ? isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-200' : 'bg-slate-100 border-slate-200 text-slate-800' : isDark ? 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-transparent border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                          <Icon name={p.icon} size={20} />
                          <span className="text-xs font-bold uppercase tracking-widest flex-1 text-left">{p.label}</span>
                          {booking.payment === p.id && <Icon name="check" size={16} />}
                        </button>
                      ))}
                    </div>
                    <p className={`text-[10px] text-center mt-5 font-light flex items-center justify-center gap-1.5 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name="shield" size={12} /> Exigência financeira exclusiva ao final da sessão.</p>
                  </div>
                  
                  <div onClick={() => setTermsOpen(true)} className={`flex items-center justify-between p-6 rounded-[2rem] border cursor-pointer transition-all ${booking.termsAccepted ? isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-100 border-slate-200' : isDark ? 'bg-zinc-900/20 border-zinc-800/60 hover:border-zinc-700' : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`${booking.termsAccepted ? isDark ? 'text-zinc-300' : 'text-slate-700' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name="shield" size={20} /></div>
                      <div>
                        <span className={`text-sm font-medium block mb-1 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.terms_title}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Revisão do código de ética</span>
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
                <Button variant="secondary" size="lg" full icon="copy" onClick={copyToClipboard}>Copiar Rascunho Clínico</Button>
                <button onClick={() => { setStep(0); setBooking({ ...booking, item: null, type: 'single', termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false }); }} className={`mt-4 text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-slate-400 hover:text-slate-600'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {/* Footer Navigation Clean com botão CANCELAR (VOLTAR PARA INÍCIO) */}
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
            
            <button 
              onClick={handleNextStep} 
              disabled={!isStepValid()}
              className={`h-12 px-6 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${isDark ? 'bg-zinc-200 text-zinc-900 hover:bg-white' : 'bg-slate-900 text-white hover:bg-black'}`}
            >
              {step === 3 ? T.finish_btn : T.next_btn} <Icon name="chevron-right" size={16} />
            </button>
          </div>
        </nav>
      )}
      
      {/* Modais */}
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
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>CUPOM INAUGURAL</p>
              <p className={`text-2xl font-playfair tracking-wide ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>BEMVINDO10</p>
            </div>
            <button onClick={() => { setWelcomePopup(false); setUser(u => ({ ...u, hasSeenWelcome: true })); const welcomeCoupon = { id: 'welcome', val: 10, title: '🛡️ BEMVINDO10', code: 'BEMVINDO10' }; setBooking(b => ({ ...b, appliedCoupon: welcomeCoupon })); setUser(prev => ({ ...prev, coupons: [...prev.coupons, welcomeCoupon] })); addToast(T.toast_coupon_success, "success"); }} className={`w-full h-14 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-200 text-zinc-900 hover:bg-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
              {T.get_coupon}
            </button>
          </div>
        </div>
      )}
      
      {levelUpPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100 shadow-2xl'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-8 border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}><Icon name="trophy" size={32} /></div>
            <h3 className={`text-2xl font-playfair mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-sm font-light leading-relaxed mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.levelup_popup_msg}</p>
            <button onClick={() => setLevelUpPopup(false)} className={`w-full h-14 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-200 text-zinc-900 hover:bg-white' : 'bg-slate-900 text-white hover:bg-black'}`}>
              Confirmar Reconhecimento
            </button>
          </div>
        </div>
      )}
    </>
  );
}
