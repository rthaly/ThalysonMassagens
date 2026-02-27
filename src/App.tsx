import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES ESTÁTICAS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v28_premium', 
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  SECRET_TOKEN: 'THALY_SECURE_V8',
  START_HOUR: 9,
  END_HOUR: 20,
  MAX_STORAGE_SIZE: 5000 
} as const;

// Ícones Outline Otimizados (mantidos e organizados)
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
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'
};

// ==================================================================================
// 2. DESIGN SYSTEM & ESTILOS GLOBAIS (Cores Suavizadas para Acolhimento)
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
      background-color: ${isDark ? '#09090b' : '#f8fafc'};
      color: ${isDark ? '#f4f4f5' : '#1e293b'};
      transition: background-color 0.4s ease, color 0.4s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      font-family: var(--font-primary);
    }
    
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    
    .animate-slide-in { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
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
interface Review { n: string; loc: string; t: string; s: number; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { street: string; number: string; district: string; city: string; comp: string; placeName: string; }
interface BookingData { type: 'single' | 'pack'; item: ServiceItem | null; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; mediaAllowed: boolean; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// 3. COMPONENTES DE UI (MOBILE-FIRST & ACESSÍVEIS)
// ==================================================================================

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.98] gap-3 shrink-0";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/10",
    secondary: "bg-zinc-800 border border-zinc-700/50 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-green-900/10",
    outline: "bg-transparent border border-zinc-600 text-zinc-300 hover:border-zinc-400",
    ghost: "bg-transparent text-zinc-500 hover:text-zinc-300"
  };
  const sizes = { 
    sm: "min-h-[44px] text-[10px] px-5", 
    md: "min-h-[48px] text-[11px] px-6", 
    lg: "min-h-[56px] text-xs px-8", 
    xl: "min-h-[64px] text-xs md:text-sm px-8" 
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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] animate-fade-in" onClick={onClose} role="presentation" />
      <aside className={`fixed top-0 right-0 h-full w-[85%] sm:w-[75%] max-w-sm z-[70] p-6 sm:p-8 md:p-10 shadow-2xl animate-slide-in flex flex-col ${isDark ? 'bg-zinc-950 text-white border-l border-zinc-800/40' : 'bg-white text-slate-900 border-l border-slate-100'}`}>
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-playfair font-medium">Seu Espaço</h2>
          <button onClick={onClose} className="p-3 -mr-3 rounded-full hover:bg-zinc-500/10 transition-colors" aria-label="Fechar menu"><Icon name="x" size={24} /></button>
        </div>
        
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-white shadow-xl border border-zinc-700/30">
          <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest mb-2">Nível de Cuidado</p>
          <div className="flex justify-between items-end">
             <span className="text-3xl font-light font-playfair">{user.xp} <span className="text-[10px] font-bold text-blue-400 font-sans tracking-widest uppercase">XP</span></span>
             <Icon name="award" size={28} className="text-blue-400" />
          </div>
        </div>

        <nav className="space-y-4 flex-1">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-5 rounded-2xl transition-colors ${isDark ? 'hover:bg-zinc-900/60 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name={isDark ? "moon" : "sun"} size={22} className={isDark ? "text-blue-400" : "text-blue-600"} />
              <span className="font-semibold text-sm">Aparência Visual</span>
            </div>
            <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">{isDark ? 'Noturna' : 'Clara'}</span>
          </button>
          
          <button onClick={() => { if(navigator.share) navigator.share({title: 'Thalyson Massagens', text: 'Encontrei um espaço perfeito de relaxamento e cuidado.', url: window.location.href}) }} className={`w-full flex items-center justify-between p-5 rounded-2xl transition-colors ${isDark ? 'hover:bg-zinc-900/60 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name="share" size={22} className="text-emerald-400" />
              <span className="font-semibold text-sm">Compartilhar Paz</span>
            </div>
          </button>
        </nav>
      </aside>
    </>
  );
});

const Card = memo(({ children, className = '', onClick, active = false, isDark = true, popular = false }: any) => (
  <div onClick={onClick} className={`relative p-6 md:p-8 rounded-[2rem] transition-all duration-400 flex flex-col h-full ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-1 hover:shadow-2xl' : ''} ${active ? 'bg-blue-600/5 border-2 border-blue-500 shadow-blue-500/10' : isDark ? 'bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700/80' : 'bg-white border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'} ${className}`}>
    {popular && (
      <div className="absolute -top-3 left-6 md:left-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg border border-white/10">
        ✦ Escolha Frequente
      </div>
    )}
    {children}
  </div>
));

const InputField = memo(({ label, value, onChange, placeholder, icon, type = "text", isDark = true, hasError = false }: any) => (
  <div className="space-y-2.5 w-full min-w-0">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest pl-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{label}</label>}
    <div className="relative group">
      {icon && <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${hasError ? 'text-red-500' : isDark ? 'text-zinc-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}><Icon name={icon} size={20} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full min-h-[56px] rounded-2xl outline-none text-sm font-medium transition-all duration-300 bg-transparent ${icon ? 'pl-14 pr-5' : 'px-5'} ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-800/80 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500 focus:bg-zinc-900/50' : 'border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-blue-50/30'}`} />
    </div>
  </div>
));

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`w-full h-full flex flex-col p-8 rounded-[2rem] transition-all duration-300 border gap-6 ${isDark ? 'bg-zinc-900/20 border-zinc-800/50 hover:bg-zinc-900/40' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium font-playfair shrink-0 ${isDark ? 'bg-zinc-800/80 text-zinc-200' : 'bg-slate-100 text-slate-700'}`}>
          {review.n.charAt(0)}
        </div>
        <div className="min-w-0">
          <span className={`text-sm md:text-base font-semibold block mb-1 truncate ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{review.n}</span>
          <span className={`text-[9px] md:text-[10px] block tracking-widest uppercase font-bold truncate ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-1 px-2 py-1 shrink-0">
        {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={14} className={i < review.s ? 'text-amber-400 fill-amber-400' : isDark ? 'text-zinc-800' : 'text-slate-200'} />)}
      </div>
    </div>
    <p className={`text-sm leading-relaxed font-light italic flex-1 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>"{review.t}"</p>
  </article>
));

const SmartTimer = memo(({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  useEffect(() => { 
    const interval = setInterval(() => setTime(prev => prev <= 0 ? 600 : prev - 1), 1000); 
    return () => clearInterval(interval); 
  }, []);
  
  const format = (t: number) => { const m = Math.floor(t / 60); const s = t % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  
  // Modificação de Copy para Acolhimento Absoluto (sem escassez agressiva)
  return (
    <div className={`flex items-center justify-center gap-3 p-4 md:p-5 rounded-2xl transition-all border ${isDark ? 'bg-blue-500/5 border-blue-500/10 text-blue-400' : 'bg-blue-50/50 border-blue-100 text-blue-700'}`}>
      <Icon name="heart" size={20} className="shrink-0 opacity-80" />
      <span className="text-[10px] font-bold uppercase tracking-widest break-words text-center">{text} <span className="font-mono text-sm ml-1 bg-blue-500/10 px-2.5 py-1 rounded-md">{format(time)}</span></span>
    </div>
  );
});

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800/40' : 'border-slate-200'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 md:py-8 flex items-center justify-between text-left group min-h-[64px]" aria-expanded={isOpen}>
        <span className={`text-sm md:text-base font-medium pr-6 leading-relaxed transition-colors ${isDark ? 'text-zinc-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>{q}</span>
        <span className={`transition-transform duration-400 shrink-0 p-2 -mr-2 rounded-full ${isOpen ? 'rotate-180 text-blue-500 bg-blue-500/10' : isDark ? 'text-zinc-500 group-hover:bg-zinc-800' : 'text-slate-400 group-hover:bg-slate-100'}`}><Icon name="chevron-down" size={20} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-xs md:text-sm font-light leading-loose ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-5 p-6 rounded-3xl border border-transparent transition-colors ${isDark ? 'hover:bg-zinc-900/40' : 'hover:bg-slate-50'}`}>
    <div className={`shrink-0 mt-1 p-3 rounded-2xl h-fit ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Icon name={rule.icon} size={24} /></div>
    <div>
      <h4 className={`text-base font-medium mb-2 font-playfair ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{rule.title}</h4>
      <p className={`text-xs font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{rule.description}</p>
    </div>
  </div>
));

// ==================================================================================
// 4. LÓGICA DE DADOS E GERAÇÃO DE TEXTOS (COPY REVISADA)
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

// Reviews mantidos intactos conforme solicitação
const getFullReviews = (): Review[] => {
  const originalGustavo = { n: "Gustavo", loc: "Bela Vista - SP", t: "O Thalyson chegou na hora certa, quando eu precisava relaxar após as tensões do mês. A experiência em casa foi incrível. Ele consegue deixar a gente completamente relaxado, as mãos dele tem uma técnica sem igual. O alívio foi imediato, levantei parecendo 10kg mais leve. Quero de novo." };

  const realReviews = [
    { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: "Você tem mãos abençoadas e eu voeeei! Precisava muito desse descanso, dessa paz. Foi super respeitoso a todo tempo e me relaxou demais. Obrigada! ❤️" },
    { n: "Osvaldo", loc: "Santa Fé do Sul", t: "HOJE, 10/02/26 não poderia ter teminado MELHOR o dia, sendo atendido por Thalyson em casa numa sessão de massagem por suas MÃOS MÁGICAS !!! Que delícia! Os 4 pilares essenciais do seu trabalho são bases para transformar o atendimento em uma SENSAÇÃO UNICA que gera valores pro corpo, combinando o aspecto de super EMPATIA com o cliente, sem esquecer da EFICIENCIA e agilidade, clareza durante a sessão, tornando ha, uma visão da PERFEIÇÃO de executar este trabalho de massagem com maestria! Thalyson foca sempre no propósito de servir bem o cliente, desde o início ao fim q é surpreendente! VALE A PENA. 👏👏👏" },
    { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito." },
    { n: "Alan", loc: "SP - Bela Vista", t: "Gostei bastante, saí mais leve. Da pra ver que ele manda bem no que faz." },
    { n: "Tiago", loc: "SP - Bela Vista", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida." }
  ];

  const seriousReviews = [
    { n: "Roberto", loc: "São Paulo - Jardins", t: "A sensação de vazio e paz que senti após a sessão foi indescritível. A finalização foi extremamente potente, liberando uma carga de tensão que eu carregava há meses. Profissionalismo impecável." },
    { n: "Carla", loc: "Rio Preto", t: "Me senti acolhida em um nível que não esperava. Ele tem uma pegada firme que relaxa a musculatura e ao mesmo tempo desperta sensações adormecidas. O alívio no final foi total." },
    { n: "Lucas", loc: "Londrina", t: "Sendo casado, a discrição era minha prioridade e fui atendido com total sigilo. A massagem tântrica me permitiu redescobrir meu próprio corpo. A descarga de energia no final foi intensa." },
    { n: "Felipe", loc: "Votuporanga", t: "Uma experiência de conexão rara. Fiquei trêmulo após a sessão, de uma forma boa. Foi um momento de esvaziar a mente completamente. Recomendo para quem busca algo além do físico." },
    { n: "Mariana", loc: "Jales", t: "Toque respeitoso, mas com a intensidade certa. Consegui me desligar dos problemas do trabalho e focar apenas no meu prazer e bem-estar. Foi libertador." },
    { n: "Gustavo", loc: "Hotel Ibis - SP", t: "A combinação da massagem relaxante com a sensitiva criou uma jornada perfeita. O ápice da sessão foi vigoroso e restaurador. Sensação de leveza absurda ao final." },
    { n: "Ricardo", loc: "Fernandópolis", t: "Encontrei um profissionalismo raro. Me senti à vontade para soltar minhas travas. Saí de lá me sentindo 10kg mais leve, física e emocionalmente." },
    { n: "Sérgio", loc: "Santa Fé", t: "Sofro de ansiedade e essa sessão foi mais eficaz que muitas terapias. A conexão humana foi real, e o clímax final foi o mais forte e libertador que já experimentei." },
    { n: "Beatriz", loc: "Rio Preto", t: "Mãos quentes e presença firme. O ambiente ficou carregado de uma energia positiva. Consegui relaxar profundamente e esquecer o caos lá fora." },
    { n: "Marcelo", loc: "SP - Centro", t: "Fui sem expectativa e saí surpreendido. A massagem lingam foi executada com uma técnica precisa e respeitosa. O prazer foi intenso e genuíno." },
    { n: "André", loc: "Motel K2", t: "Discrição absoluta. O Thalyson é uma pessoa de energia muito boa e sabe o que faz. Foi um escape necessário e revitalizante da minha rotina." },
    { n: "Juliana", loc: "Londrina", t: "Delicadeza e força alternadas nos momentos exatos. Me senti viva de novo. Obrigada pelo carinho e respeito com meu corpo." },
    { n: "Paulo", loc: "São Paulo - Paulista", t: "Uma experiência completa. Do toque inicial reconfortante até a explosão final de energia. Foi intenso e me deixou com as pernas bambas de tanto relaxamento." },
    { n: "Vinícius", loc: "Jales", t: "Tirou um peso das minhas costas que eu nem sabia que carregava. A finalização foi potente e necessária. Voltarei com certeza." },
    { n: "Fernanda", loc: "Santa Fé", t: "Super respeitoso com meu corpo. Foi uma troca de energia muito bonita, intensa e sem pressa. Me senti renovada." },
    { n: "Eduardo", loc: "Rio Preto", t: "Sensacional. A técnica dele para construir e depois liberar a energia é coisa de outro mundo. Foi um alívio físico e mental gigantesco." },
    { n: "Caio", loc: "SP - Consolação", t: "Atendimento impecável no meu hotel. Pontual, discreto e com uma mão que sabe exatamente onde tocar para aliviar a tensão." },
    { n: "Larissa", loc: "Votuporanga", t: "Relaxamento profundo. Esqueci de tudo lá fora. Recomendo para qualquer pessoa que precise se reconectar consigo mesma." },
    { n: "Otávio", loc: "Londrina", t: "Foi intenso do início ao fim. Uma descarga de energia que eu estava precisando desesperadamente. Me senti limpo por dentro." },
    { n: "Diego", loc: "Fernandópolis", t: "A melhor parte foi não me sentir julgado. Pude ser eu mesmo, expressar meu prazer e aproveitar cada segundo de cuidado." }
  ];

  return [originalGustavo, ...realReviews, ...seriousReviews].map(r => ({ ...r, s: 5 }));
};

const getData = () => {
  const p = {
    relax: 157, sens: 177, titan: 207, nuru: 317, depil: 107,
    packRelax: { v: 527, full: 628, save: 101 },
    packTri: { v: 517, full: 621, save: 104 },
    packMix: { v: 637, full: 768, save: 131 },
    packSupreme: { v: 567, full: 681, save: 114 },
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
      {
        id: 'depilacao', min: 45, price: p.depil, icon: "scissors",
        tag: "CUIDADO PESSOAL", title: "Aparo Corporal",
        desc: "Sinta-se leve e limpo. A manutenção estética é o primeiro passo para o conforto.",
        details: "Aparo uniforme com equipamento profissional\nFoco no peito, costas, abdômen e pernas\nNo conforto e privacidade do seu local"
      },
      {
        id: 'relaxante', min: 60, price: p.relax, icon: "user-check",
        tag: "ALÍVIO IMEDIATO", title: "Massagem Clássica",
        desc: "Costas travadas e rotina pesada? Um alívio profundo para curar o corpo e a mente.",
        details: "Uso de rolos de madeira para soltar a musculatura\nToques suaves e relaxantes com as mãos\nFoco intensivo na lombar, ombros e pescoço\nMomento terapêutico para zerar a fadiga do corpo" 
      },
      {
        id: 'sensitiva', min: 60, price: p.sens, icon: "sparkles",
        tag: "DESPERTAR SENSORIAL", title: "Massagem Sensorial",
        desc: "Quando sua mente não desliga. Desperte a sensibilidade e permita-se relaxar plenamente.",
        details: "Toques sutis que tiram o foco dos pensamentos\nCondução fluida para um estado de entrega\nFinalização focada em liberação de tensão\nPara quem precisa esvaziar a mente sentindo o corpo" 
      },
      {
        id: 'mista', min: 60, price: p.titan, icon: "zap", popular: true,
        tag: "RECONEXÃO & PRAZER", title: "Jornada Fusion",
        desc: "Primeiro curamos suas dores, depois guiamos seu corpo a um estado de relaxamento profundo.",
        details: "Inicia quebrando a rigidez das costas e ombros\nContato sutil pelo corpo despertando sensações\nToque sensitivo transita para cuidado envolvente\nCulmina em uma liberação orgânica de toda a tensão" 
      },
      {
        id: 'nuru', min: 60, price: p.nuru, icon: "sparkles",
        tag: "ENTREGA ABSOLUTA", title: "Imersão Nuru",
        desc: "Ajoelhe-se diante do momento. Calor orgânico e contato que derretem o estresse.",
        details: "Vivência de entrega total sem amarras\nAplicação de gel aquecido para máximo conforto\nDeslizamento contínuo corpo a corpo\nA imersão mais profunda para o seu descanso mental" 
      }
    ] as ServiceItem[],
    extras: [
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "✂️", isEmoji: true, label: "Aparo Corporal Prévio", desc: "Manutenção em 2 áreas para conforto total." },
      { id: 'more_time', price: p.extras.more_time, icon: "⏱️", isEmoji: true, label: "Tempo Expandido (+30m)", desc: "Um respiro extra para não haver pressa alguma." },
      { id: 'touch', price: p.extras.touch, icon: "🖐️", isEmoji: true, label: "Interação e Acolhimento", desc: "Sinta-se livre para participar do toque com calma." },
      { id: 'aroma', price: p.extras.aroma, icon: "🌸", isEmoji: true, label: "Aromaterapia Profunda", desc: "Óleos essenciais para baixar sua frequência." },
      { id: 'pain_relief', price: p.extras.pain_relief, icon: "💊", isEmoji: true, label: "Atenção a Dores Fortes", desc: "Uso de pomada técnica e foco terapêutico." }
    ],
    plans: [
      { id: 'pack_relax', type: 'pack', title: "Ciclo Alívio (4x)", price: p.packRelax.v, fullPrice: p.packRelax.full, savings: p.packRelax.save, desc: "4 Sessões de Descompressão", details: "Acabe com a dor lombar crônica de uma vez.\nUm cronograma de manutenções preventivas e curativas.", tag: "SAÚDE FÍSICA", icon: "package" },
      { id: 'pack_mista', type: 'pack', title: "Ciclo Fusion (3x)", price: p.packTri.v, fullPrice: p.packTri.full, savings: p.packTri.save, desc: "3 Encontros de Desbloqueio e Cuidado", details: "A rotina te consome. Tenha seu refúgio garantido.\nTrês imersões completas para alinhar o físico e o mental.", tag: "ACOLHIMENTO MENSAL", icon: "layers" },
      { id: 'pack_supreme', type: 'pack', title: "Jornada Supreme (3x)", price: p.packSupreme.v, fullPrice: p.packSupreme.full, savings: p.packSupreme.save, desc: "O ápice de todas as técnicas juntas", details: "Para quem quer se permitir todas as vivências.\nUma sessão Terapêutica, uma Fusion e uma Nuru.", tag: "CUIDADO COMPLETO", icon: "award" }
    ] as ServiceItem[],
    faq: [
      { q: "Como ocorre o toque e o acolhimento?", a: "Tudo é conduzido com extremo respeito e calma, focado inteiramente no seu conforto. O objetivo é criar um espaço seguro para que você possa se entregar, relaxar a mente e deixar o estresse ir embora." },
      { q: "Onde realizamos nosso encontro?", a: "Vou até você, no conforto do seu local seguro. Chego no horário marcado e transformo o ambiente (seja sua cama ou sofá) em um verdadeiro refúgio de paz para cuidarmos de você." },
      { q: "Como devo me preparar?", a: "De coração aberto e respiração calma! O mais importante é que você tome um banho quente antes da minha chegada. A água ajuda a soltar os músculos iniciais e prepara seu corpo." },
      { q: "Tenho vergonha do meu corpo, como fazemos?", a: "Abandone esse peso. Meu trabalho é puro acolhimento. Durante o nosso momento, não existe julgamento, existe apenas a vontade genuína de proporcionar alívio e bem-estar." }
    ],
    rules: [
      { icon: "shower", title: "Água que Acalma", description: "Um banho morno antes de eu chegar relaxa a musculatura superficial e prepara você para receber o cuidado." },
      { icon: "hand", title: "Espaço de Respeito", description: "Eu cuido de você. O respeito mútuo e a comunicação gentil são a chave para que a sessão flua com leveza." },
      { icon: "heart", title: "Sua Entrega", description: "Este tempo é exclusivamente seu. Desligue-se das obrigações lá fora e permita-se apenas respirar e sentir." },
      { icon: "clock", title: "O Ritmo do Encontro", description: "Chego no horário para honrar seu tempo. Nossa margem de tolerância é de 15 minutos, para mantermos a harmonia." }
    ],
    text: {
      welcome: "É um privilégio receber você,",
      choose_sub: "Sei como os dias têm sido intensos. Pausa um pouco. Escolha como deseja ser cuidado hoje. A partir daqui, pode deixar comigo.",
      level_label: "Seu Momento de Cuidado",
      tab_packs: "Jornadas Mensais",
      tab_single: "Encontro Único",
      next_btn: "Continuar jornada",
      finish_btn: "Confirmar meu momento",
      loading: "Preparando um espaço seguro para você...",
      toast_select_item: "Por gentileza, escolha uma das formas de cuidado abaixo para prosseguirmos.",
      toast_select_date: "Toque no dia que faz sentido para você e escolha o melhor horário.",
      toast_fill_name: "Gostaria de saber como prefere ser chamado.",
      toast_fill_addr: "Por favor, indique onde poderei ir cuidar de você.",
      toast_accept_terms: "Apenas um detalhe: confirme nosso acordo de respeito mutuo no final da página.",
      toast_coupon_success: "Um carinho a mais aplicado à sua jornada.",
      toast_coupon_invalid: "Este código parece não estar válido no momento.",
      details_label: "COMO SERÁ SEU MOMENTO:",
      select_time_title: "Quando podemos pausar a sua rotina?",
      location_title: "Onde será nosso refúgio de paz?",
      extras_title: "Mimos para potencializar seu bem-estar",
      coupon_section: "Possui algum presente especial?",
      payment_title: "Como prefere acertar seu momento? (Feito no encontro)",
      terms_title: "Nosso Acordo de Acolhimento",
      success_title: "Tudo preparado para você.",
      success_sub: "Seu momento de respiro foi desenhado. Agora, basta me enviar a confirmação no WhatsApp para selarmos nosso encontro na agenda. Estou te esperando.",
      whatsapp_btn: "Enviar Confirmação no WhatsApp",
      back_home: "Refazer escolhas",
      timer_text: "Reservamos este horário para você por",
      upgrade_msg: "Uma ótima escolha para aliviar o corpo. Se desejar relaxar a mente também, a Jornada Fusion é um excelente caminho.",
      input_name: "Como gosta de ser chamado?",
      input_addr: "Endereço do encontro",
      input_num: "Número",
      input_district: "Seu Bairro",
      input_city: "Sua Cidade",
      input_comp: "Apto, Bloco, Interfone (Opcional)",
      input_hotel: "Qual o nome do Hotel?",
      input_room: "Número do Quarto / Suíte",
      agree_terms: "Eu aceito este espaço de respeito e entrega",
      faq_title: "Perguntas de quem chega pela primeira vez",
      reviews_title: "Quem já se permitiu pausar:",
      empty_date: "Toque em um dia acima para visualizarmos as possibilidades.",
      empty_slots: "Este dia já foi preenchido com cuidados. Teríamos disponibilidade em outra data?",
      total_label: "Valor da sua Experiência",
      subtotal: "Valor do Cuidado",
      discount: "Presente Aplicado",
      pix_discount: "Cuidado com o Pix (3%)",
      welcome_popup_title: "Seja muito bem-vindo!",
      welcome_popup_msg: "É admirável que você tenha decidido tirar um momento para si mesmo. Muitos esquecem de pausar. Como forma de celebrar seu autocuidado, aqui está um presente especial.",
      levelup_popup_title: "Um Novo Marco!",
      levelup_popup_msg: "A sua constância em se cuidar gerou frutos. Acabei de adicionar um benefício no seu espaço para a nossa próxima sessão.",
      get_coupon: "Receber meu carinho",
      rules_complete: "Acordo de Acolhimento",
      media_discount: "Apoio ao Trabalho (1%)",
      media_title: "Apoiar meu espaço (Opcional)",
      media_desc: "Se sentir conforto, você pode permitir registros estéticos anônimos (apenas silhuetas, sem rosto ou exposição íntima) para o meu portfólio de trabalho. Em gratidão, você recebe 1% OFF.",
      media_bonus: "Incentivar e ganhar 1% OFF",
      uber_notice: "Deslocamento: Como vou até o seu refúgio, um valor gentil de Uber será combinado na nossa conversa no WhatsApp, tudo de forma transparente.",
      motel_note: "Um local desenhado para sua imersão. A escolha, reserva e os custos do ambiente ficam sob seu cuidado; o alívio e o acolhimento são a minha missão."
    },
    reviews: getFullReviews()
  };
};

// ==================================================================================
// 5. MAIN APP OTIMIZADO (COMPONETIZADO LOGICAMENTE E ACESSÍVEL)
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
  const [manualCouponInput, setManualCouponInput] = useState(''); 
  
  const DATA = useMemo(() => getData(), []);
  const T = DATA.text;
  
  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 92, lastActivity: new Date().toISOString()
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
  }, []);

  useEffect(() => {
    if (isClient) {
        document.title = step === 0 ? "Thalyson Massagens - Pausa & Cuidado" : "Seu Encontro - Thalyson";
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
    setTimeout(() => setLoading(false), 900);
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
      const timer = setTimeout(() => setWelcomePopup(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded, welcomePopup]);
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);
  
  const handleSelectItem = useCallback((type: 'single' | 'pack', item: ServiceItem) => {
    setBooking(prev => ({ ...prev, type, item, extras: {}, payment: '', termsAccepted: false, bookingId: `BOOK_${Date.now()}` }));
    if (item.id === 'relaxante') addToast(DATA.text.upgrade_msg, "success");
    setTimeout(() => setStep(1), 350); // Transição um pouco mais suave
  }, [addToast, DATA.text.upgrade_msg]);
  
  const applyManualCoupon = () => {
    const code = manualCouponInput.toUpperCase().trim();
    if (code === 'BEMVINDO10' || code === 'PAUSA10') {
      setBooking(b => ({ ...b, appliedCoupon: { id: 'manual', val: 10, title: `✨ PRESENTE: ${code}`, code } }));
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
    const f = financials; const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(CONFIG.LOCALE_PT) : '';
    const securityHash = btoa(encodeURIComponent(`${f.total}-${dateStr}-${booking.item?.id || ''}-${CONFIG.SECRET_TOKEN}`)).substring(0, 8).toUpperCase();
    let serviceTitle = booking.item?.title || ''; if (booking.type !== 'single' && booking.item?.desc) serviceTitle += ` (Jornada)`;
    
    let locTxt = ""; let mapQuery = "";
    if (booking.locationType === 'home') { 
      const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`; 
      locTxt = `🏠 *Meu Refúgio*\n📍 ${fullAddr}\n📝 Detalhe: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    else if (booking.locationType === 'motel') { 
      locTxt = `🏩 *Ambiente Reservado*\n⚠️ (Local garantido pelo cliente)`; 
    }
    else { 
      const fullAddr = `${booking.address.placeName}, ${booking.address.city}`; 
      locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 Quarto: ${booking.address.comp || '-'}`; 
      mapQuery = fullAddr; 
    }
    
    const extrasList = Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => { 
      const ex = DATA.extras.find(e => e.id === k); 
      if (!ex) return ''; 
      return `✅ ${ex.label}`; 
    }).filter(Boolean).join('\n');
    
    let priceDetails = `💵 *Valor da Experiência (${serviceTitle}):* R$ ${booking.item?.price.toFixed(2).replace('.', ',')}`;
    if (f.disc > 0) priceDetails += `\n🎁 *Cuidado extra (${booking.appliedCoupon?.code}):* -R$ ${f.disc.toFixed(2).replace('.', ',')}`;
    if (f.mediaDisc > 0) priceDetails += `\n📸 *Apoio Portfólio:* -R$ ${f.mediaDisc.toFixed(2).replace('.', ',')}`;
    if (f.pixDisc > 0) priceDetails += `\n💸 *Cuidado PIX (3%):* -R$ ${f.pixDisc.toFixed(2).replace('.', ',')}`;
    priceDetails += `\n\n💰 *VALOR FINAL: R$ ${f.total.toFixed(2).replace('.', ',')}*`;
    
    return `
*MOMENTO DE CUIDADO* | #${securityHash}
──────────────────
👤 *Nome:* ${sanitizeInput(user.name)}
📅 *Data da Pausa:* ${dateStr}
⏰ *Horário:* ${booking.time}

💆‍♂️ *FORMA DE CUIDADO:*
*${serviceTitle}*
${extrasList ? `\n➕ *Detalhes do Momento:*\n${extrasList}` : ''}

📍 *ONDE NOS VEREMOS:*
${locTxt}
${mapQuery ? `🔗 GPS: http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(mapQuery)}` : ''}

🚗 *Deslocamento:* A combinar de forma gentil.

💰 *RESUMO DO MOMENTO:*
${priceDetails}

💳 *Forma de contribuição escolhida:* ${booking.payment.toUpperCase()}
──────────────────
_Olá Thalyson, aceito nosso espaço de respeito e aguardo para iniciarmos nossa sessão._
    `.trim();
  };

  const generateWhatsAppLink = () => `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(generateWhatsAppMsg())}`;
  
  const copyToClipboard = () => { 
    navigator.clipboard.writeText(generateWhatsAppMsg()); 
    addToast("Resumo guardado com carinho!", "success"); 
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
        updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 Presente: ${lvl.title}`, code: `PAUSA${lvl.level}` }); 
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
              title: `✨ Mimo Especial: Plenitude`, 
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
      setTimeout(() => addToast(`${T.levelup_popup_title} ${newLevelTitle}!`, "success"), 600); 
    }
    
    window.open(generateWhatsAppLink(), '_blank');
    setStep(4);
  };
  
  const scrollDates = (dir: 'left' | 'right') => { 
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' }); 
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
  
  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] transition-colors duration-1000 ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center max-w-sm w-full px-8">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-5xl font-playfair mb-10 animate-pulse shadow-2xl shadow-blue-500/20 border border-white/10">
            T
          </div>
          <div className="w-full h-1.5 bg-zinc-800/20 overflow-hidden mb-6 rounded-full">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%', animation: 'loading-bar 2.5s ease-in-out infinite' }}></div>
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
      <div className={`fixed inset-0 z-[-1] pointer-events-none transition-colors duration-1000 ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`} aria-hidden="true" />
      
      {/* Toasts / Notifications */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-4 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div key={t.id} role="alert" className={`pointer-events-auto flex items-center gap-4 px-5 py-4 rounded-2xl border backdrop-blur-2xl shadow-2xl animate-fade-in ${t.type === 'success' ? isDark ? 'bg-zinc-800/90 border-zinc-700/50 text-zinc-100' : 'bg-white/95 border-slate-200 text-slate-800' : 'bg-red-500/95 border-red-500 text-white'}`}>
            <Icon name={t.type === 'success' ? 'heart' : 'alert-circle'} size={20} className="shrink-0" />
            <span className="text-sm font-medium tracking-wide leading-snug">{t.msg}</span>
          </div>
        ))}
      </div>
      
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} user={user} />

      <main className="min-h-screen relative z-10 pb-48 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto selection:bg-blue-500/20 selection:text-blue-200">
        {step !== 4 && (
          <header className="pt-12 md:pt-16 pb-10 md:pb-12">
            <div className="flex items-start justify-between">
              <div className="flex flex-col cursor-pointer transition-opacity hover:opacity-80" onClick={() => setStep(0)} title="Início">
                <h1 className={`text-3xl md:text-4xl font-playfair tracking-tight font-medium ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  Thalyson <br className="block sm:hidden" /> Massagens
                </h1>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest mt-3 font-bold">
                  <span className="relative flex h-2.5 w-2.5 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span></span>
                  {user.ordersCount || 92} momentos de paz entregues
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <button onClick={() => setMenuOpen(true)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all border shadow-sm shrink-0 ${isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:shadow-md'}`}>
                   <Icon name="menu" size={24} />
                </button>
              </div>
            </div>
            
            {/* Progressão Visual Suave */}
            {step > 0 && step < 4 && (
              <div className="mt-12 flex items-center justify-between gap-4 max-w-sm mx-auto">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3">
                    <div className={`w-full h-1.5 rounded-full transition-all duration-700 ease-in-out ${step >= i ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]' : isDark ? 'bg-zinc-800/60' : 'bg-slate-200'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${step >= i ? isDark ? 'text-zinc-200' : 'text-slate-800' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                      {i === 1 ? 'Quando' : i === 2 ? 'Onde' : 'Detalhes'}
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
              {/* Seção de Boas Vindas Acolhedora */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-4">
                <div>
                  <h2 className={`text-4xl md:text-5xl font-playfair font-medium leading-[1.2] mb-6 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    {T.welcome} <span className="italic text-blue-500">{user.name ? String(user.name).trim().split(' ')[0] : "permita-se"}.</span>
                  </h2>
                  <p className={`text-base md:text-lg font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {T.choose_sub}
                  </p>
                </div>
                
                {/* Cartão de Jornada Pessoal */}
                <div className={`p-8 rounded-[2rem] border transition-colors ${isDark ? 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/80' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/40 hover:border-slate-300'}`}>
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm shrink-0 ${isDark ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/50 text-blue-400' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 text-blue-600'}`}>
                        <Icon name="heart" size={24} />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-[10px] uppercase font-bold tracking-widest block mb-1.5 truncate ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          {T.level_label}
                        </span>
                        <h3 className={`text-xl font-playfair font-medium truncate ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                          {user.xp >= 800 ? "Plenitude Plus" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-3xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-zinc-100 to-zinc-400' : 'from-slate-700 to-slate-900'}`}>{user.xp}</span>
                      <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest block mt-2">Grau de Paz</span>
                    </div>
                  </div>
                  <div>
                    <div className={`flex justify-between text-[10px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      <span>Sua Evolução</span>
                      <span>{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800/40' : 'bg-slate-200'}`} role="progressbar" aria-valuenow={getCurrentLevelProgress()} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full bg-blue-500 transition-all duration-1000 ease-out relative" style={{ width: `${getCurrentLevelProgress()}%` }}>
                          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    {nextLevelInfo && (
                      <p className={`text-xs mt-5 text-center font-light ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        Mantenha o cuidado. Faltam <strong className={isDark ? 'text-zinc-300 font-medium' : 'text-slate-700 font-medium'}>{nextLevelInfo.needed} XP</strong> para seu próximo benefício.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Abas */}
              <div className={`flex p-2 rounded-2xl border max-w-sm mx-auto shadow-inner ${isDark ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-slate-100/60 border-slate-200'}`} role="tablist">
                <button role="tab" aria-selected={activeTab === 'single'} onClick={() => setActiveTab('single')} className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-400 ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="user" size={18} /> {T.tab_single}
                </button>
                <button role="tab" aria-selected={activeTab === 'packs'} onClick={() => setActiveTab('packs')} className={`flex-1 flex items-center justify-center gap-3 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-400 ${activeTab === 'packs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-800'}`}>
                  <Icon name="package" size={18} /> {T.tab_packs}
                </button>
              </div>
              
              {/* Grid de Serviços Otimizado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => (
                  <Card key={s.id} active={booking.item?.id === s.id} onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : 'pack', s)} isDark={isDark} popular={s.popular}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-8 gap-4">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl border shadow-sm shrink-0 ${isDark ? 'bg-zinc-800/80 border-zinc-700/50 text-zinc-200' : 'bg-white border-slate-200 text-slate-700'}`}>
                          <Icon name={s.icon} size={26} isEmoji={s.isEmoji} />
                        </div>
                        <div className="text-right min-w-0 flex-1 flex flex-col items-end">
                          {s.fullPrice && (
                            <span className={`text-[10px] block mb-1.5 uppercase tracking-widest font-bold truncate w-full ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                              De: <span className="line-through">{formatMoney(s.fullPrice)}</span>
                            </span>
                          )}
                          <span className={`text-2xl font-playfair font-medium truncate w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {formatMoney(s.price)}
                          </span>
                          {s.savings && (
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full block mt-2 border max-w-fit ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                              ECONOMIA: {formatMoney(s.savings)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <span className={`text-[9px] font-bold uppercase tracking-widest border px-3 py-1.5 rounded-full inline-block mb-4 ${isDark ? 'bg-zinc-800/50 border-zinc-700/50 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
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
                    
                    <div className={`pt-6 mt-auto border-t ${isDark ? 'border-zinc-800/40' : 'border-slate-200'}`}>
                      <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-zinc-300' : 'text-slate-500'}`}>
                        <Icon name="check" size={16} className="text-blue-500 shrink-0" /> {T.details_label}
                      </div>
                      <div className={`text-xs space-y-2.5 font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {s.details.split('\n').map((line, i) => <p key={i} className="flex items-start gap-3"><span className="text-blue-500 mt-1.5 text-[8px] shrink-0">●</span> <span>{line}</span></p>)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Social Proof Acolhedor */}
              <div className="py-16 relative border-t border-b border-dashed border-zinc-800/40 mt-16">
                <div className="flex items-center justify-between mb-10">
                  <h3 className={`text-3xl font-playfair font-medium ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                    {T.reviews_title}
                  </h3>
                  <div className="hidden md:flex gap-4">
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: -360, behavior: 'smooth' })} className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-sm'}`}><Icon name="chevron-left" size={20} /></button>
                    <button onClick={() => document.getElementById('reviews-slider')?.scrollBy({ left: 360, behavior: 'smooth' })} className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 shadow-sm'}`}><Icon name="chevron-right" size={20} /></button>
                  </div>
                </div>
                
                <div id="reviews-slider" className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-8 pt-4 -mx-4 md:-mx-8 px-4 md:px-8 gap-6 items-stretch" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-[380px] flex h-auto">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* FAQ */}
              <div className="max-w-3xl mx-auto py-12">
                <h3 className={`text-3xl font-playfair font-medium text-center mb-10 ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                  {T.faq_title}
                </h3>
                <div className={`border-t border-b ${isDark ? 'border-zinc-800/40' : 'border-slate-200'}`}>
                  {DATA.faq.map((item, idx) => <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />)}
                </div>
              </div>
            </section>
          )}
          
          {step === 1 && (
            <section className="space-y-12 animate-fade-in max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className={`text-3xl md:text-4xl font-playfair font-medium mb-5 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  {T.select_time_title}
                </h2>
                <p className={`text-sm md:text-base font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {T.toast_select_date}
                </p>
              </div>
              
              <div className={`p-6 rounded-2xl flex items-center justify-between border shadow-sm ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-slate-200'}`}>
                 <div className="flex flex-col gap-1.5 min-w-0 pr-4">
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Sua Escolha de Hoje</span>
                   <span className={`text-lg md:text-xl font-medium font-playfair truncate ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{booking.item?.title}</span>
                 </div>
                 <button onClick={() => setStep(0)} className={`text-[10px] uppercase font-bold tracking-widest px-5 py-2.5 rounded-full transition-colors border shrink-0 ${isDark ? 'border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800' : 'border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>Revisar</button>
              </div>

              <div className="relative mt-12">
                <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-14 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full transition-all border shadow-lg shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><Icon name="chevron-left" size={24} /></button>
                
                <div ref={dateScrollRef} className="flex gap-4 overflow-x-auto px-4 py-6 snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const monthName = d.toLocaleDateString(CONFIG.LOCALE_PT, { month: 'short' }).replace('.', '');
                    return (
                      <div key={idx} className="snap-center shrink-0">
                        <button onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))} className={`w-[80px] h-[108px] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 border ${isSel ? 'bg-blue-600 border-blue-500 text-white scale-[1.05] shadow-lg shadow-blue-900/20' : isDark ? 'bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:border-zinc-600 hover:bg-zinc-800/50' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50 shadow-sm'}`}>
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-100' : 'opacity-60'}`}>{monthName}</span>
                          <span className="text-2xl font-medium font-playfair">{d.getDate()}</span>
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${isSel ? 'text-blue-200' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{getDayLabel(d)}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                
                <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full transition-all border shadow-lg shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}><Icon name="chevron-right" size={24} /></button>
              </div>
              
              {!booking.date && (
                <div className={`text-center py-20 rounded-[2rem] border border-dashed flex flex-col items-center justify-center gap-5 mt-10 transition-colors px-6 ${isDark ? 'border-zinc-800/60 bg-zinc-900/20 text-zinc-500' : 'border-slate-300 bg-slate-50/50 text-slate-400'}`}>
                  <Icon name="calendar" size={40} className="opacity-40" />
                  <p className="text-xs font-bold uppercase tracking-widest">{T.empty_date}</p>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="mt-12 animate-fade-in">
                  <div className="flex flex-col mb-8">
                    <h4 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Horários para a sua pausa</h4>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {generateTimeSlots.map((t) => (
                      <button key={t} onClick={() => setBooking(b => ({ ...b, time: t }))} className={`py-4 rounded-2xl text-sm font-bold transition-all duration-300 border ${booking.time === t ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20 scale-105' : isDark ? 'bg-zinc-900/30 border-zinc-800/60 text-zinc-300 hover:border-zinc-600' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-20 rounded-[2rem] border mt-10 ${isDark ? 'bg-zinc-900/20 border-zinc-800/60 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                  <p className="text-sm font-medium tracking-wide leading-relaxed px-6">{T.empty_slots}</p>
                </div>
              )}
            </section>
          )}
          
          {step === 2 && (
            <section className="space-y-12 animate-fade-in max-w-2xl mx-auto">
              <h2 className={`text-3xl md:text-4xl font-playfair font-medium text-center ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'home', label: 'Meu Local', icon: 'home' },
                  { id: 'motel', label: 'Ambiente Íntimo', icon: 'heart' },
                  { id: 'hotel', label: 'Hotel', icon: 'building' }
                ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))} className={`py-6 px-3 rounded-3xl flex flex-col items-center gap-3 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20 -translate-y-1' : isDark ? 'bg-zinc-900/30 border-zinc-800/50 text-zinc-400 hover:border-zinc-700/80' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 shadow-sm'}`}>
                    <Icon name={x.icon} size={26} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">{x.label}</span>
                  </button>
                ))}
              </div>
              
              <div className={`p-6 md:p-10 rounded-[2rem] border shadow-sm transition-colors duration-400 ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-slate-100'} space-y-8`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder="Como deseja ser chamado" hasError={!user.name || String(user.name).trim().length < 3} />
                
                {booking.locationType === 'home' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-6">
                      <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} icon="map-pin" placeholder="Rua / Avenida" hasError={!booking.address.street} />
                      <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Nº" type="tel" hasError={!booking.address.number} />
                    </div>
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder="Seu Bairro" hasError={!booking.address.district} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder="Sua Cidade" hasError={!booking.address.city} />
                      <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Apto, Bloco (Opcional)" />
                    </div>
                  </div>
                )}
                
                {booking.locationType === 'hotel' && (
                  <div className="space-y-6 animate-fade-in">
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder="Nome do Hotel" hasError={!booking.address.placeName} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder="Cidade" hasError={!booking.address.city} />
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Nº do Quarto" />
                  </div>
                )}
                
                {booking.locationType === 'motel' && (
                  <div className={`p-8 rounded-3xl border text-center animate-fade-in ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-slate-50 border-slate-200'} flex flex-col items-center gap-5`}>
                    <div className={`p-4 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-200 text-slate-500'}`}>
                      <Icon name="heart" size={28} />
                    </div>
                    <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                      {T.motel_note}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-6">
                <h3 className={`text-xs font-bold uppercase mb-6 tracking-widest pl-2 flex items-center gap-3 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <Icon name="sparkles" size={18} className="text-blue-500" /> {T.extras_title}
                </h3>
                <div className="space-y-4">
                  {DATA.extras.map((ex) => {
                    const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                    const isActive = booking.extras[ex.id];
                    return (
                      <div key={ex.id} onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))} className={`flex items-center justify-between p-6 rounded-3xl border cursor-pointer transition-all duration-300 min-h-[80px] ${isActive ? 'bg-blue-600/5 border-blue-500 shadow-sm' : isDark ? 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/80' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'} group`} role="checkbox" aria-checked={isActive}>
                        <div className="flex items-center gap-5 min-w-0 pr-4">
                          <div className={`transition-transform duration-300 shrink-0 ${isActive ? 'scale-110' : ''}`}><Icon name={ex.icon} size={28} isEmoji={ex.isEmoji} /></div>
                          <div className="min-w-0">
                            <p className={`text-sm md:text-base font-semibold truncate mb-1 ${isActive ? isDark ? 'text-blue-400' : 'text-blue-700' : isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{ex.label}</p>
                            <p className={`text-[11px] md:text-xs font-light truncate ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{ex.desc}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] font-bold tracking-widest px-4 py-2 rounded-full transition-colors ${isActive ? 'bg-blue-500 text-white' : isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
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
            <section className="space-y-12 animate-fade-in max-w-4xl mx-auto">
              <SmartTimer isDark={isDark} text={T.timer_text} />
              
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                <div className={`p-8 md:p-10 rounded-[2rem] border shadow-sm ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-slate-100'}`}>
                  <h3 className={`text-2xl font-playfair font-medium mb-8 flex items-center gap-4 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    <Icon name="file-text" size={26} className="text-blue-500" /> Resumo do Encontro
                  </h3>
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-6">
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-2.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          EXPERIÊNCIA ESCOLHIDA
                        </p>
                        <h4 className={`text-lg md:text-xl font-playfair font-semibold truncate ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                          {booking.item ? (DATA.services.find(s => s.id === booking.item?.id) || DATA.plans.find(p => p.id === booking.item?.id))?.title : ''}
                        </h4>
                        <div className={`flex items-center gap-2.5 text-xs font-medium mt-4 border px-4 py-2 rounded-full w-fit shadow-sm truncate ${isDark ? 'bg-zinc-800/50 border-zinc-700/50 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                          <Icon name="calendar" size={14} className="text-blue-500 shrink-0" />
                          {booking.date ? new Date(booking.date).toLocaleDateString(CONFIG.LOCALE_PT) : ''} às {booking.time}
                        </div>
                      </div>
                      <span className={`text-xl font-medium font-playfair shrink-0 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                        {formatMoney(financials.sub)}
                      </span>
                    </div>
                    
                    {Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).length > 0 && (
                      <div className={`pt-8 border-t ${isDark ? 'border-zinc-800/40' : 'border-slate-200'}`}>
                        <p className={`text-[10px] uppercase font-bold tracking-widest mb-5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                          MIMOS ADICIONADOS
                        </p>
                        <div className="space-y-4">
                          {Object.keys(booking.extras || {}).filter(k => (booking.extras || {})[k]).map(k => {
                            const ex = DATA.extras.find(e => e.id === k);
                            if (!ex) return null;
                            const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                            return (
                              <div key={k} className="flex justify-between text-sm font-medium">
                                <span className={`flex items-center gap-3 truncate pr-4 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                   <Icon name="check" size={16} className="text-blue-500 shrink-0" /> <span className="truncate">{ex.label}</span>
                                </span>
                                <span className={`shrink-0 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>+ {formatMoney(price)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className={`pt-8 border-t border-dashed ${isDark ? 'border-zinc-800/60' : 'border-slate-300'}`}>
                      <div className="flex justify-between mb-4 text-sm">
                        <span className={`font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.subtotal}</span>
                        <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          {formatMoney(financials.sub)}
                        </span>
                      </div>
                      
                      {financials.disc > 0 && (
                        <div className="flex justify-between mb-4 text-emerald-500 font-medium text-sm">
                          <span className="truncate pr-4">{T.discount} ({booking.appliedCoupon?.code})</span>
                          <span className="shrink-0">- {formatMoney(financials.disc)}</span>
                        </div>
                      )}

                      {financials.mediaDisc > 0 && (
                        <div className="flex justify-between mb-4 text-blue-400 font-medium text-sm">
                          <span className="truncate pr-4">{T.media_discount}</span>
                          <span className="shrink-0">- {formatMoney(financials.mediaDisc)}</span>
                        </div>
                      )}
                      
                      {financials.pixDisc > 0 && (
                        <div className={`flex justify-between mb-4 font-medium text-sm ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          <span className="truncate pr-4">{T.pix_discount}</span>
                          <span className="shrink-0">- {formatMoney(financials.pixDisc)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-end pt-8 mt-6 border-t border-solid border-blue-500/20">
                        <span className={`text-xs uppercase tracking-widest font-bold pb-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.total_label}</span>
                        <div className="text-right">
                          <span className={`text-4xl md:text-5xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-blue-400 to-indigo-400' : 'from-blue-600 to-indigo-600'}`}>
                            {formatMoney(financials.total)}
                          </span>
                          <div className={`flex items-center justify-end gap-1.5 text-[9px] uppercase tracking-widest font-bold mt-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                            <Icon name="sparkles" size={12} /> +{estimatedXP} XP GARANTIDOS
                          </div>
                        </div>
                      </div>
                      
                      <div className={`mt-8 p-5 rounded-2xl border flex items-start gap-4 text-xs font-medium leading-relaxed ${isDark ? 'bg-zinc-900/50 border-zinc-800/60 text-zinc-400' : 'bg-blue-50/50 border-blue-100 text-blue-800'}`}>
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-blue-100 text-blue-600'}`}>
                            <Icon name="car" size={20} />
                          </div>
                          <span className="mt-1">{T.uber_notice}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Cupom Section */}
                  <div className={`p-8 rounded-[2rem] border shadow-sm ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-slate-100'}`}>
                    <h3 className={`text-lg font-playfair font-medium mb-5 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                      {T.coupon_section}
                    </h3>
                    
                    <div className="flex gap-3 mb-5">
                      <input type="text" value={manualCouponInput} onChange={(e) => setManualCouponInput(e.target.value)} placeholder="Código" className={`flex-1 min-w-0 h-[56px] px-5 rounded-2xl text-sm outline-none font-mono uppercase transition-all duration-300 bg-transparent border ${isDark ? 'border-zinc-800/80 focus:border-blue-500 text-zinc-100 placeholder:text-zinc-600' : 'border-slate-300 focus:border-blue-500 text-slate-900 placeholder:text-slate-400'}`} />
                      <button onClick={applyManualCoupon} className={`px-6 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 ${isDark ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/20' : 'bg-slate-900 text-white hover:bg-black shadow-md shadow-slate-900/20'}`}>Aplicar</button>
                    </div>

                    {user.coupons.length > 0 && (
                      <div className={`flex flex-wrap gap-3 pt-5 border-t ${isDark ? 'border-zinc-800/40' : 'border-slate-200'}`}>
                        {user.coupons.map(c => (
                          <button key={c.id} onClick={() => setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))} className={`px-4 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm' : isDark ? 'bg-transparent border-zinc-700/80 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 shadow-sm'}`}>
                            {c.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Media Permission */}
                  <div className={`p-8 rounded-[2rem] border shadow-sm ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-slate-100'}`}>
                      <div className="flex items-start gap-5">
                        <div className={`mt-1 p-3 rounded-full shrink-0 ${isDark ? 'bg-zinc-800/80 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}><Icon name={booking.mediaAllowed ? 'camera' : 'video'} size={24} /></div>
                        <div className="flex-1 min-w-0">
                           <h3 className={`text-lg font-playfair font-medium mb-3 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.media_title}</h3>
                           <p className={`text-xs font-light leading-relaxed mb-5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.media_desc}</p>
                           <button onClick={() => setBooking(b => ({ ...b, mediaAllowed: !b.mediaAllowed }))} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 text-[10px] font-bold uppercase tracking-widest min-h-[56px] ${booking.mediaAllowed ? 'bg-blue-600/10 border-blue-500 text-blue-500' : isDark ? 'bg-transparent border-zinc-800/80 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200' : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400 shadow-sm'}`}>
                              <span className="truncate pr-4">{booking.mediaAllowed ? 'Apoio Concedido' : 'Apoiar o Trabalho'}</span>
                              {booking.mediaAllowed ? <div className="flex items-center gap-1.5 shrink-0"><Icon name="check" size={16} /></div> : <span className={`text-[9px] px-3 py-1.5 rounded-full whitespace-nowrap shrink-0 ${isDark ? 'bg-zinc-800/80 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>{T.media_bonus}</span>}
                           </button>
                        </div>
                      </div>
                  </div>
                  
                  {/* Payment */}
                  <div className={`p-8 rounded-[2rem] border shadow-sm ${isDark ? 'bg-zinc-900/30 border-zinc-800/50' : 'bg-white border-slate-100'}`}>
                    <h3 className={`text-lg font-playfair font-medium mb-5 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{T.payment_title}</h3>
                    <div className="space-y-4">
                      {[
                        { id: 'pix', label: 'Pix (3% de cuidado)', icon: 'smartphone' },
                        { id: 'card', label: 'Cartão', icon: 'credit-card' },
                        { id: 'money', label: 'Dinheiro', icon: 'banknote' }
                      ].map(p => (
                        <button key={p.id} onClick={() => setBooking(b => ({ ...b, payment: p.id }))} className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 min-h-[64px] ${booking.payment === p.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20 scale-[1.02]' : isDark ? 'bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm'}`}>
                          <Icon name={p.icon} size={24} className="shrink-0" />
                          <span className="text-[11px] font-bold uppercase tracking-widest flex-1 text-left truncate">{p.label}</span>
                          <div className={`w-6 h-6 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-colors ${booking.payment === p.id ? 'border-white bg-blue-500' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                             {booking.payment === p.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Terms */}
                  <div onClick={() => setTermsOpen(true)} className={`flex items-center justify-between p-6 md:p-8 rounded-[2rem] border cursor-pointer transition-all duration-400 ${booking.termsAccepted ? 'bg-emerald-500/10 border-emerald-500/40' : isDark ? 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/80' : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                    <div className="flex items-center gap-5 min-w-0 pr-4">
                      <div className={`shrink-0 ${booking.termsAccepted ? 'text-emerald-500' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name="heart" size={28} /></div>
                      <div className="min-w-0">
                        <span className={`text-base font-medium block mb-1 truncate font-playfair ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{T.terms_title}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest truncate block ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Ler e confirmar</span>
                      </div>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted })); }} className={`w-10 h-10 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-all ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                      {booking.termsAccepted && <Icon name="check" size={20} />}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {step === 4 && (
            <section className="min-h-[65vh] flex flex-col items-center justify-center text-center animate-fade-in max-w-lg mx-auto px-4">
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full scale-[1.5] animate-pulse" />
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center border-[4px] shadow-2xl shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-blue-500' : 'bg-white border-slate-100 text-blue-600'}`}>
                  <Icon name="check" size={40} />
                </div>
              </div>
              <h2 className={`text-4xl md:text-5xl font-playfair font-medium mb-6 leading-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-base font-light leading-relaxed mb-12 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.success_sub}</p>
              
              <div className="flex flex-col gap-5 w-full">
                <Button variant="whatsapp" size="lg" full icon="message" onClick={() => window.open(generateWhatsAppLink(), '_blank')}>{T.whatsapp_btn}</Button>
                <Button variant="secondary" size="lg" full icon="copy" onClick={copyToClipboard}>Guardar Resumo</Button>
                <button onClick={() => { setStep(0); setBooking({ ...booking, item: null, type: 'single', termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false }); }} className={`mt-6 text-[10px] font-bold uppercase tracking-widest transition-colors py-4 ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {/* Footer Navigation Acolhedora & Mobile-First */}
      {step > 0 && step < 4 && booking.item && (
        <nav className="fixed bottom-0 left-0 right-0 p-4 md:p-8 z-40 animate-fade-in pointer-events-none">
          <div className={`max-w-3xl mx-auto rounded-[2rem] p-3 md:p-4 border backdrop-blur-3xl pointer-events-auto flex justify-between items-center transition-all shadow-2xl ${isDark ? 'bg-zinc-950/80 border-zinc-800/80 shadow-black/80' : 'bg-white/90 border-slate-200/80 shadow-slate-300/60'}`}>
            <button onClick={() => { setStep(s => s - 1); }} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-colors border border-transparent shrink-0 ${isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-800/80 hover:border-zinc-700' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-200'}`} aria-label="Voltar Etapa">
              <Icon name="chevron-left" size={24} />
            </button>
            
            <div className="flex-1 flex flex-col items-center justify-center min-w-0 px-4">
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-1 truncate w-full text-center ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{step === 3 ? T.total_label : T.subtotal}</p>
              <p className={`text-xl md:text-2xl font-playfair font-semibold truncate w-full text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{step === 3 ? formatMoney(financials.total) : formatMoney(financials.sub)}</p>
            </div>
            
            <Button onClick={handleNextStep} disabled={!isStepValid()} size="md" className="!rounded-2xl shrink-0" ariaLabel={step === 3 ? T.finish_btn : T.next_btn}>
              <span className="hidden sm:inline">{step === 3 ? T.finish_btn : T.next_btn}</span>
              <span className="inline sm:hidden">{step === 3 ? 'Confirmar' : 'Avançar'}</span>
              <Icon name="chevron-right" size={20} className="ml-1 md:ml-2" />
            </Button>
          </div>
        </nav>
      )}
      
      {/* Modal Termos de Acolhimento */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-2xl max-h-[85vh] rounded-[2rem] p-8 md:p-12 flex flex-col border shadow-2xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100'}`}>
            <button onClick={() => setTermsOpen(false)} className={`absolute top-6 right-6 p-3 rounded-full transition-colors shrink-0 ${isDark ? 'hover:bg-zinc-900/80 text-zinc-500' : 'hover:bg-slate-50 text-slate-400'}`} aria-label="Fechar"><Icon name="x" size={24} /></button>
            <h3 className={`text-2xl md:text-3xl font-playfair font-medium mb-8 text-center shrink-0 pr-8 ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{T.rules_complete}</h3>
            <div className="space-y-4 overflow-y-auto scrollbar-hide mb-8">
              {DATA.rules.map((rule, i) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className="shrink-0 pt-6 border-t border-zinc-800/40">
              <Button full size="lg" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Popups de Boas-Vindas */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-md rounded-[2rem] p-10 text-center border shadow-2xl ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-slate-100'}`}>
            <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-8 border-[4px] shadow-inner shrink-0 ${isDark ? 'bg-zinc-900 border-zinc-800 text-blue-500' : 'bg-slate-50 border-slate-100 text-blue-600'}`}><Icon name="heart" size={36} /></div>
            <h3 className={`text-3xl font-playfair font-medium mb-4 leading-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-sm font-light leading-relaxed mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.welcome_popup_msg}</p>
            <div className={`p-6 rounded-3xl border mb-8 border-dashed ${isDark ? 'bg-blue-900/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>SEU PRIMEIRO MIMO</p>
              <p className={`text-3xl font-playfair font-semibold tracking-wide break-all ${isDark ? 'text-white' : 'text-slate-900'}`}>PAUSA10</p>
            </div>
            <Button full size="lg" onClick={() => {
              setWelcomePopup(false);
              setUser(u => ({ ...u, hasSeenWelcome: true }));
              const welcomeCoupon = { id: 'welcome', val: 10, title: '🎁 PAUSA10', code: 'PAUSA10' };
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-md rounded-[2rem] p-10 text-center border shadow-2xl overflow-hidden ${isDark ? 'bg-zinc-950 border-amber-500/30 shadow-amber-900/30' : 'bg-white border-slate-100 shadow-amber-500/20'}`}>
            <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />
            <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-amber-500/30 animate-bounce shrink-0 relative z-10 text-white"><Icon name="trophy" size={40} /></div>
            <h3 className={`text-4xl font-playfair font-medium mb-4 relative z-10 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-base font-light leading-relaxed mb-10 relative z-10 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.levelup_popup_msg}</p>
            <button onClick={() => setLevelUpPopup(false)} className={`w-full min-h-[64px] rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 relative z-10 shrink-0 ${isDark ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-amber-900/50' : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/40'}`}>
              Receber minha conquista
            </button>
          </div>
        </div>
      )}
    </>
  );
}
