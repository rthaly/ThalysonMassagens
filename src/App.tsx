import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES ESTÁTICAS (PERFORMANCE & SEGURANÇA)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v27_premium_plans', // RESTAURADO: Mantém o progresso dos clientes
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  SECRET_TOKEN: 'THALY_SECURE_V8',
  START_HOUR: 8,
  END_HOUR: 22, 
  MAX_STORAGE_SIZE: 5000 
} as const;

// Horários de pico (tarifa dinâmica)
const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

// Ícones Outline Otimizados
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
    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
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

const formatMoney = (val: number | undefined) => {
  if (val === undefined || isNaN(val)) return 'R$ 0,00';
  return `R$ ${val.toFixed(2).replace('.', ',')}`;
};

// Types & Interfaces
interface ServiceItem { id: string; min: number; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; popular?: boolean; }
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; loc: string; t: string; s: number; serv: string; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { street: string; number: string; district: string; city: string; comp: string; placeName: string; }
interface BookingData { type: 'single' | 'pack'; cart: ServiceItem[]; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; mediaAllowed: boolean; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// 3. COMPONENTES DE UI (MOBILE-FIRST MELHORADO)
// ==================================================================================

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.98] gap-2 shrink-0";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/20",
    secondary: "bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-xl shadow-green-900/20",
    outline: "bg-transparent border border-zinc-600 text-zinc-300 hover:border-zinc-400",
    ghost: "bg-transparent text-zinc-500 hover:text-zinc-300"
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

const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} role="presentation" />
      <aside className={`fixed top-0 right-0 h-full w-[85%] sm:w-[75%] max-w-sm z-[70] p-6 sm:p-8 md:p-10 shadow-2xl animate-slide-in flex flex-col ${isDark ? 'bg-zinc-950 text-white border-l border-zinc-800/50' : 'bg-white text-slate-900 border-l border-slate-100'}`}>
        <div className="flex justify-between items-center mb-10 md:mb-12">
          <h2 className="text-2xl font-playfair font-medium">Menu Central</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-500/10 transition-colors" aria-label="Fechar menu"><Icon name="x" size={24} /></button>
        </div>
        
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-white shadow-xl border border-zinc-700/50">
          <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest mb-2">Seu Nível</p>
          <div className="flex justify-between items-end">
             <span className="text-3xl font-light font-playfair">{user.xp} <span className="text-[10px] font-bold text-blue-400 font-sans tracking-widest uppercase">XP</span></span>
             <Icon name="award" size={28} className="text-blue-400" />
          </div>
        </div>

        <nav className="space-y-3 flex-1">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name={isDark ? "moon" : "sun"} size={20} className={isDark ? "text-blue-400" : "text-blue-600"} />
              <span className="font-semibold text-sm">Aparência</span>
            </div>
            <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">{isDark ? 'Noturna' : 'Clara'}</span>
          </button>
          
          <button onClick={() => { if(navigator.share) navigator.share({title: 'Thalyson Massagens', text: 'Encontrei a melhor massagem para tirar todo o estresse.', url: window.location.href}) }} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors mt-2 ${isDark ? 'hover:bg-zinc-900 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name="share" size={20} className="text-emerald-400" />
              <span className="font-semibold text-sm">Indicar Alguém</span>
            </div>
          </button>
        </nav>
      </aside>
    </>
  );
});

const Card = memo(({ children, className = '', onClick, active = false, isDark = true, popular = false, isPremium = false }: any) => {
  const getStyle = () => {
    if (active) {
      return isPremium 
        ? 'bg-amber-500/10 border-2 border-amber-500 shadow-amber-500/20 -translate-y-1' 
        : 'bg-blue-600/10 border-2 border-blue-500 shadow-blue-500/20 -translate-y-1';
    }
    if (isDark) {
      return isPremium 
        ? 'bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-amber-500/30 hover:border-amber-500/60 hover:bg-zinc-900/80' 
        : 'bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/80';
    }
    return isPremium 
      ? 'bg-gradient-to-br from-amber-50 to-white border border-amber-200 hover:border-amber-400 shadow-sm' 
      : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md';
  };

  return (
    <div onClick={onClick} className={`relative p-6 md:p-8 rounded-3xl transition-all duration-300 flex flex-col h-full ${onClick ? 'cursor-pointer active:scale-[0.98] hover:shadow-xl' : ''} ${getStyle()} ${className}`}>
      {popular && (
        <div className={`absolute -top-3 left-6 md:left-8 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md ${isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-400/30' : 'bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400/30'}`}>
          ✦ Mais Desejada
        </div>
      )}
      {children}
    </div>
  );
});

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text", isDark = true, hasError = false }: any) => (
  <div className="space-y-2 w-full min-w-0">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{label}</label>}
    <div className="relative group">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-500' : isDark ? 'text-zinc-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}><Icon name={icon} size={20} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-14 rounded-2xl outline-none text-sm font-medium transition-all bg-transparent ${icon ? 'pl-11 pr-4' : 'px-4'} ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-800 text-zinc-100 placeholder:text-zinc-700 focus:border-blue-500 focus:bg-zinc-900/80' : 'border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-blue-50/50'}`} />
    </div>
  </div>
));

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`w-full h-full flex flex-col p-6 md:p-8 rounded-3xl transition-all duration-300 border gap-4 ${isDark ? 'bg-zinc-900/30 border-zinc-800/80 hover:bg-zinc-900/60' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-playfair shadow-inner shrink-0 ${isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-slate-100 text-slate-700'}`}>
          {review.n.charAt(0)}
        </div>
        <div className="min-w-0 flex-1 pr-2">
          <span className={`text-sm md:text-base font-semibold block mb-0.5 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{review.n}</span>
          <span className={`text-[9px] md:text-[10px] block tracking-widest uppercase font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-1 px-2 py-1 rounded-full shrink-0">
        {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={14} className={i < review.s ? 'text-amber-400 fill-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'} />)}
      </div>
    </div>
    
    <div className={`inline-flex items-center self-start gap-1.5 px-3 py-1.5 rounded-full border text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
      <Icon name="award" size={12} className="shrink-0" />
      {review.serv}
    </div>

    <p className={`text-sm leading-relaxed md:leading-loose font-light italic flex-1 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>"{review.t}"</p>
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
    <div className={`flex items-center justify-center gap-3 p-5 rounded-2xl transition-all border shadow-sm ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
      <Icon name="watch" size={20} className="animate-pulse shrink-0" />
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest break-words text-center">{text}: <span className="font-mono text-sm ml-1 bg-blue-500/20 px-3 py-1.5 rounded-md">{format(time)}</span></span>
    </div>
  );
});

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800/60' : 'border-slate-200'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 md:py-6 flex items-center justify-between text-left group" aria-expanded={isOpen}>
        <span className={`text-sm md:text-base font-medium pr-4 leading-snug ${isDark ? 'text-zinc-200 group-hover:text-white' : 'text-slate-800 group-hover:text-black'}`}>{q}</span>
        <span className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-500' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}><Icon name="chevron-down" size={20} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 md:p-6 rounded-3xl border border-transparent transition-colors ${isDark ? 'hover:bg-zinc-900/60' : 'hover:bg-slate-50'}`}>
    <div className={`shrink-0 mt-0.5 ${isDark ? 'text-blue-500' : 'text-blue-600'}`}><Icon name={rule.icon} size={24} /></div>
    <div>
      <h4 className={`text-sm md:text-base font-bold mb-2 font-playfair ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{rule.title}</h4>
      <p className={`text-xs md:text-sm font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{rule.description}</p>
    </div>
  </div>
));

// ==================================================================================
// 4. LÓGICA DE DADOS E GERAÇÃO DE TEXTOS
// ==================================================================================
const sanitizeInput = (value: string): string => String(value || '').replace(/[<>&"']/g, '');
const validateAddress = (address: Address): boolean => !!(address.street && address.number && address.district && address.city);

const isWebViewUserAgent = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  return (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1) || (ua.indexOf('Instagram') > -1) || (ua.indexOf('Line') > -1) || (ua.indexOf('TikTok') > -1);
};

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

// RESTAURANDO TODAS AS AVALIAÇÕES ORIGINAIS
const getFullReviews = (): Review[] => {
  const originalGustavo = { n: "Gustavo", loc: "Bela Vista - SP", t: "O Thalyson chegou na hora certa, quando eu precisava relaxar após as tensões do mês. A experiência em casa foi incrível. Ele consegue deixar a gente completamente relaxado, as mãos dele tem uma técnica sem igual. O alívio foi imediato, levantei parecendo 10kg mais leve. Quero de novo.", serv: "Experiência Fusion" };

  const realReviews = [
    { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: "Você tem mãos abençoadas e eu voeeei! Precisava muito desse descanso, dessa paz. Foi super respeitoso a todo tempo e me relaxou demais. Obrigada! ❤️", serv: "Massagem Sensorial" },
    { n: "Osvaldo", loc: "Santa Fé do Sul", t: "HOJE, 10/02/26 não poderia ter teminado MELHOR o dia, sendo atendido por Thalyson em casa numa sessão de massagem por suas MÃOS MÁGICAS !!! Que delícia! Os 4 pilares essenciais do seu trabalho são bases para transformar o atendimento em uma SENSAÇÃO UNICA que gera valores pro corpo, combinando o aspecto de super EMPATIA com o cliente, sem esquecer da EFICIENCIA e agilidade, clareza durante a sessão, tornando ha, uma visão da PERFEIÇÃO de executar este trabalho de massagem com maestria! Thalyson foca sempre no propósito de servir bem o cliente, desde o início ao fim q é surpreendente! VALE A PENA. 👏👏👏", serv: "Massagem Clássica" },
    { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito.", serv: "Massagem Clássica" },
    { n: "Alan", loc: "SP - Bela Vista", t: "Gostei bastante, saí mais leve. Da pra ver que ele manda bem no que faz.", serv: "Massagem Sensorial" },
    { n: "Tiago", loc: "SP - Bela Vista", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", serv: "Experiência Fusion" }
  ];

  const seriousReviews = [
    { n: "Roberto", loc: "São Paulo - Jardins", t: "A sensação de vazio e paz que senti após a sessão foi indescritível. A finalização foi extremamente potente, liberando uma carga de tensão que eu carregava há meses. Profissionalismo impecável.", serv: "Experiência Fusion" },
    { n: "Carla", loc: "Rio Preto", t: "Me senti acolhida em um nível que não esperava. Ele tem uma pegada firme que relaxa a musculatura e ao mesmo tempo desperta sensações adormecidas. O alívio no final foi total.", serv: "Relaxante Clássica Naturista" },
    { n: "Lucas", loc: "Londrina", t: "Sendo casado, a discrição era minha prioridade e fui atendido com total sigilo. A massagem tântrica me permitiu redescobrir meu próprio corpo. A descarga de energia no final foi intensa.", serv: "Massagem Nuru" },
    { n: "Felipe", loc: "Votuporanga", t: "Uma experiência de conexão rara. Fiquei trêmulo após a sessão, de uma forma boa. Foi um momento de esvaziar a mente completamente. Recomendo para quem busca algo além do físico.", serv: "Massagem Sensorial" },
    { n: "Mariana", loc: "Jales", t: "Toque respeitoso, mas com a intensidade certa. Consegui me desligar dos problemas do trabalho e focar apenas no meu prazer e bem-estar. Foi libertador.", serv: "Massagem Clássica" },
    { n: "Gustavo", loc: "Hotel Ibis - SP", t: "A combinação da massagem relaxante com a sensitiva criou uma jornada perfeita. O ápice da sessão foi vigoroso e restaurador. Sensação de leveza absurda ao final.", serv: "Experiência Fusion" },
    { n: "Ricardo", loc: "Fernandópolis", t: "Encontrei um profissionalismo raro. Me senti à vontade para soltar minhas travas. Saí de lá me sentindo 10kg mais leve, física e emocionalmente.", serv: "Massagem Reversa Clássica" },
    { n: "Sérgio", loc: "Santa Fé", t: "Sofro de ansiedade e essa sessão foi mais eficaz que muitas terapias. A conexão humana foi real, e o clímax final foi o mais forte e libertador que já experimentei.", serv: "Massagem Nuru" },
    { n: "Beatriz", loc: "Rio Preto", t: "Mãos quentes e presença firme. O ambiente ficou carregado de uma energia positiva. Consegui relaxar profundamente e esquecer o caos lá fora.", serv: "Relaxante Clássica Naturista" },
    { n: "Marcelo", loc: "SP - Centro", t: "Fui sem expectativa e saí surpreendido. A massagem lingam foi executada com uma técnica precisa e respeitosa. O prazer foi intenso e genuíno.", serv: "Experiência Fusion" },
    { n: "André", loc: "Motel K2", t: "Discrição absoluta. O Thalyson é uma pessoa de energia muito boa e sabe o que faz. Foi um escape necessário e revitalizante da minha rotina.", serv: "Massagem Reversa Clássica" },
    { n: "Juliana", loc: "Londrina", t: "Delicadeza e força alternadas nos momentos exatos. Me senti viva de novo. Obrigada pelo carinho e respeito com meu corpo.", serv: "Massagem Clássica" },
    { n: "Paulo", loc: "São Paulo - Paulista", t: "Uma experiência completa. Do toque inicial reconfortante até a explosão final de energia. Foi intenso e me deixou com as pernas bambas de tanto relaxamento.", serv: "Experiência Fusion" },
    { n: "Vinícius", loc: "Jales", t: "Tirou um peso das minhas costas que eu nem sabia que carregava. A finalização foi potente e necessária. Voltarei com certeza.", serv: "Massagem Sensorial" },
    { n: "Fernanda", loc: "Santa Fé", t: "Super respeitoso com meu corpo. Foi uma troca de energia muito bonita, intensa e sem pressa. Me senti renovada.", serv: "Massagem Nuru" },
    { n: "Eduardo", loc: "Rio Preto", t: "Sensacional. A técnica dele para construir e depois liberar a energia é coisa de outro mundo. Foi um alívio físico e mental gigantesco.", serv: "Experiência Fusion" },
    { n: "Caio", loc: "SP - Consolação", t: "Atendimento impecável no meu hotel. Pontual, discreto e com uma mão que sabe exatamente onde tocar para aliviar a tensão.", serv: "Massagem Clássica" },
    { n: "Larissa", loc: "Votuporanga", t: "Relaxamento profundo. Esqueci de tudo lá fora. Recomendo para qualquer pessoa que precise se reconectar consigo mesma.", serv: "Relaxante Clássica Naturista" },
    { n: "Otávio", loc: "Londrina", t: "Foi intenso do início ao fim. Uma descarga de energia que eu estava precisando desesperadamente. Me senti limpo por dentro.", serv: "Massagem Nuru" },
    { n: "Diego", loc: "Fernandópolis", t: "A melhor parte foi não me sentir julgado. Pude ser eu mesmo, expressar meu prazer e aproveitar cada segundo de cuidado.", serv: "Massagem Reversa Clássica" }
  ];

  return [originalGustavo, ...realReviews, ...seriousReviews].map(r => ({ ...r, s: 5 }));
};

const getData = () => {
  const p = {
    depil: 107, relax: 157, sens: 177, naturista: 197, titan: 207, reversa: 227, nuru: 317,
    pack1: { v: 297, full: 334, save: 37 }, 
    pack2: { v: 387, full: 434, save: 47 }, 
    pack3: { v: 637, full: 721, save: 84 }, 
    extras: { more_time: 77, touch: 77, aroma: 17, hair_trim: 57, pain_relief: 17 }
  };
  
  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: "Iniciante no Cuidado" },
      { level: 2, xpNeeded: 100, reward: 15, title: "Prioridade Certa" },
      { level: 3, xpNeeded: 350, reward: 30, title: "Corpo Consciente" },
      { level: 4, xpNeeded: 800, reward: 50, title: "Plenitude Alcançada" }
    ],
    services: [
      { id: 'depilacao', min: 45, price: p.depil, icon: "scissors", tag: "PRATICIDADE", title: "Aparo Corporal Completo", desc: "A correria não te deixa cuidar de si mesmo? Eu resolvo. Fique com o corpo limpo, leve e preparado para a semana, sem dores de cabeça.", details: "Aparo zero ou Pente 3 com máquina\nFoco no peito, costas, abdômen e pernas\nNo conforto e total sigilo do seu espaço\nMenos suor e muito mais confiança no dia a dia" },
      { id: 'relaxante', min: 60, price: p.relax, icon: "user-check", tag: "ALÍVIO MUSCULAR", title: "Massagem Clássica (Alívio Rápido)", desc: "Costas travadas da cadeira do escritório? Corpo tenso? Essa é para tirar com as mãos aquele peso gigante que você carrega e te fazer dormir como um anjo.", details: "Uso de rolos de madeira para amassar partes do corpo\nToque suave para soltar a musculatura dura\nFoco em relaxar o corpo todo (sem toque íntimo)\nO botão de 'reiniciar' para quem trabalha demais" },
      { id: 'sensitiva', min: 60, price: p.sens, icon: "sparkles", tag: "REDUZ ANSIEDADE", title: "Massagem Sensorial (Reset Mental)", desc: "A cabeça não desliga na hora de dormir? Feche os olhos e deixe toques sutis arrepiarem seu corpo inteiro.", details: "Desconecta sua mente dos problemas do trabalho\nToques leves e estímulos que arrepiam a pele\nFinalização focada numa liberação intensa de prazer\nPerfeito para quem sofre com estresse pesado e insônia" },
      { id: 'naturista', min: 60, price: p.naturista, icon: "sun", tag: "ZERO AMARRAS", title: "Clássica Naturista (Liberdade)", desc: "Chegar em casa e tirar a roupa do trabalho é bom, né? Aqui elevamos isso. Liberdade total, sem roupas, toques leves para soltar cada músculo do seu corpo.", details: "Sessão feita com ambos totalmente despidos, não possui toques íntimos \nPressão exata para desmanchar a rigidez do dia a dia\nAlívio no corpo todo\nSensação de leveza e aceitação, sem julgamentos" },
      { id: 'mista', min: 90, price: p.titan, icon: "zap", tag: "O MELHOR DOS 2 MUNDOS", title: "Experiência Fusion (A Mais Completa)", desc: "Por que escolher se você pode ter tudo? Primeiro eu tiro a dor das suas costas, depois te levo a um clímax que faz qualquer problema da semana desaparecer.", details: "Começa suave: quebrando a tensão muscular do corpo\nMuda o ritmo: contato íntimo corpo a corpo (Massagista de cueca) e roçar de barba\nEnvolve seus sentidos numa crescente de calor e desejo\nTermina com um gozo libertador que recarrega suas baterias" },
      { id: 'reversa', min: 90, price: p.reversa, icon: "refresh-cw", tag: "CONTATO REAL", title: "Massagem Reversa (Troca e Toque)", desc: "Sente falta de calor humano e intimidade? Aqui você não é passivo. Você relaxa, mas tem total liberdade para colocar as mãos, me explorar e ditar o ritmo. Não possuí toques íntimos.", details: "Eu quebro o gelo inicial e relaxo seu corpo\nDepois o controle é seu: sinta-se à vontade para me tocar\nSem a frieza de 'cliente e profissional', pura conexão real\nUma dinâmica deliciosa de reciprocidade que te deixa realizado" },
      { id: 'nuru', min: 90, price: p.nuru, icon: "star", popular: true, tag: "ENTREGA TOTAL", title: "Massagem Nuru (A Mais Desejada)", desc: "Quando o nível de estresse está no limite, só isso resolve. Gel que desliza, partes do meu corpo deslizando sobre o seu, e uma entrega tão profunda que suas pernas vão tremer.", details: "Vivência de altíssima intimidade, ambos completamente nus\nMuito gel para um deslizamento perfeito e contínuo\nPele na pele, após a sessão de relaxamento primeiro: eu uso meu corpo para relaxar o seu\nA viagem mais suada e intensa para você gozar e apagar de relaxamento" }
    ] as ServiceItem[],
    plans: [
      { id: 'pack_essencial', type: 'pack', min: 120, title: "Kit Sobrevivência (2x)", price: p.pack1.v, fullPrice: p.pack1.full, savings: p.pack1.save, desc: "A dobradinha perfeita para quem tem uma rotina pesada. Um dia para curar a dor no corpo, outro para curar a ansiedade da mente.", details: "1x Clássica (para destravar o corpo todo)\n1x Sensorial (para esvaziar a cabeça e ter prazer intenso)\nIdeal para garantir pelo menos duas noites de sono perfeito no mês\nSeu corpo não é máquina, ele precisa dessa manutenção", tag: "SONO PERFEITO", icon: "layers" },
      { id: 'pack_interativo', type: 'pack', min: 180, title: "Combo Conexão Real (2x)", price: p.pack2.v, fullPrice: p.pack2.full, savings: p.pack2.save, desc: "Sente falta daquele contato mais quente e recíproco? Duas sessões para esquecer a solidão da semana e ter troca, pele e liberdade.", details: "1x Fusion (o meio-termo perfeito entre curar a dor e gozar)\n1x Reversa (o dia que você mata a vontade de tocar e explorar)\nFoco total em quebrar a rotina fria com muito calor humano\nVocê volta a se sentir vivo e desejado", tag: "FIM DA SOLIDÃO", icon: "heart" },
      { id: 'pack_premium', type: 'pack', min: 240, title: "Mensalidade do Chefe (3x)", price: p.pack3.v, fullPrice: p.pack3.full, savings: p.pack3.save, desc: "Você rala o mês inteiro, merece ser tratado como rei. O pacote definitivo com as minhas três melhores experiências para garantir que seu estresse seja zero.", details: "1x Naturista (liberdade e quebra de tensão muscular)\n1x Fusion (relaxamento e prazer sob medida)\n1x Nuru (o êxtase absoluto com gel quente e deslizamento)\nTrês semanas do mês com a garantia de relaxamento total", tag: "O REWARD DO MÊS", icon: "award" }
    ] as ServiceItem[],
    extras: [
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "✂️", isEmoji: true, label: "Aparo (Extra)", desc: "Manutenção em 2 partes do corpo para ficar impecável." },
      { id: 'more_time', price: p.extras.more_time, icon: "⏱️", isEmoji: true, label: "Tempo Estendido (+30m)", desc: "Porque quando está bom, não queremos que acabe." },
      { id: 'touch', price: p.extras.touch, icon: "🖐️", isEmoji: true, label: "Interação Orgânica", desc: "Sinta-se livre para participar e tocar também." },
      { id: 'aroma', price: p.extras.aroma, icon: "🌸", isEmoji: true, label: "Aromaterapia Profunda", desc: "Óleos essenciais que baixam a sua frequência mental." },
      { id: 'pain_relief', price: p.extras.pain_relief, icon: "💊", isEmoji: true, label: "Foco Extra em Dores", desc: "Uso de pomada técnica para tratar dores fortes." }
    ],
    faq: [
      { q: "Como o toque e a finalização funcionam?", a: "Tudo é conduzido com extremo respeito, focado inteiramente no seu conforto e prazer. O objetivo é criar um espaço seguro para que você possa se entregar, relaxar a mente e alcançar um gozo libertador que zera o estresse." },
      { q: "Onde é o local do nosso encontro?", a: "Vou até você, no conforto da sua residência ou hotel. Chego no horário marcado e transformo o ambiente (seja sua cama ou sofá) em um verdadeiro refúgio de paz para cuidarmos de você." },
      { q: "Como devo me preparar para a sessão?", a: "De coração aberto! O mais importante é que você tome um banho relaxante antes da minha chegada. O banho ajuda a soltar os músculos iniciais e deixa seu corpo pronto para a entrega total." },
      { q: "Tenho vergonha do meu corpo, e agora?", a: "Esqueça isso. Meu trabalho é puro acolhimento. Durante a sessão, não existe julgamento, existe apenas a vontade de proporcionar alívio, relaxamento profundo e muito prazer." }
    ],
    rules: [
      { icon: "shower", title: "A Ducha Preparatória", description: "O banho prévio é essencial. A água morna começa o relaxamento e prepara sua pele para o toque perfeito e intenso." },
      { icon: "hand", title: "Acolhimento e Respeito", description: "Eu cuido de você e do seu prazer. O respeito mútuo é a chave para que a magia aconteça de forma livre e natural." },
      { icon: "heart", title: "Entrega Absoluta", description: "Esqueça o mundo lá fora. Este tempo é seu para relaxar a mente, desmanchar as tensões e apenas gozar o momento." },
      { icon: "clock", title: "Seu Tempo é Sagrado", description: "Chego pontualmente para garantir que você aproveite cada minuto. Temos uma margem de tolerância de 15 minutos." }
    ],
    text: {
      welcome: "É muito bom ter você aqui,",
      choose_sub: "Sei o quanto a rotina está pesando. Escolha como quer ser cuidado e sentir prazer hoje. Selecione os itens que desejar e avance pelo carrinho.",
      level_label: "Sua Jornada de Cuidado",
      tab_packs: "Planos Mensais",
      tab_single: "Sessões Avulsas",
      next_btn: "Avançar",
      finish_btn: "Realizar Agendamento",
      loading: "Preparando um espaço de relaxamento para você...",
      toast_select_item: "Por favor, adicione ao menos um serviço no carrinho para continuarmos.",
      toast_select_date: "Toque na melhor data e selecione o horário para o nosso encontro.",
      toast_fill_name: "Preciso saber como te chamar, preencha seu nome.",
      toast_fill_addr: "Por favor, preencha o local para eu ir cuidar de você.",
      toast_accept_terms: "Leia e aceite nosso acordo de entrega e respeito.",
      toast_coupon_success: "Presente aplicado! Desconto ativado.",
      toast_coupon_invalid: "Poxa, esse código não é válido ou já expirou.",
      details_label: "O QUE VOCÊ VAI VIVENCIAR:",
      select_time_title: "Qual o melhor momento para o seu prazer?",
      location_title: "Onde será nosso encontro de paz?",
      extras_title: "Quer adicionar mais coisas ao carrinho?",
      coupon_section: "Seus Benefícios Disponíveis",
      payment_title: "Como prefere acertar? (No encontro)",
      terms_title: "Nosso Acordo de Entrega",
      success_title: "Quase lá!",
      success_sub: "O WhatsApp está sendo aberto automaticamente para confirmarmos a sua reserva. Caso não abra, utilize o botão abaixo.",
      whatsapp_btn: "Tentar Abrir WhatsApp Novamente",
      back_home: "Voltar e refazer escolhas",
      timer_text: "Seu carrinho está salvo por",
      upgrade_msg: "Excelente escolha adicionada ao carrinho!",
      input_name: "Qual é o seu nome ou apelido?",
      input_addr: "Nome da Rua ou Avenida",
      input_num: "Número",
      input_district: "Seu Bairro",
      input_city: "Sua Cidade",
      input_comp: "Apto, Bloco, etc (Opcional)",
      input_hotel: "Qual o nome do Hotel?",
      input_room: "Número do Quarto / Suíte",
      agree_terms: "Eu li e concordo com as regras de respeito e entrega mútua",
      faq_title: "Dúvidas Frequentes",
      reviews_title: "Quem já se permitiu relaxar:",
      empty_date: "Toque num dia acima para ver meus horários.",
      empty_slots: "Poxa, minha agenda já encheu para este dia. Pode tentar o próximo?",
      total_label: "Total do Carrinho",
      subtotal: "Soma dos Serviços",
      discount: "Desconto Aplicado",
      pix_discount: "Benefício Pix (3%)",
      welcome_popup_title: "Seja muito bem-vindo!",
      welcome_popup_msg: "Fico feliz que você decidiu tirar um tempo para se cuidar e sentir prazer no conforto do seu local. A maioria dos homens esquece de si mesmo. Aqui está um presente para nossa primeira vez.",
      levelup_popup_title: "Evolução Alcançada!",
      levelup_popup_msg: "Sua constância gerou recompensas. Acabei de liberar um novo benefício exclusivo para o seu próximo agendamento.",
      get_coupon: "Resgatar Meu Presente",
      rules_complete: "Acordo de Entrega Mútua",
      media_discount: "Desconto Portfólio (1%)",
      media_title: "Apoiar meu trabalho (Opcional)",
      media_desc: "Se quiser, você pode permitir fotos estéticas anônimas (apenas o contorno do corpo, sem rosto e sem intimidade) para meu portfólio. Em troca, você ganha 1% OFF no valor do carrinho.",
      media_bonus: "Liberar para ganhar 1% OFF",
      uber_notice: "Deslocamento: Como vou até você cuidar do seu corpo, uma taxa de Uber será calculada e confirmada na nossa conversa do WhatsApp, ok?",
      motel_note: "Um ambiente para sua entrega absoluta. A escolha, reserva e os custos do local ficam por sua conta, o prazer e o relaxamento são minha missão."
    },
    reviews: getFullReviews()
  };
};

// ==================================================================================
// 5. MAIN APP OTIMIZADO PARA MÚLTIPLAS ESCOLHAS E NOVO FLUXO
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('packs'); 
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error"}[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [showBrowserPrompt, setShowBrowserPrompt] = useState(false);
  
  const DATA = useMemo(() => getData(), []);
  const T = DATA.text;
  
  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 92, lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single', cart: [], extras: {}, date: null, time: null, locationType: 'home', address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false
  });
  
  const dateScrollRef = useRef<HTMLDivElement>(null);

  const openExternal = useCallback((platform: 'whatsapp' | 'instagram', customText?: string) => {
    let url = '';
    if (platform === 'whatsapp') {
      url = `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(customText || '')}`;
    } else {
      url = CONFIG.INSTAGRAM_URL;
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { document.body.removeChild(link); }, 100);
  }, []);
  
  const forceNativeBrowser = () => {
    const url = window.location.href;
    if (/android/i.test(navigator.userAgent)) {
      window.location.href = `intent://${url.replace(/^https?:\/\//i, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    } else {
      openExternal('instagram', url);
    }
  };
  
  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
    if (isWebViewUserAgent()) {
      setShowBrowserPrompt(true);
    }
  }, []);

  useEffect(() => {
    if (isClient && !showBrowserPrompt) {
        document.title = step === 0 ? "Thalyson Massagens - Conforto & Prazer" : "Seu Agendamento - Thalyson";
    }
  }, [step, isClient, showBrowserPrompt]);
  
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
            ordersCount: typeof parsed.user.ordersCount === 'number' ? Math.max(parsed.user.ordersCount, 92) : 92,
            lastActivity: parsed.user.lastActivity || new Date().toISOString()
          };
        }
        
        if (parsed.bookingDraft && Array.isArray(parsed.bookingDraft.cart)) {
          const draftDate = parsed.bookingDraft.date ? new Date(parsed.bookingDraft.date) : null;
          if (!draftDate || draftDate > new Date()) {
            loadedBooking = {
              ...booking,
              ...parsed.bookingDraft,
              cart: parsed.bookingDraft.cart || [],
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
    setTimeout(() => setLoading(false), 800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient, DATA.services, DATA.plans]);
  
  useEffect(() => {
    if (isClient && dataLoaded && !showBrowserPrompt) {
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
  }, [user, booking, step, isClient, dataLoaded, showBrowserPrompt]);
  
  useEffect(() => {
    if (!loading && isClient && dataLoaded && !showBrowserPrompt && !user.hasSeenWelcome && !welcomePopup) {
      const timer = setTimeout(() => setWelcomePopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded, welcomePopup, showBrowserPrompt]);
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);
  
  const handleToggleCartItem = useCallback((item: ServiceItem) => {
    setBooking(prev => {
      const exists = prev.cart.find(c => c.id === item.id);
      let newCart;
      if (exists) {
        newCart = prev.cart.filter(c => c.id !== item.id);
      } else {
        newCart = [...prev.cart, item];
      }
      return { ...prev, cart: newCart, payment: '', termsAccepted: false, bookingId: prev.bookingId || `BOOK_${Date.now()}` };
    });
    addToast(`Item adicionado/removido do carrinho.`, "success");
  }, [addToast]);

  const daysArray = useMemo(() => {
    const days = []; const today = new Date();
    for (let i = 0; i < 30; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }
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
    if (booking.cart.length === 0) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0, rushFee: 0, duration: 0 };
    
    let sub = booking.cart.reduce((acc, item) => acc + item.price, 0);
    let totalDuration = booking.cart.reduce((acc, item) => acc + (item.min || 60), 0);

    const hasPack = booking.cart.some(item => item.type === 'pack');

    Object.keys(booking.extras || {}).forEach(k => { 
      if (booking.extras[k]) { 
        const extData = DATA.extras.find(e => e.id === k); 
        if (extData) {
            sub += hasPack ? Math.floor(extData.price * 0.8) : extData.price; 
            if (extData.id === 'more_time') totalDuration += 30;
        }
      } 
    });

    const isRushHour = RUSH_HOURS.includes(booking.time || '');
    const rushFee = isRushHour ? RUSH_FEE : 0;

    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let runningTotal = Math.max(0, sub - disc);
    
    let mediaDisc = 0;
    if (booking.mediaAllowed) { mediaDisc = Math.ceil(runningTotal * 0.01); runningTotal = Math.max(0, runningTotal - mediaDisc); }
    
    let pixDisc = 0;
    if (booking.payment === 'pix') { pixDisc = Math.ceil(runningTotal * 0.03); }
    
    const finalTotal = Math.max(0, runningTotal - pixDisc) + rushFee;
    
    return { sub, disc, pixDisc, mediaDisc, rushFee, total: finalTotal, duration: totalDuration };
  }, [booking.cart, booking.extras, booking.appliedCoupon, DATA.extras, booking.payment, booking.mediaAllowed, booking.time]);
  
  const estimatedXP = useMemo(() => {
    const hasPack = booking.cart.some(item => item.type === 'pack');
    return Math.floor(financials.total * (hasPack ? 0.30 : 0.15));
  }, [financials.total, booking.cart]);
  
  const getNextLevelInfo = (currentXP: number) => {
    if (currentXP >= 800) {
      const needed = 500 - ((currentXP - 800) % 500);
      return { needed, reward: DATA.levels[3].reward, title: "Plenitude Plus" };
    }
    const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
    return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };
  
  const nextLevelInfo = getNextLevelInfo(user.xp);

  const getCurrentLevelProgress = () => {
    if (user.xp >= 800) return (((user.xp - 800) % 500) / 500) * 100;
    const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
    const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
    const currentLevel = DATA.levels[realIndex]; const nextLevel = DATA.levels[realIndex + 1];
    if (!nextLevel) return 100; return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };
  
  const generateWhatsAppMsg = () => {
    const f = financials; 
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(CONFIG.LOCALE_PT) : '';
    const securityHash = btoa(encodeURIComponent(`${f.total}-${dateStr}-${booking.cart[0]?.id || ''}-${CONFIG.SECRET_TOKEN}`)).substring(0, 8).toUpperCase();
    
    // MUDANÇA: Trazendo DESCRIÇÃO e DETALHES dos serviços selecionados pro WhatsApp
    const servicesListText = booking.cart.map(item => {
      const detailLines = item.details.split('\n').map(line => `  • ${line}`).join('\n');
      return `✅ *${item.title}*\n_${item.desc}_\n*O que inclui:*\n${detailLines}`;
    }).join('\n\n');
    
    let locTxt = ""; let mapQuery = "";
    if (booking.locationType === 'home') { 
      const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`; 
      locTxt = `🏠 *Residência*\n📍 ${fullAddr}\n📝 Complemento: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    else if (booking.locationType === 'motel') { 
      locTxt = `🏩 *Suíte/Motel*\n⚠️ (Local reservado e garantido pelo cliente)`; 
    }
    else { 
      const fullAddr = `${booking.address.placeName}, ${booking.address.city}`; 
      locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 Quarto: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    
    const extrasList = Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => { 
      const ex = DATA.extras.find(e => e.id === k); 
      return ex ? `➕ ${ex.label}` : ''; 
    }).filter(Boolean).join('\n');
    
    let priceDetails = `💵 *Soma dos Cuidados:* R$ ${f.sub.toFixed(2).replace('.', ',')}`;
    if (f.disc > 0) priceDetails += `\n🎁 *Presente (${booking.appliedCoupon?.code}):* -R$ ${f.disc.toFixed(2).replace('.', ',')}`;
    if (f.mediaDisc > 0) priceDetails += `\n📸 *Desconto Portfólio:* -R$ ${f.mediaDisc.toFixed(2).replace('.', ',')}`;
    if (f.pixDisc > 0) priceDetails += `\n💸 *Desconto PIX (3%):* -R$ ${f.pixDisc.toFixed(2).replace('.', ',')}`;
    if (f.rushFee > 0) priceDetails += `\n🚗 *Taxa de Pico (Horário):* +R$ ${f.rushFee.toFixed(2).replace('.', ',')}`;
    priceDetails += `\n\n💰 *VALOR FINAL DA SESSÃO: R$ ${f.total.toFixed(2).replace('.', ',')}*`;

    // MUDANÇA: Link Oficial de GPS do Google Maps
    const finalMapLink = mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : '';
    
    // MUDANÇA: Template arrumado, evidenciando que o uber SERÁ CALCULADO AINDA
    let msg = `
*RESERVA DE CUIDADO* | #${securityHash}
──────────────────
Olá Thalyson! Gostaria de agendar meu momento.

👤 *Nome:* ${sanitizeInput(user.name)}
📅 *Data:* ${dateStr} às ${booking.time}
⏱️ *Duração Total Estimada:* ${f.duration} Minutos

💆‍♂️ *O QUE ESCOLHI:*
${servicesListText}

${extrasList ? `*Extras Adicionados:*\n${extrasList}\n` : ''}
📍 *ONDE:*
${locTxt}
${finalMapLink ? `🔗 GPS: ${finalMapLink}` : ''}
⚠️ *Aviso de Deslocamento:* Estou ciente de que a taxa de deslocamento (Uber) até o local ainda será calculada e confirmada por você aqui no chat.

💰 *RESUMO DO INVESTIMENTO:*
${priceDetails}

💳 *Forma de Pagamento:* ${booking.payment.toUpperCase()}
──────────────────
_Aceito os termos de entrega e aguardo sua confirmação. O meu WhatsApp para contato é este mesmo!_
    `.trim();

    return msg;
  };
  
  const copyToClipboard = () => { 
    navigator.clipboard.writeText(generateWhatsAppMsg()); 
    addToast("Resumo copiado com sucesso!", "success"); 
  };
  
  const isStepValid = useCallback(() => {
    if (step === 0) return booking.cart.length > 0;
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
        updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 Recompensa: ${lvl.title}`, code: `LVLUP${lvl.level}` }); 
      }
    });

    if (newXP > 800) {
      const getLoops = (xp: number) => Math.floor(Math.max(0, xp - 800) / 500);
      const oldLoops = getLoops(user.xp);
      const newLoops = getLoops(newXP);
      
      if (newLoops > oldLoops) {
        const loopRewardValue = DATA.levels[3].reward; 
        
        for (let i = oldLoops + 1; i <= newLoops; i++) {
          leveledUp = true;
          newLevelTitle = "Plenitude Plus";
          updatedCoupons.push({ 
              id: `LOOP_${i}_${Date.now()}`, 
              val: loopRewardValue, 
              title: `🏆 Recompensa Especial: Plenitude Plus`, 
              code: `PLUS${i}` 
          });
        }
      }
    }
    
    const newOrdersCount = (user.ordersCount || 92) + 1;
    
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
    
    openExternal('whatsapp', generateWhatsAppMsg());
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
    
    if (d.toDateString() === today.toDateString()) return 'HOJE';
    if (d.toDateString() === tomorrow.toDateString()) return 'AMANHÃ';
    return d.toLocaleDateString(CONFIG.LOCALE_PT, { weekday: 'short' }).slice(0, 3).toUpperCase();
  };
  
  if (!isClient) return <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center" />;
  
  if (showBrowserPrompt) {
    return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 text-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
         <div className="max-w-md w-full animate-fade-in flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-3xl mb-8 border border-amber-500/30">
               <Icon name="alert-circle" size={40} />
            </div>
            <h2 className="text-3xl font-playfair font-medium mb-4">Atenção!</h2>
            <p className={`text-sm font-light mb-8 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              Você está no navegador do Instagram/Facebook. Para que o envio para o WhatsApp funcione perfeitamente no final, precisamos que abra esta página no navegador do seu celular.
            </p>
            
            <div className={`w-full p-6 rounded-3xl border text-left mb-8 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
               <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>Como fazer (iPhone/iOS):</p>
               <p className={`text-sm mb-4 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                 1. Toque nos <strong className={isDark ? 'text-white' : 'text-black'}>3 pontinhos (...)</strong> no topo da tela.<br/>
                 2. Escolha <strong className={isDark ? 'text-white' : 'text-black'}>"Abrir no navegador"</strong> ou <strong>"Abrir no Safari"</strong>.
               </p>
            </div>

            <div className="w-full space-y-4">
               {/android/i.test(navigator.userAgent) && (
                 <Button full size="lg" onClick={forceNativeBrowser}>Tentar Forçar (Apenas Android)</Button>
               )}
               <button onClick={() => setShowBrowserPrompt(false)} className={`w-full h-14 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-colors ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-200 text-slate-500 hover:text-black'}`}>
                 Ignorar e Continuar Aqui
               </button>
            </div>
         </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] transition-colors duration-700 ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center max-w-sm w-full px-8">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-4xl md:text-5xl font-playfair mb-8 md:mb-10 animate-pulse shadow-2xl shadow-blue-500/20 border border-blue-400/20">
            T
          </div>
          <div className="w-full h-1.5 md:h-2 bg-zinc-800/30 overflow-hidden mb-4 md:mb-6 rounded-full">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%', animation: 'loading-bar 2s ease-in-out infinite' }}></div>
          </div>
          <p className="text-[10px] md:text-xs uppercase font-bold tracking-widest opacity-50">{T.loading}</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}} />
      </div>
    );
  }
  
  return (
    <>
      <GlobalStyles isDark={isDark} />
      
      {/* Background Container App */}
      <div className={`fixed inset-0 z-[-1] pointer-events-none transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`} aria-hidden="true" />
      
      {/* Toasts / Notifications */}
      <div className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div key={t.id} role="alert" className={`pointer-events-auto flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-xl md:rounded-2xl border backdrop-blur-2xl shadow-2xl animate-fade-in ${t.type === 'success' ? isDark ? 'bg-zinc-800/90 border-zinc-700 text-zinc-100' : 'bg-white/95 border-slate-200 text-slate-800' : 'bg-red-500/95 border-red-500 text-white'}`}>
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={20} className="shrink-0" />
            <span className="text-xs md:text-sm font-semibold tracking-wide leading-snug">{t.msg}</span>
          </div>
        ))}
      </div>
      
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} user={user} />

      <main className="min-h-screen relative z-10 pb-40 md:pb-48 px-4 md:px-8 max-w-5xl mx-auto selection:bg-blue-500/30 selection:text-blue-200">
        {step !== 4 && (
          <header className="pt-10 md:pt-16 pb-8 md:pb-12">
            <div className="flex items-start justify-between">
              <div className="flex flex-col cursor-pointer transition-opacity hover:opacity-80" onClick={() => setStep(0)} title="Voltar ao Início">
                <h1 className={`text-2xl md:text-4xl font-playfair tracking-tight font-medium ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Thalyson <br className="block sm:hidden" /> Massagens
                </h1>
                <div className="flex items-center gap-2 text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest mt-2 md:mt-3 font-bold">
                  <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-blue-500"></span></span>
                  Mais de {user.ordersCount || 92} tensões resolvidas
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => openExternal('instagram')} aria-label="Acessar Instagram" className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all border shadow-sm ${isDark ? 'bg-zinc-900/60 border-zinc-800 text-pink-500 hover:bg-zinc-800 hover:text-pink-400 hover:border-zinc-700' : 'bg-white border-slate-200 text-pink-600 hover:bg-slate-50 hover:shadow-md'}`}>
                   <Icon name="instagram" size={20} />
                </button>
                <button onClick={() => setMenuOpen(true)} aria-label="Abrir Menu" className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all border shadow-sm shrink-0 ${isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-md'}`}>
                   <Icon name="menu" size={20} />
                </button>
              </div>
            </div>
            
            {step > 0 && step < 4 && (
              <div className="mt-8 md:mt-12 flex items-center justify-between gap-3 max-w-sm mx-auto">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 md:gap-3">
                    <div className={`w-full h-1 md:h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                    <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${step >= i ? isDark ? 'text-zinc-100' : 'text-slate-900' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                      {i === 1 ? 'Quando' : i === 2 ? 'Onde' : 'Resumo'}
                    </span>
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
                  <h2 className={`text-3xl md:text-5xl font-playfair font-medium leading-[1.15] mb-4 md:mb-6 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    {T.welcome} <span className="italic text-blue-500">{user.name ? String(user.name).trim().split(' ')[0] : "permita-se"}.</span>
                  </h2>
                  <p className={`text-sm md:text-lg font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {T.choose_sub}
                  </p>
                </div>
                
                <div className={`p-6 md:p-8 rounded-3xl border transition-colors ${isDark ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50 hover:border-slate-300'}`}>
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border shadow-inner shrink-0 ${isDark ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700 text-amber-500' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 text-amber-600'}`}>
                        <Icon name="award" size={24} />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest block mb-1 truncate ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          {T.level_label}
                        </span>
                        <h3 className={`text-lg md:text-xl font-playfair font-medium truncate ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                          {user.xp >= 800 ? "Plenitude Plus" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-3xl md:text-4xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-zinc-100 to-zinc-400' : 'from-slate-700 to-slate-900'}`}>{user.xp}</span>
                      <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mt-1 md:mt-2">Nível Atual</span>
                    </div>
                  </div>
                  <div>
                    <div className={`flex justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      <span>Sua Jornada</span>
                      <span>{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`} role="progressbar" aria-valuenow={getCurrentLevelProgress()} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full bg-blue-500 transition-all duration-1000 ease-out relative" style={{ width: `${getCurrentLevelProgress()}%` }}>
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    {nextLevelInfo && (
                      <p className={`text-[11px] md:text-xs mt-4 text-center font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        Mantenha o cuidado. Faltam <strong className={isDark ? 'text-zinc-300' : 'text-slate-700'}>{nextLevelInfo.needed} XP</strong> para seu próximo benefício de <span className="text-blue-500 break-words">+{formatMoney(nextLevelInfo.reward)}</span>.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`flex p-1.5 md:p-2 rounded-2xl md:rounded-3xl border max-w-sm mx-auto shadow-inner ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-100/80 border-slate-200'}`} role="tablist">
                <button role="tab" aria-selected={activeTab === 'packs'} onClick={() => setActiveTab('packs')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'packs' ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/30' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="package" size={16} /> {T.tab_packs}
                </button>
                <button role="tab" aria-selected={activeTab === 'single'} onClick={() => setActiveTab('single')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="user" size={16} /> {T.tab_single}
                </button>
              </div>
              
              {/* Grid de Serviços */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => {
                  const isInCart = booking.cart.some(cartItem => cartItem.id === s.id);
                  const isPremiumCard = s.type === 'pack' || activeTab === 'packs';
                  
                  return (
                  <Card key={s.id} active={isInCart} onClick={() => handleToggleCartItem(s)} isDark={isDark} popular={s.popular} isPremium={isPremiumCard}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6 gap-3">
                        <div className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${isDark ? (isPremiumCard ? 'bg-zinc-900 border-amber-500/30 text-amber-500' : 'bg-zinc-800 border-zinc-700 text-zinc-200') : (isPremiumCard ? 'bg-amber-100 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-700')}`}>
                          <Icon name={s.icon} size={24} isEmoji={s.isEmoji} />
                        </div>
                        <div className="text-right min-w-0 flex-1 flex flex-col items-end relative">
                          {isInCart && (
                            <div className={`absolute -top-2 -right-2 text-white w-6 h-6 flex items-center justify-center rounded-full animate-fade-in shadow-md ${isPremiumCard ? 'bg-amber-500' : 'bg-blue-500'}`}>
                              <Icon name="check" size={14} />
                            </div>
                          )}
                          {s.fullPrice && (
                            <span className={`text-[9px] md:text-[10px] block mb-1 font-inter uppercase tracking-widest font-bold w-full ${isDark ? 'text-red-400/80' : 'text-red-500/80'}`}>
                              De: <span className="line-through">{formatMoney(s.fullPrice)}</span>
                            </span>
                          )}
                          <span className={`text-xl md:text-2xl font-playfair font-semibold w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {formatMoney(s.price)}
                          </span>
                          {s.savings && (
                            <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full block mt-2 border max-w-fit ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                              ECONOMIA: {formatMoney(s.savings)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest border px-3 py-1.5 rounded-full inline-block mb-3 md:mb-4 ${isDark ? (isPremiumCard ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-800/80 border-zinc-700 text-blue-400') : (isPremiumCard ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-blue-50 border-blue-200 text-blue-700')}`}>
                          {s.tag}
                        </span>
                        <h3 className={`text-lg md:text-xl font-playfair font-medium mb-2 md:mb-3 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                          {s.title}
                        </h3>
                        <p className={`text-xs md:text-sm font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`pt-4 md:pt-5 mt-auto border-t ${isDark ? (isPremiumCard ? 'border-amber-500/20' : 'border-zinc-800/60') : (isPremiumCard ? 'border-amber-200' : 'border-slate-200')}`}>
                      <div className={`flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-300' : 'text-slate-500'}`}>
                        <Icon name="check" size={14} className={`${isPremiumCard ? 'text-amber-500' : 'text-emerald-500'} shrink-0`} /> {T.details_label}
                      </div>
                      <div className={`text-[11px] md:text-xs space-y-2 font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {s.details.split('\n').map((line, i) => <p key={i} className="flex items-start gap-2"><span className={`${isPremiumCard ? 'text-amber-500' : 'text-blue-500'} mt-1 text-[10px] shrink-0`}>•</span> <span>{line}</span></p>)}
                      </div>
                    </div>
                  </Card>
                )})}
              </div>
              
              <div className="py-12 md:py-16 relative border-t border-b border-dashed border-zinc-800/50 mt-12 md:mt-16">
                <div className="flex items-center justify-between mb-8 md:mb-10">
                  <h3 className={`text-2xl md:text-3xl font-playfair font-medium ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                    {T.reviews_title}
                  </h3>
                  <div className="hidden md:flex gap-3">
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: -320, behavior: 'smooth' })} className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 shadow-sm'}`}><Icon name="chevron-left" size={20} /></button>
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: 320, behavior: 'smooth' })} className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800 shadow-sm'}`}><Icon name="chevron-right" size={20} /></button>
                  </div>
                </div>
                
                <div id="reviews-slider" className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-6 pt-2 -mx-4 md:-mx-8 px-4 md:px-8 gap-4 md:gap-6 items-stretch" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-[360px] flex h-auto">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="max-w-2xl mx-auto py-10 md:py-12">
                <h3 className={`text-2xl md:text-3xl font-playfair font-medium text-center mb-8 md:mb-10 ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
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
              <div className="text-center mb-10 md:mb-12">
                <h2 className={`text-2xl md:text-4xl font-playfair font-medium mb-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  {T.select_time_title}
                </h2>
                <p className={`text-sm font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {T.toast_select_date}
                </p>
              </div>
              
              <div className={`p-6 md:p-8 rounded-3xl flex flex-col gap-4 border shadow-sm ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200'}`}>
                 <div className="flex items-center justify-between">
                   <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Seu Carrinho:</span>
                   <button onClick={() => setStep(0)} className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full transition-colors border shrink-0 ${isDark ? 'border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>Editar</button>
                 </div>
                 {booking.cart.map(item => (
                   <div key={item.id} className="flex justify-between items-center text-sm md:text-base border-b pb-2 last:border-0 last:pb-0 border-zinc-800/50">
                     <span className={`font-semibold font-playfair ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{item.title}</span>
                     <span className={isDark ? 'text-zinc-400' : 'text-slate-500'}>{formatMoney(item.price)}</span>
                   </div>
                 ))}
              </div>

              <div className="relative mt-10">
                <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all border shadow-lg shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><Icon name="chevron-left" size={20} /></button>
                
                <div ref={dateScrollRef} className="flex gap-3 md:gap-4 overflow-x-auto px-2 py-4 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const monthName = d.toLocaleDateString(CONFIG.LOCALE_PT, { month: 'short' }).replace('.', '');
                    return (
                      <div key={idx} className="snap-center shrink-0">
                        <button onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))} className={`w-[72px] h-[96px] md:w-[85px] md:h-[110px] rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-300 border ${isSel ? 'bg-blue-600 border-blue-500 text-white scale-[1.05] shadow-lg shadow-blue-900/30' : isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/60' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                          <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-100' : 'opacity-60'}`}>{monthName}</span>
                          <span className="text-xl md:text-2xl font-bold font-playfair">{d.getDate()}</span>
                          <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-200' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{getDayLabel(d)}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all border shadow-lg shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><Icon name="chevron-right" size={20} /></button>
              </div>
              
              {!booking.date && (
                <div className={`text-center py-16 md:py-20 rounded-3xl border border-dashed flex flex-col items-center justify-center gap-4 mt-8 transition-colors px-4 ${isDark ? 'border-zinc-800 bg-zinc-900/30 text-zinc-500' : 'border-slate-300 bg-slate-50/50 text-slate-400'}`}>
                  <Icon name="calendar" size={36} className="opacity-30" />
                  <p className="text-xs font-bold uppercase tracking-widest">{T.empty_date}</p>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="mt-10 md:mt-12 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <h4 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Escolha o Horário</h4>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
                    {generateTimeSlots.map((t) => {
                      const isRush = RUSH_HOURS.includes(t);
                      return (
                        <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))} 
                          className={`relative flex flex-col items-center justify-center py-2 md:py-3 rounded-xl md:rounded-2xl text-sm font-bold transition-all duration-300 border
                            ${booking.time === t 
                              ? (isRush ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/30 scale-105' : 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30 scale-105') 
                              : isDark 
                                ? (isRush ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-600') 
                                : (isRush ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm')
                            }`}
                        >
                          <span>{t}</span>
                          {isRush && <span className={`text-[8px] uppercase tracking-wider mt-0.5 ${booking.time === t ? 'text-amber-100' : isDark ? 'text-amber-500/70' : 'text-amber-600/70'}`}>Pico (+15)</span>}
                        </button>
                      );
                    })}
                  </div>

                  {generateTimeSlots.some(t => RUSH_HOURS.includes(t)) && (
                    <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 text-[11px] md:text-xs font-medium leading-relaxed border ${isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                      <Icon name="alert-circle" size={16} className="shrink-0 mt-0.5" />
                      <p><strong>Horários de Pico:</strong> Períodos com alto tráfego (meio-dia ou fim de tarde) possuem um pequeno acréscimo de R$ 15 na taxa de deslocamento para garantir que eu chegue até você com pontualidade.</p>
                    </div>
                  )}
                </div>
              )}
              
              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-16 rounded-3xl border mt-8 ${isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <p className="text-sm font-medium tracking-wide leading-relaxed px-4">{T.empty_slots}</p>
                </div>
              )}
            </section>
          )}
          
          {step === 2 && (
            <section className="space-y-10 md:space-y-12 animate-fade-in max-w-2xl mx-auto">
              <h2 className={`text-2xl md:text-4xl font-playfair font-medium text-center ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              <div className="grid grid-cols-3 gap-2 md:gap-4">
                {[
                  { id: 'home', label: 'Sua Casa', icon: 'home' },
                  { id: 'motel', label: 'Suíte', icon: 'bed' },
                  { id: 'hotel', label: 'Hotel', icon: 'building' }
                ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))} className={`py-4 md:py-6 px-2 rounded-2xl flex flex-col items-center gap-2 md:gap-3 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30 -translate-y-1' : isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 shadow-sm'}`}>
                    <Icon name={x.icon} size={24} />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center">{x.label}</span>
                  </button>
                ))}
              </div>
              
              <div className={`p-6 md:p-8 rounded-3xl border shadow-sm transition-colors ${isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-slate-100'} space-y-6 md:space-y-8`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder="Seu nome" hasError={!user.name || String(user.name).trim().length < 3} />
                
                {booking.locationType === 'home' && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
                      <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} icon="map-pin" placeholder="Rua / Avenida" hasError={!booking.address.street} />
                      <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Nº" type="tel" hasError={!booking.address.number} />
                    </div>
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder="Seu Bairro" hasError={!booking.address.district} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder="Sua Cidade" hasError={!booking.address.city} />
                      <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Apto, Bloco (Opcional)" />
                    </div>
                  </div>
                )}
                
                {booking.locationType === 'hotel' && (
                  <div className="space-y-5 animate-fade-in">
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder="Nome do Hotel" hasError={!booking.address.placeName} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder="Cidade" hasError={!booking.address.city} />
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Nº do Quarto" />
                  </div>
                )}
                
                {booking.locationType === 'motel' && (
                  <div className={`p-6 rounded-2xl border text-center animate-fade-in ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-50 border-slate-200'} flex flex-col items-center gap-4`}>
                    <div className={`p-3 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-200 text-slate-500'}`}>
                      <Icon name="heart" size={24} />
                    </div>
                    <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                      {T.motel_note}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <h3 className={`text-xs font-bold uppercase mb-4 tracking-widest pl-1 flex items-center gap-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <Icon name="sparkles" size={16} className="text-blue-500" /> {T.extras_title}
                </h3>
                <div className="space-y-3">
                  {DATA.extras.map((ex) => {
                    const price = booking.cart.some(item => item.type === 'pack') ? Math.floor(ex.price * 0.8) : ex.price;
                    const isActive = booking.extras[ex.id];
                    return (
                      <div key={ex.id} onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))} className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${isActive ? 'bg-blue-600/10 border-blue-500 shadow-sm' : isDark ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'} group`} role="checkbox" aria-checked={isActive}>
                        <div className="flex items-center gap-4 min-w-0 pr-2">
                          <div className={`transition-transform duration-300 shrink-0 ${isActive ? 'scale-110' : ''}`}><Icon name={ex.icon} size={24} isEmoji={ex.isEmoji} /></div>
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${isActive ? isDark ? 'text-blue-400' : 'text-blue-700' : isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{ex.label}</p>
                            <p className={`text-[10px] md:text-xs font-light mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{ex.desc}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[9px] md:text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full transition-colors ${isActive ? 'bg-blue-500 text-white' : isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
                            + {formatMoney(price)}
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
            <section className="space-y-8 md:space-y-12 animate-fade-in max-w-4xl mx-auto">
              <SmartTimer isDark={isDark} text={T.timer_text} />
              
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 md:gap-8">
                <div className={`p-6 md:p-10 rounded-3xl border shadow-sm flex flex-col ${isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-slate-100'}`}>
                  <h3 className={`text-xl md:text-2xl font-playfair font-medium mb-6 md:mb-8 flex items-center gap-3 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    <Icon name="file-text" size={24} className="text-blue-500" /> Resumo do Pedido
                  </h3>
                  
                  <div className="flex-1 space-y-6">
                    <div>
                      <p className={`text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        CUIDADOS ESCOLHIDOS
                      </p>
                      <div className="space-y-3">
                        {booking.cart.map((cartItem, idx) => (
                           <div key={idx} className="flex justify-between items-center text-sm md:text-base border-b border-zinc-800/30 pb-3 last:border-0 last:pb-0">
                             <h4 className={`font-playfair font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                                {cartItem.title}
                             </h4>
                             <span className={`font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{formatMoney(cartItem.price)}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                    
                    {Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).length > 0 && (
                      <div className={`pt-4 border-t border-zinc-800/30`}>
                        <p className={`text-[9px] uppercase font-bold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          EXTRAS
                        </p>
                        <div className="space-y-2">
                          {Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => {
                            const ex = DATA.extras.find(e => e.id === k);
                            if (!ex) return null;
                            const price = booking.cart.some(item => item.type === 'pack') ? Math.floor(ex.price * 0.8) : ex.price;
                            return (
                              <div key={k} className="flex justify-between text-sm font-light">
                                <span className={`flex items-center gap-2 pr-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                   <Icon name="plus" size={14} className="text-blue-500 shrink-0" /> <span>{ex.label}</span>
                                </span>
                                <span className={`${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>+ {formatMoney(price)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className={`pt-4 mt-auto border-t border-zinc-800/30`}>
                       <p className={`text-[9px] uppercase font-bold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          INFORMAÇÕES DO ENCONTRO
                       </p>
                       <div className="flex flex-col gap-2 text-sm font-medium">
                          <div className={`flex items-center gap-3 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                            <Icon name="calendar" size={16} className="text-blue-500 shrink-0" />
                            {booking.date ? new Date(booking.date).toLocaleDateString(CONFIG.LOCALE_PT) : ''} às {booking.time}
                          </div>
                          <div className={`flex items-center gap-3 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                            <Icon name="map-pin" size={16} className="text-blue-500 shrink-0" />
                            {booking.locationType === 'home' ? 'Em sua residência' : booking.locationType === 'motel' ? 'Em suíte/motel' : 'Em hotel'}
                          </div>
                       </div>
                    </div>
                    
                    <div className={`pt-6 border-t border-dashed ${isDark ? 'border-zinc-800' : 'border-slate-300'}`}>
                      <div className="flex justify-between mb-3 text-sm">
                        <span className={`font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.subtotal}</span>
                        <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          {formatMoney(financials.sub)}
                        </span>
                      </div>
                      
                      {booking.appliedCoupon && (
                        <div className={`my-4 p-4 rounded-2xl flex items-center justify-between border-dashed border-2 ${isDark ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'}`}>
                           <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-200 text-emerald-700'}`}>
                                 <Icon name="gift" size={20} />
                              </div>
                              <div>
                                 <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Cupom Aplicado</p>
                                 <p className={`text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{booking.appliedCoupon.code}</p>
                              </div>
                           </div>
                           <span className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>- {formatMoney(booking.appliedCoupon.val)}</span>
                        </div>
                      )}

                      {financials.mediaDisc > 0 && (
                        <div className="flex justify-between mb-3 text-blue-400 font-medium text-sm">
                          <span className="pr-2">{T.media_discount}</span>
                          <span className="shrink-0">- {formatMoney(financials.mediaDisc)}</span>
                        </div>
                      )}
                      
                      {financials.pixDisc > 0 && (
                        <div className={`flex justify-between mb-3 font-medium text-sm ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          <span className="pr-2">{T.pix_discount}</span>
                          <span className="shrink-0">- {formatMoney(financials.pixDisc)}</span>
                        </div>
                      )}

                      {financials.rushFee > 0 && (
                        <div className={`flex justify-between mb-3 font-medium text-sm ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                          <span className="pr-2 flex items-center gap-2"><Icon name="car" size={14} /> Taxa de Deslocamento (Pico)</span>
                          <span className="shrink-0">+ {formatMoney(financials.rushFee)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-end pt-6 mt-4 border-t border-solid border-blue-500/20">
                        <span className={`text-[10px] md:text-xs uppercase tracking-widest font-bold pb-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.total_label}</span>
                        <div className="text-right">
                          <span className={`text-3xl md:text-4xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'}`}>
                            {formatMoney(financials.total)}
                          </span>
                          <div className={`flex items-center justify-end gap-1 text-[8px] md:text-[9px] uppercase tracking-widest font-bold mt-1.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            <Icon name="sparkles" size={10} /> +{estimatedXP} XP GARANTIDOS
                          </div>
                        </div>
                      </div>
                      
                      <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 text-[11px] font-medium leading-relaxed ${isDark ? 'bg-zinc-900/60 border-zinc-800/80 text-zinc-400' : 'bg-blue-50/50 border-blue-100 text-blue-800'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-blue-100 text-blue-600'}`}>
                            <Icon name="car" size={16} />
                          </div>
                          <span>{T.uber_notice} A taxa de Uber será calculada no WhatsApp.</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6 md:space-y-8">
                  {user.coupons.length > 0 && (
                    <div className={`p-6 md:p-8 rounded-3xl border shadow-sm ${isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-slate-100'}`}>
                      <h3 className={`text-base font-playfair font-medium mb-4 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                        {T.coupon_section}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {user.coupons.map(c => (
                          <button key={c.id} onClick={() => setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))} className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border flex items-center gap-2 ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500' : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400 shadow-sm'}`}>
                            {booking.appliedCoupon?.id === c.id && <Icon name="check" size={14} />} {c.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`p-6 md:p-8 rounded-3xl border shadow-sm ${isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-slate-100'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`mt-0.5 p-2.5 rounded-full shrink-0 ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}><Icon name={booking.mediaAllowed ? 'camera' : 'video'} size={20} /></div>
                        <div className="flex-1 min-w-0">
                           <h3 className={`text-base font-playfair font-medium mb-2 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.media_title}</h3>
                           <p className={`text-[11px] md:text-xs font-light leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.media_desc}</p>
                           <button onClick={() => setBooking(b => ({ ...b, mediaAllowed: !b.mediaAllowed }))} className={`w-full flex items-center justify-between p-3 md:p-4 rounded-xl border transition-all text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${booking.mediaAllowed ? 'bg-blue-600/10 border-blue-500 text-blue-500' : isDark ? 'bg-transparent border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 shadow-sm'}`}>
                              <span className="pr-2">{booking.mediaAllowed ? 'Autorização Concedida' : 'Apoiar o Trabalho'}</span>
                              {booking.mediaAllowed ? <div className="flex items-center gap-1 shrink-0"><Icon name="check" size={14} /></div> : <span className={`text-[8px] md:text-[9px] px-2 py-1 rounded-full whitespace-nowrap shrink-0 ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>{T.media_bonus}</span>}
                           </button>
                        </div>
                      </div>
                  </div>
                  
                  <div className={`p-6 md:p-8 rounded-3xl border shadow-sm ${isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white border-slate-100'}`}>
                    <h3 className={`text-base font-playfair font-medium mb-4 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.payment_title}</h3>
                    <div className="space-y-3">
                      {[
                        { id: 'pix', label: 'Pix (3% OFF)', icon: 'smartphone' },
                        { id: 'card', label: 'Cartão', icon: 'credit-card' },
                        { id: 'money', label: 'Dinheiro', icon: 'banknote' }
                      ].map(p => (
                        <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))} className={`w-full flex items-center gap-3 p-4 h-16 rounded-2xl border transition-all duration-300 ${booking.payment === p.id ? 'bg-blue-600 border-blue-500 text-white shadow-md scale-[1.01]' : isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm'}`}>
                          <Icon name={p.icon} size={20} className="shrink-0" />
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest flex-1 text-left truncate">{p.label}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${booking.payment === p.id ? 'border-white bg-blue-500' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                             {booking.payment === p.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div onClick={() => setTermsOpen(true)} className={`flex items-center justify-between p-5 md:p-6 rounded-3xl border cursor-pointer transition-all duration-300 ${booking.termsAccepted ? 'bg-emerald-500/10 border-emerald-500/50' : isDark ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                    <div className="flex items-center gap-4 min-w-0 pr-2">
                      <div className={`shrink-0 ${booking.termsAccepted ? 'text-emerald-500' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name="heart" size={24} /></div>
                      <div className="min-w-0">
                        <span className={`text-sm font-semibold block mb-0.5 truncate ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.terms_title}</span>
                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest truncate block ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Revisar e Aceitar</span>
                      </div>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted })); }} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-white' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                      {booking.termsAccepted && <Icon name="check" size={16} />}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {step === 4 && (
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in max-w-md mx-auto px-4">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full scale-[1.5] animate-pulse" />
                <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-[4px] shadow-xl shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-emerald-500' : 'bg-white border-slate-100 text-emerald-600'}`}>
                  <Icon name="check" size={36} />
                </div>
              </div>
              <h2 className={`text-3xl md:text-4xl font-playfair font-medium mb-4 leading-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-sm md:text-base font-light leading-relaxed mb-10 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.success_sub}</p>
              
              <div className="flex flex-col gap-4 w-full">
                <Button variant="whatsapp" size="lg" full icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>{T.whatsapp_btn}</Button>
                <button onClick={() => { setStep(0); setBooking({ ...booking, cart: [], termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false }); }} className={`mt-4 text-[10px] font-bold uppercase tracking-widest transition-colors py-3 ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 left-0 right-0 p-3 md:p-6 z-40 animate-fade-in pointer-events-none">
          <div className={`max-w-3xl mx-auto rounded-[2rem] p-3 md:p-4 border backdrop-blur-3xl pointer-events-auto flex justify-between items-center transition-all shadow-2xl ${isDark ? 'bg-zinc-950/90 border-zinc-800/80 shadow-black/80' : 'bg-white/95 border-slate-200/80 shadow-slate-300/60'}`}>
            
            {step > 0 && (
               <button onClick={() => { setStep(s => s - 1); }} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-colors border border-transparent shrink-0 ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700' : 'bg-slate-100 text-slate-500 hover:text-slate-900 hover:border-slate-200'}`} aria-label="Voltar Etapa">
                 <Icon name="chevron-left" size={24} />
               </button>
            )}
            
            <div className={`flex-1 flex flex-col items-start justify-center min-w-0 px-4 ${step === 0 ? 'pl-6' : ''}`}>
              <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-0.5 w-full ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                {step === 0 ? `${booking.cart.length} item(s) selecionado(s)` : step === 3 ? T.total_label : T.subtotal}
              </p>
              <p className={`text-xl md:text-2xl font-playfair font-semibold truncate w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {step === 3 ? formatMoney(financials.total) : formatMoney(financials.sub)}
              </p>
            </div>
            
            <Button onClick={handleNextStep} disabled={!isStepValid()} size="lg" className="!h-14 !px-6 md:!px-8 !text-[11px] md:!text-xs shrink-0 !rounded-2xl" ariaLabel={step === 3 ? T.finish_btn : T.next_btn}>
              <span className="hidden sm:inline">{step === 3 ? T.finish_btn : T.next_btn}</span>
              <span className="inline sm:hidden">{step === 3 ? 'Finalizar' : 'Avançar'}</span>
              {step !== 3 && <Icon name="chevron-right" size={18} className="ml-1" />}
            </Button>
          </div>
        </nav>
      )}
      
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-xl max-h-[85vh] rounded-3xl p-6 md:p-10 flex flex-col border shadow-2xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100'}`}>
            <button onClick={() => setTermsOpen(false)} className={`absolute top-4 right-4 p-2 rounded-full transition-colors shrink-0 ${isDark ? 'hover:bg-zinc-900 text-zinc-500' : 'hover:bg-slate-50 text-slate-400'}`} aria-label="Fechar"><Icon name="x" size={20} /></button>
            <h3 className={`text-xl md:text-2xl font-playfair font-medium mb-6 md:mb-8 text-center shrink-0 pr-6 ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{T.rules_complete}</h3>
            <div className="space-y-3 overflow-y-auto scrollbar-hide mb-6">
              {DATA.rules.map((rule, i) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className="shrink-0 pt-4 border-t border-zinc-800/50">
              <Button full size="lg" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}
      
      {welcomePopup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-3xl p-8 md:p-10 text-center border shadow-2xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100'}`}>
            <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full flex items-center justify-center mb-6 border-[4px] shadow-inner shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-blue-500' : 'bg-slate-50 border-slate-100 text-blue-600'}`}><Icon name="gift" size={32} /></div>
            <h3 className={`text-2xl md:text-3xl font-playfair font-medium mb-3 leading-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-xs md:text-sm font-light leading-relaxed mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.welcome_popup_msg}</p>
            <div className={`p-4 md:p-5 rounded-2xl border mb-6 border-dashed ${isDark ? 'bg-blue-900/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 md:mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>SEU PRESENTE INAUGURAL</p>
              <p className={`text-2xl md:text-3xl font-playfair font-semibold tracking-wide break-all ${isDark ? 'text-white' : 'text-slate-900'}`}>BEMVINDO10</p>
            </div>
            <Button full size="lg" onClick={() => {
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-3xl p-8 md:p-10 text-center border shadow-2xl overflow-hidden ${isDark ? 'bg-zinc-950 border-amber-500/30 shadow-amber-900/30' : 'bg-white border-slate-100 shadow-amber-500/20'}`}>
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/20 blur-[50px] rounded-full pointer-events-none" />
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/40 animate-bounce shrink-0 relative z-10 text-white"><Icon name="trophy" size={36} /></div>
            <h3 className={`text-3xl md:text-4xl font-playfair font-medium mb-3 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-sm md:text-base font-light leading-relaxed mb-8 relative z-10 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.levelup_popup_msg}</p>
            <button onClick={() => setLevelUpPopup(false)} className={`w-full h-14 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 relative z-10 shrink-0 ${isDark ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-amber-900/50' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/40'}`}>
              Resgatar Conquista
            </button>
          </div>
        </div>
      )}
    </>
  );
}
