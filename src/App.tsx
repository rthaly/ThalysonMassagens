import * as React from 'react';
import { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES ESTÁTICAS (PERFORMANCE)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v20_optimized', // Versão atualizada
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_SECURE_V5',
  START_HOUR: 9,
  END_HOUR: 20,
  MAX_STORAGE_SIZE: 5000 
} as const;

// Caminhos SVG movidos para fora para não serem recriados a cada renderização (Ganho massivo de FPS)
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
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 01-3-3v-6l6 6v3z M18 20a3 3 0 003-3v-6l-6 6v3z'
};

// ==================================================================================
// 2. DESIGN SYSTEM & ESTILOS GLOBAIS
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
    
    /* Animações */
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

// Ícone Memorizado (Melhor Performance)
const Icon = memo(({ name, size = 22, className = "", isEmoji = false }: { name: string, size?: number, className?: string, isEmoji?: boolean }) => {
  if (isEmoji) return <span className={`emoji-icon ${className}`} style={{ fontSize: size }} role="img" aria-label={name}>{name}</span>;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={ICON_PATHS[name] || ''} />
    </svg>
  );
});

// Types e Interfaces
interface ServiceItem { id: string; min: number; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; }
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
    secondary: "bg-zinc-800 border-2 border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-green-500/20",
    outline: "bg-transparent border-2 border-zinc-600 text-zinc-300 hover:border-zinc-400",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"
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
          <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Seu Nível Atual</p>
          <div className="flex justify-between items-end mt-1">
             <span className="text-2xl font-bold">{user.xp} XP</span>
             <Icon name="award" />
          </div>
        </div>

        <nav className="space-y-3">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-slate-200 hover:bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <Icon name={isDark ? "moon" : "sun"} className="text-blue-500" />
              <span className="font-medium">Tema</span>
            </div>
            <span className="text-xs font-bold opacity-50 uppercase">{isDark ? 'Escuro' : 'Claro'}</span>
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
        
        <div className="absolute bottom-6 left-6 right-6 text-center opacity-30 text-xs">
          <p>Thalyson App v2.0 Optimized</p>
        </div>
      </aside>
    </>
  );
});

const Card = memo(({ children, className = '', onClick, active = false, isDark = true }: any) => (
  <div onClick={onClick} className={`relative p-8 rounded-3xl transition-all duration-300 flex flex-col h-full font-poppins ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-1' : ''} ${active ? 'bg-blue-900/10 border-2 border-blue-500 shadow-lg shadow-blue-500/20' : isDark ? 'bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700' : 'bg-white border border-slate-200 shadow-lg hover:border-slate-300'} ${className}`}>
    {children}
  </div>
));

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text", isDark = true }: any) => (
  <div className="space-y-2 w-full">
    {label && <label className={`text-xs font-bold uppercase tracking-wider font-poppins ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{label}</label>}
    <div className="relative">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name={icon} size={20} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-12 rounded-xl outline-none text-sm font-medium transition-all font-poppins ${icon ? 'pl-12 pr-4' : 'px-4'} ${isDark ? 'bg-zinc-900 border-2 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500' : 'bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-600'}`} />
    </div>
  </div>
));

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`w-full h-full p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 border ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-md'}`}>
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
  // Intervalo corrigido para limpar corretamente
  useEffect(() => { 
    const interval = setInterval(() => { 
      setTime(prev => prev <= 0 ? 600 : prev - 1); 
    }, 1000); 
    return () => clearInterval(interval); 
  }, []);
  
  const format = (t: number) => { const m = Math.floor(t / 60); const s = t % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  const isUrgent = time < 60;
  
  return (
    <div className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-inter ${isUrgent ? 'bg-red-500/10 border-red-500/30 text-red-400' : isDark ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
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
// 4. LÓGICA DE DADOS E FUNÇÕES PURAS
// ==================================================================================
const sanitizeInput = (value: string): string => value.replace(/[<>&"']/g, '');
const validateAddress = (address: Address): boolean => !!(address.street && address.number && address.district && address.city);

// Cleanup mais seguro, evita limpar dados de outros sites se rodar em domínio compartilhado
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
  } catch (e) { 
    console.error('Storage cleanup error:', e); 
  } 
};

// Dados extraídos para manter a lógica limpa
const generateReviews = (isPT: boolean): Review[] => {
  const realReviews = [
    { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: isPT ? "Você tem mãos abençoadas e eu voeeei! Precisava muito desse descanso, dessa paz. Foi super respeitoso a todo tempo e me relaxou demais. Obrigada! ❤️" : "You have blessed hands and I soared! I really needed this rest, this peace. It was super respectful all the time and relaxed me a lot. Thank you! ❤️" },
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
  const currency = isPT ? 'R$' : '$';
  const USD_RATE = 5.75;

  const getPrice = (brl: number) => isPT ? brl : Math.round(brl / USD_RATE);

  const p = {
    relax: getPrice(145),
    sens: getPrice(175),
    titan: getPrice(205),
    depil: getPrice(110),
    packRelax: { v: getPrice(490), full: getPrice(585), save: getPrice(95) },
    packTri: { v: getPrice(525), full: getPrice(615), save: getPrice(90) },
    packMix: { v: getPrice(640), full: getPrice(760), save: getPrice(120) },
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
        details: isPT 
          ? "Aparo completo com máquina (Zero ou Pente)\nPeito, pernas, braços e costas"
          : "Full body trimming with machine\nChest, legs, arms, and back"
      },
      {
        id: 'relaxante',
        min: 60,
        price: p.relax,
        icon: "user-check",
        tag: isPT ? "ALÍVIO & PAZ" : "RELIEF & PEACE",
        title: isPT ? "Massagem Clássica" : "Classic Massage",
        desc: isPT ? "Para quem carrega o peso do mundo. Relaxe profundamente." : "For those carrying the world's weight. Deep relaxation.",
        details: isPT 
          ? "Toque firme e acolhedor nas costas e pernas\nAlivia o estresse e o cansaço mental\nUm momento só seu de silêncio e paz\n(Modalidade terapêutica, sem toque íntimo)" 
          : "Firm and welcoming touch on back and legs\nRelieves stress and mental fatigue\nA moment of peace just for you\n(Therapeutic mode, no intimate touch)"
      },
      {
        id: 'sensitiva',
        min: 60,
        price: p.sens,
        icon: "sparkles",
        tag: isPT ? "DESPERTAR SENSORIAL" : "SENSORY AWAKENING",
        title: isPT ? "Tântrica Sensorial" : "Sensory Tantra",
        desc: isPT ? "Reconecte-se com seu corpo. Toques sutis que arrepiam." : "Reconnect with your body. Subtle touches that thrill.",
        details: isPT 
          ? "Toques leves para despertar a pele\nSensação de leveza e acolhimento\nFinalização especial (Lingam)\nPara quem busca sentir mais" 
          : "Touches to awaken the skin\nFeeling of lightness and warmth\nSpecial finish (Lingam)\nFor those seeking to feel more"
      },
      {
        id: 'mista',
        min: 60,
        price: p.titan,
        icon: "zap",
        tag: isPT ? "EXPERIÊNCIA COMPLETA" : "FULL EXPERIENCE",
        title: isPT ? "Fusion Experience" : "Fusion Experience",
        desc: isPT ? "A união perfeita: relaxamento muscular + energia intensa." : "The perfect union: muscle relaxation + intense energy.",
        details: isPT 
          ? "Começa tirando a tensão muscular\nEvolui para uma troca de energia corpo a corpo\nFinalização intensa e libertadora\nA escolha favorita de quem quer tudo" 
          : "Starts removing muscle tension\nEvolves into body-to-body energy exchange\nIntense and liberating finish\nThe favorite choice for those who want it all"
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
      choose_sub: isPT ? "Como você quer se sentir hoje? Escolha sua experiência." : "How do you want to feel today? Choose your experience.",
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
  const [activeTab, setActiveTab] = useState('packs');
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error"}[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;
  
  const [user, setUser] = useState<UserData>({
    name: '',
    xp: 0,
    coupons: [],
    usedCoupons: [],
    hasSeenWelcome: false,
    ordersCount: 69,
    lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single',
    item: null,
    extras: {},
    date: null,
    time: null,
    locationType: 'home',
    address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    payment: '',
    appliedCoupon: null,
    termsAccepted: false,
    bookingId: `BOOK_${Date.now()}`,
    mediaAllowed: false
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  
  // SEO: Atualizar título da página
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
            const validatedUser = {
              name: parsed.user.name || '',
              xp: typeof parsed.user.xp === 'number' ? parsed.user.xp : 0,
              coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
              usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
              hasSeenWelcome: typeof parsed.user.hasSeenWelcome === 'boolean' ? parsed.user.hasSeenWelcome : false,
              ordersCount: typeof parsed.user.ordersCount === 'number' ? Math.max(parsed.user.ordersCount, 69) : 69,
              lastActivity: parsed.user.lastActivity || new Date().toISOString()
            };
            setUser(validatedUser);
          }
          
          if (parsed.bookingDraft && typeof parsed.bookingDraft === 'object') {
            const draftDate = new Date(parsed.bookingDraft.date);
            if (draftDate > new Date()) {
              const sanitizedBooking = {
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
              setBooking(sanitizedBooking);
            }
          }
          
          if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) {
            setStep(parsed.step);
          }
        } catch (e) {
          console.error('Error parsing stored data:', e);
          localStorage.removeItem(CONFIG.STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error('Storage access error:', e);
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
    
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 1200);
  }, [isClient]);
  
  useEffect(() => {
    if (isClient && dataLoaded) {
      try {
        const saveData = {
          user: { ...user, lastActivity: new Date().toISOString() },
          bookingDraft: {
            ...booking,
            appliedCoupon: booking.appliedCoupon ? {
              id: booking.appliedCoupon.id,
              val: booking.appliedCoupon.val,
              title: booking.appliedCoupon.title,
              code: booking.appliedCoupon.code
            } : null
          },
          step,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        const serialized = JSON.stringify(saveData);
        if (serialized.length < CONFIG.MAX_STORAGE_SIZE * 1024) { // Check size limit
            localStorage.setItem(CONFIG.STORAGE_KEY, serialized);
        }
        cleanupStorage();
      } catch (e) {
        console.error('Storage error:', e);
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
    scrollRef.current?.scrollTo(0, 0);
    window.scrollTo(0,0);
  }, [step]);
  
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  
  const handleSelectItem = useCallback((type: 'single' | 'pack', item: ServiceItem) => {
    setBooking(prev => ({ 
      ...prev, 
      type, 
      item, 
      extras: {}, 
      payment: '', 
      termsAccepted: false,
      bookingId: `BOOK_${Date.now()}`
    }));
    
    if (item.id === 'relaxante') {
      addToast(DATA.text.upgrade_msg, "error");
    } else {
      addToast(item.title, "success");
    }
  }, [addToast, DATA.text.upgrade_msg]);
  
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
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) {
      slots.push(`${i < 10 ? '0' : ''}${i}:00`);
    }
    
    const now = new Date();
    const selectedDate = new Date(booking.date);
    if (isNaN(selectedDate.getTime())) return [];
    
    const isToday = selectedDate.toDateString() === now.toDateString();
    if (isToday) {
      const currentHour = now.getHours();
      return slots.filter(time => {
        const [hour] = time.split(':').map(Number);
        return hour > currentHour;
      });
    }
    return slots;
  }, [booking.date]);
  
  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0 };
    
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
      if (booking.extras[k]) {
        const extData = DATA.extras.find(e => e.id === k);
        if (extData) {
          const extraPrice = booking.type !== 'single' ? Math.floor(extData.price * 0.8) : extData.price;
          sub += extraPrice;
        }
      }
    });
    
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let runningTotal = Math.max(0, sub - disc);
    
    let mediaDisc = 0;
    if (booking.mediaAllowed) {
      mediaDisc = Math.ceil(runningTotal * 0.01);
      runningTotal = Math.max(0, runningTotal - mediaDisc);
    }

    let pixDisc = 0;
    if (booking.payment === 'pix') {
      pixDisc = Math.ceil(runningTotal * 0.03);
    }
    
    const finalTotal = Math.max(0, runningTotal - pixDisc);
    return { sub, disc, pixDisc, mediaDisc, total: finalTotal };
  }, [booking.item, booking.extras, booking.appliedCoupon, booking.type, DATA.extras, booking.payment, booking.mediaAllowed]);
  
  const estimatedXP = useMemo(() => {
    const baseXP = financials.total;
    const isPack = booking.type === 'pack';
    const percentage = isPack ? 0.30 : 0.15;
    return Math.floor(baseXP * percentage);
  }, [financials.total, booking.type]);
  
  const getNextLevelInfo = (currentXP: number) => {
    if (currentXP >= 800) {
      const cycleXP = currentXP - 800;
      const nextRewardAt = 500 - (cycleXP % 500);
      return { needed: nextRewardAt, reward: 50, title: "Íntimo Plus" };
    }
    
    const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
    return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };
  
  const getCurrentLevelProgress = () => {
    if (user.xp >= 800) {
      return ((user.xp - 800) % 500 / 500) * 100;
    }
    
    const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
    const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
    const currentLevel = DATA.levels[realIndex];
    const nextLevel = DATA.levels[realIndex + 1];
    
    if (!nextLevel) return 100;
    return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };
  
  const generateSecurityHash = (price: number, date: string, itemName: string) => {
    const raw = `${price}-${date}-${itemName}-${CONFIG.SECRET_TOKEN}`;
    return btoa(raw).substring(0, 8).toUpperCase();
  };
  
  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : '';
    const securityHash = generateSecurityHash(f.total, dateStr, booking.item?.id || '');
    
    let serviceTitle = booking.item?.title || '';
    if (booking.type !== 'single' && booking.item?.desc) {
      serviceTitle += ` ${lang === 'pt' ? '(Pacote)' : '(Pack)'}`;
    }
    
    let locTxt = "";
    let mapQuery = "";
    
    if (booking.locationType === 'home') {
      const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
      locTxt = `🏠 *${lang === 'pt' ? 'Residência' : 'Home'}*\n📍 ${fullAddr}\n📝 ${lang === 'pt' ? 'Comp' : 'Unit'}: ${booking.address.comp || '-'}`;
      mapQuery = fullAddr;
    } else if (booking.locationType === 'motel') {
      locTxt = `🏩 *Motel*\n⚠️ (${lang === 'pt' ? 'Local por conta do cliente' : 'Venue fee on client'})`;
    } else {
      const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
      locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 ${lang === 'pt' ? 'Quarto' : 'Room'}: ${booking.address.comp || '-'}`;
      mapQuery = fullAddr;
    }
    
    const extrasList = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
      const ex = DATA.extras.find(e => e.id === k);
      if (!ex) return '';
      const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
      return `✅ ${ex.label} (+${DATA.currency} ${price})`;
    }).filter(Boolean).join('\n');
    
    let priceDetails = `💵 *${lang === 'pt' ? 'Base' : 'Base'} (${serviceTitle}):* ${DATA.currency} ${booking.item?.price}`;
    
    if (f.disc > 0) priceDetails += `\n📉 *${lang === 'pt' ? 'Cupom' : 'Coupon'}:* -${DATA.currency} ${f.disc}`;
    if (f.mediaDisc > 0) priceDetails += `\n📸 *${lang === 'pt' ? 'Mídia (1%)' : 'Media (1%)'}:* -${DATA.currency} ${f.mediaDisc}`;
    if (f.pixDisc > 0) priceDetails += `\n💸 *Pix (3%):* -${DATA.currency} ${f.pixDisc}`;
    
    priceDetails += `\n\n💰 *TOTAL FINAL: ${DATA.currency} ${f.total},00*`;
    
    const msg = `
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
*${lang === 'pt' ? 'Valor a combinar à parte (Ida e Volta)' : 'Value to be agreed separately (Round Trip)'}*

💰 *${lang === 'pt' ? 'RESUMO FINANCEIRO' : 'FINANCIAL SUMMARY'}:*
${priceDetails}

💳 *${lang === 'pt' ? 'Pagamento' : 'Payment'}:* ${booking.payment.toUpperCase()}
──────────────────
*${lang === 'pt' ? 'Aguardando confirmação e valor do Uber...' : 'Awaiting confirmation and Uber fee...'}*
    `.trim();
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };
  
  const validateStep = useCallback(() => {
    if (step === 0 && !booking.item) {
      addToast(T.toast_select_item, "error");
      return false;
    }
    
    if (step === 1 && (!booking.date || !booking.time)) {
      addToast(T.toast_select_date, "error");
      return false;
    }
    
    if (step === 2) {
      if (!user.name || user.name.trim().length < 3) {
        addToast(T.toast_fill_name, "error");
        return false;
      }
      
      if (booking.locationType === 'home') {
        if (!validateAddress(booking.address)) {
          addToast(T.toast_fill_addr, "error");
          return false;
        }
      }
      
      if (booking.locationType === 'hotel') {
        if (!booking.address.placeName || !booking.address.city) {
          addToast(T.toast_fill_hotel, "error");
          return false;
        }
      }
      
      return true;
    }
    
    if (step === 3) {
      if (!booking.payment) {
        addToast(T.toast_select_pay, "error");
        return false;
      }
      
      if (!booking.termsAccepted) {
        addToast(T.toast_accept_terms, "error");
        return false;
      }
      
      return true;
    }
    
    return true;
  }, [step, booking, user.name, T, addToast]);
  
  const finishBooking = () => {
    let updatedCoupons = [...user.coupons];
    let updatedHistory = [...user.usedCoupons];
    
    if (booking.appliedCoupon) {
      if (!updatedHistory.includes(booking.appliedCoupon.code)) {
        updatedHistory.push(booking.appliedCoupon.code);
      }
      updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon?.code);
    }
    
    const newXP = user.xp + estimatedXP;
    let leveledUp = false;
    let newLevelTitle = "";
    
    DATA.levels.forEach(lvl => {
      if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
        leveledUp = true;
        newLevelTitle = lvl.title;
        updatedCoupons.push({
          id: `LVL${lvl.level}_${Date.now()}`,
          val: lvl.reward,
          title: `🏆 ${lvl.title}`,
          code: `LVLUP${lvl.level}`
        });
      }
    });
    
    const newOrdersCount = (user.ordersCount || 69) + 1;
    
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
      setTimeout(() => {
        addToast(`${T.levelup_popup_title} ${newLevelTitle}!`, "success");
      }, 500);
    }
    
    window.open(generateWhatsAppLink(), '_blank');
    
    setBooking({
      type: 'single',
      item: null,
      extras: {},
      date: null,
      time: null,
      locationType: 'home',
      address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' },
      payment: '',
      appliedCoupon: null,
      termsAccepted: false,
      bookingId: `BOOK_${Date.now()}`,
      mediaAllowed: false
    });
    
    setStep(4);
  };
  
  const handleNextStep = useCallback(() => {
    if (validateStep()) {
      if (step === 3) {
        finishBooking();
      } else {
        setStep(s => s + 1);
      }
    }
  }, [validateStep, step, finishBooking]);
  
  const scrollDates = (dir: 'left' | 'right') => {
    if (dateScrollRef.current) {
      const amt = dir === 'left' ? -200 : 200;
      dateScrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };
  
  const nextLevelInfo = getNextLevelInfo(user.xp);
  
  if (!isClient) {
    return <div className="min-h-screen w-full bg-zinc-950" />;
  }
  
  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center max-w-xs w-full px-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-400 text-white flex items-center justify-center text-4xl font-bold mb-8 shadow-2xl animate-pulse">
            T
          </div>
          <div className="w-full h-1.5 bg-zinc-800/20 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-blue-500"
              style={{ width: '100%', animation: 'loading-bar 2s infinite' }}
            ></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
            {T.loading}
          </p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }
  
  return (
    <>
      <GlobalStyles isDark={isDark} />
      
      <div className={`fixed inset-0 z-[-1] pointer-events-none ${isDark ? 'bg-zinc-950' : 'bg-white'}`} aria-hidden="true">
        <div className={`absolute top-0 left-0 w-96 h-96 blur-3xl rounded-full opacity-20 ${isDark ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 blur-3xl rounded-full opacity-20 ${isDark ? 'bg-indigo-600' : 'bg-indigo-400'}`} />
      </div>
      
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div
            key={t.id}
            role="alert"
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg animate-fade-in font-inter
              ${t.type === 'success'
                ? isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                : isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'
              }
            `}
          >
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={20} />
            <span className="text-sm font-medium">{t.msg}</span>
          </div>
        ))}
      </div>
      
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} toggleLang={() => setLang(l => l === 'pt' ? 'en' : 'pt')} lang={lang} user={user} />

      <main className={`min-h-screen relative z-10 pb-32 px-6 md:px-12 max-w-6xl mx-auto ${isDark ? 'text-white' : 'text-black'}`}>
        {step !== 4 && (
          <header className="pt-12 pb-6 flex items-start justify-between">
            <div className="flex flex-col">
              <h1 className={`text-2xl font-bold tracking-tight font-playfair leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Thalyson <br className="block md:hidden" /> Massagens
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-blue-500 font-black uppercase tracking-widest mt-2 font-inter">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                {user.ordersCount || 69} Sessões Realizadas
              </div>
            </div>
            <button
               onClick={() => setMenuOpen(true)}
               className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${isDark ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-white text-slate-900 shadow-md hover:bg-slate-50'}`}
               aria-label="Abrir Menu"
            >
               <Icon name="menu" size={24} />
            </button>
          </header>
        )}
        
        <div className="space-y-12">
          {step === 0 && (
            <section className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8">
                <div>
                  <h2 className={`text-4xl md:text-5xl font-playfair font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.welcome} <span className="text-blue-500">{user.name ? user.name.split(' ')[0] : (lang === 'pt' ? "Visitante" : "Visitor")}</span>
                  </h2>
                  <p className={`text-lg mb-8 font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {T.choose_sub}
                  </p>
                </div>
                
                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        <Icon name="award" size={28} />
                      </div>
                      <div>
                        <span className={`text-xs uppercase font-bold tracking-wider font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          {T.level_label}
                        </span>
                        <h3 className={`text-2xl font-bold mt-1 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {user.xp >= 800 ? "Íntimo Plus" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-4xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                      <span className="text-xs font-bold text-blue-500 block font-inter">XP</span>
                    </div>
                  </div>
                  <div>
                    <div className={`flex justify-between text-xs font-semibold mb-2 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                      <span>Progresso</span>
                      <span className="text-blue-500">{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`} role="progressbar" aria-valuenow={getCurrentLevelProgress()} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                        style={{ width: `${getCurrentLevelProgress()}%`, transition: 'width 1s ease' }}
                      />
                    </div>
                    {nextLevelInfo && (
                      <p className={`text-xs mt-3 text-center font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        Faltam {nextLevelInfo.needed} XP para +R${nextLevelInfo.reward}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`flex p-1 rounded-2xl border max-w-md mx-auto ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-100 border-slate-200'}`} role="tablist">
                <button
                  role="tab"
                  aria-selected={activeTab === 'packs'}
                  onClick={() => setActiveTab('packs')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-inter ${activeTab === 'packs' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-zinc-500' : 'text-slate-600'}`}
                >
                  <Icon name="package" size={18} /> {T.tab_packs}
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'single'}
                  onClick={() => setActiveTab('single')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-inter ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-zinc-500' : 'text-slate-600'}`}
                >
                  <Icon name="user" size={18} /> {T.tab_single}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => (
                  <Card
                    key={s.id}
                    active={booking.item?.id === s.id}
                    onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : 'pack', s)}
                    isDark={isDark}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${isDark ? 'bg-zinc-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                          <Icon name={s.icon} size={28} isEmoji={s.isEmoji} />
                        </div>
                        <div className="text-right">
                          {s.fullPrice && (
                            <span className={`text-xs block mb-1 font-inter font-medium ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                              De: <span className="line-through">{DATA.currency} {s.fullPrice}</span>
                            </span>
                          )}
                          <span className="text-3xl font-bold text-blue-500 font-playfair">
                            {DATA.currency} {s.price}
                          </span>
                          {s.savings && (
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full block mt-1 font-inter">
                              ECONOMIZE {DATA.currency} {s.savings}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-6">
                        <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-3 py-1 rounded-full uppercase border border-blue-500/20 font-inter inline-block">
                          {s.tag}
                        </span>
                        <h3 className={`text-xl font-bold mt-4 mb-2 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {s.title}
                        </h3>
                        <p className={`text-sm font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    <div className={`pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-2 text-blue-500 text-xs font-bold mb-2 uppercase tracking-wider font-inter">
                        <Icon name="alert-circle" size={14} /> {T.details_label}
                      </div>
                      <div className={`text-xs space-y-1 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        {s.details.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="py-12 relative group">
                <div className="flex items-center justify-between mb-8 px-4">
                  <h3 className={`text-2xl md:text-3xl font-playfair font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.reviews_title}
                  </h3>
                  <div className="hidden md:flex gap-2">
                    <button
                      onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: -320, behavior: 'smooth' })}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                      aria-label="Anterior"
                    >
                      <Icon name="chevron-left" size={20} />
                    </button>
                    <button
                      onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: 320, behavior: 'smooth' })}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'}`}
                      aria-label="Próximo"
                    >
                      <Icon name="chevron-right" size={20} />
                    </button>
                  </div>
                </div>
                
                <div
                  id="reviews-slider"
                  className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth px-4 pb-6 -mx-4"
                  style={{ 
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center flex-shrink-0 w-[280px] md:w-80 mx-2 first:ml-4 last:mr-4">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
                
                <div className="flex md:hidden justify-center gap-1 mt-2">
                  <div className="w-8 h-1 bg-blue-500 rounded-full opacity-30"></div>
                  <div className="w-2 h-1 bg-blue-500 rounded-full opacity-10"></div>
                </div>
              </div>
              
              <div className="max-w-3xl mx-auto py-12">
                <h3 className={`text-3xl font-playfair font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.faq_title}
                </h3>
                <div className={`border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                  {DATA.faq.map((item, idx) => (
                    <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {step === 1 && (
            <section className="space-y-8 animate-fade-in">
              <div className="text-center">
                <h2 className={`text-3xl font-playfair font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.select_time_title}
                </h2>
                <p className={`text-sm font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                  Selecione o melhor momento para seu relaxamento
                </p>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => scrollDates('left')}
                  className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-md'}`}
                  aria-label="Datas anteriores"
                >
                  <Icon name="chevron-left" size={20} />
                </button>
                <div ref={dateScrollRef} className="flex gap-4 overflow-x-auto px-2 py-4 snap-x" style={{ 
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}>
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const monthName = d.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' }).replace('.', '');
                    const dayName = d.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'short' }).slice(0, 3);
                    return (
                      <div key={idx} className="snap-center">
                        <button
                          onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))}
                          className={`
                            w-20 h-28 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 font-inter
                            ${isSel
                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-110'
                              : isDark
                                ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                            }
                          `}
                          aria-label={`Data: ${d.toLocaleDateString()}`}
                        >
                          <span className="text-xs uppercase opacity-60">{monthName}</span>
                          <span className="text-xs uppercase opacity-80">{dayName}</span>
                          <span className="text-2xl font-bold">{d.getDate()}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => scrollDates('right')}
                  className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-md'}`}
                  aria-label="Próximas datas"
                >
                  <Icon name="chevron-right" size={20} />
                </button>
              </div>
              
              {!booking.date && (
                <div className={`text-center py-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 ${isDark ? 'border-zinc-800 text-zinc-600' : 'border-slate-300 text-slate-400'} font-inter`}>
                  <Icon name="calendar" size={48} />
                  <p className="text-sm font-semibold uppercase tracking-wider">{T.empty_date}</p>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {generateTimeSlots.map((t, idx) => (
                    <button
                      key={t}
                      onClick={() => setBooking(b => ({ ...b, time: t }))}
                      className={`
                        py-4 rounded-xl text-sm font-semibold border-2 transition-all font-inter
                        ${booking.time === t
                          ? isDark
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-slate-900 text-white border-slate-900 shadow-lg'
                          : isDark
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }
                      `}
                      aria-label={`Horário: ${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              
              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-zinc-900/50 border border-zinc-800 text-zinc-400' : 'bg-slate-100 border border-slate-200 text-slate-500'} font-inter`}>
                  <p className="text-sm font-medium">{T.empty_slots}</p>
                </div>
              )}
            </section>
          )}
          
          {step === 2 && (
            <section className="space-y-12 animate-fade-in">
              <h2 className={`text-3xl font-playfair font-bold text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                  { id: 'home', label: lang === 'pt' ? 'Residência' : 'Home', icon: 'home' },
                  { id: 'motel', label: 'Motel', icon: 'bed' },
                  { id: 'hotel', label: 'Hotel', icon: 'building' }
                ].map(x => (
                  <button
                    key={x.id}
                    onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))}
                    className={`
                      py-6 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 font-inter
                      ${booking.locationType === x.id
                        ? 'bg-blue-600/10 border-blue-500 text-blue-500 shadow-lg'
                        : isDark
                          ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }
                    `}
                    aria-label={`Local: ${x.label}`}
                  >
                    <Icon name={x.icon} size={32} />
                    <span className="text-xs font-bold uppercase">{x.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div className="space-y-6">
                  <InputField
                    isDark={isDark}
                    label={T.input_name}
                    value={user.name}
                    onChange={(e: any) => {
                      const sanitized = sanitizeInput(e.target.value);
                      setUser(u => ({ ...u, name: sanitized }));
                    }}
                    icon="user"
                    placeholder={lang === 'pt' ? "Seu nome" : "Your name"}
                  />
                  
                  {booking.locationType === 'home' && (
                    <>
                      <div className="grid grid-cols-[1fr_100px] gap-3">
                        <InputField
                          isDark={isDark}
                          label={T.input_addr}
                          value={booking.address.street}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))}
                          icon="map-pin"
                          placeholder={lang === 'pt' ? "Rua" : "Street"}
                        />
                        <InputField
                          isDark={isDark}
                          label={T.input_num}
                          value={booking.address.number}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))}
                          placeholder="123"
                          type="tel"
                        />
                      </div>
                      <InputField
                        isDark={isDark}
                        label={T.input_district}
                        value={booking.address.district}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))}
                        placeholder={lang === 'pt' ? "Bairro" : "District"}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <InputField
                          isDark={isDark}
                          label={T.input_city}
                          value={booking.address.city}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))}
                          placeholder={lang === 'pt' ? "Cidade" : "City"}
                        />
                        <InputField
                          isDark={isDark}
                          label={T.input_comp}
                          value={booking.address.comp}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))}
                          placeholder={lang === 'pt' ? "Apto 10" : "Apt 10"}
                        />
                      </div>
                    </>
                  )}
                  
                  {booking.locationType === 'hotel' && (
                    <>
                      <InputField
                        isDark={isDark}
                        label={T.input_hotel}
                        value={booking.address.placeName}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))}
                        icon="building"
                        placeholder={lang === 'pt' ? "Nome do hotel" : "Hotel name"}
                      />
                      <InputField
                        isDark={isDark}
                        label={T.input_city}
                        value={booking.address.city}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))}
                        placeholder={lang === 'pt' ? "Cidade" : "City"}
                      />
                      <InputField
                        isDark={isDark}
                        label={T.input_room}
                        value={booking.address.comp}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))}
                        placeholder="305"
                      />
                    </>
                  )}
                  
                  {booking.locationType === 'motel' && (
                    <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-200'} font-inter flex flex-col items-center gap-4`}>
                      <Icon name="smartphone" size={32} className={isDark ? 'text-zinc-600' : 'text-slate-400'} />
                      <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {T.motel_note}
                      </p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className={`text-sm font-bold uppercase mb-6 tracking-wider font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                    {T.extras_title}
                  </h3>
                  <div className="space-y-3">
                    {DATA.extras.map((ex, idx) => {
                      const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                      const isActive = booking.extras[ex.id];
                      return (
                        <div
                          key={ex.id}
                          onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))}
                          className={`
                            flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all font-inter
                            ${isActive
                              ? 'bg-blue-600/10 border-blue-500/40 shadow-md'
                              : isDark
                                ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }
                          `}
                          aria-label={`Extra: ${ex.label}`}
                          role="checkbox"
                          aria-checked={isActive}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`${isActive ? 'text-blue-500' : isDark ? 'text-zinc-600' : 'text-slate-500'}`}>
                              <Icon name={ex.icon} size={20} isEmoji={ex.isEmoji} />
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${isActive ? 'text-blue-500' : isDark ? 'text-zinc-200' : 'text-slate-700'} font-inter`}>
                                {ex.label}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'} font-inter`}>{ex.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-500' : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-500'} font-inter`}>
                              + {DATA.currency} {price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {step === 3 && (
            <section className="space-y-8 animate-fade-in">
              <SmartTimer isDark={isDark} text={T.timer_text} />
              
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <h3 className={`text-2xl font-playfair font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.total_label}
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-xs uppercase font-bold mb-1 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          {T.select_time_title}
                        </p>
                        <h4 className={`text-xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {booking.item ? (DATA.services.find(s => s.id === booking.item.id) || DATA.plans.find(p => p.id === booking.item.id))?.title : ''}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-blue-500 font-medium mt-2 bg-blue-500/10 px-3 py-1.5 rounded-full w-fit border border-blue-500/20 font-inter">
                          <Icon name="calendar" size={14} />
                          {booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : ''} • {booking.time}
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-500 font-playfair">
                        {DATA.currency} {financials.sub}
                      </span>
                    </div>
                    
                    {Object.keys(booking.extras).filter(k => booking.extras[k]).length > 0 && (
                      <div className={`pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                        <p className={`text-xs uppercase font-bold mb-3 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          {T.extras_title}
                        </p>
                        <div className="space-y-2">
                          {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
                            const ex = DATA.extras.find(e => e.id === k);
                            const price = booking.type !== 'single' ? Math.floor(ex!.price * 0.8) : ex!.price;
                            return (
                              <div key={k} className="flex justify-between text-sm font-inter">
                                <span className={isDark ? 'text-zinc-300' : 'text-slate-600'}>{ex!.label}</span>
                                <span className="font-semibold text-blue-500">+ {DATA.currency} {price}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className={`pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <div className="flex justify-between mb-2">
                        <span className={`text-sm font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.subtotal}</span>
                        <span className={`text-sm font-semibold font-inter ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          {DATA.currency} {financials.sub}
                        </span>
                      </div>
                      
                      {financials.disc > 0 && (
                        <div className="flex justify-between mb-2 text-emerald-500 font-inter">
                          <span className="text-sm">{T.discount} ({booking.appliedCoupon?.title})</span>
                          <span className="text-sm font-semibold">- {DATA.currency} {financials.disc}</span>
                        </div>
                      )}

                      {financials.mediaDisc > 0 && (
                        <div className="flex justify-between mb-2 text-purple-500 font-inter">
                          <span className="text-sm">{T.media_discount}</span>
                          <span className="text-sm font-semibold">- {DATA.currency} {financials.mediaDisc}</span>
                        </div>
                      )}
                      
                      {financials.pixDisc > 0 && (
                        <div className="flex justify-between mb-2 text-blue-400 font-inter">
                          <span className="text-sm">{T.pix_discount}</span>
                          <span className="text-sm font-semibold">- {DATA.currency} {financials.pixDisc}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center pt-4">
                        <span className={`text-xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.total_label}</span>
                        <div className="text-right">
                          <span className="text-4xl font-black text-blue-500 font-playfair">
                            {DATA.currency} {financials.total}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-semibold text-blue-500 mt-1 font-inter">
                            <Icon name="sparkles" size={14} /> +{estimatedXP} XP
                          </div>
                        </div>
                      </div>
                      
                      <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 text-xs font-medium ${isDark ? 'bg-zinc-800/50 border-zinc-700 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                          <Icon name="car" size={16} />
                          <span>{T.uber_notice}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold font-playfair mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {T.coupon_section}
                    </h3>
                    {user.coupons.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.coupons.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))}
                            className={`
                              px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border font-inter
                              ${booking.appliedCoupon?.id === c.id
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-lg'
                                : isDark
                                  ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                              }
                            `}
                            aria-label={`Cupom: ${c.title}`}
                          >
                            {c.title}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm italic font-inter ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        {T.no_coupons}
                      </p>
                    )}
                  </div>

                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-purple-900/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-lg ${isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                           <Icon name={booking.mediaAllowed ? 'camera' : 'video'} size={24} />
                        </div>
                        <div className="flex-1">
                           <h3 className={`text-lg font-bold font-playfair mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {T.media_title}
                           </h3>
                           <p className={`text-xs mb-3 font-inter leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                              {T.media_desc}
                           </p>
                           <button 
                              onClick={() => setBooking(b => ({ ...b, mediaAllowed: !b.mediaAllowed }))}
                              className={`
                                 w-full flex items-center justify-between p-3 rounded-xl border transition-all text-sm font-semibold
                                 ${booking.mediaAllowed 
                                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/20' 
                                    : isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-white border-slate-300 text-slate-600'
                                 }
                              `}
                           >
                              <span>{booking.mediaAllowed ? 'Autorizado' : 'Não Autorizar'}</span>
                              {booking.mediaAllowed ? (
                                 <div className="flex items-center gap-2">
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white">-1% OFF</span>
                                    <Icon name="check" size={16} />
                                 </div>
                              ) : (
                                 <span className="text-xs text-purple-500">{T.media_bonus}</span>
                              )}
                           </button>
                        </div>
                      </div>
                  </div>
                  
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold font-playfair mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {T.payment_title}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { id: 'pix', label: 'Pix (3% OFF)', icon: 'smartphone' },
                        { id: 'card', label: lang === 'pt' ? 'Cartão' : 'Card', icon: 'credit-card' },
                        { id: 'money', label: lang === 'pt' ? 'Dinheiro' : 'Cash', icon: 'banknote' }
                      ].map(p => (
                        <button
                          key={p.id}
                          onClick={() => setBooking(b => ({ ...b, payment: p.id }))}
                          className={`
                            w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all font-inter
                            ${booking.payment === p.id
                              ? 'bg-blue-600/10 border-blue-500 text-blue-500'
                              : isDark
                                ? 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                            }
                          `}
                          aria-label={`Pagamento: ${p.label}`}
                        >
                          <Icon name={p.icon} size={24} />
                          <span className="text-sm font-bold uppercase flex-1 text-left">{p.label}</span>
                          {booking.payment === p.id && <Icon name="check" size={20} />}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div
                    onClick={() => setTermsOpen(true)}
                    className={`
                      flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all font-inter
                      ${booking.termsAccepted
                        ? 'bg-blue-500/10 border-blue-500/40'
                        : isDark
                          ? 'border-zinc-800 hover:border-zinc-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        <Icon name="shield" size={24} />
                      </div>
                      <div>
                        <span className={`text-sm font-semibold block font-playfair ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                          {T.terms_title}
                        </span>
                        <span className={`text-xs font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          Toque para ler todas as regras
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted }));
                      }}
                      className={`
                        w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                        ${booking.termsAccepted
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : isDark ? 'border-zinc-700' : 'border-slate-300'
                        }
                      `}
                    >
                      {booking.termsAccepted && <Icon name="check" size={14} />}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {step === 4 && (
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-bounce text-white">
                  <Icon name="check" size={40} />
                </div>
                <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-full animate-pulse" />
              </div>
              <h2 className={`text-4xl font-playfair font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {T.success_title}
              </h2>
              <p className={`text-lg mb-8 max-w-md font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                {T.success_sub}
              </p>
              <div className="flex flex-col gap-4 w-full max-w-sm">
                <Button
                  variant="whatsapp"
                  size="xl"
                  full
                  icon="message"
                  onClick={() => window.open(generateWhatsAppLink(), '_blank')}
                >
                  {T.whatsapp_btn}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep(0);
                    setBooking({ 
                      ...booking, 
                      item: null, 
                      type: 'single', 
                      termsAccepted: false, 
                      appliedCoupon: null,
                      bookingId: `BOOK_${Date.now()}`,
                      mediaAllowed: false
                    });
                  }}
                >
                  {T.back_home}
                </Button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {step < 4 && booking.item && (
        <nav className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 pointer-events-none" aria-label="Navegação da Reserva">
          <div className={`
            max-w-2xl mx-auto rounded-3xl p-4 shadow-2xl border backdrop-blur-xl pointer-events-auto flex justify-between items-center transition-all font-inter
            ${isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'}
          `}>
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-600'}`}
                aria-label="Etapa anterior"
              >
                <Icon name="chevron-left" size={24} />
              </button>
            ) : (
              <div className="w-12" />
            )}
            
            <div className="text-center">
              <p className={`text-[10px] font-bold uppercase tracking-widest font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                {step === 3 ? T.total_label : T.subtotal}
              </p>
              <p className={`text-xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {step === 3 ? `${DATA.currency} ${financials.total}` : `${DATA.currency} ${financials.sub}`}
              </p>
            </div>
            
            <Button
              onClick={handleNextStep}
              className="rounded-full !px-6"
              ariaLabel={step === 3 ? T.finish_btn : T.next_btn}
            >
              {step === 3 ? T.finish_btn : T.next_btn} <Icon name="chevron-right" size={20} className="ml-2" />
            </Button>
          </div>
        </nav>
      )}
      
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
            <button onClick={() => setTermsOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/10" aria-label="Fechar">
              <Icon name="x" size={24} />
            </button>
            <h3 className={`text-2xl font-playfair font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.rules_complete}</h3>
            <div className="space-y-4">
              {DATA.rules.map((rule, i) => (
                <RuleItem key={i} rule={rule} isDark={isDark} />
              ))}
            </div>
            <div className="mt-8">
              <Button full onClick={() => { 
                setBooking(b => ({ ...b, termsAccepted: true })); 
                setTermsOpen(false); 
              }}>
                {T.agree_terms}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {welcomePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`}>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl rotate-12 flex items-center justify-center shadow-xl mb-4 text-white">
              <Icon name="gift" size={48} />
            </div>
            <h3 className={`text-2xl font-playfair font-bold mt-10 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-sm mb-8 leading-relaxed font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.welcome_popup_msg}</p>
            <div className={`p-4 rounded-2xl border-2 border-dashed mb-8 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-xs font-bold uppercase text-zinc-500 mb-1 font-inter">CUPOM</p>
              <p className="text-2xl font-mono font-bold text-blue-500 tracking-wider font-playfair">BEMVINDO10</p>
            </div>
            <Button full onClick={() => {
              setWelcomePopup(false);
              setUser(u => ({ ...u, hasSeenWelcome: true }));
              const welcomeCoupon = { id: 'welcome', val: 10, title: '🎁 BEMVINDO10', code: 'BEMVINDO10' };
              setBooking(b => ({ ...b, appliedCoupon: welcomeCoupon }));
              setUser(prev => ({ ...prev, coupons: [...prev.coupons, welcomeCoupon] }));
              addToast(T.toast_coupon_success, "success");
            }}>
              {T.get_coupon}
            </Button>
          </div>
        </div>
      )}
      
      {levelUpPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl border ${isDark ? 'bg-zinc-900 border-amber-500/20' : 'bg-white'}`}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 blur-3xl rounded-full" />
            </div>
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/40 animate-bounce text-white">
              <Icon name="trophy" size={32} />
            </div>
            <h3 className={`text-3xl font-playfair font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-sm mb-8 font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.levelup_popup_msg}</p>
            <Button full variant="primary" className="!bg-amber-600 hover:!bg-amber-700 shadow-amber-600/20" onClick={() => setLevelUpPopup(false)}>Uhuul!</Button>
          </div>
        </div>
      )}
    </>
  );
}
