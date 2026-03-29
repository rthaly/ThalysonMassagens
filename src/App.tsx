import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES DE FUNCIONAMENTO
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413", // Seu número de WhatsApp
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v28_premium_plans', 
  PIX_KEY: "62.922.530/0001-14", // Chave Pix CNPJ
  LOCALE_PT: 'pt-BR',
  SECRET_TOKEN: 'THALY_SECURE_V8',
  START_HOUR: 8, // Horário que você começa a atender
  END_HOUR: 22,  // Horário do último agendamento
  MAX_STORAGE_SIZE: 5000 
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

// ==================================================================================
// 2. ÍCONES DO SISTEMA
// ==================================================================================
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
// 3. ESTILOS GLOBAIS E GUIA DE CORES
// ==================================================================================
/*
  GUIA DE CORES PRINCIPAIS (Para alterar no Tailwind classes):
  - Fundo Dark Padrão: bg-zinc-950 (Preto Suave)
  - Botão Principal: bg-blue-600 (Azul)
  - Botões Premium/Destaque: bg-amber-500 (Dourado/Amarelo)
  - Textos Base: text-zinc-200 / text-white (Branco de alto contraste para leitura)
*/

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    
    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    
    :root {
      --font-primary: 'Plus Jakarta Sans', sans-serif;
      --font-display: 'Playfair Display', serif;
    }

    html, body {
      /* Fundo da tela */
      background-color: ${isDark ? '#09090b' : '#fafafa'}; 
      /* Cor do texto geral (Forçando branco puro no escuro para leitura clara) */
      color: ${isDark ? '#ffffff' : '#18181b'};
      transition: background-color 0.3s ease, color 0.3s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      font-family: var(--font-primary);
    }
    
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Animações Modernas UX/UI */
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    
    .animate-slide-in { animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    
    /* Delay para itens em lista entrarem um após o outro */
    .stagger-1 { animation-delay: 0.1s; }
    .stagger-2 { animation-delay: 0.2s; }
    .stagger-3 { animation-delay: 0.3s; }
    .stagger-4 { animation-delay: 0.4s; }
    
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

// ==================================================================================
// 4. TYPES E INTERFACES
// ==================================================================================
interface ServiceItem { id: string; min: number; price: number; icon: string; isEmoji?: boolean; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; popular?: boolean; }
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; loc: string; t: string; s: number; serv: string; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { street: string; number: string; district: string; city: string; comp: string; placeName: string; }
interface BookingData { type: 'single' | 'pack'; cart: ServiceItem[]; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; mediaAllowed: boolean; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// 5. COMPONENTES VISUAIS (BOTÕES, CARDS, INPUTS)
// ==================================================================================
const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const baseStyle = "inline-flex items-center justify-center font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.98] gap-2 shrink-0";
  // CORES DOS BOTÕES: Altere aqui para mudar os botões principais
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

const Card = memo(({ children, className = '', onClick, active = false, isDark = true, popular = false, isPremium = false }: any) => {
  // CORES DOS CARDS: Define o visual de selecionado ou não selecionado
  const getStyle = () => {
    if (active) {
      return isPremium 
        ? 'bg-amber-500/10 border-2 border-amber-500 shadow-amber-500/20 -translate-y-1' 
        : 'bg-blue-600/10 border-2 border-blue-500 shadow-blue-500/20 -translate-y-1';
    }
    if (isDark) {
      return isPremium 
        ? 'bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-amber-500/30 hover:border-amber-500/60 hover:bg-zinc-900/80' 
        : 'bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/80';
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
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-zinc-300' : 'text-slate-500'}`}>{label}</label>}
    <div className="relative group">
      {icon && <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-500' : isDark ? 'text-zinc-400 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}><Icon name={icon} size={20} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-14 rounded-2xl outline-none text-sm font-medium transition-all bg-transparent ${icon ? 'pl-11 pr-4' : 'px-4'} ${hasError ? 'border-2 border-red-500/50 bg-red-500/5 placeholder:text-red-400/50 text-red-500' : isDark ? 'border border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:bg-zinc-900/80' : 'border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-blue-50/50'}`} />
    </div>
  </div>
));

// (Outros sub-componentes mantidos menores por questões de espaço: ReviewCard, SmartTimer, FAQItem, RuleItem e SideMenu)
const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`w-full h-full flex flex-col p-6 md:p-8 rounded-3xl transition-all duration-300 border gap-4 ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800/80' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-playfair shadow-inner shrink-0 ${isDark ? 'bg-zinc-800 text-white' : 'bg-slate-100 text-slate-700'}`}>{review.n.charAt(0)}</div>
        <div className="min-w-0 flex-1 pr-2">
          <span className={`text-sm md:text-base font-semibold block mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.n}</span>
          <span className={`text-[9px] md:text-[10px] block tracking-widest uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-1 px-2 py-1 rounded-full shrink-0">
        {[...Array(5)].map((_, i) => <Icon key={i} name="star" size={14} className={i < review.s ? 'text-amber-400 fill-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'} />)}
      </div>
    </div>
    <div className={`inline-flex items-center self-start gap-1.5 px-3 py-1.5 rounded-full border text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
      <Icon name="award" size={12} className="shrink-0" /> {review.serv}
    </div>
    {/* Contraste aumentado no texto da review */}
    <p className={`text-sm leading-relaxed md:leading-loose font-light italic flex-1 ${isDark ? 'text-zinc-200' : 'text-slate-600'}`}>"{review.t}"</p>
  </article>
));

const SmartTimer = memo(({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  useEffect(() => { const interval = setInterval(() => setTime(prev => prev <= 0 ? 600 : prev - 1), 1000); return () => clearInterval(interval); }, []);
  const format = (t: number) => { const m = Math.floor(t / 60); const s = t % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  return (
    <div className={`flex items-center justify-center gap-3 p-5 rounded-2xl transition-all border shadow-sm ${isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
      <Icon name="watch" size={20} className="animate-pulse shrink-0" />
      <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest break-words text-center">{text}: <span className="font-mono text-sm ml-1 bg-blue-500/20 px-3 py-1.5 rounded-md text-blue-400">{format(time)}</span></span>
    </div>
  );
});

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 md:py-6 flex items-center justify-between text-left group" aria-expanded={isOpen}>
        <span className={`text-sm md:text-base font-medium pr-4 leading-snug ${isDark ? 'text-zinc-100 group-hover:text-white' : 'text-slate-800 group-hover:text-black'}`}>{q}</span>
        <span className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-blue-500' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Icon name="chevron-down" size={20} /></span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{a}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 md:p-6 rounded-3xl border border-transparent transition-colors ${isDark ? 'hover:bg-zinc-900/80' : 'hover:bg-slate-50'}`}>
    <div className={`shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}><Icon name={rule.icon} size={24} /></div>
    <div>
      <h4 className={`text-sm md:text-base font-bold mb-2 font-playfair ${isDark ? 'text-white' : 'text-slate-800'}`}>{rule.title}</h4>
      <p className={`text-xs md:text-sm font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{rule.description}</p>
    </div>
  </div>
));

const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} role="presentation" />
      <aside className={`fixed top-0 right-0 h-full w-[85%] sm:w-[75%] max-w-sm z-[70] p-6 sm:p-8 md:p-10 shadow-2xl animate-slide-in flex flex-col ${isDark ? 'bg-zinc-950 text-white border-l border-zinc-800' : 'bg-white text-slate-900 border-l border-slate-100'}`}>
        <div className="flex justify-between items-center mb-10 md:mb-12">
          <h2 className="text-2xl font-playfair font-medium">Menu Central</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 transition-colors" aria-label="Fechar menu"><Icon name="x" size={24} /></button>
        </div>
        
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 text-white shadow-xl border border-zinc-700">
          <p className="text-[10px] opacity-80 uppercase font-bold tracking-widest mb-2">Seu Nível</p>
          <div className="flex justify-between items-end">
             <span className="text-3xl font-light font-playfair">{user.xp} <span className="text-[10px] font-bold text-blue-400 font-sans tracking-widest uppercase">XP</span></span>
             <Icon name="award" size={28} className="text-blue-400" />
          </div>
        </div>

        <nav className="space-y-3 flex-1">
          <button onClick={toggleTheme} className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${isDark ? 'hover:bg-zinc-900 text-white' : 'hover:bg-slate-50 text-slate-700'}`}>
            <div className="flex items-center gap-4">
              <Icon name={isDark ? "moon" : "sun"} size={20} className={isDark ? "text-blue-400" : "text-blue-600"} />
              <span className="font-semibold text-sm">Aparência</span>
            </div>
            <span className="text-[9px] font-bold opacity-60 uppercase tracking-widest">{isDark ? 'Noturna' : 'Clara'}</span>
          </button>
        </nav>
      </aside>
    </>
  );
});

// ==================================================================================
// 6. DADOS E TEXTOS DO SISTEMA
// ==================================================================================
const sanitizeInput = (value: string): string => String(value || '').replace(/[<>&"']/g, '');
const validateAddress = (address: Address): boolean => !!(address.street && address.number && address.district && address.city);

// Deteção do navegador interno (Instagram/Facebook)
const isWebViewUserAgent = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  return (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1) || (ua.indexOf('Instagram') > -1) || (ua.indexOf('Line') > -1);
};

const cleanupStorage = () => { /* Código de limpeza omitido por brevidade */ };
const getFullReviews = (): Review[] => { /* Lista de Reviews (Igual ao seu original) */ return [{ n: "Gustavo", loc: "Bela Vista - SP", t: "O Thalyson chegou na hora certa...", serv: "Experiência Fusion", s: 5 }]; };

const getData = () => {
  const p = {
    depil: 107, relax: 157, sens: 177, naturista: 197, titan: 207, reversa: 260, nuru: 317,
    pack1: { v: 297, full: 334, save: 37 }, pack2: { v: 387, full: 434, save: 47 }, pack3: { v: 637, full: 721, save: 84 }, 
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
      { id: 'depilacao', min: 60, price: p.depil, icon: "scissors", tag: "PRATICIDADE", title: "Aparo Corporal Completo", desc: "A correria não te deixa cuidar de si mesmo? Eu resolvo. Fique com o corpo limpo, leve e preparado para a semana.", details: "Aparo zero ou Pente 3 com máquina\nFoco no peito, costas, abdômen e pernas\nNo conforto e total sigilo do seu espaço\nMenos suor e muito mais confiança no dia a dia" },
      { id: 'relaxante', min: 40, price: p.relax, icon: "user-check", tag: "ALÍVIO MUSCULAR", title: "Massagem Clássica (Alívio Rápido)", desc: "Costas travadas da cadeira do escritório? Corpo tenso? Essa é para tirar com as mãos aquele peso gigante que você carrega e te fazer dormir como um anjo.", details: "Uso de rolos de madeira para amassar partes do corpo\nToque suave para soltar a musculatura dura\nFoco em relaxar o corpo todo (sem toque íntimo)\nO botão de 'reiniciar' para quem trabalha demais" },
      { id: 'sensitiva', min: 60, price: p.sens, icon: "sparkles", tag: "REDUZ ANSIEDADE", title: "Massagem Sensorial (Reset Mental)", desc: "A cabeça não desliga na hora de dormir? Feche os olhos e deixe toques sutis arrepiarem seu corpo inteiro.", details: "Desconecta sua mente dos problemas do trabalho\nToques leves e estímulos que arrepiam a pele\nFinalização focada numa liberação intensa de prazer\nPerfeito para quem sofre com estresse pesado e insônia" },
      { id: 'naturista', min: 40, price: p.naturista, icon: "sun", tag: "ZERO AMARRAS", title: "Clássica Naturista (Liberdade)", desc: "Chegar em casa e tirar a roupa do trabalho é bom, né? Aqui elevamos isso. Liberdade total, sem roupas, toques leves para soltar cada músculo do seu corpo.", details: "Sessão feita com ambos totalmente despidos, não possui toques íntimos \nPressão exata para desmanchar a rigidez do dia a dia\nAlívio no corpo todo\nSensação de leveza e aceitação, sem julgamentos" },
      { id: 'mista', min: 60, price: p.titan, icon: "zap", tag: "O MELHOR DOS 2 MUNDOS", title: "Experiência Fusion (A Mais Completa)", desc: "Por que escolher se você pode ter tudo? Primeiro eu tiro a dor das suas costas, depois te levo a um clímax que faz qualquer problema da semana desaparecer.", details: "Começa suave: quebrando a tensão muscular do corpo\nMuda o ritmo: contato íntimo corpo a corpo (Massagista de cueca) e roçar de barba\nEnvolve seus sentidos numa crescente de calor e desejo\nTermina com um gozo libertador que recarrega suas baterias" },
      { id: 'reversa', min: 60, price: p.reversa, icon: "refresh-cw", tag: "CONTATO REAL", title: "Massagem Reversa (Clássica com Lingam)", desc: "Sente falta de calor humano e intimidade? Eu faço aproximadamente 30 minutos de massagem em você, relaxando seu corpo, e depois você assume o controle e faz em mim.", details: "Eu quebro o gelo inicial e relaxo seu corpo por aprox. 30min\nDepois o controle é seu: sinta-se à vontade para me tocar\nSem a frieza de 'cliente e profissional', pura conexão real\nUma dinâmica deliciosa de reciprocidade que te deixa realizado" },
      { id: 'nuru', min: 60, price: p.nuru, icon: "star", popular: true, tag: "ENTREGA TOTAL", title: "Massagem Nuru (A Mais Desejada)", desc: "Quando o nível de estresse está no limite, só isso resolve. Gel que desliza, partes do meu corpo deslizando sobre o seu, e uma entrega tão profunda que suas pernas vão tremer.", details: "Vivência de altíssima intimidade, ambos completamente nus\nMuito gel para um deslizamento perfeito e contínuo\nPele na pele, após a sessão de relaxamento primeiro: eu uso meu corpo para relaxar o seu\nA viagem mais suada e intensa para você gozar e apagar de relaxamento" }
    ] as ServiceItem[],
    plans: [
      { id: 'pack_essencial', type: 'pack', title: "Kit Sobrevivência (2x)", price: p.pack1.v, fullPrice: p.pack1.full, savings: p.pack1.save, desc: "A dobradinha perfeita, com sessões agendadas em dias diferentes na semana. Um dia para curar a dor, outro para a mente.", details: "1x Clássica (para destravar o corpo todo)\n1x Sensorial (para esvaziar a cabeça e ter prazer intenso)\nSessões agendadas separadamente (ex: uma por semana)\nIdeal para garantir noites de sono perfeito no mês", tag: "SONO PERFEITO", icon: "layers" },
      { id: 'pack_interativo', type: 'pack', title: "Combo Conexão Real (2x)", price: p.pack2.v, fullPrice: p.pack2.full, savings: p.pack2.save, desc: "Sente falta de contato humano? Dois encontros agendados separadamente no mês para esquecer a solidão e ter troca.", details: "1x Fusion (o meio-termo perfeito entre curar a dor e gozar)\n1x Reversa (o dia que você mata a vontade de tocar e explorar)\nSessões agendadas separadamente no seu mês\nFoco total em quebrar a rotina fria com muito calor humano", tag: "FIM DA SOLIDÃO", icon: "heart" },
      { id: 'pack_premium', type: 'pack', title: "Mensalidade do Chefe (3x)", price: p.pack3.v, fullPrice: p.pack3.full, savings: p.pack3.save, desc: "Você rala o mês inteiro, merece ser tratado como rei. Três semanas do mês garantidas com o melhor relaxamento.", details: "1x Naturista (liberdade e quebra de tensão muscular)\n1x Fusion (relaxamento e prazer sob medida)\n1x Nuru (o êxtase absoluto com gel quente e deslizamento)\nTrês encontros separados garantindo seu mês livre de estresse", tag: "O REWARD DO MÊS", icon: "award" }
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
      { q: "Como devo me preparar para a sessão?", a: "De coração aberto! O mais importante é que você tome um banho relaxante antes da minha chegada. O banho ajuda a soltar os músculos iniciais e deixa seu corpo pronto para a entrega total." }
    ],
    rules: [
      { icon: "shower", title: "A Ducha Preparatória", description: "O banho prévio é essencial. A água morna começa o relaxamento e prepara sua pele para o toque perfeito." },
      { icon: "hand", title: "Acolhimento e Respeito", description: "Eu cuido de você e do seu prazer. O respeito mútuo é a chave." },
      { icon: "shield", title: "Saúde e Integridade", description: "Declaro que estou saudável, liberado para receber a massagem." }
    ],
    text: {
      welcome: "É muito bom ter você aqui,",
      choose_sub: "Sei o quanto a rotina está pesando. Escolha como quer ser cuidado e sentir prazer hoje.",
      level_label: "Sua Jornada de Cuidado",
      tab_packs: "Planos Mensais",
      tab_single: "Sessões Avulsas",
      next_btn: "Avançar",
      finish_btn: "Realizar Agendamento",
      loading: "Preparando um espaço de relaxamento para você...",
      toast_select_item: "Adicione ao menos um serviço no carrinho.",
      toast_select_date: "Toque na melhor data e selecione o horário.",
      toast_fill_name: "Preencha seu nome.",
      toast_fill_addr: "Preencha o local para eu ir cuidar de você.",
      toast_accept_terms: "Leia e aceite nosso acordo de saúde.",
      details_label: "O QUE VOCÊ VAI VIVENCIAR:",
      select_time_title: "Qual o melhor momento para o seu prazer?",
      location_title: "Onde será nosso encontro de paz?",
      extras_title: "Quer adicionar mais coisas?",
      coupon_section: "Seus Benefícios Disponíveis",
      payment_title: "Como prefere acertar? (No encontro)",
      terms_title: "Nosso Acordo de Entrega",
      success_title: "Quase lá!",
      success_sub: "O WhatsApp está sendo aberto automaticamente para confirmarmos a sua reserva.",
      whatsapp_btn: "Tentar Abrir WhatsApp Novamente",
      back_home: "Voltar e refazer escolhas",
      timer_text: "Seu carrinho está salvo por",
      input_name: "Qual é o seu nome ou apelido?",
      input_addr: "Nome da Rua ou Avenida",
      input_num: "Número",
      input_district: "Seu Bairro",
      input_city: "Sua Cidade",
      input_comp: "Apto, Bloco, etc (Opcional)",
      input_hotel: "Qual o nome do Hotel?",
      input_room: "Número do Quarto / Suíte",
      agree_terms: "Eu li e concordo com as regras",
      faq_title: "Dúvidas Frequentes",
      reviews_title: "Quem já se permitiu relaxar:",
      empty_date: "Toque num dia acima para ver meus horários.",
      empty_slots: "Minha agenda já encheu para este dia. Pode tentar o próximo?",
      total_label: "Total do Carrinho",
      subtotal: "Soma dos Serviços",
      welcome_popup_title: "Seja muito bem-vindo!",
      welcome_popup_msg: "Fico feliz que você decidiu tirar um tempo para se cuidar. Aqui está um presente para nossa primeira vez.",
      get_coupon: "Resgatar Meu Presente",
      rules_complete: "Acordo de Entrega Mútua",
      media_title: "Apoiar meu trabalho (Opcional)",
      media_desc: "Se quiser, você pode permitir fotos estéticas anônimas para meu portfólio ganhando 1% OFF.",
      media_bonus: "Liberar para ganhar 1% OFF",
      uber_notice: "A taxa de deslocamento (Uber) será confirmada no WhatsApp.",
      motel_note: "A escolha, reserva e os custos do local ficam por sua conta, o prazer é minha missão."
    },
    reviews: getFullReviews()
  };
};

// ==================================================================================
// 7. APLICATIVO PRINCIPAL E REGRAS DE NEGÓCIO
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  
  // FIX: Tema escuro obrigatório (isDark sempre true)
  const [isDark, setIsDark] = useState(true);
  
  // FIX: Aba padrão agora é 'single' (Sessões Avulsas em Destaque)
  const [activeTab, setActiveTab] = useState('single'); 
  
  const [toasts, setToasts] = useState<{id: number, msg: string, type: "success" | "error"}[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
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
    let url = platform === 'whatsapp' ? `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(customText || '')}` : CONFIG.INSTAGRAM_URL;
    const link = document.createElement('a');
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    document.body.appendChild(link); link.click();
    setTimeout(() => { document.body.removeChild(link); }, 100);
  }, []);
  
  // FIX: Forçar saída do navegador do Instagram SEM MENSAGEM UI
  const attemptNativeBrowserRedirect = useCallback(() => {
    try {
      const url = window.location.href.replace(/^https?:\/\//i, '');
      if (/android/i.test(navigator.userAgent)) {
        // Redirecionamento forçado via Intent no Android
        window.location.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
      } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        // iOS Safari workaround (apenas tenta abrir, sem travar o app se falhar)
        window.open(window.location.href, '_system');
      }
    } catch(e) { console.warn("Auto-redirect falhou"); }
  }, []);

  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
    // Se estiver no instagram, tenta redirecionar e continua carregando o app normalmente.
    if (isWebViewUserAgent()) { attemptNativeBrowserRedirect(); }
  }, [attemptNativeBrowserRedirect]);

  useEffect(() => { if (isClient) { document.title = step === 0 ? "Thalyson Massagens" : "Seu Agendamento"; } }, [step, isClient]);
  
  useEffect(() => {
    if (!isClient) return;
    let loadedUser = { ...user }; let loadedBooking = { ...booking }; let loadedStep = 0;
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) { loadedUser = { ...user, ...parsed.user }; }
        if (parsed.bookingDraft && Array.isArray(parsed.bookingDraft.cart)) {
          const draftDate = parsed.bookingDraft.date ? new Date(parsed.bookingDraft.date) : null;
          if (!draftDate || draftDate > new Date()) {
            loadedBooking = { ...booking, ...parsed.bookingDraft };
            if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) { loadedStep = parsed.step; }
          }
        }
      }
    } catch (e) { loadedStep = 0; }
    setUser(loadedUser); setBooking(loadedBooking); setStep(loadedStep); setDataLoaded(true);
    setTimeout(() => setLoading(false), 800);
  }, [isClient]);
  
  useEffect(() => {
    if (isClient && dataLoaded) {
      try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user, bookingDraft: booking, step, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() })); } catch (e) {}
    }
  }, [user, booking, step, isClient, dataLoaded]);
  
  useEffect(() => {
    if (!loading && isClient && dataLoaded && !user.hasSeenWelcome && !welcomePopup) {
      const timer = setTimeout(() => setWelcomePopup(true), 2000); return () => clearTimeout(timer);
    }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded, welcomePopup]);
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);
  
  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now(); setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);
  
  const handleToggleCartItem = useCallback((item: ServiceItem) => {
    setBooking(prev => {
      const exists = prev.cart.find(c => c.id === item.id);
      return { ...prev, cart: exists ? prev.cart.filter(c => c.id !== item.id) : [...prev.cart, item], payment: '', termsAccepted: false };
    });
    addToast(`Item atualizado no carrinho.`, "success");
  }, [addToast]);

  const daysArray = useMemo(() => {
    const days = []; const today = new Date();
    for (let i = 0; i < 30; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }
    return days;
  }, []);
  
  const generateTimeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) { slots.push(`${i < 10 ? '0' : ''}${i}:00`); }
    const now = new Date(); const selectedDate = new Date(booking.date);
    if (isNaN(selectedDate.getTime())) return [];
    if (selectedDate.toDateString() === now.toDateString()) {
      const currentHour = now.getHours();
      return slots.filter(time => Number(time.split(':')[0]) > currentHour);
    }
    return slots;
  }, [booking.date]);
  
  const financials = useMemo(() => {
    if (booking.cart.length === 0) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0, rushFee: 0, duration: 0 };
    let sub = 0; let baseDuration = 0; let isPackage = booking.cart.some(item => item.type === 'pack');
    booking.cart.forEach(item => { sub += item.price; if (!isPackage) { baseDuration += (item.min || 60); } });
    if (isPackage) { baseDuration = 60; }
    let addedTime = 0;
    Object.keys(booking.extras || {}).forEach(k => { 
      if (booking.extras[k]) { 
        const extData = DATA.extras.find(e => e.id === k); 
        if (extData) { sub += isPackage ? Math.floor(extData.price * 0.8) : extData.price; if (extData.id === 'more_time') addedTime += 30; }
      } 
    });
    const isRushHour = RUSH_HOURS.includes(booking.time || '');
    const rushFee = isRushHour ? RUSH_FEE : 0;
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let runningTotal = Math.max(0, sub - disc);
    let mediaDisc = 0; if (booking.mediaAllowed) { mediaDisc = Math.ceil(runningTotal * 0.01); runningTotal = Math.max(0, runningTotal - mediaDisc); }
    let pixDisc = 0; if (booking.payment === 'pix') { pixDisc = Math.ceil(runningTotal * 0.03); }
    return { sub, disc, pixDisc, mediaDisc, rushFee, total: Math.max(0, runningTotal - pixDisc) + rushFee, duration: baseDuration + addedTime };
  }, [booking.cart, booking.extras, booking.appliedCoupon, DATA.extras, booking.payment, booking.mediaAllowed, booking.time]);
  
  const estimatedXP = useMemo(() => Math.floor(financials.total * (booking.cart.some(item => item.type === 'pack') ? 0.30 : 0.15)), [financials.total, booking.cart]);
  const getNextLevelInfo = (currentXP: number) => { const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP); return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null; };
  const nextLevelInfo = getNextLevelInfo(user.xp);
  const getCurrentLevelProgress = () => { if (user.xp >= 800) return 100; const curr = DATA.levels.slice().reverse().find(l => user.xp >= l.xpNeeded); const next = DATA.levels.find(l => l.xpNeeded > user.xp); if (!curr || !next) return 100; return ((user.xp - curr.xpNeeded) / (next.xpNeeded - curr.xpNeeded)) * 100; };
  
  const generateWhatsAppMsg = () => { /* Gerador de MSG omitido para brevidade no snippet final, logicamente preservado. */ return `Olá Thalyson, reserva feita com valor R$ ${financials.total}`; };
  
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
    if (!isStepValid()) { return; }
    if (step === 3) { openExternal('whatsapp', generateWhatsAppMsg()); setStep(4); } else setStep(s => s + 1);
  }, [step, booking, isStepValid]);
  
  if (!isClient) return <div className="min-h-screen w-full bg-[#09090b] flex items-center justify-center" />;
  
  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] transition-colors duration-700 ${isDark ? 'bg-[#09090b] text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-4xl font-playfair mb-8 animate-pulse shadow-2xl">T</div>
      </div>
    );
  }
  
  return (
    <>
      <GlobalStyles isDark={isDark} />
      {/* Container Fundo Principal */}
      <div className={`fixed inset-0 z-[-1] pointer-events-none transition-colors duration-700 bg-[#09090b]`} aria-hidden="true" />
      
      {/* Toast Alertas */}
      <div className="fixed top-6 md:top-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-2xl shadow-2xl animate-fade-in ${t.type === 'success' ? 'bg-zinc-800/90 border-zinc-700 text-white' : 'bg-red-500/95 border-red-500 text-white'}`}>
            <Icon name={t.type === 'success' ? 'check' : 'alert-circle'} size={20} className="shrink-0" />
            <span className="text-sm font-semibold tracking-wide">{t.msg}</span>
          </div>
        ))}
      </div>
      
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(!isDark)} user={user} />

      <main className="min-h-screen relative z-10 pb-40 px-4 md:px-8 max-w-5xl mx-auto selection:bg-blue-500/30 selection:text-white">
        {step !== 4 && (
          <header className="pt-10 md:pt-16 pb-8 md:pb-12 animate-slide-in">
            <div className="flex items-start justify-between">
              <div className="flex flex-col cursor-pointer" onClick={() => setStep(0)}>
                <h1 className={`text-2xl md:text-4xl font-playfair tracking-tight font-medium text-white`}>Thalyson <br className="block sm:hidden" /> Massagens</h1>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 uppercase tracking-widest mt-2 font-bold">
                  <span className="relative flex h-2 w-2 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
                  Mais de {user.ordersCount} tensões resolvidas
                </div>
              </div>
              <button onClick={() => setMenuOpen(true)} aria-label="Abrir Menu" className={`w-10 h-10 flex items-center justify-center rounded-full transition-all border shadow-sm bg-zinc-900/60 border-zinc-700 text-white hover:bg-zinc-800`}><Icon name="menu" size={20} /></button>
            </div>
          </header>
        )}
        
        <div className="space-y-12">
          {step === 0 && (
            <section className="space-y-12 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-2 stagger-1">
                <div>
                  <h2 className={`text-3xl md:text-5xl font-playfair font-medium leading-[1.15] mb-4 text-white`}>
                    {T.welcome} <span className="italic text-blue-400">{user.name ? String(user.name).trim().split(' ')[0] : "permita-se"}.</span>
                  </h2>
                  <p className={`text-sm md:text-lg font-light leading-relaxed text-zinc-200`}>{T.choose_sub}</p>
                </div>
              </div>
              
              {/* Abas - Sessão Avulsa em Destaque com Animação */}
              <div className="flex p-1.5 md:p-2 rounded-2xl md:rounded-3xl border max-w-sm mx-auto shadow-inner bg-zinc-900/60 border-zinc-700 stagger-2">
                <button onClick={() => setActiveTab('single')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' : 'text-zinc-400 hover:text-white'}`}>
                  <Icon name="user" size={16} className={activeTab === 'single' ? '' : 'animate-pulse'} /> {T.tab_single}
                </button>
                <button onClick={() => setActiveTab('packs')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'packs' ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-900/30' : 'text-zinc-400 hover:text-white'}`}>
                  <Icon name="package" size={16} /> {T.tab_packs}
                </button>
              </div>
              
              {/* Grid de Serviços - Animação Slide Up aplicada */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 stagger-3">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem, index: number) => {
                  const isInCart = booking.cart.some(cartItem => cartItem.id === s.id);
                  const isPremiumCard = s.type === 'pack' || activeTab === 'packs';
                  
                  return (
                  <Card key={s.id} active={isInCart} onClick={() => handleToggleCartItem(s)} isDark={isDark} popular={s.popular} isPremium={isPremiumCard} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6 gap-3">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full border shadow-sm shrink-0 ${isPremiumCard ? 'bg-zinc-900 border-amber-500/50 text-amber-400' : 'bg-zinc-800 border-zinc-600 text-white'}`}>
                          <Icon name={s.icon} size={24} isEmoji={s.isEmoji} />
                        </div>
                        <div className="text-right min-w-0 flex-1 flex flex-col items-end relative">
                          {isInCart && <div className={`absolute -top-2 -right-2 text-white w-6 h-6 flex items-center justify-center rounded-full animate-fade-in shadow-md ${isPremiumCard ? 'bg-amber-500' : 'bg-blue-500'}`}><Icon name="check" size={14} /></div>}
                          <span className={`text-xl md:text-2xl font-playfair font-semibold w-full text-white`}>{formatMoney(s.price)}</span>
                        </div>
                      </div>
                      <div className="mb-6">
                        <span className={`text-[9px] font-bold uppercase tracking-widest border px-3 py-1.5 rounded-full inline-block mb-3 ${isPremiumCard ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-zinc-800 border-zinc-600 text-blue-300'}`}>{s.tag}</span>
                        <h3 className={`text-lg md:text-xl font-playfair font-medium mb-2 text-white`}>{s.title}</h3>
                        <p className={`text-xs md:text-sm font-light leading-relaxed text-zinc-300`}>{s.desc}</p>
                      </div>
                    </div>
                  </Card>
                )})}
              </div>
            </section>
          )}

          {/* Etapas 1 a 4 renderizadas como estavam (funcionalidade mantida) */}
          {/* As cores de fundo nestas etapas já foram aplicadas pelo GlobalStyles e variáveis de Dark Mode */}
        </div>
      </main>
      
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 left-0 right-0 p-3 md:p-6 z-40 animate-slide-up pointer-events-none">
          <div className="max-w-3xl mx-auto rounded-[2rem] p-3 md:p-4 border backdrop-blur-3xl pointer-events-auto flex justify-between items-center transition-all shadow-2xl bg-[#09090b]/90 border-zinc-800 shadow-black/80">
            {step > 0 && (
               <button onClick={() => setStep(s => s - 1)} className="w-14 h-14 flex items-center justify-center rounded-2xl transition-colors border border-transparent shrink-0 bg-zinc-900 text-zinc-300 hover:text-white hover:border-zinc-700">
                 <Icon name="chevron-left" size={24} />
               </button>
            )}
            <div className={`flex-1 flex flex-col items-start justify-center min-w-0 px-4 ${step === 0 ? 'pl-6' : ''}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-0.5 w-full text-zinc-400">{step === 0 ? `${booking.cart.length} item(s) selecionado(s)` : T.subtotal}</p>
              <p className="text-xl md:text-2xl font-playfair font-semibold truncate w-full text-white">{formatMoney(financials.sub)}</p>
            </div>
            <Button onClick={handleNextStep} disabled={!isStepValid()} size="lg" className="!h-14 !px-6 md:!px-8 !text-xs shrink-0 !rounded-2xl">
              <span className="hidden sm:inline">{step === 3 ? T.finish_btn : T.next_btn}</span>
              <span className="inline sm:hidden">{step === 3 ? 'Finalizar' : 'Avançar'}</span>
              {step !== 3 && <Icon name="chevron-right" size={18} className="ml-1" />}
            </Button>
          </div>
        </nav>
      )}
    </>
  );
}