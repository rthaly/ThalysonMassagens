import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 0. GUIA DE CORES E ESTILOS (PREMIUM E LIMPO)
// ==================================================================================
/*
  O design adota uma postura minimalista e limpa, priorizando ícones geométricos
  e tons de contraste elegantes, removendo excesso de emojis para passar mais credibilidade.
*/

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES ESTÁTICAS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v27_premium_plans',
  PIX_KEY: "62.922.530/0001-14", 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  EXCHANGE_RATE: 5.0,
  SECRET_TOKEN: 'THALY_SECURE_V8',
  START_HOUR: 8,
  END_HOUR: 22, 
  MAX_STORAGE_SIZE: 5000 
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15; 

const ICON_PATHS: Record<string, string> = {
  'menu': 'M4 12h16 M4 6h16 M4 18h16', 'chevron-left': 'M15 18l-6-6 6-6', 'chevron-right': 'M9 18l6-6-6-6',
  'chevron-down': 'M6 9l6 6 6-6', 'x': 'M18 6L6 18M6 6l12 12', 'check': 'M20 6L9 17l-5-5',
  'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01',
  'share': 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  'globe': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  'sun': 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', 'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4',
  'sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', 'package': 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  'layers': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', 'user': 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', 'bed': 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
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
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'plus': 'M12 5v14 M5 12h14',
  'refresh-cw': 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15'
};

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    
    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    
    :root {
      --font-primary: 'Plus Jakarta Sans', sans-serif;
      --font-display: 'Playfair Display', serif;
    }

    html, body {
      background-color: ${isDark ? '#09090b' : '#f0f4f8'}; 
      color: ${isDark ? '#FFFFFF' : '#0f172a'};
      transition: background-color 0.3s ease, color 0.3s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      font-family: var(--font-primary);
    }
    
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes subtlePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.02); } }
    
    .animate-slide-in { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-pulse-slow { animation: subtlePulse 2s ease-in-out infinite; }
    
    .emoji-icon { font-style: normal; display: inline-block; line-height: 1; vertical-align: middle; text-align: center; }
  `}} />
));

const Icon = memo(({ name, size = 20, className = "", isEmoji = false }: { name: string, size?: number, className?: string, isEmoji?: boolean }) => {
  if (isEmoji) return <span className={`emoji-icon shrink-0 ${className}`} style={{ fontSize: size }} role="img" aria-label={name}>{name}</span>;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={ICON_PATHS[name] || ''} />
    </svg>
  );
});

const formatMoney = (val: number | undefined, lang: 'pt' | 'en') => {
  if (val === undefined || isNaN(val)) return lang === 'pt' ? 'R$ 0,00' : '$ 0.00';
  const converted = lang === 'pt' ? val : val / CONFIG.EXCHANGE_RATE;
  return lang === 'pt' ? `R$ ${converted.toFixed(2).replace('.', ',')}` : `$ ${converted.toFixed(2)}`;
};

interface ServiceItem { id: string; min: number; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; popular?: boolean; category?: 'relax' | 'express' | 'final' | 'care'; }
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; loc: string; t: string; s: number; serv: string; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { street: string; number: string; district: string; city: string; comp: string; placeName: string; }
interface BookingData { type: 'single' | 'pack' | 'custom'; cart: ServiceItem[]; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; mediaAllowed: boolean; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// 2. COMPONENTES DE UI
// ==================================================================================

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.98] gap-2 shrink-0";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/20 hover:-translate-y-1",
    secondary: "bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-xl shadow-green-900/20 hover:-translate-y-1",
    outline: "bg-transparent border border-zinc-500 text-white hover:border-white",
    ghost: "bg-transparent text-zinc-300 hover:text-white"
  };
  const sizes = { 
    sm: "h-12 text-[10px] px-5", 
    md: "h-14 text-[11px] px-6", 
    lg: "h-16 text-xs px-8", 
    xl: "h-16 md:h-18 text-xs md:text-sm px-8" 
  };
  
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} aria-label={ariaLabel} className={`${baseStyle} ${variants[variant as keyof typeof variants] || variants.primary} ${sizes[size as keyof typeof sizes]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"></span> : <>{icon && <Icon name={icon} size={20} />}{children}</>}
    </button>
  );
});

const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user, T }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} role="presentation" />
      <aside className={`fixed top-0 right-0 h-full w-[85%] sm:w-[75%] max-w-sm z-[70] p-6 sm:p-8 md:p-10 shadow-2xl animate-slide-in flex flex-col ${isDark ? 'bg-zinc-950 text-white border-l border-zinc-800/50' : 'bg-white text-slate-900 border-l border-slate-100'}`}>
        <div className="flex justify-between items-center mb-10 md:mb-12">
          <h2 className="text-2xl font-playfair font-medium">{T.menu_title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-500/20 transition-colors" aria-label="Fechar menu"><Icon name="x" size={24} /></button>
        </div>
        
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-white shadow-xl border border-zinc-700/50">
          <p className="text-[10px] opacity-90 uppercase font-bold tracking-widest mb-2 text-white">{T.level_yours}</p>
          <div className="flex justify-between items-end">
             <span className="text-3xl font-light font-playfair text-white">{user.xp} <span className="text-[10px] font-bold text-blue-400 font-sans tracking-widest uppercase">XP</span></span>
             <Icon name="award" size={28} className="text-blue-400" />
          </div>
          <p className="text-[9px] text-zinc-400 mt-4 font-light leading-snug border-t border-zinc-700/50 pt-3">
            {T.menu_warning}
          </p>
        </div>

        <nav className="space-y-3 flex-1">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-800 text-white' : 'hover:bg-slate-100 text-slate-900'}`}>
            <div className="flex items-center gap-4">
              <Icon name={isDark ? "moon" : "sun"} size={20} className={isDark ? "text-blue-400" : "text-blue-600"} />
              <span className="font-semibold text-sm">{T.theme_title}</span>
            </div>
            <span className="text-[9px] font-bold opacity-70 uppercase tracking-widest">{isDark ? T.theme_dark : T.theme_light}</span>
          </button>
          
          <button onClick={() => { if(navigator.share) navigator.share({title: 'Thalyson Massagens', text: T.share_text, url: window.location.href}) }} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors mt-2 ${isDark ? 'hover:bg-zinc-800 text-white' : 'hover:bg-slate-100 text-slate-900'}`}>
            <div className="flex items-center gap-4">
              <Icon name="share" size={20} className="text-emerald-400" />
              <span className="font-semibold text-sm">{T.refer_btn}</span>
            </div>
          </button>
        </nav>
      </aside>
    </>
  );
});

const Card = memo(({ children, className = '', onClick, active = false, isDark = true, popular = false, isPremium = false, T }: any) => {
  const getStyle = () => {
    if (active) return isPremium ? 'bg-amber-500/10 border-2 border-amber-500 shadow-amber-500/30 -translate-y-2' : 'bg-blue-600/10 border-2 border-blue-500 shadow-blue-500/30 -translate-y-2';
    if (isDark) return isPremium ? 'bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-amber-500/40 hover:border-amber-500/80 hover:bg-zinc-800/80 hover:-translate-y-1' : 'bg-zinc-900/60 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/80 hover:-translate-y-1';
    return isPremium ? 'bg-gradient-to-br from-amber-50 to-white border border-amber-300 hover:border-amber-500 shadow-sm hover:-translate-y-1' : 'bg-white border border-blue-200/50 hover:border-blue-300 shadow-sm hover:shadow-md hover:-translate-y-1';
  };

  return (
    <div onClick={onClick} className={`relative p-6 md:p-8 rounded-3xl transition-all duration-300 flex flex-col h-full ${onClick ? 'cursor-pointer' : ''} ${getStyle()} ${className}`}>
      {popular && (
        <div className={`absolute -top-3 left-6 md:left-8 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md ${isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-400/30' : 'bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/30'}`}>
          {T.popular_badge}
        </div>
      )}
      {children}
    </div>
  );
});

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text", isDark = true, hasError = false, multiline = false }: any) => (
  <div className="space-y-2 w-full min-w-0">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{label}</label>}
    <div className="relative group">
      {icon && !multiline && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-500' : isDark ? 'text-zinc-400 group-focus-within:text-blue-400' : 'text-slate-500 group-focus-within:text-blue-600'}`}><Icon name={icon} size={20} /></div>}
      
      {multiline ? (
         <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className={`w-full p-4 rounded-2xl outline-none text-sm font-medium transition-all bg-transparent resize-none ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:bg-zinc-900/80' : 'border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:bg-blue-50/50'}`} />
      ) : (
         <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-14 rounded-2xl outline-none text-sm font-medium transition-all bg-transparent ${icon ? 'pl-11 pr-4' : 'px-4'} ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:bg-zinc-900/80' : 'border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:bg-blue-50/50'}`} />
      )}
    </div>
  </div>
));

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`w-full h-full flex flex-col p-6 md:p-8 rounded-3xl transition-all duration-300 border gap-4 ${isDark ? 'bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800/80 hover:-translate-y-1' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1'}`}>
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-playfair shadow-inner shrink-0 ${isDark ? 'bg-zinc-800 text-white border border-zinc-600' : 'bg-slate-100 text-slate-800'}`}>
          {review.n.charAt(0)}
        </div>
        <div className="min-w-0 flex-1 pr-2">
          <span className={`text-sm md:text-base font-semibold block mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.n}</span>
          <span className={`text-[9px] md:text-[10px] block tracking-widest uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-1 px-2 py-1 rounded-full shrink-0">
        {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={14} className={i < review.s ? 'text-amber-400 fill-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'} />)}
      </div>
    </div>
    
    <div className={`inline-flex items-center self-start gap-1.5 px-3 py-1.5 rounded-full border text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
      <Icon name="award" size={12} className="shrink-0" />
      {review.serv}
    </div>

    <p className={`text-sm leading-relaxed md:leading-loose font-light italic flex-1 ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>"{review.t}"</p>
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
    <div className={`flex items-center justify-center gap-3 p-5 rounded-2xl transition-all border shadow-sm ${isDark ? 'bg-blue-600/20 border-blue-500/40 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-800'}`}>
      <Icon name="watch" size={20} className="animate-pulse shrink-0" />
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest break-words text-center">{text}: <span className="font-mono text-sm ml-1 bg-blue-500/30 px-3 py-1.5 rounded-md text-white">{format(time)}</span></span>
    </div>
  );
});

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 md:py-6 flex items-center justify-between text-left group" aria-expanded={isOpen}>
        <span className={`text-sm md:text-base font-medium pr-4 leading-snug ${isDark ? 'text-white group-hover:text-blue-300' : 'text-slate-900 group-hover:text-blue-700'}`}>{q}</span>
        <span className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-400' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}><Icon name="chevron-down" size={20} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{a}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 md:p-6 rounded-3xl border border-transparent transition-colors ${isDark ? 'hover:bg-zinc-800/80 hover:border-zinc-700' : 'hover:bg-slate-50 hover:border-slate-200'}`}>
    <div className={`shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}><Icon name={rule.icon} size={24} /></div>
    <div>
      <h4 className={`text-sm md:text-base font-bold mb-2 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.title}</h4>
      <p className={`text-xs md:text-sm font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{rule.description}</p>
    </div>
  </div>
));

// ==================================================================================
// 3. DADOS DE CONTEÚDO (LIMPOS E SEM EMOJIS EXCESSIVOS)
// ==================================================================================
const sanitizeInput = (value: string): string => String(value || '').replace(/[<>&"']/g, '');
const validateAddress = (address: Address): boolean => !!(address.street && address.number && address.district && address.city);

const getFullReviews = (lang: 'pt' | 'en'): Review[] => {
  return [
    { n: "Gustavo", loc: "Bela Vista - SP", t: lang === 'en' ? "Thalyson arrived on time when I needed to relax after a tense month. The at-home experience was incredible." : "O Thalyson chegou na hora certa, quando eu precisava relaxar após as tensões do mês. A experiência em casa foi incrível.", serv: "Experiência Fusion", s: 5 },
    { n: "Bruno", loc: "SP - Bela Vista", t: lang === 'en' ? "Thalyson, I want to say your massage was very well executed. I highly recommend it." : "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito.", serv: "Massagem Clássica", s: 5 },
    { n: "Osvaldo", loc: "Santa Fé do Sul", t: lang === 'en' ? "Great service at home by his magic hands! Focuses always on serving the client well." : "Sendo atendido por Thalyson em casa numa sessão de massagem por suas mãos mágicas. Foca sempre no propósito de servir bem o cliente.", serv: "Massagem Clássica", s: 5 }
  ]; // Mantive os 3 primeiros para brevidade no exemplo.
};

const getData = (lang: 'pt' | 'en') => {
  const isEn = lang === 'en';
  const p = {
    depil: 107, relax: 157, sens: 177, naturista: 197, titan: 207, reversa: 260, nuru: 317, crossfit: 187,
    pes: 110, maos: 110, combo_pm: 190,
    pack1: { v: 297, full: 334, save: 37 }, 
    pack2: { v: 387, full: 467, save: 80 }, 
    pack3: { v: 637, full: 721, save: 84 }, 
    extras: { more_time: 77, touch: 77, aroma: 17, hair_trim: 57, pain_relief: 17, dominador: 160, oral: 120, beijos: 77, prostatico: 120 }
  };
  
  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: isEn ? "Care Beginner" : "Iniciante no Cuidado" },
      { level: 2, xpNeeded: 100, reward: 15, title: isEn ? "Right Priority" : "Prioridade Certa" },
      { level: 3, xpNeeded: 350, reward: 30, title: isEn ? "Conscious Body" : "Corpo Consciente" },
      { level: 4, xpNeeded: 800, reward: 50, title: isEn ? "Plenitude Reached" : "Plenitude Alcançada" }
    ],
    services: [
      // Ícones substituídos para versão vetorial (limpa e profissional)
      { id: 'pes', category: 'express', min: 40, price: p.pes, icon: "user", tag: isEn ? "FOOT RELIEF" : "ALÍVIO NOS PÉS", title: isEn ? "Foot Massage" : "Sessão nos Pés", desc: isEn ? "Complete relief for tired feet after a long day." : "Alívio completo para pés cansados após longas jornadas de trabalho.", details: isEn ? "Step 1: Foot reflexology\nStep 2: Deep pressure points" : "Passo 1: Reflexologia podal focada\nPasso 2: Pressão profunda em pontos de tensão" },
      { id: 'maos', category: 'express', min: 40, price: p.maos, icon: "hand", tag: isEn ? "HAND RELIEF" : "ALÍVIO NAS MÃOS", title: isEn ? "Hand Massage" : "Sessão nas Mãos", desc: isEn ? "Release tension from typing and working with your hands." : "Libere a tensão acumulada de digitar e trabalhar excessivamente com as mãos.", details: isEn ? "Step 1: Joint stretching\nStep 2: Deep palm massage" : "Passo 1: Alongamento articular inicial\nPasso 2: Massagem profunda nas palmas" },
      { id: 'combo_pm', category: 'express', min: 40, price: p.combo_pm, icon: "sparkles", tag: isEn ? "COMBO" : "COMBO", title: isEn ? "Hands & Feet Combo" : "Combo Mãos e Pés", desc: isEn ? "The ultimate extremity relaxation, combining the best of both." : "O relaxamento definitivo para as extremidades do corpo, unindo o melhor dos dois mundos.", details: isEn ? "Step 1: Total extremity relief" : "Passo 1: Alívio total de tensões periféricas" },

      { id: 'relaxante', category: 'relax', min: 40, price: p.relax, icon: "user-check", tag: isEn ? "MUSCLE RELIEF" : "ALÍVIO MUSCULAR", title: isEn ? "Classic Massage" : "Massagem Clássica", desc: isEn ? "This takes that giant weight off your shoulders." : "Essa é para tirar com as mãos aquele peso gigante que você carrega.", details: isEn ? "Step 1: Focus on full body relaxation (no intimate touch)" : "Passo 1: Foco no relaxamento do corpo todo (sem toques íntimos)" },
      { id: 'naturista', category: 'relax', min: 40, price: p.naturista, icon: "sun", tag: isEn ? "ZERO TIES" : "ZERO AMARRAS", title: isEn ? "Naturist Classic" : "Clássica Naturista", desc: isEn ? "Total freedom, no clothes, light touches to loosen every muscle." : "Liberdade total, sem roupas, toques leves para soltar cada músculo do seu corpo.", details: isEn ? "Step 1: Deep full body relief without any intimate touches" : "Passo 1: Alívio profundo no corpo todo (não possui toques íntimos)" },
      { id: 'crossfit', category: 'relax', min: 60, price: p.crossfit, icon: "zap", tag: isEn ? "DEEP RECOVERY" : "RECUPERAÇÃO PROFUNDA", title: isEn ? "Crossfit Lovers" : "Massagem Crossfiteiro", desc: isEn ? "A sports massage with a firm and deep grip." : "Uma massagem desportiva com pegada firme e profunda.", details: isEn ? "Step 1: Heavy myofascial release" : "Passo 1: Liberação relaxante toque preciso" },
      
      { id: 'sensitiva', category: 'final', min: 60, price: p.sens, icon: "sparkles", tag: isEn ? "REDUCES ANXIETY" : "REDUZ ANSIEDADE", title: isEn ? "Sensory Massage" : "Massagem Sensorial", desc: isEn ? "Mind won't turn off at bedtime? Let subtle touches give you full-body shivers." : "A cabeça não desliga na hora de dormir? Deixe toques sutis arrepiarem seu corpo inteiro.", details: isEn ? "Step 1: Climax focused on an intense release of pleasure" : "Passo 1: Finalização focada numa liberação intensa de prazer" },
      { id: 'mista', category: 'final', min: 60, price: p.titan, icon: "zap", tag: isEn ? "BEST OF BOTH WORLDS" : "O MELHOR DOS 2 MUNDOS", title: isEn ? "Fusion Experience" : "Experiência Fusion", desc: isEn ? "First I take the pain from your back, then I take you to a climax." : "Primeiro eu tiro a dor das suas costas, depois te levo a um clímax.", details: isEn ? "Step 1: Ends with a liberating release" : "Passo 1: Termina com um gozo libertador" },
      { id: 'reversa', category: 'final', min: 60, price: p.reversa, icon: "refresh-cw", tag: isEn ? "REAL CONTACT" : "CONTATO REAL", title: isEn ? "Reverse Massage" : "Massagem Reversa", desc: isEn ? "I do a 30-min massage on you, and then you take control." : "Eu faço aproximadamente 30 minutos de massagem em você, e depois você assume.", details: isEn ? "Step 1: A delicious dynamic of reciprocity" : "Passo 1: Dinâmica de reciprocidade que te realiza" },
      { id: 'nuru', category: 'final', min: 60, price: p.nuru, icon: "star", popular: true, tag: isEn ? "TOTAL SURRENDER" : "ENTREGA TOTAL", title: isEn ? "Nuru Massage" : "Massagem Nuru", desc: isEn ? "Gliding gel, parts of my body sliding over yours." : "Gel que desliza, partes do meu corpo deslizando sobre o seu.", details: isEn ? "Step 1: The sweatiest and most intense journey" : "Passo 1: A viagem final mais intensa" },
      
      { id: 'depilacao', category: 'care', min: 60, price: p.depil, icon: "scissors", tag: isEn ? "PRACTICALITY" : "PRATICIDADE", title: isEn ? "Full Body Trim" : "Aparo Corporal Completo", desc: isEn ? "Leave with a clean, light body ready for the week." : "Fique com o corpo limpo, leve e preparado para a semana.", details: isEn ? "Step 1: Zero or Guard 3 trim" : "Passo 1: Aparo zero ou Pente 3 com máquina profissional" }
    ] as ServiceItem[],
    plans: [
      { id: 'pack_essencial', type: 'pack', title: isEn ? "Survival Kit (2x)" : "Kit Sobrevivência (2x)", price: p.pack1.v, fullPrice: p.pack1.full, savings: p.pack1.save, desc: isEn ? "One day to cure pain, another for the mind." : "Um dia para curar a dor, outro para a mente.", details: isEn ? "1x Classic\n1x Sensory" : "1x Clássica\n1x Sensorial", tag: isEn ? "PERFECT SLEEP" : "SONO PERFEITO", icon: "layers" },
      { id: 'pack_interativo', type: 'pack', title: isEn ? "Real Connection Combo (2x)" : "Combo Conexão Real (2x)", price: p.pack2.v, fullPrice: p.pack2.full, savings: p.pack2.save, desc: isEn ? "Two encounters scheduled separately to forget loneliness." : "Dois encontros agendados separadamente para esquecer a solidão.", details: isEn ? "1x Fusion\n1x Reverse" : "1x Fusion\n1x Reversa", tag: isEn ? "END OF LONELINESS" : "FIM DA SOLIDÃO", icon: "heart" },
      { id: 'pack_premium', type: 'pack', title: isEn ? "Boss Monthly Plan (3x)" : "Mensalidade do Chefe (3x)", price: p.pack3.v, fullPrice: p.pack3.full, savings: p.pack3.save, desc: isEn ? "Three weeks guaranteed with the best relaxation." : "Três semanas garantidas com o melhor relaxamento.", details: isEn ? "1x Naturist\n1x Fusion\n1x Nuru" : "1x Naturista\n1x Fusion\n1x Nuru", tag: isEn ? "MONTH'S REWARD" : "RECOMPENSA DO MÊS", icon: "award" }
    ] as ServiceItem[],
    extras: [
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "scissors", label: isEn ? "Trim (Extra)" : "Aparo (Extra)", desc: isEn ? "Maintenance in 2 body parts." : "Manutenção em 2 partes do corpo." },
      { id: 'more_time', price: p.extras.more_time, icon: "clock", label: isEn ? "Extended Time (+30m)" : "Tempo Estendido (+30m)", desc: isEn ? "When it's good, we don't want it to end." : "Quando está bom, não queremos que acabe." },
      { id: 'touch', price: p.extras.touch, icon: "hand", label: isEn ? "Organic Interaction" : "Interação Orgânica", desc: isEn ? "Feel free to participate." : "Sinta-se livre para participar e tocar também." },
      { id: 'aroma', price: p.extras.aroma, icon: "sparkles", label: isEn ? "Deep Aromatherapy" : "Cheiro bom no ar", desc: isEn ? "Essential oils that relax." : "Óleos essenciais que baixam a sua frequência." },
      { id: 'pain_relief', price: p.extras.pain_relief, icon: "shield", label: isEn ? "Extra Focus on Pain" : "Foco Extra em Dores", desc: isEn ? "Use of technical ointment." : "Uso de pomada técnica para dores." },
      { id: 'dominador', price: p.extras.dominador, icon: "zap", label: isEn ? "Active & Dominant" : "Massagista Ativo", desc: isEn ? "I take full control." : "Eu assumo o controle na finalização." },
      { id: 'oral', price: p.extras.oral, icon: "heart", label: isEn ? "Oral Included" : "Oral na Sessão", desc: isEn ? "Oral intimacy included." : "Estímulo oral incluído na experiência." },
      { id: 'beijos', price: p.extras.beijos, icon: "heart", label: isEn ? "Kisses Included" : "Beijos Liberados", desc: isEn ? "Kisses and affection allowed." : "Carinho e beijos liberados." },
      { id: 'prostatico', price: p.extras.prostatico, icon: "star", label: isEn ? "Prostatic Massage" : "Prostático Manual", desc: isEn ? "Manual prostatic stimulation." : "Estimulação prostática intensa." }
    ],
    faq: [
      { q: isEn ? "Where is our meeting location?" : "Onde é o local do nosso encontro?", a: isEn ? "I come to you, in the comfort of your home or hotel." : "Vou até você, no conforto da sua residência ou hotel, ou combinamos a suíte." },
      { q: isEn ? "How should I prepare for the session?" : "Como devo me preparar para a sessão?", a: isEn ? "Take a relaxing shower before my arrival." : "Tome um banho relaxante antes da minha chegada." }
    ],
    rules: [
      { icon: "shower", title: isEn ? "The Prep Shower" : "A Ducha Preparatória", description: isEn ? "A prior shower is essential." : "O banho prévio é essencial." },
      { icon: "shield", title: isEn ? "Health and Integrity" : "Saúde e Integridade", description: isEn ? "I declare that I am healthy." : "Declaro que estou saudável." }
    ],
    text: {
      welcome: isEn ? "It's great to have you here," : "É muito bom ter você aqui,",
      choose_sub: isEn ? "Choose how you want to be cared for today." : "Sei o quanto a rotina pesa. Escolha como quer ser cuidado hoje.",
      level_label: isEn ? "Your Care Journey" : "Sua Jornada de Cuidado",
      tab_packs: isEn ? "Monthly Plans" : "Planos Mensais",
      tab_single: isEn ? "Single Sessions" : "Sessões Avulsas",
      tab_custom: isEn ? "Custom" : "Sob Medida", // NOVO
      custom_title: isEn ? "Your Custom Experience" : "Sua Experiência Sob Medida",
      custom_desc: isEn ? "Tell me exactly what you need. Value starts at R$ 350.00." : "Descreva exatamente qual a sua necessidade. O valor inicia em R$ 350,00 e pode ser ajustado no chat.",
      custom_placeholder: isEn ? "Describe your ideal session..." : "Descreva como seria a sessão ideal para você...",
      custom_btn: isEn ? "Add to Cart (R$ 350.00)" : "Adicionar Pedido (R$ 350,00)",
      next_btn: isEn ? "Next" : "Avançar",
      finish_btn: isEn ? "Complete Booking" : "Realizar Agendamento",
      loading: isEn ? "Preparing a relaxation space for you..." : "Preparando um espaço de relaxamento para você...",
      toast_select_item: isEn ? "Please add at least one service." : "Por favor, adicione ao menos um serviço para continuarmos.",
      toast_select_date: isEn ? "Select the best date and time." : "Selecione a data e o horário para o encontro.",
      toast_fill_name: isEn ? "Fill in your name." : "Preciso saber como te chamar, preencha seu nome.",
      toast_fill_addr: isEn ? "Fill in the location." : "Por favor, preencha o local para eu ir cuidar de você.",
      toast_accept_terms: isEn ? "Read and accept our agreement." : "Leia e aceite nosso acordo de entrega e saúde.",
      toast_coupon_success: isEn ? "Gift applied!" : "Presente aplicado! Desconto ativado.",
      toast_coupon_invalid: isEn ? "Code is invalid." : "Esse código não é válido ou já expirou.",
      details_label: isEn ? "WHAT YOU WILL EXPERIENCE:" : "COMO É O PASSO A PASSO:",
      select_time_title: isEn ? "What's the best time?" : "Qual o melhor momento para o seu prazer?",
      location_title: isEn ? "Where will our encounter be?" : "Onde será nosso encontro de paz?",
      extras_title: isEn ? "Want to add more treats?" : "Quer adicionar mais coisas ao carrinho?",
      coupon_section: isEn ? "Your Available Benefits" : "Seus Benefícios Disponíveis",
      payment_title: isEn ? "How do you prefer to settle?" : "Como prefere acertar? (No encontro)",
      terms_title: isEn ? "Our Delivery Agreement" : "Nosso Acordo de Entrega",
      success_title: isEn ? "Almost there!" : "Quase lá!",
      success_sub: isEn ? "WhatsApp is opening to confirm your booking." : "O WhatsApp está sendo aberto automaticamente para confirmarmos a sua reserva.",
      whatsapp_btn: isEn ? "Open WhatsApp Again" : "Tentar Abrir WhatsApp Novamente",
      back_home: isEn ? "Go back" : "Voltar e refazer escolhas",
      timer_text: isEn ? "Cart saved for" : "Seu carrinho está salvo por",
      upgrade_msg: isEn ? "Added to cart!" : "Excelente escolha adicionada ao carrinho!",
      input_name: isEn ? "Your name" : "Qual é o seu nome ou apelido?",
      input_addr: isEn ? "Street / Avenue" : "Nome da Rua ou Avenida",
      input_num: isEn ? "Number" : "Número",
      input_district: isEn ? "Neighborhood" : "Seu Bairro",
      input_city: isEn ? "City" : "Sua Cidade",
      input_comp: isEn ? "Apt (Optional)" : "Apto, Bloco (Opcional)",
      input_hotel: isEn ? "Hotel name" : "Qual o nome do Hotel?",
      input_room: isEn ? "Room" : "Número do Quarto",
      agree_terms: isEn ? "I agree" : "Eu li e declaro que estou ciente",
      faq_title: isEn ? "FAQ" : "Dúvidas Frequentes",
      reviews_title: isEn ? "Reviews" : "Quem já se permitiu relaxar:",
      empty_date: isEn ? "Tap a day above." : "Toque num dia acima para ver meus horários.",
      empty_slots: isEn ? "Schedule is full." : "Poxa, minha agenda já encheu para este dia.",
      total_label: isEn ? "Total" : "Total do Carrinho",
      subtotal: isEn ? "Subtotal" : "Soma dos Serviços",
      discount: isEn ? "Discount" : "Desconto Aplicado",
      pix_discount: isEn ? "Pix Benefit (3%)" : "Benefício Pix (3%)",
      welcome_popup_title: isEn ? "Welcome!" : "Seja muito bem-vindo!",
      welcome_popup_msg: isEn ? "A gift for our first time." : "Aqui está um presente para nossa primeira vez.",
      welcome_popup_warning: isEn ? "Progress is saved in browser." : "Seu progresso fica salvo neste navegador.",
      levelup_popup_title: isEn ? "Evolution!" : "Evolução Alcançada!",
      levelup_popup_msg: isEn ? "New benefit unlocked." : "Um novo benefício foi desbloqueado.",
      get_coupon: isEn ? "Redeem" : "Resgatar Meu Presente",
      rules_complete: isEn ? "Agreement" : "Acordo de Entrega Mútua",
      media_discount: isEn ? "Portfolio Discount (1%)" : "Desconto Portfólio (1%)",
      media_title: isEn ? "Support my work" : "Apoiar meu trabalho (Opcional)",
      media_desc: isEn ? "Allow anonymous photos." : "Se quiser, permita fotos estéticas anônimas para meu portfólio.",
      media_bonus: isEn ? "Get 1% OFF" : "Liberar para ganhar 1% OFF",
      uber_notice: isEn ? "Travel fee to be calculated." : "A taxa de deslocamento (Uber) será calculada no WhatsApp.",
      motel_note: isEn ? "Address sent via chat." : "O endereço da minha suíte será combinado com você pelo WhatsApp.",
      menu_title: isEn ? "Menu" : "Menu Central",
      level_yours: isEn ? "Your Level" : "Seu Nível",
      level_current: isEn ? "Current Level" : "Nível Atual",
      level_journey: isEn ? "Your Journey" : "Sua Jornada",
      menu_warning: isEn ? "* Progress saved locally." : "* Seu progresso é salvo localmente.",
      theme_title: isEn ? "Theme" : "Aparência",
      theme_dark: isEn ? "Dark" : "Noturna",
      theme_light: isEn ? "Light" : "Clara",
      refer_btn: isEn ? "Refer Someone" : "Indicar Alguém",
      share_text: isEn ? 'Best massage.' : 'Encontrei a melhor massagem.',
      header_tensions: isEn ? "tensions resolved" : "tensões resolvidas",
      step_when: isEn ? "When" : "Quando",
      step_where: isEn ? "Where" : "Onde",
      step_summary: isEn ? "Summary" : "Resumo",
      cart_title: isEn ? "Your Cart:" : "Seu Carrinho:",
      cart_edit: isEn ? "Edit" : "Editar",
      time_choose: isEn ? "Choose Time" : "Escolha o Horário",
      time_rush: isEn ? "Rush (+15)" : "Pico (+15)",
      loc_home: isEn ? "Your Home" : "Sua Casa",
      loc_motel: isEn ? "My Suite" : "Minha Suíte",
      loc_hotel: isEn ? "Hotel" : "Hotel",
      summary_title: isEn ? "Order Summary" : "Resumo do Pedido",
      summary_items: isEn ? "SERVICES" : "CUIDADOS ESCOLHIDOS",
      summary_extras: isEn ? "EXTRAS" : "EXTRAS",
      summary_info: isEn ? "SESSION INFO" : "INFORMAÇÕES DA SESSÃO",
      summary_loc_home: isEn ? "At your residence" : "Em sua residência",
      summary_loc_motel: isEn ? "At my suite" : "Na minha suíte",
      summary_loc_hotel: isEn ? "At a hotel" : "Em hotel",
      coupon_applied: isEn ? "Coupon Applied" : "Cupom Aplicado",
      xp_guaranteed: isEn ? "XP" : "XP GARANTIDOS",
      media_granted: isEn ? "Granted" : "Autorização Concedida",
      media_support: isEn ? "Support" : "Apoiar o Trabalho",
      pay_pix: isEn ? "Pix (3% OFF)" : "Pix (3% OFF)",
      pay_card: isEn ? "Card" : "Cartão",
      pay_cash: isEn ? "Cash" : "Dinheiro",
      terms_read: isEn ? "Read Rules" : "Ler Regras de Saúde",
      level_redeem: isEn ? "Redeem" : "Resgatar Conquista",
      today: isEn ? "TODAY" : "HOJE",
      tomorrow: isEn ? "TOMORROW" : "AMANHÃ",
      popular_badge: isEn ? "✦ Most Desired" : "✦ Mais Desejada",
      from: isEn ? "From:" : "De:",
      savings: isEn ? "SAVINGS:" : "ECONOMIA:",
      items_selected: isEn ? "item(s)" : "item(s) selecionado(s)",
      btn_finish_short: isEn ? "Finish" : "Finalizar",
      btn_next_short: isEn ? "Next" : "Avançar",
      msg_level_keep1: isEn ? "Keep caring. You need" : "Mantenha o cuidado. Faltam",
      msg_level_keep2: isEn ? "XP for next reward of" : "XP para próximo benefício de",
      msg_rush_fee: isEn ? "Rush Fee" : "Taxa de Pico",
      toast_loaded: isEn ? "Loaded successfully! 💾" : "Progresso salvo carregado! 💾",
      toast_cart_toggle: isEn ? "Cart updated." : "Item atualizado no carrinho.",
      toast_pix_copied: isEn ? "PIX copied!" : "Chave PIX copiada!",
      toast_copy: isEn ? "Copied!" : "Copiado com sucesso!"
    },
    reviews: getFullReviews(lang)
  };
};

// ==================================================================================
// 4. MAIN APP 
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<'pt'|'en'>('pt'); 
  const [activeTab, setActiveTab] = useState('single');
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error"}[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [customRequestText, setCustomRequestText] = useState("");
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;
  
  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 92, lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single', cart: [], extras: {}, date: null, time: null, locationType: 'home', address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false
  });
  
  const dateScrollRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const openExternal = useCallback((platform: 'whatsapp' | 'instagram', customText?: string) => {
    let url = '';
    if (platform === 'whatsapp') {
      url = `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(customText || '')}`;
    } else {
      url = CONFIG.INSTAGRAM_URL;
    }
    const link = document.createElement('a');
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    document.body.appendChild(link); link.click();
    setTimeout(() => { document.body.removeChild(link); }, 100);
  }, []);
  
  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    if (isClient) document.title = step === 0 ? "Thalyson Massagens" : (lang === 'en' ? "Your Booking - Thalyson" : "Seu Agendamento - Thalyson");
  }, [step, isClient, lang]);
  
  useEffect(() => {
    if (!isClient) return;
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 800);
  }, [isClient]);
  
  const handleToggleCartItem = useCallback((item: ServiceItem) => {
    setBooking(prev => {
      const exists = prev.cart.find(c => c.id === item.id);
      let newCart = exists ? prev.cart.filter(c => c.id !== item.id) : [...prev.cart, item];
      return { ...prev, cart: newCart, payment: '', termsAccepted: false, bookingId: prev.bookingId || `BOOK_${Date.now()}` };
    });
    addToast(T.toast_cart_toggle, "success");
  }, [addToast, T]);

  const handleAddCustom = () => {
    if(customRequestText.length < 10) return addToast(lang === 'en' ? "Please provide more details." : "Descreva com mais detalhes o que deseja.", "error");
    const customItem: ServiceItem = {
      id: `custom_${Date.now()}`,
      title: lang === 'en' ? "Custom Experience" : "Experiência Sob Medida",
      desc: customRequestText,
      price: 350,
      min: 60,
      icon: "star",
      tag: "VIP",
      details: lang === 'en' ? "Custom request agreed upon in chat." : "Pedido personalizado a ser alinhado no chat."
    };
    handleToggleCartItem(customItem);
    setCustomRequestText("");
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
    if (selectedDate.toDateString() === now.toDateString()) return slots.filter(time => Number(time.split(':')[0]) > now.getHours());
    return slots;
  }, [booking.date]);
  
  const financials = useMemo(() => {
    if (booking.cart.length === 0) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0, rushFee: 0, duration: 0 };
    let sub = 0; let baseDuration = 0; let isPackage = booking.cart.some(item => item.type === 'pack');

    booking.cart.forEach(item => { sub += item.price; if (!isPackage) baseDuration += (item.min || 60); });
    if (isPackage) baseDuration = 60;

    let addedTime = 0;
    Object.keys(booking.extras || {}).forEach(k => { 
      if (booking.extras[k]) { 
        const extData = DATA.extras.find(e => e.id === k); 
        if (extData) { sub += isPackage ? Math.floor(extData.price * 0.8) : extData.price; if (extData.id === 'more_time') addedTime += 30; }
      } 
    });

    const isRushHour = RUSH_HOURS.includes(booking.time || '');
    const rushFee = (isRushHour && booking.locationType !== 'motel') ? RUSH_FEE : 0;
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let runningTotal = Math.max(0, sub - disc);
    
    let mediaDisc = 0; if (booking.mediaAllowed) { mediaDisc = Math.ceil(runningTotal * 0.01); runningTotal = Math.max(0, runningTotal - mediaDisc); }
    let pixDisc = 0; if (booking.payment === 'pix') { pixDisc = Math.ceil(runningTotal * 0.03); }
    
    return { sub, disc, pixDisc, mediaDisc, rushFee, total: Math.max(0, runningTotal - pixDisc) + rushFee, duration: baseDuration + addedTime };
  }, [booking.cart, booking.extras, booking.appliedCoupon, DATA.extras, booking.payment, booking.mediaAllowed, booking.time, booking.locationType]);
  
  const estimatedXP = useMemo(() => Math.floor(financials.total * (booking.cart.some(item => item.type === 'pack') ? 0.30 : 0.15)), [financials.total, booking.cart]);
  
  const generateWhatsAppMsg = () => {
    const f = financials; 
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : '';
    const securityHash = btoa(encodeURIComponent(`${f.total}-${dateStr}-${CONFIG.SECRET_TOKEN}`)).substring(0, 8).toUpperCase();
    const isEn = lang === 'en';

    const servicesListText = booking.cart.map(item => `✅ *${item.title}*\n_${item.desc}_\n*${isEn ? 'Details' : 'Detalhes'}:*\n${item.details.split('\n').map(line => `  • ${line}`).join('\n')}`).join('\n\n');
    
    let locTxt = ""; 
    if (booking.locationType === 'home') locTxt = `🏠 *${isEn ? 'Residence' : 'Residência'}*\n📍 ${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}\n📝 ${isEn ? 'Comp' : 'Comp'}: ${booking.address.comp || '-'}`; 
    else if (booking.locationType === 'motel') locTxt = `🏩 *${isEn ? 'Your Suite' : 'Sua Suíte'}*\n⚠️ (${isEn ? 'Address agreed on WhatsApp' : 'Endereço será combinado no WhatsApp'})`; 
    else locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 ${isEn ? 'Room' : 'Quarto'}: ${booking.address.comp || '-'}`; 
    
    const extrasList = Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => { const ex = DATA.extras.find(e => e.id === k); return ex ? `➕ ${ex.label}` : ''; }).filter(Boolean).join('\n');
    
    let priceDetails = `💵 *${isEn ? 'Services Sum' : 'Soma dos Cuidados'}:* ${formatMoney(f.sub, lang)}`;
    if (f.disc > 0) priceDetails += `\n🎁 *Desconto:* -${formatMoney(f.disc, lang)}`;
    priceDetails += `\n\n💰 *${isEn ? 'FINAL VALUE' : 'VALOR FINAL'}: ${formatMoney(f.total, lang)}*`;

    return isEn ? `*CARE RESERVATION* | #${securityHash}\n👤 *Name:* ${sanitizeInput(user.name)}\n📅 *Date:* ${dateStr} at ${booking.time}\n\n💆‍♂️ *WHAT I CHOSE:*\n${servicesListText}\n\n${extrasList ? `*Extras:*\n${extrasList}\n` : ''}📍 *WHERE:*\n${locTxt}\n\n💰 *INVESTMENT:*\n${priceDetails}\n💳 *Payment:* ${booking.payment.toUpperCase()}`
                : `*RESERVA DE CUIDADO* | #${securityHash}\n👤 *Nome:* ${sanitizeInput(user.name)}\n📅 *Data:* ${dateStr} às ${booking.time}\n\n💆‍♂️ *O QUE ESCOLHI:*\n${servicesListText}\n\n${extrasList ? `*Extras:*\n${extrasList}\n` : ''}📍 *ONDE:*\n${locTxt}\n\n💰 *INVESTIMENTO:*\n${priceDetails}\n💳 *Pagamento:* ${booking.payment.toUpperCase()}`;
  };
  
  const isStepValid = useCallback(() => {
    if (step === 0) return booking.cart.length > 0;
    if (step === 1) {
      if (!user.name || String(user.name).trim().length < 3) return false;
      if (booking.locationType === 'home') return validateAddress(booking.address);
      if (booking.locationType === 'hotel') return !!(booking.address.placeName && booking.address.city);
      return true;
    }
    if (step === 2) return !!(booking.date && booking.time);
    if (step === 3) return !!(booking.payment && booking.termsAccepted);
    return true;
  }, [step, booking, user.name]);
  
  const handleNextStep = useCallback(() => {
    if (!isStepValid()) {
      if (step === 0) addToast(T.toast_select_item, "error");
      if (step === 1) addToast(!user.name ? T.toast_fill_name : T.toast_fill_addr, "error");
      if (step === 2) addToast(T.toast_select_date, "error");
      if (step === 3) addToast(T.toast_accept_terms, "error");
      return;
    }
    if (step === 3) { openExternal('whatsapp', generateWhatsAppMsg()); setStep(4); }
    else setStep(s => s + 1);
  }, [step, booking, user.name, T, addToast, isStepValid]);
  
  const getDayLabel = (d: Date) => {
    const today = new Date(); const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return T.today;
    if (d.toDateString() === tomorrow.toDateString()) return T.tomorrow;
    return d.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { weekday: 'short' }).slice(0, 3).toUpperCase();
  };

  const categoriesRenderData = [
    { id: 'relax', title: lang === 'en' ? "Just Relax" : "Apenas Relaxar", icon: "sun", colorClass: "bg-blue-500", accent: isDark ? "border-blue-500/30" : "border-blue-100 shadow-blue-900/5", desc: lang === 'en' ? "Therapeutic body work to relieve stress." : "Trabalho corporal terapêutico focado em aliviar totalmente o estresse." },
    { id: 'express', title: lang === 'en' ? "Express Care" : "Cuidados Rápidos", icon: "watch", colorClass: "bg-emerald-500", accent: isDark ? "border-emerald-500/30" : "border-emerald-100 shadow-emerald-900/5", desc: lang === 'en' ? "Quick localized relief for hands and feet." : "Soluções pontuais de alívio rápido focado nas mãos e pés." },
    { id: 'final', title: lang === 'en' ? "With Ending" : "Com Finalização", icon: "sparkles", colorClass: "bg-amber-500", accent: isDark ? "border-amber-500/30" : "border-amber-100 shadow-amber-900/5", desc: lang === 'en' ? "A complete and intense sensory journey." : "A verdadeira jornada sensorial de alívio profundo e prazer." },
    { id: 'care', title: lang === 'en' ? "Personal Care" : "Cuidados Pessoais", icon: "scissors", colorClass: "bg-pink-500", accent: isDark ? "border-pink-500/30" : "border-pink-100 shadow-pink-900/5", desc: lang === 'en' ? "Aesthetic body maintenance." : "Sessões focadas na estética e higiene do seu corpo." }
  ];
  
  if (!isClient || loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center" />;
  
  return (
    <>
      <GlobalStyles isDark={isDark} />
      <div className={`fixed inset-0 z-[-1] pointer-events-none transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`} aria-hidden="true" />
      
      <div className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div key={t.id} role="alert" className={`pointer-events-auto flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl border backdrop-blur-2xl shadow-2xl animate-fade-in ${t.type === 'success' ? isDark ? 'bg-zinc-800/90 border-zinc-700 text-white' : 'bg-white/95 border-slate-200 text-slate-800' : 'bg-red-500/95 border-red-500 text-white'}`}>
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={20} className="shrink-0" />
            <span className="text-xs md:text-sm font-semibold tracking-wide leading-snug">{t.msg}</span>
          </div>
        ))}
      </div>
      
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} user={user} T={T} />

      <main className="min-h-screen relative z-10 pb-40 md:pb-48 px-4 md:px-8 max-w-5xl mx-auto selection:bg-blue-500/30 selection:text-blue-200">
        {step !== 4 && (
          <header className="pt-10 md:pt-16 pb-8 md:pb-12">
            <div className="flex items-start justify-between">
              
              {/* === [INÍCIO: ADIÇÃO DA FOTO DE PERFIL] === */}
              <div className="flex items-center gap-3 md:gap-4">
                <img 
                   src="https://ui-avatars.com/api/?name=Thalyson&background=0D8ABC&color=fff&size=150" 
                   alt="Thalyson" 
                   className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-500 shadow-lg" 
                />
                <div className="flex flex-col cursor-pointer transition-opacity hover:opacity-80" onClick={() => setStep(0)} title={T.back_home}>
                  <h1 className={`text-xl md:text-3xl font-playfair tracking-tight font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Thalyson <br className="block sm:hidden" /> Massagens
                  </h1>
                  <div className={`flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest mt-1 md:mt-2 font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-blue-500"></span></span>
                    {lang === 'en' ? `Over ${user.ordersCount || 92} ${T.header_tensions}` : `Mais de ${user.ordersCount || 92} ${T.header_tensions}`}
                  </div>
                </div>
              </div>
              {/* === [FIM: ADIÇÃO DA FOTO DE PERFIL] === */}

              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')} aria-label="Language" className={`relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700 text-blue-400 hover:bg-zinc-800' : 'bg-white border-slate-200 text-blue-600 hover:bg-slate-50'}`}>
                   <Icon name="globe" size={20} />
                   <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded">{lang.toUpperCase()}</span>
                </button>
                <button onClick={() => setMenuOpen(true)} aria-label="Menu" className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                   <Icon name="menu" size={20} />
                </button>
              </div>
            </div>
            
            {step > 0 && step < 4 && (
              <div className="mt-8 md:mt-12 flex items-center justify-between gap-3 max-w-sm mx-auto">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 md:gap-3">
                    <div className={`w-full h-1 md:h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                  </div>
                ))}
              </div>
            )}
          </header>
        )}
        
        <div className="space-y-12 md:space-y-16">
          {step === 0 && (
            <section className="space-y-12 md:space-y-16 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center py-2 md:py-6">
                <div>
                  <h2 className={`text-3xl md:text-5xl font-playfair font-medium leading-[1.15] mb-4 md:mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.welcome} <span className="italic text-blue-500">{user.name ? String(user.name).trim().split(' ')[0] : (lang === 'en' ? "allow yourself" : "permita-se")}.</span>
                  </h2>
                  <p className={`text-sm md:text-lg font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                    {T.choose_sub}
                  </p>
                </div>
              </div>
              
              <div className={`flex p-1.5 md:p-2 rounded-2xl md:rounded-3xl border max-w-md mx-auto shadow-inner overflow-x-auto scrollbar-hide ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-slate-100/80 border-slate-200'}`} role="tablist">
                <button role="tab" aria-selected={activeTab === 'packs'} onClick={() => setActiveTab('packs')} 
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 
                  ${activeTab === 'packs' ? 'bg-amber-500 text-white shadow-lg' : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="package" size={16} /> {T.tab_packs}
                </button>
                
                <button role="tab" aria-selected={activeTab === 'single'} onClick={() => setActiveTab('single')} 
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden
                  ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400' : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="user" size={16} /> {T.tab_single}
                </button>

                {/* === [INÍCIO: NOVA ABA PEDIDOS PERSONALIZADOS] === */}
                <button role="tab" aria-selected={activeTab === 'custom'} onClick={() => setActiveTab('custom')} 
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden
                  ${activeTab === 'custom' ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] border border-purple-400' : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="star" size={16} /> {T.tab_custom}
                </button>
                {/* === [FIM: NOVA ABA PEDIDOS PERSONALIZADOS] === */}
              </div>
              
              {activeTab === 'single' ? (
                <div className="space-y-16">
                  {categoriesRenderData.map(cat => {
                    const servicesInCategory = DATA.services.filter((s: ServiceItem) => s.category === cat.id);
                    if (servicesInCategory.length === 0) return null;

                    return (
                      <div key={cat.id} className={`p-6 md:p-10 rounded-[2.5rem] border-2 shadow-lg relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-900/40' : 'bg-white'} ${cat.accent}`}>
                        <div className={`absolute top-0 right-0 w-64 h-64 opacity-[0.03] md:opacity-[0.05] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none ${cat.colorClass}`} />
                        <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-8 md:mb-10">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 ${cat.colorClass}`}>
                              <Icon name={cat.icon} size={28} />
                            </div>
                            <div>
                              <h3 className={`text-2xl md:text-3xl font-playfair font-medium leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.title}</h3>
                              <p className={`text-xs md:text-sm font-light mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{cat.desc}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            {servicesInCategory.map((s: ServiceItem) => {
                              const isInCart = booking.cart.some(cartItem => cartItem.id === s.id);
                              return (
                                <Card key={s.id} active={isInCart} onClick={() => handleToggleCartItem(s)} isDark={isDark} popular={s.popular} T={T}>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start mb-6 gap-3">
                                      <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-slate-300 text-slate-800'}`}>
                                        <Icon name={s.icon} size={24} isEmoji={s.isEmoji} />
                                      </div>
                                      <div className="text-right min-w-0 flex-1 flex flex-col items-end relative">
                                        {isInCart && <div className={`absolute -top-2 -right-2 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md bg-blue-500`}><Icon name="check" size={14} /></div>}
                                        <span className={`text-xl md:text-2xl font-playfair font-semibold w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                          {formatMoney(s.price, lang)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mb-6">
                                      <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest border px-3 py-1.5 rounded-full inline-block mb-3 md:mb-4 ${isDark ? 'bg-zinc-800 border-zinc-600 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
                                        {s.tag}
                                      </span>
                                      <h3 className={`text-lg md:text-xl font-playfair font-medium mb-2 md:mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                                      <p className={`text-xs md:text-sm font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{s.desc}</p>
                                    </div>
                                  </div>
                                  <div className={`pt-4 md:pt-5 mt-auto border-t ${isDark ? 'border-zinc-700' : 'border-slate-200'}`}>
                                    <div className={`flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                      <Icon name="check" size={14} className={`text-emerald-400 shrink-0`} /> {T.details_label}
                                    </div>
                                    <div className={`text-[11px] md:text-xs space-y-2 font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                      {s.details.split('\n').map((line, i) => <p key={i} className="flex items-start gap-2"><span className={`text-blue-400 mt-1 text-[10px] shrink-0`}>•</span> <span>{line}</span></p>)}
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : activeTab === 'packs' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {DATA.plans.map((s: ServiceItem) => {
                    const isInCart = booking.cart.some(cartItem => cartItem.id === s.id);
                    return (
                    <Card key={s.id} active={isInCart} onClick={() => handleToggleCartItem(s)} isDark={isDark} popular={s.popular} isPremium={true} T={T}>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-6 gap-3">
                          <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${isDark ? 'bg-zinc-900 border-amber-500/50 text-amber-400' : 'bg-amber-100 border-amber-300 text-amber-700'}`}>
                            <Icon name={s.icon} size={24} isEmoji={s.isEmoji} />
                          </div>
                          <div className="text-right min-w-0 flex-1 flex flex-col items-end relative">
                            {isInCart && <div className={`absolute -top-2 -right-2 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-md bg-amber-500`}><Icon name="check" size={14} /></div>}
                            <span className={`text-xl md:text-2xl font-playfair font-semibold w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {formatMoney(s.price, lang)}
                            </span>
                          </div>
                        </div>
                        <div className="mb-6">
                          <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest border px-3 py-1.5 rounded-full inline-block mb-3 md:mb-4 ${isDark ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-800'}`}>
                            {s.tag}
                          </span>
                          <h3 className={`text-lg md:text-xl font-playfair font-medium mb-2 md:mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                          <p className={`text-xs md:text-sm font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{s.desc}</p>
                        </div>
                      </div>
                      <div className={`pt-4 md:pt-5 mt-auto border-t ${isDark ? 'border-amber-500/40' : 'border-amber-200'}`}>
                        <div className={`flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          <Icon name="check" size={14} className={`text-amber-400 shrink-0`} /> {T.details_label}
                        </div>
                        <div className={`text-[11px] md:text-xs space-y-2 font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          {s.details.split('\n').map((line, i) => <p key={i} className="flex items-start gap-2"><span className={`text-amber-400 mt-1 text-[10px] shrink-0`}>•</span> <span>{line}</span></p>)}
                        </div>
                      </div>
                    </Card>
                  )})}
                </div>
              ) : (
                // === [INÍCIO: UI DE PEDIDO PERSONALIZADO] ===
                <div className={`p-6 md:p-10 rounded-3xl border-2 shadow-lg transition-colors duration-500 ${isDark ? 'bg-zinc-900/60 border-purple-500/30' : 'bg-white border-purple-200'}`}>
                   <div className="flex items-center gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 bg-purple-600`}>
                        <Icon name="star" size={28} />
                      </div>
                      <div>
                        <h3 className={`text-xl md:text-3xl font-playfair font-medium leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.custom_title}</h3>
                        <p className={`text-xs md:text-sm font-light mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.custom_desc}</p>
                      </div>
                   </div>
                   <InputField 
                      multiline={true} 
                      isDark={isDark} 
                      value={customRequestText} 
                      onChange={(e: any) => setCustomRequestText(e.target.value)} 
                      placeholder={T.custom_placeholder} 
                   />
                   <div className="mt-6 flex justify-end">
                      <Button onClick={handleAddCustom} variant="primary" className="!bg-purple-600 hover:!bg-purple-500" icon="plus">{T.custom_btn}</Button>
                   </div>
                </div>
                // === [FIM: UI DE PEDIDO PERSONALIZADO] ===
              )}
              
              <div className="py-12 md:py-16 relative border-t border-b border-dashed border-zinc-700 mt-12 md:mt-16">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <h3 className={`text-2xl md:text-3xl font-playfair font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.reviews_title}
                  </h3>
                </div>
                <div id="reviews-slider" className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-6 pt-2 -mx-4 md:-mx-8 px-4 md:px-8 gap-4 md:gap-6 items-stretch">
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-[360px] flex h-auto">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {step === 1 && (
            <section className="space-y-10 md:space-y-12 animate-fade-in max-w-2xl mx-auto">
              <h2 className={`text-2xl md:text-4xl font-playfair font-medium text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {[
                  { id: 'home', label: T.loc_home, icon: 'home' },
                  { id: 'motel', label: T.loc_motel, icon: 'bed' },
                  { id: 'hotel', label: T.loc_hotel, icon: 'building' }
                ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))} className={`py-4 md:py-6 px-2 rounded-2xl flex flex-col items-center gap-2 md:gap-3 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] -translate-y-1' : isDark ? 'bg-zinc-900/60 border-zinc-700 text-white hover:border-zinc-500 hover:bg-zinc-800' : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400 shadow-sm'}`}>
                    <Icon name={x.icon} size={24} />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center">{x.label}</span>
                  </button>
                ))}
              </div>
              
              <div className={`p-6 md:p-8 rounded-3xl border shadow-sm transition-colors ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'} space-y-6 md:space-y-8`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder={lang === 'en' ? "Your name" : "Seu nome"} hasError={!user.name || String(user.name).trim().length < 3} />
                
                {booking.locationType === 'home' && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
                      <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} icon="map-pin" placeholder={lang === 'en' ? "Street / Avenue" : "Rua / Avenida"} hasError={!booking.address.street} />
                      <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Nº" type="tel" hasError={!booking.address.number} />
                    </div>
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "Neighborhood" : "Seu Bairro"} hasError={!booking.address.district} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "City" : "Sua Cidade"} hasError={!booking.address.city} />
                      <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "Apt, Block (Optional)" : "Apto, Bloco (Opcional)"} />
                    </div>
                  </div>
                )}
                
                {booking.locationType === 'hotel' && (
                  <div className="space-y-5 animate-fade-in">
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder={lang === 'en' ? "Hotel Name" : "Nome do Hotel"} hasError={!booking.address.placeName} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "City" : "Cidade"} hasError={!booking.address.city} />
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "Room Nº" : "Nº do Quarto"} />
                  </div>
                )}
                
                {booking.locationType === 'motel' && (
                  <div className={`p-6 rounded-2xl border text-center animate-fade-in ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-300'} flex flex-col items-center gap-4`}>
                    <div className={`p-3 rounded-full ${isDark ? 'bg-zinc-700 text-white' : 'bg-slate-200 text-slate-700'}`}><Icon name="heart" size={24} /></div>
                    <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{T.motel_note}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-10 animate-fade-in max-w-3xl mx-auto">
              <div className="text-center mb-10 md:mb-12">
                <h2 className={`text-2xl md:text-4xl font-playfair font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.select_time_title}</h2>
              </div>
              
              <div className="relative mt-10">
                <div ref={dateScrollRef} className="flex gap-3 md:gap-4 overflow-x-auto px-2 py-4 snap-x scrollbar-hide">
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const monthName = d.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { month: 'short' }).replace('.', '');
                    return (
                      <div key={idx} className="snap-center shrink-0">
                        <button onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))} className={`w-[72px] h-[96px] md:w-[85px] md:h-[110px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 border ${isSel ? 'bg-blue-600 border-blue-400 text-white scale-[1.05]' : isDark ? 'bg-zinc-900/60 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-600'}`}>
                          <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-100' : 'opacity-80'}`}>{monthName}</span>
                          <span className="text-xl md:text-2xl font-bold font-playfair">{d.getDate()}</span>
                          <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-200' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{getDayLabel(d)}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="mt-10 md:mt-12 animate-fade-in">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-4">
                    {generateTimeSlots.map((t) => {
                      const isRush = RUSH_HOURS.includes(t);
                      return (
                        <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))} 
                          className={`relative flex flex-col items-center justify-center py-2 md:py-3 rounded-xl md:rounded-2xl text-sm font-bold transition-all duration-300 border
                            ${booking.time === t ? (isRush && booking.locationType !== 'motel' ? 'bg-amber-600 border-amber-400 text-white scale-105' : 'bg-blue-600 border-blue-400 text-white scale-105') 
                              : isDark ? (isRush && booking.locationType !== 'motel' ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-zinc-900/60 border-zinc-700 text-white') 
                              : (isRush && booking.locationType !== 'motel' ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-300 text-slate-800')
                            }`}>
                          <span>{t}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          )}
          
          {step === 3 && (
            <section className="space-y-8 md:space-y-12 animate-fade-in max-w-4xl mx-auto">
              <div className={`p-6 md:p-8 rounded-3xl border shadow-sm flex flex-col ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl md:text-2xl font-playfair font-medium mb-6 md:mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Icon name="file-text" size={24} className="text-blue-500" /> {T.summary_title}
                </h3>
                
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="space-y-3">
                      {booking.cart.map((cartItem, idx) => (
                         <div key={idx} className="flex justify-between items-center text-sm md:text-base border-b border-zinc-700 pb-3 last:border-0 last:pb-0">
                           <h4 className={`font-playfair font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cartItem.title}</h4>
                           <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{formatMoney(cartItem.price, lang)}</span>
                         </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`pt-6 border-t border-dashed ${isDark ? 'border-zinc-600' : 'border-slate-300'}`}>
                    <div className="flex justify-between mb-3 text-sm">
                      <span className={`font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.subtotal}</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatMoney(financials.sub, lang)}</span>
                    </div>
                    
                    <div className="flex justify-between items-end pt-6 mt-4 border-t border-solid border-blue-500/30">
                      <span className={`text-[10px] md:text-xs uppercase tracking-widest font-bold pb-1 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.total_label}</span>
                      <div className="text-right">
                        <span className={`text-3xl md:text-4xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-300 to-indigo-300' : 'from-blue-600 to-indigo-700'}`}>
                          {formatMoney(financials.total, lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 md:space-y-8">
                <div className={`p-6 md:p-8 rounded-3xl border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-base font-playfair font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.payment_title}</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'pix', label: T.pay_pix, icon: 'smartphone' },
                      { id: 'card', label: T.pay_card, icon: 'credit-card' },
                      { id: 'money', label: T.pay_cash, icon: 'banknote' }
                    ].map(p => (
                      <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))} className={`w-full flex items-center gap-3 p-4 h-16 rounded-2xl border transition-all duration-300 ${booking.payment === p.id ? 'bg-blue-600 border-blue-400 text-white' : isDark ? 'bg-zinc-900/80 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-700'}`}>
                        <Icon name={p.icon} size={20} className="shrink-0" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest flex-1 text-left truncate">{p.label}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${booking.payment === p.id ? 'border-white bg-blue-500' : isDark ? 'border-zinc-600' : 'border-slate-400'}`}>
                           {booking.payment === p.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div onClick={() => setTermsOpen(true)} className={`flex items-center justify-between p-5 md:p-6 rounded-3xl border cursor-pointer transition-all duration-300 ${booking.termsAccepted ? 'bg-emerald-600/20 border-emerald-500/60' : isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-300'}`}>
                  <div className="flex items-center gap-4 min-w-0 pr-2">
                    <div className={`shrink-0 ${booking.termsAccepted ? 'text-emerald-400' : isDark ? 'text-white' : 'text-slate-600'}`}><Icon name="shield" size={24} /></div>
                    <div className="min-w-0">
                      <span className={`text-sm font-semibold block mb-0.5 truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.terms_title}</span>
                      <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest truncate block ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.terms_read}</span>
                    </div>
                  </div>
                  <div onClick={(e) => { e.stopPropagation(); setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted })); }} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${booking.termsAccepted ? 'bg-emerald-600 border-emerald-500 text-white' : isDark ? 'border-zinc-600' : 'border-slate-400'}`}>
                    {booking.termsAccepted && <Icon name="check" size={16} />}
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {step === 4 && (
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in max-w-md mx-auto px-4">
              <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-[4px] shadow-xl shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-emerald-400' : 'bg-white border-slate-200 text-emerald-600'}`}>
                <Icon name="check" size={36} />
              </div>
              <h2 className={`text-3xl md:text-4xl font-playfair font-medium mb-4 leading-tight mt-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-sm md:text-base font-light leading-relaxed mb-10 ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{T.success_sub}</p>
              
              <div className="flex flex-col gap-4 w-full">
                <Button variant="whatsapp" size="lg" full icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>{T.whatsapp_btn}</Button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 left-0 right-0 p-3 md:p-6 z-40 animate-fade-in pointer-events-none">
          <div className={`max-w-3xl mx-auto rounded-[2rem] p-3 md:p-4 border backdrop-blur-3xl pointer-events-auto flex justify-between items-center transition-all shadow-2xl ${isDark ? 'bg-zinc-950/95 border-zinc-700 shadow-black/90' : 'bg-white/95 border-slate-300 shadow-slate-300/80'}`}>
            
            {step > 0 && (
               <button onClick={() => { setStep(s => s - 1); }} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-colors border shrink-0 ${isDark ? 'bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                 <Icon name="chevron-left" size={24} />
               </button>
            )}
            
            <div className={`flex-1 flex flex-col items-start justify-center min-w-0 px-4 ${step === 0 ? 'pl-6' : ''}`}>
              <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5 w-full ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                {step === 0 ? `${booking.cart.length} ${T.items_selected}` : step === 3 ? T.total_label : T.subtotal}
              </p>
              <p className={`text-xl md:text-2xl font-playfair font-semibold truncate w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {step === 3 ? formatMoney(financials.total, lang) : formatMoney(financials.sub, lang)}
              </p>
            </div>
            
            <Button onClick={handleNextStep} disabled={!isStepValid()} size="lg" className="!h-14 !px-6 md:!px-8 !text-[11px] md:!text-xs shrink-0 !rounded-2xl">
              <span className="hidden sm:inline">{step === 3 ? T.finish_btn : T.next_btn}</span>
              <span className="inline sm:hidden">{step === 3 ? T.btn_finish_short : T.btn_next_short}</span>
            </Button>
          </div>
        </nav>
      )}

      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-xl max-h-[85vh] rounded-3xl p-6 md:p-10 flex flex-col border shadow-2xl ${isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setTermsOpen(false)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors shrink-0 ${isDark ? 'hover:bg-zinc-800 text-white' : 'hover:bg-slate-100 text-slate-600'}`}><Icon name="x" size={20} /></button>
            <h3 className={`text-xl md:text-2xl font-playfair font-medium mb-6 md:mb-8 text-center shrink-0 pr-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.rules_complete}</h3>
            <div className="space-y-3 overflow-y-auto scrollbar-hide mb-6">
              {DATA.rules.map((rule, i) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className="shrink-0 pt-4 border-t border-zinc-700">
              <Button full size="lg" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
