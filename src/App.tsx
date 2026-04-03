import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 0. GUIA DE CORES E ESTILOS (ADAPTADO PARA ATELIÊ DE AXÉ)
// ==================================================================================
/*
  Nesta versão, trocamos os tons de azul por tons de Âmbar (Dourado) e Rose (Bordô),
  que remetem ao luxo, ancestralidade e força.
*/

const CONFIG = {
  PHONE: "5517991360413", // COLOQUE SEU WHATSAPP AQUI
  INSTAGRAM_URL: "https://instagram.com/seu.atelie.aqui",
  STORAGE_KEY: '@atelie_axe_v1_premium', 
  PIX_KEY: "62.922.530/0001-14", 
  LOCALE_PT: 'pt-BR',
  SECRET_TOKEN: 'ATELIE_SECURE_V1',
  MAX_STORAGE_SIZE: 5000 
} as const;

const ICON_PATHS: Record<string, string> = {
  'menu': 'M4 12h16 M4 6h16 M4 18h16', 'chevron-left': 'M15 18l-6-6 6-6', 'chevron-right': 'M9 18l6-6-6-6',
  'chevron-down': 'M6 9l6 6 6-6', 'x': 'M18 6L6 18M6 6l12 12', 'check': 'M20 6L9 17l-5-5',
  'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01',
  'share': 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  'globe': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z',
  'sun': 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', 'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4',
  'sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  'zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', 'package': 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  'layers': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', 'user': 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', 'building': 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'car': 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M7 17v4h2v-4 M15 17v4h2v-4',
  'calendar': 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  'smartphone': 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'watch': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
  'credit-card': 'M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  'banknote': 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
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
      background-color: ${isDark ? '#09090b' : '#fafafa'};
      color: ${isDark ? '#FFFFFF' : '#18181b'};
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

const formatMoney = (val: number | undefined) => {
  if (val === undefined || isNaN(val)) return 'R$ 0,00';
  return `R$ ${val.toFixed(2).replace('.', ',')}`;
};

// Types & Interfaces
interface ServiceItem { id: string; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; popular?: boolean; }
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; loc: string; t: string; s: number; serv: string; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { street: string; number: string; district: string; city: string; comp: string; }
interface BookingData { type: 'single' | 'pack'; cart: ServiceItem[]; extras: Record<string, boolean>; size: string; deliveryType: 'shipping' | 'pickup'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; mediaAllowed: boolean; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// 3. COMPONENTES DE UI
// ==================================================================================

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.98] gap-2 shrink-0";
  const variants = {
    primary: "bg-rose-600 text-white hover:bg-rose-500 shadow-xl shadow-rose-900/20 hover:-translate-y-1",
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

const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} role="presentation" />
      <aside className={`fixed top-0 right-0 h-full w-[85%] sm:w-[75%] max-w-sm z-[70] p-6 sm:p-8 md:p-10 shadow-2xl animate-slide-in flex flex-col ${isDark ? 'bg-zinc-950 text-white border-l border-zinc-800/50' : 'bg-white text-slate-900 border-l border-slate-100'}`}>
        <div className="flex justify-between items-center mb-10 md:mb-12">
          <h2 className="text-2xl font-playfair font-medium">Menu do Ateliê</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-500/20 transition-colors" aria-label="Fechar menu"><Icon name="x" size={24} /></button>
        </div>
        
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-xl border border-amber-500/50">
          <p className="text-[10px] opacity-90 uppercase font-bold tracking-widest mb-2 text-white">Nível de Axé</p>
          <div className="flex justify-between items-end">
             <span className="text-3xl font-light font-playfair text-white">{user.xp} <span className="text-[10px] font-bold text-amber-200 font-sans tracking-widest uppercase">PONTOS</span></span>
             <Icon name="award" size={28} className="text-amber-300" />
          </div>
          <p className="text-[9px] text-amber-200 mt-4 font-light leading-snug border-t border-amber-700/50 pt-3">
            * Seus pontos geram descontos e brindes. Eles ficam salvos neste aparelho.
          </p>
        </div>

        <nav className="space-y-3 flex-1">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-800 text-white' : 'hover:bg-slate-100 text-slate-900'}`}>
            <div className="flex items-center gap-4">
              <Icon name={isDark ? "moon" : "sun"} size={20} className={isDark ? "text-amber-400" : "text-amber-600"} />
              <span className="font-semibold text-sm">Aparência</span>
            </div>
            <span className="text-[9px] font-bold opacity-70 uppercase tracking-widest">{isDark ? 'Noturna' : 'Clara'}</span>
          </button>
          
          <button onClick={() => { if(navigator.share) navigator.share({title: 'Ateliê de Axé', text: 'Conheça o melhor ateliê para roupas de Umbanda e Candomblé.', url: window.location.href}) }} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors mt-2 ${isDark ? 'hover:bg-zinc-800 text-white' : 'hover:bg-slate-100 text-slate-900'}`}>
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
        ? 'bg-amber-500/10 border-2 border-amber-500 shadow-amber-500/30 -translate-y-2' 
        : 'bg-rose-600/10 border-2 border-rose-500 shadow-rose-500/30 -translate-y-2';
    }
    if (isDark) {
      return isPremium 
        ? 'bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-amber-500/40 hover:border-amber-500/80 hover:bg-zinc-800/80 hover:-translate-y-1' 
        : 'bg-zinc-900/60 border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/80 hover:-translate-y-1';
    }
    return isPremium 
      ? 'bg-gradient-to-br from-amber-50 to-white border border-amber-300 hover:border-amber-500 shadow-sm hover:-translate-y-1' 
      : 'bg-white border border-slate-300 hover:border-slate-400 shadow-sm hover:shadow-md hover:-translate-y-1';
  };

  return (
    <div onClick={onClick} className={`relative p-6 md:p-8 rounded-3xl transition-all duration-300 flex flex-col h-full ${onClick ? 'cursor-pointer' : ''} ${getStyle()} ${className}`}>
      {popular && (
        <div className={`absolute -top-3 left-6 md:left-8 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md ${isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-400/30' : 'bg-gradient-to-r from-rose-600 to-red-600 border border-rose-400/30'}`}>
          ✦ Mais Pedida
        </div>
      )}
      {children}
    </div>
  );
});

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text", isDark = true, hasError = false }: any) => (
  <div className="space-y-2 w-full min-w-0">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{label}</label>}
    <div className="relative group">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-500' : isDark ? 'text-zinc-400 group-focus-within:text-rose-400' : 'text-slate-500 group-focus-within:text-rose-600'}`}><Icon name={icon} size={20} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-14 rounded-2xl outline-none text-sm font-medium transition-all bg-transparent ${icon ? 'pl-11 pr-4' : 'px-4'} ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-rose-500 focus:bg-zinc-900/80' : 'border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-rose-600 focus:bg-rose-50/50'}`} />
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
    <div className={`flex items-center justify-center gap-3 p-5 rounded-2xl transition-all border shadow-sm ${isDark ? 'bg-rose-600/20 border-rose-500/40 text-rose-300' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
      <Icon name="watch" size={20} className="animate-pulse shrink-0" />
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest break-words text-center">{text}: <span className="font-mono text-sm ml-1 bg-rose-500/30 px-3 py-1.5 rounded-md text-white">{format(time)}</span></span>
    </div>
  );
});

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 md:py-6 flex items-center justify-between text-left group" aria-expanded={isOpen}>
        <span className={`text-sm md:text-base font-medium pr-4 leading-snug ${isDark ? 'text-white group-hover:text-rose-300' : 'text-slate-900 group-hover:text-rose-700'}`}>{q}</span>
        <span className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-rose-400' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}><Icon name="chevron-down" size={20} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{a}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 md:p-6 rounded-3xl border border-transparent transition-colors ${isDark ? 'hover:bg-zinc-800/80 hover:border-zinc-700' : 'hover:bg-slate-50 hover:border-slate-200'}`}>
    <div className={`shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}><Icon name={rule.icon} size={24} /></div>
    <div>
      <h4 className={`text-sm md:text-base font-bold mb-2 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.title}</h4>
      <p className={`text-xs md:text-sm font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{rule.description}</p>
    </div>
  </div>
));

// ==================================================================================
// 4. LÓGICA DE DADOS (ADAPTADO PARA ROUPAS E ENCOMENDAS)
// ==================================================================================
const sanitizeInput = (value: string): string => String(value || '').replace(/[<>&"']/g, '');

const getFullReviews = (): Review[] => {
  return [
    { n: "Mãe Carmen", loc: "Terreiro T.U. Luz", t: "As roupas têm um caimento perfeito. O tecido é fresco, ótimo para as giras mais longas. Muito axé no trabalho de vocês!", serv: "Conjunto de Ração", s: 5 },
    { n: "João Pedro", loc: "São Paulo - SP", t: "Pedi uma saia sob medida para minha Pomba Gira e fiquei encantado com a qualidade do bordado e do tecido. Impecável.", serv: "Saia Luxo", s: 5 },
    { n: "Letícia", loc: "Campinas - SP", t: "O prazo de confecção foi cumprido certinho. O pano da costa é lindo e a costura super resistente.", serv: "Pano da Costa", s: 5 },
    { n: "Babalorixá Marcos", loc: "Rio de Janeiro", t: "Comprei os conjuntos festivos para a saída de santo dos meus filhos. Tudo feito com muito respeito e capricho.", serv: "Kit Festividade", s: 5 }
  ];
};

const getData = () => {
  const p = {
    saia_simples: 89, camisu: 65, oja: 35, pano_costa: 75, saia_luxo: 250,
    kit_racao: { v: 140, full: 189, save: 49 }, 
    kit_festivo: { v: 380, full: 450, save: 70 }, 
    extras: { bordado: 45, renda: 30, sob_medida: 50, urgencia: 60 }
  };
  
  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: "Simpatizante" },
      { level: 2, xpNeeded: 150, reward: 15, title: "Fio de Contas" },
      { level: 3, xpNeeded: 400, reward: 30, title: "Filho de Fé" },
      { level: 4, xpNeeded: 900, reward: 50, title: "Raiz de Axé" }
    ],
    services: [
      { id: 'saia_branca', price: p.saia_simples, icon: "layers", tag: "DIA A DIA", title: "Saia Branca Tradicional", desc: "Perfeita para o uso diário no terreiro. Confortável, leve e com roda excelente.", details: "Tecido Percal ou Oxford\nRoda de 3 a 4 metros\nCós de elástico ajustável\nIdeal para giras de desenvolvimento" },
      { id: 'camisu', price: p.camisu, icon: "user", tag: "BÁSICO ESSENCIAL", title: "Camisú de Algodão", desc: "A peça mais versátil do seu guarda-roupa de axé. Fresco e discreto.", details: "100% Algodão ou Oxfordine\nAcabamento em viés\nManga curta ou cavada\nCostura reforçada" },
      { id: 'oja', price: p.oja, icon: "sun", tag: "PROTEÇÃO", title: "Ojá / Torço Básico", desc: "Para proteção e firmeza. Tecido de excelente qualidade que não escorrega.", details: "Tamanho padrão 2,5m x 0,35m\nAcabamento nas pontas\nFácil amarração" },
      { id: 'pano_costa', price: p.pano_costa, icon: "shield", tag: "TRADIÇÃO", title: "Pano da Costa", desc: "Respeito e ancestralidade em cada detalhe. Complemento indispensável.", details: "Tamanho adequado para amarração firme\nDetalhes discretos nas bordas\nTecidos nobres e resistentes" },
      { id: 'saia_luxo', price: p.saia_luxo, icon: "star", popular: true, tag: "FESTIVIDADES", title: "Saia Luxo (Pomba Gira / Ciganas)", desc: "Uma saia para encantar. Muito volume, roda impressionante e detalhes brilhantes.", details: "Roda de até 8 metros\nBabadados e aplicação de rendas\nTecidos como Cetim, Organza ou Tafetá\nFeita para impressionar na gira" }
    ] as ServiceItem[],
    plans: [
      { id: 'kit_racao', type: 'pack', title: "Conjunto de Ração Completo", price: p.kit_racao.v, fullPrice: p.kit_racao.full, savings: p.kit_racao.save, desc: "O essencial para quem está começando ou precisa renovar as roupas de trabalho.", details: "Inclui 1 Saia, 1 Camisú, 1 Pano da Costa e 1 Ojá\nTudo em tecido Percal branco\nConforto para trabalhar a noite toda", tag: "INICIANTE", icon: "package" },
      { id: 'kit_festivo', type: 'pack', title: "Conjunto Festivo Orixá", price: p.kit_festivo.v, fullPrice: p.kit_festivo.full, savings: p.kit_festivo.save, desc: "Roupa completa para saídas, festas e obrigações. Detalhes em guipir e bordados.", details: "Saia com detalhes em renda\nCamisú trabalhado\nPano da Costa e Ojá combinando\nAcabamentos dourados ou prateados", tag: "ALTO PADRÃO", icon: "award" }
    ] as ServiceItem[],
    extras: [
      { id: 'bordado', price: p.extras.bordado, icon: "sparkles", isEmoji: false, label: "Adicionar Bordado", desc: "Ponto riscado ou nome do Orixá/Entidade bordado." },
      { id: 'renda', price: p.extras.renda, icon: "scissors", isEmoji: false, label: "Aplicação de Renda", desc: "Renda Guipir nas barras para acabamento luxuoso." },
      { id: 'sob_medida', price: p.extras.sob_medida, icon: "user-check", isEmoji: false, label: "Feito Sob Medida", desc: "Molde feito com as suas medidas exatas." },
      { id: 'urgencia', price: p.extras.urgencia, icon: "clock", isEmoji: false, label: "Taxa de Urgência", desc: "Pula para o início da fila de confecção (Produção em 3 dias)." }
    ],
    faq: [
      { q: "Qual é o prazo de confecção?", a: "Trabalhamos sob encomenda para garantir o melhor caimento. Nosso prazo padrão de confecção é de 7 a 10 dias úteis, dependendo do volume do pedido." },
      { q: "Como sei o meu tamanho?", a: "Nossos tamanhos seguem o padrão brasileiro. P (36/38), M (40/42), G (44/46), GG (48/50). Se escolher a opção 'Sob Medida', solicitaremos suas medidas exatas pelo WhatsApp." },
      { q: "Vocês enviam para todo o Brasil?", a: "Sim! Enviamos pelos Correios ou transportadora. O frete será calculado e confirmado durante o nosso atendimento no WhatsApp." },
      { q: "Posso alterar a cor de um conjunto?", a: "Com certeza! Fazemos roupas para todos os Orixás e Entidades. Basta finalizar o pedido e informar a cor desejada quando formos conversar no WhatsApp." },
      { q: "Meus pontos e nível ficam salvos?", a: "Sim! Para facilitar seu acesso, seu progresso de compras fica salvo automaticamente no seu celular. Não limpe o cache do navegador para não perdê-los." }
    ],
    rules: [
      { icon: "clock", title: "Prazo e Dedicação", description: "Cada peça é feita com muito axé e respeito. Pedimos compreensão com os prazos de produção artesanal." },
      { icon: "map-pin", title: "Envios e Entregas", description: "O frete é por conta do cliente e será calculado após a separação da sua encomenda." },
      { icon: "heart", title: "Feito com Axé", description: "Garantimos que nossos tecidos são limpos e nosso ambiente de costura é livre de energias cruzadas." }
    ],
    text: {
      welcome: "Bem-vindo(a) ao",
      choose_sub: "Vestindo a sua fé com respeito, elegância e ancestralidade. Escolha suas peças e monte sua encomenda.",
      level_label: "Seu Histórico",
      tab_packs: "Conjuntos",
      tab_single: "Peças Avulsas",
      next_btn: "Avançar",
      finish_btn: "Enviar Encomenda",
      loading: "Preparando as tramas e os tecidos...",
      toast_select_item: "Por favor, adicione ao menos uma peça no carrinho.",
      toast_select_size: "Selecione o tamanho desejado para continuarmos.",
      toast_fill_name: "Preciso saber seu nome para o pedido.",
      toast_fill_addr: "Por favor, preencha o endereço de entrega.",
      toast_accept_terms: "Leia e aceite os termos do nosso ateliê.",
      toast_coupon_success: "Presente aplicado! Desconto ativado.",
      toast_coupon_invalid: "Poxa, esse código não é válido ou já expirou.",
      details_label: "DETALHES DA PEÇA:",
      select_time_title: "Tamanhos e Prazos",
      location_title: "Onde vamos entregar?",
      extras_title: "Personalize sua Encomenda",
      coupon_section: "Seus Cupons Disponíveis",
      payment_title: "Como prefere pagar?",
      terms_title: "Política do Ateliê",
      success_title: "Pedido Quase Pronto!",
      success_sub: "O WhatsApp está sendo aberto automaticamente para confirmarmos as cores, frete e o pagamento. Caso não abra, utilize o botão abaixo.",
      whatsapp_btn: "Falar no WhatsApp",
      back_home: "Fazer outro pedido",
      timer_text: "Seu carrinho está salvo por",
      input_name: "Seu nome ou nome de santo",
      input_addr: "Nome da Rua ou Avenida",
      input_num: "Número",
      input_district: "Bairro",
      input_city: "Cidade e Estado",
      input_comp: "Complemento (CEP, Apto)",
      agree_terms: "Eu li e aceito os prazos de confecção do Ateliê.",
      faq_title: "Dúvidas Frequentes",
      reviews_title: "O que dizem sobre nosso Axé:",
      total_label: "Total Estimado",
      subtotal: "Soma das Peças",
      pix_discount: "Desconto Pix (3%)",
      welcome_popup_title: "Seja muito bem-vindo(a)!",
      welcome_popup_msg: "É uma honra vestir a sua fé. Cadastre-se fazendo seu primeiro pedido e acumule pontos para trocar por descontos.",
      welcome_popup_warning: "⚠️ Atenção: Seus pontos e cupons ficam salvos no navegador deste celular. Evite limpar os dados de navegação!",
      levelup_popup_title: "Nível Alcançado!",
      levelup_popup_msg: "Sua fidelidade gerou recompensas. Acabei de liberar um novo benefício exclusivo para sua próxima encomenda.",
      get_coupon: "Resgatar Meu Presente",
      rules_complete: "Termos do Ateliê",
      pickup_notice: "Você escolheu retirar no Ateliê. Combinaremos o dia e horário pelo WhatsApp após a confecção estar pronta.",
      shipping_notice: "O frete exato (Correios/Transportadora) será calculado e somado no atendimento via WhatsApp."
    },
    reviews: getFullReviews()
  };
};

// ==================================================================================
// 5. MAIN APP OTIMIZADO
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error"}[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const DATA = useMemo(() => getData(), []);
  const T = DATA.text;
  
  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 0, lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single', cart: [], extras: {}, size: '', deliveryType: 'shipping', address: { street: '', number: '', district: '', city: '', comp: '' }, payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `PEDIDO_${Date.now()}`, mediaAllowed: false
  });
  
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
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { document.body.removeChild(link); }, 100);
  }, []);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        document.title = step === 0 ? "Ateliê de Axé - Roupas de Santo" : "Seu Pedido - Ateliê";
    }
  }, [step, isClient]);
  
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
          loadedUser = { ...loadedUser, ...parsed.user };
        }
        if (parsed.bookingDraft && Array.isArray(parsed.bookingDraft.cart)) {
          loadedBooking = { ...loadedBooking, ...parsed.bookingDraft };
          if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) {
            loadedStep = parsed.step;
          }
        }
      }
    } catch (e) {
      console.error('Cache inválido, iniciando limpo.', e);
    }
    
    setUser(loadedUser);
    setBooking(loadedBooking);
    setStep(loadedStep);
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 800);
  }, [isClient, DATA.services, DATA.plans]);
  
  useEffect(() => {
    if (isClient && dataLoaded) {
      try {
        const saveData = { user: { ...user, lastActivity: new Date().toISOString() }, bookingDraft: booking, step };
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(saveData));
      } catch (e) {}
    }
  }, [user, booking, step, isClient, dataLoaded]);
  
  useEffect(() => {
    if (!loading && isClient && dataLoaded) {
      if (!user.hasSeenWelcome && !welcomePopup) {
        const timer = setTimeout(() => setWelcomePopup(true), 2000);
        return () => clearTimeout(timer);
      } 
      else if (user.hasSeenWelcome && step === 0) {
        addToast("Seu progresso salvo foi carregado! 💾", "success");
      }
    }
  }, [loading, isClient, dataLoaded]);
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  
  const handleToggleCartItem = useCallback((item: ServiceItem) => {
    setBooking(prev => {
      const exists = prev.cart.find(c => c.id === item.id);
      let newCart = exists ? prev.cart.filter(c => c.id !== item.id) : [...prev.cart, item];
      return { ...prev, cart: newCart, termsAccepted: false };
    });
    addToast(`Item atualizado no carrinho.`, "success");
  }, [addToast]);

  const financials = useMemo(() => {
    if (booking.cart.length === 0) return { total: 0, sub: 0, disc: 0, pixDisc: 0 };
    
    let sub = 0;
    booking.cart.forEach(item => { sub += item.price; });

    Object.keys(booking.extras || {}).forEach(k => { 
      if (booking.extras[k]) { 
        const extData = DATA.extras.find(e => e.id === k); 
        if (extData) sub += extData.price; 
      } 
    });

    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let runningTotal = Math.max(0, sub - disc);
    
    let pixDisc = 0;
    if (booking.payment === 'pix') { pixDisc = Math.ceil(runningTotal * 0.03); }
    
    return { sub, disc, pixDisc, total: Math.max(0, runningTotal - pixDisc) };
  }, [booking.cart, booking.extras, booking.appliedCoupon, DATA.extras, booking.payment]);
  
  const estimatedXP = useMemo(() => Math.floor(financials.total * 0.20), [financials.total]);
  
  const generateWhatsAppMsg = () => {
    const f = financials; 
    
    const servicesListText = booking.cart.map(item => `✅ *${item.title}*`).join('\n');
    const extrasList = Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => { 
      const ex = DATA.extras.find(e => e.id === k); 
      return ex ? `➕ ${ex.label}` : ''; 
    }).filter(Boolean).join('\n');
    
    let locTxt = booking.deliveryType === 'pickup' 
        ? "🏪 *Retirar no Ateliê*" 
        : `🚚 *Entrega / Correios*\n📍 ${booking.address.street}, ${booking.address.number}\nBairro: ${booking.address.district}\nCidade: ${booking.address.city}\nCEP/Comp: ${booking.address.comp || '-'}`; 
    
    let priceDetails = `💵 *Soma das Peças:* R$ ${f.sub.toFixed(2).replace('.', ',')}`;
    if (f.disc > 0) priceDetails += `\n🎁 *Cupom:* -R$ ${f.disc.toFixed(2).replace('.', ',')}`;
    if (f.pixDisc > 0) priceDetails += `\n💸 *Desconto PIX:* -R$ ${f.pixDisc.toFixed(2).replace('.', ',')}`;
    priceDetails += `\n\n💰 *VALOR ESTIMADO (SEM FRETE): R$ ${f.total.toFixed(2).replace('.', ',')}*`;

    return `
*NOVA ENCOMENDA* | ${booking.bookingId}
──────────────────
Olá Ateliê! Gostaria de fazer uma encomenda.

👤 *Nome:* ${sanitizeInput(user.name)}
📏 *Tamanho Escolhido:* ${booking.size}

🛍️ *ITENS SELECIONADOS:*
${servicesListText}
${extrasList ? `\n*Personalizações:*\n${extrasList}` : ''}

📍 *MÉTODO DE ENTREGA:*
${locTxt}

💰 *RESUMO DO INVESTIMENTO:*
${priceDetails}

💳 *Forma de Pagamento:* ${booking.payment.toUpperCase()}
──────────────────
_Aguardo o retorno para calcularmos o frete (se houver), escolhermos as cores e confirmar a encomenda._
    `.trim();
  };
  
  const isStepValid = useCallback(() => {
    if (step === 0) return booking.cart.length > 0;
    if (step === 1) return !!booking.size;
    if (step === 2) {
      if (!user.name || String(user.name).trim().length < 3) return false;
      if (booking.deliveryType === 'shipping') return !!(booking.address.street && booking.address.number && booking.address.district && booking.address.city);
      return true;
    }
    if (step === 3) return !!(booking.payment && booking.termsAccepted);
    return true;
  }, [step, booking, user.name]);
  
  const handleNextStep = useCallback(() => {
    if (!isStepValid()) {
      if (step === 0) addToast(T.toast_select_item, "error");
      if (step === 1) addToast(T.toast_select_size, "error");
      if (step === 2) addToast(T.toast_fill_addr, "error");
      if (step === 3) addToast(T.toast_accept_terms, "error");
      return;
    }
    if (step === 3) finishBooking(); 
    else setStep(s => s + 1);
  }, [step, booking, user.name, T, addToast, isStepValid]);
  
  const finishBooking = () => {
    setUser(prev => ({ ...prev, xp: prev.xp + estimatedXP, ordersCount: prev.ordersCount + 1, lastActivity: new Date().toISOString() }));
    openExternal('whatsapp', generateWhatsAppMsg());
    setStep(4);
  };
  
  if (!isClient) return <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center" />;

  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] transition-colors duration-700 ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center max-w-sm w-full px-8">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-amber-600 to-rose-600 text-white flex items-center justify-center text-4xl font-playfair mb-8 animate-pulse shadow-2xl">
            A
          </div>
          <p className="text-[10px] md:text-xs uppercase font-bold tracking-widest opacity-70 text-white">{T.loading}</p>
        </div>
      </div>
    );
  }
  
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
      
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} user={user} />

      <main className="min-h-screen relative z-10 pb-40 md:pb-48 px-4 md:px-8 max-w-5xl mx-auto selection:bg-amber-500/30 selection:text-amber-200">
        {step !== 4 && (
          <header className="pt-10 md:pt-16 pb-8 md:pb-12">
            <div className="flex items-start justify-between">
              <div className="flex flex-col cursor-pointer transition-opacity hover:opacity-80" onClick={() => setStep(0)}>
                <h1 className={`text-2xl md:text-4xl font-playfair tracking-tight font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Ateliê de Axé <br className="block sm:hidden" /> Orixás
                </h1>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => openExternal('instagram')} className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700 text-pink-400 hover:bg-zinc-800' : 'bg-white border-slate-200 text-pink-600 hover:bg-slate-50'}`}>
                   <Icon name="instagram" size={20} />
                </button>
                <button onClick={() => setMenuOpen(true)} className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all border shadow-sm shrink-0 ${isDark ? 'bg-zinc-900/80 border-zinc-700 text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}>
                   <Icon name="menu" size={20} />
                </button>
              </div>
            </div>
            
            {step > 0 && step < 4 && (
              <div className="mt-8 md:mt-12 flex items-center justify-between gap-3 max-w-sm mx-auto">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 md:gap-3">
                    <div className={`w-full h-1 md:h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.5)]' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                    <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${step >= i ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                      {i === 1 ? 'Tamanhos' : i === 2 ? 'Entrega' : 'Resumo'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </header>
        )}
        
        <div className="space-y-12 md:space-y-16">
          {/* ETAPA 0: CATÁLOGO DE PRODUTOS */}
          {step === 0 && (
            <section className="space-y-12 md:space-y-16 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center py-2 md:py-6">
                <div>
                  <h2 className={`text-3xl md:text-5xl font-playfair font-medium leading-[1.15] mb-4 md:mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.welcome} <span className="italic text-amber-500">nosso Ateliê.</span>
                  </h2>
                  <p className={`text-sm md:text-lg font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                    {T.choose_sub}
                  </p>
                </div>
              </div>
              
              <div className={`flex p-1.5 md:p-2 rounded-2xl border max-w-sm mx-auto shadow-inner ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-slate-100/80 border-slate-200'}`} role="tablist">
                <button role="tab" aria-selected={activeTab === 'packs'} onClick={() => setActiveTab('packs')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 
                  ${activeTab === 'packs' ? 'bg-amber-600 text-white shadow-lg' : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="package" size={16} /> {T.tab_packs}
                </button>
                <button role="tab" aria-selected={activeTab === 'single'} onClick={() => setActiveTab('single')} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 
                  ${activeTab === 'single' ? 'bg-rose-600 text-white shadow-lg scale-[1.03] border border-rose-400' : isDark ? 'text-zinc-100 bg-rose-600/20 hover:bg-rose-600/40' : 'text-rose-700 bg-rose-100 hover:bg-rose-200'}`}>
                  <Icon name="user" size={16} /> {T.tab_single}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => {
                  const isInCart = booking.cart.some(cartItem => cartItem.id === s.id);
                  const isPremiumCard = s.type === 'pack' || activeTab === 'packs';
                  
                  return (
                  <Card key={s.id} active={isInCart} onClick={() => handleToggleCartItem(s)} isDark={isDark} popular={s.popular} isPremium={isPremiumCard}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6 gap-3">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${isDark ? 'bg-zinc-800 border-zinc-600 text-amber-400' : 'bg-white border-slate-300 text-amber-600'}`}>
                          <Icon name={s.icon} size={24} />
                        </div>
                        <div className="text-right min-w-0 flex-1 flex flex-col items-end relative">
                          {isInCart && (
                            <div className={`absolute -top-2 -right-2 text-white w-6 h-6 flex items-center justify-center rounded-full animate-fade-in shadow-md ${isPremiumCard ? 'bg-amber-600' : 'bg-rose-600'}`}>
                              <Icon name="check" size={14} />
                            </div>
                          )}
                          <span className={`text-xl md:text-2xl font-playfair font-semibold w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {formatMoney(s.price)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest border px-3 py-1.5 rounded-full inline-block mb-3 ${isDark ? 'bg-zinc-800 border-zinc-600 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                          {s.tag}
                        </span>
                        <h3 className={`text-lg md:text-xl font-playfair font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                        <p className={`text-xs md:text-sm font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{s.desc}</p>
                      </div>
                    </div>
                    
                    <div className={`pt-4 md:pt-5 mt-auto border-t ${isDark ? 'border-zinc-700' : 'border-slate-200'}`}>
                      <div className={`flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <Icon name="check" size={14} className="text-amber-400 shrink-0" /> {T.details_label}
                      </div>
                      <div className={`text-[11px] md:text-xs space-y-2 font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        {s.details.split('\n').map((line, i) => <p key={i} className="flex items-start gap-2"><span className="text-amber-400 mt-1 text-[10px] shrink-0">•</span> <span>{line}</span></p>)}
                      </div>
                    </div>
                  </Card>
                )})}
              </div>

              {/* Reviews and FAQ section remains the same structure, just new texts */}
              <div className="py-12 md:py-16 border-t border-b border-zinc-700 mt-12">
                 <h3 className={`text-2xl font-playfair mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.reviews_title}</h3>
                 <div className="flex overflow-x-auto gap-4 snap-x pb-4">
                    {DATA.reviews.map((r, i) => (
                      <div key={i} className="snap-center shrink-0 w-[85vw] sm:w-[320px]"><ReviewCard review={r} isDark={isDark} /></div>
                    ))}
                 </div>
              </div>
            </section>
          )}
          
          {/* ETAPA 1: TAMANHOS E PRAZOS (Substitui Data e Hora) */}
          {step === 1 && (
            <section className="space-y-10 animate-fade-in max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <h2 className={`text-2xl md:text-4xl font-playfair font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Qual o seu Tamanho?
                </h2>
                <p className={`text-sm font-light ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  Selecione o tamanho padrão ou peça sob medida para sua encomenda.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['P (36-38)', 'M (40-42)', 'G (44-46)', 'GG (48-50)', 'ExG (Acima de 50)', 'Sob Medida'].map((size) => (
                   <button key={size} onClick={() => setBooking(b => ({ ...b, size: size }))} 
                      className={`py-4 md:py-6 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border 
                      ${booking.size === size ? 'bg-amber-600 border-amber-400 text-white shadow-lg scale-105' : isDark ? 'bg-zinc-900/60 border-zinc-700 text-white hover:bg-zinc-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                      <span className="text-sm md:text-base font-bold">{size}</span>
                   </button>
                ))}
              </div>

              <div className={`mt-6 p-5 rounded-2xl border flex items-start gap-4 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>
                 <Icon name="clock" size={24} className="text-amber-500 shrink-0" />
                 <div>
                    <h4 className="font-bold text-sm mb-1">Prazo de Confecção</h4>
                    <p className="text-xs font-light leading-relaxed">Nosso trabalho é artesanal e feito com muito axé. O prazo médio de confecção é de <strong>7 a 10 dias úteis</strong> após a confirmação do pagamento e escolha das cores.</p>
                 </div>
              </div>

              <div className="pt-4">
                <h3 className={`text-xs font-bold uppercase mb-4 tracking-widest pl-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <Icon name="sparkles" size={16} className="text-amber-500" /> Adicionar Detalhes Especiais
                </h3>
                <div className="space-y-3">
                  {DATA.extras.map((ex) => {
                    const isActive = booking.extras[ex.id];
                    return (
                      <div key={ex.id} onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))} className={`flex items-center justify-between p-4 md:p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${isActive ? 'bg-amber-600/20 border-amber-500' : isDark ? 'bg-zinc-900/60 border-zinc-700' : 'bg-white border-slate-300'} group`}>
                        <div className="flex items-center gap-4 min-w-0 pr-2">
                          <Icon name={ex.icon} size={24} className={isActive ? 'text-amber-500' : ''} />
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${isActive ? isDark ? 'text-amber-400' : 'text-amber-700' : isDark ? 'text-white' : 'text-slate-900'}`}>{ex.label}</p>
                            <p className={`text-[10px] font-light mt-0.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{ex.desc}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${isActive ? 'bg-amber-500 text-white' : isDark ? 'bg-zinc-700 text-white' : 'bg-slate-200'}`}>
                          + {formatMoney(ex.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
          
          {/* ETAPA 2: ENTREGA (Substitui Local) */}
          {step === 2 && (
            <section className="space-y-10 animate-fade-in max-w-2xl mx-auto">
              <h2 className={`text-2xl md:text-4xl font-playfair font-medium text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setBooking(b => ({ ...b, deliveryType: 'shipping' }))} className={`py-6 px-4 rounded-2xl flex flex-col items-center gap-3 transition-all border ${booking.deliveryType === 'shipping' ? 'bg-rose-600 border-rose-400 text-white shadow-lg' : isDark ? 'bg-zinc-900/60 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-700'}`}>
                  <Icon name="package" size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">Receber em Casa</span>
                </button>
                <button onClick={() => setBooking(b => ({ ...b, deliveryType: 'pickup' }))} className={`py-6 px-4 rounded-2xl flex flex-col items-center gap-3 transition-all border ${booking.deliveryType === 'pickup' ? 'bg-rose-600 border-rose-400 text-white shadow-lg' : isDark ? 'bg-zinc-900/60 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-700'}`}>
                  <Icon name="home" size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center">Retirar no Ateliê</span>
                </button>
              </div>
              
              <div className={`p-6 md:p-8 rounded-3xl border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'} space-y-6`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder="Como devemos lhe chamar?" hasError={!user.name || String(user.name).trim().length < 3} />
                
                {booking.deliveryType === 'shipping' && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
                      <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} icon="map-pin" placeholder="Rua / Avenida" hasError={!booking.address.street} />
                      <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Nº" hasError={!booking.address.number} />
                    </div>
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder="Seu Bairro" hasError={!booking.address.district} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder="Cidade / Estado" hasError={!booking.address.city} />
                      <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="CEP ou Complemento" />
                    </div>
                  </div>
                )}

                {booking.deliveryType === 'pickup' && (
                  <div className={`p-4 rounded-xl border flex items-start gap-3 text-xs font-medium leading-relaxed ${isDark ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-800'}`}>
                    <Icon name="map-pin" size={16} className="shrink-0 mt-0.5" />
                    <p>{T.pickup_notice}</p>
                  </div>
                )}
              </div>
            </section>
          )}
          
          {/* ETAPA 3: RESUMO E FINALIZAÇÃO */}
          {step === 3 && (
            <section className="space-y-8 animate-fade-in max-w-3xl mx-auto">
              <div className={`p-6 md:p-10 rounded-3xl border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl md:text-2xl font-playfair font-medium mb-8 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Icon name="file-text" size={24} className="text-amber-500" /> Resumo do Pedido
                </h3>
                
                <div className="space-y-4 mb-8">
                  {booking.cart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-zinc-700/50 pb-2">
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                      <span>{formatMoney(item.price)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs text-amber-500 font-bold border-b border-zinc-700/50 pb-2">
                     <span>TAMANHO ESCOLHIDO</span>
                     <span>{booking.size}</span>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h4 className="text-sm font-bold mb-4">Pagamento</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {['pix', 'card'].map(p => (
                      <button key={p} onClick={() => setBooking(b => ({ ...b, payment: p }))} className={`p-4 rounded-xl border text-xs font-bold uppercase transition-all ${booking.payment === p ? 'bg-rose-600 border-rose-400 text-white' : isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>
                        {p === 'pix' ? 'Pix (3% OFF)' : 'Cartão / Link'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-rose-500/30">
                  <span className={`text-xs uppercase tracking-widest font-bold pb-1 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.total_label} (Sem Frete)</span>
                  <div className="text-right">
                    <span className={`text-3xl font-playfair font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {formatMoney(financials.total)}
                    </span>
                  </div>
                </div>

                <div onClick={() => setTermsOpen(true)} className={`mt-8 flex items-center justify-between p-5 rounded-2xl border cursor-pointer ${booking.termsAccepted ? 'bg-emerald-600/20 border-emerald-500' : isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-300'}`}>
                  <span className="text-sm font-semibold">{T.agree_terms}</span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-500'}`}>
                    {booking.termsAccepted && <Icon name="check" size={12} className="text-white" />}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ETAPA 4: SUCESSO */}
          {step === 4 && (
            <section className="min-h-[50vh] flex flex-col items-center justify-center text-center animate-fade-in max-w-md mx-auto px-4">
              <Icon name="check" size={64} className="text-emerald-500 mb-6" />
              <h2 className={`text-3xl font-playfair font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-sm mb-10 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.success_sub}</p>
              <Button variant="whatsapp" size="lg" full icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>{T.whatsapp_btn}</Button>
            </section>
          )}
        </div>
      </main>
      
      {/* Footer Navigation */}
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-black/80 to-transparent">
          <div className={`max-w-2xl mx-auto rounded-3xl p-4 flex justify-between items-center shadow-2xl ${isDark ? 'bg-zinc-900 border border-zinc-700' : 'bg-white border border-slate-300'}`}>
            {step > 0 && (
               <button onClick={() => setStep(s => s - 1)} className={`w-12 h-12 flex justify-center items-center rounded-xl ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}><Icon name="chevron-left" /></button>
            )}
            <div className="flex-1 px-4">
               <p className="text-[10px] font-bold uppercase text-zinc-500">Valor Parcial</p>
               <p className="text-xl font-playfair font-bold">{formatMoney(step === 3 ? financials.total : financials.sub)}</p>
            </div>
            <Button onClick={handleNextStep} disabled={!isStepValid()} size="lg">
              {step === 3 ? 'Finalizar' : 'Avançar'}
            </Button>
          </div>
        </nav>
      )}

      {/* Popups (Terms, Welcome) mantidos simplificados, adicione a lógica de fechar como no original */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setTermsOpen(false)}>
           <div className={`p-8 rounded-3xl max-w-md w-full ${isDark ? 'bg-zinc-900 text-white' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-playfair mb-4">Regras do Ateliê</h3>
              <p className="text-sm font-light mb-6">Ao prosseguir, você concorda que o prazo de confecção começa a contar após a confirmação do pagamento. Alterações no modelo não são permitidas após o início do corte do tecido.</p>
              <Button full onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>Eu Concordo</Button>
           </div>
        </div>
      )}
    </>
  );
}
