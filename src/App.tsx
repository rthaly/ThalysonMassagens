import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 0. GUIA DE CORES E ESTILOS (ADAPTADO PARA ATELIÊ)
// ==================================================================================
/*
  As cores foram ajustadas para tons que remetem à elegância e ao sagrado.
  Usei o Dourado/Âmbar (amber-600) como cor de destaque principal, trazendo
  uma sensação de ateliê premium e respeito (axé).
*/

const CONFIG = {
  PHONE: "5517991360413", // COLOQUE SEU NÚMERO AQUI
  INSTAGRAM_URL: "https://instagram.com/seu.atelie",
  STORAGE_KEY: '@atelie_axe_v1_plans', 
  PIX_KEY: "SUA_CHAVE_PIX_AQUI", 
  LOCALE_PT: 'pt-BR',
  SECRET_TOKEN: 'ATELIE_SECURE_V1',
  MAX_STORAGE_SIZE: 5000 
} as const;

const ICON_PATHS: Record<string, string> = {
  'menu': 'M4 12h16 M4 6h16 M4 18h16', 'chevron-left': 'M15 18l-6-6 6-6', 'chevron-right': 'M9 18l6-6-6-6',
  'chevron-down': 'M6 9l6 6 6-6', 'x': 'M18 6L6 18M6 6l12 12', 'check': 'M20 6L9 17l-5-5',
  'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01',
  'share': 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  'sun': 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', 'star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'sparkles': 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  'package': 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  'layers': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', 
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'truck': 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM9 16v2M16 16v2M9 22a2 2 0 100-4 2 2 0 000 4zM16 22a2 2 0 100-4 2 2 0 000 4z',
  'message': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'credit-card': 'M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  'banknote': 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z',
  'shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'award': 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
  'trophy': 'M8 21h8M12 17v4m9-13.5a2.5 2.5 0 0 0-5 0v3a2.5 2.5 0 0 0 5 0v-3zM3 7.5a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-5 0v-3zM9 4.5h6',
  'gift': 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  'camera': 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'scissors': 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'plus': 'M12 5v14 M5 12h14',
  'user': 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'shopping-bag': 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0'
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
interface ProductItem { id: string; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; popular?: boolean; }
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; loc: string; t: string; s: number; serv: string; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { street: string; number: string; district: string; city: string; comp: string; cep: string; }
interface OrderData { type: 'single' | 'pack'; cart: ProductItem[]; extras: Record<string, boolean>; deliveryType: 'correios' | 'retirada' | 'motoboy'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; orderId: string; mediaAllowed: boolean; measurements: string; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// 3. COMPONENTES DE UI
// ==================================================================================

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.98] gap-2 shrink-0";
  const variants = {
    primary: "bg-amber-600 text-white hover:bg-amber-500 shadow-xl shadow-amber-900/20 hover:-translate-y-1",
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
          <h2 className="text-2xl font-playfair font-medium">Menu Central</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-500/20 transition-colors" aria-label="Fechar menu"><Icon name="x" size={24} /></button>
        </div>
        
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-amber-800 to-amber-950 text-white shadow-xl border border-amber-700/50">
          <p className="text-[10px] opacity-90 uppercase font-bold tracking-widest mb-2 text-amber-100">Seus Pontos de Axé</p>
          <div className="flex justify-between items-end">
             <span className="text-3xl font-light font-playfair text-white">{user.xp} <span className="text-[10px] font-bold text-amber-400 font-sans tracking-widest uppercase">XP</span></span>
             <Icon name="award" size={28} className="text-amber-400" />
          </div>
          <p className="text-[9px] text-amber-200/70 mt-4 font-light leading-snug border-t border-amber-700/50 pt-3">
            * Seus pontos geram descontos exclusivos nas próximas encomendas.
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
          
          <button onClick={() => { if(navigator.share) navigator.share({title: 'Ateliê Axé', text: 'Conheça essas roupas maravilhosas para sua religião.', url: window.location.href}) }} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors mt-2 ${isDark ? 'hover:bg-zinc-800 text-white' : 'hover:bg-slate-100 text-slate-900'}`}>
            <div className="flex items-center gap-4">
              <Icon name="share" size={20} className="text-emerald-400" />
              <span className="font-semibold text-sm">Indicar o Ateliê</span>
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
        : 'bg-amber-600/10 border-2 border-amber-500 shadow-amber-500/30 -translate-y-2';
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
        <div className={`absolute -top-3 left-6 md:left-8 text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md ${isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 border border-amber-400/30' : 'bg-gradient-to-r from-amber-600 to-orange-600 border border-amber-400/30'}`}>
          ✦ Mais Pedido
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
      {icon && !multiline && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-500' : isDark ? 'text-zinc-400 group-focus-within:text-amber-400' : 'text-slate-500 group-focus-within:text-amber-600'}`}><Icon name={icon} size={20} /></div>}
      
      {multiline ? (
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={4} className={`w-full p-4 rounded-2xl outline-none text-sm font-medium transition-all bg-transparent resize-none ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:bg-zinc-900/80' : 'border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-600 focus:bg-amber-50/50'}`} />
      ) : (
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-14 rounded-2xl outline-none text-sm font-medium transition-all bg-transparent ${icon ? 'pl-11 pr-4' : 'px-4'} ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-amber-500 focus:bg-zinc-900/80' : 'border border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-amber-600 focus:bg-amber-50/50'}`} />
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
      <Icon name="package" size={12} className="shrink-0" />
      {review.serv}
    </div>

    <p className={`text-sm leading-relaxed md:leading-loose font-light italic flex-1 ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>"{review.t}"</p>
  </article>
));

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 md:py-6 flex items-center justify-between text-left group" aria-expanded={isOpen}>
        <span className={`text-sm md:text-base font-medium pr-4 leading-snug ${isDark ? 'text-white group-hover:text-amber-300' : 'text-slate-900 group-hover:text-amber-700'}`}>{q}</span>
        <span className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-amber-400' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}><Icon name="chevron-down" size={20} /></span>
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
// 4. LÓGICA DE DADOS E GERAÇÃO DE TEXTOS (ADAPTADO PARA ROUPAS E ENCOMENDAS)
// ==================================================================================
const sanitizeInput = (value: string): string => String(value || '').replace(/[<>&"']/g, '');
const validateAddress = (address: Address): boolean => !!(address.street && address.number && address.district && address.city);

const getFullReviews = (): Review[] => {
  return [
    { n: "Camila", loc: "São Paulo - SP", t: "A saia de ração tem um caimento perfeito, o algodão é de altíssima qualidade. Deu pra sentir o carinho na confecção.", serv: "Saia Branca de Ração", s: 5 },
    { n: "Marcos", loc: "Salvador - BA", t: "Comprei o conjunto completo para minha obrigação. Chegou dentro do prazo e as medidas vieram exatas! Muito axé nas mãos de quem costura.", serv: "Conjunto Masculino Luxo", s: 5 },
    { n: "Juliana", loc: "Rio de Janeiro - RJ", t: "O bordado do Pano da Costa é a coisa mais linda que já vi. Atendimento impecável e atencioso.", serv: "Pano da Costa Bordado", s: 5 },
    { n: "Rodrigo", loc: "Belo Horizonte - MG", t: "Bata super confortável, o tecido não esquenta. Perfeito para os dias longos de função no terreiro.", serv: "Bata Tradicional", s: 5 }
  ];
};

const getData = () => {
  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: "Filho(a) de Fé" },
      { level: 2, xpNeeded: 200, reward: 15, title: "Caminho de Ouro" },
      { level: 3, xpNeeded: 500, reward: 30, title: "Raiz Forte" },
      { level: 4, xpNeeded: 1000, reward: 50, title: "Coroa de Luz" }
    ],
    services: [
      { id: 'saia_branca', price: 120, icon: "scissors", tag: "PRONTA ENTREGA", title: "Saia de Ração Branca", desc: "Clássica, roda ampla (3 a 5 metros) e confortável. Ideal para o dia a dia e funções no terreiro.", details: "Tecido: Percal ou Algodão Crú\nElástico e cordão na cintura para ajuste\nRoda tradicional de 4 metros\nAcabamento resistente para lavagens frequentes" },
      { id: 'bata_masculina', price: 90, icon: "user", tag: "BÁSICO ESSENCIAL", title: "Bata Branca Tradicional", desc: "Bata masculina de gola careca ou V, folgada e muito fresca para as giras.", details: "Tecido: Oxfordine ou Algodão\nCorte solto que não prende os movimentos\nCosturas reforçadas\nTamanhos do P ao EXG" },
      { id: 'pano_costa', price: 150, icon: "sparkles", tag: "SOB ENCOMENDA", title: "Pano da Costa Bordado", desc: "Elegância e tradição. Pano da costa com acabamentos em renda guipir ou bordado inglês.", details: "Tecido maleável com excelente caimento\nDetalhes em renda na cor desejada\nFeito sob encomenda (Prazo: 10 dias)\nTamanho padrão ou sob medida" },
      { id: 'saia_luxo', price: 280, popular: true, icon: "star", tag: "ALTA COSTURA", title: "Saia Armada de Luxo", desc: "Para dias de festa e saída de santo. Saia com babados, rendas e muito volume.", details: "Até 8 metros de roda\nAcabamentos com fitas de cetim e renda luxo\nPossui forro para não ficar transparente\nPrazo de confecção: 15 dias úteis" },
      { id: 'conjunto_masculino', price: 180, icon: "layers", tag: "COMPLETO", title: "Conjunto Masculino (Calça + Bata)", desc: "Conjunto completo (Calçolão e Bata) feito em algodão de alta qualidade.", details: "Calçolão com elástico confortável\nBata com detalhes discretos nas mangas\nFeito para durar muito tempo\nOpção de branco ou cores (consultar disponibilidade)" },
      { id: 'oja', price: 45, icon: "sun", tag: "ACESSÓRIOS", title: "Ojá / Pano de Cabeça", desc: "Ojá longo e resistente para amarrações firmes e bonitas.", details: "Comprimento: 2,5 metros a 3 metros\nLargura ideal para dobraduras\nAcabamento simples ou rendado nas pontas" }
    ] as ProductItem[],
    plans: [
      { id: 'combo_iniciante', type: 'pack', title: "Kit Abian (Completo)", price: 250, fullPrice: 300, savings: 50, desc: "O essencial para quem está começando. Tudo que você precisa com um desconto especial.", details: "1x Saia de Ração (ou Calçolão)\n1x Bata Branca\n1x Ojá/Pano de Cabeça\n1x Pano da Costa simples", tag: "CUSTO BENEFÍCIO", icon: "package" },
      { id: 'combo_festa', type: 'pack', title: "Combo Saída de Santo", price: 450, fullPrice: 520, savings: 70, desc: "Conjunto premium de alta costura para momentos inesquecíveis.", details: "1x Saia de Luxo (com roda dupla e rendas)\n1x Pano da Costa Bordado\n1x Ojá com acabamento em guipir\nAtendimento prioritário na confecção", tag: "LUXO", icon: "award" }
    ] as ProductItem[],
    extras: [
      { id: 'bordado_nome', price: 30, icon: "✨", isEmoji: true, label: "Bordar Nome / Orixá", desc: "Bordado personalizado em uma das peças." },
      { id: 'renda_extra', price: 45, icon: "🧵", isEmoji: true, label: "Renda Guipir Extra", desc: "Adicionar detalhes de luxo na barra da saia ou calça." },
      { id: 'urgencia', price: 60, icon: "⏱️", isEmoji: true, label: "Taxa de Urgência", desc: "Fura-fila: Produção em até 5 dias úteis." }
    ],
    faq: [
      { q: "Qual o prazo de confecção das peças?", a: "Peças a pronta entrega são enviadas em até 2 dias úteis. Peças sob encomenda (como Saias de Luxo ou Panos Bordados) levam de 10 a 15 dias úteis para confecção." },
      { q: "Como faço para passar minhas medidas?", a: "No próximo passo da sua sacola, você terá um campo de observações. Nele, você pode colocar seus tamanhos (P, M, G, GG) ou, se preferir, as medidas exatas de cintura, quadril e comprimento." },
      { q: "Vocês enviam para todo o Brasil?", a: "Sim! Enviamos para todo o Brasil via Correios (PAC ou Sedex) e também via transportadoras parceiras. O valor do frete é calculado no nosso WhatsApp finalizando a compra." },
      { q: "Faz roupa colorida ou de outras religiões?", a: "Sim. Produzimos roupas nas cores dos Orixás e Guias (vermelho, preto, amarelo, etc). Basta adicionar a peça no carrinho e especificar a cor desejada nas anotações." }
    ],
    rules: [
      { icon: "scissors", title: "Confecção Sob Medida", description: "Para peças sob medida, é essencial que as medidas passadas estejam corretas. Não nos responsabilizamos por erros de medição do cliente." },
      { icon: "truck", title: "Envios e Prazos", description: "O prazo de envio começa a contar após a confirmação do pagamento e da aprovação dos detalhes do modelo via WhatsApp." },
      { icon: "heart", title: "Trocas", description: "Trocamos peças com defeito de fabricação. Peças personalizadas ou feitas estritamente sob medida não possuem troca por erro de tamanho do cliente." }
    ],
    text: {
      welcome: "Bem-vindo ao Ateliê,",
      choose_sub: "Vista a sua fé com elegância e tradição. Escolha as peças que deseja e adicione à sua sacola de encomendas.",
      level_label: "Seus Pontos",
      tab_packs: "Combos & Kits",
      tab_single: "Peças Avulsas",
      next_btn: "Avançar",
      finish_btn: "Enviar Pedido via WhatsApp",
      loading: "Preparando as tramas e tecidos...",
      toast_select_item: "Adicione ao menos uma peça à sacola.",
      toast_select_delivery: "Selecione o método de entrega antes de avançar.",
      toast_fill_name: "Preencha seu nome completo.",
      toast_fill_addr: "Preencha os dados do seu endereço para a entrega.",
      toast_accept_terms: "Leia e aceite nossa política do ateliê.",
      toast_coupon_success: "Desconto ativado!",
      toast_coupon_invalid: "Este cupom não é válido ou já expirou.",
      details_label: "SOBRE A PEÇA:",
      delivery_title: "Como será a entrega e as medidas?",
      extras_title: "Quer personalizar sua peça?",
      coupon_section: "Cupons e Axé",
      payment_title: "Forma de Pagamento Preferida",
      terms_title: "Política do Ateliê",
      success_title: "Pedido Montado!",
      success_sub: "O WhatsApp está sendo aberto para enviarmos a sua sacola e calcularmos o frete ou confirmarmos as medidas.",
      whatsapp_btn: "Tentar Abrir WhatsApp Novamente",
      back_home: "Voltar e editar peças",
      input_name: "Seu Nome Completo",
      input_addr: "Endereço (Rua, Avenida)",
      input_num: "Número",
      input_district: "Bairro",
      input_city: "Cidade e Estado (Ex: SP - SP)",
      input_comp: "Complemento",
      input_cep: "CEP",
      input_measurements: "Tamanhos ou Medidas (Ex: Saia Tam M, Bata Tam G, ou Cintura 80cm, Quadril 100cm)",
      agree_terms: "Estou ciente dos prazos de confecção e políticas do ateliê",
      faq_title: "Dúvidas Frequentes",
      reviews_title: "Quem já veste nossa arte:",
      total_label: "Total da Sacola",
      subtotal: "Soma das Peças",
      pix_discount: "Desconto PIX (5%)",
      welcome_popup_title: "Muito Axé para Você!",
      welcome_popup_msg: "Ficamos felizes em vestir a sua fé. Cada peça aqui é feita com muito respeito e dedicação. Aqui está um presente para a sua primeira encomenda.",
      welcome_popup_warning: "⚠️ Seus pontos e cupons ficam salvos neste celular. Não limpe os dados do navegador para não perder seus benefícios!",
      levelup_popup_title: "Novo Patamar!",
      levelup_popup_msg: "Você alcançou um novo nível de cliente no nosso ateliê! Ganhando novos descontos para suas roupas.",
      get_coupon: "Resgatar Meu Presente",
      rules_complete: "Políticas do Ateliê",
      media_discount: "Desconto Portfólio (2%)",
      media_title: "Permitir Foto da Peça",
      media_desc: "Autoriza que tiremos fotos da sua peça (apenas da roupa no manequim) para postarmos no nosso Instagram? Você ganha 2% OFF.",
      media_bonus: "Ganhar 2% OFF",
    },
    reviews: getFullReviews()
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
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 154, lastActivity: new Date().toISOString()
  });
  
  const [order, setOrder] = useState<OrderData>({
    type: 'single', cart: [], extras: {}, deliveryType: 'correios', 
    address: { street: '', number: '', district: '', city: '', comp: '', cep: '' }, 
    payment: 'pix', appliedCoupon: null, termsAccepted: false, orderId: `PED_${Date.now()}`, mediaAllowed: false, measurements: ''
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
        document.title = step === 0 ? "Ateliê Axé & Vestuário" : "Sua Encomenda - Ateliê";
    }
  }, [step, isClient]);
  
  useEffect(() => {
    if (!isClient) return;
    let loadedUser = { ...user };
    let loadedOrder = { ...order };
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
            ordersCount: typeof parsed.user.ordersCount === 'number' ? Math.max(parsed.user.ordersCount, 154) : 154,
            lastActivity: parsed.user.lastActivity || new Date().toISOString()
          };
        }
        
        if (parsed.orderDraft && Array.isArray(parsed.orderDraft.cart)) {
            loadedOrder = {
              ...order,
              ...parsed.orderDraft,
              cart: parsed.orderDraft.cart || [],
              extras: typeof parsed.orderDraft.extras === 'object' && parsed.orderDraft.extras !== null ? parsed.orderDraft.extras : {},
            };
            if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) {
              loadedStep = parsed.step;
            }
        }
      }
    } catch (e) {
      console.error('Cache inválido, iniciando limpo.', e);
    }
    
    setUser(loadedUser);
    setOrder(loadedOrder);
    setStep(loadedStep);
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 800);
  }, [isClient, DATA.services, DATA.plans]);
  
  useEffect(() => {
    if (isClient && dataLoaded) {
      try {
        const saveData = {
          user: { ...user, lastActivity: new Date().toISOString() },
          orderDraft: { ...order, appliedCoupon: order.appliedCoupon ? { id: order.appliedCoupon.id, val: order.appliedCoupon.val, title: order.appliedCoupon.title, code: order.appliedCoupon.code } : null },
          step
        };
        const serialized = JSON.stringify(saveData);
        if (serialized.length < CONFIG.MAX_STORAGE_SIZE * 1024) { localStorage.setItem(CONFIG.STORAGE_KEY, serialized); }
      } catch (e) {}
    }
  }, [user, order, step, isClient, dataLoaded]);
  
  useEffect(() => {
    if (!loading && isClient && dataLoaded) {
      if (!user.hasSeenWelcome && !welcomePopup) {
        const timer = setTimeout(() => setWelcomePopup(true), 2000);
        return () => clearTimeout(timer);
      } 
      else if (user.hasSeenWelcome && order.cart.length > 0) {
        addToast("Sua sacola salva foi carregada! 🛍️", "success");
      }
    }
  }, [loading, isClient, dataLoaded]);
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  
  const handleToggleCartItem = useCallback((item: ProductItem) => {
    setOrder(prev => {
      const exists = prev.cart.find(c => c.id === item.id);
      let newCart;
      if (exists) {
        newCart = prev.cart.filter(c => c.id !== item.id);
      } else {
        newCart = [...prev.cart, item];
      }
      return { ...prev, cart: newCart, payment: 'pix', termsAccepted: false, orderId: prev.orderId || `PED_${Date.now()}` };
    });
    addToast(`Item adicionado/removido da sacola.`, "success");
  }, [addToast]);

  const financials = useMemo(() => {
    if (order.cart.length === 0) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0 };
    
    let sub = 0;
    order.cart.forEach(item => { sub += item.price; });

    Object.keys(order.extras || {}).forEach(k => { 
      if (order.extras[k]) { 
        const extData = DATA.extras.find(e => e.id === k); 
        if (extData) { sub += extData.price; }
      } 
    });

    const disc = order.appliedCoupon ? order.appliedCoupon.val : 0;
    let runningTotal = Math.max(0, sub - disc);
    
    let mediaDisc = 0;
    if (order.mediaAllowed) { mediaDisc = Math.ceil(runningTotal * 0.02); runningTotal = Math.max(0, runningTotal - mediaDisc); }
    
    let pixDisc = 0;
    if (order.payment === 'pix') { pixDisc = Math.ceil(runningTotal * 0.05); } // 5% PIX no Ateliê
    
    const finalTotal = Math.max(0, runningTotal - pixDisc);
    
    return { sub, disc, pixDisc, mediaDisc, total: finalTotal };
  }, [order.cart, order.extras, order.appliedCoupon, DATA.extras, order.payment, order.mediaAllowed]);
  
  const estimatedXP = useMemo(() => Math.floor(financials.total * 0.20), [financials.total]);
  
  const generateWhatsAppMsg = () => {
    const f = financials; 
    const securityHash = btoa(encodeURIComponent(`${f.total}-${order.cart[0]?.id || ''}-${CONFIG.SECRET_TOKEN}`)).substring(0, 8).toUpperCase();
    
    const productsListText = order.cart.map(item => `🛍️ *${item.title}*\n_R$ ${item.price.toFixed(2)}_`).join('\n\n');
    
    let locTxt = ""; 
    if (order.deliveryType === 'correios') { 
      locTxt = `📦 *Envio (Correios/Transportadora)*\n📍 ${order.address.street}, ${order.address.number} - ${order.address.district}\nCidade: ${order.address.city} | CEP: ${order.address.cep}\nComplemento: ${order.address.comp || '-'}`; 
    }
    else { 
      locTxt = `🏪 *Retirada no Ateliê/Motoboy Local*`; 
    }
    
    const extrasList = Object.keys(order.extras || {}).filter(k => (order.extras || {})[k]).map(k => { 
      const ex = DATA.extras.find(e => e.id === k); 
      return ex ? `➕ ${ex.label}` : ''; 
    }).filter(Boolean).join('\n');
    
    let priceDetails = `💵 *Soma das Peças:* R$ ${f.sub.toFixed(2).replace('.', ',')}`;
    if (f.disc > 0) priceDetails += `\n🎁 *Cupom (${order.appliedCoupon?.code}):* -R$ ${f.disc.toFixed(2).replace('.', ',')}`;
    if (f.mediaDisc > 0) priceDetails += `\n📸 *Desconto Portfólio:* -R$ ${f.mediaDisc.toFixed(2).replace('.', ',')}`;
    if (f.pixDisc > 0) priceDetails += `\n💸 *Desconto PIX (5%):* -R$ ${f.pixDisc.toFixed(2).replace('.', ',')}`;
    priceDetails += `\n\n💰 *VALOR FINAL DAS PEÇAS: R$ ${f.total.toFixed(2).replace('.', ',')}*\n_(Frete a calcular caso seja envio)_`;

    let msg = `
*NOVA ENCOMENDA* | #${securityHash}
──────────────────
Olá! Gostaria de fechar meu pedido.

👤 *Nome:* ${sanitizeInput(user.name)}

👗 *O QUE ESCOLHI:*
${productsListText}
${extrasList ? `\n*Personalizações:*\n${extrasList}\n` : ''}
📏 *TAMANHOS E MEDIDAS:*
${order.measurements ? order.measurements : 'A definir no chat'}

📍 *ENTREGA:*
${locTxt}

💰 *RESUMO DO INVESTIMENTO:*
${priceDetails}

💳 *Forma de Pagamento:* ${order.payment.toUpperCase()}
──────────────────
_Aceito as políticas do ateliê (prazos de confecção e envios). Aguardo o valor do frete e a chave PIX/Link para pagamento!_
    `.trim();

    return msg;
  };
  
  const isStepValid = useCallback(() => {
    if (step === 0) return order.cart.length > 0;
    if (step === 1) return order.deliveryType;
    if (step === 2) {
      if (!user.name || String(user.name).trim().length < 3) return false;
      if (order.deliveryType === 'correios') return validateAddress(order.address);
      return true;
    }
    if (step === 3) return !!(order.payment && order.termsAccepted);
    return true;
  }, [step, order, user.name]);
  
  const handleNextStep = useCallback(() => {
    if (!isStepValid()) {
      if (step === 0) addToast(T.toast_select_item, "error");
      if (step === 1) addToast(T.toast_select_delivery, "error");
      if (step === 2) addToast(T.toast_fill_addr, "error");
      if (step === 3) addToast(T.toast_accept_terms, "error");
      return;
    }
    if (step === 3) finishBooking(); 
    else setStep(s => s + 1);
  }, [step, order, user.name, T, addToast, isStepValid]);
  
  const finishBooking = () => {
    let updatedCoupons = [...user.coupons]; 
    let updatedHistory = [...user.usedCoupons];
    
    if (order.appliedCoupon && order.appliedCoupon.id !== 'manual') {
      if (!updatedHistory.includes(order.appliedCoupon.code)) updatedHistory.push(order.appliedCoupon.code);
      updatedCoupons = updatedCoupons.filter(c => c.code !== order.appliedCoupon?.code);
    }
    
    const newXP = user.xp + estimatedXP; 
    let leveledUp = false; 
    
    DATA.levels.forEach(lvl => {
      if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) { 
        leveledUp = true; 
        updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 Recompensa: ${lvl.title}`, code: `LVLUP${lvl.level}` }); 
      }
    });

    setUser(prev => ({ 
      ...prev, xp: newXP, coupons: updatedCoupons, usedCoupons: updatedHistory, 
      ordersCount: (prev.ordersCount || 154) + 1, lastActivity: new Date().toISOString() 
    }));
    
    if (leveledUp) { 
      setLevelUpPopup(true); 
    }
    
    openExternal('whatsapp', generateWhatsAppMsg());
    setStep(4);
  };

  if (!isClient) return <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center" />;

  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] transition-colors duration-700 ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center max-w-sm w-full px-8">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-4xl font-playfair mb-8 md:mb-10 animate-pulse shadow-2xl shadow-amber-500/20 border border-amber-400/20">
            A
          </div>
          <div className="w-full h-1.5 md:h-2 bg-zinc-800/50 overflow-hidden mb-4 rounded-full">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%', animation: 'loading-bar 2s ease-in-out infinite' }}></div>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-widest opacity-70 text-white">{T.loading}</p>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@keyframes loading-bar { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`}} />
      </div>
    );
  }
  
  return (
    <>
      <GlobalStyles isDark={isDark} />
      <div className={`fixed inset-0 z-[-1] pointer-events-none transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`} aria-hidden="true" />
      
      <div className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div key={t.id} role="alert" className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl md:rounded-2xl border backdrop-blur-2xl shadow-2xl animate-fade-in ${t.type === 'success' ? isDark ? 'bg-zinc-800/90 border-zinc-700 text-white' : 'bg-white/95 border-slate-200 text-slate-800' : 'bg-red-500/95 border-red-500 text-white'}`}>
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={20} className="shrink-0" />
            <span className="text-xs font-semibold tracking-wide leading-snug">{t.msg}</span>
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
                  Ateliê Axé <br className="block sm:hidden" /> & Vestuário
                </h1>
                <div className={`flex items-center gap-2 text-[9px] md:text-[10px] uppercase tracking-widest mt-2 md:mt-3 font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <span className="relative flex h-2 w-2 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>
                  Mais de {user.ordersCount || 154} peças confeccionadas
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={() => openExternal('instagram')} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700 text-pink-400' : 'bg-white border-slate-200 text-pink-600'}`}>
                   <Icon name="instagram" size={20} />
                </button>
                <button onClick={() => setMenuOpen(true)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
                   <Icon name="menu" size={20} />
                </button>
              </div>
            </div>
            
            {step > 0 && step < 4 && (
              <div className="mt-8 flex items-center justify-between gap-3 max-w-sm mx-auto">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className={`w-full h-1 rounded-full transition-all duration-700 ${step >= i ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                    <span className={`text-[8px] font-bold uppercase tracking-widest transition-colors ${step >= i ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                      {i === 1 ? 'Medidas' : i === 2 ? 'Dados' : 'Sacola'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </header>
        )}
        
        <div className="space-y-12 md:space-y-16">
          {step === 0 && (
            <section className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-2">
                <div>
                  <h2 className={`text-3xl md:text-5xl font-playfair font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.welcome} <span className="italic text-amber-500">{user.name ? String(user.name).trim().split(' ')[0] : "Axé"}.</span>
                  </h2>
                  <p className={`text-sm md:text-lg font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                    {T.choose_sub}
                  </p>
                </div>
              </div>
              
              <div className={`flex p-1.5 rounded-2xl border max-w-sm mx-auto shadow-inner ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-slate-100/80 border-slate-200'}`}>
                <button onClick={() => setActiveTab('single')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'single' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.4)] scale-[1.03] border border-amber-400' : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500'}`}>
                  <Icon name="scissors" size={16} /> {T.tab_single}
                </button>
                <button onClick={() => setActiveTab('packs')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'packs' ? 'bg-amber-600 text-white shadow-[0_0_20px_rgba(217,119,6,0.4)] scale-[1.03] border border-amber-400' : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500'}`}>
                  <Icon name="package" size={16} /> {T.tab_packs}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ProductItem) => {
                  const isInCart = order.cart.some(cartItem => cartItem.id === s.id);
                  const isPremiumCard = s.type === 'pack' || activeTab === 'packs';
                  
                  return (
                  <Card key={s.id} active={isInCart} onClick={() => handleToggleCartItem(s)} isDark={isDark} popular={s.popular} isPremium={isPremiumCard}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6 gap-3">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-white border-slate-300 text-slate-800'}`}>
                          <Icon name={s.icon} size={24} isEmoji={s.isEmoji} />
                        </div>
                        <div className="text-right min-w-0 flex-1 flex flex-col items-end relative">
                          {isInCart && (
                            <div className="absolute -top-2 -right-2 text-white w-6 h-6 flex items-center justify-center rounded-full animate-fade-in shadow-md bg-amber-500">
                              <Icon name="check" size={14} />
                            </div>
                          )}
                          <span className={`text-xl md:text-2xl font-playfair font-semibold w-full ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {formatMoney(s.price)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <span className={`text-[8px] font-bold uppercase tracking-widest border px-3 py-1.5 rounded-full inline-block mb-3 ${isDark ? 'bg-zinc-800 border-zinc-600 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                          {s.tag}
                        </span>
                        <h3 className={`text-lg font-playfair font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {s.title}
                        </h3>
                        <p className={`text-xs font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    
                    <div className={`pt-4 mt-auto border-t ${isDark ? 'border-zinc-700' : 'border-slate-200'}`}>
                      <div className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        <Icon name="check" size={14} className="text-amber-400 shrink-0" /> {T.details_label}
                      </div>
                      <div className={`text-[11px] space-y-2 font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        {s.details.split('\n').map((line, i) => <p key={i} className="flex items-start gap-2"><span className="text-amber-400 mt-1 text-[10px] shrink-0">•</span> <span>{line}</span></p>)}
                      </div>
                    </div>
                  </Card>
                )})}
              </div>

              <div className="py-12 relative border-t border-b border-dashed border-zinc-700 mt-12">
                <div className="flex items-center justify-between mb-8">
                  <h3 className={`text-2xl font-playfair font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.reviews_title}
                  </h3>
                </div>
                <div id="reviews-slider" className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-6 pt-2 px-4 gap-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center shrink-0 w-[85vw] sm:w-[320px] flex h-auto">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="max-w-2xl mx-auto py-10">
                <h3 className={`text-2xl font-playfair font-medium text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.faq_title}
                </h3>
                <div className={`border-t border-b ${isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                  {DATA.faq.map((item, idx) => <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />)}
                </div>
              </div>
            </section>
          )}

          {/* PASSO 1 MODIFICADO: MEDIDAS E FRETE (SEM CALENDÁRIO) */}
          {step === 1 && (
            <section className="space-y-10 animate-fade-in max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className={`text-2xl md:text-4xl font-playfair font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.delivery_title}
                </h2>
              </div>
              
              <div className={`p-6 rounded-3xl flex flex-col gap-4 border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'}`}>
                 <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Sua Sacola:</span>
                 {order.cart.map(item => (
                   <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2 last:border-0 last:pb-0 border-zinc-700/50">
                     <span className={`font-semibold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</span>
                     <span className={isDark ? 'text-zinc-300' : 'text-slate-600'}>{formatMoney(item.price)}</span>
                   </div>
                 ))}
              </div>

              <div className="pt-4">
                <h3 className={`text-xs font-bold uppercase mb-4 tracking-widest flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <Icon name="scissors" size={16} className="text-amber-500" /> Tamanhos e Medidas
                </h3>
                <div className={`p-6 rounded-3xl border shadow-sm ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'}`}>
                  <p className={`text-xs mb-4 font-light ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>Descreva abaixo o tamanho desejado para cada peça (P, M, G, GG) ou informe as medidas (Cintura, Busto/Tórax, Altura da saia).</p>
                  <InputField isDark={isDark} multiline value={order.measurements} onChange={(e: any) => setOrder(o => ({ ...o, measurements: sanitizeInput(e.target.value) }))} placeholder="Ex: Saia Branca: Tam M (ou cintura 80cm e comprimento 95cm)." />
                </div>
              </div>

              <div className="pt-4">
                <h3 className={`text-xs font-bold uppercase mb-4 tracking-widest flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <Icon name="truck" size={16} className="text-amber-500" /> Formato de Entrega
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => setOrder(b => ({ ...b, deliveryType: 'correios' }))} className={`p-5 rounded-2xl flex items-center gap-4 transition-all border ${order.deliveryType === 'correios' ? 'bg-amber-600 border-amber-400 text-white' : isDark ? 'bg-zinc-900/60 border-zinc-700 text-white hover:bg-zinc-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                    <Icon name="truck" size={24} />
                    <div className="text-left">
                      <span className="text-sm font-bold block">Envio Correios/Transp.</span>
                      <span className="text-[10px] font-light">Frete calculado no WhatsApp</span>
                    </div>
                  </button>
                  <button onClick={() => setOrder(b => ({ ...b, deliveryType: 'retirada' }))} className={`p-5 rounded-2xl flex items-center gap-4 transition-all border ${order.deliveryType === 'retirada' ? 'bg-amber-600 border-amber-400 text-white' : isDark ? 'bg-zinc-900/60 border-zinc-700 text-white hover:bg-zinc-800' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}>
                    <Icon name="map-pin" size={24} />
                    <div className="text-left">
                      <span className="text-sm font-bold block">Retirada no Ateliê</span>
                      <span className="text-[10px] font-light">Sem custo de frete</span>
                    </div>
                  </button>
                </div>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-10 animate-fade-in max-w-2xl mx-auto">
              <h2 className={`text-2xl md:text-4xl font-playfair font-medium text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Dados e Endereço
              </h2>
              
              <div className={`p-6 md:p-8 rounded-3xl border shadow-sm transition-colors ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'} space-y-6`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder="Seu nome" hasError={!user.name || String(user.name).trim().length < 3} />
                
                {order.deliveryType === 'correios' && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px] gap-4">
                      <InputField isDark={isDark} label={T.input_addr} value={order.address.street} onChange={(e: any) => setOrder(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} icon="map-pin" placeholder="Rua / Avenida" hasError={!order.address.street} />
                      <InputField isDark={isDark} label={T.input_num} value={order.address.number} onChange={(e: any) => setOrder(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Nº" hasError={!order.address.number} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField isDark={isDark} label={T.input_district} value={order.address.district} onChange={(e: any) => setOrder(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder="Seu Bairro" hasError={!order.address.district} />
                      <InputField isDark={isDark} label={T.input_cep} value={order.address.cep} onChange={(e: any) => setOrder(b => ({ ...b, address: { ...b.address, cep: sanitizeInput(e.target.value) } }))} placeholder="CEP" hasError={!order.address.cep} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <InputField isDark={isDark} label={T.input_city} value={order.address.city} onChange={(e: any) => setOrder(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder="Cidade e Estado" hasError={!order.address.city} />
                      <InputField isDark={isDark} label={T.input_comp} value={order.address.comp} onChange={(e: any) => setOrder(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder="Apto, Bloco (Opcional)" />
                    </div>
                  </div>
                )}
                
                {order.deliveryType === 'retirada' && (
                  <div className={`p-6 rounded-2xl border text-center animate-fade-in ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-300'}`}>
                    <p className={`text-sm font-light ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                      Após a finalização da peça, entraremos em contato para combinarmos o horário de retirada no Ateliê.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-4">
                <h3 className={`text-xs font-bold uppercase mb-4 tracking-widest pl-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  <Icon name="sparkles" size={16} className="text-amber-500" /> {T.extras_title}
                </h3>
                <div className="space-y-3">
                  {DATA.extras.map((ex) => {
                    const isActive = order.extras[ex.id];
                    return (
                      <div key={ex.id} onClick={() => setOrder(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${isActive ? 'bg-amber-600/20 border-amber-500' : isDark ? 'bg-zinc-900/60 border-zinc-700 hover:bg-zinc-800' : 'bg-white border-slate-300 hover:border-slate-400'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`transition-transform shrink-0`}><Icon name={ex.icon} size={24} isEmoji={ex.isEmoji} /></div>
                          <div>
                            <p className={`text-sm font-semibold ${isActive ? isDark ? 'text-amber-400' : 'text-amber-700' : isDark ? 'text-white' : 'text-slate-900'}`}>{ex.label}</p>
                            <p className={`text-[10px] font-light ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{ex.desc}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${isActive ? 'bg-amber-500 text-white' : isDark ? 'bg-zinc-700 text-white' : 'bg-slate-200 text-slate-800'}`}>
                          + {formatMoney(ex.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-8 animate-fade-in max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
                <div className={`p-6 rounded-3xl border shadow-sm flex flex-col ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-xl font-playfair font-medium mb-6 flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Icon name="shopping-bag" size={24} className="text-amber-500" /> Resumo do Pedido
                  </h3>
                  
                  <div className="space-y-3">
                    {order.cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm border-b border-zinc-700 pb-3 last:border-0 last:pb-0">
                          <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                          <span className={`font-medium ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{formatMoney(item.price)}</span>
                        </div>
                    ))}
                  </div>

                  {Object.keys(order.extras || {}).filter(k => (order.extras || {})[k]).length > 0 && (
                    <div className={`pt-4 mt-4 border-t border-zinc-700 space-y-2`}>
                      {Object.keys(order.extras || {}).filter(k => (order.extras || {})[k]).map(k => {
                        const ex = DATA.extras.find(e => e.id === k);
                        return ex ? (
                          <div key={k} className="flex justify-between text-sm">
                            <span className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
                                <Icon name="plus" size={14} className="text-amber-500" /> {ex.label}
                            </span>
                            <span className={isDark ? 'text-zinc-300' : 'text-slate-600'}>+ {formatMoney(ex.price)}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  <div className={`pt-6 mt-6 border-t border-dashed ${isDark ? 'border-zinc-600' : 'border-slate-300'}`}>
                    <div className="flex justify-between mb-3 text-sm">
                      <span className={isDark ? 'text-zinc-300' : 'text-slate-700'}>{T.subtotal}</span>
                      <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatMoney(financials.sub)}</span>
                    </div>
                    
                    {order.appliedCoupon && (
                      <div className={`my-4 p-4 rounded-2xl flex items-center justify-between border-dashed border-2 ${isDark ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-emerald-50 border-emerald-300'}`}>
                         <div className="flex items-center gap-3">
                            <Icon name="gift" size={20} className={isDark ? 'text-emerald-300' : 'text-emerald-700'} />
                            <div>
                               <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>Cupom</p>
                               <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{order.appliedCoupon.code}</p>
                            </div>
                         </div>
                         <span className={`text-lg font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>- {formatMoney(order.appliedCoupon.val)}</span>
                      </div>
                    )}

                    {financials.mediaDisc > 0 && (
                      <div className="flex justify-between mb-3 text-amber-400 font-medium text-sm">
                        <span>{T.media_discount}</span>
                        <span>- {formatMoney(financials.mediaDisc)}</span>
                      </div>
                    )}
                    
                    {financials.pixDisc > 0 && (
                      <div className={`flex justify-between mb-3 font-medium text-sm ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                        <span>{T.pix_discount}</span>
                        <span>- {formatMoney(financials.pixDisc)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-end pt-6 mt-4 border-t border-amber-500/30">
                      <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.total_label}</span>
                      <div className="text-right">
                        <span className={`text-3xl font-playfair font-semibold bg-clip-text text-transparent bg-gradient-to-r ${isDark ? 'from-amber-300 to-orange-300' : 'from-amber-600 to-orange-700'}`}>
                          {formatMoney(financials.total)}
                        </span>
                        <div className={`flex items-center justify-end gap-1 text-[8px] uppercase font-bold mt-1.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                          <Icon name="sparkles" size={10} /> +{estimatedXP} XP NA CONTA
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {user.coupons.length > 0 && (
                    <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'}`}>
                      <h3 className={`text-base font-playfair font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.coupon_section}</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.coupons.map(c => (
                          <button key={c.id} onClick={() => setOrder(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))} className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center gap-2 ${order.appliedCoupon?.id === c.id ? 'bg-emerald-600 text-white border-emerald-500' : isDark ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'}`}>
                            {order.appliedCoupon?.id === c.id && <Icon name="check" size={14} />} {c.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-full shrink-0 ${isDark ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-slate-600'}`}><Icon name={order.mediaAllowed ? 'camera' : 'instagram'} size={20} /></div>
                        <div className="flex-1 min-w-0">
                           <h3 className={`text-base font-playfair font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.media_title}</h3>
                           <p className={`text-[11px] font-light mb-4 ${isDark ? 'text-zinc-200' : 'text-slate-600'}`}>{T.media_desc}</p>
                           <button onClick={() => setOrder(b => ({ ...b, mediaAllowed: !b.mediaAllowed }))} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-[9px] font-bold uppercase ${order.mediaAllowed ? 'bg-amber-600/20 border-amber-500 text-amber-400' : isDark ? 'border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-700'}`}>
                              <span>{order.mediaAllowed ? 'Autorização Concedida' : 'Autorizar Foto'}</span>
                              {order.mediaAllowed ? <Icon name="check" size={14} /> : <span className={`text-[8px] px-2 py-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-slate-100'}`}>{T.media_bonus}</span>}
                           </button>
                        </div>
                      </div>
                  </div>
                  
                  <div className={`p-6 rounded-3xl border ${isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-base font-playfair font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.payment_title}</h3>
                    <div className="space-y-3">
                      {[ { id: 'pix', label: 'Pix (5% OFF)', icon: 'smartphone' }, { id: 'card', label: 'Cartão de Crédito', icon: 'credit-card' } ].map(p => (
                        <button key={p.id} onClick={() => setOrder(b => ({ ...b, payment: p.id }))} className={`w-full flex items-center gap-3 p-4 h-16 rounded-2xl border transition-all ${order.payment === p.id ? 'bg-amber-600 border-amber-400 text-white' : isDark ? 'bg-zinc-900/80 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-700'}`}>
                          <Icon name={p.icon} size={20} className="shrink-0" />
                          <span className="text-[10px] font-bold uppercase flex-1 text-left">{p.label}</span>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${order.payment === p.id ? 'border-white bg-amber-500' : isDark ? 'border-zinc-600' : 'border-slate-400'}`}>
                             {order.payment === p.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div onClick={() => setTermsOpen(true)} className={`flex items-center justify-between p-5 rounded-3xl border cursor-pointer transition-all ${order.termsAccepted ? 'bg-emerald-600/20 border-emerald-500/60' : isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-white border-slate-300'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`${order.termsAccepted ? 'text-emerald-400' : isDark ? 'text-white' : 'text-slate-600'}`}><Icon name="heart" size={24} /></div>
                      <div>
                        <span className={`text-sm font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.terms_title}</span>
                        <span className={`text-[9px] font-bold uppercase ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>Ler Regras e Prazos</span>
                      </div>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); setOrder(b => ({ ...b, termsAccepted: !b.termsAccepted })); }} className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${order.termsAccepted ? 'bg-emerald-600 border-emerald-500 text-white' : isDark ? 'border-zinc-600' : 'border-slate-400'}`}>
                      {order.termsAccepted && <Icon name="check" size={16} />}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
          
          {step === 4 && (
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in max-w-md mx-auto px-4">
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-emerald-500/30 blur-[50px] rounded-full scale-[1.5] animate-pulse-slow" />
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center border-[4px] shadow-xl ${isDark ? 'bg-zinc-900 border-zinc-800 text-emerald-400' : 'bg-white border-slate-200 text-emerald-600'}`}>
                  <Icon name="check" size={36} />
                </div>
              </div>
              <h2 className={`text-3xl font-playfair font-medium mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-sm font-light mb-10 ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{T.success_sub}</p>
              
              <div className="flex flex-col gap-4 w-full">
                <Button variant="whatsapp" size="lg" full icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>{T.whatsapp_btn}</Button>
                <button onClick={() => { setStep(0); setOrder({ ...order, cart: [], termsAccepted: false, appliedCoupon: null, orderId: `PED_${Date.now()}`, mediaAllowed: false }); }} className={`mt-4 text-[10px] font-bold uppercase transition-colors py-3 ${isDark ? 'text-white hover:text-zinc-300' : 'text-slate-600 hover:text-slate-800'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      
      {step >= 0 && step < 4 && order.cart.length > 0 && (
        <nav className="fixed bottom-0 left-0 right-0 p-3 md:p-6 z-40 animate-fade-in pointer-events-none">
          <div className={`max-w-3xl mx-auto rounded-[2rem] p-3 md:p-4 border backdrop-blur-3xl pointer-events-auto flex justify-between items-center transition-all shadow-2xl ${isDark ? 'bg-zinc-950/95 border-zinc-700 shadow-black/90' : 'bg-white/95 border-slate-300 shadow-slate-300/80'}`}>
            
            {step > 0 && (
               <button onClick={() => { setStep(s => s - 1); }} className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-colors border border-transparent shrink-0 ${isDark ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                 <Icon name="chevron-left" size={24} />
               </button>
            )}
            
            <div className={`flex-1 flex flex-col items-start justify-center min-w-0 px-4 ${step === 0 ? 'pl-6' : ''}`}>
              <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                {step === 0 ? `${order.cart.length} peça(s)` : step === 3 ? T.total_label : T.subtotal}
              </p>
              <p className={`text-xl font-playfair font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {step === 3 ? formatMoney(financials.total) : formatMoney(financials.sub)}
              </p>
            </div>
            
            <Button onClick={handleNextStep} disabled={!isStepValid()} size="lg" className="!h-14 !px-6 !text-[11px] shrink-0 !rounded-2xl" ariaLabel={step === 3 ? T.finish_btn : T.next_btn}>
              <span className="hidden sm:inline">{step === 3 ? T.finish_btn : T.next_btn}</span>
              <span className="inline sm:hidden">{step === 3 ? 'Finalizar' : 'Avançar'}</span>
              {step !== 3 && <Icon name="chevron-right" size={18} className="ml-1" />}
            </Button>
          </div>
        </nav>
      )}
      
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-xl max-h-[85vh] rounded-3xl p-6 flex flex-col border shadow-2xl ${isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-slate-200'}`}>
            <button onClick={() => setTermsOpen(false)} className={`absolute top-4 right-4 p-2 rounded-full ${isDark ? 'text-white' : 'text-slate-600'}`}><Icon name="x" size={20} /></button>
            <h3 className={`text-xl font-playfair font-medium mb-6 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.rules_complete}</h3>
            <div className="space-y-3 overflow-y-auto scrollbar-hide mb-6">
              {DATA.rules.map((rule, i) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className="shrink-0 pt-4 border-t border-zinc-700">
              <Button full size="lg" onClick={() => { setOrder(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}
      
      {welcomePopup && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-sm rounded-3xl p-8 text-center border shadow-2xl ${isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-white border-slate-200'}`}>
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 border-[4px] shadow-inner ${isDark ? 'bg-zinc-800 border-zinc-700 text-amber-400' : 'bg-slate-50 border-slate-100 text-amber-600'}`}><Icon name="gift" size={32} /></div>
            <h3 className={`text-2xl font-playfair font-medium mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-xs font-light mb-4 ${isDark ? 'text-zinc-200' : 'text-slate-600'}`}>{T.welcome_popup_msg}</p>
            
            <div className={`text-[10px] text-left p-3 mb-6 rounded-xl border ${isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                {T.welcome_popup_warning}
            </div>

            <Button full size="lg" onClick={() => {
              setWelcomePopup(false);
              setUser(u => ({ ...u, hasSeenWelcome: true }));
              const welcomeCoupon = { id: 'welcome', val: 15, title: '🎁 AXE15', code: 'AXE15' };
              setOrder(b => ({ ...b, appliedCoupon: welcomeCoupon }));
              setUser(prev => ({ ...prev, coupons: [...prev.coupons, welcomeCoupon] }));
              addToast(T.toast_coupon_success, "success");
            }}>
              {T.get_coupon}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
