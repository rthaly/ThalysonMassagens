import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';

// ==================================================================================
// DESIGN TOKENS & CONFIG
// ==================================================================================
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v27_premium_plans',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  EXCHANGE_RATE: 5.0,
  SECRET_TOKEN: 'THALY_SECURE_V11',
  START_HOUR: 9,
  END_HOUR: 22,
  MAX_STORAGE_SIZE: 5000
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

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
  'heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'plus': 'M12 5v14 M5 12h14',
  'refresh-cw': 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  'tag': 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01',
  'ticket': 'M15 5v2 M15 11v2 M15 17v2 M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z',
  'send': 'M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z',
  'sunrise': 'M17 18a5 5 0 0 0-10 0 M12 2v7 M4.22 10.22l1.42 1.42 M1 18h2 M21 18h2 M18.36 11.64l1.42-1.42 M23 22H1 M8 6l4-4 4 4',
  'sunset': 'M17 18a5 5 0 0 0-10 0 M12 9v7 M4.22 15.22l1.42-1.42 M1 18h2 M21 18h2 M18.36 16.64l1.42 1.42 M23 22H1',
  'moon-star': 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9 M20 3v4 M22 5h-4',
  'trash': 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2',
  'message-circle': 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
};

// ==================================================================================
// GLOBAL STYLES
// ==================================================================================
const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { 
      box-sizing: border-box; 
      -webkit-font-smoothing: antialiased; 
      -moz-osx-font-smoothing: grayscale; 
    }

    :root {
      --font-sans: 'Poppins', sans-serif;
      --font-display: 'Poppins', sans-serif;
      --c-bg: ${isDark ? '#11141a' : '#f9f8f6'};
      --c-surface: ${isDark ? '#181c25' : '#ffffff'};
      --c-border: ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'};
      --c-text: ${isDark ? '#f4f4f5' : '#18181b'};
      --c-text-muted: ${isDark ? '#d4d4d8' : '#3f3f46'}; 
      --c-blue: #3b82f6;
      --c-amber: #f59e0b;
    }

    html, body {
      background-color: var(--c-bg);
      color: var(--c-text);
      font-family: var(--font-sans);
      transition: background-color 0.4s ease, color 0.4s ease;
      overscroll-behavior-y: none;
      -webkit-tap-highlight-color: transparent;
      letter-spacing: 0.015em;
      line-height: 1.5;
      font-size: 15px; 
    }

    h1, h2, h3, h4, h5, h6 { font-weight: 700; letter-spacing: -0.01em; }
    .font-display { font-family: var(--font-display); font-weight: 700; }

    *:focus-visible { outline: 2px solid var(--c-blue); outline-offset: 4px; }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes toast-in { from { transform: translateY(-20px) scale(0.94); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
    @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    
    .animate-fade-up { animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.3s ease forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-toast-in { animation: toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-slide-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
    @media (hover: hover) { .card-hover:hover { transform: translateY(-2px); } }
    .service-card-selected { box-shadow: 0 0 0 2px var(--c-blue), 0 8px 24px rgba(59,130,246,0.1); }
    .service-card-selected-amber { box-shadow: 0 0 0 2px var(--c-amber), 0 8px 24px rgba(245,158,11,0.1); }

    button { position: relative; overflow: hidden; cursor: pointer; border: none; }
    .input-field:focus { outline: none; border-color: var(--c-blue); box-shadow: 0 0 0 3px rgba(59,130,246,0.15); }

    .text-gradient-blue { background: linear-gradient(135deg, #60a5fa, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .break-words-all { word-break: break-word; overflow-wrap: break-word; hyphens: auto; }
  `}} />
));

// ==================================================================================
// UTILITIES
// ==================================================================================
const sanitizeInput = (v: string): string => String(v || '').replace(/[<>&"']/g, '');
const validateAddress = (a: any): boolean => !!(a.street && a.number && a.district && a.city);

const vibrate = (pattern: number | number[] = 50) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch (e) { /* Silent fail */ }
};

const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const formatMoney = (val: number | undefined, lang: 'pt' | 'en') => {
  if (val === undefined || isNaN(val)) return lang === 'pt' ? 'R$ 0,00' : '$ 0.00';
  const converted = lang === 'pt' ? val : val / CONFIG.EXCHANGE_RATE;
  return lang === 'pt' ? `R$ ${converted.toFixed(2).replace('.', ',')}` : `$ ${converted.toFixed(2)}`;
};

const isWebViewUserAgent = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  return ['FBAN', 'FBAV', 'Instagram', 'Line', 'TikTok'].some(k => ua.includes(k));
};

const cleanupStorage = () => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('@thaly_app') && key !== CONFIG.STORAGE_KEY) {
        try { JSON.parse(localStorage.getItem(key) || '{}'); } catch { localStorage.removeItem(key); }
      }
    });
  } catch {}
};

// ==================================================================================
// ICON COMPONENT
// ==================================================================================
const Icon = memo(({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={ICON_PATHS[name] || ''} />
    </svg>
  );
});

// ==================================================================================
// TYPES
// ==================================================================================
interface ServiceItem { id: string; min: number; price: number; icon: string; tag: string; title: string; desc: string; details: string; fullPrice?: number; savings?: number; type?: string; popular?: boolean; category?: 'relax' | 'express' | 'final' | 'care'; }
interface Coupon { id: string; val: number; title: string; code: string; }
interface Review { n: string; loc: string; t: string; s: number; serv: string; }
interface UserData { name: string; xp: number; coupons: Coupon[]; usedCoupons: string[]; hasSeenWelcome: boolean; ordersCount: number; lastActivity: string; }
interface Address { cep: string; street: string; number: string; district: string; city: string; comp: string; placeName: string; }
interface BookingData { type: 'single' | 'pack'; cart: ServiceItem[]; extras: Record<string, boolean>; date: string | null; time: string | null; locationType: 'home' | 'motel' | 'hotel'; address: Address; payment: string; appliedCoupon: Coupon | null; termsAccepted: boolean; bookingId: string; customExtraText: string; }
interface Rule { icon: string; title: string; description: string; }

// ==================================================================================
// DATA
// ==================================================================================
const getFullReviews = (lang: 'pt' | 'en'): Review[] => {
  return [
    { n: "Gustavo", loc: "Bela Vista - SP", t: "O Thalyson chegou na hora certa. A experiência em casa foi incrível. Mãos com técnica sem igual, o alívio foi imediato. Levantei parecendo mais leve.", serv: "Experiência Fusion", s: 5 },
    { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: "Você tem mãos abençoadas! Precisava muito desse descanso. Foi super respeitoso a todo tempo e me relaxou demais. Obrigada!", serv: "Massagem Sensorial", s: 5 },
    { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito.", serv: "Massagem Clássica", s: 5 },
    { n: "Lucas", loc: "Londrina", t: "Sendo casado, a discrição era minha prioridade e fui atendido com total sigilo. A massagem tântrica me permitiu redescobrir meu próprio corpo. Sensacional.", serv: "Massagem Nuru", s: 5 },
    { n: "Ricardo", loc: "Fernandópolis", t: "Encontrei um profissionalismo raro. Me senti à vontade para soltar minhas travas. Saí de lá me sentindo mais leve, física e emocionalmente.", serv: "Massagem Reversa", s: 5 }
  ];
};

const getData = (lang: 'pt' | 'en') => {
  const isEn = lang === 'en';
  const p = {
    depil: 107, relax: 180, sens: 200, naturista: 197, titan: 250, reversa: 300, nuru: 350, crossfit: 200,
    pes: 110, maos: 110, combo_pm: 190,
    pack_basic: { v: 497, full: 550, save: 53 },
    pack1: { v: 547, full: 600, save: 53 },
    pack_glow: { v: 597, full: 650, save: 53 },
    pack_muscle: { v: 647, full: 700, save: 53 },
    pack2: { v: 747, full: 850, save: 103 },
    pack3: { v: 847, full: 900, save: 53 },
    pack_ultimate: { v: 997, full: 1100, save: 103 },
    extras: { more_time: 77, aroma: 17, hair_trim: 57, pain_relief: 17 }
  };

  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: isEn ? "Care Beginner" : "Iniciante no Cuidado" },
      { level: 2, xpNeeded: 100, reward: 15, title: isEn ? "Right Priority" : "Prioridade Certa" },
      { level: 3, xpNeeded: 350, reward: 30, title: isEn ? "Conscious Body" : "Corpo Consciente" },
      { level: 4, xpNeeded: 800, reward: 50, title: isEn ? "Plenitude Reached" : "Plenitude Alcançada" }
    ],
    services: [
      { id: 'pes', category: 'express', min: 40, price: p.pes, icon: "user-check", tag: isEn ? "FOOT RELIEF" : "ALÍVIO PÉS", title: isEn ? "Foot Massage" : "Massagem nos Pés", desc: isEn ? "Complete relief for tired feet after a long day." : "Alívio completo e direto para pés cansados após um longo dia.", details: isEn ? "1. Foot reflexology\n2. Deep pressure points" : "1. Reflexologia focada na sola dos pés.\n2. Pressão profunda em pontos de tensão.\n3. Liberação completa para caminhar com mais leveza." },
      { id: 'maos', category: 'express', min: 40, price: p.maos, icon: "hand", tag: isEn ? "HAND RELIEF" : "ALÍVIO MÃOS", title: isEn ? "Hand Massage" : "Massagem nas Mãos", desc: isEn ? "Release tension from working with your hands." : "Libere a tensão de digitar ou usar muito as mãos no trabalho.", details: isEn ? "1. Joint stretching\n2. Deep palm massage" : "1. Alongamento das articulações dos dedos.\n2. Massagem profunda na palma da mão.\n3. Alívio de dores nos punhos e antebraços." },
      
      { id: 'relaxante', category: 'relax', min: 40, price: p.relax, icon: "user-check", tag: isEn ? "MUSCLE RELIEF" : "ALÍVIO MUSCULAR", title: isEn ? "Classic Massage" : "Massagem Clássica", desc: isEn ? "Full body massage focused on pain relief and mental relaxation. Strictly no intimate touches." : "Massagem no corpo todo, focada em tirar dores e relaxar a mente. Rigorosamente sem toques íntimos.", details: isEn ? "1. Full body relaxing massage.\n2. Focus on releasing tension and relieving pain.\n3. Deep mental relaxation.\n4. Strictly professional session, no intimate touches." : "1. Massagem relaxante feita no corpo todo.\n2. Foco em soltar pontos de tensão e aliviar dores.\n3. Relaxamento profundo da mente e do corpo.\n4. Sessão profissional, sem toques íntimos." },
      { id: 'naturista', category: 'relax', min: 40, price: p.naturista, icon: "sun", tag: isEn ? "ZERO CLOTHES" : "LIBERDADE", title: isEn ? "Naturist Classic" : "Clássica Naturista", desc: isEn ? "Starts with the Classic full-body massage. The difference is we do it without clothes for total freedom." : "Começamos com a massagem clássica no corpo todo para relaxar a mente. O diferencial é que fazemos tudo sem roupas para maior liberdade.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Removal of all clothes for total freedom.\n3. Deep tension relief.\n4. Strictly professional session, no intimate touches." : "1. Massagem clássica relaxante no corpo todo.\n2. Remoção das roupas para liberdade total.\n3. Alívio de tensões nas costas e pernas.\n4. Sessão profissional, sem toques íntimos." },
      { id: 'crossfit', category: 'relax', min: 60, price: p.crossfit, icon: "zap", tag: isEn ? "DEEP RECOVERY" : "RECUPERAÇÃO", title: isEn ? "For Athletes" : "Massagem para Atletas", desc: isEn ? "Starts with the Classic massage, then applies extra pressure and techniques to recover tired muscles." : "Inicia com a massagem clássica no corpo todo. Depois, aplicamos mais firmeza para recuperar músculos cansados.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Extra pressure on painful areas.\n3. Use of muscle relief ointments.\n4. Stretching to restore mobility." : "1. Massagem relaxante no corpo todo.\n2. Aplicação de força nas áreas doloridas.\n3. Uso de pomadas para alívio rápido.\n4. Alongamentos para devolver o movimento." },
      
      { id: 'sensitiva', category: 'final', min: 60, price: p.sens, icon: "sparkles", tag: isEn ? "REDUCES ANXIETY" : "CALMA E PRESENÇA", title: isEn ? "Sensory Massage" : "Massagem Sensorial", desc: isEn ? "Classic massage first to calm the mind. Then, subtle touches to awaken senses, ending with pleasure." : "Massagem clássica para tirar dores e acalmar a mente. Em seguida, toques sutis para despertar os sentidos, finalizando com relaxamento total.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Subtle touches to calm a racing mind.\n3. Building new physical sensations.\n4. Manual ending for total stress release." : "1. Massagem clássica no corpo todo.\n2. Toques sutis para desligar a mente acelerada.\n3. Construção de novas sensações.\n4. Finalização manual para liberação total." },
      { id: 'mista', category: 'final', min: 60, price: p.titan, icon: "zap", tag: isEn ? "BEST OF BOTH" : "O MELHOR DOS 2", title: isEn ? "Fusion Experience" : "Experiência Fusion", desc: isEn ? "Starts with the complete Classic massage to heal pain. Then, the rhythm changes to skin-to-skin contact." : "Inicia com a massagem clássica completa. Depois, o ritmo muda para contato próximo e uma finalização intensa.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Close physical contact (I wear only underwear).\n3. Warming and stimulating all senses.\n4. Intense ending to recharge your energy." : "1. Massagem relaxante no corpo todo.\n2. Contato físico próximo (atendo de roupa íntima).\n3. Estímulo de todos os sentidos.\n4. Finalização intensa para recarregar as energias." },
      { id: 'reversa', category: 'final', min: 60, price: p.reversa, icon: "refresh-cw", tag: isEn ? "REAL CONTACT" : "CONTATO REAL", title: isEn ? "Reverse Massage" : "Massagem Reversa", desc: isEn ? "Starts with a Classic massage on your whole body. Then, you take control and massage me." : "Começa com a massagem clássica no seu corpo para relaxar. Depois, você assume o controle.", details: isEn ? "1. Classic full-body massage (approx. 30 min).\n2. The control passes to you.\n3. Freedom to touch and explore.\n4. Mutual ending and real exchange of affection." : "1. Massagem relaxante (aprox. 30 min).\n2. O controle da sessão passa para você.\n3. Liberdade para guiar o ritmo.\n4. Finalização mútua e troca de carinho." },
      { id: 'nuru', category: 'final', min: 60, price: p.nuru, icon: "star", popular: true, tag: isEn ? "TOTAL SURRENDER" : "ENTREGA TOTAL", title: isEn ? "Nuru Massage" : "Massagem Nuru", desc: isEn ? "Classic massage first to remove pain. Then, warm gel and my body sliding over yours for extreme relaxation." : "Começamos com a massagem clássica para tirar as dores. Depois, gel que desliza e contato de corpo inteiro para um relaxamento extremo.", details: isEn ? "1. Classic full-body relaxing massage.\n2. Application of warm special gel on both of us.\n3. Full skin-to-skin contact sliding over your body.\n4. Intense ending for complete relaxation." : "1. Nós dois nu, massagem relaxante no corpo todo primeiro. \n2. Deslizamento fluido e contínuo corpo a corpo com muito gel costas e frente. \n3. Lingam tântrica que são toques e massagens no pênis. \n4. Finalização profunda para você relaxar e se entregar, tem interação" },
      
      { id: 'depilacao', category: 'care', min: 60, price: p.depil, icon: "scissors", tag: isEn ? "AESTHETICS" : "ESTÉTICA", title: isEn ? "Body Hair Trim" : "Aparo de Pelos do Corpo", desc: isEn ? "Leave with a clean, light body ready for the week." : "Aparo profissional dos pelos para você ficar impecável e se sentir bem com seu corpo.", details: isEn ? "1. Trim with clippers\n2. Focus on specific body parts" : "1. Aparo com máquina (pente zero ou três).\n2. Foco nas regiões que você escolher.\n3. Feito no conforto da sua casa ou hotel.\n4. Corpo mais limpo e estética agradável." }
    ] as ServiceItem[],
    
    plans: [
      { id: 'pack_basic', type: 'pack', title: isEn ? "Routine Relief (2x)" : "Alívio de Rotina (2x)", price: p.pack_basic.v, fullPrice: p.pack_basic.full, savings: p.pack_basic.save, desc: isEn ? "For those who stand or type a lot. Includes a relaxing bonus." : "Para quem trabalha muito. Inclui um bônus para relaxamento extra.", details: isEn ? "1x Foot Massage\n1x Classic\nBonus: Free Aromatherapy" : "1x Massagem nos Pés\n1x Massagem Clássica\nBônus: Aromaterapia nas sessões\nDuas semanas com alívio garantido.", tag: isEn ? "RELAX" : "RELAX", icon: "watch" },
      { id: 'pack_essencial', type: 'pack', title: isEn ? "Survival Kit (2x)" : "Pacote Essencial (2x)", price: p.pack1.v, fullPrice: p.pack1.full, savings: p.pack1.save, desc: isEn ? "Two sessions to cure pain and mind." : "O cuidado que você precisa. Duas sessões no mês: tirar dores e aliviar a mente.", details: isEn ? "1x Classic\n1x Sensory" : "1x Massagem Clássica (dores corporais)\n1x Massagem Sensorial (esvaziar a mente)\nSessões agendadas separadamente.", tag: isEn ? "PERFECT SLEEP" : "DURMA BEM", icon: "layers" },
      { id: 'pack_glow', type: 'pack', title: isEn ? "Full Renewal (2x)" : "Renovação Completa (2x)", price: p.pack_glow.v, fullPrice: p.pack_glow.full, savings: p.pack_glow.save, desc: isEn ? "A day for aesthetics and a day for pleasure. With a time bonus." : "Dia de cuidar da estética e dia de bem-estar profundo.", details: isEn ? "1x Trim\n1x Fusion\nBonus: +30 min free on Fusion" : "1x Aparo de Pelos do Corpo\n1x Experiência Fusion\nBônus: +30 minutos na sessão Fusion\nIdeal para elevar a autoestima.", tag: isEn ? "GLOW UP" : "CUIDADO", icon: "sparkles" },
      { id: 'pack_muscle', type: 'pack', title: isEn ? "Recovery Combo (2x)" : "Combo Recuperação (2x)", price: p.pack_muscle.v, fullPrice: p.pack_muscle.full, savings: p.pack_muscle.save, desc: isEn ? "Focused on those who train hard and suffer from intense muscle pain." : "Para quem treina pesado e sofre com tensões musculares intensas.", details: isEn ? "2x Crossfit\nBonus: Extra Pain Focus free" : "2x Massagem para Atletas (Crossfit)\nBônus: Foco Extra em Dores\nSessões dedicadas à sua recuperação física.", tag: isEn ? "MUSCLE" : "MÚSCULOS", icon: "zap" },
      { id: 'pack_interativo', type: 'pack', title: isEn ? "Real Connection (2x)" : "Combo Conexão (2x)", price: p.pack2.v, fullPrice: p.pack2.full, savings: p.pack2.save, desc: isEn ? "Missing human contact? Two encounters to forget loneliness." : "Para quem valoriza contato humano e troca de energia. Dois encontros no mês.", details: isEn ? "1x Fusion\n1x Reverse" : "1x Experiência Fusion\n1x Massagem Reversa\nSessões marcadas em dias diferentes\nAtenção exclusiva para você.", tag: isEn ? "END OF LONELINESS" : "MAIS CONEXÃO", icon: "heart" },
      { id: 'pack_boss', type: 'pack', title: isEn ? "Exclusive Plan (3x)" : "Pacote Renovar (3x)", price: p.pack3.v, fullPrice: p.pack3.full, savings: p.pack3.save, desc: isEn ? "You deserve to be treated like a king. Three weeks guaranteed." : "Um tratamento contínuo para quem exige cuidado impecável. Três semanas do mês cobertas.", details: isEn ? "1x Naturist\n1x Fusion\n1x Nuru" : "1x Naturista (liberdade e relaxamento)\n1x Fusion (massagem firme e finalização)\n1x Nuru (imersão total e bem-estar)\nPara garantir um mês sem estresse.", tag: isEn ? "MONTH'S REWARD" : "ASSINATURA", icon: "award" },
      { id: 'pack_ultimate', type: 'pack', title: isEn ? "Pleasure Journey (3x)" : "Jornada Completa (3x)", price: p.pack_ultimate.v, fullPrice: p.pack_ultimate.full, savings: p.pack_ultimate.save, desc: isEn ? "Total immersion. Three weeks escalating the level of intimacy." : "A imersão total. Três encontros escalando o nível de relaxamento e acolhimento.", details: isEn ? "1x Sensory\n1x Fusion\n1x Nuru\nBonus: Touch allowed free" : "1x Massagem Sensorial\n1x Experiência Fusion\n1x Massagem Nuru\nBônus: Liberdade para Tocar inclusa nos 3 encontros\nA forma definitiva de desligar a mente.", tag: isEn ? "JOURNEY" : "COMPLETO", icon: "heart" }
    ] as ServiceItem[],

    extras: [
      { id: 'hair_trim', price: p.extras.hair_trim, icon: "scissors", label: isEn ? "Trim (Extra)" : "Aparo de Pelos", desc: isEn ? "Maintenance in 2 body parts to look flawless." : "Aparo com máquina em até 2 áreas do corpo." },
      { id: 'more_time', price: p.extras.more_time, icon: "clock", label: isEn ? "Extended Time (+30m)" : "Mais 30 Minutos", desc: isEn ? "Because when it's good, we don't want it to end." : "Mais 30 minutos na sessão para curtir sem pressa." },
      { id: 'aroma', price: p.extras.aroma, icon: "sparkles", label: isEn ? "Deep Aromatherapy" : "Aromaterapia", desc: isEn ? "Essential oils that lower your mental frequency." : "Óleos essenciais para ajudar a acalmar a mente." },
      { id: 'pain_relief', price: p.extras.pain_relief, icon: "shield", label: isEn ? "Extra Focus on Pain" : "Foco em Dores", desc: isEn ? "Use of technical ointment to treat strong pain." : "Uso de pomadas térmicas para soltar áreas muito travadas." }
    ],
    faq: [
      { q: isEn ? "How do the touch and the ending work?" : "Como a finalização funciona na prática?", a: isEn ? "Everything is conducted with extreme respect..." : "Tudo é conduzido com muito respeito ao seu tempo e ao seu corpo. O objetivo é criar um espaço onde você possa confiar, se soltar totalmente e chegar a um relaxamento intenso que tira todo o peso da rotina." },
      { q: isEn ? "Where is our meeting location?" : "Onde nós vamos nos encontrar?", a: isEn ? "I come to you..." : "Eu vou até você para o seu conforto. Pode ser na sua casa ou em um hotel. Eu levo o necessário para transformar o ambiente." },
      { q: isEn ? "How should I prepare for the session?" : "O que eu preciso fazer antes da sessão?", a: isEn ? "With an open heart!..." : "Apenas tome um banho quente e relaxante perto do horário da minha chegada. Isso amolece os músculos e prepara o corpo." },
      { q: isEn ? "I'm ashamed of my body, what now?" : "Tenho vergonha do meu corpo, o que eu faço?", a: isEn ? "Forget about that..." : "Esqueça completamente isso. Meu ambiente é de acolhimento e sem julgamentos. Não importa sua idade ou seu corpo. Estou indo exclusivamente para cuidar de você." },
      { q: isEn ? "Are my points and level saved in the app?" : "Como o aplicativo salva meu progresso (XP)?", a: isEn ? "Yes! To facilitate..." : "Seu progresso é salvo direto no navegador do celular. Mantenha os dados para não perder seu nível." }
    ],
    rules: [
      { icon: "shower", title: isEn ? "The Prep Shower" : "A Ducha Preparatória", description: isEn ? "A prior shower is essential." : "O banho prévio com água quente relaxa os músculos e garante que nosso contato seja perfeito." },
      { icon: "hand", title: isEn ? "Welcoming and Respect" : "Acolhimento e Respeito", description: isEn ? "Mutual respect is key." : "Eu me dedico a cuidar de você. O respeito mútuo garante que o ambiente seja leve e livre de preocupações." },
      { icon: "heart", title: isEn ? "Absolute Surrender" : "Entrega ao Momento", description: isEn ? "Forget the outside world." : "O momento que estamos juntos é seu. Desligue a mente, deixe os problemas de lado e sinta." },
      { icon: "shield", title: isEn ? "Health and Integrity" : "Cuidado e Saúde", description: isEn ? "I declare that I am healthy." : "Ao agendar, você garante que está com a saúde em dia, mantendo nosso encontro seguro e tranquilo." }
    ],
    text: {
      welcome: isEn ? "Welcome," : "Olá,",
      welcome_anon: isEn ? "allow yourself." : "permita-se cuidar.",
      choose_sub: isEn ? "I know how heavy the routine is. Choose how you want to be cared for today." : "Permita-se uma pausa. O seu corpo guarda histórias, tensões e cansaço. Aqui você encontra um espaço seguro para soltar o controle, relaxar profundamente e despertar novas sensações.",
      specialist: isEn ? "Massage Therapist" : "Massagista Corporal",
      level_label: isEn ? "Your Care Journey" : "Sua Jornada",
      tab_packs: isEn ? "Plans" : "Planos Mensais",
      tab_single: isEn ? "Single" : "Sessões Avulsas",
      next_btn: isEn ? "Continue" : "Continuar",
      finish_btn: isEn ? "Complete Booking" : "Finalizar Agendamento",
      loading: isEn ? "Preparing your space..." : "Preparando o seu ambiente...",
      toast_select_item: isEn ? "Add at least one service to continue." : "Escolha pelo menos uma opção para continuar.",
      toast_select_date: isEn ? "Choose a date and time for our encounter." : "Selecione a data e o horário ideais.",
      toast_fill_name: isEn ? "Fill in your name to continue." : "Por favor, me diga o seu nome.",
      toast_fill_addr: isEn ? "Fill in the location so I can visit you." : "Preencha o endereço completo para eu te visitar.",
      toast_accept_terms: isEn ? "Please read and accept our agreement." : "Você precisa ler os acordos para continuar.",
      toast_coupon_success: isEn ? "Gift applied! Discount activated." : "Benefício ativado com sucesso.",
      toast_coupon_invalid: isEn ? "Invalid or expired code." : "Código inválido ou expirado.",
      toast_cep_found: isEn ? "Address loaded automatically." : "Endereço encontrado pelo CEP.",
      toast_cep_error: isEn ? "CEP not found." : "Não consegui encontrar este CEP.",
      details_label: isEn ? "WHAT TO EXPECT:" : "O QUE ESPERAR DO ENCONTRO:",
      select_time_title: isEn ? "Choose the perfect moment" : "Quando vamos nos ver?",
      location_title: isEn ? "Where will our encounter be?" : "Onde será nosso encontro?",
      extras_title: isEn ? "Add something special" : "Toques adicionais",
      coupon_section: isEn ? "Your Benefits" : "Seus Benefícios Disponíveis",
      coupon_empty: isEn ? "No benefits available at the moment." : "Nenhum benefício disponível no momento.",
      payment_title: isEn ? "Payment method (at the meeting)" : "Forma de pagamento (você paga no local)",
      terms_title: isEn ? "Agreement" : "Acordos e Regras",
      success_title: isEn ? "Almost there!" : "Tudo Certo! Falta Pouco",
      success_sub: isEn ? "WhatsApp is opening automatically to confirm. If it doesn't open, tap the button below." : "Vou abrir o seu WhatsApp para enviarmos o resumo. Se não abrir, toque no botão abaixo.",
      whatsapp_btn: isEn ? "Open WhatsApp" : "Enviar Resumo no WhatsApp",
      back_home: isEn ? "Start over" : "Voltar para o início",
      timer_text: isEn ? "Cart saved for" : "Sua reserva salva por",
      input_name: isEn ? "Your name or nickname" : "Qual o seu nome ou apelido?",
      input_cep: isEn ? "ZIP Code (CEP)" : "CEP do local",
      input_addr: isEn ? "Street or Avenue" : "Rua ou Avenida",
      input_num: isEn ? "Number" : "Número",
      input_district: isEn ? "Neighborhood" : "Bairro",
      input_city: isEn ? "City" : "Cidade",
      input_comp: isEn ? "Apt, Block, etc (Optional)" : "Complemento (Opcional)",
      input_hotel: isEn ? "Hotel name" : "Nome do Hotel",
      input_room: isEn ? "Room / Suite Number" : "Quarto / Suíte",
      agree_terms: isEn ? "I read and agree" : "Eu li e estou de acordo",
      faq_title: isEn ? "Frequently Asked Questions" : "Tire as Suas Dúvidas",
      reviews_title: isEn ? "Experiences:" : "Quem já se permitiu:",
      empty_date: isEn ? "Tap a day above to see available times." : "Toque em um dia acima para ver os horários.",
      empty_slots: isEn ? "Schedule full for this day. Try the next one?" : "Minha agenda já está cheia nesse dia. Que tal tentar o próximo?",
      total_label: isEn ? "Total" : "Total",
      subtotal: isEn ? "Subtotal" : "Subtotal",
      discount: isEn ? "Discount" : "Desconto",
      pix_discount: isEn ? "Pix (3% OFF)" : "Pix (3% OFF)",
      get_coupon: isEn ? "Claim My Gift" : "Pegar Meu Presente",
      rules_complete: isEn ? "Mutual Agreement" : "Nossos Acordos",
      uber_notice: isEn ? "Travel fee (Uber) will be confirmed via WhatsApp." : "Importante: A taxa de deslocamento até você será confirmada no WhatsApp.",
      motel_note: isEn ? "My private suite address will be sent via WhatsApp after booking." : "Perfeito! Te envio o endereço da minha suíte pelo WhatsApp logo após finalizarmos.",
      menu_title: isEn ? "Menu" : "Configurações",
      level_yours: isEn ? "Your Level" : "Seu Progresso",
      level_current: isEn ? "XP" : "Pontos",
      level_journey: isEn ? "Progress" : "Evolução",
      menu_warning: isEn ? "* Progress saved in this browser. Avoid clearing cache." : "* Seus pontos ficam salvos no navegador. Evite apagar o cache.",
      theme_title: isEn ? "Appearance" : "Aparência",
      theme_dark: isEn ? "Dark" : "Escuro",
      theme_light: isEn ? "Light" : "Claro",
      refer_btn: isEn ? "Refer Someone" : "Indicar para um amigo",
      share_text: isEn ? 'I found the best massage to relieve all stress.' : 'Encontrei o melhor lugar para relaxar e soltar toda a tensão da rotina.',
      header_tensions: isEn ? "moments of relief" : "pessoas já atendidas",
      step_when: isEn ? "When" : "Quando",
      step_where: isEn ? "Where" : "Onde",
      step_summary: isEn ? "Summary" : "Resumo",
      cart_title: isEn ? "Cart:" : "Sua Seleção:",
      cart_edit: isEn ? "Edit" : "Editar",
      time_choose: isEn ? "Pick a time" : "Escolha o horário",
      time_rush: isEn ? "Rush" : "Pico",
      loc_home: isEn ? "Residence" : "Residência",
      loc_motel: isEn ? "My Suite" : "Minha Suíte",
      loc_hotel: isEn ? "Hotel" : "Hotel",
      summary_title: isEn ? "Order Summary" : "Resumo da Experiência",
      summary_items: isEn ? "SERVICES" : "O QUE VAMOS FAZER",
      summary_extras: isEn ? "EXTRAS" : "TOQUES ADICIONAIS",
      summary_info: isEn ? "SESSION DETAILS" : "DADOS DO ENCONTRO",
      summary_loc_home: isEn ? "At your residence" : "Na sua residência",
      summary_loc_motel: isEn ? "At my private suite" : "Na minha suíte",
      summary_loc_hotel: isEn ? "At a hotel" : "Em um hotel",
      coupon_applied: isEn ? "Coupon Applied" : "Presente Aplicado",
      xp_guaranteed: isEn ? "XP guaranteed" : "XP ganhos hoje",
      pay_pix: isEn ? "Pix (3% OFF)" : "Pix (3% OFF)",
      pay_card: isEn ? "Card" : "Cartão",
      pay_cash: isEn ? "Cash" : "Dinheiro em espécie",
      terms_read: isEn ? "Read the rules" : "Toque para ler os acordos",
      level_redeem: isEn ? "Claim Reward" : "Resgatar Recompensa",
      today: isEn ? "TODAY" : "HOJE",
      tomorrow: isEn ? "TOMORROW" : "AMANHÃ",
      popular_badge: isEn ? "Most Desired" : "A Mais Pedida",
      from: isEn ? "From" : "De",
      savings: isEn ? "YOU SAVE" : "VOCÊ ECONOMIZA",
      items_selected: isEn ? "selected" : "selecionado(s)",
      btn_finish_short: isEn ? "Finish" : "Finalizar",
      btn_next_short: isEn ? "Next" : "Próximo",
      msg_level_keep1: isEn ? "Only" : "Faltam apenas",
      msg_level_keep2: isEn ? "XP to unlock" : "XP para você desbloquear",
      msg_rush_fee: isEn ? "Rush Fee" : "Taxa de Pico",
      toast_loaded: isEn ? "Progress loaded!" : "Dados carregados!",
      toast_cart_toggle: isEn ? "Cart updated." : "Serviço alterado.",
      toast_pix_copied: isEn ? "PIX key copied!" : "Chave PIX copiada!",
      toast_copy: isEn ? "Copied!" : "Copiado!",
      morning: isEn ? "Morning" : "Manhã",
      afternoon: isEn ? "Afternoon" : "Tarde",
      evening: isEn ? "Evening" : "Noite",
      levelup_popup_title: isEn ? "Level Up!" : "Você evoluiu!",
      levelup_popup_msg: isEn ? "Your consistency generated rewards. A new exclusive benefit has been unlocked." : "Você tem cuidado de si com frequência, e isso merece recompensa. Benefício liberado.",
    },
    reviews: getFullReviews(lang)
  };
};

// ==================================================================================
// REFINED COMPONENTS
// ==================================================================================

const ToastContainer = memo(({ toasts, isDark }: { toasts: any[]; isDark: boolean }) => (
  <div aria-live="polite" className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none w-[90vw] max-w-sm">
    {toasts.map(t => (
      <div key={t.id} role="alert" className={`animate-toast-in pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl ${t.type === 'error' ? 'bg-red-950/90 border-red-500/50 text-red-100 shadow-[0_8px_30px_rgba(220,38,38,0.2)]' : isDark ? 'bg-[#181c25]/95 border-zinc-700 text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)]' : 'bg-white/95 border-slate-200 text-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.1)]'} backdrop-blur-md`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${t.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-500'}`}>
          <Icon name={t.type === 'error' ? 'alert-circle' : 'check'} size={14} />
        </div>
        <span className="text-xs sm:text-sm font-bold leading-snug break-words flex-1">{t.msg}</span>
      </div>
    ))}
  </div>
));

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon, className = '', loading = false, ariaLabel }: any) => {
  const base = "relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] gap-2 shrink-0 overflow-hidden";
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/20",
    secondary: "bg-white/5 border border-white/10 text-current hover:bg-white/10",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#22c55e] shadow-md shadow-green-900/20",
    outline: "border border-current text-current hover:bg-black/5",
    amber: "bg-amber-500 text-amber-950 hover:bg-amber-400 shadow-md shadow-amber-900/20",
  };
  const sizes: Record<string, string> = {
    sm: "min-h-[40px] py-2 px-4 text-xs rounded-xl",
    md: "min-h-[48px] py-3 px-6 text-sm rounded-xl",
    lg: "min-h-[52px] py-3 px-8 text-sm rounded-2xl",
    xl: "min-h-[56px] py-3 px-8 text-base rounded-2xl",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} aria-label={ariaLabel}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${full ? 'w-full' : ''} ${className}`}>
      {loading
        ? <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        : <>{icon && <Icon name={icon} size={20} className="shrink-0" />}<span className="break-words text-center">{children}</span></>}
    </button>
  );
});

const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', isDark = true, hasError = false, disabled = false, maxLength, id }: any) => {
  const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className={`space-y-1.5 w-full ${hasError ? 'animate-shake' : ''}`}>
      {label && (
        <label htmlFor={inputId} className={`block text-[10px] sm:text-xs font-bold uppercase tracking-widest pl-1 ${hasError ? 'text-red-400' : isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${hasError ? 'text-red-400' : isDark ? 'text-zinc-500 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}>
            <Icon name={icon} size={20} />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`input-field font-medium w-full min-h-[52px] rounded-xl text-sm transition-all border outline-none disabled:opacity-50 disabled:cursor-not-allowed ${icon ? 'pl-12 pr-4' : 'px-4'} ${hasError
            ? 'border-red-500/50 bg-red-950/10 text-red-400 placeholder:text-red-500/40'
            : isDark
              ? 'border-zinc-700 bg-white/5 text-white placeholder:text-zinc-500 focus:border-blue-500 focus:bg-white/10'
              : 'border-slate-300 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white'
          }`}
        />
      </div>
    </div>
  );
});

const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user, T }: any) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in" onClick={onClose} aria-hidden="true" />
      <aside role="dialog" aria-modal="true" aria-label={T.menu_title} className={`fixed top-0 right-0 h-full w-[85vw] max-w-[320px] z-[70] p-5 sm:p-6 shadow-2xl animate-slide-right flex flex-col ${isDark ? 'bg-[#11141a] border-l border-white/10' : 'bg-[#f9f8f6] border-l border-slate-200'}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-xl">{T.menu_title}</h2>
          <button onClick={onClose} aria-label="Fechar menu" className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${isDark ? 'hover:bg-white/10 text-zinc-400' : 'hover:bg-slate-200 text-slate-500'}`}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className={`mb-6 p-5 rounded-2xl border relative overflow-hidden ${isDark ? 'bg-blue-950/20 border-blue-900/50' : 'bg-blue-50 border-blue-200'}`}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{T.level_yours}</p>
          <div className="flex items-baseline gap-1.5 flex-wrap break-words">
            <span className="font-display text-3xl shrink-0">{user.xp}</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>XP</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto">
          <button onClick={toggleTheme} className={`w-full min-h-[52px] flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-zinc-200' : 'hover:bg-slate-100 text-slate-800'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <Icon name={isDark ? "moon" : "sun"} size={18} className={`shrink-0 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              <span className="text-sm font-bold truncate">{T.theme_title}</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>{isDark ? T.theme_dark : T.theme_light}</span>
          </button>
          <button onClick={() => { if (navigator.share) navigator.share({ title: 'Thalyson', text: T.share_text, url: window.location.href }); }} className={`w-full min-h-[52px] flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isDark ? 'hover:bg-white/5 text-zinc-200' : 'hover:bg-slate-100 text-slate-800'}`}>
            <Icon name="share" size={18} className="text-emerald-500 shrink-0" />
            <span className="text-sm font-bold truncate">{T.refer_btn}</span>
          </button>
        </nav>
      </aside>
    </>
  );
});

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`h-full flex flex-col p-5 sm:p-6 rounded-3xl border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}>
    <div className="flex items-start justify-between mb-4 gap-3">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold font-display shrink-0 ${isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          {review.n.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className={`text-sm font-bold block truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{review.n}</h3>
          <span className={`text-xs block font-medium truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-0.5 shrink-0">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} name="star" size={12} className={i < review.s ? 'text-amber-400 fill-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'} />
        ))}
      </div>
    </div>
    <div className={`inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 border truncate max-w-full ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
      <Icon name="award" size={10} className="shrink-0" /> {review.serv}
    </div>
    <p className={`text-sm leading-relaxed font-medium italic flex-1 break-words-all ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>"{review.t}"</p>
  </article>
));

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b last:border-b-0 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
      <button onClick={() => setOpen(!open)} aria-expanded={open} className="w-full py-5 flex items-center justify-between text-left gap-4 min-h-[56px]">
        <h3 className={`text-sm font-bold leading-snug flex-1 break-words pr-2 ${isDark ? 'text-zinc-200' : 'text-slate-900'}`}>{q}</h3>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${open ? 'rotate-180' : ''} ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          <Icon name="chevron-down" size={18} />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`text-sm leading-relaxed font-medium break-words ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{a}</p>
      </div>
    </div>
  );
});

const SmartTimer = memo(({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  useEffect(() => {
    const i = setInterval(() => setTime(p => p <= 0 ? 600 : p - 1), 1000);
    return () => clearInterval(i);
  }, []);
  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  const pct = (time / 600) * 100;
  return (
    <div className={`flex items-center gap-4 p-4 rounded-3xl border w-full overflow-hidden ${isDark ? 'bg-blue-950/20 border-blue-900/40' : 'bg-blue-50 border-blue-200'}`}>
      <div className={`relative w-12 h-12 shrink-0`}>
        <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke={isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.15)'} strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${pct * 0.942} 100`} className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="clock" size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>{text}</p>
        <p className={`font-display text-xl sm:text-2xl whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>{fmt(time)}</p>
      </div>
    </div>
  );
});

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <article className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-200 text-slate-700'}`}>
      <Icon name={rule.icon} size={20} />
    </div>
    <div className="min-w-0 flex-1">
      <h4 className={`text-sm font-bold mb-1 font-display break-words ${isDark ? 'text-white' : 'text-slate-900'}`}>{rule.title}</h4>
      <p className={`text-xs sm:text-sm leading-relaxed font-medium break-words ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{rule.description}</p>
    </div>
  </article>
));

const ServiceModal = memo(({ service, isOpen, onClose, onSelect, isInCart, isDark, T, lang, isPack }: any) => {
  if (!isOpen || !service) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div role="dialog" aria-modal="true" className={`relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl border shadow-2xl animate-scale-in overflow-hidden ${isDark ? 'bg-[#181c25] border-zinc-700' : 'bg-white border-slate-200'}`}>
        <div className={`relative p-5 pb-4 shrink-0 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'} ${isPack ? (isDark ? 'bg-amber-950/20' : 'bg-amber-50/50') : ''}`}>
          <button onClick={onClose} aria-label="Fechar" className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
            <Icon name="x" size={18} />
          </button>
          <div className="flex items-center gap-3 mb-3 pr-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${isPack ? isDark ? 'bg-amber-900/30 border-amber-800 text-amber-500' : 'bg-amber-100 border-amber-200 text-amber-700' : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
              <Icon name={service.icon} size={20} />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 flex-wrap mb-0.5">
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${isPack ? isDark ? 'border-amber-800/50 text-amber-500' : 'border-amber-300 text-amber-800' : isDark ? 'border-zinc-700 text-zinc-400' : 'border-slate-300 text-slate-600'}`}>
                   {service.tag}
                 </span>
                 {service.popular && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-blue-600 text-white">{T.popular_badge}</span>}
               </div>
               <h2 className={`font-display text-lg sm:text-xl font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{service.title}</h2>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`font-display text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatMoney(service.price, lang)}</span>
            {service.fullPrice && <span className={`text-xs font-bold line-through ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{formatMoney(service.fullPrice, lang)}</span>}
          </div>
        </div>
        <div className={`flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide ${isDark ? 'text-zinc-300' : 'text-slate-800'}`}>
          <p className="text-sm leading-relaxed font-medium">{service.desc}</p>
          <div>
            <h4 className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.details_label}</h4>
            <div className="space-y-3">
              {service.details.split('\n').map((line: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm font-medium">
                  <div className={`mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isPack ? isDark ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-100 text-amber-700' : isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                    <Icon name="check" size={10} />
                  </div>
                  <span className="leading-relaxed flex-1">{line.replace(/^\d+\.\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={`p-4 border-t shrink-0 ${isDark ? 'border-zinc-800 bg-[#181c25]' : 'border-slate-100 bg-white'}`}>
          <Button full size="lg" variant={isInCart ? 'outline' : isPack ? 'amber' : 'primary'} onClick={() => { onSelect(service); onClose(); }}>
            {isInCart ? (lang === 'en' ? 'Remove' : 'Remover') : (lang === 'en' ? 'Select' : 'Selecionar')}
          </Button>
        </div>
      </div>
    </div>
  );
});

const ServiceCard = memo(({ service, isInCart, onToggle, isDark, T, lang, isPack = false, onOpenModal }: any) => {
  return (
    <button className={`relative w-full text-left rounded-2xl border transition-all duration-200 card-hover flex flex-col h-auto min-h-[120px] ${isInCart ? isPack ? 'service-card-selected-amber border-amber-500/50 bg-amber-500/10' : 'service-card-selected border-blue-500/50 bg-blue-500/5' : isDark ? 'bg-[#181c25] border-zinc-700 hover:border-zinc-600' : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'}`} onClick={() => onOpenModal(service)}>
      {isInCart && (
        <div className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center animate-scale-in shrink-0 ${isPack ? 'bg-amber-500 text-amber-950' : 'bg-blue-600 text-white'}`}>
          <Icon name="check" size={14} />
        </div>
      )}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${isPack ? isDark ? 'bg-amber-900/30 border-amber-800/50 text-amber-500' : 'bg-amber-50 border-amber-200 text-amber-600' : isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
            <Icon name={service.icon} size={20} />
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h3 className={`text-base font-bold leading-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
            <p className={`text-xs mt-1 leading-relaxed font-medium line-clamp-2 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{service.desc}</p>
          </div>
        </div>
        <div className="flex items-end justify-between mt-auto gap-2">
          <div className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border truncate max-w-[50%] ${isPack ? isDark ? 'border-amber-800/50 text-amber-500' : 'border-amber-300 text-amber-700' : isDark ? 'border-zinc-700 text-zinc-400' : 'border-slate-300 text-slate-700'}`}>
            {service.tag}
          </div>
          <div className="text-right shrink-0">
            {service.fullPrice && <p className={`text-[10px] font-bold line-through mb-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{formatMoney(service.fullPrice, lang)}</p>}
            <p className={`font-display text-lg sm:text-xl leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatMoney(service.price, lang)}</p>
          </div>
        </div>
      </div>
    </button>
  );
});

// ==================================================================================
// FLOATING WHATSAPP COMPONENT (ANIMATED WIDGET)
// ==================================================================================
const FloatingWhatsApp = memo(({ isDark, lang, onClick }: any) => {
  const [showMsg, setShowMsg] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 5000); // Mostra o balão por 5 segundos
    }, 15000); // Repete a cada 15 segundos
    
    // Mostra pela primeira vez logo após carregar
    setTimeout(() => setShowMsg(true), 2000);
    
    return () => clearInterval(interval);
  }, []);

  const msg = lang === 'en' ? 'Hi! Need any help?' : 'Olá! Precisa de ajuda?';

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-24 sm:right-6 z-50 flex items-center gap-4 pointer-events-none">
      
      {/* Balão de Mensagem (Abre e Fecha com animação fluida lateral) */}
      <div 
        className={`pointer-events-auto transition-all duration-500 origin-right ${
          showMsg ? 'scale-100 opacity-100 translate-x-0' : 'scale-90 opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        <div 
          className={`px-4 py-3 rounded-2xl shadow-xl relative cursor-pointer border max-w-[220px] flex items-center ${
            isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'
          }`} 
          onClick={onClick}
        >
          <p className={`text-sm font-bold leading-snug ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
            {msg}
          </p>
          {/* Seta do balão apontando para a foto */}
          <div className={`absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rotate-45 border-t border-r ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'}`} />
        </div>
      </div>

      {/* Foto de Perfil + Badge do WhatsApp */}
      <button
        onClick={onClick}
        className="pointer-events-auto relative shrink-0 hover:scale-105 transition-transform"
        aria-label="Contato WhatsApp"
      >
        {/* Contêiner da Foto com borda */}
        <div className={`w-14 h-14 rounded-full overflow-hidden border-[3px] shadow-[0_4px_20px_rgba(37,211,102,0.4)] ${isDark ? 'border-[#25D366]' : 'border-[#25D366]'}`}>
          <img 
            src="https://i.ibb.co/gZxp3Dwz/Screenshot-1.png" 
            alt="Contato" 
            className="w-full h-full object-cover" 
          />
        </div>
        {/* Ícone verde sobreposto (badge perfeitamente posicionado) */}
        <div className={`absolute -bottom-1 -right-1 w-7 h-7 bg-[#25D366] rounded-full flex items-center justify-center shadow-md border-2 ${isDark ? 'border-[#11141a]' : 'border-white'}`}>
          <Icon name="message-circle" size={14} className="text-white" />
        </div>
      </button>

    </div>
  );
});

// ==================================================================================
// ROULETTE COMPONENT
// ==================================================================================
const PRIZES = [
  { val: 5, color: '#f59e0b' },   // 0: Amber
  { val: 10, color: '#2563eb' },  // 1: Blue
  { val: 5, color: '#f59e0b' },   // 2: Amber
  { val: 15, color: '#10b981' },  // 3: Emerald
  { val: 5, color: '#f59e0b' },   // 4: Amber
  { val: 10, color: '#2563eb' },  // 5: Blue
  { val: 5, color: '#f59e0b' },   // 6: Amber
  { val: 20, color: '#e11d48' },  // 7: Rose
];

const TigrinhoRoulette = memo(({ isOpen, isDark, lang, onWin, onClose }: any) => {
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'won'>('idle');
  const [rotation, setRotation] = useState(0);
  const [winValue, setWinValue] = useState(0);

  const spinWheel = () => {
    if (phase !== 'idle') return;
    setPhase('spinning');
    vibrate([50, 50, 50]);
    
    const r = Math.random();
    let targetVal;
    if (r < 0.6) targetVal = 10;
    else if (r < 0.85) targetVal = 5;
    else if (r < 0.95) targetVal = 15;
    else targetVal = 20;

    const validIndices = PRIZES.map((p, i) => p.val === targetVal ? i : -1).filter(i => i !== -1);
    const targetIndex = validIndices[Math.floor(Math.random() * validIndices.length)];
    
    const targetAngle = 360 - (targetIndex * 45); 
    const extraSpins = 360 * (5 + Math.floor(Math.random() * 3)); 
    const randomOffset = Math.floor(Math.random() * 30) - 15; 
    
    const finalRotation = rotation + extraSpins + targetAngle + randomOffset;
    setRotation(finalRotation);

    setTimeout(() => {
      setWinValue(targetVal);
      setPhase('won');
      vibrate([100, 50, 200]);
    }, 5000); 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div role="dialog" aria-modal="true" className={`relative w-full max-w-sm rounded-[2rem] p-6 text-center border shadow-2xl animate-scale-in flex flex-col items-center ${isDark ? 'bg-[#181c25] border-amber-900/50 shadow-[0_0_50px_rgba(245,158,11,0.15)]' : 'bg-white border-amber-200'}`}>
        {/* BOTÃO DE FECHAR */}
        <button onClick={onClose} aria-label="Fechar" className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-50 ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}>
          <Icon name="x" size={18} />
        </button>

        <h3 className={`font-display text-2xl mb-1 mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {lang === 'en' ? 'Spin & Win!' : 'Gire e Ganhe!'}
        </h3>
        <p className={`text-xs font-bold mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          {lang === 'en' ? 'Your welcome gift awaits.' : 'Seu presente de boas-vindas aguarda.'}
        </p>

        <div className="relative w-64 h-64 mb-8">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-8 flex items-center justify-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 text-white drop-shadow-xl z-20">
              <path d="M12 22L2 2h20L12 22z" />
            </svg>
          </div>
          
          <div 
            className="w-full h-full rounded-full overflow-hidden border-[8px] border-[#11141a] shadow-inner relative"
            style={{ 
              transition: 'transform 5s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(from -22.5deg, 
                #f59e0b 0 45deg, 
                #2563eb 45deg 90deg, 
                #f59e0b 90deg 135deg, 
                #10b981 135deg 180deg, 
                #f59e0b 180deg 225deg, 
                #2563eb 225deg 270deg, 
                #f59e0b 270deg 315deg, 
                #e11d48 315deg 360deg)`
            }}
          >
            {PRIZES.map((p, i) => (
              <div key={i} className="absolute inset-0 origin-center" style={{ transform: `rotate(${i * 45}deg)` }}>
                <div className="absolute top-3 left-1/2 -translate-x-1/2 text-white font-bold font-display text-lg drop-shadow-md">
                  {p.val}
                </div>
                <div className="absolute top-0 left-1/2 w-0.5 h-1/2 bg-white/20 origin-bottom" style={{ transform: 'translateX(-50%) rotate(22.5deg)' }} />
              </div>
            ))}
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#11141a] border-4 border-amber-500 flex items-center justify-center shadow-lg z-10">
              <Icon name="star" size={16} className="text-amber-500 fill-amber-500" />
            </div>
          </div>
          
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{ padding: '-4px' }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="absolute w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,1)]"
                style={{
                  top: '50%', left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-128px)`,
                  animation: `pulse 1s infinite ${i * 0.1}s alternate`
                }}
              />
            ))}
          </div>
        </div>

        {phase === 'idle' && (
          <Button full size="lg" variant="amber" onClick={spinWheel} className="animate-pulse-slow">
            {lang === 'en' ? 'SPIN ROULETTE' : 'GIRAR ROLETA'}
          </Button>
        )}
        
        {phase === 'spinning' && (
          <Button full size="lg" disabled variant="secondary" className="opacity-50">
            {lang === 'en' ? 'Spinning...' : 'Girando...'}
          </Button>
        )}

        {phase === 'won' && (
          <div className="animate-fade-up w-full">
            <p className={`font-display text-2xl mb-4 text-amber-500`}>
              {lang === 'en' ? 'You Won R$' : 'Você Ganhou R$'} {winValue}!
            </p>
            <Button full size="lg" variant="amber" onClick={() => onWin(winValue)}>
              {lang === 'en' ? 'Claim My Discount' : 'Pegar Meu Desconto'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

// Category Section Configuration
const CATEGORY_CONFIG: Record<string, { color: string; borderColor: string; bg: string; lightBg: string }> = {
  relax: { color: '#3b82f6', borderColor: 'rgba(59,130,246,0.2)', bg: 'rgba(59,130,246,0.03)', lightBg: 'rgba(59,130,246,0.02)' },
  express: { color: '#10b981', borderColor: 'rgba(16,185,129,0.2)', bg: 'rgba(16,185,129,0.03)', lightBg: 'rgba(16,185,129,0.02)' },
  final: { color: '#f59e0b', borderColor: 'rgba(245,158,11,0.2)', bg: 'rgba(245,158,11,0.03)', lightBg: 'rgba(245,158,11,0.02)' },
  care: { color: '#ec4899', borderColor: 'rgba(236,72,153,0.2)', bg: 'rgba(236,72,153,0.03)', lightBg: 'rgba(236,72,153,0.02)' },
};

// ==================================================================================
// MAIN APP
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const [activeTab, setActiveTab] = useState('single');
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'error' }[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [showRoulette, setShowRoulette] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [hasErrorGlobal, setHasErrorGlobal] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);
  const [manualCoupon, setManualCoupon] = useState('');

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState<UserData>({
    name: '', xp: 0, coupons: [], usedCoupons: [], hasSeenWelcome: false, ordersCount: 92, lastActivity: new Date().toISOString()
  });

  const [booking, setBooking] = useState<BookingData>({
    type: 'single', cart: [], extras: {}, date: null, time: null, locationType: 'home',
    address: { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false, bookingId: `BOOK_${Date.now()}`, customExtraText: ''
  });

  const dateScrollRef = useRef<HTMLDivElement>(null);
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(p => [...p.slice(-2), { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);

  const openExternal = useCallback((platform: 'whatsapp' | 'instagram', text?: string) => {
    const url = platform === 'whatsapp' ? `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text || '')}` : CONFIG.INSTAGRAM_URL;
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer';
    document.body.appendChild(a); a.click();
    setTimeout(() => document.body.removeChild(a), 100);
  }, []);

  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
    if (isWebViewUserAgent() && /android/i.test(navigator.userAgent)) {
      window.location.href = `intent://${window.location.href.replace(/^https?:\/\//i, '')}#Intent;scheme=https;package=com.android.chrome;end`;
    }
  }, []);

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
            hasSeenWelcome: !!parsed.user.hasSeenWelcome,
            ordersCount: typeof parsed.user.ordersCount === 'number' ? Math.max(parsed.user.ordersCount, 92) : 92,
            lastActivity: parsed.user.lastActivity || new Date().toISOString()
          };
        }
        if (parsed.bookingDraft && Array.isArray(parsed.bookingDraft.cart)) {
          const draftDate = parsed.bookingDraft.date ? new Date(parsed.bookingDraft.date) : null;
          if (!draftDate || draftDate > new Date()) {
            loadedBooking = {
              ...booking, ...parsed.bookingDraft,
              cart: parsed.bookingDraft.cart || [],
              extras: typeof parsed.bookingDraft.extras === 'object' ? parsed.bookingDraft.extras : {},
              customExtraText: sanitizeInput(parsed.bookingDraft.customExtraText || ''),
              address: {
                cep: sanitizeInput(parsed.bookingDraft.address?.cep || ''),
                street: sanitizeInput(parsed.bookingDraft.address?.street || ''),
                number: sanitizeInput(parsed.bookingDraft.address?.number || ''),
                district: sanitizeInput(parsed.bookingDraft.address?.district || ''),
                city: sanitizeInput(parsed.bookingDraft.address?.city || ''),
                comp: sanitizeInput(parsed.bookingDraft.address?.comp || ''),
                placeName: sanitizeInput(parsed.bookingDraft.address?.placeName || '')
              }
            };
            if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) loadedStep = parsed.step;
          }
        }
      }
    } catch {}
    setUser(loadedUser);
    setBooking(loadedBooking);
    setStep(loadedStep);
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 600);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  useEffect(() => {
    if (isClient && dataLoaded) {
      try {
        const save = { user: { ...user, lastActivity: new Date().toISOString() }, bookingDraft: { ...booking }, step };
        const s = JSON.stringify(save);
        if (s.length < CONFIG.MAX_STORAGE_SIZE * 1024) localStorage.setItem(CONFIG.STORAGE_KEY, s);
      } catch {}
    }
  }, [user, booking, step, isClient, dataLoaded]);

  useEffect(() => {
    if (!loading && isClient && dataLoaded) {
      if (!user.hasSeenWelcome) {
        const t = setTimeout(() => setShowRoulette(true), 1500);
        return () => clearTimeout(t);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, isClient, dataLoaded]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const handleToggleCartItem = useCallback((item: ServiceItem) => {
    vibrate(50);
    setBooking(prev => {
      const exists = prev.cart.find(c => c.id === item.id);
      return {
        ...prev,
        cart: exists ? prev.cart.filter(c => c.id !== item.id) : [...prev.cart, item],
        payment: '', termsAccepted: false
      };
    });
    addToast(T.toast_cart_toggle);
  }, [addToast, T]);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const masked = maskCEP(raw);
    setBooking(b => ({ ...b, address: { ...b.address, cep: masked } }));

    if (masked.length === 9) {
      setIsFetchingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setBooking(b => ({
            ...b, address: { ...b.address, cep: masked, street: data.logradouro || b.address.street, district: data.bairro || b.address.district, city: data.localidade || b.address.city }
          }));
          addToast(T.toast_cep_found, 'success');
          vibrate([50, 50]);
        } else { addToast(T.toast_cep_error, 'error'); }
      } catch (err) { /* silent fail */ } finally { setIsFetchingCep(false); }
    }
  };

  const getDayLabel = useCallback((d: Date) => {
    const today = new Date(); const tmrw = new Date(today); tmrw.setDate(today.getDate() + 1); 
    if (d.toDateString() === today.toDateString()) return T.today;
    if (d.toDateString() === tmrw.toDateString()) return T.tomorrow;
    return d.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { weekday: 'short' }).slice(0, 3).toUpperCase();
  }, [T.today, T.tomorrow, lang]);

  const daysArray = useMemo(() => {
    const days = []; const today = new Date();
    for (let i = 0; i < 30; i++) { const d = new Date(today); d.setDate(today.getDate() + i); days.push(d); }
    return days;
  }, []);

  const generateTimeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) slots.push(`${i < 10 ? '0' : ''}${i}:00`);
    const now = new Date(); const sel = new Date(booking.date);
    if (isNaN(sel.getTime())) return [];
    if (sel.toDateString() === now.toDateString()) {
      const cur = now.getHours();
      return slots.filter(t => { const [h] = t.split(':').map(Number); return h > cur; });
    }
    return slots;
  }, [booking.date]);

  const groupedTimeSlots = useMemo(() => {
    const morning = generateTimeSlots.filter(t => { const h = parseInt(t); return h >= 8 && h < 12; });
    const afternoon = generateTimeSlots.filter(t => { const h = parseInt(t); return h >= 12 && h < 17; });
    const evening = generateTimeSlots.filter(t => { const h = parseInt(t); return h >= 17 && h <= 22; });
    return { morning, afternoon, evening };
  }, [generateTimeSlots]);

  const financials = useMemo(() => {
    if (booking.cart.length === 0) return { total: 0, sub: 0, disc: 0, pixDisc: 0, rushFee: 0, duration: 0 };
    let sub = 0; let baseDuration = 0;
    const isPack = booking.cart.some(i => i.type === 'pack');
    booking.cart.forEach(item => { sub += item.price; if (!isPack) baseDuration += (item.min || 60); });
    if (isPack) baseDuration = 60;
    let addedTime = 0;
    Object.keys(booking.extras || {}).forEach(k => {
      if (booking.extras[k]) {
        const ex = DATA.extras.find((e: any) => e.id === k);
        if (ex) { sub += isPack ? Math.floor(ex.price * 0.8) : ex.price; if (ex.id === 'more_time') addedTime += 30; }
      }
    });

    if ((booking.customExtraText || '').trim().length > 0) {
      sub += 150;
    }

    const duration = baseDuration + addedTime;
    const isRush = RUSH_HOURS.includes(booking.time || '');
    const rushFee = (isRush && booking.locationType !== 'motel') ? RUSH_FEE : 0;
    const disc = booking.appliedCoupon ? (booking.appliedCoupon.code === 'RETORNO10' ? sub * 0.10 : booking.appliedCoupon.val) : 0;
    let running = Math.max(0, sub - disc);
    let pixDisc = 0;
    if (booking.payment === 'pix') pixDisc = Math.ceil(running * 0.03);
    return { sub, disc, pixDisc, rushFee, total: Math.max(0, running - pixDisc) + rushFee, duration };
  }, [booking.cart, booking.extras, booking.customExtraText, booking.appliedCoupon, DATA.extras, booking.payment, booking.time, booking.locationType]);

  const estimatedXP = useMemo(() => {
    const isPack = booking.cart.some(i => i.type === 'pack');
    return Math.floor(financials.total * (isPack ? 0.30 : 0.15));
  }, [financials.total, booking.cart]);

  const getCurrentLevelProgress = () => {
    if (user.xp >= 800) return (((user.xp - 800) % 500) / 500) * 100;
    const rev = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
    const ri = rev === -1 ? 0 : DATA.levels.length - 1 - rev;
    const cur = DATA.levels[ri]; const next = DATA.levels[ri + 1];
    if (!next) return 100;
    return Math.min(100, Math.max(0, ((user.xp - cur.xpNeeded) / (next.xpNeeded - cur.xpNeeded)) * 100));
  };

  const getCurrentLevelTitle = () => {
    if (user.xp >= 800) return "Plenitude Plus";
    return DATA.levels.slice().reverse().find(l => user.xp >= l.xpNeeded)?.title || DATA.levels[0].title;
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
      vibrate([50, 50]); setHasErrorGlobal(true); setTimeout(() => setHasErrorGlobal(false), 500);
      const msgs: Record<number, string> = { 0: T.toast_select_item, 1: !user.name || String(user.name).trim().length < 3 ? T.toast_fill_name : T.toast_fill_addr, 2: T.toast_select_date, 3: T.toast_accept_terms };
      addToast(msgs[step] || '', 'error');
      return;
    }
    vibrate(30);
    if (step === 3) finishBooking(); else setStep(s => s + 1);
  }, [step, booking, user.name, T, addToast, isStepValid]);

  const generateWhatsAppMsg = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : '';
    const hash = btoa(encodeURIComponent(`${f.total}-${dateStr}-${booking.cart[0]?.id || ''}-${CONFIG.SECRET_TOKEN}`)).substring(0, 8).toUpperCase();
    const isEn = lang === 'en';

    const servicesText = booking.cart.map(item => {
      return `▪️ *${item.title}*\n_${item.desc}_\n${item.details.split('\n').map(l => `  ▫️ ${l.replace(/^\d+\.\s*/, '')}`).join('\n')}`;
    }).join('\n\n');

    let locTxt = '', mapQ = '';
    if (booking.locationType === 'home') { 
      const a = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`; 
      locTxt = `🏡 *${isEn ? 'Residence' : 'Residência'}*\n  ${a}\n  ${booking.address.comp ? `Det: ${booking.address.comp}` : ''}`.trim(); 
      mapQ = a; 
    } else if (booking.locationType === 'motel') {
      locTxt = `🔑 *${isEn ? 'My Suite' : 'Minha Suíte'}*\n  ${isEn ? '(Address sent upon confirmation)' : '(Endereço enviado após confirmação)'}`;
    } else { 
      const a = `${booking.address.placeName}, ${booking.address.city}`; 
      locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n  Cidade: ${booking.address.city}\n  Quarto: ${booking.address.comp || '-'}`; 
      mapQ = a; 
    }
    
    const extrasArr = Object.keys(booking.extras || {}).filter(k => booking.extras[k]).map(k => { 
      const ex = DATA.extras.find((e: any) => e.id === k); 
      return ex ? `  ➕ ${ex.label}` : ''; 
    });

    if ((booking.customExtraText || '').trim().length > 0) {
      extrasArr.push(`  ➕ ${isEn ? 'Custom Request' : 'Pedido Especial'}: ${booking.customExtraText.trim()} (+R$ 150,00)`);
    }

    const extrasList = extrasArr.filter(Boolean).join('\n');
    
    let prices = `*Subtotal:* ${formatMoney(f.sub, lang)}`;
    if (f.disc > 0) prices += `\n*Benefício (${booking.appliedCoupon?.code}):* -${formatMoney(f.disc, lang)}`;
    if (f.pixDisc > 0) prices += `\n*PIX (3% OFF):* -${formatMoney(f.pixDisc, lang)}`;
    if (f.rushFee > 0) prices += `\n*Taxa Pico/Deslocamento:* +${formatMoney(f.rushFee, lang)}`;
    prices += `\n\n💰 *INVESTIMENTO TOTAL: ${formatMoney(f.total, lang)}*`;
    
    const mapLink = mapQ ? `\n📍 *Mapa:* https://www.google.com/maps/search/?api=1&query=$${encodeURIComponent(mapQ)}` : '';
    
    return (isEn 
      ? `*RESERVATION REQUEST* | #${hash}\n──────────────────\nHello Thalyson. I'm ready to disconnect and renew my energies.\n\n👤 *Name:* ${sanitizeInput(user.name)}\n📅 *Date:* ${dateStr} at ${booking.time}\n⏳ *Total Time:* ~${f.duration} min\n\n*YOUR EXPERIENCE:*\n${servicesText}\n\n${extrasList ? `*Add-ons:*\n${extrasList}\n\n` : ''}*LOCATION:*\n${locTxt}${mapLink}\n\n${booking.locationType !== 'motel' ? `(Travel fee to be confirmed)\n` : ''}\n*Health Status:* 100% healthy.\n\n*VALUES:*\n${prices}\n*Payment:* ${booking.payment.toUpperCase()}\n──────────────────\n_I have read and agree to the guidelines._` 
      : `*PEDIDO DE SESSÃO* | #${hash}\n──────────────────\nOlá Thalyson. Estou precisando me desconectar e renovar minhas energias.\n\n👤 *Meu nome:* ${sanitizeInput(user.name)}\n📅 *Quando:* ${dateStr} às ${booking.time}\n⏳ *Tempo reservado:* ~${f.duration} min\n\n*A EXPERIÊNCIA:*\n${servicesText}\n\n${extrasList ? `*Complementos:*\n${extrasList}\n\n` : ''}*ONDE VAI SER:*\n${locTxt}${mapLink}\n\n${booking.locationType !== 'motel' ? `(Taxa de Uber será confirmada no chat)\n` : ''}\n*Saúde:* Declaro estar 100% saudável.\n\n*VALORES:*\n${prices}\n*Pagamento:* ${booking.payment.toUpperCase()}\n──────────────────\n_Estou ciente e aceito os acordos de acolhimento e respeito._`
    ).trim();
  };

  const finishBooking = () => {
    vibrate([100, 50, 100, 50, 100]);
    let updatedCoupons = [...user.coupons];
    let updatedHistory = [...user.usedCoupons];
    if (booking.appliedCoupon && booking.appliedCoupon.id !== 'manual') {
      if (!updatedHistory.includes(booking.appliedCoupon.code)) updatedHistory.push(booking.appliedCoupon.code);
      updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon?.code);
    }
    const newXP = user.xp + estimatedXP;
    let leveledUp = false;
    DATA.levels.forEach(lvl => {
      if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
        leveledUp = true;
        updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `${lvl.title}`, code: `LVLUP${lvl.level}` });
      }
    });
    if (newXP > 800) {
      const oldL = Math.floor(Math.max(0, user.xp - 800) / 500);
      const newL = Math.floor(Math.max(0, newXP - 800) / 500);
      if (newL > oldL) { leveledUp = true; for (let i = oldL + 1; i <= newL; i++) updatedCoupons.push({ id: `LOOP_${i}_${Date.now()}`, val: DATA.levels[3].reward, title: `Plenitude Plus`, code: `PLUS${i}` }); }
    }
    setUser(p => ({ ...p, xp: newXP, coupons: updatedCoupons, usedCoupons: updatedHistory, ordersCount: (p.ordersCount || 92) + 1, lastActivity: new Date().toISOString() }));
    if (leveledUp) { setLevelUpPopup(true); setTimeout(() => addToast(T.levelup_popup_title, 'success'), 500); }
    openExternal('whatsapp', generateWhatsAppMsg());
    setStep(4);
  };

  const scrollDates = (dir: 'left' | 'right') => {
    dateScrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const categoryConfig = [
    { id: 'relax', title: lang === 'en' ? "Just Relax" : "Relaxamento", icon: 'sun', desc: lang === 'en' ? "Therapeutic body work to relieve stress." : "Tire a tensão e o peso das costas." },
    { id: 'express', title: lang === 'en' ? "Express Care" : "Cuidado Rápido", icon: 'watch', desc: lang === 'en' ? "Quick localized relief for hands and feet." : "Alívio focado em mãos e pés cansados." },
    { id: 'final', title: lang === 'en' ? "With Ending" : "Com Finalização", icon: 'sparkles', desc: lang === 'en' ? "A complete and intense sensory journey." : "A jornada completa com relaxamento final." },
    { id: 'care', title: lang === 'en' ? "Personal Care" : "Estética", icon: 'scissors', desc: lang === 'en' ? "Aesthetic body maintenance." : "Manutenção para um corpo impecável." },
  ];

  if (!isClient) return <div className="min-h-screen w-full bg-[#11141a]" />;

  if (loading) {
    return (
      <div className={`fixed inset-0 flex flex-col items-center justify-center z-[100] ${isDark ? 'bg-[#11141a]' : 'bg-[#f9f8f6]'}`}>
        <div className="flex flex-col items-center w-[200px] text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl scale-[1.5] animate-pulse" />
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-2xl border border-blue-400/20">
              <span className="font-display text-4xl font-bold text-white">T</span>
            </div>
          </div>
          <p className={`text-xs uppercase font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles isDark={isDark} />
      <ToastContainer toasts={toasts} isDark={isDark} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark(p => !p)} user={user} T={T} />
      
      <ServiceModal 
        service={selectedServiceForModal} isOpen={!!selectedServiceForModal} onClose={() => setSelectedServiceForModal(null)}
        onSelect={handleToggleCartItem} isInCart={selectedServiceForModal ? booking.cart.some(c => c.id === selectedServiceForModal.id) : false}
        isDark={isDark} T={T} lang={lang} isPack={selectedServiceForModal?.type === 'pack'}
      />

      <TigrinhoRoulette
        isOpen={showRoulette}
        isDark={isDark}
        lang={lang}
        onClose={() => setShowRoulette(false)}
        onWin={(val: number) => {
          setShowRoulette(false);
          const code = `ROLETASORTE${val}`;
          const c: Coupon = { id: `roleta_${Date.now()}`, val, title: lang === 'en' ? `Lucky Spin Bonus (R$ ${val})` : `Bônus Roleta (R$ ${val})`, code };
          setUser(u => ({ ...u, hasSeenWelcome: true, coupons: [...u.coupons, c] }));
          setBooking(b => ({ ...b, appliedCoupon: c }));
          addToast(lang === 'en' ? `R$ ${val} gift added!` : `Presente de R$ ${val} adicionado!`, 'success');
        }}
      />

      {/* ── NOVO BOTÃO WHATSAPP FLUTUANTE ANIMADO ── */}
      <FloatingWhatsApp 
        isDark={isDark} 
        lang={lang} 
        onClick={() => openExternal('whatsapp', 'Olá, estava no site relaxarhoje.com e gostaria de tirar uma dúvida.')} 
      />

      <main className={`min-h-screen relative z-10 pb-40 px-4 sm:px-6 max-w-3xl mx-auto overflow-x-hidden`}>

        {step !== 4 && (
          <header className="pt-6 pb-6 sm:pt-10 sm:pb-8">
            <div className="flex items-center justify-between gap-4">
              <button onClick={() => setStep(0)} className="group text-left" aria-label="Voltar para o início">
                <h1 className={`font-display text-2xl sm:text-3xl font-bold leading-tight mb-1 transition-opacity group-hover:opacity-80 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Thalyson Massagens
                </h1>
                <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                  </span>
                  {lang === 'en' ? `${user.ordersCount}+ ${T.header_tensions}` : `+${user.ordersCount} ${T.header_tensions}`}
                </div>
              </button>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')} className={`relative h-10 w-10 flex items-center justify-center rounded-xl border transition-all ${isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'}`}>
                  <Icon name="globe" size={18} />
                </button>
                <button onClick={() => openExternal('instagram')} className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all ${isDark ? 'border-zinc-800 bg-zinc-900 text-pink-500 hover:text-pink-400' : 'border-slate-200 bg-white text-pink-600 hover:text-pink-500'}`}>
                  <Icon name="instagram" size={18} />
                </button>
                <button onClick={() => setMenuOpen(true)} className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all ${isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'}`}>
                  <Icon name="menu" size={18} />
                </button>
              </div>
            </div>

            {step > 0 && step < 4 && (
              <nav aria-label="Progresso do agendamento" className="mt-6 sm:mt-8 flex items-center gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 cursor-pointer" onClick={() => { if (i < step) setStep(i); }}>
                    <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${step > i ? 'bg-blue-600' : step === i ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : isDark ? 'bg-zinc-800' : 'bg-slate-200'}`} />
                    <span className={`text-[9px] uppercase font-bold tracking-widest ${step >= i ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                      {i === 1 ? T.step_where : i === 2 ? T.step_when : T.step_summary}
                    </span>
                  </div>
                ))}
              </nav>
            )}
          </header>
        )}

        <div>
          {/* ═══════════════════════════════════════════════════════
              STEP 0 — SERVICE SELECTION
          ═══════════════════════════════════════════════════════ */}
          {step === 0 && (
            <section className="animate-fade-up space-y-8 sm:space-y-12">

              <div className="flex flex-col gap-6">
                <h2 className={`font-display font-bold text-2xl sm:text-3xl leading-[1.2] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.welcome} <span className="text-blue-500">{user.name ? String(user.name).trim().split(' ')[0] : T.welcome_anon}</span>
                </h2>

                <article className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="relative shrink-0">
                    <div className={`w-20 h-20 rounded-2xl overflow-hidden border p-0.5 ${isDark ? 'border-blue-900' : 'border-blue-200'}`}>
                      <img src="https://i.ibb.co/gZxp3Dwz/Screenshot-1.png" alt="Thalyson Santos, São Paulo - Bela Vista" className="w-full h-full object-cover rounded-xl" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-display font-bold text-xl mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Thalyson</h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{T.specialist}</p>
                    <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.choose_sub}</p>
                  </div>
                </article>

                <article className={`p-5 rounded-3xl border ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-5 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? 'bg-amber-900/30 text-amber-500 border border-amber-900/50' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                        <Icon name="award" size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.level_label}</h3>
                        <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{getCurrentLevelTitle()}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-display font-bold text-2xl text-blue-500">{user.xp}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-widest block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.level_current}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className={`flex justify-between text-[10px] uppercase font-bold tracking-widest mb-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      <span>{T.level_journey}</span>
                      <span>{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${getCurrentLevelProgress()}%` }} />
                    </div>
                  </div>
                </article>
              </div>

              <nav aria-label="Tipos de agendamento" className={`flex p-1.5 rounded-2xl border w-full sm:w-fit mx-auto ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                {[ { id: 'single', label: T.tab_single, icon: 'user' }, { id: 'packs', label: T.tab_packs, icon: 'package' } ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} aria-pressed={activeTab === tab.id}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 min-h-[44px] ${activeTab === tab.id
                      ? tab.id === 'packs' ? 'bg-amber-500 text-amber-950 shadow-md' : 'bg-blue-600 text-white shadow-md'
                      : isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                    <Icon name={tab.icon} size={16} className="shrink-0" />
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div className="tab-content">
                {activeTab === 'single' ? (
                  <div className="space-y-8">
                    {categoryConfig.map(cat => {
                      const services = DATA.services.filter((s: ServiceItem) => s.category === cat.id);
                      if (!services.length) return null;
                      const cfg = CATEGORY_CONFIG[cat.id];
                      return (
                        <section key={cat.id} className="rounded-3xl border overflow-hidden" style={{ borderColor: cfg.borderColor, background: isDark ? cfg.bg : cfg.lightBg }}>
                          <div className="px-4 py-4 flex items-center gap-3 border-b" style={{ borderColor: cfg.borderColor }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
                              <Icon name={cat.icon} size={20} style={{ color: cfg.color }} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h2 className={`font-display font-bold text-lg mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.title}</h2>
                              <p className={`text-xs font-medium ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{cat.desc}</p>
                            </div>
                          </div>
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {services.map((s: ServiceItem) => (
                              <ServiceCard key={s.id} service={s} isInCart={booking.cart.some(c => c.id === s.id)} onToggle={handleToggleCartItem} isDark={isDark} T={T} lang={lang} onOpenModal={setSelectedServiceForModal} />
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DATA.plans.map((s: ServiceItem) => (
                      <ServiceCard key={s.id} service={s} isInCart={booking.cart.some(c => c.id === s.id)} onToggle={handleToggleCartItem} isDark={isDark} T={T} lang={lang} isPack={true} onOpenModal={setSelectedServiceForModal} />
                    ))}
                  </div>
                )}
              </div>

              <section className={`py-10 border-t border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`font-display font-bold text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.reviews_title}</h2>
                  <div className="flex gap-2 shrink-0">
                    {['chevron-left', 'chevron-right'].map((dir, i) => (
                      <button key={dir} onClick={() => reviewScrollRef.current?.scrollBy({ left: i === 0 ? -260 : 260, behavior: 'smooth' })} className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800 shadow-sm'}`}>
                        <Icon name={dir} size={18} />
                      </button>
                    ))}
                  </div>
                </div>
                <div ref={reviewScrollRef} className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
                  {DATA.reviews.map((r: Review, i: number) => (
                    <div key={i} className="snap-center shrink-0 w-[80vw] sm:w-[320px] h-auto">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </section>

              <section className="pb-6">
                <h2 className={`font-display font-bold text-2xl text-center mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.faq_title}</h2>
                <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className={`px-5 divide-y ${isDark ? 'divide-zinc-800' : 'divide-slate-100'}`}>
                    {DATA.faq.map((item: any, idx: number) => <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />)}
                  </div>
                </div>
              </section>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 1 — WHERE
          ═══════════════════════════════════════════════════════ */}
          {step === 1 && (
            <section className="animate-fade-up max-w-xl mx-auto space-y-8">
              <header className="text-center">
                <h2 className={`font-display font-bold text-3xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.location_title}</h2>
              </header>

              <div className="grid grid-cols-3 gap-3">
                {[ { id: 'home', label: T.loc_home, icon: 'home' }, { id: 'motel', label: T.loc_motel, icon: 'bed' }, { id: 'hotel', label: T.loc_hotel, icon: 'building' } ].map(x => (
                  <button key={x.id} onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))} aria-pressed={booking.locationType === x.id}
                    className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all border text-center min-h-[96px] ${booking.locationType === x.id ? 'bg-blue-600 border-blue-500 text-white shadow-md' : isDark ? 'bg-[#181c25] border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'}`}>
                    <Icon name={x.icon} size={24} />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">{x.label}</span>
                  </button>
                ))}
              </div>

              <article className={`p-5 sm:p-8 rounded-3xl border space-y-6 ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={(e: any) => setUser(u => ({ ...u, name: sanitizeInput(e.target.value) }))} icon="user" placeholder={lang === 'en' ? "Your name" : "Como quer ser chamado?"} hasError={hasErrorGlobal && (!user.name || String(user.name).trim().length < 3)} />

                {booking.locationType === 'home' && (
                  <div className="space-y-5 animate-fade-up">
                    <InputField isDark={isDark} label={T.input_cep} value={booking.address.cep || ''} onChange={handleCepChange} icon="map-pin" placeholder="00000-000" type="tel" maxLength={9} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.street} />
                    <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "Street / Avenue" : "Rua / Avenida"} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.street} />
                    <InputField isDark={isDark} label={T.input_num} value={booking.address.number} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: sanitizeInput(e.target.value) } }))} placeholder="Número" type="tel" hasError={hasErrorGlobal && !booking.address.number} />
                    <InputField isDark={isDark} label={T.input_district} value={booking.address.district} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "Neighborhood" : "Bairro"} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.district} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "City" : "Cidade"} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.city} />
                    <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "Apt (Optional)" : "Complemento (Opcional)"} />
                  </div>
                )}

                {booking.locationType === 'hotel' && (
                  <div className="space-y-5 animate-fade-up">
                    <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: sanitizeInput(e.target.value) } }))} icon="building" placeholder={lang === 'en' ? "Hotel name" : "Nome do Hotel"} hasError={hasErrorGlobal && !booking.address.placeName} />
                    <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "City" : "Cidade"} hasError={hasErrorGlobal && !booking.address.city} />
                    <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: sanitizeInput(e.target.value) } }))} placeholder={lang === 'en' ? "Room Nº" : "Nº do Quarto"} />
                  </div>
                )}

                {booking.locationType === 'motel' && (
                  <div className={`p-5 rounded-2xl border flex items-start gap-4 animate-fade-up ${isDark ? 'bg-pink-900/10 border-pink-900/30' : 'bg-pink-50 border-pink-100'}`}>
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600'}`}>
                      <Icon name="heart" size={20} />
                    </div>
                    <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.motel_note}</p>
                  </div>
                )}
              </article>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 2 — WHEN
          ═══════════════════════════════════════════════════════ */}
          {step === 2 && (
            <section className="animate-fade-up max-w-2xl mx-auto space-y-8">
              <header className="text-center">
                <h2 className={`font-display font-bold text-3xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.select_time_title}</h2>
              </header>

              <div className="relative w-full">
                <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-xl border transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'} shadow-md`}><Icon name="chevron-left" size={20} /></button>
                <div ref={dateScrollRef} className="flex gap-3 overflow-x-auto snap-x py-2 scrollbar-hide w-full">
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const mo = d.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { month: 'short' }).replace('.', '');
                    return (
                      <button key={idx} onClick={() => { setBooking(b => ({ ...b, date: d.toISOString(), time: null })); vibrate(30); }} aria-pressed={isSel}
                        className={`snap-center shrink-0 w-20 min-h-[90px] py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${isSel ? 'bg-blue-600 border-blue-500 text-white shadow-md' : isDark ? 'bg-[#181c25] border-zinc-800 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSel ? 'text-blue-200' : ''}`}>{mo}</span>
                        <span className={`font-display text-2xl font-bold leading-none ${isSel ? 'text-white' : isDark ? 'text-zinc-200' : 'text-slate-900'}`}>{d.getDate()}</span>
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${isSel ? 'text-blue-200' : ''}`}>{getDayLabel(d)}</span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-xl border transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'} shadow-md`}><Icon name="chevron-right" size={20} /></button>
              </div>

              {!booking.date && (
                <div className={`text-center py-16 rounded-3xl border border-dashed flex flex-col items-center gap-4 ${hasErrorGlobal ? 'animate-shake' : ''} ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-slate-300 text-slate-500'}`}>
                  <Icon name="calendar" size={32} />
                  <p className="text-sm font-bold uppercase tracking-widest">{T.empty_date}</p>
                </div>
              )}

              {booking.date && generateTimeSlots.length > 0 && (
                <div className={`space-y-6 animate-fade-up ${hasErrorGlobal && !booking.time ? 'animate-shake' : ''}`}>
                  {[
                    { key: 'morning', label: T.morning, icon: 'sunrise', slots: groupedTimeSlots.morning },
                    { key: 'afternoon', label: T.afternoon, icon: 'sun', slots: groupedTimeSlots.afternoon },
                    { key: 'evening', label: T.evening, icon: 'sunset', slots: groupedTimeSlots.evening },
                  ].filter(g => g.slots.length > 0).map(group => (
                    <div key={group.key} className={`p-5 rounded-3xl border ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-100 shadow-sm'}`}>
                      <div className={`flex items-center gap-2 mb-4 text-[10px] uppercase font-bold tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        <Icon name={group.icon} size={16} className="shrink-0" />
                        {group.label}
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {group.slots.map(t => {
                          const isRush = RUSH_HOURS.includes(t) && booking.locationType !== 'motel';
                          const isSel = booking.time === t;
                          return (
                            <button key={t} onClick={() => { setBooking(b => ({ ...b, time: t })); vibrate(30); }} aria-pressed={isSel}
                              className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-xl border text-sm font-bold transition-all min-h-[56px] w-full ${isSel
                                ? isRush ? 'bg-amber-500 border-amber-500 text-amber-950 shadow-md' : 'bg-blue-600 border-blue-500 text-white shadow-md'
                                : isDark
                                  ? isRush ? 'bg-amber-900/20 border-amber-800/50 text-amber-500' : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                                  : isRush ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'}`}>
                              {t}
                              {isRush && <span className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${isSel ? 'text-amber-900' : isDark ? 'text-amber-500' : 'text-amber-600'}`}>+{formatMoney(RUSH_FEE, lang).replace('R$ ', 'R$')}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {Object.values(groupedTimeSlots).flat().some(t => RUSH_HOURS.includes(t)) && booking.locationType !== 'motel' && (
                    <div className={`flex items-start gap-3 p-4 rounded-2xl border text-xs font-bold ${isDark ? 'bg-amber-900/10 border-amber-800/40 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                      <Icon name="alert-circle" size={18} className="shrink-0" />
                      <p>{lang === 'en' ? 'Rush hour slots include a small displacement fee.' : 'Horários de pico possuem pequena taxa de deslocamento.'}</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 3 — SUMMARY & PAYMENT
          ═══════════════════════════════════════════════════════ */}
          {step === 3 && (
            <section className="animate-fade-up space-y-6 max-w-2xl mx-auto">
              <SmartTimer isDark={isDark} text={T.timer_text} />

              <article className={`p-5 sm:p-6 rounded-3xl border ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`font-display font-bold text-xl mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.extras_title}</h3>
                <p className={`text-xs font-medium mb-5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{lang === 'en' ? 'Optional add-ons.' : 'Deseja adicionar algo extra?'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DATA.extras.map((ex: any) => {
                    const price = booking.cart.some(i => i.type === 'pack') ? Math.floor(ex.price * 0.8) : ex.price;
                    const isActive = booking.extras[ex.id];
                    return (
                      <button key={ex.id} onClick={() => { setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } })); vibrate(30); }}
                        className={`flex items-start p-4 rounded-2xl border text-left cursor-pointer transition-all gap-3 ${isActive ? isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200' : isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                        <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${isActive ? 'bg-blue-500 text-white' : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-white border border-slate-200 text-slate-500'}`}>
                          <Icon name={ex.icon} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${isActive ? isDark ? 'text-blue-400' : 'text-blue-700' : isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{ex.label}</p>
                          <span className={`text-[10px] font-bold mt-1 inline-block ${isActive ? isDark ? 'text-blue-300' : 'text-blue-600' : isDark ? 'text-zinc-400' : 'text-slate-600'}`}>+{formatMoney(price, lang)}</span>
                        </div>
                      </button>
                    );
                  })}
                  
                  {/* CAMPO DE EXTRA PERSONALIZADO */}
                  <div className="col-span-1 sm:col-span-2 mt-2">
                    <InputField
                      isDark={isDark}
                      label={lang === 'en' ? "Custom Request (+150.00)" : "Pedido Especial (+R$ 150,00)"}
                      value={booking.customExtraText}
                      onChange={(e: any) => setBooking(b => ({ ...b, customExtraText: e.target.value }))}
                      icon="plus"
                      placeholder={lang === 'en' ? "What else do you want to add?" : "O que mais você deseja adicionar?"}
                    />
                  </div>
                </div>
              </article>

              <article className={`p-5 sm:p-6 rounded-3xl border ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`font-display font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.coupon_section}</h3>

               {/* CAMPO DE CUPOM MANUAL */}
                <div className="flex items-center gap-2 mb-5">
                  <input
                    type="text"
                    placeholder={lang === 'en' ? "Have a code?" : "Tem um código?"}
                    value={manualCoupon}
                    onChange={(e) => setManualCoupon(e.target.value.toUpperCase())}
                    className={`flex-1 font-bold rounded-xl px-4 h-[44px] text-sm outline-none border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'}`}
                  />
                  <Button onClick={() => {
                    if (manualCoupon === 'RETORNO10') {
                      setBooking(b => ({ ...b, appliedCoupon: { id: 'manual', val: 0, title: '10% OFF (Retorno)', code: 'RETORNO10' } }));
                      addToast(T.toast_coupon_success);
                      setManualCoupon('');
                    } else {
                      addToast(T.toast_coupon_invalid, 'error');
                    }
                  }} size="sm" variant="primary" className="!w-auto !h-[44px] !px-4 !flex-none">
                    {lang === 'en' ? "Apply" : "Aplicar"}
                  </Button>
                </div>

                {user.coupons.length > 0 ? (
                  <div className="space-y-3">
                    {user.coupons.map(c => (
                      <button key={c.id} onClick={() => { setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c })); vibrate(30); }}
                        className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${booking.appliedCoupon?.id === c.id ? isDark ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        <div className="flex items-center gap-3">
                          <Icon name="gift" size={20} className={booking.appliedCoupon?.id === c.id ? 'text-emerald-500' : isDark ? 'text-zinc-500' : 'text-slate-400'} />
                          <span className="text-sm font-bold truncate">{c.title}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${booking.appliedCoupon?.id === c.id ? 'bg-emerald-500 border-emerald-500 text-white' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                          {booking.appliedCoupon?.id === c.id && <Icon name="check" size={12} />}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className={`p-4 rounded-2xl border border-dashed text-center text-xs font-bold ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-slate-300 text-slate-500'}`}>
                    {T.coupon_empty}
                  </div>
                )}
              </article>

              <article className={`p-5 sm:p-6 rounded-3xl border ${hasErrorGlobal && !booking.payment ? 'animate-shake' : ''} ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h4 className={`font-display font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.payment_title}</h4>
                <div className="space-y-3">
                  {[ { id: 'pix', label: T.pay_pix, icon: 'smartphone' }, { id: 'card', label: T.pay_card, icon: 'credit-card' }, { id: 'money', label: T.pay_cash, icon: 'banknote' } ].map(p => (
                    <button key={p.id} onClick={() => { setBooking(b => ({ ...b, payment: p.id })); vibrate(30); if (p.id === 'pix') { navigator.clipboard.writeText(CONFIG.PIX_KEY); addToast(T.toast_pix_copied); } }}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${booking.payment === p.id ? 'bg-blue-600 border-blue-500 text-white shadow-md' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'}`}>
                      <Icon name={p.icon} size={20} className="shrink-0" />
                      <span className="flex-1 text-left text-sm font-bold">{p.label}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${booking.payment === p.id ? 'border-white' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                        {booking.payment === p.id && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  ))}
                </div>
              </article>

              <article className={`p-5 sm:p-6 rounded-3xl border ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className={`font-display font-bold text-xl mb-5 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <Icon name="file-text" size={20} className={isDark ? 'text-zinc-400' : 'text-slate-500'} /> {T.summary_title}
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className={`text-[10px] uppercase font-bold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.summary_items}</p>
                    <div className="space-y-2">
                      {booking.cart.map((item, i) => (
                        <div key={i} className={`flex justify-between items-center text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                          <span className="truncate pr-4">{item.title}</span>
                          <span className="shrink-0">{formatMoney(item.price, lang)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(Object.keys(booking.extras || {}).filter(k => booking.extras[k]).length > 0 || (booking.customExtraText || '').trim().length > 0) && (
                    <div className={`border-t pt-4 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                      <p className={`text-[10px] uppercase font-bold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.summary_extras}</p>
                      <div className="space-y-2">
                        {Object.keys(booking.extras || {}).filter(k => booking.extras[k]).map(k => {
                          const ex = DATA.extras.find((e: any) => e.id === k);
                          if (!ex) return null;
                          const price = booking.cart.some(i => i.type === 'pack') ? Math.floor(ex.price * 0.8) : ex.price;
                          return (
                            <div key={k} className={`flex justify-between items-center text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                              <span className="truncate pr-4">{ex.label}</span>
                              <span className="shrink-0">+{formatMoney(price, lang)}</span>
                            </div>
                          );
                        })}
                        {(booking.customExtraText || '').trim().length > 0 && (
                           <div className={`flex justify-between items-center text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                             <span className="truncate pr-4">{lang === 'en' ? 'Custom Request' : 'Pedido Especial'}: {booking.customExtraText}</span>
                             <span className="shrink-0">+{formatMoney(150, lang)}</span>
                           </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={`border-t pt-4 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <p className={`text-[10px] uppercase font-bold tracking-widest mb-3 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.summary_info}</p>
                    <div className={`space-y-2 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                      <div className="flex items-center gap-2"><Icon name="calendar" size={16} className="text-blue-500" /> {booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : ''} {lang === 'en' ? 'at' : 'às'} {booking.time}</div>
                      <div className="flex items-center gap-2"><Icon name="map-pin" size={16} className="text-blue-500" /> {booking.locationType === 'home' ? T.summary_loc_home : booking.locationType === 'motel' ? T.summary_loc_motel : T.summary_loc_hotel}</div>
                      <div className="flex items-center gap-2"><Icon name="clock" size={16} className="text-blue-500" /> ~{financials.duration} min</div>
                    </div>
                  </div>

                  <div className={`border-t pt-4 space-y-2 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <div className={`flex justify-between items-center text-sm font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      <span>{T.subtotal}</span>
                      <span>{formatMoney(financials.sub, lang)}</span>
                    </div>
                    {booking.appliedCoupon && (
                      <div className="flex justify-between items-center text-sm font-bold text-emerald-500">
                        <span>{booking.appliedCoupon.title}</span>
                        <span>-{formatMoney(financials.disc, lang)}</span>
                      </div>
                    )}
                    {financials.pixDisc > 0 && (
                      <div className={`flex justify-between items-center text-sm font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        <span>{T.pix_discount}</span>
                        <span>-{formatMoney(financials.pixDisc, lang)}</span>
                      </div>
                    )}
                    {financials.rushFee > 0 && (
                      <div className="flex justify-between items-center text-sm font-bold text-amber-500">
                        <span>{T.msg_rush_fee}</span>
                        <span>+{formatMoney(financials.rushFee, lang)}</span>
                      </div>
                    )}
                    <div className={`flex justify-between items-end pt-4 mt-2 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                      <span className={`text-xs uppercase font-bold tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.total_label}</span>
                      <div className="text-right">
                        <p className="font-display font-bold text-3xl text-blue-500 leading-none">{formatMoney(financials.total, lang)}</p>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mt-1">+{estimatedXP} XP</p>
                      </div>
                    </div>
                  </div>
                  
                  {booking.locationType !== 'motel' && (
                    <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-bold border ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                      <Icon name="car" size={16} className="shrink-0" />
                      <span>{T.uber_notice}</span>
                    </div>
                  )}
                </div>
              </article>

              <article className={hasErrorGlobal && !booking.termsAccepted ? 'animate-shake' : ''}>
                <button onClick={() => setTermsOpen(true)} className={`w-full flex items-center justify-between p-5 rounded-3xl border transition-all gap-4 ${booking.termsAccepted ? isDark ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200' : isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${booking.termsAccepted ? isDark ? 'bg-emerald-900/40 text-emerald-500' : 'bg-emerald-100 text-emerald-600' : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon name="shield" size={24} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.terms_title}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.terms_read}</p>
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-white' : isDark ? 'border-zinc-700' : 'border-slate-300'}`}>
                    {booking.termsAccepted && <Icon name="check" size={16} />}
                  </div>
                </button>
              </article>
            </section>
          )}

          {/* ═══════════════════════════════════════════════════════
              STEP 4 — SUCCESS
          ═══════════════════════════════════════════════════════ */}
          {step === 4 && (
            <section className="min-h-[70vh] flex flex-col items-center justify-center text-center animate-scale-in max-w-sm mx-auto px-4">
              <div className="relative mb-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 ${isDark ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}>
                  <Icon name="check" size={40} className="text-emerald-500" />
                </div>
              </div>
              <h2 className={`font-display font-bold text-3xl mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h2>
              <p className={`text-sm font-medium mb-8 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.success_sub}</p>
              
              <div className="w-full space-y-4">
                <Button variant="whatsapp" size="lg" full icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>
                  {T.whatsapp_btn}
                </Button>
                <button onClick={() => { setStep(0); setBooking({ ...booking, cart: [], termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, customExtraText: '' }); }} className={`w-full text-xs font-bold uppercase tracking-widest py-4 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                  {T.back_home}
                </button>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ── STICKY BOTTOM NAV ── */}
      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed bottom-0 inset-x-0 p-3 sm:p-4 z-40 animate-slide-up pointer-events-none">
          <div className={`max-w-3xl mx-auto pointer-events-auto rounded-3xl overflow-hidden border shadow-2xl ${isDark ? 'bg-[#181c25]/95 backdrop-blur-xl border-zinc-800' : 'bg-white/95 backdrop-blur-xl border-slate-200'}`}>
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
              {step > 0 && (
                <button onClick={() => { setStep(s => s - 1); vibrate(30); }} className={`w-12 h-12 flex items-center justify-center rounded-xl border shrink-0 ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  <Icon name="chevron-left" size={20} />
                </button>
              )}
              <div className="flex-1 min-w-0 pl-1">
                <p className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-widest truncate ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {step === 0 ? `${booking.cart.length} ${T.items_selected}` : step === 3 ? T.total_label : T.subtotal}
                </p>
                <p className={`font-display font-bold text-xl sm:text-2xl leading-none truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {step === 3 ? formatMoney(financials.total, lang) : formatMoney(financials.sub, lang)}
                </p>
              </div>
              <button onClick={handleNextStep} className={`h-12 flex items-center gap-2 px-5 sm:px-6 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider shrink-0 transition-all ${isStepValid() ? step === 3 ? 'bg-[#25D366] text-white shadow-md' : 'bg-blue-600 text-white shadow-md' : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-400'}`}>
                {step === 3 ? (
                  <><Icon name="message" size={16} /> <span className="hidden sm:inline">{T.finish_btn}</span><span className="sm:hidden">{T.btn_finish_short}</span></>
                ) : (
                  <><span className="hidden sm:inline">{T.next_btn}</span><span className="sm:hidden">{T.btn_next_short}</span> <Icon name="chevron-right" size={16} /></>
                )}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* ── TERMS MODAL ── */}
      {termsOpen && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div role="dialog" aria-modal="true" className={`relative w-full max-w-lg max-h-[85vh] rounded-3xl flex flex-col border shadow-2xl animate-slide-up ${isDark ? 'bg-[#181c25] border-zinc-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between p-5 sm:p-6 border-b shrink-0 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <h3 className={`font-display font-bold text-xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.rules_complete}</h3>
              <button onClick={() => setTermsOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}>
                <Icon name="x" size={18} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4">
              {DATA.rules.map((rule: Rule, i: number) => <RuleItem key={i} rule={rule} isDark={isDark} />)}
            </div>
            <div className={`p-5 sm:p-6 border-t shrink-0 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <Button full size="lg" onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); vibrate(30); setTermsOpen(false); }}>{T.agree_terms}</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── LEVEL UP POPUP ── */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div role="dialog" aria-modal="true" className={`relative w-full max-w-sm rounded-3xl p-6 sm:p-8 text-center border shadow-2xl animate-scale-in ${isDark ? 'bg-[#181c25] border-amber-900/50' : 'bg-white border-amber-200'}`}>
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-amber-400 to-amber-600 text-amber-950 shadow-lg`}>
              <Icon name="trophy" size={32} />
            </div>
            <h3 className={`font-display font-bold text-3xl mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-sm font-medium leading-relaxed mb-6 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.levelup_popup_msg}</p>
            <Button full size="lg" variant="amber" onClick={() => { setLevelUpPopup(false); vibrate(50); }}>
              {T.level_redeem}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
